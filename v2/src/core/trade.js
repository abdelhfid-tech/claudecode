/* ISNAD — routes : s'orienter aux étoiles, commercer par caravanes, rendre justice quand une route est pillée. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world, $ = I.$, T = 16;
  const Tr = I.trade = {};

  /* Égrégores des routes, communs à toutes les sagas (niveau calé sur celui du groupe). */
  I.common = { enemies: {
    razzia: { name: I.T('La Razzia'), art: 'blade', hue: 16, scale: 2, lvl: 0, tier: 'elite', weak: ['adl', 'sabr'], veils: 3,
      skills: [{ w: 3, name: I.T('Coup de main'), target: 'foe', el: 'fer', pow: 1.3, anim: 'slash' }, { w: 2, name: I.T('Prendre parce qu’on le peut'), target: 'foes', el: 'fer', pow: 0.75, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'dark' }],
      phases: [{ at: 0.5, say: I.T('La route est à qui la tient. Qui viendra me la reprendre ?'), fx: [{ st: 'atk', v: 1 }] }],
      desc: I.T('La vieille coutume du pillage, érigée en honneur : prendre parce qu’on le peut. Elle se nourrit des routes où nul ne vient. La justice et la patience la désarment.') },
    butin: { name: I.T('Le Butin'), art: 'tower', hue: 44, scale: 1, lvl: 0, tier: 'minion', weak: ['rahma', 'adl'], veils: 2,
      skills: [{ w: 2, name: I.T('Partage inégal'), target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.3 }], anim: 'dark' }],
      desc: I.T('Ce qui fut pris, et qui divise déjà ceux qui l’ont pris. Rendre le dissout.') },
    peur_route: { name: I.T('La Peur des routes'), art: 'wisp', hue: 262, scale: 1, lvl: 0, tier: 'minion', weak: ['shajaa', 'sidq'], veils: 1,
      skills: [{ w: 2, name: I.T('On ne passe plus'), target: 'foes', el: 'ilm', pow: 0.5, fx: [{ st: 'spd', v: -1, chance: 0.4 }], anim: 'wave' }],
      desc: I.T('Quand une route n’est plus sûre, on cesse de la prendre, et c’est la cité qui se referme. Elle craint ceux qui y retournent.') }
  } };
  I.langue.relever(I.common);   // ces égrégores-là sont écrits ici, pas dans un récit : leurs textes reçoivent la langue comme ceux des récits

  /* ================= étoiles ================= */
  Tr.bearing = function () {
    const tg = W.target && W.target(); if (!tg) return null;
    const a = Math.atan2(tg.y - W.player.y, tg.x - W.player.x) * 180 / Math.PI;
    return D.STARS[((Math.round(a / 45) % 8) + 8) % 8];
  };
  // le lever ou le coucher d'une étoile (D.STARS[i].way) : une tournure entière par cas
  Tr.starText = function (st) { return st ? (st.way === 'lever' ? I.t('lever d’{etoile}', { etoile: st.name }) : st.way === 'coucher' ? I.t('coucher d’{etoile}', { etoile: st.name }) : `${st.way ? st.way + ' d’' : ''}${st.name}`) : ''; };
  // les huit directions dites sous la boussole (D.STARS[i].dir) : marquées ici, dites à l'affichage
  const VENTS = { est: I.T('est'), 'sud-est': I.T('sud-est'), sud: I.T('sud'), 'sud-ouest': I.T('sud-ouest'), ouest: I.T('ouest'), 'nord-ouest': I.T('nord-ouest'), nord: I.T('nord'), 'nord-est': I.T('nord-est') };
  let cctx = null, lastKey = '';
  Tr.drawCompass = function (t) {
    const el = $('#compass'); if (!el) return;
    const show = I.scene === W && !S.busy && !$('#hud').hidden && W.map && !I.build.on; el.hidden = !show; if (!show) return;
    const cv = el.querySelector('canvas'); if (!cctx) { cv.width = cv.height = 128; cctx = cv.getContext('2d'); }
    const c = cctx, st = Tr.bearing(), night = W.map.env.time !== 'day', lit = night ? 1 : 0.55;
    c.clearRect(0, 0, 128, 128); c.save(); c.translate(64, 64);
    const g = c.createRadialGradient(0, 0, 6, 0, 0, 62); g.addColorStop(0, 'rgba(22,18,48,.92)'); g.addColorStop(1, 'rgba(6,5,16,.92)'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 60, 0, 6.3); c.fill();
    c.strokeStyle = 'rgba(233,200,119,.55)'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 59, 0, 6.3); c.stroke(); c.lineWidth = 0.6; c.beginPath(); c.arc(0, 0, 40, 0, 6.3); c.stroke();
    for (let k = 0; k < 2; k++) { c.save(); c.rotate(k * Math.PI / 4); c.strokeStyle = 'rgba(233,200,119,.16)'; c.strokeRect(-28, -28, 56, 56); c.restore(); }
    D.STARS.forEach((s, i) => {
      const a = i * Math.PI / 4, x = Math.cos(a) * 48, y = Math.sin(a) * 48, on = st === s && i === D.STARS.indexOf(st), tw = 0.75 + 0.25 * Math.sin(t * 3 + i * 1.7), r = (i === 6 ? 6 : 4) * (on ? 1.6 : 1);
      c.fillStyle = on ? '#ffe9a8' : `rgba(220,226,255,${lit * tw})`; if (on) { c.shadowColor = '#ffe08a'; c.shadowBlur = 14; }
      c.beginPath(); for (let q = 0; q < 8; q++) { const rr = q % 2 ? r * 0.32 : r, aa = q * Math.PI / 4; c.lineTo(x + Math.cos(aa) * rr, y + Math.sin(aa) * rr); } c.closePath(); c.fill(); c.shadowBlur = 0;
    });
    if (st) { const i = D.STARS.indexOf(st), a = i * Math.PI / 4; c.strokeStyle = 'rgba(255,233,168,.9)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 38, Math.sin(a) * 38); c.stroke(); }
    c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(0, 0, 3, 0, 6.3); c.fill(); c.restore();
    const key = (st ? D.STARS.indexOf(st) + st.name : '-') + I.langue.lang;   // l'étiquette se refait aussi quand la langue change
    if (key !== lastKey) { lastKey = key; el.querySelector('.lab').innerHTML = st ? `<span lang="ar" dir="rtl">${st.ar}</span><b>${Tr.starText(st)}</b><small>${VENTS[st.dir] ? I.t(VENTS[st.dir]) : st.dir}</small>` : '<small>' + I.t('al-Jady au nord, Suhayl au sud') + '</small>';
      if (st && !I.save.data._lore_etoiles && (!I.lecons || I.lecons.proposer('etoiles'))) { I.save.data._lore_etoiles = 1; Tr.lore('etoiles'); } } // 2.x : dans une partie neuve, pas au premier écran — un outil à la fois (lecons.js)
  };
  Tr.lore = function (id) { const cid = 'idris/' + id, sv = I.save.data; if (sv.codex.includes(cid) || !I.ui.codexEntry(cid)) return; sv.codex.push(cid); if (!I.lecons || I.lecons.annonce()) S.toast(I.t('Recueil : <b>{titre}</b>', { titre: I.esc(I.ui.codexEntry(cid).title) })); };

  /* ================= commerce ================= */
  Tr.dirhams = function (d) { const sv = I.save.data; if (sv.dirhams === undefined) sv.dirhams = 20; if (d) sv.dirhams = Math.max(0, sv.dirhams + d); return sv.dirhams; };
  const SELL = [['item', 'dattes', 3], ['item', 'lait', 4], ['item', 'pain', 3], ['item', 'miel', 6], ['mat', 'laine', 4], ['mat', 'grain', 2], ['mat', 'palme', 1], ['mat', 'pierre', 2], ['mat', 'pise', 1]];
  const BUY = [['mat', 'grain', 3], ['mat', 'laine', 6], ['mat', 'pierre', 4], ['mat', 'palme', 3], ['mat', 'pise', 2], ['item', 'dattes', 5], ['item', 'eau', 7], ['item', 'miel', 10], ['item', 'musc', 14], ['item', 'siwak', 8]];
  const nameOf = (k, id) => k === 'item' ? D.ITEMS[id].name : D.MATS[id].name;
  const stock = (k, id) => k === 'item' ? (I.save.data.items[id] || 0) : (I.build.mats()[id] || 0);
  const add = (k, id, n) => { if (k === 'item') I.save.data.items[id] = Math.max(0, (I.save.data.items[id] || 0) + n); else I.build.give(id, n, true); };
  Tr.routes = function () {
    return W.saga && W.saga.veillees ? [
      { id: 'puits', name: I.T('La piste des sept puits, vers le nord'), cost: 12, gain: 19, risk: 0.18 },
      { id: 'sel', name: I.T('La route du sel, vers le fleuve du sud'), cost: 20, gain: 35, risk: 0.3 },
      { id: 'cote', name: I.T('La grande traversée, jusqu’à la côte'), cost: 30, gain: 58, risk: 0.45 }] : [
      { id: 'yemen', name: I.T('Le Yémen, par la route d’hiver'), cost: 12, gain: 19, risk: 0.18 },
      { id: 'sham', name: I.T('Le Shâm, par la route d’été, jusqu’à Bosra'), cost: 20, gain: 35, risk: 0.3 },
      { id: 'bahrayn', name: I.T('Le Bahreïn et les confins de l’Irak'), cost: 30, gain: 58, risk: 0.45 }];
  };
  const sp = () => { const sv = I.save.data; return sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); };
  Tr.guard = function () { // ce qui garde une route : la justice rendue, les pactes noués, les méharistes
    const P = W.pillars(), b = I.save.data.built || {}; let camels = 0; Object.keys(b).forEach(k => { if (k.indexOf(W.saga.id + ':') === 0) camels += b[k].filter(e => e.t === 'chamelier').length; });
    return { camels, risk: (P.justice || 0) * 0.03 + (P.lien || 0) * 0.02 + camels * 0.06, renforts: ((P.lien || 0) >= 2 ? 1 : 0) + ((P.lien || 0) >= 4 ? 1 : 0) + (camels ? 1 : 0) };
  };
  Tr.near = function () { const m = W.map, s = m && m.spots.comptoir; return !!(s && W.saga && (!W.saga.frame || W.saga.veillees) && Math.hypot(s[0] * T + 8 - W.player.x, s[1] * T + 13 - W.player.y) < 30); };
  Tr.open = async function () {
    S.depth++;
    try {
      Tr.lore('caravanes'); I.audio.sfx('ok');
      const pick = (q, o) => I.debug.auto ? Promise.resolve(o._auto || 0) : S.menuPick(q, o);
      for (;;) {
        const car = sp().caravan, art = (D.GEAR_SHOPS[W.map.id] || []).length, top = [{ t: art ? I.t('Boutique d’équipement : armes, boucliers, coiffes, tenues') : I.t('Revendre une pièce d’équipement') }, { t: I.t('Vendre des vivres ou des matériaux') }, { t: I.t('Acheter des vivres ou des matériaux') }, { t: car ? I.t('Caravane en route : {route}', { route: I.t(car.name) }) : I.t('Confier une cargaison à une caravane') }, { t: I.t('Partir') }];
        // l'ordre affiché : boutique, vendre, acheter, caravane, partir ; la suite du code garde ses anciens numéros (0 vendre, 1 acheter, 2 caravane, 3 boutique, 4 partir)
        const i = I.debug.auto ? (Tr._autoStep = (Tr._autoStep || 0) + 1, [0, 1, 2, 3, 4][Math.min(4, Tr._autoStep - 1)]) : [3, 0, 1, 2, 4][await S.menuPick(I.t('Le comptoir : boutique et caravanes · {n} dirhams', { n: Tr.dirhams() }), top)];
        if (i === 4) break;
        if (i === 3) { await Tr.artisans(); continue; }
        if (i === 0) for (;;) {
          const L = SELL.filter(e => stock(e[0], e[1]) > 0), o = L.map(e => ({ t: I.t('{nom} · tu en as {n} · {prix} dirhams pièce', { nom: nameOf(e[0], e[1]), n: stock(e[0], e[1]), prix: e[2] }) })).concat([{ t: I.t('Retour') }]);
          const j = I.debug.auto ? (L.length && !Tr._sold ? (Tr._sold = 1, 0) : L.length) : await S.menuPick(I.t('Vendre · {n} dirhams', { n: Tr.dirhams() }), o);
          if (j >= L.length) break; add(L[j][0], L[j][1], -1); Tr.dirhams(L[j][2]); I.audio.sfx('blip');
        }
        if (i === 1) for (;;) {
          const o = BUY.map(e => ({ t: Tr.dirhams() < e[2] ? I.t('{nom} · {prix} dirhams (trop cher)', { nom: nameOf(e[0], e[1]), prix: e[2] }) : I.t('{nom} · {prix} dirhams', { nom: nameOf(e[0], e[1]), prix: e[2] }) })).concat([{ t: I.t('Retour') }]);
          const j = I.debug.auto ? (!Tr._bought && Tr.dirhams() >= 3 ? (Tr._bought = 1, 0) : BUY.length) : await S.menuPick(I.t('Acheter · {n} dirhams', { n: Tr.dirhams() }), o);
          if (j >= BUY.length) break; if (Tr.dirhams() < BUY[j][2]) { S.toast(I.t('Il te manque des dirhams.'), 1500); I.audio.sfx('dark'); continue; }
          Tr.dirhams(-BUY[j][2]); add(BUY[j][0], BUY[j][1], 1); I.audio.sfx('blip');
        }
        if (i === 2) {
          if (car) { S.toast(I.t('La caravane pour {route} reviendra au prochain chapitre.', { route: I.esc(I.t(car.name)) }), 3000); if (I.debug.auto) continue; else continue; }
          const R = Tr.routes(), gd = Tr.guard(), o = R.map(r => ({ t: Tr.dirhams() < r.cost ? I.t('{route} · mise {mise} dirhams, retour espéré {gain} · péril {peril} % (mise trop haute)', { route: I.t(r.name), mise: r.cost, gain: r.gain, peril: Math.round(Math.max(0.06, r.risk - gd.risk) * 100) }) : I.t('{route} · mise {mise} dirhams, retour espéré {gain} · péril {peril} %', { route: I.t(r.name), mise: r.cost, gain: r.gain, peril: Math.round(Math.max(0.06, r.risk - gd.risk) * 100) }) })).concat([{ t: I.t('Retour') }]);
          const j = I.debug.auto ? (Tr.dirhams() >= R[0].cost ? 0 : R.length) : await S.menuPick(I.t('Quelle route ? Une route gardée par la justice, les pactes et les méharistes est moins périlleuse.'), o);
          if (j >= R.length) continue; const r = R[j]; if (Tr.dirhams() < r.cost) { S.toast(I.t('Ta mise ne suffit pas.'), 1500); continue; }
          Tr.dirhams(-r.cost); sp().caravan = { id: r.id, name: r.name, cost: r.cost, gain: r.gain, risk: Math.max(0.06, r.risk - gd.risk) }; I.audio.sfx('roll');
          S.toast(I.t('La caravane part pour <b>{route}</b>. Elle reviendra au prochain chapitre, s’il plaît à Allah.', { route: I.esc(I.t(r.name)) }), 4200);
        }
      }
    } finally { S.depth--; S.hideDialog(); }
  };
  // les artisans du lieu : chaque comptoir vend ce que l'on fabrique ou ce qui passe par là (D.GEAR_SHOPS)
  Tr.artisans = async function () {
    const Gr = I.gear, shop = D.GEAR_SHOPS[W.map.id] || [], heroes = W.party.map(id => W.hero(id));
    const mieux = (h, id) => Gr.can(h.def, id) && Gr.score(h.def, id) > (Gr.of(h)[Gr.slotOf(id)] ? Gr.score(h.def, Gr.of(h)[Gr.slotOf(id)]) : 0) + 0.01;
    if (I.debug.auto) { // le joueur de test achète la pièce utile la moins chère, s'il lui reste de quoi faire l'aumône
      const pick = shop.filter(id => Tr.dirhams() >= Gr.prix(id) + 12 && !Gr.stock(id) && heroes.some(h => mieux(h, id))).sort((a, b) => Gr.prix(a) - Gr.prix(b))[0];
      if (pick && !Tr._forge) { Tr._forge = 1; Tr.dirhams(-Gr.prix(pick)); await Gr.receive(pick); } return; }
    const vendre = async () => { for (;;) { const L = Gr.reserve(), o = L.map(id => ({ html: `${Gr.img(id)} ${I.t('{nom} · {prix} dirhams¦{nom} ×{n} · {prix} dirhams', { nom: I.esc(D.GEAR[id].name), n: Gr.stock(id), prix: Gr.revente(id) })}` })).concat([{ t: I.t('Retour') }]);
      const j = await S.menuPick(L.length ? I.t('Revendre · {n} dirhams', { n: Tr.dirhams() }) : I.t('La réserve est vide.'), o); if (j >= L.length) return; Gr.add(L[j], -1); Tr.dirhams(Gr.revente(L[j])); I.audio.sfx('blip'); } };
    if (!shop.length) return vendre();
    for (;;) {
      const cats = Gr.SLOTS.filter(s => shop.some(id => Gr.slotOf(id) === s));
      const o = cats.map(s => ({ t: I.t('{emplacement} · {n} pièces', { emplacement: D.SLOTS[s], n: shop.filter(id => Gr.slotOf(id) === s).length }) })).concat([{ t: I.t('Revendre une pièce de la réserve') }, { t: I.t('Retour') }]);
      const i = await S.menuPick(I.t('Boutique d’équipement · {lieu} · {n} dirhams', { lieu: D.MAPS[W.map.id].label, n: Tr.dirhams() }), o);
      if (i > cats.length) return; if (i === cats.length) { await vendre(); continue; }
      for (;;) {
        const L = shop.filter(id => Gr.slotOf(id) === cats[i]), bo = L.map(id => { const g = D.GEAR[id], who = heroes.filter(h => Gr.can(h.def, id));
          return { html: `${Gr.img(id)} ${Tr.dirhams() < Gr.prix(id) ? I.t('<b>{nom}</b> · {prix} dirhams (trop cher)', { nom: I.esc(g.name), prix: Gr.prix(id) }) : I.t('<b>{nom}</b> · {prix} dirhams', { nom: I.esc(g.name), prix: Gr.prix(id) })}<br><small>${Gr.effets(g)}${who.length ? (who.some(h => mieux(h, id)) ? ' · ' + I.t('mieux pour {noms}', { noms: who.filter(h => mieux(h, id)).map(h => I.esc(h.def.name)).join(', ') }) : '') : ' · ' + I.t('personne ici ne peut la porter')}</small>` }; }).concat([{ t: I.t('Retour') }]);
        const j = await S.menuPick(I.t('{emplacement} · {n} dirhams', { emplacement: D.SLOTS[cats[i]], n: Tr.dirhams() }), bo); if (j >= L.length) break;
        if (Tr.dirhams() < Gr.prix(L[j])) { S.toast(I.t('Il te manque des dirhams.'), 1500); I.audio.sfx('dark'); continue; }
        Tr.dirhams(-Gr.prix(L[j])); await Gr.receive(L[j]);
      }
    }
  };
  // au début d'un chapitre : la caravane revient, ou des hommes rentrent à pied
  Tr.resolve = async function () {
    const s = sp(), car = s.caravan; if (!car) return; s.caravan = null;
    const raided = I.debug.auto ? !s._raided : Math.random() < car.risk;
    if (!raided) { Tr.dirhams(car.gain); I.audio.sfx('roll'); S.toast(I.t('La caravane est revenue de <b>{route}</b> : +{gain} dirhams.', { route: I.esc(I.t(car.name)), gain: car.gain }), 5200); if (!s._traded) { s._traded = 1; W.pillar('lien', 1); } return; }
    s._raided = 1; await Tr.raid({ loss: car.cost, name: car.name });
  };

  /* ================= une route pillée : lever des renforts, parler d'abord, rendre justice ================= */
  Tr.raid = async function (o) {
    o = o || {}; const v = W.saga.veillees, gd = Tr.guard(), R = gd.renforts, mine = o.loss > 0;
    S.flags._r1 = R >= 1; S.flags._r2 = R >= 2;
    const who1 = gd.camels ? I.t('Les méharistes de tes enclos') : I.t('Ceux que tes pactes ont liés'), who2 = I.t('Les hommes du voisinage, levés à ton appel');
    const ops = [
      ['mus', 'conseil'],
      ['nar', v ? I.t('Des chameliers rentrent à pied, sans leurs bêtes. La caravane a été prise à deux jours de marche, entre deux puits.') : I.t('Des hommes rentrent à pied, sans leurs bêtes. La caravane a été pillée sur la piste : en ces mois de trouble, des bandes tiennent les routes.')],
      ['say', I.t('Un caravanier'), I.t('Ils ne nous ont pas tués. Ils ont dit que la route était à eux désormais, et que nul ne viendrait la leur reprendre.')],
      ['nar', v ? I.t('Mon père disait : « Une cité se juge à ses routes. Là où le marchand voyage sans crainte, le prince peut dormir. »') : I.t('On rapporte cette promesse : un jour, le voyageur irait de San’â’ au Hadramawt sans craindre autre chose qu’Allah, et le loup pour ses brebis. Une route sûre est le visage de la justice.')],
      ['lore', 'routes_sures'],
      ['nar', R >= 2 ? I.t('Tu n’iras pas seul. {premiers} se mettent en selle ; {voisins_min} suivent. On lit le ciel : cap sur {etoile}.', { premiers: who1, voisins_min: who2.toLowerCase(), voisins: who2, etoile: Tr.starText(D.STARS[7]) }) : R === 1 ? I.t('Peu répondent, mais ils répondent : {premiers_min}. On lit le ciel : cap sur {etoile}.', { premiers_min: who1.toLowerCase(), premiers: who1, etoile: Tr.starText(D.STARS[7]) }) : I.t('Tu appelles des renforts. Nul ne vient : tu n’as noué ni pacte ni caravane de garde. Tu iras avec les tiens, sous al-Jady.')],
      ['parley', {
        with: I.t('Le chef des pillards'), title: I.t('Rendre ce qui fut pris'),
        intro: I.t('Il a faim, il a des hommes à nourrir, et la coutume de ses pères lui dit que prendre est un honneur. Il écoute d’autant mieux que tu n’es pas venu seul.'),
        goal: R >= 2 ? 4 : R === 1 ? 5 : 6,
        rounds: [
          { say: I.t('Tu viens me reprendre ce que j’ai pris ? Mes pères vivaient ainsi. La route nourrit qui la tient.'), opts: [
            { t: I.t('Tes pères avaient faim. Toi aussi. Mais ceux que tu as dépouillés avaient faim avant toi.'), el: 'rahma', v: 2, r: I.t('Tu parles de leur faim. Personne ne parle jamais de la mienne.') },
            { t: I.t('La route ne t’appartient pas plus que le vent. Elle est à qui la prend sans faire peur.'), el: 'adl', v: 2, r: I.t('Sans faire peur… On ne m’a jamais laissé d’autre métier.') },
            { t: I.t('Rends tout, ou tu ne verras pas le matin.'), el: 'shajaa', v: -1, r: I.t('Voilà enfin une langue que je connais. Je la parle mieux que toi.') }] },
          { say: I.t('Si je rends, mes hommes diront que j’ai eu peur. Un chef qui a eu peur n’est plus un chef.'), opts: [
            { t: I.t('Rendre devant tous n’est pas la peur. C’est la seule chose ici que personne n’a encore osée.'), el: 'shajaa', v: 2, r: I.t('Oser rendre… Tu retournes les mots comme on retourne un tapis.') },
            { t: I.t('Je dirai moi-même, devant tes hommes, que tu as rendu sans y être forcé.'), el: 'sidq', v: 2, r: I.t('Tu le dirais ? Devant eux ?') },
            { t: I.t('Tes hommes penseront ce qu’ils voudront.'), el: 'sabr', v: 0, r: I.t('Alors tu ne sais pas ce que c’est que de tenir des hommes.') }] },
          { say: I.t('Et après ? Rendre ne remplit aucun ventre. Demain il faudra bien manger.'), opts: [
            { t: I.t('Demain, garde cette route au lieu de la piller. Une caravane paie ceux qui la conduisent à bon port.'), el: 'adl', v: 3, r: I.t('Garder… Être payé pour que les autres passent. Mes pères en auraient ri. Mes fils, peut-être pas.') },
            { t: I.t('Ce n’est plus mon affaire.'), el: 'sabr', v: -1, r: I.t('Alors nous nous reverrons sur cette piste, toi et moi.') },
            { t: I.t('Il y a des puits à creuser et des champs à ouvrir. Je sais où.'), el: 'ilm', v: 2, r: I.t('De l’eau. Tu promets de l’eau à un homme du désert. C’est beaucoup promettre.') }] }
        ],
        win: [['nar', I.t('Il fait décharger les bêtes une à une, devant ses hommes, sans baisser la tête. Personne ne rit.')], ['flag', '_raid_paix'], ['pillar', 'lien', 1]],
        lose: [['nar', I.t('Il crache dans le sable. Derrière lui, dans l’envers de la piste, la vieille coutume se dresse : il ne commande plus, c’est elle.')],
          ['battle', { group: ['razzia', 'butin', 'peur_route'], bg: 'desert', boss: false, intro: I.t('La Razzia : prendre parce qu’on le peut. Elle ne négocie pas.'), allies: [{ flag: '_r1', name: who1 }, { flag: '_r2', name: who2 }] }],
          ['nar', I.t('L’idole tombée, il ne reste que des hommes fatigués, et des ballots qu’ils n’osent plus regarder. Ils posent les armes.')]]
      }],
      ['nar', I.t('Ce qui fut pris est rassemblé. Tout n’y est pas : une part a déjà été mangée, une autre perdue dans la fuite.')],
      ['ask', I.t('Ce qui reste ne couvre pas toutes les pertes. Qui est servi d’abord ?'), [
        { t: I.t('Les petits porteurs, qui n’avaient que cela.'), r: [['pillar', 'justice', 1], ['flag', '_raid_part', 'peu'], ['nar', I.t('Ils repartent avec leur charge entière. Tu reprends ce qui reste.')]] },
        { t: I.t('Chacun à proportion de ce qu’il a perdu.'), r: [['pillar', 'justice', 1], ['flag', '_raid_part', 'part'], ['nar', I.t('On pèse, on compte, on partage. Nul n’a tout, nul n’est oublié.')]] },
        { t: mine ? I.t('Ma propre mise d’abord : c’est moi qui ai mené la poursuite.') : I.t('Ceux qui ont mené la poursuite d’abord.'), r: [['pillar', 'justice', -1], ['flag', '_raid_part', 'tout'], ['nar', I.t('Tu es servi le premier. Les autres attendent, et se taisent. C’est un silence dont on se souvient.')]] }]],
      ['nar', I.t('Les pillards sont remis au juge : ce n’est pas à celui qui poursuit de dire la peine. La route, elle, est rouverte.')],
      ['lore', 'razzia']
    ];
    await S.run(ops);
    if (mine) { const part = S.flags._raid_part, back = Math.round(o.loss * (part === 'tout' ? 1 : part === 'part' ? 0.7 : 0.5)); Tr.dirhams(back); S.toast(I.t('Tu retrouves <b>{n} dirhams</b> de ta mise de {mise}.', { n: back, mise: o.loss }), 4200); }
    delete S.flags._r1; delete S.flags._r2; delete S.flags._raid_part;
    const env = W.map && W.map.env; if (env && I.scene === W) I.audio.scene(env.music || 'silence'); else I.audio.back();
  };
})();
