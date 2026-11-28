"""Liste de suivi : apps vues dans un classement, termes à interroger.

workspace/watchlist.json n'a qu'un écrivain : le collecteur. Les termes viennent
de la configuration (config/seeds.toml, puis workspace/config/terms.toml pour les
termes que vous avez validés) ; le collecteur ne les modifie jamais.
"""

from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Iterable

from . import settings


class Watchlist:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.data: dict[str, Any] = {"version": 1, "apps": {"ios": {}, "android": {}}}
        if self.path.exists():
            self.data = json.loads(self.path.read_text(encoding="utf-8"))
            self.data.setdefault("apps", {}).setdefault("ios", {})
            self.data["apps"].setdefault("android", {})

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".tmp")
        tmp.write_text(json.dumps(self.data, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
        tmp.replace(self.path)

    def observe_ranks(self, records: Iterable[dict[str, Any]], day: date, max_rank: int = 100) -> int:
        """Ajoute ou rafraîchit les apps vues dans un classement. Renvoie le nombre d'apps nouvelles."""
        added = 0
        for rec in records:
            if rec.get("kind") != "rank" or not isinstance(rec.get("value"), int) or rec["value"] > max_rank:
                continue
            platform, _, app_id = rec["key"].partition(":")
            if platform not in ("ios", "android") or not app_id:
                continue
            apps = self.data["apps"][platform]
            entry = apps.get(app_id)
            if entry is None:
                entry = apps[app_id] = {"first_seen": day.isoformat(), "zones": []}
                added += 1
            entry["last_seen"] = day.isoformat()
            name = rec.get("meta", {}).get("name")
            if name:
                entry["name"] = name
            best = entry.get("best_rank")
            if best is None or rec["value"] < best:
                entry["best_rank"] = rec["value"]
            if rec["zone"] not in entry["zones"]:
                entry["zones"].append(rec["zone"])
                entry["zones"].sort()
        return added

    def apps_to_check(self, platform: str, day: date, max_age_days: int = 60, limit: int = 600) -> list[str]:
        """Apps vues récemment, les mieux classées d'abord, plafonnées à `limit`."""
        cutoff = (day - timedelta(days=max_age_days)).isoformat()
        apps = self.data["apps"].get(platform, {})
        recent = [(k, v) for k, v in apps.items() if v.get("last_seen", "") >= cutoff]
        recent.sort(key=lambda kv: (kv[1].get("best_rank", 10_000), kv[0]))
        return [k for k, _ in recent[:limit]]


def load_terms() -> list[dict[str, Any]]:
    """Termes à interroger : graines du plugin, puis termes validés de l'utilisateur."""
    terms: dict[str, dict[str, Any]] = {}
    for name in ("seeds", "terms"):
        for item in settings.load(name).get("term", []):
            if item.get("status", "seed") in ("seed", "validated"):
                terms[item["id"]] = item
    return list(terms.values())
