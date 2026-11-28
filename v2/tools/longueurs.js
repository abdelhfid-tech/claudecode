#!/usr/bin/env node
/* ISNAD 2.x — les longueurs : aucun texte coupé (2.24, D213), et le relevé des longueurs (D189).

   Le décideur, 21 novembre : « il faut aller moins vite dans l'écriture et vérifier la longueur des textes car parfois ils ne
   s'affichent pas entièrement dans l'écran sous l'image du jeu ».

   node v2/tools/longueurs.js [langue…] [écran…] [fr-ar | sans2]   → « LONGUEURS CONFORMES » ; « DÉBORDE » sinon (code 1)
     Le contrôle. Dans le jeu assemblé, mis dans un lieu comme le joueur l'a (la boîte de dialogue y est la plus serrée),
     chaque texte qui passe par la boîte de dialogue — les répliques et les narrations de chaque récit (où qu'elles soient :
     un objectif, un personnage, une réponse de choix ou de « ask », l'issue d'un pourparler), les manches d'un pourparler
     et leurs réponses, la parole qui suit une idée noire, ce que l'on répond à une idée noire (dit, oui, non), les lignes
     du moteur qui passent par showLine (les verdicts de la Chaîne, le raid d'une caravane, les veillées), lues dans son
     code, celles qu'il dit dans les quartiers de la Cité (la table `cite` de l'histoire-cadre : Maître Yûnus, et depuis la
     2.27 Sâlim et l'organisateur ; depuis la 2.28, les lignes des activités : le refus sans prime, l'étal, un record, la pensée
     d'Idris devant l'écran, sur la grande roue et après un manège) et la leçon des virages — est mis en pages par la fonction même dont showLine se sert (ISNAD.script.pages), puis chaque page est posée
     dans la boîte et mesurée par la vraie mise en page : elle tient entière dans sa zone (en hauteur, sous l'image et
     au-dessus de la manette ; en largeur et au bureau, au plus ISNAD.script.HAUT_MAX de la scène, dans la scène, hors de la
     manette), son texte ne sort pas de la boîte, sa police n'est pas sous dix points sur un écran tactile, aucun mot n'est
     coupé entre deux pages, l'italique y est fermé, et les pages mises bout à bout redonnent le texte entier, signe pour
     signe et italique pour italique. Avec une langue secondaire, la seconde bulle de la dernière page est posée aussi :
     dans l'écran, hors de la boîte, jamais sous dix points, et elle défile si elle ne tient pas (jamais coupée). Chaque
     carton du récit (un titre, une parole citée et sa source, l'ouverture d'un pourparler, une idée noire, un attribut et
     son verset, le secours et son verset) est posé dans #card et tenu par ISNAD.script.tenirCarton : il tient dans l'écran,
     hors de la manette, sans police sous dix points. Depuis la 2.49 (D242), chaque légende — une narration d'arrivée
     (['legende', …]) que le jeu pose dans le fil des annonces pendant qu'on marche — y est posée comme le fait le jeu
     (ISNAD.script.toast, sa seconde langue comprise) : elle tient dans l'écran, hors de la manette (en hauteur, au-dessus
     de sa bande ; en largeur, entre ses zones), n'est pas coupée, et sa police n'est pas sous dix points au doigt.
     Par défaut : fr, ar, arv (l'arabe vocalisé), en ; 390x844, 844x390, 360x640 (un petit téléphone), 1280x720 (le
     bureau) ; puis le couple fr-ar (le français, et l'arabe en langue secondaire) sur les quatre écrans.
     Il écrit dans .smoke/longueurs/ : pages.json (tout), et pages-fr-390x844.txt — les textes français qui demandent plus
     d'une page en hauteur sur 390 × 844 (fichier, chapitre, clé, nombre de pages, début du texte), pour le décideur, qui
     dira s'il faut en raccourcir ; l'agent n'en raccourcit aucun (exigence 25). De même pour le petit téléphone.

   node v2/tools/longueurs.js releve [langue…]   → « LONGUEURS RELEVÉES » (le relevé de la 2.12, un rapport sans blocage)
     1. Les textes de l'interface qui passent par le fil (les annonces du moteur, les marques, les leçons, les consignes du
        labyrinthe), rendus dans le fil lui-même, dans les quatre langues, sur un téléphone de 390 points tenu en hauteur,
        texte « grand » : « À REPRENDRE » quand une annonce dépasse une ligne, ou qu'une leçon dépasse une phrase.
     2. Les deux menus — les manières de répondre à une idée noire, la liste d'un pourparler —, ouverts par le vrai récit
        (« Le Fort des Oliviers »), en 390 × 844 et en 360 × 560, dans les quatre langues : où finit la liste, combien de
        réponses se voient entières, s'il faut défiler (avec son repère). Le menu d'une idée noire en japonais, qui coupait
        sa troisième manière en 390 × 844 avant la 2.12, est un cas suivi.
     3. Les répliques et narrations des récits qui dépassent six lignes dans la boîte de dialogue en 390 × 844 : seulement
        listées (depuis la 2.24, elles se lisent en pages : le contrôle ci-dessus les éprouve).
     Le détail dans .smoke/longueurs/longueurs.json. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/longueurs'), URL = 'file://' + path.join(V2, 'index.html');
fs.mkdirSync(out, { recursive: true });

// le jeu, ouvert dans une langue, sur un écran ; puis le chapitre 3 de Khâlid, posé comme le font loupe.js et manette.js : l'IA
// de test un quart de seconde, puis on passe à la main ce qui reste à lire, jusqu'à ce que le joueur ait la main dans le lieu
// (en hauteur, l'image y est la plus grande : la boîte de dialogue, sous elle, y a le moins de place)
async function ouvrirJeu(browser, l, vp, l2) {
  const tactile = vp.width < 1000 || vp.height > vp.width;
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: tactile, isMobile: tactile, userAgent: tactile ? devices['iPhone 13'].userAgent : undefined });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const q = [l !== 'fr' ? 'lang=' + l : '', l2 ? 'lang2=' + l2 : ''].filter(Boolean).join('&');
  await p.goto(URL + (q ? '?' + q : '')); await p.waitForTimeout(2000); p.__errs = errs; return p;
}
async function chapitre(p) {
  await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
    I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('khalid', 2); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
  await p.waitForTimeout(1800);
  for (let i = 0; i < 200; i++) { const e = await p.evaluate(() => { const I = window.ISNAD, W = I.world, q = s => document.querySelector(s); if (W.excursion && !I.script.busy) I.rodeurs.finir('issue');
      return { libre: I.scene === W && !!W.map && !I.script.busy && !W.lock && !W.excursion && q('#choice').hidden && q('#dialog').hidden && q('#card').hidden, choix: !q('#choice').hidden, lire: !q('#dialog').hidden || !q('#card').hidden || I.battle.active }; });
    if (e.libre) break; if (e.choix) await p.evaluate(() => { const o = document.querySelectorAll('#choice .opt:not(.locked)'); if (o.length) o[o.length - 1].click(); }); else if (e.lire) await p.keyboard.press('Enter'); await p.waitForTimeout(180); }
  await p.evaluate(() => { window.ISNAD.script.filVide(); }); await p.waitForTimeout(500);
}

/* ---------- les lignes du moteur qui passent par la boîte de dialogue, lues dans son code ----------
   ['nar', …], ['say', qui, …] et ['title', …] écrits dans un script du moteur, avec leurs I.t('…') ; et les verdicts de la
   Chaîne (verdict(I.T('…')), du balisage). Chaque littéral est une phrase entière (src/core/langue.js). */
