# Le registre des sources

Le jeu existe en français, en arabe, en anglais et en japonais. Dans chaque langue, une parole citée ou un verset
vient **de sa source**, jamais d'une traduction du français (demande du décideur, 18 novembre). Ce dossier garde, pour
chaque parole (`['quote', texte, source]`) et chaque verset du jeu, ce qui a été lu, où, et ce que chaque langue cite.
C'est le document à remettre à un spécialiste.

## Trois règles

1. **Rien n'entre de mémoire.** Un texte arabe, une traduction publiée : on les lit sur une source consultable, et l'on
   note l'adresse lue. Un texte qu'on « connaît » mais qu'on n'a pas relu n'entre pas.
2. **Introuvable, c'est introuvable.** Si le texte arabe d'une parole n'est pas retrouvé, on l'écrit (`"etat":
   "introuvable"`), on ne reconstitue rien en arabe, et les trois langues la rapporteront en substance. Un texte arabe
   proche mais pas identique à ce que dit le français se note `"approchant"`, avec l'écart.
3. **On ne corrige pas le français.** Si la parole française s'écarte de sa source (mots ajoutés, attribution,
   recueil, numéro), on le décrit dans `ecart` : c'est le décideur qui tranche.

## Ce que cite chaque langue

| Nature | Arabe | Anglais | Japonais |
|---|---|---|---|
| verset | le texte othmanien, sans retouche | *Saheeh International*, telle quelle | la traduction de l'Association musulmane du Japon (三田了一訳), telle quelle |
| hadith d'un recueil | le texte arabe du recueil (la seule phrase citée, sans la chaîne), avec le numéro | la traduction anglaise publiée du recueil, telle quelle, si elle est lue ; sinon traduit de l'arabe | une traduction japonaise publiée si elle est lue et vérifiée ; sinon traduit de l'arabe |
| chronique, biographie, autre | le texte arabe de l'ouvrage, avec volume et page ou chapitre | traduit de l'arabe | traduit de l'arabe |

« Traduit de l'arabe » : une traduction du sens, sobre, fidèle au texte arabe relevé — pas au français du jeu.
`origine` le dit (`"de_l_arabe"`), et le jeu l'affichera dans la source de la parole.

Le jeu ne cite que la phrase que le français cite : si le français abrège (« […] », « … »), les autres langues
abrègent au même endroit.

## Forme d'une entrée

Un fichier JSON par fichier du jeu (`saga_abubakr.json`, …, `versets.json`), une liste d'entrées :

```json
{
  "fichier": "v2/src/data/saga_umar.js", "ligne": 421,
  "fr": "« Porteras-tu mon fardeau à ma place, au Jour de la Résurrection ? »",
  "source_fr": "Récit d'Aslam — at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya",
  "nature": "chronique",
  "ar": { "texte": "…", "reference": "الطبري، تاريخ الرسل والملوك، سنة …، ج … ص …", "lu_sur": "https://…", "etat": "trouvé" },
  "en": { "texte": "…", "origine": "de_l_arabe", "reference": "al-Tabari, Tarikh (translated from the Arabic)", "lu_sur": "" },
  "ja": { "texte": "…", "origine": "de_l_arabe", "reference": "タバリー『諸使徒と諸王の歴史』(アラビア語原文より訳出)", "lu_sur": "" },
  "ecart": "",
  "note": ""
}
```

