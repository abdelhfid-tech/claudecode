# ISNAD 2.0 — feuille de route

*Plan approuvé par le décideur le 15 novembre. Il se tient à jour : chaque chantier terminé y est noté.*

## Avancement

| Lot | État | Ce qui a été vérifié |
|---|---|---|
| 0 — geler la 1.31, ouvrir `v2/` | **fait** le 15 novembre (commit `e42c1a9`) | toute la batterie sur la copie, sans anomalie ni erreur console ; compte rendu du parcours automatique identique à celui de la 1.31, au hasard des combats près ; `gel.js` : 37 fichiers conformes |
| 1.1 — le validateur en module | **fait** le 15 novembre (commit `91f1e3b`) | même sortie qu'avant sur tout le contenu ; huit copies fautives d'une saga et une de la musique refusées avec les mêmes messages par la 1.31 et par la 2.0 |
| 1.2 — les paquets, les lieux par gabarit | **fait** le 15 novembre (commit `00b4617`) | les 65 cartes que le contenu demande, identiques à celles de la 1.31 (`cartes.js`) ; le paquet d'essai contrôlé, assemblé à part et joué de trois façons, 21 copies fautives refusées pour la bonne raison, 5 paquets fautifs refusés par le jeu sans l'arrêter (`paquet.js`) ; toute la batterie du jeu de base, sans anomalie |
| 1.3 — les livres | **fait** le 15 novembre (commit `01a5cd9`) | l'écran de la Chaîne identique à celui de la 1.31 en huit moments, du prologue à la Chaîne transmise (`ecrans.js`) ; dans le jeu d'essai, deux livres rangés sous leur titre, le dernier maillon ouvert par les seuls maillons du livre I, 24 copies fautives refusées (`paquet.js`) ; toute la batterie du jeu de base, sans anomalie |
| 1.4 — la partie du joueur | **fait** le 15 novembre (commit `32e18f2`) | par les vrais boutons : une partie exportée (texte et fichier), effacée, réimportée à l'identique, reprise au milieu d'un chapitre ; dix textes qui ne sont pas des parties refusés sans rien changer ; une partie de la 1.31 acceptée et remise à jour ; les clés de la 1.31 intactes (`partie.js`) ; une partie faite avec le paquet d'essai portée dans le jeu livré puis rapportée, sans rien perdre (`paquet.js`) ; toute la batterie, sans anomalie |
| 1.5 — le personnage du joueur | **fait** le 15 novembre (commit `0a40f26`) | les noms acceptés et refusés ; les 29 phrases du jeu qui nomment le râwî, redites avec six noms, élision juste ; le profil d'origine qui ne change rien ; par les vrais boutons et en quatre tailles d'écran, un prologue entier joué sous un autre nom sans qu'un seul « Idris » s'affiche ; le choix gardé, rechargé, exporté (`personnage.js`) ; toute la batterie, sans anomalie |
| P — les personnages redessinés d'après les modèles du décideur | **fait** le 16 novembre — la 2.0 : commits `39ac7eb`, `edb1613`, Artifact en version 2 ; la version légère, devenue la 1.32 : commit `8c21125`, Artifact en version 32, gel refait | `silhouettes.js` : les petits sprites des cartes inchangés au pixel près (397 silhouettes) ; l'interrupteur rend le grand sprite d'avant à l'identique ; 14 292 grands sprites sans un trait dans le voile ; les 14 coiffes natives de face et de profil. Détail : `v2/docs/architecture.md`, « Les personnages » |
| A — trois têtes reprises (capuche, coiffe de mailles, chèche), et l'étoffe du désert | **fait** le 16 novembre, dans la 2.0 seulement (D151) | `silhouettes.js` : « SILHOUETTES CONFORMES » ; toute la batterie de la 2.0 sur une copie ; planche avant/après envoyée au décideur |
| 1.6 — la preuve par un paquet d'essai, la publication | **fait** le 15 novembre (commit `885646e`) | dernier passage de tous les outils sur l'assemblage publié ; dans un Artifact, l'export ne propose que la copie du texte (`partie.js`) ; la 2.0 publiée dans son propre Artifact privé, celui de la 1.31 resté à sa version 31 |

