# ISNAD 2.x — glossaire anglais

Ce glossaire fixe, pour toute l'écriture anglaise du jeu, chaque terme, chaque nom et chaque convention. Il est écrit en
français ; les termes retenus sont en anglais, **en gras**. Il vaut pour tous les agents qui écrivent l'anglais d'ISNAD :
on ne s'en écarte pas sans une décision du décideur, et un terme nouveau s'y ajoute avant d'entrer dans le jeu.

Règle du décideur (18 novembre) : chaque langue prend ses concepts **à la source, dans la littérature de la langue
elle-même**, et non en traduisant le français. Un terme anglais vient donc d'un ouvrage anglais où il est employé dans ce
sens ; l'ouvrage est nommé, et l'adresse lue est notée. Quand aucun ouvrage ne fixe l'usage, le terme est une proposition,
marquée **à valider**. « Usage courant, référence non vérifiée » veut dire : je n'ai pas lu l'ouvrage qui l'emploie.

Ce glossaire ne cite ni verset ni parole : le registre des sources (`v2/docs/sources/`) le fait, verset par verset, parole
par parole. Il donne seulement, pour un mot que les versets emploient aussi, la forme de *Saheeh International*, pour que le
texte du jeu et le verset cité au même écran disent la même chose.

Les exigences de respect d'`AGENTS.md` (1 à 24) valent en anglais comme en français. Quelques-unes prennent en anglais une
forme particulière ; elles sont rappelées là où elles mordent (§ 1.9).

## Ouvrages de référence et adresses lues

Abréviations employées dans les tableaux.

| Abr. | Ouvrage | Lu sur |
|---|---|---|
| **SI** | *Saheeh International*, édition servie par quran.com (traduction 20), celle que retient le registre des sources | `https://api.quran.com/api/v4/verses/by_key/S:V?translations=20` (lu le 18 nov. pour 2:34, 2:153, 2:185, 2:197, 2:198, 2:255, 2:263, 3:8, 3:159, 5:110, 6:74, 6:112, 7:179, 8:9, 12:87, 13:9, 17:70, 18:50, 33:40, 34:15, 42:19, 48:4, 49:12, 51:58, 57:25, 67:14, 114:4-6) |
| **IJMES** | *IJMES Translation and Transliteration Guide*, International Journal of Middle East Studies, Cambridge University Press | `https://www.cambridge.org/core/journals/international-journal-of-middle-east-studies/information/author-resources/ijmes-translation-and-transliteration-guide` |
| **Tabari** | *The History of al-Ṭabarī*, 40 vol., SUNY Press, 1985-2007 (trad. collective, dir. Ehsan Yar-Shater) | texte intégral : `https://archive.org/details/edg-the-history-of-al-tabari` (fichier djvu.txt, cherché par mots) |
| **Guillaume** | Ibn Isḥāq, *The Life of Muhammad*, trad. A. Guillaume, Oxford University Press, 1955 | texte intégral : `https://archive.org/details/the-life-of-muhammad-ibn-ishaq` (fichier djvu.txt) |
| **WP-MOS** | Wikipedia, *Manual of Style/Islam-related articles* | `https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Islam-related_articles` |
| **WP** | Wikipedia en anglais, titre de l'article (forme usuelle d'un nom) | `https://en.wikipedia.org/wiki/<titre>` ; titres vérifiés par l'API (`action=query&redirects=1`) |
| **GF** | Google Fonts, feuilles de style des polices du jeu (Alegreya, Cinzel, Share Tech Mono) | `https://fonts.googleapis.com/css2?family=<police>` (plages `unicode-range`) |

(La suite du tableau est complétée plus bas, au fil des sections.)

## 1. Conventions d'écriture

### 1.1 Registre

- **Récits du VIIe siècle** (les cinq sagas, les veillées du Caïd) : l'anglais du récit historique, sobre, celui des
  traductions de chroniques (*Tabari*, *Guillaume*) débarrassé de leurs archaïsmes. Ni *thee/thou*, ni *verily*, ni
  *lo*, ni *ye* ; ni familiarité moderne (*okay*, *guys*, *awesome*, contractions relâchées dans la bouche d'un
  Compagnon). Les contractions courantes (*don't*, *it's*) sont admises dans les répliques de personnages de fiction et
  dans la bouche du râwî ; dans la narration et dans la bouche des Compagnons, on les évite.
