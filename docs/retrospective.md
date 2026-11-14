# Rétrospective — étape 10

Écrite par l'agent à la fin de la session de construction. Le critère de sortie du framework demande
qu'elle soit relue par quelqu'un d'autre : à faire par le décideur.

## Ce qui a marché

- **Le contrat de données d'abord.** `defs.js`, `schema-saga.md` et `validate.js` ont été écrits avant
  le moteur. Cinq agents ont pu écrire cinq sagas en parallèle sans se gêner, et les cinq fichiers se
  sont intégrés sans retouche de schéma.
- **Une bible narrative dans la spécification.** Les exigences de respect étaient des règles du
  contrat, pas des consignes orales : elles ont tenu sur cinq auteurs.
- **Des statistiques calculées par le moteur.** Les sagas ne fixent que niveau et palier ;
  l'équilibrage se règle en un seul endroit.
- **Un test qui joue la partie entière.** Le mode automatique a prouvé que les dix-sept
  chapitres s'enchaînent, que chaque objectif est atteignable et qu'aucun script ne plante.
  Il sert aussi de simulateur d'équilibrage.
- **Art et son procéduraux.** Zéro asset, zéro coût, un fichier d'environ 500 Ko, compatible avec la
  porte de publication dès le premier essai.
- **Interface en HTML au-dessus du canevas.** Texte net, menus cliquables et touchables sans effort,
  adaptation au portrait par quelques règles de style.

## Ce qui n'a pas marché, ou pas assez

- **La règle des tiers n'est pas tenue.** La conception a pris moins d'un tiers du temps, pas deux.
  Pas de maquette d'écran validée avant le code : l'interface a été dessinée en la codant.
- **Réflexion et exécution dans la même session** (écart à l'invariant 1). Le contexte a tenu parce
  que la spécification était en fichiers, mais la séparation n'a pas été respectée.
- **L'humain n'a rien décidé en cours de route.** Seize décisions ont été prises par l'agent et
  attendent une validation a posteriori (`decisions.md`). C'est l'inverse de ce que demande
  l'invariant 4, et c'est le prix de l'absence du décideur.
- **Aucun test humain, aucune relecture spécialisée.** Les deux rôles qui ne se délèguent pas n'ont pas
  été tenus. Le produit est jouable, il n'est pas validé.
- **Les sagas n'ont été relues qu'en partie** par l'agent principal après leur écriture.
- **Équilibrage par simulation seulement**, contre une IA qui ne se trompe jamais.

## Pièges rencontrés

| Piège | Symptôme | Parade |
|---|---|---|
| `hidden` écrasé par `display: flex` | Tous les écrans (titre, Chaîne, menu) affichés ensemble dans la page autonome, alors que l'Artifact fournit sa propre règle | `[hidden] { display: none !important; }` dans la feuille de style du jeu |
| Courbe d'expérience trop généreuse | Groupe au niveau 11 en fin de saga, boss de niveau 8 ou 9 balayés | Coût de niveau relevé, vérifié en rejouant la partie automatique |
| Halo et éclairage trop forts | Image délavée de jour, voile gris de nuit | Intensité du halo réglée par ambiance, bandes de flou réduites |
| Test qui téléporte sur un PNJ d'une autre carte | Position indéfinie, écran noir | Le test passe par la résolution de lieux du moteur ; le moteur n'était pas en cause |
| Objectif `goto` et marche en ligne droite | Le test longe la rue sans croiser le marqueur | Le marqueur au sol et la flèche guident un joueur ; le test saute à la cible |
| Reprise au milieu d'un objectif | Le dialogue et le combat de l'objectif se rejouent | Accepté pour la V1, noté dans `retours.md` |
| Sagas à quatre héros | Le gabarit prévoyait trois héros par saga | Le moteur limite le groupe actif à trois et aligne le niveau d'un héros qui rejoint |

## Prompts et pratiques réutilisables

1. **Le brief d'agent de contenu.** « Écris uniquement le fichier X en suivant strictement le schéma Y.
   Ne touche à rien d'autre. Boucle le validateur jusqu'à ✓. Voici la thèse, le groupe, les idoles et
   le plan en trois chapitres. Rends cinq lignes : résultat du validateur, volume, points d'attention
   pour l'intégration. » Les points d'attention rendus ont tous servi.
2. **Schéma partagé navigateur et validateur.** Un seul fichier d'énumérations, chargé des deux côtés.
3. **Mode automatique dans le produit.** Un drapeau de débogage qui fait avancer dialogues, choix et
   combats, plus un facteur de vitesse : le test de bout en bout coûte quelques lignes.
4. **Vérifier un chemin plutôt que marcher.** Un parcours en largeur sur la grille de collision avant
   chaque saut d'objectif détecte les lieux murés sans simuler les déplacements.
5. **Le prompt 20 du framework** (document de game design) a servi de plan pour `game-design-document.md`.

Compétences à extraire pour un prochain projet : « contrat de données + validateur + test
automatique » et « bible de respect pour un sujet sensible ».

## Profil réel contre profil initial

Pas d'écart sur les dimensions : le produit est resté autonome, sans compte ni service. Le seul module
activé, M7 en bonnes pratiques, est tenu en partie (clavier, focus, taille de texte) ; contrastes et
lecteurs d'écran restent à faire. Le risque dominant est resté hors des modules : la justesse du contenu.

## Ce qui serait fait autrement

- Faire valider par le décideur, avant de coder, une page de décisions (D1 à D8) et un écran de référence.
- Réserver la dernière demi-heure à un humain qui joue, plutôt qu'à des finitions.
- Faire relire chaque saga par un second agent chargé uniquement de vérifier sources et citations.

## Suite proposée

1. Validation de `decisions.md` par le décideur.
2. Relecture historique, puis corrections de texte, sans toucher au moteur.
3. Premier cercle de joueurs et réglage de la difficulté d'après `retours.md`.
4. Étape 7 (valeur) et étape 8 (porte de publication) seulement après ces trois points.
