import json
from datetime import timedelta

import pytest

from conftest import FakeClient
from radar.collectors import apple, autocomplete, google_play, gtrends, wikimedia
from radar.collectors.base import Context
from radar.settings import Zones
from radar.watchlist import Watchlist

ZONES = Zones({"zone": [
    {"code": "US", "apple": "us", "apple_grossing": True, "play": "us", "hl": "en"},
    {"code": "MA", "apple": "ma", "play": "ma", "hl": "fr"},
]})


def ctx_for(client, now, cfg=None, terms=None, watch=None, state=None, tmp_path=None):
    return Context(client=client, zones=ZONES, watchlist=watch or Watchlist(tmp_path / "w.json"),
                   terms=terms or [], source_config=cfg or {}, now=now, state=state if state is not None else {})


# ---------- App Store ----------

V2 = {"feed": {"results": [
    {"id": "111", "name": "Alpha", "artistName": "A Inc", "genres": [{"name": "Lifestyle"}]},
    {"id": "222", "name": "Beta", "artistName": "B Inc", "genres": []},
]}}
LEGACY = {"feed": {"entry": [
    {"id": {"attributes": {"im:id": "333"}}, "im:name": {"label": "Gamma"}, "im:artist": {"label": "C"},
     "category": {"attributes": {"label": "Finance"}}},
]}}


def test_parse_v2_and_legacy():
    assert [r["id"] for r in apple.parse_v2(V2)] == ["111", "222"]
    assert apple.parse_v2(V2)[0]["genres"] == ["Lifestyle"]
    legacy = apple.parse_legacy(LEGACY)
    assert legacy == [{"rank": 1, "id": "333", "name": "Gamma", "artist": "C", "genres": ["Finance"]}]
    single = {"feed": {"entry": LEGACY["feed"]["entry"][0]}}
    assert apple.parse_legacy(single)[0]["id"] == "333"


def test_charts_use_legacy_first_and_v2_as_fallback(now, tmp_path):
    client = FakeClient({
        "marketingtools.apple.com/api/v2/us": (502, ""),
        "marketingtools.apple.com/api/v2/ma": (200, json.dumps(V2)),
        "itunes.apple.com/us/rss/topfreeapplications": (200, json.dumps(LEGACY)),
        "itunes.apple.com/us/rss/topgrossingapplications": (200, json.dumps(LEGACY)),
        "itunes.apple.com/ma/rss/topfreeapplications": (503, ""),
    })
    res = apple.AppleCharts().collect(ctx_for(client, now, tmp_path=tmp_path))
    assert res.units_total == 3 and res.units_ok == 3
    us_free = [r for r in res.records if r["zone"] == "US" and r["meta"]["chart"] == "top-free"]
    assert us_free[0]["meta"]["feed"] == "legacy" and us_free[0]["key"] == "ios:333"
    assert not any("api/v2/us" in c for c in client.calls)  # le flux historique a suffi
    ma = [r for r in res.records if r["zone"] == "MA"]
    assert [r["value"] for r in ma] == [1, 2] and ma[0]["meta"]["feed"] == "v2"


def test_charts_report_failure_when_both_feeds_fail(now, tmp_path):
    client = FakeClient({"apple.com": (503, "")})
    res = apple.AppleCharts().collect(ctx_for(client, now, tmp_path=tmp_path))
    assert res.units_ok == 0 and res.units_total == 3 and res.errors


def test_lookup_marks_missing_apps_unavailable(now, tmp_path):
    watch = Watchlist(tmp_path / "w.json")
    watch.observe_ranks([{"kind": "rank", "key": "ios:111", "value": 1, "zone": "US", "meta": {}},
                         {"kind": "rank", "key": "ios:999", "value": 5, "zone": "US", "meta": {}}], now.date())
    found = {"resultCount": 1, "results": [{"trackId": 111, "trackName": "Alpha", "version": "2.0",
                                            "currentVersionReleaseDate": "2026-11-01T00:00:00Z",
                                            "releaseDate": "2020-04-09T00:00:00Z"}]}
    client = FakeClient({"lookup": (200, json.dumps(found))})
    res = apple.AppleLookup().collect(ctx_for(client, now, {"batch_size": 50}, watch=watch, tmp_path=tmp_path))
    values = {(r["zone"], r["key"]): r["value"] for r in res.records}
    assert values == {("US", "ios:111"): 1, ("US", "ios:999"): 0, ("MA", "ios:111"): 1, ("MA", "ios:999"): 0}
    assert res.units_ok == 2
    avail = [r for r in res.records if r["value"] == 1][0]
    assert avail["meta"]["release_date"] == "2020-04-09"


