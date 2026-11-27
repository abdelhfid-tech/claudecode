# Proposer ISNAD à Poki — fiche

Le paquet : `plateformes/sortie/poki/isnad-<numéro>-poki.zip` (`node v2/tools/plateformes.js poki`) : `index.html` à la
racine, rien d'autre. C'est le paquet « web » (le jeu en un fichier, polices embarquées) plus, avant la fin de `<head>`,
la balise du SDK (`plateformes/poki/balise-sdk.html`) et le branchement (`plateformes/poki/poki.js`). Le jeu n'est pas
modifié ; ôtés ces deux blocs, on retrouve le paquet web à l'octet (contrôlé à chaque fabrication).
Essai : `node v2/tools/plateformes.js essai poki` (SDK faux ; `SANS_D=1` saute manette.js et loupe.js, qui passent sur une
copie du paquet où ne changent que la langue d'office, mise en français, et la balise du SDK, ôtée — comme CrazyGames).

Pages lues le 27 novembre 2026 (developers.poki.com/guide/…). Tout texte de cette fiche destiné au public est une
**proposition**, à valider par le décideur. Rien n'est déposé sur Poki, aucun compte n'est créé.

## 1. Proposer le jeu (`/guide/share`)

Un formulaire web, « Share your game », en trois parties :
1. **Vous** : nom complet, e-mail, nom de studio (champs obligatoires, sauf le nom de développeur) ; société enregistrée
   (oui/non) ; pays de l'équipe ; taille (1, 2-3, 4-5, 6-10, 11+) ; plateformes déjà publiées (web, Steam, iOS, Android,
   Roblox, console, autre, « premier jeu »).
2. **Le jeu** : titre ; courte description (ce que fait le joueur, ce qui le distingue) ; moteur (liste : Unity, Godot,
   Phaser, Defold, Three.js, moteur maison, « AI/Claude/ChatGPT »…) ; **un build jouable dans le navigateur, sans compte**
   (le meilleur choix) ou, à défaut, une vidéo ; **trois captures du jeu** (PNG, JPEG ou WebP, 5 Mio au plus) ; pourquoi
   les joueurs de Poki l'aimeraient.
3. **Statut** : le jeu est-il déjà sorti ailleurs (oui/non). La page ne dit pas que cela change l'éligibilité, ni le
   délai de réponse. Il faut aussi confirmer avoir lu les « Content & Brand Guidelines ».
→ Le jeu n'a donc **pas** besoin d'être publié ailleurs avant. Les captures et le build jouable : la page privée de
validation ou un lien secret itch.io (sans compte pour le joueur).
Mention d'IA : Poki accepte l'IA, mais peut demander les outils et le processus (`/guide/content-player-safety`) ; la
liste de moteurs propose « AI/Claude/ChatGPT » — à décider : dire la vérité du processus (le décideur choisit les mots).

## 2. Ce que fait le branchement, et pourquoi

| Ce que le branchement fait | Règle (adresse) |
|---|---|
| `PokiSDK.init()` d'abord ; s'il échoue ou si le SDK est bloqué, le jeu se joue sans publicité, sans erreur | `/guide/sdk-html5` (« load your game anyway ») ; `/guide/requirements-quality` (ad blockers) |
| `gameLoadingFinished()` une fois, quand l'écran-titre est prêt | `/guide/sdk-html5`, `/guide/sdk-overview` |
| `gameplayStart()` quand le joueur a la main (le monde, un combat, une course, la borne), `gameplayStop()` dès qu'il ne l'a plus (écran-titre, Chaîne, halte et menus, « Ta partie », carton, onglet caché) ; jamais deux Start ni deux Stop de suite, et le premier est un Start | `/guide/requirements-quality` (SDK events must not fire twice in a row ; Start au premier geste ; Stop à toute interruption) |
| un dialogue ou une liste de choix comptent comme du jeu (le joueur y agit) ; un carton du récit non | choix de l'agent, voir « À décider » |
| `commercialBreak(onStart)` aux seuls moments listés plus bas, avant que le jeu ne reparte ; le son est coupé dès le rappel, les entrées sont ignorées (un voile transparent plein cadre + les écouteurs), aucun événement du SDK ne part pendant la publicité, puis tout revient | `/guide/sdk-html5` (« audio and keyboard input are disabled during commercial breaks ») ; `/guide/game-events` (ordre Stop → commercialBreak → Start) ; requirements (aucun événement pendant un midroll) |
| jamais de `rewardedBreak` | rien ne s'achète ni ne se gagne dans le jeu (`/guide/requirements-quality`, monétisation) |
| « Partager ma progression » est retiré (`partage.offert()` vaut faux) : son texte porte l'adresse du site | « Remove splash screens and outgoing links » ; `/guide/external-resources-policy` |
| les flèches, l'espace, page haut/bas, début/fin ne font pas défiler la page de Poki ; une liste qui défile en bout de course ne passe pas la main à la page (`overscroll-behavior`) ; la molette hors des écrans défilables non plus | requirements (« Prevent viewport scrolling from affecting the parent page ») |
| la langue : celle de `PokiSDK.getLanguage()` si le jeu l'offre (fr, ar, en), sinon l'anglais ; le choix du joueur, une fois gardé, l'emporte | `/guide/localization` |
| aucune minuterie de publicité dans le jeu | « Do not build internal ad timers » |

