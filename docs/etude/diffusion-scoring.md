# Diffusion internationale des tendances : détection, scoring de transposabilité et mesure de la qualité des prévisions

Axe méthodologique de l'étude préalable du « Radar d'arbitrage de tendances ». Dossier rédigé le 2026-11-28.

## Conditions de production et niveaux de preuve

- **Le budget de recherche web du tour était épuisé dès la première requête** (plafond de 200 recherches partagé entre agents). Aucune recherche par moteur n'a donc été faite pour cet axe. Le travail repose sur : (1) la lecture directe d'URL connues (Wikipedia, pages officielles, arXiv, MIT News, Intercom, site de Geert Hofstede) ; (2) les résumés d'articles scientifiques obtenus par identifiant DOI auprès de l'API OpenAlex (métadonnées, pas une recherche) ; (3) des mesures faites dans cette session sur des données ouvertes (API Wikimedia Pageviews, jeu de données Wikimedia par pays sous confidentialité différentielle, API Wikidata, API Banque mondiale, fichier Hofstede) ; (4) les dossiers voisins de l'étude (`market-france-europe.md`, `market-maroc-maghreb.md`), cités avec leurs propres sources.
- Plusieurs articles de référence n'ont pu être lus qu'en résumé (éditeurs SAGE et INFORMS bloquent la lecture automatique, HTTP 403). Les chiffres détaillés absents des résumés sont marqués comme non vérifiés.

Légende :

| Code | Sens |
|---|---|
| [FAIT] | Lu dans une source primaire (article, résumé officiel, documentation, données officielles) |
| [FAIT-2] | Lu dans une source secondaire (Wikipedia, presse, dossier voisin) |
| [MESURE] | Calculé dans cette session sur données ouvertes ; reproductible avec les scripts listés en annexe |
| [ESTIMATION] | Raisonnement chiffré à partir de faits, non observé directement |
| [HYPOTHÈSE] | Proposition de conception ou d'interprétation, à tester |
| [NON VÉRIFIÉ] | Connaissance antérieure à la session, non revérifiée faute de recherche |

---

## 1. Synthèse

