from __future__ import annotations

import random
from typing import Any, Dict, List, Optional


class EffectSelector:
    def __init__(self, effects_data: Dict[str, Any], styles_data: Dict[str, Any]):
        self.effects = effects_data.get("effects", {})
        self.styles = styles_data.get("styles", {})

    def choose(
        self,
        scene_type: str,
        style: str,
        energy: float,
        schema_effects: Dict[str, Any],
        ledfx_presets: Dict[str, Any],
        rng: random.Random,
        exclude: Optional[List[str]] = None,
        effect_counts: Optional[Dict[str, int]] = None,
        recent_effects: Optional[List[str]] = None,
        variation: float = 0.55,
        movement_target: Optional[float] = None,
        audio_target: Optional[float] = None,
        effect_mode: str = "sound",
        preset_bank: Optional[List[Dict[str, Any]]] = None,
        preset_bank_mode: str = "assist",
    ) -> Dict[str, Any]:
        exclude = exclude or []
        effect_counts = effect_counts or {}
        recent_effects = recent_effects or []
        variation = max(0.0, min(1.0, variation))
        weighted: List[tuple[float, str, Dict[str, Any]]] = []
        style_profile = self.styles.get(style, {})
        style_match = style_profile.get("base_style") or style
        effect_bias = style_profile.get("effect_bias", {})
        effect_mode = effect_mode if effect_mode in ("sound", "non_sound", "all") else "sound"
        for effect_id, profile in self.effects.items():
            if effect_id in exclude or effect_id not in schema_effects:
                continue
            if not self._matches_audio_mode(profile, effect_mode):
                continue
            audio_reactivity = float(profile.get("audio_reactivity", 0.0))
            if scene_type not in profile.get("scene_types", []):
                continue
            if style_match not in profile.get("styles", []):
                continue
            low, high = profile.get("energy", [0.0, 1.0])
            if energy < low - 0.18 or energy > high + 0.18:
                continue
            midpoint = (low + high) / 2.0
            closeness = 1.0 - min(1.0, abs(energy - midpoint))
            score = (
                max(0.05, closeness)
                * float(profile.get("rarity", 1.0))
                * float(effect_bias.get(effect_id, 1.0))
                * (0.75 + audio_reactivity * 0.5)
            )
            if movement_target is not None:
                movement = float(profile.get("movement", 0.5))
                movement_match = 1.0 - min(1.0, abs(float(movement_target) - movement))
                score *= 0.65 + movement_match * 0.35
            if audio_target is not None:
                audio_match = 1.0 - min(1.0, abs(float(audio_target) - audio_reactivity))
                score *= 0.65 + audio_match * 0.35
            count = effect_counts.get(effect_id, 0)
            if count:
                score *= 1.0 / (1.0 + count * (0.35 + variation * 0.45))
            if effect_id in recent_effects:
                recency_index = recent_effects.index(effect_id)
                score *= max(0.18, 1.0 - (0.55 + variation * 0.3) / (recency_index + 1))
            weighted.append((score, effect_id, profile))
        if not weighted:
            for effect_id, profile in self.effects.items():
                if (
                    effect_id in schema_effects
                    and effect_id not in exclude
                    and self._matches_audio_mode(profile, effect_mode)
                ):
                    weighted.append((0.1, effect_id, profile))
        if not weighted and exclude:
            for effect_id, profile in self.effects.items():
                if (
                    effect_id in schema_effects
                    and self._matches_audio_mode(profile, effect_mode)
                ):
                    weighted.append((0.05, effect_id, profile))
        if not weighted:
            raise ValueError("No configured effects match the selected audio-reactivity mode")
        effect_id, profile = self._weighted_pick(weighted, rng)
        preset = self.choose_preset(
            effect_id,
            profile,
            scene_type,
            ledfx_presets,
            rng,
            preset_bank=preset_bank,
            preset_bank_mode=preset_bank_mode,
        )
        return {
            "effect_type": effect_id,
            "profile": profile,
            "preset_id": preset["id"] if preset else None,
            "preset_category": preset["category"] if preset else None,
            "preset_name": preset.get("name") if preset else None,
            "preset_config": preset.get("config") if preset else None,
            "preset_source": preset.get("source") if preset else None,
        }

    @staticmethod
    def _is_audio_reactive(profile: Dict[str, Any]) -> bool:
        return bool(profile.get("audio_reactive"))

    @classmethod
    def _matches_audio_mode(cls, profile: Dict[str, Any], effect_mode: str) -> bool:
        if effect_mode == "all":
            return True
        is_reactive = cls._is_audio_reactive(profile)
        if effect_mode == "non_sound":
            return not is_reactive
        return is_reactive

    @staticmethod
    def _weighted_pick(
        weighted: List[tuple[float, str, Dict[str, Any]]], rng: random.Random
    ) -> tuple[str, Dict[str, Any]]:
        total = sum(max(0.0, item[0]) for item in weighted)
        if total <= 0:
            _, effect_id, profile = rng.choice(weighted)
            return effect_id, profile
        target = rng.random() * total
        upto = 0.0
        for score, effect_id, profile in weighted:
            upto += max(0.0, score)
            if upto >= target:
                return effect_id, profile
        _, effect_id, profile = weighted[-1]
        return effect_id, profile

    @staticmethod
    def choose_preset(
        effect_id: str,
        profile: Dict[str, Any],
        scene_type: str,
        ledfx_presets: Dict[str, Any],
        rng: random.Random,
        preset_bank: Optional[List[Dict[str, Any]]] = None,
        preset_bank_mode: str = "assist",
    ) -> Optional[Dict[str, Any]]:
        available = ledfx_presets.get(effect_id, {})
        bank_items = [
            item
            for item in (preset_bank or [])
            if (
                isinstance(item, dict)
                and item.get("enabled", True) is not False
                and str(item.get("effect_type") or "") == effect_id
                and isinstance(item.get("config"), dict)
            )
        ]
        preset_bank_mode = preset_bank_mode if preset_bank_mode in ("off", "assist", "prefer") else "assist"
        bank_chance = {"off": 0.0, "assist": 0.35, "prefer": 0.72}.get(preset_bank_mode, 0.35)
        should_use_bank = bool(bank_items) and (not available or rng.random() < bank_chance)
        if should_use_bank:
            item = rng.choice(bank_items)
            return {
                "id": str(item.get("id") or item.get("name") or "preset-bank"),
                "name": str(item.get("name") or item.get("id") or "Preset bank item"),
                "category": "preset_bank",
                "source": "Preset Bank",
                "config": item.get("config") or {},
            }
        if not available:
            return None
        preferred = profile.get("preferred_presets", {}).get(scene_type, [])
        usable = [preset for preset in preferred if preset in available]
        if usable:
            preset_id = rng.choice(usable)
        else:
            preset_id = rng.choice(list(available.keys()))
        preset = available.get(preset_id) or {}
        return {
            "id": preset_id,
            "name": str(preset.get("name") or preset_id),
            "category": str(preset.get("category") or preset.get("_category") or "ledfx_presets"),
            "source": str(preset.get("category") or preset.get("_category") or "ledfx_presets"),
        }