- **2084, la Cité-Miroir, les écrans du jeu** : un anglais moderne, sobre, sans argot ni anglicisme de réseau social
  (*like*, *follow*, *viral* ne s'emploient que pour nommer ce que les égrégores de la Cité vendent, jamais comme
  ton). Le jeu tutoie en français : l'anglais dit *you*, sans autre marque.
- Une réplique française donne **une** réplique anglaise : on ne coupe pas, on ne fusionne pas (le texte anglais est
  rangé sous la clé du texte français, `v2/src/core/langue.js`). On ne rajoute rien que le français ne dise pas, on n'en
  retranche rien qui porte un fait.

### 1.2 Orthographe : américaine

**Choix : l'orthographe américaine** (*honor*, *favor*, *armor*, *center*, *defense*, *realize*, *traveler*,
*gray*, *practice* nom et verbe). Raisons :

1. Les versets s'affichent dans le jeu en *Saheeh International*, tels quels, sur les mêmes écrans que le texte du jeu
   (le secours, les attributs, le recueil). Cette traduction écrit à l'américaine : « *We have certainly **honored** the
   children of Adam* » (SI 17:70), « *sent down **tranquility*** » (SI 48:4), « *remember My **favor*** » (SI 5:110).
   Une seule orthographe par écran.
2. La traduction anglaise de référence des chroniques, *Tabari* (SUNY Press), est américaine : dans le texte intégral,
   *honor* 500 fois contre *honour* 12, *armor* 99 contre *armour* 5. *Guillaume* (OUP) et les traductions d'al-Ghazâlî
   de l'Islamic Texts Society sont britanniques (*honour* 136 fois chez Guillaume, 0 *honor* ; « *recognised* » sur la
   page de l'ITS) : on ne leur emprunte que des mots, jamais leur orthographe.

Conséquences : on écrit *armor* (même si Wikipedia titre « *Lamellar armour* »), *rancor* n'est pas employé (§ 2.6),
*valor*, *color*, *gray*. Les citations publiées gardent leur orthographe (le registre les recopie telles quelles).

### 1.3 Translittération des noms arabes