## La 2.x : un rendu plus fin, la noosphère en labyrinthes

*Plan approuvé par le décideur le 16 novembre (D150 à D153). La version légère s'arrête à la 1.32 : tout ce qui suit ne
concerne que `v2/`.*

| Lot | Contenu | État |
|---|---|---|
| A | les trois têtes redessinées, les onze autres relues | **fait** (D151) |
| B1 | la même scène rendue de trois façons — aujourd'hui · définition doublée · doublée et lissée — pour que le décideur choisisse sur image | **fait** : trois images envoyées le 16 novembre ; sans réponse, le jeu sort en « fin » |
| B2 | le rendu fin, appliqué à tout le jeu : 768 × 432, grands personnages sur les cartes (leur dos dessiné), personnages du combat retracés en 64 × 96, cases et objets affinés, lisières, plus de lignes de balayage ; réglage « Dessin » (fin, fin et adouci, d'origine) | **fait** (D154) |
| N0 | le tirage des labyrinthes (`v2/src/core/dedale.js`) et sa preuve (`v2/tools/dedales.js`, dix mille graines par profondeur) | **fait** (D155) : 120 000 plans, aucun écart |
| N1 | la noosphère des chapitres devient un labyrinthe : les lieux que les récits nomment y sont toujours, les récits ne changent pas d'un mot | **fait** (D156) |
| N2 | le chrono ; écoulé, on remonte au seuil, le labyrinthe se redessine un cran plus simple, rien n'est perdu | **fait** (D156) |
| N3 | la noosphère du râwî : un labyrinthe à part (seuil, issue, deux abris), ses maux du cœur et les cinq idées noires y rôdent | **fait** (D157) |
| N4 | documentation, formulations des exigences à valider (18, 22, une 23ᵉ), Artifact de la 2.x | **fait** (D157) ; les réglages chiffrés restent à éprouver en jouant |

Choix par défaut du plan, que le décideur peut refuser un par un : les combats de l'histoire restent au tour par tour ;
les égrégores d'un chapitre restent à leurs places, seuls ceux du râwî rôdent ; le plan en haut de l'écran montre tout le
labyrinthe et les aides restent offertes dans celui d'un chapitre ; sortir vaut un niveau, s'abriter 1 d'Esprit et 2 de
Souffle, dix fois au plus ; une idée noire se vainc avec n'importe quelle lame forgée, un mal du cœur avec la sienne ;
aucune image générée n'entre dans le jeu.

## La 2.x, suite : reconnaître, frapper, choisir sa route

*Demandes du décideur du 16 novembre, après la livraison des labyrinthes (D158 et suivantes). « Lorsque je ne précise
pas, c'est toujours la v2 » : rien de ce qui suit ne touche la version légère.*

| Lot | Contenu | État |
|---|---|---|
| C1 | en combat, on choisit une cible en la touchant elle-même, pas seulement sa plaque | **fait** (D158) |
| C2 | le voile de chaque Compagnon rayonne d'une couleur qui lui est propre, la même partout | **fait** (D159) ; les vingt-sept couleurs sont à valider |
| C3 | plus de combats : dans les labyrinthes, de petits égrégores rôdent sur les ponts et l'on frappe en temps réel avec l'arme que l'on porte ; dans la descente du râwî, un coup sonne ce qui rôde | **fait** (D160) ; la lecture retenue (pas d'idée noire dans les récits) est à valider |
| C4 | les sagas menées de front (un point de reprise par récit), « Revenir en 2084 » à tout moment, trois rebondissements au retour, la Citadelle où Idris est né | **fait** (D161, D162) ; les textes de fiction sont à relire |
| C5 | la progression : un besoin, un outil, puis sans aide ; une seule décision nouvelle par séquence | à faire |
| C6 | les postures — le héros, le sage, le saint — selon le tempérament ou l'avancée | à faire |

