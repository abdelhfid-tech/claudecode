/* ISNAD 2.x — la noosphère en labyrinthes : la graine d'une descente, son chrono, la remontée.
   Le tirage lui-même est dans dedale.js, et le lieu se bâtit dans maps.js. Ici : ce qui se passe quand on y est.

   - La graine. Quand un récit dit « on descend » (l'opération « map » vers un lieu de gabarit « noos »), le lieu reçoit une
     graine et une profondeur : il se bâtit alors en labyrinthe. La graine voyage avec le lieu (ses options), donc avec le
     point de reprise : reprendre une partie redonne le même labyrinthe. Un lieu sans graine se bâtit comme avant.
   - La profondeur (0 à 5) suit ce que le joueur a achevé de l'histoire : plus on avance, plus le dédale est serré.
   - Le chrono. 30 secondes, plus le temps d'un tour de tous les lieux multiplié par un facteur qui se resserre avec la
     profondeur. Il ne court que lorsque le joueur a la main : ni pendant un combat, ni pendant un dialogue, ni dans un
     menu. Écoulé, on remonte au seuil ; le labyrinthe se redessine, un cran plus simple ; rien n'est perdu.
   Les textes sont ceux d'une règle du jeu : ils ne disent rien de l'histoire. */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, $ = I.$, W = I.world, S = I.script, Dd = window.ISNAD_DEDALE;
  const R = I.rodeurs = { chrono: null };
  // les mêmes nombres que tools/dedales.js, qui vérifie que le chrono laisse le temps du tour
  R.VITESSE = 62; R.FACTEURS = [3.0, 2.7, 2.4, 2.1, 1.9, 1.7];
  R.duree = (n, tour) => 30 + R.FACTEURS[Math.max(0, Math.min(5, n | 0))] * tour * 16 / R.VITESSE;
  const estNoos = id => !!(D.MAPS[id] && D.MAPS[id].gabarit === 'noos');

  // la profondeur : la part de l'histoire déjà achevée, de 0 à 5
  R.profondeur = function () {
    if (I.debug.profondeur !== undefined) return Math.max(0, Math.min(5, I.debug.profondeur | 0));
    const sv = I.save.data; let fait = 0, total = 0;
    Object.keys(I.sagas).forEach(k => { const s = I.sagas[k]; if (!s.chapters || !s.chapters.length || s.frame || s.commun) return; const n = s.chapters.length, sp = sv.sagas[s.id]; total += n; fait += sp ? (sp.done ? n : Math.min(n, sp.ch || 0)) : 0; });
    return total ? Math.min(5, Math.floor(6 * fait / total)) : 0;
  };
  // une graine neuve : propre à la partie (son sel), différente à chaque descente et à chaque remontée
  function neuve() {
    if (I.debug.graine !== undefined) return (I.debug.graine >>> 0) + (R._tirages = (R._tirages || 0) + 1) - 1;
    const sv = I.save.data, dd = sv.dedale && typeof sv.dedale === 'object' ? sv.dedale : (sv.dedale = { sel: Math.floor(Math.random() * 1e9), n: 0 });
    dd.n = (dd.n | 0) + 1; return I.hash(dd.sel + '/' + dd.n + '/' + (W.saga ? W.saga.id + '/' + W.ci : ''));
  }
  // les options d'un lieu où l'on descend : une graine et une profondeur, s'il est de la noosphère et n'en a pas déjà
  R.graine = function (id, opts) {
    opts = opts || {}; if (!Dd || !estNoos(id) || opts.g !== undefined || R.sans) return opts;
    return Object.assign({}, opts, { g: neuve(), n: R.profondeur() });
  };

  /* ---------- le chrono ---------- */
  let el = null;
  function affiche() {
    const c = R.chrono;
    if (!el) { el = document.createElement('div'); el.id = 'chrono'; el.setAttribute('role', 'timer'); el.innerHTML = '<span class="t"></span><i><b></b></i>'; $('#ui').appendChild(el); }
    const montre = !!c && I.scene === W && !S.busy && !W.lock; el.hidden = !montre; if (!c) return;
    const s = Math.max(0, Math.ceil(c.reste)), txt = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    if (el._txt !== txt) { el._txt = txt; el.querySelector('.t').textContent = txt; el.setAttribute('aria-label', 'Temps restant avant de remonter : ' + txt); }
    el.querySelector('b').style.width = Math.max(0, Math.min(100, c.reste / c.total * 100)).toFixed(1) + '%';
    el.classList.toggle('presse', c.reste <= 20);
  }
  // appelé quand un lieu vient d'être chargé : un labyrinthe arme son chrono, tout autre lieu l'éteint
  R.arme = function () {
    const d = W.map && W.map.env && W.map.env.dedale;
    if (W.excursion) return; // la descente du râwî arme le sien
    R.chrono = d && !d.descente ? { total: R.duree(d.n, d.tour), reste: R.duree(d.n, d.tour), n: d.n } : null; affiche();
  };
  // appelé à chaque pas du monde, quand le joueur a la main
  R.tic = function (dt) {
    if (W.excursion) return ticDescente(dt);
    const c = R.chrono; if (!c || c.fini) { if (el && !el.hidden && !c) el.hidden = true; return; }
    if (I.debug.compte !== undefined) { c.reste = Math.min(c.reste, I.debug.compte); I.debug.compte = undefined; }
    c.reste -= dt; if (c.reste <= 0) { c.fini = true; R.remonte(); } else affiche();
  };
  R.cache = function () { if (el) el.hidden = true; };
  // le temps est écoulé : on remonte au seuil, le labyrinthe se redessine un cran plus simple, rien n'est perdu
  R.remonte = async function () {
    const id = W.map.id, o = Object.assign({}, W.mapOpts), n = Math.max(0, (o.n | 0) - 1);
    W.stop(); W.lock = true; R.cache(); R.remontees = (R.remontees || 0) + 1;
    try {
      S.toast('Le temps de la descente est écoulé. <b>On remonte au seuil</b> : le labyrinthe se redessine, un peu plus simple. Rien n’est perdu.', 6500); I.audio.sfx('light');
      await S.fade('out', 500);
      W.foes.forEach(f => { if (f.map === id && !f.done) f.placed = false; }); W.chests.forEach(c => { if (c.map === id) c.placed = false; });
      W.loadMap(id, Object.assign(o, { g: neuve(), n }), 'seuil');
      await S.fade('in', 500);
    } finally { W.lock = false; }
    if (W.saga && !I.debug.auto) W.checkpoint();
  };
  /* ================= la descente du râwî =================
     Au sortir de la prière, dans le dhikr, en songe, le râwî peut descendre dans sa propre noosphère : un labyrinthe où
     rôdent ses maux du cœur encore debout et les cinq idées noires. C'est une fiction, et c'est la sienne : jamais celle
     d'un Compagnon. Seul, il ne les vainc pas : il trouve l'issue (un niveau), ou un abri où attendre la fin du chrono
     (de l'Esprit, du Souffle). Rattrapé, il remonte épuisé : les portes restent closes jusqu'à un sommeil sans songe.
     Armé d'une lame forgée et accompagné, il peut faire face.
     La descente se joue dans le moteur des cartes, entre deux points de reprise : celui d'avant est gardé, et c'est par
     lui que l'on revient au récit, comme on reprend une partie. Rien du récit ne bouge pendant ce temps. */
  const C0 = () => I.sagas.coeur || {}, P = () => (C0().portes || {}), O = () => I.oeuvres, V = () => I.valeurs;
  const dd = () => { const sv = I.save.data; return sv.dedale && typeof sv.dedale === 'object' ? sv.dedale : (sv.dedale = { sel: Math.floor(Math.random() * 1e9), n: 0 }); };
  R.NOMBRE = [2, 2, 3, 3, 4, 5]; R.ALLURE = [0.55, 0.62, 0.7, 0.78, 0.85, 0.92]; R.ABRIS_MAX = 10; R.MARCHE = 82;
  R.clos = () => !!dd().clos;                                   // épuisé : les portes sont closes
  R.repos = function () { delete dd().clos; I.save.store(); };  // un sommeil sans songe les rouvre
  R.abris = () => Math.max(0, Math.min(R.ABRIS_MAX, dd().abris | 0));
  // ce que les abris ont laissé au râwî : de l'Esprit et du Souffle, pour de bon (battle.js, I.calc.of)
  R.avecAbris = function (st) { const n = R.abris(); if (!n) return st; return Object.assign({}, st, { mag: st.mag + n, sp: st.sp + 2 * n }); };
  const lameDe = id => { const d = (C0().enemies || {})[id] || {}; return d.vice ? O().hasBlade(d.vice) : V().IDS.some(v => O().hasBlade(v)); }; // un mal : sa lame ; une idée noire : n'importe quelle lame forgée
  R.peutFaireFace = id => !!(W.excursion && W.excursion.accompagne && lameDe(id));

  // V.porte l'appelle : la descente commencera dès que le joueur aura la main (le menu refermé)
  R.demande = function (k) { if (W.excursion || R.attente) return null; R.attente = k; return 'descente'; };

  R.entrer = async function (k) {
    const T0 = P(), Pk = T0[k] || {}, rawi = V().rawi(), cadre = W.saga.id === 'idris' && W.party.includes('idris') ? W.party.slice() : null; if (!rawi || !Dd) return;
    S.flags['_o_porte_' + k] = true; O().learn('noos_interieure');
    W.stop(); W.checkpoint(); const cp = JSON.parse(JSON.stringify(I.save.data.cp)); // le point de reprise d'avant : c'est par lui que l'on reviendra
    const n = R.profondeur(), heros = cadre ? cadre.map(id => W.hero(id)) : [rawi], vices = V().restent(), noirs = (D.NOIRS || []).filter(id => !S.flags['_noir_' + id]);
    const E = { k, cp, rawi, heros, n, flags: {}, t: 0, accompagne: !!O().animal() || heros.length > 1, abri: null, fin: false };
    S.depth++;
    try {
      if (!I.debug.auto && !I.debug.walk) await S.card('title noos', `<p class="small">${I.esc(Pk.titre || '')}</p><h1>La noosphère</h1><p>${I.esc(T0.seuil || '')}</p><div class="rule"></div><div class="hint">▼</div>`, 6000);
      await S.fade('out', 300);
      // un récit d'un seul chapitre, sans objectif : le râwî (et, dans l'histoire-cadre, ceux qui l'accompagnent)
      const ch = { id: 'descente', title: 'La noosphère', sub: (Pk.titre || '') + ' · ' + (T0.sousTitre || 'ta descente'), objectives: [], party: heros.map(h => h.id) };
      W.excursion = E; W.saga = { id: 'idris', name: 'La noosphère', frame: true, heroes: I.sagas.idris.heroes, enemies: C0().enemies || {}, chapters: [ch] }; W.ci = 0; W.ch = ch; W.objIndex = 0; W.minLvl = 1;
      W.roster = {}; heros.forEach(h => { W.roster[h.id] = h; }); W.party = ch.party.slice(); W.refreshSheets(); W.npcs = []; W.chests = []; W.foes = [];
      // ceux qui rôdent : tour à tour un mal du cœur encore debout, une idée noire — posés loin du seuil
      const qui = []; for (let i = 0; qui.length < R.NOMBRE[n] && (i < vices.length || i < noirs.length); i++) { if (i < vices.length) qui.push(vices[i]); if (i < noirs.length && qui.length < R.NOMBRE[n]) qui.push(noirs[i]); }
      W.loadMap('noos', { hue: 262, g: neuve(), n, descente: true }, 'seuil');
      W.foes = qui.map((id, i) => ({ id: 'rodeur' + i, group: [id], map: 'noos', rodeur: true, done: false, placed: false, ph: i * 1.7, v: R.MARCHE * R.ALLURE[n] }));
      const m = W.map, d = m.env.dedale, T = 16, loin = (d.loin || []).slice(); E.duree = R.duree(n, d.tour); R.chrono = { total: E.duree, reste: E.duree, n };
      W.foes.forEach((f, i) => { let q = loin.find(c => W.foes.every(g => !g.placed || Math.hypot(g.x - (c[0] * T + 16), g.y - (c[1] * T + 16)) > 6 * T)) || loin[i] || loin[0]; if (!q) { f.done = true; return; } f.x = q[0] * T + 16; f.y = q[1] * T + 16; f.placed = true; f.cx = null; });
      W.player.dir = 2; W.hud(); $('#hud').hidden = false; document.body.classList.add('descente');
      await S.fade('in', 500);
      S.toast(I.esc(T0.regle || ''), 9000);
    } finally { S.depth--; S.hideDialog(); }
    if (I.debug.auto || I.debug.walk) return R.finir(I.debug.issue || 'issue'); // le joueur de test ne s'y promène pas : il en éprouve l'entrée, une issue et le retour
  };

  // la cible que montre l'écran : l'issue
  R.cible = function () { const s = W.spotPx('issue'); return s ? { x: s[0], y: s[1], gx: s[0], gy: s[1], kind: 'goto' } : null; };
  const salleDe = (px, py) => { const n = W.map.g0 ? W.map.g0(px, py) : ''; return n === 'nabri' ? 'abri' : n; };
  // un rôdeur avance de case en case : il erre, et prend en chasse quand le râwî est à portée ; il n'entre jamais dans un abri
  function avance(f, dt, champ) {
    const m = W.map, T = 16, tx = Math.floor(f.x / T), ty = Math.floor(f.y / T), passe = (x, y) => { if (x < 0 || y < 0 || x >= m.w || y >= m.h || m.solid[y * m.w + x]) return false; const n = m.g0(x * T + 8, y * T + 8); return n === 'npont' || n === 'nfloor'; };
    if (f.cx === null || f.cx === undefined || (Math.abs(f.x - (f.cx * T + 8)) < 1 && Math.abs(f.y - (f.cy * T + 8)) < 1)) { // au milieu d'une case : choisir la suivante
      const ici = champ ? champ[ty * m.w + tx] : -1, voisins = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(q => passe(tx + q[0], ty + q[1]));
      let pick = null;
      if (ici > 0 && ici <= 16) pick = voisins.find(q => champ[(ty + q[1]) * m.w + tx + q[0]] === ici - 1) || null; // en chasse : vers le râwî
      if (!pick && voisins.length) { const avant = voisins.filter(q => !(f.dx === -q[0] && f.dy === -q[1])), tout = avant.length ? avant : voisins, droit = tout.find(q => q[0] === f.dx && q[1] === f.dy); pick = droit && Math.random() < 0.7 ? droit : tout[Math.floor(Math.random() * tout.length)]; }
      if (!pick) return; f.dx = pick[0]; f.dy = pick[1]; f.cx = tx + pick[0]; f.cy = ty + pick[1];
    }
    const gx = f.cx * T + 8, gy = f.cy * T + 8, L = Math.hypot(gx - f.x, gy - f.y), pas = Math.min(L, f.v * dt); if (L > 0) { f.x += (gx - f.x) / L * pas; f.y += (gy - f.y) / L * pas; }
  }
  // les distances au râwî, de case en case, par où un rôdeur peut passer (jamais par un abri)
  function champDe(p) { const m = W.map, T = 16, d = new Int16Array(m.w * m.h).fill(-1), sx = Math.floor(p.x / T), sy = Math.floor(p.y / T), q = [sy * m.w + sx]; if (salleDe(p.x, p.y) === 'abri') return d; d[q[0]] = 0;
    for (let k = 0; k < q.length; k++) { const c = q[k], x = c % m.w, y = (c - x) / m.w; if (d[c] >= 16) continue; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(o => { const X = x + o[0], Y = y + o[1]; if (X < 0 || Y < 0 || X >= m.w || Y >= m.h) return; const j = Y * m.w + X; if (d[j] >= 0 || m.solid[j]) return; const n = m.g0(X * T + 8, Y * T + 8); if (n !== 'npont' && n !== 'nfloor') return; d[j] = d[c] + 1; q.push(j); }); }
    return d; }
  function ticDescente(dt) {
    const E = W.excursion, p = W.player, c = R.chrono; if (!E || E.fin || E.combat) return; E.t += dt;
    if (I.debug.compte !== undefined) { c.reste = Math.min(c.reste, I.debug.compte); I.debug.compte = undefined; }
    c.reste -= dt; affiche();
    const ici = salleDe(p.x, p.y), s = W.spotPx('issue');
    if (s && Math.hypot(s[0] - p.x, s[1] - p.y) < 30) return R.finir('issue');
    if (ici === 'abri' && !E.abri) { E.abri = true; S.toast(I.esc(P().aLAbri || ''), 6000); I.audio.sfx('light'); } else if (ici !== 'abri') E.abri = false;
    if (c.reste <= 0) return R.finir(E.abri ? 'abri' : 'temps');
    E.champT = (E.champT || 0) - dt; if (E.champT <= 0 || !E.champ) { E.champ = champDe(p); E.champT = 0.25; }
    for (const f of W.foes) { if (f.done || !f.rodeur || !f.placed) continue; avance(f, dt, E.champ); if (Math.hypot(f.x - p.x, f.y - p.y) < 14 && ici !== 'abri') return R.contact(f); }
  }
  // dans un abri, on peut laisser passer le temps d'un coup : Entrée, ou toucher son personnage
  R.attendre = function () { const E = W.excursion; if (E && E.abri && !E.fin && R.chrono) { R.chrono.reste = 0; return true; } return false; };
  R.touche = (x, y) => !!(W.excursion && W.excursion.abri && Math.hypot(x - W.player.x, y - 10 - W.player.y) < 16 && R.attendre());
  R.depart = function () { const k = R.attente; R.attente = null; if (k) R.entrer(k); };
  R.texte = k => I.esc(P()[k] || '');

  R.contact = async function (f) {
    const E = W.excursion, id = f.group[0], def = (C0().enemies || {})[id] || {}; if (!E || E.fin || E.combat) return;
    if (!R.peutFaireFace(id)) return R.finir('rattrape', def);
    E.combat = true; W.stop(); S.depth++; let res = 'lose';
    try { S.toast(I.esc((P().face || '').replace('%s', def.name || '')), 4200);
      res = await I.battle.start({ group: [id], bg: 'noos', w: 1, interieur: true, sansReprise: true, heros: E.heros, intro: (def.name || '') + ' te barre le pont.' }); }
    finally { S.depth--; S.hideDialog(); E.combat = false; }
    if (res !== 'win') return R.finir('rattrape', def);
    f.done = true; if (def.idee) E.flags['_noir_' + id] = true; // une idée noire vaincue est dissipée jusqu'au chapitre suivant ; un mal tranché l'est pour de bon (oeuvres.js)
    document.body.classList.add('descente');
  };

  R.finir = async function (issue, def) {
    const E = W.excursion; if (!E || E.fin) return; E.fin = true; W.stop(); W.lock = true; R.cache(); R.derniere = issue;
    const T0 = P(), h = E.rawi, X = (T0.issues || {})[issue] || {}, d = dd(); let plus = '';
    S.depth++;
    try {
      if (issue === 'issue') { if (h.lvl < 12 && !S.flags._o_issue) { h.lvl++; h.xp = 0; plus = T0.niveau || ''; E.flags._o_issue = true; } else { h.xp += Math.round(I.calc.xpNeed(h.lvl) / 2); while (h.xp >= I.calc.xpNeed(h.lvl) && h.lvl < 12) { h.xp -= I.calc.xpNeed(h.lvl); h.lvl++; } plus = T0.acquis || ''; } }
      else if (issue === 'abri') { if ((d.abris | 0) < R.ABRIS_MAX) { d.abris = (d.abris | 0) + 1; plus = T0.lucide || ''; } else plus = T0.connus || ''; }
      else if (issue === 'rattrape') d.clos = true;
      E.heros.forEach(q => { I.save.data.heroes[q.key || ('idris:' + q.id)] = { lvl: q.lvl, xp: q.xp }; }); // ce que le râwî (et ceux qui l'accompagnaient) ont appris leur reste
      I.audio.sfx(issue === 'rattrape' ? 'dark' : 'light');
      if (!I.debug.auto && !I.debug.walk) await S.card(issue === 'rattrape' ? 'defeat' : 'title noos', `<p class="small">${I.esc(X.titre || 'La noosphère se referme')}</p><h1>${I.esc((X.h1 || '').replace('%s', (def && def.name) || ''))}</h1><p>${I.esc(X.texte || '')}</p>${plus ? '<p><b>' + I.esc(plus) + '</b></p>' : ''}<div class="hint">▼</div>`);
    } finally { S.depth--; S.hideDialog(); }
    // le retour au récit : par le point de reprise d'avant la descente, comme on reprend une partie
    const cp = E.cp; cp.flags = Object.assign(cp.flags || {}, E.flags); W.excursion = null; R.chrono = null; document.body.classList.remove('descente');
    I.save.data.cp = cp; I.save.store(); W.lock = false;
    await W.startChapter(cp.saga, cp.ci, cp);
  };
})();
