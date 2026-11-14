# Profil du projet — étape 0

Établi au lancement, à relire à chaque changement de périmètre (étape 9 du framework).

## L'idée

Un JRPG rétro-HD jouable en ligne, qui commence à la mort du Prophète ﷺ et fait suivre au joueur les
Compagnons, un par saga. Ambiances orientale, romaine et cyberpunk. Les notions de noosphère et
d'égrégore servent à parler des valeurs et des idoles.

## Dimensions d'activation

| Dimension | Niveau | Justification |
|---|---|---|
| D1 Distribution | **2** | Page web jouable par lien. L'Artifact est privé par défaut, mais il est fait pour être partagé : en cas de doute, le framework demande de prendre le niveau le plus élevé. |
| D2 Utilisateurs et données | **1** | Aucun compte, aucune donnée personnelle, aucune requête réseau. La progression reste dans le `localStorage` du navigateur. |
| D3 Nature des décisions | **1** | Le produit divertit et informe. Il ne décide rien sur personne. |
| D4 Criticité et latence | **1** | Tolérant. Une image perdue ne change rien. |
| D5 Intégration | **1** | Autonome. Seule ressource externe : des polices Google Fonts, avec repli système. |

## Déclarations

| Élément | Réponse | Effet |
|---|---|---|
| Langues | Une : le français. L'arabe n'apparaît que dans les sceaux (noms propres dessinés sur canevas) et le titre. | M8 non activé. Si une version arabe est demandée, M8 s'active avec intensité relevée (alphabet non latin, sens de droite à gauche). |
| Interface exposée | Non | M9 non activé |

## Contexte

| Élément | Valeur | Conséquence |
|---|---|---|
| Commanditaire | Le décideur lui-même | Formalisme léger : des artefacts courts, pas de cahier des charges contractuel |
| Équipe | Un décideur, seul avec des agents | Tous les rôles humains reposent sur une personne |
| Budget temps | Trois heures, décideur absent | Périmètre de V1 serré ; décisions prises par l'agent et consignées dans `decisions.md` pour validation |
| Budget financier | Aucun service payant | Art et son générés par le code ; aucun appel à un générateur d'images ou de voix |
| Existant | Dépôt vide | Pas d'audit préalable |
| Contraintes imposées | Hébergement en Artifact : un fichier, pas d'asset externe, pas de requête réseau | Reportées dans `architecture.md` |

## Modules

Application de la table 5.3 du framework.

| Module | Règle | Résultat |
|---|---|---|
| M1 Conformité | léger si D2 = 2 ; complet si D2 = 3 ou D3 ≥ 2 | Non activé. Aucune donnée personnelle n'est collectée. |
| M2 Modèles et équité | D3 ≥ 2 | Non activé |
| M3 Gouvernance runtime | D3 = 3 | Non activé |
| M4 Intégration, latence | D4 ≥ 2 ou D5 = 3 | Non activé |
| M5 Surveillance | D3 ≥ 2 ou D4 = 3 | Non activé |
| M6 Sécurité applicative | D2 ≥ 2 ou D5 ≥ 2 | Non activé. Pas de secret, pas de serveur, aucune saisie de l'utilisateur ; les textes de dialogue sont échappés. |
| M7 Accessibilité | bonnes pratiques si D1 = 2 | **Activé, bonnes pratiques** |
| M8 Internationalisation | plus d'une langue | Non activé |
| M9 Écosystème et API | interface exposée | Non activé |

**M7, état réel.** Fait : navigation complète au clavier, état de focus visible, tout est aussi
cliquable ou touchable, taille de base de l'interface d'au moins 13 px, libellés `aria-label` sur les boutons de la
manette et le canevas, `prefers-reduced-motion` respecté pour les animations d'interface. Non fait :
le contenu du canevas n'est pas décrit aux lecteurs d'écran, les contrastes n'ont pas été mesurés,
aucun audit.

**Ce que les modules ne couvrent pas.** Le risque principal du projet n'est pas réglementaire : c'est
la sensibilité religieuse et l'exactitude historique. Aucune dimension ne l'active. Il est traité
comme une exigence fonctionnelle de la spécification (bible narrative de `schema-saga.md`), comme le
premier risque de `risques.md`, et il appelle un validateur humain.

## Rôles

| Rôle | Tenu par | État |
|---|---|---|
| Assistant de réflexion | Agent | Tenu. Spécification écrite en fichiers avant l'exécution. |
| Outil de design | Agent (art procédural) | Tenu. Pas de maquette préalable : écart assumé, voir `retrospective.md`. |
| Agent codeur | Agent principal, plus cinq agents de contenu en parallèle | Tenu |
| Décideur | Le commanditaire | Absent pendant la construction ; valide `decisions.md` à son retour |
| Testeur | Humain | **Non tenu.** Aucun test humain à ce jour. |
| Validateur | Humain compétent en histoire et en sciences islamiques | **Non tenu.** Relecture à organiser avant tout partage public. |
| Exploitant | Le commanditaire | À définir si le jeu est diffusé |

## Outils

Claude Code pour la réflexion, le code et les tests ; Chromium et Playwright pour les tests ; Git sur
le dépôt du décideur ; publication en Artifact privé. Test de portabilité : tout ce qui compte est dans
le dépôt. Si l'outil disparaissait ce soir, il ne manquerait rien.
