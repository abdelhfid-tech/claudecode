# Charte — étape 3

Direction artistique, sonore et rédactionnelle. Les valeurs font foi dans `src/style.css` et
`src/core/gfx.js`.

## Principes

1. **Personne n'a de visage.** Les personnages sont des silhouettes : coiffe, robe, manteau. La zone
   du visage est une teinte unie, sans yeux ni bouche. Cela vaut pour tous, dans toutes les époques.
2. **Les Compagnons ont un visage de lumière.** Leur visage est un aplat clair, et une lueur douce les
   accompagne sur la carte. On reconnaît un Compagnon à sa lumière, non à ses traits.
3. **Le Prophète ﷺ n'apparaît jamais.** Ni sprite, ni silhouette, ni sceau, ni réplique.
4. **Des sceaux à la place des portraits.** Dans les dialogues et les menus, chaque héros est figuré
   par un médaillon géométrique portant son nom en arabe, dans la couleur de sa Lumière. Un PNJ a une
   rosace sans texte.
5. **Les idoles sont des choses.** Les égrégores sont des formes abstraites : flamme, masque vide,
   enseigne, couronne, trône, tour de pièces, grappe de lentilles, miroir, nuée, monolithe, balance
   brisée, faisceau de lames, vague, nœud d'étendards, colosse sans visage. Aucun être vivant figuré.
6. **Pixel art net, lumière douce.** Les pixels restent francs ; la douceur vient de l'éclairage, du
   halo et des particules, jamais d'un flou sur le dessin lui-même.

## Personnages au pixel, à la manière des jeux 16 bits (demande du décideur, 14 novembre)

Le décideur a demandé des personnages « du niveau de Final Fantasy VI ». Les blocs de la version
précédente (section suivante) sont remplacés par des silhouettes dessinées pixel par pixel dans
`src/core/sprites.js`. La règle ne change pas : **personne n'a de visage**, ni yeux, ni bouche, ni trait.

- **Gabarits.** Un personnage tient dans 16 × 24 pixels, comme un sprite de console 16 bits : une tête
  (11 lignes, selon la coiffe) et un corps (13 lignes, selon le pas ou la pose). Chaque lettre du gabarit
  nomme une matière (coiffe, voile, buste, jupe, manteau, galon, main, pied), trois tons par matière,
  l'ombre tirant vers le violet. Un liseré sombre, teinté par la matière voisine, cerne la silhouette.
- **Le voile de lumière.** À la place du visage, les Compagnons portent une lumière unie, bordée de la
  teinte de leur Lumière. Les autres personnages ont une face d'étoffe, unie elle aussi.
- **Ce qui distingue.** La coiffe (turban, casque, capuche, tiare, litham), le bandeau et la ceinture à
  la couleur de la Lumière, le manteau, l'attribut porté. Un attribut ne s'ajoute à un Compagnon que s'il
  est déjà attesté dans ses vertus : la durra de 'Umar, le sabre de 'Alî et de Khâlid, les feuillets de
  Zayd et d'Ibn 'Abbâs, la lance de Dirâr.
- **Les gens des tribus** (`bedouin`). Une étoffe de tête retenue par un cordon, qui retombe sur les
  épaules : c'est une stylisation, non une reconstitution. La couleur du cordon et de la ceinture dit le
  clan (rouge pour les Banû Rimth, vert pour les Fazâra, bleu pour les Kalb, violet pour les Banû
  Zurayr). Aucun costume n'est attribué à une religion : Romains et Perses portent une tenue de rang
  ou d'armée, les moines leur habit.
