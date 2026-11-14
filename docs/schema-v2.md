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
drapeau est levé frappe en ouverture (un voile retiré à chaque égrégore).

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
| `noir` | une manche de pourparler | `{ name, group: [égrégore], intro, say?, after?, v?, bg? }` | Combat avant le choix de la manche ; `v` (1 par défaut, 2 au plus) s'ajoute à la confiance. Interlocuteur de fiction seulement. |
| `enigme` | un chapitre de l'histoire-cadre ou des veillées | `{ id, who, cure, title, signe, mot, intro?, solved? }` | `who` est un héros du groupe ; `cure` une œuvre (sauf le pèlerinage) ; la carte doit avoir une natte. |
| `hajj: true` | un chapitre des veillées | booléen | Propose l'intention du pèlerinage sur la natte ; il s'accomplit à la fin du chapitre. |
| `vice` | un chapitre « after » de l'histoire-cadre | identifiant de `D.VICES` | Annonce le mal du cœur de la rencontre (affiché sur la Chaîne et dans « Que faire ? »). |
| `hint` | un objectif | chaîne | Phrase ajoutée à l'aide « Que faire ? » pour cet objectif. |
| `['vices', { bg?, avant?, aucun?, tous?, reste? }]` | opération, histoire-cadre | scripts | Fait se dresser, deux par deux, les maux non tranchés ; puis joue `tous` ou `reste`. |

Drapeaux posés par le moteur, lisibles par `['if', …]` : `lame_<mal>` (lame forgée),
`tranche_<mal>` (mal tranché), `sept_tranches`. Les drapeaux `_o_*` sont ceux de la journée et
s'effacent à chaque chapitre.

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

Une mosquée achevée devient un lieu de prière et de sauvegarde (sur sa natte) ; Prière +1, Lien +1.
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
