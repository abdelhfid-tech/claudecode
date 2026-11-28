# Axe « Accès aux données des plateformes sociales » — état au 28 novembre 2026

Projet : Radar d'arbitrage de tendances (USA → Europe → Maroc / France / francophonie), lecture PAYS x NICHE x LIFESTYLE.
Date des vérifications : 2026-11-28 (sondes curl entre 12:30 et 12:42 UTC depuis un conteneur cloud, IP de datacenter, sans aucun compte ni clé).

## 0. Méthode et limites de cette étude

- **Sondes réelles** : environ 110 appels curl sans authentification, consignés en section 2 (URL exacte, statut HTTP, extrait).
- **Sources primaires lues** : documentation officielle X, YouTube/Google, TikTok for Developers, Meta (Graph API, Transparency), Reddit (conditions), Pinterest (spécification OpenAPI officielle sur GitHub), Bluesky, Mastodon, Twitch, Telegram, pages de prix Apify, ScrapeCreators, EnsembleData, Bright Data, SerpApi, DataForSEO, fiche CNIL.
- **Limite importante** : le budget de recherche web partagé entre agents a été épuisé après une dizaine de recherches. La suite a été faite en lisant directement des pages officielles connues. Conséquence : quelques points n'ont pas pu être recoupés et sont marqués **[non revérifié]** (connaissance interne antérieure à juin 2026) ou **[source tierce]** (blog non officiel).
- Convention : **[vérifié]** = lu sur source primaire ou observé par sonde le 2026-11-28 ; **[estimation]** = calcul à partir de prix vérifiés ; **[hypothèse]** = inférence.
- Les prix sont en USD (devise de facturation des fournisseurs). Les budgets « 50 € » et « 200 € » sont approximatifs.

## 1. Synthèse

