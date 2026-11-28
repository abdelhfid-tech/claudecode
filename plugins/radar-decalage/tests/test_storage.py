import json
from datetime import date

import pytest

from radar.storage import AlreadyRunning, RawStore, RunLog, load_json, make_record, run_lock, save_json

DAY = date(2026, 11, 28)


def test_append_and_read_roundtrip(tmp_path, now):
    store = RawStore(tmp_path)
    recs = [make_record("src", "FR", "rank", "ios:1", 3, {"name": "Été"}, ts=now)]
    assert store.append("src", recs, DAY) == 1
    store.append("src", [make_record("src", "MA", "rank", "ios:2", 1, ts=now)], DAY)
    rows = list(store.read("src", DAY))
    assert sorted(r["key"] for r in rows) == ["ios:1", "ios:2"]
    assert [r for r in rows if r["key"] == "ios:1"][0]["meta"]["name"] == "Été"


def test_each_run_writes_its_own_file(tmp_path, now):
    store = RawStore(tmp_path)
    store.append("src", [make_record("src", "FR", "k", "a", 1, ts=now)], DAY)
    store.append("src", [make_record("src", "FR", "k", "b", 2, ts=now)], DAY)
    assert len(store.files("src", DAY)) == 2
    assert not list(store.day_dir("src", DAY).glob(".*tmp"))  # aucun fichier temporaire laissé


def test_a_corrupt_file_is_skipped_and_reported(tmp_path, now):
    store = RawStore(tmp_path)
    store.append("src", [make_record("src", "FR", "k", "good", 1, ts=now)], DAY)
    bad = store.day_dir("src", DAY) / "00000000T000000000000Z-1.jsonl.gz"
    bad.write_bytes(b"\x1f\x8b\x08\x00garbage")  # membre gzip tronqué (processus tué en cours d'écriture)
    rows = list(store.read("src", DAY))
    assert [r["key"] for r in rows] == ["good"]
    assert store.warnings and "illisible" in store.warnings[0]


def test_incomplete_record_rejected(tmp_path):
    with pytest.raises(ValueError):
        RawStore(tmp_path).append("src", [{"source": "src"}], DAY)


def test_empty_append_writes_nothing(tmp_path):
    store = RawStore(tmp_path)
    assert store.append("src", [], DAY) == 0
    assert store.files("src", DAY) == []


def test_days_listing(tmp_path, now):
    store = RawStore(tmp_path)
    for d in (date(2026, 11, 27), DAY):
        store.append("src", [make_record("src", "FR", "k", "a", 1, ts=now)], d)
    assert store.days("src") == [date(2026, 11, 27), DAY]


def test_runlog_tolerates_a_truncated_line(tmp_path):
    log = RunLog(tmp_path)
    log.append({"ts": "2026-11-28T00:00:00Z", "source": "a", "units_total": 2, "units_ok": 1})
    with (tmp_path / "runs" / "2026-11.jsonl").open("a") as fh:
        fh.write('{"ts": "2026-11-28T01:00:00Z", "sour')  # écriture interrompue
    log.append({"ts": "2026-12-01T00:00:00Z", "source": "a", "units_total": 2, "units_ok": 2})
    assert len(list(log.entries())) == 2


def test_single_writer_lock(tmp_path):
    with run_lock(tmp_path):
        with pytest.raises(AlreadyRunning):
            with run_lock(tmp_path):
                pass
    with run_lock(tmp_path):  # libéré après usage
        pass


def test_state_falls_back_to_backup(tmp_path):
    p = tmp_path / "state.json"
    save_json(p, {"v": 1})
    save_json(p, {"v": 2})
    p.write_text("")  # état abîmé
    value, warning = load_json(p, {})
    assert value == {"v": 1} and "secours" in warning
    assert json.loads((tmp_path / "state.json.bak").read_text()) == {"v": 1}
    missing, w2 = load_json(tmp_path / "absent.json", {"d": 0})
    assert missing == {"d": 0} and w2 is None
