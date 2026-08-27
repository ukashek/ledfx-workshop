from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class VirtualAssignment:
    virtual_id: str
    effect_type: str
    config: Dict[str, Any]
    preset: Optional[str] = None
    preset_category: Optional[str] = "ledfx_presets"
    source_preset_id: Optional[str] = None
    source_preset_name: Optional[str] = None
    source_preset_category: Optional[str] = None
    action: str = "activate"

    def to_ledfx_scene_entry(self) -> Dict[str, Any]:
        if not self.effect_type:
            return {"action": "ignore"}
        entry: Dict[str, Any] = {
            "action": self.action,
            "type": self.effect_type,
            "config": self.config,
        }
        # Generated scenes store the concrete config. Keeping a preset reference
        # can make LedFx reactivate stale preset colors instead of this config.
        if self.preset and not self.config:
            entry["preset"] = self.preset
            if self.preset_category:
                entry["preset_category"] = self.preset_category
        return entry

    def to_effect_payload(self) -> Dict[str, Any]:
        return {
            "type": self.effect_type,
            "config": self.config,
            "active": True,
        }

    def to_public_dict(self) -> Dict[str, Any]:
        return {
            "virtual_id": self.virtual_id,
            "effect_type": self.effect_type,
            "preset": self.preset,
            "preset_category": self.preset_category,
            "source_preset_id": self.source_preset_id,
            "source_preset_name": self.source_preset_name,
            "source_preset_category": self.source_preset_category,
            "action": self.action,
            "config": self.config,
        }


@dataclass
class Scene:
    id: str
    name: str
    scene_type: str
    style: str
    palette_id: str
    palette_name: str
    energy: float
    layout: str
    assignments: List[VirtualAssignment]
    tags: List[str] = field(default_factory=list)
    mood_tags: List[str] = field(default_factory=list)
    fingerprint: List[str] = field(default_factory=list)
    kept: bool = True
    deleted: bool = False
    saved: bool = False
    ledfx_scene_id: Optional[str] = None

    def to_ledfx_payload(self, include_id: bool = True) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "name": self.name,
            "scene_image": "Wallpaper",
            "scene_tags": self._scene_tags_text(),
            "scene_puturl": None,
            "scene_payload": None,
            "scene_midiactivate": None,
            "virtuals": {
                item.virtual_id: item.to_ledfx_scene_entry()
                for item in self.assignments
            },
        }
        if include_id:
            payload["id"] = self.ledfx_scene_id or self.id
        return payload

    def _scene_tags_text(self) -> Optional[str]:
        tags = []
        for tag in self.tags:
            clean = " ".join(str(tag).replace(",", " ").split())[:32]
            if clean and clean not in tags:
                tags.append(clean)
        return ", ".join(tags)[:160] if tags else None

    def to_public_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "scene_type": self.scene_type,
            "style": self.style,
            "palette_id": self.palette_id,
            "palette_name": self.palette_name,
            "energy": self.energy,
            "layout": self.layout,
            "assignments": [item.to_public_dict() for item in self.assignments],
            "tags": self.tags,
            "mood_tags": self.mood_tags,
            "kept": self.kept,
            "deleted": self.deleted,
            "saved": self.saved,
            "ledfx_scene_id": self.ledfx_scene_id,
        }
