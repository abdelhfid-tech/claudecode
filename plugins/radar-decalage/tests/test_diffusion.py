import pytest

from radar.diffusion import DelayPrior, Priors, gap_score, opportunity_index


@pytest.fixture(scope="module")
def priors():
    return Priors()


def test_reproduces_the_labubu_check_of_the_method_dossier(priors):
    # Classe B, UE francophone : médiane 75 j, P90 240 j, part « jamais » 5 %.
    # Le dossier donne P(arrivée ≤ 159 j) = 0,756 ; Labubu est arrivé en France à +159 j.
    b_fr = priors.get("B", "FR")
    assert b_fr.cdf(159) == pytest.approx(0.756, abs=0.002)


def test_two_piece_fit_matches_both_quantiles(priors):
    b = priors.get("B", "MA")  # médiane 180, P10 45, P90 720
    reach = 1 - b.p_never
    assert b.cdf(45) == pytest.approx(0.10 * reach, abs=1e-6)
    assert b.cdf(180) == pytest.approx(0.50 * reach, abs=1e-6)
    assert b.cdf(720) == pytest.approx(0.90 * reach, abs=1e-6)
    assert b.quantile(0.5 * reach) == pytest.approx(180, rel=1e-6)


def test_zero_p10_gets_a_simultaneous_mass(priors):
    a = priors.get("A", "FR")
    assert a.cdf(0) == pytest.approx(0.10)
    assert a.cdf(-5) == 0.0
    assert a.quantile(0.05) == 0.0


def test_never_mass_caps_probability(priors):
    d = priors.get("D", "FR")
    assert d.cdf(100_000) == pytest.approx(0.65, abs=1e-3)
    assert d.quantile(0.7) is None


def test_blocked_until_payment_gate_opens(priors):
    f_ma = priors.get("F", "MA")
    assert f_ma.blocked and f_ma.cdf(10_000) == 0.0 and f_ma.quantile(0.1) is None


def test_sentinel_updates_reproduce_the_dossier(priors):
    b_fr = priors.get("B", "FR")
    # Royaume-Uni arrivé à +21 j pour un a priori de 45 j : la médiane française tombe à 52 j.
    assert b_fr.updated_by_sentinel(21, 45, priors.rho).median == pytest.approx(52, abs=0.5)
    # Allemagne arrivée à +154 j pour un a priori de 75 j : elle passe à 107 j.
    assert b_fr.updated_by_sentinel(154, 75, priors.rho).median == pytest.approx(107, abs=0.5)


def test_zone_groups(priors):
    assert priors.group_of("BE") == "UE_FR" and priors.group_of("CA-QC") == "QC"
    assert priors.get("B", "US") is None  # le pays d'origine n'a pas de délai


def test_gap_and_opportunity():
    assert gap_score(80, 0.2, 0.5, 1.0) == pytest.approx(32)
    assert gap_score(80, 1.5, 0.9, 1.0) == 0.0  # déjà au niveau de l'origine
    assert gap_score(80, 0.2, 0.5, 0.0) == 0.0  # porte fermée
    assert opportunity_index(0.6, 0.0) == pytest.approx(0.6)
    assert opportunity_index(0.6, 0.6) == 0.0
    assert opportunity_index(0.0, 0.0) == 0.0
