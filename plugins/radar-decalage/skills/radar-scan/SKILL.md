---
name: radar-scan
description: Relevé à la demande du radar de tendances (App Store, Google Play, autocomplétion, Wikimedia, Google Trends) puis lecture des nouveaux écarts entre les USA, l'Europe, la France et le Maroc. À utiliser quand l'utilisateur veut des données fraîches ou les signaux du jour.
---

# Relevé à la demande

Depuis le répertoire du projet :

```
sh "${CLAUDE_PLUGIN_ROOT}/scripts/radar.sh" collect                 # toutes les sources (environ 15 minutes)
sh "${CLAUDE_PLUGIN_ROOT}/scripts/radar.sh" collect --only apple_charts,apple_lookup --zones US,FR,MA
sh "${CLAUDE_PLUGIN_ROOT}/scripts/radar.sh" gaps
```

Puis résume en 10 lignes au plus :
- les apps fortes à l'origine et indisponibles en France ou au Maroc (récentes d'abord) ;
- les flux inverses (disponible au Maroc, pas en France) ;
- les termes dont l'autocomplétion montre une demande locale sans offre locale.

Ne relance pas une source qui échoue : signale-la, le contrôle de santé la suit. Les données ne quittent pas `workspace/`.