- **Les attitudes** (`D.POSES`). Recueillement (tête inclinée, mains l'une sur l'autre), résolution (un
  bras levé), accablement (à genoux, tête basse), salut (la main sur le cœur), surprise (les bras
  s'écartent), garde (le manteau ramené devant soi). Le moteur s'en sert seul en combat (garde, vertu
  dite le bras levé, épuisement sous 20 % de Constance, salut à la victoire) et pendant la prière ; un
  script les pose avec `['emote', qui, pose]`.
- **Le grand sprite** (32 × 48) sert au combat, au menu du groupe et au livret. C'est le même dessin,
  agrandi par Scale2x puis enrichi : dégradé du voile, plis des étoffes, galon au bas du manteau.

### Qui est qui (demande du décideur : « ils ont tous la même coupe et quasiment les mêmes habits »)

Chaque personnage se reconnaît à sa silhouette avant sa couleur. Trois leviers, tous dans le costume :

- **La coiffe** : turban rond, turban haut, turban large, turban dont un pan retombe sur l'épaule,
  calotte, casque, casque ceint d'un turban, capuche, tiare, litham, étoffe des gens du désert.
- **Le manteau** : long, absent, jeté sur une seule épaule, ample ; uni, ou à bandes. La robe peut
  être rayée, barrée d'une écharpe, courte sur des jambes bottées, ou couverte de mailles.
- **L'attribut** : seulement s'il est attesté ou propre au rôle (la durra, le sabre, les feuillets,
  la bourse, la lance, le bouclier).

Les gens sans nom varient d'eux-mêmes : leur coiffe et leur manteau se déduisent de leurs couleurs,
toujours les mêmes pour un même personnage. En jeu, à l'arrêt, le nom de ceux qui entourent le héros
s'affiche au-dessus d'eux, et la boîte de dialogue montre la silhouette de celui qui parle.

Ces tenues sont une **convention de dessin**. Elles ne prétendent pas restituer un costume attesté,
et ne décrivent aucun trait physique : ni taille, ni corpulence, ni visage (exigence 2).

### L'équipement (demande du décideur : « variété dans les armes, armures, boucliers, casques »)

- **Une icône par pièce**, 16 × 16, dessinée par le code comme le reste : trois tons de la matière
  (fer, acier, bois, cuir, laine, lin), un accent, un liseré sombre. La forme dit la famille, la
  couleur dit la pièce.
- **Sur la silhouette**, en combat et dans la halte seulement : l'arme en main (épée au côté, lance,
  arc, masse, dague, bâton, calame), le bouclier (cuir, bois, ferré, grand bouclier), le casque (cuir,
  fer, enturbanné, à bandes, coiffe de mailles), l'armure sur le buste (cuir, toile piquée, mailles,
  lamelles). Les étoffes ne changent pas le dessin : chacun garde la coiffe et le manteau qui le
  font reconnaître.
- **Dans le récit**, la silhouette reste celle du fichier de saga : on n'arme pas un Compagnon dans une
  scène où rien ne l'atteste.
- **Aucun symbole.** Ni inscription, ni emblème, ni rien qui dessine une croix ou un autre signe
  religieux : bandes d'un casque sur les côtés, jamais au milieu ; bosse d'un bouclier ronde, sans tige.
- **Les gens d'armes sans nom** varient comme les autres : casque, arme, bouclier et armure se
  déduisent de qui ils sont, toujours les mêmes pour un même personnage.

### L'organigramme du mal

Un organigramme que l'on lit d'un coup d'œil. Deux étages, séparés par un trait d'or en pointillé. Chaque rang tient en
une ligne ; on la touche pour déplier son texte. (La première version était une longue colonne de texte : le décideur n'y
voyait ni les égrégores ni les idées noires.)

- **En haut, ce qui est enseigné** : trois cadres en pointillé, sans aucune image. Iblîs est un nom dans un
  cadre ; ni dessin, ni sceau calligraphié, ni couleur propre. Les souffleurs de même.
- **Les liens du haut sont en pointillé** et le dernier s'arrête au cœur. Aucun trait ne descend d'un
  souffleur vers une idole.
- **En bas, les images du jeu** : cadres pleins. On y **voit** tout : les cinq idées noires et les sept maux du cœur,
  puis, maillon par maillon, tous les égrégores et toutes les idoles, tels qu'ils sont déjà dessinés (formes abstraites,
  exigence 6), chacun avec son nom. Un trait d'or souligne ce que l'on a déjà rencontré ; le reste est estompé, non caché.
- **La jauge** : cinq barres dorées, `▮▮▮▯▯`. Elle accompagne le nom d'une idole, jamais celui d'un
  maillon ; les maillons sont désignés par leur numéro et leurs années.

### Valeurs, attributs, secours

- **Une Valeur** : un médaillon à huit pans, de la couleur de sa lame, sans inscription ni figure. Un à sept points
  disent laquelle c'est. Éteint tant que le mal n'est pas tranché.
- **Un attribut divin** : jamais un dessin. Un médaillon de texte, cerclé d'or quand il est reconnu, en pointillé avant ;
  le Nom en translittération, son rendu, le verset et sa référence.
