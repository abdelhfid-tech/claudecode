# plateformes/ — les paquets du jeu pour chaque plateforme

Le jeu (`v2/index.html`, assemblé par `v2/tools/build.js`) n'est pas modifié : chaque paquet se fait **à côté du jeu**, comme
la démo jouable (`v2/tools/jouable.js`). L'outil est `v2/tools/plateformes.js` ; ses modules sont dans `v2/tools/plateformes/`.

## Ce que contient ce dossier

| Chemin | Rôle | Versionné |
|---|---|---|
| `polices/*.woff2` | les polices du jeu, réduites aux caractères qu'il emploie (décision du décideur, 25 novembre : « Les polices : embarquées, réduites aux caractères que le jeu emploie ») — une tranche par fichier, découpées comme Google Fonts les sert | oui |
| `polices/polices.json` | pour chaque fichier : famille, graisse, style, tranche, `unicodeRange`, octets, SHA-256, d'où il vient (l'adresse `fonts.gstatic.com`), sa taille et son empreinte avant réduction ; la règle de réduction ; les licences | oui |
| `polices/LICENCE-<famille>.txt` | la licence de chaque famille (SIL Open Font License 1.1), relevée à la source : le dépôt `google/fonts`, `ofl/<famille>/OFL.txt` ; `polices.json` dit aussi ce que chaque police déclare elle-même (table `name`) | oui |
| `sortie/<cible>/` | les paquets faits | **non** (`.gitignore`) : ils se refont par l'outil |

Les polices : Alegreya (400, 700, 400 italique), Amiri, Amiri Quran, Cinzel (500, 700), Reem Kufi (500, 700),
Share Tech Mono, Noto Naskh Arabic (400, 700) — les familles, graisses et styles que demande la ligne `<link>` du jeu.
Elles gardent toutes leurs fonctions de mise en forme (l'arabe se lie et se vocalise). Ce qui est gardé : tous les
caractères du jeu assemblé et de `v2/src/lang/**`, l'ASCII, le Latin-1, le Latin étendu A, la ponctuation générale (le
joueur tape le nom de son personnage) et, pour les polices arabes, le bloc arabe U+0600–06FF et les formes de
présentation B U+FE70–FEFC — chacun dans la tranche où Google le sert. Un caractère hors de cet ensemble (une lettre
cyrillique tapée dans un nom, par exemple) prend la police de repli de l'appareil.

## Les commandes

```sh
node v2/tools/plateformes.js                 # les cibles connues
node v2/tools/plateformes.js web             # sortie/web/index.html : un seul fichier, polices embarquées (data:, woff2)
node v2/tools/plateformes.js itch            # sortie/itch/isnad-<numéro>-itch.zip : index.html à la racine, rien d'autre
node v2/tools/plateformes.js web itch        # plusieurs cibles ; « tout » : toutes
node v2/tools/plateformes.js essai web       # le paquet, puis son essai : « OK » par preuve, « PAQUET CONFORME », sinon « ÉCART »
node v2/tools/plateformes.js essai itch      # idem, sur l'index.html relu dans le zip
node v2/tools/plateformes.js polices         # retélécharge la feuille de Google Fonts et la réduit (le seul pas qui demande le réseau)
```

Faire un paquet ne demande pas le réseau : les polices sont lues ici, leurs empreintes contrôlées contre `polices.json`.
`plateformes.js polices` demande `pip install fonttools brotli` (réduction par `v2/tools/plateformes/reduire.py`) ; on le
relance quand le jeu emploie un caractère nouveau, ou quand la ligne des polices du jeu change.

Le numéro du paquet est celui du jeu assemblé (`window.ISNAD_VERSION`) ; `JEU_SOURCE=<fichier>` fait le paquet d'un autre
jeu assemblé.

## L'essai

1. **a.** Sans réseau, en français puis en arabe : l'écran-titre, « Nouvelle partie », « Commencer », les premières
   répliques — aucune requête hors du fichier (`data:`, `blob:`, `about:`), aucune erreur.
2. **b.** Chaque famille est chargée (`document.fonts`) et sert vraiment ; pour une centaine de textes du jeu (français,
   arabe, arabe vocalisé, anglais, titres en Cinzel, chiffres en Share Tech Mono), la largeur mesurée dans le paquet est
   celle du jeu chargé avec le réseau, à 0,5 point près, dans la page et sur un canevas.
3. **c.** Dans un cadre `<iframe>` d'une autre origine que la page hôte (deux petits serveurs HTTP locaux : c'est ainsi
   qu'itch.io joue un jeu HTML), en 960 × 540, 390 × 844 et 844 × 390 : le démarrage, une partie neuve, la partie gardée
   après rechargement du cadre, « Ta partie » (« Enregistrer le fichier », « Copier le texte »), l'import (« Choisir un
   fichier »), « Partager ma progression » et ses replis ; puis le stockage refusé, et un cadre qui accorde plein écran et
   presse-papiers. Ce qu'un cadre empêche est écrit « · » et rappelé à la fin.
