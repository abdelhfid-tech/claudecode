/* ISNAD 2.x — un pilote pour les outils de contrôle (2.19, la fuite) : il mène celui qui marche en tête comme le ferait
   un joueur au clavier — les flèches tenues (I.input.held), Maj tenue pour courir (I.input.maj) — en fuyant ce qui le
   poursuit (rodeurs.js, R.fuite) : il vise la case la plus éloignée de la chimère, en partant à l'opposé d'elle, par le
   plus court chemin, et se choisit un nouveau but quand il y est. Dans un labyrinthe, il reste sur les ponts, là où ce qui rôde
   peut le suivre (une salle lui serait un refuge : ce n'est pas ce qu'on éprouve).
   Usage, dans un outil : await page.evaluate(require('./pilote.js')) ; puis, dans la page :
     const st = window.__pilote(courir) … st.stop() ; st.journal dit où il est allé. */
module.exports = function () {
  window.__pilote = function (courir) {
    const I = window.ISNAD, W = I.world, R = I.rodeurs, T = 16, H = I.input.held;
    const st = { courir: !!courir, chemin: null, fini: false, journal: [], buts: 0 };
    const ok = (x, y) => { const m = W.map; if (x < 0 || y < 0 || x >= m.w || y >= m.h || m.solid[y * m.w + x]) return false; return !(m.env && m.env.dedale) || m.g0(x * T + 8, y * T + 8) === 'npont'; };
    // le joueur passe-t-il au milieu de la case (sa boîte de pied : ± 4 points, 5 de haut) ?
    const libre = (x, y) => ok(x, y) && !W.solidAt(x * T + 4, y * T + 5) && !W.solidAt(x * T + 12, y * T + 5) && !W.solidAt(x * T + 4, y * T + 10) && !W.solidAt(x * T + 12, y * T + 10);
    // les distances depuis (sx, sy) ; `premier` : les premiers pas permis (on ne part pas vers la chimère)
    const bfs = (sx, sy, garde, premier) => { const m = W.map, d = new Int32Array(m.w * m.h).fill(-1), de = new Int32Array(m.w * m.h).fill(-1); const s0 = sy * m.w + sx, q = [s0]; d[s0] = 0;
      for (let k = 0; k < q.length; k++) { const i = q[k], x = i % m.w, y = (i - x) / m.w; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(o => { const X = x + o[0], Y = y + o[1]; if (X < 0 || Y < 0 || X >= m.w || Y >= m.h) return; const j = Y * m.w + X; if (d[j] >= 0 || !garde(X, Y) || (i === s0 && premier && !premier(o))) return; d[j] = d[i] + 1; de[j] = i; q.push(j); }); }
      return { d, de }; };
    // le but : la case la plus éloignée de la chimère (par où elle passe), à six pas au moins, en partant à l'opposé d'elle
    const plan = () => {
      const m = W.map, p = W.player, F = R.fuite, f = F ? F.f : null, sx = Math.floor(p.x / T), sy = Math.floor((p.y - 3) / T), vx = f ? p.x - f.x : 0, vy = f ? p.y - f.y : 0, n = Math.hypot(vx, vy);
      let P = bfs(sx, sy, libre, n < 2 ? null : o => o[0] * vx + o[1] * vy > 0); if (![...P.d].some(v => v >= 6)) P = bfs(sx, sy, libre, null);
      const Q = f ? bfs(Math.floor(f.x / T), Math.floor(f.y / T), ok, null).d : null;
      let best = -1, score = -1e9;
      for (let i = 0; i < m.w * m.h; i++) { const a = P.d[i]; if (a < 6) continue; const b = Q ? (Q[i] < 0 ? 400 : Q[i]) : a, sc = b * 4 - a; if (sc > score) { score = sc; best = i; } }
      const ch = []; for (let i = best; i >= 0 && P.d[i] > 0; i = P.de[i]) ch.unshift([i % m.w, (i - i % m.w) / m.w]);
      st.chemin = ch; st.buts++; st.journal.push({ but: best >= 0 ? [best % m.w, (best - best % m.w) / m.w] : null, pas: ch.length, t: +W.t.toFixed(1) });
    };
    const lacher = () => { H.up = H.down = H.left = H.right = false; I.input.maj = false; };
    // il tient les flèches à chaque image du jeu, juste avant qu'elle ne les lise (comme un joueur qui voit l'écran)
    const pas = () => {
      if (st.fini) return;
      if (!W.map || I.scene !== W || I.battle.active || I.script.busy || W.lock) { lacher(); st.chemin = null; return; } // un combat, un récit : on lâche tout
      if (!st.chemin || !st.chemin.length) plan(); if (!st.chemin.length) { lacher(); return; }
      const p = W.player, tx = Math.floor(p.x / T), ty = Math.floor((p.y - 3) / T); let wp = st.chemin[0];
      while (wp && wp[0] === tx && wp[1] === ty) { st.chemin.shift(); wp = st.chemin[0]; } if (!wp) return;
      // une flèche à la fois, comme on tient un couloir (en biais, le pas se partage entre les deux axes, et un mur en arrête
      // un) ; avant de tourner, on se met au milieu du couloir, comme un joueur
      const cx = tx * T + 8, cy = ty * T + 11; let h, s;
      if (wp[0] !== tx) { if (Math.abs(p.y - cy) > 3) { h = false; s = Math.sign(cy - p.y); } else { h = true; s = Math.sign(wp[0] - tx); } }
      else { if (Math.abs(p.x - cx) > 2) { h = true; s = Math.sign(cx - p.x); } else { h = false; s = Math.sign(wp[1] - ty); } }
      H.left = h && s < 0; H.right = h && s > 0; H.up = !h && s < 0; H.down = !h && s > 0; I.input.maj = st.courir;
    };
    const u = W.update; W.update = function () { pas(); return u.apply(this, arguments); };
    st.stop = () => { if (st.fini) return; st.fini = true; W.update = u; lacher(); };
    return st;
  };
};
