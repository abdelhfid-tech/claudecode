# Radar d'arbitrage de tendances : plan V1

Version soumise à validation le 28 novembre 2026. Rien n'est codé avant votre accord.

Ce plan s'appuie sur une étude préalable en 13 axes (sources de données, plugins Claude Code, méthode, marchés France, Maroc, Afrique et Québec, taxonomie, tendances US, concurrence, économie des initiatives). Chaque axe a été contre-vérifié par un agent indépendant. Les corrections apportées par ces vérifications sont intégrées ci-dessous ; les principales sont listées en annexe A.

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

**1. Le décalage n'est pas un nombre, c'est un statut et une fenêtre par pays.** L'idée de la « machine à remonter le temps » (ce qui marche aux USA arrive en France puis au Maroc avec un retard fixe) ne tient pas. Le dossier France dégage six classes de friction, de quelques semaines pour un format de contenu à plusieurs années, ou jamais, pour un produit réglementé. La contre-vérification rappelle que ces classes reposent sur 15 cas, dont trois ou quatre peu sourcés : elles servent de point de départ, à recalibrer par le backtest.

| Classe | Nature | Décalage USA vers France observé | Exemples |
|---|---|---|---|
| A | Format de contenu, pratique gratuite, produit simple | 0 à 6 mois | matcha, run clubs |
| B | App ou service mondial sans frein réglementaire | 5 à 18 mois | Temu, micro-dramas, Skool |
| C | Fonction dépendant du calendrier d'une plateforme | 5 à 19 mois en France, 33 en Belgique | Threads, TikTok Shop |
| D | Produit réglementé (santé, finance, alcool, nicotine) | 24 à 60 mois, ou jamais | sodas prébiotiques, GLP-1 |
| E | Pratique demandant une infrastructure physique | 24 à 70 mois | Hyrox, pickleball |
| F | Modèle qui suppose de payer | 48 mois et plus | newsletters payantes |

**2. La diffusion va dans plusieurs sens.** Le padel, la seconde main (Vinted) et Hyrox sont plus avancés en France qu'aux USA. Whee est sorti au Maroc 28 mois avant les USA, TikTok Pro en Allemagne avant les USA. Le radar calcule donc la première disponibilité mondiale et suit aussi les flux inverses, qui sont des opportunités d'export.

**3. Au Maroc, les usages passent, les rails officiels non.** Le live shopping s'y fait déjà via TikTok, WhatsApp et le paiement à la livraison, sans TikTok Shop. Stripe, Shopify Payments et TikTok Shop n'y sont pas disponibles ; Lemon Squeezy ferme le 31 mars 2027. Un particulier ne peut payer que 20 000 DH par an en ligne en devises. Chaque pays est donc décrit par une grille de verrous (paiement, change, statut fiscal, plateformes disponibles, réglementation) qui plafonne le score d'une tendance.

**4. Pour un solo à temps partiel, l'espérance de gain de la plupart des projets est proche de zéro.** 17,3 % des apps atteignent 1 000 $ de revenu mensuel en deux ans ; l'app médiane encaisse environ 72 $ par mois à un an (RevenueCat 2026). L'IA a doublé l'offre d'apps sans hausse des téléchargements : la ressource rare est la distribution, pas la fabrication. D'où trois règles : un portefeuille de petits paris avec critères d'arrêt, la priorité aux initiatives adossées à un service, et la langue, la niche et le canal comme avantage.

**5. La détection de tendances est une commodité ; la décision datée par pays ne l'est pas.** Des dizaines d'outils détectent des tendances, beaucoup ont déjà un serveur MCP, aucun ne compare les pays avec une recommandation exécutable. L'avantage défendable, si vous productisez un jour, est un journal public de prédictions horodatées et résolues par pays. Les taux de précision affichés par les concurrents ne sont pas audités.

---

## 3. Ce que fait l'outil