## Contexte

Le décideur prépare la suite du jeu et pose une règle nette :

> « Pas de régression sur le jeu actuel que tu peux renommer V1.31 au lieu de V31 (la dernière), là on parle d'une
> vraie version 2.0 maintenant, qui n'impacte et ne modifie pas la version légère actuelle (1 fichier). »
> « C'est une nouvelle version que tu crées, pas de modification du jeu actuel. »

Ce que la 2.0 doit apporter, dans ses mots :

- « Je veux pouvoir gérer / administrer le jeu via une base de données » ;
- pour le personnage principal, « le choix du nom et du style selon le joueur » ;
- « que je puisse rajouter des saga [...] donc l'architecture doit pouvoir le permettre de manière natives, mais
  aussi des objets des armes des armures etc » ;
- se financer par du contenu vendu, mettre le jeu en ligne puis sur des plateformes ; pas de jeu en réseau.

Ses quatre réponses du 15 novembre restent valables : commencer par **le socle du jeu** ; la base sur **Supabase,
nouveau projet** ; administrer par **une page en français** ; ranger les sagas ajoutées **en livres**.

**Ce plan remplace le précédent, qui modifiait le moteur actuel : c'était contraire à la règle.**

## Deux versions, deux arbres

*Depuis le 16 novembre, la version légère est la **1.32** : la 1.31 gelée la veille, avec ses grands personnages
redessinés à la demande du décideur (ligne « P » de l'avancement). Ce document parle de la 1.31 telle qu'il l'a
trouvée ; tout ce qu'il en dit vaut pour la 1.32.*

| | ISNAD 1.31 | ISNAD 2.0 |
|---|---|---|
| Ce que c'est | le jeu actuel, léger, en un fichier | une nouvelle version, administrée par une base |
| Où | `src/`, `index.html`, `dist/isnad.html`, les outils de `tools/` | un nouveau dossier `v2/`, avec son moteur, son contenu, ses outils |
| État | **gelée** : plus une ligne ne change, plus d'assemblage, plus de publication | en construction |
| Publication | l'Artifact privé actuel, resté à sa version 31 | un **autre** Artifact privé, puis un site |
| Parties des joueurs | ses clés de stockage, jamais lues ni écrites par la 2.0 | ses propres clés (`isnad2.…`) |

La 1.31 est l'état du dépôt au commit `46fc869` : c'est le dernier qui touche `src/`, `index.html` ou `dist/`, et
c'est ce que montre l'Artifact en version 31. Empreintes relevées : `index.html` `6a252ddb…`, `dist/isnad.html`
`01df28af…`.

« 1.31 » devient son nom dans la documentation. Le jeu lui-même n'est pas réassemblé pour l'afficher : ce serait
le modifier.

**La garantie.** Un outil `v2/tools/gel.js` compare `src/`, `index.html` et `dist/isnad.html` aux empreintes
gelées (`v2/gel-1.31.json`). Il tourne avant chaque enregistrement de la 2.0 et doit afficher « 1.31 INTACTE ».

## Feuille de route de la 2.0

| | Chantier | Ce que vous y gagnez | Ce qu'il demande de vous |
|---|---|---|---|
| 0 | **Geler et copier** | la 1.31 protégée ; une 2.0 de départ, identique au jeu actuel, dans `v2/` | rien |
| 1 | **Le socle** | la 2.0 reçoit des paquets (sagas, objets, lieux, musiques) rangés en livres ; partie exportable ; nom et tenue du personnage | rien : tout se passe dans le dépôt |
| 2 | **La base et l'administration** | une page en français pour gérer objets, prix, sagas, relectures et publications | votre accord pour créer le projet Supabase ; les adresses autorisées à administrer |
| 3 | **Le site** | page d'accueil, jeu installable et jouable hors ligne, livret | un hébergeur et un nom de domaine ; site privé d'abord |
| 4 | **Comptes et vente** | connexion Google, partie gardée en ligne, sagas vendues en achat unique | un prestataire de paiement, un statut pour encaisser, les pages légales |
| 5 | **Les magasins** | itch.io, puis Android, puis iOS | les comptes de développeur |

**Approuver ce plan lance les chantiers 0 et 1.** Je vous redemande l'accord avant chacun des suivants, et avant
toute création sur votre compte, toute mise en ligne et toute dépense.

## Chantier 0 — geler la 1.31, ouvrir la 2.0

- `v2/gel-1.31.json` : l'empreinte de chaque fichier de `src/`, de `index.html` et de `dist/isnad.html`, avec le
  commit `46fc869`. `v2/tools/gel.js` les vérifie.
- `v2/` reçoit une copie de `src/` (moteur, contenu, page, style) et des outils du jeu : `build.js`,
  `validate.js`, `validate-music.js`, `mesure-musique.js`, `smoke.js`, `doigt.js`, `bataille.js`, `son.js`. Leurs
  chemins pointent vers `v2/`. Sorties : `v2/index.html`, `v2/dist/isnad.html`.
- Seuls écarts de la copie : les clés de stockage (`isnad2.…`) et la version affichée (« 2.0 », avec la date et le
  commit).
- **Contrôle de départ** : la 2.0 copiée passe toute la batterie, et son parcours automatique donne le même
  compte rendu que celui de la 1.31.
- `AGENTS.md` : une section « Deux versions » en tête — ce qui est gelé, où vit la 2.0, la commande `gel.js`. Les
  exigences de respect valent pour les deux et ne sont pas retouchées.
- `docs/decisions.md` : la règle du décideur, mot pour mot, et ce plan.

## Chantier 1 — le socle de la 2.0 (tout sous `v2/`)

Six lots. Chacun est livré, testé par toute la batterie de la 2.0, contrôlé par `gel.js` et enregistré séparément.

### 1.1 Le validateur devient un module

- `v2/src/core/regles.js` : les règles de `validate.js` (`checkSaga`, contrôle de l'équipement) et de
  `validate-music.js`, en fonctions pures (`verifierSaga`, `verifierEquipement`, `verifierPistes`, `verifierEnsemble`,
  puis `verifierPaquet` au lot 1.2), sans accès au disque. Chargeable par Node et par un navigateur, comme
  `src/core/defs.js` l'est déjà : la page d'administration s'en servira telle quelle. *(Réalisé : le module est rangé
  avec le moteur plutôt qu'avec les outils, pour que le jeu lui-même contrôle un paquet avant de le poser.)*
- `v2/tools/validate.js` reste la commande : mêmes lignes ✓ et ✗, même code de sortie. Sans argument, elle contrôle
  tout le contenu, cadre, veillées et contenu commun compris.
- Contrôles ajoutés : `after` désigne une saga qui existe ; `order` est unique dans son livre ; le livre et le lieu
  d'un chapitre sont déclarés. *(Réalisé : les deux premiers ici, dans le contrôle d'ensemble ; le lieu l'était déjà ;
  le livre déclaré vient avec le lot 1.3.)*

### 1.2 Les paquets

- Un **paquet** est un document de données pures, donc du JSON :
  `{ id, version, moteur, livres, sagas, equipement, objets, etals, lieux, pistes }`. C'est la forme que la base
  servira.
- `v2/src/core/base.js` : `ISNAD.registerPack(p)` range chaque partie dans son registre ; `registerSaga` reste et
  devient un paquet d'une seule saga. Un paquet déclare la version du moteur qu'il demande ; trop récent, il est
  refusé avec un message, sans arrêter le jeu. Deux paquets ne peuvent pas porter le même identifiant.
- Ce qu'un paquet apporte sans code : des sagas ; des pièces d'équipement d'une famille existante (`D.GEAR`) ; des
  objets aux effets existants (`D.ITEMS`) ; des étals (`D.GEAR_SHOPS`) ; des pistes de musique, écrites en notes ;
  des **lieux**.
- Les lieux : un paquet déclare un lieu par **gabarit** — `{ gabarit: 'ville', nom, lieux, piste }` — parmi les dix
  générateurs de `maps.js` (l'un d'eux sert déjà Médine et Koufa). `M.build` lit ce registre au lieu de son
  `switch` ; le thème de l'interface (`world.js:89`) et les cartes où l'on bâtit (`build.js:6`) suivent le gabarit.
- Ce qui reste dans le moteur : une nouvelle famille d'arme ou un nouveau dessin porté, un nouveau gabarit de
  carte, une nouvelle forme d'égrégore, une nouvelle opération de script.
- Le contenu copié de la 1.31 devient le paquet de base de la 2.0, sans changer un mot.

*Réalisé (15 novembre).* Le contrat est écrit dans `v2/docs/schema-paquet.md`. Quatre choses diffèrent de ce qui était
prévu, toutes dans le sens de la prudence :

- les règles du contenu sont embarquées dans le jeu : `registerPack` refuse lui-même un paquet qui ne les passe pas ;
- un lieu s'écrit `{ gabarit, nom, variante, piste, noms }` — `noms` renomme les lieux du gabarit sur la carte de la
  halte, il n'en crée pas ;
- le jeu de base reste écrit dans `v2/src/data/`, comme en 1.31 : il n'est pas lui-même un paquet (`base` est un
  identifiant réservé). Il est de la donnée pure, vérifié par un aller-retour JSON : la base pourra le recevoir ;
