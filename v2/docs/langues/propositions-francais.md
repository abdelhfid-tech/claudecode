# Propositions pour le français

*Proposées par l'agent le 18 novembre, à la demande du décideur (« tu peux d'ailleurs proposer d'autres termes pour
corriger le français »). Rien n'est changé dans le jeu tant que le décideur n'a pas tranché, terme par terme.*

Elles viennent du travail des langues : en cherchant chaque notion à sa source, en arabe, en anglais et en japonais, les
glossaires (`ar.md`, `en.md`, `ja.md`) et le registre des sources (`v2/docs/sources/`) ont montré des endroits où le
français est moins juste que ce qu'on écrit dans les autres langues, ou plus exposé au regard des exigences. Le nombre
entre parenthèses dit combien de fois le terme revient dans le jeu : c'est le coût du changement.

Les parties 5 à 10 viennent de l'écriture du japonais. La partie 11 ajoute ce qu'a relevé l'écriture de l'arabe (sagas,
histoire de 2084, veillées), rangé du plus grave au plus léger, avec une décision par point.

## 1. Ce qui touche les exigences (à trancher en premier)

| Aujourd'hui | Proposition | Pourquoi |
|---|---|---|
| **Al-Kadhdhâb — le Menteur**, l'idole de la saga d'Abû Bakr (5) | **Le Faussaire** | En arabe, *al-Kadhdhâb* est le surnom de Musaylima : un homme de l'histoire. L'exigence 6 interdit qu'un ennemi soit une personne. Le glossaire arabe a retenu المزيّف (« le falsificateur »). |
| **Dhû l-Fiqâr**, une compétence de 'Alî (1) | un nom qui dit le geste, sans nom d'arme : *Le Tranchant du droit*, par exemple | C'est le sabre historique du Prophète ﷺ et de 'Alî (exigence 17 : ni arme d'un personnage de l'histoire), et son récit diffère selon les sunnites et les chiites (exigence 5). |
| **Haydar**, la grande action de 'Alî (1) | un nom qui dit l'acte : *Tenir jusqu'au bout*, par exemple | Ce surnom est aujourd'hui surtout employé dans le discours chiite (exigence 5). |
| **Waswâs**, une altération de combat (2) | **Trouble** | Depuis D182, le mot *waswâs* est réservé aux souffleurs, qui ne se combattent jamais. Un égrégore qui l'inflige ferait de lui un souffleur (exigence 18). |
| **Siwâk : « Accorde 2 points de Niyya »**, un objet de la besace (1) | *Rend un peu de Souffle* | Un objet qui donne de l'intention prête une vertu à un objet (exigence 17). Un effet matériel (le souffle) suffit. |

## 2. Les titres des Compagnons

| Aujourd'hui | Proposition | Pourquoi |
|---|---|---|
| 'Uthmân, **Le Généreux** (4) | **Dhû n-Nûrayn**, « l'homme aux deux lumières » | C'est le surnom que les sources lui donnent. Et en arabe, *al-Karîm*, « le Généreux », est un Nom divin : il faudrait l'éviter dans un titre. |
| 'Alî, **La Porte du Savoir** (6) | **Celui qui juge le mieux** | « La Porte du Savoir » vient d'un hadith dont l'authenticité est discutée. La parole de 'Umar, « Le meilleur juge d'entre nous est 'Alî » (al-Bukhârî 4481), est sûre, et le registre la contient déjà (`saga_ali.json`). La Lumière de la saga reste le Savoir. |

## 3. Les mots du jeu

| Aujourd'hui | Proposition | Pourquoi |
|---|---|---|
| **égrégore** (127) | **mirage**, à défaut le garder | En français comme en anglais, « égrégore » est un mot de l'ésotérisme. « Mirage » dit exactement ce que fait le jeu : on approche, on dévoile, il n'y a rien. Le Coran prend l'image du mirage pour les œuvres vaines, en 24:39, *à relever dans le registre avant toute citation*. L'arabe a retenu خيال (« l'ombre », celle du théâtre d'ombres). C'est le changement le plus coûteux. |
| **organigramme du mal** (27) | **les degrés du mal** | « Organigramme » est un mot d'entreprise. Les degrés sont l'image classique (مراتب), et le glossaire arabe a retenu مراتب الشر. |
| **idées noires** (51) | les garder | Le mot est juste en français. On peut ajouter au recueil qu'al-Ghazâlî les appelle des « pensées qui passent » (*khawâṭir*), comme le fait l'arabe (D182). |
| **le héros, le sage, le saint** (postures) | **l'élan, le discernement, le don de soi** | Ces mots nomment l'acte, comme leurs devises le font déjà (« Il s'expose », « Il discerne », « Il s'efface »), et comme l'arabe (الإقدام، البصيرة، الإيثار). L'exigence 24 dit que personne n'*est* un héros, un sage ou un saint, et « saint » est un mot chrétien en français. *Ce sont vos mots du 16 novembre : à garder si vous y tenez.* |
| les lames **La Largesse (al-Karam)** et **La Bienveillance (an-Nasîha)** | les noms français restent ; seul le mot arabe affiché change : *as-Sakhâ'* et *salâmat aṣ-ṣadr* | *Al-Karam* est proche du Nom divin *al-Karîm*. *An-Nasîha* se lit aujourd'hui « le conseil » ; *salâmat aṣ-ṣadr*, « le cœur sans rancune », est le remède classique de l'envie. |

## 4. Les paroles citées : 41 écarts avec leurs sources

Le registre (`v2/docs/sources/*.json`, champ `ecart`) décrit chaque écart. Les plus sérieux :

1. **Saga d'Abû Bakr, ligne 782.** « Rengaine ton sabre, et ne nous afflige pas de ta perte » est donnée comme une
   parole de 'Alî. Chez Ibn Kathîr, c'est une parole du Prophète ﷺ que 'Alî cite (« je te dis ce qu'a dit le Messager
   d'Allah ﷺ le jour d'Uhud »), et le récit est qualifié de *gharîb*. **Proposition** : écrire la parole comme ce
   qu'elle est (« 'Alî rappelle une parole du Prophète ﷺ… »), ou la retirer.
2. **Saga d'Abû Bakr, ligne 863, et saga de 'Umar, ligne 377.** La source nommée en premier ne contient pas la parole.
   **Proposition** : nommer l'ouvrage où elle est (al-Istî'âb pour la première ; at-Tabarî seul pour la seconde).
3. **Saga de 'Uthmân, ligne 834.** Deux récits sont réunis en une seule parole, dont l'un a une chaîne jugée faible.
   **Proposition** : ne garder que la première phrase, avec sa vraie source.
4. **Histoire-cadre, ligne 134.** La sourate 106 ne nomme ni le Yémen ni le Shâm. **Proposition** : « le Coran nomme le
   voyage d'hiver et celui d'été ; les commentateurs les situent au Yémen et au Shâm ».

Pour les 37 autres (mots ajoutés, coupes non marquées, un singulier pour un pluriel…), je peux écrire, parole par
parole, un français fidèle au texte arabe relevé, à valider ensuite par vous et par un spécialiste.

## 5. Relevé en écrivant le japonais (cœur)

- **Recueil, l'entrée sur Iblîs, et l'organigramme du mal** : le jeu prête à Iblîs les mots de 14:22 et dit que le
  Coran l'appelle « un ennemi déclaré » (2:168). Ces deux versets disent *ash-shaytân*, pas le nom d'Iblîs (le registre
  le note). **Proposition** : « le Shaytân » dans ces deux phrases, ou dire que les commentateurs l'identifient à Iblîs.
- **Compagnon de lumière, l'Aigle** : « l'étoile qui se lève plein est » — Altaïr se lève un peu au nord de l'est.
  **Proposition** : « qui se lève à l'est ».

## 6. Relevé en écrivant le japonais (veillées) : l'exigence 2, « aucun texte ne décrit de traits physiques »

- L'intro des Purs : « des visages maigres » — le cas le plus net. **Proposition** : « des hommes amaigris par le jeûne »
  ou « des hommes durs », selon ce que la scène veut dire.
- Meksa : « Par ma barbe » ; et deux tournures plus légères, « sans un pli sur le visage », « Tu as mauvaise mine ».
  **Proposition** : « Sur mon honneur », « sans broncher », « Tu sembles las ».
