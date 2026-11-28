---
name: radar-setup
description: Mise en place du radar de tendances dans un projet : vérifie Python, crée l'espace de travail et le profil du fondateur, teste les sources, explique la planification.
disable-model-invocation: true
---

# Mise en place

1. Vérifie `python3 --version` (3.11 ou plus, bibliothèque standard seulement).
2. Crée `workspace/` dans le répertoire du projet et vérifie qu'il est exclu de git (`.gitignore`).
3. Crée `workspace/profile.toml` à partir de `${CLAUDE_PLUGIN_ROOT}/config/profile.example.toml` en posant les questions une à une : pays d'où l'utilisateur peut vendre et structure par pays, langues (dont la darija), canaux et audiences existants, heures par semaine, capital maximal par initiative, coût horaire de référence, projets en cours. Ne devine aucune réponse.
4. Lance `sh "${CLAUDE_PLUGIN_ROOT}/scripts/radar.sh" sources`, puis `rules`, puis un essai : `collect --only apple_charts --zones US,FR,MA --dry-run`.
5. Explique les deux façons de planifier la collecte, sans rien activer :
   - le workflow GitHub Actions `.github/workflows/radar-collect.yml` (gratuit, sans IA, écrit sur la branche de données `radar-data`) : il faut le fusionner dans la branche par défaut et décommenter le bloc `schedule` ;
   - une tâche planifiée Claude qui lance `collect`.
   Rappelle qu'un dépôt public publierait des données dont certaines sources interdisent la redistribution.
6. Si l'utilisateur veut un contact dans l'identifiant envoyé aux sites (demandé par Wikimedia), c'est la variable `RADAR_CONTACT` ; ne la remplis jamais toi-même avec ses données personnelles.