1. **Le signal TikTok gratuit a disparu.** Le Creative Center a migré vers TikTok One. Sans connexion, les pages Tendances renvoient une coquille vide (« No data available », « Log in or sign up ») et l'ancienne API interne répond `{"code":40101,"msg":"no permission"}` [vérifié par sonde]. Un relevé tiers du 27 octobre 2026 indique : 3 hashtags par pays hors connexion, 27 pays, onglet « sons » supprimé, vidéos seulement pour les USA [source tierce]. La Research API reste fermée aux usages commerciaux. TikTok organique ne peut donc venir que d'un scraper tiers payant ou d'une saisie humaine.
2. **Les bibliothèques publicitaires DSA sont la meilleure source officielle gratuite pour la France et la Belgique**, mais elles ne couvrent ni les USA ni le Maroc pour les publicités commerciales : Meta Ad Library API (toutes les publicités uniquement si elles ont touché l'UE), TikTok Commercial Content API (27 pays UE + IS, LI, NO + GB, CH), Snapchat Ads Library API (ouverte sans clé, testée 200).
3. **YouTube reste exploitable mais affaibli** : `chart=mostPopular` ne renvoie plus que les classements Musique, Films et Jeux vidéo depuis le 21 juillet 2025 ; `search.list` est plafonné à 100 appels par jour dans un compartiment de quota séparé. Les flux RSS par chaîne (y compris la liste Shorts `UUSH…`) fonctionnent sans clé et donnent les vues.
4. **X est redevenu abordable pour les tendances** : paiement à l'usage officiel depuis le 6 février 2026, 0,010 $ par requête Trends, 0,005 $ par post lu. Les tendances par lieu n'existent pas pour le Maroc, le Sénégal, la Côte d'Ivoire ni la Tunisie [hypothèse forte, à confirmer avec une clé].
5. **Reddit est fermé sans authentification depuis un datacenter** : `.json`, `old.reddit`, `api.reddit.com` → 403 ; RSS → 404 ; `robots.txt` = `Disallow: /`. Les conditions (révisées le 20 juillet 2026) imposent un accord séparé pour tout usage commercial.
6. **Pinterest est la bonne surprise** : l'outil public trends.pinterest.com expose un point d'accès JSON sans clé (testé 200 pour US, FR, CA, GB, DE+AT+CH, NL+BE+LU), et l'API officielle v5 Trends liste FR, CA, NL+BE+LU, DE+AT+CH et même un groupe contenant MA. C'est le meilleur signal « lifestyle » gratuit par pays.
7. **Bluesky et Mastodon sont ouverts mais faibles** : tendances Bluesky globales (anglophones, pas de paramètre pays), Jetstream opérationnel (environ 41 posts/s, champ `langs`), Mastodon par instance avec des volumes de quelques dizaines de comptes.
8. **Maroc et Afrique subsaharienne francophone sont le point aveugle** de presque toutes les sources officielles. Il faut des substituts : YouTube `regionCode=MA`, panels de créateurs suivis par RSS, scrapers TikTok/Instagram payants avec ciblage par mots-clés en darija/français, classements Apple par pays.
9. **Tiers payants, prix réels** : ScrapeCreators 47 $ pour 25 000 crédits sans expiration (1,88 $ / 1 000) ; EnsembleData 100 $/mois pour 1 500 unités/jour ; Apify Instagram 2,70 $ → 1,50 $ / 1 000 résultats ; Bright Data 1,50 $ / 1 000 enregistrements avec 5 000 gratuits par mois ; SerpApi 250 recherches gratuites puis 25 $ / 1 000.
10. **Risque juridique** : la jurisprudence américaine 2024 (Meta c. Bright Data, X c. Bright Data) protège le scraping de données publiques hors connexion, mais les procès 2025-2026 (Reddit c. Perplexity/SerpApi, Google c. SerpApi) visent les intermédiaires. Le risque principal pour l'outil est la **rupture de service d'un fournisseur**, puis le RGPD si l'on stocke des données de personnes.

## 2. Journal des sondes réelles (2026-11-28, sans clé, IP datacenter)

| Plateforme | URL exacte | HTTP | Extrait / observation |
|---|---|---|---|
| Bluesky | `https://public.api.bsky.app/xrpc/app.bsky.unspecced.getTrendingTopics?limit=10` | 200 | `{"topics":[{"topic":"Victoria votes in state election",…` ; sujets US/anglophones |
| Bluesky | `https://public.api.bsky.app/xrpc/app.bsky.unspecced.getTrends?limit=5` | 200 | champs `displayName, postCount, status (cooling/stale), category, startedAt, actors` ; identique avec `Accept-Language: fr` |
| Bluesky | `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=tendance&lang=fr&limit=3` | 403 | page HTML « 403 Forbidden » |
| Bluesky | `https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=maroc&sort=top&lang=fr&limit=2` | 200 | posts `langs:["fr"]`, `likeCount` présent |
| Bluesky | `https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot&limit=2` | 200 | flux « What's Hot » lisible |
| Bluesky Jetstream | `wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post` | 101 | 247 messages en 6,1 s (environ 41/s), chaque post porte `langs` |
| Mastodon | `https://mastodon.social/api/v1/trends/tags?limit=5` | 200 | `BooksForTurtles` 75 comptes / 243 usages ; en-tête `x-ratelimit-limit: 300` |
| Mastodon | `https://mastodon.social/api/v1/trends/statuses?limit=2`, `/trends/links?limit=3` | 200 | statuts et liens tendance |
| Mastodon FR | `https://piaille.fr/api/v1/trends/tags?limit=5`, `https://mamot.fr/api/v1/trends/tags?limit=3` | 200 | `vendredilecture`, `caturday` ; volumes de 2 à 136 comptes |
| Mastodon | `https://mastodon.social/api/v1/timelines/tag/maroc?limit=2` | 200 | posts `language:"fr"` |
| Lemmy FR | `https://jlai.lu/api/v3/post/list?sort=Hot&limit=2` | 200 | posts francophones, scores faibles (2 à 3) |
| Reddit | `https://www.reddit.com/r/popular.json?limit=2` | 403 | page de blocage HTML (189 908 octets) |
| Reddit | `https://old.reddit.com/r/france/top.json?t=day&limit=2` | 403 | redirigé vers `/login/?reason=lor2` |
| Reddit | `https://api.reddit.com/r/france/hot?limit=2`, `https://oauth.reddit.com/r/france/hot` | 403 | même page de blocage |
| Reddit RSS | `https://www.reddit.com/r/france/.rss`, `/r/france.rss`, `/r/france/hot/.rss` | 404 | flux Atom `<title>Not Found</title>` servi par `rss.reddit.com` |
| Reddit RSS | `https://www.reddit.com/search.rss?q=maroc&sort=top&t=week` | 429 | corps vide |
| Reddit | `https://www.reddit.com/robots.txt` | 200 | `User-agent: * Disallow: /` |
| YouTube API | `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=FR&maxResults=2` | 403 | `PERMISSION_DENIED` sans clé |
| YouTube RSS | `https://www.youtube.com/feeds/videos.xml?channel_id=UCBR8-60-B28hp2BmDPdntcQ` | 200 | 15 entrées, `media:statistics views="20686"`, dates de publication |
| YouTube RSS Shorts | `https://www.youtube.com/feeds/videos.xml?playlist_id=UUSHBR8-60-B28hp2BmDPdntcQ` | 200 | 15 Shorts de la chaîne avec vues |
| YouTube | `https://www.youtube.com/feed/trending` | 200 | redirigé vers l'accueil (`FEwhat_to_watch`), 0 vidéo : la page Tendances n'existe plus |
| YouTube Charts | `https://charts.youtube.com/charts/TrendingVideos/fr/RightNow`, `/TopVideos/ma/weekly` | 200 | coquille JavaScript « YouTube Music Charts », pas de données dans le HTML |
| YouTube suggest | `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=fr&gl=MA&q=recette` | 200 | `["recette",["recette","recette crepe","recette facile et rapide",…` (non documenté) |
| YouTube oEmbed | `https://www.youtube.com/oembed?url=…&format=json` | 200 | titre, auteur, miniature |
| TikTok Creative Center | `https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en` | 200 | redirigé vers `https://ads.tiktok.com/creative/creativeCenter/trends` |
| TikTok Creative Center | `https://ads.tiktok.com/creative/creativeCenter/trends/hashtag` | 200 | texte rendu : « Rank Hashtag Posts & Views … No data available … Log in or sign up » ; `dehydratedState.queries: []` |
| TikTok Creative Center | `https://ads.tiktok.com/creative/creativeCenter/trends/video` | 200 | « Go to TikTok One to view more rankings and data » |
| TikTok CC (ancienne API) | `https://ads.tiktok.com/creative_radar_api/v1/popular_trend/hashtag/list?page=1&limit=20&period=7&country_code=FR&sort_by=popular` | 200 | `{"code":40101,"msg":"no permission"}` |
| TikTok Research API | `POST https://open.tiktokapis.com/v2/research/video/query/` | 401 | `access_token_invalid` |
| TikTok web | `https://www.tiktok.com/tag/maroc`, `/discover` | 200 | HTML de 367 Ko mais aucune donnée de hashtag dans `__UNIVERSAL_DATA_FOR_REHYDRATION__` (rendu côté client) |
| TikTok oEmbed | `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tiktok/video/7106594312292453675` | 200 | JSON d'intégration (titre, auteur) |
| TikTok Ad Library | `https://library.tiktok.com/ads?region=FR` | 200 | coquille JavaScript |
| Pinterest Trends (web) | `https://trends.pinterest.com/top_trends_filtered/?endDate=2026-11-21&country=FR&lookbackWindow=1&numTerms=20&trendsPreset=3` | 200 | 50 termes : `elise the body`, `recettes de fêtes`, `motifs de noël pour ongles` ; champs `wow_change, mom_change, yoy_change, seasonality_score, normalizedCount` |
| Pinterest Trends (web) | même URL avec `country=US`, `CA`, `GB`, `DE%2BAT%2BCH`, `NL%2BBE%2BLU`, `IL%2BNG%2BPK%2BZA%2BTR%2BMA` | 200 | 50 termes chacun ; le groupe contenant MA est dominé par le turc |
| Pinterest Trends (web) | même URL avec `country=BE`, `country=MA` | 400 | `{}` : ces pays ne sont pas servis seuls |
| Pinterest Trends (web) | `https://trends.pinterest.com/metrics/?terms=noel&country=FR&…` | 429 | limitation de débit après 3 appels rapprochés |
| Pinterest API v5 | `https://api.pinterest.com/v5/trends/keywords/FR/top/growing` | 401 | `Authentication failed.` |
| X API | `https://api.x.com/2/trends/by/woeid/23424819` | 401 | `Unauthorized` |
| X web | `https://x.com/explore/tabs/trending` | 200 | redirigé vers la page de connexion |
| X (agrégateur tiers) | `https://trends24.in/france/` | 200 | `#PetitPapaTopAchat, #BlackFridayCdiscount, Bardella…` |
| X (agrégateur tiers) | `https://trends24.in/{belgium,switzerland,canada,algeria}/` | 200 | pages présentes |
| X (agrégateur tiers) | `https://trends24.in/{morocco,senegal,ivory-coast,tunisia}/` | 404 | pas de lieu de tendance pour ces pays |
| Twitch | `https://api.twitch.tv/helix/streams?language=fr&first=5` | 401 | `OAuth token is missing` |
| Meta Ad Library (web) | `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=MA&q=cosmetique` | 403 | défi JavaScript anti-robot |
| Meta Graph | `https://graph.facebook.com/v21.0/ads_archive?ad_reached_countries=FR&search_terms=test` | 500 | `OAuthException` (jeton requis) |
| Instagram | `https://www.instagram.com/explore/tags/maroc/` | 200 | coquille sans données ; `…/api/v1/tags/web_info/` → 404 |
| Threads | `https://graph.threads.net/v1.0/keyword_search?q=maroc` | 400 | `Invalid OAuth 2.0 Access Token` |
| Snapchat Ads Library | `POST https://adsapi.snapchat.com/v1/ads_library/ads/search` corps `{"paid_country_codes":["fr"],"paying_advertiser_name":"Nike"}` | 200 | 10 publicités ; `impressions_total: 174831003`, `impressions_map` par pays UE, `targeting_v2` |
| Snapchat Ads Library | même appel sans nom d'annonceur | 400 | `payingAdvertiserName is required` |
| Snapchat | `https://trends.snapchat.com/` | 200 | redirigé vers `forbusiness.snapchat.com` : l'outil Snapchat Trends n'existe plus |
| LinkedIn Ad Library | `https://www.linkedin.com/ad-library/search?keyword=formation&countries=FR` | 403 | bloqué depuis datacenter |
| Telegram | `https://t.me/s/durov` | 200 | 20 messages, vues (`2.36M`), abonnés (`9.85M`) |
| Discord | `https://discord.com/api/v10/discovery/categories`, `/api/v9/discoverable-guilds` | 401 | `401: Unauthorized` |
| WhatsApp Channels | `https://www.whatsapp.com/channel/0029VaBaUOKHLHQhtQCw3E0q` | 200 | page générique (« Follow this WhatsApp Channel »), aucun contenu |
| Apple (substitut « sons ») | `https://rss.marketingtools.apple.com/api/v2/ma/music/most-played/10/songs.json` | 200 | classement Maroc ; 200 aussi pour us, fr, ci, dz, tn, cm ; erreurs réseau transitoires pour be, ch, sn, ca |

## 3. Constats détaillés par plateforme

### 3.1 TikTok

**Creative Center (tendances hashtags, sons, créateurs, vidéos).**
- [vérifié par sonde] Les anciennes URL redirigent vers `ads.tiktok.com/creative/creativeCenter/trends` (TikTok One, Creative Suite). Le rendu serveur ne contient aucune donnée hors connexion ; l'onglet Créateurs est marqué « Coming soon » ; l'ancienne API `creative_radar_api` répond « no permission ».
- [source tierce, 2026-10-27, https://dev.to/meng_xipeng_139608bde0640/tiktok-creative-center-trends-changed-how-to-get-this-weeks-trending-tiktoks-with-transcripts-3ell] Hors connexion : 3 hashtags par pays, 27 pays, 4 vidéos US par appel, classement hebdomadaire, plus d'onglet sons. Ce point est cohérent avec la sonde mais n'est pas confirmé par TikTok.
- Conséquence : les scrapers tiers du Creative Center (acteurs Apify, points d'accès « popular hashtags/songs » de divers fournisseurs) sont probablement cassés ou dégradés depuis l'automne 2026 [hypothèse].
- CGU : les conditions TikTok EEE (mises à jour en juillet 2026) interdisent d'« extraire des données ou du contenu de la Plateforme au moyen d'un système automatisé […] non fourni par TikTok ou approuvé par écrit » (https://www.tiktok.com/legal/page/eea/terms-of-service/en).

**Research API.** [vérifié, https://developers.tiktok.com/products/research-api/ et https://developers.tiktok.com/doc/research-api-faq]
- Éligibilité : établissements académiques aux USA, EEE, Royaume-Uni, Canada, Suisse ; organismes de recherche sans but lucratif indépendants (UE, bêta ailleurs) ; chercheurs agréés DSA. « Les créateurs, annonceurs et utilisateurs commerciaux ne sont pas éligibles. »
- Quotas : 1 000 requêtes/jour, 100 000 enregistrements/jour ; nouvelles vidéos indexées sous 48 h ; statistiques rafraîchies jusqu'à 10 jours plus tard.
- Verdict : **à écarter** pour un outil commercial.

**Commercial Content API (bibliothèque publicitaire DSA).** [vérifié]
- Accès : « le public et les chercheurs », compte TikTok for Developers avec adresse professionnelle, formulaire, réponse annoncée sous 2 jours ouvrés (https://developers.tiktok.com/products/commercial-content-api/).
- Couverture : 27 pays UE + Islande, Liechtenstein, Norvège + Royaume-Uni et Suisse, soit 33 pays (page mise à jour le 1er septembre 2026, https://developers.tiktok.com/doc/commercial-content-api-supported-countries). La page produit dit encore « seuls les pays de l'UE dans cette phase » : contradiction interne, la liste détaillée est plus récente.
- Données : recherche par mot-clé ou annonceur, dates de première et dernière diffusion, ciblage, nombre de personnes touchées, publicités refusées ; conservation pendant la diffusion puis un an. Point d'accès `POST https://open.tiktokapis.com/v2/research/adlib/ad/query/`.
- Verdict : **optionnel, gratuit** ; bon signal publicitaire FR, BE, CH. Rien pour US, MA, CA, SN, CI.

**Display API.** [vérifié, https://developers.tiktok.com/doc/display-api-overview] Profil et vidéos d'un utilisateur qui a autorisé l'application (`user.info.basic`, `video.list`). Aucune lecture de tendances. Inutile pour le radar.

**TikTok Shop.**
- API officielle Partner Center : réservée aux vendeurs et partenaires autorisés, sur leurs propres boutiques [non revérifié en détail ; la documentation `partner.tiktokshop.com/docv2` répond 200].
- La Research API mentionne un jeu de données « EU-based TikTok Shops » (chercheurs uniquement).
- Tiers : ScrapeCreators liste des points d'accès TikTok Shop dans tous ses forfaits [vérifié sur scrapecreators.com] ; Kalodata et FastMoss n'ont pas pu être vérifiés (403).
- Disponibilité géographique de TikTok Shop : USA, Royaume-Uni, Asie du Sud-Est, puis Espagne, Irlande, Allemagne, France, Italie en 2024-2025 ; pas le Maroc [non revérifié].

### 3.2 Meta : Facebook, Instagram, Threads, WhatsApp Channels

**Ad Library API (`ads_archive`).** [vérifié, https://developers.facebook.com/docs/graph-api/reference/ads_archive/ et https://developers.facebook.com/docs/graph-api/reference/archived-ad/]
- `ad_type=ALL` renvoie toutes les publicités **seulement si elles ont été diffusées dans l'UE** ; les publicités qui n'ont touché aucun lieu de l'UE ne sont renvoyées que si elles sont politiques ou sociétales.
- Champs réservés UE : `eu_total_reach`, `beneficiary_payers`. Champs UE + Royaume-Uni : `target_ages`, `target_gender`, `target_locations`, `age_country_gender_reach_breakdown`. Champs réservés aux publicités politiques : `impressions`, `spend`, `demographic_distribution`.
- Champs toujours disponibles : textes créatifs, `ad_delivery_start_time`, `ad_snapshot_url`, `languages`, `page_name`, `publisher_platforms`.
- Recherche : `search_terms` (100 caractères, non traduit, à écrire dans la langue de la publicité), `ad_reached_countries`, `search_page_ids` (10 max).
- Conservation : publicités UE archivées un an après la dernière impression ; politiques sept ans (https://transparency.meta.com/researchtools/ad-library-tools).
- Accès : jeton Graph API ; la confirmation d'identité et de localisation sur facebook.com/ID est exigée selon plusieurs guides [source tierce, non lue sur page Meta].
- Interface web : toutes les publicités actives de tous les pays, Maroc compris, mais défi anti-robot (403 à la sonde) et CGU interdisant la collecte automatisée.
- Verdict : **optionnel, gratuit**, signal publicitaire FR et BE de premier ordre. Le Maroc et les USA ne sont visibles que si l'annonceur cible aussi l'UE (cas fréquent pour la diaspora).

**Meta Content Library et API.** [vérifié, page mise à jour le 30 avril 2026, https://transparency.meta.com/researchtools/meta-content-library]
- Contenu : posts publics Facebook (Pages, groupes, profils vérifiés ou 100 abonnés et plus), Instagram (comptes pro et créateurs, comptes personnels vérifiés ou 100 abonnés et plus), Threads (100 abonnés et plus), **WhatsApp Channels** (vérifiés ou 100 abonnés et plus).
- Éligibilité : affiliation à un organisme sans but lucratif dont la recherche scientifique ou d'intérêt public est l'activité principale ; dossier instruit par le CASD ; environnement sécurisé ; gratuit.
- Verdict : **à écarter** (inaccessible à un indépendant ou à une petite équipe commerciale).

**Instagram Graph API.** [vérifié, https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search]
- Recherche par hashtag : 30 hashtags uniques par fenêtre glissante de 7 jours et par compte, compte Business ou Creator, App Review avec la fonctionnalité « Instagram Public Content Access ».
- À partir du **16 février 2027**, `top_media` inclura les Reels, sera plafonné à 200 résultats, utilisera un nouvel algorithme et pourra renvoyer des posts liés au hashtag sans le contenir.
- Aucun paramètre pays. Verdict : **optionnel** mais coûteux en démarches pour un signal étroit.

**Threads API.** [vérifié, https://developers.facebook.com/docs/threads/keyword-search] Recherche de posts publics par mot-clé ou tag : 2 200 requêtes par 24 h ; sans approbation de `threads_keyword_search`, la recherche ne porte que sur les posts du compte authentifié. Tri `TOP` ou `RECENT`. Pas de filtre pays. Verdict : **optionnel**.

**WhatsApp Channels.** Aucune API publique de lecture ou de tendances [non revérifié] ; la page web d'une chaîne ne contient aucun contenu (sonde). Seul accès structuré : Meta Content Library (chercheurs). Verdict : **à écarter** pour la collecte automatisée ; à traiter par veille humaine, ce qui compte pour le Maroc et l'Afrique de l'Ouest où WhatsApp est central.

### 3.3 YouTube

- [vérifié, https://developers.google.com/youtube/v3/revision_history, entrée du 10 juillet 2025] Depuis le 21 juillet 2025, `videos.list?chart=mostPopular` « présente les vidéos des classements Trending Music, Movies et Gaming » et non plus la liste Tendances générale, supprimée avec la page Tendances.
- [vérifié, https://developers.google.com/youtube/v3/docs/videos/list] `regionCode` (ISO 3166-1 alpha-2) et `videoCategoryId` restent documentés ; `maxResults` 1 à 50 ; 1 unité par appel.
- [vérifié, https://developers.google.com/youtube/v3/determine_quota_cost, changement du 1er juin 2026] 10 000 unités/jour pour l'ensemble des méthodes ; `search.list` et `videos.insert` ont chacun leur compartiment : **100 appels par jour**, 1 unité par appel. Nouvelle méthode `videos.batchGetStats` (3 juin 2026) : 1 unité, compartiment propre de 10 000/jour.
- [vérifié, entrées de mars 2025 et août 2026] Les vues Shorts comptent chaque démarrage de lecture depuis le 31 mars 2025 ; depuis l'été 2026 toutes les vues publiques sont comptées dès le début de lecture. Les séries historiques ne sont pas comparables avant et après ces dates.
- Shorts : aucun filtre officiel. Méthodes pratiques : liste `UUSH` + identifiant de chaîne (testée par RSS, 200), durée de 3 minutes ou moins.
- [vérifié, https://developers.google.com/youtube/terms/developer-policies] Contraintes fortes : données non autorisées conservées 30 jours au plus puis supprimées ou rafraîchies ; interdiction d'agréger des données entre propriétaires de contenu différents ; interdiction de « créer des données ou métriques nouvelles ou dérivées » à partir des données d'API, ou obligation d'indiquer clairement que les métriques maison ne viennent pas de YouTube ; scraping interdit ; un seul projet par client d'API.
- Sans clé : flux RSS par chaîne et par playlist (15 dernières vidéos, vues, date) ; autocomplétion `suggestqueries` par `hl` et `gl` (non documentée).
- Granularité pays : `regionCode` couvre a priori US, FR, MA, BE, CH, CA, SN ; pas de découpage Québec ; à vérifier avec `i18nRegions.list`.
- Verdict : API v3 **optionnelle (clé gratuite)** ; RSS **cœur**.

### 3.4 X (Twitter)

- [vérifié, https://docs.x.com/x-api/getting-started/pricing] Paiement à l'usage : post lu 0,005 $, utilisateur lu 0,010 $, **Trends 0,010 $ par requête**, Counts récents 0,005 $ par requête, création de post 0,015 $ (0,20 $ avec URL). Plafond : 3 millions de posts lus par mois, au-delà offre Enterprise. Déduplication : une même ressource redemandée dans les 24 h n'est facturée qu'une fois.
- [vérifié, https://docs.x.com/changelog] Pilote fermé le 20 octobre 2025 ; lancement officiel le **6 février 2026** ; à cette date Basic et Pro « restent disponibles » ; 16 avril 2026 : likes, follows et quote-posts retirés des offres en libre-service ; 2 octobre 2026 : jusqu'à 70 $ de crédits de bienvenue expirant après 3 mois.
- [source tierce, non confirmé] Offre gratuite fermée aux nouveaux développeurs le 6 février 2026 ; abonnés Basic migrés d'office après le 1er juin 2026.
- Tendances : `GET /2/trends/by/woeid/{woeid}` avec jeton Bearer ; `tweet_count` fourni seulement au-delà de 1 000 posts sur 24 h ; tendances personnalisées via un point d'accès distinct (https://docs.x.com/x-api/trends/trends-by-woeid/introduction).
- Granularité : lieux WOEID. Présents chez l'agrégateur trends24 : France, Belgique, Suisse, Canada, Algérie ; absents : Maroc, Sénégal, Côte d'Ivoire, Tunisie. [hypothèse forte : X ne publie pas de tendances pour ces pays ; à confirmer par le point d'accès Trend Locations.]
- [estimation] 6 lieux (monde, US, FR, BE, CH, CA) x 6 relevés/jour x 30 jours = 1 080 requêtes = 10,80 $/mois. 1 000 posts lus pour qualifier les tendances = 5 $.
- Verdict : **module payant** très rentable pour US/FR/BE/CH/CA ; inutile pour le Maroc.

### 3.5 Reddit

- [vérifié par sonde] Tous les accès sans authentification sont bloqués depuis une IP de datacenter (voir section 2).
- [vérifié, https://redditinc.com/policies/data-api-terms, révisé le 20 juillet 2026] « Si vous souhaitez utiliser les Data APIs à des fins commerciales, pour de la recherche au-delà des limites de débit, ou pour tout usage non expressément permis, vous devez conclure un accord séparé avec Reddit. » Interdiction de tirer un revenu de l'accès, d'entraîner un modèle d'IA sans permission des ayants droit, obligation de supprimer les données à la fin de l'accès.
- [vérifié, https://redditinc.com/policies/developer-terms, révisé le 24 mars 2026] Reddit peut imposer une revue d'application à tout moment.
- [source tierce, non confirmé : la page d'aide officielle est derrière Cloudflare] 100 requêtes par minute par client OAuth en usage gratuit non commercial ; approbation préalable au titre de la Responsible Builder Policy ; un blog affirme que les nouvelles demandes d'accès ont été fermées le 31 octobre 2026.
- Granularité : aucune par pays ; substituts par subreddits (r/france, r/Morocco, r/Quebec, r/belgium, r/Suisse, r/Senegal) et subreddits de niche américains pour la détection précoce.
- Verdict : **optionnel** via OAuth officiel pour un usage personnel ou de recherche non commercial, à tester depuis le conteneur ; **module payant** via agrégateur sinon (risque juridique en hausse, voir section 6).

### 3.6 Pinterest

- [vérifié, spécification OpenAPI officielle v5.32.0, https://raw.githubusercontent.com/pinterest/api-description/main/v5/openapi.yaml] `GET /v5/trends/keywords/{region}/top/{trend_type}` ; OAuth, portée `user_accounts:read` ; `trend_type` = `growing` (forte hausse sur le trimestre), `monthly`, `yearly`, `seasonal` ; filtres `interests` (24 centres d'intérêt : beauty, food_and_drinks, home_decor, womens_fashion, travel, wedding, parenting, finance…), `genders`, `ages`, `include_keywords` ; `limit` 50 max ; option `include_demographics`.
- Régions (`TrendsSupportedRegion`) : US, CA, DE, **FR**, ES, IT, DE+AT+CH, GB+IE, IT+ES+PT+GR+MT, PL+RO+HU+SK+CZ, SE+DK+FI+NO, **NL+BE+LU**, AR, BR, CO, MX, MX+AR+CO+CL, AU+NZ, MY, PH, TH, EG, CR+DO+EC+GT+PE, CY+CZ+GR+HU+MT+PL+RO+SK, TR, KR, AE+KW+QA+OM+BH+EG+IQ+DZ, **IL+NG+PK+ZA+TR+MA**.
- [vérifié par sonde] Le point d'accès JSON de l'outil public (`trends.pinterest.com/top_trends_filtered/`) répond sans clé pour ces mêmes codes ; limitation de débit rapide (429 au quatrième appel rapproché). C'est un point d'accès interne non documenté : préférer l'API officielle dès qu'une application est créée.
- Lecture pays : France excellente ; Belgique noyée dans le Benelux néerlandophone ; Suisse noyée dans la zone germanophone ; Canada sans découpage Québec ; Maroc noyé dans un groupe dominé par la Turquie ; rien pour le Sénégal et la Côte d'Ivoire.
- Verdict : **cœur** (lifestyle, décoration, mode, cuisine, mariage, beauté) pour US → FR.

### 3.7 Snapchat

- [vérifié par sonde] Ads Library API ouverte sans authentification : `POST https://adsapi.snapchat.com/v1/ads_library/ads/search`, nom d'annonceur obligatoire, pays payeurs UE ; renvoie impressions totales, répartition par pays de l'UE, ciblage, dates, créations. Recherche par mot-clé impossible : il faut connaître les annonceurs.
- L'outil public Snapchat Trends n'existe plus (redirection vers forbusiness.snapchat.com). Pas d'API publique de tendances Spotlight [non revérifié].
- Verdict : **optionnel** (vérification d'annonceurs connus en FR/BE), pas un capteur de tendances.

### 3.8 LinkedIn

- [vérifié, https://www.linkedin.com/help/linkedin/answer/a1517918] Ad Library : publicités diffusées depuis le 1er juin 2023, conservées un an après la dernière impression ; pour les publicités ciblant l'UE, fourchette d'impressions et paramètres de ciblage ; recherche par annonceur, mot-clé, pays, dates ; une « Ad Library API » est mentionnée (page 403 à la lecture, conditions non vérifiées).
- Interface web bloquée depuis datacenter (403). Aucune API de tendances de contenu ouverte ; le scraping de LinkedIn est le plus risqué du lot (contentieux historiques, comptes requis).
- Verdict : **à écarter** pour la collecte automatique ; pertinent seulement pour les niches B2B en consultation manuelle.

### 3.9 Bluesky

- [vérifié par sonde] `app.bsky.unspecced.getTrendingTopics` et `getTrends` : 200 sans clé, tendances globales avec `postCount`, `status`, `category`. Aucun effet de l'en-tête de langue. Espace de noms « unspecced » : peut changer sans préavis.
- [vérifié par sonde] `searchPosts` : 403 sur `public.api.bsky.app`, **200 sur `api.bsky.app`** avec `lang=fr` et `sort=top`.
- [vérifié par sonde] Jetstream : WebSocket public sans authentification, environ 41 posts/s, champ `langs` → calcul maison de hashtags et liens montants en français.
- [vérifié, https://docs.bsky.app/docs/rate-limits] Les hôtes `api.bsky.app` et `public.api.bsky.app` « ne prennent pas en charge l'authentification » et ont des « limites généreuses » non chiffrées ; 3 000 requêtes par 5 minutes par IP côté PDS.
- Pas de notion de pays ; filtrage par langue uniquement. Audience francophone limitée, profil technophile et médias.
- Verdict : **cœur** (gratuit, légal, fiable) mais signal d'appoint.

### 3.10 Mastodon et fédivers

- [vérifié, https://docs.joinmastodon.org/methods/trends/] `/api/v1/trends/tags` (20 max), `/trends/statuses` (40 max), `/trends/links` (20 max), publics, sans authentification, depuis la version 3.5.0.
- [vérifié par sonde] 300 requêtes par 5 minutes ; instances francophones piaille.fr et mamot.fr fonctionnelles ; volumes très faibles et rituels hebdomadaires (#caturday, #vendredilecture) à filtrer.
- Verdict : **cœur** techniquement, poids faible dans le score.

### 3.11 Twitch

- [vérifié, https://dev.twitch.tv/docs/api/guide/ + sonde 401] Jeton d'application gratuit (client credentials), en-tête `Client-Id` ; 1 point par requête, seau par minute (800 points dans l'exemple de la documentation) ; `Get Streams` filtrable par `language=fr` et par jeu, 100 par page ; `Get Top Games`.
- Granularité : langue, pas pays.
- Verdict : **optionnel (clé gratuite)** pour les niches jeu vidéo, IRL, « just chatting » francophones.

### 3.12 Discord

- Découverte de serveurs et API : 401 sans authentification (sonde). Aucune API de tendances. La politique développeur interdit la collecte et l'exploration de données hors du fonctionnement de l'application [non revérifié : page officielle 403 à la lecture].
- Verdict : **à écarter**.

### 3.13 Telegram

- [vérifié par sonde] L'aperçu web `https://t.me/s/<canal>` des canaux publics répond 200 sans compte : 20 derniers messages, vues, nombre d'abonnés.
- [vérifié, https://core.telegram.org/api/terms §1.5] Interdiction d'utiliser ou d'agréger des données de la plateforme pour entraîner ou développer des modèles d'IA ; renvoi à des conditions spécifiques « Content Licensing and AI Scraping ».
- Bot API : un bot ne lit que les canaux où il est administrateur. Statistiques tierces (TGStat) non vérifiées (403).
- Verdict : **optionnel** sur une courte liste de canaux publics suivis (veille), sans stockage massif.

## 4. Granularité par pays : matrice

| Source | US | FR | MA | BE | CH | CA / Québec | SN, CI |
|---|---|---|---|---|---|---|---|
| TikTok Creative Center (connexion requise) | oui | oui (liste des 27 pays non vérifiée) | inconnu | inconnu | inconnu | inconnu | inconnu |
| TikTok Commercial Content API | non | oui | non | oui | oui | non | non |
| Meta Ad Library API (toutes publicités) | non (politique seulement) | oui | non (sauf diffusion UE) | oui | non | non | non |
| YouTube `mostPopular` (Musique, Films, Jeux) | oui | oui | oui (à confirmer avec clé) | oui | oui | CA entier | SN probable, CI à vérifier |
| X Trends par WOEID | oui | oui | non | oui | oui | oui (CA, villes) | non |
| Pinterest Trends | oui | oui | groupe IL+NG+PK+ZA+TR+MA | groupe NL+BE+LU | groupe DE+AT+CH | CA entier | non |
| Reddit | subreddits | r/france | r/Morocco | r/belgium | r/Suisse | r/Quebec | r/Senegal, faible |
| Bluesky | global | langue fr | langue fr/ar, très faible | langue | langue | langue | très faible |
| Mastodon | instances | piaille.fr, mamot.fr | néant | instances | instances | instances | néant |
| Twitch | langue en | langue fr | langue fr/ar | langue fr | langue fr | langue fr | langue fr |
| Snapchat Ads Library | non | oui | non | oui | non | non | non |
| Scrapers tiers TikTok / Instagram | oui | oui (mots-clés, proxy pays) | oui (mots-clés darija/français, proxy) | oui | oui | oui | oui, volumes faibles |
| Classements Apple (substitut sons, apps) | oui | oui | oui | oui | oui | oui | CI oui, SN à retester |

Lecture : plus on descend vers le Maroc et l'Afrique subsaharienne, moins il existe de signal officiel par pays. La « transposabilité » devra s'appuyer sur la langue (français, darija, arabe), sur des panels de comptes et de chaînes choisis par pays, et sur des requêtes par mots-clés localisés chez un fournisseur payant.

## 5. Tiers payants : prix réels vérifiés le 2026-11-28

| Fournisseur | Modèle | Prix vérifié | Coût par 1 000 | Couverture utile | Source |
|---|---|---|---|---|---|
| ScrapeCreators | crédits prépayés sans expiration ; 1 crédit = 1 requête en général | Gratuit 100 crédits ; 47 $ = 25 000 ; 497 $ = 500 000 | 1,88 $ puis 0,99 $ par 1 000 requêtes | TikTok, TikTok Shop, Instagram, YouTube, Threads, Reddit, X, Pinterest, Snapchat, Twitch, Bluesky, Telegram, bibliothèques publicitaires Meta, TikTok, Google, LinkedIn | https://scrapecreators.com/ |
| EnsembleData | abonnement mensuel, unités par jour non reportables | Essai 50 unités/jour ; 100 $ = 1 500/jour ; 200 $ = 5 000 ; 400 $ = 11 000 ; 800 $ = 25 000 ; 1 400 $ = 50 000 | environ 2,2 $ par 1 000 unités au premier palier ; recherche hashtag ou mot-clé = 1 unité pour 20 posts | TikTok, Instagram, YouTube, Threads, Reddit, Twitch, X, Snapchat | https://ensembledata.com/pricing |
| Apify (plateforme) | abonnement + usage ; crédits non reportables | Free 0 $ avec 5 $ d'usage ; Starter 19 $ ; Scale 199 $ ; Business 999 $ ; proxy résidentiel 8 $/Go | selon l'acteur | place de marché de scrapers | https://apify.com/pricing |
| Apify Instagram Scraper | paiement à l'événement | 2,70 $ (Free), 2,30 $ (Starter), 1,90 $ (Scale), 1,50 $ (Business) | par 1 000 résultats | hashtags, profils, reels, lieux ; note 4,68/5, 72 569 utilisateurs mensuels | https://apify.com/apify/instagram-scraper |
| Apify TikTok Scraper (clockworks) | paiement à l'événement | « à partir de 1,70 $ / 1 000 résultats » ; 3,70 $ (Free) et 3,00 $ (Starter) selon un comparatif tiers non confirmé | 1,70 à 3,70 $ | hashtags, profils, recherche, `proxyCountryCode` ; pas d'entrée « trending » ; note 4,76/5 | https://apify.com/clockworks/tiktok-scraper |
| Bright Data Web Scraper API | paiement au succès | 1,50 $ / 1 000 enregistrements ; **5 000 enregistrements gratuits par mois sans carte** ; forfait 499 $/mois | 1,50 $ | TikTok, Instagram, Facebook, X, LinkedIn, Reddit, YouTube ; pas Pinterest | https://brightdata.com/pricing/web-scraper |
| Bright Data Datasets | jeux préconstitués | à partir de 2,50 $ / 1 000 ; palier 100 000 enregistrements à 250 $ | 2,50 $ | historique massif | https://brightdata.com/pricing/datasets |
| SerpApi | abonnement mensuel | Free 250 recherches ; 25 $ = 1 000 ; 75 $ = 5 000 ; 150 $ = 15 000 | 25 $ puis 15 $ puis 10 $ | Google Trends, YouTube, moteurs de recherche | https://serpapi.com/pricing |
| DataForSEO | dépôt minimal 50 $ sans expiration | SERP à partir de 0,0006 $ ; Keywords Data (dont Google Trends) à partir de 0,0012 $ par tâche | 0,60 $ et 1,20 $ | recherche, tendances de recherche ; peu de social | https://dataforseo.com/pricing |
| X API officielle | paiement à l'usage | Trends 0,010 $/requête ; post lu 0,005 $ | 10 $ / 1 000 requêtes Trends ; 5 $ / 1 000 posts | tendances par lieu, recherche | https://docs.x.com/x-api/getting-started/pricing |

Fiabilité et risques des tiers :
- Ces services contournent les CGU des plateformes à votre place ; ils cassent quand la plateforme change (cas du Creative Center à l'automne 2026). Prévoir deux fournisseurs interchangeables pour TikTok.
- Les unités EnsembleData se perdent chaque jour ; ScrapeCreators convient mieux à un usage irrégulier.
- SerpApi est poursuivi par Google (19 décembre 2025) et par Reddit (octobre 2025) : risque de continuité.
- Non vérifiés faute d'accès : TikAPI (page vide), Kalodata et FastMoss (403), Data365, SociaVault.

## 6. Risque juridique et CGU

| Sujet | Constat | Source |
|---|---|---|
| USA, scraping de données publiques hors connexion | Meta c. Bright Data : en janvier 2024, un juge fédéral de San Francisco a jugé que Bright Data n'avait pas violé les conditions de Meta en collectant des données publiques. X c. Bright Data : action rejetée en mai 2024. | https://en.wikipedia.org/wiki/Bright_Data |
| USA, hiQ c. LinkedIn | Le 9e circuit a confirmé en avril 2022 que le scraping de données publiques ne viole pas le CFAA. | https://en.wikipedia.org/wiki/Web_scraping |
| USA, offensive 2025-2026 contre les intermédiaires | Reddit a assigné Perplexity et trois sociétés de collecte (dont SerpApi) à New York en octobre 2025 ; en juillet 2026 les demandes de rejet ont été largement écartées (grief DMCA maintenu). Google a assigné SerpApi le 19 décembre 2025 pour contournement de mesures de protection. | https://en.wikipedia.org/wiki/Perplexity_AI ; https://blog.google/technology/safety-security/serpapi-lawsuit/ |
| UE et France, données personnelles | Fiche CNIL du 19 juin 2025 : le moissonnage n'est pas interdit en soi ; intérêt légitime possible avec minimisation, exclusion des sites qui s'y opposent par robots.txt ou CAPTCHA, suppression des données non pertinentes, collecte limitée aux données librement accessibles sans compte. D'autres règles (CGU, droit d'auteur) peuvent l'interdire. | https://www.cnil.fr/fr/focus-interet-legitime-collecte-par-moissonnage |
| UE, accès chercheurs DSA article 40 | Acte délégué publié le 2 juillet 2025 avec portail d'accès ; réservé aux chercheurs agréés. Non mobilisable par un outil commercial. | https://digital-strategy.ec.europa.eu/en/library/delegated-act-data-access-under-digital-services-act-dsa |
| CGU TikTok (EEE, juillet 2026) | Extraction automatisée interdite sauf outil fourni ou approuvé par TikTok. | https://www.tiktok.com/legal/page/eea/terms-of-service/en |
| CGU Reddit (juillet 2026) | Usage commercial soumis à accord séparé ; robots.txt `Disallow: /`. | https://redditinc.com/policies/data-api-terms |
| Règles YouTube API | Conservation 30 jours, pas de métriques dérivées non signalées, pas d'agrégation entre propriétaires de contenu, pas de scraping. | https://developers.google.com/youtube/terms/developer-policies |
| Telegram | Agrégation de données pour l'IA interdite. | https://core.telegram.org/api/terms |
| Maroc | Loi 09-08 sur les données personnelles et autorité CNDP : cadre proche du RGPD, déclaration ou autorisation préalable selon les traitements. | [non revérifié] |

Lecture pratique pour le radar :
1. Le risque le plus probable n'est pas un procès mais une **coupure d'accès** (clé révoquée, IP bloquée, fournisseur tiers arrêté).
2. Stocker des **agrégats** (hashtag, mot-clé, son, catégorie, compteurs, date, pays) et non des profils de personnes réduit presque tout le risque RGPD. Les identifiants de créateurs sont des données personnelles : les garder au minimum, sans enrichissement.
3. Ne jamais collecter derrière une connexion avec un compte personnel automatisé (violation directe des CGU et risque de bannissement).
4. Respecter les signaux d'opposition (robots.txt, CAPTCHA, 403) : c'est le critère CNIL des « attentes raisonnables ».
5. Les points d'accès internes non documentés (Pinterest Trends web, suggestions YouTube) sont publics et sans compte mais non contractuels : débit faible, cache, et bascule vers l'API officielle dès que possible.

## 7. Implications pour l'outil

1. **Architecture en connecteurs à trois niveaux** (`core` sans clé, `optional` clé gratuite, `paid_addon`) avec un contrat commun : chaque connecteur déclare sa granularité géographique (pays, groupe de pays, langue, global), ses types de signal (hashtag, mot-clé, son, vidéo, créateur, publicité), son coût par appel et sa durée de conservation autorisée.
2. **Objet « signal » normalisé** : `{source, type, clé, libellé, zone, langue, métrique, valeur, variation, horodatage, url_preuve, niveau_confiance}`. Les zones doivent accepter des groupes (`NL+BE+LU`) et des langues à défaut de pays.
3. **Mesure de diffusion USA → Europe → Maroc** : comparer les dates de première apparition d'un même terme par zone. Sources capables de le faire aujourd'hui : Pinterest (US, FR, groupes), X Trends (US, FR, BE, CH, CA), YouTube (par `regionCode`), bibliothèques publicitaires (apparition d'annonceurs en FR/BE), plus un fournisseur TikTok payant interrogé par mots-clés localisés.
4. **TikTok** : prévoir (a) un connecteur payant interchangeable (ScrapeCreators ou EnsembleData ou Apify) derrière une même interface, (b) un mode « saisie humaine » où l'utilisateur colle chaque semaine l'export ou la capture du Creative Center connecté, (c) la Commercial Content API pour les publicités FR/BE/CH.
5. **Maroc et Afrique francophone** : construire des **panels** par pays et par niche (chaînes YouTube suivies par RSS, canaux Telegram publics, comptes TikTok et Instagram via fournisseur payant) et des dictionnaires de mots-clés en français, darija latinisé et arabe. Le pays se déduit du panel, pas de l'API.
6. **Compteur de budget intégré** : chaque appel payant est journalisé avec son coût (X : 0,010 $ par requête Trends ; ScrapeCreators : 1 crédit), avec plafond mensuel configurable et cache de 24 h (X déduplique déjà sur 24 h).
7. **Conformité par conception** : durée de vie de 30 jours sur les données brutes YouTube ; mention « métrique calculée par le radar, non fournie par YouTube » ; stockage d'agrégats ; pas de profils ; journal des sources et des CGU acceptées.
8. **Résilience** : test de santé quotidien par connecteur (statut HTTP + forme de la réponse), dégradation gracieuse, alerte quand une source change (le Creative Center a basculé sans préavis ; `getTrends` est « unspecced » ; `top_media` Instagram change le 16 février 2027).
9. **Pondération** : Bluesky et Mastodon ont un poids faible et servent de signal précoce « tech et médias » ; Pinterest et bibliothèques publicitaires pèsent sur le lifestyle et la monétisation ; X sur l'actualité ; YouTube sur la musique, le jeu et les formats longs.
10. **Exécution depuis un conteneur cloud** : Reddit, LinkedIn et l'Ad Library web de Meta bloquent les IP de datacenter ; ne pas bâtir de fonction essentielle dessus sans jeton officiel.
11. **Signal publicitaire comme indicateur de rendement** : une tendance qui attire des annonceurs en FR/BE (Meta, TikTok, Snapchat) est déjà monétisée ; une tendance US sans annonceur en Europe est une fenêtre d'arbitrage.

## 8. Architecture de collecte recommandée

### Niveau 0 € par mois

| Brique | Rôle | Remarque |
|---|---|---|
| Pinterest Trends (web sans clé, puis API v5 gratuite) | mots-clés lifestyle montants US, FR, CA, GB, groupes Benelux et DACH | 1 appel par zone et par jour suffit ; cache |
| YouTube RSS (chaînes et listes `UUSH`) | panels de créateurs par pays et niche, vues des 15 dernières vidéos | aucun quota ; construire les panels à la main |
| YouTube Data API v3 (clé gratuite) | `mostPopular` par `regionCode` et catégorie, statistiques, 100 recherches/jour | 10 000 unités/jour ; règles de conservation 30 jours |
| Bluesky (`getTrends`, `searchPosts` sur api.bsky.app, Jetstream) | signaux précoces globaux et francophones | calcul maison sur `langs=fr` |
| Mastodon (mastodon.social, piaille.fr, mamot.fr) | hashtags et liens tendance | poids faible |
| Meta Ad Library API (jeton gratuit, identité à confirmer) | publicités FR, BE par mot-clé | délai de mise en place de quelques jours |
| TikTok Commercial Content API (candidature gratuite) | publicités TikTok FR, BE, CH | réponse sous 2 jours ouvrés annoncée |
| Snapchat Ads Library (sans clé) | contrôle d'annonceurs connus | nom d'annonceur requis |
| Twitch Helix (clé gratuite) | jeux et diffusions en français | niche jeu vidéo |
| Telegram `t.me/s/` | canaux publics choisis | faible volume |
| Offres gratuites des tiers | Bright Data 5 000 enregistrements/mois, SerpApi 250 recherches/mois, Apify 5 $ d'usage, ScrapeCreators 100 crédits, EnsembleData 50 unités/jour | utile pour des coups de sonde TikTok et Instagram, pas pour une veille continue |
| Saisie humaine hebdomadaire | Creative Center TikTok connecté, WhatsApp Channels | 15 minutes par semaine |

Manque à ce niveau : TikTok et Instagram organiques en continu, X, Reddit.

### Niveau environ 50 € par mois

- Tout le niveau 0 €.
- **X API à l'usage** : tendances monde, US, FR, BE, CH, CA six fois par jour, environ 11 $ ; 1 000 à 2 000 posts lus pour qualifier, 5 à 10 $. [estimation]
- **ScrapeCreators, pack 47 $** (25 000 crédits sans expiration) : environ 300 requêtes par jour pendant 83 jours, soit près de 17 $ par mois amorti ; TikTok par hashtags et mots-clés localisés, Reels Instagram, Threads, Reddit, TikTok Shop. [estimation]
- **Apify Starter 19 $** en option pour les cas où un acteur spécialisé est meilleur (Instagram à 2,30 $ / 1 000).
- Total : 35 à 55 $ par mois selon le rythme.

### Niveau environ 200 € par mois

- Tout le niveau 50 €.
- **EnsembleData Wood, 100 $** : 1 500 unités par jour, soit par exemple 1 000 recherches hashtag ou mot-clé TikTok (20 posts chacune) + 500 unités Instagram, YouTube et Reddit, réparties sur 8 zones et 20 à 30 niches. Sert de collecteur principal quotidien. [estimation]
- **ScrapeCreators** en second fournisseur (redondance TikTok, TikTok Shop, bibliothèques publicitaires) : 47 $ tous les un à deux mois.
- **X API** : 25 à 30 $ (tendances plus 3 000 à 4 000 posts lus).
- **Apify Starter** : 19 $.
- **Réserve** : 15 à 20 $ pour Bright Data à 1,50 $ / 1 000 ou DataForSEO.
- Total : environ 190 à 215 $ par mois.

## 9. Questions ouvertes

1. Avec un compte TikTok for Business gratuit connecté, que montre exactement le Creative Center fin 2026 (nombre de pays, Maroc, Belgique, Suisse, profondeur du classement, sons) ? Non testable sans compte.
2. `chart=mostPopular` avec `videoCategoryId` hors Musique, Films, Jeux renvoie-t-il encore des résultats par pays, et `regionCode=MA`, `SN`, `CI` sont-ils acceptés ? À tester avec une clé gratuite (`i18nRegions.list`).
3. L'API OAuth officielle de Reddit répond-elle depuis une IP de datacenter avec un jeton valide, et les demandes d'accès sont-elles réellement fermées depuis le 31 octobre 2026 ?
4. Liste officielle des lieux de tendances X (point d'accès Trend Locations) : confirmer l'absence du Maroc, du Sénégal, de la Côte d'Ivoire et de la Tunisie.
5. L'offre gratuite de X existe-t-elle encore pour les nouveaux comptes, et les forfaits Basic et Pro sont-ils toujours vendus ?
6. Quels fournisseurs tiers servent encore des tendances TikTok par pays (hashtags, sons) depuis la refonte du Creative Center ? Tester ScrapeCreators et EnsembleData avec leurs crédits gratuits.
7. L'API Pinterest v5 Trends est-elle accessible en accès « Trial » avec une application gratuite, et avec quelles limites de débit ?
8. Conditions d'accès et pays couverts par la LinkedIn Ad Library API ; conditions exactes de la Meta Ad Library API (confirmation d'identité, limites de débit).
9. Qualification juridique de l'outil : usage interne de veille ou revente de données ? La revente change le niveau de risque (CGU Reddit et YouTube, RGPD, loi marocaine 09-08).
10. Tarifs et couverture pays de Kalodata, FastMoss et TikAPI (pages inaccessibles lors de l'étude).
11. Quel est le volume réel de contenu francophone marocain exploitable via Bluesky, Mastodon et Reddit ? Probablement négligeable ; à mesurer sur une semaine de Jetstream.

## 10. Sources principales

- X : https://docs.x.com/x-api/getting-started/pricing ; https://docs.x.com/changelog ; https://docs.x.com/x-api/trends/trends-by-woeid/introduction
- YouTube : https://developers.google.com/youtube/v3/revision_history ; https://developers.google.com/youtube/v3/determine_quota_cost ; https://developers.google.com/youtube/v3/docs/videos/list ; https://developers.google.com/youtube/terms/developer-policies
- TikTok : https://developers.tiktok.com/products/research-api/ ; https://developers.tiktok.com/doc/research-api-faq ; https://developers.tiktok.com/products/commercial-content-api/ ; https://developers.tiktok.com/doc/commercial-content-api-supported-countries ; https://developers.tiktok.com/doc/commercial-content-api-getting-started ; https://developers.tiktok.com/doc/display-api-overview ; https://www.tiktok.com/legal/page/eea/terms-of-service/en ; https://dev.to/meng_xipeng_139608bde0640/tiktok-creative-center-trends-changed-how-to-get-this-weeks-trending-tiktoks-with-transcripts-3ell
- Meta : https://developers.facebook.com/docs/graph-api/reference/ads_archive/ ; https://developers.facebook.com/docs/graph-api/reference/archived-ad/ ; https://transparency.meta.com/researchtools/ad-library-tools ; https://transparency.meta.com/researchtools/meta-content-library ; https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search ; https://developers.facebook.com/docs/threads/keyword-search
- Reddit : https://redditinc.com/policies/data-api-terms ; https://redditinc.com/policies/developer-terms ; https://www.reddit.com/robots.txt
- Pinterest : https://raw.githubusercontent.com/pinterest/api-description/main/v5/openapi.yaml ; https://trends.pinterest.com/
- Bluesky : https://docs.bsky.app/docs/rate-limits ; Mastodon : https://docs.joinmastodon.org/methods/trends/ ; Twitch : https://dev.twitch.tv/docs/api/guide/ ; Telegram : https://core.telegram.org/api/terms ; LinkedIn : https://www.linkedin.com/help/linkedin/answer/a1517918
- Tiers : https://apify.com/pricing ; https://apify.com/apify/instagram-scraper ; https://apify.com/clockworks/tiktok-scraper ; https://scrapecreators.com/ ; https://ensembledata.com/pricing ; https://brightdata.com/pricing/web-scraper ; https://brightdata.com/pricing/datasets ; https://serpapi.com/pricing ; https://dataforseo.com/pricing
- Droit : https://www.cnil.fr/fr/focus-interet-legitime-collecte-par-moissonnage ; https://en.wikipedia.org/wiki/Bright_Data ; https://en.wikipedia.org/wiki/Perplexity_AI ; https://blog.google/technology/safety-security/serpapi-lawsuit/ ; https://en.wikipedia.org/wiki/Web_scraping ; https://digital-strategy.ec.europa.eu/en/library/delegated-act-data-access-under-digital-services-act-dsa
- Fichiers bruts des sondes : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/probes/`

## Contre-vérification

Contre-vérificateur indépendant, 2026-11-28, sondes entre 13:15 et 13:30 UTC depuis le même type de conteneur (IP de datacenter, sans compte ni clé). Le budget WebSearch partagé était déjà épuisé : aucune recherche web, uniquement des relectures directes de pages officielles (curl ou WebFetch) et des appels réels. Fichiers bruts : `/tmp/claude-0/-home-user-claudecode/00e88930-c277-528f-99f2-9b7f935da647/scratchpad/research/cv_social/`.

Verdicts : **confirmé** (source primaire ou sonde) ; **corrigé** (valeur exacte et source) ; **réfuté** ; **invérifiable** (pas de source primaire).

### A. Affirmations porteuses

| # | Affirmation du dossier | Verdict | Constat de la contre-vérification |
|---|---|---|---|
| 1 | TikTok Creative Center sans connexion : aucune donnée, ancienne API `no permission` | **confirmé** | Ancienne URL redirigée vers `/creative/creativeCenter/trends` ; `/trends/hashtag` 200 avec « No data available » et « Log in or sign up » ; `creative_radar_api/.../list?country_code=FR` → `{"code":40101,"msg":"no permission"}`. Le relevé tiers « 3 hashtags, 27 pays » reste **invérifiable**. |
| 2 | TikTok Commercial Content API : **33 pays** | **corrigé : 32 pays** | La page « Supported Countries » (mise à jour le 1er septembre 2026) liste 32 codes : 27 UE + NO, IS, LI + GB, CH. 27 + 3 + 2 = 32, pas 33. La page produit dit toujours « ONLY including data from EU countries ». Research API : éligibilité (académiques USA, EEE, UK, CA, CH ; « creator, advertiser, or commercial user » → « No ») et quotas (1 000 requêtes, 100 000 enregistrements par jour, remise à zéro à 0 h UTC) **confirmés** ; sondes `research/video/query` et `research/adlib/ad/query` → 401 `access_token_invalid`. |
| 3 | Meta Ad Library API : hors UE, seules les publicités politiques ou sociétales | **confirmé** | Référence `ads_archive` : « Ads that did not reach any location in the EU will only return if they are about social issues, elections or politics » ; la condition porte sur `ad_reached_countries`, pas sur `ad_type`. `search_terms` 100 caractères au plus. Sonde sans jeton → 500 `OAuthException` (v21.0 et v24.0). La confirmation d'identité reste **invérifiable** : la page `facebook.com/ads/library/api` renvoie 403. |
| 4 | YouTube : `mostPopular` limité à Musique, Films, Jeux depuis le 21 juillet 2025 ; quotas granulaires depuis le 1er juin 2026 | **confirmé** | Historique des révisions (entrées du 10 juillet 2025, du 1er juin et du 3 juin 2026) et page des quotas : « default quota allocation of 100 search.list calls, 100 videos.insert calls, and 10,000 units per day combined for all other endpoints » ; `videos.batchGetStats` à 1 unité dans son propre compartiment de 10 000 par jour. La confiance peut passer de moyenne à haute. |
| 5 | Règles YouTube : métriques dérivées interdites **ou** autorisées avec mention claire | **corrigé** | Developer Policies (mise à jour du 2026-11-06) : « must not (i) replace API Data with similar, independently calculated data, or (ii) access or use API Data to create new or derived data or metrics ». La mention « not from YouTube » ne concerne que les données **non issues** de l'API affichées à côté. Seule exception : section L, développeurs audités ayant obtenu l'autorisation via la demande d'extension de quota (depuis le 1er juin 2026). L'agrégation entre propriétaires de contenu différents est interdite, et la conservation des données non autorisées est limitée à 30 jours (**confirmé**). Ruptures des séries de vues : 31 mars 2025 (Shorts), 27 août 2026 (vue comptée au démarrage, tous formats) et une rupture **absente du dossier**, le 16 novembre 2026 (co-visionnage TV inclus dans les vues publiques). |
| 6 | Flux RSS YouTube sans clé : 15 dernières vidéos avec vues, liste `UUSH` des Shorts | **confirmé** | `channel_id=UCBR8-60-B28hp2BmDPdntcQ` → 200, 15 entrées, `media:statistics views`, publications du 2026-11-27 ; `playlist_id=UUSH…` → 200, 15 Shorts. Le flux de chaîne mélange formats longs et Shorts (12 sur 15 ici), d'où l'intérêt de la liste `UUSH`. France 24 (`UCCCPCZNChQdGa9EkATeye4g`) → 200, 15 entrées. Le statut CGU d'une collecte RSS automatisée à grande échelle n'est pas écrit noir sur blanc : **hypothèse** (zone grise, voir B). |
| 7 | Prix X : Trends 0,010 $ par requête, post lu 0,005 $, plafond de 3 M posts, déduplication 24 h, lancement le 6 février 2026 | **confirmé** | Page de prix : « Trends $0.010 per request », « Posts: Read $0.005 per resource », « capped at 3 million Post reads per monthly billing cycle », déduplication « within a 24-hour UTC day window ». Changelog du 6 février 2026 : « Basic and Pro plans remain available ». Nouveautés **absentes du dossier** : `meta.location` dans les réponses Trends (17 novembre 2026), **`GET /2/trends/locations`** qui liste tous les lieux (18 novembre 2026), `tweet_count` présent seulement à partir de 1 000 posts sur 24 h (19 novembre 2026), crédits offerts de 20 $ plus jusqu'à 50 $ (soit 70 $) qui expirent au bout de 3 mois. |
| 8 | Pas de tendances X pour le Maroc, le Sénégal, la Côte d'Ivoire ni la Tunisie | **invérifiable** (fortement corroboré) | Aucune liste publique dans la documentation officielle : `/2/trends/locations` exige un jeton et la page d'exemple ne montre que Monde, Canada et Winnipeg. Deux agrégateurs indépendants concordent : trends24.in renvoie 404 pour morocco, senegal, ivory-coast, tunisia et 200 pour france, belgium, switzerland, canada, algeria ; getdaytrends.com renvoie 404 pour morocco et senegal, 200 pour algeria. |
| 9 | Reddit fermé sans authentification depuis un datacenter ; conditions du 20 juillet 2026 | **confirmé** (le statut a évolué) | Toutes les URL testées renvoient désormais 403 « Blocked » (1 522 octets) : `.json`, `old.reddit`, `api.reddit.com`, `oauth.reddit.com`, et aussi les flux `.rss` (404 lors de l'étude) et même `robots.txt`. Le contenu `Disallow: /` n'est donc plus relisible d'ici (copie de l'étude dans `probes/`). Data API Terms : « Last Revised July 20, 2026 » et la clause « commercial purposes … separate agreement with Reddit » sont confirmées mot pour mot. |
| 10 | Pinterest Trends : point d'accès JSON sans clé, régions de l'API v5, groupe contenant MA | **confirmé** (avec précisions) | Sondes : FR, US et `IL+NG+PK+ZA+TR+MA` → 200, 50 termes ; BE et MA seuls → 400 `{}`. API v5 → 401. OpenAPI v5.32.0 : enum `TrendsSupportedRegion` identique à celle du dossier, portée `user_accounts:read`, 24 centres d'intérêt. Précisions : `numTerms=20` est ignoré (50 termes renvoyés) ; `normalizedCount` et `searchCount` sont des **indices relatifs** (plafond de 100), pas des volumes ; la valeur `100.01` des variations (wow, mom, yoy) ressemble à un plafond pour « nouveau ». Pas de 429 avec 4 s entre les appels (5 appels). |
| 11 | Prix des tiers (ScrapeCreators, EnsembleData, Apify, Bright Data, SerpApi, DataForSEO) | **confirmé** (avec précisions) | ScrapeCreators : 47 $ = 25 000 crédits (1,88 $ / 1 000), 497 $ = 500 000 (0,99 $), 100 crédits offerts et jusqu'à 1 200 en bonus, « Purchased credits have no expiration date ». EnsembleData : 0 $ = 50, 100 $ = 1 500, 200 $ = 5 000, 400 $ = 11 000, 800 $ = 25 000, 1 400 $ = 50 000 unités par jour, remise à zéro à 0 h UTC ; la recherche hashtag ou mot-clé TikTok coûte 1 unité pour 20 posts, mais **la recherche hashtag Instagram est facturée par post**. Apify : Free 5 $, Starter 19 $, Scale 199 $, Business 999 $, proxy résidentiel 8 $/Go ; crédits non reportés ; Instagram 2,70 $ (Free) et 2,30 $ (Starter), « from $1.50 » ; TikTok « from $1.70 ». Bright Data : 5 000 enregistrements par mois gratuits, 1,5 $ / 1 000, forfait Scale à 499 $ avec 384 000 enregistrements inclus puis 1,3 $ / 1 000. SerpApi : 250 recherches gratuites, 25 $ = 1 000, 75 $ = 5 000, 150 $ = 15 000. DataForSEO : dépôt minimal de 50 $, solde sans expiration, SERP dès 0,0006 $, Keywords Data dès 0,0012 $. |
| 12 | Matrice §4 et implication §7.5 : les scrapers tiers donnent TikTok et Instagram « par pays » (oui pour FR, MA…) | **corrigé** | Spécification OpenAPI officielle de ScrapeCreators : le paramètre `region` de `/v1/tiktok/search/keyword`, `/search/hashtag` et `/get-trending-feed` fixe seulement **l'emplacement du proxy** (« this doesn't filter the tiktoks only in a specific region, it puts the proxy there »). Ce n'est pas un filtre pays : le pays doit être déduit (langue, mots-clés, région de l'auteur, panels). Les routes `/v1/tiktok/videos/popular`, `/songs/popular` et `/hashtags/popular` existent (401 sans clé, contre 404 pour une route inconnue) mais ne figurent pas dans `openapi.json`. Leur fonctionnement depuis la refonte du Creative Center est **invérifiable** sans clé. |

### B. Relance des sources classées core ou optional (statut, format, granularité)

| Source (classement) | Appel refait | Résultat | Granularité observée | Verdict |
|---|---|---|---|---|
| Pinterest web (core) | `top_trends_filtered` FR, US, groupe MA, BE, MA | 200 JSON ×3 ; 400 ×2 | pays ou groupe de pays | confirmé |
| Pinterest API v5 (optional) | `/v5/trends/keywords/FR/top/growing` | 401 `Authentication failed.` | — | confirmé |
| YouTube RSS (core) | chaîne et `UUSH` | 200 `text/xml`, 15 entrées, vues | chaîne, donc pays déduit du panel | confirmé |
| YouTube Data API (optional) | `videos?chart=mostPopular&regionCode=FR` | 403 `PERMISSION_DENIED` sans clé | `regionCode` (non testé avec clé) | confirmé ; MA, SN, CI invérifiables |
| YouTube suggest (optional) | `suggestqueries … ds=yt&hl=fr&gl=FR/MA/US&q=tendance` | 200 JSON ; résultats différents selon `gl` (MA : « tendance maroc », « tendance musique maroc ») | pays via `gl` | confirmé (non documenté) |
| Bluesky getTrends / getTrendingTopics (core) | `public.api.bsky.app` | 200 ; sujets US (« Macy's parade postponed », `postCount` 3061, `status`, `category`) | global | confirmé |
| Bluesky searchPosts (core) | `public.api` puis `api.bsky.app` | 403 HTML puis 200 JSON, `langs:["fr"]`, `likeCount` | langue | confirmé |
| Bluesky Jetstream (core) | `jetstream2.us-west` (autre instance) | 101, 262 messages en 6,1 s (environ 43 par s) | langue (`langs`) | confirmé |
| Mastodon (core) | `trends/tags`, `statuses`, `links` (limit=40) | 200 ; plafonds de 20, 40 et 20 confirmés | instance | **corrigé** : `x-ratelimit-limit` vaut 300 sur mastodon.social et piaille.fr mais **600 sur mamot.fr** (dépend de l'instance) |
| Snapchat Ads Library (optional) | POST avec `paid_country_codes` fr, ma, us | 200 ×3, **mêmes 10 publicités UE** ; sans annonceur → 400 | UE (+ TR dans `impressions_map`) | **corrigé** : le filtre pays semble ignoré ; aucune donnée MA ou US |
| Meta Ad Library API (optional) | `ads_archive` v21.0 et v24.0 sans jeton | 500 `OAuthException` | UE (et politique ailleurs) | confirmé |
| TikTok Commercial Content API (optional) | `POST /v2/research/adlib/ad/query/` | 401 `access_token_invalid` | 32 pays | voir A2 |
| Reddit OAuth (optional) | `oauth.reddit.com/r/france/hot` | 403 « Blocked » | — | confirmé ; aucun test avec jeton possible |
| Twitch Helix (optional) | `helix/streams?language=fr` | 401 `OAuth token is missing` | langue | confirmé |
| Telegram `t.me/s` (optional) | `t.me/s/durov` | 200 HTML, 20 messages, vues 2.36M, 9.85M abonnés | canal | confirmé |
| Instagram Graph (optional) | page tag web ; documentation hashtag search | 200 coquille ; documentation : 30 hashtags par 7 jours, compte Business ou Creator, App Review « Instagram Public Content Access », changement de `top_media` le 16 février 2027 (200 résultats, Reels, rafraîchi environ toutes les heures) | aucun paramètre pays | confirmé |
| Threads keyword search (optional) | `graph.threads.net/v1.0/keyword_search` | 400 `Invalid OAuth 2.0 Access Token` ; documentation : 2 200 requêtes sur 24 h glissantes, posts du seul compte sans approbation, `TOP` / `RECENT`, aucun filtre pays | aucune | confirmé |
| Apple RSS (substitut) | `most-played/10/songs.json` pour 8 pays | 200 pour ma, ca, sn ; **délai dépassé (code 000) pour us, fr, be, ch, ci** à 13:27 UTC | pays | instable : prévoir reprises et cache |

Autres points relus : CGU TikTok EEE (« Last updated: July 2026 », extraction automatisée interdite) **confirmé** ; Meta Content Library (mise à jour le 30 avril 2026, CASD, organismes sans but lucratif, seuil de 100 abonnés, WhatsApp Channels) **confirmé** ; Google c. SerpApi (billet du 19 décembre 2025) **confirmé** ; Reddit c. Perplexity et SerpApi, demandes de rejet largement écartées en juillet 2026 : **confirmé sur source secondaire** (Wikipedia, qui cite le document 104 du dossier Justia du 31 juillet 2026) ; fiche CNIL du 19 juin 2025 **confirmé**, à nuancer : elle s'inscrit dans les recommandations sur le développement de systèmes d'IA et ne s'applique donc à un radar de veille que par analogie.

### C. Ce que la conception de l'outil doit corriger ou ne pas supposer

1. **YouTube Data API** : pas de score de tendance, de croissance ni de classement calculé à partir des données de l'API, ni d'agrégation entre chaînes de propriétaires différents. Une mention « calculé par le radar » ne suffit pas. Deux options : demander l'autorisation de la section L (développeur audité), ou réserver l'API à l'affichage et calculer à partir d'autres sources, en documentant le risque CGU du RSS.
2. **Ruptures des séries de vues YouTube** : 2025-03-31, 2026-08-27 et 2026-11-16. Les marquer dans les séries ; aucune comparaison de vues à travers ces dates.
3. **Pays chez les scrapers payants** : `region` désigne un proxy, pas un filtre. Le pays est une inférence (langue, dictionnaires darija et français, région de l'auteur, panels) avec un niveau de confiance, jamais une donnée de la source.
4. **Snapchat Ads Library** : UE uniquement, nom d'annonceur requis, filtre `paid_country_codes` inopérant ; filtrer côté client sur `impressions_map`.
5. **TikTok Commercial Content API** : 32 pays, à relire à l'activation (la page produit se contredit).
6. **Lieux X** : appeler `GET /2/trends/locations` au démarrage pour bâtir la liste des WOEID, sans la coder en dur. Une absence de `tweet_count` signifie moins de 1 000 posts sur 24 h, pas zéro.
7. **Reddit** : hors du socle gratuit ; tout est bloqué (403) depuis un datacenter, `robots.txt` compris.
8. **Pinterest web** : interface interne ; `normalizedCount` est un indice relatif et `100.01` un plafond ; `numTerms` est ignoré ; BE et MA seuls renvoient 400. Migrer vers l'API v5 dès que possible.
9. **TikTok** : ne pas engager de budget sur les routes « popular » des fournisseurs avant un test avec leurs crédits gratuits.
10. **Débits** : lire les en-têtes `x-ratelimit-*` de chaque instance Mastodon (300 ou 600) ; prévoir reprises et cache pour Apple RSS et Pinterest.
