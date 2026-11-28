# Radar d'arbitrage de tendances : plan V1

Version 2, soumise à validation le 28 novembre 2026. Rien n'est codé avant votre accord.

Ce plan s'appuie sur une étude préalable en 13 axes : sources de données, plugins Claude Code, méthode de scoring, marchés France, Maroc, Afrique et Québec, taxonomie, tendances US, concurrence, économie des initiatives. Chaque axe a été contre-vérifié par un agent indépendant. Le plan lui-même a été soumis à une critique adverse. La version 2 en tient compte. Les corrections principales sont en annexe A.

---

## 1. Cadrage retenu

| Question | Votre choix |
|---|---|
| Usage | Studio personnel d'abord, productisable plus tard |
| Marché prioritaire | Maroc et France ; le reste de la francophonie en lecture |
| Forme | Plugin Claude Code et tableau de bord |
| Budget données | 0 € en V1, connecteurs payants branchables ensuite |
| Niches | Les quatre familles : conso et lifestyle, argent et travail, tech et IA, médias et divertissement |
| Moyens par initiative | Solo, moins de 10 h par semaine, moins de 1 000 € |
| Profondeur | Brief stratégique et kit de lancement ; rien n'est publié sans vous |

---

## 2. Ce que l'étude change à l'idée de départ

**1. Le décalage n'est pas un nombre, c'est un statut et une fenêtre par pays.** L'idée d'un retard fixe entre les USA, la France puis le Maroc ne tient pas. Les délais observés vont de quelques jours (contenus, sorties mondiales) à plusieurs années, ou jamais (produits réglementés). Ils dépendent d'une classe de friction :

| Classe | Nature | Décalage USA vers France observé | Exemples |
|---|---|---|---|
| A | Format de contenu, pratique gratuite, produit simple | 0 à 6 mois | matcha, run clubs, Wordle |
| B | App ou service mondial sans frein réglementaire | 5 à 18 mois | Temu, micro-dramas, Labubu |
| C | Fonction dépendant d'une plateforme ou du droit européen | 5 à 19 mois en France, 33 en Belgique | Threads, TikTok Shop, Apple Pay |
| D | Produit réglementé (santé, finance, alcool, nicotine) | 24 à 60 mois, ou jamais | sodas prébiotiques, hard seltzer |
| E | Pratique demandant une infrastructure physique | 24 à 70 mois | Hyrox, pickleball |
| F | Modèle qui suppose de payer | 48 mois et plus | newsletters payantes |

Ces fourchettes reposent sur une douzaine de cas réellement datés. Ce sont des hypothèses à recalibrer, pas un modèle validé.

**2. La diffusion va dans plusieurs sens.** Le padel, la seconde main (Vinted) et Hyrox sont plus avancés en Europe qu'aux USA. Le chocolat de Dubaï est arrivé en Allemagne et en France avant les USA. Les plateformes testent souvent ailleurs d'abord : TikTok Pro est sorti en Allemagne et au Portugal avant les USA, Muse au Japon et au Mexique avant le Royaume-Uni. Le radar date donc la première disponibilité sur environ 25 pays et suit aussi les flux inverses, qui sont des opportunités d'export.

**3. Au Maroc, les usages passent, les rails officiels non.** Le live shopping s'y fait déjà via TikTok, WhatsApp et le paiement à la livraison, sans TikTok Shop. Stripe, Shopify Payments et TikTok Shop n'y sont pas disponibles. Un particulier ne peut dépenser que 20 000 DH par an en ligne en devises. Chaque pays est donc décrit par une grille de verrous (paiement, change, statut fiscal, plateformes, réglementation). Au Maroc, l'événement exploitable est souvent l'ouverture d'une porte plutôt que la tendance elle-même.

**4. Au Maroc, le radar mesurera souvent « non mesurable ».** Les grandes sources ouvertes y sont presque aveugles : Wikimedia publie environ 80 lignes par jour pour le Maroc contre plus de 10 000 pour la France, Google Trends tombe à zéro sous son seuil de volume, et Pinterest regroupe le Maroc avec la Turquie. Le radar distingue donc « absent » de « non mesurable » et ne conclut jamais à une fenêtre ouverte sur une absence mal mesurée.

**5. Pour un solo à temps partiel, la contrainte est le temps et la distribution, pas la prévision.** 17,3 % des apps atteignent 1 000 $ de revenu mensuel en deux ans ; l'app médiane encaisse environ 72 $ par mois à un an (RevenueCat 2026). Les nouvelles apps ont doublé au premier semestre 2026 pour des téléchargements en hausse de 2 % (Sensor Tower) : fabriquer ne coûte plus rien, se faire connaître coûte tout. Le radar doit donc produire peu de décisions, compatibles avec 10 h par semaine, et chaque kit doit dire où trouver les premiers clients.

**6. La détection de tendances est une commodité.** Des dizaines d'outils détectent des tendances et beaucoup ont déjà un serveur MCP. La comparaison entre pays commence à apparaître (un acteur Apify, un plugin du même nom que notre prototype), sans recommandation exécutable. L'avantage défendable, si vous productisez un jour, est un journal de prédictions horodatées, ancré à l'extérieur du dépôt et résolu par pays.

---

## 3. Le modèle d'exploitation du studio

C'est la partie qui conditionne tout le reste.

