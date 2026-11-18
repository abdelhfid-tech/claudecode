# Glossaire arabe d'ISNAD 2.x

Ce glossaire fixe, pour toute l'écriture arabe du jeu, les conventions, les mots du jeu et les noms propres. Chaque agent
qui écrit en arabe le suit ; un terme absent se demande ici avant d'être inventé ailleurs.

**Règle du décideur (18 novembre).** L'arabe ne traduit pas le français : il reprend chaque notion **là où la langue
arabe l'a déjà dite**, dans ses livres. Un terme retenu porte donc l'ouvrage où il est employé dans ce sens, et l'adresse
où cela a été lu. Quand rien n'a pu être relu en ligne, le glossaire le dit (« référence non vérifiée ») ; quand la
notion n'existe pas dans la tradition (chimère, noosphère, Constance…), le terme est une **proposition**, marquée
« **à valider** ».

**Ce que ce glossaire ne fait pas.** Il ne cite ni verset ni parole : le texte arabe d'un verset (othmanien, entre
﴿ ﴾) ou d'une parole attestée vient du registre `v2/docs/sources/` (voir `LISEZ-MOI.md`). Quand une entrée renvoie à
un verset, c'est pour situer un mot, par sa référence seule.

**Les exigences de respect (AGENTS.md, 1 à 24) valent en arabe mot pour mot.** Quelques-unes y prennent une forme
propre, signalée dans les entrées : le mot « صحابي / صاحب » réservé aux Compagnons (§ 2.1), aucun ennemi dont le nom
évoque un djinn, un démon, la « fitna » des Compagnons ou une notion sacrée (§ 2.2), aucun mot qui ferait d'une
œuvre un pouvoir (§ 2.5).

Abréviations : *Ihyâ'* = al-Ghazâlî, *Ihyâ' 'ulûm ad-dîn* ; WP-ar = Wikipédia en arabe ; « lu » = page consultée le
18 novembre 2026, adresse donnée.

---

## 1. Conventions d'écriture

### 1.1 Registres

| Où | Registre | Modèle |
|---|---|---|
| Récits des Compagnons (an 11 à 40 H) : narration, répliques, recueil | arabe littéraire de la sîra et des chroniques : phrase verbale, liaisons en فـ / ثم / و, peu d'adjectifs, aucun néologisme | Ibn Hishâm, *as-Sîra an-nabawiyya* ; at-Tabarî, *Târîkh ar-rusul wa-l-mulûk* ; Ibn Kathîr, *al-Bidâya wa-n-nihâya* |
| Veillées du Caïd (la Citadelle) | le même arabe littéraire, plus méditatif ; phrases courtes, images concrètes (le puits, le rempart, la sentinelle) | le ton des « nuits » d'Abû Hayyân at-Tawhîdî, *al-Imtâ' wa-l-mu'ânasa* (voir « veillée », § 2.3) |
| 2084 (Cité-Miroir, Archives basses) | arabe littéraire moderne et sobre (فصحى معاصرة) : celui d'un bon roman ou d'un essai, jamais le dialecte, jamais l'anglais translittéré quand un mot arabe existe (إشعار، شاشة، مصعد، تطبيق) | la prose d'essai de Malek Bennabi en traduction arabe (*Mushkilat al-afkâr*) pour les notions ; la presse littéraire pour les objets |
| Écrans du jeu (menus, boutons, aides) | arabe moderne court : impératif au singulier (« اضغط »، « المس »), noms verbaux pour les rubriques | — |

Jamais de dialecte, même pour un enfant, un soldat ou un marchand : la condition sociale passe par le choix des mots et
la longueur des phrases, pas par la grammaire.

### 1.2 Vocalisation (التشكيل)

- **Par défaut, rien.** Le texte courant n'est pas vocalisé : un texte entièrement vocalisé se lit mal sur un
  téléphone et donne aux répliques un air de manuel.
