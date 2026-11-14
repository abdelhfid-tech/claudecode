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

## Personnages en blocs, décors sublimés (demande du décideur)

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

Trois familles, toutes synthétisées par le code :

- **Ambiances** : vent, nuit, foule, feu, mer, noosphère, cité, bataille, silence. Du bruit filtré et
  modulé lentement.
- **Percussions** : frappes graves et sèches de duff. Six rythmes : maqsûm, ayyûb, malfûf, marche,
  cyber, veille. Ils accompagnent l'écran-titre et les combats.
- **Bruitages** : validation, pas, coup, voile brisé, lumière, soin, porte, vague, parasite.

**Bande-son originale synthétisée** (version 2, à la demande du décideur) : dix-huit pistes, timbres proches de l'oud, du ney, des cordes et des percussions de duff, dans l'esprit des consoles 16 bits ; un motif de cinq notes, celui de la Chaîne, revient d'une piste à l'autre. Aucune voix, aucune récitation, aucun appel à la prière synthétisé. Le son peut être coupé depuis
l'écran-titre et le menu.

## Icône et captures

Pas d'icône dédiée. Les captures d'écran de référence sont produites par `node tools/smoke.js shots`.
