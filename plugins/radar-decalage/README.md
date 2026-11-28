# radar-decalage

Radar d'arbitrage de tendances : il détecte les tendances numériques qui émergent aux USA ou ailleurs, mesure leur diffusion vers l'Europe, la France, le Maroc et la francophonie, et propose des initiatives réalisables avec Claude Code. Le plan complet est dans [docs/PLAN.md](../../docs/PLAN.md).

## État : étape 1, la collecte

Le paquet Python `radar` (bibliothèque standard uniquement, Python 3.11 ou plus) relève chaque jour :

| Source | Mesure | Pays |
|---|---|---|
| `apple_charts` | Classements App Store (flux v2) | 27 vitrines |
| `google_play` | Classements Google Play : **désactivé**, le robots.txt de play.google.com interdit le point d'accès | — |
| `apple_lookup` | Disponibilité de chaque app suivie, vitrine par vitrine | 27 vitrines |
| `gtrends_daily` | Tendances du jour de Google Trends | US, FR, MA |
| `autocomplete` | Autocomplétion Google et YouTube, par pays et par langue (Amazon exclu : robots.txt) | US, FR, BE, Québec, MA, SN, CI |
| `wikimedia_country` | Pages vues par pays (top par projet, QID suivis, couverture du jour) | 18 pays |
| `autocomplete_villes` | Suggestions Google « tendance + ville » et « métier + ville », chaque lundi | Paris, Lyon, Casablanca, Rabat, Marrakech, Fès, Tanger |
| `autocomplete_produits` | Produits cherchés à l'achat (« prix … », « ثمن … » au Maroc, « price … » à Dubaï), puis comparés entre Casablanca et Fès, chaque lundi | Maroc, Émirats |

Origines suivies : USA et pays sentinelles, Golfe (App Store, tendances du jour et suggestions aux Émirats, App Store et tendances en Arabie saoudite) et Chine (App Store seulement : Google et Wikipedia y sont bloqués).

Les données vont dans un espace de travail, jamais dans la branche de code :

```
workspace/
├── watchlist.json             apps vues dans un classement (écrit par le collecteur seul)
├── config/                    vos surcharges : zones.toml, sources.toml, terms.toml (termes validés)
└── data/
    ├── raw/<source>/<année>/<jour>/<horodatage>.jsonl.gz   un fichier par exécution, en ajout seul
    ├── runs/<mois>.jsonl                      journal d'exécution (santé des sources)
    └── state.json
```

## Commandes

Depuis `plugins/radar-decalage/` :

```
python -m radar collect                      toutes les sources actives
python -m radar collect --cadence hourly     tendances du jour seulement
python -m radar collect --only apple_charts,apple_lookup --zones US,FR,MA
python -m radar collect --dry-run            interroger sans rien écrire
python -m radar health --days 14             taux de succès par source (pilote de 14 jours)
python -m radar sources                      registre des sources
python -m radar watchlist                    état de la liste de suivi
python -m radar collect --cadence weekly     relevé ville par ville (lundi)
python -m radar gaps [--established] [--independants]   écarts de disponibilité des apps (petits éditeurs)
python -m radar villes [--decalage casablanca:fes]      tendances et métiers locaux, ville par ville
python -m radar produits [--fes]             produits cherchés au Maroc et à Dubaï, installés à Casablanca, pas encore à Fès
python -m radar incitations --pays MA --pour colis_ecommerce   aides et freins : douane, fiscalité, aides, règles
python -m radar initiatives --buyer FR --seller MA [--scenario petit_ia] [--strength F --window J]
python -m radar initiatives --scenarios      scénarios : solo, petit_ia, petit_ia_fort, agence
python -m radar ledger [--anchor]            journal de prédictions : chaîne, ancres, scores
python -m radar rules                        validité et fraîcheur des règles par pays
python -m radar reactive [--json]            candidats du jour pour le contenu réactif
python -m radar reactive --post              … et envoi au flux n8n (RADAR_N8N_WEBHOOK, RADAR_N8N_TOKEN)
python -m pytest -q                          tests (aucun appel réseau)
```

Le classement des initiatives donne, pour chaque modèle : la chance de décoller en 12 mois, la marge par mois si ça marche, la moyenne sur 24 mois (échecs compris) et les heures. Il signale quand la réussite dépasserait le plafond du statut simple (micro-entreprise, auto-entrepreneur marocain). Le scénario `petit_ia` suppose que l'IA fait 40 % des heures : une hypothèse à mesurer sur les premiers clients.

`RADAR_WORKSPACE` choisit l'espace de travail (par défaut `./workspace`). `RADAR_CONTACT` ajoute un contact à l'identifiant envoyé aux sites, comme le demande la politique de Wikimedia ; il est vide par défaut.

## Sur votre serveur

Le dépôt est public : la collecte ne tourne pas sur GitHub, mais sur votre serveur, par cron. Installation, flux n8n du contenu réactif (Claude, validation sur Telegram, Blotato facultatif) et usage quotidien : [deploy/README.md](../../deploy/README.md).

## Règles de collecte

- robots.txt lu et respecté pour chaque site (RFC 9309) ; site injoignable = abstention.
- Débit limité par site (`config/sources.toml`), reprises bornées sur 429 et 5xx avec respect de `Retry-After` (secondes ou date) ; une attente demandée trop longue fait abandonner, pas revenir trop tôt.
- Un 403, ou un 429 persistant, coupe le site pour le reste de l'exécution : aucun refus n'est contourné.
- Un seul écrivain (verrou), un fichier par exécution écrit de façon atomique, état avec copie de secours.
- Seuls des agrégats sont stockés : aucun profil de personne.
- Chaque source porte un champ `publishable` ; la plupart ne le sont pas.
- Google Play utilise un gabarit de requête repris de la bibliothèque google-play-scraper 10.1.4 (licence MIT).