- le paquet d'essai et l'outil `paquet.js`, prévus au lot 1.6, sont arrivés dès ce lot pour l'éprouver ; le lot 1.6
  les complétera (livre II sur la Chaîne, export et import de la partie, partie chargée sans le paquet).

### 1.3 Les livres

- Une saga porte `livre` (1 par défaut). Les cinq sagas, le prologue et le dernier maillon forment le livre I,
  inchangé : sa fin s'ouvre quand **ses** sagas sont achevées.
- `v2/src/core/ui.js`, écran de la Chaîne : un groupe par livre, des chiffres romains calculés, des compteurs lus
  dans les données. Le titre d'un livre ne s'affiche que s'il y en a plusieurs.
- Une saga d'un autre livre peut reprendre une Lumière existante ; veillée et rencontre restent facultatives.
- `v2/tools/smoke.js` tire son parcours des données : prologue, livre I, épilogue, puis les autres livres.

*Réalisé (15 novembre).* Comme prévu, avec deux précisions : un paquet ne range rien dans le livre I, qui reste celui
du jeu de base (les règles le refusent) ; et un nouvel outil, `v2/tools/ecrans.js`, compare l'écran de la Chaîne à
celui de la 1.31 pour prouver que rien ne se voit tant qu'il n'y a qu'un livre.

