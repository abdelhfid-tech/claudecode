import math
import random

import pytest

from radar import signals
from radar.signals import FamilySeries


def test_theil_sen():
    assert signals.theil_sen([1, 3, 5, 7]) == pytest.approx(2.0)
    assert signals.theil_sen([1, 3, 5, 7, 9, 11, 200]) == pytest.approx(2.0)  # robuste à une valeur aberrante
    assert signals.theil_sen([5]) == 0.0


def test_mann_kendall_known_values():
    mk = signals.mann_kendall(list(range(1, 9)), hamed_rao=False)
    assert mk["S"] == 28
    assert mk["z"] == pytest.approx(27 / math.sqrt(8 * 7 * 21 / 18), rel=1e-9)
    assert mk["p"] < 0.001 and mk["valid"]
    flat = signals.mann_kendall([3, 3, 3, 3, 3, 3])
    assert flat["S"] == 0 and flat["p"] == pytest.approx(0.5)
    assert not signals.mann_kendall([1, 2, 3, 4, 5])["valid"]  # 5 points : non testable


def test_mann_kendall_decreasing_is_not_a_rise():
    assert signals.mann_kendall([9, 8, 7, 6, 5, 4, 3, 2])["p"] > 0.99


def test_hamed_rao_widens_variance_for_autocorrelated_noise():
    rng = random.Random(4)
    y, level = [], 0.0
    for i in range(30):
        level = 0.9 * level + rng.gauss(0, 1)  # bruit fortement autocorrélé, sans tendance
        y.append(level + 0.02 * i)
    raw = signals.mann_kendall(y, hamed_rao=False)
    corrected = signals.mann_kendall(y, hamed_rao=True)
    assert abs(corrected["z"]) <= abs(raw["z"]) + 1e-9


def test_kleinberg_online_is_causal_and_detects_a_final_burst():
    calm = [10, 11, 9, 10, 10, 11, 9, 10]
    assert signals.kleinberg_online(calm) == [0] * len(calm)
    burst = calm + [40, 45]
    states = signals.kleinberg_online(burst)
    assert states[-1] == 1
    assert states[: len(calm)] == signals.kleinberg_online(calm)  # l'avenir ne change pas le passé


def test_strength_penalises_single_family_and_rewards_corroboration():
    rising = [10, 12, 15, 19, 24, 30, 38, 48, 60]
    flat = [20, 21, 19, 20, 20, 21, 19, 20, 20]
    one = signals.strength([FamilySeries("stores", rising, 0.7), FamilySeries("search", flat, 0.3)])
    three = signals.strength([FamilySeries("stores", rising, 0.7), FamilySeries("search", rising, 0.5),
                              FamilySeries("attention", rising, 0.4)])
    assert one.rising_families == ["stores"]
    assert any("×0,6" in f for f in one.flags)
    assert three.components["corroboration"] == 1.0
    assert three.score > one.score
    assert three.stage == "acceleration"
    none = signals.strength([FamilySeries("stores", flat, 0.2)])
    assert none.score < 20


def test_one_day_spike_is_capped_and_never_accelerating():
    # Pic d'un jour suivi d'un retour sous le niveau de départ : demi-vie de 1 période,
    # persistance faible -> plafond à 40, pas de stade « accélération ».
    spike = [20, 20, 20, 20, 20, 20, 20, 500, 10, 9, 8]
    s = signals.strength([FamilySeries("a", spike, 0.9), FamilySeries("b", spike, 0.9),
                          FamilySeries("c", spike, 0.9)])
    assert s.score <= 40 and any("plafond" in f for f in s.flags)
    assert s.stage != "acceleration"
    # Un pic déjà retombé au niveau de base reste bas, même sans déclencher le plafond.
    fallen = signals.strength([FamilySeries("a", [5, 5, 5, 5, 5, 5, 200, 6, 5], 0.9)])
    assert fallen.score <= 40 and fallen.rising_families == []


def test_stage_decline_and_short_series():
    decline = [10, 30, 60, 100, 90] + [70, 60, 50] + [40] * 25 + [35, 30]
    assert signals.stage([FamilySeries("a", decline)], [], period_days=1) == "declin"
    assert signals.stage([FamilySeries("a", [1])], []) == "signal_faible"


def test_rank_to_strength():
    assert signals.rank_to_strength(1) == 1.0
    assert signals.rank_to_strength(None) == 0.0
    assert signals.rank_to_strength(150) == 0.0
    assert 0 < signals.rank_to_strength(100) < 0.05
