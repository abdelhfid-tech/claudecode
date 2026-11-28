# Taxonomie PAYS x NICHE x LIFESTYLE du radar d'arbitrage de tendances

Axe de l'étude préalable : segmentation et taxonomie. Dossier arrêté au 28 novembre 2026.
Fichier jumeau, lisible par machine : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/segmentation-taxonomie.json` (sortie structurée, plus la taxonomie et les scores des cellules).

## 0. Méthode, légende et limites

### 0.1 Légende de fiabilité

| Marque | Sens |
|---|---|
| [V] | Fait vérifié pendant cette session sur la source citée (page, PDF ou API lus directement) |
| [S] | Fait rapporté par une source secondaire ou par un résumé de recherche ; la source primaire n'a pas été relue |
| [R] | Repris d'un autre dossier de cette étude, avec la source que ce dossier cite (dossiers `market-france-europe.md`, `market-maroc-maghreb.md`, `trends-us-conso.md`, `trends-us-now.md`, `sources-social.md`, même répertoire) |
| [E] | Estimation ou calcul de ma part à partir de faits [V], [S] ou [R] |
| [H] | Hypothèse de travail, à valider |
| [M] | Connaissance interne antérieure à la session, non revérifiée |

### 0.2 Sources effectivement lues

- **DataReportal, pages « Digital 2027 » par pays** (publiées entre le 4 et le 5 novembre 2026, données d'octobre 2026), téléchargées et extraites par script pour 19 territoires : France, Belgique, Suisse, Luxembourg, Canada, Maroc, Algérie, Tunisie, Sénégal, Côte d'Ivoire, Cameroun, RDC, Réunion, Guadeloupe, Martinique, Guyane, Mayotte, Nouvelle-Calédonie, Polynésie française [V]. Les éditions « Digital 2027 » sont plus récentes que les « Digital 2026 » demandées (publiées en novembre 2025, données d'octobre 2025) ; j'utilise donc les 2027.
- **API de la Banque mondiale** (`api.worldbank.org/v2`, dernière mise à jour des séries le 2026-11-11) : PIB par habitant en dollars courants et en PPA 2025, détention d'un compte (Global Findex, 2024), transferts de fonds reçus en dollars et en % du PIB [V].
- **OIF, synthèse du rapport « La langue française dans le monde 2026 »** (PDF d'avril 2026, rapport lancé le 16 mars 2026 à Québec) [V].
- **ATN de l'Université Laval, NETendances 2025 « Réseaux sociaux et divertissement en ligne »** (PDF de février 2026, 992 internautes québécois de 18 ans et plus, terrain du 11 au 30 septembre 2025) [V].
- **GSMA, « The Mobile Economy Africa 2026 »** (PDF de juin 2026) [V].
- **Insee** : immigrés par pays de naissance 2020-2025 et descendants d'immigrés par origine 2025 (tableaux HTML) ; affiliation religieuse (TeO2) [V].
- **CRÉDOC pour l'Arcep, l'Arcom, le CGE et l'ANCT, Baromètre du numérique 2026** (synthèse de 4 pages, 4 145 personnes interrogées du 5 au 21 juin 2025) [V].
- **Ministère des Sports, synthèse du Baromètre national des pratiques sportives 2025** de l'INJEP (15 janvier 2026) [V].
- **SELL, L'Essentiel du jeu vidéo** (éditions de septembre 2025 et d'avril 2026) [V].
- **DinarStandard, State of the Global Islamic Economy 2025/26** (page de synthèse) [V].
- Pages de presse lues directement : Hespress (Français du Maroc), Le360 (enquête HCP sur l'informel) [V sur la page de presse, S sur le fond].

### 0.3 Limites

1. **Le budget de recherche web partagé entre agents a été épuisé après environ 30 requêtes de ma part** (limite de 200 par tour). Les points suivants n'ont pas pu être recherchés et restent marqués [M], [H] ou listés en questions ouvertes : comptes de mobile money (Wave, Orange Money), part du français au Québec en 2021, effectifs étudiants et naissances au Maroc et en Afrique subsaharienne, études de segmentation récentes de Kantar et YouGov, mesures francophones du « soft life », du frugalisme, du luxe aspirationnel, des néo-ruraux après 2023 et des nomades numériques au Maroc.
2. **Statistique Canada** renvoie une page de vérification JavaScript à un client automatisé ; **l'Ined** est hors ligne (« Site web indisponible pour une période indéterminée ») ; **les PDF de GWI** (rapport Gen Z 2026, « Connecting the dots 2026 ») sont derrière un formulaire.
3. **DataReportal ne publie pas d'audience TikTok** pour le Sénégal, la Côte d'Ivoire, le Cameroun, la Réunion, la Nouvelle-Calédonie et Mayotte, et son total « identités sociales » y est égal à l'audience Facebook : il sous-estime ces pays.
4. **Les pages 2027 de DataReportal attribuent l'analyse à « Manochi »**, et non plus à Kepios comme les éditions précédentes [V]. Une rupture de méthode est possible : comparer 2026 et 2027 avec prudence.

---

## 1. Synthèse

1. **La francophonie n'est pas un marché, c'est un ensemble de 12 pays et d'au moins 6 sous-zones et diasporas dont les seuls points communs sont une langue partielle et une partie des rails culturels.** L'OIF compte 396 millions de francophones en 2025, dont environ 65 % en Afrique, mais la hausse depuis 321 millions (2022) tient surtout à un changement de méthode (élèves de 6 à 9 ans comptés) [V]. La part réelle de francophones va de 42 % (Algérie) à 63 % (Tunisie) au Maghreb et de 45 % (Sénégal) à 60 % (RDC) en Afrique subsaharienne [V]. Le contenu de masse y est en darija, en wolof, en lingala ou en nouchi, pas en français.
2. **L'audience et l'argent sont dans des pays différents.** Mon indice de pouvoir d'achat numérique (PIB par habitant en dollars multiplié par le taux de détention d'un compte, France = 100) vaut 123 en Belgique, 232 en Suisse, 113 au Canada, mais 4,3 au Maroc, 4,4 en Algérie, 3,1 au Sénégal et 0,7 en RDC [E sur données Banque mondiale V]. Rapporté aux internautes, le Canada pèse 68 % de la France, la Suisse 33 %, la Belgique 22 %, le Maroc 2,4 %.
3. **Le mix de plateformes change de nature d'un pays à l'autre.** TikTok touche 93,6 % des adultes en Algérie, 79,2 % en Tunisie, 72,0 % au Maroc, contre 45,7 % en France, 45,8 % en Belgique et 36,5 % en Suisse [V]. En RDC, TikTok (13,8 M d'adultes) dépasse Facebook (9,35 M) [V]. Au Québec, Facebook est utilisé par 76 % des internautes adultes et TikTok par 25 % [V]. Une métrique « réseaux sociaux » unique n'a pas de sens.
4. **La croissance est en Afrique subsaharienne, le revenu en Europe et en Amérique du Nord.** Identités sociales sur un an : RDC +32,5 %, Sénégal +18,3 %, Algérie +7,2 %, Belgique +6,4 %, France +3,9 %, Maroc +0,7 %, Tunisie -0,8 % [V]. Pénétration d'Internet : RDC 19,7 %, Côte d'Ivoire 41,4 %, Cameroun 46,3 %, Sénégal 62,3 % [V].
5. **Les « lifestyles » de la commande ne forment pas une liste mutuellement exclusive.** Ils mélangent étape de vie (étudiants, jeunes parents), génération (Gen Z), mode de travail (freelances, débrouille), origine (diaspora, expatriés), valeurs (halal, éco, frugal, soft life, luxe) et passions (gamers, sportifs). GWI publie en 2026 un rapport intitulé « Does Gen Z really exist? » [V sur la page] et seuls 41 % des 12-28 ans français s'identifient à la notion de « Génération Z » (Ipsos, 2024) [V]. **Je recommande un modèle à facettes** : une facette exclusive « étape de vie », complétée par des facettes multi-étiquettes.
6. **La diaspora est le segment solvable le plus gros venu du Maghreb et d'Afrique.** En France en 2025 : 2,333 M d'immigrés nés au Maghreb et 2,538 M de descendants, soit 4,87 M de personnes ; 1,590 M d'immigrés nés dans le reste de l'Afrique et 1,341 M de descendants, soit 2,93 M [V Insee, provisoire ; somme E]. Transferts reçus en 2025 : 13,66 Md$ au Maroc (7,5 % du PIB), 3,88 Md$ en Tunisie (6,7 %) ; Sénégal 10,6 % du PIB en 2023 [V].
7. **Les tailles de segments existent pour la France et presque nulle part ailleurs.** France : 3,05 M d'étudiants (2025-2026), 643 905 naissances en 2025, 15,3 M de 65 ans et plus, 3,031 M d'auto-entrepreneurs actifs, 40,2 M de joueurs de jeux vidéo, 61 % des 15 ans et plus sportifs réguliers [V ou S]. Maroc : 463 383 auto-entrepreneurs, 2,03 M d'unités de production informelles [R, S]. Afrique subsaharienne : quasiment rien hors démographie.
8. **Les données de base contiennent des anomalies que l'outil doit détecter seul.** Luxembourg à 44,1 % d'identités sociales pour 99 % d'internautes, Guadeloupe à 398 000 adultes sur TikTok pour 372 000 habitants, outre-mer à 52-67 % d'internautes, population française à 66,8 M (ONU) contre 69,1 M au 1er janvier 2026 (Insee, France entière) [V].
9. **La langue du contenu impose un pipeline de détection multi-écritures.** Darija en graphie arabe et en graphie latine avec chiffres (« 3 », « 7 », « 9 »), alternance français-darija dans une même phrase, wolof et lingala en graphie latine. Aucune mesure de la part de chaque écriture n'a été trouvée [R].
10. **Taxonomie proposée** : 13 zones principales (12 pays plus le Québec), 10 sous-zones (Wallonie, Bruxelles, Suisse romande, 7 territoires d'outre-mer) et 5 zones virtuelles de diaspora, d'expatriés et d'étudiants internationaux ; 25 niches de niveau 1 commercialement exploitables, plus 2 niches techniques (information et non classé), environ 130 sous-niches ; 7 facettes de lifestyle portant 36 valeurs. Identifiants stables, libellés et mots-clés en français, anglais, arabe et darija (deux écritures).
11. **Méthode de priorisation** : score = 100 x (T/5)^0,30 x (C/5)^0,20 x (R/5)^0,25 x (F/5)^0,25, avec T = taille monétisable, C = croissance, R = retard exploitable sur les USA, F = faisabilité par une petite équipe, chaque axe noté de 1 à 5 ; filtre réglementaire bloquant avant calcul ; niveau de preuve A, B ou C affiché à part.
12. **Application a priori** : les 5 premières cellules sont France x nutrition (accompagnement GLP-1) x adultes de 35-59 ans (88), France x IA et outils x freelances et solopreneurs (84), Maroc x tourisme x expatriés et visiteurs européens (84), France x sport pratiqué x jeunes actifs (83), France x relations et amitié x jeunes actifs (80). Douze des 20 cellules sont en France, trois au Maroc, deux dans la diaspora maghrébine, une en Belgique, une au Québec, une au Sénégal. Cinq cellules du top 20 ont un niveau de preuve A, dix un niveau B, cinq seulement un niveau C.
13. **Le classement est stable aux pondérations mais pas aux notes** : 19 des 20 cellules restent dans le top 20 avec des poids égaux ou avec une faisabilité pondérée à 40 %, mais les scores s'étalent seulement de 71 à 88. Ce sont les notes d'entrée, pas les poids, qui décident. L'outil doit remplacer ces notes a priori par des mesures dès qu'il tourne.

---

## 2. Pays et zones

### 2.1 Tableau de référence (12 pays)

Sources : DataReportal Digital 2027 par pays (données d'octobre 2026, publiées les 4 et 5 novembre 2026) [V] ; Banque mondiale (PIB 2025, Findex 2024, transferts) [V] ; OIF 2026 (part de francophones, méthode 2 pour RDC, Maroc, Côte d'Ivoire, Sénégal ; taux cités dans le texte pour les autres) [V]. URL par pays : `https://datareportal.com/reports/digital-2027-<pays>` (france, belgium, switzerland, luxembourg, canada, morocco, algeria, tunisia, senegal, cote-divoire, cameroon, democratic-republic-of-the-congo).

