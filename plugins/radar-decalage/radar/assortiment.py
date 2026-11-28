"""Relevé « assortiment » : ce qu'un commerce de Fès doit mettre en avant, tester, vendre en ligne ou réduire.

Pour chaque concept d'une famille (« pyjama enfant », « theiere »…), l'autocomplétion Google est
interrogée à Fès, à Casablanca et au Maroc, en français et en arabe quand une variante existe :
  - Demandé à Fès : des précisions locales (prix, magasin, quartier) ; à mettre en avant en rayon ;
  - En avance à Casablanca : installé là-bas, pas encore à Fès ; à tester, et à annoncer en ligne ;
  - Demandé au Maroc, peu localisé : on le cherche partout sans lieu ; à vendre en ligne et livrer ;
  - Peu cherché sur Google : profondeur minimale, sauf achat d'impulsion (la caisse juge).
Les précisions disent aussi comment on cherche : prix, magasin, livraison, gros, personnalisé, cadeau.

Le même relevé interroge l'écosystème local (riads, cliniques, coopératives, livraison…) : clients
professionnels, fournisseurs et relais digitaux, avec les noms que Google associe à Fès.

Ce relevé ne mesure ni les volumes ni les ventes : une recherche fréquente n'est pas une vente, et
une grande part du commerce de Fès passe par Instagram, WhatsApp et le bouche-à-oreille.
"""

from __future__ import annotations

import re
from datetime import date
from typing import Any

from . import settings
from .produits import level, norm_u
from .storage import RawStore

SOURCE = "autocomplete_assortiment"
LEVEL_NAMES = {3: "installé", 2: "en train d'arriver", 1: "à peine", 0: "absent"}
VERDICTS = ["Demandé à Fès", "En avance à Casablanca", "Demandé au Maroc, peu localisé", "Cherché, sans précision",
            "Peu cherché sur Google"]


def load_config() -> dict[str, Any]:
    return settings.load("assortiment")


def concept_id(concept: dict[str, Any]) -> str:
    return re.sub(r"\s+", "-", norm_u(concept["fr"]))


def city_patterns(cfg: dict[str, Any]) -> dict[str, re.Pattern[str]]:
    """Motif de reconnaissance de chaque lieu (villes du relevé ville par ville, plus le Maroc)."""
    cities = {c["id"]: c for c in settings.load("sources").get("source", {}).get("autocomplete_villes", {})
              .get("cities", [])}
    out = {}
    for cid in (cfg.get("city", "fes"), cfg.get("leader", "casablanca")):
        latin = cities.get(cid, {}).get("match", rf"\b{re.escape(cid)}\b")
        arabic = cfg.get("city_ar_match", {}).get(cid)
        out[cid] = re.compile(f"{latin}|{arabic}" if arabic else latin)
    out["maroc"] = re.compile(cfg.get("national", {}).get("match", r"\bmaroc\b"))
    return out


def plan(cfg: dict[str, Any]) -> list[dict[str, Any]]:
    """Requêtes du relevé : concept × lieu (français), concept × Fès et Maroc (arabe), puis écosystème × Fès."""
    cities = {c["id"]: c for c in settings.load("sources").get("source", {}).get("autocomplete_villes", {})
              .get("cities", [])}
    city, leader = cfg.get("city", "fes"), cfg.get("leader", "casablanca")
    nat = cfg.get("national", {})
    places_fr = [(city, cities.get(city, {}).get("query", city)), (leader, cities.get(leader, {}).get("query", leader)),
                 ("maroc", nat.get("fr", "maroc"))]
    places_ar = [(city, cfg.get("city_ar", {}).get(city)), ("maroc", nat.get("ar"))]
    out = []
    for fam in cfg.get("famille", []):
        for c in fam.get("concepts", []):
            cid = concept_id(c)
            for place, word in places_fr:
                out.append({"kind": "concept", "famille": fam["id"], "concept": cid, "terme": c["fr"], "lang": "fr",
                            "place": place, "hl": "fr", "query": f"{c['fr']} {word}"})
            if c.get("ar"):
                for place, word in places_ar:
                    if word:
                        out.append({"kind": "concept", "famille": fam["id"], "concept": cid, "terme": c["ar"],
                                    "lang": "ar", "place": place, "hl": "ar", "query": f"{c['ar']} {word}"})
    city_word = cities.get(city, {}).get("query", city)
    for eco in cfg.get("ecosysteme", []):
        for t in eco.get("termes", []):
            out.append({"kind": "ecosysteme", "role": eco["role"], "terme": t, "lang": "fr", "place": city, "hl": "fr",
                        "query": f"{t} {city_word}"})
    return out