- **Le secours** : un éclat clair sur tout l'écran, puis une colonne de lumière sur chaque compagnon. Aucune
  silhouette, aucune aile, aucun visage, aucun nombre. Le carton porte un ornement à quatre branches et le verset.
- **La descente** : le décor de la noosphère, et le râwî seul face au mal. Aucun Compagnon à l’écran.

### Le champ de bataille

Une vue à part, le temps d'un ordre ou d'un pas : le décor du combat, assombri, et un damier de quinze cases.

- **Nos rangs** : les silhouettes de troupe du jeu, en nombre, sans visage. Deux lignes pour un rang à pied,
  la ligne du fond dessinée d'abord ; un cavalier par point de tenue, sur une monture sombre et sans trait.
  Aucun étendard, aucune inscription, aucun emblème.
- **Par-dessus chaque rang** : son numéro dans un petit cartouche sombre (le même que dans le menu), trois
  points dorés pour sa tenue, un signe pour son ordre (un chevron vers l'idole : avancer ; deux : charger ;
  un chevron vers le camp : se replier ; trois points : tirer ; un chevron vers le couloir voisin : glisser).
- **Les nuées** : les égrégores du chapitre, plus petits, à demi effacés quand ils faiblissent.
- **L'idole** : immobile, à gauche. La dernière colonne est à son pied ; un flanc découvert la teinte d'or.
- **Un rang éprouvé ne tombe pas** : il perd des silhouettes, puis quitte le champ et y revient.
- **Pendant le duel**, les rangs se tiennent en retrait derrière le groupe, estompés, et une bande de
  quinze cases, en haut à droite, dit où chacun se trouve.

## Version précédente : personnages en blocs, décors sublimés (demande du décideur)

Les personnages sont faits de blocs : une tête cubique d'étoffe, un corps, deux bras, deux jambes, avec
une face claire, un dessus plus clair et un côté plus sombre. Aucun trait. Les Compagnons portent un
panneau de lumière à la place du visage. Les attributs (lance, casque, bâton, rouleau) sont eux aussi
des blocs. À l'inverse, les décors sont travaillés : zellige « étoile et croix », rosaces à huit et
douze branches tracées au sol, frises sur les murs des mosquées, mihrab, minbar, lanternes, tapis à
losanges, portes cintrées cloutées, fenêtres à claustra. Sur la natte de chaque mosquée, deux carrés de
lumière tournent en sens contraires et dessinent l'étoile à huit branches : c'est le point de sauvegarde.

## Trois habillages

L'habillage suit la carte : `noos`, `cite`, `archives` → cyber ; `romaine`, `palais` → romain ; le
reste → orient.

| Habillage | Accent | Filet | Signes distinctifs |
|---|---|---|---|
| Orient | or `#e9c877` | or à 50 % | Boîte de dialogue à losanges d'angle, titres en capitales gravées |
| Romain | marbre `#e8d9b8` | pourpre `rgba(216,106,90,.6)` | Même structure, filet pourpre |
| Cyber | néon `#39e6ff` | néon à 55 % | Coins coupés, sous-titres en police à chasse fixe, lignes de balayage sur l'image |

## Couleurs

| Jeton | Valeur | Usage |
|---|---|---|
| `--ink` | `#07060d` | Fond de page, noir teinté de violet |
| `--panel`, `--panel2` | `rgba(14,12,28,.9)`, `rgba(24,20,44,.92)` | Panneaux |
| `--gold` | `#e9c877` | Accent principal, titres, sélection |
| `--sand` | `#f3e7cc` | Texte courant |
| `--dim` | `#a79c86` | Texte secondaire |
| `--neon`, `--rose` | `#39e6ff`, `#ff4fd8` | Monde cyber, noosphère |
| `--red`, `--green` | `#ff7a5c`, `#7fd69a` | Malus et bonus, jamais comme accent |

Les six Lumières et le Fer ont chacun leur couleur et leur glyphe (`defs.js`) :

| Fer | Véracité | Justice | Patience | Miséricorde | Courage | Savoir |
|---|---|---|---|---|---|---|
| `#c9ced6` ⚔ | `#ffe08a` ◈ | `#6fb6ff` ⚖ | `#7fd69a` ❖ | `#5fe0d0` ✦ | `#ff7a5c` ▲ | `#c49bff` ✧ |

