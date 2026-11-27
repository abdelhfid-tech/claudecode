# Déposer ISNAD sur Newgrounds — fiche

Le paquet : `plateformes/sortie/newgrounds/isnad-<numéro>-newgrounds.zip` (`node v2/tools/plateformes.js newgrounds`) : `index.html`
à la racine, rien d'autre — le paquet web tel quel (le jeu entier, polices embarquées, aucun appel au-dehors ; 2,18 Mo en zip,
5,81 Mo dépaqueté pour la 2.47).

## Ce qui est vérifié, et ce qui ne l'est pas

La page officielle (`https://www.newgrounds.com/wiki/help-information/content-submission/games-and-movies`) a été demandée
deux fois (l'outil de lecture, puis `curl`) : **HTTP 403, les deux fois**. Rien de ce que Newgrounds exige n'a donc été lu
à la source. Tout ce qui suit sur Newgrounds est **non vérifié** ; ce que l'agent croit en savoir est dit « à essayer » et
n'est pas une règle établie.

| Point | État |
|---|---|
| Forme du dépôt d'un jeu HTML5 : un zip avec `index.html` à la racine | **non vérifié** (le zip est fait ainsi, comme celui d'itch.io) |
| Dimensions à déclarer | **non vérifié**. À déclarer : **960 × 540** (16:9, l'image du jeu) ; le jeu s'adapte à la taille du cadre (éprouvé en 960 × 540, 390 × 844, 844 × 390 : voir l'essai) |
| Poids maximal du zip, nombre de fichiers | **non vérifié** (le zip pèse 2,18 Mo, un fichier) |
| Étapes du projet (création, version, publication, classement par âge, étiquettes, jugement par la communauté) | **non vérifié** : à lire sur place, dans le formulaire de dépôt, avant de remplir quoi que ce soit |
| Exigences de contenu (âge, thèmes religieux, droits des images et des sons) | **non vérifié** ; le jeu est sans publicité, sans compte, sans achat, sans aucun appel au-dehors, et tout son contenu est généré par le code |
| Accès à l'API de Newgrounds, aux médailles, aux classements | **non vérifié** ; le jeu n'en utilise aucun (aucun script externe) |

## Les étapes (à suivre dans l'ordre, en lisant ce que le formulaire dit)

1. Le décideur crée ou utilise un compte Newgrounds (l'agent n'en crée aucun).
2. Dans le formulaire de dépôt d'un jeu : titre `ISNAD`, type HTML5, le zip ci-dessus, dimensions **960 × 540**.
3. Description, étiquettes, classement par âge : voir `plateformes/newgrounds-textes-a-valider.md` (propositions).
4. Garder le projet **non publié** (brouillon) tant que le décideur n'a pas essayé le jeu dans le lecteur de la page.

## À essayer sur place (rien de cela n'est éprouvé sur Newgrounds même)

Éprouvé ici, dans un cadre d'une autre origine, sans réseau (`SANS_D=1 node v2/tools/plateformes.js essai newgrounds` : « PAQUET CONFORME ») :
le jeu démarre, la partie se garde et se reprend après rechargement du cadre, « Ta partie » enregistre un fichier et en importe un,
« Partager ma progression » s'ouvre, aucune requête au-dehors, aucune erreur. À regarder dans le vrai lecteur :

- le jeu remplit-il le cadre déclaré, et le bouton de plein écran de la page de Newgrounds (s'il y en a un) lui donne-t-il tout l'écran ?
  (Le jeu, lui, demande le plein écran au premier toucher d'un téléphone tenu en largeur ; dans un cadre qui le refuse, rien ne se casse.)
- la partie se garde-t-elle d'une visite à l'autre (stockage du navigateur dans le cadre) ? Si le navigateur refuse le stockage aux
  cadres tiers, la partie est perdue au rechargement : le jeu le dit seulement dans sa page Diagnostic. « Exporter la partie → Enregistrer le fichier » (dans la halte) reste la sauvegarde.
- le son démarre-t-il au premier toucher (les navigateurs l'exigent) ?
- la page affiche-t-elle la réserve (« Version bêta… », décision 39, `v2/tools/promotion.js`) dans sa description ?

## Ce qui reste au décideur

Le compte, la validation des textes, la publication (jamais faite par l'agent), le classement par âge, et de savoir si ce portail convient
à un sujet religieux et historique : les règles de Newgrounds sur ce point n'ont pas pu être lues.
