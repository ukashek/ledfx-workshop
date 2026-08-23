from pathlib import Path
import random
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.generator.data_loader import load_profiles
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
        assert any(tag.startswith("palette-") for tag in scene.tags)
        for assignment in scene.assignments:
            assert profiles["effects"]["effects"][assignment.effect_type]["audio_reactive"] is True
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
    print("ok")


if __name__ == "__main__":
    main()