**Une décision par semaine.** Le radar ne sort pas cinq opportunités par semaine, mais une décision : lancer un test, continuer, arrêter, ou ne rien faire. Il propose au plus un nouveau candidat ; le reste va en liste de surveillance. « Aucune opportunité cette semaine » est une sortie valide.

**Un entonnoir en deux étapes.**

| Étape | Plafond | Durée | Sortie |
|---|---|---|---|
| Test de demande | 20 h et 150 € | 2 à 3 semaines | Seuil chiffré écrit avant le lancement (par exemple 30 inscrits, 10 conversations qualifiées, 3 précommandes) |
| Construction | Une seule à la fois, après un test réussi | Selon le brief | Premier euro, puis critère d'arrêt |

Les trois à cinq paris par trimestre deviennent trois à cinq tests de demande, pas trois à cinq produits.

**Un budget d'heures appliqué comme porte.** Sur 10 h par semaine : 1 h de revue du radar, 1 h de maintenance de l'outil au plus, le reste pour l'initiative en cours. Une initiative dont l'exploitation dépasse 25 h par mois est écartée avant tout calcul de score. La grille économique de l'étude place l'agence d'automatisation à environ 21 h par semaine : elle ne passe qu'en version réduite (une offre, un livrable).

**Un profil du fondateur dans la configuration.** Il contient :
- résidence fiscale et structure (micro-entreprise, auto-entrepreneur, société) ;
- rails de paiement ouverts ;
- langues, dont la darija ;
- canaux et audiences déjà possédés ;
- trésorerie et coûts fixes mensuels du studio ;
- coût horaire de référence.

Ces données décident de ce qui est faisable : le pays du vendeur compte autant que celui de l'acheteur. Une cellule a donc deux dimensions de pays, celle de l'acheteur et celle du vendeur. C'est indispensable pour les pistes transfrontalières (services vendus en euros depuis le Maroc, diaspora).

**Un kit qui commence par la distribution.** Chaque kit de lancement contient :
- un plan de canal chiffré : où trouver les 100 premiers prospects, comment obtenir 20 conversations, ou un test payant de 50 à 100 € ;
- l'instrumentation : statistiques de la page, liens suivis, seuils ;
- ensuite seulement la landing page, les posts et les visuels.

**Un journal des initiatives**, distinct du journal des prédictions : heures passées, euros dépensés et encaissés, résultat du test, décision.

**Un critère d'arrêt pour le radar lui-même.** Si, à 12 semaines, le radar n'a déclenché aucun test de demande qui ne figurait pas déjà dans la liste a priori de l'étude, il est réduit à la collecte et à la veille des verrous. Rien ne justifie alors d'y passer plus de temps.

**Module de contenu réactif (proposé, votre décision en section 14).** Les tendances de classe A (mèmes, formats, sorties mondiales) passent de l'anglais au français en quelques jours : entre −8 et +8 jours pour Squid Game ou Wordle. Construire un produit n'a alors aucun sens ; seule une publication rapide en tire parti. Le module fonctionne ainsi :
- Quand une tendance de classe A monte aux USA sans équivalent en français ou en darija, le radar prépare dans la journée un court paquet : post, carrousel ou script de vidéo courte.
- Vous validez sur téléphone, en 15 minutes environ, puis la publication est planifiée.
- Le volume est plafonné à 2 ou 3 contenus par semaine.
- La règle est « l'IA en coulisses, l'humain en façade », avec l'étiquetage exigé par l'AI Act.

Ce module n'est pas un archétype « contenu produit en masse ». Celui-ci est le dernier de la grille économique dans tous les pays (chaîne sans visage : 35 sur 100 en France ; SEO programmatique : 40), parce que les plateformes le pénalisent :
- YouTube démonétise les contenus génériques ou répétitifs, et vise les personnages IA sur les sujets sensibles.
- Google sanctionne depuis mars 2024 les contenus produits en masse.
- Un résumé IA fait tomber le taux de clic de 15 % à 8 % (Pew).

**Option de distribution (votre décision, section 14).** À partir de la semaine 4, publier vous-même la synthèse hebdomadaire en français, en 30 minutes, en newsletter ou sur LinkedIn. C'est le seul actif de distribution que le radar crée gratuitement, et c'est le test réel d'une productisation future.

---

## 4. Ce que fait l'outil

```
Chaque jour (code, sans IA)        Chaque semaine (code puis Claude)        À la demande (vous)
───────────────────────────        ─────────────────────────────────        ───────────────────
Instantanés par pays et source ──► Détection et statut par pays        ──►  Brief stratégique
Disponibilité des apps (≈25 pays)  Prédictions pour toute entité            Kit de lancement
Autocomplétion historisée          qui franchit le seuil (code)             (canal d'abord)
Veille des pages de verrous        Propositions de Claude : entités,        Journal des
Santé de chaque source             mots-clés FR/AR/darija, niche, classe    initiatives
                                   (statut « proposé », validées par vous)
                                   Décision de la semaine, tableau de bord
```

---

## 5. Sources de données V1 (0 €)

Toutes ont été testées depuis le conteneur le 28 novembre 2026. Un passage unique ne prouve pas une collecte continue : un pilote de 14 jours sur l'exécuteur réel décidera du maintien de chaque source (section 13).

