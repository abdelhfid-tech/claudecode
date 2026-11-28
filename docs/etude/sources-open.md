# Axe : signaux OUVERTS hors plateformes sociales pour mesurer un décalage USA → France → Maroc

**Date de l'étude : 28 novembre 2026.** Les tests `curl` ont été lancés le 28/11/2026 entre 12 h et 14 h UTC depuis l'environnement de l'étude. Le trafic sort par un proxy partagé avec d'autres agents. Une partie des 429 observés (Wikimedia, GDELT, Google Trends) vient très probablement de cette **IP de sortie partagée** et non d'un usage individuel excessif : c'est une estimation, à revérifier depuis une IP dédiée.

**Reprise.** Ce dossier reprend la transcription d'un agent précédent interrompu. Ses fichiers de test (`scratchpad/work/out1..out10`) ont été relus, et les appels clés ont été **rejoués** aujourd'hui (`scratchpad/work2/`).

**Limite de méthode.** Le quota de recherches web de la session était épuisé pendant la seconde moitié de l'étude. Les faits datés suivants viennent donc de pages primaires lues directement (WebFetch ou curl) ou de recherches faites plus tôt dans la session. Ce qui n'a pas pu être revérifié porte la mention « à vérifier ».

Légende : **[V]** fait vérifié, par un test ou sur une page primaire datée. **[E]** estimation ou interprétation. **[H]** hypothèse non testée. **[S]** source secondaire (blog tiers).

---

## 1. Synthèse

1. **Les comparaisons entre pays reposent sur un petit nombre de sources gratuites, et aucune n'a d'API officielle ouverte.** L'API Google Trends officielle est toujours une **alpha accessible sur candidature** au 28/11/2026 [V] ([developers.google.com/search/apis/trends](https://developers.google.com/search/apis/trends), consultée le 28/11/2026). Les meilleures séries temporelles comparables entre US, FR et MA viennent de l'endpoint non officiel `trends/api/explore` puis `widgetdata/multiline`. Il a répondu 200 aujourd'hui, même quand l'amorce de cookie renvoyait un 429 [V].
2. **Mesure faite sur un cas réel, Labubu** (une seule requête Trends US+FR+MA, donc une échelle commune) : la première semaine ≥ 5 tombe le 13–19 oct. 2024 aux US, le 27 avr.–3 mai 2025 en FR et le 4–10 mai 2025 au MA. Le décalage est d'environ 28 semaines des US vers la FR, puis d'environ 1 semaine de la FR vers le MA [V, test du 28/11/2026]. Wikipedia et la presse marocaine confirment cette chronologie (Le Matin le 23/06/2025, Hespress le 01/07/2025) [V].
3. **Les classements d'apps sont le signal de décalage le plus propre et le plus « produit ».** Le RSS Apple v2 (jusqu'à 100 entrées, storefronts `us`, `fr`, `ma`, `sn`, `ci`, `dz`, `tn` testés en 200) et le top Google Play (200 apps par pays et par catégorie via `batchexecute`) suffisent. Aujourd'hui, **18 des 30 premières apps gratuites iOS aux US sont absentes à la fois des top 100 FR et MA**. Côté Google Play, **24 des 50 premières apps US sont absentes des top 200 FR et MA** [V].
4. **Wikimedia combine deux briques utiles.** La première est l'API Pageviews (par article et par édition linguistique, depuis 2015). La seconde est un jeu de données quotidien **pays × page × QID Wikidata**, protégé par confidentialité différentielle (fichier TSV de 15 à 16 Mo par jour, depuis le 06/02/2023) [V]. Le Maroc y est très peu couvert : 87 lignes le 27/11/2026, contre 10 770 pour la France et 97 501 pour les US [V]. Les seuils de publication sont de 90, 550 ou 1 000 vues selon le niveau de risque du pays [V].
5. **Le Maroc demande d'autres signaux que les volumes.** Les volumes sont faibles, bruités ou masqués. Les signaux de **présence** sont plus fiables : app présente ou non dans un top, suggestion d'autocomplétion localisée (« chocolat dubai **marjane** / **prix maroc** / **casablanca** ») [V], premier article dans un média marocain précis. Ce sont eux qui datent l'arrivée.
6. **Google News RSS est indispensable pour dater l'arrivée dans la presse**, grâce aux opérateurs `after:`, `before:`, `site:` et `when:` [V]. Deux pièges : l'édition `gl=MA` **n'est pas la presse marocaine** (résultats dominés par FFT, Radio-Canada, Ouest-France) [V], et `MA:ar` redirige vers `EG:ar` [V]. Il faut des listes `site:` de domaines marocains. Le flux renvoie aussi des 503 intermittents, contournés par de simples relances [V].
7. **Plusieurs sources réputées « gratuites » sont mortes ou dégradées en 2026.** OSS Insight Trending est indisponible depuis le 01/03/2026 (capture des événements GitHub tombée à environ 0,3 % de la normale) [V, réponse API]. Les fichiers horaires GH Archive sont passés d'environ 25–38 Mo à 4,8 Mo [V]. GitHub /trending répond 403 via le proxy [V]. La PA-API 5 d'Amazon est dépréciée et renvoie 403 [V]. Amazon.fr présente un captcha [V]. Etsy, Kickstarter (JSON), Indiegogo et Similarweb renvoient 403 ou une page anti-bot [V]. pytrends est archivé [V].
8. **Pour la détection précoce aux US** (tech, IA, produits), Hacker News (Firebase sans limite documentée), le flux Atom de Product Hunt, la recherche GitHub, npm et PyPI, YC (miroir yc-oss) et une quarantaine de flux RSS de médias US répondent tous en 200 [V]. Aucun ne donne de granularité pays : ils servent au *t0* américain.
9. **Les points de vigilance juridiques (CGU) touchent le modèle économique.** L'API Product Hunt est non commerciale par défaut [V]. Les données de Cloudflare Radar sont sous **CC BY-NC 4.0** [V/S]. L'API Exploding Topics impose un tarif sur mesure pour un usage commercial [V]. Les endpoints Google non officiels (Trends explore, autocomplétion, Play batchexecute, News RSS) restent en zone grise : il faut des adaptateurs coupables d'un geste et un plan de repli payant (DataForSEO Trends à 0,0027 $ la tâche, SerpApi gratuit jusqu'à 250 requêtes par mois) [V].

---

## 2. Matrice de décision : les 15 sources approfondies

Valeur pour mesurer un décalage entre pays : ★★★ décisive, ★★ utile, ★ marginale.

| # | Source | Appel testé (28/11/2026) | Statut | Format | Granularité pays | Fraîcheur / historique | Limites | CGU | Valeur décalage | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Google Trends « Trending Now » RSS | `https://trends.google.com/trending/rss?geo=MA` | 200 pour US, FR, MA, BE, CH, CA, CA-QC, SN, CI, DZ, TN, CM | RSS + `ht:approx_traffic`, `ht:news_item` | Pays et sous-région (CA-QC) | Environ 10 items, fenêtre de quelques heures, pas d'historique | 10 items, dominés par l'actualité et le sport | Non documenté (zone grise) | ★★ (*t0* de pics) | core |
| 2 | Google Trends explore + multiline (non officiel) | `trends/api/explore?req={comparisonItem:[US,FR,MA]}` puis `widgetdata/multiline?token=` | 200 (amorce cookie en 429, sans conséquence) | JSON préfixé `)]}'` | Pays, sous-région, DMA | Hebdomadaire sur 5 ans, quotidien sur 90 jours | 429 fréquents, jeton par widget | Zone grise (CGU Google) | ★★★ (échelle commune entre pays) | core (avec repli payant) |
| 3 | Autocomplétion Google / YouTube / Amazon / DDG | `suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=ma&q=...` | 200 | JSON | Pays via `gl` | Instantané, aucun historique | 10 suggestions | Zone grise | ★★★ (présence et stade local) | core |
| 4 | Google News RSS | `news.google.com/rss/search?q=X+site:hespress.com+before:2025-09-01&hl=fr&gl=MA&ceid=MA:fr` | 200, 503 intermittents | RSS | Édition pays × langue (pas de MA:ar) | Recherche historique via `after:`/`before:` | ≤ 100 items, liens Google encodés, bruit de pertinence | Non documenté | ★★★ (datation presse) | core |
| 5 | Wikipedia Pageviews API | `wikimedia.org/api/rest_v1/metrics/pageviews/per-article/fr.wikipedia/all-access/user/Labubu/monthly/...` | 200 / 429 (Retry-After) | JSON | Édition linguistique ; top-per-country par pays | Depuis 2015, J-1 | 200 req/min avec UA conforme, 10/min sinon | Politique UA obligatoire | ★★★ | core |
| 6 | Wikimedia DP « country_project_page » | `analytics.wikimedia.org/published/datasets/country_project_page/2026-11-27.tsv` | 200 (16 Mo) | TSV | **Pays × page × QID** | Quotidien depuis le 06/02/2023, J-1 | Seuils DP : MA très peu couvert | Ouvert (licence non précisée dans le README) | ★★★ (FR) / ★ (MA) | core |
| 7 | Apple App Store RSS v2 (+ iTunes legacy) | `rss.marketingtools.apple.com/api/v2/ma/apps/top-free/100/apps.json` | 200 (502 et timeouts intermittents) | JSON, RSS, Atom | Storefront pays | Instantané quotidien | ≤ 100 (101 → 500) ; legacy ≤ 100 + genre | Outil marketing Apple | ★★★ | core |
| 8 | Google Play top charts (batchexecute) | POST `play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=vyAe2&hl=fr&gl=ma` | 200 (200 apps) | JSON imbriqué | Pays via `gl` | Instantané | Gabarit fragile (bl=2022) | Zone grise | ★★★ | core |
| 9 | Apple Podcasts RSS v2 / Spotify | `.../api/v2/fr/podcasts/top/50/podcasts.json` ; `kworb.net/spotify/country/ma_daily.html` | FR et SN 200 ; US 502 ; MA timeout ; Spotify public = mondial seulement | JSON / HTML | Pays | Quotidien | Spotify par pays = connexion requise ou kworb (tiers) | Apple marketing ; kworb tiers | ★★ | optional |
| 10 | Product Hunt | `www.producthunt.com/feed` ; GraphQL `api.producthunt.com/v2/api/graphql` | Atom 200 (50 entrées) ; GraphQL 401 sans jeton | Atom / GraphQL | Aucune | Quotidien | 6 250 points de complexité / 15 min | **Non commercial par défaut** | ★★ (*t0* US) | optional |
| 11 | Hacker News (Firebase + Algolia) | `hacker-news.firebaseio.com/v0/topstories.json` ; `hn.algolia.com/api/v1/search?query=X&tags=story` | 200 | JSON | Aucune | Temps réel, historique complet | « No rate limit » (Firebase) | MIT (dépôt API) | ★★ (*t0* tech) | core |
| 12 | GitHub (search API ; trending, OSS Insight, GH Archive) | `api.github.com/search/repositories?q=created:>2026-11-14&sort=stars` | Search 200 ; /trending 403 ; OSS Insight vide ; GH Archive dégradé | JSON | Aucune (location des utilisateurs = déclaratif) | Temps réel | Search 10 req/min sans authentification [connaissance interne], 30 avec | CGU GitHub | ★ | optional |
| 13 | GDELT DOC 2.0 | `api.gdeltproject.org/api/v2/doc/doc?query=X%20sourcecountry:FR&mode=timelinevolraw&format=json&timespan=24m` | 200 une fois, puis 429 et coupures | JSON | `sourcecountry` (FIPS : FR, MO), `sourcelang` | Timelines sur 24 mois, artlist sur 3 mois | 1 req / 5 s par IP ; couverture FR de niche très faible | Ouvert | ★ (macro) | optional |
| 14 | Cloudflare Radar ranking | `api.cloudflare.com/client/v4/radar/ranking/top?location=MA&rankingType=TRENDING_RISE` (jeton requis) | 400 sans jeton (non testé avec jeton) | JSON / CSV | **Pays** | Quotidien [S] | 10 000 req/jour [S, non confirmé] | **CC BY-NC 4.0** | ★★ (domaines montants par pays) | optional |
| 15 | Flux RSS médias US / FR / MA / Afrique (+ repli Google News `site:`) | voir §5 | 70 % de 200 | RSS / Atom | Par média | Horaire à quotidien | Axios, BoF, Medias24, L'Economiste en 403 → `site:` | Usage de flux | ★★★ (datation éditoriale) | core |

