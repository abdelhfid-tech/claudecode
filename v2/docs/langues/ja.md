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

<!-- SECTION 2 SUITE 2 -->

<!-- SECTION 3 -->

<!-- SECTION 4 -->