- Le slogan des Purs écrit « Dieu » (« La citadelle n'appartient qu'à Dieu ») quand tout le jeu écrit « Allah ».

## 7. Relevé en écrivant le japonais (histoire de 2084)

- **Exigence 14, à revoir en priorité.** Quatre répliques de la Cité-Miroir suivent de près des épisodes du conte qui
  inspire les types de 2084 — ce que l'exigence interdit (« ni phrase, ni image, ni nom, ni épisode ») :
  - le défileur (« pour oublier » / « oublier quoi ? » / la honte) reprend le dialogue du buveur ;
  - le Régent (« Sois mon ministre… je te nomme ») reprend le roi qui nomme son visiteur ;
  - le Cartographe (« Un savant ne se déplace pas ») reprend le géographe ;
  - « Ne me dérange pas. Je compte » reprend le businessman.
  **Proposition** : réécrire ces quatre échanges pour que le type reste (celui qui oublie, celui qui règne sur
  personne, celui qui sait sans aller voir, celui qui compte) sans le tour de phrase ni l'enchaînement du conte.
- **Trois paroles du recueil sans place dans le registre** : celle d'ʿAbdallâh ibn al-Mubârak (« L'isnâd »), « Ô Bilâl,
  repose-nous par elle » (Abû Dâwûd ; le français omet « établis la prière »), et la promesse rapportée par Khabbâb (de
  San'â' au Hadramawt, aussi dans le négoce). **Proposition** : les relever à leur source, comme les autres paroles.

## 8. Relevé en écrivant le japonais (saga d'Abû Bakr)

- **Une même ligne de source pour deux paroles** : « 'Umar ibn al-Khattâb — al-Bukhârî, as-Sahîh » sert à la parole de
  la mort du Prophète ﷺ (n° 4454) et à celle de la Saqîfa (n° 6830). Une même ligne n'ayant qu'une clé, les autres
  langues ne peuvent donner qu'un numéro. **Proposition** : écrire le numéro dans chacune des deux lignes françaises.
- **« Les dix consignes »** (recueil) n'en énumère que huit. **Proposition** : relever les dix à la source, ou dire
  « les consignes ».
- **« ses joues sont mouillées »** décrit le visage d'un Compagnon (exigence 2). **Proposition** : « il pleure ».
- **L'idole et l'homme** : « le Menteur » désigne à la fois l'idole et Musaylima (« le Menteur tombe »). Avec le
  Faussaire pour l'idole (§ 1), l'homme garderait son nom.
- **Une dizaine de paroles rapportées hors des cartons** (narration, recueil, compétences) n'ont pas de place dans le
  registre : Abû 'Ubayda « homme de confiance », « Ô Bilâl… », « prise à leurs riches… », « Nous cherchons refuge… »,
  la remarque d'Ibn 'Abbâs, « Il ne laissa pas un mot… », les paroles de Yamâma, « Le Messager ﷺ l'a nommé… », les
  consignes, « Je ne dénouerai pas un étendard qu'il a noué ». **Proposition** : les relever à leur source.

## 9. Relevé en écrivant le japonais (saga de Khâlid)

- **Exigence 19** : juste après la bataille déclarée du Yarmoûk, une narration dit « 'Ikrima ibn Abî Jahl et quatre cents
  hommes » ; ailleurs, « plus de cent mille Romains » (recueil), « trois cents et quelques » et « une centaine d'hommes de
  Badr » (le vétéran). **Proposition** : « 'Ikrima ibn Abî Jahl et les siens » près de la bataille déclarée ; les
  autres nombres, attestés, à garder ou non selon votre lecture de l'exigence.
- **Le nom du personnage d'al-Hîra** : chez at-Tabarî, la réponse sur les forteresses est celle de 'Abd al-Masîh ibn
  'Amr ibn Buqayla ; le jeu le nomme « 'Amr ibn 'Abd al-Masîh » (le registre le note). **Proposition** : lui rendre son
  nom.

## 10. Relevé en écrivant le japonais (saga de 'Umar)

- **« Ghânim serre ses clés »** (l'idée noire d'un pourparler) : partout ailleurs, le marchand est Abû Ghânim.
  **Proposition** : « Abû Ghânim serre ses clés ».
- **Surâqa** : le personnage est dit « fils de Mâlik », sa parole citée (al-Bayhaqî) dit « fils de Ju'shum », dans la même
  scène (le registre le note). **Proposition** : suivre la source de la parole, ou nommer Surâqa sans filiation.
- **Les formules après un Compagnon** : le recueil de cette saga écrit « (qu'Allah l'agrée) » et « (qu'Allah lui fasse
  miséricorde) », les autres non. **Proposition** : une règle unique, que vous fixerez (point 1 des trois glossaires).

## 11. Relevé en écrivant l'arabe

*Relevé par l'agent le 18 novembre au soir. L'arabe a été écrit récit par récit (les cinq sagas, l'histoire de 2084, les
veillées), relu deux fois (la fidélité aux sources, puis la langue), puis harmonisé. Rédacteurs et relecteurs ont laissé
262 remarques. Ne restent ici que celles qui touchent au français, fusionnées : un point par problème, avec ceux qui
l'ont vu (le rédacteur du récit, le relecteur de la fidélité, celui de la langue, l'agent qui a harmonisé l'arabe, celui
du lexique commun). Les lignes sont celles du dépôt au commit `4dda814` ; les récits n'ont pas changé depuis.*

Ce que ce document ou `relecture-francais.md` disent déjà n'est pas réécrit : on y renvoie, avec ce que l'arabe ajoute.
Les hésitations qui ne portent que sur l'arabe (un mot, une tournure) sont dans `ar.md`, § 6. Quatre d'entre elles vous
reviennent, marquées « Au décideur » : « Mille lectures », « la halle », le feuillet sur la noosphère et « Ni poison ni
sortilège ». L'arabe n'a rien corrigé à la place du français : quand il s'en écarte, c'est pour suivre sa source ou une
exigence, et chaque point le dit. Si vous gardez le français, l'arabe s'y aligne. Pour répondre : « oui à 11.c9 »,
« non à 11.b2 ».

### a. Ce qui touche une exigence

- **a1. « Harûriyya, puis Khawârij »** (`saga_ali.js:251`, feuillet « Le débat de Harûrâ' »). Exigences 5 et 6. Le
  français nomme ces deux partis pour expliquer leur nom : « on les appellera Harûriyya, puis Khawârij, « ceux qui sont
  sortis » ». Le glossaire arabe s'interdit ces noms de parti, qui sont aussi des injures, pour désigner des hommes
  (`ar.md`, § 2.2 et § 2.10). L'arabe garde le fait sans les mots : « فنُسبوا بعدُ إلى حروراء، ثم سُمّوا باسمٍ مأخوذٍ
  من خروجهم » (« on les rattacha ensuite à Harûrâ', puis on leur donna un nom tiré de leur sortie »). Vu par le
  rédacteur, les deux relecteurs et l'harmonisation. **Décision** : garder les deux noms en français (l'arabe les écrira alors dans ce seul feuillet),
  ou les retirer du français, comme l'arabe ?
- **a2. « marqués par les prosternations »** (`saga_ali.js:581`, à Harûrâ'). Exigence 2 : « aucun texte ne décrit de
  traits physiques, pour personne ». La marque de la prosternation est une marque sur le corps. L'arabe écrit « قد
  أضنتهم السجدات » (« les prosternations les avaient usés »). Vu par le relecteur de la fidélité. La parole d'Ibn 'Abbâs
  qui ouvre la phrase n'a pas pu être lue à la source (voir e, « Non lues à la source »). **Proposition** : « usés par
  les prosternations, épuisés par les veilles ». *Vu en vérifiant ce point :* si vous retenez cette raison, elle vaut
  aussi pour Khâlid à Homs, « les poignets encore marqués par son propre turban » (`saga_khalid.js:842`), que les trois
  langues suivent (« ومعصماه لا يزالان يحملان أثر عمامته », « ses poignets portent encore la trace de son turban »).
- **a3. « Brûlez les livres »** (`caid.js:121`, la chimère du Pur, qui gagne alors la compétence « Bûcher »,
  `caid.js:122`). Exigences 3 et 5. Un lecteur arabe peut y entendre le récit, tardif et tenu pour légendaire, de la
  bibliothèque d'Alexandrie brûlée sur un ordre prêté à 'Umar. Le relecteur de la fidélité ne l'a pas vérifié ; l'arabe
  ne reprend aucun mot de ce récit. **Décision** : garder la réplique, ou retirer l'image des livres brûlés ?

**Déjà proposé : ce que l'arabe ajoute.**

- Les visages des veillées (§ 6) : « des visages maigres » (`caid.js:730`), « sans un pli sur le visage »
  (`caid.js:187`), « Tu as mauvaise mine » (`caid.js:582`). L'arabe les a contournés : « رجالٌ خِفافُ الزاد » (« des
  hommes au bagage léger »), « ثابتَ الصوت، لا يتردّد » (« d'une voix ferme, sans hésiter »), « أراك متعبًا » (« je te
  vois las »). Le japonais les garde (« やせた顔 », « 眉ひとつ動かさず », « お顔の色が優れませんね ») : tant que le
  français ne change pas, les langues ne disent pas la même chose. Vu par le rédacteur et les deux relecteurs.
- « Par ma barbe, tu le ferais » (`caid.js:361`, § 6). Le rédacteur et les deux relecteurs ajoutent une raison : c'est
  aussi un serment par autre chose qu'Allah, qui choquerait un lecteur musulman. L'arabe a écrit « إنك لفاعل. أي والله،
  إنك لفاعل » (« Tu le ferais. Oui, par Allah, tu le ferais ») : il met le nom d'Allah là où le français n'en met pas. Le
  relecteur de la fidélité propose aussi « أُقسم إنك لفاعل » (« je le jure : tu le ferais »). Le japonais garde la
  barbe (« このひげにかけて »). « Sur mon honneur » (§ 6) réglerait les trois langues. Un autre serment est en h1.
- « ses joues sont mouillées » (`saga_abubakr.js:373`, § 8). L'arabe suit encore le français (« بلّل الدمعُ خدّيه »,
  « les larmes mouillèrent ses joues ») ; le relecteur de la fidélité propose « وقد بكى » (« il avait pleuré »), comme
  « il pleure » au § 8.
