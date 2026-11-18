# Relecture du français de la 2.x

*Proposée par l'agent le 18 novembre, à la demande du décideur (D183 : « une relecture de tout le français, proposée
avant d'être appliquée »). Rien n'est changé dans le jeu : chaque point attend votre réponse, numéro par numéro (« oui à
1.3, non à 2.7 »).*

Ce qui n'est pas repris ici, parce que c'est déjà décidé ou déjà proposé : « chimère » pour « égrégore », « les degrés du
mal » pour « l'organigramme », les quatre paroles corrigées d'après leur source, et tout ce que dit
`propositions-francais.md` (le Menteur, Dhû l-Fiqâr, Haydar, *Waswâs*, le siwâk, le Généreux, la Porte du Savoir, les
visages décrits, « Dieu » chez les Purs, l'exigence 14…).

**Ce qui a été lu.** En entier : le cœur (`coeur.js`), le moteur (`v2/src/core/*.js`), les tables (`defs.js`),
l'histoire-cadre (`frame.js`) et les veillées (`caid.js`). Dans les cinq sagas : les ouvertures, les fins, les passages
dans la noosphère, les codex, et une recherche mot par mot (pouvoir, magie, sort, esprit, âme, aura, rayon, sceau,
glyphe, songe, porte, lumière, voile, étoile, corps, possession, millions, regards…). Les lignes sont celles du dépôt au
commit `e7a5ead` ; le passage à « chimère », en cours, peut les décaler d'une ou deux. Le nombre de textes donne le coût
d'un changement ; chacun repasse ensuite dans les trois autres langues (`node v2/tools/langues.js releve`).

## Les dix propositions qui comptent le plus

| N° | En une ligne |
|---|---|
| **1.1** | La prière, le dhikr et le sommeil ne sont plus des « portes » qui « ouvrent » un autre monde « entre veille et songe » : ce sont des moments où l'on descend en soi, et le troisième se dit « avant de dormir ». |
| **1.2** | La « noosphère » (mot de Teilhard de Chardin, devenu un mot clef du New Age) devient « l'envers » (« l'envers de Médine »), et l'on retire ce qui en fait un monde invisible qui garde la mémoire de tout. |
| **1.3** | La Sakîna, que le Coran dit « descendue » par Allah, cesse d'être une jauge que la prière remplit à coup sûr : la jauge s'appelle « Sérénité ». |
| **1.4** | Les « compagnons de lumière », « figures du ciel » nées des étoiles et porteuses de « dons », deviennent des « bêtes de conte » : plus de confusion avec les Compagnons, les anges ou les astres. |
| **1.5** | Deux phrases prêtent du surnaturel à des Compagnons : une lumière violette qui ne s'éteindra plus au-dessus de Koufa après la mort de 'Alî, et Hudhayfa qui entend à des semaines de marche. |
| **1.6** | Six tournures décrivent une possession (« il emprunte le corps de qui le répète », « ce n'est plus lui qui parle », « une chimère le tient ») : on les réécrit pour que l'homme reste le sujet. |
| **1.7** | « Babel » (Bâbil, en 2:102, est le lieu de la magie) et une « lettre détachée de sa récitation » qu'on frappe, avec des « glyphes » qui tournoient : on parle de querelle, plus de lettres. |
| **1.8** | Les énigmes du cœur : « languit sans fièvre ni blessure », « dépérit sans cause visible » est la langue de l'envoûtement, et « un compagnon » qui a laissé sa prière se lit « un Compagnon ». |
| **3** | Pour les trois postures, le mot « conduite », et en combat la mention « en héros », « en sage », « en saint », plutôt qu'un titre. |
| **2.1** | En 2084, on compte des vues, pas des regards : « quarante et un millions de vues » ; et « des millions de gens désirent », pas « des millions de regards ». |

---

## 1. Les notions qu'on pourrait relier à l'occultisme

Chaque point dit si le problème est réel, faible ou absent. La fin de la partie (1.19) dit ce qu'il faut garder.

### 1.1 Les « portes » de la noosphère, et « en songe » : problème réel

> **Écartée par le décideur (D184), et à ne pas reprendre.** Le 18 novembre, il a précisé : « on a dit descendre dans la
> noosphère », et « gardons un peu de distance avec le joueur ». Les tournures « descendre en soi », « en toi-même »,
> « regarder en toi », plus bas, sont donc le contraire de ce qu'il veut : la descente est celle du râwî, dite à la
> troisième personne.

**Aujourd'hui.** `coeur.js:274-297` (les portes) :
« La prière est dite. Le cœur est calme, et la noosphère est toute proche. » ; « Le sommeil vient. Entre veille et
songe, la noosphère est toute proche. » ; « S'endormir : un songe peut ouvrir la noosphère » ; « Cette porte s'est déjà
ouverte dans ce chapitre. » ; « les portes de la noosphère se rouvriront ». L'aide (`ui.js:588`) : « Trois moments
ouvrent la noosphère à qui veut y descendre […] Une descente par porte et par chapitre. » Le recueil, « Descendre en
soi » (`coeur.js:358`), et la page des Valeurs (`valeurs.js:79`) : « au sortir de la prière, dans le dhikr, en songe ».

**Pourquoi.** Un exercice spirituel qui « ouvre une porte » vers un autre monde, c'est le schéma même du voyage astral et
de la méditation du New Age. Et « entre veille et songe », l'endormissement, est précisément l'état que ces pratiques
recommandent pour « sortir de son corps ». En islam, le songe n'est pas une porte qu'on ouvre : il vient d'Allah, de
l'âme ou du Shaytân. Quant à la prière, elle ne fait rien d'autre qu'être la prière (exigences 13 et 15). Le recueil dit
bien que c'est une image, mais les phrases du seuil, que le joueur lit à chaque fois, disent le contraire.

**Proposition.** Garder les trois moments (exigence 22, votre décision) et le mécanisme, mais dire « moment » au lieu
de « porte » et « avant de dormir » au lieu de « en songe ». La descente devient alors un regard sur soi :
- prière : « La prière est dite. Le cœur est calme : c'est un bon moment pour regarder en toi. » ;
- dhikr : « Le rappel a fait silence autour de toi. C'est un bon moment pour regarder en toi. » ;
- sommeil : titre « Avant de dormir » ; invitation « La journée s'achève. Avant de dormir, on fait le compte de ce qui
  pèse. » ; menu « S'endormir, après avoir fait le compte de sa journée » ;
- question : « Veux-tu descendre en toi-même, râwî, et faire face à ce qui te pèse ? » (la suite ne change pas) ;
- seuil : « Tu descends en toi-même. » ;
- « Cette porte s'est déjà ouverte… » → « Tu es déjà descendu à ce moment-là, dans ce chapitre. » ;
- « Tu dors d'un sommeil sans songe. […] les portes de la noosphère se rouvriront. » → « Tu dors d'une traite. Tes
  forces reviennent : tu pourras redescendre. » (de même « la porte se rouvrira » → « tu pourras redescendre ») ;
- aide : « Trois moments s'y prêtent : au sortir de la prière, après le dhikr, avant de dormir (« S'endormir », sur la
  natte). Une descente par moment et par chapitre. » ;
