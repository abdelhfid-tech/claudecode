# ISNAD v2 — addendum au contrat de données

Complète `docs/schema-saga.md` (toujours valable). Énumérations : `src/core/defs.js`.
Validation : `node tools/validate.js <fichier>` (sagas, veillées) · `node tools/validate-music.js` (musique).

## 1. Ce que la v2 change (décisions du décideur)

1. **La guerre en dernier recours.** Les crises se dénouent d'abord par la parole : délégations, pactes,
   alliances, arbitrages. Le combat (toujours contre un égrégore, jamais contre des personnes) n'arrive
   que lorsque la parole a échoué, ou face à une idole qui ne négocie pas.
2. **Tentatives, succès, échecs.** Un pourparler (`parley`) peut réussir ou échouer ; les deux issues
   font avancer le récit, avec des conséquences (allié gagné ou perdu, combat évité ou plus dur, pilier
   renforcé ou ébranlé).
3. **Le savoir et la prière sont les deux piliers récurrents.** Le savoir ouvre des arguments
   (`need`) ; la prière repose le groupe, donne la Sakîna et un avantage de sérénité dans la parole.
4. **Ambiance « Citadelle ».** Une voix de seigneur du désert qui médite sur ce qui lie les hommes :
   la sentinelle, le puits, le cèdre, le temple bâti pierre à pierre, les provisions qui endorment, le
   sens qui noue les choses, le silence, la prière. S'en inspirer pour le ton ; **ne jamais recopier le
   texte de Saint-Exupéry** (œuvre protégée) : écrire des phrases originales.
5. **Intrigue politique.** Factions, conseils, délégations, retournements. Des groupes aux intérêts
   divergents (tribus, notables perses, communautés juives et chrétiennes sous pacte, marchands,
   moines, soldats) et des **hypocrites fictifs**.
6. **Musique.** Une piste par ambiance (`mus` pour les moments marquants).

## 2. Règles de respect propres à la v2 (non négociables)

- **Aucun groupe n'est un ennemi par nature.** Perses, juifs, chrétiens, tribus : ce sont des acteurs
  politiques aux intérêts légitimes, avec chez chacun des gens d'honneur. Jamais de trait attribué à un
  peuple ou à une religion (ni ruse, ni avidité, ni traîtrise « de nature »). Un désaccord vient d'un
  intérêt, d'une peur, d'un tort subi, d'une personne.
- **Les hypocrites sont des individus fictifs, issus du camp du héros** (un chambellan, un notable, un
  officier) : ils disent ce qu'on veut entendre et servent autre chose. Jamais un Compagnon réel, jamais
  un personnage historique nommé. Leur nom est inventé et sobre.
- **Les personnages historiques non musulmans** (Sophrone, Hurmuzân, Jabala…) gardent leur dignité.
- **Ce qui varie est fictif ou local.** L'issue d'un `parley` ne change jamais un fait historique : elle
  porte sur un enjeu local ou fictif (une tribu de fiction, un quartier, un convoi, un témoin), ou sur
  la *manière* dont l'événement connu est atteint. Les actes des Compagnons restent ceux des sources
  (mécanique `choice`).
- **Alliances de parenté** : possibles comme pacte entre clans, en une phrase sobre, hors champ, sans
  personnage mis en scène ni détail.
