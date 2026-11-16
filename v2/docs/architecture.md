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
| `v2/src/core/perso.js` | le personnage du joueur : son nom dans les textes, sa tenue |
| `v2/src/core/*.js` | le moteur |
| `v2/src/data/` | le jeu de base : le contenu de la 1.31, mot pour mot |
| `v2/paquets/*.json` | les paquets publiés, embarqués à l'assemblage — aucun aujourd'hui |
| `v2/tools/` | assemblage, contrôle, parcours de test — les outils de la 1.31, tournés vers `v2/` |
| `v2/tools/cartes.js` | les lieux du livre I sortent-ils comme dans la 1.31 ? |
| `v2/tools/ecrans.js` | l'écran de la Chaîne du livre I est-il celui de la 1.31 ? |
| `v2/tools/paquet.js`, `v2/tools/essais/` | éprouver un paquet ; le paquet d'essai (pure fiction, jamais livré) |
| `v2/tools/partie.js` | la partie du joueur : format, export, import |
| `v2/tools/personnage.js` | le personnage du joueur : nom, tenue |
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
`isnad-partie.json` ou le copie. Dans un Artifact, une page ne peut pas remettre de fichier : le bouton du fichier n'y
est pas proposé, il reste la copie du texte. « Importer une partie »
(coin de l'écran-titre) lit un texte collé ou un fichier choisi, montre ce qu'il contient, et ne remplace la partie en
cours qu'après confirmation ; les copies gardées à la mosquée ne sont pas touchées.

**Une partie venue d'ailleurs n'est pas crue sur parole.** Elle est bornée en taille, son format est lu d'abord, puis
chaque champ que le moteur parcourt doit avoir la forme attendue (Lumières connues, niveaux de 1 à 99, besace et
réserve en nombres, point de reprise complet). Sinon elle est refusée, et rien n'a changé.

**Un contenu absent ne casse rien et ne perd rien.** Une partie peut citer un paquet que ce jeu n'a pas. À l'adoption :
un point de reprise situé dans une saga ou un lieu absents est levé (on reprend à la Chaîne) ; une pièce d'équipement
inconnue quitte le héros pour la réserve, où elle attend sans gêner ; objets, savoirs et maillons achevés restent
dans la partie, invisibles. Le joueur est prévenu une fois. Quand le paquet revient, tout est là. Une copie gardée
sur l'appareil qui serait abîmée se relit de la même façon : ce qui n'a pas la forme attendue est écarté.

`node v2/tools/partie.js` le prouve par les vrais boutons : jouer, exporter (texte et fichier), effacer, réimporter à
l'identique, reprendre au milieu d'un chapitre ; dix textes qui ne sont pas des parties, refusés sans rien changer ;
une partie prise dans la 1.31 gelée, acceptée et remise à jour ; les clés de la 1.31 intactes.

## Le personnage du joueur : `src/core/perso.js`

Le joueur donne un nom et une tenue au **râwî** — le héros de l'histoire-cadre, personnage de fiction. Les Compagnons
gardent leur nom et leur silhouette. Le choix est dans la partie : `profil: { nom, tenue }`.

**Les textes ne changent pas.** Ils disent « Idris », en 2.0 comme en 1.31. Quand une saga est posée, `perso.js` relève
chaque phrase qui nomme le râwî (29 dans le jeu de base) ; quand le profil change, ces phrases-là sont redites à partir
de l'original, avec le nom choisi et la bonne élision :

| Texte d'origine | Khalil | Elyas |
|---|---|---|
| « la Patience d’Idris » | « la Patience de Khalil » | « la Patience d’Elyas » |
| « celui qu’Idris attendait » | « celui que Khalil attendait » | « celui qu’Elyas attendait » |

Tout ce qui lit le contenu — dialogues, cartons, objectifs, Recueil, combat — voit donc le nom choisi sans qu'aucun
écran ait été retouché. Avec le nom d'origine, rien n'est touché : phrases, sceau et silhouette sont ceux de la 1.31,
à l'identique. Un paquet qui écrit « Idris » dans ses textes obtient le même traitement.

| `ISNAD.perso` | Ce qu'elle fait |
|---|---|
| `profil()`, `nom()`, `tenue()` | le profil de la partie, ramené au personnage d'origine s'il est absent ou abîmé |
| `refus(nom)` | la raison pour laquelle un nom ne se prend pas, ou rien |
| `dire(texte, nom)` | une phrase d'origine, redite avec un nom |
| `relever(saga)` | relève les phrases qui nomment le râwî (appelée par `registerSaga`) |
| `appliquer()` | pose le nom dans les phrases relevées, le sceau et la tenue (appelée quand la partie change) |
| `choisir(nom, tenue)` | contrôle, écrit le profil, applique |

**Les noms refusés** : vide, plus de seize signes, autre chose que des lettres (avec espace, apostrophe, trait d'union) ;
le Nom divin employé seul ; Iblîs, démon, djinn ; le nom du Prophète ﷺ ; les noms des héros et des maillons du jeu, pour
ne pas brouiller les dialogues. Un nom n'étant fait que de lettres, il ne peut rien glisser dans la page.

**Les tenues** (`D.TENUES`, dans `defs.js`) : six silhouettes faites des coiffes, des manteaux et des couleurs que
`sprites.js` dessine déjà. La première est la tenue de toujours. Personne n'a de visage. Avec un autre nom, le sceau du
râwî ne porte plus son nom en arabe : il montre l'étoile à huit branches, seule.

**L'écran « Ton personnage »** s'ouvre à chaque nouvelle partie, avant le prologue, avec « Idris » et sa tenue de
toujours déjà choisis — un toucher suffit à commencer. Il se rouvre depuis la halte et depuis le pied de la Chaîne.

`node v2/tools/personnage.js` le prouve : les noms acceptés et refusés ; chaque phrase redite avec six noms ; le profil
d'origine qui ne change rien ; puis, par les vrais boutons et en quatre tailles d'écran, un prologue entier joué sous
un autre nom — tout ce qui s'affiche est relevé, « Idris » n'y paraît plus — ; enfin le choix gardé, rechargé, exporté.

## Les personnages : `src/core/sprites.js`

Un personnage est dessiné par le code, en deux tailles, à partir de la même description (`look` : coiffe, manteau,
couleurs, objets ; l'équipement s'y ajoute par `gear.js`). Aucune image n'entre dans le jeu.

| | Le petit sprite | Le grand sprite |
|---|---|---|
| Taille | 16 × 24 | 32 × 48 |
| Où il se voit | sur les cartes | en combat, en dialogue, à la page d'équipement, à l'écran « Ton personnage » |
| Gabarits | `HEADS`, `BODIES`, `POSES` | `TETES`, `CORPS`, `ALLURES` |
| État | celui de la 1.31, au pixel près | redessiné d'après les modèles du décideur |

**Le grand sprite a ses propres gabarits**, aux proportions des modèles : une tête de dix-sept lignes environ, un corps
de vingt-neuf (le petit sprite, lui, a une tête presque aussi haute que son corps). Avant, il n'était que le petit
sprite agrandi deux fois.

- `grid()` compose toujours le personnage en 16 × 24 et reste seul à dire **qui porte quoi** : la coiffe, le manteau,
  le motif, l'armure, les objets tenus, la pose. Le petit sprite en sort tel quel.
- `natifGrille()` redessine cette composition en 32 × 48 : le corps (`CORPS[vue]` : repos, pas A, pas B ; ou
  `ALLURES[pose][vue]`), les règles de tenue écrites à cette échelle (manteau absent, sur une épaule, ample ; rayures,
  bandes ; mailles, lamelles, cuir, toile piquée ; écharpe, châle, étoffe drapée, néon), les objets tenus — ceux de
  `grid()`, agrandis et ramenés à la hauteur de la main —, puis la tête (`TETES[coiffe][vue]`), inclinée ou abaissée
  selon la pose.
- `grand()` peint : cinq tons par matière, une seule lumière en haut à gauche, l'ombre d'une matière sur celle qu'elle
  recouvre, le galon au bas de la robe. Le voile est peint à part, en dégradé depuis son centre.
- Les mêmes lettres nomment les mêmes matières dans les deux tailles (`T t u` la coiffe, `V` le voile, `C c k` le
  manteau, `R r` le buste…). Le grand sprite en ajoute quatre : `H` et `D` (coiffe en pleine lumière, dans l'ombre),
  `J` et `j` (fer). Un vide d'un pixel entre deux formes devient un trait sombre : c'est le liseré qui le peint.
- De dos, le grand sprite garde le dessin d'avant : le jeu ne le montre jamais.
- `gfx.natif = false` rend partout le grand sprite d'avant, à l'identique : pour comparer.

**Trois gardes, au chargement.** Le moteur refuse de démarrer si un gabarit natif n'a pas ses lignes de 32 lettres, si
une coiffe ou une pose n'a pas son grand dessin, ou si le voile d'une tête n'est pas **une seule surface** — d'un seul
tenant sur chaque ligne et chaque colonne. Aucun gabarit ne peut donc porter un trait de visage : ni œil, ni bouche,
ni barre qui couperait le voile.

**Ajouter une coiffe**, c'est donc la dessiner deux fois : dans `HEADS` (11 lignes de 16, trois vues) et dans `TETES`
(20 lignes de 32, face et profil ; les deux dernières recouvrent le col). Une tête se compose d'un haut de huit lignes,
d'un bandeau de deux et d'un tour de visage de dix, que les turbans partagent (`turban()`), comme les casques partagent
leur camail. **Ajouter une pose** : ses lignes dans `POSES` et dans `ALLURES`, à partir du corps au repos (`varie()`).

`node v2/tools/silhouettes.js` le vérifie sur tout ce que le jeu peut dessiner — les héros, les gens, les rangs, les
tenues du râwî, les quatorze coiffes sous chaque manteau, les variantes d'équipement :

1. les petits sprites sont ceux relevés avant ce travail (`tools/essais/silhouettes.json`) : sinon « ÉCART » ;
2. l'interrupteur rend le grand sprite d'avant, à l'identique : sinon « ÉCART » ;
3. dans chaque grand sprite — toutes les vues, les pas, les poses — le voile est une seule surface, sans trou ni
   marque : sinon « TRAIT » ;
4. chaque coiffe a sa tête native de face et de profil, rien ne sort de la grille, aucun sprite n'est vide : sinon
   « ABSENT ».

`node v2/tools/silhouettes.js planches [modèles.png]` écrit des planches agrandies dans `.smoke/silhouettes/` : la
comparaison avec les modèles, les héros, les coiffes, la marche et les poses, l'équipement. Tout changement de dessin
se relit là, puis sur une capture du jeu.

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
- aucun texte ne porte de balise (« < », « > ») — vrai des 13 628 textes du jeu de base, exigé de tout paquet ;
- le contenu commun, l'histoire-cadre et les veillées appartiennent au jeu de base : un paquet apporte des maillons.

Le contenu du jeu de base est de la donnée pure : chaque saga et chaque piste ressortent identiques d'un aller-retour
JSON (620 Ko en tout). C'est ce qui permettra de le ranger dans une base.

## Publier

`node v2/tools/build.js` écrit `v2/dist/isnad.html` : le jeu en un fragment, pour un Artifact privé. La 2.0 a **son**
Artifact, sous le titre « ISNAD 2.0 » : https://claude.ai/artifact/6TYXTHubyPkSTa22DMpsMN (privé ; version 2 depuis le
16 novembre, avec les personnages redessinés). Celui de la 1.31 reste à sa version 31 et
n'est plus republié. Chaque Artifact
a son propre stockage : une partie ne passe de l'un à l'autre que par l'export et l'import. On ne publie que
l'assemblage que toute la batterie a joué.

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
node v2/tools/personnage.js          # le nom et la tenue du râwî : choisis, joués, gardés
node v2/tools/silhouettes.js         # « SILHOUETTES CONFORMES » : petits sprites inchangés, aucun trait dans un voile
node v2/tools/silhouettes.js planches [modèles.png]   # planches agrandies dans .smoke/silhouettes/
node v2/tools/smoke.js auto          # et walk, tap, wrong, shots — comme en 1.31
node v2/tools/doigt.js [loin [844x390]]
node v2/tools/son.js
node v2/tools/bataille.js [mesures]
```

**Règle de la 2.0.** Celle d'`AGENTS.md`, avec six contrôles de plus à chaque changement du moteur ou des règles :
`cartes.js` doit afficher « CARTES IDENTIQUES », `ecrans.js` « CHAÎNE IDENTIQUE », `silhouettes.js` « SILHOUETTES
CONFORMES », et `paquet.js`, `partie.js` et `personnage.js` doivent finir sans « REFUS », « BLOQUÉ », « ABSENT »,
« INACCESSIBLE », « INVISIBLE », « TRAIT » ni « ÉCART ». Et `gel.js` doit afficher « 1.31 INTACTE » avant chaque enregistrement.
