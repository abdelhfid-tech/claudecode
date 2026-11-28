"""Aides et freins : dispositifs qui facilitent ou freinent l'arrivée d'un produit, d'un service ou d'un
concept au Maroc ou en France (douane, fiscalité, aides, statuts, zones, réglementation).

Les dispositifs vivent dans config/rules/incitations.toml, datés et sourcés comme les autres règles,
avec un niveau de preuve (F : source officielle lue ; F2 : presse citant la source officielle ;
H : non confirmé). Ce module les charge, les contrôle et les sélectionne pour une initiative.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from . import settings

SENS = {"facilite", "freine"}
CATEGORIES = {"douane", "fiscalite", "aide", "statut", "zone", "reglementation"}
USAGES = {"produit_importe", "colis_ecommerce", "service_numerique", "concept_franchise", "export_depuis_maroc", "artisanat"}
PAYS = {"MA", "FR", "UE"}
EVIDENCE = {"F", "F2", "E", "H"}
STALE_AFTER_DAYS = 120
REQUIRED = ("id", "pays", "sens", "categorie", "s_applique_a", "titre", "resume", "as_of", "source", "preuve")

# Ce que chaque type d'initiative fait passer d'un pays à l'autre (pour choisir les dispositifs utiles).
ARCHETYPE_USAGES = {
    "ecommerce": ["produit_importe", "colis_ecommerce"],
    "export": ["export_depuis_maroc", "artisanat", "produit_importe"],
    "service": ["service_numerique"],
    "concept": ["concept_franchise", "service_numerique"],
}
ARCHETYPE_KIND = {
    "agence_export": "export", "pod_etsy_printify": "ecommerce", "pod_marketplaces": "ecommerce",
    "shopify_marque": "ecommerce", "tiktok_affiliation": "ecommerce", "marketplace_niche": "ecommerce",
    "etsy_imprimables": "service", "clone_local": "concept", "app_mobile_virale": "concept", "micro_saas": "concept",
}


def load() -> list[dict[str, Any]]:
    return list(settings.load("rules/incitations").get("dispositif", []))


def check(items: list[dict[str, Any]], today: date) -> list[str]:
    """Champs manquants, valeurs inconnues, doublons et dispositifs à relire."""
    problems, seen = [], set()
    for item in items:
        where = f"incitations:{item.get('id', '?')}"
        if item.get("id") in seen:
            problems.append(f"{where} : identifiant en double")
        seen.add(item.get("id"))
        for field in REQUIRED:
            if field not in item:
                problems.append(f"{where} : champ « {field} » manquant")
        if item.get("pays") not in PAYS:
            problems.append(f"{where} : pays « {item.get('pays')} » inconnu")
        if item.get("sens") not in SENS:
            problems.append(f"{where} : sens « {item.get('sens')} » inconnu (facilite ou freine)")
        if item.get("categorie") not in CATEGORIES:
            problems.append(f"{where} : catégorie « {item.get('categorie')} » inconnue")
        unknown = set(item.get("s_applique_a", [])) - USAGES
        if unknown:
            problems.append(f"{where} : usages inconnus {sorted(unknown)}")
        if item.get("preuve") not in EVIDENCE:
            problems.append(f"{where} : niveau de preuve inconnu « {item.get('preuve')} »")
        as_of = item.get("as_of")
        if isinstance(as_of, date) and (today - as_of).days > STALE_AFTER_DAYS:
            problems.append(f"{where} : vérifié le {as_of}, à relire (plus de {STALE_AFTER_DAYS} jours)")
    return problems


def select(items: list[dict[str, Any]], pays: list[str] | None = None, usages: list[str] | None = None,
           sens: str | None = None) -> list[dict[str, Any]]:
    """Dispositifs d'un pays (UE compte pour la France) et d'un usage, freins d'abord."""
    want = set(pays or [])
    if "FR" in want:
        want.add("UE")
    out = [i for i in items
           if (not want or i.get("pays") in want)
           and (not usages or set(i.get("s_applique_a", [])) & set(usages))
           and (not sens or i.get("sens") == sens)]
    return sorted(out, key=lambda i: (i.get("pays", ""), i.get("sens") != "freine", i.get("categorie", ""), i.get("id", "")))


def usages_for(archetype: str, regime: str | None = None) -> list[str]:
    kind = ARCHETYPE_KIND.get(archetype)
    if kind is None:
        kind = "service" if regime in {"bnc", "bic_presta", "auteur", None} else "ecommerce"
    return ARCHETYPE_USAGES[kind]


def for_initiative(items: list[dict[str, Any]], archetype: str, buyer_zone: str, seller_zone: str,
                   regime: str | None = None) -> list[dict[str, Any]]:
    """Aides et freins qui concernent une initiative : pays de l'acheteur et du vendeur."""
    return select(items, pays=sorted({buyer_zone, seller_zone}), usages=usages_for(archetype, regime))


def render(items: list[dict[str, Any]]) -> str:
    if not items:
        return "Aucun dispositif pour ce choix."
    mark = {"facilite": "+", "freine": "−"}
    lines = []
    for i in items:
        lines.append(f"{mark.get(i['sens'], '?')} [{i['pays']}] {i['titre']} ({i['categorie']}, preuve {i['preuve']}, {i.get('date_regle', '')})")
        lines.append(f"    {i['resume']}")
    return "\n".join(lines)
