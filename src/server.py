from __future__ import annotations

import argparse
import base64
import copy
import hashlib
import json
import mimetypes
import os
import random
import re
import socket
import ssl
import struct
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import parse_qs, urlparse

from src.api.ledfx_client import LedFxApiError, LedFxClient
from src.generator.data_loader import load_profiles
from src.generator.name_utils import SCENE_TYPE_CODES, STYLE_CODES, compact_scene_name
from src.generator.palette_engine import PaletteEngine
from src.generator.parameter_randomizer import ParameterRandomizer
from src.generator.scene_generator import SceneGenerator
from src.models.scene import Scene, VirtualAssignment


ROOT = Path(__file__).resolve().parents[1]
UI_DIR = ROOT / "src" / "ui"
DATA_DIR = ROOT / "data"
SETTINGS_FILE = DATA_DIR / "settings.json"
EFFECT_FORGE_DIR = ROOT / "outputs" / "effect_forge"
COLOR_ROLES = ("low", "mid", "high", "accent", "dark", "strobe", "background")
HEX_COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")
MAX_GENERATE_COUNT = 250
MAX_SCENE_NAME = 48
MAX_EFFECT_DRAFT_CHARS = 240_000
VALID_SCENE_ACTIONS = {"activate", "ignore"}
DEFAULT_STYLE_PARAMS = {
    "count": 24,
    "energy": 0.65,
    "variation": 0.6,
    "brightness": 0.8,
    "movement": 0.55,
    "audio_response": 0.6,
    "density": 0.5,
    "flash": 0.45,
    "layout": "auto",
}


class LedFxWebSocketClient:
    def __init__(self, base_url: str, timeout: float = 8.0):
        parsed = urlparse(base_url)
        scheme = "wss" if parsed.scheme == "https" else "ws"
        port = parsed.port or (443 if scheme == "wss" else 80)
        self.url = f"{scheme}://{parsed.hostname}:{port}/api/websocket"
        self.host = parsed.hostname or "127.0.0.1"
        self.port = port
        self.scheme = scheme
        self.timeout = timeout
        self.sock: Optional[socket.socket] = None

    def __enter__(self) -> "LedFxWebSocketClient":
        raw_sock = socket.create_connection((self.host, self.port), timeout=self.timeout)
        if self.scheme == "wss":
            raw_sock = ssl.create_default_context().wrap_socket(raw_sock, server_hostname=self.host)
        raw_sock.settimeout(self.timeout)
        self.sock = raw_sock
        self._handshake()
        return self

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        self.close()

    def close(self) -> None:
        if not self.sock:
            return
        try:
            self.sock.close()
        finally:
            self.sock = None

    def send_json(self, payload: Dict[str, Any]) -> None:
        self._send_frame(json.dumps(payload, separators=(",", ":")).encode("utf-8"), opcode=0x1)

    def recv_json(self) -> Optional[Dict[str, Any]]:
        while True:
            opcode, payload = self._recv_frame()
            if opcode == 0x8:
                return None
            if opcode == 0x9:
                self._send_frame(payload, opcode=0xA)
                continue
            if opcode not in (0x1, 0x2):
                continue
            try:
                return json.loads(payload.decode("utf-8"))
            except json.JSONDecodeError:
                return None

    def _handshake(self) -> None:
        if not self.sock:
            raise LedFxApiError("LedFx websocket is not connected")
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        request = (
            "GET /api/websocket HTTP/1.1\r\n"
            f"Host: {self.host}:{self.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n"
            "Sec-WebSocket-Protocol: ws\r\n"
            "\r\n"
        ).encode("ascii")
        self.sock.sendall(request)
        response = b""
        while b"\r\n\r\n" not in response:
            chunk = self.sock.recv(4096)
            if not chunk:
                break
            response += chunk
            if len(response) > 16384:
                break
        header = response.decode("iso-8859-1", errors="replace")
        status_line = header.split("\r\n", 1)[0]
        if " 101 " not in f" {status_line} ":
            raise LedFxApiError(f"LedFx websocket handshake failed: {status_line or 'no response'}")
        accept = ""
        for line in header.split("\r\n")[1:]:
            name, _, value = line.partition(":")
            if name.lower() == "sec-websocket-accept":
                accept = value.strip()
                break
        expected = base64.b64encode(
            hashlib.sha1((key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode("ascii")).digest()
        ).decode("ascii")
        if accept and accept != expected:
            raise LedFxApiError("LedFx websocket handshake returned an invalid accept key")

    def _send_frame(self, payload: bytes, opcode: int) -> None:
        if not self.sock:
            raise LedFxApiError("LedFx websocket is not connected")
        header = bytearray([0x80 | opcode])
        length = len(payload)
        if length < 126:
            header.append(0x80 | length)
        elif length <= 0xFFFF:
            header.append(0x80 | 126)
            header.extend(struct.pack("!H", length))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack("!Q", length))
        mask = os.urandom(4)
        masked = bytes(byte ^ mask[index % 4] for index, byte in enumerate(payload))
        self.sock.sendall(bytes(header) + mask + masked)

    def _recv_frame(self) -> tuple[int, bytes]:
        header = self._read_exact(2)
        first, second = header[0], header[1]
        opcode = first & 0x0F
        length = second & 0x7F
        masked = bool(second & 0x80)
        if length == 126:
            length = struct.unpack("!H", self._read_exact(2))[0]
        elif length == 127:
            length = struct.unpack("!Q", self._read_exact(8))[0]
        mask = self._read_exact(4) if masked else b""
        payload = self._read_exact(length) if length else b""
        if masked:
            payload = bytes(byte ^ mask[index % 4] for index, byte in enumerate(payload))
        return opcode, payload

    def _read_exact(self, length: int) -> bytes:
        if not self.sock:
            raise LedFxApiError("LedFx websocket is not connected")
        chunks = bytearray()
        while len(chunks) < length:
            chunk = self.sock.recv(length - len(chunks))
            if not chunk:
                raise LedFxApiError("LedFx websocket closed unexpectedly")
            chunks.extend(chunk)
        return bytes(chunks)


class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True


