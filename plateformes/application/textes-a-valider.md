# L'application (Android, iOS) — textes et choix à valider par le décideur

Tout ce qui suit est une **proposition de l'agent**. Rien n'est envoyé à un magasin. L'adresse, le sous-titre, la devise
et la réserve ne sont pas recopiés ici : ils se lisent dans `v2/tools/promotion.js` (`ADRESSE`, `SOUS_TITRE`, `DEVISE`,
`RESERVE`), le seul endroit où ils s'écrivent ; on les y prendra au moment de remplir une fiche.

## 1. Ce que l'application montre déjà

| Où | Proposition | Fichier |
|---|---|---|
| Nom sous l'icône (Android, iOS) | `ISNAD` | `android/app/src/main/res/values/strings.xml`, `ios/App/App/Info.plist` (`CFBundleDisplayName`) |
| Identifiant (Google Play, App Store) | `org.isnadgame.isnad` — **il ne se change plus après le premier envoi** | `capacitor.config.json`, `android/app/build.gradle`, `ios/App/App.xcodeproj/project.pbxproj` |
| Icône | trois maillons d'or de la Chaîne, en diagonale, sur fond d'encre (les couleurs du jeu) ; aucune lettre, aucun symbole religieux, aucun édifice, aucune personne | `icone/icone.js` (le dessin, en SVG), rendu en PNG par l'outil ; l'icône de la fiche Google Play : `plateformes/sortie/android/isnad-icone-512.png` |
| Écran de lancement | le fond d'encre et les mêmes maillons, petits, au centre | idem |

## 2. Pour la fiche Google Play (à remplir par le décideur dans la Console)

- **Nom** : `ISNAD` (et, si la Console le permet, `ISNAD — ` suivi de `SOUS_TITRE`).
- **Description courte** (80 signes au plus), proposition :
  > Un JRPG en cinq récits : remonter la Chaîne, maillon après maillon.
- **Description longue** : reprendre le texte de la page itch.io (`plateformes/itch.md`, § 4, déjà proposé), en ouvrant
  sur la réserve (`RESERVE`) tant que la décision 39 vaut.
- **Notes de version** (test interne), proposition :
  > Première version de test sur Android. La partie se garde sur le téléphone ; « Ta partie » permet d'en garder une copie.

## 3. Pour TestFlight (Beta App Review, testeurs externes)

- **What to Test**, proposition :
  > Lancer le jeu en hauteur et en largeur ; jouer le prologue ; vérifier que rien n'est caché par l'encoche ; « Ta
  > partie → Enregistrer le fichier » ; « Partager ma progression » ; fermer puis rouvrir l'application (« Continuer »).
- **Beta App Description** : la description courte ci-dessus, puis la réserve (`RESERVE`).
- **Adresse de contact** : celle que le décideur choisit (la promotion en a une : `CONTACT`).

## 4. Page de confidentialité (demandée par Google Play et par l'App Store)

À publier par le décideur, sur le site du jeu (`ADRESSE`), s'il la valide. Proposition :

> **Confidentialité — ISNAD**
>
> ISNAD ne collecte aucune donnée et n'en partage aucune. Le jeu ne demande rien à Internet : il est entièrement dans
> l'application. Ta partie reste sur ton appareil (dans l'application, et dans un fichier de l'application qui en garde
> une copie). Elle n'en sort que si tu le décides : « Ta partie » et « Partager ma progression » ouvrent la feuille de
> partage de ton téléphone, et c'est toi qui choisis où envoyer le fichier ou l'image. Il n'y a ni compte, ni publicité,
> ni mesure d'audience, ni achat dans l'application. Désinstaller l'application efface tout ce qu'elle a gardé.

## 5. Réponses proposées aux formulaires

- **Google Play — Sécurité des données** : aucune donnée collectée, aucune donnée partagée (voir `plateformes/android.md`, § 5).
- **App Store — App Privacy** : *Data Not Collected*. Le manifeste de confidentialité (`ios/App/App/PrivacyInfo.xcprivacy`)
  le dit déjà : aucun suivi, aucun domaine, aucune donnée collectée.
- **Chiffrement (App Store)** : aucun chiffrement propre (`ITSAppUsesNonExemptEncryption = NO`, posé).

## 6. Choix techniques à valider

- **L'autorisation INTERNET** (Android) : gardée, faute d'avoir prouvé sur un téléphone que l'application démarre sans elle.
- **Le plein écran** (Android) : barres du système masquées ; un glissement les fait paraître un instant par-dessus le jeu.
  Autre choix possible : laisser la barre d'état visible (le jeu se placerait dessous).
- **Le bouton Retour** (Android) : il fait ce que fait Échap (revenir d'un cran) et ne ferme jamais le jeu ; sur
  l'écran-titre, il ne fait rien (on quitte par le bouton d'accueil du téléphone). Autre choix possible : un second appui
  sur l'écran-titre qui met l'application en arrière-plan.
- **La clé des APK de test** : aujourd'hui la clé de débogage de la machine qui les fait. Un APK fait ailleurs ne remplace
  pas le précédent sans désinstallation (exporter la partie d'abord). Autre choix : une clé de test propre au projet,
  gardée par le décideur hors du dépôt.
