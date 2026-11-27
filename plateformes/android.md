# ISNAD sur Android — fiche pas à pas

Deux fichiers, faits par `node v2/tools/plateformes.js android` dans `plateformes/sortie/android/` :

| Fichier | À quoi il sert |
|---|---|
| `isnad-<numéro>-test.apk` | **l'APK de test** : on l'installe à la main sur un téléphone. Il est signé d'une clé de débogage (créée par les outils Android sur la machine qui l'a fait, hors du dépôt). Il n'est pas fait pour Google Play. |
| `isnad-<numéro>.aab` | **la version pour Google Play**, *non signée* : tu la signes avec **ta** clé d'envoi (§ 3), jamais ici. |
| `isnad-icone-512.png` | l'icône de la fiche Google Play (512 × 512). |
| `controle.txt`, `manifeste-fusionne-version.xml` | le contrôle fait sans téléphone (identifiant, versions, autorisations, débogage, le jeu embarqué). |

Ce que l'application contient : le jeu tel qu'on le joue sur la page web (le paquet `web`, polices comprises, aucun appel
au-dehors), plus un « pont » (`plateformes/application/pont.js`) qui donne au jeu ce qu'une application n'a pas d'elle-même :
enregistrer un fichier, partager l'image de sa progression, le bouton Retour, et une copie de la partie dans un fichier de
l'application. **Rien n'est collecté, rien ne part sur Internet.**

> **Attention : l'APK n'a encore été lancé ni sur un téléphone ni sur un émulateur** (la machine de l'agent n'en a pas).
> Le pont n'a été éprouvé qu'avec un faux Capacitor dans un navigateur. Le premier essai sur un vrai téléphone est le tien.

## 1. Installer l'APK de test sur un téléphone

1. **Avant tout, si une version d'ISNAD est déjà installée** et qu'elle vient d'ailleurs (Google Play, ou un APK fait sur une
   autre machine) : ouvre le jeu, **Ta partie → Enregistrer le fichier**, et garde le fichier `isnad-partie.json`. Deux
   versions signées de clés différentes ne se remplacent pas : il faudra désinstaller l'ancienne, ce qui efface sa partie.
2. Mets le fichier `isnad-2.47-test.apk` sur le téléphone : câble USB (dossier *Download*), ou envoie-le-toi (Drive,
   courriel) et ouvre-le depuis le téléphone.
3. Touche le fichier dans l'application **Fichiers** (ou dans les téléchargements du navigateur).
4. Android demande d'**autoriser cette source** (« Installer des applis inconnues ») pour l'application qui ouvre le fichier
   (Fichiers, Chrome…) : accepte, pour elle seulement. Tu pourras retirer l'autorisation ensuite (Paramètres → Applications →
   Accès spéciaux → Installer des applis inconnues).
5. **Play Protect** peut avertir d'une « application inconnue » : *Plus de détails → Installer quand même*. C'est attendu
   pour un APK qui ne vient pas de Google Play.
6. ISNAD paraît dans les applications, avec l'icône des trois maillons.

Pour qui a un ordinateur avec les outils Android : `adb install -r isnad-2.47-test.apk`.

**À vérifier au premier lancement** (rien de cela n'a pu l'être ici) : le jeu s'ouvre ; en hauteur et en largeur, ni la
barre d'état ni la barre de navigation ne cachent un texte ou un bouton (elles sont masquées ; un glissement depuis le bord
les fait paraître un instant) ; le son ; **Ta partie → Enregistrer le fichier** ouvre la feuille de partage ; **Partager ma
progression → Partager** aussi, avec l'image ; le bouton **Retour** revient d'un cran et ne ferme jamais le jeu ; quitter
puis rouvrir l'application : « Continuer » est offert.

**Mettre à jour un APK de test** : un APK fait sur la même machine remplace l'ancien et garde la partie. Fait sur une autre
machine (autre clé de débogage), il faut désinstaller d'abord : exporte la partie avant (étape 1), réimporte-la après
(écran-titre → **Importer une partie**).

## 2. Ce qu'il faut pour Google Play

- Un **compte développeur Google Play** (Play Console), à ton nom ou à celui d'une structure ; des frais d'inscription
  uniques ; une vérification d'identité. Pour un compte personnel récent, Google exige un **test fermé** avec un nombre
  minimal de testeurs pendant un nombre minimal de jours avant toute mise en production : la Console le dit au moment
  de créer le compte (ces règles changent : lis-les là).
