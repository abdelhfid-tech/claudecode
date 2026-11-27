# Proposer ISNAD à CrazyGames — « Basic Launch » (sans SDK, sans publicité, sans revenu)

Le paquet : `plateformes/sortie/crazygames/isnad-<numéro>-crazygames.zip` (`node v2/tools/plateformes.js crazygames`) : `index.html` à la
racine, rien d'autre (2,18 Mo en zip, 5,81 Mo dépaqueté pour la 2.47). C'est le paquet web, plus un court préambule inséré avant `</head>`
(`v2/tools/plateformes/crazygames/preambule.js` et `.css`) ; le jeu n'est pas modifié, et le build contrôle qu'ôté le préambule on retrouve
le paquet web à l'octet. L'essai propre à cette cible : `node v2/tools/plateformes/crazygames/essai.js`.

## Lu à la source (docs.crazygames.com, lu le 27 novembre 2026)

Pages lues : `/requirements/intro/`, `/requirements/technical/`, `/requirements/gameplay/`, `/requirements/game-covers/`,
`/requirements/ads/`, `/faq/`. **Non lue** : le « Basic Launch Guide » que la page d'introduction cite pour l'évaluation de la progression ; la page
d'introduction ne dit pas comment le jeu passe du Basic au Full, ni sur quels critères.