### 1.4 La partie du joueur

- `v2/src/core/base.js` : format `v: 2`, avec `profil` (nom, tenue) et les paquets connus ; une fonction de
  migration pour les formats à venir.
- **Exporter** la partie dans un fichier `isnad-partie.json`, ou en texte à copier là où le téléchargement est
  bloqué. **Importer** un fichier ou un texte : contrôle, confirmation avant de remplacer.
- Une partie qui cite un paquet absent se charge quand même : la saga manquante est masquée, rien ne plante.
- Les parties de la 1.31 restent dans la 1.31. La 2.0 saura lire leur format, pour le jour où les deux versions
  seront servies par le même site ; elle ne les modifie jamais.

*Réalisé (15 novembre).* Comme prévu. Trois précisions : une partie importée n'est pas crue sur parole (taille, format
et forme de chaque champ sont contrôlés avant quoi que ce soit) ; le profil est une case vide, que le lot 1.5 remplit ;
« Importer une partie » est dans un coin de l'écran-titre plutôt que dans la colonne, qui ne tient déjà plus sur un
petit écran dès qu'on lui ajoute un bouton.

### 1.5 Le personnage du joueur

- C'est Idris, le râwî. Les Compagnons gardent leur nom et leur silhouette.
- À « Nouvelle partie », un écran **Ton personnage** : le nom (Idris par défaut, seize lettres au plus) et la
  tenue, choisie parmi six silhouettes faites des coiffes, manteaux et couleurs que le moteur dessine déjà, avec
  aperçu de face et de profil. Modifiable ensuite depuis la halte. Toujours sans visage.
