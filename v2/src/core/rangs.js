/* ISNAD — la bataille déclarée : des rangs, un terrain, des ordres.
   Dans un chapitre qui déclare une `bataille`, le combat de l'idole se double d'un champ de cinq colonnes sur trois
   couloirs. Nos rangs y tiennent, avancent, chargent, tirent. En face, jamais des hommes : les nuées de l'idole, c'est-à-dire
   ses égrégores, tels qu'ils sont déjà dessinés. Le combat du groupe continue comme avant ; le champ s'y ajoute.

   Inspiré du genre tactique (terrain quadrillé, prise de flanc, tenaille, tour par tour), sans rien reprendre d'un jeu
   existant : ni nom, ni écran, ni règle copiée.

   Règles et dessin seulement. Types de rangs, ordres et manœuvres : defs.js (D.RANGS, D.ORDRES, D.MANOEUVRES). La mission
   (quels rangs, quels ordres) : le champ `bataille` du chapitre. Le moteur calcule les forces ; un fichier de saga n'en fixe aucune.

   Garde-fous (exigences 6 et 19) : il n'y a jamais d'hommes en face ; un rang éprouvé se replie et se reforme, personne ne
   tombe à l'écran ; aucun effectif n'est affirmé ; les ordres se limitent à ce que la mission permet ; l'issue du combat ne
   change rien à l'histoire. Les manœuvres du stratège sont des manœuvres d'école : le jeu ne dit pas que l'une d'elles fut
   faite tel jour. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world;
  const R = I.rangs = {};
  const COLS = 5, VOIES = 3, NOMS = [I.T('aile nord'), I.T('centre'), I.T('aile sud')], LIGNES = [I.T('au camp'), I.T('en première ligne'), I.T('au milieu du champ'), I.T('en avant'), I.T('au pied de l’idole')];
  const PALIER = { boss: 3, elite: 2, minion: 1 }, VOIE = { nord: 0, centre: 1, sud: 2 };
  const ou = u => I.t('{voie}, {ligne}', { voie: I.t(NOMS[u.l]), ligne: I.t(LIGNES[u.c]) });
  const tenue = n => '▮'.repeat(Math.max(0, n)) + '▯'.repeat(Math.max(0, 3 - n));
  const num = r => `<b class="num">${r.no}</b>`; // le numéro du rang : le même sur le champ et dans les menus

  /* ================= mise en place ================= */
  // la mission du chapitre en cours, si ce combat est celui de son idole
  R.mission = function (opts) { const B = W.ch && W.ch.bataille; return B && I.mal.estIdole(opts) ? B : null; };
  // combien de rangs le groupe peut mener : ce que la mission donne, plus un au niveau 4, un autre au niveau 8
  R.combien = function (B) { const lvl = W.party.length ? W.hero(W.party[0]).lvl : 1; return Math.min((B.rangs || []).length, 4, (B.base || 2) + (lvl >= 4 ? 1 : 0) + (lvl >= 8 ? 1 : 0)); };
  // api : ce que le combat prête au champ (ses menus, ses bandeaux, ses effets sur l'idole et sur le groupe)
  R.ouvre = function (C, opts, api) {
    const B = R.mission(opts); if (!B) return null;
    const n = R.combien(B), saga = W.saga, niv = I.mal.niveau(), L = I.mal.lignee(saga, W.ch);
    const ch = { B, api, rangs: [], nuees: [], flancs: [false, false, false], pas: 0, vue: false, libre: -1, sel: null, cibles: [], seq: 0,
      ordres: (B.ordres || null), cadence: niv <= 2 ? 4 : niv === 3 ? 3 : 2, max: niv <= 2 ? 2 : niv === 3 ? 3 : 4, niv };
    // la place de départ : celle que la mission donne (`voie`, `ligne`), sinon la première libre, le centre d'abord
    const libres = [[1, 1], [1, 0], [1, 2], [0, 1], [0, 0], [0, 2]], prend = (c, l) => { const k = libres.findIndex(p => p[0] === c && p[1] === l); return k < 0 ? null : libres.splice(k, 1)[0]; };
    const mission = (B.rangs || []).slice(0, n), places = mission.map(r => r.voie ? prend(r.ligne === 0 ? 0 : 1, VOIE[r.voie]) : null).map(p => p || libres.shift());
    mission.forEach((r, i) => { const T = D.RANGS[r.t], ordres = R.ordresDe(ch, { T }), veut = T.ordres.includes('tirer') ? 'tirer' : 'tenir';
      ch.rangs.push({ id: 'r' + i, no: i + 1, t: r.t, T, name: r.name || T.name, c: places[i][0], l: places[i][1], tenue: 3, ordre: ordres.includes(veut) ? veut : ordres[0], repos: 0,
        sheet: G.planche(Object.assign({ kind: 'soldat', robe: '#8a7355', head: '#cdbf9f' }, T.look, r.look)), flash: 0 }); });
    // un allié gagné par la parole, si le récit en fait une troupe (`rang`) : le « renfort » devient un rang, déjà engagé au
    // milieu du champ (un par bataille au plus). Les autres alliés (une veille commune, un dû versé) agissent comme avant.
    (n ? (opts.allies || []) : []).filter(al => al.rang && S.flags[al.flag]).slice(0, 1).forEach(al => { const T = D.RANGS[al.rang] || D.RANGS.gens, ordres = R.ordresDe(ch, { T }), tir = x => ch.rangs.some(r => r.l === x && r.T.ordres.includes('tirer')) ? 1 : 0;
      const l = [2, 0, 1].sort((a, b) => tir(a) - tir(b)).find(x => !ch.rangs.some(r => r.l === x && r.c === 2)); // pas devant des archers : il leur boucherait le couloir
      if (l === undefined) return;
      ch.rangs.push({ id: 'r' + ch.rangs.length, no: ch.rangs.length + 1, t: al.rang || 'gens', T, name: al.name, allie: true, c: 2, l, tenue: 3, ordre: ordres.includes('avancer') ? 'avancer' : 'tenir', repos: 0,
        sheet: G.planche(Object.assign({ kind: 'soldat', robe: '#7a6a58', head: '#d9cfb4' }, T.look, al.look)), flash: 0 }); });
    // les nuées : les égrégores du chapitre (les plus humbles d'abord), une par couloir pour commencer
    const pool = L.egregores.filter(id => saga.enemies[id]).sort((a, b) => (PALIER[saga.enemies[a].tier] || 0) - (PALIER[saga.enemies[b].tier] || 0)); ch.pool = pool.length ? pool : L.idoles.slice(0, 1);
    const voies = [1, 0, 2]; for (let i = 0; i < Math.min(ch.max, VOIES); i++) { const c = 4 - (i === 0 ? 1 : 0); if (!en(ch, c, voies[i])) nuee(ch, c, voies[i]); }
    ch.rangs.concat(ch.nuees).forEach(u => { u.px = null; });
    ch.stats = { perces: 0, dissipees: 0, eprouves: 0 }; ch.depuis = 0;
    return n ? ch : null; // sans rangs, pas de champ : la bataille est déclarée, et le groupe la livre seul
  };
  // Le champ bouge après chaque tour de l'idole, et au plus tard tous les trois tours.
  R.du = function (C, act) {
    const ch = C.champ; if (!ch) return false; ch.depuis++;
    if ((act.side === 'foe' && I.mal.lignee(W.saga, W.ch).idoles.includes(act.id)) || ch.depuis >= 3) { ch.depuis = 0; return true; }
    return false;
  };
  function nuee(ch, c, l) { const id = ch.pool[ch.seq % ch.pool.length], def = W.saga.enemies[id] || (I.common && I.common.enemies[id]); ch.nuees.push({ id: 'n' + (ch.seq++), def, name: def.name, c, l, corps: 2, decouverte: false, spr: G.enemy(def.art, def.hue, 1, ch.seq), flash: 0, ph: Math.random() * 6, px: null }); }
  const en = (ch, c, l) => ch.rangs.find(r => !r.repos && r.c === c && r.l === l) || ch.nuees.find(n => n.c === c && n.l === l) || null;
  const rangEn = (ch, c, l) => ch.rangs.find(r => !r.repos && r.c === c && r.l === l) || null;
  const nueeEn = (ch, c, l) => ch.nuees.find(n => n.c === c && n.l === l) || null;
  const actifs = ch => ch.rangs.filter(r => !r.repos);

  /* ================= la préparation : ce que l'on a, ce qui manque ================= */
  // ce que la mission aligne pour ce combat, sans ouvrir le champ : les rangs, le renfort, les alliés venus ou non
  R.apercu = function (opts) {
    const B = (W.ch && W.ch.bataille) || {}, tous = B.rangs || [], n = tous.length ? R.combien(B) : 0, gagnes = (opts.allies || []).filter(a => S.flags[a.flag]);
    const renfort = n ? gagnes.filter(a => a.rang).slice(0, 1) : [];
    return { B, rangs: tous.slice(0, n).map(r => ({ name: r.name || D.RANGS[r.t].name, T: D.RANGS[r.t] })), plus: tous.length - n, renfort, venus: gagnes.filter(a => !renfort.includes(a)), absents: (opts.allies || []).filter(a => !S.flags[a.flag]) };
  };
  const idoleDe = opts => { const L = I.mal.lignee(W.saga, W.ch).idoles, id = opts.group.find(g => L.includes(g)) || opts.group[0]; return W.saga.enemies[id] || (I.common && I.common.enemies[id]) || { name: '', weak: [] }; };
  // La page de préparation (ouverte par ui.js avant chaque combat d'idole). Elle signale, elle ne bloque rien.
  R.panePrepa = function (opts) {
    const A = R.apercu(opts), E = idoleDe(opts), Gr = I.gear, hs = W.party.map(id => W.hero(id)), lvl = hs.length ? hs[0].lvl : 1, L = [];
    const li = (ok, titre, html) => L.push(`<li class="${ok ? 'ok' : 'manque'}"><b>${titre}</b>${html}</li>`), noms = a => a.map(x => I.esc(x.name)).join(', ');
    // les hommes
    { let h = '', ok = true;
      if (A.rangs.length) { h += I.t('{n} rang : {noms}.¦{n} rangs : {noms}.', { n: A.rangs.length, noms: noms(A.rangs) }); if (A.renfort.length) h += ' ' + I.t('En renfort sur le champ : {noms}.', { noms: noms(A.renfort) }); if (A.plus > 0 && lvl < 8) h += ` <small>${I.t('Un rang de plus au niveau {n}.', { n: lvl < 4 ? 4 : 8 })}</small>`; }
      else h += I.fmt(A.B.mot || I.t('Il n’y a pas de rangs à mener ici : ce combat se livre sans armée.'));
      if (A.venus.length) h += ' ' + I.t('Avec vous dès l’ouverture : {noms}.', { noms: noms(A.venus) });
      if (A.absents.length) { ok = false; h += ` <em>${I.t('N’est pas venu : {noms}.', { noms: noms(A.absents) })}</em> <small>${I.t('Une parole mieux menée l’aurait gagné.')}</small>`; }
      li(ok, I.t('Les hommes'), h); }
    // le groupe
    { let ok = true; const h = hs.map(x => { const st = I.calc.of(x), bas = x.hp < st.hp * 0.6 || x.sp < st.sp * 0.4; if (bas) ok = false; return `${I.t('{nom} · niveau {n} · Constance {hp}/{hpmax} · Souffle {sp}/{spmax}', { nom: I.esc(x.def.name), n: x.lvl, hp: Math.ceil(x.hp), hpmax: st.hp, sp: x.sp, spmax: st.sp })}${x.hp <= 0 ? ' <em>' + I.t('(éprouvé)') + '</em>' : bas ? ' <em>' + I.t('(entamé)') + '</em>' : ''}`; }).join('<br>');
      li(ok, I.t('Le groupe'), h + (ok ? '' : '<br><small>' + I.t('Le groupe n’est pas reposé : une natte, ou la besace, l’aurait remis.') + '</small>')); }
    // armes, boucliers, casques, cuirasses
    { let vides = 0, dispo = 0; const h = hs.map(x => { const eq = Gr.of(x); return I.t('{nom} : {pieces}', { nom: I.esc(x.def.name), pieces: Gr.SLOTS.map(s => { const id = eq[s]; if (id) return Gr.img(id) + ' ' + I.esc(D.GEAR[id].name); vides++; if (Gr.reserve(s).some(g => Gr.can(x.def, g))) dispo++; return `<span class="rien">${I.t('{place_min} : rien', { place_min: D.SLOTS[s].toLowerCase(), place: D.SLOTS[s] })}</span>`; }).join(' · ') }); }).join('<br>');
      li(!dispo, I.t('Armes, boucliers, casques, cuirasses'), h + (dispo ? `<br><em>${I.t('{n} emplacement vide alors que la réserve a de quoi.¦{n} emplacements vides alors que la réserve a de quoi.', { n: dispo })}</em> <small>${I.t('« Équiper au mieux » s’en charge.')}</small>` : vides ? '<br><small>' + I.t('La réserve n’a rien de plus pour eux : les coffres et les comptoirs la remplissent.') + '</small>' : '')); }
    // les vertus
    { const P = W.pillars(), connues = (E.weak || []).slice(0, Math.floor((P.savoir || 0) / 2)), port = {}; hs.forEach(x => { port[x.def.el] = 1; x.def.skills.filter(k => k.lvl <= x.lvl && k.el).forEach(k => { port[k.el] = 1; }); });
      const mine = Object.keys(port).filter(e => D.ELEMENTS[e] && e !== 'fer').map(e => `<span style="color:${D.ELEMENTS[e].color}">${D.ELEMENTS[e].glyph} ${D.ELEMENTS[e].name}</span>`).join(' · ') || I.t('aucune');
      const touche = connues.filter(e => port[e]);
      li(!connues.length || touche.length > 0, I.t('Les vertus'), I.t('Vertus du groupe : {lumieres}.', { lumieres: mine }) + '<br>' + (connues.length ? I.t('Failles connues de l’idole : {failles}.', { failles: connues.map(e => D.ELEMENTS[e].name).join(', ') }) + ' ' + (touche.length ? I.t('Le groupe en porte.') : '<em>' + I.t('Le groupe n’en porte aucune.') + '</em>') : '<small>' + I.t('Ses failles restent à découvrir en combattant ; un Savoir plus haut dans ce maillon en révèle d’emblée.') + '</small>')); }
    // la besace
    { const it = I.save.data.items || {}, ks = Object.keys(D.ITEMS).filter(k => (it[k] || 0) > 0);
      li(ks.length > 0, I.t('La besace'), ks.length ? ks.map(k => `${I.esc(D.ITEMS[k].name)} ×${it[k]}`).join(' · ') : '<em>' + I.t('Vide.') + '</em> <small>' + I.t('Les coffres et les comptoirs la remplissent.') + '</small>'); }
    // le cœur
    { const w = I.oeuvres.weight(opts), z = I.oeuvres.zad(), prie = !!S.flags._prayed;
      li(z >= w && prie, I.t('Le cœur'), I.t('Provision ♥ {z} · l’épreuve en demande {w}.', { z, w }) + ' ' + (z >= w ? I.t('Le cœur est prêt.') : `<em>${I.t('Il en manquera {n} : le cœur sera lourd.', { n: w - z })}</em> <small>${I.t('Les œuvres du jour, sur la natte, nourrissent la provision.')}</small>`) +
        '<br>' + (prie ? I.t('Tu es passé par la prière dans ce chapitre.') : '<em>' + I.t('Tu n’es pas encore passé par la natte dans ce chapitre.') + '</em>') + R.motSecours(prie)); }
    const manque = L.filter(x => x.indexOf('class="manque"') > 0).length;
    return `<h3>${I.esc(E.name)}</h3><p class="src">${I.t('Bataille déclarée · enracinement {traits}', { traits: I.mal.traits(I.mal.niveau()) })}</p><ul class="prepa">${L.join('')}</ul>` +
      `<p class="src">${manque ? I.t('{n} point à regarder, marqué d’un ◇.¦{n} points à regarder, marqués d’un ◇.', { n: manque }) : I.t('Tout est là.')} ${I.t('Rien n’empêche de déclarer la bataille : cette page dit ce que l’on a, et ce qui manque.')}</p>`;
  };
  R.motSecours = prie => { const T = (I.sagas.coeur && I.sagas.coeur.secours) || {}, t = prie ? T.pret : T.absent; return t ? ` <small>${I.esc(t)}</small>` : ''; };

  // la bataille est déclarée : l'idole, son enracinement, les rangs présents. La page de préparation le dit ; ici, le Recueil s'ouvre.
  R.declare = async function (C, opts) {
    if (!I.mal.estIdole(opts)) return; // toute idole se combat par une bataille déclarée ; la mission dit s'il y a des rangs
    I.oeuvres.learn('bataille');
  };

  /* ================= le pas : nos rangs, puis les nuées ================= */
  // frappe d'un rang sur une nuée : de flanc si un autre rang la borde dans le couloir voisin ; en tenaille si elle est prise des deux côtés
  function frappe(ch, r, n, elan) {
    const cote = d => !!rangEn(ch, n.c, n.l + d), av = !!rangEn(ch, n.c - 1, n.l), ar = !!rangEn(ch, n.c + 1, n.l);
    const tenaille = (cote(-1) && cote(1)) || (av && ar), flanc = cote(-1) || cote(1) || n.decouverte;
    const d = tenaille ? 9 : 1 + (elan ? 1 : 0) + (flanc ? 1 : 0); n.corps -= d; n.flash = 1; r.flash = 0.6; n.decouverte = false;
    dire(ch, n, tenaille ? I.t('En tenaille') : flanc ? I.t('De flanc') : elan ? I.t('Charge') : I.t('Touchée'), tenaille || flanc ? 'break' : 'info');
    return d;
  }
  // un mot au-dessus d'une case : en haut pour une nuée, en bas pour un rang, pour que deux voisins ne se recouvrent pas
  function dire(ch, u, txt, cls) { const g = geo(ch), bas = !u.def; u.mots = ((u.mots || 0) + 1) % 2; ch.api.floater({ x: g.cx(u.c), x0: g.cx(u.c), y: g.cy(u.l) + (bas ? 53 + u.mots * 9 : 29 - u.mots * 9), ox: 0, side: 'hero', size: 0 }, txt, cls || 'info'); }
  function direIdole(ch, txt, cls) { const g = geo(ch); ch.api.floater({ x: g.xi, x0: g.xi, y: g.y0 + VOIES * g.chh / 2 + 20, ox: 0, side: 'hero', size: 0 }, txt, cls || 'info'); }
  // un rang exécute son ordre
  function agit(ch, r) {
    const T = r.T, devant = nueeEn(ch, r.c + 1, r.l);
    if (r.ordre === 'tirer') { for (let d = 1; d <= 3; d++) { const n = nueeEn(ch, r.c + d, r.l); if (n) { frappe(ch, r, n, false); return; } if (rangEn(ch, r.c + d, r.l)) return; } return; }
    if (r.ordre === 'tenir') { if (devant) frappe(ch, r, devant, false); return; }
    if (r.ordre === 'replier') { if (r.c > 0 && !en(ch, r.c - 1, r.l)) r.c--; r.ordre = 'tenir'; return; }
    if (r.ordre === 'glisser-' || r.ordre === 'glisser+') { const l = r.l + (r.ordre === 'glisser-' ? -1 : 1); if (l >= 0 && l < VOIES && !en(ch, r.c, l)) r.l = l; r.ordre = r.avant || 'tenir'; const n = nueeEn(ch, r.c + 1, r.l); if (n) frappe(ch, r, n, false); return; }
    // avancer, charger : une case (deux pour une charge), et le coup si une nuée barre le couloir
    const pas = r.ordre === 'charger' ? 2 : 1; let fait = 0;
    for (let k = 0; k < pas; k++) { if (r.c + 1 < COLS && !en(ch, r.c + 1, r.l)) { r.c++; fait++; } else break; }
    const n = nueeEn(ch, r.c + 1, r.l); if (n) frappe(ch, r, n, r.ordre === 'charger' && fait > 0);
  }
  R.pas = async function (C) {
    const ch = C.champ; if (!ch) return; const api = ch.api, vite = I.debug.auto;
    ch.pas++; ch.vue = true; api.refresh(); if (!vite) await I.sleep(300);
    // 1. nos rangs, ceux de l'avant d'abord
    actifs(ch).sort((a, b) => b.c - a.c).forEach(r => agit(ch, r));
    balaie(ch); if (!vite) await I.sleep(620);
    // 2. les nuées : elles avancent d'une case, ou frappent le rang qui leur barre le couloir
    let perce = 0;
    ch.nuees.slice().sort((a, b) => a.c - b.c).forEach(n => {
      const r = rangEn(ch, n.c - 1, n.l);
      if (r) { const tient = r.ordre === 'tenir' && r.T.ferme && Math.random() < 0.5; if (tient) dire(ch, r, I.t('Tient bon'), 'info'); else { r.tenue--; r.flash = 1; dire(ch, r, I.t('Éprouvé'), 'dmg'); if (r.tenue <= 0) { r.repos = 3; ch.stats.eprouves++; dire(ch, r, I.t('Se replie'), 'info'); } } return; }
      if (n.c === 0) { n.corps = 0; n.passe = true; perce++; ch.stats.perces++; return; }
      if (!en(ch, n.c - 1, n.l)) n.c--;
    });
    balaie(ch);
    if (perce) { const hs = api.heros(); if (hs.length) { const h = I.pick(hs); api.doute(h); } if (!vite) await api.banner('<small>' + I.t('Le champ') + '</small>' + I.t('Une nuée a percé : le doute gagne'), 1300, false, 'speech foe'); }
    // 3. un couloir ouvert jusqu'au pied de l'idole découvre son flanc : un voile tombe, une faille se révèle
    for (const r of actifs(ch)) { if (r.c === COLS - 1 && !ch.flancs[r.l]) { ch.flancs[r.l] = true; r.ordre = 'tenir'; const idole = api.idole(); if (idole) { const v = api.voile(idole); api.revele(idole); direIdole(ch, v === 'devoile' ? I.t('DÉVOILÉ') : I.t('Voile ôté'), 'break'); } I.audio.sfx('roll');
      if (!vite) await api.banner(`<small>${I.esc(r.name)} · ${I.t(NOMS[r.l])}</small>${I.t('Flanc découvert : un voile tombe')}`, 1500, false, 'speech intro'); } }
    // 4. les rangs repliés se reforment ; l'idole envoie une nuée de plus, à sa cadence
    ch.rangs.forEach(r => { if (r.repos && --r.repos <= 0) { const l = [1, 0, 2].find(x => !en(ch, 0, x)); if (l === undefined) { r.repos = 1; return; } r.c = 0; r.l = l; r.tenue = 2; r.ordre = 'tenir'; r.px = null; } });
    if (ch.pas % ch.cadence === 0 && ch.nuees.length < ch.max) { const l = [1, 0, 2].filter(x => !ch.flancs[x] && !en(ch, COLS - 1, x)); if (l.length) nuee(ch, COLS - 1, I.pick(l)); }
    api.refresh(); if (!vite) await I.sleep(460);
    ch.vue = false; ch.sel = null; ch.cibles = []; api.refresh();
  };
  function balaie(ch) { ch.nuees = ch.nuees.filter(n => { if (n.corps > 0) return true; if (!n.passe) { ch.stats.dissipees++; dire(ch, n, I.t('Dissipée'), 'break'); } return false; }); }

  /* ================= ordonner ================= */
  const stratege = (C, h) => !!(h && h.def.stratege);
  R.ordresDe = function (ch, r) { let L = r.T.ordres.slice(); if (ch.ordres) L = L.filter(o => ch.ordres.includes(o)); return L; };
  // au tour d'un compagnon. Rend 'libre' (l'ordre n'a pas coûté le tour : le stratège), true (le tour est donné à l'ordre) ou false (rien)
  R.ordonner = async function (C, h) {
    const ch = C.champ, api = ch.api, box = api.box(); if (!actifs(ch).length) { api.banner(I.t('Aucun rang à ordonner pour l’instant.'), 900); return false; }
    ch.vue = true; ch.menu = true; api.refresh();
    const fin = v => { ch.vue = false; ch.menu = false; ch.sel = null; ch.cibles = []; api.refresh(); return v; };
    const gratuit = stratege(C, h) && ch.libre !== C.turn, cout = gratuit ? I.t('sans perdre son tour') : I.t('à la place de son action');
    for (;;) {
      const L = actifs(ch), items = L.map(r => ({ label: `${num(r)} ${I.esc(r.name)}`, sub: `${nomOrdre(r.ordre)} ${tenue(r.tenue)}`, desc: `${ou(r)}. ${r.T.desc || ''}` }));
      const man = stratege(C, h) ? Object.keys(D.MANOEUVRES).filter(m => possible(ch, m)) : [];
      man.forEach(m => items.push({ label: `✦ ${D.MANOEUVRES[m].name}`, sub: I.t('stratège'), desc: D.MANOEUVRES[m].desc, cls: 'limit' }));
      const i = await api.listMenu(box, `<b style="color:${h.color}">${I.t('{nom} ordonne', { nom: I.esc(h.name) })}</b> <span class="niyya">${cout}</span>`, items, { desc: true, back: true, onSel: k => { ch.sel = k < L.length ? L[k] : null; ch.cibles = []; } });
      if (i < 0) return fin(false);
      if (i >= L.length) { if (!(await manoeuvre(C, h, man[i - L.length]))) continue; }
      else {
        const r = L[i], O = R.ordresDe(ch, r), its = [];
        O.forEach(o => { if (o === 'glisser') { [-1, 1].forEach(d => { const l = r.l + d; if (l >= 0 && l < VOIES) its.push({ o: d < 0 ? 'glisser-' : 'glisser+', label: I.t('Glisser vers {le_voie}', { le_voie: NOMS[l] === 'centre' ? 'le centre' : 'l’' + NOMS[l], voie: I.t(NOMS[l]) }), desc: D.ORDRES.glisser.desc, c: [r.c, l] }); }); }
          else its.push({ o, label: D.ORDRES[o].name, desc: D.ORDRES[o].desc, c: o === 'avancer' ? [r.c + 1, r.l] : o === 'charger' ? [r.c + 2, r.l] : o === 'replier' ? [r.c - 1, r.l] : null }); });
        ch.sel = r;
        const j = await api.listMenu(box, `<b>${num(r)} ${I.esc(r.name)}</b> <span class="niyya">${ou(r)}</span>`, its.map(x => ({ label: x.label, sub: x.o === r.ordre ? I.t('ordre actuel') : '', desc: x.desc })), { desc: true, back: true, onSel: k => { ch.cibles = its[k] && its[k].c ? [its[k].c] : []; } });
        if (j < 0) { ch.cibles = []; continue; }
        if (its[j].o.indexOf('glisser') === 0) r.avant = r.ordre.indexOf('glisser') === 0 ? (r.avant || 'tenir') : r.ordre;
        r.ordre = its[j].o; dire(ch, r, nomOrdre(r.ordre), 'info'); I.audio.sfx('tek');
      }
      if (gratuit) { ch.libre = C.turn; await I.sleep(380); return fin('libre'); }
      await I.sleep(380); return fin(true);
    }
  };
  const nomOrdre = o => o === 'glisser-' || o === 'glisser+' ? I.t('glisser') : (D.ORDRES[o] ? D.ORDRES[o].name.toLowerCase() : o);
  // les manœuvres du stratège : des manœuvres d'école, que le jeu prête à celui dont c'est le métier
  function possible(ch, m) {
    const A = actifs(ch);
    if (m === 'garde') return A.some(r => r.T.monte);
    if (m === 'tenaille') return !!(A.find(r => r.l === 0) && A.find(r => r.l === 2));
    if (m === 'feinte') return A.some(r => r.c > 0 && !en(ch, r.c - 1, r.l) && [1, 2, 3].some(d => nueeEn(ch, r.c + d, r.l)));
    return false;
  }
  async function manoeuvre(C, h, m) {
    const ch = C.champ, api = ch.api, box = api.box(), A = actifs(ch);
    if (m === 'garde') {
      // une place par couloir : la case libre la plus avancée de notre moitié du champ, sans passer derrière une nuée
      const r = A.find(x => x.T.monte), libres = [];
      for (let l = 0; l < VOIES; l++) { let c = -1; for (let k = 0; k <= 2; k++) { if (nueeEn(ch, k, l)) break; if (!en(ch, k, l)) c = k; } if (c >= 0 && !(r.l === l && r.c === c)) libres.push([c, l]); }
      if (!libres.length) { api.banner(I.t('Aucune case libre de notre côté.'), 900); return false; }
      ch.sel = r;
      const j = await api.listMenu(box, `<b>${D.MANOEUVRES.garde.name}</b> <span class="niyya">${num(r)} ${I.esc(r.name)}</span>`, libres.map(p => ({ label: I.t('{voie}, {ligne}', { voie: I.t(NOMS[p[1]]), ligne: I.t(LIGNES[p[0]]) }) })), { back: true, onSel: k => { ch.cibles = [libres[k]]; } });
      if (j < 0) { ch.cibles = []; return false; }
      r.c = libres[j][0]; r.l = libres[j][1]; ch.cibles = []; dire(ch, r, D.MANOEUVRES.garde.name, 'info');
    } else if (m === 'tenaille') {
      [A.find(r => r.l === 0), A.find(r => r.l === 2)].forEach(r => { for (let k = 0; k < 2; k++) if (r.c + 1 < COLS && !en(ch, r.c + 1, r.l)) r.c++; });
      // une nuée du centre bordée des deux côtés se dissipe sur-le-champ
      ch.nuees.forEach(n => { if (rangEn(ch, n.c, n.l - 1) && rangEn(ch, n.c, n.l + 1)) { n.corps = 0; n.flash = 1; dire(ch, n, I.t('Enveloppée'), 'break'); } });
      balaie(ch);
    } else if (m === 'feinte') {
      const L = A.filter(r => r.c > 0 && !en(ch, r.c - 1, r.l) && [1, 2, 3].some(d => nueeEn(ch, r.c + d, r.l)));
      let r = L[0]; if (L.length > 1) { const j = await api.listMenu(box, `<b>${D.MANOEUVRES.feinte.name}</b>`, L.map(x => ({ label: `${num(x)} ${I.esc(x.name)}`, sub: I.t(NOMS[x.l]), desc: ou(x) })), { desc: true, back: true, onSel: k => { ch.sel = L[k]; } }); if (j < 0) return false; r = L[j]; }
      const n = [1, 2, 3].map(d => nueeEn(ch, r.c + d, r.l)).find(Boolean); r.c--;
      while (n.c - 1 > r.c && !en(ch, n.c - 1, n.l)) n.c--; n.decouverte = true; dire(ch, n, I.t('Découverte'), 'info');
    }
    I.audio.sfx('roll'); api.refresh(); return true;
  }
  // le joueur de test : le stratège ajuste un rang par tour, sans que cela lui coûte
  R.auto = function (C, h) {
    const ch = C.champ; if (!ch || !stratege(C, h) || ch.libre === C.turn) return;
    for (const r of actifs(ch)) {
      const O = R.ordresDe(ch, r), pres = [1, 2].some(d => nueeEn(ch, r.c + d, r.l));
      const veut = O.includes('tirer') ? 'tirer' : pres ? (O.includes('charger') ? 'charger' : 'tenir') : (O.includes('avancer') ? 'avancer' : 'tenir');
      if (veut !== r.ordre) { r.ordre = veut; ch.libre = C.turn; return; }
    }
  };

  /* ================= dessin ================= */
  // Le champ se dessine là où le panneau du combat ne le couvre pas : toute la scène quand l'écran est en hauteur (le panneau
  // est dessous), le haut de la scène sinon.
  function geo(ch) {
    const vx = G.view.x, vw = G.view.w, sous = ch.api.dessous(), cw = Math.min(42, Math.floor((vw - 26) / (COLS + 1.85))), chh = sous ? 38 : 31, x1 = vx + vw - 26, y0 = sous ? 64 : 19;
    const gx = x1 - COLS * cw, wi = Math.round(Math.min(VOIES * chh - 6, cw * 2.6));
    return { vx, vw, cw, chh, x1, y0, gx, wi, cx: c => x1 - (c + 0.5) * cw, cy: l => y0 + (l + 0.5) * chh, xi: Math.round(Math.max(vx + wi / 2 - 6, gx - cw * 0.55)) };
  }
  // le cadre du champ sur la scène, en points du canevas : pour les outils, qui vérifient que rien ne le couvre
  R.cadre = function (ch) { const g = geo(ch); return { x: g.gx, y: g.y0, w: COLS * g.cw, h: VOIES * g.chh, vx: g.vx, vw: g.vw, ph: G.PH }; };
  R.maj = function (C, dt) {
    const ch = C.champ; if (!ch) return; const g = geo(ch), k = Math.min(1, dt * 9);
    ch.rangs.concat(ch.nuees).forEach(u => { const tx = g.cx(u.c), ty = g.cy(u.l); if (u.px === null) { u.px = tx; u.py = ty; } u.px += (tx - u.px) * k; u.py += (ty - u.py) * k; if (u.flash > 0) u.flash -= dt * 3; });
  };
  // un cheval : une silhouette sombre, sans aucun trait
  function cheval(c, x, y) { c.fillStyle = '#3a2a1e'; c.fillRect(x - 7, y - 9, 13, 5); c.fillRect(x - 9, y - 12, 4, 5); c.fillRect(x - 10, y - 13, 3, 3); c.fillRect(x - 6, y - 4, 2, 4); c.fillRect(x - 2, y - 4, 2, 4); c.fillRect(x + 3, y - 4, 2, 4); c.fillRect(x + 6, y - 9, 2, 5); }
  // un rang, autour de (x0, y0) : deux lignes de silhouettes, celle du fond d'abord ; des cavaliers : un par point de tenue, en selle
  function troupe(c, r, x0, y0, f) {
    const n = r.tenue; if (n <= 0) return;
    c.fillStyle = 'rgba(4,3,10,.42)'; c.fillRect(Math.round(x0 - 4 - n * 4), Math.round(y0 + 9), n * 8 + 8, 3);
    if (r.T.monte) { for (let i = 0; i < n; i++) { const x = Math.round(x0 - (n - 1) * 4.5 - 8 + i * 9), y = Math.round(y0 - 13); cheval(c, x + 8, y + 24); c.drawImage(r.sheet, f * 16, 24, 16, 24, x, y - 5, 16, 24); } return; }
    for (let lig = 0; lig < 2; lig++) for (let i = 0; i < n; i++) { const x = Math.round(x0 - (n - 1) * 3.5 - 8 + i * 7 + (lig ? 0 : 3)), y = Math.round(y0 - 13 - (lig ? 0 : 5)); c.drawImage(r.sheet, f * 16, 24, 16, 24, x, y, 16, 24); }
  }
  // le numéro d'un rang, en gros points : le même que dans les menus
  const CHIFFRES = { 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'], 3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'] };
  function chiffre(c, n, x, y) { const gl = CHIFFRES[n]; if (!gl) return; c.fillStyle = 'rgba(8,7,18,.86)'; c.fillRect(x, y, 10, 14); c.fillStyle = '#e9c877'; gl.forEach((row, j) => { for (let i = 0; i < 3; i++) if (row[i] === '#') c.fillRect(x + 2 + i * 2, y + 2 + j * 2, 2, 2); }); }
  // l'ordre courant d'un rang, d'un signe : un chevron vers l'idole (avancer), deux (charger), un vers le camp (se replier),
  // des points (tirer), un chevron vers le couloir voisin (glisser). Rien : il tient.
  function signe(c, r, g) {
    const xl = Math.round(r.px - g.cw / 2) + 2, xr = Math.round(r.px + g.cw / 2) - 3, y = Math.round(r.py), o = r.ordre; c.fillStyle = '#e9c877';
    const chev = (x, s) => { for (let i = 0; i < 3; i++) { c.fillRect(x + s * i, y - i, 1, 1); c.fillRect(x + s * i, y + i, 1, 1); } };
    if (o === 'avancer') chev(xl, 1); else if (o === 'charger') { chev(xl, 1); chev(xl + 3, 1); } else if (o === 'replier') chev(xr, -1);
    else if (o === 'tirer') { for (let i = 0; i < 3; i++) c.fillRect(xl - 1 - i * 3, y, 1, 1); }
    else if (o === 'glisser-' || o === 'glisser+') { const s = o === 'glisser-' ? -1 : 1, yy = Math.round(r.py + s * (g.chh / 2 - 3)), x = Math.round(r.px); for (let i = 0; i < 3; i++) { c.fillRect(x - i, yy - s * i, 1, 1); c.fillRect(x + i, yy - s * i, 1, 1); } }
  }
  R.dessine = function (C, c, t) {
    const ch = C.champ, g = geo(ch), hue = C.hue, lights = [], H = VOIES * g.chh;
    c.drawImage(C.bg, 0, 0); c.fillStyle = 'rgba(6,5,14,.5)'; c.fillRect(0, 0, G.PW, G.PH);
    // le champ : trois couloirs, cinq colonnes ; notre camp à droite, l'idole à gauche
    for (let l = 0; l < VOIES; l++) for (let k = 0; k < COLS; k++) {
      const x = g.x1 - (k + 1) * g.cw, y = g.y0 + l * g.chh;
      c.fillStyle = `hsla(${hue},66%,${(k + l) % 2 ? 27 : 21}%,.6)`; c.fillRect(x, y, g.cw - 1, g.chh - 1);
      if (ch.flancs[l] && k === COLS - 1) { c.fillStyle = 'rgba(233,200,119,.28)'; c.fillRect(x, y, g.cw - 1, g.chh - 1); }
    }
    c.fillStyle = 'rgba(233,200,119,.07)'; c.fillRect(g.x1, g.y0, 26, H - 1);
    ch.cibles.forEach(p => { if (p[0] < 0 || p[0] >= COLS || p[1] < 0 || p[1] >= VOIES) return; const x = g.x1 - (p[0] + 1) * g.cw, y = g.y0 + p[1] * g.chh, a = 0.35 + 0.25 * Math.sin(t * 6); c.fillStyle = `rgba(233,200,119,${a})`; c.fillRect(x, y, g.cw - 1, g.chh - 1); });
    // l'idole, immobile : c'est une chose. La dernière colonne est à son pied.
    const idole = ch.api.idole();
    if (idole) { const w = g.wi, x = Math.round(g.xi - w / 2), y = Math.round(g.y0 + H / 2 - w / 2 + Math.sin(t * 1.6) * 2);
      c.globalAlpha = idole.broken ? 0.7 : 1; c.drawImage(idole.spr, x, y, w, w); c.globalAlpha = 1; lights.push({ x: g.xi, y: g.y0 + H / 2, r: w * 0.8, color: `hsl(${idole.def.hue},90%,55%)`, a: 0.8 }); }
    // le camp : les compagnons, à droite du champ
    C.all.filter(e => e.side === 'hero').forEach((e, i) => { if (!e.sheet) return; const x = Math.round(g.x1 + 4 + (i % 2) * 4), y = Math.round(g.y0 + 4 + i * Math.round(g.chh * 0.84)); c.globalAlpha = e.alive ? 1 : 0.5; c.drawImage(e.sheet, 0, 24, 16, 24, x, y, 16, 24); c.globalAlpha = 1; });
    // nuées et rangs, du fond vers l'avant
    const U = ch.nuees.map(n => ({ n, y: n.py })).concat(ch.rangs.filter(r => !r.repos).map(r => ({ r, y: r.py }))).sort((a, b) => a.y - b.y);
    for (const u of U) {
      if (u.n) { const n = u.n, w = Math.min(32, g.cw + 4), x = Math.round(n.px - w / 2), y = Math.round(n.py - w / 2 - 2 + Math.sin(t * 2 + n.ph) * 1.5);
        c.globalAlpha = n.corps > 1 ? 1 : 0.6; c.drawImage(n.spr, x, y, w, w); if (n.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, n.flash); c.drawImage(n.spr, x, y, w, w); c.globalCompositeOperation = 'source-over'; } c.globalAlpha = 1;
        if (n.decouverte) { c.fillStyle = '#ffe08a'; c.fillRect(Math.round(n.px - 4), Math.round(n.py + w / 2 - 2), 8, 1); }
        lights.push({ x: n.px, y: n.py, r: 18, color: `hsl(${n.def.hue},90%,55%)`, a: 0.5 });
      } else { const r = u.r, marche = Math.abs(r.px - g.cx(r.c)) > 0.6 || Math.abs(r.py - g.cy(r.l)) > 0.6;
        troupe(c, r, r.px, r.py, marche ? [1, 0, 2, 0][Math.floor(t * 6 + r.no) % 4] : 0);
        if (r.flash > 0) { c.fillStyle = `rgba(255,246,220,${Math.min(0.5, r.flash * 0.6)})`; c.fillRect(Math.round(r.px - g.cw / 2), Math.round(r.py - g.chh / 2), g.cw - 1, g.chh - 1); }
      }
    }
    // par-dessus : la tenue de chaque rang (trois points), son ordre, son numéro ; le cadre du rang choisi
    ch.rangs.forEach(r => { if (r.repos) return; const x = Math.round(r.px - g.cw / 2), y = Math.round(r.py - g.chh / 2);
      for (let i = 0; i < 3; i++) { c.fillStyle = i < r.tenue ? '#e9c877' : 'rgba(255,255,255,.2)'; c.fillRect(Math.round(r.px) - 7 + i * 5, y + g.chh - 5, 4, 2); }
      signe(c, r, g); chiffre(c, r.no, x + 1, y + 1); });
    if (ch.sel && !ch.sel.repos) { const x = Math.round(ch.sel.px - g.cw / 2), y = Math.round(ch.sel.py - g.chh / 2); c.strokeStyle = '#fff6dc'; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, g.cw - 2, g.chh - 2); }
    return { ambient: '#b4aeee', lights, bloom: 0.22, scan: true, grade: [`hsl(${hue},80%,50%)`, 0.1], vignette: 0.42, tilt: false };
  };
  // Pendant le duel, nos rangs se tiennent derrière le groupe : on voit qu'on ne combat pas seul. Leur place sur le champ,
  // elle, se lit sur la bande et sur le champ lui-même.
  R.masse = function (C, c, t) {
    const ch = C.champ; if (!ch) return; const hs = C.all.filter(e => e.side === 'hero'); if (!hs.length) return;
    const x0 = Math.round(hs.reduce((s, e) => s + e.x, 0) / hs.length), A = actifs(ch);
    c.globalAlpha = 0.62; A.forEach((r, i) => troupe(c, r, x0 - (A.length - 1) * 13 + i * 26, 105 + (i % 2) * 5, 0)); c.globalAlpha = 1;
  };
  // la bande du champ, visible pendant le duel : où sont nos rangs, où sont les nuées
  R.bande = function (C) {
    const ch = C.champ; if (!ch) return ''; let h = '';
    for (let l = 0; l < VOIES; l++) for (let k = COLS - 1; k >= 0; k--) { const r = rangEn(ch, k, l), n = nueeEn(ch, k, l);
      h += r ? `<i class="r${r.T.monte ? ' m' : ''}" title="${I.esc(r.name)}">▮</i>` : n ? `<i class="n" style="color:hsl(${n.def.hue},80%,66%)">●</i>` : `<i class="${ch.flancs[l] && k === COLS - 1 ? 'f' : ''}">·</i>`; }
    return h;
  };
})();
