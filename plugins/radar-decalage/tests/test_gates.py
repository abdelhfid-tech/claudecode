import pytest

from radar.gates import InitiativeSpec, evaluate


def test_seller_country_decides_the_payment_rail():
    saas = InitiativeSpec(rails=["stripe", "paddle"])
    fr = evaluate(saas, buyer_zone="FR", seller_zone="FR")
    ma = evaluate(saas, buyer_zone="FR", seller_zone="MA")
    assert fr.value == 1.0
    # Stripe est fermé au Maroc et le versement Paddle vers une banque marocaine n'est pas vérifié.
    assert ma.value == 0.3 and any("paddle" in r for r in ma.reasons)


def test_tiktok_shop_affiliation_blocked_for_a_moroccan_seller_open_for_the_diaspora():
    affil = InitiativeSpec(rails=["paypal_reception"], platforms_seller=["tiktok_shop"])
    assert evaluate(affil, buyer_zone="MA", seller_zone="MA").value == 0.0
    assert evaluate(affil, buyer_zone="FR", seller_zone="FR").value == 1.0


def test_whatsapp_generalist_assistant_forbidden_in_morocco():
    bot = InitiativeSpec(rails=["youcan_pay"], platforms_buyer=["whatsapp_generalist_ai"])
    res = evaluate(bot, buyer_zone="MA", seller_zone="MA")
    assert res.value == 0.0 and any("whatsapp" in r for r in res.reasons)


def test_excluded_categories_and_minors():
    bet = InitiativeSpec(rails=["stripe"], regulatory=["marches_prediction"])
    assert evaluate(bet, "FR", "FR").excluded
    kids = InitiativeSpec(rails=["stripe"], targets_minors=True)
    assert evaluate(kids, "FR", "FR").excluded


def test_regulated_but_allowed_category_is_a_partial_gate():
    colis = InitiativeSpec(rails=["stripe"], regulatory=["petits_colis_ue"])
    res = evaluate(colis, "FR", "FR")
    assert res.value == 0.6 and not res.excluded


def test_cash_on_delivery_in_morocco():
    cod = InitiativeSpec(rails=["paiement_livraison", "youcan_pay"])
    assert evaluate(cod, "MA", "MA").value == 1.0


def test_rule_specific_gate_values_and_seller_side_rules():
    affil = InitiativeSpec(rails=["awin_payout", "saas_affiliate_payout"], regulatory=["influence_commerciale"],
                           regulatory_seller=["influence_vendeur_hors_ue"])
    fr = evaluate(affil, buyer_zone="FR", seller_zone="FR")
    assert fr.value == pytest.approx(0.95)  # obligation de mention : pas un verrou
    ma = evaluate(affil, buyer_zone="FR", seller_zone="MA")
    # meilleur rail ouvert au Maroc : logiciels via PayPal (partiel, 0,6) ; article 9 hors UE : 0,8
    assert ma.value == pytest.approx(0.6 * 0.95 * 0.8)
    assert any("vendeur en MA" in r for r in ma.reasons)


def test_kdp_and_etsy_rails_by_country():
    kdp = InitiativeSpec(rails=["kdp_payout"])
    assert evaluate(kdp, "FR", "MA").value == 1.0      # virement en dirhams
    assert evaluate(kdp, "FR", "SN").value == 0.6      # chèque en dollars seulement
    etsy = InitiativeSpec(rails=["etsy_payments"])
    assert evaluate(etsy, "FR", "MA").value == 1.0 and evaluate(etsy, "FR", "SN").value == 0.0


def test_seller_rule_only_applies_to_its_target_audience():
    affil = InitiativeSpec(rails=["saas_affiliate_payout"], regulatory_seller=["influence_vendeur_hors_ue"])
    assert evaluate(affil, buyer_zone="MA", seller_zone="MA").value == 0.6  # pas de public français : pas d'article 9
    assert evaluate(affil, buyer_zone="FR", seller_zone="MA").value == pytest.approx(0.48)