1. **Le décalage de diffusion existe, mais il dépend du type de verrou, pas de la distance culturelle seule.** La littérature marketing (Takada et Jain 1991 ; Tellis, Stremersch et Yin 2003 ; Chandrasekaran et Tellis 2008 ; van Everdingen, Fok et Stremersch 2009) établit que les pays qui adoptent plus tard adoptent plus vite, que le délai avant décollage est raccourci et converge entre pays, et que ce sont les **décollages étrangers**, pas les simples lancements, qui accélèrent un pays donné. Les retombées sont plus fortes entre pays proches par la géographie et l'économie, « pas nécessairement par la culture » [FAIT].
2. **À l'ère des plateformes mondiales, l'attention traverse en jours, l'adoption en mois ou en années.** Mesure faite dans cette session sur 15 cas et 6 éditions linguistiques de Wikipedia : pour les contenus et sorties mondiales (Squid Game, Wordle, Pokémon Go, Italian brainrot, Skibidi Toilet), l'écart d'attention entre l'anglais et le français ou l'allemand est compris entre -8 et +8 jours ; pour des produits (Labubu, chocolat de Dubaï), de 1 à 2 mois ; pour une fonctionnalité soumise au droit européen (Threads), 157 à 161 jours, soit exactement le retard de lancement dans l'UE [MESURE].
3. **Le jeu de données Wikimedia par pays (confidentialité différentielle, quotidien depuis février 2023, identifiant Wikidata) permet de dater l'arrivée par pays.** Labubu : USA le 2024-12-06, Canada +17 jours, Royaume-Uni +21, Allemagne +154, France +159, Belgique +169, Maroc +187 (28 jours après la France). Chocolat de Dubaï : Allemagne et Suisse le 2024-11-07, France +29 jours, **USA +63 jours** [MESURE]. Le Maroc n'apparaît qu'au-dessus de 90 vues par jour et par article : 74 lignes marocaines par jour contre 10 684 françaises le 2026-11-26. Le Maghreb et l'Afrique subsaharienne exigent d'autres capteurs.
4. **Une part importante des tendances ne vient pas des USA** ou y arrive après l'Europe : BeReal et Yuka (France), Hyrox (Allemagne, intensité par internaute 6,6 fois plus forte au Royaume-Uni qu'aux USA), padel (Espagne), chocolat de Dubaï (relais germanophone avant les USA), Labubu (Hong Kong et Chine), Squid Game (Corée), Clubhouse dont la vague allemande atteint la mi-hauteur 9 jours avant l'anglaise [MESURE et FAIT-2]. L'outil doit suivre des pays sentinelles hors USA.
5. **Détection au démarrage à froid** : dans environ 6 séries linguistiques sur 10, l'article Wikipedia de la langue cible naît pendant la vague ; un z-score robuste ou un CUSUM n'a alors aucune ligne de base. Il faut des règles d'apparition absolues (seuils, nombre de jours sur 7), des percentiles calculés entre entités plutôt que dans le temps, et le test de Mann-Kendall seulement à partir de 5 points (p minimal unilatéral de 1/120 = 0,0083) [MESURE].
6. **La prévisibilité a une borne** : même avec des données massives, les meilleurs modèles expliquent moins de la moitié de la variance de la taille des cascades sur Twitter (Martin et al. 2016) ; l'influence sociale accroît l'imprévisibilité (Salganik et al. 2006). Prédire « la tendance va continuer ou doubler » est faisable (Cheng et al. 2014), prédire sa taille finale non [FAIT].
7. **Le premier facteur de transposabilité est l'infrastructure, puis l'administration.** Comptes financiers chez les 15 ans et plus en 2024 : France 99,2 %, Sénégal 76,5 %, Côte d'Ivoire 57,6 %, Maroc 44,4 %, Tunisie 37,8 %, Algérie 35,3 % (Banque mondiale, Findex) [FAIT]. Apple Pay : USA 2014-10-20, France +638 jours, Maroc +3 193 jours [FAIT-2].
8. **La distance culturelle doit être calculée depuis le pays relais le plus proche déjà touché, pas depuis les USA.** Indice de Kogut-Singh sur les quatre dimensions de Hofstede : Maroc-USA 1,71 mais Maroc-France 0,51 ; Afrique de l'Ouest-USA 3,23 contre 1,71 depuis la France ; Québec-USA 0,56 [MESURE sur données Hofstede]. Les données Hofstede sont libres pour la recherche, **pas pour un usage commercial sans accord** [FAIT].
9. **Mesurer la qualité des prévisions est faisable dès le premier jour** : journal de prédictions opérationnelles (question, seuil, date, probabilité, règle de résolution automatique), score de Brier et sa décomposition de Murphy, score de compétence contre le taux de base, couverture des intervalles. Les leviers documentés par le tournoi IARPA (formation, équipes, suivi des meilleurs ; agrégation « extrémisée ») sont transposables [FAIT].
10. **Biais majeurs** : survivance (la moitié des pionniers échoue ; les leaders durables entrent en moyenne 13 ans après eux, Golder et Tellis 1993), battage (selon The Economist en 2024, environ un cinquième seulement des technologies suit le cycle de Gartner et six sur dix de celles qui tombent dans le creux ne remontent pas), échec des clones (Rocket Internet : introduction à 42,50 €, rachat à 18,57 € en 2020 ; Gorillas : licorne en 9 mois, fermée en mai 2024). Aucun taux de base publié de l'échec des clones n'a été trouvé.
11. **Livrable central** : un modèle en quatre modules (force US, écart par pays, transposabilité pays x niche x lifestyle, rendement d'initiative), avec formules, variables observables, pondérations par défaut justifiées, propagation de l'incertitude par Monte-Carlo, et un protocole de backtest sur 20 cas datés. Une implémentation de référence en Python standard tourne sur des séries réelles (annexe).

---

## 2. Preuves empiriques du décalage de diffusion

### 2.1 Le cadre de Bass et ses paramètres

- Modèle de Bass (1969) : le taux d'adoption conditionnel vaut p + q F(t), où p est le coefficient d'innovation (influence externe), q le coefficient d'imitation (influence interne) et F la part cumulée des adoptants. Testé à l'origine sur onze biens durables, il prédit bien le pic des ventes et sa date [FAIT, https://doi.org/10.1287/mnsc.15.5.215].
- Valeurs moyennes généralement citées : p ≈ 0,03 (plage 0,01 à 0,03), q ≈ 0,38 (plage 0,3 à 0,5), d'après Mahajan, Muller et Bass (1995) [FAIT-2, https://en.wikipedia.org/wiki/Bass_diffusion_model]. Ces ordres de grandeur sont ceux de l'adoption de biens durables à l'échelle annuelle, pas de l'attention en ligne.
- Le ratio q/p varie selon les pays : il croît avec l'indice de Gini et varie avec les quatre dimensions de Hofstede, dans trois cas sur quatre dans le sens d'une contagion sociale ; les effets culturels n'apparaissent que pour les produits sans normes concurrentes (méta-analyse de Van den Bulte et Stremersch 2004) [FAIT, https://doi.org/10.1287/mksc.1040.0054].

### 2.2 Effet de décalage (lead-lag) entre pays

| Étude | Données | Résultat utile pour l'outil | Preuve |
|---|---|---|---|
| Takada et Jain 1991, *Journal of Marketing* | Biens durables, quatre pays du Pacifique | Test des effets propres aux pays et des effets de décalage sur les taux de diffusion par le modèle de Bass | [FAIT] résumé, https://doi.org/10.1177/002224299105500206 ; le chiffre précis de l'accélération n'a pas pu être lu (HTTP 403) |
| Talukdar, Sudhir et Ainslie 2002, *Marketing Science* | 6 produits, 31 pays développés et en développement | Rappelle « l'effet positif bien connu des retards d'introduction sur la vitesse de diffusion » ; mais potentiel de pénétration des pays en développement environ trois fois plus faible (0,17 contre 0,52) et pic atteint 17,9 % plus tard (19,25 contre 16,33 ans) ; +1 % de commerce international ou d'urbanisation change le potentiel d'environ 0,5 % et 0,2 % ; la mise en commun bayésienne hiérarchique améliore la prévision dans les premières années | [FAIT] https://doi.org/10.1287/mksc.21.1.97.161 |
| Putsis et al. 1997, *Marketing Science* | 4 produits, 10 pays de la CEE | L'adoption antérieure dans un pays influence les autres ; Allemagne, France, Italie et Espagne sont les plus « sociables » (taux de contact) ; viser ces pays d'abord maximise l'adoption ultérieure | [FAIT] https://doi.org/10.1287/mksc.16.4.354 |
| Ganesh, Kumar et Subramaniam 1997, *JAMS* | Biens durables multinationaux | « Effet d'apprentissage » entre pays (titre et revue seulement lus) | [FAIT] métadonnées, https://doi.org/10.1177/0092070397253003 |
| van Everdingen, Fok et Stremersch 2009, *JMR* | 8 produits high-tech, 55 pays | **Les décollages étrangers, pas les introductions étrangères, accélèrent le décollage d'un pays.** Les pays grands, riches et exportateurs pèsent plus ; les pays pauvres, très touristiques et denses sont plus sensibles. Les retombées sont plus fortes entre pays proches géographiquement et économiquement, « mais pas nécessairement culturellement ». Les retombées sont asymétriques | [FAIT] https://doi.org/10.1509/jmkr.46.5.637 |

Conséquence de conception [HYPOTHÈSE] : l'événement à surveiller dans un pays sentinelle est le **décollage** (rupture de croissance), pas l'apparition. Et la matrice de retombées doit être asymétrique : le Royaume-Uni influence la France plus que l'inverse sur un produit anglophone.

### 2.3 Décollage international

| Étude | Données | Résultats | Preuve |
|---|---|---|---|
| Golder et Tellis 1997 | 16 catégories de l'après-guerre (USA) | Décollage moyen 6 ans après l'introduction, à 63 % du prix initial et 1,7 % de pénétration ; 18 ans avant-guerre ; seuils de prix à 1 000, 500 et 100 $ ; la règle de seuil identifie le décollage dans plus de 90 % des catégories ; prévision à un an avec une erreur moyenne de 1,2 an | [FAIT] https://doi.org/10.1287/mksc.16.3.256 |
| Tellis, Stremersch et Yin 2003 | 137 nouveaux produits, 10 catégories, 16 pays européens | Décollage moyen 6 ans après l'introduction ; **quatre fois plus court pour les produits de divertissement que pour l'électroménager** ; **presque deux fois plus court dans les pays scandinaves que dans les pays méditerranéens** ; la culture explique en partie les écarts, les facteurs économiques ne sont « ni forts ni robustes » ; avantage à la stratégie « en cascade » (pays par pays) | [FAIT] https://doi.org/10.1287/mksc.22.2.188.16041 |
| Chandrasekaran et Tellis 2008 | 16 produits, 31 pays (430 catégories-pays) | Le délai varie entre pays développés et en développement, entre produits « travail » et « loisir », entre groupes culturels et dans le temps ; décollage le plus rapide au Japon et en Norvège, puis autres pays nordiques, USA et centre de l'Europe ; facteurs : culture, richesse, classe de produit, millésime, **décollage antérieur** ; **le délai raccourcit et converge entre pays** | [FAIT] https://doi.org/10.1287/mksc.1070.0329 ; les moyennes chiffrées par groupe de pays ne figurent pas dans le résumé lu |

Lecture pour l'outil [ESTIMATION] : ces études mesurent l'adoption de biens physiques sur des années. Elles valident trois principes réutilisables (décollage comme événement, raccourcissement et convergence, rôle des décollages voisins), pas des délais à appliquer tels quels aux tendances numériques.

### 2.4 Mèmes, hashtags, vidéos : ce que dit la recherche sur les plateformes

| Étude | Résultat | Preuve |
|---|---|---|
| Kamath et al. 2013 (2 milliards de tweets géolocalisés) | Les hashtags sont mondiaux, mais **la distance physique contraint fortement leur adoption**, dans le partage comme dans le calendrier ; la plupart se diffusent sur de petites zones, à grande vitesse ; ce sont surtout des phénomènes locaux à durée de vie à longue traîne | [FAIT] https://doi.org/10.1145/2488388.2488447 |
| Ferrara et al. 2013 (11 000 sujets tendance, 63 villes US, 50 jours) | Deux classes : tendances locales (trois grappes régionales) et tendances globales nées dans plusieurs métropoles, qui coïncident avec les grands aéroports ; ces hubs donnent le ton national | [FAIT] https://doi.org/10.1145/2512938.2512956 |
| Brodersen et al. 2012 (20 millions de vidéos YouTube) | **Environ 50 % des vidéos font plus de 70 % de leurs vues dans une seule région** ; le partage social élargit la portée géographique ; une vidéo qui ne transforme pas son élan social en découverte reste confinée | [FAIT] https://doi.org/10.1145/2187836.2187870 |
| Leskovec, Backstrom et Kleinberg 2009 (90 millions d'articles) | Décalage typique de 2,5 heures entre le pic d'attention d'une phrase dans les médias et dans les blogs | [FAIT] https://doi.org/10.1145/1557019.1557077 |
| Goel et al. 2016 (un milliard d'événements de diffusion sur Twitter) | La viralité structurelle est faible ; la popularité dépend surtout de la taille de la plus grande diffusion (broadcast) | [FAIT] https://doi.org/10.1287/mnsc.2015.2158 |
| Weng et al. 2012 | L'hétérogénéité de popularité des mèmes s'explique par la compétition pour une attention limitée et la structure du réseau, sans supposer de valeur intrinsèque différente | [FAIT] https://doi.org/10.1038/srep00335 |
| Mestyán, Yasseri et Kertész 2013 | L'activité des lecteurs et éditeurs Wikipedia prédit le succès d'un film avant sa sortie | [FAIT] https://doi.org/10.1371/journal.pone.0071226 |

Conséquences [HYPOTHÈSE] : (1) un signal US « national » (multi-métropoles, multi-familles de sources) a plus de chances de traverser qu'un signal régional ; (2) la diffusion par un gros compte (broadcast) peut faire traverser un contenu en heures, ce qui rend inutile toute stratégie lente sur cette classe ; (3) la majorité des contenus restent locaux : le taux de base de traversée est bas.

### 2.5 Mesures de cette session : décalage d'attention entre éditions linguistiques

Méthode [MESURE] : API Wikimedia Pageviews, vues quotidiennes humaines, articles reliés par Wikidata ; écart entre la date où chaque édition atteint 50 % de son propre pic et la même date en anglais. Script `scripts_diff/daily_lag.py`, données `dl_diff/daily_lag.json`.

| Cas (origine) | Anglais (d50) | Écart fr | Écart de | Écart es | Écart it | Écart ar | Lecture |
|---|---|---|---|---|---|---|---|
| Pokémon Go (USA, 2016) | 2016-07-09 | +8 j | +4 j | +2 j | +5 j | +3 j | Intérêt avant la disponibilité : la France n'ouvre que le 24 juillet |
| Fidget spinner (USA, 2017) | 2017-05-10 | +6 j | +8 j | +24 j* | -4 j | +26 j | Produit physique simple |
| Squid Game (Corée, 2021) | 2021-09-25 | +1 j | +3 j | -3 j | +7 j | +1 j | Sortie mondiale simultanée |
| Clubhouse (USA, 2021) | 2021-02-01 | +15 j | **-9 j** | +15 j | +7 j | +20 j | Vague allemande avant la vague américaine |
| Wordle (USA, 2022) | 2022-01-20 | -4 j | -1 j | +112 j | +29 j | +16 j | Diffusion par Twitter anglophone |
| ChatGPT (USA, 2022) | 2023-01-17 | -8 j | -8 j | +56 j | +72 j | n.d. | Le pic anglais tardif (GPT-4) décale la mesure |
| Quiet quitting (USA, 2022) | 2022-08-20 | n.d. | +5 j | +44 j | n.d. | n.d. | Concept préexistant en allemand |
| Threads (USA, 2023) | 2023-07-10 | **+161 j** | -4 j | +157 j | +158 j | -4 j | Lancement UE le 14 déc. 2023 ; l'arabe suit le lancement initial |
| Skibidi Toilet (USA, 2023) | 2023-11-01 | +8 j | n.d. | 0 j | n.d. | -55 j* | Mème vidéo |
| Chocolat de Dubaï (EAU) | 2025-02-02 | +49 j | **-74 j** | n.d. | n.d. | +18 j | L'allemand mène |
| Labubu (Hong Kong et Chine) | 2025-06-15 | +52 j | +40 j | +10 j | +66 j | +13 j | Produit à rareté organisée |
| Italian brainrot (Italie) | 2025-04-28 | n.d. | n.d. | +1 j | +197 j* | +3 j | L'article italien est créé tard |
| Hyrox (Allemagne) | 2026-09-14 | -148 j | -681 j | n.d. | n.d. | n.d. | Flux Europe vers USA |

\* Valeurs dominées par la date de création de l'article ou par des volumes très faibles. n.d. : article inexistant ou série inexploitable dans la fenêtre.

Lectures [ESTIMATION] :

- Les contenus et sorties mondiales (Squid Game, Wordle, Pokémon Go, Skibidi Toilet, Italian brainrot) traversent l'anglais, le français et l'allemand en **-8 à +8 jours**.
- Les produits (Labubu, chocolat de Dubaï, fidget spinner) traversent en **1 semaine à 2 mois**, avec des pays relais non américains.
- Une barrière réglementaire (Threads) produit un écart **égal au retard de disponibilité** (162 jours entre le 5 juillet et le 14 décembre 2023), alors que l'attention allemande et arabe suit le jour du lancement. Les pays francophones hors UE (Maroc, Sénégal, Québec) ne subissent pas ce retard propre à l'UE ; la date de lancement au Maroc n'a pas été vérifiée, le pic arabe du 6 juillet 2023 est un indice [ESTIMATION].
- **L'attention précède la disponibilité** : Pokémon Go atteint la moitié de son pic en français le 17 juillet 2016, sept jours avant le lancement français. C'est la fenêtre d'arbitrage typique : une demande locale sans offre locale.

### 2.6 Mesure de l'arrivée par pays (jeu Wikimedia sous confidentialité différentielle)

Caractéristiques du jeu [FAIT, https://analytics.wikimedia.org/published/datasets/country_project_page/00_README.html, lu le 2026-11-28] : quotidien depuis le 2023-02-06 ; pays x projet x page, avec l'identifiant Wikidata depuis mars 2024 ; bruit gaussien ; publication seulement au-dessus de 90 vues par jour pour les pays à risque faible (550 et 1 000 pour les pays à risque moyen et élevé) ; 95 % des valeurs à moins de 35,7 vues de la vraie valeur pour les pays à risque faible ; données US manquantes du 2023-02-06 au 2023-09-19.

Couverture observée le 2026-11-26 [MESURE] : USA 95 640 lignes, France 10 684, Canada 9 419, Suisse 601, Belgique 560, Algérie 90, Maroc 74, Côte d'Ivoire 21, Tunisie 20, Sénégal 16.

Arrivée par pays, définie comme le premier jour où l'article (toutes langues confondues, même identifiant Wikidata) dépasse le seuil de publication [MESURE, script `scripts_diff/dp_country.sh` et `dp_analyze.py`, données `dl_diff/dp_daily.tsv`, fenêtre du 2024-09-01 au 2025-10-31] :

| Cas | Premier pays | Arrivées suivantes (écart en jours depuis les USA ou le premier pays) | Intensité cumulée par million d'internautes |
|---|---|---|---|
| Labubu | USA, 2024-12-06 | Canada +17, Royaume-Uni +21, Italie +89, Suisse +153, Allemagne +154, France +159, Espagne +168, Belgique +169, **Maroc +187** (28 jours après la France), Algérie et Tunisie : un seul jour (juillet 2025) | Canada 6 584, Allemagne 6 130, USA 4 891, Royaume-Uni 4 852, Suisse 4 241, Belgique 3 026, France 2 802, Espagne 1 398, Maroc 183 |
| Chocolat de Dubaï | Allemagne et Suisse, 2024-11-07 | Italie et France +29, Espagne +42, **USA +63**, Royaume-Uni +63, Canada +64, Belgique +115, Maroc jamais au-dessus du seuil | Allemagne 7 371, Suisse 4 829, Royaume-Uni 2 972, **France 2 177, USA 1 875**, Canada 1 752 |
| Italian brainrot | Tous les pays le 2025-05-08 | Arrivée simultanée (premier jour de présence de l'article au-dessus du seuil) | Royaume-Uni 2 997, Canada 2 929, USA 2 519, France 450 |
| Hyrox | USA, Royaume-Uni, Allemagne présents dès le début de la fenêtre | France 2024-09-04, Canada 2024-10-05, Italie 2024-10-19, Suisse 2024-12-11, Belgique 2025-04-05 (3 jours seulement) | **Royaume-Uni 2 147**, Allemagne 1 256, France 581, USA 326 |

Lectures [ESTIMATION] :

- Le jeu par pays **corrige le défaut principal des éditions linguistiques** (l'anglais n'est pas les USA, le français n'est pas la France) et date directement l'arrivée par pays. Il est gratuit et quotidien.
- **Seuil de détection** : au Maroc, un article n'apparaît qu'à partir de 90 vues par jour venant du pays. Seules les très grosses vagues sont visibles (Labubu oui, chocolat de Dubaï non). Pour le Maghreb et l'Afrique subsaharienne, il faut compléter avec Google Trends, YouTube (`regionCode`), les classements d'applications par pays et les créateurs locaux (dossiers voisins).
- L'intensité par internaute est un **indicateur de transposition réalisée** : le Hyrox est 6,6 fois plus intense au Royaume-Uni qu'aux USA ; le chocolat de Dubaï est plus intense en France qu'aux USA.

### 2.7 « Time machine management », Rocket Internet et les clones

- **Time machine management** [NON VÉRIFIÉ] : expression attribuée à Masayoshi Son (SoftBank) pour désigner l'importation au Japon de modèles déjà validés aux USA, comme si l'on voyageait dans le temps. Aucune source primaire n'a pu être lue dans cette session (pages Wikipedia anglaise et japonaise de Son et de SoftBank sans mention du terme). Fait daté associé : Yahoo! et SoftBank forment Yahoo! Japan en janvier 1996, le site ouvre le 1er avril 1996 [FAIT-2, https://en.wikipedia.org/wiki/Yahoo!_Japan].
- **Rocket Internet** [FAIT-2] : fondée à Berlin en 2007 par les frères Samwer, stratégie de construction de start-up sur des « modèles éprouvés » qualifiée de copie ; Zalando (2008) émule Zappos ; introduction en bourse le 2 octobre 2014 à 42,50 € ; retrait de la cote effectif le 30 octobre 2020 avec un rachat à 18,57 € par action, soit -56 % sans dividende intermédiaire ; liquidation de Take Eat Easy en juillet 2016 (https://en.wikipedia.org/wiki/Rocket_Internet ; https://de.wikipedia.org/wiki/Rocket_Internet).
- **Vague du commerce ultra-rapide** [FAIT-2] : goPuff (Philadelphie, 2013) sert de modèle ; Gorillas fondée à Berlin en mai 2020, licorne en 9 mois, rachetée par Getir en décembre 2022 pour 1,2 Md$, retrait de tous les marchés hors Turquie annoncé en avril 2024 (https://en.wikipedia.org/wiki/Gorillas_(company)). Au Maroc, les 7 dark stores de Glovo ont fermé fin février 2026 (dossier Maroc).
- **Taux de base d'échec des clones** : **aucun chiffre publié trouvé**. Repères voisins : près de la moitié des pionniers échouent et les leaders de long terme entrent en moyenne 13 ans après eux (Golder et Tellis 1993, environ 500 marques dans 50 catégories) [FAIT, https://doi.org/10.1177/002224379303000203]. Être second n'est donc pas un handicap en soi ; copier un modèle qui échoue à la source l'est.

### 2.8 Ordres de grandeur : ce qui traverse en jours, en mois, en années

| Horizon | Type de tendance | Cas datés | Mécanisme |
|---|---|---|---|
| Heures à jours | Mèmes, sons, défis, sorties mondiales | Harlem Shake : 4 000 vidéos par jour le 10 févr. 2013, environ 40 000 versions le 15 févr. [FAIT-2] ; Ice Bucket Challenge viral en juillet-août 2014, hausses comparables sur les Wikipedia anglaise, espagnole et allemande [FAIT-2] ; Squid Game, Wordle, Italian brainrot : -8 à +8 jours [MESURE] | Même graphe de recommandation ; coût d'adoption nul ; contenu visuel ou musical sans traduction ; un seul gros relais suffit |
| Semaines à 6 mois | Produits sans barrière, applications mondiales sans verrou | Labubu France +159 j, Maroc +187 j ; chocolat de Dubaï France +29 j avant les USA ; Stanley 1 à 5 mois ; Temu 7 mois [MESURE, dossier France] | L'offre doit suivre (importateurs, revendeurs, créateurs locaux), le stock et le prix |
| 5 à 24 mois | Fonctionnalités de plateforme, paiement, disponibilité régionale | Threads UE +162 j ; Pokémon Go France +18 j, Maroc et Côte d'Ivoire +90 j ; Apple Pay Royaume-Uni +267 j, Canada +393 j, France +638 j ; TikTok Shop France +18,6 mois, Belgique +33 mois [FAIT-2] | Calendrier de déploiement, conformité (DMA, RGPD), accords bancaires |
| 2 à 10 ans, ou jamais | Produits réglementés, infrastructure physique, modèles d'affaires dépendant des rails de paiement | Netflix (streaming US janv. 2007) : Royaume-Uni janv. 2012, France sept. 2014 (environ 92 mois), monde entier dont le Maghreb janv. 2016 (environ 108 mois) [FAIT-2] ; Apple Pay Maroc 2023-07-18 (+3 193 j) [FAIT-2] ; Stripe absent du Maroc en 2026 [FAIT, dossier Maroc] ; VTC au Maroc : suspension en 2018, retour d'Uber le 2025-11-27 [FAIT-2] | Droit, licences, change, logistique, fédérations, disposition à payer |

---

## 3. Détection dans des séries courtes et bruitées

### 3.1 Les sources de bruit à connaître

| Source | Problème | Preuve |
|---|---|---|
| Google Trends | Indice relatif 0-100, rééchantillonné à chaque requête ; les séries quotidiennes ne reproduisent pas les tendances longues ; **bruit d'échantillonnage « substantiel »** | [FAIT] Eichenauer et al., https://doi.org/10.1111/ecin.13049 |
| Données massives à source unique | Google Flu Trends a surestimé la grippe ; erreurs « largement évitables » en combinant avec d'autres données | [FAIT] Lazer et al. 2014, https://doi.org/10.1126/science.1248506 |
| Wikipedia par pays | Bruit gaussien ± 35,7 vues (IC 95 %), seuil de publication 90 vues | [FAIT] README Wikimedia |
| Wikipedia par langue | Création d'article pendant la vague, renommages, redirections, pics médiatiques d'un jour (Pickleball en français : pic isolé le 2020-12-12) | [MESURE] |
| API publiques | Limites de débit : erreurs HTTP 429 observées sur l'API Pageviews au-delà d'environ une requête par seconde | [MESURE] |

Google Trends reste utile pour « prédire le présent » (ventes automobiles, chômage, tourisme) [FAIT, Choi et Varian 2012, https://doi.org/10.1111/j.1475-4932.2012.00809.x], à condition de moyenner plusieurs tirages et de recaler les fréquences.

### 3.2 Indicateurs de détection

| Indicateur | Formule ou principe | Données minimales | Usage dans l'outil |
|---|---|---|---|
| Vitesse | Pente de Theil-Sen (médiane des pentes par paires) sur log(1+y) | 8 points | Variable principale de croissance, robuste aux valeurs extrêmes |
| Accélération | Différence de vitesse entre deux fenêtres | 16 points | Faible poids : la dérivée seconde amplifie le bruit |
| Z-score robuste | 0,6745 (x - médiane) / MAD, alerte au-dessus de 3,5 (règle d'Iglewicz et Hoaglin [NON VÉRIFIÉ ici]) | 28 jours de ligne de base | Pics par rapport à l'historique propre ; inutilisable si l'entité est nouvelle |
| Mann-Kendall | S = Σ signe(y_j - y_i) ; τ = S / (n(n-1)/2) ; p par approximation normale, correction de Hamed et Rao (1998) si autocorrélation | p minimal unilatéral exact = 1/n! : 0,042 pour n = 4, 0,0083 pour n = 5, 0,0014 pour n = 6 [MESURE] | Persistance de la hausse ; pas avant 5 points hebdomadaires |
| CUSUM (Page 1954) | C_t = max(0, C_{t-1} + (x_t - μ0)/σ0 - k), alerte si C_t > h | Ligne de base stable | Rupture de niveau ; très sensible, déclenche tôt |
| Changement de régime bayésien en ligne (Adams et MacKay 2007) | Distribution de la « longueur de course » depuis la dernière rupture, mise à jour par passage de messages | Aucune ligne de base fixe | Probabilité qu'une rupture soit récente ; bon substitut au CUSUM à froid |
| PELT (Killick et al. 2012) | Minimisation pénalisée d'un coût de segmentation, coût linéaire | Série complète | Rétrospectif : dater les ruptures pour le backtest |
| Rafales de Kleinberg (2002-2003) | Automate à deux états ; version par lots : r_t éléments pertinents sur d_t, taux p0 = R/D, p1 = s p0, coût de transition γ ln n | Comptes et dénominateurs par jour | Part d'un terme dans un flux (titres de presse, posts) ; repère des rafales sans ligne de base longue |
| Méthode non paramétrique de Nikolov et Shah | Vote pondéré par similarité avec 200 séries tendances et 200 non tendances | Base d'apprentissage | A prédit les sujets tendance de Twitter 1,5 heure avant l'algorithme de Twitter en moyenne (jusqu'à 4 à 5 heures), 95 % de justesse, 4 % de faux positifs |
| Seuil de décollage (Golder et Tellis) | Croissance relative à la base qui franchit une courbe décroissante avec le niveau de base | Historique court | Décollage dans un pays sentinelle |

Sources : Hamed et Rao https://doi.org/10.1016/S0022-1694(97)00125-X ; Page https://doi.org/10.1093/biomet/41.1-2.100 ; Adams et MacKay https://arxiv.org/abs/0710.3742 (19 oct. 2007) ; Killick et al. https://doi.org/10.1080/01621459.2012.737745 ; Kleinberg https://doi.org/10.1023/A:1024940629314 et https://www.cs.cornell.edu/home/kleinber/bhs.pdf ; Nikolov et Shah, MIT News du 1er nov. 2012, https://news.mit.edu/2012/predicting-twitter-trending-topics-1101 [tous FAIT].

### 3.3 Comparaison des détecteurs sur séries réelles

Implémentation de référence (`scripts_diff/scoring_reference.py`, mode `demo`), dates de première alerte [MESURE] :

| Série | Z robuste | CUSUM | Mann-Kendall 8 sem. | Kleinberg | Seuil de décollage | 50 % du pic | Pic |
|---|---|---|---|---|---|---|---|
| en : Labubu | 2025-02-22 | 2025-02-24 | 2025-05-20 | 2025-06-10 | 2025-05-29 | 2025-06-15 | 2025-07-16 |
| fr : Labubu (article créé le 2025-06-09) | aucune | 2025-09-01 | aucune | 2025-08-05 | aucune | 2025-08-06 | 2025-08-24 |
| de : Dubai-Schokolade (créé le 2024-11-01) | aucune | 2024-12-12 | aucune | 2024-11-11 | aucune | 2024-11-20 | 2024-11-21 |
| en : Dubai chocolate | 2025-03-20 | 2025-02-02 | 2025-02-22 | 2025-03-15 | aucune | 2025-02-02 | 2025-04-20 |
| fr : Chocolat Dubaï | 2025-02-01 | 2025-02-09 | 2025-03-17 | 2025-03-15 | 2025-02-06 | 2025-03-23 | 2025-03-27 |
| de : Hyrox | 2024-08-26 | 2024-08-31 | aucune | 2024-09-01 | 2024-09-01 | 2024-11-02 | 2024-11-03 |
| fr : Hyrox | 2026-02-13 | 2025-11-25 | 2026-04-12 | 2026-03-21 | 2026-09-15 | 2026-04-19 | 2026-09-15 |
| en : Hyrox | 2024-04-28 | 2023-05-05 | 2024-05-19 | aucune | 2024-05-02 | 2026-09-14 | 2026-09-17 |

Lectures [ESTIMATION] :

- **Le z-score robuste et le CUSUM alertent tôt** (Labubu en anglais : près de 4 mois avant la mi-hauteur ; Hyrox en anglais : 2 ans et plus), mais sans contrôle du taux de faux positifs. Ils servent à mettre une entité en observation, pas à conclure.
- **Mann-Kendall et le seuil de décollage confirment plus tard**, 2 à 4 semaines avant la mi-hauteur pour Labubu en anglais (26 et 17 jours) : bons candidats pour passer du stade « émergent » au stade « accélération ».
- **À froid (article nouveau), seuls Kleinberg et le CUSUM répondent** ; la création d'article est elle-même un événement d'arrivée.
- Sur 76 séries langue x cas, 47 ont un premier jour de données à moins de 14 jours du franchissement de 10 % du pic, et le z-score robuste n'a alerté que dans 45 séries [MESURE, approximatif : l'indicateur de création confond parfois un début de fenêtre et une création].

### 3.4 Corroboration multi-sources et résolution d'entités

- **Familles de sources indépendantes** [HYPOTHÈSE de conception] : recherche (Google Trends), encyclopédie (Wikipedia), vidéo (YouTube), vidéo courte (TikTok, Instagram), discussion (Reddit), presse (GDELT), commerce (Amazon, TikTok Shop, magasins d'applications). La corroboration se compte en familles, pas en sources : deux scrapers TikTok ne valent qu'une famille.
- **Pivot d'identité : l'identifiant Wikidata (QID).** Il relie les titres de toutes les langues (« Dubai chocolate », « Dubai-Schokolade », « Chocolat Dubaï », « شوكولاتة دبي ») et sert de clé dans le jeu Wikimedia par pays [MESURE]. Pour une tendance sans article, créer un identifiant interne avec alias par langue, hashtags et expressions, puis le rattacher à un QID dès qu'il existe.
- Pièges observés [MESURE] : le QID de Labubu est aussi porté par la page anglaise « Kasing_Lung » (créateur du personnage) dans le jeu par pays ; « Quiet quitting » est relié à l'article allemand « Innere Kündigung », un concept plus ancien. Il faut une table d'alias validée et un contrôle de cohérence (une page dont la série existe bien avant la vague est suspecte).

### 3.5 Saisonnalité

- Une décomposition saisonnière annuelle demande au moins deux cycles complets. Au démarrage, ne comparer d'une année sur l'autre qu'à partir de 13 mois d'historique ; sinon utiliser une ligne de base entre entités de la même catégorie [HYPOTHÈSE].
- Effets de calendrier à coder par pays [HYPOTHÈSE] : cycle hebdomadaire ; rentrée ; soldes ; Black Friday ; fêtes de fin d'année ; **Ramadan**, dont les dates reculent d'environ 11 jours par an et dépendent de l'observation lunaire au Maroc (début vers la mi-février en 2026 et vers le début février en 2027 [ESTIMATION astronomique, à vérifier]) ; événements sportifs (CAN 2025 au Maroc du 2025-12-21 au 2026-01-18 [FAIT-2, dossier Maroc]).
- Prophet (Taylor et Letham 2018) est un modèle additif à paramètres interprétables avec revue humaine des prévisions douteuses [FAIT, https://doi.org/10.1080/00031305.2017.1380080] ; il demande un historique et convient aux séries de fond, pas aux vagues nouvelles.

### 3.6 Ce qui reste réaliste au démarrage à froid

1. **Le démarrage à froid concerne les entités, pas le système** : Wikipedia fournit un historique quotidien depuis 2015 et par pays depuis 2023 ; l'API Google Trends en alpha promet 5 ans glissants (dossier voisin `claude-code-plugins.md`). L'outil peut rejouer l'historique dès son installation [FAIT et ESTIMATION].
2. Pour une entité nouvelle : règles absolues (seuil d'apparition, 3 jours sur 7), Kleinberg sur la part dans un flux, changement de régime bayésien, et **percentiles transversaux** (rang de la vitesse parmi toutes les entités suivies la même semaine).
3. Ne jamais émettre de probabilité de traversée sur une seule famille de sources.
4. Prédire des événements binaires proches et vérifiables (« la tendance atteindra le seuil d'arrivée en France avant le 2027-03-01 ») plutôt que des tailles finales : la littérature borne la prévisibilité des tailles (Martin et al. 2016, moins de la moitié de la variance expliquée, https://doi.org/10.1145/2872427.2883001) alors que la croissance future devient plus prévisible à mesure qu'on observe la cascade (Cheng et al. 2014, https://doi.org/10.1145/2566486.2567997) [FAIT].

---

## 4. Cadres de scoring disponibles

### 4.1 RICE et ICE

- **RICE** (Sean McBride, Intercom, 5 janvier 2018) : portée (personnes ou événements par période), impact individuel sur l'échelle 3 (massif), 2 (élevé), 1 (moyen), 0,5 (faible), 0,25 (minimal), confiance 100 %, 80 % ou 50 % (en dessous : « pari »), effort en personnes-mois. Le score est l'impact total par unité de temps de travail ; la formule (Portée x Impact x Confiance) / Effort n'apparaît que dans une image de l'article [FAIT, https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/].
- **ICE** (Impact, Confiance, Facilité, chacun noté de 1 à 10) : tri rapide d'expériences de croissance, attribué à Sean Ellis [NON VÉRIFIÉ ici]. Utile pour une première passe, trop subjectif pour un classement final.
- **Attractivité x faisabilité** (matrices de portefeuille du type GE-McKinsey) [NON VÉRIFIÉ ici] : utile pour l'affichage (deux axes), pas comme modèle de calcul.

### 4.2 Distance CAGE de Ghemawat

Ghemawat, « Distance Still Matters », *Harvard Business Review*, septembre 2001 : les entreprises surestiment l'attrait des marchés étrangers [FAIT, https://hbr.org/2001/09/distance-still-matters-the-hard-reality-of-global-expansion, texte intégral payant]. Les quatre distances [FAIT-2, https://en.wikipedia.org/wiki/CAGE_Distance_Framework] :

| Distance | Attributs par paire de pays | Attributs propres au pays | Secteurs les plus sensibles |
|---|---|---|---|
| Culturelle | Langue, ethnies, réseaux, religion, confiance, valeurs | Insularité, traditionalisme | Biens de consommation et médias |
| Administrative | Absence de liens coloniaux, de bloc commercial, de monnaie commune ; hostilité politique | Économie fermée, institutions faibles | Secteurs réglementés [ESTIMATION] |
| Géographique | Distance, frontière, fuseaux horaires, climat | Enclavement, taille, transports | Produits lourds ou volumineux |
| Économique | Écart de richesse, coût et qualité des ressources | Taille, faible revenu par habitant | Produits sensibles au prix [ESTIMATION] |

Les effets chiffrés de la langue commune ou des liens coloniaux sur le commerce, issus de modèles de gravité, n'ont pas pu être lus dans cette session.

### 4.3 Hofstede et indice de Kogut-Singh

Données [FAIT, https://geerthofstede.com/research-and-vsm/dimension-data-matrix/, fichier 2015-12-08, échelle 0-100] : « Les chercheurs peuvent les utiliser sans demander la permission. Ceux qui envisagent un usage commercial doivent nous contacter. » **Contrainte de licence pour un outil commercial.**

| Pays ou groupe | Distance de pouvoir | Individualisme | Masculinité | Contrôle de l'incertitude | Orientation long terme | Indulgence |
|---|---|---|---|---|---|---|
| USA | 40 | 91 | 62 | 46 | 26 | 68 |
| France | 68 | 71 | 43 | 86 | 63 | 48 |
| Belgique francophone | 67 | 72 | 60 | 93 | n.d. | n.d. |
| Suisse romande | 70 | 64 | 58 | 70 | n.d. | n.d. |
| Canada francophone | 54 | 73 | 45 | 60 | n.d. | n.d. |
| Maroc | 70 | 46 | 53 | 68 | 14 | 25 |
| Pays arabes (agrégat) | 80 | 38 | 53 | 68 | 23 | 34 |
| Afrique de l'Ouest (agrégat) | 77 | 20 | 46 | 54 | 9 | 78 |
| Allemagne | 35 | 67 | 66 | 65 | 83 | 40 |
| Royaume-Uni | 35 | 89 | 66 | 35 | 51 | 69 |
| Espagne | 57 | 51 | 42 | 86 | 48 | 44 |

Algérie et Tunisie n'ont de scores que pour les deux dernières dimensions ; Sénégal et Côte d'Ivoire n'ont pas de scores propres (seulement l'agrégat Afrique de l'Ouest).

Indice de Kogut et Singh (1988) : KS = (1/n) Σ_i (I_i,cible - I_i,source)² / V_i, où V_i est la variance de la dimension i entre tous les pays [FAIT pour la définition, https://doi.org/10.1057/palgrave.jibs.8490394]. Calcul [MESURE] :

| Cible | KS depuis les USA (4 dim.) | KS depuis les USA (6 dim. si dispo.) | KS depuis la France (4 dim.) |
|---|---|---|---|
| France | 1,69 | 1,65 | 0 |
| Belgique francophone | 1,68 | 1,68 | 0,24 |
| Suisse romande | 1,14 | 1,14 | 0,32 |
| Québec (Canada francophone) | 0,56 | 0,56 | 0,45 |
| Maroc | 1,71 | 1,81 | **0,51** |
| Pays arabes (proxy Algérie, Tunisie) | 2,46 | 2,04 | 0,80 |
| Afrique de l'Ouest (proxy Sénégal, Côte d'Ivoire) | 3,23 | 2,27 | 1,71 |
| Royaume-Uni | 0,09 | 0,24 | 2,45 |
| Allemagne | 0,46 | 1,51 | 1,24 |
| Espagne | 1,96 | 1,64 | 0,25 |

Limites [FAIT] : l'indice suppose des distances symétriques et stables, critique classique de Shenkar 2001 (https://doi.org/10.1057/palgrave.jibs.8490982) ; la méta-analyse de Beugelsdijk et al. (https://doi.org/10.1177/0149206317729027) trouve que les effets de la distance culturelle dépendent du cadre utilisé (Hofstede ou GLOBE) et du pays d'origine, et qu'elle pèse fortement sur la performance des filiales. Berry, Guillén et Zhou 2010 proposent une approche institutionnelle à plusieurs dimensions (https://doi.org/10.1057/jibs.2010.28, métadonnées seulement).

### 4.4 Carte culturelle d'Inglehart-Welzel

Deux axes [FAIT, https://www.worldvaluessurvey.org/WVSContents.jsp?CMSID=Findings] : valeurs traditionnelles contre valeurs séculières-rationnelles (religion, liens parents-enfants, déférence envers l'autorité, famille traditionnelle) ; valeurs de survie contre valeurs d'expression de soi (sécurité économique et physique, confiance, tolérance des minorités, égalité des sexes, participation). Le développement économique déplace les sociétés vers des valeurs rationnelles, tolérantes et participatives, mais le changement dépend du chemin et l'héritage religieux et culturel persiste ; les écarts entre religions à l'intérieur d'un pays sont plus faibles que les écarts entre pays (Inglehart et Baker 2000, 65 sociétés) [FAIT, https://doi.org/10.2307/2657288]. La version et les coordonnées par pays de la carte la plus récente n'ont pas été lues ; elles sont à récupérer dans les données de la WVS.

Usage proposé [HYPOTHÈSE] : un drapeau « valeurs » par tendance (la tendance repose-t-elle sur l'expression de soi, l'individualisme, l'alcool, la sexualité, la religion ?) croisé avec la position du pays et surtout du segment (les jeunes urbains diplômés de Casablanca sont plus proches de Paris que la moyenne marocaine).

### 4.5 Économie et infrastructure : données ouvertes de la Banque mondiale

[FAIT, API Banque mondiale, mise à jour du 2026-11-11, https://api.worldbank.org/v2/country/USA;FRA;BEL;CHE;CAN;MAR;DZA;TUN;SEN;CIV/indicator/...]

| Pays | PIB par habitant en PPA (2025, $ internationaux courants) | Internautes (% de la population, 2024) | Titulaires d'un compte, 15 ans et plus (%, 2024) |
|---|---|---|---|
| USA | 90 027 | 94,7 | 97,0 |
| France | 63 975 | 88,7 | 99,2 |
| Belgique | 74 676 | 95,8 | 98,2 |
| Suisse | 102 513 | 97,3 (2025) | 98,4 |
| Canada | 66 746 | 94,4 | 98,4 |
| Maroc | 11 112 | 91,2 | **44,4** |
| Algérie | 18 586 | 77,4 | **35,3** |
| Tunisie | 15 234 | 76,5 | **37,8** |
| Sénégal | 5 463 | 60,1 | 76,5 |
| Côte d'Ivoire | 8 209 | 41,4 | 57,6 |

Indicateurs : NY.GDP.PCAP.PP.CD, IT.NET.USER.ZS, FX.OWN.TOTL.ZS (compte dans une institution financière ou chez un fournisseur de monnaie mobile).

Préconditions d'infrastructure documentées dans les dossiers voisins [FAIT et FAIT-2] : Stripe absent du Maroc, d'Algérie, de Tunisie et du Sénégal ; paiement à la livraison pour 84,1 % des acheteurs en ligne marocains avec 20 à 40 % de refus ; TikTok Shop ouvert en France le 2025-03-31 et en Belgique le 2026-06-15, absent au Maroc ; Programme Partenaire YouTube ouvert au Maroc, en Algérie et en Tunisie ; TikTok Creator Rewards non ouvert aux comptes marocains (source d'agence) ; CPM de 0,3 à 0,5 $ au Maroc contre jusqu'à 5 $ pour une audience France ou Canada.

### 4.6 Ce qui compte le plus : arbitrage entre preuves contradictoires

| Étude | Ce qui explique les écarts entre pays |
|---|---|
| Tellis et al. 2003 (Europe) | Culture en partie ; économie ni forte ni robuste |
| Chandrasekaran et Tellis 2008 (31 pays) | Culture et richesse, plus classe de produit, millésime et décollage antérieur |
| van Everdingen et al. 2009 (55 pays) | Proximité géographique et économique, pas nécessairement culturelle |
| Talukdar et al. 2002 | Commerce international et urbanisation sur le potentiel |
| Dossier France (16 cas) | Régulation et infrastructure d'abord |
| Dossier Maroc | Verrou de paiement, de change, de licence |

Décision de conception [HYPOTHÈSE] : pondérer **d'abord les verrous (portes bloquantes)**, puis infrastructure et administration, et donner à la culture un poids modéré qui varie selon la niche (fort pour contenus et lifestyle, faible pour B2B). Ré-estimer ces poids par backtest.

---

## 5. Mesure de la qualité des prévisions

### 5.1 Journal de prédictions

Chaque prédiction est une ligne immuable [HYPOTHÈSE de conception] :

| Champ | Exemple |
|---|---|
| id, créé_le, version_modèle | `p-2026-0412`, 2026-11-28, `v0.3` |
| entité (QID ou interne), pays, niche, segment | Q131324035, FR, collection, 18-34 urbains |
| question opérationnelle | « L'entité dépassera le seuil d'arrivée par pays (≥ 3 jours sur 7 au-dessus du seuil Wikimedia) avant la date D » |
| horizon (jours), date_limite | 90, 2027-02-26 |
| probabilité p, médiane et intervalle à 80 % du délai | 0,62 ; 75 j [20 ; 240] |
| règle de résolution et source | Fichier Wikimedia par pays du jour, script versionné |
| justification courte, classe de friction, taux de base utilisé | « classe B, relais UK observé à +21 j » |
| résolu_le, issue (0/1), score de Brier, log-score | remplis automatiquement |

Règles : pas de modification après création (une nouvelle prédiction remplace l'ancienne, les deux restent) ; résolution automatique dès que la source le permet ; les questions non résolubles sont interdites.

### 5.2 Scores

- **Brier** : BS = (1/N) Σ (f_t - o_t)², 0 = parfait ; **décomposition de Murphy** BS = fiabilité - résolution + incertitude ; **score de compétence** BSS = 1 - BS / BS_ref, où BS_ref est le score d'une prévision constante égale au taux de base [FAIT, https://en.wikipedia.org/wiki/Brier_score ; Brier 1950, *Monthly Weather Review* 78(1)].
- Règles de score strictement propres : le prévisionniste maximise son score attendu en annonçant sa vraie probabilité ; le log-score et le score de Brier en font partie ; le CRPS généralise l'erreur absolue aux prévisions de distribution, utile pour les délais [FAIT, Gneiting et Raftery 2007, https://doi.org/10.1198/016214506000001437].
- Pour les délais : erreur absolue médiane sur log(délai) et **couverture des intervalles** (part des délais réalisés dans l'intervalle à 80 % ; cible 0,8).
- Calibration : diagramme de fiabilité par déciles, seulement au-delà d'environ 50 prédictions résolues par classe [HYPOTHÈSE] ; en dessous, tableau des issues par tranche large (0-0,3 ; 0,3-0,7 ; 0,7-1).

### 5.3 Pratiques de superforecasting transposables

[FAIT] Tournoi géopolitique de 2 ans (IARPA) : trois leviers comportementaux ont amélioré calibration et résolution : **formation aux probabilités** (biais cognitifs, classes de référence, moyenne de plusieurs estimations), **travail en équipe**, **suivi** (les 2 % meilleurs regroupés en équipes d'élite) ; les algorithmes statistiques d'agrégation ont encore amélioré la justesse (Mellers et al. 2014, https://doi.org/10.1177/0956797614524255). Les superprévisionnistes ont maintenu leur avance deux années de suite, contre la régression vers la moyenne (Mellers et al. 2015, https://doi.org/10.1177/1745691615577794). Les probabilités agrégées doivent être poussées vers 0 ou 1 (« extrémisation »), car la moyenne comprime l'échelle et chaque prévisionniste ignore l'information des autres (Baron et al. 2014, https://doi.org/10.1287/deca.2014.0293 ; Satopää et al. 2014, https://doi.org/10.1016/j.ijforecast.2013.09.009).

Transposition [HYPOTHÈSE] : (1) partir du taux de base de la classe de friction avant toute donnée spécifique ; (2) mettre à jour par petits pas à chaque observation de pays sentinelle ; (3) si plusieurs agents Claude ou humains estiment, agréger par moyenne des log-cotes puis extrémiser légèrement (exposant 1,2 à 1,5 sur les cotes, à calibrer) ; (4) publier le tableau des scores par version du modèle.

### 5.4 Backtesting sans fuite d'information

- **Données « à date »** : rejouer uniquement ce qui était visible à la date t0. Pièges : Google Trends renormalise rétroactivement ; un article Wikipedia créé après t0 n'existait pas ; les QID peuvent être fusionnés après coup [ESTIMATION].
- Paramètres fixés avant le backtest (pré-enregistrement), validation croisée « un cas exclu » pour tout paramètre ajusté, intervalles par bootstrap vu le petit nombre de cas.

---

## 6. Biais

| Biais | Preuve | Parade dans l'outil |
|---|---|---|
| Survivance | Les organisations observables sont les survivantes ; des pratiques risquées paraissent gagnantes dans un échantillon de survivants (Denrell 2003, https://doi.org/10.1287/orsc.14.3.227.15164) ; près de la moitié des pionniers échouent (Golder et Tellis 1993) [FAIT] | Inclure au moins 30 % de cas d'échec ou de non-traversée dans le jeu de calibration ; journaliser toutes les tendances détectées, pas seulement celles retenues |
| Battage des rapports de tendances | The Economist (19 août 2024, cité par Wikipedia) : environ un cinquième des technologies seulement suit le cycle complet ; six sur dix de celles qui tombent dans le creux ne remontent pas ; une analyse de 20 ans de cycles publiée sur LinkedIn le 7 déc. 2016 (« 8 Lessons from 20 Years of Hype Cycles ») note que peu de technologies suivent un cycle identifiable et que la plupart des technologies importantes adoptées depuis 2000 n'ont pas été repérées tôt [FAIT-2, https://en.wikipedia.org/wiki/Gartner_hype_cycle] ; revue critique : Dedehayir et Steinert 2016 (https://doi.org/10.1016/j.techfore.2016.04.005, métadonnées seulement) | Ne jamais prendre une liste de tendances comme vérité : exiger des séries mesurées ; mesurer le taux de « tendances annoncées » qui atteignent le stade mainstream |
| Imprévisibilité et effet Matthieu | Marché musical artificiel (14 341 participants) : l'influence sociale accroît inégalité et imprévisibilité ; la qualité ne détermine le succès qu'en partie (Salganik et al. 2006, https://doi.org/10.1126/science.1121066) [FAIT] | Probabilités, pas de verdicts ; portefeuille d'initiatives peu coûteuses |
| Échec des clones | Aucun taux publié trouvé ; Rocket Internet -56 % entre introduction et retrait ; vague du commerce ultra-rapide ; Clubhouse (8,1 millions de téléchargements au 15 févr. 2021 [FAIT-2], pic d'attention Wikipedia anglais le même jour [MESURE], déclin ensuite [NON VÉRIFIÉ en chiffres]) | Exiger un signal de rétention ou de revenu à la source, pas seulement d'attention ; pénaliser les modèles à forte intensité de capital |
| Tendances nées hors USA | BeReal, Yuka, Vinted, Hyrox, padel, Labubu, chocolat de Dubaï, Squid Game, Italian brainrot, Getir (Istanbul) [FAIT-2 et MESURE] | Pays sentinelles hors USA (Royaume-Uni, Allemagne, Espagne, Corée, Japon, Chine via TikTok, Golfe) |
| Biais de mesure linguistique | L'anglais n'est pas les USA ; le français couvre France, Belgique, Suisse, Québec et Afrique ; l'arabe couvre le Golfe et l'Égypte avant le Maghreb [MESURE] | Préférer le jeu par pays ; sinon pondérer par la part connue de chaque pays dans l'édition |
| Seuil de détection des petits marchés | Maroc 74 lignes par jour, Sénégal 16 [MESURE] | Capteurs dédiés (YouTube par `regionCode`, Google Trends, classements d'applications, créateurs locaux) ; ne pas conclure « absent » sous le seuil |
| Attention n'est pas monétisation | Le Maroc a 91,2 % d'internautes mais 44,4 % de titulaires de compte [FAIT] | Module de rendement séparé, portes de paiement |

---

## 7. Modèle de scoring explicite (livrable central)

Principes [HYPOTHÈSE de conception] : (1) chaque score est un nombre de 0 à 100 accompagné d'un intervalle P10-P90 ; (2) chaque variable vient d'une source ouverte nommée ou d'une saisie marquée par son niveau de preuve ; (3) les portes bloquantes passent avant les sommes pondérées ; (4) les pondérations par défaut sont des a priori, à ré-estimer par backtest ; (5) l'outil s'abstient quand la confiance moyenne est trop basse.

### 7.1 Module A : force de la tendance aux USA, F_US

Variables observables, par entité e et période t (jour ou semaine) :

| Variable | Définition | Sources ouvertes |
|---|---|---|
| y_s,t | Série brute par famille de sources s | Google Trends (US), Wikipedia (en, et US via le jeu par pays), YouTube Data API (`regionCode=US`), Reddit, GDELT, Amazon Movers and Shakers, classements App Store US |
| v | Pente de Theil-Sen de log(1+y) sur 8 périodes | calcul |
| a | v(t) - v(t-4) | calcul |
| z | Z-score robuste contre 28 jours ; si historique < 28 jours, percentile du niveau parmi les entités de la catégorie | calcul |
| MK | 1 - p de Mann-Kendall unilatéral sur 8 semaines (n ≥ 5) | calcul |
| B | Part des familles disponibles où z ≥ 2 ou en rafale de Kleinberg | calcul |
| R | Rafale active (Kleinberg état 1 sur les 7 derniers jours) ou probabilité de rupture récente (Adams-MacKay) | calcul |
| h | Demi-vie du dernier pic (jours) | calcul |

Formule :

F_US = 100 x [0,25 P(v) + 0,15 P(z) + 0,15 MK + 0,30 B + 0,05 P(a) + 0,10 R] x pénalités

où P(x) est le percentile transversal de x parmi les entités suivies la même période dans la même famille de sources. Pénalités : x 0,6 si une seule famille est en hausse ; plafond à 40 si h < 3 jours et MK < 0,5 (événement ponctuel plutôt que tendance).

Justification des poids : **la corroboration (B) pèse le plus**, car les erreurs des données à source unique sont documentées (Google Flu) ; **la vitesse avant le niveau**, car l'objectif est l'émergence et que le décollage se définit par la croissance relative à la base (Golder et Tellis) ; **l'accélération pèse peu**, car la dérivée seconde amplifie le bruit ; la persistance (MK) filtre les rafales d'un jour (les hashtags sont surtout locaux et courts, Kamath et al.).

Stade (champ `us_stage`), règles appliquées dans l'ordre :

| Stade | Règle |
|---|---|
| declin | ≥ 28 jours depuis le pic, niveau < 50 % du pic, v < 0 |
| mainstream | niveau ≥ 80 % du pic à date et pente quasi nulle, ou présence dans 5 familles et plus |
| acceleration | v > 0 et a > 0 sur 3 périodes, B ≥ 3 familles, MK > 0,9 |
| emergent | v > 0 et 2 familles au moins |
| signal_faible | une seule famille, ou alerte CUSUM ou z isolée |

### 7.2 Module B : écart de diffusion par pays, G_c

**Arrivée observée dans le pays c** (règle opérationnelle) : premier jour J tel que l'entité dépasse le seuil d'arrivée au moins 3 jours sur 7, avec seuils par source : jeu Wikimedia par pays (ligne publiée, soit ≥ 90 vues par jour) ; Google Trends pays (indice ≥ 10 % du maximum de la série relative à une ancre stable [HYPOTHÈSE]) ; création d'un article dans la langue locale ; YouTube : au moins N vidéos en langue locale publiées sur 7 jours avec plus de V vues (N et V à calibrer par pays).

**Intensité relative** : a_c = (vues par million d'internautes dans c) / (même mesure aux USA), sur la même fenêtre. Exemple [MESURE] : Labubu, France 2 802 contre USA 4 891, soit a_FR = 0,57 ; Maroc 183, soit a_MA = 0,04.

**Écart d'offre** [HYPOTHÈSE à tester] : s_c = (offre locale : vidéos en langue locale, vendeurs locaux, articles de presse locale, par million d'internautes) / (même mesure aux USA). **Indice d'opportunité d'écart** : O_c = a_c x max(0, 1 - s_c / a_c). Il est élevé quand l'attention locale est arrivée mais que l'offre locale manque, ce qui correspond à la fenêtre observée avec Pokémon Go en France (attention sept jours avant la disponibilité).

**Délai attendu avant arrivée (a priori)**, loi log-normale par classe de friction et groupe de pays, en jours depuis l'arrivée US : médiane [P10 ; P90] [ESTIMATION, calée sur les cas des sections 2.5 à 2.8 et des dossiers voisins] :

| Classe | UE francophone (FR, BE, CH) | Québec | Maghreb (MA, DZ, TN) | Afrique subsaharienne francophone |
|---|---|---|---|---|
| A : contenu, mème, son, sortie mondiale | 7 [0 ; 30] | 5 [0 ; 21] | 14 [0 ; 60] | 21 [0 ; 90] [HYPOTHÈSE] |
| B : produit ou application sans verrou | 75 [20 ; 240] | 45 [10 ; 180] | 180 [45 ; 720] | 270 [60 ; 1 080] [HYPOTHÈSE] |
| C : fonctionnalité de plateforme, paiement | 300 [150 ; 600] | 120 [0 ; 450] | 900 [0 ; 3 300] | 1 100 [0 ; 3 650] |
| D : produit réglementé | 1 100 [700 ; 1 825], 35 % « jamais » | 900 [365 ; 1 825] | 1 825 [900 ; ∞] | 1 825 [900 ; ∞] |
| E : pratique à infrastructure physique | 1 200 [700 ; 2 100] | 900 [400 ; 1 800] | 1 700 [900 ; 3 000] | 2 200 [1 000 ; ∞] |
| F : modèle d'affaires dépendant des rails de paiement | 1 500 [1 000 ; 2 600] | 900 [400 ; 1 800] | bloqué tant que la porte de paiement est fermée | idem |

La borne basse à 0 pour la classe C hors UE traduit le cas Threads : une fonctionnalité retardée par le droit européen peut arriver au lancement dans les pays non européens, alors qu'une fonctionnalité de commerce (Apple Pay, TikTok Shop) y arrive des années plus tard.

**Probabilité d'arrivée avant l'horizon H** : P(H) = (1 - p_jamais) x Φ((ln H - ln m) / σ), avec σ = (ln P90 - ln m) / 1,2816.

**Mise à jour par pays sentinelle** : m' = m x exp(ρ [ln(ℓ_obs + 1) - ln(ℓ_prior + 1)]), avec ρ = 0,5 par défaut [HYPOTHÈSE], déclenchée par un **décollage** observé (pas une simple apparition, conformément à van Everdingen et al.). Sentinelles par défaut : Royaume-Uni pour les plateformes anglophones et le commerce social ; Allemagne et Suisse pour la santé, le fitness et l'alimentation d'origine non US ; Espagne pour les sports de raquette et les services vers le Maroc ; France pour le Maghreb et l'Afrique francophone ; Golfe et Égypte pour les applications arabophones.

**Écart de diffusion par pays** :

G_c = F_US x [1 - min(1, a_c)] x P(arrivée avant H | classe, groupe, sentinelles) x porte_c

G_c est élevé quand la tendance est forte aux USA, encore faible dans c, attendue dans c avant l'horizon et non bloquée.

Contrôle sur un cas (non indépendant, car les a priori ont été fixés en connaissant une partie des cas) [MESURE] : Labubu, classe B. France : a priori médiane 75 jours, arrivée observée à 159 jours, P(arrivée ≤ 159 j) = 0,76, donc dans l'intervalle à 80 %. Maroc : a priori 180 jours, observé 187 jours. Avec le Royaume-Uni comme sentinelle arrivé à +21 jours (a priori 45), la médiane française tombe à 52 jours ; avec l'Allemagne arrivée à +154 jours, elle passe à 107 jours. L'ordre de mise à jour compte : il faut une règle de choix de sentinelle par niche, à tester.

### 7.3 Module C : transposabilité T(pays x niche x lifestyle)

**Portes bloquantes** g_j ∈ {0 ; 0,3 ; 0,6 ; 1} : 0 = interdit ou indisponible sans contournement (sachets de nicotine en France depuis le 2026-04-01, TikTok Shop au Maroc pour une initiative qui en dépend) ; 0,3 = contournement coûteux ; 0,6 = contournement simple (paiement à la livraison, WhatsApp, PayPal en réception) ; 1 = aucun verrou. G = produit des portes.

**Proximités** (1 - distance), chacune dans [0 ; 1] avec une confiance :

| Dimension | Calcul par défaut | Source |
|---|---|---|
| C, culture | 1 - [0,6 x min(1, KS / 3) + 0,4 x d_langue], KS calculé depuis le **pays relais le plus proche déjà touché** (USA, France, Espagne...) ; d_langue = 0 si même langue, 0,1 pour un produit visuel, 0,3 si anglais courant dans le segment, 0,6 sinon | Hofstede (licence à régler), saisie |
| A, administration | Table par niche et pays : régulation sectorielle, publicité (loi Evin, loi influenceurs), change, données (RGPD, DMA) | Dossiers pays, textes officiels |
| G, géographie | Produits physiques : délai et coût d'acheminement ; contenus en direct : écart horaire / 12 | Saisie, transporteurs |
| E, économie | 1 - min(1, \|ln(PIB_source / PIB_cible)\| / ln 20), PIB par habitant en PPA | Banque mondiale |
| I, infrastructure | Moyenne pondérée selon la niche : taux de compte (Findex), paiement disponible, monétisation des créateurs (YPP, Creator Rewards), logistique (refus à la livraison) | Banque mondiale, pages officielles des plateformes |
| L, lifestyle | Part du segment dans le pays x adéquation de plateforme x drapeau de valeurs (Inglehart-Welzel) | DataReportal, estimations d'audience publicitaire, saisie |
| S, absence de substitut | 1 si aucun substitut local n'occupe la niche ; 0,2 si un substitut domine (padel contre pickleball en France) | Mesure d'attention sur le substitut |

**Formule** : T = 100 x G x Σ_d w_niche,d x proximité_d

**Pondérations par défaut** [HYPOTHÈSE justifiée] :

| Groupe de niches | C | A | G | E | I | L | S |
|---|---|---|---|---|---|---|---|
| Contenu, mèmes, formats, musique | 0,30 | 0,05 | 0,05 | 0,05 | 0,15 | 0,25 | 0,15 |
| Produit physique de consommation | 0,20 | 0,15 | 0,15 | 0,20 | 0,15 | 0,10 | 0,05 |
| Application ou service numérique B2C | 0,15 | 0,15 | 0,00 | 0,20 | 0,25 | 0,15 | 0,10 |
| Produit réglementé (santé, finance, alcool, jeux, nicotine) | 0,10 | 0,45 | 0,05 | 0,10 | 0,15 | 0,10 | 0,05 |
| Pratique physique (sport, restauration) | 0,15 | 0,10 | 0,10 | 0,20 | 0,25 | 0,10 | 0,10 |
| Modèle d'affaires B2B, SaaS | 0,05 | 0,20 | 0,00 | 0,25 | 0,30 | 0,05 | 0,15 |

Justifications : la culture pèse surtout sur les biens de consommation et les médias, la géographie sur les produits volumineux (Ghemawat) ; la proximité géographique et économique explique les retombées mieux que la culture (van Everdingen et al.) ; le dossier France place la régulation et l'infrastructure en tête des causes de décalage ; le dossier Maroc place le paiement en verrou numéro un ; pour les pratiques physiques, l'infrastructure (terrains, salles, fédération) et le substitut dominent (Hyrox, padel, pickleball).

**Lecture par segment (lifestyle)** : le score se calcule pour un triplet pays x niche x segment. Le segment modifie C (langue et valeurs du segment), I (taux de compte du segment : les actifs urbains bancarisés marocains paient par carte, le dossier Maroc cite 57 % des transactions Glovo par carte) et L. Sans données de segment, L reste à 0,5 avec une confiance de 0,2 : l'outil doit l'afficher comme inconnu.

**Exemple calculé** (Labubu, niche « produit physique », proximités et confiances en annexe du script) [MESURE sur entrées ESTIMATION] :

| Pays | T direct depuis les USA, P10-P50-P90 | T depuis le relais le plus proche (KS minimal entre USA et France), P10-P50-P90 | Intensité réalisée (vues par million d'internautes) |
|---|---|---|---|
| Canada (Québec) | 78,6 - 82,8 - 86,6 | 81,0 - 85,0 - 88,6 | 6 584 |
| Suisse | 76,5 - 80,9 - 84,9 | 77,6 - 81,9 - 85,9 | 4 241 |
| Belgique | 74,6 - 79,0 - 83,2 | 81,1 - 85,0 - 88,7 | 3 026 |
| France | 73,7 - 78,1 - 82,4 | n.a. | 2 802 |
| Maroc | 24,1 - 31,1 - 38,3 | 27,6 - 35,4 - 43,6 | 183 |
| Sénégal | 19,1 - 26,4 - 33,7 | 22,6 - 30,8 - 39,0 | non mesurable (sous le seuil) |

Entrées : proximité culturelle depuis l'indice de Kogut-Singh et d_langue = 0,1 (produit visuel) ; économie depuis le PIB en PPA ; infrastructure = taux de compte Findex ; administration et géographie saisies (0,4 à 0,9, confiance 0,3 à 0,4) ; lifestyle 0,5 et substitut 0,8 à faible confiance ; porte de paiement 0,6 (paiement à la livraison) pour le Maroc et le Sénégal.

L'ordre des scores directs reproduit l'ordre des intensités réalisées sur les cinq pays mesurés. C'est une illustration sur un seul cas, pas une validation. Les écarts entre la France, la Belgique et la Suisse sont plus faibles que leurs écarts d'intensité réalisée : le module distingue bien le Nord du Sud, mal les pays proches entre eux. Il faudra des variables de segment et d'offre locale pour les départager.

### 7.4 Module D : rendement d'une initiative

Formule [HYPOTHÈSE] :

- Probabilité de succès : logit(p) = logit(p0) + 0,6 z(F_US) + 0,6 z(T) + 0,4 z(G_c), où p0 est le taux de base de réussite d'une petite initiative numérique (défaut 0,15 [HYPOTHÈSE à remplacer par le taux observé dans le journal]) et z() les scores centrés réduits sur l'ensemble des candidats.
- Facteur de fenêtre : f_W = min(1, W / T_lancement), où W est la fenêtre restante (délai d'arrivée attendu de la concurrence locale ou demi-vie de la tendance) et T_lancement le temps de mise en marché avec Claude Code.
- Valeur attendue : VE = Portée x valeur par utilisateur x p x f_W, avec Portée = population du segment x part d'internautes x part de la plateforme x taux de captation (défaut 0,5 % [HYPOTHÈSE]) et une valeur par utilisateur tirée du modèle de revenu et du pays (CPM, commission, marge).
- Rendement : R = VE / (effort en personnes-semaines x coût hebdomadaire + coût direct). Classement final sur le P10 de R (prudent) et affichage RICE en parallèle pour la lisibilité.

Exemple illustratif, toutes entrées hypothétiques : même initiative de contenu et d'affiliation, 20 000 personnes atteintes, 3 personnes-semaines, 500 € de coûts ; France (1,5 € par personne, fenêtre de 120 jours) : p = 0,30, VE ≈ 9 080 €, R ≈ 3,95 ; Maroc (0,2 € par personne, transposabilité plus basse, fenêtre de 200 jours) : p = 0,19, VE ≈ 770 €, R ≈ 0,33 [MESURE du calcul, entrées HYPOTHÈSE]. La valeur par utilisateur domine le résultat : c'est la variable à mesurer en priorité pour le Maghreb (ou l'initiative doit viser la diaspora et des clients payant en euros).

Règle de fenêtre par classe [ESTIMATION] : classe A, fenêtre de quelques jours, seulement des contenus réactifs ou des outils prêts d'avance ; classes B et C, fenêtre de 1 à 18 mois, petits produits et services ; classes D à F, fenêtre de plusieurs années, mais l'événement déclencheur est réglementaire ou d'infrastructure : surveiller la levée de la porte plutôt que la tendance.

### 7.5 Traitement de l'incertitude

- Chaque entrée a une moyenne et une confiance c ∈ [0 ; 1] dérivée de son niveau de preuve (défauts : FAIT 0,9 ; FAIT-2 0,7 ; MESURE 0,8 ; ESTIMATION 0,5 ; HYPOTHÈSE 0,3).
- Tirage Monte-Carlo (5 000 tirages par défaut) de chaque proximité selon une loi bêta de moyenne m et de concentration k = 2 + 38c ; portes intermédiaires tirées de la même façon ; P10, P50 et P90 publiés.
- Classement par défaut sur le P50, affichage du P10 ; abstention (« données insuffisantes ») si la confiance moyenne pondérée est inférieure à 0,4 ou si moins de deux familles de sources existent pour le pays.
- Les délais sont des distributions (log-normales) et se scorent avec la couverture d'intervalle et le CRPS.

---

## 8. Protocole de backtest

### 8.1 Jeu de 20 cas datés

| # | Cas | Classe | Origine et date | Arrivées datées | Issue | Preuve |
|---|---|---|---|---|---|---|
| 1 | Pokémon Go | C (disponibilité) | USA 2016-07-06 | DE +7 j, UK +8, CH +10, CA +11, FR +18, MA et CI +90 | Traversée | [FAIT-2] Wikipedia |
| 2 | Fidget spinner | B | USA, mai 2017 | it -4 j, fr +6, de +8, ar +26 (attention) | Traversée | [MESURE] |
| 3 | Squid Game | A | Corée, sortie mondiale sept. 2021 | -3 à +7 j selon la langue | Simultanée | [MESURE] |
| 4 | Clubhouse | B | USA 2020 ; vague allemande janv. 2021 | de -9 j, it +7, fr et es +15, ar +20 | Traversée puis reflux | [MESURE] et [FAIT-2] |
| 5 | Wordle | A | USA, viral janv. 2022 | fr -4 j, de -1 | Traversée | [MESURE] et [FAIT-2] |
| 6 | ChatGPT | A/B | USA 2022-11-30 | fr et de au même rythme | Simultanée | [MESURE] |
| 7 | Quiet quitting | A | USA, août 2022 | de +5 j, es +44 | Traversée (concept) | [MESURE] |
| 8 | BeReal | B, flux inverse | France 2020 | pic US en 2022 avant l'intérêt français | Traversée inverse puis chute | [FAIT-2] dossier France |
| 9 | Threads | C (réglementaire) | USA 2023-07-05 | UE 2023-12-14 (+162 j) | Retard réglementaire | [FAIT-2] et [MESURE] |
| 10 | Skibidi Toilet | A | 2023 | fr +8 j | Traversée | [MESURE] |
| 11 | Chocolat de Dubaï | B, hors USA | EAU ; DE et CH 2024-11-07 | FR +29 j, USA +63 j, BE +115 j ; Maroc sous le seuil | Relais européen avant les USA | [MESURE] |
| 12 | Labubu | B, hors USA | Hong Kong et Chine ; USA 2024-12-06 | FR +159 j, MA +187 j | Traversée, intensité 27 fois plus faible au Maroc | [MESURE] |
| 13 | Italian brainrot | A, hors USA | Italie, 2025 | Simultané le 2025-05-08 | Traversée | [MESURE] |
| 14 | Apple Pay | C (paiement) | USA 2014-10-20 | UK +267 j, CA +393, CH +626, FR +638, MA +3 193 | Traversée lente | [FAIT-2] |
| 15 | Netflix | C/F | Streaming US 2007-01-16 | UK janv. 2012, FR sept. 2014, monde entier janv. 2016 | Traversée lente | [FAIT-2] |
| 16 | TikTok Shop | C | UK 2021, USA 2023-09-12 | FR 2025-03-31, BE 2026-06-15, MA absent | Partielle | [FAIT-2] dossier France |
| 17 | Commerce ultra-rapide | F | goPuff 2013 ; Getir 2015 ; Gorillas mai 2020 | Europe 2020-2021, retrait 2024 ; dark stores marocains fermés en 2026 | Échec | [FAIT-2] |
| 18 | Hard seltzer | D | USA 2019 | FR 2020-2021 puis retraits | Non-traversée | [FAIT-2] dossier France |
| 19 | Pickleball | E | USA 2021-2024 | FR +28 mois, amplitude 20 fois plus faible ; substitut padel | Traversée mineure | [FAIT-2] dossier France |
| 20 | Hyrox | E, hors USA | Allemagne 2017 ; USA janv. 2020 | FR nov. 2023 ; intensité UK 6,6 fois celle des USA | Flux Europe vers USA | [FAIT-2] et [MESURE] |

Composition : 6 cas hors USA ou en flux inverse, 4 échecs, reflux ou traversées mineures (Clubhouse, commerce ultra-rapide, hard seltzer, pickleball), 5 cas réglementaires ou de paiement. Il manque des cas propres à l'Afrique subsaharienne francophone : à constituer en priorité.

### 8.2 Procédure

1. **Date de gel t0** par cas : premier jour où le module A aurait classé l'entité « émergent » aux USA (ou dans le pays d'origine), calculé sur les données de l'époque.
2. **Prédictions à t0**, avec les seules données disponibles à t0 : probabilité d'arrivée par pays à 30, 90 et 365 jours ; délai médian et intervalle à 80 % ; transposabilité par pays et niche.
3. **Résolution** par la même règle opérationnelle appliquée aux données postérieures (jeu Wikimedia par pays depuis 2023 ; création d'article et franchissement de seuil avant 2023 ; date officielle de lancement pour les fonctionnalités de plateforme).
4. **Références de comparaison** : B0 = taux de base global d'arrivée ; B1 = délai constant naïf (« toujours 3 mois ») ; B2 = table de classes de friction sans mise à jour par sentinelle.
5. **Métriques** : Brier et BSS par horizon contre B0, B1 et B2 ; couverture des intervalles à 80 % ; erreur absolue médiane sur log(délai) ; corrélation de Spearman entre T et l'intensité réalisée a_c ; décomposition de Murphy quand le nombre de prédictions le permet.
6. **Validation croisée** « un cas exclu » pour tout paramètre ajusté (ρ, poids, seuils), intervalles par bootstrap.
7. **Critères d'acceptation proposés** [HYPOTHÈSE] : BSS > 0 contre B0 à 90 et 365 jours ; couverture des intervalles à 80 % comprise entre 0,65 et 0,95 ; le modèle complet bat B2, sinon la mise à jour par sentinelle est retirée.
8. **Publication** : tableau des scores par version, y compris les échecs.

---

## 9. Implications pour l'outil

1. Adopter l'identifiant Wikidata comme pivot d'entité, avec une table d'alias multilingue validée et un contrôle des faux rattachements.
2. Brancher dès la première version le jeu Wikimedia par pays (gratuit, quotidien, par pays) pour dater les arrivées en Europe et au Canada ; le compléter pour le Maghreb et l'Afrique par Google Trends, YouTube par `regionCode` et les classements d'applications par pays.
3. Remplacer le « décalage moyen » par une table de classes de friction x groupes de pays, avec probabilité d'arrivée par horizon, mise à jour par décollage dans des pays sentinelles (Royaume-Uni, Allemagne, Espagne, France, Golfe).
4. Suivre des origines hors USA dès le départ : sur 4 cas mesurés par pays, 2 arrivent en Europe avant ou plus fort qu'aux USA.
5. Détection en deux temps : alertes précoces (CUSUM, z robuste, Kleinberg) pour mettre en observation ; confirmation (Mann-Kendall à 5 points et plus, seuil de décollage, au moins 2 familles) pour émettre une prédiction.
6. Mesurer l'offre locale en plus de l'attention locale : l'indice d'opportunité d'écart (attention présente, offre absente) est la fenêtre exploitable.
7. Calculer la distance culturelle depuis le pays relais le plus proche déjà touché ; régler la licence Hofstede ou utiliser une alternative ouverte (données WVS) avant tout usage commercial.
8. Traiter les verrous comme des portes multiplicatives (paiement, plateforme, loi), stockées comme données par pays et datées, avec une alerte quand une porte s'ouvre (lancement de TikTok Shop, d'un moyen de paiement, d'une loi).
9. Ouvrir le journal de prédictions et le tableau des scores (Brier, BSS, couverture) dès la version 1 ; interdire les questions non résolubles automatiquement.
10. Lancer le backtest des 20 cas avant toute communication publique de prédictions, avec paramètres figés à l'avance.
11. Classer les initiatives sur le P10 du rendement et mesurer en priorité la valeur par utilisateur par pays, qui domine le calcul au Maghreb.
12. Respecter les limites de débit (1 requête par seconde ou moins sur l'API Pageviews, en-tête User-Agent identifiable) et mettre en cache.

---

## 10. Questions ouvertes

1. Quel est l'effet chiffré du décalage d'introduction sur q dans Takada et Jain 1991, et les délais moyens de décollage par groupe de pays dans Chandrasekaran et Tellis 2008 ? Texte intégral non accessible.
2. Existe-t-il un taux de base publié d'échec des clones ou des « copies transfrontalières » ? Rien trouvé.
3. Source primaire de l'expression « time machine management » de Masayoshi Son et date de première utilisation ?
4. Threads a-t-il été disponible au Maroc, au Sénégal et au Québec dès le 5 juillet 2023 ? Indice seulement (pic arabe le 6 juillet).
5. Quel seuil Google Trends par pays donne la meilleure concordance avec les arrivées datées par le jeu Wikimedia ? À mesurer quand l'accès à l'API sera obtenu.
6. Quelle part de l'audience Wikipedia vient de chaque pays francophone pour les sujets de tendance ? Mesurable avec le jeu par pays, non fait ici.
7. Coordonnées récentes de la carte Inglehart-Welzel pour le Maroc, l'Algérie, la Tunisie, le Sénégal et la Côte d'Ivoire, et conditions de licence des données WVS.
8. Conditions d'usage commercial des scores Hofstede : prix et contrat.
9. Taux de base de réussite d'une petite initiative numérique selon la classe et le pays : à constituer avec le journal, aucun chiffre fiable disponible.
10. Les pondérations du module C départagent mal les pays proches (France, Belgique, Suisse) : quelles variables de segment ou d'offre locale ajoutent du pouvoir discriminant ?
11. Cas d'Afrique subsaharienne francophone datés : aucun dans le jeu de backtest.
12. Ramadan 2026 et 2027 au Maroc : dates exactes observées à intégrer au calendrier.

---

## 11. Sources

Littérature (résumés lus via OpenAlex, sauf mention) :
- Bass 1969, https://doi.org/10.1287/mnsc.15.5.215
- Takada et Jain 1991, https://doi.org/10.1177/002224299105500206
- Golder et Tellis 1993, https://doi.org/10.1177/002224379303000203 ; 1997, https://doi.org/10.1287/mksc.16.3.256
- Putsis et al. 1997, https://doi.org/10.1287/mksc.16.4.354
- Ganesh, Kumar et Subramaniam 1997, https://doi.org/10.1177/0092070397253003 (métadonnées)
- Talukdar, Sudhir et Ainslie 2002, https://doi.org/10.1287/mksc.21.1.97.161
- Tellis, Stremersch et Yin 2003, https://doi.org/10.1287/mksc.22.2.188.16041
- Van den Bulte et Stremersch 2004, https://doi.org/10.1287/mksc.1040.0054
- Chandrasekaran et Tellis 2008, https://doi.org/10.1287/mksc.1070.0329
- van Everdingen, Fok et Stremersch 2009, https://doi.org/10.1509/jmkr.46.5.637
- Kalish, Mahajan et Muller 1995, https://doi.org/10.1016/0167-8116(94)00008-C (métadonnées) ; Peres, Muller et Mahajan 2010, https://doi.org/10.1016/j.ijresmar.2009.12.012 (métadonnées)
- Kamath et al. 2013, https://doi.org/10.1145/2488388.2488447 ; Ferrara et al. 2013, https://doi.org/10.1145/2512938.2512956 ; Brodersen et al. 2012, https://doi.org/10.1145/2187836.2187870 ; Leskovec et al. 2009, https://doi.org/10.1145/1557019.1557077 ; Weng et al. 2012, https://doi.org/10.1038/srep00335 ; Goel et al. 2016, https://doi.org/10.1287/mnsc.2015.2158 ; Cheng et al. 2014, https://doi.org/10.1145/2566486.2567997 ; Martin et al. 2016, https://doi.org/10.1145/2872427.2883001 ; Salganik et al. 2006, https://doi.org/10.1126/science.1121066 ; Mestyán et al. 2013, https://doi.org/10.1371/journal.pone.0071226 ; García-Gavilanes et al. 2017, https://doi.org/10.1126/sciadv.1602368
- Kleinberg 2003, https://doi.org/10.1023/A:1024940629314 (texte intégral : https://www.cs.cornell.edu/home/kleinber/bhs.pdf) ; Page 1954, https://doi.org/10.1093/biomet/41.1-2.100 ; Adams et MacKay 2007, https://arxiv.org/abs/0710.3742 ; Killick et al. 2012, https://doi.org/10.1080/01621459.2012.737745 ; Hamed et Rao 1998, https://doi.org/10.1016/S0022-1694(97)00125-X ; Taylor et Letham 2018, https://doi.org/10.1080/00031305.2017.1380080
- Lazer et al. 2014, https://doi.org/10.1126/science.1248506 ; Choi et Varian 2012, https://doi.org/10.1111/j.1475-4932.2012.00809.x ; Eichenauer et al., https://doi.org/10.1111/ecin.13049
- Kogut et Singh 1988, https://doi.org/10.1057/palgrave.jibs.8490394 ; Shenkar 2001, https://doi.org/10.1057/palgrave.jibs.8490982 ; Beugelsdijk et al., https://doi.org/10.1177/0149206317729027 ; Berry, Guillén et Zhou 2010, https://doi.org/10.1057/jibs.2010.28 ; Inglehart et Baker 2000, https://doi.org/10.2307/2657288
- Gneiting et Raftery 2007, https://doi.org/10.1198/016214506000001437 ; Mellers et al. 2014, https://doi.org/10.1177/0956797614524255 ; Mellers et al. 2015, https://doi.org/10.1177/1745691615577794 ; Baron et al. 2014, https://doi.org/10.1287/deca.2014.0293 ; Satopää et al. 2014, https://doi.org/10.1016/j.ijforecast.2013.09.009 ; Denrell 2003, https://doi.org/10.1287/orsc.14.3.227.15164 ; Dedehayir et Steinert 2016, https://doi.org/10.1016/j.techfore.2016.04.005 (métadonnées)

Pages lues le 2026-11-28 :
- MIT News, 2012-11-01, https://news.mit.edu/2012/predicting-twitter-trending-topics-1101
- Intercom, 2018-01-05, https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
- HBR, sept. 2001, https://hbr.org/2001/09/distance-still-matters-the-hard-reality-of-global-expansion (extrait public)
- World Values Survey, https://www.worldvaluessurvey.org/WVSContents.jsp?CMSID=Findings
- Geert Hofstede, https://geerthofstede.com/research-and-vsm/dimension-data-matrix/ et fichier CSV 2015-12-08
- Wikimedia, https://analytics.wikimedia.org/published/datasets/country_project_page/00_README.html
- Wikipedia : Bass_diffusion_model, CAGE_Distance_Framework, Brier_score, Gartner_hype_cycle, Rocket_Internet (en et de), Yahoo!_Japan, Gorillas_(company), Threads_(social_network), Pokémon_Go, Apple_Pay, Netflix, Clubhouse_(app), Wordle, Ice_Bucket_Challenge, Harlem_Shake_(meme), Uber
- Banque mondiale, API v2, indicateurs NY.GDP.PCAP.PP.CD, IT.NET.USER.ZS, FX.OWN.TOTL.ZS (mise à jour 2026-11-11)
- Dossiers voisins : `market-france-europe.md`, `market-maroc-maghreb.md`, `claude-code-plugins.md`, `concurrence-positionnement.md` (même répertoire)

---

## Annexe : scripts et données de cette session

Répertoire : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/`

| Fichier | Contenu |
|---|---|
| `scripts_diff/oa.py` | Résumés d'articles par DOI (OpenAlex) ; sorties `dl_diff/oa1.json` à `oa3.json` |
| `scripts_diff/daily_lag.py`, `retry_lag.py` | Décalage quotidien entre éditions linguistiques ; sortie `dl_diff/daily_lag.json` |
| `scripts_diff/dp_country.sh`, `dp_analyze.py` | Extraction du jeu Wikimedia par pays pour des QID ; sorties `dl_diff/dp_daily.tsv` (19 014 lignes), `dl_diff/dp_summary.json` |
| `scripts_diff/scoring_reference.py` | Détecteurs (Theil-Sen, z robuste, Mann-Kendall, CUSUM, Kleinberg à deux états, seuil de décollage), modules A à D, Brier ; mode `demo` ; sortie `dl_diff/detect_demo.json` |
| `dl_diff/hof.csv`, `dl_diff/ks.json` | Scores Hofstede et distances de Kogut-Singh |
| `dl_diff/wb_*.json` | Réponses de l'API Banque mondiale |

---

## Contre-vérification

Contre-vérification indépendante faite le 2026-11-28. Le budget de recherche web était épuisé (refus du moteur dès la première requête). Toutes les vérifications ci-dessous viennent donc de lectures directes de sources primaires : résumés OpenAlex par DOI, README et fichiers quotidiens Wikimedia retéléchargés, API Pageviews, API Banque mondiale, fichier CSV et page de Hofstede, liste de protection des pays de la Wikimedia Foundation, articles Wikipedia (Pokémon Go, Apple Pay, Gorillas, Padel, Gartner hype cycle). Les scripts et les données sont dans `cv_diff_scripts/` et `cv_diff_dl/`. Les API Wikidata et MediaWiki ont renvoyé des erreurs 429 (débit partagé) : quelques contrôles sont restés partiels.

### Verdicts

| # | Affirmation contrôlée | Verdict | Détail |
|---|---|---|---|
| 1 | van Everdingen, Fok et Stremersch 2009 : les décollages étrangers, pas les introductions, accélèrent le décollage ; retombées plus fortes entre pays proches par la géographie et l'économie, « pas nécessairement » par la culture ; asymétrie | Confirmé, une nuance | Résumé JMR 46(5) relu mot pour mot (8 produits, 55 pays). Nuance : le résumé dit que le modèle « permet » une asymétrie entre paires de pays. Il ne dit pas qu'une asymétrie a été mesurée. |
| 2 | Tellis, Stremersch et Yin 2003 (décollage moyen à 6 ans, 4 fois plus court pour le divertissement, presque 2 fois plus court en Scandinavie) ; Chandrasekaran et Tellis 2008 (le délai raccourcit et converge) ; Talukdar et al. 2002 (0,17 contre 0,52, pic 17,9 % plus tard) | Confirmé | Les trois résumés sont conformes. Précision : chez Tellis et al., la comparaison porte sur les appareils « de cuisine et de lavage », pas sur tout l'électroménager. Chez Talukdar et al., « 17,9 % plus long » correspond à 19,25 ans contre 16,33 ans. |
| 3 | Jeu Wikimedia par pays : quotidien depuis le 2023-02-06, QID depuis mars 2024, seuil de 90, bruit de ±35,7 (IC 95 %), données US absentes du 2023-02-06 au 2023-09-19 | Corrigé | Seuil de 90 et bruit de 35,7 : confirmés pour les pays à risque faible (550 et 176,5 pour le risque moyen ; 1 000 et 352,5 pour le risque élevé). **Trois corrections.** (a) Les QID ont été ajoutés rétroactivement : 369 923 lignes sur 373 232 en portent un dans le fichier du 2023-03-01. (b) Le fichier du 2023-03-01 contient 39 263 lignes US, contre 134 666 le 2023-10-01. Les US ont donc été republiés pour la période manquante avec l'ancien algorithme : c'est une rupture de série, pas un trou. (c) Il existe des jeux historiques sous confidentialité différentielle du 2015-07-01 au 2023-02-05 (`country_project_page_historical`, `_pre_2017`), avec un autre algorithme. **Limites oubliées par le dossier :** le jeu ne compte que les 10 premières vues uniques par appareil et par jour, sur les seules pages ayant plus de 150 vues mondiales ce jour-là. La Chine, Hong Kong et l'Arabie saoudite ne sont pas publiés. Les Émirats, l'Égypte et la Turquie sont classés à risque élevé : leur seuil est de 1 000 (valeur minimale observée aux Émirats : 1 074 le 2026-11-26), alors qu'elle était de 566 le 2024-11-06. La classification change donc dans le temps. |
| 4 | Lignes par pays le 2026-11-26 : Maroc 74, Algérie 90, Tunisie 20, Sénégal 16, Côte d'Ivoire 21, France 10 684, USA 95 640 | Confirmé, avec une correction importante | Comptage refait sur le fichier retéléchargé : chiffres identiques (et Canada 9 419, Suisse 601, Belgique 560). Le Maroc, l'Algérie, la Tunisie, le Sénégal et la Côte d'Ivoire sont bien à risque faible (seuil 90). **Mais la couverture marocaine n'est pas stable.** Elle passe de 1 300 lignes le 2023-03-01 à 993 (2023-10-01), 575 (2024-11-06), 244 à 351 en 2025, puis 74 (2026-11-26), soit une division par 17. Sur la même période, les USA ne baissent que de 29 % depuis octobre 2023 et la France de 57 % depuis mars 2023. Le chiffre de 74 décrit 2026, pas la fenêtre 2024-2025 des mesures. |
| 5 | Arrivées datées par pays (Labubu : USA le 2024-12-06, France +159, Maroc +187 ; chocolat de Dubaï : Allemagne et Suisse le 2024-11-07, France +29, USA +63) | Confirmé par sondage, deux réserves | Sur 10 fichiers retéléchargés (veille et jour de chaque arrivée), aucune ligne la veille et une ligne le jour annoncé, pour chacun des 7 cas sondés. Absence plus ancienne non contrôlée. **Réserves.** (a) Plusieurs arrivées tiennent à un seul jour juste au-dessus du seuil, dans la zone où le README signale le plus de valeurs parasites : Labubu au Maroc 106 le 2025-06-11, chocolat de Dubaï en France 98 le 2024-12-06. Le dossier date l'arrivée au premier jour au-dessus du seuil, alors que le module B exige 3 jours sur 7. (b) L'article anglais « Dubai chocolate » n'a été créé que le 2024-12-16 (API MediaWiki). Sur les 63 jours de retard US, 39 sont donc bornés par l'absence d'article, pas par l'absence d'attention. |
| 6 | Écarts de mi-hauteur entre éditions : Threads +161 j en français (« soit le retard de lancement UE »), Squid Game +1, Clubhouse allemand -9 | Corrigé pour Threads, confirmé pour les autres | Squid Game +1 et Clubhouse -9 : refaits à l'identique. **Threads : la série française mesurée (« Threads (réseau social) ») commence le 2023-12-16.** C'est la date du renommage. L'article s'appelait « Threads (application) » depuis le 2023-07-04, avec 840 et 920 vues par jour les 6 et 7 juillet 2023, soit environ 30 % du pic final (2 966 le 2023-12-18). En réunissant les deux titres, l'écart vaut environ +157 j. L'ordre de grandeur reste juste, mais l'attention française a bien démarré le jour du lancement US : seul le pic a attendu la disponibilité. L'API par article ne suit pas les renommages, donc toute la mesure par langue y est exposée. |
| 7 | Démarrage à froid : 47 séries sur 76 ; z robuste dans 45 séries ; seuls Kleinberg et le CUSUM réagissent sur un article nouveau ; Mann-Kendall à 5 points pour p < 0,01 (1/n!) | Corrigé | 47/76 et 45/76 se retrouvent à partir des données du dossier. Mais les 47 incluent au moins les artefacts « Air fryer en » (premier jour égal au début de fenêtre, 2019-01-01) et « Threads fr » (renommage). Création et renommage ne sont pas distinguables. Les deux cas « article nouveau » du tableau 3.3 donnent ceci. **Le CUSUM alerte après le pic** : Labubu fr le 2025-09-01 pour un pic le 2025-08-24 ; Dubai-Schokolade le 2024-12-12 pour un pic le 2024-11-21. Kleinberg est calculé hors ligne : p0 = R/D sur toute la fenêtre (définition de l'article, version par lots) et chemin de Viterbi rétrograde. Ses dates ne sont pas des dates d'alerte en temps réel. Sur une série synthétique, la version en ligne alerte au jour 63 et la version sur fenêtre complète au jour 80. Mann-Kendall : p exact minimal = 1/n!, vérifié par énumération (0,0417 ; 0,0083 ; 0,0014). **Mais le script applique l'approximation normale avec correction de continuité** : p minimal de 0,0137 pour n = 5, d'où p < 0,01 seulement à partir de n = 6. Avec des ex aequo ou la correction de Hamed et Rao, il faut encore plus de points. |
| 8 | Prévisibilité bornée (Martin et al. 2016, moins de la moitié de la variance expliquée ; Cheng et al. 2014 ; Salganik et al. 2006) | Confirmé, une précision | Les trois résumés sont conformes. Précision : Cheng et al. étudient des cascades de partage de photos **sur Facebook**, pas sur Twitter. |
| 9 | Pièges des sources uniques : Google Flu (Lazer et al. 2014) ; bruit d'échantillonnage de Google Trends et incohérence entre fréquences (Eichenauer et al.) | Confirmé | Eichenauer, Indergand, Martínez et Sax, *Economic Inquiry*, 2021 en ligne (2022 en volume). Le résumé dit « sampling noise can be substantial » et « daily data fail to capture long-run trends ». La pondération de la corroboration à 0,30 reste une hypothèse : ces articles ne la chiffrent pas. |
| 10 | Comptes financiers en 2024 (Findex) et dates Apple Pay | Confirmé | API Banque mondiale, mise à jour du 2026-11-11 : France 99,19, Sénégal 76,46, Côte d'Ivoire 57,6, Maroc 44,39 (44,37 en 2021, donc stagnation), Tunisie 37,84, Algérie 35,29 (44,1 en 2021, donc baisse). Apple Pay (tableau Wikipedia) : USA le 2014-10-20, Royaume-Uni le 2015-07-14 (+267), Canada le 2015-11-17 (+393), Suisse le 2016-07-07 (+626), France le 2016-07-19 (+638), Maroc le 2023-07-18 (+3 193). Écarts recalculés. |
| 11 | Kogut-Singh (Maroc-USA 1,71, Maroc-France 0,51, Afrique de l'Ouest-USA 3,23, depuis la France 1,71, Québec-USA 0,56, Espagne-France 0,25) | Confirmé, une précision | Valeurs refaites à l'identique, mais seulement avec la **variance de population calculée sur les 111 lignes du fichier**, agrégats régionaux et sous-régions compris. Avec la variance d'échantillon : 1,69 ; 0,51 ; 3,18 ; 1,69 ; 0,56 ; 0,24. La formule (moyenne des écarts carrés divisés par la variance) est conforme à Kogut et Singh 1988. Limite de conception : van Everdingen et al. trouvent que les retombées ne suivent « pas nécessairement » la culture. Faire du KS calculé depuis un pays relais un pilier reste une hypothèse à tester. |
| 12 | Licence Hofstede ; Sénégal et Côte d'Ivoire sans scores ; Algérie et Tunisie sur deux dimensions seulement | Corrigé | Licence confirmée mot pour mot : « Researchers can use them without asking for permission. Those who are considering commercial use should contact us. » Sénégal et Côte d'Ivoire absents (seul l'agrégat « Africa West ») : confirmé. Algérie : deux dimensions seulement (orientation long terme 26, indulgence 32), confirmé. **La Tunisie est absente du fichier.** Le Burkina Faso et le Mali n'ont eux aussi que ces deux dimensions. |
| 13 | Brier, décomposition de Murphy, règles propres, leviers IARPA, extrémisation | Confirmé, deux réserves de conception | Mellers et al. 2014 (formation, équipes, suivi, top 2 %), Baron et al. 2014 et Gneiting et Raftery 2007 : résumés conformes. **Réserves.** (a) Baron et al. justifient l'extrémisation surtout parce que les prévisionnistes détiennent des informations différentes. Plusieurs agents Claude nourris des mêmes données ne remplissent pas cette condition. (b) Gneiting et Raftery proposent un score d'intervalle qui pénalise la largeur. La seule couverture à 80 % n'est pas une règle propre : des intervalles très larges la satisfont. |
| 14 | Pokémon Go : mi-hauteur en français le 2016-07-17, sept jours avant le lancement français ; Maroc et Côte d'Ivoire le 2016-10-04 | Corrigé (interprétation) | Dates confirmées : en France le 2016-07-24 (report après l'attentat de Nice), au Maroc et en Côte d'Ivoire le 2016-10-04, mi-hauteur fr le 2016-07-17 (recalculée). Mais **la Belgique, la Suisse et le Luxembourg ont ouvert le 2016-07-16 et le Canada le 2016-07-17**. La mi-hauteur de l'édition française coïncide donc avec la disponibilité dans d'autres pays francophones. Elle ne prouve pas une demande française sans offre. Le Sénégal ne figure pas dans la liste d'octobre 2016. |
| 15 | Survivance et clones (Golder et Tellis 1993 ; Gorillas) | Confirmé | Résumé : « almost half of market pioneers fail », les leaders durables « enter an average of 13 years after pioneers », environ 500 marques dans 50 catégories. Gorillas : fondée en mai 2020, licorne en 9 mois, rachetée par Getir en décembre 2022 pour 1,2 Md$, sortie de tous les marchés annoncée en avril 2024, défunte en mai 2024 (Wikipedia). Rocket Internet non revérifié. |
| 16 | Origines hors USA (intensités : chocolat de Dubaï France 2 177 contre USA 1 875 ; Hyrox 6,6 fois plus intense au Royaume-Uni) | Invérifiable pour les intensités, corrigé pour le padel | Les cumuls demandent 425 fichiers quotidiens (environ 6 Go) : non refaits. Le ratio 2 147 / 326 = 6,6 est cohérent. Biais de mesure : les intensités sont rapportées aux internautes, pas à la consommation totale de Wikipedia du pays. Le seuil de 90 vues par jour équivaut à environ 0,28 vue par million d'internautes aux USA, 1,5 en France et 2,6 au Maroc. Il tronque donc davantage les petits pays. **Padel : inventé au Mexique (Acapulco, 1969), puis diffusé depuis l'Espagne (Marbella, 1974)**, et non né en Espagne. |
| 17 | Économie de l'attention sur YouTube et Twitter (Brodersen et al. 2012 ; Kamath et al. 2013) | Confirmé | « About 50% of the videos have more than 70% of their views in a single region » ; « physical distance… is a strong constraint » ; « hashtags are mostly a local phenomenon ». |
| 18 | The Economist (août 2024) sur le cycle de Gartner | Invérifiable (source primaire) | Wikipedia cite mot pour mot « perhaps a fifth » et « six in ten do not rise again » (The Economist, « Artificial intelligence is losing hype », 2024-08-19). Le site de The Economist n'a pas pu être lu. |

### Cohérence mathématique des formules

- Les poids du module A et des six lignes du module C somment bien à 1. Les paramètres bêta sont corrects (concentration 2 + 38c). La mise à jour par sentinelle est refaite (52 jours avec le Royaume-Uni, 107 avec l'Allemagne). P(arrivée ≤ 159 j) = 0,756 : la valeur publiée de 0,76 inclut une masse « jamais » de 5 % pour la classe B, qui figure dans le code mais pas dans le texte.
- **Table des a priori incohérente avec la loi log-normale.** Une log-normale ne peut pas avoir un P10 nul (classe A, classe C hors UE). Le code ignore d'ailleurs le P10 et ne calcule σ qu'à partir du P90. Les intervalles affichés ne sont donc pas ceux du modèle. Par exemple, le P10 implicite pour la classe C au Maroc vaut environ 245 jours, contre 0 dans la table.
- **Les délais négatifs ne sont pas représentables** dans une loi sur « jours depuis l'arrivée US », alors que 2 des 4 cas mesurés par pays arrivent en Europe avant les USA (chocolat de Dubaï, Hyrox).
- O_c = a_c × max(0, 1 - s_c / a_c) se réduit à max(0, a_c - s_c). Il n'est pas défini si a_c = 0.
- Module D : le code omet le terme 0,4 z(G_c) de la formule écrite. Par ailleurs, p dépend des scores centrés réduits de l'ensemble des candidats : ajouter un candidat change la probabilité des autres. Ce n'est pas une probabilité calibrable au score de Brier sans cohorte fixe.
- L'exemple de mise à jour applique au Royaume-Uni l'a priori du Québec (45 jours), faute de groupe « Royaume-Uni » dans la table. Il est déclenché par une arrivée et non par un décollage, contrairement à la règle énoncée. Il dégrade la prévision : 52 jours contre 159 observés.

### Corrections à reporter dans le dossier

1. Threads en français : environ +157 j sur les deux titres réunis, avec une attention présente dès le 2023-07-04. L'écart de +161 j venait du renommage.
2. Jeu par pays : QID rétroactifs depuis 2023 ; US republiés pour février à septembre 2023 (rupture de série) ; historique par pays disponible depuis 2015 (autre algorithme) ; comptage limité aux 10 premières vues uniques par appareil ; Chine, Hong Kong et Arabie saoudite non publiés ; Émirats, Égypte et Turquie au seuil de 1 000.
3. Couverture marocaine divisée par 17 entre 2023 et 2026 : le chiffre de 74 lignes ne décrit que 2026.
4. Tunisie absente du fichier Hofstede.
5. Padel : origine mexicaine.
6. Cheng et al. 2014 : Facebook.
7. Mann-Kendall dans le script : p < 0,01 à partir de n = 6.
8. Kleinberg : dates rétrospectives. CUSUM : alerte après le pic sur les deux articles nouveaux.
9. Pokémon Go : la mi-hauteur francophone coïncide avec les lancements belge, suisse et québécois.

### Ce que la conception de l'outil doit corriger ou ne pas supposer

1. Agréger les vues par identifiant de page ou par QID en suivant renommages et redirections. L'API Pageviews par titre coupe l'historique au renommage, comme pour Threads en français.
2. Traiter le seuil de détection du jeu par pays comme variable dans le temps et par pays. Couverture marocaine divisée par 17 entre 2023 et 2026 ; reclassement des Émirats du seuil de 550 à 1 000 ; Hong Kong retiré. Ne jamais conclure « absent » sous le seuil, et normaliser les backtests par la couverture du jour.
3. Ne pas utiliser la Chine, Hong Kong, l'Arabie saoudite (non publiés), ni les Émirats, l'Égypte ou la Turquie (seuil de 1 000) comme sentinelles dans ce jeu.
4. Dater une arrivée sur plusieurs jours (3 sur 7) et non sur un seul franchissement proche du seuil. Rapporter l'intensité à la consommation totale de Wikipedia du pays, pas au nombre d'internautes.
5. Ne pas comparer des détecteurs causaux à un détecteur rétrospectif. Kleinberg doit tourner en ligne (p0 estimé sur le passé seulement, état du dernier jour). Le CUSUM n'apporte rien sur un article nouveau, puisqu'il alerte après le pic.
6. Remplacer la loi log-normale des délais par une loi qui admet une masse à zéro et des délais négatifs (mélange « simultané », « avant les USA », log-normale), calée sur P10 et P90 à la fois.
7. Mann-Kendall : avec l'approximation normale, exiger n ≥ 6 (n ≥ 8 recommandé, correction de Hamed et Rao en cas d'autocorrélation).
8. Évaluer les intervalles avec le score d'intervalle ou le CRPS, pas avec la seule couverture. N'extrémiser que des prévisionnistes aux informations réellement différentes.
9. Dans le module D, ne pas faire dépendre la probabilité de la cohorte de candidats (scores centrés réduits) si elle doit être notée au score de Brier.
10. Régler la licence Hofstede avant tout usage commercial. Prévoir une autre source pour la Tunisie, le Sénégal et la Côte d'Ivoire (absents ou réduits à l'agrégat).
11. Ne pas lire « attention avant disponibilité » dans une édition linguistique partagée entre plusieurs pays (Pokémon Go en français) : passer par le jeu par pays, y compris l'historique de 2015 à 2023.