- recueil, « Descendre en soi » : on peut y ajouter que l'examen de soi a un nom, *al-muḥâsaba*. Al-Ghazâlî lui consacre
  un livre de l'*Iḥyâ'* (celui de la vigilance et de l'examen de soi, à relever dans le registre avant d'écrire la
  phrase).

**Coût.** Une quinzaine de textes. L'exigence 22 dit « en songe » : vous seul pouvez la réécrire.

### 1.2 La noosphère : problème réel

**Aujourd'hui.** 67 textes. Les plus exposés :
- le recueil (`frame.js:124`) : « l'envers invisible de chaque lieu » ;
- Maître Yûnus (`frame.js:182`) : « Invisible, et c'est pourtant là que tout se décide » ;
- `saga_khalid.js:26` : « la noosphère n'oublie rien » ; `saga_umar.js:941` : « tel que la noosphère s'en souvient » ;
- `saga_abubakr.js:364` : « Râwî, regarde l'envers du lieu » ;
- les crédits (`ui.js:393`) et le recueil, qui nomment Teilhard de Chardin ;
- « prend corps », « ont pris corps » (12 textes).

**Pourquoi.**
- *Le mot.* Il a été forgé dans les années 1920 par Vernadsky et par le jésuite Teilhard de Chardin, chez qui la
  noosphère est une étape vers le « point Oméga ». C'est devenu un mot clef du New Age, celui de la « conscience
  planétaire » : Teilhard était l'auteur que citaient le plus souvent les acteurs du mouvement interrogés par Marilyn
  Ferguson (*Les Enfants du Verseau*), et José Argüelles a fait de la noosphère un programme. Le jeu le nomme dans ses
  crédits.
- *Ce qu'on en dit.* « Un monde invisible derrière chaque lieu, qui n'oublie rien et où les pensées prennent corps » :
  c'est mot pour mot le « plan astral » de la théosophie, ses « formes-pensées » et ses « annales » qui gardent tout.
  Pour un lecteur musulman, cela empiète aussi sur le *ghayb*, l'invisible qu'Allah seul connaît.
- *La chimère* (D183) « semble avoir un corps » et se révèle vide. « Prendre corps » dit désormais le contraire de sa
  définition.

**Proposition A (recommandée) : « l'envers ».** Le mot sert déjà de glose une vingtaine de fois (« l'envers de la
ville », « l'envers du camp », « l'envers de la piste »). C'est du français courant, sans doctrine, et il va avec la
Cité-Miroir. On l'écrit toujours avec son lieu, et jamais « monde » :
- « Trois idoles l'attendent dans l'envers de Médine » ; « Dans l'envers du camp, la peur… » ;
- « L'Envers », avec une majuscule, pour le nom de la carte et la catégorie du recueil ;
- recueil : « Chaque lieu a son envers : ce que ses gens y pensent, y craignent et y désirent ensemble. Le jeu le dessine
  comme un lieu pour pouvoir y combattre. Ce n'est pas un monde caché : c'est une image, la ville vue de l'intérieur. » ;
- Yûnus : « Tu sais ce qu'est l'envers de la ville ? Tout ce que les hommes pensent, craignent et désirent ensemble. Ça
  ne se voit pas sur les murs, et c'est pourtant là que beaucoup se décide. » ;
- « la noosphère n'oublie rien » → « Mais les hommes n'oublient pas les victoires. Chacune dépose, dans l'envers des
  villes, une paillette d'or. » ; « tel que la noosphère s'en souvient » → « tel que les hommes s'en souviennent » ;
- « prend corps » → « se dessine » ou « prend forme » ;
- les crédits et le recueil ne nomment plus Teilhard ni Vernadsky : on ne donne l'origine d'un mot que si on le garde.

**Coût de A.** 67 textes, plus le nom de la carte (`D.MAPS.noos`, `D.lieu('Noosphère')`) et l'affichage de la
catégorie du recueil (sa clé reste en français). Les exigences 22 et 23 nomment la noosphère : c'est votre texte.

**Proposition B (minimale).** Garder le mot, réécrire les cinq phrases citées ci-dessus, retirer Teilhard des crédits et
ajouter « image du jeu » au recueil. Coût : environ 8 textes.

### 1.3 La Sakîna, jauge de combat : problème réel

**Aujourd'hui.** 14 textes :
- « la Sakîna descend » (`coeur.js:23`, `oeuvres.js:119` et `124`, `ui.js:579`) ;
- « Apaise : la Sakîna monte » (`coeur.js:25`) ;
- « Avant l'épreuve, une prière sur la natte donne la Sakîna au groupe » (`ui.js:626`) ;
- la Gazelle « reçoit un peu de Sakîna » (`coeur.js:99`) ; « Sakîna +{n} au départ » (`postures.js:28`) ;
- « pleine, elle ouvre l'acte ultime du Compagnon » (`ui.js:577`) ;
- à la défaite : « Reprends, le cœur affermi : la Sakîna descend sur ceux qui persévèrent » (`battle.js:549`).

