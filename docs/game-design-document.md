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
place des portraits ; égrégores abstraits ; son fait d'une bande-son synthétisée, de percussions et de bruitages brefs.

## Plateformes et contrôles

Navigateur de bureau ou mobile. Clavier, souris ou tactile ; pas de manette physique. On se déplace
aussi en touchant ou en cliquant l'endroit où aller (chemin calculé sur la grille), et l'on agit en
touchant la personne ou la chose. Sur un téléphone tenu en hauteur, la scène ne montre qu'une partie
de la largeur, agrandie, en exploration comme en combat ; l'objectif, les dialogues et les commandes
passent sous l'image. La taille du texte se règle. Le bouton ? (touche H) explique l'objectif, donne
sa direction et peut montrer le chemin ou y conduire.

## Périmètre de la V1

Livré : prologue, cinq sagas de trois chapitres, épilogue, codex, sauvegarde locale, test automatique.
Hors périmètre : équipement, boutique, quêtes annexes, mini-jeux, voix, autres
langues, manette, sauvegarde en ligne.

## Systèmes de la version 2

**Pourparler.** De 3 à 5 manches ; à chaque manche l'interlocuteur parle, le joueur choisit un argument
(valeur de −2 à +3, étiqueté d'une vertu). La confiance est la somme des valeurs ; il faut atteindre
l'objectif. Avoir prié dans le chapitre donne +1 au départ. Un argument marqué d'un savoir n'est
disponible que si l'entrée de codex correspondante est connue. Réussite : Sagesse égale à 22 + 12 × niveau,
puis la branche `win`. Échec : la branche `lose`, souvent un combat de dernier recours.

**Halte de prière.** Sur chaque carte, un lieu `priere`. Le groupe est entièrement restauré, la Sakîna
monte de 35, le pilier Prière gagne 1 (une fois par chapitre), un point de reprise est posé.

**Piliers (0 à 5).** Prière : +6 de Sakîna par niveau au début d'un combat. Savoir : une faille révélée
d'emblée par tranche de deux niveaux ; +1 toutes les six entrées de codex. Justice : −3 % de dégâts
reçus par niveau. Lien : +3 % de dégâts infligés par niveau.

**Alliés.** Chaque allié dont le drapeau est levé ouvre le combat : un voile retiré à chaque égrégore et
8 % de sa Constance.

**Veillées du Caïd.** Cinq chapitres de fiction (`src/data/caid.js`), un après chaque saga, dans la carte
`citadelle`. Les piliers de la Citadelle persistent d'une veillée à l'autre.

## Bâtir (version 3)

Boucle : récolter → poser → rapporter. Matériaux : eau, pisé, palme, pierre, grain, laine. Récolte : un
palmier donne 1 palme, un rocher 1 ou 2 pierres, un point d'eau 2 eaux, 2 eaux pétries donnent 3 pisés,
un étal 2 grains (une fois par visite de la carte). Pose : la case devant soi, sur une carte à ciel
ouvert ; une pièce pleine est refusée si elle isole un lieu ou un personnage.

| Pièce | Coût | Effet |
|---|---|---|
| Tranchée | la peine de creuser | arrête les égrégores visibles ; six segments gardent un lieu |
| Puits | 4 pierres | eau à chaque chapitre (+3) ; requis à six pas pour palmiers et champs |
| Palmier | 1 eau | dattes à chaque chapitre ; un puits et trois palmiers font une oasis (Lien +1) |
| Champ d'orge | 1 eau, 1 grain | grain et pain à chaque chapitre |
| Enclos de chèvres, de moutons, de chameaux | 3 à 4 palmes | lait, laine, pierre à chaque chapitre ; le dû des troupeaux donne Justice +1 |
| Mur, sol, pilier, niche, natte, tapis, lanterne, rosace | pisé, palme, pierre, laine | pièces de mosquée |

Chantier de mosquée : ouvert par le récit sur une terre gagnée, avec une liste de pièces à poser dans un
enclos tracé au sol. Achevée, la mosquée donne Prière +1 et Lien +1, et sa natte devient un lieu de
prière et de repos (la partie, elle, se garde toute seule depuis la version 6).

## Routes (version 4)

**Étoiles.** Huit caps de 45°, nommés par l'étoile qui s'y lève (côté est) ou s'y couche (côté ouest),
comme sur la rose des pilotes arabes ; le cadran et l'étoile de bord d'écran indiquent l'objectif.

**Commerce.** Monnaie : le dirham (20 au départ). Vente : dattes 3, lait 4, pain 3, miel 6, laine 4, grain
2, palme 1, pierre 2, pisé 1. Achat : grain 3, laine 6, pierre 4, palme 3, pisé 2, dattes 5, outre 7, miel
10, musc 14, siwâk 8. Caravanes : Yémen (mise 12, retour 19, péril 18 %), Shâm (20, 35, 30 %), Bahreïn
(30, 58, 45 %) ; dans les veillées, trois routes de fiction aux mêmes chiffres. Le péril baisse de 3 points
par niveau de Justice, 2 par niveau de Lien, 6 par enclos de chameaux (plancher 6 %).

**Route pillée.** Renforts : +1 si Lien ≥ 2, +1 si Lien ≥ 4, +1 s'il y a un enclos de chameaux. Le
pourparler demande 6, 5 ou 4 de confiance selon 0, 1 ou 2 renforts ; en cas d'échec, combat contre la
Razzia avec les renforts en ouverture. Partage : servir d'abord les petits porteurs (Justice +1, on
retrouve la moitié de sa mise), au prorata (Justice +1, 70 %), ou soi d'abord (Justice −1, tout).