- Le nom dans les textes : les occurrences écrites en dur (cadre, quatre sagas, veillées, interface) deviennent un
  marqueur, remplacé à l'affichage (`I.fmt`, `speaker` dans `script.js`). Le marqueur gère l'élision : « d'Idris »,
  « de Khalil ». Le validateur signale tout « Idris » resté en dur.
- Noms refusés : vide, trop long, le Nom divin employé seul, les noms que le validateur interdit déjà (Iblîs, démon,
  djinn) et ceux des héros du jeu, pour ne pas brouiller les dialogues. Un prénom composé comme 'Abd ar-Rahmân est
  admis : un héros du jeu le porte déjà.
- Le sceau d'Idris porte son nom en arabe : avec un autre nom, il montre l'étoile à huit branches.
- Nouvel outil `v2/tools/personnage.js` : crée un personnage au doigt, en hauteur et en largeur, prend les
  captures, puis vérifie que le nom choisi paraît dans le dialogue, au combat et à la halte, et qu'aucun « Idris »
  ne reste affiché.

*Réalisé (15 novembre).* Avec un écart approuvé dans le plan de reprise : pas de marqueur dans les textes, qui ne
changent pas d'un mot ; le nom choisi remplace « Idris » à l'affichage, à partir des phrases relevées quand une saga
est posée. Le validateur n'a donc pas à signaler un « Idris » en dur : c'est la forme attendue. Deux précisions : un
prénom en « 'Abd » passe ('Abd al-Karîm), mais 'Abd ar-Rahmân est refusé parce qu'un héros du jeu le porte ; le nom du
Prophète ﷺ est refusé, les autres noms de prophètes passent. « Ton personnage » se rouvre aussi depuis le pied de la
Chaîne.

### 1.6 La preuve par un paquet d'essai

- `v2/tools/essais/paquet_essai.js` : un paquet de pure fiction, jamais livré — une saga d'un chapitre dans un
  livre II, un lieu déclaré par gabarit, une épée d'une famille existante, un objet, un étal, une piste.
- Nouvel outil `v2/tools/paquet.js` : contrôle le paquet par `regles.js`, assemble un jeu d'essai, joue la saga
  automatiquement et vérifie qu'elle paraît sous le livre II, que l'épée se vend et s'équipe, que la piste joue,
  que l'export et l'import de la partie tiennent, et qu'une partie chargée sans le paquet ne plante pas.
- Documentation de la 2.0 dans `v2/docs/` : `schema-paquet.md` (le contrat d'un paquet), `architecture.md`.
- La 2.0 est publiée dans un **nouvel** Artifact privé. Celui de la 1.31 n'est pas touché.

*Réalisé (15 novembre).* Le paquet d'essai et son outil étaient arrivés dès le lot 1.2 ; ce lot a repassé tous les
outils sur l'assemblage final, ajouté trois garde-fous (pas de bouton de fichier dans un Artifact, où il ne ferait
rien ; aucune balise dans un texte ; une copie gardée abîmée qui se relit) et publié la 2.0 dans son propre Artifact
privé : https://claude.ai/artifact/6TYXTHubyPkSTa22DMpsMN (version 1). Celui de la 1.31 est resté à sa version 31.

**Le chantier 1 est terminé.** La suite — la base et la page d'administration — attend l'accord du décideur.

