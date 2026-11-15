# Tests et retours — étape 6

État à la livraison de la première version. Le critère de sortie de l'étape 6 (« les cycles humains
prévus par le profil sont faits ») **n'est pas atteint** : aucun humain n'a encore joué.

## Ce qui a été testé

| Test | Outil | Résultat |
|---|---|---|
| Schéma des données | `node tools/validate.js` | Les cinq sagas et l'histoire-cadre passent : chaque carte, lieu, opération, effet, héros, ennemi et entrée de codex référencé existe ; chaque `choice` a une seule bonne option et une explication par option fausse. |
| Syntaxe de l'assemblage | `node tools/build.js` puis analyse du script | Le fichier assemblé se charge. |
| Partie complète | `node tools/smoke.js auto` | Prologue, cinq sagas et épilogue joués de bout en bout dans Chromium : 46 combats, 27 choix, **zéro erreur console**. |
| Accessibilité des objectifs | même test | Avant chaque objectif, un parcours en largeur sur la grille vérifie que la cible est atteignable à pied depuis la position du joueur. Aucun objectif inaccessible, aucun PNJ ou ennemi absent de sa carte. |
| Marche réelle | `node tools/smoke.js walk` | Le héros est piloté au clavier simulé le long d'un chemin, avec la vraie physique de déplacement, sur les 17 chapitres : chaque objectif est atteint à pied, sans blocage. Ce test a fait corriger trois défauts (personnages qui barraient un passage, mauvais interlocuteur choisi quand deux personnages se touchent, déplacement possible pendant un changement de chapitre). |
| Mauvaises réponses | `node tools/smoke.js wrong` | Le test choisit d'abord toutes les mauvaises options de chaque `choice`, puis la bonne : les 27 choix et leurs branches d'explication s'exécutent sans erreur. |
| Interface au clavier | visite scriptée | Titre, dialogues, menu de pause, combat (commandes, cible, Niyya), écran de la Chaîne, choix, carton de citation ; rechargement de la page puis « Continuer ». |
| Rendu | `node tools/smoke.js shots` | Captures bureau (1280 × 720) et mobile en portrait (390 × 780) relues par l'agent : titre, Cité-Miroir, Médine de jour et de nuit, désert, camp, combat, Chaîne. |

Le test automatique fait avancer seuls les dialogues et les choix (il prend toujours la bonne option),
mène les combats avec une IA et saute d'objectif en objectif après avoir vérifié le chemin.

## Version 2 : ce qui a été rejoué

| Test | Résultat |
|---|---|
| `node tools/validate.js` sur les cinq sagas, l'histoire-cadre et les veillées | ✓ partout : 20 pourparlers, 28 choix, 26 prières scriptées. |
| `node tools/validate-music.js` | ✓ 18 pistes, chaque voix dure exactement sa boucle. |
| `node tools/smoke.js auto` | Prologue, cinq sagas, cinq veillées, épilogue : aucune erreur console. |
| `node tools/smoke.js walk` | Même partie en marchant réellement : aucun blocage ; 20 pourparlers gagnés sur 20. |
| `node tools/smoke.js wrong` | Toutes les mauvaises réponses, tous les pourparlers perdus (0 sur 20) : chaque branche d'échec s'exécute et la partie se termine quand même. |
| Lecture des 18 pistes dans un navigateur de test | Aucune erreur ; niveau mesuré sur chacune ; un limiteur a été ajouté après une crête trop haute. |

## Version 3 : bâtir

Rejoué par `smoke.js auto` et `smoke.js walk` : les trois objectifs de construction de la première saga
(enclos, six segments de tranchée, mosquée de Dhû l-Qassa) sont bâtis par le test et validés ; chaque
type de pièce a été posé une fois ; l'oasis, le chantier, la mosquée fondée et son point de prière ont
été constatés. Le mode Bâtir a été piloté au clavier (ouvrir, changer de pièce, poser). Ce test a révélé
un défaut ancien, corrigé : après un bandeau ou un carton qui s'effaçait tout seul, la touche suivante
était avalée. Non testé : bâtir au doigt sur un vrai téléphone ; l'équilibre des matériaux.

## Revue critique : le joueur exigeant

Un amateur rigoureux de JRPG 16 bits dirait ceci, sans complaisance.

**Ce qui tient.** Le système de voiles et de failles oblige à réfléchir ; la Niyya donne un vrai choix à
chaque tour ; les pourparlers ont un enjeu et un échec qui coûte ; le savoir sert à quelque chose ; le
récit est tenu et sourcé ; on peut finir le jeu sans jamais être bloqué.

