"""App Store : classements par vitrine et disponibilité des apps suivies.

La disponibilité est la mesure principale : la plupart des apps US « absentes »
d'un classement français y sont en fait indisponibles. La date de sortie fournie
par Apple n'est pas une date d'émergence (tronquée à l'ouverture de la vitrine,
avril 2020 au Maroc) : le radar historise lui-même la première disponibilité.
"""

from __future__ import annotations

from typing import Any

from ..storage import make_record
from .base import Collector, Context, Result

V2 = "https://rss.marketingtools.apple.com/api/v2/{cc}/apps/{chart}/{limit}/apps.json"
LEGACY = "https://itunes.apple.com/{cc}/rss/{feed}/limit={limit}/json"
LOOKUP = "https://itunes.apple.com/lookup?id={ids}&country={cc}"

LEGACY_FEEDS = {"top-free": "topfreeapplications", "top-paid": "toppaidapplications",
                "top-grossing": "topgrossingapplications"}


def parse_v2(payload: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for rank, item in enumerate(payload.get("feed", {}).get("results", []), start=1):
        rows.append({"rank": rank, "id": str(item["id"]), "name": item.get("name", ""),
                     "artist": item.get("artistName", ""),
                     "genres": [g.get("name", "") for g in item.get("genres", []) if isinstance(g, dict)]})
    return rows


def parse_legacy(payload: dict[str, Any]) -> list[dict[str, Any]]:
    entries = payload.get("feed", {}).get("entry", [])
    if isinstance(entries, dict):  # une seule entrée
        entries = [entries]
    rows = []
    for rank, e in enumerate(entries, start=1):
        rows.append({"rank": rank, "id": str(e["id"]["attributes"]["im:id"]),
                     "name": e.get("im:name", {}).get("label", ""),
                     "artist": e.get("im:artist", {}).get("label", ""),
                     "genres": [e.get("category", {}).get("attributes", {}).get("label", "")]})
    return rows


def parse_lookup(payload: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out = {}
    for r in payload.get("results", []):
        if "trackId" not in r:
            continue
        out[str(r["trackId"])] = {
            "name": r.get("trackName", ""),
            "version": r.get("version", ""),
            "current_version_date": (r.get("currentVersionReleaseDate") or "")[:10],
            "release_date": (r.get("releaseDate") or "")[:10],
            "genre": r.get("primaryGenreName", ""),
            "price": r.get("price"),
        }
    return out


class AppleCharts(Collector):
    name = "apple_charts"
    family = "stores"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        limit = int(cfg.get("limit", 100))
        for zone in ctx.zones.with_flag("apple"):
            cc = zone["apple"]
            charts = ["top-free"] + (["top-grossing"] if zone.get("apple_grossing") else [])
            for chart in charts:
                rows, feed, err = self._fetch(ctx, cc, chart, limit)
                res.unit(bool(rows), err and f"{zone['code']} {chart}: {err}")
                for row in rows:
                    res.records.append(make_record(
                        self.name, zone["code"], "rank", f"ios:{row['id']}", row["rank"],
                        {"chart": chart, "feed": feed, "name": row["name"], "artist": row["artist"],
                         "genres": row["genres"]}, ts=ctx.now))
        return res

    def _fetch(self, ctx: Context, cc: str, chart: str, limit: int):
        """Flux historique d'abord (fiable, avec le genre), flux v2 en repli.

        Mesure du 28/11/2026 : le flux v2 échoue environ une fois sur deux en rafale
        (délais dépassés, erreurs 502), le flux historique répond en 0,2 à 1,5 s.
        """
        errors = []
        r = ctx.client.request(LEGACY.format(cc=cc, feed=LEGACY_FEEDS[chart], limit=limit))
        if r.ok:
            try:
                rows = parse_legacy(r.json())
                if rows:
                    return rows, "legacy", None
                errors.append("historique vide")
            except (ValueError, KeyError, TypeError) as exc:
                errors.append(f"historique illisible ({exc})")
        else:
            errors.append(f"historique {r.status or r.error}")
        if chart in ("top-free", "top-paid"):
            r = ctx.client.request(V2.format(cc=cc, chart=chart, limit=min(limit, 100)))
            if r.ok:
                try:
                    rows = parse_v2(r.json())
                    if rows:
                        return rows, "v2", None
                    errors.append("v2 vide")
                except (ValueError, KeyError, TypeError) as exc:
                    errors.append(f"v2 illisible ({exc})")
            else:
                errors.append(f"v2 {r.status or r.error}")
        return [], None, "; ".join(errors)


class AppleLookup(Collector):
    """Disponibilité des apps suivies dans chaque vitrine (identifiants groupés)."""

    name = "apple_lookup"
    family = "stores"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        batch = int(cfg.get("batch_size", 100))
        ids = ctx.watchlist.apps_to_check("ios", ctx.day, int(cfg.get("max_age_days", 60)),
                                          int(cfg.get("max_apps", 600)))
        if not ids:
            return res
        for zone in ctx.zones.with_flag("apple"):
            cc = zone["apple"]
            for start in range(0, len(ids), batch):
                chunk = ids[start:start + batch]
                r = ctx.client.request(LOOKUP.format(ids=",".join(chunk), cc=cc))
                if not r.ok:
                    res.unit(False, f"{zone['code']} lot {start // batch}: {r.status or r.error}")
                    continue
                try:
                    found = parse_lookup(r.json())
                except (ValueError, KeyError, TypeError) as exc:
                    res.unit(False, f"{zone['code']} lot {start // batch}: illisible ({exc})")
                    continue
                res.unit(True)
                for app_id in chunk:
                    info = found.get(app_id)
                    meta = {"version": info["version"], "current_version_date": info["current_version_date"],
                            "release_date": info["release_date"]} if info else {}
                    res.records.append(make_record(self.name, zone["code"], "availability",
                                                   f"ios:{app_id}", 1 if info else 0, meta, ts=ctx.now))
        return res
