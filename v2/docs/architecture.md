# ISNAD 2.0 — architecture

*Ce qui est propre à la 2.0. Pour le reste — structure du moteur, contrat d'une saga, exigences de respect — lire
`AGENTS.md` et `docs/` en mettant `v2/` devant chaque chemin. Ce document se tient à jour à chaque lot.*

## La 1.32 archivée

La version légère, la 1.32, est **archivée** dans `archive/v1.32/` depuis le 18 novembre (décision du décideur) :
son jeu, ses outils et son livret, tels qu'ils étaient gelés au commit `8c21125`. On n'y touche plus. La 2.x ne s'y
compare plus : `gel.js`, `cartes.js` et `ecrans.js` ont été retirés, et la 2.x peut s'en écarter — dessin d'origine
et écran de la Chaîne compris. Ses parties (`isnad2.auto`, `isnad2.slot.N`, `isnad2.opts`) ne touchent pas celles de la
1.32 (`isnad.auto.v1`, `isnad.slot.N`, `isnad.opts.v1`).

**Le numéro.** La 2.x avance par centièmes (2.01, 2.02…), d'un centième à chaque enregistrement qui change le jeu :
`NUMERO`, dans `v2/tools/build.js`, qui le pose aussi dans le titre de la page.

## L'arbre de la 2.0

| Chemin | Rôle |
|---|---|
| `v2/src/core/defs.js` | les énumérations, comme en 1.32 ; en plus : les gabarits de carte (`D.GABARITS`), le contrat d'un paquet (`D.paquet`, `D.MOTEUR`), les livres (`D.LIVRES`) |
| `v2/src/core/regles.js` | **les règles du contenu**, en un module (voir plus bas) |
| `v2/src/core/perso.js` | le personnage du joueur : son nom dans les textes, sa tenue |
| `v2/src/core/*.js` | le moteur |
| `v2/src/data/` | le jeu de base : le contenu de la 1.32, mot pour mot |
| `v2/paquets/*.json` | les paquets publiés, embarqués à l'assemblage — aucun aujourd'hui |
| `v2/tools/` | assemblage, contrôle, parcours de test — les outils de la 1.32, tournés vers `v2/` |
| `v2/tools/paquet.js`, `v2/tools/essais/` | éprouver un paquet ; le paquet d'essai (pure fiction, jamais livré) |
| `v2/tools/partie.js` | la partie du joueur : format, export, import |
| `v2/tools/personnage.js` | le personnage du joueur : nom, tenue |
| `v2/src/core/partage.js`, `v2/tools/partage.js` | partager sa progression : l'image, le texte, le partage ; son contrôle |
| `v2/docs/` | feuille de route, architecture, contrat d'un paquet |

## Le jeu de base et les paquets

Le **jeu de base** est ce que la 2.0 a reçu de la 1.32 : le moteur, le livre I (prologue, cinq sagas, dernier maillon),
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

En 1.32, `maps.js` choisit le générateur d'après le nom de la carte, et quatre tests reconnaissent Koufa à son nom. En
2.0, chaque lieu de `D.MAPS` nomme son **gabarit** (`D.GABARITS` : ville, désert, camp, cité romaine, palais, navire,
noosphère, citadelle, Cité-Miroir, archives) ; le gabarit fixe les lieux nommés, le thème de l'interface, la piste, et
dit si l'on y bâtit. Koufa est une `ville` dans sa variante `fleuve`.

