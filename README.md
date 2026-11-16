# ISNAD — Chroniques des Compagnons

JRPG rétro-HD jouable dans le navigateur, en un seul fichier HTML. Le récit commence à la mort du
Prophète ﷺ (an 11 de l'Hégire, 632) et suit cinq Compagnons, chacun dans une saga de trois chapitres,
jusqu'à la fin du califat bien guidé (an 40, 661).

Le cadre est une fiction : en 1508 H (2084), dans la Cité-Miroir, l'**AGRÉGOR** fabrique des idoles en
agrégeant l'attention de millions de regards. Idris, jeune *râwî* (transmetteur) des Archives basses,
remonte la **Chaîne** (*isnâd*) de témoin en témoin. Chaque saga lui rend une **Lumière**, c'est-à-dire
une valeur, pour dévoiler l'Agrégor.

## Deux versions

- **ISNAD 1.32** : le jeu léger en un seul fichier (`index.html`, sources dans `src/`). Il est **gelé** : on ne le modifie
  plus. `node v2/tools/gel.js` le vérifie. C'est la 1.31, avec ses grands personnages redessinés le 16 novembre.
- **ISNAD 2.0** : une nouvelle version, en construction dans `v2/`, qui sera administrée par une base de données. Son
  socle est posé : le livre I de la 1.32, mot pour mot, et de quoi lui ajouter du contenu sans toucher au code — des
  **paquets** (sagas, lieux, objets, équipement, étals, musiques) rangés en **livres** ; une partie que l'on exporte et
  que l'on réimporte ; un personnage dont le joueur choisit le nom et la tenue ; de grands personnages (combat,
  dialogue, équipement) redessinés d'après les modèles du décideur. Depuis le 16 novembre (la « 2.x »), elle se
  dessine deux fois plus fin — 768 × 432 points, les grands personnages jusque sur les cartes, trois dessins au choix
  dans les réglages — et sa noosphère est un labyrinthe tiré au hasard, sous un chrono : celle des chapitres, et celle
  du râwî, où l'on cherche l'issue ou un abri. On y frappe en temps réel ce qui rôde sur les ponts, avec l'arme que l'on
  porte ; en combat, on choisit une cible en la touchant elle-même ; le voile de chaque Compagnon rayonne d'une couleur
  qui lui est propre ; et les récits se mènent de front — « Revenir en 2084 » à tout moment, chaque récit reprenant là
  où on l'a laissé, avec parfois du nouveau aux Archives basses, et la Citadelle où Idris est né. La version légère,
  elle, s'arrête à la 1.32. Elle a ses propres outils (`v2/tools/`)
  et ses propres sauvegardes. À lire : `v2/docs/feuille-de-route.md` (où l'on en est), `v2/docs/architecture.md`
  (comment c'est fait), `v2/docs/schema-paquet.md` (le contrat d'un paquet). Elle se joue dans son propre Artifact
  privé, distinct de celui de la 1.32.

Ce qui suit décrit la 1.32.

## Jouer

- En ligne : la version publiée en Artifact (lien donné dans la session de travail).
- En local : ouvrir `index.html` dans un navigateur récent. Aucun serveur, aucune installation.

| Action | Clavier | Souris ou doigt |
|---|---|---|
| Se déplacer | Flèches, ou ZQSD / WASD | Toucher l'endroit où aller ; doigt maintenu, le héros suit |
| Parler, se servir d'une chose | Entrée, Espace, Z ou E | Toucher le personnage, le coffre, la natte, le palmier |
| Que faire ? | H | Bouton ? : l'objectif expliqué, le chemin montré, « M'y conduire » |
| Carte du lieu | C | Toucher la mini-carte, ou « Carte » dans la halte |
| Halte, retour | Échap, X ou Retour arrière ; M ou Tab | Bouton ☰, bouton MENU |

Sur un téléphone tenu en hauteur, la scène est agrandie et l'objectif passe sous l'image. La taille du
texte se règle (halte, « Texte »), et une croix tactile peut être affichée pour qui la préfère.

La progression est enregistrée dans le navigateur (`localStorage`) à chaque objectif atteint.
« Continuer » reprend au dernier objectif.

## Les cinq sagas

| | Compagnon | Période | Lumière | Idoles affrontées |
|---|---|---|---|---|
| I | Abû Bakr as-Siddîq | 11–13 H | Véracité (*sidq*) | le Déni, le Clan, le Menteur |
| II | 'Umar ibn al-Khattâb | 13–23 H | Justice (*'adl*) | l'Accapareur, l'Aigle d'Airain, le Trône vide |
| III | Khâlid ibn al-Walîd | 13–21 H | Courage (*shajâ'a*) | la Soif, la Peur du Nombre, l'Idole du Héros |
| IV | 'Uthmân ibn 'Affân | 23–35 H | Miséricorde (*rahma*) | Babel, l'Abîme, la Rumeur |
| V | 'Alî ibn Abî Tâlib | 35–40 H | Savoir (*'ilm*) | le Privilège, le Slogan, le Juge sans miséricorde |

