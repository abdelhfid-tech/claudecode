/* ISNAD 2.x — la langue : le français, l'arabe, l'anglais, le japonais.
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
         Selon un nombre : 'un voile¦{n} voiles' — les formes sont séparées par « ¦ », choisies d'après le champ n
         (français : une, plusieurs ; anglais : one, other ; japonais : une seule ; arabe : une seule, ou les six).
     I.T('Texte français')
         Ne fait rien : marque, dans une table écrite une fois au chargement, un texte que l'on dira plus tard par
         I.t(table.champ). Le relevé le voit.
     Un champ peut être donné deux fois, tourné à la française et nu : I.t('La lame {de_nom}', { de_nom: 'd’Idris', nom: 'Idris' }).
     Le français se sert du premier, une autre langue du second. De même { nombre: 'trois', n: 3 }.
     I.langue.choisir('ar')     change de langue : les récits et les tables reçoivent leurs textes, la page aussi.

   Ce qui sert de clé reste en français sous le capot : le rayon et le voile d'un Compagnon (posés d'après son nom avant
   toute langue), les catégories du recueil (D.CODEX_CATS), les identifiants. */
(function (racine) {
  'use strict';
  const LANGUES = {
    fr: { nom: 'Français', dir: 'ltr', rawi: 'Idris' },
    ar: { nom: 'العربية', dir: 'rtl', rawi: 'إدريس' },
    en: { nom: 'English', dir: 'ltr', rawi: 'Idris' },
    ja: { nom: '日本語', dir: 'ltr', rawi: 'イドリース' }
  };
  const ORDRE = ['fr', 'ar', 'en', 'ja'];
  const SEP = '¦';

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
    codex: [{ title: 1, text: 1, src: 1 }],
    chapters: [CHAPITRE],
    // le contenu commun (coeur.js)
    oeuvres: { '*': { name: 1, court: 1, menu: 1, desc: 1, fin: 1, lignes: [1] } },
    lames: { '*': { name: 1, ar: 1, texte: 1 } },
    animaux: { '*': { name: 1, ar: 1, don: 1, effet: 1, texte: 1, vient: 1 } },
    valeurs: { '*': { face: 1, texte: 1 } },
    attributs: { '*': { nom: 1, sens: 1, verset: 1, ref: 1, mot: 1 } },
    mal: { titre: 1, chapeau: 1, couture: 1, jauge: { note: 1 }, rangs: { '*': { name: 1, sous: 1, texte: 1, reponse: 1, src: 1 } } },
    bien: '**', lecons: '**', portes: '**', postures: '**', secours: '**'
  };
  const DEFS = {
    ELEMENTS: { '*': { name: 1, ar: 1 } }, PILLARS: { '*': { name: 1 } }, PRAYERS: { '*': 1 }, LIEUX: { '*': 1 }, SLOTS: { '*': 1 },
    MAPS: { '*': { label: 1 } }, GABARITS: { '*': { nom: 1 } }, LIVRES: { '*': { titre: 1 } },
    ITEMS: { '*': COMPETENCE }, GEAR: { '*': COMPETENCE }, GEAR_TYPES: { '*': { name: 1 } },
    MATS: { '*': { name: 1 } }, PIECES: { '*': { name: 1, desc: 1, group: 1 } },
    RANGS: { '*': COMPETENCE }, ORDRES: { '*': COMPETENCE }, MANOEUVRES: { '*': COMPETENCE },
    OUTILS: { '*': { nom: 1 } }, POSTURES: { '*': { nom: 1, court: 1 } }, VOIES: { '*': { name: 1, de: 1 } },
    STARS: [{ name: 1, fr: 1 }], TENUES: [{ nom: 1 }]
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
  }
  function casesDefs(D, vu) { Object.keys(DEFS).forEach(c => selon(D, c, DEFS[c], vu, 'D.' + c)); }

  /* ---------- dans le navigateur : le moteur parle la langue choisie ---------- */
  function brancher(I) {
    const D = I.D, cat = { ar: {}, en: {}, ja: {} }, cases = [], sues = new WeakSet();
    const L = I.langue = { LANGUES, ORDRE, lang: 'fr', cle, manques: new Set() };
    L.poser = (lang, textes) => { Object.assign(cat[lang] || (cat[lang] = {}), textes); };
    L.connue = lang => (LANGUES[lang] ? lang : 'fr');
    // le texte d'une langue rangé sous un texte français ; à défaut, le français
    L.de = function (fr) { if (L.lang === 'fr' || typeof fr !== 'string' || !fr) return fr; const t = cat[L.lang][cle(fr)]; if (t == null) { L.manques.add(fr); return fr; } return t; };
    L.rawi = () => LANGUES[L.lang].rawi;
    // l'écriture : combien de signes avance le texte qui s'écrit, quel poids a un texte à lire, quelles initiales a un nom
    // (le japonais dit plus en moins de signes ; l'arabe se lie, il s'écrit mot à mot pour ne pas casser ses lettres)
    L.avance = (txt, i) => { if (L.lang === 'ar') { const j = txt.indexOf(' ', i + 1); return j < 0 ? txt.length : j; } return Math.min(txt.length, i + (L.lang === 'ja' ? 1 : 2)); };
    L.poids = txt => String(txt).length * (L.lang === 'ja' ? 2.2 : 1);
    L.initiales = nom => { nom = String(nom || '');
      if (L.lang === 'ar') return nom.replace(/^(ال|أبو |أبي |ابن |بن )/, '').slice(0, 2);
      if (L.lang === 'ja') return nom.replace(/^[「『]/, '').slice(0, 2);
      if (L.lang === 'en') return nom.replace(/^(The |Al-|al-|Abu |Ibn |')/, '').slice(0, 2);
      return nom.replace(/^(L'|L’|Le |La |Les |Al-|Abû |Ibn |')/, '').slice(0, 2); };
    // le texte français d'où vient un texte affiché (ce que la partie garde doit rester le même dans toutes les langues)
    const versFr = new Map();
    L.fr = t => (L.lang === 'fr' || typeof t !== 'string' ? t : (versFr.get(t) || t));
    L.dir = () => LANGUES[L.lang].dir;
    L.locale = () => ({ fr: 'fr-FR', ar: 'ar-u-nu-latn', en: 'en-GB', ja: 'ja-JP' })[L.lang];   // pour les dates ; l'arabe garde les chiffres du reste du jeu
    I.T = s => s;
    I.t = function (fr, p) {
      let s = L.de(fr);
      if (s.indexOf(SEP) >= 0) s = forme(s === fr ? 'fr' : L.lang, p && p.n, s.split(SEP));
      return p ? s.replace(/\{(\w+)\}/g, (m, c) => (p[c] == null ? m : p[c])) : s;
    };
    // relève, une fois, les emplacements de texte d'un récit posé (en français à ce moment-là)
    L.relever = function (saga) { if (!saga || sues.has(saga)) return; sues.add(saga); casesSaga(saga, (o, k) => cases.push({ o, k, fr: o[k] })); };
    casesDefs(D, (o, k) => cases.push({ o, k, fr: o[k] }));
    // pose la langue courante partout : les récits, les tables, puis le nom du râwî (perso.js) et la page
    L.appliquer = function () {
      versFr.clear(); cases.forEach(c => { const t = L.de(c.fr); c.o[c.k] = t; if (t !== c.fr && !versFr.has(t)) versFr.set(t, c.fr); });
      if (I.perso) I.perso.appliquer();
      L.page();
    };
    /* la page : un élément marqué data-t porte un texte français, sans balise ; data-t-title, data-t-aria et
       data-t-placeholder portent celui d'un attribut */
    const ATTR = { 'data-t-title': 'title', 'data-t-aria': 'aria-label', 'data-t-placeholder': 'placeholder' };
    L.page = function () {
      const doc = racine.document; if (!doc || !doc.documentElement) return;
      const h = doc.documentElement; h.lang = L.lang; h.dir = L.dir(); h.dataset.lang = L.lang;
      doc.querySelectorAll('[data-t]').forEach(e => { let fr = e.getAttribute('data-t'); if (!fr) { fr = e.textContent.replace(/\s+/g, ' ').trim(); e.setAttribute('data-t', fr); } e.textContent = I.t(fr); });
      Object.keys(ATTR).forEach(a => doc.querySelectorAll('[' + a + ']').forEach(e => { e.setAttribute(ATTR[a], I.t(e.getAttribute(a))); }));
    };
    L.choisir = function (lang) { L.lang = L.connue(lang); L.appliquer(); return L.lang; };
    return L;
  }

  const api = { LANGUES, ORDRE, SEP, cle, forme, casesSaga, casesDefs, brancher };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else racine.ISNAD_LANGUE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
