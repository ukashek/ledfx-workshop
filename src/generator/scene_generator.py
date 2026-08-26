from __future__ import annotations

import copy
import random
import time
from typing import Any, Dict, List, Optional

from src.generator.effect_selector import EffectSelector
from src.generator.layout_engine import LayoutEngine
from src.generator.name_utils import compact_scene_name
from src.generator.palette_engine import PaletteEngine
from src.generator.parameter_randomizer import ParameterRandomizer
from src.generator.scene_scorer import SceneScorer
from src.models.scene import Scene, VirtualAssignment


class SceneGenerator:
    def __init__(
        self,
        effects_data: Dict[str, Any],
        palettes_data: Dict[str, Any],
        styles_data: Dict[str, Any],
        schema: Dict[str, Any],
        ledfx_config: Dict[str, Any],
        preset_bank_items: Optional[List[Dict[str, Any]]] = None,
    ):
        self.effects_data = effects_data
        self.styles_data = styles_data
        self.schema_effects = schema.get("effects", {})
        self.ledfx_presets = self._merged_presets(ledfx_config)
        self.preset_bank_items = list(preset_bank_items or [])
        self.palette_engine = PaletteEngine(palettes_data)
        self.selector = EffectSelector(effects_data, styles_data)
        self.randomizer = ParameterRandomizer()
        self.layout_engine = LayoutEngine()
        self.scorer = SceneScorer()
        self.scene_types = styles_data.get("scene_types", {})

    @staticmethod
    def _merged_presets(ledfx_config: Dict[str, Any]) -> Dict[str, Any]:
        merged: Dict[str, Any] = {}
        for category in ("ledfx_presets", "user_presets"):
            for effect_id, presets in (ledfx_config.get(category) or {}).items():
                if not isinstance(presets, dict):
                    continue
                effect_presets = merged.setdefault(effect_id, {})
                for preset_id, preset in presets.items():
                    if not isinstance(preset, dict):
                        continue
                    clean = copy.deepcopy(preset)
                    clean["category"] = category
                    effect_presets[str(preset_id)] = clean
        return merged

    def generate_batch(self, options: Dict[str, Any]) -> List[Scene]:
        count = int(options.get("count", 10))
        count = max(1, min(250, count))
        existing = list(options.get("existing_scenes", []))
        rng = random.Random(options.get("seed") or self._seed(options))
        variation = max(0.0, min(1.0, float(options.get("variation", 0.6))))
        run_id = time.strftime("%Y%m%d-%H%M%S")
        scenes: List[Scene] = []
        attempts = 0
        max_attempts = max(80, count * 30)
        while len(scenes) < count and attempts < max_attempts:
            attempts += 1
            scene = self.generate_one(
                options=options,
                index=len(scenes) + 1,
                run_id=run_id,
                rng=rng,
                previous_scenes=existing + scenes,
                variation=variation,
            )
            duplicate_threshold = 0.84 - variation * 0.12
            duplicate_threshold += min(0.10, attempts / max_attempts * 0.10)
            if self.scorer.is_duplicate(scene, existing + scenes, threshold=duplicate_threshold):
                continue
            scenes.append(scene)
        return scenes

    def similarity_report(self, scenes: List[Scene]) -> Dict[str, Any]:
        return self.scorer.batch_report(scenes)

    def generate_one(
        self,
        options: Dict[str, Any],
        index: int,
        run_id: str,
        rng: random.Random,
        previous_scenes: Optional[List[Scene]] = None,
        variation: float = 0.6,
    ) -> Scene:
        previous_scenes = previous_scenes or []
        style = options.get("style") or "techno"
        base_energy = max(0.0, min(1.0, float(options.get("energy", 0.65))))
        flash = self._option_value(options, "flash", 0.45)
        movement = self._option_value(options, "movement", 0.55)
        audio_response = self._option_value(options, "audio_response", 0.6)
        scene_type = self._choose_scene_type(
            style=style,
            selected=options.get("scene_types") or list(self.scene_types.keys()),
            base_energy=base_energy,
            rng=rng,
            previous_scenes=previous_scenes,
            variation=variation,
            flash=flash,
        )
        energy = self._scene_energy(scene_type, base_energy, rng, variation)
        style_profile = self.styles_data.get("styles", {}).get(style, {})
        palette = self.palette_engine.get_from_ids(
            options.get("palette_ids") or [options.get("palette_id", "auto")],
            rng,
            palette_bias=style_profile.get("palette_bias"),
        )
        virtual_ids = list(options.get("virtual_ids") or [])
        all_virtual_ids = self._ordered_unique(
            list(options.get("all_virtual_ids") or []) + virtual_ids
        )
        if not virtual_ids:
            raise ValueError("At least one LedFx Device is required")
        layout = self.layout_engine.choose_layout(
            options.get("layout", "auto"), scene_type, len(virtual_ids), rng
        )
        assignments = self._assign_virtuals(
            virtual_ids=virtual_ids,
            layout=layout,
            scene_type=scene_type,
            style=style,
            energy=energy,
            palette=palette,
            rng=rng,
            previous_scenes=previous_scenes,
            variation=variation,
            movement_target=movement,
            audio_target=audio_response,
            effect_mode=str(options.get("effect_mode") or "sound"),
            preset_bank_mode=str(options.get("preset_bank_mode") or "assist"),
        )
        assignments.extend(self._ignored_assignments(all_virtual_ids, virtual_ids))
        self._apply_global_tuning(assignments, options)
        mood_tags = self._mood_tags(scene_type, style, energy, layout, palette, assignments)
        style_name = style_profile.get("name", style.replace("_", " ").title())
        display_index = max(1, int(options.get("start_index", 1))) + index - 1
        safe_name = self._scene_name(
            display_index,
            style_name,
            scene_type,
            palette.get("name", palette["id"]),
            options.get("name_prefix", "LSF"),
        )
        tags = self._ordered_unique(self._scene_tags(options, style, scene_type, layout, palette) + mood_tags)
        scene = Scene(
            id=f"lsf-{run_id}-{display_index:03d}-{rng.randrange(1000, 9999)}",
            name=safe_name,
            scene_type=scene_type,
            style=style,
            palette_id=palette["id"],
            palette_name=palette.get("name", palette["id"]),
            energy=round(energy, 3),
            layout=layout,
            assignments=assignments,
            tags=tags,
            mood_tags=mood_tags,
        )
        scene.fingerprint = self.scorer.fingerprint(scene)
        return scene

    def _assign_virtuals(
        self,
        virtual_ids: List[str],
        layout: str,
        scene_type: str,
        style: str,
        energy: float,
        palette: Dict[str, Any],
        rng: random.Random,
        previous_scenes: Optional[List[Scene]] = None,
        variation: float = 0.6,
        movement_target: float = 0.55,
        audio_target: float = 0.6,
        effect_mode: str = "sound",
        preset_bank_mode: str = "assist",
    ) -> List[VirtualAssignment]:
        previous_scenes = previous_scenes or []
        role_infos = self.layout_engine.roles(virtual_ids, layout)
        role_choices: Dict[str, Dict[str, Any]] = {}
        assignments: List[VirtualAssignment] = []
        effect_counts = self._effect_counts(previous_scenes)
        recent_effects = self._recent_effects(previous_scenes, limit=5)
        for role_info in role_infos:
            role = role_info["role"]
            role_type = self._role_scene_type(scene_type, role)
            role_energy = self._role_energy(energy, role)
            if role not in role_choices:
                excluded = []
                if layout in ("alternate", "accent") and role != "primary":
                    primary = role_choices.get("primary")
                    if primary:
                        excluded = [primary["effect_type"]]
                role_choices[role] = self.selector.choose(
                    scene_type=role_type,
                    style=style,
                    energy=role_energy,
                    schema_effects=self.schema_effects,
                    ledfx_presets=self.ledfx_presets,
                    rng=rng,
                    exclude=excluded,
                    effect_counts=effect_counts,
                    recent_effects=recent_effects,
                    variation=variation,
                    movement_target=movement_target,
                    audio_target=audio_target,
                    effect_mode=effect_mode,
                    preset_bank=self.preset_bank_items,
                    preset_bank_mode=preset_bank_mode,
                )
            choice = role_choices[role]
            self._validate_audio_mode_choice(choice, effect_mode)
            config = self.randomizer.build_config(
                choice=choice,
                palette=palette,
                energy=role_energy,
                schema_effects=self.schema_effects,
                ledfx_presets=self.ledfx_presets,
                rng=rng,
                variation=variation,
            )
            config = copy.deepcopy(config)
            self.layout_engine.apply_transform(config, role_info)
            assignments.append(
                VirtualAssignment(
                    virtual_id=role_info["virtual_id"],
                    effect_type=choice["effect_type"],
                    config=config,
                    preset=None if choice.get("preset_category") == "preset_bank" else choice.get("preset_id"),
                    preset_category=None if choice.get("preset_category") == "preset_bank" else choice.get("preset_category"),
                    source_preset_id=choice.get("preset_id"),
                    source_preset_name=choice.get("preset_name"),
                    source_preset_category=choice.get("preset_category"),
                )
            )
        return assignments

    @staticmethod
    def _validate_audio_mode_choice(choice: Dict[str, Any], effect_mode: str) -> None:
        if effect_mode not in ("sound", "non_sound"):
            return
        profile = choice.get("profile") or {}
        is_reactive = bool(profile.get("audio_reactive"))
        if effect_mode == "sound" and not is_reactive:
            raise ValueError(f"Non-sound-reactive effect selected in sound-reactive mode: {choice.get('effect_type')}")
        if effect_mode == "non_sound" and is_reactive:
            raise ValueError(f"Sound-reactive effect selected in non-sound-reactive mode: {choice.get('effect_type')}")

    @staticmethod
    def _ordered_unique(values: List[str]) -> List[str]:
        unique: List[str] = []
        for value in values:
            clean = str(value).strip()
            if clean and clean not in unique:
                unique.append(clean)
        return unique

    def _ignored_assignments(
        self,
        all_virtual_ids: List[str],
        active_virtual_ids: List[str],
    ) -> List[VirtualAssignment]:
        active = set(active_virtual_ids)
        return [
            VirtualAssignment(
                virtual_id=virtual_id,
                effect_type="",
                config={},
                preset=None,
                preset_category=None,
                action="ignore",
            )
            for virtual_id in all_virtual_ids
            if virtual_id not in active
        ]

    def _choose_scene_type(
        self,
        style: str,
        selected: List[str],
        base_energy: float,
        rng: random.Random,
        previous_scenes: Optional[List[Scene]] = None,
        variation: float = 0.6,
        flash: float = 0.45,
    ) -> str:
        previous_scenes = previous_scenes or []
        variation = max(0.0, min(1.0, variation))
        flash = max(0.0, min(1.0, flash))
        selected = [item for item in selected if item in self.scene_types]
        if not selected:
            selected = list(self.scene_types.keys())
        style_weights = (
            self.styles_data.get("styles", {})
            .get(style, {})
            .get("scene_type_weights", {})
        )
        weighted = []
        for scene_type in selected:
            low, high = self.scene_types.get(scene_type, {}).get("energy", [0.0, 1.0])
            midpoint = (low + high) / 2.0
            closeness = 1.0 - min(1.0, abs(base_energy - midpoint))
            score = max(0.05, closeness) * float(style_weights.get(scene_type, 1.0))
            score *= self._flash_scene_bias(scene_type, flash)
            count = sum(1 for scene in previous_scenes if scene.scene_type == scene_type)
            if count:
                score *= 1.0 / (1.0 + count * (0.22 + variation * 0.4))
            recent_types = [scene.scene_type for scene in previous_scenes[-3:]][::-1]
            if scene_type in recent_types:
                score *= max(0.2, 1.0 - (0.5 + variation * 0.25) / (recent_types.index(scene_type) + 1))
            weighted.append((score, scene_type))
        total = sum(score for score, _ in weighted)
        target = rng.random() * total
        upto = 0.0
        for score, scene_type in weighted:
            upto += score
            if upto >= target:
                return scene_type
        return weighted[-1][1]

    def _scene_energy(
        self,
        scene_type: str,
        base_energy: float,
        rng: random.Random,
        variation: float,
    ) -> float:
        low, high = self.scene_types.get(scene_type, {}).get("energy", [0.0, 1.0])
        target = low + (high - low) * base_energy
        jitter = rng.gauss(0.0, 0.035 + variation * 0.075)
        return max(low, min(high, target + jitter))

    def _apply_global_tuning(
        self,
        assignments: List[VirtualAssignment],
        options: Dict[str, Any],
    ) -> None:
        brightness = self._option_value(options, "brightness", 0.8)
        movement = self._option_value(options, "movement", 0.55)
        audio_response = self._option_value(options, "audio_response", 0.6)
        density = self._option_value(options, "density", 0.5)
        flash = self._option_value(options, "flash", 0.45)

        brightness_factor = 0.52 + brightness * 0.60
        movement_factor = 0.45 + movement
        audio_factor = 0.52 + audio_response * 0.80
        threshold_factor = 1.45 - audio_response * 0.85
        density_factor = 0.65 + density * 0.70
        flash_factor = 0.40 + flash * 1.33

        for assignment in assignments:
            if not assignment.effect_type:
                continue
            properties = (
                self.schema_effects.get(assignment.effect_type, {})
                .get("schema", {})
                .get("properties", {})
            )
            for key, value in list(assignment.config.items()):
                if not self._is_tunable_number(key, value, properties):
                    continue
                lower_key = key.lower()
                factor = 1.0
                if "brightness" in lower_key:
                    factor *= brightness_factor
                if lower_key in {
                    "speed",
                    "gradient_roll",
                    "color_step",
                    "modulation_speed",
                    "idle_speed",
                    "spin_multiplier",
                    "gradient_scale",
                }:
                    factor *= movement_factor
                if "sensitivity" in lower_key or lower_key == "reactivity":
                    factor *= audio_factor
                if lower_key in {"multiplier", "power_multiplier"}:
                    factor *= audio_factor
                if lower_key == "threshold" or lower_key.endswith("_threshold"):
                    factor *= threshold_factor
                if lower_key in {"blur", "bands", "decay", "peak_decay", "center_smoothing"}:
                    factor *= density_factor
                if lower_key == "strobe_width":
                    factor *= density_factor
                if "strobe" in lower_key or lower_key in {"beat_decay", "bass_strobe_decay_rate"}:
                    factor *= flash_factor
                if factor != 1.0:
                    assignment.config[key] = self._scale_schema_number(
                        key,
                        value,
                        factor,
                        properties.get(key, {}),
                    )

    @staticmethod
    def _flash_scene_bias(scene_type: str, flash: float) -> float:
        if scene_type == "strobe":
            return 0.18 + flash * 1.82
        if scene_type == "peak":
            return 0.35 + flash * 1.45
        if scene_type == "finale":
            return 0.42 + flash * 1.35
        if scene_type == "drop":
            return 0.55 + flash
        if scene_type == "transition":
            return 0.65 + flash * 0.85
        if scene_type in {"build", "tension", "roll"}:
            return 0.75 + flash * 0.55
        if scene_type in {"ambient", "dark", "intro", "breakdown", "groove", "warmup"} and flash < 0.35:
            return 1.0 + (0.35 - flash) * 0.45
        return 1.0

    @staticmethod
    def _option_value(options: Dict[str, Any], key: str, default: float) -> float:
        try:
            value = float(options.get(key, default))
        except (TypeError, ValueError):
            value = default
        return max(0.0, min(1.0, value))

    @staticmethod
    def _is_tunable_number(key: str, value: Any, properties: Dict[str, Any]) -> bool:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            return False
        prop = properties.get(key)
        if not isinstance(prop, dict):
            return False
        prop_type = prop.get("type")
        if isinstance(prop_type, list):
            return any(item in ("number", "integer", "int") for item in prop_type)
        if prop_type in ("number", "integer", "int"):
            return True
        if prop.get("minimum") is not None or prop.get("maximum") is not None:
            return True
        return isinstance(prop.get("default"), (int, float)) and not isinstance(prop.get("default"), bool)

    @staticmethod
    def _scale_schema_number(key: str, value: Any, factor: float, schema_prop: Dict[str, Any]) -> Any:
        numeric = float(value) * factor
        if schema_prop.get("minimum") is not None:
            numeric = max(float(schema_prop["minimum"]), numeric)
        if schema_prop.get("maximum") is not None:
            numeric = min(float(schema_prop["maximum"]), numeric)
        prop_type = schema_prop.get("type")
        is_integer = prop_type in ("integer", "int") or isinstance(value, int)
        if isinstance(prop_type, list):
            is_integer = is_integer or "integer" in prop_type or "int" in prop_type
        if is_integer:
            return int(round(numeric))
        return round(numeric, 3)

    @staticmethod
    def _effect_counts(scenes: List[Scene]) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        for scene in scenes:
            for assignment in scene.assignments:
                if not assignment.effect_type:
                    continue
                counts[assignment.effect_type] = counts.get(assignment.effect_type, 0) + 1
        return counts

    @staticmethod
    def _recent_effects(scenes: List[Scene], limit: int) -> List[str]:
        effects: List[str] = []
        for scene in reversed(scenes):
            for assignment in scene.assignments:
                if not assignment.effect_type:
                    continue
                if assignment.effect_type not in effects:
                    effects.append(assignment.effect_type)
                if len(effects) >= limit:
                    return effects
        return effects

    @staticmethod
    def _role_scene_type(scene_type: str, role: str) -> str:
        if role == "accent" and scene_type not in ("strobe", "peak"):
            return "drop" if scene_type in ("build", "energy", "groove", "bass", "roll", "tension", "transition", "finale") else "energy"
        if role == "secondary":
            if scene_type in ("drop", "peak", "strobe"):
                return "energy"
            if scene_type in ("ambient", "dark", "intro", "breakdown"):
                return "ambient"
            if scene_type in ("bass", "roll", "tension", "transition", "finale"):
                return "energy"
            return "groove"
        return scene_type

    @staticmethod
    def _role_energy(energy: float, role: str) -> float:
        if role == "accent":
            return min(1.0, energy + 0.18)
        if role == "secondary":
            return max(0.05, energy - 0.12)
        return energy

    @staticmethod
    def _scene_name(
        index: int,
        style_name: str,
        scene_type: str,
        palette_name: str,
        prefix: str = "LSF",
    ) -> str:
        return compact_scene_name(index, style_name, scene_type, palette_name, prefix=prefix)

    @staticmethod
    def _scene_tags(
        options: Dict[str, Any],
        style: str,
        scene_type: str,
        layout: str,
        palette: Dict[str, Any],
    ) -> List[str]:
        palette_id = str(palette.get("id") or "").strip()
        palette_tag = f"palette-{palette_id}" if palette_id else ""
        tags = ["scene-factory", style, scene_type, layout]
        if palette_tag:
            tags.append(palette_tag)
        for tag in options.get("generation_tags") or []:
            clean = str(tag).strip()
            if clean and clean not in tags:
                tags.append(clean)
        return tags

    def _mood_tags(
        self,
        scene_type: str,
        style: str,
        energy: float,
        layout: str,
        palette: Dict[str, Any],
        assignments: List[VirtualAssignment],
    ) -> List[str]:
        tags: List[str] = []
        tags.extend(
            {
                "ambient": ["mood-smooth", "mood-space"],
                "dark": ["mood-dark", "mood-minimal"],
                "intro": ["mood-open", "mood-subtle"],
                "warmup": ["mood-warmup", "mood-steady"],
                "breakdown": ["mood-space", "mood-reduced"],
                "groove": ["mood-groove", "mood-steady"],
                "bass": ["mood-bass", "mood-punch"],
                "energy": ["mood-drive", "mood-full"],
                "roll": ["mood-roll", "mood-motion"],
                "build": ["mood-rise", "mood-tension"],
                "tension": ["mood-tension", "mood-sharp"],
                "transition": ["mood-switch", "mood-motion"],
                "drop": ["mood-impact", "mood-bass"],
                "peak": ["mood-peak", "mood-bright"],
                "strobe": ["mood-flash", "mood-peak"],
                "finale": ["mood-finale", "mood-peak"],
            }.get(scene_type, [])
        )
        if energy >= 0.82:
            tags.append("mood-intense")
        elif energy <= 0.34:
            tags.append("mood-low")

        effect_text = " ".join(
            assignment.effect_type for assignment in assignments if assignment.effect_type
        ).lower()
        if any(token in effect_text for token in ("strobe", "flash", "glitter")):
            tags.append("mood-flash")
        if any(token in effect_text for token in ("bar", "equalizer", "meter", "spectrum")):
            tags.append("mood-meter")
        if any(token in effect_text for token in ("scroll", "rain", "wave", "melt", "gradient")):
            tags.append("mood-flow")
        if any(token in effect_text for token in ("bass", "sub", "blade")):
            tags.append("mood-bass")

        if layout in {"mirror", "alternate"}:
            tags.append("mood-wide")
        elif layout == "accent":
            tags.append("mood-accent")

        palette_text = f"{palette.get('id', '')} {palette.get('name', '')}".lower()
        if any(token in palette_text for token in ("red", "warm", "thermal", "sodium", "amber")):
            tags.append("mood-warm")
        if any(token in palette_text for token in ("blue", "subzero", "ice", "cyan", "steel")):
            tags.append("mood-cold")
        if any(token in palette_text for token in ("magenta", "laser", "grime", "acid", "voltage")):
            tags.append("mood-neon")
        if style in {"dub", "grime"}:
            tags.append(f"mood-{style}")
        return self._ordered_unique(tags)[:6]

    @staticmethod
    def _seed(options: Dict[str, Any]) -> str:
        parts = [
            str(time.time_ns()),
            str(options.get("style", "")),
            str(options.get("energy", "")),
            str(options.get("variation", "")),
            ",".join(options.get("palette_ids") or [str(options.get("palette_id", ""))]),
            ",".join(options.get("virtual_ids", [])),
            ",".join(options.get("all_virtual_ids", [])),
        ]
        return "|".join(parts)
