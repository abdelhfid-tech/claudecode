import json
from datetime import date

from conftest import FakeClient
from radar import cli, health
from radar.watchlist import Watchlist


def rank(key, value, zone="US", name=None):
    return {"kind": "rank", "key": key, "value": value, "zone": zone, "meta": {"name": name} if name else {}}


def test_observe_ranks_and_selection(tmp_path):
    w = Watchlist(tmp_path / "w.json")
    added = w.observe_ranks([rank("ios:1", 5, name="A"), rank("ios:2", 150), rank("android:com.x", 2, "MA"),
                             rank("weird", 1)], date(2026, 11, 1))
    assert added == 2  # ios:2 est hors du top 100 ; « weird » n'a pas de plateforme
    w.observe_ranks([rank("ios:1", 2, "FR"), rank("ios:3", 50)], date(2026, 11, 28))
    ios = w.data["apps"]["ios"]
    assert ios["1"]["best_rank"] == 2 and ios["1"]["zones"] == ["FR", "US"] and ios["1"]["first_seen"] == "2026-11-01"
    assert w.apps_to_check("ios", date(2026, 11, 28)) == ["1", "3"]
    assert w.apps_to_check("ios", date(2027, 3, 1), max_age_days=60) == []
    w.save()
    assert Watchlist(tmp_path / "w.json").data == w.data


def entry(day, source, total, ok, errors=None):
    return {"ts": f"{day}T05:00:00Z", "source": source, "units_total": total, "units_ok": ok, "errors": errors or []}


def test_health_report_verdicts():
    entries = [entry(f"2026-11-{d:02d}", "good", 10, 10) for d in range(15, 29)]
    entries += [entry(f"2026-11-{d:02d}", "flaky", 10, 5 if d % 2 else 10, ["HTTP 429"]) for d in range(15, 29)]
    entries += [entry("2026-11-28", "new", 4, 4)]
    rows = {r["source"]: r for r in health.report(entries, date(2026, 11, 28), days=14)}
    assert rows["good"]["verdict"] == "maintenue" and rows["good"]["day_rate"] == 1.0
    assert rows["flaky"]["verdict"] == "à revoir" and rows["flaky"]["last_error"] == "HTTP 429"
    assert rows["new"]["verdict"] == "pilote en cours"


def test_cli_collect_end_to_end(workspace, monkeypatch, capsys):
    v2 = {"feed": {"results": [{"id": "111", "name": "Alpha", "artistName": "A", "genres": []}]}}
    lookup = {"results": [{"trackId": 111, "trackName": "Alpha"}]}
    fake = FakeClient({"api/v2/us": (200, json.dumps(v2)), "api/v2/ma": (200, json.dumps({"feed": {"results": []}})),
                       "lookup": (200, json.dumps(lookup))})
    monkeypatch.setattr(cli, "HttpClient", lambda **kw: fake)
    code = cli.main(["collect", "--only", "apple_charts,apple_lookup", "--zones", "US,MA"])
    assert code == 0
    out = capsys.readouterr().out
    assert "[apple_charts]" in out and "[apple_lookup]" in out
    raw = list((workspace / "data" / "raw").rglob("*.jsonl.gz"))
    assert {p.parts[-4] for p in raw} == {"apple_charts", "apple_lookup"}
    watch = json.loads((workspace / "watchlist.json").read_text())
    assert "111" in watch["apps"]["ios"]
    runs = [json.loads(line) for line in (workspace / "data" / "runs").glob("*.jsonl").__next__().read_text().splitlines()]
    assert {r["source"] for r in runs} == {"apple_charts", "apple_lookup"}
    # Classement marocain vide : une unité échouée, signalée
    charts = [r for r in runs if r["source"] == "apple_charts"][0]
    assert charts["units_total"] == 2 and charts["units_ok"] == 1 and len(charts["errors"]) == 1
    assert (workspace / "data" / "state.json").exists()


def test_cli_rejects_unknown_source(workspace, capsys):
    assert cli.main(["collect", "--only", "inexistante"]) == 2


def test_cli_dry_run_writes_nothing(workspace, monkeypatch):
    fake = FakeClient({"api/v2": (200, json.dumps({"feed": {"results": []}}))})
    monkeypatch.setattr(cli, "HttpClient", lambda **kw: fake)
    cli.main(["collect", "--only", "apple_charts", "--zones", "MA", "--dry-run"])
    assert not (workspace / "data" / "raw").exists() and not (workspace / "data" / "runs").exists()


def test_cli_refuses_a_second_concurrent_collection(workspace, monkeypatch, capsys):
    from radar.storage import run_lock
    with run_lock(workspace / "data"):
        assert cli.main(["collect", "--only", "apple_charts", "--zones", "MA"]) == 3
    assert "déjà en cours" in capsys.readouterr().err


def test_zones_filter_applies_to_every_source(workspace, monkeypatch):
    fake = FakeClient({"suggestqueries": (200, json.dumps(["x", ["x"]])), "trending/rss": (200, "<rss></rss>")})
    monkeypatch.setattr(cli, "HttpClient", lambda **kw: fake)
    cli.main(["collect", "--only", "autocomplete,gtrends_daily", "--zones", "FR"])
    assert fake.calls and all("gl=fr" in c or "geo=FR" in c for c in fake.calls)


def test_http_delta():
    before = {"a": {"200": 2}}
    after = {"a": {"200": 5, "429": 1}, "b": {"200": 1}}
    assert cli.http_delta(before, after) == {"a": {"200": 3, "429": 1}, "b": {"200": 1}}
