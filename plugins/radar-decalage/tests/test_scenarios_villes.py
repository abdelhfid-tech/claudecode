"""Scénarios (seul, petit et amplifié par l'IA, agence), lecture des revenus, plafonds de statut,
suivi ville par ville et petits éditeurs d'apps."""

from dataclasses import replace
from datetime import date

import pytest

from radar import analysis, initiatives, villes
from radar.cli import select_sources
from radar.collectors import REGISTRY
from radar.collectors.villes import plan_city_queries
from radar.initiatives import Profile, evaluate
from radar.storage import RawStore, make_record

FISCAL = {
    "regime": [
        {"id": "fr_micro", "country": "FR", "label": "Micro-entreprise (France)",
         "revenue_cap_eur": {"services": 83_600, "vente": 203_100}},
        {"id": "ma_ae", "country": "MA", "label": "Auto-entrepreneur (Maroc)",
         "revenue_cap_mad": {"services": 200_000, "commerce": 500_000}},
    ],
    "exchange": [{"id": "fx", "country": "MA", "fx_eur_mad": 10.0}],
}


@pytest.fixture(scope="module")
def cfg():
    return initiatives.load_archetypes()


@pytest.fixture
def profile():
    return Profile(seller_zones=["FR", "MA"], languages=["fr", "ary"], hourly_cost_eur=15, is_default=False)


def test_success_figures_explain_the_average(cfg, profile):
    e = evaluate("atelier_n8n", "FR", "MA", profile, cfg=cfg, fiscal=FISCAL)
    a = cfg["archetype"]["atelier_n8n"]
    assert e.chance_12m == pytest.approx(a["p12"])
    assert e.revenue_month_success == a["Rs"]
    assert e.net_month_success < e.revenue_month_success
    # La moyenne sur 24 mois mélange échecs et réussites : bien en dessous du total si ça marche.
    assert e.total_24m_success > e.e24_eur_p50 > 0
    assert e.e24_eur_p50 == pytest.approx(e.chance_12m * e.total_24m_success, rel=0.25)


def test_ai_hours_cut_brings_specialised_offer_within_reach(cfg, profile):
    alone = evaluate("ia_verticale_tpe", "FR", "MA", replace(profile, max_capital_eur=2000), cfg=cfg, fiscal=FISCAL)
    assert alone.excluded and any("exploitation de 40 h" in r for r in alone.reasons)
    helped = evaluate("ia_verticale_tpe", "FR", "MA",
                      replace(profile, max_capital_eur=2000, hours_per_week=15, ai_hours_cut=0.4), cfg=cfg, fiscal=FISCAL)
    assert not helped.excluded
    assert any("hypothèse à mesurer" in f for f in helped.flags)
    # Même avec 60 % de travail en moins, l'agence généraliste dépasse 25 h de suivi par mois.
    agency = evaluate("agence_automatisation", "FR", "MA", replace(profile, ai_hours_cut=0.6), cfg=cfg, fiscal=FISCAL)
    assert agency.excluded and any("exploitation de 36 h" in r for r in agency.reasons)


def test_status_ceiling_is_flagged_when_success_outgrows_it(cfg, profile):
    agence = replace(profile, hours_per_week=100, run_max_hours_month=200, max_capital_eur=15000)
    ma = evaluate("agence_automatisation", "FR", "MA", agence, cfg=cfg, fiscal=FISCAL)
    assert any("plafond Auto-entrepreneur (Maroc)" in f and "20 000 €" in f for f in ma.flags)
    small = evaluate("atelier_n8n", "FR", "FR", profile, cfg=cfg, fiscal=FISCAL)
    assert not any("plafond" in f for f in small.flags)  # 1 500 € par mois : sous le plafond français


def test_scenarios_override_only_known_profile_fields(profile):
    scenarios = {"petit_ia": {"label": "x", "hours_per_week": 15, "ai_hours_cut": 0.4, "inconnu": 1}}
    p = initiatives.apply_scenario(profile, "petit_ia", scenarios)
    assert p.hours_per_week == 15 and p.ai_hours_cut == 0.4 and p.seller_zones == profile.seller_zones
    with pytest.raises(KeyError):
        initiatives.apply_scenario(profile, "absent", scenarios)
    shipped = initiatives.load_scenarios()
    assert {"solo", "petit_ia", "petit_ia_fort", "agence"} <= set(shipped)


def test_weekly_sources_run_only_on_the_weekly_cadence():
    cfg = {}
    daily = {c.name for c in select_sources(cfg, None, "daily")}
    weekly = {c.name for c in select_sources(cfg, None, "weekly")}
    assert "autocomplete_villes" not in daily and weekly == {"autocomplete_villes", "autocomplete_produits", "autocomplete_assortiment"}
    assert "autocomplete_villes" in {c.name for c in REGISTRY}


