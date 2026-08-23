from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any, Dict, Iterable, Optional

from src.models.scene import Scene, VirtualAssignment


class LedFxApiError(RuntimeError):
    pass


class LedFxClient:
    def __init__(self, base_url: str = "http://127.0.0.1:8888", timeout: float = 8.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _url(self, path: str) -> str:
        if not path.startswith("/"):
            path = "/" + path
        return self.base_url + path

    def _request(
        self, method: str, path: str, payload: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        data = None
        headers = {"Accept": "application/json"}
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(
            self._url(path),
            data=data,
            headers=headers,
            method=method.upper(),
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                body = response.read().decode("utf-8")
                if not body:
                    return {}
                try:
                    return json.loads(body)
                except json.JSONDecodeError:
                    return {"raw": body}
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise LedFxApiError(f"{method} {path} failed: HTTP {exc.code}: {body}") from exc
        except urllib.error.URLError as exc:
            raise LedFxApiError(f"{method} {path} failed: {exc.reason}") from exc

    def get_info(self) -> Dict[str, Any]:
        return self._request("GET", "/api/info")

    def get_schema(self) -> Dict[str, Any]:
        return self._request("GET", "/api/schema")

    def get_config(self) -> Dict[str, Any]:
        return self._request("GET", "/api/config")

    def get_virtuals(self) -> Dict[str, Any]:
        return self._request("GET", "/api/virtuals")

    def get_effects(self) -> Dict[str, Any]:
        return self._request("GET", "/api/effects")

    def get_scenes(self) -> Dict[str, Any]:
        return self._request("GET", "/api/scenes")

    def get_playlists(self) -> Dict[str, Any]:
        return self._request("GET", "/api/playlists")

    def get_playlist(self, playlist_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/api/playlists/{playlist_id}")

    def get_effect_presets(self, effect_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/api/effects/{effect_id}/presets")

    def discovery(self) -> Dict[str, Any]:
        info = self.get_info()
        schema = self.get_schema()
        config = self.get_config()
        virtuals = self.get_virtuals()
        effects = self.get_effects()
        scenes = self.get_scenes()
        return {
            "info": info,
            "schema": schema,
            "config": config,
            "virtuals": virtuals,
            "effects": effects,
            "scenes": scenes,
        }

    def snapshot_effects(self, virtual_ids: Iterable[str]) -> Dict[str, Dict[str, Any]]:
        data = self.get_virtuals()
        all_virtuals = data.get("virtuals", {})
        snapshot: Dict[str, Dict[str, Any]] = {}
        for virtual_id in virtual_ids:
            virtual = all_virtuals.get(virtual_id, {})
            effect = virtual.get("effect") or {}
            snapshot[virtual_id] = {
                "active": bool(virtual.get("active")),
                "effect": effect,
            }
        return snapshot

    def set_virtual_effect(self, assignment: VirtualAssignment) -> Dict[str, Any]:
        return self._request(
            "POST",
            f"/api/virtuals/{assignment.virtual_id}/effects",
            assignment.to_effect_payload(),
        )

    def clear_virtual_effect(self, virtual_id: str) -> Dict[str, Any]:
        return self._request("DELETE", f"/api/virtuals/{virtual_id}/effects")

    def set_virtual_preset(
        self,
        virtual_id: str,
        effect_id: str,
        preset_id: str,
        category: str = "ledfx_presets",
    ) -> Dict[str, Any]:
        response = self._request(
            "PUT",
            f"/api/virtuals/{virtual_id}/presets",
            {
                "category": category,
                "effect_id": effect_id,
                "preset_id": preset_id,
            },
        )
        self._raise_if_failed("PUT", f"/api/virtuals/{virtual_id}/presets", response)
        return response

    def save_active_effect_as_preset(self, virtual_id: str, name: str) -> Dict[str, Any]:
        response = self._request(
            "POST",
            f"/api/virtuals/{virtual_id}/presets",
            {"name": name},
        )
        self._raise_if_failed("POST", f"/api/virtuals/{virtual_id}/presets", response)
        return response

    def delete_effect_preset(
        self,
        effect_id: str,
        preset_id: str,
        category: str = "user_presets",
    ) -> Dict[str, Any]:
        response = self._request(
            "DELETE",
            f"/api/effects/{effect_id}/presets",
            {"preset_id": preset_id, "category": category},
        )
        self._raise_if_failed("DELETE", f"/api/effects/{effect_id}/presets", response)
        return response

    def apply_scene(self, scene: Scene) -> None:
        for assignment in scene.assignments:
            if assignment.action == "ignore":
                continue
            self.set_virtual_effect(assignment)

    def restore_snapshot(self, snapshot: Dict[str, Dict[str, Any]]) -> None:
        for virtual_id, saved in snapshot.items():
            effect = saved.get("effect") or {}
            effect_type = effect.get("type")
            config = effect.get("config")
            if effect_type and isinstance(config, dict):
                self.set_virtual_effect(
                    VirtualAssignment(
                        virtual_id=virtual_id,
                        effect_type=effect_type,
                        config=config,
                    )
                )
            else:
                self.clear_virtual_effect(virtual_id)

    def save_scene(self, scene: Scene) -> Dict[str, Any]:
        payload = scene.to_ledfx_payload(include_id=bool(scene.ledfx_scene_id))
        self._fill_missing_virtuals(payload)
        response = self._request(
            "POST",
            "/api/scenes",
            payload,
        )
        self._raise_if_failed("POST", "/api/scenes", response)
        return response

    def save_scene_payload(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        self._fill_missing_virtuals(payload)
        response = self._request("POST", "/api/scenes", payload)
        self._raise_if_failed("POST", "/api/scenes", response)
        return response

    def update_scene_fields(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        response = self._request("POST", "/api/scenes", payload)
        self._raise_if_failed("POST", "/api/scenes", response)
        return response

    def activate_scene(self, scene_id: str) -> Dict[str, Any]:
        response = self._request("PUT", "/api/scenes", {"id": scene_id, "action": "activate"})
        self._raise_if_failed("PUT", "/api/scenes", response)
        return response

    def rename_scene(self, scene_id: str, name: str) -> Dict[str, Any]:
        response = self._request(
            "PUT",
            "/api/scenes",
            {"id": scene_id, "action": "rename", "name": name},
        )
        self._raise_if_failed("PUT", "/api/scenes", response)
        return response

    def delete_scene(self, scene_id: str) -> Dict[str, Any]:
        response = self._request("DELETE", "/api/scenes", {"id": scene_id})
        self._raise_if_failed("DELETE", "/api/scenes", response)
        return response

    def save_playlist(self, playlist: Dict[str, Any]) -> Dict[str, Any]:
        response = self._request("POST", "/api/playlists", playlist)
        self._raise_if_failed("POST", "/api/playlists", response)
        return response

    def delete_playlist(self, playlist_id: str) -> Dict[str, Any]:
        response = self._request("DELETE", "/api/playlists", {"id": playlist_id})
        self._raise_if_failed("DELETE", "/api/playlists", response)
        return response

    def control_playlist(
        self,
        action: str,
        playlist_id: Optional[str] = None,
        mode: Optional[str] = None,
        timing: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {"action": action}
        if playlist_id:
            payload["id"] = playlist_id
        if mode:
            payload["mode"] = mode
        if timing is not None:
            payload["timing"] = timing
        response = self._request("PUT", "/api/playlists", payload)
        self._raise_if_failed("PUT", "/api/playlists", response)
        return response

    def _fill_missing_virtuals(self, payload: Dict[str, Any]) -> None:
        payload_virtuals = payload.setdefault("virtuals", {})
        for virtual_id in (self.get_virtuals().get("virtuals") or {}).keys():
            payload_virtuals.setdefault(virtual_id, {"action": "ignore"})

    @staticmethod
    def _raise_if_failed(method: str, path: str, response: Dict[str, Any]) -> None:
        if response.get("status") not in (None, "success"):
            payload = response.get("payload") or {}
            reason = payload.get("reason") or payload.get("message") or json.dumps(response)
            raise LedFxApiError(f"{method} {path} failed: {reason}")