- **La prière n'est pas un sortilège.** Elle s'écrit sobrement (« Ils prièrent. ») et se place aux
  moments que les sources attachent à une prière (l'aube de la mort de 'Umar, de 'Alî ; Abû Bakr
  dirigeant la prière ; l'appel de Bilâl à Jérusalem) ou aux haltes naturelles.

## 3. Nouvelles opérations

| op | effet |
|---|---|
| `['emote', qui, pose]` | Fait prendre une attitude à un personnage. `qui` : `'hero'` (le meneur), `'groupe'`, ou l'identifiant d'un PNJ de la carte. `pose` : `prie, resolu, accable, salut, surpris, garde`, ou `null` pour la quitter. L'attitude tient tant que le personnage ne marche pas ; elle tombe au changement de carte pour le groupe. À réserver à ce que le texte dit déjà : on ne prête pas un geste à un Compagnon sans source. |
| `['pray', moment?]` | Halte de prière scriptée. `moment` : `fajr, dhuhr, asr, maghrib, isha` (facultatif). Fondu, carton sobre, groupe restauré, Sakîna, pilier Prière +1 (une fois par chapitre). 3 à 5 par saga. |
| `['pillar', nom, ±n]` | Renforce ou ébranle un pilier : `priere, savoir, justice, lien` ; n = 1 ou 2. |
| `['mus', piste]` | Change la musique jusqu'au prochain changement de carte. Pistes : `titre, chaine, medine, nuit, desert, camp, rome, palais, mer, noos, cite, citadelle, combat, boss, victoire, deuil, espoir, conseil, silence`. |
| `['parley', {...}]` | Pourparler (ci-dessous). |

Chaque carte a désormais un lieu `priere` (halte libre : le joueur peut y prier quand il veut) ; les
villes ont aussi `ecole` (cercle d'étude), la cité romaine `quartier`.
Types de PNJ ajoutés : `savant`, `marchand`, `berbere`, puis `bedouin` (gens des tribus : étoffe de tête
qui retombe sur les épaules ; `look.trim` donne la couleur du cordon et de la ceinture, une par clan ;
`look.item: 'baton'` distingue un cheikh).
Coffre de savoir : `chests: [{ at, codex: 'id' }]` (un feuillet : débloque l'entrée de codex).
`ask` accepte `need: 'idCodex'` sur une option (verrouillée tant que l'entrée n'est pas connue).
`battle` accepte `allies: [{ flag: 'nom_du_drapeau', name: 'Les cavaliers de …' }]` : chaque allié dont le
drapeau est levé frappe en ouverture (un voile retiré à chaque égrégore). Dans une bataille déclarée qui a des
rangs (5 quinquies), il prend place sur le champ à la place : `rang: 'cavaliers'` dit quel rang il forme.

### Le pourparler

```js
['parley', {
  with: 'chef_tayy',                       // id de PNJ ou nom libre de l'interlocuteur
  title: 'La délégation des Banû …',
  intro: 'Ce que veut l’autre, ce qu’il craint. Une phrase.',
  goal: 6,                                  // confiance à atteindre (somme des v choisis)
  rounds: [                                 // 3 à 5 manches
    { say: 'Ce que dit l’interlocuteur.',
      opts: [                               // 2 à 4 arguments
        { t: 'Argument juste.',             el: 'adl',   v: 2,  r: 'Sa réponse.' },
        { t: 'Argument de savoir.',         el: 'ilm',   v: 3,  r: 'Sa réponse.', need: 'id_codex' },
        { t: 'Menace ou flatterie.',        el: 'shajaa', v: -1, r: 'Sa réponse.' }
      ] }
  ],
  win:  [ /* ops : pacte conclu — ['flag','allie_x'], ['pillar','lien',1], … */ ],
  lose: [ /* ops : la parole n'a pas suffi — souvent un ['battle', …] en dernier recours, ou ['pillar','lien',-1] */ ]
}]
```

- `v` de −2 à 3 ; `el` = la vertu de l'argument (`sidq, adl, sabr, rahma, shajaa, ilm`).
- `need` : l'argument n'est disponible que si l'entrée de codex est connue (apprise d'un savant, d'un
  feuillet, d'un témoin). C'est en général le meilleur argument : **le savoir doit payer**.
- Si le groupe a prié dans le chapitre : +1 de confiance au départ (sérénité).
- `goal` : atteignable sans savoir seulement par un sans-faute, confortable avec. Le validateur vérifie
  que `goal` est atteignable et non automatique. `win` et `lose` doivent finir sur la même carte.
- Les mauvaises options sont des tentations humaines (menacer, flatter, promettre trop, mentir par
  omission), jamais des caricatures.
- Un pourparler réussi rapporte autant de Sagesse qu'un combat : la parole n'est pas un raccourci pauvre.

## 4. Les piliers de la Citadelle

Quatre piliers, de 0 à 5 : **Prière**, **Savoir**, **Justice**, **Lien** (ce qui tient les hommes
ensemble : pactes, alliances, parole donnée). Chaque saga a les siens ; les veillées du Caïd bâtissent
la Citadelle elle-même, qui persiste. Effets en combat : Prière → Sakîna de départ ; Savoir → failles
révélées d'emblée ; Justice → dégâts reçus réduits ; Lien → dégâts infligés accrus.
Chaque `codex` débloqué nourrit aussi le Savoir. Viser, par saga : 5 à 8 `pillar` positifs possibles,
2 à 3 négatifs sur les branches d'échec.

## 5. Les veillées du Caïd (`src/data/caid.js`)

Un maillon de la Chaîne entre les Compagnons et Idris : **le Caïd**, seigneur berbère de fiction, héritier
d'un père assassiné, qui apprend à gouverner dans les vies des Compagnons. Après chaque saga, une
**veillée** : il affronte dans sa citadelle une crise qui répond à la leçon reçue. Ici tout est fictif :
les décisions sont libres (`ask`, `parley`), elles ont des conséquences durables sur les piliers.

```js
ISNAD.registerSaga({
  id: 'caid', order: 6, frame: true, veillees: true, narrator: 'Le Caïd',
  name: 'Le Caïd', epithet: 'Seigneur de la Citadelle', arabic: 'القائد', years: 'un maillon de la Chaîne',
  light: 'sabr', lightName: 'Patience', tagline: '…', intro: [], outro: [],
  heroes: { caid: {…}, /* 2 alliés fictifs */ }, enemies: {…}, codex: [...],
  chapters: [ { id: 'v_abubakr', after: 'abubakr', minLvl: 3, last: true, title: '…', sub: '…', map: 'citadelle', … }, … ]
});
```
Un chapitre par saga (`after` = id de la saga : `abubakr, umar, khalid, uthman, ali`), autoportant, jouable
dans n'importe quel ordre. `minLvl` : 3, 5, 6, 7, 8 dans cet ordre. Carte `citadelle` (lieux : `porte, cour,
puits, remparts, tour, salle, mosquee, priere, ecole, souk, jardin, greniers, palmeraie, poterne`) et
`noos`, `desert`. Durée : 6 à 9 minutes ; 1 pourparler au moins, 1 décision libre lourde, 1 combat au plus
(évitable si la parole réussit), 1 `pray`, 2 à 3 `codex`.

## 5 bis. Les rencontres de la Cité-Miroir (`src/data/frame.js`)

Cinq chapitres de l'histoire-cadre, marqués `after: '<saga>'`, `last: true`, `minLvl: 8`. Le moteur en
lance un à la fin de la veillée de cette saga (ou à la fin de la saga si la veillée est déjà faite), puis
revient à la Chaîne et note `rencontres[saga]` dans la sauvegarde. Le dernier maillon porte `fin: true` :
c'est lui qui joue l'envoi final de la saga-cadre.

Gabarit d'une rencontre : l'enfant du parvis (`talk`), la personne (`talk` → `parley`), l'enfant de
nouveau (`talk` → `codex`). Dans le pourparler :

- une option peut demander un savoir d'une autre saga : `need: 'abubakr/deni'`, `need: 'caid/sentinelle'` ;
  le validateur vérifie que l'entrée existe ; chaque manche garde une option sans `need` ;
- l'argument redit ce que l'entrée du Recueil dit déjà, rien de plus ;
- `win` pose un drapeau `ami_*` et monte un pilier ; `lose` mène à un combat contre l'idole de la
  personne (égrégore de palier `elite`, niveau 7, faible à la Patience et à la Lumière de la saga).

À l'épilogue, `allies: [{ flag, name, hp, veil }]` fait revenir les amis gagnés ; `hp` (facultatif) règle la part
de Constance ôtée à l'adversaire, 0.08 par défaut ; `veil: 0` laisse ses voiles intacts.

## 5 ter. Le cœur (version 5)

Contenu commun : `src/data/coeur.js`, un appel à `registerSaga` avec `commun: true` et `chapters: []`.
Il porte `oeuvres` (textes des sept œuvres de `D.OEUVRES`), `lames` et `enemies` (une entrée par mal
de `D.VICES`, l'égrégore portant `vice: '<id>'`), les idées noires (égrégores ordinaires),
`animaux` (`D.ANIMAUX`) et un `codex` de catégorie « Cœur ». Ses égrégores ont `lvl: 0` : leur
niveau se cale sur celui du groupe. Ils sont utilisables dans tous les fichiers de données.

| Champ | Où | Forme | Règle |
|---|---|---|---|
| `noir` | une manche de pourparler | `{ name, group: [égrégore], intro, say?, after?, v?, bg? }` | Avant le choix de la manche ; `v` (1 par défaut, 2 au plus) s'ajoute à la confiance. Interlocuteur de fiction seulement. Si `group` est l'une des cinq idées noires (`D.NOIRS`, une seule), on lui **répond** : pas de combat (version 7). Sinon ce sont des égrégores, et cela se combat. |
| `racine` | un égrégore (fichier de saga) | identifiant de `D.RACINES`, ou tableau | Obligatoire sur l'idole d'un combat lancé avec `boss: true` (son membre de plus haut palier, maux du cœur exceptés). Elle redit la description de l'idole ; l'organigramme l'affiche. |
| `idee: true`, `parole` | les cinq idées noires de `coeur.js` | `parole: { voies: [m1, m2], dit: [l1, l2], rep: {…}, non: {…}, oui?: [l1, l2] }` | Deux voiles. `voies` : la manière qui porte à chaque voile (`parole`, `pedagogie`, `bienveillance`). `rep` : ce que dit le joueur pour chaque manière ; `non` : pourquoi elle ne porte pas. |
| `enigme` | un chapitre de l'histoire-cadre ou des veillées | `{ id, who, cure, title, signe, mot, intro?, solved? }` | `who` est un héros du groupe ; `cure` une œuvre (sauf le pèlerinage) ; la carte doit avoir une natte. |
| `hajj: true` | un chapitre des veillées | booléen | Propose l'intention du pèlerinage sur la natte ; il s'accomplit à la fin du chapitre. |
| `vice` | un chapitre « after » de l'histoire-cadre | identifiant de `D.VICES` | Annonce le mal du cœur de la rencontre (affiché sur la Chaîne et dans « Que faire ? »). |
| `hint` | un objectif | chaîne | Phrase ajoutée à l'aide « Que faire ? » pour cet objectif. |
| `['vices', { bg?, avant?, aucun?, tous?, reste? }]` | opération, histoire-cadre | scripts | Fait se dresser, deux par deux, les maux non tranchés ; puis joue `tous` ou `reste`. |

Drapeaux posés par le moteur, lisibles par `['if', …]` : `lame_<mal>` (lame forgée),
`tranche_<mal>` (mal tranché), `sept_tranches`. Les drapeaux `_o_*` sont ceux de la journée et
s'effacent à chaque chapitre.

## 5 quater. L'organigramme du mal (version 7)

Module `src/core/mal.js` ; textes dans `coeur.js` (`mal` : six rangs, `etage: 'enseigne'` pour ce qui est
enseigné, `etage: 'image'` pour les images du jeu ; les deux premiers rangs citent leur référence dans `src`).

- **L'échelle des réponses** (décision du décideur) : l'idée noire par la parole, la pédagogie, la
  bienveillance ; l'égrégore par le combat ; l'idole par une bataille déclarée ; ni Iblîs ni les souffleurs
  ne se combattent, et l'on ne s'en prend à aucun djinn.
- **La lignée d'un chapitre** est déduite de son récit par `D.parcours` : son idole, ses égrégores.
- **L'enracinement** : de 1 à 5 par idole, part de 3 (plafond 4 au premier chapitre d'un maillon).
  −1 : pourparler gagné, idée noire dissipée du premier coup, égrégore dissipé chez un interlocuteur.
  +1 : pourparler perdu, premier acte choisi que les transmetteurs n'ont pas rapporté. Effets : poids de
  l'épreuve 1, 2 ou 3 ; un voile de moins à 1, un de plus à 5 (première tentative).
- **Sauvegarde** : `mal: { ev: { 'saga/chapitre': { clé: −1 | 0 | 1 } }, tombees: { 'saga:idole': niveau } }`,
  ajouté à la volée (même clé de sauvegarde, aucune migration). Les événements sont à clé : rejouer un
  objectif réécrit la même clé.
- **Garde de nom** du validateur : aucun ennemi, aucune compétence, aucun personnage, aucun interlocuteur
  ne porte le nom d'Iblîs, d'un démon ou d'un djinn. Elle ne regarde ni les textes ni les citations.

## 5 quinquies. La bataille déclarée (version 7)

Module `src/core/rangs.js` ; types, ordres et manœuvres dans `defs.js` (`D.RANGS`, `D.ORDRES`, `D.MANOEUVRES`) ; la
mission dans le chapitre (`bataille`, décrit dans `schema-saga.md`). Toute idole est annoncée par le carton
« Bataille déclarée » ; sans champ `bataille`, le carton dit qu'il n'y a pas de rangs à mener.

- **Le champ** : cinq colonnes sur trois couloirs (aile nord, centre, aile sud). Notre camp à droite, l'idole à
  gauche ; la dernière colonne est à son pied. Le combat du groupe continue comme avant : le champ s'y ajoute, et se
  montre le temps d'un ordre ou d'un pas. Pendant le duel, une bande de quinze cases dit où sont rangs et nuées.
- **Nos rangs** : un à quatre selon la mission et le niveau, plus un allié gagné par la parole. Chacun garde un ordre
  permanent : tenir, avancer, charger (cavaliers), tirer (archers), glisser vers un couloir voisin, se replier. Trois
  points de tenue ; à zéro, le rang se replie et se reforme au camp trois pas plus tard. Personne ne tombe.
- **Les nuées** : les égrégores du chapitre, tels qu'ils sont déjà dessinés. Jamais des hommes. Leur nombre et leur
  cadence suivent l'enracinement (deux nuées et une toutes les quatre pas, jusqu'à quatre et une tous les deux pas).
- **Le pas** : après chaque tour de l'idole, et au plus tard tous les trois tours. Nos rangs d'abord, ceux de l'avant
  en premier ; puis les nuées. Une nuée bordée par un autre rang est prise de flanc ; prise des deux côtés, elle se
  dissipe. Un rang au pied de l'idole découvre son flanc : un voile tombe, une faille se révèle (une fois par couloir).
  Une nuée qui atteint le camp sème le doute chez un compagnon.
- **Ordonner** : au tour d'un compagnon, à la place de son action. Le stratège (`stratege: true`) ordonne sans perdre
  son tour, une fois par tour, et connaît trois manœuvres d'école : réserve mobile, enveloppement, repli feint.
- **Garde-fous** : exigence 19 (proposée). Le validateur refuse un type de rang ou un ordre inconnu, un chiffre dans
  le nom d'un rang, deux rangs à la même place, une bataille sans combat d'idole, une bataille sans rangs qui ne dit
  pas pourquoi.
- **Rien n'est sauvegardé** : le champ naît et meurt avec le combat.

## 5 sexies. Préparation, secours, Valeurs et attributs, portes de la noosphère (version 8)

- **La préparation** (`rangs.js`, `R.panePrepa` ; page ouverte par `ui.js`, `U.prepare`) : avant chaque combat d'idole et à
  chaque reprise. Six points : les hommes, le groupe, l'équipement, les vertus, la besace, le cœur. Elle signale, ne
  bloque rien, et l'on peut s'y équiper. Le joueur de test ne s'y arrête pas.
- **Le secours** (`battle.js`, `leSecours` ; textes : `coeur.js`, `secours`) : dans un combat d'idole, quand tout le groupe
  est éprouvé et que la prière a été tenue dans le chapitre (`S.flags._prayed`), il est relevé une fois par tentative.
  Exigence 20 (proposée).
- **Valeurs et attributs** (`valeurs.js` ; textes : `coeur.js`, `bien`, `valeurs`, `attributs`) : une Valeur par mal du cœur,
  gardée quand il est tranché ; un attribut divin par Valeur, reconnu quand la lame est forgée. Rien de plus dans la
  sauvegarde : tout se lit dans `lames` et `vices`. Page « Valeurs et attributs » de la halte. Exigence 21 (proposée).
- **Les portes de la noosphère** (`valeurs.js`, `V.porte`, `V.descendre` ; textes : `coeur.js`, `portes`) : au sortir de la
  prière, dans le dhikr, en songe (« S'endormir », sur la natte). Une descente par porte et par chapitre (drapeaux
  `_o_porte_*`, effacés à chaque chapitre). Le combat est celui du râwî seul : `battle` accepte pour cela `heros` (un
  groupe prêté), `sansReprise` (on peut revenir sans avoir gagné) et `interieur` (le carton de remontée). Exigence 22
  (proposée).

## 6. Musique (`src/data/music.js`)

```js
ISNAD.registerMusic('medine', {
  bpm: 92, beats: 32,                        // boucle de 32 temps ; chaque voix dure exactement `beats`
  voices: [
    { wave: 'flute',    vol: 0.5,  notes: 'D5/1 Eb5/.5 F#5/.5 G5/2 -/1 A5/1 …' },   // mélodie
    { wave: 'pluck',    vol: 0.3,  notes: 'D3+A3/2 G3+D4/2 …' },                    // accords : notes jointes par +
    { wave: 'triangle', vol: 0.4,  notes: 'D2/2 D2/2 G2/2 A2/2 …' },                // basse
    { wave: 'drums',    vol: 0.35, notes: 'D/1 t/.5 t/.5 T/1 -/1 …' }               // D dum, T tek, t tek léger, k grosse caisse, s caisse claire, h charleston, c cymbale
  ]
});
```
Jeton = `hauteur/durée` ; hauteur `A–G` + `#` ou `b` facultatif + octave 1–7 ; silence `-` ; durée en temps
(0.25, 0.5, 1, 1.5, 2…). Timbres : `pulse, square, triangle, saw, sine, pluck` (oud), `flute` (ney),
`strings, bell, drums`. `victoire` est jouée une fois, les autres en boucle.

## 7. Bâtir (version 3)

Matériaux (`D.MATS`) : `eau, pise, palme, pierre, grain, laine`. Pièces (`D.PIECES`) : `tranchee, puits,
palmier, champ, enclos, bergerie, chamelier, mur, sol, pilier, mihrab, natte, tapis, lanterne, rosace`.
Le joueur récolte (palmier → palme, rocher → pierre, puits ou rive → eau, eau pétrie → pisé, étal →
grain) et pose devant lui, case par case, sur les cartes à ciel ouvert (`medine, koufa, desert, camp,
citadelle`). Ce qui est bâti reste d'un chapitre à l'autre, par saga, et rapporte au début de chaque
chapitre. Une pièce pleine est refusée si elle coupe l'accès à un lieu : on ne peut pas se murer.

| élément | effet |
|---|---|
| `['mat', matériau, n]` | donne (ou retire) des matériaux |
| `['site', { id, name, at, w, h, need: { mur: 10, sol: 8, … }, give: { pise: 24, … } }]` | ouvre un chantier de mosquée sur la carte courante (`at` = coin haut-gauche), livre les matériaux |
| objectif `{ text, build: { piece: 'tranchee', n: 6 } }` | accompli quand la carte courante compte n pièces de ce type |
| objectif `{ text, build: { site: 'id' } }` | accompli quand le chantier est achevé |

Une mosquée achevée devient un lieu de prière et de repos (sur sa natte) ; Prière +1, Lien +1.
Un puits et trois palmiers font une oasis (Lien +1). Six segments de tranchée gardent un lieu ; les
égrégores visibles ne les franchissent pas. Les troupeaux versent leur dû à chaque chapitre (Justice +1).
**Règle de respect** : quand les sources ne disent pas qu'on a bâti à tel endroit, le texte le dit
(« Les sources ne disent pas qui posa la première brique… ») et l'acte est celui du joueur, pas d'un Compagnon.

## 8. Routes : étoiles, caravanes, pillage (version 4)

- **Étoiles.** `D.STARS` : huit caps nommés par l'étoile qui s'y lève ou s'y couche (al-Jady au nord,
  Suhayl au sud, an-Nasr at-Tâ'ir à l'est et à l'ouest, al-'Ayyûq et al-'Aqrab entre eux). Le cadran et
  l'étoile de bord d'écran guident vers l'objectif courant : rien à écrire dans les données. Dans les
  textes, donner les directions par les étoiles (« al-Jady à main gauche »).
- **Comptoir.** Les cartes `medine, koufa, desert, camp, romaine, citadelle` ont un lieu `comptoir` : on y
  vend, on y achète, on y confie une cargaison (retour au chapitre suivant).
- `['lore', id]` débloque un savoir commun à toutes les sagas : `etoiles, caravanes, routes_sures, razzia`.
- `['raid']` joue l'épisode d'une route pillée : des hommes rentrent à pied, on lève des renforts (selon
  le pilier Lien et les enclos de chameaux), pourparler avec le chef des pillards, combat de dernier
  recours contre l'égrégore « La Razzia », partage de ce qui est repris, remise au juge.
**Règle de respect** : celui qui poursuit ne prononce pas la peine ; les pillards sont remis au juge.
