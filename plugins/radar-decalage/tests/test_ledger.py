import json
from datetime import date, datetime, timezone

import pytest

from radar.ledger import Ledger, LedgerError, brier, brier_skill, interval_score, scoreboard

T0 = datetime(2026, 11, 28, 12, 0, tzinfo=timezone.utc)
EVENT = {"type": "ios_available", "app": "6760173601", "rule": "disponible dans la vitrine FR sur 3 relevés sur 7"}


def predict(ledger, prob=0.3, entity="ios:6760173601", zone="FR", cls="C", interval=None):
    return ledger.predict(entity=entity, zone=zone, question="Muse disponible en France avant le 30/06/2027 ?",
                          event=EVENT, horizon=date(2027, 6, 30), probability=prob, created=T0,
                          model_version="0.1.0", friction_class=cls, justification="agent IA, droit UE",
                          interval_days=interval)


def test_chain_and_verify(tmp_path):
    led = Ledger(tmp_path / "ledger.jsonl")
    p = predict(led)
    led.resolve(p["id"], outcome=0, resolved=datetime(2027, 7, 1, tzinfo=timezone.utc), evidence={"checks": 7})
    assert led.verify() == []
    assert len(list(led.lines())) == 2


def test_tampering_is_detected(tmp_path):
    led = Ledger(tmp_path / "ledger.jsonl")
    predict(led, 0.3)
    predict(led, 0.6, entity="ios:1")
    lines = (tmp_path / "ledger.jsonl").read_text().splitlines()
    first = json.loads(lines[0])
    first["probability"] = 0.9  # réécriture a posteriori
    lines[0] = json.dumps(first, sort_keys=True, separators=(",", ":"))
    (tmp_path / "ledger.jsonl").write_text("\n".join(lines) + "\n")
    problems = led.verify()
    assert any("ligne 1" in p for p in problems)


def test_rules_enforced(tmp_path):
    led = Ledger(tmp_path / "l.jsonl")
    with pytest.raises(LedgerError):
        led.predict(entity="x", zone="FR", question="?", event={"type": "ios_available"}, horizon=date(2027, 1, 1),
                    probability=0.5, created=T0, model_version="0")  # pas de règle de résolution
    with pytest.raises(LedgerError):
        predict(led, prob=1.4)
    with pytest.raises(LedgerError):
        led.predict(entity="x", zone="FR", question="?", event=EVENT, horizon=date(2026, 11, 1),
                    probability=0.5, created=T0, model_version="0")  # horizon dans le passé
    with pytest.raises(LedgerError):
        predict(led, interval={"p10": 90, "p50": 30, "p90": 200})
    p = predict(led)
    with pytest.raises(LedgerError):
        predict(led)  # doublon exact
    led.resolve(p["id"], outcome=None, resolved=T0, evidence={"reason": "données manquantes"})
    with pytest.raises(LedgerError):
        led.resolve(p["id"], outcome=1, resolved=T0, evidence={})


def test_scores():
    assert brier([(1.0, 1), (0.0, 0)]) == 0.0
    assert brier([(0.5, 1), (0.5, 0)]) == 0.25
    assert brier([]) is None
    # Toujours prédire le taux de base donne un score de compétence nul.
    assert abs(brier_skill([(0.5, 1), (0.5, 0)])) < 1e-12
    assert brier_skill([(0.9, 1), (0.1, 0)]) > 0
    assert interval_score(10, 50, 30) == 40
    assert interval_score(10, 50, 60, alpha=0.2) == 40 + 10 * 10


def test_scoreboard_aggregates_and_hides_small_classes(tmp_path):
    led = Ledger(tmp_path / "l.jsonl")
    a = predict(led, 0.8, entity="ios:a", interval={"p10": 10, "p50": 30, "p90": 90})
    b = predict(led, 0.2, entity="ios:b")
    predict(led, 0.5, entity="ios:c")
    led.resolve(a["id"], outcome=1, resolved=T0, evidence={}, observed_delay_days=40)
    led.resolve(b["id"], outcome=None, resolved=T0, evidence={})
    board = scoreboard(led, min_per_class=50)
    assert board["predictions"] == 3 and board["resolved"] == 1 and board["cancelled"] == 1 and board["open"] == 1
    assert board["brier"] == pytest.approx(0.04)
    assert board["by_class"] == {}
    assert board["mean_interval_score"] == 80


def test_anchor(tmp_path):
    led = Ledger(tmp_path / "l.jsonl")
    predict(led)
    entry = led.anchor(tmp_path / "anchors.jsonl", T0)
    assert entry["head"] == led.head() and entry["lines"] == 1
