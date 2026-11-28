"""Premières analyses sur les instantanés : écarts de disponibilité des apps.

Utilisable dès le premier jour : la disponibilité par vitrine ne demande pas
d'historique. Les arrivées datées (première disponibilité par pays) s'ajoutent
au fil des relevés quotidiens.
"""

from __future__ import annotations

import re
from collections import defaultdict
from datetime import date
from typing import Any, Iterable

from .storage import RawStore

ORIGIN_ZONES = ("US", "GB", "CA", "AU", "DE", "JP", "MX")
TARGET_ZONES = ("FR", "BE", "CH", "MA", "DZ", "TN", "SN", "CI")
# Vitrines ouvertes en 2020 : la date de sortie y est tronquée à l'ouverture (avril 2020).
TRUNCATED_STOREFRONTS = {"MA", "CI", "SN", "DZ", "TN"}
REWARD_APP = re.compile(r"reward|cashback|coupon|\bearn\b|points|gagne|récompense|bons? plans?", re.I)


def latest_day(store: RawStore, source: str, on_or_before: date | None = None) -> date | None:
    days = [d for d in store.days(source) if on_or_before is None or d <= on_or_before]
    return days[-1] if days else None


def availability(records: Iterable[dict[str, Any]]) -> tuple[dict[str, dict[str, int]], dict[str, dict[str, Any]]]:
    """({app: {zone: 0/1}}, {app: méta d'une vitrine à date fiable, la vitrine US de préférence})."""
    avail: dict[str, dict[str, int]] = defaultdict(dict)
    meta: dict[str, dict[str, Any]] = {}

    def priority(zone: str) -> int:
        return 0 if zone == "US" else (2 if zone in TRUNCATED_STOREFRONTS else 1)

    for r in records:
        if r.get("kind") != "availability" or not r["key"].startswith("ios:"):
            continue
        app = r["key"][4:]
        avail[app][r["zone"]] = int(r["value"])
        if r["value"] and r.get("meta"):
            current = meta.get(app)
            if current is None or priority(r["zone"]) < priority(current["meta_zone"]):
                meta[app] = {**r["meta"], "meta_zone": r["zone"]}
    return dict(avail), meta


def chart_ranks(records: Iterable[dict[str, Any]], chart: str = "top-free",
                platform: str = "ios") -> tuple[dict[str, dict[str, int]], dict[str, dict[str, Any]]]:
    ranks: dict[str, dict[str, int]] = defaultdict(dict)
    info: dict[str, dict[str, Any]] = {}
    for r in records:
        if r.get("kind") != "rank" or not r["key"].startswith(platform + ":"):
            continue
        if r.get("meta", {}).get("chart", chart) != chart:
            continue
        app = r["key"].split(":", 1)[1]
        prev = ranks[app].get(r["zone"])
        if prev is None or r["value"] < prev:
            ranks[app][r["zone"]] = r["value"]
        info.setdefault(app, {"name": r["meta"].get("name", ""), "genres": r["meta"].get("genres", []),
                              "artist": r["meta"].get("artist", "")})
    return dict(ranks), info


def age_days(meta: dict[str, Any], today: date) -> int | None:
    """Ancienneté d'après la date de sortie, seulement si elle vient d'une vitrine fiable.

    La date est tronquée à l'ouverture des vitrines ouvertes en 2020 (Maroc, Côte
    d'Ivoire, Sénégal, Algérie, Tunisie) : elle n'est pas utilisée quand elle en vient.
    """
    if meta.get("meta_zone") in TRUNCATED_STOREFRONTS or not meta.get("release_date"):
        return None
    try:
        return (today - date.fromisoformat(meta["release_date"])).days
    except ValueError:
        return None


def classify(zones_available: dict[str, int], n_storefronts: int, age: int | None) -> str:
    n_yes = sum(zones_available.values())
    if n_yes <= 2 and age is not None and age > 3 * 365:
        return "nationale établie"  # service local par nature : Walmart, La Poste, opérateurs
    if age is not None and age > 3 * 365:
        return "établie"            # plus une tendance émergente : absence structurelle
    if n_storefronts and n_yes >= 0.8 * n_storefronts:
        return "mondiale"
    if age is None:
        return "âge inconnu"
    if age <= 540:
        return "récente"
    return "intermédiaire"


def big_publisher_patterns() -> list[re.Pattern[str]]:
    from . import settings

    return [re.compile(p, re.I) for p in settings.load("editeurs").get("grands", [])]


def is_independent(publisher: str, patterns: list[re.Pattern[str]]) -> bool | None:
    """Petit éditeur (copiable par un indépendant) ; None si l'éditeur est inconnu."""
    if not publisher:
        return None
    return not any(p.search(publisher) for p in patterns)