| Source | Ce qu'elle mesure | Pays | Fréquence | Remarques |
|---|---|---|---|---|
| App Store : recherche par identifiant, sur environ 25 vitrines | Disponibilité d'une app par pays, date de première apparition | US, CA, GB, IE, AU, NZ, DE, ES, IT, PT, NL, FR, BE, CH, LU, JP, MX, PH, TH, AE, SA, EG, MA, DZ, TN, SN, CI | Quotidienne, identifiants groupés | Mesure principale : 14 des 18 apps US « absentes » en France y sont en fait indisponibles. La date de sortie n'est utilisée que si elle est postérieure à l'ouverture de la vitrine (avril 2020 au Maroc) |
| App Store : classements (flux RSS v2 et historique) | Rang par pays | mêmes pays | Quotidienne | Flux v2 instable (12 échecs sur 24 en rafale) : reprises et repli sur le flux historique |
| Google Play : classements | Rang par pays | US, FR, MA, BE, CH, CA, SN, CI, DZ, TN | Quotidienne | Point d'accès non officiel ; Android domine au Maghreb et en Afrique |
| Wikimedia, jeu quotidien par pays | Date d'arrivée d'un concept par pays (identifiant Wikidata, seuil de 90 vues par jour) | US, CA, GB, DE, FR, BE, CH… | Quotidienne, historique depuis 2023 | Meilleur capteur gratuit pour l'Europe et le Canada (Labubu : Canada +17 j, France +159 j). Filtré aux entités suivies (le fichier brut pèse 16 Mo par jour) |
| Wikipedia, vues par article | Intérêt par langue (en, fr, ar, darija), historique depuis 2015 | par langue | Hebdomadaire | Regrouper les renommages avant tout calcul ; agent utilisateur avec contact obligatoire |
| Google Trends, comparaison | Courbes US, FR et MA sur une échelle commune, 5 ans d'historique | tous | Hebdomadaire et backtest | Non officiel : interrupteur et repli payant (DataForSEO à 0,0027 $ la requête). Le décalage dépend du seuil : pour Labubu, 6 à 28 semaines selon la définition. Un 0 au Maroc veut dire « sous le seuil » |
| Google Trends, tendances du jour | Recherches qui montent | US, FR, MA | Toutes les heures | 10 éléments par flux, dominés par le sport et la politique : poids faible |
| Autocomplétion Google et YouTube | Présence locale d'un terme (« prix maroc », nom d'enseigne), par graphie | par pays et langue | Quotidienne, historisée dès le premier jour | Seul capteur de présence fin au Maroc ; sans historique, il faut le constituer |
| Google News et flux RSS de médias | Première mention dans la presse d'un pays | US, FR, MA, Afrique | Quotidienne | Listes de titres curées ; l'édition choisie selon le pays du titre. Une première mention trouvée ainsi n'est qu'une date au plus tard |
| Pinterest Trends | Mots-clés lifestyle montants | US, FR, CA, GB, groupes DACH et Benelux | Hebdomadaire | Indice relatif plafonné à 100 ; point d'accès non contractuel |
| Bluesky, Mastodon francophone | Signaux précoces | global, filtre de langue | Quotidienne | Poids faible |
| Hacker News, Product Hunt, recherche GitHub | Tech, IA | global | Quotidienne | Product Hunt : usage interne, non publiable |
| Veille des pages de verrous | Ouverture ou fermeture d'une porte | pays cibles | Hebdomadaire, par comparaison de versions | Pages officielles de WhatsApp Business, Programme Partenaire YouTube, pays vendeurs TikTok Shop, Stripe, Paddle, Polar, Office des Changes |
| Saisie manuelle (15 min par semaine) | Tendances TikTok du Creative Center connecté | selon export | Hebdomadaire | TikTok n'a plus aucune source gratuite sans connexion |

**Exclues en V1** :
- Reddit : bloqué depuis un datacenter, et un usage commercial demande un contrat.
- TikTok et Instagram organiques : aucune source gratuite.
- X : payant.
- Métriques de l'API YouTube : sa politique interdit les métriques dérivées.
- GDELT : trop limité.
- Google Trends sur BigQuery : la présence de la France et du Maroc n'est pas testée.
- Sources mortes : pytrends, OSS Insight, GH Archive, Amazon PA-API.

**Prêtes à brancher plus tard** :
- DataForSEO Trends, en repli de Google Trends.
- X à l'usage, environ 11 $ par mois pour 6 pays.
- ScrapeCreators, EnsembleData ou Apify pour TikTok. Le pays reste une inférence : leur paramètre « région » ne fait que placer le serveur relais.
- Bibliothèques publicitaires TikTok et Meta : gratuites sur candidature, mais limitées à l'Europe.

---

## 6. Modèle d'analyse

### 6.1 Données