| Pays | Population (M) | Âge médian | Internautes (M, %) | Identités sociales (M, % pop.) | 18+ sur réseaux (% des adultes) | Évol. identités 12 mois | Connexions mobiles (M) | TikTok 18+ (M, % adultes) | PIB/hab. 2025 (USD courants / PPA) | Compte bancaire ou mobile (Findex 2024) | Transferts reçus (% PIB) | Francophones (OIF 2026) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| France | 66,8 | 42,5 | 63,9 (95,7 %) | 53,5 (80,1 %) | 88,5 % | +3,9 % | 77,4 | 24,5 (45,7 %) | 48 986 / 63 975 | 99,2 % | 1,3 % | quasi-totalité |
| Belgique | 11,8 | 42,1 | 11,4 (96,9 %) | 9,66 (82,0 %) | 89,8 % | +6,4 % | 12,0 | 4,37 (45,8 %) | 60 750 / 74 676 | 98,2 % | 2,3 % | environ 4,6 M [R, E] |
| Suisse | 9,02 | 43,2 | 8,93 (99,0 %) | 7,67 (85,1 %) | 92,7 % | +5,5 % | 11,5 | 2,70 (36,5 %) | 114 769 / 102 513 | 98,4 % | 0,4 % | environ 2,0 M en Suisse romande [R] |
| Luxembourg | 0,689 | 39,7 | 0,682 (99,0 %) | 0,304 (44,1 %, anomalie) | 54,3 % | -3,0 % | 0,926 | 0,229 (41,0 %) | 147 252 / 156 542 | n.d. | 2,7 % | langue principale de 14,9 % [R] |
| Canada | 40,5 | 40,8 | 38,6 (95,2 %) | 34,7 (85,6 %) | 94,2 % | +5,2 % | 42,8 | 18,0 (54,1 %) | 55 698 / 66 746 | 98,4 % | 0,04 % | Québec : 9,05 M d'habitants [S] |
| Maroc | 38,8 | 30,1 | 35,8 (92,3 %) | 22,9 (59,0 %) | 79,9 % | +0,7 % | 56,1 | 19,6 (72,0 %) | 4 672 / 11 112 | 44,4 % | 7,5 % | 18,7 M (47,8 %) |
| Algérie | 48,2 | 28,8 | 41,0 (85,2 %) | 29,4 (61,1 %) | 93,6 % | +7,2 % | 58,6 | 29,4 (93,6 %) | 6 051 / 18 586 | 35,3 % | 0,6 % | 42 % |
| Tunisie | 12,4 | 33,4 | 10,5 (84,7 %) | 7,77 (62,5 %) | 82,4 % | -0,8 % | 15,7 | 7,11 (79,2 %) | 4 657 / 15 233 | 37,8 % | 6,7 % | 63 % |
| Sénégal | 19,5 | 19,8 | 12,1 (62,3 %) | 6,41 (32,9 %) | 54,5 % | +18,3 % | 23,9 | n.d. | 1 955 / 5 463 | 76,5 % | 10,6 % (2023) | 8,56 M (45,2 %) |
| Côte d'Ivoire | 33,7 | 18,5 | 14,0 (41,4 %) | 8,70 (25,8 %) | 48,6 % | +3,6 % | 51,0 | n.d. | 3 050 / 8 209 | 57,6 % | 2,0 % (2024) | 17,1 M (52,2 %) |
| Cameroun | 30,8 | 18,2 | 14,3 (46,3 %) | 6,10 (19,8 %) | 37,7 % | +3,4 % | 32,1 | n.d. | 1 972 / 5 788 | 60,9 % | 1,3 % (2024) | 47 % |
| RDC | 117 | 15,9 | 23,1 (19,7 %) | 13,8 (11,8 %) | 24,7 % | +32,5 % | 78,1 | 13,8 (24,7 %) | 807 / 1 920 | 39,2 % | 3,7 % | 67,8 M (60,1 %) |

Lecture et précautions :

- **Les identités sociales ne sont pas des personnes.** DataReportal le rappelle sur chaque page et ajoute que sa méthode « ne retient parfois que la plateforme à la plus grande audience publicitaire » [V]. Au Sénégal, en Côte d'Ivoire et au Cameroun, le total est exactement l'audience Facebook ; en Algérie, en RDC, c'est l'audience TikTok.
- **Le Findex mélange compte bancaire et compte de mobile money.** Le Sénégal (76,5 %) dépasse ainsi le Maroc (44,4 %) : c'est un indicateur de capacité de paiement numérique, pas de richesse.
- **La part de francophones dépend de la méthode.** La « méthode 2 » de l'OIF ajoute les enfants de 6 à 9 ans alphabétisés en français ; elle porte les six pays testés de 106,5 M à 132,5 M de francophones [V]. Pour un outil qui mesure des contenus produits par des adultes, la méthode 1 (sans ces enfants) est plus prudente.

Source OIF : https://www.francophonie.org/sites/default/files/2026-04/Synthese_rapport_Langue_francaise_dans_le_monde_2026.pdf (page 34 pour les taux par pays).

### 2.2 Structure par âge (en millions, calcul à partir des parts DataReportal)

