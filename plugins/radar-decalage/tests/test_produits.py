"""Radar produits : découverte filtrée, risques, comparaison Casablanca / Fès."""

from datetime import date

from radar import produits
from radar.collectors.produits import AutocompleteProduits
from radar.storage import RawStore, make_record

CFG = {
    "top_products": 5,
    "cities": ["casablanca", "fes"],
    "city_ar": {"casablanca": "الدار البيضاء", "fes": "فاس"},
    "city_ar_match": {"casablanca": "الدار البيضاء|كازا", "fes": "فاس"},
    "discovery": [{"prefix": "prix ", "letters": "t", "hl": "fr", "lang": "fr", "require": "\\b(maroc|dh)\\b"},
                  {"prefix": "ثمن ", "letters": "ك", "hl": "ar", "lang": "ar"}],
    "filters": {
        "strip": ["^prix ", "^ثمن ", "\\b(au|en|du|a)? ?maroc\\b", "بالمغرب", "في المغرب", "\\b20[0-9]{2}\\b"],
        "exclude": ["\\b(tesla|toyota|clio)\\b", "كليو", "الذهب"],
    },
    "risks": [{"label": "électronique", "pattern": "كاميرا|كاميرات|\\bcamera\\b"}],
}


def test_discovery_extracts_products_and_drops_cars_and_gold():
    found = [{"query": "prix t", "lang": "fr", "suggestions": ["prix trottinette électrique maroc", "prix tesla maroc",
                                                              "prix trottinette électrique xiaomi maroc", "prix goncourt 2026"]},
             {"query": "ثمن ك", "lang": "ar", "suggestions": ["ثمن كاميرات المراقبة بالمغرب", "ثمن كليو 5 في المغرب 2026",
                                                             "ثمن الذهب بالمغرب"]}]
    out = produits.discover(found, CFG)
    assert [p["cle"] for p in out] == ["trottinette electrique", "trottinette electrique xiaomi", "كاميرات المراقبة"]
    assert out[2]["lang"] == "ar"
    assert produits.risks("كاميرات المراقبة", CFG) == ["électronique"]


def test_casablanca_installed_but_not_yet_in_fes(tmp_path, monkeypatch):
    cities = {"casablanca": {"id": "casablanca", "query": "casablanca", "match": "\\bcasa(blanca)?\\b"},
              "fes": {"id": "fes", "query": "fès", "match": "\\bfes\\b"}}
    monkeypatch.setattr(produits.settings, "load",
                        lambda name, *a, **k: {"source": {"autocomplete_villes": {"cities": list(cities.values())}}})
    store = RawStore(tmp_path)
    d = date(2026, 11, 30)
    store.append("autocomplete_produits", [
        make_record("autocomplete_produits", "MA", "suggest_discovery", "q:prix t", ["prix trottinette électrique maroc"],
                    {"query": "prix t", "lang": "fr"}),
        make_record("autocomplete_produits", "MA", "suggest_product_city", "produit:trottinette electrique|casablanca",
                    ["trottinette electrique casablanca", "trottinette electrique casablanca prix",
                     "magasin trottinette electrique casablanca", "trottinette electrique casablanca derb ghallef"],
                    {"cle": "trottinette electrique", "city": "casablanca", "query": "trottinette electrique casablanca"}),
        make_record("autocomplete_produits", "MA", "suggest_product_city", "produit:trottinette electrique|fes",
                    ["trottinette electrique fes", "trottinette electrique festival"],
                    {"cle": "trottinette electrique", "city": "fes", "query": "trottinette electrique fès"}),
    ], d)
    rows = produits.table(store, cfg=CFG)
    assert len(rows) == 1
    r = rows[0]
    assert r["casablanca"] == "installé" and r["fes"] == "à peine"
    assert r["verdict"] == "Installé à Casablanca, pas encore à Fès"
    assert "derb ghallef" in r["precisions_casablanca"]
    assert "Fès" in produits.render(rows)


def test_collector_discovers_then_checks_cities(monkeypatch):
    from types import SimpleNamespace

    import json as _json

    answers = {
        "prix%20t": ["prix trottinette électrique maroc", "prix tesla maroc"],
        "%D8%AB%D9%85%D9%86%20%D9%83": ["ثمن كاميرات المراقبة بالمغرب"],
    }

    class Client:
        def __init__(self):
            self.urls = []

        def request(self, url, *a, **k):
            self.urls.append(url)
            q = url.split("&q=")[1]
            body = _json.dumps([q, answers.get(q, [])]).encode()
            return SimpleNamespace(ok=True, body=body, status=200, error=None)

    monkeypatch.setattr("radar.collectors.produits.settings.load",
                        lambda name, *a, **k: {"source": {"autocomplete_villes": {"cities": [
                            {"id": "casablanca", "query": "casablanca"}, {"id": "fes", "query": "fès"}]}}})
    client = Client()
    ctx = SimpleNamespace(client=client, source_config={"config": CFG}, now=None, zone_ok=lambda z: True)
    res = AutocompleteProduits().collect(ctx)
    kinds = [r["kind"] for r in res.records]
    assert kinds.count("suggest_discovery") == 2 and kinds.count("suggest_product_city") == 4
    city_queries = [r["meta"]["query"] for r in res.records if r["kind"] == "suggest_product_city"]
    assert "trottinette electrique fès" in city_queries and "كاميرات المراقبة فاس" in city_queries