- **Entité** : un concept (identifiant Wikidata vérifié, pour éviter les faux rattachements comme Labubu relié à la page de son créateur), ses produits (identifiants d'apps) et ses mots-clés en anglais, français, arabe et darija (graphies arabe et latine).
- **Observation typée** : valeur, unité, type de métrique avec le libellé exact de la source, pays, période, source, niveau de preuve, date. Deux types différents ne sont jamais comparés ni additionnés ; les chiffres annoncés par les plateformes sont marqués « déclaratifs ».
- **Règles par pays** dans des fichiers datés et sourcés : paiement, change, fiscalité, plateformes, réglementation. Elles ne sont ni dans le code ni dans la mémoire du modèle, et sont relues sur les pages officielles par la veille des verrous.
- **Sorties de Claude** (entités, mots-clés, niche, classe de friction et sa justification) enregistrées comme entrées de configuration versionnées, avec un statut « proposé » ou « validé ». Elles ne sont jamais recalculées sans trace. Les mots-clés en darija des candidats retenus sont validés par un humain. Un jeu de 50 cas étiquetés teste la résolution d'entités et le classement.

### 6.2 Une seule chaîne de calcul

La version 1 du plan juxtaposait trois systèmes de score qui se recouvraient, et le classement des initiatives ne dépendait pas des tendances détectées. La version 2 n'a qu'une chaîne :

```
Force du signal (A) ──► Statut et fenêtre par pays (B) ──► Portes (C) ──► Initiative = tendance × cellule × archétype (D)
```

**A. Force du signal, aux USA ou dans le pays d'origine.**

`F = 100 × [0,25 vitesse + 0,15 niveau + 0,15 persistance + 0,30 corroboration + 0,05 accélération + 0,10 rafale]`

- La corroboration (part des familles de sources en hausse) pèse le plus : un signal à source unique trompe, comme Google Flu Trends l'a montré.
- Pénalités : ×0,6 si une seule famille monte, plafond à 40 pour un pic d'un jour.
- Les termes sont notés sur des ancres absolues, pas sur des percentiles relatifs aux autres candidats de la semaine. Sinon, quelqu'un serait toujours en tête, même sans signal.
- Persistance : test de Mann-Kendall à partir de 8 points (6 au strict minimum), avec correction de Hamed et Rao en cas d'autocorrélation. Détection précoce par les rafales de Kleinberg calculées en ligne, au fil des relevés. Le CUSUM n'est pas utilisé au démarrage à froid : sur des articles nouveaux, il alerte après le pic.
- Le bruit est filtré : saisonnalité (Black Friday, Ramadan), apps à récompenses, services nationaux non distribués hors des USA.

**B. Statut et fenêtre par pays.**

- **Statuts** : absent, non mesurable, intérêt, disponible, adopté, bloqué, muté (équivalent local) ou en avance (flux inverse). « Absent » exige deux capteurs de présence négatifs ; sinon le statut est « non mesurable ».
- **Deux dates** : l'intérêt et la disponibilité. L'attention précède souvent l'offre : l'intérêt français pour Threads existait dès juillet 2023, cinq mois avant l'ouverture du service dans l'UE, à condition de regrouper l'article renommé sous ses deux titres.
- **Arrivée** : la règle est écrite d'avance par source, par exemple 3 jours sur 7 au-dessus du seuil Wikimedia, jamais un seul franchissement près du seuil, ou 50 % du pic propre pour Google Trends. Les séries Wikipedia sont agrégées par identifiant de page ou par QID, en suivant les renommages. L'intensité est rapportée à la consommation totale de Wikipedia du pays. Le décalage est affiché comme une fourchette, jamais comme un chiffre unique.
- **Délai attendu** : un mélange de trois cas par classe de friction et groupe de pays : « simultané », « avant les USA », et une loi log-normale calée sur P10 et P90, avec une part « jamais » pour les produits réglementés. Une loi log-normale seule ne sait représenter ni un délai nul ni une arrivée en Europe avant les USA.
- **Mise à jour par pays sentinelle** : le délai attendu est révisé quand un pays relais décolle. Les sentinelles sont choisies par niche : Royaume-Uni pour le commerce social, Allemagne pour la santé et le fitness, Espagne pour le sport et les services vers le Maroc, France pour le Maghreb. Pour les apps arabophones, le Golfe ne sert de sentinelle que par les stores : le jeu Wikimedia ne publie ni l'Arabie saoudite ni la Chine, et applique aux Émirats, à l'Égypte et à la Turquie un seuil de 1 000 vues.
- **Indice d'opportunité** : il est élevé quand l'attention locale est arrivée et que l'offre locale manque encore (apps, articles, vendeurs en langue locale). C'est la fenêtre d'arbitrage.

**C. Portes.** Paiement, plateforme et loi valent 0, 0,3, 0,6 ou 1, et multiplient le reste. Elles sont évaluées deux fois, côté acheteur et côté vendeur. Les portes sont appliquées une seule fois, ici. La transposabilité culturelle part de la langue et du pays relais, notée avec son niveau de preuve. Les scores Hofstede, qui exigent une licence commerciale, ne sont pas utilisés.

**D. Initiative = tendance × cellule × archétype.**

- **Portes dures d'abord** : heures de test et d'exploitation, capital, rail de paiement du profil, exclusions éthiques.
- **La tendance entre explicitement dans le calcul** par deux termes : le facteur de fenêtre, `f = min(1, fenêtre restante / temps de lancement)`, et une hypothèse de demande écrite (« les marchands marocains en paiement à la livraison paieraient 200 DH par mois pour réduire les refus »). Le test de demande servira à la vérifier.
- **Le rendement** combine les taux de base réels de l'archétype (grille de l'axe économie), la valeur par utilisateur du pays de l'acheteur et le coût horaire de votre profil.
- **Le classement** se fait sur le P10, donc de façon prudente.
- **Le score de cellule de l'axe taxonomie** ne sert qu'à ordonner la liste de surveillance. Il n'entre pas dans le calcul : changer une note a priori d'un cran déplace une cellule de 22 rangs au plus.
- **Le lifestyle**, en V1, est une cible que vous choisissez, pas un score : aucune source gratuite ne le mesure.