**Ce qui pèche encore.**
1. L'exploration est peu dense : peu de secrets, pas de quêtes annexes, des cartes sans intérieurs.
2. Pas d'équipement ni de choix de construction du groupe : la progression est linéaire.
3. Reprendre après un rechargement rejoue l'objectif en cours depuis son début.
4. L'équilibrage n'a été éprouvé que par une IA de test, y compris celui des piliers.
5. Les combats manquent de mise en scène : pas d'animation propre à chaque acte, pas d'intention ennemie annoncée.
6. La musique est synthétique et n'a jamais été mixée à l'oreille.
7. Les personnages sont petits et peu expressifs ; les pourparlers se jouent dans une liste, sans mise en scène propre.
8. Sur téléphone en portrait, la scène est petite.

**Ce que la version 2 corrige.** Les choix ont désormais des conséquences (pourparlers, piliers, veillées) ;
la guerre n'est plus la seule issue ; il y a une bande-son ; le rendu s'adapte à l'appareil.

**À faire ensuite, par priorité.** (1) relecture historique et religieuse ; (2) test par des joueurs ;
(3) écoute et réglage de la musique ; (4) densifier l'exploration ; (5) mise en scène des combats et des
pourparlers ; (6) point de reprise plus fin.

## Version 5 : téléphone, aide, le cœur

