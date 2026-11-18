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
| ʿayn, hamza | Pas de signe propre. Devant une voyelle, ils prennent la voyelle (ア, イ, ウ) ; après une voyelle et sans voyelle propre, on redouble la voyelle (Saʿd → サアド ; Qaʿqāʿ → カアカーア) ; en finale après voyelle longue, on écrit la voyelle (Ḥarūrāʾ → ハルーラー). | サアド, イスマーイール |
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

<!-- SECTION 2 -->

<!-- SECTION 3 -->

<!-- SECTION 4 -->
