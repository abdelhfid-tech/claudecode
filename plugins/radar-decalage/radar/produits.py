"""Lecture du radar produits : produits recherchés au Maroc, installés à Casablanca, pas encore à Fès.

Une suggestion « prix trottinette électrique maroc » montre que beaucoup de gens cherchent ce
produit au Maroc. La localisation dit où il est déjà vendu et recherché : quand « produit +
casablanca » a des précisions (prix, magasin, adresse) et « produit + fès » n'en a pas, le
produit est installé à Casablanca mais pas encore à Fès : c'est le décalage à exploiter en
vente en ligne locale (paiement à la livraison, réseaux sociaux, WhatsApp).

Ce que ce radar ne voit pas : les volumes, les prix pratiqués, le nombre de vendeurs, Avito,
Instagram et les groupes WhatsApp où se fait une grande part du commerce local.
"""

from __future__ import annotations

import re
import unicodedata
from datetime import date
from typing import Any

from . import settings
from .storage import RawStore

SOURCE = "autocomplete_produits"
LEVEL_NAMES = {3: "installé", 2: "en train d'arriver", 1: "à peine", 0: "absent"}


def load_config() -> dict[str, Any]:
    return settings.load("produits")


def norm_u(text: str) -> str:
    """Minuscules, accents latins retirés, lettres arabes gardées, ponctuation en espaces."""
    decomposed = unicodedata.normalize("NFKD", text.lower())
    plain = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return re.sub(r"[^\w]+", " ", plain).strip()


def extract(suggestion: str, cfg: dict[str, Any]) -> str:
    text = norm_u(suggestion)
    for pat in cfg.get("filters", {}).get("strip", []):
        text = re.sub(pat, " ", text)
    return re.sub(r"\s+", " ", text).strip()


def excluded(product: str, cfg: dict[str, Any]) -> bool:
    return any(re.search(p, product) for p in cfg.get("filters", {}).get("exclude", []))


def risks(product: str, cfg: dict[str, Any]) -> list[str]:
    return [r["label"] for r in cfg.get("risks", []) if re.search(r["pattern"], product)]


def discover(found: list[dict[str, Any]], cfg: dict[str, Any]) -> list[dict[str, Any]]:
    """Produits extraits des suggestions de découverte, filtrés, regroupés et classés par fréquence."""
    products: dict[str, dict[str, Any]] = {}
    order = 0
    requires = [(d["prefix"], re.compile(d["require"])) for d in cfg.get("discovery", []) if d.get("require")]
    for f in found:
        need = next((rx for prefix, rx in requires if f["query"].startswith(prefix)), None)
        for s in f["suggestions"]:
            if need is not None and not need.search(norm_u(s)):
                continue
            p = extract(s, cfg)
            if len(p) < 3 or excluded(p, cfg):
                continue
            key = " ".join(p.split()[:3])
            if key not in products:
                products[key] = {"cle": key, "produit": key, "lang": f["lang"], "citations": 0, "exemples": [],
                                 "ordre": order, "origines": set()}
                order += 1
            products[key]["citations"] += 1
            products[key]["origines"].add(f.get("origin", "Maroc"))
            if len(products[key]["exemples"]) < 3:
                products[key]["exemples"].append(s)
    return sorted(products.values(), key=lambda x: (-x["citations"], x["ordre"]))


def city_matchers(cfg: dict[str, Any]) -> dict[str, re.Pattern[str]]:
    cities = {c["id"]: c for c in settings.load("sources").get("source", {}).get("autocomplete_villes", {})
              .get("cities", [])}
    out = {}
    for cid in cfg.get("cities", []):
        latin = cities.get(cid, {}).get("match", re.escape(cid))
        arabic = cfg.get("city_ar_match", {}).get(cid)
        out[cid] = re.compile(f"{latin}|{arabic}" if arabic else latin)
    return out


