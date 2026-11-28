# L'affiliation : archétype d'initiative et couche de monétisation

Axe complémentaire de l'étude préalable du « Radar d'arbitrage de tendances ». Rédigé le 28 novembre 2026.

L'affiliation TikTok Shop est déjà traitée dans `initiatives-economie.md` (section 5.11, archétype `tiktok_affiliation`) et dans `trends-us-business.md` : ce dossier ne la refait pas et s'y réfère seulement pour comparaison.

## 0. Légende, méthode et limites

Niveaux de preuve :

- **[F]** fait vérifié par lecture directe d'une source primaire le 2026-11-28 (page officielle d'un programme, d'un réseau, d'une administration, d'un texte, ou test d'API fait depuis le conteneur) ;
- **[F2]** fait tiré d'une source secondaire (presse, extrait de recherche d'une page officielle non lue en entier, dossier compagnon qui cite sa source) ;
- **[E]** estimation d'un tiers, chiffre déclaratif d'une entreprise intéressée, enquête auto-déclarée ;
- **[H]** hypothèse de l'auteur, à calibrer ;
- **[CI]** connaissance interne antérieure à la session, non revérifiée.

**Méthode.** Environ 35 pages lues directement (curl ou WebFetch), 30 recherches web, deux séries de tests d'API d'autocomplétion (Amazon sur 9 places de marché, Google sur 6 pays), relecture du texte de l'IGOC 2026 déjà téléchargé par l'axe économie, et exécution d'une copie du script de scoring. Fichiers de travail : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/affil/` (script `score_initiatives_affil.py`, sortie `scores_affil_out.md`, résultats `scores_affil.json`, pages téléchargées et instantanés d'autocomplétion dans `dl/`).

