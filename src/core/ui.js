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
    // à la souris, survoler sélectionne ; au doigt, toucher sélectionne puis agit (un « survol » simulé peut faire perdre le clic sur certains téléphones)
    btns.forEach(b => { b.addEventListener('pointerenter', e => { if (e.pointerType && e.pointerType !== 'mouse') return; const i = live().indexOf(b); if (i >= 0) sel(i); });
      b.addEventListener('click', () => { const i = live().indexOf(b); if (i >= 0 && i !== idx) sel(i); }, true); });
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
  // un bouton qui répond au doigt même si le navigateur n'envoie pas le clic attendu : un toucher relâché sur place agit après
  // un court délai, sauf si le clic est arrivé entre-temps (il agit alors lui-même). Jamais deux fois.
  function tapable(b, fn) {
    let t0 = 0, x0 = 0, y0 = 0, fait = 0, tm = 0;
    const go = () => { clearTimeout(tm); tm = 0; const n = performance.now(); if (n - fait < 600 || b.disabled) return; fait = n; fn(b); };
    b.addEventListener('pointerdown', e => { t0 = performance.now(); x0 = e.clientX; y0 = e.clientY; });
    b.addEventListener('pointerup', e => { if (e.pointerType === 'mouse') return; if (performance.now() - t0 < 800 && Math.hypot(e.clientX - x0, e.clientY - y0) < 12) { clearTimeout(tm); tm = setTimeout(go, 160); } });
    b.addEventListener('pointercancel', () => { clearTimeout(tm); tm = 0; });
    b.onclick = ev => { ev.stopPropagation(); go(); };
    return b;
  }
  U.tapable = tapable;
  function screen(id, on) { $(id).hidden = !on; document.body.classList.toggle('in-screen', !!document.querySelector('.screen:not([hidden])')); }

  /* ---------- titre ---------- */
  U.showTitle = function () {
    I.setScene(U.titleScene); G.clearParts(); G.amb = { kind: 'dust', rate: 5, n: 0 }; I.audio.scene('titre'); I.audio.beat('veille');
    $('#hud').hidden = true; document.body.dataset.theme = 'orient';
    const box = $('#title .vmenu'); box.innerHTML = ''; const sv = I.save.data, has = I.save.slots().some(Boolean), auto = I.save.autoGet(); let fl;
    const mk = (label, fn, dis) => { const b = I.el('button', '', label); b.type = 'button'; b.disabled = !!dis; tapable(b, () => { I.audio.unlock(); fn(b); }); box.appendChild(b); return b; };
    const quand = t => { const m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? 'à l’instant' : m < 60 ? 'il y a ' + m + ' min' : m < 1440 ? 'il y a ' + Math.round(m / 60) + ' h' : 'le ' + new Date(t).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }); };
    const close = () => { fl.destroy(); screen('#title', false); I.audio.stopBeat(); };
    const btns = [];
    // la partie se garde toute seule : « Continuer » la reprend là où elle en était ; les copies gardées à la mosquée restent disponibles
    if (auto) btns.push(mk('Continuer<small>' + I.esc((auto.meta && auto.meta.label) || 'Partie en cours') + ' · ' + quand((auto.meta && auto.meta.when) || 0) + '</small>', () => { close(); I.save.readAuto(); U.resume(); }));
    if (has) btns.push(mk(auto ? 'Reprendre une copie gardée' : 'Continuer', async () => { close(); const ok = await U.loadMenu(); if (ok) U.resume(); else U.showTitle(); }));
    btns.push(mk('Nouvelle partie', async b => {
      close();
      if (auto && (auto.prologue || auto.cp)) { I.setScene(U.blank); S.depth++; let k = 1; try { k = await S.menuPick('Une partie est en cours. En commencer une nouvelle la remplacera ; les copies gardées à la mosquée restent.', [{ t: 'Commencer une nouvelle partie' }, { t: 'Garder ma partie' }]); } finally { S.depth--; S.hideDialog(); } if (k !== 0) return U.showTitle(); }
      I.save.reset(); I.save.data.started = true; W.roster = {}; W.saga = null; W.startChapter('idris', 0);
    }));
    btns.push(mk('Son : ' + (I.audio.on ? 'activé' : 'coupé'), b => { I.audio.setOn(!I.audio.on); sv.opts.sound = I.audio.on; I.save.store(); b.textContent = 'Son : ' + (I.audio.on ? 'activé' : 'coupé'); }));
    btns.push(mk('Musique : ' + (I.audio.musicOn ? 'activée' : 'coupée'), b => { I.audio.setMusic(!I.audio.musicOn); sv.opts.music = I.audio.musicOn; I.save.store(); b.textContent = 'Musique : ' + (I.audio.musicOn ? 'activée' : 'coupée'); }));
    btns.push(mk('Rendu : ' + (G.low ? '2D simple' : 'rétro-HD'), b => { G.low = !G.low; G._slow = 0; sv.opts.low = G.low; I.save.store(); G.resize(); b.textContent = 'Rendu : ' + (G.low ? '2D simple' : 'rétro-HD'); }));
    const TZ = ['normal', 'grand', 'très grand'];
    btns.push(mk('Texte : ' + TZ[sv.opts.tz || 0], b => { sv.opts.tz = ((sv.opts.tz || 0) + 1) % 3; I.save.store(); U.applyOpts(); b.textContent = 'Texte : ' + TZ[sv.opts.tz]; }));
    btns.push(mk('Plein écran', () => { const e = document.documentElement; try { (document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen()).catch(() => {}); } catch (e2) { /* indisponible */ } }));
    { const v = $('#title .ver'); if (v) v.textContent = 'version ' + (window.ISNAD_VERSION || 'de travail'); }
    screen('#title', true); fl = focusList(btns);
  };
  const slotLabel = (d, n) => d ? `Emplacement ${n} · ${I.esc((d.meta && d.meta.label) || 'Partie')} · ${new Date((d.meta && d.meta.when) || 0).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} ${new Date((d.meta && d.meta.when) || 0).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : `Emplacement ${n} · vide`;
  U.saveMenu = async function () {
    const slots = I.save.slots(), opts = slots.map((d, i) => ({ t: slotLabel(d, i + 1) })).concat([{ t: 'Annuler' }]);
    S.depth++;
    try {
      const i = I.debug.auto ? 2 : await S.menuPick('Garder une copie sur quel emplacement ? (La partie se sauvegarde déjà toute seule.)', opts);
      if (i > 2) return false;
      const inWorld = I.scene === W && W.map; if (inWorld) W.checkpoint();
      const lead = W.saga && W.party.length ? W.hero(W.party[0]) : null;
      const label = inWorld && W.saga ? `${W.saga.name} · ${W.ch.title}${lead ? ' · niv. ' + lead.lvl : ''}` : `La Chaîne · ${I.save.data.lights.filter(l => l !== 'sabr').length} Lumière(s)`;
      const ok = I.save.write(i + 1, { label }); if (ok) { W.unsaved = 0; W._warned = false; }
      I.audio.sfx(ok ? 'roll' : 'dark'); G.flash('#fff3c8');
      if (inWorld) for (let k = 0; k < 40; k++) G.spawn({ x: W.player.x - W.cam.x, y: W.player.y - W.cam.y - 6, vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.8) * 120, life: 1.2, size: 0.9, color: '#ffe9a8', type: 'spark' });
      S.toast(ok ? `<b>Copie gardée</b> · emplacement ${i + 1}` : 'La copie a échoué : le stockage du navigateur est indisponible.', 3600);
      return ok;
    } finally { S.depth--; S.hideDialog(); }
  };
  U.loadMenu = async function () {
    const slots = I.save.slots(), idx = slots.map((d, i) => d ? i : -1).filter(i => i >= 0);
    if (!idx.length) return false;
    I.setScene(U.blank);
    S.depth++;
    try { const k = await S.menuPick('Reprendre quelle copie ?', idx.map(i => ({ t: slotLabel(slots[i], i + 1) })).concat([{ t: 'Retour' }])); if (k >= idx.length) return false; return I.save.read(idx[k] + 1); }
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
    I.setScene(U.blank); G.clearParts(); G.amb = { kind: 'noos', rate: 5, hue: 40, n: 0 }; I.audio.stopBeat(); I.audio.scene('chaine');
    $('#hud').hidden = true; document.body.dataset.theme = 'orient'; S.hideDialog(); $('#toasts').innerHTML = '';
    const sv = I.save.data, list = I.sagaList.filter(s => !s.frame), box = $('#chain .links'); box.innerHTML = '';
    const allDone = list.every(s => sv.sagas[s.id] && sv.sagas[s.id].done);
    $('#chain header p').innerHTML = msg || (allDone ? 'Les cinq Lumières sont réunies. Le dernier maillon t’attend : le tien.' : 'Chaque maillon est un témoin. Choisis celui dont tu veux suivre la trace ; l’ordre est libre, mais la Chaîne se lit du premier au dernier.');
    const btns = []; let fl;
    const close = () => { fl.destroy(); screen('#chain', false); };
    const ROM = ['I', 'II', 'III', 'IV', 'V'], tactile = document.body.classList.contains('touch'), next = list.findIndex(s => !(sv.sagas[s.id] && sv.sagas[s.id].done));
    const ouvrir = s => { close(); U.startSaga(s); }, dernier = () => { close(); W.roster = {}; W.saga = null; W.startChapter('idris', 1); };
    // un grand bouton dit quoi faire : ouvrir le maillon suivant (ou reprendre celui qui est entamé)
    { const hd = $('#chain header'); let go = hd.querySelector('.go'); if (!go) { go = I.el('div', 'go'); hd.appendChild(go); } go.innerHTML = '';
      const s = next >= 0 ? list[next] : null, sp = s ? (sv.sagas[s.id] || { ch: 0 }) : null;
      if (s || allDone) { const b = I.el('button', 'cta', s ? (sp.ch > 0 ? `▶ Reprendre : ${I.esc(s.name)} · chapitre ${sp.ch + 1}` : `▶ Ouvrir le maillon ${ROM[next] || next + 1} : ${I.esc(s.name)}`) : (sv.epilogue ? '▶ Rejouer le dernier maillon' : '▶ Ouvrir le dernier maillon : Idris')); b.type = 'button';
        if (s) b.style.setProperty('--c', D.ELEMENTS[s.light].color); tapable(b, () => (s ? ouvrir(s) : dernier())); go.appendChild(b); btns.push(b); }
      go.appendChild(I.el('p', 'comment', (tactile ? 'Ou touche le maillon de ton choix, plus bas.' : 'Ou clique sur le maillon de ton choix. Au clavier : flèches, puis Entrée.') + ' La partie se garde toute seule.')); }
    list.forEach((s, i) => {
      const sp = sv.sagas[s.id] || { ch: 0, done: false }, e = D.ELEMENTS[s.light];
      const vl = (sv.veillees && sv.veillees[s.id] ? ' · veillée du Caïd ✓' : '') + (sv.rencontres && sv.rencontres[s.id] ? ' · rencontre ✓' : '');
      const qv = I.oeuvres.viceApres(s.id), qt = qv ? `<span class="qt">⚔ ${I.oeuvres.quete(qv)}</span>` : '';
      const st = sp.done ? `<span class="stt done">${e.glyph} ${s.lightName} retrouvée${vl}</span>` : sp.ch > 0 ? `<span class="stt">Chapitre ${sp.ch + 1} / ${s.chapters.length}</span>` : '<span class="stt">Maillon à ouvrir</span>';
      const b = I.el('button', 'link', `<span class="seal" style="background-image:url(${G.sealURL(s.arabic, e.color)})"></span><span class="lt"><span class="ord">MAILLON ${['I', 'II', 'III', 'IV', 'V'][i] || i + 1} · ${I.esc(s.years)}</span><h3>${I.esc(s.name)}</h3><span class="ep">${I.esc(s.epithet)} <small>· ${I.esc(s.ambiance || '')}</small></span><span class="tl">${I.esc(s.tagline)}</span>${st}${qt}<span class="ouvrir">${sp.done ? 'Rejouer' : sp.ch > 0 ? 'Reprendre' : 'Ouvrir'} ▸</span></span>`);
      b.type = 'button'; b.style.setProperty('--c', e.color);
      tapable(b, () => ouvrir(s));
      box.appendChild(b); btns.push(b);
    });
    const fr = I.sagas.idris;
    if (fr) {
      const b = I.el('button', 'link' + (allDone ? '' : ' locked'), `<span class="seal" style="background-image:url(${G.sealURL('إسناد', '#39e6ff')})"></span><span class="lt"><span class="ord">DERNIER MAILLON · 1508 H · 2084</span><h3>Idris</h3><span class="ep">Le Cœur de l’Agrégor <small>· cyberpunk</small></span><span class="tl">${allDone ? 'Rapporter les cinq Lumières à la Cité-Miroir.' : 'Scellé tant que les cinq Lumières ne sont pas réunies.'}</span><span class="stt${sv.epilogue ? ' done' : ''}">${sv.epilogue ? 'Chaîne transmise' : allDone ? 'Ouvert' : sv.lights.filter(l => l !== 'sabr').length + ' / 5 Lumières'}</span></span>`);
      b.type = 'button'; b.style.setProperty('--c', '#39e6ff'); b.disabled = !allDone && !I.debug.all;
      tapable(b, dernier);
      box.appendChild(b); btns.push(b);
    }
    const foot = $('#chain .chainfoot'); foot.innerHTML = '';
    foot.appendChild(I.el('span', 'lights', 'Lumières ' + Object.keys(D.ELEMENTS).filter(k => k !== 'fer').map(k => `<i class="${sv.lights.includes(k) || (k === 'sabr' && sv.epilogue) ? 'on' : ''}" style="color:${D.ELEMENTS[k].color}" title="${D.ELEMENTS[k].name}">${D.ELEMENTS[k].glyph}</i>`).join('')));
    foot.appendChild(I.el('span', 'pill', `Fidélité à la Chaîne : <b>${sv.isnad.ok}</b> / ${sv.isnad.total}`));
    if (sv.parley && sv.parley.total) foot.appendChild(I.el('span', 'pill', `Pourparlers réussis : <b>${sv.parley.won}</b> / ${sv.parley.total}`));
    if (I.sagas.caid && Object.keys(sv.veillees || {}).length) foot.appendChild(I.el('span', 'pill', 'Citadelle du Caïd : ' + Object.keys(D.PILLARS).map(k => `${D.PILLARS[k].glyph} <b>${sv.citadel[k]}</b>`).join(' · ')));
    { const d = I.oeuvres.state(), nl = Object.keys(d.lames).length, nv = Object.keys(d.vices).filter(v => d.vices[v] === 'tranche').length; if (nl || nv || d.zad) foot.appendChild(I.el('span', 'pill', `Lames : <b>${nl}</b> / 7 · maux tranchés : <b>${nv}</b> / 7 · ♥ ${d.zad}`)); }
    const pied = (label, fn) => { const b = I.el('button', '', label); b.type = 'button'; tapable(b, fn); foot.appendChild(b); btns.push(b); };
    pied('Garder une copie', async () => { close(); await U.saveMenu(); U.showChain(); });
    pied('Recueil', () => { close(); U.pause('codex', () => U.showChain()); });
    pied('Aide', () => { close(); U.pause('aide', () => U.showChain()); });
    pied('Écran-titre', () => { close(); U.showTitle(); });
    foot.appendChild(I.el('span', 'ver', 'version ' + (window.ISNAD_VERSION || 'de travail')));
    screen('#chain', true); $('#chain').scrollTop = 0;
    fl = focusList(btns, { start: 0 });
    if (!sv.cp) I.save.auto('La Chaîne · ' + sv.lights.filter(l => l !== 'sabr').length + ' Lumière(s)'); // entre deux maillons : la partie est gardée ici
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
  // la rencontre de la Cité-Miroir qui suit une saga : chapitre de l'histoire-cadre marqué « after »
  const rencontre = id => { const sv = I.save.data; sv.rencontres = sv.rencontres || {}; const fr = I.sagas.idris; if (!fr || !sv.prologue || sv.rencontres[id]) return -1; return fr.chapters.findIndex(c => c.after === id); };
  U.afterSaga = async function (saga, ch) {
    const sv = I.save.data;
    if (saga.veillees) {
      sv.veillees[ch.after] = true; I.save.store(); const c = sv.citadel;
      const ri = rencontre(ch.after); if (ri >= 0) { W.roster = {}; W.saga = null; return W.startChapter('idris', ri); }
      const tot = c.priere + c.savoir + c.justice + c.lien;
      return U.showChain(`La veillée s’achève. La Citadelle du Caïd tient par ${Object.keys(D.PILLARS).map(k => `${D.PILLARS[k].name.toLowerCase()} ${c[k]}`).join(', ')}. ${tot >= 12 ? 'Elle est debout dans les cœurs.' : tot >= 7 ? 'Elle tient, et demande qu’on la veille.' : 'Elle se lézarde : ce qui n’est plus bâti s’effrite.'}`);
    }
    if (!saga.frame && I.sagas.caid) {
      const vi = I.sagas.caid.chapters.findIndex(c => c.after === saga.id);
      if (vi >= 0 && !(sv.veillees && sv.veillees[saga.id])) {
        if (!Object.keys(sv.veillees || {}).length && !sv.caidIntro) { sv.caidIntro = true; I.audio.scene('citadelle'); await S.run([['title', 'Les Veillées de la Citadelle', 'un autre maillon de la Chaîne'], ['nar', 'Des siècles après les Compagnons, au bord du désert, un seigneur berbère lisait leurs vies à la lueur d’une lampe. Il n’y cherchait pas des récits. Il y cherchait comment tenir.'], ['nar', 'On l’appelait le Caïd. Chaque Lumière que tu retrouves, il l’a reçue avant toi, et il lui a fallu en faire quelque chose.']]); }
        W.roster = {}; W.saga = null; return W.startChapter('caid', vi);
      }
    }
    if (!saga.frame) { const ri = rencontre(saga.id); if (ri >= 0) { W.roster = {}; W.saga = null; return W.startChapter('idris', ri); } }
    if (saga.frame && ch.after) {
      sv.rencontres = sv.rencontres || {}; sv.rencontres[ch.after] = true; I.save.store();
      const s2 = I.sagas[ch.after], e2 = D.ELEMENTS[s2.light], left2 = I.sagaList.filter(s => !s.frame && !(sv.sagas[s.id] && sv.sagas[s.id].done)).length;
      return U.showChain(`<b style="color:${e2.color}">${e2.glyph} ${s2.lightName}</b> — ce qu’Idris a reçu de ${I.esc(s2.name)} a servi dans la Cité-Miroir. ${left2 ? `Encore ${left2} maillon${left2 > 1 ? 's' : ''}.` : 'Les cinq Lumières sont réunies.'}`);
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
      <p><b>Les veillées de la Citadelle</b> et <b>les rencontres de la Cité-Miroir</b> sont une fiction, comme les sept lames, les sept maux du cœur et les compagnons de lumière : des images pour parler de ce que les œuvres font au cœur. La musique est originale.</p>\n      <p>Qu’Allah agrée les Compagnons. Toute erreur est celle des auteurs ; vérifiez auprès des savants et des sources.</p>
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
    const close = () => { if (fl) fl.destroy(); screen('#menu', false); U.menuOpen = false; if (I.scene === W && W.map && W.saga && !S.busy && !W.lock) W.checkpoint(); if (onClose) onClose(); }; // ce qui a été changé dans la halte est gardé
    const mkb = (label, fn, cls) => { const b = I.el('button', cls || '', label); b.type = 'button'; return tapable(b, fn); };
    const build = (items, o) => { if (fl) fl.destroy(); side.innerHTML = ''; const btns = []; items.forEach(it => { if (it.cat) { side.appendChild(I.el('div', 'cat', it.cat)); return; } const b = mkb(it.label, it.fn); b._show = it.show; b._after = it.after; side.appendChild(b); btns.push(b); }); fl = focusList(btns, Object.assign({ onSel: b => { if (b._show) pane.innerHTML = b._show(); if (b._after) b._after(pane); } }, o)); $('#menu .cols').classList.toggle('large', !!(o && o.large)); };
    const party = () => (W.saga && W.party.length) ? W.party.map(id => { const h = W.hero(id), st = I.calc.of(h), e = D.ELEMENTS[h.def.el], eq = I.gear.of(h); return `<div class="stat"><span class="seal" style="background-image:url(${G.sealURL(h.def.arabic, e.color)})"></span><img class="fig" alt="" src="${G.charURL(Object.assign({ kind: 'compagnon' }, h.def.look))}"><div><b style="color:${e.color}">${I.esc(h.def.name)}</b> ${h.def.title ? '<em>' + I.esc(h.def.title) + '</em>' : ''} <small>· niveau ${h.lvl} · ${e.name}</small><br><small>Constance ${Math.ceil(h.hp)}/${st.hp} · Souffle ${h.sp}/${st.sp} · Force ${Math.round(st.atk)} · Esprit ${Math.round(st.mag)} · Garde ${Math.round(st.def)} · Élan ${Math.round(st.spd)}</small><div class="sk">${h.def.skills.filter(k => k.lvl <= h.lvl).map(k => I.esc(k.name)).join(' · ')}</div><div class="port">${I.gear.SLOTS.filter(s => eq[s]).map(s => I.gear.img(eq[s]) + ' ' + I.esc(D.GEAR[eq[s]].name)).join(' · ') || 'Rien d’équipé'}</div></div></div>`; }).join('') : '<p>Aucun groupe pour l’instant.</p>';
    const bag = () => '<h3>Besace</h3>' + (Object.keys(D.ITEMS).filter(k => (sv.items[k] || 0) > 0).map(k => `<p><b>${D.ITEMS[k].name}</b> ×${sv.items[k]}<br><small>${D.ITEMS[k].desc}</small></p>`).join('') || '<p>La besace est vide.</p>') + '<p class="src">Les objets s’utilisent en combat. Le groupe reprend des forces après chaque victoire.</p>';
    const journal = () => { const o = W.cur && W.cur(); return `<h3>${W.ch ? I.esc(W.ch.title) : 'Journal'}</h3><p class="src">${W.ch ? I.esc(W.ch.sub) : ''}</p><p>${o && o.text ? '◆ ' + I.esc(o.text) : 'Aucun objectif en cours.'}</p><p class="src">Le bouton <b>?</b> explique l’objectif et peut montrer le chemin.</p><p class="src">Fidélité à la Chaîne : ${sv.isnad.ok} / ${sv.isnad.total} · Lumières : ${sv.lights.map(l => D.ELEMENTS[l].name).join(', ') || 'aucune'}</p>`; };
    const pillars = () => { const P = W.pillars(); const eff = { priere: 'Sakîna au début des combats ; sérénité dans les pourparlers', savoir: 'failles révélées d’emblée ; arguments ouverts par le savoir', justice: 'dégâts reçus réduits', lien: 'dégâts infligés accrus ; renforts d’alliés' }; return `<h3>${W.saga && W.saga.veillees ? 'La Citadelle du Caïd' : 'Ce que ce règne a bâti'}</h3>` + Object.keys(D.PILLARS).map(k => `<p><b>${D.PILLARS[k].glyph} ${D.PILLARS[k].name}</b> ${'◆'.repeat(P[k] || 0)}${'◇'.repeat(5 - (P[k] || 0))}<br><small>${eff[k]}</small></p>`).join('') + '<p class="src">Les piliers montent par la prière tenue, le savoir appris, la justice rendue et les pactes noués ; ils descendent quand la parole échoue.</p>'; };
    const toggle = (name, get, set, txt) => ({ label: name + ' : ' + get(), fn(b) { set(); I.save.store(); b.textContent = name + ' : ' + get(); }, show: () => `<h3>${name}</h3><p>${txt}</p>` });
    const root = () => {
      const inWorld = I.scene === W, o = sv.opts;
      const items = [{ label: 'Reprendre', fn: close, show: journal }];
      if (inWorld) items.push({ label: 'Que faire ?', fn() { close(); U.guide(); }, show: () => '<h3>Que faire ?</h3><p>L’objectif expliqué, sa direction, et le chemin montré au sol si tu le demandes. Le même bouton <b>?</b> est toujours en haut de l’écran.</p>' });
      if (inWorld && W.map) items.push({ label: 'Carte', fn: carte, show: () => '<h3>Carte</h3><p>Le lieu entier, avec ta position, l’objectif, la natte et les lieux nommés. On l’ouvre aussi en touchant la mini-carte, ou par la touche <kbd>C</kbd>.</p>' });
      items.push({ cat: 'Le groupe' }, { label: 'Compagnons', fn() {}, show: () => '<h3>Le groupe</h3>' + party() }, { label: 'Équipement', fn() { equip(); }, show: () => I.gear.paneGroupe() }, { label: 'Besace', fn() {}, show: bag }, { label: 'Piliers', fn() {}, show: pillars });
      items.push({ cat: 'Le cœur' }, { label: 'Œuvres et lames', fn() {}, show: () => I.oeuvres.paneOeuvres() }, { label: 'Compagnons de lumière', fn: betes, show: () => I.oeuvres.paneAnimaux() });
      items.push({ cat: 'Le savoir' }, { label: 'Recueil', fn: codex, show: () => `<h3>Le Recueil</h3><p>Tout ce que tu as appris en chemin : biographies, événements, paroles avec leur source, et les idoles de la noosphère. ${sv.codex.length} entrée${sv.codex.length > 1 ? 's' : ''} pour l’instant. Chaque savoir peut ouvrir un argument dans un pourparler.</p>` },
        { label: 'Aide du jeu', fn: aide, show: () => '<h3>Aide du jeu</h3><p>Les règles, thème par thème : ' + U.AIDE.map(a => a[0].toLowerCase()).join(', ') + '.</p>' });
      items.push({ cat: 'Réglages' },
        toggle('Texte', () => ['normal', 'grand', 'très grand'][o.tz || 0], () => { o.tz = ((o.tz || 0) + 1) % 3; U.applyOpts(); }, 'Taille des caractères dans les dialogues, les menus et les combats.'),
        toggle('Croix tactile', () => o.pad ? 'affichée' : 'masquée', () => { o.pad = !o.pad; U.applyOpts(); }, 'Sur un écran tactile, on se déplace en touchant la scène. La croix directionnelle reste disponible pour qui la préfère.'),
        toggle('Son', () => I.audio.on ? 'activé' : 'coupé', () => { I.audio.setOn(!I.audio.on); o.sound = I.audio.on; }, 'Coupe ou rétablit tout le son : musique, percussions et bruitages.'),
        toggle('Musique', () => I.audio.musicOn ? 'activée' : 'coupée', () => { I.audio.setMusic(!I.audio.musicOn); o.music = I.audio.musicOn; }, 'Bande-son originale synthétisée, une piste par lieu. Coupée, il reste les percussions de duff et les bruitages.'),
        toggle('Rendu', () => G.low ? '2D simple' : 'rétro-HD', () => { G.low = !G.low; G._slow = 0; o.low = G.low; G.resize(); }, 'Rétro-HD : éclairage, halo, profondeur de champ, ombres de nuages. 2D simple : pixel art seul, pour les appareils modestes. Le jeu bascule de lui-même s’il peine.'));
      items.push({ label: 'Diagnostic', fn() {}, show: U.diagnostic });
      if (inWorld) items.push({ cat: 'Partir' }, { label: 'Retour à la Chaîne', fn() { W.checkpoint(); close(); $('#hud').hidden = true; S.fade('out', 300).then(() => { U.showChain(); S.fade('in', 300); }); }, show: () => '<h3>Retour à la Chaîne</h3><p>Tu reprendras ce chapitre là où tu l’as laissé : la partie se garde toute seule, même si tu fermes la page.</p>' });
      $('#menu h2').textContent = 'Halte';
      build(items, { onCancel: close });
    };
    // la carte du lieu : le sol et les bâtiments tels qu'on les voit, la position du héros, l'objectif, la natte, les lieux nommés
    const carteHTML = () => {
      const m = W.map, tg = W.target(), sagaCh = W.saga.chapters, pct = (v, n) => (v / n * 100).toFixed(2) + '%';
      const lieux = Object.keys(m.spots).filter(k => D.LIEUX[k]).map(k => '<span class="lieu" style="left:' + pct(m.spots[k][0] + 0.5, m.w) + ';top:' + pct(m.spots[k][1] + 0.5, m.h) + '">' + I.esc(D.LIEUX[k]) + '</span>').join('');
      return '<h3>' + I.esc(D.MAPS[m.id].label) + '</h3><p class="src">' + I.esc(W.ch.sub) + '</p>' +
        '<div class="carte" style="aspect-ratio:' + m.w + '/' + m.h + ';max-width:min(100%, calc(58vh * ' + (m.w / m.h).toFixed(3) + '))"><canvas></canvas>' + lieux + '<span class="ici" style="left:' + pct(W.player.x, m.w * 16) + ';top:' + pct(W.player.y - 8, m.h * 16) + '">' + I.esc(W.saga.heroes[W.party[0]].name) + '</span></div>' +
        '<p class="legende"><i class="k1"></i> toi <i class="k2"></i> objectif' + (tg ? '' : ' (ailleurs, ou sans lieu)') + (W.prayerPts().length ? ' <i class="k3"></i> natte : prière, repos, œuvres' : '') + (m.spots.comptoir ? ' <i class="k4"></i> comptoir : boutique d’équipement, caravanes' : '') + '</p>' +
        '<p class="src">' + sagaCh.map((c, i) => (i === W.ci ? '<b>▸ ' + I.esc(c.title) + '</b>' : I.esc(c.title))).slice(0, W.saga.frame && !W.saga.veillees ? 0 : 9).join(' · ') + '</p>';
    };
    const carteDraw = pane => {
      const cv = pane.querySelector('.carte canvas'); if (!cv) return; const m = W.map, src = W.carte(), c = cv.getContext('2d'), tg = W.target(), T = 16;
      cv.width = src.width; cv.height = src.height; c.drawImage(src, 0, 0);
      c.fillStyle = 'rgba(8,6,16,.18)'; c.fillRect(0, 0, cv.width, cv.height);
      const k = Math.max(1, src.width / 480), star = (x, y, r, col, n) => { c.fillStyle = col; c.beginPath(); for (let q = 0; q < n * 2; q++) { const rr = q % 2 ? r * 0.42 : r, a = q * Math.PI / n - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); };
      const halo = (x, y, r) => { c.fillStyle = 'rgba(10,8,20,.75)'; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill(); };
      W.prayerPts().forEach(sp => { const x = sp[0] * T + 8, y = sp[1] * T + 10; halo(x, y, 9 * k); star(x, y, 7.5 * k, '#7fe6e0', 8); });
      if (m.spots.comptoir) { const x = m.spots.comptoir[0] * T + 8, y = m.spots.comptoir[1] * T + 8; halo(x, y, 8 * k); c.strokeStyle = '#e9c877'; c.lineWidth = 2 * k; c.beginPath(); c.arc(x, y, 5 * k, 0, 6.3); c.stroke(); c.fillStyle = '#e9c877'; c.beginPath(); c.arc(x, y, 1.6 * k, 0, 6.3); c.fill(); }
      if (tg) { halo(tg.gx, tg.gy - 6, 11 * k); star(tg.gx, tg.gy - 6, 9.5 * k, '#ffe08a', 4); }
      const p = W.player; halo(p.x, p.y - 8, 9 * k); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y - 8, 6 * k, 0, 6.3); c.fill(); c.fillStyle = '#ff7a5c'; c.beginPath(); c.arc(p.x, p.y - 8, 3.2 * k, 0, 6.3); c.fill();
    };
    const carte = () => {
      const back = mode === 'carte' ? close : root;
      $('#menu h2').textContent = 'Carte';
      build([{ label: '◂ Retour', fn: back, show: carteHTML, after: carteDraw }], { onCancel: back, large: true });
    };
    // l'équipement : quatre emplacements par compagnon, une réserve commune ; on choisit une pièce en voyant ce qu'elle change
    const equip = start => {
      const Gr = I.gear, items = [{ label: '◂ Retour', fn: mode === 'equip' ? close : root, show: () => Gr.paneGroupe() }];
      if (W.saga && W.party.length) {
        items.push({ label: '✦ Équiper au mieux', fn() { const n = Gr.bestAll(); I.audio.sfx(n ? 'light' : 'blip'); S.toast(n ? `${n} pièce${n > 1 ? 's' : ''} changée${n > 1 ? 's' : ''}.` : 'Chacun porte déjà ce que la réserve a de mieux pour lui.', 2400); equip(1); }, show: () => Gr.paneGroupe() });
        W.party.forEach((id, pi) => { const h = W.hero(id); items.push({ cat: I.esc(h.def.name) });
          Gr.SLOTS.forEach((s, si) => { const cur = Gr.of(h)[s], g = D.GEAR[cur]; items.push({ label: g ? Gr.img(cur) + ' ' + I.esc(g.name) : '<i class="gi vide"></i> <span class="rien">' + D.SLOTS[s] + ' : rien</span>', fn() { pieces(h, s, 2 + pi * 4 + si); }, show: () => '<h3>' + I.esc(h.def.name) + '</h3>' + Gr.fiche(h) + '<p class="src">Choisis un emplacement pour voir ce que la réserve propose.</p>' }); }); });
      }
      items.push({ cat: 'Réserve' }, { label: 'Voir la réserve', fn() {}, show: () => Gr.paneReserve() });
      $('#menu h2').textContent = 'Équipement';
      build(items, { onCancel: mode === 'equip' ? close : root, start: start || 0 });
    };
    const pieces = (h, s, back) => {
      const Gr = I.gear, cur = Gr.of(h)[s], retour = () => equip(back), items = [{ label: '◂ Retour', fn: retour, show: () => '<h3>' + D.SLOTS[s] + '</h3>' + Gr.fiche(h) }];
      const prendre = (id, avant) => () => { if (avant) avant(); if (Gr.put(h, s, id)) I.audio.sfx(id ? 'light' : 'blip'); retour(); };
      Gr.reserve(s).filter(id => Gr.can(h.def, id)).forEach(id => items.push({ label: Gr.img(id) + ' ' + I.esc(D.GEAR[id].name) + (Gr.stock(id) > 1 ? ' ×' + Gr.stock(id) : ''), fn: prendre(id), show: () => Gr.panePiece(h, s, id) }));
      Gr.ailleurs(h, s).forEach(a => items.push({ label: Gr.img(a.id) + ' ' + I.esc(D.GEAR[a.id].name) + ' <small>· ' + I.esc(a.name) + '</small>', fn: prendre(a.id, () => Gr.rappeler(a.key, s)), show: () => Gr.panePiece(h, s, a.id, 'porté par ' + I.esc(a.name) + ', resté en arrière') }));
      if (cur) items.push({ label: '<i class="gi vide"></i> Ne rien porter', fn: prendre(null), show: () => Gr.panePiece(h, s, null) });
      if (items.length === (cur ? 2 : 1)) items.push({ label: 'Rien d’autre pour lui', fn() {}, show: () => '<h3>' + D.SLOTS[s] + '</h3><p>La réserve n’a rien que ' + I.esc(h.def.name) + ' puisse porter ici. Les coffres et les comptoirs la rempliront.</p>' });
      $('#menu h2').textContent = D.SLOTS[s] + ' · ' + h.def.name;
      build(items, { onCancel: retour, start: items.length > 1 ? 1 : 0 });
    };
    const betes = () => {
      const d = I.oeuvres.state(), A = I.sagas.coeur.animaux, items = [{ label: '◂ Retour', fn: root, show: () => I.oeuvres.paneAnimaux() }];
      D.ANIMAUX.filter(id => d.animaux[id]).forEach(id => items.push({ label: (d.animal === id ? '● ' : '○ ') + A[id].name, fn() { d.animal = id; I.save.store(); I.audio.sfx('light'); betes(); }, show: () => I.oeuvres.paneAnimaux() }));
      if (items.length === 1) items.push({ label: 'Aucun pour l’instant', fn() {}, show: () => I.oeuvres.paneAnimaux() });
      $('#menu h2').textContent = 'Compagnons de lumière';
      build(items, { onCancel: root });
    };
    const aide = () => {
      const back = mode === 'aide' ? close : root, items = [{ label: '◂ Retour', fn: back, show: () => '<h3>Aide du jeu</h3><p>Choisis un thème.</p>' }];
      U.AIDE.forEach(a => items.push({ label: a[0], fn() {}, show: () => `<h3>${a[0]}</h3>${a[1]}` }));
      $('#menu h2').textContent = 'Aide du jeu';
      build(items, { onCancel: back });
    };
    const codex = () => {
      const es = sv.codex.map(U.codexEntry).filter(Boolean), items = [{ label: '◂ Retour', fn: mode === 'codex' ? close : root, show: () => '<h3>Le Recueil</h3><p>Choisis une entrée.</p>' }];
      D.CODEX_CATS.forEach(cat => { const L = es.filter(e => e.cat === cat); if (!L.length) return; items.push({ cat }); L.forEach(e => items.push({ label: I.esc(e.title), fn() {}, show: () => `<h3>${I.esc(e.title)}</h3><p class="src">${cat} · ${I.esc(e.saga.name)}</p><p>${I.fmt(e.text)}</p>${e.src ? `<p class="src">Source : ${I.esc(e.src)}</p>` : ''}` })); });
      $('#menu h2').textContent = 'Le Recueil';
      build(items, { onCancel: mode === 'codex' ? close : root });
    };
    screen('#menu', true); if (mode === 'codex') codex(); else if (mode === 'aide') aide(); else if (mode === 'equip') equip(); else if (mode === 'carte' && I.scene === W && W.map) carte(); else root();
  };

  /* ---------- l'aide du jeu, thème par thème ---------- */
  U.AIDE = [
    ['Se déplacer, agir', '<p><b>Au doigt ou à la souris.</b> Touche un endroit : le héros s’y rend. Garde le doigt posé : il te suit. Touche un personnage pour lui parler ; touche un coffre, une natte, un palmier, un rocher ou un puits pour t’en servir.</p><p><b>Au clavier.</b> <kbd>Flèches</kbd> ou <kbd>ZQSD</kbd>/<kbd>WASD</kbd> : marcher, naviguer · <kbd>Entrée</kbd>/<kbd>Espace</kbd> : parler, valider · <kbd>Échap</kbd>/<kbd>X</kbd> : halte, retour · <kbd>H</kbd> : que faire ? · <kbd>B</kbd> : bâtir.</p><p>Le bouton <b>?</b> dit toujours ce qu’il y a à faire, dans quelle direction, et peut montrer le chemin ou t’y conduire.</p><p><b>La carte.</b> La mini-carte, en haut de l’écran, montre le lieu et ta position. Touche-la, ou ouvre <b>Carte</b> dans la halte (touche <kbd>C</kbd>) : le lieu entier, l’objectif, la natte, les lieux nommés.</p><p><b>Qui est qui.</b> Chaque personnage a sa coiffe, son manteau et son attribut. À l’arrêt, le nom de ceux qui t’entourent s’affiche au-dessus d’eux.</p>'],
    ['Combat', '<p>On n’affronte jamais des personnes, seulement des <em>égrégores</em> : les idoles que les cœurs fabriquent ensemble. Chaque égrégore est protégé par des <b>voiles</b> (⛊). Frappe-le avec la <b>vertu</b> qui est sa faille pour retirer un voile ; à zéro, il est <b>dévoilé</b> : il perd son tour et subit bien plus.</p><p><b>Niyya</b> (l’intention) : un point par tour ; dépense-en jusqu’à trois (◂ ▸) pour multiplier les coups ou renforcer une vertu. <b>Sakîna</b> : la jauge dorée ; pleine, elle ouvre l’acte ultime du Compagnon.</p>'],
    ['La parole avant le sabre', '<p>Un <b>pourparler</b> se gagne manche après manche : chaque argument fait monter ou baisser la confiance. Les meilleurs demandent un <b>savoir</b> (✧) appris d’un savant, d’un feuillet, d’un témoin. Avoir <b>prié</b> dans le chapitre donne la sérénité : +1 de confiance. Si la parole échoue, le récit continue, mais il en coûte.</p>'],
    ['Prier, se reposer, reprendre', '<p>La natte d’une mosquée, au cœur de l’étoile à huit branches : on y <b>prie</b>, et le groupe s’y <b>repose</b>. Constance et Souffle reviennent à 100 %, la Sakîna descend. On y accomplit aussi les œuvres du jour.</p><p><b>La partie se garde toute seule</b>, à chaque objectif atteint et toutes les quelques secondes en promenade. Tu peux fermer la page : « Continuer », sur l’écran-titre, te ramène là où tu étais. Si le jeu se bloquait, recharge la page et continue.</p><p>Sur la natte, ou depuis l’écran de la Chaîne, on peut en plus <b>garder une copie</b> de la partie dans l’un des trois emplacements : utile avant un choix que l’on voudrait pouvoir rejouer.</p>'],
    ['Les étoiles', '<p>On s’oriente au ciel. Le cadran montre huit caps, nommés par l’étoile qui s’y lève ou s’y couche : <b>al-Jady</b> (la Polaire) au nord, <b>Suhayl</b> au sud, <b>an-Nasr at-Tâ’ir</b> à l’est et à l’ouest, <b>al-’Ayyûq</b> et <b>al-’Aqrab</b> entre eux. L’étoile qui brille est celle de ton objectif ; au bord de l’écran, elle te précède.</p>'],
    ['Caravanes', '<p>Aux ballots du souk ou du camp, on vend, on achète, et l’on confie une cargaison à une caravane : elle revient au chapitre suivant avec son gain, ou bien des hommes rentrent à pied. Une route est plus sûre quand la justice est rendue, que des pactes sont noués et que des méharistes la gardent. Si elle est pillée, on lève des renforts, on parle d’abord, et l’on rend à chacun ce qui lui revient.</p>'],
    ['Bâtir', '<p>Touche <kbd>B</kbd> ou bouton ▦, à ciel ouvert. On récolte en s’adressant aux choses : un palmier donne de la <b>palme</b>, un rocher de la <b>pierre</b>, un puits ou une rive de l’<b>eau</b>, et l’eau pétrie donne du <b>pisé</b>. Puis on pose case par case, devant soi ou en touchant la case : tranchée qui arrête les égrégores, puits, palmiers (un puits et trois palmiers font une oasis), champs, enclos de chèvres, de moutons, de chameaux, et les pièces d’une mosquée. Ce qui est bâti reste et rapporte à chaque chapitre. Sur une terre gagnée, un chantier s’ouvre : la mosquée achevée devient un lieu de prière et de sauvegarde.</p>'],
    ['Équipement', '<p>Chaque compagnon a quatre emplacements : <b>main droite</b> (épée, lance, arc, dague, masse, bâton ou calame), <b>main gauche</b> (bouclier, ou un outil pour qui n’en porte pas), <b>tête</b> (turban, calotte ou casque) et <b>corps</b> (étoffe, cuir ou armure). Chaque rôle a ses pièces : un sage ne porte pas de cotte de mailles, un guerrier n’a que faire d’un calame.</p><p>Les pièces viennent des <b>coffres</b>, des <b>victoires</b> (toujours après une idole, parfois après un combat ordinaire) et de la <b>boutique d’équipement</b>, au comptoir : chaque lieu a ses artisans, et l’on n’y trouve pas la même chose à Médine, au camp ou dans une ville de Rûm. Elles vont dans une <b>réserve</b> commune à toute la Chaîne ; à la fin d’un maillon, ce que le groupe portait y retourne.</p><p>Dans la halte, <b>Équipement</b> montre ce que chaque pièce change avant de la choisir ; <b>Au mieux</b> habille tout le groupe d’un geste. Une lance perce la garde, une dague frappe parfois deux fois, un arc tire le premier, une masse étourdit, un bouclier pare, un casque évite d’être étourdi ; le fer protège mais ralentit.</p><p>Ce sont des objets ordinaires, sans relique ni inscription. Le fer aide à tenir : il ne remplace pas la provision du cœur.</p>'],
    ['Les œuvres et la provision', '<p>Sur la natte d’une mosquée, on prie, et l’on accomplit les <b>œuvres du jour</b> : le dhikr, l’étude du Coran, le jeûne, l’aumône, la visite ; parfois le pèlerinage. Trois par chapitre au plus, la prière en sus. Chacune ajoute à la <b>provision du cœur</b> (♥, cinq au plus).</p><p>Plus une épreuve est lourde, plus elle en demande : une idole pèse 2, un mal du cœur 3. Qui s’y présente sans provision combat <b>le cœur lourd</b> : il frappe moins fort et reçoit davantage. Le bouton <b>?</b> annonce le poids de l’épreuve qui vient.</p><p>Un jour de <b>jeûne</b>, les vivres de la besace attendent le soir. L’aumône coûte des dirhams. Ces œuvres ne sont pas des sortilèges : le jeu traduit à sa façon ce qu’elles font au cœur.</p>'],
    ['Lames et maux du cœur', '<p>Sept maux du cœur se tiennent derrière les idoles : l’avidité, l’orgueil, l’ostentation, l’avarice, l’insouciance, l’envie, la colère. On les rencontre à la fin de chaque rencontre de la Cité-Miroir, et tous ceux qui restent au dernier chapitre.</p><p>Une œuvre pratiquée forge une <b>lame</b> : trois jeûnes pour le Contentement, trois prières pour la Sincérité, trois aumônes pour la Largesse, trois études pour l’Ardeur, trois visites pour la Bienveillance, trois dhikr pour la Longanimité, un pèlerinage pour l’Humilité. Sans sa lame, un mal est seulement <b>repoussé</b> : il revient. Avec elle, il est <b>tranché</b>.</p><p>La page « Œuvres et lames » de la halte tient le compte.</p>'],
    ['Idées noires et énigmes', '<p>Dans un pourparler, il arrive que la <b>honte</b>, la <b>peur</b>, le <b>soupçon</b>, la <b>rancune</b> ou le <b>désespoir</b> parlent plus fort que toi. Il faut alors dissiper cette idée noire dans la noosphère : on ne la combat pas contre l’homme, mais pour lui. Après quoi il écoute, et la confiance monte.</p><p>Une <b>énigme du cœur</b> : un compagnon languit sans fièvre ni blessure. Il tient moins bien au combat tant qu’on n’a pas trouvé ce qu’il a cessé de faire. Les anciens donnent des indices ; la bonne œuvre, accomplie sur la natte, le remet debout.</p>'],
    ['Compagnons de lumière', '<p>Des figures du ciel : le Renard des sables, l’Aigle, le Phénix, le Lion, la Gazelle. Elles rejoignent celui qui a résolu une énigme, forgé une lame, tranché un mal, tenu trois grandes épreuves le cœur prêt, gagné cinq pourparlers. Une seule t’accompagne au combat ; on la choisit dans la halte. Fiction : aucune n’appartient au récit historique.</p>'],
    ['Si le jeu s’arrête', '<p>Si l’écran reste noir ou si plus rien ne répond pendant un quart de minute, un bouton <b>Reprendre</b> apparaît en bas de l’écran : il ramène au dernier objectif atteint, sans rien perdre de ce qui a été sauvegardé.</p><p>La partie se garde toute seule : en dernier recours, <b>recharge la page</b> puis choisis « Continuer ».</p><p>Dans la halte, <b>Diagnostic</b> donne la version du jeu, l’appareil, l’état du son et les incidents relevés : c’est ce qu’il faut transmettre pour qu’une panne soit comprise. Couper le son ou la musique (Réglages) suffit parfois à la contourner.</p>'],
    ['La Chaîne', '<p>Aux moments décisifs, plusieurs actes te sont proposés. Un seul est celui que les transmetteurs ont rapporté. Te tromper ne change pas l’Histoire : la chaîne vacille, puis te ramène à ce qui fut.</p>']
  ];

  /* ---------- « Que faire ? » : l'objectif expliqué, sa direction, le chemin ---------- */
  const CAPS = ['à l’est', 'au sud-est', 'au sud', 'au sud-ouest', 'à l’ouest', 'au nord-ouest', 'au nord', 'au nord-est'];
  U.guideLines = function () {
    const o = W.cur(), tg = W.target(), p = W.player, touch = document.body.classList.contains('touch'), out = [];
    if (!o) return ['Le chapitre s’achève : laisse le récit se dérouler.'];
    const n = o.talk && W.npcs.find(x => x.id === o.talk);
    out.push('<b>◆ ' + I.esc(o.text || 'Poursuis.') + (o.build ? I.esc(I.build.objectiveText(o.build)) : '') + '</b>');
    if (o.hint) out.push(I.fmt(o.hint));
    if (o.goto) out.push('Rends-toi à l’endroit marqué d’un <em>anneau doré</em> au sol.');
    else if (o.talk) out.push('Va parler à <em>' + I.esc((n && n.name) || 'celui qui t’attend') + '</em> : un losange doré flotte au-dessus de lui. ' + (touch ? 'Touche-le du doigt.' : 'Clique sur lui, ou place-toi devant lui puis <kbd>Entrée</kbd>.'));
    else if (o.foe) out.push('Une idole barre le passage : c’est la lueur qui flotte. Marche jusqu’à elle pour l’affronter.');
    else if (o.build) out.push(o.build.site ? 'Un chantier est ouvert : le rectangle en pointillés. Ouvre le mode Bâtir (▦), choisis une pièce et pose-la à l’intérieur ; le compte est rappelé à côté de l’objectif.' : 'Ouvre le mode Bâtir (▦), à ciel ouvert, et pose ce qui est demandé. Les matériaux se récoltent sur les palmiers, les rochers et les puits.');
    if (tg) {
      const dx = tg.gx - p.x, dy = tg.gy - p.y, d = Math.hypot(dx, dy), st = I.trade && I.trade.bearing();
      out.push(d < 44 ? 'C’est tout près.' : 'C’est ' + CAPS[((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8] + ', à ' + Math.round(d / 16) + ' pas' + (st ? ' : cap sur ' + (st.way ? 'le ' : '') + I.esc(I.trade.starText(st)) + ', l’étoile qui brille au cadran.' : '.'));
    }
    const fo = o.foe && W.foes.find(x => x.id === o.foe), wt = fo ? I.oeuvres.weight({ group: fo.group, boss: fo.boss }) : 0, zd = I.oeuvres.zad();
    if (wt) out.push('Cette épreuve pèse <b>' + wt + '</b> ; ta provision du cœur est de <b>♥ ' + zd + '</b>. ' + (zd >= wt ? 'Le cœur est prêt.' : 'Il manque ' + (wt - zd) + ' : une œuvre sur la natte d’une mosquée (dhikr, étude, jeûne, aumône, visite) allégerait le cœur.'));
    const qv = W.saga && I.oeuvres.viceApres(W.saga.veillees ? W.ch.after : W.saga.id), dq = I.oeuvres.state();
    if (qv && dq.vices[qv] !== 'tranche' && !dq.lames[qv]) out.push('Au bout de ce maillon, dans la Cité-Miroir, un mal du cœur attend. ' + I.oeuvres.quete(qv) + '. Sans sa lame, il ne sera que repoussé.');
    const en = I.oeuvres.enigme();
    if (en) out.push('<em>Énigme du cœur.</em> ' + I.esc(en.signe) + ' Cherche ce qu’il a cessé de faire : la bonne œuvre, sur la natte, le remettra debout. Les anciens ont peut-être remarqué quelque chose.');
    const tired = W.party.some(id => { const h = W.hero(id); return h.hp < I.calc.of(h).hp * 0.5; });
    if (tired) out.push('Le groupe est éprouvé : la natte d’une mosquée, au cœur de l’étoile à huit branches, le repose.');
    else if (o.foe && !S.flags._prayed && W.prayerPts().length) out.push('Avant l’épreuve, une prière sur la natte donne la Sakîna au groupe.');
    const mieux = I.gear.better(); if (mieux) out.push('La réserve tient une pièce qui irait mieux à ' + I.esc(mieux.h.def.name) + ' : <em>' + I.esc(D.GEAR[mieux.id].name) + '</em>. Halte, puis <b>Équipement</b>.');
    return out;
  };
  U.guide = async function () {
    if (I.scene !== W || S.busy || W.lock || U.menuOpen || !W.ch) return;
    const tg = W.target(), opts = [];
    if (tg) opts.push({ t: 'Montrer le chemin', k: 'way' }, { t: 'M’y conduire', k: 'go' });
    opts.push({ t: 'Toute l’aide du jeu', k: 'aide' }, { t: 'Reprendre', k: '' });
    let k = '';
    S.depth++;
    try { const i = await S.menuPick({ cls: 'guide', html: '<span class="gt">Que faire ?</span>' + U.guideLines().map(x => '<span class="gl">' + x + '</span>').join('') }, opts); k = opts[i].k; }
    finally { S.depth--; S.hideDialog(); }
    if (k === 'way') W.wayT = W.t + 16;
    else if (k === 'go') { W.wayT = W.t + 16; W.lead(); }
    else if (k === 'aide') U.pause('aide');
  };

  /* ---------- garde-fou : le jeu ne doit jamais rester arrêté sans issue ---------- */
  let figeDepuis = 0;
  // « arrêté » : le jeu se dit occupé (ou l'écran est noir), et rien à l'écran n'attend le joueur, depuis quinze secondes
  U.veille = function (now) {
    const box = $('#secours'), fade = +($('#fade').style.opacity || 0);
    const attend = !$('#dialog').hidden || !$('#choice').hidden || !$('#card').hidden || !!document.querySelector('.screen:not([hidden])') ||
      (I.battle.active && ($('#battle .cmd').childElementCount > 0 || !$('#battle .banner').hidden || $('#floaters').childElementCount > 0));
    const libre = I.scene === W && !S.busy && !W.lock && fade < 0.5;
    if (libre || attend || I.debug.auto || !I.save.data.started) { figeDepuis = 0; if (!box.hidden) box.hidden = true; return; }
    if (!figeDepuis) figeDepuis = now;
    if (now - figeDepuis > 15000 && box.hidden) { const e = I.errors[I.errors.length - 1]; box.querySelector('small').textContent = e ? 'Incident : ' + e.msg : 'Aucun incident relevé : le jeu attendait quelque chose qui n’est pas venu.'; box.hidden = false; }
  };
  // reprise au dernier objectif atteint : on referme tout ce qui était en cours, puis on repart du point de reprise
  U.secours = function () {
    $('#secours').hidden = true; figeDepuis = 0;
    I.errors.push({ t: Date.now(), msg: 'reprise demandée par le joueur', st: '', n: 1 });
    try { I.battle.abort(W); } catch (e) { /* le combat n'était pas ouvert */ }
    S.depth = 0; W.lock = false; W._autoBusy = false; U.menuOpen = false; S.hideDialog(); $('#choice').hidden = true; document.body.classList.remove('in-dialog', 'in-screen', 'in-build');
    const c = $('#card'); c.classList.remove('on'); c.hidden = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; });
    I.input.reset(); const f = $('#fade'); f.style.transition = 'opacity .3s ease'; f.style.opacity = 0; document.body.classList.remove('noir');
    I.save.readAuto(); // on repart de la partie écrite au dernier repos : ce que l'objectif interrompu avait déjà compté n'est pas compté deux fois
    const sv = I.save.data;
    if (sv.cp && I.sagas[sv.cp.saga]) { W.roster = {}; W.saga = null; W.startChapter(sv.cp.saga, sv.cp.ci, sv.cp); }
    else if (!sv.prologue) { W.roster = {}; W.saga = null; W.startChapter('idris', 0); }
    else U.showChain();
  };
  U.diagnostic = function () {
    const A = I.audio, st = $('#stage'), d = I.oeuvres.state(), e = I.errors;
    const L = [['Version', window.ISNAD_VERSION || 'de travail'], ['Navigateur', navigator.userAgent], ['Fenêtre', window.innerWidth + ' × ' + window.innerHeight + ' · densité ' + (window.devicePixelRatio || 1)],
      ['Scène', st.clientWidth + ' × ' + st.clientHeight + (document.body.classList.contains('portrait') ? ' · en hauteur' : ' · en largeur') + (U.zoom ? ' · agrandie' : '') + ' · échelle ' + G.k + (G.low ? ' · 2D simple' : '')],
      ['Entrée', (document.body.classList.contains('touch') ? 'tactile' : 'clavier ou souris')],
      ['Sauvegarde automatique', I.save.autoKo ? 'refusée par le navigateur (stockage indisponible)' : I.save.autoAt ? 'il y a ' + Math.round((Date.now() - I.save.autoAt) / 1000) + ' s' : 'pas encore écrite'],
      ['Son', (A.ctx ? A.ctx.state + ' · ' + A.ctx.sampleRate + ' Hz' : 'aucun contexte') + ' · piste ' + ((A.curTrack && A.curTrack.name) || 'aucune') + ' · voulue ' + (A.wantTrack || 'aucune') + ' · lieu ' + (A.place || 'aucun') + ' · incidents ' + (A.fails || 0) + ' · notes ' + A.stats.notes + ', sautées ' + A.stats.sautees + ', relances ' + A.stats.relances],
      ['Partie', (W.saga ? W.saga.id + ' / ' + (W.ch && W.ch.id) + ' / objectif ' + W.objIndex : 'hors chapitre') + ' · récit ' + (S.busy ? 'occupé (' + S.depth + ')' : 'libre') + ' · provision ' + d.zad]];
    return '<h3>Diagnostic</h3><p>Si le jeu s’arrête ou se comporte mal, une capture de cette page dit où regarder.</p><p class="diag">' + L.map(x => '<b>' + x[0] + '</b> ' + I.esc(String(x[1]))).join('<br>') + '</p>' +
      '<h3>Incidents relevés</h3><p class="diag">' + (e.length ? e.slice().reverse().map(x => new Date(x.t).toLocaleTimeString('fr-FR') + ' · ' + I.esc(x.msg) + (x.n > 1 ? ' (×' + x.n + ')' : '') + (x.st ? '<br><small>' + I.esc(x.st) + '</small>' : '')).join('<br>') : 'Aucun.') + '</p>';
  };

  /* ---------- noms au-dessus des personnages ---------- */
  let still = 0;
  U.noms = function (now) {
    const box = $('#noms'), ok = I.scene === W && W.map && W.saga && !S.busy && !W.lock && !U.menuOpen && !(I.build && I.build.on) && !$('#hud').hidden;
    if (!ok) { if (box.childElementCount) box.innerHTML = ''; return; }
    const p = W.player, sc = U.scale || 1, cx = Math.round(W.cam.x) + (U.zoom ? G.view.x : 0), cy = Math.round(W.cam.y), tg = W.target(), list = [], m = W.map;
    if (p.moving) still = now;
    W.npcs.forEach(n => { if (n.hidden || n.map !== m.id || !n.placed) return; const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < 60 || (tg && tg.ent === n && d < 150)) list.push({ k: 'n' + n.id, t: n.name, x: n.x, y: n.y, d, c: n.aura || '#f3e7cc' }); });
    list.sort((a, b) => a.d - b.d); list.length = Math.min(list.length, 5);
    if (now - still > 900) W.party.forEach((id, i) => { const tr = i ? W.trail[Math.min(W.trail.length - 1, i * 13)] : [p.x, p.y], h = W.saga.heroes[id]; if (tr) list.push({ k: 'h' + id, t: h.name, x: tr[0], y: tr[1], d: 0, c: D.ELEMENTS[h.el].color }); });
    const seen = {}, w = $('#stage').clientWidth;
    list.forEach(e => { const x = (e.x - cx) * sc, y = (e.y - cy - 25) * sc; if (x < 8 || x > w - 8 || y < 4) return; seen[e.k] = 1;
      let el = box.querySelector('[data-k="' + e.k + '"]'); if (!el) { el = I.el('span', 'nom', I.esc(e.t)); el.dataset.k = e.k; el.style.setProperty('--c', e.c); box.appendChild(el); }
      el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px'; });
    [...box.children].forEach(el => { if (!seen[el.dataset.k]) el.remove(); });
  };

  /* ---------- réglages d'affichage ---------- */
  U.applyOpts = function () {
    const o = I.save.data.opts;
    document.documentElement.style.setProperty('--tz', [1, 1.16, 1.34][o.tz || 0]);
    document.body.classList.toggle('padon', !!o.pad);
    layout();
  };

  /* ---------- mise en page et démarrage ---------- */
  let cvEl = null;
  function layout() {
    const app = $('#app'), st = $('#stage'), aw = app.clientWidth, ah = app.clientHeight, portrait = ah > aw * 1.12;
    document.body.classList.toggle('portrait', portrait);
    // en hauteur, pendant l'exploration : la scène s'élargit en hauteur et ne montre qu'une partie de la largeur, agrandie
    const zoom = portrait && (I.scene === W || I.battle.active);
    let w, h;
    if (zoom) { w = aw; h = Math.round(Math.max(Math.min(aw, ah * 0.47), aw * 9 / 16)); }
    else { w = Math.max(240, Math.floor(Math.min(aw, (portrait ? ah * 0.46 : ah) * 16 / 9))); h = Math.round(w * 9 / 16); }
    st.style.width = w + 'px'; st.style.height = h + 'px';
    if (cvEl) cvEl.style.width = Math.max(w, Math.round(h * 16 / 9)) + 'px';
    U.zoom = zoom; U.scale = h / G.PH;
    const vw = Math.min(G.PW, w / U.scale);
    const changed = Math.abs(G.view.w - vw) > 0.5; G.view.w = vw;
    if (I.scene !== W) { G.view.x = G.view.t = Math.round((G.PW - vw) / 2); if (changed && I.battle.active) I.battle.relayout(); } else if (changed && W.map) W.updateCam(true);
    document.body.classList.toggle('zoom', vw < G.PW - 0.5);
    G.resize();
  }
  function pad() {
    const hold = (sel, dir) => { const b = $(sel); const dn = e => { e.preventDefault(); b.classList.add('down'); I.input.held[dir] = true; I.input.emit(dir); }; const up = e => { e.preventDefault(); b.classList.remove('down'); I.input.held[dir] = false; }; b.addEventListener('pointerdown', dn); ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => b.addEventListener(n, up)); };
    hold('#pad .u', 'up'); hold('#pad .d', 'down'); hold('#pad .l', 'left'); hold('#pad .r', 'right');
    const tap = (sel, a) => { const b = $(sel); b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('down'); I.input.emit(a); }); ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => b.addEventListener(n, () => b.classList.remove('down'))); };
    tap('#pad .a', 'ok'); tap('#pad .b', 'cancel');
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');
    window.addEventListener('touchstart', () => document.body.classList.add('touch'), { once: true, passive: true });
  }
  /* ----- toucher la scène : aller là, suivre le doigt ; pendant un dialogue, valider ----- */
  let ptr = null;
  function pointer() {
    const cv = cvEl, st = $('#stage'), bare = e => e.target === cv || e.target === st || e.target.id === 'ui' || e.target.id === 'view', free = () => I.scene === W && !S.busy && !W.lock && !U.menuOpen && !I.debug.auto && !I.debug.walk;
    const where = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * G.PW + Math.round(W.cam.x), (e.clientY - r.top) / r.height * G.PH + Math.round(W.cam.y)]; };
    st.addEventListener('pointerdown', e => {
      if (e.button || !bare(e)) return;
      I.audio.unlock();
      ptr = { id: e.pointerId, world: free(), x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now(), hold: false, last: 0 };
      if (ptr.world) { e.preventDefault(); try { st.setPointerCapture(e.pointerId); } catch (x) { /* sans capture : le relâchement suffit */ } }
    });
    st.addEventListener('pointermove', e => { if (!ptr || ptr.id !== e.pointerId) return; ptr.x = e.clientX; ptr.y = e.clientY; if (Math.hypot(e.clientX - ptr.x0, e.clientY - ptr.y0) > 14) ptr.hold = true; });
    const up = e => {
      if (!ptr || ptr.id !== e.pointerId) return;
      const q = ptr; ptr = null;
      if (!q.world) { if (q.dead || e.type === 'pointercancel' || !$('#choice').hidden || I.battle.active || U.menuOpen) return; I.input.emit('ok'); return; }
      if (!free()) return;
      if (q.hold || e.type === 'pointercancel') W.stop(); else { const p = where(e); W.tap(p[0], p[1]); }
    };
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
    // hors de la scène (sur un écran en hauteur, toute la zone sous l'image) : toucher fait avancer le texte, comme toucher la scène
    document.addEventListener('pointerup', e => {
      const t = e.target; if (e.button || (t !== document.body && t !== document.documentElement && t.id !== 'app')) return;
      I.audio.unlock();
      if (U.menuOpen || I.battle.active || I.debug.auto || !$('#choice').hidden || $('#dialog').hidden) return;
      I.input.emit('ok');
    });
    // doigt maintenu : le héros le suit
    U.pointerTick = now => {
      if (!ptr || !ptr.world) return;
      if (!free()) { ptr.world = false; ptr.dead = true; return; }
      if (!ptr.hold && now - ptr.t0 > 280) ptr.hold = true;
      if (ptr.hold && now - ptr.last > 110 && !(I.build && I.build.on)) { ptr.last = now; const p = where({ clientX: ptr.x, clientY: ptr.y }); W.goTo(p[0], p[1], { quiet: true }); }
    };
  }
  U.boot = function () {
    cvEl = $('#cv'); G.init(cvEl); layout(); window.addEventListener('resize', layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe($('#app'));
    I.save.load(); I.audio.on = I.save.data.opts.sound !== false; I.audio.musicOn = I.save.data.opts.music !== false; if (I.save.data.opts.low) { G.low = true; G.resize(); }
    U.applyOpts();
    I.input.push(a => W.onInput(a));
    document.addEventListener('visibilitychange', () => { if (document.hidden && I.scene === W && W.map && W.saga && !S.busy && !W.lock && !I.debug.auto) W.checkpoint(); });
    $('#dialog').addEventListener('click', () => I.input.emit('ok'));
    $('#card').addEventListener('click', () => I.input.emit('ok'));
    $('#battle .banner').addEventListener('click', () => I.input.emit('ok'));
    $('#menubtn').addEventListener('click', e => { e.stopPropagation(); if (I.scene === W && !S.busy) U.pause(); });
    $('#buildbtn').addEventListener('click', e => { e.stopPropagation(); W.stop(); I.build.set(!I.build.on); });
    $('#helpbtn').addEventListener('click', e => { e.stopPropagation(); W.stop(); U.guide(); });
    pad(); pointer();
    // tout geste déverrouille ou relance le son, y compris un toucher sur un bouton de menu (qui ne passe pas par les commandes du jeu)
    ['pointerup', 'touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, () => I.audio.unlock(), true));
    $('#secours button').addEventListener('click', ev => { ev.stopPropagation(); U.secours(); });
    I.onError = msg => { if (!I.debug.auto) S.toast('Incident technique (le jeu continue) : <b>' + I.esc(msg.slice(0, 90)) + '</b>', 7000); };
    let last = performance.now();
    (function frame(now) {
      I.audio.pump(); // la musique avance aussi à chaque image
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const sc = I.scene;
      if (sc) { try {
        if ((document.body.classList.contains('portrait') && (sc === W || I.battle.active)) !== !!U.zoom || (U.zoom && (sc === W) !== U.zoomW)) { U.zoomW = sc === W; layout(); }
        if (I.debug.walk && sc === W) { for (let i = 0; i < 40 && I.scene === W; i++) { if (!S.busy && !W.lock) { if (I.debug.walk === 'tap') W.tapStep(); else W.walkStep(); } W.update(1 / 60); } I.input.clearHeld(); }
        else { U.pointerTick(now); if (sc.update) sc.update(dt); }
        G.present(dt, sc.render(dt) || {});
      } catch (e) { if (!U._err) U._err = e; I.report(e, 'affichage'); } }
      if ((U._vf = (U._vf || 0) + 1) % 30 === 0) U.veille(now);
      if ((U._nf = (U._nf || 0) + 1) % 3 === 0) U.noms(now);
      const tx = U.zoom ? -G.view.x * U.scale : 0; if (tx !== U._tx) { U._tx = tx; cvEl.style.transform = tx ? 'translateX(' + tx + 'px)' : ''; }
      $('#menubtn').hidden = !(I.scene === W && !S.busy && !$('#hud').hidden); $('#helpbtn').hidden = $('#menubtn').hidden;
      $('#buildbtn').hidden = $('#menubtn').hidden || !W.saga || (W.saga.frame && !W.saga.veillees) || !I.build.outdoor(W.map.id);
      if (I.build.on) $('#buildbar').hidden = S.busy || I.scene !== W;
      I.trade.drawCompass(now / 1000);
      requestAnimationFrame(frame);
    })(last);
    const go = () => U.showTitle();
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.load('700 40px "Reem Kufi"', 'عمر').catch(() => {}), new Promise(r => setTimeout(r, 1500))]).then(go); else go();
  };
})();
