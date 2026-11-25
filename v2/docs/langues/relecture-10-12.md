# La relecture du joueur de 10 à 12 ans

*Consigne (D229 ; le décideur, 25 novembre : « une relecture / correction langue par langue par fable dans la peau d'un
joueur de 10-12 ans passionné de rpg qui maîtrise la langue en question ainsi que l'histoire des compagnons »). Elle vaut
pour celui qui lit, pour celui qui contre-lit, et pour l'agent qui applique.*

## Qui lit

Un enfant de 10 à 12 ans. Il adore les jeux de rôle : il en a fini plusieurs, il connaît leurs mots (les tours, les
points, l'équipement, les quêtes). Il lit couramment la langue du fichier, comme un bon lecteur de son âge — pas comme
un adulte. Il connaît l'histoire des Compagnons : il l'a apprise, il sait qui est qui, ce qui s'est passé après la mort
du Prophète ﷺ, et dans quel ordre.

Il lit le jeu **dans l'ordre où on le joue**, texte après texte, en sachant qui parle (`qui`) et où (`ou`). Il ne saute
rien.

## Ce qu'il relève : cinq cases

| Case | Ce qu'il se dit | Exemples |
|---|---|---|
| **A · Faute** | « C'est mal écrit. » | orthographe, accord, conjugaison, ponctuation, mot oublié ou doublé, coquille ; un nom ou un terme écrit de deux façons ; en arabe vocalisé, un signe faux ; un champ `{…}` ou une balise abîmés |
| **B · Pas compris** | « Je n'ai pas compris. » | un mot qu'un enfant de 10 à 12 ans ne connaît pas et que rien n'explique ; une phrase si longue qu'il perd le fil ; un terme arabe jamais expliqué ; une allusion qu'il ne peut pas saisir |
| **C · Ça sonne faux** | « Personne ne dit ça. » | un calque d'une autre langue ; un ton qui n'est pas celui d'un jeu ; un mot que les joueurs de RPG de cette langue n'emploient pas pour cette chose |
| **D · Pas ce que j'ai appris** | « Ce n'est pas ce qu'on m'a raconté. » | un fait, une date, un nom, un titre, un ordre des événements de l'histoire des Compagnons qui l'étonne |
| **E · Je ne sais pas quoi faire** | « Et maintenant, je fais quoi ? » | un objectif, une leçon, une aide qui ne dit pas le geste à faire, ni où aller |

**La mesure** (choix du décideur : « Fautes + ce qui bloque ») : le ton des récits et des veillées reste. On ne relève
en B et en C que ce qui **bloque** vraiment un enfant de cet âge ou lui fait décrocher — pas tout ce qu'un adulte
écrirait autrement. Un beau mot que le contexte éclaire n'est pas une gêne. Dans le doute, on ne relève pas.

## Ce qu'on ne touche jamais

- Une **parole citée** et sa **source** (les textes marqués `intouchable`), un **verset**, un **Nom divin**, une formule
  (ﷺ) : on ne propose aucune autre rédaction. Si l'enfant ne comprend pas, on le signale en B, sans proposition.
- Un **fait** : une proposition ne change, n'ajoute ni ne retire aucun fait, aucune date, aucun nom. La case D ne porte
  jamais de proposition : elle dit ce qui étonne et ce qu'il faudrait vérifier (`v2/docs/sources/`). Rien n'est affirmé
  de mémoire.
- Les **mots du jeu**, fixés par le décideur : chimère, Agrégor, Constance, Souffle, Niyya, Sérénité, éprouvé, voiles,
  dévoilé, figure (le héros, le sage, le saint), râwî, la Chaîne, le Recueil, la halte ; et dans chaque langue, ce que
  son glossaire a retenu pour eux (`v2/docs/langues/<langue>.md`). Si l'un d'eux gêne l'enfant, on le dit une fois, en
  B, sans proposition.
- La **translittération** du français (Abû Bakr, 'Umar, Khâlid : les circonflexes) et celle de chaque glossaire.
- Les **champs** `{nom}`, `{n}`, le séparateur `¦`, les **balises** (`<b>`, `<em>`, `<br>`…), les emphases `*…*` : une
  proposition les garde tels quels, au même nombre.
- Les **exigences de respect** d'`AGENTS.md` : aucune description physique, aucun pouvoir prêté à une œuvre, etc.

## Ce qu'on ne relève pas (déjà connu, déjà devant le décideur)

- En français : l'espace devant « ? ! : ; » et dans les guillemets (ordinaire ou insécable), et la forme de
  l'apostrophe (' ou ’).
- Ce que proposent déjà `relecture-francais.md` et `propositions-francais.md`.
- La longueur d'un texte pour l'écran : `longueurs.js` s'en charge.

## Ce que rend le lecteur

Une liste, un point par gêne :

- `k` : la clé du texte ; `fichier` ;
- `case` : A, B, C, D ou E ;
- `extrait` : les mots en cause, recopiés ;
- `gene` : ce qui gêne, dit simplement, comme l'enfant le dirait, puis en une phrase la raison précise ;
- `proposition` : **le texte entier**, corrigé, prêt à poser (vide en D, et quand le texte est intouchable) ; en arabe,
  `proposition_tv` : sa forme entièrement vocalisée ;
- `certitude` : « sûr » (une faute que tout correcteur reconnaît), « probable », « à discuter ».

Et, en quelques phrases, son **impression** de lecteur : ce qui l'a accroché, où il a décroché.

## Ce que fait le contre-lecteur

Il cherche à **faire tomber** chaque point. Un point tombe si :

- ce n'est pas une faute (case A) : la forme est correcte, ou c'est un choix du glossaire ou du décideur ;
- la proposition change un fait, en ajoute ou en retire un ; touche une parole citée, un verset, un mot du jeu ;
- un champ, une balise ou une emphase est modifié ; la proposition est nettement plus longue que le texte ;
- un enfant de 10 à 12 ans comprend très bien le texte tel qu'il est (cases B et C relevées par excès) ;
- la proposition est moins bonne que le texte, ou introduit une faute ;
- c'est déjà connu (voir plus haut).

Il peut **corriger** une proposition (verdict « modifier ») et **changer de case**. Pour la case A, il ne garde que ce
qui est certain.

## Ce que fait l'agent ensuite

- **Case A gardée** : appliquée tout de suite (le français dans `v2/src/data/` ou `v2/src/core/`, puis
  `langues.js releve` ; les autres langues par `langues.js poser`, note « relecture 4 (joueur de 10 à 12 ans) » ; l'arabe
  vocalisé par `voyelles.js poser`).
- **Cases B, C, E gardées** : sur la page privée de validation, avant et après ; rien ne change sans le oui du décideur.
- **Case D** : signalée au décideur, à part.
- Puis les contrôles (`AGENTS.md`), et un nouveau numéro de version à chaque enregistrement qui change le jeu.