**Pages inaccessibles le 2026-11-28.** Barème personnalisé Amazon (connexion requise), economie.gouv.fr (403 : guide 2026 de l'influence commerciale, page « Quels sont mes devoirs ? »), Medias24 (403), Viator et GetYourGuide en direct (403 ou contenu chargé en JavaScript), kol.jumia.com (hôte injoignable), jumia.ma, jumia.ci et jumia.sn (403), page des politiques d'Authority Hacker (l'enquête 2025 n'est plus en ligne à l'adresse connue).

**Limite majeure.** Aucun réseau ni programme ne publie la distribution des revenus de ses affiliés. Les seules distributions trouvées sont des enquêtes auto-déclarées de blogs marchands, biaisées vers les affiliés actifs. Les probabilités de succès de la grille restent donc des hypothèses ancrées, pas des mesures.

---

## 1. Synthèse

1. **Amazon paie peu en France, beaucoup plus en Belgique.** Barème standard amazon.fr : de 0 % à 6 % selon la catégorie (maison, cuisine, bricolage 5 % ; beauté, sport 4 % ; électronique mobile 2,5 % ; épicerie et jeux vidéo 1 %) [F]. Sur amazon.com.be, les mêmes familles sont à 10 % et la mode à 14 % [F]. Sur amazon.ca, de 0 % à 10 % [F]. La session dure 24 heures (89 jours si l'article est mis au panier), le paiement arrive environ 60 jours après la fin du mois, dès 25 € par virement [F].
2. **En espérance, aucun archétype d'affiliation ne paie l'heure du fondateur.** Sur 24 mois, le taux horaire espéré va de -2,5 à +0,5 €/h. Dans le cas où l'initiative réussit, il monte à 15 à 35 €/h en France, en Belgique et au Québec, hors bons plans et avis génériques [H, calcul de la grille, section 9.7]. L'affiliation est d'abord une couche de monétisation d'un actif (outil, newsletter, audience), rarement un pari autonome rentable.
3. **Classement obtenu**, identique en France, en Belgique, en Suisse et au Québec : outil interactif gratuit monétisé par l'affiliation (51,4), contenus et outils autour de logiciels à commission récurrente (50,0), newsletter affiliée (49,4), affiliation voyage Maroc (46,6), bons plans en monnaie locale (46,3), comparatifs à données propres (44,2), chaîne vidéo humaine (42,1, écartée par la porte des 25 h par mois), site d'avis générique produit par IA (40,7, dernier). Au Maroc et dans l'UEMOA, l'affiliation SaaS passe en tête. Les trois premiers sont dans le top 3 de l'affiliation dans 68 à 88 % des 1 000 tirages Monte-Carlo [H].
4. **Les résumés IA de Google sont arrivés en France le 22 juillet 2026**, avec le Mode IA [F2, billet Google France et presse], environ 26 mois après leur lancement aux USA en mai 2024 [CI]. Les données américaines 2024-2026 sur les sites d'affiliation sont donc un indicateur avancé pour la France. Une expérience de terrain préenregistrée (USA, mars 2026, 1 100 participants) mesure -18,8 points de taux de clic vers les éditeurs avec le seul Mode IA, et +8,8 points quand on retire les résumés IA [F, prépublication arXiv].
5. **Google vise nommément l'affiliation pauvre et le contenu IA en masse.** La politique « thin affiliation » cite les fiches copiées du marchand ; la politique « scaled content abuse » cite « using generative AI tools … to generate many pages without adding value ». La politique de réputation de site a désormais un régime propre à l'EEE : pas d'action manuelle, mais un classement séparé du domaine hôte (page mise à jour le 23 novembre 2026) [F].
6. **La loi influenceurs s'applique aux liens affiliés.** Le guide officiel cite le « pourcentage sur les ventes » parmi les contreparties qui font d'un contenu une communication commerciale, exige une mention en français (« #Ad » n'est pas valable) [F, guide DGE de mars 2023]. Depuis le 1er janvier 2026, un contrat écrit est obligatoire au-delà de 1 000 € HT par an pour un même objectif promotionnel, avec une clause de droit français pour un public établi en France [F, Service Public]. Or l'accord Amazon Partenaires est régi par le droit luxembourgeois [F] : la conformité d'un affilié Amazon qui dépasse 1 000 € HT est une question ouverte.
7. **Un résident marocain peut encaisser, mais par des rails indirects.** Pas d'Amazon au Maroc. Awin paie hors SEPA via Payoneer [F], Impact par virement international ou PayPal [F2], PartnerStack par PayPal, Stripe ou Airwallex [F2], CJ via Payoneer ou virement [E]. L'IGOC 2026 autorise une personne physique non inscrite au registre du commerce à loger jusqu'à 70 % de ses revenus de source étrangère sur un compte en devises, sur déclaration écrite [F]. Le plafond auto-entrepreneur de 200 000 DH par an (environ 18 200 € au cours du 27 novembre 2026) est franchi par une initiative réussie, et Amazon serait un client unique au-delà de 80 000 DH [F2, H].
8. **Voyage et tourisme au Maroc : demande réelle, commissions minces.** 19,8 millions d'arrivées en 2025, +14 % [F2, ministère du Tourisme via la presse]. GetYourGuide paie 7 % de base, Viator 4 %, avec un cookie de 30 jours (fiches Awin) [F] ; la commission n'est validée qu'après l'activité. Booking.com recrute désormais ses affiliés via CJ [F]. L'avantage défendable d'un fondateur résidant au Maroc est la donnée de terrain.
9. **Les logiciels paient le mieux et récurrent.** Systeme.io, éditeur français, verse 60 % à vie sur les abonnements [F] ; Hostinger, à partir de 40 % [F]. Ce sont les seuls programmes lus dont l'économie unitaire tient avec quelques centaines de visiteurs qualifiés par mois [H].
10. **En Afrique de l'Ouest, l'affiliation grand public est captée par les paris.** Le 2026-11-28, l'autocomplétion Google de « code promo » au Sénégal et en Côte d'Ivoire ne propose que des opérateurs de paris (1xbet, melbet, betclic, bet360…) ; au Maroc, Jumia, Glovo, 1xbet, Zalando et Temu ; en France et en Belgique, des enseignes [F, test]. Les paris sont une exclusion éthique de l'outil.
11. **YouTube Shopping n'est pas encore un rail fiable en France.** Google a annoncé le lancement du programme d'affiliation YouTube Shopping en France le 13 octobre 2026 [F], mais la page d'aide officielle liste 18 pays, sans la France, la Belgique, la Suisse, le Canada ni aucun pays africain [F]. Statut à traiter comme « non mesurable » et à surveiller.
12. **Le radar dispose d'un capteur gratuit de stade commercial : l'autocomplétion Amazon.** Le point d'accès répond (HTTP 200) sur amazon.fr, .com, .ca, .com.be, .co.uk, .de, .ae, .eg et .sa [F, test]. Il montre par exemple « creatine for women » aux USA et « creatine femme 50 ans », « creatine femme ménopause » en France : la tendance y est déjà au stade de l'achat.

---

## 2. Programmes et réseaux

### 2.1 Partenaires Amazon (France, Belgique, Canada)

**Barème standard amazon.fr** (page d'aide publique « Relevé des rémunérations issues de commissions standard », lue le 2026-11-28, sans date de version ; pied de page « © 1996-2025 ») [F] — https://partenaires.amazon.fr/help/node/topic/GRXPHT8U84RAYDXZ

| Taux | Catégories |
|---|---|
| 6 % | Marques propres Amazon Fashion, vêtements et accessoires, luxe, beauté et mode des boutiques luxe, chaussures, sacs à main et portefeuilles, montres |
| 5 % | Amazon Instant Video, livres audio Audible, automobile, livres, musique numérique, meubles, Handmade, maison, bricolage, bijoux, livres Kindle, cuisine et arts de la table, musique, outils électriques et manuels |
| 4 % | Beauté, bagages, appareils de soins personnels, sports et fitness |
| 3 % | Toutes les autres catégories |
| 2,5 % | Gros électroménager, appareils Fire TV, électronique mobile |
| 1 % | Amazon Fresh, épicerie, garde-manger, consoles et jeux vidéo |
| 0 % | Applications Android, cartes cadeaux, Kindle Unlimited, produits Coach, vin |

La page d'accueil du programme annonce « jusqu'à 12 % » [F] ; ce maximum ne figure pas dans le barème standard et vient sans doute des primes et programmes spéciaux [H].

**Barème standard amazon.com.be** (même page, version belge, lue le 2026-11-28) [F] — https://affiliate-program.amazon.com.be/help/node/topic/GRXPHT8U84RAYDXZ : vêtements, chaussures, bijoux, montres, bagages, mode Amazon 14 % ; appareils Amazon 10 % ; maison, livres, cuisine, jouets, bricolage, sport, beauté, santé, épicerie, bébé, animaux, jardin 10 % ; électronique, informatique, jeux vidéo 6 % ; consoles 1 % ; cartes cadeaux 0 % ; autres 6 %. Une colonne « Amazon Influencer Page » applique les mêmes taux, ce qui confirme le programme Influenceurs en Belgique.

**Barème standard amazon.ca** (version française, lue le 2026-11-28) [F] — https://associates.amazon.ca/help/node/topic/GRXPHT8U84RAYDXZ : luxe 10 % ; animaux 9 % ; bagages et bijoux 7 % ; maison, beauté, chaussures, meubles, outils, jardin, plein air, vêtements 6 % ; appareil photo, électroménager, bébé, bureau, logiciels, téléphones 5 % ; livres, électronique, cuisine, sport, appareils Amazon 4 % ; automobile, DVD, musique 3,5 % ; jouets, Kindle, santé 3 % ; jeux vidéo et ordinateurs 1 % ; épicerie et cartes cadeaux 0 % ; autres 2 %.

Lecture [H] : à trafic égal, un comparatif « maison » rapporte deux fois plus sur amazon.com.be que sur amazon.fr. Le marché belge francophone est cependant d'environ 4,5 millions d'habitants [CI], et un lien amazon.fr ne rémunère pas un achat fait sur amazon.com.be : il faut des liens par pays.

**Règles de fonctionnement** (« Politiques du programme » et « Conditions générales d'adhésion », lues le 2026-11-28) [F] — https://partenaires.amazon.fr/help/operating/policies ; https://partenaires.amazon.fr/help/operating/agreement

| Règle | Contenu |
|---|---|
| Durée d'attribution | Session de 24 heures après le clic ; un produit mis au panier pendant la session reste attribué s'il est commandé dans les 89 jours ; expédition et paiement dans les 180 jours |
| Paiement | Environ 60 jours après la fin du mois civil ; virement (IBAN ou BIC « le cas échéant ») dès 25 € ; carte cadeau dès 25 € (non disponible en Belgique, aux Pays-Bas, en Pologne et en Suède) ; chèque dès 50 € |
| Mention obligatoire | « En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises. » |
| IA et données | Interdiction d'utiliser les liens spéciaux ou le contenu du programme « afin de développer ou d'améliorer des modèles de langage ou multimodaux de grande taille, des modèles d'apprentissage automatique » sans accord écrit |
| Contenu | Ne pas modifier le contenu du programme (prix, visuels) ; afficher la date de mise à jour des prix ; pas de liens dans des courriels non sollicités ni hors ligne ; respect des règles de la communauté (pas d'avis rémunérés) |
| Droit applicable | Droit du Grand-Duché de Luxembourg, tribunaux de Luxembourg (non exclusifs) pour amazon.fr, .com.be, .de, .it, .es, .nl, .pl, .se, .ie, .co.uk |
| Sanctions | Exclusion des pays sous sanctions américaines ; aucune liste de pays de résidence autorisés n'est publiée |

**API produit.** La PA-API 5 est remplacée par la Creators API ; les appels à la PA-API reçoivent une erreur 403 (page de dépréciation d'Amazon, citée par `sources-open.md` et par la presse développeur) [F2]. L'accès à la Creators API exigerait 10 ventes qualifiées sur 30 jours [E, forum WordPress, non confirmé par Amazon]. Conséquence : un site neuf ne peut pas automatiser prix et disponibilité par l'API avant ses premières ventes [H].

**Résident marocain ou africain.** Aucune page lue n'exclut un résident marocain ; le Maroc n'est pas sous sanctions [F pour les conditions, H pour l'interprétation]. Le virement vers une banque marocaine n'est pas confirmé ; la carte cadeau ne sert à rien sans Amazon au Maroc ; le chèque en euros reste possible mais lent [H]. À vérifier par une inscription réelle.

**Programme Influenceurs Amazon.** Disponible en France selon Amazon (page « How the Amazon Influencer Program works », France parmi plus de 20 pays) et selon la presse française, avec une vitrine à URL personnalisée et un profil public vérifié, sans seuil d'abonnés publié [F2] — https://www.aboutamazon.com/news/retail/how-amazon-influencer-program-works ; https://www.presse-citron.net/amazon-lance-une-offre-dediee-aux-influenceurs-en-france/. La page partenaires.amazon.fr/influencers ne renvoie qu'une coquille JavaScript [F].

### 2.2 Réseaux d'affiliation

| Réseau | Ce qui a été vérifié | Paiement hors zone euro | Résident marocain | Source |
|---|---|---|---|---|
| Awin | Fiches annonceurs publiques (commission, cookie) ; dix devises (USD, EUR, GBP, AUD, CAD, SEK, DKK, NOK, CHF, PLN) | « All international payments are processed through Payoneer », en devise locale ou en USD, EUR, GBP par SWIFT (3 à 5 jours) | Possible via Payoneer si le Maroc est couvert par sa carte des capacités (non vérifié) | https://success.awin.com/articles/en_US/Knowledge/International-Payment-Method-FAQs [F] ; conditions éditeurs FR 2025 (petit dépôt possible à l'inscription) [F2] |
| CJ | Booking.com y recrute ses affiliés | Virement, chèque, Payoneer ; minimum 50 $ (virement, Payoneer) et 100 $ (chèque) ; pas de PayPal | Probable via Payoneer [E] | https://www.booking.com/affiliate-program/v2/index.html [F] ; Namecheap, MonetizePros [E] |
| Impact | Virement domestique, virement international, PayPal ; seuil de 10 $ (aide) ou 20 $ (API), contradiction | Oui | Probable par PayPal ou virement [F2] | https://help.impact.com/partner/... (extraits de recherche) [F2] |
| PartnerStack (logiciels) | PayPal, Stripe, virement via Airwallex | PayPal dans plus de 200 pays | PayPal oui ; Stripe non (absent au Maroc) | https://support.partnerstack.com/hc/.../360009377934 [F2] ; Stripe [F2, `initiatives-economie.md`] |
| Kwanko | Inscription gratuite, sites validés, paiement mensuel dès 50 € validés par devise ; compte suspendu après 6 mois d'inactivité | Non vérifié | Non vérifié | helpdesk Kwanko, Leptidigital [F2] |
| Effinity (ex-Effiliation) | effiliation.com redirige vers effinity.fr ; inscription non automatique, critères de trafic et de qualité | Non vérifié | Non vérifié | https://www.effinity.fr/expertise/affiliation/ [F] ; Leptidigital [F2] |
| TimeOne | Site injoignable depuis le conteneur ; inscription éditeur gratuite selon un comparateur | Non vérifié | Non vérifié | tool-advisor.fr [E] |
| Tradedoubler | Annuaire public des programmes (ex. GetYourGuide par pays) ; contrat éditeur FR en PDF | Non vérifié | Non vérifié | https://www.tradedoubler.com/fr [F] ; directory.tradedoubler.com [F2] |
| Rakuten Advertising | Non lu | Non vérifié | Non vérifié | lacune |
| ArabClicks | Réseau du Golfe (EAU, Arabie saoudite, Koweït, Bahreïn, Oman) ; Viator à 2,8 % « Worldwide », cookie 30 jours | Non vérifié | Peu utile pour un public francophone | https://www.arabclicks.com/ ; https://www.arabclicks.com/advertisers/viator-affiliate-program/ [F] |

Lecture [H] : les réseaux français (Kwanko, Effinity, TimeOne) sont pensés pour des éditeurs établis en France ; pour un résident marocain, Awin, Impact et PartnerStack sont les portes les plus probables. Aucune page ne l'exclut ni ne le confirme.

### 2.3 Voyage et tourisme (cellule Maroc × tourisme)

| Programme | Commission | Attribution | Particularité | Source |
|---|---|---|---|---|
| GetYourGuide (Awin, programme US) | 7 % de base, plus selon le partenaire | Cookie 30 jours | 23 langues, 40 devises | https://ui.awin.com/merchant-profile/18925 [F] ; 8 % et 31 jours chez des tiers [E] ; 5 % sur Tradedoubler US [F2] |
| Viator (Awin, programme US) | 4 % par défaut | Cookie 30 jours | Commission versée après le voyage ; exclusions (parcs à thème, visites virtuelles) ; `rel=sponsored` exigé ; paramètres de réservation transmis depuis juin 2026 | https://ui.awin.com/merchant-profile/11018 [F] ; 8 % en direct selon des tiers [E] |
| Viator (ArabClicks) | 2,8 % | Cookie 30 jours | « Worldwide » | [F] |
| Booking.com | Non publié | Non publié | Inscription « via nos réseaux affiliés officiels », avec CJ ; 28 millions d'hébergements | https://www.booking.com/affiliate-program/v2/index.html [F] ; 25 à 40 % de la commission de Booking selon des tiers [E] |
| Airalo (eSIM) | Non publié sur la page lue | Non publié | « Affiliate Program » et « Influencer Program » listés ; plus de 6 500 partenaires, plus de 30 M d'utilisateurs (déclaratif) | https://partners.airalo.com/ [F pour l'existence, E pour les volumes] |

**Demande.** Le Maroc a accueilli 19,8 millions de touristes en 2025 (+14 %), recettes voyages de 138,1 Md DH (+20,6 %) selon la DEPF [F2, Le Matin, Le360, AllAfrica, janvier 2026]. Objectif 2030 de 26 millions [F2]. L'autocomplétion Google montre une demande française structurée : « esim maroc comparatif », « esim maroc 7 jours », « activité marrakech jet ski », « riad marrakech pas cher », et en Belgique « riad marrakech tenu par des belges » [F, test du 2026-11-28].

**Lecture [H].** Avec 4 à 7 % sur une activité d'environ 60 €, il faut 300 à 550 réservations par mois pour 1 000 € nets. Les grands acteurs (Booking, GetYourGuide) ont leur propre référencement. L'angle tenable est l'outil (budget, eSIM, itinéraire) et la donnée de terrain vérifiée, que seul un résident peut produire régulièrement.

### 2.4 Logiciels à commission récurrente

| Programme | Commission | Remarque | Source |
|---|---|---|---|
| Systeme.io (France) | 60 % des abonnements, « à vie » ; « Aucune condition pour devenir affilié » | « Nos affiliés ont gagné plus de 5 000 000 € de commissions » (déclaratif) ; plan Startup à 14 € ou 17 € par mois | https://systeme.io/fr/affiliate-program [F] ; total [E] |
| Hostinger | « It starts at 40% and grows depending on sales volume » ; 20 % pour les partenaires open source (bouton « Deploy on Hostinger ») | Commission sur la vente, non récurrente | https://www.hostinger.com/affiliates [F] |
| Programmes sur PartnerStack | Variable selon l'éditeur | Paiement PayPal, Stripe ou Airwallex | [F2] |

Lecture [H] : 60 % de 14 à 17 € donnent 8 à 10 € par mois et par client référé, cumulés. Environ 130 à 160 clients actifs suffisent pour 1 000 € nets. C'est la seule famille où le seuil de la grille est atteignable sans gros trafic, à condition de viser une audience de TPE et de créateurs francophones.

### 2.5 Programmes accessibles au Maroc et en Afrique francophone

| Programme | Statut | Source |
|---|---|---|
| Jumia (programme KOL) | Existe selon des sites tiers (commission par vente, jusqu'à 13 % sur 7 jours, minimum 50 $) ; portail kol.jumia.com injoignable et sites jumia.ma, .ci, .sn en 403 depuis le conteneur. Jumia opère au Maroc, en Côte d'Ivoire et au Sénégal, pas au Cameroun ni en RDC | [E] pour le programme ; [F2] pour les pays (`market-afrique-quebec.md`, https://group.jumia.com/) |
| Temu | « disponible dans plus de 80 pays et régions » ; commissions « pouvant atteindre jusqu'à 45 % », taux selon le pays ; un code n'est valable que s'il est saisi dans l'heure qui suit le téléchargement de l'application, puis 30 jours pour commander ; seuil de retrait variable | https://www.temu.com/affiliate_question.html [F] ; Maroc dans la liste selon des tiers [E] |
| AliExpress Portals | Portail joignable mais rendu en JavaScript ; conditions non lues | https://portals.aliexpress.com/ [F pour l'accès] |
| Hébergeurs web | Hostinger ouvert à tous (section 2.4) | [F] |
| Banques en ligne | Aucun programme d'affiliation marocain ou ouest-africain trouvé. En France, l'affiliation bancaire et de crédit touche l'intermédiation réglementée (immatriculation ORIAS des IOBSP) | ACPR, ORIAS [F2] |
| Paris sportifs | Programmes très présents dans l'autocomplétion « code promo » au Sénégal et en Côte d'Ivoire | [F, test] ; exclusion éthique |

**Réserve française.** La loi n° 2026-602 interdit à partir du 1er janvier 2027 toute publicité pour la mode ultra-express, influenceurs compris [F2, `market-france-europe.md`, page du ministère de l'Écologie]. Le périmètre exact (Temu, Shein) dépend des décrets, dont la rubrique était vide [F2].

### 2.6 Pinterest et YouTube comme canaux d'affiliation

- **YouTube Shopping.** Billet Google France du 13 octobre 2026 : « nous lançons le programme d'affiliation YouTube Shopping en France », avec Amazon parmi les catalogues partenaires, et « assouplissant les critères d'éligibilité » ; aucun taux publié [F] — https://blog.google/intl/fr-fr/nouveautes-produits/lunivers-youtube/youtube-shopping-france/. La page d'aide officielle (versions française et anglaise lues le 2026-11-28) réserve le programme aux résidents de 18 pays (Allemagne, Argentine, Brésil, Corée, États-Unis, Inde, Indonésie, Japon, Malaisie, Mexique, Pays-Bas, Philippines, Pologne, Singapour, Taïwan, Thaïlande, Royaume-Uni, Viêt Nam), exige l'adhésion au Programme Partenaire YouTube et exclut les chaînes musicales et « conçues pour les enfants » [F] — https://support.google.com/youtube/answer/13376398. Écart à surveiller.
- **YouTube hors Shopping.** Les liens affiliés en description restent possibles partout. Le Programme Partenaire n'est pas ouvert en Côte d'Ivoire, au Cameroun ni en RDC [F2, `initiatives-economie.md`] : l'affiliation y est la seule monétisation native d'une chaîne. Clarification du 16 juillet 2026 : la section « inauthentic content » devient « generic or repetitive content », et les chaînes qui en vivent sont retirées du programme, que le contenu soit produit par IA ou non [F2, TechCrunch, Tubefilter].
- **Pinterest.** Les liens affiliés sont admis ; l'outil « partenariat rémunéré » est ouvert à certains créateurs en France et en Suisse ; l'étiquetage de produits est disponible en France [F2, page créateurs Pinterest en français et presse]. Pinterest est le canal de découverte visuel le moins dépendant de Google pour la maison, la cuisine, la mode et le voyage [H]. Pour la mesure, Pinterest regroupe le Maroc avec la Turquie (`PLAN.md`, section 2) [F2].

---

## 3. Encaissement et statut

### 3.1 Résident marocain

| Élément | Règle | Niveau |
|---|---|---|
| Rails | Awin : Payoneer [F] ; Impact : virement international ou PayPal [F2] ; PartnerStack : PayPal [F2] ; CJ : Payoneer ou virement [E] ; Amazon : virement à confirmer, chèque en euros [H] | voir 2.1, 2.2 |
| PayPal en réception | Retrait vers banque marocaine, carte ou Cash Plus (instantané depuis septembre 2025) ; 3 % de conversion rapportés ; compte assimilé à un compte à l'étranger selon une source citée | [F2] `market-maroc-maghreb.md` |
| Payoneer | Retrait vers une banque marocaine selon des tiers, 2 à 5 jours, jusqu'à 3 % de frais plus 0,5 à 3,5 % d'écart de change ; aucune page Payoneer officielle lue | [E] grey.co |
| Compte en devises (IGOC 2026) | Les personnes physiques marocaines résidentes, non inscrites au registre du commerce, « disposant de revenus de source étrangère » peuvent ouvrir un compte en devises ou en dirhams convertibles crédité de « jusqu'à 70% des revenus de sources étrangères rapatriées », le reste étant cédé ; déclaration écrite à la banque précisant la nature de l'opération | [F] texte de l'IGOC 2026 (https://www.oc.gov.ma/sites/default/files/reglementation/pdf/2026-01/IGOC%202026.pdf) |
| Rapatriement | Les exportateurs de services rapatrient « le montant intégral » sous 90 jours après la prestation | [F] IGOC 2026 ; son application à une commission d'affiliation est une interprétation [H] |
| Dépenses en devises | Dotation e-commerce de 20 000 DH par an pour un particulier, 50 000 DH pour une société nouvelle | [F] IGOC 2026 |
| Auto-entrepreneur | Plafond de 200 000 DH pour les services, impôt de 1 % du chiffre d'affaires, retenue de 30 % au-delà de 80 000 DH par an avec un même client ; liste des activités fixée par arrêté, présence de l'affiliation non vérifiée | [F2] `initiatives-economie.md` ; liste [lacune] |
| Créateurs de contenu | Réponse de la ministre des Finances (mai 2026) : impôt sur le revenu de droit commun, identification à la DGI, déclaration électronique ; TVA sur les prestations publicitaires au-delà de 500 000 DH | [F2] Le360, Hespress, SNRT News |

**Conséquences [H].** (1) Un affilié Amazon réussi a un seul client : la règle des 80 000 DH (environ 7 300 €) est franchie vers 600 € par mois. Son application à un payeur étranger n'est pas tranchée (voir aussi la question 1 de `initiatives-economie.md`). (2) Le revenu de succès de la grille (1 800 à 2 200 € bruts par mois, soit 237 000 à 290 000 DH par an au cours de 10,995 DH pour 1 € de Bank Al-Maghrib, 27 novembre 2026 [F2]) dépasse le plafond de 200 000 DH : le statut n'est perdu qu'après deux années consécutives de dépassement [F2], mais il faut prévoir la bascule vers une société. (3) Le compte en devises « revenus de source étrangère » est la voie naturelle pour payer les outils en dollars au-delà des 20 000 DH de dotation. La variante de la section 9.6 teste une imposition effective de 20 %.

### 3.2 Résident français

| Élément | Règle | Niveau |
|---|---|---|
| Micro-entreprise | Plafond de 83 600 € pour les services ; franchise de TVA jusqu'à 37 500 € ; cotisations de 25,6 % en BNC non réglementé, 21,2 % en prestations BIC | [F2] `initiatives-economie.md` (fiches Service Public vérifiées) |
| BNC ou BIC | Aucune doctrine BOFiP propre à l'affiliation trouvée. Le BOFiP classe les « mandataires » et autres intermédiaires en BNC ; des praticiens retiennent BNC ou BIC selon le contrat | [F2] extraits BOFiP ; [E] cabinet d'expertise |
| Choix de la grille | BNC à 25,6 %, l'hypothèse la plus prudente ; un classement en BIC prestations (21,2 %) augmenterait le revenu net d'environ 6 % | [H] |
| TVA | Commissions versées par Amazon EU (Luxembourg) ou un réseau européen : autoliquidation entre assujettis au-delà de la franchise [CI] | à vérifier |

### 3.3 Belgique, Suisse, Québec, UEMOA, Afrique centrale

- **Belgique** : rails identiques à la France ; programme amazon.com.be à taux élevés ; numéro d'entreprise visible exigé pour les influenceurs ; régime fiscal des indépendants non recherché [F2, `market-france-europe.md`].
- **Suisse** : pas d'amazon.ch ; inscription possible sur amazon.fr ou amazon.de, paiement en euros [H] ; Awin paie en francs suisses en domestique [F2] ; pas de loi influenceurs [F2].
- **Québec** : amazon.ca, versements en dollars canadiens [F pour le barème] ; Awin, CJ et Impact paient en CAD [F2] ; 83 % des cyberacheteurs québécois ont acheté sur Amazon, mais 48 % ont réduit leurs achats auprès de marchands américains [F2, `market-afrique-quebec.md`].
- **UEMOA (SN, CI)** : rails Payoneer et PayPal non vérifiés ; Jumia présent ; « code promo » dominé par les paris [F, test].
- **Afrique centrale (CM, RDC)** : pas de Jumia, pas de Programme Partenaire YouTube [F2] ; Paddle exclut la RDC [F2] ; rails d'affiliation non vérifiés.

---

## 4. Cadre légal et règles de plateforme

### 4.1 France : loi influenceurs appliquée à l'affiliation

| Point | Contenu | Niveau |
|---|---|---|
| Champ | Le guide officiel de bonne conduite cite parmi les contreparties qui font d'une publication une pratique commerciale : « paiement, partenariat, pourcentage sur les ventes, produits gratuits, voyages, invitations » | [F] guide DGE, mars 2023, copie DREETS Grand Est : https://grand-est.dreets.gouv.fr/sites/grand-est.dreets.gouv.fr/IMG/pdf/guide_bonne_conduite_influenceurs.pdf ; version 2026 mise à jour le 9 juin 2026 (https://www.entreprises.gouv.fr/la-dge/publications/guide-de-bonne-conduite-de-linfluence-commerciale), PDF non lisible (403) |
| Mention | Visible sans action de l'utilisateur, pendant toute la promotion, en français, avec le nom de l'annonceur : « publicité », « collaboration commerciale », « partenariat rémunéré avec »… ; « #Ad » et « #advertisement » ne sont pas valables ; taguer la marque ne suffit pas | [F] même guide |
| Sanction | Pratique commerciale trompeuse : deux ans d'emprisonnement et 300 000 € d'amende | [F] même guide |
| Contrat écrit | Obligatoire depuis le 1er janvier 2026 au-delà de 1 000 € HT par an (rémunérations et avantages en nature) pour un même objectif promotionnel ; clauses : identité et pays de résidence fiscale, missions, rémunération, droits et obligations, droit français si le public visé est établi en France ; à peine de nullité | [F] https://entreprendre.service-public.gouv.fr/actualites/A18674 (3 décembre 2025), décret n° 2025-1137 |
| Tension avec Amazon | L'accord Amazon Partenaires est régi par le droit luxembourgeois [F] ; un affilié Amazon au-delà de 1 000 € HT n'a pas de contrat conforme à la clause de droit français. La notion de « même objectif promotionnel » appliquée à des milliers de produits n'est pas tranchée | [H], question ouverte |
| Secteurs | Promotion interdite : chirurgie et médecine esthétiques, abstention thérapeutique, nicotine, produits financiers risqués et crypto-actifs hors prestataires agréés, pronostics sportifs, animaux sauvages ; jeux d'argent seulement sur des plateformes qui excluent les mineurs ; mode ultra-express à partir du 1er janvier 2027 | [F2] `market-france-europe.md` |
| Correction d'un dossier compagnon | Le décret n° 2026-233 du 30 mars 2026 et l'arrêté du 26 mai 2026 précisent les mentions pour la promotion des **formations professionnelles financées par des fonds publics** ; `market-france-europe.md` les présente comme les mentions générales de l'influence commerciale | [F] page DGE |

### 4.2 Comparateurs et avis en ligne (France)

- **Comparateurs (article L111-7 du code de la consommation)** : expliquer les critères de classement dans une rubrique dédiée, signaler toute relation contractuelle ou capitalistique et toute rémunération qui influence le classement, mention « annonce » sur les résultats payés ; amende administrative jusqu'à 75 000 € pour une personne physique [F2, INC, CMS, fiche economie.gouv]. Un jugement de 2020 limite le régime aux sites qui classent par algorithme [F2]. Un comparatif d'affiliation qui trie des produits entre dans ce champ [H].
- **Avis (L111-7-2 et D111-16)** : information loyale sur la publication et le traitement des avis, l'existence d'un contrôle et d'une contrepartie ; les avis d'experts et recommandations en sont exclus [F2]. La directive Omnibus a ajouté à la liste noire les faux avis et l'affirmation non fondée que des avis émanent de consommateurs [CI].
- **Lecture [H]** : un comparatif qui affiche des « notes » doit dire qu'il s'agit de tests de l'éditeur, comment il classe, et qu'il touche une commission. La grille compte cette conformité dans les heures de construction.

### 4.3 Finance

L'affiliation de crédit et d'assurance relève de l'intermédiation réglementée (immatriculation ORIAS, mentions de statut et de liens financiers) [F2, ACPR, ORIAS] ; la promotion de produits financiers risqués et de crypto-actifs est encadrée par la loi influenceurs et l'AMF [F2]. L'outil doit exclure ces niches des archétypes d'affiliation automatisés.

### 4.4 Maroc

- Aucun dispositif spécifique à la publicité des influenceurs ni d'obligation de signaler une collaboration commerciale, selon Medias24 (19 février 2026) [F2, extrait de recherche, article en 403].
- Fiscalité clarifiée en mai 2026 (impôt sur le revenu de droit commun, identification et déclaration à la DGI) [F2].
- Un projet de régulation des réseaux sociaux inspiré du DSA est en préparation, centré sur les mineurs et la modération [F2, APA News, Hespress].
- La loi 31-08 sur la protection du consommateur réprime la publicité trompeuse [CI].
- **Lecture [H]** : l'absence de règle n'est pas une licence. Un fondateur résidant au Maroc qui vise la France reste soumis à la loi française pour un public établi en France (la loi vise aussi les influenceurs établis hors de l'UE, selon `market-france-europe.md` [F2]).

### 4.5 Règles de Google pour les sites d'affiliation

Page « Spam policies for Google web search », mise à jour le 2026-11-23, lue le 2026-11-28 [F] — https://developers.google.com/search/docs/essentials/spam-policies

| Politique | Ce que dit Google |
|---|---|
| Thin affiliation | Pages avec liens affiliés dont les descriptions et avis sont copiés du marchand « without any original content or added value », gabarits répliqués sur plusieurs domaines ou langues. Bonnes pratiques citées : « additional information about price, original product reviews, rigorous testing and ratings, navigation of products or categories, and product comparisons » |
| Scaled content abuse | « many pages are generated for the primary purpose of manipulating search rankings », dont « Using generative AI tools or other similar tools to generate many pages without adding value for users », le scraping, les traductions automatiques et la création de plusieurs sites pour masquer l'échelle |
| Site reputation policy | Contenu tiers publié sur un site hôte « mainly because of that host's already-established ranking signals ». Les liens affiliés dans une page ne sont pas en cause s'ils sont « treated appropriately ». **Dans l'EEE**, pas d'action manuelle mais un classement séparé du domaine principal ; hors EEE, action manuelle possible ; médiation ouverte aux sites éligibles. Exemples détaillés pour les sections « codes promo » |
| Liens | Les programmes exigent `rel="sponsored"` sur les liens affiliés (rappel de la fiche Viator sur Awin) [F] |

Le système « avis produits » de Google a été intégré aux mises à jour principales [CI, non revérifié].

### 4.6 Effet des résumés IA sur le trafic d'affiliation

| Mesure | Résultat | Niveau |
|---|---|---|
| Pew Research (USA, mars 2025, 900 adultes) | Clic sur un résultat classique : 8 % des visites avec résumé IA, 15 % sans ; 1 % sur un lien du résumé | [F2] `initiatives-economie.md` |
| Expérience de terrain préenregistrée (USA, 17-19 mars 2026, 1 444 inscrits, 1 100 actifs, 10 jours) | Mode IA seul : -18,8 points de taux de clic externe (IC 95 % : -22,2 à -15,3) ; sans IA : +8,8 points (effet local moyen, IC 2,3 à 15,3), +2,7 points en intention de traiter (non significatif) ; pas de ventilation par intention commerciale | [F] https://arxiv.org/abs/2608.18352 (Wang, Gleason, Bart, Wilson, Metaxa, soumis le 18 août 2026, prépublication) |
| Seer Interactive, Ahrefs, Press Gazette | Baisse de 34 à 61 % du taux de clic organique selon les études | [E] chiffres cités par des blogs, sources primaires non lues |
| France | Aperçus IA et Mode IA lancés le 22 juillet 2026, déploiement achevé au plus tard le 23 septembre 2026, après deux ans de blocage lié aux droits voisins | [F2] billet Google France (https://blog.google/intl/fr-fr/nouveautes-produits/explorez-obtenez-des-r%C3%A9ponses/recherche-ia-apercus-mode/), The Media Leader, Ahrefs |

**Lecture [H].** Le comparatif « meilleur X » est la requête qu'un résumé IA traite le mieux. La France a quatre mois d'exposition ; les USA en ont 30. Le radar peut traiter l'affiliation elle-même comme une tendance décalée : ce qui a résisté aux USA depuis mai 2024 (outils, données propres, newsletters, vidéo incarnée) est la meilleure hypothèse pour la France 2027.

### 4.7 Contenus générés par IA : règles des programmes et des réseaux

| Acteur | Règle | Niveau |
|---|---|---|
| Amazon | Interdit d'utiliser le contenu du programme pour développer ou améliorer des modèles d'IA ; ne pas modifier le contenu du programme | [F] |
| Google | Contenu IA admis s'il apporte une valeur ; la production en masse sans valeur est du spam | [F] |
| YouTube | Contenu générique ou répétitif exclu de la monétisation (clarification de juillet 2026) ; contenu synthétique réaliste à signaler | [F2] |
| UE | AI Act, article 50 (transparence), applicable depuis le 2 août 2026 | [F2] `market-france-europe.md` |
| Loi influenceurs | Mention « Images virtuelles » pour les images générées par IA | [F2] |
| Réseaux (Awin, CJ, Impact, Kwanko) | Aucune règle propre au contenu IA trouvée dans les pages lues | lacune |

---

## 5. Économie

### 5.1 Distribution des revenus des affiliés

| Source | Résultat | Biais | Niveau |
|---|---|---|---|
| Affiliate Booster, « 500+ Publishers », 24 mars 2026 | 8 % en perte ; 33 % entre 1 et 9 999 $ par an ; 41 % sous 1 000 $ par mois ; médiane de 1 200 à 2 500 $ par mois ; moyenne de 8 038 $ ; 74 % de ceux qui font plus de 5 000 $ par mois avaient moins de 500 $ sur leurs six premiers mois ; revenu moyen par canal : e-mail 9 200 $, YouTube 7 800 $, SEO 5 400 $, TikTok 3 600 $, Instagram et Pinterest 2 100 $ | Affiliés « actifs », auto-déclaratif, méthode non publiée, tranches incohérentes | [E] https://affiliatebooster.com/affiliate-marketer-income-real-data-2026-3/ |
| Earnifyhub, 200 affiliés | Médiane de 387 $ par mois ; 61 % sous 500 $ | Échantillon réduit | [E] via recherche |
| TikTok Shop USA | Top 0,5 % des affiliés : environ 38 % des commissions | Source marchande | [E] `trends-us-business.md` |
| Baromètre de l'influence UMICC et CPA (France, avril 2024 à mai 2025) | Environ 2 000 annonceurs ont utilisé l'affiliation via des créateurs, 140 M€ de ventes, 15 M€ de commissions reversées, panier moyen de 58 € ; nombre de créateurs non publié | Périmètre créateurs | [F2] Les Gens d'Internet, 4 novembre 2025 |
| Baromètre de l'affiliation CPA 2024 | Ventes +37 %, panier moyen passé de 100 à 80 € ; cookies tiers sur 15 % des programmes fin 2023 | Agrégat de réseaux | [F2] The Media Leader, 15 avril 2024 |
| TrustMRR | TapRefer (annuaire de programmes d'affiliation) : 675 $ sur 30 jours ; Directory Launch : 211 $ | Vitrine auto-sélectionnée | [F2] `initiatives-economie.md` |

**Lecture.** Aucune médiane fiable n'existe pour un affilié débutant. Les enquêtes publiques décrivent des survivants. Le chiffre français le plus solide est agrégé : 15 M€ de commissions par an pour l'affiliation via créateurs dans tout le pays [F2], soit un marché étroit pour un nouvel entrant. La grille retient des probabilités de 2 à 8 % d'atteindre 1 000 € nets par mois à 12 mois [H], sous les 17,3 % de RevenueCat pour les apps en deux ans [F2].

### 5.2 Délai au premier euro

| Étape | Délai | Niveau |
|---|---|---|
| Indexation et premières positions d'un site neuf | 3 à 6 mois | [CI] |
| Attribution Amazon | 24 heures, ou 89 jours si mis au panier | [F] |
| Versement Amazon | Environ 60 jours après la fin du mois, dès 25 € | [F] |
| GetYourGuide, Viator | Commission validée après l'activité, cookie de 30 jours | [F] |
| Temu | Code saisi dans l'heure qui suit le téléchargement, commande sous 30 jours | [F] |
| Revenu « significatif » | 6 à 18 mois selon l'enquête Affiliate Booster | [E] |

Un comparatif SEO lancé en décembre 2026 encaisse donc au mieux vers avril ou mai 2027 [H].

### 5.3 Coûts d'une initiative d'affiliation (6 mois)

| Poste | Coût | Niveau |
|---|---|---|
| Claude Pro (Claude Code inclus) | 20 $ par mois | [F2] `initiatives-economie.md` |
| Hébergement statique (Vercel Hobby ou Pro) | 0 à 20 $ par mois | [F2] |
| Domaine | environ 10 à 15 € par an | [CI] |
| beehiiv | gratuit jusqu'à 2 500 abonnés, puis 49 $ par mois | [F2] |
| Produits à tester (comparatif à données propres) | 300 à 500 €, en partie revendus | [H] |
| Test d'acquisition payant | 50 à 100 € | [H] |

Total de 200 à 800 € selon l'archétype, sous le plafond de 1 000 € par initiative.

### 5.4 Économie unitaire : ce qu'il faut pour 1 000 € nets par mois

Calcul de l'auteur, résident français en BNC : 1 000 € / (1 - 0,256) ≈ 1 344 € de commissions brutes par mois [calcul].

| Programme | Commission unitaire | Volume mensuel nécessaire |
|---|---|---|
| amazon.fr, maison (5 %), panier de 60 € | 3 € | environ 450 commandes, soit environ 27 000 € de ventes |
| amazon.com.be, maison (10 %), panier de 60 € | 6 € | environ 225 commandes |
| amazon.fr, électronique mobile (2,5 %) | 1,5 € | environ 900 commandes |
| GetYourGuide, 7 % d'une activité à 60 € | 4,2 € | environ 320 réservations |
| Viator, 4 % d'une activité à 60 € | 2,4 € | environ 560 réservations |
| Systeme.io, 60 % de 14 à 17 € par mois | 8 à 10 € par mois et par client | 130 à 160 clients actifs cumulés |
| Hostinger, 40 % d'un achat de 60 € (prix supposé) | 24 € | environ 56 ventes |

Avec 20 à 30 % de clics sortants depuis une page de comparatif et 5 à 10 % de conversion chez Amazon [H], 450 commandes demandent environ 25 000 visites par mois : c'est l'ordre de grandeur d'un site de niche installé, pas d'un site de 12 mois tenu à 8 h par semaine.

### 5.5 Ce que Claude Code automatise, et ce qui est interdit

| Tâche | Automatisable | Limite |
|---|---|---|
| Construire le site, les gabarits, le maillage, les données structurées | Oui | — |
| Outils interactifs (calculateurs, filtres, simulateurs) | Oui, c'est le meilleur levier | — |
| Collecte de prix et de disponibilité | Partiellement : flux des réseaux ; Creators API après 10 ventes [E] ; pas de scraping d'Amazon (captcha sur amazon.fr [F2]) | Conditions d'utilisation |
| Veille des barèmes et des conditions | Oui (pages publiques, section 6) | — |
| Rédaction des textes | Brouillon oui | Production en masse sans valeur ajoutée = « scaled content abuse » [F] |
| Tests, photos, mesures | Non | C'est la valeur défendable |
| Avis clients | Non | Avis rémunérés interdits par Amazon [F] ; faux avis interdits [CI] |
| Entraîner un modèle sur le contenu Amazon | Non | Interdit par l'accord [F] |
| Mentions légales, rubrique « comment nous classons » | Oui, gabarit | À relire par un humain |
| Vidéo incarnée | Scripts, montage, miniatures | Présence humaine non automatisable |

Part automatisable estimée [H] : 60 à 85 % des heures de construction d'un outil ou d'un comparatif, 30 à 50 % de l'exploitation d'une newsletter, 25 à 35 % d'une chaîne vidéo.

### 5.6 Modèles qui résistent en 2026, modèles qui s'effondrent

| Modèle | Pourquoi | Preuve |
|---|---|---|
| Comparatifs à données propres (tests, mesures, prix historisés) | Cités par Google comme bonnes pages d'affiliation ; non reproductibles par un résumé IA | [F] politique Google ; résistance au trafic [H] |
| Outils gratuits (calculateurs, simulateurs) | Un résumé ne remplace pas un calcul personnalisé ; attire des liens | [H] |
| Newsletters | Audience détenue, revenu moyen le plus élevé de l'enquête par canal (e-mail) | [E] Affiliate Booster ; [F2] beehiiv |
| Vidéo humaine | Confiance, incarnation, exempte de la politique « generic or repetitive » | [E], [F2] |
| Communautés | Recommandation entre pairs | [H] |
| Logiciels à commission récurrente | Revenu cumulatif, commissions de 40 à 60 % | [F] |
| Sites d'avis génériques | Visés par trois politiques Google et par les résumés IA | [F] ; [F2] Pew |
| Codes promo sur domaines tiers | Politique de réputation de site, exemples détaillés de Google | [F] |
| Pages produites en masse par IA | « scaled content abuse » | [F] |

---

## 6. Détection des opportunités d'affiliation par le radar (sources gratuites)

### 6.1 Autocomplétion Amazon : test du 2026-11-28

Appel : `https://completion.amazon.<tld>/api/2017/suggestions?mid=<marketplace>&alias=aps&prefix=<terme>&limit=11&lop=<langue>`, agent `Mozilla/5.0`, sans authentification.

| Hôte | Place de marché (`mid`) | Statut | Extrait pour « creatine » |
|---|---|---|---|
| completion.amazon.fr | A13V1IB3VIYZZH | 200 | creatine monohydrate, creatine creapure, creatine gélules, creatine gummies, creatine nutripure |
| completion.amazon.com | ATVPDKIKX0DER | 200 | creatine monohydrate, creatine gummies, creatine for women, thorne creatine |
| completion.amazon.ca | A2EUQ1WTGCTBG2 | 200 | creatine gummies, creatine for women, arrae creatine gummies |
| completion.amazon.com.be | AMEN7PMS3EDWL | 200 | creatine 5g, creatine creapure, creatine gummies |
| completion.amazon.de | A1PA6795UKMFR9 | 200 | esn creatine, esn creatine gummies |
| completion.amazon.co.uk | A1F83G8C2ARO7P | 200 | creatine gummies, creatine tablets, warrior creatine |
| completion.amazon.ae, .eg, .sa | A2VIGQ35RCS4UG, ARBP9OOSHTCHU, A17E79C6D8DWNP | 200 | creatine monohydrate, creatine gummies, marques locales (redrex, evolve) en Égypte |

Le même hôte `completion.amazon.co.uk` répond aussi avec le `mid` belge : c'est le paramètre `mid` qui choisit la place de marché [F, test]. Il n'existe pas de place de marché Amazon au Maroc ni en Afrique subsaharienne francophone ; .ae, .eg et .sa servent de proxys arabophones [F pour l'absence de vitrine ; H pour l'usage].

**Paires USA / France relevées** [F, instantané ; interprétation H] :

| Terme | USA | France | Lecture |
|---|---|---|---|
| creatine for women / creatine femme | « creatine for women over 50 », « collagen and creatine for women » | « creatine femme 50 ans », « creatine femme ménopause », « creatine femme fesse » | Arrivée, au stade de l'achat |
| walking pad | « with incline », « under desk », « with vibration plate » | « pliable », « inclinable », modèles nommés (A1 Pro, Z1) | Arrivé |
| mouth tape / bande buccale | « for sleeping women », marques | « mouth tape enfant », « bande buccale anti ronflement » | Arrivé |
| red light therapy | « for face », « for dogs », « shower head » | « mask », « cheveux », « lampe rouge sommeil, mélatonine » | Arrivé, vocabulaire mixte |
| sea moss | « electrolytes packets », « gummies for clearing mucus » | « gel bio », « gummies 16 in 1 » | Arrivé |
| colostrum | « cowboy colostrum », « armra », « weight loss » | « colostrum bovin », « colostrum chien » | Variante adulte peu présente |
| glp | patchs et compléments « GLP-1 » | « glp1 perte de poids très vite », « glp-1 gélules » | Allégations santé risquées : exclusion |

Le capteur montre surtout que la plupart des tendances bien-être US sont déjà commerciales sur amazon.fr. Pour l'affiliation, la fenêtre est le vocabulaire et la variante (âge, usage) avant les comparatifs français, pas l'absence du produit [H].

### 6.2 Autocomplétion Google par pays : test du 2026-11-28

| Requête | Maroc | France | Sénégal | Côte d'Ivoire | Belgique | Québec |
|---|---|---|---|---|---|---|
| « code promo » | jumia, glovo, 1xbet, zalando, temu | zalando, boulanger, amazon, cdiscount, fnac | 1xbet, linebet, melbet, mojabet, winwin | betclic, 1xbet, bet360 | zalando, amazon, farmaline, fnac | salvatore, simons, sephora, amazon, air transat |
| « esim » | maroc telecom, inwi, orange maroc | free, maroc, orange, bouygues | orange sénégal, yas, expresso | mtn ci, orange ci, moov | proximus, belgique, maroc, turquie | canada, europe, france, usa, airalo |
| « comparatif » | iphone, voiture, tarifs bancaires maroc | aspirateur laveur, électricité, mutuelle, box internet | iphone, (grammaire) | iphone, samsung | amazon, électricité belgique, compte épargne belgique | pneus, carte de crédit, taux prêt personnel québec |

Toutes les requêtes ont répondu HTTP 200 [F]. **Limite observée** : pour une requête longue (« temu maroc », « aliexpress maroc », « activité marrakech »), les suggestions sont identiques quel que soit le paramètre `gl` [F] : le pays ne différencie que les préfixes courts. Le radar doit donc tester des préfixes courts par pays et ne pas conclure à une absence sur une requête longue.

### 6.3 Autres sources gratuites pour détecter les opportunités

| Signal | Source gratuite | Statut testé |
|---|---|---|
| Changement de barème | Pages d'aide publiques Amazon (FR, BE, CA, US : nœud `GRXPHT8U84RAYDXZ`) | 200 [F] ; à comparer chaque semaine |
| Nouveau programme ou nouveau taux | Fiches annonceurs publiques Awin (`ui.awin.com/merchant-profile/<id>`), annuaire Tradedoubler, pages ArabClicks | 200 [F] |
| Ouverture d'un rail | Page d'aide YouTube Shopping (liste des pays), billets Google France, FAQ Temu, page Partenaires Amazon Influenceurs | 200 [F] |
| Règle de classement | Page des politiques anti-spam de Google (« Last updated ») | 200 [F] |
| Produits en hausse aux USA | Amazon Best Sellers US (200) ; Movers & Shakers rendu en JavaScript ; Best Sellers FR bloqué par captcha | [F2] `sources-open.md` |
| Intérêt local | Autocomplétion Google par pays et qualificatifs « prix maroc », « maroc dh » | 200 [F] |
| Tendance visuelle | Pinterest Trends (US, FR, CA, GB ; Maroc regroupé avec la Turquie) | [F2] `PLAN.md` |
| Demande touristique | Statistiques mensuelles d'arrivées (ministère du Tourisme, DEPF) | [F2] |

---

## 7. Adéquation par pays, par niche et par lifestyle

### 7.1 Par pays (vendeur = résidence du fondateur ; acheteur = public visé)

| Archétype | FR | BE | CH | QC | MA | SN | CI |
|---|---|---|---|---|---|---|---|
| Comparatif à données propres | Bonne, taux Amazon bas | Très bonne (taux ×2), marché réduit | Moyenne (pas d'amazon.ch) | Bonne (amazon.ca) | Bonne en export vers FR et BE ; marché local sans Amazon | Export seulement | Export seulement |
| Newsletter affiliée | Bonne | Bonne | Bonne | Bonne | Bonne en export ; localement, chaîne WhatsApp | Export | Export |
| Voyage Maroc | Acheteur | Acheteur | Acheteur | Acheteur | **Vendeur idéal** (terrain) | Faible | Faible |
| SaaS récurrent | Bonne (TPE, créateurs) | Bonne | Bonne | Bonne | Bonne en export ; acheteurs marocains bridés par la dotation de 20 000 DH | Export | Export |
| Vidéo humaine | Bonne si présence à l'écran | Bonne | Bonne | Bonne | Export ; YPP ouvert | YPP ouvert | Affiliation seule (pas de YPP) |
| Outil interactif | Bonne | Bonne | Bonne | Bonne | Bonne | Moyenne | Moyenne |
| Bons plans locaux | Saturé | Moyen | Faible | Moyen | Moyen (Jumia, Glovo, Temu) | Faible (paris) | Faible (paris) |
| Avis générique IA | À proscrire partout | | | | | | |

### 7.2 Par niche et par lifestyle

| Niche | Commission type | Contrainte | Lifestyle cible |
|---|---|---|---|
| Maison, cuisine, bricolage | 5 % FR, 10 % BE, 4 à 6 % CA [F] | Concurrence SEO forte | Jeunes parents, télétravailleurs (walking pad) |
| Sport et fitness | 4 % FR, 10 % BE [F] | Allégations des compléments | Coureurs, Hyrox, padel |
| Beauté | 4 % FR, 10 % BE [F] | Chirurgie et médecine esthétiques interdites de promotion [F2] | Créatrices, 25-44 ans |
| Voyage au Maroc | 4 à 7 % [F] | Saisonnalité, validation après le séjour | Touristes FR, BE, QC ; diaspora |
| Logiciels pour TPE et créateurs | 40 à 60 % [F] | Programmes qui changent leurs conditions | Indépendants, TPE, créateurs |
| Finance, crédit, assurance | Élevée [CI] | ORIAS, AMF [F2] | **Exclu** |
| Santé, GLP-1, compléments | 3 à 4 % [F] | Allégations ; « glp1 perte de poids très vite » | **Exclu** sauf contenu d'accompagnement |
| Paris, crypto non agréée | Élevée [CI] | Loi influenceurs, éthique | **Exclu** |
| Mode ultra-express | Jusqu'à 45 % chez Temu [F] | Publicité interdite en France au 1er janvier 2027 [F2] | **Exclu en France** |

---

## 8. L'affiliation comme couche de monétisation

| Archétype de la grille | Ce que l'affiliation ajoute | Effet [H] |
|---|---|---|
| `newsletter_media` | Revenu dès quelques centaines d'abonnés, avant le sponsoring | Avance le premier euro de plusieurs mois |
| `communaute_payante` | Recommandations d'outils et de matériel | Faible, risque de confiance |
| `chaine_sans_visage` | Seule monétisation native en CI, au CM et en RDC (pas de YPP) | Débloque l'archétype, sans le rendre rentable |
| `geo_visibilite`, `agence_automatisation` | Commissions SaaS sur les outils recommandés aux clients | Complément récurrent, à déclarer au client |
| `extension_chrome`, `micro_saas` | Liens contextuels vers des services complémentaires | Faible |
| `seo_prog_annuaire` (rail `ads_affil`) | Déjà prévu | Exposé aux politiques Google [F] |

Pour l'outil, l'affiliation se modélise mieux comme un rail secondaire attaché à un actif que comme un archétype isolé [H].

---

## 9. Paramètres pour la grille

### 9.1 Lignes au format du dictionnaire A

```python
AFFIL = {
 'affil_comparatif_donnees': dict(hrun=20, p12=.06, Rs=2200, m=.85, T1=18, C=700, h=200, L=.65, D=2.5, Rp=.35, orient='export', rail='amazon_affil',  regime='bnc'),
 'affil_newsletter':         dict(hrun=16, p12=.05, Rs=2000, m=.85, T1=10, C=500, h=180, L=.45, D=3.5, Rp=.15, orient='export', rail='reseaux_affil', regime='bnc'),
 'affil_voyage_maroc':       dict(hrun=18, p12=.08, Rs=1800, m=.90, T1=18, C=500, h=200, L=.60, D=3.0, Rp=.35, orient='export', rail='voyage_affil',  regime='bnc'),
 'affil_saas_recurrent':     dict(hrun=15, p12=.07, Rs=1800, m=.90, T1=10, C=400, h=180, L=.70, D=2.5, Rp=.25, orient='export', rail='saas_affil',    regime='bnc'),
 'affil_video_humaine':      dict(hrun=30, p12=.06, Rs=2000, m=.85, T1=16, C=800, h=220, L=.35, D=3.0, Rp=.30, orient='export', rail='amazon_affil',  regime='bnc'),
 'affil_outil_interactif':   dict(hrun=12, p12=.06, Rs=1800, m=.85, T1=14, C=500, h=160, L=.85, D=3.0, Rp=.25, orient='export', rail='reseaux_affil', regime='bnc'),
 'affil_bons_plans_local':   dict(hrun=25, p12=.05, Rs=1500, m=.90, T1=6,  C=200, h=180, L=.50, D=1.5, Rp=.45, orient='local',  rail='local_affil',   regime='bnc'),
 'affil_avis_generique_ia':  dict(hrun=10, p12=.02, Rs=1500, m=.90, T1=16, C=400, h=120, L=.90, D=0.5, Rp=.70, orient='export', rail='amazon_affil',  regime='bnc'),
}
```

`orient='export'` signifie que l'acheteur paie en euros ou en dollars canadiens hors du pays du fondateur (public français, belge ou québécois) : le revenu ne dépend pas du pouvoir d'achat local. Seuls les bons plans locaux visent l'acheteur du pays de résidence.

**Justification commune.** *p12* (probabilité d'atteindre 1 000 € nets par mois à 12 mois) est placé sous les 17,3 % de RevenueCat en deux ans [F2] et sous le *p12* de 0,08 de `seo_prog_annuaire`, sauf pour le voyage, à cause de l'absence de médiane publiée (5.1), du délai SEO (5.2), des résumés IA arrivés en France en juillet 2026 [F2] et de la petite taille du marché français de l'affiliation via créateurs (15 M€ de commissions par an [F2]). *Rs* est le revenu brut mensuel médian des cas réussis : il doit dépasser 1 000 / (m × (1 - 0,256)) ≈ 1 500 à 1 600 € pour franchir le seuil, d'où 1 800 à 2 200 € [H]. *h* reste sous 220 h sur 6 mois (moins de 10 h par semaine) et *hrun* sous 25 h par mois, sauf la vidéo. *C* reste sous 800 €.

| Archétype | Valeur | Justification | Niveau |
|---|---|---|---|
| **affil_comparatif_donnees** | hrun 20 | 2 à 4 mises à jour ou tests par mois, relevés de prix | [H] |
| | p12 0,06 | 25 000 visites par mois nécessaires sur amazon.fr (5.4) ; résumés IA en France | [H] ancré [F] |
| | Rs 2 200 | Médiane de succès au-dessus du seuil | [H] |
| | m 0,85 | Achat de produits à tester, hébergement | [H] |
| | T1 18 | Indexation de 3 à 6 mois [CI], versement 60 jours après la fin du mois [F] | [F]/[CI] |
| | C 700 | Produits à tester (300 à 500 €), domaine, Claude Pro | [H] |
| | h 200 | 8 h par semaine | [H] |
| | L 0,65 | Site et données automatisables ; tests et photos humains ; pas de Creators API avant 10 ventes [E] | [H] |
| | D 2,5 | Données de test propres, mais dépendance à Google | [H] |
| | Rp 0,35 | Politiques Google [F], résumés IA [F], barème Amazon modifiable avec 7 jours de préavis [F] | [H] ancré [F] |
| **affil_newsletter** | hrun 16 | Une édition par semaine, 3 à 4 h | [H] |
| | p12 0,05 | Croissance organique lente ; revenu par abonné faible sans sponsoring | [H] |
| | Rs 2 000, m 0,85 | beehiiv gratuit puis 49 $ par mois | [F2] |
| | T1 10 | Premiers clics dès quelques centaines d'abonnés, plus le délai de versement | [H] |
| | C 500, h 180 | Outil d'envoi, test d'acquisition de 100 € | [H] |
| | L 0,45 | Veille et curation automatisables (le radar lui-même), ton et confiance humains | [H] |
| | D 3,5 | Audience détenue (même valeur que `newsletter_media`) | [F2] |
| | Rp 0,15 | Peu de dépendance à une plateforme | [H] |
| **affil_voyage_maroc** | hrun 18 | Mises à jour saisonnières, vérifications de terrain | [H] |
| | p12 0,08 | 19,8 M d'arrivées en 2025 [F2], recherches françaises structurées [F] ; concurrence de Booking et GetYourGuide | [H] |
| | Rs 1 800, m 0,90 | 4 à 7 % par activité [F] | [H] |
| | T1 18 | Commission validée après le voyage [F], indexation | [F]/[H] |
| | C 500, h 200 | Déplacements limités, photos | [H] |
| | L 0,60 | Outils (budget, eSIM, itinéraires) automatisables ; vérification sur place humaine | [H] |
| | D 3,0 | Données et photos de terrain | [H] |
| | Rp 0,35 | Résumés IA sur les requêtes de voyage, changements de réseau (Booking passé à CJ [F]), chocs touristiques | [H] |
| **affil_saas_recurrent** | hrun 15 | Mises à jour des tutoriels et comparatifs | [H] |
| | p12 0,07 | 130 à 160 clients actifs suffisent (5.4) ; concurrence forte sur « meilleur logiciel » | [H] ancré [F] |
| | Rs 1 800, m 0,90 | 40 à 60 % de commission [F] | [H] |
| | T1 10 | Essai puis paiement en 14 à 30 jours, versements mensuels | [H] |
| | C 400, h 180 | Abonnements de test, souvent gratuits | [H] |
| | L 0,70 | Claude Code excelle sur le logiciel : démonstrations, modèles, scripts | [H] |
| | D 2,5 | Stock d'abonnés récurrent, expertise | [H] |
| | Rp 0,25 | Conditions modifiables (« à vie » vers 12 mois), résumés IA | [H] |
| **affil_video_humaine** | hrun 30 | Une vidéo par semaine : tournage, montage, publication. **Au-dessus de la porte de 25 h** | [H] |
| | p12 0,06 | Canal YouTube bien placé dans l'enquête [E] ; YouTube Shopping non ouvert officiellement en France [F] | [H] |
| | Rs 2 000, m 0,85 | Matériel, produits | [H] |
| | T1 16, C 800, h 220 | Micro, lumière, produits | [H] |
| | L 0,35 | Présence humaine ; scripts et montage assistés | [H] |
| | D 3,0 | Visage et confiance | [H] |
| | Rp 0,30 | Algorithme, politique « generic or repetitive » [F2] | [H] |
| **affil_outil_interactif** | hrun 12 | Maintenance, mise à jour des données | [H] |
| | p12 0,06 | Peu substituable par un résumé IA, mais découverte difficile | [H] |
| | Rs 1 800, m 0,85 | API, hébergement | [H] |
| | T1 14, C 500, h 160 | Un outil en 10 à 20 h, puis distribution | [H] |
| | L 0,85 | Cœur de compétence de Claude Code | [H] |
| | D 3,0 | Fonction et données propres | [H] |
| | Rp 0,25 | Moins exposé à « thin affiliation » [F] | [H] |
| **affil_bons_plans_local** | hrun 25 | Publication quotidienne (WhatsApp, Telegram, TikTok) | [H] |
| | p12 0,05 | Offres non exclusives, concurrence | [H] |
| | Rs 1 500 (× ppp local), m 0,90 | Commissions Jumia, Temu, AliExpress | [E] |
| | T1 6 | Commissions rapides (Temu : 1 h puis 30 jours [F]) | [F]/[H] |
| | C 200, h 180 | Quasi sans outil | [H] |
| | L 0,50 | Veille des prix automatisable, animation humaine | [H] |
| | D 1,5 | Communauté, offres banalisées | [H] |
| | Rp 0,45 | Programmes opaques [F], interdiction ultra-express en France [F2], domination des paris en SN et CI [F] | [H] |
| **affil_avis_generique_ia** (contre-exemple) | p12 0,02, D 0,5, Rp 0,70, L 0,90 | Exactement ce que visent « thin affiliation » et « scaled content abuse » [F] ; Directory Launch à 211 $ [F2] | [H] ancré [F] |

### 9.2 Nouveaux rails : coefficient d'encaissement `pay` par pays (côté vendeur)

| Rail | France | Belgique | Suisse | Québec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) |
|---|---|---|---|---|---|---|---|
| `amazon_affil` | 1,0 | 1,0 | 0,9 | 1,0 | 0,6 | 0,5 | 0,4 |
| `reseaux_affil` | 1,0 | 1,0 | 1,0 | 1,0 | 0,75 | 0,6 | 0,5 |
| `voyage_affil` | 1,0 | 1,0 | 1,0 | 1,0 | 0,75 | 0,6 | 0,5 |
| `saas_affil` | 1,0 | 1,0 | 1,0 | 1,0 | 0,8 | 0,6 | 0,4 |
| `local_affil` | 0,9 | 0,9 | 0,7 | 0,8 | 0,5 | 0,5 | 0,3 |

Justifications :

- `amazon_affil` : virement SEPA dès 25 € en France et en Belgique [F] ; Suisse sans vitrine nationale, paiement en euros [H] ; amazon.ca en CAD [F] ; Maroc et Afrique : participation non exclue [F], virement non confirmé, carte cadeau inutile, rapatriement et plafond de 70 % en devises [F], d'où 0,6, 0,5 et 0,4 [H].
- `reseaux_affil` : Awin paie en CHF et en CAD [F2] ; hors SEPA, Payoneer [F] ; Impact par virement ou PayPal [F2] ; réseaux français pensés pour des éditeurs établis en France [H].
- `voyage_affil` : GetYourGuide et Viator passent par Awin, Booking par CJ [F] : mêmes rails que `reseaux_affil`. Rail séparé pour suivre ses propres changements (Booking passé à CJ, validation après le voyage).
- `saas_affil` : PartnerStack paie par PayPal, ouvert au Maroc en réception [F2] ; Stripe absent au Maroc et en Afrique de l'Ouest, sauf CI via Paystack [F2].
- `local_affil` : Jumia KOL non vérifié [E], Temu dans plus de 80 pays avec règles locales [F], pas de Jumia en Afrique centrale [F2] ; en Suisse, peu de programmes de bons plans [H].

Ajustements `FIT` (multiplicateurs de *p12*) : comparatif ×1,2 et vidéo ×1,1 en Belgique (barème amazon.com.be deux fois plus élevé [F]) ; voyage Maroc ×1,25 au Maroc (terrain), ×0,9 dans l'UEMOA, ×0,8 en Afrique centrale [H] ; bons plans ×0,7 en France, ×0,8 en Belgique, ×0,6 en Suisse (saturation), ×0,8 dans l'UEMOA (paris), ×0,7 en Afrique centrale [H, F pour l'observation].

### 9.3 Exécution

Copie du script dans `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/affil/score_initiatives_affil.py` ; l'original `docs/etude/scripts/score_initiatives.py` n'a pas été modifié (empreinte md5 inchangée, `1883dfa0ae432e6d0f7ba5ae3700fc9e`). Commande : `python3 -I score_initiatives_affil.py`. Sortie brute dans `scores_affil_out.md`, valeurs dans `scores_affil.json` (même dossier). Les nombres ci-dessous sont copiés tels quels (point décimal).

**Scores de base, 27 archétypes (19 de l'axe économie + 8 d'affiliation)**

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
| affil_comparatif_donnees | 44.2 | 44.4 | 44.5 | 44.3 | 42.1 | 40.5 | 39.3 |
| affil_newsletter | 49.4 | 49.4 | 49.6 | 49.5 | 48.8 | 47.1 | 46.0 |
| affil_voyage_maroc | 46.6 | 46.6 | 46.7 | 46.7 | 47.2 | 44.4 | 42.9 |
| affil_saas_recurrent | 50.0 | 50.0 | 50.0 | 50.1 | 50.8 | 49.0 | 47.0 |
| affil_video_humaine | 42.1 | 42.2 | 42.4 | 42.2 | 40.0 | 38.6 | 37.4 |
| affil_outil_interactif | 51.4 | 51.4 | 51.7 | 51.5 | 50.4 | 48.6 | 47.4 |
| affil_bons_plans_local | 46.3 | 46.4 | 46.4 | 46.4 | 45.1 | 44.3 | 43.5 |
| affil_avis_generique_ia | 40.7 | 40.7 | 41.3 | 40.7 | 37.4 | 35.9 | 34.9 |

Les 19 premières lignes reproduisent exactement les résultats de `initiatives-economie.md` (section 8.2) : l'ajout des rails ne modifie pas les archétypes existants.

**Espérance de revenu net sur 24 mois (EUR) et ROI ajusté, archétypes d'affiliation**

| Archetype | E24 FR | ROI FR | E24 BE | ROI BE | E24 QC | ROI QC | E24 MA | ROI MA | E24 UEMOA | ROI UEMOA |
|---|---|---|---|---|---|---|---|---|---|---|
| affil_comparatif_donnees | 766 | -0.04 | 927 | -0.03 | 824 | -0.04 | 612 | -0.17 | 463 | -0.26 |
| affil_newsletter | 809 | -0.02 | 815 | -0.01 | 870 | -0.01 | 807 | -0.05 | 587 | -0.14 |
| affil_voyage_maroc | 885 | -0.01 | 892 | -0.01 | 952 | -0.0 | 1104 | 0.03 | 578 | -0.14 |
| affil_saas_recurrent | 952 | 0.01 | 960 | 0.01 | 1024 | 0.02 | 1013 | 0.06 | 691 | -0.04 |
| affil_video_humaine | 762 | -0.04 | 845 | -0.04 | 820 | -0.04 | 609 | -0.16 | 461 | -0.25 |
| affil_outil_interactif | 747 | -0.02 | 753 | -0.02 | 803 | -0.02 | 746 | -0.08 | 542 | -0.18 |
| affil_bons_plans_local | 270 | -0.01 | 326 | -0.0 | 350 | -0.0 | 71 | -0.08 | 31 | -0.13 |
| affil_avis_generique_ia | 86 | -0.09 | 87 | -0.09 | 93 | -0.09 | 69 | -0.28 | 52 | -0.37 |

**Rang de chaque archétype d'affiliation parmi les 27 (base)**

| Archetype | France | Belgique | Suisse | Quebec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) |
|---|---|---|---|---|---|---|---|
| affil_comparatif_donnees | 20 | 20 | 20 | 20 | 19 | 19 | 19 |
| affil_newsletter | 11 | 11 | 11 | 11 | 10 | 11 | 11 |
| affil_voyage_maroc | 16 | 16 | 16 | 16 | 12 | 13 | 15 |
| affil_saas_recurrent | 9 | 9 | 9 | 8 | 5 | 5 | 7 |
| affil_video_humaine | 21 | 21 | 21 | 21 | 21 | 21 | 21 |
| affil_outil_interactif | 6 | 6 | 6 | 6 | 8 | 7 | 5 |
| affil_bons_plans_local | 17 | 17 | 18 | 17 | 16 | 15 | 13 |
| affil_avis_generique_ia | 23 | 23 | 23 | 23 | 22 | 22 | 22 |

**Classement interne à l'affiliation (base, archétypes sous la porte de 25 h par mois)**

- France : affil_outil_interactif (51.4), affil_saas_recurrent (50.0), affil_newsletter (49.4), affil_voyage_maroc (46.6), affil_bons_plans_local (46.3), affil_comparatif_donnees (44.2), affil_avis_generique_ia (40.7)
- Belgique : affil_outil_interactif (51.4), affil_saas_recurrent (50.0), affil_newsletter (49.4), affil_voyage_maroc (46.6), affil_bons_plans_local (46.4), affil_comparatif_donnees (44.4), affil_avis_generique_ia (40.7)
- Suisse : affil_outil_interactif (51.7), affil_saas_recurrent (50.0), affil_newsletter (49.6), affil_voyage_maroc (46.7), affil_bons_plans_local (46.4), affil_comparatif_donnees (44.5), affil_avis_generique_ia (41.3)
- Québec : affil_outil_interactif (51.5), affil_saas_recurrent (50.1), affil_newsletter (49.5), affil_voyage_maroc (46.7), affil_bons_plans_local (46.4), affil_comparatif_donnees (44.3), affil_avis_generique_ia (40.7)
- Maroc : affil_saas_recurrent (50.8), affil_outil_interactif (50.4), affil_newsletter (48.8), affil_voyage_maroc (47.2), affil_bons_plans_local (45.1), affil_comparatif_donnees (42.1), affil_avis_generique_ia (37.4)
- UEMOA (SN, CI) : affil_saas_recurrent (49.0), affil_outil_interactif (48.6), affil_newsletter (47.1), affil_voyage_maroc (44.4), affil_bons_plans_local (44.3), affil_comparatif_donnees (40.5), affil_avis_generique_ia (35.9)
- Afrique centrale (CM, RDC) : affil_outil_interactif (47.4), affil_saas_recurrent (47.0), affil_newsletter (46.0), affil_bons_plans_local (43.5), affil_voyage_maroc (42.9), affil_comparatif_donnees (39.3), affil_avis_generique_ia (34.9)

`affil_video_humaine` (42,1 en France) est écartée par la porte d'exploitation (30 h par mois prévues).

Top 6 tous archétypes (base) : un seul archétype d'affiliation y entre, `affil_outil_interactif`, 6e en France, en Belgique, en Suisse et au Québec, 5e en Afrique centrale ; `affil_saas_recurrent` est 5e au Maroc et dans l'UEMOA.

### 9.4 Variante : w = 25 €/h dans tous les pays

| Archetype | France | Belgique | Suisse | Quebec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) | Porte 25 h/mois |
|---|---|---|---|---|---|---|---|---|
| affil_comparatif_donnees | 44.2 | 44.4 | 44.2 | 44.3 | 44.0 | 43.9 | 43.8 | ok |
| affil_newsletter | 49.4 | 49.4 | 49.5 | 49.5 | 49.4 | 49.1 | 48.9 | ok |
| affil_voyage_maroc | 46.6 | 46.6 | 46.7 | 46.7 | 46.9 | 46.2 | 46.0 | ok |
| affil_saas_recurrent | 50.0 | 50.0 | 50.2 | 50.1 | 50.1 | 49.6 | 49.3 | ok |
| affil_video_humaine | 42.1 | 42.2 | 42.1 | 42.2 | 42.0 | 41.8 | 41.8 | ecarte |
| affil_outil_interactif | 51.4 | 51.4 | 51.6 | 51.5 | 51.4 | 51.0 | 50.9 | ok |
| affil_bons_plans_local | 46.3 | 46.4 | 46.4 | 46.4 | 46.1 | 46.1 | 46.0 | ok |
| affil_avis_generique_ia | 40.7 | 40.7 | 40.7 | 40.7 | 40.7 | 40.6 | 40.6 | ok |

Top 6 tous archétypes, variante w = 25 :

- France : agence_automatisation (56.9), donnees_api (55.0), ia_verticale_tpe (54.9), communaute_payante (53.6), geo_visibilite (53.4), affil_outil_interactif (51.4)
- Belgique : agence_automatisation (57.2), ia_verticale_tpe (55.1), donnees_api (55.0), communaute_payante (53.8), geo_visibilite (53.7), affil_outil_interactif (51.4)
- Suisse : agence_automatisation (60.3), ia_verticale_tpe (57.6), geo_visibilite (56.6), communaute_payante (56.2), donnees_api (55.2), affil_outil_interactif (51.6)
- Québec : agence_automatisation (57.0), donnees_api (55.1), ia_verticale_tpe (54.9), communaute_payante (53.7), geo_visibilite (53.5), affil_outil_interactif (51.5)
- Maroc : donnees_api (54.8), agence_automatisation (53.6), ia_verticale_tpe (52.3), affil_outil_interactif (51.4), agence_export (50.8), communaute_payante (50.4)
- UEMOA (SN, CI) : donnees_api (54.5), agence_automatisation (52.9), ia_verticale_tpe (51.8), affil_outil_interactif (51.0), agence_export (50.4), communaute_payante (50.3)
- Afrique centrale (CM, RDC) : donnees_api (54.2), agence_automatisation (52.7), ia_verticale_tpe (51.6), affil_outil_interactif (50.9), communaute_payante (50.1), agence_export (49.8)

| Archetype | rang France | rang Maroc | rang UEMOA (SN, CI) | ROI MA (w=25) |
|---|---|---|---|---|
| affil_comparatif_donnees | 20 | 20 | 20 | -0.05 |
| affil_newsletter | 11 | 10 | 10 | -0.02 |
| affil_voyage_maroc | 16 | 16 | 16 | 0.01 |
| affil_saas_recurrent | 9 | 8 | 8 | 0.02 |
| affil_video_humaine | 21 | 21 | 21 | -0.05 |
| affil_outil_interactif | 6 | 4 | 4 | -0.02 |
| affil_bons_plans_local | 17 | 17 | 17 | -0.02 |
| affil_avis_generique_ia | 23 | 22 | 22 | -0.09 |

Lecture : à 25 €/h, l'agence export perd sa place au Maroc (5e) comme l'avait montré la contre-vérification de l'axe économie, et l'outil interactif monte au 4e rang au Maroc, dans l'UEMOA et en Afrique centrale. **Cette remontée est en partie un artefact** (section 9.7).

### 9.5 Variante : Maroc, imposition effective de 20 %

| Archetype | score MA base | score MA tax 20 % | ROI MA base | ROI MA tax 20 % | rang MA tax 20 % |
|---|---|---|---|---|---|
| affil_comparatif_donnees | 42.1 | 41.6 | -0.17 | -0.19 | 19 |
| affil_newsletter | 48.8 | 48.1 | -0.05 | -0.09 | 10 |
| affil_voyage_maroc | 47.2 | 46.3 | 0.03 | -0.03 | 13 |
| affil_saas_recurrent | 50.8 | 49.9 | 0.06 | 0.01 | 6 |
| affil_video_humaine | 40.0 | 39.7 | -0.16 | -0.18 | 21 |
| affil_outil_interactif | 50.4 | 49.7 | -0.08 | -0.12 | 8 |
| affil_bons_plans_local | 45.1 | 45.0 | -0.08 | -0.08 | 15 |
| affil_avis_generique_ia | 37.4 | 37.3 | -0.28 | -0.29 | 22 |

Le classement interne ne change pas ; seul le voyage Maroc passe d'un ROI légèrement positif à légèrement négatif.

### 9.6 Robustesse (1 000 tirages Monte-Carlo)

*p12*, *Rs*, *T1*, *C*, *h* et *hrun* entre 50 et 150 % de leur valeur ; *L* et *D* à ±30 % ; *w* entre 50 et 150 % ; `pay` des rails d'affiliation à ±20 % (plafonné à 1). Part des tirages où l'archétype est dans le top 3 de l'affiliation (archétypes sous la porte), et part où il est premier :

| Archetype | France | Belgique | Suisse | Quebec | Maroc | UEMOA (SN, CI) | Afrique centrale (CM, RDC) |
|---|---|---|---|---|---|---|---|
| affil_comparatif_donnees | 10 % (1er : 1 %) | 11 % (1er : 1 %) | 10 % (1er : 1 %) | 10 % (1er : 1 %) | 6 % (1er : 1 %) | 8 % (1er : 1 %) | 8 % (1er : 1 %) |
| affil_newsletter | 71 % (1er : 21 %) | 71 % (1er : 20 %) | 73 % (1er : 21 %) | 71 % (1er : 21 %) | 68 % (1er : 19 %) | 69 % (1er : 22 %) | 70 % (1er : 24 %) |
| affil_voyage_maroc | 32 % (1er : 6 %) | 32 % (1er : 6 %) | 31 % (1er : 5 %) | 32 % (1er : 6 %) | 47 % (1er : 11 %) | 35 % (1er : 7 %) | 33 % (1er : 7 %) |
| affil_saas_recurrent | 75 % (1er : 26 %) | 74 % (1er : 26 %) | 74 % (1er : 23 %) | 75 % (1er : 26 %) | 82 % (1er : 36 %) | 80 % (1er : 36 %) | 75 % (1er : 29 %) |
| affil_outil_interactif | 87 % (1er : 46 %) | 87 % (1er : 46 %) | 88 % (1er : 48 %) | 87 % (1er : 46 %) | 81 % (1er : 33 %) | 81 % (1er : 34 %) | 81 % (1er : 36 %) |
| affil_bons_plans_local | 23 % (1er : 1 %) | 24 % (1er : 1 %) | 22 % (1er : 1 %) | 23 % (1er : 1 %) | 16 % (1er : 1 %) | 27 % (1er : 2 %) | 33 % (1er : 3 %) |
| affil_avis_generique_ia | 1 % (1er : 0 %) | 1 % (1er : 0 %) | 2 % (1er : 0 %) | 1 % (1er : 0 %) | 0 % (1er : 0 %) | 0 % (1er : 0 %) | 0 % (1er : 0 %) |

Le trio outil interactif, SaaS récurrent et newsletter est stable ; le site d'avis générique est dernier dans presque tous les tirages. Le comparatif à données propres n'entre dans le top 3 que dans 6 à 11 % des tirages.

### 9.7 Taux horaire implicite et artefact de la grille

Le ROI de la grille vaut (E24 - 2C) / (2C + coût du temps). Quand E24 est inférieur à 2C, ce qui est le cas de tous les archétypes d'affiliation, un coût horaire plus élevé **rend le ROI moins négatif** : l'outil interactif passe de -0,08 à -0,02 au Maroc quand *w* passe de 6 à 25 €/h. La remontée de la variante 9.4 vient de là. Le taux horaire implicite, indépendant de *w*, donne une lecture plus juste :

Taux horaire implicite sur 24 mois (EUR/h), espérance / cas de succès :

| Archetype | heures 24 mois | France | Belgique | Quebec | Maroc | UEMOA (SN, CI) |
|---|---|---|---|---|---|---|
| affil_comparatif_donnees | 560 | -1.13 / 20.3 | -0.84 / 20.5 | -1.03 / 22.0 | -1.41 / 15.7 | -1.67 / 11.3 |
| affil_newsletter | 468 | -0.41 / 32.4 | -0.39 / 32.7 | -0.28 / 35.0 | -0.41 / 32.4 | -0.88 / 22.9 |
| affil_voyage_maroc | 524 | -0.22 / 19.2 | -0.21 / 19.4 | -0.09 / 20.8 | 0.2 / 19.2 | -0.81 / 13.4 |
| affil_saas_recurrent | 450 | 0.34 / 28.4 | 0.35 / 28.7 | 0.5 / 30.7 | 0.47 / 30.4 | -0.24 / 20.2 |
| affil_video_humaine | 760 | -1.1 / 14.6 | -0.99 / 14.7 | -1.03 / 15.9 | -1.3 / 11.2 | -1.5 / 8.0 |
| affil_outil_interactif | 376 | -0.67 / 30.5 | -0.66 / 30.7 | -0.52 / 32.9 | -0.68 / 30.4 | -1.22 / 21.4 |
| affil_bons_plans_local | 630 | -0.21 / 11.6 | -0.12 / 12.3 | -0.08 / 10.5 | -0.52 / 1.6 | -0.59 / 0.6 |
| affil_avis_generique_ia | 300 | -2.38 / 11.7 | -2.38 / 11.9 | -2.36 / 12.8 | -2.44 / 8.8 | -2.49 / 6.1 |
| agence_automatisation | 2220 | 6.15 / 18.6 | 6.55 / 19.7 | 6.3 / 19.0 | 1.24 / 4.5 | 0.19 / 1.5 |
| agence_export | 2220 | 2.99 / 13.6 | 3.02 / 13.7 | 3.26 / 14.7 | 2.75 / 12.6 | 2.02 / 9.7 |
| newsletter_media | 1120 | 0.1 / 13.5 | 0.16 / 14.4 | 0.12 / 13.8 | -0.92 / 0.9 | -0.94 / 0.5 |
| seo_prog_annuaire | 660 | -1.45 / 13.3 | -1.37 / 14.2 | -1.42 / 13.6 | -2.39 / 1.5 | -2.59 / -1.0 |
| tiktok_affiliation | 1480 | 0.27 / 8.0 | 0.24 / 7.6 | -0.06 / 3.9 | bloque | bloque |
| donnees_api | 800 | -1.21 / 17.4 | -1.19 / 17.6 | -1.01 / 19.0 | -1.38 / 16.0 | -1.9 / 11.6 |

### 9.8 Lecture

1. **En espérance, l'affiliation ne paie pas l'heure** : de -2,5 à +0,5 €/h. Seule l'affiliation SaaS est légèrement positive (0,3 à 0,5 €/h). En cas de succès, 20 à 35 €/h pour les quatre meilleurs archétypes, contre 13 à 20 €/h pour les agences : l'affiliation réussie paie mieux l'heure, mais réussit rarement.
2. **Pour un résident marocain qui vise la France**, le taux horaire en cas de succès (30 €/h pour l'outil ou la newsletter) est cinq fois son coût d'opportunité supposé (6 €/h) : c'est le même arbitrage export que l'agence, avec moins d'heures et plus de risque.
3. **La porte des heures élimine la vidéo** dans sa forme hebdomadaire ; une version réduite (une vidéo tous les quinze jours, Shorts en complément) reste à chiffrer.
4. **Le comparatif à données propres**, que tout désigne comme le modèle « qui résiste » sur le plan qualitatif, sort mal de la grille : le délai, le capital et le trafic nécessaire au barème amazon.fr pèsent plus que sa défendabilité. Il devient intéressant en Belgique (taux doublés) ou adossé à un outil.
5. **Les scores restent serrés** (44 à 51 pour les archétypes plausibles) : la grille ne tranche pas, le test de demande tranche.

### 9.9 Compatibilité avec les contraintes du fondateur

| Archétype | Test de demande (20 h, 150 €) | Seuil à écrire avant | Exploitation ≤ 25 h/mois | Capital ≤ 1 000 € |
|---|---|---|---|---|
| Outil interactif | Oui : un outil en 10 à 15 h, diffusion dans 5 communautés, 50 € de publicité | 300 utilisations et 10 % de clics sortants en 3 semaines | Oui (12 h) | Oui |
| SaaS récurrent | Oui : un comparatif et un tutoriel, 50 € de publicité | 20 essais gratuits attribués | Oui (15 h) | Oui |
| Newsletter affiliée | Oui : page d'inscription, une édition, 100 € d'acquisition | 100 inscrits, 5 % de clics sur les liens | Oui (16 h) | Oui |
| Voyage Maroc | Oui : une page outil (budget ou eSIM), 50 € sur Pinterest ou Meta vers la France | 30 clics sortants qualifiés, 1 réservation | Oui (18 h) | Oui |
| Bons plans locaux | Oui : chaîne WhatsApp | 200 membres, 20 clics par jour | Limite (25 h) | Oui |
| Comparatif à données propres | Difficile : le SEO ne répond pas en 3 semaines ; tester par Pinterest et forums | 1 000 impressions et 30 clics sortants | Oui (20 h) | Oui |
| Vidéo humaine | Difficile : 3 vidéos en 20 h | 1 000 vues et 20 clics | **Non (30 h)** | Oui |
| Avis générique IA | À ne pas tester | — | — | — |

---

## 10. Implications pour l'outil

1. **Ajouter les cinq rails d'affiliation** (`amazon_affil`, `reseaux_affil`, `voyage_affil`, `saas_affil`, `local_affil`) dans `rules/payments.yaml`, chaque ligne avec son URL et sa date, et les relire par la veille des verrous.
2. **Veille hebdomadaire des barèmes** : pages publiques Amazon FR, BE et CA (nœud `GRXPHT8U84RAYDXZ`), fiches Awin des programmes suivis, FAQ Temu, pages Systeme.io et Hostinger ; tout changement relance le score des archétypes concernés. Amazon peut modifier le barème avec 7 jours de préavis [F].
3. **Veille des rails qui s'ouvrent** : liste des pays de YouTube Shopping (la France manque malgré l'annonce du 13 octobre 2026), page de politique anti-spam de Google (« Last updated »), statut du programme Influenceurs Amazon.
4. **Brancher l'autocomplétion Amazon comme capteur de stade commercial** sur US, FR, BE, CA, DE, GB, AE, EG et SA : historiser chaque jour la liste de veille, extraire les qualificatifs (âge, usage, marque) et comparer US et FR. Ne pas l'appeler plus que nécessaire (point non documenté) et marquer le Maroc « non mesurable » côté Amazon.
5. **Tester l'autocomplétion Google par pays sur des préfixes courts** : les requêtes longues renvoient les mêmes suggestions quel que soit `gl` [F, test].
6. **Remplacer ou compléter le ROI par le taux horaire implicite** (espérance et succès) dans le module de scoring : la formule actuelle récompense un coût horaire élevé quand E24 < 2C (section 9.7). Ajouter au Monte-Carlo la variation de *w*, *tax* et *pay*, comme le fait la copie.
7. **Appliquer la porte des 25 h par mois dans le code**, avant le score : elle écarte `affil_video_humaine` dans sa forme hebdomadaire.
8. **Modéliser l'affiliation aussi comme rail secondaire** d'un actif (newsletter, outil, communauté) et pas seulement comme archétype autonome (section 8).
9. **Exclusions codées** : paris en ligne (dominants dans « code promo » au Sénégal et en Côte d'Ivoire), crypto non agréée, crédit et assurance (ORIAS), allégations santé (GLP-1), chirurgie esthétique, mode ultra-express en France dès le 1er janvier 2027.
10. **Check-list de conformité dans chaque kit** : mention en français visible sans clic, nom de l'annonceur, mention Amazon obligatoire, rubrique « comment nous classons » (L111-7), statut des notes (tests de l'éditeur, pas avis de consommateurs), `rel="sponsored"`, contrat écrit au-delà de 1 000 € HT, mention « Images virtuelles » pour les visuels IA.
11. **Simulateur marocain** : signaler le client unique au-delà de 80 000 DH, le plafond de 200 000 DH, la déclaration de revenus de source étrangère et le compte en devises à 70 % (IGOC 2026).
12. **Traiter l'affiliation comme une tendance décalée** : les résumés IA ont 30 mois aux USA et 4 mois en France. Suivre les cas américains de sites d'affiliation (trafic, fermetures, pivots vers l'outil ou la newsletter) comme indicateurs avancés pour la France.
13. **Liens par pays** : un lien amazon.fr ne rémunère pas un achat belge ; l'outil doit générer des liens localisés (FR, BE, CA) selon le public de l'initiative.

---

## 11. Questions ouvertes

1. Un résident marocain peut-il recevoir les versements d'Amazon Partenaires par virement sur une banque marocaine ? Seule une inscription réelle le dira.
2. L'accord Amazon (droit luxembourgeois) vaut-il contrat écrit au sens du décret n° 2025-1137 pour un affilié qui dépasse 1 000 € HT par an ? Comment s'applique la notion de « même objectif promotionnel » à l'affiliation multi-produits ?
3. La France entrera-t-elle dans la liste officielle des pays de YouTube Shopping, et à quelles conditions d'éligibilité ?
4. L'affiliation figure-t-elle dans la liste des activités ouvertes à l'auto-entrepreneur marocain ? La retenue de 30 % au-delà de 80 000 DH s'applique-t-elle à un payeur étranger comme Amazon ?
5. Payoneer couvre-t-il le Maroc, le Sénégal et la Côte d'Ivoire pour les versements Awin en devise locale ?
6. Commissions réelles de Booking.com via CJ, d'Airalo, de Jumia KOL et de Temu au Maroc (tableaux de bord après inscription).
7. Distribution réelle des revenus des affiliés débutants (aucun réseau ne la publie) : l'outil peut-il la constituer à partir de son propre journal d'initiatives ?
8. Les résumés IA sont-ils actifs au Maroc, en Belgique et au Québec, et à quelle date ?
9. Version 2026 du guide de l'influence commerciale (PDF en 403) : contient-elle une question explicite sur les liens affiliés et les codes promo ?
10. Classement fiscal français des commissions d'affiliation (BNC ou BIC) : rescrit ou doctrine à trouver.
11. La politique de réputation de site propre à l'EEE s'applique-t-elle à la Suisse (hors EEE) ?
12. Le périmètre de l'interdiction de publicité de la mode ultra-express inclut-il Temu ?

---

## 12. Sources lues pendant la session (2026-11-28)

Primaires et tests :

- Amazon Partenaires France : barème https://partenaires.amazon.fr/help/node/topic/GRXPHT8U84RAYDXZ ; politiques https://partenaires.amazon.fr/help/operating/policies ; conditions https://partenaires.amazon.fr/help/operating/agreement ; accueil https://partenaires.amazon.fr/welcome
- Amazon Belgique : https://affiliate-program.amazon.com.be/help/node/topic/GRXPHT8U84RAYDXZ?language=fr_BE ; Amazon Canada : https://associates.amazon.ca/help/node/topic/GRXPHT8U84RAYDXZ ; Amazon US : https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ
- Autocomplétion Amazon : `https://completion.amazon.<tld>/api/2017/suggestions` (9 places de marché) ; autocomplétion Google : `https://suggestqueries.google.com/complete/search?client=firefox` (MA, FR, SN, CI, BE, CA) ; instantanés dans `scratchpad/affil/dl/amazon_ac_snapshot.txt` et `google_ac_snapshot.txt`
- Awin : https://ui.awin.com/merchant-profile/18925 (GetYourGuide) ; https://ui.awin.com/merchant-profile/11018 (Viator) ; https://success.awin.com/articles/en_US/Knowledge/International-Payment-Method-FAQs
- Booking.com : https://www.booking.com/affiliate-program/v2/index.html ; Airalo : https://partners.airalo.com/ ; ArabClicks : https://www.arabclicks.com/ et https://www.arabclicks.com/advertisers/viator-affiliate-program/
- Systeme.io : https://systeme.io/fr/affiliate-program ; Hostinger : https://www.hostinger.com/affiliates ; Temu : https://www.temu.com/affiliate_question.html ; Effinity : https://www.effinity.fr/expertise/affiliation/ ; Tradedoubler : https://www.tradedoubler.com/fr
- YouTube : https://support.google.com/youtube/answer/13376398 (FR et EN) ; Google France, YouTube Shopping : https://blog.google/intl/fr-fr/nouveautes-produits/lunivers-youtube/youtube-shopping-france/
- Google Search Central : https://developers.google.com/search/docs/essentials/spam-policies (mise à jour du 2026-11-23)
- Expérience de terrain : https://arxiv.org/abs/2608.18352 et https://arxiv.org/html/2608.18352
- Service Public : https://entreprendre.service-public.gouv.fr/actualites/A18674 ; DGE : https://www.entreprises.gouv.fr/la-dge/publications/guide-de-bonne-conduite-de-linfluence-commerciale ; guide de mars 2023 : https://grand-est.dreets.gouv.fr/sites/grand-est.dreets.gouv.fr/IMG/pdf/guide_bonne_conduite_influenceurs.pdf
- Office des Changes, IGOC 2026 : https://www.oc.gov.ma/sites/default/files/reglementation/pdf/2026-01/IGOC%202026.pdf (texte extrait par l'axe économie)
- Enquête Affiliate Booster : https://affiliatebooster.com/affiliate-marketer-income-real-data-2026-3/

Secondaires (lues ou extraits de recherche) : Les Gens d'Internet (baromètre UMICC et CPA, 4 novembre 2025) ; The Media Leader (baromètre CPA, 15 avril 2024 ; Aperçus IA en France, juillet 2026) ; Le Matin, Le360, AllAfrica, TelQuel (tourisme 2025) ; Presse-Citron, aboutamazon.com (Influenceurs) ; TechCrunch et Tubefilter (YouTube, juillet 2026) ; aides Impact et PartnerStack ; Kwanko et Leptidigital ; INC, CMS (L111-7) ; ACPR et ORIAS ; Medias24, Hespress, SNRT News (Maroc) ; grey.co (Payoneer, PayPal) ; Namecheap et MonetizePros (CJ) ; forum WordPress (Creators API).

Dossiers compagnons : `initiatives-economie.md` (grille, rails, TikTok Shop, fiscalité), `market-france-europe.md` (loi influenceurs, AI Act), `market-maroc-maghreb.md` (PayPal, IGOC, créateurs), `market-afrique-quebec.md` (Jumia, Québec), `trends-us-business.md` (TikTok Shop, résumés IA), `sources-open.md` (autocomplétion, Amazon Best Sellers).