Ce que le jeu faisait déjà et que Poki demande : aucune ressource au-dehors (polices, images, sons embarqués : seul le
SDK est chargé) ; le stockage protégé par `try/catch` (essai du « stockage refusé » dans `essai.js` du paquet web) ; Échap
ouvre la halte (pause) ; pas de chat, pas de compte, pas d'achat ; aucun lien sortant ; plein écran sur 16:9 ; téléphone
en hauteur et en largeur ; manette tactile partout.

### Les moments de publicité (proposés ; `REGLAGES.moments`, tête de `plateformes/poki/poki.js`)

| Moment | Dans le paquet | Pourquoi |
|---|---|---|
| `chaine` : le joueur, sur la Chaîne, ouvre ou reprend un maillon (ou, depuis la 2.48, reprend par « Reprendre » une veillée ou une rencontre quittée) | **oui** | l'arrêt naturel entre deux récits : il montre son intention de continuer, le jeu est déjà à l'arrêt (Stop envoyé), rien ne tourne, rien ne rôde ; la publicité passe avant que le récit ne parte |
| `reprise` : le joueur, sur l'écran-titre, touche « Continuer » — ou, depuis la 2.48, quand plusieurs récits sont en cours, en choisit un dans la liste qu'ouvre « Continuer » (rien avant le choix) | **oui** | même raisonnement ; mais Poki sert déjà une publicité au chargement : à couper si Poki le préfère |
| fermeture de la halte | **non** | on revient au milieu d'un lieu, où ce qui rôde continue : la publicité y serait au milieu d'une scène |
| combat, dialogue, pourparler, prière, carton, descente | **jamais** | demandé par le décideur |
| fin de chapitre, retour à la Chaîne (sans autre geste) | non | le joueur n'a pas encore montré d'intention ; le Stop est déjà envoyé |

Pour changer : `true` / `false` dans `REGLAGES.moments`, rien d'autre. Poki décide s'il montre une publicité
(« not every call shows an ad ») : le jeu signale, il ne compte rien. Un seul moment par geste du joueur (le branchement
entoure `U.startSaga`, `U.resume` et, depuis la 2.48, `U.reprendre` ; une pause faite, celle qu'il appellerait dedans ne
se refait pas).
Le moment `chaine` ne couvre pas le grand bouton « dernier maillon » de la Chaîne (il lance le chapitre sans passer par
`startSaga`) : à ajouter si Poki veut ce moment aussi.

## 3. Les règles relevées, avec leur adresse, et ce que le jeu fait

