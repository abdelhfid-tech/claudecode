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
« 1.31 INTACTE » avant chaque enregistrement. Aucun outil de `v2/` n'écrit hors de `v2/` ; `cartes.js` lit la 1.31
pour s'y comparer, et ne fait que la lire.

## L'arbre de la 2.0

| Chemin | Rôle |
|---|---|
| `v2/src/core/defs.js` | les énumérations, comme en 1.31 ; en plus : les gabarits de carte (`D.GABARITS`), le contrat d'un paquet (`D.paquet`, `D.MOTEUR`), les livres (`D.LIVRES`) |
| `v2/src/core/regles.js` | **les règles du contenu**, en un module (voir plus bas) |
| `v2/src/core/*.js` | le moteur |
| `v2/src/data/` | le jeu de base : le contenu de la 1.31, mot pour mot |
| `v2/paquets/*.json` | les paquets publiés, embarqués à l'assemblage — aucun aujourd'hui |
| `v2/tools/` | assemblage, contrôle, parcours de test — les outils de la 1.31, tournés vers `v2/` |
| `v2/tools/cartes.js` | les lieux du livre I sortent-ils comme dans la 1.31 ? |
| `v2/tools/ecrans.js` | l'écran de la Chaîne du livre I est-il celui de la 1.31 ? |
| `v2/tools/paquet.js`, `v2/tools/essais/` | éprouver un paquet ; le paquet d'essai (pure fiction, jamais livré) |
| `v2/tools/partie.js` | la partie du joueur : format, export, import |
| `v2/tools/gel.js`, `v2/gel-1.31.json` | la garantie que la 1.31 ne bouge pas |
| `v2/docs/` | feuille de route, architecture, contrat d'un paquet |

## Le jeu de base et les paquets

Le **jeu de base** est ce que la 2.0 a reçu de la 1.31 : le moteur, le livre I (prologue, cinq sagas, dernier maillon),
les veillées, le contenu commun, vingt et une pistes, onze lieux, l'équipement. Tout ce qui s'y ajoute arrive par un
**paquet** : un document de données (JSON) que le jeu contrôle, puis pose. Le contrat est dans
[`schema-paquet.md`](schema-paquet.md).

```
paquet (JSON) ──► ISNAD.registerPack(p)                       base.js
                    │ 1. forme et identifiants                D.paquet.refus      (defs.js)
                    │ 2. règles du contenu, sur une copie     verifierPaquet      (regles.js)
                    │    des tables étendue par le paquet
                    ├─ refusé : noté (page Diagnostic), rien n'est posé, le jeu continue
                    └─ accepté : D.paquet.poser → D.MAPS, D.ITEMS, D.GEAR, D.GEAR_SHOPS, D.TRACKS, D.LIVRES
                                 registerMusic pour chaque piste, registerSaga pour chaque saga
```

- **Un paquet ajoute, il ne remplace rien.** Les contrôles se font sur une copie des tables (`D.paquet.tables()`) :
  un paquet refusé ne laisse aucune trace.
- **Le moteur ne lit ses tables qu'au moment de s'en servir.** C'est ce qui permet de les étendre après coup : rien
  n'est recopié au démarrage.
- **Les mêmes fonctions des deux côtés.** `D.paquet.refus` et `D.paquet.poser` servent au jeu comme au contrôle hors
  du jeu : ce que la commande accepte, le jeu l'accepte, et inversement.

### Les lieux : un gabarit, pas une liste

En 1.31, `maps.js` choisit le générateur d'après le nom de la carte, et quatre tests reconnaissent Koufa à son nom. En
2.0, chaque lieu de `D.MAPS` nomme son **gabarit** (`D.GABARITS` : ville, désert, camp, cité romaine, palais, navire,
noosphère, citadelle, Cité-Miroir, archives) ; le gabarit fixe les lieux nommés, le thème de l'interface, la piste, et
dit si l'on y bâtit. Koufa est une `ville` dans sa variante `fleuve`.