def level(product: str, query: str, suggestions: list[str], city_re: re.Pattern[str]) -> tuple[int, list[str]]:
    """3 : au moins 3 précisions locales ; 2 : 1 ou 2 ; 1 : seule la recherche nue ; 0 : rien."""
    tokens = norm_u(product).split()
    bare = norm_u(query)
    local = [s for s in suggestions
             if city_re.search(norm_u(s)) and all(re.search(rf"\b{re.escape(t)}", norm_u(s)) for t in tokens)]
    precisions = [s for s in local if norm_u(s) != bare]
    if len(precisions) >= 3:
        return 3, precisions
    if precisions:
        return 2, precisions
    return (1, []) if local else (0, [])


def verdict(casa: int, fes: int) -> str:
    if casa >= 2 and fes <= 1:
        return "Installé à Casablanca, pas encore à Fès"
    if fes >= 2:
        return "Déjà recherché à Fès"
    if casa <= 1 and fes <= 1:
        return "Demande nationale, peu localisée"
    return "À surveiller"


def latest_day(store: RawStore, day: date | None = None) -> date | None:
    days = [d for d in store.days(SOURCE) if day is None or d <= day]
    return days[-1] if days else None


def table(store: RawStore, day: date | None = None, cfg: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    cfg = cfg if cfg is not None else load_config()
    d = latest_day(store, day)
    if not d:
        return []
    discovery, checks = {}, {}
    for r in store.read(SOURCE, d):   # plusieurs passages le même jour : le dernier l'emporte
        meta = r.get("meta", {})
        if r.get("kind") == "suggest_discovery":
            discovery[(r.get("zone"), meta.get("query", ""))] = {
                "query": meta.get("query", ""), "lang": meta.get("lang", "fr"), "origin": meta.get("origin", "Maroc"),
                "suggestions": r.get("value") or []}
        elif r.get("kind") == "suggest_product_city":
            checks[(meta.get("cle"), meta.get("city"))] = (meta.get("query", ""), r.get("value") or [])
    found = list(discovery.values())
    matchers = city_matchers(cfg)
    rows = []
    for p in discover(found, cfg):
        if not any((p["cle"], c) in checks for c in matchers):
            continue
        levels = {}
        precisions = {}
        for cid, cre in matchers.items():
            q, sugg = checks.get((p["cle"], cid), ("", []))
            levels[cid], precisions[cid] = level(p["produit"], q, sugg, cre)
        casa, fes = levels.get("casablanca", 0), levels.get("fes", 0)
        rows.append({
            "produit": p["produit"], "langue": {"ar": "arabe", "en": "anglais"}.get(p["lang"], "français"),
            "origine": " et ".join(sorted(p["origines"])),
            "citations": p["citations"], "exemple": p["exemples"][0] if p["exemples"] else "",
            "casablanca": LEVEL_NAMES[casa], "niveau_casablanca": casa,
            "fes": LEVEL_NAMES[fes], "niveau_fes": fes,
            "precisions_casablanca": " ; ".join(precisions.get("casablanca", [])[:4]),
            "precisions_fes": " ; ".join(precisions.get("fes", [])[:4]),
            "verdict": verdict(casa, fes), "risques": " ; ".join(risks(p["produit"], cfg)), "releve": d.isoformat(),
        })
    priority = {"Installé à Casablanca, pas encore à Fès": 0, "À surveiller": 1, "Déjà recherché à Fès": 2,
                "Demande nationale, peu localisée": 3}
    return sorted(rows, key=lambda r: (priority[r["verdict"]], -r["niveau_casablanca"], -r["citations"], r["produit"]))


def render(rows: list[dict[str, Any]]) -> str:
    if not rows:
        return "Aucun relevé produits : lancez « collect --cadence weekly »."
    lines = [f"Relevé du {rows[0]['releve']}",
             f"{'produit':30} {'cherché à':16} {'cit.':>4} {'Casablanca':>18} {'Fès':>18}  verdict / risques"]
    for r in rows:
        lines.append(f"{r['produit'][:30]:30} {r.get('origine', '')[:16]:16} {r['citations']:>4} {r['casablanca']:>18} {r['fes']:>18}  {r['verdict']}"
                     + (f" / {r['risques']}" if r["risques"] else ""))
    return "\n".join(lines)