**Système : celui de l'IJMES pour les noms propres** — sans signe diacritique, sauf le *ʿayn* et la *hamza*. Le guide
de l'IJMES dit : « *Diacritics should not be added to personal names, place names* […] *However, ʿayn and hamza should
be preserved in all these cases (except for initial hamza, which is dropped).* » C'est aussi, à peu de chose près, ce
que fait le jeu français (« 'Umar », sans les circonflexes en moins), et ce que font *Tabari* et l'*Encyclopaedia
Britannica* une fois leurs points souscrits ôtés.

| Règle | Exemple | Source |
|---|---|---|
| Voyelles longues sans signe : â, î, û → a, i, u | Abû Bakr → **Abu Bakr** ; Khâlid → **Khalid** | IJMES |
| Consonnes emphatiques sans point : ṣ, ḍ, ṭ, ẓ, ḥ → s, d, t, z, h | Hudhayfa, Dirar | IJMES |
| *ʿayn* : **ʿ** (U+02BF, « modifier letter left half ring ») | 'Umar → **ʿUmar** ; 'Alî → **ʿAli** ; Sa'd → **Saʿd** | IJMES ; SI l'écrit ainsi (« *ʿArafāt* », « *al-Mashʿar* », SI 2:198) |
| *hamza* au milieu ou en fin de mot : **’** (U+2019) ; à l'initiale : rien | Qur'ân → **Qur’an** ; Îliyâ' → **Iliya’** ; Harûrâ' → **Harura’** | IJMES (initiale omise) ; SI écrit la hamza ’ (« *Qur’ān* » 2:185, « *Saba’* » 34:15) |
| Article : **al-**, minuscule, sans assimilation | as-Siddîq → **al-Siddiq** ; 'Abd ar-Rahmân → **ʿAbd al-Rahman** ; at-Tamîmî → **al-Tamimi** ; az-Zubayr → **al-Zubayr** | IJMES (« *The definite article (e.g., the Arabic al-) is lowercase everywhere* ») ; *Tabari* « al-Siddiq » ; WP « *Abd al-Rahman ibn Awf* », « *Abd Allah ibn al-Zubayr* » |
| Article en tête de phrase ou de titre : **Al-** | Al-Qaʿqaʿ arrived… | IJMES (minuscule « *everywhere* » s'entend dans la phrase ; la majuscule d'initiale de phrase reste) |
| Élision après une préposition : **wa-l-, bi-l-, li-l-** | — | IJMES |
| *ibn* en minuscule entre deux noms ; **Ibn** en tête | ʿAli ibn Abi Talib ; **Ibn ʿAbbas** | IJMES (« *Connectors in names — such as bin, ben, abu — are lowercase only when preceded by a name* ») |
| Jamais l'abréviation **b.** dans le jeu (*Tabari* l'emploie) | Khalid ibn al-Walid, non « Khalid b. al-Walid » | choix de lisibilité |
| Tâ' marbûta : **-a** (en annexion : **-at**) | Saqîfa → **Saqifa** ; Ridda → **Ridda** ; Koufa → **Kufa** ; Dhât as-Sawârî → **Dhat al-Sawari** | IJMES ; WP « *Saqifa* », « *Ridda Wars* », « *Kufa* » (*Tabari* écrit -ah : « *Saqifah*, *Riddah*, *Kufah* » ; on ne le suit pas) |
| Consonnes doubles gardées | ʿAmmar, al-Qaʿqaʿ | IJMES |
| Lieux qui ont une forme anglaise reçue : la forme anglaise | Médine → **Medina** ; La Mecque → **Mecca** ; Jérusalem → **Jerusalem** ; Damas → **Damascus** ; Homs → **Homs** ; Tibériade → **Tiberias** ; Alexandrie → **Alexandria** ; Chypre → **Cyprus** | IJMES (« *Place names with accepted English spellings should be spelled in accordance with English norms* ») ; WP |
| Mots arabes reçus dans *Merriam-Webster* : sans italique ni signe | **hajj**, **imam**, **jinn**, **shaykh**, **caliph**, **sheikh** non | IJMES (« *mufti, jihad, shaykh* ») |
| Termes techniques gardés : en italique dans la prose du recueil, sans signe sauf ʿ et ’ | *ṣidq* → ***sidq*** ; *al-ʿAnqâ’* → ***al-ʿAnqa’*** | IJMES (italique des termes techniques) ; signes omis pour la lisibilité |

Les versets gardent l'écriture de SI, signes compris (« *Allāh* », « *Muḥammad* », « *Qur’ān* ») : on ne les retouche
jamais, et le texte du jeu, autour, n'imite pas leurs signes.

**Les polices.** Les feuilles de style de Google Fonts déclarent, pour Alegreya (texte) et Cinzel (titres, noms), une
plage `U+02BD-02C5` (donc ʿ) et `U+1E00-1E9F` (les lettres à point souscrit des versets) ; Share Tech Mono (le texte
« écran » de 2084) ne déclare que le latin de base et `U+2000-206F` (donc ’, pas ʿ) : un ʿ y sera dessiné par une
police de secours. Lu dans les plages déclarées, **non vérifié sur une capture** : à contrôler à la première capture
anglaise, dans les trois réglages de dessin. Si Cinzel rend mal ʿ, le repli est ’ (U+2018 ‘ est exclu : on le
confondrait avec un guillemet ouvrant).

### 1.4 « Allah » ou « God »

- *Saheeh International* écrit « *Allāh* » (édition de quran.com, retenue par le registre), « *Allah* » dans d'autres
  éditions ; le jeu français écrit « Allah ». Les traductions savantes écrivent « God » : *Tabari* « *Messenger of God* »
  (2 997 occurrences dans le texte intégral), *Guillaume* « *the apostle* » et « *God* » (3 921 et 5 963 occurrences,
  contre 372 « *Allah* », presque tous dans des noms propres). La traduction de Muhsin Khan d'al-Bukhârî (citée par le
  registre) écrit « *Allah's Messenger (ﷺ)* » (6 019 occurrences). WP-MOS demande « *God* », sauf dans une citation.