- **On vocalise ce qui serait mal lu**, à la première occurrence d'un écran ou d'une entrée du recueil, et seulement la
  lettre utile :
  - les noms propres ambigus : عُمَر (et non عَمْرو : l'un n'a pas de wâw final, l'autre si, § 3.1) ; عُثمان ; ضِرار ;
    حُذَيفة ; القَعقاع ; الحُبَاب ; أُسامة ; سُراقة ; شُرَيح ; قَنبَر ; كُمَيل ; الهُرمُزان ; جَبَلة ; صَفرونيوس ; زِيري ;
    إِيلياء ; حَرُوراء ; النَّهْرَوان ; اليَرموك ; قِنَّسرين ; السَّماوة ;
  - les paires de mots du jeu qui s'écrivent pareil : **النَّفَس** (le Souffle, la jauge) / النَّفْس (l'âme) ;
    **حَلْقة** (un maillon de la Chaîne) / حَلَقة (un cercle d'étude) ; **اللَّبِن** (la brique crue, matériau) /
    اللَّبَن (le lait, objet) ; **الجَدْي** (l'étoile polaire) ;
  - un mot rare, la première fois (السَّمْهَريّ، الخَطّيّ، النَّبْع، اللَّمْط).
- **Versets** : déjà vocalisés dans le registre (texte othmanien) ; on n'y touche pas.
- **Paroles attestées** : on garde la vocalisation de l'édition lue (registre), sans en ajouter.
- Les **noms divins** de la page « Valeurs et attributs » sont vocalisés en entier (الرَّزَّاق، الكَبِيرُ المُتَعَال…) :
  ils sont peu nombreux, et on ne doit pas les lire de travers.

### 1.3 Ponctuation

- **Guillemets** : « » (guillemets en chevrons), pour toute parole citée et toute réplique rapportée dans une narration,
  comme le français du jeu et comme les éditions arabes modernes des chroniques. Pas de ” “ (illisibles dans le sens
  droite-gauche sur certaines polices). Une citation dans une citation : « … "…" … ».
- **Virgule** ، (U+060C), **point-virgule** ؛ (U+061B), **point d'interrogation** ؟ (U+061F). Jamais la virgule latine
  dans un texte arabe.
- **Deux-points** : « : » collé au mot qui précède (pas d'espace avant, contrairement au français) ; ils introduisent
  une explication ou une parole, comme dans les éditions de la sîra (قال: «…»).
- **Points de suspension** : « … » (un seul caractère U+2026), collés au mot.
- **Tiret** : le tiret long « — » sépare un nom de sa source, comme en français (« أبو بكر — ابن هشام، السيرة النبوية »),
  ce que fait déjà le registre des sources.
- **Point d'exclamation** : rare. Un cri dans un combat, une chimère qui se croit juste ; jamais dans la bouche d'un
  Compagnon sans que la source le donne. *(Harmonisation du 18 novembre, à valider : appliqué à tous les récits ; un
  « ! » ne reste dans la bouche d'un Compagnon que dans un texte relevé chez sa source, qui le porte.)*
- **Point final et guillemets** *(harmonisation du 18 novembre, à valider)* : quand la parole est enchâssée dans la
  phrase, le point se met **hors** des guillemets : « قال: «…». » ; « ؟ » et « ! » qui appartiennent à la parole restent
  dedans (« «…؟» »). Une ligne qui n'est qu'une parole entre guillemets garde son point à l'intérieur (« «…». » n'est pas
  exigé). C'est l'usage du moteur, des veillées et des cinq récits.
- Les glyphes du jeu (▶ ☰ ✦ × ·) restent tels quels ; le moteur retourne lui-même les flèches (◂ ▸) dans le sens
  droite-gauche.

### 1.4 Chiffres — un seul choix : les chiffres arabes orientaux ٠١٢٣٤٥٦٧٨٩

**Tout le jeu arabe écrit ses nombres en chiffres arabes orientaux (dits « hindis ») : ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩**, dans
les textes, les références, les dates, l'interface (Constance, Souffle, prix, niveaux, chrono) et les nombres que le
moteur calcule.

Raisons :
1. Le registre des sources les emploie déjà pour toutes les références arabes (« صحيح البخاري، رقم ١٣٨٧ »,
   « السيرة النبوية، ج ١ ص ٣٩٩ », « سورة آل عمران: ١٤٤ ») ; un seul système évite qu'un même écran mêle deux chiffres.
2. Ce sont ceux des éditions imprimées d'où viennent les textes (Le Caire, Beyrouth, Riyad ; Shamela les reproduit).
3. Le jeu est écrit en arabe classique, et son public premier lit ces chiffres partout dans les livres religieux.

Conséquence pour le moteur (à faire par qui code l'arabe, hors de ce glossaire) : une seule fonction convertit
0-9 en ٠-٩ au moment d'afficher, pour l'arabe seulement (par ex. `toLocaleString('ar-EG')` ou une table). Le Maghreb
emploie plutôt 0-9 : le choix est **à confirmer par le décideur** (§ 4), mais il doit être unique.

Nombres en lettres : de un à dix, en lettres dans les récits (« ثلاثة أيام ») avec l'accord inversé du nombre et du
compté (ثلاثة رجال، ثلاث ليال) ; en chiffres dans l'interface. Le moteur choisit la forme d'un texte « selon un nombre »
parmi six (zéro, un, deux, trois à dix, onze à quatre-vingt-dix-neuf, cent et au-delà : `v2/src/core/langue.js`,
`RANG.ar`) ; un texte arabe à nombre donne donc, au mieux, les six formes séparées par « ¦ ». Exemple :
`لا حجاب¦حجاب واحد¦حجابان¦{n} حُجُب¦{n} حجابًا¦{n} حجاب`.

### 1.5 Dates

- **Hégire d'abord, puis l'ère commune**, comme le français du jeu : « سنة ١١ هـ / ٦٣٢ م ». Abréviations : **هـ**
  (هجرية) et **م** (ميلادية), précédées d'une espace, sans point.
- Dans un récit, l'année s'écrit comme les chroniques : « في سنة إحدى عشرة » (at-Tabarî range son *Târîkh* par
  années : « ثم دخلت سنة… ») ; dans un sous-titre ou une fiche, en chiffres : « ١١ هـ · ٦٣٢ م ».
- Les mois : noms hégiriens classiques (المحرّم، صفر، ربيع الأول، ربيع الآخر، جمادى الأولى، جمادى الآخرة، رجب، شعبان،
  رمضان، شوّال، ذو القعدة، ذو الحجة).
- 2084 : « سنة ١٥٠٧ هـ / ٢٠٨٤ م » (D184, relecture 2.22 : d'après le calendrier d'Umm al-Qurâ, 1508 ne commence que vers
  septembre 2084, et l'année 2084 est surtout 1507 ; le français dit désormais « 1507 H » ; à valider (D184)).

### 1.6 Formules de respect

| Après | Formule | Règle |
|---|---|---|
| le Prophète | **ﷺ** (U+FDFA, un seul caractère) | comme le jeu français : après « رسول الله »، « النبي »، « محمد » et toute désignation du Prophète, à chaque fois, dans tout texte (récit, recueil, références). La police Amiri, chargée par le jeu, a ce glyphe. Le Prophète n'est jamais représenté ni mis en dialogue (exigence 1). |
| un autre prophète (Ibrâhîm, Mûsâ…) | **عليه السلام** | à la première mention d'un écran ou d'une entrée ; rare dans le jeu. |
| un Compagnon | **proposition : رضي الله عنه** (عنها، عنهما، عنهم) | **à trancher par le décideur** (§ 4). Le français n'en met pas. En arabe, un récit sur un Compagnon sans cette formule surprend le lecteur pieux ; une formule à chaque nom alourdit une réplique de trois lignes. Proposition : une fois, à la **première mention** du Compagnon dans un chapitre (narration et recueil), jamais dans une réplique (personne ne dit « رضي الله عنه » de l'homme à qui il parle), jamais dans un bouton, un nom de héros, une compétence ni une étiquette sur la carte. |
| un mort de la fiction | rien (pas de رحمه الله dans la bouche du narrateur ; un personnage peut le dire dans une réplique) | |

**Dans les feuillets du recueil (relevé du 18 novembre, lexique commun).** Le français met désormais la formule dans les
feuillets biographiques des cinq récits, à la première mention du Compagnon : « (qu'Allah l'agrée) » (treize fois),
« (qu'Allah les agrée) » (Qays et son père), « (qu'Allah l'agrée, ainsi que son père) », « Qu'Allah l'agrée. » en fin de
feuillet (trois fois, récit d'Abû Bakr) ; et, pour Aslam, que les sources rangent parmi les Successeurs, « (qu'Allah lui
fasse miséricorde) ». L'arabe met la formule **au même endroit, et là seulement**, sans parenthèses, comme les éditions :
**رضي الله عنه** · **رضي الله عنهما** · **رضي الله عنه وعن أبيه** · en fin de phrase « رضي الله عنه. » ; pour Aslam,
**رحمه الله**. Sources : at-Tabarî, *Târîkh*, édition de Wikisource [N] (« فتناول علي رضي الله عنه بابا », vol. 3, *Khaybar*) ;
al-Bukhârî n° 4986 [P] (« صدر أبي بكر وعمر ـ رضى الله عنهما ـ »). Ailleurs (narration des chapitres, répliques, boutons,
noms), la ligne « un Compagnon » ci-dessus reste à trancher (§ 4.1). **À valider.**

### 1.7 « Allah »

- Toujours **الله** ; jamais un autre mot pour le désigner dans la narration (pas de « الإله » seul). Dans les noms
  composés, l'écriture usuelle : عبد الله، رسول الله، سبيل الله.
- La ligature, la police s'en charge ; on n'écrit jamais اللّه avec une chadda ajoutée à la main.
- **Exigence 8, en arabe** : le mot الله n'entre dans **aucun** nom de compétence, d'ennemi, d'objet, de lieu frappé ni
  de sprite. Cela touche des surnoms historiques : le surnom de Khâlid, *Sayf Allâh*, n'est **pas** employé comme nom
  de compétence ni comme titre du héros (§ 3.1, « Khâlid ») ; on écrit « السيف المسلول ».
- « سبحانه »، « تعالى », « عزّ وجلّ » : pas de formule systématique après الله dans le jeu (le français n'en met pas) ;
  une réplique d'époque peut en porter une si la source la donne.

### 1.8 Tutoiement, vouvoiement, nombre

- L'arabe classique **tutoie** : on s'adresse à quiconque, calife compris, à la deuxième personne du singulier
  (أنتَ، أنتِ). Le « vous » de politesse français (« Vous êtes le Caïd ») devient un tu, et le respect passe par le
  vocatif et les mots : « يا أمير المؤمنين »، « يا أبا بكر » (la kunya au vocatif est la marque d'égard des sources),
  « أيها الشيخ ».
- Le narrateur des récits s'adresse au râwî au vocatif, comme le français (« Râwî, voici le premier maillon ») :
  « يا راوي » (sans article).
- **À distance du joueur** (décideur, 18 novembre : « gardons un peu de distance avec le joueur » ; version 2.08). Le
  jeu ne parle plus au joueur de son propre cœur, de sa prière, de sa vie ni de sa descente. La descente est celle du
  râwî, dite à la troisième personne (« نزول الراوي »، « صلّى الراوي في هذا الفصل »، « لن يعود منها داءٌ ما عاش
  الراوي »), ou sans personne (« زاد القلب »، « يُتعرَّف إليه »), ou au « on » de l'arabe, celui qui passe (« عليه يُصلّي
  العابر ويستريح »). Un choix de menu qui touche à la prière ou à la descente prend le nom verbal, jamais l'impératif :
  « الصلاة والراحة »، « النزول »،
  « النوم » (et non « صلِّ واسترح »، « انزل »). Gardent le « tu » : les consignes de commande (« Entrée, ou touche… »),
  la conduite de la partie (sauvegarde, carte, choix d'un récit) et ce que le français dit encore au joueur (« plus fort
  que toi », « tu choisis ta manière »).
- **Le duel** est obligatoire quand on parle de deux : « الرفيقان »، « حجابان »، « قالا ». Les répliques adressées à deux
  personnes sont au duel (أنتما).
- **Le pluriel** : on parle à un groupe au masculin pluriel (أنتم) ; une femme seule au féminin singulier. Le jeu met
  en scène peu de femmes (exigence 4 : « une famille », « les gens ») : on garde ces désignations collectives (أهل بيت،
  الناس).
- Pluriel des non-humains (chimères, rangs, objets) : accord au féminin singulier (« الخيالات تحوم »، « الصفوف تقدّمت »),
  comme l'arabe classique.

### 1.9 Longueur des répliques

Une boîte de dialogue tient **trois lignes sur un téléphone** (texte « grand » d'office sur écran tactile). En arabe :
- **environ 90 à 110 caractères** par boîte (espaces comprises), soit 15 à 20 mots ; l'arabe sans voyelles est plus
  court que le français (compter 80 à 85 % de la longueur française), mais la police Naskh est plus haute : ne pas
  remplir jusqu'au bord.
- Une idée par boîte ; on coupe une longue réplique en deux répliques plutôt que de serrer.
- Les noms de compétences et d'ennemis : **deux mots**, trois au plus (« الكلمة الصادقة »، « سرير المُلك الخالي »).
- Les titres d'écran : un à trois mots.
- Les textes du recueil n'ont pas de limite, mais une entrée se lit d'un tenant : un paragraphe de 60 à 120 mots.

### 1.10 Graphie

- **Hamza** : écrite selon la norme des éditions (مسؤول، شؤون، قراءة، إيلياء، ابن أبي طالب) ; **alif maqsûra** ى
  distinct du yâ' ي (موسى، على / علي) ; **tâ' marbûta** ة toujours pointée.
- **ابن / بن** : « بن » entre deux noms dans une généalogie (عمر بن الخطاب) ; « ابن » en tête (ابن عباس، ابن عوف) ou
  quand le nom du père n'est pas un nom propre de la même chaîne.
- **Pas de tatwîl** (ـــ) d'ornement dans le texte ; les titres décoratifs (sceaux arabes des héros) sont dessinés par le
  moteur.
- Les mots étrangers de 2084 : un mot arabe s'il existe (§ 2.6) ; sinon, translittération sobre en lettres arabes, jamais
  de lettres latines dans une phrase arabe.

### 1.11 Ce que l'arabe ne fait jamais

- Mettre dans la bouche d'un Compagnon une parole que les sources ne lui prêtent pas en la présentant comme attestée :
  une réplique dramatisée reste une réplique ; une parole attestée passe par `quote` et le registre.
- Traduire une parole attestée depuis le français : on prend le texte arabe de la source (registre), ou on la rapporte
  en substance, sans guillemets, si elle est introuvable.
- Employer un mot de la théologie spéculative (صفات، ذات، تجسيم…) ou d'un débat entre écoles là où un mot commun suffit
  (exigence 5).
- **Dire qu'une chose tient un homme** (D184, relecture 1.6 ; exigence 18 : « le cœur reste responsable »). Aucun mot de
  la possession : ni مَسّ، ممسوس، تلبّس، تقمّص، استحوذ على، سكنه، نطق بلسانه، سيطر عليه ; ni de l'envoûtement : سِحر،
  مسحور، معمول له، العين (le mauvais œil), رُقية, ni « يذوي بلا حُمّى ولا علّة » (« languir sans fièvre ni cause »), ni
  un remède qui « rend la santé » (أعاده إلى عافيته). L'homme reste le sujet de sa phrase : « لم يعد يسمع إلا هذا »
  (« Il n'entend plus que cela ») ; « فإذا هو يطيعها أكثر مما يطيع عقله » (« il lui obéit plus qu'à sa raison ») ;
  « لسنا نقاتله هو، بل ما ينظر إليه » (« Ce n'est pas lui qu'on combat : c'est ce qu'il regarde ») ; l'énigme du cœur
  (لغز القلب) : « رجلٌ تخور عزيمته، وما به مرضٌ ولا جرح » (le français dit « un homme perd courage », et non plus
  « l'un des tiens » : § 1.8), et la bonne œuvre « ردّ إليه عزيمته ». L'emprise d'une
  idole reste une image de l'exigence 18 (« قبضة »), jamais une présence dans un corps. **À valider (D184).**

### 1.12 Les sources des feuillets (`codex[…].src`) et les mentions qui les accompagnent

*Ajout du 18 novembre (lexique commun), à valider.* La source d'une **parole** (`<quote>2`) se recopie du registre, au
signe près : le contrôle la compare. La source d'un **feuillet** n'est pas au registre ; les sept récits en ont 93, et un
même livre doit y porter partout le même nom. On prend donc les noms du registre (`v2/docs/sources/*.json`, champ
`ar.reference`) et du moteur (`moteur.json`, « Sources principales », déjà écrit) :

- **l'auteur, une virgule arabe, le titre**, comme le français qui abrège (« at-Tabarî, Târîkh ») ; plusieurs sources se
  séparent par « ؛ » : « ابن هشام، السيرة النبوية؛ صحيح البخاري » (posé partout) ;
- **un recueil de hadiths par son titre usuel**, comme le registre : « صحيح البخاري »، « صحيح مسلم »، « سنن النسائي »،
  « جامع الترمذي »، « مسند أحمد » ; le numéro entre parenthèses, en chiffres arabes orientaux : « صحيح البخاري (٣٧٤٤) » ;
  « al-Bukhârî et Muslim » : « البخاري ومسلم » (moteur) ;
- **les précisions entre parenthèses** suivent le français : (d'après Ibn Ishâq) « (عن ابن إسحاق) » ; (d'après Sayf ibn
  'Umar) « (من رواية سيف بن عمر) » ; (récit de Zayd ibn Thâbit) « (من حديث زيد بن ثابت) » ; (parole de 'Umar) « (من قول عمر) » ;
  (an 28 H) « (سنة ٢٨ هـ) » ; (jugé authentique par adh-Dhahabî) « (وصحّحه الذهبي) » ; (Livre des expéditions) « كتاب
  المغازي » (registre : « صحيح البخاري، كتاب المغازي، رقم ٤٢٦٥ ») ; (livre des ventes) « كتاب البيوع » ; (introduction du
  Sahîh) « المقدمة » (registre : « صحيح مسلم، المقدمة ») ; (attribué à …) « (المنسوب إلى …) » ; « attributions
  discutées » : « في نسبته خلاف » (registre : « (في نسبته خلاف) ») ;
- **« traduction du sens » ne se dit pas en arabe** : l'arabe cite le texte même, et la mention tombe. Le moteur l'a
  déjà fait : « {ref}, traduction du sens » → « القرآن الكريم، {ref} ». Une référence de verset prend la forme du
  registre : « سورة الحجرات: ٦ » ; « Coran — traductions du sens » : « القرآن الكريم ». Si un feuillet arabe ne rapporte
  une parole qu'en substance, il le dit : « بالمعنى » ;
- **« On rapporte »** (exigence 3) : en tête d'une source, « يُروى — … » (registre) ; dans un récit, « On rapporte que » :
  « يُروى أنّ » (moteur : « On rapporte cette promesse » → « ويُروى هذا الوعد ») ; « rapporte-t-on » : « فيما يُروى » ;
  « dit-on » : « فيما يُقال » ; at-Tabarî use de « يقال » et de « زعموا » pour ce qu'il rapporte sans le garantir [N] ;
- **la fiction** : « Fiction » → « من صنع اللعبة » (moteur : « Fiction : aucun de ces compagnons… » → « من صنع اللعبة: … ») ;
  « Le personnage est fictif » → « والشخصية من صنع اللعبة » ; « Le feuillet et ses chiffres sont fictifs » → « والورقة
  وأرقامها من صنع اللعبة » ; « sont une fiction » → « قصصٌ متخيَّلة » (moteur) ; « Image du jeu » → « صورةٌ من صور اللعبة »
  (§ 2.5). **Jamais « خيال، خياليّ »** pour la fiction : c'est le mot des chimères (§ 2.3). Un feuillet du jeu (une entrée
  du recueil, une pièce trouvée dans un chapitre) est une **ورقة** (moteur : « Un feuillet. » → « ورقة. ») ; les feuillets
  du Coran réunis par Zayd sont **الصُّحُف** (§ 2.10).

| Français | Arabe | Où l'arabe est déjà écrit / note |
|---|---|---|
| Ibn Hishâm, as-Sîra (Sîra) | ابن هشام، السيرة النبوية | registre ; moteur |
| at-Tabarî, Târîkh ; at-Tabarî seul | الطبري، تاريخ الرسل والملوك ; الطبري | registre ; moteur |
| at-Tabarî, Tafsîr | الطبري، جامع البيان | titre de l'ouvrage ; référence non vérifiée |
| Ibn Sa'd, (at-)Tabaqât (al-Kubrâ) | ابن سعد، الطبقات الكبرى | registre ; moteur |
| Ibn Kathîr, al-Bidâya (wa-n-Nihâya) | ابن كثير، البداية والنهاية | registre ; moteur ; [G] |
| al-Balâdhurî, Futûh al-Buldân | البلاذري، فتوح البلدان | registre ; [O] |
| Ibn 'Asâkir, Târîkh Dimashq | ابن عساكر، تاريخ دمشق | registre ; moteur |
| Ibn 'Abd al-Barr, al-Istî'âb | ابن عبد البر، الاستيعاب | registre (« الاستيعاب في معرفة الأصحاب ») |
| Ibn Hajar, al-Isâba ; Fath al-Bârî | ابن حجر، الإصابة ; ابن حجر، فتح الباري | référence non vérifiée |
| adh-Dhahabî, Siyar | الذهبي، سير أعلام النبلاء | référence non vérifiée |
| Futûh ash-Shâm (attribué à al-Wâqidî) | فتوح الشام (المنسوب إلى الواقدي) | référence non vérifiée |
| Abû Dâwûd, as-Sunan | سنن أبي داود | sur le modèle du registre (« سنن النسائي ») |
| an-Nasâ'î ; an-Nasâ'î, as-Sunan al-Kubrâ | سنن النسائي ; النسائي، السنن الكبرى | registre (« سنن النسائي، رقم ٣٦٠٨ ») |
| at-Tirmidhî | جامع الترمذي | registre (« جامع الترمذي، رقم ٣٧٠٣ ») |
| Ahmad, (al-)Musnad | مسند أحمد | registre (« مسند أحمد، رقم ١٧٢٠ ») |
| Mâlik, al-Muwatta' | مالك، الموطّأ | référence non vérifiée |
| al-Hâkim, al-Mustadrak | الحاكم، المستدرك على الصحيحين | registre |
| al-Bayhaqî, Dalâ'il an-Nubuwwa ; as-Sunan al-Kubrâ | البيهقي، دلائل النبوة ; البيهقي، السنن الكبرى | registre (Dalâ'il) |
| ad-Dâraqutnî, as-Sunan | سنن الدارقطني | référence non vérifiée |
| Ibn Abî Shayba, al-Musannaf ; 'Abd ar-Razzâq, al-Musannaf | ابن أبي شيبة، المصنَّف ; عبد الرزاق، المصنَّف | registre (Ibn Abî Shayba) |
| Abû Nu'aym, Hilyat al-Awliyâ' | أبو نعيم، حلية الأولياء | registre |
| Abû Yûsuf, Kitâb al-Kharâj | أبو يوسف، كتاب الخراج | référence non vérifiée |
| Ibn 'Abd al-Hakam, Futûh Misr | ابن عبد الحكم، فتوح مصر | référence non vérifiée |
| Ibn Abî Dâwûd, Kitâb al-Masâhif | ابن أبي داود، كتاب المصاحف | référence non vérifiée |
| Wakî', Akhbâr al-Qudât | وكيع، أخبار القضاة | référence non vérifiée |
| al-Isfahânî, Kitâb al-Aghânî | أبو الفرج الأصفهاني، الأغاني | référence non vérifiée |
| Ibn Qutayba, Kitâb al-Anwâ' ; Ibn Mâjid, Kitâb al-Fawâ'id | ابن قتيبة، كتاب الأنواء ; ابن ماجد، كتاب الفوائد | référence non vérifiée |
| Nahj al-Balâgha, lettre 53 | نهج البلاغة، الكتاب ٥٣ | registre (« نهج البلاغة، بشرح محمد عبده ») ; le registre dit aussi « في نسبته خلاف » |
| Eutychius, Annales | سعيد بن البطريق، التاريخ | Eutychius d'Alexandrie a écrit en arabe sous ce nom : on le nomme ainsi, non par une transcription du grec ; référence non vérifiée |
| Théophane, Chronographie ; chroniqueurs byzantins | ثيوفانيس، الحوليّات ; مؤرّخو الروم | référence non vérifiée |
| Eusèbe de Césarée, Histoire ecclésiastique | يوسابيوس القيصري، تاريخ الكنيسة | référence non vérifiée |
| fragment de la Geniza du Caire ; historiographie moderne | قطعةٌ من جنيزة القاهرة ; الدراسات التاريخية الحديثة | référence non vérifiée |

---

## 2. Le vocabulaire du jeu

Colonnes : **le français du jeu** ; **l'arabe retenu** (avec la vocalisation utile) ; **la source** : ouvrage, auteur,
chapitre ou page, et l'adresse lue ; **la note** (l'autre terme possible, ce qu'il faut éviter). « à valider » : terme
proposé faute d'équivalent établi, à faire confirmer par le décideur.

Adresses lues pour cette section (toutes consultées le 18 novembre 2026) :

- [A] WP-ar, *Ihyâ' 'ulûm ad-dîn*, tableau des quarante livres : `https://ar.wikipedia.org/wiki/إحياء_علوم_الدين`
- [B] al-Ghazâlî, *Ihyâ'*, livre « ذم البخل وذم حب المال » (texte intégral, Wikisource) :
  `https://ar.wikisource.org/wiki/إحياء_علوم_الدين/كتاب_ذم_البخل_وذم_حب_المال`
- [C] al-Ghazâlî, *Ihyâ'*, livre « ذم الغضب والحقد والحسد » : `https://ar.wikisource.org/wiki/إحياء_علوم_الدين/كتاب_ذم_الغضب_والحقد_والحسد`
- [D] al-Ghazâlî, *Ihyâ'*, livre « شرح عجائب القلب » : `https://ar.wikisource.org/wiki/إحياء_علوم_الدين/كتاب_شرح_عجائب_القلب`
- [E] al-Ghazâlî, *Ihyâ'*, livre « ذم الدنيا » : `https://ar.wikisource.org/wiki/إحياء_علوم_الدين/كتاب_ذم_الدنيا`
- [F] Ibn Rajab, *Jâmi' al-'ulûm wa-l-hikam*, commentaire du 13ᵉ hadith : `https://ar.wikisource.org/wiki/جامع_العلوم_والحكم/الحديث_الثالث_عشر`
- [G] Ibn Kathîr, *al-Bidâya wa-n-nihâya* (éd. as-Sa'âda), t. 7 p. 11-12, « وقعة اليرموك » : `https://shamela.ws/book/23708/2132` et `/2133`
- [H] Ibn Ma'sûm al-Madanî, *Anwâr ar-rabî' fî anwâ' al-badî'*, « الاستطراد » : `https://shamela.ws/book/5446/41`
- [I] Ibn Khaldûn, *al-Muqaddima*, ch. « في أن العصبية إنما تكون من الالتحام بالنسب أو ما في معناه » :
  `https://ar.wikisource.org/wiki/مقدمة_ابن_خلدون/الفصل_الثامن_في_أن_العصبية_إنما_تكون_من_الالتحام_بالنسب`
- [J] Khâlis Jalabî, sur Malek Bennabi, *Mushkilat al-afkâr fî l-'âlam al-islâmî* (les trois mondes : الأشياء، الأشخاص،
  الأفكار), *al-Watan*, 20 avril 2011 : `https://www.alwatan.com.sa/article/5297` (source secondaire ; le livre lui-même
  n'a pas été lu en ligne)
- [K] Occurrences coraniques, recherche sur le texte : `https://api.alquran.cloud/v1/search/<mot>/all/quran-simple-clean`
- [L] WP-ar, pages citées par leur titre : `https://ar.wikipedia.org/wiki/<titre>`
- [M] Sahîh Muslim, édition arabe du CDN : `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.min.json`
- [N] at-Tabarî, *Târîkh ar-rusul wa-l-mulûk*, édition de Wikisource, texte entier des volumes 3 (années 7 à 15), 4 (16 à
  36) et 5 (37 à 65), lu le 18 novembre 2026 : `https://ar.wikisource.org/wiki/تاريخ_الطبري/الجزء_الثالث` (puis
  `…/الجزء_الرابع`, `…/الجزء_الخامس`) ; les occurrences citées sont comptées sur le texte sans voyelles. La division de
  Wikisource n'est pas celle des volumes imprimés (le registre cite l'édition imprimée, « ج ٣ ص … »).
- [O] al-Balâdhurî, *Futûh al-buldân*, Shamela, livre 12221 (celui que lit le registre) : `https://shamela.ws/book/12221/<page>`
  (pages 121, 126 à 140, 150 à 158 lues).
- [P] al-Bukhârî, n° 4986, édition arabe du CDN : `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari/4986.min.json`
- [Q] at-Tirmidhî, n° 3747 (numérotation du CDN), édition arabe du CDN : `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi/3747.min.json`
- Les pages de WP-ar n'ont pas pu être relues pour les ajouts du 18 novembre au soir (l'API de Wikipédia refuse les
  lectures automatiques : « too many requests ») ; les ajouts s'appuient sur [K] et [N] à [Q], le registre et le moteur.

### 2.1 Mots réservés

| Français | Arabe | Règle |
|---|---|---|
| un Compagnon (du Prophète ﷺ) | **صحابيّ**, pl. **الصحابة** ; « صاحب رسول الله ﷺ » | réservé aux Compagnons. **Jamais** pour un membre du groupe, un compagnon de lumière, un ami de 2084. L'aide du combat disait « le grand acte du Compagnon » de tout héros, Idris et le Caïd compris (signalé au décideur, D184) ; le français dit désormais « pleine, elle ouvre à chacun son grand acte » : « أتاح لكلّ رفيقٍ فعلَه الأكبر ». |
| un compagnon (membre du groupe), les compagnons | **رفيق**, pl. **الرفاق** | « relève un compagnon éprouvé » → « يُنهِض رفيقًا مُنهَكًا ». |
| le groupe (l'équipe du joueur) | **الرَّكْب** | à valider. Le *rakb* est la troupe qui voyage ensemble. Éviter **الجماعة** (« la Communauté », sens religieux et confessionnel) et **الفريق** (sportif). |
| le Messager d'Allah ﷺ, le Prophète ﷺ | **رسول الله ﷺ**، **النبي ﷺ** | exigence 1. |
| Commandeur des croyants | **أمير المؤمنين** | titre d'Umar, d'Uthmân, d'Alî dans les répliques. |
| Iblîs | **إبليس** | nommé, jamais montré (exigence 18) ; jamais dans un nom de combattant ni de compétence. |

### 2.2 Ce qu'aucun ennemi, aucune compétence, aucun objet ne s'appelle

Le validateur refuse en français les noms d'Iblîs, d'un démon ou d'un djinn. En arabe, la liste est plus longue,
parce que des mots ordinaires y portent un sens religieux ou confessionnel. **Aucun nom de chimère, d'idole, de
compétence, d'objet ni de lieu frappé ne contient** :

| Mot | Pourquoi |
|---|---|
| شيطان، شياطين، إبليس، جنّ، جنّي، جانّ، عفريت، مارد، غول، سِعلاة، قرين، هامة | démons, djinns, êtres du folklore (exigences 6 et 18). « القرين » est le compagnon-djinn de chaque homme. **Attention** : Dirâr ibn al-Azwar reçut des Rûm un surnom contenant « شيطان » (WP-ar, « ضرار بن الأزور ») : le jeu ne l'emploie jamais. |
| فتنة، الفتنة | désigne en arabe les guerres entre Compagnons (WP-ar, « معركة صفين » : « تاريخ الفتنة الأولى ») : aucune chimère ne s'appelle ainsi (exigence 5). |
| خوارج، حرورية، مُحكِّمة، رافضة، ناصبة، أهل الأهواء، مبتدعة | noms de partis et de sectes : jamais pour un ennemi, jamais pour qualifier les gens de Harûrâ' ou de Nahrawân, qui sont des hommes (exigence 6). Dans un récit, on dit ce qu'ils font, sobrement. |
| طاغوت | mot coranique qui vise aussi des hommes : trop lourd. |
| الله, et les Noms divins employés comme noms : الحقّ، الحَكَم، الحكيم، الوليّ، المَلِك، القهّار، الجبّار، الرحمن، الرحيم، الكريم | exigence 8 : « Le Juge sans miséricorde » est **القاضي**, jamais الحَكَم ; « le sage » n'est pas الحكيم (§ 2.6). Les mots communs العدل، الرحمة، الكرم restent permis comme noms de vertus, jamais comme nom propre d'une chose qu'on frappe. |
| العرش، الكرسيّ (dans les récits anciens) | en arabe classique, le Trône et le Siège sont d'abord ceux d'Allah : une idole nommée « العرش الخالي » se lirait de travers. Le trône d'un roi est **السرير** (« سرير المُلك », « سرير كسرى ») ; en 2084 seulement, **الكرسيّ** au sens moderne du pouvoir (§ 3.6). |
| العُقاب | c'est le nom de la bannière du Prophète ﷺ dans la sîra (référence non vérifiée en ligne) : « l'Aigle d'Airain » n'est pas un عقاب. |
| نَسر seul | Nasr est une idole nommée au Coran 71:23 [K] : le compagnon de lumière se dit toujours de son nom d'étoile entier, **النسر الطائر** ; l'idole de Rûm, **نسر النحاس** (§ 3.6). |
| المَدَد، الغَوث، القُطب | mots des invocations soufies et de leurs débats (exigence 5) : « le secours » est **الفَرَج** (§ 2.5). |
| الملحمة، الملاحم ; الجهاد | la première désigne les batailles de la fin des temps ; la seconde est une catégorie de la loi : une bataille déclarée contre une idole n'est ni l'une ni l'autre (exigence 19). |
| الحساب | le Jugement (يوم الحساب) : « Le Compte » est **الرَّصيد** (§ 3.6). |
| مَنافق pour un personnage nommé | exigence 11 : l'hypocrite est fictif ; le texte le montre, il ne le traite pas de منافق. |

### 2.3 Les mots propres au jeu (AGENTS.md, « Conventions »)

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| **Constance** (points de vie) | **الثَّبات** | Ibn Kathîr emploie le verbe dans ce sens à Yarmoûk : « إنكم لا تثبتون » (« vous ne tiendrez pas ») [G, p. 11] | **à valider**. Autre choix : الجَلَد (l'endurance), mais sans voyelles il se lit « la peau ». Abréviation d'interface : ثبات. |
| **Souffle** (points de magie) | **النَّفَس** (toujours vocalisé) | usage courant (« نَفَس طويل »), référence non vérifiée | **à valider**. Sans la fatha, النفس se lit « l'âme » (al-Ghazâlî, [D], « بيان معنى النفس والروح والقلب والعقل ») : la voyelle est obligatoire partout. |
| **éprouvé** (hors de combat) | **مُنهَك** (verbe : أُنهِك) | usage courant | **à valider**. Exigence 19 : jamais جريح، قتيل، صريع، سقط (blessé, tué, abattu). |
| **voile** (la garde d'une chimère), **voiles** | **حِجاب**, pl. **حُجُب** | al-Ghazâlî, [D] : parmi les cinq causes qui empêchent le miroir du cœur de refléter le vrai, « حجاب مرسل بين المرآة والصورة » | **à valider**. Un voile ôté : « انهتك حجاب » ou « سقط حجاب ». Ne pas confondre avec le « voile de lumière » des Compagnons (§ 2.9). |
| **dévoilé** (une chimère vaincue : on a montré qu'elle est vide) | **انكشف** ; adj. **مكشوف** ; « انكشف خواؤه » | al-Ghazâlî, [D] : le cœur poli « … حتى يتلألأ فيه جلية الحق وينكشف » | **à valider**. Éviter الكشف seul (dévoilement mystique soufi). |
| **Niyya** (l'intention, jauge) | **النيّة** | al-Ghazâlî, *Ihyâ'*, livre « النية والإخلاص والصدق » (quart des « المنجيات ») [A] | |
| **Sérénité** (la jauge ; « Sakîna » jusqu'à D184) | **الهُدوء** ; « +الهدوء » ; « يستعيد الركب هدوءه » (« le groupe retrouve sa sérénité ») | usage courant (« حافظ على هدوئه ») ; « هدوء » et « الهدوء » ne sont pas au Coran [K] | **à valider (D184)**. Le décideur a écarté « Sakîna » en français : le Coran la dit descendue par Allah (48:4, 48:18 ; « سكينته », 9:26, 9:40, 48:26 [K]), et une jauge que la prière remplit à coup sûr en ferait l'effet d'un rite. L'arabe prend le mot ordinaire du calme qu'on garde dans l'épreuve. Écartés : **السَّكينة** (même raison) ; **الطُّمأنينة** : le Coran l'emploie pour les cœurs rassurés par le rappel (13:28) et, à Badr, par le secours (3:126 ; 8:10) [K], et le fiqh nomme ainsi l'immobilité de chaque position de la prière (al-Bukhârî, n° 757 : « ثم اركع حتى تطمئن راكعا » [CDN : `ara-bukhari/757`]) — le mot servait aux pourparlers, il est remplacé là aussi (« هدوء الصلاة: الثقة +١ »), car le français n'a plus qu'un mot ; **رباطة الجأش** : deux mots, et l'image coranique du cœur affermi (18:14, 8:11 [K]). La Gazelle « apaise » (**التهدئة**, § 2.5) : elle donne du الهدوء. Si un feuillet du recueil cite un jour le verset de la *sakîna*, le mot y revient, avec son texte tiré du registre : c'est un autre sujet. |
| **râwî** (le transmetteur, personnage du joueur) | **الراوي** ; au vocatif **يا راوي** | al-Khatîb al-Baghdâdî, *al-Jâmi' li-akhlâq ar-râwî wa-âdâb as-sâmi'* [L, « الجامع لأخلاق الراوي وآداب السامع »] | Le pluriel, **الرواة**. Sa descente : **نزول الراوي** (§ 2.5), jamais « نزولك » (§ 1.8). |
| **isnad** | **الإسناد** (le titre du jeu : إسناد) | WP-ar, « سند (علم الحديث) » : « السند أو الإسناد … هو سلسلة الرواة الذين نقلوا الحديث واحدا عن الآخر » [L] | |
| **la Chaîne** (l'écran des maillons) | **السِّلسلة** | même page : « سلسلة الرواة » [L] | « La Chaîne entière » (compétence d'Idris) : « السلسلة كاملةً ». « Chaîne fidèle » (titre d'une saga jouée sans faute ; « Isnâd sahîh » jusqu'à D184, relecture 2.21) : **سلسلةٌ وفيّة**, du même mot que « الوفاء للسلسلة » (« Fidélité à la Chaîne ») ; jamais un mot par lequel les savants du hadith jugent une chaîne (صحيح، متّصل، منقطع، ثقة، محفوظ) : ce serait changer leur jugement en score. **À valider (D184).** |
| **maillon** (une saga) | **الحَلْقة** (vocalisée à la première occurrence) | usage courant (« حلقة في سلسلة »), référence non vérifiée | La حَلَقة, elle, est un cercle d'étude (WP-ar, « حلقة علم ») : le jeu dit pour ce sens **مجلس العلم** (§ 3.3). « ce maillon » (D184, 2.6 ; « ce règne » jusque-là) : « هذه الحَلْقة » (« ما بُني في هذه الحَلْقة ») ; jamais العهد ni المُلك : un califat n'est pas un règne. |
| **chimère** (l'ennemi du jeu ; « égrégore » jusqu'à D183) | **خَيال**, pl. **خَيالات** — inchangé (D183) | proposition tirée du théâtre d'ombres arabe, **خيال الظل**, aussi nommé « شخوص الخيال، طيف الخيال » : des figures découpées qui semblent vivre quand beaucoup les regardent ensemble à la lumière d'une lampe, et ne sont qu'une ombre (WP-ar, « خيال الظل » et « ابن دانيال », poète mamelouk de ce théâtre) [L] | **à valider**. D183 : le décideur a écarté « égrégore », mot de l'ésotérisme ; خيال disait déjà l'illusion qu'on dévoile : il reste. Le mot n'évoque ni djinn ni démon, et dit ce que le jeu dit : une forme vide qui prend corps sous le regard. « une chimère de la tyrannie » : « خيالُ الطغيان ». Autre choix : **وَهْم**, pl. أوهام (« une illusion »), plus abstrait. Écartés : طَيف (le mot sert aussi, chez des commentateurs, pour le toucher du diable en Coran 7:201 — référence non vérifiée), شَبَح (« fantôme » : esprit des morts, hantise), فتنة، طاغوت، هوى (§ 2.2). |
| **idole** (la chimère d'un chapitre, la plus enracinée) | **الصَّنَم**, pl. **الأصنام** | Malek Bennabi : « عندما تغرب الفكرة يبزغ الصنم » (cité par le blog d'Al Jazeera « أفكارنا أصنامنا », 30 avril 2018, qui la situe dans *Shurût an-nahda* ; source secondaire, non relue dans le livre) | Autre choix : الوثن. |
| **noosphère** (l'envers de la ville) | **عالم الأفكار** | Malek Bennabi, *Mushkilat al-afkâr fî l-'âlam al-islâmî* : عالم الأشياء، عالم الأشخاص، عالم الأفكار [J] | Chez Bennabi, c'est l'univers des idées d'une société ; le jeu en fait un lieu. Ne pas écrire النوسفير (calque). Carte : **عالم الأفكار** ; « dans la noosphère » : « في عالم الأفكار ». **Validé par le décideur le 18 novembre (D185).** |
| **idées noires** (cinq) | **الخواطر السُّود** (sg. خاطرٌ أسود) | al-Ghazâlî, [D] : « وأعني بالخواطر ما يحصل فيه من الأفكار والأذكار » ; « السود » rappelle « السوداء », l'humeur noire de la vieille médecine | **à valider**. Autre choix : **الهموم** (« les soucis »), mais la honte n'est pas un *hamm*. Les cinq : § 2.5. |
| **maux du cœur** (sept) | **أمراض القلوب** ; un mal : **مرضٌ من أمراض القلب** | al-Ghazâlî, [C], « بيان الدواء الذي ينفي مرض الحسد عن القلب » : « الحسد من الأمراض العظيمة للقلوب، ولا تداوى أمراض القلوب إلا بالعلم والعمل » | Pas « مرض القلب » seul dans une interface (« maladie cardiaque ») : « داء القلب » en abrégé. |
| **lames** (forgées par les œuvres) | **النِّصال** (sg. **نَصْل**) ; « forger » : **صَقَل** (« la prière a poli la lame de la Sincérité ») | l'image du cœur-miroir qu'on polit : al-Ghazâlî, [D] : « تزيد مرآة القلب جلاء وإشراقاً ونوراً » | **à valider** (le nom et le verbe). Éviter « مطبوع » (forgé, au sens ancien : WP-ar, « مهند (اسم) », « السيوف المطبوعة من حديد الهند ») : il se lit aujourd'hui « imprimé ». Exigence 16 : une lame n'a ni nom d'homme ni inscription. |
| **provision du cœur** (zâd) | **الزاد** ; **زاد القلب** | Coran 2:197 [K] (le recueil du jeu cite ce verset) | |
| **compagnons de lumière** (animaux de fiction) | **رفاق النور** | — | **à valider**. Jamais صحابة ni أصحاب (§ 2.1). |
| **halte** (le menu) | **الاستراحة** | — | **à valider**. Autre choix : المَنزِل (la halte des caravanes), mais « المنزل » se lit « accueil » dans une interface. |
| **veillée** (les veillées du Caïd) | **السَّمَر** ; une veillée : **ليلة** ; les veillées du Caïd : **ليالي القائد** ; « Veillée de la Véracité » : **ليلة الصدق** | Abû Hayyân at-Tawhîdî, *al-Imtâ' wa-l-mu'ânasa*, « ما جرى في سبع وثلاثين ليلة » [L, « الإمتاع والمؤانسة (كتاب) »] | **à valider**. |
| **Cité-Miroir** (la ville de 2084) | **مدينة المرايا** | fiction | **à valider**. |
| **pourparler** | **المُحاوَرة** (verbe : حاوَر) | Coran 18:34 et 18:37, « وهو يحاوره » [K] | **à valider**. Autre choix : المفاوضة (plus diplomatique). « Pourparler gagné / perdu » : « نجحت المحاورة / لم تنجح المحاورة ». |
| **bataille déclarée** | **المُصافّة** (la bataille rangée, où chacun voit les rangs d'en face) | usage des chroniqueurs, référence non vérifiée en ligne ; les rangs eux-mêmes : « صفوف الروم » [G, p. 11] | **à valider**. Le carton dit : « مُصافّة مُعلَنة ». Écartés : الزحف (Coran 8:15 [K], contexte de combat contre des hommes), الملحمة, الجهاد (§ 2.2). |
| **le secours** | **الفَرَج** (« جاء الفرج ») | at-Tanûkhî, *al-Faraj ba'd ash-shidda* (WP-ar, « الفرج بعد الشدة », qui cite aussi les livres du même titre d'al-Madâ'inî et d'Ibn Abî d-Dunyâ) [L] | **à valider**. Le *faraj* vient, on ne le commande pas : c'est ce que dit le jeu. Écartés : المَدَد، الغَوث (§ 2.2). |
| **les degrés du mal** (« l'organigramme du mal » jusqu'à D183) | **مراتب الشرّ** — inchangé | — | **à valider**. Titre de la page : « مراتب الشر » ; « Les degrés » : « المراتب ». D183 : le français a pris le mot que l'arabe avait déjà (*marâtib*, les degrés) : rien ne change. |
| **les souffleurs** | **المُوَسْوِسون** | Coran 114:4, « الوسواس » [K] ; al-Ghazâlî, [D], « بيان تسلط الشيطان على القلب بالوساوس » | Jamais dessinés ni combattus. Le texte coranique, s'il est cité, vient du registre. |
| **« démons intérieurs »** (façon de parler, aussitôt expliquée) | « **شياطين النفس** » (entre guillemets) | usage courant | **à valider**. Le jeu enchaîne : « ليست شياطين: إنها أمراض القلب ». |

### 2.4 Combat et fiche des personnages

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| faille (d'une chimère) ; « Frapper la faille » | **الثُّلمة** ; « ضرب الثُّلمة » | al-Ghazâlî, [D], « بيان تفصيل مداخل الشيطان إلى القلب » : le cœur est une forteresse, qu'on garde « بحراسة أبواب الحصن ومداخله ومواضع ثلمه » | **à valider**. Autre choix : الثغرة (sens militaire courant). |
| Vertus (le menu des compétences) | **الخِصال** (sg. خَصلة) | — | **à valider**. Distinct des Valeurs (الفضائل, § 2.5) et des Lumières (الأنوار, § 2.8). « Vertus du groupe » (D184, 2.20 ; « Lumières du groupe » jusque-là) : « خِصال الركب ». |
| Garde (commande) ; « se garder » | **التحصّن** ; « يتحصّن » | même image de la forteresse [D] | **à valider**. |
| Objets (menu de combat), la besace | **المِزوَد** (le sac à provisions, de *zâd*) | usage courant, référence non vérifiée | Autre choix : الجِراب. |
| Force (atk) · Esprit (mag) · Garde (def) · Élan (spd) | **القوّة · الذِّهن · المَنَعة · الخِفّة** | — | **à valider**. « Esprit » n'est pas الروح (sens religieux). |
| niveau | **المرتبة** (« المرتبة ٣ ») | — | Autre choix : المستوى (plus moderne). |
| Expérience (ce que rapportent combats et pourparlers ; « Sagesse acquise » jusqu'à D184, 2.5) | **الخِبرة** (« الخبرة: +٣ ») | usage courant (« نقاط الخبرة ») | **à valider (D184)**. On ne gagne pas la sagesse en gagnant un combat : الحكمة ne sert plus ici. Nom commun ; jamais الخبير, qui est un Nom divin (§ 2.5). |
| doute (altération) | **التردّد** | — | |
| murmure intérieur (altération `waswas`) | **الوسوسة** | Coran 114:4 [K] ; [D] « بالوساوس » | |
| étourdi, sonné | **مذهول** | — | |
| relever un compagnon éprouvé | **أنهضَ** (« نهض الرفيق ») | — | Jamais « أحيا » (rendre la vie : Allah seul). |
| ôter les altérations | **يُزيل العوارض** | — | Jamais « يُطهِّر » (pureté rituelle). |
| dirham (la monnaie du jeu) | **دِرهم**, pl. **دراهم** | — | |
| rôles : guerrier · gardien · sage · soigneur · stratège | **المُقاتل · الحامي · العالِم · المُداوي · صاحب الرأي** | « صاحب الرأي » : WP-ar, « الحباب بن المنذر » : « وكان ذو رأي ومشورة » [L] | **à valider**. Le rôle « sage » (العالِم) n'est pas la figure « sage » (البصيرة, § 2.6). |
| tempérament (d'où vient la première figure) | **الطَّبع** | al-Ghazâlî, [D] : « والهم على وفق الطبع » | |

**Les descriptions de compétences** (*ajout du 18 novembre, lexique commun ; à valider*). Les mêmes tournures reviennent
dans les sept récits (« révèle les failles » dans tous, « sur toutes les chimères » dans cinq, « attire les coups » dans
cinq…) : elles s'écrivent partout de la même façon, avec les mots que `tables` et `moteur` ont déjà posés. Une Lumière,
dans une description, se dit « نور X » (moteur : « {lumiere} retrouvée » → « نور {lumiere} مُستعاد ») : « الصدق » seul se
lirait la vertu.

| Français | Arabe | Déjà écrit dans le jeu |
|---|---|---|
| rend de la Constance à un compagnon ; à tout le groupe ; rend 40 % de Constance | يُعيد إلى رفيقٍ شيئًا من الثبات ; يُعيد إلى الركب كلّه شيئًا من الثبات ; يُعيد إلى رفيقٍ ٤٠٪ من الثبات | tables (objets) ; posé partout |
| soigne un compagnon ; soigne le groupe | يُداوي رفيقًا ; يُداوي الركب | le rôle « soigneur », المُداوي (ci-dessus) |
| rend du Souffle (au groupe) | يُعيد شيئًا من النَّفَس (إلى الركب) | § 2.3 (toujours vocalisé) |
| Relève un compagnon éprouvé. | يُنهِض رفيقًا مُنهَكًا. | tables ; posé partout |
| régénération pendant 3 tours ; le régénère ; Régénération pour tout le groupe. | يتجدّد ثباته ثلاثة أدوار ; يتجدّد ثباته ; يتجدّد ثباتُ الركب كلّه شيئًا فشيئًا. | moteur : « Régén. » → « تجدّد », « Tours » → « الأدوار » ; posé partout |
| dissipe les altérations | يُزيل العوارض | tables |
| dégâts de Véracité ; lourds dégâts ; légers dégâts | ضررٌ بنور الصدق ; ضررٌ شديد بنور… ; ضررٌ يسير بنور… | moteur : « dégâts reçus réduits » → « ضررٌ أقلّ مما يُصاب » |
| frappe de Courage ; Miséricorde sur une chimère ; Justice sur toutes les chimères | ضربةٌ بنور الشجاعة ; نور الرحمة على خيال ; نور العدل على الخيالات كلّها | « خيال » (§ 2.3) |
| déchire un voile ; deux voiles ; leurs voiles | يهتك حجابًا ; يهتك حجابين ; يهتك حُجُبها | moteur : « {lame} tranche ses voiles » → « انهتكت الحُجُب أمام {lame} » |
| révèle les failles (d'une chimère) | يكشف ثُلَم الخيال | moteur : « Failles révélées » → « انكشفت الثُّلَم » |
| dissipe les bonus ; bonus dissipés | يُبدّد ما زِيدَ له ; وتبدّد ما زِيدَ لها | moteur : « Dissipé » → « تبدّد » ; « ما زيد له » est une proposition |
| attire les coups | تقصده الضربات | moteur (figures) : « والضربات تقصدك » |
| se met en garde | يتحصّن | ci-dessus ; moteur : « En garde » → « متحصّن » |
| peut étourdir | قد يُذهِل (après « ضربة » : قد تُذهِل) | moteur : « peut étourdir ({n} %) » → « قد يُذهِل ({n}٪) » ; posé : « ضربةٌ بالدِّرّة. قد تُذهِل. » |
| +2 Niyya ; accorde 2 points de Niyya | النيّة +٢ ; يزيد النيّة نقطتين | moteur ; tables |
| Force accrue ; Esprit accru ; défense du groupe accrue | قوّةٌ أكثر ; يزداد الذِّهن ; تزداد مَنَعة الركب | moteur (figures) : « قوّةٌ أكثر » |
| affaiblit l'attaque de la cible ; affaiblit leur assaut | يُضعف ضربة الخصم ; يُضعف هجومها | — |
| Donne sans compter | يجود ولا يُحصي | posé partout ; **pas** « بغير حساب » (sept occurrences au Coran, de 2:212 à 40:40, presque toutes dites de ce qu'Allah donne [K]) ni « بلا حساب » (« الحساب » est réservé, § 2.2) |

### 2.5 Le cœur (`coeur.js`)

**Les œuvres** (`D.OEUVRES`) — elles ne donnent aucun pouvoir (exigence 15) : on ne les écrit jamais avec un verbe
d'effet magique (لا « تمنح »، « تهب قوة »), mais « تُعِدّ القلب » (elles préparent le cœur), « تزيد الزاد ». Le compte
qu'en tient le jeu se dit **تُعَدّ** (vocalisé), jamais « تُحتسب » : avec « الأعمال », ce mot se lit comme l'iḥtisâb, la
récompense qu'on espère d'Allah (« مَن صام رمضان إيمانًا واحتسابًا », al-Bukhârî n° 38, éd. du CDN), ou comme l'œuvre qui
« compte » en droit ; le jeu ne dit rien de ce qui compte devant Allah (exigences 13 et 15).

| Français | Arabe retenu (court · menu) | Source | Note |
|---|---|---|---|
| La prière | **الصلاة** · « صلاة » | *Ihyâ'*, « أسرار الصلاة ومهماتها » [A] | |
| Le dhikr | **الذِّكر** · « الذكر بعد الصلاة » | *Ihyâ'*, « الأذكار والدعوات » [A] | |
| L'étude du Coran | **مُدارسة القرآن** · « المدارسة » | Muslim : « … يتلون كتاب الله ويتدارسونه بينهم » (n° 2699 de la numérotation d'Abd al-Bâqî ; 6853 dans l'édition du CDN) [M] ; *Ihyâ'*, « آداب تلاوة القرآن » [A] | L'œuvre se fait « devant quelqu'un qui écoute » : c'est la *mudârasa*. |
| Le jeûne | **الصيام** · « صيام اليوم » | *Ihyâ'*, « أسرار الصوم » [A] | |
| L'aumône | **الصدقة** · « صدقة السرّ » | usage courant | Jamais الزكاة (l'aumône légale, autre chose). |
| La visite | **الزيارة** · « زيارة قريب أو عيادة مريض » | usage courant | Jamais « الزيارة » seule là où elle pourrait se lire « visite des tombeaux » (débat entre écoles, exigence 5) : on précise qui l'on visite. |
| Le pèlerinage | **الحجّ** · « الحج مع القافلة » | *Ihyâ'*, « أسرار الحج » [A] | |

**Les sept maux du cœur et leurs lames** (`D.VICES`, `lames`, `valeurs`) — chaque paire vient d'al-Ghazâlî ou d'Ibn
Rajab, qui opposent ces mots l'un à l'autre.

| Mal (chimère) | Arabe | Source du mal | Lame = Valeur | Arabe | Source de la lame |
|---|---|---|---|---|---|
| L'Avidité | **الحِرص** | [B], « بيان ذم الحرص والطمع » | Le Contentement | **القَناعة** | [B] : « القناعة والحرص، وإحداهما مذمومة والأخرى محمودة » ; « ومدح القناعة واليأس مما في أيدي الناس » |
| L'Orgueil | **الكِبْر** | *Ihyâ'*, « ذم الكبر والعجب » [A] (texte non lu en ligne) | L'Humilité | **التواضع** | [F] : « قال بعض السلف التواضع أن تقبل الحق من كل من جاء به » |
| L'Ostentation | **الرِّياء** | *Ihyâ'*, « ذم الجاه والرياء » [A] | La Sincérité | **الإخلاص** | *Ihyâ'*, « النية والإخلاص والصدق » [A] |
| L'Avarice | **البُخل** | [B], « بيان ذم البخل » | La Largesse | **السَّخاء** | [B], « بيان فضيلة السخاء » ; « بيان حد السخاء والبخل وحقيقتهما » |
| L'Insouciance | **الغَفلة** | [E] ; [D] : « لخلوها بالغفلة عن الذكر » | L'Ardeur | **الهِمّة** (« علوّ الهمة ») | [E] : « جميع أمور الدنيا انتظمت بالغفلة وخسة الهمة. ولو عقل الناس وارتفعت هممهم… » |
| L'Envie | **الحَسَد** | [C], « بيان ذم الحسد » | La Bienveillance | **سلامة الصدر** | [F] : vouloir pour son frère ce qu'on veut pour soi « إنما يأتي من كمال سلامة الصدر من الغش والغل والحسد » |
| La Colère | **الغَضَب** | [C], « بيان ذم الغضب » | La Longanimité | **الحِلم** | [C], « بيان فضيلة الحلم » |

Notes :
- **Largesse** : le français donne *al-Karam* ; al-Ghazâlî oppose **السخاء** à البخل [B]. On garde السخاء pour la lame ;
  الكرم reste possible dans une phrase. (§ 4)
- **Bienveillance** : le français donne *an-Nasîha*. Ibn Rajab range bien ce souhait « من جملة النصيحة لعامة المسلمين »
  [F], mais **النصيحة** se lit aujourd'hui « le conseil » : « la lame du Conseil » tromperait. Retenu : **سلامة الصدر**,
  même page, même auteur. (§ 4)
- Al-Ghazâlî nomme lui-même le défaut d'*al-himma* : « خِسّة الهمة » [E] ; c'est bien la paire du jeu.
- Les sept chimères portent ces noms avec l'article (الحرص، الكبر…) ; leurs répliques sont des répliques, jamais des
  versets ni des hadiths.

**Les idées noires** (`D.NOIRS`) :

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| La Honte (la peur du regard des siens) | **العار** | usage courant, référence non vérifiée | Jamais **الحياء** (la pudeur, une vertu louée) ni **الخِزي** (l'opprobre du Jugement). |
| La Peur (ce qui n'est pas arrivé, vécu comme fait) | **الخوف** | — | **à valider**. Chez al-Ghazâlî, le *khawf* d'Allah est une station louée (*Ihyâ'*, « الخوف والرجاء » [A]) : le texte doit montrer qu'il s'agit d'une peur de l'avenir. Autre choix : **الهَلَع**. |
| Le Soupçon | **سوء الظنّ** | [D] : parmi les portes du cœur, « ومن أبوابه سوء الظن بالمسلمين » | La petite chimère « Soupçon » du récit d'Alî est **الرِّيبة** (§ 3.6) : deux mots, deux choses. |
| La Rancune | **الحِقد** | [C], « القول في معنى الحقد ونتائجه » | |
| Le Désespoir | **اليأس** | usage courant | Jamais **القنوط** : le Coran l'emploie pour qui désespère de la miséricorde de son Seigneur (15:56 ; 39:53 [K]), ce que le jeu ne dit de personne. Al-Ghazâlî loue « اليأس مما في أيدي الناس » [B] : dans un texte, préciser de quoi l'on désespère. |

**Les trois manières de répondre** (`D.VOIES`) :

| Français | Arabe retenu | Note |
|---|---|---|
| Dire vrai (la parole) | **المُصارحة** (« بالكلمة الصادقة ») | **à valider**. Pas الصدق seul : c'est la Lumière d'Abû Bakr. |
| Expliquer (la pédagogie) | **البيان** (« بالتبيين ») | **à valider**. Le mot classique de l'explication claire. |
| Rassurer (la bienveillance) | **الرِّفق** | **à valider**. |

**Les compagnons de lumière** (`animaux`) — figures du ciel, fiction dite comme telle (exigence 16) :

| Français | Arabe retenu | Source | Don (fr → ar) |
|---|---|---|---|
| Le Renard des sables | **ثعلب الرمال** | conte, fiction | Flair → **الشَّمّ** |
| L'Aigle | **النسر الطائر** | l'étoile Altaïr : WP-ar, « النسر الطائر (نجم) » [L] | Regard → **النَّظَر** |
| Le Phénix | **العنقاء** | WP-ar, « عنقاء » : « طائر خيالي ورد ذكره في الأساطير العربية القديمة » [L] | Renaissance → **النهوض** (jamais البعث, la Résurrection) |
| Le Lion | **الأسد** | le lion céleste des anciens Arabes, référence non vérifiée | Présence → **الهَيبة** |
| La Gazelle | **الظَّبي** (« قفزات الظباء », les trois paires d'étoiles) | référence non vérifiée (pas de page WP-ar) | Apaisement → **التهدئة** (elle rend un peu de Sérénité, **الهدوء**, § 2.3 ; plus de « Sakîna », D184) |

**Valeurs et attributs** (`bien`, `valeurs`, `attributs`) :

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| Valeurs et attributs (la page) | **الفضائل والأسماء الحسنى** | « الأسماء الحسنى » : Coran 7:180 [K] ; al-Ghazâlî, *al-Maqsad al-asnâ fî sharh ma'ânî asmâ' Allâh al-husnâ* [L, « المقصد الأسنى »] | Le mot **صفات** (« attributs ») est celui d'une théologie disputée (exigence 5) : on dit « اسمٌ من أسماء الله الحسنى ». |
| une Valeur | **فضيلة**, pl. **الفضائل** | — | |
| un badge | **شارة**, pl. **الشارات** | — | Sans inscription (exigence 21). |
| reconnaître un attribut / ne pas le posséder ; « Un attribut divin à reconnaître » ; « attributs reconnus » | « **يُتعرَّف إليه** » (« والاسم لا يُملَك: إنما يُتعرَّف إليه ») ; « اسمٌ من أسماء الله الحسنى يُتعرَّف إليه » ; « الأسماء المُتعرَّف إليها » ; jamais un verbe de possession (نال، ملك، اكتسب) | — | Exigence 21. Sans « tu » (§ 1.8) : le jeu ne dit pas au joueur ce qu'il a reconnu (plus de « تعرّفتَ »، « تتعرّف إليه »). |
| les sept Noms | **الرَّزَّاق** · **الكَبِيرُ المُتَعَال** · **الخَبِير** · **الوَهَّاب** · **الحَيُّ القَيُّوم** · **اللَّطِيف** · **الحَلِيم** | les versets du jeu (51:58 ; 13:9 ; 67:14 ; 3:8 ; 2:255 ; 42:19 ; 2:263), dont le texte vient du registre | Vocalisés en entier ; jamais sur un sprite (exigence 8). |

**Les portes et la descente** (`portes`) :

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| les portes de la noosphère | **أبواب عالم الأفكار** | l'image du cœur-forteresse et de ses portes, [D] | |
| Au sortir de la prière · Dans le dhikr · En songe | **عَقِبَ الصلاة · في الذِّكر · في المنام** | — | « En songe » : **المنام**, jamais **الحُلم** ni **الرؤيا** : un hadith attribue la *ru'yâ* droite à Allah et le *hulm* au Diable (al-Bukhârî, n° 3292 [CDN : `ara-bukhari`]). |
| S'endormir ; un sommeil sans songe | **النوم** ; **نومٌ بلا منام** | — | |
| descendre ; la descente du râwî (« ta descente » jusqu'au 18 novembre) ; le choix « Descendre » (à la porte) | **النزول** ; **نزولُ الراوي** ; « **النزول** » | — | À la troisième personne (§ 1.8) : jamais « نزولك », ni l'impératif « انزل ». Jamais non plus « النزول إلى النفس » : le décideur a écarté « descendre en soi » (« on a dit descendre dans la noosphère ») ; on descend **إلى عالم الأفكار**. |
| le labyrinthe | **المتاهة** | — | |
| l'issue | **المَخرَج** | Coran 65:2 [K] | |
| un abri | **مَلجأ** | — | |
| ce qui rôde | **ما يحوم** | — | |
| le chrono | **المُهلة** | — | |
| le seuil | **العَتَبة** | — | |
| rattrapé | **أُدرِك** | — | |
| les cartons de la descente, à la troisième personne (2.08) | « L'issue est trouvée » : **وُجِد المَخرَج** ; « Le râwî a tenu » : **ثبت الراوي** ; « %s a rattrapé le râwî » : **أدرك الراويَ %s** ; « La noosphère s'ouvre. Le râwî y descend. » : **ينفتح عالم الأفكار، فينزل إليه الراوي** | — | Proposés pour `coeur.js` (`portes`), qui reste à écrire. « ثبت » est le verbe de la Constance (الثبات) ; l'objet avant le nom laisse le verbe au masculin, même pour « الغفلة ». |
| le secours (titre) ; « Le groupe est relevé » | **الفَرَج** ; « نهض الركب » | § 2.3 | La préparation et le carton parlent du chapitre et du râwî, jamais au joueur de sa prière (§ 1.8) : « صلّى الراوي في هذا الفصل » ; « إذا أُقيمت الصلاة في الفصل » ; plus de « Tu avais tenu ta prière ». |

**Les degrés du mal** (`mal` ; « l'organigramme du mal » jusqu'à D183) :

| Français | Arabe retenu | Source |
|---|---|---|
| Les degrés du mal | **مراتب الشرّ** — inchangé (D183 : le français a rejoint le mot arabe) | à valider |
| Iblîs — l'ennemi déclaré | **إبليس — العدوّ المبين** | Coran 2:168 [K] (référence que donne déjà le jeu) |
| Les souffleurs — des démons d'entre les djinns, et parfois des hommes | **المُوَسْوِسون — شياطين من الجنّ، ومن الإنس أحيانًا** | Coran 114:4-6 [K] |
| Le cœur — il entend, et il consent ou refuse | **القلب — يسمع، فيقبل أو يأبى** | [D] |
| Les idées noires — ce qui pèse sur une personne | **الخواطر السود — ما يُثقِل على المرء** | § 2.3 |
| Les chimères — l'idée reprise par beaucoup de cœurs | **الخيالات — فكرةٌ تتناقلها قلوبٌ كثيرة** | § 2.3 |
| Les idoles — l'idée enracinée : elle commande | **الأصنام — فكرةٌ تجذّرت فصارت تأمر** | § 2.3 |
| l'enracinement (jauge d'une idole) ; une racine | **التجذّر** ; **جِذر** | à valider. Jamais **الرسوخ** (loué : « والراسخون في العلم », Coran 3:7 [K]). |
| ce qui est enseigné / les images du jeu (les deux étages) | **ما جاء به النقل / صُوَرٌ من صُوَر اللعبة** | à valider |

### 2.6 Les figures (exigence 24 ; « les postures » jusqu'à D184)

**Choix proposé : l'arabe nomme la figure par l'acte, non par la personne.** La raison est arabe : « الحكيم » (le sage)
et « الوليّ » (le saint) sont aussi des Noms divins (§ 2.2), et « وليّ » porte une doctrine (les *awliyâ'* et leurs
prodiges) que les écoles ne lisent pas de la même façon (exigence 5) ; dire « الوليّ » d'un personnage, c'est dire qu'il
*est* un saint, ce que l'exigence 24 interdit. Un nom d'acte se *prend*, il ne se possède pas. Le décideur a remplacé
« posture » par « figure » en français (D184) ; l'arabe garde les trois noms d'acte et change le mot qui les désigne.

| Français | Arabe retenu | Source | Devise (fr) ou note |
|---|---|---|---|
| Les figures ; « Prendre une figure » (l'outil) ; « {nom} · figure : le héros » | **المواقف** (sg. **مَوقِف**) ; « **اتّخاذ موقف** » ; « خالد · الموقف: الإقدام » ; « une autre s'ouvre au niveau 4 » : « ويُتاح غيرُه في المرتبة ٤ » | Ibn Kathîr nomme ainsi la place que chacun tient dans la bataille : « فتراجع الناس إلى مواقفهم » [G, p. 11] ; l'arabe dit « وقف منه موقفًا » (prendre position devant une chose) et « اتّخذ موقفًا » | **à valider (D184)**. On *prend* un موقف, on en change, on n'*est* pas son موقف (exigence 24) ; le mot ne touche pas au visage (exigence 2 : ni وجه, ni صورة, ni هيئة, ni سيماء ; l'aide ne dit plus « على ثلاثة أوجه », mais « يقف المرء أحدَ ثلاثة مواقف ») ; il se lit dans « اتّخاذ موقف » comme dans la ligne d'état. Il remplace **وقفة**, qui se lit d'abord « une pause » (« خذ وقفة ») et désigne aussi, avec l'article, la station de 'Arafa (« يوم الوقفة ») : dans un menu de jeu, « الوقفات » se lisait « les pauses ». Écartés : **مَسلك** (« المسالك » se lirait « les chemins » dans un jeu de labyrinthes, et السلوك est un mot de la voie soufie) ; **أسلوب** (un style : trop léger) ; **سَمْت** (l'allure extérieure ; et « l'azimut » aujourd'hui) ; **دَور** (« le rôle », mais c'est déjà « le tour » au combat : « فاته دوره ») ; **نَهج** (le titre *Nahj al-balâgha*, exigence 5) ; **طريقة**, **مقام**, **حال** (mots du soufisme). |
| en combat : « en héros », « en sage », « en saint » (`court`) | **بإقدام · ببصيرة · بإيثار** (« المرتبة ٣ · بإقدام ») | « قاتل بإقدام » : la manière, usage courant | **à valider (D184)**. La mention dit la manière du moment, non ce qu'est la personne : c'est le « en » du français. Pas de participe : « مُؤثِرًا » se lirait « مؤثِّرًا » (« émouvant »). |
| Le héros | **الإقدام** (aller au-devant) | usage courant ; référence non vérifiée (l'éthique arabe range le *iqdâm* sous la *shajâ'a*, entre « التهور » et « الجبن » ; al-Ghazâlî nomme l'excès, « التهور », en [C] et [D]) | Il s'expose : il va au-devant, et prend sur lui. |
| Le sage | **البصيرة** (le discernement) | [D] : « ولينظر بعين البصيرة » ; « بقوة العلم والبصيرة » | Il discerne : il regarde avant d'agir. |
| Le saint | **الإيثار** (faire passer les autres avant soi) | [B], « بيان الإيثار وفضله » | Il s'efface : il porte les autres. |

Si le décideur veut des personnes : **البطل** (le héros : WP-ar, « القعقاع بن عمرو التميمي », « أحد فرسان العرب وأبطالهم »),
**ذو البصيرة**, **ذو الإيثار** — mais pas الحكيم ni الوليّ (§ 4). Ni l'auteur de la distinction ni son œuvre ne sont
nommés en arabe non plus.

### 2.7 La bataille déclarée (`D.RANGS`, `D.ORDRES`, `D.MANOEUVRES`, exigence 19)

Les rangs portent un nom de fonction, sans nombre ; les ordres sont des impératifs pluriels, comme dans les
chroniques.

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| Fantassins | **الرَّجّالة** | usage des chroniques, référence non vérifiée | |
| Cavaliers | **الخيّالة** | [G, p. 12] : « ثم حمل خالد بمن معه من الخيالة » | |
| Archers | **الرُّماة** | usage courant | |
| Gens du lieu | **أهل البلد** | — | |
| Tenir | **اثبُتوا** | [G, p. 11] : « إنكم لا تثبتون » | |
| Avancer | **تقدّموا** | — | |
| Charger | **احمِلوا** | [G, p. 11] : « فحمل وحملوا » | |
| Tirer | **ارمُوا** | — | |
| Glisser (changer de couloir) | **مِيلوا** | — | |
| Se replier | **تراجعوا** | — | Jamais انهزموا (la déroute) ni « ولّوا الأدبار » (la fuite que le Coran blâme). |
| Réserve mobile | **الرِّدء** | [G, p. 11] : Khâlid place des cavaliers derrière les ailes « ليكونوا ردءا لهم من ورائهم » | Exigence 19 : le mot vient de ce récit, mais le jeu ne dit jamais que la manœuvre fut faite tel jour. |
| Enveloppement | **الإطباق** | usage courant | |
| Repli feint | **الاستطراد** | [H] : « استطراد الفارس لقرنه، إذا طرد فرسه بين يديه، يوهمه الفرار، ثم يعطف عليه على غرة منه » | Le nom arabe de la feinte du cavalier, passé ensuite à la rhétorique. |
| les nuées (de l'idole) | **الأسراب** (sg. سِرب) | — | Jamais des hommes. |
| les trois couloirs : aile nord, centre, aile sud | à l'écran : **الجناح الشمالي · الوسط · الجناح الجنوبي** ; dans un récit : **الميمنة · القلب · الميسرة** | [G, p. 11] : « يقف في القلب » ; « وراء الميمنة … وراء الميسرة » | Droite et gauche se disent de l'armée qui fait face : si l'écran arabe retourne le champ, la *maymana* change de bord ; l'écran dit donc nord et sud. |
| tenue (d'un rang) | **التماسك** | — | |
| le camp | **المعسكر** | — | |
| le stratège (qui ordonne sans perdre son tour) | **صاحب الرأي** | § 2.4 | |
| la préparation (avant une idole) | **التأهّب** | — | |

### 2.8 Les tables du moteur (`defs.js`)

**Lumières** (`D.ELEMENTS` ; « Lumière » = **نور**, pl. **الأنوار** ; « la Lumière de Véracité » = « نور الصدق »)

| Français | Arabe | Source | Note |
|---|---|---|---|
| Fer (l'élan physique) | **الحديد** | — | Autre choix : البأس. |
| Véracité (sidq) | **الصِّدق** | *Ihyâ'*, « النية والإخلاص والصدق » [A] | |
| Justice ('adl) | **العَدل** | usage courant | Nom commun (§ 2.2). |
| Patience (sabr) | **الصَّبر** | *Ihyâ'*, « الصبر والشكر » [A] | |
| Miséricorde (rahma) | **الرَّحمة** | usage courant | |
| Courage (shajâ'a) | **الشَّجاعة** | usage courant | |
| Savoir ('ilm) | **العِلم** | *Ihyâ'*, « كتاب العلم » [A] | |

**Piliers de la Citadelle** (`D.PILLARS`) : Prière **الصلاة** · Savoir **العلم** · Justice **العدل** · Lien **الأُلفة**
(ce qui tient les hommes ensemble : *Ihyâ'*, « آداب الألفة والأخوة » [A] ; à valider ; pas العصبية, qui est l'idole
« le Clan », § 3.6).

**Prières** (`D.PRAYERS`) : **صلاة الفجر · صلاة الظهر · صلاة العصر · صلاة المغرب · صلاة العشاء** (le nom suffit ; la
glose française « l'aube, le midi… » ne se traduit pas). Le carton de prière reste sobre : « صلَّوا » (exigence 13).

**Équipement** (`D.SLOTS`, `D.GEAR_TYPES`) :

| Emplacement | Arabe | Type | Arabe | Type | Arabe |
|---|---|---|---|---|---|
| Main droite | **اليد اليمنى** | Épée | **السيف** | Bouclier | **التُّرس** |
| Main gauche | **اليد اليسرى** | Lance | **الرمح** | Grand bouclier | **التُّرس الكبير** |
| Tête | **الرأس** | Arc | **القوس** | Outil | **الأداة** |
| Corps | **البدن** | Dague | **الخنجر** | Turban | **العمامة** |
| | | Masse | **الهِراوة** | Calotte | **الكُمّة** (moderne : الطاقية) |
| | | Bâton | **العصا** | Casque | **الخُوذة** (classique : البَيضة, qui se lit « l'œuf ») |
| | | Calame | **القلم** | Étoffe | **الثوب** |
| | | | | Cuir | **الجِلد** (vocalisé) |
| | | | | Armure | **الدِّرع** |

Les pièces (`D.GEAR`), quand leur nom en a besoin : les mots des poètes anciens que cite le recueil du jeu —
**المُهنَّد** (WP-ar, « مهند (اسم) » : « اسم من أسماء السيوف المطبوعة من حديد الهند » [L]), **اليمانيّ**، **المَشرَفيّ**،
**الرمح الخَطّيّ**، **السَّمهريّ**، **قوس النَّبع**، **الدرع السَّلوقيّة**، **درقة اللَّمط** — sont des termes reçus, mais leurs
sources n'ont pas été relues ici (le recueil du jeu dit lui-même « à faire vérifier »). Autres pièces : Javelot
**الحَربة** ; Couteau de ceinture **سكّين الحزام** ; Massue de tamaris **هراوة الطَّرفاء** ; Masse de fer **عمود الحديد** ;
Houlette de berger **مِحجَن الراعي** ; Calame et encrier **القلم والدَّواة** ; Bouclier de cuir **الدَّرَقة** ; Gourde de cuir
**الإداوة** ; Tablette de bois **اللوح** ; Lampe de veille **سراج السهر** ; Chèche des sables **لِثام الرمال** ; Coiffe de
mailles **المِغفَر** ; Manteau de laine **كساء الصوف** ; Burnous **البُرنُس** ; Cotte de mailles **درع الزَّرَد** ; Cuirasse à
lamelles **الجَوشَن**. **Exigence 17 en arabe** : le « manteau rayé du Yémen » est **الكساء اليمانيّ المخطّط**, jamais
**الحِبَرة** ni **البُردة** (étoffes que la tradition attache au Prophète ﷺ ; le jeu ne dit jamais qui portait quoi) ; aucune
pièce ne s'appelle **ذو الفقار** (§ 4).

**Objets** (`D.ITEMS`) : Dattes de Médine **تمر المدينة** · Outre d'eau **قِربة ماء** · Pain d'orge **خبز الشعير** · Miel
**عسل** · Musc **مِسك** · Lait chaud **لَبَنٌ دافئ** (vocalisé : sans voyelles, « لبن » est le lait en arabe classique mais
le yaourt au Levant, et la brique crue, اللَّبِن, plus bas) · Siwâk **سِواك**.

**Bâtir** (`D.MATS`, `D.PIECES`) : Eau **ماء** · Pisé **اللَّبِن** (la brique de terre crue) · Palme **سَعَف** · Pierre **حجر**
· Grain **حَبّ** · Laine **صوف**. Tranchée **خندق** · Puits **بئر** · Palmier **نخلة** · Champ d'orge **حقل شعير** · Enclos
de chèvres / de moutons / de chameaux **حظيرة الماعز / الغنم / الإبل** · Mur de pisé **جدار من لَبِن** · Dallage étoilé
(« Sol à étoiles » jusqu'à D184, 2.25) **بلاطٌ بنقش النجوم** (comme sa description, « بلاطٌ بنقوش هندسيّة » ; à valider) · Pilier de palmier **جِذع نخلة** · Niche de qibla **المِحراب** · Natte de prière **حصير الصلاة**
(une natte, pas une سجّادة) · Tapis **بِساط** · Lanterne **قِنديل** · Rosace **نجمة ثُمانيّة**. Groupes : Défendre
**الدفاع** · Eau et vivres **الماء والزاد** · Troupeaux **المواشي** · Mosquée **المسجد**. Le dû des troupeaux (ce que la
Ridda refusait de verser) : **حقّ المواشي** — Muslim : « ما من صاحب إبل لا يؤدي حقها » (éd. du CDN, n° 2291 [M]) ;
« Le dû des troupeaux est versé » : « أُدّي حقُّ المواشي » (plus de « تؤدّي حقّ مواشيك », § 1.8).

**Outils appris** (`D.OUTILS`, un à la fois) : Se déplacer **التنقّل** · Parler **الكلام** · Demander son chemin **السؤال
عن الطريق** · Frapper la faille **ضرب الثُّلمة** · Les vertus **الخِصال** · La garde et la Niyya **التحصّن والنيّة** · La
besace **المِزوَد** · La halte **الاستراحة** · Retrouver une source **تتبّع الرواية** · S'équiper **التجهّز** · S'orienter
aux étoiles **الاهتداء بالنجوم** (Coran 16:16, « وبالنجم هم يهتدون » [K]) · Frapper ce qui rôde **ضرب ما يحوم** ·
Prendre une figure **اتّخاذ موقف** (D184, § 2.6 ; à valider).

**Le recueil** (le codex) : **الكُرّاسة** (le cahier où le râwî note ce qu'il a appris ; à valider ; autre choix :
السِّجلّ). Catégories (`D.CODEX_CATS`, qui restent des clés françaises sous le capot) :

| Français | Arabe | Source / note |
|---|---|---|
| Biographie | **التراجم** | le genre des notices biographiques (Ibn Sa'd, *at-Tabaqât al-kubrâ*) ; usage courant |
| Événement | **الوقائع** | |
| Noosphère | **عالم الأفكار** | § 2.3 |
| Lieu | **البلدان** | le titre de Yâqût, *Mu'jam al-buldân*, cité par WP-ar, « عين تمر » [L] |
| Parole | **الأقوال** | |
| Cœur | **القلب** | autre choix : **الرقائق** (le genre des textes qui attendrissent le cœur) |
| Objets | **المتاع** | |

**Étoiles** (`D.STARS`, déjà en arabe dans le jeu) : **النسر الطائر** (WP-ar, « النسر الطائر (نجم) » [L]) · **العقرب**
(son cœur rouge : **قلب العقرب**) · **سُهَيل** (WP-ar : « سُهيل اليماني », Canopus [L]) · **العَيُّوق** (WP-ar : Capella [L])
· **الجَدْي** (la Polaire chez les Arabes ; WP-ar, « نجم قطبي », ne le confirme pas : référence non vérifiée ; vocaliser,
car « الجدي » est aussi le Capricorne). Les caps : الشرق، الجنوب الشرقي، الجنوب، الجنوب الغربي، الغرب، الشمال الغربي،
الشمال، الشمال الشرقي ; « à main gauche » : « عن يسارك ».

**Tenues du râwî** (`D.TENUES`, 2084, fiction) : Manteau des Archives **معطف الخزانة** · Capuche d'encre **قلنسوة الحبر**
· Veste de la ruelle **سترة الزقاق** · Écharpe du copiste **وشاح الناسخ** · Manteau du veilleur **معطف الساهر** · Calotte
du lettré **كُمّة الأديب**.

### 2.9 Le dessin et 2084

| Français | Arabe retenu | Note |
|---|---|---|
| le voile de lumière (des Compagnons) | **غُلالةٌ من نور** | **à valider**. Jamais « حجابٌ من نور » : « حجابه النور » se dit d'Allah dans un hadith (Muslim, n° 179 d'Abd al-Bâqî ; CDN 445 [M]). |
| un visage (exigence 2) | **وجه** | Aucun texte ne décrit de traits, pour personne. |
| écran · notification · le grand écran · ascenseur | **شاشة · إشعار · الشاشة الكبرى · مِصعد** | arabe moderne ; jamais l'anglais translittéré. |
| le relevé (L'agent du relevé) | **الإحصاء** (« موظّف الإحصاء ») | |
| An 1507 de l'Hégire (« 1508 » jusqu'à D184, 2.22) | **سنة ١٥٠٧ للهجرة** ; « الحلقة الأخيرة · ١٥٠٧ هـ · ٢٠٨٤ م » | § 1.5 ; à valider (D184) |
| des millions de vues · d'abonnés · de comptes (D184, 2.1 et 2.2 ; plus « de regards », « de fenêtres », sauf dans la bouche de l'enfant) | **ملايين المشاهدات · المتابِعين · الحسابات** | les mots courants. « حسابات » se dit au pluriel, dans une phrase : il ne nomme aucune chimère (« Le Compte » est **الرَّصيد**, § 3.6 ; **الحساب** seul se lit « le Jugement », § 2.2). À valider (D184). |
| « Monsieur » (un enfant ou un passant à Idris) | **يا سيّدي** | jamais « يا عمّو » ni un autre mot de dialecte (§ 1.1). À valider. |

### 2.10 Les mots de l'histoire : titres, fonctions, notions, peuples

*Ajout du 18 novembre (lexique commun), à valider en bloc.* Ces mots reviennent dans plusieurs récits ; chacun est
celui des chroniques, relevé chez at-Tabarî [N] ou al-Balâdhurî [O] (le nombre d'occurrences est compté sur [N]).

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| successeur du Messager d'Allah (Abû Bakr) ; le premier successeur | **خليفة رسول الله ﷺ** ; « أوّل الخلفاء » | [N], vol. 3 (21 occ.) : « وخليفة رسول الله على الصلاة » | Le titre d'Abû Bakr, au vocatif : « يا خليفة رسول الله ». |
| calife ; califat | **الخليفة ; الخلافة** | [N] | |
| le Commandeur des croyants ; « le Commandeur » | **أمير المؤمنين** (toujours entier) | § 2.1 | « le Commandeur » seul ne devient pas « الأمير », qui est un chef d'armée ou de province. |
| l'émir ; « Émir ! » (vocatif) ; l'émir de l'armée | **الأمير** ; « أيها الأمير » ; « أمير الجيش » | [N] : « أيها الأمير » (21 occ.) ; « أمير الجيش » (vol. 4) | |
| gouverneur(s) ; le palais du gouverneur | **العامل**, pl. **العمّال** ; **دار الإمارة** | [N] : « عماله » (73 occ.) ; « دار الإمارة » (vol. 5, à Koufa) | **jamais « الوالي »** : c'est le Régent de 2084 (§ 3.3). « gouverneur du Shâm » : « عامل الشام ». |
| la consultation (shûrâ) ; les six de la consultation | **الشورى** ; « أهل الشورى » | [N], vol. 4 : « اجتمع أهل الشورى على عثمان » | |
| l'allégeance ; prêter allégeance | **البيعة** ; « بايع » | [N] | |
| le Trésor ; le dîwân | **بيت المال** ; **الديوان** | [N] : « بيت المال » (47 occ.) ; « ذكر فرض العطاء وعمل الديوان » | déjà : « commis du Trésor », « scribe du dîwân » (§ 3.2, § 3.3). |
| les Émigrés ; les Ansâr ; un Ansârî | **المهاجرون ; الأنصار ; أنصاريّ** | [N] : « المهاجرين والأنصار » (25 occ.) | |
| Quraysh ; qurayshite ; les Banû X | **قريش ; قرشيّ ; بنو X** | [N] | « بنو » sujet, « بني » après une préposition ou un nom : « من بني تميم ». |
| un pacte (avec une ville) ; la ville traite | **الصُّلح** ; « صالحهم على… » | [N] : « صالحهم » (25 occ.) ; [O], 12221/151 (Chypre : « فصالحهم على سبعة آلاف ومائتي دينار ») | la parole donnée, l'engagement : **العهد** (pl. العهود). Le pacte d'Îliyâ' : **العهدة العمرية** (§ 3.5) ; Hudaybiyya : **صلح الحديبية**. |
| la sûreté (amân) | **الأمان** | [N] (71 occ.) ; [O], 12221/121 (Damas : « أعطاهم أمانا ») | |
| le tribut, l'impôt (d'une ville sous pacte) | **الجزية** ; mais **suivre la source de l'épisode** | [O], 12221/121 (Damas : « إذا أعطوا الجزية ») ; [N] (87 occ.) | À Homs, « l'impôt rendu » est **الخراج** ([O], 12221/136 : « ردوا على أهل حمص ما كانوا أخذوا منهم من الخراج ») ; Chypre « paie deux kharâj » ([O], 12221/151 : « فهم يؤدون خراجين »). « الجزية على رقابهم والخراج على أرضهم » ([O], 12221/137). |
| le tribut versé à un homme (ce que des tribus de la Ridda voyaient dans le dû) | **الإتاوة** | [N], vol. 3 : « إن العرب لا تطيب لكم نفسا بالإتاوة » | jamais الجزية ni الزكاة pour ce sens. |
| la Ridda ; les guerres de la Ridda | **الردّة ; حروب الردّة** | [N] : « أهل الردة » (24 occ.) | le nom de l'événement, jamais celui d'une chimère (§ 3.6) ; dans un récit, on dit ce que font les tribus sans les nommer en bloc (exigences 6, 10). |
| la Révélation ; scribe de la Révélation | **الوحي ; كاتب الوحي** | § 3.1 (Zayd) | |
| le Livre (le Coran) ; les Gens du Livre | **كتاب الله** (ou **الكتاب** quand rien ne prête à confusion) ; **أهل الكتاب** | [N] : « أهل الكتاب » (9 occ.) | jamais « الكتاب المقدّس » (la Bible). |
| les feuillets du Coran (réunis par Zayd) ; le mushaf | **الصُّحُف ; المصحف** | [P] : « فكانت الصحف عند أبي بكر حتى توفاه الله ثم عند عمر » ; [N], vol. 4 : « المصحف » (23 occ.) | **à distinguer** du feuillet du jeu, **ورقة** (§ 1.12). « Les tiges de palmier, les pierres plates, la mémoire des hommes » : « العُسُب واللِّخاف وصدور الرجال » ([P]). |
| les lectures (du Coran) ; les récitants ; « reçue d'un Compagnon » | **القراءات ; القُرّاء** ; « تلقّاها عن صحابيّ » | [N] : « القراء » (13 occ.) | la chimère « Variante querelleuse » reste **المِراء** (§ 3.6). |
| l'arbitrage (Siffîn) ; deux arbitres | **التحكيم ; الحَكَمان** | [N], vol. 5 : « لما وقع التحكيم ورجع علي من صفين » ; « فعند ذلك حكموا الحكمين » ; Coran 4:35 (au registre) | Exigence 5 : avec retenue, sans coupable. Le duel « حَكَمان » des sources et du Coran nomme les deux hommes ; « الحَكَم » reste interdit pour une chimère (§ 2.2). [N] dit aussi « الحكومة » : trop moderne aujourd'hui (« le gouvernement »). |
| les sécessionnistes ; « un sécessionniste » ; faire sécession | **أهل حروراء** (à Nahrawân : **أهل النهر**) ; **رجلٌ من أهل حروراء** ; « باينوا عليًّا » | [N], vol. 5 : « إنكار أهل حروراء على علي التحكيم » ; « رجعوا مباينين له » ; « أهل النهر » (13 occ.) | **jamais** الخوارج، الحرورية، المحكّمة، المارقة (§ 2.2) : des noms de parti ou d'injure ([N], vol. 5 : « هذه المارقة الخاطئة », dans une lettre de guerre). Le lieu les nomme, comme le registre (« أهل النهروان »). |
| « Le jugement n'appartient qu'à Allah » **crié** par les gens de Harûrâ' (`saga_ali.js`, lignes 256, 512, 591, 694, 695 ; `caid.js`, ligne 141) | **«لا حكم إلا لله»** | Muslim, n° 1066 (CDN : n° 2468, livre 12, hadith 205) [M] : « أن الحرورية لما خرجت … قالوا لا حكم إلا لله. قال علي: كلمة حق أريد بها باطل » ; [N], vol. 5 (7 occ.) | Le registre le dit (`versets.json`, note du verset 6:57) : ce cri est une parole rapportée par les chroniques, **non une citation du verset**. Là où le feuillet cite **le verset** (ligne 275 ; ligne 528, sourate Yûsuf), le texte est celui du registre : ﴿إِنِ ٱلْحُكْمُ إِلَّا لِلَّهِ﴾ ; c'est justement ce que le feuillet explique (la même phrase, deux usages). Jamais un nom de compétence. Le registre n'a pas encore d'entrée pour le cri lui-même : à y ajouter. |
| les polythéistes ; les hypocrites | **المشركون ; المنافقون** | [N] : « المشركين » (68 occ.) | dans un récit ou une parole rapportée seulement ; jamais pour un personnage nommé (exigence 11). |
| les Rûm, les Romains ; Rome (l'empire) ; César ; l'empereur ; Héraclius | **الروم** ; **الروم** (pas « روما ») ; **قيصر** ; **ملك الروم** ; **هِرَقل** | [N] : « ملك الروم » (11 occ.) ; « هرقل » (52 occ.) ; « قيصر » (9 occ.) | exigence 10. |
| les Perses ; la Perse | **الفُرس** (vocalisé : « الفَرَس » est le cheval) ; **بلاد فارس** | [N] (« فارس » y désigne aussi le cavalier : 463 occurrences mêlées) | pas « العجم، الأعاجم » (les non-Arabes en bloc, exigence 10). |
| les Arabes chrétiens ; les chrétiens de Najrân ; un chrétien | **نصارى العرب** ; **نصارى نجران** ; **نصرانيّ**, pl. **النصارى** | [N], vol. 3 : « من فارس ونصارى العرب » ; « أهل نجران » (6 occ.) | le mot des chroniques et du Coran ; jamais pour un ennemi (exigences 6, 10). En 2084, s'il le faut : « مسيحيّ ». |
| les Ghassânides | **غسّان**, « بنو غسّان » | [N] : « غسان » (33 occ.) | « الغساسنة » est le mot des historiens modernes. |
| un Bédouin ; les Bédouins | **بدويّ** ; **أهل البادية** | [N] : « أهل البادية » (8 occ.) | **pas « أعرابيّ »** pour une désignation : le Coran porte sur « الأعراب » un jugement (dix occurrences, en 9, 33, 48 et 49 [K]) qu'une étiquette ne doit pas porter (exigence 10). |
| une délégation ; un envoyé (d'une tribu, d'une ville) | **وفد ; وافد** | [N] : « وفد » (162 occ.) | « Envoyé de Najrân » : « وافدٌ من نجران » ; « Délégué des tribus » : « وافد القبائل ». |
| lever une flotte ; l'expédition par mer ; l'amiral | **غزو البحر** ; **أمير البحر** | [N], vol. 4 : « ألح معاوية … على عمر … في غزو البحر » ; [O], 12221/150 | « أمير البحر » (d'où vient « amiral ») : référence non vérifiée. Jamais « القائد » (le Caïd). |
| l'Année des cendres ; la peste d'Emmaüs | **عام الرَّمادة ; طاعون عَمَواس** | [N], vol. 4 : « ذكر القحط وعام الرمادة » ; « وفيها كان عام الرمادة وطاعون عمواس » | |
| martyr ; mourir en martyr | **شهيد ; استُشهد** | usage courant | |
| l'un des dix à qui le Paradis fut annoncé | **أحد العشرة المبشَّرين بالجنّة** | [Q] : « أبو بكر في الجنة وعمر في الجنة … وأبو عبيدة بن الجراح في الجنة » | |
| les années d'une saga (« 13–23 H · 634–644 ») | **١٣–٢٣ هـ · ٦٣٤–٦٤٤ م** | § 1.5 | |

**Les formules qui reviennent dans les répliques** (usage courant ; une parole attestée vient du registre) : « Par
Allah » **والله** · « Paix sur toi » **السلام عليك** · « Qu'Allah le garde » **حفظه الله** · « Qu'Allah te récompense »
**جزاك الله خيرًا** · « Qu'Allah te fasse miséricorde » **رحمك الله** · « Qu'Allah fasse miséricorde à X » **رحم الله X** ·
« Qu'Allah me pardonne » **غفر الله لي** · « si Allah le veut » **إن شاء الله** · « Louange à Allah » **الحمد لله** · « Au nom
d'Allah » **بسم الله** · « mon frère » **يا أخي** · « On dit que… » **«يُقال إنّ…»** (posé partout).

---

## 3. Les noms propres

Règles :
- **Personnages historiques** : la forme des sources (nom, *kunya*, *laqab*), vérifiée sur la notice de WP-ar qui les
  donne d'après les chroniques (adresses : `https://ar.wikipedia.org/wiki/<titre de la notice>`, titre indiqué). Dans
  une réplique ou une étiquette, le nom court (« أبو بكر »، « عُمَر »، « خالد ») ; à la première mention d'un chapitre,
  la forme pleine (« أبو بكر الصدّيق »، « خالد بن الوليد »).
- **Personnages de fiction** : une graphie simple, sans formule de respect, sans kunya inventée qui ferait croire à
  un personnage réel.
- **Chimères** : un nom arabe, pas un calque, avec l'article ; une même image garde le même mot d'un récit à
  l'autre : « Murmure » = **همس**, « Écho » = **الصدى**, « Mirage » = **السَّراب**, « Rumeur » = **الإشاعة**.
- La formule après un Compagnon : § 1.6 (à trancher). Ceux que les sources rangent parmi les Successeurs (تابعي) n'en
  reçoivent pas la même : Aslam, Shurayh, Kumayl, Mâlik al-Ashtar, Farwa ibn Nawfal (voir leurs lignes).

### 3.1 Les héros

| Français (titre) | Arabe (nom · titre) | Forme des sources | Notice lue / note |
|---|---|---|---|
| Abû Bakr — As-Siddîq | **أبو بكر · الصِّدِّيق** | أبو بكر الصديق عبد الله بن أبي قُحافة التيمي القرشي | « أبو بكر الصديق ». |
| 'Umar — Al-Fârûq | **عُمَر · الفاروق** | أبو حفص عمر بن الخطاب العدوي القرشي، المُلقَّب بالفاروق | « عمر بن الخطاب ». La notice « الفاروق (لقب) » note que des chiites tiennent ce surnom pour celui d'Alî : le jeu suit ses sources, sans commentaire (exigence 5). |
| Abû 'Ubayda — Amîn al-Umma / l'homme de confiance de la communauté | **أبو عُبيدة · أمينُ الأمّة** | أبو عبيدة عامر بن عبد الله بن الجراح الفهري القرشي | « أبو عبيدة بن الجراح », qui rapporte le hadith d'où vient le titre. |
| 'Alî — La Porte du Savoir | **عليّ · باب العلم** (proposé) | أبو الحسن علي بن أبي طالب الهاشمي القرشي | « علي بن أبي طالب ». **À trancher (§ 4)** : « باب العلم » vient d'un hadith dont l'authenticité est discutée ; une parole sûre lui donne un autre titre, « وأقضانا علي » (Umar, al-Bukhârî n° 4481, déjà au registre : `saga_ali.json`). |
| Ibn 'Abbâs — Le Docte de la communauté | **ابن عبّاس · حَبرُ الأمّة** | أبو العباس عبد الله بن العباس بن عبد المطلب | la notice « حبر الأمة » renvoie à « عبد الله بن عباس ». |
| 'Ammâr — Le Vétéran | **عمّار · البدريّ** (proposé) | عمار بن ياسر | « عمار بن ياسر » : « من السابقين إلى الإسلام … وشارك مع النبي محمد في غزواته كلها ». **à valider** : « Le Vétéran » n'a pas d'équivalent ancien ; « البدري » (qui fut à Badr) en est un. |
| Qays — Fils de Sa'd | **قيس · ابن سعد** | قيس بن سعد بن عُبادة | « قيس بن سعد بن عبادة ». |
| Khâlid — Le Sabre dégainé | **خالد · السيفُ المسلول** | أبو سليمان خالد بن الوليد بن المغيرة المخزومي، لقّبه النبي ﷺ « سيف الله المسلول » | « خالد بن الوليد ». Le titre du jeu omet الله, comme le français omet « d'Allah » (exigence 8 : c'est aussi le nom d'une compétence). Dans un récit ou le recueil, le surnom entier peut se citer, une fois, comme parole rapportée. |
| Al-Qa'qâ' — Ibn 'Amr at-Tamîmî | **القَعقاع · ابن عمرو التميمي** | القعقاع بن عمرو بن مالك الأُسيدي التميمي | « القعقاع بن عمرو التميمي ». |
| Dirâr — Ibn al-Azwar | **ضِرار · ابن الأزور** | ضرار بن الأزور الأسدي | « ضرار بن الأزور ». Le surnom que lui donnèrent les Rûm contient « شيطان » : **jamais** employé (§ 2.2). |
| Aslam — L'affranchi de 'Umar | **أسلم · مولى عُمَر** | أسلم مولى عمر بن الخطاب، أبو خالد | pas de notice WP-ar ; fiche de transmetteur : `https://hadithtransmitters.hawramani.com/أسلم-مولى-عمر/` (résultat de recherche, non relu en entier) : al-'Ijlî le dit *tâbi'î*. Le jeu lui donne pourtant un voile de lumière (`D.RAYONS`) : c'est le côté prudent (§ 4). |
| 'Abd ar-Rahmân — Ibn 'Awf | **عبد الرحمن · ابن عوف** | عبد الرحمن بن عوف الزهري القرشي | « عبد الرحمن بن عوف ». |
| 'Uthmân — Le Généreux | **عثمان · ذو النورين** (proposé) | أبو عبد الله عثمان بن عفان الأموي القرشي، « يلقَّب ذا النورين » | « عثمان بن عفان ». **À trancher (§ 4)** : le seul surnom des sources est ذو النورين ; « Le Généreux » n'en est pas un, et « الكريم » est un Nom divin. Autre choix, descriptif : « صاحبُ بئر رُومة » (le puits qu'il acheta pour tous, voir « بئر رومة »). D184 : le français garde « Le Généreux » (« Quatrième maillon · Le Généreux ») et appelle sa Lumière « Miséricorde du Généreux » (2.12) : en arabe, cette compétence se dira **رحمة ذي النورين** (ou du titre retenu), jamais « رحمة الكريم », qui se lirait « la miséricorde du Généreux », c'est-à-dire d'Allah (exigence 8). À valider (D184). **D186** : le décideur garde « Le Généreux » en français (la générosité est une qualité que l'on acquiert, comme la véracité d'aṣ-Ṣiddîq) ; en arabe, ذو النورين pour le titre et « رحمة ذي النورين » pour la compétence (**validé par le décideur**). |
| Zayd ibn Thâbit — Le Scribe | **زيد بن ثابت · كاتبُ الوحي** | زيد بن ثابت بن الضحاك الأنصاري | « زيد بن ثابت » : « صحابي وكاتب الوحي ». |
| Hudhayfa — Le Gardien du secret | **حُذَيفة · صاحبُ السِّرّ** | حذيفة بن اليمان العبسي | « حذيفة بن اليمان ». « صاحب سرّ رسول الله ﷺ » : surnom connu, référence non vérifiée en ligne. |
| Idris — le Râwî | **إدريس · الراوي** | fiction | `langue.js` le pose déjà (`rawi: 'إدريس'`). C'est aussi le nom d'un prophète : jamais « عليه السلام » après ce personnage, et le joueur peut le renommer (`perso.js`). |
| Maître Yûnus — le Gardien | **الشيخ يونس · الخازن** | fiction | **à valider**. « le Gardien » des Archives : الخازن, le garde d'une bibliothèque (خزانة الكتب). |
| Sâlim — le Repenti | **سالم · التائب** | fiction | |
| Le Caïd — Seigneur de la Citadelle | **القائد · صاحبُ القلعة** | fiction | Sceau déjà dans le jeu : القائد. |
| Maître Bahrâm — le Géomètre | **المعلّم بَهرام · المهندس** | fiction | المهندس : le géomètre (la *handasa* est la géométrie). |
| Zîrî — Capitaine des sentinelles | **زِيري · صاحبُ الحرس** | fiction | pas « قائد الحرس » : القائد est le Caïd. |

### 3.2 Les personnages historiques des chapitres

| Français | Arabe | Notice lue (WP-ar) / note |
|---|---|---|
| Al-Hubâb ibn al-Mundhir | **الحُباب بن المنذر** | « الحباب بن المنذر » (« كان من المشاركين بالرأي في يوم السقيفة »). |
| Bashîr ibn Sa'd | **بَشير بن سعد** | « بشير بن سعد بن ثعلبة ». |
| Usâma ibn Zayd | **أُسامة بن زيد** | « أسامة بن زيد » (بن حارثة). |
| Zayd ibn al-Khattâb | **زيد بن الخطاب** | « زيد بن الخطاب ». |
| Al-Barâ' ibn Mâlik (le Mur du Jardin) | **البَراء بن مالك** | « البراء بن مالك ». |
| Musaylima (nommé dans le recueil) | **مُسَيلِمة** | « مسيلمة الكذاب » (مسلمة بن حبيب الحنفي). Jamais un ennemi du jeu (exigence 6) : voir l'idole d'Abû Bakr, § 3.6. |
| Kumayl ibn Ziyâd | **كُمَيل بن زياد النَّخَعي** | « كميل بن زياد » : « أدرك النبي … وقيل إنه لم يره ». Sans visage (`D.SANS_VISAGE`). |
| le juge Shurayh | **القاضي شُرَيح** | « شريح القاضي » : شريح بن الحارث الكندي, « تابعي، قيل: له صحبة ». Sans visage. |
| Qanbar | **قَنبَر** | « قنبر » : « خادم علي بن أبي طالب ومولاه ». |
| Al-Hasan (ibn 'Alî) | **الحسن بن علي** | « الحسن بن علي » (أبو محمد). Sobriété : aucun titre de l'une ou l'autre école (exigence 5). |
| Mâlik al-Ashtar | **مالك الأشتر** | « مالك بن الحارث الأشتر » : la notice dit qu'il est jugé différemment par les sunnites et les chiites : le nom seul, sans qualificatif (exigence 5). Sans visage. |
| Abû Ayyûb al-Ansârî | **أبو أيّوب الأنصاري** | « أبو أيوب الأنصاري » (خالد بن زيد). |
| Farwa ibn Nawfal | **فَروة بن نوفل الأشجعي** | pas de notice WP-ar ; fiche de narrateur `https://shamela.ws/narrator/5082` (résultat de recherche : « لا صحبة له » selon Ibn 'Abd al-Barr). Sans visage. |
| Ibn al-Kawwâ' | **ابن الكوّاء** | « عبد الله بن الكواء » (عبد الله بن عمرو اليشكري, d'après la fiche de la notice). |
| Ibn an-Nabbâh, le muezzin | **ابن النَّبّاح، المؤذّن** | référence non vérifiée en ligne. |
| Râfi' ibn 'Umayra | **رافع بن عُمَيرة الطائي** | « رافع بن عميرة » : le guide de Khâlid à travers le désert. Sans visage. |
| 'Amr ibn 'Abd al-Masîh (doyen d'al-Hîra) | **عمرو بن عبد المسيح** | le registre (`saga_khalid.json`) a lu at-Tabarî : ce nom est celui du récit de Sayf (ج ٣ ص ٣٦١-٣٦٤) ; un autre récit nomme l'homme « عبد المسيح بن عمرو بن بُقَيلة ». Écart déjà signalé là-bas. |
| Bilâl ibn Rabâh | **بلال بن رباح** | « بلال بن رباح ». |
| Sophrone | **صَفرونيوس** | « صفرونيوس » (patriarche de Jérusalem). Dignité gardée (schema-v2) ; dans un récit : « بطريرك إيلياء ». |
| Al-Hurmuzân | **الهُرمُزان** | notice « هرمزان » ; les chroniques l'écrivent avec l'article. |
| Anas ibn Mâlik | **أنس بن مالك** | « أنس بن مالك ». |
| Surâqa ibn Mâlik | **سُراقة بن مالك** | « سراقة بن مالك المدلجي ». |
| Jabala ibn al-Ayham | **جَبَلة بن الأيهم** | « جبلة بن الأيهم », roi ghassânide ; la notice vocalise جِبْلة : vocalisation à vérifier. |
| 'Abdallâh ibn az-Zubayr | **عبد الله بن الزبير** | « عبد الله بن الزبير ». |
| Sa'îd ibn al-'Âs | **سعيد بن العاص** | « سعيد بن العاص ». |
| 'Abdallâh ibn Sa'd | **عبد الله بن سعد بن أبي السَّرح** | « عبد الله بن سعد بن أبي السرح ». Sans visage. |
| Abû Hurayra | **أبو هُريرة** | « أبو هريرة ». |
| Kisrâ (les rois sassanides) | **كِسرى** | titre, non un nom ; le dernier roi : « يزدجرد الثالث ». « l'empire de Kisrâ » (D184, 2.8 : le français ne dit plus « des Chosroès ») : **مُلك كسرى**. |
| *Ajouts du 18 novembre (lexique commun) : noms qui reviennent dans plusieurs récits ; formes relevées chez at-Tabarî [N] (occurrences) ou al-Balâdhurî [O]* | | |
| 'Amr ibn al-'Âs (quatre récits) | **عمرو بن العاص** | [N] (157 occ.). Le wâw final, qui ne se prononce pas, le distingue de عُمَر (§ 1.2) : ne jamais l'omettre. |
| Mu'âwiya (ibn Abî Sufyân) | **معاوية بن أبي سفيان** ; « معاوية » | [N] (46 occ.). Exigence 5 : le nom seul, sans titre ni qualificatif, comme Mâlik al-Ashtar ; « gouverneur du Shâm » : « عامل الشام » (§ 2.10). |
| Sa'd ibn Abî Waqqâs | **سعد بن أبي وقّاص** | [N] (47 occ.). |
| Talha ; az-Zubayr | **طلحة** (طلحة بن عبيد الله) ; **الزبير** (الزبير بن العوّام) | [N] (22 et 11 occ.) ; [Q]. Exigence 5 : avec retenue. |
| Abû Mûsâ al-Ash'arî | **أبو موسى الأشعري** | [N] (8 occ.). |
| Ibn Mas'ûd | **عبد الله بن مسعود** ; « ابن مسعود » | [N] (13 occ.). |
| Khabbâb ibn al-Aratt ; son fils 'Abdallâh | **خبّاب بن الأرتّ** ; **عبد الله بن خبّاب** | [N], vol. 5 : « فخرج عبد الله بن خباب صاحب رسول الله ». |
| Hassân ibn Thâbit (le poète) | **حسّان بن ثابت** | [N] (12 occ.). |
| Shurahbîl ibn Hasana ; 'Ikrima ibn Abî Jahl ; Yazîd ibn Abî Sufyân ; al-'Alâ' ibn al-Hadramî | **شُرَحبيل بن حَسَنة ; عِكرمة بن أبي جهل ; يزيد بن أبي سفيان ; العلاء بن الحضرمي** | [N] (18, 9, 26 et 13 occ.) ; [O], 12221/130 (Yazîd). |
| Sayf ibn 'Umar (le transmetteur que suit at-Tabarî) | **سيف بن عمر** | [N] (27 occ.) ; « d'après Sayf ibn 'Umar » : « من رواية سيف بن عمر » (§ 1.12). |
| Héraclius | **هِرَقل** | [N] (52 occ.) ; « César » (le titre) : **قيصر** (§ 2.10). |
| Eutychius ; Théophane (chroniqueurs) | **سعيد بن البطريق** ; **ثيوفانيس** | § 1.12 ; référence non vérifiée. |

Désignations collectives (exigences 4 et 10 : on dit le groupe sans trait) : un Médinois **رجل من أهل المدينة** · un
vieil Ansârî **شيخ من الأنصار** (sans visage) · un soldat de l'armée d'Usâma **جنديّ من جيش أسامة** (sans visage) · un
récitateur **قارئ** (sans visage, à Yamâma) · un vétéran de Badr **رجل من أهل بدر** (sans visage) · un ancien des Kalb
**شيخ من بني كلب** · un homme des Fazâra **رجل من فَزارة** · un lettré d'al-Hîra **عالِم من أهل الحيرة** · un moine
**راهب** · un prêtre du port **قسّ الميناء** · l'homme à la cuirasse **صاحب الدرع** (jamais sa religion) · un homme de
Harûrâ' **رجل من أهل حَروراء** (jamais خارجي, § 2.2) · un affranchi **مولى** · un fidèle **أحد المصلّين** · un récitant
de Koufa **قارئ من أهل الكوفة** · scribe du dîwân **كاتب الديوان** · courrier **رسول**, **بريد**.

*Ajout du 18 novembre (lexique commun), à valider.* Les étiquettes de PNJ suivent les mêmes modèles d'un récit à l'autre ;
la première colonne de ces modèles vaut pour tous les lieux : « Courrier de X » **رسولٌ من X** (« Courrier d'Abû 'Ubayda » :
« رسول أبي عبيدة ») · « Ancien de X » **شيخٌ من أهل X** (« Ancien des Kalb » : « شيخ من بني كلب », ci-dessus) · « Vétéran de
X » **رجلٌ ممّن شهد X** (« Un vétéran de Siffîn » : « رجلٌ ممّن شهد صفّين » ; Badr garde « رجل من أهل بدر », le mot des
sources) · « Marchand de X » **تاجرٌ من X** · « Soldat de X » **جنديٌّ من X** · « Envoyé de X », « Délégué de X » **وافدٌ
من X** (§ 2.10) · « Voyageur » **مسافر** · « Garde de la porte » **حارس الباب**. Déjà posés partout : « Veilleur » **حارس
الليل** · « Chamelier » **جَمّال** (la chadda est nécessaire : sans elle, « جمال » se lit « la beauté ») · « Moine » **راهب**
· « Enfant » **طفل** · « Un fidèle » **أحد المصلّين** · « Scribe du dîwân » **كاتب الديوان** · « Un caravanier » **رجلٌ من
القافلة**.

### 3.3 Les personnages de fiction

| Récit | Français | Arabe | Note |
|---|---|---|---|
| Abû Bakr | Thâmir le courtier (hypocrite) | **ثامر السِّمسار** | exigence 11 ; jamais « المنافق » écrit. |
| Abû Bakr | Dirghâm, cheikh des Banû Rimth | **ضِرغام، شيخ بني رِمث** | tribu de fiction. |
| Umar | Hâzim, commis de la Maison de la farine / du Trésor | **حازم، كاتب دار الدقيق / كاتب بيت المال** | |
| Umar | Abû Ghânim, marchand de grain | **أبو غانم، تاجر الحَبّ** | |
| Umar | Thawr ibn Mâlik | **ثَور بن مالك** | |
| Umar | l'ancien de Tibériade | **شيخ من طبريّة** | |
| Khâlid | Ghâlib, l'intendant (hypocrite) | **غالب، الوكيل** | |
| Khâlid | Wahb ibn Zurayr | **وَهب بن زُرَير** | |
| Khâlid | l'économe du monastère ; l'ermite du ravin | **قيّم الدير ; صاحب الصومعة في الوادي** | |
| Khâlid | le Fort des Oliviers | **حصن الزيتون** | |
| Uthmân | Abû l-Akhbâr | **أبو الأخبار** | |
| Alî | Ma'dân, notable des greniers | **مَعدان، وجيه الأهراء** | |
| Alî | Mâzin, chef des cavaliers de la Butte | **مازن، صاحب خيل الرابية** | |
| Alî | le maître du cercle ; le doyen des récitants | **صاحب المجلس ; شيخ القُرّاء** | « cercle d'étude » = **مجلس العلم** (§ 2.3). |
| Caïd | Maymûn, le chambellan | **ميمون الحاجب** | |
| Caïd | Amghar Idir ; Amghar Meksa ; le vieil amghar | **أمغار إيدير ; أمغار مكسا ; الأمغار الشيخ** | *amghar* : le chef ou l'ancien, en amazighe ; graphie usuelle au Maghreb, référence non vérifiée. |
| Caïd | le vieil imam | **إمام المسجد الشيخ** | pas « الإمام » seul (sens confessionnel). |
| Caïd | Anir, la sentinelle ; Udad, officier du rempart | **أنير الحارس ; أُدّاد، ضابط السور** | |
| Caïd | Izem, le général | **إيزم، أمير الجند** | pas « القائد » (le Caïd). |
| Caïd | Maître Yishaq, caravanier | **المعلّم يِسحاق، صاحب القافلة** | à valider (la forme hébraïque du nom, que garde le français). |
| Caïd | Farrokh, géomètre | **فرّخ المهندس** | |
| Caïd | Frère Cyprien, moine-médecin | **الأخ كِبريانوس، الراهب الطبيب** | la forme arabe chrétienne du nom ; référence non vérifiée. |
| Caïd | l'ancien Warsen ; Amezyan, le puisatier ; le porteur d'eau | **الشيخ ورسن ; أمزيان، حافر الآبار ; السقّاء** | |
| Caïd | Aderfi, prêcheur des Purs ; un Pur | **أدرفي، واعظ «الأنقياء» ; أحد «الأنقياء»** | **jamais** « الأطهار » (« les Purs » se dit en arabe des Imams dans le discours chiite, exigence 5). |
| 2084 | Celui qui défile | **المُتصفِّح** | le type « celui qui oublie », qui fait défiler. |
| 2084 | Le Régent | **الوالي** | à valider ; jamais « الوصيّ » (titre d'Alî dans le discours chiite) ni « صاحب الأمر ». |
| 2084 | L'Admiré | **المُصفَّق له** | « celui qu'on applaudit ». |
| 2084 | Le Compteur | **العدّاد** | |
| 2084 | Le Cartographe | **راسمُ الخرائط** | |
| 2084 | l'enfant du parvis ; un passant ; un employé ; un écolier | **طفل الباحة ; عابر ; موظّف ; تلميذ** | |

### 3.4 Les cartes et les lieux (`D.MAPS`, `D.LIEUX`)

**Cartes** : Médine **المدينة** (WP-ar, « المدينة المنورة » ; dans un récit de l'an 11, « المدينة » suffit) · Koufa
**الكوفة** (« الكوفة ») · Désert **البادية** · Camp **المعسكر** · Cité romaine **المدينة الروميّة** (les Byzantins sont
**الروم**) · Palais **القصر** · Navire **السفينة** · Noosphère **عالم الأفكار** · La Citadelle **القلعة** · Cité-Miroir
**مدينة المرايا** · Archives basses **الخزانة السُّفلى** (à valider : la *khizâna* est la bibliothèque-archive ; d'où
Yûnus, الخازن).

**Lieux** (étiquettes de la carte de la halte ; un ou deux mots) :

| Français | Arabe | Français | Arabe | Français | Arabe |
|---|---|---|---|---|---|
| Mosquée | المسجد | Entrée | المدخل | Trône | سرير المُلك (§ 2.2) |
| Place | الرَّحَبة | Tente du chef | فُسطاط الأمير | Trésor | الكَنز |
| Souk | السوق | Feu | المَوقِد | Colonnade | الأروقة |
| Halle (la Saqîfa, le tribunal) | السقيفة | Étendard | الراية | Poupe | مؤخّر السفينة |
| Maisons | الدُّور | Lignes | الصفوف | Pont (du navire) | سطح السفينة |
| Puits | البئر | Tertre | الأكَمة | Mât | الصاري |
| Palmeraie | النخيل | Tentes | الخيام | Proue | مقدَّم السفينة |
| Porte du nord / du sud | الباب الشمالي / الجنوبي | Porte | الباب | Passerelle | المَعبَر |
| Enclos | الحظيرة | Grande rue | الشارع الأعظم | Entrepont | بطن السفينة |
| Colline | التلّ | Forum | الميدان | Seuil | العتبة |
| École | الكُتّاب | Basilique | الكنيسة الكبرى | Nœud | المُلتقى |
| Départ | المُنطلَق | Esplanade | الساحة | Faille | الصَّدع |
| Dunes | الكثبان | Palais | القصر | Miroir | المرآة |
| Rochers | الصخور | Fontaine | الفوّارة | Cœur | القلب |
| Oasis | الواحة | Remparts | الأسوار | Cour | الصحن |
| Source | العين | Jardin | البستان | Tour | البُرج |
| Caravane | القافلة | Marché | السوق | Grande salle | الإيوان |
| Crête | الذِّروة | Quartier | الحيّ | Greniers | الأهراء |
| Ruines | الأطلال | Nef | البهو | Poterne | الباب الخفيّ |
| Arrivée | المُنتهى | Rue | الشارع | Grand écran | الشاشة الكبرى |
| Ruelle | الزقاق | Ascenseur | المِصعد | Parvis | الباحة |
| Rayonnages | الرفوف | Bureau | المكتب | La Chaîne | السلسلة |

Notes : « Esplanade » est, dans le récit d'Umar, le lieu du Temple à Jérusalem : l'étiquette reste neutre, **الساحة** ;
le récit, lui, suit ses sources. « Halle » est la Saqîfa des Banû Sâ'ida : **السقيفة**, et en toutes lettres dans un
récit, **سقيفة بني ساعدة** (WP-ar, « سقيفة بني ساعدة »). La « Faille » de la noosphère (un lieu) est **الصَّدع**, la faille
d'une chimère (une faiblesse) **الثُّلمة** (§ 2.4). « Nœud » est **المُلتقى**, non « العُقدة » (les nœuds sur lesquels on souffle sont, au Coran 113:4, ceux de la
sorcellerie). « Trésor » est **الكَنز** : الخِزانة est déjà l'archive de 2084.

### 3.5 Les lieux nommés dans les récits

| Français | Arabe | Notice lue (WP-ar) / note |
|---|---|---|
| Médine ; La Mecque | **المدينة ; مكّة** | « المدينة المنورة ». |
| la Saqîfa des Banû Sâ'ida | **سقيفة بني ساعدة** | « سقيفة بني ساعدة ». |
| Yamâma ; la bataille | **اليمامة ; معركة اليمامة** | « معركة اليمامة » (dite aussi « معركة عقرباء »). |
| Dhû l-Qassa | **ذو القَصّة** | pas de notice ; référence non vérifiée. |
| Najrân | **نجران** | « نجران ». |
| al-Hîra | **الحِيرة** | « الحيرة ». |
| le désert de la Samâwa | **بادية السَّماوة** | « بادية الشام » : « أو صحراء السماوة ». |
| 'Ayn at-Tamr | **عين التمر** | notice « عين تمر ». |
| le Yarmoûk | **اليَرموك** | « معركة اليرموك ». |
| Qinnasrîn ; Homs | **قِنَّسرين ; حِمص** | « قنسرين » ; « حمص ». |
| le Shâm | **الشام** | « بلاد الشام ». D184 (2.8) : le français dit « le Shâm » partout, avec l'article, et « la Syrie » seulement dans un feuillet qui explique (« le Shâm, la Syrie d'aujourd'hui et ses voisins ») ; l'arabe dit toujours **الشام** — dans ce feuillet : « بلاد الشام (سورية اليوم وما جاورها) ». |
| Îliyâ' (Jérusalem) | **إيلياء** (et, dans une explication, **بيت المقدس**) | « العهدة العمرية » : « لأهل إيلياء (القدس) » ; « القدس ». |
| Tibériade | **طَبَريّة** | « طبرية ». |
| al-Madâ'in ; l'Îwân de Kisrâ | **المدائن ; إيوان كسرى** | « المدائن » ; « إيوان المدائن ». |
| al-Khatt (le port du Bahreïn) | **الخَطّ** | « إقليم البحرين » : « إقليم البحرين أو الخُط » (la notice vocalise الخُط ; la lance « خطّيّة » dit الخَطّ : à vérifier). |
| Badr | **بدر** | « غزوة بدر ». |
| le puits de Rûma | **بئر رُومة** | « بئر رومة » (« بئر عثمان »). |
| la bataille des Mâts | **ذات الصَّواري** | « معركة ذات الصواري ». |
| Alexandrie | **الإسكندرية** | « الإسكندرية ». |
| Harûrâ' | **حَرُوراء** | la notice « الحرورية » (qui nomme une secte : on ne l'emploie pas) situe « بلدة حَروراء بقرب الكوفة ». |
| Nahrawân | **النَّهروان** | « معركة النهروان ». |
| Siffîn | **صِفّين** | « معركة صفين ». Un récit en parle avec retenue, sans coupable (exigence 5). |
| la Maison assiégée ('Uthmân) | **الدار المحاصَرة** ; « حصار الدار » | **pas** « يوم الدار » seul : la notice « حديث يوم الدار » montre que l'expression désigne aussi un hadith que le discours chiite invoque (exigence 5). |
| Khaybar (la Porte de Khaybar, compétence d'Alî) | **خيبر** | |
| *Ajouts du 18 novembre (lexique commun) : lieux nommés dans plusieurs récits, relevés chez at-Tabarî [N] ou al-Balâdhurî [O]* | | |
| l'Égypte ; l'Irak ; le Hijâz ; le Yémen ; l'Arabie | **مصر ; العراق ; الحجاز ; اليمن ; جزيرة العرب** | [N] (« لا يجتمعن بجزيرة العرب دينان »). |
| Damas ; Constantinople | **دمشق ; القسطنطينية** | [O], 12221/121 (« أهل دمشق ») ; [N] (7 occ.). |
| l'Euphrate ; le Tigre | **الفرات ; دِجلة** | [N] (75 et 57 occ.). |
| Bassora ; Fustât | **البصرة ; الفسطاط** | [N] (597 occ. ; « فسطاط مصر », vol. 4). « الفسطاط » est aussi la tente (§ 3.4, « Tente du chef ») : pour la ville, « فسطاط مصر » à la première mention. |
| al-Qâdisiyya ; Nihâwand ; Tustar ; al-Anbâr | **القادسية ; نَهاوَند ; تُستَر ; الأنبار** | [N] (156, 73 et 41 occ. ; « ===فتح تستر=== », « حصار تستر », vol. 4). |
| Uhud ; Hudaybiyya (« à al-Hudaybiyya ») | **أُحُد ; الحُدَيبية** | [N] (« يوم أحد », 7 occ. ; « أهل الحديبية », 11 occ.) ; le pacte : « صلح الحديبية » (§ 2.10). |
| Emmaüs ('Amwâs) | **عَمَواس** | [N] : « طاعون عمواس » (12 occ.) ; on ne transcrit pas « Emmaüs » en arabe. |
| Chypre | **قبرص** | [O], 12221/150 : l'éditeur titre « أمر قبرص », le texte écrit « قبرس » ; [N] : « قبرس » (12 occ.). L'arabe d'aujourd'hui écrit قبرص : retenu, **à valider**. |
| Qurâqir ; Suwâ (la traversée de Khâlid) | **قُراقِر ; سُوى** | [N], vol. 3 : « وسار ففوز من قراقر إلى سوى » ; registre : « عند الخروج من قُراقِر ». « سُوى » se vocalise : sans voyelles, « سوى » se lit « sauf ». |
| l'Arménie ; l'Azerbaïdjan ; l'Ifrîqiya | **أرمينية ; أذربيجان ; إفريقية** | [N] (15, 36, 26 occ.). |

### 3.6 Les chimères et les idoles

Chaque nom est **un nom qu'un auteur arabe aurait donné** à la chose que le jeu décrit (sa `desc`), dans le registre du
récit : arabe classique pour les Compagnons et le Caïd, arabe moderne pour 2084. Tous sont des **خيالات** (§ 2.3) ;
l'idole d'un chapitre est un **صنم**. Aucun ne porte un nom de la liste du § 2.2. Les noms sont **à valider** en bloc.

**Idris, 2084** (arabe moderne)

| Français | Arabe | Pourquoi |
|---|---|---|
| Notification | **الإشعار** | le mot courant de l'interface. |
| La Tendance | **الرائج** | « ce qui est en vogue » (le *trend*). |
| La Marque | **العلامة** | la marque commerciale, « العلامة التجارية » en abrégé. |
| Le Score | **التقييم** | la note que d'autres attribuent. |
| Le Flux | **السَّيل** | « mille voix à la fois » : le torrent ; héritier de **الإشاعة** (Uthmân). |
| Le Défilement | **التمرير** | le geste de faire défiler un écran. |
| Le Petit Trône | **الكرسيّ الصغير** | en arabe moderne, « الكرسي » est le siège du pouvoir (« التشبّث بالكرسي ») ; permis en 2084 seulement (§ 2.2). |
| L'Applaudissement | **التصفيق** | |
| Le Compte | **الرَّصيد** | le solde d'un compte ; jamais الحساب (§ 2.2). |
| La Carte sans chemin | **خريطةٌ بلا طريق** | |
| L'AGRÉGOR (idole finale) | **المُجمِّع** | **à valider** : « l'agrégateur » (مُجمِّع الأخبار en arabe moderne) ; le recueil peut dire « مُجمِّع الخيالات ». Pas de translittération (أغريغور). D183 : l'Agrégor garde son nom en français, celui du niveau au-dessus des chimères ; l'arabe garde **المُجمِّع**. |

**Le Caïd** (arabe classique)

| Français | Arabe | Pourquoi |
|---|---|---|
| Chuchotement | **الوَشوَشة** | le chuchotement d'une maison qui cache une mort ; distinct de الهمس (les « Murmures » des Compagnons). |
| L'Ombre du Père (idole, peur) | **ظلُّ الأب** | |
| Dispense vendue | **الإعفاء المَبيع** | pas « الرخصة » (sens de droit religieux). |
| Le Sommeil (racine : insouciance) | **الرُّقاد** | distinct de **النوم** (la porte « En songe », § 2.5). |
| Le Tambour (idole, ostentation) | **الطَّبل** | |
| On-dit | **قيلَ وقال** | l'expression classique du bavardage sans auteur. |
| Le Bouc émissaire (idole, rancune) | **الجاني البديل** | **pas** « كبش الفداء » : en arabe, le « bélier de la rançon » est d'abord celui d'Ibrâhîm ; une idole ne peut porter ce nom. |
| Le Pur (idole, orgueil) | **النقيّ** | pas « الطاهر » ni « الأطهار » (§ 3.3). |

**Abû Bakr** (arabe des chroniques)

| Français | Arabe | Pourquoi |
|---|---|---|
| Murmure de deuil | **همسُ الحزن** | |
| Le Déni | **الإنكار** | |
| Mot d'ordre | **النَّعرة** | le cri de ralliement aveugle (« النعرة القبلية ») ; distinct de **الشِّعار** (Alî). |
| Al-'Asabiyya — le Clan (idole, peur) | **العصبيّة** | Ibn Khaldûn, [I] : « في أن العصبية إنما تكون من الالتحام بالنسب ». Le mot même du jeu français. |
| Nuée du reniement | **سِربُ النَّكث** | « nos pactes aussi » : la rupture des pactes. **Pas** « الردّة » : ce serait nommer des tribus (exigences 6 et 10). |
| L'Avare du dû (idole, avarice) | **الشَّحيح** | celui qui retient la part du pauvre. |
| Écho flatteur | **الصدى المُتملِّق** | |
| Fausse rime | **السَّجعُ الكاذب** | la prose rimée qui imite sans rien dire. |
| Mur du Jardin | **جدارُ الحديقة** | |
| Al-Kadhdhâb — le Menteur (idole, avidité) | **المُزيِّف** (proposé) | **À trancher (§ 4)** : « الكذّاب » est en arabe le surnom de Musaylima (WP-ar, « مسيلمة الكذاب ») ; l'idole porterait le nom d'un homme (exigence 6). « Chimère de la contrefaçon » : المُزيِّف, le faussaire. |

**'Umar**

| Français | Arabe | Pourquoi |
|---|---|---|
| Murmure de la faim | **همسُ الجوع** | |
| Plainte des cendres | **أنينُ الرماد** | écho de l'année de la famine, « عام الرَّمادة » (WP-ar, « عام الرمادة » : la terre noircie « فشبّهت بالرماد »). |
| L'Accapareur (idole, peur) | **المُحتكِر** | le mot classique de l'accaparement (الاحتكار). |
| Mirage de gloire | **سرابُ المجد** | |
| Le Faste | **الأُبَّهة** | |
| L'Aigle d'Airain (idole, orgueil) | **نَسرُ النُّحاس** | l'aigle des enseignes de Rûm ; jamais « العُقاب » (§ 2.2). Que *Nasr* soit aussi une idole ancienne (Coran 71:23) convient à une idole. D184 (2.10) : le français ne dit plus « l'Aigle » seul pour l'idole (l'Agrégor : « J'ai été l'Aigle d'Airain et le Trône ») ; l'arabe disait déjà toujours **نسر النحاس**, jamais نسر seul (§ 2.2) : « كنتُ نسرَ النحاس وسريرَ المُلك » (السرير seul se lirait « le lit »). |
| Reflet d'or | **بريقُ الذهب** | |
| La Couronne suspendue | **التاجُ المُعلَّق** | la couronne de Kisrâ tenue par une chaîne. |
| Le Trône vide (idole, orgueil) | **سريرُ المُلكِ الخالي** | **pas** « العرش » (§ 2.2). |

**Khâlid**

| Français | Arabe | Pourquoi |
|---|---|---|
| Murmure de soif | **همسُ العطش** | |
| Le Mirage | **السَّراب** | |
| La Soif (idole, désespoir) | **الظَّمأ** | |
| Le Décompte | **العَدّ** | |
| Forêt de lances | **غابةُ الرماح** | |
| La Peur du Nombre (idole, peur) | **رَهبةُ العدد** | |
| Écho de louange | **صدى المديح** | |
| Le Laurier | **إكليلُ الغار** | |
| L'Idole du Héros (idole, ostentation) | **صنمُ البطل** | |

**'Uthmân**

| Français | Arabe | Pourquoi |
|---|---|---|
| Murmure | **الهمس** | |
| Variante querelleuse | **المِراء** | le mal est la querelle, non la lecture : jamais « القراءة » ni « الحرف » dans ce nom (les lectures transmises sont elles-mêmes du Coran). |
| Babel (idole, soupçon) | **البَلبَلة** | la confusion des langues, que l'arabe tire du même nom ; **pas** « بابل » (la ville du Coran 2:102, liée à la magie). |
| Écume d'effroi | **زَبَدُ الفزع** | l'écume, qui s'en va. |
| L'Abîme (idole, peur) | **اللُّجّة** | le large, la mer profonde. |
| Ouï-dire | **زَعَموا** | le mot classique de ce qu'on rapporte sans garant ; **pas** « السَّماع » (en arabe, c'est aussi un mode de transmission du hadith, et l'audition soufie). |
| Écho | **الصدى** | |
| L'Or | **الذهب** | |
| La Rumeur (idole, soupçon) | **الإشاعة** | |

**'Alî**

| Français | Arabe | Pourquoi |
|---|---|---|
| Murmure de rang | **همسُ المنزلة** | |
| Soupçon | **الرِّيبة** | distinct de l'idée noire **سوء الظن** (§ 2.5). |
| Le Privilège (idole, désespoir) | **المُحاباة** | le mot classique de la faveur faite au puissant. |
| Écho | **الصدى** | |
| Clameur | **اللَّغَط** | |
| Le Slogan (idole, soupçon) | **الشِّعار** | |
| Lame pieuse | **الشَّفرة الوَرِعة** | pas « نصل » : ce mot est celui des lames du joueur (§ 2.3). |
| Le Scrupule inversé | **الوَرَعُ المقلوب** | |
| Le Juge sans miséricorde (idole, rancune) | **القاضي بلا رحمة** | jamais « الحَكَم » (Nom divin, et mot de l'arbitrage de Siffîn). |

**Le cœur** : les sept maux et les cinq idées noires, § 2.5.

### 3.7 Le lexique commun, posé « partout » (18 novembre)

Avant l'écriture des récits, les 97 textes français qui reviennent dans plusieurs fichiers ont été posés une fois pour
toutes (`node v2/tools/langues.js poser ar partout …`, 210 emplacements) : les 40 qui étaient déjà écrits dans `moteur` ou
`tables` y sont repris tels quels (Lumières, figures, titres du recueil, « Médine », « Koufa », « Archers », « Tenir »,
« Charge », « Dire vrai »…) ; les 57 autres sont écrits ici. Un rédacteur les trouve déjà dans sa liste : il ne les
réécrit pas, sauf erreur, qu'il signale. Ceux qui suivent demandaient un choix ; **à valider** :

| Français | Arabe posé | Où il revient | Pourquoi |
|---|---|---|---|
| Certitude | **الجزم** | compétence d'Abû Bakr ; deux chimères (le Pur, le Juge sans miséricorde) | « اليقين » est un degré de la foi : une chimère ne peut pas en faire son arme. « الجزم » dit l'assentiment sans hésitation d'Abû Bakr et la certitude fermée des deux chimères. |
| Anathème | **النَّبذ** | le Pur ; le Juge sans miséricorde | « التكفير » serait exact, mais c'est le mot d'un débat entre écoles et d'un parti (exigence 5) ; « النبذ » : rejeter, mettre au ban. |
| Sentence | **قضاءٌ نافذ** | compétence de 'Umar ; le Juge sans miséricorde | ni « الحَكَم » (§ 2.2), ni « الحُكم » seul, qui est le mot du cri de Harûrâ' (§ 2.10). |
| Mille bouches | **ألفُ لسان** | trois chimères de la rumeur | l'image arabe de la rumeur est la langue ; « ألف فم » serait un calque. |
| « On dit que… » | **«يُقال إنّ…»** | deux chimères | guillemets sans espaces intérieures, comme le moteur. |
| Thésauriser | **الاكتناز** | trois chimères | le mot du Coran pour l'or qu'on amasse (9:34, « يكنزون » [K]) ; « الكَنز » est déjà le lieu « Trésor » (§ 3.4). |
| Vertige | **الدُّوار** | deux chimères de la peur | vocalisé : « الدَّوّار » (qui tourne) s'écrit pareil. |
| Rangs serrés | **صفوفٌ متلاحمة** | une chimère ; Abû 'Ubayda | pas « مرصوصة » : l'image coranique des rangs de ceux qu'Allah aime (61:4 [K]) ne va pas à une chimère. |
| Tenir la ligne | **لزوم الصفّ** | al-Qa'qâ' ; Hudhayfa | pas « الثبات », la jauge de Constance (§ 2.3). |
| Serment tenu | **الوفاء بالعهد** | Dirâr ; 'Abd ar-Rahmân | pas « يمين مبرورة » : « مبرور » appelle le pèlerinage (« حجّ مبرور »). |
| Baume ; Panser ; Relever ; Affranchir | **البلسم ; التضميد ; الإنهاض ; العتق** | soins de cinq héros | « Relever » suit « أنهضَ » (§ 2.4) ; jamais « أحيا ». |
| Largesse ; Équité ; Firâsa ; La Durra | **السخاء ; الإنصاف ; الفِراسة ; الدِّرّة** | Qays, 'Uthmân ; 'Umar | « Largesse » est la lame d'al-Ghazâlî (§ 2.5) ; « الدِّرّة » vocalisée : « الدُّرّة » est la perle. |
| Flatterie ; Amplifier ; Écho ; Greniers clos | **التملّق ; التضخيم ; الصدى ; أهراءٌ مُغلَقة** | chimères | « الصدى » (§ 3.6) ; « الأهراء » (§ 3.4). |
| Frappe nette. | **ضربةٌ مُحكَمة.** | Zîrî ; Sâlim | |
| Apaisement | **التهدئة** | la Gazelle ; Abû Bakr | § 2.5. |
| 'Umar ; Abû 'Ubayda ; Amîn al-Umma ; Al-Fârûq | **عُمَر ; أبو عُبيدة ; أمينُ الأمّة ; الفاروق** | héros de deux récits | § 3.1, tels quels. |
| les cinq idées noires dans les pourparlers | **سوء الظنّ · الحقد · العار · الخوف · اليأس** | coeur et quatre récits | § 2.5, sans voyelles, comme le moteur. |
| sources des feuillets (six formes communes) | « الطبري، تاريخ الرسل والملوك »… | § 1.12 | |

### 3.8 Ce que l'écriture des récits a fixé (18 novembre, harmonisation de toute la langue)

*Relevé de l'harmonisation, une fois les sept récits écrits et relus deux fois (abubakr, umar, khalid, uthman, ali,
frame, caid). Chaque terme est **à valider**.* Ce qui suit vaut d'un fichier à l'autre : un rédacteur qui écrit le
contenu commun (`coeur`) ou une suite le reprend tel quel.

**Les formules qui reviennent d'un récit à l'autre**

| Français | Arabe fixé | Où / pourquoi |
|---|---|---|
| « La chaîne vacille. » ; « Ce n'est pas ce qui fut rapporté. » ; « c'est ce qui fut rapporté » | **تهتزّ السلسلة.** ; **ليس هذا ما رُوي.** ; **هذا ما رُوي** | phrase verbale, comme les chroniques (§ 1.1) ; le bandeau du moteur s'aligne sur les récits (« <b>تهتزّ السلسلة…</b> ») |
| « Qui te l'a dit ? » ; « Et lui, de qui le tenait-il ? » ; « De qui tiens-tu cela ? » ; « d'après » (les anneaux de la Chaîne) ; « Untel m'a rapporté, d'après untel » | **«مَن حدّثك؟»** ; **«وهو، عمّن أخذه؟»** ; **«عمّن أخذتَ هذا؟»** ; **«عن»** ; **«حدّثني فلانٌ، عن فلانٍ»** | « حدّث » est le verbe de la transmission (« حدّثنا ») : la même question dans le récit de ‘Uthmân, le récit-cadre et les veillées |
| « l'envers (du lieu, de la ville, du camp, du désert…) » ; « la noosphère de X » | **الوجه الآخر لـ…** ; **عالم الأفكار في / عند X** | le terme de D185 gardé entier |
| « en face » (le camp, la flotte d'en face) | **بإزاء** (« بإزائنا »، « الذين بإزائنا ») | le mot des chroniques ; « الجهة الأخرى / المقابلة » calquait « l'autre côté » |
| « tout le monde (le sait, le répète) » | **الناس كلّهم** | « الكلّ » avec l'article est un tour d'aujourd'hui : il ne reste que dans la langue de 2084 |
| « Il n'y a pas de rangs à mener ici » ; « Il n'a pas de rangs à mener » | **لا صفوف تُقاد هنا** ; **لا صفوف يقودها** | l'impersonnel du français garde le passif |
| « Tu dis vrai. » ; « Allons trouver… » (‘Umar) | **صدقت.** ; **انطلق بنا إلى…** | la voix de ‘Umar et d'Abû ‘Ubayda d'un récit à l'autre (al-Bukhârî n° 6830) |
| « An N H · 634 · lieu » (sous-titre d'un chapitre) ; « An N de l'Hégire » (carton) | **سنة N هـ · ٦٣٤ م · …** ; **سنة N للهجرة** | « An » se dit « سنة » partout ; la fiche d'une saga (« 13–23 H · 634–644 ») reste sans « سنة » (§ 2.10) |
| l'ambiance d'un récit (écran de la Chaîne) : orientale · romaine · maritime · désert · citadelle · noosphère · cyberpunk | **شرقيّة · روميّة · بحريّة · صحراء · قلعة · عالم الأفكار · سايبربانك** | « مشرقيّة » et « صحراويّة » écartés : un même mot sur un même écran |
| « juin 632 » | **يونيو ٦٣٢ م** | les mois de l'ère commune, dans les trois récits qui en donnent |
| les étiquettes d'un seul mot (Enfant, Récitant, Moine, Poète…) | **طفل · قارئ · راهب · شاعر** | sans tanwîn ; une étiquette de plusieurs mots garde le sien (« رجلٌ من أهل X », § 3.2) |
| « Ancien du Fort des Oliviers » (l'ancien du bourg, son porte-parole) | **شيخ حصن الزيتون** | distinct du modèle « Ancien de X » = « شيخٌ من أهل X » (un ancien parmi d'autres) |
| « Vétéran du Shâm » | **رجلٌ ممّن غزا الشام** | le modèle « رجلٌ ممّن شهد X » vaut pour une bataille, non pour une région |
| « une phrase vraie devenue lame » ; « Parole vraie, visée fausse » (feuillet) | veillées : **جملةٌ صادقة صارت شفرة** ; récit de ‘Alî : **عبارةٌ صارت شفرة** ; feuillet : **كلمةُ حقٍّ، ومرمًى باطل** | deux mots gardés (« جملة » chez le Caïd, « عبارة » chez ‘Alî, qui l'emploie aussi pour « formule ») ; la parole de ‘Alî est toujours « كلمة حق » (§ 4, point 15) |
| « condamner » | récit de ‘Umar : **قضى على** ; récit de ‘Alî et 2084 : **الإدانة، يُدين، مُدان** | à trancher (§ 4, point 15) |

**Les mots réservés, appliqués à tous les récits**

| Mot | Règle |
|---|---|
| **القائد** | le Caïd seul ; le chef d'une armée est son **أمير** (« أميره الشابّ » pour Usâma), les lieutenants de ‘Alî ses **أمراء** ; un officier de la flotte « أحدُ أمراء الأسطول » |
| **الرقيب** | jamais seul avec l'article (Nom divin) : **رقيبُ الجيش**, **رقيبُ المقدَّمة** ; l'étiquette « Guetteur » : « رقيب » (indéfini) |
| **الرسول** | jamais seul pour un envoyé : **رسولٌ من X**, **رسول معاوية**, « استقبال رسولٍ قادمٍ من اليمامة » |
| **أصحاب** | réservé aux Compagnons (§ 2.1) : « les siens » d'un émir : **مَن معه**, **رجاله** ; « أصحاب الحاجات » (les solliciteurs) reste, mot composé sans rapport |
| **النذير** | dit du Prophète ﷺ (« النذير العريان ») : « Cri d'alarme » **صيحةُ التحذير**, « L'Avertisseur » **المُحذِّر** |
| **خيرُ الناس** | surnom du Prophète ﷺ : « les meilleurs des hommes » **خيارُ الناس** |
| **تجسّد** | se dit des chimères qui prennent corps (« يتجسّد في عالم الأفكار ») ; jamais d'un personnage qui « donne un visage » à une idée (c'est aussi le mot chrétien de l'Incarnation) : **ليُرى فيه صنفٌ من الناس**, **لكي تُرى المسائلُ في أشخاصٍ يحملونها** |
| **الرَّتَل، الأرتال** | mot militaire d'aujourd'hui : « les colonnes » (les onze armées) **الجيوش** ; « la colonne » (une troupe) **الكتيبة** (« رجالُ الكتيبة », rang de la Traversée) |
| **مرسوم، مخيّم، إجازة، بالفعل، طبعًا، عملية طرح، فضوليّ، يستهدف، الرهانات** | mots d'aujourd'hui ou de chancellerie : « par décret » **بأمرٍ يُمضيه** ; « deux campements » **مضارب قومين** ; « en permission » **أُذن لها في الانصراف** ; « curieux » **النظّارة** ; « مرسوم » ne reste que dans le récit de ‘Umar (les édits de Rûm, et « Décret », compétence du Trône vide) |
| **المدينة** seule | se lit « Médine » : la Cité-Miroir **مدينة المرايا** ; une autre ville **البلد** ou **هذه المدينة** (Îliyâ') ; « une cité » en général **المدن** |
| **ما نزل** | se lit « ce qui fut révélé » : « Ce qui est descendu » **ما هبط** |

**La fiction et les sources, dans les feuillets**

- « inventé pour ce récit », « imaginé pour ce récit » : **من صنع اللعبة لهذه الحكاية** ; « ce récit » (celui du jeu) :
  **هذه الحكاية** ; le récit transmis par les chroniques : **الخبر**, **الرواية** (« في أشهر الروايات ») ;
- les trois hypocrites de fiction (Thâmir, Hâzim, Ghâlib) : le feuillet dit **النفاق** (la chose), jamais « المنافق » de
  l'homme ; Hâzim : « اخترعته اللعبة ليُرى فيه صنفٌ من الناس » ;
- la source d'un feuillet porte le numéro entre parenthèses (« صحيح البخاري (٣٧٠٠) ») ; la source d'une parole, celle du
  registre (« صحيح البخاري، رقم ٣٧٠٠ ») ;
- les sécessionnistes de Harûrâ' ne sont pas nommés par le nom du parti, même là où le français l'explique (« on les
  appellera Harûriyya, puis Khawârij ») : **فنُسبوا بعدُ إلى حروراء، ثم سُمّوا باسمٍ مأخوذٍ من خروجهم** (§ 4, point 15).

**Les termes de chaque récit** (relevés dans les notes des rédacteurs et des relecteurs)

| Récit | Français | Arabe fixé | Source / note |
|---|---|---|---|
| Abû Bakr | Les dix consignes (feuillet) | **عشرُ وصايا** | pas « الوصايا العشر » (le Décalogue) |
| Abû Bakr | face à face ; à l'instant | **مشافهةً** ; **آنفًا** | le mot des chroniques ; « وجهًا لوجه » calquait |
| Abû Bakr | Un émir parmi nous, et un émir parmi vous | **منّا أميرٌ، ومنكم أمير.** | al-Bukhârî n° 3668 (al-Hubâb), sans exclamation |
| ‘Umar | Au secours ! Au secours ! (sa lettre) | **«يا غوثاه، يا غوثاه»** | Ibn Sa‘d (« فيا غوثاه، ثلاثا ») |
| ‘Umar | briser la disette ; Je respire ; être l'égal de | **رفع المجاعة** ; **سكن رَوعي** ; **يُسوّى** | « كفؤ » appelle la كفاءة du mariage |
| ‘Umar | Pompée ; Titus ; Hadrien | **بومبيوس** ; **تيتوس** ; **هادريان** | « بومبي » se lit Pompéi |
| ‘Umar | le palais du gouverneur (à Îliyâ') ; nos gouverneurs (Sophrone) ; un édit (de Rûm) | **قصر الحاكم** ; **حُكّامنا** ; **مرسوم** | le gouverneur musulman reste **العامل** (§ 2.10) ; à Îliyâ', le palais est celui de Rûm |
| Khâlid | s'illustrer ; à voix haute ; les crieurs ; signer un pacte | **أبلى بلاءً حسنًا** ; **جهرًا** ; **الهتّافون** ; **عقد** | |
| Khâlid | au bivouac ; trois cents et quelques | **حين يحطّون الرحال** ; **ثلاثمئة ونيّف** | « المنزل » se lit « la maison » |
| Khâlid | la tente (d'Abû ‘Ubayda, des émirs) | **فُسطاط الأمير** | le mot du lieu « Tente du chef » (§ 3.4) |
| ‘Uthmân | Chuchotis ; Collation ; Un seul tracé ; L'Exemplaire de référence ; Retenue | **الهمهمة** ; **المقابلة** ; **رسمٌ واحد** ; **المصحف الإمام** ; **كفُّ اليد** | « الهمهمة » distinct de « الوشوشة » (le Caïd) et de « الهمس » |
| ‘Uthmân | « Ma lecture vaut mieux (que la tienne) » ; les sept modes | **«قراءتي خيرٌ (من قراءتك)»** ; **الأحرف السبعة**, « سبعةُ أحرف » | Ibn Abî Dâwûd, *Kitâb al-Maṣâḥif* ; al-Bukhârî n° 4992 |
| ‘Uthmân | embarquer ; la Méditerranée ; les chantiers (arsenaux) ; le port | **ركوب البحر** ; **بحر الروم** ; **دُور الصناعة** ; **الميناء** | al-Balâdhurî (« بحر الروم ») |
| ‘Uthmân | Constant II ; cinq cents voiles | **قسطنطين** ; **خمسمئة مركب** | at-Tabarî, an 31 (sans la filiation « بن هرقل ») |
| ‘Uthmân | les pâturages réservés ; l'armée des jours difficiles ; les mécontents ; la discorde | **الحِمى** ; **جيش العُسرة** ; **مَن نقموا عليه** ; **الفُرقة** | « الفتنة » ne reste que dans les paroles relevées (Ibn Sîrîn, le hadith de Khabbâb) |
| ‘Uthmân | garant ; « je ne fais que répéter » ; J'ai appris auprès d'un Compagnon | **السند** ; **«إنما أنا ناقل»** ; **قرأتُ على صحابيّ** | le mot des récitants |
| ‘Uthmân | Laisse-nous faire ; l'heure est venue de frapper ; Comme à Nihâwand | **خلِّ بيننا وبينهم** ; **«طاب أم ضرب»** ; **كما يومَ نَهاوَند** | Ibn Sa‘d, t. 3 p. 70 (l'article ḥimyarite) |
| ‘Alî | le cri de Harûrâ' ; « En route vers le Paradis ! » ; retarde la prière de midi | **«لا حكم إلا لله»** ; **«الرواح الرواح إلى الجنة!»** ; **أبرِد بالظهر** | § 2.10 ; les mots de la source |
| ‘Alî | « Interrogez-moi » ; le registre aux deux colonnes ; mot d'ordre (compétence du Slogan) | **«سلوني»** ; **الدفتر ذو العمودين** ; **الهُتاف** | « النَّعرة » reste le mot d'ordre du Clan (récit d'Abû Bakr) |
| ‘Alî | le Juge (l'idole) | **القاضي بلا رحمة**, toujours entier | « القاضي » seul se lit Shurayh ; dans la liste de l'Agrégor (« …والإشاعةَ، والقاضي »), le contexte suffit |
| ‘Alî | Dhû l-Fiqâr ; Haydar (compétences) | **ذو الفَقار** ; **حيدرة** | écrits comme le français, en attendant la décision (§ 4, point 5) |
| récit-cadre | Accordé ; Refusé ; relevé (rapport) ; la Cité | **أُجيز** ; **رُفِض** ; **تقرير**, **إحصاء** ; **مدينة المرايا** | |
| récit-cadre | Alors ? (l'enfant) | **إذن؟** | « ها؟ » est du parler (§ 1.1) |
| veillées | les amghars ; la foggara ; une galerie ; la pente douce | **الأماغرة** ; **الفُقّارة** ; **سَرَب** ; **الانحدار الهيّن**, « هيّنُ الانحدار » | « القناة » réservé au nom persan (qanât) ; Idris cite le feuillet mot pour mot |
| veillées | les recrues ; parler pour l'honneur de quelqu'un ; la dernière prière | **الحرس الجدد** ; **ذبّ عن عِرضه** ; **صلاة العشاء** | |
| veillées | trois cents | **ثلاثمئة** | « مئة » partout (et non « مائة »), sauf dans un texte relevé |

---

## 4. Points à trancher par le décideur

1. **La formule après un Compagnon** (§ 1.6). Proposition : « رضي الله عنه » une fois, à la première mention d'un
   Compagnon dans un chapitre (narration et recueil), jamais dans une réplique, un bouton, un nom de héros ou une
   étiquette. Et pour ceux que les sources rangent parmi les Successeurs (Aslam, Shurayh, Kumayl, Mâlik al-Ashtar,
   Farwa ibn Nawfal) : rien, ou « رحمه الله » ? Les textes classiques lus mettent la formule (Ibn Rajab, [F] :
   « تميم بن أوس الداري رضي الله عنه »).
2. **Les chiffres** (§ 1.4) : arabes orientaux ٠-٩ partout (proposé, comme le registre des sources) ou 0-9 (usage du
   Maghreb et de nombreux jeux) ? Le choix doit être unique.
3. **Les titres de héros sans équivalent dans les sources** (§ 3.1) :
   - 'Uthmân, « Le Généreux » → **ذو النورين** (le surnom des sources ; **validé, D186** — le français garde « Le Généreux ») ou « صاحب بئر رومة » (descriptif) ;
     pas « الكريم » (Nom divin) ;
   - 'Alî, « La Porte du Savoir » → **باب العلم** (proposé, d'après un hadith à l'authenticité discutée) ou un titre
     d'une parole sûre, « أقضى الصحابة » (d'après « وأقضانا علي », al-Bukhârî n° 4481, au registre) ;
   - 'Ammâr, « Le Vétéran » → **البدريّ** (proposé) ;
   - Khâlid : **السيف المسلول**, sans « الله » (exigence 8), comme le français.
4. **Le nom de l'idole d'Abû Bakr**, « Al-Kadhdhâb — le Menteur » (§ 3.6) : en arabe, « الكذّاب » est le surnom de
   Musaylima ; l'idole porterait le nom d'un homme (exigence 6). Proposé : **المُزيِّف** (le faussaire). Le français
   garde-t-il « Al-Kadhdhâb » ?
5. **Deux noms de 'Alî chargés en arabe** (hors de ce glossaire, mais à voir avant d'écrire ses compétences) : la
   compétence « Dhû l-Fiqâr » porte le nom d'un sabre historique que sunnites et chiites ne racontent pas de la même
   façon (WP-ar, « ذو الفقار ») — exigences 5, 16 et 17 (une arme d'un personnage de l'histoire) ; la compétence ultime
   « Haydar » (« حيدرة », surnom d'Alî) est surtout employé aujourd'hui dans le discours chiite. Les garder en arabe ?
6. **Les deux lames dont l'arabe s'écarte du champ `ar` du français** (§ 2.5) : Largesse = **السخاء** (al-Ghazâlî) au lieu
   d'*al-Karam* ; Bienveillance = **سلامة الصدر** (Ibn Rajab) au lieu d'*an-Nasîha*, qui se lit aujourd'hui « le
   conseil ». Les autres langues suivent-elles ?
7. **Les figures** (§ 2.6 ; « les postures » jusqu'à D184) : nommées par l'acte (**الإقدام، البصيرة، الإيثار**, proposé)
   ou par la personne (البطل…), sachant que « الحكيم » et « الوليّ » sont des Noms divins et que « الوليّ » porte une
   doctrine disputée ? Le mot qui les désigne : **موقف** (« اتّخاذ موقف »), à la place de وقفة (D184, proposé).
**Décidé le 18 novembre (D182)** : le décideur retient la lecture d'al-Ghazâlî (*Iḥyâ'*, « ʿajâ'ib al-qalb ») : les
idées noires sont des **خواطر** (pensées qui passent : de l'âme, de l'ange ou du Shaytân) — **الخواطر السود** ; le mot
**وسوسة / الوسواس** reste à l'étage des souffleurs (Coran 114:4), qui n'ont ni figure ni nom et ne se combattent jamais ;
**طاغوت** et **غول** ne nomment aucun ennemi (exigences 5, 6, 10, 18). « طاغوت » peut s'expliquer dans le recueil, avec
son verset tiré du registre, si un récit le demande un jour.

8. **Les termes inventés, à valider un par un** : chimère (« égrégore » jusqu'à D183) **خيال** (ou وهم) ; idées noires **الخواطر السود** (*décidé, D182*) ; Constance
   **الثبات** ; Souffle **النَّفَس** ; éprouvé **مُنهَك** ; voile **حجاب** et dévoilé **انكشف** ; lames **النصال** et le
   verbe **صقل** ; compagnons de lumière **رفاق النور** ; halte **الاستراحة** ; veillée **ليلة / السمر** ; Cité-Miroir **مدينة
   المرايا** ; Archives basses **الخزانة السفلى** ; pourparler **المحاورة** ; bataille déclarée **المصافّة** ; secours
   **الفرج** ; les degrés du mal **مراتب الشر** ; enracinement **التجذّر** ; faille **الثلمة** ; le groupe **الركب** ; le recueil
   **الكرّاسة** ; Vertus **الخصال** ; voile de lumière **غلالة من نور** ; l'Agrégor **المجمّع** ; et les noms de chimères
   du § 3.6.
9. **Les mots à ne jamais employer** (§ 2.2) : la liste est un choix de l'agent (فتنة، طاغوت، العرش، العقاب، المدد، الغوث،
   الأطهار، الوصيّ، كبش الفداء، بابل، السماع…) ; le décideur peut l'allonger ou la réduire.
10. **Les écarts de noms entre le français et les sources**, à ne pas corriger sans lui : « 'Amr ibn 'Abd al-Masîh »
    (récit de Sayf) / « عبد المسيح بن عمرو بن بقيلة » (autre récit d'at-Tabarî), déjà au registre ; Aslam, que le jeu
    dessine en Compagnon alors qu'al-'Ijlî le dit Successeur (côté prudent, rien à changer pour l'arabe).
11. **La « Maison assiégée »** ('Uthmân) se dit **الدار المحاصرة / حصار الدار**, non « يوم الدار » (§ 3.5) : à confirmer.
12. **Ce que D183 et D184 changent en arabe** (proposé par l'agent, à valider) : la jauge « Sérénité » **الهدوء**, qui
    remplace aussi « الطمأنينة » des pourparlers (§ 2.3) ; « figure » **موقف**, « Prendre une figure » **اتّخاذ موقف**,
    et en combat **بإقدام · ببصيرة · بإيثار** (§ 2.6) ; « Expérience » **الخبرة** (§ 2.4) ; « Chaîne fidèle » **سلسلةٌ
    وفيّة** (§ 2.3) ; « Dallage étoilé » **بلاطٌ بنقش النجوم** (§ 2.8) ; aucun mot de possession ni d'envoûtement
    (§ 1.11) ; 2084 = **١٥٠٧ هـ** (§ 1.5). Restent tels quels, parce que l'arabe les disait déjà : **خيال** (chimère),
    **مراتب الشر** (les degrés du mal), **المُجمِّع** (l'Agrégor), **نسر النحاس**, **الشام**.
13. **À distance du joueur** (18 novembre, version 2.08 ; § 1.8 ; proposé par l'agent, à valider) : la descente, la
    prière d'un chapitre et la vie sont celles du râwî, à la troisième personne ou sans personne. Choix de l'agent :
    le nom verbal pour les choix « Prier et se reposer » et « Descendre » (**الصلاة والراحة**، **النزول** ; l'arabe disait
    « صلِّ واسترح »، « انزل ») ; « de passage » : **مرورٌ عابر** (pas « زيارة », qui est aussi l'œuvre de la visite), et
    « De passage, on y prie et l'on s'y repose » : **عليه يُصلّي العابر ويستريح** (relecture : « في المرور العابر يُصلّى عليه
    ويُستراح » était un calque) ; « les œuvres se comptent » : **تُعَدّ**, pas « تُحتسب » (§ 2.5) ;
    « se dresse(nt) », au dernier chapitre : **برز للقتال** (l'arabe ajoutait « في وجهكم », que le français ne dit pas) ;
    les attributs : **يُتعرَّف إليه**، **المُتعرَّف إليها** (l'arabe disait « تتعرّف إليه »، « تعرّفتَ إليها »).
14. **Le lexique commun du 18 novembre** (§ 1.6, § 1.12, § 2.4, § 2.10, § 3.2, § 3.5, § 3.7 ; proposé par l'agent, à
    valider). Les choix qui engagent le plus :
    - la formule dans les feuillets suit désormais le français : **رضي الله عنه** sans parenthèses, **رحمه الله** pour
      Aslam (§ 1.6) ;
    - les sécessionnistes de Harûrâ' sont nommés par leur lieu, **أهل حروراء** puis **أهل النهر**, jamais par un nom de
      parti ; leur cri est **«لا حكم إلا لله»** (Muslim), distinct du verset ﴿إِنِ ٱلْحُكْمُ إِلَّا لِلَّهِ﴾ (§ 2.10) ;
    - les chrétiens sont **النصارى** (le mot des chroniques), les Bédouins **أهل البادية / بدويّ** (pas « أعرابي »),
      les Perses **الفُرس** (pas « العجم ») (§ 2.10) ;
    - le tribut suit la source de chaque épisode : **الجزية** (Damas), **الخراج** (Homs, Chypre), **الإتاوة** (la Ridda)
      (§ 2.10) ;
    - le gouverneur est **العامل** (« الوالي » est le Régent de 2084) ; Chypre s'écrit **قبرص** (les chroniques : قبرس) ;
    - les compétences communes : « Certitude » **الجزم** (pas اليقين), « Anathème » **النَّبذ** (pas التكفير),
      « Sentence » **قضاءٌ نافذ** (§ 3.7) ;
    - « traduction du sens » ne se dit pas en arabe ; « Fiction » se dit **من صنع اللعبة**, jamais avec le mot des
      chimères (§ 1.12).
15. **L'harmonisation de toute la langue** (18 novembre, après l'écriture et les deux relectures des sept récits ;
    § 1.3, § 3.8 ; proposé par l'agent, à valider). Les choix qui engagent le plus :
    - les règles d'une relecture étendues à tous les récits : pas de « ! » dans la bouche d'un Compagnon sans la source
      (cinq répliques corrigées : Abû ‘Ubayda, al-Hubâb, Usâma, Qays, ‘Alî) ; « القائد » réservé au Caïd ; « الرقيب »
      jamais seul ; « بإزاء » pour « en face » ; « الناس كلّهم » pour « tout le monde » ; le point hors des guillemets
      d'une parole enchâssée ;
    - « Qui te l'a dit ? » est partout « مَن حدّثك؟ », jusque dans la bouche d'une chimère des veillées (le Chuchotement)
      et du vieil homme de la Cité-Miroir ;
    - **deux choix laissés tels quels, à trancher** : « condamner » se dit « قضى على » dans le récit de ‘Umar (« أدان est
      le mot du tribunal d'aujourd'hui ») mais « الإدانة / مُدان » dans le récit de ‘Alî (le Juge sans miséricorde : « لا
      يعرف إلا الإدانة », « الكلُّ مُدان ») — l'un ou l'autre pour les deux ? ; « phrase » se dit « جملة » dans les veillées
      et « عبارة » dans le récit de ‘Alî, pour la même image (« une phrase vraie devenue lame ») ;
    - le feuillet « Le débat de Harûrâ' » ne nomme pas en arabe les Harûriyya ni les Khawârij, que le français nomme
      pour les expliquer (« فنُسبوا بعدُ إلى حروراء، ثم سُمّوا باسمٍ مأخوذٍ من خروجهم ») : § 2.2 l'interdit pour un ennemi
      et pour qualifier ces hommes ; faut-il le nommer dans ce seul feuillet, comme le français ?
    - Thâmir, Hâzim et Ghâlib : les feuillets disent « النفاق », jamais « المنافق » d'un homme nommé (exigence 11) ; le
      feuillet de Thâmir garde « وليس المنافق هو الغريب », une phrase générale que le français dit aussi.

---

## 5. Ce qui n'a pas pu être vérifié

Pour qu'un spécialiste reprenne ces points :
- les termes de la poésie ancienne pour les armes (يماني، مشرفي، خطي، سمهري، نبع، سلوقي، لمط) ;
- « المصافّة » (la bataille rangée) chez les chroniqueurs ; « الرجّالة » et « الرماة » à Yarmoûk ;
- le nom de la bannière « العقاب » ; Polaris = « الجدي » ; le lion céleste ; « قفزات الظباء » ;
- « صاحب السر » pour Hudhayfa ; Ibn an-Nabbâh ; Dhû l-Qassa ;
- la phrase de Bennabi sur le *sanam* (lue seulement dans des articles qui la citent) et son *Mushkilat al-afkâr* lui-même ;
- le livre d'al-Ghazâlî « ذم الكبر والعجب » et « النية والإخلاص والصدق » (titres vérifiés, textes non lus en ligne) ;
- « الإقدام » comme nom d'une vertu de l'éthique classique (Miskawayh n'a pas pu être relu à la lettre).
- *(18 novembre, lexique commun)* les titres arabes des sources marquées « référence non vérifiée » au § 1.12 (Ibn Hajar,
  adh-Dhahabî, *Futûh ash-Shâm*, Mâlik, ad-Dâraqutnî, Abû Yûsuf, Ibn 'Abd al-Hakam, Ibn Abî Dâwûd, Wakî', al-Isfahânî,
  Ibn Qutayba, Ibn Mâjid), et les noms arabes d'Eutychius (سعيد بن البطريق), de Théophane, d'Eusèbe et de la Geniza ;
  « أمير البحر » pour « l'amiral » ; les noms de compétences du § 3.7 (« البلسم »، « التضميد »، « الجزم »، « النبذ »…),
  qui sont de l'usage courant et n'ont pas été cherchés chez les auteurs ; les pages de WP-ar (l'API refusait les
  lectures ce soir-là).