**Pourquoi.** Dans le Coran, la *sakîna* est ce qu'Allah « fait descendre » dans les cœurs (48:4 ; aussi 9:26, 9:40,
48:18, 48:26) : un don, que personne ne produit. Le jeu en fait une jauge :
- la prière la remplit à coup sûr ;
- une bête de fiction en donne ;
- on la dépense pour un coup décisif ;
- l'écran de défaite affirme ce qu'Allah fait pour « ceux qui persévèrent ».

Un rite qui produit à coup sûr un effet surnaturel, c'est la forme même de la magie. Le recueil a beau dire que les
œuvres « ne donnent aucun pouvoir », la jauge dit le contraire.

**Proposition.**
- La jauge s'appelle **Sérénité**. Le jeu emploie déjà ce mot pour la prière dans les pourparlers, et le dhikr qui
  apaise les cœurs est cité par le jeu lui-même (13:28). Le mot *sakîna* reste dans le recueil, là où l'on cite le Coran.
- Les textes deviennent :
  - « la Sakîna descend » → « le groupe retrouve sa sérénité » ;
  - « une prière sur la natte donne la Sakîna » → « une prière sur la natte rend au groupe sa sérénité » ;
  - « Sakîna au début des combats ; sérénité dans les pourparlers » → « Sérénité au début des combats et dans les
    pourparlers » ;
  - « elle ouvre l'acte ultime » → « elle permet le grand acte du Compagnon ».
- À la défaite, on supprime la fin : « Ce qui fut transmis ne se perd pas. Reprends, le cœur affermi. »

**Coût.** 14 textes. « Sakîna » est dans le vocabulaire du jeu (`AGENTS.md`, Conventions) : à vous de trancher.

### 1.4 Les compagnons de lumière : problème réel

**Aujourd'hui.**
- le bandeau de combat (`battle.js:172`) : « Compagnon de lumière · {don} » ;
- la page de la halte (`oeuvres.js:316`, `319`) : « Des figures du ciel, qui prennent corps dans la noosphère » et « Une
  figure du ciel » ; l'aide (`ui.js:592`) ;
- le recueil (`coeur.js:361`) : « Dans la noosphère d'ISNAD, ces noms ont pris corps » ;
- le Renard (`coeur.js:92`) : « Les chameliers disent qu'il naît d'une étoile tombée dans les dunes » ;
- le Phénix : son « don » s'appelle « Renaissance ».

**Pourquoi.** Trois raisons :
- **« compagnon ».** Dans un jeu sur les Compagnons, « Compagnon de lumière · Flair », avec sa majuscule en tête de
  bandeau, se lit « un Compagnon ». L'exigence 16 veut justement qu'aucune de ces figures ne les approche.
- **« de lumière », « figures du ciel ».** En islam, ce sont les anges qui sont créés de lumière (Muslim, d'après
  'Â'isha, à relever). Des « figures du ciel » qui prennent corps et viennent en aide se lisent comme des anges, ou comme
  les « êtres de lumière » et les « guides » du New Age. Des bêtes qui rejoignent celui qui progresse et lui apportent un
  « don », ce sont aussi les « animaux de pouvoir » du chamanisme.
- **Des étoiles qui donnent.** Le hadith de Zayd ibn Khâlid (« ce matin, parmi Mes serviteurs, l'un croit en Moi… »,
  al-Bukhârî et Muslim, à relever) condamne qui attribue la pluie à une étoile. Une étoile devenue bête qui donne du
  flair ou de la sérénité en approche. Et le Renard « né d'une étoile tombée » est une croyance inventée, prêtée aux
  chameliers.

**Proposition : « les bêtes de conte ».** Plus de lumière ni de ciel, et « atout » au lieu de « don » :
- le recueil : « Les bêtes de conte (fiction). Les Arabes donnaient aux étoiles des noms de bêtes : l'Aigle qui vole,
  le Lion, les bonds de la Gazelle. Le jeu en a fait des bêtes de conte, comme le Renard des sables et le Phénix, qui
  viennent des vieux contes. Ce sont des figures de fiction : les étoiles ne donnent rien, et aucune de ces bêtes
  n'accompagne un Compagnon dans le récit historique. » ;
- la halte : « Des bêtes de conte. Une seule t'accompagne au combat : choisis-la dans la liste. » ;
- les intitulés : « Une figure du ciel » → « Une bête de conte » ; le bandeau « Bête de conte · {atout} » ; le menu
  « Bêtes de conte » ;
- le Renard : « Les chameliers disent qu'il connaît toutes les pistes. » (la suite ne change pas) ;
- le Phénix : « Renaissance » → « Relève », le mot du jeu.

**Coût.** Une douzaine de textes, plus les accords au féminin. Les exigences 16 et 22 disent « compagnons de lumière » :
votre texte.

### 1.5 Ce que deux récits prêtent aux Compagnons : problème réel, coût minime

- **`saga_ali.js:966`**, au lendemain de la mort de 'Alî : « Dans la noosphère, une lumière violette demeure au-dessus de
  la ville : elle ne s'éteindra plus. »
  - *Pourquoi.* Le violet est la couleur du voile de 'Alî (`D.RAYONS`). Une lumière perpétuelle au-dessus de Koufa,
    attachée à sa personne, est un signe de sainteté, et elle rejoint une dévotion propre à une seule école (exigence 5).
    C'est aussi le seul texte qui donne un sens à la couleur d'un voile, ce que `AGENTS.md` exclut.
  - *Proposition.* « Le jour se lève sur Koufa. Dans la mosquée, on prie sans lui. Ce qu'il a enseigné, d'autres le
    transmettront. »
- **`saga_uthman.js:844`** : « La Rumeur ignore les distances : à al-Madâ'in, à des semaines de marche, Hudhayfa
  l'entend aussi — et lui tient tête. Ici, il est à tes côtés. »
  - *Pourquoi.* Un Compagnon présent en deux lieux, et qui entend de si loin : c'est de la voyance prêtée à Hudhayfa.
  - *Proposition.* « La noosphère de Médine, saturée de voix. Hudhayfa, gouverneur d'al-Madâ'in, a tenu tête à la même
    rumeur, loin d'ici ; le jeu le place à tes côtés. »

### 1.6 Les tournures de possession : problème réel

