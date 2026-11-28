# Paysage concurrentiel des outils de veille de tendances et positionnement du « Radar d'arbitrage de tendances »

Axe de l'étude préalable : concurrence et positionnement. Date de rédaction : 2026-11-28.

---

## 0. Méthode, légende et limites

- Pages officielles de prix lues directement le 2026-11-28 quand elles étaient accessibles (Exploding Topics, SparkToro, Treendly, BuzzSumo, TrendWatching, Favikon, Brand24, Hootsuite, Trends.vc, Virlo, Visibrain, Kolsquare). Le reste vient de sources secondaires (comparateurs, presse spécialisée), signalées comme telles.
- Catalogue de plugins Claude (répertoire Anthropic) et registre des connecteurs MCP interrogés depuis cette session le 2026-11-28 (outils SearchPlugins et SearchMcpRegistry).
- Légende, alignée sur les autres dossiers de l'étude :
  - **[FAIT]** : lu sur une source primaire (page de l'éditeur, communiqué, document public), avec date.
  - **[FAIT-2]** : source secondaire jugée sérieuse (presse, comparateur, revue), non recoupée sur la source primaire.
  - **[ESTIMATION]** : ordre de grandeur calculé ou déduit par moi.
  - **[HYPOTHÈSE]** : proposition à valider.
- **Limites importantes.**
  - Le budget de recherche web de la session s'est épuisé en cours d'axe. Les derniers compléments (Virlo, Talkwalker, Hootsuite, Kolsquare, Brand24, FastMoss, Treendly) ont été lus en accédant directement aux pages des éditeurs, sans nouvelle recherche. Certains points sont donc restés sans réponse : prix de TrendsAGI, langues couvertes par Brandwatch, liste des marchés de Kalodata et de FastMoss, prix payé d'After School. Une relance de quelques recherches suffirait à les compléter.
  - Les sites pentos.co, tokboard.com et achgal.ma n'étaient pas joignables depuis l'environnement de recherche (erreur DNS). Cela ne prouve pas que ces services ont fermé.
  - Les prix d'entreprise (Brandwatch, Meltwater, Talkwalker, Pulsar, WGSN, Kolsquare) ne sont pas publics : les chiffres cités sont des estimations de tiers, à traiter comme des ordres de grandeur.
  - **Ne pas avoir trouvé un concurrent direct ne prouve pas qu'il n'en existe aucun.** La conclusion de la section 4 vaut pour les recherches menées, pas au-delà.

---

## 1. Synthèse

1. **Je n'ai trouvé aucun outil qui fasse explicitement l'arbitrage géographique des tendances des USA vers la francophonie en y ajoutant des initiatives exécutables.** Le plus proche est un actor Apify, « Google Trends Gap Finder » : il repère les produits qui montent dans 1 à 4 pays d'origine et pas encore dans un pays de destination. Il est limité aux produits, ne s'appuie que sur Google Trends, et comptait 2 utilisateurs avec 0,0 % de runs réussis le 2026-11-28 [FAIT].
2. **La détection de tendances en libre-service coûte entre 8 et 299 $ par mois.** Treendly Pro coûte 99 $ par an, Exploding Topics 39, 99 ou 249 $ par mois, Glimpse 99 ou 299 $ par mois. Les rapports et la prospective vont de Trends.vc (25 $ par mois) à TrendWatching (990 $ par an) puis WGSN (sur devis). L'écoute sociale d'entreprise se vend à cinq chiffres par an : Brandwatch de 13 800 à 39 000 £ par an, Meltwater autour de 25 000 $ de contrat moyen, Onclusive Social à partir de 15 000 € par an.
3. **Plusieurs outils filtrent déjà par pays.** C'est le cas de Glimpse (« n'importe quel pays ») et de Treendly (19 pays plus « Worldwide », seuls les USA en gratuit). Aucun ne calcule le décalage d'arrivée, la transposabilité ou le blocage réglementaire par pays. L'utilisateur fait la comparaison à la main.
4. **Les acteurs français (Visibrain, Onclusive Social ex-Digimind, Kolsquare, Favikon) font de l'écoute, de la gestion de crise ou de l'influence, pas de l'arbitrage.** Au Maroc et en Afrique, je n'ai trouvé que des acteurs d'écoute et d'influence (Achgal, Hypeo AI, Zey Connect, Clouteye). Aucun outil de tendances dédié à l'Afrique subsaharienne francophone n'est apparu.
5. **En 2025-2026, le MCP est devenu un standard chez les éditeurs.** SparkToro (juin 2026), Meltwater (depuis 2025, étendu en juillet 2026), Brand24, Favikon (offre Pro), Treendly (toutes offres), TrendWatching (« Your AI ») et Hootsuite (connecteur Lumen MCP, offre Enterprise) en proposent un. Être « dans Claude » n'est plus un différenciateur.
6. **Dans l'écosystème Claude, la collecte de tendances devient une commodité.** Le skill `last30days` compte 76,6 k étoiles sur GitHub et couvre Reddit, X, YouTube, TikTok et d'autres sources. Trends MCP est gratuit jusqu'à 100 requêtes par mois. Le répertoire de plugins contient aussi TrendsAGI, Virlo, ViralHunt, Viral Swipe File, Manifold et vidIQ. Aucun ne compare des pays ni ne mesure la diffusion entre marchés.
7. **Les taux de précision publiés ne sont pas audités.** Pinterest annonce 88 % sur six ans, WGSN 94 % « jusqu'à un an », Glimpse « 95 %+ en backtest ». Je n'ai trouvé aucun journal public, horodaté et vérifiable par pays. **Un journal de prédictions datées, résolues selon des critères mesurables, est l'avantage défendable le plus crédible.**
8. **Positionnement recommandé** : « le radar qui dit ce qui va arriver des USA dans votre pays francophone, quand, pour quelle tribu, et quoi lancer avant que ça arrive, avec un historique public de ses prédictions ». Deux produits d'entrée : une newsletter francophone gratuite, puis un plugin Claude Code et une base de données payants. Les rapports et le conseil viennent ensuite.

---

## 2. Cartographie : sept familles d'outils

| Famille | Exemples | Promesse | Prix d'entrée public | Pourquoi ce n'est pas notre outil |
|---|---|---|---|---|
| A. Détection de tendances en libre-service (recherche, social) | Exploding Topics, Glimpse, Treendly, Trends MCP | « Voir les tendances avant qu'elles explosent » | 0 à 39 $ par mois | Une seule géographie à la fois, centrée sur les USA, sans diffusion entre pays ni recommandation d'action |
| B. Rapports, prospective, cabinets | TrendHunter, Trends.vc, WGSN, TrendWatching, Heuritech, Spate, Pinterest Predicts | « Comprendre et anticiper » | 25 $ par mois (Trends.vc) à devis (WGSN) | Anglophones, mondiaux ou US, éditoriaux, sans lecture par pays francophone |
| C. Recherche d'audience et de contenu | SparkToro, BuzzSumo | « Où est votre audience, quel contenu performe » | 112 à 199 $ par mois | Pas de tendances émergentes ni de comparaison entre pays |
| D. Écoute sociale d'entreprise | Talkwalker (Hootsuite), Brandwatch, Meltwater, Pulsar, Visibrain, Onclusive Social, Brand24 | « Surveiller la marque, les crises, les concurrents » | 199 $ par mois (Brand24) à plus de 15 k€ par an | Requêtes définies par le client (on cherche ce qu'on connaît déjà), prix d'entreprise |
| E. Influence et créateurs | Kolsquare, Favikon, Hypeo AI, Zey Connect | « Trouver et piloter des créateurs » | 29 € par mois (Favikon Creator) | L'objet est le créateur, pas la tendance |
| F. TikTok et commerce social | Pentos, Tokboard, Kalodata, FastMoss, Minea, TrendTrack | « Ce qui se vend ou devient viral maintenant » | environ 46 à 49 $ par mois | Limité aux marchés où TikTok Shop est ouvert, pas au Maroc ; produits gagnants immédiats, pas de transposition |
| G. Collecteurs pour agents IA (skills, plugins, MCP) | last30days, Trends MCP, Google Trends MCP, TrendsAGI, Virlo, ViralHunt, Manifold, vidIQ | « Donner des données de tendances à l'agent » | 0 $ (open source) à 49 $ par mois | Briques de collecte, sans modèle de diffusion ni journal de prédictions |

Lecture [ESTIMATION] : notre outil se place à l'intersection de A (détection), B (interprétation et recommandations) et G (exécution par agent). Il ajoute une dimension qu'aucune famille ne traite, le **différentiel entre pays dans le temps**.

---

## 3. Fiches concurrentielles détaillées

### 3.1 Famille A : détection de tendances en libre-service

