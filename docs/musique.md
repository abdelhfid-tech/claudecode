# Bande-son

Vingt et une pistes originales, synthétisées par le jeu lui-même (`src/data/music.js`, joué par le
séquenceur de `src/core/base.js`). Aucun fichier son, aucune voix, aucune récitation, aucun appel à la
prière (exigence 9). La musique se coupe séparément du reste (`ISNAD.audio.setMusic`).

**Personne n'a encore écouté ces pistes.** Elles ont été écrites, mesurées et relues par des outils
(durées, frottements entre voix, niveaux, charge de calcul), pas par une oreille. Le mixage en
particulier est réglé au sonomètre : une écoute humaine doit le confirmer ou le corriger.

## Le parti pris

À la demande du décideur, la bande-son reprend le *métier* des partitions de JRPG 16 bits, celles de
Nobuo Uematsu en particulier : des mélodies qui se chantent, en phrases A/B ; un contre-chant ; un
accompagnement en arpèges (harpe, luth) ; une basse qui marche ou qui s'obstine ; des couleurs
modales, des accords empruntés, des médiantes chromatiques, quelques cadences picardes.

On imite un artisanat, pas des notes : **aucune mélodie, aucun arpège-signature, aucune fanfare n'est
repris d'une œuvre existante.** Trois tournures trop reconnaissables sont évitées exprès : l'arpège
montant en escalier (1-2-3-5) d'un prélude célèbre, la fanfare en notes répétées par triolets, et
l'enchaînement ♭VI–♭VII–I à la fin d'une fanfare. Toute retouche doit garder cette règle.

## La couleur arabo-andalouse

Seconde passe, à la demande du décideur : six pistes prennent une couleur inspirée de la musique
arabo-andalouse du Maghreb, celle de la nûba. **C'est une évocation, pas une reconstitution** : rien
n'est cité, aucune mélodie de ce répertoire n'est reprise, et l'écriture reste celle d'un JRPG.

Ce qui est emprunté à cette tradition, en termes simples :

- **Un prélude sans percussion.** Avant que le rythme n'entre, le luth joue seul, en valeurs
  inégales, sur une note tenue, et redescend par degrés vers la finale. Il est écrit dans le champ
  `intro` : on ne l'entend qu'une fois (`citadelle`, `medine`).
- **L'hétérophonie.** Plusieurs instruments jouent le même chant, chacun à sa manière : la flûte ou
  les cordes le tiennent, le luth le double en refrappant les notes longues et en y glissant un
  mordant vers le degré supérieur. La doublure ornée est calculée à partir du chant (`het` dans
  `music.js`), elle ne peut donc pas s'en écarter.
- **L'appel et la réponse.** Un pupitre énonce, un autre répond : dans `citadelle`, le cor lance le
  thème et le luth, soutenu par les cordes, lui renvoie le premier maillon en valeurs brèves.
- **Le balancement entre trois et deux.** Les percussions (frappes de darbouka `D` `T` `t`,
  cymbalettes de târ `r`) et parfois le luth groupent huit croches en 3 + 3 + 2 contre la mesure à
  quatre temps ; `conseil`, à cinq temps, est marqué 3 + 2. Ce sont des groupements choisis pour ce
  balancement : **ils ne transcrivent aucun cycle rythmique savant et n'en portent pas le nom.**
