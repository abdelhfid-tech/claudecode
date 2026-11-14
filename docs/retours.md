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

Les retours se consignent dans ce fichier, datés, puis redescendent en tâches courtes.
