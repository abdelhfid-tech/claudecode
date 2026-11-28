# Archétypes d'initiatives digitales à haut rendement réalisables avec Claude Code, et leur économie

Axe de l'étude préalable du « Radar d'arbitrage de tendances ». Rédigé le 28 novembre 2026.

## 0. Légende, méthode et limites

Marquage de fiabilité appliqué à chaque affirmation :

- **[F]** fait vérifié par lecture directe d'une source primaire le 2026-11-28 (page officielle, page de prix, documentation, données d'un régulateur ou d'une API de paiement) ;
- **[F2]** fait repris d'un dossier compagnon de la même étude, qui cite sa propre source primaire (la source est redonnée ici) ;
- **[E]** estimation d'un tiers, chiffre déclaratif d'une plateforme intéressée, ou chiffre de revenu « vérifié » par un agrégateur mais non audité ;
- **[H]** hypothèse de l'auteur, à calibrer ;
- **[CI]** connaissance interne antérieure, non revérifiée pendant la session.

**Limite majeure.** Le budget partagé de recherche web (200 requêtes par tour, toutes équipes confondues) était déjà épuisé au début de cet axe : aucune recherche web n'a pu être lancée. Le dossier repose donc sur (1) la lecture directe d'environ 60 pages primaires dont l'adresse était connue, (2) un test de l'API publique de TrustMRR et l'extraction de 126 fiches de startups à revenu vérifié par API de paiement, (3) les dossiers compagnons déjà produits (`market-maroc-maghreb.md`, `market-france-europe.md`, `trends-us-business.md`, `claude-code-plugins.md`). Les cas de fondateurs francophones d'Afrique subsaharienne et du Maroc n'ont pas pu être recherchés : c'est la principale lacune (voir section 10).

**Biais du survivant.** Les cas cités en section 5 viennent de la page d'accueil de TrustMRR, qui met en avant les meilleurs revenus. Ils montrent qu'un archétype *peut* payer, pas qu'il paie *en général*. Les taux de base de la section 2 servent de contrepoids et alimentent la grille de scoring.

---

## 1. Synthèse

1. **Les taux de base sont bas, même chez les bâtisseurs outillés.** Sur plus de 115 000 apps, seules 17,3 % des apps lancées atteignent 1 000 $ de revenu mensuel dans les deux ans, et 4,6 % atteignent 10 000 $. L'app médiane encaisse environ 72 $ par mois un an après son lancement (RevenueCat 2026) [F]. Sur TrustMRR, base de plus de 15 000 startups dont le revenu est relevé par API de paiement, 68,6 % des fiches sont dans la tranche 0 à 1 000 $ [F]. 21,8 % des établissements américains ferment dans leur première année (cohorte 2023) et environ 65 % dans les dix ans (BLS) [F].
2. **La loi de puissance joue aussi à l'intérieur du portefeuille d'un fondateur solo célèbre.** Marc Lou, fondateur français, a 20 produits pour 3,34 M$ de revenu cumulé vérifié. Quatre produits font environ 87 % du total, et ShipFast, 1,3 M$ cumulés, n'a encaissé que 548 $ sur les 30 derniers jours [F]. Il faut raisonner en portefeuille de paris et intégrer la décroissance.
3. **Le « MRR affiché » n'est pas de l'encaissement.** Chez DM Champ, 135 927 $ de MRR affiché correspondent à 24 004 $ encaissés sur 30 jours. Chez Speel.co, 62 877 $ de MRR correspondent à 10 500 $. La clé Stripe de PROSP a expiré : ses données datent du 5 février 2026 [F]. L'outil doit stocker l'encaissement sur 30 jours, sa date de synchronisation et son fournisseur, jamais le MRR seul.
4. **Le rail de paiement décide de la transposabilité avant la demande.** Stripe et Shopify Payments ne sont pas disponibles au Maroc [F]. Polar verse au Sénégal, en Côte d'Ivoire et en Tunisie, pas au Maroc [F]. Paddle n'exclut pas le Maroc [F]. Lemon Squeezy n'accepte plus d'inscriptions et arrête tout traitement le 31 mars 2027 [F]. En Afrique de l'Ouest, Wave Business prélève 1 % au-delà de 20 000 FCFA par jour [F], et Flutterwave au Sénégal 2 % sur le mobile money et 4,8 % sur les cartes [F].
5. **Le Maroc impose une contrainte de structure.** Côté auto-entrepreneur : plafond de 200 000 DH de chiffre d'affaires pour les services, impôt de 1 % du chiffre d'affaires, retenue de 30 % au-delà de 80 000 DH par an avec un même client [F2]. Côté change : un particulier ne peut payer que 20 000 DH par an en ligne par carte internationale (IGOC 2026), et un exportateur de services doit rapatrier ses recettes sous 90 jours, dont 70 % au plus peuvent aller sur un compte en devises [F2]. Une pile d'outils facturée en dollars dépasse vite la dotation d'un particulier : il faut une société, ou un compte en devises alimenté par l'export.
6. **France : le régime micro reste confortable jusqu'au seuil de TVA.** Plafonds 2026 de 83 600 € pour les services et de 203 100 € pour la vente. La franchise de TVA s'arrête à 37 500 € pour les services et à 85 000 € pour la vente. Le seuil unique de 25 000 € a été abandonné. Cotisations : 21,2 % en prestations BIC, 25,6 % en libéral non réglementé, 12,3 % en vente [F].
7. **Trois politiques de plateforme ont changé l'économie de trois archétypes.** WhatsApp : tarification au message depuis le 1er juillet 2025 ; messages de service payants au-delà de 1 000 gratuits par mois et par numéro depuis le 1er octobre 2026 ; assistants IA généralistes interdits depuis le 15 janvier 2026 sauf là où Meta est légalement tenu de les accepter (UE et EEE, Brésil, Turquie) [F]. YouTube : contenus « mass-produced or repetitive » exclus de la monétisation depuis le 15 juillet 2025 [F]. Google : abus de contenu à grande échelle sanctionné depuis le 5 mars 2024, et un résumé IA réduit le taux de clic de 15 % à 8 % (Pew) [F].
8. **Le coût d'inférence n'est plus la variable qui compte.** Une conversation de 3 000 jetons d'entrée et 500 de sortie coûte environ 0,0006 $ avec Claude Haiku 5.5, et environ 0,011 $ avec Claude Sonnet 5.5 (prix publics) [F, calcul]. Le frais de canal (message WhatsApp, commission de plateforme) et l'acquisition dominent l'économie unitaire.
9. **Vendre les outils de l'archétype rapporte plus que pratiquer l'archétype.** Parmi les fiches vérifiées, les outils pour chaînes sans visage (faceless.so : 51 811 $ sur 30 jours) et les outils ou agences GEO (AEO Engine : 182 247 $ ; ChatSEO, France : 63 301 $ ; Rank Prompt : 45 456 $) encaissent bien plus que les annuaires (Directory Launch : 211 $) ou les produits « MCP d'abord » (PosteAhora : 186 $) [F, sur un échantillon biaisé vers le haut].
10. **Serveurs MCP, plugins et skills ne se vendent pas tels quels.** L'annuaire de plugins d'Anthropic n'a pas de mécanisme de paiement [F2]. Apify Store garde 20 % et déduit les coûts de plateforme [F]. Le modèle qui fonctionne est un SaaS ou une API à clé, avec un serveur MCP comme canal de distribution : Postiz, open source avec agents et MCP, encaisse 533 727 $ sur 30 jours [F].
11. **La grille de scoring (section 8) donne un message robuste.** En espérance et sur 24 mois, temps du fondateur valorisé, la plupart des archétypes ont un retour proche de zéro. En France, en Belgique, en Suisse et au Québec, les archétypes adossés à un service arrivent en tête : agence d'automatisation, outils IA verticaux pour TPE, données et API, communautés payantes, GEO. Au Maroc et en Afrique francophone, c'est l'**arbitrage export** qui l'emporte : servir des clients français en euros depuis un coût d'opportunité bas, avec un retour ajusté d'environ 0,4 contre 0,1 en France. Sur 1 000 tirages Monte-Carlo (paramètres variés de ±50 %), l'agence export est dans le top 3 au Maroc dans 73 % des cas et dans l'UEMOA dans 83 % des cas.
12. **Des cas français vérifiés existent, pas de cas marocain ni subsaharien.** Cas français : ChatSEO, Podawaa, PROSP, Speel.co, StoreRadar. Aucun cas marocain ou subsaharien à revenu vérifié par API de paiement n'a été trouvé dans l'échantillon. Le seul chiffre africain est déclaratif : Chariow annonce plus de 200 000 créateurs et plus de 5 M$ reversés, soit environ 25 $ par créateur en moyenne [E, calcul].

---

## 2. Taux de base et contre-exemples (antidote au biais du survivant)

| Indicateur | Valeur | Source et date | Fiabilité |
|---|---|---|---|
| Apps qui atteignent 1 000 $ / 10 000 $ de revenu mensuel dans les deux ans suivant le lancement | 17,3 % / 4,6 % (Photo et vidéo : 21,4 % pour 1 000 $) | RevenueCat, *State of Subscription Apps 2026*, plus de 115 000 apps et plus de 16 Md$ suivis, données 2025 : https://www.revenuecat.com/state-of-subscription-apps/ | [F] |
| Revenu mensuel de l'app médiane un an après le lancement | environ 72 $ ; quartile supérieur à partir de 429 $ ; top 10 % à partir de 2 574 $ | idem | [F] |
| Délai médian pour atteindre 1 000 $ / 10 000 $ (apps qui y parviennent) | 58 jours / 109 jours | idem | [F] |
| Concentration par ancienneté | apps lancées avant 2020 : 69 % du revenu d'abonnement ; lancées en 2025 ou après : environ 3 % | idem | [F] |
| Apps IA contre non IA | +41 % de revenu par payeur à un an (30,16 $ contre 21,37 $) ; taux à 12 mois des abonnements annuels de 21,1 % contre 30,7 % (libellé « churn and retention » ambigu, à confirmer dans le PDF) | idem | [F] |
| Revenu par installation (édition 2025) | médiane d'environ 0,31 $ à 60 jours ; 0,38 $ sur l'App Store, 0,14 $ sur Google Play | https://www.revenuecat.com/state-of-subscription-apps-2025/ | [F] |
| Répartition des startups listées sur TrustMRR | 0 à 1 000 $ : 68,6 % ; 1 000 à 10 000 $ : 16,6 % ; 10 000 à 100 000 $ : 10,0 % ; 100 000 $ à 1 M$ : 3,8 % ; plus de 1 M$ : 1,0 % (base de mesure non précisée : MRR ou revenu cumulé) | https://trustmrr.com/stats, mis à jour le 2026-11-28 | [F] pour les chiffres, interprétation à confirmer |
| Taille de l'échantillon TrustMRR | plus de 15 000 startups listées, plus de 3 000 à vendre | https://trustmrr.com/llms.txt | [E, déclaratif] |
| Survie des établissements privés américains | 1 an : 79,6 % (cohorte 2013) à 78,2 % (cohorte 2023) ; 5 ans : 50,6 % à 51,5 % ; 10 ans : 34,7 % à 34,9 % | BLS Business Employment Dynamics, table 7, données à mars 2026 : https://www.bls.gov/bdm/us_age_naics_00_table7.txt | [F] |
| Portefeuille d'un fondateur solo célèbre (Marc Lou) | 20 produits ; 3 344 575 $ cumulés ; ShipFast 1,3 M$, CodeFast 839 k$, TrustMRR 432 k$, DataFast 351 k$ (environ 87 % à eux quatre) ; une douzaine de produits sous 25 k$ cumulés | https://trustmrr.com/founder/marclou, 2026-11-28 | [F] |
| Décroissance d'un succès | ShipFast : 1,3 M$ cumulés, 548 $ sur les 30 derniers jours, MRR nul | idem | [F] |
| Créateurs de produits numériques en Afrique francophone | Chariow : « +200 000 créateurs », « +5 M$ reversés », soit environ 25 $ par créateur en moyenne cumulée | https://chariow.com/, 2026-11-28 | [E, déclaratif ; division de l'auteur] |
| Conversion gratuit vers payant des newsletters | médiane de 0,62 %, prix par défaut de 10 $ par mois | Digital Applied (07/2026), via `trends-us-business.md` | [E] |
| Communautés Skool en tendance | prix médian de 27 $ par mois, 205 membres médians (sur les 1 000 communautés en tendance, donc déjà sélectionnées) | RevenueGeeks (07/2026), via `trends-us-business.md` | [E] |
| Concentration de l'affiliation TikTok Shop | le top 0,5 % des affiliés capte environ 38 % des commissions | Hamster Garage, via `trends-us-business.md` | [E] |
| Créateurs Roblox | médiane d'environ 1 500 $ sur 12 mois, contre 65,7 M$ en moyenne pour le top 10 | TechSpot, via `trends-us-business.md` | [E] |
| Surabondance d'offre créée par l'IA | soumissions App Store +84 % au T1 2026, nouvelles apps doublées au S1, téléchargements +2 % | 9to5Mac, via `trends-us-business.md` | [E] |
| Pics viraux | téléchargements de l'app Sora -45 % en janvier 2026 ; Character.AI en Chapter 11 le 12 octobre 2026 | TechCrunch, via `trends-us-business.md` | [E] et [F2] |
| Fin d'un rail populaire chez les indépendants | Lemon Squeezy : plus d'inscriptions, arrêt du traitement le 31 mars 2027, outil de migration le 2 décembre 2026 | https://www.lemonsqueezy.com/, 2026-11-28 | [F] |