- Les onze lieux du jeu de base sortaient **identiques** à ceux de la 1.32, point par point (contrôle `cartes.js`, retiré le 18 novembre avec l'archivage de la 1.32) :
  bâtit des deux côtés les 65 cartes que le contenu demande et compare le dessin, les cases pleines, les lieux nommés,
  les objets, les lumières, l'ambiance et la piste.
- Un lieu déclaré par un paquet a son propre identifiant, donc sa propre graine : même plan, autre répartition des
  palmiers et des rochers. Si un lieu nommé s'y trouvait coupé des autres, le moteur rebat les cartes (`M.relie`).

### Les livres

`I.livres()` range les maillons par livre (`saga.livre`, 1 par défaut ; titres dans `D.LIVRES`). L'écran de la Chaîne
montre le livre I — ses maillons, puis le dernier maillon —, puis les autres livres sous leur titre ; les chiffres
romains et les comptes (« cinq Lumières ») sont calculés. Le dernier maillon ne dépend que des maillons du livre I :
une saga ajoutée ne peut pas bloquer la fin du jeu de base. Avec un seul livre, l'écran était celui de la 1.32, élément
pour élément (contrôle `ecrans.js`, retiré le 18 novembre : la 2.x peut désormais s'en écarter).

## La partie du joueur

Une partie de la 2.0 est au **format 2** : les champs de la 1.32, plus `profil` (le nom et la tenue du personnage,
lot 1.5) et `paquets` (les paquets posés quand elle a été écrite, avec leur version). Elle vit sous les clés
`isnad2.auto` (la partie en cours, gardée toute seule), `isnad2.slot.1` à `3` (les copies gardées à la mosquée) et
`isnad2.opts` (les options de l'appareil). La 2.0 ne lit ni n'écrit jamais les clés de la 1.32.

| Fonction (`ISNAD.save`, dans `base.js`) | Ce qu'elle fait |
|---|---|
| `migrer` (interne) | remet une partie lue au format courant sans toucher à l'original ; le format 1 — celui de la 1.32 — est accepté ; un format plus récent est refusé |
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
une partie prise dans la 1.32 gelée, acceptée et remise à jour ; les clés de la 1.32 intactes.

### Mener plusieurs récits : un point de reprise par récit

La partie garde un point de reprise courant (`cp`) et, **rangés à part, ceux des récits quittés en chemin** (`cps`) : un
par saga de la Chaîne (clé : l'identifiant de la saga), un par chapitre de l'histoire-cadre ou des veillées (clé :
`saga:chapitre`). `world.js` : `W.ranger()` range le point courant, `W.reprise(saga, chapitre)` rend celui d'un récit —
il redevient courant, et celui d'un autre récit est rangé —, `W.rangees()` les donne du plus récent au plus ancien.
`W.checkpoint()` n'écrase jamais le point d'un autre récit : il le range d'abord. La halte offre **« Revenir en 2084 »**
dans un récit des Compagnons ou une veillée (« Retour à la Chaîne » dans l'histoire-cadre) : `U.partir()` range le récit,
compte le retour (`retours`), puis ouvre la Chaîne — ou, s'il s'est passé quelque chose en 2084, le chapitre de
l'histoire-cadre marqué `retour: n` dont le tour est venu (`rebonds` note ceux qui ont été joués). La Chaîne lit
`W.rangees()` : chaque maillon dit s'il est « en route », et le grand bouton reprend le récit quitté en dernier.
`U.startSaga()` reprend le point rangé de la saga qu'on ouvre. Un chapitre marqué `visite` s'ouvre depuis le pied de la
Chaîne (la Citadelle, dès qu'une veillée a été entendue) et se rejoue. À l'ouverture d'un retour ou d'une visite, le
moteur pose l'état de 2084 en drapeaux (`U.drapeaux2084` : `_2084_veillee_<saga>`, `_2084_maillon_<saga>`,
`_2084_pilier_<pilier>`, `_2084_debout` / `_2084_tient` / `_2084_lezarde`, `_2084_en_route`). Ces chapitres se rejouant,
`oeuvres.sobre()` y ferme les œuvres (la natte ne sert qu'au repos) et `valeurs.porte` n'y ouvre pas de descente.
Champs nouveaux de la partie, tous facultatifs : `cps`, `retours`, `rebonds` — **le format reste le 2**, `controler` les
vérifie, `assainir` écarte un récit rangé dont le contenu manque. `node v2/tools/retours.js` joue le tout par les vrais
boutons : « RETOURS CONFORMES ».

### La progression : un outil à la fois (`src/core/lecons.js`)

Règle du décideur : *un besoin, un outil, puis sans aide ; une décision nouvelle par séquence.* Un **outil**
(`D.OUTILS`) est ce que le joueur apprend à faire. Une **séquence** est un objectif du récit ou un combat
(`I.lecons.sequence()`). Quand le **besoin** d'un outil se présente, le jeu appelle `I.lecons.proposer(id, dire)` :
l'outil n'est donné — `dire` affiche sa leçon, une ligne de `coeur.js` (`lecons`), là où sert l'outil (le fil, la question
d'un choix, le panneau du combat : « Un texte à la fois », plus bas) — que si aucun autre ne l'a été dans
cette séquence et si le dernier reçu a **resservi** sans aide (`I.lecons.reemploi(id)`), ou si c'est un simple geste
(`geste`), ou si trois séquences ont passé (`PATIENCE`) : le jeu n'attend jamais indéfiniment. Sinon rien n'est dit, et
le besoin se représentera. La partie garde `lecons` : `{ seq, recus: { outil: séquence }, re: { outil: fois }, dernier,
donne }` ; `I.lecons.journal` (non gardé) sert au contrôle.

| Outil | Le besoin | Le réemploi |
|---|---|---|
| `marcher` | le premier objectif du prologue | atteindre un lieu sans y avoir été conduit (`W._mene`) |
| `parler` (geste) | le premier objectif « parler à » | parler de nouveau |
| `aide` (geste) | vingt-cinq secondes sans avancer | rouvrir « ? » |
| `frapper` | le premier combat : Frapper, Éclairer | les choisir de nouveau, à un autre tour |
| `vertus`, `garde`, `objets` | les combats suivants, un par combat | les choisir de nouveau |
| `halte` (geste) | l'ouverture du premier récit | ouvrir la halte |
| `equipement` | la réserve tient mieux que ce que l'on porte | ouvrir la page |
| `source` | le premier acte à retrouver (`choice`) | retrouver le suivant du premier coup, ou ouvrir le Recueil |
| `frappe` | quelque chose rôde à six cases | frapper de nouveau |
| `postures` | une deuxième posture s'ouvre à quelqu'un | en changer |

**Ce qui ne se montre pas avant d'être reçu.** En combat, `listMenu` saute les commandes marquées `cache`
(`I.lecons.voit`) ; devant une idole, `I.lecons.combat(true)` donne tout. À la halte, `I.lecons.page(nom)` : une page
paraît quand son système a été rencontré (son feuillet est au Recueil, ou son outil est reçu). **Le mode n'existe que si
la partie porte `lecons`**, ce que fait « Nouvelle partie » (`I.lecons.ouvrir()`) : une partie d'avant, une partie
importée d'avant, ou un état posé par un outil de contrôle, a tout d'emblée — aucun autre contrôle n'en dépend.
**Ajouter un système**, c'est lui donner un outil dans `D.OUTILS`, appeler `proposer` là où son besoin naît, `reemploi`
là où il sert, et écrire sa ligne dans `coeur.js`. `node v2/tools/progression.js` : « PROGRESSION CONFORME ».

### Les postures (`src/core/postures.js`)

`D.POSTURES` (`heros`, `sage`, `saint`) déclare les effets, en pourcentages ; `D.TEMPERAMENTS` donne à chaque rôle sa
première posture ; `D.POSTURE_NIVEAUX` (1, 4, 7) ouvre les deux autres. `I.postures.de(h)` rend celle qu'un héros a
prise (par défaut celle de son tempérament), `choisir(h, k)` la change, `ouvertes(h)` liste celles qui lui sont
ouvertes. La partie garde `postures` (`saga:héros` → posture). `battle.js` les applique en posant le combattant
(`mkHero` : force, esprit, Niyya et Sakîna de départ, `soin`, `menace`) ; un sage dans le groupe fait connaître d'emblée
une faille de chaque égrégore ; un héros est plus souvent visé (`targetsFor`). La page « Postures » de la halte — et de
la préparation d'une bataille — ne paraît que lorsqu'un choix s'offre à quelqu'un du groupe (`offertes()`), et la leçon
se dit ce jour-là (`veille()`). Exigence 24 : on prend une posture, on ne la possède pas ; aucune n'est au-dessus d'une
autre.

## Le personnage du joueur : `src/core/perso.js`

Le joueur donne un nom et une tenue au **râwî** — le héros de l'histoire-cadre, personnage de fiction — et, depuis la
2.x, compose son apparence pièce par pièce (« Le râwî composé », plus bas). Les Compagnons gardent leur nom et leur
silhouette. Le choix est dans la partie : `profil: { nom, tenue, compo }` (`compo` est facultatif).

**Les textes ne changent pas.** Ils disent « Idris », en 2.0 comme en 1.32. Quand une saga est posée, `perso.js` relève
chaque phrase qui nomme le râwî (29 dans le jeu de base) ; quand le profil change, ces phrases-là sont redites à partir
de l'original, avec le nom choisi et la bonne élision :

| Texte d'origine | Khalil | Elyas |
|---|---|---|
| « la Patience d’Idris » | « la Patience de Khalil » | « la Patience d’Elyas » |
| « celui qu’Idris attendait » | « celui que Khalil attendait » | « celui qu’Elyas attendait » |

Tout ce qui lit le contenu — dialogues, cartons, objectifs, Recueil, combat — voit donc le nom choisi sans qu'aucun
écran ait été retouché. Avec le nom d'origine, rien n'est touché : phrases, sceau et silhouette sont ceux de la 1.32,
à l'identique. Un paquet qui écrit « Idris » dans ses textes obtient le même traitement.

| `ISNAD.perso` | Ce qu'elle fait |
|---|---|
| `profil()`, `nom()`, `tenue()` | le profil de la partie, ramené au personnage d'origine s'il est absent ou abîmé ; sa composition, contrôlée |
| `refus(nom)` | la raison pour laquelle un nom ne se prend pas, ou rien |
| `dire(texte, nom)` | une phrase d'origine, redite avec un nom |
| `relever(saga)` | relève les phrases qui nomment le râwî (appelée par `registerSaga`) |
| `appliquer()` | pose le nom dans les phrases relevées, le sceau et la tenue (appelée quand la partie change) |
| `choisir(nom, tenue, compo)` | contrôle, écrit le profil, applique (sans `compo` : celle du profil) |
| `compo(brut)`, `neutraliser(tenue, brut)` | une composition propre (seules les clés et les valeurs de `D.RAWI`) ; puis sans ce que l'ensemble donne déjà |
| `base(tenue)`, `permis(clé, valeur, tenue, compo)` | ce que donnent l'ensemble et le visage d'origine ; si une pièce va avec les autres |
| `composer(tenue, compo)`, `hasard(tenue, compo)` | l'apparence d'un ensemble et de ses pièces ; une tenue au hasard (jamais le visage) |

**Les noms refusés** : vide, plus de seize signes, autre chose que des lettres (avec espace, apostrophe, trait d'union) ;
le Nom divin employé seul ; Iblîs, démon, djinn ; le nom du Prophète ﷺ ; les noms des héros et des maillons du jeu, pour
ne pas brouiller les dialogues. Un nom n'étant fait que de lettres, il ne peut rien glisser dans la page.

**Les tenues** (`D.TENUES`, dans `defs.js`) : six silhouettes faites des coiffes, des manteaux et des couleurs que
`sprites.js` dessine déjà. La première est la tenue de toujours. Le râwî a un visage (« Les visages », plus bas) : le
même sous chaque tenue — `perso.look(tenue)` garde la marque de la tenue de toujours (`look.visage`). Avec un autre nom,
le sceau du râwî ne porte plus son nom en arabe : il montre l'étoile à huit branches, seule.

### Le râwî composé (2.x)

*Demande du décideur, le 18 novembre : « configurer le personnage d'Idris — couleur de peau, habits, accessoires…
je veux le permettre à l'utilisateur ». Les palettes sont validées (D193) ; le décideur y a retiré les feuillets au profit
d'une besace et d'une lanterne, et demandé plus de coiffes, sans silhouette de Compagnon (D193, réalisé par l'agent :
coiffes, règles et dessins à valider).*

Par-dessus son ensemble (une tenue de `D.TENUES`, qui devient un point de départ), le joueur change des pièces. Tout
vient de `D.RAWI` (`defs.js`). Avec le nouveau dessin d'Idris, les choix sont simplifiés (choix validés par le décideur :
deux coupes — puis une seule, le long manteau, le même jour : « supprime les choix d'Idris sans manteau, c'est une
catastrophe » —, trois coiffes, la besace à la hanche dans l'habit, la lanterne en option) :

| Pièce | Valeurs | Ce qu'elle pose sur l'apparence |
|---|---|---|
| `teint` | `t1` à `t7` : les cinq teints du moteur, puis deux plus sombres (`t3` : Idris) | `look.teint` |
| `barbe`, `poil` | glabre (Idris, depuis le pilote du nouveau dessin), courte, pleine ; trois poils sombres, ni gris ni blanc (`p2` : Idris) | `look.barbe`, `look.poil` |
| `coiffe` | la capuche, la calotte, le chèche (`litham`) | `look.coiffe` |
| `manteau`, `longue` | le long manteau, seul (la coupe ne se choisit plus) ; la robe jusqu'aux pieds | `look.manteau`, `look.court` |
| `etoffe` | `e1` à `e6` (les six ensembles), `e7` — chacune avec ses couleurs sur le grand personnage (`dessin`) | `look.robe`, `head`, `cloak`, `legs` |
| `neon` | `n1` à `n5` : [bande, ceinture] ; sans choix, le néon de l'ensemble | `look.neon`, et le liseré suit la bande |
| `objet` | la lanterne (les feuillets, retirés : D193 ; la besace en bandoulière, retirée : elle est à la hanche, dans l'habit) | `look.porte` |

**Les choix retirés** avec le nouveau dessin : le turban haut (le long manteau, qui est l'habit même, ne pouvait aller avec
lui), les coupes « sur une épaule » et « ample », l'écharpe (elle fait partie de l'habit), la besace en bandoulière. Une
partie qui en portait un l'oublie, sans erreur (`perso.compo` ne garde que les valeurs de `D.RAWI`) ; le reste demeure.
Deux ensembles portent encore une coupe retirée (le veilleur, le lettré) : ils ne changent pas (leur petit personnage
reste celui d'avant), leur coupe vaut le long manteau (`perso.base`), et le grand personnage les dessine ainsi.

- **Des identifiants, jamais une couleur.** La partie garde `compo: { teint: 't6', coiffe: 'calotte', … }` ; une teinte
  retouchée ne casse aucune partie, et un identifiant retiré redevient absent — on n'en réordonne aucun, on ajoute à la
  fin, et l'on n'en retire que sur décision du décideur. `perso.compo` ne lit que des propriétés propres, que les clés et les valeurs de `D.RAWI` : une
  composition abîmée (balise, type faux, valeur inconnue, `__proto__`) est oubliée, sans refuser la partie.
- **Sans rien choisir, rien ne change.** Ce qui vaut déjà l'ensemble ou le visage d'origine n'est pas gardé
  (`neutraliser`) ; sans pièce, dans la tenue de toujours, le râwî est l'objet d'origine (`===`) : les films, la démo et
  le livret n'ont rien à refaire. Le format de la partie reste le 2 : `compo` est un champ de plus, facultatif ; une
  partie d'avant s'ouvre avec Idris tel qu'il était ; un jeu plus ancien ignore `compo` et montre l'ensemble.
- **Le visage ne tient à aucun habit** (exigence 10). Sa marque est figée (`look.visage`) : changer d'étoffe, de néon,
  de coupe ou d'objet ne change pas un point du visage. Un ensemble change l'habit, jamais le visage ni l'objet ; le dé
  tire un habit, jamais un visage ; ↺ rend le râwî de toujours. Aucun mot ne dit un trait (exigence 2) : teint, barbe et
  poil se choisissent sur des pastilles et des vignettes ; leurs noms ne vivent que pour les lecteurs d'écran (« Choix 3
  sur 7 »).
- **Les coiffes, et ce qu'elles ne prennent pas** (`D.RAWI.sans`). Des coiffes que le moteur dessine dans toutes les
  tailles : la capuche, la calotte et le chèche (sous lequel on ne voit que les yeux). Aucune composition ne donne la
  silhouette d'un Compagnon des récits, ni de Sâlim ou de Maître Yûnus, qui marchent avec le râwî : la calotte ne se
  prend pas sans manteau (Sâlim, Abû 'Ubayda, Aslam, Zayd ibn Thâbit) ; le chèche ni dans l'étoffe claire ni dans la verte (de dos, dans le petit personnage, il a le gabarit
  même du turban des Compagnons : clair, ce serait l'un d'eux ; vert, 'Alî, son turban sombre et sa robe verte — la
  relecture de D193 l'a mesuré). Et sous le turban et le chèche, le bandeau du râwî est fait de ses deux néons, la bande et la ceinture (`Y`,
  `y` ; `NEON_TETE`, `sprites.js`) — deux lignes sous le turban du grand personnage, et, là où le bandeau n'a qu'une
  ligne (le petit personnage, le chèche), les deux néons point par point : de dos, où l'on ne voit ni son visage ni le
  néon de sa poitrine, c'est la marque de 2084 — le bandeau d'un Compagnon a sa couleur, d'un seul ton. À l'écran, une coiffe se prend toujours : ce qui
  n'allait pas avec elle cède sous les yeux (la coupe revient à celle de l'ensemble, sinon au long manteau ; l'étoffe, à la
  première qui va) ; tant qu'on la porte, la case qui n'irait pas avec elle s'éteint. Le dé ne tire que ce qui va.
- **Ce qui n'est pas proposé.** Le turban des Compagnons (`imama`) ; le turban large et bas ('Umar, 'Uthmân, Qays —
  'Umar le porte sombre, comme le serait celui du râwî) ; le turban à pan (trois Compagnons, et Maître Yûnus) ; le keffieh
  et la tiare, qui disent dans le jeu les gens des tribus et les Perses (exigence 10) — la tiare est aussi celle du
  Régent de 2084, et son galon est doré ; les casques et la coiffe de mailles (de l'équipement). Aucun objet qui soit
  une arme, une pièce d'équipement, la marque d'une figure de 2084 (la bourse du Compteur, les feuillets du Cartographe)
  ou l'attribut d'un Compagnon (les feuillets de Zayd ibn Thâbit et d'Ibn 'Abbâs) ; le néon ne donne pas de lumière au
  râwî sur la carte (une lumière à soi est la marque d'un Compagnon) ; ni lueur ni rayonnement.
- **La besace et la lanterne** (D193 ; depuis le nouveau dessin, la besace est à la hanche, dans l'habit du grand
  personnage, et la lanterne seule se choisit), objets ordinaires de 2084, sans motif ni ornement (exigence 17), dessinés pour
  chaque taille où le râwî paraît — 16 × 24 (le petit personnage du dessin d'origine), 32 × 48, 64 × 96 —, jamais
  agrandis de la taille d'en dessous (`SAC`, `BESACE`, `LANTERNE`, `poserObjet`, `sprites.js`) ; le personnage fin
  (`fine()`) les reçoit à sa taille, sous la tête, jamais sur une main. La besace : un sac de cuir à rabat, porté en
  bandoulière — la sangle part de l'épaule, croise la poitrine sans couper la bande de néon, le sac pend à la hanche. La
  lanterne : une lampe portative, une boîte de métal sombre autour d'un verre pâle, et son anse ; ni niche, ni arc, ni
  globe, ni chaîne, ni croisillon, ni or, et elle ne donne aucune lumière. Elle pend à la main qui pend et suit le pas ;
  quand cette main est prise (le recueillement, la surprise, la garde, un geste de frappe de profil), elle s'accroche à la
  ceinture ; à genoux, elle est posée à côté de lui ; de dos, la main prise, on ne la voit pas. Comme tout objet porté,
  elles se rangent au combat et sur la page d'équipement. Une partie gardée quand le râwî portait les feuillets s'ouvre
  sans erreur : son objet revient à « rien ». Ni or ni jaune : le liseré d'un habit composé n'est jamais le beige doré que le moteur pose à défaut, ni
  le jaune pâle d'un ensemble (celui du veilleur, `#ffe08a`, D146) qu'une pièce composée mettrait au jour — le bandeau
  d'une coiffe qui en a un (`gfx.galon` : la calotte, le turban ; le chèche, de dos, dans le petit personnage), l'écharpe,
  le bas de la robe longue : c'est alors le néon, ou le cyan de l'habit (`perso.dore`).
- **Le moteur** (`sprites.js`) : `look.neon` colore la bande et la ceinture, et le bandeau du turban et du chèche ;
  `look.porte` (la besace, la lanterne) se dessine à chaque taille, et l'équipement ne le lit pas (`gear.js` : l'arme de
  départ reste le couteau, et l'objet se range au combat) ;
  `look.barbe` et `look.poil` ne valent que pour un adulte ; un teint plus sombre que tous ceux du moteur garde le blanc
  de l'œil jusque sur le personnage de 32 × 48, sous la même ombre de capuche que les autres — la gamme reste dans
  l'ordre. `G.traits(look)` dit le visage que le moteur tire d'une apparence ; `G.objet(nom)`, l'icône d'un objet, tirée
  de son dessin, à la taille du dessin choisi. Un récit ou un paquet n'écrit ni `teint`, ni `barbe`, ni `poil`, ni `visage`, ni `neon`, ni `porte` :
  `regles.js` le refuse (« réservé au râwî que compose le joueur »).

**La marque du râwî** (D193, précision du décideur : « les autres habitants de la Cité-Miroir ne doivent pas ressembler à
Idris »). La bande et la ceinture de néon (`Y`, `y`) ne sont qu'à lui : elles viennent du type `cyber`, que seul le râwî
porte ; les autres habitants de 2084 — Sâlim, les passants, l'employé, celui qui défile, le Régent, l'Admiré, le Compteur,
le Cartographe, l'agent du relevé — sont du type `citadin` (`sprites.js`) : la capuche et l'habit court de la ville, la
même teinte de 2084 sur la coiffe, sans le néon. `D.DE_2084` dit les deux types de 2084 : ni casque ni tunique de départ,
la coiffe gardée au combat (`gear.js`), la lueur de 2084 pour le meneur (`world.js`). Sept d'entre eux portaient les étoffes
mêmes du râwî, sous sa capuche et sa coupe : ils ont reçu des couleurs à eux, loin des sept étoffes ; deux liserés aux
couleurs de ses néons (l'Admiré, le Cartographe) ont changé ; le Régent garde la tiare. Et la capuche ne prend pas la robe
longue : ce serait l'habit des moines du jeu (Frère Cyprien, à la Citadelle, et les moines des récits), qu'on ne retouche
pas. Le râwî d'origine, lui, ne change pas d'un point. `silhouettes.js` le prouve : aucun autre personnage du jeu n'a la
bande ni la ceinture, en petit, en grand ni dans le tracé fin, et le râwî les a sous chaque ensemble et chaque composition ;
aucune composition, même sans sa marque, ne ressemble à un habitant de 2084 ou de la Citadelle, ni à un Compagnon (moins
de 85 % de points d'une couleur presque égale, ΔE < 12, de face, de profil et de dos, en 16 × 24 et en 32 × 48).

**L'écran « Ton personnage »** (`U.personnage`, `ui.js`) : le nom, en haut — le clavier du téléphone ne le cache pas ;
l'aperçu en grand, de face et de profil, et tel que la carte le montre (le petit personnage, sans visage, dans le
dessin d'origine) — un toucher le rapproche du visage, et il s'en rapproche de lui-même quand on touche un teint, une
barbe ou un poil ; la rangée des ensembles ; des pastilles et des vignettes sans légende, de 44 points. Il s'ouvre à
chaque nouvelle partie, avant le prologue, tout déjà choisi — un toucher suffit à commencer (D145) : l'ensemble et le
visage seulement. Après le prologue, depuis le pied de la Chaîne et la halte, la composition entière en quatre onglets
(le visage, l'habit, les couleurs, l'objet) : des icônes tirées du râwî lui-même, seul l'onglet ouvert dit son nom.
Sous le pouce : ↺, le dé, « Commencer » ou « Garder ». Trois mots à l'écran au début (« Ton personnage », « Écrire »,
« Commencer »), cinquante auparavant. En largeur, l'aperçu et les boutons à gauche ; sur un téléphone étroit (640 × 360,
667 × 375), la colonne de droite s'en tient à sept cases de large, et les boutons du bas vont à la ligne plutôt que de
se tasser — aucun mot n'est coupé ; sur le plus bas (568 × 320), les vignettes raccourcissent pour que tout tienne sans
défiler. En arabe, l'écran se retourne de lui-même (propriétés logiques). Au clavier et à la manette, les flèches vont
de case en case (`focusList`, option `spatial`) ; une souris immobile sous l'écran qui s'ouvre ne prend pas la main
(option `survolBouge`) : « Entrée » commence toujours. La page « Ton personnage » de la halte montre le râwî lui-même.

`node v2/tools/personnage.js` le prouve : les noms acceptés et refusés ; chaque phrase redite avec six noms ; le profil
d'origine qui ne change rien ; les règles du râwî composé (composition abîmée oubliée, visage inchangé par l'habit, le
dé sur mille tirages, les teints dans l'ordre dans les trois dessins, aucune silhouette de Compagnon, de Sâlim ni de
Maître Yûnus, aucune composition qui ressemble à un Compagnon quelle que soit sa coiffe (moins de 85 % de points d'une
couleur presque égale, de face, de profil et de dos, en 16 × 24 et en 32 × 48), aucun turban clair, le visage sous le turban et les yeux seuls sous le chèche, le bandeau aux deux néons de
face, de profil et de dos, l'arme de départ, ni or ni jaune sous aucune coiffe ni sur les objets, les feuillets retirés et
perdus sans erreur, le refus des règles) ; puis, par les vrais boutons et en quatre tailles d'écran, chaque choix touché et vu et un
prologue entier joué sous un autre nom et un autre visage — tout ce qui s'affiche est relevé, « Idris » n'y paraît plus
— ; sur les téléphones courants, en largeur et en hauteur (640 × 360, 667 × 375, 568 × 320, 320 × 568), aucun mot coupé
ni rien hors de l'écran, à l'ouverture et dans chaque onglet ; le champ du nom, son nom pour les lecteurs d'écran et un
clavier qui ne corrige pas un prénom ; ni néon ni liseré doré ; la composition entière, case par case ; chaque coiffe,
et ce qui cède sous elle ou s'éteint ; enfin le choix gardé, rechargé, changé depuis la halte, exporté, importé — et une
partie qui portait les feuillets, qui s'ouvre sans eux ; l'écran en arabe ; au clavier. `silhouettes.js` y ajoute le
râwî composé (chaque valeur de chaque pièce, chaque coiffe sous chaque coupe, chaque objet sous chaque coiffe, et des
compositions entières) et l'empreinte des grands personnages d'avant (`tools/essais/grands.json`) ; les silhouettes
venues ensuite y sont ajoutées à leur création (`silhouettes.js relever-nouveaux`, qui refuse si une seule empreinte
déjà relevée a changé) ; `partie.js`, une partie dont le râwî est composé, exportée puis réimportée à l'identique.

### Le râwî d'après la maquette (2.x — validé par le décideur le 19 novembre : l'image au repos, le rendu, puis tout le dessin et les étoffes)

*Le décideur n'aime pas le dessin d'Idris et a fourni une maquette (19 novembre) : un homme encapuchonné, la capuche et le
long manteau ouvert bleu sarcelle, la tunique et les chausses crème, une écharpe rouille, la ceinture de cuir et sa besace
à la hanche, les bottes, la bande et la ceinture de néon ; plus élancé que les autres. L'image n'entre ni dans le jeu ni
dans le dépôt. Il a validé le pilote v3 (« Idris v3 : je le valide ») et le rendu doux tel quel, puis demandé le reste du
personnage.*

- **Des gabarits propres au râwî** (`sprites.js`, `RAWI64`) : de face, de profil, de dos, au repos, en 64 × 96 — la
  finesse de la maquette. Tout le reste en est tiré, à 64 × 96, par des règles écrites une fois (`rawiVariante()`), puis
  réduit à 32 × 48 (`reduire()`), comme l'image au repos ; chaque image se fait une fois, à la demande. `G.rawi64 = false`
  rend le 64 × 96 retracé du 32 × 48 par `fine()`, comme les autres personnages : pour comparer. Ce qui reste du moteur :
  cinq tons par matière (`rampes()`), la lumière en haut à gauche, le rendu doux, le liseré, les cheveux tirés du poil.
- **L'habit** (`rawiHabit()`). La coupe : le long manteau de la maquette, toujours — la coupe « sans manteau » a été retirée
  par le décideur le 19 novembre, et un ensemble qui la portait (la veste de la ruelle) se dessine en long manteau. Ce
  qu'elle faisait, pour mémoire (`sansManteau()`, retiré : ses manches
  et son buste deviennent la tunique, ses pans tombent, la tunique descend jusqu'au genou et ce que le manteau cachait des
  jambes reparaît ; ses plis deviennent une ombre sur l'étoffe claire). « Sur une épaule » et « ample », qui ne se
  choisissent plus, se dessinent en long manteau. La robe longue (`robeLongue()`) : la tunique jusqu'aux bottes, d'un seul
  pan. La coiffe (`coiffer()`) : la capuche de la maquette ôtée, une autre posée, tirée de formes simples (le crâne, le
  rouleau), et le visage de la maquette gardé à sa place, au point près — la calotte et son galon (le liseré de l'habit :
  le néon, ou le cyan), les cheveux, le visage entier ; le chèche, son rouleau et ses plis, le bandeau aux deux néons (D193,
  de face, de profil et de dos) et la bande des yeux seule ; l'écharpe remonte au menton. L'écharpe et la besace à la hanche
  font partie de l'habit.
- **Les pas** : de face et de dos, `foulee64()` (le bras du côté qui avance descend, l'autre remonte ; la moitié qui
  avance descend et son pied dépasse — la règle de `foulee()`, à l'échelle de 64 × 96) ; de profil, les jambes s'écartent
  puis se croisent depuis la hanche (`cisailler()`) et le bras balance depuis l'épaule (`tournerBras()`). Le souffle (la
  quatrième image) se tire de lui-même de l'image au repos (`grand(…, 3)`), comme pour tous.
- **Les gestes de frappe et les attitudes** (`RAWI_GESTES`, `RAWI_POSES`) : le bras qui bouge est ôté du gabarit
  (`sansBras()` ; de profil, le flanc paraît derrière lui, et la ceinture en fait le tour), puis tracé de l'épaule au
  poignet par le coude (`bras64()` : la manche et ses trois tons, le fil, le revers de la tunique, la main), un point de
  vide le détachant de ce qu'il recouvre — jamais sur le visage. L'élan et le coup dans les trois vues (de profil, le corps
  se fend et penche) ; la place de la main qui frappe est celle du trait, et le moteur y pose l'arme (`G.frappe`). Les six
  attitudes de face et de profil, et de dos celles que les autres personnages y ont (le recueillement, la résolution,
  l'accablement) : la tête s'incline ou s'abaisse (`bougerTete()`), les yeux se ferment dans le recueillement et
  l'accablement ; à genoux, le haut du corps descend de vingt points et le bas se replie (`agenouiller()`). Ce qu'un bras
  ôté laisse seul (une miette du tracé, loin de tout) s'ôte (`nettoyer()`) ; l'image au repos validée reste telle quelle.
- **La lanterne** (`lanterneRawi()`) : à la main qui pend, de son côté ; la main prise, à la ceinture ; à genoux, posée
  à côté de lui ; dessinée à 32 × 48 et à 64 × 96 au même endroit, jamais sur une main ni sur le visage.
- **Qui le reçoit** : le râwî seul. `perso.js` pose sa marque (`look.rawi`) sur ses ensembles et sur le héros de
  l'histoire-cadre ; un récit ou un paquet ne l'écrit pas (`regles.js`). Les couleurs viennent de l'étoffe
  (`D.RAWI.etoffes[…].dessin`, trois tons par matière : e1 relevée sur la maquette ; e2 à e7 proposées par l'agent,
  gardées toutes par le décideur le 19 novembre). Toutes ses coiffes, coupes, longueurs, étoffes et objets ont ce dessin ; une autre coiffe ou une armure (aucune
  ne se compose) garderait le dessin d'avant. Le petit personnage (16 × 24, dessin d'origine sur les cartes) n'a pas changé.
- **Son visage** (v3, choix du décideur : « n° 3, grands yeux », sans barbe ni moustache) : `visageGabarit()`, et non
  `visage()`, qui garde son dessin pour tous les autres. Dessiné point par point (`VISAGE_RAWI`, en 64 × 96 et en
  32 × 48) : de grands yeux expressifs avec leur blanc, un iris sombre et son point de lumière, des sourcils marqués, une
  mèche sur le front sous la capuche, le nez d'un point d'ombre, une bouche d'un trait. Une manière de dessiner, aucun
  visage repris ; les modèles IA qui l'ont fait choisir restent hors du dépôt et du jeu. Sous le chèche, les lignes des
  yeux seules (`FENTE`) : ni sourcils, ni mèche, ni barbe. Un teint plus sombre que ceux du moteur garde le blanc de l'œil
  blanc (la gamme des teints reste dans l'ordre, et l'œil se voit jusqu'à 32 × 48). Un gabarit d'une autre taille que le
  visage du corps rend le visage de la v2 (`visageRawi()`).
  Idris est **glabre** par défaut (`RAWI_BARBE` ; `G.traits` le rend pour le râwî marqué, et `perso.js` le lit comme
  visage d'origine) ; la barbe courte (le collier) et la pleine se dessinent sur ce visage. Le corps est équilibré :
  la tête agrandie d'un quart (jamais plus large que les épaules), le corps un peu plus court et plus large, davantage de
  profil.
- **Les empreintes** (`silhouettes.js`). Le râwî marqué se compare à son empreinte (la marque n'est pas dans la clé). Un
  nouveau dessin validé par le décideur devient la référence des grands personnages par une procédure dite :
  `node v2/tools/silhouettes.js redessin « la décision »`. Elle passe d'abord le contrôle entier — les petits sprites au
  pixel près, l'interrupteur, les voiles sans trait, les visages de face et de profil (rien de dos), les coiffes, les
  gestes, la marque du râwî, les ressemblances — et seul l'écart des grands y est tenu pour voulu ; à la moindre autre
  anomalie, rien n'est écrit. Puis `grands.json` est relevé de nouveau en entier (la décision y est inscrite, avec la
  date et le compte des silhouettes redessinées, nouvelles et retirées), et `silhouettes.json` reçoit les petites
  silhouettes nouvelles et perd celles qui n'existent plus, sans qu'aucune empreinte de petit sprite ne change. Ensuite,
  le contrôle ordinaire compare à ce relevé, au point près. Relevé ainsi le 19 novembre : Idris v3, sa suite et le rendu
  doux de tous les grands personnages.

## Partager sa progression : `src/core/partage.js`

*Demande du décideur, 19 novembre : « la possibilité de partager sa progression sur les réseaux sociaux ». Textes, image
et format proposés par l'agent, à valider.*

**Où.** « Partager ma progression » est au pied de la Chaîne, à côté des Lumières et de la fidélité, et dans la halte, à la
fin du premier bloc, sous « Reprendre » (Reprendre, Que faire ?, Carte, Partager ma progression) : c'est la page
« Reprendre » qui dit où en est le récit (le chapitre, la fidélité, les Lumières), et le partage ne dit rien d'autre. La
page du groupe n'a pas été choisie : ses niveaux, sa Constance et son équipement sont des nombres de combat, qu'on ne
partage pas. Le bouton n'apparaît qu'une fois un maillon achevé (`I.save.maillons()`), et seulement si l'assemblage a
posé l'adresse et la réserve. Ce n'est pas un outil du jeu : aucune leçon ne l'annonce (`lecons.js`), aucun message de
plus. Depuis la halte, « ◂ Retour » rend la halte ; depuis la Chaîne, la Chaîne ; Échap aussi.

**L'aperçu** (`#partage`, `I.partage.ouvrir`) : l'image, deux réglages (« Format : carré » / « vertical » ; « Ton
personnage : montré » / « caché », gardés avec les options de l'appareil, `opts.partage`, jamais dans la partie),
« Partager », « Copier le texte », « Enregistrer l'image » (sauf dans un Artifact), « ◂ Retour », une ligne d'état, et le
texte qui partira (une zone en lecture seule, qu'on peut sélectionner).

**L'image** (`I.partage.dessiner`), dessinée par le jeu sur un canevas, dans la langue de jeu : **carrée, 1080 × 1080**
(les fils des réseaux), ou **verticale, 1080 × 1920** (les « stories » : le titre et la réserve restent hors des 220
points du haut et des 260 du bas, que les applications recouvrent). Le ciel de l'écran-titre (`U.fondTitre`), إسناد,
ISNAD, le sous-titre ; puis, dans un panneau : le râwî de face tel que le joueur l'a composé (`G.figure`, agrandi au
pixel : un personnage de fiction, avec son visage, sans lueur ni rayonnement — D193), son nom et « le Râwî · 1507 H ·
2084 », les cinq sceaux du livre I (achevés en couleur, les autres éteints ; les sceaux de la Chaîne, sans visage), sous
chacun le signe de sa Lumière et, retrouvée, son nom ; « 2 maillons achevés sur 5 », « Lumières retrouvées : 2 / 5 »,
« Fidélité à la Chaîne : 14 / 16 », le chapitre en cours ; au pied, l'adresse et la réserve. En arabe, tout se lit de
droite à gauche (le personnage à droite, le premier sceau à droite), en Reem Kufi et Noto Naskh Arabic ; en japonais, en
Noto Serif JP, sans couper un nom en katakana ; ni capitales ni lettres espacées hors du français et de l'anglais. Les
polices sont chargées pour les textes mêmes que l'image porte (2,5 s au plus ; sinon, celles du système).

**Le texte** (`I.partage.lignes`), une phrase par ligne : « ISNAD · Chroniques des Compagnons » (إسناد en arabe),
« Khalil suit la Chaîne : 2 maillons achevés sur 5. », « Lumières retrouvées : 2 / 5 · Fidélité à la Chaîne : 14 / 16 »,
« En cours : Khâlid ibn al-Walîd · La Traversée » (le chapitre que l'on joue ; sinon le récit quitté en dernier ; sinon
« Prochain maillon : … » ; après le dernier maillon, « La Chaîne est transmise »), l'adresse, la réserve.

**Ce qu'ils ne disent jamais** : les œuvres et leurs nombres, la provision du cœur, les maux du cœur, les lames, les
idées noires, les Valeurs et attributs, la descente dans la noosphère — la vie intérieure ne se partage pas (D187 ; la
distance avec le joueur ; exigences 13 et 15) ; ni les piliers de la Citadelle, ni les pourparlers, ni les combats
(exigence 6) ; aucune figure (exigence 24) ; aucun Compagnon dessiné (exigence 2) ; aucun Nom divin ; aucune source.

**Une seule source pour l'adresse et la réserve.** `v2/tools/promotion.js` dit ce que le jeu en reprend (`JEU` : le nom,
le sous-titre, l'adresse, la réserve) ; `v2/tools/build.js` le pose dans la page (`window.ISNAD_PROMO`), sans le recopier
dans le moteur ; `v2/tools/langues.js` relève ce que le jeu en dit dans la langue du joueur (`JEU_DIT` : le sous-titre et
la réserve, dans le fichier `moteur`). C'est la seule exception à la règle de `langue.js` (« le premier argument de
`I.t` est une chaîne écrite en toutes lettres ») : `I.t(P.RESERVE)`. Changer la réserve, c'est la redemander dans
chaque langue. La réserve suit le décideur (19 novembre) : « Version bêta. La relecture historique et religieuse par un
spécialiste reste à faire. »

**Le partage.** « Partager » appelle `navigator.share({ files: [l'image], title, text })` quand le navigateur sait partager
un fichier (`navigator.canShare({ files })`) : c'est la feuille de partage du téléphone, qui mène à tous les réseaux ; le
jeu n'en nomme aucun et ne fait aucune requête. Le fichier est prêt avant le geste (`isnad-progression.png`), pour que
Safari, qui demande un geste récent, ne le refuse pas. Annulé (`AbortError`) : « Partage annulé. », rien de plus. Sinon
— pas de `navigator.share`, pas de partage de fichier, un refus (`NotAllowedError`), une erreur — **le repli** : le
texte est copié (`navigator.clipboard`, sinon la vieille commande ; s'il ne peut l'être, il reste sélectionné, et c'est
dit), l'image est montrée en grand, à garder d'un appui long (une image `data:`, que le menu du téléphone sait
enregistrer) ; au bureau, « Enregistrer l'image » la remet au navigateur. **Le partage complet suppose le jeu publié à son
adresse** : dans la page privée où il l'est pour l'instant (un Artifact, un cadre isolé), le navigateur peut refuser le
partage et ne laisse pas remettre de fichier — le bouton d'enregistrement n'y est pas proposé, comme pour « Exporter la
partie » —, et le repli s'offre alors, sans erreur.

`node v2/tools/partage.js` le prouve : avant tout maillon, ni la Chaîne ni la halte n'offrent le bouton ; une partie
avancée (le prologue et deux maillons joués par le joueur automatique, le râwî nommé et composé) l'offre ; touché, il
ouvre l'aperçu ; l'image se dessine aux deux formats, avec et sans le personnage, et n'est pas vide ; le seul
personnage dessiné est le râwî ; aucune leçon n'est proposée ; dans les quatre langues, le texte et ce que l'image porte
disent le nom, les maillons, la réserve dans la langue et l'adresse de `promotion.js`, et aucun mot des œuvres, du cœur,
des Valeurs, de la descente, des figures, du Nom divin ni des combats (une liste par langue, et les noms que le jeu
donne lui-même à tout cela) ; dans la halte, le bouton sous « Reprendre », l'aperçu qui dit le chapitre en cours, le
retour ; au bureau, le PNG enregistré ; au doigt sur un téléphone, le partage accepté (le PNG et le texte partent), et
chaque repli (absent, sans fichier, refusé, en erreur, presse-papiers refusé, dans un Artifact) ; aucun texte sous dix
points, aucune requête, aucune erreur console : « PARTAGE CONFORME ». Les images dans `.smoke/partage/`, dans les quatre
langues.

## La manette tactile : `src/core/ui.js` (`pad`, `layout`, `U.frapper`) et `src/core/base.js` (« retour »)

*Demandes du décideur, 19 novembre : « un joystick transparent pour le pouce gauche » ; « l'idée est de pouvoir aussi jouer
sur le téléphone comme si on avait une Game Boy » ; « juste deux boutons A et B » ; « parler avec A, frapper avec B » ;
« aussi il faut que les boutons puissent servir à sélectionner (A) ou faire marche arrière (B) ».*

Sur un écran tactile (`body.touch`), la manette sert **partout**, comme une console de poche : en exploration, dans les
labyrinthes et la descente du râwî, en bâtissant, dans un dialogue, sur un carton, devant une liste de choix, à la halte
et dans chacune de ses pages, sur les écrans (titre, Chaîne, « Ton personnage », « Ta partie », le partage) et en combat.

- **sous le pouce gauche, un joystick** (`#pad .joy`) : un cercle transparent et son bouton, que le pouce tire. En
  exploration (l'écouteur du dessus est celui du monde : `I.input.auMonde()`, `U.padMarche`), au-delà d'un petit rayon
  mort, huit directions — celles des flèches du clavier (`I.input.held`), que la marche lit ; lâché, tout s'arrête.
  Ailleurs, il **choisit** : quatre directions (l'axe le plus marqué, qui garde la main jusqu'à 55°), un cran par poussée,
  puis, tenu, un cran de plus après 0,42 s et tous les 0,16 s ; il passe par les mêmes actions que les flèches (`up`,
  `down`, `left`, `right`), donc par les mêmes listes (`focusList`, `listMenu`, `menuPick`, le choix d'une cible) ;
- **sous le pouce droit, A et B**, deux lettres, aucun mot. **A** (plus haut) envoie `ok` : parler, agir, choisir ce qui
  est sélectionné, passer à la suite. **B** (plus bas) envoie `retour` (`base.js`, `emit`) : chaque écouteur le reçoit
  comme Échap (`cancel` : revenir d'un cran, passer une réplique), sauf l'écouteur du monde (marqué `monde`, posé par
  `U.boot`), qui le reçoit comme `frappe`. En exploration, B frappe donc ce qui rôde, et n'ouvre jamais la halte ; quand
  quelque chose est à portée de coup (`rodeurs.aFrapper`), B s'éclaire (`body.frapper`). Le menu reste le bouton ☰ de la
  scène ; le clavier ne change pas (Échap ouvre la halte en exploration, F frappe) ;
- **une liste de choix qui a son « retour »** marque cette réponse (`{ t, retour: true }` : « Retour », « Plus tard »,
  « Annuler », « Partir », « Garder ma partie », « Pas maintenant », « Reprendre », « Personne pour l'instant ») ; B (ou
  Échap) la prend (`S.menuPick`). Devant un choix qui doit être fait — un pourparler, une question du récit, une idée
  noire —, B ne fait rien ;
- **la sélection se voit** : au doigt, ce qui est sélectionné porte un anneau clair (`body.touch .sel`, et la cible d'un
  combat : `.plate.cur`, `.hrow.cur`) ; toucher directement un bouton, une cible ou un endroit de la scène marche
  toujours, partout ;
- **dans toutes les langues**, la manette garde ses places (`#pad { direction: ltr }`) : en arabe, la page va de droite à
  gauche, mais les pouces ne changent pas de main ;
- ce n'est pas un outil de la progression : aucune leçon ne l'apprend ; la ligne du réglage « Manette tactile » le dit. Rien
  n'est gardé dans la partie : son format ne change pas.

| Où l'on est | A | B | le joystick |
|---|---|---|---|
| exploration (un récit, un labyrinthe) | parler, agir ; à portée de ce qui rôde, frapper | frapper ce qui rôde à portée (B s'éclaire) ; sinon, arrêter la marche — jamais la halte | marcher (huit directions) ; au bord, courir |
| la descente du râwî | frapper (à l'abri : attendre) | frapper | marcher, courir |
| bâtir | poser la pièce | cesser de bâtir | marcher |
| un dialogue, une narration | finir la ligne, puis passer à la suivante | de même (comme Échap) | — |
| un carton (titre, parole citée, secours, victoire, défaite, la fin) | passer | passer | — |
| une liste de choix (pourparler, question du récit, idée noire) | choisir la réponse sélectionnée | rien | monter, descendre |
| une liste qui a son « retour » (natte, comptoir, eau, copie, « Que faire ? », descente proposée…) | choisir | prendre la réponse « retour » | monter, descendre |
| la halte | entrer dans la page sélectionnée | la refermer : retour au jeu | la case voisine (en hauteur, deux colonnes) |
| une page de la halte (Carte, Équipement, une pièce, Figures, Recueil, Aide, Valeurs, Les degrés du mal…) | choisir | revenir d'un cran | la case voisine |
| la préparation d'une bataille | choisir | rien : on ne recule pas, la seule sortie est « Déclarer la bataille » | la case voisine |
| l'écran-titre | choisir | dans les réglages : revenir à l'essentiel ; sinon, rien | monter, descendre |
| « Ton personnage » | choisir | revenir (au début d'une partie : rien) | la case voisine |
| la Chaîne | ouvrir ce qui est sélectionné | rien | monter, descendre |
| « Ta partie », « Partager ma progression » | choisir | revenir | monter, descendre |
| le combat : les commandes | choisir la commande | rien | monter, descendre ; ◂ ▸ : la Niyya |
| le combat : vertus, objets, ordres, manœuvres | choisir | revenir aux commandes | monter, descendre |
| le combat : la cible | frapper (ou soigner) celle qui est montrée | revenir aux commandes | changer de cible |
| le combat : un bandeau | passer | passer | — |

**Sa place** (`layout`, `padPlace`) : la manette ne recouvre jamais un texte, un bouton, une cible ni l'image du combat. Ses
mesures viennent d'elle-même (la marge du système, une encoche, est comprise), et elle passe au-dessus des écrans et des
cartons (`z-index` 46), dans une place que rien ne lui dispute :

- **en hauteur**, la bande du bas (`--pad-bas`, `U.padBas`) : les écrans (`.screen`) et les cartons s'arrêtent au-dessus ;
  une liste de choix aussi (elle se resserre : `S.ajuster`) ; le panneau du combat se resserre (`tenir`), prend la mise en
  page serrée des petits écrans dès qu'il reste moins de 700 points sans la bande (`body.serre`), et la scène du combat se
  raccourcit pour lui laisser 300 points (`PANNEAU`) ; la seconde bulle de la langue secondaire s'arrête au-dessus de la
  bande. Sur un écran de moins de 740 points de haut, la manette est plus petite ;
- **en largeur**, les deux marges (`--pad-cote`, `U.padCote`) : la scène garde sa hauteur et ne montre qu'une partie de la
  largeur de l'image (`U.rogne`, comme en hauteur ; le combat rapproche les deux camps, `bx()`) ; les cartons tiennent
  entre les deux marges, les écrans aussi s'il leur reste 560 points (`body.pad-marges`) — sur un téléphone plus petit
  (640 × 360, 667 × 375), un écran prend toute la largeur et la manette s'y efface ; elle revient sur la scène. A est
  au-dessus de B, un peu à sa droite, pour que la marge reste étroite ;
- **partout**, si une page ne peut pas lui laisser la place (une seconde bulle sans trois lignes au-dessus de la bande, un
  texte qui déborde sur un tout petit écran), la manette s'y efface (`body.pad-efface`, regardé six fois par seconde :
  `U.padRecouvre`) plutôt que de recouvrir quoi que ce soit, et revient dès que la place est libre. Masquée au choix du
  joueur (Réglages, « Manette tactile », `opts.joy`), elle n'est plus là du tout et ne garde aucune place.

**Courir** (2.16 ; demande du décideur, 19 novembre : « il faut que les personnages puissent courir » ; 2.17 : « pour
éviter tout mismatch, réserver le joystick + B pour courir ») : B tenu pendant que le joystick est poussé fait courir
(`pad`, `courir` : `I.input.course` vaut vrai tant que les deux sont tenus, en exploration seulement) — le cercle
s'éclaire (`.joy.court`) ; le joystick seul, même tiré au bord, fait marcher. Le premier appui sur B reste un appui :
il frappe ce qui est à portée, ou revient d'un cran hors de l'exploration. Au clavier, Maj tenue (`I.input.maj`, suivie à
part dans `base.js` : ce n'est l'action d'aucune touche, et Maj + Entrée valide toujours). Le double toucher sur la
scène ne fait plus courir (2.16 : il le faisait). La course va 1,225 fois plus vite que la marche (`W.VITESSE` 82 points par
seconde, `W.COURSE` ; 1,75 dans la 2.16 — le décideur, 19 novembre : « il va trop vite, diminue de 30 % ») ; elle a sa
propre foulée, dessinée (« Le mouvement »). Ce n'est pas une décision mais une allure : aucune
leçon ne l'apprend (`lecons.js` n'en sait rien) ; la ligne du réglage « Manette tactile » et l'aide « Se déplacer, agir »
le disent. Le chrono des labyrinthes compte le temps, pas le chemin : la course ne le presse pas ; elle ne change ni ce
qui rôde ni les combats.

Contrôles : `manette.js` (au doigt, avec les vrais boutons de la manette seulement, en hauteur, en largeur et sur un petit
téléphone : l'écran-titre et ses réglages, B qui n'ouvre pas la halte en exploration, la halte ouverte par ☰ puis menée
au joystick, A et B, un dialogue passé par A puis par B, une liste de choix — B qui ne fait rien, puis qui prend le
« retour » —, un carton, le combat — A sur « Frapper », B qui revient du choix de la cible, le joystick qui change de
cible, A qui frappe —, B qui frappe ce qui rôde dans un labyrinthe ; à chaque état, la manette ne recouvre rien
— rectangles comparés — et la sélection se voit — contraste mesuré sur la capture : « MANETTE CONFORME », sinon
« INACCESSIBLE », « RECOUVERT », « INVISIBLE », « ÉCART »), `descente.js` (A et B, B qui s'éclaire, le pouce sur B,
téléphone en hauteur et en largeur ; Maj au clavier : on court, et le chrono court au même pas) et `doigt.js` (le joystick
fait marcher dans les quatre directions ; lâché, on s'arrête ; au bord, on court plus d'une fois et demie plus vite qu'à
la marche ; au milieu, on marche).

## La définition du dessin : `src/core/gfx.js`

*Depuis le 16 novembre (D154). Le décideur : « je n'aime pas le rendu pixelisé ».*

Le jeu se pense en **points logiques** : une scène de 384 × 216, des cases de 16. `gfx.D` dit combien de points réels en
fait un — 1, le dessin d'origine (celui de la 1.32) ; 2, un dessin deux fois plus fin, sur 768 × 432. Le code du jeu ne
change pas de repère : positions, collisions, cartes, tout reste en points logiques.

- **Une toile fine** (`gfx.toile(l, h)`) a `D` fois plus de points que sa taille logique ; elle porte sa définition
  (`toile.hd`), et son contexte dessine en points logiques. `drawImage` y pose une autre toile à sa taille logique, quelle
  que soit sa définition : le code qui dessine n'a pas à le savoir. La scène (`gfx.pcv`), la carte cuite d'un lieu, le fond
  d'un combat, le fond du titre sont des toiles fines.
- **Ce qui est tracé au trait** (égrégores, palmes, tentes, ombres, grilles de la noosphère) gagne tout seul : ses courbes
  ont deux fois plus de points.
- **Les cases** (`gfx.tile`) : un trait d'un point se trace d'un demi-point (joints, lattes, reflets), le semis d'une
  matière est trois fois plus serré, et un grain léger casse les aplats. **Les objets** (`gfx.obj`) : leurs escaliers sont
  arrondis (la règle d'EPX, appliquée aux pavés unis) et leur bord est encré d'un point réel.
- **Les lisières** (`maps.js`, `lisieres`) : deux sols naturels qui se touchent ne se coupent plus au cordeau ; le plus
  haut (herbe, puis chemin, puis dune, puis sable) déborde sur l'autre d'une frange irrégulière. Le sol reste le même case
  par case : seule l'image change.
- **Les personnages** : sur les cartes, le grand personnage (32 × 48) remplace le petit — un point de gabarit pour un point
  réel ; en combat et dans les menus, il est retracé en 64 × 96 (`grand(…, 2)`) : même composition, formes arrondies,
  liseré et lumière du voile deux fois plus fins. `gfx.planche`, `gfx.pose` et `gfx.figure` rendent le personnage à la
  définition courante ; `charSheet`, `charPose` et `charGrand` rendent toujours les dessins bruts, que les outils lisent.
- **La vue** glisse par demi-points ; plus de lignes de balayage ; un peu de poussière sous les pas, sur le sable.

**Le rendu doux** (choix du décideur, 19 novembre : « applique ce rendu partout » ; `G.doux`, `relief()`, `sprites.js`) :
en dessin fin (fin, et fin adouci), tous les grands personnages, à 32 × 48 comme à 64 × 96, ont un liseré dans un ton foncé
de la couleur qu'il borde (`outline(…, 0,5)`, au lieu d'une encre presque noire) et un relief : chaque matière, sa forme
adoucie, est éclairée d'en haut à gauche vers le chaud et ombrée en bas à droite vers le violet, par degrés — le bord,
puis le volume entier ; le bas du corps un peu plus sombre ; une étoffe claire s'ombre moins. Le voile n'est jamais touché
(la lumière d'un Compagnon reste une seule surface, trois tons au plus ; un visage garde son dessin), ni le néon, ni les
objets. Le dessin d'origine, les petits personnages et le grand sprite d'avant (`gfx.natif = false`) gardent le leur.
`G.doux = false` rend le rendu d'avant, pour comparer.

**Trois dessins au choix du joueur** (Réglages, « Dessin » ; `gfx.DESSINS`, `gfx.definir`) : *fin* (par défaut), *fin,
adouci* (le même, l'agrandissement final lissé et les figures adoucies sans perdre leurs contours) et *d'origine*. Le
choix se garde avec les autres réglages (`opts.dessin`). Changer en cours de partie refait la carte et les planches de
marche (`gfx.surDefinition`) : rien d'autre ne bouge.

**Le dessin d'origine est celui de la 1.32** (il ne lui est plus comparé depuis son archivage) : tout ce qui précède est
conditionné à `D > 1`. `?def=1` dans l'adresse force ce dessin (`?def=2`, `?def=2l` les deux autres) et passe avant le
réglage gardé. Une carte fine pèse quatre fois plus : le jeu en garde deux en mémoire au lieu de
quatre. Sur un ordinateur, le dessin fin est agrandi deux fois, pixels nets (ou lissé, en « fin, adouci ») ; sur un écran
tactile, il est composé à sa taille — 768 × 432, moins de points qu'avant — et c'est l'écran qui l'agrandit : en
simulation, le jeu y tient 60 images par seconde, comme le dessin d'origine.

**Ce qui n'est pas fait** : les objets et les cases restent ceux d'avant, affinés par le calcul — seul le palmier a été
redessiné ; les compagnons de lumière, les lames et les icônes gardent leur dessin. Aucune image générée n'entre dans le
jeu (D153).

### L'image agrandie, les textes sur un téléphone

*Demande du décideur, le 16 novembre : « les personnages et les textes sont trop petits dans mon téléphone, il faut
pouvoir zoomer dans l'image » (D167, D168).*

Sur un téléphone tenu en hauteur, la scène fait 390 points de large : un personnage de 16 × 24 points logiques n'y
occupait que 26 × 40 points d'écran. Deux réponses, dans `ui.js` et `style.css`.

- **L'agrandissement** (`U.zf`, de 1 à 3). Pendant l'exploration seulement, la scène ne montre qu'une part de l'image,
  agrandie d'autant, autour de celui qui mène : `layout()` calcule l'échelle (`U.base`, points d'écran par point
  logique ; `U.Z`, l'agrandissement en cours ; `U.scale`, leur produit) et la **fenêtre visible** `G.view` — `x`, `y`,
  `w`, `h`, en points logiques dans l'image de 384 × 216. `world.js` (`updateCam`) la fait suivre le héros dans les deux
  sens, la tourne vers celui qui parle et l'arrête aux bords de la carte ; la boucle d'affichage glisse et agrandit le
  canevas par une transformation (`translate … scale`), ses points restant nets. Le jeu ne dessine rien de plus : il
  montre moins, en plus grand.
- **Les gestes.** Deux doigts qui s'écartent sur l'image (`pointer()` : le premier doigt cesse alors d'être un toucher,
  personne ne marche) ; la molette ; le bouton « × » en haut de la scène, qui fait le tour de `U.ZOOMS` ; le réglage
  « Image », à l'écran-titre et à la halte. `U.zoomer(z, garder)` est le seul point d'entrée : il borne, arrondit, garde
  (`opts.zoom`) et remet en page. **Sans choix du joueur**, la grandeur est d'office : × 1,5 sur un écran tactile tenu
  en hauteur, × 1,25 en largeur, × 1 ailleurs — et elle suit le téléphone que l'on tourne.
- **Ce qui se pose sur la scène** passe par la fenêtre et par `U.scale` : les étiquettes de noms (`U.noms`), le plan (dans
  le coin de ce que l'on voit ; il ne grossit que d'un quart en hauteur, pas du tout en largeur, où le pouce passe à côté
  pour marcher), la flèche d'objectif (au bord de ce que l'on voit), la vignette. Le toucher n'a rien à savoir : il lit
  la boîte du canevas, transformation comprise (`getBoundingClientRect`).
- **Le combat garde son cadrage** (`U.Z = 1` hors de l'exploration) : son tableau est fixe, les deux camps déjà
  rapprochés sur un écran étroit (`bx()`).
- **En largeur, sur un écran tactile**, la manette prend les deux marges de l'image : la scène garde sa hauteur et ne
  montre qu'une partie de la largeur (`U.rogne`), comme en hauteur ; l'agrandissement s'y ajoute (« La manette tactile »).
- **Les textes.** « Texte » a quatre crans (`U.TZ` : normal, grand, très grand, géant) ; sans choix du joueur, « grand »
  sur un écran tactile. Un téléphone tenu en largeur suit lui aussi ce réglage (il l'ignorait). Sur un écran tactile
  (`body.touch`), les plus petits textes ont un plancher : noms, sous-titres, plaques et ordre des tours du combat,
  nombres des barres, cadran des étoiles — aucun sous dix points. Une liste de choix qui déborderait de l'écran resserre
  ses caractères, cran par cran, sans descendre sous « normal » (`S.ajuster`, `script.js`). À la halte, un titre long
  passe à la ligne ; l'écran-titre d'un téléphone en largeur range ses réglages sur deux colonnes.

`node v2/tools/loupe.js` le prouve sur un téléphone, en hauteur puis en largeur, par les vrais gestes (le pincement est
envoyé comme deux doigts) : la grandeur d'office, le pincement dans les deux sens sans que personne marche, le tour du
bouton, un toucher qui mène à la case touchée à × 2, les étiquettes sur leurs personnages, le combat à × 1 et le retour
à la grandeur choisie, le réglage gardé d'une page à l'autre, et aucun texte sous dix points à l'écran-titre, sur la
carte, dans un dialogue, en combat et à la halte : « LOUPE CONFORME ». `doigt.js` rejoue ensuite le début du jeu avec
l'image agrandie.

### Les messages du combat, en bas (2.17)

*Demande du décideur, le 19 novembre, devant la 2.16, capture à l'appui (en combat dans la Cité, au téléphone, le bandeau
« Frappe la faille pour retirer ses voiles ⛊. « Éclairer » porte la Patience d'Idris. » posé au milieu de la scène, sur
le nom de la chimère et sur Idris) : « Les messages au moment du combat doivent être en bas pas sur les personnages. »*

Le bandeau du combat (`#battle .banner`, `battle.js`, `banner`) n'est plus posé sur la scène : il est **dans le panneau**
(`page.html`), dans la case des commandes (`grid-area: cmd`), par-dessus elles le temps qu'il dure. En hauteur, cette case
est sous les rangées du groupe, hors de la scène ; en largeur et au bureau, au pied de la scène, à droite, sous les
combattants. Le panneau garde sa place : rien ne bouge quand un message paraît. Ce qui en découle :

- **`placer(b)`**, à chaque message (et quand l'écran tourne, `B.relayout`). En largeur, si le bandeau montait jusqu'à
  une figure — ou jusqu'au champ d'une bataille déclarée, le temps d'un ordre ou d'un pas —, il prend toute la largeur
  du panneau (`.large`, par-dessus les rangées du groupe), puis resserre ses caractères, cran par cran, jamais sous 10,5
  points. En hauteur, il tient dans l'écran, et défile au-delà. Les figures sont celles de `B.boites()` : le rectangle de
  chaque héros (debout ou éprouvé), de chaque chimère avec son souffle, du compagnon de lumière ; le champ quand il
  remplace la scène.
- **Le toucher.** Un message qui attend (`wait` : l'introduction, la parole d'une chimère, la victoire) prend le toucher
  et montre ▼ (`.attend`) ; les autres le laissent passer aux commandes qu'ils couvrent un instant (`pointer-events`).
  Un message qui passe ne recouvre pas un message qui attend.
- **Le sens d'écriture.** Le bandeau prend celui de son texte (`I.langue.sens`), et ▼ passe à gauche en arabe ; la scène
  et le panneau, eux, ne se retournent pas. Un guillemet ne reste pas seul au bout d'une ligne (l'espace qui le touche
  devient insécable, à l'affichage seulement).
- **La largeur.** Les colonnes du panneau peuvent descendre sous la largeur de leur contenu (`minmax(0, …)`) : une
  commande trop longue (en arabe, en 360 × 640, « sans perdre son tour » du stratège) n'élargit plus le panneau au-delà de
  l'écran, et le bandeau qui partage sa case reste entier.
- **La manette.** Rien n'est posé sous le panneau ni dans les marges : la manette A/B pourra y rester en combat.

Inventaire de ce qui s'écrit pendant un combat, où c'était en 2.16 et où c'est maintenant :

| Ce qui s'écrit | Où c'était (2.16) | Où c'est (2.17) |
|---|---|---|
| L'introduction d'un combat (`intro` du récit), « {nom} se dresse. », « Une emprise se referme… » | bandeau au milieu de la scène (24 % et 11 % de sa hauteur) | en bas ; l'introduction attend un toucher, ▼ |
| L'épreuve du cœur, la lame (« Sans sa lame », « … tranche ses voiles »), le compagnon de lumière, un renfort, le Phénix | bandeau à 20–24 % | en bas |
| L'annonce d'une vertu, de la Sérénité, d'un objet ; l'action d'une chimère (« Assaut »…), son défi (`taunts`) | bandeau à 11 %, sur la frise et les plaques | en bas |
| La parole d'une chimère à un seuil (`phases.say`, la plus longue : 157 signes) | bandeau à 20 %, attend | en bas, attend |
| « La besace est vide. », « Personne n'en a besoin. » | bandeau à 11 % | en bas, sur la case des commandes, sans en prendre le toucher |
| Le dévoilement (« DÉVOILÉ »), un mal tranché ou repoussé (« TRANCHÉ », « Repoussé ») | un grand mot qui montait du corps de la chimère | un message du bas, le nom au-dessus (`devoile` ; ceux qui tombent ensemble sur la même ligne) ; la plaque dit toujours « DÉVOILÉ » |
| La victoire (« Dévoilement », « Tranché », « Repoussé », « La chimère lâche prise ») et ce qu'elle rapporte | carton plein écran, sur toute la scène | message du bas, les héros debout à la vue (`.fin`) ; il attend un toucher, ou cinq secondes au moins |
| La défaite (« La chaîne ne rompt pas »), la remontée de la noosphère intérieure | carton plein écran | **inchangé** : la tentative s'arrête, le combat reprend ensuite ; les outils comptent les défaites par ce carton (`S.card('defeat')`) |
| Le secours : la première fois, le carton du verset ; ensuite, un bandeau | carton plein écran ; bandeau à 24 % | carton **inchangé** (un verset et sa référence, exigence 20) ; le bandeau en bas |
| La bataille déclarée : « Une nuée a percé… », « Flanc découvert… », « Aucun rang à ordonner… », « Aucune case libre… », un renfort sur le champ (`rangs.js`, `api.banner`) | bandeau à 56,5 % (largeur), 4 % (hauteur) | en bas, sous le champ |
| La leçon d'une commande nouvelle (`L.banniere`, `.mlecon`), « Choisis une cible… », titre et description des commandes | dans le panneau (depuis la 2.12) | inchangé |
| Les chiffres (dégâts, soins, « +Souffle ») et les petits mots d'état sur une cible (« Garde », « Étourdi », « Paré », « Sans effet », « Coup double », « +Niyya », « Force ▼ », « Voile ôté », « Se revoile », « Relevé », « Éprouvé », « Faille flairée »…) | sur la cible | **inchangé** : ils désignent leur cible. *Doute, à trancher par le décideur : ce sont des mots, posés un instant sur la figure.* |
| Les mots du champ (« En tenaille », « De flanc », « Charge », « Dissipée », l'ordre donné ; « DÉVOILÉ » et « Voile ôté » sur l'idole) | sur l'unité du champ | inchangé : ils désignent l'unité |
| La préparation d'une bataille | une page de la halte, avant le combat | inchangé |
| Le fil (`S.toast`) | se tait en combat (D189) ; seul un incident technique passe outre | inchangé |
| La langue secondaire | aucune en combat (ni menus, ni choix, ni combat) | inchangé |

**Le contrôle** (`node v2/tools/loupe.js`, le 7 ; `node v2/tools/loupe.js messages` pour lui seul). En 390 × 844,
390 × 760, 360 × 640 et 844 × 390, en français puis en arabe : un vrai combat de la Cité dans une partie neuve, par ses
boutons (l'introduction de la capture du décideur, la leçon de « Vertus », l'annonce d'une vertu, le dévoilement, la
victoire) ; puis, posés comme le jeu les pose (`B.dire`), les autres bandeaux avec leurs vrais textes (la plus longue
parole d'une chimère, la Sérénité, une chimère qui agit, l'épreuve du cœur, le secours, la besace vide) ; enfin un vrai
combat d'idole de Yarmoûk, son champ à l'écran et le bandeau d'un flanc découvert. Chaque message est relevé au moment
où il paraît : son rectangle ne coupe ni une figure, ni une plaque (le nom, la jauge de voiles), ni la frise des tours, ni
le champ — sinon « RECOUVERT » ; il est dans l'écran, entier, sur un fond qui le porte, sans texte sous dix points —
sinon « INVISIBLE ». Sur la 2.16 (`JEU=… node v2/tools/loupe.js messages`), il échoue vingt-sept fois : dans les huit
écrans, l'introduction couvre la plaque de « Notification » (en hauteur, aussi la chimère et Idris), « DÉVOILÉ » la
chimère, le carton de la victoire Idris et la frise des tours ; en 360 × 640, l'annonce d'une vertu couvre la frise, et
le bandeau d'un flanc découvert le champ (ce que la 2.16 ne pouvait poser sans `B.dire` n'y est pas éprouvé). Sur la
2.17, les quatre-vingt-seize relevés passent.

**Les films.** Les shorts qui filment un combat (son introduction, une annonce, le dévoilement, la victoire) et la démo
jouable changent : à refaire avec les autres, une seule fois.

## Un texte à la fois : le fil, la marque, les leçons à leur place

*Décision du décideur, 18 novembre (D189 ; le cahier des charges est `v2/docs/propositions-texte.md`) : « essaye de ne pas
surcharger l'écran surtout au téléphone » — « la surcharge de l'écran : je parle du texte ». Lots 1 et 2, version 2.12.*

Une seule chose se lit à la fois : une réplique, un choix, un carton ou une page de la halte, jamais deux. Aucun texte de
récit n'est coupé ni réécrit — `src/data/` n'a pas changé d'un mot ; seuls la place et le moment des textes du moteur
changent. *Une exception, au choix du joueur seulement : la langue secondaire (19 novembre), qui pose sous une réplique,
un carton du récit ou une ligne du fil la même chose dans une autre langue — « La langue secondaire », plus bas.*

- **Le fil** (`script.js`, `S.toast`). Les annonces ne se posent plus sur l'image : elles passent dans le fil, une ligne
  qui ne parle que lorsque rien d'autre ne se lit — ni `#dialog`, ni `#choice`, ni `#card`, ni écran (la halte, la
  Chaîne), ni combat, ni fondu au-dessus de 0,5 — et que le joueur a la main (`S.busy`, `W.lock`).
  - Chaque annonce entre dans `#toasts` **à sa naissance, masquée**, et n'y est jamais réinsérée : `progression.js` et
    `personnage.js` la lisent comme avant (le premier y compte les naissances, le second ce qui se voit).
  - Le fil en montre une à la fois ; celles qui naissent dans la même demi-seconde se montrent sur la même ligne,
    séparées par « · », si la ligne tient — mesuré à l'écran (`offsetHeight`), pas en comptant les signes. Chacune
    reste `S.lecture(html)` : 1,2 s plus 45 ms par signe pesé (`I.langue.poids` : en japonais, un signe pèse 2,2), entre
    1,8 et 5 s. Une ligne interrompue par une lecture reprend ensuite, au moins 1,2 s.
  - Trois annonces au plus attendent leur tour ; au-delà, les plus anciennes sont retirées (celles nées dans la même
    demi-seconde passent ensemble). Rien ne se perd : `S.fil` garde les douze dernières lignes, en mémoire seulement —
    jamais dans la partie, dont le format ne change pas.
  - L'incident (`I.onError`) et la sauvegarde refusée passent outre (`{ urgent: true }`) : tout de suite, même pendant
    une lecture. Une annonce née dans la halte s'écrit sous son titre (`S.filHalte`, `#menu header .dit`).
  - Le combat ne vide plus `#toasts` : le fil s'y tait, et ce qui y attend passe après. La Chaîne, elle, vide la file
    (`S.filVide`) : le récit est quitté.
- **Sa place** (`style.css`). En hauteur, sous l'en-tête (ou la barre de « Bâtir »), dans la bande noire : `S.filPlace`
  pose la hauteur de ce qui est au-dessus dans `--fil-haut` (appelé par `W.hud` et à chaque battement du fil). Il ne
  réserve aucune place : aucune boîte ne bouge quand il parle. En largeur et au bureau, en haut à droite, sous le plan
  (`--mini`), sur une ligne (deux au plus pour une annonce longue, que le relevé signale). Il ne prend aucun toucher
  (`pointer-events: none`). Une leçon s'y reconnaît à son filet violet.
- **La marque** (`script.js`, `S.marque`, `showLine`). Ce qui répond au geste du joueur se lit là où il regarde :
  `S.marque(html)` est pris par la réplique ou la narration qui suit, et s'écrit après le nom (`span.marque` :
  « Ancien du Fort des Oliviers · Confiance +2 », « La Chaîne · Un voile tombe »). Si aucune boîte ne suit — un choix,
  un carton, la fin du récit (`S.hideDialog`), ou au bout d'une seconde et demie —, la marque passe au fil. `runParley`
  et `mal.js` (`dissiper`) marquent au lieu d'annoncer, avec les clés d'aujourd'hui. Les shorts la masquent avec les
  annonces (`shorts.js`, classe `f-annonces`).
- **Le verdict de la Chaîne** (`exec('choice')`). Le choix fait, la Chaîne dit elle-même son verdict, seule, en une ligne
  de narration au nom de « La Chaîne » (`showLine('nar', …, { nom, html, duree })`), le temps de la lire (`S.lecture`) ou
  d'un toucher ; puis la suite du récit (`o.r`) : la réplique, la parole citée ou la narration, sans rien au-dessus.
  Jamais sur la parole de quelqu'un, ni au-dessus d'une parole citée (exigence 3). Les clés sont celles d'aujourd'hui.
- **Les leçons à leur place** (`lecons.js`). Une leçon ne se dit toujours que par `I.lecons.proposer`, une par séquence ;
  seul change l'endroit où elle s'écrit, là où sert l'outil, et elle reste jusqu'au geste.
  - En marchant : `dit` pose une ligne de fil marquée de son outil (`{ outil }`) ; `reemploi` la retire dès que le geste
    est fait (même dans la séquence où elle a été dite) ; `sequence` retire celles qui ont déjà été lues ; trente
    secondes de lecture au plus. La figure qui s'ouvre (`postures.js`) et « frapper ce qui rôde » (`rodeurs.js`) aussi.
    Les annonces passent avant une leçon, qui revient ensuite.
  - Dans un choix : `L.texte('source')` donne la leçon, qu'`exec('choice')` écrit sous la question
    (`small.lecon`), tant que le choix est ouvert. Elle n'entre plus dans `#toasts`.
  - En combat : `L.banniere` donne le texte, que `battle.js` écrit dans le panneau, sous les commandes (`.mlecon`) ; la
    commande nouvelle est cerclée (`.mi.neuf`) jusqu'à ce qu'on s'en serve. Plus de bandeau qui attend un toucher.
- **La règle d'une descente** (`rodeurs.js`, `entrer`) est une ligne de fil (`{ pas: true }`) qui passe la première et
  reste jusqu'au premier pas (lue au moins 1,2 s), trente secondes au plus. Les textes ne changent pas (exigences 22 et
  23) ; le chrono reste sur l'image, et plus rien ne le couvre.
- **Le menu d'une idée noire** (`mal.js`, `dissiper`). L'en-tête est resserré sur une ligne (`.phead.court`, l'image de
  1,7 em, le nom, « une idée noire : on lui répond », les voiles) ; ce qu'elle vient de dire tient lieu d'invite
  (`.prompt.dit`, en petit) ; les trois réponses restent entières. Le carton et son rappel ne changent pas.
- **La liste d'un pourparler** (`runParley`, lot 2). Elle garde la question de l'interlocuteur, qui tient lieu de « Que
  réponds-tu ? » (`.prompt.dit`) ; l'en-tête tient en deux lignes — le titre et « manche {manche} / {total} », puis la
  confiance (`.phead.court.manche`) ; le nom de l'interlocuteur n'y est plus, puisqu'il vient de parler.
- **Une liste qui défile** (`menuPick`, `repere`). Après `S.ajuster`, si la liste déborde encore, une ligne « ▾ encore
  {n} réponses » reste au bas de la boîte (collée, `position: sticky`) tant que la dernière réponse n'est pas entière à
  l'écran — une réponse compte quand son texte finit au-dessus du repère. Elle ne prend aucun toucher. `S.refaire(box)`
  la refait quand la boîte change.
- **« Que faire ? »** (`ui.js`, `U.guideLines` → `{ lignes, suite }`, `U.guide`). Trois lignes : l'objectif, le geste
  (ou l'indice du récit), la direction ; une quatrième si elle presse (le groupe est éprouvé, ou l'épreuve pèse plus
  que la provision du cœur). « ▸ La suite » (un bouton dans la boîte, non une option ; au clavier, H de nouveau) déplie
  le reste au même endroit : le geste quand l'indice l'a remplacé, le poids de l'épreuve quand le cœur est prêt, la
  prière avant l'épreuve, le mal du cœur qui attend, l'énigme, la pièce à porter.
- **L'en-tête.** Sur un téléphone en largeur (`orientation: landscape` et `max-height: 480px`), il ne garde que
  l'objectif et les piliers — le chapitre et la date se lisent à la halte (« Reprendre ») et sur le carton de chaque
  lieu — et se retire pendant une lecture (`in-dialog`), comme en hauteur. Au bureau, il reste. Sous un carton, il se
  masque, avec le fil (`card()` pose `en-carton` sur `body`) : en hauteur, il transparaissait sous le texte.
- **L'arabe.** La scène (`#stage`, `#cv`) reste de gauche à droite, mais chaque ligne qui s'y pose prend le sens de sa
  langue : `I.langue.sens(texte)` rend `rtl` pour un texte en lettres arabes (en arabe), `ltr` pour le français de repli
  d'un texte encore à écrire — `dir="auto"` se tromperait sur une phrase arabe qui commence par le nom latin choisi par
  le joueur. Concernés : le nom et le texte d'une réplique, l'en-tête et l'invite d'un choix, chaque option, les lignes
  de l'en-tête (`W.hud`), chaque annonce, le repère. `text-align: start` remplace `left` dans les choix ; la silhouette
  de celui qui parle suit son sceau, à droite. Les grilles du combat ne se retournent pas.
- **Le combat sur un petit écran** (`style.css`, `@media (max-height: 700px)` en hauteur — le seuil de 600 points du lot
  1 est monté à 700 au lot 2 : il couvre l'écran des shorts, 360 × 640). Chaque compagnon tient sur une ligne : son
  nom, sa Constance et son Souffle côte à côte ; le niveau et la figure passent en tête des commandes de celui dont
  c'est le tour (`.mtitle .niv`). Les cinq commandes et la leçon tiennent dans l'écran en 360 × 560 ; `doigt.js` le
  vérifie. Une bataille déclarée, la Sérénité pleine, en a sept (« Ordonner », et la Sérénité) : la Sérénité, seule sur
  sa rangée, en prend toute la largeur (`.mi.seul`), et si le panneau dépasse encore le bas de l'écran, ses commandes se
  resserrent cran par cran, jamais sous la taille « normal » (`battle.js`, `tenir`, comme `S.ajuster` pour un choix) :
  en 2.12 avant ce correctif, la Sérénité tombait sous l'écran en 360 × 560 et à moitié dehors en 360 × 640.
- **Les noms** (`ui.js`, `U.noms`). Les étiquettes se posent par la fenêtre visible (`G.view`, `U.scale`), puis dans
  l'ordre — la cible, les plus proches, celui qui mène, puis les siens ; une étiquette qui en recouvrirait une autre
  ne s'affiche pas (`.nom.cache`). Au départ d'un chapitre, les noms du groupe ne s'empilent plus.
- **La halte** (`ui.js`, `U.pause`). Le compte du Recueil ne retient que ce qui se lit
  (`sv.codex.map(U.codexEntry).filter(Boolean)` : les idées noires vaincues dans la descente du râwî n'ont pas de
  page). « Reprendre » relit le fil, sous « Ce qui vient d'être dit ». L'ordre de la liste ne change pas : « Reprendre »
  reste en premier, et le Recueil garde son nom (le Journal viendra avec D191).
- **Les cartons de pourparler et d'idée noire** (lot 2) : leur introduction passe en casse ordinaire, mêmes mots
  (`#card.title.parley p:not(.small)`) ; les titres de lieu (`#card.title p`) et les surtitres de trois mots au plus
  (« POURPARLER », « UNE IDÉE NOIRE ») ne changent pas.
- **Le nom d'une narration** ne descend pas sous 10,5 points sur un écran tactile, en largeur non plus.
- **Le relevé des longueurs** (`node v2/tools/longueurs.js [langue…]`) : un rapport, jamais un blocage. Il rend chaque
  texte de l'interface qui passe par le fil (les annonces et les marques lues dans le code, les leçons, les consignes
  du labyrinthe) dans le fil lui-même, en 390 × 844, texte « grand », dans les quatre langues, et écrit « À REPRENDRE »
  quand une annonce dépasse une ligne ou une leçon une phrase ; il ouvre les deux menus par le vrai récit, en 390 × 844
  et en 360 × 560 (le menu d'une idée noire en japonais, qui coupait sa troisième manière, est un cas suivi) ; il liste
  pour le décideur les répliques et narrations de plus de six lignes. Puis « LONGUEURS RELEVÉES » ; le détail dans
  `.smoke/longueurs/`. Seul le décideur corrige le français, et chaque langue le suit texte par texte (exigence 25).
- **Les contrôles.** `doigt.js` touche sous une réplique, dans la bande noire, où le fil, masqué, ne prend aucun toucher ;
  la ligne du verdict s'y passe comme une réplique ; il vérifie à chaque tour de combat que chaque commande est dans
  l'écran et sous le doigt, puis, à chaque écran (sauf avec « loin »), un combat où tout est reçu, avec le groupe de
  trois de Khâlid : les cinq commandes (en 2.11, en 360 × 560, Vertus, Objets et Garde y tombaient hors de l'écran), puis
  sa bataille déclarée, la Sérénité pleine : les sept. `loupe.js` vérifie qu'une annonce posée quand la main est libre se montre aussitôt dans le
  fil, ses petits textes à 10,5 points au moins, et le nom d'une narration, en hauteur et en largeur. `progression.js`
  ne valide plus à l'aveugle pendant le bandeau d'ouverture d'un combat (il n'attend pas : un « Entrée » tombé au moment
  où les commandes s'ouvrent choisissait « Frapper » à la place du joueur, depuis que la leçon n'est plus un bandeau).
- **Les films.** Les shorts dont une scène filmée change sont à refaire (D189 : le décideur l'a permis) : le 04 (le
  carton du pourparler en casse ordinaire, sa liste avec la question et l'en-tête en deux lignes, « · manche 1 / 3 »
  d'un seul tenant) et le 08 (le panneau de commandes de la bataille déclarée, plus serré en 360 × 640, le niveau et la
  figure en tête des commandes ; les rangées des compagnons, elles, ne s'y voient pas : le short les masque). Vérifié à
  la relecture en filmant chaque short deux fois en brouillon, sur la 2.11 et sur la 2.12, image par image, et une
  troisième fois sur la 2.11 pour mesurer ce qui change d'une prise à l'autre : le 10, qui montre les noms, ne change
  pas ; les 07 et 09 sont identiques. Ailleurs, rien que d'infime : dans la 2.11, une annonce qui entrait en glissant
  faisait déborder l'écran d'un instant, et ce qui apparaissait à ce moment — les légendes du film, au 11 le carton du
  seuil — se décalait de quatre points pendant son fondu (01, 02, 05, 06, 10 à 14, 16) — la 2.12 ne le fait plus ; au 01, la narration des
  Archives basses s'écrit un battement plus tard. Les combats joués seuls (03, 06, 12 à 16) et ce qui rôde (05, 11)
  changent d'une prise à l'autre sur un même jeu : ce n'est pas la 2.12. Les autres masquent le fil et la marque avec
  les annonces, et ne filment ni un acte de la Chaîne, ni une leçon, ni « Que faire ? », ni la halte, ni le menu d'une
  idée noire. La démo jouable et le livret court suivent au prochain assemblage (`jouable.js essai`, `livret.js`) : dans
  la démo, la leçon « frapper ce qui rôde » et les annonces du labyrinthe passent de l'image au fil.

## Les labyrinthes de la noosphère : `src/core/dedale.js`

*Lot N0 (D155). Le module ne dessine rien et ne connaît pas le jeu : il tire un plan et sait dire s'il est bon.*

`plan(hasard, profondeur, genre)` rend une carte de 60 × 40 cases (vide, pont, sol de salle, sol d'abri), ses lieux
nommés et de quoi mesurer sa complexité. Les salles sont posées sur une maille — de 6 cases à la profondeur 0 à 3 cases à
la profondeur 5 —, chacune dans sa zone : le seuil à l'ouest, le cœur à l'est, un nœud au nord, un au sud, la faille et le
miroir en cul-de-sac (`genre` « chapitre ») ; ou le seuil, l'issue et deux abris (`genre` « descente »). Un arbre relie
tous les carrefours, une salle y comptant pour un seul nœud ; quelques impasses sont percées en raccourcis, de moins en
moins quand on descend. `verifie(plan, genre)` contrôle que les lieux y sont, du bon côté, assez grands, tous reliés, et
que les culs-de-sac en sont ; `plan` retire jusqu'à obtenir un plan bon. La même suite de hasard rend le même plan.
`node v2/tools/dedales.js` l'éprouve sur dix mille graines par profondeur et par genre (« DÉDALES CONFORMES »).

**Dans les chapitres** (lots N1 et N2, `rodeurs.js`). Quand un récit dit « on descend » — l'opération `map` vers un lieu de
gabarit `noos` —, le lieu reçoit une graine (`g`) et une profondeur (`n`, de 0 à 5 : la part de l'histoire déjà achevée) :
`maps.js` le bâtit alors d'après le plan, ponts bordés de lumière, salles et pylônes, un lieu nommé au milieu de chaque
salle. La graine voyage avec le lieu, donc avec le point de reprise : reprendre une partie redonne le même labyrinthe. Un
lieu sans graine se bâtit comme avant (une partie gardée avant la 2.x le retrouve tel quel). Les récits ne changent pas d'un mot : ennemis, coffres et personnages se placent sur les mêmes lieux nommés.
**Le chrono** : 30 secondes, plus le temps d'un tour de tous les lieux multiplié par un facteur qui se resserre (de 3
à 1,7). Il ne court que lorsque le joueur a la main (`world.js` l'appelle à chaque pas) ; écoulé, on remonte au seuil, le
labyrinthe se redessine un cran plus simple, ennemis et coffres retrouvent leurs lieux, rien n'est perdu. La graine vient
d'un sel propre à la partie et d'un compte des descentes (`dedale` dans la partie : un champ absent prend sa valeur de
départ, le format reste le 2). **Au doigt**, toucher le vide en direction de l'objectif demande d'y être conduit (la même
aide que « M'y conduire ») : sans cela, on irait buter au fond de l'impasse la plus proche de l'objectif.

**La descente du râwî** (lot N3). Au sortir de la prière, dans le dhikr, en songe, `valeurs.porte` propose de descendre ;
la descente commence dès que le joueur a la main. Elle se joue dans le moteur des cartes, **entre deux points de
reprise** : celui d'avant est gardé, le monde reçoit un récit d'un seul chapitre sans objectif (`world.excursion`), et
l'on revient au récit par ce point de reprise, comme on reprend une partie. Pendant ce temps aucun point de reprise n'est
écrit, et la halte est fermée. Le lieu est le labyrinthe de genre « descente » : le seuil, l'issue, deux abris. Ceux qui
rôdent — tour à tour un mal du cœur encore debout, une idée noire — errent de case en case, prennent en chasse à moins de
seize cases, et n'entrent jamais dans un abri : les maux du cœur partent des carrefours les plus lointains, les idées
noires sortent de la pièce interdite, l'une après l'autre (voir plus bas) ; ils sont de 2 à 5 et vont de
0,55 à 0,92 fois le pas du râwî. Quatre issues : **l'issue** (un niveau, une fois par chapitre, puis de l'expérience) ;
**un abri** jusqu'à la fin du chrono (+1 d'Esprit, +2 de Souffle pour de bon, dix fois au plus ; Entrée, ou toucher son
personnage, laisse passer le temps) ; **le temps écoulé** hors d'un abri (on remonte, rien n'est perdu) ; **rattrapé**
(on remonte épuisé : les portes restent closes jusqu'à un sommeil sans songe). Armé d'une lame forgée — la sienne pour un
mal du cœur, n'importe laquelle pour une idée noire — **et** accompagné — un compagnon de lumière, ou le groupe de
fiction dans l'histoire-cadre —, le râwî fait face : un mal vaincu est tranché (`oeuvres.js`), une idée noire est
dissipée jusqu'au chapitre suivant. Le joueur de test entre, prend l'issue et revient : il n'y marche pas.

**Ce qui rôde, et la frappe** (lot C3, `rodeurs.js`). Dans un labyrinthe, « Valider » — ou un toucher sur ce qui rôde —
frappe devant soi : `R.frappe()`. L'arme est celle que porte celui qui mène (`gear.of(h).md`) ; son type règle le geste
(`D.FRAPPES` : `portee`, `large`, `cadence`, `sonne`, `recul`, `force`). Ce qui est touché est repoussé de case en case
dans le sens du coup, puis reste **sonné** : il ne bouge plus, et on le traverse sans contact. `world.js` n'appelle la
frappe que si quelque chose rôde à portée de vue (`R.aFrapper()`) : sinon « Valider » agit sur le décor, comme avant. Au
doigt, `R.viseDu()` : toucher ce qui rôde le frappe s'il est à portée, sinon y conduit puis frappe.
*Dans le labyrinthe d'un récit*, `poserMeutes()` pose à l'armement du lieu de 1 à 4 petits égrégores (`R.MEUTES`), tirés
parmi ceux de palier `minion` de la saga, sur des carrefours de ponts à plus de neuf cases du seuil et à l'écart les uns
des autres ; le tirage ne dépend que de la graine du lieu, donc une partie reprise les retrouve. Ils ne passent que par
les ponts (jamais une salle : les lieux que le récit nomme restent sûrs), errent, et ne prennent en chasse qu'à six
cases, à demi-pas. Chaque coup ôte un voile (`R.VOILES`, de 2 à 4) ; sans voile, l'égrégore se dissipe : le groupe
reçoit six dixièmes de l'expérience d'un combat, le Recueil le connaît, et un drapeau du chapitre (`_meute_<graine>_<i>`)
l'empêche de revenir. S'il rejoint le groupe sur un pont, c'est un combat ordinaire. Après une remontée au chrono, plus
rien ne rôde (`_meutes_off`) jusqu'à la prochaine descente que décide le récit : on ne revient pas chercher des combats
au chrono. *Dans la descente du râwî*, un coup sonne et repousse, rien de plus ; lame forgée en main et accompagné
(`R.peutFaireFace`), chaque coup entame une idée noire (`R.TENUE`, de 3 à 6) jusqu'à la dissiper — un mal du cœur, lui,
ne s'entame pas. La première fois que quelque chose approche, le jeu donne la leçon (« Frapper ce qui rôde », au
Recueil). `tools/descente.js`, section C, éprouve tout cela.

**La pièce interdite** (2.x ; demande du décideur, 19 novembre : « dans les labyrinthes je veux toujours une pièce
secrète interdite 🚫 toujours fermée où nul ne sait ce qui s'y trouve » ; « certains disent c'est un trésor, d'autres
disent que c'est un monstre, en tout cas c'est de là que sortent les idées noires » ; formulation et choix de l'agent, à
valider). Chaque labyrinthe en a une, ceux des chapitres comme la descente du râwî, à toute profondeur, plan de repli
compris.
- *Sa place* (`dedale.js`, `interdite(plan, genre)`, rangée dans `plan.interdite` : `porte`, `face`, `devant`, `salle`,
  `repli`, `petite`). Elle se choisit **après** le tirage, d'après le plan seul — un hachage de `g` départage les places
  également bonnes —, sans rien demander à la suite « hasard » et sans changer une case de `g` : pour une même graine, le
  labyrinthe est case pour case celui d'avant, et une partie reprise retrouve le même lieu (`tools/essais/dedales.json`
  garde les empreintes de 1 200 plans relevées avant elle). La porte est une case de vide bordée d'une seule case
  praticable, « devant », qui est un pont (jamais une salle nommée ni un abri) ; la pièce, un rectangle de vide derrière
  elle, d'une à quatre cases de profondeur et d'une à six de large, qui ne touche aucune case praticable et reste dans la
  carte. De préférence, la porte est au fond d'un cul-de-sac, à l'écart du seuil (plus d'un tiers de la plus grande
  distance), des lieux nommés (trois cases) et du chemin qui les relie : secrète par sa place. Dans une descente, elle est
  toujours à la moitié au moins de la plus grande distance au seuil, et ni elle ni la pièce ne touchent l'issue ni les
  abris. Les replis vont du fond d'un cul-de-sac au côté d'un cul-de-sac, puis au pourtour du dédale (la pièce dans la
  marge du plan, qui a toujours deux cases), puis à n'importe quel pont ; à la profondeur 5, la maille de trois cases ne
  laisse de place que dans la marge. Le relevé de dedales.js dit combien de fois chaque repli sert.
- *Son dessin* (`maps.js`, `interdite()`). Une image à part, refaite avec la carte (donc dans les trois dessins), posée
  sur le sol et sous les personnages (`R.dessinerPorte`, appelé par `world.render`) : la masse fermée de la pièce — un mur,
  un toit de tuiles et son faîte, sa face sud dans l'ombre, bordés d'une lueur rouge sombre —, et la porte, lourde, dans
  le mur qui regarde « devant » : montants de pierre, vantail de planches cerclé de fer, un seuil d'ombre ; tournée vers
  « devant » comme une porte de donjon vue de haut ; dessus, toujours droit, le signe d'interdit — un disque pâle, un cercle
  rouge, une barre du haut à gauche au bas à droite —, posé au point, sans lettre ni émoji ni symbole religieux. Une lueur
  rouge, faible, l'éclaire.
- *Toujours close.* La porte et la pièce sont du vide : rien ne les traverse, ni celui qui mène, ni ceux qui le suivent,
  ni ceux qui rôdent (`passable` ne connaît que les ponts et les salles), ni un saut de carte ou une marche de récit
  (`resolve` ne pose jamais personne sur une case pleine). Aucune suite du code ne l'ouvre ; rien n'y est rangé ; la partie
  n'en garde rien.
- *Ce qu'on en dit.* Personne ne sait ce qu'il y a derrière : on en parle par ouï-dire, quand celui qui mène s'y heurte
  (`R.heurte`, appelé par `world.js` quand un pas est refusé ; une fois, jusqu'à ce qu'on s'en éloigne) ou que le joueur la
  désigne — A ou Entrée devant elle (`R.faceAPorte`), ou un toucher sur la porte ou la pièce (`R.toucherPorte` : on y va,
  on la regarde). C'est une ligne du fil (`S.toast`, qui rend désormais sa ligne), le plus léger de ce qui se dit en jeu ;
  le chrono ne court pas pendant qu'elle s'affiche (`R.lit`, exigence 23). Deux phrases, propositions de l'agent à valider :
  dans la descente, « Une porte close. Certains disent qu'un trésor dort derrière ; d'autres, un monstre. Ce qui est sûr,
  c'est que les idées noires en sortent. » ; dans un chapitre, là où marchent des Compagnons, « … Nul ne sait. » — aucun
  texte n'y lie le lieu aux idées noires. Le trésor et le monstre ne sont que des rumeurs : jamais dessinés, nommés,
  comptés ni mis en scène. Vue de près (à trois cases et demie), la porte a son petit signe d'interdit sur la mini-carte et
  sur la Carte de la halte (`R.porteVue`, en mémoire seulement) ; la flèche d'objectif n'y mène jamais. Ce n'est pas un
  outil : ni leçon, ni message en début de chapitre.
- *D'où sortent les idées noires* (la descente du râwî seulement, `R.SORTIE`, `R.SORTIE_PAS`, `R.FUMEE`). À l'entrée, les
  idées noires qui ne sont pas dissipées ne sont pas sur les ponts : elles attendent derrière la porte, et sortent l'une
  après l'autre — la première après une seconde à une seconde et demie, puis une toutes les 9 à 4,5 secondes selon la
  profondeur. Une fumée sombre filtre d'abord sous la porte, qui reste close (une seconde et demie avant la sortie) ; puis l'idée noire paraît devant elle, avec le bruitage
  « dark », et rôde comme les autres : même allure, même frappe, mêmes règles. Elle attend tant que le râwî se tient
  devant la porte, ou qu'un autre rôdeur y est (la fumée continue de filtrer). Une idée noire dissipée l'est jusqu'au
  chapitre suivant et ne ressort pas. Les maux du cœur gardent leur place, loin du seuil. La noosphère est celle du râwî :
  les idées noires sortent de lui, aucun dehors ne les envoie (exigence 18) ; rien n'évoque Iblîs, un démon, un djinn ni
  un souffleur. *La cadence* a été mesurée (vingt-quatre labyrinthes : quatre graines, six profondeurs, deux
  répétitions ; le râwî marchant du seuil à l'issue, image par image, avec le vrai moteur) : avant, 21 descentes sur 48
  finissaient par un contact, au bout de 16,9 s en moyenne, et un rôdeur venait à six cases dans 24 sur 48 (16,1 s) ;
  avec les idées noires qui sortent de la porte, 24 sur 48, au bout de 17,7 s, et 31 sur 48 (17,4 s). Le râwî qui reste
  au seuil n'est pas plus inquiété qu'avant (aucun contact en une minute, avant comme après).
- *Dans le labyrinthe d'un récit*, rien ne sort de la pièce, et aucune idée noire n'apparaît (exigences 16, 22 et 23) : les
  petites chimères qui rôdent gardent leur placement.
- *Contrôles.* `tools/dedales.js` : sur dix mille tirages par profondeur et par genre, chaque plan a exactement une pièce,
  bien posée ; avec ou sans elle, le même plan (comparé au plan nu un tirage sur cinq, et aux empreintes d'avant) ;
  « ABSENT » pour une pièce manquante, « ÉCART » pour un plan changé ou une porte praticable. `tools/descente.js`,
  section D : dans un vrai chapitre et dans la descente, la porte est dessinée où le plan la met, on ne passe pas au
  clavier ni au doigt, A dit la phrase de son genre dans la langue du jeu, le chrono s'arrête pendant qu'elle s'affiche ;
  dans la descente, chaque idée noire paraît d'abord devant la porte, qui reste close ; dans un chapitre, rien n'en sort ;
  reprise, la porte est à la même place ; rien de ce qui rôde n'est jamais sur sa case ni derrière.

## Les personnages : `src/core/sprites.js`

Un personnage est dessiné par le code, en deux tailles, à partir de la même description (`look` : coiffe, manteau,
couleurs, objets ; l'équipement s'y ajoute par `gear.js`). Aucune image n'entre dans le jeu.

| | Le petit sprite | Le grand sprite |
|---|---|---|
| Taille | 16 × 24 | 32 × 48 |
| Où il se voit | sur les cartes, dans le dessin d'origine | partout dans le dessin fin ; en combat, en dialogue, à la page d'équipement, à l'écran « Ton personnage » dans tous les dessins |
| Gabarits | `HEADS`, `BODIES`, `POSES` | `TETES`, `CORPS`, `ALLURES`, `GESTES` ; la course, tirée d'un squelette (`SQUELETTE`, `course()`) |
| État | celui de la 1.32, au pixel près | redessiné d'après les modèles du décideur |

**Le grand sprite a ses propres gabarits**, aux proportions des modèles : une tête de dix-sept lignes environ, un corps
de vingt-neuf (le petit sprite, lui, a une tête presque aussi haute que son corps). Avant, il n'était que le petit
sprite agrandi deux fois.

- `grid()` compose toujours le personnage en 16 × 24 et reste seul à dire **qui porte quoi** : la coiffe, le manteau,
  le motif, l'armure, les objets tenus, la pose. Le petit sprite en sort tel quel.
- `natifGrille()` redessine cette composition en 32 × 48 : le corps (`CORPS[vue]` : repos, pas A, pas B ; ou
  `ALLURES[pose][vue]` ; ou, le temps d'un coup, `GESTES[geste][vue]`), les règles de tenue écrites à cette échelle (manteau absent, sur une épaule, ample ; rayures,
  bandes ; mailles, lamelles, cuir, toile piquée ; écharpe, châle, étoffe drapée, néon), les objets tenus — ceux de
  `grid()`, agrandis et ramenés à la hauteur de la main —, puis la tête (`TETES[coiffe][vue]`), inclinée ou abaissée
  selon la pose.
- `grand()` peint : cinq tons par matière, une seule lumière en haut à gauche, l'ombre d'une matière sur celle qu'elle
  recouvre, le galon au bas de la robe. Le voile est peint à part : une lumière en dégradé depuis son centre pour un
  Compagnon, un visage pour les autres (« Les visages »).
- Les mêmes lettres nomment les mêmes matières dans les deux tailles (`T t u` la coiffe, `V` le voile, `C c k` le
  manteau, `R r` le buste…). Le grand sprite en ajoute quatre : `H` et `D` (coiffe en pleine lumière, dans l'ombre),
  `J` et `j` (fer). Un vide d'un pixel entre deux formes devient un trait sombre : c'est le liseré qui le peint.
- Une tête peut descendre sur le corps : au-delà de sa vingtième ligne, ses lignes recouvrent le col et les épaules (le
  pan d'un turban, le camail d'une capuche ou d'une coiffe de mailles, le voile d'un chèche, les pans de l'étoffe du
  désert). Une tête ne doit jamais être plus large que les épaules à hauteur du visage : c'est ce qui faisait, le
  16 novembre, des « têtes d'extraterrestres » (D151). Les mailles d'une tête s'écrivent « # » : `mailler()` choisit
  l'anneau clair ou sombre selon sa place.
- De dos (lot B2) : le corps a les mêmes colonnes que de face, `C` en haut puis `B` — le pan du dos : la couleur du
  manteau ; sans manteau, la robe ; en tenue courte, les jambes. Les têtes de dos n'ont pas de voile : une nuque d'étoffe
  enroulée sous les turbans, le camail sous les casques. `grand(…, 2)` retrace le tout en 64 × 96 (voir « La définition
  du dessin »).
- `gfx.natif = false` rend partout le grand sprite d'avant, à l'identique : pour comparer.

**Trois gardes, au chargement.** Le moteur refuse de démarrer si un gabarit natif n'a pas ses lignes de 32 lettres, si
une coiffe ou une pose n'a pas son grand dessin, ou si le voile d'une tête n'est pas **une seule surface** — d'un seul
tenant sur chaque ligne et chaque colonne. Aucun gabarit ne peut donc porter un trait de visage : ni œil, ni bouche,
ni barre qui couperait le voile. Un visage, là où il y en a un, n'est jamais dans un gabarit : c'est `grand()` qui le
peint dans cette surface, et seulement pour qui n'est pas un Compagnon.

**Ajouter une coiffe**, c'est donc la dessiner deux fois : dans `HEADS` (11 lignes de 16, trois vues) et dans `TETES`
(20 lignes de 32, face et profil ; les deux dernières recouvrent le col). Une tête se compose d'un haut de huit lignes,
d'un bandeau de deux et d'un tour de visage de dix, que les turbans partagent (`turban()`), comme les casques partagent
leur camail. **Ajouter une pose** : ses lignes dans `POSES` et dans `ALLURES`, à partir du corps au repos (`varie()`).

`node v2/tools/silhouettes.js` le vérifie sur tout ce que le jeu peut dessiner — les héros, les gens, les rangs, les
tenues du râwî, les quatorze coiffes sous chaque manteau, les variantes d'équipement :

1. les petits sprites sont ceux relevés avant ce travail (`tools/essais/silhouettes.json`) : sinon « ÉCART » ;
2. l'interrupteur rend le grand sprite d'avant, à l'identique : sinon « ÉCART » ;
3. dans chaque grand sprite — toutes les vues, les pas, les poses, les gestes de frappe — le voile est une seule
   surface, sans trou ni marque ; et, une fois peint, celui d'un Compagnon (ou de qui le jeu laisse sans visage) ne
   porte que sa lumière ou son étoffe — trois tons au plus, jamais la couleur d'un œil : sinon « TRAIT » ;
4. les autres personnages ont un visage de face et de profil, et rien de dos : sinon « ABSENT » ;
5. chaque coiffe a sa tête native de face et de profil, rien ne sort de la grille, aucun sprite n'est vide : sinon
   « ABSENT ».

Les grands sprites, eux, sont comparés à leur dernier relevé (`tools/essais/grands.json`) : un dessin nouveau, validé
par le décideur, ne devient la référence que par `node v2/tools/silhouettes.js redessin « la décision »`, qui passe le
contrôle entier d'abord et n'écrit rien à la moindre autre anomalie (« Le râwî d'après la maquette », plus haut).

`node v2/tools/silhouettes.js planches [modèles.png]` écrit des planches agrandies dans `.smoke/silhouettes/` : la
comparaison avec les modèles, les héros, les coiffes, la marche et les poses, les gestes de frappe, l'équipement, les
gens. Tout changement de dessin se relit là, puis sur une capture du jeu.

### Les visages

*Décision du décideur, le 16 novembre : « en dehors des Compagnons, tous les autres personnages peuvent avoir un
visage » (D165, exigence 2).*

- **Qui n'en a pas.** Un Compagnon — type `compagnon`, voile de lumière — n'a jamais de visage. Ni ceux de
  `D.SANS_VISAGE` (`defs.js`) : des Compagnons que les récits dessinent sans voile de lumière, des hommes que certaines
  sources comptent parmi eux, et ceux que leur nom même range parmi eux (un Ansârî, un vétéran de Badr, un soldat de
  l'armée d'Usâma, un récitateur de Médine en l'an 12). La liste se tient **par récit**, sous le nom exact que le récit
  donne (sans accents ni apostrophes, comme `D.rayon` les lit) ; `I.rayonner` (`base.js`) pose alors
  `look.sansVisage` — un fichier de saga ne l'écrit pas. Dans le doute, pas de visage. L'histoire-cadre et les veillées
  sont de la fiction : tout le monde y a un visage.
- **Ce qui est peint** (`visage()`, appelée par `grand()` pour chaque point du voile) : un teint, pris parmi cinq ; des
  yeux, avec leur blanc et les sourcils en dessin fin ; une barbe — pleine, courte ou aucune —, blanche chez les
  anciens, grise chez certains savants et moines, absente chez les enfants ; une bouche ; l'ombre de la coiffe sur le
  front, la lumière sur le nez de profil. Les yeux se ferment dans le recueillement et l'accablement. Sous une capuche,
  le visage reste dans l'ombre ; sous un chèche, on ne voit que les yeux. De dos, rien. Les mains prennent le teint.
- **D'où cela vient.** Du personnage lui-même : `signe(look)` tire un nombre de ses couleurs (type, robe, coiffe,
  manteau), toujours le même pour le même — jamais de son peuple, de sa religion ni de son camp (exigence 10) ; l'âge
  vient de son type (`ancien`, `enfant`). L'équipement n'y change rien. Un fichier de saga n'écrit ni teint ni trait
  (`regles.js` le refuse) ; seul le râwî, que compose le joueur, reçoit un teint, une barbe et un poil choisis
  (« Le râwî composé »).
- **Où.** Sur le grand personnage, dans les trois dessins. Les petits personnages (16 × 24, le dessin d'origine sur les
  cartes) restent ceux de la 1.32 : personne n'y a de visage.

### Le mouvement

*Demande du décideur, le 16 novembre : « qu'on voie les pas et les gestes des bras quand ils marchent ou quand ils
frappent (comme dans Chrono Trigger), sinon ils sont trop inanimés » (D166).*

- **La marche.** `CORPS[vue][1]` et `[2]` sont deux foulées franches. De face et de dos (`foulee()`) : le bras du côté
  qui avance descend de deux points, l'autre remonte ; la robe tombe sur le genou qui avance ; un pied grandit, l'autre
  s'efface. De profil (`balance()`, `jambes()`, dessinés à la main) : le bras balance depuis l'épaule — la main dépasse
  devant la robe, puis passe derrière le dos —, la robe s'ouvre en triangle, un pied à plat devant, l'autre sur la
  pointe. La lettre `M` y est le pli entre les jambes : une ombre sous une robe, un vide en tenue courte (deux jambes).
  `world.js` enchaîne foulée, repos, foulée, repos, huit fois par seconde ; le corps se hausse d'un point quand les
  jambes se croisent.
- **Le souffle.** Une quatrième image par direction (`grand(…, 3)`) : le haut du corps remonté d'un point. La planche
  d'un personnage (`G.planche`) a donc quatre colonnes en dessin fin (`sheet.souffle`). Immobile, chacun respire à son
  rythme ; en combat, celui dont c'est le tour respire plus vite (il ne piétine plus).
- **Les gestes de frappe** (`GESTES.elan`, `GESTES.coup`, trois vues chacun) : le bras armé levé, puis tendu vers ce
  qu'il frappe ; de profil, le corps se fend. Le bras est tracé par `membre()` — un trait épais de l'épaule au poignet
  par le coude, son revers, la main, un liseré qui le détache du corps — et rend la place de la main. Ce ne sont pas des
  poses du récit : `D.POSES` ne les connaît pas, les petits personnages non plus.
- **L'arme.** Elle n'est pas dans le gabarit. `G.arme(nom, angle, échelle)` la dessine le long de son axe — sabre,
  dague, lance, bâton, masse, calame, arc et flèche : du bois, du fer, une corde (exigence 17) — et `G.frappe()` la
  pose dans la main, puis la fait tourner : l'élan (0,11 s), le balai (0,07 s, trois images la suivent), la tenue du
  coup (0,15 s). La manière vient du type de l'arme (`D.GEAR_TYPES[…].anim` : `slash`, `smash`, `thrust`, `arrow`) ; à
  mains nues ou pour « Éclairer », le geste seul. Pendant le geste, l'arme portée à la ceinture n'est pas dessinée.
- **Où.** En combat (`battle.js`, `perform`) : quelques pas, le geste à chaque coup de « Frapper » ou d'« Éclairer »,
  le retour. Dans un labyrinthe (`rodeurs.js`, `R.geste` ; `world.js`, `drawChar`) : le geste de celui qui mène, avec
  l'arme qu'il porte. Le dessin d'origine garde les pas de la 1.32 sur les cartes, et lève le bras comme avant.
- **La course** (« La manette tactile » ; le décideur, 19 novembre, devant la 2.16 : « on dirait pas que le personnage
  court, on dirait qu'il vole ou qu'il plane […] il va trop vite, diminue de 30 % »). Dans la 2.16, la course n'était que la
  marche plus rapide, le buste avancé d'un point à l'affichage : les pieds glissaient, le corps ne montait ni ne
  descendait. Elle a désormais sa foulée, dessinée — rien n'est repris d'un autre jeu, ni image, ni décalque, ni gabarit :
  huit images par cycle (`course()`, dans `sprites.js`), quatre par pas — l'appui (le pied posé devant, à plat, le corps descendu
  d'un point), la poussée (la jambe d'appui tendue derrière, sur la pointe ; le genou de l'autre levé haut), l'envol et la
  retombée (les deux pieds en l'air : la jambe de derrière emportée puis le talon qui remonte, celle de devant qui
  s'allonge puis le pied qui va se poser) ; puis l'autre jambe. Huit plutôt que six : l'envol dure deux images, et la
  cadence reste celle d'une course (quatre pas par seconde) au lieu de cinq et demi.
  - De profil, le squelette d'une jambe est écrit une fois (`SQUELETTE` : le genou, la cheville, le talon, la pointe, en
    points de 32 × 48) et tracé d'un trait épais (`tracer()`) : la jambe de derrière, puis la proche, qu'un point de vide
    détache. Le buste penché (trois points aux épaules, un à la taille), la tête en avant ; les bras pliés balancent à
    l'opposé des jambes (`BRAS_C`), celui de derrière seulement là où il n'y a rien ; le pan du manteau, emporté derrière
    et soulevé, ondule. La tunique suit les cuisses ; une robe longue se soulève (l'ourlet trois points plus haut), les
    jambes dans son ombre, les pieds paraissent — le galon ne court qu'au bas de la robe.
  - De face et de dos, le même pas : la moitié dont le genou monte remonte (`LEVE_C`), son pied paraît (de face) ou se
    cache ; de dos, la semelle du pied lancé en arrière ; le buste passe au-dessus du pied d'appui ; les bras pliés
    ramènent la main devant la poitrine, ou la laissent à la hanche.
  - Le râwî a la même course, tracée sur son habit à 64 × 96 (`rawiCourse()`, le même squelette deux fois plus grand),
    puis réduite comme ses autres images : les chausses et les bottes retracées de la hanche au pied, le long manteau
    emporté derrière, la lanterne à la ceinture.
  - Rien en main : ni arme, ni objet tenu (`natifGrille`, `rawiGrille`). Un Compagnon garde son voile d'une seule surface,
    sans un trait, dans chaque image ; les autres, leur visage de face et de profil.
  - **Le pied d'appui ne glisse pas.** `world.js` choisit l'image d'après le chemin parcouru (`W.player.parcours`), non
    d'après le temps : une image tous les `G.FOULEE` points (6,25) — ce dont le pied posé recule dans l'image, de l'appui
    à la poussée, mesuré sur le dessin même (`sprites.js`). D'une image d'appui à l'autre, sa place au sol ne dérive pas
    (moins d'un point, à 60 comme à 120 images par seconde) ; dans une même image, il avance avec le corps du chemin d'une
    image, comme dans tout jeu dessiné image par image. Les suiveurs courent avec le meneur, chacun à sa place sur son
    chemin (`parcours − 16 × i`). À chaque appui, une petite poussière se lève, sur la terre et le sable seulement
    (`poudre()` : jamais sur une natte, un tapis, un pavé, un sol de maison), posée dans le repère de la carte ; et le
    bruit d'un pas. De face, le pied posé reste au bas de l'image : il ne recule pas avec le sol, comme dans tous les jeux
    de rôle vus de haut.
  - Le dessin d'origine garde les pas de la 1.32 ; en courant, leur cadence est celle de la marche réglée sur la vitesse
    (une image tous les 82 / 8 points de chemin : dix pas par seconde).
  - La planche d'un personnage (`G.planche`) a douze colonnes par direction : repos, pas A, pas B, souffle, puis les
    huit images de la course (`sheet.course`). Sans grand dessin natif, la course se dessine avec les pas d'avant.
  Contrôles : `node v2/tools/course.js` (la vitesse ; le pied d'appui suivi point par point, à 60 et 120 images par
  seconde ; les suiveurs ; rien en main ; le dessin d'origine : « COURSE CONFORME ») ; `node v2/tools/course.js images
  <dossier>` en fait la planche et les films, pris du vrai jeu ; `silhouettes.js` couvre les images de la course (voiles,
  visages, une empreinte à part).

### Des corps, et non des fantômes (2.16)

*Le décideur, devant la 2.15 : « les personnages se croisent comme des fantômes » (diagnostic : seul le décor avait un
corps ; les suiveurs n'étaient que d'anciennes positions du meneur, un point par image ; `W.resolve` pouvait poser le
joueur sur un PNJ ; en combat, en hauteur, les héros se recouvraient). D198.*

- **Les suiveurs à distance fixe.** Le chemin du meneur (`W.trail`) se mesure en distance parcourue : un point chaque
  fois qu'il a avancé d'un point et demi, au moins cent quarante points gardés (`pushTrail`). `W.suiveur(i)` rend le
  point situé à `16 × i` points de chemin derrière lui, interpolé : seize points entre chacun, à 30, 60, 120 ou 144
  images par seconde (avant, 17,8 points à 60, 8,9 à 120). La bête suit à `16 × n + 8`. Les étiquettes (`U.noms`) et le
  dessin lisent la même fonction ; les shorts qui écrivent `W.trail` eux-mêmes (un point tous les 1,25 point) gardent le
  même placement. Au chargement d'un lieu, `W.resetTrail` sème le chemin derrière le meneur, à l'opposé de son regard : un
  mur le fait tourner, jamais revenir sur ses pas ; un mur sans issue ou un corps l'arrête. Les suiveurs restent sans
  corps : ils ne bloquent personne.
- **Un corps pour les PNJ et les coffres, contre le joueur.** Un pied de 10 × 5, calé sur l'ombre (x ± 5, de y − 4 à
  y + 1), contre celui du joueur (x ± 4, de y − 5 à y) : `W.corps()`, `W.touche()`, testés par `tryMove` (clavier,
  joystick) et par `follow` (au doigt). Un pas n'est refusé que s'il rapproche d'un corps qu'il toucherait : on peut
  toujours s'en écarter, et un joueur repris sur quelqu'un en ressort. L'ancien ralentissement (`crowded()`) n'existe
  plus. `W.resolve` ne pose plus jamais le joueur sur quelqu'un (le bureau de Maître Yûnus, `frame.js`), et
  `W.degager()` l'écarte d'un corps au chargement (une partie d'avant). Un PNJ qui paraît (« show ») là où se tient
  le joueur — il y était posé, caché — prend la case libre la plus proche (`W.ecarter` ; Farwa ibn Nawfal, saga de
  'Alî). Le joueur de test « à pied » (`W.pathTo`, `walkStep`) contourne, comme un joueur, les cases des PNJ et des
  coffres, et cherche un détour quand quelqu'un se met en travers.
- **Les suiveurs courent** quand le meneur court (19 novembre) : la même foulée, l'image choisie d'après le chemin du
  meneur moins leur écart (`parcours − 16 × i`) — chacun pose le pied à sa place, aucun ne glisse ; la bête, qui n'a pas
  de pas, garde son allure.
- **Le chemin au doigt** (`W.route`) : la case d'un PNJ ou d'un coffre compte comme pleine, sauf la case visée ; si la
  case visée n'est plus joignable ainsi, le chemin se refait sans eux. Les raccourcis (`clearLine`) ne traversent pas un
  corps.
- **Le pas de côté.** Un PNJ poussé plus de 0,4 s fait un pas d'une case vers une case libre : sur le côté d'abord (le
  plus loin du joueur), puis devant lui, jamais vers celui qui pousse ni sur le chemin qu'il suit (`pasDeCote`). Sa
  place est gardée au point de reprise, comme avant. Buter sur quelqu'un qui va s'écarter n'est pas être coincé
  (`follow` ne compte pas ces images).
- **Les marches de récit** (`W.walkTo`, `W.chemin`) suivent `W.route` case par case, en segments horizontaux et
  verticaux, chacun avec le bon sens du personnage ; elles contournent le joueur et les autres quand c'est possible. Leur
  durée est bornée à trois fois celle de la ligne droite d'avant (le pas s'allonge au besoin) ; sans chemin jusqu'à la
  case, la ligne droite d'avant.
- **Les chimères de la carte** ne s'approchent plus à moins de douze points d'un PNJ ni d'une autre chimère ; dans les
  labyrinthes, un rôdeur ne choisit jamais la case qu'un autre occupe ou vise (`rodeurs.js`, `avance`). Le contact avec
  le joueur reste ce qui ouvre le combat : ni l'un ni l'autre n'a de corps pour lui. Leur transparence a un plancher de
  0,85 (elle allait de 0,74 à 0,98) : elle dit encore qu'elles ne sont pas des personnes (exigence 6). La bête du ciel
  est opaque.
- **En combat, en hauteur**, les héros se resserrent autour du centre de leur groupe, et non du centre de l'écran
  (`battle.js`, `heroPos`) : vingt-sept points d'écart au moins en largeur — là où la scène visible est la plus étroite
  (216 points, un téléphone élancé ; à vingt-six, deux silhouettes s'y touchaient encore) —, dix-huit en profondeur, en
  escalier (avant : vingt points pour des figures de trente-deux). En largeur, rien ne change.
- **« 2D simple »** (`gfx.js`, `G.low`) tient ce que son texte promet : le pixel art seul, sans ambiance ni lueurs, sans
  halo, sans étalonnage ni vignette (avant, il gardait l'ambiance, l'étalonnage et la vignette).

Contrôles : `smoke.js walk` et `tap` (« SUPERPOSÉ » : le joueur reste plus de trente pas dans le pied de quelqu'un, ou un
lieu se charge avec quelqu'un à moins de 9 points de lui ; « COINCÉ ») ; `smoke.js auto` (« PNJ EN TRAVERS » : à chaque
point de reprise, la case d'un PNJ ou d'un coffre, rendue pleine, ne coupe aucun lieu nommé — sauf si son pas de côté
rouvre le passage, ce que le journal dit sans alerte) ; ces deux sondes sont dans `tools/sondes.js`, que `smoke.js` et
`paquet.js` posent sur leurs parties : un PNJ d'un paquet s'éprouve comme ceux du jeu, et `paquet.js` échoue aussi sur
« COINCÉ », « SUPERPOSÉ » et « PNJ EN TRAVERS » ; `smoke.js suiveurs` (l'écart à quatre cadences, chaque lieu de
départ, la reprise au bureau ; les marches de récit jouées pour de vrai et comme le jeu les joue — le joueur là où
l'objectif le laisse, « show » et ce qui précède joués —, puis le joueur posé en travers de la ligne droite, qu'elles
doivent contourner sans entrer dans son pied, et un témoin : la ligne droite d'avant, rejouée là, est relevée :
« SUIVEURS CONFORMES ») ; `loupe.js` (en combat, aucun point de la silhouette d'un héros sur celle d'un autre et
vingt-six points au moins d'un centre à l'autre, en hauteur aussi sur un téléphone élancé, 390 × 844 ; la 2.15 y
échoue, ce que le seuil d'avant — quatre points de recouvrement des boîtes — ne voyait pas).

### Le rayonnement d'un Compagnon

Chaque Compagnon a une couleur qui lui est propre : `D.RAYONS` (`defs.js`), un nom sans accent ni apostrophe → une
couleur ; `D.rayon(nom)` la retrouve d'après le nom tel que les récits l'écrivent (« 'Alî », « 'Alî ibn Abî Tâlib »), en
prenant la plus longue entrée qui commence ce nom. Quand un récit s'enregistre, `I.rayonner` (`base.js`) la pose sur
l'apparence de ses héros et de ses personnages de type `compagnon` (`look.rayon`) : **un fichier de saga n'écrit jamais
cette couleur**, et un personnage de fiction n'en reçoit pas. En dessin fin (`gfx.D > 1`), `grand()` peint alors le
voile d'un cœur blanc puis de cette couleur — toujours une seule surface, sans trait ; la carte éclaire le personnage
de la même teinte (`lueur()`, `world.js`), son étiquette en est soulignée (`ui.js`), et le combat s'en sert pour le
reconnaître (`ray` : nom, sceau, ordre des tours), la couleur de sa Lumière restant celle des effets (`color`). En
dessin d'origine, rien de tout cela ne joue. Les petits sprites ne dépendent pas de `rayon` : `silhouettes.js` cherche
leur empreinte sans lui. **Ajouter un Compagnon**, c'est ajouter sa ligne à `D.RAYONS` — une couleur proposée au
décideur, comme les autres (D159).

### En combat : toucher celui que l'on vise

`battle.js` sait qui se tient sous un point de la scène (`sous(x, y)`, en points logiques : la boîte du dessin de
l'égrégore, ou les 32 × 48 de l'un des nôtres). Pendant le choix d'une cible, `I.battle.touche(x, y)` le choisit et
`I.battle.survol(x, y)` le montre ; `ui.js` leur passe les clics et le survol de la scène. `I.battle.places()` dit aux
outils où se tient chacun et qui peut être choisi : `tools/doigt.js` s'en sert pour toucher l'égrégore lui-même (D158).

## Les règles du contenu : `src/core/regles.js`

En 1.32, les règles vivent dans deux scripts (`tools/validate.js`, `tools/validate-music.js`) qui lisent le disque et
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

- un égrégore ne fixe ni Constance ni dégâts (`hp`, `atk`…) : le moteur les calcule — la 1.32 l'ignorait sans le dire ;
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
16 novembre, avec les personnages redessinés). Celui de la 1.32 est à sa version 32 — les mêmes personnages — et
n'est plus republié. Chaque Artifact
a son propre stockage : une partie ne passe de l'un à l'autre que par l'export et l'import. On ne publie que
l'assemblage que toute la batterie a joué.

## Les langues

*Demande du décideur, 18 novembre : l'arabe, l'anglais et le japonais, « en reprenant les concepts à la source dans la
littérature de la langue elle-même et non en faisant des traductions du français » (exigence 25).*

- **Le français ne bouge pas.** Il reste la langue des récits (`src/data/`), des tables (`defs.js`) et du code. Le jeu
  s'ouvre en français, et s'y comporte comme avant.
- **`src/core/langue.js`** se charge avant le socle (et sous Node, pour les outils).
  - Il connaît la forme des récits : `casesSaga` donne chaque emplacement de texte d'un récit (noms, répliques,
    narrations, options, pourparlers, recueil, égrégores, objectifs…), `casesDefs` ceux des tables. Tout le reste
    (identifiants, couleurs, clés) n'est jamais touché.
  - À l'enregistrement d'un récit, il en relève les emplacements, une fois, en français. Au changement de langue, il
    pose sur place le texte de la langue rangé sous la clé du français (`cle(fr)` : l'empreinte FNV-1a et la
    longueur), ou le français s'il n'y en a pas. Puis `perso.js` pose le nom du joueur, et la page reçoit ses textes
    (`data-t`, `data-t-aria`…), sa direction (`dir="rtl"` en arabe) et sa langue (`lang`, `data-lang`).
  - `I.t(fr, champs)` dit une phrase du code : en français, la phrase elle-même. Les formes selon un nombre sont
    séparées par `¦` (une ou deux en français et en anglais, six en arabe, une en japonais). `I.T(fr)` marque un texte
    d'une table écrite au chargement, que l'on dit plus tard par `I.t`.
  - Ce qui sert de clé reste en français : le rayon et le voile d'un Compagnon sont posés d'après son nom avant toute
    langue ; les catégories du recueil se comparent en français et se traduisent à l'affichage ; les empreintes que la
    partie garde (`mal.note`) se prennent sur le texte français (`I.langue.fr`).
  - L'écriture : le texte s'écrit deux signes à la fois en français et en anglais, un en japonais, un mot à la fois en
    arabe (`L.avance`) ; une annonce de combat, une ligne du fil, durent selon le poids du texte (`L.poids` : le japonais
    dit plus en moins de signes) ; les initiales d'un nom se tirent selon la langue (`L.initiales`) ; une ligne posée dans
    la scène prend le sens de sa langue (`L.sens` : « Un texte à la fois »).
- **Les textes des langues** : `src/lang/<langue>/<fichier>.json`, un fichier par récit, plus `tables` et `moteur`, une
  entrée par ligne `{ k, fr, t, ou }`. L'assemblage les embarque (`ISNAD.langue.poser`) ; un `t` vide n'entre pas.
  `node v2/tools/langues.js releve` met les listes à jour du français ; `node v2/tools/langues.js` contrôle.
- **Le choix** : quatre boutons sur l'écran-titre (chacun écrit dans sa langue), et « Langue » dans la halte (le récit
  reprend à son dernier point de reprise). C'est un réglage de l'appareil (`opts.lang`) : la partie est la même dans
  toutes les langues. `?lang=ar` dans l'adresse force une langue, pour les contrôles.
- **L'affichage** : polices Noto Naskh Arabic et Amiri Quran pour l'arabe, Noto Serif JP pour le japonais (Google
  Fonts) ; ni lettres espacées, ni capitales, ni italique en arabe et en japonais ; la boîte de dialogue se retourne de
  droite à gauche ; une parole citée prend les guillemets de sa langue ; la scène, elle, ne se retourne pas.
- **Les règles** : `regles.js`, `verifierLangue(langue, emplacements)` — les exigences 6, 7, 8, 14, 15, 17, 18, 19 et 24
  dans les mots de chaque langue, selon le genre de l'emplacement (`genreDe`).
- **La langue secondaire** (19 novembre) : la même réplique dans une autre langue, sous la première — section suivante.

## La langue secondaire

*Demande du décideur, 19 novembre : « la possibilité d'ajouter une langue secondaire pour apprendre même si non vocalisée
et non traduction mot à mot ».*

Le joueur qui le veut lit, sous la bulle de celui qui parle, une seconde bulle : la même réplique dans une autre langue.
Rien n'est traduit pour cela : chaque langue est écrite à la source (« Les langues », exigence 25), et le moteur va
chercher, sous la clé du texte français d'origine, ce que l'autre langue a écrit. Ce n'est donc pas du mot à mot, et
l'arabe n'est pas entièrement vocalisé (`v2/docs/langues/ar.md`, § 1.2) : le décideur l'accepte. C'est une **exception
voulue à D189** (« Un texte à la fois »), active seulement si le joueur la choisit. **Sans langue secondaire, rien ne
change d'un point** : ni bulle, ni bloc, ni temps de plus. Vérifié en comparant, élément par élément (place, taille,
police, couleur, visibilité), la page de l'assemblage d'avant et de celui-ci sur l'écran-titre, un carton de titre, une
narration, une réplique, une ligne du fil et une parole citée, en 390 × 844, 844 × 390 et 1280 × 720 : identiques,
l'estampille de version mise à part. Seules les pages de réglages gagnent leur bouton.

- **Le réglage.** « Langue secondaire » dans les Réglages de l'écran-titre — un bouton qui fait le tour (aucune, puis
  chaque langue offerte autre que celle du jeu), avec sous lui une ligne : « La même chose, dite avec les mots de l’autre
  langue : pas mot à mot. » ; en largeur, il prend toute la largeur de la colonne, après « Plein écran » — et dans
  celles de la halte, où sa page dit ce qu'elle est, et ce qui reste dans la langue du jeu. Aucune, d'office. C'est un
  réglage de l'appareil (`opts.lang2`, à côté de `opts.lang`) : la partie exportée n'en sait rien, son format ne change
  pas. Si le joueur prend pour langue du jeu sa langue secondaire, les deux échangent leur place (`U.langue`).
  `?lang2=ar` dans l'adresse la force, pour les contrôles (comme `?lang=`).
- **Où elle paraît.** Les répliques et les narrations (la boîte de dialogue), le verdict de la Chaîne compris ; les
  cartons du récit — un titre et sa date, une parole citée et sa source, un verset et sa référence (la page d'un attribut
  divin, le secours) ; les lignes du fil (annonces et leçons), sous l'annonce. **Pas** dans les menus, les choix (ni la
  liste d'un pourparler, ni celle d'une idée noire), le combat, la halte, ni les cartons du moteur (victoire, prière,
  œuvre, lame…) : l'écran y est déjà plein, et ce ne sont pas des textes de récit.
- **Quand.** La seconde bulle paraît en entier quand la première a fini de s'écrire : on lit d'abord dans la langue du
  jeu, puis l'on compare ; un toucher qui presse l'écriture les montre ensemble. Tout de suite, elle se lirait avant la
  première, que la machine à écrire n'a pas encore posée, et l'œil irait de l'une à l'autre pendant l'écriture. Un carton
  la porte dès qu'il paraît : il se lit d'un coup. Une ligne qui passe d'elle-même (le verdict de la Chaîne, un carton de
  titre) reste le temps de lire les deux (`S.lecture2`).
- **Où, sur l'écran.** En hauteur (390 × 844), sous la boîte, dans la bande noire (`S.placer2` : du bas de la boîte au
  bas de l'écran) : elle ne touche jamais l'image. En largeur (844 × 390, où la boîte occupe déjà le bas de la scène) et
  au bureau, elle est **en haut de la scène**, comme la seconde ligne d'un film sous-titré en deux langues. La vue garde
  au milieu celui qui parle : une bulle posée juste au-dessus de la boîte l'aurait caché ; en haut, pendant une lecture,
  il n'y a que le décor (l'en-tête s'y retire déjà en largeur ; au bureau, il se retire le temps de la lecture,
  `body.avec2`). Les plus longs textes y tiennent en trois ou quatre lignes. Une ligne qui défile ou qu'il faudrait
  toucher pour la lire a été écartée : on ne relit pas un texte qui défile, et un toucher de plus à chaque réplique
  doublerait les gestes. Dans les deux sens, si la place manque, ses caractères se resserrent cran par cran, jamais sous
  dix points ; au-delà, elle défile (`tenir2`) — le contrôle le signalerait. Un carton qui porte sa langue secondaire
  commence en haut s'il déborde, et se resserre de même sans qu'aucun texte passe sous dix points (`tenirCarton`) ; en
  largeur, son ornement et son titre se font plus discrets.
- **Son dessin.** Plus petite (0,86 em, 0,9 em en hauteur), d'une autre teinte — un vert d'eau (`--l2`), ni l'or du jeu,
  ni le violet des leçons —, avec un filet du côté où commence sa langue. Elle porte sa langue et son sens (`lang`,
  `dir`) : de droite à gauche en arabe, en naskh ; le japonais dans sa police ; le français et l'anglais dans l'Alegreya,
  quelle que soit la langue du jeu (`.l2[lang=…]`, `style.css`). Ni capitales, ni lettres espacées, ni italique en arabe
  et en japonais. Une parole citée prend les guillemets de sa langue. Toucher la seconde bulle fait avancer, comme la
  première.
- **Retrouver le texte** (`langue.js`). Le français d'origine se retrouve d'abord par l'**emplacement** du texte : au
  relevé d'un récit, chaque objet garde le français d'origine de ses champs (`L.origine(objet, champ)`, une table
  faible) ; le moteur passe à la boîte l'opération qu'il joue (`showLine(…, { src: [op, 2] })`, la manche d'un
  pourparler, la réponse choisie, la réplique qui suit une idée noire). À défaut — un titre de chapitre posé par le moteur
  (`[['title', ch.title, ch.sub]]`) — par le **texte affiché** lui-même (`L.source`) : ce que la langue du jeu et le nom
  du joueur y ont posé (`perso.js` le retient). Puis `L.dans(lang, fr)` donne le texte de l'autre langue (null s'il n'y
  est pas écrit : pas de bulle, plutôt que le français deux fois), et `perso.direDans` y pose le nom du joueur à la place
  de celui que cette langue donne au râwî (« إدريس », « イドリース »), seulement dans un texte dont le français nomme le
  râwî. Une phrase du moteur se dit dans l'autre langue par `L.tDans(lang, fr, champs)` : ses champs qui sont des textes
  du jeu (le nom d'un objet, d'une pièce) y prennent le leur, le nom du râwî aussi. Pour le fil, `I.t` retient, seulement
  quand une langue secondaire est choisie, ce qu'il vient de dire (les trois cents dernières phrases, `L.retrouver`) ; une
  annonce faite de plusieurs phrases n'a pas de seconde ligne, et une annonce qui en porte une passe seule (elle ne se
  joint pas aux autres par « · »). `L.fr` (ce que la partie garde) ne change pas.
- **Les textes nouveaux** (cinq, dans `moteur` : le réglage, sa ligne, « aucune », la page de la halte) sont écrits en
  arabe, en anglais et en japonais par l'agent, selon les glossaires, et posés par `langues.js poser` : à relire.
- **Le contrôle** : `node v2/tools/bilingue.js [fr-ar …] [390x844 844x390] [par=4]` (une douzaine de minutes pour tout).
  Pour chacun des douze couples (langue du jeu, langue secondaire), en hauteur et en largeur : la langue secondaire
  choisie par le vrai bouton des Réglages, et gardée d'une page rechargée à l'autre ; le prologue joué au doigt ; chaque
  réplique et chaque narration regardée à l'instant où elle a fini de s'écrire (dans la page, sans dépendre du toucher),
  chaque carton du récit une fois montré : la seconde bulle est là, non vide, dans la bonne langue (son texte est l'un de
  ceux que cette langue a écrits, `src/lang/`), dans le bon sens, aucun texte sous dix points, sans débordement, ni hors de
  l'écran, ni sur la première bulle, ni — en hauteur — sur l'image ; une ligne du fil, s'il parle, dans sa langue ; puis
  une parole citée, le verset d'un attribut divin, et une réplique où le nom choisi (« Khalil ») est posé dans les deux
  bulles. Une fois, en français et sans langue secondaire : rien ne paraît ; puis on la choisit à la halte, et la
  réplique suivante porte la sienne ; puis la langue du jeu prise pour langue secondaire les échange. « BILINGUE
  CONFORME » ; sinon « ABSENT », « ÉCART », « INVISIBLE », « BLOQUÉ », « TEXTE CACHÉ ». Captures, et un relevé ligne à
  ligne (chaque réplique, son texte dans la langue secondaire ; chaque carton ; le fil), dans `.smoke/bilingue/`.

## Commandes

```sh
node v2/tools/validate.js            # tout le contenu : sagas, histoire-cadre, veillées, contenu commun, puis l'ensemble
node v2/tools/validate.js fichiers   # seulement ces fichiers
node v2/tools/validate-music.js
node v2/tools/build.js               # v2/index.html et v2/dist/isnad.html (avec les paquets de v2/paquets/)
node v2/tools/langues.js releve      # les listes de textes de chaque langue, à jour du français
node v2/tools/langues.js [langue] [fichier]   # « LANGUES CONFORMES » : tout est écrit, et passe les règles
node v2/tools/paquet.js [fichier]    # éprouve un paquet, hors du jeu puis dans un jeu d'essai assemblé à part
node v2/tools/partie.js              # la partie du joueur : exportée, effacée, réimportée à l'identique
node v2/tools/personnage.js          # le nom et la tenue du râwî : choisis, joués, gardés
node v2/tools/silhouettes.js         # « SILHOUETTES CONFORMES » : petits sprites inchangés, aucun trait dans un voile
node v2/tools/silhouettes.js planches [modèles.png]   # planches agrandies dans .smoke/silhouettes/
node v2/tools/course.js              # la course : vitesse, pied d'appui suivi à 60 et 120 Hz, suiveurs, rien en main — « COURSE CONFORME »
node v2/tools/course.js images <dossier>   # sa planche et ses films (téléphone en hauteur et en largeur, ralenti, marche puis course)
node v2/tools/silhouettes.js redessin « décision »   # un nouveau dessin validé devient la référence des grands (le contrôle entier d'abord)
node v2/tools/loupe.js               # « LOUPE CONFORME » : sur un téléphone, l'image agrandie, le toucher juste, les textes lisibles
node v2/tools/manette.js             # « MANETTE CONFORME » : la manette tactile partout — A choisit, B revient en arrière ; elle ne recouvre rien
node v2/tools/partage.js             # « PARTAGE CONFORME » : partager sa progression — le bouton, l'image, le texte, les replis, quatre langues
node v2/tools/smoke.js auto          # et walk, tap, wrong, shots — comme en 1.32 (2.16 : « PNJ EN TRAVERS », « SUPERPOSÉ », « COINCÉ »)
node v2/tools/smoke.js suiveurs      # « SUIVEURS CONFORMES » (2.16) : seize points entre les siens à toute cadence, personne sur personne, les marches de récit
node v2/tools/doigt.js [loin [844x390]]
node v2/tools/son.js
node v2/tools/bataille.js [mesures]
node v2/tools/longueurs.js [langue…]  # « LONGUEURS RELEVÉES » : le relevé des longueurs, un rapport sans blocage (D189)
node v2/tools/bilingue.js [fr-ar …] [390x844 844x390]   # « BILINGUE CONFORME » : la langue secondaire, sous chaque réplique et chaque carton, au doigt
```

**Règle de la 2.x.** Celle d'`AGENTS.md`, avec douze contrôles de plus à chaque changement du moteur ou des règles —
`paquet.js`, `partie.js`, `personnage.js`, `silhouettes.js`, `dedales.js`, `descente.js`,
`retours.js`, `progression.js`, `loupe.js`, `bilingue.js`, `partage.js` et `manette.js` ; la liste, et ce que chacun doit
afficher, est dans `AGENTS.md`. Aucun ne doit finir sur « REFUS », « BLOQUÉ », « ABSENT », « INACCESSIBLE », « INVISIBLE »,
« TRAIT » ni « ÉCART » ; depuis la 2.16, ni sur « SUPERPOSÉ », « COINCÉ » ou « PNJ EN TRAVERS » ; depuis la manette partout,
ni sur « RECOUVERT » (la manette tactile sur un texte, un élément touchable ou l'image).
