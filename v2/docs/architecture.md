# ISNAD 2.0 — architecture

*Ce qui est propre à la 2.0. Pour le reste — structure du moteur, contrat d'une saga, exigences de respect — lire
`AGENTS.md` et `docs/` en mettant `v2/` devant chaque chemin. Ce document se tient à jour à chaque lot.*

## Deux arbres qui ne se touchent pas

| | ISNAD 1.31 | ISNAD 2.0 |
|---|---|---|
| Sources | `src/` | `v2/src/` |
| Outils | `tools/` (sauf `promo.js`) | `v2/tools/` |
| Jeu assemblé | `index.html`, `dist/isnad.html` | `v2/index.html`, `v2/dist/isnad.html` |
| Parties des joueurs | `isnad.auto.v1`, `isnad.slot.N`, `isnad.opts.v1` | `isnad2.auto`, `isnad2.slot.N`, `isnad2.opts` |
| État | gelée au commit `46fc869` | en construction |

`node v2/tools/gel.js` compare les 37 fichiers de la 1.31 à leurs empreintes (`v2/gel-1.31.json`) et doit afficher
« 1.31 INTACTE » avant chaque enregistrement. Aucun outil de `v2/` n'écrit hors de `v2/`.

## L'arbre de la 2.0

| Chemin | Rôle |
|---|---|
| `v2/src/core/defs.js` | les énumérations, comme en 1.31 |
| `v2/src/core/regles.js` | **les règles du contenu**, en un module (voir plus bas) |
| `v2/src/core/*.js` | le moteur |
| `v2/src/data/` | le jeu de base : le contenu de la 1.31, mot pour mot |
| `v2/tools/` | assemblage, contrôle, parcours de test — les outils de la 1.31, tournés vers `v2/` |
| `v2/tools/gel.js`, `v2/gel-1.31.json` | la garantie que la 1.31 ne bouge pas |
| `v2/docs/` | feuille de route, architecture, contrats propres à la 2.0 |

## Les règles du contenu : `src/core/regles.js`

En 1.31, les règles vivent dans deux scripts (`tools/validate.js`, `tools/validate-music.js`) qui lisent le disque et
arrêtent le programme. En 2.0, les mêmes règles, mot pour mot, sont des fonctions pures dans un module que chargent
Node (`require`) et un navigateur (`window.ISNAD_REGLES`) :

```js
const R = require('./src/core/regles.js').creer(D, {
  savoirConnu: ref => …,     // « saga/id » : ce savoir existe-t-il dans une autre saga ?
  ennemisCommuns: () => …    // les égrégores communs à toutes les sagas (coeur.js)
});
R.verifierEquipement()        // → [erreurs]
R.verifierSaga(saga)          // → { erreurs, avis }
R.verifierPistes(pistes)      // → [erreurs]
R.verifierEnsemble(sagas)     // → [erreurs] : renvois entre sagas (« after »), ordre sur la Chaîne
R.stats(sagas)                // → la ligne de résumé
```

Trois lecteurs pour un seul texte de règles : la commande de contrôle (`v2/tools/validate.js`), le jeu lui-même quand
il reçoit un paquet, et la page d'administration (chantier 2). Une règle ajoutée l'est donc partout à la fois.

Le contenu du jeu de base est de la donnée pure : chaque saga et chaque piste ressortent identiques d'un aller-retour
JSON (620 Ko en tout). C'est ce qui permettra de le ranger dans une base.

## Commandes

```sh
node v2/tools/gel.js                 # la 1.31 est-elle intacte ?
node v2/tools/validate.js            # tout le contenu : sagas, histoire-cadre, veillées, contenu commun, puis l'ensemble
node v2/tools/validate.js fichiers   # seulement ces fichiers
node v2/tools/validate-music.js
node v2/tools/build.js               # v2/index.html et v2/dist/isnad.html
node v2/tools/smoke.js auto          # et walk, tap, wrong, shots — comme en 1.31
node v2/tools/doigt.js [loin [844x390]]
node v2/tools/son.js
node v2/tools/bataille.js [mesures]
```
