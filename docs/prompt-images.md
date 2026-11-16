# Demander une amélioration graphique à un outil d'images

Demande du décideur (15 novembre) : un texte à donner à un outil de génération d'images, avec le livret joint.

**Ce que ces images sont.** Des modèles, que l'agent redessine ensuite dans les gabarits du moteur
(`src/core/sprites.js`). Aucune image générée n'entre telle quelle dans le jeu : les personnages y sont dessinés
par le code, et le jeu n'embarque aucune ressource externe. Les exigences de respect d'`AGENTS.md` s'appliquent
à ce qu'on garde : toute image qui montre un visage, une lettre ou un symbole est écartée.

**Ce qu'on joint.** Pas tout le livret : les pages utiles, en images. Les fiches des personnages (pages 10 à 21 du
PDF), la planche « Personne n'a de visage » (page 66) et la planche « Géométrie et lumière » (page 70).

**Une planche par demande.** Le texte ci-dessous demande les sept personnages principaux. Pour une autre planche,
on remplace le bloc « DANS CETTE IMAGE » par l'une des variantes données plus bas.

## Le texte

```
Tu es directeur artistique d'un jeu de rôle en pixel art, ISNAD. Je joins des pages de son livret :
les fiches des personnages, la planche « Personne n'a de visage » et la planche « Géométrie et lumière ».

CE QUE JE VEUX
Une planche de sprites, pas une illustration : des modèles plus fins des personnages existants,
que je redessinerai ensuite à la main dans le moteur du jeu.

DANS CETTE IMAGE
- Les sept personnages principaux du livret, ceux qui ont une grande fiche, dans l'ordre du livret,
  de gauche à droite.
- Pour chacun, deux vues debout, au repos : de face sur la rangée du haut, de profil sur la rangée du bas.
- Chaque sprite est dessiné sur une grille de 32 × 48 pixels et affiché agrandi huit fois :
  des pixels carrés, nets, alignés, sans lissage ni flou.
- Fond uni, couleur #07060d. Aucun décor, aucune ombre au sol, aucun cadre, aucun texte.
- Format paysage, sept colonnes régulières.

CE QUI NE CHANGE PAS
- La silhouette de chacun, telle que dans le livret : sa coiffe, son vêtement, son manteau,
  l'objet qu'il tient, sa couleur dominante. On doit reconnaître chaque personnage au premier coup d'œil.
- Les proportions des personnages du livret.

CE QUE TU AMÉLIORES
- Le modelé : trois ou quatre tons par matière, une seule direction de lumière pour toute la planche.
- Les étoffes : plis, retombée du manteau, galons, ceinture.
- La lecture des mains, des pieds et de l'objet tenu.
- Le contraste entre les matières : laine, lin, cuir, fer, bois.

RÈGLES ABSOLUES (le sujet est religieux et historique)
1. Personne n'a de visage : ni yeux, ni bouche, ni nez, ni barbe, ni aucun trait. Le visage est une
   surface unie ; chez les personnages au voile de lumière, il reste ce voile clair.
2. Ce sont des silhouettes de jeu, pas des portraits : ne cherche à représenter aucune personne réelle.
3. Aucune lettre, aucun chiffre, aucune calligraphie, aucune inscription, nulle part.
4. Aucun symbole religieux sur les vêtements, les armes ou les boucliers.
5. Des objets ordinaires : ni or, ni soie, ni bijou, ni couronne, ni relique.
6. Aucun personnage en plus de ceux demandés.
7. Un style original : n'imite les personnages d'aucun jeu existant.

PALETTE
Garde les couleurs du livret. Repères : nuit #07060d, or #e9c877, sable #f3e7cc, turquoise #2d8f9f ;
pour le monde de 2084 seulement, néon #39e6ff et rose #ff4fd8. Une quarantaine de couleurs au plus.
```

## Variantes du bloc « DANS CETTE IMAGE »

**Les tenues du personnage du joueur.**

```
DANS CETTE IMAGE
- Huit tenues différentes pour un même personnage, celui de la dernière grande fiche du livret (2084) :
  huit combinaisons de coiffe, de vêtement et de manteau. Mêmes proportions, vue de face, debout.
- Grille de 32 × 48 pixels par sprite, agrandie huit fois, pixels nets. Fond uni #07060d, aucun texte.
- Format paysage, huit colonnes régulières.
```

**Les attitudes.**

```
DANS CETTE IMAGE
- Un seul personnage du livret, six attitudes côte à côte : recueillement, résolution, accablement,
  salut, surprise, garde. L'émotion passe par le corps, jamais par le visage.
- Grille de 32 × 48 pixels par sprite, agrandie huit fois, pixels nets. Fond uni #07060d, aucun texte.
```

**L'équipement.**

```
DANS CETTE IMAGE
- Trente objets ordinaires, chacun sur une grille de 32 × 32 pixels agrandie huit fois : épées, lances,
  arcs, boucliers de cuir et de bois, casques, turbans, tuniques, cottes de mailles.
- Rangés en cinq rangées de six. Fond uni #07060d, aucun texte, aucune inscription, aucun symbole.
```

## Avant de garder une image

- Aucun visage, même esquissé ; aucune lettre ; aucun symbole.
- Les silhouettes du livret se reconnaissent.
- Les droits d'usage du service permettent l'emploi prévu : à vérifier par le décideur.

## Ce que l'on fait d'une planche reçue

Première planche reçue le 16 novembre : les sept personnages principaux, de face et de profil.

1. **On la mesure avant de la redessiner.** Les modèles n'ont pas gardé les proportions demandées : leur tête est plus
   petite (16 × 17 pixels contre 20 × 20 dans le jeu), leur corps plus long (29 lignes contre 26). C'est ce que le
   décideur a retenu comme « personnages améliorés » : le grand sprite du jeu a donc pris ces proportions.
2. **On la redessine en gabarits, pièce par pièce** (`src/core/sprites.js`, « le grand sprite natif ») : une tête par
   coiffe, un corps, ses attitudes. Deux personnages qui portent la même coiffe la partagent ; les couleurs restent
   celles du jeu ; l'équipement, la marche et les poses continuent de s'appliquer. Ce qui est propre à un seul modèle
   (des manches pendantes, un baudrier) ne passe pas.
3. **On écarte ce qui contrevient aux exigences.** Sur cette planche : une ligne courbe sous un visage, qui se lit
   comme une bouche ; une barre nasale qui coupe un visage en deux taches claires ; deux gardes d'épée en croix. Le
   moteur refuse désormais tout gabarit dont le voile n'est pas une seule surface.
4. **L'image elle-même n'entre ni dans le jeu ni dans le dépôt.** Elle ne sert qu'à la planche de comparaison
   (`node v2/tools/silhouettes.js planches image.png`), écrite dans `.smoke/`.
