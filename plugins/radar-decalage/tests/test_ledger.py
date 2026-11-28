import json
from datetime import date, datetime, timedelta, timezone

import pytest

from radar.ledger import Ledger, LedgerError, brier, brier_skill, interval_score, scoreboard

T0 = datetime(2026, 11, 28, 12, 0, tzinfo=timezone.utc)
EVENT = {"type": "ios_available", "app": "6760173601", "rule": "disponible dans la vitrine FR sur 3 relevés sur 7"}


class Clock:
    def __init__(self, t):
        self.t = t

    def __call__(self):
        return self.t


def ledger(tmp_path, clock=None):
    return Ledger(tmp_path / "ledger.jsonl", clock=clock or Clock(T0))


def predict(led, prob=0.3, entity="ios:6760173601", zone="FR", cls="C", interval=None, horizon=date(2027, 6, 30)):
    return led.predict(entity=entity, zone=zone, question="Muse disponible en France avant le 30/06/2027 ?",
                       event=EVENT, horizon=horizon, probability=prob, model_version="0.1.0",
                       friction_class=cls, justification="agent IA, droit UE", interval_days=interval)


def test_chain_and_verify(tmp_path):
    clock = Clock(T0)
    led = ledger(tmp_path, clock)
    p = predict(led)
    clock.t = datetime(2027, 7, 1, tzinfo=timezone.utc)
    led.resolve(p["id"], outcome=0, evidence={"checks": 7})
    assert led.verify() == [] and len(list(led.lines())) == 2


def test_tampering_is_detected(tmp_path):
    led = ledger(tmp_path)
    predict(led, 0.3)
    predict(led, 0.6, entity="ios:1")
    lines = (tmp_path / "ledger.jsonl").read_text().splitlines()
    first = json.loads(lines[0])
    first["probability"] = 0.9  # réécriture a posteriori
    lines[0] = json.dumps(first, sort_keys=True, separators=(",", ":"))
    (tmp_path / "ledger.jsonl").write_text("\n".join(lines) + "\n")
    assert any("ligne 1" in p for p in led.verify())


def test_backdating_and_future_dates_are_refused(tmp_path):
    led = ledger(tmp_path)
    with pytest.raises(LedgerError, match="antidaté"):
        led.predict(entity="x", zone="FR", question="?", event=EVENT, horizon=date(2027, 1, 1), probability=0.5,
                    model_version="0", created=T0 - timedelta(days=30))
    with pytest.raises(LedgerError, match="futur"):
        led.predict(entity="x", zone="FR", question="?", event=EVENT, horizon=date(2027, 1, 1), probability=0.5,
                    model_version="0", created=T0 + timedelta(days=2))
    predict(led)
    with pytest.raises(LedgerError, match="antérieur"):
        led.predict(entity="y", zone="FR", question="?", event=EVENT, horizon=date(2027, 1, 1), probability=0.5,
                    model_version="0", created=T0 - timedelta(hours=1))


def test_no_early_negative_resolution(tmp_path):
    clock = Clock(T0)
    led = ledger(tmp_path, clock)
    p = predict(led, horizon=date(2027, 6, 30))
    clock.t = datetime(2027, 1, 15, tzinfo=timezone.utc)
    with pytest.raises(LedgerError, match="horizon"):
        led.resolve(p["id"], outcome=0, evidence={})
    led.resolve(p["id"], outcome=1, evidence={"seen": "2027-01-14"})  # une arrivée se constate dès qu'elle a lieu


def test_rules_enforced(tmp_path):
    led = ledger(tmp_path)
    with pytest.raises(LedgerError):
        led.predict(entity="x", zone="FR", question="?", event={"type": "ios_available"}, horizon=date(2027, 1, 1),
                    probability=0.5, model_version="0")  # pas de règle de résolution
    with pytest.raises(LedgerError):
        predict(led, prob=1.4)
    with pytest.raises(LedgerError):
        predict(led, horizon=date(2026, 11, 1))  # horizon dans le passé
    with pytest.raises(LedgerError):
        predict(led, interval={"p10": 90, "p50": 30, "p90": 200})
    p = predict(led)
    with pytest.raises(LedgerError):
        predict(led)  # doublon exact
    led.resolve(p["id"], outcome=None, evidence={"reason": "données manquantes"})
    with pytest.raises(LedgerError):
        led.resolve(p["id"], outcome=1, evidence={})


def test_anchors_detect_truncation_and_rewrites(tmp_path):
    led = ledger(tmp_path)
    predict(led, 0.2, entity="ios:a")
    predict(led, 0.4, entity="ios:b")
    anchors = tmp_path / "anchors.jsonl"
    led.anchor(anchors, T0)
    assert led.verify(anchors) == []
    lines = (tmp_path / "ledger.jsonl").read_text().splitlines()
    (tmp_path / "ledger.jsonl").write_text(lines[0] + "\n")  # troncature : la chaîne seule resterait valide
    assert led.verify() == []
    assert any("tronqué" in p for p in led.verify(anchors))


def test_unreadable_line_is_reported_not_raised(tmp_path):
    led = ledger(tmp_path)
    predict(led)
    with (tmp_path / "ledger.jsonl").open("a") as fh:
        fh.write("{pas du json\n")
    assert any("illisible" in p for p in led.verify())


def test_scores():
    assert brier([(1.0, 1), (0.0, 0)]) == 0.0
    assert brier([(0.5, 1), (0.5, 0)]) == 0.25
    assert brier([]) is None
    assert abs(brier_skill([(0.5, 1), (0.5, 0)])) < 1e-12
    assert brier_skill([(0.9, 1), (0.1, 0)]) > 0
    assert interval_score(10, 50, 30) == 40
    assert interval_score(10, 50, 60, alpha=0.2) == 40 + 10 * 10


def test_scoreboard_aggregates_censors_and_hides_small_classes(tmp_path):
    clock = Clock(T0)
    led = ledger(tmp_path, clock)
    a = predict(led, 0.8, entity="ios:a", interval={"p10": 10, "p50": 30, "p90": 90})
    b = predict(led, 0.2, entity="ios:b")
    c = predict(led, 0.6, entity="ios:c", interval={"p10": 10, "p50": 20, "p90": 30}, horizon=date(2027, 6, 30))
    predict(led, 0.5, entity="ios:d")
    led.resolve(a["id"], outcome=1, evidence={}, observed_delay_days=40)
    led.resolve(b["id"], outcome=None, evidence={})
    clock.t = datetime(2027, 7, 1, tzinfo=timezone.utc)
    led.resolve(c["id"], outcome=0, evidence={})  # jamais arrivé : délai censuré à l'horizon (214 j)
    board = scoreboard(led, min_per_class=50)
    assert board["predictions"] == 4 and board["resolved"] == 2 and board["cancelled"] == 1 and board["open"] == 1
    assert board["brier"] == pytest.approx(((0.8 - 1) ** 2 + 0.6 ** 2) / 2)
    assert board["by_class"] == {}
    censored = interval_score(10, 30, 214)
    assert board["mean_interval_score"] == pytest.approx((80 + censored) / 2)


def test_anchor(tmp_path):
    led = ledger(tmp_path)
    predict(led)
    entry = led.anchor(tmp_path / "anchors.jsonl", T0)
    assert entry["head"] == led.head() and entry["lines"] == 1