**Incertitude et abstention.** Chaque entrée porte une confiance tirée de son niveau de preuve. Un tirage Monte-Carlo produit P10, P50 et P90. L'outil répond « données insuffisantes » si la confiance moyenne est inférieure à 0,4 ou si un pays a moins de deux familles de sources. Le taux de couverture du Maroc est affiché chaque semaine.

---

## 7. Journal de prédictions et backtest

**Journal.**
- **Ce qui est journalisé** : une prédiction pour toute entité qui franchit le seuil de détection, pas seulement pour celles qui sont retenues. Sinon, le journal ne mesurerait jamais les faux positifs.
- **Forme d'une prédiction** : un événement binaire proche (« l'app X est disponible dans la vitrine France avant le 30 juin 2027 », « au moins trois offres locales en français existent avant la date D »). Elle porte une probabilité, un horizon et une règle de résolution écrite d'avance, du type « N relevés sur 7 jours ». Le statut « annulée » s'applique quand les données manquent.
- **Prédictions marocaines** : limitées à ce qui se résout réellement, c'est-à-dire la disponibilité et le rang en store, et la première mention dans une liste de médias curée.
- **Forme du fichier** : ajout seul, un seul écrivain, lignes chaînées par empreinte SHA-256, et empreinte ancrée chaque semaine hors du dépôt (horodatage OpenTimestamps ou commit dans un dépôt public séparé). Une chaîne gardée dans un dépôt qu'on contrôle ne prouve aucune antériorité.
- **Scores** : Brier, Brier relatif au taux de base, score d'intervalle ou CRPS pour les délais (la couverture seule récompense les intervalles trop larges). Les avis de plusieurs agents Claude nourris des mêmes données ne sont jamais « extrémisés » : ils ne sont pas indépendants. Ils restent agrégés tant qu'une classe a moins de 50 prédictions résolues. Aucune crédibilité n'est annoncée à 6 ou 12 mois, sauf pour les classes A et B. Les classes D à F se résolvent en plusieurs années.

**Backtest, pré-enregistré avant de le lancer.**
1. **Définitions figées** : arrivée par source, paramètres et critères d'acceptation écrits et commités avant toute exécution.
2. **Deux jeux de cas** :
   - 20 cas connus (Pokémon Go, Squid Game, Threads, chocolat de Dubaï, Labubu, Apple Pay, TikTok Shop, hard seltzer, pickleball, Hyrox…), séparés en cas d'ajustement et cas de test. Le jeu compte six cas nés hors des USA et quatre échecs.
   - Une **cohorte non choisie**, pour mesurer les faux positifs : des entités tirées des classements quotidiens de en.wikipedia sur des semaines aléatoires de 2023 à 2025, suivies vers fr.wikipedia et vers le jeu par pays.
3. **Références naïves à battre** : taux de base, délai constant, table de classes sans sentinelle.
4. **Critères d'acceptation** : faire mieux que le taux de base à 90 et 365 jours en score de Brier, et faire mieux que la table de classes seule en score d'intervalle sur les délais. Si la mise à jour par sentinelle ne fait pas mieux que la table seule, elle est retirée.
5. **Couverture variable du jeu Wikimedia** : chaque cas est normalisé par la couverture du jour, car celle du Maroc a été divisée par 17 entre 2023 et 2026, et les données US de 2023 ont été republiées avec un autre algorithme. Une absence sous le seuil n'est jamais lue comme « absent ».
6. **En cas d'échec** : le radar est livré en mode « veille et statut », sans probabilités affichées, et le journal accumule des données pour un nouvel essai à 6 mois.

Limite connue : le backtest valide Wikipedia et Google Trends, alors que la production repose aussi sur les stores et l'autocomplétion, qui n'ont pas d'historique. Ces capteurs seront validés par le journal, au fil de l'eau.

---

## 8. Architecture technique

### 8.1 Organisation

```
claudecode/
├── plugins/radar-decalage/        source unique, autonome et installable
│   ├── .claude-plugin/plugin.json
│   ├── skills/                    commandes (section 9), minces : elles appellent le code
│   ├── agents/                    local-scout, initiative-strategist, skeptic-verifier
│   ├── hooks/                     garde budgétaire, provenance, contrôle du rapport
│   ├── runbooks/                  consignes des tâches planifiées (lues par la tâche cloud)
│   ├── radar/                     paquet Python : collecteurs, détection, statut, portes,
│   │                              initiatives, journal, backtest, rapport, CLI
│   └── config/                    valeurs par défaut : pays, niches, classes, archétypes,
│                                  règles datées, registre des sources (avec champ « publiable »)
├── .claude-plugin/marketplace.json
├── .claude/settings.json          seulement les règles d'autorisation
├── workspace/                     vos données et votre configuration
│   ├── profile.yaml               profil du fondateur
│   ├── proposals/                 sorties de Claude, statut proposé ou validé
│   ├── data/                      JSONL compressé, partitionné par date et par source
│   ├── ledger/                    journal de prédictions chaîné
│   └── initiatives/               journal des initiatives, briefs, kits
├── dashboard/                     une page HTML autonome générée
└── tests/                         sur données enregistrées : aucun appel réseau en CI
```

