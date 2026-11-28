"""Module B : délai d'arrivée attendu par pays, mise à jour par sentinelle, écart de diffusion.

Loi du délai (en jours après l'arrivée dans le pays d'origine) : mélange de
  - une masse « n'arrive jamais » (p_never),
  - une masse « simultanée » quand le P10 du dossier vaut 0 (une log-normale ne
    sait pas représenter un délai nul),
  - une log-normale à deux pentes, calée exactement sur la médiane, le P10 et le P90
    (ou, quand le P10 vaut 0, calée pour que la loi mélangée ait la médiane et le P90).
Une arrivée avant le pays d'origine (flux inverse) se traite comme un statut
(« en avance »), pas comme un délai négatif de cette loi.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, replace
from typing import Any

from . import settings

SIMULTANEOUS_MASS = 0.10
NO_UPPER_BOUND_DAYS = 3650
Z90 = 1.2815515655446004


def _phi(z: float) -> float:
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def _phi_inv(p: float) -> float:
    """Inverse de la loi normale (Acklam), précision ~1e-9, suffisante ici."""
    if not 0 < p < 1:
        raise ValueError("p hors de ]0 ; 1[")
    a = [-3.969683028665376e01, 2.209460984245205e02, -2.759285104469687e02, 1.383577518672690e02,
         -3.066479806614716e01, 2.506628277459239e00]
    b = [-5.447609879822406e01, 1.615858368580409e02, -1.556989798598866e02, 6.680131188771972e01,
         -1.328068155288572e01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e00, -2.549732539343734e00,
         4.374664141464968e00, 2.938163982698783e00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e00, 3.754408661907416e00]
    lo, hi = 0.02425, 1 - 0.02425
    if p < lo:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / \
               ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    if p > hi:
        q = math.sqrt(-2 * math.log(1 - p))
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / \
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    q = p - 0.5
    r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / \
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)


@dataclass(frozen=True)
class DelayPrior:
    friction_class: str
    group: str
    median: float
    p10: float
    p90: float
    p_never: float
    blocked: bool = False
    evidence: str = "E"

    @property
    def simultaneous(self) -> float:
        return SIMULTANEOUS_MASS if self.p10 <= 0 else 0.0

    # Quand P10 > 0 : log-normale à deux pentes calée exactement sur P10, médiane, P90.
    # Quand P10 = 0 : masse simultanée w0, puis une log-normale calée sur les quantiles
    # conditionnels (q − w0)/(1 − w0), pour que la loi MÉLANGÉE ait la médiane et le P90 du dossier.

    @property
    def _p90(self) -> float:
        return self.p90 if self.p90 > 0 else NO_UPPER_BOUND_DAYS

    @property
    def _cond_z(self) -> tuple[float, float]:
        w0 = self.simultaneous
        return _phi_inv((0.5 - w0) / (1 - w0)), _phi_inv((0.9 - w0) / (1 - w0))

    @property
    def mu(self) -> float:
        if self.simultaneous == 0:
            return math.log(self.median)
        z50, _ = self._cond_z
        return math.log(self.median) - z50 * self.sigma_high

    @property
    def sigma_high(self) -> float:
        if self.simultaneous == 0:
            return max((math.log(self._p90) - math.log(self.median)) / Z90, 1e-6)
        z50, z90 = self._cond_z
        return max((math.log(self._p90) - math.log(self.median)) / (z90 - z50), 1e-6)

    @property
    def sigma_low(self) -> float:
        if self.p10 <= 0:
            return self.sigma_high
        return max((math.log(self.median) - math.log(self.p10)) / Z90, 1e-6)

    def cdf(self, days: float) -> float:
        """P(arrivée au plus tard `days` jours après l'origine), masse « jamais » incluse."""
        if self.blocked or days < 0:
            return 0.0
        w0 = self.simultaneous
        if days == 0:
            base = w0
        elif w0 > 0:
            base = w0 + (1 - w0) * _phi((math.log(days) - self.mu) / self.sigma_high)
        else:
            sigma = self.sigma_low if days < self.median else self.sigma_high
            base = _phi((math.log(days) - self.mu) / sigma)
        return (1 - self.p_never) * base

    def quantile(self, q: float) -> float | None:
        """Délai tel que P(arrivée ≤ délai) = q ; None si q n'est jamais atteint (masse « jamais »)."""
        if self.blocked:
            return None
        reach = 1 - self.p_never
        if q >= reach:
            return None
        base = q / reach
        w0 = self.simultaneous
        if base <= w0:
            return 0.0
        u = (base - w0) / (1 - w0)
        z = _phi_inv(u)
        if w0 > 0:
            return math.exp(self.mu + z * self.sigma_high)
        sigma = self.sigma_low if z < 0 else self.sigma_high
        return math.exp(self.mu + z * sigma)

    def updated_by_sentinel(self, observed_lag: float, prior_lag: float, rho: float = 0.5) -> "DelayPrior":
        """m' = m × exp(ρ [ln(ℓ_obs + 1) − ln(ℓ_prior + 1)]), appliqué aussi aux quantiles.

        À déclencher sur un décollage observé dans le pays sentinelle, pas sur une
        simple apparition (van Everdingen et al.).
        """
        factor = math.exp(rho * (math.log(observed_lag + 1) - math.log(prior_lag + 1)))
        return replace(self, median=self.median * factor, p10=self.p10 * factor,
                       p90=(self.p90 * factor) if self.p90 > 0 else 0.0)


class Priors:
    def __init__(self, raw: dict[str, Any] | None = None):
        raw = raw if raw is not None else settings.load("priors")
        self.raw = raw
        self.rho = float(raw.get("sentinel_rho", 0.5))
        self.zone_group = {z: g for g, zones in raw.get("groups", {}).items() for z in zones}

    def group_of(self, zone: str) -> str | None:
        return self.zone_group.get(zone)

    def get(self, friction_class: str, zone: str) -> DelayPrior | None:
        group = self.group_of(zone)
        cls = self.raw.get("class", {}).get(friction_class)
        if group is None or cls is None or group not in cls:
            return None
        cell = cls[group]
        if cell.get("blocked"):
            return DelayPrior(friction_class, group, 1.0, 0.0, 0.0, 1.0, blocked=True,
                              evidence=cell.get("evidence", "E"))
        return DelayPrior(friction_class, group, float(cell["median"]), float(cell["p10"]), float(cell["p90"]),
                          float(cls.get("p_never", 0.0)), evidence=cell.get("evidence", "E"))


def gap_score(f_origin: float, intensity_rel: float, p_arrival: float, gate: float) -> float:
    """G = F × (1 − min(1, intensité relative)) × P(arrivée avant l'horizon) × porte."""
    return f_origin * (1 - min(1.0, max(0.0, intensity_rel))) * p_arrival * gate


def opportunity_index(attention_rel: float, offer_rel: float) -> float:
    """Élevé quand l'attention locale est là et que l'offre locale manque : O = a × max(0, 1 − s/a)."""
    if attention_rel <= 0:
        return 0.0
    return attention_rel * max(0.0, 1 - offer_rel / attention_rel)
