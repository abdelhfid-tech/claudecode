---
name: radar-brief
description: Brief stratégique d'une opportunité du radar (une tendance, un pays acheteur, un pays vendeur) : preuves datées, statut et fenêtre, portes, trois initiatives au plus, hypothèse de demande, test de demande à 20 h et 150 € au plus, plan de canal, conformité, prédiction à journaliser. À utiliser quand l'utilisateur demande un brief ou veut instruire un candidat.
argument-hint: "<tendance ou app> <pays acheteur> [pays vendeur]"
---

# Brief stratégique

Arguments : $ARGUMENTS

Écris le brief dans `workspace/initiatives/<identifiant>/brief.md`, en français, avec ces sections :

1. **Thèse** en une phrase.
2. **Preuves** : chaque chiffre avec sa source, sa date et son niveau de preuve (F, F2, E, H). Données du radar d'abord (`gaps --json`, autocomplétion, Wikimedia), presse ensuite.
3. **Statut et fenêtre par pays** : intérêt, disponibilité, classe de friction et sa justification, fenêtre restante. Ce qui pourrait arriver avant vous.
4. **Portes** côté acheteur et côté vendeur : rail de paiement, plateformes, réglementation (fichiers `config/rules/`).
5. **Initiatives** : `sh "${CLAUDE_PLUGIN_ROOT}/scripts/radar.sh" initiatives --buyer <A> --seller <V> --strength <F> --window <j>`. Trois au plus, avec le taux horaire implicite P10 et P50 ; précise que ce sont des hypothèses.
6. **Hypothèse de demande**, écrite pour pouvoir être fausse : qui paie, combien, pourquoi maintenant.
7. **Test de demande** : 20 h et 150 € au plus, 2 à 3 semaines, seuil chiffré écrit d'avance (par exemple 30 inscrits, 10 conversations qualifiées, 3 précommandes).
8. **Plan de canal** : où trouver les 100 premiers prospects, comment obtenir 20 conversations, ou quel test payant de 50 à 100 €.
9. **Conformité** : mention des contenus générés par IA (AI Act, article 50), loi influenceurs en France, RGPD, CNDP au Maroc, règles WhatsApp Business, statut fiscal du vendeur et seuils (`config/rules/fiscal.toml`).
10. **Critère d'arrêt**.
11. **Prédiction à journaliser** : événement binaire proche, probabilité, horizon, règle de résolution vérifiable par le radar.

Avant de rendre le brief, confie-le à l'agent `skeptic-verifier` et intègre ses corrections. Ne propose rien qui vise des mineurs, des jeux d'argent ou des marchés de prédiction, de la nicotine, des allégations de santé non étayées.
