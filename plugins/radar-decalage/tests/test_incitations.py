"""Aides et freins : contrôle des fiches, sélection par pays et par usage."""

from datetime import date

from radar import incitations

ITEMS = [
    {"id": "ma_douane_chine", "pays": "MA", "sens": "freine", "categorie": "douane", "s_applique_a": ["produit_importe"],
     "titre": "Droits sur les biens de Chine", "resume": "…", "as_of": date(2026, 11, 28), "source": "https://x", "preuve": "F"},
    {"id": "ma_ae", "pays": "MA", "sens": "facilite", "categorie": "statut", "s_applique_a": ["service_numerique"],
     "titre": "Auto-entrepreneur", "resume": "…", "as_of": date(2026, 11, 28), "source": "https://y", "preuve": "F2"},
    {"id": "eu_colis", "pays": "UE", "sens": "freine", "categorie": "douane", "s_applique_a": ["colis_ecommerce"],
     "titre": "Petits colis", "resume": "…", "as_of": date(2026, 11, 28), "source": "https://z", "preuve": "F"},
]


def test_check_flags_missing_fields_unknown_values_and_staleness():
    bad = [{"id": "x", "pays": "ES", "sens": "aide", "categorie": "autre", "s_applique_a": ["voyage"],
            "titre": "t", "resume": "r", "as_of": date(2026, 1, 1), "source": "s", "preuve": "Z"},
           {"id": "x"}]
    problems = incitations.check(bad, date(2026, 11, 28))
    text = "\n".join(problems)
    for expected in ("pays « ES »", "sens « aide »", "catégorie « autre »", "usages inconnus", "preuve inconnu",
                     "à relire", "identifiant en double", "champ « source » manquant"):
        assert expected in text
    assert incitations.check(ITEMS, date(2026, 11, 28)) == []


def test_select_puts_brakes_first_and_counts_eu_for_france():
    ma = incitations.select(ITEMS, pays=["MA"])
    assert [i["id"] for i in ma] == ["ma_douane_chine", "ma_ae"]
    fr = incitations.select(ITEMS, pays=["FR"], usages=["colis_ecommerce"])
    assert [i["id"] for i in fr] == ["eu_colis"]


def test_initiative_usages_follow_the_archetype():
    assert incitations.usages_for("agence_export") == ["export_depuis_maroc", "artisanat", "produit_importe"]
    assert incitations.usages_for("ia_verticale_tpe", "bnc") == ["service_numerique"]
    chosen = incitations.for_initiative(ITEMS, "ia_verticale_tpe", "MA", "MA", "bnc")
    assert [i["id"] for i in chosen] == ["ma_ae"]


def test_shipped_file_is_valid():
    assert incitations.check(incitations.load(), date(2026, 11, 28)) == []
