"""App Store : classements par vitrine (flux v2) et disponibilité des apps suivies (lookup).

robots.txt d'Apple : « Disallow: /*/rss/* » et « Disallow: /*/lookup? » sur itunes.apple.com.
Le flux v2 (rss.marketingtools.apple.com) et /lookup?id= sont autorisés.

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
LOOKUP = "https://itunes.apple.com/lookup?id={ids}&country={cc}"



def parse_v2(payload: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for rank, item in enumerate(payload.get("feed", {}).get("results", []), start=1):
        rows.append({"rank": rank, "id": str(item["id"]), "name": item.get("name", ""),
                     "artist": item.get("artistName", ""),
                     "genres": [g.get("name", "") for g in item.get("genres", []) if isinstance(g, dict)]})
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
    """Classements App Store par vitrine, flux v2 seulement.

    Le flux historique (itunes.apple.com/<pays>/rss/...) est interdit par le robots.txt
    d'Apple (« Disallow: /*/rss/* ») : il n'est plus utilisé, ni le classement des revenus
    qui n'existe que là. Le flux v2 est instable (délais dépassés, 502) : reprises bornées.
    """

    name = "apple_charts"
    family = "stores"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        limit = min(int(ctx.source_config.get("limit", 100)), 100)
        for zone in ctx.zones.with_flag("apple"):
            try:
                r = ctx.client.request(V2.format(cc=zone["apple"], chart="top-free", limit=limit))
                if not r.ok:
                    res.unit(False, f"{zone['code']} top-free : {r.status or r.error}")
                    continue
                rows = parse_v2(r.json())
                if not rows:
                    res.unit(False, f"{zone['code']} top-free : classement vide")
                    continue
                res.unit(True)
                for row in rows:
                    res.records.append(make_record(
                        self.name, zone["code"], "rank", f"ios:{row['id']}", row["rank"],
                        {"chart": "top-free", "feed": "v2", "name": row["name"], "artist": row["artist"],
                         "genres": row["genres"]}, ts=ctx.now))
            except (ValueError, KeyError, TypeError) as exc:
                res.unit(False, f"{zone['code']} top-free : réponse illisible ({type(exc).__name__}: {exc})")
        return res


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
                    payload = r.json()
                    if not isinstance(payload, dict) or not isinstance(payload.get("results"), list):
                        raise ValueError("champ « results » absent")
                    found = parse_lookup(payload)
                except (ValueError, KeyError, TypeError) as exc:
                    res.unit(False, f"{zone['code']} lot {start // batch}: illisible ({exc})")
                    continue
                if not found:
                    # Une réponse vide pour un lot entier ressemble à une panne ou à un changement de
                    # format, pas à 100 apps retirées d'un coup : aucun « indisponible » n'est écrit.
                    res.unit(False, f"{zone['code']} lot {start // batch}: réponse vide pour {len(chunk)} apps")
                    continue
                res.unit(True)
                for app_id in chunk:
                    info = found.get(app_id)
                    meta = {"version": info["version"], "current_version_date": info["current_version_date"],
                            "release_date": info["release_date"]} if info else {}
                    res.records.append(make_record(self.name, zone["code"], "availability",
                                                   f"ios:{app_id}", 1 if info else 0, meta, ts=ctx.now))
        return res