function lignesDuCode() {
  const L = [], LIT = /\bI\.(?:t|T)\(\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")/g, lits = s => { const r = []; let m; LIT.lastIndex = 0; while ((m = LIT.exec(s))) r.push(vm.runInNewContext(m[1])); return r; };
  // la fin d'une expression (son crochet fermant), et ses éléments séparés par les virgules du premier niveau
  const elements = (code, i) => { const el = []; let prof = 0, q = null, d = i + 1;
    for (let k = i + 1; k < code.length; k++) { const c = code[k];
      if (q) { if (c === '\\') k++; else if (c === q) q = null; continue; }
      if (c === "'" || c === '"' || c === '`') q = c; else if ('([{'.includes(c)) prof++; else if (')]}'.includes(c)) { if (!prof) { el.push(code.slice(d, k)); return el; } prof--; } else if (c === ',' && !prof) { el.push(code.slice(d, k)); d = k + 1; } }
    return el; };
  fs.readdirSync(path.join(V2, 'src/core')).filter(f => /\.js$/.test(f)).forEach(f => {
    const code = fs.readFileSync(path.join(V2, 'src/core', f), 'utf8'), re = /\[\s*'(nar|say|title)'\s*,/g; let m;
    while ((m = re.exec(code))) { const el = elements(code, m.index); if (el.length < 2) continue;
      if (m[1] === 'title') { const a = lits(el[1]), b = el[2] ? lits(el[2]) : []; if (a.length) L.push({ carton: 'title', a: a[0], b: b[0] || null, ou: f }); continue; }
      const nom = m[1] === 'say' ? lits(el[1])[0] || null : null; lits(el[m[1] === 'say' ? 2 : 1] || '').forEach(fr => L.push({ kind: m[1], fr, nom, ou: f })); }
    const V = /\bverdict\(\s*I\.T\(\s*('(?:[^'\\\n]|\\.)*')/g; while ((m = V.exec(code))) L.push({ kind: 'nar', fr: vm.runInNewContext(m[1]), html: true, verdict: true, ou: f });
  });
  return L;
}

/* ---------- côté page : le contrôle d'un écran, d'une langue ---------- */
const CONTROLE = ({ LIGNES, liste, temoin }) => {
  const I = window.ISNAD, D = I.D, S = I.script, L = I.langue, G = I.gfx, $ = s => document.querySelector(s), B = document.body, tactile = B.classList.contains('touch');
  const box = $('#dialog'), tx = $('#dialog .text'), nx = $('#dialog .next'), st = $('#stage'), vh = innerHeight, vw = innerWidth, sr = st.getBoundingClientRect(), portrait = B.classList.contains('portrait');
  const ESP = /[\s\u00a0\u202f]/, CJK = /[\u3000-\u30ff\u3400-\u9fff\uff00-\uffef]/, LETTRE = /[\p{L}\p{M}\p{N}]/u;
  // la manette, telle qu'elle est posée (même effacée le temps d'une lecture, sa place compte)
  const PADS = B.classList.contains('manette') ? [...document.querySelectorAll('#pad .joy, #pad .a, #pad .b')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0) : [];
  const padHaut = PADS.length ? Math.min(...PADS.map(r => r.top)) : vh;
  const croise = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
  const fic = s => (s.commun ? 'coeur.js' : s.veillees ? 'caid.js' : s.frame ? 'frame.js' : 'saga_' + s.id + '.js');
  const sceau = G.sealURL('', '#c8b48a');
  // qui parle : un héros du récit, un personnage d'un de ses chapitres, un héros d'un autre récit, sinon le nom tel qu'il est écrit
  const nomDe = (s, who) => { if (typeof who !== 'string') return '…'; if (s.heroes && s.heroes[who]) return s.heroes[who].name;
    for (const ch of s.chapters || []) { const n = (ch.npcs || []).find(x => x.id === who); if (n) return n.name || (n.hero && s.heroes[n.hero] ? s.heroes[n.hero].name : who); }
    for (const s2 of Object.values(I.sagas)) if (s2.heroes && s2.heroes[who]) return s2.heroes[who].name; return who; };
  // le chapitre d'un texte (pour le retrouver), par l'objet où il est rangé
  const ou = new Map();
  /* 1. les textes */
  const T = [], C = [], Lg = [], vus = new Set(), OPS = { say: v => v.length >= 3 && typeof v[1] === 'string' && typeof v[2] === 'string', nar: v => typeof v[1] === 'string', legende: v => typeof v[1] === 'string', quote: v => typeof v[1] === 'string' && typeof v[2] === 'string', title: v => typeof v[1] === 'string', parley: v => !!v[1] && Array.isArray(v[1].rounds) };
  const dire = x => { const k = x.kind + '|' + x.nom + '|' + x.t; if (!x.t || vus.has(k)) return; vus.add(k); T.push(x); };
  const parcourir = (v, fn, vu, ch) => { if (!v || typeof v !== 'object' || vu.has(v)) return; vu.add(v);
    if (Array.isArray(v)) { if (typeof v[0] === 'string' && OPS[v[0]] && OPS[v[0]](v)) fn(v, ch); v.forEach(x => parcourir(x, fn, vu, ch)); }
    else Object.keys(v).forEach(k => parcourir(v[k], fn, vu, v.objectives && v.id ? v.id : ch)); };
  Object.values(I.sagas).forEach(s => {
    const f = fic(s), nar = s.narrator || I.t('La Chaîne');
    parcourir(s, (op, ch) => { const lieu = s.id + (ch ? '/' + ch : '');
      if (op[0] === 'say') dire({ kind: 'say', nom: nomDe(s, op[1]), t: op[2], src: [op, 2], fic: f, lieu });
      else if (op[0] === 'nar') dire({ kind: 'nar', nom: nar, t: op[1], src: [op, 1], fic: f, lieu });
      else if (op[0] === 'legende') { if (!Lg.some(y => y.t === op[1])) Lg.push({ t: op[1], src: [op, 1], fic: f, lieu }); }   // (2.49 : dans le fil, partie 4)
      else if (op[0] === 'quote' || op[0] === 'title') C.push({ cls: op[0], html: () => S.carton(op), fic: f, lieu, t: op[1] });
      else if (op[0] === 'parley') { const P = op[1], qui = nomDe(s, P.with);
        C.push({ cls: 'title parley', html: () => S.cartonPourparler(P, true), fic: f, lieu, t: P.title || '' });
        P.rounds.forEach(R => { if (typeof R.say === 'string') dire({ kind: 'say', nom: qui, t: R.say, src: [R, 'say'], fic: f, lieu });
          (R.opts || []).forEach(o => { if (typeof o.r === 'string') dire({ kind: 'say', nom: qui, t: o.r, src: [o, 'r'], fic: f, lieu }); });
          const N = R.noir; if (N) { if (typeof N.after === 'string') dire({ kind: 'say', nom: qui, t: N.after, src: [N, 'after'], fic: f, lieu }); if (N.name && N.intro && N.group) C.push({ cls: 'title parley noir', html: () => I.mal.carton(N, s), fic: f, lieu, t: N.name }); } }); } }, new Set(), null);
    // ce que dit une idée noire, et ce que l'on entend quand on lui répond (mal.js) : elle parle par la bouche de qui la porte
    Object.keys(s.enemies || {}).forEach(id => { const X = s.enemies[id].parole; if (!X) return; const lieu = s.id + '/' + id;
      (X.dit || []).forEach((t, k) => dire({ kind: 'say', nom: s.enemies[id].name, t, src: [X.dit, k], fic: f, lieu }));
      (X.oui || []).forEach((t, k) => dire({ kind: 'nar', nom: nar, t, src: [X.oui, k], fic: f, lieu }));
      Object.keys(X.non || {}).forEach(k => dire({ kind: 'nar', nom: nar, t: X.non[k], src: [X.non, k], fic: f, lieu })); });
  });
  /* les lignes que le moteur dit dans les quartiers de la Cité (cite.js et, depuis la 2.27, circuit.js), rangées dans la table
     `cite` de l'histoire-cadre : la pensée d'Idris, Maître Yûnus, Sâlim et l'organisateur ; et la leçon des virages, que
     Sâlim dit dans la boîte de dialogue. Les questions et les réponses d'un menu n'y passent pas. */
  const cadre = Object.values(I.sagas).find(s => s.frame && s.cite);
  if (cadre) {
    const X = cadre.cite, K = X.course || {}, f = fic(cadre), nar = cadre.narrator || I.t('La Chaîne');
    const lignes = (qui, o, k, lieu) => { const v = o && o[k];
      if (typeof v === 'string') dire({ kind: qui ? 'say' : 'nar', nom: qui ? nomDe(cadre, qui) : nar, t: v, src: [o, k], fic: f, lieu: 'cite/' + lieu });
      else if (Array.isArray(v)) v.forEach((t, i) => lignes(qui, v, i, lieu + '/' + i)); };
    lignes(null, X, 'rappels', 'rappels'); lignes('yunus', X, 'yunus', 'yunus');
    if (K.arrivee) { lignes('salim', K.arrivee, 'salim', 'course/arrivee'); lignes('idris', K.arrivee, 'idris', 'course/arrivee'); }
    ['refus', 'revoir', 'plusTard', 'depart', 'descendu', 'fins', 'apres', 'salim'].forEach(k => lignes('salim', K, k, 'course/' + k));
    if (K.organisateur) ['avant', 'accueil'].forEach(k => lignes('q_organisateur', K.organisateur, k, 'course/organisateur/' + k));
    const V = ((I.sagas.coeur || {}).lecons || {}).virages;
    if (V && typeof V === 'object') ['clavier', 'doigt'].forEach(k => lignes('salim', V, k, 'lecons/virages'));
    // 2.28 (D217) : les activités des quartiers (activites.js) — le premier refus, l'étal, un record à la borne, la pensée d'Idris
    // devant l'écran, en haut de la grande roue, après un tour de manège : des narrations, dans la boîte de dialogue
    const A = X.activites || {};
    ['manque', 'etal', 'record', 'ecran', 'roue'].forEach(k => lignes(null, A, k, 'activites/' + k));
    ['chaises', 'tasses'].forEach(k => lignes(null, A.maneges || {}, k, 'activites/maneges/' + k));
  }
  // les lignes du moteur : leurs champs reçoivent un nom de longueur ordinaire
  const champs = new Proxy({}, { get: (o, k) => (k === 'n' ? 2 : 'Khâlid ibn al-Walîd') });
  LIGNES.forEach(x => { if (x.carton) { const a = I.t(x.a, champs), b = x.b ? I.t(x.b, champs) : null; C.push({ cls: 'title', html: () => S.carton(['title', a, b]), fic: x.ou, lieu: 'moteur', t: a }); return; }
    const t = I.t(x.fr, champs), t2 = L.l2() ? L.tDans(L.l2(), x.fr, champs) : null;
    dire({ kind: x.kind, nom: x.nom ? I.t(x.nom) : I.t('La Chaîne'), t, html: !!x.html, t2fixe: t2, fr: x.fr, fic: x.ou, lieu: 'moteur' }); });
  // les cartons du contenu commun : chaque attribut et son verset, le secours et le sien
  const coeur = I.sagas.coeur || {};
  Object.keys(coeur.attributs || {}).forEach(v => C.push({ cls: 'pray attribut', html: () => I.valeurs.carton(v), fic: 'coeur.js', lieu: 'attributs/' + v, t: coeur.attributs[v].nom }));
  if (coeur.secours && coeur.secours.verset) C.push({ cls: 'pray secours', html: () => I.battle.cartonSecours(coeur.secours), fic: 'coeur.js', lieu: 'secours', t: coeur.secours.titre || '' });

  // le témoin : la mise en pages débranchée (chaque texte en une page, à sa taille), comme avant la 2.24 — il doit déborder
  const vrai = S.pages; if (temoin) S.pages = (k, sp, t, o) => { const R = vrai(k, sp, t, o); box.style.removeProperty('--kd'); box.style.minHeight = ''; return { pages: [t], k: 1, max: R.max, coupes: [] }; };
  /* 2. chaque texte, page par page */
  // ce que le joueur lit, signe par signe, avec ce qui l'enveloppe (l'italique, le gras) ; les espaces fondues en une
  const trace = html => { const d = document.createElement('div'); d.innerHTML = html; const r = [], w = document.createTreeWalker(d, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const tg = []; for (let e = n.parentNode; e && e !== d; e = e.parentNode) tg.push(e.nodeName); for (const ch of n.data) { if (ESP.test(ch)) { if (r.length && r[r.length - 1] !== ' ') r.push(' '); } else r.push(ch + '\u0001' + tg.join('/')); } }
    while (r[0] === ' ') r.shift(); while (r[r.length - 1] === ' ') r.pop(); return r; };
  const res = { textes: 0, plusieurs: 0, maxPages: 1, resserres: 0, fautes: [], liste: [], l2: { bulles: 0, defile: 0, sousManette: 0, minPolice2: 99 }, minPolice: 99, cartons: 0, cartonsResserres: 0, cartonsMin: 99, plusLong: null };
  const faute = (x, quoi) => res.fautes.push({ fic: x.fic, lieu: x.lieu, debut: String(x.t).replace(/<[^>]*>/g, '').slice(0, 70), quoi });
  for (const x of T) {
    const html = !!x.html, rendu = p => (html ? p : I.fmt(p)), sp = x.kind === 'say' ? { name: x.nom, seal: sceau, color: '#c8b48a', fig: null } : null;
    const t2 = L.l2() ? (x.t2fixe !== undefined ? x.t2fixe : L.second(x.t, x.src[0], x.src[1])) : null;
    const R = S.pages(x.kind, sp, x.t, { nom: sp ? undefined : x.nom, html }, t2); res.textes++;
    const n = R.pages.length; if (n > 1) res.plusieurs++; if (n > res.maxPages) res.maxPages = n; if (R.k < 1) res.resserres++;
    if (n > 1 || R.k < 1) { const fr = x.fr || L.origine(x.src[0], x.src[1]) || L.source(x.t) || x.t; res.liste.push({ fic: x.fic, lieu: x.lieu, cle: L.cle(fr), pages: n, k: R.k, signes: x.t.length, debut: String(x.t).replace(/<[^>]*>/g, '').slice(0, 90) }); }
    if (!res.plusLong || n > res.plusLong.pages || (n === res.plusLong.pages && x.t.length > res.plusLong.signes)) res.plusLong = { pages: n, signes: x.t.length, kind: x.kind, nom: x.nom, fic: x.fic, lieu: x.lieu, debut: x.t.slice(0, 60) };
    R.pages.forEach((pg, i) => {
      const fin = i === n - 1; tx.innerHTML = rendu(pg); nx.textContent = fin ? '▼' : '▸'; nx.style.visibility = 'visible'; S.recaler();
      const b = box.getBoundingClientRect(), f = parseFloat(getComputedStyle(tx).fontSize); res.minPolice = Math.min(res.minPolice, f);
      const ici = q => faute(x, `page ${i + 1}/${n} : ${q}`);
      if (portrait) { if (b.top < sr.bottom - 1) ici('sur l’image'); if (b.bottom > padHaut + 0.5) ici(`sous la manette (bas ${Math.round(b.bottom)}, manette ${Math.round(padHaut)})`); if (b.bottom > vh + 0.5) ici('sous le bas de l’écran'); }
      else { if (b.height > sr.height * S.HAUT_MAX + 1) ici(`plus haute que la zone (${Math.round(b.height)} sur ${Math.round(sr.height * S.HAUT_MAX)})`); if (b.top < Math.max(0, sr.top) - 1 || b.bottom > Math.min(vh, sr.bottom) + 1) ici('hors de la scène'); if (PADS.some(r => croise(b, r))) ici('sous la manette'); }
      if (b.left < -0.5 || b.right > vw + 0.5) ici('hors de l’écran, de côté');
      // (le texte tel qu'il s'écrit, ses glyphes compris : l'arabe et ses signes dépassent un peu sa ligne, sans sortir de la boîte)
      { const g = document.createRange(); g.selectNodeContents(tx); const q = g.getBoundingClientRect(); if (tx.classList.contains('defile') || (q.height && (q.top < b.top - 0.5 || q.bottom > b.bottom + 0.5 || q.left < b.left - 0.5 || q.right > b.right + 0.5))) ici('le texte sort de la boîte'); }
      if (tactile && f < 9.95) ici(`police de ${f.toFixed(1)} points`);
      if (!html && ((pg.match(/\*/g) || []).length % 2)) ici('italique ouvert');
      if (!html && tx.textContent.includes('*')) ici('un astérisque se lit');
      if (fin && t2) { S.montrer2(x.kind, t2, html); const d2 = $('#dialog2'), r2 = d2.getBoundingClientRect(), f2 = parseFloat(getComputedStyle(d2.querySelector('.text')).fontSize); res.l2.bulles++; res.l2.minPolice2 = Math.min(res.l2.minPolice2, f2);
        if (r2.top < -0.5 || r2.bottom > vh + 0.5) ici('la seconde bulle sort de l’écran'); if (croise(r2, b)) ici('la seconde bulle couvre la boîte');
        if (tactile && f2 < 9.95) ici(`seconde bulle à ${f2.toFixed(1)} points`); if (d2.scrollHeight > d2.clientHeight + 2) { if (d2.classList.contains('defile')) res.l2.defile++; else ici('la seconde bulle est coupée'); }
        if (PADS.some(r => croise(r2, r))) res.l2.sousManette++;
        d2.hidden = true; B.classList.remove('avec2'); }
    });
    // aucun mot coupé entre deux pages, et les pages bout à bout redonnent le texte
    R.coupes.forEach(c => { const a = x.t[c - 1] || '', z = x.t[c] || ''; if (LETTRE.test(a) && LETTRE.test(z) && !(CJK.test(a) && CJK.test(z))) faute(x, `un mot coupé : « ${x.t.slice(Math.max(0, c - 14), c)}|${x.t.slice(c, c + 14)} »`); });
    // (entre deux pages, l'espace du texte s'il y en avait une ; en japonais, aucune)
    if (n > 1) { const avant = trace(rendu(x.t)).join('\u0002'), apres = R.pages.map((pg, i) => (i && ESP.test(x.t[R.coupes[i - 1] - 1] || '') ? ' \u0002' : '') + trace(rendu(pg)).join('\u0002')).join('\u0002'); if (avant !== apres) faute(x, 'les pages ne redonnent pas le texte'); }
  }
  S.hideDialog(); tx.innerHTML = ''; box.style.removeProperty('--kd'); box.style.minHeight = '';

  /* 3. les cartons */
  const card = $('#card');
  for (const y of C) {
    card.className = y.cls; card.innerHTML = y.html(); card.hidden = false; B.classList.add('en-carton'); if (L.l2() && card.querySelector('.l2')) card.classList.add('avec2');
    S.tenirCarton(card); res.cartons++;
    const k = parseFloat(card.style.getPropertyValue('--k2')) || 1; if (k < 1) res.cartonsResserres++;
    // ce que le carton montre : l'étendue de ses blocs, qui doit rester dans le carton (et l'écran), hors de la manette
    const r = card.getBoundingClientRect(), rs = [...card.children].map(e => e.getBoundingClientRect()).filter(q => q.height > 0), contenu = rs.length ? { left: Math.min(...rs.map(q => q.left)), right: Math.max(...rs.map(q => q.right)), top: Math.min(...rs.map(q => q.top)), bottom: Math.max(...rs.map(q => q.bottom)) } : { left: 0, right: 0, top: 0, bottom: 0 };
    const textes = [...card.querySelectorAll('*')].filter(e => [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())), mini = Math.min(...textes.map(e => parseFloat(getComputedStyle(e).fontSize))); res.cartonsMin = Math.min(res.cartonsMin, mini);
    const ici = q => faute({ fic: y.fic, lieu: y.lieu, t: 'carton ' + y.cls + ' : ' + y.t }, q);
    if (card.classList.contains('defile') || contenu.top < Math.max(0, r.top) - 0.5 || contenu.bottom > Math.min(vh, r.bottom) + 0.5) ici('le carton ne tient pas dans l’écran');
    if (tactile && mini < 9.95) ici(`une police de ${mini.toFixed(1)} points`);
    if (PADS.some(p => croise(contenu, p))) ici('le carton est sous la manette');
    card.hidden = true; card.className = ''; card.innerHTML = ''; card.style.removeProperty('--k2'); B.classList.remove('en-carton');
  }

  /* 4. les légendes (2.49, D242) : une narration d'arrivée posée dans le fil des annonces, pendant qu'on marche — entière dans
     l'écran, hors de la manette (en hauteur, au-dessus de sa bande ; en largeur, entre ses zones), sa seconde langue comprise,
     jamais coupée, jamais sous dix points au doigt */
  res.legendes = 0; res.legendesMin = 99; res.legendesHaut = 0; res.legendesPages = 1; res.legendesEnPages = 0;
  const fil = $('#toasts');
  for (const y of Lg) {
    // (2.49 : une légende qui ne tient pas se partage en pages, qui passent l'une après l'autre — S.legende, comme le jeu)
    S.filVide(); const t2 = L.l2() ? L.second(y.t, y.src[0], y.src[1]) : null, P = S.pagesLegende(y.t, t2), els = S.legende(y.t, t2);
    const ici = q => faute({ fic: y.fic, lieu: y.lieu, t: 'légende : ' + y.t }, q);
    res.legendes++; res.legendesPages = Math.max(res.legendesPages, els.length); if (els.length > 1) res.legendesEnPages++;
    if (els.length !== P.length) ici(`${els.length} ligne(s) posée(s) pour ${P.length} page(s)`);
    els.forEach((el, i) => {
      const pg = els.length > 1 ? `page ${i + 1}/${els.length} : ` : '';
      [...fil.children].forEach(e => { e.hidden = e !== el; }); fil.dir = el.dir; fil.classList.add('recit', 'montre'); fil.classList.remove('lecon', 'evite'); if (I.ui.padEvite) I.ui.padEvite();
      const r = fil.getBoundingClientRect(), polices = [el, ...el.querySelectorAll('*')].filter(e => [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)), mini = Math.min(...polices);
      res.legendesMin = Math.min(res.legendesMin, mini); res.legendesHaut = Math.max(res.legendesHaut, Math.round(r.height));
      if (r.top < -0.5 || r.bottom > vh + 0.5 || r.left < -0.5 || r.right > vw + 0.5) ici(`${pg}la légende sort de l’écran (${Math.round(r.left)}, ${Math.round(r.top)} → ${Math.round(r.right)}, ${Math.round(r.bottom)})`);
      if (portrait && r.bottom > padHaut + 0.5) ici(`${pg}la légende descend sous la manette (bas ${Math.round(r.bottom)}, manette ${Math.round(padHaut)})`);
      if (!portrait && PADS.some(p => croise(r, p))) ici(`${pg}la légende est sous la manette`);
      if (fil.scrollHeight > fil.clientHeight + 2 || el.scrollHeight > el.clientHeight + 2) ici(`${pg}la légende est coupée`);
      if (tactile && mini < 9.95) ici(`${pg}une police de ${mini.toFixed(1)} points`);
      if (el.textContent.includes('*')) ici(`${pg}un astérisque se lit`);
    });
    // les pages bout à bout redonnent le texte, et sa langue secondaire (une espace entre deux pages : aucun mot n'y est coupé)
    if (P.length > 1) {
      const t1 = P.filter(p => p.t).map(p => p.t), l2s = P.filter(p => p.l2).map(p => p.l2);
      if (trace(I.fmt(y.t)).join('\u0002') !== t1.map(p => trace(I.fmt(p)).join('\u0002')).join('\u0002 \u0002')) ici('les pages ne redonnent pas le texte');
      if (t2 && trace(I.fmt(t2)).join('\u0002') !== l2s.map(p => trace(p).join('\u0002')).join('\u0002 \u0002')) ici('les pages ne redonnent pas la langue secondaire');
    }
  }
  S.filVide();
  S.pages = vrai; if (!liste) res.liste = res.liste.length;
  return res;
};

async function controle(args) {
  const LANGUES = args.filter(a => /^(fr|ar|arv|en)$/.test(a)), ECRANS = args.filter(a => /^\d+x\d+$/.test(a)), seul2 = args.includes('fr-ar'), sans2 = args.includes('sans2');
  if (!LANGUES.length) LANGUES.push('fr', 'ar', 'arv', 'en');   // (2.36, D230 : le japonais est retiré du jeu)
  if (!ECRANS.length) ECRANS.push('390x844', '844x390', '360x640', '1280x720');
  const passes = []; if (!seul2) LANGUES.forEach(l => ECRANS.forEach(e => passes.push({ l, e }))); if (!sans2) ECRANS.forEach(e => passes.push({ l: 'fr', e, l2: 'ar' }));
  // (2.39) un contrôle qui ne mesure rien n'est pas conforme : de la 2.36 à la 2.38, un commentaire avalait la liste des écrans
  if (!passes.length) { console.log('✗ LONGUEURS : aucune passe à jouer (ni langue, ni écran) — rien n’a été mesuré'); process.exit(1); }
  const LIGNES = lignesDuCode(), browser = await chromium.launch(), rapport = {}; let deborde = 0, erreurs = 0;
  for (const P of passes) {
    const [w, h] = P.e.split('x').map(Number), nom = P.l + (P.l2 ? '-' + P.l2 : '') + ' ' + P.e, t0 = Date.now();
    const p = await ouvrirJeu(browser, P.l, { width: w, height: h }, P.l2); await chapitre(p);
    const r = await p.evaluate(CONTROLE, { LIGNES, liste: true }); rapport[nom] = r;
    const libre = r.l2.bulles ? ` ; ${r.l2.bulles} secondes bulles (${r.l2.defile} défilent, ${r.l2.sousManette} gagnent la bande de la manette, qui s'efface le temps de les lire ; police ${r.l2.minPolice2.toFixed(1)} points au moins)` : '';
    console.log(`${nom} · ${r.textes} textes : ${r.plusieurs} en plusieurs pages (au plus ${r.maxPages}), ${r.resserres} resserrés ; police ${r.minPolice.toFixed(1)} points au moins${libre} · ${r.cartons} cartons, ${r.cartonsResserres} resserrés (police ${r.cartonsMin.toFixed(1)} points au moins) · ${r.legendes} légendes dans le fil (${r.legendesEnPages} en pages, au plus ${r.legendesPages} ; ${r.legendesHaut} px de haut au plus, police ${r.legendesMin.toFixed(1)} points au moins) · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    r.fautes.slice(0, 12).forEach(f => console.log(`  DÉBORDE ${nom} · ${f.fic} ${f.lieu} — ${f.quoi} — « ${f.debut}… »`)); if (r.fautes.length > 12) console.log(`  DÉBORDE ${nom} · … et ${r.fautes.length - 12} autres (pages.json)`);
    deborde += r.fautes.length;
    if (!r.legendes) { deborde++; console.log(`  DÉBORDE ${nom} · aucune légende mesurée dans le fil : le contrôle ne les trouve plus`); }
    if (p.__errs.length) { erreurs += p.__errs.length; console.log('  ERREUR console : ' + [...new Set(p.__errs)].slice(0, 3).join(' | ')); }
    await p.context().close();
  }
  // le témoin : sur le petit téléphone, la mise en pages débranchée doit faire déborder des textes (sinon, le contrôle ne voit rien)
  let muet = false;
  { const p = await ouvrirJeu(browser, 'fr', { width: 360, height: 640 }); await chapitre(p); const r = await p.evaluate(CONTROLE, { LIGNES, liste: false, temoin: true });
    muet = !r.fautes.length; console.log(`témoin (fr 360x640, sans pages ni resserrement) : ${r.fautes.length} débord(s) relevé(s)${muet ? ' — TÉMOIN MUET : le contrôle ne voit pas un texte qui déborde' : ', comme il se doit'}`); await p.context().close(); }
  await browser.close();
  fs.writeFileSync(path.join(out, 'pages.json'), JSON.stringify(rapport, null, 1));
  // pour le décideur : les textes français qui demandent plus d'une page (en hauteur, sur 390 × 844 et sur le petit téléphone)
  const listes = [];
  [['390x844', 'pages-fr-390x844.txt'], ['360x640', 'pages-fr-360x640.txt']].forEach(([e, f]) => { const r = rapport['fr ' + e]; if (!r) return;
    const L = r.liste.filter(x => x.pages > 1).sort((a, b) => b.pages - a.pages || b.signes - a.signes);
    fs.writeFileSync(path.join(out, f), `# ISNAD 2.24 · textes français qui demandent plus d'une page dans la boîte de dialogue, téléphone tenu en hauteur (${e}), texte « grand »\n# ${L.length} texte(s) — fichier · lieu (récit/chapitre) · clé · pages · signes · début du texte\n` + L.map(x => [x.fic, x.lieu, x.cle, x.pages + ' pages', x.signes + ' signes', x.debut].join('\t')).join('\n') + '\n');
    listes.push(`${path.relative(path.join(V2, '..'), path.join(out, f))} (${L.length})`); });
  const plus = Object.keys(rapport).filter(k => / 390x844$/.test(k)).map(k => `${k.split(' ')[0]} ${rapport[k].plusieurs}`).join(', ');
  if (plus) console.log(`en plusieurs pages, en hauteur sur 390 × 844 : ${plus}`);
  if (listes.length) console.log('listes pour le décideur : ' + listes.join(', '));
  if (deborde || erreurs || muet) { console.log(`✗ DÉBORDE — ${deborde} page(s) ou carton(s) hors de leur place${erreurs ? `, ${erreurs} erreur(s) console` : ''}${muet ? ', le témoin muet' : ''} (détail : ${path.relative(path.join(V2, '..'), path.join(out, 'pages.json'))})`); process.exit(1); }
  console.log(`✓ LONGUEURS CONFORMES — ${passes.length} passes, chaque page et chaque carton entiers dans leur place (détail : ${path.relative(path.join(V2, '..'), path.join(out, 'pages.json'))})`);
}

/* ---------- le relevé de la 2.12 (releve) ---------- */
/* ---------- les annonces et les marques du moteur, lues dans son code : chaque I.t('…') d'un S.toast(…) ou d'un S.marque(…) ---------- */
function annoncesDuCode() {
  const L = new Map(), lit = /\bI\.t\(\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")/g;
  fs.readdirSync(path.join(V2, 'src/core')).filter(f => /\.js$/.test(f)).forEach(f => {
    const code = fs.readFileSync(path.join(V2, 'src/core', f), 'utf8'), ouvre = /\b(?:S|I\.script|script)\.(toast|marque)\(/g; let m;
    while ((m = ouvre.exec(code))) { let i = m.index + m[0].length, prof = 1, q = null;   // l'argument entier, jusqu'à la parenthèse qui le ferme
      for (; i < code.length && prof; i++) { const c = code[i]; if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; } if (c === "'" || c === '"' || c === '`') q = c; else if (c === '(') prof++; else if (c === ')') prof--; }
      const arg = code.slice(m.index + m[0].length, i - 1); let t; lit.lastIndex = 0;
      while ((t = lit.exec(arg))) { const fr = vm.runInNewContext(t[1]); if (/\p{L}/u.test(fr) && !L.has(fr)) L.set(fr, { ou: f, sorte: m[1] === 'marque' ? 'marque' : 'annonce' }); } }
  });
  return [...L].map(([fr, o]) => Object.assign({ fr }, o));
}

// côté page : mesurer un texte dans une boîte du jeu (ses lignes, au rendu), compter ses phrases
const PAGE = () => {
  // les lignes d'un texte posé en bloc dans sa boîte : sa hauteur, en hauteurs de ligne
  window.__lignes = el => { const d = el.style.display; if (getComputedStyle(el).display === 'inline') el.style.display = 'block'; const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.35, n = el.textContent.trim() ? Math.max(1, Math.round(el.getBoundingClientRect().height / lh)) : 0; el.style.display = d; return n; };
  window.__phrases = t => String(t).replace(/<[^>]+>/g, '').replace(/\*/g, '').split(/(?<=[.!?…。！？؟])\s*/).map(x => x.trim()).filter(x => /[\p{L}]/u.test(x)).length;
};

async function releve(LANGUES) {
  const browser = await chromium.launch(), rapport = { annonces: {}, menus: {}, recits: {} }, ANN = annoncesDuCode(); let reprendre = 0;
  const ouvrir = async (l, vp) => { const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(URL + (l === 'fr' ? '' : '?lang=' + l)); await p.waitForTimeout(2000); await p.evaluate(PAGE); p.__errs = errs; return p; };
  // le chapitre 3 de Khâlid, posé comme le fait loupe.js : l'IA de test un quart de seconde, puis on passe à la main ce qui
  // reste à lire, jusqu'à ce que le joueur ait la main dans le lieu (la mesure se fait dans la mise en page de l'exploration)
  const chapitre = async p => { await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('khalid', 2); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
    await p.waitForTimeout(1800);
    for (let i = 0; i < 160; i++) { const e = await p.evaluate(() => { const I = window.ISNAD, W = I.world, q = s => document.querySelector(s); if (W.excursion && !I.script.busy) I.rodeurs.finir('issue');
        return { libre: I.scene === W && !!W.map && !I.script.busy && !W.lock && !W.excursion && q('#choice').hidden && q('#dialog').hidden && q('#card').hidden, choix: !q('#choice').hidden, lire: !q('#dialog').hidden || !q('#card').hidden || I.battle.active }; });
      if (e.libre) break; if (e.choix) await p.evaluate(() => { const o = document.querySelectorAll('#choice .opt:not(.locked)'); if (o.length) o[o.length - 1].click(); }); else if (e.lire) await p.keyboard.press('Enter'); await p.waitForTimeout(180); }
    await p.evaluate(() => { window.ISNAD.script.filVide(); }); await p.waitForTimeout(500); };

  /* 1 et 3 — les textes de l'interface dans le fil ; les répliques et narrations dans la boîte de dialogue (390 × 844) */
  for (const l of LANGUES) {
    const p = await ouvrir(l, { width: 390, height: 844 }); await chapitre(p);
    const r = await p.evaluate(ANN => {
      const I = window.ISNAD, L = I.langue, D = I.D, $ = s => document.querySelector(s), C = I.sagas.coeur || {}, tactile = document.body.classList.contains('touch');
      const ex = { titre: (I.ui.codexEntry('khalid/pacte_damas') || {}).title || 'Damas', nom: I.sagas.khalid.heroes.khalid.name, piece: (D.GEAR[Object.keys(D.GEAR)[0]] || {}).name || '', img: '', n: 2, v: 2, gain: 1, route: D.MAPS.damas ? D.MAPS.damas.label : 'Damas', dons: '3', mise: 5, message: '…', emplacement: '', conf: 3, but: 4, signe: '', quete: '', poids: 2, provision: 3 };
      const textes = ANN.map(a => ({ fr: a.fr, sorte: a.sorte, ou: a.ou, html: (() => { const t = L.de(a.fr); return { ecrit: L.lang === 'fr' || t !== a.fr, t: I.t(a.fr, ex) }; })() }));
      // les leçons (coeur.js), au doigt ; la figure qui s'ouvre ; les consignes du labyrinthe
      Object.keys(C.lecons || {}).forEach(k => { const t = C.lecons[k], s = typeof t === 'string' ? t : (tactile ? t.doigt : t.clavier); if (s) textes.push({ fr: L.fr(s), sorte: 'leçon', ou: 'coeur.js lecons.' + k, html: { ecrit: true, t: I.fmt(s) } }); });
      if (C.postures && C.postures.ouverte) textes.push({ fr: L.fr(C.postures.ouverte), sorte: 'leçon', ou: 'coeur.js postures.ouverte', html: { ecrit: true, t: I.fmt(C.postures.ouverte.replace('%s', ex.nom)) } });
      const P = C.portes || {}; ['regle', 'rode', 'sonne', 'aLAbri', 'dissipee', 'face', 'pasDeHalte', 'sansSonge', 'deja'].forEach(k => { if (P[k]) textes.push({ fr: L.fr(P[k]), sorte: k === 'rode' ? 'leçon' : 'consigne', ou: 'coeur.js portes.' + k, html: { ecrit: true, t: I.esc(P[k].replace('%s', ex.nom)) } }); });
      // le fil lui-même : une ligne de mesure, posée dedans (le fil se tait : rien d'autre n'y parle pendant la mesure)
      const fil = $('#toasts'), m = I.el('div', 'toast'); fil.appendChild(m);
      const res = textes.map(x => { m.innerHTML = x.html.t; m.dir = L.sens(m.textContent); return { fr: x.fr, sorte: x.sorte, ou: x.ou, ecrit: x.html.ecrit, texte: m.textContent.trim(), signes: m.textContent.trim().length, lignes: window.__lignes(m), phrases: window.__phrases(x.html.t) }; });
      m.remove();
      const largeur = Math.round(fil.clientWidth), police = getComputedStyle(fil).fontSize;
      // les récits : chaque réplique et chaque narration, dans la boîte de dialogue
      const dlg = $('#dialog'), tx = $('#dialog .text'), longs = [], vus = new Set();
      dlg.hidden = false; dlg.className = 'say avecfig'; $('#dialog .seal').hidden = false; $('#dialog .fig').hidden = false;
      const mesure = (sorte, t, ou) => { if (!t || vus.has(sorte + t)) return; vus.add(sorte + t); dlg.className = sorte === 'narration' ? 'nar' : 'say avecfig'; tx.innerHTML = I.fmt(t); tx.dir = L.sens(t); const n = window.__lignes(tx); if (n > 6) longs.push({ sorte, ou, lignes: n, signes: t.length, debut: t.slice(0, 70) }); };
      Object.values(I.sagas).forEach(s => (s.chapters || []).forEach(ch => { const op = o => { if (o[0] === 'say') mesure('réplique', o[2], s.id + '/' + ch.id); else if (o[0] === 'nar') mesure('narration', o[1], s.id + '/' + ch.id); };
        D.parcours(ch.intro, op); D.parcours(ch.outro, op); (ch.objectives || []).forEach(x => D.parcours(x.then, op)); (ch.npcs || []).forEach(n => D.parcours(n.talk, op)); }));
      dlg.hidden = true; tx.innerHTML = ''; document.body.classList.remove('in-dialog');
      return { largeur, police, res, longs: longs.sort((a, b) => b.lignes - a.lignes) };
    }, ANN);
    rapport.annonces[l] = r;
    const faux = r.res.filter(x => (x.sorte === 'leçon' ? x.phrases > 1 : false) || (x.sorte !== 'leçon' && x.lignes > 1));
    console.log(`${l} · le fil, 390 × 844 (${r.largeur} points de texte, ${r.police}) : ${r.res.length} textes de l'interface — ${r.res.filter(x => x.lignes <= 1).length} sur une ligne, ${r.res.filter(x => x.lignes > 1).length} sur deux lignes ou plus${r.res.some(x => !x.ecrit) ? ` (${r.res.filter(x => !x.ecrit).length} encore en français)` : ''}`);
    faux.forEach(x => { reprendre++; console.log(`  À REPRENDRE ${l} · ${x.sorte} (${x.ou}) : ${x.sorte === 'leçon' && x.phrases > 1 ? x.phrases + ' phrases' : ''}${x.sorte === 'leçon' && x.phrases > 1 && x.lignes > 1 ? ', ' : ''}${x.lignes > 1 ? x.lignes + ' lignes' : ''} — « ${x.texte.slice(0, 90)}${x.texte.length > 90 ? '…' : ''} »`); });
    console.log(`  récits : ${r.longs.length} réplique(s) ou narration(s) de plus de six lignes dans la boîte de dialogue — à signaler au décideur, jamais raccourcies${r.longs.length ? ' ; la plus longue : ' + r.longs[0].lignes + ' lignes (' + r.longs[0].ou + ', « ' + r.longs[0].debut + '… »)' : ''}`);
    if (p.__errs.length) console.log('  erreurs : ' + [...new Set(p.__errs)].slice(0, 3).join(' | '));
    await p.context().close();
  }

  /* 2 — les deux menus, ouverts par le vrai récit */
  for (const [nom, vp] of [['390x844', { width: 390, height: 844 }], ['360x560', { width: 360, height: 560 }]]) for (const l of LANGUES) {
    const p = await ouvrir(l, vp); await chapitre(p);
    await p.evaluate(() => { const I = window.ISNAD, D = I.D; let op = null; I.sagas.khalid.chapters.forEach(ch => (ch.objectives || []).forEach(x => D.parcours(x.then, o => { if (o[0] === 'parley' && !op && (o[1].rounds || []).some(r => r.noir)) op = o; }))); I.script.flags._prayed = false; I.script.run([op]); });
    const vu = {};
    for (let i = 0; i < 200 && !(vu.noir && vu.liste); i++) {
      const e = await p.evaluate(() => { const q = s => document.querySelector(s), c = q('#choice'), d = q('#dialog'), k = q('#card');
        return { carton: !k.hidden && k.classList.contains('on'), dialogue: !d.hidden && q('#dialog .next').style.visibility === 'visible', choix: !c.hidden && !!c.querySelector('.opt') ? (c.querySelector('.seal.idee') ? 'noir' : 'liste') : '' }; });
      if (e.choix && !vu[e.choix]) { await p.waitForTimeout(500);
        // une réponse compte entière quand son texte finit au-dessus du repère (ou du bas de la boîte)
        vu[e.choix] = await p.evaluate(() => { const box = document.querySelector('#choice'), r = box.getBoundingClientRect(), bas = Math.min(r.bottom, innerHeight), opts = [...box.querySelectorAll('.opt')], rep = box.querySelector('.repere');
          return { monde: window.ISNAD.scene === window.ISNAD.world, haut: Math.round(r.top), bas: Math.round(r.bottom), libre: Math.round(innerHeight - r.bottom), defile: box.scrollHeight - box.clientHeight, police: box.style.fontSize || '1em', reponses: opts.length,
            entieres: opts.filter(o => { const g = document.createRange(); g.selectNodeContents(o); const q = g.getBoundingClientRect(); return q.top >= r.top - 1 && q.bottom <= (rep && !rep.classList.contains('fin') ? Math.min(bas, rep.getBoundingClientRect().top) : bas) + 2; }).length, repere: rep && !rep.classList.contains('fin') ? rep.textContent : '' }; });
        await p.screenshot({ path: path.join(out, `${nom}-${l}-${e.choix}.png`) }); }
      if (e.carton || e.dialogue) await p.keyboard.press('Enter'); else if (e.choix) await p.keyboard.press('Enter');
      await p.waitForTimeout(e.choix ? 450 : 220);
    }
    (rapport.menus[nom] = rapport.menus[nom] || {})[l] = vu;
    const dit = (quoi, m) => !m ? `${quoi} : non atteint` : `${quoi} : ${m.entieres}/${m.reponses} réponses entières, ${m.defile > 2 ? `la liste défile (${m.repere || 'repère absent'})` : `tient, ${m.libre} points libres dessous`}${m.police !== '1em' ? `, resserrée à ${m.police}` : ''}${m.monde ? '' : ' (mesure hors du lieu : à refaire)'}`;
    console.log(`${nom} ${l} · ${dit('idée noire', vu.noir)} · ${dit('pourparler', vu.liste)}`);
    if (nom === '390x844' && vu.noir && vu.noir.defile > 2 && !vu.noir.repere) { reprendre++; console.log(`  À REPRENDRE ${l} · le menu d'une idée noire déborde en 390 × 844 sans son repère`); }
    if (nom === '390x844' && l === 'ja') console.log(`  cas suivi — le menu d'une idée noire en japonais, 390 × 844 : ${vu.noir ? (vu.noir.defile > 2 ? 'il défile, avec son repère' : `il tient, ${vu.noir.libre} points libres dessous`) : 'non atteint'} (avant la 2.12, sa troisième manière était coupée)`);
    await p.context().close();
  }
  fs.writeFileSync(path.join(out, 'longueurs.json'), JSON.stringify(rapport, null, 1));
  await browser.close();
  console.log(`✓ LONGUEURS RELEVÉES — ${reprendre} point(s) à reprendre, sans blocage (détail : ${path.relative(path.join(V2, '..'), path.join(out, 'longueurs.json'))})`);
}

const args = process.argv.slice(2);
(args[0] === 'releve' ? releve((() => { const l = args.slice(1).filter(a => /^(fr|ar|en)$/.test(a)); return l.length ? l : ['fr', 'ar', 'en']; })()) : controle(args)).catch(e => { console.error(e); process.exit(1); });