def intents(suggestions: list[str], cfg: dict[str, Any]) -> list[str]:
    found = []
    for name, pat in cfg.get("intents", {}).items():
        if any(re.search(pat, norm_u(s)) for s in suggestions):
            found.append(name)
    return found


def verdict(fes: int, casa: int, nat: int) -> str:
    if fes >= 2:
        return VERDICTS[0]
    if casa >= 2:
        return VERDICTS[1]
    if nat >= 2:
        return VERDICTS[2]
    if max(fes, casa, nat) == 1:
        return VERDICTS[3]
    return VERDICTS[4]


def latest_day(store: RawStore, day: date | None = None) -> date | None:
    days = [d for d in store.days(SOURCE) if day is None or d <= day]
    return days[-1] if days else None


def _records(store: RawStore, day: date | None) -> tuple[date | None, dict[tuple, dict[str, Any]]]:
    d = latest_day(store, day)
    if not d:
        return None, {}
    seen = {}
    for r in store.read(SOURCE, d):   # plusieurs passages le même jour : le dernier l'emporte
        m = r.get("meta", {})
        seen[(m.get("kind"), m.get("query"))] = {**m, "suggestions": r.get("value") or []}
    return d, seen


def table(store: RawStore, day: date | None = None, cfg: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Une ligne par concept : niveaux à Fès, à Casablanca et au Maroc, intentions, verdict."""
    cfg = cfg if cfg is not None else load_config()
    d, seen = _records(store, day)
    if not d:
        return []
    pats = city_patterns(cfg)
    city, leader = cfg.get("city", "fes"), cfg.get("leader", "casablanca")
    fams = {f["id"]: f for f in cfg.get("famille", [])}
    rows: dict[str, dict[str, Any]] = {}
    for m in (v for k, v in seen.items() if k[0] == "concept"):
        fam = fams.get(m["famille"], {})
        row = rows.setdefault(m["concept"], {
            "famille": m["famille"], "famille_label": fam.get("label", m["famille"]),
            "impulsion": bool(fam.get("impulsion")), "concept": m["concept"], "terme": "", "terme_ar": "",
            "niveaux": {city: 0, leader: 0, "maroc": 0}, "precisions": {city: [], leader: [], "maroc": []},
            "intentions": set(), "releve": d.isoformat()})
        row["terme" if m["lang"] == "fr" else "terme_ar"] = m["terme"]
        place = m["place"]
        lvl, prec = level(m["terme"], m["query"], m["suggestions"], pats[place])
        if lvl >= row["niveaux"][place]:
            row["niveaux"][place] = lvl
        row["precisions"][place] = (row["precisions"][place] + prec)[:6]
        tokens = norm_u(m["terme"]).split()
        related = [s for s in m["suggestions"] if all(re.search(rf"\b{re.escape(t)}", norm_u(s)) for t in tokens)]
        row["intentions"].update(intents(related, cfg))
    out = []
    for row in rows.values():
        n = row.pop("niveaux")
        p = row.pop("precisions")
        fes, casa, nat = n[city], n[leader], n["maroc"]
        out.append({**row, "intentions": sorted(row["intentions"]),
                    "fes": LEVEL_NAMES[fes], "niveau_fes": fes, "casablanca": LEVEL_NAMES[casa], "niveau_casablanca": casa,
                    "maroc": LEVEL_NAMES[nat], "niveau_maroc": nat,
                    "precisions_fes": " ; ".join(p[city][:4]), "precisions_casablanca": " ; ".join(p[leader][:3]),
                    "precisions_maroc": " ; ".join(p["maroc"][:3]),
                    "verdict": verdict(fes, casa, nat)})
    order = {f: i for i, f in enumerate(fams)}
    return sorted(out, key=lambda r: (order.get(r["famille"], 99), VERDICTS.index(r["verdict"]),
                                      -(r["niveau_fes"] + r["niveau_maroc"]), r["concept"]))


def families(rows: list[dict[str, Any]], cfg: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Synthèse par famille : combien de concepts dans chaque verdict, et la direction qui en découle."""
    cfg = cfg if cfg is not None else load_config()
    out = []
    for fam in cfg.get("famille", []):
        mine = [r for r in rows if r["famille"] == fam["id"]]
        if not mine:
            continue
        counts = {v: sum(r["verdict"] == v for r in mine) for v in VERDICTS}
        fes = counts[VERDICTS[0]]
        elsewhere = counts[VERDICTS[1]] + counts[VERDICTS[2]]
        weak = counts[VERDICTS[3]] + counts[VERDICTS[4]]
        online = counts[VERDICTS[2]] + sum("en_ligne" in r["intentions"] for r in mine if r["verdict"] != VERDICTS[2])
        if fam.get("impulsion"):
            direction = "Achat d'impulsion : la caisse juge, pas le radar"
        elif fes * 4 >= len(mine):                 # un concept sur quatre déjà cherché avec le nom de Fès
            direction = "Renforcer en magasin"
        elif elsewhere * 2 >= len(mine):           # demandé à Casablanca ou au Maroc, pas encore à Fès
            direction = "Tester en magasin, pousser en ligne"
        elif weak * 2 > len(mine):
            direction = "Réduire : peu de demande visible"
        else:
            direction = "Maintenir, garder les concepts demandés"
        out.append({"famille": fam["id"], "label": fam.get("label", fam["id"]), "concepts": len(mine),
                    **{v: counts[v] for v in VERDICTS}, "en_ligne": online, "direction": direction,
                    "demandes_fes": [r["terme"] or r["terme_ar"] for r in mine if r["verdict"] == VERDICTS[0]],
                    "avance_casablanca": [r["terme"] or r["terme_ar"] for r in mine if r["verdict"] == VERDICTS[1]]})
    return out


def ecosystem(store: RawStore, day: date | None = None, cfg: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Écosystème local : niveau à Fès et noms associés (quartiers, enseignes, spécialités)."""
    cfg = cfg if cfg is not None else load_config()
    d, seen = _records(store, day)
    if not d:
        return []
    pat = city_patterns(cfg)[cfg.get("city", "fes")]
    out = []
    for m in (v for k, v in seen.items() if k[0] == "ecosysteme"):
        lvl, prec = level(m["terme"], m["query"], m["suggestions"], pat)
        out.append({"role": m["role"], "terme": m["terme"], "niveau": lvl, "statut": LEVEL_NAMES[lvl],
                    "precisions": " ; ".join(prec[:6]), "releve": d.isoformat()})
    roles = [e["role"] for e in cfg.get("ecosysteme", [])]
    return sorted(out, key=lambda r: (roles.index(r["role"]) if r["role"] in roles else 99, -r["niveau"], r["terme"]))


def render(rows: list[dict[str, Any]], fams: list[dict[str, Any]], eco: list[dict[str, Any]]) -> str:
    if not rows:
        return "Aucun relevé assortiment : lancez « collect --only autocomplete_assortiment --cadence weekly »."
    lines = [f"Relevé du {rows[0]['releve']}", "", "Par famille"]
    for f in fams:
        lines.append(f"  {f['label'][:40]:40} {f['concepts']:>2} concepts · Fès {f[VERDICTS[0]]} · avance Casa "
                     f"{f[VERDICTS[1]]} · Maroc {f[VERDICTS[2]]} · faibles {f[VERDICTS[4]]}  → {f['direction']}")
    lines += ["", f"{'concept':28} {'Fès':>18} {'Casablanca':>18} {'Maroc':>18}  verdict · intentions"]
    for r in rows:
        lines.append(f"{(r['terme'] or r['terme_ar'])[:28]:28} {r['fes']:>18} {r['casablanca']:>18} {r['maroc']:>18}  "
                     f"{r['verdict']}" + (f" · {', '.join(r['intentions'])}" if r["intentions"] else ""))
    if eco:
        lines += ["", "Écosystème à Fès"]
        for e in eco:
            lines.append(f"  {e['role'][:28]:28} {e['terme'][:22]:22} {e['statut']:>18}  {e['precisions'][:90]}")
    return "\n".join(lines)