**Pourquoi.** Plusieurs phrases montrent une chose qui « tient » un homme, parle par sa bouche ou prend son corps. C'est
l'image de la possession, et un combat livré « pour lui » contre ce qui le tient ressemble à un exorcisme. Cela
contredit aussi l'exigence 18 : « le cœur reste responsable ». On réécrit pour que l'homme reste le sujet.

| Où | Aujourd'hui | Proposition |
|---|---|---|
| `caid.js:59` (Chuchotement) | « Il n'a pas de corps : il emprunte celui de qui le répète. » | « Il n'a pas de corps : il n'a que la voix de ceux qui le répètent. » |
| `frame.js:354` (Défilement) | « quelque chose, derrière lui, a resserré sa prise. Tant qu'elle parlera plus fort que toi… » | « Il a dit « si j'arrête », et il s'est cramponné à son écran. Tant que cela parlera plus fort que toi, il n'entendra rien. » |
| `frame.js:417` (Petit Trône) | « Ce n'est plus lui qui parle : c'est la place qu'il occupe. » | « Il ne parle plus pour lui : il parle pour sa place. » |
| `saga_ali.js:866` (Désespoir) | « C'est cela qui répond, et non lui. » | « Il ne répond plus qu'à cela. » |
| `trade.js:173` (Razzia) | « la vieille coutume se dresse : il ne commande plus, c'est elle. » | « la vieille coutume se dresse, et il lui obéit plus qu'à sa raison. » |
| `script.js:129` (carton du pourparler) | « Une chimère le tient » | « Il n'entend plus que cela » (voir aussi 2.3) |

**Coût.** 6 textes.

### 1.7 « Babel », la lettre détachée et les glyphes : problème réel

**Aujourd'hui.** `saga_uthman.js` :
- l'ennemi « Variante querelleuse » (`115-122`) : « Une lettre détachée de sa récitation, qui ne sert plus à lire mais à
  l'emporter sur l'autre » ;
- l'idole « Babel » (`125`, `272`, `434`, `439`) ;
- la narration (`395`, `397`) : « des lettres se détachent des voix et tournoient », « Les glyphes retombent » ;
- l'objectif (`436`) : « Dénouer les variantes qui barrent le réseau ».

**Pourquoi.**
- **Babel.** Pour un lecteur musulman, *Bâbil* est, dans le Coran (2:102), le lieu où Hârût et Mârût enseignaient la
  magie. La tour de la Genèse, elle, n'est pas dans le Coran.
- **Les lettres.** Des lettres de la récitation qui se détachent et tournoient, des « glyphes » : c'est l'imagerie de la
  « science des lettres », le cœur de la magie talismanique. Et un ennemi qui est « une lettre de la récitation » fait
  d'une lettre du Coran une chose qu'on frappe (l'esprit de l'exigence 8).
- **Les variantes.** Les lectures sont un fait légitime (le Coran « révélé selon sept *aḥruf* », al-Bukhârî et Muslim,
  à relever). Le mal, c'est la querelle, pas la variante.
- **« Réseau »**, au VIIe siècle, est un anachronisme.

**Proposition.**
- « Babel » → « la Discorde des lectures » (le recueil l'appelle déjà ainsi) ;
- « Variante querelleuse » → « la Querelle », avec cette description : « L'envie d'avoir raison sur l'autre, quand on
  récite pour l'emporter. Le Savoir la remet à sa place. » ;
- « des lettres se détachent des voix et tournoient » → « les voix montent l'une contre l'autre » ;
- « Les glyphes retombent » → « Le tumulte retombe » ;
- « Dénouer les variantes qui barrent le réseau » → « Dénouer les querelles qui barrent le passage » ;
- « Au cœur du réseau, Babel attend » → « Au cœur du dédale, la Discorde attend ».

**Coût.** 9 textes.

### 1.8 Les énigmes du cœur : problème réel

**Aujourd'hui.**
- `caid.js:287` : « Zîrî languit, sans fièvre ni blessure. » ;
- `caid.js:418-419` : « Maître Bahrâm dépérit », « dépérit, sans cause visible » ;
- le recueil (`coeur.js:363`) : « Il arrive qu'un compagnon languisse sans fièvre ni blessure. […] Cherche d'abord ce
  qu'il a cessé de faire. Une prière laissée… » ;
- l'aide (`ui.js:591`) : « un compagnon languit sans fièvre ni blessure ».

**Pourquoi.**
- « Languir sans fièvre », « dépérir sans cause visible » : c'est la description populaire d'un mal « occulte »
  (envoûtement, mauvais œil, qu'on va faire « soigner »). Puis une œuvre « le remet debout » : on lit un remède rituel.
  Les scènes, elles, sont justes et tout y est humain : la lassitude de Zîrî, la brouille de Bahrâm, l'insomnie du Caïd
  qui compte ses sacs. Ce sont les résumés qui égarent.
- « Un compagnon » qui a laissé une prière se lit « un Compagnon », et l'exigence 15 l'interdit.

**Proposition.**
- Zîrî : « Zîrî est las depuis des jours, et le médecin ne lui trouve rien. » ;
- Bahrâm, titre : « Maître Bahrâm ne mange plus » ; signe : « Maître Bahrâm ne mange presque plus, et ses mains
  tremblent. » ;
- le recueil : « Il arrive que l'un des tiens perde courage sans être malade ni blessé. […] Ce n'est pas une punition,
  ni un mal caché : c'est un poids, et il se pose en reprenant ce qu'on avait laissé. Les énigmes ne touchent que des
  personnages de fiction. » ;
- l'aide : « l'un des tiens perd courage, sans être malade ni blessé ».

**Coût.** 5 textes.

### 1.9 L'Ombre du Père : problème moyen

**Aujourd'hui.** `caid.js:60-70` et `263`. Le nom est « L'Ombre du Père », et les répliques sont à la première
personne du mort : « Tant qu'on tait ma mort, je règne », « Ils n'obéissaient qu'à ma voix », « Que feras-tu sans moi ? ».

**Pourquoi.** L'« ombre » d'un mort qui parle aux vivants est un revenant. La description dit bien « Ce n'est pas le
père : c'est la place qu'il tenait dans les têtes », mais les répliques disent le contraire.

**Proposition.** Le nom devient « La Place gardée » : « Le Trône vide » existe déjà chez 'Umar, et la narration dit
déjà « la place qu'il tenait dans leurs têtes ». Les répliques sont celles de la place :
- « Que feras-tu sans lui ? » ;
- « Ils n'obéissaient qu'à sa voix. » ;
- « Tant qu'on tait sa mort, je tiens. Laisse-moi tenir encore sept jours. »

**Coût.** 5 textes.

### 1.10 « Compteur d'étoiles » : problème moyen

**Aujourd'hui.** `caid.js:489` : « un vieux compteur d'étoiles » ; `caid.js:745` et `779` : « des compteurs d'étoiles »,
dans la bouche des Purs.

**Pourquoi.** Compter les étoiles, dans ce monde-là, c'est faire l'astrologue. Le hadith « qui prend une part de la
science des étoiles prend une part de la magie » est rapporté par Abû Dâwûd, d'après Ibn 'Abbâs (à relever). Si les
Perses du Caïd comptent les étoiles, l'accusation des Purs est fondée, et le Caïd défend des astrologues. Or le jeu ne
leur prête que la géométrie.

**Proposition.** « un vieux traceur de lignes », « des traceurs de lignes ». Le jeu dit déjà « on s'en prend toujours
d'abord à ceux qui tracent des lignes ».

**Coût.** 3 textes.

### 1.11 « Esprit », la caractéristique : problème moyen

**Aujourd'hui.** 9 textes :
- la fiche : « … Force · Esprit · Garde · Élan » ;
- les postures : « Le sage discerne : plus d'Esprit » ;
- trois compétences : « Esprit accru » ;
- au retour de la descente : « Esprit +1 · Souffle +2, pour de bon » (`coeur.js:293`).

**Pourquoi.** En français musulman, « l'Esprit » (*ar-Rûḥ*) désigne Jibrîl (« l'Esprit fidèle », 26:193), ou le souffle
de vie qu'Allah insuffle. Dans la langue courante, « les esprits » sont ce que l'occultisme invoque. Une caractéristique
« Esprit » fait la force des vertus et grandit « pour de bon » à chaque descente dans un autre plan : on lit un pouvoir
spirituel gagné en voyage intérieur.

**Proposition : « Lucidité ».** La descente dit déjà : « On en remonte plus lucide » (`coeur.js:296`).

**Coût.** 9 textes.

### 1.12 La Niyya, monnaie de combat : problème moyen, à votre goût

**Aujourd'hui.** 17 textes. « Niyya (l'intention) : un point par tour ; dépense-en jusqu'à trois pour multiplier les
coups ou renforcer une vertu » ; le Siwâk et l'Aigle en donnent.