| Outil | Cible | Prix public | Couverture géographique et linguistique | Ce qui manque pour l'arbitrage | Sources (date) |
|---|---|---|---|---|---|
| **Exploding Topics** (Semrush, donc Adobe depuis le 2026-04-28) | Entrepreneurs, investisseurs, marketeurs | Entrepreneur 39 $ par mois (100 tendances suivies), Investor 99 $ (500 tendances, prévisions, export CSV, startups), Business 249 $ (2 000 tendances, rapports) ; essai de 7 jours [FAIT]. Une « Trends API » est listée, sans prix publié [FAIT] | La page de prix ne mentionne ni pays ni langue ; base de « 1,1 M+ » tendances [FAIT]. [HYPOTHÈSE] Signal mondial, dominé par l'anglophone. | Pas de filtre pays documenté, pas de décalage, pas de francophonie, pas d'initiatives | https://explodingtopics.com/pricing (consulté le 2026-11-28) ; https://explodingtopics.com/blog/exploding-topics-pro-vs-free (mis à jour le 2026-03-23) ; https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition (2026-04-28) |
| **Glimpse** | Marques, agences, investisseurs | Pas de page de prix publique. Selon une revue tierce : Hobbyist gratuit (10 recherches), Pro 99 $ par mois, Expert 299 $ par mois (500 recherches), Enterprise sur devis [FAIT-2] | Volume de recherche absolu « pour n'importe quel mot-clé et n'importe quel pays » ; ventilation par canal (TikTok, Reddit, YouTube, Pinterest) ; extension Chrome (plus de 200 000 utilisateurs) ; API mentionnée [FAIT] | La comparaison entre pays est possible mais manuelle, sans modèle de décalage. Précision annoncée « 95 %+ en backtest », non auditée | https://meetglimpse.com/ (consulté le 2026-11-28) ; https://outlierkit.com/resources/glimpse-pricing/ (vérifié le 2026-08-14) |
| **Treendly** | Indépendants, petites équipes | Gratuit (3 tendances suivies) ; Pro 99 $ par an, soit 8 $ par mois (25 tendances, 4 sièges) ; Enterprise sur devis. API et MCP annoncés sur toutes les offres [FAIT] | Filtre de 19 pays plus « Worldwide », seuls les USA en gratuit ; interface en six langues, dont le français ; bibliothèque de 52 668 tendances [FAIT] | Le plus proche par la géographie et le moins cher. Pas de calcul de diffusion, pas de transposabilité, pas d'initiatives | https://treendly.com/pricing ; https://treendly.com/ (consultés le 2026-11-28) |
| **Trends MCP** (trendsmcp.ai) | Développeurs, agents IA | Gratuit à 100 requêtes par mois, puis 19, 49 et 199 $ par mois (1 000, 5 000 et 25 000 requêtes) [FAIT-2] | Plus de 30 sources (Google, TikTok, YouTube, Reddit, Amazon, Wikipedia, X, Spotify…) ; paramètres géographiques non documentés [FAIT-2] | Brique de données sans couche d'analyse. Ses propres valeurs sont des « estimations normalisées propriétaires » | https://glama.ai/mcp/servers/ng9vus0xd0 ; https://apify.com/trendsmcp/brand-monitoring-mcp (consultés le 2026-11-28) |
| **Google Trends Gap Finder** (Apify, `trendgap/trend-gap`) | E-commerçants | Paiement à l'événement, « à partir de 100 $ pour 1 000 alertes de tendance » [FAIT] | 1 à 4 pays d'origine (US, GB et KR par défaut) contre 1 pays de destination (ES par défaut) ; catégories shopping, beauté, alimentation, maison, jouets, habillement [FAIT] | **Seule implémentation trouvée du concept de « gap » entre pays.** Limitée aux produits et à Google Trends. 2 utilisateurs, 0,0 % de runs réussis, backtest sur 19 produits seulement | https://apify.com/trendgap/trend-gap (consulté le 2026-11-28) |

### 3.2 Famille B : rapports, prospective et cabinets

| Outil | Cible | Prix public | Couverture | Ce qui manque | Sources (date) |
|---|---|---|---|---|---|
| **TrendHunter** | Marques, équipes innovation | Pro Dashboard à 199 $ par mois en facturation annuelle ; conseil, conférences et accélérateur sur devis (estimés de 499 à 3 000 $+ par mois) [FAIT-2, source concurrente] | Mondiale, en anglais ; scores de popularité, d'activité et de fraîcheur, sans historique chiffré | Pas de pays francophones, pas de décalage, pas d'initiatives exécutables par une petite équipe | https://explodingtopics.com/blog/exploding-topics-vs-trendhunter (mis à jour le 2026-06-15 ; page trendhunter.com en HTTP 403) |
| **Trends.vc** | Fondateurs indépendants | Trends Pro à 25 $ par mois ou 299 $ par an ; avec Masterminds hebdomadaires, 83 $ par mois [FAIT] | Plus de 180 rapports de marché ; « Opportunity Engine » ; 54 782 fondateurs revendiqués [FAIT] | Rapports anglophones centrés sur les USA, sans lecture par pays | https://access.trends.vc/ ; https://join.trends.vc/ (consultés le 2026-11-28) |
| **WGSN** | Grandes marques (mode, beauté, alimentation) | Sur devis, abonnement annuel par équipe ; aucun prix 2025-2026 publié [FAIT-2] | Mondiale ; TrendCurve AI annoncé « 94 % de précision jusqu'à un an » [FAIT, revendication de l'éditeur] | Hors de portée des créateurs et des petites équipes ; précision non auditée | https://www.wgsn.com/en/products/fashion-design ; https://www.wgsn.com/en/what-we-do/ai-data |
| **TrendWatching** | Innovation, marketing, stratégie | Seeker gratuit ; Pioneer à 990 $ par an (850 € par an), avec 42 000 innovations, rapports et « Ideation Playbooks » à exécuter dans son propre assistant IA, plus un accès « Your AI » dans ChatGPT, Claude et Mistral ; Enterprise à partir de 7 500 $ par an [FAIT] | Mondiale, en anglais | **Le plus proche pour les « recommandations exécutables »**, mais sous forme d'exemples d'innovation, sans arbitrage géographique ni lecture francophone | https://www.trendwatching.com/pricing (consulté le 2026-11-28) |
| **Heuritech** (Paris) | Marques de mode | Non public | Analyse d'images des réseaux sociaux ; prévisions trimestrielles par tendance (par exemple tartan homme +16 % au T4 2026) | Mode seulement, B2B grands comptes | https://heuritech.com/market-reports/trend-calendar-2026/ ; FashionUnited (nov. 2025) |
| **Spate** (New York) | Beauté, bien-être, alimentation | Non public | Données de recherche Google, TikTok et Instagram ; « Beauty Pulse 2026 » couvre « cinq marchés » non nommés sur la page (2026-05-12) | Données détaillées surtout US ; pas de modèle de diffusion entre marchés | https://www.spate.nyc/reports/beauty-pulse-2026-mapping-beauty-by-category-and-market |
| **Pinterest Predicts** | Annonceurs Pinterest (gratuit) | Gratuit | Mondial, par marché Pinterest | Annonce « 88 % de prédictions réalisées sur six ans », sans méthode publiée ni audit | https://fortune.com/2026/10/15/pinterest-predicts-2026-trends-accuracy-brooches-funhaus/ (2026-10-15) |
| **Trendalytics** | Mode et retail | Non relevé | Données « principalement issues de sources américaines », volumes DACH, France et Italie « nettement plus minces » [FAIT-2] | Illustre le biais américain des outils US | https://www.ki-syndikat.de/tools/trendalytics/ |

### 3.3 Famille C : recherche d'audience et de contenu

| Outil | Cible | Prix public | Couverture | Ce qui manque | Sources |
|---|---|---|---|---|---|
| **SparkToro** | Marketeurs, agences | Spark 150 $ par mois, Torch 300 $, Beacon 600 $, environ 25 % de moins en annuel ; MCP inclus dès Spark ; API séparée à l'usage [FAIT]. Serveur MCP OAuth lancé en juin 2026 [FAIT-2] | Pays non précisés sur la page de prix | Pas de détection de tendances ni de temporalité entre pays. Utile pour décrire une tribu (lifestyle) une fois la tendance repérée | https://sparktoro.com/pricing ; https://sparktoro.com/mcp/docs (consultés le 2026-11-28) |
| **BuzzSumo** | Contenu, relations presse | Content Creation 199 $ par mois, PR & Comms 299 $, Suite 499 $, Enterprise 999 $ (en annuel) ; API sur devis [FAIT] | Aucun filtre pays ou langue mentionné sur la page de prix (seul un filtre par État sur Enterprise) [FAIT] | Mesure ce qui a performé, pas ce qui va arriver dans un autre pays | https://buzzsumo.com/pricing/ (consulté le 2026-11-28) |

### 3.4 Famille D : écoute sociale d'entreprise