| Exigence relevée à la source | Ce que fait le paquet |
|---|---|
| Intro : Basic Launch = chargement initial ≤ 50 Mo, total ≤ 250 Mo (« 50 Mo sans SDK »), ≤ 1500 fichiers ; monétisation CrazyGames désactivée, aucune publicité externe ; PEGI 12 | un fichier, 5,81 Mo (le build refuse au-delà de 50 Mo) ; aucune publicité, aucun SDK |
| Gameplay : « The game must have English localization » ; sans le SDK, repli sur l'anglais | l'anglais s'ouvre d'office tant que rien n'est choisi ; le joueur peut choisir le français ou l'arabe (essai) |
| Gameplay : le joueur dans le jeu tout de suite, ou au plus un clic | voir « Les touchers » ci-dessous : **deux touchers**, et un début qui est une scène parlée |
| Gameplay : « Custom in-game fullscreen buttons are prohibited » | le bouton de la scène, le réglage « Plein écran » et la demande au premier toucher n'existent plus dans ce paquet (essai) |
| Gameplay : pas de promotion croisée d'un autre jeu ou portail ; jamais de lien de magasin ; (la page cite des exceptions : confidentialité, conditions, séries) | aucun lien dans le jeu (`href` : seule la ligne de polices Google, remplacée par les polices embarquées). Le texte du partage de progression écrit l'adresse du site (`ADRESSE`, `v2/tools/promotion.js`), en texte, jamais en lien. La page lue ne parle pas d'un « lien vers le site du développeur » : **ce point de la recherche n'est pas confirmé à la source** — au décideur de dire si l'adresse reste dans le texte du partage |
| Technique : `user-select: none` sur `body`, avec les préfixes `-webkit-`, `-moz-`, `-ms-` | le jeu avait `-webkit-` et sans préfixe ; le préambule ajoute `-moz-` et `-ms-` (essai : `none`) |
| Technique : chemins relatifs seulement ; Chrome et Edge ; souris et clavier, et le tactile si le jeu le gère ; ne pas se fier à `ontouchstart` / `maxTouchPoints` | un seul fichier ; ne se vérifie qu'à l'essai sur place pour le dernier point (le jeu se fie à la taille et au pointeur : **non vérifié** ce qu'il lit exactement) |
| Technique : tester les cadres 800 × 450 (mobile) et 1080 × 607 (tablette), et ceux du bureau « listés » (la liste n'a pas pu être lue) | éprouvé en 960 × 540, 390 × 844, 844 × 390 ; **800 × 450 et 1080 × 607 : non essayés** |
| Pubs : Basic Launch, aucune ; si le SDK de pubs est intégré, il faut que le jeu marche sans | sans SDK : sans objet. Le jeu marche avec un bloqueur de publicité (il n'en charge aucune) |
| Technique : pour les données personnelles au-delà du SDK, un avis conditions / confidentialité, simple et non bloquant, recommandé | le jeu ne collecte rien ; aucun avis. À dire dans la description |

## Les touchers (compté dans l'essai, pas supposé)

Depuis l'écran-titre : **« New Game » puis « Begin » : deux touchers** (identiques en 960 × 540, 390 × 844 et 844 × 390), puis la première
scène, une narration à lire page par page. Le jeu ne lance donc pas le joueur en jeu « tout de suite » : l'écran-titre, le choix du
personnage et une scène parlée précèdent la première main. Que la page des exigences y voie « un clic au plus » ou non, **le jeu n'a pas été
changé** ; la décision est au décideur (et, à l'essai de CrazyGames, au contrôle qualité du portail).

## Ce que prouve l'essai (`node v2/tools/plateformes/crazygames/essai.js` : « PAQUET CONFORME »)

Dans un cadre d'une autre origine, sans « allowfullscreen », sans SDK, en 960 × 540, 390 × 844 et 844 × 390 : le jeu s'ouvre en anglais ;
« Français » et « العربية » se choisissent par les vrais boutons ; le choix gardé l'emporte au rechargement ; aucun « Plein écran » visible
dans les Réglages ni sur la scène, et aucun appel à `requestFullscreen` ; aucune requête au-dehors ; aucune erreur console ; `user-select: none`.
Stockage refusé : le jeu s'ouvre, mais **en français** (l'anglais d'office passe par le stockage ; rien n'est corrigé dans le jeu).

**Non prouvé** : le vrai lecteur de CrazyGames et son « outil d'assurance qualité » (inaccessibles sans compte) ; Safari ; Chromium OS à 4 Go ;
le chargement ≤ 20 s depuis un hébergement externe (sans objet : tout est dans le zip) ; les cadres 800 × 450 et 1080 × 607. Un détail constaté :
après un rechargement du cadre, un toucher dans la première seconde est parfois perdu (l'essai attend donc 0,9 s) — non étudié, le jeu n'est pas touché.

## La démarche (portail développeur)

D'après la page d'introduction : fournir la description et les contrôles, les visuels, essayer le jeu dans l'outil d'assurance qualité du portail
(`developer.crazygames.com`, lien « Submit a game »), puis soumettre. Le portail n'a pas été ouvert ; aucun compte n'a été créé.
Format exact du dépôt (zip ou dossier, nom du fichier d'entrée) : **non vérifié** (les pages lues n'en parlent pas).

## Les visuels (tailles lues sur `/requirements/game-covers/`)

- **Trois couvertures**, de style cohérent : paysage 16:9 **1920 × 1080**, portrait 2:3 **800 × 1200**, carré 1:1 **800 × 800**.
  Interdits : bordures, texte autre que le titre du jeu (ni « New », ni « Play Now »), icônes ou logos de magasins, visuels flous ou pixellisés.
  Formats de fichier et poids maximal : **non indiqués** par la page.
- **Vidéo d'aperçu** : 15 à 20 s, 50 Mo au plus, **sans son**, en 1080p paysage **et** en 1080p portrait, sans écran noir, sans bandes noires,
  sans curseur par défaut, sans texte promotionnel ; la première image est la couverture.

Proposition (à valider) : tirer les couvertures de captures du jeu, par simple recadrage, en gardant le titre « ISNAD » de l'écran-titre comme seul texte. **Le dessin du jeu est
fin à 768 × 432 (`gfx.D = 2`)** : un recadrage agrandi à 1920 × 1080 serait agrandi 2,5 fois, donc pixellisé, ce que la page interdit — un cadrage serré
sur le dessin d'origine n'y échappe pas. Fabriquer des couvertures plus grandes (redessin, génération) est plus qu'un recadrage : **rien n'a été fait**, au décideur de choisir. La vidéo : les shorts du projet
(`promo/shorts/`) ont du son, un plan final du soutien et un format vertical : ils ne conviennent pas tels quels ; rien n'est préparé.

## Description anglaise et textes : `plateformes/crazygames-textes-a-valider.md` (propositions).

## Ce que changerait le « Full Launch » — décision du décideur

- Le SDK devient obligatoire (événement `Gameplay start`, réglage de coupure du son, etc.) : un ajout dans le jeu (code, donc 2.x suivante), ou un second préambule ;
  la sauvegarde pourrait se lier au compte CrazyGames (« quand c'est applicable »). Les exigences du Full ajoutent aussi : tomber directement en jeu, contrôle visuel complet.
- La publicité : les annonces passent **par le SDK** de CrazyGames (vidéo entre deux moments, vidéo récompensée, bandeaux) ; le jeu doit marcher avec
  un bloqueur. **Les pages lues ne documentent aucun filtre de catégories d'annonces chez le développeur** (la FAQ renvoie au support). Ce qui
  tient au décideur : accepter ou non qu'une annonce, que le jeu ne choisit pas, côtoie un jeu à sujet religieux — notamment une annonce de **jeux d'argent ou de paris**, ce que le
  projet refuse dans le jeu lui-même (aucun pari nulle part). Tant qu'un filtre n'est pas obtenu par écrit du portail, le Basic Launch (sans annonce, sans revenu) est le seul
  état compatible avec cette règle.
- Revenu : partage de recettes publicitaires (versement mensuel à partir de 100 € d'après la FAQ) ; aucun revenu en Basic.