```
Chaque jour (code, sans IA)    Chaque semaine (Claude)              À la demande (vous)
─────────────────────────      ─────────────────────────            ─────────────────────
Collecte des instantanés  ──►  Détection des signaux US      ──►   Choix d'une opportunité
par pays et par source         Résolution et classement             Brief stratégique
Contrôle de santé              (niche, lifestyle, mots-clés         Kit de lancement
des sources                    FR, arabe, darija)                   (landing, posts, visuels)
                               Statut et fenêtre par pays
                               Score par cellule
                               Prédictions datées
                               Rapport et tableau de bord
```

Chaque semaine, le radar sort au plus cinq opportunités. Chacune précise la tendance, la cellule pays × niche × lifestyle, le statut et la fenêtre dans chaque pays, les verrous, deux ou trois initiatives chiffrées, et la prédiction enregistrée qui permettra de juger le radar.

---

## 4. Sources de données V1 (0 €)

Toutes ces sources ont été testées depuis le conteneur le 28 novembre 2026.

| Source | Ce qu'elle mesure | Pays | Fréquence | Remarque |
|---|---|---|---|---|
| Classements App Store (flux RSS v2 et historique, recherche par identifiant) | Rang et disponibilité d'une app par pays | US, GB, CA, FR, BE, CH, MA, DZ, TN, SN, CI | Quotidienne | Flux instable : reprises et repli. La date de sortie est inutilisable ; on historise nous-mêmes. |
| Classements Google Play | Rang par pays | mêmes pays | Quotidienne | Point d'accès non officiel ; Android domine au Maghreb et en Afrique |
| Google Trends, tendances du jour | Recherches qui montent | 12 pays et le Québec | 3 fois par jour | Flux RSS officiel |
| Google Trends, comparaison | Courbes US, FR et MA sur une échelle commune, 5 ans d'historique | tous | Hebdomadaire et backtest | Non officiel : dégradation propre, jamais seul signal |
| Autocomplétion Google et YouTube | Présence locale d'un terme (« prix maroc », nom d'enseigne) | par pays et langue | Hebdomadaire | Signal de présence, pas de volume ; clé pour le Maroc |
| Google News et flux RSS de médias | Première mention dans la presse d'un pays | US, FR, MA, Afrique | Quotidienne | Listes de titres marocains curées ; l'édition « Maroc » de Google News n'est pas la presse marocaine |
| Wikimedia, jeu quotidien par pays | Date d'arrivée d'un concept par pays (identifiant Wikidata, seuil de 90 vues par jour) | US, CA, GB, DE, FR, BE, CH… ; Maghreb et Afrique presque invisibles | Quotidienne, historique depuis 2023 | Meilleur capteur gratuit pour dater une arrivée en Europe et au Canada. Labubu : Canada +17 j, France +159 j, Maroc +187 j |
| Wikipedia (vues par article) | Intérêt par langue (en, fr, ar, darija), historique depuis 2015 | par langue | Hebdomadaire | Consolider les renommages avant tout calcul |
| Recherche App Store par pays | Offre locale : nombre d'apps sur un concept dans une vitrine | par pays | Hebdomadaire | Mesure « l'offre absente » face à une attention présente |
| Pinterest Trends | Mots-clés lifestyle montants | US, FR, CA, GB, groupes DACH et Benelux | Hebdomadaire | Indice relatif, pas un volume |
| Bluesky, Mastodon francophone | Signaux précoces | global, filtre de langue | Quotidienne | Poids faible |
| Hacker News, Product Hunt, recherche GitHub, TrustMRR | Tech, IA, revenus vérifiés de petits logiciels | global | Quotidienne | Product Hunt : usage interne seulement |
| Flux RSS de chaînes YouTube | Présence de formats dans des panels de créateurs par pays | par panel | Hebdomadaire | Pas d'API YouTube pour les scores : sa politique interdit les métriques dérivées |
| Saisie manuelle (15 min par semaine) | Tendances TikTok du Creative Center connecté | selon export | Hebdomadaire | TikTok n'a plus aucune source gratuite sans connexion |