4. **d.** Puis, l'un après l'autre : `JEU=<paquet> node tools/manette.js` et `node tools/loupe.js` (depuis `v2/`).

`SANS_D=1` saute le point d ; les captures et les sorties de manette.js et loupe.js sont dans `v2/.smoke/plateformes/<cible>/`.

## Ajouter une cible

Une cible est un module `v2/tools/plateformes/<cible>.js` que le répartiteur charge par son nom ; on n'a à toucher aucun
autre fichier. Il exporte `{ description, faire(C) }` : `C` est `commun.js` (lire le jeu, poser les polices, écrire une
sortie, faire un zip, les contrôles communs) ; `faire` rend au moins `{ page }` (le fichier HTML que l'essai éprouve), et
`zip` / `entrees` pour un zip. `web.js` et `itch.js` en sont les modèles. `commun`, `polices` et `essai` ne sont pas des
cibles.

## Newgrounds et CrazyGames (Basic Launch)

```sh
node v2/tools/plateformes.js newgrounds                  # sortie/newgrounds/isnad-<numéro>-newgrounds.zip (le paquet web, index.html seul)
SANS_D=1 node v2/tools/plateformes.js essai newgrounds   # l'essai générique, dans un cadre d'une autre origine
node v2/tools/plateformes.js crazygames                  # sortie/crazygames/isnad-<numéro>-crazygames.zip : le paquet web + un préambule
node v2/tools/plateformes/crazygames/essai.js            # l'essai propre : anglais d'office, langues, pas de plein écran, touchers comptés
```

Fiches : `newgrounds.md`, `newgrounds-textes-a-valider.md`, `crazygames.md`, `crazygames-textes-a-valider.md` (la lecture des pages officielles de
CrazyGames est faite ; celle de Newgrounds a été refusée, HTTP 403 : tout y est « non vérifié »). Le préambule de CrazyGames est dans
`v2/tools/plateformes/crazygames/` (`preambule.js`, `preambule.css`) ; ce dossier n'est pas une cible.

## Poki (ajouté par l'agent Poki)

`node v2/tools/plateformes.js poki` — `sortie/poki/isnad-<numéro>-poki.zip` : le paquet web + la balise du SDK de Poki
(`poki/balise-sdk.html`) + son branchement (`poki/poki.js`, versionné). L'essai (`essai poki`, SDK faux) est dans
`v2/tools/plateformes/poki.js` ; la fiche, avec les règles relevées et ce qu'il reste à décider : `poki.md`.

## L'application Android et iOS (ajouté par l'agent de l'application)

```sh
node v2/tools/plateformes.js android                 # sortie/android/isnad-<numéro>-test.apk (débogage, à installer à la main), isnad-<numéro>.aab (non signé), controle.txt
node v2/tools/plateformes.js ios                     # sortie/ios/isnad-<numéro>-ios.zip : le projet Xcode prêt à ouvrir sur un Mac (non compilé ici)
node v2/tools/plateformes/application/essai.js       # le pont, par un faux Capacitor (Android, puis iOS) : « PAQUET CONFORME »
node v2/tools/plateformes.js essai android           # l'essai commun, sur la page de l'application
```

Le projet Capacitor est dans `application/` (versionné : `package.json` et son verrou aux versions figées,
`capacitor.config.json`, `android/`, `ios/`, `pont.js`, `icone/icone.js`, `textes-a-valider.md` ; non versionnés :
`node_modules/`, `www/`, les dossiers de construction). La page de l'application est le paquet web plus **une seule
insertion** avant `</head>` : le moteur JS de Capacitor (`@capacitor/core`, MIT, inerte hors d'une application) et le pont
(`application/pont.js` : enregistrer un fichier et partager par la feuille de partage du téléphone, le bouton Retour, la
partie recopiée dans un fichier de l'application et remise avant que le jeu ne lise). Ôter l'insertion redonne le paquet
web, octet pour octet : c'est contrôlé, jusque dans l'APK. L'atelier commun (`v2/tools/plateformes/application/`) n'est pas
une cible. Il faut le SDK Android hors du dépôt (`ANDROID_HOME`, par défaut `/root/android-sdk`) et Java 21. Fiches :
`android.md`, `ios.md`.

## Le site (présentation et versions de test)

```sh
node v2/tools/plateformes.js site            # sortie/site/ (un dossier statique, à héberger) et sortie/isnad-site-<numéro>.zip
node v2/tools/plateformes.js essai site      # son essai propre (en-têtes de _headers appliqués, pages, liens, jouer/ hors ligne) : « SITE CONFORME »
```

Les sources, les réglages (`site.json` : TestFlight, itch.io, indexation) et les textes à valider sont dans `site/`
(`site/LISEZ-MOI.md`) ; l'outil dans `v2/tools/plateformes/site.js` et `v2/tools/plateformes/site/` (ce dossier n'est pas une cible).