- **Ta clé d'envoi** (§ 3), gardée hors du dépôt.
- L'**identifiant** de l'application : `org.isnadgame.isnad` est une **proposition**. Il ne se change plus après le premier
  envoi : valide-le (ou choisis-en un autre) avant. Le changer, c'est `appId` dans `plateformes/application/capacitor.config.json`
  et `applicationId`/`namespace` dans `plateformes/application/android/app/build.gradle` (l'agent peut le faire).

## 3. Ta clé d'envoi, et signer l'AAB

La clé d'envoi prouve à Google que c'est bien toi qui envoies. **Elle ne va jamais dans le dépôt, ni sur la machine de
l'agent, ni dans un message.** Sur ton ordinateur (Java installé ; `keytool` et `jarsigner` viennent avec lui) :

```sh
# une fois pour toutes : la clé, dans un fichier à toi (hors du dépôt)
keytool -genkeypair -v -keystore ~/cles/isnad-envoi.jks -alias isnad-envoi -keyalg RSA -keysize 4096 -validity 10000
# à chaque version : signer l'AAB fait par l'outil
jarsigner -keystore ~/cles/isnad-envoi.jks -signedjar isnad-2.47-signe.aab isnad-2.47.aab isnad-envoi
jarsigner -verify isnad-2.47-signe.aab        # doit dire « jar verified »
```

- `keytool` demande un mot de passe et un nom (il peut être celui de la structure). Garde le fichier `.jks` **et** son mot
  de passe en deux endroits sûrs (un gestionnaire de mots de passe, une sauvegarde hors ligne).
- **Play App Signing** : au premier envoi, la Console te propose de laisser Google garder la clé qui signe l'application
  installée chez les joueurs ; ta clé ne sert alors qu'à l'envoi. Accepte : si tu perds ta clé d'envoi, Google peut la
  remplacer (demande depuis la Console) ; sans cela, une clé perdue empêche toute mise à jour.
- Une installation venue de Google Play et l'APK de test ont des signatures différentes : sur un même téléphone, l'une
  remplace l'autre seulement après désinstallation (exporte la partie avant).

## 4. Mettre l'application en test (interne, puis fermé)

1. Play Console → **Créer une application** : nom `ISNAD`, langue par défaut français, *Jeu*, *Gratuit*. Coche les
   déclarations.
2. **Tester → Test interne → Créer une version** : dépose `isnad-2.47-signe.aab`. Le nom de version se remplit seul (2.47).
   Notes de version : une ligne (proposée dans `plateformes/application/textes-a-valider.md`).
3. **Testeurs** : une liste d'adresses (jusqu'à cent pour le test interne) ; la Console donne un **lien d'inscription**
   que tu envoies toi-même aux testeurs. Le test interne n'est pas relu par Google et ne paraît pas dans le magasin.
4. Le **test fermé** (« Closed testing ») marche de même, passe par un examen de Google, et c'est celui que la Console exige
   avant la production pour un compte personnel récent.
5. Chaque nouvel envoi demande un **versionCode** plus grand : l'outil le tire du numéro du jeu (2.47 → 247 ; 2.48 → 248).
   Pour renvoyer la même version du jeu, il faut d'abord faire avancer le numéro du jeu.

## 5. Les formulaires de la Console (« Contenu de l'application »)

| Rubrique | Réponse proposée (à valider) |
|---|---|
| **Sécurité des données** | *L'application collecte-t-elle ou partage-t-elle des données ?* **Non.** Le jeu n'envoie rien : la partie reste sur le téléphone (dans le stockage de l'application et une copie dans ses fichiers). Le partage d'une image ou d'un fichier passe par la feuille de partage du téléphone, au choix du joueur, vers l'application qu'il choisit : ce n'est pas une collecte par le développeur. |
| Publicités | **Non.** |
| Accès à l'application | Tout est accessible sans compte ni identifiant. |
| Règles de confidentialité | Une adresse de page est demandée : proposition de texte dans `textes-a-valider.md` (à publier, par toi, sur le site du jeu). |
| Classification du contenu | Questionnaire IARC : un jeu de rôle, des combats contre des chimères (des idées, pas des personnes), sans sang, sans jeu d'argent (aucun pari, aucune mise), sans achat dans l'application, sans échange entre joueurs. |
| Public cible | **À décider.** Si l'âge visé comprend les moins de 13 ans, le programme « Familles » de Google s'applique (obligations de plus, examen plus strict). |
| Application d'actualités, santé, gouvernement… | Non. |

## 6. Ce que l'agent a réglé, et ce qui reste à décider

**Réglé (et contrôlé dans `controle.txt`)** : identifiant `org.isnadgame.isnad` (proposé) ; version 2.47 (247) ; minSdk 24,
targetSdk 36, compileSdk 36 (ce que Google Play exige) ; les deux orientations ; plein écran ; aucun trafic en clair ; la
version publiée n'est pas débogable et le débogage de sa WebView est coupé ; aucune bibliothèque native (rien à aligner sur
les pages de 16 Ko) ; le jeu embarqué est le paquet web, octet pour octet, plus Capacitor et le pont.

**Autorisations** (manifeste fusionné) : `INTERNET` — posée d'office par Capacitor. Le jeu n'en a pas besoin (il ne
demande rien au-dehors), mais l'application sert le jeu à sa WebView depuis une adresse interne (`https://localhost`), et
l'agent n'a pas pu prouver, sans téléphone, qu'elle démarre sans cette autorisation : elle est gardée. On peut essayer de
l'ôter après un premier essai sur un téléphone. La seconde ligne, `org.isnadgame.isnad.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`,
est une permission interne posée par la bibliothèque AndroidX : elle ne protège que l'application elle-même et n'est
jamais demandée au joueur.

**À décider** : l'identifiant ; l'icône (les trois maillons d'or sur fond d'encre — une proposition) ; garder `INTERNET` ;
le public cible ; le texte de la fiche et la page de confidentialité (`textes-a-valider.md`) ; la clé des APK de test
(aujourd'hui celle de débogage de la machine de l'agent : une mise à jour faite ailleurs oblige à désinstaller, donc à
exporter la partie d'abord).

## 7. Refaire l'APK (pour l'agent, ou qui reprend l'outillage)

```sh
# une fois : le SDK Android, hors du dépôt (ici /root/android-sdk ; Java 21)
#   cmdline-tools dans <sdk>/cmdline-tools/latest/, puis :
#   sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0" ; sdkmanager --licenses
node v2/tools/plateformes.js android                   # l'APK de test, l'AAB, le contrôle (npm ci au besoin)
node v2/tools/plateformes/application/essai.js        # le pont, par un faux Capacitor : « PAQUET CONFORME »
node v2/tools/plateformes.js essai android             # l'essai commun des paquets, sur la page de l'application
```
