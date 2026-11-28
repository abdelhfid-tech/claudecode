from datetime import date

from radar import analysis
from radar.storage import RawStore, make_record

ZONES = ["US", "GB", "CA", "FR", "MA", "BE", "SN", "DE", "JP", "AU"]


def put(store, day, source, recs):
    store.append(source, recs, day)


def lookup_recs(app, available_in, release="2026-06-01", zones=ZONES):
    out = []
    for z in zones:
        v = 1 if z in available_in else 0
        meta = {"release_date": release, "version": "1"} if v else {}
        out.append(make_record("apple_lookup", z, "availability", f"ios:{app}", v, meta))
    return out


def rank_rec(app, zone, rank, name):
    return make_record("apple_charts", zone, "rank", f"ios:{app}", rank, {"chart": "top-free", "name": name,
                                                                           "genres": ["Lifestyle"]})


def test_gaps_keep_new_limited_apps_and_drop_national_services(tmp_path):
    store = RawStore(tmp_path)
    d = date(2026, 11, 28)
    put(store, d, "apple_lookup",
        lookup_recs("muse", {"US", "CA", "GB", "JP", "AU"}, "2026-09-08")
        + lookup_recs("walmart", {"US"}, "2009-11-02")
        + lookup_recs("chatgpt", set(ZONES), "2023-05-18")
        + lookup_recs("whatnot", {"US", "GB", "CA", "FR", "BE", "DE", "AU"}, "2019-12-06"))
    put(store, d, "apple_charts", [rank_rec("muse", "US", 3, "Muse"), rank_rec("walmart", "US", 13, "Walmart"),
                                   rank_rec("chatgpt", "US", 6, "ChatGPT"), rank_rec("whatnot", "US", 5, "Whatnot")])
    rows = analysis.gaps(store, d)
    names = [r["name"] for r in rows]
    assert names == ["Muse", "Whatnot"]  # Walmart : service national ; ChatGPT : partout
    muse = rows[0]
    assert muse["missing_targets"] == ["FR", "MA"] and muse["class"] == "récente, diffusion limitée"
    whatnot = rows[1]
    assert whatnot["missing_targets"] == ["MA"] and whatnot["target_status"]["FR"] == "disponible"
    table = analysis.render_gaps(rows)
    assert "Muse" in table and "indisponible" in table


def test_release_date_only_trusted_from_us_storefront():
    assert analysis.age_days({"meta_zone": "MA", "release_date": "2020-04-09"}, date(2026, 11, 28)) is None
    assert analysis.age_days({"meta_zone": "US", "release_date": "2026-09-08"}, date(2026, 11, 28)) == 81


def test_arrivals_need_an_observed_absence_first(tmp_path):
    store = RawStore(tmp_path)
    put(store, date(2026, 11, 28), "apple_lookup", lookup_recs("muse", {"US"}) + lookup_recs("old", {"US", "FR"}))
    put(store, date(2026, 12, 3), "apple_lookup", lookup_recs("muse", {"US", "FR"}) + lookup_recs("old", {"US", "FR"}))
    arr = analysis.arrivals(store)
    assert arr == {("ios:muse", "FR"): "2026-12-03"}  # « old » était déjà disponible : pas de date d'arrivée


def test_no_data_means_no_gap(tmp_path):
    assert analysis.gaps(RawStore(tmp_path)) == []
    assert "Aucun écart" in analysis.render_gaps([])
