# ISNAD — Contrat de données d'une saga

Une saga = un fichier `src/data/saga_<id>.js` qui appelle **une fois** `ISNAD.registerSaga({...})`.
Aucun autre fichier n'est touché. Le fichier est du JavaScript pur (pas d'import, pas de DOM).
Validation obligatoire : `node tools/validate.js src/data/saga_<id>.js` doit afficher ✓.
Les énumérations (éléments, cartes, lieux, ops, objets…) font foi dans `src/core/defs.js`.

## 1. Bible narrative (commune à toutes les sagas)

**Cadre.** An 1508 de l'Hégire (2084). Dans la Cité-Miroir, l'**AGRÉGOR** — un moteur qui agrège l'attention
humaine — fabrique des idoles à la chaîne (tendances, marques, cultes de la personne). Idris, jeune *râwî*
(transmetteur) des Archives basses, découvre la **Chaîne** (*isnâd*) : de témoin en témoin, elle remonte
jusqu'aux Compagnons. Il ne « devient » pas les Compagnons : il marche dans la trace de leurs actes, tels que
les transmetteurs les ont rapportés. Chaque saga lui rend une **Lumière** (une valeur) pour briser l'Agrégor.

**Noosphère / égrégore (doctrine du jeu).** La *noosphère* est la sphère des pensées humaines, l'envers
invisible de chaque lieu. Ce que beaucoup de cœurs regardent ensemble y prend corps : c'est un *égrégore*.
Nourri d'une valeur (véracité, justice…), il éclaire. Nourri de peur, d'orgueil, d'avidité, il devient
**idole** : une chose fabriquée par les hommes, qui finit par les commander. Les idoles de pierre de la
Kaaba ont été brisées ; celles de la noosphère reviennent sous d'autres noms (le Clan, l'Empire, le Héros,
l'Or, la Rumeur, le Juge sans miséricorde).

**Règle d'or du gameplay.** On ne combat **jamais des peuples ni des personnes** : tous les ennemis sont des
égrégores (formes abstraites). Les batailles historiques sont *racontées* ; le combat jouable se déroule dans
la noosphère du lieu, contre l'idole qui se nourrit de l'événement. Les adversaires humains (Byzantins,
Perses, insurgés…) sont montrés avec dignité.

**Mécanique des choix = fidélité à la chaîne.** `choice` propose 2 à 4 actes ; **un seul** (`ok:true`) est
celui que les sources rapportent. Si le joueur choisit un autre acte, la chaîne « vacille », la réponse `r`
explique pourquoi ce n'est pas ce qui fut rapporté, puis le choix est reproposé. Le Compagnon ne fait donc
jamais à l'écran autre chose que ce qui est rapporté de lui. Les fausses options doivent être *plausibles*
(tentations humaines), jamais ridicules ni outrageantes.

