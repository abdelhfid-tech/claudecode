# Les plateformes — ce qui attend le décideur

Tout ce qui est prêt se refait par `node v2/tools/plateformes.js <cible>` (sorties dans `plateformes/sortie/`, non
versionnées). L'agent n'a rien déposé, rien mis en ligne, créé aucun compte. Chaque fiche (`itch.md`, `android.md`,
`ios.md`, `newgrounds.md`, `crazygames.md`, `poki.md`, `site/LISEZ-MOI.md`) dit le pas à pas ; ici, seulement ce que toi
seul peux trancher, par ordre de priorité.

## 1. Avant tout dépôt

- **Essayer l'APK sur ton téléphone.** Il n'a été lancé ni sur un téléphone ni sur un émulateur (la machine de l'agent
  n'en fait pas tourner). Le site le propose au public : on ne le met en ligne qu'après cet essai.
- **Les textes proposés** : la fiche itch.io (`itch-page.txt`), le site (`site/textes-a-valider.md`), l'application
  (`application/textes-a-valider.md`), Newgrounds et CrazyGames (`*-textes-a-valider.md`). La réserve, la devise et
  l'adresse viennent toujours de `v2/tools/promotion.js`.
- **À unifier une fois pour tous les supports** : « cinq récits » ou « cinq sagas » (l'écran-titre dit « sagas ») ;
  « JRPG » ou « jeu de rôle » ; tu ou vous ; un seul âge public (« dès dix ans » sur le site, PEGI 12 évoqué ailleurs) ;
  « la fin du califat bien guidé » (repris du livret), à relire au regard de l'exigence 5.
- **Le soutien de l'Institut sur le site** : `promotion.js` le réserve aux shorts et au livret ; le mettre sur le site
  est une extension, à décider.
- **L'adresse de contact** est publiée en clair sur chaque page du site : une adresse dédiée vaudrait mieux.

## 2. Android

- L'identifiant `org.isnadgame.isnad` (il ne change plus après le premier envoi) et l'icône (trois maillons d'or sur
  fond d'encre ; la contre-lecture note qu'elle rappelle le symbole du « lien » et qu'elle est inventée, non tirée du
  jeu : elle sert aussi au site).
- **La sauvegarde automatique est coupée** (la partie ne quitte jamais le téléphone, comme le disent la page
  « Confidentialité » et la fiche « Sécurité des données ») : la garder coupée, ou la rouvrir et réécrire ces deux textes.
- Garder l'autorisation `INTERNET` (posée par Capacitor), ou l'ôter après ton essai.
- Le public cible (moins de 13 ans = programme « Familles » de Google).
- Ta clé d'envoi et la signature de l'AAB, ton compte Play : `android.md`, § 3 et 4.
- Le plein écran (barres masquées) et le bouton Retour sur l'écran-titre (il ne fait rien).

## 3. iPhone

- Sur ton Mac (ton choix, 27 novembre) : `ios.md` dit les gestes — Xcode 26 ou plus récent, ▶ sur l'iPhone branché (Mode
  développeur), puis Archive → TestFlight & App Store. Le projet n'a jamais été compilé (pas de Mac ici) : le premier essai
  est le tien, et je corrige ce qui coince d'après ce que Xcode affiche.

## 4. Newgrounds, CrazyGames

- **Newgrounds** : ses règles n'ont pas pu être lues (le site refuse les lectures automatiques) ; juger s'il convient à
  un sujet religieux.
- **CrazyGames** : le « Basic Launch » est sans publicité ; le « Full Launch » impose son SDK et ses annonces, sans filtre
  documenté contre les jeux d'argent (règle anti-pari) — non sans un engagement écrit du portail. Les couvertures
  (1920 × 1080, 800 × 1200, 800 × 800) et la vidéo d'aperçu sont à produire : comment ? Le départ (titre, personnage,
  scène parlée) passe-t-il leur règle « un clic au plus » ?

## 5. Poki

- `poki.md`, § 4 : le filtre des catégories d'annonces (à demander par écrit), l'exclusivité (elle exclurait itch.io,
  Newgrounds, CrazyGames et le site), un départ plus court, la langue, la réserve sur leur page, les deux moments de
  publicité.

## 6. Le site

- L'hébergement (prévu pour Cloudflare Pages ou Netlify, servi à la racine d'un domaine) et le domaine ;
  `includeSubDomains` et `preload` pour HSTS ; l'indexation (coupée aujourd'hui).
- Le lien TestFlight et la page itch.io, à renseigner dans `site/site.json` quand ils existent.
- L'arabe et l'anglais du site, à écrire à la source dans chaque langue (la structure est prête).

## 7. Relevé sur le jeu lui-même (pour une prochaine version, rien n'est changé ici)

- **Combat, sur un téléphone en hauteur** : le nom « ‘Abd ar-Rahmân » passe sous la jauge de sa rangée (390 × 844). Un
  défaut de mise en page, à corriger dans le jeu.
- **Exigence 8** : le médaillon de sa rangée écrit son nom en arabe, « عبد الرحمن » ; le Nom « الرحمن » est donc sur un
  élément dessiné (qu'on ne frappe pas). Admissible ? La vitrine du site ne le montre pas tant que ce n'est pas tranché.
- **La Traversée** (saga de Khâlid, premier chapitre) : Râfi' ibn 'Umayra, le guide qu'il faut consulter, se tient
  derrière une tente qui le cache jusqu'à la tête. À déplacer d'une ou deux cases.
- **Le tout premier toucher après le chargement** (relevé par l'essai de Poki, 2.48) : un bouton du jeu ignore un toucher
  dans les 600 premières millisecondes de la page (`tapable`, `v2/src/core/ui.js` : son compteur anti-double part de 0, et
  l'horloge de la page aussi). Avec les polices embarquées, l'écran-titre paraît avant : un toucher très rapide sur
  « Continuer » ou « Nouvelle partie » ne fait rien, le second marche. Une ligne à corriger (l'agent le fait à la prochaine
  version, avec sa batterie) ; rien à décider.
- **Proposition** : que le jeu, ou le pont de l'application, prévienne le joueur quand l'appareil refuse de garder sa
  partie (cadre d'itch.io sous Safari) ou quand l'application n'a pas pu écrire son fichier : aujourd'hui, rien n'est dit.
  Un texte nouveau, donc à valider et à écrire dans chaque langue.