- Le Menteur (§ 1 et § 8). L'arabe distingue déjà l'idole, « المُزيِّف » (le Faussaire), et l'homme, « الكذّاب », le
  surnom de Musaylima. Une phrase reste douteuse : « Mais le Menteur ne tient pas par le fer : il tient par ce que des
  milliers de cœurs veulent entendre » (`saga_abubakr.js:834`). L'arabe y a mis l'homme ; si le français parle de
  l'idole, il faut « المُزيِّف ». Vu par le relecteur de la langue. **Décision** : dans cette phrase, « le Menteur »
  est-il Musaylima, ou l'idole ?
- Dhû l-Fiqâr et Haydar (`saga_ali.js:46` et `59`, § 1) : l'arabe les écrit comme le français (« ذو الفَقار »,
  « حيدرة »), en attendant votre décision.

### b. Une parole prêtée à quelqu'un d'autre, ou une source qui ne la contient pas

- **b1. Maître Yûnus prête à 'Umar une maxime d'Abû Bakr** (`frame.js:293`). Le français : « 'Umar pesait autrement : le
  fort était faible devant lui jusqu'à ce qu'il ait rendu le droit. » C'est la phrase du discours d'investiture d'Abû
  Bakr : Ibn Hishâm, as-Sîra (éd. as-Saqqâ, t. 2 p. 661), « وَالْقَوِيُّ فِيكُمْ ضَعِيفٌ عِنْدِي حَتَّى آخُذَ الْحَقَّ
  مِنْهُ » (« le fort parmi vous est faible auprès de moi, jusqu'à ce que je prenne de lui le droit »), et at-Tabarî,
  vol. 3. Le relecteur de la fidélité ne l'a pas trouvée, dite de 'Umar, dans les volumes 3 et 4 d'at-Tabarî. Le jeu la
  cite lui-même dans la bouche d'Abû Bakr (`saga_abubakr.js:488`). Elle n'est pas donnée comme une citation, et l'arabe
  garde le sens sans les mots du discours (« القويّ ضعيفٌ بين يديه حتى يؤدّي الحقّ », « le fort est faible devant lui,
  jusqu'à ce qu'il rende le droit »), mais un lecteur arabe y reconnaîtra Abû Bakr. Vu par le rédacteur, le relecteur
  de la fidélité et l'harmonisation. **Proposition** : « 'Umar pesait autrement : le fort et le
  faible sur la même balance », les mots que le jeu donne déjà à 'Umar (`caid.js:405` ; « la même balance pour tous »,
  `frame.js:34`).
- **b2. Al-Hîra : deux récits en une scène** (`saga_khalid.js:364` à `370`). Le nom de l'homme est au § 9. L'arabe
  ajoute ceci : chez at-Tabarî, la question « Êtes-vous des Arabes, ou des gens de cette terre ? » est posée à un autre
  homme, 'Adî ibn 'Adî, dans le récit de Sayf, qui répond « بل عرب عاربة وأخرى متعربة » (« des Arabes de souche, et
  d'autres qui se sont faits Arabes »). La réponse du français ressemble à une autre formule, « عرب استنبطنا ونبط
  استعربنا » (« des Arabes devenus gens de la terre, et des gens de la terre devenus Arabes »), que le rédacteur n'a pas
  trouvée chez at-Tabarî. L'échange sur les forteresses vient du récit de Hishâm, avec 'Abd al-Masîh ibn 'Amr ibn
  Buqayla. Vu par le rédacteur et le relecteur de la fidélité. **Décision** : si vous rendez son nom à l'homme (§ 9),
  garder le premier échange, ou ne lui laisser que celui des forteresses, qui est le sien ?
- **b3. « Indique-moi le marché »** (`saga_umar.js:255`, feuillet de 'Abd ar-Rahmân ibn 'Awf ; source, ligne 256 :
  « al-Bukhârî, Sahîh (2048, 3700) »). Ces mots sont ceux du n° 2049, « دُلُّونِي عَلَى السُّوقِ » (« indiquez-moi le
  marché »). Le n° 2048, que la source nomme, dit « هَلْ مِنْ سُوقٍ فِيهِ تِجَارَةٌ » (« y a-t-il un marché où l'on
  commerce ? »). L'arabe cite le n° 2048. Vu par le rédacteur et les deux relecteurs. Ils ne donnent pas la même forme
  du n° 2049 : le rédacteur l'écrit au pluriel, « indiquez-moi », comme ci-dessus, le relecteur de la langue au
  singulier, « دُلَّنِي », comme le français ; elle est à relire avant d'être citée. **Décision** : écrire 2049 dans la
  source, ou garder 2048 et sa phrase ?
- **b4. « La voix d'al-Qa'qâ' dans l'armée vaut mieux que mille hommes »** (`saga_khalid.js:235`, source : « at-Tabarî,
  Târîkh (d'après Sayf ibn 'Umar) ; Ibn Hajar, al-Isâba »). Chez at-Tabarî (t. 3), Abû Bakr dit autre chose : « لا يهزم
  جيش فيهم مثل هذا » (« une armée qui compte un tel homme ne sera pas vaincue »). La phrase du français est chez Ibn
  Hajar, al-Isâba (n° 7142), introduite par « قيل » (« on dit ») : le « on rapporte » du français convient. Vu par le
  rédacteur et le relecteur de la fidélité. **Décision** : garder, ou nommer al-Isâba pour la parole et at-Tabarî pour le
  reste ?
- **b5. « Je ne dénouerai pas un étendard qu'il a noué »** (`saga_abubakr.js:52`, compétence « Fermeté »). Déjà au § 8,
  parmi les paroles à relever. L'arabe ajoute que cette forme n'est pas dans at-Tabarî, vol. 3, qui donne pour l'armée
  d'Usâma : « لو خطفتني الكلاب والذئاب لم أردّ قضاءً قضى به رسول الله ﷺ » (« quand les chiens et les loups
  m'emporteraient, je ne reviendrais pas sur une décision du Messager d'Allah ﷺ »). L'arabe la rend en substance, sans
  guillemets. Vu par le rédacteur et le relecteur de la fidélité. **Décision** : garder les guillemets, ou dire la
  parole en substance, comme l'arabe, tant que sa source n'est pas trouvée ?
