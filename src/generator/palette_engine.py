from __future__ import annotations

import random
from typing import Any, Dict, List, Optional


class PaletteEngine:
    def __init__(self, palettes_data: Dict[str, Any]):
        self.palettes: List[Dict[str, Any]] = list(palettes_data.get("palettes", []))
        if not self.palettes:
            raise ValueError("No palettes configured")

    def all(self) -> List[Dict[str, Any]]:
        return self.palettes

    def get(
        self,
        palette_id: Optional[str],
        rng: random.Random,
        palette_bias: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        if palette_id and palette_id != "auto":
            for palette in self.palettes:
                if palette.get("id") == palette_id:
                    return palette
        return self._weighted_choice(self.palettes, rng, palette_bias)

    def get_from_ids(
        self,
        palette_ids: Optional[List[str]],
        rng: random.Random,
        palette_bias: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        ids = [str(item) for item in (palette_ids or []) if item]
        specific_ids = [item for item in ids if item != "auto"]
        if specific_ids:
            allowed = [palette for palette in self.palettes if palette.get("id") in specific_ids]
            if allowed:
                return self._weighted_choice(allowed, rng, palette_bias)
        return self.get(ids[0] if ids else "auto", rng, palette_bias)

    @staticmethod
    def _weighted_choice(
        palettes: List[Dict[str, Any]],
        rng: random.Random,
        palette_bias: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        if not palette_bias:
            return rng.choice(palettes)
        weighted = []
        for palette in palettes:
            weight = float(palette_bias.get(palette.get("id"), 0.45))
            weighted.append((max(0.01, weight), palette))
        total = sum(weight for weight, _ in weighted)
        target = rng.random() * total
        upto = 0.0
        for weight, palette in weighted:
            upto += weight
            if upto >= target:
                return palette
        return weighted[-1][1]

    @staticmethod
    def color(palette: Dict[str, Any], role: str) -> str:
        colors = palette.get("colors", {})
        return colors.get(role) or colors.get("accent") or "#ffffff"

    @staticmethod
    def gradient(palette: Dict[str, Any]) -> str:
        if palette.get("gradient"):
            return palette["gradient"]
        colors = list((palette.get("colors") or {}).values()) or ["#000000", "#ffffff"]
        last = max(1, len(colors) - 1)
        stops = [f"{color} {round(index / last * 100)}%" for index, color in enumerate(colors)]
        return "linear-gradient(90deg, " + ", ".join(stops) + ")"

    @staticmethod
    def gradient_name(palette: Dict[str, Any]) -> str:
        return str(palette.get("name") or palette.get("id") or "Workshop gradient")
