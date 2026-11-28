"""Relevé assortiment : plan des requêtes, niveaux par lieu, verdicts, familles, écosystème."""

from datetime import date

from radar import assortiment
from radar.collectors.assortiment import AutocompleteAssortiment
from radar.storage import RawStore, make_record

CITIES = [{"id": "casablanca", "query": "casablanca", "match": "\\bcasa(blanca)?\\b"},
          {"id": "fes", "query": "fès", "match": "\\bfes\\b"}]
CFG = {
    "city": "fes", "leader": "casablanca",
    "national": {"fr": "maroc", "ar": "المغرب", "match": "\\bmaroc\\b|المغرب"},
    "city_ar": {"fes": "فاس"}, "city_ar_match": {"fes": "فاس"},
    "intents": {"prix": "\\bprix\\b", "en_ligne": "\\blivraison\\b"},
    "famille": [{"id": "nuit", "label": "Nuit", "concepts": [{"fr": "pyjama satin", "ar": "بيجامة"}, {"fr": "plaid"}]},
                {"id": "caisse", "label": "Caisse", "impulsion": True, "concepts": [{"fr": "bonbons"}]}],
    "ecosysteme": [{"role": "Clients professionnels", "termes": ["riad"]}],
}


def fake_sources(monkeypatch):
    monkeypatch.setattr(assortiment.settings, "load",
                        lambda name, *a, **k: {"source": {"autocomplete_villes": {"cities": CITIES}}})


def test_plan_crosses_concepts_with_places_and_languages(monkeypatch):
    fake_sources(monkeypatch)
    queries = [q["query"] for q in assortiment.plan(CFG)]
    assert queries[:5] == ["pyjama satin fès", "pyjama satin casablanca", "pyjama satin maroc", "بيجامة فاس", "بيجامة المغرب"]
    assert "bonbons maroc" in queries and queries[-1] == "riad fès"
    assert len(queries) == 5 + 3 + 3 + 1


def test_verdicts_families_and_ecosystem(tmp_path, monkeypatch):
    fake_sources(monkeypatch)
    store = RawStore(tmp_path)
    day = date(2026, 11, 30)
    data = {
        "pyjama satin fès": ["pyjama satin fès", "pyjama satin fès prix", "pyjama satin femme fès", "pyjama satin fes magasin"],
        "pyjama satin casablanca": ["pyjama satin casablanca prix"],
        "pyjama satin maroc": ["pyjama satin maroc livraison", "pyjama satin maroc prix"],
        "plaid fès": [], "plaid casablanca": ["plaid casablanca", "plaid casablanca prix", "plaid casa magasin"],
        "plaid maroc": ["plaid maroc"],
        "bonbons fès": [], "bonbons casablanca": [], "bonbons maroc": [],
        "riad fès": ["riad fès", "riad fès medina", "riad fès pas cher", "riad fès avec piscine"],
    }
    records = []
    for q in assortiment.plan(CFG):
        if q["query"] in data:
            records.append(make_record("autocomplete_assortiment", "MA", "suggest_assortment", q["query"], data[q["query"]], q))
    store.append("autocomplete_assortiment", records, day)
    rows = {r["concept"]: r for r in assortiment.table(store, cfg=CFG)}
    assert rows["pyjama-satin"]["verdict"] == "Demandé à Fès" and rows["pyjama-satin"]["niveau_fes"] == 3
    assert set(rows["pyjama-satin"]["intentions"]) == {"prix", "en_ligne"}
    assert rows["plaid"]["verdict"] == "En avance à Casablanca"
    assert rows["bonbons"]["verdict"] == "Peu cherché sur Google"
    fams = {f["famille"]: f for f in assortiment.families(list(rows.values()), CFG)}
    assert fams["nuit"]["direction"] == "Renforcer en magasin"   # 1 concept sur 2 demandé à Fès
    assert fams["caisse"]["direction"].startswith("Achat d'impulsion")
    eco = assortiment.ecosystem(store, cfg=CFG)
    assert eco[0]["terme"] == "riad" and eco[0]["niveau"] == 3 and "medina" in eco[0]["precisions"]
    assert "Renforcer en magasin" in assortiment.render(list(rows.values()), list(fams.values()), eco)


def test_collector_records_each_query(monkeypatch):
    fake_sources(monkeypatch)

    class Resp:
        ok, status, error = True, 200, None
        body = '["x",["pyjama satin fès prix"]]'.encode()

    class Client:
        def __init__(self):
            self.urls = []

        def request(self, url):
            self.urls.append(url)
            return Resp()

    class Ctx:
        client = Client()
        source_config = {"config": CFG}
        now = None

        def zone_ok(self, z):
            return True

    res = AutocompleteAssortiment().collect(Ctx())
    assert len(res.records) == 12 and len(Ctx.client.urls) == 12
    assert res.records[0]["meta"]["place"] == "fes"


def test_family_demanded_elsewhere_is_tested_and_pushed_online():
    rows = [{"famille": "nuit", "verdict": v, "intentions": [], "terme": t, "terme_ar": ""}
            for v, t in [("En avance à Casablanca", "a"), ("Demandé au Maroc, peu localisé", "b"),
                         ("Demandé au Maroc, peu localisé", "c"), ("Peu cherché sur Google", "d"), ("Cherché, sans précision", "e")]]
    cfg = {"famille": [{"id": "nuit", "label": "Nuit"}]}
    assert assortiment.families(rows, cfg)[0]["direction"] == "Tester en magasin, pousser en ligne"
    weak = [{**r, "verdict": "Peu cherché sur Google"} for r in rows]
    assert assortiment.families(weak, cfg)[0]["direction"] == "Réduire : peu de demande visible"