- `fr`, `source_fr` : recopiés du jeu, au caractère près (ils servent à rattacher l'entrée au texte du jeu).
- `nature` : `verset`, `hadith`, `chronique`, `autre`.
- `ar.etat` : `trouvé`, `approchant`, `introuvable`.
- `en.origine`, `ja.origine` : `publiee` (avec la référence exacte de la traduction et l'adresse lue) ou `de_l_arabe`.
- `reference` : écrite dans la langue de la colonne, telle qu'elle s'affichera sous la parole.
- `ecart` : ce qui sépare le français de la source ; vide s'il n'y a rien.
- Les textes ne contiennent ni `<` ni `>`. Le texte arabe d'une parole est donné sans les guillemets ; un verset, sans
  ﴿ ﴾ (le jeu les pose).

## Sources lues d'ici

- Coran : `https://api.alquran.cloud/v1/ayah/S:V/editions/quran-uthmani,en.sahih,ja.japanese` ; recoupé avec
  `https://api.quran.com/api/v4/verses/by_key/S:V?translations=20,35&fields=text_uthmani` (20 : Saheeh International ;
  35 : Ryoichi Mita).
- Hadiths : `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.min.json` (la liste), puis
  `…/editions/ara-bukhari.min.json`, `eng-bukhari.min.json`, `ara-muslim.min.json`… (un recueil entier, à fouiller sur
  place).
- Chroniques et biographies en arabe : `https://shamela.ws/`, `https://ar.wikisource.org/`, `https://islamweb.net/`.
- `sunnah.com` et `dorar.net` refusent les lectures automatiques : ne pas insister.
- Hadiths en japonais : la traduction de *Sahîh Muslim* publiée par l'Association musulmane du Japon,
  `https://www.muslim.or.jp/hadith/` (volume et pages dans la référence). Elle paraphrase parfois : elle n'est retenue
  que là où elle suit l'arabe (`note` le dit quand elle est écartée).

## Ce qu'il faut savoir des sources lues

- **Arabe du Coran** : celui d'alquran.cloud (`quran-uthmani`). Celui de quran.com est le même texte, à l'encodage près
  (trait d'allongement, marques de tanwîn, hamza). La basmala qu'alquran.cloud colle au verset 1 et le signe « ۞ » ne
  sont pas repris.
- **Saheeh International** : les deux services n'en servent pas la même édition. Celle de quran.com (retenue) écrit
  « Allāh », « Muḥammad », et diffère de quelques mots dans dix versets ; `note` le signale quand l'extrait est touché.
- **Ryoichi Mita** : la même traduction sur les deux services, à deux défauts de saisie près (deux kanji rares remplacés
  chez alquran.cloud ; une espace parasite chez quran.com) ; `note` dit lequel est retenu.
- **Traductions anglaises des hadiths** (Muhsin Khan pour al-Bukhârî, édition `eng-…` du CDN) : recopiées telles
  quelles, même quand elles écrivent « Allah's Apostle » sans ﷺ ou s'écartent de l'arabe ; `note` le signale.
- Les textes arabes sont **extraits par script** des pages lues, jamais retapés ; leurs coquilles d'impression sont
  gardées et signalées dans `note`.
- **At-Tabarî sur Shamela** (livre 9783, éd. Abû l-Fadl Ibrâhîm, Dâr al-Ma'ârif) : la pagination suit l'imprimé, mais
  le texte numérique ne suit pas toujours l'édition imprimée. Il porte des voyelles que l'imprimé n'a pas, et d'autres
  que l'imprimé contredit ; il abrège en « ص » la formule de bénédiction que l'imprimé écrit en toutes lettres (t. 3
  p. 226, 293) ; il perd des hamzas (« ابالكم » pour « أبالكم ») et coupe des mots (« وو الله » pour « ووالله »). Le
  fac-similé de l'imprimé est lisible : `https://archive.org/download/trm08_202112/trm03.pdf` (t. 3 ; `trm04.pdf` pour
  le t. 4…), la page du PDF étant celle de l'édition. Le 20 novembre, les coquilles signalées ont été vérifiées sur lui,
  et corrigées d'après lui (`note` de chaque entrée) ; les autres paroles tirées d'at-Tabarî n'ont pas été recomparées
  à l'imprimé (la formule « ص » y reste, là où les pages vues de l'imprimé l'écrivent en toutes lettres : à revoir).
- **Une parole dite hors d'un carton** (dans un feuillet, une narration, la description d'une compétence) a son entrée
  comme les autres : `fr` est la phrase entre guillemets, recopiée du jeu ; `source_fr` est vide quand le jeu n'en
  donne pas (narration, compétence) ; le texte du jeu cite exactement `ar.texte` entre « », et sa forme vocalisée le
  recopie tel quel (`voyelles.js` le vérifie).

## État au 20 novembre

| Fichier | Paroles | Trouvées | Approchantes | Introuvables | Écarts avec le français |
|---|---|---|---|---|---|
| `saga_abubakr.json` | 25 | 22 | 3 | 0 | 17 |
| `saga_umar.json` | 15 | 11 | 4 | 0 | 8 |
| `saga_khalid.json` | 12 | 11 | 1 | 0 | 8 |
| `saga_uthman.json` | 10 | 9 | 1 | 0 | 7 |
| `saga_ali.json` | 14 | 13 | 1 | 0 | 6 |
| `frame.json` | 3 | 3 | 0 | 0 | 1 |
| `versets.json` | 52 versets cités (33 distincts) | 52 | 0 | 0 | 1 |

Le 20 novembre, onze paroles citées hors des cartons (feuillets, narrations, une compétence) sont entrées au registre :
Ibn al-Mubârak et la parole à Bilâl (`frame`), Abû 'Ubayda « homme de confiance » (`saga_umar`, `saga_khalid`,
`saga_abubakr`), Anas sur Qays (`saga_ali`), Hudhayfa (`saga_uthman`), Ibn 'Abbâs, les appels de Khâlid et d'Abû
Hudhayfa à al-Yamâma, et « Je ne dénouerai pas un étendard qu'il a noué » (`saga_abubakr`).

Quand le français omet des mots au milieu d'une phrase, l'arabe est gardé entier (on ne coupe pas l'intérieur d'une
phrase arabe) et l'anglais et le japonais le suivent : ces langues disent alors un peu plus que le français, tant que
le décideur n'a pas tranché l'écart. Aucun écart n'est corrigé dans le français.