class AppState:
    def __init__(self, ledfx_url: str):
        self.settings = self._load_settings(ledfx_url)
        self.client = LedFxClient(self.settings["ledfx_url"])
        self.profiles = load_profiles(DATA_DIR)
        self.generated: Dict[str, Scene] = {}
        self.order: List[str] = []
        self.last_options: Dict[str, Any] = {}
        self.last_similarity_report: Dict[str, Any] = {}
        self.preview_snapshot: Optional[Dict[str, Dict[str, Any]]] = None

    def connection_public(self) -> Dict[str, Any]:
        return {"ledfx_url": self.client.base_url}

    def visualisation_stream(self, vis_id: str):
        subscribe_id = random.randint(1000, 999999)
        with LedFxWebSocketClient(self.client.base_url, timeout=8.0) as websocket:
            websocket.send_json(
                {
                    "id": subscribe_id,
                    "type": "subscribe_event",
                    "event_type": "visualisation_update",
                    "event_filter": {"vis_id": vis_id},
                }
            )
            while True:
                message = websocket.recv_json()
                if message is None:
                    return
                if message.get("success") is False:
                    yield {"stream_error": message.get("message") or message.get("error") or "LedFx stream error"}
                    return
                if (
                    message.get("type") == "event"
                    and message.get("event_type") == "visualisation_update"
                    and message.get("vis_id") == vis_id
                ):
                    yield message

    def update_connection(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        ledfx_url = self._sanitize_ledfx_url(payload.get("ledfx_url"))
        self.client = LedFxClient(ledfx_url)
        self.settings["ledfx_url"] = ledfx_url
        self._write_settings()
        info = self.client.get_info()
        return {"ledfx_url": ledfx_url, "info": info}

    def discovery_public(self) -> Dict[str, Any]:
        info = self.client.get_info()
        schema = self.client.get_schema()
        config = self.client.get_config()
        virtuals_data = self.client.get_virtuals()
        scenes_data = self.client.get_scenes()
        virtuals = []
        for virtual_id, item in (virtuals_data.get("virtuals") or {}).items():
            cfg = item.get("config") or {}
            effect = item.get("effect") or {}
            effect_config = effect.get("config") or {}
            if not isinstance(effect_config, dict):
                effect_config = {}
            virtuals.append(
                {
                    "id": virtual_id,
                    "name": cfg.get("name") or virtual_id,
                    "pixel_count": item.get("pixel_count"),
                    "active": bool(item.get("active")),
                    "is_device": bool(item.get("is_device")),
                    "effect_type": effect.get("type"),
                    "effect": {
                        "type": effect.get("type"),
                        "config": copy.deepcopy(effect_config),
                    },
                }
            )
        non_devices = [item["id"] for item in virtuals if not item["is_device"]]
        scene_types = [
            {
                "id": scene_type,
                "label": scene_type,
                "description": meta.get("description", ""),
                "energy": meta.get("energy", []),
            }
            for scene_type, meta in self.profiles["styles"].get("scene_types", {}).items()
        ]
        return {
            "connected": True,
            "info": info,
            "effect_count": len(schema.get("effects", {})),
            "preset_effect_count": len(config.get("ledfx_presets", {})),
            "scene_count": len(scenes_data.get("scenes", {})),
            "virtuals": virtuals,
            "default_virtual_ids": non_devices or [item["id"] for item in virtuals],
            "palettes": self.profiles["palettes"].get("palettes", []),
            "styles": self.profiles["styles"].get("styles", {}),
            "scene_types": scene_types,
            "layouts": self.profiles["styles"].get("layouts", []),
            "layout_descriptions": self.profiles["styles"].get("layout_descriptions", {}),
            "effect_schemas": self._effect_schemas_public(schema),
            "presets": self._presets_public(config),
            "connection": self.connection_public(),
        }

    @staticmethod
    def _effect_schemas_public(schema: Dict[str, Any]) -> Dict[str, Any]:
        public: Dict[str, Any] = {}
        for effect_id, effect_schema in (schema.get("effects") or {}).items():
            properties = (
                effect_schema.get("schema", {})
                .get("properties", {})
            )
            public_props: Dict[str, Any] = {}
            for key, prop in properties.items():
                if not isinstance(prop, dict):
                    continue
                clean: Dict[str, Any] = {}
                for field in ("type", "enum", "minimum", "maximum", "default", "gradient"):
                    if field in prop:
                        clean[field] = prop[field]
                if clean:
                    public_props[key] = clean
            public[effect_id] = {"properties": public_props}
        return public

    @staticmethod
    def _presets_public(config: Dict[str, Any]) -> Dict[str, Any]:
        by_effect: Dict[str, List[Dict[str, Any]]] = {}
        total = 0
        for category, source in (("ledfx_presets", "LedFx"), ("user_presets", "User")):
            for effect_id, presets in (config.get(category) or {}).items():
                if not isinstance(presets, dict):
                    continue
                effect_items = by_effect.setdefault(str(effect_id), [])
                for preset_id, preset in presets.items():
                    if not isinstance(preset, dict):
                        continue
                    config_data = preset.get("config") or {}
                    if not isinstance(config_data, dict):
                        config_data = {}
                    effect_items.append(
                        {
                            "id": str(preset_id),
                            "name": str(preset.get("name") or preset_id),
                            "effect_type": str(effect_id),
                            "category": category,
                            "source": source,
                            "editable": category == "user_presets",
                            "config": copy.deepcopy(config_data),
                            "param_count": len(config_data),
                        }
                    )
                    total += 1
        for presets in by_effect.values():
            presets.sort(
                key=lambda item: (
                    item["category"] != "user_presets",
                    item["name"].lower(),
                    item["id"],
                )
            )
        return {"by_effect": by_effect, "count": total}

    def _generator(self) -> SceneGenerator:
        schema = self.client.get_schema()
        config = self.client.get_config()
        return SceneGenerator(
            effects_data=self.profiles["effects"],
            palettes_data=self.profiles["palettes"],
            styles_data=self.profiles["styles"],
            schema=schema,
            ledfx_config=config,
        )

    def generate(self, options: Dict[str, Any]) -> Dict[str, Any]:
        options = self._normalize_options(options)
        generator = self._generator()
        scenes = generator.generate_batch(options)
        report = generator.similarity_report(scenes)
        self.generated = {scene.id: scene for scene in scenes}
        self.order = [scene.id for scene in scenes]
        self.last_options = dict(options)
        self.last_similarity_report = report
        return {
            "scenes": [scene.to_public_dict() for scene in scenes],
            "similarity_report": report,
            "preset_errors": [],
        }

    def regenerate(self, scene_id: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        base_options = dict(self.last_options)
        if options:
            base_options.update(options)
        base_options["count"] = 1
        existing = [
            scene
            for sid, scene in self.generated.items()
            if sid != scene_id and not scene.deleted
        ]
        base_options["existing_scenes"] = existing
        generator = self._generator()
        replacement = generator.generate_batch(self._normalize_options(base_options))[0]
        old_index = self.order.index(scene_id) if scene_id in self.order else len(self.order)
        if scene_id in self.generated:
            self.generated[scene_id].deleted = True
            self.generated[scene_id].kept = False
        self.generated[replacement.id] = replacement
        if scene_id in self.order:
            self.order[old_index] = replacement.id
        else:
            self.order.append(replacement.id)
        active_scenes = [
            self.generated[sid]
            for sid in self.order
            if sid in self.generated and not self.generated[sid].deleted
        ]
        self.last_similarity_report = generator.similarity_report(active_scenes)
        return {
            "scene": replacement.to_public_dict(),
            "similarity_report": self.last_similarity_report,
            "preset_errors": [],
        }

    def set_kept(self, scene_id: str, kept: bool) -> Dict[str, Any]:
        scene = self._scene(scene_id)
        scene.kept = kept
        if kept:
            scene.deleted = False
        return {"scene": scene.to_public_dict()}

    def delete_generated(self, scene_id: str) -> Dict[str, Any]:
        scene = self._scene(scene_id)
        scene.deleted = True
        scene.kept = False
        return {"scene": scene.to_public_dict()}

    def generate_presets(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        schema = self.client.get_schema()
        schema_effects = schema.get("effects", {})
        config = self.client.get_config()
        effect_type = str(payload.get("effect_type") or "").strip()
        if not effect_type:
            raise ValueError("effect_type is required")
        self._validate_effect_type(effect_type, schema_effects)

        count = self._bounded_int(payload.get("count"), 4, 1, 50)
        energy = self._bounded_float(payload.get("energy"), 0.65)
        variation = self._bounded_float(payload.get("variation"), 0.6)
        name_prefix = str(payload.get("name_prefix") or "SLP").strip()[:18] or "SLP"
        base_preset_id = str(payload.get("base_preset_id") or "").strip()
        base_preset_category = str(payload.get("base_preset_category") or "").strip() or None
        if base_preset_id in ("", "__default__"):
            base_preset_id = ""
            base_preset_category = None

        presets = SceneGenerator._merged_presets(config)
        base_preset = None
        if base_preset_id:
            base_preset = self._preset_details(config, effect_type, base_preset_id, base_preset_category)
            if not base_preset:
                raise ValueError(f"Unknown preset for {effect_type}: {base_preset_id}")
            presets.setdefault(effect_type, {})[base_preset_id] = {
                "name": base_preset["name"],
                "config": copy.deepcopy(base_preset["config"]),
                "category": base_preset["category"],
            }

        rng = random.Random(payload.get("seed") or f"{effect_type}-{time.time()}")
        palette_ids = self._preset_palette_ids(payload)
        palette_order = list(palette_ids)
        if len(palette_order) > 1:
            rng.shuffle(palette_order)
        randomizer = ParameterRandomizer()
        profile = self._effect_profile(effect_type, schema_effects)
        drafts: List[Dict[str, Any]] = []
        for index in range(1, count + 1):
            palette_id = (
                "auto"
                if "auto" in palette_order
                else palette_order[(index - 1) % len(palette_order)]
            )
            palette = self._palette_for_id(palette_id, rng)
            choice = {
                "effect_type": effect_type,
                "profile": profile,
                "preset_id": base_preset_id or None,
                "preset_category": base_preset["category"] if base_preset else None,
            }
            scene_energy = self._bounded_float(
                rng.gauss(energy, 0.04 + variation * 0.12),
                energy,
            )
            config_data = randomizer.build_config(
                choice=choice,
                palette=palette,
                energy=scene_energy,
                schema_effects=schema_effects,
                ledfx_presets=presets,
                rng=rng,
                variation=variation,
            )
            preset_name = self._generated_preset_name(name_prefix, effect_type, palette, index)
            draft_id = f"draft-{effect_type}-{index}-{rng.randrange(100000, 999999)}"
            drafts.append(
                {
                    "draft_id": draft_id,
                    "id": self._ledfx_preset_id(preset_name),
                    "name": preset_name,
                    "effect_type": effect_type,
                    "category": "draft_presets",
                    "source": "Draft",
                    "editable": True,
                    "draft": True,
                    "config": copy.deepcopy(config_data),
                    "param_count": len(config_data),
                    "palette_id": str(palette.get("id") or "auto"),
                    "palette_name": str(palette.get("name") or palette.get("id") or "Palette"),
                }
            )

        return {
            "presets": drafts,
            "errors": [],
            "catalog": self._presets_public(config),
        }

    def _preset_palette_ids(self, payload: Dict[str, Any]) -> List[str]:
        raw_ids = payload.get("palette_ids")
        if isinstance(raw_ids, list):
            values = [str(item).strip() for item in raw_ids]
        else:
            values = [str(payload.get("palette_id") or "auto").strip()]
        available = {
            str(palette.get("id"))
            for palette in self.profiles["palettes"].get("palettes", [])
            if palette.get("id")
        }
        clean: List[str] = []
        for value in values:
            if not value:
                continue
            if value == "auto":
                return ["auto"]
            if value in available and value not in clean:
                clean.append(value)
        return clean or ["auto"]

    def send_preset_drafts(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        schema = self.client.get_schema()
        schema_effects = schema.get("effects", {})
        config = self.client.get_config()
        known_virtual_ids = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        virtual_id = str(payload.get("virtual_id") or "").strip() or self._first_virtual_id(known_virtual_ids)
        if not virtual_id or virtual_id not in set(known_virtual_ids):
            raise ValueError("Choose a LedFx device to write presets through")

        drafts = payload.get("presets") or []
        if not isinstance(drafts, list) or not drafts:
            raise ValueError("No preset drafts to send")

        snapshot = self.client.snapshot_effects([virtual_id])
        created: List[Dict[str, Any]] = []
        errors: List[Dict[str, str]] = []
        seen_ids: set[tuple[str, str]] = set()
        try:
            for draft in drafts:
                if not isinstance(draft, dict):
                    errors.append({"name": "invalid draft", "error": "Preset draft must be an object"})
                    continue
                effect_type = str(draft.get("effect_type") or "").strip()
                name = str(draft.get("name") or draft.get("id") or "").strip()[:64]
                if not effect_type or not name:
                    errors.append({"name": name or "unnamed", "error": "effect_type and name are required"})
                    continue
                try:
                    self._validate_effect_type(effect_type, schema_effects)
                    preset_id = self._ledfx_preset_id(name)
                    key = (effect_type, preset_id)
                    user_presets = (config.get("user_presets") or {}).get(effect_type, {})
                    if key in seen_ids or preset_id in user_presets:
                        raise ValueError(f'User preset "{name}" already exists for {effect_type}')
                    config_data = draft.get("config") or {}
                    if not isinstance(config_data, dict):
                        raise ValueError("config must be an object")
                    base_config = self._default_effect_config(effect_type, schema_effects)
                    base_config.update(copy.deepcopy(config_data))
                    next_config = self._sanitize_config_update(base_config, config_data)
                    self.client.set_virtual_effect(
                        VirtualAssignment(
                            virtual_id=virtual_id,
                            effect_type=effect_type,
                            config=next_config,
                            preset=None,
                            preset_category=None,
                        )
                    )
                    response = self.client.save_active_effect_as_preset(virtual_id, name)
                    preset = self._extract_preset(response)
                    saved_config = copy.deepcopy(preset.get("config") or next_config)
                    saved_id = str(preset.get("id") or preset_id)
                    created.append(
                        {
                            "draft_id": str(draft.get("draft_id") or ""),
                            "id": saved_id,
                            "name": str(preset.get("name") or name),
                            "effect_type": effect_type,
                            "category": "user_presets",
                            "source": "User",
                            "editable": True,
                            "config": saved_config,
                            "param_count": len(saved_config),
                        }
                    )
                    config.setdefault("user_presets", {}).setdefault(effect_type, {})[saved_id] = {
                        "name": name,
                        "config": saved_config,
                    }
                    seen_ids.add((effect_type, saved_id))
                except Exception as exc:
                    errors.append({"name": name or "unnamed", "error": str(exc)})
        finally:
            try:
                self.client.restore_snapshot(snapshot)
            except Exception as exc:
                errors.append({"name": "restore", "error": str(exc)})

        return {
            "presets": created,
            "errors": errors,
            "catalog": self._presets_public(self.client.get_config()),
        }

    def delete_preset(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        effect_type = str(payload.get("effect_type") or "").strip()
        preset_id = str(payload.get("preset_id") or "").strip()
        category = str(payload.get("category") or "user_presets").strip()
        if category != "user_presets":
            raise ValueError("Only LedFx user presets can be deleted")
        if not effect_type or not preset_id:
            raise ValueError("effect_type and preset_id are required")
        response = self.client.delete_effect_preset(effect_type, preset_id, category=category)
        return {
            "effect_type": effect_type,
            "preset_id": preset_id,
            "response": response,
            "catalog": self._presets_public(self.client.get_config()),
        }

    def update_preset(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        effect_type = str(payload.get("effect_type") or "").strip()
        preset_id = str(payload.get("preset_id") or "").strip()
        category = str(payload.get("category") or "user_presets").strip()
        name = str(payload.get("name") or "").strip()[:64]
        if category != "user_presets":
            raise ValueError("Only LedFx user presets can be edited")
        if not effect_type or not preset_id:
            raise ValueError("effect_type and preset_id are required")
        if not name:
            raise ValueError("Preset name is required")

        schema_effects = self.client.get_schema().get("effects", {})
        self._validate_effect_type(effect_type, schema_effects)
        config = self.client.get_config()
        preset = self._preset_details(config, effect_type, preset_id, "user_presets")
        if not preset:
            raise ValueError(f"Unknown user preset for {effect_type}: {preset_id}")

        next_id = self._ledfx_preset_id(name)
        user_presets = (config.get("user_presets") or {}).get(effect_type, {})
        if next_id != preset_id and next_id in user_presets:
            raise ValueError(f'User preset "{name}" already exists for {effect_type}')

        config_update = payload.get("config") or {}
        if not isinstance(config_update, dict):
            raise ValueError("config must be an object")
        base_config = self._default_effect_config(effect_type, schema_effects)
        base_config.update(copy.deepcopy(preset["config"]))
        next_config = self._sanitize_config_update(base_config, config_update)

        known_virtual_ids = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        virtual_id = str(payload.get("virtual_id") or "").strip() or self._first_virtual_id(known_virtual_ids)
        if not virtual_id or virtual_id not in set(known_virtual_ids):
            raise ValueError("Choose a LedFx device to write presets through")

        snapshot = self.client.snapshot_effects([virtual_id])
        try:
            self.client.set_virtual_effect(
                VirtualAssignment(
                    virtual_id=virtual_id,
                    effect_type=effect_type,
                    config=next_config,
                    preset=None,
                    preset_category=None,
                )
            )
            response = self.client.save_active_effect_as_preset(virtual_id, name)
            saved = self._extract_preset(response)
            saved_id = str(saved.get("id") or next_id)
            if saved_id != preset_id:
                self.client.delete_effect_preset(effect_type, preset_id, category="user_presets")
        finally:
            self.client.restore_snapshot(snapshot)

        return {
            "effect_type": effect_type,
            "preset_id": next_id,
            "response": response,
            "catalog": self._presets_public(self.client.get_config()),
        }

    def preview_preset(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        schema_effects = self.client.get_schema().get("effects", {})
        config = self.client.get_config()
        effect_type = str(payload.get("effect_type") or "").strip()
        if not effect_type:
            raise ValueError("effect_type is required")
        self._validate_effect_type(effect_type, schema_effects)

        known_virtual_ids = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        virtual_id = str(payload.get("virtual_id") or "").strip() or self._first_virtual_id(known_virtual_ids)
        if not virtual_id or virtual_id not in set(known_virtual_ids):
            raise ValueError("Choose a LedFx device for preview")

        preset_id = str(payload.get("preset_id") or "").strip()
        category = str(payload.get("category") or "").strip() or None
        preset = self._preset_details(config, effect_type, preset_id, category) if preset_id else None
        config_update = payload.get("config") or {}
        if not isinstance(config_update, dict):
            raise ValueError("config must be an object")

        base_config = self._default_effect_config(effect_type, schema_effects)
        if preset:
            base_config.update(copy.deepcopy(preset["config"]))
        next_config = self._sanitize_config_update(base_config, config_update)

        if self.preview_snapshot:
            self.client.restore_snapshot(self.preview_snapshot)
            self.preview_snapshot = None
        self.preview_snapshot = self.client.snapshot_effects([virtual_id])
        try:
            self.client.set_virtual_effect(
                VirtualAssignment(
                    virtual_id=virtual_id,
                    effect_type=effect_type,
                    config=next_config,
                    preset=None,
                    preset_category=None,
                )
            )
        except Exception:
            if self.preview_snapshot:
                self.client.restore_snapshot(self.preview_snapshot)
                self.preview_snapshot = None
            raise
        return {
            "ok": True,
            "virtual_id": virtual_id,
            "effect_type": effect_type,
            "name": str(payload.get("name") or (preset or {}).get("name") or preset_id or effect_type),
        }

    def _create_scene_presets(self, scenes: List[Scene], options: Dict[str, Any]) -> List[Dict[str, str]]:
        mode = options.get("preset_mode")
        if mode not in ("mixed", "generate"):
            return []
        assignments = [
            assignment
            for scene in scenes
            for assignment in scene.assignments
            if (
                assignment.effect_type
                and assignment.action != "ignore"
                and not (assignment.preset and assignment.preset_category == "user_presets")
            )
        ]
        if not assignments:
            return []
        virtual_ids = self._ordered_unique_ids([assignment.virtual_id for assignment in assignments])
        snapshot = self.client.snapshot_effects(virtual_ids)
        errors: List[Dict[str, str]] = []
        try:
            for scene in scenes:
                for assignment in scene.assignments:
                    if not assignment.effect_type or assignment.action == "ignore":
                        continue
                    if mode == "mixed" and not self._should_create_scene_preset(scene, assignment):
                        continue
                    preset_name = self._scene_preset_name(scene, assignment)
                    try:
                        self.client.set_virtual_effect(assignment)
                        response = self.client.save_active_effect_as_preset(assignment.virtual_id, preset_name)
                        preset = self._extract_preset(response)
                        assignment.preset = str(preset.get("id") or self._slug(preset_name))
                        assignment.preset_category = "user_presets"
                        if isinstance(preset.get("config"), dict):
                            assignment.config = copy.deepcopy(preset["config"])
                    except Exception as exc:
                        errors.append({"scene": scene.name, "effect": assignment.effect_type, "error": str(exc)})
        finally:
            try:
                self.client.restore_snapshot(snapshot)
            except Exception as exc:
                errors.append({"scene": "restore", "effect": "", "error": str(exc)})
        return errors

    @staticmethod
    def _should_create_scene_preset(scene: Scene, assignment: VirtualAssignment) -> bool:
        token = f"{scene.id}:{assignment.virtual_id}:{assignment.effect_type}"
        return (sum(ord(char) for char in token) % 100) < 55

    @staticmethod
    def _scene_preset_name(scene: Scene, assignment: VirtualAssignment) -> str:
        effect_label = re.sub(r"[^A-Za-z0-9]+", " ", assignment.effect_type).strip().title()
        virtual_label = re.sub(r"[^A-Za-z0-9]+", "", assignment.virtual_id).upper()[:6]
        return f"{scene.name[:32]} {effect_label[:18]} {virtual_label}"[:64].strip()

    @staticmethod
    def _generated_preset_name(prefix: str, effect_type: str, palette: Dict[str, Any], index: int) -> str:
        effect_label = re.sub(r"[^A-Za-z0-9]+", " ", effect_type).strip().title()
        palette_name = str(palette.get("name") or palette.get("id") or "Palette")
        return f"{prefix} {effect_label[:18]} {palette_name[:18]} {index:02d}"[:64].strip()

    @staticmethod
    def _extract_preset(response: Dict[str, Any]) -> Dict[str, Any]:
        if isinstance(response.get("preset"), dict):
            return response["preset"]
        payload = response.get("payload")
        if isinstance(payload, dict) and isinstance(payload.get("preset"), dict):
            return payload["preset"]
        return {}

    @staticmethod
    def _preset_details(
        config: Dict[str, Any],
        effect_type: str,
        preset_id: str,
        category: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        if not preset_id:
            return None
        categories = [category] if category in ("ledfx_presets", "user_presets") else ["user_presets", "ledfx_presets"]
        for preset_category in categories:
            preset = (
                (config.get(preset_category) or {})
                .get(effect_type, {})
                .get(preset_id)
            )
            if isinstance(preset, dict) and isinstance(preset.get("config"), dict):
                return {
                    "id": preset_id,
                    "category": preset_category,
                    "name": preset.get("name") or preset_id,
                    "config": copy.deepcopy(preset["config"]),
                }
        return None

    def _palette_for_id(self, palette_id: Any, rng: random.Random) -> Dict[str, Any]:
        palettes = list(self.profiles["palettes"].get("palettes") or [])
        if not palettes:
            return {
                "id": "fallback",
                "name": "Fallback",
                "colors": {"background": "#000000", "dark": "#000000", "low": "#101820", "mid": "#25c7d9", "high": "#a6e65c", "accent": "#ffffff", "strobe": "#ffffff"},
                "positions": {"background": 0, "dark": 18, "low": 38, "mid": 62, "high": 84, "accent": 100},
            }
        clean_id = str(palette_id or "auto").strip()
        if clean_id and clean_id != "auto":
            for palette in palettes:
                if str(palette.get("id")) == clean_id:
                    return palette
        return rng.choice(palettes)

    def _effect_profile(self, effect_type: str, schema_effects: Dict[str, Any]) -> Dict[str, Any]:
        profile = (
            self.profiles.get("effects", {})
            .get("effects", {})
            .get(effect_type)
        )
        if isinstance(profile, dict):
            return copy.deepcopy(profile)
        return self._generic_effect_profile(effect_type, schema_effects)

    @staticmethod
    def _generic_effect_profile(effect_type: str, schema_effects: Dict[str, Any]) -> Dict[str, Any]:
        properties = (
            schema_effects.get(effect_type, {})
            .get("schema", {})
            .get("properties", {})
        )
        blocked = {"advanced", "diag", "test", "dump", "deep_diag"}
        safe_params: Dict[str, Any] = {}
        for key, prop in properties.items():
            if not isinstance(prop, dict) or key in blocked:
                continue
            prop_type = prop.get("type")
            enum = prop.get("enum")
            if isinstance(enum, list) and 1 < len(enum) <= 32:
                safe_params[key] = {"choices": [str(item) for item in enum], "chance": 0.65}
                continue
            if prop_type == "boolean":
                safe_params[key] = {"probability": 0.5, "chance": 0.45}
                continue
            if prop_type in ("number", "integer", "int"):
                minimum = prop.get("minimum")
                maximum = prop.get("maximum")
                if minimum is None or maximum is None:
                    continue
                try:
                    low = float(minimum)
                    high = float(maximum)
                except (TypeError, ValueError):
                    continue
                if high <= low:
                    continue
                safe_params[key] = {
                    "range": [low, high],
                    "energy": "direct",
                    "spread": 0.18,
                    "chance": 0.85,
                }
        return {
            "audio_reactive": True,
            "audio_reactivity": 0.7,
            "energy": [0.0, 1.0],
            "movement": 0.55,
            "rarity": 1.0,
            "safe_params": safe_params,
            "palette_keys": {},
        }

    @staticmethod
    def _first_virtual_id(known_virtual_ids: List[str]) -> str:
        return known_virtual_ids[0] if known_virtual_ids else ""

    def update_scene(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene = self._scene(str(payload["scene_id"]))
        updates = payload.get("assignments") or []
        if not isinstance(updates, list):
            raise ValueError("assignments must be a list")

        changed = False
        known_virtual_order = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        known_virtuals = set(known_virtual_order)
        schema_effects = self.client.get_schema().get("effects", {})
        ledfx_config = self.client.get_config()
        planned_targets = []
        resolved_updates = []
        for update in updates:
            if not isinstance(update, dict):
                continue
            assignment = self._assignment_for_update(scene, update)
            target_virtual_id = str(
                update.get("target_virtual_id") or update.get("target_device") or assignment.virtual_id
            ).strip()
            if not target_virtual_id:
                raise ValueError("target_virtual_id is required")
            if target_virtual_id not in known_virtuals:
                raise ValueError(f"Unknown target device: {target_virtual_id}")
            config_update = update.get("config") or {}
            if not isinstance(config_update, dict):
                raise ValueError("assignment config must be an object")
            action = self._sanitize_scene_action(update.get("action"), assignment.action)
            effect_type = str(update.get("effect_type") or assignment.effect_type or "").strip()
            if action == "activate" and not effect_type:
                raise ValueError("Choose an effect before activating a device")
            preset_requested = "preset" in update
            preset_id = str(update.get("preset") or "").strip()
            preset_category = str(update.get("preset_category") or "").strip() or None
            preset = None
            if effect_type:
                self._validate_effect_type(effect_type, schema_effects)
                if preset_id:
                    preset = self._preset_details(ledfx_config, effect_type, preset_id, preset_category)
                    if not preset:
                        raise ValueError(f"Unknown preset for {effect_type}: {preset_id}")
                planned_targets.append(target_virtual_id)
            resolved_updates.append((assignment, target_virtual_id, action, effect_type, preset, preset_requested, config_update))

        if len(planned_targets) != len(set(planned_targets)):
            raise ValueError("Each effect in a scene must target a different device")

        for assignment, target_virtual_id, action, effect_type, preset, preset_requested, config_update in resolved_updates:
            if effect_type != assignment.effect_type:
                assignment.effect_type = effect_type
                assignment.preset = None
                assignment.preset_category = None
                assignment.config = self._default_effect_config(effect_type, schema_effects) if effect_type else {}
                changed = True
            if not effect_type:
                if assignment.action != "ignore":
                    changed = True
                assignment.action = "ignore"
                if assignment.config:
                    assignment.config = {}
                    changed = True
                continue
            if target_virtual_id != assignment.virtual_id:
                assignment.virtual_id = target_virtual_id
                changed = True
            if action != assignment.action:
                assignment.action = action
                changed = True
            if preset:
                if assignment.preset != preset["id"] or assignment.preset_category != preset["category"]:
                    assignment.preset = preset["id"]
                    assignment.preset_category = preset["category"]
                    assignment.config = copy.deepcopy(preset["config"])
                    changed = True
            elif preset_requested and assignment.preset:
                assignment.preset = None
                assignment.preset_category = None
                changed = True
            next_config = self._sanitize_config_update(assignment.config, config_update)
            if next_config != assignment.config:
                assignment.config = next_config
                changed = True

        name = str(payload.get("name") or scene.name).strip()
        if name and name != scene.name:
            scene.name = name[:MAX_SCENE_NAME]
            changed = True

        self._sync_scene_ignored_assignments(scene, known_virtual_order)
        if changed:
            scene.saved = False
            scene.fingerprint = []
        return {"scene": scene.to_public_dict()}

    def preview(self, scene_id: str) -> Dict[str, Any]:
        if self.preview_snapshot:
            self.client.restore_snapshot(self.preview_snapshot)
            self.preview_snapshot = None
        scene = self._scene(scene_id)
        virtual_ids = [item.virtual_id for item in scene.assignments]
        self.preview_snapshot = self.client.snapshot_effects(virtual_ids)
        self.client.apply_scene(scene)
        return {"ok": True, "scene": scene.to_public_dict()}

    def restore_preview(self) -> Dict[str, Any]:
        if self.preview_snapshot:
            self.client.restore_snapshot(self.preview_snapshot)
            self.preview_snapshot = None
        return {"ok": True}

    def save_batch(self, scene_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        if self.preview_snapshot:
            self.restore_preview()
        selected = scene_ids or [
            scene_id
            for scene_id in self.order
            if self.generated[scene_id].kept and not self.generated[scene_id].deleted
        ]
        selected_scenes = [
            self._scene(scene_id)
            for scene_id in selected
            if scene_id in self.generated and not self.generated[scene_id].deleted
        ]
        for scene in selected_scenes:
            self._normalize_scene_gradient_names(scene)
        preset_errors = self._create_scene_presets(selected_scenes, self.last_options)
        saved = []
        errors = []
        for scene in selected_scenes:
            try:
                response = self.client.save_scene(scene)
                scene.saved = True
                ledfx_id = self._extract_scene_id(response)
                if ledfx_id:
                    scene.ledfx_scene_id = ledfx_id
                saved.append(
                    {
                        "id": scene.id,
                        "ledfx_scene_id": scene.ledfx_scene_id,
                        "name": scene.name,
                        "response": response,
                    }
                )
            except Exception as exc:
                errors.append({"id": scene.id, "name": scene.name, "error": str(exc)})
        return {"saved": saved, "errors": errors, "preset_errors": preset_errors}

    def repair_published_scenes(self) -> Dict[str, Any]:
        scenes = self.client.get_scenes().get("scenes") or {}
        removed = []
        errors = []
        for scene_id, scene_config in scenes.items():
            if not str(scene_id).startswith("lsf-"):
                continue
            if not isinstance(scene_config.get("scene_tags"), list):
                continue
            try:
                response = self.client.delete_scene(str(scene_id))
                removed.append(
                    {
                        "id": scene_id,
                        "name": scene_config.get("name") or scene_id,
                        "response": response,
                    }
                )
            except Exception as exc:
                errors.append(
                    {
                        "id": scene_id,
                        "name": scene_config.get("name") or scene_id,
                        "error": str(exc),
                    }
                )
        return {"removed": removed, "errors": errors}

    def ledfx_library(self) -> Dict[str, Any]:
        scenes_response = self.client.get_scenes()
        playlists_response = self.client.get_playlists()
        known_virtual_order = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        scene_rows = [
            self._public_ledfx_scene(scene_id, scene_config, known_virtual_order)
            for scene_id, scene_config in (scenes_response.get("scenes") or {}).items()
        ]
        scene_rows.sort(
            key=lambda item: (
                not item["is_scene_factory"],
                item["name"].lower(),
                item["id"],
            )
        )
        playlist_rows = [
            self._public_playlist(playlist_id, playlist)
            for playlist_id, playlist in (playlists_response.get("playlists") or {}).items()
        ]
        playlist_rows.sort(key=lambda item: (item["name"].lower(), item["id"]))
        playlist_state: Dict[str, Any] = {}
        try:
            response = self.client.control_playlist("state")
            playlist_state = self._playlist_state_from_response(response)
        except Exception:
            playlist_state = {}
        return {
            "scenes": scene_rows,
            "playlists": playlist_rows,
            "playlist_state": playlist_state,
        }

    def rename_ledfx_scene(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene_id = str(payload.get("scene_id") or "").strip()
        name = str(payload.get("name") or "").strip()[:MAX_SCENE_NAME]
        if not scene_id:
            raise ValueError("scene_id is required")
        if not name:
            raise ValueError("Scene name is required")
        response = self.client.rename_scene(scene_id, name)
        return {"scene_id": scene_id, "name": name, "response": response}

    def update_ledfx_scene(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene_id = str(payload.get("scene_id") or "").strip()
        if not scene_id:
            raise ValueError("scene_id is required")
        scenes = self.client.get_scenes().get("scenes") or {}
        scene_config = dict(scenes.get(scene_id) or {})
        if not scene_config:
            raise KeyError(f"Unknown LedFx scene: {scene_id}")
        name = str(payload.get("name") or scene_config.get("name") or scene_id).strip()[:MAX_SCENE_NAME]
        if not name:
            raise ValueError("Scene name is required")
        scene_config["id"] = scene_id
        scene_config["name"] = name
        if "tags" in payload or "scene_tags" in payload:
            scene_config["scene_tags"] = self._sanitize_scene_tags(
                payload.get("tags", payload.get("scene_tags"))
            )
        assignments = payload.get("assignments") or []
        virtuals = scene_config.get("virtuals") or {}
        known_virtual_order = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        if isinstance(assignments, list):
            known_virtuals = set(known_virtual_order)
            schema_effects = self.client.get_schema().get("effects", {})
            ledfx_config = self.client.get_config()
            planned_targets = []
            resolved_updates = []
            for update in assignments:
                if not isinstance(update, dict):
                    continue
                virtual_id = str(update.get("virtual_id") or "").strip()
                if not virtual_id:
                    continue
                current_virtual = virtuals.get(virtual_id) or {}
                has_effect = isinstance(current_virtual, dict) and bool(current_virtual.get("type"))
                action = self._sanitize_scene_action(
                    update.get("action"),
                    current_default=current_virtual.get("action") if isinstance(current_virtual, dict) else None,
                )
                target_virtual_id = str(
                    update.get("target_virtual_id") or update.get("target_device") or virtual_id
                ).strip()
                config_update = update.get("config") or {}
                if not isinstance(config_update, dict):
                    raise ValueError("assignment config must be an object")
                if not target_virtual_id:
                    raise ValueError("target_virtual_id is required")
                if target_virtual_id not in known_virtuals:
                    raise ValueError(f"Unknown target device: {target_virtual_id}")
                effect_type = str(
                    update.get("effect_type")
                    if "effect_type" in update
                    else (current_virtual.get("type") if isinstance(current_virtual, dict) else "")
                ).strip()
                if action == "activate" and not effect_type:
                    raise ValueError("Choose an effect before activating a device")
                preset_requested = "preset" in update
                preset_id = str(update.get("preset") or "").strip()
                preset_category = str(update.get("preset_category") or "").strip() or None
                preset = None
                if effect_type:
                    self._validate_effect_type(effect_type, schema_effects)
                    if preset_id:
                        preset = self._preset_details(ledfx_config, effect_type, preset_id, preset_category)
                        if not preset:
                            raise ValueError(f"Unknown preset for {effect_type}: {preset_id}")
                    planned_targets.append(target_virtual_id)
                elif has_effect or action == "ignore":
                    action = "ignore"
                resolved_updates.append((virtual_id, target_virtual_id, action, effect_type, preset, preset_requested, config_update))
            if len(planned_targets) != len(set(planned_targets)):
                raise ValueError("Each effect in a scene must target a different device")
            for virtual_id, target_virtual_id, action, effect_type, preset, preset_requested, config_update in resolved_updates:
                current_virtual = dict(virtuals.get(virtual_id) or {})
                if not effect_type:
                    virtuals.pop(virtual_id, None)
                    virtuals[target_virtual_id] = {"action": "ignore"}
                    continue
                old_effect_type = current_virtual.get("type")
                current_config = current_virtual.get("config") or {}
                if (
                    old_effect_type != effect_type
                    or not isinstance(current_config, dict)
                ):
                    current_config = self._default_effect_config(effect_type, schema_effects)
                current_virtual["action"] = action
                current_virtual["type"] = effect_type
                if current_virtual.get("preset") and old_effect_type != effect_type:
                    current_virtual.pop("preset", None)
                    current_virtual.pop("preset_category", None)
                if preset:
                    current_virtual["preset"] = preset["id"]
                    current_virtual["preset_category"] = preset["category"]
                    current_config = copy.deepcopy(preset["config"])
                elif preset_requested:
                    current_virtual.pop("preset", None)
                    current_virtual.pop("preset_category", None)
                current_virtual["config"] = self._sanitize_config_update(current_config, config_update)
                if target_virtual_id != virtual_id:
                    virtuals.pop(virtual_id, None)
                virtuals[target_virtual_id] = current_virtual
            self._sync_virtual_ignore_entries(virtuals, known_virtual_order)
            scene_config["virtuals"] = virtuals
        response = self.client.save_scene_payload(scene_config)
        return {
            "scene": self._public_ledfx_scene(scene_id, scene_config, known_virtual_order),
            "response": response,
        }

    def activate_ledfx_scene(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene_id = str(payload.get("scene_id") or "").strip()
        if not scene_id:
            raise ValueError("scene_id is required")
        response = self.client.activate_scene(scene_id)
        return {"scene_id": scene_id, "response": response}

    def delete_ledfx_scene(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene_id = str(payload.get("scene_id") or "").strip()
        if not scene_id:
            raise ValueError("scene_id is required")
        response = self.client.delete_scene(scene_id)
        return {"scene_id": scene_id, "response": response}

    def batch_delete_ledfx_scenes(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene_ids = self._scene_ids_from_payload(payload)
        deleted = []
        errors = []
        for scene_id in scene_ids:
            try:
                response = self.client.delete_scene(scene_id)
                deleted.append({"id": scene_id, "response": response})
            except Exception as exc:
                errors.append({"id": scene_id, "error": str(exc)})
        return {"deleted": deleted, "errors": errors}

    def batch_tag_ledfx_scenes(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        scene_ids = self._scene_ids_from_payload(payload)
        new_tags = self._scene_tags_list(payload.get("tags"))
        if not new_tags:
            raise ValueError("Add at least one tag")
        scenes = self.client.get_scenes().get("scenes") or {}
        tagged = []
        errors = []
        for scene_id in scene_ids:
            try:
                scene_config = dict(scenes.get(scene_id) or {})
                if not scene_config:
                    raise KeyError(f"Unknown LedFx scene: {scene_id}")
                tags = self._merge_scene_tags(scene_config.get("scene_tags"), new_tags)
                scene_config["id"] = scene_id
                scene_config["scene_tags"] = self._sanitize_scene_tags(tags)
                response = self.client.save_scene_payload(scene_config)
                tagged.append({"id": scene_id, "tags": scene_config["scene_tags"], "response": response})
            except Exception as exc:
                errors.append({"id": scene_id, "error": str(exc)})
        return {"tagged": tagged, "errors": errors}

    def shorten_lsf_scene_names(self) -> Dict[str, Any]:
        scenes = self.client.get_scenes().get("scenes") or {}
        lsf_items = [
            (scene_id, scene_config)
            for scene_id, scene_config in scenes.items()
            if self._is_scene_factory_scene(scene_id, scene_config)
        ]
        lsf_items.sort(key=lambda item: (self._lsf_index(item[0], item[1]), item[0]))
        renamed = []
        errors = []
        used_names = {
            str(scene_config.get("name") or scene_id)
            for scene_id, scene_config in scenes.items()
            if not self._is_scene_factory_scene(scene_id, scene_config)
        }
        for fallback_index, (scene_id, scene_config) in enumerate(lsf_items, start=1):
            current_name = str(scene_config.get("name") or scene_id)
            index = self._lsf_index(scene_id, scene_config, fallback_index)
            new_name = self._short_existing_lsf_name(index, current_name)
            new_name = self._dedupe_name(new_name, used_names)
            used_names.add(new_name)
            if new_name == current_name:
                continue
            try:
                response = self.client.rename_scene(scene_id, new_name)
                renamed.append(
                    {
                        "id": scene_id,
                        "old_name": current_name,
                        "name": new_name,
                        "response": response,
                    }
                )
            except Exception as exc:
                errors.append({"id": scene_id, "name": current_name, "error": str(exc)})
        return {"renamed": renamed, "errors": errors}

    def save_playlist(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        playlist = self._sanitize_playlist(payload)
        response = self.client.save_playlist(playlist)
        return {"playlist": self._playlist_from_response(response, playlist), "response": response}

    def delete_playlist(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        playlist_id = str(payload.get("playlist_id") or payload.get("id") or "").strip()
        if not playlist_id:
            raise ValueError("playlist_id is required")
        response = self.client.delete_playlist(playlist_id)
        return {"playlist_id": playlist_id, "response": response}

    def control_playlist(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        action = str(payload.get("action") or "").strip()
        if action not in ("start", "stop", "pause", "resume", "next", "prev", "state"):
            raise ValueError("Invalid playlist action")
        playlist_id = str(payload.get("playlist_id") or payload.get("id") or "").strip() or None
        mode = payload.get("mode")
        if mode not in ("sequence", "shuffle"):
            mode = None
        timing = payload.get("timing") if isinstance(payload.get("timing"), dict) else None
        response = self.client.control_playlist(action, playlist_id, mode=mode, timing=timing)
        return {
            "action": action,
            "playlist_id": playlist_id,
            "state": self._playlist_state_from_response(response),
            "response": response,
        }

    def save_style(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        styles_root = self.profiles["styles"]
        styles = dict(styles_root.get("styles") or {})
        style_id = self._slug(str(payload.get("id") or payload.get("style_id") or ""))
        name = str(payload.get("name") or "").strip()[:64]
        if not name:
            raise ValueError("Style name is required")
        if not style_id:
            style_id = self._slug(name)
        if not style_id:
            raise ValueError("Style id is required")

        source_style = str(payload.get("source_style") or payload.get("base_style") or "").strip()
        is_existing = style_id in styles
        base = styles.get(style_id) or styles.get(source_style) or styles.get("techno") or {}
        clean = json.loads(json.dumps(base))
        clean["name"] = name
        clean["description"] = str(payload.get("description") or clean.get("description") or "").strip()[:280]
        clean["defaults"] = self._sanitize_style_defaults(payload.get("defaults"), clean.get("defaults"))
        if not is_existing and source_style:
            clean["base_style"] = clean.get("base_style") or source_style
        clean.setdefault("scene_type_weights", self._default_scene_type_weights())
        clean.setdefault("effect_bias", {})
        clean.setdefault("palette_bias", {})
        styles[style_id] = clean
        styles_root["styles"] = styles
        self._write_styles()
        return {"style_id": style_id, "style": clean, "styles": styles}

    def delete_style(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        style_id = str(payload.get("style_id") or payload.get("id") or "").strip()
        styles_root = self.profiles["styles"]
        styles = dict(styles_root.get("styles") or {})
        if not style_id or style_id not in styles:
            raise KeyError(f"Unknown style: {style_id}")
        if len(styles) <= 1:
            raise ValueError("At least one style is required")
        styles.pop(style_id)
        styles_root["styles"] = styles
        self._write_styles()
        return {"deleted": style_id, "styles": styles}

    @staticmethod
    def _extract_scene_id(response: Dict[str, Any]) -> Optional[str]:
        candidates = [
            response.get("id"),
            response.get("scene_id"),
            (response.get("scene") or {}).get("id")
            if isinstance(response.get("scene"), dict)
            else None,
            (response.get("payload") or {}).get("id")
            if isinstance(response.get("payload"), dict)
            else None,
            (response.get("payload") or {}).get("scene_id")
            if isinstance(response.get("payload"), dict)
            else None,
        ]
        for candidate in candidates:
            if candidate is not None:
                return str(candidate)
        return None

    @staticmethod
    def _public_ledfx_scene(
        scene_id: str,
        scene_config: Dict[str, Any],
        all_virtual_ids: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        virtuals = scene_config.get("virtuals") or {}
        if not isinstance(virtuals, dict):
            virtuals = {}
        virtual_order = AppState._ordered_unique_ids(
            list(all_virtual_ids or []) + [str(virtual_id) for virtual_id in virtuals.keys()]
        )
        effect_types = sorted(
            {
                str(virtual.get("type"))
                for virtual in virtuals.values()
                if isinstance(virtual, dict) and virtual.get("type")
            }
        )
        assignments = []
        for virtual_id in virtual_order:
            virtual = virtuals.get(virtual_id) or {}
            if not isinstance(virtual, dict):
                virtual = {}
            effect_type = str(virtual.get("type") or "")
            action = str(
                virtual.get("action") or ("activate" if effect_type else "ignore")
            )
            if action == "active":
                action = "activate"
            if action not in VALID_SCENE_ACTIONS:
                action = "activate" if effect_type else "ignore"
            assignments.append(
                {
                    "virtual_id": str(virtual_id),
                    "effect_type": effect_type,
                    "preset": virtual.get("preset"),
                    "preset_category": virtual.get("preset_category"),
                    "action": action,
                    "config": dict(virtual.get("config") or {}),
                }
            )
        return {
            "id": scene_id,
            "name": str(scene_config.get("name") or scene_id),
            "active": bool(scene_config.get("active")),
            "image": scene_config.get("scene_image"),
            "virtual_count": len(virtual_order),
            "effect_types": effect_types,
            "assignments": assignments,
            "is_scene_factory": AppState._is_scene_factory_scene(scene_id, scene_config),
            "has_bad_tags": isinstance(scene_config.get("scene_tags"), list),
            "tags": AppState._scene_tags_text(scene_config.get("scene_tags")),
            "tags_list": AppState._scene_tags_list(scene_config.get("scene_tags")),
        }

    @staticmethod
    def _public_playlist(playlist_id: str, playlist: Dict[str, Any]) -> Dict[str, Any]:
        items = list(playlist.get("items") or [])
        return {
            "id": str(playlist.get("id") or playlist_id),
            "name": str(playlist.get("name") or playlist_id),
            "mode": playlist.get("mode") or "sequence",
            "default_duration_ms": int(playlist.get("default_duration_ms") or 500),
            "items": items,
            "item_count": len(items),
            "tags": playlist.get("tags") or [],
            "image": playlist.get("image"),
        }

    @staticmethod
    def _playlist_state_from_response(response: Dict[str, Any]) -> Dict[str, Any]:
        if isinstance(response.get("state"), dict):
            return response["state"]
        payload = response.get("payload")
        if isinstance(payload, dict) and isinstance(payload.get("state"), dict):
            return payload["state"]
        if isinstance(response.get("data"), dict) and isinstance(response["data"].get("state"), dict):
            return response["data"]["state"]
        return {}

    @staticmethod
    def _playlist_from_response(
        response: Dict[str, Any], fallback: Dict[str, Any]
    ) -> Dict[str, Any]:
        payload = response.get("payload")
        if isinstance(payload, dict) and isinstance(payload.get("playlist"), dict):
            return payload["playlist"]
        if isinstance(response.get("playlist"), dict):
            return response["playlist"]
        return fallback

    def _sanitize_playlist(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        name = str(payload.get("name") or "Scene Factory Playlist").strip()[:64]
        if not name:
            raise ValueError("Playlist name is required")
        playlist_id = self._slug(str(payload.get("playlist_id") or payload.get("id") or ""))
        mode = payload.get("mode") if payload.get("mode") in ("sequence", "shuffle") else "sequence"
        default_duration_ms = self._duration_to_ms(
            seconds=payload.get("default_duration_seconds"),
            milliseconds=payload.get("default_duration_ms"),
            fallback=30000,
        )
        raw_items = payload.get("items") or []
        if not isinstance(raw_items, list):
            raise ValueError("Playlist items must be a list")
        known_scenes = set((self.client.get_scenes().get("scenes") or {}).keys())
        items = []
        for item in raw_items:
            if not isinstance(item, dict):
                continue
            scene_id = str(item.get("scene_id") or "").strip()
            if not scene_id:
                continue
            if scene_id not in known_scenes:
                raise ValueError(f"Unknown LedFx scene: {scene_id}")
            duration_ms = self._duration_to_ms(
                seconds=item.get("duration_seconds"),
                milliseconds=item.get("duration_ms"),
                fallback=default_duration_ms,
            )
            items.append({"scene_id": scene_id, "duration_ms": duration_ms})
        if not items:
            raise ValueError("Select at least one scene for the playlist")
        playlist = {
            "name": name,
            "items": items,
            "default_duration_ms": default_duration_ms,
            "mode": mode,
            "timing": {
                "jitter": {
                    "enabled": bool((payload.get("timing") or {}).get("jitter", {}).get("enabled", False))
                    if isinstance(payload.get("timing"), dict)
                    else False,
                    "factor_min": 1.0,
                    "factor_max": 1.0,
                }
            },
            "tags": list(payload.get("tags") or ["scene-factory"]),
            "image": payload.get("image") or "Wallpaper",
        }
        if playlist_id:
            playlist["id"] = playlist_id
        return playlist

    @staticmethod
    def _duration_ms(value: Any, fallback: int) -> int:
        try:
            duration = int(round(float(value)))
        except Exception:
            duration = fallback
        return max(500, min(3_600_000, duration))

    @staticmethod
    def _duration_to_ms(seconds: Any = None, milliseconds: Any = None, fallback: int = 30000) -> int:
        if seconds is not None:
            try:
                return AppState._duration_ms(float(seconds) * 1000, fallback)
            except Exception:
                pass
        return AppState._duration_ms(milliseconds, fallback)

    @staticmethod
    def _slug(value: str) -> str:
        clean = re.sub(r"[^a-zA-Z0-9_-]+", "-", str(value or "").lower()).strip("-")
        return clean[:80]

    @staticmethod
    def _ledfx_preset_id(value: str) -> str:
        clean = re.sub(r"[^a-zA-Z0-9]", " ", str(value or "").lower())
        clean = re.sub(r" +", " ", clean).strip().replace(" ", "-")
        return clean or "default"

    @staticmethod
    def _is_scene_factory_scene(scene_id: str, scene_config: Dict[str, Any]) -> bool:
        name = str(scene_config.get("name") or "")
        tags = AppState._scene_tags_list(scene_config.get("scene_tags"))
        return (
            str(scene_id).startswith("lsf-")
            or name.upper().startswith("LSF")
            or "scene-factory" in tags
        )

    @staticmethod
    def _lsf_index(scene_id: str, scene_config: Dict[str, Any], fallback: int = 1) -> int:
        haystack = f"{scene_config.get('name') or ''} {scene_id}"
        match = re.search(r"\bLSF\s*0*(\d{1,5})\b", haystack, re.IGNORECASE)
        if not match:
            match = re.search(r"\blsf[-_ ]0*(\d{1,5})\b", haystack, re.IGNORECASE)
        if match:
            return int(match.group(1))
        return fallback

    @staticmethod
    def _short_existing_lsf_name(index: int, name: str) -> str:
        return compact_scene_name(
            index=index,
            style_name=AppState._extract_style_name(name),
            scene_type=AppState._extract_scene_type(name),
            palette_name=AppState._extract_palette_name(name),
            max_length=28,
        )

    @staticmethod
    def _extract_style_name(name: str) -> str:
        lower = name.lower()
        for label, code in STYLE_CODES.items():
            if label in lower or code.lower() in lower:
                return label
        return "scene factory"

    @staticmethod
    def _extract_scene_type(name: str) -> str:
        lower = name.lower()
        for label, code in SCENE_TYPE_CODES.items():
            if label in lower or code.lower() in lower:
                return label
        return "scene"

    @staticmethod
    def _extract_palette_name(name: str) -> str:
        if " - " in name:
            return name.split(" - ", 1)[1]
        words = re.sub(r"[^A-Za-z0-9]+", " ", name).strip().split()
        if not words:
            return ""
        last = words[-1]
        used_codes = set(STYLE_CODES.values()) | set(SCENE_TYPE_CODES.values())
        if last.upper() in used_codes or last.upper().startswith("LSF"):
            return ""
        return last

    @staticmethod
    def _dedupe_name(name: str, used_names: set[str]) -> str:
        if name not in used_names:
            return name
        base = name[: max(1, MAX_SCENE_NAME - 5)].rstrip()
        for index in range(2, 1000):
            candidate = f"{base} {index}"[:MAX_SCENE_NAME].rstrip()
            if candidate not in used_names:
                return candidate
        return f"{base} X"[:MAX_SCENE_NAME].rstrip()

    @staticmethod
    def _scene_ids_from_payload(payload: Dict[str, Any]) -> List[str]:
        raw = payload.get("scene_ids") or payload.get("ids") or []
        if not isinstance(raw, list):
            raise ValueError("scene_ids must be a list")
        scene_ids = [str(scene_id).strip() for scene_id in raw if str(scene_id).strip()]
        if not scene_ids:
            raise ValueError("Select at least one scene")
        return list(dict.fromkeys(scene_ids))

    @staticmethod
    def _sanitize_scene_tags(value: Any) -> str:
        if isinstance(value, list):
            raw = ",".join(str(item) for item in value)
        else:
            raw = str(value or "")
        tags = []
        for item in re.split(r"[,;\n]+", raw):
            tag = re.sub(r"\s+", " ", item.strip())[:32]
            if tag and tag not in tags:
                tags.append(tag)
        return ", ".join(tags)[:160]

    @staticmethod
    def _scene_tags_text(value: Any) -> str:
        if isinstance(value, list):
            return ", ".join(str(item) for item in value if str(item).strip())
        if value is None:
            return ""
        return str(value)

    @staticmethod
    def _scene_tags_list(value: Any) -> List[str]:
        if isinstance(value, list):
            raw = value
        else:
            raw = re.split(r"[,;\n]+", str(value or ""))
        tags = []
        for item in raw:
            tag = re.sub(r"\s+", " ", str(item).strip())[:32]
            if tag and tag not in tags:
                tags.append(tag)
        return tags

    @staticmethod
    def _merge_scene_tags(existing: Any, additions: List[str]) -> List[str]:
        tags = AppState._scene_tags_list(existing)
        for tag in additions:
            clean = re.sub(r"\s+", " ", str(tag).strip())[:32]
            if clean and clean not in tags:
                tags.append(clean)
        return tags

    def save_palette(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        palette = self._sanitize_palette(payload)
        palettes = list(self.profiles["palettes"].get("palettes", []))
        index = next(
            (idx for idx, item in enumerate(palettes) if item.get("id") == palette["id"]),
            -1,
        )
        if index >= 0:
            palettes[index] = palette
        else:
            palettes.append(palette)
        self.profiles["palettes"]["palettes"] = palettes
        self._write_palettes()
        return {"palette": palette, "palettes": palettes}

    def delete_palette(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        palette_id = str(payload.get("palette_id") or "").strip()
        if not palette_id or palette_id == "auto":
            raise ValueError("palette_id is required")
        palettes = list(self.profiles["palettes"].get("palettes", []))
        if len(palettes) <= 1:
            raise ValueError("At least one palette is required")
        next_palettes = [item for item in palettes if item.get("id") != palette_id]
        if len(next_palettes) == len(palettes):
            raise KeyError(f"Unknown palette: {palette_id}")
        self.profiles["palettes"]["palettes"] = next_palettes
        self._write_palettes()
        return {"deleted": palette_id, "palettes": next_palettes}

    def save_effect_forge(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        effect_name = str(payload.get("effect_name") or "Custom Effect").strip()[:80]
        effect_id = self._safe_file_stem(payload.get("effect_id") or effect_name)
        module_code = str(payload.get("module_code") or "").strip()
        profile_json = str(payload.get("profile_json") or "").strip()
        instructions = str(payload.get("instructions") or "").strip()
        if not module_code:
            raise ValueError("module_code is required")
        if not profile_json:
            raise ValueError("profile_json is required")
        if len(module_code) > MAX_EFFECT_DRAFT_CHARS or len(profile_json) > MAX_EFFECT_DRAFT_CHARS:
            raise ValueError("Effect draft is too large")
        try:
            profile_data = json.loads(profile_json)
        except json.JSONDecodeError as exc:
            raise ValueError(f"profile_json is invalid JSON: {exc}") from exc
        save_dir = str(payload.get("save_dir") or "").strip()
        base_folder = Path(save_dir).expanduser() if save_dir else EFFECT_FORGE_DIR
        if base_folder.exists() and not base_folder.is_dir():
            raise ValueError("save_dir must be a folder")
        folder = base_folder / f"{time.strftime('%Y%m%d-%H%M%S')}-{effect_id}"
        folder.mkdir(parents=True, exist_ok=True)
        module_path = folder / f"{effect_id}.py"
        profile_path = folder / f"{effect_id}.profile.json"
        profile_yaml_path = folder / f"{effect_id}.workshop-profile.yaml"
        installer_path = folder / f"install_{effect_id}.py"
        instructions_path = folder / "IMPORT_INSTRUCTIONS.md"
        if not instructions:
            instructions = self._effect_forge_instructions(
                effect_name,
                effect_id,
                module_path,
                profile_yaml_path,
                installer_path,
            )
        module_path.write_text(module_code + "\n", encoding="utf-8")
        profile_path.write_text(profile_json + "\n", encoding="utf-8")
        profile_yaml_path.write_text(self._effect_profile_yaml(profile_data), encoding="utf-8")
        installer_path.write_text(
            self._effect_forge_installer(effect_name, effect_id, module_code, profile_json),
            encoding="utf-8",
        )
        instructions_path.write_text(instructions + "\n", encoding="utf-8")
        return {
            "directory": str(folder),
            "files": {
                "module": str(module_path),
                "profile": str(profile_path),
                "profile_yaml": str(profile_yaml_path),
                "installer": str(installer_path),
                "instructions": str(instructions_path),
            },
        }

    @staticmethod
    def _safe_file_stem(value: Any) -> str:
        stem = re.sub(r"[^a-zA-Z0-9_-]+", "_", str(value or "").strip().lower()).strip("_-")
        return stem or f"custom_effect_{int(time.time())}"

    @staticmethod
    def _effect_profile_yaml(profile_data: Dict[str, Any]) -> str:
        wrapped = {"effects": profile_data}
        try:
            import yaml  # type: ignore

            return yaml.safe_dump(wrapped, sort_keys=False, allow_unicode=False)
        except Exception:
            return json.dumps(wrapped, indent=2) + "\n"

    @staticmethod
    def _effect_forge_installer(
        effect_name: str,
        effect_id: str,
        module_code: str,
        profile_json: str,
    ) -> str:
        return "\n".join(
            [
                "#!/usr/bin/env python3",
                'r"""Install an experimental LedFx Workshop effect draft.',
                "",
                "Run this with any Python 3. The script tries to find the LedFx effects folder automatically.",
                "Examples:",
                '  python install_effect.py --workshop "/path/to/LedFX Scene Generator"',
                '  py .\\install_effect.py --workshop "C:/path/to/LedFX Scene Generator"',
                '"""',
                "from __future__ import annotations",
                "",
                "import argparse",
                "import json",
                "import os",
                "import shutil",
                "import sys",
                "from pathlib import Path",
                "",
                f"EFFECT_ID = {json.dumps(effect_id)}",
                f"EFFECT_NAME = {json.dumps(effect_name)}",
                f"MODULE_CODE = {json.dumps(module_code.rstrip() + chr(10))}",
                f"PROFILE_JSON = {json.dumps(profile_json)}",
                "",
                "",
                "def parse_args():",
                "    parser = argparse.ArgumentParser(description=f\"Install {EFFECT_NAME} into LedFx and LedFx Workshop.\")",
                "    parser.add_argument(\"--effects-dir\", action=\"append\", help=\"LedFx ledfx/effects folder. Can be repeated; usually not needed.\")",
                "    parser.add_argument(\"--workshop\", help=\"LedFx Workshop project folder, or the data/effects.yaml file.\")",
                "    parser.add_argument(\"--list-targets\", action=\"store_true\", help=\"Only print detected LedFx effects folders and exit.\")",
                "    parser.add_argument(\"--first-target-only\", action=\"store_true\", help=\"Install only into the first detected LedFx effects folder.\")",
                "    parser.add_argument(\"--skip-module\", action=\"store_true\", help=\"Do not install the LedFx Python module.\")",
                "    parser.add_argument(\"--skip-workshop\", action=\"store_true\", help=\"Do not update Workshop data/effects.yaml.\")",
                "    return parser.parse_args()",
                "",
                "",
                "def fail(message):",
                "    print(f\"ERROR: {message}\", file=sys.stderr)",
                "    return 1",
                "",
                "",
                "def write_text(path, text):",
                "    path.write_text(text.rstrip() + \"\\n\", encoding=\"utf-8\")",
                "",
                "",
                "def backup_if_exists(path):",
                "    if not path.exists():",
                "        return None",
                "    backup = path.with_name(path.name + \".bak\")",
                "    index = 1",
                "    while backup.exists():",
                "        backup = path.with_name(f\"{path.name}.bak{index}\")",
                "        index += 1",
                "    shutil.copy2(path, backup)",
                "    return backup",
                "",
                "",
                "def normalize_effects_dir(path):",
                "    if not path:",
                "        return None",
                "    candidate = Path(path).expanduser()",
                "    if candidate.name != \"effects\" and (candidate / \"effects\").is_dir():",
                "        candidate = candidate / \"effects\"",
                "    try:",
                "        candidate = candidate.resolve()",
                "    except OSError:",
                "        return None",
                "    if not candidate.is_dir() or candidate.name != \"effects\":",
                "        return None",
                "    if not ((candidate / \"audio.py\").is_file() or (candidate / \"gradient.py\").is_file() or (candidate / \"__init__.py\").is_file()):",
                "        return None",
                "    return candidate",
                "",
                "",
                "def unique_existing(paths):",
                "    seen = set()",
                "    for raw_path in paths:",
                "        path = normalize_effects_dir(raw_path)",
                "        if not path or path in seen:",
                "            continue",
                "        seen.add(path)",
                "        yield path",
                "",
                "",
                "def candidate_effects_dirs(manual_paths):",
                "    if manual_paths:",
                "        for manual_path in manual_paths:",
                "            yield manual_path",
                "    for env_name in (\"LEDFX_EFFECTS_DIR\", \"LEDFX_EFFECTS_PATH\"):",
                "        env_value = os.environ.get(env_name)",
                "        if env_value:",
                "            for part in env_value.split(os.pathsep):",
                "                yield part",
                "    try:",
                "        import ledfx  # type: ignore",
                "        yield Path(ledfx.__file__).resolve().parent / \"effects\"",
                "    except Exception:",
                "        pass",
                "    here = Path(__file__).resolve().parent",
                "    cwd = Path.cwd().resolve()",
                "    home = Path.home()",
                "    base_roots = [here, cwd, *here.parents, *cwd.parents, home / \"Downloads\", home / \"Documents\", home / \"Applications\", Path(\"/Applications\")]",
                "    for root in base_roots:",
                "        if not root.exists():",
                "            continue",
                "        yield root / \"ledfx\" / \"effects\"",
                "        yield root / \"LedFx\" / \"ledfx\" / \"effects\"",
                "        try:",
                "            for app in root.glob(\"LedFx*.app\"):",
                "                yield app / \"Contents\" / \"Resources\" / \"ledfx\" / \"effects\"",
                "                yield app / \"Contents\" / \"Frameworks\" / \"ledfx\" / \"effects\"",
                "            for app in root.glob(\"LedFX*.app\"):",
                "                yield app / \"Contents\" / \"Resources\" / \"ledfx\" / \"effects\"",
                "                yield app / \"Contents\" / \"Frameworks\" / \"ledfx\" / \"effects\"",
                "        except OSError:",
                "            pass",
                "    for root, pattern in (",
                "        (home, \".local/pipx/venvs/ledfx/lib/python*/site-packages/ledfx/effects\"),",
                "        (home, \".local/lib/python*/site-packages/ledfx/effects\"),",
                "        (Path(sys.prefix), \"lib/python*/site-packages/ledfx/effects\"),",
                "    ):",
                "        try:",
                "            yield from root.glob(pattern)",
                "        except OSError:",
                "            pass",
                "    for env_name in (\"LOCALAPPDATA\", \"PROGRAMFILES\", \"PROGRAMFILES(X86)\"):",
                "        root_value = os.environ.get(env_name)",
                "        if not root_value:",
                "            continue",
                "        root = Path(root_value)",
                "        for pattern in (\"LedFx*/ledfx/effects\", \"LedFX*/ledfx/effects\", \"LedFx*/Lib/site-packages/ledfx/effects\", \"LedFX*/Lib/site-packages/ledfx/effects\"):",
                "            try:",
                "                yield from root.glob(pattern)",
                "            except OSError:",
                "                pass",
                "",
                "",
                "def find_ledfx_effects_dirs(manual_paths):",
                "    effects_dirs = list(unique_existing(candidate_effects_dirs(manual_paths)))",
                "    if not effects_dirs:",
                "        raise RuntimeError(",
                "            \"Could not find a LedFx ledfx/effects folder automatically. Run with --list-targets to debug, \"",
                "            \"or pass --effects-dir /path/to/ledfx/effects.\"",
                "        )",
                "    return effects_dirs",
                "",
                "",
                "def install_module(effects_dirs):",
                "    for effects_dir in effects_dirs:",
                "        target = effects_dir / f\"{EFFECT_ID}.py\"",
                "        backup = backup_if_exists(target)",
                "        write_text(target, MODULE_CODE)",
                "        print(f\"Installed LedFx module: {target}\")",
                "        if backup:",
                "            print(f\"Previous module backup: {backup}\")",
                "",
                "",
                "def candidate_workshop_paths(manual_path):",
                "    candidates = []",
                "    if manual_path:",
                "        candidates.append(Path(manual_path).expanduser())",
                "    env_path = os.environ.get(\"LEDFX_WORKSHOP_DIR\")",
                "    if env_path:",
                "        candidates.append(Path(env_path).expanduser())",
                "    here = Path(__file__).resolve().parent",
                "    cwd = Path.cwd().resolve()",
                "    candidates.extend([cwd, here])",
                "    candidates.extend(cwd.parents)",
                "    candidates.extend(here.parents)",
                "    home = Path.home()",
                "    candidates.extend([",
                "        home / \"Documents\" / \"ChatGPT\" / \"LedFX Scene Generator\",",
                "        home / \"Documents\" / \"LedFX Scene Generator\",",
                "        home / \"Documents\" / \"LedFx Workshop\",",
                "    ])",
                "    seen = set()",
                "    for candidate in candidates:",
                "        try:",
                "            resolved = candidate.resolve()",
                "        except OSError:",
                "            continue",
                "        if resolved in seen:",
                "            continue",
                "        seen.add(resolved)",
                "        yield resolved",
                "",
                "",
                "def resolve_workshop_effects_file(manual_path):",
                "    for candidate in candidate_workshop_paths(manual_path):",
                "        if candidate.is_file() and candidate.name == \"effects.yaml\":",
                "            return candidate",
                "        path = candidate / \"data\" / \"effects.yaml\"",
                "        if path.is_file():",
                "            return path",
                "    return None",
                "",
                "",
                "def profile_yaml(profile):",
                "    try:",
                "        import yaml  # type: ignore",
                "        return yaml.safe_dump({\"effects\": profile}, sort_keys=False, allow_unicode=False)",
                "    except Exception:",
                "        return json.dumps({\"effects\": profile}, indent=2)",
                "",
                "",
                "def update_workshop_profile(manual_path):",
                "    profile_path = resolve_workshop_effects_file(manual_path)",
                "    profile = json.loads(PROFILE_JSON)",
                "    if not profile_path:",
                "        fallback = Path.cwd() / f\"{EFFECT_ID}.workshop-profile.yaml\"",
                "        write_text(fallback, profile_yaml(profile))",
                "        print(\"Workshop profile was not updated automatically.\")",
                "        print(f\"Profile snippet written here instead: {fallback}\")",
                "        print(\"Run again with --workshop /path/to/LedFX Scene Generator to update data/effects.yaml automatically.\")",
                "        return",
                "    text = profile_path.read_text(encoding=\"utf-8\")",
                "    backup = backup_if_exists(profile_path)",
                "    try:",
                "        data = json.loads(text)",
                "        if not isinstance(data, dict):",
                "            raise ValueError(\"effects.yaml root must be a mapping\")",
                "        data.setdefault(\"effects\", {})",
                "        if not isinstance(data[\"effects\"], dict):",
                "            raise ValueError(\"effects key must be a mapping\")",
                "        data[\"effects\"].update(profile)",
                "        write_text(profile_path, json.dumps(data, indent=2))",
                "    except Exception:",
                "        try:",
                "            import yaml  # type: ignore",
                "            data = yaml.safe_load(text) or {}",
                "            if not isinstance(data, dict):",
                "                raise RuntimeError(\"effects.yaml root must be a mapping\")",
                "            data.setdefault(\"effects\", {})",
                "            if not isinstance(data[\"effects\"], dict):",
                "                raise RuntimeError(\"effects key must be a mapping\")",
                "            data[\"effects\"].update(profile)",
                "            write_text(profile_path, yaml.safe_dump(data, sort_keys=False, allow_unicode=False))",
                "        except ModuleNotFoundError as exc:",
                "            raise RuntimeError(\"PyYAML is required to update a non-JSON effects.yaml file automatically.\") from exc",
                "    print(f\"Updated Workshop profile: {profile_path}\")",
                "    if backup:",
                "        print(f\"Previous profile backup: {backup}\")",
                "",
                "",
                "def main():",
                "    args = parse_args()",
                "    try:",
                "        effects_dirs = []",
                "        if not args.skip_module or args.list_targets:",
                "            effects_dirs = find_ledfx_effects_dirs(args.effects_dir)",
                "            if args.first_target_only:",
                "                effects_dirs = effects_dirs[:1]",
                "        if args.list_targets:",
                "            print(\"Detected LedFx effects folders:\")",
                "            for effects_dir in effects_dirs:",
                "                print(f\"- {effects_dir}\")",
                "            return 0",
                "        if not args.skip_module:",
                "            install_module(effects_dirs)",
                "        if not args.skip_workshop:",
                "            update_workshop_profile(args.workshop)",
                "    except Exception as exc:",
                "        return fail(str(exc))",
                "    print(\"Done. Restart LedFx, then refresh LedFx Workshop.\")",
                "    return 0",
                "",
                "",
                "if __name__ == \"__main__\":",
                "    raise SystemExit(main())",
                "",
            ]
        )

    @staticmethod
    def _effect_forge_instructions(
        effect_name: str,
        effect_id: str,
        module_path: Path,
        profile_yaml_path: Path,
        installer_path: Path,
    ) -> str:
        return "\n".join(
            [
                f"# Import {effect_name} into LedFx",
                "",
                "Effect Forge exports an experimental Python LedFx effect module plus a Workshop effect profile.",
                "This does not publish through the LedFx REST API. New Python effect code must be reviewed and copied into the LedFx installation manually.",
                "",
                "## What was saved",
                "",
                f"- {module_path.name} - the LedFx Python effect module.",
                f"- {profile_yaml_path.name} - the Workshop effect profile for this effect.",
                f"- {installer_path.name} - optional helper that can install the module and update the Workshop profile.",
                "- IMPORT_INSTRUCTIONS.md - this guide.",
                "",
                "## Fast path - run the installer",
                "",
                "Run the installer with the same Python environment that actually starts LedFx. If LedFx runs from a virtualenv, activate that virtualenv first. If LedFx runs in Docker, run this inside the container.",
                "",
                "macOS / Linux:",
                "",
                "```bash",
                "cd ~/Downloads",
                f"python {installer_path.name} --workshop \"/path/to/LedFX Scene Generator\"",
                "```",
                "",
                "Windows PowerShell:",
                "",
                "```powershell",
                "cd $env:USERPROFILE\\Downloads",
                f"py .\\{installer_path.name} --workshop \"C:\\path\\to\\LedFX Scene Generator\"",
                "```",
                "",
                "If you do not pass --workshop, the script installs the LedFx module and tells you how to add the Workshop profile manually.",
                "",
                "If you see ModuleNotFoundError, your terminal is using the wrong Python. Switch to the Python, virtualenv or container that runs LedFx, then run the installer again.",
                "",
                "## Manual path - find the LedFx effects folder",
                "",
                "Use the same Python environment that actually starts LedFx. If LedFx runs from a virtualenv, activate that virtualenv first. If LedFx runs in Docker, run the command inside the container.",
                "",
                "If you see ModuleNotFoundError, your terminal is using the wrong Python. In that case, do not copy files yet; first switch to the Python or container that runs LedFx.",
                "",
                "macOS / Linux, after activating the LedFx environment:",
                "",
                "```bash",
                "python - <<'PY'",
                "from pathlib import Path",
                "import ledfx",
                "print(Path(ledfx.__file__).resolve().parent / 'effects')",
                "PY",
                "```",
                "",
                "Windows PowerShell:",
                "",
                "```powershell",
                "py -c \"from pathlib import Path; import ledfx; print(Path(ledfx.__file__).resolve().parent / 'effects')\"",
                "```",
                "",
                "If import still fails, ask the package manager where LedFx is installed:",
                "",
                "macOS / Linux pip install:",
                "",
                "```bash",
                "python -m pip show ledfx",
                "# Use the Location value, then append /ledfx/effects",
                "```",
                "",
                "pipx on macOS / Linux:",
                "",
                "```bash",
                "pipx runpip ledfx show ledfx",
                "# Use the Location value, then append /ledfx/effects",
                "```",
                "",
                "Windows:",
                "",
                "```powershell",
                "py -m pip show ledfx",
                "# Use the Location value, then append \\ledfx\\effects",
                "```",
                "",
                "Docker / container install:",
                "",
                "Open a shell inside the container, or copy the module into the mounted LedFx source folder. A host Python command will not see LedFx unless LedFx is also installed on the host.",
                "",
                "## Manual step 2 - install the effect module",
                "",
                "Copy the generated Python module into the effects folder printed above.",
                "",
                "macOS / Linux example:",
                "",
                "```bash",
                f"cp {module_path.name} /path/to/site-packages/ledfx/effects/",
                "```",
                "",
                "Windows PowerShell example:",
                "",
                "```powershell",
                f"Copy-Item .\\{module_path.name} C:\\path\\to\\site-packages\\ledfx\\effects\\",
                "```",
                "",
                "## Manual step 3 - restart and verify LedFx",
                "",
                "Fully stop and restart LedFx. Then refresh Workshop or open LedFx /api/schema.",
                f"The new LedFx effect id should appear as: {effect_id}",
                "",
                "## Manual step 4 - add the Workshop effect profile",
                "",
                f"Open {profile_yaml_path.name}. Copy the generated effect entry into Workshop's data/effects.yaml.",
                "If data/effects.yaml already has an effects: block, copy only the nested effect entry under that block. Then restart or refresh Workshop so Scene Factory and Preset Lab can use it.",
                "",
                "Important: this is experimental code. Inspect imports, CONFIG_SCHEMA and audio hooks before using it live.",
            ]
        )

    def _scene(self, scene_id: str) -> Scene:
        if scene_id not in self.generated:
            raise KeyError(f"Unknown generated scene: {scene_id}")
        return self.generated[scene_id]

    @staticmethod
    def _assignment_for_update(scene: Scene, update: Dict[str, Any]):
        if "assignment_index" in update:
            index = int(update["assignment_index"])
            if 0 <= index < len(scene.assignments):
                return scene.assignments[index]
            raise KeyError(f"Unknown assignment index: {index}")
        virtual_id = str(update.get("virtual_id") or "")
        for assignment in scene.assignments:
            if assignment.virtual_id == virtual_id:
                return assignment
        raise KeyError(f"Unknown assignment virtual: {virtual_id}")

    @staticmethod
    def _sanitize_scene_action(value: Any, current_default: Any = None) -> str:
        action = str(value or current_default or "activate").strip().lower()
        if action == "active":
            action = "activate"
        if action not in VALID_SCENE_ACTIONS:
            raise ValueError("Scene action must be activate or ignore")
        return action

    @staticmethod
    def _validate_effect_type(effect_type: str, schema_effects: Dict[str, Any]) -> None:
        if effect_type not in schema_effects:
            raise ValueError(f"Unknown LedFx effect: {effect_type}")

    @staticmethod
    def _default_effect_config(effect_type: str, schema_effects: Dict[str, Any]) -> Dict[str, Any]:
        import copy

        properties = (
            schema_effects.get(effect_type, {})
            .get("schema", {})
            .get("properties", {})
        )
        return {
            key: copy.deepcopy(value.get("default"))
            for key, value in properties.items()
            if isinstance(value, dict) and "default" in value
        }

    @staticmethod
    def _ordered_unique_ids(values: List[Any]) -> List[str]:
        unique: List[str] = []
        for value in values:
            clean = str(value).strip()
            if clean and clean not in unique:
                unique.append(clean)
        return unique

    def _sanitize_virtual_ids(self, value: Any, known_virtual_ids: List[str]) -> List[str]:
        values = value if isinstance(value, list) else []
        clean = self._ordered_unique_ids(values)
        known = set(known_virtual_ids)
        if known:
            unknown = [item for item in clean if item not in known]
            if unknown:
                raise ValueError(f"Unknown target device: {unknown[0]}")
        return clean

    @staticmethod
    def _sync_scene_ignored_assignments(scene: Scene, virtual_order: List[str]) -> None:
        effect_assignments = [assignment for assignment in scene.assignments if assignment.effect_type]
        effect_targets = {assignment.virtual_id for assignment in effect_assignments}
        ordered_virtuals = AppState._ordered_unique_ids(
            list(virtual_order) + [assignment.virtual_id for assignment in scene.assignments]
        )
        ignored_assignments = [
            VirtualAssignment(
                virtual_id=virtual_id,
                effect_type="",
                config={},
                preset=None,
                preset_category=None,
                action="ignore",
            )
            for virtual_id in ordered_virtuals
            if virtual_id not in effect_targets
        ]
        scene.assignments = effect_assignments + ignored_assignments

    @staticmethod
    def _sync_virtual_ignore_entries(virtuals: Dict[str, Any], virtual_order: List[str]) -> None:
        ordered_virtuals = AppState._ordered_unique_ids(
            list(virtual_order) + [str(virtual_id) for virtual_id in virtuals.keys()]
        )
        effect_targets = {
            str(virtual_id)
            for virtual_id, virtual in virtuals.items()
            if isinstance(virtual, dict) and virtual.get("type")
        }
        for virtual_id in ordered_virtuals:
            if virtual_id not in effect_targets:
                virtuals[virtual_id] = {"action": "ignore"}

    def _sanitize_config_update(
        self, current_config: Dict[str, Any], config_update: Dict[str, Any]
    ) -> Dict[str, Any]:
        clean = dict(current_config)
        for key, value in config_update.items():
            if key not in current_config:
                continue
            clean[key] = self._coerce_config_value(current_config[key], value)
        self._sync_config_gradient_name(clean, config_update)
        return clean

    def _sync_config_gradient_name(self, config: Dict[str, Any], config_update: Dict[str, Any]) -> None:
        gradient = config.get("gradient")
        if not isinstance(gradient, str) or "linear-gradient" not in gradient:
            return
        if "gradient_name" not in config:
            return
        palette_name = self._palette_name_for_gradient(gradient)
        if palette_name:
            config["gradient_name"] = palette_name
        elif "gradient" in config_update and "gradient_name" not in config_update:
            config["gradient_name"] = "Current gradient"

    def _palette_name_for_gradient(self, gradient: str) -> Optional[str]:
        normalized = self._normalize_gradient(gradient)
        for palette in self.profiles["palettes"].get("palettes", []):
            palette_gradient = palette.get("gradient")
            if not isinstance(palette_gradient, str):
                continue
            if self._normalize_gradient(palette_gradient) == normalized:
                return str(palette.get("name") or palette.get("id") or "Workshop gradient")
        return None

    def _normalize_scene_gradient_names(self, scene: Scene) -> None:
        palette = self._profile_palette_by_id(scene.palette_id)
        palette_gradient = PaletteEngine.gradient(palette) if palette else ""
        palette_name = PaletteEngine.gradient_name(palette) if palette else ""
        for assignment in scene.assignments:
            config = assignment.config
            if not isinstance(config, dict) or "gradient_name" not in config:
                continue
            gradient = config.get("gradient")
            if not isinstance(gradient, str) or "linear-gradient" not in gradient:
                continue
            gradient_name = self._palette_name_for_gradient(gradient)
            if (
                not gradient_name
                and palette_name
                and self._normalize_gradient(gradient) == self._normalize_gradient(palette_gradient)
            ):
                gradient_name = palette_name
            config["gradient_name"] = gradient_name or "Current gradient"

    def _profile_palette_by_id(self, palette_id: str) -> Optional[Dict[str, Any]]:
        clean_id = str(palette_id or "").strip()
        if not clean_id:
            return None
        for palette in self.profiles["palettes"].get("palettes", []):
            if str(palette.get("id") or "") == clean_id:
                return palette
        return None

    @staticmethod
    def _normalize_gradient(gradient: str) -> str:
        return re.sub(r"\s+", "", gradient).lower()

    def _coerce_config_value(self, current_value: Any, value: Any) -> Any:
        if isinstance(current_value, bool):
            if isinstance(value, str):
                return value.lower() in ("1", "true", "yes", "on")
            return bool(value)
        if isinstance(current_value, int) and not isinstance(current_value, bool):
            return int(round(float(value)))
        if isinstance(current_value, float):
            return float(value)
        if isinstance(current_value, str):
            return str(value)
        if isinstance(current_value, list):
            if isinstance(value, list):
                return value
            if isinstance(value, str):
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            raise ValueError("Expected a list value")
        if isinstance(current_value, dict):
            if isinstance(value, dict):
                return value
            if isinstance(value, str):
                parsed = json.loads(value)
                if isinstance(parsed, dict):
                    return parsed
            raise ValueError("Expected an object value")
        return value

    def _normalize_options(self, options: Dict[str, Any]) -> Dict[str, Any]:
        clean = dict(options)
        clean["style"] = clean.get("style") or "techno"
        style_defaults = self._style_defaults(str(clean["style"]))
        clean["count"] = self._bounded_int(clean.get("count"), style_defaults["count"], 1, MAX_GENERATE_COUNT)
        clean["energy"] = self._bounded_float(clean.get("energy"), style_defaults["energy"])
        palette_ids = clean.get("palette_ids")
        if isinstance(palette_ids, str):
            palette_ids = [palette_ids]
        if not isinstance(palette_ids, list):
            palette_ids = [clean.get("palette_id") or "auto"]
        palette_ids = [str(item).strip() for item in palette_ids if str(item).strip()]
        specific_palette_ids = [item for item in palette_ids if item != "auto"]
        clean["palette_ids"] = specific_palette_ids or ["auto"]
        clean["palette_id"] = clean["palette_ids"][0]
        clean["layout"] = clean.get("layout") or style_defaults.get("layout") or "auto"
        effect_mode = str(clean.get("effect_mode") or "sound").strip()
        clean["effect_mode"] = effect_mode if effect_mode in ("sound", "non_sound", "all") else "sound"
        preset_mode = str(clean.get("preset_mode") or "generate").strip()
        clean["preset_mode"] = preset_mode if preset_mode in ("existing", "mixed", "generate") else "generate"
        clean["variation"] = self._bounded_float(clean.get("variation"), style_defaults["variation"])
        clean["brightness"] = self._bounded_float(clean.get("brightness"), style_defaults["brightness"])
        clean["movement"] = self._bounded_float(clean.get("movement"), style_defaults["movement"])
        clean["audio_response"] = self._bounded_float(clean.get("audio_response"), style_defaults["audio_response"])
        clean["density"] = self._bounded_float(clean.get("density"), style_defaults["density"])
        clean["flash"] = self._bounded_float(clean.get("flash"), style_defaults["flash"])
        clean["scene_types"] = list(clean.get("scene_types") or [])
        known_virtual_ids = list((self.client.get_virtuals().get("virtuals") or {}).keys())
        active_virtual_ids = self._sanitize_virtual_ids(
            clean.get("virtual_ids"),
            known_virtual_ids,
        )
        all_virtual_ids = self._sanitize_virtual_ids(
            clean.get("all_virtual_ids"),
            known_virtual_ids,
        )
        if not all_virtual_ids:
            all_virtual_ids = list(known_virtual_ids) or list(active_virtual_ids)
        clean["virtual_ids"] = active_virtual_ids
        clean["all_virtual_ids"] = self._ordered_unique_ids(
            list(all_virtual_ids) + list(active_virtual_ids)
        )
        clean["start_index"] = max(1, min(9999, int(clean.get("start_index", 1))))
        clean["name_prefix"] = re.sub(
            r"[^a-zA-Z0-9]+", "", str(clean.get("name_prefix") or "LSF")
        ).upper()[:8] or "LSF"
        clean["generation_tags"] = self._scene_tags_list(clean.get("generation_tags"))
        seed = str(clean.get("seed") or "").strip()
        clean["seed"] = seed[:80] if seed else None
        return clean

    def _style_defaults(self, style_id: str) -> Dict[str, Any]:
        style = self.profiles["styles"].get("styles", {}).get(style_id, {})
        return self._sanitize_style_defaults(None, style.get("defaults"))

    @staticmethod
    def _bounded_float(value: Any, fallback: float, low: float = 0.0, high: float = 1.0) -> float:
        try:
            numeric = float(value)
        except (TypeError, ValueError):
            numeric = fallback
        return max(low, min(high, numeric))

    @staticmethod
    def _bounded_int(value: Any, fallback: int, low: int, high: int) -> int:
        try:
            numeric = int(float(value))
        except (TypeError, ValueError):
            numeric = fallback
        return max(low, min(high, numeric))

    def _sanitize_palette(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        name = str(payload.get("name") or "Custom Palette").strip()[:80]
        palette_id = str(payload.get("id") or "").strip()
        if not palette_id or palette_id == "auto":
            palette_id = f"custom-{int(time.time())}"
        palette_id = re.sub(r"[^a-zA-Z0-9_-]+", "-", palette_id.lower()).strip("-")
        if not palette_id:
            palette_id = f"custom-{int(time.time())}"
        existing = next(
            (
                item
                for item in self.profiles["palettes"].get("palettes", [])
                if item.get("id") == palette_id
            ),
            {},
        )
        existing_colors = existing.get("colors") or {}
        provided_colors = payload.get("colors") or {}
        black_start = self._coerce_bool(
            payload.get("black_start", existing.get("black_start", True)),
            True,
        )
        colors: Dict[str, str] = {}
        for role in COLOR_ROLES:
            value = str(provided_colors.get(role) or existing_colors.get(role) or "#000000")
            colors[role] = value if HEX_COLOR.match(value) else "#000000"
        if black_start:
            colors["background"] = "#000000"
        if colors["strobe"] == "#000000":
            colors["strobe"] = "#ffffff"
        positions = self._sanitize_palette_positions(payload.get("positions"))
        gradient = self._palette_gradient(colors, positions)
        return {
            "id": palette_id,
            "name": name,
            "colors": colors,
            "black_start": black_start,
            "gradient": gradient,
            "positions": positions,
        }

    @staticmethod
    def _coerce_bool(value: Any, fallback: bool = False) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on"}:
                return True
            if normalized in {"0", "false", "no", "off"}:
                return False
        if value is None:
            return fallback
        return bool(value)

    @staticmethod
    def _sanitize_palette_positions(value: Any) -> Dict[str, int]:
        defaults = {
            "background": 0,
            "dark": 18,
            "low": 38,
            "mid": 62,
            "high": 84,
            "accent": 100,
        }
        if isinstance(value, dict):
            for role in defaults:
                try:
                    defaults[role] = int(round(float(value.get(role, defaults[role]))))
                except (TypeError, ValueError):
                    pass
        defaults["background"] = 0
        roles = ["dark", "low", "mid", "high", "accent"]
        last = 0
        for role in roles:
            minimum = last + 4
            maximum = 100 - (len(roles) - roles.index(role) - 1) * 4
            defaults[role] = max(minimum, min(maximum, defaults[role]))
            last = defaults[role]
        return defaults

    @staticmethod
    def _palette_gradient(colors: Dict[str, str], positions: Optional[Dict[str, int]] = None) -> str:
        positions = positions or {
            "background": 0,
            "dark": 18,
            "low": 38,
            "mid": 62,
            "high": 84,
            "accent": 100,
        }
        stops = [
            (colors.get("background", "#000000"), positions.get("background", 0)),
            (colors["dark"], positions.get("dark", 18)),
            (colors["low"], positions.get("low", 38)),
            (colors["mid"], positions.get("mid", 62)),
            (colors["high"], positions.get("high", 84)),
            (colors["accent"], positions.get("accent", 100)),
        ]
        return "linear-gradient(90deg, " + ", ".join(
            f"{color} {position}%" for color, position in stops
        ) + ")"

    @staticmethod
    def _sanitize_style_defaults(value: Any, existing: Any = None) -> Dict[str, Any]:
        base = dict(DEFAULT_STYLE_PARAMS)
        if isinstance(existing, dict):
            base.update(existing)
        if isinstance(value, dict):
            base.update(value)
        clean = dict(DEFAULT_STYLE_PARAMS)
        try:
            clean["count"] = max(1, min(MAX_GENERATE_COUNT, int(float(base.get("count", DEFAULT_STYLE_PARAMS["count"])))))
        except (TypeError, ValueError):
            clean["count"] = DEFAULT_STYLE_PARAMS["count"]
        for key in ("energy", "variation", "brightness", "movement", "audio_response", "density", "flash"):
            try:
                clean[key] = max(0.0, min(1.0, float(base.get(key, DEFAULT_STYLE_PARAMS[key]))))
            except (TypeError, ValueError):
                clean[key] = DEFAULT_STYLE_PARAMS[key]
        layout = str(base.get("layout") or "auto").strip()
        clean["layout"] = layout or "auto"
        return clean

    def _default_scene_type_weights(self) -> Dict[str, float]:
        return {scene_type: 1.0 for scene_type in self.profiles["styles"].get("scene_types", {})}

    @staticmethod
    def _sanitize_ledfx_url(value: Any) -> str:
        raw = str(value or "").strip().rstrip("/")
        if not raw:
            raise ValueError("LedFx URL is required")
        if not re.match(r"^https?://", raw):
            raw = f"http://{raw}"
        if not re.match(r"^https?://[^/\s:]+(?::\d+)?$", raw):
            raise ValueError("Use a URL like http://127.0.0.1:8888")
        return raw

    @staticmethod
    def _load_settings(default_ledfx_url: str) -> Dict[str, Any]:
        settings = {"ledfx_url": default_ledfx_url.rstrip("/")}
        if SETTINGS_FILE.exists():
            try:
                loaded = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
                if isinstance(loaded, dict) and loaded.get("ledfx_url"):
                    settings["ledfx_url"] = AppState._sanitize_ledfx_url(loaded["ledfx_url"])
            except Exception:
                pass
        return settings

    def _write_settings(self) -> None:
        SETTINGS_FILE.write_text(json.dumps(self.settings, indent=2) + "\n", encoding="utf-8")

    def _write_styles(self) -> None:
        path = DATA_DIR / "styles.yaml"
        body = json.dumps(self.profiles["styles"], indent=2) + "\n"
        path.write_text(body, encoding="utf-8")

    def _write_palettes(self) -> None:
        path = DATA_DIR / "palettes.yaml"
        body = json.dumps(self.profiles["palettes"], indent=2) + "\n"
        path.write_text(body, encoding="utf-8")


class RequestHandler(BaseHTTPRequestHandler):
    state: AppState
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"{self.address_string()} - {fmt % args}")

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/preview-stream":
            self._handle_preview_stream(parsed)
            return
        if parsed.path.startswith("/api/"):
            self._handle_api_get()
            return
        self._serve_static()

    def _handle_preview_stream(self, parsed: Any) -> None:
        query = parse_qs(parsed.query)
        vis_id = (query.get("vis_id") or [""])[0].strip()
        if not vis_id:
            self._json(400, {"error": "vis_id is required"})
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store, no-cache, max-age=0")
        self.send_header("Connection", "keep-alive")
        self.end_headers()
        try:
            for message in self.state.visualisation_stream(vis_id):
                body = f"data: {json.dumps(message, separators=(',', ':'))}\n\n".encode("utf-8")
                self.wfile.write(body)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception as exc:
            try:
                body = json.dumps({"stream_error": str(exc)}, separators=(",", ":"))
                self.wfile.write(f"data: {body}\n\n".encode("utf-8"))
                self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError):
                return

    def do_POST(self) -> None:
        self._handle_api_post()

    def _handle_api_get(self) -> None:
        try:
            if self.path == "/api/connection":
                self._json(200, self.state.connection_public())
                return
            if self.path == "/api/app-state":
                self._json(200, self.state.discovery_public())
                return
            if self.path == "/api/ledfx-library":
                self._json(200, self.state.ledfx_library())
                return
            self._json(404, {"error": "Unknown endpoint"})
        except LedFxApiError as exc:
            self._json(502, {"error": str(exc)})
        except Exception as exc:
            self._json(500, {"error": str(exc)})

    def _handle_api_post(self) -> None:
        try:
            body = self._read_json()
            if self.path == "/api/connection":
                self._json(200, self.state.update_connection(body))
                return
            if self.path == "/api/generate":
                self._json(200, self.state.generate(body))
                return
            if self.path == "/api/regenerate":
                self._json(200, self.state.regenerate(body["scene_id"], body.get("options")))
                return
            if self.path == "/api/presets/generate":
                self._json(200, self.state.generate_presets(body))
                return
            if self.path == "/api/presets/send":
                self._json(200, self.state.send_preset_drafts(body))
                return
            if self.path == "/api/presets/update":
                self._json(200, self.state.update_preset(body))
                return
            if self.path == "/api/presets/delete":
                self._json(200, self.state.delete_preset(body))
                return
            if self.path == "/api/presets/preview":
                self._json(200, self.state.preview_preset(body))
                return
            if self.path == "/api/keep":
                self._json(200, self.state.set_kept(body["scene_id"], bool(body.get("kept", True))))
                return
            if self.path == "/api/delete-scene":
                self._json(200, self.state.delete_generated(body["scene_id"]))
                return
            if self.path == "/api/update-scene":
                self._json(200, self.state.update_scene(body))
                return
            if self.path == "/api/preview":
                self._json(200, self.state.preview(body["scene_id"]))
                return
            if self.path == "/api/preview/restore":
                self._json(200, self.state.restore_preview())
                return
            if self.path == "/api/save-batch":
                self._json(200, self.state.save_batch(body.get("scene_ids")))
                return
            if self.path == "/api/repair-ledfx-scenes":
                self._json(200, self.state.repair_published_scenes())
                return
            if self.path == "/api/ledfx-scenes/rename":
                self._json(200, self.state.rename_ledfx_scene(body))
                return
            if self.path == "/api/ledfx-scenes/update":
                self._json(200, self.state.update_ledfx_scene(body))
                return
            if self.path == "/api/ledfx-scenes/activate":
                self._json(200, self.state.activate_ledfx_scene(body))
                return
            if self.path == "/api/ledfx-scenes/delete":
                self._json(200, self.state.delete_ledfx_scene(body))
                return
            if self.path == "/api/ledfx-scenes/batch-delete":
                self._json(200, self.state.batch_delete_ledfx_scenes(body))
                return
            if self.path == "/api/ledfx-scenes/batch-tag":
                self._json(200, self.state.batch_tag_ledfx_scenes(body))
                return
            if self.path == "/api/ledfx-scenes/shorten-lsf":
                self._json(200, self.state.shorten_lsf_scene_names())
                return
            if self.path == "/api/playlists/save":
                self._json(200, self.state.save_playlist(body))
                return
            if self.path == "/api/playlists/delete":
                self._json(200, self.state.delete_playlist(body))
                return
            if self.path == "/api/playlists/control":
                self._json(200, self.state.control_playlist(body))
                return
            if self.path == "/api/palettes/save":
                self._json(200, self.state.save_palette(body))
                return
            if self.path == "/api/palettes/delete":
                self._json(200, self.state.delete_palette(body))
                return
            if self.path == "/api/styles/save":
                self._json(200, self.state.save_style(body))
                return
            if self.path == "/api/styles/delete":
                self._json(200, self.state.delete_style(body))
                return
            if self.path == "/api/effect-forge/save":
                self._json(200, self.state.save_effect_forge(body))
                return
            self._json(404, {"error": "Unknown endpoint"})
        except LedFxApiError as exc:
            self._json(502, {"error": str(exc)})
        except KeyError as exc:
            self._json(404, {"error": str(exc)})
        except ValueError as exc:
            self._json(400, {"error": str(exc)})
        except Exception as exc:
            self._json(500, {"error": str(exc)})

    def _serve_static(self) -> None:
        path = self.path.split("?", 1)[0]
        if path in ("", "/"):
            file_path = UI_DIR / "index.html"
        else:
            file_path = (UI_DIR / path.lstrip("/")).resolve()
            if UI_DIR not in file_path.parents and file_path != UI_DIR:
                self.send_error(403)
                return
        if not file_path.exists() or not file_path.is_file():
            self.send_error(404)
            return
        content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
        content = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def _read_json(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length") or "0")
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)

    def _json(self, status: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def find_port(preferred: int) -> int:
    for port in range(preferred, preferred + 40):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No free local port found")


def main() -> None:
    parser = argparse.ArgumentParser(description="LedFx Workshop")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8017)
    parser.add_argument("--ledfx", default="http://127.0.0.1:8888")
    args = parser.parse_args()
    port = find_port(args.port)
    state = AppState(args.ledfx)
    RequestHandler.state = state
    server = ReusableThreadingHTTPServer((args.host, port), RequestHandler)
    print(f"LedFx Workshop: http://{args.host}:{port}")
    print(f"LedFx API: {args.ledfx}")
    server.serve_forever()


if __name__ == "__main__":
    main()
