# ISNAD 2.0 — le contrat d'un paquet

Un **paquet** ajoute du contenu au jeu de base sans toucher au code : des sagas, des lieux, des objets, des pièces
d'équipement, des étals, des pistes de musique. C'est un document de **données pures** — du JSON —, la forme que la
base de données servira (chantier 2). Le contrat d'une saga, lui, ne change pas : il est dans `docs/schema-saga.md`.

> **Un paquet ajoute, il ne remplace rien.** Un identifiant déjà pris — par le jeu de base ou par un autre paquet — ne se
> redéclare pas. Un paquet refusé ne laisse aucune trace, et le jeu continue sans lui.

## 1. La forme

```json
{
  "id": "essai", "version": 1, "moteur": 1,
  "titre": "Paquet d’essai",
  "note": "À quoi il sert, pour qui l'administre. Le joueur ne la voit pas.",
  "livres":     { "2": { "titre": "Livre d’essai" } },
  "lieux":      { "halte_essai": { "gabarit": "ville", "nom": "La Halte", "variante": "fleuve", "piste": "essai_air",
                                   "noms": { "halle": "Auvent des copistes", "colline": null } } },
  "objets":     { "figues": { "name": "Figues sèches", "desc": "Rend 30 % de Constance à un compagnon.", "hp": 0.3, "target": "ally", "vivre": true } },
  "equipement": { "epee_essai": { "t": "epee", "r": 1, "name": "Épée d’atelier", "atk": 6, "c": ["#c3c8d2", "#6b4a2a"], "desc": "…" } },
  "etals":      { "halte_essai": ["epee_essai", "epee_fer", "turban"], "medine": ["epee_essai"] },
  "pistes":     { "essai_air": { "bpm": 84, "beats": 16, "voices": [ { "wave": "flute", "vol": 0.5, "notes": "D4/2 F4/1 …" } ] } },
  "sagas":      [ { "id": "essai_copiste", "order": 1, "livre": 2, "…": "le contrat de docs/schema-saga.md" } ]
}
```

| Clé | Obligatoire | Ce que c'est |
|---|---|---|
| `id` | oui | minuscules, chiffres ou `_`, une lettre d'abord, 2 à 40 signes. `base` est réservé. |
| `version` | oui | un entier, 1 ou plus : il monte à chaque publication du paquet. |
| `moteur` | oui | ce que le paquet demande au jeu (voir §5). Aujourd'hui : `1`. |
| `titre`, `note` | non | pour la page Diagnostic et pour l'administration. |
| `livres` | non | `{ numéro: { titre } }`, à partir de 2. Un livre déjà déclaré garde son titre : le redéclarer autrement est refusé. |
| `sagas` | non | une liste de sagas. Chacune porte `livre` — 2 ou plus, un livre déclaré — et un `order` unique dans son livre (§1 bis). |
| `lieux` | non | des lieux bâtis sur un gabarit (§2). |
| `objets` | non | des objets de la besace (§3). |
| `equipement` | non | des pièces d'une famille existante (§3). |
| `etals` | non | `{ lieu: [pièces] }` : ce que vend le comptoir d'un lieu. S'ajoute à un étal existant. |
| `pistes` | non | des pistes écrites en notes (`docs/musique.md`) : chaque voix dure exactement `beats` temps. |

Toute autre clé est refusée : une faute de frappe (`equipment`) ne passe pas en silence.

## 1 bis. Les livres

La Chaîne est rangée en **livres**. Le **livre I** est celui du jeu de base : le prologue, ses cinq maillons, puis le
dernier maillon, qui s'ouvre quand **ses** cinq maillons sont achevés — et seulement eux. Un paquet ne lui ajoute rien :
il range ses sagas dans un autre livre, qu'il déclare (`livres`) s'il ne l'est pas déjà. Deux paquets peuvent nourrir
le même livre, sous le même titre.

- Sur l'écran de la Chaîne, chaque livre a son titre — « LIVRE II · … » — et son compte de maillons. Avec un seul
  livre, aucun titre : c'est l'écran de la 1.31.
