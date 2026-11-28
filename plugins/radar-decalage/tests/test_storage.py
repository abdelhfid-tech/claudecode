import gzip
from datetime import date

import pytest

from radar.storage import RawStore, RunLog, make_record


def test_append_and_read_roundtrip(tmp_path, now):
    store = RawStore(tmp_path)
    recs = [make_record("src", "FR", "rank", "ios:1", 3, {"name": "Été"}, ts=now)]
    assert store.append("src", recs, date(2026, 11, 28)) == 1
    store.append("src", [make_record("src", "MA", "rank", "ios:2", 1, ts=now)], date(2026, 11, 28))
    rows = list(store.read("src", date(2026, 11, 28)))
    assert [r["key"] for r in rows] == ["ios:1", "ios:2"]
    assert rows[0]["meta"]["name"] == "Été"
    assert rows[0]["ts"] == "2026-11-28T12:00:00Z"


def test_append_is_append_only_gzip(tmp_path, now):
    store = RawStore(tmp_path)
    day = date(2026, 11, 28)
    store.append("src", [make_record("src", "FR", "k", "a", 1, ts=now)], day)
    store.append("src", [make_record("src", "FR", "k", "b", 2, ts=now)], day)
    with gzip.open(store.path("src", day), "rt", encoding="utf-8") as fh:
        assert len(fh.read().strip().splitlines()) == 2


def test_incomplete_record_rejected(tmp_path):
    with pytest.raises(ValueError):
        RawStore(tmp_path).append("src", [{"source": "src"}], date(2026, 11, 28))


def test_empty_append_writes_nothing(tmp_path):
    store = RawStore(tmp_path)
    assert store.append("src", [], date(2026, 11, 28)) == 0
    assert not store.path("src", date(2026, 11, 28)).exists()


def test_days_listing(tmp_path, now):
    store = RawStore(tmp_path)
    for d in (date(2026, 11, 27), date(2026, 11, 28)):
        store.append("src", [make_record("src", "FR", "k", "a", 1, ts=now)], d)
    assert store.days("src") == [date(2026, 11, 27), date(2026, 11, 28)]


def test_runlog(tmp_path):
    log = RunLog(tmp_path)
    log.append({"ts": "2026-11-28T00:00:00Z", "source": "a", "units_total": 2, "units_ok": 1})
    log.append({"ts": "2026-12-01T00:00:00Z", "source": "a", "units_total": 2, "units_ok": 2})
    entries = list(log.entries())
    assert len(entries) == 2
    assert {p.name for p in (tmp_path / "runs").iterdir()} == {"2026-11.jsonl", "2026-12.jsonl"}
