# Écrire le jeu en arabe, en anglais, en japonais

*Consigne de rédaction (2.x). Elle vaut pour l'agent qui écrit et pour celui qui relit.*

Le jeu est écrit en français. Les trois autres langues ne sont **pas des traductions du français** (demande du
décideur, 18 novembre) : chacune raconte les mêmes événements, dans le même ordre, avec les mêmes sources et les mêmes
exigences de respect, **dans les mots de sa propre littérature**. Chaque texte est rangé sous la clé de son texte
français, pour que le moteur le retrouve (`src/core/langue.js`).

## Ce qu'on lit avant d'écrire

1. `AGENTS.md`, « Exigences de respect » : elles valent mot pour mot dans chaque langue.
2. Le glossaire de la langue, `v2/docs/langues/<langue>.md`. Il est **obligatoire** : les termes, les noms propres, la
   translittération, le registre, les guillemets, les chiffres, les formules. Un terme marqué « à valider » s'emploie
   tel quel en attendant le décideur.
3. Le registre des sources, `v2/docs/sources/` (`LISEZ-MOI.md`, puis le fichier du récit et `versets.json`).
4. Le fichier du récit en français, `v2/src/data/<fichier>.js` (ou, pour « moteur » et « tables », les fichiers de
   `v2/src/core/` d'où viennent les textes). On y lit la scène, qui parle, ce qui précède et ce qui suit.

## Ce qu'on écrit

La liste à remplir est `v2/src/lang/<langue>/<fichier>.json`, une entrée par ligne :
`{"k": "clé", "fr": "texte français", "t": "", "ou": "emplacement", "qui": "qui parle"}`. On écrit chaque `t`.

- **Le sens et les faits du français, pas ses mots.** Même information, même ton, même longueur à peu près. On n'ajoute
  aucun fait, aucune date, aucun nom ; on n'en retire aucun. On ne tourne pas une phrase française en calque : on écrit
  comme un auteur de la langue l'aurait écrite.
- **Une parole citée** (`ou` finit par `<quote>1`) et **sa source** (`<quote>2`) : on recopie **exactement** le texte et
  la référence que le registre donne pour cette langue (`ar.texte`, `en.texte`, `ja.texte` ; `….reference`). Le contrôle
  les compare au signe près. Si le registre n'a pas l'entrée, on laisse `t` vide et on le signale.
- **Un verset** cité dans un texte (recueil, `attributs.*.verset`, `secours.verset`) : le texte du registre
  (`versets.json`), recopié tel quel, entre les signes de la langue — ﴿ ﴾ en arabe, “ ” en anglais, 「 」 en japonais.
  Jamais un verset de mémoire, jamais une paraphrase présentée comme un verset.
- **Une parole qui n'est pas dans le registre** (la parole d'un personnage du jeu, d'un égrégore, d'un personnage de
  fiction) s'écrit librement, dans le registre de la langue. On ne met jamais dans la bouche d'un Compagnon une parole
  que le français ne lui prête pas.
- **Les champs** `{nom}`, `{n}`… gardent leur nom. Un champ « tourné à la française » (`de_nom`, `min_lame`, `nombre`,
  `voisins_min`…) a toujours son jumeau nu (`nom`, `lame`, `n`, `voisins`) : on prend le jumeau nu.
- **Selon un nombre**, les formes sont séparées par `¦` et choisies d'après `{n}` : anglais, deux formes (`one¦other`) ;
  arabe, jusqu'à six (`zéro¦un¦deux¦de 3 à 10¦de 11 à 99¦100 et plus`) ; japonais, une seule.
- **Le balisage** reste le même : mêmes balises (`<b>`, `<em>`, `<br>`, `<small>`…), même nombre d'emphases `*…*`.
- **« Idris »** s'écrit comme la langue le nomme : إدريس, Idris, イドリース — exactement, pour que le nom choisi par le
  joueur puisse le remplacer.
- **La place** : une réplique tient dans trois lignes sur un téléphone. Au plus 330 signes en arabe et en anglais, 110
  en japonais ; une narration, 360 et 125 (en japonais, trois lignes d'un téléphone tenu en largeur font environ 110
  caractères).
- **Une annonce** (une ligne du fil, 2.12 · D189) dit un fait, en une ligne de téléphone : environ 56 signes en
  anglais, 60 en arabe, 22 en japonais. Ce sont des repères : c'est la ligne mesurée à l'écran qui compte
  (`node v2/tools/longueurs.js`, qui écrit « À REPRENDRE » sans rien bloquer). L'explication va à la leçon, à l'aide ou
  au Recueil. Des annonces nées ensemble se joignent par « · » : chacune reste une phrase entière, jamais faite de
  morceaux. Une leçon : un outil, un geste, le signe du bouton (☰, ?, ◂ ▸), en une phrase. Les récits ne sont pas
  soumis à ces longueurs : un texte de récit trop long pour un téléphone est signalé au décideur, jamais raccourci.
- Aucun `<` ni `>` hors des balises du français ; aucune description physique de personne (exigence 2) ; aucun nom de
  démon ou de djinn pour un ennemi, aucun Nom divin dans une compétence ou un objet (exigences 6, 8, 18) — `regles.js`
  le vérifie dans chaque langue.

## Comment on remet son travail

- On n'édite pas `v2/src/lang/` à la main. On écrit des fichiers de travail, d'au plus 150 entrées chacun,
  `[{"k": "…", "t": "…"}, …]` (on peut ajouter `"note"`), et on les pose :
  `node v2/tools/langues.js poser <langue> <fichier> <travail.json>`. Plusieurs rédacteurs peuvent poser en même temps,
  même dans un seul fichier : chaque fichier a son verrou.
- Un texte qui revient dans plusieurs fichiers (une même phrase du moteur et d'un récit, un titre d'ouvrage cité
  partout) ne s'écrit que d'une façon : on le pose une fois pour tous, `node v2/tools/langues.js poser <langue> partout
  <travail.json>`.
- On contrôle : `node v2/tools/langues.js <langue> <fichier>` — aucune erreur sur ses propres textes.
- On ne lance ni l'assemblage ni les tests du jeu, et on n'enregistre rien : l'agent principal le fait.

## Relire

Le relecteur ne connaît pas les choix du rédacteur : il lit le français, le glossaire, le registre, et le texte écrit.
Pour chaque entrée, il vérifie le sens et les faits, la langue (naturelle, pas un calque), le registre, les termes du
glossaire, les exigences. Il pose ses corrections de la même façon (`poser`), avec une `note` qui dit pourquoi, et
rend la liste de ce qu'il a changé et de ce qui reste à trancher.

## Le rapport

Le nombre de textes écrits ; les termes hésitants ; tout endroit où le français semble s'écarter d'une source ou des
exigences (on le signale, on ne corrige pas le français) ; tout texte qu'on n'a pas pu écrire.
