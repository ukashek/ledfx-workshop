from __future__ import annotations

import hashlib

from typing import Any, Dict, Iterable, List, Set

from src.models.scene import Scene


class SceneScorer:
    NUMERIC_KEYS = {
        "speed",
        "blur",
        "brightness",
        "decay",
        "sensitivity",
        "threshold",
        "gradient_roll",
        "strobe_decay",
        "strobe_width",
        "multiplier",
        "bands",
    }

    def fingerprint(self, scene: Scene) -> List[str]:
        tokens: Set[str] = {
            f"type:{scene.scene_type}",
            f"style:{scene.style}",
            f"palette:{scene.palette_id}",
            f"layout:{scene.layout}",
            f"energy:{round(scene.energy * 10)}",
        }
        for assignment in scene.assignments:
            if not assignment.effect_type:
                continue
            tokens.add(f"effect:{assignment.effect_type}")
            if assignment.preset:
                tokens.add(f"preset:{assignment.effect_type}:{assignment.preset}")
            elif assignment.source_preset_id:
                tokens.add(f"preset:{assignment.effect_type}:{assignment.source_preset_id}")
            if assignment.source_preset_category:
                tokens.add(f"preset_source:{assignment.source_preset_category}")
            for key, value in assignment.config.items():
                if isinstance(value, str) and value.startswith("#"):
                    tokens.add(f"color:{key}:{value.lower()}")
                elif key == "gradient" and isinstance(value, str):
                    digest = hashlib.sha1(value.encode("utf-8")).hexdigest()[:8]
                    tokens.add(f"gradient:{digest}")
                elif key in self.NUMERIC_KEYS and isinstance(value, (int, float)):
                    tokens.add(f"num:{key}:{round(float(value), 1)}")
                elif isinstance(value, bool):
                    tokens.add(f"bool:{key}:{value}")
        return sorted(tokens)

    def similarity(self, left: Iterable[str], right: Iterable[str]) -> float:
        left_set = set(left)
        right_set = set(right)
        if not left_set and not right_set:
            return 1.0
        return len(left_set & right_set) / max(1, len(left_set | right_set))

    def is_duplicate(self, scene: Scene, previous: List[Scene], threshold: float = 0.86) -> bool:
        if not scene.fingerprint:
            scene.fingerprint = self.fingerprint(scene)
        return any(
            self.similarity(scene.fingerprint, other.fingerprint or self.fingerprint(other))
            >= threshold
            for other in previous
        )

    def batch_report(self, scenes: List[Scene], max_pairs: int = 12) -> Dict[str, Any]:
        pairs = []
        scores = []
        for left_index, left in enumerate(scenes):
            left_tokens = left.fingerprint or self.fingerprint(left)
            for right in scenes[left_index + 1:]:
                right_tokens = right.fingerprint or self.fingerprint(right)
                score = self.similarity(left_tokens, right_tokens)
                shared = self._shared_reasons(left_tokens, right_tokens, limit=12)
                scores.append(score)
                pairs.append(
                    {
                        "score": round(score, 3),
                        "level": self._similarity_level(score),
                        "left_id": left.id,
                        "left_name": left.name,
                        "right_id": right.id,
                        "right_name": right.name,
                        "shared": shared,
                        "differences": self._difference_reasons(left, right),
                        "recommendation": self._recommendation(score, shared),
                    }
                )
        pairs.sort(key=lambda item: item["score"], reverse=True)
        average = sum(scores) / len(scores) if scores else 0.0
        high_pairs = [pair for pair in pairs if pair["level"] == "high"]
        medium_pairs = [pair for pair in pairs if pair["level"] == "medium"]
        regenerate_ids = []
        for pair in high_pairs:
            for scene_id in (pair["right_id"], pair["left_id"]):
                if scene_id not in regenerate_ids:
                    regenerate_ids.append(scene_id)
        return {
            "scene_count": len(scenes),
            "pair_count": len(scores),
            "average_similarity": round(average, 3),
            "max_similarity": round(pairs[0]["score"], 3) if pairs else 0.0,
            "uniqueness": round(1.0 - average, 3),
            "risk": self._similarity_level(pairs[0]["score"] if pairs else 0.0),
            "recommendation": self._batch_recommendation(pairs, average),
            "high_pair_count": len(high_pairs),
            "medium_pair_count": len(medium_pairs),
            "regenerate_candidate_ids": regenerate_ids[:8],
            "pairs": pairs[:max_pairs],
        }

    @staticmethod
    def _similarity_level(score: float) -> str:
        if score >= 0.72:
            return "high"
        if score >= 0.5:
            return "medium"
        return "low"

    def _shared_reasons(self, left: Iterable[str], right: Iterable[str], limit: int = 8) -> List[str]:
        shared = sorted(set(left) & set(right), key=self._reason_sort_key)
        return [self._human_token(token) for token in shared[:limit]]

    @staticmethod
    def _difference_reasons(left: Scene, right: Scene) -> List[str]:
        differences = []
        if left.scene_type != right.scene_type:
            differences.append(f"different scene type: {left.scene_type} vs {right.scene_type}")
        if left.palette_id != right.palette_id:
            differences.append(f"different palette: {left.palette_name} vs {right.palette_name}")
        if left.layout != right.layout:
            differences.append(f"different layout: {left.layout} vs {right.layout}")
        left_effects = {assignment.effect_type for assignment in left.assignments if assignment.effect_type}
        right_effects = {assignment.effect_type for assignment in right.assignments if assignment.effect_type}
        if left_effects != right_effects:
            only_left = sorted(left_effects - right_effects)
            only_right = sorted(right_effects - left_effects)
            if only_left:
                differences.append(f"left only effects: {', '.join(only_left[:3])}")
            if only_right:
                differences.append(f"right only effects: {', '.join(only_right[:3])}")
        if abs(left.energy - right.energy) >= 0.12:
            differences.append(f"different energy: {round(left.energy * 100)}% vs {round(right.energy * 100)}%")
        return differences[:6]

    @staticmethod
    def _recommendation(score: float, shared: List[str]) -> str:
        if score < 0.5:
            return "No action needed."
        if any(item.startswith("same preset") for item in shared):
            return "Regenerate one scene or switch its preset to reduce overlap."
        if any(item.startswith("same effect") for item in shared) and any(item.startswith("same palette") for item in shared):
            return "Change palette or layout on one scene, or regenerate it."
        if any(item.startswith("same scene type") for item in shared):
            return "Keep both only if this section needs repeated energy; otherwise regenerate one."
        return "Review one of these scenes before sending the batch."

    @staticmethod
    def _batch_recommendation(pairs: List[Dict[str, Any]], average: float) -> str:
        if not pairs:
            return "Generate at least two scenes to compare batch variety."
        max_score = float(pairs[0]["score"])
        if max_score >= 0.72:
            return "High overlap found. Regenerate candidate scenes or change palette/layout before sending the batch."
        if max_score >= 0.5:
            return "Some scenes are related, but the batch is probably usable if those repetitions are intentional."
        if average <= 0.22:
            return "Good spread: scenes differ across effects, palettes, layouts and energy bands."
        return "Low duplication risk. Review the top pairs only if you want a more varied set."

    @staticmethod
    def _reason_sort_key(token: str) -> tuple[int, str]:
        order = {
            "effect": 0,
            "preset": 1,
            "type": 2,
            "style": 3,
            "layout": 4,
            "palette": 5,
            "preset_source": 6,
            "energy": 7,
            "gradient": 8,
            "color": 9,
            "num": 10,
            "bool": 11,
        }
        prefix = token.split(":", 1)[0]
        return (order.get(prefix, 50), token)

    @staticmethod
    def _human_token(token: str) -> str:
        parts = token.split(":")
        kind = parts[0]
        if kind == "effect" and len(parts) > 1:
            return f"same effect: {parts[1]}"
        if kind == "preset" and len(parts) > 2:
            return f"same preset: {parts[2]}"
        if kind == "type" and len(parts) > 1:
            return f"same scene type: {parts[1]}"
        if kind == "style" and len(parts) > 1:
            return f"same style: {parts[1]}"
        if kind == "layout" and len(parts) > 1:
            return f"same layout: {parts[1]}"
        if kind == "palette" and len(parts) > 1:
            return f"same palette: {parts[1]}"
        if kind == "preset_source" and len(parts) > 1:
            return f"same preset source: {parts[1]}"
        if kind == "energy" and len(parts) > 1:
            return f"similar energy band: {parts[1]}"
        if kind == "gradient":
            return "similar gradient"
        if kind == "color" and len(parts) > 2:
            return f"same color field: {parts[1]}"
        if kind == "num" and len(parts) > 2:
            return f"similar parameter: {parts[1]}"
        if kind == "bool" and len(parts) > 2:
            return f"same toggle: {parts[1]}"
        return token
