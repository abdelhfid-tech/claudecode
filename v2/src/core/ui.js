/* ISNAD — écrans (titre, Chaîne, menu, codex), boucle principale, mise en page, manette tactile. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world, $ = I.$;
  const U = I.ui = { menuOpen: false };
  I.setScene = s => { I.scene = s; };

  /* ---------- scènes de fond ---------- */
  let titleBg = null;
  function paintTitle() {
    const cv = G.toile(G.PW, G.PH), c = cv.getContext('2d'), H0 = 136, r = I.rng(77);
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
    const quand = t => { const m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? I.t('à l’instant') : m < 60 ? I.t('il y a {n} min', { n: m }) : m < 1440 ? I.t('il y a {n} h', { n: Math.round(m / 60) }) : I.t('le {date}', { date: new Date(t).toLocaleDateString(I.langue.locale(), { day: '2-digit', month: '2-digit' }) }); };
    const close = () => { fl.destroy(); screen('#title', false); I.audio.stopBeat(); };
    const btns = [];
    // la partie se garde toute seule : « Continuer » la reprend là où elle en était ; les copies gardées à la mosquée restent disponibles
    if (auto) btns.push(mk(I.t('Continuer') + '<small>' + I.esc((auto.meta && auto.meta.label) || I.t('Partie en cours')) + ' · ' + quand((auto.meta && auto.meta.when) || 0) + '</small>', () => { close(); I.save.readAuto(); U.resume(); }));
    if (has) btns.push(mk(auto ? I.t('Reprendre une copie gardée') : I.t('Continuer'), async () => { close(); const ok = await U.loadMenu(); if (ok) U.resume(); else U.showTitle(); }));
    btns.push(mk(I.t('Nouvelle partie'), async b => {
      close();
      if (auto && (auto.prologue || auto.cp || (auto.cps && Object.keys(auto.cps).length))) { I.setScene(U.blank); S.depth++; let k = 1; try { k = await S.menuPick(I.t('Une partie est en cours. En commencer une nouvelle la remplacera ; les copies gardées à la mosquée restent.'), [{ t: I.t('Commencer une nouvelle partie') }, { t: I.t('Garder ma partie') }]); } finally { S.depth--; S.hideDialog(); } if (k !== 0) return U.showTitle(); }
      I.save.reset(); I.save.data.started = true; if (I.lecons) I.lecons.ouvrir(); W.roster = {}; W.saga = null; U.personnage(() => W.startChapter('idris', 0), true); // 2.x : une partie neuve apprend un outil à la fois (lecons.js)
    }));
    btns.push(mk(I.audio.on ? I.t('Son : activé') : I.t('Son : coupé'), b => { I.audio.setOn(!I.audio.on); sv.opts.sound = I.audio.on; I.save.store(); b.textContent = I.audio.on ? I.t('Son : activé') : I.t('Son : coupé'); }));
    btns.push(mk(I.audio.musicOn ? I.t('Musique : activée') : I.t('Musique : coupée'), b => { I.audio.setMusic(!I.audio.musicOn); sv.opts.music = I.audio.musicOn; I.save.store(); b.textContent = I.audio.musicOn ? I.t('Musique : activée') : I.t('Musique : coupée'); }));
    btns.push(mk(I.t('Dessin : {nom}', { nom: dessinNom() }), b => { dessinSuivant(); b.textContent = I.t('Dessin : {nom}', { nom: dessinNom() }); }));
    btns.push(mk(G.low ? I.t('Rendu : 2D simple') : I.t('Rendu : rétro-HD'), b => { G.low = !G.low; G._slow = 0; sv.opts.low = G.low; I.save.store(); G.resize(); b.textContent = G.low ? I.t('Rendu : 2D simple') : I.t('Rendu : rétro-HD'); }));
    btns.push(mk(I.t('Texte : {taille}', { taille: I.t(U.TZ[U.tz()][0]) }), b => { U.tzSuivant(); b.textContent = I.t('Texte : {taille}', { taille: I.t(U.TZ[U.tz()][0]) }); }));
    btns.push(mk(I.t('Image : {zoom}', { zoom: zoomNom() }), b => { U.zoomSuivant(); b.textContent = I.t('Image : {zoom}', { zoom: zoomNom() }); }));
    btns.push(mk(I.t('Plein écran'), () => { const e = document.documentElement; try { (document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen()).catch(() => {}); } catch (e2) { /* indisponible */ } }));
    { const v = $('#title .ver'); if (v) v.textContent = window.ISNAD_VERSION ? I.t('version {v}', { v: window.ISNAD_VERSION }) : I.t('version de travail'); }
    // importer une partie : dans un coin, hors de la colonne — l'écran-titre garde la hauteur qu'il a toujours eue
    { let coin = $('#title .coin'); if (!coin) { coin = I.el('div', 'coin'); $('#title').appendChild(coin); } coin.innerHTML = '';
      const b = I.el('button', '', I.t('Importer une partie')); b.type = 'button'; tapable(b, () => { I.audio.unlock(); close(); U.partie('importer', () => U.showTitle()); }); coin.appendChild(b); btns.push(b); }
    // la langue : quatre boutons, chacun écrit dans sa langue — on le retrouve même sans savoir lire celle de l'écran
    { let lg = $('#title .langues'); if (!lg) { lg = I.el('div', 'langues'); $('#title').appendChild(lg); } lg.innerHTML = ''; const L = I.langue; lg.hidden = L.disponibles().length < 2; $('#title').classList.toggle('multilingue', !lg.hidden);   // une seule langue : pas de boutons
      L.disponibles().forEach(l => { const b = I.el('button', l === L.lang ? 'on' : '', L.LANGUES[l].nom); b.type = 'button'; b.lang = l; b.dir = L.LANGUES[l].dir; b.setAttribute('aria-pressed', l === L.lang ? 'true' : 'false');
        tapable(b, () => { I.audio.unlock(); if (l === L.lang) return; U.langue(l); fl.destroy(); U.showTitle(); }); lg.appendChild(b); btns.push(b); }); }
    screen('#title', true); fl = focusList(btns);
  };
  /* ---------- la langue ----------
     Un réglage de l'appareil (opts.lang), comme le son ou le dessin : la partie, elle, est la même dans toutes les langues.
     En cours de récit, les personnages du lieu portent déjà leur nom : on reprend au point de reprise, dans la langue choisie. */
  U.langue = function (l) { const o = I.save.data.opts; o.lang = I.langue.choisir(l); I.save.store(); U.applyOpts(); return o.lang; };
  U.choisirLangue = async function () {
    const L = I.langue, enJeu = I.scene === W && !!W.map && !!W.saga && !W.excursion; let k = -1;
    S.depth++; try { k = await S.menuPick(I.t('Dans quelle langue ?'), L.disponibles().map(l => ({ t: L.LANGUES[l].nom }))); } finally { S.depth--; S.hideDialog(); }
    const l = L.disponibles()[k]; if (!l || l === L.lang) return;
    if (enJeu) W.checkpoint(); U.langue(l);
    if (enJeu) return U.resume();
  };
  const slotLabel = (d, n) => d ? I.t('Emplacement {n} · {label} · {date} {heure}', { n, label: I.esc((d.meta && d.meta.label) || I.t('Partie')), date: new Date((d.meta && d.meta.when) || 0).toLocaleDateString(I.langue.locale(), { day: '2-digit', month: '2-digit' }), heure: new Date((d.meta && d.meta.when) || 0).toLocaleTimeString(I.langue.locale(), { hour: '2-digit', minute: '2-digit' }) }) : I.t('Emplacement {n} · vide', { n });
  U.saveMenu = async function () {
    const slots = I.save.slots(), opts = slots.map((d, i) => ({ t: slotLabel(d, i + 1) })).concat([{ t: I.t('Annuler') }]);
    S.depth++;
    try {
      const i = I.debug.auto ? 2 : await S.menuPick(I.t('Garder une copie sur quel emplacement ? (La partie se sauvegarde déjà toute seule.)'), opts);
      if (i > 2) return false;
      const inWorld = I.scene === W && W.map; if (inWorld) W.checkpoint();
      const lead = W.saga && W.party.length ? W.hero(W.party[0]) : null;
      const label = inWorld && W.saga ? `${W.saga.name} · ${W.ch.title}${lead ? ' · niv. ' + lead.lvl : ''}` : `La Chaîne · ${I.save.data.lights.filter(l => l !== 'sabr').length} Lumière(s)`;
      const ok = I.save.write(i + 1, { label }); if (ok) { W.unsaved = 0; W._warned = false; }
      I.audio.sfx(ok ? 'roll' : 'dark'); G.flash('#fff3c8');
      if (inWorld) for (let k = 0; k < 40; k++) G.spawn({ x: W.player.x - W.cam.x, y: W.player.y - W.cam.y - 6, vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.8) * 120, life: 1.2, size: 0.9, color: '#ffe9a8', type: 'spark' });
      S.toast(ok ? I.t('<b>Copie gardée</b> · emplacement {n}', { n: i + 1 }) : I.t('La copie a échoué : le stockage du navigateur est indisponible.'), 3600);
      return ok;
    } finally { S.depth--; S.hideDialog(); }
  };
  U.loadMenu = async function () {
    const slots = I.save.slots(), idx = slots.map((d, i) => d ? i : -1).filter(i => i >= 0);
    if (!idx.length) return false;
    I.setScene(U.blank);
    S.depth++;
    try { const k = await S.menuPick(I.t('Reprendre quelle copie ?'), idx.map(i => ({ t: slotLabel(slots[i], i + 1) })).concat([{ t: I.t('Retour') }])); if (k >= idx.length) return false; return I.save.read(idx[k] + 1); }
    finally { S.depth--; S.hideDialog(); }
  };
  // Une partie adoptée peut citer un contenu que ce jeu n'a pas (I.save.avis) : on le dit, une fois, là où l'on reprend.
  const avisAbsent = A => { if (!A || !(A.paquets.length || A.reprise || A.pieces)) return '';
    return (A.paquets.length ? I.t('Cette partie cite un contenu que ce jeu n’a pas ({paquets}).', { paquets: A.paquets.map(I.esc).join(', ') }) : I.t('Cette partie cite un contenu que ce jeu n’a pas.')) + ' ' + I.t('Ce qui en dépend est mis de côté, sans être perdu : il reviendra avec lui.') + (A.reprise ? ' ' + I.t('Tu reprends à la Chaîne.') : ''); };
  U.resume = function () {
    const sv = I.save.data, dit = avisAbsent(I.save.avis); I.save.avis = null;
    if (sv.cp && I.sagas[sv.cp.saga]) { W.roster = {}; W.saga = null; const p = W.startChapter(sv.cp.saga, sv.cp.ci, sv.cp); if (dit) S.toast(dit, 14000); return p; }
    if (!sv.prologue) { W.roster = {}; W.saga = null; const cp = W.reprise('idris', 0); return W.startChapter('idris', 0, cp || undefined); } // le prologue, quitté en chemin, se reprend là
    return U.showChain(dit || undefined);
  };
  /* ---------- ton personnage : le nom et la tenue du râwî ----------
     Au début d'une partie (debut), « Idris » et sa tenue de toujours sont déjà choisis : un toucher suffit à commencer.
     Le nom est contrôlé à chaque lettre (I.perso.refus) ; une tenue est l'une de celles de D.TENUES, montrée de face et de
     profil telle que le moteur la dessine. retour(change) : true si le joueur a validé. */
  U.personnage = function (retour, debut) {
    const P = I.perso, box = $('#perso .corps'), p0 = P.profil(); let tenue = p0.tenue, fl = null;
    const fermer = () => { if (fl) fl.destroy(); fl = null; screen('#perso', false); U.menuOpen = false; }, quitter = v => { fermer(); retour(v); };
    const bouton = (label, fn, cls) => { const b = I.el('button', cls || '', label); b.type = 'button'; tapable(b, () => fn(b)); return b; };
    const figure = (t, dir) => G.charURL(Object.assign({ kind: 'compagnon' }, P.look(t)), dir);
    $('#perso header p').textContent = debut ? I.t('Avant de descendre aux Archives : comment s’appelle ton râwî, et que porte-t-il ? Tu pourras en changer plus tard.') : I.t('Le nom et la tenue de ton râwî. Les Compagnons, eux, gardent leur nom et leur silhouette.');
    box.innerHTML = '';
    const vue = I.el('div', 'vue'), deux = I.el('div', 'deux'), face = new Image(), profil = new Image(), qui = I.el('div', 'qui'), sous = I.el('div', 'sous'), texte = I.el('div');
    face.alt = ''; profil.alt = ''; deux.appendChild(face); deux.appendChild(profil); texte.appendChild(qui); texte.appendChild(sous); vue.appendChild(deux); vue.appendChild(texte);
    const choix = I.el('div', 'choix'), ligne = I.el('div', 'saisie'), champ = document.createElement('input'), note = I.el('p', 'note', ''), grille = I.el('div', 'tenues');
    champ.type = 'text'; champ.maxLength = P.MAX; champ.value = p0.nom; champ.autocomplete = 'off'; champ.spellcheck = false; champ.autocapitalize = 'words'; champ.enterKeyHint = 'done'; champ.id = 'perso-nom'; champ.setAttribute('aria-label', I.t('Nom du râwî'));
    const lab1 = I.el('label', '', I.t('Son nom')), lab2 = I.el('label', '', I.t('Sa tenue')); lab1.htmlFor = 'perso-nom';
    const bNom = bouton(I.t('Écrire'), () => { champ.focus(); champ.select(); });
    const bt = D.TENUES.map(t => { const b = bouton(`<img alt="" src="${figure(t, 0)}"><span>${I.esc(t.nom)}</span>`, () => { tenue = t.id; peindre(); }, 'tenue'); grille.appendChild(b); return b; });
    const valider = () => { const r = P.choisir(champ.value, tenue); if (r) { peindre(); I.audio.sfx('dark'); return; } I.audio.sfx('roll'); quitter(true); };
    const bOk = bouton(debut ? I.t('Commencer') : I.t('Garder'), valider, 'fort ok'), bR = debut ? null : bouton(I.t('◂ Retour'), () => quitter(false));
    function peindre() { const t = P.tenue(tenue), r = P.refus(champ.value); face.src = figure(t, 0); profil.src = figure(t, 1); qui.textContent = r ? '…' : P.propre(champ.value); sous.textContent = t.nom;
      bt.forEach((b, i) => b.classList.toggle('choisie', D.TENUES[i].id === tenue)); note.textContent = r; note.className = 'note' + (r ? ' ko' : ''); bOk.disabled = !!r; }
    champ.addEventListener('input', peindre);
    champ.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); champ.blur(); } else if (e.key === 'Escape') { champ.blur(); } });
    ligne.appendChild(champ); ligne.appendChild(bNom);
    const rang = I.el('div', 'rang'); rang.appendChild(bOk); if (bR) rang.appendChild(bR);
    [lab1, ligne, note, lab2, grille, rang].forEach(e => choix.appendChild(e)); box.appendChild(vue); box.appendChild(choix);
    const liste = [bOk].concat(bR ? [bR] : [], [bNom], bt);
    U.menuOpen = true; I.input.clearHeld(); screen('#perso', true); $('#perso').scrollTop = 0; peindre();
    fl = focusList(liste, { onCancel: bR ? () => quitter(false) : null, start: 0 });
  };
  /* ---------- ta partie : l'exporter, l'importer ----------
     Exporter : la partie en un texte, à enregistrer en fichier ou à copier. Importer : coller le texte ou choisir le
     fichier ; le texte est contrôlé (I.save.lireTexte), on montre ce qu'il contient, et rien ne change avant le oui. */
  U.partie = function (mode, retour) {
    const box = $('#partie .corps'), tete = $('#partie header p'); let fl = null;
    const fermer = () => { if (fl) fl.destroy(); fl = null; screen('#partie', false); U.menuOpen = false; }, revenir = () => { fermer(); retour(); };
    const bouton = (label, fn, cls) => { const b = I.el('button', cls || '', label); b.type = 'button'; tapable(b, () => fn(b)); return b; };
    const jour = t => (t ? I.t('gardée le {date} à {heure}', { date: new Date(t).toLocaleDateString(I.langue.locale(), { day: '2-digit', month: '2-digit', year: 'numeric' }), heure: new Date(t).toLocaleTimeString(I.langue.locale(), { hour: '2-digit', minute: '2-digit' }) }) : I.t('gardée le à une date inconnue'));
    const pl = (n, un, des) => n + ' ' + (n > 1 ? des : un);
    const poser = (enfants, btns, debut) => { box.innerHTML = ''; enfants.forEach(e => box.appendChild(e)); if (fl) fl.destroy(); fl = focusList(btns, { onCancel: revenir, start: debut || 0 }); $('#partie').scrollTop = 0; };
    const rangee = btns => { const r = I.el('div', 'rang'); btns.forEach(b => r.appendChild(b)); return r; };
    const zone = (lu, dit) => { const ta = I.el('textarea'); ta.spellcheck = false; ta.readOnly = !!lu; ta.setAttribute('aria-label', dit); ta.autocapitalize = 'off'; ta.autocomplete = 'off'; return ta; };
    const exporter = () => {
      const sv = I.save.data, texte = I.save.exporter(), ta = zone(true, I.t('Ta partie, en texte')), note = I.el('p', 'note', ''); ta.value = texte;
      // Dans un Artifact, la page ne peut pas remettre un fichier au joueur : le bouton n'y serait qu'un leurre. On n'y propose que la copie.
      const sansFichier = !!(window.claude && window.claude.hot);
      tete.innerHTML = I.t('Ta partie tient dans ce texte.') + ' ' + (sansFichier ? I.t('Copie-le et garde-le en lieu sûr, ou porte-le sur un autre appareil : l’écran-titre propose <b>Importer une partie</b>.') : I.t('Garde-le en lieu sûr, ou porte-le sur un autre appareil : l’écran-titre propose <b>Importer une partie</b>.'));
      const dire = (ok, m) => { note.className = 'note ' + (ok ? 'ok' : 'ko'); note.textContent = m; };
      const bF = bouton(I.t('Enregistrer le fichier'), () => { try { const a = document.createElement('a'), u = URL.createObjectURL(new Blob([texte], { type: 'application/json' })); a.href = u; a.download = 'isnad-partie.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000);
        dire(true, I.t('Fichier « isnad-partie.json » remis au navigateur. S’il n’apparaît pas, copie le texte.')); } catch (e) { dire(false, I.t('Ce navigateur ne laisse pas enregistrer un fichier ici. Copie le texte.')); } });
      const bC = bouton(I.t('Copier le texte'), async () => { let ok = false; try { await navigator.clipboard.writeText(texte); ok = true; } catch (e) { try { ta.focus(); ta.select(); ok = document.execCommand('copy'); } catch (x) { ok = false; } }
        if (ok) dire(true, I.t('Texte copié. Colle-le dans une note ou un message pour le garder.')); else { ta.focus(); ta.select(); dire(false, I.t('La copie n’a pas pu se faire : le texte est sélectionné, copie-le à la main.')); } });
      const bR = bouton(I.t('◂ Retour'), revenir);
      const faits = I.save.maillons().length;
      poser([I.el('p', 'resume', `<b>${I.esc((sv.meta && sv.meta.label) || I.t('Partie en cours'))}</b><br>${I.t('{n} Lumière¦{n} Lumières', { n: sv.lights.filter(l => l !== 'sabr').length })} · ${I.t('{n} maillon achevé¦{n} maillons achevés', { n: faits })} · ${I.t('{n} savoir¦{n} savoirs', { n: sv.codex.length })}<br><small>${I.t('{ko} Ko de texte', { ko: (texte.length / 1024).toFixed(0) })} · ${I.t('format {format}', { format: I.save.FORMAT })}</small>`), rangee(sansFichier ? [bC, bR] : [bF, bC, bR]), note, ta], sansFichier ? [bC, bR] : [bF, bC, bR]);
    };
    const confirmer = r => {
      const R = r.resume, ici = !!(I.save.autoGet() || I.save.slots().some(Boolean));
      tete.innerHTML = I.t('Cette partie peut être reprise ici.');
      const lignes = [`<b>${I.esc(R.etiquette || I.t('Partie'))}</b> · ${jour(R.quand)}`, `${I.t('{n} Lumière¦{n} Lumières', { n: R.lumieres })} · ${I.t('{n} maillon achevé¦{n} maillons achevés', { n: R.maillons })}` + (R.format !== I.save.FORMAT ? ` <small>· ${I.t('partie d’un format plus ancien ({format}), remise à jour', { format: I.esc(String(R.format)) })}</small>` : '')];
      if (R.absents.length) lignes.push(I.t('Elle cite un contenu que ce jeu n’a pas : {absents}. Ce qui en dépend sera mis de côté, sans être perdu.', { absents: R.absents.map(I.esc).join(', ') }));
      if (ici) lignes.push('<small>' + I.t('La partie en cours sur cet appareil sera remplacée. Les copies gardées à la mosquée restent.') + '</small>');
      const bO = bouton(ici ? I.t('Remplacer ma partie par celle-ci') : I.t('Reprendre cette partie'), () => { I.save.adopter(r.partie); I.save.auto(R.etiquette || 'Partie importée'); I.audio.sfx('roll'); fermer(); U.resume(); }, 'fort');
      const bN = bouton(I.t('Annuler'), () => importer());
      poser([I.el('p', 'resume', lignes.join('<br>')), rangee([bO, bN])], [bO, bN], ici ? 1 : 0);   // s'il y a une partie à remplacer, le choix proposé d'abord est « Annuler »
    };
    const importer = garde => {
      tete.innerHTML = I.t('Colle ici le texte d’une partie exportée, ou choisis son fichier. Rien ne change tant que tu n’as pas confirmé.');
      const ta = zone(false, I.t('Texte de la partie à importer')), note = I.el('p', 'note', ''), fi = document.createElement('input'); ta.placeholder = I.t('Le texte de la partie…'); if (garde) ta.value = garde;
      fi.type = 'file'; fi.accept = '.json,application/json,text/plain'; fi.hidden = true;
      const lire = () => { const r = I.save.lireTexte(ta.value); if (!r.ok) { note.className = 'note ko'; note.textContent = r.erreur; I.audio.sfx('dark'); return; } I.audio.sfx('ok'); confirmer(r); };
      fi.addEventListener('change', () => { const f = fi.files && fi.files[0]; if (!f) return; if (f.size > 2000000) { note.className = 'note ko'; note.textContent = I.t('Ce fichier est trop gros pour être une partie.'); return; }
        const rd = new FileReader(); rd.onload = () => { ta.value = String(rd.result || ''); lire(); }; rd.onerror = () => { note.className = 'note ko'; note.textContent = I.t('Le fichier n’a pas pu être lu.'); }; rd.readAsText(f); });
      const bL = bouton(I.t('Lire cette partie'), lire, 'fort'), bF = bouton(I.t('Choisir un fichier'), () => fi.click()), bR = bouton(I.t('◂ Retour'), revenir);
      poser([ta, fi, rangee([bL, bF, bR]), note], [bL, bF, bR]);
    };
    U.menuOpen = true; I.input.clearHeld(); screen('#partie', true); if (mode === 'importer') importer(); else exporter();
  };

  /* ---------- la Chaîne (choix de saga) ---------- */
  U.showChain = async function (msg) {
    I.setScene(U.blank); G.clearParts(); G.amb = { kind: 'noos', rate: 5, hue: 40, n: 0 }; I.audio.stopBeat(); I.audio.scene('chaine');
    $('#hud').hidden = true; document.body.dataset.theme = 'orient'; S.hideDialog(); $('#toasts').innerHTML = '';
    const sv = I.save.data, box = $('#chain .links'); box.innerHTML = '';
    // Les livres. Le livre I : ses maillons, puis le dernier maillon, qui s'ouvre quand les siens sont achevés. Les autres
    // livres viennent ensuite, chacun sous son titre. Avec un seul livre, aucun titre : c'est l'écran de toujours.
    const livres = I.livres(), fait = s => !!(sv.sagas[s.id] && sv.sagas[s.id].done), un = livres.find(L => L.n === 1) || { n: 1, titre: '', sagas: [] }, autres = livres.filter(L => L.n !== 1);
    const allDone = un.sagas.every(fait), nb = I.enLettres(un.sagas.length);
    $('#chain header p').innerHTML = msg || (allDone ? I.t('Les {nombre} Lumières sont réunies. Le dernier maillon t’attend : le tien.', { nombre: nb, n: un.sagas.length }) : I.t('Chaque maillon est un témoin. Choisis celui dont tu veux suivre la trace ; l’ordre est libre, mais la Chaîne se lit du premier au dernier.'));
    const btns = []; let fl;
    const close = () => { fl.destroy(); screen('#chain', false); };
    const tactile = document.body.classList.contains('touch');
    // le maillon à ouvrir : ceux du livre I d'abord, puis le dernier maillon, puis ceux des autres livres
    const suivant = un.sagas.find(s => !fait(s)) || ((sv.epilogue || !I.sagas.idris) && autres.reduce((r, L) => r || L.sagas.find(s => !fait(s)), null)) || null;
    const rang = s => { const L = livres.find(x => x.sagas.includes(s)), r = I.romain(L.sagas.indexOf(s) + 1); return L.n === 1 ? I.t('▶ Ouvrir le maillon {rang} : {nom}', { rang: r, nom: I.esc(s.name) }) : I.t('▶ Ouvrir le maillon {rang} du livre {livre} : {nom}', { rang: r, livre: I.romain(L.n), nom: I.esc(s.name) }); };
    const ouvrir = s => { close(); U.startSaga(s); }, dernier = () => { close(); W.roster = {}; W.saga = null; W.startChapter('idris', 1); };
    // un grand bouton dit quoi faire : ouvrir le maillon suivant (ou reprendre celui qui est entamé)
    // 2.x : les récits quittés en chemin (points de reprise rangés). Le plus récent passe devant : on le reprend d'un toucher.
    const rangees = W.rangees(), enRoute = id => rangees.find(c => c.saga === id) || null;
    const reprendre = c => { close(); const sg = I.sagas[c.saga]; if (!sg.frame) return U.startSaga(sg); W.roster = {}; W.saga = null; const cp = W.reprise(c.saga, c.ci); return W.startChapter(c.saga, c.ci, cp || undefined); };
    { const hd = $('#chain header'); let go = hd.querySelector('.go'); if (!go) { go = I.el('div', 'go'); hd.appendChild(go); } go.innerHTML = '';
      if (rangees.length) { const c = rangees[0], sg = I.sagas[c.saga], chp = sg.chapters[c.ci];
        const b = I.el('button', 'cta', sg.veillees ? I.t('▶ Reprendre : la veillée · {chapitre}', { chapitre: I.esc(chp.title) }) : I.t('▶ Reprendre : {recit} · {chapitre}', { recit: I.esc(sg.frame ? I.perso.dit() : sg.name), chapitre: I.esc(chp.title) })); b.type = 'button';
        if (!sg.frame) b.style.setProperty('--c', D.ELEMENTS[sg.light].color); tapable(b, () => reprendre(c)); go.appendChild(b); btns.push(b); }
      const s = suivant && !(rangees.length && rangees[0].saga === suivant.id) ? suivant : null, sp = s ? (sv.sagas[s.id] || { ch: 0 }) : null; // (le récit que le premier bouton reprend déjà n'est pas offert deux fois)
      if (s || (allDone && !suivant)) { const b = I.el('button', 'cta', s ? ((sp.ch > 0 || enRoute(s.id)) ? I.t('▶ Reprendre : {recit} · chapitre {n}', { recit: I.esc(s.name), n: sp.ch + 1 }) : rang(s)) : (sv.epilogue ? I.t('▶ Rejouer le dernier maillon') : I.t('▶ Ouvrir le dernier maillon : {nom}', { nom: I.esc(I.perso.dit()) }))); b.type = 'button';
        if (s) b.style.setProperty('--c', D.ELEMENTS[s.light].color); tapable(b, () => (s ? ouvrir(s) : dernier())); go.appendChild(b); btns.push(b); }
      go.appendChild(I.el('p', 'comment', (tactile ? I.t('Ou touche le maillon de ton choix, plus bas.') : I.t('Ou clique sur le maillon de ton choix. Au clavier : flèches, puis Entrée.')) + ' ' + I.t('La partie se garde toute seule.'))); }
    const maillon = (s, i) => {
      const sp = sv.sagas[s.id] || { ch: 0, done: false }, e = D.ELEMENTS[s.light];
      const vl = (sv.veillees && sv.veillees[s.id] ? ' · ' + I.t('veillée du Caïd') + ' ✓' : '') + (sv.rencontres && sv.rencontres[s.id] ? ' · ' + I.t('rencontre') + ' ✓' : '');
      const qv = I.oeuvres.viceApres(s.id), qt = qv ? `<span class="qt">⚔ ${I.oeuvres.quete(qv)}</span>` : '';
      const er = !sp.done && enRoute(s.id), route = er ? ' · ' + I.t('en route') : '';
      const st = sp.done ? `<span class="stt done">${e.glyph} ${I.t('{lumiere} retrouvée', { lumiere: s.lightName })}${vl}</span>` : (sp.ch > 0 || er) ? `<span class="stt">${I.t('Chapitre {n} / {total}', { n: sp.ch + 1, total: s.chapters.length })}${route}</span>` : '<span class="stt">' + I.t('Maillon à ouvrir') + '</span>';
      const b = I.el('button', 'link', `<span class="seal" style="background-image:url(${G.sealURL(s.arabic, e.color)})"></span><span class="lt"><span class="ord">${I.t('MAILLON {rang}', { rang: I.romain(i + 1) })} · ${I.esc(s.years)}</span><h3>${I.esc(s.name)}</h3><span class="ep">${I.esc(s.epithet)} <small>· ${I.esc(s.ambiance || '')}</small></span><span class="tl">${I.esc(s.tagline)}</span>${st}${qt}<span class="ouvrir">${sp.done ? I.t('Rejouer') : (sp.ch > 0 || er) ? I.t('Reprendre') : I.t('Ouvrir')} ▸</span></span>`);
      b.type = 'button'; b.style.setProperty('--c', e.color);
      tapable(b, () => ouvrir(s));
      box.appendChild(b); btns.push(b);
    };
    const titreLivre = L => { if (livres.length < 2) return; box.appendChild(I.el('div', 'livre', `<b>${I.t('LIVRE {rang}', { rang: I.romain(L.n) })}</b>${L.titre ? ' · ' + I.esc(L.titre) : ''}<small>${I.t('{faits} / {n} maillon¦{faits} / {n} maillons', { faits: L.sagas.filter(fait).length, n: L.sagas.length })}</small>`)); };
    titreLivre(un); un.sagas.forEach(maillon);
    const fr = I.sagas.idris;
    if (fr) {
      const b = I.el('button', 'link' + (allDone ? '' : ' locked'), `<span class="seal" style="background-image:url(${G.sealURL('إسناد', '#39e6ff')})"></span><span class="lt"><span class="ord">${I.t('DERNIER MAILLON · 1507 H · 2084')}</span><h3>${I.esc(I.perso.dit())}</h3><span class="ep">${I.t('Le Cœur de l’Agrégor')} <small>· ${I.t('2084')}</small></span><span class="tl">${allDone ? I.t('Rapporter les {nombre} Lumières à la Cité-Miroir.', { nombre: nb, n: un.sagas.length }) : I.t('Scellé tant que les {nombre} Lumières ne sont pas réunies.', { nombre: nb, n: un.sagas.length })}</span><span class="stt${sv.epilogue ? ' done' : ''}">${sv.epilogue ? I.t('Chaîne transmise') : allDone ? I.t('Ouvert') : I.t('{faits} / {n} Lumières', { faits: un.sagas.filter(fait).length, n: un.sagas.length })}</span></span>`);
      b.type = 'button'; b.style.setProperty('--c', '#39e6ff'); b.disabled = !allDone && !I.debug.all;
      tapable(b, dernier);
      box.appendChild(b); btns.push(b);
    }
    autres.forEach(L => { titreLivre(L); L.sagas.forEach(maillon); });
    const foot = $('#chain .chainfoot'); foot.innerHTML = '';
    foot.appendChild(I.el('span', 'lights', I.t('Lumières') + ' ' + Object.keys(D.ELEMENTS).filter(k => k !== 'fer').map(k => `<i class="${sv.lights.includes(k) || (k === 'sabr' && sv.epilogue) ? 'on' : ''}" style="color:${D.ELEMENTS[k].color}" title="${D.ELEMENTS[k].name}">${D.ELEMENTS[k].glyph}</i>`).join('')));
    foot.appendChild(I.el('span', 'pill', I.t('Fidélité à la Chaîne : <b>{ok}</b> / {total}', { ok: sv.isnad.ok, total: sv.isnad.total })));
    if (sv.parley && sv.parley.total) foot.appendChild(I.el('span', 'pill', I.t('Pourparlers réussis : <b>{reussis}</b> / {total}', { reussis: sv.parley.won, total: sv.parley.total })));
    if (I.sagas.caid && Object.keys(sv.veillees || {}).length) foot.appendChild(I.el('span', 'pill', I.t('Citadelle du Caïd : {piliers}', { piliers: Object.keys(D.PILLARS).map(k => `${D.PILLARS[k].glyph} <b>${sv.citadel[k]}</b>`).join(' · ') })));
    { const d = I.oeuvres.state(), nl = Object.keys(d.lames).length, nv = Object.keys(d.vices).filter(v => d.vices[v] === 'tranche').length; if (nl || nv || d.zad) foot.appendChild(I.el('span', 'pill', I.t('Lames : <b>{lames}</b> / 7 · maux tranchés : <b>{maux}</b> / 7 · ♥ {zad}', { lames: nl, maux: nv, zad: d.zad }))); }
    const pied = (label, fn) => { const b = I.el('button', '', label); b.type = 'button'; tapable(b, fn); foot.appendChild(b); btns.push(b); };
    { const fr2 = I.sagas.idris, vi = fr2 ? fr2.chapters.findIndex(c => c.visite === 'citadelle') : -1; // 2.x : la Citadelle, en 2084
      if (vi >= 0 && I.sagas.caid && Object.keys(sv.veillees || {}).some(k => sv.veillees[k])) pied(I.t('La Citadelle'), () => { close(); W.roster = {}; W.saga = null; const cp = W.reprise('idris', vi); W.startChapter('idris', vi, cp || undefined); }); }
    pied(I.t('Garder une copie'), async () => { close(); await U.saveMenu(); U.showChain(); });
    pied(I.t('Exporter la partie'), () => { close(); U.partie('exporter', () => U.showChain()); });
    pied(I.t('Ton personnage'), () => { close(); U.personnage(() => U.showChain()); });
    pied(I.t('Recueil'), () => { close(); U.pause('codex', () => U.showChain()); });
    pied(I.t('Aide'), () => { close(); U.pause('aide', () => U.showChain()); });
    pied(I.t('Les degrés du mal'), () => { close(); U.pause('mal', () => U.showChain()); });
    pied(I.t('Écran-titre'), () => { close(); U.showTitle(); });
    foot.appendChild(I.el('span', 'ver', window.ISNAD_VERSION ? I.t('version {v}', { v: window.ISNAD_VERSION }) : I.t('version de travail')));
    screen('#chain', true); $('#chain').scrollTop = 0;
    fl = focusList(btns, { start: 0 });
    if (!sv.cp) I.save.auto('La Chaîne · ' + sv.lights.filter(l => l !== 'sabr').length + ' Lumière(s)'); // entre deux maillons : la partie est gardée ici
  };
  U.startSaga = async function (s) {
    const sv = I.save.data, sp = sv.sagas[s.id] || (sv.sagas[s.id] = { ch: 0, done: false, flags: {} });
    W.roster = {}; W.saga = s; S.flags = {};
    let ci = sp.done ? 0 : sp.ch;
    if (sp.done) { sp.ch = 0; sp.flags = {}; if (sv.cps) delete sv.cps[s.id]; }
    else W.reprise(s.id); // 2.x : ce récit, quitté en chemin, reprend là où on l'a laissé — même si l'on en a joué un autre depuis
    if (ci === 0 && !(sv.cp && sv.cp.saga === s.id && sv.cp.obj > 0)) { sp.cOk = 0; sp.cTot = 0; }
    const resume0 = sv.cp && sv.cp.saga === s.id && sv.cp.ci === 0 && sv.cp.obj > 0 && !sp.done;
    if (ci === 0 && !resume0) {
      I.setScene(U.blank); document.body.dataset.theme = 'orient';
      S.depth++; try { await S.run([['title', s.name, s.epithet + ' · ' + s.years]].concat(s.intro || [])); } finally { S.depth--; S.hideDialog(); }
    }
    const cp = sv.cp && sv.cp.saga === s.id && sv.cp.ci === ci && ci > 0 ? sv.cp : (sv.cp && sv.cp.saga === s.id && sv.cp.ci === 0 && ci === 0 && sv.cp.obj > 0 ? sv.cp : null);
    await W.startChapter(s.id, ci, cp || undefined);
  };
  /* 2.x — revenir en 2084. Le récit que l'on quitte est rangé (W.ranger) : il se reprendra là. En remontant d'un récit
     des Compagnons ou d'une veillée, il peut s'être passé quelque chose dans la Cité-Miroir : un chapitre de
     l'histoire-cadre marqué « retour: n » se joue au n-ième retour (ou à un retour suivant), une seule fois. */
  const rebond = () => { const sv = I.save.data, fr = I.sagas.idris; if (!fr || !sv.prologue || sv.epilogue) return -1; const fait = sv.rebonds || {}, n = sv.retours || 0;
    let ri = -1, rn = 1e9; fr.chapters.forEach((c, i) => { if (Number.isInteger(c.retour) && !fait[c.id] && c.retour <= n && c.retour < rn) { rn = c.retour; ri = i; } }); return ri; };
  U.rebond = rebond;
  U.partir = async function (ailleurs) {
    const sv = I.save.data; W.ranger(); if (ailleurs) sv.retours = (sv.retours || 0) + 1;
    $('#hud').hidden = true; S.depth++; try { await S.fade('out', 300); } finally { S.depth--; }
    const ri = ailleurs ? rebond() : -1;
    if (ri >= 0) { W.roster = {}; W.saga = null; return W.startChapter('idris', ri); }
    U.showChain(ailleurs ? I.perso.dire(I.t('Idris rouvre les yeux. Les Archives basses, la lampe, la Chaîne. Chaque récit attend là où tu l’as laissé.')) : undefined); return S.fade('in', 300);
  };
  // l'état de 2084, en drapeaux, pour les chapitres de l'histoire-cadre qui se jouent au retour ou en visite : veillées
  // entendues, Lumières reçues, ce que tient la Citadelle. Posés par le moteur ; un récit ne les écrit pas.
  U.drapeaux2084 = function (F) { const sv = I.save.data, c = sv.citadel || {}, tot = (c.priere || 0) + (c.savoir || 0) + (c.justice || 0) + (c.lien || 0);
    Object.keys(F).forEach(k => { if (k.indexOf('_2084_') === 0) delete F[k]; });
    Object.keys(sv.veillees || {}).forEach(k => { if (sv.veillees[k]) F['_2084_veillee_' + k] = true; });
    I.save.maillons().forEach(k => { F['_2084_maillon_' + k] = true; });
    if (tot >= 12) F._2084_debout = true; else if (tot >= 7) F._2084_tient = true; else F._2084_lezarde = true;
    Object.keys(D.PILLARS).forEach(k => { if ((c[k] || 0) >= 3) F['_2084_pilier_' + k] = true; });
    if (W.rangees().some(x => !I.sagas[x.saga].frame)) F._2084_en_route = true;
    return F; };
  // la rencontre de la Cité-Miroir qui suit une saga : chapitre de l'histoire-cadre marqué « after »
  const rencontre = id => { const sv = I.save.data; sv.rencontres = sv.rencontres || {}; const fr = I.sagas.idris; if (!fr || !sv.prologue || sv.rencontres[id]) return -1; return fr.chapters.findIndex(c => c.after === id); };
  // ce qu'il reste à ouvrir dans le livre d'une saga, et ce que l'on dit quand il n'y reste rien
  const duLivre = s => I.sagaList.filter(x => !x.frame && (x.livre || 1) === (s.livre || 1));
  const resteDans = s => duLivre(s).filter(x => !(I.save.data.sagas[x.id] && I.save.data.sagas[x.id].done)).length;
  const finLivre = s => (s.livre || 1) === 1 ? I.t('Les {nombre} Lumières sont réunies.', { nombre: I.enLettres(duLivre(s).length), n: duLivre(s).length }) : I.t('Le livre {livre} est achevé.', { livre: I.romain(s.livre) });
  U.afterSaga = async function (saga, ch) {
    const sv = I.save.data;
    if (saga.veillees) {
      sv.veillees[ch.after] = true; I.save.store(); const c = sv.citadel;
      const ri = rencontre(ch.after); if (ri >= 0) { W.roster = {}; W.saga = null; return W.startChapter('idris', ri); }
      const tot = c.priere + c.savoir + c.justice + c.lien;
      return U.showChain(I.t('La veillée s’achève. La Citadelle du Caïd tient par {piliers}.', { piliers: Object.keys(D.PILLARS).map(k => `${D.PILLARS[k].name.toLowerCase()} ${c[k]}`).join(', ') }) + ' ' + (tot >= 12 ? I.t('Elle est debout dans les cœurs.') : tot >= 7 ? I.t('Elle tient, et demande qu’on la veille.') : I.t('Elle se lézarde : ce qui n’est plus bâti s’effrite.')));
    }
    if (!saga.frame && I.sagas.caid) {
      const vi = I.sagas.caid.chapters.findIndex(c => c.after === saga.id);
      if (vi >= 0 && !(sv.veillees && sv.veillees[saga.id])) {
        if (!Object.keys(sv.veillees || {}).length && !sv.caidIntro) { sv.caidIntro = true; I.audio.scene('citadelle'); await S.run([['title', I.t('Les Veillées de la Citadelle'), I.t('un autre maillon de la Chaîne')], ['nar', I.t('Des siècles après les Compagnons, au bord du désert, un seigneur berbère lisait leurs vies à la lueur d’une lampe. Il n’y cherchait pas des récits. Il y cherchait comment tenir.')], ['nar', I.t('On l’appelait le Caïd. Chaque Lumière que tu retrouves, il l’a reçue avant toi, et il lui a fallu en faire quelque chose.')]]); }
        W.roster = {}; W.saga = null; return W.startChapter('caid', vi);
      }
    }
    if (!saga.frame) { const ri = rencontre(saga.id); if (ri >= 0) { W.roster = {}; W.saga = null; return W.startChapter('idris', ri); } }
    if (saga.frame && ch.after) {
      sv.rencontres = sv.rencontres || {}; sv.rencontres[ch.after] = true; I.save.store();
      const s2 = I.sagas[ch.after], e2 = D.ELEMENTS[s2.light], left2 = resteDans(s2);
      return U.showChain(I.perso.dire(I.t('{lumiere} — ce qu’Idris a reçu de {nom} a servi dans la Cité-Miroir.', { lumiere: `<b style="color:${e2.color}">${e2.glyph} ${s2.lightName}</b>`, nom: I.esc(s2.name) }) + ' ' + (left2 ? I.t('Encore {n} maillon.¦Encore {n} maillons.', { n: left2 }) : finLivre(s2))));
    }
    if (saga.frame && !saga.veillees && (Number.isInteger(ch.retour) || ch.visite)) { // 2.x : ce qui s'est passé au retour en 2084, ou une visite : on revient à la Chaîne
      if (Number.isInteger(ch.retour)) { sv.rebonds = sv.rebonds || {}; sv.rebonds[ch.id] = true; } I.save.store();
      return U.showChain(I.perso.dire(ch.visite ? I.t('Idris est revenu aux Archives basses. La Chaîne tourne dans la pénombre.') : I.t('Les Archives basses retrouvent leur silence. La Chaîne attend.')));
    }
    if (saga.frame) {
      if (W.ci === 0) { sv.prologue = true; I.save.store(); return U.showChain(I.t('La Chaîne s’ouvre. Cinq maillons, cinq témoins. Commence par le premier : Abû Bakr, le jour où tout aurait pu se défaire.')); }
      sv.epilogue = true; I.save.store(); await U.credits(); return U.showTitle();
    }
    const e = D.ELEMENTS[saga.light]; const left = resteDans(saga);
    return U.showChain(I.perso.dire(I.t('{lumiere} — la Lumière de {nom} rejoint Idris.', { lumiere: `<b style="color:${e.color}">${e.glyph} ${saga.lightName}</b>`, nom: I.esc(saga.name) }) + ' ' + (left ? I.t('Encore {n} maillon.¦Encore {n} maillons.', { n: left }) : finLivre(saga))));
  };
  U.credits = async function () {
    await S.card('credits', `<h1>ISNAD</h1><p class="small">${I.t('Chroniques des Compagnons')}</p>
      <p>${I.t('Cette œuvre est une fiction interactive inspirée de sources historiques. Les dialogues sont une dramatisation ; seules les paroles présentées en carton, avec leur source, sont des citations rapportées. Le Prophète ﷺ n’est jamais représenté, et aucun Compagnon n’a de visage : un voile de lumière en tient lieu.')}</p>
      <p>${I.t("<b>Sources principales.</b> Ibn Hishâm, <em>as-Sîra an-Nabawiyya</em> · at-Tabarî, <em>Târîkh ar-Rusul wa-l-Mulûk</em> · Ibn Sa'd, <em>at-Tabaqât al-Kubrâ</em> · Ibn Kathîr, <em>al-Bidâya wa-n-Nihâya</em> · al-Bukhârî et Muslim, <em>as-Sahîh</em> · Ibn 'Asâkir, <em>Târîkh Dimashq</em>.")}</p>
      <p>${I.t('<b>Noosphère et chimère.</b> « Noosphère » vient de Vernadsky et Teilhard de Chardin ; « chimère » désigne ici ce que les cœurs fabriquent ensemble et qui, approché, se révèle vide. Le jeu s’en sert comme d’une image pour parler des idoles que les hommes se fabriquent.')}</p>
      <p>${I.t('<b>Les veillées de la Citadelle</b> et <b>les rencontres de la Cité-Miroir</b> sont une fiction, comme les sept lames, les sept maux du cœur et les compagnons de lumière : des images pour parler de ce que les œuvres font au cœur. La musique est originale.')}</p>\n      <p>${I.t('Qu’Allah agrée les Compagnons. Toute erreur est celle des auteurs ; vérifiez auprès des savants et des sources.')}</p>
      <p class="small">${I.t('Fidélité à la Chaîne : {ok} / {total}', { ok: I.save.data.isnad.ok, total: I.save.data.isnad.total })}</p><div class="hint">▼</div>`);
  };

  /* ---------- codex ---------- */
  U.codexEntry = function (cid) {
    if (cid.startsWith('foe:_:')) { const e = I.common.enemies[cid.split(':')[2]]; return e ? { id: cid, cat: 'Noosphère', title: e.name, text: e.desc + ' — ' + I.t('Failles : {failles}.', { failles: e.weak.map(w => D.ELEMENTS[w].name).join(', ') }), saga: { name: I.t('Les routes') } } : null; }
    if (cid.startsWith('foe:')) { const [, sid, eid] = cid.split(':'), s = I.sagas[sid], e = s && s.enemies[eid]; return e ? { id: cid, cat: 'Noosphère', title: e.name, text: e.desc + ' — ' + I.t('Failles : {failles}.', { failles: e.weak.map(w => D.ELEMENTS[w].name).join(', ') }), saga: s } : null; }
    const [sid, eid] = cid.split('/'), s = I.sagas[sid], e = s && s.codex.find(c => c.id === eid); return e ? Object.assign({ saga: s }, e, { id: cid }) : null;
  };
  U.unlockCodex = function (id) {
    const cid = W.saga.id + '/' + id, sv = I.save.data; if (sv.codex.includes(cid)) return; const e = U.codexEntry(cid); if (!e) return;
    sv.codex.push(cid); if (!I.lecons || I.lecons.annonce()) S.toast(I.t('Recueil : <b>{titre}</b>', { titre: I.esc(e.title) }));
    const sp = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); sp.kn = (sp.kn || 0) + 1; if (sp.kn % 6 === 0) W.pillar('savoir', 1);
  };

  /* ---------- menu de pause ---------- */
  U.pause = function (mode, onClose) {
    if (W.excursion) { S.toast(I.rodeurs.texte('pasDeHalte'), 2600); return; }
    if (U.menuOpen) return; U.menuOpen = true; I.input.clearHeld(); I.audio.sfx('ok');
    if (I.lecons && !I.debug.auto) I.lecons.reemploi(mode === 'codex' ? 'source' : mode === 'equip' ? 'equipement' : 'halte'); // ouvrir la halte de soi-même : l'outil a resservi (lecons.js)
    const sv = I.save.data, side = $('#menu .side'), pane = $('#menu .pane'); let fl = null;
    const close = () => { if (fl) fl.destroy(); screen('#menu', false); U.menuOpen = false; if (I.scene === W && W.map && W.saga && !S.busy && !W.lock) W.checkpoint(); if (onClose) onClose(); }; // ce qui a été changé dans la halte est gardé
    const mkb = (label, fn, cls) => { const b = I.el('button', cls || '', label); b.type = 'button'; return tapable(b, fn); };
    const build = (items, o) => { if (fl) fl.destroy(); side.innerHTML = ''; const btns = []; items.forEach(it => { if (it.cat) { side.appendChild(I.el('div', 'cat', it.cat)); return; } const b = mkb(it.label, it.fn); b._show = it.show; b._after = it.after; side.appendChild(b); btns.push(b); }); fl = focusList(btns, Object.assign({ onSel: b => { if (b._show) pane.innerHTML = b._show(); if (b._after) b._after(pane); } }, o)); $('#menu .cols').classList.toggle('large', !!(o && o.large)); };
    const party = () => (W.saga && W.party.length) ? W.party.map(id => { const h = W.hero(id), st = I.calc.of(h), e = D.ELEMENTS[h.def.el], eq = I.gear.of(h); return `<div class="stat"><span class="seal" style="background-image:url(${G.sealURL(h.def.arabic, e.color)})"></span><img class="fig" alt="" src="${G.charURL(Object.assign({ kind: 'compagnon' }, h.def.look))}"><div><b style="color:${e.color}">${I.esc(h.def.name)}</b> ${h.def.title ? '<em>' + I.esc(h.def.title) + '</em>' : ''} <small>· ${I.t('niveau {n}', { n: h.lvl })} · ${e.name}</small><br><small>${I.t('Constance {pv}/{pvmax} · Souffle {souffle}/{souffleMax} · Force {force} · Esprit {esprit} · Garde {garde} · Élan {elan}', { pv: Math.ceil(h.hp), pvmax: st.hp, souffle: h.sp, souffleMax: st.sp, force: Math.round(st.atk), esprit: Math.round(st.mag), garde: Math.round(st.def), elan: Math.round(st.spd) })}</small><div class="sk">${h.def.skills.filter(k => k.lvl <= h.lvl).map(k => I.esc(k.name)).join(' · ')}</div><div class="port">${I.gear.SLOTS.filter(s => eq[s]).map(s => I.gear.img(eq[s]) + ' ' + I.esc(D.GEAR[eq[s]].name)).join(' · ') || I.t('Rien d’équipé')}</div></div></div>`; }).join('') : '<p>' + I.t('Aucun groupe pour l’instant.') + '</p>';
    const bag = () => '<h3>' + I.t('Besace') + '</h3>' + (Object.keys(D.ITEMS).filter(k => (sv.items[k] || 0) > 0).map(k => `<p><b>${D.ITEMS[k].name}</b> ×${sv.items[k]}<br><small>${D.ITEMS[k].desc}</small></p>`).join('') || '<p>' + I.t('La besace est vide.') + '</p>') + '<p class="src">' + I.t('Les objets s’utilisent en combat. Le groupe reprend des forces après chaque victoire.') + '</p>';
    const journal = () => { const o = W.cur && W.cur(); return `<h3>${W.ch ? I.esc(W.ch.title) : I.t('Journal')}</h3><p class="src">${W.ch ? I.esc(W.ch.sub) : ''}</p><p>${o && o.text ? '◆ ' + I.esc(o.text) : I.t('Aucun objectif en cours.')}</p><p class="src">${I.t('Le bouton <b>?</b> explique l’objectif et peut montrer le chemin.')}</p><p class="src">${I.t('Fidélité à la Chaîne : {ok} / {total}', { ok: sv.isnad.ok, total: sv.isnad.total })} · ${I.t('Lumières : {lumieres}', { lumieres: sv.lights.map(l => D.ELEMENTS[l].name).join(', ') || I.t('aucune') })}</p>`; };
    const pillars = () => { const P = W.pillars(); const eff = { priere: I.t('Sérénité au début des combats et dans les pourparlers'), savoir: I.t('failles révélées d’emblée ; arguments ouverts par le savoir'), justice: I.t('dégâts reçus réduits'), lien: I.t('dégâts infligés accrus ; renforts d’alliés') }; return `<h3>${W.saga && W.saga.veillees ? I.t('La Citadelle du Caïd') : I.t('Ce que ce maillon a bâti')}</h3>` + Object.keys(D.PILLARS).map(k => `<p><b>${D.PILLARS[k].glyph} ${D.PILLARS[k].name}</b> ${'◆'.repeat(P[k] || 0)}${'◇'.repeat(5 - (P[k] || 0))}<br><small>${eff[k]}</small></p>`).join('') + '<p class="src">' + I.t('Les piliers montent par la prière tenue, le savoir appris, la justice rendue et les pactes noués ; ils descendent quand la parole échoue.') + '</p>'; };
    const toggle = (name, get, set, txt) => ({ label: I.t('{reglage} : {valeur}', { reglage: name, valeur: get() }), fn(b) { set(); I.save.store(); b.textContent = I.t('{reglage} : {valeur}', { reglage: name, valeur: get() }); }, show: () => `<h3>${name}</h3><p>${txt}</p>` });
    const root = () => {
      const inWorld = I.scene === W, o = sv.opts, page = n => !I.lecons || I.lecons.page(n); // 2.x : dans une partie neuve, une page paraît quand son système a été rencontré
      const items = [{ label: I.t('Reprendre'), fn: close, show: journal }];
      if (inWorld) items.push({ label: I.t('Que faire ?'), fn() { close(); U.guide(); }, show: () => '<h3>' + I.t('Que faire ?') + '</h3><p>' + I.t('L’objectif expliqué, sa direction, et le chemin montré au sol si tu le demandes. Le même bouton <b>?</b> est toujours en haut de l’écran.') + '</p>' });
      if (inWorld && W.map) items.push({ label: I.t('Carte'), fn: carte, show: () => '<h3>' + I.t('Carte') + '</h3><p>' + I.t('Le lieu entier, avec ta position, l’objectif, la natte et les lieux nommés. On l’ouvre aussi en touchant la mini-carte, ou par la touche <kbd>C</kbd>.') + '</p>' });
      items.push({ cat: I.t('Le groupe') }, { label: I.t('Compagnons'), fn() {}, show: () => '<h3>' + I.t('Le groupe') + '</h3>' + party() });
      if (page('equipement')) items.push({ label: I.t('Équipement'), fn() { equip(); }, show: () => I.gear.paneGroupe() });
      if (I.postures && I.postures.offertes()) items.push({ label: I.t('Figures'), fn() { postures(); }, show: () => I.postures.pane() }); // 2.x : la page paraît quand un choix s'offre à quelqu'un du groupe
      items.push({ label: I.t('Besace'), fn() {}, show: bag }); if (page('piliers')) items.push({ label: I.t('Piliers'), fn() {}, show: pillars });
      if (page('oeuvres') || page('animaux')) items.push({ cat: I.t('Le cœur') });
      if (page('oeuvres')) items.push({ label: I.t('Œuvres et lames'), fn() {}, show: () => I.oeuvres.paneOeuvres() });
      if (page('animaux')) items.push({ label: I.t('Compagnons de lumière'), fn: betes, show: () => I.oeuvres.paneAnimaux() });
      items.push({ cat: I.t('Le savoir') }, { label: I.t('Recueil'), fn: codex, show: () => `<h3>${I.t('Le Recueil')}</h3><p>${I.t('Tout ce que tu as appris en chemin : biographies, événements, paroles avec leur source, et les idoles de la noosphère.')} ${I.t('{n} entrée pour l’instant.¦{n} entrées pour l’instant.', { n: sv.codex.length })} ${I.t('Chaque savoir peut ouvrir un argument dans un pourparler.')}</p>` },
        ...(page('mal') ? [{ label: I.t('Les degrés du mal'), fn: mal, show: () => I.mal.paneVue() }] : []),
        ...(page('valeurs') ? [{ label: I.t('Valeurs et attributs'), fn: valeurs, show: () => I.valeurs.paneVue() }] : []),
        { label: I.t('Aide du jeu'), fn: aide, show: () => '<h3>' + I.t('Aide du jeu') + '</h3><p>' + I.t('Les règles, thème par thème : {themes}.', { themes: U.AIDE.map(a => I.t(a[0]).toLowerCase()).join(', ') }) + '</p>' });
      items.push({ cat: I.t('Réglages') },
        toggle(I.t('Texte'), () => I.t(U.TZ[U.tz()][0]), U.tzSuivant, I.t('Taille des caractères dans les dialogues, les menus et les combats.')),
        toggle(I.t('Image'), zoomNom, U.zoomSuivant, I.t('Agrandit l’image pendant l’exploration : on voit moins loin, mais en plus grand. Sur l’image elle-même : deux doigts qui s’écartent, la molette, ou le bouton « × » en haut de la scène.')),
        toggle(I.t('Croix tactile'), () => o.pad ? I.t('affichée') : I.t('masquée'), () => { o.pad = !o.pad; U.applyOpts(); }, I.t('Sur un écran tactile, on se déplace en touchant la scène. La croix directionnelle reste disponible pour qui la préfère.')),
        toggle(I.t('Son'), () => I.audio.on ? I.t('activé') : I.t('coupé'), () => { I.audio.setOn(!I.audio.on); o.sound = I.audio.on; }, I.t('Coupe ou rétablit tout le son : musique, percussions et bruitages.')),
        toggle(I.t('Musique'), () => I.audio.musicOn ? I.t('activée') : I.t('coupée'), () => { I.audio.setMusic(!I.audio.musicOn); o.music = I.audio.musicOn; }, I.t('Bande-son originale synthétisée, une piste par lieu. Coupée, il reste les percussions de duff et les bruitages.')),
        toggle(I.t('Dessin'), dessinNom, dessinSuivant, I.t('Fin : deux fois plus de points, les grands personnages jusque sur les cartes, des lisières irrégulières. Fin, adouci : le même, les contours fondus. D’origine : le dessin de la version légère.')),
        toggle(I.t('Rendu'), () => G.low ? I.t('2D simple') : I.t('rétro-HD'), () => { G.low = !G.low; G._slow = 0; o.low = G.low; G.resize(); }, I.t('Rétro-HD : éclairage, halo, profondeur de champ, ombres de nuages. 2D simple : pixel art seul, pour les appareils modestes. Le jeu bascule de lui-même s’il peine.')));
      if (I.langue.disponibles().length > 1) items.push({ label: I.t('Langue') + ' : ' + I.langue.LANGUES[I.langue.lang].nom, fn() { close(); U.choisirLangue(); }, show: () => '<h3>' + I.t('Langue') + '</h3><p>Français · العربية · English · 日本語</p><p>' + I.t('Le récit reprend à son dernier point de reprise, dans la langue choisie. Ta partie est la même dans toutes les langues.') + '</p>' });
      items.push({ label: I.t('Ton personnage'), fn() { close(); U.personnage(() => { if (I.scene === W && W.map) W.hud(); }); }, show: () => { const p = I.perso.profil(); return '<h3>' + I.t('Ton personnage') + '</h3><p>' + I.t('Le râwî porte le nom et la tenue que tu lui donnes : <b>{nom}</b>, {tenue_min}. Les Compagnons, eux, gardent leur nom et leur silhouette.', { nom: I.esc(I.perso.dit()), tenue_min: I.esc(I.perso.tenue().nom.toLowerCase()), tenue: I.esc(I.perso.tenue().nom) }) + '</p>'; } });
      items.push({ label: I.t('Exporter la partie'), fn() { close(); U.partie('exporter', () => {}); }, show: () => '<h3>' + I.t('Exporter la partie') + '</h3><p>' + I.t('Ta partie tient dans un texte. Garde-le en lieu sûr, ou porte-le sur un autre appareil : l’écran-titre propose <b>Importer une partie</b>.') + '</p><p class="src">' + I.t('Elle se garde aussi toute seule sur cet appareil, à chaque objectif atteint.') + '</p>' });
      items.push({ label: I.t('Diagnostic'), fn() {}, show: U.diagnostic });
      // 2.x : on peut à tout moment quitter un récit pour revenir en 2084 ; il est rangé là où on le laisse, et les autres aussi
      if (inWorld && !W.excursion) { const ailleurs = !!(W.saga && (!W.saga.frame || W.saga.veillees)), nom = ailleurs ? I.t('Revenir en 2084') : I.t('Retour à la Chaîne');
        items.push({ cat: I.t('Partir') }, { label: nom, fn() { W.checkpoint(); close(); U.partir(ailleurs); },
          show: () => `<h3>${nom}</h3><p>${ailleurs ? I.t('Tu rouvres les yeux aux Archives basses, devant la Chaîne. Ce récit reste où tu le laisses : tu le reprendras là, même après en avoir suivi un autre.') : I.t('Tu reprendras ce chapitre là où tu l’as laissé.')} ${I.t('La partie se garde toute seule, même si tu fermes la page.')}</p>${ailleurs ? '<p class="src">' + I.t('La Cité-Miroir ne t’attend pas : il peut s’y être passé quelque chose.') + '</p>' : ''}` }); }
      $('#menu h2').textContent = I.t('Halte');
      build(items, { onCancel: close });
    };
    // la carte du lieu : le sol et les bâtiments tels qu'on les voit, la position du héros, l'objectif, la natte, les lieux nommés
    const carteHTML = () => {
      const m = W.map, tg = W.target(), sagaCh = W.saga.chapters, pct = (v, n) => (v / n * 100).toFixed(2) + '%';
      const noms = Object.assign({}, D.LIEUX, D.MAPS[m.id].noms || {}); // un lieu peut nommer ses lieux à sa façon
      const lieux = Object.keys(m.spots).filter(k => noms[k]).map(k => '<span class="lieu" style="left:' + pct(m.spots[k][0] + 0.5, m.w) + ';top:' + pct(m.spots[k][1] + 0.5, m.h) + '">' + I.esc(noms[k]) + '</span>').join('');
      return '<h3>' + I.esc(D.MAPS[m.id].label) + '</h3><p class="src">' + I.esc(W.ch.sub) + '</p>' +
        '<div class="carte" style="aspect-ratio:' + m.w + '/' + m.h + ';max-width:min(100%, calc(58vh * ' + (m.w / m.h).toFixed(3) + '))"><canvas></canvas>' + lieux + '<span class="ici" style="left:' + pct(W.player.x, m.w * 16) + ';top:' + pct(W.player.y - 8, m.h * 16) + '">' + I.esc(W.saga.heroes[W.party[0]].name) + '</span></div>' +
        '<p class="legende"><i class="k1"></i> ' + I.t('toi') + ' <i class="k2"></i> ' + (tg ? I.t('objectif') : I.t('objectif (ailleurs, ou sans lieu)')) + (W.prayerPts().length ? ' <i class="k3"></i> ' + I.t('natte : prière, repos, œuvres') : '') + (m.spots.comptoir ? ' <i class="k4"></i> ' + I.t('comptoir : boutique d’équipement, caravanes') : '') + '</p>' +
        '<p class="src">' + sagaCh.map((c, i) => (i === W.ci ? '<b>▸ ' + I.esc(c.title) + '</b>' : I.esc(c.title))).slice(0, W.saga.frame && !W.saga.veillees ? 0 : 9).join(' · ') + '</p>';
    };
    const carteDraw = pane => {
      const cv = pane.querySelector('.carte canvas'); if (!cv) return; const m = W.map, src = W.carte(), c = cv.getContext('2d'), tg = W.target(), T = 16;
      const q = src.hd || 1; cv.width = src.width; cv.height = src.height; c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(src, 0, 0); c.setTransform(q, 0, 0, q, 0, 0); // la suite se trace en points logiques
      c.fillStyle = 'rgba(8,6,16,.18)'; c.fillRect(0, 0, cv.width, cv.height);
      const k = Math.max(1, src.width / q / 480), star = (x, y, r, col, n) => { c.fillStyle = col; c.beginPath(); for (let q = 0; q < n * 2; q++) { const rr = q % 2 ? r * 0.42 : r, a = q * Math.PI / n - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); };
      const halo = (x, y, r) => { c.fillStyle = 'rgba(10,8,20,.75)'; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill(); };
      W.prayerPts().forEach(sp => { const x = sp[0] * T + 8, y = sp[1] * T + 10; halo(x, y, 9 * k); star(x, y, 7.5 * k, '#7fe6e0', 8); });
      if (m.spots.comptoir) { const x = m.spots.comptoir[0] * T + 8, y = m.spots.comptoir[1] * T + 8; halo(x, y, 8 * k); c.strokeStyle = '#e9c877'; c.lineWidth = 2 * k; c.beginPath(); c.arc(x, y, 5 * k, 0, 6.3); c.stroke(); c.fillStyle = '#e9c877'; c.beginPath(); c.arc(x, y, 1.6 * k, 0, 6.3); c.fill(); }
      if (tg) { halo(tg.gx, tg.gy - 6, 11 * k); star(tg.gx, tg.gy - 6, 9.5 * k, '#ffe08a', 4); }
      const p = W.player; halo(p.x, p.y - 8, 9 * k); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y - 8, 6 * k, 0, 6.3); c.fill(); c.fillStyle = '#ff7a5c'; c.beginPath(); c.arc(p.x, p.y - 8, 3.2 * k, 0, 6.3); c.fill();
    };
    const carte = () => {
      const back = mode === 'carte' ? close : root;
      $('#menu h2').textContent = I.t('Carte');
      build([{ label: I.t('◂ Retour'), fn: back, show: carteHTML, after: carteDraw }], { onCancel: back, large: true });
    };
    // l'équipement : quatre emplacements par compagnon, une réserve commune ; on choisit une pièce en voyant ce qu'elle change
    const equip = start => {
      if (I.lecons && !I.debug.auto) I.lecons.reemploi('equipement');
      const Gr = I.gear, sortir = mode === 'equip' ? close : mode === 'prepa' ? () => prepa(2) : root, items = [{ label: I.t('◂ Retour'), fn: sortir, show: () => Gr.paneGroupe() }];
      if (W.saga && W.party.length) {
        items.push({ label: I.t('✦ Équiper au mieux'), fn() { const n = Gr.bestAll(); I.audio.sfx(n ? 'light' : 'blip'); S.toast(n ? I.t('{n} pièce changée.¦{n} pièces changées.', { n }) : I.t('Chacun porte déjà ce que la réserve a de mieux pour lui.'), 2400); equip(1); }, show: () => Gr.paneGroupe() });
        W.party.forEach((id, pi) => { const h = W.hero(id); items.push({ cat: I.esc(h.def.name) });
          Gr.SLOTS.forEach((s, si) => { const cur = Gr.of(h)[s], g = D.GEAR[cur]; items.push({ label: g ? Gr.img(cur) + ' ' + I.esc(g.name) : '<i class="gi vide"></i> <span class="rien">' + I.t('{emplacement} : rien', { emplacement: D.SLOTS[s] }) + '</span>', fn() { pieces(h, s, 2 + pi * 4 + si); }, show: () => '<h3>' + I.esc(h.def.name) + '</h3>' + Gr.fiche(h) + '<p class="src">' + I.t('Choisis un emplacement pour voir ce que la réserve propose.') + '</p>' }); }); });
      }
      items.push({ cat: I.t('Réserve') }, { label: I.t('Voir la réserve'), fn() {}, show: () => Gr.paneReserve() });
      $('#menu h2').textContent = I.t('Équipement');
      build(items, { onCancel: sortir, start: start || 0 });
    };
    const pieces = (h, s, back) => {
      const Gr = I.gear, cur = Gr.of(h)[s], retour = () => equip(back), items = [{ label: I.t('◂ Retour'), fn: retour, show: () => '<h3>' + D.SLOTS[s] + '</h3>' + Gr.fiche(h) }];
      const prendre = (id, avant) => () => { if (avant) avant(); if (Gr.put(h, s, id)) I.audio.sfx(id ? 'light' : 'blip'); retour(); };
      Gr.reserve(s).filter(id => Gr.can(h.def, id)).forEach(id => items.push({ label: Gr.img(id) + ' ' + I.esc(D.GEAR[id].name) + (Gr.stock(id) > 1 ? ' ×' + Gr.stock(id) : ''), fn: prendre(id), show: () => Gr.panePiece(h, s, id) }));
      Gr.ailleurs(h, s).forEach(a => items.push({ label: Gr.img(a.id) + ' ' + I.esc(D.GEAR[a.id].name) + ' <small>· ' + I.esc(a.name) + '</small>', fn: prendre(a.id, () => Gr.rappeler(a.key, s)), show: () => Gr.panePiece(h, s, a.id, I.t('porté par {nom}, resté en arrière', { nom: I.esc(a.name) })) }));
      if (cur) items.push({ label: '<i class="gi vide"></i> ' + I.t('Ne rien porter'), fn: prendre(null), show: () => Gr.panePiece(h, s, null) });
      if (items.length === (cur ? 2 : 1)) items.push({ label: I.t('Rien d’autre pour lui'), fn() {}, show: () => '<h3>' + D.SLOTS[s] + '</h3><p>' + I.t('La réserve n’a rien que {nom} puisse porter ici. Les coffres et les comptoirs la rempliront.', { nom: I.esc(h.def.name) }) + '</p>' });
      $('#menu h2').textContent = D.SLOTS[s] + ' · ' + h.def.name;
      build(items, { onCancel: retour, start: items.length > 1 ? 1 : 0 });
    };
    // 2.x : les postures — pour chacun, celles qui lui sont ouvertes ; on en prend une d'un toucher
    const postures = retour => {
      const Po = I.postures, sortir = retour || root, items = [{ label: I.t('◂ Retour'), fn: sortir, show: () => Po.pane() }];
      (W.saga && W.party ? W.party : []).forEach(id => { const h = W.hero(id), cur = Po.de(h); Po.ouvertes(h).forEach(k => items.push({ label: (cur === k ? '● ' : '○ ') + I.t('{nom} · figure : {min_posture}', { nom: h.def.name, min_posture: D.POSTURES[k].nom.toLowerCase(), posture: D.POSTURES[k].nom }), fn() { Po.choisir(h, k); I.audio.sfx('light'); postures(retour); }, show: () => Po.pane() })); });
      $('#menu h2').textContent = I.t('Figures');
      build(items, { onCancel: sortir });
    };
    const betes = () => {
      const d = I.oeuvres.state(), A = I.sagas.coeur.animaux, items = [{ label: I.t('◂ Retour'), fn: root, show: () => I.oeuvres.paneAnimaux() }];
      D.ANIMAUX.filter(id => d.animaux[id]).forEach(id => items.push({ label: (d.animal === id ? '● ' : '○ ') + A[id].name, fn() { d.animal = id; I.save.store(); I.audio.sfx('light'); betes(); }, show: () => I.oeuvres.paneAnimaux() }));
      if (items.length === 1) items.push({ label: I.t('Aucun pour l’instant'), fn() {}, show: () => I.oeuvres.paneAnimaux() });
      $('#menu h2').textContent = I.t('Compagnons de lumière');
      build(items, { onCancel: root });
    };
    const aide = () => {
      const back = mode === 'aide' ? close : root, items = [{ label: I.t('◂ Retour'), fn: back, show: () => '<h3>' + I.t('Aide du jeu') + '</h3><p>' + I.t('Choisis un thème.') + '</p>' }];
      U.AIDE.forEach(a => items.push({ label: I.t(a[0]), fn() {}, show: () => `<h3>${I.t(a[0])}</h3>${I.t(a[1])}` }));
      $('#menu h2').textContent = I.t('Aide du jeu');
      build(items, { onCancel: back });
    };
    const codex = () => {
      if (I.lecons && !I.debug.auto) I.lecons.reemploi('source');
      const es = sv.codex.map(U.codexEntry).filter(Boolean), items = [{ label: I.t('◂ Retour'), fn: mode === 'codex' ? close : root, show: () => '<h3>' + I.t('Le Recueil') + '</h3><p>' + I.t('Choisis une entrée.') + '</p>' }];
      D.CODEX_CATS.forEach(cat => { const L = es.filter(e => e.cat === cat); if (!L.length) return; items.push({ cat: I.t(cat) }); L.forEach(e => items.push({ label: I.esc(e.title), fn() {}, show: () => `<h3>${I.esc(e.title)}</h3><p class="src">${I.t(cat)} · ${I.esc(e.saga.name)}</p><p>${I.fmt(e.text)}</p>${e.src ? `<p class="src">${I.t('Source : {source}', { source: I.esc(e.src) })}</p>` : ''}` })); });
      $('#menu h2').textContent = I.t('Le Recueil');
      build(items, { onCancel: mode === 'codex' ? close : root });
    };
    // la préparation d'une bataille déclarée : ce que l'on a, ce qui manque. On peut encore s'équiper ; rien ne bloque,
    // et l'on ne recule pas : la seule sortie est de déclarer la bataille.
    const prepa = start => {
      const o = U.prepa, vue = () => I.rangs.panePrepa(o), items = [
        { label: I.t('⚔ Déclarer la bataille'), fn: close, show: vue },
        { label: I.t('✦ Équiper au mieux'), fn() { const n = I.gear.bestAll(); I.audio.sfx(n ? 'light' : 'blip'); S.toast(n ? I.t('{n} pièce changée.¦{n} pièces changées.', { n }) : I.t('Chacun porte déjà ce que la réserve a de mieux pour lui.'), 2400); prepa(1); }, show: vue },
        { label: I.t('Choisir l’équipement'), fn() { equip(); }, show: () => I.gear.paneGroupe() },
        { label: I.t('Le groupe'), fn() {}, show: party }, { label: I.t('La besace'), fn() {}, show: bag }];
      if (I.postures && I.postures.offertes()) items.splice(3, 0, { label: I.t('Les figures'), fn() { postures(() => prepa(3)); }, show: () => I.postures.pane() });
      $('#menu h2').textContent = I.t('Bataille déclarée · préparation');
      build(items, { start: start || 0 });
    };
    // le côté du bien : sept Valeurs et sept attributs, collectionnés comme des badges
    const valeurs = () => {
      const Vl = I.valeurs, back = mode === 'valeurs' ? close : root, items = [{ label: I.t('◂ Retour'), fn: back, show: () => Vl.paneVue() }, { label: I.t('Vue d’ensemble'), fn() {}, show: () => Vl.paneVue() }, { cat: I.t('Les sept Valeurs') }];
      Vl.IDS.forEach(v => items.push({ label: (Vl.acquise(v) ? '◆ ' : '◇ ') + I.esc(Vl.nom(v)), fn() {}, show: () => Vl.paneUne(v) }));
      I.oeuvres.learn('valeurs'); $('#menu h2').textContent = I.t('Valeurs et attributs');
      build(items, { onCancel: back, start: 1 });
    };
    // l'organigramme du mal : la vue d'ensemble, puis les idoles rencontrées, maillon par maillon
    const mal = () => {
      // l'organigramme d'abord ; le détail de chaque maillon est derrière une seule entrée, pour que la page reste en vue au téléphone
      const Ml = I.mal, back = mode === 'mal' ? close : root, items = [{ label: I.t('◂ Retour'), fn: back, show: () => Ml.paneVue() }, { label: I.t('Les degrés'), fn() {}, show: () => Ml.paneVue() }];
      const maillons = () => { const L = [{ label: I.t('◂ Les degrés'), fn: () => mal(), show: () => Ml.paneVue() }]; Ml.epoques().forEach(s => L.push({ label: I.esc(Ml.nomEpoque(s)), fn() {}, show: () => Ml.paneEpoque(s) }));
        $('#menu h2').textContent = I.t('Les degrés du mal · les maillons'); build(L, { onCancel: () => mal(), start: 1 }); };
      items.push({ label: I.t('Maillon par maillon ▸'), fn: maillons, show: () => Ml.paneEpoque(Ml.epoques().find(s => s === W.saga) || Ml.epoques()[0]) });
      if (mode !== 'mal') items.push({ cat: I.t('Du côté du bien') }, { label: I.t('Valeurs et attributs'), fn: valeurs, show: () => I.valeurs.paneVue() });
      Ml.apprendre(); $('#menu h2').textContent = I.t('Les degrés du mal');
      build(items, { onCancel: back, start: 1 });
    };
    screen('#menu', true); if (mode === 'prepa') prepa(); else if (mode === 'codex') codex(); else if (mode === 'valeurs') valeurs(); else if (mode === 'mal') mal(); else if (mode === 'aide') aide(); else if (mode === 'equip') equip(); else if (mode === 'carte' && I.scene === W && W.map) carte(); else root();
  };

  // Avant chaque combat d'idole : la page de préparation. Le joueur de test ne s'y arrête pas.
  U.prepare = function (opts) {
    if (I.debug.auto || U.menuOpen) return Promise.resolve();
    return new Promise(res => { U.prepa = opts; U.pause('prepa', () => { U.prepa = null; res(); }); });
  };

  /* ---------- l'aide du jeu, thème par thème ---------- */
  U.AIDE = [
    [I.T('Se déplacer, agir'), I.T('<p><b>Au doigt ou à la souris.</b> Touche un endroit : le héros s’y rend. Garde le doigt posé : il te suit. Touche un personnage pour lui parler ; touche un coffre, une natte, un palmier, un rocher ou un puits pour t’en servir.</p><p><b>Au clavier.</b> <kbd>Flèches</kbd> ou <kbd>ZQSD</kbd>/<kbd>WASD</kbd> : marcher, naviguer · <kbd>Entrée</kbd>/<kbd>Espace</kbd> : parler, valider · <kbd>Échap</kbd>/<kbd>X</kbd> : halte, retour · <kbd>H</kbd> : que faire ? · <kbd>B</kbd> : bâtir.</p><p>Le bouton <b>?</b> dit toujours ce qu’il y a à faire, dans quelle direction, et peut montrer le chemin ou t’y conduire.</p><p><b>La carte.</b> La mini-carte, en haut de l’écran, montre le lieu et ta position. Touche-la, ou ouvre <b>Carte</b> dans la halte (touche <kbd>C</kbd>) : le lieu entier, l’objectif, la natte, les lieux nommés.</p><p><b>Qui est qui.</b> Chaque personnage a sa coiffe, son manteau et son attribut. À l’arrêt, le nom de ceux qui t’entourent s’affiche au-dessus d’eux.</p>')],
    [I.T('Combat'), I.T('<p>On n’affronte jamais des personnes, seulement des <em>chimères</em>, ce que les cœurs fabriquent ensemble ; la plus enracinée est une idole. Chaque chimère est protégée par des <b>voiles</b> (⛊). Frappe-la avec la <b>vertu</b> qui est sa faille pour retirer un voile ; à zéro, elle est <b>dévoilée</b> : elle perd son tour et subit bien plus.</p><p><b>Niyya</b> (l’intention) : un point par tour ; dépense-en jusqu’à trois (◂ ▸) pour multiplier les coups ou renforcer une vertu. <b>Sérénité</b> : la jauge dorée ; pleine, elle permet le grand acte du Compagnon.</p>')],
    [I.T('La parole avant le sabre'), I.T('<p>Un <b>pourparler</b> se gagne manche après manche : chaque argument fait monter ou baisser la confiance. Les meilleurs demandent un <b>savoir</b> (✧) appris d’un savant, d’un feuillet, d’un témoin. Avoir <b>prié</b> dans le chapitre donne la sérénité : +1 de confiance. Si la parole échoue, le récit continue, mais il en coûte.</p>')],
    [I.T('Prier, se reposer, reprendre'), I.T('<p>La natte d’une mosquée, au cœur de l’étoile à huit branches : on y <b>prie</b>, et le groupe s’y <b>repose</b>. Constance et Souffle reviennent à 100 %, le groupe retrouve sa sérénité. On y accomplit aussi les œuvres du jour.</p><p><b>La partie se garde toute seule</b>, à chaque objectif atteint et toutes les quelques secondes en promenade. Tu peux fermer la page : « Continuer », sur l’écran-titre, te ramène là où tu étais. Si le jeu se bloquait, recharge la page et continue.</p><p>Sur la natte, ou depuis l’écran de la Chaîne, on peut en plus <b>garder une copie</b> de la partie dans l’un des trois emplacements : utile avant un choix que l’on voudrait pouvoir rejouer.</p>')],
    [I.T('Les étoiles'), I.T("<p>On s’oriente au ciel. Le cadran montre huit caps, nommés par l’étoile qui s’y lève ou s’y couche : <b>al-Jady</b> (la Polaire) au nord, <b>Suhayl</b> au sud, <b>an-Nasr at-Tâ'ir</b> à l’est et à l’ouest, <b>al-'Ayyûq</b> et <b>al-'Aqrab</b> entre eux. L’étoile qui brille est celle de ton objectif ; au bord de l’écran, elle te précède.</p>")],
    [I.T('Caravanes'), I.T('<p>Aux ballots du souk ou du camp, on vend, on achète, et l’on confie une cargaison à une caravane : elle revient au chapitre suivant avec son gain, ou bien des hommes rentrent à pied. Une route est plus sûre quand la justice est rendue, que des pactes sont noués et que des méharistes la gardent. Si elle est pillée, on lève des renforts, on parle d’abord, et l’on rend à chacun ce qui lui revient.</p>')],
    [I.T('Bâtir'), I.T('<p>Touche <kbd>B</kbd> ou bouton ▦, à ciel ouvert. On récolte en s’adressant aux choses : un palmier donne de la <b>palme</b>, un rocher de la <b>pierre</b>, un puits ou une rive de l’<b>eau</b>, et l’eau pétrie donne du <b>pisé</b>. Puis on pose case par case, devant soi ou en touchant la case : tranchée qui arrête les chimères, puits, palmiers (un puits et trois palmiers font une oasis), champs, enclos de chèvres, de moutons, de chameaux, et les pièces d’une mosquée. Ce qui est bâti reste et rapporte à chaque chapitre. Sur une terre gagnée, un chantier s’ouvre : la mosquée achevée devient un lieu de prière et de sauvegarde.</p>')],
    [I.T('Équipement'), I.T('<p>Chaque compagnon a quatre emplacements : <b>main droite</b> (épée, lance, arc, dague, masse, bâton ou calame), <b>main gauche</b> (bouclier, ou un outil pour qui n’en porte pas), <b>tête</b> (turban, calotte ou casque) et <b>corps</b> (étoffe, cuir ou armure). Chaque rôle a ses pièces : un sage ne porte pas de cotte de mailles, un guerrier n’a que faire d’un calame.</p><p>Les pièces viennent des <b>coffres</b>, des <b>victoires</b> (toujours après une idole, parfois après un combat ordinaire) et de la <b>boutique d’équipement</b>, au comptoir : chaque lieu a ses artisans, et l’on n’y trouve pas la même chose à Médine, au camp ou dans une ville de Rûm. Elles vont dans une <b>réserve</b> commune à toute la Chaîne ; à la fin d’un maillon, ce que le groupe portait y retourne.</p><p>Dans la halte, <b>Équipement</b> montre ce que chaque pièce change avant de la choisir ; <b>Au mieux</b> habille tout le groupe d’un geste. Une lance perce la garde, une dague frappe parfois deux fois, un arc tire le premier, une masse étourdit, un bouclier pare, un casque évite d’être étourdi ; le fer protège mais ralentit.</p><p>Ce sont des objets ordinaires, sans relique ni inscription. Le fer aide à tenir : il ne remplace pas la provision du cœur.</p>')],
    [I.T('Les œuvres et la provision'), I.T('<p>Sur la natte d’une mosquée, on prie, et l’on accomplit les <b>œuvres du jour</b> : le dhikr, l’étude du Coran, le jeûne, l’aumône, la visite ; parfois le pèlerinage. Trois par chapitre au plus, la prière en sus. Chacune ajoute à la <b>provision du cœur</b> (♥, cinq au plus).</p><p>Plus une épreuve est lourde, plus elle en demande : une idole pèse de 1 à 3 selon son enracinement, un mal du cœur 3. Qui s’y présente sans provision combat <b>le cœur lourd</b> : il frappe moins fort et reçoit davantage. Le bouton <b>?</b> annonce le poids de l’épreuve qui vient.</p><p>Un jour de <b>jeûne</b>, les vivres de la besace attendent le soir. L’aumône coûte des dirhams. Ces œuvres ne sont pas des sortilèges : le jeu traduit à sa façon ce qu’elles font au cœur.</p>')],
    [I.T('Lames et maux du cœur'), I.T('<p>Sept maux du cœur se tiennent derrière les idoles : l’avidité, l’orgueil, l’ostentation, l’avarice, l’insouciance, l’envie, la colère. On les rencontre à la fin de chaque rencontre de la Cité-Miroir, et tous ceux qui restent au dernier chapitre.</p><p>Une œuvre pratiquée forge une <b>lame</b> : trois jeûnes pour le Contentement, trois prières pour la Sincérité, trois aumônes pour la Largesse, trois études pour l’Ardeur, trois visites pour la Bienveillance, trois dhikr pour la Longanimité, un pèlerinage pour l’Humilité. Sans sa lame, un mal est seulement <b>repoussé</b> : il revient. Avec elle, il est <b>tranché</b>.</p><p>La page « Œuvres et lames » de la halte tient le compte.</p>')],
    [I.T('À chaque mal sa réponse'), I.T('<p>Les <b>degrés du mal</b> (halte, « Le savoir ») rangent ce que l’on rencontre et disent comment y répondre. À l’<b>idée noire</b>, qui pèse sur une personne : la parole, la pédagogie, la bienveillance. À la <b>chimère</b>, que beaucoup de cœurs nourrissent : le combat. À l’<b>idole</b>, enracinée : une bataille déclarée. On ne combat ni Iblîs ni ceux qui soufflent, et l’on ne s’en prend à aucun djinn : on répond à ce qui a été soufflé.</p><p>Chaque idole a une jauge d’<b>enracinement</b>, de ▮ à ▮▮▮▮▮. Un pourparler gagné, une idée noire dissipée du premier coup la font baisser ; une parole manquée, un acte que les transmetteurs n’ont pas rapporté la font monter. Déracinée, l’idole pèse moins sur la provision du cœur et garde un voile de moins ; enracinée, elle pèse davantage. La jauge se dit d’une idole, jamais d’une époque ni de ses gens.</p>')],
    [I.T('Valeurs et attributs'), I.T('<p>Du côté du bien, on ne dit ni djinn, ni chimère, ni idole : on dit des <b>Valeurs</b> et des <b>attributs</b>. Il y a sept Valeurs, une en face de chaque mal du cœur. L’<b>œuvre</b>, accomplie trois fois, forge la lame ; la lame <b>tranche</b> le mal ; la Valeur d’en face est alors gardée, et le jeu la marque d’un <b>badge</b>.</p><p>Quand une lame est forgée, l’œuvre rappelle aussi un <b>attribut divin</b>, nommé d’après le Coran, avec son verset. On ne possède pas un attribut : on le reconnaît. La page « Valeurs et attributs » de la halte les rassemble.</p>')],
    [I.T('Descendre dans la noosphère'), I.T('<p>Trois moments ouvrent la noosphère à qui veut y descendre : <b>au sortir de la prière</b> sur la natte, <b>dans le dhikr</b>, et <b>en songe</b> (« S’endormir », sur la natte). Une descente par porte et par chapitre.</p><p>C’est un <b>labyrinthe</b>. Y rôdent les <b>maux du cœur</b> que le <b>râwî</b> n’a pas encore tranchés, et les <b>idées noires</b> : ce que l’on appelle ses démons intérieurs, une façon de parler. C’est sa descente à lui, jamais celle d’un Compagnon.</p><p>Seul, il ne les vainc pas : il cherche l’<b>issue</b> (un niveau), ou un <b>abri</b> où rien n’entre, le temps que le chrono s’écoule (de l’Esprit et du Souffle, pour de bon). Il peut les <b>frapper</b> avec l’arme qu’il porte : sonnés, ils le laissent passer.</p><p><b>Accompagné</b> — d’un compagnon de lumière, ou de son groupe en 2084 — et une <b>lame</b> forgée en main, il peut leur faire face : ses coups dissipent une idée noire, et un mal du cœur se tranche avec la lame qui lui répond. Rattrapé, il remonte épuisé : les portes restent closes jusqu’à un sommeil sans songe. Rien d’autre n’est perdu.</p>')],
    [I.T('Le secours'), I.T('<p>Dans une <b>bataille déclarée</b> presque perdue, quand le dernier compagnon va tomber, le <b>secours</b> peut venir : le groupe est relevé, une fois. Il ne vient que si la <b>prière</b> a été tenue dans le chapitre, et l’on ne le commande pas.</p><p>Le jeu ne montre pas les anges, ne les nomme pas, ne les compte pas. Il cite ce que le Coran rapporte de Badr, et ne dit rien d’un autre jour.</p>')],
    [I.T('La bataille déclarée'), I.T('<p>Contre une <b>idole</b>, la bataille se <b>déclare</b>, et commence par une page de <b>préparation</b> : les hommes, le groupe, les armes et les boucliers, les vertus, la besace, le cœur. Elle signale ce qui manque sans rien bloquer, et l’on peut encore s’y équiper. Le combat du groupe se joue comme d’habitude. À côté, un <b>champ</b> de cinq colonnes sur trois couloirs : nos rangs y font face aux <b>nuées</b> de l’idole. Ce ne sont jamais des hommes. Là où il n’y a pas d’armée à mener, la bataille se déclare sans rangs, et le carton dit pourquoi.</p><p>Après chaque tour de l’idole, et au plus tard tous les trois tours, les rangs exécutent leur ordre, puis les nuées avancent. Au tour d’un compagnon, <b>Ordonner</b> change l’ordre d’un rang, à la place de son action : tenir, avancer, charger (cavaliers), tirer (archers), glisser vers un autre couloir, se replier. Sur le champ, chaque rang porte son <b>numéro</b>, celui du menu ; trois points disent sa tenue, un chevron son ordre. Une nuée bordée par un autre rang est prise <b>de flanc</b> ; prise des deux côtés, <b>en tenaille</b>, elle se dissipe. Un rang qui atteint le pied de l’idole <b>découvre son flanc</b> : un voile tombe, une faille se révèle. Une nuée qui perce jusqu’au camp sème le doute.</p><p>Un rang éprouvé se replie et se reforme : personne ne tombe. Le nombre de rangs suit la mission et le niveau du groupe ; un allié gagné par la parole vient en <b>renfort</b> et prend place sur le champ. <b>Khâlid</b>, dont c’est le métier, ordonne sans perdre son tour, et connaît trois manœuvres d’école : la réserve mobile, l’enveloppement, le repli feint.</p>')],
    [I.T('Idées noires et énigmes'), I.T('<p>Dans un pourparler, il arrive que la <b>honte</b>, la <b>peur</b>, le <b>soupçon</b>, la <b>rancune</b> ou le <b>désespoir</b> parlent plus fort que toi. On ne la combat pas : on lui <b>répond</b>. Elle a deux voiles ; à chacun, tu choisis ta manière : <b>dire vrai</b> (la parole), <b>expliquer</b> (la pédagogie) ou <b>rassurer</b> (la bienveillance). La bonne manière fait tomber le voile ; une autre t’apprend pourquoi elle ne portait pas. Après quoi il écoute, et la confiance monte.</p><p>Une <b>énigme du cœur</b> : l’un des tiens perd courage, sans être malade ni blessé. Il tient moins bien au combat tant qu’on n’a pas trouvé ce qu’il a cessé de faire. Les anciens donnent des indices ; la bonne œuvre, accomplie sur la natte, le remet debout.</p>')],
    [I.T('Compagnons de lumière'), I.T('<p>Des figures du ciel : le Renard des sables, l’Aigle, le Phénix, le Lion, la Gazelle. Elles rejoignent celui qui a résolu une énigme, forgé une lame, tranché un mal, tenu trois grandes épreuves le cœur prêt, gagné cinq pourparlers. Une seule t’accompagne au combat ; on la choisit dans la halte. Fiction : aucune n’appartient au récit historique.</p>')],
    [I.T('Si le jeu s’arrête'), I.T('<p>Si l’écran reste noir ou si plus rien ne répond pendant un quart de minute, un bouton <b>Reprendre</b> apparaît en bas de l’écran : il ramène au dernier objectif atteint, sans rien perdre de ce qui a été sauvegardé.</p><p>La partie se garde toute seule : en dernier recours, <b>recharge la page</b> puis choisis « Continuer ».</p><p>Dans la halte, <b>Diagnostic</b> donne la version du jeu, l’appareil, l’état du son et les incidents relevés : c’est ce qu’il faut transmettre pour qu’une panne soit comprise. Couper le son ou la musique (Réglages) suffit parfois à la contourner.</p>')],
    [I.T('Mener plusieurs récits'), I.T('<p>On n’est pas tenu de finir un récit pour en ouvrir un autre. Dans la halte, <b>Revenir en 2084</b> te ramène aux Archives basses, devant la Chaîne : le récit que tu quittes reste où tu le laisses, et tu le reprends là — même après en avoir suivi un autre. La Chaîne dit lesquels sont <b>en route</b>, et son grand bouton reprend le dernier quitté.</p><p>Pendant que tu suis un récit, la Cité-Miroir ne t’attend pas : en revenant, il arrive qu’il s’y soit passé quelque chose. Et dès la première veillée entendue, la Chaîne ouvre le chemin de <b>la Citadelle</b>, où Idris est né.</p>')],
    [I.T('Frapper ce qui rôde'), I.T('<p>Dans un labyrinthe de la noosphère, de petites chimères vont et viennent sur les ponts. <kbd>Entrée</kbd> — ou un toucher sur ce qui rôde — le <b>frappe</b>, avec l’arme que porte celui qui mène : un voile de moins, et il reste sonné un instant, le temps de passer. Sans voile, il se dissipe. S’il vous rejoint avant, c’est un combat ordinaire.</p><p>L’allonge, la cadence et le recul viennent de l’arme : une lance porte loin, une masse sonne longtemps, une dague frappe vite. Dans la descente du râwî, un coup ne fait que sonner : seul, on ne vainc pas ce qui pèse sur le cœur.</p>')],
    [I.T('Les figures'), I.T('<p>Devant l’épreuve, on peut se tenir de trois manières. <b>Le héros</b> s’expose : plus de Force, un point de Niyya d’emblée, et les coups viennent à lui. <b>Le sage</b> discerne : plus d’Esprit, et une faille de chaque chimère connue d’emblée. <b>Le saint</b> s’efface : il soigne mieux et garde le calme.</p><p>Chacun a d’abord la sienne, selon son tempérament ; les deux autres s’ouvrent aux niveaux 4 et 7. On en change à la halte (<b>Figures</b>) ou en préparant une bataille. Aucune n’est au-dessus d’une autre : on prend une figure, on ne la possède pas.</p>')],
    [I.T('Agrandir l’image et le texte'), I.T('<p>Pendant l’exploration, l’image s’agrandit autour de celui qui mène : on voit moins loin, mais en plus grand. Sur un écran tactile, pose <b>deux doigts</b> sur l’image et écarte-les ; rapproche-les pour revoir plus large. Le bouton <b>×</b>, en haut de la scène, fait le tour des grandeurs (× 1, × 1,5, × 2, × 3) ; à la souris, la molette. Le combat garde son cadrage.</p><p>La taille des caractères se règle à part : <b>Texte</b>, dans les réglages de la halte ou de l’écran-titre — normal, grand, très grand, géant. Sur un téléphone, le jeu commence en « grand », l’image agrandie une fois et demie.</p>')],
    [I.T('La Chaîne'), I.T('<p>Aux moments décisifs, plusieurs actes te sont proposés. Un seul est celui que les transmetteurs ont rapporté. Te tromper ne change pas l’Histoire : la chaîne vacille, puis te ramène à ce qui fut.</p>')]
  ];

  /* ---------- « Que faire ? » : l'objectif expliqué, sa direction, le chemin ---------- */
  const CAPS = [I.T('à l’est'), I.T('au sud-est'), I.T('au sud'), I.T('au sud-ouest'), I.T('à l’ouest'), I.T('au nord-ouest'), I.T('au nord'), I.T('au nord-est')];
  U.guideLines = function () {
    const o = W.cur(), tg = W.target(), p = W.player, touch = document.body.classList.contains('touch'), out = [];
    if (!o) return [I.t('Le chapitre s’achève : laisse le récit se dérouler.')];
    const n = o.talk && W.npcs.find(x => x.id === o.talk);
    out.push('<b>◆ ' + I.esc(o.text || I.t('Poursuis.')) + (o.build ? I.esc(I.build.objectiveText(o.build)) : '') + '</b>');
    if (o.hint) out.push(I.fmt(o.hint));
    if (o.goto) out.push(I.t('Rends-toi à l’endroit marqué d’un <em>anneau doré</em> au sol.'));
    else if (o.talk) out.push(((n && n.name) ? I.t('Va parler à <em>{nom}</em> : un losange doré flotte au-dessus de lui.', { nom: I.esc(n.name) }) : I.t('Va parler à <em>celui qui t’attend</em> : un losange doré flotte au-dessus de lui.')) + ' ' + (touch ? I.t('Touche-le du doigt.') : I.t('Clique sur lui, ou place-toi devant lui puis <kbd>Entrée</kbd>.')));
    else if (o.foe) out.push(I.t('Une idole barre le passage : c’est la lueur qui flotte. Marche jusqu’à elle pour l’affronter.'));
    else if (o.build) out.push(o.build.site ? I.t('Un chantier est ouvert : le rectangle en pointillés. Ouvre le mode Bâtir (▦), choisis une pièce et pose-la à l’intérieur ; le compte est rappelé à côté de l’objectif.') : I.t('Ouvre le mode Bâtir (▦), à ciel ouvert, et pose ce qui est demandé. Les matériaux se récoltent sur les palmiers, les rochers et les puits.'));
    if (tg) {
      const dx = tg.gx - p.x, dy = tg.gy - p.y, d = Math.hypot(dx, dy), st = I.trade && I.trade.bearing();
      const cap = I.t(CAPS[((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8]), pas = Math.round(d / 16);
      out.push(d < 44 ? I.t('C’est tout près.') : !st ? I.t('C’est {cap}, à {n} pas.', { cap, n: pas }) : st.way ? I.t('C’est {cap}, à {n} pas : cap sur le {etoile}, l’étoile qui brille au cadran.', { cap, n: pas, etoile: I.esc(I.trade.starText(st)) }) : I.t('C’est {cap}, à {n} pas : cap sur {etoile}, l’étoile qui brille au cadran.', { cap, n: pas, etoile: I.esc(I.trade.starText(st)) }));
    }
    const fo = o.foe && W.foes.find(x => x.id === o.foe), wt = fo ? I.oeuvres.weight({ group: fo.group, boss: fo.boss }) : 0, zd = I.oeuvres.zad();
    if (wt) out.push(I.t('Cette épreuve pèse <b>{poids}</b> ; la provision du cœur est de <b>♥ {provision}</b>.', { poids: wt, provision: zd }) + ' ' + (zd >= wt ? I.t('Le cœur est prêt.') : I.t('Il manque {n} : une œuvre sur la natte d’une mosquée (dhikr, étude, jeûne, aumône, visite) allégerait le cœur.', { n: wt - zd })));
    const qv = W.saga && I.oeuvres.viceApres(W.saga.veillees ? W.ch.after : W.saga.id), dq = I.oeuvres.state();
    if (qv && dq.vices[qv] !== 'tranche' && !dq.lames[qv]) out.push(I.t('Au bout de ce maillon, dans la Cité-Miroir, un mal du cœur attend. {quete}. Sans sa lame, il ne sera que repoussé.', { quete: I.oeuvres.quete(qv) }));
    const en = I.oeuvres.enigme();
    if (en) out.push(I.t('<em>Énigme du cœur.</em> {signe} Cherche ce qu’il a cessé de faire : la bonne œuvre, sur la natte, le remettra debout. Les anciens ont peut-être remarqué quelque chose.', { signe: I.esc(en.signe) }));
    const tired = W.party.some(id => { const h = W.hero(id); return h.hp < I.calc.of(h).hp * 0.5; });
    if (tired) out.push(I.t('Le groupe est éprouvé : la natte d’une mosquée, au cœur de l’étoile à huit branches, le repose.'));
    else if (o.foe && !S.flags._prayed && W.prayerPts().length) out.push(I.t('Avant l’épreuve, une prière sur la natte rend au groupe sa sérénité.'));
    const mieux = I.gear.better(); if (mieux) out.push(I.t('La réserve tient une pièce qui irait mieux à {nom} : <em>{piece}</em>. Halte, puis <b>Équipement</b>.', { nom: I.esc(mieux.h.def.name), piece: I.esc(D.GEAR[mieux.id].name) }));
    return out;
  };
  U.guide = async function () {
    if (I.scene !== W || S.busy || W.lock || U.menuOpen || !W.ch) return;
    if (W.excursion) { S.toast(I.rodeurs.texte('pasDeHalte'), 2600); return; }
    if (I.lecons) I.lecons.reemploi('aide');
    const tg = W.target(), opts = [];
    if (tg) opts.push({ t: I.t('Montrer le chemin'), k: 'way' }, { t: I.t('M’y conduire'), k: 'go' });
    opts.push({ t: I.t('Toute l’aide du jeu'), k: 'aide' }, { t: I.t('Reprendre'), k: '' });
    let k = '';
    S.depth++;
    try { const i = await S.menuPick({ cls: 'guide', html: '<span class="gt">' + I.t('Que faire ?') + '</span>' + U.guideLines().map(x => '<span class="gl">' + x + '</span>').join('') }, opts); k = opts[i].k; }
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
    if (now - figeDepuis > 15000 && box.hidden) { const e = I.errors[I.errors.length - 1]; box.querySelector('small').textContent = e ? I.t('Incident : {message}', { message: e.msg }) : I.t('Aucun incident relevé : le jeu attendait quelque chose qui n’est pas venu.'); box.hidden = false; }
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
    const pq = Object.keys(I.paquets || {}).map(k => I.t('{titre} ({id}, version {version})', { titre: I.paquets[k].titre, id: k, version: I.paquets[k].version })), rf = (I.refuses || []).map(r => r.id + ' — ' + r.refus[0]);
    const L = [[I.t('Version'), window.ISNAD_VERSION || I.t('de travail')], [I.t('Contenu'), I.t('jeu de base') + ' · ' + (pq.length ? I.t('paquets : {paquets}', { paquets: pq.join(', ') }) : I.t('aucun paquet ajouté')) + (rf.length ? ' · ' + I.t('refusés : {refus}', { refus: rf.join(' ; ') }) : '')], [I.t('Navigateur'), navigator.userAgent], [I.t('Fenêtre'), window.innerWidth + ' × ' + window.innerHeight + ' · ' + I.t('densité {densite}', { densite: window.devicePixelRatio || 1 })],
      [I.t('Scène'), st.clientWidth + ' × ' + st.clientHeight + ' · ' + (document.body.classList.contains('portrait') ? I.t('en hauteur') : I.t('en largeur')) + (U.zoom ? ' · ' + I.t('agrandie') : '') + ' · ' + I.t('échelle {echelle}', { echelle: G.k }) + (G.low ? ' · ' + I.t('2D simple') : '')],
      [I.t('Entrée§saisie'), (document.body.classList.contains('touch') ? I.t('tactile') : I.t('clavier ou souris'))],
      [I.t('Sauvegarde automatique'), I.save.autoKo ? I.t('refusée par le navigateur (stockage indisponible)') : I.save.autoAt ? I.t('il y a {n} s', { n: Math.round((Date.now() - I.save.autoAt) / 1000) }) : I.t('pas encore écrite')],
      [I.t('Son'), (A.ctx ? A.ctx.state + ' · ' + A.ctx.sampleRate + ' Hz' : I.t('aucun contexte')) + ' · ' + I.t('piste {piste}', { piste: (A.curTrack && A.curTrack.name) || I.t('aucune') }) + ' · ' + I.t('voulue {piste}', { piste: A.wantTrack || I.t('aucune') }) + ' · ' + I.t('lieu {lieu}', { lieu: A.place || I.t('aucun') }) + ' · ' + I.t('incidents {n}', { n: A.fails || 0 }) + ' · ' + I.t('notes {notes}, sautées {sautees}, relances {relances}', { notes: A.stats.notes, sautees: A.stats.sautees, relances: A.stats.relances })],
      [I.t('Partie'), (W.saga ? W.saga.id + ' / ' + (W.ch && W.ch.id) + ' / ' + I.t('objectif {n}', { n: W.objIndex }) : I.t('hors chapitre')) + ' · ' + (S.busy ? I.t('récit occupé ({n})', { n: S.depth }) : I.t('récit libre')) + ' · ' + I.t('provision {n}', { n: d.zad })]];
    return '<h3>' + I.t('Diagnostic') + '</h3><p>' + I.t('Si le jeu s’arrête ou se comporte mal, une capture de cette page dit où regarder.') + '</p><p class="diag">' + L.map(x => '<b>' + x[0] + '</b> ' + I.esc(String(x[1]))).join('<br>') + '</p>' +
      '<h3>' + I.t('Incidents relevés') + '</h3><p class="diag">' + (e.length ? e.slice().reverse().map(x => new Date(x.t).toLocaleTimeString(I.langue.locale()) + ' · ' + I.esc(x.msg) + (x.n > 1 ? ' (×' + x.n + ')' : '') + (x.st ? '<br><small>' + I.esc(x.st) + '</small>' : '')).join('<br>') : I.t('Aucun.')) + '</p>';
  };

  /* ---------- noms au-dessus des personnages ---------- */
  let still = 0;
  U.noms = function (now) {
    const box = $('#noms'), ok = I.scene === W && W.map && W.saga && !S.busy && !W.lock && !U.menuOpen && !(I.build && I.build.on) && !$('#hud').hidden;
    if (!ok) { if (box.childElementCount) box.innerHTML = ''; return; }
    const p = W.player, sc = U.scale || 1, cx = Math.round(W.cam.x) + G.view.x, cy = Math.round(W.cam.y) + G.view.y, tg = W.target(), list = [], m = W.map; // ce que l'on voit de l'image : rogné en hauteur d'écran, agrandi si le joueur l'a voulu
    if (p.moving) still = now;
    W.npcs.forEach(n => { if (n.hidden || n.map !== m.id || !n.placed) return; const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < 60 || (tg && tg.ent === n && d < 150)) list.push({ k: 'n' + n.id, t: n.name, x: n.x, y: n.y, d, c: n.aura || '#f3e7cc' }); });
    list.sort((a, b) => a.d - b.d); list.length = Math.min(list.length, 5);
    if (now - still > 900) W.party.forEach((id, i) => { const tr = i ? W.trail[Math.min(W.trail.length - 1, i * 13)] : [p.x, p.y], h = W.saga.heroes[id]; if (tr) list.push({ k: 'h' + id, t: h.name, x: tr[0], y: tr[1], d: 0, c: (G.D > 1 && h.look && h.look.rayon) || D.ELEMENTS[h.el].color }); });
    const seen = {}, w = $('#stage').clientWidth, hh = $('#stage').clientHeight;
    list.forEach(e => { const x = (e.x - cx) * sc, y = (e.y - cy - 25) * sc; if (x < 8 || x > w - 8 || y < 4 || y > hh - 4) return; seen[e.k] = 1;
      let el = box.querySelector('[data-k="' + e.k + '"]'); if (!el) { el = I.el('span', 'nom', I.esc(e.t)); el.dataset.k = e.k; el.style.setProperty('--c', e.c); box.appendChild(el); }
      el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px'; });
    [...box.children].forEach(el => { if (!seen[el.dataset.k]) el.remove(); });
  };

  /* ---------- réglages d'affichage ---------- */
  // le dessin : fin (par défaut), fin et adouci, ou d'origine — gardé avec les autres réglages
  const dessinNom = () => I.t((G.DESSINS.find(d => d[0] === G.dessin()) || G.DESSINS[0])[1]);
  const dessinSuivant = () => { const i = G.DESSINS.findIndex(d => d[0] === G.dessin()), n = G.DESSINS[(i + 1) % G.DESSINS.length][0]; G.definir(n); I.save.data.opts.dessin = n; I.save.store(); };
  G.surDefinition.push(() => { titleBg = null; document.body.classList.toggle('fin', G.D > 1); document.body.classList.toggle('doux', !!G.lisse); });
  /* ----- l'agrandissement de l'image (2.x) -----
     Demande du décideur : sur un téléphone, les personnages sont trop petits — « il faut pouvoir zoomer dans l'image ».
     Pendant l'exploration, l'image s'agrandit de U.zf (1 à 3) autour de celui qui mène : on en voit moins, en plus grand.
     Deux doigts qui s'écartent sur l'image, la molette, le bouton « × » de la scène ou le réglage « Image ». Sans choix du
     joueur, sur un écran tactile où l'image est petite : × 1,5 tenu en hauteur, × 1,25 en largeur (où il reste moins de
     champ au-dessus du héros) ; × 1 ailleurs. Le combat garde son cadrage. */
  U.ZOOMS = [1, 1.5, 2, 3]; U.zf = 1;
  const tactile = () => !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const zoomAuto = (base, haut) => tactile() && base < 2.3 ? (haut ? 1.5 : 1.25) : 1;
  const zoomNom = () => '× ' + String(Math.round(U.zf * 100) / 100).replace('.', ',');
  const zoomBouton = () => { const b = $('#zoombtn'); if (b) { b.textContent = zoomNom(); b.setAttribute('aria-label', I.t('Agrandir l’image : {zoom}', { zoom: zoomNom() })); } };
  // garder = false : pendant que les doigts bougent (rien n'est écrit) ; sinon l'agrandissement est arrondi et gardé avec les réglages
  U.zoomer = function (z, garder) {
    z = I.clamp(+z || 1, 1, 3); if (garder !== false) { z = Math.round(z * 20) / 20; if (z < 1.08) z = 1; }
    const change = Math.abs(z - U.zf) > 0.0005; U.zf = z; U._zVif = garder === false;   // pendant le geste, la mise en page ne revient pas à la grandeur d'office
    if (garder !== false) { I.save.data.opts.zoom = z; I.save.store(); }
    if (change) layout(); zoomBouton(); return z;
  };
  U.zoomSuivant = () => U.zoomer(U.ZOOMS.find(z => z > U.zf + 0.01) || 1);
  U.TZ = [[I.T('normal'), 1], [I.T('grand'), 1.16], [I.T('très grand'), 1.34], [I.T('géant'), 1.55]];
  // la taille du texte : celle que le joueur a choisie ; sinon « grand » sur un écran tactile, « normal » ailleurs
  U.tz = () => { const o = I.save.data.opts; return typeof o.tz === 'number' && U.TZ[o.tz] ? o.tz : tactile() ? 1 : 0; };
  U.tzSuivant = () => { const o = I.save.data.opts; o.tz = (U.tz() + 1) % U.TZ.length; I.save.store(); U.applyOpts(); };
  U.applyOpts = function () {
    const o = I.save.data.opts;
    if (o.dessin && !G.defForce) G.definir(o.dessin); document.body.classList.toggle('fin', G.D > 1); document.body.classList.toggle('doux', !!G.lisse);
    document.documentElement.style.setProperty('--tz', U.TZ[U.tz()][1]);
    document.body.classList.toggle('padon', !!o.pad);
    if (typeof o.zoom === 'number') U.zf = I.clamp(o.zoom, 1, 3);   // sinon : la grandeur d'office, que la mise en page règle sur l'écran
    layout(); zoomBouton();
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
    // U.base : points d'écran par point logique ; U.Z : l'agrandissement voulu par le joueur, pendant l'exploration seulement ;
    // U.scale : les deux ensemble — c'est l'échelle de ce que l'on voit
    U.zoom = zoom; U.base = h / G.PH;
    if (typeof I.save.data.opts.zoom !== 'number' && !U._zVif) { const za = zoomAuto(U.base, portrait); if (za !== U.zf) { U.zf = za; zoomBouton(); } }   // sans choix du joueur : selon l'écran, et il suit le téléphone que l'on tourne
    U.Z = I.scene === W ? U.zf : 1; U.scale = U.base * U.Z; U._sceneW = I.scene === W;
    const vw = Math.min(G.PW, w / U.scale), vh = Math.min(G.PH, h / U.scale);
    const changed = Math.abs(G.view.w - vw) > 0.01 || Math.abs(G.view.h - vh) > 0.01; G.view.w = vw; G.view.h = vh;
    if (I.scene !== W) { G.view.x = G.view.t = Math.round((G.PW - vw) / 2); G.view.y = G.view.ty = 0; if (changed && I.battle.active) I.battle.relayout(); } else if (changed && W.map) W.updateCam(true);
    document.body.classList.toggle('zoom', w / U.base < G.PW - 0.5);   // « zoom » : l'image rognée d'un écran en hauteur (pas l'agrandissement voulu)
    document.body.classList.toggle('agrandi', U.Z > 1.01);
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
    const where = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * G.PW + G.cale(W.cam.x), (e.clientY - r.top) / r.height * G.PH + G.cale(W.cam.y)]; };
    // deux doigts sur l'image : l'agrandir ou la réduire (2.x). Le premier doigt n'est alors plus un toucher.
    const doigts = new Map(); let pince = null;
    const ecart = () => { const a = [...doigts.values()]; return Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); };
    U.pince = () => !!pince;
    st.addEventListener('pointerdown', e => {
      if (e.button || !bare(e)) return;
      I.audio.unlock();
      if (e.pointerType !== 'mouse') { doigts.set(e.pointerId, [e.clientX, e.clientY]);
        if (doigts.size >= 2) { if (ptr) { ptr.world = false; ptr.dead = true; ptr.pince = true; }
          if (doigts.size === 2 && I.scene === W && !U.menuOpen && !I.debug.auto && !I.debug.walk) { pince = { d0: Math.max(24, ecart()), z0: U.zf }; W.stop(); e.preventDefault(); } return; } }
      ptr = { id: e.pointerId, world: free(), x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now(), hold: false, last: 0 };
      if (ptr.world) { e.preventDefault(); try { st.setPointerCapture(e.pointerId); } catch (x) { /* sans capture : le relâchement suffit */ } }
    });
    st.addEventListener('pointermove', e => {
      const d = doigts.get(e.pointerId); if (d) { d[0] = e.clientX; d[1] = e.clientY; if (pince && doigts.size >= 2) { U.zoomer(pince.z0 * ecart() / pince.d0, false); return; } }
      if (!ptr || ptr.id !== e.pointerId) return; ptr.x = e.clientX; ptr.y = e.clientY; if (Math.hypot(e.clientX - ptr.x0, e.clientY - ptr.y0) > 14) ptr.hold = true; });
    const up = e => {
      if (doigts.delete(e.pointerId) && pince && doigts.size < 2) { pince = null; U.zoomer(U.zf); }   // les doigts se lèvent : l'agrandissement est gardé
      if (!ptr || ptr.id !== e.pointerId) return;
      const q = ptr; ptr = null; if (q.pince) return;
      if (!q.world) { if (q.dead || e.type === 'pointercancel' || !$('#choice').hidden || I.battle.active || U.menuOpen) return; I.input.emit('ok'); return; }
      if (!free()) return;
      if (q.hold || e.type === 'pointercancel') W.stop(); else { const p = where(e); W.tap(p[0], p[1]); }
    };
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
    // la molette, sur l'image : agrandir, réduire
    st.addEventListener('wheel', e => { if (!bare(e) || I.scene !== W || U.menuOpen || !e.deltaY) return; e.preventDefault(); U.zoomer(U.zf * (e.deltaY < 0 ? 1.12 : 1 / 1.12)); }, { passive: false });
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
    { let l = I.save.data.opts.lang; try { const q = /[?&]lang=([a-z]+)/.exec(location.search); if (q) l = q[1]; } catch (e) { /* hors navigateur */ } I.langue.choisir(l); }   // ?lang= : pour les contrôles
    U.applyOpts();
    I.input.push(a => W.onInput(a));
    document.addEventListener('visibilitychange', () => { if (document.hidden && I.scene === W && W.map && W.saga && !S.busy && !W.lock && !I.debug.auto) W.checkpoint(); });
    $('#dialog').addEventListener('click', () => I.input.emit('ok'));
    $('#card').addEventListener('click', () => I.input.emit('ok'));
    $('#battle .banner').addEventListener('click', () => I.input.emit('ok'));
    // en combat, on choisit une cible en la touchant elle-même, pas seulement sa plaque
    { const pt = e => { const r = cvEl.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * G.PW, (e.clientY - r.top) / r.height * G.PH]; }, hors = e => !I.battle.active || (e.target.closest && e.target.closest('button, .cmd, .banner'));
      $('#battle').addEventListener('click', e => { if (hors(e)) return; const q = pt(e); if (I.battle.touche(q[0], q[1])) e.stopPropagation(); });
      $('#battle').addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && !hors(e)) { const q = pt(e); I.battle.survol(q[0], q[1]); } }); }
    $('#menubtn').addEventListener('click', e => { e.stopPropagation(); if (I.scene === W && !S.busy) U.pause(); });
    $('#buildbtn').addEventListener('click', e => { e.stopPropagation(); W.stop(); I.build.set(!I.build.on); });
    $('#helpbtn').addEventListener('click', e => { e.stopPropagation(); W.stop(); U.guide(); });
    $('#zoombtn').addEventListener('click', e => { e.stopPropagation(); W.stop(); U.zoomSuivant(); });
    pad(); pointer();
    // tout geste déverrouille ou relance le son, y compris un toucher sur un bouton de menu (qui ne passe pas par les commandes du jeu)
    ['pointerup', 'touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, () => I.audio.unlock(), true));
    $('#secours button').addEventListener('click', ev => { ev.stopPropagation(); U.secours(); });
    I.onError = msg => { if (!I.debug.auto) S.toast(I.t('Incident technique (le jeu continue) : <b>{message}</b>', { message: I.esc(msg.slice(0, 90)) }), 7000); };
    let last = performance.now();
    (function frame(now) {
      I.audio.pump(); // la musique avance aussi à chaque image
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const sc = I.scene;
      if (sc) { try {
        if ((document.body.classList.contains('portrait') && (sc === W || I.battle.active)) !== !!U.zoom || (U.zoom && (sc === W) !== U.zoomW) || (sc === W) !== !!U._sceneW) { U.zoomW = sc === W; layout(); }
        if (I.debug.walk && sc === W) { for (let i = 0; i < 40 && I.scene === W; i++) { if (!S.busy && !W.lock) { if (I.debug.walk === 'tap') W.tapStep(); else W.walkStep(); } W.update(1 / 60); } I.input.clearHeld(); }
        else { U.pointerTick(now); if (sc.update) sc.update(dt); }
        G.present(dt, sc.render(dt) || {});
      } catch (e) { if (!U._err) U._err = e; I.report(e, 'affichage'); } }
      if ((U._vf = (U._vf || 0) + 1) % 30 === 0) U.veille(now);
      if ((U._nf = (U._nf || 0) + 1) % 3 === 0) U.noms(now);
      { const Zc = U.Z || 1, tx = U.zoom || Zc > 1 ? -G.view.x * U.scale : 0, ty = Zc > 1 ? -G.view.y * U.scale : 0, tr = Zc > 1 ? 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + Zc + ')' : tx ? 'translateX(' + tx + 'px)' : '';
        if (tr !== U._tr) { U._tr = tr; cvEl.style.transform = tr; } }   // l'image glisse sous la scène, et grandit si le joueur l'a voulu
      $('#menubtn').hidden = !(I.scene === W && !S.busy && !$('#hud').hidden); $('#helpbtn').hidden = $('#menubtn').hidden; $('#zoombtn').hidden = $('#menubtn').hidden;
      $('#buildbtn').hidden = $('#menubtn').hidden || !W.saga || (W.saga.frame && !W.saga.veillees) || !I.build.outdoor(W.map.id);
      { const bt = !$('#buildbtn').hidden; if (bt !== U._bt) { U._bt = bt; document.body.classList.toggle('batir', bt); } }
      if (I.build.on) $('#buildbar').hidden = S.busy || I.scene !== W;
      I.trade.drawCompass(now / 1000);
      requestAnimationFrame(frame);
    })(last);
    const go = () => U.showTitle();
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.load('700 40px "Reem Kufi"', 'عمر').catch(() => {}), new Promise(r => setTimeout(r, 1500))]).then(go); else go();
  };
})();
