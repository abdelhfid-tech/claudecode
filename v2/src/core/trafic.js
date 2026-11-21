/* ISNAD 2.23 (D212) — le trafic des quartiers de la Cité-Miroir.
   Demande du décideur, 21 novembre : « des belles voitures […] des courses de voitures ». Les voitures sont dessinées par le
   jeu (gfx.js, G.MODELES, G.TEINTES : des modèles inventés, sans marque, sans logo, sans plaque, vitres fumées).
   - Sur la boucle des avenues (maps.js, M.QUARTIERS.boucle : un rectangle à sens unique), quelques voitures roulent l'une
     derrière l'autre. Chacune regarde devant elle, le long de son chemin, sur `D.CITE.arret` points : si quelqu'un s'y tient
     (le joueur, ceux qui le suivent, un passant poussé hors du trottoir), elle s'arrête, et repart quand la voie est libre ;
     elle garde ses distances avec celle qui la précède. Jamais d'accident : une voiture n'avance jamais là où quelqu'un se
     tient, et le joueur ne peut pas entrer dans une voiture (TR.bloque, appelé par world.js à chaque pas). Elles ne voient pas
     les chimères : personne d'autre qu'Idris ne les voit.
   - Sur le circuit (M.QUARTIERS.circuit : un ovale, derrière sa barrière), des voitures de course tournent, chacune dans son
     couloir ; on ne peut pas y entrer. La course jouable viendra au lot 3 : rien ici ne compte, rien n'est gardé.
   - Les voitures garées sont des objets de la carte, qui tiennent leurs deux cases (maps.js, quartiers()).
   Rien de tout cela n'est gardé dans la partie. Les outils lisent TR.voitures, TR.pied(v), TR.traverses (une voiture et le
   joueur l'un dans l'autre : jamais) et TR.arrets (les arrêts devant quelqu'un). */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, G = I.gfx, W = I.world;
  const TR = I.trafic = { voitures: [], course: [], actif: false, traverses: 0, arrets: 0, journal: [] };

  // un chemin fermé fait de segments droits : sa longueur, et le point à une distance donnée
  function chemin(pts) { const seg = []; let L = 0; pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push({ a, b, l, s: L }); L += l; }); return { seg, L }; }
  function point(ch, s) { s = ((s % ch.L) + ch.L) % ch.L; let q = ch.seg[ch.seg.length - 1]; for (const x of ch.seg) if (s < x.s + x.l) { q = x; break; }
    const f = Math.min(1, (s - q.s) / q.l); return { x: q.a[0] + (q.b[0] - q.a[0]) * f, y: q.a[1] + (q.b[1] - q.a[1]) * f, dx: Math.sign(q.b[0] - q.a[0]), dy: Math.sign(q.b[1] - q.a[1]) }; }
  // le circuit : deux lignes droites et deux virages ; `dec` : le couloir (vers l'extérieur de l'ovale)
  function surCircuit(K, s, dec) {
    const R0 = K.r + dec, l = K.x1 - K.x0, a = Math.PI * R0, L = 2 * l + 2 * a, my = (K.y0 + K.y1) / 2; s = ((s % L) + L) % L;
    const vers = (vx, vy) => Math.abs(vx) > Math.abs(vy) ? { dx: Math.sign(vx), dy: 0 } : { dx: 0, dy: Math.sign(vy) };
    if (s < l) return { x: K.x1 - s, y: my - R0, dx: -1, dy: 0, L };                                           // la ligne droite du nord, vers l'ouest
    s -= l; if (s < a) { const t = s / R0; return Object.assign({ x: K.x0 - R0 * Math.sin(t), y: my - R0 * Math.cos(t), L }, vers(-Math.cos(t), Math.sin(t))); }   // le virage de l'ouest
    s -= a; if (s < l) return { x: K.x0 + s, y: my + R0, dx: 1, dy: 0, L };                                    // la ligne droite du sud, vers l'est
    s -= l; const t = s / R0; return Object.assign({ x: K.x1 + R0 * Math.sin(t), y: my + R0 * Math.cos(t), L }, vers(Math.cos(t), -Math.sin(t)));   // le virage de l'est
  }
  const sens = p => p.dx < 0 ? 'g' : p.dx > 0 ? 'd' : p.dy > 0 ? 'b' : 'h';
  // le corps d'une voiture au sol (en points de la carte) : de côté, 36 × 11 ; de face ou de dos, 22 × 28
  const pied = (x, y, d) => d === 'g' || d === 'd' ? [x - 18, y - 9, x + 18, y + 2] : [x - 11, y - 26, x + 11, y + 2];
  TR.pied = v => pied(v.x, v.y, v.d);
  const croise = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  const boite = (x, y, m) => [x - 4 - m, y - 5 - m, x + 4 + m, y + m];   // le pied du joueur (world.js : x ± 4, de y − 5 à y), élargi de m

  // un lieu vient d'être chargé : ses voitures, s'il en a
  TR.arme = function () {
    TR.voitures = []; TR.course = []; TR.actif = false;
    const m = W.map, Q = m && m.env && m.env.trafic; if (!Q) return;
    TR.actif = true; TR.boucle = chemin(Q.boucle); TR.K = Q.circuit;
    const C = D.CITE || {}, n = C.voitures | 0, r = I.rng(I.hash('trafic|' + m.id)), modeles = G.MODELES_RUE;
    for (let i = 0; i < n; i++) { const v = { i, s: TR.boucle.L * i / n + r() * 30, v: 0, vmax: (C.vitesse || 58) * (0.85 + r() * 0.3), m: modeles[Math.floor(r() * modeles.length)], c: Math.floor(r() * G.TEINTES.length), arret: 0, attente: 0 };
      place(v); TR.voitures.push(v); }
    // personne n'est posé dans une voiture : celle qui tomberait sur le joueur avance d'un cran
    TR.voitures.forEach(v => { for (let k = 0; k < 60 && croise(TR.pied(v), boite(W.player.x, W.player.y, 2)); k++) { v.s += 12; place(v); } });
    const nc = C.course | 0; for (let i = 0; i < nc; i++) TR.course.push({ i, s: i * 140, dec: (i - (nc - 1) / 2) * 9, vit: (C.circuit || 120) * (1 - i * 0.05), c: [2, 8, 4, 0, 1][i % 5], m: 'course' });
    TR.course.forEach(placeCourse);
  };
  function place(v) { const p = point(TR.boucle, v.s); v.x = p.x; v.y = p.y; v.d = sens(p); }
  function placeCourse(v) { const p = surCircuit(TR.K, v.s, v.dec); v.x = p.x; v.y = p.y; v.d = sens(p); v.L = p.L; }

  // ceux devant qui une voiture s'arrête : le joueur, ceux qui le suivent, les passants
  function gens() {
    const L = [boite(W.player.x, W.player.y, 2)];
    for (let i = 1; i < W.party.length; i++) { const q = W.suiveur(i); L.push(boite(q[0], q[1], 2)); }
    W.npcs.forEach(n => { if (!n.hidden && n.placed && n.map === W.map.id) L.push(boite(n.x, n.y, 2)); });
    return L;
  }
  // la voie devant elle est-elle libre ? (son corps, avancé pas à pas le long du chemin, ne touche personne)
  function libre(v, L, loin) { for (let k = 2; k <= loin; k += 3) { const p = point(TR.boucle, v.s + k), f = pied(p.x, p.y, sens(p)); if (L.some(b => croise(f, b))) return false; } return true; }
  TR.tic = function (dt) {
    if (!TR.actif || !W.map || !W.map.env.trafic) return;
    dt = Math.min(dt, 0.05); const C = D.CITE || {}, arret = C.arret || 20, L = gens(), BL = TR.boucle.L;
    // de la première à la dernière : chacune garde ses distances avec celle qui la précède
    TR.voitures.forEach(v => {
      let devant = Infinity; TR.voitures.forEach(u => { if (u === v) return; const d = ((u.s - v.s) % BL + BL) % BL; if (d < devant) devant = d; });
      const voie = libre(v, L, arret + 18), cible = !voie ? 0 : devant < 48 ? 0 : devant < 72 ? v.vmax * 0.4 : v.vmax;
      if (!voie && v.v > 0) TR.arrets++;
      v.v = cible < v.v ? cible : Math.min(cible, v.v + 70 * dt);   // elle freine d'un coup, elle repart en douceur
      if (v.v > 0) { const s0 = v.s; v.s += v.v * dt; place(v); if (L.some(b => croise(TR.pied(v), b))) { v.s = s0; place(v); v.v = 0; } }   // jamais là où quelqu'un se tient
      v.attente = v.v > 0 ? 0 : v.attente + dt;
      if (croise(TR.pied(v), boite(W.player.x, W.player.y, 0))) { TR.traverses++; if (TR.journal.length < 8) TR.journal.push({ i: v.i, x: Math.round(v.x), y: Math.round(v.y), d: v.d, px: Math.round(W.player.x), py: Math.round(W.player.y), v: Math.round(v.v) }); }
    });
    TR.course.forEach(v => { v.s += v.vit * (0.94 + 0.06 * Math.sin(W.t * 0.4 + v.i * 2)) * dt; placeCourse(v); });
  };
  // les cases que tiennent les voitures en ce moment : un chemin les contourne (world.js, W.route et W.pathTo) — sans quoi celui qui
  // veut passer pousserait contre une voiture arrêtée devant lui, qui l'attendrait
  TR.cases = function () { const out = []; if (!TR.actif || !W.map) return out; const w = W.map.w;
    TR.voitures.forEach(v => { const f = TR.pied(v); for (let y = Math.floor(f[1] / 16); y <= Math.floor((f[3] - 1) / 16); y++) for (let x = Math.floor(f[0] / 16); x <= Math.floor((f[2] - 1) / 16); x++) out.push(y * w + x); });
    return out; };
  // un pas du joueur : refusé s'il entre dans une voiture (on peut toujours s'en écarter)
  TR.bloque = function (x0, y0, x1, y1) {
    if (!TR.actif) return false; const a = boite(x0, y0, 0), b = boite(x1, y1, 0);
    return TR.voitures.some(v => { const f = TR.pied(v); if (!croise(f, b)) return false; if (!croise(f, a)) return true;
      const cx = (f[0] + f[2]) / 2, cy = (f[1] + f[3]) / 2; return Math.hypot(x1 - cx, y1 - cy) < Math.hypot(x0 - cx, y0 - cy); });
  };
  // dans la liste triée par profondeur du rendu (world.js)
  TR.lister = function (list, cx, cy) {
    if (!TR.actif) return; const vue = v => v.x > cx - 40 && v.x < cx + G.PW + 40 && v.y > cy - 10 && v.y < cy + G.PH + 40;
    TR.voitures.concat(TR.course).forEach(v => { if (vue(v)) list.push({ y: v.y, car: v }); });
  };
  TR.dessiner = function (c, v, cx, cy, t, lights) {
    const x = Math.round(v.x - cx), y = Math.round(v.y - cy), cote = v.d === 'g' || v.d === 'd';
    c.fillStyle = 'rgba(20,12,30,.38)'; c.beginPath(); c.ellipse(x, y + 0.5, cote ? 19 : 12, cote ? 3.5 : 4, 0, 0, 6.3); c.fill();
    c.drawImage(G.obj('qvoiture', { m: v.m, c: v.c, d: v.d }), x - 22, y - 28);
    // les phares, devant ; les feux, derrière
    if (cote) { const s = v.d === 'd' ? 1 : -1; lights.push({ x: x + s * 20, y: y - 6, r: 18, color: '#fff2d0', a: 0.55 }); lights.push({ x: x - s * 19, y: y - 8, r: 9, color: '#ff3a5a', a: 0.45 }); }
    else if (v.d === 'b') lights.push({ x, y: y - 6, r: 20, color: '#fff2d0', a: 0.5 }); else lights.push({ x, y: y - 6, r: 12, color: '#ff3a5a', a: 0.45 });
  };
})();
