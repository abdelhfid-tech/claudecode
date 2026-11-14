# Tests et retours — étape 6

État à la livraison de la première version. Le critère de sortie de l'étape 6 (« les cycles humains
prévus par le profil sont faits ») **n'est pas atteint** : aucun humain n'a encore joué.

## Ce qui a été testé

| Test | Outil | Résultat |
|---|---|---|
| Schéma des données | `node tools/validate.js` | Les cinq sagas et l'histoire-cadre passent : chaque carte, lieu, opération, effet, héros, ennemi et entrée de codex référencé existe ; chaque `choice` a une seule bonne option et une explication par option fausse. |
| Syntaxe de l'assemblage | `node tools/build.js` puis analyse du script | Le fichier assemblé se charge. |
| Partie complète | `node tools/smoke.js auto` | Prologue, cinq sagas et épilogue joués de bout en bout dans Chromium : 46 combats, 27 choix, **zéro erreur console**. |
| Accessibilité des objectifs | même test | Avant chaque objectif, un parcours en largeur sur la grille vérifie que la cible est atteignable à pied depuis la position du joueur. Aucun objectif inaccessible, aucun PNJ ou ennemi absent de sa carte. |
| Interface au clavier | visite scriptée | Titre, dialogues, menu de pause, combat (commandes, cible, Niyya), écran de la Chaîne, choix, carton de citation ; rechargement de la page puis « Continuer ». |
| Rendu | `node tools/smoke.js shots` | Captures bureau (1280 × 720) et mobile en portrait (390 × 780) relues par l'agent : titre, Cité-Miroir, Médine de jour et de nuit, désert, camp, combat, Chaîne. |

Le test automatique fait avancer seuls les dialogues et les choix (il prend toujours la bonne option),
mène les combats avec une IA et saute d'objectif en objectif après avoir vérifié le chemin.

## Ce qui n'a pas été testé

- **Aucun test humain.** Ni le plaisir de jeu, ni la clarté des règles, ni le rythme, ni la longueur
  réelle d'une saga n'ont été vérifiés.
- **Équilibrage réglé contre une IA de test.** Elle connaît les règles, vise les failles connues et ne
  se trompe pas de menu. La difficulté pour un nouveau joueur est inconnue.
- **Relecture historique et religieuse par un spécialiste : non faite.** Dates, sources, attributions,
  traductions du sens et formulations sont à vérifier. Voir `decisions.md`, points H1 à H10.
- **Mauvaises réponses aux choix.** Les branches d'explication sont validées par le schéma mais n'ont
  pas été parcourues par le test.
- **Marche réelle.** Le test vérifie qu'un chemin existe ; il ne marche pas. Les collisions en
  déplacement libre n'ont été essayées que sur de courts trajets.
- **Navigateurs.** Chromium seulement. Safari, iOS, Firefox et Android non testés.
- **Appareils.** Aucun vrai téléphone, aucune mesure de performance, tactile non essayé à la main.
- **Sans polices web** et **sans stockage local** : chemins prévus par le code, non vérifiés.
- **Accessibilité.** Contrastes non mesurés, aucun essai avec un lecteur d'écran.
- **Son.** Jamais écouté par un humain.

## Réserves relevées pendant la construction

À revérifier sur la version livrée : certaines ont pu être corrigées depuis.

- Reprendre au milieu d'un objectif rejoue cet objectif depuis son début, combat compris.
- En combat à trois ennemis, les plaques de nom peuvent se chevaucher.
- L'écran de la Chaîne dépasse la hauteur d'une fenêtre de 720 px et défile.
- Les Compagnons, tête et coiffe claires, se lisent parfois comme une tache blanche en combat.

## Retours à collecter

**Cercle 1, le décideur.**
1. Le cadre (Idris, l'Agrégor, la Chaîne) sert-il le propos ou le parasite-t-il ?
2. Les décisions D1 à D16 sont-elles validées ?
3. Le ton est-il juste ? Citer toute réplique qui sonne faux.

**Cercle 2, un relecteur compétent.**
4. Toute erreur de fait, de date, de source ou d'attribution, saga par saga.
5. Toute formulation ou mise en scène à corriger par respect.
6. Les récits à la chaîne discutée doivent-ils être gardés, reformulés ou retirés ?

**Cercle 3, une dizaine de joueurs.**
7. Comprend-on les voiles, les failles et la Niyya sans lire l'aide ?
8. Où s'ennuie-t-on, où bloque-t-on, quel combat est trop long ?
9. Durée réelle de chaque saga ; abandon éventuel et à quel endroit.
10. Les choix de fidélité apprennent-ils quelque chose, ou devine-t-on au hasard ?
11. Lisibilité et confort sur téléphone, en portrait et en paysage.
12. Le son : présence, fatigue, envie de le couper.

Les retours se consignent dans ce fichier, datés, puis redescendent en tâches courtes.
