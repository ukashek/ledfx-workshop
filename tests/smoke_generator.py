from pathlib import Path
import random
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.generator.data_loader import load_profiles
from src.generator.effect_selector import EffectSelector
from src.generator.parameter_randomizer import ParameterRandomizer
from src.generator.scene_generator import SceneGenerator


def main() -> None:
    profiles = load_profiles(ROOT / "data")
    schema = {
        "effects": {
            "scroll": {
                "schema": {
                    "properties": {
                        "brightness": {"type": "number", "minimum": 0, "maximum": 1, "default": 1},
                        "blur": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                        "speed": {"type": "number", "minimum": 0.1, "maximum": 10, "default": 1},
                        "decay": {"type": "number", "minimum": 0, "maximum": 1, "default": 0.9},
                        "threshold": {"type": "number", "minimum": 0, "maximum": 1, "default": 0},
                        "mirror": {"type": "boolean", "default": False},
                        "flip": {"type": "boolean", "default": False},
                        "color_lows": {"type": "color", "default": "#ff0000"},
                        "color_mids": {"type": "color", "default": "#00ff00"},
                        "color_high": {"type": "color", "default": "#0000ff"},
                        "background_color": {"type": "color", "default": "#000000"},
                        "diag": {"type": "boolean", "default": False},
                    }
                }
            },
            "singleColor": {
                "schema": {
                    "properties": {
                        "brightness": {"type": "number", "minimum": 0, "maximum": 1, "default": 1},
                        "blur": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                        "color": {"type": "color", "default": "#ffffff"},
                        "background_color": {"type": "color", "default": "#000000"},
                    }
                }
            },
            "gradient": {
                "schema": {
                    "properties": {
                        "brightness": {"type": "number", "minimum": 0, "maximum": 1, "default": 1},
                        "blur": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                        "gradient": {"type": "color", "gradient": True, "default": "linear-gradient(90deg, #000, #fff)"},
                        "gradient_name": {"type": "string", "default": "Rainbow"},
                        "gradient_roll": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                        "speed": {"type": "number", "minimum": 0.1, "maximum": 10, "default": 1},
                        "background_color": {"type": "color", "default": "#000000"},
                        "diag": {"type": "boolean", "default": False},
                    }
                }
            },
        }
    }
    config = {
        "ledfx_presets": {
            "scroll": {
                "gentle-rgb": {
                    "config": {
                        "brightness": 1,
                        "blur": 3,
                        "speed": 2,
                        "decay": 0.9,
                        "threshold": 0,
                        "mirror": True,
                        "flip": False,
                        "color_lows": "#ff0000",
                        "color_mids": "#00ff00",
                        "color_high": "#0000ff",
                        "background_color": "#000000",
                    }
                }
            },
            "gradient": {
                "breathing": {
                    "config": {
                        "brightness": 0.5,
                        "blur": 1,
                        "gradient": "linear-gradient(90deg, #000, #fff)",
                        "gradient_name": "Rainbow",
                        "gradient_roll": 0,
                        "speed": 0.4,
                        "background_color": "#000000",
                    }
                }
            },
            "singleColor": {
                "black": {
                    "config": {
                        "brightness": 0.3,
                        "blur": 0,
                        "color": "#ffffff",
                        "background_color": "#000000",
                    }
                }
            },
        }
    }
    generator = SceneGenerator(
        effects_data=profiles["effects"],
        palettes_data=profiles["palettes"],
        styles_data=profiles["styles"],
        schema=schema,
        ledfx_config=config,
    )
    scenes = generator.generate_batch(
        {
            "count": 3,
            "style": "techno",
            "energy": 0.55,
            "palette_id": "acid_current",
            "layout": "alternate",
            "scene_types": ["ambient", "groove", "energy"],
            "virtual_ids": ["main", "side"],
            "seed": "smoke",
        }
    )
    assert len(scenes) == 3
    report = generator.similarity_report(scenes)
    assert report["scene_count"] == 3
    assert "average_similarity" in report
    assert all(scene.assignments for scene in scenes)
    assert all(scene.to_ledfx_payload()["virtuals"] for scene in scenes)
    for scene in scenes:
        for entry in scene.to_ledfx_payload()["virtuals"].values():
            assert "preset" not in entry
            assert "preset_category" not in entry
    for scene in scenes:
        assert any(tag.startswith("palette-") for tag in scene.tags)
        for assignment in scene.assignments:
            assert profiles["effects"]["effects"][assignment.effect_type]["audio_reactive"] is True

    bank_generator = SceneGenerator(
        effects_data=profiles["effects"],
        palettes_data=profiles["palettes"],
        styles_data=profiles["styles"],
        schema=schema,
        ledfx_config={"ledfx_presets": {}},
        preset_bank_items=[
            {
                "id": "bank-scroll-smoke",
                "name": "Bank Scroll Smoke",
                "effect_type": "scroll",
                "enabled": True,
                "config": {
                    "brightness": 0.9,
                    "blur": 1,
                    "speed": 2,
                    "decay": 0.8,
                    "threshold": 0.1,
                    "mirror": False,
                    "flip": False,
                    "color_lows": "#111111",
                    "color_mids": "#222222",
                    "color_high": "#333333",
                    "background_color": "#000000",
                },
            }
        ],
    )
    bank_scene = bank_generator.generate_batch(
        {
            "count": 1,
            "style": "techno",
            "effect_mode": "sound",
            "preset_bank_mode": "prefer",
            "energy": 0.55,
            "palette_id": "acid_current",
            "layout": "unison",
            "scene_types": ["groove"],
            "virtual_ids": ["main"],
            "seed": "preset-bank-smoke",
        }
    )[0]
    bank_assignment = bank_scene.assignments[0]
    assert bank_assignment.source_preset_category == "preset_bank"
    assert bank_assignment.source_preset_id == "bank-scroll-smoke"
    assert bank_assignment.preset is None
    assert any(tag.startswith("mood-") for tag in bank_scene.mood_tags)
    sound_batch = generator.generate_batch(
        {
            "count": 16,
            "style": "drum_and_bass",
            "effect_mode": "sound",
            "energy": 0.78,
            "palette_ids": ["acid_current", "magenta_oil", "jungle_pressure"],
            "layout": "auto",
            "scene_types": list(profiles["styles"]["scene_types"].keys()),
            "virtual_ids": ["main", "side"],
            "seed": "sound-reactive-mode-smoke",
        }
    )
    assert len(sound_batch) == 16
    for scene in sound_batch:
        for assignment in scene.assignments:
            assert profiles["effects"]["effects"][assignment.effect_type]["audio_reactive"] is True
    acid = next(palette for palette in profiles["palettes"]["palettes"] if palette["id"] == "acid_current")
    gradient_config = ParameterRandomizer().build_config(
        choice={
            "effect_type": "gradient",
            "profile": profiles["effects"]["effects"]["gradient"],
            "preset_id": "breathing",
        },
        palette=acid,
        energy=0.55,
        schema_effects=schema["effects"],
        ledfx_presets=SceneGenerator._merged_presets(config),
        rng=random.Random("gradient-name-smoke"),
        variation=0.5,
    )
    assert gradient_config["gradient"] == acid["gradient"]
    assert gradient_config["gradient_name"] == acid["name"]
    subzero = next(palette for palette in profiles["palettes"]["palettes"] if palette["id"] == "subzero")
    subzero_config = ParameterRandomizer().build_config(
        choice={
            "effect_type": "multiBar",
            "profile": {
                "safe_params": {},
                "palette_keys": {
                    "gradient": "gradient",
                    "background_color": "background",
                    "color": "mid",
                },
            },
            "preset_id": "warm-rainbow",
        },
        palette=subzero,
        energy=0.75,
        schema_effects={
            "multiBar": {
                "schema": {
                    "properties": {
                        "brightness": {"type": "number", "minimum": 0, "maximum": 1, "default": 1},
                        "background_color": {"type": "color", "default": "#000000"},
                        "gradient": {"type": "color", "gradient": True, "default": "linear-gradient(90deg, #000, #fff)"},
                        "gradient_roll": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                    }
                }
            }
        },
        ledfx_presets={
            "multiBar": {
                "warm-rainbow": {
                    "config": {
                        "brightness": 1,
                        "gradient": "linear-gradient(90deg, #000000 0%, #ff5400 50%, #ff0000 100%)",
                        "gradient_name": "Rainbow",
                        "background_color": "#ffffff",
                        "color": "#ff0000",
                        "gradient_roll": 5,
                    }
                }
            }
        },
        rng=random.Random("subzero-overwrites-warm-preset"),
        variation=0.5,
    )
    assert subzero_config["gradient"] == subzero["gradient"]
    assert "gradient_name" not in subzero_config
    assert subzero_config["background_color"] == subzero["colors"]["background"]
    assert "color" not in subzero_config
    assert subzero_config["gradient_roll"] == 5

    dirty_bar_config = ParameterRandomizer().build_config(
        choice={
            "effect_type": "bar",
            "profile": profiles["effects"]["effects"]["bar"],
            "preset_id": "old-mixed-bar",
        },
        palette=subzero,
        energy=0.7,
        schema_effects={
            "bar": {
                "schema": {
                    "properties": {
                        "background_brightness": {"type": "number", "minimum": 0, "maximum": 1, "default": 1},
                        "background_color": {"type": "color", "default": "#000000"},
                        "blur": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                        "brightness": {"type": "number", "minimum": 0, "maximum": 1, "default": 1},
                        "color_step": {"type": "number", "minimum": 0, "maximum": 1, "default": 0.125},
                        "diag": {"type": "boolean", "default": False},
                        "ease_method": {"type": "string", "enum": ["linear", "ease_in", "ease_out", "ease_in_out"], "default": "ease_out"},
                        "flip": {"type": "boolean", "default": False},
                        "gradient": {"type": "color", "gradient": True, "default": "linear-gradient(90deg, #000, #fff)"},
                        "gradient_roll": {"type": "number", "minimum": 0, "maximum": 10, "default": 0},
                        "mirror": {"type": "boolean", "default": False},
                        "mode": {"type": "string", "enum": ["wipe", "bounce", "in-out", "cascade"], "default": "wipe"},
                        "skip_every": {"type": "integer", "minimum": 1, "maximum": 8, "default": 1},
                    }
                }
            }
        },
        ledfx_presets={
            "bar": {
                "old-mixed-bar": {
                    "config": {
                        "background_color": "#ff5400",
                        "brightness": 1,
                        "color_high": "#ff0000",
                        "color_lows": "#ff5400",
                        "color_mids": "#ffff00",
                        "decay": 0.9,
                        "gradient": "linear-gradient(90deg, #000000 0%, #ff5400 50%, #ff0000 100%)",
                        "gradient_name": "Rainbow",
                        "speed": 5,
                        "threshold": 0.2,
                    }
                }
            }
        },
        rng=random.Random("dirty-bar-subzero"),
        variation=0.5,
    )
    assert dirty_bar_config["gradient"] == subzero["gradient"]
    assert dirty_bar_config["background_color"] == subzero["colors"]["background"]
    assert {"color_high", "color_lows", "color_mids", "decay", "speed", "threshold", "gradient_name"}.isdisjoint(dirty_bar_config)
    non_sound = generator.generate_batch(
        {
            "count": 2,
            "style": "techno",
            "effect_mode": "non_sound",
            "energy": 0.25,
            "palette_id": "acid_current",
            "layout": "unison",
            "scene_types": ["ambient", "dark"],
            "virtual_ids": ["main", "side"],
            "seed": "non-sound-smoke",
        }
    )
    assert len(non_sound) == 2
    for scene in non_sound:
        for assignment in scene.assignments:
            assert profiles["effects"]["effects"][assignment.effect_type]["audio_reactive"] is False

    selector = EffectSelector(profiles["effects"], profiles["styles"])
    effect_profiles = profiles["effects"]["effects"]
    assert "strobe" in effect_profiles["strobe"]["scene_types"]
    assert effect_profiles["strobe"]["reactivity_mode"] == "beat"
    assert "strobe" in effect_profiles["real_strobe"]["scene_types"]
    assert effect_profiles["real_strobe"]["reactivity_mode"] == "audio"

    strobe_choice = selector.choose(
        scene_type="strobe",
        style="techno",
        energy=0.9,
        schema_effects={"strobe": {"schema": {"properties": {}}}},
        ledfx_presets={},
        rng=random.Random("bpm-strobe-reactive"),
        effect_mode="sound",
    )
    assert strobe_choice["effect_type"] == "strobe"
    try:
        selector.choose(
            scene_type="strobe",
            style="techno",
            energy=0.9,
            schema_effects={"strobe": {"schema": {"properties": {}}}},
            ledfx_presets={},
            rng=random.Random("bpm-strobe-non-sound"),
            effect_mode="non_sound",
        )
    except ValueError:
        pass
    else:
        raise AssertionError("BPM Strobe must not be selectable in non-sound mode")
    print("ok")


if __name__ == "__main__":
    main()
