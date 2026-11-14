/* ISNAD — écrans (titre, Chaîne, menu, codex), boucle principale, mise en page, manette tactile. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world, $ = I.$;
  const U = I.ui = { menuOpen: false };
  I.setScene = s => { I.scene = s; };

  /* ---------- scènes de fond ---------- */
  let titleBg = null;
  function paintTitle() {
    const cv = G.mk(G.PW, G.PH), c = cv.getContext('2d'), H0 = 136, r = I.rng(77);
    const g = c.createLinearGradient(0, 0, 0, H0); g.addColorStop(0, '#04031a'); g.addColorStop(0.45, '#231252'); g.addColorStop(0.82, '#a8446a'); g.addColorStop(1, '#f2a25e'); c.fillStyle = g; c.fillRect(0, 0, G.PW, H0);
    for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(255,255,255,${0.15 + r() * 0.8})`; c.fillRect(Math.floor(r() * G.PW), Math.floor(r() * 90), 1, 1); }
    const sg = c.createRadialGradient(192, 126, 4, 192, 126, 92); sg.addColorStop(0, 'rgba(255,244,210,1)'); sg.addColorStop(0.22, 'rgba(255,200,120,.75)'); sg.addColorStop(1, 'rgba(255,120,80,0)'); c.fillStyle = sg; c.fillRect(90, 30, 204, 110);
    // la chaîne : cinq maillons d'or au-dessus de l'horizon
    c.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) { const x = 120 + i * 36, y = 62 - Math.sin(i / 4 * Math.PI) * 14; c.strokeStyle = `rgba(255,224,150,${0.55 + (i === 2 ? 0.3 : 0)})`; c.beginPath(); c.ellipse(x, y, 22, 9, i % 2 ? 0.35 : -0.35, 0, 6.3); c.stroke(); }
    const sil = '#0a0716';
    c.fillStyle = sil;
    // rome (gauche)
    c.fillRect(8, H0 - 44, 96, 4); c.beginPath(); c.moveTo(4, H0 - 44); c.lineTo(56, H0 - 60); c.lineTo(108, H0 - 44); c.fill(); for (let x = 12; x < 104; x += 13) c.fillRect(x, H0 - 40, 5, 40);
    // médine (centre) : toits plats, palmiers
    for (let x = 118; x < 262;) { const w = 14 + r() * 20, h = 8 + r() * 12; c.fillRect(x, H0 - h, w, h); if (r() < 0.5) { c.fillStyle = '#ffc878'; c.fillRect(x + 3, H0 - h + 3, 2, 3); c.fillStyle = sil; } x += w + 3; }
    [128, 168, 214, 250].forEach(x => { c.fillRect(x, H0 - 40, 2, 40); for (let k = 0; k < 7; k++) { c.fillRect(x - 9 + k * 3, H0 - 43 + Math.abs(k - 3) * 2.2, 4, 2); } });
    // cité-miroir (droite)
    for (let x = 270; x < G.PW;) { const w = 10 + r() * 16, h = 30 + r() * 78; c.fillStyle = sil; c.fillRect(x, H0 - h, w, h); for (let k = 0; k < h / 5; k++) if (r() < 0.55) { c.fillStyle = ['#39e6ff', '#ff4fd8', '#ffe08a'][Math.floor(r() * 3)]; c.fillRect(x + 2 + Math.floor(r() * Math.max(1, w - 4)), H0 - h + 3 + k * 5, 2, 1); } x += w + 2; }
    const gg = c.createLinearGradient(0, H0, 0, G.PH); gg.addColorStop(0, '#120a22'); gg.addColorStop(1, '#05040f'); c.fillStyle = gg; c.fillRect(0, H0, G.PW, G.PH - H0);
    c.fillStyle = '#1c1030'; c.beginPath(); c.moveTo(0, G.PH); for (let x = 0; x <= G.PW; x += 4) c.lineTo(x, H0 + 16 + Math.sin(x / 40) * 7 + Math.sin(x / 13) * 2); c.lineTo(G.PW, G.PH); c.fill();
    return cv;
  }
  let tt = 0;
  U.titleScene = {
    update(dt) { tt += dt; },
    render() {
      const c = G.px; if (!titleBg) titleBg = paintTitle(); c.drawImage(titleBg, 0, 0);
      const H0 = 152, H = G.PH - H0; c.fillStyle = 'rgba(255,79,216,.28)';
      for (let i = 0; i < 8; i++) { const f = ((i + (tt * 0.3) % 1) / 8); c.fillRect(0, Math.round(H0 + H * f * f), G.PW, 1); }
      c.strokeStyle = 'rgba(57,230,255,.18)'; c.lineWidth = 1; c.beginPath(); for (let i = -8; i <= 8; i++) { c.moveTo(192 + i * 12, H0); c.lineTo(192 + i * 80, G.PH); } c.stroke();
      return { lights: [{ x: 192, y: 122, r: 150, color: '#ffb060', a: 0.9 }, { x: 330, y: 100, r: 90, color: '#7a5cff', a: 0.6 }], bloom: 0.55, grade: ['#ff5ea8', 0.1], vignette: 0.7, tilt: false };
    }
  };
  U.blank = {
    update(dt) { tt += dt; },
    render() {
      const c = G.px, g = c.createLinearGradient(0, 0, 0, G.PH); g.addColorStop(0, '#05041a'); g.addColorStop(1, '#120a26'); c.fillStyle = g; c.fillRect(0, 0, G.PW, G.PH);
      c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.strokeStyle = `rgba(233,200,119,${0.12 + 0.06 * Math.sin(tt + i)})`; c.beginPath(); c.ellipse(192 + (i - 2) * 52, 108 + Math.sin(tt * 0.4 + i) * 4, 34, 15, i % 2 ? 0.35 : -0.35, 0, 6.3); c.stroke(); }
      return { lights: [{ x: 192, y: 108, r: 170, color: '#3a2a7a', a: 0.8 }], bloom: 0.5, vignette: 0.75, tilt: false };
    }
  };

  /* ---------- liste focalisable ---------- */
  function focusList(btns, o) {
    o = o || {}; let idx = Math.max(0, o.start || 0);
    const live = () => btns.filter(b => !b.disabled && b.isConnected);
    const sel = i => { const L = live(); if (!L.length) return; idx = (i + L.length) % L.length; btns.forEach(b => b.classList.remove('sel')); L[idx].classList.add('sel'); L[idx].scrollIntoView && L[idx].scrollIntoView({ block: 'nearest' }); if (o.onSel) o.onSel(L[idx], idx); };
    btns.forEach(b => { b.addEventListener('mouseenter', () => { const i = live().indexOf(b); if (i >= 0) sel(i); }); });
    const h = I.input.push(a => {
      if (a === 'up' || a === 'left') { sel(idx - 1); I.audio.sfx('move'); }
      else if (a === 'down' || a === 'right') { sel(idx + 1); I.audio.sfx('move'); }
      else if (a === 'ok') { const L = live(); if (L[idx]) { I.audio.sfx('ok'); L[idx].click(); } }
      else if ((a === 'cancel' || a === 'menu') && o.onCancel) o.onCancel();
      return true;
    });
    sel(idx);
    return { destroy() { I.input.pop(h); }, sel };
  }
  function screen(id, on) { $(id).hidden = !on; document.body.classList.toggle('in-screen', !!document.querySelector('.screen:not([hidden])')); }

  /* ---------- titre ---------- */
  U.showTitle = function () {
    I.setScene(U.titleScene); G.clearParts(); G.amb = { kind: 'dust', rate: 5, n: 0 }; I.audio.amb('vent'); I.audio.music('titre'); I.audio.beat('veille');
    $('#hud').hidden = true; document.body.dataset.theme = 'orient';
    const box = $('#title .vmenu'); box.innerHTML = ''; const sv = I.save.data, has = I.save.slots().some(Boolean); let fl;
    const mk = (label, fn, dis) => { const b = I.el('button', '', label); b.type = 'button'; b.disabled = !!dis; b.onclick = ev => { ev.stopPropagation(); I.audio.unlock(); fn(b); }; box.appendChild(b); return b; };
    const close = () => { fl.destroy(); screen('#title', false); I.audio.stopBeat(); };
    const btns = [];
    if (has) btns.push(mk('Continuer', async () => { close(); const ok = await U.loadMenu(); if (ok) U.resume(); else U.showTitle(); }));
    btns.push(mk('Nouvelle partie', b => {
      close(); I.save.reset(); I.save.data.started = true; W.roster = {}; W.saga = null; W.startChapter('idris', 0);
    }));
    btns.push(mk('Son : ' + (I.audio.on ? 'activé' : 'coupé'), b => { I.audio.setOn(!I.audio.on); sv.opts.sound = I.audio.on; I.save.store(); b.textContent = 'Son : ' + (I.audio.on ? 'activé' : 'coupé'); }));
    btns.push(mk('Musique : ' + (I.audio.musicOn ? 'activée' : 'coupée'), b => { I.audio.setMusic(!I.audio.musicOn); sv.opts.music = I.audio.musicOn; I.save.store(); b.textContent = 'Musique : ' + (I.audio.musicOn ? 'activée' : 'coupée'); }));
    btns.push(mk('Rendu : ' + (G.low ? '2D simple' : 'rétro-HD'), b => { G.low = !G.low; G._slow = 0; sv.opts.low = G.low; I.save.store(); G.resize(); b.textContent = 'Rendu : ' + (G.low ? '2D simple' : 'rétro-HD'); }));
    btns.push(mk('Plein écran', () => { const e = document.documentElement; try { (document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen()).catch(() => {}); } catch (e2) { /* indisponible */ } }));
    screen('#title', true); fl = focusList(btns);
  };
  const slotLabel = (d, n) => d ? `Emplacement ${n} · ${I.esc((d.meta && d.meta.label) || 'Partie')} · ${new Date((d.meta && d.meta.when) || 0).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} ${new Date((d.meta && d.meta.when) || 0).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : `Emplacement ${n} · vide`;
  U.saveMenu = async function () {
    const slots = I.save.slots(), opts = slots.map((d, i) => ({ t: slotLabel(d, i + 1) })).concat([{ t: 'Annuler' }]);
    S.depth++;
    try {
      const i = I.debug.auto ? 2 : await S.menuPick('Sauvegarder sur quel emplacement ?', opts);
      if (i > 2) return false;
      const inWorld = I.scene === W && W.map; if (inWorld) W.checkpoint();
      const lead = W.saga && W.party.length ? W.hero(W.party[0]) : null;
      const label = inWorld && W.saga ? `${W.saga.name} · ${W.ch.title}${lead ? ' · niv. ' + lead.lvl : ''}` : `La Chaîne · ${I.save.data.lights.filter(l => l !== 'sabr').length} Lumière(s)`;
      const ok = I.save.write(i + 1, { label }); if (ok) { W.unsaved = 0; W._warned = false; }
      I.audio.sfx(ok ? 'roll' : 'dark'); G.flash('#fff3c8');
      if (inWorld) for (let k = 0; k < 40; k++) G.spawn({ x: W.player.x - W.cam.x, y: W.player.y - W.cam.y - 6, vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.8) * 120, life: 1.2, size: 0.9, color: '#ffe9a8', type: 'spark' });
      S.toast(ok ? `<b>Partie sauvegardée</b> · emplacement ${i + 1}` : 'La sauvegarde a échoué : le stockage du navigateur est indisponible.', 3600);
      return ok;
    } finally { S.depth--; S.hideDialog(); }
  };
  U.loadMenu = async function () {
    const slots = I.save.slots(), idx = slots.map((d, i) => d ? i : -1).filter(i => i >= 0);
    if (!idx.length) return false;
    I.setScene(U.blank);
    S.depth++;
    try { const k = await S.menuPick('Reprendre quelle partie ?', idx.map(i => ({ t: slotLabel(slots[i], i + 1) })).concat([{ t: 'Retour' }])); if (k >= idx.length) return false; return I.save.read(idx[k] + 1); }
    finally { S.depth--; S.hideDialog(); }
  };
  U.resume = function () {
    const sv = I.save.data;
    if (sv.cp && I.sagas[sv.cp.saga]) { W.roster = {}; W.saga = null; return W.startChapter(sv.cp.saga, sv.cp.ci, sv.cp); }
    if (!sv.prologue) { W.roster = {}; W.saga = null; return W.startChapter('idris', 0); }
    return U.showChain();
  };

  /* ---------- la Chaîne (choix de saga) ---------- */
  U.showChain = async function (msg) {
    I.setScene(U.blank); G.clearParts(); G.amb = { kind: 'noos', rate: 5, hue: 40, n: 0 }; I.audio.amb('noos'); I.audio.stopBeat(); I.audio.music('chaine');
    $('#hud').hidden = true; document.body.dataset.theme = 'orient'; S.hideDialog(); $('#toasts').innerHTML = '';
    const sv = I.save.data, list = I.sagaList.filter(s => !s.frame), box = $('#chain .links'); box.innerHTML = '';
    const allDone = list.every(s => sv.sagas[s.id] && sv.sagas[s.id].done);
    $('#chain header p').innerHTML = msg || (allDone ? 'Les cinq Lumières sont réunies. Le dernier maillon t’attend : le tien.' : 'Chaque maillon est un témoin. Choisis celui dont tu veux suivre la trace ; l’ordre est libre, mais la Chaîne se lit du premier au dernier.');
    const btns = []; let fl;
    const close = () => { fl.destroy(); screen('#chain', false); };
    list.forEach((s, i) => {
      const sp = sv.sagas[s.id] || { ch: 0, done: false }, e = D.ELEMENTS[s.light];
      const vl = sv.veillees && sv.veillees[s.id] ? ' · veillée du Caïd ✓' : '';
      const st = sp.done ? `<span class="stt done">${e.glyph} ${s.lightName} retrouvée${vl}</span>` : sp.ch > 0 ? `<span class="stt">Chapitre ${sp.ch + 1} / ${s.chapters.length}</span>` : '<span class="stt">Maillon à ouvrir</span>';
      const b = I.el('button', 'link', `<span class="seal" style="background-image:url(${G.sealURL(s.arabic, e.color)})"></span><span class="lt"><span class="ord">MAILLON ${['I', 'II', 'III', 'IV', 'V'][i] || i + 1} · ${I.esc(s.years)}</span><h3>${I.esc(s.name)}</h3><span class="ep">${I.esc(s.epithet)} <small>· ${I.esc(s.ambiance || '')}</small></span><span class="tl">${I.esc(s.tagline)}</span>${st}</span>`);
      b.type = 'button'; b.style.setProperty('--c', e.color);
      b.onclick = ev => { ev.stopPropagation(); close(); U.startSaga(s); };
      box.appendChild(b); btns.push(b);
    });
    const fr = I.sagas.idris;
    if (fr) {
      const b = I.el('button', 'link' + (allDone ? '' : ' locked'), `<span class="seal" style="background-image:url(${G.sealURL('إسناد', '#39e6ff')})"></span><span class="lt"><span class="ord">DERNIER MAILLON · 1508 H · 2084</span><h3>Idris</h3><span class="ep">Le Cœur de l’Agrégor <small>· cyberpunk</small></span><span class="tl">${allDone ? 'Rapporter les cinq Lumières à la Cité-Miroir.' : 'Scellé tant que les cinq Lumières ne sont pas réunies.'}</span><span class="stt${sv.epilogue ? ' done' : ''}">${sv.epilogue ? 'Chaîne transmise' : allDone ? 'Ouvert' : sv.lights.filter(l => l !== 'sabr').length + ' / 5 Lumières'}</span></span>`);
      b.type = 'button'; b.style.setProperty('--c', '#39e6ff'); b.disabled = !allDone && !I.debug.all;
      b.onclick = ev => { ev.stopPropagation(); close(); W.roster = {}; W.saga = null; W.startChapter('idris', 1); };
      box.appendChild(b); btns.push(b);
    }
    const foot = $('#chain .chainfoot'); foot.innerHTML = '';
    foot.appendChild(I.el('span', 'lights', 'Lumières ' + Object.keys(D.ELEMENTS).filter(k => k !== 'fer').map(k => `<i class="${sv.lights.includes(k) || (k === 'sabr' && sv.epilogue) ? 'on' : ''}" style="color:${D.ELEMENTS[k].color}" title="${D.ELEMENTS[k].name}">${D.ELEMENTS[k].glyph}</i>`).join('')));
    foot.appendChild(I.el('span', 'pill', `Fidélité à la Chaîne : <b>${sv.isnad.ok}</b> / ${sv.isnad.total}`));
    if (sv.parley && sv.parley.total) foot.appendChild(I.el('span', 'pill', `Pourparlers réussis : <b>${sv.parley.won}</b> / ${sv.parley.total}`));
    if (I.sagas.caid && Object.keys(sv.veillees || {}).length) foot.appendChild(I.el('span', 'pill', 'Citadelle du Caïd : ' + Object.keys(D.PILLARS).map(k => `${D.PILLARS[k].glyph} <b>${sv.citadel[k]}</b>`).join(' · ')));
    const sb = I.el('button', '', 'Sauvegarder (natte des Archives)'); sb.type = 'button'; sb.onclick = async ev => { ev.stopPropagation(); close(); await U.saveMenu(); U.showChain(); }; foot.appendChild(sb); btns.push(sb);
    const cb = I.el('button', '', 'Recueil'); cb.type = 'button'; cb.onclick = ev => { ev.stopPropagation(); close(); U.pause('codex', () => U.showChain()); }; foot.appendChild(cb); btns.push(cb);
    const tb = I.el('button', '', 'Écran-titre'); tb.type = 'button'; tb.onclick = ev => { ev.stopPropagation(); close(); U.showTitle(); }; foot.appendChild(tb); btns.push(tb);
    screen('#chain', true);
    const next = list.findIndex(s => !(sv.sagas[s.id] && sv.sagas[s.id].done));
    fl = focusList(btns, { start: next < 0 ? list.length : next });
  };
  U.startSaga = async function (s) {
    const sv = I.save.data, sp = sv.sagas[s.id] || (sv.sagas[s.id] = { ch: 0, done: false, flags: {} });
    W.roster = {}; W.saga = s; S.flags = {};
    let ci = sp.done ? 0 : sp.ch;
    if (sp.done) { sp.ch = 0; sp.flags = {}; }
    if (ci === 0 && !(sv.cp && sv.cp.saga === s.id && sv.cp.obj > 0)) { sp.cOk = 0; sp.cTot = 0; }
    const resume0 = sv.cp && sv.cp.saga === s.id && sv.cp.ci === 0 && sv.cp.obj > 0 && !sp.done;
    if (ci === 0 && !resume0) {
      I.setScene(U.blank); document.body.dataset.theme = 'orient';
      S.depth++; try { await S.run([['title', s.name, s.epithet + ' · ' + s.years]].concat(s.intro || [])); } finally { S.depth--; S.hideDialog(); }
    }
    const cp = sv.cp && sv.cp.saga === s.id && sv.cp.ci === ci && ci > 0 ? sv.cp : (sv.cp && sv.cp.saga === s.id && sv.cp.ci === 0 && ci === 0 && sv.cp.obj > 0 ? sv.cp : null);
    await W.startChapter(s.id, ci, cp || undefined);
  };
  U.afterSaga = async function (saga, ch) {
    const sv = I.save.data;
    if (saga.veillees) {
      sv.veillees[ch.after] = true; I.save.store(); const c = sv.citadel;
      const tot = c.priere + c.savoir + c.justice + c.lien;
      return U.showChain(`La veillée s’achève. La Citadelle du Caïd tient par ${Object.keys(D.PILLARS).map(k => `${D.PILLARS[k].name.toLowerCase()} ${c[k]}`).join(', ')}. ${tot >= 12 ? 'Elle est debout dans les cœurs.' : tot >= 7 ? 'Elle tient, et demande qu’on la veille.' : 'Elle se lézarde : ce qui n’est plus bâti s’effrite.'}`);
    }
    if (!saga.frame && I.sagas.caid) {
      const vi = I.sagas.caid.chapters.findIndex(c => c.after === saga.id);
      if (vi >= 0 && !(sv.veillees && sv.veillees[saga.id])) {
        if (!Object.keys(sv.veillees || {}).length && !sv.caidIntro) { sv.caidIntro = true; I.audio.music('citadelle'); await S.run([['title', 'Les Veillées de la Citadelle', 'un autre maillon de la Chaîne'], ['nar', 'Des siècles après les Compagnons, au bord du désert, un seigneur berbère lisait leurs vies à la lueur d’une lampe. Il n’y cherchait pas des récits. Il y cherchait comment tenir.'], ['nar', 'On l’appelait le Caïd. Chaque Lumière que tu retrouves, il l’a reçue avant toi, et il lui a fallu en faire quelque chose.']]); }
        W.roster = {}; W.saga = null; return W.startChapter('caid', vi);
      }
    }
    if (saga.frame) {
      if (W.ci === 0) { sv.prologue = true; I.save.store(); return U.showChain('La Chaîne s’ouvre. Cinq maillons, cinq témoins. Commence par le premier : Abû Bakr, le jour où tout aurait pu se défaire.'); }
      sv.epilogue = true; I.save.store(); await U.credits(); return U.showTitle();
    }
    const e = D.ELEMENTS[saga.light]; const left = I.sagaList.filter(s => !s.frame && !(sv.sagas[s.id] && sv.sagas[s.id].done)).length;
    return U.showChain(`<b style="color:${e.color}">${e.glyph} ${saga.lightName}</b> — la Lumière de ${I.esc(saga.name)} rejoint Idris. ${left ? `Encore ${left} maillon${left > 1 ? 's' : ''}.` : 'Les cinq Lumières sont réunies.'}`);
  };
  U.credits = async function () {
    await S.card('credits', `<h1>ISNAD</h1><p class="small">Chroniques des Compagnons</p>
      <p>Cette œuvre est une fiction interactive inspirée de sources historiques. Les dialogues sont une dramatisation ; seules les paroles présentées en carton, avec leur source, sont des citations rapportées. Le Prophète ﷺ n’est jamais représenté, et aucun personnage n’a de visage.</p>
      <p><b>Sources principales.</b> Ibn Hishâm, <em>as-Sîra an-Nabawiyya</em> · at-Tabarî, <em>Târîkh ar-Rusul wa-l-Mulûk</em> · Ibn Sa'd, <em>at-Tabaqât al-Kubrâ</em> · Ibn Kathîr, <em>al-Bidâya wa-n-Nihâya</em> · al-Bukhârî et Muslim, <em>as-Sahîh</em> · Ibn 'Asâkir, <em>Târîkh Dimashq</em>.</p>
      <p><b>Noosphère et égrégore.</b> « Noosphère » vient de Vernadsky et Teilhard de Chardin ; « égrégore » désigne une forme-pensée collective. Le jeu s’en sert comme d’une image pour parler des valeurs partagées et des idoles que les hommes se fabriquent.</p>
      <p><b>Les veillées de la Citadelle</b> sont une fiction, hommage à <em>Citadelle</em> d’Antoine de Saint-Exupéry (1948), dont elles n’empruntent ni le texte ni les épisodes. La musique est originale.</p>\n      <p>Qu’Allah agrée les Compagnons. Toute erreur est celle des auteurs ; vérifiez auprès des savants et des sources.</p>
      <p class="small">Fidélité à la Chaîne : ${I.save.data.isnad.ok} / ${I.save.data.isnad.total}</p><div class="hint">▼</div>`);
  };

  /* ---------- codex ---------- */
  U.codexEntry = function (cid) {
    if (cid.startsWith('foe:_:')) { const e = I.common.enemies[cid.split(':')[2]]; return e ? { id: cid, cat: 'Noosphère', title: e.name, text: e.desc + ` — Failles : ${e.weak.map(w => D.ELEMENTS[w].name).join(', ')}.`, saga: { name: 'Les routes' } } : null; }
    if (cid.startsWith('foe:')) { const [, sid, eid] = cid.split(':'), s = I.sagas[sid], e = s && s.enemies[eid]; return e ? { id: cid, cat: 'Noosphère', title: e.name, text: e.desc + ` — Failles : ${e.weak.map(w => D.ELEMENTS[w].name).join(', ')}.`, saga: s } : null; }
    const [sid, eid] = cid.split('/'), s = I.sagas[sid], e = s && s.codex.find(c => c.id === eid); return e ? Object.assign({ saga: s }, e, { id: cid }) : null;
  };
  U.unlockCodex = function (id) {
    const cid = W.saga.id + '/' + id, sv = I.save.data; if (sv.codex.includes(cid)) return; const e = U.codexEntry(cid); if (!e) return;
    sv.codex.push(cid); S.toast(`Recueil : <b>${I.esc(e.title)}</b>`);
    const sp = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); sp.kn = (sp.kn || 0) + 1; if (sp.kn % 6 === 0) W.pillar('savoir', 1);
  };

  /* ---------- menu de pause ---------- */
  U.pause = function (mode, onClose) {
    if (U.menuOpen) return; U.menuOpen = true; I.input.clearHeld(); I.audio.sfx('ok');
    const sv = I.save.data, side = $('#menu .side'), pane = $('#menu .pane'); let fl = null;
    const close = () => { if (fl) fl.destroy(); screen('#menu', false); U.menuOpen = false; if (onClose) onClose(); };
    const mkb = (label, fn, cls) => { const b = I.el('button', cls || '', label); b.type = 'button'; b.onclick = ev => { ev.stopPropagation(); fn(b); }; return b; };
    const build = (items, o) => { if (fl) fl.destroy(); side.innerHTML = ''; const btns = []; items.forEach(it => { if (it.cat) { side.appendChild(I.el('div', 'cat', it.cat)); return; } const b = mkb(it.label, it.fn); b._show = it.show; side.appendChild(b); btns.push(b); }); fl = focusList(btns, Object.assign({ onSel: b => { if (b._show) pane.innerHTML = b._show(); } }, o)); };
    const party = () => (W.saga && W.party.length) ? W.party.map(id => { const h = W.hero(id), st = I.calc.hero(h.def, h.lvl), e = D.ELEMENTS[h.def.el]; return `<div class="stat"><span class="seal" style="background-image:url(${G.sealURL(h.def.arabic, e.color)})"></span><img class="fig" alt="" src="${G.charURL(Object.assign({ kind: 'compagnon' }, h.def.look))}"><div><b style="color:${e.color}">${I.esc(h.def.name)}</b> ${h.def.title ? '<em>' + I.esc(h.def.title) + '</em>' : ''} <small>· niveau ${h.lvl} · ${e.name}</small><br><small>Constance ${Math.ceil(h.hp)}/${st.hp} · Souffle ${h.sp}/${st.sp} · Force ${Math.round(st.atk)} · Esprit ${Math.round(st.mag)} · Garde ${Math.round(st.def)} · Élan ${Math.round(st.spd)}</small><div class="sk">${h.def.skills.filter(k => k.lvl <= h.lvl).map(k => I.esc(k.name)).join(' · ')}</div></div></div>`; }).join('') : '<p>Aucun groupe pour l’instant.</p>';
    const bag = () => '<h3>Besace</h3>' + (Object.keys(D.ITEMS).filter(k => (sv.items[k] || 0) > 0).map(k => `<p><b>${D.ITEMS[k].name}</b> ×${sv.items[k]}<br><small>${D.ITEMS[k].desc}</small></p>`).join('') || '<p>La besace est vide.</p>') + '<p class="src">Les objets s’utilisent en combat. Le groupe reprend des forces après chaque victoire.</p>';
    const help = () => `<h3>Commandes</h3><p><kbd>Flèches</kbd> ou <kbd>ZQSD</kbd>/<kbd>WASD</kbd> : se déplacer, naviguer · <kbd>Entrée</kbd>/<kbd>Espace</kbd> : parler, valider · <kbd>Échap</kbd>/<kbd>X</kbd> : menu, retour. Sur écran tactile : croix et boutons à l’écran, et tout est cliquable.</p>
      <h3>Combat</h3><p>On n’affronte jamais des personnes, seulement des <em>égrégores</em> : les idoles que les cœurs fabriquent ensemble. Chaque égrégore est protégé par des <b>voiles</b> (⛊). Frappe-le avec la <b>vertu</b> qui est sa faille pour retirer un voile ; à zéro, il est <b>dévoilé</b> : il perd son tour et subit bien plus.</p>
      <p><b>Niyya</b> (l’intention) : un point par tour ; dépense-en jusqu’à trois (◂ ▸) pour multiplier les coups ou renforcer une vertu. <b>Sakîna</b> : la jauge dorée ; pleine, elle ouvre l’acte ultime du Compagnon.</p>
      <h3>La parole avant le sabre</h3><p>Un <b>pourparler</b> se gagne manche après manche : chaque argument fait monter ou baisser la confiance. Les meilleurs demandent un <b>savoir</b> (✧) appris d’un savant, d’un feuillet, d’un témoin. Avoir <b>prié</b> dans le chapitre donne la sérénité : +1 de confiance. Si la parole échoue, le récit continue, mais il en coûte.</p>\n      <h3>Les étoiles</h3><p>On s’oriente au ciel. Le cadran montre huit caps, nommés par l’étoile qui s’y lève ou s’y couche : <b>al-Jady</b> (la Polaire) au nord, <b>Suhayl</b> au sud, <b>an-Nasr at-Tâ’ir</b> à l’est et à l’ouest, <b>al-’Ayyûq</b> et <b>al-’Aqrab</b> entre eux. L’étoile qui brille est celle de ton objectif ; au bord de l’écran, elle te précède.</p>\n      <h3>Caravanes</h3><p>Aux ballots du souk ou du camp, on vend, on achète, et l’on confie une cargaison à une caravane : elle revient au chapitre suivant avec son gain, ou bien des hommes rentrent à pied. Une route est plus sûre quand la justice est rendue, que des pactes sont noués et que des méharistes la gardent. Si elle est pillée, on lève des renforts, on parle d’abord, et l’on rend à chacun ce qui lui revient.</p>\n      <h3>Bâtir</h3><p>Touche <kbd>B</kbd> ou bouton ▦, à ciel ouvert. On récolte en s’adressant aux choses : un palmier donne de la <b>palme</b>, un rocher de la <b>pierre</b>, un puits ou une rive de l’<b>eau</b>, et l’eau pétrie donne du <b>pisé</b>. Puis on pose devant soi, case par case : tranchée qui arrête les égrégores, puits, palmiers (un puits et trois palmiers font une oasis), champs, enclos de chèvres, de moutons, de chameaux, et les pièces d’une mosquée. Ce qui est bâti reste et rapporte à chaque chapitre. Sur une terre gagnée, un chantier s’ouvre : la mosquée achevée devient un lieu de prière et de sauvegarde.</p>\n      <h3>Sauvegarder</h3><p>On ne sauvegarde que <b>dans les mosquées</b>, sur la natte au cœur de l’étoile, et à la natte des Archives depuis l’écran de la Chaîne. Trois emplacements. Fermer la page sans sauvegarder fait perdre ce qui a été joué depuis.</p>\n      <h3>La Chaîne</h3><p>Aux moments décisifs, plusieurs actes te sont proposés. Un seul est celui que les transmetteurs ont rapporté. Te tromper ne change pas l’Histoire : la chaîne vacille, puis te ramène à ce qui fut.</p>`;
    const journal = () => { const o = W.cur && W.cur(); return `<h3>${W.ch ? I.esc(W.ch.title) : 'Journal'}</h3><p class="src">${W.ch ? I.esc(W.ch.sub) : ''}</p><p>${o && o.text ? '◆ ' + I.esc(o.text) : 'Aucun objectif en cours.'}</p><p class="src">Fidélité à la Chaîne : ${sv.isnad.ok} / ${sv.isnad.total} · Lumières : ${sv.lights.map(l => D.ELEMENTS[l].name).join(', ') || 'aucune'}</p>`; };
    const root = () => {
      const inWorld = I.scene === W;
      const items = [{ label: 'Reprendre', fn: close, show: journal }, { label: 'Groupe', fn() {}, show: () => '<h3>Groupe</h3>' + party() }, { label: 'Besace', fn() {}, show: bag }, { label: 'Recueil', fn: codex, show: () => `<h3>Le Recueil</h3><p>Tout ce que tu as appris en chemin : biographies, événements, paroles avec leur source, et les idoles de la noosphère. ${sv.codex.length} entrée${sv.codex.length > 1 ? 's' : ''} pour l’instant. Chaque savoir peut ouvrir un argument dans un pourparler.</p>` }, { label: 'Citadelle', fn() {}, show: () => { const P = W.pillars(); const eff = { priere: 'Sakîna au début des combats ; sérénité dans les pourparlers', savoir: 'failles révélées d’emblée ; arguments ouverts par le savoir', justice: 'dégâts reçus réduits', lien: 'dégâts infligés accrus ; renforts d’alliés' }; return `<h3>${W.saga && W.saga.veillees ? 'La Citadelle du Caïd' : 'Ce que ce règne a bâti'}</h3>` + Object.keys(D.PILLARS).map(k => `<p><b>${D.PILLARS[k].glyph} ${D.PILLARS[k].name}</b> ${'◆'.repeat(P[k] || 0)}${'◇'.repeat(5 - (P[k] || 0))}<br><small>${eff[k]}</small></p>`).join('') + '<p class="src">Les piliers montent par la prière tenue, le savoir appris, la justice rendue et les pactes noués ; ils descendent quand la parole échoue.</p>'; } },
        { label: 'Commandes', fn() {}, show: help },
        { label: 'Son : ' + (I.audio.on ? 'activé' : 'coupé'), fn(b) { I.audio.setOn(!I.audio.on); sv.opts.sound = I.audio.on; I.save.store(); b.textContent = 'Son : ' + (I.audio.on ? 'activé' : 'coupé'); }, show: () => '<h3>Son</h3><p>Coupe ou rétablit tout le son : ambiances, bruitages et musique.</p>' },
        { label: 'Musique : ' + (I.audio.musicOn ? 'activée' : 'coupée'), fn(b) { I.audio.setMusic(!I.audio.musicOn); sv.opts.music = I.audio.musicOn; I.save.store(); b.textContent = 'Musique : ' + (I.audio.musicOn ? 'activée' : 'coupée'); }, show: () => '<h3>Musique</h3><p>Bande-son originale synthétisée, une piste par ambiance. Coupée, il reste les ambiances, les percussions de duff et les bruitages.</p>' },
        { label: 'Rendu : ' + (G.low ? '2D simple' : 'rétro-HD'), fn(b) { G.low = !G.low; G._slow = 0; sv.opts.low = G.low; I.save.store(); G.resize(); b.textContent = 'Rendu : ' + (G.low ? '2D simple' : 'rétro-HD'); }, show: () => '<h3>Rendu</h3><p>Rétro-HD : éclairage, halo, profondeur de champ, ombres de nuages. 2D simple : pixel art seul, pour les appareils modestes. Le jeu bascule de lui-même s’il peine.</p>' }];
      if (inWorld) items.push({ label: 'Retour à la Chaîne', fn() { W.checkpoint(); close(); $('#hud').hidden = true; S.fade('out', 300).then(() => { U.showChain(); S.fade('in', 300); }); }, show: () => '<h3>Retour à la Chaîne</h3><p>Tu reprendras ce chapitre au dernier objectif atteint, tant que la page reste ouverte. Rien n’est écrit tant que tu n’as pas sauvegardé dans une mosquée ou à la natte des Archives.</p>' });
      $('#menu h2').textContent = 'Halte';
      build(items, { onCancel: close });
    };
    const codex = () => {
      const es = sv.codex.map(U.codexEntry).filter(Boolean), items = [{ label: '◂ Retour', fn: mode === 'codex' ? close : root, show: () => '<h3>Le Recueil</h3><p>Choisis une entrée.</p>' }];
      D.CODEX_CATS.forEach(cat => { const L = es.filter(e => e.cat === cat); if (!L.length) return; items.push({ cat }); L.forEach(e => items.push({ label: I.esc(e.title), fn() {}, show: () => `<h3>${I.esc(e.title)}</h3><p class="src">${cat} · ${I.esc(e.saga.name)}</p><p>${I.fmt(e.text)}</p>${e.src ? `<p class="src">Source : ${I.esc(e.src)}</p>` : ''}` })); });
      $('#menu h2').textContent = 'Le Recueil';
      build(items, { onCancel: mode === 'codex' ? close : root });
    };
    screen('#menu', true); if (mode === 'codex') codex(); else root();
  };

  /* ---------- mise en page et démarrage ---------- */
  function layout() {
    const app = $('#app'), st = $('#stage'), aw = app.clientWidth, ah = app.clientHeight, portrait = ah > aw * 1.12;
    document.body.classList.toggle('portrait', portrait);
    const w = Math.max(240, Math.floor(Math.min(aw, (portrait ? ah * 0.46 : ah) * 16 / 9)));
    st.style.width = w + 'px'; st.style.height = Math.round(w * 9 / 16) + 'px'; G.resize();
  }
  function pad() {
    const hold = (sel, dir) => { const b = $(sel); const dn = e => { e.preventDefault(); b.classList.add('down'); I.input.held[dir] = true; I.input.emit(dir); }; const up = e => { e.preventDefault(); b.classList.remove('down'); I.input.held[dir] = false; }; b.addEventListener('pointerdown', dn); ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => b.addEventListener(n, up)); };
    hold('#pad .u', 'up'); hold('#pad .d', 'down'); hold('#pad .l', 'left'); hold('#pad .r', 'right');
    const tap = (sel, a) => { const b = $(sel); b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('down'); I.input.emit(a); }); ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => b.addEventListener(n, () => b.classList.remove('down'))); };
    tap('#pad .a', 'ok'); tap('#pad .b', 'cancel');
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');
    window.addEventListener('touchstart', () => document.body.classList.add('touch'), { once: true, passive: true });
  }
  U.boot = function () {
    G.init($('#cv')); layout(); window.addEventListener('resize', layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe($('#app'));
    I.save.load(); I.audio.on = I.save.data.opts.sound !== false; I.audio.musicOn = I.save.data.opts.music !== false; if (I.save.data.opts.low) { G.low = true; G.resize(); }
    I.input.push(a => W.onInput(a));
    $('#dialog').addEventListener('click', () => I.input.emit('ok'));
    $('#card').addEventListener('click', () => I.input.emit('ok'));
    $('#cv').addEventListener('click', () => { if (!$('#choice').hidden || I.battle.active || U.menuOpen) return; I.input.emit('ok'); });
    $('#battle .banner').addEventListener('click', () => I.input.emit('ok'));
    $('#menubtn').addEventListener('click', e => { e.stopPropagation(); if (I.scene === W && !S.busy) U.pause(); });
    $('#buildbtn').addEventListener('click', e => { e.stopPropagation(); I.build.set(!I.build.on); });
    pad();
    let last = performance.now();
    (function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const sc = I.scene;
      if (sc) { try {
        if (I.debug.walk && sc === W) { for (let i = 0; i < 40 && I.scene === W; i++) { if (!S.busy && !W.lock) W.walkStep(); W.update(1 / 60); } I.input.clearHeld(); }
        else if (sc.update) sc.update(dt);
        G.present(dt, sc.render(dt) || {});
      } catch (e) { if (!U._err) { U._err = e; console.error(e); } } }
      $('#menubtn').hidden = !(I.scene === W && !S.busy && !$('#hud').hidden);
      $('#buildbtn').hidden = $('#menubtn').hidden || !W.saga || (W.saga.frame && !W.saga.veillees) || !I.build.outdoor(W.map.id);
      if (I.build.on) $('#buildbar').hidden = S.busy || I.scene !== W;
      I.trade.drawCompass(now / 1000);
      requestAnimationFrame(frame);
    })(last);
    const go = () => U.showTitle();
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.load('700 40px "Reem Kufi"', 'عمر').catch(() => {}), new Promise(r => setTimeout(r, 1500))]).then(go); else go();
  };
})();
