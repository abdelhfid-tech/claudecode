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
    influence = InitiativeSpec(rails=["stripe"], regulatory=["influence_commerciale"])
    res = evaluate(influence, "FR", "FR")
    assert res.value == 0.6 and not res.excluded


def test_cash_on_delivery_in_morocco():
    cod = InitiativeSpec(rails=["paiement_livraison", "youcan_pay"])
    assert evaluate(cod, "MA", "MA").value == 1.0