**Exclues en V1** : Reddit (bloqué depuis un datacenter, usage commercial sous contrat), TikTok et Instagram organiques (aucune source gratuite), X (payant), métriques de l'API YouTube, GDELT (trop limité), sources mortes (pytrends, OSS Insight, Amazon PA-API).

**Prêtes à brancher plus tard** : DataForSEO Trends (0,0027 $ la requête), X à l'usage (environ 11 $ par mois pour 6 pays), ScrapeCreators, EnsembleData ou Apify pour TikTok (le pays y reste une inférence), et deux bibliothèques publicitaires gratuites sur candidature mais limitées à l'UE (TikTok Commercial Content API, Meta Ad Library).

---

## 5. Modèle d'analyse

### 5.1 Données

- **Entité** : un concept (identifiant Wikidata quand il existe), ses produits (identifiants d'apps) et ses mots-clés en anglais, français, arabe et darija (graphies arabe et latine).
- **Observation typée** : valeur, unité, type de métrique, pays, période, source, niveau de preuve, date. Deux types différents ne sont jamais comparés ni additionnés (audience publicitaire, sondage et recensement donnent des signes opposés pour la même plateforme).
- **Règles par pays dans des fichiers datés et sourcés** : paiement, change, fiscalité, plateformes disponibles, réglementation par catégorie. Elles ne sont ni dans le code ni dans la mémoire du modèle.

### 5.2 Les quatre modules de calcul

Chaque score va de 0 à 100 et porte un intervalle P10-P50-P90. Les portes bloquantes passent avant les sommes pondérées. Les pondérations ci-dessous sont des valeurs de départ, à réestimer par le backtest.

**Module A, force de la tendance aux USA.** Le module est aussi appliqué au pays d'origine quand la tendance naît ailleurs.

`F_US = 100 × [0,25 vitesse + 0,15 niveau + 0,15 persistance + 0,30 corroboration + 0,05 accélération + 0,10 rafale]`

Chaque terme est un percentile parmi les entités suivies la même semaine, ce qui permet de noter une entité sans historique. La vitesse est la pente robuste (Theil-Sen) sur 8 périodes. La persistance est le test de Mann-Kendall, valable dès 5 points. La corroboration est la part des familles de sources en hausse ; elle pèse le plus, parce qu'un signal à source unique trompe (Google Flu Trends). Le score est multiplié par 0,6 si une seule famille monte, et plafonné à 40 pour un pic d'un jour.

Stades par règles explicites : signal faible, émergent, accélération, mainstream, déclin. Le déclin couvre le profil « pic puis chute » (Sora).

Le bruit est filtré : saisonnalité (Black Friday), apps à récompenses, enseignes purement locales.

**Module B, écart de diffusion par pays.**

- **Arrivée observée** : premier jour où l'entité dépasse le seuil d'une source au moins 3 jours sur 7.
- **Deux dates par pays** : l'intérêt (recherches, Wikipedia, presse) et la disponibilité (store, lancement officiel). L'attention précède souvent l'offre : Pokémon Go a atteint la mi-hauteur de son intérêt en français 7 jours avant son lancement en France.
- **Délai attendu** : loi log-normale par classe de friction et groupe de pays (UE francophone, Québec, Maghreb, Afrique subsaharienne), avec une probabilité « jamais » pour les produits réglementés. Par exemple, une app sans verrou met en médiane 75 jours à arriver en UE francophone et 180 jours au Maghreb.
- **Mise à jour par pays sentinelle** quand un pays relais décolle : le Royaume-Uni pour les plateformes et le commerce social, l'Allemagne pour la santé et le fitness, l'Espagne pour le sport et les services vers le Maroc, la France pour le Maghreb et l'Afrique, le Golfe pour les apps arabophones.
- **Indice d'opportunité** : élevé quand l'attention locale est arrivée mais que l'offre locale (apps, vidéos, articles, vendeurs en langue locale) manque encore. C'est la fenêtre d'arbitrage.
- `G_pays = F_US × (1 − intensité relative) × P(arrivée avant l'horizon) × porte`

**Module C, transposabilité pays × niche × lifestyle.**

`T = 100 × produit des portes × somme pondérée des proximités`

- **Portes** (paiement, plateforme, loi) valant 0, 0,3, 0,6 ou 1. Par exemple, le paiement à la livraison vaut 0,6 au Maroc.
- **Sept proximités** : culture, administration, géographie, économie, infrastructure, lifestyle, absence de substitut. La culture est mesurée depuis le pays relais le plus proche déjà touché : l'écart culturel Maroc-USA vaut 1,71 contre 0,51 pour Maroc-France.
- **Pondérations propres à chaque groupe de niches** : la culture compte pour un contenu, l'administration pour un produit réglementé, l'infrastructure pour une pratique physique.
- **Sans donnée de segment**, le lifestyle reste « inconnu » et l'outil l'affiche comme tel.
- **Pas de scores Hofstede en V1** : ils ne sont libres que pour la recherche, et un usage commercial demande une licence. La proximité culturelle part alors de la langue et du pays relais, notée avec son niveau de preuve.
- **Notes a priori** : la formule de l'axe taxonomie sert seulement à amorcer la matrice. Ces notes ne déclenchent jamais d'initiative, car changer une note d'un cran déplace une cellule de 22 rangs au plus.

**Module D, rendement d'une initiative.** Combinaison de deux approches :
- **La grille de l'axe économie** : retour attendu sur 24 mois à partir des taux de base réels, délai au premier revenu, levier de Claude Code, défendabilité, capital requis.
- **Le calcul de l'axe méthode** : la probabilité de succès part d'un taux de base de 15 % et s'ajuste selon les modules A à C. S'y ajoutent un facteur de fenêtre (temps de lancement face à la fenêtre restante) et la valeur par utilisateur du pays, variable qui domine au Maghreb.

Le classement se fait sur le P10, donc de façon prudente. Un rail de paiement absent bloque l'initiative. Les contraintes du studio sont appliquées comme filtres : moins de 10 h par semaine, moins de 1 000 €, premier euro visé en moins de 8 semaines.

**Incertitude et abstention.** Chaque entrée porte une confiance tirée de son niveau de preuve. Un tirage Monte-Carlo produit P10, P50 et P90. L'outil répond « données insuffisantes » si la confiance moyenne est inférieure à 0,4 ou si un pays a moins de deux familles de sources. C'est souvent le cas du Maroc, où le jeu Wikimedia par pays ne publie que 74 lignes par jour, contre 10 684 pour la France. On n'y conclut jamais à l'absence d'une tendance sur cette seule source.

### 5.3 Journal de prédictions et backtest

**Journal.** Fichier en ajout seul, chaque ligne chaînée par empreinte SHA-256. Une prédiction est un événement binaire proche, jamais une taille finale (« l'app X entre dans le top 100 iOS France avant le 30 juin 2027 »). Elle porte une probabilité, un horizon et une règle de résolution écrite à l'avance. La résolution est automatique. Les scores sont calculés par classe et par pays :
- score de Brier, et sa version relative au taux de base ;
- couverture des intervalles à 80 % ;
- erreur sur le délai.

**Backtest avant mise en service.** Il porte sur 20 cas datés : Pokémon Go, fidget spinner, Squid Game, Clubhouse, Wordle, ChatGPT, quiet quitting, BeReal, Threads, Skibidi Toilet, chocolat de Dubaï, Labubu, Italian brainrot, Apple Pay, Netflix, TikTok Shop, commerce ultra-rapide, hard seltzer, pickleball, Hyrox. Le jeu compte six cas nés hors des USA et quatre échecs. La procédure :
1. Prédictions avec les seules données disponibles à la date de détection.
2. Comparaison à trois références naïves : taux de base, délai constant, table de classes sans sentinelle.
3. Validation croisée qui exclut un cas à la fois.
4. Critères d'acceptation fixés avant de lancer : faire mieux que le taux de base à 90 et 365 jours, et une couverture à 80 % comprise entre 0,65 et 0,95. Si la mise à jour par sentinelle ne fait pas mieux que la table seule, elle est retirée.

Le jeu manque de cas propres à l'Afrique subsaharienne et de cas marocains bien datés : ce sera la priorité de la collecte.

---

## 6. Architecture technique

```
claudecode/
├── radar/                  Code Python (bibliothèque standard + PyYAML), testé
│   ├── collectors/         un adaptateur par source, contrat commun, santé, cache, reprises
│   ├── store.py            SQLite : instantanés, observations, entités, statuts, prédictions
│   ├── detect.py           force du signal US, filtres de bruit, profil pic puis chute
│   ├── diffusion.py        statut, dates d'intérêt et de disponibilité, fenêtre par pays
│   ├── transpose.py        verrous et score de cellule
│   ├── initiatives.py      archétypes × cellules, score de rendement, sensibilité
│   ├── ledger.py           journal de prédictions chaîné, résolution, Brier
│   ├── backtest.py         cas historiques
│   ├── report.py           rapport hebdomadaire et données du tableau de bord
│   └── cli.py              radar collect | detect | score | report | backtest | ledger | health
├── config/                 YAML versionnés : pays, niches, lifestyles, mots-clés, règles datées,
│                           classes de friction, archétypes, notes a priori, registre des sources
├── data/                   instantanés compressés (l'historique : une arrivée non capturée ne se date plus)
├── dashboard/              une page HTML autonome (radar, matrice, courbes, journal, santé des sources)
├── .claude/                skills et agents du projet (chargés aussi par les tâches planifiées)
├── plugins/trend-radar/    les mêmes skills empaquetés en plugin, avec sa marketplace
└── tests/                  tests sur données enregistrées : aucun appel réseau en CI
```

**Partage du travail entre code et IA.** La collecte, les calculs, le score et le journal sont du code déterministe et testé. Claude intervient pour résoudre les entités, traduire les mots-clés (français, arabe, darija), classer niche et lifestyle, rédiger les briefs et les kits, et contre-vérifier. Raison : une requête automatique avec une trentaine de plugins chargés coûte déjà environ 0,43 $ ; un calcul fait par le modèle n'est ni reproductible ni testable.

**Exécution.**
- En session, vous lancez les commandes du plugin (section 7).
- Collecte quotidienne : un cron GitHub Actions gratuit, sans IA, qui écrit les instantanés dans le dépôt. Si le jeton ne permet pas de créer ce fichier, une tâche planifiée Claude prend le relais.
- Analyse hebdomadaire : une tâche planifiée Claude Code dans le cloud, à périmètre borné (5 tendances × 3 pays au plus), qui met à jour le rapport et le tableau de bord dans le dépôt.
- Tableau de bord : la page HTML versionnée dans le dépôt, publiée en Artifact privé lors des sessions interactives. Depuis une tâche planifiée, la republication d'un Artifact demande une confirmation : la version automatique reste donc le fichier du dépôt, éventuellement déployé sur Vercel.

---

## 7. Le plugin `trend-radar`

| Composant | Rôle |
|---|---|
| `/radar-setup` | Vérifie l'environnement, crée la base, teste les sources |
| `/radar-scan` | Collecte et détection, rapport des nouveaux signaux |
| `/radar-weekly` | Cycle complet de la semaine : statut, scores, prédictions, rapport, tableau de bord |
| `/radar-brief <tendance> <pays>` | Brief stratégique d'une opportunité |
| `/radar-kit <initiative>` | Kit de lancement : landing page, 10 posts, visuels, script vidéo, plan à 30 jours |
| `/radar-backtest` | Rejoue les cas historiques et met à jour la calibration |
| `/radar-ledger` | Résout les prédictions échues et affiche la précision |
| Agent `local-scout` | Vérifie la présence d'une tendance au Maroc ou en France (presse, autocomplétion, stores, équivalents locaux) |
| Agent `initiative-strategist` | Construit les initiatives d'une opportunité sous vos contraintes |
| Agent `skeptic-verifier` | Contre-vérifie chaque chiffre et chaque date avant publication d'un brief |
| Hooks | Garde budgétaire (aucun appel payant en V1), journal de provenance, contrôle du format du rapport |

Les commandes qui publient ou dépensent ne se déclenchent jamais seules.

---

## 8. Plugins et connecteurs à prévoir

| Rôle | Outil | État sur votre compte | Usage |
|---|---|---|---|
| Déployer landing pages et tableau de bord | Vercel | connecté | V1, kit de lancement |
| Préparer les posts multi-réseaux | Postiz | connecté | V1, brouillons seulement, jamais publiés sans vous |
| Visuels | Canva | connecté | V1, kit de lancement |
| Voix off français et darija | ElevenLabs | connecté | V1, optionnel |
| Boutique | Shopify | connecté | À la demande ; pas de Shopify Payments au Maroc (alternative : YouCan) |
| Liste d'attente, base hébergée | Supabase | connecté | À la demande ; le projet gratuit se met en pause après 7 jours d'inactivité |
| Archivage des briefs | Google Drive | connecté | Optionnel |
| Modèles pour la darija | Hugging Face | connecté | V2 |
| Alerte hebdomadaire | Slack (connecté, non activé dans ce chat), Gmail (à reconnecter) | partiel | Optionnel |
| Publicités et audiences TikTok | TikTok for Business | connexion incomplète | V2, à finaliser |
| Skills déjà installés et réutilisés | frontend-design, anti-ai-writing, marketing:content-creation, small-business:social-content-engine, small-business:seo-ai-visibility, dataviz | disponibles | V1 |
| Données payantes | DataForSEO, Apify ou ScrapeCreators, X, Exa ou Firecrawl, Similarweb, Ahrefs | non branchés | Quand le budget s'ouvre |

---

## 9. Garde-fous

- Collecte : pas de collecte derrière une connexion, respect des refus (403, robots.txt, captcha), pas de contournement, cache et débit limité par site.
- Données personnelles : seulement des agrégats (terme, compteur, date, pays), aucun profil de personne.
- Exclusions par défaut des initiatives : cibler des mineurs, allégations de santé non étayées, jeux d'argent et marchés de prédiction, nicotine, conseil financier sans cadre, ultra fast-fashion, dropshipping à petit panier depuis la Chine.
- Conformité intégrée à chaque brief : mention des contenus générés par IA (AI Act, article 50), loi influenceurs en France, RGPD, CNDP au Maroc, règles WhatsApp Business (assistants IA généralistes interdits depuis le 15 janvier 2026, sauf dans l'UE et l'EEE, au Brésil et en Turquie ; donc interdits en Suisse, au Québec, au Maroc et en Afrique ; les agents propres à une entreprise restent permis).
- Règles d'éligibilité relues sur les pages officielles, jamais codées en dur : Programme Partenaire YouTube (Maroc, Algérie, Tunisie et Sénégal éligibles ; Côte d'Ivoire, Cameroun et RDC non), TikTok Shop, publicités ChatGPT, rails de paiement pays par pays (Paddle exclut la RDC et le Mali ; Polar n'est pas disponible au Maroc).
- Change marocain : cours du jour de Bank Al-Maghrib. Une pile d'outils avec Claude Pro tient dans la dotation de 20 000 DH par an ; avec Claude Max, elle la dépasse d'environ 5 %.
- Budget à 0 € appliqué par le code : les adaptateurs payants existent mais sont désactivés.

---

## 10. Stratégie d'exploitation du studio

**Cadence.** Une heure par semaine de revue du radar, le reste sur une seule initiative à la fois. Trois à cinq petits paris par trimestre. Critère d'arrêt écrit avant le lancement : par exemple, aucun signal de traction à 30 jours, ou aucun revenu à deux fois le délai prévu.

**Pistes a priori, à confirmer par les mesures du radar.**

| Piste | Pourquoi |
|---|---|
| France : outils et services d'automatisation IA pour TPE et indépendants, visibilité dans les réponses des IA (GEO) | Archétypes adossés à un service, en tête de la grille économique en France |
| France : mise en relation pour la reprise de PME (outils, contenus) | Les repreneurs sont 5 à 10 fois plus nombreux que les cédants sur le marché ouvert (CCI Paris IdF, novembre 2026) : le goulot est l'appariement, pas le manque de repreneurs |
| Maroc vers France : services vendus en euros depuis le Maroc | En tête de la grille au Maroc, mais ce classement est fragile : il dépend du coût d'opportunité supposé (à 25 €/h, l'agence export recule au 4e rang) |
| Maroc : outils pour marchands en paiement à la livraison (confirmation, risque de refus, créations en darija), facturés en dirhams | 84 % des acheteurs en ligne paient à la livraison, avec 20 à 40 % de refus |
| Diaspora en France et en Belgique : services et commerce, y compris TikTok Shop | Seul accès à TikTok Shop pour un public maghrébin ; pouvoir d'achat européen |
| Micro-dramas en français et en darija | Maturité aux USA, DramaWave n°13 au Maroc, offre française naissante |

**Productisation, plus tard.** Si le journal de prédictions est crédible après 6 à 12 mois : newsletter francophone gratuite, puis premium (9 à 12 € par mois), offre agence (149 à 399 € par mois), puis études pour les marques. Encaissement par une entité européenne ou Paddle, et en dirhams pour les clients marocains.

---

## 11. Étapes de livraison

1. Socle : configuration YAML, schéma de données typé, base SQLite.
2. Collecteurs gratuits avec tests sur données enregistrées et contrôle de santé.
3. Détection, diffusion, verrous, scores, journal de prédictions.
4. Backtest sur les cas historiques et calibration.
5. Skills, agents et hooks, plugin empaqueté et validé (`claude plugin validate --strict`).
6. Tableau de bord.
7. Premier cycle réel sur données du jour : top opportunités, un brief et un kit d'exemple.
8. Revue de code indépendante, tests, commit et push sur la branche de travail.
9. Planification (collecte quotidienne, analyse hebdomadaire), après votre accord.

---

## Annexe A. Corrections apportées par la contre-vérification

- L'interdiction des réseaux sociaux aux moins de 15 ans en France a été censurée par le Conseil constitutionnel le 14 août 2026 (décision 2026-911 DC). Le radar ne la suppose pas.
- L'API YouTube interdit les métriques dérivées : elle ne sert pas au calcul des scores.
- Les scrapers TikTok payants ne filtrent pas par pays (leur « région » désigne le serveur relais) : le pays d'un signal TikTok est toujours une inférence.
- La date de sortie App Store est tronquée au Maroc et en Côte d'Ivoire : la disponibilité est historisée par le radar.
- Les données Wikipedia exigent de regrouper les renommages : sans cela, le décalage de Threads passe à tort de 0 à 5 mois.
- Les audiences DataReportal ne sont pas des croissances d'audience : la plateforme de référence change d'un pays et d'une année à l'autre.
- Stripe indique le pays du vendeur, pas celui de l'acheteur : la vraie limite côté acheteur est la détention d'une carte.
- Les « soumissions » App Store à +84 % sont des nouvelles apps publiées.
- La TikTok Commercial Content API couvre 32 pays européens, aucun hors Europe.
- Reprise de PME en France : pas de déficit de repreneurs ; le goulot est l'appariement.
- Le classement « export depuis le Maroc en tête » ne résiste pas à une variation du coût d'opportunité : il est présenté comme une hypothèse.
- Les chiffres annoncés par les plateformes (vendeurs TikTok Shop France, croissance de Whatnot France) sont déclaratifs et notés comme tels.
- Le MRR affiché sur TrustMRR n'est pas un encaissement : seules les fenêtres recalculées et récemment synchronisées comptent.
- La date de parution de Pinterest Predicts 2027 n'est pas confirmée ; seul un webinaire le 10 décembre l'est.

Les dossiers complets (environ 900 000 caractères) sont conservés pour la phase de code.