- **Les cadences qui redescendent.** Les fins de phrase ajoutées vont vers la finale par degrés
  conjoints (mi ré do si la, la sol fa# mi, do si la sol).

Ce qui n'en vient pas, et qu'il faut savoir :

- Les accords, les nappes et la basse restent ceux de la première passe. La tradition évoquée
  n'harmonise pas ; ici l'harmonie est seulement allégée quand le chant est doublé.
- Le synthétiseur ne joue que les douze demi-tons du tempérament égal : aucune inflexion fine de
  l'intonation.
- Les modes sont ceux déjà en place (sol dorien, ré à seconde augmentée, la mineur, mi mineur).
  Aucun nom de mode de la nûba n'est revendiqué, faute de pouvoir le garantir.
- Le cor de `citadelle` et les cuivres de `camp` n'appartiennent pas à cet instrumentarium : ils sont
  là pour le thème de la Chaîne et pour l'écriture JRPG.

**Non jugé à l'oreille** : si les mordants s'entendent comme des ornements ou comme des notes en
trop, si la doublure à l'unisson sonne comme une hétérophonie ou comme un flou, si le 3 + 3 + 2 se
sent sous un chant écrit à quatre temps, et si les préludes de luth seul ne paraissent pas trop
discrets avant l'entrée de l'ensemble.

## Le thème de la Chaîne

Six notes, trois maillons qui montent : **(ré) la–sol, si–la, ré**. Chaque maillon saute vers le
haut (quinte, tierce, quarte) et s'accroche un degré sous l'arrivée du précédent ; le rythme est
toujours le même, longue-brève (noire pointée, croche), après une levée sur la tonique. Le thème
complet fait huit mesures : l'énoncé, sa reprise un degré plus haut, puis une réponse qui redescend.

| Forme | Où |
|---|---|
| majeure (si♮) | `titre` (seconde partie, cuivres), `espoir` (en ré puis en fa), `victoire` (fanfare, puis deux fois plus lent) |
| mineure (si♭, demi-cadence à seconde augmentée, cadence picarde) | `titre` (première partie, flûte doublée par le luth), `vice` (dernière partie, en do mineur) |
| dorienne (la sixte majeure éclaire le maillon du milieu) | `citadelle`, en sol : l'appel au cor, la suite aux cordes et au luth |
| en valeurs longues, à 6/8 | `chaine`, aux cloches |
| renversée (les maillons tombent) | `vice`, première partie |

## Les pistes

Les pistes marquées ◆ portent la couleur arabo-andalouse.

| Piste | Ton, mode | Tempo | Idée |
|---|---|---|---|
| `titre` ◆ | ré mineur harmonique, puis ré majeur | 72 | Quatre mesures de harpe (jouées une fois), le thème à la flûte en mineur, que le luth double en l'ornant (une touche seulement), puis aux cuivres en majeur avec contre-chant ; sous-dominante mineure avant la cadence. |
| `chaine` | ré majeur, 6/8 | croche 132 | Suspendu : harpe en balancement, le thème aux cloches, accords empruntés (si♭, do, sol mineur) sur pédale de ré. |
| `medine` ◆ | sol dorien, puis si♭ majeur | 96 | Prélude de luth seul (joué une fois), puis marche souple : flûte, luth, basse marchante. À la reprise, le luth quitte l'accompagnement pour doubler le chant en l'ornant, sur un cycle 3 + 3 + 2 ; contre-chant des cordes. |
| `nuit` | sol mineur | 60 | Le chant de `medine` ralenti et dépouillé ; sixte napolitaine avant la reprise. |
| `desert` ◆ | ré, seconde augmentée (hijaz) | 76 | Pédale de ré, mélodie ornée de mordants ; luth et percussions groupés 3 + 3 + 2. Dans la seconde partie les cordes tiennent le chant avec la flûte, puis le luth le double en l'ornant ; il répond quand la flûte se tait. |
| `camp` ◆ | la mineur | 84 | Veillée d'armes : la flûte veille, le luth la double en l'ornant, le cor répond ; cycle clairsemé 3 + 3 + 2 ; le luth conclut en redescendant par degrés. |
| `rome` | ré dorien | 66 | Solennel : cuivres en quintes et quartes, flûte en déchant, cadence picarde. |
| `palais` | la mineur harmonique, 6/8 | croche 186 | Danse de cour en croches conjointes ; sixte napolitaine à la cadence. |
| `mer` | sol majeur, 6/8 | croche 144 | Barcarolle, appels de cor ; septième degré abaissé avant la reprise. |
| `noos` | do mineur, la♭ mineur, mi mineur | 104 | Étrange : trois accords mineurs à distance de tierce majeure, cloches, arpège de synthé, pouls de basse. |
| `cite` | mi mineur | 112 | La Cité-Miroir : chant syncopé au synthé, arpèges en doubles croches, basse pulsée. |
| `citadelle` ◆ | sol dorien | 63 | Noble et grave, huit voix. Prélude de luth seul (joué une fois) ; le cor appelle avec le début du thème, le luth et les cordes répondent, puis l'ensemble porte le chant ; seconde partie avec la flûte ; târ et darbouka en 3 + 3 + 2 ; cadence picarde. Les timbales de la première version ont cédé la place aux percussions à main. |
| `conseil` ◆ | mi mineur, à cinq temps | 96 | Pourparlers : cinq temps marqués 3 + 2, pédale de mi, fa majeur par-dessus ; le luth répond aux fins de phrase en redescendant vers la finale ; les cordes tiennent le chant à la fin ; la phrase s'arrête sur la dominante. |
| `combat` | sol mineur, puis si♭ majeur | 152 | Levée en fusée sur la gamme hijaz (jouée une fois), basse en doubles croches, caisse claire sur les temps faibles, appels de cuivres. |
| `boss` | ré mineur | 126 | Plus lent, plus lourd : un ostinato qui frotte (seconde mineure, triton) sous des accords changeants. |
| `vice` | do mineur | 132 | L'adversaire final, sept voix : glas, la Chaîne renversée, les accords de `noos`, puis le thème droit jusqu'à une cadence picarde. |
| `victoire` | ré majeur | 132 | Fanfare de neuf temps sur le thème (IV–V–I), puis boucle douce de huit mesures. |
| `deuil` | ré mineur, à trois temps | 56 | Flûte, harpe, basse ; la fin reste ouverte, sans tierce. |
| `espoir` | ré majeur, puis fa majeur | 96 | Le thème s'ouvre : flûte seule, puis une tierce plus haut avec cuivres, cordes et harpe. |
| `lame` | ré, quartes et quintes à nu | 80 | Une lame se forge : choral de cuivres, enclume ; la tierce majeure n'arrive qu'au dernier accord. Huit mesures. |
| `rencontre` | la majeur | 84 | Un soir de 2084 : la boîte à musique pose la question et reste sur la dominante, le roseau répond ; sous-dominante mineure. |

## Format

`ISNAD.registerMusic(nom, { bpm, beats, intro?, voices: [{ wave, vol, pan?, notes }] })`

- `notes` : jetons `hauteur/durée` en temps ; accord `do+mi+sol` avec `+` ; silence `-`.
- `intro` (facultatif) : nombre de temps joués une seule fois ; la boucle reprend ensuite à ce temps.
- `pan` (facultatif) : de −1 (gauche) à 1 (droite).
- Une à huit voix. Timbres : `D.WAVES`. Percussions (`wave: 'drums'`) : `D` dum, `T` tek, `t` tek
  léger, `r` riq, `k` grosse caisse, `b` grand tambour, `m` tom, `s` caisse claire, `h` charleston,
  `c` cymbale, `a` enclume.
- Dans `music.js`, l'accompagnement se déduit d'une grille d'accords (`acc`, `pads`, `fig`) ; seules
  les mélodies sont écrites à la main. `het` calcule la doublure ornée d'un chant ; `two` frappe une
  note sur deux cordes à l'unisson, pour que le luth seul sorte un peu plus fort.
  `B(longueur, …mesures)` signale toute mesure mal comptée, et `tools/validate-music.js` en fait une
  erreur.

`victoire` : `battle.js` n'a pas changé. Il pose `afterJingle` avant la fanfare, puis à la fermeture
de la carte de victoire ; posé pendant que `victoire` joue, il veut dire « on s'en va » : la piste
d'avant reprend dès la fin de la fanfare, ou aussitôt si la boucle douce a commencé.

## Timbres : ce qui a changé

- **Tables d'ondes.** Chaque timbre a un spectre fixe, comme un échantillon de console ; l'éclat de
  l'attaque est une seconde couche vite éteinte. Plus aucun filtre balayé note par note.
- **Nouveaux timbres** : `harp`, `brass` (le cuivre « s'ouvre » à l'attaque), `pad`, `bass`
  (synthé), `contra` (contrebasse pincée, pensée pour rester audible sur un petit haut-parleur :
  ses harmoniques portent la ligne quand la fondamentale ne passe pas), `timp`. `pulse` est
  désormais un rectangle à 25 %, distinct de `square`. La flûte a un souffle, les notes tenues un
  vibrato retardé.
- **Percussions** : grosse caisse et caisse claire refaites ; riq, grand tambour, tom, enclume ajoutés.
- **Espace** : écho filtré et petite salle calculée (convolution d'un bruit décroissant, sans
  fichier) ; panoramique par voix ; chaque piste a son bus, d'où un fondu propre d'une piste à l'autre.
- **Niveaux étalonnés** : à `vol` égal, tous les timbres donnent le même niveau pondéré A sur une
  phrase d'essai (les timbres pincés 3 dB en dessous). Dans une piste, `vol` dit donc la place de la
  voix : chant 0,45 à 0,6 ; second chant et doublures 0,35 à 0,5 ; arpèges 0,3 à 0,5 ; nappes 0,2 ;
  basse 0,3.
- **Deux défauts corrigés.** Chaque note tenue se terminait par un sursaut à plein niveau, et une
  frappe sur quelques-unes laissait passer un échantillon à plein gain (un clic). Le second correctif
  est dans `env()`, que les bruitages et les rythmes de duff utilisent aussi.

La seconde passe n'a touché ni aux timbres ni au séquenceur : seulement à `music.js`.

## Mesures

Rendu hors ligne de chaque piste en entier, après limiteur (`ISNAD.audio.render(nom)` rend un
`AudioBuffer` avec les mêmes timbres, le même bus et le même limiteur que le jeu), après la seconde
passe :

- crête de −4,3 dB (`vice`) à −9,0 dB (`conseil`), aucun échantillon écrêté ;
- niveau moyen de −19,0 dB (`rome`) à −23,4 dB (`noos`) ;
- les six pistes retouchées : `titre` −5,6 et −19,1 dB ; `medine` −6,1 et −19,7 ; `desert` −7,4 et
  −19,7 ; `camp` −6,6 et −20,8 ; `citadelle` −4,9 et −19,4 ; `conseil` −9,0 et −21,2 (crête, puis
  niveau moyen) ;
- en lecture réelle, le limiteur ne travaille presque plus : 0,7 dB de réduction au plus, contre
  5,9 dB avant la première passe ;
- charge de calcul sur la machine de test : 5 à 15 % d'un cœur selon la piste.

Avant la première passe, les crêtes montaient jusqu'à −0,4 dB avant limiteur pour un niveau moyen
comparable : c'était le sursaut de fin de note.
