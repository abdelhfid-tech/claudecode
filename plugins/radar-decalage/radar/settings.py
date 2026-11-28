"""Chargement de la configuration TOML.

Les fichiers par défaut sont dans config/ du plugin. Un fichier du même nom dans
<espace de travail>/config/ est fusionné par-dessus (les tables sont fusionnées,
les autres valeurs remplacées).
"""

from __future__ import annotations

import tomllib
from pathlib import Path
from typing import Any

from . import paths


def deep_merge(base: dict, override: dict) -> dict:
    out = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = deep_merge(out[key], value)
        else:
            out[key] = value
    return out


def load(name: str, config_dir: Path | None = None, workspace: Path | None = None) -> dict[str, Any]:
    config_dir = config_dir or paths.CONFIG_DIR
    default_path = config_dir / f"{name}.toml"
    data: dict[str, Any] = {}
    if default_path.exists():
        data = tomllib.loads(default_path.read_text(encoding="utf-8"))
    ws = workspace or paths.workspace()
    user_path = ws / "config" / f"{name}.toml"
    if user_path.exists():
        data = deep_merge(data, tomllib.loads(user_path.read_text(encoding="utf-8")))
    return data


class Zones:
    """Vitrines et pays suivis (config/zones.toml)."""

    def __init__(self, raw: dict[str, Any]):
        self.items: list[dict[str, Any]] = list(raw.get("zone", []))
        codes = [z["code"] for z in self.items]
        if len(codes) != len(set(codes)):
            raise ValueError("code de zone en double dans zones.toml")

    def with_flag(self, flag: str) -> list[dict[str, Any]]:
        return [z for z in self.items if z.get(flag)]

    def codes(self) -> list[str]:
        return [z["code"] for z in self.items]

    def get(self, code: str) -> dict[str, Any]:
        for z in self.items:
            if z["code"] == code:
                return z
        raise KeyError(code)


def zones() -> Zones:
    return Zones(load("zones"))