- **Choix : « Allah »**, sans macron, comme le jeu français, et comme les versets et les hadiths cités au même écran.
  « God » ne s'emploie que là où le français dit « Dieu » ou « Seigneur » (« *your Lord* », comme SI : « *asking help
  of your Lord* », 8:9).
- Les pronoms qui renvoient à Allah prennent la majuscule : **He, Him, His** (comme SI : « *Allāh is Subtle with His
  servants; He gives provision* », 42:19).
- « le Messager d'Allah ﷺ » → **the Messenger of Allah ﷺ** (SI : « *the Messenger of Allāh* », 33:40) ; « le Prophète
  ﷺ » → **the Prophet ﷺ**. Jamais « *the Apostle* » (Guillaume, Muhsin Khan dans ses anciennes éditions) : le mot a
  vieilli et appartient en anglais au vocabulaire chrétien.

### 1.5 Les formules

- **Après le Prophète : ﷺ**, comme le jeu français, collé au nom par une espace, sans parenthèses : « *the Messenger of
  Allah ﷺ* ». L'édition de Muhsin Khan l'écrit entre parenthèses, « *(ﷺ)* » (13 586 fois) ; le jeu ne reprend pas les
  parenthèses hors des hadiths cités. On n'écrit jamais en toutes lettres « *peace be upon him* » ni « *PBUH* » (WP-MOS
  les retire ; le jeu garde le signe, comme en français).
- **Après un Compagnon : rien**, comme le jeu français. L'édition de Muhsin Khan n'en met pas non plus (aucune
  occurrence de « *may Allah be pleased with him* » ; « *Abu Bakr* » 1 058 fois, sans formule) ; WP-MOS retire « *RA* ».
  Si le décideur en veut une, la forme anglaise usuelle est « *(may Allah be pleased with him)* » (usage courant,
  référence non vérifiée), et elle ne vaudrait qu'au recueil, à la première mention. **À trancher par le décideur.**
- « On rapporte » (exigence 3) → **It is reported** ; « rapporté par » → **reported by** ; « d'après » → **after** dans
  une source (« *after al-Ghazali* »). Ces tournures sont celles des références que le registre affiche.
- « traduction du sens » (exigence 7) → **translation of the meaning** (usage courant des traductions musulmanes du
  Coran, référence non vérifiée) ; la référence s'écrit **Qur’an 51:58** (forme de SI et de quran.com).

### 1.6 Les dates

- Le jeu français écrit « An 11 H · 632 », « 11–13 H · 632–634 », « An 1508 de l’Hégire · 2084 ».
- **Anglais : AH 11 · 632**, **AH 11–13 · 632–634**, **AH 1508 · 2084**. *Tabari* met l'abréviation devant le nombre
  (« *A.H. 132* » 99 fois, contre 20 « *… A.H.* ») ; on l'écrit sans points (**AH**), à l'usage moderne. L'année
  grégorienne reste nue, comme en français ; on n'ajoute **CE** que dans une phrase où une confusion est possible
  (« *in AH 13 (634 CE)* »).
- Dans la narration, « l'an 13 » → **the year 13** quand le contexte suffit.
- Les mois : la forme translittérée (« *22 Jumada al-Akhira, AH 13* »), avec ʿ et ’ selon § 1.3.
- Intervalles : tiret demi-cadratin sans espace (**11–13**).

### 1.7 Ponctuation et typographie

- Guillemets : **“ ”**, et **‘ ’** à l'intérieur (usage américain). Point et virgule à l'intérieur des guillemets.
  « Untel m’a rapporté » → “*So-and-so told me…*”.
