/* ISNAD 2.x — la langue : le français, l'arabe, l'anglais (2.36, D230 : le japonais est retiré du jeu, ses textes
   archivés dans archive/v2-japonais/ ; ce qui sert une langue sans espaces entre les mots reste dans le moteur).
   Le jeu est écrit en français, et le français ne bouge pas : c'est la langue des fichiers de récit, des tables du moteur
   et des phrases du code. Les trois autres langues ne sont pas des traductions du français — chacune est écrite à la
   source (v2/docs/sources/, v2/docs/langues/) — mais chaque texte y est RANGÉ sous la clé de son texte français, pour que
   le moteur le retrouve.

   Ce module se charge sous Node (require) comme dans le navigateur (window.ISNAD_LANGUE), avant le socle :
     cle(fr)                    la clé d'un texte français (courte, stable)
     casesSaga(saga, vu)        chaque emplacement de texte d'un récit : vu(objet, champ, où)
     casesDefs(D, vu)           chaque emplacement de texte des tables du moteur (src/core/defs.js)
     forme(lang, n, formes)     la forme d'un texte selon un nombre
     brancher(I)                (navigateur) pose I.langue, I.t et I.T sur le moteur

   Dans le moteur :
     I.t('Texte français', { n: 3, nom: '…' })
         En français : le texte, tel quel, ses {champs} remplis. Dans une autre langue : le texte de cette langue rangé
         sous cette clé ; à défaut, le français (et la clé est notée dans I.langue.manques).
         Le premier argument est TOUJOURS une chaîne écrite en toutes lettres, d'un seul tenant : c'est elle que relève
         v2/tools/langues.js. Jamais une phrase assemblée par morceaux : une phrase entière, avec ses {champs}.
         (Une exception : le sous-titre et la réserve de la promotion, dits par partage.js — I.t(P.RESERVE) —, que
         v2/tools/langues.js relève là où ils s'écrivent, v2/tools/promotion.js.)
         Selon un nombre : 'un voile¦{n} voiles' — les formes sont séparées par « ¦ », choisies d'après le champ n
         (français : une, plusieurs ; anglais : one, other ; japonais : une seule ; arabe : une seule, ou les six).
         Deux sens pour un même mot : « Entrée§saisie » — le français dit ce qui précède « § », et la clé distingue le sens.
     I.T('Texte français')
         Ne fait rien : marque, dans une table écrite une fois au chargement, un texte que l'on dira plus tard par
         I.t(table.champ). Le relevé le voit.
     Un champ peut être donné deux fois, tourné à la française et nu : I.t('La lame {de_nom}', { de_nom: 'd’Idris', nom: 'Idris' }).
     Le français se sert du premier, une autre langue du second. De même { nombre: 'trois', n: 3 }.
     I.langue.choisir('ar')     change de langue : les récits et les tables reçoivent leurs textes, la page aussi.

   Ce qui sert de clé reste en français sous le capot : le rayon et le voile d'un Compagnon (posés d'après son nom avant
   toute langue), les catégories du recueil (D.CODEX_CATS), les identifiants.

   2.x — la langue secondaire (demande du décideur, 19 novembre : « ajouter une langue secondaire pour apprendre, même si
   non vocalisée et non traduction mot à mot ») : sous une réplique, une narration ou un carton, la même chose dans une
   autre langue. Rien n'est traduit ici : on va chercher, sous la clé du texte français d'origine, ce que l'autre langue a
   écrit à la source.
     I.langue.choisir2('ar')    la langue secondaire ('' : aucune) ; L.l2() la donne, si elle est offerte et n'est pas
                                celle du jeu
     L.second(texte, o, k)      le texte affiché (o[k], si l'on sait d'où il vient), dans la langue secondaire, nom du
                                joueur compris ; null s'il n'y en a pas
     L.tDans(lang, fr, champs)  une phrase du code, dite dans une autre langue que celle du jeu (comme I.t)
   Le français d'origine se retrouve d'abord par l'emplacement du texte (L.origine : l'objet du récit et son champ, relevés
   une fois), puis par le texte affiché lui-même (L.source : ce que la langue du jeu et le nom du joueur y ont posé).

   2.x — l'arabe vocalisé (demande du décideur, 20 novembre : « Ou bien arabe / arabe vocalisé ») : là où l'on choisit une
   langue, l'arabe paraît deux fois, « العربية » (le texte d'aujourd'hui, inchangé) et l'arabe vocalisé (les mêmes textes,
   avec toutes leurs voyelles). Ce n'est pas une langue de plus : une VARIANTE de l'arabe, qui en partage tout (le sens,
   les polices, les formes selon le nombre, chaque texte et chaque règle). L.lang et L.lang2 restent 'ar' ; L.voy et
   L.voy2 disent si la variante est choisie, pour le jeu ou pour la seconde bulle. Ce que le joueur choisit, et ce que
   garde l'appareil (opts.lang, opts.lang2, ?lang=…), c'est un CHOIX : 'fr', 'ar', 'arv', 'en' (L.code(), L.code2()) ; un choix
   que le jeu n'offre plus (le japonais, gardé par un appareil) revient au français (L.connue).
   Les formes vocalisées sont rangées à part, sous la même clé (src/lang/ar/voyelles/, v2/tools/voyelles.js) : une forme
   n'est montrée que si elle suit encore son texte — mêmes lettres, et chaque signe qu'il porte déjà (fidele) ; sinon, le
   texte tel qu'il est écrit. Sans la variante, rien ne change d'un signe. */
