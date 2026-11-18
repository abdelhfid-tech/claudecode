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

### 2.1 Mots réservés

| Français | Arabe | Règle |
|---|---|---|
| un Compagnon (du Prophète ﷺ) | **صحابيّ**, pl. **الصحابة** ; « صاحب رسول الله ﷺ » | réservé aux Compagnons. **Jamais** pour un membre du groupe, un compagnon de lumière, un ami de 2084. |
| un compagnon (membre du groupe), les compagnons | **رفيق**, pl. **الرفاق** | « relève un compagnon éprouvé » → « يُنهِض رفيقًا مُنهَكًا ». |
| le groupe (l'équipe du joueur) | **الرَّكْب** | à valider. Le *rakb* est la troupe qui voyage ensemble. Éviter **الجماعة** (« la Communauté », sens religieux et confessionnel) et **الفريق** (sportif). |
| le Messager d'Allah ﷺ, le Prophète ﷺ | **رسول الله ﷺ**، **النبي ﷺ** | exigence 1. |
| Commandeur des croyants | **أمير المؤمنين** | titre d'Umar, d'Uthmân, d'Alî dans les répliques. |
| Iblîs | **إبليس** | nommé, jamais montré (exigence 18) ; jamais dans un nom de combattant ni de compétence. |

### 2.2 Ce qu'aucun ennemi, aucune compétence, aucun objet ne s'appelle

Le validateur refuse en français les noms d'Iblîs, d'un démon ou d'un djinn. En arabe, la liste est plus longue,
parce que des mots ordinaires y portent un sens religieux ou confessionnel. **Aucun nom d'égrégore, d'idole, de
compétence, d'objet ni de lieu frappé ne contient** :

| Mot | Pourquoi |
|---|---|
| شيطان، شياطين، إبليس، جنّ، جنّي، جانّ، عفريت، مارد، غول، سِعلاة، قرين، هامة | démons, djinns, êtres du folklore (exigences 6 et 18). « القرين » est le compagnon-djinn de chaque homme. **Attention** : Dirâr ibn al-Azwar reçut des Rûm un surnom contenant « شيطان » (WP-ar, « ضرار بن الأزور ») : le jeu ne l'emploie jamais. |
| فتنة، الفتنة | désigne en arabe les guerres entre Compagnons (WP-ar, « معركة صفين » : « تاريخ الفتنة الأولى ») : aucun égrégore ne s'appelle ainsi (exigence 5). |
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
| **voile** (la garde d'un égrégore), **voiles** | **حِجاب**, pl. **حُجُب** | al-Ghazâlî, [D] : parmi les cinq causes qui empêchent le miroir du cœur de refléter le vrai, « حجاب مرسل بين المرآة والصورة » | **à valider**. Un voile ôté : « انهتك حجاب » ou « سقط حجاب ». Ne pas confondre avec le « voile de lumière » des Compagnons (§ 2.9). |
| **dévoilé** (un égrégore vaincu : on a montré qu'il est vide) | **انكشف** ; adj. **مكشوف** ; « انكشف خواؤه » | al-Ghazâlî, [D] : le cœur poli « … حتى يتلألأ فيه جلية الحق وينكشف » | **à valider**. Éviter الكشف seul (dévoilement mystique soufi). |
| **Niyya** (l'intention, jauge) | **النيّة** | al-Ghazâlî, *Ihyâ'*, livre « النية والإخلاص والصدق » (quart des « المنجيات ») [A] | |
| **Sakîna** (la sérénité, jauge) | **السَّكينة** | Coran 48:4 et 48:18 [K] | |
| **râwî** (le transmetteur, le joueur) | **الراوي** ; au vocatif **يا راوي** | al-Khatîb al-Baghdâdî, *al-Jâmi' li-akhlâq ar-râwî wa-âdâb as-sâmi'* [L, « الجامع لأخلاق الراوي وآداب السامع »] | Le pluriel, **الرواة**. |
| **isnad** | **الإسناد** (le titre du jeu : إسناد) | WP-ar, « سند (علم الحديث) » : « السند أو الإسناد … هو سلسلة الرواة الذين نقلوا الحديث واحدا عن الآخر » [L] | |
| **la Chaîne** (l'écran des maillons) | **السِّلسلة** | même page : « سلسلة الرواة » [L] | « La Chaîne entière » (compétence d'Idris) : « السلسلة كاملةً ». |
| **maillon** (une saga) | **الحَلْقة** (vocalisée à la première occurrence) | usage courant (« حلقة في سلسلة »), référence non vérifiée | La حَلَقة, elle, est un cercle d'étude (WP-ar, « حلقة علم ») : le jeu dit pour ce sens **مجلس العلم** (§ 3.3). |
| **égrégore** (l'ennemi du jeu) | **خَيال**, pl. **خَيالات** | proposition tirée du théâtre d'ombres arabe, **خيال الظل**, aussi nommé « شخوص الخيال، طيف الخيال » : des figures découpées qui semblent vivre quand beaucoup les regardent ensemble à la lumière d'une lampe, et ne sont qu'une ombre (WP-ar, « خيال الظل » et « ابن دانيال », poète mamelouk de ce théâtre) [L] | **à valider**. Le mot n'évoque ni djinn ni démon, et dit ce que le jeu dit : une forme vide qui prend corps sous le regard. « un égrégore de la tyrannie » : « خيالُ الطغيان ». Autre choix : **وَهْم**, pl. أوهام (« une illusion »), plus abstrait. Écartés : طَيف (le mot sert aussi, chez des commentateurs, pour le toucher du diable en Coran 7:201 — référence non vérifiée), شَبَح (« fantôme » : esprit des morts, hantise), فتنة، طاغوت، هوى (§ 2.2). |
| **idole** (l'égrégore d'un chapitre) | **الصَّنَم**, pl. **الأصنام** | Malek Bennabi : « عندما تغرب الفكرة يبزغ الصنم » (cité par le blog d'Al Jazeera « أفكارنا أصنامنا », 30 avril 2018, qui la situe dans *Shurût an-nahda* ; source secondaire, non relue dans le livre) | Autre choix : الوثن. Le carton « Bataille déclarée » dit : « صنمٌ يُنازَل ». |
| **noosphère** (l'envers de la ville) | **عالم الأفكار** | Malek Bennabi, *Mushkilat al-afkâr fî l-'âlam al-islâmî* : عالم الأشياء، عالم الأشخاص، عالم الأفكار [J] | Chez Bennabi, c'est l'univers des idées d'une société ; le jeu en fait un lieu. Ne pas écrire النوسفير (calque). Carte : **عالم الأفكار** ; « dans la noosphère » : « في عالم الأفكار ». |
| **idées noires** (cinq) | **الخواطر السُّود** (sg. خاطرٌ أسود) | al-Ghazâlî, [D] : « وأعني بالخواطر ما يحصل فيه من الأفكار والأذكار » ; « السود » rappelle « السوداء », l'humeur noire de la vieille médecine | **à valider**. Autre choix : **الهموم** (« les soucis »), mais la honte n'est pas un *hamm*. Les cinq : § 2.5. |
| **maux du cœur** (sept) | **أمراض القلوب** ; un mal : **مرضٌ من أمراض القلب** | al-Ghazâlî, [C], « بيان الدواء الذي ينفي مرض الحسد عن القلب » : « الحسد من الأمراض العظيمة للقلوب، ولا تداوى أمراض القلوب إلا بالعلم والعمل » | Pas « مرض القلب » seul dans une interface (« maladie cardiaque ») : « داء القلب » en abrégé. |
| **lames** (forgées par les œuvres) | **النِّصال** (sg. **نَصْل**) ; « forger » : **صَقَل** (« la prière a poli la lame de la Sincérité ») | l'image du cœur-miroir qu'on polit : al-Ghazâlî, [D] : « تزيد مرآة القلب جلاء وإشراقاً ونوراً » | **à valider** (le nom et le verbe). Éviter « مطبوع » (forgé, au sens ancien : WP-ar, « مهند (اسم) », « السيوف المطبوعة من حديد الهند ») : il se lit aujourd'hui « imprimé ». Exigence 16 : une lame n'a ni nom d'homme ni inscription. |
| **provision du cœur** (zâd) | **الزاد** ; **زاد القلب** | Coran 2:197 [K] (le recueil du jeu cite ce verset) | |
| **compagnons de lumière** (animaux de fiction) | **رفاق النور** | — | **à valider**. Jamais صحابة ni أصحاب (§ 2.1). |
| **halte** (le menu) | **الاستراحة** | — | **à valider**. Autre choix : المَنزِل (la halte des caravanes), mais « المنزل » se lit « accueil » dans une interface. |
| **veillée** (les veillées du Caïd) | **السَّمَر** ; une veillée : **ليلة** ; les veillées du Caïd : **ليالي القائد** ; « Veillée de la Véracité » : **ليلة الصدق** | Abû Hayyân at-Tawhîdî, *al-Imtâ' wa-l-mu'ânasa*, « ما جرى في سبع وثلاثين ليلة » [L, « الإمتاع والمؤانسة (كتاب) »] | **à valider**. |
| **Cité-Miroir** (la ville de 2084) | **مدينة المرايا** | fiction | **à valider**. |
| **pourparler** | **المُحاوَرة** (verbe : حاوَر) | Coran 18:34 et 18:37, « وهو يحاوره » [K] | **à valider**. Autre choix : المفاوضة (plus diplomatique). « Pourparler gagné / perdu » : « أقنعتِ المحاورة / لم تُقنِع ». |
| **bataille déclarée** | **المُصافّة** (la bataille rangée, où chacun voit les rangs d'en face) | usage des chroniqueurs, référence non vérifiée en ligne ; les rangs eux-mêmes : « صفوف الروم » [G, p. 11] | **à valider**. Le carton dit : « مُصافّة مُعلَنة ». Écartés : الزحف (Coran 8:15 [K], contexte de combat contre des hommes), الملحمة, الجهاد (§ 2.2). |
| **le secours** | **الفَرَج** (« جاء الفرج ») | at-Tanûkhî, *al-Faraj ba'd ash-shidda* (WP-ar, « الفرج بعد الشدة », qui cite aussi les livres du même titre d'al-Madâ'inî et d'Ibn Abî d-Dunyâ) [L] | **à valider**. Le *faraj* vient, on ne le commande pas : c'est ce que dit le jeu. Écartés : المَدَد، الغَوث (§ 2.2). |
| **l'organigramme du mal** | **مراتب الشرّ** | — | **à valider**. Titre de la page : « مراتب الشر ». |
| **les souffleurs** | **المُوَسْوِسون** | Coran 114:4, « الوسواس » [K] ; al-Ghazâlî, [D], « بيان تسلط الشيطان على القلب بالوساوس » | Jamais dessinés ni combattus. Le texte coranique, s'il est cité, vient du registre. |
| **« démons intérieurs »** (façon de parler, aussitôt expliquée) | « **شياطين النفس** » (entre guillemets) | usage courant | **à valider**. Le jeu enchaîne : « ليست شياطين: إنها أمراض القلب ». |

### 2.4 Combat et fiche des personnages

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| faille (d'un égrégore) ; « Frapper la faille » | **الثُّلمة** ; « ضرب الثُّلمة » | al-Ghazâlî, [D], « بيان تفصيل مداخل الشيطان إلى القلب » : le cœur est une forteresse, qu'on garde « بحراسة أبواب الحصن ومداخله ومواضع ثلمه » | **à valider**. Autre choix : الثغرة (sens militaire courant). |
| Vertus (le menu des compétences) | **الخِصال** (sg. خَصلة) | — | **à valider**. Distinct des Valeurs (الفضائل, § 2.5) et des Lumières (الأنوار, § 2.8). |
| Garde (commande) ; « se garder » | **التحصّن** ; « يتحصّن » | même image de la forteresse [D] | **à valider**. |
| Objets (menu de combat), la besace | **المِزوَد** (le sac à provisions, de *zâd*) | usage courant, référence non vérifiée | Autre choix : الجِراب. |
| Force (atk) · Esprit (mag) · Garde (def) · Élan (spd) | **القوّة · الذِّهن · المَنَعة · الخِفّة** | — | **à valider**. « Esprit » n'est pas الروح (sens religieux). |
| niveau | **المرتبة** (« المرتبة ٣ ») | — | Autre choix : المستوى (plus moderne). |
| Sagesse (ce que rapportent combats et pourparlers) | **الحِكمة** | — | Nom commun ; jamais الحكيم (Nom divin, § 2.2). |
| doute (altération) | **التردّد** | — | |
| murmure intérieur (altération `waswas`) | **الوسوسة** | Coran 114:4 [K] ; [D] « بالوساوس » | |
| étourdi, sonné | **مذهول** | — | |
| relever un compagnon éprouvé | **أنهضَ** (« نهض الرفيق ») | — | Jamais « أحيا » (rendre la vie : Allah seul). |
| ôter les altérations | **يُزيل العوارض** | — | Jamais « يُطهِّر » (pureté rituelle). |
| dirham (la monnaie du jeu) | **دِرهم**, pl. **دراهم** | — | |
| rôles : guerrier · gardien · sage · soigneur · stratège | **المُقاتل · الحامي · العالِم · المُداوي · صاحب الرأي** | « صاحب الرأي » : WP-ar, « الحباب بن المنذر » : « وكان ذو رأي ومشورة » [L] | **à valider**. Le rôle « sage » (العالِم) n'est pas la posture « sage » (البصيرة, § 2.6). |
| tempérament (d'où vient la première posture) | **الطَّبع** | al-Ghazâlî, [D] : « والهم على وفق الطبع » | |

### 2.5 Le cœur (`coeur.js`)

**Les œuvres** (`D.OEUVRES`) — elles ne donnent aucun pouvoir (exigence 15) : on ne les écrit jamais avec un verbe
d'effet magique (لا « تمنح »، « تهب قوة »), mais « تُعِدّ القلب » (elles préparent le cœur), « تزيد الزاد ».

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

| Mal (égrégore) | Arabe | Source du mal | Lame = Valeur | Arabe | Source de la lame |
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
- Les sept égrégores portent ces noms avec l'article (الحرص، الكبر…) ; leurs répliques sont des répliques, jamais des
  versets ni des hadiths.

**Les idées noires** (`D.NOIRS`) :

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| La Honte (la peur du regard des siens) | **العار** | usage courant, référence non vérifiée | Jamais **الحياء** (la pudeur, une vertu louée) ni **الخِزي** (l'opprobre du Jugement). |
| La Peur (ce qui n'est pas arrivé, vécu comme fait) | **الخوف** | — | **à valider**. Chez al-Ghazâlî, le *khawf* d'Allah est une station louée (*Ihyâ'*, « الخوف والرجاء » [A]) : le texte doit montrer qu'il s'agit d'une peur de l'avenir. Autre choix : **الهَلَع**. |
| Le Soupçon | **سوء الظنّ** | [D] : parmi les portes du cœur, « ومن أبوابه سوء الظن بالمسلمين » | Le petit égrégore « Soupçon » du récit d'Alî est **الرِّيبة** (§ 3.6) : deux mots, deux choses. |
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
| La Gazelle | **الظَّبي** (« قفزات الظباء », les trois paires d'étoiles) | référence non vérifiée (pas de page WP-ar) | Apaisement → **التهدئة** |

**Valeurs et attributs** (`bien`, `valeurs`, `attributs`) :

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| Valeurs et attributs (la page) | **الفضائل والأسماء الحسنى** | « الأسماء الحسنى » : Coran 7:180 [K] ; al-Ghazâlî, *al-Maqsad al-asnâ fî sharh ma'ânî asmâ' Allâh al-husnâ* [L, « المقصد الأسنى »] | Le mot **صفات** (« attributs ») est celui d'une théologie disputée (exigence 5) : on dit « اسمٌ من أسماء الله الحسنى ». |
| une Valeur | **فضيلة**, pl. **الفضائل** | — | |
| un badge | **شارة**, pl. **الشارات** | — | Sans inscription (exigence 21). |
| reconnaître un attribut / ne pas le posséder | « **تعرّفتَ إلى اسم الله …** » ; jamais « نِلتَ », « مَلكتَ », « اكتسبتَ » | — | Exigence 21. |
| les sept Noms | **الرَّزَّاق** · **الكَبِيرُ المُتَعَال** · **الخَبِير** · **الوَهَّاب** · **الحَيُّ القَيُّوم** · **اللَّطِيف** · **الحَلِيم** | les versets du jeu (51:58 ; 13:9 ; 67:14 ; 3:8 ; 2:255 ; 42:19 ; 2:263), dont le texte vient du registre | Vocalisés en entier ; jamais sur un sprite (exigence 8). |

**Les portes et la descente** (`portes`) :

| Français | Arabe retenu | Source | Note |
|---|---|---|---|
| les portes de la noosphère | **أبواب عالم الأفكار** | l'image du cœur-forteresse et de ses portes, [D] | |
| Au sortir de la prière · Dans le dhikr · En songe | **عَقِبَ الصلاة · في الذِّكر · في المنام** | — | « En songe » : **المنام**, jamais **الحُلم** ni **الرؤيا** : un hadith attribue la *ru'yâ* droite à Allah et le *hulm* au Diable (al-Bukhârî, n° 3292 [CDN : `ara-bukhari`]). |
| S'endormir ; un sommeil sans songe | **النوم** ; **نومٌ بلا منام** | — | |
| descendre ; ta descente | **النزول** ; **نزولُك** | — | |
| le labyrinthe | **المتاهة** | — | |
| l'issue | **المَخرَج** | Coran 65:2 [K] | |
| un abri | **مَلجأ** | — | |
| ce qui rôde | **ما يحوم** | — | |
| le chrono | **المُهلة** | — | |
| le seuil | **العَتَبة** | — | |
| rattrapé | **أُدرِك** | — | |
| le secours (titre) ; « Le groupe est relevé » | **الفَرَج** ; « نهض الركب » | § 2.3 | |

**L'organigramme du mal** (`mal`) :

| Français | Arabe retenu | Source |
|---|---|---|
| Organigramme du mal | **مراتب الشرّ** | à valider |
| Iblîs — l'ennemi déclaré | **إبليس — العدوّ المبين** | Coran 2:168 [K] (référence que donne déjà le jeu) |
| Les souffleurs — des démons d'entre les djinns, et parfois des hommes | **المُوَسْوِسون — شياطين من الجنّ، ومن الإنس أحيانًا** | Coran 114:4-6 [K] |
| Le cœur — il entend, et il consent ou refuse | **القلب — يسمع، فيقبل أو يأبى** | [D] |
| Les idées noires — ce qui pèse sur une personne | **الخواطر السود — ما يُثقِل على المرء** | § 2.3 |
| Les égrégores — l'idée reprise par beaucoup de cœurs | **الخيالات — فكرةٌ تتناقلها قلوبٌ كثيرة** | § 2.3 |
| Les idoles — l'idée enracinée : elle commande | **الأصنام — فكرةٌ تجذّرت فصارت تأمر** | § 2.3 |
| l'enracinement (jauge d'une idole) ; une racine | **التجذّر** ; **جِذر** | à valider. Jamais **الرسوخ** (loué : « والراسخون في العلم », Coran 3:7 [K]). |
| ce qui est enseigné / les images du jeu (les deux étages) | **ما جاء به النقل / صُوَرٌ من صُوَر اللعبة** | à valider |

### 2.6 Les postures (exigence 24)

**Choix proposé : l'arabe nomme la posture par l'acte, non par la personne.** La raison est arabe : « الحكيم » (le sage)
et « الوليّ » (le saint) sont aussi des Noms divins (§ 2.2), et « وليّ » porte une doctrine (les *awliyâ'* et leurs
prodiges) que les écoles ne lisent pas de la même façon (exigence 5) ; dire « الوليّ » d'un personnage, c'est dire qu'il
*est* un saint, ce que l'exigence 24 interdit. Un nom d'acte se *prend*, il ne se possède pas.

| Français | Arabe retenu | Source | Devise (fr) |
|---|---|---|---|
| Les postures ; prendre une posture | **الوقفات** (sg. **وقفة**) ; « اتّخذ وقفة » | — | à valider |
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