- Apostrophe : **’** (U+2019) partout, jamais l'apostrophe droite `'`. Le *ʿayn* est un autre signe (ʿ, § 1.3).
- Tiret : le cadratin **—** sans espaces (usage américain) ; le français « — » espacé ne se recopie pas.
- Points de suspension : un seul signe **…**.
- Le balisage léger du jeu (`*mot*`, `<b>`, `<em>`, `<br>`) reste, autour des mêmes mots.
- Majuscules des titres (cartons, chapitres, pages de la halte) : *title case* à l'américaine (« *The Day Everything
  Could Have Come Undone* » ; les petits mots *of, the, and, in* en minuscule) ; les noms d'objets et de lieux du jeu
  aussi (« *Barley Bread* », « *North Gate* »).
- Nombres : en lettres jusqu'à cent dans la narration et les répliques, en chiffres dans l'interface, les dates et les
  références.

### 1.8 Longueur des répliques

La boîte de dialogue (`#dialog`, `v2/src/style.css`) tient trois lignes sur un téléphone en hauteur (le texte y est
« grand » d'office, exigence de lisibilité de `loupe.js`). Mesuré sur les récits français : une réplique (`say`) a une
longueur médiane de 75 signes (90 % sous 146) ; une narration (`nar`) 142 signes (90 % sous 199, la plus longue 285).

- **Règle : la réplique anglaise n'est pas plus longue que la française.** L'anglais est d'ordinaire plus court : si
  une réplique anglaise dépasse son modèle, on la resserre, on ne la coupe pas (§ 1.1).
- Repères : **150 signes** pour une réplique, **200** pour une narration, **40** pour un nom d'objet ou de pièce
  (`regles.js` refuse au-delà dans un paquet), **30** pour un nom de lieu de carte.
- Un nom de compétence, d'ordre ou de bouton tient sur un bouton de téléphone : **22 signes** au plus, comme les plus
  longs du français (« Frapper ce qui rôde »).
- Toute page anglaise se relit sur une capture, en hauteur et en largeur (`loupe.js`, puis `doigt.js`).

### 1.9 Les exigences de respect, en anglais

Elles valent toutes. Celles-ci prennent en anglais une forme propre :

- **Exigences 6 et 18 — aucun ennemi au nom de démon.** On n'emploie jamais, pour un égrégore, une idole, une
  compétence ou un personnage : *demon, devil, fiend, imp, ghoul* (de l'arabe *ghūl*, une sorte de djinn), *ifrit,
  afreet, marid, shaitan, Satan, Lucifer, Lightbearer, Morning Star, Beelzebub, Mammon, Moloch, Leviathan, Behemoth,
  Belial, Asmodeus, Baal, Legion*. *Mammon* en particulier ne nomme jamais l'Or ni l'Avarice, ni *Leviathan* l'Envie :
  la démonologie chrétienne attache un démon à chacun des péchés capitaux. Les noms d'ennemis ne disent que ce que
  l'idée fait (§ 3.4). Le mot *egregore* a lui-même un passé : § 2.1.
- **Les sept maux ne sont pas les « sept péchés capitaux ».** La liste du jeu vient d'al-Ghazâlî, non de Grégoire le
  Grand ; on évite donc *Wrath*, *Sloth*, *Gluttony*, *Lust*, *deadly sins*, qui feraient lire une autre tradition
  (§ 2.5).
- **Exigence 8 — jamais le nom divin dans un nom de compétence, sur un sprite, sur ce que l'on frappe** : ni *Allah*,
  ni *God*, ni *Lord*, ni *Divine*, ni *Holy* dans un nom de compétence ou d'ennemi. Le surnom de Khâlid, *Sayf Allāh*
  (« *the sword of God* », *Tabari*), ne s'écrit pas en titre : le français dit « le Sabre dégainé », l'anglais **the
  Drawn Sword** (§ 3.1).
- **Exigence 14** : l'auteur de *Citadelle* et du conte (en anglais, *The Wisdom of the Sands*, *The Little Prince*)
  n'est nommé ni dans le jeu, ni dans le livret, ni dans les shorts. **Exigence 24** : Max Scheler et son essai non plus
  (§ 2.11). Ils ne le sont qu'ici.
- **Exigence 2** : aucun texte anglais ne décrit de trait physique (*bearded*, *dark-eyed*, *fair*, *handsome*…), pour
  personne.
- **Exigence 21** : un attribut divin se *reconnaît* (*recognize*), il ne se gagne, ne s'équipe ni ne se possède
  (*earn, equip, own, unlock* sont exclus pour lui ; *unlock* reste permis pour une page ou un récit).

<!-- §2 -->
