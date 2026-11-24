/* ISNAD 2.x — les bêtes qui marchent.
   2.32 (D224) : les chameaux chargés des pillards, sur la carte du monde (monde.js). Une bête est dessinée par le jeu (gfx.js,
   `b_<espèce>`), de profil ; elle va d'un point à un autre en ligne droite, sa foulée suit le chemin parcouru, et elle n'est
   d'aucun récit : ni nom, ni parole, ni objectif. Le moteur seul les pose ; une carte qu'on charge les retire (`route`). */
(function () {
  const I = window.ISNAD, G = I.gfx;
  const Gn = I.gens = { betes: [] };
  const W = () => I.world;
  const VIT = { chameau: 34 };   // points par seconde : l'allure d'une bête qui marche

  // une bête : { esp, map, x, y, dir (1 : tournée vers la droite, -1 : vers la gauche), charge, route }
  Gn.ajouter = function (b) { b.dir = b.dir || 1; b.parcours = 0; b.ph = b.ph === undefined ? (I.hash(b.esp + '|' + b.x + '|' + b.y) % 628) / 100 : b.ph; Gn.betes.push(b); return b; };
  Gn.retirer = function (pred) { Gn.betes.filter(pred).forEach(b => { if (b.fin) { const f = b.fin; b.fin = null; f(); } }); Gn.betes = Gn.betes.filter(b => !pred(b)); };
  // elle marche jusqu'à (x, y) ; la promesse se tient à l'arrivée (ou si on la retire)
  Gn.aller = function (b, x, y) { return new Promise(res => { if (b.fin) b.fin(); b.but = [x, y]; b.fin = res; }); };
  // à chaque chargement d'un lieu : les bêtes d'une rencontre de la route ne restent pas
  Gn.arme = function () { Gn.retirer(b => b.route); };
  Gn.ici = function (b) { const m = W().map; return !!m && b.map === m.id && !b.hidden; };

  Gn.maj = function (dt) {
    for (const b of Gn.betes) {
      if (!b.but) { b.moving = false; continue; }
      const dx = b.but[0] - b.x, dy = b.but[1] - b.y, d = Math.hypot(dx, dy), pas = (VIT[b.esp] || 30) * (b.vit || 1) * dt;
      if (Math.abs(dx) > 0.5) b.dir = dx < 0 ? -1 : 1;
      if (d <= pas) { b.x = b.but[0]; b.y = b.but[1]; b.but = null; b.moving = false; b.parcours += d; const f = b.fin; b.fin = null; if (f) f(); continue; }
      b.x += dx / d * pas; b.y += dy / d * pas; b.parcours += pas; b.moving = true;
    }
  };
  // dans la liste triée par profondeur du monde (world.js)
  Gn.lister = function (list, cx, cy) { for (const b of Gn.betes) if (Gn.ici(b) && b.x > cx - 40 && b.x < cx + G.PW + 40 && b.y > cy - 10 && b.y < cy + G.PH + 30) list.push({ y: b.y, gb: b }); };
  // 2.32 — une chimère qui se lève sous les yeux (La Razzia, du milieu des pillards) : une image, qu'on ne touche pas ; elle
  // s'efface quand le combat s'ouvre (Gn.retirer). Un peu de transparence : ce n'est pas une personne (exigence 6).
  Gn.lever = function (id, map, x, y) { const a = { chimere: id, map, x, y, t0: null, route: true, parcours: 0, dir: 1, ph: 0 }; Gn.betes.push(a); return a; };
  function chimere(c, a, cx, cy, t, lights) {
    const d = (I.common && I.common.enemies[a.chimere]) || ((W().saga || {}).enemies || {})[a.chimere]; if (!d) return;
    if (a.t0 === null) a.t0 = t; const k = Math.min(1, (t - a.t0) / 0.9), s = 34, spr = G.enemy(d.art, d.hue, 1, 0), x = a.x - cx, y = a.y - cy, bob = Math.sin(t * 2.4) * 2.5 + (1 - k) * 14;
    c.fillStyle = 'rgba(20,12,30,.3)'; c.beginPath(); c.ellipse(x, y + 1, 10 * k, 3.5 * k, 0, 0, 6.3); c.fill();
    c.globalAlpha = 0.85 * k; c.drawImage(spr, x - s / 2, y - s - 3 + bob, s, s); c.globalAlpha = 1;
    if (lights) lights.push({ x, y: y - 16, r: 48 * k, color: `hsl(${d.hue},90%,60%)`, a: 0.85 * k });
    if (Math.random() < 0.25 * k) G.spawn({ x: x + (Math.random() - 0.5) * 20, y: y - 8, vy: -16, vx: (Math.random() - 0.5) * 8, life: 1, size: 0.8, color: `hsl(${d.hue},100%,70%)`, type: 'glyph' });
  }
  Gn.dessiner = function (c, b, cx, cy, t, lights) {
    if (b.chimere) return chimere(c, b, cx, cy, t, lights);
    const f = b.moving ? Math.floor(b.parcours / 4) % 4 : 0, im = G.obj('b_' + b.esp, { f, charge: !!b.charge }), O = G.OBJ['b_' + b.esp];
    const x = Math.round(b.x - cx), y = Math.round(b.y - cy), lev = !b.moving && Math.sin(t * 1.3 + b.ph) > 0.85 ? -1 : 0;
    c.fillStyle = 'rgba(20,12,8,.28)'; c.beginPath(); c.ellipse(x, y + 1, O.w * 0.36, 3, 0, 0, 6.3); c.fill();
    if (b.dir < 0) { c.save(); c.translate(x, 0); c.scale(-1, 1); c.drawImage(im, -Math.round(O.w / 2), y - O.h + 1 + lev); c.restore(); }
    else c.drawImage(im, x - Math.round(O.w / 2), y - O.h + 1 + lev);
  };
})();