- **b6. Les tribus devant l'armée d'Usâma** (`saga_abubakr.js:722`). Le français : « Si ces gens étaient faibles, ils
  n'auraient pas envoyé pareille armée. » Le rédacteur ne l'a pas trouvée dans at-Tabarî, vol. 3 ; l'arabe la rapporte
  au discours indirect, sans guillemets. Vu par le rédacteur. **Décision** : garder les guillemets, ou écrire : « Les
  tribus s'étaient dit que des gens faibles n'auraient pas envoyé pareille armée » ?
- **b7. « en exigeant des témoins »** (`saga_abubakr.js:272`, feuillet « Le rassemblement du Coran », source :
  « al-Bukhârî, as-Sahîh (récit de Zayd ibn Thâbit) »). Le rédacteur ne trouve pas ce détail dans le n° 4986. La
  narration du chapitre 3 le donne avec réserve (« rapporte-t-on », `saga_abubakr.js:883`) ; le feuillet, sans réserve.
  Vu par le rédacteur. **Proposition** : « …et dans la mémoire des hommes ; on rapporte qu'il exigeait des témoins. »
- **b8. « Ô mushaf, parle aux gens ! »** (`saga_ali.js:278`, source : « Ahmad, al-Musnad ; at-Tabarî, Târîkh »). Le
  récit est bien chez Ahmad (n° 656) ; le rédacteur ne l'a pas trouvé chez at-Tabarî (tome 5, années 37 à 40, édition
  de Wikisource). Vu par le rédacteur. **Décision** : garder at-Tabarî, ou ne nommer qu'Ahmad ?
- **b9. Le fils de Khabbâb** (`saga_ali.js:286`, et les répliques `758` et `880`). Chez at-Tabarî, que la source nomme,
  'Abdallâh ibn Khabbâb transmet un autre hadith : « une discorde où le cœur de l'homme meurt comme meurt son
  corps… ». La version du français (« celui qui reste assis vaudra mieux que celui qui se tient debout ») n'a pas été
  relue chez Ahmad ni chez Ibn Abî Shayba. L'arabe la donne en substance. Vu par le rédacteur. **Décision** : garder, ou
  retirer at-Tabarî de la source ?
- **b10. Abû 'Ubayda, « l'homme de confiance de cette communauté »** (`saga_umar.js:252`, source : « al-Bukhârî,
  Sahîh (3744) »). Les mots du français sont ceux du n° 4382, que suivent les récits d'Abû Bakr et de Khâlid : « لِكُلِّ
  أُمَّةٍ أَمِينٌ، وَأَمِينُ هَذِهِ الأُمَّةِ أَبُو عُبَيْدَةَ بْنُ الْجَرَّاحِ » (« chaque communauté a son homme de
  confiance, et l'homme de confiance de cette communauté est Abû 'Ubayda ibn al-Jarrâh »). Le n° 3744 dit « وَإِنَّ أَمِينَنَا
  أَيَّتُهَا الأُمَّةُ… » (« et notre homme de confiance, ô communauté… »). L'arabe a donc deux formes pour une même phrase
  française. Vu par le rédacteur et le relecteur de la fidélité. **Proposition** : écrire 4382 dans la source du
  feuillet de 'Umar ; l'arabe n'aura plus qu'une forme.
