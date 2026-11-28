"""Radar produits : ce que l'on veut acheter au Maroc, puis où c'est installé (Casablanca, Fès).

Deux temps, chaque semaine :
  1. découverte : suggestions Google pour « prix a », « prix b »… et « ثمن ا », « ثمن ب »…
     (intention d'achat, en français et en arabe) ; les produits sont extraits et filtrés
     (voitures, or, carburant, médicaments, immobilier, services… écartés, config/produits.toml) ;
  2. localisation : pour les produits les plus cités, « produit + casablanca » et « produit + fès ».

Découverte au Maroc (français, arabe) et à Dubaï (anglais), puis localisation à Casablanca et Fès :
environ 80 + 2 × 45 = 170 requêtes, une par seconde, sur le même point d'accès que l'autocomplétion.
"""

from __future__ import annotations

import json
from typing import Any
from urllib.parse import quote

from .. import settings
from ..storage import make_record
from .autocomplete import GOOGLE, parse_google
from .base import Collector, Context, Result


class AutocompleteProduits(Collector):
    name = "autocomplete_produits"
    family = "search"
    cadence = "weekly"

    def _ask(self, ctx: Context, res: Result, query: str, hl: str, gl: str = "ma") -> list[str] | None:
        r = ctx.client.request(GOOGLE.format(hl=hl, gl=gl, q=quote(query)))
        if not r.ok:
            res.unit(False, f"google {gl.upper()} « {query} » : {r.status or r.error}")
            return None
        try:
            out = parse_google(json.loads(r.body.decode("utf-8", "replace")))
        except (ValueError, TypeError) as exc:
            res.unit(False, f"google MA « {query} » : illisible ({exc})")
            return None
        res.unit(True)
        return out

    def collect(self, ctx: Context) -> Result:
        from ..produits import discover, load_config

        res = Result()
        if not ctx.zone_ok("MA"):
            return res
        cfg = ctx.source_config.get("config") or load_config()
        cities = {c["id"]: c for c in settings.load("sources").get("source", {}).get("autocomplete_villes", {})
                  .get("cities", [])}
        found: list[dict[str, Any]] = []
        for d in cfg.get("discovery", []):
            for letter in d["letters"]:
                q = d["prefix"] + letter
                gl = d.get("gl", "ma")
                sugg = self._ask(ctx, res, q, d["hl"], gl)
                if sugg is None:
                    continue
                origin = d.get("origin", "Maroc")
                res.records.append(make_record(self.name, gl.upper(), "suggest_discovery", f"q:{gl}:{q}", sugg,
                                               {"query": q, "lang": d["lang"], "hl": d["hl"], "origin": origin},
                                               ts=ctx.now))
                found.append({"query": q, "lang": d["lang"], "origin": origin, "suggestions": sugg})
        for p in discover(found, cfg)[: int(cfg.get("top_products", 45))]:
            for city in cfg.get("cities", []):
                name = cfg.get("city_ar", {}).get(city) if p["lang"] == "ar" else cities.get(city, {}).get("query", city)
                q = f"{p['produit']} {name}"
                sugg = self._ask(ctx, res, q, "ar" if p["lang"] == "ar" else "fr")
                if sugg is None:
                    continue
                res.records.append(make_record(self.name, "MA", "suggest_product_city", f"produit:{p['cle']}|{city}", sugg,
                                               {"produit": p["produit"], "cle": p["cle"], "lang": p["lang"],
                                                "city": city, "query": q}, ts=ctx.now))
        return res
