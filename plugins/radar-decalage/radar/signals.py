"""Module A : force d'une tendance dans son pays d'origine.

F = 100 × [0,25 vitesse + 0,15 niveau + 0,15 persistance + 0,30 corroboration
          + 0,05 accélération + 0,10 rafale] × pénalités

Chaque terme est ramené à [0 ; 1] par une ancre absolue, pas par un percentile
des candidats de la semaine : sans signal, aucun candidat ne monte en tête.
Les pondérations sont des valeurs de départ, à réestimer par le backtest.

Choix issus de l'étude et de sa contre-vérification :
- Mann-Kendall à partir de 6 points au strict minimum (8 recommandés), avec la
  correction de Hamed et Rao en cas d'autocorrélation ;
- rafales de Kleinberg calculées au fil de l'eau (causales), jamais sur la série entière ;
- pas de CUSUM au démarrage à froid : sur des articles nouveaux, il alerte après le pic.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from statistics import median
from typing import Sequence

WEIGHTS = {"vitesse": 0.25, "niveau": 0.15, "persistance": 0.15, "corroboration": 0.30,
           "acceleration": 0.05, "rafale": 0.10}
MK_MIN_POINTS = 6
MK_RECOMMENDED_POINTS = 8
DOUBLING_PERIODS = 4  # ancre de vitesse : doubler en 4 périodes vaut 1


def _norm_cdf(z: float) -> float:
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def theil_sen(y: Sequence[float]) -> float:
    """Pente médiane des couples de points (robuste aux valeurs aberrantes)."""
    slopes = [(y[j] - y[i]) / (j - i) for i in range(len(y)) for j in range(i + 1, len(y))]
    return median(slopes) if slopes else 0.0


def _ranks(values: Sequence[float]) -> list[float]:
    order = sorted(range(len(values)), key=lambda i: values[i])
    ranks = [0.0] * len(values)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and values[order[j + 1]] == values[order[i]]:
            j += 1
        avg = (i + j) / 2 + 1
        for k in range(i, j + 1):
            ranks[order[k]] = avg
        i = j + 1
    return ranks


def _acf(x: Sequence[float], lag: int) -> float:
    n = len(x)
    mean = sum(x) / n
    den = sum((v - mean) ** 2 for v in x)
    if den == 0:
        return 0.0
    return sum((x[t] - mean) * (x[t + lag] - mean) for t in range(n - lag)) / den


def mann_kendall(y: Sequence[float], hamed_rao: bool = True) -> dict[str, float | int | bool]:
    """Test unilatéral de tendance croissante. Renvoie S, z, p et la validité (n ≥ 6)."""
    n = len(y)
    s = 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            d = y[j] - y[i]
            s += (d > 0) - (d < 0)
    ties: dict[float, int] = {}
    for v in y:
        ties[v] = ties.get(v, 0) + 1
    var = (n * (n - 1) * (2 * n + 5) - sum(t * (t - 1) * (2 * t + 5) for t in ties.values())) / 18.0
    if hamed_rao and n >= 3 and var > 0:
        beta = theil_sen(y)
        detrended = [y[i] - beta * i for i in range(n)]
        r = _ranks(detrended)
        bound = 1.96 / math.sqrt(n)
        corr = 0.0
        for k in range(1, n - 2):
            rk = _acf(r, k)
            if abs(rk) > bound:
                corr += (n - k) * (n - k - 1) * (n - k - 2) * rk
        factor = 1 + 2 * corr / (n * (n - 1) * (n - 2))
        var *= max(factor, 1e-6)
    if var <= 0:
        z = 0.0
    elif s > 0:
        z = (s - 1) / math.sqrt(var)
    elif s < 0:
        z = (s + 1) / math.sqrt(var)
    else:
        z = 0.0
    return {"S": s, "z": z, "p": 1.0 - _norm_cdf(z), "n": n, "valid": n >= MK_MIN_POINTS}


def kleinberg_online(counts: Sequence[float], s: float = 2.0, gamma: float = 1.0) -> list[int]:
    """État de rafale (0 ou 1) à chaque instant, calculé avec les seules données passées.

    Automate à deux états, émissions de Poisson : taux de base = moyenne des valeurs
    passées, taux de rafale = s × taux de base, coût d'entrée en rafale γ·ln(t).
    À chaque instant t, Viterbi sur [0, t] et on garde l'état final : pas de regard
    vers l'avenir.
    """
    states: list[int] = []
    for t in range(len(counts)):
        past = counts[:t]
        base = (sum(past) / len(past)) if past else (counts[0] if counts else 0.0)
        base = max(base, 1e-3)
        rates = (base, s * base)
        window = counts[: t + 1]
        n = len(window)
        trans = gamma * math.log(max(n, 2))

        def cost(rate: float, x: float) -> float:
            x = max(x, 0.0)
            return rate - x * math.log(rate) + math.lgamma(x + 1)

        c0, c1 = cost(rates[0], window[0]), trans + cost(rates[1], window[0])
        for x in window[1:]:
            n0 = min(c0, c1) + cost(rates[0], x)
            n1 = min(c0 + trans, c1) + cost(rates[1], x)
            c0, c1 = n0, n1
        states.append(1 if c1 < c0 else 0)
    return states


def half_life_after_peak(y: Sequence[float]) -> int | None:
    """Nombre de périodes entre le pic et la première valeur sous la moitié du pic (None si jamais)."""
    if not y:
        return None
    peak_i = max(range(len(y)), key=lambda i: y[i])
    for k in range(peak_i + 1, len(y)):
        if y[k] < y[peak_i] / 2:
            return k - peak_i
    return None


@dataclass
class FamilySeries:
    """Série d'une famille de sources pour une entité (stores, search, attention…)."""
    family: str
    values: list[float]                  # plus grand = plus fort (rangs à convertir avant)
    level: float = 0.0                   # niveau actuel déjà ramené à [0 ; 1] par une ancre propre à la source


