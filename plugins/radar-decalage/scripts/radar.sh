#!/bin/sh
# Lance le CLI du radar depuis le répertoire courant : l'espace de travail reste ./workspace
# (ou RADAR_WORKSPACE), le code est pris dans le plugin.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHONPATH="$ROOT${PYTHONPATH:+:$PYTHONPATH}" exec python3 -m radar "$@"