Rejoué de bout en bout, sans blocage ni erreur console, par cinq parcours automatiques : `auto`,
`walk`, `tap` (le héros marche comme au doigt, par le chemin que tracerait un toucher), `wrong`
(mauvaises réponses d'abord, pourparlers perdus) et `auto` sans aucune œuvre (`SANS_OEUVRES=1`).

- Le joueur de test accomplit les œuvres du jour après chaque prière, dénoue les trois énigmes, forge
  six lames sur sept (il n'a pas la bourse pour trois aumônes), tranche six maux, repousse le septième.
- Sans aucune œuvre : toutes les épreuves restent gagnables, sans défaite pour le joueur de test ; six
  maux sont repoussés et reviennent au dernier chapitre.
- Mal du cœur avec sa lame : deux à six tours. Sans lame : six à trente tours selon le groupe.
- Idée noire au milieu d'un pourparler : trois à huit tours, aucune défaite.
- Vérifié sur des captures en 390 × 844 : la scène agrandie, le texte, l'objectif sous l'image, le
  menu des œuvres, le combat. **Aucun essai sur un vrai téléphone ni avec un vrai doigt.**

## Premier retour de jeu réel : « le jeu s'arrête après le premier combat »

Signalé par le décideur. **Cause trouvée** : à la fin du prologue, un carton et quatre narrations
s'affichaient sous le noir d'un fondu. L'écran restait noir, le jeu attendait un toucher. Corrigé, et
un contrôle permanent signale désormais tout texte caché (voir `decisions.md`, D75).

**Ce que ce retour apprend.** Un parcours automatique qui avance « dès que le jeu attend » prouve que
le récit se déroule, pas qu'il se voit. Cinq parcours complets passaient sur un jeu qu'un joueur ne
pouvait pas dépasser sans deviner. Un outil a été ajouté, `tools/doigt.js` : il joue le prologue au
doigt, sans raccourci, et regarde l'écran avant chaque toucher. Dès son premier passage il a trouvé un
second défaut (un toucher qui répondait à un menu de choix à la place du joueur, D85). Il ne couvre
que le prologue. Rien ne remplace un essai humain.

## Version 6 : équipement, et ce que le joueur voit

Rejoué de bout en bout par les cinq parcours (`auto`, `walk`, `tap`, `wrong`, `auto` sans œuvres) :
aucun blocage, aucun texte caché, aucune erreur console, aucune défaite du joueur de test. Puis par
`tools/doigt.js` sur trois tailles d'écran (390 × 844, 360 × 560, 844 × 390) : le prologue se termine au
doigt, tout ce que le jeu attend se voit, le menu de choix est vu avant d'être touché.

- Le joueur de test ouvre désormais les coffres de chaque lieu : tous sont accessibles à pied, y
  compris les vingt-deux coffres d'équipement. Il s'équipe « au mieux » à chaque pièce reçue et achète
  aux artisans quand sa bourse le permet ; il finit avec vingt-trois pièces portées et trente-huit en réserve.
- Équilibre : soixante-quatre combats, 421 tours avant l'équipement, 427 après ; Constance minimale
  moyenne de 91 % dans les deux cas. L'équipement ne déplace pas la difficulté pour l'IA de test.
- Vérifié sur captures, bureau et téléphone : la page Équipement, le choix d'une pièce et sa
  comparaison, « Qui la porte ? », les artisans, le combat avec les silhouettes équipées, les cinquante-
  trois icônes, la halte en portrait (liste sur deux colonnes, page en dessous).
- **Non vérifié par un humain** : l'intérêt de l'équipement, la justesse des prix, la lisibilité des
  icônes sur un vrai téléphone, et tout ce qui suit le prologue quand on joue au doigt.

## Ce qui n'a pas été testé

- **Aucun test humain.** Ni le plaisir de jeu, ni la clarté des règles, ni le rythme, ni la longueur
  réelle d'une saga n'ont été vérifiés.
- **Équilibrage réglé contre une IA de test.** Elle connaît les règles, vise les failles connues et ne
  se trompe pas de menu. La difficulté pour un nouveau joueur est inconnue.
- **Relecture historique et religieuse par un spécialiste : non faite.** Dates, sources, attributions,
  traductions du sens et formulations sont à vérifier. Voir `decisions.md`, points H1 à H10.
- **Navigateurs.** Chromium seulement. Safari, iOS, Firefox et Android non testés.
- **Appareils.** Aucun vrai téléphone, aucune mesure de performance, tactile non essayé à la main.
- **Sans polices web** et **sans stockage local** : chemins prévus par le code, non vérifiés.
- **Accessibilité.** Contrastes non mesurés, aucun essai avec un lecteur d'écran.
- **Son.** Jamais écouté par un humain.

## Réserves relevées pendant la construction

À revérifier sur la version livrée : certaines ont pu être corrigées depuis.

- La sauvegarde se fait désormais à la main, dans les mosquées (choix du décideur). Reprendre une
  sauvegarde rejoue l'objectif en cours depuis son début ; ce qui n'a pas été sauvegardé est perdu à la
  fermeture de la page, sans avertissement possible dans un Artifact.
- En combat à trois ennemis, la plaque de nom du troisième peut recouvrir le corps d'un autre.
- Corrigé depuis : l'écran de la Chaîne tient en 720 px (cartes compactes) ; les coiffes ont un
  bandeau et un ombrage pour ne plus se lire comme une tache claire ; le champ de bataille a été
  remonté au-dessus du panneau de commandes.
- Sur téléphone en paysage, le panneau de combat occupe encore le tiers bas de l'écran.
- Les œuvres pèsent peu pour le joueur de test (aucune défaite sans elles). C'est voulu pour que rien
  ne bloque ; si le décideur veut que « plus dur » se sente davantage, le réglage tient en une ligne
  (8 % par point manquant, `src/core/battle.js`).
- Une partie commencée avant la version 5 ne retrouve pas les idées noires ni les maux des rencontres
  déjà jouées : les maux correspondants se dressent tous au dernier chapitre.
- Le menu des œuvres défile sur un petit téléphone (six lignes) ; rien n'indique qu'il défile.

## Retours à collecter

**Cercle 1, le décideur.**
1. Le cadre (Idris, l'Agrégor, la Chaîne) sert-il le propos ou le parasite-t-il ?
2. Les décisions D1 à D16 sont-elles validées ?
3. Le ton est-il juste ? Citer toute réplique qui sonne faux.

**Cercle 2, un relecteur compétent.**
4. Toute erreur de fait, de date, de source ou d'attribution, saga par saga.
5. Toute formulation ou mise en scène à corriger par respect.
6. Les récits à la chaîne discutée doivent-ils être gardés, reformulés ou retirés ?

**Cercle 3, une dizaine de joueurs.**
7. Comprend-on les voiles, les failles et la Niyya sans lire l'aide ?
8. Où s'ennuie-t-on, où bloque-t-on, quel combat est trop long ?
9. Durée réelle de chaque saga ; abandon éventuel et à quel endroit.
10. Les choix de fidélité apprennent-ils quelque chose, ou devine-t-on au hasard ?
11. Lisibilité et confort sur téléphone, en portrait et en paysage.
12. Le son : présence, fatigue, envie de le couper.
13. Le doigt : touche-t-on juste, le héros va-t-il où l'on veut, la croix manque-t-elle ?
14. « Que faire ? » suffit-il quand on est perdu, ou faut-il des indices écrits objectif par objectif ?
15. Les œuvres : sent-on qu'elles préparent, ou les accomplit-on machinalement ?

Les retours se consignent dans ce fichier, datés, puis redescendent en tâches courtes.
