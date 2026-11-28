"""Module D : rendement d'une initiative = tendance × cellule (acheteur, vendeur) × archétype.

Ordre du calcul :
  1. portes dures du profil (heures de construction, heures d'exploitation, capital) ;
  2. portes du module C (rail ouvert dans le pays du vendeur, plateformes, réglementation) ;
  3. espérance de revenu net sur 24 mois (grille du dossier économie), ajustée par la
     tendance : facteur de fenêtre f = min(1, fenêtre restante / temps de lancement) et
     multiplicateur de probabilité 0,5 + F/100 (hypothèse à calibrer avec le journal des initiatives) ;
  4. la porte multiplie le score entier (pas seulement le revenu) ; le revenu espéré et le
     taux horaire affichés sont « si le rail fonctionne » ;
  5. taux horaire implicite (gain net / heures), comparé à votre coût horaire sur une
     échelle fixe. Correction du défaut relevé par les deux études complémentaires :
     avec un ROI ratio, un coût horaire plus élevé rendait moins négatif le score d'une
     initiative perdante. Ici, le score décroît toujours quand le coût horaire augmente ;
  6. incertitude par Monte-Carlo (p12, revenu, coût horaire, fiscalité et porte de
     paiement varient) ; classement sur le P10.
"""

from __future__ import annotations

import hashlib
import math
import random
import tomllib
from dataclasses import dataclass, field
from typing import Any

from . import paths, settings
from .gates import InitiativeSpec, evaluate as evaluate_gates

WEIGHTS = {"rendement": 0.35, "delai": 0.15, "levier": 0.15, "defendabilite": 0.20, "capital": 0.15}
RATE_SCALE_EUR_H = 25.0   # échelle fixe du sous-score de rendement
WEEKS_PER_MONTH = 4.33
BUILD_WEEKS = 26          # les heures « h » de la grille portent sur 6 mois
RUN_MONTHS = 18           # exploitation de M7 à M24
MAX_BUILD_STRETCH = 2.0   # construction étalée sur 12 mois au plus


@dataclass
class Profile:
    seller_zones: list[str] = field(default_factory=lambda: ["FR"])
    languages: list[str] = field(default_factory=lambda: ["fr"])
    channels: list[dict[str, Any]] = field(default_factory=list)
    hours_per_week: float = 10
    radar_hours_per_week: float = 1
    maintenance_hours_per_week: float = 1
    max_capital_eur: float = 1000
    test_max_hours: float = 20
    test_max_eur: float = 150
    run_max_hours_month: float = 25
    hourly_cost_eur: float | None = None
    is_default: bool = True

    @property
    def build_hours_6_months(self) -> float:
        free = self.hours_per_week - self.radar_hours_per_week - self.maintenance_hours_per_week
        return max(0.0, free) * BUILD_WEEKS


def load_profile() -> Profile:
    user = paths.workspace() / "profile.toml"
    source = user if user.exists() else paths.CONFIG_DIR / "profile.example.toml"
    raw = tomllib.loads(source.read_text(encoding="utf-8")).get("profile", {})
    known = {k: v for k, v in raw.items() if k in Profile.__dataclass_fields__}
    return Profile(**known, is_default=not user.exists())


@dataclass
class TrendInput:
    """Ce que la tendance apporte au calcul (modules A et B)."""
    strength: float                 # F, de 0 à 100
    window_days: float | None = None  # fenêtre restante avant concurrence locale ou déclin
    regulatory: list[str] = field(default_factory=list)
    platforms_buyer: list[str] = field(default_factory=list)
    demand_hypothesis: str = ""


@dataclass
class Evaluation:
    archetype: str
    buyer_zone: str
    seller_zone: str
    excluded: bool
    reasons: list[str]
    gate: float = 0.0
    score_p10: float = 0.0
    score_p50: float = 0.0
    rate_eur_h: dict[str, float] = field(default_factory=dict)
    e24_eur_p50: float = 0.0
    hours_24_months: float = 0.0
    flags: list[str] = field(default_factory=list)


