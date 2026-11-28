---
name: radar-review
description: Revue hebdomadaire du radar de tendances (votre heure de la semaine). Lit la santé des sources, les écarts de disponibilité et la présence locale, propose un classement des candidats à valider, et rend UNE décision (lancer un test, continuer, arrêter, ne rien faire). À utiliser quand l'utilisateur demande la revue, la décision ou l'état du radar.
---

# Revue hebdomadaire du radar

Le code fait la collecte et les calculs ; tu interprètes, tu proposes, l'utilisateur décide.
Lance chaque commande depuis le répertoire du projet (l'espace de travail est `./workspace`, ou `RADAR_WORKSPACE`) :

```
sh "${CLAUDE_PLUGIN_ROOT}/scripts/radar.sh" <commande>
```

## Étapes

1. **Santé** : `health --days 14`. Signale toute source sous 90 % de jours bons. Une source en panne ne se contourne pas.
2. **Écarts** : `gaps --limit 20`, puis `gaps --established --limit 20` pour les absences structurelles.
3. **Présence locale** : lis les derniers relevés d'autocomplétion (`workspace/data/raw/autocomplete/`). Pour chaque terme, note les marqueurs locaux au Maroc et en France (ville, « prix maroc », « dh », enseigne). Une demande locale pour un service absent (« tiktok shop maroc ») est un signal d'opportunité.
4. **Journal** : `ledger` pour la précision et les prédictions échues.
5. **Classement des candidats** (10 au plus). Pour chacun, propose sans jamais valider à la place de l'utilisateur :
   - enseigne ou service national, ou concept transposable ;
   - niche (codes N01 à N25 de la taxonomie) ;
   - classe de friction A à F, avec une phrase de justification et ce qui la ferait changer ;
   - statut par pays cible : absent, non mesurable, intérêt, disponible, adopté, bloqué, muté, en avance. « Absent » exige deux capteurs négatifs, sinon « non mesurable ».
   Écris ces propositions dans `workspace/proposals/<AAAA-MM-JJ>.toml`, avec `status = "propose"` et la source de chaque affirmation.
6. **Un seul candidat au plus** pour un test de demande. Calcule ses initiatives :
   `initiatives --buyer <pays> --seller <pays> --strength <F> --window <jours>`.
   Retiens au plus trois initiatives compatibles avec le profil.
7. **Décision de la semaine**, en 15 lignes au plus : lancer un test, continuer, arrêter, ou ne rien faire. « Aucune opportunité cette semaine » est une réponse valide.

## Règles

- Aucun chiffre sans source ni date. Les chiffres annoncés par une plateforme sont déclaratifs.
- Ne compare jamais deux types de métrique différents (audience publicitaire, sondage, recensement).
- Données insuffisantes : réponds « données insuffisantes », ne devine pas.
- Profil par défaut : rappelle de remplir `workspace/profile.toml` avant toute décision.
- Les règles par pays (paiement, plateformes, réglementation) viennent de `config/rules/`, jamais de ta mémoire.
