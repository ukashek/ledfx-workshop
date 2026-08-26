from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict


def load_yaml_like(path: Path) -> Dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    try:
        import yaml  # type: ignore

        loaded = yaml.safe_load(text)
        return loaded or {}
    except Exception:
        return json.loads(text)


def load_profiles(data_dir: Path) -> Dict[str, Dict[str, Any]]:
    return {
        "effects": load_yaml_like(data_dir / "effects.yaml"),
        "palettes": load_yaml_like(data_dir / "palettes.yaml"),
        "styles": load_yaml_like(data_dir / "styles.yaml"),
    }
