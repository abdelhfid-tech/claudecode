# radar-decalage

Radar d'arbitrage de tendances : il détecte les tendances numériques qui émergent aux USA ou ailleurs, mesure leur diffusion vers l'Europe, la France, le Maroc et la francophonie, et propose des initiatives réalisables avec Claude Code. Le plan complet est dans [docs/PLAN.md](../../docs/PLAN.md).

## État : étape 1, la collecte

Le paquet Python `radar` (bibliothèque standard uniquement, Python 3.11 ou plus) relève chaque jour :

| Source | Mesure | Pays |
|---|---|---|
| `apple_charts` | Classements App Store (flux v2, repli sur le flux historique) | 27 vitrines |
| `google_play` | Classements Google Play | 13 pays |
| `apple_lookup` | Disponibilité de chaque app suivie, vitrine par vitrine | 27 vitrines |
| `gtrends_daily` | Tendances du jour de Google Trends | US, FR, MA |
| `autocomplete` | Autocomplétion Google, YouTube et Amazon, par pays et par langue | US, FR, BE, Québec, MA, SN, CI |
| `wikimedia_country` | Pages vues par pays (top par projet, QID suivis, couverture du jour) | 18 pays |

Les données vont dans un espace de travail, jamais dans la branche de code :

```
workspace/
├── watchlist.json             apps vues dans un classement (écrit par le collecteur seul)
├── config/                    vos surcharges : zones.toml, sources.toml, terms.toml (termes validés)
└── data/
    ├── raw/<source>/<année>/<jour>.jsonl.gz   instantanés en ajout seul
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
python -m pytest -q                          tests (aucun appel réseau)
```

`RADAR_WORKSPACE` choisit l'espace de travail (par défaut `./workspace`). `RADAR_CONTACT` ajoute un contact à l'identifiant envoyé aux sites, comme le demande la politique de Wikimedia ; il est vide par défaut.

## Règles de collecte

- Débit limité par site (`config/sources.toml`), reprises bornées sur 429 et 5xx avec respect de `Retry-After`.
- Un 403 ou un captcha n'est jamais contourné : la source est marquée en échec et le contrôle de santé le signale.
- Seuls des agrégats sont stockés : aucun profil de personne.
- Chaque source porte un champ `publishable` ; la plupart ne le sont pas.
- Google Play utilise un gabarit de requête repris de la bibliothèque google-play-scraper 10.1.4 (licence MIT).
