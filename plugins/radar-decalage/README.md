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
python -m radar gaps [--established]         écarts de disponibilité des apps
python -m radar initiatives --buyer FR --seller MA [--strength F --window J]
python -m radar ledger [--anchor]            journal de prédictions : chaîne, ancres, scores
python -m radar rules                        validité et fraîcheur des règles par pays
python -m pytest -q                          tests (aucun appel réseau)
```

`RADAR_WORKSPACE` choisit l'espace de travail (par défaut `./workspace`). `RADAR_CONTACT` ajoute un contact à l'identifiant envoyé aux sites, comme le demande la politique de Wikimedia ; il est vide par défaut.

## Règles de collecte

- robots.txt lu et respecté pour chaque site (RFC 9309) ; site injoignable = abstention.
- Débit limité par site (`config/sources.toml`), reprises bornées sur 429 et 5xx avec respect de `Retry-After` (secondes ou date) ; une attente demandée trop longue fait abandonner, pas revenir trop tôt.
- Un 403, ou un 429 persistant, coupe le site pour le reste de l'exécution : aucun refus n'est contourné.
- Un seul écrivain (verrou), un fichier par exécution écrit de façon atomique, état avec copie de secours.
- Seuls des agrégats sont stockés : aucun profil de personne.
- Chaque source porte un champ `publishable` ; la plupart ne le sont pas.
- Google Play utilise un gabarit de requête repris de la bibliothèque google-play-scraper 10.1.4 (licence MIT).
