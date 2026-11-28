from dataclasses import replace

import pytest

from radar import initiatives
from radar.initiatives import Profile, TrendInput, evaluate, rank


@pytest.fixture(scope="module")
def cfg():
    return initiatives.load_archetypes()


@pytest.fixture
def profile():
    return Profile(seller_zones=["FR", "MA"], languages=["fr", "ary"], hourly_cost_eur=15, is_default=False)


def test_slow_builds_are_stretched_then_excluded(cfg, profile):
    # 8 h libres par semaine : 208 h sur 6 mois.
    affil = evaluate("tiktok_affiliation", "FR", "FR", replace(profile, run_max_hours_month=100), cfg=cfg)
    assert any("étalée sur 12 mois" in f for f in affil.flags)  # 400 h : construction sur 12 mois
    saas = evaluate("micro_saas", "FR", "FR", profile, cfg=cfg)
    assert saas.excluded and any("plus de 12 mois" in r for r in saas.reasons)  # 500 h


def test_hour_and_capital_gates_come_first(cfg, profile):
    agence = evaluate("agence_automatisation", "FR", "FR", profile, cfg=cfg)
    assert agence.excluded and any("exploitation de 90 h" in r for r in agence.reasons)
    shopify = evaluate("shopify_marque", "FR", "FR", profile, cfg=cfg)
    assert shopify.excluded and any("capital" in r for r in shopify.reasons)


def test_seller_zone_closes_rails(cfg, profile):
    ma = evaluate("tiktok_affiliation", "MA", "MA", replace(profile, run_max_hours_month=100), cfg=cfg)
    assert ma.excluded and ma.gate == 0.0
    fr = evaluate("tiktok_affiliation", "FR", "FR", replace(profile, run_max_hours_month=100), cfg=cfg)
    assert not fr.excluded and fr.gate == 1.0


def test_higher_hourly_cost_never_improves_a_losing_initiative(cfg, profile):
    """Défaut de la grille d'origine, relevé par les deux études complémentaires."""
    loose = replace(profile, run_max_hours_month=100, max_capital_eur=10_000)
    cheap = evaluate("chaine_sans_visage", "FR", "FR", replace(loose, hourly_cost_eur=3), cfg=cfg)
    dear = evaluate("chaine_sans_visage", "FR", "FR", replace(loose, hourly_cost_eur=25), cfg=cfg)
    assert cheap.rate_eur_h["p50"] < cheap_threshold(cheap)
    assert dear.score_p50 <= cheap.score_p50


def cheap_threshold(ev):
    return 25  # un taux horaire implicite sous 25 €/h : initiative perdante ou peu rentable


def test_trend_window_reduces_expected_revenue(cfg, profile):
    base = evaluate("produits_numeriques", "FR", "FR", profile, TrendInput(strength=50), cfg=cfg)
    short = evaluate("produits_numeriques", "FR", "FR", profile, TrendInput(strength=50, window_days=7), cfg=cfg)
    assert short.e24_eur_p50 < base.e24_eur_p50
    assert any("fenêtre" in f for f in short.flags)


def test_stronger_trend_raises_expected_revenue(cfg, profile):
    weak = evaluate("produits_numeriques", "FR", "FR", profile, TrendInput(strength=0), cfg=cfg)
    strong = evaluate("produits_numeriques", "FR", "FR", profile, TrendInput(strength=100), cfg=cfg)
    assert strong.e24_eur_p50 > weak.e24_eur_p50


def test_regulated_trend_is_excluded(cfg, profile):
    ev = evaluate("produits_numeriques", "FR", "FR", profile, TrendInput(strength=80, regulatory=["marches_prediction"]),
                  cfg=cfg)
    assert ev.excluded


def test_monte_carlo_is_reproducible_and_ordered(cfg, profile):
    a = evaluate("produits_numeriques", "FR", "MA", profile, cfg=cfg)
    b = evaluate("produits_numeriques", "FR", "MA", profile, cfg=cfg)
    assert a.score_p10 == b.score_p10 and a.rate_eur_h == b.rate_eur_h
    assert a.rate_eur_h["p10"] <= a.rate_eur_h["p50"] <= a.rate_eur_h["p90"]
    assert a.score_p10 <= a.score_p50


def test_rank_puts_excluded_last(cfg, profile):
    ranked = rank("FR", "FR", profile, cfg=cfg)
    kept = [e for e in ranked if not e.excluded]
    assert kept and all(not e.excluded for e in ranked[: len(kept)])
    assert [e.score_p10 for e in kept] == sorted((e.score_p10 for e in kept), reverse=True)


def test_default_profile_is_flagged(workspace):
    p = initiatives.load_profile()
    assert p.is_default
    ev = evaluate("micro_saas", "FR", "FR", p)
    assert any("profil par défaut" in f for f in ev.flags)
