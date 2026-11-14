# Bande-son

Vingt et une pistes originales, synthétisées par le jeu lui-même (`src/data/music.js`, joué par le
séquenceur de `src/core/base.js`). Aucun fichier son, aucune voix, aucune récitation, aucun appel à la
prière (exigence 9). La musique se coupe séparément du reste (`ISNAD.audio.setMusic`).

**Personne n'a encore écouté cette version.** Elle a été écrite, mesurée et relue par des outils
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

## Le thème de la Chaîne

Six notes, trois maillons qui montent : **(ré) la–sol, si–la, ré**. Chaque maillon saute vers le
haut (quinte, tierce, quarte) et s'accroche un degré sous l'arrivée du précédent ; le rythme est
toujours le même, longue-brève (noire pointée, croche), après une levée sur la tonique. Le thème
complet fait huit mesures : l'énoncé, sa reprise un degré plus haut, puis une réponse qui redescend.

| Forme | Où |
|---|---|
| majeure (si♮) | `titre` (seconde partie, cuivres), `espoir` (en ré puis en fa), `victoire` (fanfare, puis deux fois plus lent) |
| mineure (si♭, demi-cadence à seconde augmentée, cadence picarde) | `titre` (première partie, flûte), `vice` (dernière partie, en do mineur) |
| dorienne (la sixte majeure éclaire le maillon du milieu) | `citadelle`, au cor, en sol |
| en valeurs longues, à 6/8 | `chaine`, aux cloches |
| renversée (les maillons tombent) | `vice`, première partie |

## Les pistes

| Piste | Ton, mode | Tempo | Idée |
|---|---|---|---|
| `titre` | ré mineur harmonique, puis ré majeur | 72 | Quatre mesures de harpe (jouées une fois), le thème à la flûte en mineur, puis aux cuivres en majeur avec contre-chant ; sous-dominante mineure avant la cadence. |
| `chaine` | ré majeur, 6/8 | croche 132 | Suspendu : harpe en balancement, le thème aux cloches, accords empruntés (si♭, do, sol mineur) sur pédale de ré. |
| `medine` | sol dorien, puis si♭ majeur | 96 | Marche souple : flûte, luth, basse marchante, maqsûm et riq ; contre-chant des cordes à la reprise. |
| `nuit` | sol mineur | 60 | Le chant de `medine` ralenti et dépouillé ; sixte napolitaine avant la reprise. |
| `desert` | hijaz sur ré | 76 | Pédale de ré, mélodie ornée de mordants ; le luth répond quand la flûte se tait. |
| `camp` | la mineur | 84 | Veillée d'armes : la flûte veille, le cor répond, le luth s'obstine. |
| `rome` | ré dorien | 66 | Solennel : cuivres en quintes et quartes, flûte en déchant, cadence picarde. |
| `palais` | la mineur harmonique, 6/8 | croche 186 | Danse de cour en croches conjointes ; sixte napolitaine à la cadence. |
| `mer` | sol majeur, 6/8 | croche 144 | Barcarolle, appels de cor ; septième degré abaissé avant la reprise. |
| `noos` | do mineur, la♭ mineur, mi mineur | 104 | Étrange : trois accords mineurs à distance de tierce majeure, cloches, arpège de synthé, pouls de basse. |
| `cite` | mi mineur | 112 | La Cité-Miroir : chant syncopé au synthé, arpèges en doubles croches, basse pulsée. |
| `citadelle` | sol dorien | 63 | Noble et grave : le thème au cor, puis un choral avec la flûte ; timbales, cadence picarde. |
| `conseil` | mi mineur, à cinq temps | 96 | Pourparlers : pédale de mi, fa majeur par-dessus ; la phrase s'arrête sur la dominante. |
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
  les mélodies sont écrites à la main. `B(longueur, …mesures)` signale toute mesure mal comptée, et
  `tools/validate-music.js` en fait une erreur.

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
  voix : chant 0,45 à 0,6 ; second chant 0,35 à 0,5 ; arpèges 0,3 à 0,5 ; nappes 0,2 ; basse 0,3.
- **Deux défauts corrigés.** Chaque note tenue se terminait par un sursaut à plein niveau, et une
  frappe sur quelques-unes laissait passer un échantillon à plein gain (un clic). Le second correctif
  est dans `env()`, que les bruitages et les rythmes de duff utilisent aussi.

## Mesures

Rendu hors ligne de chaque piste en entier, après limiteur (`ISNAD.audio.render(nom)` rend un
`AudioBuffer` avec les mêmes timbres, le même bus et le même limiteur que le jeu) :

- crête de −4,4 dB (`vice`) à −9,6 dB (`conseil`), aucun échantillon écrêté ;
- niveau moyen de −19,0 dB (`rome`) à −23,4 dB (`noos`) ;
- en lecture réelle, le limiteur ne travaille presque plus : 0,7 dB de réduction au plus, contre
  5,9 dB avant ;
- charge de calcul sur la machine de test : 5 à 15 % d'un cœur selon la piste.

Avant cette version, les crêtes montaient jusqu'à −0,4 dB avant limiteur pour un niveau moyen
comparable : c'était le sursaut de fin de note.
