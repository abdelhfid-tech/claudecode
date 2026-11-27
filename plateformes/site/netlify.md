# Mettre le site en ligne sur Netlify (le choix du décideur, 27 novembre)

Le site est un dossier statique, prêt : `plateformes/sortie/isnad-site-<numéro>.zip` (refait par
`node v2/tools/plateformes.js site`, éprouvé par `… essai site` : « SITE CONFORME »). L'agent ne crée aucun compte et ne
dépose rien : c'est toi qui le mets en ligne, depuis ton Mac, sans ligne de commande. Ce qui suit vient de la documentation
de Netlify, lue le 27 novembre 2026 (adresses en bas).

## Avant de déposer

1. **Les textes** : la page de validation « Textes du site ISNAD » (privée) ; je refais le site avec tes réponses.
2. **L'APK** : tu as choisi de le garder sur la page « Tester » ; essaie-le d'abord sur ton téléphone
   (`plateformes/android.md`, § 1). S'il ne marche pas, dis-le : je refais le site sans lui (la page dit alors « Bientôt »).
3. **Le site à jour** : décompresse `isnad-site-<numéro>.zip` (double-clic) ; tu obtiens un dossier avec `index.html`,
   `_headers`, `404.html`, `jouer/`, `tester/`… C'est **ce dossier** que tu déposes (la documentation de Netlify dit, pour un
   zip : « Unzip your project zip file first »).

## La première fois

1. Crée un compte gratuit sur netlify.com (une adresse e-mail suffit ; active la double authentification dans les
   réglages du compte).
2. Ouvre https://app.netlify.com/drop dans Chrome (ou un navigateur récent), et **glisse le dossier** dans la zone.
   La documentation : « You can create a new site by dragging a project folder containing your site files (like .html
   files) to Netlify Drop. » Le site est en ligne quelques secondes plus tard, à une adresse en `…netlify.app`.
3. Dans **Project configuration → Change project name**, donne-lui un nom lisible (par exemple `isnad-jeu` →
   `isnad-jeu.netlify.app`).
4. Ouvre l'adresse sur ton téléphone : l'accueil, « Jouer maintenant », « Tester », et la page Confidentialité.

Ce que Netlify fait seul, sans réglage : il lit `_headers` (les en-têtes de sécurité : « Save a plain text file called
`_headers` to the publish directory of your site ») et montre `404.html` pour toute adresse qui n'existe pas (« If you add a
`404.html` page to your site, it will be picked up and displayed automatically for any failed paths »).

## Mettre une nouvelle version

Dans le site sur Netlify, onglet **Deploys** : glisse le nouveau dossier dans la zone du bas de la page (« drag the
project's updated output folder to the deploy dropzone at the bottom of the site's Deploys page »). La nouvelle version
remplace l'ancienne aussitôt ; l'adresse ne change pas.

## Ton domaine (plus tard, quand tu le veux)

Le jeu écrit `www.isnad-game.org` dans le texte de partage (`v2/tools/promotion.js`). Si tu as ce domaine :
1. Sur Netlify : **Domain management → Add a domain → Add a domain you already own**, tape `www.isnad-game.org`, choisis
   « External DNS Provider ».
2. Chez ton registraire (là où tu as acheté le domaine) :
   - `www` : un enregistrement **CNAME** vers `<nom-du-site>.netlify.app` ;
   - le domaine nu (`isnad-game.org`) : un **ALIAS / ANAME** vers `apex-loadbalancer.netlify.com` si le registraire le
     permet, sinon un enregistrement **A** vers `75.2.60.5`.
   Netlify conseille d'employer `www` comme adresse principale. La documentation prévient : « It may take a full day for
   the settings to propagate. »
3. Le certificat HTTPS : la formule gratuite comprend les domaines personnels « with SSL support ». Vérifie dans
   **Domain management → HTTPS** que le certificat est posé avant d'annoncer l'adresse.

## Ce que coûte la formule gratuite

« Free » : 300 crédits par mois, plafond strict, jamais facturé (« You'll never be charged for the Free plan »). Une mise
en ligne coûte 15 crédits, 1 Go de trafic 20 crédits, 10 000 requêtes 2 crédits. Le site pèse 15 Mo, dont le jeu (5,8 Mo)
et l'APK (7,1 Mo) : à grands traits, 300 crédits font une quinzaine de Go, soit de l'ordre de 2 000 parties lancées par mois,
moins les mises en ligne. Ce qui se passe une fois le plafond atteint n'est pas écrit dans la documentation lue : à
surveiller dans **Usage & billing** si le site attire du monde.

## Les réglages qui restent à toi (`plateformes/site/site.json`)

- `indexable` : `false` aujourd'hui (le site demande aux moteurs de ne pas l'indexer). Pour qu'on le trouve sur Google :
  le passer à `true`, et je refais le site.
- `hsts` : `max-age=31536000`, sans `includeSubDomains` ni `preload` (à ne décider que pour tout ton domaine).
- `testflight`, `itch` : les liens, quand ils existent.

## Sources (lues le 27 novembre 2026)

- https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/
- https://docs.netlify.com/deploy/create-deploys/
- https://docs.netlify.com/manage/routing/headers/
- https://docs.netlify.com/manage/routing/redirects/redirect-options/
- https://docs.netlify.com/manage/domains/manage-domains/assign-a-domain-to-your-site-app/
- https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
