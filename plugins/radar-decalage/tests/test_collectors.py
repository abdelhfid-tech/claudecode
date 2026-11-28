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


def test_parse_v2():
    assert [r["id"] for r in apple.parse_v2(V2)] == ["111", "222"]
    assert apple.parse_v2(V2)[0]["genres"] == ["Lifestyle"]


def test_charts_use_only_the_v2_feed_allowed_by_robots(now, tmp_path):
    client = FakeClient({
        "marketingtools.apple.com/api/v2/us": (502, ""),
        "marketingtools.apple.com/api/v2/ma": (200, json.dumps(V2)),
    })
    res = apple.AppleCharts().collect(ctx_for(client, now, tmp_path=tmp_path))
    assert res.units_total == 2 and res.units_ok == 1 and res.errors
    assert not any("itunes.apple.com" in c for c in client.calls)  # flux historique interdit par robots.txt
    ma = [r for r in res.records if r["zone"] == "MA"]
    assert [r["value"] for r in ma] == [1, 2] and ma[0]["meta"]["feed"] == "v2"


def test_charts_report_unreadable_or_empty_feeds(now, tmp_path):
    client = FakeClient({"api/v2/us": (200, "{not json"), "api/v2/ma": (200, json.dumps({"feed": {"results": []}}))})
    res = apple.AppleCharts().collect(ctx_for(client, now, tmp_path=tmp_path))
    assert res.units_ok == 0 and res.units_total == 2 and len(res.errors) == 2


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


def test_lookup_empty_or_changed_response_is_a_failure_not_mass_unavailability(now, tmp_path):
    watch = Watchlist(tmp_path / "w.json")
    watch.observe_ranks([{"kind": "rank", "key": "ios:111", "value": 1, "zone": "US", "meta": {}}], now.date())
    for body in ({"resultCount": 0, "results": []}, {"items": [{"id": 111}]}):
        client = FakeClient({"lookup": (200, json.dumps(body))})
        res = apple.AppleLookup().collect(ctx_for(client, now, watch=watch, tmp_path=tmp_path))
        assert res.records == [] and res.units_ok == 0 and res.units_total == 2


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
    rows = lambda: wikimedia.parse_rows(TSV.splitlines())
    kept, cov = wikimedia.select(rows, {"FR", "MA"}, {"fr.wikipedia", "en.wikipedia"}, top_n=1, qids={"Q3"})
    keys = sorted((r["code"], r["page_id"]) for r in kept)
    # top 1 par (pays, projet) + toutes les lignes du QID suivi Q3 ; ar.wikipedia hors projets suivis
    assert keys == [("FR", "10"), ("FR", "12"), ("FR", "13"), ("MA", "21")]
    assert cov == {"FR": 4, "MA": 2}


def test_wikimedia_follows_origin_top_qids_in_every_country():
    tsv = "\n".join([
        "United States\tUS\ten.wikipedia\t1\tTrend_US\tQ100\t5000",
        "United States\tUS\ten.wikipedia\t2\tOther_US\tQ101\t400",
        "France\tFR\tfr.wikipedia\t50\tLocal_FR\tQ200\t900",
        "France\tFR\tfr.wikipedia\t51\tTendance_US_fr\tQ100\t95",   # sous le top local, mais QID suivi
        "Morocco\tMA\tfr.wikipedia\t60\tLocal_MA\tQ300\t120",
    ])
    kept, _ = wikimedia.select(lambda: wikimedia.parse_rows(tsv.splitlines()), {"US", "FR", "MA"}, {"en.wikipedia", "fr.wikipedia"},
                               top_n=1, qids=set(), origins={"US"}, top_n_origin=1)
    keys = sorted((r["code"], r["qid"]) for r in kept)
    assert ("FR", "Q100") in keys  # la tendance US est suivie en France même hors du top français
    assert ("US", "Q101") not in keys  # hors du top 1 d'origine
    assert keys == [("FR", "Q100"), ("FR", "Q200"), ("MA", "Q300"), ("US", "Q100")]
    # Q100 n'a aucune ligne au Maroc : sous le seuil de publication, pas forcément absent.


def wiki_ctx(client, now, state, tmp_path):
    cfg = {"countries": ["FR", "MA"], "projects": ["fr.wikipedia"], "top_n": 5, "origins": []}
    c = ctx_for(client, now, cfg, state=state, tmp_path=tmp_path)
    c.work_dir = tmp_path / "work"
    return c


def test_wikimedia_collect_skips_unpublished_days_and_tracks_done_days(now, tmp_path):
    published = (now.date() - timedelta(days=2)).isoformat()
    state = {}
    res = wikimedia.WikimediaCountry().collect(wiki_ctx(FakeClient({published: (200, TSV)}), now, state, tmp_path))
    assert res.units_ok == res.units_total == 1
    assert state["wikimedia_done_days"] == [published]
    assert {r["kind"] for r in res.records} == {"coverage", "pageviews"}
    assert all(r["meta"]["data_day"] == published for r in res.records)
    assert not list((tmp_path / "work").glob("*"))  # fichier téléchargé supprimé après lecture
    # Deuxième passage : le jour fait n'est pas retéléchargé ; rien de publié n'est une panne.
    client2 = FakeClient({})
    res2 = wikimedia.WikimediaCountry().collect(wiki_ctx(client2, now, state, tmp_path))
    assert res2.units_ok == res2.units_total == 1 and res2.records == []
    assert not any(published in c for c in client2.calls)


def test_wikimedia_failed_day_is_retried_next_time(now, tmp_path):
    d1, d2, d3 = (now.date() - timedelta(days=k) for k in (1, 2, 3))
    state = {}
    client = FakeClient({d3.isoformat(): (200, TSV), d2.isoformat(): (503, ""), d1.isoformat(): (200, TSV)})
    res = wikimedia.WikimediaCountry().collect(wiki_ctx(client, now, state, tmp_path))
    assert res.units_ok == 2 and res.units_total == 3
    assert d2.isoformat() not in state["wikimedia_done_days"]  # le jour en échec sera repris
    client2 = FakeClient({d2.isoformat(): (200, TSV)})
    wikimedia.WikimediaCountry().collect(wiki_ctx(client2, now, state, tmp_path))
    assert d2.isoformat() in state["wikimedia_done_days"]


def test_wikimedia_unreadable_file_is_a_failure(now, tmp_path):
    day = (now.date() - timedelta(days=1)).isoformat()
    state = {}
    client = FakeClient({day: (200, "<html>maintenance</html>\n<p>oops</p>")})
    res = wikimedia.WikimediaCountry().collect(wiki_ctx(client, now, state, tmp_path))
    assert res.units_ok == 0 and res.records == [] and day not in state["wikimedia_done_days"]
