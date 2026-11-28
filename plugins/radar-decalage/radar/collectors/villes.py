"""Autocomplétion Google « terme + ville » : où une tendance est déjà installée, ville par ville.

Une tendance arrive d'abord dans une grande ville (Paris, Casablanca), puis dans les autres
(Lyon, Fès…). Quand Google propose des précisions locales (« padel fès prix », « pilates
reformer casablanca studio »), beaucoup de gens les cherchent : la tendance est installée.
Le même relevé porte sur des métiers locaux (riad, école privée…) pour choisir une cible.

Cadence hebdomadaire (`collect --cadence weekly`) : environ 250 requêtes, une par seconde.
Même point d'accès que l'autocomplétion par pays (suggestqueries.google.com, sans robots.txt).
"""

from __future__ import annotations

import json
import re
import unicodedata
from typing import Any
from urllib.parse import quote

from ..storage import make_record
from .autocomplete import GOOGLE, parse_google
from .base import Collector, Context, Result


def slug(text: str) -> str:
    plain = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", plain).strip("-")


def plan_city_queries(terms: list[dict[str, Any]], trades: list[str], cities: list[dict[str, Any]],
                      max_queries: int) -> list[dict[str, Any]]:
    """Tendances suivies (variante française) puis métiers locaux, croisés avec chaque ville."""
    subjects = [{"id": t["id"], "label": t["fr"][0], "kind": "tendance"} for t in terms if t.get("fr")]
    subjects += [{"id": f"metier-{slug(m)}", "label": m, "kind": "metier"} for m in trades]
    queries = []
    for sub in subjects:
        for city in cities:
            queries.append({**sub, "city": city["id"], "zone": city["zone"], "gl": city["gl"],
                            "hl": city.get("hl", "fr"), "query": f"{sub['label']} {city['query']}"})
            if len(queries) >= max_queries:
                return queries
    return queries


class AutocompleteVilles(Collector):
    name = "autocomplete_villes"
    family = "search"
    cadence = "weekly"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        cities = [c for c in cfg.get("cities", []) if ctx.zone_ok(c["zone"])]
        queries = plan_city_queries(ctx.terms, cfg.get("trades", []), cities, int(cfg.get("max_queries", 260)))
        for q in queries:
            r = ctx.client.request(GOOGLE.format(hl=q["hl"], gl=q["gl"], q=quote(q["query"])))
            label = f"google {q['city']} « {q['query']} »"
            if not r.ok:
                res.unit(False, f"{label}: {r.status or r.error}")
                continue
            try:
                suggestions = parse_google(json.loads(r.body.decode("utf-8", "replace")))
            except (ValueError, TypeError) as exc:
                res.unit(False, f"{label}: illisible ({exc})")
                continue
            res.unit(True)
            res.records.append(make_record(
                self.name, q["zone"], "suggest_city", f"{q['kind']}:{q['id']}|{q['city']}", suggestions,
                {"city": q["city"], "subject": q["label"], "kind": q["kind"], "query": q["query"]}, ts=ctx.now))
        return res
