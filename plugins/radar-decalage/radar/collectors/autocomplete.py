"""Autocomplétion Google, YouTube et Amazon, par pays et par langue.

Seul capteur fin de présence locale au Maroc (« labubu prix maroc ») : il n'a
pas d'historique, il est donc historisé dès le premier jour. Les requêtes sont
plafonnées par exécution.

robots.txt : suggestqueries.google.com n'en publie pas (404, donc autorisé) ;
completion.amazon.* interdit tout (« Disallow: / ») : aucun couple Amazon n'est
configuré par défaut, et le client refuserait de toute façon ces adresses.
"""

from __future__ import annotations

import json
from typing import Any
from urllib.parse import quote

from ..storage import make_record
from .base import Collector, Context, Result

GOOGLE = "https://suggestqueries.google.com/complete/search?client=firefox&hl={hl}&gl={gl}&q={q}"
YOUTUBE = "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl={hl}&gl={gl}&q={q}"
AMAZON = "https://completion.amazon.{tld}/api/2017/suggestions?mid={mid}&alias=aps&prefix={q}"

AMAZON_MARKETS = {  # identifiants de place de marché publics d'Amazon
    "com": "ATVPDKIKX0DER", "fr": "A13V1IB3VIYZZH", "de": "A1PA6795UKMFR9", "es": "A1RKKUPIHCS9HS",
    "it": "APJ6JRA9NG5V4", "co.uk": "A1F83G8C2ARO7P", "ca": "A2EUQ1WTGCTBG2",
}


def parse_google(payload: Any) -> list[str]:
    if isinstance(payload, list) and len(payload) > 1 and isinstance(payload[1], list):
        return [s for s in payload[1] if isinstance(s, str)]
    raise ValueError("format inattendu")


def parse_amazon(payload: Any) -> list[str]:
    if isinstance(payload, dict) and isinstance(payload.get("suggestions"), list):
        return [s.get("value", "") for s in payload["suggestions"] if isinstance(s, dict) and s.get("value")]
    raise ValueError("format inattendu")


def plan_queries(terms: list[dict[str, Any]], pairs: list[dict[str, Any]], max_queries: int) -> list[dict[str, Any]]:
    """Croise termes et couples (moteur, pays, langue), dans l'ordre des termes, sans dépasser le plafond.

    Un terme sans variante dans la langue demandée est ignoré pour ce couple :
    pas de traduction implicite (les variantes en darija sont validées par un humain).
    """
    queries = []
    for term in terms:
        for pair in pairs:
            for variant in term.get(pair["lang"], []) or []:
                queries.append({"term": term["id"], "query": variant, **pair})
                if len(queries) >= max_queries:
                    return queries
    return queries


class Autocomplete(Collector):
    name = "autocomplete"
    family = "search"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        pairs = [p for p in cfg.get("pairs", []) if ctx.zone_ok(p["zone"])]
        queries = plan_queries(ctx.terms, pairs, int(cfg.get("max_queries", 300)))
        for q in queries:
            engine = q["engine"]
            if engine == "amazon":
                tld = q.get("amazon")
                if tld not in AMAZON_MARKETS:
                    res.unit(False, f"amazon {q['zone']} : place de marché inconnue « {tld} »")
                    continue
                url = AMAZON.format(tld=tld, mid=AMAZON_MARKETS[tld], q=quote(q["query"]))
            else:
                url = (YOUTUBE if engine == "youtube" else GOOGLE).format(hl=q["hl"], gl=q["gl"], q=quote(q["query"]))
            r = ctx.client.request(url)
            label = f"{engine} {q['zone']} {q['lang']} « {q['query']} »"
            if not r.ok:
                res.unit(False, f"{label}: {r.status or r.error}")
                continue
            try:
                payload = json.loads(r.body.decode("utf-8", "replace"))
                suggestions = parse_amazon(payload) if engine == "amazon" else parse_google(payload)
            except (ValueError, TypeError) as exc:
                res.unit(False, f"{label}: illisible ({exc})")
                continue
            res.unit(True)
            res.records.append(make_record(
                self.name, q["zone"], "suggest", f"term:{q['term']}", suggestions,
                {"engine": engine, "lang": q["lang"], "query": q["query"], "hl": q.get("hl"), "gl": q.get("gl")},
                ts=ctx.now))
        return res
