from __future__ import annotations

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
            for key, value in assignment.config.items():
                if isinstance(value, str) and value.startswith("#"):
                    tokens.add(f"color:{key}:{value.lower()}")
                elif key == "gradient" and isinstance(value, str):
                    tokens.add(f"gradient:{hash(value) % 997}")
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

    def batch_report(self, scenes: List[Scene], max_pairs: int = 6) -> Dict[str, Any]:
        pairs = []
        scores = []
        for left_index, left in enumerate(scenes):
            left_tokens = left.fingerprint or self.fingerprint(left)
            for right in scenes[left_index + 1:]:
                right_tokens = right.fingerprint or self.fingerprint(right)
                score = self.similarity(left_tokens, right_tokens)
                scores.append(score)
                pairs.append(
                    {
                        "score": round(score, 3),
                        "level": self._similarity_level(score),
                        "left_id": left.id,
                        "left_name": left.name,
                        "right_id": right.id,
                        "right_name": right.name,
                        "shared": self._shared_reasons(left_tokens, right_tokens),
                    }
                )
        pairs.sort(key=lambda item: item["score"], reverse=True)
        average = sum(scores) / len(scores) if scores else 0.0
        return {
            "scene_count": len(scenes),
            "pair_count": len(scores),
            "average_similarity": round(average, 3),
            "max_similarity": round(pairs[0]["score"], 3) if pairs else 0.0,
            "uniqueness": round(1.0 - average, 3),
            "risk": self._similarity_level(pairs[0]["score"] if pairs else 0.0),
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
    def _reason_sort_key(token: str) -> tuple[int, str]:
        order = {
            "effect": 0,
            "preset": 1,
            "type": 2,
            "style": 3,
            "layout": 4,
            "palette": 5,
            "energy": 6,
            "gradient": 7,
            "color": 8,
            "num": 9,
            "bool": 10,
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
