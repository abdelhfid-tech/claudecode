# Écosystème Amazon d'auto-édition, impression à la demande et places de marché de contenus numériques

Axe complémentaire de l'étude préalable du radar `radar-decalage`. Rédigé le 28 novembre 2026. Dossier le plus proche : `initiatives-economie.md`, dont il reprend la grille de scoring (`scripts/score_initiatives.py`) sans la modifier.

## 0. Légende, méthode et limites

Marquage appliqué à chaque affirmation :

- **[F]** fait vérifié par lecture directe d'une source primaire le 2026-11-28 (page d'aide officielle, dépôt réglementaire, rapport annuel, réponse d'une API) ;
- **[F2]** fait repris d'une source secondaire, ou d'un extrait de page officielle restitué par le moteur de recherche quand la page elle-même renvoie 403 (c'est précisé) ;
- **[E]** estimation d'un tiers, chiffre déclaratif ou enquête auto-sélectionnée ;
- **[H]** hypothèse de l'auteur, à calibrer ;
- **[CI]** connaissance interne antérieure, non revérifiée pendant la session.

**Méthode.** Environ 45 pages d'aide KDP lues en texte brut (toutes accessibles en HTTP 200), aides Etsy (`help.etsy.com`, accessible), Notion, Printful, Shutterstock, rapports annuels d'Articore (Redbubble, TeePublic) et d'Etsy, tableau des conventions fiscales de l'IRS, synthèse statistique du SNE, étude du DEPS sur l'autoédition, statistiques 2025 de l'ADEB. Une trentaine de recherches web, utilisées surtout pour trouver les adresses. Vingt-cinq sondes curl réelles (section 12).

**Limites.**
- Plusieurs sources primaires refusent la lecture automatisée (403) : aide Udemy, Adobe Stock, Redbubble, Spreadshirt, TeePublic, Payhip, Creative Market, Canva Creators, page de ressources Merch on Demand (coquille JavaScript vide). Leurs chiffres viennent d'extraits de recherche ou de blogs et sont marqués [F2] ou [E].
- Aucune plateforme ne publie la **médiane** de revenu de ses vendeurs. Les seules distributions disponibles sont des enquêtes d'auteurs auto-sélectionnées et des **moyennes** calculées à partir des rapports annuels (revenu total versé divisé par le nombre de vendeurs actifs). Une moyenne surestime fortement la médiane dans une loi de puissance.
- Le taux KENP (rémunération par page lue dans Kindle+) n'est publié qu'aux auteurs connectés ; les valeurs citées viennent de trackers tiers [E].

---

## 1. Synthèse

1. **Ces archétypes sont rapides et peu coûteux à tester, mais leur espérance de revenu est faible.** Dans la grille, l'espérance nette sur 24 mois va de 58 € (impression à la demande sur Redbubble et TeePublic) à 557 € (modèles Notion et Canva) en France, contre 2 000 à 15 000 € pour les archétypes de service. Leur score (41 à 52 sur 100 en France) tient à un capital faible et à un premier euro rapide, pas au retour : le ROI ajusté est compris entre -0,05 et +0,02 en France, et descend jusqu'à -0,34 en Afrique centrale [calcul, paramètres H].
2. **La distribution des revenus est extrême.** Redbubble comptait 468 000 artistes ayant vendu au moins une fois sur l'exercice clos fin juin 2026, pour 20,9 M A$ de revenus nets versés, soit **44,7 A$ par artiste et par an en moyenne** ; TeePublic, 107 A$ [F, calcul sur le rapport annuel d'Articore]. Sur Etsy, la moyenne est de 1 868 $ de ventes brutes par vendeur actif et par an (5,6 M de vendeurs, 10,46 Md$ de ventes en 2025) [F2, extraits du 10-K ; calcul de l'auteur]. Chez les auteurs indépendants de l'enquête Written Word Media 2025 (1 346 réponses), 44 % gagnent 100 $ par mois ou moins, et environ 80 % des auteurs de 1 à 3 livres sont sous 100 $ par mois [E, enquête auto-sélectionnée].
3. **Amazon a resserré KDP en 2026, sans interdire l'IA.** La déclaration des contenus générés par IA (texte, images, traductions) reste obligatoire, privée et sans interdiction [F]. Depuis le 21 septembre 2026, KDP limite les nouveaux titres à **deux par format et par semaine** (dix l'année précédente, trois par jour en 2023) [F2]. La bande de prix à 70 % des ebooks est passée de 2,99-9,99 $ à **2,99-12,99 $** le 7 juillet 2026 [F]. Depuis le 1er août 2026, KDP ne paie plus vers les prestataires de paiement non agréés [F]. Kindle Unlimited a été renommé **Kindle+** le 22 octobre 2026 [F pour la page KDP, F2 pour la date].
4. **Le pays de versement trie les candidats avant la niche.** KDP paie par virement local en euros en France, en Belgique et en Suisse, en dollars canadiens au Québec, par virement en dirhams au Maroc (seuil de 100 par place de marché), et **seulement par chèque en dollars** au Sénégal, en Côte d'Ivoire, au Cameroun et en RDC, faute de mieux [F]. Etsy Payments couvre la France, la Belgique, la Suisse, le Canada et le **Maroc**, mais ni le Sénégal, ni la Côte d'Ivoire, ni le Cameroun, ni la RDC [F]. Le Marketplace de Notion verse au Maroc, au Sénégal et en Côte d'Ivoire, pas au Cameroun ni en RDC [F].
5. **Retenue fiscale américaine :** 0 % sur les droits d'auteur pour la France, la Belgique, la Suisse et le Canada, **10 % pour le Maroc**, **30 % pour le Sénégal, la Côte d'Ivoire, le Cameroun et la RDC** (pas de convention), sur les seules ventes de source américaine (ebooks sur Amazon.com, livres imprimés sur .com, .ca, .co.jp et .com.au) [F]. Un catalogue en français vendu sur Amazon.fr y échappe presque entièrement [F, déduction de la règle KDP].
6. **L'audio par IA reste fermé à la francophonie hors Québec.** Virtual Voice est sur invitation et ne distribue que sur la place de marché américaine, même si le français est une langue source admise [F]. ACX n'est ouvert qu'aux résidents des États-Unis, du Royaume-Uni, du Canada et d'Irlande [F] : le Québec est le seul territoire cible concerné. Kindle Translate (bêta sur invitation) traduit l'anglais vers le français et le français vers l'anglais [F].
7. **Les règles sur l'IA divergent selon les plateformes.** Shutterstock refuse tout contenu généré par IA de ses contributeurs [F]. Adobe Stock l'accepte avec une case « Created using generative AI tools » obligatoire [F2]. Etsy, le 22 octobre 2026, a interdit les guides fonctionnels générés par IA (patrons, recettes, instructions), exigé une photo réelle non retouchée par fiche et interdit les fiches créées sans intervention humaine [F2]. KDP refuse les guides compagnons (résumés) et les contenus « pas significativement différents » d'un autre livre [F].
8. **Le droit d'auteur ne protège pas les créations purement générées.** La Cour suprême des États-Unis a refusé le 2 mars 2026 d'examiner Thaler v. Perlmutter, ce qui laisse en place l'exigence d'un auteur humain [F2]. Un livre de coloriage ou un motif de t-shirt entièrement générés se copient donc sans recours : la défendabilité de ces archétypes est quasi nulle [H].
9. **AI Act, article 50 :** pour un auteur, l'obligation pèse sur les hypertrucages (« deep fakes »), avec une mention allégée pour les œuvres manifestement artistiques ou fictionnelles, et sur les textes publiés pour informer le public sur des questions d'intérêt général, sauf relecture humaine sous responsabilité éditoriale [F2, texte reproduit]. La plupart des romans, cahiers d'activités et modèles n'y sont pas soumis ; les obligations contraignantes en pratique sont celles des plateformes [H].
10. **Le marché francophone est étroit mais sous-servi.** Le numérique de littérature des éditeurs français pèse 40,9 M€ en 2024 (SNE), autoédition non comprise [F]. Sur l'API de découverte de Gumroad, « notion template » renvoie 19 744 produits contre **1** pour « modele notion », et « coloring book » 2 671 contre 37 pour « coloriage » [F, sonde]. L'écart d'offre en langue locale existe ; la demande, elle, n'est pas mesurée.
11. **Le radar dispose de sondes gratuites utilisables :** autocomplétion Amazon par pays et par rayon (200 sur .com, .fr, .de), classements Kindle (200 sur .com, .de et .ca ; .fr répond puis impose un captcha au troisième appel), API de découverte Gumroad (JSON, 200), compteurs du catalogue Notion (200), pages d'aide KDP, Etsy et Notion pour la veille des verrous (200). Etsy (403), Redbubble, TeePublic, Payhip, Creative Market, Canva et Udemy (403) et l'API d'exploration de Google Trends (429) sont fermés [F].
12. **Classement obtenu :** parmi les neuf archétypes de cet axe, les **modèles Notion et Canva** arrivent en tête dans tous les pays (52,1 en France, 6e sur 28 ; 4e au Maroc, 3e dans l'UEMOA) et sont le meilleur archétype de l'axe dans 81 % (Maroc), 82 % (France) et 94 % (UEMOA) des 1 000 tirages Monte-Carlo. Viennent ensuite les imprimables Etsy (48,2 ; bloqués dans l'UEMOA et en Afrique centrale), puis les guides pratiques KDP (45,6). Fiction KDP, coloriage, impression à la demande et banques d'images restent dans le dernier tiers, avec ou sans un coût horaire de 25 €/h partout.

---

## 2. Amazon KDP

### 2.1 Redevances

| Format | Règle 2026 | Source | Fiabilité |
|---|---|---|---|
| Ebook, option 35 % | 35 % du prix hors TVA, dans toutes les places de marché | https://kdp.amazon.com/en_US/help/topic/G200644210 | [F] |
| Ebook, option 70 % | 70 % du prix hors TVA moins les frais de livraison (moyenne de 0,06 $ par vente ; exemple espagnol : 0,10 € par Mo), pour les acheteurs des « territoires 70 % » ; 35 % ailleurs. Il n'est pas nécessaire de résider dans un territoire 70 %. Domaine public : 35 % seulement | idem | [F] |
| Bande de prix à 70 % | **2,99 $ à 12,99 $ depuis le 7 juillet 2026** (2,99 $ à 9,99 $ depuis 2007) ; en euros, 2,69 € à 12,99 € | https://kdp.amazon.com/en_US/help/topic/G200634560 | [F] |
| Broché et relié | **50 %** du prix catalogue hors TVA jusqu'à 9,98 € (9,98 $, 7,98 £, 13,98 $ CA), **60 %** à partir de 9,99 € ; moins le coût d'impression. Distribution étendue : 40 % | https://kdp.amazon.com/en_US/help/topic/G201834330 | [F] |
| Coût d'impression, noir et blanc, marchés euro | 24 à 110 pages : 2,05 € (format courant) ou 2,48 € (grand format) ; au-delà : 0,75 € + 0,012 € par page (0,016 € en grand format) | https://kdp.amazon.com/en_US/help/topic/G201834340 | [F] |
| TVA sur les livres imprimés en France | taux réduit 5,5 %, mais **taux normal de 20 % pour les carnets, agendas, journaux, livres de coloriage et d'activités** ; la redevance est calculée sur le prix hors TVA saisi par l'auteur | https://kdp.amazon.com/en_US/help/topic/GPQL5W3J6WNRCZTV | [F] |
| Kindle+ (ex-Kindle Unlimited) | part du KDP Select Global Fund au prorata des pages lues ou écoutées (KENP), payée à la première lecture de chaque page. En France, l'auteur fixe un prix par page, sans effet sur sa rémunération | https://kdp.amazon.com/en_US/help/topic/G201541130 | [F] |
| Montant du fonds | « Total KDP Select Author Earnings, October 2026 : 71,1 M$ », affiché en pied de chaque page d'aide KDP | idem | [F] |
| Taux par page | environ 0,0042 à 0,0049 $ par page en 2026 ; 0,00482 $ en avril 2026 selon un tracker | https://profitable.app/kdp/stats/kenp-rate ; https://kindlepreneur.com/kenp/ | [E] |
| Kindle+ côté lecteur | renommage de Kindle Unlimited le 22 octobre 2026, 11,99 $ par mois aux États-Unis ; livres audio dans Kindle+ sur la seule place de marché américaine | https://9to5mac.com/2026/10/22/amazon-unveils-kindle-subscription-a-rebrand-with-more-audiobooks/ ; page KDP G201537300 | [F2] pour la date et le prix ; [F] pour la restriction audio |
| KDP Select | programme de 90 jours, « open to all authors regardless of where you live » ; exclusivité de l'ebook | https://kdp.amazon.com/en_US/help/topic/G200798990 | [F] ; exclusivité [CI] |

### 2.2 Contenus générés par IA, limites et nettoyage

| Règle | Contenu | Source | Fiabilité |
|---|---|---|---|
| Déclaration | obligatoire pour tout contenu « AI-generated » (texte, images de couverture ou d'intérieur, traductions), même retravaillé ; facultative pour l'« AI-assisted » (édition, correction, idées). La déclaration n'est pas visible des lecteurs | https://kdp.amazon.com/en_US/help/topic/G200672390 ; https://scribecount.com/author-resource/protecting-books/kdp-ai-content-policy-the-compliance-guide | [F] ; visibilité [F2] |
| Limite de publication | **2 nouveaux titres par format et par semaine** depuis le 21 septembre 2026, remise à zéro le dimanche à 00:00 UTC ; 10 titres l'année précédente ; 3 par jour en septembre 2023 | https://selfpublishingadvice.org/amazon-cuts-kdp-weekly-upload-limit/ (24/09/2026) ; https://authorsguild.org/news/amazon-adds-to-kdp-generative-ai-policy-caps-daily-self-publishing-uploads/ | [F2] |
| Contenus refusés | guides compagnons (résumés, études, cahiers d'exercices sur un autre livre), contenu « not significantly different » d'un autre livre du Kindle Store, contenu « excessively reused, recycled, or repeated », contenu trop court ou mal traduit | https://kdp.amazon.com/en_US/help/topic/G200952510 | [F] |
| Livres « low-content » | carnets, agendas, journaux, carnets de suivi : sans ISBN gratuit, pas de date de sortie ; les livres de coloriage et de jeux ne sont **pas** des low-content mais leur revue prend **3 à 4 semaines** ; coloriage et jeux sont jugés inadaptés au format Kindle | https://kdp.amazon.com/en_US/help/topic/GGE5T76TWKA85DJM ; G200952510 | [F] |
| Titres | interdits : mots-clés génériques répétés (« notebook », « journal », « gifts »), référence à d'autres auteurs, « bestselling » | https://kdp.amazon.com/en_US/help/topic/GW7J4WEKBVU25YEC | [F] |
| Tableau de qualité | « Quality Notifications Dashboard » : signalements, statut « suppressed » | https://kdp.amazon.com/en_US/help/topic/GWCUU33VBJHFSRYN | [F] |
| Fermetures de comptes | hausse des notifications de résiliation liées à des livres assistés par IA et à la qualité, selon un cabinet d'avocats (04/06/2026) ; aucun chiffre officiel | https://www.amazonsellers.attorney/blog/increase-in-kdp-account-terminations-over-ai-assisted-books-and-poor-customer-experience-concerns | [E], source intéressée |
| Paiements | depuis le **1er août 2026**, plus aucun versement vers un prestataire de paiement non agréé ou sans vérification d'identité terminée. Prestataires agréés : Payoneer, Wise, Airwallex, WorldFirst, Ebury, PingPong et une quarantaine d'autres | https://kdp.amazon.com/en_US/help/topic/G6GLVRHVQZY4V4FX | [F] |

### 2.3 Audio et traduction par IA

| Service | État au 2026-11-28 | Source | Fiabilité |
|---|---|---|---|
| Virtual Voice (audio de synthèse) | bêta **sur invitation** ; plus de 80 voix ; langue principale de l'ebook : anglais, espagnol, italien ou **français** ; distribution **sur la seule place de marché américaine** ; inscrit d'office dans KDP Select si l'ebook l'est | https://kdp.amazon.com/en_US/help/topic/GMPQGZAZJH6FF456 ; GJSXT4GZLP4PL62B | [F] |
| ACX (audio narré, Audible) | ouvert aux seuls résidents des **États-Unis, du Royaume-Uni, du Canada et d'Irlande** (adresse, identifiant fiscal et banque locaux) | https://kdp.amazon.com/en_US/help/topic/G201014330 | [F] |
| Nouveau modèle de redevances ACX | 50 % en exclusivité, 30 % hors exclusivité (contre 40 % et 25 %), sur une nouvelle assiette (« Member Value ») ; ouvert depuis le 26 mai 2026, ancien modèle clos le 1er janvier 2027 | https://selfpublishingadvice.org/acx-and-audibles-new-payment-model-what-you-need-to-decide-before-31-december/ (14/10/2026) | [F2] |
| Kindle Translate | bêta gratuite sur invitation ; anglais vers français (France), allemand, italien, portugais (Brésil), espagnol ; français vers anglais (US) ; mêmes règles de qualité que l'ebook source ; pas de livre imprimé ni d'audio | https://kdp.amazon.com/en_US/help/topic/GRSNH76FDTJHRX49 ; G9LWBTHMUDT8EQPK | [F] |
| Langues de publication | le français est pris en charge pour tous les formats ; **l'arabe ne l'est qu'en ebook** ; la darija n'est pas une langue listée | https://kdp.amazon.com/en_US/help/topic/G200673300 | [F] |

### 2.4 Marché francophone

- **Taille.** Le numérique des éditeurs français pèse 278,6 M€ en 2024, dont 40,9 M€ pour la littérature (+8,5 %, « tirée par la romance, la science-fiction et le roman policier »), soit 6,2 % des ventes de littérature des éditeurs [F, SNE, *Les chiffres de l'édition 2024-2025*, https://www.livreshebdo.fr/sites/default/files/2025-06/SNE-Synthese-Statistique-2025-Web.pdf]. Ce périmètre exclut l'autoédition.
- **Autoédition.** 20 % des livres imprimés déposés à la BnF en 2019 (15 451 titres), 25,4 % en 2021 avec un nouveau périmètre ; les ebooks purement numériques ne sont pas recensés ; 24 % des livres déposés entre 2007 et 2016 n'ont enregistré aucune vente dans le panel GfK [F, DEPS, *L'autoédition de livres francophones imprimés : un continent ignoré*, 2024-1, https://fill-livrelecture.org/wp-content/uploads/2024/03/CE-2024-1-Autoedition-DEPS.pdf]. Amazon ne publie pas de chiffres pour la France ; un responsable de KDP cité par Livres Hebdo évoque 40 à 50 % de livres autoédités dans le top 100 d'Amazon [F2, https://www.livreshebdo.fr/article/lautoedition-en-pleine-expansion-le-bilan-2024].
- **Observation directe.** Le top 30 Kindle d'Amazon.fr du 28 novembre 2026 contient des titres à l'allure d'autoédition de genre : « Un Boss pour Noël », « À Noël, tout est permis : Romance avec un Patron Milliardaire », « À la folie ou pas du tout : comédie romantique enemies to lovers », plusieurs thrillers d'une même série traduite [F, sonde ; éditeur non vérifié].
- **Belgique.** Le chiffre d'affaires des éditeurs francophones belges est de 324,9 M€ en 2025 (-1,4 %), dont 28,5 % en numérique, mais la hausse numérique vient surtout des sciences humaines : ce n'est pas une mesure de l'ebook grand public [F, ADEB, https://www.adeb.be/pdfs/statistiques/synth%C3%A8ses/ADEB_Statistiques%202025_23-6.pdf].
- **Catégories qui ressortent de l'autocomplétion d'Amazon.fr** (rayon livres) : coloriage adulte, enfant, « monochrome », « par numéro », « cosy », « pour les seniors » ; « cahier de lecture méthode syllabique CE1 », « cahier d'écriture », « cahier de recettes à remplir » ; en Kindle : « roman historique », « roman policier », « gratuit », « feel good en français » [F, sonde]. Les termes « cosy/cozy », « monochrome » et « romantasy » sont des tendances américaines déjà présentes en France.

### 2.5 Versement et fiscalité selon le pays du vendeur

| Pays de résidence | Mode de versement KDP | Seuil | Retenue US (droits d'auteur, ventes de source US) | Source |
|---|---|---|---|---|
| France, Belgique | virement local (EFT) en euros | aucun | 0 % (convention, W-8BEN) | KDP GJD7DFFX6X88AK46, G201208420 ; IRS Table 1 (rév. mai 2023) [F] |
| Suisse | EFT en euros (la Suisse figure dans la liste des pays EFT en euros) | aucun | 0 % | idem [F] |
| Québec (Canada) | EFT en dollars canadiens | aucun | 0 % | idem [F] |
| Maroc | **virement (wire) en dirhams** uniquement, conversion au taux d'Amazon frais compris ; pas d'EFT | **100 $, 100 €, 100 £ par place de marché**, après retenue | **10 %** | KDP GJD7DFFX6X88AK46, GK2MKZUL6U3SFBPZ ; IRS Table 1 [F] |
| Sénégal, Côte d'Ivoire, Cameroun, RDC | rubrique « Other » : **chèque en dollars** (en livres pour .co.uk, en dollars canadiens pour .ca, rien pour .pl et .se), ni EFT ni virement ; une banque ou un prestataire agréé d'un autre pays reste possible si Amazon l'accepte | 100 $ par chèque | **30 %** (aucune convention) | idem [F] ; voie Payoneer [H] |

Délai : paiement environ 60 jours après la fin du mois de la vente ; le premier euro encaissé arrive donc 9 à 13 semaines après la première vente [F, GK2MKZUL6U3SFBPZ].

**Statut fiscal local.**
- France : l'autoédition relève du régime des artistes-auteurs, en BNC (RAAP à 8 %, taux réduit de 4 % sur option, seuil d'affiliation 2026 de 10 692 €), pour un prélèvement social global d'environ 16 à 17 % selon des cabinets [F2, présentation de l'Urssaf Limousin citée par plusieurs sources ; https://www.l-expert-comptable.com/a/530434-creer-une-entreprise-avec-la-maison-des-artistes.html]. Pour les imprimables et modèles vendus sur Etsy ou Gumroad, le classement en prestation de services BIC (21,2 %) ou en vente (12,3 %) n'a pas été trouvé dans une source officielle [lacune].
- Maroc : le traitement des redevances perçues de l'étranger par un auteur résident (revenu professionnel, auto-entrepreneur, imputation des 10 % américains) n'a pas été trouvé en source primaire [lacune]. Côté change, une personne physique non inscrite au registre du commerce qui perçoit des revenus de source étrangère peut en garder jusqu'à 70 % sur un compte en devises [F2, IGOC 2026 via `initiatives-economie.md`].

---

## 3. Impression à la demande

| Plateforme | Économie 2026 | Pays des vendeurs, versement | Source | Fiabilité |
|---|---|---|---|---|
| Merch on Demand (Amazon) | sur invitation ; depuis le 1er juin 2026, trois paliers sur le marché américain : Creator (par défaut, moins de 15 % de trafic externe) environ 2,44 $ par t-shirt à 19,99 $, soit la moitié de l'ancien taux ; Plus (15 à 34 % de trafic externe, 10 ventes par mois) 4,88 $ ; Premium (35 % et plus) 5,27 $ ; recalcul mensuel sur 60 jours | pays éligibles non trouvés (la page officielle est une application JavaScript) | https://merchtitans.com/blog/amazon-merch-royalty-changes-june-2026 (éditeur d'outils concurrents) | [E] ; annonce officielle non lue |
| Redbubble | marge fixée par l'artiste ; frais de compte pour les comptes Standard et Premium (plafond de 150 $ par mois), comptes Pro exemptés ; « excess markup fee » au-delà de 20 % de marge ; seuil de versement de 20 $ | non vérifié (pages d'aide en 403) | extraits de https://help.redbubble.com/hc/en-us/articles/4412593541908 et https://blog.redbubble.com/2025/08/excess-markup-fee-explained/ | [F2] |
| Redbubble et TeePublic, résultats | exercice 2026 : Redbubble 468 000 artistes vendeurs (542 000 en 2025), 20,9 M A$ de revenus nets versés aux artistes (30,2 M A$) ; TeePublic 165 000 artistes vendeurs, 17,7 M A$ ; le groupe cite sa « new artist account fee structure » parmi les causes de sa marge record | n/a | Articore, résultats annuels FY26, https://announcements.asx.com.au/asxpdf/20260828/pdf/073d18n6j8zx42.pdf | [F] |
| TeePublic | redevance fixe : environ 4 $ par t-shirt au prix plein, 2 $ en promotion (comptes Artisan) | non vérifié | https://merchtitans.com/blog/teepublic-review-2026 | [E] |
| Spreadshirt | « design price » variable selon le pays de vente, la catégorie et le canal ; grille de la place de marché refondue en août 2025 | non vérifié (403) | https://help.spreadshirt.com/hc/en-gb/articles/21791323474332-Design-price-overview (extrait) | [F2] |
| Printful | plan gratuit, Growth à 24,99 $ par mois (offert au-delà de 12 000 $ de ventes annuelles) ; 613 produits ; la page d'expédition exclut Russie, Biélorussie, Crimée et Donbass, Équateur, Cuba, Iran, Syrie, Corée du Nord : **le Maroc n'y figure pas** (la liste complète, sur une autre page, n'a pas été lue) | n/a | https://www.printful.com/pricing ; https://www.printful.com/shipping | [F] |
| Printify | plans Free et Premium | n/a | https://printify.com/pricing/ | [F] pour l'existence des plans ; prix non extraits |

**Shopify et YouCan au Maroc.** Shopify Payments n'existe pas au Maroc (surcommission de 0,6 à 2 % avec un prestataire tiers) [F2, `initiatives-economie.md`]. Printful et Printify sont des applications Shopify [F]. Les pages « Features » et « Apps » de YouCan ne mentionnent ni Printful, ni Printify, ni l'impression à la demande [F, absence constatée sur les pages lues]. YouCan annonce en revanche un serveur MCP (« Run your store from ChatGPT and Claude ») [F, https://youcan.shop/fr/features]. Pour un vendeur marocain, la voie praticable est **Etsy + Printify ou Printful** vers des acheteurs européens et américains (Etsy Payments ouvert au Maroc), pas une boutique YouCan en paiement à la livraison, qui supposerait un imprimeur local [H].

---

## 4. Places de marché de contenus numériques

| Plateforme | Commission et frais | Pays des vendeurs, versement | Règles sur l'IA | Source | Fiabilité |
|---|---|---|---|---|---|
| Etsy | 0,20 $ par fiche ; 6,5 % du total ; traitement 4 % + 0,30 € (FR, BE), 4 % + 0,50 CHF (CH), 3 % + 0,25 $ CA (Canada, ventes intérieures), **4,5 % + 5 MAD (Maroc)** ; conversion 2,5 % si devise de fiche et de compte différentes ; Offsite Ads 15 % (12 % au-delà de 10 000 $ par an), plafond 100 $ ; frais d'ouverture selon le pays ; frais réglementaire en France, au Canada et dans d'autres pays | Etsy Payments : FR, BE, CH, Canada, **Maroc** (dépôt minimal 20 MAD, frais de 20 MAD sous 1 000 MAD) ; **pas SN, CI, CM, RDC** | 22/10/2026 : guides fonctionnels générés par IA interdits (patrons, recettes, instructions) ; au moins une photo réelle non retouchée ; déclaration de l'IA ; fiches sans intervention humaine retirées ; détection d'images IA | https://help.etsy.com/hc/en-us/articles/115014483627 ; 115015628847 ; 360002120927 ; 115015710408 ; https://www.digitalcommerce360.com/2026/10/26/etsy-ai-policy/ | [F] frais et pays ; [F2] politique IA |
| Gumroad | 10 % + 0,50 $ en vente directe, 30 % via Discover ; marchand officiel (TVA gérée) depuis le 1er janvier 2025 | « direct deposit or PayPal, varies by country » ; liste des pays non lisible (page en JavaScript) | interdits généraux ; pas de règle IA trouvée | https://gumroad.com/pricing | [F] |
| Payhip | Free : 5 % ; Plus : 29 $ par mois et 2 % ; Pro : 99 $ par mois et 0 % ; plus frais Stripe ou PayPal ; pas marchand officiel complet | via le compte Stripe ou PayPal du vendeur (Stripe absent au Maroc) | non trouvée | https://sellfy.com/blog/payhip-pricing/ (concurrent) | [E] |
| Notion Marketplace | 8 % + 0,40 $ par vente ; 1 % de change hors États-Unis ; versement tous les quinze jours, minimum 20 $, fonds bloqués 14 jours ; liste d'attente et validation | via Stripe ; pays éligibles : FR, BE, CH, Canada, **Maroc, Sénégal, Côte d'Ivoire**, Algérie, Tunisie, Bénin ; **pas Cameroun ni RDC** | non trouvée | https://www.notion.com/help/selling-on-marketplace | [F] |
| Canva Creators | redevances prélevées sur un pool mensuel, pourcentage du revenu Canva Pro, montants non publiés ; payé aussi quand Canva AI réutilise un élément ; versement par Trolley (banque, Payoneer, Wise, PayPal), seuil 10 $ (25 $ en virement) ; programme modèles en bêta, réponse en quelques mois ; accord contributeur modifié le 14/01/2026 | pays non trouvés | non trouvée | extraits de https://www.canva.com/help/canva-creators-program/ et https://www.canva.com/help/set-up-payout-details/ (403) | [F2] |
| Creative Market | commission « variable par boutique et par produit » ; 50 % par défaut selon des tiers | non vérifié | non vérifiée | https://support.creativemarket.com/hc/en-us/articles/4404542383259-Creative-Market-Platform-Fee (extrait) ; https://freemius.com/blog/creative-market-marketplace-breakdown/ | [F2] et [E] |
| Udemy | 97 % si la vente vient d'un coupon ou d'un lien de l'instructeur, **37 %** sinon (depuis mai 2023) ; part de l'abonnement réduite par paliers jusqu'à 15 % en janvier 2026 ; fusion avec Coursera close en mai 2026 (95 000 créateurs) | PayPal, Payoneer, Tipalti ; virement direct aux États-Unis seulement | non lue | extraits de https://support.udemy.com/hc/en-us/articles/229605008 et https://teach.udemy.com/enabling-investment-subscription-terms-update/ (403) ; https://www.businesswire.com/news/home/20260511605128/en/ | [F2] |
| Adobe Stock | 33 % du prix net pour photos, vecteurs et illustrations, 35 % pour la vidéo | PayPal ou Skrill [CI] | IA acceptée avec la case « Created using generative AI tools », autorisations de modèle pour toute personne identifiable, pas de collection éditoriale ; consignes mises à jour le 11/06/2026 | extraits de https://helpx.adobe.com/stock/contributor/help/royalty-details.html et https://helpx.adobe.com/stock/contributor/submit-your-content/submit-generative-ai-content/generative-ai-content-guidelines.html (403) | [F2] |
| Shutterstock | barème par niveaux non lu (403) | n/v | **« Shutterstock does not accept AI-generated content from our contributors »** | https://submit.shutterstock.com/help/en/articles/10594622-content-policy-updates-ai-generated-content | [F] |

---

## 5. Taux de base et distribution des revenus

| Indicateur | Valeur | Nature | Source et date | Fiabilité |
|---|---|---|---|---|
| Revenu mensuel des auteurs indépendants | 44 % à 100 $ ou moins ; 20 % entre 500 et 5 000 $ ; 13 % au-delà de 5 000 $ ; 8 % au-delà de 10 000 $ | enquête, 1 346 réponses, auteurs prolifiques surreprésentés | Written Word Media, 02/12/2025, https://www.writtenwordmedia.com/2025-indie-author-survey-results-insights-into-self-publishing-for-authors/ | [E] |
| Effet du nombre de titres | 1 à 3 livres : environ 80 % sous 100 $ par mois ; 5 à 9 livres : médiane d'environ 50 $ ; 25 livres et plus : médiane d'environ 3 000 $ | idem | idem | [E] |
| Dépendance à Amazon | Amazon première source de revenu pour 83 % ; 38 % ont tous leurs livres dans KDP Select | idem | idem | [E] |
| Médiane des auteurs autoédités « professionnels » | 12 749 $ par an (auteurs consacrant au moins la moitié de leur temps à l'écriture) | enquête ALLi 2023, plus de 2 000 réponses | https://selfpublishingadvice.org/2025-author-income-survey/ | [E] |
| Livres sans aucune vente | 24 % des livres déposés à la BnF entre 2007 et 2016, 38 % des auteurs | panel GfK, tous éditeurs | DEPS 2024 | [F] |
| Revenu moyen par artiste Redbubble | **44,7 A$ par an** (20,9 M A$ / 468 000 artistes vendeurs) | moyenne, exercice clos le 30/06/2026 ; devise de publication supposée australienne | Articore FY26 | [F, calcul] ; devise [CI] |
| Revenu moyen par artiste TeePublic | **107 A$ par an** (17,7 M A$ / 165 000) | idem | idem | [F, calcul] |
| Ventes brutes moyennes par vendeur Etsy | **1 868 $ par an** (10 460,7 M$ / 5,6 M de vendeurs actifs) ; vendeurs -1,5 %, acheteurs -3,4 % en 2025 | moyenne de ventes brutes, avant frais | Etsy 10-K 2025, https://www.sec.gov/Archives/edgar/data/1370637/000137063726000019/etsy-20251231.htm (lu via extraits de recherche) | [F2] chiffres ; calcul de l'auteur |
| Fonds Kindle+ | 71,1 M$ en octobre 2026 ; nombre d'auteurs inconnu | total mensuel | pages d'aide KDP | [F] |
| Saturation des modèles | Gumroad : 19 744 produits pour « notion template », 2 671 pour « coloring book », 2 480 pour « planner printable » ; Notion : 26 506 modèles dans une seule catégorie | compteurs d'offre | sondes du 2026-11-28 | [F] |

**Lecture.** Une moyenne de 45 à 107 A$ par artiste et par an sur Redbubble et TeePublic signifie que l'artiste médian gagne quelques dollars par an. Le seuil de la grille (1 000 € nets par mois à M12) n'est atteint que par une petite fraction de 1 % des vendeurs d'impression à la demande [H, déduit de la moyenne]. Pour KDP, le nombre de titres est le facteur dominant : un solo à moins de 10 h par semaine publiera 3 à 6 titres en un an, la tranche où l'enquête place 80 % des auteurs sous 100 $ par mois [E].

---

## 6. Économie unitaire

Calculs de l'auteur à partir des barèmes ci-dessus ; 1 $ = 0,912 € (Bank Al-Maghrib, 27/11/2026, via `initiatives-economie.md`).

| Produit | Prix public | Revenu net par vente | Coût direct | Délai au premier euro encaissé | Fiabilité |
|---|---|---|---|---|---|
| Ebook en français, Amazon.fr, 70 % | 2,99 € TTC | 1,88 € (2,83 € HT × 70 % - 0,10 € de livraison supposée) | couverture, correction, publicité | 9 à 13 semaines | [F] barème, [H] frais de livraison français |
| idem | 4,99 € TTC | 3,21 € | idem | idem | idem |
| Lecture Kindle+ | 250 pages KENP lues | environ 1,05 € (0,0046 $ par page) | idem | idem | [E] |
| Livre de coloriage, Amazon.fr, grand format, 100 pages noir et blanc | 8,99 € TTC (7,49 € HT, TVA 20 %) | **1,27 €** (50 % × 7,49 - 2,48 €) | impression déduite | revue de 3 à 4 semaines, puis 60 jours | [F] |
| idem | 11,99 € TTC (9,99 € HT) | **3,51 €** (60 % × 9,99 - 2,48 €) | idem | idem | [F] |
| Roman broché 5 × 8 pouces, 250 pages | 12,00 € TTC (11,37 € HT) | 3,07 € (60 % × 11,37 - 3,75 €) | idem | 9 à 13 semaines | [F] |
| Livre de coloriage, Amazon.com | 9,99 $ | 3,15 $ (60 % × 9,99 - 2,84 $), moins 10 % de retenue au Maroc, 30 % en UEMOA | idem | idem | [F] |
| Imprimable Etsy, vendeur en France | 5,00 € | 3,97 € (79 %) ; 3,22 € si la vente vient d'Offsite Ads | 0,20 $ par fiche | quelques jours (dépôts Etsy) | [F] ; frais réglementaire de 0,47 % [E] |
| Imprimable Etsy, vendeur au Maroc, fiche en dollars | 5,00 $ | 3,63 $ (73 %) | idem | idem | [F] |
| Modèle Notion, Marketplace | 10,00 € | 8,75 € (8 % + 0,40 $ + 1 % de change) | aucun | 14 jours de blocage, versement bimensuel | [F] |
| Modèle sur Gumroad | 10,00 € | 8,54 € en direct ; 7,00 € via Discover | aucun | hebdomadaire [CI] | [F] |
| Modèle sur Payhip, plan gratuit | 10,00 € | environ 8,91 € | aucun | immédiat via PayPal | [E] |
| Cours Udemy | 14,99 € | 5,55 € en vente organique (37 %) ; 14,54 € avec coupon de l'instructeur (97 %) | micro, montage | mensuel | [F2] |
| T-shirt Merch on Demand, palier Creator | 19,99 $ | 2,44 $ | aucun | non vérifié | [E] |
| T-shirt TeePublic | prix plein / promotion | 4 $ / 2 $ | aucun | non vérifié | [E] |
| T-shirt Etsy + Printify ou Printful | 25 € | environ 6 à 8 € avant publicité | produit de base et port, 14 à 16 € [H] | 2 à 4 semaines | [H] |

**Ce qui domine l'économie.** Pour l'ebook, la redevance à 70 % rend la vente rentable dès 2,99 €, mais la découverte se paie en publicité Amazon (coût non mesuré ici) [H]. Pour le livre de coloriage, le seuil de 9,99 € HT fait passer la redevance de 1,27 € à 3,51 € : à 8,99 € TTC, un livre doit se vendre près de trois fois plus pour rapporter autant [F, calcul]. Pour l'impression à la demande sur les places de marché, la redevance par vente est de 2 à 5 $ et le volume est le problème [F/E].

---

## 7. Part automatisable par Claude Code et interdits des plateformes

| Archétype | Ce que Claude Code fait bien | Ce que la plateforme limite ou interdit | Levier retenu (L) |
|---|---|---|---|
| Fiction KDP en français | mise en forme EPUB et PDF, métadonnées, mots-clés, description, contenu A+, analyse des classements et de l'autocomplétion, aide à la réécriture | déclaration de tout texte, image ou traduction générés ; 2 titres par format et par semaine ; contenu « excessively reused » ; risque de résiliation de compte | 0,50 |
| Coloriage et cahiers d'activités | génération programmatique d'intérieurs (motifs SVG, mandalas, grilles, jeux, écriture), gabarits de couverture, variantes par niche | titres sans mots-clés génériques ; revue de 3 à 4 semaines ; images IA à déclarer et non protégeables ; « not significantly different » | 0,75 |
| Guides pratiques KDP | plan, recherche, vérification, mise en page, index, traduction relue | guides compagnons interdits ; AI Act article 50 pour les textes d'intérêt général sans responsabilité éditoriale | 0,60 |
| Impression à la demande, places de marché | motifs typographiques en SVG, déclinaisons, titres et étiquettes | dépôts massifs automatisés non vérifiés sur chaque plateforme ; propriété intellectuelle ; motifs IA non protégeables | 0,60 |
| Etsy + Printify | fiches, catalogue, synchronisation Printify, réponses clients en brouillon | photo réelle non retouchée obligatoire (problème pour un produit jamais fabriqué : à vérifier pour l'impression à la demande) ; fiches « bot-generated » interdites | 0,50 |
| Imprimables Etsy | génération de PDF (agendas, planificateurs, fiches d'activités), aperçus, fiches | guides fonctionnels générés par IA (recettes, patrons, instructions) interdits depuis le 22/10/2026 ; déclaration de l'IA | 0,60 |
| Modèles Notion et Canva | construction des bases Notion par l'API, maquettes Canva par le connecteur, documentation, page de vente, traduction | validation manuelle et liste d'attente sur Notion ; programme Canva en bêta | 0,75 |
| Cours Udemy | script, diapositives, quiz, sous-titres, voix ElevenLabs | règles sur les voix et contenus IA non lues (403) ; part de 37 % hors coupon | 0,50 |
| Banque d'images IA | prompts, tri, mots-clés, autorisations | Shutterstock refuse l'IA ; Adobe Stock exige l'étiquette et peut fermer un compte avec perte des redevances impayées [F2, forum] | 0,60 |

---

## 8. Risques de plateforme et de réglementation

1. **Changement unilatéral des barèmes.** Merch on Demand a divisé par deux la redevance du palier par défaut le 1er juin 2026 [E] ; Udemy est passé à 37 % hors coupon en mai 2023 (50 % auparavant [CI]) et réduit la part de l'abonnement jusqu'en 2026 [F2] ; Redbubble a introduit des frais de compte et en tire une marge record [F] ; ACX change d'assiette au 1er janvier 2027 [F2] ; KDP a élargi la bande à 70 % (favorable) [F].
2. **Limites de volume et nettoyage.** KDP : 2 titres par format et par semaine [F2]. Etsy : retrait des fiches sans intervention humaine et détection des images IA, étendue progressivement aux fiches existantes [F2].
3. **Rails de paiement.** Fin des prestataires de paiement non agréés chez KDP le 1er août 2026 [F] ; chèque seul pour l'Afrique subsaharienne francophone [F].
4. **AI Act, article 50** (applicable depuis le 2 août 2026 [F2]). Paragraphe 2 : les fournisseurs de systèmes génératifs marquent leurs sorties de façon lisible par machine. Paragraphe 4 : les déployeurs signalent les hypertrucages ; pour une œuvre « manifestement artistique, créative, satirique ou fictionnelle », la mention se limite à signaler l'existence du contenu sans gêner l'œuvre ; les textes publiés pour informer le public sur des questions d'intérêt général sont signalés, sauf relecture humaine et responsabilité éditoriale [F2, texte reproduit sur https://artificialintelligenceact.eu/article/50/]. Lecture de l'auteur [H] : un roman, un cahier de coloriage ou un modèle Notion ne sont ni des hypertrucages ni des textes d'information ; un guide pratique sur une démarche administrative peut être un texte d'intérêt général, couvert par l'exception si l'auteur relit et signe. Un vendeur établi au Maroc dont les produits sont utilisés dans l'UE entre dans le champ territorial du règlement [CI, article 2]. La Suisse n'est pas soumise à l'AI Act [F2].
5. **Droit d'auteur.** Aux États-Unis, l'exigence d'un auteur humain tient (certiorari refusé le 2 mars 2026 dans Thaler v. Perlmutter) [F2, https://www.mayerbrown.com/en/insights/publications/2026/03/supreme-court-denies-review-in-ai-authorship-case]. En France, l'originalité suppose l'empreinte de la personnalité d'un auteur humain [CI]. Conséquences : pas de recours contre la copie d'un motif généré ; risque inverse de contrefaçon si le modèle reproduit un style protégé ou une marque (personnages, slogans sous licence) [H].
6. **Étiquetage.** Les obligations contraignantes viennent des plateformes : KDP (déclaration privée), Etsy (déclaration publique), Adobe Stock (case obligatoire), loi influenceurs française pour la promotion (« image virtuelle ») [F2, `market-france-europe.md`].

---

## 9. Adéquation par pays

Lecture : le pays est celui du **vendeur** ; l'acheteur est surtout la France et les États-Unis.

| Critère | France | Belgique | Suisse | Québec | Maroc | Sénégal, Côte d'Ivoire | Cameroun, RDC |
|---|---|---|---|---|---|---|---|
| Versement KDP | EFT euros | EFT euros | EFT euros | EFT dollars canadiens | virement en dirhams, seuil 100 par marché | chèque en dollars | chèque en dollars |
| Retenue US | 0 % | 0 % | 0 % | 0 % | 10 % | 30 % | 30 % |
| ACX, audio narré | non | non | non | **oui** | non | non | non |
| Virtual Voice (vente US) | sur invitation | idem | idem | idem | idem | idem | idem |
| Etsy Payments | oui | oui | oui | oui | **oui** (4,5 % + 5 MAD) | **non** | **non** |
| Notion Marketplace | oui | oui | oui | oui | oui | oui | **non** |
| Udemy (PayPal, Payoneer) | oui | oui | oui | oui | probable | probable | à vérifier |
| AI Act | oui | oui | non | non (sauf ventes dans l'UE) | ventes dans l'UE | idem | idem |
| Langue | français | français | français | français, marché amazon.ca anglophone (l'autocomplétion française y est inutilisable) | français et arabe (ebook) ; darija non listée | français | français |
| Statut | artiste-auteur pour KDP ; micro-entreprise pour le reste | indépendant, régime des droits d'auteur [CI] | indépendant [lacune] | travailleur autonome [lacune] | auto-entrepreneur possible pour les services ; redevances [lacune] | [lacune] | [lacune] |
| Verdict [H] | tous archétypes possibles | idem | idem, coût horaire élevé | idem, avec l'audio en plus | KDP, Etsy, Notion praticables | modèles Notion seulement ; KDP par une banque tierce | modèles via Gumroad ou PayPal, à vérifier |

---

## 10. Adéquation par niche et par lifestyle

| Archétype | Niches porteuses observées | Lifestyle acheteur | Remarque |
|---|---|---|---|
| Fiction KDP en français | romance contemporaine (patron milliardaire, Noël, « enemies to lovers »), thrillers en série, « feel good », romantasy (« romantasy français » dans l'autocomplétion) | lectrices de 25 à 60 ans abonnées à Kindle+ | saisonnalité forte (Noël) ; série nécessaire |
| Coloriage et activités | « cosy », « monochrome », « par numéro », chats, seniors ; cahiers d'écriture et méthode syllabique (rentrée) | parents, seniors, anti-stress | TVA à 20 % en France ; seuil de 9,99 € HT |
| Guides pratiques | démarches, outils IA pour TPE, cuisine marocaine en français, apprentissage de la darija pour la diaspora (arabe en ebook seulement, darija non listée) | indépendants, diaspora | AI Act 50(4) possible ; guides compagnons interdits |
| Impression à la demande | fierté diasporique (Maroc, Algérie, Sénégal), humour en darija, métiers | diaspora en France, Belgique, Québec | revenu moyen de 45 à 107 A$ par artiste et par an |
| Imprimables Etsy | agendas, planificateurs de Ramadan, activités enfants ; au Maroc, l'autocomplétion Google montre une demande de **PDF** (« livre de coloriage pdf », « adulte maroc », « pdf gratuit ») | parents, organisés | Etsy fermé en Afrique subsaharienne francophone |
| Modèles Notion et Canva | modèles en français pour indépendants, étudiants, TPE (« modele notion » : 1 produit sur Gumroad) | indépendants, étudiants | la facturation électronique obligatoire rend fragiles les modèles de factures B2B [H] |
| Cours Udemy | IA, no-code, Excel, en français | salariés en reconversion | part de 37 % hors coupon ; fusion Coursera |
| Banque d'images IA | visuels de niche africains et maghrébins rares | agences, PME | Shutterstock fermé à l'IA |

---

## 11. Compatibilité avec les contraintes du fondateur

Toutes les lignes respectent le capital de moins de 1 000 € et l'exploitation de 25 h par mois au plus. Tests de demande proposés, chacun sous 20 h et 150 € [H] :

| Archétype | Test de demande (≤ 20 h, ≤ 150 €) | Seuil écrit d'avance [H] | Délai de lecture |
|---|---|---|---|
| Fiction KDP | une novella de 20 000 mots en série, couverture, 50 € de publicité | 15 000 pages KENP ou 50 ventes en 45 jours | 6 à 8 semaines |
| Coloriage | 3 livres en 15 h (intérieurs générés par script), 50 € de publicité | 30 ventes en 45 jours après la revue | 8 à 10 semaines |
| Guides pratiques | un guide court de 15 000 mots, ebook et broché | 30 ventes en 45 jours | 6 à 8 semaines |
| Impression à la demande | 30 motifs en 10 h sur Redbubble et TeePublic | 10 ventes en 60 jours | 8 semaines |
| Etsy + Printify | 15 fiches et 2 échantillons (60 €) | 5 ventes en 30 jours | 5 semaines |
| Imprimables Etsy | 20 fiches en 15 h (4 $ de frais de fiche et frais d'ouverture) | 10 ventes en 30 jours | 4 semaines |
| Modèles Notion et Canva | 2 modèles en français en 15 h, page Gumroad et Notion | 10 ventes ou 100 téléchargements gratuits et 5 ventes en 3 semaines | 3 semaines |
| Cours Udemy | un cours d'une heure en 20 h | 100 inscriptions dont 20 payantes via coupon en 30 jours | 6 semaines |
| Banque d'images IA | 200 images en 10 h sur Adobe Stock | 50 % d'acceptation et 20 téléchargements en 60 jours | 8 à 10 semaines |

---

## 12. Sondes du radar, testées le 2026-11-28

Agent utilisateur générique de navigateur, `curl -sL --compressed --max-time 30`, sans connexion.

| # | URL | Statut | Extrait | Usage pour le radar |
|---|---|---|---|---|
| 1 | `https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=stripbooks&prefix=coloring%20book%20for` | 200 JSON | « for kids », « for adults », « for alcohol markers », « for boys 8-10 », « for acrylic markers » | demande US par rayon |
| 2 | `https://completion.amazon.fr/api/2017/suggestions?mid=A13V1IB3VIYZZH&alias=stripbooks&prefix=livre%20de%20coloriage` | 200 JSON | « adulte », « enfant », « monochrome », « par numéro pour adultes », « cosy », « pour les seniors » | demande FR ; détection des termes US arrivés (« cosy », « monochrome ») |
| 3 | `https://completion.amazon.fr/...&alias=stripbooks&prefix=cahier%20d` | 200 | « cahier de compte », « méthode syllabique ce1 », « cahier de recettes à remplir », « cahier de coloriage cozy » | idem |
| 4 | `https://completion.amazon.fr/...&alias=digital-text&prefix=roman%20` | 200 | « roman historique », « roman policier gratuit kindle en francais », « roman feel good en francais » | rayon Kindle FR |
| 5 | `https://completion.amazon.com/...&alias=digital-text&prefix=romantasy` | 200 | « romantasy kindle unlimited », « dark romantasy », « reverse harem » | rayon Kindle US |
| 6 | `https://completion.amazon.fr/...&alias=aps&prefix=romantasy` | 200 | « romantasy adulte », « romantasy poche », « romantasy français », « romantasy coloriage » | statut « arrivé » en France |
| 7 | `https://completion.amazon.de/api/2017/suggestions?mid=A1PA6795UKMFR9&alias=stripbooks&prefix=malbuch%20f` | 200 | « malbuch für erwachsene », « für senioren », « fantasy » | sentinelle allemande |
| 8 | `https://completion.amazon.ca/api/2017/suggestions?mid=A2EUQ1WTGCTBG2&alias=stripbooks&prefix=livre%20de%20col` | 200 | une seule suggestion, hors sujet | **inutilisable pour le français du Québec** |
| 9 | `https://completion.amazon.com/...&alias=fashion-novelty&prefix=funny%20shirt` | 200 | une suggestion | faible pour l'impression à la demande |
| 10 | `https://www.amazon.com/gp/bestsellers/digital-text/` | 200 (exige `--compressed`) | 30 ASIN ; « Peculiar Stars », « Sunrise on the Reaping », « I Accidentally Joined a Wolf Shifter Group Chat » | classement Kindle US quotidien |
| 11 | `https://www.amazon.com/gp/movers-and-shakers/digital-text/` | 200 | 0 ASIN (rendu en JavaScript) | inutilisable sans navigateur |
| 12 | `https://www.amazon.com/gp/new-releases/digital-text/` | 200 | 30 ASIN | nouveautés US |
| 13 | `https://www.amazon.com/gp/bestsellers/fashion/9056987011` | 200 | 30 ASIN ; « Custom T-Shirt … by Amazon Merch on Demand », « Awesome Like My Daughter, Funny Tee » | classement des t-shirts fantaisie |
| 14 | `https://www.amazon.fr/gp/bestsellers/digital-text/` | 200 au premier appel | 30 ASIN ; « Famille volée », « Un Boss pour Noël », « À Noël, tout est permis » | classement Kindle FR, **un appel par jour au plus** |
| 15 | `https://www.amazon.fr/gp/bestsellers/books/302027` et `/gp/movers-and-shakers/digital-text/` | 200 avec **captcha** (troisième et quatrième appels en deux minutes) | page de vérification | quota strict par hôte |
| 16 | `https://www.amazon.de/gp/bestsellers/digital-text/` | 200 | 30 ASIN | sentinelle |
| 17 | `https://www.amazon.ca/gp/bestsellers/digital-text/` | 200 captcha au premier appel, 200 avec 31 ASIN au second | « Peculiar Stars », « Verity » | instable |
| 18 | `https://www.etsy.com/search?q=coloriage+imprimable` ; `suggestions_ajax.php` | 403 | page anti-bot | exclu |
| 19 | `https://openapi.etsy.com/v3/application/openapi-ping` | 403 JSON | « Invalid API key » | clé gratuite à demander (V2) |
| 20 | `https://help.etsy.com/hc/en-us/articles/115015710408` | 200 | liste des pays d'Etsy Payments | veille des verrous |
| 21 | `https://trends.google.com/trends/api/explore?...livre de coloriage...` | **429** | « Too Many Requests » | repli payant prévu au plan |
| 22 | `https://trends.google.com/trending/rss?geo=FR` et `geo=MA` | 200 XML | 10 éléments, sport et politique (« man utd – brentford », 2000+) | poids faible, confirmé |
| 23 | `https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=ma&q=livre%20de%20coloriage` | 200 | « pdf », « adulte maroc », « à imprimer pdf », « pdf gratuit », « anti stress maroc » (gl=fr : « disney », « cosy », « monochrome ») | demande de PDF au Maroc |
| 24 | `https://discover.gumroad.com/products/search?query=notion%20template` | 200 JSON | `total` 19 744 ; nom, prix, nombre d'avis ; « modele notion » : 1 ; « coloring book » : 2 671 ; « coloriage » : 37 | **indice d'offre en langue locale** |
| 25 | `https://www.notion.com/templates/category/personal` | 200 | « 26,506 templates », « 4,836 templates » | compteur d'offre |
| 26 | Redbubble, TeePublic, Payhip, Creative Market, Canva Creators, API Udemy | 403 | pages anti-bot | exclus |
| 27 | `https://merch.amazon.com/landing` | 200 | coquille vide (26 octets de texte) | inutilisable |
| 28 | `https://kdp.amazon.com/en_US/help/topic/<id>` (45 pages) | 200 | texte complet, pied de page « Total KDP Select Author Earnings » | veille des verrous et série mensuelle du fonds |

---

## 13. Paramètres pour la grille

### 13.1 Lignes ajoutées au dictionnaire A

Format exact de `score_initiatives.py`. Base France ; les archétypes vendent en euros ou en dollars, d'où `orient='export'` partout (l'acheteur est en France ou aux États-Unis quel que soit le pays du vendeur).

```python
 'kdp_fiction_fr':        dict(hrun=25, p12=.04, Rs=1500, m=.70, T1=10, C=600,  h=250, L=.50, D=1.5, Rp=.30, orient='export', rail='kdp',        regime='auteur'),
 'kdp_low_content':       dict(hrun=15, p12=.03, Rs=800,  m=.75, T1=9,  C=300,  h=150, L=.75, D=0.5, Rp=.40, orient='export', rail='kdp',        regime='auteur'),
 'kdp_guides_pratiques':  dict(hrun=15, p12=.05, Rs=1000, m=.75, T1=10, C=400,  h=200, L=.60, D=2.0, Rp=.25, orient='export', rail='kdp',        regime='auteur'),
 'pod_marketplaces':      dict(hrun=10, p12=.01, Rs=800,  m=.95, T1=8,  C=150,  h=120, L=.60, D=0.5, Rp=.40, orient='export', rail='pod',        regime='auteur'),
 'pod_etsy_printify':     dict(hrun=25, p12=.05, Rs=1500, m=.30, T1=6,  C=600,  h=250, L=.50, D=1.5, Rp=.25, orient='export', rail='etsy',       regime='bic_vente'),
 'etsy_imprimables':      dict(hrun=15, p12=.05, Rs=1200, m=.75, T1=4,  C=150,  h=150, L=.60, D=1.0, Rp=.35, orient='export', rail='etsy',       regime='bic_presta'),
 'modeles_notion_canva':  dict(hrun=12, p12=.06, Rs=1000, m=.88, T1=4,  C=200,  h=150, L=.75, D=1.5, Rp=.15, orient='export', rail='gabarits',   regime='bic_presta'),
 'cours_udemy':           dict(hrun=15, p12=.04, Rs=1000, m=.90, T1=8,  C=200,  h=200, L=.50, D=1.5, Rp=.30, orient='export', rail='udemy',      regime='bnc'),
 'banque_images_ia':      dict(hrun=15, p12=.02, Rs=800,  m=.95, T1=6,  C=300,  h=150, L=.60, D=0.5, Rp=.45, orient='export', rail='stock',      regime='bnc'),
```

Archétypes examinés et **non retenus** : livre audio Virtual Voice (sur invitation, vente aux États-Unis seulement), ACX (Québec seulement), Merch on Demand isolé (sur invitation, palier par défaut divisé par deux ; fondu dans `pod_marketplaces`), Shutterstock (IA refusée), Creative Market (commission non vérifiée ; fondu dans `modeles_notion_canva`).

### 13.2 Justification et niveau de preuve

| Archétype | Paramètre | Valeur | Justification | Preuve |
|---|---|---|---|---|
| kdp_fiction_fr | p12 | 0,04 | 1 à 3 livres : environ 80 % sous 100 $ par mois ; 5 à 9 livres : médiane 50 $ ; un solo publie 3 à 6 titres en 12 mois | [E] enquête WWM, [H] |
| | Rs | 1 500 | succès = série de 5 à 8 titres en romance ; entre la tranche 500-5 000 $ et la médiane des 25 titres et plus | [H] |
| | m | 0,70 | redevance déjà nette ; publicité Amazon et couvertures estimées à 30 % des redevances | [H] |
| | T1 | 10 | publication en 72 h, paiement 60 jours après la fin du mois | [F] délai, [H] |
| | C | 600 | 6 couvertures à 50 € et 300 € de publicité | [H] |
| | h, hrun | 250, 25 | une novella de 20 000 à 40 000 mots demande 40 à 60 h avec assistance ; la cadence d'une série sature 25 h par mois | [H] |
| | L | 0,50 | métadonnées, mise en forme et analyse automatisables ; l'écriture générée doit être déclarée et la qualité est contrôlée | [F] règles, [H] |
| | D | 1,5 | nom de plume et série ; pas de barrière | [H] |
| | Rp | 0,30 | 2 titres par semaine, déclaration IA, fermetures de comptes, taux KENP variable, renommage Kindle+ | [F] et [F2] |
| kdp_low_content | p12, Rs | 0,03, 800 | redevance de 1,27 à 3,51 € par livre ; saturation (2 671 « coloring book » sur Gumroad seul) ; motif non protégeable | [F] barème, [H] |
| | T1 | 9 | revue de 3 à 4 semaines, puis 60 jours | [F] |
| | L, D, Rp | 0,75, 0,5, 0,40 | intérieurs générables par script ; copie libre des images IA ; règles « not significantly different » | [F2] droit d'auteur, [H] |
| kdp_guides_pratiques | p12, Rs | 0,05, 1 000 | non-fiction de niche en français, ebook et broché à 60 % ; moins saturé que la fiction [H] | [H] |
| | D, Rp | 2,0, 0,25 | expertise et mise à jour annuelle ; guides compagnons interdits ; AI Act 50(4) possible | [F], [F2] |
| pod_marketplaces | p12 | 0,01 | moyenne de 44,7 A$ par artiste Redbubble et par an, 107 A$ chez TeePublic | [F, calcul] |
| | Rs, m | 800, 0,95 | redevance de 2 à 5 $ par article ; aucun coût direct | [E] |
| | C, h, hrun | 150, 120, 10 | frais de compte Redbubble ; 30 à 100 motifs | [F2], [H] |
| | Rp | 0,40 | frais de compte introduits, palier Merch divisé par deux, retraits pour propriété intellectuelle | [F], [E] |
| pod_etsy_printify | m | 0,30 | marge de 6 à 8 € sur un t-shirt à 25 € avant publicité | [H] |
| | p12, Rs | 0,05, 1 500 | moyenne Etsy de 1 868 $ de ventes brutes par vendeur actif | [F, calcul], [H] |
| | C, h | 600, 250 | échantillons, publicité Etsy, Offsite Ads | [H] |
| | Rp | 0,25 | photo réelle obligatoire depuis le 22/10/2026, à éclaircir pour l'impression à la demande | [F2] |
| etsy_imprimables | m | 0,75 | 79 % net en France, 73 % au Maroc, moins la publicité | [F, calcul] |
| | T1, C | 4, 150 | dépôts rapides ; 0,20 $ par fiche et frais d'ouverture | [F] |
| | Rp | 0,35 | interdiction des guides fonctionnels IA, détection des images IA, saturation | [F2] |
| modeles_notion_canva | p12, Rs | 0,06, 1 000 | quasi-absence d'offre en français (1 « modele notion ») ; demande française non mesurée | [F] offre, [H] demande |
| | m | 0,88 | 8 % + 0,40 $ + 1 % sur Notion ; 10 % + 0,50 $ sur Gumroad | [F] |
| | L | 0,75 | API Notion et connecteur Canva disponibles dans la session | [F, observation des outils] |
| | Rp | 0,15 | validation manuelle de Notion, programme Canva en bêta | [F], [F2] |
| cours_udemy | p12, m | 0,04, 0,90 | Rs est déjà net de la part d'Udemy (37 % ou 97 %) ; 95 000 créateurs après la fusion | [F2] |
| | Rp | 0,30 | baisses de part en 2023 et jusqu'en 2026, fusion avec Coursera | [F2] |
| banque_images_ia | p12, Rs | 0,02, 800 | 33 % de redevance ; offre IA massive ; Shutterstock fermé | [F2], [F] |
| | Rp | 0,45 | fermeture de compte avec perte des redevances, étiquetage | [F2] |

### 13.3 Nouveaux rails : coefficient d'encaissement par pays

| Rail | France | Belgique | Suisse | Québec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) | Justification |
|---|---|---|---|---|---|---|---|---|
| `kdp` | 1 | 1 | 1 | 1 | **0,75** | **0,30** | **0,25** | EFT en euros ou en dollars canadiens [F] ; Maroc : virement en dirhams, seuil de 100 par place de marché, conversion par Amazon [F] ; UEMOA et Afrique centrale : chèque en dollars seulement, voie par un prestataire agréé à vérifier [F] ; coefficients [H] |
| `etsy` | 1 | 1 | 1 | 1 | **0,85** | **0 (bloqué)** | **0 (bloqué)** | liste officielle d'Etsy Payments [F] ; Maroc : 4,5 % + 5 MAD et 2,5 % de conversion [F] |
| `pod` | 1 | 1 | 1 | 1 | 0,60 | 0,40 | 0,30 | versements par PayPal ou Payoneer [F2] ; pays non vérifiés [H] |
| `gabarits` | 1 | 1 | 1 | 1 | 0,70 | 0,70 | 0,30 | Notion éligible au Maroc, au Sénégal et en Côte d'Ivoire, pas au Cameroun ni en RDC [F] ; Gumroad par PayPal selon le pays [F] |
| `udemy` | 1 | 1 | 1 | 1 | 0,80 | 0,60 | 0,50 | PayPal, Payoneer, Tipalti [F2] ; couverture par pays non vérifiée [H] |
| `stock` | 1 | 1 | 1 | 1 | 0,70 | 0,50 | 0,40 | PayPal ou Skrill [CI] ; [H] |

Régimes ajoutés (prélèvement social ou fiscal) : `auteur` (France 0,17 [E, artistes-auteurs] ; Belgique 0,15 [CI] ; Suisse 0,15 [H] ; Québec 0,20 [H] ; Maroc 0,10, retenue américaine sur la part de source US et impôt local inconnu [F]/[H] ; UEMOA et Afrique centrale 0,15 [H]) et `bic_presta` (France 0,212 [F] ; Belgique 0,25, Suisse 0,15, Québec 0,20 [H] ; Maroc 0,01, auto-entrepreneur de services [F2] ; UEMOA et Afrique centrale 0,10 [H]). Aucun ajustement FIT n'a été ajouté.

### 13.4 Résultats (copie du script : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/kdp/score_kdp.py`)

Les 19 lignes d'origine sont identiques à celles d'`initiatives-economie.md` (contrôle de non-régression).

**Scores sur 100, coût horaire par pays d'origine :**

| Archetype | France | Belgique | Suisse | Quebec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) |
|---|---|---|---|---|---|---|---|
| micro_saas | 49.6 | 49.6 | 49.6 | 49.7 | 50.2 | 48.8 | 46.4 |
| clone_local | 45.7 | 46.1 | 46.6 | 46.0 | 42.1 | 40.7 | 39.4 |
| ia_verticale_tpe | 54.9 | 55.1 | 55.6 | 54.9 | 51.4 | 48.5 | 47.2 |
| agent_whatsapp | 48.4 | 48.5 | 49.2 | 48.5 | 45.1 | 42.7 | 41.4 |
| seo_prog_annuaire | 40.5 | 40.5 | 41.2 | 40.5 | 36.7 | 35.0 | 33.8 |
| geo_visibilite | 53.4 | 53.7 | 53.9 | 53.5 | 50.4 | 47.4 | 46.1 |
| newsletter_media | 47.6 | 47.6 | 47.9 | 47.6 | 45.3 | 44.3 | 43.3 |
| chaine_sans_visage | 34.9 | 34.9 | 35.4 | 34.9 | 32.3 | 30.9 | bloque |
| produits_numeriques | 50.2 | 50.0 | 50.1 | 49.9 | 46.8 | 45.9 | 44.6 |
| shopify_marque | 40.8 | 40.8 | 42.1 | 40.8 | 35.6 | 34.3 | 33.5 |
| tiktok_affiliation | 40.2 | 40.2 | bloque | 40.0 | bloque | bloque | bloque |
| extension_chrome | 48.0 | 48.0 | 47.9 | 48.1 | 48.4 | 47.6 | 46.0 |
| app_mobile_virale | 40.3 | 40.3 | 41.2 | 40.4 | 37.0 | 35.4 | 34.4 |
| mcp_plugins_skills | 47.2 | 47.2 | 47.6 | 47.2 | 45.0 | 43.6 | 42.2 |
| agence_automatisation | 56.9 | 57.2 | 57.2 | 57.0 | 56.0 | 53.5 | 52.5 |
| agence_export | 51.0 | 51.0 | 50.3 | 51.2 | 55.9 | 56.3 | 54.5 |
| marketplace_niche | 44.5 | 44.5 | 45.3 | 44.5 | 40.3 | 38.8 | 37.8 |
| communaute_payante | 53.6 | 53.8 | 53.7 | 53.7 | 50.4 | 49.9 | 48.5 |
| donnees_api | 55.0 | 55.0 | 55.4 | 55.1 | 53.2 | 51.5 | 49.4 |
| kdp_fiction_fr | 41.3 | 41.3 | 41.7 | 41.3 | 39.2 | 37.5 | 36.4 |
| kdp_low_content | 42.8 | 42.8 | 43.1 | 42.8 | 40.8 | 39.3 | 38.4 |
| kdp_guides_pratiques | 45.6 | 45.6 | 45.9 | 45.6 | 43.8 | 41.8 | 40.8 |
| pod_marketplaces | 42.5 | 42.5 | 42.7 | 42.5 | 40.9 | 39.8 | 39.0 |
| pod_etsy_printify | 43.8 | 43.7 | 44.2 | 43.8 | 41.5 | bloque | bloque |
| etsy_imprimables | 48.2 | 48.2 | 48.2 | 48.2 | 48.6 | bloque | bloque |
| modeles_notion_canva | 52.1 | 52.1 | 52.1 | 52.2 | 52.5 | 52.3 | 49.4 |
| cours_udemy | 44.9 | 44.9 | 45.0 | 44.9 | 44.5 | 43.6 | 42.9 |
| banque_images_ia | 42.5 | 42.5 | 42.9 | 42.5 | 40.5 | 39.2 | 38.2 |

**Espérance de revenu net sur 24 mois et ROI ajusté :**

| Archetype | E24 France (EUR) | ROI ajuste France | E24 Maroc (EUR) | ROI ajuste Maroc | E24 UEMOA (EUR) | ROI UEMOA |
|---|---|---|---|---|---|---|
| micro_saas | 3130 | 0.03 | 2915 | 0.06 | 2272 | -0.02 |
| clone_local | 1827 | -0.04 | 456 | -0.25 | 348 | -0.34 |
| ia_verticale_tpe | 6323 | 0.12 | 1683 | -0.08 | 688 | -0.24 |
| agent_whatsapp | 3197 | 0.01 | 1106 | -0.19 | 418 | -0.34 |
| seo_prog_annuaire | 846 | -0.05 | 225 | -0.27 | 92 | -0.38 |
| geo_visibilite | 9289 | 0.19 | 1978 | 0.02 | 607 | -0.15 |
| newsletter_media | 1307 | 0.0 | 174 | -0.13 | 142 | -0.19 |
| chaine_sans_visage | 532 | -0.04 | 159 | -0.19 | 39 | -0.28 |
| produits_numeriques | 2127 | 0.1 | 241 | -0.09 | 196 | -0.14 |
| shopify_marque | 1741 | -0.17 | 244 | -0.5 | 161 | -0.6 |
| tiktok_affiliation | 997 | 0.01 | 0 | None | 0 | None |
| extension_chrome | 793 | 0.01 | 739 | 0.04 | 576 | -0.01 |
| app_mobile_virale | 1492 | -0.12 | 1588 | -0.32 | 1263 | -0.43 |
| mcp_plugins_skills | 470 | -0.05 | 438 | -0.18 | 341 | -0.26 |
| agence_automatisation | 14862 | 0.24 | 3955 | 0.19 | 1618 | 0.04 |
| agence_export | 7846 | 0.12 | 7308 | 0.42 | 5694 | 0.45 |
| marketplace_niche | 1054 | -0.09 | 175 | -0.34 | 134 | -0.44 |
| communaute_payante | 6252 | 0.19 | 832 | 0.0 | 681 | -0.02 |
| donnees_api | 2035 | -0.04 | 1896 | -0.14 | 1477 | -0.25 |
| kdp_fiction_fr | 367 | -0.04 | 299 | -0.17 | 113 | -0.27 |
| kdp_low_content | 136 | -0.04 | 111 | -0.16 | 42 | -0.24 |
| kdp_guides_pratiques | 351 | -0.04 | 286 | -0.14 | 108 | -0.26 |
| pod_marketplaces | 58 | -0.03 | 38 | -0.12 | 24 | -0.18 |
| pod_etsy_printify | 229 | -0.05 | 221 | -0.18 | 0 | None |
| etsy_imprimables | 363 | 0.01 | 387 | 0.03 | 0 | None |
| modeles_notion_canva | 557 | 0.02 | 489 | 0.03 | 445 | 0.02 |
| cours_udemy | 286 | -0.01 | 305 | -0.03 | 208 | -0.08 |
| banque_images_ia | 96 | -0.05 | 90 | -0.16 | 58 | -0.24 |

**Top 6 par pays :**

- France : agence_automatisation (56.9), donnees_api (55.0), ia_verticale_tpe (54.9), communaute_payante (53.6), geo_visibilite (53.4), modeles_notion_canva (52.1)
- Belgique : agence_automatisation (57.2), ia_verticale_tpe (55.1), donnees_api (55.0), communaute_payante (53.8), geo_visibilite (53.7), modeles_notion_canva (52.1)
- Suisse : agence_automatisation (57.2), ia_verticale_tpe (55.6), donnees_api (55.4), geo_visibilite (53.9), communaute_payante (53.7), modeles_notion_canva (52.1)
- Quebec : agence_automatisation (57.0), donnees_api (55.1), ia_verticale_tpe (54.9), communaute_payante (53.7), geo_visibilite (53.5), modeles_notion_canva (52.2)
- Maroc : agence_automatisation (56.0), agence_export (55.9), donnees_api (53.2), modeles_notion_canva (52.5), ia_verticale_tpe (51.4), geo_visibilite (50.4)
- UEMOA (SN, CI) : agence_export (56.3), agence_automatisation (53.5), modeles_notion_canva (52.3), donnees_api (51.5), communaute_payante (49.9), micro_saas (48.8)
- Afrique centrale (CM, RDC) : agence_export (54.5), agence_automatisation (52.5), modeles_notion_canva (49.4), donnees_api (49.4), communaute_payante (48.5), ia_verticale_tpe (47.2)

**Variante w = 25 €/h dans tous les pays :**

| Archetype | France | Belgique | Suisse | Quebec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) |
|---|---|---|---|---|---|---|---|
| micro_saas | 49.6 | 49.6 | 49.9 | 49.7 | 49.5 | 49.1 | 48.6 |
| clone_local | 45.7 | 46.1 | 46.9 | 46.0 | 45.0 | 45.0 | 44.9 |
| ia_verticale_tpe | 54.9 | 55.1 | 57.6 | 54.9 | 52.3 | 51.8 | 51.6 |
| agent_whatsapp | 48.4 | 48.5 | 49.9 | 48.5 | 47.3 | 46.9 | 46.9 |
| seo_prog_annuaire | 40.5 | 40.5 | 41.1 | 40.5 | 39.9 | 39.7 | 39.7 |
| geo_visibilite | 53.4 | 53.7 | 56.6 | 53.5 | 50.2 | 49.6 | 49.4 |
| newsletter_media | 47.6 | 47.6 | 48.2 | 47.6 | 46.9 | 46.9 | 46.9 |
| chaine_sans_visage | 34.9 | 34.9 | 35.2 | 34.9 | 34.7 | 34.6 | bloque |
| produits_numeriques | 50.2 | 50.0 | 51.4 | 49.9 | 48.0 | 47.9 | 47.8 |
| shopify_marque | 40.8 | 40.8 | 41.1 | 40.8 | 40.3 | 40.3 | 40.3 |
| tiktok_affiliation | 40.2 | 40.2 | bloque | 40.0 | bloque | bloque | bloque |
| extension_chrome | 48.0 | 48.0 | 48.1 | 48.1 | 47.9 | 47.7 | 47.4 |
| app_mobile_virale | 40.3 | 40.3 | 40.4 | 40.4 | 40.4 | 40.2 | 40.1 |
| mcp_plugins_skills | 47.2 | 47.2 | 47.3 | 47.2 | 47.2 | 47.0 | 46.9 |
| agence_automatisation | 56.9 | 57.2 | 60.3 | 57.0 | 53.6 | 52.9 | 52.7 |
| agence_export | 51.0 | 51.0 | 51.3 | 51.2 | 50.8 | 50.4 | 49.8 |
| marketplace_niche | 44.5 | 44.5 | 44.8 | 44.5 | 44.1 | 44.1 | 44.1 |
| communaute_payante | 53.6 | 53.8 | 56.2 | 53.7 | 50.4 | 50.3 | 50.1 |
| donnees_api | 55.0 | 55.0 | 55.2 | 55.1 | 54.8 | 54.5 | 54.2 |
| kdp_fiction_fr | 41.3 | 41.3 | 41.3 | 41.3 | 41.3 | 41.1 | 41.1 |
| kdp_low_content | 42.8 | 42.8 | 42.8 | 42.8 | 42.8 | 42.7 | 42.7 |
| kdp_guides_pratiques | 45.6 | 45.6 | 45.6 | 45.6 | 45.5 | 45.3 | 45.3 |
| pod_marketplaces | 42.5 | 42.5 | 42.5 | 42.5 | 42.4 | 42.4 | 42.4 |
| pod_etsy_printify | 43.8 | 43.7 | 43.8 | 43.8 | 43.8 | bloque | bloque |
| etsy_imprimables | 48.2 | 48.2 | 48.2 | 48.2 | 48.2 | bloque | bloque |
| modeles_notion_canva | 52.1 | 52.1 | 52.2 | 52.2 | 52.0 | 51.9 | 51.5 |
| cours_udemy | 44.9 | 44.9 | 45.0 | 44.9 | 44.9 | 44.8 | 44.7 |
| banque_images_ia | 42.5 | 42.5 | 42.5 | 42.5 | 42.5 | 42.5 | 42.4 |

- France : agence_automatisation (56.9), donnees_api (55.0), ia_verticale_tpe (54.9), communaute_payante (53.6), geo_visibilite (53.4), modeles_notion_canva (52.1)
- Belgique : agence_automatisation (57.2), ia_verticale_tpe (55.1), donnees_api (55.0), communaute_payante (53.8), geo_visibilite (53.7), modeles_notion_canva (52.1)
- Suisse : agence_automatisation (60.3), ia_verticale_tpe (57.6), geo_visibilite (56.6), communaute_payante (56.2), donnees_api (55.2), modeles_notion_canva (52.2)
- Quebec : agence_automatisation (57.0), donnees_api (55.1), ia_verticale_tpe (54.9), communaute_payante (53.7), geo_visibilite (53.5), modeles_notion_canva (52.2)
- Maroc : donnees_api (54.8), agence_automatisation (53.6), ia_verticale_tpe (52.3), modeles_notion_canva (52.0), agence_export (50.8), communaute_payante (50.4)
- UEMOA (SN, CI) : donnees_api (54.5), agence_automatisation (52.9), modeles_notion_canva (51.9), ia_verticale_tpe (51.8), agence_export (50.4), communaute_payante (50.3)
- Afrique centrale (CM, RDC) : donnees_api (54.2), agence_automatisation (52.7), ia_verticale_tpe (51.6), modeles_notion_canva (51.5), communaute_payante (50.1), agence_export (49.8)

**Rang des archétypes de l'axe parmi les archétypes non bloqués** (base / w = 25 €/h) :

| Archétype | France (28) | Maroc (27) | UEMOA (25) | Afrique centrale (24) |
|---|---|---|---|---|
| modeles_notion_canva | 6 / 6 | 4 / 4 | 3 / 3 | 3 / 4 |
| etsy_imprimables | 11 / 11 | 9 / 9 | bloqué | bloqué |
| kdp_guides_pratiques | 16 / 16 | 16 / 15 | 15 / 14 | 15 / 14 |
| cours_udemy | 17 / 17 | 15 / 17 | 13 / 16 | 12 / 16 |
| pod_etsy_printify | 19 / 19 | 18 / 19 | bloqué | bloqué |
| kdp_low_content | 20 / 20 | 20 / 20 | 18 / 18 | 18 / 18 |
| pod_marketplaces | 21 / 21 | 19 / 22 | 17 / 20 | 17 / 19 |
| banque_images_ia | 22 / 22 | 21 / 21 | 19 / 19 | 19 / 20 |
| kdp_fiction_fr | 23 / 23 | 23 / 23 | 21 / 21 | 21 / 21 |

**Robustesse** (1 000 tirages, `mc_kdp.py` dans le même dossier ; *p12*, *Rs*, *T1*, *C*, *h*, *hrun* et *Rp* entre 50 et 150 %, *L* et *D* à ±30 % ; **et, comme l'a demandé la contre-vérification de l'axe économie, *w* tiré entre la valeur locale et 25 €/h, *tax* et *pay* perturbés**) :

| Archétype | France : top 10 | France : meilleur de l'axe | France : rang moyen | Maroc : top 10 | Maroc : meilleur | Maroc : rang moyen | UEMOA : top 10 | UEMOA : meilleur | UEMOA : rang moyen |
|---|---|---|---|---|---|---|---|---|---|
| kdp_fiction_fr | 0 % | 0 % | 22.5 | 0 % | 0 % | 21.7 | 0 % | 0 % | 20.1 |
| kdp_low_content | 1 % | 0 % | 20.2 | 2 % | 0 % | 19.6 | 3 % | 0 % | 18.0 |
| kdp_guides_pratiques | 14 % | 5 % | 15.8 | 17 % | 4 % | 15.3 | 20 % | 4 % | 14.4 |
| pod_marketplaces | 0 % | 0 % | 20.9 | 0 % | 0 % | 20.1 | 1 % | 0 % | 18.2 |
| pod_etsy_printify | 2 % | 0 % | 18.8 | 2 % | 0 % | 18.3 | 0 % | 0 % | bloqué |
| etsy_imprimables | 37 % | 11 % | 11.7 | 56 % | 12 % | 10.0 | 0 % | 0 % | bloqué |
| modeles_notion_canva | 88 % | 82 % | 6.4 | 93 % | 81 % | 5.1 | 96 % | 94 % | 4.5 |
| cours_udemy | 6 % | 1 % | 16.7 | 14 % | 2 % | 15.4 | 19 % | 2 % | 14.1 |
| banque_images_ia | 0 % | 0 % | 20.9 | 0 % | 0 % | 20.2 | 2 % | 0 % | 18.4 |

**Lecture.**
- Le classement interne à l'axe est stable : modèles Notion et Canva, puis imprimables Etsy, puis guides pratiques KDP. La fiction KDP est dernière partout, à cause d'un temps de production élevé pour un *p12* faible.
- La sensibilité au coût horaire est faible pour ces archétypes : leurs scores bougent de 0 à 0,4 point en France, en Belgique, en Suisse et au Québec, et de -0,5 à +4,7 points au Maroc, dans l'UEMOA et en Afrique centrale. Le classement interne ne change pas. Ce qui change, ce sont les archétypes de service autour d'eux : l'agence export passe de 55,9 à 50,8 au Maroc et de 56,3 à 50,4 dans l'UEMOA.
- **Artefact de la formule.** Quand l'espérance E24 est inférieure aux dépenses (2 × C), le ROI est négatif, et un coût horaire plus élevé l'**améliore** en le rapprochant de zéro (le dénominateur grossit). C'est pourquoi la fiction KDP gagne 4,7 points en Afrique centrale quand *w* passe de 3 à 25 €/h. La grille devrait borner le sous-score ROI à 0,5 quand E24 < 2C, ou calculer le ROI sur le temps seul.
- **Biais de la grille à signaler.** 65 % du score (délai, levier, défendabilité, capital) ne dépend pas du revenu. Un archétype qui coûte 200 € et paie en 4 semaines obtient 52 points avec une espérance de 557 € sur deux ans. Ces archétypes sont des **paris d'apprentissage et des tests de demande bon marché**, pas des sources de revenu ; le radar doit afficher E24 à côté du score.

---

## 14. Implications pour l'outil

1. **Capteur « offre en langue locale » par l'API de découverte de Gumroad** : pour chaque concept, compter `total` sur la requête anglaise et sur ses traductions françaises (et arabes), et stocker les nombres d'avis des 9 premiers résultats. Le rapport offre US / offre FR alimente l'indice d'opportunité du plan (section 6.2 B). Même logique avec les compteurs du catalogue Notion.
2. **Autocomplétion Amazon historisée par place de marché et par rayon** (`stripbooks`, `digital-text`, `aps`) sur .com, .fr et .de, avec la liste de veille traduite. L'apparition dans .fr d'un modificateur américain (« cosy », « monochrome », « romantasy ») date l'arrivée d'un format. Amazon.ca est inutilisable pour le français.
3. **Classements Kindle** : .com, .de et .ca tous les jours ; .fr **une fois par jour au plus**, avec arrêt au premier captcha et sans contournement. Stocker ASIN, rang et titre ; l'éditeur (autoédition ou non) demande les fiches produit, non testées.
4. **Série mensuelle du fonds Kindle+** lue en pied des pages d'aide KDP (« Total KDP Select Author Earnings ») : un capteur gratuit de la santé de l'écosystème.
5. **Veille des verrous** (diff hebdomadaire) : KDP (modes de paiement par pays, liste des prestataires agréés, bandes de prix, langues et places de marché de Virtual Voice et Kindle Translate, pays d'ACX, règles IA et limite de titres), Etsy (pays d'Etsy Payments, frais de traitement par pays, politique IA), Notion (pays éligibles), Printful (pays exclus). Toutes ces pages répondent en 200.
6. **Règles dans `rules/payments.yaml`** : `kdp` en chèque seul pour SN, CI, CM, RDC ; `etsy` à 0 pour SN, CI, CM, RDC ; `notion` à 0 pour CM et RDC ; ACX vrai pour le Canada seulement ; retenue US par pays (0, 10 ou 30 %) dans `rules/tax.yaml`.
7. **Calculateur d'économie unitaire KDP** dans le kit : TVA par type de livre (5,5 % ou 20 % en France), formule d'impression, seuil de 9,99 € HT entre 50 et 60 %, bande 2,99-12,99 à 70 %, retenue selon le pays du vendeur, délai de 60 jours.
8. **Garde-fous de kit** : ne jamais planifier plus de 2 titres par format et par semaine sur KDP ; ne pas automatiser le dépôt de fiches ; cocher la déclaration IA de chaque plateforme ; pas de résumé d'un autre livre ; pas de recette, patron ni tutoriel générés sur Etsy ; pas de dépôt IA sur Shutterstock.
9. **Afficher E24 et la moyenne de la plateforme** (45 A$ par artiste Redbubble, 1 868 $ par vendeur Etsy) à côté de chaque score de cet axe.
10. **Variante « outil de l'archétype »** à proposer systématiquement : un outil francophone de mots-clés KDP ou Etsy construit sur les sondes 1 à 6 et 24 relève de l'archétype `micro_saas` ou `extension_chrome`, mieux classés que la pratique elle-même.

---

## 15. Questions ouvertes

1. Taux KENP officiel par mois et par place de marché (Amazon.fr) : non public hors compte.
2. Pays éligibles à Merch on Demand et texte officiel des paliers du 1er juin 2026.
3. Un résident sénégalais ou ivoirien peut-il recevoir ses redevances KDP sur un compte Payoneer ou Wise en euros ? Le programme des prestataires agréés le permet-il pour ces pays ?
4. Maroc : régime fiscal des redevances étrangères d'un auteur résident (auto-entrepreneur possible ?), imputation de la retenue américaine de 10 %, et usage d'un compte Payoneer au regard de l'Office des changes.
5. France : classement URSSAF des ventes d'imprimables et de modèles numériques (BIC services ou vente) ; rattachement des redevances d'impression à la demande au régime des artistes-auteurs.
6. Etsy : la photo réelle obligatoire s'applique-t-elle aux produits imprimés à la demande ?
7. Frais de livraison des ebooks sur Amazon.fr (par Mo) et coût réel de la publicité Amazon par vente en romance française.
8. Pays de versement de Gumroad, Redbubble, Canva Creators et Adobe Stock pour le Maroc, le Sénégal, la Côte d'Ivoire, le Cameroun et la RDC.
9. Barèmes de Spreadshirt, TeePublic et Creative Market sur source primaire (pages en 403).
10. Demande réelle en français pour les modèles Notion : volume de recherche (Google Trends en 429 ; repli payant).
11. Date d'extension de Virtual Voice et de Kindle+ audio hors des États-Unis.
12. Fiscalité des droits d'auteur en Belgique, en Suisse et au Québec pour un auteur autoédité.

---

## 16. Sources lues pendant la session (2026-11-28)

Primaires :

- KDP, pages d'aide (`https://kdp.amazon.com/en_US/help/topic/<id>`) : G200644210 (redevances ebook), G200634560 (bandes de prix), G201834330 (redevances imprimées), G201834340 (coût d'impression), GPQL5W3J6WNRCZTV et G201645450 (TVA), G200672390 (règles de contenu et IA), G200952510 (qualité), GGE5T76TWKA85DJM (low-content), GW7J4WEKBVU25YEC (titres), GWCUU33VBJHFSRYN (tableau de qualité), G201537300 et G201541130 (Kindle+), G200798990 (KDP Select), GJD7DFFX6X88AK46 (modes de paiement), G201208420 (pays EFT en euros), GK2MKZUL6U3SFBPZ (calendrier et seuils), GD9NN4LS8ZDU8XZ7 et G6GLVRHVQZY4V4FX (prestataires agréés), G201274690 (retenue fiscale), GMPQGZAZJH6FF456 et GJSXT4GZLP4PL62B (Virtual Voice), GRSNH76FDTJHRX49 et G9LWBTHMUDT8EQPK (Kindle Translate), G201014330 (ACX), G200673300 (langues)
- IRS, Tax Treaty Table 1 (rév. mai 2023) : https://www.irs.gov/pub/irs-lbi/tax-treaty-table-1.pdf
- Etsy, aide : https://help.etsy.com/hc/en-us/articles/115014483627 (frais), 115015628847 (traitement par pays), 360002120927 (Etsy Payments), 115015710408 (pays éligibles) ; 10-K 2025 : https://www.sec.gov/Archives/edgar/data/1370637/000137063726000019/etsy-20251231.htm (via extraits de recherche)
- Articore Group, résultats FY26 : https://announcements.asx.com.au/asxpdf/20260828/pdf/073d18n6j8zx42.pdf
- Notion : https://www.notion.com/help/selling-on-marketplace ; Gumroad : https://gumroad.com/pricing ; Printful : https://www.printful.com/pricing, https://www.printful.com/shipping ; Printify : https://printify.com/pricing/ ; YouCan : https://youcan.shop/fr/features
- Shutterstock : https://submit.shutterstock.com/help/en/articles/10594622-content-policy-updates-ai-generated-content ; https://submit.shutterstock.com/help/en/articles/10594676-ai-generated-content-on-shutterstock-contributor-faq
- SNE, synthèse 2024-2025 : https://www.livreshebdo.fr/sites/default/files/2025-06/SNE-Synthese-Statistique-2025-Web.pdf ; DEPS 2024-1 : https://fill-livrelecture.org/wp-content/uploads/2024/03/CE-2024-1-Autoedition-DEPS.pdf ; ADEB 2025 : https://www.adeb.be/pdfs/statistiques/synth%C3%A8ses/ADEB_Statistiques%202025_23-6.pdf
- Enquêtes : Written Word Media 2025 ; ALLi (https://selfpublishingadvice.org/2025-author-income-survey/)

Secondaires et extraits : ALLi (limite de titres, 24/09/2026 ; ACX, 14/10/2026), Authors Guild (2023), 9to5Mac (Kindle+, 22/10/2026), Digital Commerce 360 (Etsy, 26/10/2026), Merch Titans (Merch on Demand, TeePublic), Mayer Brown (Thaler, 11/03/2026), artificialintelligenceact.eu (article 50), extraits Udemy, Adobe Stock, Canva, Redbubble, Spreadshirt, Creative Market, Sellfy (Payhip), Business Wire (Coursera-Udemy, 11/05/2026), Livres Hebdo (autoédition 2024), l-expert-comptable.com (artistes-auteurs), profitable.app et Kindlepreneur (KENP).

Pages inaccessibles : aide Udemy, Adobe Stock (helpx), Redbubble, Spreadshirt, TeePublic, Payhip, Creative Market, Canva (403) ; ressources Merch on Demand et aide Gumroad (JavaScript) ; Etsy hors aide (403) ; API d'exploration Google Trends (429).