## Le cœur (version 5)

Demande du décideur : que les épreuves difficiles demandent des œuvres, que l'on combatte les idées
noires de ceux que l'on veut convaincre, qu'une quête de lames légendaires mène à sept boss finaux,
que des animaux légendaires accompagnent le groupe, et que certaines énigmes se dénouent par une œuvre.

| Système | Règle | Garde-fou |
|---|---|---|
| Œuvres du jour | Sur la natte : dhikr, étude, jeûne, aumône, visite ; trois par chapitre, la prière en sus | Textes sobres ; aucun pouvoir promis (exigence 15) |
| Provision du cœur (♥) | +1 par œuvre, cinq au plus ; une idole en consomme 2, un mal du cœur 3 | Chaque point manquant : 8 % ; s'allège à chaque reprise, donc rien ne bloque |
| Jeûne | Ferme les vivres de la besace jusqu'à la fin du chapitre ; compte pour la lame s'il a été tenu dans l'épreuve | |
| Pèlerinage | Intention sur la natte, accompli à la fin de la veillée ; remplit la provision | Seulement dans la fiction des veillées |
| Lames | Trois fois l'œuvre (une fois le pèlerinage) forge la lame du mal contraire | Image, non relique ; aucune inscription |
| Maux du cœur | Élite au niveau du groupe ; avec la lame : un seul voile, failles connues, 60 % de Constance | Égrégores abstraits ; liste de sept dite « choix du jeu » |
| Idées noires | Combat à la deuxième manche de douze pourparlers ; +1 de confiance | Interlocuteurs de fiction seulement |
| Énigmes du cœur | Un héros des veillées à 75 % de Constance tant que l'œuvre juste n'est pas accomplie | Jamais un Compagnon |
| Compagnons de lumière | Cinq figures du ciel ; une active ; un don au début du combat | Fiction ; absentes du récit historique |

Dons : le Renard révèle une faille de chaque égrégore ; l'Aigle fait agir le groupe plus tôt et donne
un point de Niyya ; le Phénix relève une fois le premier compagnon éprouvé ; le Lion affaiblit les
coups adverses pendant trois tours ; la Gazelle régénère le groupe pendant trois tours.

## L'équipement (version 6)

Remarque du décideur : pas assez de variété dans les armes, les armures, les boucliers et les casques ;
s'inspirer de Final Fantasy.

| Système | Règle | Garde-fou |
|---|---|---|
| Emplacements | Main droite, main gauche, tête, corps ; cinquante-trois pièces en seize familles | Objets ordinaires : ni relique, ni inscription, ni or ni soie (exigence 17) |
| Rôles | Chaque rôle a ses familles : le guerrier et le gardien portent le fer, le sage et le soigneur le bâton, le calame et l'étoffe, le stratège un peu de tout sauf le lourd | Le jeu ne dit pas qui portait quoi : c'est le joueur qui habille |
| Effets | Pourcentages de Force, Esprit, Garde, Élan, Constance, Souffle ; le fer protège et ralentit | Jamais d'élément-vertu, jamais de protection contre le doute ou le waswâs |
| Traits | Lance : perce la garde. Dague : frappe parfois deux fois. Arc : tire le premier. Masse : étourdit. Bouclier : pare un coup de fer. Casque : tient bon face à l'étourdissement | Effets physiques seulement |
| Réserve | Commune à toute la Chaîne ; ce qu'un groupe portait y retourne à la fin de sa saga | Une pièce portée par un héros absent peut être rappelée |
| Trouver | Un coffre par chapitre ; six comptoirs aux étals différents ; 8 à 85 dirhams | La même bourse sert à l'aumône |
| Voir | Une icône par pièce ; en combat et dans la halte, la silhouette porte arme, bouclier, casque, armure | Hors combat, la silhouette du récit ne change pas |
| Aides | « Qui la porte ? » à la réception ; « Au mieux » ; rappel dans « Que faire ? » | |

Pourquoi des pourcentages : chaque saga repart du niveau 1 avec un nouveau groupe, et la réserve suit
le joueur. Un bonus en points aurait écrasé le début de chaque saga ; un pourcentage reste juste à tout
niveau. Les bonus sont volontairement modestes (une pièce de haut rang : 15 à 20 %) : la provision du
cœur doit toujours peser davantage que le fer.

## Feuille de route proposée

1. Relecture historique par un spécialiste, puis corrections de texte.
2. Tests humains en cercles (soi, dix proches, bêta) et réglage de la difficulté.
3. Nouvelles sagas sur le même contrat : Bilâl, Salmân al-Fârisî, Abû Dharr, Sa'd ibn Abî Waqqâs.
4. Finitions : animations de combat propres à chaque vertu, cartes plus variées, rejouabilité des boss.
5. Version arabe (active le module M8) et audit d'accessibilité.
