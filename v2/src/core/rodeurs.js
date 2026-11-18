/* ISNAD 2.x — la noosphère en labyrinthes : la graine d'une descente, son chrono, la remontée.
   Le tirage lui-même est dans dedale.js, et le lieu se bâtit dans maps.js. Ici : ce qui se passe quand on y est.

   - La graine. Quand un récit dit « on descend » (l'opération « map » vers un lieu de gabarit « noos »), le lieu reçoit une
     graine et une profondeur : il se bâtit alors en labyrinthe. La graine voyage avec le lieu (ses options), donc avec le
     point de reprise : reprendre une partie redonne le même labyrinthe. Un lieu sans graine se bâtit comme avant.
   - La profondeur (0 à 5) suit ce que le joueur a achevé de l'histoire : plus on avance, plus le dédale est serré.
   - Le chrono. 30 secondes, plus le temps d'un tour de tous les lieux multiplié par un facteur qui se resserre avec la
     profondeur. Il ne court que lorsque le joueur a la main : ni pendant un combat, ni pendant un dialogue, ni dans un
     menu. Écoulé, on remonte au seuil ; le labyrinthe se redessine, un cran plus simple ; rien n'est perdu.
   - Ce qui rôde (2.x). Dans le labyrinthe d'un récit, de petits égrégores du chapitre vont et viennent sur les ponts —
     jamais dans les lieux que le récit nomme. On les frappe en temps réel, avec l'arme que porte celui qui mène (D.FRAPPES) :
     chaque coup ôte un voile, sans voile ils se dissipent ; s'ils touchent le groupe, c'est un combat ordinaire. Dans la
     descente du râwî, les mêmes coups ne font que sonner et repousser — voir plus bas.
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
    delete S.flags._meutes_off;
    return Object.assign({}, opts, { g: neuve(), n: R.profondeur() });
  };

  /* ---------- le chrono ---------- */
  let el = null;
  function affiche() {
    const c = R.chrono;
    if (!el) { el = document.createElement('div'); el.id = 'chrono'; el.setAttribute('role', 'timer'); el.innerHTML = '<span class="t"></span><i><b></b></i>'; $('#ui').appendChild(el); }
    const montre = !!c && I.scene === W && !S.busy && !W.lock; el.hidden = !montre; if (!c) return;
    const s = Math.max(0, Math.ceil(c.reste)), txt = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    if (el._txt !== txt) { el._txt = txt; el.querySelector('.t').textContent = txt; el.setAttribute('aria-label', I.t('Temps restant avant de remonter : {txt}', { txt })); }
    el.querySelector('b').style.width = Math.max(0, Math.min(100, c.reste / c.total * 100)).toFixed(1) + '%';
    el.classList.toggle('presse', c.reste <= 20);
  }
  // appelé quand un lieu vient d'être chargé : un labyrinthe arme son chrono, tout autre lieu l'éteint
  R.arme = function () {
    const d = W.map && W.map.env && W.map.env.dedale;
    if (W.excursion) return; // la descente du râwî arme le sien
    R.chrono = d && !d.descente ? { total: R.duree(d.n, d.tour), reste: R.duree(d.n, d.tour), n: d.n } : null; affiche();
    poserMeutes();
  };
  // appelé à chaque pas du monde, quand le joueur a la main
  R.tic = function (dt) {
    if (W.excursion) return ticDescente(dt);
    const c = R.chrono; if (!c || c.fini) { if (el && !el.hidden && !c) el.hidden = true; return; }
    if (I.debug.compte !== undefined) { c.reste = Math.min(c.reste, I.debug.compte); I.debug.compte = undefined; }
    c.reste -= dt; if (c.reste <= 0) { c.fini = true; R.remonte(); } else { affiche(); ticMeutes(dt); }
  };
  R.cache = function () { if (el) el.hidden = true; };
  // le temps est écoulé : on remonte au seuil, le labyrinthe se redessine un cran plus simple, rien n'est perdu
  R.remonte = async function () {
    const id = W.map.id, o = Object.assign({}, W.mapOpts), n = Math.max(0, (o.n | 0) - 1);
    W.stop(); W.lock = true; R.cache(); R.remontees = (R.remontees || 0) + 1;
    try {
      S.toast(I.t('Le temps de la descente est écoulé. <b>On remonte au seuil</b> : le labyrinthe se redessine, un peu plus simple. Rien n’est perdu.'), 6500); I.audio.sfx('light');
      await S.fade('out', 500);
      W.foes = W.foes.filter(f => !f.meute); S.flags._meutes_off = true; // ce qui rôdait s'est dispersé : le labyrinthe redessiné est plus simple, et vide de rôdeurs
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
      if (!I.debug.auto && !I.debug.walk) await S.card('title noos', `<p class="small">${I.esc(Pk.titre || '')}</p><h1>${I.t('La noosphère')}</h1><p>${I.esc(T0.seuil || '')}</p><div class="rule"></div><div class="hint">▼</div>`, 6000);
      await S.fade('out', 300);
      // un récit d'un seul chapitre, sans objectif : le râwî (et, dans l'histoire-cadre, ceux qui l'accompagnent)
      const ch = { id: 'descente', title: I.t('La noosphère'), sub: (Pk.titre || '') + ' · ' + (T0.sousTitre || I.t('ta descente')), objectives: [], party: heros.map(h => h.id) };
      W.excursion = E; W.saga = { id: 'idris', name: I.t('La noosphère'), frame: true, heroes: I.sagas.idris.heroes, enemies: C0().enemies || {}, chapters: [ch] }; W.ci = 0; W.ch = ch; W.objIndex = 0; W.minLvl = 1;
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
  // par où passe ce qui rôde : les ponts et les salles, jamais un abri ; dans le labyrinthe d'un récit, les ponts seulement
  function passable(f, x, y) { const m = W.map, T = 16; if (x < 0 || y < 0 || x >= m.w || y >= m.h || m.solid[y * m.w + x]) return false; const n = m.g0(x * T + 8, y * T + 8); return n === 'npont' || (n === 'nfloor' && !f.meute); }
  // un rôdeur avance de case en case : il erre, et prend en chasse quand le râwî est à portée ; il n'entre jamais dans un abri
  function avance(f, dt, champ) {
    const m = W.map, T = 16, tx = Math.floor(f.x / T), ty = Math.floor(f.y / T), passe = (x, y) => passable(f, x, y);
    if (f.cx === null || f.cx === undefined || (Math.abs(f.x - (f.cx * T + 8)) < 1 && Math.abs(f.y - (f.cy * T + 8)) < 1)) { // au milieu d'une case : choisir la suivante
      const ici = champ ? champ[ty * m.w + tx] : -1, voisins = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(q => passe(tx + q[0], ty + q[1]));
      let pick = null;
      if (ici > 0 && ici <= (f.vue || 16)) pick = voisins.find(q => champ[(ty + q[1]) * m.w + tx + q[0]] === ici - 1) || null; // en chasse : vers celui qui marche
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
    for (const f of W.foes) { if (f.done || !f.rodeur || !f.placed) continue; if (etourdi(f, dt)) continue; avance(f, dt, E.champ); if (Math.hypot(f.x - p.x, f.y - p.y) < 14 && ici !== 'abri') return R.contact(f); }
    viser();
  }
  // dans un abri, on peut laisser passer le temps d'un coup : Entrée, ou toucher son personnage
  R.attendre = function () { const E = W.excursion; if (E && E.abri && !E.fin && R.chrono) { R.chrono.reste = 0; return true; } return false; };
  R.touche = (x, y) => !!(W.excursion && W.excursion.abri && Math.hypot(x - W.player.x, y - 10 - W.player.y) < 16 && R.attendre());
  R.depart = function () { const k = R.attente; R.attente = null; if (k) R.entrer(k); };
  R.texte = k => I.esc(P()[k] || '');

  /* ================= frapper ce qui rôde (2.x) =================
     « Valider » — ou toucher ce qui rôde — frappe devant soi, avec l'arme que porte celui qui mène : le geste de
     « Frapper », fait sur les ponts. Ce qui est frappé est repoussé et sonné : il ne bouge plus, et laisse passer.
     - Dans le labyrinthe d'un récit : chaque coup ôte un voile à un petit égrégore ; sans voile, il se dissipe.
     - Dans la descente du râwî : un coup sonne, il ne vainc pas — seul, le râwî ne vainc rien. Lame forgée en main et
       accompagné, chaque coup entame une idée noire, qui finit par se dissiper jusqu'au chapitre suivant. Un mal du cœur
       ne se tranche qu'en lui faisant face. */
  R.MEUTES = [1, 2, 2, 3, 3, 4]; R.VOILES = [2, 2, 3, 3, 4, 4]; R.VUE = 6; R.PAS_MEUTE = 0.5; R.TENUE = [3, 3, 4, 4, 5, 6];
  const enMain = () => { const h = W.party.length ? W.hero(W.party[0]) : null; let g = null; try { const e = h && I.gear ? I.gear.of(h) : null; g = e && D.GEAR[e.md]; } catch (x) { g = null; } const t = g && D.FRAPPES[g.t] ? g.t : 'nu'; return { h, piece: g || null, type: t, F: D.FRAPPES[t] }; };
  R.enMain = enMain;
  const rodent = () => W.map ? W.foes.filter(f => f.rodeur && !f.done && f.placed && f.map === W.map.id) : [];
  R.rodent = rodent;
  // ce qui est sonné : glisse jusqu'où le coup l'a repoussé, puis attend
  function etourdi(f, dt) {
    if (!(f.sonne > 0)) return false; f.sonne -= dt;
    if (f.pousse) { const L = Math.hypot(f.pousse[0] - f.x, f.pousse[1] - f.y), pas = Math.min(L, 220 * dt); if (L > 0.5) { f.x += (f.pousse[0] - f.x) / L * pas; f.y += (f.pousse[1] - f.y) / L * pas; } else f.pousse = null; }
    if (f.sonne <= 0) { f.sonne = 0; f.pousse = null; f.cx = null; }
    return true;
  }
  // y a-t-il de quoi frapper ? (un rôdeur à portée de vue : « Valider » frappe alors, au lieu d'agir sur le décor)
  R.aFrapper = function () { const d = W.map && W.map.env && W.map.env.dedale; if (!d) return false; const p = W.player, F = enMain().F; return rodent().some(f => Math.hypot(f.x - p.x, f.y - p.y) < F.portee + 24); };
  // frapper devant soi (vers : celui que l'on a touché du doigt)
  R.frappe = function (vers) {
    const d = W.map && W.map.env && W.map.env.dedale; if (!d || I.scene !== W || S.busy || W.lock || (W.excursion && (W.excursion.fin || W.excursion.combat))) return false;
    if (R._pret && W.t < R._pret) return false;
    const A = enMain(), F = A.F, p = W.player, T = 16;
    if (vers) { const dx = vers.x - p.x, dy = vers.y - p.y; p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); }
    const fx = [0, -1, 1, 0][p.dir], fy = [1, 0, 0, -1][p.dir];
    W.stop(); R._pret = W.t + F.cadence; R.geste = { t: W.t, dir: p.dir, type: A.type, F, port: A.piece ? (A.piece.port || (D.GEAR_TYPES[A.piece.t] || {}).port || null) : null }; R.coups = (R.coups || 0) + 1;
    I.audio.sfx(A.type === 'arc' ? 'blip' : 'tek');
    // le geste, dessiné : un arc d'étincelles devant soi ; pour l'arc, un trait qui file
    const G = I.gfx, sx = p.x - W.cam.x, sy = p.y - W.cam.y - 12, coul = A.piece ? '#fff3c8' : '#d8d2e6';
    if (F.trait) for (let i = 1; i <= 7; i++) G.spawn({ x: sx + fx * i * F.portee / 7, y: sy + fy * i * F.portee / 7, vx: fx * 60, vy: fy * 60, life: 0.16 + i * 0.012, size: 0.8, color: coul, type: 'spark' });
    else for (let i = -3; i <= 3; i++) { const a = i / 3 * 0.9, cx = fx * Math.cos(a) - fy * Math.sin(a), cy = fy * Math.cos(a) + fx * Math.sin(a); G.spawn({ x: sx + cx * (F.portee - 6), y: sy + cy * (F.portee - 6), vx: cx * 50, vy: cy * 50, life: 0.2, size: 1, color: coul, type: 'spark' }); }
    let touches = 0;
    rodent().forEach(f => { const dx = f.x - p.x, dy = f.y - p.y, av = dx * fx + dy * fy, cote = Math.abs(dx * fy - dy * fx); if (av < -6 || av > F.portee + 6 || cote > F.large) return; touches++; coup(f, F, fx, fy); });
    if (touches) { G.shake(120); I.audio.sfx('hit'); }
    return true;
  };
  function coup(f, F, fx, fy) {
    const T = 16, G = I.gfx, id = f.group[0], def = (W.saga.enemies || {})[id] || {}, E = W.excursion;
    // repoussé de case en case dans le sens du coup, tant que le passage est libre ; puis sonné
    let tx = Math.floor(f.x / T), ty = Math.floor(f.y / T), k = 0; while (k < F.recul && passable(f, tx + fx, ty + fy)) { tx += fx; ty += fy; k++; }
    f.pousse = k ? [tx * T + 8, ty * T + 8] : null; f.sonne = F.sonne; f.dx = fx; f.dy = fy; f.touche = W.t; R.touches = (R.touches || 0) + 1; if (I.lecons) I.lecons.reemploi('frappe');
    for (let i = 0; i < 8; i++) G.spawn({ x: f.x - W.cam.x + (Math.random() - 0.5) * 10, y: f.y - W.cam.y - 14 + (Math.random() - 0.5) * 10, vx: (Math.random() - 0.5) * 90 + fx * 40, vy: (Math.random() - 0.5) * 90 + fy * 40, life: 0.45, size: 0.9, color: `hsl(${def.hue || 260},90%,72%)`, type: 'spark' });
    if (E) { // la descente du râwî : un coup sonne ; il n'entame une idée noire que lame forgée en main, et accompagné
      if (!(def.idee && R.peutFaireFace(id))) { if (!E.ditSonne) { E.ditSonne = true; S.toast(I.esc(P().sonne || ''), 5200); } return; }
      f.tenue = (f.tenue === undefined ? R.TENUE[E.n] : f.tenue) - F.force;
      if (f.tenue > 0) return;
      f.done = true; E.flags['_noir_' + id] = true; I.audio.sfx('light'); G.flash('#fff3d0'); S.toast(I.esc((P().dissipee || '').replace('%s', def.name || '')), 5200);
      return;
    }
    f.voiles = (f.voiles === undefined ? R.VOILES[W.map.env.dedale.n] : f.voiles) - F.force;
    if (f.voiles > 0) return;
    dissiper(f);
  }
  // un petit égrégore du chapitre, sans voile, se dissipe : ce que le groupe y gagne est ce qu'un combat lui aurait donné, en moins
  function dissiper(f) {
    const sv = I.save.data, E0 = W.saga.enemies || {}; let xp = 0;
    f.group.forEach(id => { const def = E0[id]; if (!def) return; xp += I.calc.xpOf(def); const cid = 'foe:' + W.saga.id + ':' + id; if (!sv.codex.includes(cid)) sv.codex.push(cid); });
    f.done = true; if (f.cle) S.flags[f.cle] = true; R.dissipes = (R.dissipes || 0) + 1;
    const lignes = I.battle.grantXP(Math.round(xp * 0.6)), nom = (E0[f.group[0]] || {}).name || '';
    I.audio.sfx('light'); I.gfx.flash('#fff3d0');
    S.toast(I.t('<b>{nom}</b> se dissipe.', { nom: I.esc(nom) }) + (lignes.length ? ' ' + lignes.map(l => l.replace(/<\/?li>/g, '')).join(' · ') : ''), lignes.length ? 6000 : 2600);
    if (W.saga && !I.debug.auto) W.checkpoint();
  }
  // au doigt : toucher ce qui rôde, c'est le frapper — de là où l'on est s'il est à portée, sinon en s'en approchant
  R.viseDu = function (x, y) {
    const d = W.map && W.map.env && W.map.env.dedale; if (!d) return false;
    const f = rodent().find(q => Math.abs(q.x - x) < 16 && y > q.y - 38 && y < q.y + 8); if (!f) return false;
    const p = W.player, F = enMain().F;
    if (Math.hypot(f.x - p.x, f.y - p.y) <= F.portee + 2) { R.frappe(f); return true; }
    R._vise = f; W.goTo(f.x, f.y, { ent: f, stop: Math.max(10, F.portee - 6) }); return true;
  };
  function viser() { const f = R._vise; if (!f) return; if (f.done || !f.placed) { R._vise = null; return; } const p = W.player, F = enMain().F; if (Math.hypot(f.x - p.x, f.y - p.y) <= F.portee) { R._vise = null; R.frappe(f); } else if (!W.dest) R._vise = null; }

  /* ----- ce qui rôde dans le labyrinthe d'un récit ----- */
  function poserMeutes() {
    W.foes = (W.foes || []).filter(f => !f.meute); R._champ = null; R._vise = null;
    const m = W.map, d = m && m.env && m.env.dedale, T = 16; if (!d || d.descente || W.excursion || !W.saga) return;
    if (S.flags._meutes_off || I.debug.sansMeutes) return;
    const E0 = W.saga.enemies || {}, petits = Object.keys(E0).filter(k => E0[k].tier === 'minion' && !E0[k].idee && !E0[k].vice && !E0[k].racine);
    if (!petits.length) return;
    const g = W.mapOpts && W.mapOpts.g, r = I.rng(I.hash('meutes/' + g)), n = R.MEUTES[d.n] | 0;
    // des carrefours, sur les ponts, à l'écart du seuil et à l'écart les uns des autres
    const seuil = W.spotPx('seuil') || [0, 0], libres = (d.loin || []).filter(c => m.g0(c[0] * T + 8, c[1] * T + 8) === 'npont' && Math.hypot(c[0] * T + 8 - seuil[0], c[1] * T + 8 - seuil[1]) > 9 * T);
    const pris = [];
    for (let i = 0; i < n && libres.length; i++) {
      let c = null; for (let essai = 0; essai < 24 && !c; essai++) { const q = libres[Math.floor(r() * libres.length)]; if (pris.every(o => Math.hypot(o[0] - q[0], o[1] - q[1]) > 7)) c = q; }
      if (!c) break; pris.push(c);
      const id = petits[Math.floor(r() * petits.length)], cle = '_meute_' + g + '_' + i;
      if (S.flags[cle]) continue; // déjà dissipé, ou vaincu : il ne revient pas
      W.foes.push({ id: 'meute' + i, group: [id], map: m.id, rodeur: true, meute: true, cle, done: false, placed: true, x: c[0] * T + 8, y: c[1] * T + 8, cx: null, ph: i * 1.9, v: R.MARCHE * R.PAS_MEUTE, vue: R.VUE, voiles: R.VOILES[d.n] });
    }
  }
  R.poserMeutes = poserMeutes;
  function ticMeutes(dt) {
    const m = W.map, d = m && m.env && m.env.dedale; if (!d || d.descente) return;
    const L = W.foes.filter(f => f.meute && !f.done && f.placed && f.map === m.id); if (!L.length) { R._vise = null; return; }
    const p = W.player, surPont = m.g0(p.x, p.y) === 'npont';
    R._champT = (R._champT || 0) - dt; if (R._champT <= 0 || R._champ === undefined) { R._champ = surPont ? champDe(p) : null; R._champT = 0.25; }
    for (const f of L) { if (etourdi(f, dt)) continue; avance(f, dt, R._champ); const dist = Math.hypot(f.x - p.x, f.y - p.y);
      if (dist < 96 && !R._ditRode && !I.save.data.codex.includes('coeur/frappe')) { const dire = () => { O().learn('frappe', true); S.toast(I.esc(P().rode || ''), 7000); }; if (I.lecons.proposer('frappe', dire)) R._ditRode = true; } // le besoin d'abord : on apprend à frapper quand quelque chose approche
      if (surPont && dist < 14) return R.contactMeute(f); }
    viser();
  }
  // un petit égrégore a rejoint le groupe : un combat ordinaire
  R.contactMeute = async function (f) {
    if (f.enCombat || S.busy || W.lock) return; f.enCombat = true; W.stop(); R._vise = null; S.depth++;
    try { await I.battle.start({ group: f.group, bg: W.map.env.bg, intro: I.t('{nom} vous a rejoints sur le pont.', { nom: (W.saga.enemies[f.group[0]] || {}).name || '' }) }); f.done = true; if (f.cle) S.flags[f.cle] = true; W.checkpoint(); }
    finally { S.depth--; f.enCombat = false; }
  };

  R.contact = async function (f) {
    const E = W.excursion, id = f.group[0], def = (C0().enemies || {})[id] || {}; if (!E || E.fin || E.combat) return;
    if (!R.peutFaireFace(id)) return R.finir('rattrape', def);
    E.combat = true; W.stop(); S.depth++; let res = 'lose';
    try { S.toast(I.esc((P().face || '').replace('%s', def.name || '')), 4200);
      res = await I.battle.start({ group: [id], bg: 'noos', w: 1, interieur: true, sansReprise: true, heros: E.heros, intro: I.t('{nom} te barre le pont.', { nom: def.name || '' }) }); }
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
      if (!I.debug.auto && !I.debug.walk) await S.card(issue === 'rattrape' ? 'defeat' : 'title noos', `<p class="small">${I.esc(X.titre || I.t('La noosphère se referme'))}</p><h1>${I.esc((X.h1 || '').replace('%s', (def && def.name) || ''))}</h1><p>${I.esc(X.texte || '')}</p>${plus ? '<p><b>' + I.esc(plus) + '</b></p>' : ''}<div class="hint">▼</div>`);
    } finally { S.depth--; S.hideDialog(); }
    // le retour au récit : par le point de reprise d'avant la descente, comme on reprend une partie
    const cp = E.cp; cp.flags = Object.assign(cp.flags || {}, E.flags); W.excursion = null; R.chrono = null; document.body.classList.remove('descente');
    I.save.data.cp = cp; I.save.store(); W.lock = false;
    await W.startChapter(cp.saga, cp.ci, cp);
  };
})();