**Pourquoi.** La *niyya* est ce qui donne leur valeur aux actes (« les actes ne valent que par les intentions »,
al-Bukhârî et Muslim). En faire des points qu'on amasse et qu'on dépense pour frapper plus fort, c'est la « force de
l'intention » du développement personnel et du New Age (« poser une intention » pour obtenir quelque chose). Cela banalise
aussi un mot du fiqh.

**Proposition : « Résolution ».** C'est le *'azm* (« quand tu t'es résolu, place ta confiance en Allah », 3:159), et le
geste du joueur : se résoudre, puis frapper. Par exemple : « Se garder rend un point de résolution » ; « La garde et la
résolution ».

**Coût.** 17 textes. « Niyya » est dans le vocabulaire du jeu (`AGENTS.md`).

### 1.13 Les lames et le compte des œuvres : problème faible

**Aujourd'hui.**
- `frame.js:371`, `496`, `558`, `620` : « Le jeûne, trois fois tenu, forge la lame » ; « La prière tenue quand nul ne
  regarde, trois fois, forge la lame »… ;
- l'aide (`ui.js:585`) : « trois jeûnes pour le Contentement, trois prières pour la Sincérité… » ;
- l'aide (`ui.js:587`) : « L'œuvre, accomplie trois fois, forge la lame ».

**Pourquoi.** Le mot « forger » va bien : on forge un caractère, et « sept lames, et aucune n'est de fer ». Ce qui gêne,
c'est la recette. « Trois prières pour la Sincérité » se lit comme les prescriptions des guérisseurs (« récite trois
fois… pour obtenir… »), où c'est le nombre de répétitions qui produit l'effet. Le compteur peut rester : ce sont les
phrases qui doivent dire l'habitude plutôt que la recette.

**Proposition.**
- « Le jeûne repris, jour après jour, forge la lame qui la tranche » (de même pour les trois autres) ;
- l'aide : « Une œuvre reprise jusqu'à devenir une habitude forge une lame : le jeûne, le Contentement ; la prière, la
  Sincérité… La page « Œuvres et lames » tient le compte. »

**Coût.** 6 textes.

### 1.14 La Chaîne qui murmure : problème faible

**Aujourd'hui.** `saga_khalid.js:27` : « Idris sent le maillon se refermer sur son poignet. La Chaîne murmure :
« Regarde bien. Voici un homme qui devra vaincre sa propre statue. » »

**Pourquoi.** La Chaîne, c'est l'isnâd : des noms, et après chaque nom, « d'après ». Un anneau qui se referme sur le
poignet et une chaîne qui murmure à l'oreille en font un objet enchanté, et « murmurer » est le verbe de ceux qui
soufflent. Ailleurs, le jeu répond très bien : à l'enfant qui demande « Tu pars où ? », Idris dit « Je ne pars pas.
J'écoute des gens qui ont vu. »

**Proposition.** « Idris ouvre le maillon suivant. Maître Yûnus l'a prévenu : « Regarde bien. Voici un homme qui devra
vaincre sa propre statue. » » On ne la prête pas aux transmetteurs, qui ne l'ont pas dite.

**Coût.** 1 texte.

### 1.15 « Purifié », et « les murmures » : problème faible, lié à *Waswâs* → *Trouble*

**Aujourd'hui.** `battle.js:467` : « Purifié » s'affiche quand un soin ôte l'étourdissement, le doute ou le *waswâs*.
`frame.js:48` et `caid.js:35` : « Dissipe le doute et les murmures d'un compagnon ».