---

## 3. Fiches détaillées

### 3.1 Google Trends : quatre accès, statut fin 2026

**a) API officielle (alpha).** [V] La page officielle indique « Get early access to the Google Trends API alpha » et « we're now accepting applications for alpha testers ». Elle ajoute : « As we can't open the API for everyone yet, we're prioritizing developers that know what they want to do ». Contenu annoncé : fenêtre glissante de 5 ans, agrégations quotidienne, hebdomadaire, mensuelle et annuelle, comparaisons entre pays et sous-régions. La page ne publie **ni quota, ni prix, ni « Trending Now »** ([page consultée le 28/11/2026](https://developers.google.com/search/apis/trends)). L'annonce date du 24/07/2025 et parle de données « consistently scaled », allant jusqu'à J-2 et découpées par région ISO 3166-2 ([blog Google Search Central, 24/07/2025](https://developers.google.com/search/blog/2025/07/trends-api)). Plusieurs blogs [S] (août–octobre 2026) confirment qu'aucune ouverture n'a eu lieu ([medium, 2026](https://medium.com/@wordstotech/google-trends-api-in-2026-the-official-alpha-python-options-and-what-actually-works-95d50970cd46), [cite42.dev](https://www.cite42.dev/blog/google-trends-api)). **Action : déposer une candidature dès maintenant**, avec un cas d'usage précis : la comparaison US/FR/MA.

**b) RSS « Trending Now ».** [V] `https://trends.google.com/trending/rss?geo={US|FR|MA|BE|CH|CA|CA-QC|SN|CI|DZ|TN|CM}` renvoie 200 pour les 12 codes testés. Chaque item contient `title`, `ht:approx_traffic` (« 200+ », « 10000+ »), `pubDate`, et 1 à 3 `ht:news_item` (titre, URL, source). Il y a **10 items par flux**, et la fenêtre couverte va de 30 minutes à 7 heures selon le pays. Les anciens endpoints `trends/trendingsearches/daily/rss`, `api/dailytrends` et `api/realtimetrends` renvoient **404** [V]. Usage : interroger toutes les 30 à 60 minutes et stocker. Le contenu est dominé par le sport et la politique (exemples MA du jour : « betis – rayo », « ملعب ») : c'est un signal de *pics*, pas de tendances lifestyle.

**c) explore + widgetdata (non officiel).** [V] La séquence fonctionnelle observée aujourd'hui :
```
GET https://trends.google.com/trends/explore?geo=FR&q=labubu          # pose les cookies (même en 429)
GET https://trends.google.com/trends/api/explore?hl=en-US&tz=0&req={"comparisonItem":[{"keyword":"labubu","geo":"US","time":"today 5-y"},{"keyword":"labubu","geo":"FR","time":"today 5-y"},{"keyword":"labubu","geo":"MA","time":"today 5-y"}],"category":0,"property":""}
   → 200, JSON préfixé ")]}'", widgets TIMESERIES / GEO_MAP_n / RELATED_QUERIES_n + token
GET https://trends.google.com/trends/api/widgetdata/multiline?hl=en-US&tz=0&req=<request du widget>&token=<token>
   → 200, 261 points hebdomadaires (2021-11-28 → 2026-11-28)
```
Un appel direct à `api/explore` sans cookie a renvoyé **429** [V]. L'intérêt majeur est qu'**un même appel avec 3 `comparisonItem` (US, FR, MA) place les séries sur une échelle commune** (base 100 = point maximal toutes séries confondues, chaque pays étant normalisé par son propre volume total de recherches). C'est la meilleure mesure gratuite de décalage. Les widgets RELATED_QUERIES par pays donnent aussi les formulations locales.

**d) Jeu de données BigQuery public.** [V] `bigquery-public-data.google_trends` : top 25 et top 25 en hausse par jour. Les US sont découpés en 210 DMA, l'international couvre « approximately 50 additional countries », avec un historique glissant de 5 ans ([aide Google Trends](https://support.google.com/trends/answer/12764470), [blog Google Cloud, mars 2022](https://cloud.google.com/blog/products/data-analytics/international-google-trends-datasets-in-bigquery)). **Non testé** : l'environnement n'a pas d'identifiants GCP valides (`Invalid Credentials`). La présence de FR et MA est **inconnue** ; requête à lancer : `SELECT DISTINCT country_code, country_name FROM bigquery-public-data.google_trends.international_top_rising_terms`. La gratuité dépend du quota gratuit BigQuery (1 To de requêtes par mois selon ma connaissance interne, non revérifié ce jour).

