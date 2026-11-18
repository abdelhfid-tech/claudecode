# Propositions pour le français

*Proposées par l'agent le 18 novembre, à la demande du décideur (« tu peux d'ailleurs proposer d'autres termes pour
corriger le français »). Rien n'est changé dans le jeu tant que le décideur n'a pas tranché, terme par terme.*

Elles viennent du travail des langues : en cherchant chaque notion à sa source, en arabe, en anglais et en japonais, les
glossaires (`ar.md`, `en.md`, `ja.md`) et le registre des sources (`v2/docs/sources/`) ont montré des endroits où le
français est moins juste que ce qu'on écrit dans les autres langues, ou plus exposé au regard des exigences. Le nombre
entre parenthèses dit combien de fois le terme revient dans le jeu : c'est le coût du changement.

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

## Si vous retenez un changement

Le français change d'abord, puis les listes des langues se remettent à jour (`node v2/tools/langues.js releve`) : les
textes touchés sont réécrits dans les trois langues. Toute la batterie se repasse. Mieux vaut trancher ces points
**avant** que l'écriture arrive aux récits, pour ne pas écrire deux fois.
