# Le site — textes à valider par le décideur

Tout texte public du site est une **proposition**. Ce qui vient de `v2/tools/promotion.js` (le nom, le sous-titre, la
devise, l'état, la réserve, le contact, la mention du soutien) et des données du jeu (les cinq récits : nom, Lumière,
années, phrase) n'est pas recopié ici : le site le lit à sa source à chaque assemblage.

Légende : **[livret]** repris tel quel du livret court déjà sous vos yeux (`promo/livret-2x/livret.src.html`, page
indiquée) ; **[livret, retouché]** repris, avec ce qui change ; **[nouveau]** écrit pour le site.

## Ce qui demande d'abord votre regard

1. **« Pour les jeunes, à partir de dix ans »** (accueil, « Pour qui ») — l'âge n'est écrit nulle part ailleurs pour le
   public ; je l'ai tiré de la relecture « 10-12 ans ». À confirmer, ou à retirer.
2. **« chimères » au lieu d'« égrégores »** dans les phrases reprises du livret (pages 4 et 7) : le vocabulaire du jeu a
   changé (D183). Le livret, lui, dit encore « égrégores ».
3. **« Tout est en français »** (livret p. 10) n'est pas repris : le jeu a aujourd'hui trois langues.
4. **L'icône** de l'écran d'accueil (`jouer/`) et du site est celle de l'application (trois maillons d'or), proposée
   par l'agent de l'application (`plateformes/application/icone/icone.js`) : elle n'est pas tirée du jeu ; elle se
   valide une fois pour les deux.
5. **La page « Confidentialité »** engage le projet : elle doit rester vraie pour l'APK et l'application iPhone aussi
   (aucun service extérieur), et pour l'hébergeur que vous choisirez (la phrase sur ses journaux techniques).

## Accueil (`index.html`)

- Titre de l'onglet : « ISNAD — Chroniques des Compagnons » [nouveau, fait de promotion.js].
- Description (moteurs de recherche, partage) : « Un jeu de rôle sur les Compagnons, après la mort du Prophète ﷺ : cinq
  récits, dans le navigateur, sans installation. Version bêta. » [nouveau]
- Chapeau : « Un jeu de rôle au tour par tour sur les Compagnons, après la mort du Prophète ﷺ. Cinq récits, de Médine à
  Koufa. Dans le navigateur, sur un téléphone comme sur un ordinateur, sans installation. » [livret p. 1 et 2, retouché]
- Boutons : « Jouer maintenant », « Les versions de test » [nouveau].
- Sous la réserve : « Une erreur — une date, une attribution, une formulation ? Signalez-la : le jeu se corrige. Et
  vérifiez toujours auprès des sources et de ceux qui savent. » [livret p. 12]
- **Le jeu, en quelques mots** : « Cinq récits, de la mort du Prophète ﷺ à la fin du califat bien guidé, en pixel art
  éclairé. » [livret p. 2, retouché : la première phrase est dans le chapeau] ; « On y traverse Médine, le désert, la
  mer, Koufa. On y parle avant de combattre. On y creuse une tranchée, on y bâtit un puits. Et l'on y affronte des
  idoles — jamais des personnes. » [livret p. 2] ; « Le sujet est religieux et historique : l'exactitude et le respect y
  passent avant toute considération de jeu. » [livret p. 2]
- **L'isnâd : la chaîne** : « *Isnâd* : la chaîne de ceux qui transmettent. Le jeu en fait son fil. En 2084, un
  archiviste — un *râwî*, un transmetteur — remonte la Chaîne : cinq maillons, cinq témoins. » [livret p. 3] ; « La
  fiction de 2084 pose la question du jeu : que vaut une parole dont on ne sait plus de qui on la tient ? » [livret p. 11]
- **Pour qui** : « Pour les jeunes, à partir de dix ans, et pour ceux qui les accompagnent : parents, enseignants. »
  [nouveau] ; « Ce qu'il peut faire : donner envie d'ouvrir les livres ; faire sentir ce qui sépare une parole sourcée
  d'une rumeur. » ; « Ce qu'il ne fait pas : il ne remplace ni un livre, ni un cours, ni un savant. » ; « Fiction et
  histoire : le jeu mêle les deux, et dit toujours laquelle il raconte. » [livret p. 10] ; « Rien à créer, rien à
  acheter : ni compte, ni achat, ni publicité. » [livret p. 10, retouché]
- **Ce qu'on y fait** : « La parole avant le sabre. Un pourparler se gagne par des réponses vraies ; menacer ou flatter
  fait perdre la confiance. » [livret p. 7] ; « Le combat, au tour par tour, contre des chimères : les idoles que les
  cœurs fabriquent ensemble. On ne les détruit pas en les haïssant : on les dévoile, on montre qu'elles sont vides. »
  [livret p. 4 et 7, retouché : « chimères », et la phrase citée entre guillemets dans le livret est mise au style
  indirect] ; « Bâtir, s'orienter, voyager : un puits, des palmiers, une tranchée ; la nuit, le cadran des étoiles ; la
  route d'une ville à l'autre. » [livret p. 7, retouché : « commercer » devient « voyager », la carte du monde est
  ajoutée] ; « La noosphère : un labyrinthe tiré au hasard, sous un chrono, où rôdent de petites chimères. » [livret
  p. 7, retouché]
- **Les cinq récits** : « Chaque récit suit un Compagnon et porte une Lumière. » [livret p. 5, « saga » devient
  « récit »] ; puis les cinq récits, lus dans le jeu ; « Autour de ces vies, deux récits de fiction, dits comme tels :
  en 2084, Idris, l'archiviste ; au bord du désert, un Caïd qui lit ces vies à la veillée pour apprendre à tenir sa
  citadelle. » ; « Les dissensions entre Compagnons sont évoquées avec retenue, sans désigner de coupable. » [livret p. 6]
- **Ce que le jeu s'interdit** : les cinq points du livret p. 4 (le troisième retouché : « seulement des chimères ») ;
  et un sixième, « Les paroles ont leur source. Une parole attestée paraît avec sa source ; quand une attribution est
  discutée, le jeu écrit « On rapporte ». Les versets sont donnés en traduction du sens, avec leur référence. » [livret
  p. 8, resserré]
- **Trois langues** : « Le jeu se joue en français, en arabe — au choix, l'arabe entièrement vocalisé — et en anglais.
  Chaque langue est écrite à la source, et non traduite du français : les paroles et les versets y viennent de leurs
  sources. » ; « Pour apprendre, une seconde langue peut s'afficher sous chaque réplique. » [nouveau, d'après
  l'exigence 25 et la langue secondaire]
- **Des images du jeu** : « Toutes prises dans le jeu, version 2.47. » ; « Sur un téléphone », « Sur un grand écran »
  [nouveau]. Légendes : « L'écran-titre », « Médine », « La Chaîne », « Un combat », « Au désert », « La noosphère »,
  « La Cité-Miroir, en 2084 », « En arabe » [nouveau].
- **Essayer** : « Le jeu s'ouvre dans le navigateur, sans installation, et peut se garder sur l'écran d'accueil d'un
  téléphone. Les versions de test pour Android et pour iPhone sont sur la page « Tester ». » [nouveau]

### Textes de remplacement des images (pour qui ne voit pas l'image) [nouveau ; trois viennent du livret]

- L'écran-titre du jeu : ISNAD, Chroniques des Compagnons, au-dessus d'une ville au couchant.
- Médine : Abû Bakr et ses compagnons, un voile de lumière pour visage.
- L'écran de la Chaîne : les maillons, du premier au dernier, chacun avec son Compagnon et sa Lumière.
- Un combat au tour par tour : ‘Umar et ses compagnons face au Trône vide, une idole. [livret p. 7, retouché]
- Un camp au désert, au couchant : Khâlid et ses compagnons près des tentes. [livret p. 5]
- La noosphère : un labyrinthe tiré au hasard, sous un chrono.
- La Cité-Miroir, en 2084 : une rue au crépuscule, un grand écran. [livret p. 11, retouché]
- Le jeu en arabe : la première phrase du prologue, dans la Cité-Miroir.
- Logo de l'Institut Islam Actuel. [livret p. 13]

## Tester (`tester/`)

- « Tester le jeu » ; « Trois façons d'essayer la version 2.47. La plus simple est la première : elle n'installe rien. »
  [nouveau ; « elle marche sur tous les téléphones » retiré : rien ne le prouve, l'essai n'a tourné que dans Chromium]
- **1. Dans le navigateur, tout de suite** : « Le jeu s'ouvre dans la page : rien à installer, aucun compte. » ; « Le
  garder sur l'écran d'accueil » ; « iPhone (Safari) : le bouton Partager, puis « Sur l'écran d'accueil ». » ;
  « Android (Chrome) : le menu ⋮, puis « Installer l'application » ou « Ajouter à l'écran d'accueil ». » ; « Une fois
  ouvert, le jeu peut se rouvrir sans réseau. » [nouveau ; « peut » : prouvé dans Chromium seulement, ni Safari ni
  l'écran d'accueil d'un iPhone]
- **2. Android : l'application de test** : « Télécharger l'APK de test » ; « Empreinte SHA-256, pour vérifier le
  fichier : » ; « L'installer, en trois gestes » : « Sur le téléphone, touchez « Télécharger l'APK de test ». » ;
  « Ouvrez le fichier téléchargé. Android demande d'autoriser l'installation depuis le navigateur : autorisez-la. » ;
  « Touchez « Installer », puis ouvrez ISNAD. » ; « C'est une version de test, hors du Play Store : Android peut
  prévenir qu'elle vient d'une source inconnue. Une fois le jeu installé, vous pouvez retirer cette autorisation dans
  les réglages. » — sans APK : « Bientôt » ; « En attendant, le jeu se joue dans le navigateur (1), et se garde sur
  l'écran d'accueil. » [nouveau]
- **3. iPhone : TestFlight** : avec le lien (site.json) : « Installez TestFlight, l'application d'Apple pour les versions
  de test (sur l'App Store). » ; « Sur l'iPhone, ouvrez l'invitation : rejoindre le test d'ISNAD. » ; « Dans
  TestFlight, touchez « Installer ». » — sans lien : « Bientôt » ; puis « En attendant — ou sans TestFlight — le jeu se
  joue dans Safari (1), et se garde sur l'écran d'accueil. » [nouveau]
- Avec le lien itch.io (site.json) : « Le jeu est aussi sur itch.io : sa page. » [nouveau]
- **Votre partie** : « La partie reste sur l'appareil, dans le navigateur ou dans l'application : rien n'est envoyé
  nulle part. » ; « Pour la mettre à l'abri, ou la passer sur un autre appareil : dans la halte (le bouton ☰),
  « Exporter la partie », puis « Enregistrer le fichier ». Pour la reprendre : à l'écran-titre, « Importer une
  partie ». » (les noms des boutons sont ceux du jeu) ; « Sur iPhone, le jeu gardé sur l'écran d'accueil a sa propre
  partie, distincte de celle de Safari : passez-la de l'un à l'autre par le fichier. » [nouveau]
- **Une erreur ?** : « Une date, une attribution, une formulation, un écran qui se coince : écrivez-nous, avec le numéro
  de la version (2.47) et, si possible, une capture d'écran. » [nouveau, d'après le livret p. 12]

## Confidentialité (`confidentialite/`)

- « Confidentialité » ; « En une phrase : nous ne collectons rien. » [nouveau]
- « Ni publicité, ni mesure d'audience, ni traceur. Le site et le jeu n'appellent aucun service extérieur : aucun script
  tiers, aucun réseau social, aucune police chargée d'ailleurs — les polices sont embarquées. »
- « Ni compte, ni inscription. On joue sans donner son nom ni son adresse. »
- « Ni cookie. Le site n'en dépose aucun. »
- « La partie reste sur l'appareil. Le jeu garde la partie et les réglages dans le stockage du navigateur, ou de
  l'application, sur l'appareil lui-même. Rien n'est envoyé nulle part. Effacer les données du site, ou désinstaller
  l'application, efface la partie : « Enregistrer le fichier » la met à l'abri. »
- « Hors ligne. Pour se rouvrir sans réseau, le jeu se garde dans le cache du navigateur. Rien d'autre n'y est mis. »
- « Partager, c'est vous qui le faites. « Partager ma progression » prépare une image et un texte ; c'est vous qui
  choisissez de les envoyer, et à qui. »
- « Nous écrire. Si vous nous écrivez, nous ne gardons votre message que pour vous répondre et corriger le jeu. »
  (un engagement : à confirmer)
- « Comme tout serveur, celui qui héberge ce site peut tenir des journaux techniques (l'adresse qui demande une page, la
  page demandée). Nous n'y ajoutons rien. » (à ajuster selon l'hébergeur choisi)

## Page introuvable (`404.html`)

- « Page introuvable » ; « Ce maillon manque à la chaîne : cette page n'existe pas, ou plus. » ; « Revenir au jeu »,
  « Jouer maintenant » [nouveau]

## En-tête et pied de chaque page

- « Aller au contenu » (pour le clavier et les lecteurs d'écran), « Le jeu », « Tester », « Jouer », « Confidentialité »,
  « Nous écrire » [nouveau] ; le pied redit la devise, la réserve, le numéro et l'état (promotion.js).

## L'écran d'accueil du téléphone (`jouer/manifest.webmanifest`)

- Nom : « ISNAD — Chroniques des Compagnons » ; nom court : « ISNAD » ; description : « Chroniques des Compagnons.
  Version bêta. » (faits de promotion.js) [nouveau]

## Ce que la première liste oubliait (relevé par la contre-lecture)

- Les descriptions des pages (la balise `description`, que montrent les moteurs et les aperçus de lien) :
  « Essayer ISNAD : dans le navigateur tout de suite, sur Android, sur iPhone. » (Tester) ;
  « ISNAD ne collecte rien : ni publicité, ni mesure d'audience, ni compte. » (Confidentialité) ;
  « Cette page n'existe pas. » (404) [nouveau]
- Les titres d'onglet : « Tester ISNAD — Version bêta », « Confidentialité — ISNAD », « Page introuvable — ISNAD »
  [nouveau]
- L'étiquette du menu, pour les lecteurs d'écran : « Navigation » [nouveau]
- La ligne sous le bouton de l'APK : « isnad-2.47-test.apk · 7,1 Mo · version 2.47 » (faite par l'outil) [nouveau]

## À unifier entre les supports (à trancher une fois)

- « cinq récits » (le site, la fiche itch.io) ou « cinq sagas » (l'écran-titre du jeu : « Un JRPG rétro-HD en cinq sagas ») ;
- « JRPG » (itch.io, les fiches en anglais) ou « jeu de rôle au tour par tour » (le site) ;
- le vouvoiement (le site) ou le tutoiement (la fiche itch.io, le jeu lui-même) ;
- l'âge : « à partir de dix ans » (le site) et PEGI 12 (évoqué pour CrazyGames) : un seul âge public ;
- « la fin du califat bien guidé » (repris du livret) : à relire au regard de l'exigence 5.

