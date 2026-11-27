# ISNAD sur iPhone et iPad — fiche pas à pas (TestFlight)

Le projet est fait par `node v2/tools/plateformes.js ios` : `plateformes/sortie/ios/isnad-<numéro>-ios.zip`, le projet
Xcode prêt à ouvrir (le jeu déjà posé dedans, les trois greffons à leur place), et `controle.txt`.

> **Le projet n'a pas été compilé** : il faut un Mac et Xcode, que la machine de l'agent n'a pas. Ce qui a marché sous
> Linux : `npx cap add ios` puis `npx cap sync ios` (Capacitor 8.6.3) ont écrit le projet Xcode et son `Package.swift`
> (Swift Package Manager, sans CocoaPods) — rien n'a été compilé ni lancé. Le pont (enregistrer un fichier, partager,
> la partie à l'abri) n'a été éprouvé qu'avec un faux Capacitor dans un navigateur, y compris la remise d'une partie
> quand iOS a vidé le stockage de la page. Le premier essai sur un iPhone est le tien.

## 1. Ce qu'il faut

- Un **Mac** avec **Xcode 26 ou plus récent**, ouvert une première fois (il installe ses composants). L'App Store du Mac
  propose aujourd'hui Xcode 27, qui demande macOS Tahoe 26.6 ou plus récent ; sur un Mac resté sous macOS Sequoia 15.6,
  Xcode 26.0 à 26.3 conviennent (developer.apple.com/download). Capacitor 8 demande Xcode 26.0 au moins, et Apple refuse
  depuis le 28 avril 2026 une app construite avec un Xcode plus ancien.
- Un compte **Apple Developer Program** (payant, annuel), à ton nom ou à celui d'une structure. Dans Xcode :
  *Xcode → Settings → Accounts → +* et connecte ce compte.
- L'**identifiant** `org.isnadgame.isnad` est une **proposition** : valide-le avant le premier envoi (il ne se change plus).

## 2. Récupérer le projet

**Le plus simple** : copie `isnad-2.48-ios.zip` sur le Mac et décompresse-le (double-clic). Tu obtiens un dossier
`isnad-ios/`.

**Ou depuis le dépôt** (pour le refaire toi-même, Node 22 installé) :

```sh
git clone <adresse du dépôt> isnad && cd isnad
cd plateformes/application && npm ci && cd ../..
node v2/tools/build.js                       # le jeu assemblé
node v2/tools/plateformes.js ios             # refait le projet et le zip (demande aussi Playwright : npx playwright install chromium)
```

## 3. Ouvrir, essayer, signer

1. Ouvre `isnad-ios/ios/App/App.xcodeproj` (double-clic).
2. Xcode télécharge seul les paquets Swift qui manquent (*Resolving Package Graph…*, une minute ou deux, il faut Internet).
3. Dans la colonne de gauche, clique **App** (en haut), puis la cible **App** → onglet **Signing & Capabilities** :
   - coche **Automatically manage signing** ;
   - **Team** : choisis ton équipe ;
   - **Bundle Identifier** : `org.isnadgame.isnad` (Xcode l'enregistre chez Apple).
4. Onglet **General** : *Version* 2.48, *Build* 248 (posés par l'outil). *Display Name* : ISNAD.
5. **Essayer d'abord** : en haut, choisis un simulateur (« iPhone 17 ») ou ton iPhone branché, puis **▶ (Product → Run)**.
   **Ton iPhone, la première fois** : branche-le au Mac par un câble et touche **Faire confiance** sur l'iPhone. Une fois
   qu'il paraît dans Xcode, active sur l'iPhone **Réglages → Confidentialité et sécurité → Mode développeur** (l'option
   n'apparaît qu'après ce premier branchement), laisse-le redémarrer et confirme. Si l'iPhone refuse d'ouvrir l'app
   (« Développeur non approuvé ») : **Réglages → Général → VPN et gestion de l'appareil**, ton compte, **Faire confiance**.
   À vérifier : le jeu s'ouvre ; en hauteur et en largeur, l'encoche et la barre du bas ne cachent ni texte ni bouton ;
   le son ; **la halte → Exporter la partie → Enregistrer le fichier** ouvre la feuille de partage (on peut choisir *Enregistrer dans Fichiers*) ;
   **Partager ma progression → Partager**, avec l'image ; fermer l'application puis la rouvrir : « Continuer ».

## 4. Archiver et envoyer à TestFlight

1. **App Store Connect** (appstoreconnect.apple.com) → **Apps → + → Nouvelle app** : plateforme iOS, nom `ISNAD`, langue
   principale français, l'identifiant `org.isnadgame.isnad`, un *SKU* à ton choix (par exemple `isnad`).
2. Dans Xcode, en haut, la destination : **Any iOS Device (arm64)**.
3. **Product → Archive**. À la fin, l'Organizer s'ouvre.
4. **Distribute App** → **TestFlight & App Store** (ou **TestFlight Internal Only**, si la version ne doit aller qu'aux
   membres de ton équipe) → **Distribute**. Xcode signe pour la distribution avec ton équipe, puis envoie. Si l'app n'existe
   pas encore dans App Store Connect (étape 1), l'Organizer propose de la créer.
5. Après quelques minutes de traitement, la version paraît dans App Store Connect → ton app → **TestFlight**. La question
   du chiffrement ne se pose pas : le projet déclare `ITSAppUsesNonExemptEncryption = NO` (aucun chiffrement propre).
6. Chaque envoi demande un **numéro de build** plus grand : l'outil le tire du numéro du jeu (2.48 → 248). Pour renvoyer
   la même version du jeu, mets à la main un *Build* plus grand dans Xcode (par exemple 247.1).

## 5. Inviter des testeurs

- **Testeurs internes** (les membres de ton équipe App Store Connect, jusqu'à cent) : *TestFlight → Internal Testing → +*,
  crée un groupe, ajoute-les, coche la version. Pas d'examen d'Apple.
- **Testeurs externes** (par adresse électronique) : *External Testing → +*, un groupe, les adresses ; la première version
  passe un examen d'Apple (« Beta App Review »), qui demande une description du test et une adresse de contact
  (propositions dans `plateformes/application/textes-a-valider.md`). Ne crée pas de **lien public** tant que tu ne veux
  pas que n'importe qui puisse l'installer.
- Chaque testeur installe l'application **TestFlight** depuis l'App Store, puis accepte l'invitation reçue.

## 6. Ce que l'agent a réglé, et ce qui reste à décider

**Réglé (contrôlé dans `controle.txt`)** : nom affiché ISNAD ; les deux orientations (l'iPad, les quatre) ; plein écran
(barre d'état cachée ; le jeu tient compte de l'encoche par `viewport-fit=cover` et `env(safe-area-inset-*)`) ;
`ITSAppUsesNonExemptEncryption = NO` ; `arm64` ; le **manifeste de confidentialité** (`ios/App/App/PrivacyInfo.xcprivacy`) :
aucun suivi, aucun domaine, aucune donnée collectée, et une seule raison d'API déclarée (C617.1 : l'application lit et
écrit ses propres fichiers, dans son dossier) ; l'icône (1024 × 1024, sans transparence) et l'écran de lancement ; iOS 15
au minimum (celui de Capacitor 8).

**Dans App Store Connect, plus tard** (pour le magasin, pas pour TestFlight interne) : *App Privacy* → **Data Not
Collected** ; une adresse de page de confidentialité ; la classification par âge ; les captures d'écran.

**À décider** : l'identifiant ; l'icône (proposition) ; les textes (`textes-a-valider.md`) ; le public visé.
