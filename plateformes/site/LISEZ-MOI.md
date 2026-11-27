# plateformes/site/ — le site qui présente le jeu et fait essayer les versions de test

Un dossier statique, **préparé ici, hébergé par le décideur** : l'agent ne le met en ligne nulle part et ne touche pas au
site existant. Le jeu n'est pas modifié : `jouer/` est le paquet web (`v2/tools/plateformes/web.js`), auquel on ajoute
seulement, dans `<head>`, ce qui le rend installable.

```sh
node v2/tools/plateformes.js site          # plateformes/sortie/site/ et plateformes/sortie/isnad-site-<numéro>.zip
node v2/tools/plateformes.js essai site    # le fait, puis l'éprouve : « SITE CONFORME » (captures : v2/.smoke/plateformes/site/)
SITE_CAPTURES=1 node v2/tools/plateformes.js site   # reprend les captures du jeu même si son numéro n'a pas changé
```

## Les sources (versionnées)

| Fichier | Rôle |
|---|---|
| `site.json` | ce qui se règle sans code : le lien TestFlight (vide : « bientôt »), la page itch.io (vide : rien), `indexable` (false : noindex partout), l'en-tête HSTS, les langues |
| `gabarit.html` | l'en-tête, la navigation, le pied, communs à toutes les pages |
| `site.css` | la feuille du site, écrite à la main (les couleurs du jeu, ses polices servies par le site) |
| `fr/textes.json` | les mots de l'en-tête et du pied, en français |
| `fr/accueil.html`, `fr/tester.html`, `fr/confidentialite.html`, `fr/404.html` | le corps de chaque page ; la première ligne, `<!--meta {…} -->`, dit son titre, sa description et où elle s'écrit |
| `jouer/sw.js`, `jouer/enregistrer.js`, `jouer/manifest.webmanifest` | le service worker versionné (il ne garde que le jeu), le script qui l'enregistre, le manifeste |
| `textes-a-valider.md` | chaque phrase publique, d'où elle vient, ce qui demande d'abord le regard du décideur |

Les gabarits disent `{{P.RESERVE}}`, `{{P.DEVISE}}`, `{{P.CONTACT}}`… : l'adresse, la devise, l'état, la réserve, le
contact et le soutien sont lus dans `v2/tools/promotion.js`, jamais recopiés. Les cinq récits (`{{SAGAS}}`) sont lus
dans le jeu. Les images (`{{IMG:nom:tel|large}}`, `{{GALERIE:…}}`) sont des captures du jeu.

**Ajouter l'arabe ou l'anglais** : une ligne dans `site.json` (`"dossier": "ar"`, `"dir": "rtl"`), puis un dossier
`ar/` (ou `en/`) avec `textes.json` et les quatre pages, écrits à la source dans la langue (exigence 25), jamais
traduits du français. Les pages s'écrivent alors sous `ar/…` ; `{{racine}}` mène à la racine du site (feuille, images,
`jouer/`), `{{base}}` à celle de la langue. La feuille emploie déjà des propriétés logiques (elle se lit de droite à
gauche sans retouche) ; le sélecteur de langue reste à ajouter à `gabarit.html` ce jour-là.

## Ce que l'outil écrit (non versionné : `plateformes/sortie/`)

```
site/
  index.html  tester/index.html  confidentialite/index.html  404.html
  site.css  polices/ (Alegreya, Cinzel, Reem Kufi, Amiri, réduites, et leurs licences)
  img/ (les captures employées, le logo de l'Institut octet pour octet, les icônes)
  jouer/ index.html (le paquet web + 11 lignes dans <head>), manifest.webmanifest, sw.js, enregistrer.js, icônes
  telechargements/isnad-<numéro>-test.apk   (copié de plateformes/sortie/android/ s'il y est ; sinon la page dit « bientôt »)
  _headers  robots.txt
isnad-site-<numéro>.zip        (le même dossier)
.site-captures/                (les captures et les icônes, refaites quand le numéro du jeu change)
```

## Avant de le mettre en ligne

Le décideur a choisi Netlify (D241) : les gestes, du premier dépôt au domaine, sont dans `netlify.md`.

1. **Installer l'APK de test sur ton propre téléphone** (`plateformes/sortie/android/isnad-<numéro>-test.apk`), et y jouer
   quelques minutes : l'agent n'a pu le lancer ni sur un téléphone ni sur un émulateur. La page « Tester » le propose au
   public : elle ne doit le faire qu'une fois cet essai fait. Sinon, retire-le de `plateformes/sortie/android/` avant de
   refaire le site : la page dit alors « Bientôt ».
2. Relire `textes-a-valider.md`, et la page « Confidentialité », qui engage le projet (l'adresse de contact y est publiée).
3. Renseigner `site.json` (le lien TestFlight, la page itch.io) quand ils existent.

## La sécurité

`_headers` (Cloudflare Pages, Netlify) : HSTS (`max-age=31536000`, sans `includeSubDomains` ni `preload` : au décideur
d'en décider pour tout son domaine) ; une politique de contenu où tout est `'self'` — rien ne part au-dehors — et qui
laisse tourner le jeu : son unique script en ligne par son empreinte SHA-256 (recalculée à chaque assemblage ; aucun
`'unsafe-inline'` pour les scripts), ses styles en ligne, ses polices et images en `data:`, ses images en `blob:` (pour
« Partager ») ; `frame-ancestors 'none'`. Les pages du site y ajoutent la leur, plus stricte, dans une balise : ni script,
ni style en ligne. `Referrer-Policy: no-referrer`, `Permissions-Policy` sans caméra, micro, position, paiement, USB ni
« topics », `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`,
`X-Robots-Tag: noindex` tant que `indexable` est faux. L'APK : `application/vnd.android.package-archive`, en pièce jointe.
Aucune en-tête n'est donnée par deux règles qui se recouvrent (les hébergeurs les joindraient) ; l'essai le vérifie.

Hébergé ailleurs (un serveur sans `_headers`), le site marche, mais sans ces en-têtes : il faut les reporter dans la
configuration du serveur. La page 404 emploie des liens absolus (`/…`) : le site doit être servi à la racine de son domaine.

## L'essai

Voir l'en-tête de `v2/tools/plateformes/site/essai.js` : le dossier servi par un petit serveur local qui applique
`_headers` ; chaque page en 390 × 844 et 1280 × 800 (aucune erreur, aucune violation de la politique, aucune requête
au-dehors, rien en largeur, images et polices, aucun mot coupé, aucun texte sous 12 points) ; les liens internes ; la
réserve et le soutien sur l'accueil ; le jeu de `jouer/` sous la politique (« Nouvelle partie », « Commencer », des
répliques) ; le service worker, son cache, puis le jeu rechargé hors ligne ; le zip.

`plateformes.js essai <cible>` appelle d'ordinaire l'essai d'un paquet de jeu (`essai.js`), qui ne s'applique pas à un
site : la cible `site` lance donc elle-même le sien quand la commande est `essai site` (dans `site.js`, à la fin de
`faire`), sans toucher au répartiteur.