**Exigences de respect (non négociables).**
- Le Prophète ﷺ n'est **jamais** représenté ni mis en scène en dialogue ; on l'évoque seulement (« le Messager
  d'Allah ﷺ »). Aucun PNJ ne le figure.
- Personne n'a de visage (direction artistique) : ne jamais décrire de traits physiques.
- Uniquement des événements bien attestés (Ibn Hishâm, at-Tabarî, Ibn Sa'd, Ibn Kathîr, al-Bukhârî, Muslim…).
  Les paroles attestées passent par `['quote', texte, source]`. Les dialogues ordinaires (`say`) sont une
  dramatisation sobre : phrases courtes, dignes, sans familiarité moderne. En cas de doute sur une parole,
  écrire « On rapporte que… » dans la source.
- Aucun personnage féminin mis en scène, aucune romance, aucun sujet intime. Dire « une famille », « les
  gens », « un voyageur ».
- Aucune polémique confessionnelle. Les dissensions entre Compagnons sont évoquées avec retenue, sans
  désigner de coupable ; tous sont nommés avec respect.
- Versets : seulement en « traduction du sens », avec référence (sourate:verset), et seulement ceux dont on
  est certain.
- Ton : épique, grave, lumineux. Français soigné. Translittération simple avec circonflexes
  (Abû Bakr, 'Umar, Khâlid, 'Uthmân, 'Alî, Yarmoûk). Pas de points souscrits.

**Vocabulaire du jeu.** PV = *Constance* ; PM = *Souffle* ; K.O. = *éprouvé* ; boucliers = *voiles* ;
ennemi brisé = *dévoilé* ; boost = *Niyya* (intention) ; ultime = *Sakîna*.

## 2. Structure

```js
ISNAD.registerSaga({
  id: 'umar', order: 2,
  name: "'Umar ibn al-Khattâb", epithet: 'Al-Fârûq', arabic: 'عمر',
  years: '13–23 H · 634–644',
  light: 'adl', lightName: 'Justice',
  ambiance: 'orientale · romaine',            // texte libre affiché
  tagline: 'Une phrase d’accroche.',
  intro: [ /* cartons : nar | quote | title | say | wait | sfx | amb | codex | flash | fade | tint */ ],
  outro: [ /* idem ; doit finir par ['light', '<light>'] */ ],
  heroes: { /* §3 */ }, enemies: { /* §4 */ }, codex: [ /* §5 */ ],
  chapters: [ /* §6 — exactement 3 chapitres */ ]
});
```

## 3. Héros (3 par saga : le Compagnon + 2 alliés historiques)

```js
umar: {
  name: "'Umar", title: 'Al-Fârûq', arabic: 'عمر',
  role: 'gardien',                 // guerrier | gardien | sage | soigneur | stratege
  el: 'adl',                       // élément de son attaque de base « lumineuse » et de son affinité
  look: { robe: '#7b5a3a', head: '#efe7d6', cloak: '#3d2c1e', aura: '#9fd0ff' },   // couleurs hex
  skills: [                        // 5 à 6 compétences, apprises aux niveaux 1,1,2,4,6,8 environ
    { lvl: 1, id: 'durra', name: 'La Durra', desc: 'Coup de férule. Peut étourdir.', cost: 3,
      target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'stun', chance: 0.3 }], anim: 'slash' },
    { lvl: 1, id: 'firasa', name: 'Firâsa', desc: 'Discerne les failles d’un égrégore.', cost: 2,
      target: 'foe', el: 'adl', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
    { lvl: 2, id: 'ronde', name: 'Ronde de nuit', desc: 'Veille sur le groupe : régénération.', cost: 5,
      target: 'allies', fx: [{ st: 'regen', turns: 3 }], anim: 'heal' }
  ],
  limit: { id: 'faruq', name: 'Al-Fârûq', desc: 'Sépare le vrai du faux.', target: 'foes',
           el: 'adl', pow: 2.4, fx: [{ st: 'dispel' }, { st: 'veil', v: -2 }], anim: 'pillar' }
}
```

Champs d'une compétence : `id, name, desc, cost` (Souffle, 2–12), `target` (`foe|foes|ally|allies|self`),
`el` + `pow` (dégâts ; `fer` utilise la Force, les Lumières utilisent l'Esprit ; pow 0.8 faible, 1.3 normal,
1.8 fort, 2.4+ ultime ; diviser par ~1.6 pour une cible `foes`), `hits` (1–5, pow appliqué à chaque coup),
`heal` (1.0 ≈ un tiers de la Constance d'un allié ; 0.6 pour `allies`), `revive:true`, `sp` (fraction de
Souffle rendue, ex. 0.3), `fx:[{st, v, turns, chance, self}]`, `anim`
(`slash|light|burst|wave|pillar|glyph|heal|guard|dark`).

Effets `fx.st` : `atk|mag|def|spd` (v:1 bonus, v:-1 malus, ±30 %, `turns` 3 par défaut) · `stun` (perd son
prochain tour ; `chance`) · `doute` (ne peut plus utiliser de compétence) · `waswas` (dégâts continus) ·
`regen` · `garde` (dégâts ÷2 jusqu'au prochain tour) · `reveal` (révèle les faiblesses) · `cleanse` (retire
les malus d'un allié) · `dispel` (retire les bonus d'un ennemi) · `veil` (v:-1/-2 retire des voiles) ·
`niyya` (v:+1/+2) · `sakina` (v: points de jauge, 0–100) · `taunt` (attire les coups). `self:true` applique
l'effet au lanceur plutôt qu'à la cible.

Les compétences sont des **actes et des vertus**, pas de la magie : « Parole véridique », « Ronde de nuit »,
« Charge tournante », « Largesse », « Sentence juste »… Jamais le nom divin dans un nom de compétence.
Chaque groupe de 3 doit avoir : un soin de groupe ou individuel, un `reveal`, au moins 3 éléments différents
parmi les compétences, et de quoi frapper toutes les faiblesses de ses boss.

## 4. Ennemis (égrégores) — 6 à 9 par saga

```js
accapareur: {
  name: "L'Accapareur", art: 'tower', hue: 45, scale: 2,     // scale 1 petit, 2 moyen, 3 boss
  lvl: 3, tier: 'elite',                                      // minion | elite | boss
  weak: ['rahma', 'adl'], immune: ['fer'],                    // immune optionnel
  veils: 3,                                                   // minion 1–2, elite 3–4, boss 5–7
  skills: [                                                   // l'attaque de base « Assaut » est implicite
    { w: 3, name: 'Thésauriser', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' },
    { w: 2, name: 'Disette', target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'atk', v: -1, chance: 0.5 }], anim: 'dark' }
  ],
  phases: [ { at: 0.5, say: 'Ce que je garde, nul n’aura faim de le voir…', fx: [{ st: 'atk', v: 1 }],
              addSkills: [ { w: 3, name: 'Greniers clos', target: 'foes', el: 'fer', pow: 1.0, anim: 'dark' } ] } ],
  taunts: ['Encore un peu. Juste un peu plus.'],             // murmures aléatoires (optionnel)
  desc: 'Texte de codex : de quoi cet égrégore se nourrit, comment il est brisé.'
}
```

`target` côté ennemi : `foe`/`foes` = les héros ; `self`/`ally`/`allies` = les égrégores. `w` = poids.
Formes (`art`) : `wisp` murmure · `mask` masque vide · `eagle` enseigne impériale · `crown` couronne ·
`throne` trône · `tower` tour de pièces · `lens` grappe de lentilles · `mirror` miroir · `swarm` nuée de
glyphes · `idol` monolithe · `scale` balance brisée · `blade` faisceau de lames · `wave` abîme ·
`banner` nœud d'étendards · `colossus` colosse doré sans visage.

**Équilibrage (le moteur calcule les stats depuis lvl + tier).** Le groupe commence niveau 1 ; le moteur le
remonte au minimum à 1 / 4 / 6 au début des chapitres 1 / 2 / 3. Niveaux d'ennemis conseillés :
ch. 1 → sbires 1–2, élite 3 ; ch. 2 → sbires 3–4, élite ou boss 5 ; ch. 3 → sbires 5–6, élite 7, boss final
8–9 (`tier:'boss'`, `scale:3`, 2 phases). Un boss combat seul ou avec 2 sbires au plus. Les faiblesses d'un
boss doivent raconter quelque chose (l'Idole du Héros est `immune:['fer']` et faible à `sabr` et `sidq`).

## 5. Codex — 8 à 14 entrées

```js
{ id: 'ramada', cat: 'Événement', title: "L'Année des cendres",
  text: '3 à 6 phrases, factuelles et sourcées.', src: 'at-Tabarî, Târîkh ; Ibn Sa\'d, Tabaqât' }
```
`cat` : `Biographie | Événement | Noosphère | Lieu | Parole`. Débloquées par `['codex', id]`.
Prévoir : la biographie du Compagnon et de ses 2 alliés, chaque événement majeur, chaque idole (cat.
Noosphère), 2–3 paroles.

## 6. Chapitres

```js
{
  id: 'u1', title: 'Les Rondes de nuit', sub: 'An 18 H · 639 · Médine',
  map: 'medine', opts: { time: 'night' }, start: 'maison',
  party: ['umar', 'aslam'],                         // 1 à 3 ids de héros
  npcs: [
    { id: 'aslam', name: 'Aslam', hero: 'aslam', at: ['maison', 1, 0],          // hero:'id' copie le look
      talk: [['say', 'aslam', 'Je porte la lanterne, Commandeur des croyants.']] },
    { id: 'veilleur', name: 'Veilleur', at: 'porte_nord', look: { kind: 'soldat', robe: '#5a4632', head: '#d8cfc0' },
      talk: [['say', 'veilleur', 'Rien à signaler, sinon le vent.']] },
    { id: 'pere', name: 'Voyageur', at: 'enclos', hidden: true, look: { kind: 'homme', robe: '#6b5a48', head: '#c9bda8' } }
  ],
  foes: [ { id: 'f1', at: 'palmeraie', group: ['murmure', 'murmure'], bg: 'ville' } ],   // ennemis visibles sur la carte
  chests: [ { at: ['souk', 2, 1], item: 'dattes', n: 2 } ],
  intro: [ ['title', 'Les Rondes de nuit', 'An 18 de l’Hégire'], ['nar', '…'] ],
  objectives: [
    { text: 'Rejoindre Aslam devant la maison', talk: 'aslam', then: [ ['say', 'aslam', '…'], ['join', 'aslam'] ] },
    { text: 'Gagner la porte nord', goto: 'porte_nord', then: [ ['show', 'pere'], ['say', 'umar', '…'] ] },
    { text: 'Dissiper les murmures de la palmeraie', foe: 'f1', then: [ ['nar', '…'] ] },
    { auto: true, then: [ ['map', 'noos', 'seuil', { hue: 45 }], ['battle', { group: ['accapareur'], bg: 'ville', boss: true, intro: '…' }] ] }
  ],
  outro: [ ['codex', 'ramada'], ['nar', '…'] ]
}
```

**Objectifs** (séquentiels) : un seul déclencheur parmi `goto:'lieu'` (atteindre un lieu de la carte
courante), `talk:'pnj'` (le PNJ doit être sur la carte courante), `foe:'id'` (vaincre un ennemi visible de
la carte courante), `auto:true` (immédiat). `text` est affiché dans le journal de quête ; une flèche guide
le joueur. Après le dernier objectif : `outro`, puis chapitre suivant.

**Cartes et lieux** (`at`, `goto`, `start`) — `at` vaut `'lieu'` ou `['lieu', dx, dy]` (décalage en cases) :

| carte | lieux |
|---|---|
| `medine`, `koufa` (ville arabe) | `mosquee_cour, mosquee_porte, place, souk, halle` (Saqîfa à Médine / tribunal à Koufa)`, maison, puits, palmeraie, porte_nord, porte_sud, enclos, colline` |
| `desert` | `depart, dunes, rochers, oasis, source, caravane, crete, ruines, arrivee` |
| `camp` (camp militaire) | `entree, tente_chef, feu, etendard, lignes, enclos, tertre, tentes` |
| `romaine` (Damas, Jérusalem, Homs…) | `porte, cardo, forum, basilique, esplanade, palais, fontaine, remparts, jardin, marche` |
| `palais` (palais perse, salle du trône) | `entree, nef, trone, tresor, colonnade, jardin` |
| `navire` (navires enchaînés) | `poupe, pont, mat, proue, passerelle, pont2` |
| `noos` (noosphère, néons) | `seuil, noeud1, noeud2, noeud3, faille, miroir, coeur` |

`opts` : `{ time: 'day'|'dusk'|'night'|'dawn' }` ; pour `noos` : `{ hue: 0–360 }`.
Un PNJ ou un `foe` peut vivre sur une autre carte que celle du chapitre via `map: 'noos'`.

**Opérations de script**

| op | effet |
|---|---|
| `['say', qui, texte]` | réplique. `qui` = id de héros / id de PNJ / nom libre (« Un bédouin »). ≤ 300 caractères |
| `['nar', texte]` | narration (voix de la Chaîne). ≤ 340 caractères |
| `['quote', texte, source]` | parole attestée, carton solennel avec la source |
| `['title', grand, petit]` | carton-titre |
| `['choice', question, [{t, ok:true, r:[ops]}, {t, r:[ops]}…]]` | choix de fidélité (cf. §1) : une seule `ok:true` ; chaque option fausse a un `r` explicatif |
| `['ask', question, [{t, r:[ops]}…]]` | choix libre sans jugement (questions à un PNJ) |
| `['battle', {group:[ids], bg, boss:true?, intro:'phrase'}]` | combat. `bg` : `noos, desert, ville, camp, romaine, palais, mer, cite` |
| `['map', carte, lieu, opts?]` | change de carte (fondu automatique) |
| `['tp', qui, at]` / `['walk', qui, at]` | téléporte / fait marcher `'hero'` ou un PNJ |
| `['face', qui, 'up'|'down'|'left'|'right']` | oriente |
| `['show', pnj]` / `['hide', pnj]` | fait apparaître / disparaître un PNJ (`hidden:true` au départ) |
| `['fade', 'out'|'in', ms?]`, `['wait', ms]`, `['shake', ms?]`, `['flash', couleur?]`, `['tint', couleur|null]` | mise en scène |
| `['sfx', nom]` | `duff, tek, roll, hit, break, light, wind, door, crowd, wave, glitch, blip` |
| `['amb', nom]` | ambiance : `vent, nuit, foule, feu, mer, noos, cite, silence, bataille` |
| `['give', objet, n?]` | `dattes, eau, pain, miel, musc, lait, siwak` |
| `['join', héros]` / `['leave', héros]` | modifie le groupe |
| `['codex', id]` | débloque une entrée |
| `['heal']` | restaure le groupe |
| `['flag', nom, valeur?]`, `['if', nom, [ops], [sinon]?]` | drapeaux locaux à la saga |
| `['light', élément]` | accorde la Lumière de la saga (dernière op de `outro` de saga) |

## 7. Gabarit d'une saga (durée cible : 20–25 min)

- `intro` de saga : 4–7 cartons (contexte, l'homme, l'idole qu'il affrontera).
- 3 chapitres. Chacun : `intro` (titre + 2–4 cartons), 4–6 objectifs, 2–3 combats (dont 1 élite ou boss,
  joué dans `noos` ou annoncé par `['map','noos','seuil',{hue}]`), 1–2 `choice`, 1 `quote` au moins,
  3–5 PNJ dont 2 d'ambiance avec un `talk` court et instructif, 1–2 coffres, 2–4 `codex`.
- Chaque chapitre varie le jeu : exploration, dialogue, descente en noosphère, boss.
- `outro` de saga : mort ou départ du Compagnon avec sobriété, legs, `['light', …]`.
- Volume : 450–650 lignes de JS. Répliques courtes (1–3 phrases). Pas de pavés.
