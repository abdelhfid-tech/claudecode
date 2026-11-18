# Glossaire japonais d'ISNAD 2.x (日本語用語集)

*Établi le 18 novembre 2026 par l'agent, à la demande du décideur. Ce document est en français ; les termes sont en
japonais. Il fixe, pour toute l'écriture japonaise du jeu, les conventions, les termes et les noms. Les choix marqués
**« à valider »** sont des propositions de l'agent ; les points de la dernière section reviennent au décideur.*

**Règle de départ (décision du décideur).** Le japonais reprend les notions **à la source**, dans la littérature
japonaise elle-même — les études islamiques japonaises, la traduction du Coran de 三田了一, les dictionnaires de
référence — et non en traduisant le français. Un terme qui n'a pas d'équivalent établi est proposé, avec sa provenance,
et marqué « à valider ». Ce glossaire ne cite aucun verset ni aucune parole : c'est le registre des sources
(`v2/docs/sources/`) qui le fait. Les exigences de respect d'`AGENTS.md` (1 à 24) valent en japonais comme en français.

**Comment lire les références.** Chaque terme renvoie à l'ouvrage ou à la page où il est employé dans ce sens, avec
l'adresse lue le 18 novembre. « Usage courant, référence non vérifiée » veut dire que l'agent n'a pas pu lire l'emploi
sur une source consultable : le terme reste une proposition. Les abréviations :

- **[岩波]** 『岩波イスラーム辞典』(大塚和夫ほか編, 岩波書店, 2002). L'ouvrage lui-même n'est pas consultable en ligne :
  une forme n'est donnée « selon [岩波] » que si une page lue le rapporte.
- **[平凡社]** 『新イスラム事典』(日本イスラム協会監修, 平凡社, 2002).
- **[三田]** 『日亜対訳・注解 聖クルアーン』, 三田了一訳, 日本ムスリム協会. Lu par le registre des sources sur
  `api.alquran.cloud` (édition `ja.japanese`) et `api.quran.com` (traduction 35).
- **[コトバンク]** kotobank.jp, qui reprend des dictionnaires publiés (日本大百科全書, 世界大百科事典, デジタル大辞泉,
  ブリタニカ国際大百科事典, 山川 世界史小辞典…) : le dictionnaire cité est nommé à chaque fois.
- **[Wiki-ja]** Wikipédia en japonais (ja.wikipedia.org), lue à la date indiquée.
- **[協会]** 日本ムスリム協会 (muslim.or.jp), dont la traduction de *Sahîh Muslim*.

## 1. Conventions d'écriture

### 1.1 Registre

| Où | Registre retenu | Pourquoi |
|---|---|---|
| Narration des récits du VIIe siècle (`nar`, cartons, codex) | **である調**, phrases courtes, passé (〜した／〜であった) ; le présent de narration est permis dans un moment fort, comme en français. | C'est la langue du récit historique et des ouvrages de référence japonais (dictionnaires, 『岩波イスラーム辞典』, histoires de l'islam de 小杉泰 ou 井筒俊彦) : sobre, sans politesse adressée au lecteur. Le です・ます y sonnerait comme un livre pour enfants ou un guide touristique. |
| Ce que le narrateur dit **au râwî** (« Râwî, voici le premier maillon… ») | である調 aussi, avec l'apostrophe 「ラーウィーよ、」 ; on tutoie par la tournure (命令形 doux : 〜せよ／〜するがよい), jamais par 君／お前. | Le narrateur est un aîné qui transmet : la tournure de l'injonction douce suffit, sans pronom. |
| Écrans du jeu (menus, boutons, aides, leçons, annonces) | **です・ます調** pour les phrases ; **forme nue** pour les libellés (「休息」「装備」「話す」). Les leçons s'adressent au joueur sans pronom : 「画面をタップすると、その場所へ歩きます。」 | Convention des jeux japonais : l'interface parle poliment au joueur ; un libellé n'a pas de verbe conjugué. Le mélange des deux registres dans une même phrase est interdit. |
| Répliques des Compagnons | Langue digne et simple : である ou です・ます selon la relation (un Compagnon à la communauté : である／〜だ ; à un aîné, à un hôte : です・ます). Pas de 〜でござる, 〜じゃ, 〜なり, 〜ぞよ (archaïsme de théâtre), pas de 〜だぜ, 〜っす, 〜ちゃん (manga), pas de 拙者／それがし／わし. Le « je » est **私**（わたし） pour tous ; 我々 / 私たち pour « nous ». | Exigence 4 (sobriété) et consigne du décideur. Les pronoms et terminaisons « de personnage » (役割語) du manga ou du jidaigeki colleraient au Compagnon un type japonais qu'il n'a pas. Le respect passe par la tenue de la phrase, non par l'archaïsme. |
| Paroles citées (`quote`) | Celles du registre des sources (`v2/docs/sources/`) : traduction publiée telle quelle, ou traduite de l'arabe. Ce glossaire n'en fixe aucune. | `v2/docs/sources/LISEZ-MOI.md`. |
| 2084, la Cité-Miroir (Idris, Yûnus, Sâlim, les habitants) | Japonais moderne et sobre : です・ます entre inconnus, である／だ entre proches ; ni argot, ni anglicismes gratuits (sauf les objets de 2084 : 通知, スコア, フィード…). | Le futur du jeu est une ville d'aujourd'hui un peu plus serrée : la langue doit sonner juste, sans effet de science-fiction. |
| Le Caïd et sa Citadelle (veillées) | である調 méditatif pour la voix du Caïd ; ses gens parlent simplement. Jamais une phrase reprise d'un auteur (exigence 14) : le ton se cherche, il ne se copie pas — en japonais non plus on ne reprend aucune traduction japonaise de l'auteur de l'exigence 14. | Exigence 14. |

### 1.2 Transcription des noms arabes en katakana