- Les onze lieux du jeu de base sortent **identiques** à ceux de la 1.31, point par point : `node v2/tools/cartes.js`
  bâtit des deux côtés les 65 cartes que le contenu demande et compare le dessin, les cases pleines, les lieux nommés,
  les objets, les lumières, l'ambiance et la piste.
- Un lieu déclaré par un paquet a son propre identifiant, donc sa propre graine : même plan, autre répartition des
  palmiers et des rochers. Si un lieu nommé s'y trouvait coupé des autres, le moteur rebat les cartes (`M.relie`).

### Les livres

`I.livres()` range les maillons par livre (`saga.livre`, 1 par défaut ; titres dans `D.LIVRES`). L'écran de la Chaîne
montre le livre I — ses maillons, puis le dernier maillon —, puis les autres livres sous leur titre ; les chiffres
romains et les comptes (« cinq Lumières ») sont calculés. Le dernier maillon ne dépend que des maillons du livre I :
une saga ajoutée ne peut pas bloquer la fin du jeu de base. Avec un seul livre, l'écran est celui de la 1.31, élément
pour élément : `node v2/tools/ecrans.js` le compare en huit moments, du prologue à la Chaîne transmise.

## La partie du joueur

Une partie de la 2.0 est au **format 2** : les champs de la 1.31, plus `profil` (le nom et la tenue du personnage,
lot 1.5) et `paquets` (les paquets posés quand elle a été écrite, avec leur version). Elle vit sous les clés
`isnad2.auto` (la partie en cours, gardée toute seule), `isnad2.slot.1` à `3` (les copies gardées à la mosquée) et
`isnad2.opts` (les options de l'appareil). La 2.0 ne lit ni n'écrit jamais les clés de la 1.31.

| Fonction (`ISNAD.save`, dans `base.js`) | Ce qu'elle fait |
|---|---|
| `migrer` (interne) | remet une partie lue au format courant sans toucher à l'original ; le format 1 — celui de la 1.31 — est accepté ; un format plus récent est refusé |
| `exporter()` | la partie en un texte : `{ isnad: 'partie', format, jeu, quand, partie }`, sans les options de l'appareil |
| `lireTexte(texte)` | contrôle un texte reçu **sans rien changer** : forme, format, champs ; rend la partie et un résumé, ou une erreur dite en clair |
| `adopter(partie)` | la partie devient la partie en cours ; ce qui renvoie à un contenu absent est mis de côté (`avis`) |

**Exporter, importer.** « Exporter la partie » (pied de la Chaîne, halte) montre le texte, l'enregistre en fichier
`isnad-partie.json` ou le copie — là où le téléchargement est bloqué, le texte reste à copier. « Importer une partie »
(coin de l'écran-titre) lit un texte collé ou un fichier choisi, montre ce qu'il contient, et ne remplace la partie en
cours qu'après confirmation ; les copies gardées à la mosquée ne sont pas touchées.

**Une partie venue d'ailleurs n'est pas crue sur parole.** Elle est bornée en taille, son format est lu d'abord, puis
chaque champ que le moteur parcourt doit avoir la forme attendue (Lumières connues, niveaux de 1 à 99, besace et
réserve en nombres, point de reprise complet). Sinon elle est refusée, et rien n'a changé.

**Un contenu absent ne casse rien et ne perd rien.** Une partie peut citer un paquet que ce jeu n'a pas. À l'adoption :
un point de reprise situé dans une saga ou un lieu absents est levé (on reprend à la Chaîne) ; une pièce d'équipement
inconnue quitte le héros pour la réserve, où elle attend sans gêner ; objets, savoirs et maillons achevés restent
dans la partie, invisibles. Le joueur est prévenu une fois. Quand le paquet revient, tout est là.

`node v2/tools/partie.js` le prouve par les vrais boutons : jouer, exporter (texte et fichier), effacer, réimporter à
l'identique, reprendre au milieu d'un chapitre ; dix textes qui ne sont pas des parties, refusés sans rien changer ;
une partie prise dans la 1.31 gelée, acceptée et remise à jour ; les clés de la 1.31 intactes.

## Les règles du contenu : `src/core/regles.js`

En 1.31, les règles vivent dans deux scripts (`tools/validate.js`, `tools/validate-music.js`) qui lisent le disque et
arrêtent le programme. En 2.0, les mêmes règles, mot pour mot, sont des fonctions pures dans un module que chargent
Node (`require`) et un navigateur (`window.ISNAD_REGLES`). Ce que la 2.0 ajoute y est marqué « 2.0 ».

```js
const RG = require('./src/core/regles.js');
const R = RG.creer(D, {
  savoirConnu: ref => …,       // « saga/id » : ce savoir existe-t-il dans une autre saga ?
  ennemisCommuns: () => …      // les égrégores communs à toutes les sagas (coeur.js)
});
R.verifierEquipement()          // → [erreurs]
R.verifierSaga(saga)            // → { erreurs, avis }
R.verifierPistes(pistes, opt)   // → [erreurs]
R.verifierObjets(objets, pieces)// → [erreurs]   (2.0)
R.verifierLieux(lieux)          // → [erreurs]   (2.0)
R.verifierEnsemble(sagas)       // → [erreurs] : renvois entre sagas (« after »), ordre sur la Chaîne
R.stats(sagas)                  // → la ligne de résumé

RG.verifierPaquet(D, paquet, { sagas })   // → { erreurs, avis, resume } : un paquet entier, face au contenu déjà posé (2.0)
```

Trois lecteurs pour un seul texte de règles : les commandes (`validate.js`, `paquet.js`), **le jeu lui-même** quand il
reçoit un paquet, et la page d'administration (chantier 2). Une règle ajoutée l'est donc partout à la fois, et un
contenu qui ne passe pas les exigences de respect n'entre pas dans le jeu, d'où qu'il vienne.

Règles ajoutées par la 2.0 :

- un égrégore ne fixe ni Constance ni dégâts (`hp`, `atk`…) : le moteur les calcule — la 1.31 l'ignorait sans le dire ;
- `after` désigne une saga qui existe ; `order` est unique dans son livre ; le livre d'une saga est déclaré ; un paquet
  range ses sagas hors du livre I ;
- un objet de la besace n'a que des effets connus, dans leurs bornes, et des mots sobres ;
- le contenu commun, l'histoire-cadre et les veillées appartiennent au jeu de base : un paquet apporte des maillons.

Le contenu du jeu de base est de la donnée pure : chaque saga et chaque piste ressortent identiques d'un aller-retour
JSON (620 Ko en tout). C'est ce qui permettra de le ranger dans une base.

## Commandes

```sh
node v2/tools/gel.js                 # la 1.31 est-elle intacte ?
node v2/tools/validate.js            # tout le contenu : sagas, histoire-cadre, veillées, contenu commun, puis l'ensemble
node v2/tools/validate.js fichiers   # seulement ces fichiers
node v2/tools/validate-music.js
node v2/tools/build.js               # v2/index.html et v2/dist/isnad.html (avec les paquets de v2/paquets/)
node v2/tools/cartes.js              # « CARTES IDENTIQUES à celles de la 1.31 »
node v2/tools/ecrans.js              # « CHAÎNE IDENTIQUE à celle de la 1.31 »
node v2/tools/paquet.js [fichier]    # éprouve un paquet, hors du jeu puis dans un jeu d'essai assemblé à part
node v2/tools/partie.js              # la partie du joueur : exportée, effacée, réimportée à l'identique
node v2/tools/smoke.js auto          # et walk, tap, wrong, shots — comme en 1.31
node v2/tools/doigt.js [loin [844x390]]
node v2/tools/son.js
node v2/tools/bataille.js [mesures]
```

**Règle de la 2.0.** Celle d'`AGENTS.md`, avec quatre contrôles de plus à chaque changement du moteur ou des règles :
`cartes.js` doit afficher « CARTES IDENTIQUES », `ecrans.js` « CHAÎNE IDENTIQUE », et `paquet.js` comme `partie.js`
doivent finir sans « REFUS », « BLOQUÉ », « ABSENT », « INACCESSIBLE » ni « ÉCART ». Et `gel.js` doit afficher « 1.31 INTACTE » avant chaque enregistrement.
