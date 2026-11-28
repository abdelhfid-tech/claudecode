import io
import json
from datetime import date, datetime, timezone

from radar import reactive
from radar.storage import RawStore, make_record

NOW = datetime(2026, 11, 28, 6, 47, tzinfo=timezone.utc)
CFG = {"max_candidates": 8, "resend_after_days": 14,
       "exclude_patterns": ["football", "\\bvs\\b"],
       "gtrends": {"days": 2, "min_traffic": 1000},
       "wikimedia": {"min_views": 20000, "lookback_from_days": 3, "lookback_to_days": 8},
       "apps": {"max": 3}}


def trend(zone, title, traffic):
    return make_record("gtrends_daily", zone, "trending", f"q:{title.lower()}", traffic,
                       {"title": title, "news": [{"title": f"article sur {title}"}]})


def page(zone, qid, title, views, data_day, project="en.wikipedia"):
    return make_record("wikimedia_country", zone, "pageviews", f"qid:{qid}", views,
                       {"data_day": data_day, "project": project, "title": title, "page_id": "1"})


def test_trend_candidates_keep_us_only_items_and_drop_noise(tmp_path):
    store = RawStore(tmp_path)
    store.append("gtrends_daily", [trend("US", "Dubai chocolate bar", 20000), trend("US", "uconn football", 50000),
                                   trend("US", "Labubu", 5000), trend("US", "small thing", 200),
                                   trend("FR", "Labubu", 2000)], date(2026, 11, 28))
    out = reactive.build(store, date(2026, 11, 28), CFG)
    assert [c["title"] for c in out] == ["Dubai chocolate bar"]  # football exclu, Labubu déjà en France, trafic faible
    assert out[0]["presence"]["FR"].startswith("absent")


def test_page_candidates_need_history_and_report_threshold(tmp_path):
    store = RawStore(tmp_path)
    store.append("wikimedia_country", [page("US", "Q1", "Old_Page", 90000, "2026-11-20")], date(2026, 11, 21))
    store.append("wikimedia_country", [page("US", "Q1", "Old_Page", 95000, "2026-11-27"),
                                       page("US", "Q2", "New_Format", 40000, "2026-11-27"),
                                       page("US", "Q3", "Tiny", 5000, "2026-11-27"),
                                       page("FR", "Q2", "Nouveau_format", 300, "2026-11-27", "fr.wikipedia")],
                 date(2026, 11, 28))
    out = reactive.build(store, date(2026, 11, 28), CFG)
    assert [c["title"] for c in out] == ["New Format"]  # Q1 déjà dans le top avant, Q3 trop faible
    assert out[0]["presence"] == {"FR": "300 vues", "MA": "sous le seuil de publication (moins de 90 vues)"}


def test_no_history_means_no_page_candidate(tmp_path):
    store = RawStore(tmp_path)
    store.append("wikimedia_country", [page("US", "Q2", "New_Format", 40000, "2026-11-27")], date(2026, 11, 28))
    assert reactive.build(store, date(2026, 11, 28), CFG) == []


def test_already_sent_candidates_are_not_resent_before_the_delay(tmp_path):
    store = RawStore(tmp_path)
    store.append("gtrends_daily", [trend("US", "Dubai chocolate bar", 20000)], date(2026, 11, 28))
    recent = {"trend:dubai chocolate bar": "2026-11-25"}
    old = {"trend:dubai chocolate bar": "2026-11-01"}
    assert reactive.build(store, date(2026, 11, 28), CFG, sent=recent) == []
    assert len(reactive.build(store, date(2026, 11, 28), CFG, sent=old)) == 1


class Resp:
    status = 200

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def test_run_posts_to_the_webhook_with_the_token_and_records_sent_ids(workspace, monkeypatch):
    store = RawStore(workspace / "data")
    store.append("gtrends_daily", [trend("US", "Dubai chocolate bar", 20000)], NOW.date())
    monkeypatch.setattr(reactive.settings, "load", lambda name, *a, **k: CFG if name == "reactive" else {})
    seen = {}

    def opener(req, timeout):
        seen["url"], seen["headers"], seen["body"] = req.full_url, dict(req.headers), json.loads(req.data)
        return Resp()

    out = reactive.run(NOW, post_url="https://n8n.example/webhook/radar-reactif", token="secret", opener=opener)
    assert out["post_status"] == 200
    assert seen["headers"]["X-radar-token"] == "secret"
    assert seen["body"]["candidates"][0]["id"] == "trend:dubai chocolate bar"
    assert "health" in seen["body"]
    sent = json.loads((workspace / "reactive" / "sent.json").read_text())
    assert sent == {"trend:dubai chocolate bar": "2026-11-28"}
    assert (workspace / "reactive" / "candidates-2026-11-28.json").exists()


def test_failed_post_does_not_mark_candidates_as_sent(workspace, monkeypatch):
    import urllib.error

    store = RawStore(workspace / "data")
    store.append("gtrends_daily", [trend("US", "Dubai chocolate bar", 20000)], NOW.date())
    monkeypatch.setattr(reactive.settings, "load", lambda name, *a, **k: CFG if name == "reactive" else {})

    def opener(req, timeout):
        raise urllib.error.HTTPError(req.full_url, 401, "unauthorized", {}, io.BytesIO(b""))

    out = reactive.run(NOW, post_url="https://n8n.example/webhook/x", token="bad", opener=opener)
    assert out["post_status"] == 401
    assert not (workspace / "reactive" / "sent.json").exists()


def test_gulf_trends_are_candidates_too(tmp_path):
    store = RawStore(tmp_path)
    store.append("gtrends_daily", [trend("AE", "Dubai chocolate bar", 20000), trend("US", "Dubai chocolate bar", 5000),
                                   trend("SA", "Pistachio cream", 3000), trend("FR", "Pistachio cream", 2000)],
                 date(2026, 11, 28))
    cfg = {**CFG, "gtrends": {**CFG["gtrends"], "origins": ["US", "AE", "SA"]}}
    out = reactive.build(store, date(2026, 11, 28), cfg)
    assert [c["title"] for c in out] == ["Dubai chocolate bar"]  # une seule fois ; la crème déjà en France
    assert "USA" in out[0]["signal"]["source"] or "Émirats" in out[0]["signal"]["source"]
