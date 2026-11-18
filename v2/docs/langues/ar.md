# Glossaire arabe d'ISNAD 2.x

Ce glossaire fixe, pour toute l'écriture arabe du jeu, les conventions, les mots du jeu et les noms propres. Chaque agent
qui écrit en arabe le suit ; un terme absent se demande ici avant d'être inventé ailleurs.

**Règle du décideur (18 novembre).** L'arabe ne traduit pas le français : il reprend chaque notion **là où la langue
arabe l'a déjà dite**, dans ses livres. Un terme retenu porte donc l'ouvrage où il est employé dans ce sens, et l'adresse
où cela a été lu. Quand rien n'a pu être relu en ligne, le glossaire le dit (« référence non vérifiée ») ; quand la
notion n'existe pas dans la tradition (égrégore, noosphère, Constance…), le terme est une **proposition**, marquée
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
- **Point d'exclamation** : rare. Un cri dans un combat, un égrégore qui se croit juste ; jamais dans la bouche d'un
  Compagnon sans que la source le donne.
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
- 2084 : « سنة ١٥٠٨ هـ / ٢٠٨٤ م ».

### 1.6 Formules de respect

| Après | Formule | Règle |
|---|---|---|
| le Prophète | **ﷺ** (U+FDFA, un seul caractère) | comme le jeu français : après « رسول الله »، « النبي »، « محمد » et toute désignation du Prophète, à chaque fois, dans tout texte (récit, recueil, références). La police Amiri, chargée par le jeu, a ce glyphe. Le Prophète n'est jamais représenté ni mis en dialogue (exigence 1). |
| un autre prophète (Ibrâhîm, Mûsâ…) | **عليه السلام** | à la première mention d'un écran ou d'une entrée ; rare dans le jeu. |
| un Compagnon | **proposition : رضي الله عنه** (عنها، عنهما، عنهم) | **à trancher par le décideur** (§ 4). Le français n'en met pas. En arabe, un récit sur un Compagnon sans cette formule surprend le lecteur pieux ; une formule à chaque nom alourdit une réplique de trois lignes. Proposition : une fois, à la **première mention** du Compagnon dans un chapitre (narration et recueil), jamais dans une réplique (personne ne dit « رضي الله عنه » de l'homme à qui il parle), jamais dans un bouton, un nom de héros, une compétence ni une étiquette sur la carte. |
| un mort de la fiction | rien (pas de رحمه الله dans la bouche du narrateur ; un personnage peut le dire dans une réplique) | |

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
- Le narrateur dit « tu » au joueur : « يا راوي » (vocatif, sans article).
- **Le duel** est obligatoire quand on parle de deux : « الرفيقان »، « حجابان »، « قالا ». Les répliques adressées à deux
  personnes sont au duel (أنتما).
- **Le pluriel** : on parle à un groupe au masculin pluriel (أنتم) ; une femme seule au féminin singulier. Le jeu met
  en scène peu de femmes (exigence 4 : « une famille », « les gens ») : on garde ces désignations collectives (أهل بيت،
  الناس).
- Pluriel des non-humains (égrégores, rangs, objets) : accord au féminin singulier (« الخيالات تحوم »، « الصفوف تقدّمت »),
  comme l'arabe classique.

### 1.9 Longueur des répliques

Une boîte de dialogue tient **trois lignes sur un téléphone** (texte « grand » d'office sur écran tactile). En arabe :
- **environ 90 à 110 caractères** par boîte (espaces comprises), soit 15 à 20 mots ; l'arabe sans voyelles est plus
  court que le français (compter 80 à 85 % de la longueur française), mais la police Naskh est plus haute : ne pas
  remplir jusqu'au bord.
- Une idée par boîte ; on coupe une longue réplique en deux répliques plutôt que de serrer.
- Les noms de compétences et d'ennemis : **deux mots**, trois au plus (« الكلمة الصادقة »، « العرش… » : voir § 2.2).
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