def load_archetypes() -> dict[str, Any]:
    return settings.load("archetypes")


def _subscores(a: dict[str, Any], rate: float, w: float) -> dict[str, float]:
    return {
        "rendement": 0.5 + 0.5 * math.tanh((rate - w) / RATE_SCALE_EUR_H),
        "delai": math.exp(-a["T1"] / 12),
        "levier": a["L"],
        "defendabilite": a["D"] / 5,
        "capital": 1 - math.log10(1 + a["C"]) / math.log10(1 + 10_000),
    }


def _e24(a: dict[str, Any], p: float, gate: float, arpu: float, tax: float, retention: float,
         window_factor: float) -> float:
    r_net = a["Rs"] * arpu * a["m"] * (1 - tax)
    months = max(0.0, 12 - a["T1"] / WEEKS_PER_MONTH) / 2 + 12 * retention
    return p * gate * (1 - a["Rp"]) * r_net * months * window_factor


def evaluate(name: str, buyer_zone: str, seller_zone: str, profile: Profile, trend: TrendInput | None = None,
             cfg: dict[str, Any] | None = None, rules: dict[str, Any] | None = None, draws: int = 400) -> Evaluation:
    cfg = cfg if cfg is not None else load_archetypes()
    a = cfg["archetype"][name]
    countries = cfg["country"]
    ev = Evaluation(name, buyer_zone, seller_zone, excluded=False, reasons=[])
    if profile.is_default:
        ev.flags.append("profil par défaut : remplissez workspace/profile.toml")

    # 1. Portes dures du profil.
    if a["hrun"] > profile.run_max_hours_month:
        ev.excluded = True
        ev.reasons.append(f"exploitation de {a['hrun']} h par mois, au-delà de {profile.run_max_hours_month} h")
    # Un solo à temps partiel construit plus lentement : la construction s'étale jusqu'à
    # 12 mois (premier revenu repoussé d'autant) ; au-delà, l'archétype est écarté.
    stretch = a["h"] / profile.build_hours_6_months if profile.build_hours_6_months else float("inf")
    if stretch > MAX_BUILD_STRETCH:
        ev.excluded = True
        ev.reasons.append(f"construction de {a['h']} h, plus de 12 mois à "
                          f"{profile.build_hours_6_months / BUILD_WEEKS:.0f} h par semaine")
    elif stretch > 1:
        ev.flags.append(f"construction étalée sur {6 * stretch:.0f} mois au lieu de 6 : premier revenu repoussé")
        a = {**a, "T1": a["T1"] * stretch}
    if a["C"] > profile.max_capital_eur:
        ev.excluded = True
        ev.reasons.append(f"capital de {a['C']} €, au-delà de {profile.max_capital_eur} €")
    if seller_zone not in profile.seller_zones:
        ev.flags.append(f"{seller_zone} ne fait pas partie de vos pays vendeurs")

    # 2. Portes du module C.
    spec = InitiativeSpec(rails=list(a.get("rails", [])), platforms_seller=list(a.get("platforms_seller", [])),
                          platforms_buyer=list(trend.platforms_buyer if trend else []),
                          regulatory=list(a.get("regulatory", [])) + list(trend.regulatory if trend else []),
                          regulatory_seller=list(a.get("regulatory_seller", [])))
    gres = evaluate_gates(spec, buyer_zone, seller_zone, rules)
    ev.gate = gres.value
    ev.reasons.extend(gres.reasons)
    if gres.excluded or gres.value == 0:
        ev.excluded = True
    if ev.excluded:
        return ev

    # 3 à 5. Espérance, taux horaire implicite, Monte-Carlo.
    buyer_c = countries.get(buyer_zone) or countries.get("FR")
    seller_c = countries.get(seller_zone) or countries.get("FR")
    if buyer_zone not in countries or seller_zone not in countries:
        ev.flags.append("paramètres de pays manquants : valeurs françaises utilisées")
    arpu = 1.0 if a["orient"] == "export" else float(buyer_c["ppp"])
    tax = float(seller_c["tax"].get(a["regime"], seller_c["tax"].get("bnc", 0.25)))
    w0 = float(profile.hourly_cost_eur if profile.hourly_cost_eur is not None else seller_c["default_hourly_cost_eur"])
    fit = float(cfg.get("fit", {}).get(f"{name}@{buyer_zone}", 1.0))
    retention = float(cfg.get("retention_year2", 0.85))
    trend_mult = (0.5 + max(0.0, min(100.0, trend.strength)) / 100) if trend else 1.0
    window = 1.0
    if trend and trend.window_days is not None:
        launch_days = max(1.0, a["T1"] * 7)
        window = min(1.0, max(0.0, trend.window_days) / launch_days)
        if window < 1:
            ev.flags.append(f"fenêtre de {trend.window_days:.0f} j pour un lancement d'environ {launch_days:.0f} j")
    hours = a["h"] + RUN_MONTHS * a["hrun"]
    cash = 2 * a["C"]
    ev.hours_24_months = hours

    seed = int(hashlib.sha256(f"{name}|{buyer_zone}|{seller_zone}".encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)
    rates, scores, e24s = [], [], []
    for i in range(draws):
        if i == 0:  # premier tirage : valeurs centrales
            kp = kr = kw = 1.0
            kt = 0.0
            kg = 1.0
        else:
            kp, kr = rng.lognormvariate(0, 0.4), rng.lognormvariate(0, 0.4)
            kw = rng.uniform(0.5, 1.5)
            kt = rng.uniform(-0.05, 0.05)
            kg = min(1.0, max(0.0, ev.gate * rng.uniform(0.7, 1.15))) / ev.gate if ev.gate else 0.0
        p = min(0.95, a["p12"] * fit * trend_mult * kp)
        # Revenu espéré « si le rail fonctionne » ; la porte multiplie ensuite le score entier (plan, module C).
        e24 = _e24({**a, "Rs": a["Rs"] * kr}, p, 1.0, arpu, min(0.9, max(0.0, tax + kt)), retention, window)
        rate = (e24 - cash) / hours
        sub = _subscores(a, rate, w0 * kw)
        scores.append(ev.gate * kg * 100 * sum(WEIGHTS[k] * sub[k] for k in WEIGHTS))
        rates.append(rate)
        e24s.append(e24)
    ev.score_p10, ev.score_p50 = _q(scores, 0.10), _q(scores, 0.50)
    ev.rate_eur_h = {"p10": round(_q(rates, 0.10), 2), "p50": round(_q(rates, 0.50), 2), "p90": round(_q(rates, 0.90), 2)}
    ev.e24_eur_p50 = round(_q(e24s, 0.50), 0)
    ev.score_p10, ev.score_p50 = round(ev.score_p10, 1), round(ev.score_p50, 1)
    return ev


def _q(values: list[float], q: float) -> float:
    s = sorted(values)
    if not s:
        return 0.0
    k = (len(s) - 1) * q
    lo, hi = math.floor(k), math.ceil(k)
    return s[lo] + (s[hi] - s[lo]) * (k - lo)


def rank(buyer_zone: str, seller_zone: str, profile: Profile, trend: TrendInput | None = None,
         cfg: dict[str, Any] | None = None, rules: dict[str, Any] | None = None) -> list[Evaluation]:
    """Tous les archétypes pour une cellule ; les retenus d'abord, triés sur le P10 du score."""
    cfg = cfg if cfg is not None else load_archetypes()
    evals = [evaluate(n, buyer_zone, seller_zone, profile, trend, cfg, rules) for n in cfg["archetype"]]
    return sorted(evals, key=lambda e: (e.excluded, -e.score_p10, e.archetype))
