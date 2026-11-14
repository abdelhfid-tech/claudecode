# Risques et faisabilité — étape 0.5

Probabilité et impact notés faible, moyen ou fort. Les parades listées sont celles qui ont été
réellement mises en œuvre ; ce qui reste ouvert est dit comme tel.

| # | Risque | Prob. | Impact | Parade mise en œuvre | Reste ouvert |
|---|---|---|---|---|---|
| 1 | **Sensibilité religieuse et exactitude historique.** Une parole mal attribuée, une représentation déplacée, un parti pris sur une dissension. | Forte | Tue le projet | Bible narrative écrite avant tout contenu (`schema-saga.md` §1). Prophète ﷺ jamais représenté, personne n'a de visage. Paroles attestées isolées en cartons avec leur source. Récits discutés signalés dans le codex. Choix conçus comme fidélité aux sources. Dissensions racontées sans coupable. Avertissement à l'écran-titre, dans le codex et au générique. | **Aucune relecture par un spécialiste.** Les textes viennent d'un modèle : des erreurs de date, de source ou de formulation sont probables. À lever avant tout partage public. |
| 2 | **Délai de trois heures** pour un moteur et cinq sagas. | Forte | Fort | Contrat de données et validateur écrits en premier ; cinq agents écrivent une saga chacun pendant que le moteur est construit. Statistiques calculées par le moteur pour éviter un équilibrage par saga. | Finitions limitées. Voir `retours.md`. |
| 3 | **Cohérence de cinq sagas écrites en parallèle.** Schémas divergents, ton inégal, références à des fonctions inexistantes. | Moyenne | Fort | Un seul schéma (`defs.js`), un validateur qui refuse toute opération, carte, lieu ou effet inconnu, une bible de ton commune, un gabarit par saga. Test automatique qui joue chaque saga jusqu'au bout. | Le ton n'a été relu qu'en partie. Deux sagas ont quatre héros au lieu de trois, pour une raison historique. |
| 4 | **Contraintes de l'hébergement en Artifact.** Images, médias et requêtes bloqués ; un seul fichier ; téléchargements inertes. | Certaine | Fort si ignorée | Tout l'art et tout le son sont générés par le code. Un fichier d'environ 500 Ko. Seule ressource externe : Google Fonts, avec polices de repli. `[hidden]` forcé dans la feuille de style. | Si les polices ne chargent pas, le rendu change un peu (sceaux arabes compris). |
| 5 | **Équilibrage non testé par des humains.** Trop facile, trop long ou bloquant. | Forte | Moyen | Niveau plancher par chapitre (1, 4, 6) pour qu'aucun broyage ne soit nécessaire. Soin partiel après chaque victoire. Une défaite relance le combat avec le groupe restauré. Réglage contre une IA de test sur la partie entière. | L'IA de test connaît les règles ; un nouveau joueur, non. La difficulté réelle est inconnue. |
| 6 | **Plaisir de jeu non vérifié.** Risque propre au type « jeu » du framework. | Forte | Moyen | Variété par chapitre (exploration, dialogue, noosphère, boss), boss dont les failles racontent quelque chose, choix de fidélité, codex. | Personne n'y a joué. |
| 7 | **Lisibilité sur mobile.** Scène 16:9 trop petite en portrait. | Moyenne | Moyen | En portrait étroit, dialogue, choix et commandes de combat passent sous la scène ; manette tactile ; taille de base d'au moins 13 px ; tous les menus sont touchables. Captures faites en 390 × 780. | Non testé sur un vrai téléphone. Safari et iOS non testés. |
| 8 | **Sauvegarde locale fragile.** Navigation privée, données effacées, changement d'appareil. | Moyenne | Faible | Lectures et écritures protégées ; le jeu fonctionne sans stockage. Point de reprise à chaque objectif. Sagas indépendantes, donc peu à refaire. | Pas d'export ni de synchronisation. |
| 9 | **Performance sur appareil modeste.** Composition plein écran à chaque image. | Faible | Moyen | Couche pixel en 384 × 216, flou en basse résolution réutilisé, densité d'écran plafonnée à 2, particules plafonnées. | Non mesuré sur un appareil d'entrée de gamme. |