## Chantiers 2 à 5 — esquisse, à détailler le moment venu

**2. La base et l'administration.**
- Un projet Supabase en Europe, créé avec votre accord (organisation en formule gratuite, deux projets en pause).
- La base est la source des contenus de la 2.0. Un outil d'export en tire les paquets publiés, pour assembler et
  tester la 2.0 sans réseau.
- États d'un contenu : brouillon, relu, publié. Un contenu qui touche l'histoire ou la religion ne se publie pas
  sans relecture nommée et datée. Journal de qui a changé quoi.
- La page d'administration, sous `v2/admin/` : objets et équipement, étals et prix, sagas (fiche, livre, ordre,
  état), relectures, publications. Chaque enregistrement passe par `regles.js` et montre le rapport en français.
  Une saga entière s'y dépose comme un document contrôlé ; un éditeur de chapitre visuel viendra plus tard.

**3. Le site.** Page d'accueil tirée du livret, jeu installable et jouable hors ligne, polices embarquées, icône.
La 2.0 y charge les paquets publiés. La 1.31 peut y rester proposée telle quelle, comme version légère. Site privé
tant que la relecture par un spécialiste n'est pas faite.

**4. Comptes et vente.** Connexion Google, et Apple sur iOS ; partie gardée en ligne ; sagas en achat unique, sans
monnaie achetée ni objet payant qui rend plus fort. Un contenu payant n'est jamais servi en clair à qui n'y a pas
droit.

**5. Les magasins.** itch.io, puis Android, puis iOS.

## Ce qui ne change pas

- La 1.31 : son code, son fichier, son Artifact, ses parties.
- Le livret et son PDF, qui décrivent la 1.31. Le livret en ligne n'est pas republié sans votre accord.
- Les exigences de respect d'`AGENTS.md`, pour les deux versions : tout paquet passe par le validateur, d'où qu'il
  vienne.
- Le livre I de la 2.0 : les textes, la fin et les cinq Lumières de la 1.31.

## Vérification

1. **À chaque enregistrement** : `node v2/tools/gel.js` affiche « 1.31 INTACTE », et `git diff 46fc869 -- src
   index.html dist` est vide.
2. Chantier 0 : la batterie de la 2.0 copiée passe, et son parcours automatique donne le même compte rendu que
   celui de la 1.31.
3. Après chaque lot du chantier 1, sous `v2/tools/` : `validate.js`, `validate-music.js`, `build.js`, puis
   `smoke.js` (auto, walk, tap, wrong), `doigt.js` (trois formats), `son.js`, `bataille.js` et
   `bataille.js mesures`. Aucun « BLOQUÉ », « INACCESSIBLE », « ABSENT », « TEXTE CACHÉ », « INVISIBLE », « ÉCART »,
   « MUSIQUE », aucune erreur console.
4. Lot 1.1 : la sortie du validateur sur le contenu copié est la même avant et après.
5. Lot 1.4 : une partie s'exporte, s'efface et se réimporte à l'identique.
6. Lot 1.5 : `node v2/tools/personnage.js`, et ses captures relues en hauteur et en largeur.
7. Lot 1.6 : `node v2/tools/paquet.js`.
8. En fin de chantier 1 : la 2.0 publiée dans son propre Artifact privé, jouée à la main sur le prologue ; l'Artifact
   de la 1.31 toujours en version 31.

## Ce qui reste au décideur

- Faut-il poser une étiquette `v1.31` dans le dépôt et la pousser ? Je ne pousse aujourd'hui que la branche de
  travail.
- Le titre du livre I, qui ne s'affichera que le jour où un livre II existe.
- Les noms refusés pour le personnage : faut-il aussi écarter les noms des prophètes ?
- Les six tenues proposées, à voir sur capture avant de les garder.
- Avant le chantier 2 : l'accord pour créer le projet Supabase, et qui administre.
- Avant toute nouvelle saga : laquelle d'abord, qui la relit, et la ligne pour les époques de dissensions.
