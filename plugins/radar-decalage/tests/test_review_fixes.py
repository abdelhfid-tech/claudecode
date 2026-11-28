"""Non-régression des corrections de la revue de code indépendante."""

import pytest

from radar import initiatives, signals
from radar.diffusion import Priors
from radar.initiatives import Profile, evaluate
from radar.signals import FamilySeries


@pytest.fixture(scope="module")
def cfg():
    return initiatives.load_archetypes()


def test_gate_multiplies_the_whole_initiative_score(cfg):
    p = Profile(seller_zones=["FR", "MA"], hourly_cost_eur=15, is_default=False)
    open_rail = evaluate("modeles_n8n", "FR", "FR", p, cfg=cfg)     # Gumroad ouvert en France
    unverified = evaluate("modeles_n8n", "FR", "MA", p, cfg=cfg)    # non vérifié au Maroc : porte 0,3
    assert unverified.gate == pytest.approx(0.3)
    assert unverified.score_p50 < 0.5 * open_rail.score_p50


def test_dead_or_flat_series_are_not_mainstream():
    zeros = [0.0] * 10
    assert signals.stage([FamilySeries(f, zeros) for f in "abcde"], []) != "mainstream"
    tiny = [3.0] * 10
    assert signals.stage([FamilySeries("a", tiny, level=0.05)], []) != "mainstream"
    flat = signals.strength([FamilySeries("a", [5.0] * 12, 0.0)])
    assert flat.components["persistance"] == 0.0


def test_velocity_no_longer_depends_on_the_unit():
    small = [0.05 * 2 ** (i / 4) for i in range(8)]
    large = [500 * 2 ** (i / 4) for i in range(8)]
    vs = signals.strength([FamilySeries("a", small, 0.5)]).components["vitesse"]
    vl = signals.strength([FamilySeries("a", large, 0.5)]).components["vitesse"]
    assert vs == pytest.approx(vl, abs=0.05)


def test_kleinberg_only_on_counts():
    s = signals.strength([FamilySeries("a", [0.1, 0.1, 0.1, 0.1, 0.9], 0.9)])
    assert s.components["rafale"] == 0.0 and any("comptage" in f for f in s.flags)


@pytest.mark.parametrize("cls,zone,median,p90", [("A", "FR", 7, 30), ("C", "MA", 900, 3300), ("A", "MA", 14, 60)])
def test_mixture_matches_dossier_median_and_p90_when_p10_is_zero(cls, zone, median, p90):
    d = Priors().get(cls, zone)
    reach = 1 - d.p_never
    assert d.cdf(median) == pytest.approx(0.5 * reach, abs=1e-6)
    assert d.cdf(p90) == pytest.approx(0.9 * reach, abs=1e-6)
    assert d.quantile(0.5 * reach) == pytest.approx(median, rel=1e-6)