Le nom `radar-decalage` remplace `trend-radar`, qui existe déjà ailleurs. Le code vit dans le plugin pour que celui-ci reste autonome, donc productisable. Les skills ne sont pas dupliqués dans `.claude/`.

### 8.2 Données

- **Un seul écrivain par fichier**, données en texte, en ajout seul.
- **La base SQLite est reconstruite** à chaque exécution à partir des fichiers et ignorée par git : un fichier binaire ne se fusionne pas.
- **Les instantanés vont sur une branche de données dédiée**, écrite par le seul collecteur.
- **Les propositions de Claude arrivent par une demande de fusion** que vous validez pendant votre heure de revue : c'est le moment de la validation humaine, dont celle des mots-clés en darija.

### 8.3 Exécution

| Tâche | Exécuteur | Écrit dans |
|---|---|---|
| Collecte quotidienne et horaire | Candidats : GitHub Actions (gratuit, sans IA) ou tâche planifiée Claude. Le pilote de 14 jours tranche sur le taux de succès réel par source | branche de données |
| Calculs hebdomadaires (détection, statut, prédictions, rapport) | même exécuteur, code seul | branche de données, journal |
| Propositions de Claude et décision de la semaine | tâche planifiée Claude Code, budget fixé par exécution | demande de fusion, rapport |
| Brief et kit | vous, en session | `workspace/initiatives/` |

Points à éprouver avant la planification définitive :
- **Un « Run now » de la tâche hebdomadaire**, pour mesurer son coût en tokens et vérifier quelle branche elle peut écrire. Un clone neuf repart de la branche par défaut, et une tâche cloud pousse sur une branche `claude/…`.
- **Un test de republication d'un Artifact** depuis la tâche. La version de référence du tableau de bord reste le fichier du dépôt, déployable sur Vercel.
- **Le chargement du plugin dans une tâche planifiée.** Les tâches cloud ne chargent ni les plugins installés côté utilisateur ni les marketplaces déclarées dans le dépôt. La tâche s'appuie donc sur le CLI et sur un runbook versionné, pas sur les skills.

**Budget par exécution.** Les étapes déterministes passent d'abord et sont commitées ; les étapes de Claude sont reprenables. Hors session interactive, atteindre la limite d'usage fait échouer les agents au lieu de les mettre en pause. Le contre-vérificateur ne travaille que sur le brief retenu et lit des adresses connues plutôt que de lancer des recherches. Une requête triviale avec une trentaine de plugins synchronisés consomme déjà environ 53 000 tokens d'entrée : la tâche planifiée tourne avec le strict nécessaire.

### 8.4 Pièges Claude Code traités

- Pas de dossier `bin/` à la racine du plugin : un contrôle de CI le refuse, sinon claude.ai refuse le plugin.
- Hook `PreToolUse` en mode bloquant en cas d'échec ; hook `Stop` avec compteur pour éviter une boucle.
- Aucune clé dans `userConfig`, qui n'est pas lu dans le cloud. Les clés futures passent par les secrets réseau de l'environnement.
- Sorties du CLI sous 50 000 caractères ; les gros volumes vont dans des fichiers.

---

## 9. Le plugin `radar-decalage`

| Commande | Rôle |
|---|---|
| `/radar-setup` | Vérifie l'environnement, crée le profil, teste les sources |
| `/radar-review` | Votre heure de la semaine : décision proposée, propositions à valider, état des tests en cours |
| `/radar-scan` | Collecte et détection à la demande |
| `/radar-brief <tendance> <pays>` | Brief stratégique, avec hypothèse de demande et seuil du test |
| `/radar-kit <initiative>` | Kit de lancement, canal d'abord |
| `/radar-log` | Note les heures, dépenses et résultats d'une initiative |
| `/radar-backtest` | Rejoue le backtest pré-enregistré |
| `/radar-ledger` | Résout les prédictions échues et affiche la précision |

| Agent | Rôle |
|---|---|
| `local-scout` | Vérifie la présence d'une tendance au Maroc ou en France : presse, autocomplétion, stores, équivalents locaux |
| `initiative-strategist` | Construit l'initiative sous les portes du profil |
| `skeptic-verifier` | Contre-vérifie chaque chiffre et chaque date du brief retenu |

Les commandes qui publient ou dépensent ne se déclenchent jamais seules.

---

## 10. Plugins et connecteurs à prévoir

| Rôle | Outil | État sur votre compte | Usage |
|---|---|---|---|
| Déployer landing pages et tableau de bord | Vercel | connecté | V1, kit de lancement |
| Visuels | Canva | connecté | V1, kit de lancement |
| Posts multi-réseaux | Postiz | connecté | Brouillons seulement, jamais publiés sans vous. L'offre hébergée est payante : sans compte actif, le kit livre les posts en fichiers |
| Voix off français et darija | ElevenLabs | connecté | Optionnel, consomme des crédits |
| Boutique | Shopify | connecté | À la demande ; pas de Shopify Payments au Maroc (alternative : YouCan) |
| Liste d'attente des tests de demande | Supabase | connecté | V1 ; le projet gratuit se met en pause après 7 jours d'inactivité |
| Archivage des briefs | Google Drive | connecté | Optionnel |
| Modèles pour la darija | Hugging Face | connecté | V2 |
| Alerte hebdomadaire | Slack (connecté, non activé dans ce chat), Gmail (à reconnecter) | partiel | Optionnel |
| Publicités et audiences TikTok | TikTok for Business | connexion incomplète | V2, à finaliser |
| Skills déjà installés et réutilisés | frontend-design, anti-ai-writing, marketing:content-creation, small-business:social-content-engine, small-business:seo-ai-visibility, dataviz | disponibles | V1 |
| Données payantes | DataForSEO, Apify ou ScrapeCreators, X, Exa ou Firecrawl, Similarweb, Ahrefs | non branchés | Quand le budget s'ouvre |