(function (racine) {
  'use strict';
  const LANGUES = {
    fr: { nom: 'Français', dir: 'ltr', rawi: 'Idris' },
    ar: { nom: 'العربية', dir: 'rtl', rawi: 'إدريس' },
    en: { nom: 'English', dir: 'ltr', rawi: 'Idris' }
  };
  const ORDRE = ['fr', 'ar', 'en'];
  const SEP = '¦';
  // les variantes : un choix offert au joueur, qui prend tout d'une langue sauf la forme de certains textes
  // (son nom, le même dans toutes les langues de l'écran comme « العربية » : le mot lui-même, avec ses voyelles — décideur,
  // 20 novembre : « al arabiya avec les voyelles sur le mot » ; là où il faut des mots, une aide ou un lecteur d'écran,
  // l'interface dit « arabe vocalisé » dans sa langue)
  const VARIANTES = { arv: { base: 'ar', nom: 'العَرَبِيَّة', voyelles: true } };
  const CHOIX = ['fr', 'ar', 'arv', 'en'];
  const base = c => (VARIANTES[c] ? VARIANTES[c].base : c);
  const nomDe = c => (VARIANTES[c] ? VARIANTES[c].nom : LANGUES[c] ? LANGUES[c].nom : String(c || ''));
  /* ---------- la vocalisation ----------
     Les signes : les tanwîn, fatha, damma, kasra, la chadda et le soukoun (U+064B à U+0652), l'alif suscrit (U+0670). La
     hamza, le madda et l'alif waṣla ne sont pas des signes ici : ce sont des lettres (أ إ ؤ ئ ء آ), qu'une forme vocalisée
     ne change jamais. */
  const MARQUES = /[\u064B-\u0652\u0670]/g, MARQUE = /[\u064B-\u0652\u0670]/;
  const sansMarques = s => String(s).replace(MARQUES, '');
  // un texte, lettre par lettre, chaque lettre avec l'ensemble des signes qu'elle porte (la case 0 : ceux d'avant toute lettre)
  const lettres = s => { const r = [{ c: '', m: new Set() }]; for (const ch of String(s)) { if (MARQUE.test(ch)) r[r.length - 1].m.add(ch); else r.push({ c: ch, m: new Set() }); } return r; };
  // une forme vocalisée suit-elle son texte ? '' si oui ; 'lettres' si une lettre a changé ; 'signes' si un signe que le
  // texte porte déjà manque à sa place
  function fidele(t, tv) {
    if (typeof t !== 'string' || typeof tv !== 'string') return 'lettres';
    if (sansMarques(t) !== sansMarques(tv)) return 'lettres';
    const a = lettres(t), b = lettres(tv);
    for (let i = 0; i < a.length; i++) for (const m of a[i].m) if (!b[i].m.has(m)) return 'signes';
    return '';
  }

  // la même empreinte que I.hash (FNV-1a), suivie de la longueur : deux textes français ne partagent pas une clé
  // (v2/tools/langues.js le vérifie sur tout le jeu)
  function cle(fr) { let h = 2166136261; for (let i = 0; i < fr.length; i++) { h ^= fr.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + '.' + fr.length.toString(36); }

  /* ---------- la forme d'un texte selon un nombre ---------- */
  const RANG = {
    fr: n => (n > 1 ? 1 : 0),
    en: n => (n === 1 ? 0 : 1),
    ja: () => 0,
    // zéro, un, deux, de trois à dix, de onze à quatre-vingt-dix-neuf, le reste
    ar: n => { const c = Math.abs(n) % 100; return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : c >= 3 && c <= 10 ? 3 : c >= 11 ? 4 : 5; }
  };
  function forme(lang, n, formes) { if (formes.length < 2) return formes[0]; const i = (RANG[lang] || RANG.fr)(Number(n) || 0); return formes[Math.min(i, formes.length - 1)]; }

  /* ---------- où sont les textes : les récits ----------
     Une forme dit, pour un objet, lesquels de ses champs sont du texte :
       1        une chaîne à dire
       'qui'    le nom de qui parle : du texte s'il est écrit en toutes lettres, rien si c'est un identifiant
       [f]      une liste, chaque élément selon f
       { … }    un objet, champ par champ ; '*' vaut pour tous ses champs
       '**'     toutes les chaînes qu'on y trouve, à toute profondeur
     Tout ce que la forme ne nomme pas est une clé, une couleur, un réglage : on n'y touche jamais. */
  const ID = /^[a-z0-9_]+$/;
  const OPTS = [{ t: 1, r: 1 }];
  const OPS = {
    say: { 1: 'qui', 2: 1 }, nar: { 1: 1 }, quote: { 1: 1, 2: 1 }, title: { 1: 1, 2: 1 },
    choice: { 1: 1, 2: OPTS }, ask: { 1: 1, 2: OPTS },
    parley: { 1: { with: 'qui', title: 1, intro: 1, rounds: [{ say: 1, opts: OPTS, noir: { name: 1, intro: 1, after: 1, say: 1 } }] } },
    battle: { 1: { intro: 1, allies: [{ name: 1 }] } },
    site: { 1: { name: 1 } }
  };
  // une opération de script se reconnaît à sa tête et à sa tournure (une liste de clés n'en est pas une)
  const EST_OP = {
    say: v => v.length >= 3 && typeof v[1] === 'string' && typeof v[2] === 'string',
    nar: v => typeof v[1] === 'string', quote: v => typeof v[1] === 'string' && typeof v[2] === 'string', title: v => typeof v[1] === 'string',
    choice: v => typeof v[1] === 'string' && Array.isArray(v[2]), ask: v => typeof v[1] === 'string' && Array.isArray(v[2]),
    parley: v => !!v[1] && typeof v[1] === 'object', battle: v => !!v[1] && typeof v[1] === 'object' && !Array.isArray(v[1]), site: v => !!v[1] && typeof v[1] === 'object' && !Array.isArray(v[1])
  };
  const COMPETENCE = { name: 1, desc: 1 };
  const ENNEMI = { name: 1, desc: 1, taunts: [1], skills: [{ name: 1 }], phases: [{ say: 1, addSkills: [{ name: 1 }] }], parole: { dit: [1], oui: [1], rep: { '*': 1 }, non: { '*': 1 } } };
  const CHAPITRE = { title: 1, sub: 1, objectives: [{ text: 1 }], npcs: [{ name: 1 }], bataille: { mot: 1, rangs: [{ name: 1 }] }, enigme: { title: 1, signe: 1, mot: 1 } };
  const SAGA = {
    name: 1, epithet: 1, years: 1, lightName: 1, ambiance: 1, tagline: 1, narrator: 1,
    heroes: { '*': { name: 1, title: 1, skills: [COMPETENCE], limit: COMPETENCE } },
    enemies: { '*': ENNEMI },
    codex: [{ title: 1, text: 1, src: 1, avant: 1 }],   // (2.48, D240 : « avant », le texte d'une fiche tant que le nom de l'Agrégor n'est pas reçu)
    chapters: [CHAPITRE],
    // le contenu commun (coeur.js)
    oeuvres: { '*': { name: 1, court: 1, menu: 1, desc: 1, fin: 1, lignes: [1] } },
    lames: { '*': { name: 1, ar: 1, texte: 1 } },
    animaux: { '*': { name: 1, ar: 1, don: 1, effet: 1, texte: 1, vient: 1 } },
    valeurs: { '*': { face: 1, texte: 1 } },
    attributs: { '*': { nom: 1, sens: 1, verset: 1, ref: 1, mot: 1 } },
    mal: { titre: 1, chapeau: 1, couture: 1, jauge: { note: 1 }, rangs: { '*': { name: 1, sous: 1, texte: 1, reponse: 1, src: 1 } } },
    bien: '**', lecons: '**', portes: '**', postures: '**', secours: '**',
    cite: '**'   // 2.23 : ce qu'on dit dans les quartiers de la Cité (frame.js)
  };
  const DEFS = {
    ELEMENTS: { '*': { name: 1, ar: 1 } }, PILLARS: { '*': { name: 1 } }, PRAYERS: { '*': 1 }, LIEUX: { '*': 1 }, SLOTS: { '*': 1 },
    MAPS: { '*': { label: 1 } }, GABARITS: { '*': { nom: 1 } }, LIVRES: { '*': { titre: 1 } },
    ITEMS: { '*': COMPETENCE }, GEAR: { '*': COMPETENCE }, GEAR_TYPES: { '*': { name: 1 } },
    MATS: { '*': { name: 1 } }, PIECES: { '*': { name: 1, desc: 1, group: 1 } },
    RANGS: { '*': COMPETENCE }, ORDRES: { '*': COMPETENCE }, MANOEUVRES: { '*': COMPETENCE },
    OUTILS: { '*': { nom: 1 } }, POSTURES: { '*': { nom: 1, court: 1 } }, VOIES: { '*': { name: 1, de: 1 } },
    STARS: [{ name: 1, fr: 1 }], TENUES: [{ nom: 1 }],
    MONDE: { depuis: { '*': { epoque: 1 } } }   // 2.29 (D220) : l'époque d'un chapitre, que dit le carton d'une ville visitée
  };

  function selon(o, k, f, vu, ou) {
    const x = o[k]; if (x == null || x === '') return;
    if (f === 1) { if (typeof x === 'string') vu(o, k, ou); return; }
    if (f === 'qui') { if (typeof x === 'string' && !ID.test(x)) vu(o, k, ou); return; }
    if (f === '**') { if (typeof x === 'string') vu(o, k, ou); else if (typeof x === 'object') Object.keys(x).forEach(c => selon(x, c, '**', vu, ou + '.' + c)); return; }
    if (typeof x !== 'object') return;
    if (Array.isArray(f)) { if (Array.isArray(x)) x.forEach((_, i) => selon(x, i, f[0], vu, ou + '[' + i + ']')); return; }
    if (Array.isArray(x)) return;
    if (f['*']) Object.keys(x).forEach(c => selon(x, c, f['*'], vu, ou + '.' + c));
    else Object.keys(f).forEach(c => selon(x, c, f[c], vu, ou + '.' + c));
  }
  // les opérations de script, où qu'elles soient dans un chapitre (dans un « si », sous un choix, à l'issue d'un pourparler)
  function scripts(v, vu, ou, vus) {
    if (!v || typeof v !== 'object' || vus.has(v)) return; vus.add(v);
    if (Array.isArray(v)) {
      const op = typeof v[0] === 'string' && OPS[v[0]] && EST_OP[v[0]](v) ? OPS[v[0]] : null;
      if (op) Object.keys(op).forEach(i => selon(v, +i, op[i], vu, ou + '<' + v[0] + '>' + i));
      v.forEach((x, i) => scripts(x, vu, op ? ou + '<' + v[0] + '>' + i : ou + '[' + i + ']', vus));
    } else Object.keys(v).forEach(c => scripts(v[c], vu, ou + '.' + c, vus));
  }
  function casesSaga(saga, vu) {
    // un même emplacement n'est donné qu'une fois (une forme et le relevé des scripts peuvent s'y croiser)
    const donnes = new Map(), unique = (o, k, ou) => { let s = donnes.get(o); if (!s) donnes.set(o, s = new Set()); if (s.has(k)) return; s.add(k); vu(o, k, ou); };
    Object.keys(SAGA).forEach(c => selon(saga, c, SAGA[c], unique, c));
    (saga.chapters || []).forEach((ch, i) => scripts(ch, unique, 'chapters[' + i + ']', new Set()));
    ['intro', 'outro'].forEach(c => scripts(saga[c], unique, c, new Set()));   // l'ouverture et la clôture d'un récit sont des scripts
    if (saga.route) scripts(saga.route, unique, 'route', new Set());   // 2.30 (D222) : les rencontres de la route (coeur.js), des scripts aussi
  }
  function casesDefs(D, vu) { Object.keys(DEFS).forEach(c => selon(D, c, DEFS[c], vu, 'D.' + c)); }

  /* ---------- dans le navigateur : le moteur parle la langue choisie ---------- */
  function brancher(I) {
    const D = I.D, cat = { ar: {}, en: {}, ja: {} }, cases = [], sues = new WeakSet();
    const L = I.langue = { LANGUES, ORDRE, VARIANTES, CHOIX, lang: 'fr', cle, manques: new Set(), base, nom: nomDe, fidele, sansMarques };
    const complets = {}, voy = {}, suit = new Map();   // (voy, suit : l'arabe vocalisé, plus bas)
    L.poser = (lang, textes, info) => { Object.assign(cat[lang] || (cat[lang] = {}), textes); if (info) complets[lang] = !!info.complet; suit.clear(); };
    // les langues que l'on propose au joueur : le français, et celles dont chaque texte est écrit (une langue inachevée ne
    // s'ouvre que par ?lang=… dans l'adresse, pour les essais)
    L.disponibles = () => ORDRE.filter(l => l === 'fr' || complets[l]);
    L.connue = lang => (LANGUES[lang] ? lang : 'fr');
    // 2.x — l'arabe vocalisé : les formes vocalisées (langue → clé → texte), posées par l'assemblage ; L.voy (le jeu) et
    // L.voy2 (la seconde bulle) disent si la variante est choisie
    L.voy = false; L.voy2 = false;
    L.poserVoyelles = (lang, textes) => { Object.assign(voy[lang] || (voy[lang] = {}), textes); suit.clear(); };
    // le texte qu'une langue a écrit sous une clé, tel qu'il se montre : vocalisé si la variante est choisie pour cette
    // langue (celle du jeu, ou celle de la seconde bulle — elles ne sont jamais la même) et que sa forme vocalisée suit
    // encore le texte ; sinon, tel qu'il est écrit
    const ecrit = (lang, k) => { const c = cat[lang], t = c ? c[k] : null;
      if (t == null || !(lang === L.lang ? L.voy : lang === L.lang2 && L.voy2)) return t;
      const v = voy[lang] && voy[lang][k]; if (typeof v !== 'string') return t;
      const id = lang + ' ' + k; if (!suit.has(id)) suit.set(id, fidele(t, v) === ''); return suit.get(id) ? v : t; };
    // le texte d'une langue rangé sous un texte français ; à défaut, le français
    L.de = function (fr) { if (L.lang === 'fr' || typeof fr !== 'string' || !fr) return fr; const t = ecrit(L.lang, cle(fr)); if (t == null) { L.manques.add(fr); return fr; } return t; };
    L.rawi = () => LANGUES[L.lang].rawi;
    // l'écriture : combien de signes avance le texte qui s'écrit, quel poids a un texte à lire, quelles initiales a un nom
    // (le japonais dit plus en moins de signes ; l'arabe se lie, il s'écrit mot à mot pour ne pas casser ses lettres)
    L.avance = (txt, i) => { if (L.lang === 'ar') { const j = txt.indexOf(' ', i + 1); return j < 0 ? txt.length : j; } return Math.min(txt.length, i + (L.lang === 'ja' ? 1 : 2)); };
    // (vocalisé, un texte se lit dans le même temps : ses signes ne comptent pas)
    L.poids = txt => (L.voy ? sansMarques(txt) : String(txt)).length * (L.lang === 'ja' ? 2.2 : 1);
    L.initiales = nom => { nom = L.voy ? sansMarques(nom || '') : String(nom || '');
      if (L.lang === 'ar') return nom.replace(/^(ال|أبو |أبي |ابن |بن )/, '').slice(0, 2);
      if (L.lang === 'ja') return nom.replace(/^[「『]/, '').slice(0, 2);
      if (L.lang === 'en') return nom.replace(/^(The |Al-|al-|Abu |Ibn |')/, '').slice(0, 2);
      return nom.replace(/^(L'|L’|Le |La |Les |Al-|Abû |Ibn |')/, '').slice(0, 2); };
    // le texte français d'où vient un texte affiché (ce que la partie garde doit rester le même dans toutes les langues)
    const versFr = new Map();
    L.fr = t => (L.lang === 'fr' || typeof t !== 'string' ? t : (versFr.get(t) || t));
    L.dir = () => LANGUES[L.lang].dir;
    // le sens d'une ligne posée dans la scène (2.x, D189) : la scène reste de gauche à droite, mais chaque ligne y prend le
    // sens de sa langue — de droite à gauche pour un texte arabe, de gauche à droite pour le français de repli d'un texte
    // encore à écrire. (« dir=auto » se tromperait sur une phrase arabe qui commence par un nom en lettres latines.)
    // (Les lettres arabes seules comptent : « ﷺ », d'un bloc à part, se lit aussi dans une phrase française.)
    L.sens = t => (LANGUES[L.lang].dir === 'rtl' && /[\u0621-\u064a\u0671-\u06d3\u0750-\u077f]/.test(String(t || '')) ? 'rtl' : 'ltr');
    L.locale = () => ({ fr: 'fr-FR', ar: 'ar-u-nu-latn', en: 'en-GB', ja: 'ja-JP' })[L.lang];   // pour les dates ; l'arabe garde les chiffres du reste du jeu
    I.T = s => s;
    // 2.x — la langue secondaire : ce que I.t vient de dire, et d'où (la phrase française et ses champs) — seulement quand
    // une langue secondaire est choisie, les trois cents dernières phrases : le fil y retrouve ce qu'une annonce dit
    const dits = new Map();
    // un même mot français peut avoir deux sens : « Entrée§saisie » se dit « Entrée » en français, mais a sa propre clé
    I.t = function (fr, p) {
      let s = L.de(fr); if (s === fr && fr.indexOf('§') > 0) s = fr.slice(0, fr.indexOf('§'));
      if (s.indexOf(SEP) >= 0) s = forme(s === fr ? 'fr' : L.lang, p && p.n, s.split(SEP));
      s = p ? s.replace(/\{(\w+)\}/g, (m, c) => (p[c] == null ? m : p[c])) : s;
      if (L.lang2) { dits.delete(s); dits.set(s, { fr, p }); if (dits.size > 300) dits.delete(dits.keys().next().value); }
      return s;
    };
    // relève, une fois, les emplacements de texte d'un récit posé (en français à ce moment-là) ; chaque objet garde, pour
    // la langue secondaire, le français d'origine de ses champs (L.origine)
    const sans = s => (typeof s === 'string' && s.indexOf('§') > 0 ? s.slice(0, s.indexOf('§')) : s);   // « Texte§sens » se dit « Texte »
    const origines = new WeakMap(), affiches = new Map();
    const noter = (o, k, fr) => { let m = origines.get(o); if (!m) origines.set(o, m = {}); if (m[k] === undefined) m[k] = fr; };
    L.retenir = (affiche, fr) => { if (typeof affiche === 'string' && affiche && typeof fr === 'string' && !affiches.has(affiche)) affiches.set(affiche, fr); };
    L.relever = function (saga) { if (!saga || sues.has(saga)) return; sues.add(saga); casesSaga(saga, (o, k) => { cases.push({ o, k, fr: o[k] }); noter(o, k, o[k]); o[k] = sans(o[k]); if (L.lang === 'fr') L.retenir(o[k], cases[cases.length - 1].fr); }); };
    casesDefs(D, (o, k) => { cases.push({ o, k, fr: o[k] }); noter(o, k, o[k]); });
    // pose la langue courante partout : les récits, les tables, puis le nom du râwî (perso.js) et la page
    L.appliquer = function () {
      versFr.clear(); affiches.clear();
      cases.forEach(c => { const t = L.de(c.fr), v = t === c.fr ? sans(t) : t; c.o[c.k] = v; if (v !== sans(c.fr) && !versFr.has(v)) versFr.set(v, sans(c.fr)); L.retenir(v, c.fr); });
      if (I.perso) I.perso.appliquer();
      L.page();
    };

    /* ---------- 2.x · la langue secondaire ---------- */
    L.lang2 = '';
    // 2.x — ce que le joueur choisit : une langue offerte, ou une variante d'une langue offerte qui a des textes à montrer
    // (l'arabe vocalisé) — dans l'ordre de CHOIX ; et le choix en vigueur, pour le jeu et pour la seconde bulle
    L.choix = () => CHOIX.filter(c => L.disponibles().includes(base(c)) && (!VARIANTES[c] || (voy[base(c)] && Object.keys(voy[base(c)]).length > 0)));
    const codeDe = (lang, v) => (v ? Object.keys(VARIANTES).find(c => VARIANTES[c].base === lang) || lang : lang);
    L.code = () => codeDe(L.lang, L.voy);
    L.code2 = () => (L.l2() ? codeDe(L.l2(), L.voy2) : '');
    // ce qu'on peut lire en second : les choix offerts, sauf ceux de la langue du jeu (l'arabe et l'arabe vocalisé sont
    // une seule langue : on ne les lit pas l'un sous l'autre)
    L.secondes = () => L.choix().filter(c => base(c) !== L.lang);
    // la langue secondaire en vigueur : offerte, et autre que celle du jeu ('' sinon) ; ?lang2=… l'ouvre aussi inachevée
    L.l2 = () => (L.lang2 && L.lang2 !== L.lang && LANGUES[L.lang2] ? L.lang2 : '');
    // (un choix : 'arv' prend l'arabe, vocalisé) ; rend le choix retenu, ou ''
    L.choisir2 = function (c, force) { const lang = base(c); L.lang2 = lang && LANGUES[lang] && lang !== L.lang && (force || L.disponibles().includes(lang)) ? lang : ''; L.voy2 = !!L.lang2 && !!(VARIANTES[c] && VARIANTES[c].voyelles); if (!L.lang2) dits.clear();
      const h = racine.document && racine.document.documentElement; if (h) { if (L.voy2) h.dataset.voyelles2 = ''; else h.removeAttribute('data-voyelles2'); }   // (style.css : la hauteur de ses signes)
      return L.code2(); };
    // le français d'origine d'un emplacement (l'objet d'un récit ou d'une table, et son champ), tel que relevé ; ou null
    L.origine = (o, k) => { const m = o && typeof o === 'object' ? origines.get(o) : null; return m && typeof m[k] === 'string' ? m[k] : null; };
    // le français d'origine d'un texte affiché dans la langue du jeu (nom du joueur compris) ; ou null
    L.source = t => (typeof t === 'string' ? affiches.get(t) || null : null);
    // le texte qu'une langue a écrit sous un texte français (le français lui-même pour le français) ; null s'il n'est pas écrit
    // (2.x : vocalisé si c'est la langue de la seconde bulle et que l'arabe vocalisé y est choisi)
    L.dans = function (lang, fr) { if (typeof fr !== 'string' || !fr) return null; if (lang === 'fr') return sans(fr); const t = ecrit(lang, cle(fr)); return typeof t === 'string' && t ? t : null; };
    // un champ d'une phrase, dans une autre langue : un texte du jeu y prend le sien, le nom du râwî aussi ; un nombre, le
    // nom choisi par le joueur restent ce qu'ils sont
    const champDans = (lang, v) => { if (typeof v !== 'string' || !v) return v; if (v === LANGUES[L.lang].rawi) return LANGUES[lang].rawi; const f = L.source(v), t = f ? L.dans(lang, f) : null; return t == null ? v : t; };
    // une phrase du code dite dans une autre langue (comme I.t) ; null si cette langue ne l'a pas écrite
    // (deja : les champs sont déjà dans cette langue)
    L.tDans = function (lang, fr, p, deja) {
      if (typeof fr !== 'string') return null; let s = L.dans(lang, fr); if (s == null) return null;
      if (s.indexOf(SEP) >= 0) s = forme(lang, p && p.n, s.split(SEP));
      if (!p) return s; const q = {}; Object.keys(p).forEach(c => { q[c] = deja ? p[c] : champDans(lang, p[c]); });
      return s.replace(/\{(\w+)\}/g, (m, c) => (q[c] == null ? m : q[c]));
    };
    // ce que I.t a dit (un texte affiché tel quel) : sa phrase et ses champs ; ou null
    L.retrouver = s => dits.get(s) || null;
    // le texte affiché dans la langue secondaire : d'après son emplacement (o, k) s'il est connu, sinon d'après le texte
    // lui-même ; le nom du joueur y est posé. null si aucune langue secondaire, ou rien d'écrit.
    L.second = function (texte, o, k) {
      const l2 = L.l2(); if (!l2 || typeof texte !== 'string' || !texte) return null;
      const fr = (o && L.origine(o, k)) || L.source(texte); if (!fr) return null;
      const t = L.dans(l2, fr); if (t == null) return null;
      return I.perso && I.perso.direDans ? I.perso.direDans(t, l2, fr) : t;
    };
    // le sens d'un texte de la langue secondaire (comme L.sens pour la langue du jeu)
    L.sens2 = t => (LANGUES[L.l2()] && LANGUES[L.l2()].dir === 'rtl' && /[ء-يٱ-ۓݐ-ݿ]/.test(String(t || '')) ? 'rtl' : 'ltr');
    L.poids2 = txt => (L.voy2 ? sansMarques(txt) : String(txt)).length * (L.l2() === 'ja' ? 2.2 : 1);
    /* la page : un élément marqué data-t porte un texte français, sans balise ; data-t-title, data-t-aria et
       data-t-placeholder portent celui d'un attribut */
    const ATTR = { 'data-t-title': 'title', 'data-t-aria': 'aria-label', 'data-t-placeholder': 'placeholder' };
    L.page = function () {
      const doc = racine.document; if (!doc || !doc.documentElement) return;
      const h = doc.documentElement; h.lang = L.lang; h.dir = L.dir(); h.dataset.lang = L.lang;
      if (L.voy) h.dataset.voyelles = ''; else h.removeAttribute('data-voyelles');   // 2.x : l'arabe vocalisé (style.css lui donne la hauteur de ses signes)
      doc.querySelectorAll('[data-t]').forEach(e => { let fr = e.getAttribute('data-t'); if (!fr) { fr = e.textContent.replace(/\s+/g, ' ').trim(); e.setAttribute('data-t', fr); } e.textContent = I.t(fr); });
      Object.keys(ATTR).forEach(a => doc.querySelectorAll('[' + a + ']').forEach(e => { e.setAttribute(ATTR[a], I.t(e.getAttribute(a))); }));
    };
    // (un choix : 'arv' prend l'arabe, vocalisé) ; rend le choix retenu
    L.choisir = function (c) { L.lang = L.connue(base(c)); L.voy = L.lang === base(c) && !!(VARIANTES[c] && VARIANTES[c].voyelles); L.appliquer(); return L.code(); };
    return L;
  }

  const api = { LANGUES, ORDRE, SEP, VARIANTES, CHOIX, base, nomDe, sansMarques, fidele, cle, forme, casesSaga, casesDefs, brancher };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else racine.ISNAD_LANGUE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