L'ordre est libre. Quand les cinq Lumières sont réunies, le dernier maillon s'ouvre : le retour d'Idris
dans la Cité-Miroir, qui rend la sixième Lumière, la Patience (*sabr*).

## Mécaniques

- **On ne combat jamais des personnes ni des peuples.** Tous les adversaires sont des *égrégores* :
  des formes abstraites nées de ce que beaucoup de cœurs regardent ensemble. Les batailles
  historiques sont racontées ; le combat jouable a lieu dans la *noosphère* du lieu.
- **Voiles et failles.** Chaque égrégore est protégé par des voiles (⛊). Le frapper avec la vertu qui
  est sa faille retire un voile ; à zéro il est *dévoilé* : il perd son tour et subit davantage.
- **Niyya** (l'intention). Un point par tour, cinq au plus. On en dépense jusqu'à trois pour multiplier
  les coups d'une attaque de base ou renforcer une vertu.
- **Sakîna.** Une jauge qui monte quand on encaisse, quand on touche une faille et quand on choisit
  juste. Pleine, elle ouvre l'acte ultime du Compagnon.
- **Fidélité à la Chaîne.** Aux moments décisifs, deux à quatre actes sont proposés ; un seul est celui
  que les sources rapportent. Un mauvais choix ne réécrit pas l'Histoire : la chaîne vacille, le jeu
  explique, puis repropose. Le Compagnon ne fait jamais à l'écran autre chose que ce qui est rapporté.
- **Codex.** Biographies, événements, paroles et idoles, avec leurs sources.

## Le cœur : œuvres, lames, maux, idées noires

- **Les œuvres et la provision.** Sur la natte d'une mosquée, on prie et l'on accomplit les œuvres du
  jour : dhikr, étude du Coran, jeûne, aumône, visite ; dans les veillées, le pèlerinage. Chacune
  ajoute à la *provision du cœur* (♥). Plus une épreuve est lourde, plus elle en demande : une idole 2,
  un mal du cœur 3. Qui s'y présente sans provision combat le cœur lourd. Ces œuvres ne sont pas des
  sortilèges : le jeu traduit à sa façon ce qu'elles font au cœur.
- **Sept maux du cœur, sept lames.** L'avidité, l'orgueil, l'ostentation, l'avarice, l'insouciance,
  l'envie, la colère se tiennent derrière les idoles. Une œuvre pratiquée forge la lame qui tranche le
  mal contraire : le Contentement, l'Humilité, la Sincérité, la Largesse, l'Ardeur, la Bienveillance,
  la Longanimité. Sans sa lame, un mal est seulement repoussé, et il revient au dernier chapitre.
- **Idées noires.** Dans certains pourparlers, la honte, la peur, le soupçon, la rancune ou le
  désespoir de l'autre parlent plus fort que toi : on les dissipe dans la noosphère, pour lui et non
  contre lui, et il écoute.
- **Énigmes du cœur.** Dans les veillées, un compagnon languit sans fièvre ni blessure. Il faut
  trouver ce qu'il a cessé de faire.
- **Compagnons de lumière.** Cinq figures du ciel (le Renard des sables, l'Aigle, le Phénix, le Lion,
  la Gazelle) rejoignent celui qui les a méritées. Une seule accompagne le groupe au combat.

Tout cela est une fiction de jeu, dite comme telle : ni relique, ni pouvoir, ni récit historique.

### L'organigramme du mal, et à chaque mal sa réponse

Une page de la halte range ce que l'on rencontre. En haut, ce qui est enseigné : Iblîs, que le jeu nomme
sans jamais le montrer ni le combattre ; ceux qui soufflent, sans nom ni figure ; le cœur, qui consent ou
refuse. En bas, les images du jeu : les idées noires, les égrégores, les idoles.

- **Une idée noire ne se combat plus : on lui répond.** Elle a deux voiles ; à chacun, on choisit de dire
  vrai, d'expliquer ou de rassurer. Une manière qui ne porte pas reçoit son explication.
- **Un égrégore se combat**, comme avant.
- **Une idole a une jauge d'enracinement**, de 1 à 5. La parole qui porte la déracine : elle pèse alors
  moins sur la provision du cœur. La jauge se dit d'une idole, jamais d'une époque ni de ses gens.

Les textes de cette page sont des propositions, à relire (`docs/decisions.md`, D97 à D102).

### Le côté du bien : Valeurs et attributs

Du côté du bien, on ne dit ni djinn, ni égrégore, ni idole. Sept **Valeurs**, une en face de chaque mal du cœur, se
gardent quand ce mal est tranché ; le jeu les marque d'un badge. Sept **attributs divins**, nommés d'après le Coran avec
leur verset, se reconnaissent quand l'œuvre a forgé la lame. Il n'y a pas d'organigramme du bien.

On descend dans la noosphère **au sortir de la prière, dans le dhikr ou en songe**, pour faire face à ses maux du cœur.
C'est le combat du râwî, seul : jamais celui d'un Compagnon.

Propositions à valider : `docs/decisions.md`, D118 à D125.

### La bataille déclarée

Contre une idole, on ne se bat plus seul. Un carton déclare la bataille, et à côté du combat s'ouvre un champ de
cinq colonnes sur trois couloirs : nos rangs y font face aux nuées de l'idole, qui ne sont jamais des hommes.

- **Ordonner.** Au tour d'un compagnon, on change l'ordre d'un rang : tenir, avancer, charger, tirer, glisser,
  se replier. Après chaque tour de l'idole, les rangs exécutent leur ordre, puis les nuées avancent.
- **Le flanc.** Un rang qui atteint le pied de l'idole découvre son flanc : un voile tombe, une faille se révèle.
  Une nuée prise entre deux rangs se dissipe ; une nuée qui perce jusqu'au camp sème le doute.
- **Khâlid.** Il ordonne sans perdre son tour et connaît trois manœuvres d'école : la réserve mobile,
  l'enveloppement, le repli feint.
- **Personne ne tombe.** Un rang éprouvé se replie et se reforme. Le jeu ne donne aucun effectif.
- **La préparation.** Avant chaque idole, une page dit ce que l'on a et ce qui manque : hommes, armes, boucliers,
  vertus, besace, provision du cœur. On peut encore s'y équiper.
- **Le secours.** Dans une bataille presque perdue, le groupe est relevé une fois, si la prière a été tenue. Aucun
  ange n'est montré, nommé ni compté.

Toute idole est annoncée par ce carton. Des rangs existent là où le récit met déjà une troupe aux côtés du héros :
La Traversée et Yarmoûk (saga de Khâlid), L'Armée d'Usâma (les gardes des passes), La Bataille des Mâts (les ponts).
Ailleurs la bataille se déclare sans rangs, et le carton dit pourquoi.

Règles et tableau des rangs proposés, à valider après essai (`docs/decisions.md`, D103 à D111). `node tools/bataille.js`
la joue au doigt.

## L'équipement

- **Quatre emplacements** par compagnon : main droite (épée, lance, arc, dague, masse, bâton ou calame),
  main gauche (bouclier, ou un outil pour qui n'en porte pas), tête (turban, calotte ou casque), corps
  (étoffe, cuir ou armure). Cinquante-trois pièces, chacune avec son icône.
- **Chaque rôle a ses pièces**, et chaque famille son caractère : une lance perce la garde, une dague
  frappe parfois deux fois, un arc tire le premier, une masse étourdit, un bouclier pare, un casque évite
  d'être étourdi ; le fer protège mais ralentit.
- **Coffres, victoires, boutique.** Un coffre par chapitre. Chaque victoire rapporte du matériel : quelques
  dirhams, et parfois une pièce d'équipement (toujours après une idole). Au comptoir, la boutique
  d'équipement vend ce que font les artisans du lieu : six étals différents. La réserve est commune à
  toute la Chaîne.
- **On voit ce que l'on porte** en combat et dans la halte, où chaque pièce montre ce qu'elle change
  avant d'être choisie ; « Au mieux » habille tout le groupe d'un geste.

Ce sont des objets ordinaires de l'époque : une convention de jeu, sans relique ni inscription. Le jeu
ne dit pas qui portait quoi, et le fer ne remplace jamais la provision du cœur.

## Routes : étoiles, caravanes, justice

- **S'orienter aux étoiles.** Un cadran montre huit caps nommés en arabe par l'étoile qui s'y lève ou s'y
  couche : al-Jady (la Polaire) au nord, Suhayl au sud, an-Nasr at-Tâ'ir, al-'Ayyûq, al-'Aqrab. L'étoile
  qui brille est celle de l'objectif ; au bord de l'écran, elle précède le joueur.
- **Commercer.** Aux ballots du souk, du camp ou de la caravane : vendre, acheter, confier une cargaison
  pour le Yémen (route d'hiver), le Shâm (route d'été) ou le Bahreïn. La caravane revient au chapitre
  suivant. Elle risque moins si la justice est rendue, si des pactes sont noués, si des méharistes gardent la route.
- **Une route pillée.** Des hommes rentrent à pied. On lève des renforts, on parle d'abord au chef des
  pillards, on ne combat qu'en dernier recours (l'égrégore de la Razzia), puis on partage ce qui est
  repris et l'on remet les pillards au juge.

## Bâtir

Touche **B** (ou le bouton ▦), à ciel ouvert. On récolte en s'adressant aux choses : un palmier donne de
la palme, un rocher de la pierre, un puits ou une rive de l'eau, l'eau pétrie du pisé, un étal du grain.
Puis on pose devant soi, case par case :

- **tranchée** : les égrégores qui rôdent ne la franchissent pas ; six segments gardent un lieu ;
- **puits**, **palmiers** (un puits et trois palmiers font une oasis), **champs d'orge** ;
- **enclos** de chèvres (lait), de moutons (laine), de chameaux (la caravane rapporte de la pierre) ;
- les pièces d'une **mosquée** : mur de pisé, sol à étoiles, pilier de palmier, niche de qibla, natte,
  tapis, lanterne, rosace.

Ce qui est bâti reste et rapporte à chaque chapitre. Sur une terre gagnée, un chantier s'ouvre : la
mosquée achevée devient un lieu de prière et de sauvegarde. Dans la première saga : l'enclos des chèvres
du quartier, le fossé de Médine avant la nuit de Dhû l-Qassa, la mosquée de Dhû l-Qassa.

## Sauvegarder

**La partie se garde toute seule** : à chaque objectif atteint, toutes les douze secondes en promenade, et
sur l'écran de la Chaîne. On peut fermer la page ; « Continuer », à l'écran-titre, ramène là où l'on était.
Si le jeu se bloquait, recharger la page suffit.

**La mosquée est le lieu du repos** : sur la natte, au cœur de l'étoile, on prie, et le groupe retrouve
toute sa Constance et tout son Souffle. On y accomplit aussi les œuvres du jour. On peut en plus y
garder une copie de la partie dans l'un des trois emplacements, comme depuis l'écran de la Chaîne.

## Version 2 : la parole avant le sabre

- **Pourparlers.** Les crises se dénouent d'abord par la parole : délégations, pactes, arbitrages. Un
  pourparler se gagne manche après manche ; il peut échouer, et le récit continue autrement (combat de
  dernier recours, pilier ébranlé, allié perdu). Vingt pourparlers dans le jeu.
- **Savoir et prière.** Les meilleurs arguments demandent un savoir appris d'un savant, d'un feuillet ou
  d'un témoin. Chaque carte a une halte de prière : le groupe s'y repose, reçoit la Sakîna et aborde les
  pourparlers avec sérénité.
- **Les quatre piliers de la Citadelle** : Prière, Savoir, Justice, Lien. Ils montent et descendent selon
  ce que le joueur réussit ou manque, et pèsent en combat.
- **Les rencontres de la Cité-Miroir.** Après chaque saga et sa veillée, Idris remonte en 2084 et
  rencontre quelqu'un que la ville a enfermé dans une idole. On le dénoue par la parole, avec les
  savoirs appris chez le Compagnon et à la Citadelle ; les amis gagnés reviennent à l'épilogue.
- **Les veillées du Caïd.** Après chaque saga, un seigneur berbère de fiction affronte dans sa citadelle
  une crise qui répond à la leçon reçue. Ici les décisions sont libres et leurs conséquences durent.
  Tout y est de fiction.
- **Intrigue politique.** Factions, délégations, communautés aux intérêts divergents traitées avec
  dignité, hypocrites de fiction issus du camp du héros.
- **Bande-son originale** synthétisée, vingt et une pistes, coupable séparément ; **rendu** rétro-HD ou 2D
  simple, au choix ou automatiquement si l'appareil peine.

## Développer

```sh
node tools/validate.js          # valide les sagas contre le schéma (src/core/defs.js)
node tools/validate.js src/data/frame.js src/data/caid.js src/data/coeur.js   # histoire-cadre, veillées, contenu commun
node tools/build.js             # assemble index.html et dist/isnad.html
node tools/smoke.js auto        # joue la partie entière automatiquement dans Chromium
node tools/smoke.js walk        # même partie, mais le héros marche réellement (vraies collisions)
node tools/smoke.js tap         # même partie, en marchant comme au doigt (chemin tracé jusqu'à l'objectif)
node tools/smoke.js wrong       # choisit d'abord toutes les mauvaises réponses et perd chaque pourparler
node tools/doigt.js             # joue le prologue au doigt, sans raccourci, et vérifie que tout ce que le jeu attend se voit
node tools/doigt.js loin        # idem, puis tout le premier chapitre de la saga I
node tools/validate-music.js    # vérifie les vingt et une pistes
node tools/smoke.js shots       # captures d'écran bureau et mobile dans .smoke/
node tools/promo.js all         # livret du joueur et planches : captures, sprites, assemblage, export
node tools/promo.js pdf         # le livret en PDF : A5 paysage, deux colonnes (promo/livret.pdf)
```

Le livret du joueur et les planches de présentation sont dans `promo/` : `livret.html` s'ouvre tel
quel, `planches/` contient les douze planches en images (onze en 1920 × 1080, une affiche verticale en
1080 × 1350). Le texte se modifie dans `promo/livret.src.html`, puis `node tools/promo.js planches`
réassemble la page et réexporte les images. Noms, dates, accroches, pièces et étoiles viennent des
données du jeu. `node tools/promo.js pdf` en tire `promo/livret.pdf` : 74 pages A5 paysage, sommaire paginé,
signets ; ce fichier n'est pas versionné, et l'outil demande `pdfinfo` et `pdftoppm` (poppler).

`smoke.js` demande Playwright et Chromium (`npm i playwright` hors de l'environnement d'origine).

```
index.html            jeu assemblé, page autonome
dist/isnad.html       même jeu, en fragment pour publication en Artifact
src/page.html         gabarit HTML          src/style.css   interface
src/core/defs.js      énumérations et schéma (source de vérité)
src/core/base.js      entrées, sauvegarde, son
src/core/gfx.js       tuiles, objets, égrégores, sceaux, composition
src/core/sprites.js   personnages au pixel : gabarits, coiffes, attributs, poses, grand sprite
src/core/maps.js      générateurs de cartes
src/core/script.js    interprète de scripts (dialogues, choix, mise en scène)
src/core/world.js     exploration, objectifs, points de reprise
src/core/battle.js    combat
src/core/ui.js        titre, Chaîne, menus, codex, boucle principale
src/data/frame.js     histoire-cadre (prologue, épilogue)
src/data/saga_*.js    une saga par fichier
tools/                build, validate, smoke, promo
promo/                livret du joueur (gabarit, page assemblée, images) et planches exportées
docs/                 artefacts du framework « De l'idée à la production »
```

Les consignes pour un agent codeur sont dans `AGENTS.md`, le contrat de données dans
`docs/schema-saga.md`, les décisions à valider dans `docs/decisions.md`.

## Sources

Ibn Hishâm, *as-Sîra an-Nabawiyya* · at-Tabarî, *Târîkh ar-Rusul wa-l-Mulûk* · Ibn Sa'd,
*at-Tabaqât al-Kubrâ* · Ibn Kathîr, *al-Bidâya wa-n-Nihâya* · al-Balâdhurî, *Futûh al-Buldân* ·
al-Bukhârî et Muslim, *as-Sahîh* · Ibn 'Asâkir, *Târîkh Dimashq*. Chaque entrée du codex cite les
siennes et signale les récits dont la chaîne est discutée.

## Avertissement

ISNAD est une fiction interactive inspirée de sources historiques. Les dialogues sont une
dramatisation ; seules les paroles présentées en carton, avec leur source, sont des citations
rapportées. Le Prophète ﷺ n'est jamais représenté et aucun personnage n'a de visage. Le contenu
historique n'a pas été relu par un spécialiste : toute erreur est celle des auteurs, et le texte doit
être vérifié auprès des sources et des savants avant toute diffusion.