- **b11. 'Adî ibn Hâtim** (`saga_abubakr.js:287`, feuillet des Banû Rimth, source : « at-Tabarî, Târîkh ; Muslim (pour
  'Adî ibn Hâtim) »). Muslim (n° 2523) parle de la zakât des Tayy apportée au Prophète ﷺ lui-même. C'est at-Tabarî qui
  la fait arriver à Médine pendant la Ridda (« وطرقت المدينة صدقات نفر: صفوان، الزبرقان، عدي », « arrivèrent à Médine
  les zakâts de quelques hommes : Safwân, az-Zibriqân, 'Adî »). Rien n'est faux, puisque at-Tabarî est nommé. Vu par le
  relecteur de la fidélité. **Décision** : garder, ou rattacher 'Adî à at-Tabarî dans la source ?

**Déjà proposé.** « La Porte du Savoir » (§ 2) : l'arabe écrit « باب العلم » en attendant. L'autre choix serait
« أقضى الصحابة », tiré de la parole sûre de 'Umar (al-Bukhârî n° 4481), comme « Celui qui juge le mieux » au § 2.

### c. Un fait du français qui s'écarte de sa source

- **c1. 'Uthmân : « nul n'était mort pour le défendre »** (`saga_uthman.js:25`, fin du récit). At-Tabarî (an 35, t. 4)
  rapporte des défenseurs tués à sa porte : al-Mughîra ibn al-Akhnas (« وقال الناس: قتل المغيرة بن الأخنس », « les
  gens dirent : al-Mughîra ibn al-Akhnas a été tué »), et Ziyâd ibn Nu'aym al-Fihrî « في ناس من أصحاب عثمان » (« avec des
  hommes de 'Uthmân »). Le feuillet du même récit dit juste : « il leur interdit de combattre » (`saga_uthman.js:244`).
  L'arabe suit le français. Vu par le rédacteur et le relecteur de la fidélité. **Proposition** : « …il avait gouverné
  douze années, et il avait interdit qu'on se batte pour lui. »
- **c2. Khâlid : « le trouve intègre »** (`saga_khalid.js:871` ; feuillet, `saga_khalid.js:262`). At-Tabarî (an 17,
  t. 4) : « فقوّم عمر عروضه فخرجت إليه عشرون ألفا، فأدخلها بيت المال » (« 'Umar fit estimer ses biens ; il en tira
  vingt mille, qu'il fit entrer au Trésor ») ; Ibn Kathîr parle aussi de vingt mille pris sur son bien. « Intègre » tait
  cette reprise. L'arabe suit le français. Vu par le rédacteur. **Décision** : garder, ou écrire comme at-Tabarî :
  « 'Umar fait estimer ses biens, et en verse vingt mille au Trésor » ?
- **c3. Al-Hurmuzân : la sécurité tenue** (`saga_umar.js:800` et `804`). Le français : « Tu m'as trompé. Mais la sécurité
  prononcée est acquise. » ; « 'Umar s'y tint. » Chez at-Tabarî, Anas témoigne, puis 'Umar dit « خدعتني، والله لا
  أنخدع إلا لمسلم » (« Tu m'as trompé. Par Allah, je ne me laisse tromper que par un musulman » : la ruse ne tiendra que
  s'il devient musulman), et al-Hurmuzân embrasse l'islam. Un autre récit lui prête « لا والله لا أؤمّنك حتى تسلم »
  (« Non, par Allah, je ne t'accorde pas la sécurité tant que tu n'as pas embrassé l'islam »). Le français dit bien
  ensuite qu'il embrassa l'islam (`801`), mais après une sécurité tenue sans condition. L'arabe suit le français. Vu par
  le rédacteur. **Décision** : garder, ou dire comme at-Tabarî que 'Umar ne tint la ruse pour bonne qu'à la condition
  qu'al-Hurmuzân embrasse l'islam ?
- **c4. « deux empires étaient tombés »** (`frame.js:421`, une réponse d'Idris au Régent ; et la devise du récit de
  'Umar, `saga_umar.js:11` : « Deux empires tombèrent sous son califat »). L'empire des Perses tombe sous 'Umar ; celui
  de Rome perd le Shâm et l'Égypte, mais ne tombe pas. L'arabe suit le français, et dans la devise il ajoute même
  « عظيمان » (« deux grands royaumes tombèrent »). Vu par le rédacteur et les deux relecteurs. **Proposition** : « lui
  sous qui la Perse était tombée, et Rome avait reculé » ; « Sous son califat, la Perse tomba et Rome recula. »
- **c5. Le calendrier : la naissance ou la mission ?** (`saga_umar.js:306`, feuillet ; `738` et `747`, le scribe et le
  maître du cercle). Le français : les uns proposèrent la naissance du Prophète ﷺ, les autres sa mort. Chez at-Tabarî
  (t. 2), les propositions sont « من مبعثه » (« depuis sa mission ») et « من وفاته » (« depuis sa mort »). Le rédacteur
  n'y a pas trouvé la naissance, et n'a pas lu Ibn Hajar, que la source nomme aussi. L'arabe suit le français. Vu par
  le rédacteur. **Décision** : garder « la naissance » (si un autre ouvrage de la source la porte), ou écrire « la
  mission », comme at-Tabarî ? Le scribe dit aussi « Ni d'une naissance, ni d'une mort » (`738`).
- **c6. Homs : qui interroge Khâlid ?** (`saga_khalid.js:824` à `839`). Le français fait de Bilâl l'envoyé du calife :
  il porte l'ordre et pose la question. Chez at-Tabarî (t. 4) : « فقام البريد فقال… فقام بلال إليه » (« le courrier se
  leva et dit… puis Bilâl se leva vers lui »). La question est « أمن مالك أجزت بعشرة آلاف أم من إصابة؟ » (« est-ce
  sur ton bien que tu as donné dix mille, ou sur une prise que tu avais faite ? »), là où le français dit « sur le butin
  des musulmans » (`835`). Bilâl finit par « نسمع ونطيع لولاتنا، ونفخّم ونخدم موالينا » (« nous écoutons et obéissons à
  ceux qui nous gouvernent, et nous honorons et servons nos maîtres »), là où le français dit « nous honorons ceux qui
  le méritent » (`838`). Le « J'écoute et j'obéis » de Khâlid (`839`) n'est pas dans ce passage, qui dit : « وأقام خالد
  متحيرا لا يدري أمعزول أم غير معزول » (« Khâlid resta perplexe, ne sachant s'il était destitué ou non »). L'arabe suit
  le français, sauf pour la première moitié de la phrase de Bilâl. Vu par le rédacteur et le relecteur de la fidélité.
  **Décision** : garder la scène, ou la rapprocher d'at-Tabarî ?
- **c7. La lettre de l'Année des cendres** (`saga_umar.js:513`). Le français : « 'Umar écrit aux gouverneurs : « Au
  secours ! Au secours ! » ». Chez Ibn Sa'd, c'est une lettre à 'Amr seul, avec « فيا غوثاه » (« au secours ! ») trois
  fois. Chez at-Tabarî, une lettre à tous les gouverneurs, en d'autres mots (« إلى أمراء الأمصار يستغيثهم », « aux émirs
  des provinces, pour leur demander secours » ; « أغيثوا أهل المدينة ومن حولها », « secourez les gens de Médine et des
  alentours »). L'arabe prend le cri d'Ibn Sa'd, deux fois, et le pluriel du français. Le rédacteur ajoute qu'en arabe,
  « يا غوثاه » pourrait faire penser à un débat entre écoles sur l'appel au secours (exigence 5) ; la phrase d'at-Tabarî
  l'éviterait. Vu par le rédacteur et le relecteur de la fidélité. **Décision** : garder, ou suivre une seule source :
  « 'Umar écrit à 'Amr : « Au secours ! » », ou « 'Umar écrit aux gouverneurs pour leur demander secours » ?
- **c8. « Sept ans plus tôt »** (`saga_abubakr.js:680`, Salmân et le fossé). Le feuillet « Le Fossé », dans le même
  récit, le date de l'an 5 (`saga_abubakr.js:294`), et la scène est de l'an 11 : six ans. Certains datent le Fossé de
  l'an 4, ce qui ferait sept. L'arabe suit le français (« قبل سبع سنين »). Vu par les deux relecteurs.
  **Proposition** : « Six ans plus tôt ».
- **c9. « Le Bouclier et le Juge »** (`saga_ali.js:294` et `350`, titre du chapitre 1). Le chapitre et ses sources
  parlent d'une cuirasse (« درع »), non d'un bouclier (« ترس »). L'arabe écrit « الدرعُ والقاضي ». Vu par le rédacteur
  et les deux relecteurs. **Proposition** : « La Cuirasse et le Juge ».
- **c10. La famille près du feu** (`saga_umar.js:346`, `396` à `409`). Chez at-Tabarî (récit d'Aslam, t. 4), c'est une
  femme avec ses enfants qui parle à 'Umar (« امرأة معها صبيان لها »). Le jeu en fait un « Voyageur », sans doute par
  sobriété (exigence 4) ; l'arabe le suit, au masculin. Trois détails encore : « Des voyageurs, que la nuit et le froid
  ont arrêtés » est une phrase de 'Umar, non d'Aslam (`396`) ; c'est un serviteur de 'Umar (« غلام لعمر ») qui achète le
  beurre et le lait (`373`) ; le serment porte sur « سمنًا ولا لبنًا ولا لحمًا » (« ni beurre, ni lait, ni viande »),
  le lait en plus (`258`, `380`). Vu par le rédacteur. **Décision** : garder le voyageur, ou lui rendre la mère de la
  source ? Et les trois détails ?
- **c11. Le legs de Khâlid** (`saga_khalid.js:35` et `253`). Le français : « son cheval, ses armes et un serviteur,
  qu'il lègue pour la cause d'Allah ». Chez Ibn Kathîr, Nâfi' rapporte « لم يوجد له إلا فرسه وغلامه وسلاحه » (« on ne
  lui trouva que son cheval, son serviteur et ses armes »), et le legs ne nomme que les armes et le cheval : « انظروا
  إلى سلاحي وفرسي فاجعلوه عدة في سبيل الله » (« prenez mes armes et mon cheval, et faites-en un équipement pour la cause
  d'Allah »). Vu par le rédacteur. **Proposition** : « …son cheval, ses armes et un serviteur ; il lègue ses armes et son
  cheval pour la cause d'Allah. »
- **c12. « Les chroniqueurs n'en disent guère plus »** (`saga_uthman.js:639`, la bataille des Mâts). At-Tabarî (an 31)
  en dit bien plus : de lourdes pertes (« قتل يومئذ من المسلمين بشر كثير », « beaucoup de musulmans furent tués ce
  jour-là »), le sang sur l'eau (« الدم لغالب على الماء », « le sang l'emportait sur l'eau »), des corps sur le rivage.
  Ne pas les montrer est voulu (exigence 19) ; la phrase, elle, est inexacte. Vu par le rédacteur. **Proposition** :
  ouvrir la phrase par « La Chaîne n'en montre pas davantage. », à la place de « Les chroniqueurs n'en disent guère plus,
  et la Chaîne ne montre pas ce qu'ils taisent. » ; la suite (« Mais sous les coques… ») ne change pas.
- **c13. « une demeure auprès d'Allah »** (`saga_uthman.js:259`, feuillet « La mosquée agrandie »). Le hadith que cite
  'Uthmân promet une maison au Paradis : Muslim (n° 533) « بنى الله له بيتا في الجنة » (« Allah lui bâtit une maison au
  Paradis ») ; al-Bukhârî n° 450 « مثله في الجنة » (« son pareil au Paradis »). L'arabe suit le hadith : « بيتٌ في
  الجنة ». Vu par le rédacteur, le relecteur de la fidélité et l'harmonisation. **Proposition** : « la promesse d'une
  maison au Paradis pour qui Lui bâtit une mosquée ».
- **c14. « les généalogies des Arabes »** (`saga_abubakr.js:50`, compétence « Science des lignées » ;
  `saga_abubakr.js:234`, biographie). Muslim n° 2490, que suit le feuillet « La science des lignées », dit « أعلم قريش
  بأنسابها » (« le plus savant de Quraysh en ses généalogies »), et ce feuillet dit bien Quraysh (`saga_abubakr.js:275`).
  L'arabe suit le français aux deux premiers endroits. Vu par le rédacteur. **Proposition** : « de Quraysh » aux deux
  endroits.
- **c15. « 'Umar pleure »** (`saga_abubakr.js:29`, fin du récit d'Abû Bakr). Le français : « 'Umar pleure : « Qu'Allah
  fasse miséricorde à Abû Bakr ; il a épuisé ceux qui viendront après lui. » » At-Tabarî (vol. 3) dit seulement « فقال
  عمر: لقد أتعب من بعده » (« 'Umar dit : il a épuisé ceux qui viendront après lui »), sans larmes ni formule. Le
  rédacteur n'a pas trouvé de source pour les larmes. L'arabe garde les larmes et joint la formule aux mots
  d'at-Tabarî. Vu par le rédacteur. **Décision** : garder, ou écrire comme at-Tabarî : « 'Umar dit : « Il a épuisé ceux
  qui viendront après lui. » » ?
- **c16. Al-Barâ' « sur vos boucliers »** (`saga_abubakr.js:844`, et la chimère du Mur, `210`). At-Tabarî porte
  « ألقوني عليهم في الحديقة » (« jetez-moi sur eux, dans le jardin ») et « احملوني على الجدار » (« portez-moi sur le
  mur »), sans boucliers. L'arabe garde les faits du français, en substance et sans guillemets. Vu par le rédacteur.
  **Décision** : garder les boucliers, ou écrire : « Jetez-moi sur eux, dans le jardin » ?
- **c17. « Si près des murs ? »** (`saga_umar.js:459`, Abû Ghânim). Médine n'avait pas de remparts en l'an 18, et
  « murs » peut se lire ainsi. L'arabe dit « على مقربةٍ من البيوت هكذا؟ » (« si près des maisons ? »). Vu par le
  relecteur de la langue et l'harmonisation. **Proposition** : « Si près des maisons ? »
- **c18. « nous l'avons tous tué »** (`saga_ali.js:878`, le doyen). La parole citée plus haut (`saga_ali.js:801`,
  at-Tabarî) est au pluriel : « Nous les avons tous tués » (« كلنا قتلتهم »). L'arabe suit le français (« كلّنا قتله »).
  Vu par le relecteur de la fidélité. **Proposition** : « nous les avons tous tués ».
- **c19. « comme c'est l'usage depuis Badr »** (`saga_khalid.js:537`, le récitant, qui nomme la sourate al-Anfâl).
  At-Tabarî écrit « سورة الجهاد » (« la sourate du combat ») et fait de cet usage une sunna du Prophète ﷺ, établie
  après Badr. L'écart est mineur. Vu par le rédacteur. **Décision** : garder, ou écrire « comme le Prophète ﷺ en fit
  l'usage après Badr » ?
- **c20. « tribut », « impôt »** (par exemple `saga_khalid.js:287` et `694`, Homs ; `saga_uthman.js:262` et `593`,
  Chypre). Les sources arabes distinguent la jizya (Damas), le kharâj (Homs, Chypre) et l'itâwa (la Ridda) ; l'arabe
  suit chaque source, il sera donc plus précis que le français. Vu par l'agent du lexique commun. **Décision** : garder
  les mots simples, ou nommer jizya et kharâj là où un feuillet explique ?

**Déjà proposé : ce que l'arabe ajoute.**

- « Les dix consignes » (`saga_abubakr.js:258`-`259`, `592`-`593`, § 8). Il en manque une, « ولا تغدروا » (« ne rompez
  pas la parole donnée »), et le français réunit en « êtres sans défense » les enfants, les vieillards et les femmes,
  qu'at-Tabarî nomme un à un. L'arabe suit le français. Vu par le relecteur de la fidélité.
- « trois cents et quelques » (`saga_khalid.js:522`, § 9). Al-Bukhârî n° 3959 dit « ثلاثمائة وبضعة عشر » (« trois cents
  et une dizaine de plus »). L'arabe suit le français (« ونيّف »). Si vous voulez le nombre de la source : « trois cents
  et une dizaine de plus ».
- « Ghânim serre ses clés » (`saga_umar.js:463`, § 10). L'arabe écrit déjà « أبو غانم » : « غانم » seul y désignerait
  son fils.

### d. Les petits écarts de citation

*L'arabe garde en général la phrase entière de la source, parce qu'on ne coupe pas une phrase arabe ; la ligne dit quand
il suit le français. Entre parenthèses, qui l'a vu : le rédacteur, le relecteur de la fidélité (« fidélité »). Pour
chacun : garder le français, ou le rapprocher de la source ?*

- `saga_abubakr.js:394`, Ibn 'Abbâs : le français omet le serment qui ouvre la phrase, « والله » (« par Allah »).
  (Rédacteur.)
- `saga_abubakr.js:833`, le cri de Khâlid : le français omet le milieu, « لنعلم بلاء كلّ حيّ » (« que nous sachions ce
  que vaut chaque clan »). (Rédacteur.)
- `saga_abubakr.js:420`, 'Umar après la Saqîfa : « et mieux que moi » dit plus que « مثلها أو أفضل منها » (« autant, ou
  mieux »). (Rédacteur.)
- `saga_abubakr.js:579`, Abû Bakr à 'Umar au sujet d'Usâma : le français omet la réprimande « ثكلتك أمك… » (« que ta
  mère te perde… ») ; ici, l'arabe ne cite que la phrase du français. (Rédacteur.)
- `saga_abubakr.js:678`, Abû Bakr aux Médinois : « Le pays s'est retourné autour de vous » adoucit « إن الأرض كافرة »
  (« le pays alentour a renié la foi »). L'arabe suit le français. (Rédacteur, fidélité.)
- `saga_abubakr.js:281`, feuillet « Donne-nous par elle le repos » : « appelle à la prière » ; Abû Dâwûd n° 4985 dit
  « أقم الصلاة » (« établis la prière », c'est-à-dire l'iqâma). L'arabe cite la source. (Fidélité.) Dans l'histoire de
  2084, la même parole perd ces mots (`frame.js:131`) : c'est au § 7.
- `saga_umar.js:282`, « Pas d'accaparement » : « à dos de bête » ; le Muwatta' (n° 1345) dit « على عمود كبده » (« sur
  son propre dos », de sa propre peine). Mâlik la rapporte sans chaîne (« أنه بلغه », « il lui est parvenu ») : le « On
  rapporte » du français convient. L'arabe suit la source. (Rédacteur, fidélité.)
- `saga_umar.js:25` et `29`, la fin de 'Umar : « qui m'a frappé ? » ; al-Bukhârî n° 3700 dit « انظر من قتلني » (« vois
  qui m'a tué »), demandé aussitôt après la prière, avant qu'on le porte chez lui. « Aucune parole… ne lui importait
  davantage » : la source dit « ما كان من شيء أهمّ إليّ من ذلك » (« aucune chose ne m'importait plus »). L'arabe suit la
  source. (Rédacteur, fidélité.)
- `saga_umar.js:303` et `737`, le dîwân : l'arabe cite la phrase entière d'at-Tabarî, « ابدءوا بقرابة رسول الله ﷺ؛
  الأقرب فالأقرب، حتى تضعوا عمر حيث وضعه الله » (« commencez par les proches du Messager d'Allah ﷺ, du plus proche au
  moins proche, jusqu'à placer 'Umar là où Allah l'a placé ») ; le français n'en cite que la fin. (Fidélité.)
- `saga_umar.js:781`, Anas : « ni conseil privé » ; at-Tabarî dit « ولا ديوان » (« ni dîwân »), le mot même du registre
  des pensions que 'Umar crée dans ce chapitre. L'arabe suit la source. (Fidélité.)
- `saga_umar.js:520` : « j'aurais logé chaque famille pauvre chez une famille aisée » ; Ibn Sa'd dit « أدخل على كل أهل
  بيت عدتهم » (« j'aurais fait entrer chez chaque maisonnée autant de gens qu'elle en compte »). L'arabe suit la source.
  (Fidélité.)
- `saga_umar.js:258`, feuillet de l'Année des cendres : « Porteras-tu mon fardeau au Jour de la Résurrection ? », sans le
  « à ma place » de la parole du chapitre (`421`). L'arabe dit les deux fois « عنّي » (« à ma place »). (Rédacteur.)
- `saga_khalid.js:275`, feuillet « Le pacte d'al-Hîra » : la réponse s'arrête avant « qui l'en empêche », sans le
  marquer ; l'arabe coupe au même endroit. (Rédacteur.)
- `saga_ali.js:794`, la datte de Nahrawân : « Tu l'as prise sans en payer le prix ! » ; at-Tabarî dit « بغير حلها،
  وبغير ثمن! » (« sans que ce soit licite, et sans en payer le prix ! »), et c'est « l'un d'eux » qui le reprend, non
  « ses compagnons ». L'arabe cite la source. (Rédacteur.)
- `saga_ali.js:936`, le cri d'Ibn Muljam : le français s'arrête à « non à toi » ; at-Tabarî poursuit « ولا لأصحابك »
  (« ni à tes compagnons »). L'arabe s'arrête au même mot. (Rédacteur, fidélité.)
- `frame.js:363`, une réponse d'Idris : « qu'on le redresse s'il se trompait » ; la source, et la parole du récit d'Abû
  Bakr (`saga_abubakr.js:487`), disent « si j'agis mal » (« أسأت »). L'arabe suit la source. **Proposition** : « s'il
  agissait mal ». (Fidélité.)
- `frame.js:135`, « La route sûre » : la source ne donne pas de numéro ; « et le loup » est la leçon du n° 6943, le
  n° 3612 dit « ou le loup ». Écrire 6943 ? (Fidélité ; la parole elle-même est au § 7.)

### e. Des paroles citées hors du registre

*Citées entre guillemets dans un récit ou un feuillet, sans passer par « quote » : le contrôle ne les compare pas d'une
langue à l'autre. Les relecteurs les ont lues à la source et proposent de les ajouter au registre (`v2/docs/sources/`).
Rien n'y est changé ici.*

- **saga_abubakr** (le rédacteur ; le relecteur de la fidélité en compte dix-sept). La plupart sont au § 8 ; l'arabe
  apporte les références lues : « Chaque communauté a son homme de confiance… » (`240`), al-Bukhârî n° 4382 ; « prise à
  leurs riches et rendue à leurs pauvres » (`284`, `526`), n° 1496 ; « Ordonnez à Abû Bakr de diriger la prière »
  (`277`), n° 664 ; « Doucement, toi qui jures » (`379`, `381`), n° 3667 ; Ibn 'Abbâs (`394`), n° 4454 ; « Il ne laissa
  pas un mot… » (`420`), n° 6830 ; « Nous cherchons refuge auprès d'Allah de passer devant Abû Bakr » (`278`), an-Nasâ'î
  n° 777 ; « Ô Bilâl… » (`281`), Abû Dâwûd n° 4985 ; et, chez at-Tabarî, vol. 3 : « comme des brebis sous la pluie, par
  une nuit d'hiver » (`550`), « Le Messager d'Allah ﷺ l'a nommé… » (`579`), « Distinguez-vous… » et « Gens du Coran… »
  (`833`), « Maintenant, il ne nous les traira plus » (`567`), « il a épuisé ceux qui viendront après lui » (`29`).
- **saga_khalid** (fidélité) : « un sabre d'entre les sabres d'Allah » (`21`, `232`), al-Bukhârî n° 4262 ; Abû 'Ubayda
  (`241`), n° 4382 ; « Qu'Allah fasse miséricorde à Abû Sulaymân… » (`35`, `253`), Ibn Kathîr, al-Bidâya, t. 7,
  d'après Ibn Sa'd ; « Nous ne pouvons plus vous défendre » (`287`, `694`), al-Balâdhurî, Futûh al-Buldân ; al-Qa'qâ'
  (`235`), Ibn Hajar, al-Isâba, n° 7142 (voir b4).
- **saga_ali** (rédacteur, lexique) : Anas sur Qays, « comme le chef de la garde auprès de l'émir » (`237`), al-Bukhârî
  n° 7155 ; « Ô mushaf, parle aux gens ! » et la réponse des récitants (`278`, `534`), Ahmad n° 656 ; chez at-Tabarî,
  tome 5 (page imprimée non vérifiée), la datte (`794`), « En route vers le Paradis ! » (`897`) et le cri d'Ibn Muljam
  (`936`) ; le cri « Le jugement n'appartient qu'à Allah » (`256`, `512`, `591`, `694`, `695`), Muslim n° 1066, que le
  glossaire arabe demande déjà (§ 2.10).
- **saga_uthman** (rédacteur, fidélité) : Hudhayfa (`229`), al-Bukhârî n° 3606 ; Ibn Sîrîn (`253`), Muslim,
  introduction ; 'Alî sur les exemplaires (`235`, `421`), lu sur Shamela (livre 13067, p. 97) ; Abû Hurayra, « L'heure
  est venue de frapper » (`247`, `819`), Ibn Sa'd, t. 3 p. 70, et Khalîfa ibn Khayyât ; et deux paroles d'un même récit du Musnad d'Ahmad (n° 481 dans
  l'édition ar-Risâla, n° 451 sur Wikisource, comme le note le registre ; chaîne jugée faible), que le français
  introduit à juste titre par « On rapporte » : « Je ne quitterai pas la demeure de mon Hégire… » (`830`) et « Je ne
  serai pas le premier… » (`247`).
- **frame** (fidélité) : Ibn al-Mubârak (`128`), Muslim, introduction ; Bilâl (`131`), Abû Dâwûd n° 4985. Déjà au § 7,
  avec la promesse de Khabbâb (`135`, voir d).
- **caid** (rédacteur, fidélité) : le cri de Harûrâ' et la réponse de 'Alî (`141`, `770`) ; le registre ne rattache
  cette réponse qu'à `saga_ali.js:696`.

**Non lues à la source.** Le rédacteur du récit de 'Alî n'a pas pu lire en ligne la source de cinq paroles ; il les rend
en substance, sans guillemets : la lettre de 'Umar à Abû Mûsâ (`saga_ali.js:269`) ; le jugement de Shurayh sur le
cheval (`272`) ; « Marchands, craignez Allah… » (`308`) ; « Puisque tu as embrassé l'islam, elle est à toi » (`429`) ;
« Je n'avais jamais vu, dira Ibn 'Abbâs… » (`581`). Elles pourraient entrer au registre, une fois lues.

**Des notes du registre à reprendre** : elles décrivent le français d'avant D183. La sourate 106 (`versets.json`) :
l'écart dit encore que le jeu prête au Coran les deux destinations, alors que le français dit désormais « les
commentateurs les situent au Yémen et au Shâm » (`frame.js:134`) ; vu par le rédacteur. « J'adjure quiconque… »
(`saga_uthman.json`) : l'écart décrit encore les deux phrases d'avant, et la note dit que les références nomment encore
le Musnad, alors qu'elles sont déjà à jour ; vu par le rédacteur et le relecteur de la fidélité. En relisant le
registre, l'agent a vu que, pour les trois autres paroles corrigées par D183 (`saga_abubakr.js:782` et `863`,
`saga_umar.js:377`), l'écart décrit lui aussi la source d'avant ; la note de chacune dit déjà que D183 l'a corrigée.

### Hors classement : des mots et des formules

*Ces points ne touchent ni une exigence, ni une source, mais les relecteurs les signalent pour le respect ou la clarté.*

- **h1. « Je vous le jure sur la tombe de mon père »** (`caid.js:247`, une réponse possible du Caïd). Un serment par une
  tombe, comme « Par ma barbe » (a). L'arabe écrit « أحلف لكم على قبر أبي », qui se lit « je vous le jure devant la
  tombe de mon père », non « par » elle. Vu par le rédacteur. **Proposition** : « Je vous le jure. »
- **h2. « taverne »** (`caid.js:678`, `683`, `695`). Le mot évoque le vin, dans une citadelle musulmane. L'arabe dit
  « خان » (« auberge », « caravansérail »), jamais « حانة » (le débit de vin). Vu par le rédacteur et le relecteur de la
  fidélité. **Proposition** : « auberge » (« d'auberge en auberge », « l'argent des auberges », « couru les auberges »).
- **h3. « C'était le Messager. »** (`caid.js:775`). Le jeu met ﷺ partout ailleurs ; l'arabe l'ajoute (« ذاك كان الرسول
  ﷺ »). Vu par le rédacteur. **Proposition** : « C'était le Messager ﷺ. »
- **h4. La formule d'Ibn 'Abbâs** (`saga_ali.js:231`). « il avait environ treize ans à sa mort (qu'Allah l'agrée, ainsi
  que son père) » : « sa mort » est celle du Prophète ﷺ, et la formule semble se rapporter à lui. L'arabe la place à la
  première mention d'Ibn 'Abbâs. Vu par le relecteur de la fidélité. **Proposition** : « Cousin du Messager d'Allah ﷺ
  (qu'Allah l'agrée, ainsi que son père), il avait environ treize ans à la mort du Prophète ﷺ. »
- **h5. « prosternez-vous devant lui ! »** (`saga_abubakr.js:126`, la chimère du Déni). « Lui » peut être le souvenir ou
  le Prophète ﷺ. L'arabe a choisi le souvenir : « وتسجدوا لها » (« et prosternez-vous devant elle ») ne peut se rapporter
  qu'au mot « ذكراه » (« son souvenir »), féminin en arabe. C'est le sens de la description de la chimère et de son
  feuillet (« adorer un souvenir », `129` et `246`). Vu par le relecteur de la fidélité. **Proposition** : « …et
  prosternez-vous devant ce souvenir ! »
- **h6. Un même mot pour un Compagnon et pour une chimère.** « Certitude » est une compétence d'Abû Bakr
  (`saga_abubakr.js:56`) et l'arme de deux chimères, le Pur et le Juge sans miséricorde (`caid.js:117`,
  `saga_ali.js:212`). Un texte n'a qu'une traduction : l'arabe a donc pris un mot plus pauvre pour Abû Bakr, « الجزم »
  (« la ferme assurance »), car « اليقين » (« la certitude ») est un degré de la foi, dont une chimère ne doit pas faire
  son arme. De même, « Sentence » sert à 'Umar (`saga_umar.js:56`) et au Juge (`saga_ali.js:209`). Vu par l'agent du
  lexique commun.
  **Décision** : garder un seul mot, ou en donner deux en français ?
- **h7. « Le Général et la Tour »** (`caid.js:417` et `453`, titre de la troisième veillée). Le texte de la veillée ne
  parle d'aucune tour ; le rédacteur ne lui a pas trouvé de sens clair, et a écrit « البرج » (« la tour »). Vu par le
  rédacteur. **Décision** : garder, ou dire ce que la Tour désigne ?
- **h8. « donner un visage à l'hypocrite »** (`saga_umar.js:288`, feuillet de Hâzim). Le feuillet de Thâmir dit « donner
  un visage à l'hypocrisie (nifâq) » (`saga_abubakr.js:292`). Le glossaire arabe, plus strict que l'exigence 11, n'écrit
  jamais « المنافق » (« l'hypocrite ») d'un personnage nommé ; l'arabe dit donc « اخترعته اللعبة ليُرى فيه صنفٌ من
  الناس » (« le jeu l'invente pour qu'on voie en lui une sorte de gens »), sans le mot, et sans « visage ». Le français
  respecte l'exigence 11 : Hâzim est inventé. Vu par le rédacteur. **Décision** : garder, ou écrire comme pour Thâmir
  « pour donner un visage à l'hypocrisie : celle de qui dit au pouvoir ce qu'il veut entendre… » ?

**Déjà proposé.** « La citadelle n'appartient qu'à Dieu » (`caid.js:723`, `730`, `745`, `769`, § 6). L'arabe n'a qu'un
mot, « الله » : la nuance voulue par le français disparaît (« ما القلعةُ إلا لله », « la citadelle n'est qu'à Allah »). Vu
par le rédacteur.

## 12. Relevé en relisant l'anglais et le japonais

Les relectures de l'anglais (fidélité, puis langue) et du japonais (D188) ont repris presque tous les points ci-dessus :
Dhû l-Fiqâr et Haydar (§ 1), al-Kadhdhâb (§ 1), « Le Bouclier et le Juge » (11.c9), les visages maigres (§ 6), « Ghânim
serre ses clés » (§ 10), le Régent (§ 7). Quatre points sont nouveaux ; chacun a été relu dans le fichier français.
Aucun n'est corrigé.

- **12.1. L'Admiré, un cinquième écho du conte (exigence 14).** « Dis-moi que je suis le plus regardé de la Cité.
  Dis-le. Ça ne coûte rien. » (`frame.js:473`, pourparler « Descendre du socle ») reprend la demande du vaniteux du
  conte, qui veut qu'on l'admire comme le premier de sa planète. Il rejoint les quatre échanges du § 7. **Proposition** :
  le réécrire avec eux, pour que le type reste (celui qu'on applaudit) sans la demande ni son enchaînement.
- **12.2. « La Durra »** (`saga_abubakr.js:67`, `saga_umar.js:46`, compétence de 'Umar). Le fouet de 'Umar est la
  *dirra* (الدِّرّة) ; *durra* (الدُّرّة) veut dire « la perle ». L'arabe écrit الدِّرّة et l'anglais *The Dirra* ; le
  japonais a suivi le français (ドゥッラ). **Proposition** : « La Dirra », puis le japonais suit.
- **12.3. « l'Agrégor, qui ne force personne et tient tout le monde »** (`saga_uthman.js:658`). « Tient tout le monde »
  approche l'image de la possession que D184 (1.6) écarte, et le japonais l'a d'abord lu « ne lâche personne ». Le
  relecteur japonais a corrigé une image semblable dans la même saga (« c'est la peur qui parle pour eux »,
  l'intro de « La Peur »). **Proposition** : « qui ne force personne, et que chacun pourtant sert ».
- **12.4. « le héros », dit de Khâlid (exigence 24).** « Il se brise quand le héros lui-même refuse le socle »
  (`saga_khalid.js:225`, l'Idole du Héros) et « Celui qui tient le registre ne croit pas au héros ; il en vit »
  (`saga_khalid.js:290`). L'exigence 24 veut qu'aucun texte ne dise de quelqu'un qu'il *est* un héros ; en japonais,
  英雄 est exactement le nom de la figure. **Proposition** : « quand Khâlid lui-même refuse le socle » ; « ne croit pas
  à l'idole ; il en vit ».

**Décidé (le décideur, 19 novembre : « ne mentionne pas Teilhard et Vernadsky »).** Le feuillet « La noosphère »
(`frame.js:124`) et les crédits (`ui.js:498`) ne les nomment plus ; ils ne gardent que l'étymologie (« Du grec *noûs*,
l'esprit »), et le feuillet n'a plus de source. Fait dans les quatre langues (2.12).

**Décidé (le décideur, 19 novembre : « Ne nomme aucune source non islamique »).** Sept passages des feuillets nommaient
une source qui ne l'est pas. Les faits restent, parce que des répliques et des options de pourparler s'appuient sur eux
(la solde des tribus, l'église, les familles de Tibériade). Ils sont dits « On rapporte », comme le veut l'exigence 3, et
la source dit d'où vient le récit sans le nommer. Ces réécritures sont de l'agent, à valider :

| Où | Avant | Après |
|---|---|---|
| `saga_khalid.js:247`, Yarmoûk | « les historiens modernes réduisent ces chiffres » | « leurs chiffres varient d'une chronique à l'autre » |
| `saga_khalid.js:281-282`, Arabes chrétiens | « On rapporte, d'après le chroniqueur Théophane, que la solde… » ; source « … ; Théophane, Chronographie » | « On rapporte que la solde… » ; source « … ; la solde : un récit rapporté hors de ces chroniques » |
| `saga_umar.js:261-262`, Îliyâ' | « Une source chrétienne plus tardive, Eutychius, rapporte qu'il déclina… » ; source « … ; Eutychius, Annales » | « On rapporte aussi, dans un récit plus tardif, qu'il déclina… » ; source « … ; l'église : un récit plus tardif » |
| `saga_umar.js:292`, l'interdit d'Aelia | source « Eusèbe de Césarée… ; chroniqueurs byzantins ; historiographie moderne » | source « Histoire de Rome ; la clause du pacte : at-Tabarî, Târîkh » |
| `saga_umar.js:294-295`, les soixante-dix familles | « — un récit judéo-arabe retrouvé dans la Geniza du Caire, des chroniqueurs — » ; source « … ; fragment de la Geniza du Caire ; … » | « D'autres traditions, plus tardives, rapportent… » ; source « … ; les familles : traditions plus tardives, attributions discutées » |
| `saga_umar.js:297-298`, les Banû Ghassân | « Le chroniqueur Théophane rapporte que… » ; source « Théophane, Chronographie ; … » | « On rapporte que… » ; source « al-Balâdhurî… ; la solde : un récit rapporté hors de cette chronique » |

Restent à voir : une option de pourparler dit « Ce qu'un César a décrété n'est pas l'Évangile » (`saga_umar.js:657`) —
une façon de parler, non une source citée ; et le refus de prier dans l'église pourrait avoir aussi une source islamique,
qui le rendrait sourçable sans détour (à chercher, rien n'est vérifié).

## Si vous retenez un changement

Le français change d'abord, puis les listes des langues se remettent à jour (`node v2/tools/langues.js releve`) : les
textes touchés sont réécrits dans les trois langues. Toute la batterie se repasse. Mieux vaut trancher ces points
**avant** que l'écriture arrive aux récits, pour ne pas écrire deux fois.