CITIES = [
    {"id": "casablanca", "label": "Casablanca", "zone": "MA", "gl": "ma", "query": "casablanca", "match": r"\bcasa(blanca)?\b",
     "exclude": r"\b(t ?shirt|shirt|pull)\b"},
    {"id": "fes", "label": "Fès", "zone": "MA", "gl": "ma", "query": "fès", "match": r"\bfes\b"},
]


def test_city_queries_cross_trends_and_trades_with_a_cap():
    terms = [{"id": "padel", "fr": ["padel"]}, {"id": "us_only", "en": ["x"]}]
    q = plan_city_queries(terms, ["riad"], CITIES, 10)
    assert [x["query"] for x in q] == ["padel casablanca", "padel fès", "riad casablanca", "riad fès"]
    assert q[2]["kind"] == "metier" and q[2]["id"] == "metier-riad"
    assert len(plan_city_queries(terms, ["riad"], CITIES, 3)) == 3


def city_rec(subject, city, query, suggestions, kind="tendance"):
    return make_record("autocomplete_villes", "MA", "suggest_city", f"{kind}:{subject}|{city}", suggestions,
                       {"city": city, "subject": subject, "kind": kind, "query": query})


def test_city_status_ignores_false_friends_and_reads_the_lag(tmp_path):
    store = RawStore(tmp_path)
    d = date(2026, 11, 30)
    store.append("autocomplete_villes", [
        city_rec("pilates reformer", "casablanca", "pilates reformer casablanca",
                 ["pilates reformer casablanca", "pilates reformer casablanca prix", "studio pilates reformer casablanca",
                  "formation pilates reformer casablanca"]),
        city_rec("pilates reformer", "fes", "pilates reformer fès",
                 ["pilates reformer fes", "pilates reformer fessier", "reformer pilates festival city"]),
        city_rec("matcha", "fes", "matcha fès", ["match fès aujourd hui", "matcha fes", "matcha fes maroc"]),
        city_rec("agence ia", "fes", "agence ia fès", ["agence immobiliere a fes"], kind="metier"),
        city_rec("vinted", "casablanca", "vinted casablanca",
                 ["vinted casablanca", "vinted casablanca t shirt", "pull casablanca vinted"]),
    ], d)
    cfg = {"cities": CITIES}
    rows = {(r["sujet"], r["ville_id"]): r for r in villes.table(store, cfg=cfg)}
    assert rows[("pilates reformer", "casablanca")]["statut"] == "installée"
    assert rows[("pilates reformer", "fes")]["statut"] == "à peine"          # « fessier », « festival » écartés
    assert rows[("matcha", "fes")]["statut"] == "en train d'arriver"         # « match fès » écarté
    assert rows[("agence ia", "fes")]["statut"] == "absente"                 # agence immobilière ≠ agence IA
    assert rows[("agence ia", "fes")]["type"] == "Métier local"
    assert rows[("vinted", "casablanca")]["statut"] == "à peine"            # la marque Casablanca, pas la ville
    lag = villes.lags(list(rows.values()), "casablanca", "fes")
    assert [x["sujet"] for x in lag] == ["pilates reformer"]
    assert "●●●" in villes.render(list(rows.values()))


def test_gaps_mark_small_publishers(tmp_path):
    store = RawStore(tmp_path)
    d = date(2026, 11, 28)
    zones = ["US", "GB", "CA", "FR", "MA", "BE", "SN", "DE", "JP", "AU"]

    def lookup(app, avail):
        return [make_record("apple_lookup", z, "availability", f"ios:{app}", 1 if z in avail else 0,
                            {"release_date": "2026-06-01", "version": "1"} if z in avail else {}) for z in zones]

    def rank(app, name, artist):
        return make_record("apple_charts", "US", "rank", f"ios:{app}", 4, {"chart": "top-free", "name": name,
                                                                            "genres": [], "artist": artist})

    store.append("apple_lookup", lookup("muse", {"US", "CA", "GB"}) + lookup("tiny", {"US", "CA", "GB"}), d)
    store.append("apple_charts", [rank("muse", "Muse", "Meta Platforms, Inc."), rank("tiny", "Tiny Habit", "Jane Doe")], d)
    rows = {r["name"]: r for r in analysis.gaps(store, d)}
    assert rows["Muse"]["independent"] is False and rows["Tiny Habit"]["independent"] is True
    assert rows["Muse"]["publisher"] == "Meta Platforms, Inc."
    only = analysis.gaps(store, d, independent_only=True)
    assert [r["name"] for r in only] == ["Tiny Habit"]
