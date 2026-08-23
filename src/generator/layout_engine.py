from __future__ import annotations

import random
from typing import Any, Dict, List


class LayoutEngine:
    def choose_layout(
        self,
        requested: str,
        scene_type: str,
        virtual_count: int,
        rng: random.Random,
    ) -> str:
        if requested and requested != "auto":
            return requested
        if virtual_count <= 1:
            return "unison"
        if scene_type in ("drop", "peak", "strobe"):
            return rng.choice(["unison", "mirror", "accent"])
        if scene_type in ("ambient", "dark"):
            return rng.choice(["unison", "mirror", "alternate"])
        return rng.choice(["alternate", "mirror", "accent"])

    def roles(self, virtual_ids: List[str], layout: str) -> List[Dict[str, Any]]:
        if not virtual_ids:
            return []
        if layout == "alternate":
            return [
                {
                    "virtual_id": virtual_id,
                    "role": "primary" if index % 2 == 0 else "secondary",
                    "mirror": index % 2 == 1,
                    "flip": False,
                }
                for index, virtual_id in enumerate(virtual_ids)
            ]
        if layout == "mirror":
            return [
                {
                    "virtual_id": virtual_id,
                    "role": "primary",
                    "mirror": True,
                    "flip": index % 2 == 1,
                }
                for index, virtual_id in enumerate(virtual_ids)
            ]
        if layout == "accent":
            accent_index = max(0, len(virtual_ids) - 1)
            return [
                {
                    "virtual_id": virtual_id,
                    "role": "accent" if index == accent_index else "primary",
                    "mirror": index % 2 == 1,
                    "flip": False,
                }
                for index, virtual_id in enumerate(virtual_ids)
            ]
        return [
            {
                "virtual_id": virtual_id,
                "role": "primary",
                "mirror": False,
                "flip": False,
            }
            for virtual_id in virtual_ids
        ]

    @staticmethod
    def apply_transform(config: Dict[str, Any], role_info: Dict[str, Any]) -> None:
        if "mirror" in config and role_info.get("mirror"):
            config["mirror"] = True
        if "flip" in config and role_info.get("flip"):
            config["flip"] = not bool(config.get("flip"))