| Outil | Cible | Prix | Couverture | Ce qui manque | Sources |
|---|---|---|---|---|---|
| **Talkwalker** (intégré à Hootsuite sous « Lumen by Talkwalker ») | Grandes marques, agences | Sur devis ; estimations tierces d'environ 9 000 à 9 600 $ par an pour l'entrée de gamme [FAIT-2]. Chez Hootsuite : 99, 199 et 399 $ par utilisateur et par mois en annuel ; Lumen et son **connecteur MCP** sont réservés à l'offre Enterprise [FAIT] | « 187 langues », sentiment en plus de 127 langues, environ 150 M de sites, plus de 10 réseaux sociaux [FAIT] | Écoute par requête et gestion de crise. La « prévision de tendances » de Hootsuite (offre Professional) porte sur 90 jours et sur les sujets du client | https://www.talkwalker.com/social-listening ; https://www.hootsuite.com/fr/plans (consultés le 2026-11-28) |
| **Brandwatch** | Grandes marques | Sur devis. Document public G-Cloud 14 (secteur public britannique, 2025) : Consumer Intelligence à 13 800, 22 200 ou 39 000 £ par an [FAIT]. Contrat moyen d'environ 50 000 $ selon Vendr [FAIT-2] | Langues non vérifiées dans cette session | Prix et usage d'entreprise | https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/93287/917870886671618-pricing-document-2025-09-26-0912.pdf (2025-09-26) ; https://www.vendr.com/marketplace/brandwatch |
| **Meltwater** (racheteur de Linkfluence, connaissance antérieure non revérifiée) | Communication, relations presse, marques | Contrat moyen d'environ 25 000 $ sur 91 transactions (Vendr) [FAIT-2]. **MCP depuis 2025**, étendu le 2026-07-08 ; connecteur listé dans le répertoire Claude [FAIT] | Plus de 1,5 milliard de documents par jour, plus de 240 langues [FAIT, revendication de l'éditeur] | Même limite que Talkwalker | https://www.meltwater.com/en/blog/meltwater-mcp (2026-08-03) ; https://www.vendr.com/marketplace/meltwater |
| **Pulsar** (Londres) | Insights d'audience, agences | Sur devis ; point d'entrée cité de 1 200 $ (TRAC, 150 000 mentions), non vérifié [FAIT-2] | Mondiale | Outil d'agence et d'études | https://www.trustradius.com/products/pulsar-core/pricing |
| **Visibrain** (Paris, fondé en 2011, environ 29 salariés) | Grands comptes français (SNCF, Carrefour, Dior, Bouygues Telecom, Havas, Publicis) | Devis personnalisé [FAIT] ; « à partir de 600 € par mois » selon un comparateur [FAIT-2] | Cas d'usage : e-réputation, crise, concurrence, insights ; sources X, TikTok, LinkedIn [FAIT] | Outil de veille et de crise ; aucune fonction d'arbitrage | https://www.visibrain.com/pricing (consulté le 2026-11-28) ; https://www.logiciels.pro/visibrain/ ; https://www.caplight.com/company/visibrain |
| **Onclusive Social** (ex-Digimind, Rouen et Paris) | Grands comptes | « À partir de 15 000 € par an » selon Software Advice [FAIT-2] | Plus de 25 réseaux sociaux ; le site digimind.com a fermé le 2026-03-19 [FAIT] | Intégration dans une suite de veille média d'entreprise | https://www.digimind.com/en/news/onclusive-social-website-www.digimind.com-to-close-on-19th-march-2026 (2026-02-20) ; https://www.softwareadvice.com/competitive-intelligence/digimind-profile/ |
| **Brand24** (Pologne) | PME, agences | Individual 199 $ par mois, Team 299 $, Pro 399 $, Business 599 $ (annuel), Enterprise à partir de 1 499 $ ; API à 149 $ de plus ; MCP listé ; filtre « langue (pays) » [FAIT] | Mondiale, filtre par langue et pays | Écoute par mot-clé ; module « Trend Spotter » au niveau du secteur, pas du pays | https://brand24.com/prices/ ; https://brand24.com/mcp/ (consultés le 2026-11-28) |

### 3.5 Famille E : influence et créateurs

| Outil | Cible | Prix | Couverture | Ce qui manque | Sources |
|---|---|---|---|---|---|
| **Kolsquare** (Paris, groupe team.blue) | Marques et agences européennes | Prix non publics, SaaS annuel, trois offres : Discovery, Listening, Enterprise ; remise de 30 % pour les startups [FAIT]. Environ 9 000 € par utilisateur et par an pour Discovery selon un tiers [FAIT-2] | Créateurs dans 180 pays (plus de 5 000 abonnés) [FAIT]. Rachats : Woomio (Danemark, fin 2024), Inflead (Italie, fin 2025), Storyclash (Autriche, 2026-01-20) ; environ 15 M€ de chiffre d'affaires et 90 salariés [FAIT-2] | Centré sur le créateur et la campagne, pas sur la diffusion des tendances | https://www.kolsquare.com/fr/blog/combien-coute-une-plateforme-de-marketing-dinfluence-guide-complet (2026-07-08) ; https://www.frenchweb.fr/kolsquare-acquiert-storyclash-un-signal-de-maturite-pour-le-marketing-dinfluence/459752 ; https://gensdinternet.fr/2026/01/20/kolsquare-annonce-le-rachat-de-storyclash-une-plateforme-dinfluence-autrichienne/amp/ |
| **Favikon** (Paris) | Marques et agences ; offre créateurs | Offres créateurs : Creator 29 € par mois, Creator Plus 99 €. Offres entreprises : gratuite, Core 159 € par mois en annuel (199 € sinon), Pro 239 € par mois en annuel (299 € sinon) avec **connexion à Claude et ChatGPT par MCP**, Enterprise à partir de 499 € ; API à partir de 199 € par mois [FAIT] | « 118 pays » désigne la clientèle, pas les créateurs couverts [FAIT] | Classements de créateurs, pas de tendances | https://www.favikon.com/pricing (consulté le 2026-11-28) |
| **Hypeo AI** (Casablanca, fondé en 2024) | Marques et créateurs, Afrique et Moyen-Orient | Non public | Mise en relation, recommandations de prix, suivi de performance ; investissement de Renew Capital en août 2025 [FAIT-2] | Influence, pas de tendances | https://www.wamda.com/en/2025/08/hypeoai-secures-investment-simplify-brand-creator-collaborations ; https://allafrica.com/stories/202508190199.html |
| **Zey Connect** (Casablanca) | Marques et créateurs marocains | Non public | Plateforme issue de l'agence Zey, présentée le 2026-02-26 [FAIT-2] | Idem | https://medias24.com/2026/02/27/zey-connect-la-nouvelle-plateforme-marocaine-qui-professionnalise-linfluence-1635107/ |

### 3.6 Famille F : TikTok et commerce social

