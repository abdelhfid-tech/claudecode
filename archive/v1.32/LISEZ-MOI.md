# ISNAD 1.32 — archive

Le jeu léger, en un seul fichier, sans serveur. Il est **stable et archivé** (décision du décideur, 18 novembre) : on ne
le modifie plus, on ne le réassemble plus (l'assemblage y inscrirait sa date), on ne republie pas son Artifact privé
(version 32). Tout le développement se fait dans la 2.x, dans `v2/`.

- **Jouer** : ouvrir `index.html` (ou `dist/isnad.html`, le même fichier) dans un navigateur.
- **Version** : la 1.31 gelée le 15 novembre (commit `46fc869`), avec les grands personnages redessinés le 16 novembre ;
  regelée au commit `8c21125`. Elle a quitté la racine du dépôt le 18 novembre, sans qu'un octet change.
- **Parties des joueurs** : clés `isnad.auto.v1`, `isnad.slot.N`, `isnad.opts.v1`. La 2.x ne les lit ni ne les écrit.
- **Ce qu'il y a ici** : `src/` (moteur et récits), `index.html` et `dist/isnad.html` (le jeu assemblé), `tools/` (ses
  outils : assemblage, validateur, parcours automatiques, livret), `promo/` (son livret du joueur et ses planches).
- **Ses outils marchent encore d'ici**, chacun relatif à ce dossier : `node archive/v1.32/tools/smoke.js auto` rejoue la
  1.32 ; `node archive/v1.32/tools/promo.js pdf` refait son livret en PDF (non versionné). Ils ne servent qu'à la
  consulter : rien ne s'y enregistre.

La 2.x ne se compare plus à la 1.32 : les contrôles `gel.js`, `cartes.js` et `ecrans.js` ont été retirés le même jour.
Le dessin « d'origine » de la 2.x vient de la 1.32, mais il peut désormais s'en écarter.