- Les maillons d'un livre se rangent par `order` et portent des chiffres romains calculés (maillon I, II, III…).
- Les maillons d'un autre livre s'ouvrent dès que le prologue est passé, comme ceux du livre I ; le grand bouton, lui,
  propose d'abord le livre I, puis le dernier maillon, puis les autres livres.
- Une saga d'un autre livre peut rendre une Lumière déjà reçue : elle n'est comptée qu'une fois.
- Une saga ajoutée n'a ni veillée du Caïd ni rencontre de la Cité-Miroir : à sa fin, on revient à la Chaîne.

## 2. Les lieux : dix gabarits

Le moteur sait bâtir dix sortes de cartes. Un lieu choisit la sienne et lui donne un nom ; sa carte sort avec sa propre
répartition de palmiers, de rochers et de jarres, et le moteur garantit que tous ses lieux nommés se rejoignent à pied.

| Gabarit | Lieux nommés (`start`, `at`, `goto`) | Thème | On y bâtit | Piste | Variantes |
|---|---|---|---|---|---|
| `ville` | `mosquee_cour, mosquee_porte, place, souk, halle, maison, puits, palmeraie, porte_nord, porte_sud, enclos, colline, priere, ecole, comptoir` | orient | oui | `medine` (`nuit` la nuit) | `fleuve` : la ville retournée, un fleuve la borde, cour de mosquée carrelée |
| `desert` | `depart, dunes, rochers, oasis, source, caravane, crete, ruines, arrivee, priere, comptoir` | orient | oui | `desert` | |
| `camp` | `entree, tente_chef, feu, etendard, lignes, enclos, tertre, tentes, priere, comptoir` | orient | oui | `camp` | |
| `romaine` | `porte, cardo, forum, basilique, esplanade, palais, fontaine, remparts, jardin, marche, priere, quartier, comptoir` | roman | non | `rome` | |
| `palais` | `entree, nef, trone, tresor, colonnade, jardin, priere` | roman | non | `palais` | |
| `navire` | `poupe, pont, mat, proue, passerelle, pont2, priere` | orient | non | `mer` | |
| `noos` | `seuil, noeud1, noeud2, noeud3, faille, miroir, coeur` | cyber | non | `noos` | |
| `citadelle` | `porte, cour, puits, remparts, tour, salle, mosquee, priere, ecole, souk, jardin, greniers, palmeraie, poterne, comptoir` | orient | oui | `citadelle` (`nuit` la nuit) | |
| `cite` | `rue, ecran, ruelle, ascenseur, parvis` | cyber | non | `cite` | |
| `archives` | `entree, rayonnages, bureau, chaine, priere` | cyber | non | `chaine` | |

Un lieu : `{ gabarit, nom, variante?, piste?, noms? }`.

- `nom` (40 signes au plus) : ce que lisent la carte de la halte et la boutique.
- `piste` : remplace la piste du gabarit — une piste du jeu, ou une piste du paquet.
- `noms` : `{ lieu: 'nom' }` renomme un lieu sur la carte de la halte ; `null` ne l'affiche pas. Seulement des lieux que
  le gabarit possède : un paquet ne crée pas de lieu nommé.
- La noosphère d'un combat reste le lieu `noos` du jeu, teinté par `['map', 'noos', 'seuil', { hue }]`.

Un étal demande un lieu qui a un `comptoir` : `ville`, `desert`, `camp`, `romaine` ou `citadelle`.

## 3. Objets et équipement

**Un objet de la besace** : `{ name, desc, target, … }` avec des effets que le moteur connaît, et rien d'autre.

| Champ | Valeur |
|---|---|
| `name`, `desc` | 40 et 160 signes au plus |
| `target` | `ally` (un compagnon) ou `allies` (tout le groupe) |
| `hp`, `sp`, `revive` | une part de 0 (exclu) à 1 : Constance rendue, Souffle rendu, Constance d'un compagnon relevé |
| `cleanse` | `true` : dissipe les altérations |
| `niyya` | 1 à 3 points |
| `vivre` | `true` : ce que l'on ne prend pas un jour de jeûne |