# ---------- Google Play ----------

def play_item(pkg, name):
    it = [None] * 16
    it[0] = [pkg, 7]
    it[3] = name
    it[4] = ["4,4", 4.4]
    it[5] = "Communication"
    it[14] = "Dev"
    it[15] = "1 000+"
    return [it]


def play_response(items):
    node28 = [None] * 29
    node28[28] = [items]
    inner = [[None, [node28]]]
    outer = [["wrb.fr", "vyAe2", json.dumps(inner), None]]
    return ")]}'\n\n1234\n" + json.dumps(outer) + "\n"


def test_play_parse():
    rows = google_play.parse(play_response([play_item("com.a", "App A"), play_item("com.b", "App B")]))
    assert [(r["rank"], r["id"], r["name"]) for r in rows] == [(1, "com.a", "App A"), (2, "com.b", "App B")]
    assert rows[0]["rating"] == 4.4 and rows[0]["developer"] == "Dev"


def test_play_parse_detects_structure_change():
    with pytest.raises(ValueError):
        google_play.parse(")]}'\n\n1\n" + json.dumps([["wrb.fr", "vyAe2", json.dumps([[None]]), None]]))


def test_play_body_template_substitution():
    body = google_play.build_body("topgrossing", "FINANCE", 50)
    assert "${" not in body and "topgrossing" in body and "FINANCE" in body


def test_play_collect(now, tmp_path):
    client = FakeClient({"gl=us": (200, play_response([play_item("com.a", "A")])), "gl=ma": (429, "")})
    res = google_play.GooglePlayCharts().collect(ctx_for(client, now, tmp_path=tmp_path))
    assert res.units_total == 2 and res.units_ok == 1
    assert res.records[0]["key"] == "android:com.a" and res.records[0]["zone"] == "US"


# ---------- Google Trends ----------

RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:ht="https://trends.google.com/trending/rss" version="2.0"><channel>
<item><title>Sujet Un</title><ht:approx_traffic>2K+</ht:approx_traffic>
<pubDate>Sat, 28 Nov 2026 06:20:00 -0800</pubDate>
<ht:news_item><ht:news_item_title>Titre</ht:news_item_title><ht:news_item_url>https://ex.test/a</ht:news_item_url>
<ht:news_item_source>Ex</ht:news_item_source></ht:news_item></item>
<item><title>Sujet  Deux</title><ht:approx_traffic>200+</ht:approx_traffic></item>
</channel></rss>"""


@pytest.mark.parametrize("label,value", [("200+", 200), ("2K+", 2000), ("1M+", 1_000_000), ("1 000+", 1000),
                                         ("", None), (None, None), ("beaucoup", None)])
def test_parse_traffic(label, value):
    assert gtrends.parse_traffic(label) == value


def test_gtrends_parse_and_collect(now, tmp_path):
    items = gtrends.parse(RSS)
    assert items[0]["traffic"] == 2000 and items[0]["published"] == "2026-11-28T14:20:00Z"
    assert items[0]["news"][0]["source"] == "Ex"
    client = FakeClient({"geo=US": (200, RSS), "geo=MA": (200, "<rss><broken")})
    res = gtrends.GoogleTrendsDaily().collect(ctx_for(client, now, {"geos": ["US", "MA"]}, tmp_path=tmp_path))
    assert res.units_ok == 1 and res.units_total == 2
    assert [r["key"] for r in res.records] == ["q:sujet un", "q:sujet deux"]


# ---------- Autocomplétion ----------

TERMS = [{"id": "labubu", "en": ["labubu"], "fr": ["labubu"], "ary": ["labubu"]},
         {"id": "matcha", "en": ["matcha"], "fr": ["matcha"]}]
PAIRS = [{"engine": "google", "zone": "FR", "lang": "fr", "hl": "fr", "gl": "fr"},
         {"engine": "google", "zone": "MA", "lang": "ary", "hl": "fr", "gl": "ma"},
         {"engine": "amazon", "zone": "US", "lang": "en", "amazon": "com"}]


def test_plan_queries_respects_languages_and_cap():
    q = autocomplete.plan_queries(TERMS, PAIRS, 100)
    assert [(x["term"], x["lang"]) for x in q] == [("labubu", "fr"), ("labubu", "ary"), ("labubu", "en"),
                                                   ("matcha", "fr"), ("matcha", "en")]
    assert len(autocomplete.plan_queries(TERMS, PAIRS, 2)) == 2


def test_autocomplete_collect(now, tmp_path):
    client = FakeClient({
        "suggestqueries.google.com": (200, json.dumps(["labubu", ["labubu prix", "labubu prix maroc"]])),
        "completion.amazon.com": (200, json.dumps({"suggestions": [{"value": "labubu doll"}]})),
    })
    res = autocomplete.Autocomplete().collect(
        ctx_for(client, now, {"pairs": PAIRS, "max_queries": 10}, terms=TERMS[:1], tmp_path=tmp_path))
    assert res.units_ok == 3
    by_engine = {r["meta"]["engine"] + r["zone"]: r["value"] for r in res.records}
    assert by_engine["googleMA"] == ["labubu prix", "labubu prix maroc"]
    assert by_engine["amazonUS"] == ["labubu doll"]


def test_autocomplete_bad_payload_is_a_failed_unit(now, tmp_path):
    client = FakeClient({"suggestqueries.google.com": (200, "{}"), "completion.amazon.com": (403, "")})
    res = autocomplete.Autocomplete().collect(
        ctx_for(client, now, {"pairs": PAIRS, "max_queries": 10}, terms=TERMS[:1], tmp_path=tmp_path))
    assert res.units_ok == 0 and res.units_total == 3


# ---------- Wikimedia par pays ----------

TSV = "\n".join([
    "France\tFR\tfr.wikipedia\t10\tPage_A\tQ1\t500",
    "France\tFR\tfr.wikipedia\t11\tPage_B\tQ2\t300",
    "France\tFR\tfr.wikipedia\t12\tPage_C\tQ3\t120",
    "France\tFR\ten.wikipedia\t13\tPage_D\t\t95",
    "Morocco\tMA\tar.wikipedia\t20\tPage_E\tQ9\t91",
    "Morocco\tMA\tfr.wikipedia\t21\tPage_F\tQ3\t93",
    "Japan\tJP\tja.wikipedia\t30\tPage_G\tQ7\t900",
])


def test_wikimedia_select_topn_forced_qids_and_coverage():
    rows = list(wikimedia.parse_rows(TSV))
    kept, cov = wikimedia.select(rows, {"FR", "MA"}, {"fr.wikipedia", "en.wikipedia"}, top_n=1, qids={"Q3"})
    keys = sorted((r["code"], r["page_id"]) for r in kept)
    # top 1 par (pays, projet) + toutes les lignes du QID suivi Q3 ; ar.wikipedia hors projets suivis
    assert keys == [("FR", "10"), ("FR", "12"), ("FR", "13"), ("MA", "21")]
    assert cov == {"FR": 4, "MA": 2}


def test_wikimedia_collect_skips_unpublished_days_and_tracks_state(now, tmp_path):
    published = (now.date() - timedelta(days=2)).isoformat()
    client = FakeClient({published: (200, TSV)})
    state = {}
    cfg = {"countries": ["FR", "MA"], "projects": ["fr.wikipedia"], "top_n": 5}
    res = wikimedia.WikimediaCountry().collect(ctx_for(client, now, cfg, state=state, tmp_path=tmp_path))
    assert res.units_ok == res.units_total == 1
    assert state["wikimedia_last_day"] == published
    kinds = {r["kind"] for r in res.records}
    assert kinds == {"coverage", "pageviews"}
    assert all(r["meta"]["data_day"] == published for r in res.records)
    # Deuxième passage le même jour : rien à refaire, ce n'est pas une panne.
    client2 = FakeClient({})
    res2 = wikimedia.WikimediaCountry().collect(ctx_for(client2, now, cfg, state=state, tmp_path=tmp_path))
    assert res2.units_ok == res2.units_total == 1 and res2.records == []
    assert len(client2.calls) == 1  # seul J-1, postérieur au dernier jour traité, est tenté