---

## 11. Garde-fous et licences

**Collecte**
- Pas de collecte derrière une connexion, respect des refus (403, robots.txt, captcha) sans contournement, quota par site, cache.
- L'anti-bot de certains médias (Medias24, L'Economiste) est contourné par la recherche Google News, pas par une autre adresse IP.

**Données personnelles**
- Seulement des agrégats : terme, compteur, date, pays. Aucun profil de personne.

**Exclusions par défaut des initiatives**
- Cibler des mineurs.
- Allégations de santé non étayées.
- Jeux d'argent et marchés de prédiction.
- Nicotine.
- Conseil financier sans cadre.
- Ultra fast-fashion.
- Dropshipping à petit panier depuis la Chine.

**Conformité dans chaque brief**
- Mention des contenus générés par IA (AI Act, article 50).
- Loi influenceurs en France : contrat écrit au-delà de 1 000 € HT.
- RGPD, et CNDP au Maroc.
- Règles WhatsApp Business : assistants IA généralistes interdits depuis le 15 janvier 2026 sauf dans l'UE et l'EEE, au Brésil et en Turquie, donc interdits en Suisse, au Québec, au Maroc et en Afrique. Les agents propres à une entreprise restent permis.

**Éligibilités relues sur les pages officielles, jamais codées en dur**
- Programme Partenaire YouTube : Maroc, Algérie, Tunisie et Sénégal éligibles ; Côte d'Ivoire, Cameroun et RDC non.
- TikTok Shop et publicités ChatGPT.
- Rails de paiement, pays par pays : Paddle exclut la RDC et le Mali ; Polar n'est pas disponible au Maroc ; le versement de Paddle vers une banque marocaine n'est pas vérifié.

**Change marocain**
- Cours du jour de Bank Al-Maghrib.
- Une pile d'outils avec Claude Pro tient dans la dotation de 20 000 DH par an.

**Licences**
- Usage interne en V1. Chaque source porte un champ « publiable » ; Product Hunt, Pinterest et les points d'accès Google ne le sont pas.
- Tout ce qui sera publié un jour, prédictions publiques comprises, ne repose que sur des sources publiables : Wikimedia, recherche App Store, pages officielles.
- **Le dépôt est public aujourd'hui : il ne doit pas recevoir de données brutes non publiables** (décision en section 14).

**Budget**
- 0 € appliqué par le code : les adaptateurs payants existent mais sont désactivés.

---

## 12. Pistes de départ

Ce sont des hypothèses issues de la recherche documentaire, à placer en liste de surveillance. Seul le radar, par la mesure, en fera des candidats à un test de demande.

| Piste | Pourquoi | Réserve |
|---|---|---|
| France : automatisation IA et visibilité dans les réponses des IA (GEO) pour TPE et indépendants | Archétypes adossés à un service, en tête de la grille en France | Version réduite seulement : l'agence complète demande environ 21 h par semaine |
| France : mise en relation pour la reprise de PME | Repreneurs 5 à 10 fois plus nombreux que les cédants sur le marché ouvert (CCI Paris IdF) : le goulot est l'appariement | À chiffrer en archétype |
| Maroc : outils pour marchands en paiement à la livraison (confirmation, risque de refus, créations en darija), en dirhams | 84 % des acheteurs en ligne paient à la livraison, avec 20 à 40 % de refus | Dépend de votre résidence et de votre darija |
| Maroc vers France : services vendus en euros depuis le Maroc | En tête de la grille au Maroc | Classement fragile : à 25 €/h, l'agence export recule au 4e rang ; à recalculer avec votre profil |
| Diaspora en France et en Belgique : services et commerce, y compris TikTok Shop | Seul accès à TikTok Shop pour ce public ; pouvoir d'achat européen | Cellule acheteur France, vendeur selon votre profil |
| Micro-dramas en français et en darija | Matures aux USA, DramaWave n°13 au Maroc | Pas d'archétype chiffré, et la « chaîne sans visage » est dernière de la grille : à chiffrer ou à retirer |
| Affiliation, Amazon KDP, impression à la demande, places de marché de contenus numériques | Archétypes adaptés à un solo à temps partiel, où l'automatisation par Claude pèse lourd | Étude complémentaire en cours, avec contre-vérification ; chaque archétype entrera dans la grille avec ses rails de paiement par pays |

**Productisation, plus tard.** Si le journal de prédictions est crédible après 6 à 12 mois, pour les classes A et B : newsletter francophone gratuite, puis premium (9 à 12 € par mois), offre agence (149 à 399 € par mois), puis études pour les marques. Encaissement par une entité européenne ou Paddle, et en dirhams pour les clients marocains.