def gaps(store: RawStore, day: date | None = None, max_origin_rank: int = 50,
         targets: tuple[str, ...] = ("FR", "MA"), include_established: bool = False,
         independent_only: bool = False) -> list[dict[str, Any]]:
    """Apps fortes dans un marché d'origine, indisponibles dans au moins une cible.

    Par défaut, seules les apps de moins de trois ans (ou d'âge inconnu) sont des
    tendances candidates ; `include_established` ajoute les absences structurelles
    (apps établies), utiles pour les clones localisés. Les services nationaux établis
    ne sont jamais retenus.
    """
    d_lookup = latest_day(store, "apple_lookup", day)
    d_charts = latest_day(store, "apple_charts", day)
    if not d_lookup or not d_charts:
        return []
    avail, meta = availability(store.read("apple_lookup", d_lookup))
    previous_days = [d for d in store.days("apple_lookup") if d < d_lookup]
    prev_avail = availability(store.read("apple_lookup", previous_days[-1]))[0] if previous_days else {}
    ranks, info = chart_ranks(store.read("apple_charts", d_charts))
    n_store = max((len(z) for z in avail.values()), default=0)
    today = day or d_lookup
    patterns = big_publisher_patterns()
    rows = []
    for app, zone_avail in avail.items():
        app_ranks = ranks.get(app, {})
        origin = {z: r for z, r in app_ranks.items() if z in ORIGIN_ZONES and r <= max_origin_rank}
        if not origin:
            continue
        missing = [t for t in targets if zone_avail.get(t) == 0]
        if not missing:
            continue
        age = age_days(meta.get(app, {}), today)
        cls = classify(zone_avail, n_store, age)
        if cls == "nationale établie" or (cls == "établie" and not include_established):
            continue
        best_zone, best_rank = min(origin.items(), key=lambda kv: kv[1])
        name = info.get(app, {}).get("name") or meta.get(app, {}).get("name", "")
        flags = []
        unconfirmed = [t for t in missing if prev_avail.get(app, {}).get(t) != 0]
        if unconfirmed:
            flags.append(f"absence non confirmée ({', '.join(unconfirmed)}) : un seul relevé négatif")
        if sum(zone_avail.values()) == 1:
            flags.append("une seule vitrine : service national ou lancement en cours ?")
        if REWARD_APP.search(name):
            flags.append("app à récompenses : rang faussé")
        publisher = info.get(app, {}).get("artist", "")
        independent = is_independent(publisher, patterns)
        if independent_only and not independent:
            continue
        rows.append({
            "app": app, "name": name, "flags": flags, "publisher": publisher, "independent": independent,
            "genres": info.get(app, {}).get("genres", []),
            "best_origin": f"{best_zone} n°{best_rank}", "best_rank": best_rank,
            "available_in": sorted(z for z, v in zone_avail.items() if v),
            "available_count": f"{sum(zone_avail.values())}/{len(zone_avail)}",
            "missing_targets": missing,
            "target_status": {t: ("disponible" if zone_avail.get(t) else "indisponible") for t in TARGET_ZONES
                              if t in zone_avail},
            "age_days": age, "class": cls,
        })
    rows.sort(key=lambda r: (r["best_rank"], r["app"]))
    return rows


def arrivals(store: RawStore, source: str = "apple_lookup", confirm: int = 2) -> dict[tuple[str, str], str]:
    """Première date où chaque (app, vitrine) est disponible après une absence CONFIRMÉE.

    Une absence n'est retenue qu'après `confirm` relevés négatifs consécutifs : une réponse
    vide ou un incident d'un jour ne fabrique pas de fausse « arrivée ». Une app disponible
    dès le premier relevé n'a pas de date d'arrivée (elle est arrivée avant la collecte).
    """
    streak: dict[tuple[str, str], int] = {}
    confirmed_absent: set[tuple[str, str]] = set()
    first_present: dict[tuple[str, str], str] = {}
    for d in store.days(source):
        day_values: dict[tuple[str, str], int] = {}
        for r in store.read(source, d):
            if r.get("kind") == "availability":
                day_values[(r["key"], r["zone"])] = int(r["value"])
        for k, v in day_values.items():
            if v == 0:
                streak[k] = streak.get(k, 0) + 1
                if streak[k] >= confirm:
                    confirmed_absent.add(k)
            else:
                if k in confirmed_absent and k not in first_present:
                    first_present[k] = d.isoformat()
                streak[k] = 0
    return first_present


def render_gaps(rows: list[dict[str, Any]], limit: int = 30) -> str:
    if not rows:
        return "Aucun écart : il faut au moins un relevé des classements et de la disponibilité."
    lines = ["| App | Éditeur | Petit éditeur | Meilleur rang d'origine | Disponible | FR | MA | BE | SN | Âge | Classe | Signalement |",
             "|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for r in rows[:limit]:
        st = r["target_status"]
        age = f"{r['age_days'] // 30} mois" if r["age_days"] is not None else "?"
        small = {True: "oui", False: "non"}.get(r.get("independent"), "?")
        lines.append(f"| {r['name'][:38]} | {r.get('publisher', '')[:28]} | {small} | {r['best_origin']} | "
                     f"{r['available_count']} | {st.get('FR', '?')} | {st.get('MA', '?')} | {st.get('BE', '?')} | "
                     f"{st.get('SN', '?')} | {age} | {r['class']} | {'; '.join(r.get('flags', []))} |")
    if len(rows) > limit:
        lines.append(f"\n{len(rows) - limit} autres écarts non affichés.")
    return "\n".join(lines)