| Pays | 13-17 | 18-24 | 25-34 | 35-54 | 55-64 | 65+ |
|---|---|---|---|---|---|---|
| France | 4,07 | 5,95 | 7,68 | 16,30 | 8,42 | 15,30 |
| Belgique | 0,70 | 0,98 | 1,44 | 3,03 | 1,58 | 2,53 |
| Suisse | 0,45 | 0,65 | 1,08 | 2,51 | 1,30 | 1,89 |
| Canada | 2,15 | 3,32 | 5,71 | 10,65 | 5,10 | 8,38 |
| Québec (parts du Canada appliquées à 9,05 M) | n.c. | 0,74 | 1,28 | n.c. | n.c. | 1,96 (21,7 % selon l'ISQ) |
| Maroc | 3,38 | 4,27 | 5,74 | 10,24 | 3,53 | 3,41 |
| Algérie | 4,39 | 4,63 | 6,22 | 13,21 | 4,00 | 3,37 |
| Tunisie | 1,00 | 1,17 | 1,71 | 3,48 | 1,31 | 1,28 |
| Sénégal | 2,22 | 2,69 | 3,06 | 3,53 | 0,90 | 0,72 |
| Côte d'Ivoire | 3,84 | 4,48 | 4,65 | 6,50 | 1,35 | 0,91 |
| Cameroun | 3,51 | 4,10 | 4,47 | 5,51 | 1,23 | 0,86 |
| RDC | 13,34 | 14,74 | 15,68 | 17,08 | 4,56 | 3,63 |

[E] à partir des parts publiées par DataReportal [V]. Le Québec est estimé en appliquant la structure canadienne, sauf pour les 65 ans et plus où l'ISQ donne 21,7 % au 1er juillet 2025 [S, https://statistique.quebec.ca/en/fichier/panorama-des-regions-du-quebec-2026-demographie.pdf].

Lecture : les 18-34 ans pèsent 13,6 M en France, 10,0 M au Maroc, 10,9 M en Algérie, 30,4 M en RDC. Le réservoir « jeune » de la francophonie est africain ; le réservoir « jeune solvable » reste français et canadien.

### 2.3 Plateformes dominantes par pays (audiences publicitaires, millions, fin 2026)

| Pays | 1re | 2e | 3e | 4e | 5e | Remarque |
|---|---|---|---|---|---|---|
| France | YouTube 53,5 | LinkedIn 43,0 (membres) | Snapchat 31,0 | Facebook 30,4 | Instagram 27,4 | TikTok 18+ 24,5 ; Pinterest 18,2 ; X 8,53 [V] |
| Belgique | YouTube 9,66 | LinkedIn 6,90 | Facebook 6,10 | Instagram 5,00 | Snapchat 4,39 | TikTok 4,37 [V] |
| Suisse | YouTube 7,67 | LinkedIn 5,80 | Instagram 3,60 | Snapchat 2,94 | Facebook 2,80 | TikTok 2,70 [V] |
| Canada | YouTube 34,7 | LinkedIn 32,0 | Facebook 25,0 | Instagram 21,4 | TikTok 18,0 | Snapchat 12,7 [V] |
| Québec (usage déclaré, 18+) | Facebook 76 % (61 % chaque jour) | Messenger 59 % | Instagram 38 % | TikTok 25 % | Pinterest et Snapchat 15 % | YouTube 87 % au moins une fois par mois [V] |
| Maroc | YouTube 22,9 | Facebook 21,8 | TikTok 19,6 | Instagram 16,2 | LinkedIn 8,40 | Snapchat 8,16 ; WhatsApp 96,7 % des internautes 16+ (GWI) [V, R] |
| Algérie | TikTok 29,4 | YouTube 27,8 | Facebook 26,0 | Instagram 13,7 | Snapchat 11,0 | LinkedIn 6,90 [V] |
| Tunisie | YouTube 7,77 | Facebook 7,40 | TikTok 7,11 | Instagram 4,15 | LinkedIn 3,30 | Snapchat 2,03 [V] |
| Sénégal | YouTube 6,41 | Facebook 3,45 | LinkedIn 1,80 | Instagram 1,50 | n.d. | TikTok non publié [V] |
| Côte d'Ivoire | Facebook 8,70 | LinkedIn 2,20 | Instagram 0,88 | n.d. | n.d. | TikTok et YouTube non publiés [V] |
| Cameroun | Facebook 6,10 | LinkedIn 1,80 | Instagram 0,55 | n.d. | n.d. | TikTok et YouTube non publiés [V] |
| RDC | TikTok 13,8 | Facebook 9,35 | LinkedIn 1,30 | Instagram 1,00 | n.d. | [V] |

Québec : https://transformation-numerique.ulaval.ca/wp-content/uploads/2026/02/netendances25-reseaux-sociaux-divertissement.pdf. Chez les 18-34 ans, Instagram atteint 62 % et TikTok 49 % ; chez les 18-24 ans, Instagram est le premier réseau (71 % des utilisateurs de réseaux sociaux), devant TikTok (63 %) ; le temps passé a augmenté d'environ 51 minutes par jour entre 2024 et 2025 ; 80 % des internautes jouent à des jeux vidéo ou mobiles et 49 % écoutent des balados au moins une fois par mois [V]. Les internautes anglophones du Québec utilisent davantage YouTube chaque jour (47 % contre 32 % pour l'ensemble) [V].

**LinkedIn compte des membres inscrits**, non comparables aux autres plateformes ; 43,0 M de membres pour 47,5 M d'adultes en France le montre.

### 2.4 Langues réelles du contenu

| Zone | Langues de masse du contenu social | Langue de l'achat et du service | Repères |
|---|---|---|---|
| France | français ; arabe, darija, kabyle, langues africaines dans les communautés ; anglais dans le jeu et la tech | français | [H] pour la répartition |
| Belgique francophone | français (Wallonie, Bruxelles) ; néerlandais dans le reste du pays | français, Bancontact | environ 40 % de la population [R, E] |
| Suisse romande | français ; contenus français consommés directement | français, CHF, TWINT | 22,8 % de la population (2020) [R] |
| Luxembourg | luxembourgeois, français, allemand, anglais, portugais | français et allemand | français langue principale de 14,9 % (recensement 2021) [R] |
| Québec | français majoritaire, anglais fort à Montréal | français obligatoire dans le commerce | part du français à la maison non revérifiée (Statistique Canada inaccessible) [M] |
| Maroc | darija (91,9 % de la population), en graphie arabe et latine ; amazigh (24,8 %) ; français et anglais chez les diplômés urbains | darija à l'oral, français à l'écrit commercial | français lu et écrit par 57,7 % des alphabétisés de 10 ans et plus, anglais 20,5 % [R, HCP] |
| Algérie | darja algérienne, tamazight (dont kabyle), arabe standard, français | arabe et français | 42 % de francophones [V, OIF] |
| Tunisie | tounsi, arabe standard, français | arabe et français | 63 % [V, OIF] |
| Sénégal | wolof (langue véhiculaire), pulaar, sérère, français | français à l'écrit, wolof à l'oral | wolof parlé par 70 à 80 % selon les sources (définitions différentes) [S] ; 45,2 % de francophones [V] |
| Côte d'Ivoire | français véhiculaire, nouchi (argot urbain), dioula, baoulé | français | 52,2 % [V] |
| Cameroun | français, anglais (régions du Nord-Ouest et du Sud-Ouest), pidgin, camfranglais | français ou anglais | 47 % [V] |
| RDC | lingala, swahili, kikongo, tshiluba, français | français à l'écrit | 60,1 % [V] |

### 2.5 Sous-zones et outre-mer

| Sous-zone | Identifiant proposé | Population | Internautes | Identités sociales | Observation | Source |
|---|---|---|---|---|---|---|
| Québec | `CA-QC` (ISO 3166-2) | 9,05 M (1er juillet 2025) ; 9,03 M au 1er janvier 2026 | 94 % des internautes 18+ sur réseaux sociaux | n.d. | marché-sas des lancements US ; voir 2.3 | [S] ISQ ; [V] NETendances |
| Wallonie et Bruxelles | `BE-WAL`, `BE-BRU` | environ 4,6 M de francophones | 96,9 % (Belgique) | 82,0 % (Belgique) | TikTok Shop ouvert le 15 juin 2026, 14,5 mois après la France | [R] |
| Suisse romande | `CH-ROM` (code propre ; `CH-FR` désigne le canton de Fribourg en ISO) | environ 2,0 M | 99,0 % (Suisse) | 85,1 % | hors UE, CHF, pas de loi influenceurs | [R] |
| La Réunion | `RE` | 887 000 | 594 000 (66,9 %) | 545 000 (61,5 %) | âge médian 38,4 | [V] |
| Guadeloupe | `GP` | 372 000 | 232 000 (62,3 %) | 177 000 | TikTok 398 000 adultes, supérieur à la population : anomalie | [V] |
| Martinique | `MQ` | 337 000 | 220 000 (65,3 %) | 166 000 | âge médian 50,2 | [V] |
| Guyane | `GF` | 320 000 | 180 000 (56,2 %) | 95 300 | âge médian 24,9 | [V] |
| Mayotte | `YT` | 350 000 | 181 000 (51,8 %) | 105 000 (+33,6 %) | âge médian 17,3 | [V] |
| Nouvelle-Calédonie | `NC` | 299 000 | 245 000 (82,0 %) | 166 000 | | [V] |
| Polynésie française | `PF` | 283 000 | 206 000 (72,7 %) | 205 000 | TikTok 77,2 % des adultes | [V] |

Les sept territoires totalisent environ 2,85 M d'habitants [E]. Les taux d'internautes de 52 à 67 % dans les DROM semblent bas pour des territoires français équipés ; je les traite comme suspects jusqu'à recoupement avec l'Insee ou l'Arcep [H]. Les créoles (réunionnais, guadeloupéen, martiniquais, guyanais), le shimaoré et les langues kanak et tahitienne coexistent avec le français [M].

### 2.6 Diasporas et expatriés : des zones virtuelles

| Zone virtuelle | Identifiant | Taille | Pouvoir d'achat et rails | Source |
|---|---|---|---|---|
| Maghreb en France (immigrés) | `DIA-MAGH@FR` | 2,333 M en 2025 (Algérie 1,008 M ; Maroc et Tunisie 1,325 M) | euros, carte, Stripe côté client | [V] https://www.insee.fr/fr/statistiques/2381755 (provisoire) |
| Maghreb en France (descendants) | idem, attribut `generation=2` | 2,538 M (Algérie 1,250 M ; Maroc et Tunisie 1,287 M) | idem | [V] https://www.insee.fr/fr/statistiques/4186761 |
| Afrique subsaharienne en France | `DIA-SSA@FR` | immigrés 1,590 M (Afrique sahélienne 430 000, guinéenne ou centrale 644 000, Comores et Madagascar 270 000) ; descendants 1,341 M | euros | [V] Insee, mêmes tableaux |
| Marocains du monde (toutes résidences) | `DIA-MA@*` | 5 à 6 M selon la presse ; plus de 4 M de passages lors de l'opération Marhaba 2025 | 122 Md DH de transferts en 2025 [R] ; 13,66 Md$ selon la Banque mondiale [V] | [S] |
| Français au Maroc | `EXP-FR@MA` | plus de 50 000 inscrits au registre consulaire (mai 2026) ; environ 55 000 inscrits pour plus de 80 000 présents selon une autre source | euros (pensions, salaires) | [S] https://fr.hespress.com/475547-elections-consulaires-un-scrutin-discret-aux-enjeux-cruciaux-pour-les-francais-du-maroc.html ; https://fr.le360.ma/politique/francais-du-maroc-quand-la-diaspora-est-appelee-a-donner-de-la-voix_FA7JUPRWBZHMDJ7E5UA2S2WIXM/ |
| Retraités français au Maroc | `EXP-FR@MA`, attribut `retraite=true` | « plus de 61 000 » selon un site communautaire, chiffre non daté | pensions en euros | [S faible] https://www.bladi.net/retraite-maroc-francais-saute,119708.html |
| Étudiants étrangers en France | `ETU-INTL@FR` | 352 800 en mobilité internationale (12 % des effectifs, 2025-2026) | faible à moyen | [S] https://www.enseignementsup-recherche.gouv.fr/fr/les-effectifs-d-etudiants-etrangers-en-mobilite-internationale-en-2025-2026-104487 |
| Français à l'étranger (tous pays) | référence | 1 784 975 inscrits au 31 décembre 2025 (+1,7 %) | | [S] |

Règle de modélisation : une diaspora est un couple (origine, résidence). Elle hérite de la langue et des niches de l'origine, et des rails de paiement, du droit et du pouvoir d'achat de la résidence. Elle ne doit jamais être additionnée à la population du pays d'origine.

### 2.7 Indicateur de pouvoir d'achat numérique

Définition proposée [E] : IPAN = PIB par habitant en dollars courants x taux de détention d'un compte (Findex), ramené à France = 100. Masse adressable = IPAN x nombre d'internautes, ramenée à France = 100.

| Pays | IPAN | Masse adressable | Lecture |
|---|---|---|---|
| France | 100 | 100 | référence |
| Belgique | 123 | 22 | petite mais riche ; francophone à 40 % |
| Suisse | 232 | 33 | très riche ; romande à 23 % |
| Luxembourg | 300 (compte supposé à 99 %) | 3 | extension, pas une cible seule |
| Canada | 113 | 68 | dont Québec environ 22 % de la population [E] |
| Maroc | 4,3 | 2,4 | audience large, faible valeur par personne |
| Algérie | 4,4 | 2,8 | paiement en ligne embryonnaire [R] |
| Tunisie | 3,6 | 0,6 | code des changes contraignant [R] |
| Sénégal | 3,1 | 0,6 | mobile money répandu |
| Côte d'Ivoire | 3,6 | 0,8 | |
| Cameroun | 2,5 | 0,6 | |
| RDC | 0,7 | 0,3 | |

Pourquoi les dollars courants et non la PPA : un service numérique vendu par une petite équipe est facturé au prix international (abonnement, outil, application) ; la PPA surestime la capacité à payer ce prix. La PPA reste utile pour les biens et services locaux ; l'outil doit stocker les deux.

---

## 3. Niches de contenu et de commerce

### 3.1 Règles qui rendent la liste mutuellement exclusive

1. **La niche décrit l'objet de l'attention ou de la dépense ; le lifestyle décrit la personne.** « Mode modeste » est une sous-niche de la mode ; « halal » est un lifestyle. « Gamer » est un lifestyle de passion dérivé de la niche jeu vidéo.
2. **Une niche principale par signal**, plus des niches secondaires facultatives. Arbitrage par la dépense principale : un séjour Hyrox à Marrakech relève de N10 voyage (secondaire N03) ; une formation « vivre de TikTok Shop » relève de N14 (secondaire N23) ; une crème à allégation minceur relève de N01 (drapeau santé).
3. **Les sujets réglementés restent dans leur niche naturelle avec un drapeau** (paris sportifs dans N04, crypto dans N11, esthétique médicale dans N01, médicaments GLP-1 dans N05) ; le filtre réglementaire agit sur le drapeau, pas sur la niche.
4. **Deux niches techniques ferment la liste** : N26 information et société (actualité, politique, causes ; mesurée mais exclue du score commercial) et N27 non classé (file de revue manuelle, alimente l'ajout de niches).
5. **Fusion de « voyage » et « tourisme »** en N10 avec deux sous-niches : voyage sortant (le consommateur part) et tourisme réceptif (on vend au visiteur). Ce sont deux faces du même objet ; les séparer créerait des doublons sur chaque contenu de destination.

### 3.2 Liste des 27 niches de niveau 1 et de leurs sous-niches

| Id | Niche | Sous-niches (niveau 2) | Drapeaux réglementaires typiques |
|---|---|---|---|
| N01 | Beauté et soins | skincare ; maquillage ; cheveux (dont texturés et afro) ; parfum ; grooming masculin ; esthétique médicale | allégations cosmétiques ; esthétique médicale réservée aux médecins [M] |
| N02 | Mode et accessoires | mode modeste ; seconde main et vintage ; streetwear et sneakers ; tenue traditionnelle (caftan, takchita, boubou, bazin, wax) ; bijoux et montres | ultra fast-fashion en France (malus et interdiction de publicité au 1er janv. 2027) [R] |
| N03 | Sport pratiqué et fitness | course à pied et run clubs ; salle et musculation ; Hyrox et courses de fitness ; pilates et yoga ; sports de raquette (padel) ; sports de combat pratiqués ; plein air (randonnée, surf) | |
| N04 | Sport spectacle et football | football clubs et sélections ; grandes compétitions (CAN, Mondial 2030) ; sports US ; sport féminin ; sports de combat spectacle ; paris sportifs | paris sportifs régulés ou interdits selon le pays |
| N05 | Nutrition, poids et alimentation santé | perte de poids et GLP-1 ; protéines et fibres ; compléments ; régimes et jeûne ; nutrition sportive | allégations de santé (UE) ; publicité des médicaments |
| N06 | Santé mentale et bien-être | santé mentale ; sommeil ; santé féminine et ménopause ; méditation et développement personnel ; IA confident ; longévité | dispositifs médicaux ; mineurs |
| N07 | Parentalité et famille | grossesse et naissance ; petite enfance ; éducation et écrans ; vie de famille | publicité visant les mineurs |
| N08 | Cuisine, gastronomie et boissons | recettes maison ; street food et restaurants ; café, matcha et boissons ; sans alcool ; pâtisserie ; cuisine du Ramadan | alcool (loi Evin en France) |
| N09 | Maison, déco et jardin | décoration ; bricolage ; rangement et ménage ; jardinage ; équipement | |
| N10 | Voyage et tourisme | voyage sortant ; tourisme réceptif ; retour au pays (diaspora) ; voyage sportif ou de passion ; workation | |
| N11 | Finance personnelle et investissement | budget et épargne ; bourse et ETF ; crypto ; finance islamique ; crédit ; tontines (dart, tontine) | conseil financier, crypto, influence financière |
| N12 | Immobilier et logement | achat de résidence ; investissement locatif ; location et colocation ; immobilier de la diaspora ; crédit immobilier | intermédiation immobilière |
| N13 | Carrière, emploi et études | recherche d'emploi ; orientation et admission ; études à l'étranger ; alternance et stages ; reconversion ; concours | |
| N14 | Entrepreneuriat et revenus complémentaires | e-commerce, paiement à la livraison et dropshipping ; commerce social et live ; services freelance ; monétisation des créateurs ; revente de seconde main ; side business | promesses de gains |
| N15 | IA, tech et outils numériques | IA générative ; productivité et no-code ; smartphones et gadgets ; cybersécurité ; applications | AI Act art. 50 (transparence) depuis le 2 août 2026 [R] |
| N16 | Jeux vidéo et e-sport | jeux mobiles (Free Fire, PUBG Mobile, eFootball) ; console et PC ; e-sport ; streaming de jeu | loot boxes, mineurs |
| N17 | Auto, moto et mobilité | voiture ; moto et scooter ; électrique ; permis ; occasion | |
| N18 | Animaux de compagnie | chats ; chiens ; alimentation ; santé animale | |
| N19 | Mariage et événementiel | mariage ; fiançailles et henné ; fêtes et anniversaires ; fêtes religieuses et naissance | |
| N20 | Religion et spiritualité | islam pratiqué (Coran, prière, Ramadan) ; christianisme ; spiritualités alternatives (astrologie, tarot) ; retraites | sujet sensible, ciblage religieux interdit dans la publicité Meta en UE [M] |
| N21 | Divertissement, humour et fandoms | humour et sketchs ; séries et micro-dramas ; célébrités et téléréalité ; anime, manga, K-pop ; cinéma ; lecture (BookTok) | |
| N22 | Musique | rap et musiques urbaines ; musiques du Maghreb (raï, chaâbi, gnaoua) ; musiques d'Afrique (coupé-décalé, ndombolo, mbalax, afrobeats) ; pop et variété ; concerts et festivals ; musique générée par IA | droits d'auteur |
| N23 | Éducation et langues | langues (anglais, français, arabe) ; soutien scolaire et examens (bac, BFEM, BEPC) ; compétences professionnelles ; numérique et IA pour tous ; culture générale | |
| N24 | Terroir, artisanat et fabrication locale | produits du terroir (argan, huile d'olive, amlou, dattes) ; artisanat (tapis berbère, zellige, poterie, wax) ; fabriqué localement ; savoir-faire | indications géographiques |
| N25 | Relations, rencontres et amitié | rencontres ; amitié et sociabilité (événements) ; couple ; vie en solo | |
| N26 | Information et société (technique) | actualité ; politique ; causes ; environnement militant | hors score commercial |
| N27 | Non classé (technique) | file de revue | hors score |

Couverture de la liste demandée : toutes les pistes de la commande sont présentes ; « tourisme » est fusionné avec « voyage » (règle 5) ; j'ajoute N25 relations et amitié (méta-tendance US du retour au réel social [R]) et les deux niches techniques, nécessaires pour que la liste soit collectivement exhaustive.

### 3.3 Indicateurs de taille ou d'engagement par niche et par pays

Les indicateurs ci-dessous sont ceux que j'ai pu sourcer ; les cases vides ne sont pas des zéros. L'outil devra produire lui-même la mesure manquante (section 5.6).

| Niche | France | Maroc et Maghreb | Québec, Belgique, Suisse | Afrique subsaharienne | Monde ou USA (repère) |
|---|---|---|---|---|---|
| N01 beauté | TikTok Shop FR depuis le 31/03/2025, 33 000 vendeurs (mars 2026) [R] ; audience TikTok adulte à 65 % féminine [R] | cosmétiques achetés par 42 % des acheteuses en ligne [R] | | | K-beauty US 2 Md$ (+37,2 %) [R] |
| N02 mode | Vinted 1,1 Md€ de CA 2025 (+38 %), GMV 10,8 Md€ [R] ; mode premier secteur d'investissement en influence, 81 M€ [R] | habillement acheté par 77 % des acheteuses en ligne [R] | | | mode modeste 347 Md$ en 2024, 444 Md$ en 2029 [V SGIE] |
| N03 sport pratiqué | 61 % des 15+ pratiquent chaque semaine, 72 % dans l'année [V] ; 13,2 M de coureurs [R] ; padel 850 000 joueurs, 4 520 pistes [R] | environ 200 pistes de padel, 60 clubs [R] | | | padel US 1,07 M de joueurs [R] |
| N04 football | | CAN 2025 : 1,34 M de spectateurs ; Mondial 2030 (6 villes marocaines) [R] | | | |
| N05 nutrition | GLP-1 remboursés à 65 % depuis le 15/06/2026, +74 % en volume en 11 semaines [R] ; produits hyper-protéinés +12 % en valeur [R] | | | | 11 % des adultes US sous GLP-1 [R] |
| N06 bien-être | 56 % des 12-28 ans déclarent stress ou solitude (Ipsos, 2024) [V] | | Québec : le quart des internautes a déjà demandé conseil à l'IA sur sa santé (ATN, juin 2026) [S] | | |
| N07 parentalité | 643 905 naissances en 2025, fécondité 1,56 [S Insee] | | | âges médians de 15,9 à 19,8 ans | |
| N08 cuisine et boissons | bière sans alcool environ +12 % sur un an, environ 5 % du marché [R] | marché structurellement sans alcool [H] | | | halal alimentaire 1 530 Md$ en 2024 [S SGIE] |
| N10 voyage et tourisme | | recettes voyages 138,6 Md DH en 2025 (+21 %) [R] | | | |
| N11 finance | | transferts MRE 122 Md DH en 2025 [R] | | Sénégal : transferts 10,6 % du PIB [V] | |
| N13 carrière et études | 3,05 M d'étudiants, 628 500 apprentis du supérieur [S SIES] | 167 380 emplois d'externalisation [R] ; LinkedIn 8,4 M (+21,7 %) [R] | | | |
| N14 entrepreneuriat | 3,031 M d'auto-entrepreneurs actifs fin 2025, 2,18 M avec un CA positif [S URSSAF] | 463 383 auto-entrepreneurs [R] ; 2,03 M d'unités informelles [S HCP] ; 84,1 % des acheteurs paient à la livraison [R] | Belgique : TikTok Shop depuis le 15/06/2026 [R] | emploi informel environ 85 % en Afrique (OIT) [S] | |
| N15 IA et outils | IA générative utilisée par 48 % de la population (33 % en 2024), 85 % des 18-24 ans, 15 % des 70 ans et plus [V CRÉDOC] | | | | |
| N16 jeu vidéo | 40,2 M de joueurs (7 Français sur 10), 76 % jouent chaque semaine, 49 % de femmes [V SELL] | Discord 6,0 % des internautes 16+ au Maroc (GWI) [R] | Québec : 80 % des internautes jouent au moins une fois par mois [V] | | |
| N20 religion | musulmans environ 10 % des 18-59 ans (TeO2, 2019-2020) [S] ; 7 % des 15+ selon l'Ifop (2025) [S] ; 13 234 baptêmes d'adultes à Pâques 2026 [R] | | | | dépenses des consommateurs musulmans 2 600 Md$ en 2024 [S SGIE] |
| N21 divertissement | micro-dramas : plus de 5 M$ de revenus mensuels d'applis, public à 70 % féminin [R] | | | | |
| N22 musique | | | Québec : 49 % écoutent des balados chaque mois [V] | | |
| N24 terroir | | origine d'une partie de l'offre déco (tapis, motifs berbères) [R] | | | |

---

## 4. Lifestyles et tribus : un modèle à facettes

### 4.1 Pourquoi une liste plate ne fonctionne pas

- **Recouvrements massifs** : un étudiant est presque toujours Gen Z ; une jeune mère peut être freelance, halal et éco-responsable. Additionner des tailles de « tribus » donne plus que la population.
- **La génération est un mauvais segment de décision** : GWI titre son rapport 2026 « Does Gen Z really exist? » et y défend que la question est de savoir si Gen Z est « a distinct audience a brand can build around » [V, page du rapport, https://www.gwi.com/reports/generation-z] ; Ipsos mesure que 41 % des 12-28 ans français s'identifient à la notion, contre 58 % au Royaume-Uni et 6 % en Inde [V, https://www.ipsos.com/fr-fr/node/1025321, juin 2024]. L'étape de vie (études, premier emploi, premier enfant) explique mieux les achats [H, cohérent avec les deux sources].
- **Certains « lifestyles » sont des passions déjà captées par une niche** (gamers, sportifs amateurs) : les garder comme tribus séparées crée des doublons. Je les conserve comme facette « passion » calculée à partir de l'affinité de niche.

### 4.2 Les 7 facettes

| Facette | Code | Exclusive ? | Valeurs | Source de l'attribution |
|---|---|---|---|---|
| Étape de vie | LS | oui, exhaustive pour les 13 ans et plus | ADO (13-17), ETUDIANTS, JEUNES_ACTIFS (18-34 sans enfant), JEUNES_PARENTS (enfant de moins de 6 ans), FAMILLES (enfants de 6 à 17 ans), ADULTES (35-59 sans enfant mineur), SENIORS (60 ans et plus) | âge, statut déclaré, signaux de contenu |
| Cohorte | CO | oui | ALPHA, GENZ (environ 1997-2012), MILLENNIAL, GENX, BOOMER | âge |
| Habitat | HA | oui | METROPOLE, URBAIN, PERIURBAIN, RURAL ; drapeau NEO_RURAL | géolocalisation, contenu |
| Mode de travail | WM | non | SALARIE, SOLO (freelance, solopreneur), NOMADE, DEBROUILLE (informel), SANS_EMPLOI | déclaratif, bio, contenu |
| Origine et mobilité | OM | non | SEDENTAIRE, DIASPORA (origine, résidence), EXPAT, RETRAITE_EXPAT, ETUDIANT_INTL, FRONTALIER | langue, géographie croisée |
| Valeurs et identité | VI | non | HALAL, ECO (éco-responsable et minimaliste), FRUGAL (frugaliste, FIRE), SOFT_LIFE (soft life et esthétiques associées), LUXE_ASPI, TRADITION (traditionnel et familial) | contenu, mots-clés, comptes suivis |
| Passion | PA | non | GAMER, SPORTIF, et toute affinité forte à une niche | affinité de niche |

La valeur ADULTES n'est pas dans la commande ; je l'ajoute pour que la facette « étape de vie » soit exhaustive. Sans elle, les 35-59 ans sans enfant mineur (16,3 M de 35-54 ans en France, quel que soit leur statut familial) n'auraient pas de case, alors qu'ils portent des niches majeures (GLP-1, immobilier, épargne).

Une cellule de la matrice combine **une zone, une niche de niveau 1 et une valeur d'une seule facette** (exemple : `FR.N05.L-LS-ADULTES`). Les croisements de facettes (exemple : jeunes actifs halal en diaspora) sont des requêtes d'analyse, pas des cellules permanentes, pour garder une combinatoire calculable.

### 4.3 Fiches des segments demandés

| Segment (id) | Facette | Taille connue | Plateformes dominantes | Langue | Moteurs d'adoption | Pays où le segment pèse | Preuve |
|---|---|---|---|---|---|---|---|
| Gen Z urbaine (`L-CO-GENZ` x `HA=URBAIN`) | cohorte x habitat | 18-24 ans : FR 5,95 M, MA 4,27 M, DZ 4,63 M, RDC 14,7 M ; urbanisation MA 78,3 % (ONU) ou 62,8 % (HCP) | TikTok, Instagram, Snapchat (FR), YouTube ; au Québec Instagram 71 % des 18-24 ans | français ; darija et anglais en mélange au Maghreb | prix, appartenance, création, IA (85 % des 18-24 ans en FR) | tous ; masse en Afrique | [E] sur [V] |
| Étudiants (`L-LS-ETUDIANTS`) | étape de vie | FR 3,05 M (2025-2026, +1,1 %), dont 352 800 étrangers ; MA, QC, Afrique : n.d. | Instagram, TikTok, Snapchat, Discord, YouTube | français, anglais | budget, orientation, logement, emploi | France, Québec, Maroc urbain, Sénégal | [S] SIES |
| Jeunes actifs (`L-LS-JEUNES_ACTIFS`) | étape de vie | 25-34 ans : FR 7,68 M, MA 5,74 M, DZ 6,22 M, CI 4,65 M ; QC 1,28 M [E] | Instagram, LinkedIn, YouTube, TikTok ; QC 18-34 : Instagram 62 %, TikTok 49 % | français ; français et darija au Maroc | sociabilité (run clubs, événements), carrière, logement, santé | France, Belgique, Québec, Maroc urbain | [E] sur [V] |
| Jeunes parents (`L-LS-JEUNES_PARENTS`) | étape de vie | FR : 643 905 naissances en 2025, soit environ 3,9 M d'enfants de 0 à 5 ans [E] | Instagram, Pinterest, Facebook (groupes), WhatsApp | français ; darija | santé, sommeil, écrans, temps, budget | France, Maroc, Afrique (natalité forte) | [S] Insee |
| Familles (`L-LS-FAMILLES`) | étape de vie | FR : 13-17 ans 4,07 M ; MA : classes moyennes familiales sur Facebook (64 % de la population selon Sunergia) [R] | Facebook, WhatsApp, YouTube | français ; darija en graphie arabe [H] | école, alimentation, maison, vacances | Maroc, Algérie, France | [E], [R] |
| Seniors connectés (`L-LS-SENIORS`) | étape de vie | FR 65+ : 15,3 M (22,9 %) ; QC 65+ : 21,7 % ; IA générative : 15 % des 70+ en FR | Facebook, WhatsApp, YouTube ; en FR Facebook déclaré par 70,2 % des internautes [R] | français | santé, famille, voyage, sécurité, apprentissage du numérique | France, Belgique, Suisse, Québec, Martinique et Guadeloupe (âges médians 50,2 et 47,4) | [V] |
| Freelances et solopreneurs (`L-WM-SOLO`) | mode de travail | FR : 3,031 M d'auto-entrepreneurs actifs fin 2025 (+4,5 %), 2,18 M avec CA ; 4,94 M de comptes d'indépendants ; MA : 463 383 | LinkedIn, YouTube, Instagram, communautés (Skool, Discord) | français, anglais | IA, acquisition de clients, conformité, encaissement | France, Belgique, Québec, Maroc | [S] URSSAF ; [R] |
| Nomades numériques (`L-WM-NOMADE`) | mode de travail | USA : 18,5 M en 2025 (+2,2 %, plateau) [R] ; Maroc : pas de visa dédié, aucun comptage trouvé [S] | YouTube, Instagram, Reddit, groupes Facebook et WhatsApp | anglais, français | coût de la vie, climat, surf, fiscalité | Maroc (Taghazout, Dakhla, Marrakech) comme destination ; France et Québec comme origine | [R], [S] |
| Diaspora (`L-OM-DIASPORA`) | origine et mobilité | Maghreb en France 4,87 M (immigrés et descendants) ; Afrique subsaharienne en France 2,93 M ; MRE 5 à 6 M | Facebook, Instagram, TikTok, YouTube, WhatsApp | français, darija, langues de résidence | lien au pays, transferts, immobilier, mariage, retour l'été | France, Belgique, Espagne et Italie (hors périmètre linguistique), Québec | [V] Insee ; [S] |
| Expatriés et retraités français au Maroc (`L-OM-EXPAT`, `L-OM-RETRAITE_EXPAT`) | origine et mobilité | plus de 50 000 inscrits au consulat, environ 80 000 présents ; plus de 61 000 retraités (estimation faible) | Facebook (groupes d'expatriés), WhatsApp, YouTube | français | coût de la vie, climat, santé, fiscalité des pensions | Maroc (Marrakech, Agadir, Essaouira, Tanger) [H] | [S] |
| Lifestyle halal (`L-VI-HALAL`) | valeurs | FR : environ 10 % des 18-59 ans de religion musulmane (TeO2) ; majoritaire au Maghreb et au Sénégal [M pour le Sénégal] ; dépense mondiale 2 600 Md$ | Instagram, TikTok, YouTube ; applis dédiées | français, arabe, darija | alimentation, mode modeste, finance islamique, voyage, Ramadan | France, Belgique, Maghreb, Sénégal | [S] |
| Éco-responsables et minimalistes (`L-VI-ECO`) | valeurs | FR : près de 40 % engagés dans la consommation responsable (ObSoCo, non daté) [S] ; 20 % des équipés ont un smartphone d'occasion ; 38 % ont fait réparer un équipement en 3 ans, dont 24 % pour l'environnement [V] | Instagram, Pinterest, Vinted, YouTube | français | budget autant qu'écologie ; « fatigue écologique » signalée [S] | France, Belgique, Suisse, Québec | [V], [S] |
| Soft life et esthétiques associées (`L-VI-SOFT_LIFE`) | valeurs | USA : environ 460 000 publications « soft life » contre des millions pour le « great lock-in » (YPulse, déc. 2025) [R] ; francophonie : non mesuré | TikTok, Instagram, Pinterest | anglais, français ; expression née au Nigeria [M] | bien-être, refus de l'effort affiché, confort | Côte d'Ivoire, Sénégal, Cameroun (urbains aisés) [H] ; France | [R], [H] |
| Frugalistes (`L-VI-FRUGAL`) | valeurs | non mesuré ; sous-consommation et défis « no buy » mainstream aux USA [R] ; reportage SNRT sur des créateurs marocains appelant à déconsommer [R] | YouTube, Reddit, newsletters | français | inflation, indépendance financière | France, Québec, Suisse | [R] |
| Gamers (`L-PA-GAMER`) | passion | FR 40,2 M de joueurs ; QC 80 % des internautes ; MA Discord 6 % | YouTube, Twitch, Discord, TikTok | français, anglais | social, compétition, création | France, Québec, Algérie (jeunes, TikTok) | [V] |
| Sportifs amateurs (`L-PA-SPORTIF`) | passion | FR 61 % des 15+ chaque semaine ; 13,2 M de coureurs | Strava, Instagram, YouTube, TikTok | français | santé (premier motif), sociabilité | France, Belgique, Maroc urbain | [V], [R] |
| Néo-ruraux (`HA=NEO_RURAL`) | habitat | environ 14 % des déménagements depuis la ville vont vers la campagne ; pas d'exode massif (POPSU, 2023) [S] | Facebook (groupes locaux), YouTube, Instagram | français | télétravail, prix du logement, nature | France, Québec | [S] |
| Luxe aspirationnel (`L-VI-LUXE_ASPI`) | valeurs | USA : le luxe perd ses clients aspirationnels au profit des dupes et de la revente [R] ; francophonie : non mesuré | Instagram, TikTok | français, arabe | statut, revente, dupes | Maroc, Côte d'Ivoire, Algérie, diaspora [H] ; France (offre) | [R], [H] |
| Économie de la débrouille (`L-WM-DEBROUILLE`) | mode de travail | Afrique : emploi informel environ 85 % (OIT) ou 83 % (CEA, 2024) ; Maroc : 2,03 M d'unités informelles (77,3 % en ville), 33,1 % de l'emploi non agricole | Facebook, WhatsApp, TikTok | darija, wolof, nouchi, lingala, français | revenus, débrouillardise, commerce de proximité | Maroc, Algérie, Côte d'Ivoire, Cameroun, RDC, Sénégal | [S] |

Sources des fiches : Insee, SIES, URSSAF via Le Journal des Entreprises (https://www.lejournaldesentreprises.com/article/lurssaf-recense-494-millions-de-travailleurs-independants-fin-2025-2147701), CRÉDOC (https://www.credoc.fr/download/pdf/Sou/Sou2026-5064.pdf), ministère des Sports (https://www.sports.gouv.fr/sport-en-france-une-progression-continue-depuis-2018-boostee-par-les-jeux-de-paris-2024-10055), SELL (https://www.sell.fr/sites/default/files/essentiel-jeu-video/ejv_avril_2026_final_.pdf), HCP via Le360 (https://fr.le360.ma/economie/secteur-informel-le-diagnostic-detaille-du-hcp_45XPLJ5C4VGBDHERYSMN3CZLPA/), OIT via Le360 Afrique (https://afrique.le360.ma/economie/en-afrique-lemploi-informel-est-le-plus-eleve-au-monde-le-classement-des-sous-regions-et-ce-quil_2H7YLONBJRG6DENCSJOD4JHW4U/), POPSU via Maire-info (https://www.maire-info.com/ruralite-l'exode-urbain-post-covid-n'est-pas-celui-qu'on-croit-article2-27223), DinarStandard (https://www.dinarstandard.com/insights/state-of-the-global-islamic-economy-report-2025-26).

Note sur les chiffres du sport : la synthèse ministérielle donne 61 % de pratiquants réguliers chez les 15 ans et plus, mais aussi 84 % chez les 15-29 ans, 75 % chez les 30-59 ans et 61 % chez les 60 ans et plus, ce qui ne peut pas donner une moyenne de 61 %. L'une des deux séries porte probablement sur la pratique annuelle ; à vérifier dans le rapport INJEP complet avant usage [V sur la page, incohérence relevée].

### 4.4 Ce que les études de segmentation disponibles permettent, et ne permettent pas

- **GWI** : seul fournisseur qui croise pays, plateformes et centres d'intérêt dans tous les pays du périmètre maghrébin et européen (ses chiffres alimentent DataReportal, exemple : usage déclaré au Maroc au T2 2026) [R]. Les rapports gratuits sont derrière formulaire et les données détaillées sont payantes. Couverture de l'Afrique subsaharienne francophone non vérifiée.
- **Ipsos, Kantar, YouGov** : je n'ai pu lire qu'une synthèse Ipsos sur la Gen Z (2024). Aucune segmentation par tribus francophones récente et ouverte n'a été trouvée avant épuisement du budget de recherche.
- **Conséquence** : l'outil ne peut pas s'appuyer sur un référentiel de tribus « acheté » ; il doit estimer lui-même la présence d'un lifestyle par des signaux observables (mots-clés de bio, comptes suivis, co-occurrence de niches) et réserver les études payantes au calibrage ponctuel.

---

## 5. Structure de données recommandée (configuration de l'outil)

### 5.1 Principes

1. **Identifiants stables et lisibles** : zones en ISO 3166-1 alpha-2 (`FR`, `MA`) ou ISO 3166-2 (`CA-QC`, `BE-WAL`), codes propres préfixés pour ce qui n'existe pas en ISO (`CH-ROM`, `DIA-MAGH@FR`, `EXP-FR@MA`) ; niches `N01` à `N27` et sous-niches `N01.01` ; lifestyles `L-<facette>-<valeur>`. Un identifiant n'est jamais réutilisé ; une entrée retirée reçoit `deprecated: true` et `replaced_by`.
2. **Langues en BCP 47 avec l'écriture** : `fr-FR`, `fr-CA`, `fr-BE`, `fr-CH`, `ar` (arabe standard), `ary-Arab` et `ary-Latn` (darija marocaine, ISO 639-3 `ary`), `arq` (darja algérienne), `aeb` (tunisien), `kab`, `zgh` (amazighe standard marocain), `wo` (wolof), `ln` (lingala), `sw`, `en`. Le nouchi et le camfranglais n'ont pas de code : `fr-CI-x-nouchi`, `fr-CM-x-camfranglais` (étiquettes privées).
3. **Chaque chiffre est un objet typé** : `value`, `unit`, `metric_type` (par exemple `audience_publicitaire`, `identites_sociales`, `sondage_internautes`, `recensement`, `registre_administratif`), `as_of`, `source_url`, `evidence` (V, S, R, E, H, M). Deux métriques de types différents ne se comparent jamais (règle déjà posée par le dossier Maroc [R]).
4. **Contrôles de plausibilité automatiques** : rejet ou drapeau si une audience dépasse la population (Guadeloupe), si les identités sociales tombent sous 60 % des internautes dans un pays riche (Luxembourg), si une variation annuelle dépasse 30 % sans événement connu (RDC, Mayotte).
5. **Séparer la taxonomie (lente, versionnée) des mesures (rapides, horodatées)**.

### 5.2 Schéma des zones

```yaml
schema_version: 1
as_of: 2026-11-28
zones:
  - id: MA
    type: pays                 # pays | subdivision | sous_zone | diaspora | expatries
    parent: Z-MAGHREB
    labels: {fr: Maroc, en: Morocco, ar: المغرب}
    content_languages:         # langues observées dans le contenu, avec part estimée
      - {code: ary-Arab, share: null, evidence: H}
      - {code: ary-Latn, share: null, evidence: H}
      - {code: fr-MA, share: null, evidence: H}
      - {code: zgh, share: null, evidence: H}
    commerce_language: fr
    metrics:
      - {key: population, value: 38.8e6, metric_type: estimation_onu, as_of: 2026-10, source_url: "https://datareportal.com/reports/digital-2027-morocco", evidence: V}
      - {key: internautes, value: 35.8e6, metric_type: estimation_agregateur, as_of: 2026-10, source_url: "https://datareportal.com/reports/digital-2027-morocco", evidence: V}
      - {key: tiktok_18plus, value: 19.6e6, metric_type: audience_publicitaire, as_of: 2026-10, source_url: "https://datareportal.com/reports/digital-2027-morocco", evidence: V}
      - {key: pib_hab_usd, value: 4672.47, metric_type: comptes_nationaux, as_of: 2025, source_url: "https://api.worldbank.org/v2/country/MAR/indicator/NY.GDP.PCAP.CD", evidence: V}
      - {key: compte_findex, value: 44.39, unit: pct_15plus, metric_type: enquete, as_of: 2024, source_url: "https://api.worldbank.org/v2/country/MAR/indicator/FX.OWN.TOTL.ZS", evidence: V}
    derived: {ipan: 4.3, masse_adressable: 2.4}
    payment_rails: [paiement_livraison, carte_cmi, paypal_reception, cash_plus]   # [R]
    regulatory_profile: MA
    observable_platforms: [youtube_region_MA, youtube_rss, apple_charts_MA, google_play_MA, pinterest_trends_groupe_MA, scraper_tiers_tiktok]   # [R] sources-social
    lag_edges_in: [{from: FR, class: A_C}, {from: US, class: A_F}]
  - id: DIA-MAGH@FR
    type: diaspora
    origin: [MA, DZ, TN]
    residence: FR
    inherits: {languages_from: origin, payment_rails_from: residence, regulation_from: residence}
    metrics:
      - {key: immigres, value: 2.333e6, metric_type: estimation_insee, as_of: 2025, source_url: "https://www.insee.fr/fr/statistiques/2381755", evidence: V}
      - {key: descendants, value: 2.538e6, metric_type: enquete_emploi, as_of: 2025, source_url: "https://www.insee.fr/fr/statistiques/4186761", evidence: V}
```

### 5.3 Schéma des niches

```yaml
niches:
  - id: N05
    slug: nutrition_poids
    level: 1
    labels: {fr: "Nutrition, poids et alimentation santé", en: "Nutrition and weight", ar: "التغذية والوزن", ary-Latn: "rjim w makla sihiya"}
    scope_in: ["perte de poids", "GLP-1", "protéines", "compléments", "régimes"]
    scope_out: ["recettes plaisir -> N08", "séjour sportif -> N10", "salle de sport -> N03"]
    children:
      - {id: N05.01, slug: perte_poids_glp1, flags: [medicament, allegation_sante]}
      - {id: N05.02, slug: proteines_fibres}
      - {id: N05.03, slug: complements, flags: [allegation_sante]}
      - {id: N05.04, slug: regimes_jeune}
      - {id: N05.05, slug: nutrition_sportive}
    keywords_file: keywords/N05.yaml      # voir 5.5
    regulatory: {FR: restreint, BE: restreint, CH: restreint, MA: a_verifier}
    monetization: [affiliation, coaching, application, contenu_sponsorise]
```

### 5.4 Schéma des lifestyles et des cellules

```yaml
facets:
  - {id: LS, label: etape_de_vie, exclusive: true, exhaustive_for: "13+"}
  - {id: CO, label: cohorte, exclusive: true}
  - {id: HA, label: habitat, exclusive: true}
  - {id: WM, label: mode_de_travail, exclusive: false}
  - {id: OM, label: origine_mobilite, exclusive: false}
  - {id: VI, label: valeurs_identite, exclusive: false}
  - {id: PA, label: passion, exclusive: false, derived_from: niche_affinity}
lifestyles:
  - id: L-WM-SOLO
    facet: WM
    labels: {fr: "Freelances et solopreneurs", en: "Freelancers and solopreneurs", ar: "العاملون المستقلون", ary-Latn: "freelance"}
    size:
      - {zone: FR, value: 3.031e6, metric_type: registre_administratif, as_of: 2025-12-31, source_url: "https://www.lejournaldesentreprises.com/article/lurssaf-recense-494-millions-de-travailleurs-independants-fin-2025-2147701", evidence: S}
      - {zone: MA, value: 463383, metric_type: registre_administratif, as_of: 2025-12-31, evidence: R}
    platforms: {FR: [linkedin, youtube, instagram], MA: [linkedin, youtube, facebook_groupes], CA-QC: [linkedin, facebook]}
    detection:
      bio_keywords: {fr: [freelance, indépendant, auto-entrepreneur, consultant, "à mon compte"], en: [freelancer, solopreneur, founder], ary-Latn: [freelance, "khdam m3a rasi"]}
      niche_cooccurrence: [N14, N15, N13]
      min_signals: 2
cells:
  - id: FR.N05.L-LS-ADULTES
    zone: FR
    niche: N05
    lifestyle: L-LS-ADULTES
    prior: {T: 5, C: 5, R: 5, F: 3, evidence: A, set_by: etude_prealable_2026-11-28}
    measured: null             # rempli par l'outil
    gates: {regulatory: restreint, payment: ok}
```

### 5.5 Dictionnaire de détection par niche (amorces à valider)

Les mots-clés sont des **amorces** pour un classifieur multilingue (plongements sémantiques plus règles), pas une liste fermée. Les colonnes arabe et darija sont à faire valider par un locuteur natif et à enrichir à partir d'un corpus réel [H] ; la darija latine suit l'usage « arabizi » (3 = ع, 7 = ح, 9 = ق). Pour l'algérien et le tunisien, prévoir des variantes (par exemple « drahem » pour l'argent) [M].

| Id | Français | Anglais | Arabe standard | Darija (latin) | Darija (arabe) | Plateformes d'observation prioritaires |
|---|---|---|---|---|---|---|
| N01 | skincare, routine soin, sérum, maquillage, parfum, dupe, K-beauty | skincare, makeup, serum, fragrance, dupe, glass skin, grooming | العناية بالبشرة، مكياج، عطر، روتين | routine dyal lwjh, lbachra, makiyaj, krim | روتين ديال الوجه، البشرة، الماكياج | TikTok, Instagram, YouTube ; TikTok Shop (FR, BE) |
| N02 | tenue, haul, friperie, seconde main, mode pudique, abaya, caftan, wax | outfit, OOTD, haul, thrift, modest fashion, streetwear | موضة، أزياء، لباس محتشم، عباية، قفطان | lbas, hwayej, takchita, jellaba, jouteya | لبسة، حوايج، تكشيطة، جلابة، الجوطية | Instagram, TikTok, Pinterest, Vinted |
| N03 | run club, course à pied, salle, musculation, padel, pilates, Hyrox | run club, gym, workout, padel, pilates reformer, hyrox | رياضة، لياقة بدنية، الجري، بادل | salle, sport, padel, jri | الصالة، الرياضة، البادل، الجري | Instagram, Strava, TikTok, YouTube |
| N04 | foot, Ligue 1, CAN, Mondial 2030, Lions de l'Atlas, Fennecs, Lions de la Teranga, Éléphants, Lions indomptables, Léopards | football, soccer, AFCON, World Cup 2030 | كرة القدم، كأس أمم أفريقيا، كأس العالم 2030، أسود الأطلس | lkoura, lmatch, lmontakhab, Wydad, Raja, Botola | الكورة، الماتش، المنتخب، الوداد، الرجاء | YouTube, TikTok, Facebook, X (FR seulement) |
| N05 | perte de poids, rééquilibrage, GLP-1, protéines, fibres, jeûne intermittent | weight loss, GLP-1, protein, fibermaxxing, fasting | تغذية، إنقاص الوزن، رجيم، بروتين، صيام متقطع | rjim, nqes lwazn, makla sihiya | الريجيم، نقص الوزن، ماكلة صحية | TikTok, Instagram, YouTube |
| N06 | santé mentale, anxiété, burn-out, sommeil, méditation, ménopause | mental health, anxiety, burnout, sleep, menopause, self-care | الصحة النفسية، القلق، الاكتئاب، النوم، التأمل | stress, l9ala9, n3as | الستريس، القلق، النعاس | TikTok, Instagram, YouTube, podcasts |
| N07 | maman, grossesse, bébé, allaitement, parentalité, écrans | mom life, pregnancy, toddler, gentle parenting, screen-free | الأمومة، الحمل، الرضيع، تربية الأطفال | drari, wlidat, trbiya, lmama | الدراري، الوليدات، التربية | Instagram, Pinterest, Facebook (groupes), YouTube |
| N08 | recette, cuisine, street food, café de spécialité, matcha, mocktail | recipe, foodtok, street food, matcha, mocktail | طبخ، وصفات، حلويات، مطاعم | chhiwat, tyab, lmakla, 7alawiyat | شهيوات، الطياب، الماكلة، حلويات | YouTube, TikTok, Instagram, Facebook (MA) |
| N09 | déco, avant-après, DIY, bricolage, rangement, jardin | home decor, room makeover, DIY, cleantok, gardening | ديكور، تزيين المنزل، تنظيف، حديقة | dekor dyal dar, tnqia, jnan | ديكور الدار، التنقية، الجنان | Pinterest, Instagram, TikTok, YouTube |
| N10 | voyage, vacances, bons plans, road trip, riad, retour au bled | travel, itinerary, solo travel, workation | سفر، سياحة، عطلة | safar, l3otla, lbled, riad | السفر، العطلة، البلاد | Instagram, TikTok, YouTube, Pinterest |
| N11 | budget, épargne, investir, bourse, ETF, PEA, crypto, finance islamique, tontine | budgeting, saving, investing, ETF, crypto, FIRE | ادخار، استثمار، بورصة، العملات الرقمية، التمويل الإسلامي | flouss, tawfir, dart, crypto | الفلوس، التوفير، دارت | YouTube, TikTok, Reddit (FR, QC), newsletters |
| N12 | immobilier, achat appartement, investissement locatif, colocation, crédit immo | real estate, rental property, house hunting | عقار، شقة للبيع، كراء | chqa, dar, lkra, terrain | شقة، دار للبيع، الكرا | YouTube, Facebook (annonces), Instagram |
| N13 | emploi, CV, entretien, alternance, Parcoursup, reconversion, études à l'étranger | job search, resume, interview, career, study abroad | وظيفة، سيرة ذاتية، مباراة، منحة، الدراسة في الخارج | khdma, concours, stage, CV | الخدمة، المباراة، السطاج | LinkedIn, TikTok, YouTube |
| N14 | entreprendre, micro-entreprise, e-commerce, dropshipping, TikTok Shop, side business | side hustle, entrepreneur, dropshipping, TikTok Shop, creator economy | ريادة الأعمال، مشروع، تجارة إلكترونية، الربح من الإنترنت | machrou3, lbi3 w chra, COD, dropshipping, rb7 mn lantirnit | مشروع، البيع والشرا، الربح من الأنترنيت | YouTube, TikTok, Facebook (groupes), LinkedIn |
| N15 | IA, intelligence artificielle, ChatGPT, prompt, automatisation, no-code | AI, ChatGPT, prompt, AI agent, vibe coding | الذكاء الاصطناعي، تطبيقات | l'IA, ChatGPT, tilifoun, application | الذكاء الاصطناعي، التيليفون | YouTube, LinkedIn, TikTok, X, Apple et Google Play |
| N16 | jeux vidéo, gaming, e-sport, stream, FC 26 | gaming, esports, Twitch, Free Fire, PUBG Mobile | ألعاب الفيديو، الرياضات الإلكترونية | gaming, Free Fire, PUBG, eFootball | الألعاب | YouTube, Twitch, Discord, TikTok |
| N17 | voiture, moto, scooter, électrique, permis, occasion | car, EV, motorbike | سيارات، دراجة نارية، سيارة كهربائية | tomobil, moto, motor, lpermis | الطوموبيل، الموطور، البيرمي | YouTube, Facebook (Marketplace), TikTok |
| N18 | chat, chien, animaux, croquettes | pets, cat, dog, pettok | حيوانات أليفة، قطط، كلاب | mch, mchicha, kelb | المش، المشيشة، الكلب | TikTok, Instagram |
| N19 | mariage, fiançailles, henné, robe de mariée, traiteur, neggafa | wedding, bridal, engagement, wedding planning | عرس، زفاف، خطوبة، حناء | 3ers, neggafa, takchita, l3amariya, lhenna | العرس، النكافة، العمارية، الحنة | Instagram, TikTok, Pinterest, Facebook |
| N20 | Ramadan, prière, Coran, rappel, foi, baptême, astrologie | faith, prayer, Ramadan, Bible, astrology, tarot | رمضان، القرآن، الدعاء، الصلاة، تذكير | rmdan, salat, d3a, lftour | رمضان، الصلاة، الدعاء، الفطور | YouTube, TikTok, Instagram, applis |
| N21 | humour, sketch, série, micro-drama, téléréalité, manga, K-pop | comedy, skit, microdrama, reality TV, anime, fandom | كوميديا، مسلسل، مشاهير | dhk, nokat, mosalsal, lflm | الضحك، النكت، مسلسل | TikTok, YouTube, Instagram, Snapchat (FR) |
| N22 | rap, son, clip, concert, festival, raï, afro | music, rap, afrobeats, concert | موسيقى، أغنية، راب، حفل | lghna, chaabi, gnawa, rap | الغنا، الشعبي، كناوة | YouTube, TikTok, Spotify et Deezer (classements) |
| N23 | apprendre l'anglais, cours, révisions, bac, méthode, formation | learn English, study with me, tutoring, online course | تعلم الإنجليزية، دروس، الباكالوريا، امتحان | t3allam l'anglais, dourous, lbac, l'examen | الدروس، الباك، الامتحان | YouTube, TikTok, WhatsApp (chaînes) |
| N24 | artisanat, fait main, terroir, produits locaux, tapis berbère, argan | handmade, artisan, local products, berber rug | الصناعة التقليدية، منتجات محلية، زربية، أركان | beldi, zerbiya, argan, amlou | بلدي، الزربية، أركان، أملو | Pinterest, Instagram, Etsy, TikTok |
| N25 | célibataire, rencontre, appli de rencontre, couple, amitié, sortir seul | dating, situationship, friendship, solo life | علاقات، صداقة، زواج | lhob, s7ab, zwaj | الحب، الصحاب، الزواج | TikTok, Instagram, applis (classements) |
| N26 | actualité, politique, élection | news, politics | أخبار، سياسة | lakhbar | الأخبار | X (FR), YouTube, Facebook |

Amorces en langues d'Afrique subsaharienne, à valider [M] : wolof « xaalis » (argent), « jaay » (vendre), « liggéey » (travail), « sey » (mariage) ; lingala « mbongo » (argent), « mosala » (travail), « libala » (mariage) ; camfranglais « le mboa » (le pays, le Cameroun).

### 5.6 Mesures que l'outil devra produire faute de source

| Mesure manquante | Proxy proposé | Plateforme ou source |
|---|---|---|
| Part des écritures de la darija | échantillon de commentaires YouTube `regionCode=MA` classés par écriture | YouTube Data API, RSS |
| Taille d'un lifestyle par pays | part des comptes créateurs d'un panel dont la bio porte les amorces du lifestyle ; part des publications d'une niche qui co-occurrent avec ces amorces | panels de créateurs suivis par RSS, scrapers tiers |
| Engagement d'une niche par pays | vues médianes par niche sur un panel fixe de chaînes et de comptes | YouTube RSS (vues), scrapers TikTok et Instagram |
| Intérêt lifestyle par pays | tendances Pinterest par région (FR, CA, NL+BE+LU, DE+AT+CH, groupe incluant MA) | Pinterest Trends, sans clé [R] |
| Offre applicative par pays | classements Apple et Google Play par pays et catégorie | flux Apple sans clé [R] |
| Publicité active par niche en UE | Meta Ad Library et TikTok Commercial Content API (UE, CH) | API DSA [R] |

---

## 6. Priorisation des cellules de la matrice

### 6.1 Méthode

**Étape 1, filtre bloquant.** Avant tout calcul, une table `niche x zone -> statut` (autorisé, restreint, interdit, en changement) exclut les cellules interdites (exemple : publicité pour l'ultra fast-fashion en France à partir du 1er janvier 2027 ; paiements internationaux impossibles pour un modèle donné en Algérie) [R]. Un statut « restreint » ne bloque pas ; il abaisse la note de faisabilité.

**Étape 2, quatre axes notés de 1 à 5.**

| Axe | 1 | 2 | 3 | 4 | 5 | Mesure automatique visée |
|---|---|---|---|---|---|---|
| T, taille monétisable | moins de 0,3 M de personnes, ou IPAN inférieur à 2 | 0,3 à 1 M | 1 à 3 M | 3 à 10 M, ou 1 à 3 M avec IPAN supérieur à 100 | plus de 10 M, ou plus de 3 M avec IPAN supérieur à 100 | population x pénétration de la plateforme x part du segment x IPAN |
| C, croissance | recul | 0 à 3 % par an | 3 à 10 % | 10 à 20 % | plus de 20 %, ou ouverture d'un canal | variation sur 12 mois des audiences, du volume de mots-clés, des ventes |
| R, retard exploitable sur les USA | bloqué, ou aucune avance américaine | local déjà mainstream, ou flux inverse | local en accélération | local émergent | US en accélération ou mainstream, local absent, friction faible | stade US moins stade local, corrigé par la classe de friction (A à F du dossier France [R]) |
| F, faisabilité pour une petite équipe | bloquée | lourde : pas d'encaissement international, licence | notable : paiement à la livraison, mobile money, allégations de santé | légère : rail local, règle modérée | produit numérique, Stripe ou Paddle, français, pas de régulation | rails de paiement, table réglementaire, coût de langue, observabilité de la cellule |

**Étape 3, score.** S = 100 x (T/5)^0,30 x (C/5)^0,20 x (R/5)^0,25 x (F/5)^0,25.

- Moyenne géométrique pondérée : une cellule très faible sur un axe ne peut pas être sauvée par sa taille.
- T pèse 0,30 parce que c'est l'axe le mieux mesuré ; R et F pèsent 0,25 parce qu'ils portent la thèse d'arbitrage et la contrainte « petite équipe » ; C pèse 0,20 parce que les croissances publiées sont bruitées (DataReportal signale des corrections de source).

**Étape 4, niveau de preuve, affiché et non multiplié.**

| Niveau | Définition | Conséquence |
|---|---|---|
| A | faits primaires des deux côtés (USA et zone cible) | peut déclencher une proposition d'initiative |
| B | fait primaire d'un côté, secondaire de l'autre | proposition possible avec une étape de validation |
| C | surtout hypothèses ou sources secondaires | mise en file de validation, pas d'initiative directe |

**Étape 5, recalcul.** Les notes a priori ci-dessous sont des valeurs de départ. Dès que l'outil mesure un axe (exemple : croissance mesurée d'un mot-clé), la mesure remplace la note, et la cellule garde la trace de la provenance de chaque note.

### 6.2 Application : les 20 cellules les plus prometteuses a priori

Calcul par le script `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/scripts/seg_score.py` sur 33 cellules candidates ; scores et justification complète dans le fichier JSON.

| Rang | Cellule | Zone | Niche | Lifestyle | T | C | R | F | Score | Preuve | Flux | Justification courte |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | FR.N05.L-LS-ADULTES | France | Nutrition (accompagnement GLP-1) | Adultes 35-59 | 5 | 5 | 5 | 3 | 88,0 | A | USA vers FR | remboursement à 65 % depuis le 15/06/2026, +74 % en volume ; 11 % des adultes US sous GLP-1 ; allégations encadrées |
| 2 | FR.N15.L-WM-SOLO | France | IA et outils | Freelances et solopreneurs | 5 | 4 | 3 | 5 | 84,2 | A | USA vers FR | 3,031 M d'auto-entrepreneurs ; IA générative 48 % (33 % un an avant) |
| 3 | MA.N10.L-OM-EXPAT | Maroc | Voyage et tourisme réceptif | Expatriés et visiteurs européens | 4 | 5 | 4 | 4 | 83,7 | B | USA vers FR vers MA | recettes voyages +21 % ; séjours sportifs ; clients payant en euros |
| 4 | FR.N03.L-LS-JEUNES_ACTIFS | France | Sport pratiqué | Jeunes actifs | 5 | 5 | 3 | 4 | 83,2 | B | USA et Europe | 13,2 M de coureurs ; Hyrox plus de 22 000 participants ; pilates reformer naissant |
| 5 | FR.N25.L-LS-JEUNES_ACTIFS | France | Relations et amitié | Jeunes actifs, vie en solo | 4 | 4 | 4 | 4 | 80,0 | B | USA vers FR | fatigue des applis de rencontre ; dîners entre inconnus |
| 6 | FR.N01.L-LS-GENZ | France | Beauté | Gen Z urbaine | 5 | 4 | 3 | 4 | 79,6 | B | Asie et USA vers FR | K-beauty 2.0, grooming masculin, dupes ; affiliation TikTok Shop |
| 7 | QC.N15.L-WM-SOLO | Québec | IA et outils | Freelances et solopreneurs | 3 | 4 | 4 | 5 | 77,6 | C | USA vers QC | offre anglaise abondante, version française en retard [H] |
| 8 | FR.N14.L-VI-ECO | France | Entrepreneuriat (revente) | Éco-responsables | 5 | 4 | 2 | 5 | 76,1 | A | FR vers USA (inverse) | Vinted 1,1 Md€ de CA ; France en avance |
| 9 | BE.N14.L-WM-SOLO | Belgique francophone | Entrepreneuriat (TikTok Shop) | Vendeurs et solopreneurs | 2 | 5 | 5 | 5 | 76,0 | A | FR vers BE | ouverture le 15/06/2026, 14,5 mois après la France |
| 10 | FR.N20.L-VI-HALAL | France | Religion et spiritualité | Lifestyle halal et pratiquants | 4 | 3 | 4 | 4 | 75,5 | B | USA vers FR | environ 10 % des 18-59 ans ; applis de prière US en croissance |
| 11 | FR.N07.L-LS-JEUNES_PARENTS | France | Parentalité | Jeunes parents | 4 | 3 | 4 | 4 | 75,5 | B | USA vers FR | enfance sans smartphone ; 643 905 naissances |
| 12 | DIA.N12.L-OM-DIASPORA | Diaspora maghrébine en France | Immobilier | Diaspora | 5 | 3 | 3 | 4 | 75,2 | B | USA vers diaspora | 4,87 M de personnes ; transferts 7,5 % du PIB marocain |
| 13 | FR.N23.L-LS-SENIORS | France | Éducation (numérique et IA) | Seniors connectés | 5 | 3 | 3 | 4 | 75,2 | B | interne | 15 % des 70+ utilisent l'IA contre 85 % des 18-24 ans |
| 14 | FR.N09.L-LS-JEUNES_ACTIFS | France | Maison et déco | Jeunes actifs | 5 | 2 | 4 | 4 | 74,5 | C | USA et MA vers FR | déco afro-bohème et berbère (Pinterest Predicts 2026) |
| 15 | FR.N21.L-LS-JEUNES_ACTIFS | France | Divertissement (micro-dramas) | Jeunes actifs (femmes 25-44) | 4 | 4 | 4 | 3 | 74,4 | B | Asie et USA vers FR | mainstream US, émergent FR |
| 16 | MA.N24.EXPORT | Maroc (export) | Terroir et artisanat | Export et diaspora | 4 | 4 | 4 | 3 | 74,4 | C | MA vers FR et USA (inverse) | offre d'origine ; logistique et paiement à résoudre |
| 17 | FR.N13.L-LS-ETUDIANTS | France | Carrière et études | Étudiants | 4 | 3 | 3 | 5 | 74,3 | A | interne | 3,05 M d'étudiants ; 85 % des 18-24 ans utilisent l'IA |
| 18 | MA.N14.L-WM-DEBROUILLE | Maroc | Entrepreneuriat (paiement à la livraison) | Économie de la débrouille | 3 | 4 | 4 | 4 | 73,4 | B | USA vers MA | 84,1 % de paiement à la livraison, 20 à 40 % de refus ; créatifs en darija par IA |
| 19 | DIA.N19.L-OM-DIASPORA | Diaspora maghrébine | Mariage et événementiel | Diaspora et jeunes actifs marocains | 3 | 3 | 5 | 4 | 73,3 | C | USA vers diaspora et MA | planification assistée par IA en accélération aux USA ; marché peu outillé [H] |
| 20 | SN.N23.L-LS-ETUDIANTS | Sénégal | Éducation et langues | Étudiants et lycéens | 3 | 5 | 4 | 3 | 71,4 | C | USA vers SN | âge médian 19,8 ; identités sociales +18,3 % ; mobile money |

Cellules évaluées mais hors du top 20 (score) : diaspora d'Afrique subsaharienne x services à la famille (70,3, B) ; France x cuisine et boissons x Gen Z (69,9, B) ; France x finance personnelle x jeunes actifs (69,9, C) ; Québec et Suisse romande x finance personnelle (69,3, C) ; Maroc x sport pratiqué x jeunes actifs (68,3, B) ; Maroc x cuisine et boissons x Gen Z (68,3, C) ; Côte d'Ivoire x entrepreneuriat x débrouille (68,3, C) ; France x bien-être x étudiants (67,3, B) ; Maroc x carrière x jeunes actifs (63,6, B) ; Maroc x mode modeste x halal (62,6, B) ; RDC x musique x Gen Z (60,0, B) ; Algérie x jeu vidéo x Gen Z (52,6, B).

### 6.3 Ce que le classement dit, et ses limites

- **Biais vers la France, assumé et explicable** : l'axe T intègre le pouvoir d'achat (IPAN). Une cellule marocaine grand public paie un IPAN de 4,3. Les cellules marocaines qui entrent dans le top 20 sont celles où le client paie en euros (tourisme), en B2B (commerçants) ou à l'export. C'est cohérent avec le dossier Maroc, qui classe « diaspora et export de services, puis B2B local, puis grand public local » [R].
- **Deux cellules sont des flux inverses** (Vinted, artisanat marocain) : l'outil doit les signaler comme opportunités d'export, pas comme arbitrage USA vers francophonie.
- **Stabilité** : 19 des 20 cellules restent dans le top 20 avec des poids égaux, et aussi avec une faisabilité pondérée à 40 % [E, script]. Mais l'écart entre le 1er et le 20e n'est que de 17 points : une note changée d'un cran déplace une cellule de 5 à 10 rangs. Les notes d'entrée comptent plus que les poids.
- **Cinq cellules du top 20 sont au niveau C** (Québec x IA, France x déco, Maroc x artisanat à l'export, diaspora x mariage, Sénégal x éducation) : elles alimentent la file de validation, pas les initiatives. Cinq sont au niveau A (rangs 1, 2, 8, 9 et 17) et peuvent déclencher une proposition d'initiative.
- **Aucune cellule d'Algérie, de Tunisie, du Cameroun ou de RDC n'entre** : la faisabilité (paiement, change) et le pouvoir d'achat les écartent a priori, malgré la croissance la plus forte. Ce sont des cellules à surveiller pour l'audience (contenu financé par des marques internationales), pas à monétiser directement.

---

## 7. Implications pour l'outil

1. **Livrer la taxonomie comme fichiers de configuration versionnés** : `zones.yaml`, `niches.yaml`, `lifestyles.yaml`, `keywords/<niche>.<langue>.yaml`, `regulatory.yaml`, `cells_priors.yaml`. Identifiants stables (section 5.1), jamais réutilisés.
2. **Modéliser les lifestyles en facettes** (une exclusive, six multi-étiquettes) et limiter les cellules permanentes à zone x niche x une valeur de facette. Ordre de grandeur : 28 zones, sous-zones et zones virtuelles x 25 niches x 36 valeurs de facettes, soit environ 25 000 cellules théoriques [E] ; ne calculer que celles qui ont une mesure ou une note a priori, après le filtre réglementaire.
3. **Typer chaque chiffre et contrôler sa plausibilité** (audience supérieure à la population, chute brutale, changement d'analyste comme le passage de Kepios à « Manochi »).
4. **Traiter les diasporas comme des zones virtuelles (origine, résidence)** qui héritent de la langue de l'origine et des rails de paiement de la résidence ; ne jamais les additionner au pays d'origine.
5. **Calculer l'IPAN et la masse adressable par zone** et les intégrer à l'axe T ; garder aussi la PPA pour les biens locaux.
6. **Construire un détecteur multilingue et multi-écritures** : normalisation de l'arabizi (3, 7, 9), gestion de l'alternance français-darija, classifieur par plongements amorcé par les mots-clés de la section 5.5, mots-clés négatifs, validation humaine des listes arabe et darija.
7. **Associer à chaque cellule des « plateformes observables », pas seulement des plateformes dominantes** : au Maroc et en Afrique subsaharienne, la plateforme dominante (TikTok, Facebook, WhatsApp) est souvent la moins observable [R]. La matrice zone x plateforme du dossier sources sert de table de capteurs.
8. **Ajouter des arêtes de retard internes à la francophonie** (France vers Belgique, France vers Suisse, France vers Québec, France vers Maroc, Maroc vers diaspora) en plus de l'arête USA vers chaque zone ; la Belgique et TikTok Shop donnent déjà un point d'étalonnage (14,5 mois).
9. **Implémenter le score en moyenne géométrique avec filtre bloquant et niveau de preuve séparé** ; recalculer chaque semaine ; afficher pour chaque note son origine (a priori, mesurée, éditée).
10. **Générer une file de validation** à partir des cellules C et des cases vides du tableau 3.3 : c'est le programme de mesure de la première version de l'outil.
11. **Réserver les sources payantes de segmentation (GWI) au calibrage** des tailles de lifestyles dans 3 ou 4 pays, pas à l'alimentation continue.

---

## 8. Questions ouvertes

1. Quelle est la part de la darija écrite en graphie arabe et en graphie latine, par plateforme ? Aucune mesure trouvée.
2. Comment estimer l'audience TikTok au Sénégal, en Côte d'Ivoire et au Cameroun, que les outils publicitaires ne publient pas ?
3. Quelle est la part exacte de francophones au Québec (Statistique Canada inaccessible), en Belgique (4,6 M est une estimation) et en Suisse romande en 2025 ?
4. Effectifs étudiants, naissances, freelances et seniors connectés au Maroc, en Algérie, en Tunisie et en Afrique subsaharienne : où trouver des séries fiables et récentes ?
5. Faut-il acheter un accès GWI pour calibrer les tailles de lifestyles, et sur quels pays ? Couvre-t-il le Sénégal, la Côte d'Ivoire, le Cameroun et la RDC ?
6. Les dossiers de l'étude divergent sur la loi française relative aux réseaux sociaux avant 15 ans : article 1er censuré le 14 août 2026 selon le dossier France-Europe, loi promulguée le 24 août 2026 selon le dossier tendances US. La portée exacte décide si la valeur `L-LS-ADO` est ciblable en France.
7. La série du ministère des Sports par âge (84 % des 15-29 ans) est incompatible avec la moyenne de 61 % : quelle série retenir ?
8. Les taux d'internautes de 52 à 67 % dans les DROM sont-ils réels ou un artefact de DataReportal ?
9. Quel est le poids réel des retraités français au Maroc (le chiffre de 61 000 n'a ni date ni méthode) ?
10. Faut-il traiter les diasporas maghrébines d'Espagne, d'Italie et des Pays-Bas (contenu en darija mais pays non francophones) dans le périmètre ?
11. Points non recherchés faute de budget : mobile money (Wave, Orange Money), « soft life » francophone, frugalisme, luxe aspirationnel, néo-ruraux après 2023, nomades numériques au Maroc. À relancer dans un tour ultérieur.
12. Les pondérations du score (0,30 / 0,20 / 0,25 / 0,25) doivent être étalonnées sur les cas historiques d'arrivée de tendances (16 cas du dossier France, cas marocains) : un rétro-test est nécessaire avant de figer la formule.

---

## 9. Sources

Données lues dans cette session [V] :

- DataReportal, Digital 2027 : https://datareportal.com/reports/digital-2027-france ; -belgium ; -switzerland ; -luxembourg ; -canada ; -morocco ; -algeria ; -tunisia ; -senegal ; -cote-divoire ; -cameroon ; -democratic-republic-of-the-congo ; -reunion ; -guadeloupe ; -martinique ; -french-guiana ; -mayotte ; -new-caledonia ; -french-polynesia (publiées les 4 et 5 novembre 2026).
- Banque mondiale, API v2 : indicateurs NY.GDP.PCAP.CD, NY.GDP.PCAP.PP.CD, FX.OWN.TOTL.ZS, BX.TRF.PWKR.CD.DT, BX.TRF.PWKR.DT.GD.ZS (mise à jour du 2026-11-11), exemple https://api.worldbank.org/v2/country/MAR/indicator/NY.GDP.PCAP.CD?format=json.
- OIF, synthèse 2026 : https://www.francophonie.org/sites/default/files/2026-04/Synthese_rapport_Langue_francaise_dans_le_monde_2026.pdf.
- ATN, NETendances 2025 : https://transformation-numerique.ulaval.ca/wp-content/uploads/2026/02/netendances25-reseaux-sociaux-divertissement.pdf.
- GSMA, The Mobile Economy Africa 2026 : https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/wp-content/uploads/2026/06/The-Mobile-Economy-Africa-2026.pdf (28 % de la population africaine connectée à l'Internet mobile, 63 % couverts mais non connectés, 9 % sans couverture, données 2024).
- Insee : https://www.insee.fr/fr/statistiques/2381755 ; https://www.insee.fr/fr/statistiques/4186761 ; https://www.insee.fr/fr/statistiques/6793296.
- CRÉDOC, Baromètre du numérique 2026 : https://www.credoc.fr/download/pdf/Sou/Sou2026-5064.pdf.
- Ministère des Sports : https://www.sports.gouv.fr/sport-en-france-une-progression-continue-depuis-2018-boostee-par-les-jeux-de-paris-2024-10055 (15 janvier 2026).
- SELL : https://www.sell.fr/sites/default/files/essentiel-jeu-video/ejv_avril_2026_final_.pdf ; https://www.sell.fr/sites/default/files/essentiel-jeu-video/ejv_septembre_2025_def_0.pdf.
- DinarStandard : https://www.dinarstandard.com/insights/state-of-the-global-islamic-economy-report-2025-26.
- GWI : https://www.gwi.com/reports/generation-z (page d'accroche, 2026).
- Ipsos : https://www.ipsos.com/fr-fr/node/1025321 (21 juin 2024).
- Hespress : https://fr.hespress.com/475547-elections-consulaires-un-scrutin-discret-aux-enjeux-cruciaux-pour-les-francais-du-maroc.html.
- Le360 (HCP, informel) : https://fr.le360.ma/economie/secteur-informel-le-diagnostic-detaille-du-hcp_45XPLJ5C4VGBDHERYSMN3CZLPA/.

Sources secondaires ou résumés de recherche [S] :

- Insee, bilan démographique 2025 : https://www.insee.fr/fr/statistiques/8721209 ; https://www.insee.fr/fr/statistiques/9000195.
- SIES, effectifs 2025-2026 : https://www.enseignementsup-recherche.gouv.fr/fr/les-effectifs-etudiants-dans-l-enseignement-superieur-en-2025-2026-103242.
- URSSAF via Le Journal des Entreprises : https://www.lejournaldesentreprises.com/article/lurssaf-recense-494-millions-de-travailleurs-independants-fin-2025-2147701.
- ISQ : https://statistique.quebec.ca/en/fichier/panorama-des-regions-du-quebec-2026-demographie.pdf.
- ATN, IA et santé au Québec (communiqué du 11 juin 2026) : https://salledepresse.ulaval.ca/2026/06/11/le-quart-des-internautes-du-quebec-ont-deja-demande-conseil-a-lia-au-sujet-de-leur-sante-physique-ou-mentale-f8bb3486-f0d2-4a50-8d2a-7be8bd6d39da.
- Ifop et TeO2 (religion) via résumés : https://www.insee.fr/fr/statistiques/6793308.
- MRE : https://fr.le360.ma/societe/marhaba-2025-plus-de-46-millions-de-mre-accueillis-en-hausse-de-11_LYHDQEKMYZFJBCCRFQDNJBKK5I/ ; https://www.afrik.com/maroc-mre-diaspora-aucun-siege-reserve-legislatives-23-septembre-2026.
- Français au Maroc : https://fr.le360.ma/politique/francais-du-maroc-quand-la-diaspora-est-appelee-a-donner-de-la-voix_FA7JUPRWBZHMDJ7E5UA2S2WIXM/ ; https://www.bladi.net/retraite-maroc-francais-saute,119708.html.
- OIT et CEA (informel) : https://afrique.le360.ma/economie/en-afrique-lemploi-informel-est-le-plus-eleve-au-monde-le-classement-des-sous-regions-et-ce-quil_2H7YLONBJRG6DENCSJOD4JHW4U/ ; https://afrique.le360.ma/economie/economie-informelle-en-afrique-83-des-emplois-pour-un-manque-a-gagner-fiscal-durable_Q3VSH5HI3ZCZNHJA5MJXMGW6RE/.
- POPSU (exode urbain) : https://www.maire-info.com/ruralite-l'exode-urbain-post-covid-n'est-pas-celui-qu'on-croit-article2-27223.
- ObSoCo et ADEME (sobriété) : https://www.lsa-conso.fr/consommation-en-2025-les-francais-ont-installe-la-sobriete-dans-leur-quotidien,464106.
- Nomades numériques au Maroc : https://www.expat.com/en/guide/africa/morocco/16230-become-a-digital-nomad-in-morocco.html.
- Wolof au Sénégal : https://seneplus.com/node/202299.

Dossiers de l'étude repris [R] : `market-france-europe.md`, `market-maroc-maghreb.md`, `trends-us-conso.md`, `trends-us-now.md`, `sources-social.md` (même répertoire), avec leurs sources propres.

---

## Contre-verification

Contre-vérification indépendante du 28 novembre 2026. Sources primaires relues par téléchargement direct (fichiers dans `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/cv_seg_dl/`), score rejoué par script (`/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/cv_seg_run/out.json`), IPAN recalculé (`/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/cv_seg_wb.py`). Le budget de recherche web partagé était épuisé dès ma première requête : je n'ai lu que des URL primaires connues ; les points non relus sont listés à la fin.

Verdicts : confirmed (source primaire relue), corrected (valeur correcte et source données), refuted, unverifiable.

### Verdicts

| # | Affirmation | Verdict | Ce que dit la source primaire |
|---|---|---|---|
| 1 | Parts de francophones OIF ; 396 M dus surtout à la méthode 2 | confirmed, avec réserve | Synthèse OIF 2026, p. 34 : RDC 60,1 % (67 758 milliers), Maroc 47,8 % (18 664), Côte d'Ivoire 52,2 % (17 069), Sénégal 45,2 % (8 563) ; texte : 42 % en Algérie, 47 % au Cameroun, 63 % en Tunisie ; six pays (RDC, Maroc, Madagascar, Côte d'Ivoire, Sénégal, Bénin) de 106,5 M à 132,5 M. Réserve : l'OIF indique que la méthode 1 donne déjà **348 M** en 2025. Sur la hausse de 75 M depuis 2022, environ 48 M (64 %) viennent de la méthode 2 et 27 M de la méthode 1. Les taux par pays sont des taux de **méthode 2**, qui comptent les enfants de 6 à 9 ans : ce n'est pas une « part réelle » pour des contenus d'adultes. Si l'on retire la colonne des 6-9 ans du tableau OIF (mon calcul), le Maroc tombe à environ 16,0 M (41 %), la RDC à 61,3 M (54 %), la Côte d'Ivoire à 13,5 M (41 %) et le Sénégal à 6,7 M (35 %). |
| 2 | IPAN et masse adressable (Canada 68 % de la France, Maroc 2,4 %) | corrected | API Banque mondiale (lastupdated 2026-11-11), recalcul identique : FR 100, BE 122,8, CH 232,5, CA 112,8, MA 4,3, DZ 4,4, SN 3,1, CD 0,7 ; masse CA 68,1, MA 2,4, mais **CD 0,2** (et non 0,3). Correction de fond : la masse compte tous les internautes, quelle que soit leur langue. Pondérée par la part francophone, elle donne **Québec environ 15** (9,05 M x 95,2 % d'internautes) et non Canada 68, Belgique francophone environ 9 (40 %) et Suisse romande environ 7,5 (23 %) [E]. |
| 3 | Mix de plateformes (TikTok DZ 93,6 %, TN 79,2 %, MA 72,0 %, FR 45,7 %, CH 36,5 % ; RDC TikTok 13,8 M contre Facebook 9,35 M ; Québec Facebook 76 %, TikTok 25 %) | confirmed, avec réserve | Pages DataReportal Digital 2027 relues : tous les chiffres sont exacts. NETendances 2025 : Facebook 76 %, TikTok 25 % (base n = 989). Réserve : ces chiffres comparent des **audiences publicitaires** (DataReportal) à de l'**usage déclaré** (sondage québécois). Au Canada, l'audience publicitaire TikTok vaut 54,1 % des adultes, alors que 25 % des internautes adultes québécois déclarent utiliser TikTok. L'audience publicitaire est une borne haute, pas un nombre d'utilisateurs. En Algérie, 93,6 % des adultes sur TikTok alors que 85,2 % de la population utilise Internet : ce chiffre n'est pas plausible en utilisateurs uniques. |
| 4 | Croissance des identités sociales (RDC +32,5 %, SN +18,3 %, DZ +7,2 %, BE +6,4 %, FR +3,9 %, MA +0,7 %, TN -0,8 %) ; pénétration RDC 19,7 %, CI 41,4 %, CM 46,3 %, SN 62,3 % | corrected | Les valeurs publiées sont exactes, mais ce ne sont pas des croissances d'audience. Sur chaque page, le total des « identités sociales » est égal à l'audience publicitaire de **la seule plus grande plateforme** : YouTube en France, au Maroc, en Tunisie et **au Sénégal** (6,41 M ; le dossier écrit « Facebook », or Facebook n'y a que 3,45 M, en baisse de 4,2 %), TikTok en Algérie et en RDC, Facebook en Côte d'Ivoire et au Cameroun. La plateforme de référence change d'une année à l'autre. En Algérie, 27,4 M en 2025 correspondent à Facebook et 29,4 M en 2026 à TikTok, dont l'audience publicitaire a crû de 18,8 %. Au Maroc, +0,7 % alors que YouTube fait +6,0 % et TikTok +17,2 %. En Tunisie, -0,8 % pour YouTube alors que TikTok fait +18,5 %. La « stagnation » du Maghreb est donc un artefact. Les taux de pénétration sont confirmés. |
| 5 | Modèle à facettes : 1 facette exclusive et 6 multi-étiquettes ; GWI « Does Gen Z really exist? » ; 41 % des 12-28 ans français | corrected | GWI : titre « Gen Z 2026 Report: Does Gen Z Really Exist? » et phrase « a distinct audience a brand can build around » confirmés. Ipsos (page du 21 juin 2024, modifiée le 27 août 2025) : « seulement 41 % des 12-28 ans s'identifient à ce que représente la notion de Generation Z », **sans préciser de pays**. La phrase suivante dit explicitement « en France » pour les 56 % de stress : l'attribution des 41 % à la France n'est pas étayée. Le tableau 4.2 et le YAML 5.4 du dossier déclarent **trois** facettes exclusives (LS, CO, HA) et quatre multi-étiquettes (WM, OM, VI, PA), et non « une plus six ». |
| 6 | Diaspora en France 2025 : Maghreb 2,333 M + 2,538 M ; reste de l'Afrique 1,590 M + 1,341 M ; transferts | confirmed, avec réserve | Insee, tableaux 2381755 (immigrés, 2025 provisoire : Maghreb 2 333 milliers, dont Algérie 1 008 et Maroc-Tunisie 1 325 ; autres pays d'Afrique 1 590) et 4186761 (descendants 2025 : Maghreb 2 538, autres pays d'Afrique 1 341). Banque mondiale : Maroc 13,66 Md$ (7,49 % du PIB, 2025), Tunisie 3,88 Md$ (6,74 %), Sénégal 10,64 % (2023). Réserves : rupture de série en 2024 ; champs différents (immigrés : France entière, recensement et estimations ; descendants : France hors Mayotte, logements ordinaires, enquête Emploi), donc la somme de 4,87 M mélange deux sources. « Segment solvable le plus important » est un jugement, pas une mesure. |
| 7 | Auto-entrepreneurs 3,031 M (+4,5 %), dont 2,18 M avec CA ; IA générative 48 % (33 %), 85 % des 18-24 ans, 15 % des 70 ans et plus | corrected (partiel) | Open data URSSAF (jeu `auto-entrepreneurs-par-secteur-dactivite`, mis à jour le 2026-07-24) : **3 031 447** administrativement actifs au 31/12/2025, contre 2 901 518 un an plus tôt (+4,5 %), confirmé. Mais **1 660 015 seulement sont économiquement actifs** (CA positif au T4 2025). Le chiffre annuel de 2,18 M n'a pas été relu. CRÉDOC (synthèse de 4 pages) : 48 % en 2025, 33 % en 2024, 85 % des 18-24 ans, confirmés ; population de 12 ans et plus ; terrain du 5 au 21 juin 2025, soit 17 mois d'ancienneté. Le chiffre de **15 % des 70 ans et plus ne figure pas** dans la synthèse ; elle donne 17 % d'usage quotidien chez les utilisateurs de plus de 60 ans : unverifiable. |
| 8 | 643 905 naissances en 2025 ; France 69,1 M | corrected | Insee, bilan démographique 2025 (13/01/2026) et tableau `1_Naissances_tnat.xlsx` : **645 000 naissances en 2025** (provisoire), 611 000 en métropole ; 69,1 M d'habitants au 1er janvier 2026 confirmés ; 22 % de 65 ans et plus. Le chiffre de 643 905 n'apparaît pas dans la source citée. |
| 9 | Anomalies : Luxembourg 44,1 % ; Guadeloupe 398 000 adultes TikTok pour 372 000 habitants ; France 66,8 M contre 69,1 M ; « Manochi » à la place de Kepios | corrected | Luxembourg 44,1 % pour 99,0 % d'internautes : confirmé. Guadeloupe : 398 000 utilisateurs TikTok de 18 ans et plus pour 372 000 habitants (133 % des adultes, 171,7 % des internautes) : confirmé. **France : ce n'est pas une anomalie.** L'Insee écrit : « 69,1 millions d'habitants : 66,8 millions en France métropolitaine et 2,3 millions dans les départements d'outre-mer ». La « France » de DataReportal et de l'ONU est la métropole, et les DROM ont leurs propres pages. Manochi : l'analyse est bien attribuée à « Manochi », mais les pages portent toujours « © Kepios », avec la publicité Kepios. L'éditeur n'a pas changé ; une rupture de méthode reste possible mais n'est pas démontrée. |
| 10 | Darija 91,9 % ; français lu et écrit par 57,7 % des alphabétisés de 10 ans et plus | confirmed | HCP, RGPH 2024, note sur les principaux résultats (décembre 2024), p. 12-13 : darija utilisée par 91,9 % (96,3 % en ville, 84,5 % à la campagne), amazigh 24,8 %, français 57,7 % des alphabétisés de 10 ans et plus (64,3 % en ville, 42,1 % à la campagne), anglais 20,5 %. Le HCP ne mesure pas l'écriture (arabe ou latine) : la partie sur l'arabizi vient du dossier, pas du HCP. L'absence de mesure de la part de chaque écriture n'est pas vérifiable. |
| 11 | Score a priori : top 5, 12 cellules sur 20 en France, 5 A, 10 B, 5 C ; stabilité 19/20 ; « une note changée d'un cran déplace une cellule de 5 à 10 rangs » | corrected | Script rejoué : résultats identiques (88,0 à 71,4 ; 12 FR, 3 MA, 2 diaspora, 1 BE, 1 QC, 1 SN ; 5 A, 10 B, 5 C ; 20/20 avec des poids égaux, 19/20 avec F = 0,40). Mais la sensibilité est sous-estimée : sur les 20 premières cellules, une note changée d'un cran déplace la cellule de **9 rangs en médiane et jusqu'à 22 rangs** (BE.N14 avec T de 2 à 1 ; FR.N14 avec R de 2 à 1 : 21 rangs). Les entrées sont des notes de l'auteur. Les identifiants des cellules ne suivent pas le schéma du dossier : `FR.N01.L-LS-GENZ` met une valeur de cohorte sous le préfixe LS et croise deux facettes ; `DIA.N12` au lieu de `DIA-MAGH@FR` ; `QC` au lieu de `CA-QC` ; `MA.N24.EXPORT` n'a pas de lifestyle. |
| 12 | TikTok Shop : Belgique le 15 juin 2026, 14,5 mois après la France (31 mars 2025) ; R = 5, F = 5 | confirmed, avec réserve | Newsroom TikTok (28 mai 2026) : « From 15 June, TikTok Shop will be available to shoppers and retailers in Austria, Belgium, the Netherlands, and Poland, joining existing markets in France… ». La date française du 31 mars 2025 vient d'une source secondaire (SCMP, via le dossier France). Elle concorde avec la mention par TikTok d'un lancement dans l'UE « in late 2024 and early 2025 », mais la source primaire n'a pas été relue. Réserves : R et F sont des notes de l'auteur. F = 5 contredit l'échelle du dossier (F5 = produit numérique, Stripe, pas de régulation), alors qu'un vendeur TikTok Shop vend des biens physiques sous DSA et droit de la consommation. Un calendrier de déploiement d'une plateforme n'est pas un retard de diffusion de tendance. |
| 13 | Québec : 94 % sur les réseaux sociaux, +51 min par jour, Instagram 62 % et TikTok 49 % chez les 18-34 ans, 80 % de joueurs | confirmed | NETendances 2025 (PDF relu) : 94 %, 89 % chaque jour, 3 h 41 par jour (+51 min), Instagram 62 % et TikTok 49 % chez les 18-34 ans, Instagram 71 % chez les 18-24 ans, 80 % jouent à des jeux vidéo ou mobiles. Population ISQ (9,05 M, 21,7 % de 65 ans et plus) non relue. |

### Autres constats sur la taxonomie (test réel)

- **129 sous-niches** comptées dans le tableau 3.2 (N01 à N25) : l'ordre de grandeur « environ 130 » est confirmé.
- **La liste n'est pas strictement MECE**. Recouvrements détectés par script : « crédit » (N11) et « crédit immobilier » (N12) ; « seconde main et vintage » (N02) et « revente de seconde main » (N14) ; « grossesse et naissance » (N07) et « fêtes religieuses et naissance » (N19) ; « cuisine du Ramadan » (N08) et « Ramadan » (N20) ; « retour au pays (diaspora) » (N10) et « immobilier de la diaspora » (N12). L'IA est aussi dispersée entre N06 (IA confident), N15, N22 (musique générée par IA) et N23 (numérique et IA pour tous). La règle « objet de la dépense principale » ne tranche pas tous ces cas ; il faut une table de précédence explicite et des tests de classement.
- **La facette « étape de vie » n'est pas exclusive sans règle de précédence** : un étudiant de 22 ans sans enfant est aussi JEUNE_ACTIF (18-34 sans enfant) ; un parent de 40 ans avec un enfant de 3 ans est JEUNE_PARENT et sort d'ADULTES ; un senior avec un jeune enfant relève de deux valeurs.
- **La cellule n° 3 (`MA.N10.L-OM-EXPAT`, « expatriés et visiteurs européens »)** mélange des résidents (expatriés) et des acheteurs qui résident en Europe (visiteurs). Le modèle n'a pas de dimension « zone de l'acheteur » distincte de « zone du sujet ».

### Points non relus (budget de recherche épuisé)

Remboursement des GLP-1 à 65 % depuis le 15 juin 2026 et +74 % en volume (preuve A de la cellule n° 1), effectifs SIES, SELL, baromètre du sport, DinarStandard, GSMA, groupe Pinterest Trends incluant le Maroc, Français du Maroc (Hespress du 30 mai 2026 relu : « plus de 50 000 ressortissants officiellement inscrits », source de presse, registre consulaire non consulté), chiffre de 61 000 retraités.
