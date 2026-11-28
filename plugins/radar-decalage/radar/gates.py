"""Module C : portes d'une initiative, côté acheteur et côté vendeur.

Les portes sont appliquées une seule fois, ici, et multiplient le reste du score :
0 bloqué, 0,3 contournement coûteux ou fait non vérifié, 0,6 contournement simple, 1 aucun verrou.
Le pays du vendeur compte autant que celui de l'acheteur : un résident marocain qui
vend en euros à des clients français n'a pas les mêmes rails qu'une entité française.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from . import rules as rules_mod


@dataclass
class InitiativeSpec:
    """Ce dont une initiative a besoin pour exister (fourni par l'archétype et le brief)."""
    rails: list[str]                                    # rails acceptables : il en faut un d'ouvert
    platforms_seller: list[str] = field(default_factory=list)  # programmes requis côté vendeur (ex. TikTok Shop)
    platforms_buyer: list[str] = field(default_factory=list)   # plateformes requises côté acheteur
    regulatory: list[str] = field(default_factory=list)        # catégories réglementées touchées
    targets_minors: bool = False


@dataclass
class GateResult:
    value: float
    parts: dict[str, float]
    reasons: list[str]
    excluded: bool = False


def evaluate(spec: InitiativeSpec, buyer_zone: str, seller_zone: str,
             rules: dict[str, list[dict[str, Any]]] | None = None) -> GateResult:
    rules = rules if rules is not None else rules_mod.load_rules()
    parts: dict[str, float] = {}
    reasons: list[str] = []

    # Exclusions éthiques et réglementaires : pas de score du tout.
    for rid in spec.regulatory:
        rule = rules_mod.find(rules, "regulatory", rid)
        if rule and rule.get("exclude_initiatives"):
            return GateResult(0.0, {}, [f"catégorie exclue par défaut : {rule['category']}"], excluded=True)
    if spec.targets_minors:
        return GateResult(0.0, {}, ["initiative visant des mineurs : exclue par défaut"], excluded=True)

    # Rail de paiement : le meilleur rail ouvert dans le pays du vendeur.
    best_rail, best = None, 0.0
    for rail in spec.rails:
        g = rules_mod.gate(rules, "payments", rail, seller_zone)
        if g > best:
            best_rail, best = rail, g
    parts["paiement"] = best
    if best_rail is None:
        reasons.append(f"aucun rail ouvert pour un vendeur en {seller_zone} parmi {', '.join(spec.rails)}")
    elif best < 1.0:
        reasons.append(f"rail {best_rail} en {seller_zone} : "
                       f"{rules_mod.status(rules, 'payments', best_rail, seller_zone)}")

    # Plateformes.
    for pid in spec.platforms_seller:
        g = rules_mod.gate(rules, "platforms", pid, seller_zone)
        parts[f"plateforme vendeur {pid}"] = g
        if g < 1.0:
            reasons.append(f"{pid} côté vendeur ({seller_zone}) : {rules_mod.status(rules, 'platforms', pid, seller_zone)}")
    for pid in spec.platforms_buyer:
        g = rules_mod.gate(rules, "platforms", pid, buyer_zone)
        parts[f"plateforme acheteur {pid}"] = g
        if g < 1.0:
            reasons.append(f"{pid} côté acheteur ({buyer_zone}) : {rules_mod.status(rules, 'platforms', pid, buyer_zone)}")

    # Réglementation, côté acheteur.
    for rid in spec.regulatory:
        g = rules_mod.gate(rules, "regulatory", rid, buyer_zone)
        parts[f"réglementation {rid}"] = g
        if g < 1.0:
            reasons.append(f"{rid} en {buyer_zone} : {rules_mod.status(rules, 'regulatory', rid, buyer_zone)}")

    value = 1.0
    for g in parts.values():
        value *= g
    return GateResult(round(value, 4), parts, reasons)