**Contre-exemples nominatifs (revenu vérifié par API de paiement, TrustMRR, 2026-11-28)** [F] :

- *MAC+* (France, application macOS) : 346 $ sur 30 jours, 2 227 $ cumulés, malgré « +5 000 utilisateurs » revendiqués.
- *Tack+* (France, application macOS, créée en septembre 2026) : 72,75 $ cumulés.
- *Directory Launch* (modèle Next.js d'annuaires locaux « qui rapportent ») : 211 $ sur 30 jours.
- *TapRefer* (annuaire de programmes d'affiliation) : 675 $ sur 30 jours, MRR nul.
- *PosteAhora* (planificateur social pour agents IA, connectable à Claude) : 186 $ sur 30 jours.
- *VirallyBot* (Marc Lou) : 4 000 $ de MRR atteints, puis « rekt by COVID », 0 $ aujourd'hui.

**Lecture pour l'outil.** Une probabilité de réussite entre 5 % et 35 % selon l'archétype, sur 12 mois, est un ordre de grandeur cohérent avec ces taux de base [H]. Toute vitrine de succès doit s'afficher à côté de la médiane de sa catégorie.

---

## 3. Rails d'encaissement, commissions et coût de la pile technique

### 3.1 Disponibilité des rails par pays

| Rail | France / Belgique / Suisse | Québec (Canada) | Maroc | Sénégal / Côte d'Ivoire | Cameroun / RDC | Source |
|---|---|---|---|---|---|---|
| Stripe (compte local) | oui | oui | **non** | non (CI via le « réseau étendu » Paystack) | non | https://stripe.com/global [F] |
| Shopify Payments | oui (FR, BE, CH) | oui | **non** (prestataire tiers obligatoire, avec surcommission de 0,6 % à 2 %) | non | non | https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries ; https://www.shopify.com/pricing [F] |
| Paddle (marchand officiel, logiciels et produits numériques) | oui | oui | non exclu (versement vers une banque marocaine non vérifié) | non exclus | non exclus | https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle [F] |
| Polar (marchand officiel, versements via Stripe Connect Express) | oui | oui | **non** | **oui** | non vérifié | https://polar.sh/docs/merchant-of-record/supported-countries [F] |
| Lemon Squeezy | fermeture le 31 mars 2027 | idem | idem | idem | idem | https://www.lemonsqueezy.com/ [F] |
| Gumroad (marchand officiel, gère la TVA) | oui | oui | pays de versement non listés | idem | idem | https://gumroad.com/pricing [F] |
| Stripe Atlas (société du Delaware, 500 $) | n/a | n/a | ouvert aux fondateurs du monde entier ; compatibilité avec le contrôle des changes à faire valider | idem | idem | https://stripe.com/atlas [F] ; [H] pour la conformité |
| PayPal en réception | oui | oui | oui, retrait vers banque, carte ou Cash Plus ; compte assimilé à un compte à l'étranger selon une source citée | n/v | n/v | `market-maroc-maghreb.md` [F2] |
| YouCan Pay (cartes marocaines) | n/a | n/a | 3,9 % + 2 MAD par transaction réussie | n/a | n/a | https://youcanpay.com/ [F] |
| Wave Business | n/a | n/a | n/a | 1 % au-delà des 20 000 premiers FCFA quotidiens ; envoi groupé à 1 % | n/a | https://www.wave.com/fr/business/ [F] |
| Flutterwave (Sénégal) | n/a | n/a | n/a | mobile money 2 % ; cartes locales et internationales 4,8 % ; virement bancaire 1 500 XOF, vers mobile money 2 % | n/v | https://flutterwave.com/sn/pricing [F] |
| PawaPay (API mobile money) | n/a | n/a | n/a | SN, CI couverts | CM, RDC, Congo, Gabon, Bénin, Burkina Faso, Mali couverts ; prix non publiés en page d'accueil | https://www.pawapay.io/ [F] |
| Chariow (vente de produits numériques, mobile money, Wave, Orange Money, MTN, cartes) | n/a | n/a | n/v | oui (témoignages CI, SN, BJ, ML, BF) | oui (CM) | https://chariow.com/ [F] ; commission non affichée sur la page lue |
| Programme Partenaire YouTube | oui | oui | oui | **Sénégal oui, Côte d'Ivoire non** | **non** | https://support.google.com/youtube/answer/7101720 [F] |
| TikTok Shop | France depuis le 31 mars 2025 ; Belgique depuis le 15 juin 2026 ; Suisse : aucun lancement trouvé | non vérifié | absent | absent | absent | `market-france-europe.md` [F2] ; Suisse et Canada [H] |

**Écart à signaler.** `trends-us-business.md` indique que le Sénégal est exclu du Programme Partenaire YouTube (source tierce, juin 2026). La liste officielle lue le 2026-11-28 l'inclut. On retient la page officielle ; l'outil doit relire cette page à chaque exécution.

### 3.2 Commissions des plateformes de distribution

| Plateforme | Commission ou prix | Source | Fiabilité |
|---|---|---|---|
| App Store, Small Business Program | 15 % jusqu'à 1 M$ de produit annuel ; 10 % sous les conditions alternatives de l'UE dans le programme et pour les abonnements après la première année | https://developer.apple.com/app-store/small-business-program/ | [F] |
| Shopify App Store (développeurs) | 0 % sur le premier million de dollars de revenu brut cumulé (compté depuis le 1er janvier 2025), 15 % au-delà ; inscription de 19 $ ; 2,9 % de frais de traitement | https://shopify.dev/docs/apps/launch/distribution/revenue-share | [F] |
| Shopify (marchands) | Basic 39 $/mois (29 $ en annuel), Grow 105 $ (79 $), Advanced 399 $ (299 $) ; carte en ligne 2,9 % + 30 ¢ (tarif US affiché) ; prestataire tiers : 2 %, 1 % ou 0,6 % de surcommission ; essai de 3 jours puis 1 $/mois pendant 3 mois | https://www.shopify.com/pricing | [F] |
| YouCan (boutiques, Maroc) | à l'usage : 0,5 % du paiement à la livraison et 1 % du paiement en ligne jusqu'à 5 000 $ de ventes, puis 0,25 % et 0,5 % ; aucun frais avant 5 000 $ ; abonnements de 29 $ à 229 $/mois sans frais sur les ventes | https://youcan.shop/fr/pricing | [F] |
| Gumroad | 10 % + 0,50 $ en vente directe, 30 % via Discover ; marchand officiel (TVA gérée) | https://gumroad.com/pricing | [F] |
| Skool | Hobby 9 $/mois + 10 % ; Pro 99 $/mois + 2,9 % | https://www.skool.com/pricing | [F] |
| beehiiv | gratuit jusqu'à 2 500 abonnés ; Lite dès 49 $/mois (annuel) ; 0 % de commission sur les abonnements payants (frais Stripe en sus) | https://www.beehiiv.com/pricing | [F] |
| Substack | 10 % + frais Stripe | `market-france-europe.md` | [F2] |
| Apify Store (acteurs, y compris serveurs MCP) | paiement à l'événement ou à l'usage ; Apify garde 20 % ; coûts de plateforme déduits du versement (perte possible) | https://docs.apify.com/platform/actors/publishing/monetize | [F] |
| ExtensionPay (paiements d'extensions de navigateur) | 5 % par transaction, Stripe sous-jacent ; paiements du Chrome Web Store fermés par Google en 2021 ; « plus de 800 000 $ » versés aux développeurs au total | https://extensionpay.com/ | [F] pour le prix, [E] pour les volumes |
| Annuaire de plugins Claude | soumission réservée aux plans payants ; aucun mécanisme de vente | `claude-code-plugins.md` (https://code.claude.com/docs/en/plugins/publish.md) | [F2] |

### 3.3 Coût de la pile « une personne + Claude Code » (prix publics au 2026-11-28)

| Brique | Prix | Source | Fiabilité |
|---|---|---|---|
| Claude Pro / Max / Ultra | 20 $/mois (17 $ en annuel) / 100 $ / 200 $, Claude Code inclus | https://claude.com/pricing | [F] |
| API Claude | Haiku 5.5 : 0,10 $ / 0,50 $ par million de jetons (entrée / sortie, prompts sous 100 000 jetons) ; Sonnet 5.5 : 2 $ / 10 $ ; Opus 5.5 : 4 $ / 20 $ ; Batch -50 % ; lecture de cache à 0,05 fois le prix d'entrée sur Sonnet et Opus 5.5 | https://platform.claude.com/docs/en/about-claude/pricing | [F] |
| Claude Managed Agents | jetons + 0,08 $ par heure de session active | idem | [F] |
| Vercel | Hobby 0 $ ; Pro 20 $/mois avec 20 $ de crédit d'usage. La restriction d'usage commercial du plan Hobby n'apparaît pas sur la page de prix | https://vercel.com/pricing | [F] ; clause non vérifiée |
| Supabase | Free (500 Mo, 2 projets actifs, pause après une semaine d'inactivité) ; Pro dès 25 $/mois | https://supabase.com/pricing | [F] |
| Postiz | 29 $ à 99 $/mois (5 à 100 canaux) ; pas de plan gratuit ; auto-hébergement open source possible | https://postiz.com/pricing | [F] |
| ElevenLabs | Starter 6 $/mois, Creator 22 $, Pro 99 $, Scale 299 $, Business 990 $ ; licence commerciale incluse dès Starter ; 1 crédit par caractère en synthèse vocale | https://elevenlabs.io/pricing | [F] (prix « Black Friday » jusqu'au 1er décembre) |
| WhatsApp Business Platform | facturation au message délivré ; service gratuit jusqu'à 1 000 messages par mois et par numéro, puis payant depuis le 1er octobre 2026 ; utilitaires dans la fenêtre de service payants depuis la même date ; fenêtre gratuite de 7 jours après une publicité « Click-to-WhatsApp » ; catégorie Meta Business Agent à 2 $ par million de jetons, environ 4 à 5 cents par message ; le Maroc est devenu un marché tarifaire autonome le 1er octobre 2026, avec des hausses | https://developers.facebook.com/docs/whatsapp/pricing | [F] ; montants par pays dans des grilles CSV non lues |

**Calcul d'ordre de grandeur [F, calcul de l'auteur].** Une conversation client de 3 000 jetons d'entrée et 500 jetons de sortie coûte 3 000 × 0,10 / 10⁶ + 500 × 0,50 / 10⁶ ≈ 0,00055 $ avec Haiku 5.5, et 3 000 × 2 / 10⁶ + 500 × 10 / 10⁶ ≈ 0,011 $ avec Sonnet 5.5. Un message facturé par Meta (Business Agent) coûte de 4 à 5 cents. Le canal coûte donc de 4 à 80 fois plus que le modèle.

**Pile minimale [H].** Une pile Claude Max, Vercel Pro, Supabase Pro et Postiz Standard revient à environ 175 $/mois, soit environ 2 100 $/an. Cette somme **dépasse la dotation annuelle de 20 000 DH** d'un particulier marocain pour les achats en ligne par carte internationale (environ 2 000 $ au taux approximatif de 10 DH/$ [H, taux non revérifié]). Le constructeur solo marocain doit donc passer par une société (dotation minimale de 50 000 DH) ou par un compte en devises alimenté par des recettes d'export.

---

## 4. Cadre fiscal et réglementaire par pays (ce qui change le rendement)

### 4.1 France

| Règle | Valeur 2026 | Source | Fiabilité |
|---|---|---|---|
| Plafonds de chiffre d'affaires de la micro-entreprise | vente : 203 100 € ; services BIC et BNC : 83 600 € | https://entreprendre.service-public.gouv.fr/vosdroits/F32353 (vérifié le 21/02/2026) | [F] |
| Franchise en base de TVA | ventes : 85 000 € (seuil majoré 93 500 €) ; services : 37 500 € (41 250 €) ; réforme du seuil unique à 25 000 € « abandonnée » | https://entreprendre.service-public.gouv.fr/vosdroits/F21746 (vérifié le 01/01/2026) | [F] |
| Cotisations sociales | vente 12,3 % ; services BIC 21,2 % ; BNC non réglementé 25,6 % ; Cipav 23,2 % ; avec versement libératoire : 13,3 %, 22,9 %, 27,8 %, 25,4 % | https://entreprendre.service-public.gouv.fr/vosdroits/F36232 (vérifié le 01/01/2026) | [F] |
| Facturation électronique entre entreprises | « effective depuis le 1er septembre 2026 » (la page ne détaille pas le calendrier propre aux micro-entrepreneurs) | https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique | [F] ; échéance d'émission des TPE en 2027 [CI] |
| Vente B2C de services numériques dans l'UE | guichet unique OSS au-delà de 10 000 € de ventes transfrontalières dans l'UE ; un marchand officiel (Paddle, Polar, Gumroad) porte la TVA à la place du vendeur | — | [CI] |
| Influence commerciale | loi du 9 juin 2023 ; contrat écrit obligatoire au-delà de 1 000 € HT depuis le 1er janvier 2026 ; promotion de la mode ultra-express interdite au 1er janvier 2027 ; 40 % d'anomalies sur plus de 260 influenceurs contrôlés en 2024 | `market-france-europe.md` | [F2] |
| Contenus générés par IA | AI Act, article 50 (transparence) applicable depuis le 2 août 2026 ; fin de la période de grâce de marquage le 2 décembre 2026 | `market-france-europe.md` | [F2] |
| RGPD et moissonnage de données publiques | intérêt légitime possible sous conditions (recommandations CNIL de juin 2025) | `market-france-europe.md` | [F2, page non relue] |

Conséquence [H] : en France, le seuil de TVA de 37 500 € est le vrai « mur » d'un service vendu à des particuliers, puisque la TVA ne peut pas être répercutée sans perte de marge. En B2B, la TVA est neutre pour le client. C'est un argument de plus pour les archétypes B2B.

### 4.2 Maroc (dossier compagnon, sources primaires citées)

| Règle | Valeur | Source | Fiabilité |
|---|---|---|---|
| Auto-entrepreneur : plafonds | 500 000 DH (commerce, industrie, artisanat) ; 200 000 DH (services) | Guide DGI 2026 via Le Matin (2026-08-19) | [F2] |
| Auto-entrepreneur : impôt | 0,5 % (commerce) ou 1 % (services) du chiffre d'affaires encaissé | idem | [F2] |
| Règle du client unique | retenue à la source de 30 % au-delà de 80 000 DH par an et par client (prestataires de services) ; relèvement à 100 000 DH discuté dans le PLF 2027 | idem ; Wafir (2026-11-26) | [F2] ; PLF 2027 non confirmé |
| Dotation commerce électronique (IGOC 2026) | particulier : 20 000 DH/an ; société nouvelle ou peu imposée : 50 000 DH ; jeune entreprise innovante labellisée ADD : 2 000 000 DH | https://www.oc.gov.ma/sites/default/files/reglementation/pdf/2026-01/IGOC%202026.pdf | [F2] |
| Export de services | contrat obligatoire ; rapatriement sous 90 jours ; jusqu'à 70 % sur un compte en devises ; une personne physique non inscrite au registre du commerce et qui perçoit des revenus de source étrangère peut ouvrir un tel compte sur simple déclaration | idem | [F2] |
| Paiement à la livraison | 84,1 % des acheteurs en ligne ; 20 à 40 % de refus à la livraison | ANRT via Le360 ; `market-maroc-maghreb.md` | [F2] ; taux de refus [E] |
| TVA | prestations publicitaires des personnes physiques au-delà de 500 000 DH ; commerçants en ligne au-delà de 2 000 000 DH | Le360 (2026-05-14) | [F2] |
| Données personnelles | loi 09-08, CNDP : déclaration, autorisation, transfert à l'étranger | https://www.cndp.ma/ | [F2] |

Conséquences [H] :

- **Le plafond de 200 000 DH par an** pour les services, soit environ 1 500 € par mois au taux approximatif de 11 DH/€ [H], est atteint par toute agence ou tout SaaS qui réussit. La grille doit basculer vers un régime de société au-delà.
- **La retenue de 30 %** frappe le B2B local concentré sur un gros client. Son application à un client étranger n'est pas tranchée.
- **Vendre en devises à des résidents marocains** bute sur la dotation de 20 000 DH de chaque client. Il faut encaisser en dirhams (CMI, YouCan Pay, paiement à la livraison).

### 4.3 Afrique francophone subsaharienne

- Le mobile money est le rail grand public : 341 M de comptes actifs à 30 jours et 1 400 Md$ de valeur de transactions en Afrique selon PawaPay (année non précisée) [E].
- Le coût d'encaissement est bas : Wave 1 % [F], Flutterwave 2 % sur le mobile money [F]. En revanche, les cartes coûtent 4,8 % [F] et le revenu par client est faible [H].
- Pour l'export, Polar verse au Sénégal et en Côte d'Ivoire [F] ; Stripe couvre la Côte d'Ivoire via Paystack [F]. Pour l'Afrique centrale (Cameroun, RDC), aucun marchand officiel vérifié n'a été trouvé : question ouverte.
- YouTube : le Sénégal est éligible, pas la Côte d'Ivoire, le Cameroun ni la RDC [F]. Les archétypes « chaîne » y sont bloqués, sauf à monétiser par sponsoring ou affiliation.
- Fiscalité des micro-entrepreneurs (Sénégal, Côte d'Ivoire, Cameroun) : non recherchée, faute de budget [lacune].

### 4.4 Belgique, Suisse, Québec

- Belgique : même socle UE que la France ; TikTok Shop ouvert le 15 juin 2026 [F2]. Le régime fiscal des indépendants n'a pas été recherché [lacune].
- Suisse : hors UE (ni AI Act, ni DSA), franc suisse, TWINT ; pas de TikTok Shop trouvé [F2/H].
- Québec : Loi 25 (vie privée) et Charte de la langue française renforcée (loi 96), qui pèsent sur les clones localisés et le commerce en ligne [CI, non revérifié]. La disponibilité de TikTok Shop au Canada n'a pas été vérifiée [H].

---

## 5. Fiches par archétype

Colonnes du tableau maître : CAC = coût d'acquisition d'un client payant ; ARPU = revenu mensuel par client ; T1 = délai jusqu'au premier euro ; capital = dépenses en numéraire sur 6 mois ; temps = heures du fondateur sur 6 mois. Valeurs de base pour la France, **[H] sauf mention contraire**, ancrées sur les preuves de la colonne de droite.

| Archétype | CAC | ARPU | Marge brute | T1 | Capital | Temps | Risque plateforme / réglementaire | Levier Claude Code | Défendabilité | Ancrage principal |
|---|---|---|---|---|---|---|---|---|---|---|
| Micro-SaaS de niche | 50 à 300 € (contenu, SEO, communautés) | 15 à 60 € | 80 à 90 % | 6 à 12 sem. | 1 000 à 1 500 € | 500 h | faible | fort | moyenne | TrustMRR : 68,6 % sous 1 000 $ ; SEObot 49 $/mois |
| Clone localisé | 30 à 150 € | 10 à 40 € | 75 à 85 % | 8 à 14 sem. | 1 500 € | 500 h | moyen (l'original peut arriver) | très fort | faible à moyenne | YouCan (Shopify + paiement à la livraison) ; décalage de 2 à 4 ans |
| Outil IA vertical pour TPE / PME | 100 à 400 € (prospection directe) | 49 à 300 € | 70 à 80 % | 3 à 6 sem. | 1 200 € | 450 h | faible | fort | moyenne à forte | réceptionnistes IA à 49-450 $/mois [E] ; facture électronique 2026 |
| Agent WhatsApp et commerce conversationnel | 100 à 300 € (B2B) | 50 à 250 € + messages | 55 à 75 % | 3 à 6 sem. | 1 500 € | 450 h | **fort** (règles Meta, tarifs par pays) | fort | faible à moyenne | DM Champ 48,50-248,50 $/mois ; tarifs au message |
| SEO programmatique et annuaires | ~0 (trafic organique) | publicité, affiliation, fiches payantes | 85 à 95 % | 12 à 24 sem. | 500 à 1 000 € | 300 h | **très fort** (Google, AI Overviews) | très fort | faible | Directory Launch 211 $ ; Pew 15 % vers 8 % de clics |
| Visibilité dans les moteurs IA (GEO / AEO) | 100 à 500 € | 300 à 2 000 € (audit puis suivi) | 60 à 80 % | 2 à 4 sem. | 900 € | 400 h | moyen (mesure floue, surpromesse) | fort | faible à moyenne | AEO Engine, Rank Prompt, ChatSEO |
| Newsletter ou média de niche | 1 à 5 € par abonné gratuit | sponsoring ; 0,62 % de conversion payante | 80 à 90 % | 12 à 24 sem. | 600 € | 400 h | faible | moyen | forte (audience détenue) | beehiiv 0 % ; conversion 0,62 % [E] |
| Chaîne sans visage avec voix IA | ~0 | 1 à 5 $ de RPM [CI] | 80 à 90 % | 20 à 40 sem. (seuil du YPP) | 900 € | 400 h | **très fort** (politique « inauthentic ») | fort | très faible | politique YouTube du 15/07/2025 |
| Produits numériques (modèles, formations) | 0 à 20 € | achat unique de 9 à 300 € | 85 à 95 % | 1 à 4 sem. | 300 € | 200 h | faible à moyen | moyen | faible | Gumroad 10 % + 0,50 $ ; Chariow ≈ 25 $ par créateur |
| Boutique Shopify de marque | 15 à 60 € par commande (publicité) | panier de 30 à 80 € | 15 à 30 % de contribution après publicité | 4 à 8 sem. | 3 000 à 8 000 € (stock et publicité) | 500 h | moyen | moyen | moyenne (marque) | Shopify 39 $/mois + 2 % hors Shopify Payments |
| Affiliation TikTok Shop | ~0 (temps) | commission moyenne d'environ 13 % [E] | ~90 % | 4 à 8 sem. | 300 € | 400 h | **fort** (algorithme, règles) | faible | très faible | top 0,5 % = 38 % des commissions [E] |
| Extension Chrome | ~0 à 50 € | 3 à 15 € | 85 à 95 % | 8 à 12 sem. | 300 € | 250 h | moyen (règles du store, pas de paiement natif) | très fort | faible | ExtensionPay 5 %, 800 k$ cumulés [E] |
| App mobile virale | coût d'installation > 0,31 $ de revenu par installation à 60 jours | 5 à 15 € | 60 à 75 % (15 % au store) | 6 à 10 sem. | 2 500 € | 400 h | moyen (revue d'Apple) | fort | faible | RevenueCat : médiane 72 $/mois à 1 an |
| Serveurs MCP, plugins, skills vendus | ~0 (annuaires) | 5 à 50 € via API ou SaaS | 75 à 85 % | 8 à 12 sem. | 600 € | 250 h | moyen (pas de rail de vente natif) | **maximal** | faible | Apify 20 % ; PosteAhora 186 $ ; Postiz 533 k$ |
| Agence d'automatisation IA | 200 à 800 € (prospection) | 1 500 à 5 000 € par projet + forfait mensuel | 40 à 60 % | 2 à 4 sem. | 600 € | 600 h + 90 h/mois | faible | fort | moyenne (relation) | Upwork : travail IA +40 % [F2] |
| Agence export (depuis MA ou l'Afrique vers FR/UE) | 200 à 800 € | idem, prix 20 à 40 % sous Paris [H] | 40 à 60 % | 3 à 6 sem. | 600 € | 600 h + 90 h/mois | faible ; change et statut au Maroc | fort | faible à moyenne | IGOC 2026 export ; offshoring marocain |
| Place de marché de niche | élevé des deux côtés | commission de 5 à 15 % | 75 à 85 % | 16 à 30 sem. | 2 500 € | 600 h | faible à moyen | moyen | **forte si liquidité** | multiples Acquire 3,9 fois le profit [E] |
| Communauté payante | 0 à 50 € (si audience) | 20 à 50 € | 80 à 90 % | 4 à 8 sem. | 400 € | 400 h | faible | faible | forte | Skool : médiane de 27 $ × 205 membres [E] |
| Produits de données et API | 50 à 200 € (développeurs) | 20 à 500 € à l'usage | 60 à 80 % (proxys, scraping) | 4 à 8 sem. | 1 500 € | 350 h | moyen (conditions d'utilisation des sources, RGPD) | très fort | forte (jeu de données propre) | SoldComps 27 k$, 1Lookup 540 k$ sur 30 jours |

Les cas de revenu ci-dessous viennent des fiches publiques TrustMRR (https://trustmrr.com/startup/<slug>.md, lues le 2026-11-28). Ce revenu est calculé à partir des enregistrements du fournisseur de paiement **[F pour la donnée, E pour l'activité réelle]**. TrustMRR ne précise pas si l'entreprise est solo. « 30 j » = encaissement sur les 30 derniers jours.

### 5.1 Micro-SaaS de niche

- **Économie** : récurrence et marge de 80 à 90 % ; l'enjeu est la distribution, pas le code. La multiplication de l'offre (App Store +84 %, téléchargements +2 % [E]) déplace la valeur vers le canal.
- **Références** : SEObot (John Rush, fiche Turquie), 49 $/mois, 30 185 $ sur 30 j, 1,95 M$ cumulés [F]. Podawaa (France, outil LinkedIn créé en juin 2024), 54 890 $ sur 30 j, 1,29 M$ cumulés [F]. POST BRIDGE (Canada, publication multi-réseaux), 46 916 $ sur 30 j [F]. uhoh.com (Canada, service d'assistance informatique « priced by you »), 43 558 $ sur 30 j [F].
- **Contre-exemples** : MAC+ et Tack+ (France) [F] ; 68,6 % des fiches TrustMRR sous 1 000 $ [F].
- **Risques** : faibles côté plateforme ; churn mensuel élevé en grand public [H].
- **Adéquation par pays** : export B2B en euros ou en dollars depuis n'importe quel pays francophone, à condition d'avoir un marchand officiel. Au Maroc : Paddle (non exclu), PayPal ou société étrangère. Au Sénégal et en Côte d'Ivoire : Polar.
- **Niche et lifestyle** : outils pour créateurs francophones, artisans, freelances, cabinets ; outils de conformité française (facture électronique, contrat d'influence au-delà de 1 000 € HT).
- **Apport de Claude Code** : construction en quelques jours avec Vercel et Supabase (connecteurs officiels), paiement via marchand officiel, tâches planifiées cloud pour le contenu SEO et le suivi.

### 5.2 Clones localisés

- **Économie** : on réduit le risque produit en copiant un modèle validé aux USA ; la valeur vient de l'adaptation des rails (paiement à la livraison, mobile money, darija, TVA, langue).
- **Références** : YouCan, fondée à Rabat en 2020, est l'adaptation marocaine du modèle Shopify, avec paiement à la livraison natif [F2]. La diffusion USA vers Maroc d'un modèle prend 2 à 4 ans, avec mutation [F2]. Lovable, européen, est passé à 400 M$ d'ARR [F2].
- **Contre-exemples** : en France, le clone rencontre l'original 5 à 19 mois après le lancement US (fonctionnalités de plateforme) [F2]. La fenêtre est courte.
- **Risques** : arrivée de l'original, propriété intellectuelle (marques, design) [H].
- **Adéquation par pays** : bonne au Maroc et en Afrique, où les rails divergent ; moyenne en France ; Québec à vérifier (loi 96).
- **Apport de Claude Code** : traduction et localisation de l'interface, intégration des passerelles locales (YouCan Pay, Wave, PawaPay), tests.

### 5.3 Outils IA verticaux pour TPE / PME

- **Économie** : vente directe à des métiers (artisans, cabinets, commerces) ; prix de 49 à 300 €/mois ; acquisition coûteuse mais rétention forte quand l'outil s'intègre au flux de travail [H].
- **Références** : réceptionnistes vocaux IA pour artisans à 49 à 450 $/mois ; 35,8 % des 40 166 appels entrants restent sans réponse [E, `trends-us-business.md`]. Conductor (API QuickBooks Desktop), 52 398 $ sur 30 j [F].
- **Déclencheurs francophones** : facture électronique généralisée depuis le 1er septembre 2026 [F] ; vague de cessions de PME (« Objectif Reprises », avril 2026) [F2].
- **Risques** : responsabilité en cas d'erreur (santé, droit, finance) ; AI Act (transparence) [F2].
- **Adéquation par pays** : très bonne en France, Belgique et Suisse ; bonne au Maroc pour les commerçants en paiement à la livraison, clientèle B2B solvable [F2] ; plus faible en Afrique subsaharienne (revenu par client).
- **Apport de Claude Code** : agents ElevenLabs (voix, téléphonie, WhatsApp) pilotables par connecteur, CRM et facturation (QuickBooks) via connecteurs, déploiement rapide.

### 5.4 Agents WhatsApp et commerce conversationnel

- **Économie** : prix mensuel au marchand, plus refacturation des messages. Le coût LLM est négligeable (moins de 0,011 $ par conversation sur Sonnet 5.5) ; le coût Meta (au message, par pays) et le support dominent [F].
- **Règles 2026** : assistants IA généralistes interdits depuis le 15 janvier 2026, sauf dans les marchés où Meta est légalement tenu de les accepter (Italie, autres pays de l'UE et de l'EEE, Brésil, Turquie, selon la politique tarifaire AI Providers) [F]. Un agent *propre à une entreprise* (vente, support, confirmation de commande) reste permis, l'IA étant « incidente ». Messages de service payants au-delà de 1 000 par mois depuis le 1er octobre 2026 [F]. Hausses de tarifs au Maroc le 1er octobre 2026 [F].
- **Références** : DM Champ (Pays-Bas, agent IA de vente en marque blanche « Start an AI Agency This Week »), 24 004 $ sur 30 j pour 135 927 $ de MRR affiché, données du 18 novembre 2026 [F]. L'écart entre MRR et encaissement est à vérifier.
- **Contre-exemple** : un produit d'assistant IA généraliste sur WhatsApp (type « ChatGPT dans WhatsApp ») est désormais interdit hors UE, Brésil et Turquie [F].
- **Adéquation par pays** : **la meilleure au Maroc** (WhatsApp à 83 %, confirmation des commandes en paiement à la livraison, 20 à 40 % de refus à réduire [F2]) et en Afrique ; bonne en France pour le commerce local.
- **Niche et lifestyle** : commerçants en paiement à la livraison, restaurants, cliniques, auto-écoles, diaspora (envois, immobilier).
- **Apport de Claude Code** : les connecteurs ElevenLabs exposent des comptes WhatsApp, des numéros de téléphone et des appels sortants pour les agents (outils visibles dans cette session) [F, observation directe] ; mise en place en quelques jours [H].

### 5.5 SEO programmatique et annuaires

- **Économie** : coût d'acquisition quasi nul, mais monétisation lente et fragile.
- **Règles** : depuis le 5 mars 2024, Google sanctionne l'abus de contenu à grande échelle (« many pages… generated for the primary purpose of manipulating search rankings »), l'abus de réputation de site (en vigueur le 5 mai 2024) et l'abus de domaines expirés [F]. Quand un résumé IA apparaît, les clics sur les résultats classiques passent de 15 % à 8 % des visites, et 1 % des visites cliquent un lien du résumé (Pew, 900 adultes, mars 2025) [F]. AI Overviews sur plus de 40 % des recherches, en France depuis juillet 2026 [E, F2].
- **Références** : les outils gagnent mieux que les sites : SEObot (30 185 $ sur 30 j) [F] et Indexsy (Canada, services SEO depuis 2015, 65 091 $) [F].
- **Contre-exemples** : Directory Launch, 211 $ sur 30 j ; TapRefer, 675 $ [F].
- **Adéquation par pays** : partout, mais le français et la darija offrent moins de requêtes [H] ; risque maximal.
- **Apport de Claude Code** : génération de pages et de données en masse. C'est précisément ce que la politique de Google vise : le levier est réel mais retourné contre l'archétype.

### 5.6 Visibilité dans les moteurs IA (GEO / AEO)

- **Économie** : audit puis suivi mensuel ; vente rapide à des PME inquiètes de leur trafic.
- **Références** : AEO Engine (« agence SEO IA », fiche créée en 2018), 182 247 $ sur 30 j [F]. Rank Prompt (créé en mai 2025), 45 456 $ [F]. reddit-agency (« ChatGPT recommandera votre marque ou vous ne payez pas »), 63 250 $ [F]. **ChatSEO (France, créé le 29 novembre 2025), 63 301 $ sur 30 j et 342 774 $ cumulés en un an** [F]. Profound a levé 96 M$ en février 2026 [F2].
- **Risques** : mesure instable (réponses non déterministes), promesse invérifiable, droit de la consommation et pratiques commerciales trompeuses [H].
- **Adéquation par pays** : bonne en France, Belgique et Suisse ; correcte au Maroc (PME francophones, tourisme) ; faible en Afrique subsaharienne (budgets).
- **Apport de Claude Code** : sondes automatisées sur plusieurs assistants, rapports en Artifacts, tâches planifiées.

### 5.7 Newsletters et médias de niche

- **Économie** : l'audience appartient à l'éditeur (défendabilité), mais la conversion payante est faible (médiane de 0,62 % [E]). Le sponsoring domine dans les petits marchés.
- **Calcul** : 10 000 abonnés gratuits × 0,62 % × 10 $ ≈ 620 $/mois [E, calcul].
- **Références** : beehiiv ne prend rien sur les abonnements (gratuit jusqu'à 2 500 abonnés) [F]. Substack revendique 5 M d'abonnements payants et a nommé une responsable France [F2]. Le marché français des newsletters payantes a plus de 48 mois de retard [F2].
- **Adéquation par pays** : France et Québec ; au Maroc, une chaîne WhatsApp joue le rôle de newsletter, mais l'abonnement payant y est faible [F2].
- **Niche et lifestyle** : repreneurs de PME, finances personnelles (encadrement AMF), immigration au Québec (TCF / TEF).

### 5.8 Chaînes sans visage avec voix IA

- **Règles** : depuis le 15 juillet 2025, la politique « inauthentic content » exclut de la monétisation les contenus « mass-produced, generic, repetitive » [F]. Un contenu synthétique réaliste doit être signalé ; une voix off clonée de sa propre voix n'a pas à l'être [F]. AI Act, article 50, depuis le 2 août 2026 [F2]. Seuils d'entrée au YPP [CI].
- **Références** : les outils pour ces chaînes encaissent : faceless.so (« générez des vidéos de niche »), 51 811 $ sur 30 j ; VidAI, 43 150 $ ; Faceless Vidz, en vente, affiche +13 149 % de croissance sur 30 jours, sur une base minime [F].
- **Contre-exemple structurel** : délai long jusqu'au premier revenu (seuil du YPP) et risque de démonétisation de toute la chaîne.
- **Adéquation par pays** : bloquée en Côte d'Ivoire, au Cameroun et en RDC (pas de YPP) [F] ; RPM local faible au Maroc (CPM de 0,3 à 0,5 $ contre environ 5 $ pour une audience France ou Canada [E, `concurrence-positionnement.md`]).
- **Apport de Claude Code** : chaîne ElevenLabs et Canva (connecteurs disponibles) ; c'est l'archétype où l'automatisation est la plus forte et la plus pénalisée.

### 5.9 Produits numériques (modèles, formations)

- **Économie** : premier revenu rapide, marge de 90 %, mais saturation et faible récurrence.
- **Références** : CodeFast, formation de Marc Lou, 839 k$ cumulés mais MRR nul [F]. Chariow, plateforme africaine en mobile money : plus de 200 000 créateurs et plus de 5 M$ reversés, soit environ 25 $ par créateur [E]. Gumroad : 10 % + 0,50 $ [F].
- **Adéquation par pays** : très bonne en Afrique francophone grâce aux rails mobile money (Chariow) ; bonne en France ; au Maroc, encaisser en dirhams.
- **Apport de Claude Code** : connecteur Shopify « digital products », génération de supports avec Canva [F, observation directe des outils].

### 5.10 Boutiques Shopify de marque

- **Économie** : la marge de contribution après publicité est faible (15 à 30 % [H]) et le besoin de capital le plus élevé (stock, publicité). Shopify : 39 $/mois en Basic, et 2 % de surcommission si Shopify Payments est indisponible [F].
- **Maroc** : Shopify Payments absent ; YouCan est moins cher à l'usage (0,5 % du paiement à la livraison) [F]. Chaîne publicité TikTok, formulaire, confirmation WhatsApp, paiement à la livraison ; coût par prospect de 8 à 25 MAD et confirmation de 55 à 75 % selon les agences (non vérifié) [F2/E].
- **France** : climat défavorable aux plateformes extra-européennes (contrôles DGCCRF : 75 % de produits non conformes) [F2]. C'est un avantage pour les marques locales conformes.
- **Contre-exemple** : le « 90 % des boutiques échouent » souvent cité n'a pas de source primaire trouvée ; on retient le taux de survie du BLS.
- **Apport de Claude Code** : le connecteur Shopify crée la boutique, les collections, les remises et le thème (outils `create_store`, `theme_*`) [F, observation directe].

### 5.11 Affiliation TikTok Shop

- **Économie** : pas de stock, commission moyenne d'environ 13 % (5 % sur l'électronique, 30 % sur la beauté) [E] ; revenus extrêmement concentrés (le top 0,5 % capte 38 % [E]).
- **Disponibilité** : France (depuis le 31 mars 2025, plus de 33 000 vendeurs en mars 2026, live à 20 % des ventes [F2]) ; Belgique (depuis le 15 juin 2026) [F2] ; absente au Maroc, en Afrique et, à notre connaissance, en Suisse [F2/H].
- **Réglementation française** : loi influenceurs, contrat écrit au-delà de 1 000 € HT [F2].
- **Apport de Claude Code** : faible ; le goulot est la présence à l'écran et le live.

### 5.12 Extensions Chrome

- **Économie** : développement rapide, mais pas de paiement natif (Chrome Web Store payments fermé en 2021) ; ExtensionPay prélève 5 % sur Stripe, donc inaccessible directement depuis le Maroc [F].
- **Ordre de grandeur** : « plus de 800 000 $ » cumulés via ExtensionPay [E]. Le marché payant des extensions est petit.
- **Apport de Claude Code** : très fort (code, tests, publication).

### 5.13 Apps mobiles virales

- **Économie** : le revenu par installation médian est d'environ 0,31 $ à 60 jours [F]. L'acquisition payante n'est rentable que pour une minorité ; la viralité organique (TikTok) est le seul canal réaliste [H]. Les apps IA gagnent 41 % de plus par payeur mais perdent leurs abonnés plus vite [F].
- **Références** : une app française (fiche anonyme, RevenueCat), 72 793 $ sur 30 j, lancée en janvier 2026 [F]. Verbi (Canada, pratique orale de langues), 14 338 $ sur 30 j [F].
- **Contre-exemples** : app médiane à 72 $/mois [F] ; Sora -45 % [E] ; Apple a retiré Replit, Vibecode et Anything [E].
- **Apport de Claude Code** : fort pour construire ; nul sur la revue d'Apple et la viralité.

### 5.14 Serveurs MCP, plugins et skills Claude vendus

- **Économie** : aucun rail de vente dans l'annuaire Claude [F2]. Les voies existantes : Apify (paiement à l'événement, 20 % de commission, coûts déduits [F]), ou un SaaS / une API à clé exposée en MCP.
- **Références** : Postiz (fiche Hong Kong), open source, planification sociale avec agents et connecteur listé dans l'annuaire claude.com, 533 727 $ sur 30 j et +46 % de MRR sur 30 jours [F]. TrustMRR expose lui-même un MCP public [F].
- **Contre-exemple** : PosteAhora, « planificateur social conçu pour les agents IA », 186 $ sur 30 j [F].
- **Lecture** : le MCP est un canal de distribution (être appelé par les agents), pas un produit. Archétype à levier maximal et à défendabilité minimale.

### 5.15 Agence d'automatisation IA (et variante export)

- **Économie** : premier revenu rapide, prix élevés, faible capital ; le temps du fondateur est le coût principal (marge de 40 à 60 %).
- **Références** : Upwork, T1 2026 : travail lié à l'IA +40 %, 8 % du volume brut ; recul le plus fort sur les contrats de moins de 500 $ [F2]. Les indépendants qui utilisent l'IA gagnent 34 % de plus de l'heure [E]. AEO Engine et Indexsy sont des agences [F].
- **Variante export** : coût d'opportunité au Maroc et en Afrique francophone de 3 à 6 €/h [H], contre environ 25 €/h en France [H] ; même langue et même fuseau horaire. L'IGOC 2026 encadre l'export de services : contrat, rapatriement sous 90 jours, 70 % en devises [F2].
- **Contraintes** : plafond auto-entrepreneur de 200 000 DH, puis société [F2] ; offshoring marocain (167 380 emplois, 27,08 Md DH d'exports en 2025) comme vivier et comme concurrence [F2].

### 5.16 Places de marché de niche

- **Économie** : défendabilité forte si la liquidité est atteinte, mais l'œuf et la poule rendent le premier revenu le plus lent de la liste (16 à 30 semaines [H]).
- **Références** : TrustMRR (« accidentally a startup marketplace »), 35 k$ sur 30 j, 432 k$ cumulés [F]. Rachat de micro-SaaS : multiple médian de 3,9 fois le profit, 81 jours de mise en vente (Acquire 2025) [E, F2].
- **Adéquation** : niches B2B locales (artisans, sous-traitance) ; au Maroc, intermédiation via WhatsApp et paiement à la livraison [H].

### 5.17 Communautés payantes

- **Économie** : récurrence, marge de 85 %, défendabilité par la relation ; dépend d'une audience préexistante (levier Claude Code faible).
- **Références** : Skool : Hobby 9 $ + 10 %, Pro 99 $ + 2,9 % [F] ; communauté médiane en tendance : 27 $ × 205 membres, soit environ 5 500 $/mois brut, sur un échantillon déjà sélectionné [E]. Interface en français depuis août 2026, facturation en dollars seulement [F2].
- **Adéquation** : France et Québec (immigration, TCF / TEF, reprise d'entreprise) ; Maroc (facturation en dollars limitée par la dotation de 20 000 DH) ; Afrique (encaisser en mobile money via Chariow ou WhatsApp).

### 5.18 Produits de données et API

- **Économie** : à l'usage, clients développeurs ou analystes ; coûts de proxy et de collecte ; défendabilité par un jeu de données propre.
- **Références** : 1Lookup (76 produits de données sous une clé API), 540 150 $ sur 30 j [F]. SoldComps (Canada, données des ventes réalisées sur eBay pour revendeurs, créé en mars 2025), 27 456 $ [F]. **StoreRadar (France, fichier de toutes les boutiques Shopify à 149 $), 4 444 $ sur 30 j** [F]. Web3forms (API de formulaires), 47 541 $ [F].
- **Risques** : conditions d'utilisation des sources, RGPD (intérêt légitime sous conditions) [F2], CNDP au Maroc [F2].
- **Apport de Claude Code** : très fort (collecteurs, normalisation, API, documentation), et vente possible en acteur Apify.

---

## 6. Ce que Claude Code rend possible fin 2026, et ce qu'il ne change pas

**Possible [F, sauf mention].**

- **Connecteurs d'exécution disponibles dans cette session** (observation directe des outils exposés) :
  - Vercel : projets, déploiements, domaines, achat de domaine ;
  - Supabase : création de projet, migrations, fonctions edge ;
  - Shopify : création de boutique, produits numériques, thèmes, remises, analytique ;
  - Postiz : planification et analytique de publications ;
  - Canva : génération de designs et de vidéos ;
  - ElevenLabs : synthèse vocale, agents conversationnels avec comptes WhatsApp, numéros et appels sortants ;
  - Gmail, Google Calendar, QuickBooks, Hugging Face, GitHub.
- **Exécution récurrente** : tâches planifiées cloud (intervalle minimum d'une heure, 100 exécutions par heure et par compte, en *research preview*) ; publication de rapports en Artifacts [F2, `claude-code-plugins.md`].
- **Agents hébergés** : Claude Managed Agents à 0,08 $ par heure de session plus les jetons [F].
- **Coût marginal d'un agent conversationnel** : moins de 0,001 $ par conversation sur Haiku 5.5 [F, calcul].

**Inchangé [H, appuyé par les preuves].**

- La distribution reste le goulot : la production d'apps double, les téléchargements stagnent [E].
- Les plateformes pénalisent l'automatisation de masse : YouTube, Google, Meta [F].
- La conformité locale (statut, change, TVA, CNDP, AI Act) ne s'automatise pas.

**Conséquence pour la grille** : le « levier Claude Code » est un critère, pas le critère. Il pèse 15 %, contre 20 % pour la défendabilité et 35 % pour le retour ajusté.

---

## 7. Adéquation par niche et lifestyle (lecture qualitative)

| Lifestyle / segment | Pays où il paie | Archétypes adaptés | Preuve ou hypothèse |
|---|---|---|---|
| Dirigeants de TPE et artisans pressés | France, Belgique, Suisse, Québec | outils IA verticaux, GEO, agence | réceptionnistes IA [E] ; facture électronique [F] |
| Commerçants en paiement à la livraison | Maroc, Afrique de l'Ouest | agent WhatsApp, outils de confirmation, créatifs en darija | 84,1 % de paiement à la livraison, 20 à 40 % de refus [F2] |
| Diaspora marocaine et africaine | France, Belgique, Québec (pouvoir d'achat en euros ou en dollars) | médias de niche, communautés, services à distance | transferts des MRE : 122 Md DH en 2025 [F2] |
| Créateurs et infopreneurs francophones | France, Québec, Afrique de l'Ouest | communautés, produits numériques, outils pour créateurs | Chariow [E] ; Skool en français [F2] |
| Candidats à l'immigration (TCF / TEF) | Québec et Canada, avec une demande au Maghreb et en Afrique | communauté, app de pratique orale | communauté Skool « Slow French » [F2] ; Verbi [F] |
| Repreneurs et cédants de PME | France | newsletter d'annonces, outils de diagnostic | « Objectif Reprises » [F2] |
| Freelances du numérique | Maroc, Sénégal, Côte d'Ivoire | agence export, micro-SaaS export | 463 383 auto-entrepreneurs au Maroc [F2] |
| Jeunes urbains (TikTok) | France (TikTok Shop) | affiliation, live | 33 000 vendeurs [F2] |

---

## 8. Grille de scoring du rendement

### 8.1 Formules

Pour un archétype *a* dans un pays *c*, sur un horizon de 24 mois :

```
Pay(a,c)    = coefficient d'encaissement du rail dominant de a dans c (0 = rail indisponible -> archétype BLOQUÉ)
ARPU(a,c)   = 1 si a vend à l'export (EUR/USD), sinon ppp(c)          (France = 1)
R_net(a,c)  = Rs(a) × ARPU(a,c) × m(a) × (1 - tax(c, régime(a)))      revenu mensuel net à M12 en cas de succès
Mois(a)     = max(0, 12 - T1(a)/4,33)/2 + 12 × RET                    rampe linéaire de T1 à M12, puis année 2 à RET = 0,85
E24(a,c)    = p12(a) × FIT(a,c) × Pay(a,c) × (1 - Rp(a)) × R_net(a,c) × Mois(a)     espérance de revenu net
Coût(a,c)   = 2 × C(a)  +  (h(a) + 18 × hrun(a)) × w(c)               numéraire + temps valorisé au coût d'opportunité local
ROI(a,c)    = (E24 - 2 × C) / Coût                                     retour attendu ajusté du risque

Sous-scores dans [0 ; 1] :
s_ROI = 0,5 + 0,5 × tanh(ROI)
s_T1  = exp(-T1 / 12 semaines)
s_L   = L(a)                       levier Claude Code
s_D   = D(a) / 5                   défendabilité
s_C   = 1 - log10(1 + C) / log10(1 + 10 000)

Score(a,c) = 100 × (0,35 s_ROI + 0,15 s_T1 + 0,15 s_L + 0,20 s_D + 0,15 s_C)
```

Paramètres (tous [H], à calibrer par l'outil) :

- *p12* : probabilité d'atteindre au moins 1 000 € nets par mois à M12, ancrée sur RevenueCat (17,3 % en deux ans pour 1 000 $) et sur TrustMRR (31,4 % au-dessus de 1 000 $ dans un échantillon auto-sélectionné) ;
- *Rs* : revenu mensuel médian des cas réussis, non du top ;
- *m* : marge brute ;
- *Rp* : perte attendue liée aux plateformes et à la réglementation ;
- *L* : levier Claude Code ; *D* : défendabilité ;
- *ppp* : multiplicateur de pouvoir d'achat ; *w* : coût d'opportunité horaire ;
- *tax* : prélèvement du régime. France : valeurs vérifiées (25,6 % en BNC, 12,3 % en vente) ; Maroc : 1 % ou 0,5 % [F2] ; autres pays [H].

Le code de référence se trouve dans `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/scripts_eco/score.py` ; les résultats sont dans `scores.json` et `scores_out.md`, dans le même dossier.

Coefficients d'encaissement retenus (extrait) : Maroc, export B2B 0,70, B2B local 0,80, grand public local 0,50, YouTube 0,90, TikTok Shop 0 ; UEMOA, export 0,60, grand public local 0,70, YouTube 0,40 (Sénégal oui, Côte d'Ivoire non), TikTok Shop 0 ; Afrique centrale, YouTube 0, TikTok Shop 0 ; Suisse, TikTok Shop 0 ; Québec, TikTok Shop 0,5 (inconnu).

### 8.2 Résultats (score sur 100)

| Archétype | France | Belgique | Suisse | Québec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) |
|---|---|---|---|---|---|---|---|
| Micro-SaaS de niche | 49,6 | 49,6 | 49,6 | 49,7 | 50,2 | 48,8 | 46,4 |
| Clone localisé | 45,7 | 46,1 | 46,6 | 46,0 | 42,1 | 40,7 | 39,4 |
| Outil IA vertical TPE / PME | 54,9 | 55,1 | 55,6 | 54,9 | 51,4 | 48,5 | 47,2 |
| Agent WhatsApp | 48,4 | 48,5 | 49,2 | 48,5 | 45,1 | 42,7 | 41,4 |
| SEO programmatique et annuaires | 40,5 | 40,5 | 41,2 | 40,5 | 36,7 | 35,0 | 33,8 |
| GEO / AEO | 53,4 | 53,7 | 53,9 | 53,5 | 50,4 | 47,4 | 46,1 |
| Newsletter / média | 47,6 | 47,6 | 47,9 | 47,6 | 45,3 | 44,3 | 43,3 |
| Chaîne sans visage | 34,9 | 34,9 | 35,4 | 34,9 | 32,3 | 30,9 | bloqué |
| Produits numériques | 50,2 | 50,0 | 50,1 | 49,9 | 46,8 | 45,9 | 44,6 |
| Boutique Shopify de marque | 40,8 | 40,8 | 42,1 | 40,8 | 35,6 | 34,3 | 33,5 |
| Affiliation TikTok Shop | 40,2 | 40,2 | bloqué | 40,0 | bloqué | bloqué | bloqué |
| Extension Chrome | 48,0 | 48,0 | 47,9 | 48,1 | 48,4 | 47,6 | 46,0 |
| App mobile virale | 40,3 | 40,3 | 41,2 | 40,4 | 37,0 | 35,4 | 34,4 |
| MCP, plugins, skills | 47,2 | 47,2 | 47,6 | 47,2 | 45,0 | 43,6 | 42,2 |
| Agence d'automatisation IA | 56,9 | 57,2 | 57,2 | 57,0 | 56,0 | 53,5 | 52,5 |
| Agence export (vers FR / UE) | 51,0 | 51,0 | 50,3 | 51,2 | 55,9 | 56,3 | 54,5 |
| Place de marché de niche | 44,5 | 44,5 | 45,3 | 44,5 | 40,3 | 38,8 | 37,8 |
| Communauté payante | 53,6 | 53,8 | 53,7 | 53,7 | 50,4 | 49,9 | 48,5 |
| Données et API | 55,0 | 55,0 | 55,4 | 55,1 | 53,2 | 51,5 | 49,4 |

Espérance de revenu net sur 24 mois (E24) et retour ajusté (ROI), extrait :

| Archétype | E24 France | ROI France | E24 Maroc | ROI Maroc | E24 UEMOA | ROI UEMOA |
|---|---|---|---|---|---|---|
| Agence d'automatisation | 14 862 € | 0,24 | 3 955 € | 0,19 | 1 618 € | 0,04 |
| Agence export | 7 846 € | 0,12 | 7 308 € | **0,42** | 5 694 € | **0,45** |
| GEO / AEO | 9 289 € | 0,19 | 1 978 € | 0,02 | 607 € | -0,15 |
| Communauté payante | 6 252 € | 0,19 | 832 € | 0,00 | 681 € | -0,02 |
| Outil IA vertical | 6 323 € | 0,12 | 1 683 € | -0,08 | 688 € | -0,24 |
| Micro-SaaS | 3 130 € | 0,03 | 2 915 € | 0,06 | 2 272 € | -0,02 |
| Boutique Shopify | 1 741 € | -0,17 | 244 € | -0,50 | 161 € | -0,60 |
| Chaîne sans visage | 532 € | -0,04 | 159 € | -0,19 | 39 € | -0,28 |

### 8.3 Classement par pays (top 6)

- **France** : agence d'automatisation (56,9), données et API (55,0), outil IA vertical (54,9), communauté payante (53,6), GEO (53,4), agence export (51,0).
- **Belgique** : agence d'automatisation (57,2), outil IA vertical (55,1), données et API (55,0), communauté (53,8), GEO (53,7), agence export (51,0).
- **Suisse** : agence d'automatisation (57,2), outil IA vertical (55,6), données et API (55,4), GEO (53,9), communauté (53,7), agence export (50,3).
- **Québec** : agence d'automatisation (57,0), données et API (55,1), outil IA vertical (54,9), communauté (53,7), GEO (53,5), agence export (51,2).
- **Maroc** : agence d'automatisation (56,0), agence export (55,9), données et API (53,2), outil IA vertical (51,4), GEO (50,4), communauté (50,4).
- **UEMOA (Sénégal, Côte d'Ivoire)** : agence export (56,3), agence d'automatisation (53,5), données et API (51,5), communauté (49,9), micro-SaaS (48,8), outil IA vertical (48,5).
- **Afrique centrale (Cameroun, RDC)** : agence export (54,5), agence d'automatisation (52,5), données et API (49,4), communauté (48,5), outil IA vertical (47,2), micro-SaaS (46,4).

**Robustesse** (1 000 tirages Monte-Carlo ; *p12*, *Rs*, *T1*, *C*, *h* et *hrun* tirés entre 50 % et 150 % de leur valeur, *L* et *D* à ±30 %) :

- France : l'agence est dans le top 3 dans 77 % des tirages, l'outil IA vertical dans 58 %, les données et API dans 57 %, la communauté dans 41 %, le GEO dans 38 %.
- Maroc : agence locale 78 %, agence export 73 %, données et API 48 %.
- UEMOA : agence export 83 %, agence locale 70 %, données et API 47 %.

Les **derniers rangs** sont stables partout : chaîne sans visage, SEO programmatique, boutique Shopify, app mobile virale, place de marché.

### 8.4 Limites de la grille

- Les paramètres d'archétype sont des hypothèses ancrées, pas des mesures de cohorte. L'outil doit les recalibrer avec ses propres données (section 9).
- La grille ignore la compétence et l'audience préexistantes du fondateur. Une communauté payante n'a de sens que si l'audience existe : il faut ajouter un multiplicateur « actifs du fondateur ».
- Les plafonds de régime (200 000 DH au Maroc, 83 600 € et seuil de TVA en France) ne sont pas encore appliqués comme bascule automatique de régime.
- Les agences sont avantagées par un premier revenu rapide, mais restent un emploi : elles mobilisent 90 h par mois dans le modèle. On peut en tenir compte en augmentant la pondération de la défendabilité ou en ajoutant un critère « scalabilité ».

---

## 9. Implications pour l'outil

1. **Modèle de donnée « revenu observé »** : type de métrique (encaissement sur 30 jours, MRR, cumul), fournisseur de paiement, date de synchronisation, source. Rejeter toute observation non synchronisée depuis plus de 60 jours, et ne jamais classer sur le MRR seul (écarts de 1 à 6 relevés).
2. **Brancher TrustMRR comme source de signaux et de taux de base.** Le point public `https://trustmrr.com/api/ai/discovery` a été testé ; il renvoie 25 ajouts récents et 25 plus fortes croissances. Il existe aussi des fiches Markdown par startup et un MCP. Plancher de base obligatoire : les croissances publiques atteignent +6 674 495 % sur des bases minuscules. Corriger le biais de sélection avec la distribution de `/stats`.
3. **Fichier de règles daté par pays et par rail** (`rules/payments.yaml`, `rules/tax.yaml`), chaque ligne portant son URL et sa date de vérification : disponibilité de Stripe, Shopify Payments, Polar, Paddle, YPP et TikTok Shop ; plafonds micro et auto-entrepreneur ; seuils de TVA ; dotations IGOC. Un rail à 0 **bloque** l'archétype dans le pays.
4. **Veille des politiques de plateforme, avec rescoring** : diff hebdomadaire des pages WhatsApp (conditions, tarifs, politique AI Providers), YouTube (monétisation, liste YPP), Google (politiques anti-spam), Apple, Shopify et Lemon Squeezy. Toute modification relance le score des archétypes concernés.
5. **Module de scoring paramétrable** : implémenter les formules de la section 8, exposer les poids, afficher la médiane de la catégorie à côté de chaque vitrine, et publier l'analyse de sensibilité (probabilité d'être dans le top 3).
6. **Fiche d'initiative générée** : pile et coût mensuel (Claude, Vercel, Supabase, Postiz, ElevenLabs), rail d'encaissement du pays, statut et seuils, coût d'acquisition supposé, plan des 30 premiers jours jusqu'au premier euro, check-list de conformité (AI Act article 50, loi influenceurs, CNDP, RGPD).
7. **Proposer systématiquement la variante « outils de l'archétype »** : outils pour chaînes sans visage, pour le GEO ou pour vendeurs TikTok plutôt que la pratique elle-même, et la variante **export** pour le Maroc et l'Afrique.
8. **Calculer l'économie unitaire à partir des prix publics** : jetons (prix de l'API Claude), frais de canal (grilles WhatsApp par pays, à télécharger), commissions (Apple, Shopify, Gumroad, Skool, Apify). Montrer quel poste domine.
9. **Contrainte de change marocaine dans le simulateur** : au-delà de 20 000 DH par an de dépenses en devises, imposer « société » ou « compte en devises export ». Au-delà de 200 000 DH de chiffre d'affaires de services, basculer de régime. Signaler la retenue de 30 % sur un client local au-delà de 80 000 DH.
10. **Recommander un portefeuille, pas un pari** : avec *p12* entre 5 % et 35 %, présenter 3 à 5 paris peu coûteux et des critères d'arrêt explicites (par exemple : aucun revenu à T1 × 2, alors on arrête).
11. **Utiliser les connecteurs d'exécution** pour passer de la recommandation au prototype : Shopify (`create_store`, produits numériques), Vercel, Supabase, Postiz, Canva, ElevenLabs (agents WhatsApp). Vérifier d'abord la compatibilité pays, par exemple l'absence de Shopify Payments au Maroc.
12. **Segmenter le lifestyle par capacité de paiement et par rail** plutôt que par démographie seule : diaspora, commerçants en paiement à la livraison, PME francophones, créateurs en mobile money.

---

## 10. Questions ouvertes

1. Retenue de 30 % au-delà de 80 000 DH : s'applique-t-elle quand le client est étranger ? Quel est le texte final de la loi de finances 2027 (seuil de 100 000 DH ?) ?
2. Paddle verse-t-il réellement sur un compte marocain, et accepte-t-il un auto-entrepreneur ? Dodo Payments et Creem acceptent-ils des marchands marocains ? Les fiches TrustMRR montrent qu'ils sont très utilisés par les indépendants.
3. Grilles tarifaires WhatsApp (fichiers CSV) pour le Maroc, la France, le Sénégal et la Côte d'Ivoire : coût réel d'un agent de confirmation de commande.
4. TikTok Shop au Canada et au Québec, et en Suisse : disponibilité et calendrier.
5. Coûts d'acquisition mesurés en France : SaaS B2B pour TPE, newsletters, communautés. Coût par prospect et taux de confirmation en paiement à la livraison au Maroc, sur source vérifiable.
6. Statut solo ou équipe des cas TrustMRR, et répartition de la base par pays (API authentifiée nécessaire).
7. Cas de fondateurs solo marocains et d'Afrique subsaharienne à revenu vérifiable, et commissions de Chariow, Selar et Maketou (Maketou renvoyait une erreur 525 le 2026-11-28).
8. Clause d'usage commercial du plan Hobby de Vercel (absente de la page de prix).
9. Versements de l'App Store et de Google Play vers des banques marocaines, sénégalaises et ivoiriennes : délais et frais.
10. Sénégal et YPP : écart entre la liste officielle et le dossier compagnon. Date d'ajout ?
11. Calendrier de facturation électronique propre aux micro-entrepreneurs (émission en 2027 ?), page FAQ non lue.
12. Québec : effets concrets de la loi 96 et de la loi 25 sur un clone localisé ou un SaaS vendu au Québec.
13. Fiscalité des micro-entrepreneurs au Sénégal, en Côte d'Ivoire, au Cameroun, en Belgique et en Suisse, pour remplacer les valeurs [H] de la grille.
14. Calibrage de *p12* par archétype sur des cohortes complètes (lancements suivis à 12 mois), et non sur des vitrines.

---

## 11. Sources lues pendant la session (2026-11-28)

Primaires ou données d'API :

- RevenueCat, State of Subscription Apps 2026 : https://www.revenuecat.com/state-of-subscription-apps/ ; édition 2025 : https://www.revenuecat.com/state-of-subscription-apps-2025/
- BLS, Business Employment Dynamics, survie par cohorte : https://www.bls.gov/bdm/us_age_naics_00_table7.txt
- TrustMRR : https://trustmrr.com/ ; https://trustmrr.com/stats ; https://trustmrr.com/llms.txt ; https://trustmrr.com/api/ai/discovery ; fiches `https://trustmrr.com/startup/<slug>.md` (126 extraites : prosp, chatseo, podawaa, speel-co, storeradar, mac, tack, postiz, seobot, aeo-engine, rank-prompt, reddit-agency, faceless-so, vidai-llc, soldcomps, 1lookup, conductor, web3forms, directory-launch, taprefer, posteahora, verbi, uhoh-com, post-bridge, indexsy-consulting-ltd…) ; fondateurs : https://trustmrr.com/founder/marclou, https://trustmrr.com/founder/johnrushx, https://trustmrr.com/founder/sowakillian ; DM Champ : https://trustmrr.com/startup/dm-champ
- Meta, tarifs WhatsApp : https://developers.facebook.com/docs/whatsapp/pricing ; politique AI Providers : https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/ai-providers ; conditions : https://www.facebook.com/legal/Meta-Terms-for-WhatsApp-Business-Platform (section 4.7, page modifiée le 23 septembre 2026)
- YouTube, monétisation : https://support.google.com/youtube/answer/1311392 ; contenus synthétiques : https://support.google.com/youtube/answer/14328491 ; pays du YPP : https://support.google.com/youtube/answer/7101720
- Google Search, politiques anti-spam : https://developers.google.com/search/docs/essentials/spam-policies ; billet du 5 mars 2024 : https://developers.google.com/search/blog/2024/03/core-update-spam-policies
- Pew Research Center, 22 juillet 2025 : https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/
- Stripe : https://stripe.com/global ; Stripe Atlas : https://stripe.com/atlas
- Shopify : https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries ; https://www.shopify.com/pricing ; https://shopify.dev/docs/apps/launch/distribution/revenue-share
- Paddle : https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle ; Polar : https://polar.sh/docs/merchant-of-record/supported-countries ; Lemon Squeezy : https://www.lemonsqueezy.com/ ; Dodo Payments (pays des acheteurs) : https://docs.dodopayments.com/miscellaneous/list-of-countries-we-accept-payments-from
- Apple : https://developer.apple.com/app-store/small-business-program/
- Gumroad : https://gumroad.com/pricing ; Skool : https://www.skool.com/pricing ; beehiiv : https://www.beehiiv.com/pricing ; ExtensionPay : https://extensionpay.com/ ; Apify : https://docs.apify.com/platform/actors/publishing/monetize
- Anthropic : https://claude.com/pricing ; https://platform.claude.com/docs/en/about-claude/pricing
- Vercel : https://vercel.com/pricing ; Supabase : https://supabase.com/pricing ; Postiz : https://postiz.com/pricing ; ElevenLabs : https://elevenlabs.io/pricing
- Service-public (France) : https://entreprendre.service-public.gouv.fr/vosdroits/F32353 ; https://entreprendre.service-public.gouv.fr/vosdroits/F21746 ; https://entreprendre.service-public.gouv.fr/vosdroits/F36232 ; impots.gouv : https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique
- YouCan Pay : https://youcanpay.com/ ; YouCan : https://youcan.shop/fr/pricing ; Wave : https://www.wave.com/fr/business/ ; Flutterwave : https://flutterwave.com/sn/pricing ; PawaPay : https://www.pawapay.io/ ; Chariow : https://chariow.com/ ; Selar : https://selar.com/

Dossiers compagnons (sources primaires citées à l'intérieur) :

- `market-maroc-maghreb.md` : IGOC 2026 (https://www.oc.gov.ma/sites/default/files/reglementation/pdf/2026-01/IGOC%202026.pdf), guide DGI de l'auto-entrepreneur via Le Matin, ANRT, Bank Al-Maghrib, YouCan, PayPal et Cash Plus
- `market-france-europe.md` : TikTok Shop France et Europe, loi influenceurs, AI Act, RGPD et CNIL, Substack
- `trends-us-business.md` : Skool, beehiiv, affiliation TikTok Shop, Upwork, réceptionnistes IA, GEO, Acquire, App Store
- `claude-code-plugins.md` : plugins, annuaire, tâches planifiées, Artifacts, connecteurs

Pages inaccessibles (403, 404, 503 ou 525) : Portail auto-entrepreneur Urssaf, ae.gov.ma, CinetPay, PayDunya, FedaPay, Paystack (Côte d'Ivoire), Etsy (frais), Maketou, MicroConf (rapport derrière formulaire), page de paiements du Chrome Web Store.

---

## Contre-vérification

Contre-vérification indépendante faite le 2026-11-28. Le budget de recherche web partagé était épuisé : aucune requête WebSearch n'a abouti. Chaque point a donc été revérifié par lecture directe de la source primaire (WebFetch ou curl), par un téléchargement complet de l'IGOC 2026 (13,1 Mo, texte extrait), et par une réexécution de `score.py` sur une copie, avec des tests de sensibilité. Fichiers de travail : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/cv_eco_dl/` (pages et PDF téléchargés) et `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/cv_eco_run/` (`score_copy.py`, `sens.py`).

### Verdicts

| # | Affirmation | Verdict | Constat et correction |
|---|---|---|---|
| 1 | RevenueCat : 17,3 % des apps à 1 000 $/mois en deux ans, 4,6 % à 10 000 $, médiane de 72 $ à un an (quartile supérieur 429 $, top 10 % 2 574 $) | **confirmé** | Texte du rapport : « All Categories: 17.3% hit $1K, 4.6% hit $10K », « ~$72 », « above $429 », « above $2,574 », 58 et 109 jours, plus de 115 000 apps, plus de 16 Md$, période cible 2025. |
| 2 | TrustMRR /stats : 68,6 % entre 0 et 1 000 $, 1 % au-delà de 1 M$ ; plus de 15 000 startups ; Marc Lou : 20 produits, 3,34 M$, ShipFast à 548 $ sur 30 j | **confirmé**, avec réserve | Chiffres identiques (page mise à jour le 28/11/2026 à 04:15). La base (MRR, 30 jours ou cumul) n'est toujours pas indiquée. Le total de 15 000 vient du seul `llms.txt` (déclaratif). Fiche Marc Lou : « 20 verified startups generating $3,344,575 » ; ShipFast fait 1 273 440 $ cumulés (et non 1,3 M$) et 548 $ sur 30 jours. **À signaler** : selon `llms.txt`, TrustMRR appartient à Marc Lou. Le taux de base et l'étude de cas viennent donc de la même personne, et l'échantillon est auto-sélectionné. |
| 3 | Le MRR affiché diverge de l'encaissement : DM Champ 135 927 $ contre 24 004 $, Speel.co 62 877 $ contre 10 500 $, clé Stripe de PROSP expirée | **corrigé** | Les chiffres existent, mais l'écart vient surtout d'**artefacts de données** et ne décrit pas un cas typique. DM Champ : « Stripe API key expired at 2026-11-19 », dernière synchronisation le 18/11, MRR à +910,7 % sur 30 jours. Le « snapshot 30 jours » vaut 24 004 $, mais le tableau glissant de la même page donne **13 942 $**. PROSP : snapshot de 98 483 $ sur 30 jours alors que les « 3 derniers mois » valent **0 $** (incohérence interne, synchronisation du 05/02/2026). Speel.co : 11 970 $ sur 3 mois comme sur 6 mois, pour 74 565 $ sur 12 mois, donc un revenu en chute. **Speel.co et PROSP ont le même fondateur** (Yann) et sont toutes deux à vendre (500 k$ et 1 M$). Sur des fiches saines, le rapport MRR / 30 jours est de 1,1 à 1,3 : Podawaa 61 485 / 54 590, Rank Prompt 54 670 / 45 456, VidAI 55 383 / 43 150. |
| 4 | Rails : Stripe et Shopify Payments absents au MA, SN, CM et TN (CI via Paystack) ; Polar verse au SN, en CI et en TN, pas au MA ; Paddle n'exclut pas le Maroc ; Lemon Squeezy s'arrête le 31/03/2027 ; Atlas à 500 $ ouvert à tous ; Wave 1 % ; Flutterwave SN 2 % / 4,8 % | **corrigé** (un point faux) | Tout est confirmé sauf un point. **Paddle exclut explicitement la RDC et le Mali** (liste « unsupported » : « Democratic Republic of Congo », « Mali »). Le tableau 3.1, qui indique « Cameroun / RDC : non exclus », est donc faux pour la RDC, et le Mali (UEMOA) est aussi exclu. À compléter : Polar couvre aussi l'Algérie, pas le Cameroun. Stripe liste la CI en « Extended network » (lien Paystack), comme le Ghana, le Kenya, le Nigeria et l'Afrique du Sud. Lemon Squeezy : migration le 02/12/2026, arrêt le 31/03/2027. Atlas : « Founders from anywhere in the world », 500 $. Wave : gratuit jusqu'à 20 000 FCFA par jour puis 1 %, frais qui s'appliquent à l'encaissement par l'app Business. Flutterwave SN : 2 % sur le mobile money, 4,8 % sur les cartes locales et internationales, hors TVA. Chariow : « +200.000 » créateurs, « +5M$ », « +150 » pays, aucune commission affichée (déclaratif). |
| 5 | Maroc : auto-entrepreneur à 200 000 DH (1 %) et 500 000 DH (0,5 %), retenue de 30 % au-delà de 80 000 DH par client ; IGOC 2026 : 20 000 / 50 000 / 2 M DH ; export rapatrié sous 90 jours, 70 % au plus en devises | **confirmé** (IGOC sur source primaire) ; volet auto-entrepreneur sur source secondaire | IGOC 2026 lue dans le PDF : 20 000 DH par an pour un particulier (« au lieu de quinze mille »), 50 000 DH au minimum pour une société nouvelle, 2 000 000 DH pour une startup labellisée ADD. Rapatriement des exportations de services sous 90 jours « à compter de la date de la réalisation des prestations ». Comptes en devises : « 70%, au maximum, des recettes d'exportation rapatriées », et « jusqu'à 70% des revenus de sources étrangères » pour une personne physique non inscrite au registre de commerce. Auto-entrepreneur : Le Matin (19/08/2026), qui cite le guide DGI 2026 ; la page DGI renvoie une erreur 403, donc pas de lecture primaire. Le statut n'est perdu qu'après **deux années consécutives** de dépassement. **Taux de change** (Bank Al-Maghrib, 27/11/2026) : 1 $ = 10,031 DH et 1 € = 10,995 DH. La pile à 175 $/mois (environ 21 065 DH par an) ne dépasse les 20 000 DH que d'environ 5 %. Une pile sur Claude Pro (environ 94 $/mois, soit 11 300 DH) tient dans la dotation, qui couvre cependant tous les achats en ligne du particulier. |
| 6 | France 2026 : 203 100 € / 83 600 € ; franchise de TVA à 85 000 € / 37 500 €, seuil unique de 25 000 € abandonné ; cotisations à 12,3 %, 21,2 % et 25,6 % | **confirmé** | Fiches F32353 (vérifiée le 21/02/2026), F21746 (le 01/01/2026 : « a été abandonnée », seuils majorés 93 500 € et 41 250 €) et F36232 (le 01/01/2026). Ces pages ont 10 à 11 mois et ne disent rien de 2027. Il faut les relire après la loi de finances 2027. |
| 7 | WhatsApp : tarification au message depuis le 01/07/2025 ; messages de service payants au-delà de 1 000 depuis le 01/10/2026 ; Maroc devenu marché autonome ; assistants IA généralistes limités depuis le 15/01/2026 (Italie, UE et EEE, Brésil, Turquie) | **confirmé**, à dater finement | Les dates d'ouverture sont progressives : conditions d'utilisation au 15/01/2026, tarification AI Providers au 16/02/2026, Italie au 16/02, 29 pays UE et EEE et Brésil au 11/03/2026, **Turquie au 15/10/2026** (page mise à jour le 15/10/2026). **La Suisse n'est pas dans la liste**, pas plus que le Canada, le Maroc ou l'Afrique : un assistant généraliste y est interdit. Les hausses de messages de service du 01/10/2026 « do not apply to AI Providers ». Le Maroc est sorti de « Rest of Africa » le 01/10/2026, avec des hausses sur le marketing, l'utilitaire et l'authentification. Meta Business Agent : 2 $ par million de jetons, soit environ 4 à 5 cents par message. |
| 8 | YouTube : politique « inauthentic content » (15/07/2025) ; YPP au MA, en DZ, en TN et au SN, pas en CI, au CM ni en RDC | **confirmé**, avec nuance | Liste YPP officielle : MA, DZ, TN et SN y figurent. CI, CM, RDC, **Bénin, Mali, Burkina Faso et Gabon** n'y figurent pas. Nuance : la mise à jour du 15/07/2025 est un renommage et une clarification (« minor update ») de la politique « repetitious content ». Ces contenus étaient **déjà** exclus de la monétisation ; il ne s'agit pas d'une nouvelle exclusion. |
| 9 | Commissions : App Store 15 % et 10 % (UE) ; Shopify App Store 0 % jusqu'à 1 M$ puis 15 % ; Gumroad 10 % + 0,50 $ (30 % via Discover) ; Skool ; beehiiv 0 % ; ExtensionPay 5 % ; YouCan 0,5 % ; YouCan Pay 3,9 % + 2 MAD ; Apify 20 % ; pas de rail de vente dans l'annuaire Claude | **confirmé** | Apple : le taux de 10 % vaut aussi « for subscriptions after their first year ». Shopify : le seuil de 1 M$ est cumulé à vie, à compter du 01/01/2025, et réservé aux développeurs sous 20 M$ de revenu App Store l'année précédente et sous 100 M$ de chiffre d'affaires ; inscription à 19 $ ; frais de 2,9 %. beehiiv : 0 %, plus les frais Stripe de 2,9 % + 0,30 $. La page YouCan se contredit sur les frais en dessous de 5 000 $. Apify : « keeps 20% », coûts de plateforme déduits pour le paiement à l'événement, « negative profit » possible. Annuaire Claude : soumission sur plan payant ; aucune mention de paiement dans les pages de publication (absence constatée, pas une interdiction écrite). Postiz : 531 534 $ sur 30 jours au moment de la relecture ; PosteAhora : 186 $. Le lien de cause entre le MCP et le succès de Postiz **n'est pas démontré** : Postiz a été fondé le 24/07/2024 comme outil de planification. PosteAhora a 5 mois et le même fondateur que Directory Launch. |
| 10 | Pile et inférence : Pro 20 $, Max 100 $, Ultra 200 $ ; Haiku 5.5 à 0,10 / 0,50 $ ; Sonnet 5.5 à 2 / 10 $ ; 0,0006 à 0,011 $ par conversation ; Managed Agents à 0,08 $/h ; Vercel Pro 20 $ ; Supabase Pro 25 $ ; Postiz dès 29 $ | **confirmé** | Les prix Haiku 5.5 valent pour les prompts jusqu'à 100 000 jetons ; au-delà, 0,50 / 2,50 $. Calcul refait : 0,00055 $ et 0,011 $. Session Managed Agents : « $0.08 USD per session-hour », comptée seulement en statut `running`. Pro : 17 $ en annuel (200 $ payés d'avance). Vercel : 20 $ **par siège développeur**, 20 $ de crédit. Supabase Free : pause après une semaine d'inactivité. Postiz : 29 à 99 $, sans plan gratuit, essai de 7 jours. Restriction commerciale du plan Hobby de Vercel : toujours introuvable (page Fair Use vide côté serveur). |
| 11 | App Store : soumissions +84 % au T1 2026, nouvelles apps doublées au S1, téléchargements +2 % | **corrigé** | Le « 84 % » ne figure **que dans le titre** de l'article de 9to5Mac du 06/04/2026. Le corps ne parle ni du T1 2026 ni de soumissions : il cite The Information (données Sensor Tower), avec des nouvelles apps à +30 % en 2025, à près de 600 000. L'article du 20/07/2026 (NYT, Sensor Tower) donne environ 560 000 nouvelles apps au S1 2026, soit un doublement, et des téléchargements à +2 %, à 17,6 Md (+3 % en 2025, à 35,4 Md). Ce sont des estimations de Sensor Tower, pas des chiffres d'Apple. |
| 12 | Grille : l'agence export l'emporte au Maroc et dans l'UEMOA (ROI ajusté de 0,42 et 0,45 contre 0,12 en France) ; top 3 dans 73 % et 83 % des tirages | **corrigé** (chiffres exacts, conclusion fragile) | La réexécution sur une copie donne exactement 0,42, 0,45 et 0,12 et les mêmes classements. Mais l'avantage tient presque entièrement au **coût d'opportunité *w*** (6 €/h au Maroc, 4 €/h dans l'UEMOA, [H]), que le Monte-Carlo **ne fait pas varier** (pas plus que *tax* et *pay*). Avec *w* à 25 €/h partout, l'agence export tombe au **4e rang** au Maroc et dans l'UEMOA (ROI de 0,11 et 0,08). Autre incohérence interne : le Maroc est taxé à 1 % (auto-entrepreneur) alors que le revenu en cas de succès (*Rs* = 6 000 €/mois, environ 790 000 DH par an) fait environ **4 fois le plafond** de 200 000 DH. Avec une imposition de société à 25 % et *w* à 12 €/h au Maroc et 8 €/h dans l'UEMOA, le ROI tombe à 0,16 et 0,19, au 3e rang. Constat robuste : les archétypes de service (agence, données et API, outil vertical) restent en tête partout ; la domination de l'export n'est pas établie. |

### Vérifications annexes

- **BLS, table 7** (lue via WebFetch, curl bloqué en 403) : **corrigé**. Survie à 5 ans de **47,2 %** pour la cohorte la plus récente (2021), contre 50,2 à 51,9 % pour les cohortes 2013 à 2020. À un an, de 76,3 % (2022) à 80,9 % (2020), et 78,2 % pour 2023. À dix ans, de 34,2 à 34,9 %. Il faut remplacer « environ 51 % à 5 ans » par « 47 à 52 %, en baisse sur la dernière cohorte ».
- **Pew** : **confirmé**, 8 % contre 15 % et 1 % sur un lien du résumé, 900 adultes, mars 2025. À noter : seules 18 % des recherches affichaient un résumé IA dans l'étude.
- **Google, spam** : **confirmé**, trois politiques annoncées le 05/03/2024, l'abus de réputation de site entrant en vigueur le 05/05/2024.
- **Cas français** : ChatSEO (créé le 29/11/2025, 342 774 $ cumulés) a **trois cofondateurs** et n'est donc pas un cas solo. Podawaa : 1 288 298 $ cumulés. StoreRadar : 4 444 $ sur 30 jours mais 12 921 $ cumulés et 475 $ de MRR, donc un pic ponctuel. MAC+ et Tack+ ont le **même fondateur** (kjuu), tout comme PosteAhora et Directory Launch (Alexander Osso). Les contre-exemples sont jeunes (2 à 8 mois) et peu indépendants.
- **Non vérifiés (sans recherche web)** : TikTok Shop en Belgique (15/06/2026), en Suisse et au Canada ; relèvement de la retenue marocaine à 100 000 DH (PLF 2027) ; commission de Chariow.

### Ce que la conception de l'outil doit corriger

1. Ne jamais classer sur le MRR ni sur le « Last 30 days revenue snapshot » de TrustMRR. Il faut recalculer les fenêtres à partir de la série quotidienne et lire `Revenue last synced` ainsi que `API key expired`. Il faut aussi rejeter les fiches dont la synchronisation a plus de 30 jours ou dont les fenêtres sont incohérentes (30 jours au-dessus de 3 mois).
2. Dédoublonner par fondateur, signaler que TrustMRR appartient à Marc Lou, ne pas présumer qu'un cas est « solo », et comparer les cas à âge égal.
3. Règles de rails par pays, jamais par région : Paddle vaut 0 en RDC et au Mali ; YPP vaut 0 en CI, au CM, en RDC, au BJ, au ML, au BF et au GA.
4. Le Monte-Carlo de la grille doit faire varier *w*, *tax* et *pay*, et appliquer la bascule de régime dès que le revenu simulé dépasse le plafond de 200 000 DH. Il ne faut plus présenter « l'export l'emporte au Maroc et dans l'UEMOA » comme un résultat robuste.
5. WhatsApp : l'archétype « assistant IA généraliste » est bloqué hors Italie, 29 pays UE et EEE, Brésil et Turquie, donc aussi en Suisse et au Québec.
6. Remplacer « +84 % au T1 2026 » par les chiffres Sensor Tower, marqués comme estimations.
7. Taux de change : utiliser le cours du jour de Bank Al-Maghrib au lieu d'un taux fixe de 10 DH/$. La contrainte de dotation dépend du choix de la pile.
8. Dater et relire les seuils fiscaux français après la loi de finances 2027. Les chiffres de l'auto-entrepreneur marocain restent de source secondaire.
