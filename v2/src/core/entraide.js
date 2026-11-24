/* ISNAD 2.x — l'entraide : aider les gens du lieu à bâtir (2.34, D226).
   Le décideur, 24 novembre : « la possibilité de les aider d'une manière ou d'une autre avec la construction de puit, de mur,
   d'enclos, de mosquée etc. » ; « vérifie que toutes les missions de construction soient simples et bien expliquées dans l'aide.
   On n'est pas tous abreuvés à Minecraft » ; « Idriss reçoit de l'argent à chaque construction pour son aide » ; « il faut
   pouvoir récupérer du bois ou des matériaux quelque part non? ». Son choix : « Villes visitées ».
   Dans une ville qu'on visite (jamais La Mecque), l'un des gens du lieu demande de l'aide (`D.ENTRAIDE.villes` : une demande à la
   fois, dans l'ordre, chacune une seule fois par partie) ; un « ! » flotte au-dessus de lui. A devant lui : sa demande, « Aider » /
   « Plus tard ». Aider trace le chantier à côté de lui, chaque pièce en pointillés à sa case (`plan`), et il fournit une part des
   matériaux ; le reste se récolte à la réserve de la ville (un tas de bois de palmier, un tas de pierres, le puits). Chaque pièce
   se pose en la touchant (ou A devant elle), dans le mode Bâtir (build.js). Le chantier achevé, il remercie et paie l'aide
   (`paie`, en dirhams, par la bourse d'Idris) : jamais un hasard, jamais une mise. Ce qui est bâti reste dans la ville, d'un
   récit à l'autre (build.js, `visite:<carte>`). La petite mosquée de quartier n'est ni un lieu de prière ni un point de
   sauvegarde du jeu : la visite reste sobre (D220). La partie garde `entraide` (par ville : la demande en cours, le chantier
   ouvert, ce qui est fait ; valeur de départ dans `migrer` : rien) ; le format reste le 2. */
