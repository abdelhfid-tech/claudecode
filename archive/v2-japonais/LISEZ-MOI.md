# Le japonais de la 2.x, archivé

*Retiré du jeu à la version 2.36 (D230 ; le décideur, 25 novembre : « Tu peux supprimer le japonais dans ce cas », puis
« Pour l'instant » : un retrait, pas un abandon).*

## Pourquoi

La relecture du joueur de 10 à 12 ans (D229) a mesuré les textes japonais contre les 1 026 kanji de l'école primaire
(KANJIDIC2, niveaux 1 à 6) :

- 3 651 textes sur 6 453 (56 %) emploient au moins un kanji qu'on n'apprend pas à l'école primaire ;
- 4 800 (74 %) emploient un kanji au-delà de la quatrième année ;
- cela fait 660 kanji différents hors primaire.

Un enfant de 10 à 12 ans ne pouvait donc pas lire seul plus de la moitié du jeu. Il aurait fallu des furigana (un
changement du moteur) ou réécrire ces mots en kana. Le décideur a préféré retirer la langue.

## Ce qu'il y a ici

- `lang-ja/` : les dix fichiers de textes (`v2/src/lang/ja/` jusqu'à la 2.35), 6 453 textes, à jour du français de la
  2.35 — « De qui tiens-tu cela ? » (D228) compris.
- `ja.md` : le glossaire japonais (`v2/docs/langues/ja.md`).

Le registre des sources (`v2/docs/sources/`) garde ses champs `ja` : ce sont des relevés, ils ne sont pas dans le jeu.

## Ce qui reste dans le jeu

Rien que le joueur voie. Le moteur garde ce qui sert une langue sans espaces entre les mots (`langue.js`, `script.js`,
`partage.js`, `style.css` : `html[data-lang="ja"]`), et `regles.js` ses règles de respect en japonais. Un appareil qui
avait choisi le japonais revient au français (`L.connue`).

## Pour le remettre

Remettre `lang-ja/` dans `v2/src/lang/ja/`, `'ja'` dans `LANGUES`, `ORDRE` et `CHOIX` (`v2/src/core/langue.js`), la police
Noto Serif JP dans `v2/src/page.html`, et la langue dans les outils (`longueurs.js`, `partage.js`, `batir.js`,
`relecture.js`). Puis `langues.js releve` : les textes français changés depuis la 2.35 seront marqués « à revoir ».
Avant cela, trancher la question des kanji.