**Pourquoi.** Se « purifier » d'un *waswâs*, c'est le vocabulaire de la *roqya*.

**Proposition.**
- « Purifié » → « Rétabli » ;
- si *Waswâs* devient *Trouble* (`propositions-francais.md`, § 1) : « Dissipe le doute et le trouble d'un compagnon ».

**Coût.** 3 textes.

### 1.16 Le temple et la clef de voûte : problème faible

**Aujourd'hui.** `saga_abubakr.js:495` : « Un peuple n'est pas un tas de pierres, râwî : c'est un temple […] Ce jour-là,
on en retira la clef de voûte, et il tint. »

**Pourquoi.**
- « Temple » nomme en français un lieu de culte qui n'est pas une mosquée.
- Le Temple, la clef de voûte, la Lumière qu'on reçoit, la chaîne : ce sont aussi les images de la franc-maçonnerie, que
  bien des lecteurs musulmans tiennent pour une société ésotérique.
- La Chaîne et les Lumières sont justes (isnâd, *nûr*) : c'est cette phrase seule qui y ajoute le temple.

**Proposition.** « c'est une maison, et ce qui la tient debout n'est aucune de ses pierres. Ce jour-là, on en retira la
poutre maîtresse, et elle tint. » Les veillées emploient déjà l'image de la poutre.

**Coût.** 1 texte.

### 1.17 Les Lumières : deux phrases, problème faible

**Aujourd'hui.** `frame.js:240` : « Cinq Lumières brûlent en lui, et aucune n'est la sienne » ; `ui.js:387` : « la Lumière
de {nom} rejoint Idris ».

**Pourquoi.** Une lumière qui « brûle en » quelqu'un ou qui le « rejoint » se lit comme une grâce qui passe d'une
personne à une autre, comme dans une initiation. Le jeu, lui, en fait une leçon reçue d'un récit. Le mot « Lumière »
reste juste : « le savoir est une lumière ».

**Proposition.** « Idris rouvre les yeux. Il rapporte cinq Lumières, et aucune n'est la sienne : on les lui a
confiées. » ; « {lumiere} — Idris rapporte la Lumière de {nom}. »

**Coût.** 2 textes.

### 1.18 « Un voile de lumière » : problème faible, au choix

**Aujourd'hui.** `ui.js:391` et `frame.js:147` (ainsi que le livret) : « aucun Compagnon n'a de visage : un voile de
lumière en tient lieu ».

**Pourquoi.** « Son voile est la lumière » est, dans un hadith de Muslim (d'après Abû Mûsâ, à relever), une parole sur
Allah. Un lecteur averti peut entendre l'écho.

**Proposition.** « un voile clair, sans aucun trait, en tient lieu ». Le dessin ne change pas.

**Coût.** 2 textes, et le livret.

### 1.19 Ce qui ne pose pas de problème : à garder

- **La provision du cœur** : c'est *az-zâd*, et le jeu cite déjà le verset (2:197).
- **Le mot « Lumière »** : seules deux phrases sont à revoir (1.17).
- **Les éléments** : le mot « élément » n'est jamais affiché. Fer, Véracité, Justice… sont un métal et des vertus.
- **Les sceaux** : le mot ne sert dans le jeu qu'aux lettres scellées. Les médaillons qui tiennent lieu de portraits (un
  nom en coufique dans une étoile à huit branches) rappellent les grands médaillons des mosquées ottomanes, pas les
  talismans. Il suffit de ne jamais y mettre d'étoile à six branches ni de carré de lettres ou de chiffres, ce que le
  code ne fait pas.
- **Les glyphes** : c'est un nom de variable (des particules). Le seul texte qui en parle est traité en 1.7.
- **L'aura et les rayons** : « aura » n'est qu'un nom de champ dans les fichiers de saga (`look.aura`), jamais affiché ;
  on pourra le renommer `lueur` à l'occasion. Les rayons sont un dessin sans texte, sauf la phrase de 1.5.
- **Les voiles, « dévoiler »** : le jeu dévoile pour montrer que l'idole est vide, c'est l'inverse d'un secret qu'on
  révèle à des initiés. Les voiles du cœur (*al-ḥujub*) sont une image classique d'al-Ghazâlî.
- **Le Souffle** : c'est un effet matériel (exigence 17). Il est seulement malheureux que « ceux qui soufflent » en
  partagent le verbe, mais ce verbe vient de la traduction citée de 114:5.
- **Les Vertus** du menu de combat sont des vertus morales. **« Éclairer »**, c'est faire comprendre.
- **« Pouvoir », « sortilège »** n'apparaissent que pour être niés (« elles ne donnent aucun pouvoir », « Ni poison ni
  sortilège »). **Énergie, rituel, vibration, talisman, augure, présage, astral, magie** n'apparaissent pas.
- **« Démons intérieurs »** est expliqué aussitôt (exigence 22).
- **Les étoiles pour s'orienter** (Coran 16:16, cité). Le Lion et les bonds de la Gazelle sont des noms d'étoiles
  attestés.
- **Idris qui « rouvre les yeux »** devant la Chaîne : le jeu dit lui-même que ce n'est pas un voyage (l'enfant du
  parvis). « On l'a vu, hier, regarder longtemps le ciel », la veille du coup porté à 'Alî, reste sobre.

---

## 2. Les formulations

