from __future__ import annotations

import copy
import random
from typing import Any, Dict, Optional

from src.generator.palette_engine import PaletteEngine


class ParameterRandomizer:
    def build_config(
        self,
        choice: Dict[str, Any],
        palette: Dict[str, Any],
        energy: float,
        schema_effects: Dict[str, Any],
        ledfx_presets: Dict[str, Any],
        rng: random.Random,
        variation: float = 0.55,
    ) -> Dict[str, Any]:
        effect_type = choice["effect_type"]
        profile = choice["profile"]
        config = self._base_config(
            effect_type,
            choice.get("preset_id"),
            schema_effects,
            ledfx_presets,
            preset_config=choice.get("preset_config"),
        )
        variation = max(0.0, min(1.0, variation))
        scene_tone = self._clamp01(rng.gauss(energy, 0.08 + variation * 0.12))
        properties = (
            schema_effects.get(effect_type, {})
            .get("schema", {})
            .get("properties", {})
        )
        for key, spec in profile.get("safe_params", {}).items():
            if key not in properties:
                continue
            if spec.get("chance") is not None and rng.random() > float(spec["chance"]):
                continue
            config[key] = self._random_value(
                key,
                spec,
                properties[key],
                scene_tone,
                rng,
                variation,
                config.get(key),
            )
        self._apply_palette(config, profile, properties, palette)
        for key in ("diag", "advanced", "test", "dump"):
            if key in config:
                config[key] = False
        return config

    def _base_config(
        self,
        effect_type: str,
        preset_id: Optional[str],
        schema_effects: Dict[str, Any],
        ledfx_presets: Dict[str, Any],
        preset_config: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if isinstance(preset_config, dict):
            return copy.deepcopy(preset_config)
        if preset_id:
            preset = ledfx_presets.get(effect_type, {}).get(preset_id)
            if preset and isinstance(preset.get("config"), dict):
                return copy.deepcopy(preset["config"])
        properties = (
            schema_effects.get(effect_type, {})
            .get("schema", {})
            .get("properties", {})
        )
        return {
            key: copy.deepcopy(value.get("default"))
            for key, value in properties.items()
            if "default" in value
        }

    def _random_value(
        self,
        key: str,
        spec: Dict[str, Any],
        schema_prop: Dict[str, Any],
        energy: float,
        rng: random.Random,
        variation: float,
        current_value: Any = None,
    ) -> Any:
        if "choices" in spec:
            valid = schema_prop.get("enum")
            choices = [item for item in spec["choices"] if not valid or item in valid]
            if current_value in choices and rng.random() > 0.28 + variation * 0.52:
                return current_value
            return rng.choice(choices or list(valid or spec["choices"]))
        prop_type = schema_prop.get("type")
        if prop_type == "boolean":
            if isinstance(current_value, bool) and rng.random() > 0.32 + variation * 0.5:
                return current_value
            return rng.random() < float(spec.get("probability", 0.5))
        if "probability" in spec and prop_type not in ("number", "integer", "int"):
            return rng.random() < float(spec["probability"])
        low, high = self._numeric_range(spec, schema_prop)
        scale = spec.get("energy", "direct")
        t = energy
        if scale == "inverse":
            t = 1.0 - energy
        elif scale == "center":
            t = 0.5
        mean = low + (high - low) * max(0.0, min(1.0, t))
        if isinstance(current_value, (int, float)) and low <= float(current_value) <= high:
            blend = 0.25 + variation * 0.55
            mean = float(current_value) * (1.0 - blend) + mean * blend
        spread = (0.035 + float(spec.get("spread", 0.2)) * variation) * (high - low)
        value = rng.gauss(mean, max(0.0001, spread / 2.0))
        if rng.random() < 0.14 * variation:
            value = rng.triangular(low, high, mean)
        value = max(low, min(high, value))
        if prop_type in ("integer", "int") or isinstance(schema_prop.get("default"), int):
            return int(round(value))
        return round(value, 3)

    @staticmethod
    def _numeric_range(spec: Dict[str, Any], schema_prop: Dict[str, Any]) -> tuple[float, float]:
        configured = spec.get("range", [schema_prop.get("minimum", 0), schema_prop.get("maximum", 1)])
        low = float(configured[0])
        high = float(configured[1])
        if schema_prop.get("minimum") is not None:
            low = max(low, float(schema_prop["minimum"]))
        if schema_prop.get("maximum") is not None:
            high = min(high, float(schema_prop["maximum"]))
        if high < low:
            high = low
        return low, high

    @staticmethod
    def _clamp01(value: float) -> float:
        return max(0.0, min(1.0, value))

    def _apply_palette(
        self,
        config: Dict[str, Any],
        profile: Dict[str, Any],
        properties: Dict[str, Any],
        palette: Dict[str, Any],
    ) -> None:
        gradient_applied = False
        palette_gradient = PaletteEngine.gradient(palette)
        palette_name = PaletteEngine.gradient_name(palette)
        for key, role in profile.get("palette_keys", {}).items():
            if role == "gradient":
                config[key] = palette_gradient
                gradient_applied = True
            else:
                config[key] = PaletteEngine.color(palette, role)
        for key, value in list(config.items()):
            lower_key = key.lower()
            if lower_key == "gradient_name":
                continue
            if self._is_existing_gradient_field(lower_key, value):
                config[key] = palette_gradient
                gradient_applied = True
                continue
            if isinstance(value, str) and self._looks_like_hex_color(value):
                role = self._role_for_color_key(lower_key)
                if role:
                    config[key] = PaletteEngine.color(palette, role)
        for key, prop in properties.items():
            if prop.get("type") != "color":
                continue
            if prop.get("gradient"):
                if key in config or key == "gradient":
                    config[key] = palette_gradient
                    gradient_applied = True
            elif key not in config:
                continue
            else:
                role = self._role_for_color_key(key.lower())
                if role:
                    config[key] = PaletteEngine.color(palette, role)
        if gradient_applied:
            config["gradient_name"] = palette_name

    @staticmethod
    def _looks_like_hex_color(value: str) -> bool:
        clean = value.strip()
        if not clean.startswith("#") or len(clean) not in (4, 7, 9):
            return False
        try:
            int(clean[1:], 16)
        except ValueError:
            return False
        return True

    @staticmethod
    def _is_existing_gradient_field(key: str, value: Any) -> bool:
        if key in {"gradient", "color_gradient"}:
            return True
        return "gradient" in key and isinstance(value, str) and "linear-gradient" in value

    @staticmethod
    def _role_for_color_key(key: str) -> Optional[str]:
        if "background" in key or key in {"bg", "bg_color"}:
            return "background"
        if "strobe" in key or "flash" in key:
            return "strobe"
        if "low" in key or "lows" in key or "bass" in key:
            return "low"
        if "mid" in key or "mids" in key:
            return "mid"
        if "high" in key or "treble" in key:
            return "high"
        if "accent" in key:
            return "accent"
        if key in {"color", "colour", "single_color"}:
            return "mid"
        return None
