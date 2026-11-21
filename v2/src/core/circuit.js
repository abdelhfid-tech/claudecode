/* ISNAD 2.27 (D216) — « Sâlim et la course » : le tour de moto derrière Sâlim, les cinq circuits, la prime de l'organisateur.
   Demandes du décideur, 21 novembre : « améliore la cité miroir avec des belles voitures, des jeux en tous genres, des
   activités, des courses de voitures » ; « Les activités de la cité miroir sont omniprésents des le début et peuvent faire
   l'objet de jeux légers quelque soit l'avancement dans la saga » ; « Les courses de voitures sont de plus en plus
   difficiles avec des circuits » ; « Un ami vient en moto et demande à Idriss de monter derrière lui pour sa première
   course » (Sâlim, « l'ami des courses ») ; une vraie course, une prime de l'organisateur, aucune mise.
   - Au premier passage au circuit des quartiers (cite.js, le refuge), quel que soit le maillon en cours, dès le prologue
     joué : Sâlim arrive en moto et propose à Idris de monter derrière lui. Sâlim pilote ; Idris se penche dans chaque virage,
     au joystick ou aux flèches, vers l'intérieur du virage. Bien penché, la moto garde sa vitesse ; mal penché, elle ralentit
     — sans chute ni blessure. C'est la leçon de l'outil « virages » (D.OUTILS, lecons.js : dite par Sâlim, au moment de
     monter, jamais au début d'un chapitre) ; elle resert à la première course. Sâlim n'est pas un Compagnon : il a son
     visage. Avant l'étape III de la découverte de l'Agrégor (2.25), aucun texte ne le nomme : Sâlim dit « les écrans ».
   - Les cinq circuits (D.CIRCUITS) : on les court seul, en voiture, vue de dessus, sur des tracés faits des rues du quartier.
     Chacun s'ouvre quand le précédent est gagné ; un circuit gagné se rejoue. On oriente la voiture au joystick ou aux flèches
     (elle tourne vers où on la pointe, d'autant moins vite qu'elle va vite : l'adhérence) ; A tenu accélère ; B met en pause,
     puis offre « Quitter la course » (B revient d'un cran). La barrière retient : on y glisse, plus lentement ; aucun
     accident. Les adversaires suivent la piste, chacun à sa vitesse et à son adresse.
   - La prime : des dirhams (ceux de l'équipement), versés par l'organisateur au podium, croissants avec le circuit, plafonnés
     par visite (D.COURSE.plafond ; S.flags._primes, que cite.js remet à zéro à chaque arrivée). On ne paie jamais pour courir :
     aucune mise, aucun pari, nulle part (regles.js) ; le pari n'est qu'une chimère (« Le Pari », dans la tribune : rodeurs.js).
   - La partie garde, dans `cite.course` (base.js) : { salim : 0 (jamais venu), 1 (venu), 2 (Idris est monté derrière lui),
     gagnes : [vrai…], temps : [millièmes…], primes, parle } — des comptes. Le dernier maillon lit `_2084_salim` (posé ici).
   La géométrie et la conduite ne touchent pas à la page : un outil les fait tourner hors du jeu (v2/tools/cite.js). */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D;
  const CI = I.circuit = { journal: [], K: null };
  const TAU = Math.PI * 2, PAS = 3;
  const borne = (v, a, b) => v < a ? a : v > b ? b : v;
  const ecart = (a, b) => { let d = (a - b) % TAU; if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU; return d; };
  const mod = (v, m) => ((v % m) + m) % m;
  CI.LARGE = 1100; CI.HAUT = 740;   // la toile des tracés, en points
  // les teintes (G.TEINTES) : celle d'Idris, celles des adversaires, celle de la moto de Sâlim
  CI.TEINTE = 8; CI.TEINTES_IA = [2, 3, 7, 4]; CI.TEINTE_MOTO = 2;

  /* ================= la géométrie d'un tracé =================
     Un polygone fermé, chaque sommet arrondi par un arc de son rayon (un congé tangent aux deux droites). Échantillonné tous les
     trois points environ : position, cap (la tangente), courbure signée (> 0 : on tourne dans le sens des aiguilles d'une
     montre, l'écran ayant son y vers le bas), abscisse curviligne. L'origine est au milieu de l'arête `depart`. */
  const geos = new Map();
  function geometrie(def) {
    if (geos.has(def)) return geos.get(def);
    const P = def.trace, n = P.length;
    const coins = P.map((p, i) => {
      const A = P[(i - 1 + n) % n], B = P[(i + 1) % n], r = p[2];
      let ux = A[0] - p[0], uy = A[1] - p[1]; const ul = Math.hypot(ux, uy); ux /= ul; uy /= ul;
      let wx = B[0] - p[0], wy = B[1] - p[1]; const wl = Math.hypot(wx, wy); wx /= wl; wy /= wl;
      const ang = Math.acos(borne(ux * wx + uy * wy, -1, 1)), t = r / Math.tan(ang / 2);
      let bx = ux + wx, by = uy + wy; const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl;
      const dc = r / Math.sin(ang / 2);
      return { t1: [p[0] + ux * t, p[1] + uy * t], t2: [p[0] + wx * t, p[1] + wy * t], c: [p[0] + bx * dc, p[1] + by * dc], r, sens: Math.sign(-ux * wy + uy * wx) || 1, tour: Math.PI - ang };
    });
    const X = [], Y = [], A = [], K = [], E = [], F = [];
    for (let i = 0; i < n; i++) {
      const C = coins[i], f1 = Math.atan2(C.t1[1] - C.c[1], C.t1[0] - C.c[0]), la = C.r * C.tour, m = Math.max(2, Math.ceil(la / PAS));
      for (let j = 0; j < m; j++) { const f = f1 + C.sens * C.tour * j / m; X.push(C.c[0] + C.r * Math.cos(f)); Y.push(C.c[1] + C.r * Math.sin(f)); A.push(f + C.sens * Math.PI / 2); K.push(C.sens / C.r); E.push(-1 - i); F.push(j / m); }
      const N = coins[(i + 1) % n], dx = N.t1[0] - C.t2[0], dy = N.t1[1] - C.t2[1], l = Math.hypot(dx, dy), m2 = Math.max(1, Math.ceil(l / PAS)), a = Math.atan2(dy, dx);
      for (let j = 0; j < m2; j++) { X.push(C.t2[0] + dx * j / m2); Y.push(C.t2[1] + dy * j / m2); A.push(a); K.push(0); E.push(i); F.push(j / m2); }
    }
    const d0 = def.depart | 0, ids = []; E.forEach((e, k) => { if (e === d0) ids.push(k); }); const o = ids.length ? ids[Math.floor(ids.length / 2)] : 0;
    const N = X.length, tr = { def, n: N, x: new Float64Array(N), y: new Float64Array(N), a: new Float64Array(N), k: new Float64Array(N), s: new Float64Array(N), h: new Float32Array(N), arete: new Int16Array(N), part: new Float32Array(N), hw: def.large };
    for (let q = 0; q < N; q++) { const k = (q + o) % N; tr.x[q] = X[k]; tr.y[q] = Y[k]; tr.a[q] = A[k]; tr.k[q] = K[k]; tr.arete[q] = E[k]; tr.part[q] = F[k]; }
    let s = 0; for (let q = 0; q < N; q++) { tr.s[q] = s; const j = (q + 1) % N; s += Math.hypot(tr.x[j] - tr.x[q], tr.y[j] - tr.y[q]); } tr.L = s;
    // le viaduc : une part d'une arête passe en hauteur (une rampe douce de chaque côté)
    if (def.viaduc) { const V = def.viaduc, R = 0.16, lisse = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
      for (let q = 0; q < N; q++) if (tr.arete[q] === V.arete) { const p = tr.part[q]; tr.h[q] = Math.min(lisse((p - V.de + R) / R), lisse((V.a + R - p) / R)); } }
    tr.haut = !!def.viaduc;
    // les virages : un arc par sommet
    tr.virages = [];
    for (let i = 0; i < n; i++) { let q0 = -1, q1 = -1; for (let q = 0; q < N; q++) if (tr.arete[q] === -1 - i) { if (q0 < 0) q0 = q; q1 = q; }
      if (q0 >= 0) tr.virages.push({ s0: tr.s[q0], s1: tr.s[q1] + PAS, sens: coins[i].sens, r: coins[i].r, c: coins[i].c, q0, q1 }); }
    tr.virages.sort((a, b) => a.s0 - b.s0);
    geos.set(def, tr); return tr;
  }
  CI.geometrie = geometrie;
  // le point du tracé à l'abscisse s (interpolé)
  function point(tr, s) {
    s = mod(s, tr.L); let lo = 0, hi = tr.n - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (tr.s[mid] <= s) lo = mid; else hi = mid - 1; }
    const i = lo, j = (i + 1) % tr.n, sj = j ? tr.s[j] : tr.L, f = (s - tr.s[i]) / Math.max(1e-6, sj - tr.s[i]);
    return { i, x: tr.x[i] + (tr.x[j] - tr.x[i]) * f, y: tr.y[i] + (tr.y[j] - tr.y[i]) * f, a: tr.a[i] + ecart(tr.a[j], tr.a[i]) * f };
  }
  CI.point = point;
  // le plus proche échantillon, autour du dernier connu (au croisement du viaduc, on reste sur sa propre branche)
  function projeter(tr, x, y, i0, w) {
    let b = i0, bd = Infinity;
    for (let k = -w; k <= w; k++) { const i = mod(i0 + k, tr.n), dx = x - tr.x[i], dy = y - tr.y[i], d = dx * dx + dy * dy; if (d < bd) { bd = d; b = i; } }
    const a = tr.a[b], dx = x - tr.x[b], dy = y - tr.y[b];
    return { i: b, lat: -dx * Math.sin(a) + dy * Math.cos(a), lon: dx * Math.cos(a) + dy * Math.sin(a) };
  }
  CI.projeter = projeter;

  /* ================= la course ================= */
  function placer(tr, c, prog, lat) { c.prog = prog; c.tour = Math.floor(prog / tr.L); const p = point(tr, prog); c.i = p.i; c.a = p.a; c.lat = lat; c.x = p.x - Math.sin(p.a) * lat; c.y = p.y + Math.cos(p.a) * lat; }
  // n : l'indice du circuit
  CI.nouvelle = function (n) {
    const def = D.CIRCUITS[n], tr = geometrie(def), K = { n, def, tr, t: 0, tours: def.tours, voitures: [], arrives: [], chocs: 0, contacts: 0 };
    const J = { joueur: true, v: 0, teinte: CI.TEINTE, m: 'course' }; placer(tr, J, -24, 0); K.joueur = J; K.voitures.push(J);
    def.adversaires.forEach((a, k) => { const voie = k % 2 ? 0.46 : -0.46, c = { ia: a, v: 0, teinte: CI.TEINTES_IA[k % CI.TEINTES_IA.length], m: 'course', voie, voieCible: voie, k };
      placer(tr, c, -24 + a.avance, voie * tr.hw); K.voitures.push(c); });
    return K;
  };
  const niveau = (K, c) => (K.tr.haut && K.tr.h[c.i] > 0.5 ? 1 : 0);
  CI.niveau = niveau;
  function suivre(K, c) { const tr = K.tr, q = projeter(tr, c.x, c.y, c.i, 14), d = q.i - c.i; if (d < -tr.n / 2) c.tour++; else if (d > tr.n / 2) c.tour--; c.i = q.i; c.lat = q.lat; c.prog = c.tour * tr.L + tr.s[q.i] + q.lon; }
  // le joueur conduit : e = { cap (le cap voulu, ou null), gaz (A tenu) }
  function conduire(K, c, e, dt) {
    const V = D.COURSE.voiture, tr = K.tr; let frotte = 0;
    if (e && typeof e.cap === 'number') { const lim = Math.min(V.braquage, V.adherence / Math.max(30, c.v)) * dt, d = ecart(e.cap, c.a); frotte = Math.max(0, Math.min(1, (Math.abs(d) - 0.45) / 0.6)); c.a += borne(d, -lim, lim); }
    if (e && e.gaz) c.v = Math.min(V.vmax, c.v + V.accel * dt * (1 - 0.3 * c.v / V.vmax)); else c.v = Math.max(0, c.v - V.lache * dt);
    if (frotte && c.v > 60) c.v = Math.max(60, c.v - V.frotte * frotte * dt);   // le pneu frotte : vouloir tourner bien plus que la voiture ne peut la ralentit
    if (Math.abs(c.lat) > tr.hw) { const lim = V.vmax * V.horsPiste; if (c.v > lim) c.v = Math.max(lim, c.v - V.lache * 3 * dt); }   // hors de la chaussée
    c.x += Math.cos(c.a) * c.v * dt; c.y += Math.sin(c.a) * c.v * dt;
    suivre(K, c);
    // la barrière : on ne la passe pas ; on y glisse, plus lentement — jamais d'accident
    const B = tr.hw + V.barriere;
    if (Math.abs(c.lat) > B) { const sg = Math.sign(c.lat), a = tr.a[c.i], nx = -Math.sin(a), ny = Math.cos(a), dl = c.lat - sg * B; c.x -= nx * dl; c.y -= ny * dl; c.lat = sg * B;
      if (!c.contre) { c.v *= V.rebond; K.chocs++; } c.contre = true;
      const long = Math.abs(ecart(a, c.a)) < Math.PI / 2 ? a : a + Math.PI; c.a += ecart(long, c.a) * Math.min(1, 5 * dt); }
    else c.contre = false;
  }
  // les adversaires (et le joueur, une fois la ligne passée) suivent le tracé, dans leur voie
  function rails(K, c, dt) {
    const V = D.COURSE.voiture, tr = K.tr, A = c.ia || { vitesse: 0.3, adresse: 0.9 }, F = V.frein, vp = c.fin ? 34 : V.vmax * A.vitesse, s0 = mod(c.prog, tr.L);
    let cible = vp;
    for (let j = 0; j < 64; j++) { const i = (c.i + j) % tr.n, k = Math.abs(tr.k[i]); if (!k) continue; const d = j ? mod(tr.s[i] - s0, tr.L) : 0, vl = Math.sqrt(V.adherence * A.adresse / k); cible = Math.min(cible, Math.sqrt(vl * vl + 2 * F * d)); }
    // celui qui est devant, dans la même voie et au même niveau : on reste derrière, puis l'on passe de l'autre côté
    let gene = null, gd = 26;
    K.voitures.forEach(o => { if (o === c) return; const dp = o.prog - c.prog; if (dp > 0 && dp < gd && Math.abs(o.lat - c.lat) < 12 && niveau(K, o) === niveau(K, c)) { gene = o; gd = dp; } });
    // (la voie libre un moment, chacun reprend le milieu de la chaussée : en file, on peut les dépasser par le côté)
    if (gene) { cible = Math.min(cible, gene.v * 0.97); c.bloque = (c.bloque || 0) + dt; c.libre = 0; if (c.bloque > 0.6) { c.voieCible = gene.lat > c.lat ? -0.5 : 0.5; c.bloque = 0; } }
    else { c.bloque = 0; c.libre = (c.libre || 0) + dt; if (c.libre > 1.6 && c.ia) c.voieCible = 0; }
    c.v = c.v < cible ? Math.min(cible, c.v + V.accel * dt) : Math.max(cible, c.v - F * dt);
    c.prog += c.v * dt;
    const vise = (c.voieCible === undefined ? 0 : c.voieCible) * tr.hw, dl = borne(vise - c.lat, -tr.hw * 0.8 * dt, tr.hw * 0.8 * dt); c.lat += dl;
    const p = point(tr, c.prog); c.tour = Math.floor(c.prog / tr.L); c.i = p.i; c.a = p.a + borne(dl / Math.max(1e-3, c.v * dt) * 0.5, -0.3, 0.3); c.x = p.x - Math.sin(p.a) * c.lat; c.y = p.y + Math.cos(p.a) * c.lat;
  }
  // les corps : le joueur s'écarte, une voiture sur ses rails ne bouge pas ; celui qui rattrape l'autre ralentit
  function contacts(K) {
    const L = K.voitures, R = 13;
    for (let a = 0; a < L.length; a++) for (let b = a + 1; b < L.length; b++) {
      const p = L[a], q = L[b], J = p.joueur && !p.fin ? p : q.joueur && !q.fin ? q : null;
      if (!J) { if (niveau(K, p) !== niveau(K, q)) continue; const d = Math.hypot(p.x - q.x, p.y - q.y); if (d >= R + 6) continue;   // deux voitures sur leurs rails : celle de derrière reste derrière
        const der = p.prog < q.prog ? p : q, dev = der === p ? q : p; der.prog -= Math.min(4, R + 6 - d); der.v = Math.min(der.v, dev.v); continue; }
      const O = J === p ? q : p; if (niveau(K, J) !== niveau(K, O)) continue;
      const dx = J.x - O.x, dy = J.y - O.y, d = Math.hypot(dx, dy); if (d >= R || d < 1e-3) continue;
      J.x += dx / d * (R - d); J.y += dy / d * (R - d); suivre(K, J);
      const devant = Math.cos(J.a) * (O.x - J.x) + Math.sin(J.a) * (O.y - J.y) > 0; if (devant) J.v = Math.min(J.v, O.v * 0.92); else O.v = Math.min(O.v, J.v * 0.9);
      K.contacts++;
    }
  }
  CI.avancer = function (K, dt, e) {
    const tr = K.tr; K.t += dt;
    K.voitures.forEach(c => { if (c.ia || c.fin) rails(K, c, dt); else conduire(K, c, e, dt); });
    contacts(K);
    K.voitures.forEach(c => { if (!c.fin && c.prog >= K.tours * tr.L) { c.fin = K.t; K.arrives.push(c); if (c.joueur) { c.voie = c.voieCible = borne(c.lat / tr.hw, -0.6, 0.6); } } });
  };
  // l'ordre d'arrivée, puis l'avance de chacun
  CI.classement = K => K.voitures.slice().sort((p, q) => (p.fin && q.fin) ? p.fin - q.fin : p.fin ? -1 : q.fin ? 1 : q.prog - p.prog);
  // la vitesse que permet ce qui vient (à `adresse` de l'adhérence, en ralentissant de `dec`)
  function permise(tr, c, adresse, dec, loin) { const V = D.COURSE.voiture, s0 = mod(c.prog, tr.L); let v = V.vmax;
    for (let j = 0; j < loin; j++) { const i = (c.i + j) % tr.n, k = Math.abs(tr.k[i]); if (!k) continue; const d = j ? mod(tr.s[i] - s0, tr.L) : 0, vl = Math.sqrt(V.adherence * adresse / k); v = Math.min(v, Math.sqrt(vl * vl + 2 * dec * d)); }
    return v; }
  // un pilote, pour les essais : il vise un point du tracé devant lui et lâche A avant les virages.
  // o : { adresse (la part de l'adhérence qu'il ose), regard, bruit (en radians), hasard (une fonction), retard (en secondes) }
  CI.pilote = function (K, o) {
    o = o || {}; const P = K.joueur, tr = K.tr, V = D.COURSE.voiture, ad = o.adresse === undefined ? 0.95 : o.adresse;
    // celui qui est juste devant, dans sa voie : on vise à côté de lui, du côté où il y a de la place
    let lat = 0; K.voitures.forEach(c => { if (c === P) return; const dp = c.prog - P.prog; if (dp > -4 && dp < 46 && Math.abs(c.lat - P.lat) < 16 && niveau(K, c) === niveau(K, P)) lat = c.lat > 0 ? c.lat - 17 : c.lat + 17; });
    lat = borne(lat, -tr.hw + 7, tr.hw - 7);
    const p = point(tr, P.prog + 10 + P.v * (o.regard || 0.2)), px = p.x - Math.sin(p.a) * lat, py = p.y + Math.cos(p.a) * lat;
    let cap = Math.atan2(py - P.y, px - P.x);
    if (o.bruit) { if (!(o._tb > K.t)) { o._tb = K.t + 0.35; o._b1 = ((o.hasard || Math.random)() - 0.5) * o.bruit; } o._b = (o._b || 0) + ((o._b1 || 0) - (o._b || 0)) * 0.08; cap += o._b; }   // une main qui hésite : un écart lent, non un tremblement
    const gaz = P.v < permise(tr, P, ad, V.lache + V.frotte * 0.4, 70);
    if (o.retard) { const q = o._file || (o._file = []); q.push({ t: K.t, cap, gaz }); while (q.length > 1 && q[1].t <= K.t - o.retard) q.shift(); return { cap: q[0].cap, gaz: q[0].gaz }; }
    return { cap, gaz };
  };

  /* ================= la moto de Sâlim =================
     Sâlim pilote, sur ses rails ; Idris se penche. Le signe d'un virage paraît `annonce` points avant lui. Dans l'arc, s'il se
     penche vers l'intérieur (le joystick ou les flèches, à `angle` degrés près), la moto garde sa vitesse de virage ; sinon,
     elle ralentit (`mal`). Un virage est « bien pris » si Idris s'est penché `bien` de son arc. */
  CI.nouvelleBalade = function () {
    const def = D.COURSE.moto, tr = geometrie(def), K = { moto: true, def, tr, t: 0, prog: -12, v: 0, lat: 0, penche: 0, virages: tr.virages.map(v => Object.assign({ tenu: 0, duree: 0, fait: false, bien: false }, v)) };
    const p = point(tr, K.prog); K.i = p.i; K.x = p.x; K.y = p.y; K.a = p.a; return K;
  };
  CI.avancerBalade = function (K, dt, e) {
    const M = D.COURSE.moto, tr = K.tr; K.t += dt;
    const tour = Math.floor(K.prog / tr.L), s = mod(K.prog, tr.L), p0 = point(tr, K.prog);
    let vir = null; if (tour === 0) for (const v of K.virages) { if (!v.fait && s >= v.s0 - M.annonce && s <= v.s1) { vir = v; break; } }
    let penche = false; if (vir && e && typeof e.cap === 'number') { const dedans = p0.a + vir.sens * Math.PI / 2; penche = Math.abs(ecart(e.cap, dedans)) < M.angle * Math.PI / 180; }
    const arc = !!vir && s >= vir.s0; if (arc) { vir.duree += dt; if (penche) vir.tenu += dt; }
    let cible = M.vmax;
    if (tour === 0) K.virages.forEach(v => { if (v.fait) return; const vl = Math.sqrt(M.adherence * v.r), d = v.s0 - s; if (d > 0) cible = Math.min(cible, Math.sqrt(vl * vl + 2 * M.frein * d)); else if (s <= v.s1) cible = Math.min(cible, vl * (penche ? 1 : M.mal)); });
    if (tour > 0) cible = 30;
    K.v = K.v < cible ? Math.min(cible, K.v + M.accel * dt) : Math.max(cible, K.v - M.frein * dt);
    K.prog += K.v * dt;
    const s2 = mod(K.prog, tr.L), t2 = Math.floor(K.prog / tr.L);
    K.virages.forEach(v => { if (!v.fait && ((t2 === 0 && s2 > v.s1) || t2 > 0)) { v.fait = true; v.bien = v.duree > 0 && v.tenu / v.duree >= M.bien; } });
    K.signe = vir; K.penche = penche && vir ? vir.sens : 0; K.malPenche = arc && !penche; K.bienPenche = arc && penche;
    const p = point(tr, K.prog); K.i = p.i; K.x = p.x; K.y = p.y; K.a = p.a;
    if (K.prog >= tr.L && !K.fini) K.fini = K.t;
  };
  // pour les essais : un passager qui se penche (ou non) à chaque virage
  CI.piloteMoto = function (K, o) { o = o || {}; const v = K.signe; if (!v || o.jamais) return { cap: null }; const p = point(K.tr, K.prog); return { cap: p.a + v.sens * Math.PI / 2 }; };

  /* ================= ce qui suit ne vit que dans la page ================= */
  if (typeof document === 'undefined') return;
  const G = I.gfx, W = I.world, S = I.script, $ = I.$;
  const textes = () => (((I.sagas.idris || {}).cite || {}).course) || {};
  CI.textes = textes;
  const tactile = () => document.body.classList.contains('touch');

  /* ----- la partie : cite.course ----- */
  CI.etat = function () { const e = I.cite.etat(); let c = e.course; if (!c || typeof c !== 'object' || Array.isArray(c)) c = e.course = { salim: 0, gagnes: [], temps: [], primes: 0 };
    if (!Array.isArray(c.gagnes)) c.gagnes = []; if (!Array.isArray(c.temps)) c.temps = []; if (!Number.isInteger(c.salim)) c.salim = 0; return c; };
  const lu = () => { const c = I.save.data.cite && I.save.data.cite.course; return c && typeof c === 'object' ? c : {}; };
  CI.ouvert = n => n === 0 ? (lu().salim | 0) >= 2 : !!(lu().gagnes || [])[n - 1];
  // le dernier maillon lit `_2084_salim` : Idris a couru avec Sâlim (frame.js, e1)
  CI.drapeaux = function (F) { if ((lu().salim | 0) >= 2) F._2084_salim = true; else delete F._2084_salim; };

  /* ----- les gens du circuit : Sâlim et sa moto, l'organisateur ----- */
  const pnj = id => W.npcs.find(n => n.id === id && W.map && n.map === W.map.id) || null;
  CI.salim = () => pnj('salim_q'); CI.organisateur = () => pnj('q_organisateur');
  // la place de la moto : sur le trottoir, devant l'entrée des stands
  CI.parking = () => { const s = W.spotPx('circuit'); return s ? { x: s[0] - 44, y: s[1] - 32 } : null; };
  function garer() { const TR = I.trafic, P = CI.parking(); if (!TR || !P) return; TR.garees = TR.garees.filter(v => v.m !== 'moto'); TR.garees.push({ m: 'moto', c: CI.TEINTE_MOTO, d: 'd', x: P.x, y: P.y }); }
  // à chaque arrivée dans les quartiers (cite.js, C.ouvre) : Sâlim est là s'il est déjà venu, sa moto garée
  CI.ouvre = function () { if (!I.cite.ici()) return; const s = CI.salim(); if (!s) return; const e = CI.etat();
    if (e.salim >= 1) { s.hidden = false; W.place(s); W.ecarter(s); garer(); } else s.hidden = true; };
  // la moto, dans la ville : garée, ou qui arrive, Sâlim dessus
  CI.dessinerMoto = function (c, v, cx, cy, t, lights) {
    const x = Math.round(v.x - cx), y = Math.round(v.y - cy), cote = v.d === 'g' || v.d === 'd';
    c.fillStyle = 'rgba(20,12,30,.36)'; c.beginPath(); c.ellipse(x, y + 0.5, cote ? 15 : 6, cote ? 3 : 3.5, 0, 0, 6.3); c.fill();
    if (v.pilote) { const s = CI.salim(); if (s && s.sheet) c.drawImage(s.sheet, 0, (v.d === 'g' ? 1 : 2) * 24, 16, 24, v.d === 'g' ? x - 2 : x - 14, y - 30, 16, 24); }   // Sâlim en selle : la moto le cache jusqu'aux hanches
    c.drawImage(G.obj('qmoto', { c: v.c, d: v.d }), x - 22, y - 28);
    if (cote) { const sg = v.d === 'd' ? 1 : -1; lights.push({ x: x + sg * 11, y: y - 15, r: v.roule ? 22 : 10, color: '#fff2d0', a: v.roule ? 0.6 : 0.3 }); }
  };
  // Sâlim arrive : la moto vient par l'avenue du sud et se gare sur le trottoir ; les voitures l'attendent
  function arrivee() {
    return new Promise(res => {
      const TR = I.trafic, P = CI.parking(); if (!TR || !P) { res(); return; }
      const x0 = Math.max(40, P.x - 250), pts = [[x0, 493], [P.x - 18, 493], [P.x, P.y]], L = [0];
      for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      TR.garees = TR.garees.filter(v => v.m !== 'moto'); const v = { m: 'moto', c: CI.TEINTE_MOTO, d: 'd', x: x0, y: 493, roule: true, pilote: true }; TR.garees.push(v); TR.gele = true;
      { const f = TR.pied({ m: 'moto', d: 'd', x: P.x, y: P.y }), p = W.player; if (p.x + 6 > f[0] && p.x - 6 < f[2] && p.y + 2 > f[1] && p.y - 7 < f[3]) { const q = W.resolve([null, 0, 0], W.map.id, p, [Math.floor((P.x + 40) / 16), Math.floor(P.y / 16)]); if (q) { p.x = q[0]; p.y = q[1]; W.resetTrail(); } } }   // (personne n'est garé sur Idris)
      const s = CI.salim(); if (s) s.hidden = true;
      let d = 0, last = performance.now(); I.audio.moteur(true); I.audio.regime(0.5, 0);
      const fin = () => { v.x = P.x; v.y = P.y; v.roule = false; v.pilote = false; TR.gele = false; I.audio.moteur(false); if (s) { s.hidden = false; W.place(s); W.ecarter(s); } res(); };
      const pas = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; d += (d < L[1] ? 150 : 60) * dt * I.speed;
        if (d >= L[L.length - 1] || I.scene !== W) return fin();
        let k = 1; while (k < L.length - 1 && d > L[k]) k++; const f = (d - L[k - 1]) / (L[k] - L[k - 1]); v.x = pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * f; v.y = pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * f;
        I.audio.regime(d < L[1] ? 0.55 : 0.2, 0); requestAnimationFrame(pas); };
      requestAnimationFrame(pas);
    });
  }
  const tourner = (n, vers) => { if (!n) return; const p = vers || W.player, dx = p.x - n.x, dy = p.y - n.y; n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); };
  const dire = (qui, t) => (t ? S.run([['say', qui, t]]) : Promise.resolve());
  // peut-on recevoir l'outil « virages » maintenant (ou l'a-t-on déjà) ? Sinon Sâlim ne vient pas encore : le besoin se représentera
  const peutApprendre = () => !I.lecons || !I.lecons.actif() || I.lecons.recu('virages') || I.lecons.pret(1);
  CI.occupe = false;
  // le joueur s'approche du circuit pour la première fois (world.js, à chaque pas où il a la main)
  CI.tic = function () {
    if (CI.occupe || !I.cite || !I.cite.ici() || I.debug.auto || I.debug.walk || S.busy || W.lock || I.ui.menuOpen || I.battle.active) return;
    const e = lu(); if ((e.salim | 0) !== 0 || !CI.salim()) return;
    const sp = W.spotPx('circuit'); if (!sp || Math.hypot(W.player.x - sp[0], W.player.y - (sp[1] - 6)) > 46) return;
    if (!peutApprendre()) return;
    CI.salimVient();
  };
  CI.salimVient = async function () {
    if (CI.occupe) return; CI.occupe = true; const T = textes(), A = T.arrivee || {}; let oui = false;
    S.depth++; W.stop(); I.input.clearHeld();
    try {
      CI.journal.push({ quoi: 'arrivee' });
      await arrivee(); const s = CI.salim(); if (!s) return;
      CI.etat().salim = 1; I.save.store(); tourner(s); W.player.dir = W.player.x > s.x ? 1 : 2;
      await dire(s.id, (A.salim || [])[0]); await dire('idris', A.idris); await dire(s.id, (A.salim || [])[1]);
      S.hideDialog(); oui = (await S.menuPick(T.offre || '', [{ t: T.monter }, { t: T.pasMaintenant, retour: true }])) === 0;
      CI.journal.push({ quoi: oui ? 'monte' : 'pas-maintenant' });
      if (!oui) await dire(s.id, T.refus);
    } finally { S.depth--; S.hideDialog(); CI.occupe = false; }
    if (oui) await CI.balade(true); else W.checkpoint();
  };
  // parler à Sâlim ou à l'organisateur (world.js, W.interact) ; le joueur de test du moteur les ignore
  CI.parle = function (n) {
    if (!n || !I.cite || !I.cite.ici() || I.debug.auto || I.debug.walk || CI.occupe) return false;
    if (n.id === 'salim_q') { CI.menuSalim(); return true; } if (n.id === 'q_organisateur') { CI.menuCourses(); return true; } return false;
  };
  CI.menuSalim = async function () {
    if (CI.occupe) return; CI.occupe = true; const T = textes(), e = CI.etat(), s = CI.salim(); let k = -1, premiere = e.salim < 2;
    S.depth++;
    try {
      tourner(s);
      if (premiere) { await dire(s.id, T.revoir); S.hideDialog(); if (!peutApprendre()) { await dire(s.id, T.plusTard); return; } k = await S.menuPick(T.offre || '', [{ t: T.monter }, { t: T.pasMaintenant, retour: true }]); if (k !== 0) await dire(s.id, T.refus); }
      else { const L = T.salim || [], i = (e.parle | 0) % Math.max(1, L.length); e.parle = (e.parle | 0) + 1; I.save.store(); await dire(s.id, L[i]); S.hideDialog();
        k = await S.menuPick(T.encoreQ || '', [{ t: T.encore }, { t: T.uneAutreFois, retour: true }]); }
      CI.journal.push({ quoi: 'salim', k });
    } finally { S.depth--; S.hideDialog(); CI.occupe = false; }
    if (k === 0) await CI.balade(premiere);
  };
  // le tour derrière Sâlim
  CI.balade = async function (premiere) {
    const T = textes(), s = CI.salim(); if (!s) return null; let r = null;
    CI.occupe = true; S.depth++;
    try {
      if (I.lecons) I.lecons.sequence();   // un tour de moto est une séquence, comme un combat
      const deja = I.lecons && I.lecons.actif() && I.lecons.recu('virages');
      if (!deja && (premiere || (I.lecons && I.lecons.actif()))) { let dit = false; const donne = I.lecons ? I.lecons.proposer('virages', () => { dit = true; }) : (dit = true);
        if (donne && dit) { const t = ((I.sagas.coeur || {}).lecons || {}).virages, txt = typeof t === 'string' ? t : t && (tactile() ? t.doigt : t.clavier); CI.journal.push({ quoi: 'lecon' }); await dire(s.id, txt); } }
      if (I.lecons && I.lecons.actif() && !I.lecons.recu('virages')) { await dire(s.id, T.plusTard); return null; }
      await dire(s.id, T.depart); S.hideDialog();
      r = await rouler(CI.nouvelleBalade());
      if (r && !r.quitte) { CI.etat().salim = 2; I.save.store();
        if (!premiere && I.lecons) I.lecons.reemploi('virages');
        const F = T.fins || [], b = r.bien, n = r.total; await dire(s.id, b === n ? F[0] : b * 2 >= n ? F[1] : F[2]);
        if (premiere) for (const l of (T.apres || [])) await dire(s.id, l); }
      else if (r) { CI.etat().salim = Math.max(1, CI.etat().salim); await dire(s.id, T.descendu); }
    } finally { S.depth--; S.hideDialog(); CI.occupe = false; }
    W.checkpoint(); return r;
  };
  // l'organisateur : les cinq circuits, chacun scellé tant que le précédent n'est pas gagné
  CI.libelle = function (i) {
    const T = textes(), C = (T.circuits || [])[i] || {}, def = D.CIRCUITS[i], e = lu(), rec = (e.temps || [])[i], f = s => chrono(s / 1000);
    if (!CI.ouvert(i)) { const avant = ((T.circuits || [])[i - 1] || {}).nom || ''; return { html: `<b>${I.esc(C.nom || '')}</b><br><small>${I.t('Scellé : gagne d’abord « {avant} ».', { avant: I.esc(avant) })}</small>`, ferme: true, i }; }
    const bits = [I.esc(C.dit || ''), I.t('{n} tour¦{n} tours', { n: def.tours })];
    if (def.temps) bits.push(I.t('à battre : {temps}', { temps: chrono(def.temps) }));
    if (rec) bits.push(I.t('ton record : {temps}', { temps: f(rec) }));
    return { html: `<b>${I.esc(C.nom || '')}</b>${(e.gagnes || [])[i] ? ' <span class="gagne">✓</span>' : ''}<br><small>${bits.join(' · ')}</small>`, i };
  };
  CI.menuCourses = async function () {
    if (CI.occupe) return; CI.occupe = true; const T = textes(), O = T.organisateur || {}, o = CI.organisateur(), e = CI.etat(); let n = -1;
    S.depth++;
    try {
      tourner(o);
      if (e.salim < 2 || (I.lecons && I.lecons.actif() && !I.lecons.recu('virages'))) { await dire(o.id, O.avant); CI.journal.push({ quoi: 'organisateur', avant: true }); return; }
      await dire(o.id, (O.accueil || [])[(e.courses | 0) % Math.max(1, (O.accueil || []).length)]); S.hideDialog();
      const opts = D.CIRCUITS.map((d, i) => CI.libelle(i)).concat([{ t: I.t('Retour'), retour: true }]);
      const k = await S.menuPick(O.choix || '', opts); n = k < D.CIRCUITS.length ? k : -1;
      CI.journal.push({ quoi: 'organisateur', n });
    } finally { S.depth--; S.hideDialog(); CI.occupe = false; }
    if (n >= 0) await CI.courir(n);
  };
  CI.courir = async function (n) {
    if (!CI.ouvert(n)) return null; CI.occupe = true; let r = null; S.depth++;
    try { if (I.lecons) I.lecons.sequence(); r = await rouler(CI.nouvelle(n)); }
    finally { S.depth--; S.hideDialog(); CI.occupe = false; }
    W.checkpoint(); return r;
  };

  /* ================= la peinture d'un tracé =================
     Les rues du quartier, vues de dessus, au même crépuscule : les dalles, les îlots (des toits de verre, des jardins, des
     places), les trottoirs et leurs lampadaires, une barrière claire, la chaussée, ses lignes, ses vibreurs, la ligne de
     départ en damier ; à côté du départ, des gradins vides. Ni lettre, ni chiffre, ni marque, ni logo, ni édifice religieux,
     ni monument ; personne n'est ajouté au décor. De nuit (le cinquième), les fenêtres et les lampadaires. Le viaduc : sa
     part haute est peinte à part, posée sur ceux qui passent dessous. */
  const fonds = {};
  G.surDefinition.push(() => { Object.keys(fonds).forEach(k => { delete fonds[k]; }); }); if (G.surLumiere) G.surLumiere.push(() => { Object.keys(fonds).forEach(k => { delete fonds[k]; }); });
  function ligne(c, tr, decal, de, a) { c.beginPath(); let premier = true;
    for (let q = de; q <= a; q++) { const i = mod(q, tr.n), nx = -Math.sin(tr.a[i]), ny = Math.cos(tr.a[i]), x = tr.x[i] + nx * decal, y = tr.y[i] + ny * decal; if (premier) { c.moveTo(x, y); premier = false; } else c.lineTo(x, y); } }
  function tout(c, tr, decal) { ligne(c, tr, decal, 0, tr.n); c.closePath(); }
  function peindre(def) {
    const tr = geometrie(def), key = (def.id || 'moto') + '|' + G.D + (G.lisse ? 'l' : '') + '|' + G.lumNom;
    if (fonds[key]) return fonds[key];
    const Wd = CI.LARGE, Hd = CI.HAUT, cv = G.toile(Wd, Hd), c = cv.getContext('2d'), r = I.rng(I.hash('circuit|' + (def.id || 'moto'))), nuit = !!def.nuit, hw = tr.hw, hd1 = G.D === 1;
    const lampes = [];
    // le sol : les dalles du quartier
    for (let y = 0; y < Hd; y += 16) for (let x = 0; x < Wd; x += 16) c.drawImage(G.tile('cdalle', (x / 16 + (y / 16) * 3) % 4), x, y);
    // ce que la chaussée et ses trottoirs prennent : un masque à un quart
    const mq = G.mk(Wd / 4, Hd / 4), mc = mq.getContext('2d'); mc.scale(0.25, 0.25); mc.strokeStyle = '#000'; mc.lineJoin = 'round'; mc.lineWidth = 2 * (hw + 26); tout(mc, tr, 0); mc.stroke();
    const md = mc.getImageData(0, 0, mq.width, mq.height).data, libre = (x0, y0, w, h) => { for (let y = Math.max(0, Math.floor(y0 / 4)); y < Math.min(mq.height, Math.ceil((y0 + h) / 4)); y++) for (let x = Math.max(0, Math.floor(x0 / 4)); x < Math.min(mq.width, Math.ceil((x0 + w) / 4)); x++) if (md[(y * mq.width + x) * 4 + 3] > 20) return false; return true; };
    // les îlots : des toits de verre, des jardins, des places
    const TOITS = ['#3a2c56', '#2e3a5e', '#4a3048', '#28304a', '#3e2a4a'], C0 = 44;
    for (let y = 8; y + C0 <= Hd - 8; y += C0) for (let x = 8; x + C0 <= Wd - 8; x += C0) {
      if (!libre(x, y, C0, C0)) continue; const kind = r();
      if (kind < 0.62) { const col = TOITS[Math.floor(r() * TOITS.length)], m = 3 + Math.floor(r() * 3), w = C0 - 2 * m, h = C0 - 2 * m;
        c.fillStyle = 'rgba(20,10,30,.45)'; c.fillRect(x + m + 3, y + m + 4, w, h);   // l'ombre au sol, vers le bas et la droite (le couchant)
        const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, G.shade(col, 1.35)); g.addColorStop(0.5, col); g.addColorStop(1, G.shade(col, 0.75)); c.fillStyle = g; c.fillRect(x + m, y + m, w, h);
        c.fillStyle = 'rgba(255,190,140,.35)'; c.fillRect(x + m, y + m, w, 0.75); c.fillRect(x + m, y + m, 0.75, h);   // le rebord, pris par la lumière
        c.fillStyle = 'rgba(255,160,200,.12)'; c.beginPath(); c.moveTo(x + m, y + m + h * 0.6); c.lineTo(x + m + w * 0.6, y + m); c.lineTo(x + m + w * 0.85, y + m); c.lineTo(x + m, y + m + h * 0.85); c.closePath(); c.fill();   // un reflet de verre, en biais
        for (let k = 0; k < 3; k++) { const bx = x + m + 4 + r() * (w - 14), by = y + m + 4 + r() * (h - 14), bw = 4 + r() * 6, bh = 3 + r() * 5; c.fillStyle = G.shade(col, 0.6); c.fillRect(bx, by, bw, bh); c.fillStyle = G.shade(col, 1.5); c.fillRect(bx, by, bw, 0.5); }   // ce qui se pose sur un toit : des caissons, sans un signe
        const nf = nuit ? 9 : 3; for (let k = 0; k < nf; k++) { c.fillStyle = nuit ? 'rgba(255,214,150,.75)' : 'rgba(255,230,190,.35)'; c.fillRect(x + m + 2 + Math.floor(r() * (w - 6)), y + m + 2 + Math.floor(r() * (h - 6)), 1.5, 1.5); } }
      else if (kind < 0.8) { for (let yy = y + 2; yy < y + C0 - 2; yy += 16) for (let xx = x + 2; xx < x + C0 - 2; xx += 16) c.drawImage(G.tile('qgazon', 0), xx, yy, Math.min(16, x + C0 - 2 - xx), Math.min(16, y + C0 - 2 - yy));
        for (let k = 0; k < 3; k++) { const tx = x + 8 + r() * (C0 - 16), ty = y + 8 + r() * (C0 - 16); c.fillStyle = 'rgba(10,20,10,.35)'; c.beginPath(); c.arc(tx + 2, ty + 2.5, 5.5, 0, TAU); c.fill(); c.fillStyle = '#2c4428'; c.beginPath(); c.arc(tx, ty, 5.5, 0, TAU); c.fill(); c.fillStyle = '#3c5a34'; c.beginPath(); c.arc(tx - 1.2, ty - 1.4, 3.4, 0, TAU); c.fill(); } }
      else { for (let yy = y + 2; yy < y + C0 - 2; yy += 16) for (let xx = x + 2; xx < x + C0 - 2; xx += 16) c.drawImage(G.tile('qparvis', (xx + yy) % 4), xx, yy, Math.min(16, x + C0 - 2 - xx), Math.min(16, y + C0 - 2 - yy));
        const px = x + C0 / 2, py = y + C0 / 2; c.fillStyle = 'rgba(10,20,10,.3)'; c.beginPath(); c.arc(px + 2, py + 2, 6, 0, TAU); c.fill(); c.fillStyle = '#3a5a30'; for (let k = 0; k < 7; k++) { const a = k * TAU / 7; c.beginPath(); c.ellipse(px + Math.cos(a) * 3.5, py + Math.sin(a) * 3.5, 3.6, 1.3, a, 0, TAU); c.fill(); } c.fillStyle = '#6a5038'; c.beginPath(); c.arc(px, py, 1.2, 0, TAU); c.fill(); }   // un dattier, vu d'en haut
    }
    c.lineJoin = 'round'; c.lineCap = 'butt';
    // les trottoirs, la barrière, la chaussée
    c.strokeStyle = '#8a7660'; c.lineWidth = 2 * (hw + 15); tout(c, tr, 0); c.stroke();
    c.strokeStyle = 'rgba(60,40,30,.35)'; c.lineWidth = 0.75; tout(c, tr, hw + 15); c.stroke(); tout(c, tr, -hw - 15); c.stroke();
    for (let q = 0; q < tr.n; q += 3) { const i = q, nx = -Math.sin(tr.a[i]), ny = Math.cos(tr.a[i]); [1, -1].forEach(sg => { c.fillStyle = 'rgba(60,40,30,.28)'; c.fillRect(tr.x[i] + nx * sg * (hw + 5 + 10 * r()), tr.y[i] + ny * sg * (hw + 5 + 10 * r()), 0.75, 0.75); }); }   // les joints des dalles du trottoir
    c.strokeStyle = '#d8d0c8'; c.lineWidth = 2 * (hw + 3.2); tout(c, tr, 0); c.stroke();
    c.strokeStyle = '#34303c'; c.lineWidth = 2 * hw; tout(c, tr, 0); c.stroke();
    c.strokeStyle = 'rgba(40,30,40,.6)'; c.lineWidth = 0.75; tout(c, tr, hw + 3.2); c.stroke(); tout(c, tr, -hw - 3.2); c.stroke();
    // le grain de l'asphalte
    for (let i = 0; i < tr.n; i++) { const nx = -Math.sin(tr.a[i]), ny = Math.cos(tr.a[i]); for (let k = 0; k < 4; k++) { const l = (r() * 2 - 1) * (hw - 1); c.fillStyle = ['#3c3846', '#2e2a36', '#423c4c', '#3a3644'][k]; c.fillRect(tr.x[i] + nx * l, tr.y[i] + ny * l, hd1 ? 1 : 0.5, hd1 ? 1 : 0.5); } }
    // les lignes : le bord, l'axe en tirets
    c.strokeStyle = 'rgba(236,226,210,.7)'; c.lineWidth = hd1 ? 1 : 0.75; tout(c, tr, hw - 2.5); c.stroke(); tout(c, tr, -hw + 2.5); c.stroke();
    c.setLineDash([7, 9]); c.strokeStyle = 'rgba(236,226,210,.4)'; tout(c, tr, 0); c.stroke(); c.setLineDash([]);
    // les vibreurs, rouge et blanc, au bord extérieur et à la corde des virages serrés
    tr.virages.forEach(v => { if (v.r > 70) return; [[-v.sens * (hw - 1.6), 1], [v.sens * (hw - 1.6), 0.6]].forEach(([decal, part]) => { const q0 = v.q0, q1 = v.q1, mil = (q0 + q1) / 2, dem = (q1 - q0) / 2 * part;
      for (let q = Math.round(mil - dem), k = 0; q < Math.round(mil + dem); q += 2, k++) { c.strokeStyle = k % 2 ? '#e8e0d0' : '#c8283c'; c.lineWidth = 2.6; ligne(c, tr, decal, q, q + 2); c.stroke(); } }); });
    // la ligne de départ, en damier ; sur la grille, deux traits par place
    { const a = tr.a[0], nx = -Math.sin(a), ny = Math.cos(a), tx = Math.cos(a), ty = Math.sin(a);
      for (let l = -hw + 1, k = 0; l < hw - 1; l += 3, k++) for (let u = 0; u < 2; u++) { c.fillStyle = (k + u) % 2 ? '#e8e0d0' : '#16141c'; c.beginPath(); const x = tr.x[0] + nx * l + tx * (u * 3 - 3), y = tr.y[0] + ny * l + ty * (u * 3 - 3); c.moveTo(x, y); c.lineTo(x + nx * 3, y + ny * 3); c.lineTo(x + nx * 3 + tx * 3, y + ny * 3 + ty * 3); c.lineTo(x + tx * 3, y + ty * 3); c.closePath(); c.fill(); } }
    // à côté du départ, des gradins vides (de l'autre côté du trottoir)
    { const a = tr.a[0], nx = -Math.sin(a), ny = Math.cos(a), sg = (tr.y[0] + ny * 60 < Hd - 20 && tr.y[0] + ny * 60 > 20 && tr.x[0] + nx * 60 > 20 && tr.x[0] + nx * 60 < Wd - 20) ? 1 : -1;
      c.save(); c.translate(tr.x[0] + nx * sg * (hw + 17), tr.y[0] + ny * sg * (hw + 17)); c.rotate(a + (sg > 0 ? 0 : Math.PI));
      c.fillStyle = 'rgba(20,10,30,.4)'; c.fillRect(-56, 3, 116, 26); for (let k = 0; k < 4; k++) { c.fillStyle = k % 2 ? '#584a52' : '#6c5c64'; c.fillRect(-58, k * 6, 116, 6); for (let x = -56; x < 56; x += 5) { c.fillStyle = (x / 5 + k) % 2 ? '#b83a4e' : '#2a8a9a'; c.fillRect(x, k * 6 + 1.5, 2.5, 2.5); } }
      c.restore(); }
    // les lampadaires, sur les trottoirs (un de chaque côté, en quinconce)
    for (let s = 40, k = 0; s < tr.L; s += 96, k++) { const p = point(tr, s), sg = k % 2 ? 1 : -1, nx = -Math.sin(p.a), ny = Math.cos(p.a), x = p.x + nx * sg * (hw + 9), y = p.y + ny * sg * (hw + 9), col = k % 3 ? '#ffd9a0' : '#ffc0e0';
      const g = c.createRadialGradient(x, y, 1, x, y, 26); g.addColorStop(0, nuit ? 'rgba(255,220,160,.42)' : 'rgba(255,220,160,.22)'); g.addColorStop(1, 'rgba(255,220,160,0)'); c.fillStyle = g; c.fillRect(x - 26, y - 26, 52, 52);
      c.fillStyle = '#2a2632'; c.beginPath(); c.arc(x, y, 1.8, 0, TAU); c.fill(); c.fillStyle = '#fff0c8'; c.beginPath(); c.arc(x, y, 0.9, 0, TAU); c.fill(); lampes.push([x, y, col]); }
    // de nuit : tout s'assombrit, sauf les fenêtres et les lampes
    if (nuit) { c.fillStyle = 'rgba(10,12,40,.42)'; c.fillRect(0, 0, Wd, Hd); lampes.forEach(([x, y]) => { const g = c.createRadialGradient(x, y, 1, x, y, 30); g.addColorStop(0, 'rgba(255,214,150,.4)'); g.addColorStop(1, 'rgba(255,214,150,0)'); c.fillStyle = g; c.fillRect(x - 30, y - 30, 60, 60); }); }
    // le viaduc : l'ombre de sa part haute tombe au sol ; son tablier est peint à part (posé sur ceux qui passent dessous)
    let haut = null;
    if (tr.haut) { const seg = []; for (let q = 0; q < tr.n; q++) if (tr.h[q] > 0.01) seg.push(q); const q0 = seg[0], q1 = seg[seg.length - 1];
      c.save(); c.strokeStyle = 'rgba(20,10,30,.42)'; c.lineWidth = 2 * hw + 10; for (let q = q0; q < q1; q++) { const h = tr.h[q]; c.save(); c.translate(7 * h, 9 * h); ligne(c, tr, 0, q, q + 1); c.stroke(); c.restore(); } c.restore();
      for (let q = q0; q < q1; q += 14) { if (tr.h[q] < 0.7) continue; [hw - 3, -hw + 3].forEach(l => { const nx = -Math.sin(tr.a[q]), ny = Math.cos(tr.a[q]); c.fillStyle = '#4a3e48'; c.fillRect(tr.x[q] + nx * l + 4, tr.y[q] + ny * l + 6, 4, 4); }); }   // les piles
      haut = G.toile(Wd, Hd); const h2 = haut.getContext('2d'); h2.lineJoin = 'round';
      h2.strokeStyle = '#b8aeb8'; h2.lineWidth = 2 * hw + 8; ligne(h2, tr, 0, q0, q1); h2.stroke();
      h2.strokeStyle = '#7a6e7a'; h2.lineWidth = 2 * hw + 4; ligne(h2, tr, 0, q0, q1); h2.stroke();
      h2.strokeStyle = '#38343f'; h2.lineWidth = 2 * hw; ligne(h2, tr, 0, q0, q1); h2.stroke();
      h2.strokeStyle = 'rgba(236,226,210,.7)'; h2.lineWidth = hd1 ? 1 : 0.75; ligne(h2, tr, hw - 2.5, q0, q1); h2.stroke(); ligne(h2, tr, -hw + 2.5, q0, q1); h2.stroke();
      h2.setLineDash([7, 9]); h2.strokeStyle = 'rgba(236,226,210,.4)'; ligne(h2, tr, 0, q0, q1); h2.stroke(); h2.setLineDash([]);
      if (nuit) { h2.fillStyle = 'rgba(10,12,40,.42)'; h2.globalCompositeOperation = 'source-atop'; h2.fillRect(0, 0, Wd, Hd); h2.globalCompositeOperation = 'source-over'; } }
    // le plan, pour le coin de l'image
    const plan = G.toile(92, 62), pc = plan.getContext('2d'); pc.scale(92 / Wd, 62 / Hd); pc.strokeStyle = 'rgba(255,236,200,.85)'; pc.lineWidth = 2 * hw; pc.lineJoin = 'round'; tout(pc, tr, 0); pc.stroke();
    return (fonds[key] = { fond: cv, haut, plan, lampes, tr });
  }
  CI.peindre = peindre;

  /* ================= la scène ================= */
  const chrono = s => { s = Math.max(0, s); const m = Math.floor(s / 60), r = s - m * 60; return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1); };
  CI.chrono = chrono;
  // ce que veut le joueur : le cap (le joystick, ou les flèches) et A tenu
  function entree() {
    const h = I.input.held; let cap = null;
    if (typeof I.input.joyAngle === 'number') cap = I.input.joyAngle;
    else { const dx = (h.right ? 1 : 0) - (h.left ? 1 : 0), dy = (h.down ? 1 : 0) - (h.up ? 1 : 0); if (dx || dy) cap = Math.atan2(dy, dx); }
    return { cap, gaz: !!I.input.aTenu };
  }
  CI.entree = entree;
  // pendant la course (et le compte à rebours), le joystick mène, comme en exploration (ui.js : il donne huit directions et un cap)
  CI.mene = () => { const K = CI.K; return !!K && I.scene === CI.scene && !K.pause && (K.mode === 'course' || K.mode === 'compte'); };
  function pas(K, dt) {
    if (K.mode === 'compte') { const avant = Math.ceil(K.compte); K.compte -= dt; const apres = Math.ceil(K.compte); if (apres < avant) { if (apres > 0) I.audio.sfx('blip'); else I.audio.sfx('ok'); } if (K.compte <= 0) { K.mode = 'course'; CI.journal.push({ quoi: 'partez', moto: !!K.moto }); } return; }
    if (K.mode !== 'course' && K.mode !== 'arrivee') return;
    const pil = I.debug.pilote, e = K.mode === 'course' ? (pil ? (K.moto ? CI.piloteMoto(K, pil) : CI.pilote(K, pil)) : entree()) : null;
    if (K.moto) { CI.avancerBalade(K, dt, e); if (K.mode === 'course' && K.fini) { K.mode = 'arrivee'; K.tA = 0; } }
    else { CI.avancer(K, dt, e || {}); if (K.mode === 'course' && K.joueur.fin) { K.mode = 'arrivee'; K.tA = 0; } }
    if (K.mode === 'arrivee') { K.tA += dt; if (K.tA > 1.4 && K.resoudre) { const f = K.resoudre; K.resoudre = null; f({ fini: true }); } }
  }
  CI.scene = {
    update(dt) { const K = CI.K; if (!K) return; K.vu = (K.vu || 0) + dt; if (!K.pause) { const n = Math.max(1, I.debug.accelCourse | 0); for (let k = 0; k < n; k++) pas(K, Math.min(dt, 0.05)); }
      hud(K); bruit(K); },
    render() { return dessiner(CI.K); }
  };
  function bruit(K) {
    if (!K || K.pause || K.mode === 'podium') { I.audio.regime(0, 0); return; }
    const V = K.moto ? D.COURSE.moto.vmax : D.COURSE.voiture.vmax, v = K.moto ? K.v : K.joueur.v;
    let autres = 0; if (!K.moto) K.voitures.forEach(c => { if (c.joueur) return; const d = Math.hypot(c.x - K.joueur.x, c.y - K.joueur.y); autres = Math.max(autres, borne(1 - d / 160, 0, 1) * (c.v / V)); });
    I.audio.regime(borne(v / V + (K.mode === 'compte' && I.input.aTenu ? 0.35 : 0), 0, 1), autres);
  }
  // la caméra suit celui qui mène, un peu en avant de lui, au milieu de ce qu'on voit (l'image peut être rognée : G.view)
  function camera(K, x, y, a, v) {
    const V = G.view, ax = Math.cos(a) * Math.min(46, v * 0.3), ay = Math.sin(a) * Math.min(34, v * 0.22);
    const cx = x + ax - (V.x + V.w / 2), cy = y + ay - (V.y + V.h / 2);
    if (!K.cam) K.cam = { x: cx, y: cy }; else { K.cam.x += (cx - K.cam.x) * 0.12; K.cam.y += (cy - K.cam.y) * 0.12; }
    K.cam.x = borne(K.cam.x, -V.x - 40, CI.LARGE - V.x - V.w + 40); K.cam.y = borne(K.cam.y, -V.y - 40, CI.HAUT - V.y - V.h + 40);
    return [G.cale(K.cam.x), G.cale(K.cam.y)];
  }
  const kDe = a => mod(Math.round(a / (Math.PI / 16)), 32);
  function voiture(c, v, cx, cy, lights, nuit) {
    const x = v.x - cx, y = v.y - cy; if (x < -30 || y < -30 || x > G.PW + 30 || y > G.PH + 30) return;
    c.fillStyle = 'rgba(16,8,24,.4)'; c.beginPath(); c.ellipse(x + 1.5, y + 2.2, 11.5, 6.5, v.a, 0, TAU); c.fill();
    c.drawImage(G.dessus('voiture', { m: v.m, c: v.teinte }, kDe(v.a)), Math.round(x - 14), Math.round(y - 14));
    const fx = Math.cos(v.a), fy = Math.sin(v.a); lights.push({ x: x + fx * 16, y: y + fy * 16, r: nuit ? 30 : 16, color: '#fff2d0', a: nuit ? 0.7 : 0.35 }); lights.push({ x: x - fx * 11, y: y - fy * 11, r: 9, color: '#ff3a5a', a: 0.4 });
    if (v.joueur) lights.push({ x, y, r: 22, color: '#8eeaf6', a: 0.25 });
  }
  function dessiner(K) {
    const c = G.px; c.fillStyle = '#0a0810'; c.fillRect(0, 0, G.PW, G.PH); if (!K) return {};
    const P = peindre(K.def), lights = [], nuit = !!K.def.nuit, t = K.vu || 0;
    const J = K.moto ? K : K.joueur, cam = camera(K, J.x, J.y, J.a, J.v || 0), cx = cam[0], cy = cam[1];
    c.drawImage(P.fond, -cx, -cy);
    P.lampes.forEach(([x, y, col]) => { const X = x - cx, Y = y - cy; if (X > -40 && Y > -40 && X < G.PW + 40 && Y < G.PH + 40) lights.push({ x: X, y: Y, r: 34, color: col, a: nuit ? 0.8 : 0.45 }); });
    if (K.moto) {
      const T = G.TEINTES, L = (I.sagas.idris && I.sagas.idris.heroes.idris.look) || {}, sl = (I.sagas.idris && I.sagas.idris.heroes.salim.look) || {};
      const x = K.x - cx, y = K.y - cy; c.fillStyle = 'rgba(16,8,24,.4)'; c.beginPath(); c.ellipse(x + 1.5 - K.penche * 1.5, y + 2, 10, 4.5, K.a, 0, TAU); c.fill();
      c.drawImage(G.dessus('moto', { c: CI.TEINTE_MOTO, salim: { robe: sl.robe, head: sl.head, cloak: sl.cloak }, idris: { robe: L.robe, head: L.head, cloak: L.cloak }, penche: K.penche }, kDe(K.a)), Math.round(x - 14), Math.round(y - 14));
      lights.push({ x: x + Math.cos(K.a) * 14, y: y + Math.sin(K.a) * 14, r: 22, color: '#fff2d0', a: 0.5 });
      // le signe du virage : des chevrons, du côté où l'on se penche (vers l'intérieur), qui brillent quand on y est
      const v = K.signe; if (v && K.mode === 'course' && T) { const dedans = K.a + v.sens * Math.PI / 2, ok = K.bienPenche, col = ok ? '#7dffb0' : '#ffe08a', pul = 1 + Math.sin(t * 9) * 0.15;
        for (let k = 0; k < 3; k++) { const d = 16 + k * 6, X = x + Math.cos(dedans) * d, Y = y + Math.sin(dedans) * d; c.save(); c.translate(X, Y); c.rotate(dedans); c.scale(pul, pul); c.globalAlpha = 0.9 - k * 0.22; c.strokeStyle = '#1a1420'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(-2.5, -4); c.lineTo(1.5, 0); c.lineTo(-2.5, 4); c.stroke(); c.strokeStyle = col; c.lineWidth = 1.4; c.stroke(); c.restore(); }
        c.globalAlpha = 1; lights.push({ x: x + Math.cos(dedans) * 22, y: y + Math.sin(dedans) * 22, r: 20, color: col, a: 0.5 }); }
    } else {
      const bas = [], hauts = []; K.voitures.forEach(v => (niveau(K, v) ? hauts : bas).push(v));
      bas.forEach(v => voiture(c, v, cx, cy, lights, nuit));
      if (P.haut) c.drawImage(P.haut, -cx, -cy);
      hauts.forEach(v => voiture(c, v, cx, cy, lights, nuit));
    }
    // le plan, dans le coin de ce que l'on voit
    { const V = G.view, pw = 92 * 0.62, ph = 62 * 0.62, mx = V.x + V.w - pw - 6, my = V.y + 6; c.globalAlpha = 0.82; c.fillStyle = 'rgba(8,6,16,.55)'; c.fillRect(mx - 2, my - 2, pw + 4, ph + 4); c.drawImage(P.plan, mx, my, pw, ph); c.globalAlpha = 1;
      const pt = (x, y, col, rr) => { c.fillStyle = col; c.fillRect(mx + x / CI.LARGE * pw - rr / 2, my + y / CI.HAUT * ph - rr / 2, rr, rr); };
      if (K.moto) pt(K.x, K.y, Math.floor(t * 4) % 2 ? '#fff' : '#ffe08a', 2.5); else { K.voitures.forEach(v => { if (!v.joueur) pt(v.x, v.y, G.TEINTES[v.teinte].l, 2); }); pt(K.joueur.x, K.joueur.y, Math.floor(t * 4) % 2 ? '#fff' : '#ffe08a', 2.5); }
      K.planRect = [mx - 2, my - 2, pw + 4, ph + 4]; }
    if (K.mode === 'podium') podium(c, K, lights);
    const amb = nuit ? ['#6a6aa8', '#3a3a78'] : ['#e0a888', '#a888c0'];
    return { ambient: amb, lights, bloom: nuit ? 0.34 : 0.22, scan: true, grade: nuit ? ['#3a4aff', 0.08] : ['#ff3d8f', 0.08], vignette: 0.55, tilt: false };
  }
  // le podium : trois marches, les voitures dessus ; Idris devant la sienne, l'organisateur à côté
  function podium(c, K, lights) {
    const V = G.view, cx = V.x + V.w / 2, sol = V.y + V.h * (document.body.classList.contains('portrait') ? 0.62 : 0.42), R = K.resultat || {}, cl = (R.cl || []).slice(0, 3);   // (en largeur, le bilan tient le pied de l'image)
    c.fillStyle = 'rgba(8,6,20,.55)'; c.fillRect(V.x, V.y, V.w, V.h);
    const marches = [[0, 22, 1], [-50, 14, 2], [50, 8, 3]], J = W.sheets && W.sheets[0], rang = R.rang | 0, o = CI.organisateur();
    const petit = (sh, x, y, pose) => { if (!sh) return; c.fillStyle = 'rgba(20,12,30,.35)'; c.beginPath(); c.ellipse(x, y + 1, 6, 2.5, 0, 0, TAU); c.fill(); if (pose && sh.look && G.pose) c.drawImage(G.pose(sh.look, 0, pose), x - 8, y - 22); else c.drawImage(sh, 0, 0, 16, 24, x - 8, y - 22, 16, 24); };
    marches.forEach(([dx, h, n]) => { const x = cx + dx, v = cl[n - 1]; c.fillStyle = n === 1 ? '#c8a868' : '#9a8a90'; c.fillRect(x - 24, sol - h, 48, h); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x - 24, sol - h, 48, 1); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(x - 24, sol - 2, 48, 2);
      if (v) { c.drawImage(G.obj('qvoiture', { m: 'course', c: v.teinte, d: 'd' }), x - 26, sol - h - 28); lights.push({ x: x - 4, y: sol - h - 12, r: 34, color: G.TEINTES[v.teinte].l, a: 0.45 }); if (v.joueur) petit(J, x + 18, sol - h, R.gagne ? 'joie' : null); } });
    if (rang > 3) petit(J, cx - 90, sol, null);   // hors du podium : Idris au pied des marches
    if (o && o.sheet) petit(o.sheet, cx + 92, sol, null);
    lights.push({ x: cx, y: sol - 30, r: 110, color: '#fff4dc', a: 0.35 });
  }
  /* ----- ce qui s'écrit sur la course : le chrono, le tour, le classement, le signe, le compte à rebours (#course) -----
     Sur un téléphone en hauteur, sous l'image (la manette a la bande du bas) ; en largeur, en haut et à gauche de l'image (la
     manette tient les deux coins du bas) ; le bilan, au pied de l'image, entre les deux zones de la manette (style.css). */
  function hud(K) {
    const box = $('#course'); if (!K || !box) return; const set = (sel, html) => { const e = box.querySelector(sel); if (e && e._h !== html) { e._h = html; e.innerHTML = html; e.dir = I.langue.sens(e.textContent); } };
    const T = textes();
    if (K.moto) { set('.chrono', `<b class="titre">${I.esc(I.t('Derrière Sâlim'))}</b>`); const bien = K.virages.filter(v => v.fait && v.bien).length;
      set('.tour', I.esc(I.t('Virages bien pris : {n} sur {total}', { n: bien, total: K.virages.length }))); set('.rangs', '');
      set('.signe', K.mode === 'compte' ? I.esc(tactile() ? I.t('Sâlim pilote · le joystick vers l’intérieur du virage : se pencher · B : pause') : I.t('Sâlim pilote · la flèche vers l’intérieur du virage : se pencher · Échap : pause'))
        : K.malPenche ? `<span class="mal">${I.esc(I.t('Penche-toi vers l’intérieur du virage'))}</span>` : K.bienPenche ? `<span class="bien">${I.esc(I.t('Bien penché'))}</span>` : ''); }
    else { const tps = K.joueur.fin || K.t, nom = ((T.circuits || [])[K.n] || {}).nom || '', tour = I.t('tour {n} sur {total}', { n: borne(K.joueur.tour + 1, 1, K.tours), total: K.tours });
      set('.chrono', `<b>${chrono(tps)}</b>`);
      set('.tour', I.esc(K.def.temps ? tour + ' · ' + I.t('à battre : {temps}', { temps: chrono(K.def.temps) }) : tour));
      const cl = CI.classement(K); set('.rangs', cl.length > 1 ? cl.map((v, i) => `<li${v.joueur ? ' class="moi"' : ''}><i style="background:${G.TEINTES[v.teinte].b}"></i>${i + 1} · ${I.esc(v.joueur ? I.perso.dit() : ((T.couleurs || [])[v.teinte] || ''))}</li>`).join('') : '');
      set('.signe', K.mode === 'compte' ? `<b>${I.esc(nom)}</b><br>` + I.esc(tactile() ? I.t('Joystick : orienter · A tenu : accélérer · B : pause') : I.t('Flèches : orienter · Entrée ou Espace tenue : accélérer · Échap : pause')) : ''); }
    set('.compte', K.mode === 'compte' ? (Math.ceil(K.compte) > 0 ? String(Math.ceil(K.compte)) : I.esc(I.t('Partez !'))) : K.mode === 'course' && K.t < 0.8 ? I.esc(I.t('Partez !')) : '');
  }

  // le garde-fou (ui.js, U.secours) : la course en cours s'arrête, rien n'est compté
  CI.abandon = function () { const K = CI.K; if (!K) return; if (K.resoudre) { const f = K.resoudre; K.resoudre = null; f({ quitte: true }); } if (K.attente) K.attente(true); };
  /* ----- mener une course (ou le tour de moto) : la scène, la pause, l'arrivée, le podium ----- */
  async function rouler(K) {
    const prev = I.scene, mark = I.input.mark(), box = $('#course'), T = textes(); let res = null;
    K.mode = 'compte'; K.compte = K.moto ? 1.9 : 3.2; K.pause = false; CI.K = K;
    const arrive = new Promise(r => { K.resoudre = r; });
    const pause = async () => { if (K.pause) return; K.pause = true; I.input.clearHeld(); CI.journal.push({ quoi: 'pause' });
      const i = await S.menuPick(I.t('La course est en pause.'), [{ t: I.t('Reprendre'), retour: true }, { t: K.moto ? I.t('Descendre de la moto') : I.t('Quitter la course') }]);
      K.pause = false; if (i === 1 && K.resoudre) { CI.journal.push({ quoi: 'quitte' }); const f = K.resoudre; K.resoudre = null; f({ quitte: true }); } };
    K.enPause = pause;
    const h = I.input.push(a => { if ((a === 'cancel' || a === 'menu' || a === 'frappe') && (K.mode === 'course' || K.mode === 'compte')) pause(); else if (a === 'ok' && K.attente) K.attente(); return true; });
    try {
      await S.fade('out', 260);
      I.setScene(CI.scene); $('#hud').hidden = true; document.body.classList.add('en-course'); box.querySelector('.bilan').hidden = true; box.hidden = false; K.cam = null; hud(K);
      G.clearParts(); G.amb = { kind: K.def.nuit ? 'dust' : 'brume', rate: 3, n: 0 }; I.audio.moteur(true);
      await S.fade('in', 260);
      const fin = await arrive;
      if (fin.quitte) res = { quitte: true };
      else if (K.moto) { res = { fini: true, bien: K.virages.filter(v => v.bien).length, total: K.virages.length }; CI.journal.push({ quoi: 'balade', bien: res.bien, total: res.total }); }
      else { res = arrivee2(K); CI.journal.push({ quoi: 'arrivee', n: K.n, rang: res.rang, temps: res.temps, gagne: res.gagne, prime: res.verse });
        K.resultat = res; K.mode = 'podium'; I.audio.regime(0, 0); I.audio.sfx(res.gagne ? 'roll' : 'blip');
        const b = box.querySelector('.bilan'); b.innerHTML = bilan(K, res); b.dir = I.langue.sens(b.textContent); b.hidden = false; box.classList.add('fini');
        await new Promise(r => { const t0 = performance.now(); K.attente = force => { if (force || performance.now() - t0 > 500) { K.attente = null; r(); } }; if (I.debug.auto) setTimeout(() => { K.attente = null; r(); }, 80); }); }
    } finally {
      I.input.pop(h); I.input.trim(mark); I.audio.moteur(false);
      try { await S.fade('out', 220); } catch (e) { /* le fondu ne doit pas retenir la sortie */ }
      box.hidden = true; box.classList.remove('fini'); box.querySelector('.bilan').hidden = true; document.body.classList.remove('en-course'); CI.K = null; I.input.clearHeld(); I.input.aTenu = false; I.input.joyAngle = null;
      I.setScene(prev === CI.scene ? W : prev); G.clearParts();
      if (W.map) { const env = W.map.env; G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 }; $('#hud').hidden = false; W.hud(); W.stop(); W.updateCam(true); }
      I.audio.back();
      try { await S.fade('in', 260); } catch (e) { /* idem */ }
    }
    return res;
  }
  // à l'arrivée : la place, le temps, ce qui s'ouvre, la prime (plafonnée par visite) ; la partie le garde
  function arrivee2(K) {
    const def = K.def, e = CI.etat(), cl = CI.classement(K), rang = cl.indexOf(K.joueur) + 1, temps = K.joueur.fin, sous = !def.temps || temps <= def.temps, gagne = rang === 1 && sous;
    const avant = !!e.gagnes[K.n], ms = Math.round(temps * 1000), record = !e.temps[K.n] || ms < e.temps[K.n]; if (record) e.temps[K.n] = ms;
    if (gagne) e.gagnes[K.n] = true;
    const part = (D.COURSE.podium || [])[rang - 1] || 0, prime = gagne ? def.prime : (def.adversaires.length && rang > 1 && sous ? Math.round(def.prime * part) : 0);
    const deja = S.flags._primes | 0, verse = Math.max(0, Math.min(prime, (D.COURSE.plafond | 0) - deja)); if (verse) { S.flags._primes = deja + verse; I.trade.dirhams(verse); e.primes = (e.primes | 0) + verse; }
    e.courses = (e.courses | 0) + 1; I.save.store();
    if (I.lecons) I.lecons.reemploi('virages');
    return { rang, temps, sous, gagne, record, ouvre: gagne && !avant && K.n + 1 < D.CIRCUITS.length ? K.n + 1 : -1, prime, verse, plafond: prime > verse, cl };
  }
  const PLACES = () => [I.t('Première place'), I.t('Deuxième place'), I.t('Troisième place'), I.t('Quatrième place')];
  function bilan(K, R) {
    const T = textes(), C = T.circuits || [], P = T.podium || {}, nom = (C[K.n] || {}).nom || '', l = [];
    l.push(`<h3>${I.esc(I.t('Arrivée · {nom}', { nom }))}</h3>`);
    l.push(`<p><b>${I.esc(K.def.adversaires.length ? PLACES()[R.rang - 1] || '' : (R.sous ? I.t('Sous le temps à battre') : I.t('Au-dessus du temps à battre')))}</b> · ${chrono(R.temps)}${R.record ? ' · ' + I.esc(I.t('ton meilleur temps')) : ''}${K.def.temps ? ' · ' + I.esc(I.t('à battre : {temps}', { temps: chrono(K.def.temps) })) : ''}</p>`);
    l.push(`<p>${I.fmt(R.gagne ? (P.gagne || '') : R.rang <= 3 && R.sous && K.def.adversaires.length ? (P.podium || '') : (P.perdu || ''))}</p>`);
    if (R.verse) l.push(`<p class="prime">${I.esc(I.t('L’organisateur te remet la prime : {n} dirham.¦L’organisateur te remet la prime : {n} dirhams.', { n: R.verse }))}</p>`);
    if (R.plafond) l.push(`<p><small>${I.fmt(P.plafond || '')}</small></p>`);
    if (R.ouvre >= 0) l.push(`<p>${I.esc(I.t('« {nom} » s’ouvre.', { nom: (C[R.ouvre] || {}).nom || '' }))}</p>`);
    else if (!R.gagne && K.n + 1 < D.CIRCUITS.length && !CI.ouvert(K.n + 1)) l.push(`<p><small>${I.esc(I.t('Le circuit suivant reste scellé : il faut d’abord gagner celui-ci.'))}</small></p>`);
    l.push(`<div class="suite">${tactile() ? 'A ▸' : I.esc(I.t('Entrée ▸'))}</div>`);
    return l.join('');
  }
})();
