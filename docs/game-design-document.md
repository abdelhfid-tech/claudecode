# Document de game design — étape 1

Artefact de spécification du type « jeu ». Le contrat de données détaillé est dans `schema-saga.md` ;
les valeurs chiffrées font foi dans `src/core/battle.js` et `src/core/defs.js`.

## Concept

*ISNAD — Chroniques des Compagnons.* Un JRPG au tour par tour, en pixel art rehaussé d'effets HD. On y
suit cinq Compagnons du Prophète ﷺ après sa mort, de 632 à 661. Le joueur ne réécrit pas leur histoire :
il la retrouve, acte par acte, et affronte dans la noosphère les idoles que chaque époque a fabriquées.

## Piliers

1. **Fidélité.** Ce qui est montré d'un Compagnon est ce que les sources rapportent. Le jeu teste la
   compréhension du joueur, jamais une uchronie.
2. **Dévoiler, pas détruire.** On ne combat ni des hommes ni des peuples. On brise l'emprise d'une
   idole en trouvant la vertu qui en est la faille.
3. **Trois mondes, une chaîne.** Orient (Médine, le désert), Rome (Jérusalem, Homs), cyberpunk (la
   Cité-Miroir et la noosphère) : un même combat sous trois lumières.
4. **Sobriété.** Ton grave et lumineux, répliques courtes, aucune représentation déplacée.

## Cadre narratif

An 1508 de l'Hégire (2084). L'AGRÉGOR agrège l'attention des habitants de la Cité-Miroir et donne un
corps à ce qu'ils désirent ensemble. Idris, *râwî* des Archives basses, reçoit de Maître Yûnus la
Chaîne : cinq maillons, cinq témoins. La **noosphère** est la sphère des pensées humaines, l'envers de
chaque lieu. Un **égrégore** y naît de ce que beaucoup de cœurs regardent ensemble ; nourri de peur,
d'orgueil ou d'avidité, il devient **idole**. Le prologue s'achève sur le jour de la mort du Messager ﷺ,
raconté en quatre cartons, sans aucune image.

| Saga | Chapitres | Groupe | Idoles (boss en gras) | Lumière |
|---|---|---|---|---|
| I. Abû Bakr | Le Jour le plus sombre · L'Armée d'Usâma · Yamâma — le Menteur | Abû Bakr, 'Umar, Abû 'Ubayda | le Déni, **le Clan**, l'Avare du dû, **le Menteur** | Véracité |
| II. 'Umar | Les Rondes de nuit · Les Clés de Jérusalem · Le Trône et la Natte | 'Umar, Aslam, Abû 'Ubayda, puis 'Abd ar-Rahmân ibn 'Awf | l'Accapareur, le Faste, **l'Aigle d'Airain**, **le Trône vide** | Justice |
| III. Khâlid | La Traversée · Yarmoûk · L'Épée au fourreau | Khâlid, al-Qa'qâ', Dirâr | la Soif, **la Peur du Nombre**, le Laurier, **l'Idole du Héros** | Courage |
| IV. 'Uthmân | Les Feuillets · La Bataille des Mâts · La Maison assiégée | 'Uthmân, Zayd ibn Thâbit, Hudhayfa | Babel, **l'Abîme**, l'Or, **la Rumeur** | Miséricorde |
| V. 'Alî | Le Bouclier et le Juge · La Parole détournée · Nahrawân, puis l'aube | 'Alî, Ibn 'Abbâs, 'Ammâr, puis Qays | le Privilège, **le Slogan**, **le Juge sans miséricorde** | Savoir |
| Cadre. Idris | La Cité-Miroir · Le Cœur de l'Agrégor | Idris, Maître Yûnus, Sâlim | la Tendance, la Marque, le Score, le Flux, **l'AGRÉGOR** | Patience |

Les failles des boss portent le propos. L'Idole du Héros est insensible au Fer : Khâlid ne la vainc
qu'en rengainant. Le Juge sans miséricorde est insensible à la Justice : il se prend pour elle.

## Boucles

- **Courte (30 s à 3 min).** Un tour de combat : lire l'ordre des tours, chercher la faille, dépenser
  ou garder sa Niyya. En exploration : parler, ouvrir un coffre, atteindre le marqueur.
- **Moyenne (6 à 8 min).** Un chapitre : carton-titre, quatre à six objectifs, deux ou trois combats
  dont un élite ou un boss, un ou deux choix de fidélité, des entrées de codex.
- **Longue (20 à 25 min).** Une saga de trois chapitres rend une Lumière. Cinq Lumières ouvrent
  l'épilogue. La fidélité à la Chaîne est comptée sur toute la partie.

## Mécaniques de combat

**Ordre des tours.** Chaque combattant agit quand son compteur tombe à zéro ; après son tour, il repart
de `1000 / Élan`. Les huit prochains tours sont affichés.

