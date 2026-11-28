"""Relevé « assortiment » : chaque concept d'un commerce de Fès cherché à Fès, à Casablanca et au Maroc.

Paramètres (familles, concepts, écosystème local) : config/assortiment.toml, ou la liste du
commerçant dans <espace>/config/assortiment.toml. Environ 400 requêtes, une par seconde, sur le
même point d'accès que l'autocomplétion par pays. Cadence hebdomadaire.
"""

from __future__ import annotations

import json
from urllib.parse import quote

from ..storage import make_record
from .autocomplete import GOOGLE, parse_google
from .base import Collector, Context, Result


class AutocompleteAssortiment(Collector):
    name = "autocomplete_assortiment"
    family = "search"
    cadence = "weekly"

    def collect(self, ctx: Context) -> Result:
        from ..assortiment import load_config, plan

        res = Result()
        if not ctx.zone_ok("MA"):
            return res
        cfg = ctx.source_config.get("config") or load_config()
        for q in plan(cfg):
            r = ctx.client.request(GOOGLE.format(hl=q["hl"], gl="ma", q=quote(q["query"])))
            label = f"google MA « {q['query']} »"
            if not r.ok:
                res.unit(False, f"{label} : {r.status or r.error}")
                continue
            try:
                suggestions = parse_google(json.loads(r.body.decode("utf-8", "replace")))
            except (ValueError, TypeError) as exc:
                res.unit(False, f"{label} : illisible ({exc})")
                continue
            res.unit(True)
            key = f"{q['kind']}:{q.get('concept') or q['terme']}|{q['place']}|{q['lang']}"
            res.records.append(make_record(self.name, "MA", "suggest_assortment", key, suggestions, q, ts=ctx.now))
        return res