Une information portée par la couleur l'est aussi par un glyphe ou un mot.

## Typographie

| Rôle | Police | Repli |
|---|---|---|
| Titres, noms, bandeaux | Cinzel | Trajan Pro, Times New Roman |
| Texte, dialogues | Alegreya | Iowan Old Style, Georgia |
| Arabe (titre, sceaux) | Reem Kufi | Noto Kufi Arabic, Geeza Pro |
| Données, monde cyber | Share Tech Mono | police à chasse fixe du système |

Taille de base de l'interface : au moins 13 px. La narration est en italique centré, sous l'étiquette « La Chaîne ».
Les paroles attestées ont leur propre carton : ornement, citation en italique, source en petites
capitales.

## Lumière

Quatre heures du jour, chacune avec sa teinte ambiante et son étalonnage : jour (chaud, rayons),
crépuscule (orangé), nuit (bleu, lampes et feux visibles), aube (rosé). La noosphère et la Cité-Miroir
ont leur propre ambiance, teintée par la couleur de l'idole du lieu. Les combats se jouent toujours
dans la noosphère : silhouette du lieu à l'horizon, grille de lumière au sol.

## Ton d'écriture

- Français soigné, phrases courtes. Épique, grave, lumineux. Aucune familiarité moderne dans la
  bouche d'un Compagnon.
- Translittération simple à circonflexes : Abû Bakr, 'Umar, Khâlid, 'Uthmân, 'Alî, Yarmoûk.
- « Le Messager d'Allah ﷺ » ; « (qu'Allah l'agrée) » dans les biographies du codex.
- Vocabulaire du jeu : Constance, Souffle, éprouvé, voiles, dévoilé, Niyya, Sakîna.
- Les compétences sont des actes et des vertus (« Parole véridique », « Ronde de nuit »), jamais de
  la magie. Jamais le nom divin dans un nom de compétence.
- Une fausse option de choix est une tentation humaine plausible, jamais une caricature.
- Dans la Cité-Miroir : phrases sèches, chiffres, répétitions. L'Agrégor « ne ment pas, il additionne ».

## Son

Trois familles, toutes synthétisées par le code : la bande-son (`docs/musique.md`), les percussions et les
bruitages. Il n'y a **pas de nappe de fond** : le vent, la mer, la rumeur de foule et le grondement de la
noosphère, faits de bruit filtré, ont été retirés à la demande du décideur, qui les jugeait inutiles et
encombrants (D90). C'est la musique qui porte le lieu.

- **Percussions** : frappes graves et sèches de duff. Six rythmes : maqsûm, ayyûb, malfûf, marche,
  cyber, veille. Ils accompagnent l'écran-titre et les combats.
- **Bruitages** : validation, pas, coup, voile brisé, lumière, soin, porte, parasite. Tous brefs.

**Bande-son originale synthétisée** (version 2, à la demande du décideur) : vingt et une pistes, dans le métier des partitions de JRPG 16 bits, avec une couleur arabo-andalouse là où le récit l'appelle ; un thème de six notes, celui de la Chaîne, revient d'une piste à l'autre (détail : `docs/musique.md`). Aucune voix, aucune récitation, aucun appel à la prière synthétisé. Le son peut être coupé depuis
l'écran-titre et le menu.

## Le livret en PDF

A5 paysage (210 × 148 mm) : les proportions des écrans du jeu, une page qui tient entière sur un écran. Le texte coule
sur deux colonnes séparées par un filet doré ; il fait 10,7 points sur le papier. La couverture occupe une page, dans
la forme large du livret : le titre à gauche, Médine au soir à droite. Le sommaire tient sur une page, avec les quatre
parties en intertitres et le numéro de page de chaque feuillet. Une figure a la largeur d'une colonne ; une capture
prise sur téléphone se pose à gauche de sa légende. Seuls les tableaux qui ne tiennent pas dans une colonne prennent
toute la largeur. Chaque planche a sa page. Aucune page à moitié vide, sauf la dernière du livret : l'outil déplace
une figure d'un ou deux paragraphes, ou la réduit de 30 % au plus, plutôt que de laisser un blanc. Détail et relevé :
`docs/decisions.md`, D126 à D131.

## Icône et captures

Pas d'icône dédiée. Les captures d'écran de référence sont produites par `node tools/smoke.js shots`.
