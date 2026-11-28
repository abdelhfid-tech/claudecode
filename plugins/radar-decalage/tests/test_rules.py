from datetime import date

from radar import rules


def test_shipped_rules_are_valid():
    loaded = rules.load_rules()
    assert loaded["payments"] and loaded["platforms"] and loaded["regulatory"]
    assert rules.check(loaded, date(2026, 11, 28)) == []


def test_key_rules_from_the_study():
    r = rules.load_rules()
    assert rules.status(r, "payments", "stripe", "MA") == "non"
    assert rules.status(r, "payments", "stripe", "FR") == "oui"
    assert rules.status(r, "payments", "paddle", "CD") == "non"
    assert rules.status(r, "platforms", "tiktok_shop", "MA") == "non"
    assert rules.status(r, "platforms", "youtube_partner", "SN") == "oui"
    assert rules.status(r, "platforms", "youtube_partner", "CI") == "non"
    assert rules.status(r, "platforms", "whatsapp_generalist_ai", "MA") == "interdit"
    assert rules.status(r, "platforms", "youtube_inauthentic_content", "FR") == "interdit"  # valeur « ALL »
    # La loi française sur les moins de 15 ans a été censurée : rien n'est interdit.
    assert rules.status(r, "regulatory", "mineurs_reseaux_sociaux", "FR") == "autorise"


def test_unknown_is_never_a_silent_yes():
    r = rules.load_rules()
    assert rules.status(r, "payments", "stripe", "XX") == "non_verifie"
    assert rules.status(r, "regulatory", "inexistante", "FR") == "inconnu"
    assert rules.gate(r, "payments", "stripe", "XX") == 0.3
    assert rules.gate(r, "payments", "lemon_squeezy", "FR") == 0.0


def test_check_flags_bad_and_stale_rules():
    bad = {"payments": [{"id": "x", "as_of": date(2026, 1, 1), "source": "s", "evidence": "Z",
                         "status": {"FR": "peut-être"}}], "platforms": [], "regulatory": []}
    problems = rules.check(bad, date(2026, 11, 28))
    assert any("niveau de preuve" in p for p in problems)
    assert any("invalide" in p for p in problems)
    assert any("à relire" in p for p in problems)


def test_fiscal_values():
    f = rules.load_fiscal()
    ma = [x for x in f["exchange"] if x["id"] == "ma_igoc_2026"][0]
    assert ma["ecommerce_allowance_mad"]["particulier"] == 20_000
    fr = [x for x in f["regime"] if x["id"] == "fr_micro"][0]
    assert fr["vat_franchise_eur"]["services"] == 37_500