| Règle de Poki | Adresse | État |
|---|---|---|
| Ordinateur, téléphone et tablette ; plein écran en hauteur et/ou en largeur | requirements-quality | le jeu remplit l'écran dans les deux sens (essais 390 × 844, 844 × 390) ; tablette : manette tactile |
| 16:9, 640 × 360, 836 × 470, 1031 × 580 | requirements-quality | l'image du jeu est 16:9 (768 × 432 points) ; le jeu s'adapte à la place donnée |
| Localstorage dans un `try/catch` | requirements-quality | prouvé pour le paquet web (essai « stockage refusé » de `essai web`), pas rejoué ici ; le branchement lit `Storage.getItem` dans un `try/catch` |
| Aucune requête au-dehors ; polices et ressources embarquées | requirements-quality, external-resources-policy | oui ; seul le SDK ; essai : aucune autre requête |
| Pas d'écran de lancement, pas de lien sortant ; logo de studio permis à l'écran de chargement ; seul le SDK de Poki sert des publicités | requirements-quality | oui (partage retiré) ; le jeu n'a pas d'écran de lancement |
| Jouable avec un bloqueur de publicité ; pas de message maison | requirements-quality | oui (essais « SDK bloqué » et « init refusé ») |
| Événements du SDK jamais deux fois de suite ; Start au premier geste, pas au chargement ; Stop à toute interruption ; rien pendant un midroll ; `commercialBreak` seulement au retour d'une pause | requirements-quality, game-events | oui (essai) |
| Son coupé pendant la publicité, clavier et entrées désactivés | sdk-html5, requirements-quality | oui (essai : gain 0, voile plein cadre, clavier et toucher ignorés) |
| Pas de minuterie interne de publicité | requirements-quality | oui |
| Sauvegarde : sauvegarder, ou dire que la progression ne l'est pas | requirements-quality | le jeu garde seul sa partie (stockage du navigateur) ; « Ta partie » exporte et importe |
| Page ne défile pas | requirements-quality, sdk-html5 | oui (essai : scrollY 0, témoin sans branchement 400) |
| Échap ou espace pour la pause, avec les bons événements | requirements-quality | Échap : la halte (Stop puis Start) ; l'espace n'est pas la pause |
| Cinématiques et introductions que l'on peut passer ; peu d'écrans avant de jouer ; tutoriels visuels | requirements-quality, easy-access | voir « À décider » |
| Contrôles adaptés à l'appareil | requirements-quality | oui : clavier au bureau, manette tactile au toucher |
| Pas d'achat dans le jeu, pas de monnaie secondaire superflue | requirements-quality | pas d'achat ; les dirhams se gagnent en jouant (bourse d'Idris) |
| Pas de chat ; un emoji suffit | content-player-safety, external-resources-policy | pas de chat |
| Contenus refusés : violence graphique, effets scabreux, jeux d'argent, alcool, tabac, stéréotypes… ; propriété intellectuelle détournée | content-player-safety | le jeu n'a ni sang ni jeu d'argent (les chimères sont abstraites ; le pari n'est qu'une chimère) ; aucune propriété d'autrui ; Poki ne parle ni de religion ni d'enfants en particulier : sujet à écrire à Poki (voir ci-dessous) |
| Chaque nouvelle version passe une modération de contenu avant les tests | content-player-safety | à prévoir à chaque mise à jour |
| Miniatures fixe et animée ; trois captures au dépôt | requirements-quality, share | hors paquet : à produire (les captures de `v2/.smoke/plateformes/poki/`, les shorts) |
| Langues : l'anglais d'abord (EFIGS + turc), puis CJK, portugais, russe ; `getLanguage()` ; sélecteur dans le menu ; l'arabe n'est pas mentionné | localization | le jeu offre fr, ar, ar vocalisé, en ; suit `getLanguage()` s'il est offert, sinon l'anglais |
| Chargement rapide (10 s), chargement progressif, barre de chargement ; pas de taille limite écrite | requirements-quality, easy-access | un fichier de 5,8 Mo (2,2 Mo en zip) : tout est là au départ ; pas de barre de chargement (le jeu s'ouvre sur son titre) |
| Portrait recommandé (publicité « Gamebar » sur mobile) | easy-access, how-monetization-works | le jeu se joue en hauteur |
| Outil d'essai : Poki Inspector (inspector.poki.dev) : dossier avec `index.html`, journal des événements, tests de tailles, avertissements de ressources externes | inspector, sdk-html5 | à passer par le décideur ou à la demande de Poki, sur le vrai SDK (l'essai d'ici n'a jamais touché le vrai) |
| Conditions générales pour développeurs (PDF) à lire avant dépôt | requirements-quality | à lire par le décideur |

## 4. À décider

1. **La publicité.** Poki impose la sienne et seule la sienne (`/guide/requirements-quality`, « Only Poki's SDK may serve
   ads »). Formats (`/guide/how-monetization-works`) : *midroll* (aux pauses naturelles que le jeu signale ; Poki décide s'il
   en montre), *rewarded* (le paquet n'en appelle aucune), *Gamebar display* (sur mobile en portrait, automatique).
   **La documentation lue ne parle d'aucun filtre de catégories de publicité** : rien ne dit qu'on peut écarter des
   annonceurs (jeux d'argent, alcool, rencontres…) — la page de sécurité dit seulement que Poki est plus strict « parce que
   les partenaires publicitaires doivent être à l'aise ». À demander à Poki **par écrit avant de signer**, pour un jeu dont
   le sujet est religieux, pour des enfants de 10 à 12 ans. Les pourcentages de partage des revenus ne sont pas publiés :
   ils sont dans l'accord.
2. **L'exclusivité** (`/guide/revenue-deal-types`). Préférée de Poki : « web exclusive », **5 ans par défaut**, « indicative »
   (l'accord fait foi). Elle couvre le web ouvert, **Discord et YouTube Playables compris**. Restent permis : Steam, les
   boutiques mobiles, les consoles. Le contrat dira ce qu'elle interdit exactement ; la page lit : « jeu publié *uniquement*
   sur Poki sur le web ». Sur ce projet, ce serait donc : pas d'itch.io, pas de Newgrounds, pas de CrazyGames, pas d'APK en
   téléchargement direct (à vérifier : « mobile app stores » est permis, le web ne l'est pas), et **le site du jeu lui-même**
   sans doute aussi, à demander. L'autre voie : « non exclusif », une licence forfaitaire unique, sans partage de revenus,
   pour un jeu déjà en ligne ailleurs. Et la sortie de cinq ans : que devient le jeu au terme ?
3. **Les moments de publicité** : `chaine` et `reprise` proposés ; la halte refusée ; le grand bouton « dernier maillon » non
   couvert. Poki dit : un `commercialBreak` seulement « au retour d'une pause » : à faire lire par Poki (Inspector).
4. **La langue.** Poki recommande l'anglais d'abord ; l'arabe n'est pas dans ses listes. Proposition : le jeu s'ouvre dans la
   langue de Poki si c'est le français, l'arabe ou l'anglais, sinon en anglais (`langueParDefaut`). Faut-il l'anglais d'office
   (comme CrazyGames) ? Les textes en anglais sont écrits à la source ; le japonais est retiré.
5. **« Version bêta » (décision 39).** La réserve doit rester sur la page du jeu. Poki a une page de jeu (« Your game page »,
   `/guide/your-game-page`, non lue) : la réserve devra s'y trouver, et le jeu l'affiche déjà sur son titre (« version bêta
   2.47 »). À demander : Poki peut-il garder la mention ?
6. **Le contenu religieux.** Aucune page lue ne cite la religion : ni permise, ni interdite. Les règles « jamais de polémique »,
   « aucun prophète représenté », « pas de jeu d'argent » du jeu vont dans le sens de Poki. À écrire à Poki avant le dépôt.
7. **Le plein écran maison** (bouton de la scène, réglage « Plein écran », demande au premier toucher en largeur) et le
   **partage** : Poki ne parle pas du plein écran du jeu ; le cadre de Poki décide (le jeu ne paraît pas de bouton si le cadre
   le refuse). Le partage est retiré ; Poki propose `shareableURL()` (adresse de la page Poki, paramètres `gd…`) : à décider si
   l'on veut un partage qui renvoie vers Poki — rien n'est fait.
8. **Écran-titre, prologue, introductions.** Poki : « minimiser les écrans, idéalement dans le jeu aussitôt », « toutes les
   introductions et cinématiques passables », « pas d'écran de titre pour les nouveaux joueurs » (`easy-access`). Le jeu s'ouvre
   sur un titre, puis un écran du personnage, puis un prologue long sans bouton « passer » ; les cartons ne se passent pas
   d'un geste. À décider : un prologue passable ? un titre sauté à la première visite ? (Le moteur n'est pas modifié ici.)
9. **« Ta partie » (enregistrer/importer un fichier)** : dans le cadre de Poki, un téléchargement ou le sélecteur de fichier
   peut être refusé ; à voir dans l'Inspector. Le texte à copier reste.
10. **Les miniatures et captures** (fixe, animée, trois captures) : à produire ou à faire valider ; l'IA : Poki demande de dire les
    outils et interdit les marques visibles d'IA.
11. **La confidentialité.** Aucun lien sortant, aucune donnée envoyée par le jeu ; Poki, lui, charge ses propres scripts :
    sa politique est la sienne.
