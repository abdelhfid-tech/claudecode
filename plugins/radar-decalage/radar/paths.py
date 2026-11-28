"""Emplacements : le code et la configuration par défaut vivent dans le plugin,
les données et la configuration de l'utilisateur dans l'espace de travail."""

from __future__ import annotations

import os
from pathlib import Path

PLUGIN_ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = PLUGIN_ROOT / "config"
PACKAGE_DATA = Path(__file__).resolve().parent / "collectors" / "data"


def workspace() -> Path:
    """Espace de travail : variable RADAR_WORKSPACE, sinon ./workspace."""
    env = os.environ.get("RADAR_WORKSPACE")
    base = Path(env).expanduser() if env else Path.cwd() / "workspace"
    return base.resolve()


def data_dir() -> Path:
    return workspace() / "data"
