# Déposer ISNAD sur itch.io — fiche pas à pas

Le paquet : `plateformes/sortie/itch/isnad-<numéro>-itch.zip` (`node v2/tools/plateformes.js itch`). Il ne contient
qu'`index.html` : le jeu entier, ses polices embarquées, aucun appel au-dehors.

Ce qui suit vient de la documentation d'itch.io, lue le 27 novembre 2026 (`itch.io/docs/creators/html5`,
`…/access-control`, `…/faq`). Ce qui n'y est pas écrit est dit « à essayer ».

## 1. Créer la page

1. Sur itch.io : **Dashboard → Create new project**.
2. **Title** : `ISNAD` — **Kind of project** : **HTML** (« You have a ZIP or HTML file that will be played in the browser »).
3. **Pricing** : « No payments » (ou des dons, au choix du décideur : un jeu HTML ne peut pas être payant).
4. **Uploads** : dépose le zip, puis coche **« This file will be played in the browser »**.

## 2. Régler le cadre du jeu (« Embed options »)

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Embed in page / Click to launch in fullscreen | **Click to launch in fullscreen** | le jeu remplit l'écran, en hauteur comme en largeur ; aucune dimension à déclarer |
| Mobile friendly | **coché** — Orientation : **Default** (les deux) | le jeu se joue au doigt, dans les deux sens |
| Fullscreen button | **coché** | sans plein écran permis au cadre, le jeu ne peut pas le demander lui-même |
| Automatically start on page load | décoché | le premier toucher sert aussi à débloquer le son |
| Enable scrollbars | décoché | |

Si l'on préfère le jeu **dans la page** : **960 × 540** (le format 16:9 de l'image du jeu), avec le bouton plein écran.

## 3. La page de test

- **Visibility & access → Draft** : la page n'est vue que de toi et de ceux à qui tu donnes le **lien secret** (bouton
  « Secret URL » de la page). C'est le réglage par défaut : rien n'est public tant que tu ne choisis pas « Public ».
- Ou **Restricted** avec un mot de passe : la page n'est ni listée ni indexée.

## 4. Le texte de la page (proposition de l'agent, à valider)

> **ISNAD — Chroniques des Compagnons**
> *Savoir de qui l'on tient ce que l'on sait.*
>
> Un JRPG en cinq récits : les Compagnons après la mort du Prophète ﷺ. En 2084, dans la Cité-Miroir, Idris, un
> transmetteur, remonte la Chaîne des récits, maillon après maillon. Les ennemis sont des chimères — des idées, jamais
> des personnes ni des peuples.
>
> En français, en arabe (vocalisé ou non) et en anglais. Au clavier ou au doigt, en hauteur comme en largeur.
> Sans achat, sans publicité, sans compte : rien n'est collecté.
>
> **Version bêta. La relecture historique et religieuse par un spécialiste reste à faire.**
>
> Ta partie se garde dans ton navigateur. Pour la mettre à l'abri ou changer d'appareil : *Halte → Ta partie →
> Enregistrer le fichier*.

La réserve (« Version bêta… ») doit rester sur la page : c'est la décision 39. Elle vient de `v2/tools/promotion.js`.
Classement à proposer : genre *Role Playing* ; étiquettes *jrpg, pixel-art, history, story-rich* ; langues : français,
arabe, anglais. Captures : celles du jeu (`node v2/tools/smoke.js shots`).

## 5. Ce qu'il faut essayer sur la page de test

Éprouvé ici, dans un cadre d'une autre origine (`node v2/tools/plateformes.js essai itch`) : le jeu démarre, la partie se
garde et se reprend, « Enregistrer le fichier », l'import par le sélecteur, « Enregistrer l'image » du partage ; aucune
requête au-dehors. **À essayer sur la vraie page**, parce qu'itch.io ne documente pas les attributs de son cadre :

1. **La partie gardée, sur iPhone et iPad (Safari).** Le jeu y tourne dans un cadre d'un autre domaine ; des
   développeurs rapportent que Safari, ou Chrome quand il bloque les cookies tiers, y refuse le stockage. Dans ce cas
   le jeu se joue, mais **la partie est perdue quand on ferme la page**, et le jeu ne le dit pas au joueur. Le remède
   d'aujourd'hui : « Enregistrer le fichier ». *(Proposition, non faite : que le jeu prévienne le joueur quand
   l'appareil refuse de garder la partie — un changement du jeu, donc un nouveau numéro et sa batterie.)*
2. **Le plein écran** en largeur, par le bouton d'itch.io.
3. **« Partager ma progression »** sur un téléphone : si le cadre ne permet pas le partage, le jeu se replie (il copie
   le texte et montre l'image à enregistrer).
4. **« Copier le texte »** de la partie : le jeu dit « Texte copié » ; vérifier qu'il se colle bien ailleurs.

## 6. Mettre à jour

Refaire le zip (`node v2/tools/build.js`, puis `node v2/tools/plateformes.js essai itch`), le déposer à la place de
l'ancien, recocher « played in the browser ». Les parties des joueurs restent dans leur navigateur.