**e) Bibliothèques.** [V] pytrends est archivé (`archived: true` via l'API de recherche GitHub ; dernière version 4.9.2 du 13/04/2023 sur PyPI). Des sources [S] datent l'archivage au 17/04/2025 ([apiserpent](https://apiserpent.com/blog/pytrends-dead-google-trends-data-2026)), et un test tiers du 11/09/2026 signale les méthodes « trending » en 404 et `explore` fonctionnel ([scrapfly](https://scrapfly.io/blog/posts/google-trends-api-alternatives)). Alternatives : `trendspyg` 1.9.0 (PyPI, 01/10/2026) et `trendspy` 0.1.6 (25/12/2024, peu actif) [V].

**f) Replis payants.** [V] SerpApi : Free 0 $ pour 250 recherches par mois, Starter 25 $ pour 1 000, Developer 75 $ pour 5 000 ([pricing](https://serpapi.com/pricing)). Son moteur Trends couvre TIMESERIES, GEO_MAP, RELATED_* et `geo` multiple ([doc](https://serpapi.com/google-trends-api)). DataForSEO Trends : file standard à **0,0027 $ par tâche** (jusqu'à 45 min), mode Live à 0,011 $ ([page](https://dataforseo.com/apis/google-trends-api)). Glimpse : volumes absolus estimés sur 5 ans, filtre pays, clé API, prix non publics ([page API](https://meetglimpse.com/google-trends-api)).

### 3.2 Autocomplétion (Google, YouTube, Amazon, DuckDuckGo)

[V] Appels testés (200) :
- `https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=ma&q=chocolat%20dubai`
- `...&ds=yt...` pour YouTube
- `https://completion.amazon.fr/api/2017/suggestions?mid=A13V1IB3VIYZZH&alias=aps&prefix=...` (US : `mid=ATVPDKIKX0DER`)
- `https://duckduckgo.com/ac/?q=...&kl=fr-fr`

Résultat du jour pour « chocolat dubai » :
- **MA** : « maroc, casablanca, prix maroc, rabat, agadir, marrakech, marjane ».
- **FR** : « lidl, lindt, carrefour, aldi, algerie ».
- **US** : « near me, strawberries, ice cream ».

C'est un **indicateur de stade de diffusion** [E]. L'apparition de qualificatifs ville, prix ou enseigne locale (Marjane, Carrefour) signale que la tendance est passée au stade commercial dans le pays. Limites : pas d'historique, d'où un instantané quotidien de la liste de veille à stocker. Endpoints non documentés.

### 3.3 Google News RSS (par pays et langue)

[V] Accueil : `https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr`, avec 200 pour US, FR (après une relance sur 503), MA:fr, BE:fr, CH:fr, CA:fr, SN:fr. `ceid=MA:ar` est **redirigé vers `EG:ar`** : il n'existe pas d'édition arabe marocaine.
- Recherche : `.../rss/search?q=pickleball+when:30d&hl=fr&gl=FR&ceid=FR:fr` → 58 items (Ouest-France 9, FFT 4, actu.fr 3...).
- Historique : `q="dubai chocolate"+after:2024-01-01+before:2024-06-30` → 12 items datés du 09/01 au 20/06/2024.
- Contournement des flux bloqués : `q=site:axios.com+when:2d` (19 items), `site:businessoffashion.com` (100), `site:medias24.com` (100), `site:leconomiste.com` (57), `site:wearetech.africa` (39), `site:welovebuzz.com` (12).

**Pièges** [V] :
- (1) `gl=MA` ne restitue pas la presse marocaine : « pickleball when:1y » en MA:fr renvoie 70 items dominés par FFT (13) et Radio-Canada (8).
- (2) Le bruit de pertinence est fort : une recherche « labubu » filtrée sur des sites FR a ramené des articles de 2017–2019 sans rapport.
- (3) Les liens sont encodés (`news.google.com/rss/articles/CBMi...`).
- (4) Un flux plafonne à environ 100 items, d'où un **découpage par fenêtres `before:`** pour retrouver la première mention.

Démonstration MA : `labubu (site:le360.ma OR site:hespress.com OR ...) before:2025-09-01`. Les premiers articles pertinents sont Le Matin le **23/06/2025** et Hespress le **01/07/2025** [V].

### 3.4 Wikipedia Pageviews API

[V] Endpoints testés :
- `per-article/{projet}/all-access/user/{titre}/monthly/{début}/{fin}` : 200.
- `top/{projet}/all-access/2026/11/26` : 200, 1 000 articles.
- `top-per-country/{FR|MA|US}/all-access/2026/11/26` : FR 200 avec 470 articles ; **MA 200 mais seulement 3 articles** (pages d'accueil) ; US en 429.
- `top-by-country/fr.wikipedia/all-access/2026/10` : 429.

**Politique** [V] : limites « new in 2026 » appliquées « per user ». 10 req/min pour un client non identifié, **200 req/min** pour un « unauthenticated bot with compliant User-Agent », 2 000 pour un éditeur établi. En cas de 429 ou 503, honorer `Retry-After`, sinon attendre au moins 5 s ; garder au plus 3 requêtes concurrentes ([page Rate limits, modifiée le 08/11/2026](https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits)). Format d'UA : `<client>/<version> (<contact URL ou e-mail>) <lib>/<version>`. Les UA génériques (`curl`, `python-requests`) peuvent recevoir un 403 ([User-Agent Policy](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy)). Aujourd'hui, avec un UA conforme et 12 s d'espacement, on observe encore des 429 intermittents avec `retry-after: 4` à `27` et l'en-tête `x-envoy-ratelimited: true`. Une boucle qui respecte `Retry-After` a obtenu 4 réponses sur 4 en 200 au premier essai [V]. Cause probable : l'IP de sortie partagée [E].

**Mesures de décalage** [V] (séries mensuelles, agent `user`) :

| Article | Édition | 1er mois ≥ 10 % du pic | Pic |
|---|---|---|---|
| Labubu | en | 2025-05 | 2025-07 (1 412 695 vues) |
| Labubu | ar | 2025-06 | 2025-07 (13 902) |
| Labubu | fr | 2025-08 (série commençant en 2025-06) | 2025-08 (91 132) |
| Pickleball | en | (déjà haut en 2019) | 2023-10 (304 359) |
| Pickleball | fr | 2020-12 | **2026-08** (15 281) |

Le pic de pickleball sur la Wikipédia FR arrive près de 3 ans après celui de la Wikipédia EN [E : la langue sert de proxy du pays]. Les éditions linguistiques mélangent les pays (fr = FR, BE, CH, QC, Maghreb, Afrique), d'où l'intérêt du jeu suivant.

### 3.5 Wikimedia « country_project_page » (confidentialité différentielle)

[V] `https://analytics.wikimedia.org/published/datasets/country_project_page/{AAAA-MM-JJ}.tsv` (le 2026-11-27 : 200, 16 Mo, 247 639 lignes). Colonnes : pays, code, projet, page_id, titre, **QID Wikidata**, vues bruitées. Fichier quotidien depuis le 06/02/2023, publié vers 02 h 30 UTC à J+1 (horodatage du répertoire). Seuils de publication : >90 vues (pays « lower risk »), >550 (medium), >1 000 (higher), et >150 vues mondiales. Intervalle de confiance à 95 % : environ ±36, ±177 et ±353. Lacunes : US absents du 06/02 au 19/09/2023, 7 jours manquants en 2023 ([README](https://analytics.wikimedia.org/published/datasets/country_project_page/00_README.html)).

Couverture du 27/11/2026 [V] : US 97 501 lignes, FR 10 770, CA 9 611, CH 614, BE 551, DZ 109, **MA 87**, TN 21, SN 15, CM 7, **CI 0**. **Clé de jointure : le QID**. Le même concept (ex. Q11660, « intelligence artificielle ») se suit d'un pays à l'autre, toutes langues confondues. Pour le Maroc, seul ce qui est très lu remonte [E : MA est probablement classé « medium/higher risk »].

### 3.6 Apple App Store : RSS v2 et iTunes legacy

[V] RSS v2 : `https://rss.marketingtools.apple.com/api/v2/{cc}/{apps|music|podcasts|books|audio-books}/{top-free|top-paid|most-played|top}/{n}/{type}.json`. 200 pour `us`, `fr`, `ma`, `sn`, `ci`, `dz`, `tn`, `be`, `ch`, `ca` ; `n` ≤ 100 (`101` renvoie **500**). Des 502 et timeouts de 25 s apparaissent par intermittence : 1 à 2 relances suffisent. Le champ `feed.updated` du jour est le 28/11/2026 13:01 UTC. L'ancien hôte `rss.applemarketingtools.com` répond aussi. La page du générateur ne publie pas de CGU au-delà du copyright Apple 2026 et propose 10, 25 ou 50 dans l'interface [V]. Legacy : `https://itunes.apple.com/{cc}/rss/{topfreeapplications|topgrossingapplications|newapplications}/limit=100/genre={id}/json` plafonne à 100 entrées (limit=200 renvoie 100) et **permet de filtrer par genre** (6013 = Health & Fitness) ; `lookup?id=&country=` confirme la disponibilité d'une app dans un storefront [V].

**Mesure du jour** (top gratuit iOS, 28/11/2026) [V] : sur les 30 premières apps US, **18 sont absentes des top 100 FR et MA**. Exemples : PineDrama (micro-dramas, #15 US), GoWish (#10) et Giftful (#25) pour les listes de souhaits, Kalshi (#18, marchés prédictifs), Muse from Meta (#3), Capital One Shopping. Arrivées en FR mais pas au MA : **Whatnot** (US #5, FR #3, MA absent), Shop by Shopify (US #12, FR #2). Flux inverse : **Vinted** est #7 aux US (FR #27). Recouvrement des top 100 (legacy, même jour, agent précédent) : US∩FR 32, US∩MA 27, FR∩MA 32.

### 3.7 Google Play : classements par pays

[V] La page HTML `play.google.com/store/apps/top?gl=MA` renvoie 200 mais ne contient pas de classement exploitable (redirection vers l'accueil, 53 à 63 IDs mélangés). Ce qui fonctionne : le RPC `vyAe2` repris de la bibliothèque `google-play-scraper` 10.1.4 (npm, modifiée le 17/10/2026) :
```
POST https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=vyAe2&source-path=%2Fstore%2Fapps&f.sid=-4178618388443751758&bl=boq_playuiserver_20220612.08_p0&authuser=0&soc-app=121&soc-platform=1&soc-device=1&_reqid=82003&rt=c&hl=fr&gl=ma
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
body: f.req=<gabarit de lib/list.js avec num=200, collection=topselling_free|topgrossing|topselling_paid, category=APPLICATION|FINANCE|LIFESTYLE|...>
→ 200, 200 apps (US, FR, MA, SN) ; MA topgrossing : 115 ; parsing : JSON.parse(lignes[3])[0][2] → [0][1][0][28][0][i][0][0][0] = package
```
Aujourd'hui, **24 des 50 premières apps US sont absentes des top 200 FR et MA** (ex. `com.facebook.aura`, `com.tiktok.lite.go`, `com.tubitv`, `com.drama.free`, `gov.trumpaccounts.goldeneagle`) [V]. Le top LIFESTYLE au MA fait ressortir des apps de prière et de Coran, Glovo et Avito (`se.scmv.morocco`) [V, agent précédent], soit des niches locales. Risque : le gabarit `bl=…20220612` peut casser à tout moment [E].

### 3.8 Podcasts et musique

[V] Apple Podcasts RSS v2 : FR et SN en 200 (50 entrées : « Les Grosses Têtes », « L'After Foot »... ; SN : récitations coraniques, « Pr Madiama Fall »), US en 502, MA en timeout (à relancer). Le flux legacy `itunes.apple.com/{cc}/rss/toppodcasts/limit=100/genre=1321/json` répond aussi. Spotify : `charts-spotify-com-service.spotify.com/public/v0/charts` renvoie 200 **mais seulement des classements mondiaux hebdomadaires** (titres, albums, artistes, 50 entrées, date du 26/11/2026). Les classements par pays exigent une connexion sur charts.spotify.com (non testé, par choix). `kworb.net/spotify/country/ma_daily.html` (« Spotify Daily Chart - Morocco », environ 200 lignes) et `fr_daily` répondent en 200 : c'est une source tierce à scraper. L'API de podcastcharts.byspotify.com renvoie 500, et la page est une app Next.js sans données dans `_next/data`. Valeur : ★★ pour les tribus musicales et les formats de podcast, faible pour les produits.

### 3.9 Product Hunt

[V] Flux Atom `https://www.producthunt.com/feed` : 200, 50 entrées publiées entre le 20/10 et le 22/11/2026. GraphQL `https://api.producthunt.com/v2/api/graphql` : 401 sans jeton. Avec jeton, la limite est de **6 250 points de complexité par 15 min** et de 450 requêtes par 15 min pour les autres endpoints, avec les en-têtes `X-Rate-Limit-*` ([doc rate limits](https://api.producthunt.com/v2/docs/rate_limits/headers)). La doc indique : « By default the Product Hunt API must not be used for commercial purposes », avec contact hello@producthunt.com ([doc v2](https://api.producthunt.com/v2/docs)). Valeur : *t0* des outils numériques US ; pas de pays.

### 3.10 Hacker News

[V] `https://hacker-news.firebaseio.com/v0/{topstories|newstories|beststories|showstories|item/<id>}.json` : 200. Le README officiel indique « There is currently no rate limit » ([HackerNews/API](https://github.com/HackerNews/API)). Algolia : `https://hn.algolia.com/api/v1/search?query=pickleball&tags=story` et `search_by_date?tags=show_hn&numericFilters=points>100` en 200 ; `hnrss.org/show?points=100` en 200. Historique complet et recherche par date : on peut dater la **première discussion US** d'un outil.

### 3.11 GitHub et dérivés

[V] `github.com/trending` renvoie **403 via le proxy** (politique d'environnement). `api.github.com/search/repositories?q=created:>2026-11-14&sort=stars&order=desc` renvoie 200 (4 810 230 dépôts). Les premiers résultats sont suspects : 11 000 à 14 000 étoiles en moins de 15 jours (`rust-anything`, `VIctory`), ce qui fait penser à du **gonflage d'étoiles** [E]. Dans cet environnement, `rate_limit` affiche core 15 000 et search 30 (le proxy injecte une authentification). Sans authentification, la limite publique est plus basse (60 req/h en core et 10 req/min en search selon ma connaissance interne, à revérifier). **OSS Insight** : `api.ossinsight.io/v1/trends/repos` renvoie un résultat vide avec `"status":"unavailable","unavailable_since":"2026-03-01"`, motif « our capture of those events fell to roughly 0.3% of baseline » [V, réponse API du 28/11/2026]. **GH Archive** : fichier horaire `2026-11-27-12.json.gz` de 4,76 Mo, contre 25,6 Mo le 27/11/2025 et 37,8 Mo le 10/02/2026 [V]. L'interprétation (événements publics GitHub fortement réduits en 2026) est une [E] ; la cause n'a pas été trouvée. Verdict : la recherche GitHub reste utile pour l'IA et les outils développeurs, mais **les classements fondés sur les événements sont à proscrire**.

### 3.12 GDELT DOC 2.0

[V] `https://api.gdeltproject.org/api/v2/doc/doc?query=pickleball%20sourcecountry:FR&mode=timelinevolraw&format=json&timespan=24m` a renvoyé 200 (676 jours, à partir du 09/12/2024). Les appels suivants, espacés de 7 à 60 s, ont tous reçu **429** (« Please limit requests to one every 5 seconds ») ou une coupure de tunnel. Opérateurs `sourcecountry:` (FIPS : Maroc = `MO`) et `sourcelang:` ; modes `artlist`, `timelinevol`, `timelinevolraw` ; recherche par article sur 3 mois glissants ([blog GDELT](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/)). `lastupdate.txt` est rafraîchi toutes les 15 min (13:00 UTC le 28/11/2026). **Couverture faible pour les niches** [V] : 4 articles « pickleball » en source FR sur 24 mois, contre 58 dans Google News FR sur 30 jours. Verdict : macro-actualité seulement.

### 3.13 Cloudflare Radar (domaines par pays)

[V doc, non testé] `GET https://api.cloudflare.com/client/v4/radar/ranking/top?location=MA&rankingType=TRENDING_RISE&limit=100` (Bearer token). `rankingType` vaut POPULAR, TRENDING_RISE ou TRENDING_STEADY ; `pct_rank_change` existe en mode TRENDING. `/radar/ranking/domain/{domain}` renvoie `top_locations[]` (rang par pays), et un endpoint timeseries existe ([référence API](https://developers.cloudflare.com/api/resources/radar/subresources/ranking/methods/top/), [datasets](https://developers.cloudflare.com/radar/investigate/domain-ranking-datasets/)). Sans jeton : **400** [V]. Licence des données API : **CC BY-NC 4.0**, exceptions via radar@cloudflare.com ([À propos de Radar](https://radar.cloudflare.com/about)) [V via résumé de recherche]. Quota de 10 000 requêtes par jour [S, non confirmé]. Valeur : un domaine US (ex. `whatnot.com`) qui entre dans le classement MA ou FR date une adoption ; la licence NC impose une exception pour un usage commercial.

### 3.14 Chrome UX Report (BigQuery)

[V doc, non testé] Données brutes mensuelles depuis 2017. Jeux de données par pays `chrome-ux-report.country_{cc}` (ex. `country_ma`, `country_fr`, `country_us`) et `experimental.country` (colonne `yyyymm`). Publication le **deuxième mardi du mois suivant** ([CrUX BigQuery](https://developer.chrome.com/docs/crux/bigquery)). Le rang de popularité est en paliers log10 avec demi-pas (1k, 5k, 10k, 50k, 100k, 500k, 1M), calculé sur le nombre total de navigations ([métriques](https://developer.chrome.com/docs/crux/methodology/metrics)). La disponibilité du rang par pays n'est pas précisée [H]. Valeur : décalage mensuel d'**adoption d'un site** (ex. une origine US qui passe du palier 50k au palier 10k au MA). Exige un projet GCP.

### 3.15 Flux RSS de médias

Voir le tableau détaillé au §5. Pour les sites bloqués, le repli `news.google.com/rss/search?q=site:<domaine>+when:2d` fonctionne [V].

---

## 4. Sources examinées plus brièvement

| Source | Appel testé | Résultat (28/11/2026) | Commentaire | Verdict |
|---|---|---|---|---|
| Steam | `store.steampowered.com/api/featuredcategories?cc=ma&l=french` ; `api.steampowered.com/IStoreTopSellersService/GetWeeklyTopSellers/v1/?country_code=MA` ; `steamspy.com/api.php?request=top100in2weeks` | 200 | Top hebdo **identique US et MA** (20/20) ; sorties mondiales simultanées | avoid (pour le décalage) |
| Amazon Best Sellers / Movers & Shakers | `www.amazon.com/gp/bestsellers/beauty/` ; `.../movers-and-shakers/beauty/` ; `www.amazon.fr/gp/...` | US BS 200 (30 ASIN par page) ; US M&S 200 mais rendu en JS (0 ASIN parsé) ; **FR captcha** | PA-API 5 dépréciée, appels en 403, remplacée par Creators API ([page Amazon](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation)) | avoid (0 €) / paid_addon |
| Kickstarter | `kickstarter.com/discover/advanced?format=json` ; `projects/feed.atom` | JSON 403 ; Atom 200 mais entrées de 2022 (périmé) | Jeux mensuels Web Robots (`webrobots.io/kickstarter-datasets/`, 200) | avoid / optional (archives) |
| Indiegogo | `indiegogo.com/explore/all?sort=trending` | 403 | — | avoid |
| Substack | `substack.com/api/v1/categories` ; `substack.com/api/v1/category/public/96/paid?page=0` | 200 (25 publications avec champ `language`, `more: true`) ; endpoints « leaderboard » devinés en 400/404 | Filtrage FR possible par langue, pas par pays | optional |
| beehiiv | `beehiiv.com/discover` | 404 | — | avoid |
| Exploding Topics | `explodingtopics.com/api` (404) ; pages pricing et et-api | Plans 39 / 99 / 249 $ par mois sans API ; **API en option du Pro Business (dès 249 $/mois) : 1 000 req = 1 000 $/mois, 5 000 = 2 000 $, 25 000 = 4 000 $, 60 req/min, pas de géo** ([pricing](https://explodingtopics.com/pricing), [API](https://explodingtopics.com/feature/et-api)) | Usage commercial sur devis | avoid |
| Glimpse | pages pricing et API | Prix non publics ; volumes absolus et filtre pays | — | paid_addon |
| Treendly | `treendly.com/pricing` | Free 0 $ ; Pro 99 $/an ; « API/MCP access : Yes » sur les 3 plans ; couverture pays non précisée | Bibliothèque de 52 668 tendances | optional (à tester) |
| Chrome Web Store | `chromewebstore.google.com/category/extensions` | 200 HTML (27 IDs d'extension) | Aucun pays ; chrome-stats en connexion | optional (*t0* outils) |
| Shopify App Store | `apps.shopify.com/categories/marketing-and-conversion` ; `sitemap.xml` | 200 (42 handles) ; `trending-apps` en 404 | Aucun pays | optional |
| Etsy | `etsy.com/trends` ; `openapi.etsy.com/v3/application/openapi-ping` | 403 / 403 (clé requise) | — | avoid |
| npm / PyPI | `api.npmjs.org/downloads/range/last-month/next` ; `pypistats.org/api/packages/langchain/recent` ; `pypi.org/rss/packages.xml` | 200 | Aucun pays ; signal IA et dev | optional |
| Y Combinator | `yc-oss.github.io/api/batches/fall-2026.json` ; `www.ycombinator.com/launches` | 200 (miroir communautaire mis à jour le 28/11/2026 : 6 408 entreprises, Fall 2026 = 238) ; Launches renvoie du JSON | Algolia YC en 403 | optional (*t0* startups) |
| Similarweb | `similarweb.com/top-websites/france/` ; `api.similarweb.com/...` | 202 vide (anti-bot) ; 401 | API = option d'abonnement sur devis ([doc](https://developers.similarweb.com/docs/similarweb-web-traffic-api)) | avoid |
| Semrush | `semrush.com/trending-websites/fr/all` (200, rendu JS) ; MCP `https://mcp.semrush.com/v2/mcp` | Plans éligibles avec 50 000 unités API ; MCP inclus dans les plans Trends API ([doc MCP](https://developer.semrush.com/api/basics/semrush-mcp/)) | — | paid_addon |
| Ahrefs | `ahrefstop.com/websites/france` (200) ; `docs.ahrefs.com` | API v3 en Enterprise ; « free test queries » ; MCP documenté sans prix | Top sites par pays gratuit (HTML) | paid_addon |
| Tranco | `tranco-list.eu/api/lists/date/latest` | 200 (liste quotidienne du 27/11/2026, fournisseurs crux, farsight, majestic, radar, umbrella) | **Mondial seulement** | optional |
| Google Ads Transparency Center | `adstransparency.google.com/?region=MA` | 429 (page « sorry ») ; RPC en 405 | [H] un jeu BigQuery public existerait (non vérifié) | avoid (scraping) |
| Common Crawl | `index.commoncrawl.org/collinfo.json` ; CDX `CC-MAIN-2026-47-index?url=...` | collinfo 200 (index de novembre 2026) ; CDX en 502/504 | Trop lourd pour du quasi temps réel | avoid |
| Reddit, YouTube, Pinterest Trends, TikTok Creative Center | divers | Reddit 403 ; YouTube trending 200 ; Pinterest 200 ; TikTok CC 200 | **Hors périmètre** (axe plateformes sociales) | — |

---

## 5. Flux RSS de médias (testés le 28/11/2026)

**USA**

| Média | URL fonctionnelle | Statut | Items | Dernier item |
|---|---|---|---|---|
| The Verge | `https://www.theverge.com/rss/index.xml` | 200 Atom | 10 | 27/11/2026 |
| TechCrunch | `https://techcrunch.com/feed/` | 200 | 20 | 26/11/2026 |
| Morning Brew | `https://www.morningbrew.com/feed.xml` (`/feed` redirige) | 200 | 40 | 28/11/2026 |
| Axios | `api.axios.com/feed/`, `axios.com/feeds/feed.rss` | **403** | — | repli Google News `site:axios.com` (19 items sur 2 jours) |
| Business of Fashion | `/arc/outboundfeeds/rss/`, `/feed` | **403** | — | repli `site:businessoffashion.com` (100) |
| Modern Retail | `https://www.modernretail.co/feed/` | 200 | 10 | 28/11/2026 |
| Digiday | `https://digiday.com/feed/` | 200 | 15 | 27/11/2026 |
| Social Media Today | `https://www.socialmediatoday.com/feeds/news/` | 200 | 10 | 24/11/2026 |
| Later | `https://later.com/rss.xml` (`/blog/feed/` en 404) | 200 | 692 | 23/11/2026 |
| Autres en 200 | Glossy, Retail Dive, Marketing Dive, Adweek, The Information, Fast Company, Tubefilter, Passionfruit, Platformer, 404 Media, Vox Culture, Eater, WWD, Bloomberg Tech, Wired, Mashable, Engadget, Ars, Ben's Bites, Stratechery, Lenny's, Know Your Meme, HubSpot | 200 | — | — |
| En échec | Trend Hunter (403 ; `trendhunter.com/rss` en 200 avec un autre UA d'après l'agent précédent), Garbage Day (timeout) | — | — | — |

**France**

| Média | URL | Statut | Items | Dernier item |
|---|---|---|---|---|
| Siècle Digital | `https://siecledigital.fr/feed/` | 200 | 20 | 27/11/2026 |
| Blog du Modérateur | `https://www.blogdumoderateur.com/feed/` | 200 | 30 | 27/11/2026 |
| Maddyness | `https://www.maddyness.com/feed/` | 200 | 10 | 27/11/2026 |
| FrenchWeb | `https://www.frenchweb.fr/feed` | 200 | 30 | 27/11/2026 |
| Journal du Net | `https://www.journaldunet.com/rss/` (et `/web-tech/rss/`) | 200 | 60 | 28/11/2026 |
| L'ADN | `https://www.ladn.eu/feed/` | 200 | 10 | 27/11/2026 |
| Autres en 200 | Numerama, Presse-citron, 01net, Le Monde Pixels, ZDNet FR, Clubic, Konbini, Madmoizelle | 200 | — | — |
| En échec | Usine Digitale, Les Echos Tech, Stratégies, La Réclame (403) ; LSA, CB News, e-marketing, Influencia, Ecommerce Mag (404 : URL à trouver) | — | — | — |

**Maroc**

| Média | URL | Statut | Items | Dernier item |
|---|---|---|---|---|
| Medias24 | `/feed/` | **403** | — | repli `site:medias24.com` (100) |
| Le360 | `https://fr.le360.ma/arc/outboundfeeds/rss/?outputType=xml` (`/rss` en 404) | 200 | 100 | 28/11/2026 |
| TelQuel | `https://telquel.ma/feed` | 200 | 100 | 27/11/2026 |
| Hespress FR | `https://fr.hespress.com/feed` (+ `/feed` arabe et `en.`) | 200 | 10 | 28/11/2026 |
| L'Economiste | `/rss.xml`, `/feed`, `/rss` | **403** | — | repli `site:leconomiste.com` (57) |
| Welovebuzz | `https://www.welovebuzz.com/feed/` | 200 | 10 | 20/11/2026 |
| Autres en 200 | Le Site Info, Challenge, La Vie Éco, LeBrief, Aujourd'hui le Maroc, LNT, Infomédiaire, Consonews, Femmes du Maroc, Yabiladi (3 items) | 200 | — | — |
| En échec | Le Desk, Morocco World News, 2M, SNRT (403) ; Le Matin et H24 (HTML, pas de flux) ; MAP (flux périmé, 2022) | — | — | — |

**Afrique**

| Média | URL | Statut | Items | Dernier item |
|---|---|---|---|---|
| Jeune Afrique | `https://www.jeuneafrique.com/feed/` | 200 | 30 | **pubDate vide** |
| TechCabal | `https://techcabal.com/feed/` | 200 | 10 | 28/11/2026 |
| WeAreTech Africa | `/fr/feed`, `?format=feed` | 404 / 500 | — | repli `site:wearetech.africa` (39) |
| Disrupt Africa | `https://disruptafrica.com/feed/` (le domaine `disrupt-africa.com` est périmé, 2024) | 200 | 10 | 27/11/2026 |
| Autres en 200 | Rest of World, Le Monde Afrique, RFI Afrique, Africanews FR, Seneweb, Benjamin Dada, Wamda, Leaders TN, TSA Algérie ; Québec : La Presse techno, Radio-Canada techno, Isarta ; Belgique : RTBF ; Suisse : Le Temps, ICTjournal, RTS | 200 | — | — |
| En échec | Techpoint (403), Agence Ecofin (flux vide ou de 2025), Menabytes (périmé en 2025), TechCrunch Africa (tag périmé en 06/2026) | — | — | — |

---

## 6. Ce que les tests montrent sur la mesure du décalage

| Cas | Signal | US | FR | MA | Lecture |
|---|---|---|---|---|---|
| Labubu | Trends : 1re semaine ≥ 5 (échelle commune) | 13–19/10/2024 | 27/04–03/05/2025 | 04–10/05/2025 | US→FR ≈ 28 sem. ; FR→MA ≈ 1 sem. [V] |
| Labubu | Trends : pic | 13–19/07/2025 (100) | 20–26/07/2025 (63) | 08–14/06/2025 (66) | Pic marocain **avant** les US [V] |
| Labubu | Wikipedia : 1er mois ≥ 10 % du pic | en 2025-05 | fr 2025-08 | ar 2025-06 | Cohérent avec Trends [V] |
| Labubu | 1er article presse MA (Google News `site:`) | — | — | Le Matin 23/06/2025 ; Hespress 01/07/2025 | La presse suit le pic de recherche [V] |
| Pickleball | Trends (5 ans, agent précédent, même jour) | pic 12–18/04/2026 (100), dernier point 50 | pic 08–14/02/2026 (9), dernier 5 | pic 29/03–04/04/2026 (8), dernier 1 | Diffusion lente et faible hors US [V] |
| Pickleball | Wikipedia : pic | en 2023-10 | fr 2026-08 | — | Décalage d'environ 34 mois en/fr [V] |
| Chocolat de Dubaï | Autocomplétion | « near me, strawberries » | « lidl, lindt, carrefour, aldi » | « maroc, casablanca, prix maroc, marjane » | Stade commercial local atteint en FR et au MA [V] |
| Apps iOS | Top 30 US absent des top 100 FR et MA | — | — | — | 18/30 [V] |
| Apps Android | Top 50 US absent des top 200 FR et MA | — | — | — | 24/50 [V] |

Deux constats pour la conception [E] :
- (1) **Le décalage n'est pas linéaire** (US → FR → MA). Le Maroc peut suivre le Golfe, l'Asie ou des diasporas en parallèle de la France, comme le montre Labubu avec un pic MA avant le pic US.
- (2) Les métriques doivent être **relatives au pic propre à chaque pays** et à des **seuils de présence**, pas à des volumes absolus.

---

## 7. Implications pour l'outil

1. **Stocker des instantanés dès le premier jour.** La moitié des sources gratuites ne garde pas d'historique (RSS Trends, autocomplétion, classements Apple et Play, Product Hunt, HN top) : prévoir une collecte planifiée (Trends RSS toutes les 30 à 60 min, classements et autocomplétion une fois par jour) vers SQLite ou Parquet. Sans cela, impossible de dater une arrivée après coup.
2. **Séparer les sources avec historique et celles du présent.** Le rattrapage historique passe par Trends explore (5 ans), Wikipedia per-article (depuis 2015), le jeu DP pays (depuis 02/2023), Google News `after:`/`before:` et HN Algolia.
3. **Résoudre les entités.** Pivot « concept » : **QID Wikidata**, qui donne les titres en en, fr, ar et ary, plus la jointure avec le jeu DP pays. Pivot « produit » : identifiant Apple (`im:id`) et package Play, stables d'un pays à l'autre. Pivot « mot-clé » : traduction et variantes locales par LLM (« dubai chocolate » → « chocolat dubaï » → « شوكولاتة دبي »), complétées par les RELATED_QUERIES de Trends par pays.
4. **Définir les métriques de décalage.**
   - `t_emergence(pays)` : première semaine où la série dépasse X % de son pic propre ou un seuil sur l'échelle commune.
   - `lag_FR = t_FR − t_US`.
   - `présence(app, pays, N)` : app dans le top N ou non.
   - `stade_local(pays)` : qualificatifs ville, prix ou enseigne dans l'autocomplétion.
   - `t_presse(pays)` : premier article dans la liste `site:` du pays.
   - Score d'opportunité = signal fort aux US × absence en FR ou au MA × proximité culturelle (traitée sur un autre axe).
5. **Gouverner les quotas.** Un seau de jetons par hôte. Respect de `Retry-After` (Wikimedia, Google). Au moins 5 s entre deux appels GDELT. UA Wikimedia conforme avec une URL de contact du projet. Amorce de cookie pour Trends. Relances bornées sur Apple et Google News (503 et 502 fréquents). Cache local. Faire tourner la collecte sur une IP dédiée : l'IP partagée de cette étude a déclenché des 429 [E].
6. **Classer les sources par risque de CGU, avec un interrupteur et un repli.**
   - Ouvertes : Wikimedia, HN, Apple RSS, GDELT, npm et PyPI, RSS de médias.
   - Zone grise : Trends explore, autocomplétion, Play batchexecute, Google News RSS.
   - Bloquées : Amazon FR, Etsy, Kickstarter, Similarweb.
   - Chaque adaptateur en zone grise prévoit un repli payant documenté (DataForSEO ou SerpApi pour Trends).
7. **Monétisation.** Pour un produit commercial, éviter de **revendre** les données brutes Product Hunt (non commercial) et Cloudflare Radar (NC). Les utiliser comme signaux internes d'aide à la décision ou demander une exception. [H] Conseil juridique à prévoir.
8. **Traiter le Maroc à part.** Peu de volume (DP Wikimedia : 87 lignes ; top-per-country à 3 articles). Il faut des signaux de présence, des listes de médias curées (Le360, TelQuel, Hespress, Le Site Info, Challenge, LeBrief, Welovebuzz, plus `site:` pour Medias24 et L'Economiste) et une couverture **trilingue** (fr, ar, darija : `ary.wikipedia` existe, mais aucune édition Google News `MA:ar`).
9. **Ne pas construire sur des sources mortes** : OSS Insight Trending, GH Archive (dégradé), pytrends, PA-API 5, endpoints Trends `dailytrends`/`realtimetrends`, GitHub /trending (via ce proxy).

---

## 8. Liste minimale à 0 € pour détecter une tendance US et dater son arrivée en France et au Maroc

1. **Google Trends** : RSS Trending Now (US, FR, MA, toutes les heures) et **explore/multiline non officiel** avec une requête comparative US+FR+MA par mot-clé surveillé (5 ans, une semaine de résolution). C'est la mesure principale du décalage.
2. **Autocomplétion Google et YouTube** (`gl=us|fr|ma`, `hl=en|fr|ar`) : instantané quotidien de la liste de veille, pour la présence et le stade commercial local.
3. **Wikimedia** : API Pageviews per-article (en, fr, ar, ary) et **fichier quotidien DP country_project_page** (pays × QID), pour le décalage linguistique et pays avec historique.
4. **Google News RSS** : recherches `when:` et `after:`/`before:` avec des listes `site:` de domaines FR et MA, pour dater la première mention dans la presse.
5. **Apple App Store RSS v2** (et legacy par genre) et **Google Play batchexecute** : top 100 ou 200 par pays et catégorie, une fois par jour, pour la présence ou l'absence de produits.
6. **Flux RSS de médias** : environ 25 flux US (détection), environ 15 flux FR et environ 12 flux MA qui fonctionnent (datation éditoriale).
7. **Hacker News, Product Hunt (Atom) et recherche GitHub** pour le *t0* tech et IA aux US.

Gratuit mais sur inscription, à ajouter dès que possible : Cloudflare Radar (jeton gratuit, licence NC), BigQuery (CrUX `country_ma` et `country_fr`, Google Trends international), candidature à l'**API Google Trends alpha**.
Premier achat conseillé si les endpoints Google non officiels cassent : **DataForSEO Trends** (0,0027 $ par tâche) ou **SerpApi** (gratuit jusqu'à 250 requêtes par mois, puis 25 $ pour 1 000).

---

## 9. Questions ouvertes

1. L'API Google Trends alpha sera-t-elle ouverte en 2027 ? Avec quels quotas et prix, et intégrera-t-elle Trending Now ? Combien de temps faut-il pour être accepté ?
2. Le jeu BigQuery `google_trends.international_*` contient-il FR et MA ? (Requête SQL à lancer avec un projet GCP.)
3. Dans quel niveau de risque Wikimedia le Maroc est-il classé ? Les 429 disparaissent-ils depuis une IP dédiée avec un UA conforme ?
4. Combien de temps le gabarit `batchexecute` de Google Play (`bl=boq_playuiserver_20220612`) restera-t-il valide, et à quel rythme `google-play-scraper` est-il mis à jour ?
5. Cloudflare Radar : la limite de 10 000 req/jour est-elle réelle ? Le classement `location=MA` est-il bien rempli ? Une exception commerciale à la licence CC BY-NC est-elle envisageable ?
6. Le rang de popularité CrUX est-il disponible par pays (`country_ma`) ? Sous quelle licence ?
7. GDELT `sourcecountry:MO` indexe-t-il réellement la presse marocaine francophone (Le360, Hespress) ? À tester depuis une IP dédiée.
8. Quelle est la cause de l'effondrement des événements publics GitHub en 2026 (changement d'API ?), et quelles alternatives existent pour les dépôts en tendance ?
9. Spotify par pays : peut-on accéder légalement aux classements FR et MA (charts.spotify.com connecté) sans passer par kworb ?
10. Quel est le cadre légal du scraping d'endpoints non officiels pour un produit commercial (CGU Google, droit des bases de données UE, loi marocaine) ? À confier à l'axe juridique.
11. Quels seuils d'émergence (X % du pic, nombre de semaines consécutives) prédisent le mieux une adoption durable plutôt qu'un pic passager ? À calibrer sur une vingtaine de cas historiques (Labubu, chocolat de Dubaï, pickleball, padel, Stanley cup, BeReal...).

---

## 10. Sources principales (consultées le 28/11/2026 sauf mention)

- Google Trends API alpha : https://developers.google.com/search/apis/trends ; annonce du 24/07/2025 : https://developers.google.com/search/blog/2025/07/trends-api
- Google Trends BigQuery : https://support.google.com/trends/answer/12764470 ; https://cloud.google.com/blog/products/data-analytics/international-google-trends-datasets-in-bigquery (03/2022)
- pytrends, trendspyg, trendspy : https://pypi.org/project/pytrends/ (4.9.2, 13/04/2023) ; https://pypi.org/project/trendspyg/ (1.9.0, 01/10/2026) ; https://pypi.org/project/trendspy/ (0.1.6, 25/12/2024) ; [S] https://apiserpent.com/blog/pytrends-dead-google-trends-data-2026 ; [S] https://scrapfly.io/blog/posts/google-trends-api-alternatives
- SerpApi : https://serpapi.com/pricing ; https://serpapi.com/google-trends-api — DataForSEO : https://dataforseo.com/apis/google-trends-api — Glimpse : https://meetglimpse.com/google-trends-api — Treendly : https://treendly.com/pricing — Exploding Topics : https://explodingtopics.com/pricing ; https://explodingtopics.com/feature/et-api
- Wikimedia : https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits (modifiée le 08/11/2026) ; https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy ; https://analytics.wikimedia.org/published/datasets/country_project_page/00_README.html
- Apple RSS : https://rss.marketingtools.apple.com/
- Google Play : paquet npm `google-play-scraper` 10.1.4 (modifié le 17/10/2026)
- Product Hunt : https://api.producthunt.com/v2/docs ; https://api.producthunt.com/v2/docs/rate_limits/headers
- Hacker News : https://github.com/HackerNews/API ; https://hn.algolia.com/api
- OSS Insight : réponse de https://api.ossinsight.io/v1/trends/repos (28/11/2026) — GH Archive : https://data.gharchive.org/
- GDELT : https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
- Cloudflare Radar : https://developers.cloudflare.com/api/resources/radar/subresources/ranking/methods/top/ ; https://developers.cloudflare.com/radar/investigate/domain-ranking-datasets/ ; https://radar.cloudflare.com/about
- CrUX : https://developer.chrome.com/docs/crux/bigquery ; https://developer.chrome.com/docs/crux/methodology/metrics
- Semrush MCP : https://developer.semrush.com/api/basics/semrush-mcp/ — Similarweb : https://developers.similarweb.com/docs/similarweb-web-traffic-api — Ahrefs : https://docs.ahrefs.com/
- Amazon PA-API : https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation
- Tranco : https://tranco-list.eu/api/lists/date/latest — Common Crawl : https://index.commoncrawl.org/collinfo.json — YC (miroir) : https://yc-oss.github.io/api/meta.json — kworb : https://kworb.net/spotify/country/ma_daily.html

Fichiers bruts des tests : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/work/` (agent précédent) et `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/work2/` (revérification du 28/11/2026). Script Google Play : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/work2/scripts/gplay.py`.

---

## Contre-verification

**Vérificateur indépendant, 28/11/2026, environ 13 h 40–14 h 30 UTC.** Tous les appels ont été refaits avec mes propres scripts, sans réutiliser les fichiers de l'agent : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/cv_open/scripts/` (trends_multi.py, gplay_cv.py) et sorties brutes dans `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/cv_open/dl/`. Le quota de recherche web de la session était épuisé : seules des pages primaires lues en direct (curl) ont servi. Verdicts : **confirmé**, **corrigé** (valeur corrigée et source), **réfuté**, **invérifiable**.

### Verdicts

| # | Affirmation (résumé) | Verdict | Ce que j'ai observé |
|---|---|---|---|
| 1 | API Google Trends = alpha sur candidature, sans quota, prix ni Trending Now ; 5 ans, jour/semaine/mois/an, pays et sous-régions, J-2 | **Confirmé** | Page relue : « Get early access to the Google Trends API alpha », « We're now accepting applications for alpha testers », aucune mention de quota, de prix ni de Trending Now. Blog du 24/07/2025 : « available only to a very limited number of testers », « up to just 2 days ago », « 1800 days », ISO 3166-2. |
| 2 | Trends explore + multiline : 261 points hebdomadaires, échelle commune ; Labubu ≥ 5 : US 13–19/10/2024, FR 27/04/2025, MA 04/05/2025, soit ≈ 28 sem. US→FR et ≈ 1 sem. FR→MA | **Corrigé** | Reproduction exacte : amorce 429 avec cookie NID, explore 200 (11 307 octets), multiline 200 (48 619 octets), 261 points, mêmes dates. **Mais le décalage dépend entièrement du seuil.** Seuil ≥ 1 : US 04/08/2024, FR 06/10/2024, MA 20/04/2025, soit **9 sem.** US→FR et **28 sem.** FR→MA. Seuil ≥ 10 % du pic propre : US 02/02/2025, FR et MA 11/05/2025, soit **14 sem.** et **0 sem.** Seuil ≥ 50 % du pic propre : US 18/05, MA 01/06, FR 29/06/2025, soit **6 sem.** US→FR et **−4 sem.** FR→MA (MA *avant* FR). Le résultat « 28 sem. / 1 sem. » n'est donc pas robuste : il faut donner une fourchette (6 à 28 sem. US→FR ; de −4 à +28 sem. FR→MA). Les valeurs 0 du MA jusqu'en avril 2025 peuvent signifier « sous le seuil de volume Google » plutôt qu'une absence. |
| 3 | RSS Trending Now : 200, 10 items, fenêtre de quelques heures ; dailytrends, realtimetrends et trendingsearches/daily/rss en 404 | **Confirmé** | US, FR, MA, CA-QC et SN : 200, 10 items, 10 `ht:approx_traffic`, 27 à 30 `ht:news_item`. Fenêtre MA : de 23 h 00 à 05 h 00 PST (≈ 6 h), contenu sport et politique (« betis – rayo », « al hazm – al-nassr »). Les trois anciens endpoints → 404. 7 des 12 codes pays n'ont pas été retestés. |
| 4 | iOS : 18 des 30 premières apps US absentes des top 100 FR et MA ; Whatnot en FR mais pas au MA ; Vinted #7 US (flux inverse) | **Corrigé** | Le décompte se reproduit (18/30, flux du 28/11/2026 13:42 UTC ; rangs changés : Whatnot US #5 / FR #5, Vinted US #7 / FR #24). **Mais `itunes.apple.com/lookup?id=…&country=` montre que 14 des 18 apps « absentes » ne sont pas disponibles dans le store FR, et 13 sur 18 dans le store MA.** Sont concernées PineDrama, Kalshi, Muse from Meta, Walmart, Target, Best Buy, Lowe's, Gap, Capital One Shopping, Tubi, Trump Accounts, TikTok Pro, VIZIO… Whatnot, Vinted et Shop (Shopify) **ne sont pas distribuées dans le store MA**. Leur absence au MA est donc un géoblocage, pas un retard. Seules 4 apps sont disponibles mais absentes des tops : GoWish, Giftful, Netflix Game Controller et Disney+. Le relevé tombe aussi au lendemain du Black Friday (27/11/2026), ce qui gonfle les apps de commerce US. `n=101` → 504 puis 500. |
| 5 | Google Play batchexecute vyAe2 : 200 apps par pays ; 24 des 50 premières US absentes des top 200 FR et MA ; MA topgrossing 115 | **Confirmé** (même biais qu'au n° 4) | us, fr et ma → 200 avec 200 apps ; MA topgrossing → 115 ; 24/50 absentes. google-play-scraper 10.1.4, publié le 17/10/2026 (registre npm) ; le gabarit `bl=boq_playuiserver_20220612` fonctionne encore. Les absentes sont surtout des services réservés aux US : Walmart, Lowe's, Best Buy, Cash App, Peacock, CBS, T-Mobile Tuesdays, TextNow, One Finance, Trump Accounts. Je n'ai pas vérifié leur disponibilité par pays côté Play. |
| 6 | Wikimedia DP country_project_page : TSV quotidien depuis le 06/02/2023, ≈ 16 Mo ; MA 87 lignes, FR 10 770, US 97 501, **CI 0** ; rareté du MA due aux seuils 90/550/1 000 selon le niveau de risque | **Corrigé** | Fichier du 27/11/2026 : 200, 16 079 853 octets, 247 639 lignes ; MA 87, FR 10 770, US 97 501 (identique). **CI = 19 lignes** (le pays est libellé « Ivory Coast »), pas 0. **Cause erronée** : le minimum observé au MA est de **90 vues**, comme pour FR et US. Le Maroc est donc au palier « lower risk » (seuil > 90), pas « medium/higher ». Sa rareté vient du faible trafic par page (plus le seuil d'ingestion de 150 vues mondiales) et ne s'améliorera pas par un changement de palier. README : seuils 90/550/1 000, IC à 95 % de 35,7/176,5/352,5 ; les pays medium/higher risk ne sont inclus que **depuis le 15/02/2024** ; US absents du 06/02 au 19/09/2023. Le fichier du 2023-02-05 renvoie 404 et celui du 2023-02-06 contient déjà les QID (rétro-ajoutés). Aucune licence trouvée dans le README. |
| 7 | Politique Wikimedia 2026 : 10 req/min sans identification, 200 req/min avec UA conforme, Retry-After (sinon ≥ 5 s), ≤ 3 requêtes concurrentes ; UA génériques en 403 | **Confirmé** | Révision du **2026-11-08T20:04:57Z** : 10 / 200 (navigateur non authentifié et bot avec UA conforme) / 2 000 (éditeurs établis), « enforced per user », « new in 2026 and subject to experimentation and change », ≤ 3 concurrentes, Retry-After ou ≥ 5 s. Test : UA `python-requests/2.32` → **403** ; UA conforme → 429 avec **retry-after 32 s et 47 s**, puis 200 (au-delà des 4–27 s annoncés). |
| 8 | Pageviews : Labubu en 2025-07 (1,41 M), fr 2025-08 (91 132) ; Pickleball en 2023-10, fr 2026-08 (≈ 34 mois) ; top-per-country MA = 3 articles | **Confirmé** | en Labubu : pic 2025-07, 1 412 695 vues ; fr : 2025-08, 91 132 (série démarrant en 2025-06) ; Pickleball en : 2023-10, 304 359 ; fr : 2026-08, 15 281 ; top-per-country MA du 26/11/2026 : 3 articles (Main_Page, Wikipédia:Accueil_principal, Portal:Toolforge). L'édition ar n'a pas été retestée. |
| 9 | Autocomplétion par pays : MA « maroc, casablanca, prix maroc, marjane » ; FR « lidl, lindt, carrefour, aldi » | **Confirmé** | gl=ma : maroc, casablanca, prix maroc, rabat, agadir, marrakech, mood, mercadona, marjane. gl=fr : recette, lidl, lindt, carrefour, ingrédients, algerie, pistache, fix, aldi. À `hl=fr` constant, changer seulement `gl` change la liste, donc le paramètre agit même depuis une IP non locale. YouTube (`ds=yt`) et Amazon.fr → 200. Nuance : la colonne US du §6 (« near me, strawberries ») porte sur un autre mot-clé (« dubai chocolate ») ; avec « chocolat dubai », gl=us donne « tunisie, maroc, costco ». |
| 10 | Google News RSS : gl=MA ≠ presse marocaine ; MA:ar → EG:ar ; Labubu dans Le Matin le 23/06/2025 et dans Hespress le 01/07/2025 ; ≈ 100 items ; 503 | **Confirmé** (chiffres actualisés) | « pickleball when:1y » en MA:fr → **100 items** (Ouest-France 20, Radio-Canada 12, FFT 11), contre 70 annoncés. `ceid=MA:ar` → **302** vers `EG:ar`. Recherche `labubu (site:lematin.ma OR site:hespress.com OR site:le360.ma) before:2025-09-01` → 3 items seulement : Le Matin le 23/06/2025, Hespress le 01/07/2025 et un article hors sujet. Le rappel est donc faible. **Le repli `site:` dépend de l'édition** : `site:axios.com when:2d` donne 0 item en MA:fr et 20 en US:en. `site:leconomiste.com` a renvoyé 503 puis 60 items. |
| 11 | OSS Insight indisponible depuis le 01/03/2026 (≈ 0,3 %) ; GH Archive horaire : 4,76 Mo (27/11/2026), 25,6 Mo (27/11/2025), 37,8 Mo (10/02/2026) | **Confirmé** (avec précision) | OSS Insight : `data_quality.status=unavailable`, `unavailable_since=2026-03-01`, « roughly 0.3% of baseline ». GH Archive : 4 760 676 / 25 572 193 / 37 813 033 octets (identique). **Mais GH Archive pesait encore 32,6 Mo le 02/03/2026, 20,5 Mo le 01/08 et 23,9 Mo le 15/09, puis 3,9 Mo le 15/10/2026.** Sa chute date de septembre–octobre 2026 : ce n'est pas le même événement que la panne d'OSS Insight. |
| 12 | pytrends archivé (4.9.2, 13/04/2023) ; trendspyg 1.9.0 (01/10/2026) ; trendspy 0.1.6 (25/12/2024) | **Confirmé** | API JSON PyPI : dates identiques. Recherche GitHub : `GeneralMills/pytrends archived=true`. |
| 13 | Replis payants : DataForSEO 0,0027 $ (file standard, ≤ 45 min) / 0,011 $ (Live) ; SerpApi 250 gratuits, 25 $ pour 1 000, 75 $ pour 5 000 ; Exploding Topics API en option du plan à 249 $, dès 1 000 $/mois, sans géo, usage commercial sur devis | **Confirmé** | DataForSEO : « Turnaround time up to 45 minutes Price per task $0.0027 » ; Live 0,011 $ (≈ 32 s). SerpApi : Free 0 $ pour 250, Starter 25 $ pour 1 000, Developer 75 $ pour 5 000, Production 150 $ pour 15 000. SerpApi propose aussi « Google Trends Trending Now API » et « Google Trends Autocomplete API ». Exploding Topics : option du Pro Business à partir de 249 $/mois ; 1 000 req = 1 000 $, 5 000 = 2 000 $, 25 000 = 4 000 $ ; 60 req/min ; « aren't able to offer custom keyword and geo-based data lookups » ; « want to use the API for commercial purposes (like integrating it into your product), contact us for custom pricing ». |
| 14 | API Product Hunt non commerciale par défaut (6 250 points / 15 min) ; données de l'API Cloudflare Radar sous CC BY-NC 4.0 ; TRENDING_RISE par pays | **Confirmé** (source Radar à remplacer) | PH : « By default the Product Hunt API must not be used for commercial purposes » ; 6 250 points de complexité / 15 min (GraphQL) et 450 req / 15 min ; flux Atom 200 avec 50 entrées. Radar : `radar.cloudflare.com/about` renvoie **403** (challenge, illisible). La licence est confirmée sur developers.cloudflare.com/radar/ : « Data available via Radar API endpoints is made available under the CC BY-NC 4.0 license ». POPULAR, TRENDING_RISE et TRENDING_STEADY figurent dans la référence API. Sans jeton → 400 (code 9106). Nuance : la liste ordonnée par pays se limite au **top 100** des domaines. |
| 15 | ≈ 70 % des flux RSS médias en 200 ; Axios, BoF, Medias24 et L'Economiste bloqués mais accessibles via `site:` | **Confirmé** (cause précisée) | Échantillon de 21 flux : 17 en 200, avec des items datés du 18 au 28/11/2026 (Welovebuzz : dernier item le 20/11). 403 pour Axios, BoF, Medias24 et L'Economiste. En mode verbeux, le tunnel du proxy s'établit : le 403 vient de **l'origine**, avec la page Cloudflare « Just a moment... » pour Medias24 et L'Economiste. C'est de l'anti-bot sur IP de datacenter, pas une politique de l'environnement. |
| 16 | BigQuery Google Trends international (« approximately 50 additional countries ») : présence de FR et MA inconnue | **Invérifiable** | La page d'aide confirme « approximately 50 additional countries » et des requêtes par code ISO. Pas de projet GCP ici (« Cannot start a job without a project id ») et recherche web épuisée : la couverture FR/MA reste inconnue. |
| 17 | Décalage non linéaire : pic MA (08–14/06/2025) avant les pics US (13–19/07) et FR (20–26/07) | **Corrigé** | Dates de pic reproduites. Mais la valeur US de la semaine du 08–14/06 est **97** (pic à 100 le 13–19/07) : les US forment un plateau de 87 à 98 de juin à juillet. « Le MA précède les US » est un artefact de pic dans un plateau. Ce qui est robuste : la montée du MA (≥ 50 % de son pic le 01/06/2025) est **concomitante** de celle des US (18/05) et **précède** celle de la FR (29/06). La propagation n'est donc pas US→FR→MA, mais le MA ne « devance » pas les US. |
| 18 | GDELT : 1 req / 5 s, 4 articles « pickleball » FR sur 24 mois | **Invérifiable** | Deux appels espacés de 8 s : aucune réponse (code 000, connexion coupée). Rien n'a pu être reproduit. |

### Ce que la conception doit corriger ou ne pas supposer

1. **Absence d'une app dans un top ≠ décalage.** Vérifier la disponibilité par storefront avant de compter une absence : `itunes.apple.com/lookup?id=&country=` côté iOS, fiche Play avec `gl=` côté Android. Exclure aussi les services nationaux (commerce, banques, télécoms et services publics US). Sur iOS, 14 des 18 absences en FR et 13 des 18 au MA sont des géoblocages ; Whatnot et Vinted ne sont pas distribuées au MA.
2. **Corriger la saisonnalité** (Black Friday, Thanksgiving, Ramadan, rentrée) avant de comparer des classements. Le relevé du 28/11/2026 tombe au lendemain du Black Friday.
3. **Ne pas publier un décalage Trends en un seul chiffre.** Pour Labubu, il va de 6 à 28 semaines US→FR selon le seuil, et de −4 à +28 semaines FR→MA. Il faut fixer une définition (par exemple, date à 50 % du pic propre), la calibrer sur des cas historiques et afficher une fourchette. Une valeur 0 au MA doit être lue comme « sous le seuil de volume Google ».
4. **Ne pas conclure qu'un pays en précède un autre sur la seule date de pic.** Utiliser des métriques de montée (date à 50 % du pic, pente) avec une tolérance.
5. **Wikimedia DP pour le Maroc** : le pays est déjà au palier le plus permissif (seuil 90). La couverture (≈ 87 pages par jour) restera marginale ; ne pas en faire un signal MA. CI n'est pas à 0 (19 lignes) ; vérifier les libellés de pays (« Ivory Coast »). Pour l'historique : pays medium/higher risk inclus seulement depuis le 15/02/2024, US absents du 06/02 au 19/09/2023.
6. **Wikimedia** : un UA conforme avec contact est obligatoire (`python-requests` → 403). Retry-After observé jusqu'à 47 s. Les limites sont déclarées « expérimentales » : les rendre paramétrables.
7. **Google News `site:`** : choisir l'édition (`ceid`) selon le pays du domaine (Axios : 0 item en MA:fr, 20 en US:en) et gérer les 503. Le rappel est faible sur la presse marocaine : une « première mention » trouvée ainsi n'est qu'une date au plus tard, pas la date d'arrivée réelle.
8. **Endpoints Google non officiels** (explore, autocomplétion, Play batchexecute, News RSS) : aucun contrat, et le gabarit Play date de 2022. Prévoir un interrupteur par adaptateur et un repli payant chiffré : DataForSEO à 0,0027 $ par tâche, ou SerpApi, qui couvre aussi Trending Now et l'autocomplétion Trends.
9. **Licences** : API Product Hunt non commerciale par défaut, Radar sous CC BY-NC 4.0 (et limité au top 100 par pays), API Exploding Topics en usage commercial sur devis. Ne pas les intégrer dans un produit payant sans accord écrit.
10. **Anti-bot côté origine** (Medias24, L'Economiste, Axios, BoF, page À propos de Radar) : ne pas supposer qu'une autre IP de datacenter suffira. Garder le repli Google News `site:`.
11. **Ne rien construire sur GH Archive ni OSS Insight.** La chute de GH Archive date de septembre–octobre 2026 et n'est pas liée à la panne d'OSS Insight (mars 2026).
12. **Ne pas inscrire BigQuery Google Trends international au plan** tant que la présence de FR et MA n'a pas été testée avec un projet GCP.