---

## 13. Étapes de livraison

La collecte passe en premier, parce qu'une arrivée non capturée ne se date plus.

1. **Collecteur minimal planifié dès la première semaine** : disponibilité et classements App Store sur environ 25 vitrines, Google Play, autocomplétion historisée, Wikimedia par pays filtré, tendances du jour. Écriture en JSONL sur la branche de données.
2. **Pilote de 14 jours sur l'exécuteur réel** : taux de succès par source et par jour, maintien d'une source si elle répond au moins 90 % des jours, quota par hôte, repli payant activable source par source.
3. Pendant le pilote : schéma de données typé, profil, règles datées, statuts, portes, initiatives, journal.
4. Backtest pré-enregistré, cas connus et cohorte non choisie.
5. Plugin `radar-decalage` : skills, agents, hooks, runbooks, validation (`claude plugin validate --strict`) et contrôle de CI.
6. Tableau de bord.
7. Premier cycle réel : décision de la semaine, un brief et un kit d'exemple.
8. Revue de code indépendante, tests, commit et push sur la branche de travail.
9. Run now de la tâche hebdomadaire (coût, branche, Artifact), puis planification définitive après votre accord.

---

## 14. Décisions à prendre avec vous

1. **Validation du plan**, ou corrections.
2. **Profil du fondateur** : résidence fiscale et structure, lecture et écriture de la darija, canaux et audiences que vous possédez déjà.
3. **Visibilité du dépôt** : le passer en privé (recommandé : les données de certaines sources ne sont pas redistribuables), ou le garder public et stocker les données brutes ailleurs.
4. **Synthèse hebdomadaire publiée par vous** à partir de la semaine 4 : oui ou non.
5. **Module de contenu réactif** en V1 : oui ou non, et à quel niveau d'automatisation. Trois choix : brouillons validés par vous (recommandé), planification automatique après validation en un clic, ou publication entièrement automatique (déconseillée). Préciser sur quels comptes vous publieriez.

---

## Annexe A. Corrections apportées par les contre-vérifications et la critique

**Faits corrigés**
- L'interdiction des réseaux sociaux aux moins de 15 ans en France a été censurée par le Conseil constitutionnel le 14 août 2026 (décision 2026-911 DC).
- L'API YouTube interdit les métriques dérivées : elle ne sert pas au calcul des scores.
- Les scrapers TikTok payants ne filtrent pas par pays : le pays d'un signal TikTok est toujours une inférence.
- La date de sortie App Store est tronquée au Maroc et en Côte d'Ivoire ; la disponibilité par vitrine est la vraie mesure (14 des 18 apps US « absentes » en France y sont indisponibles).
- Wikipedia exige de regrouper les renommages : sans cela, le décalage de Threads passe à tort de 0 à 5 mois.
- Les variations d'« identités sociales » de DataReportal ne sont pas des croissances d'audience : la plateforme de référence change selon le pays et l'année.
- Stripe indique le pays du vendeur, pas celui de l'acheteur.
- Les « soumissions » App Store à +84 % sont un titre de presse ; les chiffres retenus sont ceux de Sensor Tower (nouvelles apps doublées au premier semestre 2026, téléchargements +2 %).
- La TikTok Commercial Content API couvre 32 pays européens, aucun hors d'Europe.
- La date de parution de Pinterest Predicts 2027 n'est pas confirmée ; seul un webinaire le 10 décembre l'est.
- Whee n'est pas un flux inverse marocain : c'est une vague mondiale où les USA sont arrivés en dernier.
- L'exemple Pokémon Go (« intérêt en français 7 jours avant le lancement en France ») ne prouve rien : l'édition française de Wikipedia est partagée avec la Belgique, la Suisse et le Québec, qui avaient lancé le jeu le même jour. Threads le remplace.
- La couverture du Maroc dans le jeu Wikimedia par pays n'est pas stable : 1 300 lignes par jour en 2023, 74 en 2026.
- Les délais ne suivent pas une loi log-normale simple : il faut un mélange qui admet les délais nuls et négatifs.
- Mann-Kendall exige au moins 6 points (8 recommandés), et le CUSUM ne détecte pas à froid.
- Reprise de PME en France : pas de déficit de repreneurs ; le goulot est l'appariement.
- Le classement « export depuis le Maroc en tête » ne résiste pas à une variation du coût horaire.
- Les chiffres annoncés par les plateformes (vendeurs TikTok Shop France, croissance de Whatnot France) sont déclaratifs.
- Le MRR affiché sur TrustMRR n'est pas un encaissement, et la base appartient à un fondateur qu'elle met en avant : elle n'entre pas dans les classements.

**Changements de conception issus de la critique**
- Modèle d'exploitation recalé sur 10 h par semaine.
- Une seule chaîne de score.
- Collecte d'abord, avec un pilote de 14 jours.
- Données en texte avec un seul écrivain et un ancrage externe.
- Statut « non mesurable ».
- Environ 25 vitrines.
- Backtest pré-enregistré avec une cohorte non choisie.
- Journal de toutes les entités détectées.
- Plugin autonome et renommé.
- Budget par exécution.
- Profil du fondateur, avec une dimension acheteur et vendeur.

Les dossiers complets (environ 900 000 caractères) sont conservés pour la phase de code.