| N° | Où | Aujourd'hui | Proposition | Pourquoi |
|---|---|---|---|---|
| **2.1** | `frame.js:171`, `119`, `120`, `127`, `165` | « Aujourd'hui, quarante et un millions de regards. » ; « Quarante et un millions de regards. Et le tien ? » ; « tout ce que des millions de regards désirent ensemble » ; « Il agrège l'attention de millions de regards » | « Aujourd'hui, quarante et un millions de vues. » ; « Quarante et un millions de vues. Il manque la tienne. » ; « tout ce que des millions de gens désirent ensemble » ; « Il agrège l'attention de millions de gens » | En 2084, on compte des vues. Un regard ne désire pas. On garde « regard » là où c'est une image qui fonctionne : le Compteur qui en « pose un sur le premier passant », « Mille regards », « faute de regards ». |
| **2.2** | `frame.js:467`, `139` ; `597`, `599`, `606` | « Onze millions de fenêtres me suivent » ; « un homme que des millions de fenêtres applaudissent » ; le Cartographe : « onze millions de relevés » | « Huit millions d'abonnés me suivent » ; « que des millions de comptes applaudissent. Derrière ces comptes, il n'y a personne. » | « Abonnés » et « comptes » sont les mots justes. Le même « onze millions » revient pour deux personnages. On garde « fenêtres » dans la bouche de l'enfant (`460`) : c'est son image. |
| **2.3** | `script.js:129`, `battle.js:523` | « On ne le combat pas contre lui, mais pour lui » ; « On ne l'a pas combattu contre lui, mais pour lui » | « Ce n'est pas lui qu'on combat : c'est ce qu'il regarde. » ; « Ce n'est pas lui qu'on a combattu : c'est ce qu'il regardait. » | « Le » (la chimère, au féminin désormais) et « lui » (l'homme) se confondent. Voir aussi 1.6. |
| **2.4** | `ui.js:577` (aide, Combat) | « seulement des chimères : les idoles que les cœurs fabriquent ensemble » | « seulement des chimères, ce que les cœurs fabriquent ensemble ; la plus enracinée est une idole » | Les degrés du mal distinguent la chimère et l'idole ; l'aide les confond. |
| **2.5** | `battle.js:523`, `mal.js:97`, `oeuvres.js:177`, `script.js:148` | « Sagesse acquise : +{n} » | « Expérience : +{n} » | On ne gagne pas la sagesse en gagnant un combat. Le jeu dit ailleurs « Le râwî gagne en expérience », et « le sage » est l'une des trois conduites (3). |
| **2.6** | `ui.js:422`, `rangs.js:98` | « Ce que ce règne a bâti » ; « un Savoir plus haut dans ce règne » | « Ce que ce maillon a bâti » ; « dans ce maillon » | Un califat n'est pas un règne (*khilâfa* et *mulk*). La saga de Khâlid n'est le règne de personne. |
| **2.7** | `saga_abubakr.js:15`, `saga_umar.js:14`, `saga_khalid.js:18`, `saga_uthman.js:12`, `saga_ali.js:15` | « Saga I · Le Véridique » ; « Saga II · Al-Fârûq » ; « Le Sabre dégainé » ; « Le Généreux · 23–35 H » ; « Cinquième maillon · La Porte du Savoir » | « Premier maillon · As-Siddîq » ; « Deuxième maillon · Al-Fârûq » ; « Troisième maillon · Le Sabre dégainé » ; « Quatrième maillon · … » ; « Cinquième maillon · … » | Cinq cartons, cinq formes. Abû Bakr est « As-Siddîq » en titre et « Le Véridique » sur son carton. Pour 'Uthmân et 'Alî, le titre que vous retiendrez. |
| **2.8** | `saga_umar` (« de Shâm » ×12), `saga_uthman` (« du Shâm » ×17), `saga_khalid`, `saga_abubakr`, `saga_ali` (« Syrie » ×29) ; `saga_umar.js:777` | « prend la route de Shâm », « gouverneur du Shâm », « les émirs de Syrie » ; « l'empire des Chosroès » (contre « Kisrâ » ×13) | « le Shâm » partout, avec l'article ; « la Syrie » seulement dans un codex qui explique (« le Shâm, la Syrie d'aujourd'hui et ses voisins ») ; « l'empire de Kisrâ » | Un même lieu, trois formes. Un même roi, deux noms. |
| **2.9** | `frame.js:250`, `253` | « un opérateur de garde » ; « L'opérateur de nuit » | « L'opérateur de garde », partout | Un même personnage, deux noms. |
| **2.10** | `frame.js:115`, `298` | « J'ai été l'Aigle et le Trône. » | « J'ai été l'Aigle d'airain et le Trône. » | L'Aigle est aussi une bête amie du groupe (1.4). L'idole de 'Umar s'appelle l'Aigle d'Airain. |
| **2.11** | `frame.js:120`, `307` | « Chacune des six Lumières est pour lui une faille » ; « Les six Lumières sont ses failles » | « Les cinq Lumières, et la Patience de qui transmet, sont ses failles. » | Le joueur vient de lire « Que fait Idris des cinq Lumières ? » : la sixième n'est expliquée qu'au recueil. |
| **2.12** | `frame.js:36` | « Largesse du Généreux · La Lumière de 'Uthmân : soigne tout le groupe » | « Miséricorde de … » (avec le titre retenu pour 'Uthmân) | La Lumière de 'Uthmân est la Miséricorde (recueil, fin de saga). La Largesse est la lame contre l'avarice. |
| **2.13** | `saga_ali.js:19`, `914` | « celui qui excommunie » ; « Qui excommunie mérite de l'être » | « celui qui déclare les autres hors de la foi » ; « Qui exclut les autres de la foi mérite d'en être exclu » | « Excommunier » est un mot de l'Église pour dire le *takfîr*. « Anathème », nom de deux compétences, peut rester : le mot est devenu courant. |
| **2.14** | `frame.js:79` (la Marque) | « Un signe qui promet d'être quelqu'un à qui l'arbore. » | « Un signe qui promet à qui l'arbore d'être quelqu'un. » | L'ordre des mots égare la lecture. |
| **2.15** | `frame.js:99` (l'Applaudissement) | « Il ne tient debout que celui qui l'écoute. » | « Il ne soutient que celui qui l'écoute. » | On peut lire le « il » comme impersonnel ; la phrase se lit à l'envers. |
| **2.16** | `caid.js:135` | « La loi de la citadelle punit de mort la sentinelle endormie ; elle ne disait rien de celui qui l'épuise » | « … punissait de mort … ne disait rien de celui qui l'épuisait » | Le présent et l'imparfait se mêlent. |
| **2.17** | `perso.js:43` | « Ce Nom n'appartient qu'à Dieu. » | « Ce Nom n'appartient qu'à Allah. » | Partout ailleurs, le jeu écrit « Allah ». Le cas des Purs est déjà proposé ; celui-ci ne l'était pas. |
| **2.18** | `coeur.js:72` (leçon de la garde) | « ◂ ▸ en dépensent jusqu'à trois pour frapper plus fort » | « avec ◂ ▸, on en dépense jusqu'à trois pour frapper plus fort » | Ce sont les touches qui « dépensent ». |
| **2.19** | `saga_umar.js:310`, `313`, `316` | source : « Lecture noosphérique du jeu » | « Image du jeu » | C'est la formule des autres entrées, et l'adjectif est lourd. |
| **2.20** | `rangs.js:98` | « Les vertus — Lumières du groupe : {…} » | « Vertus du groupe : {…} » | Ici, « Lumières » désigne les vertus des combattants, pas les Lumières de la Chaîne. |
| **2.21** | `world.js:270` | titre « Isnâd sahîh » quand le joueur n'a manqué aucun acte | « Chaîne fidèle » | *Isnâd ṣaḥîḥ* est le jugement des savants sur une chaîne réelle. En faire le titre d'une partie bien jouée le change en score. |
| **2.22** | `frame.js:15`, `152`, `163`, `224`, `239`, `749`, `756` ; `ui.js:286` | « 1508 H · 2084 » | « 1507 H · 2084 », ou garder 1508 et placer l'histoire à l'automne | D'après le calendrier d'Umm al-Qurâ, 1508 ne commence que vers le 2 septembre 2084 ; l'année 2084 est surtout 1507. |
| **2.23** | `ui.js:286` | « Le Cœur de l'Agrégor · cyberpunk » | « Le Cœur de l'Agrégor · 2084 » | Une étiquette de genre en anglais, sur l'écran de la Chaîne. |
| **2.24** | `frame.js` (« 'Umar » écrit avec ’, 25 fois), `ui.js` ; cartons de dates | « ’Umar » ici, « 'Umar » ailleurs ; « An 23 H · 644 » et « An 36 de l'Hégire » | Un seul signe pour le *'ayn*, celui des sagas ; « de l'Hégire » sur les cartons | Le même nom s'affiche de deux façons. |
| **2.25** | `defs.js:391` | « Sol à étoiles » | « Dallage étoilé » | Plus juste, et c'est ce que dit la description (« Dallage géométrique »). |

---

## 3. Le mot qui désigne les trois postures

**Ce que dit l'exigence 24.** On *prend* une manière, on ne la possède pas, et aucun texte ne dit de quelqu'un qu'il
*est* un héros, un sage ou un saint.

**Pourquoi pas « titre ».** Un titre dit exactement cela : il se porte, et il dit ce qu'on est. « 'Uthmân, saint »
deviendrait une canonisation à la manière de l'Église, que l'islam ne connaît pas. Et le jeu combat lui-même ce titre-là :
« l'Idole du Héros » est la statue que Khâlid doit vaincre (`saga_khalid.js`), et l'Agrégor dit « J'ai été le Héros ».

**Pourquoi pas « posture » non plus.** Vous avez raison d'en douter. En français d'aujourd'hui, « c'est une posture »
veut dire « c'est une pose, une attitude affichée pour la galerie ». C'est l'ostentation, le mal que le jeu combat.

**Les candidats.**

| Mot | Pour | Contre |
|---|---|---|
| **voie** (« la voie du héros ») | On la prend, on la quitte, on en change. | En français musulman, « la voie » est la *ṭarîqa*, la confrérie, et chez Guénon la « voie initiatique » : c'est l'ésotérisme qu'on veut éviter. Le jeu a déjà `D.VOIES` (dire vrai, expliquer, rassurer). |
| **modèle** (« suivre le modèle du sage ») | Dit bien qu'on imite sans devenir. | C'est le mot même de l'auteur que l'exigence 24 interdit de reprendre (*Vorbild*). Et en français musulman, « le modèle » (*uswa*, 33:21) est le Prophète ﷺ : mettre « le héros » à côté gênerait. |
| **attitude** (« prendre une attitude ») | Léger, naturel. | C'est presque un synonyme de « posture », avec le même soupçon de pose (« quelle attitude ! »), et le jeu emploie déjà le mot pour le corps (`D.POSES`). |
| **conduite** (« se conduire en héros ») | Le mot de la morale, sans mystique. Le français dit déjà « se conduire en héros », « agir en sage », « vivre en saint » : *en* dit la manière, pas l'identité. C'est exactement l'exigence 24. Féminin comme « posture » : aucun accord à reprendre. | « Conduites », comme titre de menu, est un peu inhabituel ; on peut dire « La conduite de chacun ». |

**Recommandation : « conduite ».** En combat, la mention courte placée à côté du nom (aujourd'hui « héros », « sage »,
« saint », qui se lisent comme des titres, D172) devient « en héros », « en sage », « en saint ». Les trois noms ne
changent pas.

Comment cela se lit dans le jeu :
- recueil, « Les trois conduites » : « Devant l'épreuve, on peut se conduire de trois manières. Le héros s'expose : il va
  au-devant, et prend sur lui. Le sage discerne : il regarde avant d'agir. Le saint s'efface : il porte les autres. […]
  Aucune n'est au-dessus d'une autre, et le jeu ne dit de personne qu'il est l'un des trois : on se conduit en héros, on
  ne l'est pas pour autant. Image du jeu. » ;
- leçon, quand l'outil arrive (`D.OUTILS`) : « Choisir sa conduite » ; puis « Une autre conduite s'ouvre à 'Umar.
  *Halte*, puis *Conduites*. » ;
- page de la halte et préparation d'une bataille : « Khâlid : **en héros** (une autre conduite s'ouvre au niveau 4) ».
  En combat : « 'Uthmân · en saint ».

**Coût.** Une dizaine de textes (`coeur.js`, `postures`, codex 12 ; `postures.js` ; `ui.js`, l'aide et le menu ;
`D.OUTILS.postures` ; les trois `court` de `D.POSTURES`). Les clés internes (`postures`, `D.POSTURES`) peuvent rester. Les
autres langues ont choisi leur mot à la source (*stance* en anglais, وقفة en arabe) et n'ont pas à suivre.