(function () {
  const I = window.ISNAD, D = I.D, S = I.script, G = I.gfx, T = 16;
  const W = () => I.world;
  const E = I.entraide = { journal: [] };
  const cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

  /* ---------- ce que la partie garde ---------- */
  const etat = () => { const sv = I.save.data; return sv.entraide || (sv.entraide = {}); };
  E.de = id => { const e = etat(); return e[id] || (e[id] = { k: 0, ouvert: null, faits: [] }); };
  E.ville = () => { const m = W().map, L = m && D.MAPS[m.id]; return L && L.visite && D.ENTRAIDE.villes[m.id] && W().saga && !W().saga.frame ? m.id : null; };
  E.chantier = id => { const e = ((I.save.data || {}).entraide || {})[id]; return e && e.ouvert && !e.ouvert.fait ? e.ouvert : null; };
  E.demande = id => { const L = D.ENTRAIDE.villes[id] || [], e = E.de(id); return !E.chantier(id) && e.k < L.length ? L[e.k] : null; };

  /* ---------- ce qu'ils demandent, ce qu'ils disent (textes de l'agent, à valider) ---------- */
  const TX = {
    puits: { nom: I.T('Un puits pour le quartier'), dit: I.T('L’eau du quartier ne suffit plus : on attend une heure pour une outre. Un second puits, ici, changerait nos journées. J’ai mis deux pierres de côté.'), merci: I.T('De l’eau à deux pas : ce soir, personne n’attendra. Prends ceci, pour ton aide.') },
    enclos: { nom: I.T('Un enclos pour les chèvres'), dit: I.T('Mes chèvres vont où elles veulent, et les jardins s’en plaignent. Un enclos, là, les tiendrait. J’ai un peu de bois de palmier.'), merci: I.T('Les voilà tenues, et les jardins tranquilles. Prends ceci, pour ton aide.') },
    mur: { nom: I.T('Un mur contre le sable'), dit: I.T('Le vent pousse le sable jusque dans l’atelier. Un petit mur de pisé, quatre blocs, et j’y travaillerais en paix. J’ai de quoi en faire deux.'), merci: I.T('Plus un grain de sable sur l’ouvrage. Prends ceci, pour ton aide.') },
    oasis: { nom: I.T('Trois palmiers et un champ'), dit: I.T('Près de l’eau, la terre ne demande qu’à donner. Trois palmiers et un champ d’orge, et ce coin nourrirait plusieurs familles. J’ai du grain et deux mesures d’eau.'), merci: I.T('Dans quelques années, il y aura de l’ombre ici. Prends ceci, pour ton aide.') },
    mosquee: { nom: I.T('Une petite mosquée de quartier'), dit: I.T('Notre rue est loin de la mosquée, et les vieux genoux peinent sur le chemin. Une petite mosquée de quartier, quelques murs de pisé et une niche, nous suffirait. Les voisins ont donné de quoi commencer.'), merci: I.T('Le quartier aura où se rassembler. Prends ceci, pour ton aide.') }
  };
  E.TX = TX;   // pour les contrôles et le validateur des langues
  const ENCORE = I.T('Le chantier t’attend, juste à côté. Il reste : {reste}.');

  /* ---------- le demandeur ---------- */
  const gensIci = () => W().npcs.filter(n => n.gens && !n.hidden && n.map === W().map.id);
  // celui qui demande : le rôle que dit la demande ; s'il n'est pas là, le premier qui se tient à sa place
  E.demandeur = function () {
    const id = E.ville(); if (!id) return null; const ch = E.chantier(id), d = ch ? ch.d : E.demande(id); if (!d) return null;
    const qui = D.ENTRAIDE.demandes[d].qui, L = gensIci(); return L.find(n => n.role === qui) || L.find(n => !n.va) || null;
  };

  /* ---------- la réserve : un tas de bois, un tas de pierres, près du puits ou de la fontaine ---------- */
  const PRES = { ville: 'puits', romaine: 'fontaine', camp: 'feu' };
  function libreBati(m, x, y) {
    const w = W(), gardes = D.GENS.garde.map(k => m.spots[k]).filter(Boolean);
    if (x < 2 || y < 2 || x >= m.w - 2 || y >= m.h - 2 || m.solid[y * m.w + x] || w.solidAt(x * T + 8, y * T + 13)) return false;
    if (Object.keys(m.spots).some(k => cheb(m.spots[k], [x, y]) < 1)) return false;
    if (gardes.some(s => cheb(s, [x, y]) <= D.GENS.marge)) return false;
    if (w.npcs.some(n => !n.hidden && n.placed && n.map === m.id && Math.abs(n.x - (x * T + 8)) < 16 && Math.abs(n.y - (y * T + 13)) < 14)) return false;
    if (I.gens && I.gens.betes.some(b => b.map === m.id && b.lieu && Math.abs(b.x - (x * T + 8)) < 16 && Math.abs(b.y - (y * T + 13)) < 14)) return false;   // (ni sur une bête)
    return true;
  }
  // un passage reste un passage : chaque lieu atteint avant l'est encore, les cases pleines posées
  function passages(m, pleines) {
    const w = m.w, p = W().player, s0 = [Math.floor(p.x / T), Math.floor((p.y - 3) / T)];
    const flood = extra => { const seen = new Uint8Array(w * m.h), q = [s0[1] * w + s0[0]]; seen[q[0]] = 1; while (q.length) { const i = q.pop(), x = i % w, y = (i - x) / w; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= m.h) continue; const j = ny * w + nx; if (seen[j] || m.solid[j] || (extra && extra.has(j))) continue; seen[j] = 1; q.push(j); } } return seen; };
    const pres = (seen, x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < w && Y < m.h && seen[Y * w + X]) return true; } return false; };
    const avant = flood(null), apres = flood(new Set(pleines.map(q => q[1] * w + q[0])));
    return Object.keys(m.spots).every(k => { const s = m.spots[k]; return !pres(avant, s[0], s[1]) || pres(apres, s[0], s[1]); });
  }
  function poserReserve(m) {
    if (m._reserve) { m.objs.forEach(o => { if (o.reserve) o.used = false; }); return; }   // chaque tas redonne à chaque arrivée
    m._reserve = true; const g = (D.MAPS[m.id] || {}).gabarit, s = m.spots[PRES[g]]; if (!s) return;
    const pris = [];
    ['troncs', 'tas_pierres'].forEach(type => {
      for (let r = 2; r <= 6; r++) { let ok = null;
        for (let j = -r; j <= r && !ok; j++) for (let i = -r; i <= r && !ok; i++) { if (Math.max(Math.abs(i), Math.abs(j)) !== r) continue; const x = s[0] + i, y = s[1] + j;
          if (!libreBati(m, x, y) || pris.some(q => cheb(q, [x, y]) < 2) || !passages(m, pris.concat([[x, y]]))) continue; ok = [x, y]; }
        if (ok) { pris.push(ok); const d = G.OBJ[type]; m.objs.push({ type, opt: undefined, x: ok[0] * T + 8, y: ok[1] * T + 15, w: d.w, h: d.h, seed: ok[0] * 31 + ok[1], reserve: true }); m.solid[ok[1] * m.w + ok[0]] = 1; break; } }
    });
  }

  /* ---------- à chaque arrivée dans une ville visitée ---------- */
  E.arme = function () { const id = E.ville(); if (!id) return; poserReserve(W().map); };

  /* ---------- A devant le demandeur (gens.js, Gn.parle) ---------- */
  E.parle = function (n) {
    const id = E.ville(); if (!id || !n || !n.gens) return false;
    const ch = E.chantier(id);
    if (ch) { if (E.demandeur() !== n) return false; (async () => { I.audio.sfx('blip'); await S.run([['say', n.id, I.t(ENCORE, { reste: E.reste(ch).map(q => D.PIECES[q[0]].name + ' ×' + q[1]).join(I.t(', ')) })]]); })(); return true; }
    const d = E.demande(id); if (!d || E.demandeur() !== n) return false;
    (async () => {
      S.depth++;
      try {
        I.audio.sfx('blip'); W().stop();
        await S.run([['say', n.id, I.t(TX[d].dit)]]);
        const i = await S.menuPick(I.t(TX[d].nom), [{ t: I.t('Aider') }, { t: I.t('Plus tard'), retour: true }]);
        if (i === 0) E.ouvrir(id, d, n);
      } finally { S.depth--; S.hideDialog(); }
    })();
    return true;
  };

  /* ---------- le chantier ---------- */
  // trouver où le tracer : à côté du demandeur, sur des cases libres, loin des portes, du comptoir et du tapis ; près de l'eau
  // s'il le faut ; sans fermer aucun passage
  E.placer = function (m, d, n) {
    const Dd = D.ENTRAIDE.demandes[d], cn = [Math.floor(n.x / T), Math.floor((n.y - 3) / T)];
    // près de lui ; et, pour ce qui demande de l'eau, près d'un puits ou d'une fontaine de la ville (du plus proche au plus loin)
    const centres = [cn]; if (Dd.eau) m.objs.filter(o => ['well', 'fountain', 'basin'].indexOf(o.type) >= 0).map(o => [Math.floor(o.x / T), Math.floor((o.y - 3) / T)]).sort((a, b) => cheb(a, cn) - cheb(b, cn)).forEach(c => centres.push(c));
    for (const c0 of centres) { const q = placerPres(m, Dd, c0, cn); if (q) return q; }
    return null;
  };
  function placerPres(m, Dd, c0, cn) {
    const p = W().player, pj = [Math.floor(p.x / T), Math.floor((p.y - 3) / T)];
    const cands = [];
    for (let r = 1; r <= 8; r++) for (let j = -r - Dd.h; j <= r; j++) for (let i = -r - Dd.w; i <= r; i++) {
      const x0 = c0[0] + i, y0 = c0[1] + j; let ok = true;
      for (let y = y0 - 1; y <= y0 + Dd.h && ok; y++) for (let x = x0 - 1; x <= x0 + Dd.w && ok; x++) {   // le rectangle, et une case autour : libres
        const dedans = x >= x0 && x < x0 + Dd.w && y >= y0 && y < y0 + Dd.h;
        if (dedans ? !libreBati(m, x, y) : (x < 1 || y < 1 || x >= m.w - 1 || y >= m.h - 1 || m.solid[y * m.w + x])) ok = false;
        if ((x === cn[0] && y === cn[1]) || (dedans && x === pj[0] && y === pj[1])) ok = false; }
      if (!ok) continue;
      const plan = Dd.plan.map(q => [x0 + q[0], y0 + q[1], q[2]]);
      if (Dd.eau && !plan.every(q => !D.PIECES[q[2]].near || I.build.eauPres(q[0], q[1]))) continue;
      if (!passages(m, plan.filter(q => D.PIECES[q[2]].solid))) continue;
      cands.push({ x0, y0, plan, e: Math.hypot(x0 + Dd.w / 2 - c0[0], y0 + Dd.h / 2 - c0[1]) + (m.g0(x0 * T + 8, y0 * T + 8) === 'path' ? 2 : 0) });
      if (cands.length > 40) break;
    }
    cands.sort((a, b) => a.e - b.e); return cands[0] || null;
  }
  E.ouvrir = function (id, d, n) {
    const m = W().map, Dd = D.ENTRAIDE.demandes[d], q = E.placer(m, d, n), e = E.de(id);
    if (!q) { E.journal.push({ quoi: 'chantier', etat: 'sans-place', d, id }); S.toast(I.t('Il n’y a pas la place ici : reviens plus tard.'), 2600); return false; }
    e.ouvert = { d, map: id, x: q.x0, y: q.y0, w: Dd.w, h: Dd.h, plan: q.plan, name: I.t(TX[d].nom), qui: n.role, fait: false };
    Object.keys(Dd.fournit || {}).forEach(k => I.build.give(k, Dd.fournit[k], true));
    E.journal.push({ quoi: 'chantier', etat: 'ouvert', d, id, x: q.x0, y: q.y0 });
    I.audio.sfx('ok'); S.toast(I.t('Chantier ouvert : <b>{nom}</b>. Il t’a donné : {dons}.', { nom: I.esc(e.ouvert.name), dons: Object.keys(Dd.fournit || {}).map(k => D.MATS[k].name + ' ×' + Dd.fournit[k]).join(I.t(', ')) || I.t('rien') }), 4600);
    I.build.leconBatir();
    // tracé loin de celui qui mène (près de l'eau) : une flèche le montre
    { const p = W().player, cx = (q.x0 + Dd.w / 2) * T, cy = (q.y0 + Dd.h / 2) * T; if (Math.hypot(cx - p.x, cy - p.y) > 6 * T) I.build.fleche = { x: cx, y: q.y0 * T, t: W().t + 9 }; }
    W().checkpoint(); return true;
  };
  // ce qui reste à poser : [[pièce, combien]]
  E.reste = function (ch) { const bati = I.build.peek(ch.map) || [], n = {}; ch.plan.forEach(q => { if (!bati.some(b => b.x === q[0] && b.y === q[1] && b.t === q[2])) n[q[2]] = (n[q[2]] || 0) + 1; }); return Object.keys(n).map(k => [k, n[k]]); };
  E.dans = (x, y) => { const id = E.ville(), ch = id && E.chantier(id); if (!ch) return false; const tx = Math.floor(x / T), ty = Math.floor((y - 3) / T); return tx >= ch.x - 1 && tx <= ch.x + ch.w && ty >= ch.y - 1 && ty <= ch.y + ch.h; };
  // après chaque pose (build.js, Bd.after) : le chantier est-il achevé ? Il remercie, et paie l'aide
  E.apres = async function () {
    const id = E.ville(), ch = id && E.chantier(id); if (!ch || E.reste(ch).length) return;
    const e = E.de(id), Dd = D.ENTRAIDE.demandes[ch.d], n = gensIci().find(x => x.role === ch.qui) || gensIci()[0];
    ch.fait = true; e.faits.push(ch.d); e.k++; e.ouvert = null; I.build.set(false);
    E.journal.push({ quoi: 'chantier', etat: 'acheve', d: ch.d, id, paie: Dd.paie });
    S.depth++;
    try {
      I.audio.sfx('roll');
      if (n) await S.run([['say', n.id, I.t(TX[ch.d].merci)]]);
      I.trade.dirhams(Dd.paie); I.audio.sfx('ok');
      S.toast(I.t('+{n} dirhams, pour ton aide.', { n: Dd.paie }), 3600);
    } finally { S.depth--; S.hideDialog(); }
    W().checkpoint();
  };

  /* ---------- ce qui se voit : le « ! » au-dessus du demandeur ---------- */
  E.render = function (c, cx, cy, t) {
    const n = E.demandeur(); if (!n || I.script.busy) return;
    const ouvert = !!E.chantier(E.ville()), x = Math.round(n.x - cx), y = Math.round(n.y - cy - 40 + Math.sin(t * 4) * 1.5);
    c.fillStyle = '#fff6dc'; c.strokeStyle = '#1a1420'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, 5, 5, 0, 0, 6.3); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(x - 2, y + 4); c.lineTo(x, y + 8); c.lineTo(x + 2, y + 4); c.fill();
    c.fillStyle = ouvert ? '#6b5a3a' : '#b33327'; if (ouvert) { c.fillRect(x - 3, y, 1, 1); c.fillRect(x, y, 1, 1); c.fillRect(x + 3, y, 1, 1); } else { c.fillRect(x, y - 3, 1, 4); c.fillRect(x, y + 2, 1, 1); }
  };
})();