| Outil | Cible | Prix | Couverture | Ce qui manque | Sources |
|---|---|---|---|---|---|
| **Pentos** | Marques et labels musicaux sur TikTok | Trends Pro 99 $ par mois, Icon 299 $ par mois, prix relevés sur un ancien état du site [FAIT-2, date incertaine] | Classements #discover mondiaux | Site non joignable le 2026-11-28 (erreur DNS), statut inconnu | https://www.capterra.com/p/10007697/Pentos/ |
| **Tokboard** | Musique, créateurs | Gratuit (historiquement) | Classements hebdomadaires et mensuels des sons TikTok ; lancé le 2022-03-14 [FAIT-2] | Site non joignable le 2026-11-28 ; aucune donnée par pays | https://www.producthunt.com/products/tokboard |
| **Kalodata** | Vendeurs TikTok Shop | Environ 46 à 99 $ par mois selon les sources ; prix visibles après connexion [FAIT-2] | « 15+ marchés TikTok » (fiche AWS Marketplace), non nommés [FAIT-2] | Mesure ce qui se vend maintenant là où TikTok Shop est ouvert, pas au Maroc | https://aws.amazon.com/marketplace/pp/prodview-wdvmuktth5m7k ; https://koala-apps.io/blog/kalodata-everything-you-need-to-know/ ; https://www.itechguides.com/products/kalodata/ (vérifié le 2026-10-13) |
| **FastMoss** | Vendeurs TikTok Shop | Basic 49 $, Pro 89 $, Ultimate 139 $ par mois (guides de sept. et oct. 2026) [FAIT-2] | « 20+ pays ou régions » [FAIT], dont France et Allemagne (données d'avril 2026) | Idem ; pas de lecture culturelle | https://www.fastmoss.com/ (consulté le 2026-11-28) ; https://delzonic.com/blogs/fastmoss-pricing-2026/ |
| **Minea** (outil d'origine française) | Dropshippers | Starter 49 $, Premium 99 $, Business 399 $ par mois (34, 69 et 299 $ en annuel) [FAIT-2] | Bibliothèques publicitaires Meta et TikTok | Produits « gagnants » immédiats, aucune transposition | https://affmaven.com/fr/minea-pricing/ ; https://www.trendtrack.io/blog-post/minea-pricing |
| **TrendTrack** | Marques e-commerce | Starter 49 $, Pro 89 $, Business 159 $ par mois [FAIT-2, page de l'éditeur] | Publicités Meta, TikTok et Google ; boutiques | Idem | https://www.trendtrack.io/blog-post/trendtrack-review-2026 |

### 3.7 Newsletters de tendances

| Newsletter | Langue | Modèle | Chiffres | Ce qui manque | Sources |
|---|---|---|---|---|---|
| **Trends** (The Hustle, HubSpot) | Anglais | Premium à 299 $ par an au lancement en 2019 | Statut actuel non vérifié | US uniquement | https://www.subscriptioninsider.com/target/consumer-b2c/the-hustle-launches-299-a-year-premium-newsletter-trends |
| **Trends.vc** | Anglais | 25 $ par mois ou 299 $ par an | 54 782 fondateurs revendiqués | Idem | voir 3.2 |
| **Garbage Day** (Ryan Broderick) | Anglais | Gratuit plus offre payante | De 68 809 à plus de 100 000 abonnés selon les sources, environ 5 % payants ; plus de 500 000 $ de revenu annuel selon un portrait de 2026 [FAIT-2] | Culture Internet américaine | https://garbageday.substack.com/ ; https://www.garbageday.email/p/happy-birthday-garbage-day-35e6 |
| **After School** (Casey Lewis) | Anglais | Gratuit en semaine, digest long payant le lundi | Prix non trouvé ; référence pour les marketeurs Gen Z [FAIT-2] | US uniquement | https://afterschool.substack.com/ ; https://www.glossy.co/?p=191646 |
| **The New Consumer** | Anglais | Accès complet à 200 $ par an | Rapport « Consumer Trends 2026 » | US uniquement | https://www.futurecommerce.com/service-is-the-new-storefront |
| **Cheatcode** | Allemand | Gratuit (beehiiv) | Thèse « les USA d'abord, l'Europe quelques années après » (2025-12-15), **sans aucune donnée** [FAIT] | Preuve que le récit d'arbitrage USA vers Europe circule déjà, sans outil derrière | https://dercheatcode.beehiiv.com/p/from-the-us-to-europe |
| **Swello « Fridaynews »** | Français | Gratuit (blog et newsletter d'un éditeur SaaS) | Actualité hebdomadaire des réseaux sociaux et rubrique « La tendance TikTok de la semaine » [FAIT-2] | Actualité des plateformes ; ne prédit pas l'arrivée des tendances US | https://swello.com/fr/blog/fridaynews-403-pinterest-palette-tiktok-tendances-2026/ |
| **In Bed With Tech** (Marie Dollé) | Français | Substack | Article de 2020 sur la détection de tendances ; citait Magma comme seul acteur français d'analyse de tendances | Ancien ; pas de suivi par pays | https://mariedolle.substack.com/p/dtecter-les-tendances-un-business (2020-08-25) |

[FAIT, dossier France de l'étude] Substack revendique 5 millions d'abonnements payants dans le monde sans chiffre France publié. La plateforme française Kessel existe. Aucune étude indépendante du marché français des newsletters payantes n'a été trouvée (voir `market-france-europe.md`, section 5.4).

**Constat** [ESTIMATION] : je n'ai identifié aucune newsletter francophone, payante ou gratuite, dont le sujet soit « ce qui arrive des USA chez nous, et quand ». La place est libre, mais l'absence de chiffres sur les newsletters payantes en France rend le potentiel incertain.

### 3.8 Maroc et Afrique

| Acteur | Pays | Offre | Langues | Ce qui manque | Source |
|---|---|---|---|---|---|
| **Achgal Listening** | Maroc | « Première plateforme de social listening 100 % marocaine » : analyse de pages Facebook, image d'une personnalité, détection de crise ; étude sur plus de 15 000 commentaires | Darija, arabe classique, 3aransia (darija en caractères latins), français | Écoute locale ; pas de détection de tendances venues des USA. Site non joignable le 2026-11-28 | https://achgal.ma/ (via un résultat de recherche) |
| **Hypeo AI**, **Zey Connect** | Maroc | Influence | | voir 3.5 | |
| **Clouteye** | Nigeria | Intelligence sociale pour créateurs, marques et agences « across the African internet » (juin 2026) [FAIT-2] | Anglais | Pas de francophonie | https://afrotools.com/tools/afrostream/news/clouteye-social-intelligence-african-creators-2026 |
| **FlashNarrative** | Nigeria | Intelligence de marque par l'IA (presse, numérique, réseaux sociaux), 2026 [FAIT-2] | Anglais | Idem | https://www.brandiconimage.com/2026/09/flashnarrative-launches-ai-platform-to.html |
| **Socella** | Nigeria | Gestion des réseaux sociaux par l'IA, bêta payante fin 2025 [FAIT-2] | Anglais | Idem | https://innovation-village.com/inside-socella-how-chioma-nnanna-is-building-africas-first-ai-native-platform-for-social-media-management |
| Projets universitaires d'analyse de sentiment en darija (SENTIMAROC, dépôts GitHub de projets de fin d'études) | Maroc | Classificateurs de sentiment | Darija, arabizi, mélange avec le français | Recherche, pas des produits | https://link.springer.com/chapter/10.1007/978-3-032-07915-2_1 |

**Afrique subsaharienne francophone (Sénégal, Côte d'Ivoire, Cameroun…)** : aucun outil de veille de tendances ou d'écoute sociale dédié n'est apparu dans mes recherches. [HYPOTHÈSE] Le marché est servi par les filiales locales de Kantar et Ipsos et par les agences, sans outil SaaS spécialisé.

### 3.9 Écosystème Claude Code : skills, plugins et serveurs MCP

**Skills et serveurs open source**

| Brique | Ce qu'elle fait | Coût | Indicateurs | Source (date) |
|---|---|---|---|---|
| **`last30days`** (mvanhorn) | Skill qui recherche un sujet sur les 30 derniers jours (Reddit, X, YouTube, Hacker News, Polymarket, TikTok, Instagram, Threads, Pinterest, LinkedIn, Bluesky, web) et rédige une synthèse sourcée | MIT ; Reddit, HN, Polymarket et GitHub sans clé ; X, TikTok, Instagram et autres via des clés tierces (par exemple ScrapeCreators, xAI, Brave) | **76,6 k étoiles**, 6,8 k forks, 1 662 commits [FAIT] | https://github.com/mvanhorn/last30days-skill (consulté le 2026-11-28) |
| **google-trends-mcp** (purahmanian) | Intérêt dans le temps, comparaisons, requêtes associées, intérêt régional | MIT, sans clé, endpoint non officiel | Non vérifié | https://socket.dev/npm/package/google-trends-mcp |
| Google Trends MCP hébergés (Two Minute Reports, HasData) | Google Trends dans Claude | Compte payant ou clé API | | https://mcpservers.org/servers/twominutereports/google-trends-mcp |
| **Trends MCP** | Plus de 30 sources, `get_trends`, `get_growth`, `get_top_trends` | 0 à 199 $ par mois | | voir 3.1 |

**Plugins du répertoire Anthropic** (catalogue interrogé le 2026-11-28)

| Plugin | Éditeur | Contenu | Couverture pays |
|---|---|---|---|
| **TrendsAGI** | TrendsAGI (communauté), v1.1.2, 2026-10-18 | Sujets tendance, trajectoires, audiences, recommandations « evidence-backed » pour équipes média et croissance, via un serveur MCP hébergé, en lecture seule | Non indiquée ; prix non trouvé |
| **Virlo** | Virlo, v0.4.3 | Découverte de tendances TikTok, YouTube Shorts et Reels, sons, hashtags, agents de niche (`trend-scout`, `niche-analysis`, `genre-monitor`) | Non indiquée ; prix : Starter 49 $, Pro 199 $, Enterprise 499 $ par mois [FAIT, https://virlo.ai/pricing, 2026-11-27] |
| **ViralHunt** | ViralHunt, v1.6.35 | Contenus viraux sur une douzaine de réseaux, heures de publication, hashtags, rédaction, **traduction** et planification de posts | Traduction de posts, pas d'analyse entre pays |
| **Viral Swipe File** | v1.3.0, 2026-11-10 | Bibliothèque de vidéos virales classées par niche et format, accroches | Non indiquée |
| **Manifold** | Manifold | Connecteur marketing gratuit (Google, Reddit, TikTok, Instagram, YouTube, bibliothèques publicitaires, magasins d'applications, Amazon) et environ 110 skills, dont `find-tiktok-trends`, `find-reels-trends`, `create-market-entry-plan` | `create-market-entry-plan` est l'élément le plus proche d'une démarche d'entrée sur un pays, mais il ne relève pas les tendances |
| **Game Trend Skills** | malicaki | Tendances du jeu mobile, plans de lancement sans budget pour développeurs solo | |
| UnifAPI, Market Intelligence, Exa Deep Research | communauté et partenaires | Données marketing, veille concurrentielle, recherche web | |

**Connecteurs MCP du répertoire Claude** pertinents : Meltwater, Semrush, Similarweb, vidIQ (`vidiq_trending_videos`), TikTok for Business, AfterShip pour TikTok Shop [FAIT, registre interrogé le 2026-11-28].

**MCP des éditeurs** : SparkToro (OAuth, juin 2026), Meltwater, Brand24, Favikon (Pro), Treendly, TrendWatching (« Your AI »), Hootsuite et Talkwalker (« Lumen MCP », Enterprise).

**Lecture** [ESTIMATION] :

- Collecter les tendances américaines dans Claude Code est déjà possible gratuitement (last30days, google-trends-mcp) ou pour quelques dizaines de dollars par mois.
- Aucun de ces plugins ne compare des pays, ne mesure une diffusion, ne filtre par réglementation ni ne tient de journal de prédictions.
- Le radar doit **consommer ces briques** plutôt que de les refaire, et concentrer son code sur la couche entre pays.

---

## 4. Existe-t-il un outil qui fait l'arbitrage USA vers francophonie avec des initiatives exécutables ?

**Réponse : non, dans le périmètre des recherches menées** (confiance moyenne, voir les limites en section 0).

Le besoin se décompose en quatre fonctions. Voici ce que chaque outil couvre :

| Outil | Détection US | Comparaison entre pays | Modèle de décalage ou de transposabilité | Francophonie, Maghreb ou darija | Initiatives exécutables | Journal de prédictions |
|---|---|---|---|---|---|---|
| Apify TrendGap | oui (produits) | oui (1 à 4 pays d'origine contre 1 de destination) | règle simple (ratio, montée sur 2 mois) | possible (FR ou MA en destination), non testé | non | champ `firstReported` seulement |
| Treendly | oui | filtre par pays (19), comparaison manuelle | non | interface en français ; pays listés non détaillés | non | non |
| Glimpse | oui | volumes par pays, comparaison manuelle | non | non | non | précision revendiquée, non publique |
| Exploding Topics | oui | non documenté | non | non | non | non |
| TrendWatching | oui (innovations) | non | non | non | « Ideation Playbooks » | non |
| Trends.vc | oui | non | non | non | « Opportunity Engine » | non |
| Achgal | non | non | non | oui (darija, français) | non | non |
| Plugins Claude (Virlo, TrendsAGI, ViralHunt, Manifold) | oui | non | non | traduction seulement (ViralHunt) | partiellement (idées de contenu, plans) | non |
| **Radar d'arbitrage (cible)** | oui | **oui, sur plusieurs signaux** | **oui, par classe de friction** | **oui** | **oui, avec stratégie** | **oui, public et horodaté** |

Le récit de l'arbitrage USA vers Europe existe déjà. La newsletter Cheatcode le formule sans données, et l'article « social arbitrage » de Stormy AI le présente comme argument marketing. **Ce qui manque, c'est la mesure** : dater, pays par pays, l'arrivée d'une tendance et en tirer une décision. Le dossier France de l'étude montre que ce décalage n'est pas constant. Sur 16 cas datés, il va de 0 à 6 mois pour les formats, de 5 à 19 mois pour les fonctionnalités de plateforme et de 40 à 60 mois, voire jamais, pour les produits réglementés (`market-france-europe.md`, section 1). Un outil qui ne modélise pas ces classes ne serait pas crédible.

---

## 5. Où se trouve l'espace libre

| Besoin de l'utilisateur francophone | Servi aujourd'hui par | Niveau de service |
|---|---|---|
| « Qu'est-ce qui monte aux USA ? » | Exploding Topics, Glimpse, Treendly, last30days, Virlo | **saturé** |
| « Est-ce déjà arrivé en France, en Belgique, au Québec, au Maroc ? » | Comparaison manuelle dans Glimpse ou Treendly ; Apify TrendGap pour les produits | faible |
| « Quand cela arrivera-t-il, et est-ce bloqué (loi, paiement, plateforme) ? » | Personne | **vide** |
| « Pour quelle tribu, dans quelle niche, dans quel pays ? » | SparkToro (audience, sans temporalité), Kolsquare et Favikon (créateurs) | faible |
| « Que lancer, seul ou à deux, avec Claude Code, et comment ? » | TrendWatching (playbooks génériques), plugins de contenu | faible et générique |
| « Le radar a-t-il eu raison par le passé ? » | Taux de précision non audités (Pinterest 88 %, WGSN 94 %, Glimpse 95 %+) | **vide** |
| Darija et contenus mélangés français et arabe | Achgal (écoute), projets universitaires | faible |

---

## 6. Positionnement recommandé et proposition de valeur

### 6.1 Positionnement

**Catégorie à créer** : « radar d'arbitrage géographique des tendances », pas un outil de veille de plus. Il ne s'agit pas de concurrencer Exploding Topics sur la détection ni Visibrain sur la crise. Il s'agit de vendre **une décision datée par pays**.

Formulation proposée [HYPOTHÈSE] :

> Ce qui monte aux USA, ce qui arrivera chez vous (France, Belgique, Suisse, Québec, Maroc, Afrique francophone), quand, pour quelle tribu, ce qui le bloque, et ce que vous pouvez lancer cette semaine avec une petite équipe. Avec un historique public de nos prédictions, vérifiées.

### 6.2 Proposition de valeur par élément

| Élément | Différence avec l'existant | Preuve à apporter |
|---|---|---|
| Statut par pays (absent, émergent, arrivé, bloqué) et fenêtre d'arrivée estimée | Personne ne le calcule ; Treendly et Glimpse obligent à comparer à la main | Backtest sur les cas datés des dossiers France et Maroc avant le lancement |
| Classe de friction (format, plateforme, réglementé, rails de paiement) | Aucun outil ne modélise le blocage réglementaire ou de paiement par pays | Exemples concrets : TikTok Shop absent au Maroc, ultra fast-fashion interdite en publicité en France au 2027-01-01, Stripe indisponible au Maroc (dossiers voisins) |
| Lecture pays × niche × lifestyle | SparkToro décrit des audiences, sans temps ni pays francophone | Taxonomie publiée et stable, puis mesure de la pertinence auprès des utilisateurs |
| Fiches d'initiatives exécutables avec Claude Code (produit, contenu, service, outil) avec effort, coût, canal, monétisation et risques | Les playbooks de TrendWatching sont génériques ; les plugins Claude produisent des idées de contenu, pas des modèles économiques | Taux d'initiatives réellement lancées par les utilisateurs |
| Journal public de prédictions horodatées et résolues | Les concurrents publient des taux non audités | Score de Brier et taux de réussite par classe, mis à jour automatiquement |
| Français natif, darija prise en compte | Outils anglophones ; Achgal limité à l'écoute locale | Corpus et lexiques de darija ; contrôle humain d'échantillons |

---

## 7. Segments de clients payeurs et fourchettes de prix (si l'outil est vendu)

Repères de prix observés (section 3) : de 8 $ par mois (Treendly) à 299 $ par mois (Glimpse Expert) pour la détection ; 25 $ par mois ou 299 $ par an (Trends.vc) ; 990 $ par an (TrendWatching) ; de 29 à 299 € par mois chez Favikon ; de 49 à 399 $ par mois pour les outils e-commerce ; plusieurs dizaines de milliers d'euros par an pour l'écoute sociale d'entreprise.

| Segment | Problème payé | Offre | Fourchette France et Europe francophone [HYPOTHÈSE] | Fourchette Maroc [HYPOTHÈSE] | Remarques |
|---|---|---|---|---|---|
| Créateurs de contenu et solopreneurs | Être le premier à adapter un format ou une tendance en français | Newsletter premium et alertes par niche | 7 à 15 € par mois (repère : Trends.vc 25 $, Garbage Day environ 5 $) | 49 à 99 MAD par mois, encaissés en dirhams | Au Maroc, le CPM est faible (0,3 à 0,5 $ contre 5 $ pour une audience France ou Canada) et les achats par carte internationale sont plafonnés à 20 000 DH par an et par particulier (dossier Maroc). Il faut encaisser en dirhams, ou viser la diaspora. |
| E-commerçants, porteurs de marques DTC, dropshippers | Lancer un produit avant la concurrence locale | Radar produits avec statut par pays, filtre réglementaire, fiches de lancement | 39 à 99 € par mois (repères : Minea, TrendTrack, FastMoss entre 49 et 159 $) | 149 à 299 MAD par mois | Ce segment paie déjà des outils (dropshippers français). Attention aux interdictions (ultra fast-fashion, nicotine, alcool). |
| Agences (social, influence, innovation), consultants | Vendre de la prospective à leurs clients | Rapports en marque blanche, sièges multiples, export, API et MCP | 149 à 399 € par mois | 1 500 à 3 000 MAD par mois | Repères : Favikon Pro, SparkToro Torch, Brand24 Team. Canal à fort effet de levier. |
| Marques et annonceurs (marketing, innovation) | Anticiper l'arrivée d'une tendance sur leur marché | Étude de transposition sur mesure (pays × niche) et abonnement annuel | 2 000 à 8 000 € l'étude ; 3 000 à 7 500 € par an pour l'abonnement (repère : TrendWatching Enterprise à partir de 7 500 $) | 15 000 à 50 000 MAD l'étude | Cycle de vente long. À ne viser qu'avec un journal de prédictions déjà fourni. |
| Investisseurs (business angels, fonds early stage), studios de création de startups | Thèses de copie adaptée et timing d'entrée sur un marché | Licence « thèses d'arbitrage » trimestrielle, sorties de l'Investor plan | 1 500 à 6 000 € par an | sur devis | Repère : Exploding Topics Investor à 99 $ par mois. Petit segment, mais il paie la crédibilité. |
| Incubateurs et programmes publics (Technopark, programmes d'école, French Tech) | Fournir des idées validées aux porteurs de projets | Licence établissement, ateliers | 2 000 à 10 000 € par an | 20 000 à 80 000 MAD par an, sur budget de programme | Technopark accompagne 233 startups selon le bilan cité dans le dossier Maroc. Achat institutionnel, lent. |
| Médias (pure players, magazines, radios) | Contenu « ce qui arrive des USA » | Syndication ou licence de contenu, chronique sponsorisée | 300 à 1 500 € par mois | sur devis | Canal d'acquisition autant que de revenu. |

**Recommandation d'ordre** [ESTIMATION] :

1. Lancer une newsletter gratuite pour obtenir l'audience et un journal public.
2. Ouvrir un premium à 9 à 12 € par mois pour les créateurs, e-commerçants et indépendants.
3. Ajouter une offre agence à 199 € par mois.
4. Proposer les études pour les marques une fois que le journal contient au moins 6 à 12 mois de prédictions résolues.

Encaissement : Paddle vraisemblablement possible pour une entité marocaine, Stripe non (dossier Maroc, section 3.4). Pour les clients résidant au Maroc, encaisser en dirhams via CMI ou un établissement de paiement local.

---

## 8. Canaux d'acquisition

### 8.1 France et Europe francophone

| Canal | Pourquoi | Comment [HYPOTHÈSE] |
|---|---|---|
| Newsletter (Substack ou beehiiv, éventuellement Kessel) | Aucune newsletter francophone sur « ce qui arrive des USA » n'a été identifiée | Une édition par semaine : 3 tendances US, leur statut par pays, 1 initiative détaillée, et le bilan des prédictions arrivées à échéance |
| LinkedIn (marketeurs, fondateurs, agences) | Les annonceurs français investissent 587 M€ en influence en 2025 et 69 % prévoient de hausser leur budget en 2026 (dossier France) | Publier des cas datés (« annoncé le X, arrivé le Y »), publier les échecs aussi |
| SEO francophone | Les requêtes « tendances TikTok 2027 », « tendance USA France » sont peu servies en français [HYPOTHÈSE à mesurer] | Une page par tendance et par pays, générée et mise à jour par l'outil |
| Partenariats d'éditeurs SaaS et médias marketing | Swello publie déjà « La tendance TikTok de la semaine » | Échange de contenus ou rubrique « venue des USA » |
| Événements | Paris Creator Week (lieu de présentation du Creator Economy Report 2026, le 2026-11-04, dossier France) | Tenir un stand ou donner une conférence avec la présentation du journal de prédictions |
| Répertoire de plugins Claude | Le répertoire contient déjà des plugins de tendances (Virlo, TrendsAGI…) | Publier le radar comme plugin ; c'est le canal naturel des utilisateurs de Claude Code |

### 8.2 Maroc

| Canal | Pourquoi | Comment [HYPOTHÈSE] |
|---|---|---|
| LinkedIn | 8,4 M de membres au Maroc (+21,7 %, dossier Maroc) | Contenu en français et en darija courte sur les tendances qui arrivent |
| Instagram, TikTok, chaînes et communautés WhatsApp | TikTok progresse le plus vite (19,6 M d'adultes en audience publicitaire) ; WhatsApp domine (dossier Maroc) | Formats courts « ça arrive au Maroc » ; chaîne WhatsApp gratuite comme équivalent de la newsletter |
| Écosystème startup | Technopark (6 sites), GITEX Africa du 26 au 28 avril 2027 à Marrakech (dossier Maroc) | Licences pour incubateurs, ateliers « copier, adapter, lancer » |
| Agences d'influence (Hypeo, Zey) | Ce sont des clients agences et des relais vers les créateurs | Rapports en marque blanche |
| Diaspora (MRE) | Pouvoir d'achat en euros, utilisation des rails de paiement européens (dossier Maroc) | Offre Europe francophone, avec un angle Maroc |

---

## 9. Avantage défendable : le journal de prédictions vérifiées

### 9.1 Pourquoi c'est défendable

- **Les concurrents revendiquent sans prouver.** Pinterest (88 % sur six ans, méthode non publiée), WGSN (94 %, astérisque non expliqué), Glimpse (95 %+ en backtest). Je n'ai trouvé aucun journal public et horodaté.
- **Le journal s'accumule avec le temps.** Un concurrent qui démarre plus tard ne peut pas rattraper l'historique, et chaque mois ajoute des prédictions résolues.
- **Il produit des données propriétaires.** Les dates d'arrivée observées par pays, niche et classe de friction améliorent le modèle de décalage, et ce jeu de données n'existe nulle part ailleurs.
- **Il fait du contenu marketing.** « Nous avions annoncé X au Maroc pour le T2, c'est arrivé le 14 mai » est un post LinkedIn ou une rubrique de newsletter tout trouvé.

### 9.2 Spécification minimale [HYPOTHÈSE de conception]

| Champ | Contenu |
|---|---|
| `prediction_id`, `created_at` (UTC) | identifiant stable et horodatage |
| `trend_id`, `niche`, `lifestyle` | rattachement à la taxonomie |
| `origin_evidence` | URL et instantané des métriques US au moment de la prédiction (valeurs, source, date de collecte) |
| `target_country` | FR, BE, CH, CA-QC, MA, SN, CI… |
| `friction_class` | format, plateforme, réglementé, paiement, culture |
| `predicted_window` | par exemple « arrivée entre 3 et 9 mois », avec une probabilité |
| `arrival_criterion` | règle mesurable définie à l'avance, par exemple un seuil de consultations Wikipedia dans la langue cible, un ratio Google Trends destination sur origine, ou un nombre de contenus locaux au-dessus d'un seuil de vues |
| `status` | en attente, arrivée, échec, bloquée |
| `resolved_at`, `resolution_evidence` | date et preuve de résolution |
| `hash`, `prev_hash` | chaîne de hachage SHA-256 en ajout seul ; empreinte publiée chaque semaine dans la newsletter ou dans un dépôt public, pour prouver l'antériorité |

Indicateurs publiés : taux de réussite par classe de friction et par pays, score de Brier et courbe de calibration, erreur médiane sur la date d'arrivée.

**Règles d'honnêteté** :

- publier les échecs ;
- ne jamais modifier une prédiction après coup (on en crée une nouvelle qui renvoie à l'ancienne) ;
- annoncer les critères avant de connaître le résultat.

### 9.3 Autres avantages, plus faibles

- Corpus francophone et darija, avec des lexiques par tribu.
- Base réglementaire par pays et par niche (dossiers France et Maroc).
- Bibliothèque de fiches d'initiatives testées par des utilisateurs, avec leurs résultats.

Chacun de ces éléments peut être copié. Seul le journal daté ne le peut pas.

---

## 10. Risques principaux

| Risque | Probabilité et impact [ESTIMATION] | Parade |
|---|---|---|
| **Un acteur installé ajoute une fonction « gap entre pays »** : Glimpse et Treendly ont déjà les volumes par pays, Exploding Topics a les ressources d'Adobe | moyenne, impact fort | Avance sur le journal et la francophonie ; ces acteurs sont orientés USA et marché mondial ; être consommateur de leurs API plutôt que concurrent frontal |
| **La détection devient une commodité** (last30days, plugins gratuits) | élevée, impact moyen | Ne pas vendre la détection ; vendre la décision par pays et l'historique |
| **Dépendance aux données** : API Google Trends toujours en alpha restreinte (lancée le 2025-07-24, sans prix ni disponibilité générale trouvés), scraping TikTok et Instagram soumis aux conditions d'utilisation, coûts des API tierces | élevée, impact fort | Multiplier les signaux (Wikipedia, Reddit, Google Trends non officiel, MCP payants en option apportés par l'utilisateur) ; documenter les dégradations |
| **Crédibilité** : le décalage n'est pas constant et des prédictions fausses peuvent tuer la marque | moyenne, impact fort | Classes de friction, fenêtres larges, probabilités, publication des échecs, backtest avant le lancement |
| **Faible consentement à payer en francophonie** (CPM marocain faible, fatigue des abonnements en France, absence de chiffres sur les newsletters payantes) | élevée, impact moyen | Modèle d'audience d'abord, puis B2B (agences, marques, incubateurs), prix en dirhams |
| **Encaissement depuis le Maroc** (Stripe indisponible, plafonds de change) | certaine, impact moyen | Paddle ou une entité européenne, CMI en dirhams, contrats d'export de services (dossier Maroc) |
| **Juridique** : recommander une initiative dans une niche interdite (influence sur la chirurgie esthétique, la nicotine, la crypto ou l'ultra fast-fashion en France ; données personnelles sous la CNDP au Maroc) | moyenne, impact fort | Filtre réglementaire bloquant par pays et par niche dans chaque fiche d'initiative ; agréger par tendance sans profiler les personnes |
| **Bande passante d'une personne seule** (veille sur 7 marchés ou plus) | élevée, impact moyen | Automatiser la collecte et la résolution ; commencer par FR et MA, puis ajouter BE, CH, QC, puis l'Afrique subsaharienne |
| **Consolidation** (Adobe et Semrush, Onclusive et Digimind, Hootsuite et Talkwalker, rachats de Kolsquare) | en cours, impact faible à court terme | Ces acteurs montent vers les grands comptes et laissent le bas de marché libre |

---

## 11. Implications concrètes pour l'outil

1. **Ne pas recoder la collecte US.** Brancher des briques existantes : un collecteur de type last30days, Google Trends (non officiel tant que l'API reste en alpha), Wikipedia, Reddit, et Trends MCP en option. Le code propre sert à la comparaison entre pays, à la résolution et au journal.
2. **Modèle de données central `Trend × Pays × Niche × Lifestyle`**, avec pour chaque pays un statut (absent, émergent, arrivé, bloqué), une classe de friction et une fenêtre d'arrivée.
3. **Module « journal de prédictions »** en ajout seul (JSONL plus chaîne SHA-256), avec une tâche planifiée de résolution et un tableau public des scores (taux de réussite, Brier, erreur sur la date).
4. **Backtest avant le lancement** sur les cas datés des dossiers France et Maroc, pour publier une précision honnête dès le premier jour.
5. **Filtre réglementaire bloquant** dans chaque fiche d'initiative : loi influenceurs, ultra fast-fashion, Evin, santé publique en France ; TikTok Shop, paiements et CNDP au Maroc.
6. **Sortie principale : des fiches d'initiatives**, avec type, effort, coût, outils Claude Code utilisés, canal, monétisation, risques et indicateurs de succès, pas seulement des tableaux de bord.
7. **Distribution** : plugin Claude Code et serveur MCP publiés dans le répertoire ; newsletter hebdomadaire générée à partir du même noyau ; pages SEO par tendance et par pays.
8. **Interopérabilité en option** avec des MCP payants (SparkToro, Brand24, Meltwater, Favikon) en « bring your own key », pour les utilisateurs qui en ont déjà.
9. **Analyse dans les deux sens** (Europe vers USA, voir le dossier France) et pays sentinelles par type de tendance (Royaume-Uni pour les fonctionnalités de plateforme, Espagne pour les sports de raquette…).
10. **Ne pas construire de fonctions d'écoute de crise ou d'e-réputation**, terrain de Visibrain, Talkwalker et Onclusive.
11. **Gestion de la darija et des contenus mélangés** dès la première version au Maroc : lexiques, translittération de l'arabizi, contrôle humain d'échantillons.
12. **Taxonomie lifestyle publiée et stable**, pour que les segments du journal restent comparables dans le temps.

---

## 12. Questions ouvertes

1. Un éditeur américain (Glimpse, Treendly, Exploding Topics sous Adobe) prépare-t-il une fonction de comparaison ou de décalage entre pays ? Aucune annonce trouvée.
2. Quelles sont les 19 pays du filtre Treendly ? Le Maroc et le Québec y figurent-ils ? Que valent leurs données hors USA ?
3. Quels prix et quelle couverture géographique pour TrendsAGI ? Virlo et ViralHunt couvrent-ils des pays francophones ?
4. Pentos, Tokboard et Achgal sont-ils encore actifs ? Les sites n'étaient pas joignables depuis l'environnement de recherche.
5. Quel est le consentement à payer réel des créateurs et e-commerçants francophones pour une alerte « arrivée dans votre pays » ? À mesurer par une page d'attente et des précommandes.
6. Quel critère d'arrivée est à la fois mesurable et accepté par les utilisateurs, pour chaque pays ? La disponibilité des signaux diffère au Maroc et en Afrique subsaharienne.
7. Faut-il viser d'abord la France, plus solvable, ou le Maroc, moins concurrencé mais plus difficile à monétiser ?
8. L'interface du répertoire de plugins Claude permet-elle de vendre directement un plugin, ou la monétisation doit-elle passer par un serveur MCP avec clé payante ?
9. Quelle valeur ont les taux de précision des concurrents ? Une vérification indépendante de quelques prédictions Pinterest ou WGSN pourrait servir d'argument comparatif.
10. Quel est le statut juridique de la collecte de contenus publics sur les réseaux sociaux pour une entité marocaine qui héberge hors du Maroc (CNDP, transfert à l'étranger) ?

---

## 13. Sources principales (consultées le 2026-11-28 sauf mention contraire)

Pages des éditeurs :
- https://explodingtopics.com/pricing ; https://explodingtopics.com/blog/exploding-topics-pro-vs-free (2026-03-23) ; https://explodingtopics.com/blog/exploding-topics-vs-trendhunter (2026-06-15)
- https://meetglimpse.com/ ; https://outlierkit.com/resources/glimpse-pricing/ (2026-08-14)
- https://treendly.com/pricing ; https://treendly.com/
- https://join.trends.vc/ ; https://access.trends.vc/
- https://www.trendwatching.com/pricing
- https://www.wgsn.com/en/products/fashion-design ; https://www.wgsn.com/en/what-we-do/ai-data
- https://sparktoro.com/pricing ; https://sparktoro.com/mcp/docs ; https://sparktoro.com/blog/sparktoros-mcp-server-is-now-live-connect-audience-research-directly-to-your-favorite-ai-tool/
- https://buzzsumo.com/pricing/
- https://www.talkwalker.com/social-listening ; https://www.hootsuite.com/fr/plans
- https://www.meltwater.com/en/blog/meltwater-mcp (2026-08-03) ; https://www.meltwater.com/en/press-releases/meltwater-mcp
- https://www.visibrain.com/pricing
- https://www.digimind.com/en/news/onclusive-social-website-www.digimind.com-to-close-on-19th-march-2026 (2026-02-20)
- https://brand24.com/prices/ ; https://brand24.com/mcp/
- https://www.kolsquare.com/fr/blog/combien-coute-une-plateforme-de-marketing-dinfluence-guide-complet (2026-07-08)
- https://www.favikon.com/pricing
- https://www.fastmoss.com/
- https://virlo.ai/pricing (2026-11-27)
- https://apify.com/trendgap/trend-gap
- https://github.com/mvanhorn/last30days-skill
- https://glama.ai/mcp/servers/ng9vus0xd0 (Trends MCP) ; https://apify.com/trendsmcp/brand-monitoring-mcp
- https://developers.google.com/search/blog/2025/07/trends-api (2025-07-24) ; https://www.seroundtable.com/google-trends-api-seo-access-39957.html (oct. 2025)
- https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition (2026-04-28)
- https://heuritech.com/market-reports/trend-calendar-2026/ ; https://www.spate.nyc/reports/beauty-pulse-2026-mapping-beauty-by-category-and-market (2026-05-12)
- Répertoire de plugins Anthropic et registre de connecteurs MCP (interrogés depuis la session le 2026-11-28)

Sources secondaires :
- https://www.vendr.com/marketplace/brandwatch ; https://www.vendr.com/marketplace/meltwater
- https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/93287/917870886671618-pricing-document-2025-09-26-0912.pdf (2025-09-26)
- https://www.trustradius.com/products/pulsar-core/pricing
- https://www.logiciels.pro/visibrain/ ; https://www.caplight.com/company/visibrain
- https://www.softwareadvice.com/competitive-intelligence/digimind-profile/
- https://www.creator-hero.com/fr/blog/kolsquare-pricing-and-review ; https://www.frenchweb.fr/kolsquare-acquiert-storyclash-un-signal-de-maturite-pour-le-marketing-dinfluence/459752 ; https://gensdinternet.fr/2026/01/20/kolsquare-annonce-le-rachat-de-storyclash-une-plateforme-dinfluence-autrichienne/amp/
- https://www.capterra.com/p/10007697/Pentos/ ; https://www.producthunt.com/products/tokboard
- https://aws.amazon.com/marketplace/pp/prodview-wdvmuktth5m7k ; https://koala-apps.io/blog/kalodata-everything-you-need-to-know/ ; https://www.itechguides.com/products/kalodata/
- https://delzonic.com/blogs/fastmoss-pricing-2026/
- https://affmaven.com/fr/minea-pricing/ ; https://www.trendtrack.io/blog-post/minea-pricing ; https://www.trendtrack.io/blog-post/trendtrack-review-2026
- https://www.ki-syndikat.de/tools/trendalytics/
- https://dercheatcode.beehiiv.com/p/from-the-us-to-europe (2025-12-15) ; https://stormy.ai/blog/social-arbitrage-spotting-viral-consumer-trends
- https://fortune.com/2026/10/15/pinterest-predicts-2026-trends-accuracy-brooches-funhaus/ (2026-10-15)
- https://www.subscriptioninsider.com/target/consumer-b2c/the-hustle-launches-299-a-year-premium-newsletter-trends ; https://garbageday.substack.com/ ; https://www.garbageday.email/p/happy-birthday-garbage-day-35e6 ; https://afterschool.substack.com/ ; https://www.glossy.co/?p=191646 ; https://www.futurecommerce.com/service-is-the-new-storefront
- https://swello.com/fr/blog/fridaynews-403-pinterest-palette-tiktok-tendances-2026/ ; https://mariedolle.substack.com/p/dtecter-les-tendances-un-business (2020-08-25)
- https://achgal.ma/ ; https://www.wamda.com/en/2025/08/hypeoai-secures-investment-simplify-brand-creator-collaborations ; https://allafrica.com/stories/202508190199.html ; https://medias24.com/2026/02/27/zey-connect-la-nouvelle-plateforme-marocaine-qui-professionnalise-linfluence-1635107/ ; https://afrotools.com/tools/afrostream/news/clouteye-social-intelligence-african-creators-2026 ; https://www.brandiconimage.com/2026/09/flashnarrative-launches-ai-platform-to.html ; https://innovation-village.com/inside-socella-how-chioma-nnanna-is-building-africas-first-ai-native-platform-for-social-media-management
- https://socket.dev/npm/package/google-trends-mcp ; https://mcpservers.org/servers/twominutereports/google-trends-mcp

Dossiers voisins de l'étude, réutilisés pour le contexte des marchés :
- `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/market-france-europe.md`
- `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/market-maroc-maghreb.md`

---

## Contre-vérification

Contre-vérification indépendante du 2026-11-28. Méthode : relecture directe des pages des éditeurs (WebFetch ou curl), du document G-Cloud 14 de Brandwatch, de l'IGOC 2026 (PDF officiel de l'Office des changes déjà téléchargé dans `cv_ma_dl/igoc.txt`), de l'API publique d'Apify (statistiques de l'actor), du catalogue de plugins Claude (SearchPlugins) et du catalogue de dépôts GitHub.

**Limite** : le budget de recherche web de la session était épuisé dès ma première requête. Je n'ai donc mené aucune nouvelle recherche par moteur. Les absences (pas de concurrent, pas de newsletter francophone, pas de disponibilité générale de l'API Google Trends) ne sont pas revérifiées au-delà des pages et catalogues interrogés directement. WGSN, TrendHunter, FrenchWeb et Subscription Insider renvoient une erreur HTTP 403 depuis cet environnement, et achgal.ma n'a pas d'enregistrement DNS.

### Verdicts

| # | Affirmation | Verdict | Constat et correction | Source primaire |
|---|---|---|---|---|
| 1 | Aucun outil ne fait l'arbitrage USA vers francophonie avec décalage par pays et initiatives | **non vérifiable** (absence) | Rien trouvé non plus dans mes interrogations directes : 4 requêtes sur le catalogue Apify, 4 sur GitHub, 2 sur le répertoire de plugins Claude. Trois éléments manquaient au dossier. (a) **Waldo fyi** est un plugin du répertoire avec une commande `trend-radar` : veille de marque par agents pour agences US, 49 $ les 100 crédits, rapports « Monitor » à partir de 249 $ par rapport, sans dimension pays. (b) Le dépôt de recherche `stevie-ml/trends_across_space` (créé le 2026-01-26, 0 étoile) pose exactement la question « où naissent les tendances et quels décalages mesurables entre pays ». (c) L'actor TrendGap a été créé le **2026-11-02**. L'idée émerge donc en ce moment. | api.apify.com/v2/store ; GitHub search API ; SearchPlugins ; https://www.waldo.fyi/pricing |
| 2 | Apify « Google Trends Gap Finder » : 100 $ pour 1 000 alertes, 2 utilisateurs, 0,0 % de réussite, backtest sur 19 produits | **confirmé** (précisé) | Données de l'API Apify : créé le 2026-11-02, 27 runs au total, **21 runs sur 21 en timeout sur les 30 derniers jours**, aucune réussite, 1 utilisateur mensuel. Tarifs : 0,10 $ par alerte (soit 100 $ pour 1 000), plus 0,01 $ par produit vérifié. Règles (×1,5 sur 6 à 12 mois, destination à moins de 50 % de l'origine, montée sur 2 mois), origines US, GB et KR, destination ES et backtest sur 19 produits : confirmés. L'actor déclare lui-même dépendre d'un Google Trends non officiel. | https://apify.com/trendgap/trend-gap ; https://api.apify.com/v2/acts/trendgap~trend-gap |
| 3 | Treendly : 19 pays plus Worldwide, **seuls les USA en gratuit** ; Glimpse « n'importe quel pays » ; Exploding Topics sans filtre pays | **corrigé** | Le sélecteur de la page d'accueil Treendly propose « All » (Worldwide) en gratuit. **Les 19 pays, USA compris, sont marqués PRO** : US, AE, AR, AU, BR, CA, CO, DE, ES, FR, GB, IN, IT, JP, KR, MX, NL, NZ, PL. Ni le Maroc, ni la Belgique, ni la Suisse, ni le Sénégal, ni la Côte d'Ivoire n'y figurent ; le Canada est national (pas de Québec). La page de prix ne parle pas de pays. L'interface existe bien en six langues, dont le français. Glimpse (« any country », 95 %+ en backtest, plus de 200 000 utilisateurs de l'extension) : confirmé. Exploding Topics : aucune mention de pays, région ou langue sur la page de prix (confirmé). En revanche, la « Trends API » n'y apparaît pas non plus. | https://treendly.com/ ; https://treendly.com/pricing ; https://meetglimpse.com/ ; https://explodingtopics.com/pricing |
| 4 | Repères de prix (Treendly, Exploding Topics, Glimpse, Trends.vc, TrendHunter, TrendWatching, WGSN) | **confirmé** pour les sources primaires | Confirmés : Treendly Pro à 99 $ par an ; Exploding Topics à 39, 99 et 249 $ par mois (facturation mensuelle seulement) ; Trends.vc à 25 $ par mois ou 299 $ par an ; TrendWatching Pioneer à 990 $ ou 850 € par an, Enterprise à partir de 7 500 $ par an. Glimpse à 99 et 299 $ : source tierce et concurrente uniquement (OutlierKit, 2026-08-14), Glimpse n'a pas de page de prix. TrendHunter à 199 $ : non vérifiable (403). WGSN : non vérifiable (403). | pages de prix citées |
| 5 | Écoute sociale : Brandwatch de 13 800 à 39 000 £ par an (G-Cloud 2025), Brand24 de 199 à 599 $ par mois | **corrigé** | Dans le PDF G-Cloud 14, **13 800, 22 200 et 39 000 £ par an sont les offres Social Media Management** (Falcon.io : Standard, Pro, Premium), pas l'écoute. L'écoute, « Consumer Intelligence », coûte en offre Pro de 10 800 £ par an (5 requêtes) à 27 900 £ (20 requêtes), en Premium de 21 000 à 88 200 £, et en Enterprise de 37 200 à 98 760 £ (40 requêtes), voire 109 200 £ au modèle par mentions. L'offre Pro est une offre de juin 2025, à -57,33 % sur 3 ans. Brand24 : 199 à 599 $ par mois **en annuel**, 249 à 699 $ en mensuel, Enterprise à partir de 1 499 $, API à 149 $. L'ordre de grandeur à cinq chiffres reste juste. | PDF G-Cloud 14 (2025-09-26), pages 4 à 9 ; https://brand24.com/prices/ |
| 6 | Le MCP est un standard chez les éditeurs (SparkToro juin 2026, Meltwater 2025 puis 2026-07-08, Brand24, Favikon Pro, Treendly, TrendWatching, Hootsuite Enterprise) | **confirmé** | SparkToro : billet de lancement publié le 2026-06-24, MCP gratuit avec tout abonnement payant à partir de Spark (150 $ par mois). Meltwater : communiqué du 2026-07-08 (« hosted MCP natively since June 2025 »). Hootsuite : Lumen et son connecteur MCP réservés à l'offre Enterprise ; prévision de tendances à 90 jours dès Professional (199 $). Favikon : « Connect with Claude or ChatGPT » en Pro. Treendly : API et MCP sur toutes les offres. Brand24 : MCP listé. Précision : TrendWatching annonce un accès « Your AI » dans ChatGPT, Claude et Mistral, sans parler de MCP. | pages citées ; https://www.meltwater.com/en/press-releases/meltwater-mcp |
| 7 | Écosystème Claude : last30days (76,6 k étoiles), Trends MCP (gratuit jusqu'à 100 requêtes, puis 19 à 199 $), plugins TrendsAGI, Virlo, ViralHunt, Manifold ; aucun ne compare des pays | **confirmé** (complété) | last30days : 76,6 k étoiles, 6,8 k forks, 1 662 commits, licence MIT, aucun paramètre pays. Trends MCP, sur son propre site : 0, 19, 49 et 199 $ par mois pour 100, 1 000, 5 000 et 25 000 requêtes, sans paramètre géographique documenté. Virlo : 49, 199 et 499 $ par mois. TrendsAGI (v1.1.2, 2026-10-18), ViralHunt (v1.6.35), Virlo (v0.4.3), Manifold et Game Trend Skills sont bien présents dans le répertoire. **À ajouter** : Waldo fyi (`trend-radar`) et AI Search Visibility Tracker (skill `search-trends`). | https://github.com/mvanhorn/last30days-skill ; https://www.trendsmcp.ai/pricing ; https://virlo.ai/pricing ; SearchPlugins |
| 8 | Les taux de précision publiés ne sont pas audités (Pinterest 88 %, WGSN 94 %, Glimpse 95 %+) | **confirmé** (WGSN non revu) | Fortune (2026-10-15) attribue les 88 % sur six ans à Pinterest, sans méthode ni audit. Glimpse affiche « 95%+ backtested accuracy » sans méthode. La page WGSN renvoie 403 : les 94 % ne sont pas revérifiés. | https://fortune.com/2026/10/15/pinterest-predicts-2026-trends-accuracy-brooches-funhaus/ ; https://meetglimpse.com/ |
| 9 | API Google Trends officielle en alpha restreinte depuis le 2025-07-24, sans prix ni disponibilité générale | **confirmé** | Billet du 2025-07-24 : alpha, « very limited number of testers ». La page officielle dit toujours, le 2026-11-28, « Get early access to the Google Trends API alpha » et « accepting applications for alpha testers », sans prix. L'API prévoit la comparaison entre pays et sous-régions (ISO 3166-2) et des données à échelle cohérente sur 5 ans. Je n'ai pas pu chercher d'annonce ultérieure (budget épuisé). | https://developers.google.com/search/blog/2025/07/trends-api ; https://developers.google.com/search/apis/trends |
| 10 | Newsletters : The Hustle Trends à 299 $ par an (2019) ; Trends.vc à 299 $ par an avec 54 782 fondateurs ; Garbage Day avec environ 5 % de payants et plus de 500 k$ de revenu | **corrigé** | (a) **trends.co redirige aujourd'hui vers blog.hubspot.com/trends** : l'offre payante n'existe plus de façon autonome. Le prix de 2019 n'est pas revérifiable (403). (b) Trends.vc : les 54 782 « founders » figurent sur la page de la newsletter gratuite (join.trends.vc), alors que la page de l'offre payante annonce « 1,000+ Founders ». On ne peut pas présenter 54 782 comme un nombre de payants. (c) Garbage Day, billet d'anniversaire du 2026-05-01 : plus de 100 000 lecteurs, « well over 5% » de payants, premium à 5 $ par mois ou 45 $ par an, revenu 2026 « in spitting distance of $1 million », publicité, conseil (GDMI) et podcast compris. Le chiffre de 500 k$ est périmé. | https://join.trends.vc/ ; https://access.trends.vc/ ; https://www.garbageday.email/p/happy-birthday-garbage-day-35e6 ; redirection de https://trends.co/ |
| 11 | Consolidation : Adobe a finalisé le rachat de Semrush (environ 1,9 Md$, 2026-04-28) ; Onclusive a absorbé Digimind ; Kolsquare a racheté Storyclash (2026-01-20) | **confirmé** (partiellement) | Adobe : annonce de novembre 2025 à 12 $ par action, soit environ 1,9 Md$, finalisation le 2026-04-28. Exploding Topics est une marque de Semrush (pied de page). digimind.com redirige vers news-en.onclusive.com. Kolsquare et Storyclash, le 2026-01-20 : confirmé (Gens d'Internet), tout comme l'appartenance à team.blue et les rachats de Woomio (décembre 2024) et d'Inflead (décembre 2025). L'ensemble sert plus de 2 000 clients dans 30 pays. Le chiffre d'affaires d'environ 15 M€ et les « créateurs dans 180 pays » ne sont pas vérifiables (FrenchWeb en 403). | https://news.adobe.com/news/2025/11/adobe-to-acquire-semrush ; https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition ; Gens d'Internet (2026-01-20) |
| 12 | Maroc : achats par carte internationale plafonnés à 20 000 DH par an et par particulier ; Stripe indisponible | **confirmé** (précisé) | IGOC 2026, section 7 « Commerce électronique à l'international » : dotation de 20 000 DH « par année civile et par bénéficiaire » pour les particuliers résidents et les MRE (au lieu de 15 000). Le Maroc est absent de stripe.com/global. **Précision utile** : la Côte d'Ivoire, le Ghana, le Kenya, le Nigeria et l'Afrique du Sud y figurent en « Extended network » via Paystack. L'indisponibilité de Stripe ne vaut donc pas pour toute l'Afrique francophone. | `cv_ma_dl/igoc.txt` (IGOC 2026, p. 83 à 85) ; https://stripe.com/global |
| 13 | Fourchettes de prix recommandées (créateurs de 7 à 15 €, agences de 149 à 399 €…) | **non vérifiable** (hypothèses) | Ce sont des hypothèses de conception. Les repères qui les fondent sont en grande partie confirmés (lignes 4 à 7), sauf Brandwatch (ligne 5) et les benchmarks de newsletters (ligne 10), qui sont à corriger. | sans objet |

### Corrections à reporter dans le corps du dossier

- Section 3.1 et synthèse, point 3 : Treendly propose « Worldwide » en gratuit, et **tous les pays, USA compris, sont en Pro**. Liste des 19 pays : US, AE, AR, AU, BR, CA, CO, DE, ES, FR, GB, IN, IT, JP, KR, MX, NL, NZ, PL. Cela répond à la question ouverte 2 : ni le Maroc, ni le Québec.
- Section 3.4 et synthèse, point 2 : Brandwatch Consumer Intelligence coûte de 10 800 à environ 99 000 £ par an. Les 13 800 à 39 000 £ correspondent à la gestion des réseaux sociaux.
- Section 3.7 : Garbage Day approche 1 M$ de revenu en 2026 (autodéclaré, tout compris). Trends.vc compte 54 782 abonnés à la newsletter gratuite contre « 1 000+ » membres Pro. The Hustle Trends redirige vers le blog HubSpot.
- Section 3.9 : ajouter Waldo fyi (`trend-radar`) et AI Search Visibility Tracker au tableau des plugins.
- Section 3.1 : TrendGap a été créé le 2026-11-02, et ses 21 runs des 30 derniers jours ont tous dépassé le délai.