@dataclass
class Strength:
    score: float
    components: dict[str, float]
    stage: str
    rising_families: list[str]
    flags: list[str] = field(default_factory=list)


def rank_to_strength(rank: int | None, depth: int = 100) -> float:
    """Rang 1 -> 1, rang `depth` -> proche de 0, absent -> 0."""
    if rank is None or rank > depth:
        return 0.0
    return 1.0 - (rank - 1) / depth


def _velocity(values: Sequence[float], periods: int = 8) -> float:
    tail = list(values[-periods:])
    if len(tail) < 3:
        return 0.0
    return theil_sen([math.log1p(max(v, 0.0)) for v in tail])


def _clip(x: float) -> float:
    return max(0.0, min(1.0, x))


def strength(series: list[FamilySeries]) -> Strength:
    """Score de force à partir des séries de plusieurs familles de sources."""
    v_ref = math.log(2) / DOUBLING_PERIODS
    flags: list[str] = []
    rising, vel, acc, persist, burst, level = [], [], [], [], [], []
    peaky = False
    for fs in series:
        if len(fs.values) < 2:
            flags.append(f"{fs.family} : moins de 2 relevés")
            level.append(fs.level)
            continue
        v = _velocity(fs.values)
        prev = _velocity(fs.values[:-4]) if len(fs.values) >= 7 else 0.0
        mk = mann_kendall(fs.values[-12:])
        if not mk["valid"]:
            flags.append(f"{fs.family} : persistance non testable ({mk['n']} points, {MK_MIN_POINTS} au minimum)")
        elif mk["n"] < MK_RECOMMENDED_POINTS:
            flags.append(f"{fs.family} : persistance testée sur {mk['n']} points ({MK_RECOMMENDED_POINTS} recommandés)")
        p_score = (1.0 - mk["p"]) if mk["valid"] else 0.0
        b = kleinberg_online(fs.values)[-1] if len(fs.values) >= 3 else 0
        if v > 0 and (p_score > 0.9 or b):
            rising.append(fs.family)
        hl = half_life_after_peak(fs.values)
        if hl is not None and hl < 3 and p_score < 0.5:
            peaky = True
        vel.append(_clip(v / v_ref))
        acc.append(_clip((v - prev) / v_ref))
        persist.append(p_score)
        burst.append(float(b))
        level.append(fs.level)
    comp = {
        "vitesse": max(vel, default=0.0),
        "niveau": max(level, default=0.0),
        "persistance": max(persist, default=0.0),
        "corroboration": _clip(len(rising) / 3),
        "acceleration": max(acc, default=0.0),
        "rafale": max(burst, default=0.0),
    }
    score = 100 * sum(WEIGHTS[k] * comp[k] for k in WEIGHTS)
    if len(rising) <= 1:
        score *= 0.6
        flags.append("une seule famille de sources en hausse : pénalité ×0,6")
    if peaky:
        score = min(score, 40.0)
        flags.append("pic d'un jour ou presque : plafond à 40")
    return Strength(round(score, 1), {k: round(v, 3) for k, v in comp.items()}, stage(series, rising), rising, flags)


def stage(series: list[FamilySeries], rising: list[str], period_days: int = 1) -> str:
    """Stades du dossier méthode, règles appliquées dans l'ordre :
    déclin (28 jours ou plus après le pic, sous 50 % du pic, pente négative),
    mainstream (au moins 80 % du pic et pente quasi nulle, ou présence dans 5 familles),
    accélération (hausse dans 3 familles), émergent (hausse dans 2 familles), signal faible.
    """
    longest = max(series, key=lambda fs: len(fs.values), default=None)
    if longest is None or len(longest.values) < 2:
        return "signal_faible"
    y = longest.values
    peak_i = max(range(len(y)), key=lambda i: y[i])
    v = _velocity(y)
    periods_28_days = math.ceil(28 / period_days)
    # Pente médiane récente nulle ou négative : une série retombée en plateau sous la moitié
    # de son pic a une pente médiane nulle ; exiger une pente strictement négative ne la
    # classerait jamais en déclin.
    if len(y) - 1 - peak_i >= periods_28_days and y[-1] < 0.5 * y[peak_i] and v <= 0:
        return "declin"
    flat_near_peak = y[-1] >= 0.8 * y[peak_i] and abs(v) < 0.02 and len(y) >= MK_RECOMMENDED_POINTS
    if flat_near_peak or len(series) >= 5:
        return "mainstream"
    if v > 0 and len(rising) >= 3:
        return "acceleration"
    if v > 0 and len(rising) >= 2:
        return "emergent"
    return "signal_faible"
