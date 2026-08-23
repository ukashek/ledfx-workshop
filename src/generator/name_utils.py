from __future__ import annotations

import re


STYLE_CODES = {
    "drum and bass": "DNB",
    "drum & bass": "DNB",
    "dnb": "DNB",
    "hardgroove": "HGRV",
    "techno": "TCH",
    "house": "HSE",
    "dub": "DUB",
    "grime": "GRM",
}

SCENE_TYPE_CODES = {
    "ambient": "AMB",
    "dark": "DRK",
    "groove": "GRV",
    "energy": "NRG",
    "build": "BLD",
    "drop": "DRP",
    "peak": "PK",
    "strobe": "STR",
}

STOP_WORDS = {"and", "the", "gradient", "palette", "current"}


def compact_scene_name(
    index: int,
    style_name: str,
    scene_type: str,
    palette_name: str = "",
    max_length: int = 28,
    prefix: str = "LSF",
) -> str:
    parts = [
        f"{_prefix(prefix)}{max(0, int(index)):03d}",
        _mapped_token(style_name, STYLE_CODES, fallback_length=4),
        _mapped_token(scene_type, SCENE_TYPE_CODES, fallback_length=3),
        _palette_token(palette_name),
    ]
    name = " ".join(part for part in parts if part)
    if len(name) <= max_length:
        return name
    short = " ".join(part for part in parts[:3] if part)
    return short[:max_length].rstrip()


def _mapped_token(value: str, mapping: dict[str, str], fallback_length: int) -> str:
    clean = _clean(value).lower()
    for needle, code in mapping.items():
        if needle in clean:
            return code
    return _initials(clean, fallback_length)


def _palette_token(value: str) -> str:
    clean = _clean(value)
    if not clean:
        return ""
    words = [word for word in clean.split() if word.lower() not in STOP_WORDS]
    if not words:
        words = clean.split()
    return words[0][:8].title()


def _initials(value: str, max_length: int) -> str:
    words = [word for word in _clean(value).split() if word.lower() not in STOP_WORDS]
    if not words:
        return ""
    if len(words) == 1:
        return words[0][:max_length].upper()
    return "".join(word[0] for word in words)[:max_length].upper()


def _clean(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", " ", str(value or "")).strip()


def _prefix(value: str) -> str:
    clean = re.sub(r"[^A-Za-z0-9]+", "", str(value or "")).upper()
    return (clean or "LSF")[:8]