**Sept éléments.** Le Fer (élan physique, utilise la Force) et six Lumières (utilisent l'Esprit) :
Véracité, Justice, Patience, Miséricorde, Courage, Savoir.

**Dégâts.** `stat × puissance × élan × 2,2 × 50 / (50 + Garde de la cible)`, à ± 8 %. Faille : × 1,3.
Cible dévoilée : × 1,5. Cible en garde : × 0,5. Élément auquel la cible est insensible : aucun dégât.

**Voiles.** Un coup sur une faille retire un voile et révèle la faille sur la plaque de l'ennemi. À
zéro voile, l'égrégore est *dévoilé* : il perd son prochain tour, puis se revoile. Un changement de
phase de boss restaure ses voiles.

**Niyya.** Un point au départ, un de plus à chaque tour, cinq au plus ; la garde en donne un. On en
dépense jusqu'à trois : une attaque de base frappe `1 + n` fois, une vertu gagne 50 % de puissance par
point, un soin 40 %, un effet dure `n` tours de plus.

**Sakîna.** Jauge de 0 à 100 par héros : + 4 par tour, + 7 sur une faille, + 12 en dévoilant, + 8 en
garde, + 20 pour un choix juste du premier coup, et à proportion des coups encaissés. Pleine, elle
ouvre l'acte ultime, puis retombe à zéro.

**Commandes.** Frapper (Fer), Éclairer (l'élément du héros, sans coût), Vertus (coût en Souffle),
Objets, Garde, et l'ultime quand la Sakîna est pleine.

**Effets.** Bonus et malus de Force, Esprit, Garde, Élan (± 30 %, trois tours par défaut) ; étourdi,
doute (plus de vertus), waswâs (dégâts continus), régénération, garde, révélation des failles,
purification, dissipation, retrait de voiles, gain de Niyya ou de Sakîna, provocation. Les boss
résistent à l'étourdissement et au doute.

**Fins de combat.** Victoire : sagesse (expérience), objet éventuel, 35 % de Constance et de Souffle
rendus, entrée de codex de chaque égrégore vaincu. Défaite : « La chaîne ne rompt pas » ; le combat
reprend, groupe restauré et Sakîna à moitié pleine.

## Progression

- Statistiques d'un héros : courbe de base par niveau (Constance `70 + 26 n`, Souffle `14 + 4 n`,
  Force et Esprit `9 + 3 n`, Garde `7 + 2,2 n`, Élan `10 + 0,6 n`) multipliée par son archétype
  (guerrier, gardien, sage, soigneur, stratège).
- Statistiques d'un égrégore : même courbe, multipliée par son palier (sbire, élite, boss) et ajustée
  à la taille du groupe. Les multiplicateurs sont dans `TIER` et sont réglés par simulation.
- Expérience : un égrégore rapporte `(10 + 7 n) × palier` ; passer le niveau `n` demande `40 + 40 n`.
  Niveau maximal : 12. Les vertus s'apprennent à des niveaux fixés par saga.
- Niveau plancher par chapitre : 1, 4, 6. Un héros qui rejoint le groupe est aligné. Aucun broyage requis.
- Chaque saga a son propre groupe et repart du niveau 1 : l'ordre des sagas est libre.
- Pas d'argent, pas de boutique, pas d'équipement. Sept objets consommables, trouvés ou gagnés.

## Économie et monétisation

Aucune. Pas d'achat, pas de publicité, pas de collecte. Le modèle de valeur (étape 7) reste à décider.

## Exploration

Cartes en tuiles de 16 px, vue de 24 × 13,5 tuiles. Dix cartes générées : Médine, Koufa, désert, camp,
cité romaine, palais, navires enchaînés, noosphère, Cité-Miroir, Archives. Les compagnons suivent en
file. Un marqueur doré et une flèche de bord d'écran indiquent l'objectif. Les ennemis visibles se
déclenchent au contact ; certains sont facultatifs.

## Direction artistique et sonore

Voir `charte.md`. En bref : pixel art 384 × 216 composé en HD (lumière, halo, profondeur de champ,
particules) ; personnages sans visage, Compagnons au visage de lumière ; sceaux calligraphiés à la
place des portraits ; égrégores abstraits ; son fait d'ambiances, de percussions et de bruitages.

## Plateformes et contrôles

Navigateur de bureau ou mobile. Clavier, souris ou tactile ; pas de manette physique. En portrait
étroit, dialogues et commandes passent sous la scène.

## Périmètre de la V1

Livré : prologue, cinq sagas de trois chapitres, épilogue, codex, sauvegarde locale, test automatique.
Hors périmètre : équipement, boutique, quêtes annexes, mini-jeux, musique mélodique, voix, autres
langues, manette, sauvegarde en ligne.

## Feuille de route proposée

1. Relecture historique par un spécialiste, puis corrections de texte.
2. Tests humains en cercles (soi, dix proches, bêta) et réglage de la difficulté.
3. Nouvelles sagas sur le même contrat : Bilâl, Salmân al-Fârisî, Abû Dharr, Sa'd ibn Abî Waqqâs.
4. Finitions : animations de combat propres à chaque vertu, cartes plus variées, rejouabilité des boss.
5. Version arabe (active le module M8) et audit d'accessibilité.