**Système retenu : celui du 『岩波イスラーム辞典』**, que les études islamiques japonaises prennent pour norme. Le
règlement de rédaction de la revue 『イスラーム世界研究』 (京都大学イスラーム地域研究センター) dit :
「転写規則は、原則として『岩波イスラーム辞典』に拠るものとする」, avec pour exemple de nom
「アブー・ハーミド・ガザーリー（Abū Ḥāmid al-Ghazālī, d. 505/1111）」 (lu :
<https://kias.asafas.kyoto-u.ac.jp/kyodo/pdf/kb5_1and2/29kitei.pdf>, 『イスラーム世界研究』投稿規定, § 6‑2 et 6‑5). La
liste de contrôle d'islam.ne.jp, qui suit le même dictionnaire, en donne l'article (lu :
<https://islam.ne.jp/toolbox/arabic-transcription>).

| Point | Règle | Exemples |
|---|---|---|
| Voyelle longue | 長音符 « ー » pour ā, ī, ū : アー, イー, ウー. | アブー・バクル, アリー, ウスマーン |
| Éléments d'un nom | **« ・ »** (中黒) entre les éléments : ism, ibn, kunya, nisba. | ザイド・イブン・サービト |
| ibn / bint | イブン / ビント, même au milieu d'une chaîne (pas « ビン », forme dialectale que garde la traduction ancienne de *Muslim* : 「アリー・ビン・アブー・ターリブ」). | ウサーマ・イブン・ザイド, ズバイルの子なら イブン・アッ＝ズバイル (article gardé, voir ligne suivante) |
| Article al- | **Omis en tête d'un nom de personne** quand le nom est usuel seul (ガザーリー, フバーブ) ; **gardé, rattaché par « ＝ »**, quand il est dans le nom (après ibn, dans une nisba ou un surnom) et assimilé devant les lettres solaires : アル＝ / アッ＝ / アン＝… | ハーリド・イブン・アル＝ワリード ; アブー・バクル・アッ＝スィッディーク ; アブー・アイユーブ・アル＝アンサーリー |
| ʿAbd + Nom divin | Un seul mot, sans « ・ » ni « ＝ », avec assimilation : c'est la forme « 岩波方式 » rapportée par alarabiyah.sakura.ne.jp (lu : <https://alarabiyah.sakura.ne.jp/words/katakana/al/> : 「岩波書店のイスラーム辞典方式だと『アブドゥルカーディル』『アブドゥッサラーム』」). | アブドゥッラー, アブドゥッラフマーン |
| ʿayn, hamza | Pas de signe propre. Devant une voyelle, ils prennent la voyelle (ア, イ, ウ) ; après une voyelle et sans voyelle propre, on redouble la voyelle (Saʿd → サアド ; Qaʿqāʿ → カアカーア) ; en finale après voyelle longue, la hamza ne s'écrit pas (Ḥarūrāʾ → ハルーラー, comme ʿIshāʾ → イシャー dans [Wiki-ja] « サラート » ; la traduction de *Muslim* écrit 「ハルーラーウ」). | サアド, イスマーイール |
| Consonnes « emphatiques » et interdentales | ṣ, s → サ／スィ ; th → サ／スィ ; dh, z → ザ／ズィ ; ḍ → ダ／ディ ; ẓ → ザ／ズィ ; ḥ, h, kh → ハ行 (ḥ/h finales → フ : ジャッラーフ) ; q → カ行 ; gh → ガ行 ; w → ワ／ウィ ; « si » se dit スィ, jamais シ (アッ＝スィッル, et non アッ＝シッル : islam.ne.jp). | スィッフィーン, ズィヤード, ディラール |
| Noms qui ont une forme japonaise consacrée | La forme consacrée l'emporte (règle du même règlement : 「漢字による表記が慣例になっている場合を除き、原則としてカタカナ」, et l'usage) : メッカ ou マッカ, voir § 3. | アッラー, ムハンマド, エルサレム |
| Translittération latine | Le jeu n'en montre pas (le français écrit « Abû Bakr ») : on n'ajoute ni lettres latines ni arabe entre parenthèses dans un texte du joueur. Le recueil (codex) peut donner le nom arabe en écriture arabe s'il le fait en français. | — |

**Ce qui varie dans l'usage, et ce qu'on en fait.** Wikipédia japonaise mêle les systèmes : 「アブー・バクル・アッ＝スィッディーク」
mais 「ウマル・イブン・ハッターブ」 sans article, 「ビラール・ビン＝ラバーフ」, 「マリク・イブン・アシュタル」 (lus le 18 novembre).
La traduction de *Muslim* du 日本ムスリム協会 écrit 「アブドル・ラフマーン」, 「アブドッラー」, 「アリー・ビン・アブー・ターリブ」
(lu : <https://www.muslim.or.jp/hadith/vol2-174.html>, <https://www.muslim.or.jp/hadith/vol2-720-2.html>). Le jeu suit **un
seul** système, celui ci-dessus ; une citation publiée garde sa graphie (c'est le registre des sources qui la recopie).

### 1.3 Allah, le Prophète ﷺ, les Compagnons

| Notion | Forme retenue | Source, remarque |
|---|---|---|
| Allah | **アッラー** (jamais 神 seul pour le nom ; 神 reste le mot commun : 「アッラーの外に神はなく」). | [三田], partout ; registre des sources (`versets.json`, 2:255 : 「アッラー，かれの外に神はなく」). |
| Pronom divin | **かれ**, en hiragana, comme 三田 (「かれは幽玄界も現象界も知っておられる方」, 13:9), et le verbe en 尊敬語 (〜される, 〜なさる). | [三田] via `versets.json`. Le français met une majuscule (« Lui ») : le japonais n'en a pas ; c'est la graphie かれ + le 尊敬語 qui distingue. |
| Le Prophète | **預言者ムハンマド** ; « le Messager d'Allah » = **アッラーの使徒**. | [Wiki-ja] 「ムハンマド・イブン＝アブドゥッラーフ」 (« イスラームの預言者 ») ; 「アッラーの使徒」 dans la traduction de *Muslim* (vol2-720-2). |
| ﷺ après son nom | **Garder le signe ﷺ**, comme le français, partout où le français l'écrit (à trancher, § 4). | Deux usages japonais lus : (1) la traduction de *Muslim* du 日本ムスリム協会 n'ajoute **aucune formule** (« アッラーのみ使い », « 預言者 » seuls : vol2-174, vol2-720-2) ; (2) les publications de prédication écrivent 「預言者ムハンマド（彼にアッラーの祝福と平安あれ）」 (lu : 『諸々の徳 8』, サイード佐藤訳, <https://cdn.byenah.com/contents/6757/ja_08_Virtues_Of_The_Companions.pdf>). La formule entière fait 15 caractères : dans une boîte de dialogue de 36 caractères (§ 1.8), elle en prendrait la moitié. Le signe ﷺ dit la même chose en un caractère, s'affiche déjà dans le jeu, et se lit en japonais comme en arabe. |
| Formule après un Compagnon (raḍiya Llāhu ʿanhu) | **Aucune**, comme le français — **à trancher par le décideur**. | Les publications de prédication écrivent 「（彼にアッラーのご満悦あれ）」 (même document, sur アブー・フライラ) ; la traduction de *Muslim* du 日本ムスリム協会 n'en met pas (「アリー はいった」, vol2-174). Si le décideur en veut une, proposer le signe arabe ﵁ (U+FD41) une fois par écran, plutôt que la formule japonaise. |
| Les Compagnons | **教友**（サハーバ）. Dans le texte du joueur : 教友 seul ; la première fois dans le recueil : 「教友（サハーバ）」. | [Wiki-ja] « サハーバ » : 「日本語では『教友』と訳される」 ; même mot dans la traduction de サイード佐藤 (『預言者ムハンマド……の教友たちの徳』). La majuscule du français (« un Compagnon ») n'a pas d'équivalent : 教友 suffit. |
| Les quatre premiers califes | **正統カリフ**. | [Wiki-ja] « 正統カリフ » (al-Khulafāʾ al-Rāshidūn). |
| Commandeur des croyants | 信徒の長 (titre) ; la traduction de *Muslim* dit 「信者達の指導者」. | 「信者達の指導者」 : vol2-174. 信徒の長 : usage courant, référence non vérifiée ; **à valider**. |

### 1.4 Dates

- Le français écrit « 11–13 H · 632–634 ». Le japonais écrit **「ヒジュラ暦11〜13年（632〜634年）」** dans un texte suivi, et
  **「H11〜13・632〜634年」** sur une étiquette courte (bandeau d'une saga), le chiffre de l'Hégire d'abord, comme le français.
- Règle de la revue 『イスラーム世界研究』 : 「西暦以外の暦が関わる場合は、原則として西暦以外の暦と西暦を併記する」, chiffres
  arabes, « 505/1111 » dans les notices (même règlement, § 6‑5). Le jeu suit le principe du double calendrier, mais avec
  ヒジュラ暦／年 en toutes lettres, plus lisible pour un joueur.
- Mois : noms arabes en katakana, avec le mot 月 (ジュマーダー・アーヒラ月 22日, ズー・ル＝ヒッジャ月). La traduction de *Muslim*
  écrit 「ズール・ヒッジャ月」 (vol2-720-2) : la forme du jeu suit le § 1.2. 「月」 se garde (usage de la même traduction).
- 2084 : 「2084年」 ; « 1508 H » : 「ヒジュラ暦1508年」.

### 1.5 Guillemets et ponctuation

- 「 」 pour une parole, une réplique rapportée, un mot cité ; 『 』 pour un titre d'ouvrage et pour une citation dans une
  citation. Le moteur pose déjà 「」 autour d'une parole citée en carton (`v2/src/style.css`, `html[data-lang="ja"] #card.quote`).
  Les guillemets « » du français ne passent pas en japonais.
- Ponctuation pleine chasse 、。！？ ; jamais « ! » ni « ? » latins dans le texte. Les points de suspension : 「……」 (deux
  caractères), comme dans l'édition japonaise. Les virgules de 三田 sont « ， » : on ne les recopie pas hors d'une citation.
- Le deux-points français (« Râwî : … ») devient une phrase ou 「――」 ; le tiret long 「――」 (deux caractères) marque une
  incise, avec retenue.
- Pas d'espace entre les mots. Une espace pleine chasse n'est permise qu'entre un nom et un titre sur une étiquette.

### 1.6 Ruby (furigana) : le jeu ne peut pas en afficher

Le moteur n'a pas de ruby. On s'en passe ainsi :

1. **Préférer le mot que tout le monde lit.** 欲深さ plutôt que 貪婪 ; 妬み plutôt que 嫉視.
2. **Kanji rare : l'écrire en kana**, ou poser la lecture **entre parenthèses à la première occurrence d'un écran** :
   「斎戒（さいかい）」. Jamais plus d'une fois par écran.
3. **Terme arabe : katakana d'abord, sens ensuite** à la première apparition dans le recueil : 「ズィクル（神を想起すること）」 ; ensuite
   le katakana seul ou le mot japonais seul, selon le tableau du § 2.
4. Noms propres : toujours en katakana (aucune lecture à donner).
5. Ne jamais forcer une lecture rare par des kanji « d'auteur » (当て字) : le joueur ne verrait pas la lecture voulue.

### 1.7 Chiffres

- **Chiffres arabes en demi-chasse** pour les nombres que le jeu calcule (niveaux, Constance, dirhams, années, tours) :
  「12ディルハム」「レベル5」. C'est la règle de la revue citée (「数字は、原則として算用数字を用いる」).
- **Kanji** dans les mots composés et les nombres de récit : 一人, 二人, 三日, 七つの悪徳, 一千の天使 (forme de 三田, 8:9 :
  「一千の天使」). Ne pas écrire « 7つ » dans un texte du récit.
- Le français écrit certains nombres en lettres par `I.enLettres` ; le japonais reçoit le champ nu (`n`) et choisit
  (consigne `CONSIGNE.md`, règle 5) : kanji dans une phrase de récit, chiffres sur un écran de règles.

### 1.8 Longueur des répliques

Mesure faite sur la feuille de style du jeu (`v2/src/style.css`, lignes 31, 55, 267–271, et `U.TZ` dans
`v2/src/core/ui.js`) pour un téléphone de 390 px de large tenu en hauteur, texte « grand » (×1,16, réglage d'office sur
un écran tactile) :

| Boîte | Largeur utile | Caractères pleine chasse par ligne | **Trois lignes** |
|---|---|---|---|
| Réplique (`say`, avec le sceau du personnage) | ≈ 252 px pour un corps de ≈ 19,9 px | ≈ 12 | **≈ 36 caractères** |
| Narration (`nar`, sans sceau) | ≈ 332 px | ≈ 16 | **≈ 48 caractères** |
| Les mêmes au réglage « normal » | — | 15 / 19 | 45 / 57 |

Règle d'écriture : **une réplique japonaise vise 36 caractères au plus, une ligne de narration 48**, ponctuation comprise.
En moyenne une phrase japonaise compte un peu moins de la moitié des caractères de la phrase française qui dit la même
chose ; une réplique française de trois lignes (≈ 75 caractères) tient donc, bien écrite, dans la boîte. Au-delà, la boîte
grandit, mais le texte passe sous l'image sur un téléphone en largeur : ne pas compter dessus. Un nom de personnage
(étiquette) : 8 caractères au plus ; un libellé de bouton : 6.

### 1.9 Ce qui ne se traduit pas

- **ISNAD** reste en lettres latines (titre du jeu, « le titre du jeu reste ce qu'il est » : `style.css`).
- Les **glyphes** (◠ ∴ ✧ ☾ ◎ ∞ ⟁, ▶ ☰ ✦) ne changent pas.
- Les **noms arabes des Lumières, des lames, des étoiles** que le français donne en italique (« al-Qanâ'a ») passent en
  katakana (アル＝カナーア) **seulement** là où le français les montre ; ailleurs, le mot japonais seul.

## 2. Le vocabulaire du jeu

Colonnes : le terme français ; **le terme japonais retenu** ; d'où il vient (ouvrage, auteur, page lue) ; la note. Un terme
sans équivalent établi est une proposition de l'agent : **« à valider »**. Les références à 三田 renvoient au verset où le
mot est employé dans ce sens (texte lu dans l'édition `ja.japanese` d'alquran.cloud, celle que le registre des sources a
recoupée avec la traduction 35 de quran.com ; le verset n'est pas cité ici).

Deux sources savantes reviennent souvent :

- **[東長]** 東長靖「ガザーリー『宗教諸学の再興』解題・翻訳ならびに訳注」(スーフィズム・アンソロジー・シリーズ 7),
  『イスラーム世界研究』8 号, 2015 年, 359–364 頁 (lu :
  <https://repository.kulib.kyoto-u.ac.jp/server/api/core/bitstreams/8133623a-54e6-4c8d-a50f-8439ebdbac7b/content>).
  Il traduit la table de l'*Iḥyāʾ* : chaque chapitre des « maux » et des « remèdes » avec son terme arabe. C'est la source
  japonaise directe pour les maux du cœur (le codex du jeu cite le même plan d'al-Ghazâlî).
- **[牧野]** 『ハディース：イスラーム伝承集成』, ブハーリー著, 牧野信也訳, 中央公論社 1993–94 (rééd. 中公文庫 2001), et
  **[協会訳ムスリム]** 『日訳サヒーフムスリム』, 磯崎定基・飯森嘉助・小笠原良治訳, 日本ムスリム協会 (notices CiNii
  <https://ci.nii.ac.jp/ncid/BN09900629>, <https://ci.nii.ac.jp/ncid/BA64435233>). Pages de la seconde lues :
  `vol2-174`, `vol2-720-2` (§ 1.2).

### 2.1 Les mots propres au jeu (`AGENTS.md`, « Conventions »)

| Français | **Japonais** | Source | Note |
|---|---|---|---|
| Constance (points de vie) | **気力** | 三田 3:139 : 「それで気力を失ったり，また絶望してはならない」 (lā tahinū : ne pas faiblir, au lendemain de l'épreuve). | Le mot qui, chez 三田, dit ce qui tient dans l'épreuve. Ni 体力 (corps), ni HP. **À valider.** |
| Souffle (points de magie) | **息** | Usage courant : 息が続く, 息が長い (« avoir du souffle »). | La phrase du jeu « le souffle plus long » se dit 「息が長くなる」. Jamais 魔力, 霊力, 気 seul (exigences 13, 15 : rien de magique). **À valider.** |
| éprouvé (hors de combat) | **力尽きる** (état : 「力尽き」) | Usage courant. | Ni 死亡, ni 戦闘不能 (jargon), ni 倒れる seul (sonne comme la mort à l'écran). Exigence 19 : nos rangs se replient, rien ne meurt. **À valider.** |
| voiles (la garde d'un égrégore) | **覆い** | 三田 50:22 : 「われは今，あなたから覆を取り除く」 (ghiṭāʾ) ; 2:7 「目には覆いをされ」. | Le mot coranique du voile que l'on ôte. Le voile de lumière des Compagnons (dessin, docs) se dit 光の覆い, jamais ヴェール dans le jeu. |
| dévoilé (égrégore vaincu : on a montré qu'il est vide) | **暴かれる** (「虚像は暴かれた」) | デジタル大辞泉 « 虚像 » et son emploi : on « démasque » une image fabriquée (lu : <https://kotobank.jp/word/虚像>) ; collocation 虚像を暴く, usage courant. | Va avec 虚像 (égrégore, ci-dessous). **À valider** avec lui. |
| Niyya (l'intention, jauge de combat) | **ニーヤ** | [Wiki-ja] « ニーヤ » ; [東長] : 「意図（nīya）」. | Terme établi ; le sens « 意図 » se donne une fois dans le recueil. |
| Sakîna (la sérénité, jauge) | **安らぎ** (le recueil ajoute 「サキーナ」 une fois) | 三田 48:4 : 「信者たちの心に安らぎを与え」 (sakīna). | Le mot même de 三田 pour la sakīna. « La Sakîna descend » : 「安らぎが降りる」. Comme 三田 rend aussi d'autres mots par 安らぎ (13:28), le recueil nomme サキーナ. |
| râwî (le transmetteur, le joueur) | **ラーウィー** (sens : 伝承者) | Transcription selon § 1.2 ; 「伝承者」 : [協会訳ムスリム] vol2-174 (「私（伝承者）」). | Dans l'apostrophe : 「ラーウィーよ」. Pas de forme japonaise consacrée de *râwî* lue : la forme suit le système. |
| isnad | **イスナード** | Transcription selon § 1.2 ; la chose : 「伝承者経路」, [協会訳ムスリム] vol2-174 (「他の伝承者経路でも伝えられている」). | 「イスナード（伝承者経路）」 à la première occurrence du recueil. |
| la Chaîne (l'écran, la suite des maillons) | **鎖** (titre d'écran : 「伝承の鎖」) | Proposition. | **À valider.** |
| maillon (une saga) | **環**（わ） ; « un maillon de la Chaîne » : 「鎖の一環」 | Proposition : 一環 dit à la fois « un anneau d'une chaîne » et « une part d'un tout ». | **À valider.** |
| égrégore (idée reprise par beaucoup de cœurs ; l'ennemi) | **虚像**（きょぞう） | デジタル大辞泉, sens 2 : 「実体とかけ離れた、作られたイメージ」, ex. 「マスコミによって作られた虚像」 ; 精選版 日本国語大辞典 : image d'une personne façonnée 「世評や伝説によって」 (lu : <https://kotobank.jp/word/虚像>). | Le japonais a le mot d'une image fabriquée ensemble et vide de réalité ; il va avec 偶像 (idole), et 「虚像を暴く」 dit « dévoiler ». Pour le **recueil**, la pensée japonaise de ce que les gens fabriquent ensemble : 「空気」 (山本七平『「空気」の研究』, 文藝春秋 1977 ; notice <https://ci.nii.ac.jp/ncid/BN02778185>) et 「世間」 (阿部謹也『「世間」とは何か』, 講談社現代新書 1995 ; <https://ci.nii.ac.jp/ncid/BN12885013>). Deux réserves lues : l'éditeur résume la thèse de 山本 par 「『空気』とはまことに大きな絶対権を持った妖怪である」 (<https://books.bunshun.jp/ud/book/num/9784167911997>) — on prend l'idée, **jamais l'image du 妖怪** (exigences 6, 18) ; et 世間 est d'abord un mot bouddhique ([Wiki-ja] « 世間 » : 「インド発祥の宗教における用語」). Alternative : la translittération エグレゴール, aussi rare et ésotérique en japonais que « égrégore » en français. **À valider.** |
| idole (l'égrégore enraciné d'un chapitre) | **偶像** | 三田 14:35 「偶像崇拝」, 5:90 「偶像」 (34 versets) ; [Wiki-ja] « 偶像崇拝 ». | Jamais アイドル (le sens moderne de 偶像 est connu, mais le contexte le lève). |
| noosphère | **精神圏** | [Wiki-ja] « ノウアスフィア » : 「精神圏（せいしんけん）またはノウアスフィア」 (ヴェルナツキー, テイヤール・ド・シャルダン) ; 村田奈生「テイヤール・ド・シャルダン研究史素描」『東京大学宗教学年報』36 : 「物質圏，生命圏，精神圏」 (lu : <https://repository.dl.itc.u-tokyo.ac.jp/record/53424/files/rel036012.pdf>). | La traduction de référence (美田稔訳『現象としての人間』, みすず書房 1964 ; <https://ci.nii.ac.jp/ncid/BN03402753>) n'a pas été lue : son terme exact n'est pas vérifié. Le jeu ne nomme ni テイヤール ni ヴェルナツキー. |
| idées noires (cinq) | **暗い想い** | Proposition (usage courant de 想い, « pensée qui pèse »). | Ni 心の闇 (manga), ni 邪念 (bouddhique : 念), ni 負の感情 (psychologie de magazine). **À valider.** Le relevé `notions.md` donne pour cinquième « le défilement » : c'est une erreur du relevé ; `coeur.js` dit **le désespoir** (`noir_desespoir`). |
| maux du cœur (sept) | **心の悪徳** | Proposition. Sources de l'image : 三田 2:10 「かれらの心には病が宿っている」 (maraḍ) ; [東長] : la partie des muhlikāt 「危険［に導く悪行］」. | 「心の病」 est le mot de 三田, mais en japonais moderne il désigne d'abord la maladie mentale : le jeu laisserait entendre que la dépression est une faute. À écarter. **À valider.** |
| lames (forgées par les œuvres) | **刃**（やいば） ; « la lame du Contentement » : 「満足の刃」 | Usage courant. | Jamais 刀 (le sabre japonais), jamais 剣 pour une lame-image (剣 est l'arme d'équipement, § 2.6). Exigence 16 : une image, ni relique ni inscription. |
| provision du cœur (zâd) | **心の糧** | 三田 rend zād par 「準備」 (2:197 : 「最も優れた準備は篤信の念である」) ; 糧 est son mot pour la subsistance (51:58 「糧を授けられる御方」). | 「準備」 ne se dit pas d'une réserve que l'on emporte : 糧 garde l'image du voyageur, et l'écho avec ar-Razzâq. Le recueil cite le verset dans la traduction de 三田 (registre). **À valider.** |
| compagnons de lumière (animaux de fiction) | **光の道連れ** | Proposition. | Jamais 使い魔 (sorcellerie), 守護霊 (spiritisme), 式神 (陰陽道), 眷属 (bouddhique), 神獣 (shintô/chinois). Et pas 光の仲間 : 仲間 sert déjà aux membres du groupe. **À valider.** |
| halte (le menu) | **休息** | Usage courant. | Ni 修行 ni 瞑想. **À valider.** |
| veillée (les veillées du Caïd) | **夜語り** | Proposition (mot simple : « récit du soir »). | Jamais 夜伽 (veillée funèbre ou sens galant), 通夜 (veillée mortuaire), 夜話 (titre de recueils bouddhiques ou d'essais). **À valider.** |
| Cité-Miroir (la ville de 2084) | **鏡の街** | Proposition. | 鏡 est aussi un objet sacré du shintô (御神体) ; 街 et le contexte urbain l'en éloignent. Pas ミラーシティ (calque anglais). **À valider.** |
| pourparler | **交渉** | Usage courant. | Neutre ; 談判 serait plus dur (sommation). |
| bataille déclarée | **会戦** | Terme d'histoire militaire : bataille rangée entre forces principales (usage courant, référence non vérifiée). | Le « déclaré » (chacun sait ce qui se dresse) se dit dans le recueil. Écarté : 名乗りの戦 (coutume des samouraïs). **À valider.** |
| le secours | **助け** (bandeau : 「助けが来た」) | Proposition. Le verset de Badr est cité dans la traduction de 三田 (8:9 : 「あなたがたが主に援助を歎願した時」), par le registre. | Ni 援軍 (des troupes : on ne montre ni ne compte les anges, exigence 20), ni 救済／救い (salut, au sens chrétien ou bouddhique). **À valider.** |
| l'organigramme du mal | **悪の見取り図** | Proposition. | 「悪の組織図」 sonnerait comme « l'organisation du mal » des feuilletons (悪の組織) : à écarter. 見取り図 dit « une lecture, pas une démonologie » (exigence 18). **À valider.** |
| les souffleurs | **囁く者たち** | 三田 114:4 : 「こっそりと忍び込み，囁く者の悪から」 (al-waswās). | Le mot même du Coran japonais. Ni nom, ni figure, ni nombre. |
| Lumière (celle que chaque saga transmet) | **光** | Usage courant. | 「アブー・バクルの光」. |
| les œuvres | **善行** | 三田 (117 versets, 「善行」) ; [東長] range ces actes dans 「信仰行為」. | Jamais 勤め／お勤め, 修行, 功徳 (bouddhiques). Le recueil peut préciser 「信仰行為」. |
| les Valeurs (badges du bien) | **美徳** | Usage courant. | Ne jamais écrire 「七つの美徳」 en titre : c'est le nom japonais d'une liste chrétienne. Dire 「七つの徳」. **À valider.** |
| les attributs divins | **御名**（みな） ; le côté du bien : 「美徳と御名」 | 三田 7:180 : 「最も美しい凡ての御名はアッラーに属する」 (al-asmāʾ al-ḥusnā). | Le français dit « attributs » ; le japonais musulman dit « les plus beaux Noms ». Un Nom n'est jamais dessiné ni « équipé » (exigence 21) : on écrit 「御名を知る」 (le reconnaître), jamais 「得る」. **À valider.** |
| Vertus (les compétences, qui coûtent du Souffle) | **徳** (libellé du combat) | Usage courant. | Jamais 魔法, 呪文, 術, 法力 (exigences 13, 15). **À valider.** |

### 2.2 Les Lumières (éléments) et les piliers

| Français (`D.ELEMENTS`) | **Japonais** | Arabe en katakana (là où le français le montre) | Source | Note |
|---|---|---|---|---|
| Fer (Hadîd) | **鉄** | ハディード | 三田 57:25 「またわれは鉄を下した」. | L'élan physique, non une Lumière. |
| Véracité (Sidq) | **誠実** | スィドク | [東長] : 「誠実（ṣidq）」 ; 三田 9:119 「（言行の）誠実な者」 (ṣādiqīn). | Lumière d'アブー・バクル. Distincte de la Sincérité (lame, § 2.3). |
| Justice ('Adl) | **公正** | アドル | 三田 16:90 「本当にアッラーは公正と善行……を命じ」. | Lumière de ウマル. |
| Patience (Sabr) | **忍耐** | サブル | 三田 2:45, 2:153 「忍耐と礼拝によって」 ; [東長] 「忍耐（ṣabr）」. | Lumière d'Idris et du Caïd. 忍 a un emploi bouddhique (忍辱) ; 忍耐 est l'usage de 三田. |
| Miséricorde (Rahma) | **慈悲** | ラフマ | 三田 21:107 「万有への慈悲として」 ; 1:1 「慈悲あまねく慈愛深きアッラー」. | Lumière d'ウスマーン. 慈悲 vient du bouddhisme, mais 三田 l'a fait mot de l'islam japonais : on le garde. |
| Courage (Shajâ'a) | **勇気** | シャジャーア | Usage courant (三田 n'emploie pas le mot). | Lumière de ハーリド. Jamais 勇者 (le héros des jeux de rôle japonais). |
| Savoir ('Ilm) | **知** (en composé : 知識) | イルム | [東長] 「知の章（kitāb al-ʻilm）」 ; 三田 20:114 「主よ，わたしの知識を深めて下さい」. | Lumière d'アリー : 「知の門」. |

Piliers de la Citadelle (`['pillar', …]`) : **柱** (pas 五行 : les « cinq piliers de l'islam » sont autre chose, et 五行
est aussi un mot de la cosmologie chinoise).

| Prière | Savoir | Justice | Lien |
|---|---|---|---|
| **礼拝** | **知** | **公正** | **絆** (usage courant : ce qui tient les gens ensemble, pactes, parole donnée) |

### 2.3 Le cœur : œuvres, lames, maux, idées noires

**Les œuvres** (`coeur.js`, `oeuvres`)

| Français | **Japonais** (nom / court) | Source | Note |
|---|---|---|---|
| La prière | **礼拝** / 礼拝 ; le recueil ajoute 「サラート」 | 三田 2:3 「礼拝の務めを守り」 ; [Wiki-ja] « サラート » : 「サラート（礼拝、サラー……）」. | Se lit **れいはい**. Le dictionnaire signale que 「らいはい」 est la lecture bouddhique (デジタル大辞泉, « 礼拝 », lu : <https://kotobank.jp/word/礼拝-146783>). Jamais 祈り pour la ṣalāt : 祈り (et 祈願) est la demande, la duʿāʾ. |
| Le dhikr | **ズィクル** / ズィクル | 三田 33:41 「アッラーをつねに唱念〔ズィクル〕しなさい」 ; [東長] 「ズィクルと祈り（daʻawāt）の章」. | 唱念 est le mot de 三田 ; on ne l'emploie qu'en citation : 念 rappelle le 念仏 bouddhique. Sens donné au recueil : 「アッラーを想起し、その御名を唱えること」. |
| L'étude du Coran | **クルアーンの学び** / 学び | 「クルアーン」 : 三田 (123 versets) ; [東長] 「クルアーン読誦の作法の章」. | Toujours クルアーン, jamais コーラン (forme ancienne des manuels). Jamais 写経 (copie bouddhique des sûtras). |
| Le jeûne | **断食** / 断食 | [協会訳ムスリム] vol2-174 「あなた方の断食」. | 三田 (2:183) et [東長] disent 「斎戒」, que [Wiki-ja] reprend (« イスラム教における斎戒 ») ; 斎戒 est aussi le mot du shintô et du bouddhisme (斎戒沐浴). Le jeu dit 断食 ; le recueil peut nommer 斎戒（サウム）. |
| L'aumône | **施し** / 施し | 三田 9:60 「施し〔サダカ〕は，貧者，困窮者……」. | L'aumône du jeu est volontaire : サダカ. 喜捨 est la zakāt (「定めの喜捨」, 三田 98:5 ; [Wiki-ja] « ザカート ») et vient du vocabulaire bouddhique, comme 布施 : ne pas employer pour l'aumône du jeu. |
| La visite | **訪問** / 訪問 ; « rendre visite à un malade » : 「病人を見舞う」 | Usage courant. | — |
| Le pèlerinage | **巡礼** / 巡礼 ; le recueil ajoute 「ハッジ」 | 三田 2:158 「聖殿に巡礼する者」 ; [東長] 「巡礼の極意の章」 ; [Wiki-ja] « ハッジ ». | Jamais 遍路 ni 参詣 (bouddhiques, shintô). |

**Les sept lames** (`lames`) — chacune porte le nom de sa vertu ; le nom arabe en katakana suit § 1.2.

| Français | **Japonais** | Katakana | Source | Note |
|---|---|---|---|---|
| Le Contentement (al-Qanâ'a) | **満足** | アル＝カナーア | [東長] : 「満足（riḍāʾ）」 (chapitre des remèdes) ; 三田 (16 versets). | Plus proche serait 知足 ou 「足るを知る」, mais c'est une formule du 老子 et du zen (吾唯足知) : écartée. **À valider.** |
| L'Humilité (at-Tawâdu') | **謙虚** | アッ＝タワードゥウ | 三田 25:63 「謙虚に地上を歩く」 (25 versets). | — |
| La Sincérité (al-Ikhlâs) | **真心** | アル＝イフラース | Sources de l'idée : 三田 98:5 「信心の誠を尽し，純正に」 ; [東長] 「誠真（ikhlāṣ）」. | 誠真 n'est pas un mot courant ; 誠 seul est le mot-emblème du bushidô et du shintô ; 純正 sonne « pièce d'origine ». 真心 dit « faire le bien sans chercher qui regarde ». **À valider.** |
| La Largesse (al-Karam) | **惜しみなさ** | アル＝カラム | Proposition : l'envers exact de 物惜しみ (l'avarice, 三田 57:24). | **À valider.** |
| L'Ardeur (al-Himma) | **志** | アル＝ヒンマ | Usage courant. | **À valider.** |
| La Bienveillance (an-Nasîha) | **思いやり** | アン＝ナスィーハ | Usage courant ; l'arabe : 三田 7:21 rend nāṣiḥ par 「心からの忠告者」. | 「忠告」 (conseil) dirait la naṣīḥa savante, pas la bienveillance que le jeu oppose à l'envie. **À valider.** |
| La Longanimité (al-Hilm) | **寛容** | アル＝ヒルム | Usage courant ; 三田 emploie 寛容 pour un autre Nom (ghafūr : 「寛容にして慈悲深い方」, 2:173). | Rester calme quand on pourrait frapper. **À valider.** |

**Les sept maux du cœur** (`enemies`, `vice`) — ce sont des égrégores, donc des noms d'ennemis : ni démon, ni nom
bouddhique ; et l'on évite de reproduire la série japonaise des « sept péchés capitaux » (傲慢・強欲・嫉妬・憤怒・色欲・暴食・
怠惰), très connue par le manga, qui ferait de la liste du jeu une liste chrétienne.

| Français (arabe du codex) | **Japonais** | Source | Note |
|---|---|---|---|
| L'Avidité (al-hirs) | **貪欲** | 三田 59:9 「自分の貪欲をよく押えた者たち」 (shuḥḥ). | 貪 est aussi l'un des « trois poisons » bouddhiques (貪瞋痴) ; on garde le mot de 三田, mais jamais 貪瞋痴 ni 煩悩 dans le jeu. |
| L'Orgueil (al-kibr) | **高慢** | [東長] 「高慢（kibr）」 ; 三田 31:18, 57:23 (63 versets). | Pas 傲慢 (série des péchés capitaux). |
| L'Ostentation (ar-riyâ') | **見せびらかし** | 三田 2:264 「人びとに見せびらかすため」 ; 107:6 「（人に）見られるための礼拝」. | [東長] dit 「偽善」, mais 偽善 se confondrait avec les hypocrites du récit (偽信者, 三田 4:142 ; exigence 11). |
| L'Avarice (al-bukhl) | **物惜しみ** | 三田 57:24 「物惜しみであるから，人びとにも物惜しみを勧め」 ; 4:37 「吝嗇」. | 吝嗇 est le mot savant, rarement lu sans ruby (§ 1.6). [東長] dit 「強欲」 pour bukhl : à ne pas suivre ici (le jeu sépare avidité et avarice). |
| L'Insouciance (al-ghafla) | **怠り** | Images de 三田 : 7:205 「おろそかな者の仲間となってはならない」 ; 21:1 「無関心に背き去る」. | 「おろそか」 ne se dit pas comme nom ; 怠り garde la négligence sans le 怠惰 des péchés capitaux. **À valider.** |
| L'Envie (al-hasad) | **妬み** | 三田 4:54 「妬むのか」 ; 113:5 「嫉妬する者の嫉妬」 ; [東長] 「嫉妬（ḥasad）」. | 嫉妬 se dit d'abord, en japonais courant, de la jalousie amoureuse (exigence 4) : le nom de l'égrégore est 妬み. |
| La Colère (al-ghadab) | **怒り** | [東長] 「怒り（ghaḍab）」 ; 三田 3:134 「怒りを押えて」. | Pas 憤怒 (péchés capitaux ; et 憤怒相 des divinités bouddhiques). |

**Les idées noires** (`noir_*`) — des pensées qui pèsent sur une personne de fiction (exigence 16), auxquelles on
répond.

| Français | **Japonais** | Source | Note |
|---|---|---|---|
| La Honte | **恥** | Usage courant ; « Que diront-ils ? » se dit 「世間に何と言われるか」. | La « honte devant les siens » est un thème japonais ancien (le regard du 世間) : la réplique y trouve ses mots. |
| La Peur | **不安** | Usage courant. Le Coran japonais dit 「恐れ」 pour khawf (三田 2:155). | L'idée noire du jeu est « ce qui n'est pas arrivé, vécu comme si c'était fait » : c'est 不安 (l'angoisse), plus que 恐れ ou 恐怖. **À valider.** |
| Le Soupçon | **疑い** | 三田 (39 versets) ; 49:12 dit 「邪推」 (ẓann). | 邪推 (soupçon injuste) est l'autre choix, plus précis mais plus dur. L'état de combat « Doute » prend un autre mot (迷い, § 2.7) pour ne pas se confondre. **À valider.** |
| La Rancune | **恨み** | 三田 5:2 「恨みにもって」. | Jamais 怨念, 怨霊 (fantômes vengeurs). |
| Le Désespoir | **絶望** | 三田 39:53 「アッラーの慈悲に対して絶望してはならない」 ; 12:87. | — |

### 2.4 Les compagnons de lumière et les étoiles

| Français (arabe) | **Japonais** | Katakana | Source | Note |
|---|---|---|---|---|
| Le Renard des sables (ath-Tha'lab) | **フェネック** | アッ＝サアラブ | Nom courant du renard des sables (usage courant, référence non vérifiée). | 狐（きつね） porte au Japon le messager d'Inari (shintô) et le renard qui se change en homme (妖怪) : à écarter. **À valider.** |
| L'Aigle (an-Nasr) | **鷲** | アン＝ナスル | Usage courant. | — |
| Le Phénix (al-'Anqâ') | **不死鳥** | アル＝アンカー | Usage courant. | Jamais 鳳凰 (oiseau chinois, emblème de temples bouddhiques), jamais 火の鳥 (titre d'un manga). |
| Le Lion (al-Asad) | **獅子** | アル＝アサド | 三田 74:50–51 (le lion dont on fuit) ; [Wiki-ja] « アリー・イブン・アビー・ターリブ » : 「アッラーの獅子」. | 獅子 évoque aussi les lions-gardiens des sanctuaires (狛犬) ; le mot reste celui des traductions de l'arabe. |
| La Gazelle (az-Zaby) | **ガゼル** | アッ＝ザビー | Usage courant. | — |

Dons : Flair **嗅覚** ; Regard **眼力** ; Renaissance **再起** (jamais 転生 ni 輪廻 : réincarnation) ; Présence
**威風** ; Apaisement **和らぎ** (安らぎ est déjà la Sakîna). **À valider** ensemble.

**Les étoiles** (`D.STARS`) — le français donne le nom arabe et son sens ; le japonais donne le nom arabe en katakana et
le **nom astronomique international**, jamais le nom d'une fête ou d'un culte de l'Asie de l'Est.

| Arabe (français) | **Katakana** | **Nom japonais de l'étoile** | À éviter |
|---|---|---|---|
| an-Nasr at-Tâ'ir (Altaïr, l'Aigle qui vole) | アン＝ナスル・アッ＝ターイル | **アルタイル**（「飛ぶ鷲」） | 彦星, 牽牛 (la fête de Tanabata) |
| al-'Aqrab (le Scorpion, son cœur rouge) | アル＝アクラブ | **さそり座**, son cœur **アンタレス** | — |
| Suhayl (Canopus, l'étoile du sud) | スハイル | **カノープス** | 南極老人星, 寿星 (une divinité taoïste du bonheur) |
| al-'Ayyûq (Capella, la gardienne des Pléiades) | アル＝アイユーク | **カペラ** ; les Pléiades : **すばる** | — |
| al-Jady (la Polaire, le Chevreau) | アル＝ジャディ | **北極星**（「子山羊」） | 北辰, 妙見 (culte bouddhique et shintô de l'étoile polaire) |
| les « bonds de la gazelle » (trois couples d'étoiles au nord) | — | **ガゼルの跳躍** (calque : pas de nom japonais) | — |

### 2.5 Postures, portes, voies de la parole

**Les postures** (`D.POSTURES`, exigence 24). Le mot « posture » : **構え**（かまえ） — la manière de se tenir, au sens
du corps et de l'esprit ; 「構えをとる」 (prendre une posture). 姿勢 est l'autre choix, plus abstrait. **À valider.**

| Français | **Japonais** | Source | Note |
|---|---|---|---|
| Le héros | **英雄** | Réception japonaise de la typologie dont vient l'exigence 24 : 「聖人」「天才」「英雄」 (阿内正弘「シェーラーの典型論」, 筑波大学リポジトリ, lu : <https://tsukuba.repo.nii.ac.jp/record/5728/files/7.pdf>) ; l'ouvrage traduit : 『典型と指導者』, シェーラー著作集 15, 白水社 1978 (<https://ci.nii.ac.jp/ncid/BN00429006>). | Jamais 勇者 : c'est le héros des jeux de rôle japonais (la série *Dragon Quest*), et il dirait « l'élu ». **À valider.** |
| Le sage | **賢者** | Usage courant (le jeu remplace « le génie » de la typologie par « le sage » : la source japonaise n'aide pas ici). | 賢者 est aussi une classe de personnage connue des jeux de rôle japonais : le contexte (« une manière de se tenir », non un métier) doit le lever. **À valider.** |
| Le saint | **聖人**（せいじん） | Même article : 聖人 traduit le Heilige de la typologie. | Dans les études islamiques japonaises, **聖者** désigne le walī et le culte des saints (赤堀雅幸・東長靖・堀川徹編『イスラームの神秘主義と聖者信仰』, 東京大学出版会 2005 ; <https://ci.nii.ac.jp/ncid/BA70441332>) : 聖者 ferait de la posture un rang spirituel, sujet de controverse entre musulmans (exigence 5). 聖人 évite ce sens, mais porte celui des saints catholiques et du sage confucéen (聖人君子) ; et 「しょうにん」 est une lecture bouddhique : écrire la lecture une fois (§ 1.6). **À valider.** |

Le jeu ne dit de personne qu'il **est** 英雄, 賢者 ou 聖人 : on écrit 「英雄の構えをとる」, jamais 「英雄である」 (exigence 24). Ni
l'auteur de la typologie ni son ouvrage ne sont nommés dans le jeu (même règle qu'en français).

**Les portes de la noosphère** (`portes`)

| Français | **Japonais** | Note |
|---|---|---|
| Au sortir de la prière | **礼拝を終えて** | — |
| Dans le dhikr | **ズィクルのうちに** | — |
| En songe | **夢のうちに** ; « un sommeil sans songe » : 「夢を見ない眠り」 | Jamais 夢告, 霊夢 (le songe oraculaire bouddhique ou shintô). |
| « ses démons intérieurs » (façon de parler, aussitôt expliquée) | **「心の中の悪魔」** entre guillemets, dans la seule phrase où le jeu explique l'expression | Exigence 22 : le jeu dit que ce ne sont pas des démons. Le mot 悪魔 n'apparaît nulle part ailleurs hors citation. |

**Les voies de la parole** (`D.VOIES`, la réponse aux idées noires)

| Français | **Japonais** (bouton / nom de la voie) | Source | Note |
|---|---|---|---|
| Dire vrai (la parole) | **ありのままに言う** / **言葉** | Usage courant. | — |
| Expliquer (la pédagogie) | **説き明かす** / **教え導き** | L'idée : 三田 16:125 「英知と良い話し方で……招け」. | Jamais 説法, 説教 (le sermon bouddhique ou chrétien). **À valider.** |
| Rassurer (la bienveillance) | **寄り添う** / **思いやり** | Usage courant. | 寄り添う dit « rester près de lui », ce que les réponses du jeu font. **À valider.** |

### 2.6 La bataille déclarée : rangs, ordres, manœuvres

Exigence 19 : des noms de fonction, aucun nombre, aucun nom de personne ; nos rangs se replient, ils ne tombent pas.
Termes de l'histoire militaire courante (usage courant, référence non vérifiée).

| Rangs | Fantassins **歩兵** | Cavaliers **騎兵** | Archers **弓兵** | Gens du lieu **土地の者たち** | | |
|---|---|---|---|---|---|---|
| **Ordres** | Tenir **持ちこたえる** | Avancer **進む** | Charger **突撃** | Tirer **射る** | Glisser **横へ移る** | Se replier **退く** |
| **Manœuvres** | Réserve mobile **遊撃の予備** | Enveloppement **包囲** | Repli feint **偽りの退却** | | | |

Notes : « Se replier » se dit 退く, jamais 敗走 ni 撤退 de déroute ; « éprouvés, ils se replient et se reforment » :
「力尽きた隊は退き、また列を組み直す」. Le repli feint n'est pas 釣り野伏せ (une tactique japonaise nommée, liée à un clan) ;
la réserve mobile n'est pas 旗本 (garde d'un seigneur japonais). Le champ : **戦場** ; un couloir : **筋** ; une colonne :
**列**. Le stratège (`stratege: true`) : **軍師** — **à valider** (le mot évoque les stratèges des romans chinois des Trois
Royaumes ; 策士 serait péjoratif).

### 2.7 Équipement, objets, matériaux, pièces à bâtir

**Emplacements** (`gear.js`) : Main droite **右手** · Main gauche **左手** · Tête **頭** · Corps **胴**.

**Types de pièces** (`D.GEAR_TYPES`) — exigence 17 : objets ordinaires ; aucun mot qui en fasse une relique ou un objet
japonais.

| Français | **Japonais** | Note |
|---|---|---|
| Épée | **剣** | Jamais 刀 (sabre japonais), 太刀, 聖剣. |
| Lance | **槍** | — |
| Arc | **弓** | — |
| Dague | **短剣** | — |
| Masse | **鎚矛**（メイス） → libellé : **メイス** | 鎚矛 se lit mal sans ruby. |
| Bâton | **棒** | Pas 杖 (錫杖 du moine bouddhique, bâton de pèlerin) pour une arme. |
| Calame | **葦ペン** | 三田 rend qalam par 「筆」 (68:1), qui en japonais est le pinceau : le calame du jeu est un roseau taillé. |
| Bouclier / Grand bouclier | **盾** / **大盾** | — |
| Outil | **道具** | — |
| Turban | **ターバン** | — |
| Calotte | **帽子** (libellé) ; description : 「縁のない小さな帽子」 | — |
| Casque | **兜** | Mot général du casque ancien ; ne décrire ni cornes ni ornement (exigence 17 : aucun symbole). |
| Étoffe / Cuir / Armure | **布** / **革** / **鎧** | — |

**Objets de la besace** (`D.ITEMS`) — la besace : **旅袋** (jamais 頭陀袋, le sac du moine mendiant). **À valider.**

| Dattes de Médine | Outre d'eau | Pain d'orge | Miel | Musc | Lait chaud | Siwâk |
|---|---|---|---|---|---|---|
| **マディーナのナツメヤシ** (三田 : ナツメヤシ, 21 versets) | **水袋** | **大麦のパン** | **蜂蜜** | **ジャコウ** (三田 83:26 「その封印はジャコウである」) | **温めた乳** | **スィワーク** (§ 1.2 ; on lit aussi ミスワーク, autre mot arabe pour le même bâtonnet) |

**Matériaux et pièces** (`build.js`)

| Matériaux | Eau **水** · Pisé **練り土** · Palme **ヤシの葉** · Pierre **石** · Grain **穀物** · Laine **羊毛** |
|---|---|
| **Pièces** | Tranchée **堀** · Puits **井戸** · Palmier **ナツメヤシの木** · Champ d'orge **大麦畑** · Enclos de chèvres / de moutons / de chameaux **山羊の囲い／羊の囲い／ラクダの囲い** · Mur de pisé **土塀** · Sol à étoiles **星模様の床** · Pilier de palmier **ヤシの幹の柱** · Niche de qibla **ミフラーブ** (description : 「キブラを示す壁のくぼみ」 ; 「キブラ」 : 三田 2:142–145) · Natte de prière **礼拝用のむしろ** · Tapis **絨毯** · Lanterne **ランタン** · Rosace **花形の飾り** |

Notes : la natte n'est pas 座布団 ni ござ (objets domestiques japonais) ; la lanterne n'est jamais 灯籠 ni 提灯 (lanternes de
temple, de sanctuaire, de fête). 「ミフラーブ」 : transcription selon § 1.2, usage courant, référence non vérifiée.

### 2.8 Outils appris, halte, recueil, prières, combat

**Outils** (`D.OUTILS`, une leçon à la fois)

| Français | **Japonais** | Français | **Japonais** |
|---|---|---|---|
| Se déplacer | **歩く** | La halte | **休息** |
| Parler | **話す** | Retrouver une source | **出典をたどる** |
| Demander son chemin | **道をたずねる** | S'équiper | **装備する** |
| Frapper la faille | **綻びを突く** (la faille d'un égrégore : **綻び**) | S'orienter aux étoiles | **星で方角を知る** |
| Les vertus | **徳** | Frapper ce qui rôde | **さまようものを打つ** |
| La garde et la Niyya | **守りとニーヤ** | Prendre une posture | **構えをとる** |
| La besace | **旅袋** | | |

« Faille » a deux sens dans le jeu : le point faible d'un égrégore (**綻び**, **à valider**) et le lieu de la noosphère
nommé « Faille » (**裂け目**, § 3.4).

**La halte** (`ui.js`) : Reprendre **再開** · Que faire ? **いますべきこと** · Carte **地図** · Le groupe **一行** ·
Compagnons (les membres du groupe) **仲間** · Équipement **装備** · Postures **構え** · Besace **旅袋** · Piliers **柱** ·
Le cœur **心** · Œuvres et lames **善行と刃** · Compagnons de lumière **光の道連れ** · Le savoir **知** · Recueil **聞き書き**
· Organigramme du mal **悪の見取り図** · Valeurs et attributs **美徳と御名** · Aide du jeu **遊び方** · Réglages **設定** ·
Ton personnage **あなたの人物** · Exporter la partie **記録を書き出す**.

Deux pièges : **« compagnons » en minuscule** (les membres du groupe, le menu) se dit **仲間**, **« Compagnons »** (les
Sahâba) **教友** — ne jamais les confondre ; **Recueil** se dit **聞き書き** (« ce que l'on a noté de ce qu'on a entendu »,
l'image même de la transmission), **à valider** ; 図鑑 (catalogue de jeu) est écarté.

**Catégories du recueil** (`D.CODEX_CATS`) : Biographie **人物** · Événement **出来事** · Noosphère **精神圏** · Lieu **場所**
· Parole **言葉** · Cœur **心** · Objets **品々**.

**Les cinq prières** (`['pray', moment]`) — noms et sens de [Wiki-ja] « サラート » (lu le 18 novembre) :

| Fajr · l'aube | Dhuhr · le midi | 'Asr · l'après-midi | Maghrib · le couchant | 'Ishâ · la nuit |
|---|---|---|---|---|
| **ファジュル**・夜明け | **ズフル**・正午 | **アスル**・午後 | **マグリブ**・日没 | **イシャー**・夜 |

Le carton de prière reste sobre (exigence 13) : 「彼らは礼拝した。」, comme le français « Ils prièrent. ».

**Combat** (`battle.js`) : Frapper **打つ** · Éclairer **照らす** · Garde **守り** · Vertus **徳** · Objets **持ち物** ·
Assaut (attaque d'un égrégore) **襲いかかる** · Force **力** · Esprit **精神** · Garde (stat) **守り** · Élan **勢い** ·
Étourdi **ひるみ** · Doute **迷い** · Waswâs **囁き** (三田 114:4) · Régén. **回復** · En garde **守りの構え** · Cible **標的**
· Sagesse (l'expérience) **知恵** · Niveau **レベル**. Jamais 魔法, 呪文, MP, 魔力, 霊力.

### 2.9 L'organigramme du mal et le côté du bien

**Les étages** (`coeur.js`, `mal.rangs`) — au-dessus du trait, « ce qui est enseigné » ; au-dessous, « des images ».

| Français | **Japonais** | Source | Note |
|---|---|---|---|
| Iblîs, l'ennemi déclaré | **イブリース**、「公然の敵」 | 三田 18:50 「イブリース」 ; 2:168 「公然の敵」 ; [Wiki-ja] « イブリース ». | Nommé, jamais montré (exigence 18). Jamais サタン, 魔王, 悪魔の王. |
| Les souffleurs : « des démons d'entre les djinns, et parfois des hommes » | **囁く者たち** : 「ジンの中の悪魔、そして時には人間」 | 三田 114:4–6 ; 6:112 「人間とジンの中の悪魔」. | Dans ce seul texte « enseigné », le mot 悪魔 (celui de 三田 pour shayṭān) est permis ; jamais pour un ennemi. |
| djinn | **ジン** | 三田 72:1 「一団のジン」 ; 15:27 「幽精〔ジン〕」. | [Wiki-ja] décrit ジン comme 「精霊や妖怪、魔人などの一群」 : le jeu n'emploie **jamais** 精霊, 妖怪, 魔人, ni 幽精 (mot de 三田, mais rare). |
| Le cœur (il entend, et il consent ou refuse) | **心** | — | — |
| Les idées noires / Les égrégores / Les idoles | **暗い想い** / **虚像** / **偶像** | § 2.1 | — |
| anges (le secours, la citation de Badr seulement) | **天使** | 三田 8:9 「一千の天使」. | Jamais montrés, nommés, comptés (exigence 20). |

**Les sept attributs** (`attributs`) — le Nom en katakana (§ 1.2, article gardé comme en français) ; le **sens**
reprend les mots de 三田 dans le verset que le jeu cite (le verset lui-même est donné par le registre des sources,
`versets.json`, déjà rempli pour ces sept-là).

| Mal | Nom | **Sens, d'après 三田** | Verset (traduction de 三田, dans le registre) |
|---|---|---|---|
| avidité | **アッ＝ラッザーク** | 糧を授けられる御方 | 51:58 「本当にアッラーこそは，糧を授けられる御方……」 |
| orgueil | **アル＝カビール、アル＝ムタアール** | 偉大にして至高の方 | 13:9 |
| ostentation | **アル＝ハビール** | 通暁される方 | 67:14 「……深奥を理解し通暁なされる」 |
| avarice | **アル＝ワッハーブ** | 限りなく与えられる御方 | 3:8 |
| insouciance | **アル＝ハイイ、アル＝カイユーム** | 永生に自存される御方 | 2:255 |
| envie | **アッ＝ラティーフ** | しもべにやさしくあられる方 | 42:19 「アッラーはそのしもべに対して，やさしくあられ」 |
| colère | **アル＝ハリーム** | 寛容な方 (voir note) | 2:263 |

Note sur アル＝ハリーム : dans 2:263, 三田 rend ḥalīm par 「慈悲深く」 (「アッラーは富有にして慈悲深くあられる」), le même mot que
pour raḥīm ; le sens donné sous le Nom ne peut donc pas reprendre 三田 mot à mot sans confondre deux Noms. Proposition :
「寛容な方」, et la lame d'en face se dit 寛容 (§ 2.3). **À valider.** Pour アッ＝ラティーフ, 三田 a deux rendus selon le
verset (42:19 「やさしくあられ」 ; 67:14 「深奥を理解し」) : le jeu suit celui du verset qu'il cite.

Pour tous : on **reconnaît** un Nom (「御名を知る」「心に刻む」), on ne le possède pas, on ne l'« obtient » pas (exigence 21) ;
le Nom est du texte, jamais un sprite ni une compétence (exigence 8).

### 2.10 Mots à ne pas employer, et pourquoi

| Mot | Pourquoi | À la place |
|---|---|---|
| 祈り, 祈る (pour la ṣalāt) | La demande, la duʿāʾ ; et le mot courant des prières bouddhiques et shintô. | 礼拝, 礼拝する |
| 礼拝 lu らいはい | Lecture bouddhique (デジタル大辞泉). | れいはい (le donner une fois si le contexte hésite) |
| 修行, お勤め, 勤行, 功徳, 供養, 成仏, 往生, 煩悩, 業, 因果, 輪廻, 転生, 悟り | Notions bouddhiques. | Les mots du § 2 |
| 祓い, 穢れ, 禊, 御利益, 神社, 神棚, 参拝 | Notions shintô. | — |
| 悪魔, 魔, 鬼, 妖怪, 物の怪, 魔物, 魔人, 魔王, 怨霊, 化け物, 精霊 | Noms de démons, de djinns ou de monstres : interdits pour un ennemi (exigences 6, 18). 悪魔 n'existe que dans les citations de 三田 et la seule ligne de l'organigramme (§ 2.9). | 虚像, 偶像, 悪徳, 暗い想い |
| 魔法, 呪文, 呪い, 魔力, 霊力, 術, 法力, 加護, お守り, 護符 | Rien n'est sortilège ni talisman (exigences 13, 15, 17). | 徳, 息, 善行 |
| 聖戦 | « Guerre sainte » : un sens que le jeu ne donne à aucun combat. | 戦い |
| 異教徒, 邪教, 蛮族 | Désigner un groupe comme ennemi par nature (exigence 10). | Le nom du peuple, de la ville, de la tribu |
| 勇者, 使い魔, 守護霊, 式神, 図鑑 | Vocabulaire de jeu vidéo ou d'occultisme japonais qui déplacerait le sens. | 英雄 (posture), 光の道連れ, 聞き書き |
| 傲慢・強欲・嫉妬・憤怒・怠惰 en série | La liste japonaise des péchés capitaux. | La liste du § 2.3 |
| コーラン, マホメット, モハメッド | Formes anciennes ou fautives. | クルアーン, ムハンマド |
| 回教, 回教徒 | Nom ancien, d'origine chinoise, aujourd'hui sorti de l'usage savant. | イスラーム, ムスリム |

<!-- SECTION 3 -->

<!-- SECTION 4 -->