## Faisabilité de la partie la plus incertaine

La question était : peut-on obtenir un rendu « rétro-HD » crédible et cinq sagas jouables sans aucun
asset, dans un seul fichier ? Réponse démontrée par le produit lui-même : oui. Le test automatique
joue le prologue, les cinq sagas et l'épilogue de bout en bout sans erreur.

## Risques ajoutés par la version 2

| Risque | Prob. | Impact | Parade mise en œuvre |
|---|---|---|---|
| Représenter des groupes religieux ou ethniques comme des adversaires | moyenne | fort | Règle écrite dans le contrat (`docs/schema-v2.md` §2) : aucun groupe ennemi par nature, intérêts légitimes, gens d'honneur chez chacun ; tous les ennemis de combat restent des égrégores ; les hypocrites sont des individus fictifs du camp du héros. Relecture humaine encore à faire. |
| Droits sur *Citadelle* (œuvre protégée en France) | faible | moyen | Inspiration de ton seulement ; aucune phrase ni épisode repris. Ni l'œuvre ni l'auteur ne sont nommés dans le jeu ni dans ses supports (décision du décideur). |
| Droits sur le conte qui inspire les rencontres de 2084 (protégé en France et aux États-Unis) | faible | moyen | Mêmes types humains, autres images, autres phrases, aucun nom ; à faire relire avant toute publication. |
| Musique jamais écoutée par un humain | forte | moyen | Chaque piste est validée mesure par mesure et jouée dans un navigateur de test (aucune erreur, niveaux mesurés, limiteur en sortie) ; interrupteur séparé. Le jugement de l'oreille reste à faire. |
| Contenu écrit en parallèle puis interrompu par une limite d'usage | réalisée | moyen | Les fichiers étaient valides sur le disque ; ils ont été assemblés et rejoués par les trois tests. Trois contenus sans relecture finale de leur auteur : à relire en priorité. |
| Durée et volume allongés (pourparlers, veillées) | moyenne | faible | Chaque veillée est autoportante et courte ; un pourparler rapporte autant qu'un combat. |

## Risques ajoutés par la version 5 (le cœur)

| Risque | Prob. | Impact | Parade mise en œuvre |
|---|---|---|---|
| Faire des œuvres de piété des « sortilèges » de jeu | moyenne | fort | Exigence 15 : textes sobres, aucun pouvoir promis ; l'effet est une « provision » que les épreuves consomment, et il reste faible. Deux versets seulement, en traduction du sens, à vérifier. Relecture humaine indispensable. |
| Importer une liste étrangère (« péchés capitaux ») dans un sujet musulman | moyenne | moyen | Sept maux décrits par la tradition morale musulmane, nommés en arabe ; le Recueil dit que le nombre de sept est un choix du jeu. À faire relire. |
| Qu'une lame passe pour une relique, ou qu'un égrégore passe pour un symbole religieux | faible | fort | Exigence 16 ; lames sans inscription ; l'emblème du « colosse », qui pouvait se lire comme une croix, a été redessiné en lame effilée ; l'Orgueil est une couronne. |
| Prêter une faute à un Compagnon (prière laissée, colère, envie) | faible | fort | Énigmes et idées noires réservées à la fiction, et le validateur le vérifie pour les énigmes et le pèlerinage. Les idées noires des sagas ne touchent que des interlocuteurs inventés (liste dans `decisions.md`, D64). |
| Le renard « compagnon » rappelle le conte dont on s'inspire ailleurs | moyenne | moyen | Exigence 14 : aucun épisode repris ; il n'est pas apprivoisé, il rejoint celui qui a résolu une énigme. À faire relire avec D55. |
| Le doigt jamais essayé sur un vrai téléphone | forte | moyen | Parcours `tap` complet (vraies collisions), captures en émulation ; la croix tactile reste disponible en réglage. |

## Verdict

Aucun risque classé « tue le projet » n'est sans parade, mais la parade du risque 1 est incomplète
tant qu'un validateur humain n'a pas relu les textes. Le produit est donc livrable au décideur et à un
cercle de relecture. Il n'est pas prêt pour une diffusion publique.

## Budget

Coût des services : zéro. Pas de compte, pas d'hébergement payant, pas de générateur d'assets.