**Une pièce d'équipement** : le contrat de `D.GEAR` (`docs/schema-saga.md`, § 6 bis) — famille `t` prise dans
`D.GEAR_TYPES`, rang `r` de 0 à 4 (il fixe le prix), `name`, `desc`, deux couleurs `c`, effets en pourcentage bornés
(±25 % par statistique, 0,6 au plus par trait). Le moteur calcule le reste et dessine l'icône.

Ni un objet ni une pièce ne reçoit un nom divin, une vertu, de l'or, de la soie, ni rien de sacré changé en pouvoir
(exigences 8, 15 et 17) : les règles refusent ces mots dans le nom comme dans la description.

## 4. Ce qu'un paquet ne fait pas

| Besoin | Où cela se fait |
|---|---|
| une nouvelle famille d'arme, un nouveau dessin porté, une nouvelle coiffe | dans le moteur (`sprites.js`, `gear.js`, `defs.js`) |
| un nouveau gabarit de carte, un nouveau lieu nommé | dans le moteur (`maps.js`, `defs.js`) |
| une nouvelle forme d'égrégore, une nouvelle opération de script, un nouvel effet | dans le moteur |
| le contenu commun (œuvres, lames, maux du cœur), l'histoire-cadre, les veillées | dans le jeu de base |
| remplacer ou retoucher une saga, un lieu, un objet, une piste qui existent | nulle part : un paquet ajoute |

Quand le moteur apprend quelque chose de plus, son numéro monte (§5) et un paquet peut le demander.

## 5. Le numéro de moteur

`D.MOTEUR` (dans `defs.js`) dit ce que ce jeu sait lire d'un paquet. Il vaut **1**. Un paquet écrit `"moteur": 1`.
Le jour où un paquet se sert d'une chose que seul un moteur plus récent connaît, il écrit le numéro de ce moteur ; un
jeu plus ancien le refuse alors avec un message clair — « ce paquet demande le moteur 2 ; ce jeu a le moteur 1 » — au
lieu de mal le jouer.

## 6. Le contrôle

Un paquet passe deux contrôles, toujours les mêmes, où qu'il soit lu :

1. **Sa forme et ses identifiants** (`D.paquet.refus`, dans `defs.js`) : les clés, le moteur demandé, chaque identifiant
   neuf, chaque renvoi vers une chose qui existe.
2. **Les règles du contenu** (`verifierPaquet`, dans `regles.js`), sur une copie des tables étendue de ce que le paquet
   déclare : les règles de chaque saga (celles de la 1.31, exigences de respect comprises), de l'équipement, des objets,
   des pistes, des noms de lieux, puis de l'ensemble avec le contenu déjà posé (`after`, ordre dans le livre).

Trois lecteurs pour ce même texte de règles :

- la commande : `node v2/tools/paquet.js mon-paquet.json` ;
- **le jeu lui-même** : `ISNAD.registerPack(paquet)` refuse ce qui ne passe pas, le note sur la page Diagnostic et
  continue ;
- la page d'administration (chantier 2), avant tout enregistrement.

Un avis (« ! ») n'empêche rien : il signale ce qui est déclaré sans jamais servir, ou une saga de moins de trois
chapitres.

## 7. Entrer dans le jeu

- **À l'assemblage** : tout fichier `v2/paquets/*.json` est embarqué par `node v2/tools/build.js`, après le jeu de
  base, dans l'ordre des noms de fichiers. Le dossier est vide aujourd'hui : la 2.0 livrée est le jeu de base.
- **À l'essai** : `node v2/tools/paquet.js mon-paquet.json` assemble un jeu à part (`v2/.smoke/essai/index.html`), y
  joue chaque saga du paquet de trois façons, bâtit chaque lieu à chaque heure, fait sonner chaque piste, et vérifie
  qu'un paquet fautif est refusé sans arrêter le jeu. Le jeu livré n'est pas touché.
- **Demain** : la base servira les paquets publiés (chantiers 2 et 3). Le jeu les posera par le même
  `ISNAD.registerPack`.

Le paquet d'essai (`v2/tools/essais/paquet_essai.js`) est l'exemple complet : pure fiction, jamais livré.
