"""Règles datées par pays : rails de paiement, plateformes, réglementation, fiscalité.

Elles vivent dans config/rules/*.toml (surchargeables dans workspace/config/rules/),
jamais dans le code. Ce module les charge, les contrôle et les traduit en portes.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from . import settings

KINDS = {"payments": "rail", "platforms": "platform", "regulatory": "rule"}

STATUSES = {
    "rail": {"oui", "non", "partiel", "non_verifie", "ferme"},
    "platform": {"oui", "non", "partiel", "non_verifie", "interdit"},
    "rule": {"autorise", "restreint", "interdit", "en_cours", "inconnu"},
}

# Valeur de porte (plan, module C) : 1 aucun verrou, 0,6 contournement simple,
# 0,3 contournement coûteux ou fait non vérifié, 0 bloqué.
GATE = {
    "oui": 1.0, "autorise": 1.0,
    "partiel": 0.6, "restreint": 0.6,
    "non_verifie": 0.3, "inconnu": 0.3, "en_cours": 0.3,
    "non": 0.0, "ferme": 0.0, "interdit": 0.0,
}

EVIDENCE = {"F", "F2", "E", "H"}
STALE_AFTER_DAYS = 120


def load_rules() -> dict[str, list[dict[str, Any]]]:
    out = {}
    for name, key in KINDS.items():
        out[name] = list(settings.load(f"rules/{name}").get(key, []))
    return out


def load_fiscal() -> dict[str, Any]:
    return settings.load("rules/fiscal")


def find(rules: dict[str, list[dict[str, Any]]], kind: str, rule_id: str) -> dict[str, Any] | None:
    for item in rules.get(kind, []):
        if item["id"] == rule_id:
            return item
    return None


def status(rules: dict[str, list[dict[str, Any]]], kind: str, rule_id: str, zone: str) -> str:
    """Statut d'une règle dans une zone ; « inconnu » (ou « non_verifie ») si rien n'est écrit."""
    item = find(rules, kind, rule_id)
    default = "inconnu" if kind == "regulatory" else "non_verifie"
    if item is None:
        return default
    st = item.get("status", {})
    return st.get(zone, st.get("ALL", default))


def gate(rules: dict[str, list[dict[str, Any]]], kind: str, rule_id: str, zone: str) -> float:
    return GATE[status(rules, kind, rule_id, zone)]


def check(rules: dict[str, list[dict[str, Any]]], today: date) -> list[str]:
    """Problèmes bloquants et avertissements de péremption, lisibles par un humain."""
    problems = []
    for name, items in rules.items():
        kind = KINDS[name]
        seen = set()
        for item in items:
            rid = item.get("id", "?")
            where = f"{name}:{rid}"
            if rid in seen:
                problems.append(f"{where} : identifiant en double")
            seen.add(rid)
            for field in ("as_of", "source", "evidence", "status"):
                if field not in item:
                    problems.append(f"{where} : champ « {field} » manquant")
            if item.get("evidence") not in EVIDENCE:
                problems.append(f"{where} : niveau de preuve inconnu « {item.get('evidence')} »")
            for zone, st in item.get("status", {}).items():
                if st not in STATUSES[kind]:
                    problems.append(f"{where} : statut « {st} » invalide pour {zone}")
            as_of = item.get("as_of")
            if isinstance(as_of, date) and (today - as_of).days > STALE_AFTER_DAYS:
                problems.append(f"{where} : vérifié le {as_of}, à relire (plus de {STALE_AFTER_DAYS} jours)")
    return problems
