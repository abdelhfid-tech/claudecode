"""Lecture ville par ville de l'autocomplétion « terme + ville » (collecteur autocomplete_villes).

Pour chaque sujet et chaque ville : les suggestions qui citent à la fois le sujet et la ville.
La suggestion nue (« padel fès ») montre qu'on cherche le sujet dans la ville ; les précisions
(« padel fès prix », « padel fès réservation ») montrent qu'il y est installé.

Statuts : installée (3 précisions ou plus), en train d'arriver (1 ou 2), à peine (la seule
recherche nue), absente (rien). Les faux amis sont écartés : « fès » ne compte pas dans
« festival » ou « fessier », et « match fès » ne compte pas pour « matcha ».
"""

from __future__ import annotations

import re
import unicodedata
from datetime import date
from typing import Any

from . import settings
from .storage import RawStore

SOURCE = "autocomplete_villes"
STATUS_ORDER = {"installée": 3, "en train d'arriver": 2, "à peine": 1, "absente": 0}


def norm(text: str) -> str:
    """Minuscules sans accents, ponctuation remplacée par des espaces."""
    plain = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", plain).strip()


def city_patterns(cities: list[dict[str, Any]]) -> dict[str, re.Pattern[str]]:
    return {c["id"]: re.compile(c["match"], re.I) for c in cities}


def city_exclusions(cities: list[dict[str, Any]]) -> dict[str, re.Pattern[str] | None]:
    """Faux amis propres à une ville (la marque de mode Casablanca, le chanteur Julian Casablancas…)."""
    return {c["id"]: re.compile(c["exclude"], re.I) if c.get("exclude") else None for c in cities}


def local_suggestions(subject: str, city_re: re.Pattern[str], suggestions: list[str],
                      exclude: re.Pattern[str] | None = None) -> list[str]:
    """Suggestions qui citent la ville (mot entier) et chaque mot du sujet (en début de mot).

    « agence immobilière à fès » ne compte pas pour « agence ia », ni « match fès » pour « matcha ».
    """
    tokens = norm(subject).split()
    out = []
    for s in suggestions:
        n = norm(s)
        if exclude is not None and exclude.search(n):
            continue
        if city_re.search(n) and all(re.search(rf"\b{re.escape(t)}", n) for t in tokens):
            out.append(s)
    return out


def status(subject: str, query: str, local: list[str]) -> tuple[str, list[str]]:
    bare = norm(query)
    precisions = [s for s in local if norm(s) != bare]
    if len(precisions) >= 3:
        return "installée", precisions
    if precisions:
        return "en train d'arriver", precisions
    if local:
        return "à peine", []
    return "absente", []


def latest_day(store: RawStore, day: date | None = None) -> date | None:
    days = [d for d in store.days(SOURCE) if day is None or d <= day]
    return days[-1] if days else None


def table(store: RawStore, day: date | None = None, cfg: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Une ligne par (sujet, ville), au dernier relevé."""
    cfg = cfg if cfg is not None else settings.load("sources").get("source", {}).get(SOURCE, {})
    cities = cfg.get("cities", [])
    pats = city_patterns(cities)
    excl = city_exclusions(cities)
    labels = {c["id"]: c["label"] for c in cities}
    d = latest_day(store, day)
    if not d:
        return []
    rows: dict[tuple[str, str], dict[str, Any]] = {}
    for r in store.read(SOURCE, d):
        if r.get("kind") != "suggest_city":
            continue
        meta = r.get("meta", {})
        city = meta.get("city")
        if city not in pats:
            continue
        local = local_suggestions(meta.get("subject", ""), pats[city], r.get("value") or [], excl.get(city))
        st, precisions = status(meta.get("subject", ""), meta.get("query", ""), local)
        rows[(meta.get("subject", ""), city)] = {
            "sujet": meta.get("subject", ""), "type": "Métier local" if meta.get("kind") == "metier" else "Tendance",
            "ville": labels.get(city, city), "ville_id": city, "zone": r.get("zone", ""), "statut": st,
            "niveau": STATUS_ORDER[st], "precisions": " ; ".join(precisions[:5]), "nb_precisions": len(precisions),
            "releve": d.isoformat(),
        }
    order = {c["id"]: i for i, c in enumerate(cities)}
    return sorted(rows.values(), key=lambda x: (x["type"], x["sujet"], order.get(x["ville_id"], 99)))


def lags(rows: list[dict[str, Any]], leader: str, follower: str) -> list[dict[str, Any]]:
    """Sujets installés dans la ville en avance et pas encore dans l'autre (décalage interne)."""
    by = {(r["sujet"], r["ville_id"]): r for r in rows}
    out = []
    for (subject, city), r in by.items():
        if city != leader or r["niveau"] < 3:
            continue
        f = by.get((subject, follower))
        if f and f["niveau"] <= 1:
            out.append({"sujet": subject, "avance": r["ville"], "retard": f["ville"],
                        "statut_retard": f["statut"], "precisions_avance": r["precisions"]})
    return sorted(out, key=lambda x: x["sujet"])


def render(rows: list[dict[str, Any]]) -> str:
    if not rows:
        return "Aucun relevé ville par ville : lancez « collect --cadence weekly »."
    cities = list(dict.fromkeys(r["ville"] for r in rows))
    subjects = list(dict.fromkeys((r["type"], r["sujet"]) for r in rows))
    mark = {"installée": "●●●", "en train d'arriver": "●● ", "à peine": "●  ", "absente": "·  "}
    by = {(r["sujet"], r["ville"]): r for r in rows}
    lines = [f"Relevé du {rows[0]['releve']} : ●●● installée, ●● en train d'arriver, ● à peine, · absente",
             f"{'sujet':28}" + "".join(f"{c[:11]:>12}" for c in cities)]
    current = None
    for kind, subject in subjects:
        if kind != current:
            lines.append(f"-- {kind}")
            current = kind
        cells = "".join(f"{mark[by[(subject, c)]['statut']] if (subject, c) in by else '?':>12}" for c in cities)
        lines.append(f"{subject[:28]:28}{cells}")
    return "\n".join(lines)
