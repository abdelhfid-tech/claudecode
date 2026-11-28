---
name: radar-log
description: Note dans le journal des initiatives les heures passées, les euros dépensés et encaissés, le résultat d'un test de demande et la décision. À utiliser quand l'utilisateur rend compte de l'avancement d'une initiative.
argument-hint: "<identifiant> <heures> <euros dépensés> <euros encaissés> <résultat>"
---

# Journal des initiatives

Ajoute une ligne JSON à `workspace/initiatives/journal.jsonl` (ajout seul, ne réécris jamais une ligne existante) :

```json
{"date": "AAAA-MM-JJ", "initiative": "...", "etape": "test|construction|exploitation", "heures": 0, "depenses_eur": 0, "encaissements_eur": 0, "resultat": "...", "seuil_atteint": true, "decision": "continuer|arreter|construire|attendre"}
```

Puis rappelle en trois lignes : heures cumulées face au plafond du profil, écart au seuil du test, et le critère d'arrêt du brief. Si le critère d'arrêt est atteint, dis-le clairement.
