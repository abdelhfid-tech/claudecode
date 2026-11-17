#!/usr/bin/env node
/* ISNAD 2.x — les shorts : de courts films verticaux tirés du jeu lui-même, pour le faire connaître.
   Usage : node v2/tools/shorts.js [numéro ou nom…] [brouillon]
     node v2/tools/shorts.js               tous les scénarios de promo/shorts/
     node v2/tools/shorts.js 01            le premier seulement
     node v2/tools/shorts.js 01 brouillon  le même, en demi-définition (pour régler un scénario)
   Sortie : promo/shorts/films/<nom>.mp4 (1080 × 1920, 30 images par seconde, H.264, son AAC) et <nom>.jpg, une planche
   d'images tirées du film, à relire. Les films ne sont pas versionnés : cette commande les refait.

   Comment c'est fait.
   · Le jeu assemblé (v2/index.html) est ouvert sur un écran de téléphone tenu en hauteur. Son horloge est simulée
     (page.clock) : chaque image du film fait avancer le jeu de 32 millièmes de seconde, puis est capturée. Le hasard est
     fixé. Le même scénario redonne donc le même film, sans une image floue ni un à-coup.
   · Un scénario (promo/shorts/NN-nom.js) dit où aller dans le jeu, quoi y faire, quelles phrases poser et quand.
   · Rien n'est inventé à l'image : les lieux, les personnages et les répliques sont ceux du jeu. Une réplique se
     demande par un fragment (s.dire) : l'outil la retrouve dans les données du jeu et le moteur la dit telle quelle.
   · Les phrases ajoutées (accroche, légendes, carton final) sont posées dans la page, avec les polices du jeu, hors
     des zones que les applications recouvrent. L'adresse du carton final n'est écrite qu'à un endroit : v2/tools/promotion.js.
   · Le son : des percussions seules. Le scénario écrit ses mesures ; le moteur de son du jeu les rend hors ligne
     (ISNAD.audio.render), sans mélodie ni voix (exigence 9).
   · Un plan d'ambiance généré par IA peut ouvrir un short (promo/shorts/plans-ia/, hors du dépôt) : un paysage, un
     lieu vide — jamais une personne, un animal, un texte ni un lieu saint. S'il manque, le short s'ouvre sur le jeu.
   Le jeu n'est pas modifié : l'outil n'écrit rien dans v2/src ni dans les fichiers assemblés. */
const fs = require('fs'), path = require('path'), { spawn, spawnSync } = require('child_process');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), RACINE = path.join(V2, '..'), JEU = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');
const SCN = path.join(RACINE, 'promo/shorts'), FILMS = path.join(SCN, 'films'), PRISES = path.join(SCN, '.prises'), PLANS = path.join(SCN, 'plans-ia');

/* ---------- ce que disent tous les shorts : écrit à un seul endroit, v2/tools/promotion.js ---------- */
const { ADRESSE, DEVISE, ETAT } = require('./promotion.js');

/* ---------- le film ---------- */
const L = 360, H = 640;        // l'écran du téléphone, en points ; × 3 = 1080 × 1920
const IPS = 30, PAS = 32;      // images par seconde ; millièmes de seconde de jeu par image (deux battements de l'horloge du jeu)
// zones que les applications recouvrent (en points d'écran) : rien d'écrit au-dessus de HAUT_SUR ni au-dessous de BAS_SUR
const HAUT_SUR = 70, BAS_SUR = 490;

const CSS = `
html, body { background: #06050d !important; }
body { padding-left: 0 !important; padding-right: 0 !important; }
#app { position: absolute !important; left: 0 !important; top: var(--film-haut, 0px) !important; width: ${L}px !important; height: var(--film-app, ${H}px) !important; padding-top: 0 !important; }
body:not(.f-pad) #pad { display: none !important; }
body.f-rangees #battle .heroes { display: none !important; }
body.f-panneau #battle .panel { visibility: hidden !important; }
body.f-bandeau #battle .banner { visibility: hidden !important; }
#stage { box-shadow: 0 0 0 1px rgba(233, 200, 119, .22) !important; }
body.f-boutons #menubtn, body.f-boutons #helpbtn, body.f-boutons #zoombtn, body.f-boutons #buildbtn { visibility: hidden !important; }
body.f-annonces #toasts { visibility: hidden !important; }
body.f-boussole #compass { visibility: hidden !important; }
body.f-hud #hud { visibility: hidden !important; }
body.f-noms #noms { visibility: hidden !important; }
body.f-titre #title { justify-content: flex-start !important; padding-top: 88px !important; overflow: hidden !important; }
body.f-titre #title .vmenu, body.f-titre #title .foot, body.f-titre #title .coin { display: none !important; }
#film { position: fixed; inset: 0; z-index: 900; pointer-events: none; overflow: hidden; }
#film-ia { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; }
#film-ombre { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6, 5, 13, .55), rgba(6, 5, 13, .1) 30%, rgba(6, 5, 13, .1) 60%, rgba(6, 5, 13, .7)); opacity: 0; }
#film-noir { position: absolute; inset: 0; background: #000; opacity: 0; }
.film-doigt { position: absolute; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2px solid rgba(255, 246, 220, .95); background: rgba(255, 246, 220, .22); box-shadow: 0 0 14px rgba(0, 0, 0, .6); opacity: 0; }
#film-legendes { position: absolute; inset: 0; }
.film-leg { position: absolute; left: 20px; right: 20px; text-align: center; text-wrap: balance; opacity: 0; color: #f3e7cc; font-family: "Alegreya", Georgia, "Amiri", serif; font-size: 22px; line-height: 1.2; text-shadow: 0 1px 2px #000, 0 0 12px rgba(0, 0, 0, .95), 0 0 26px rgba(0, 0, 0, .8); }
.film-leg.accroche { font-family: "Cinzel", "Times New Roman", serif; font-weight: 700; font-size: 31px; letter-spacing: .03em; line-height: 1.12; color: #e9c877; }
.film-leg.titre { font-family: "Cinzel", "Times New Roman", serif; font-weight: 700; font-size: 23px; letter-spacing: .06em; line-height: 1.15; color: #e9c877; }
.film-leg.italique { font-style: italic; color: #fff6dc; }
.film-leg.petit { font-size: 14px; letter-spacing: .08em; color: #a79c86; }
.film-leg.adresse { font-family: "Cinzel", "Times New Roman", serif; font-weight: 700; font-size: 20px; letter-spacing: .05em; color: #f3e7cc; }
.film-leg.adresse span { display: inline-block; padding: .42em .9em .36em; border: 1px solid rgba(233, 200, 119, .75); background: rgba(10, 8, 20, .72); }
.film-leg b { color: #e9c877; font-weight: 700; }
.film-leg i { font-style: italic; }
.film-leg .filet { display: block; width: 5.2em; height: 1px; margin: .5em auto 0; background: linear-gradient(90deg, transparent, #e9c877, transparent); }
`;

/* ---------- ce qui est posé dans la page du jeu, le temps de la prise ---------- */
function installer() {
  const I = window.ISNAD, W = I.world, $ = q => document.querySelector(q);
  const hote = document.createElement('div'); hote.id = 'film';
  hote.innerHTML = '<img id="film-ia" alt="" hidden><div id="film-ombre"></div><div id="film-legendes"></div><div id="film-noir"></div>';
  document.body.appendChild(hote);
  const borne = (v, a, b) => Math.max(a, Math.min(b, v)), doux = x => x * x * (3 - 2 * x), sansApo = s => String(s).replace(/[’']/g, "'");
  const F = window.__film = { t: 0, calques: [], rampes: {}, ia: null, n: 0 };
  // le hasard : une suite fixée, que l'on peut reprendre à une graine donnée
  F.graine = g => { let a = g >>> 0; Math.random = function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  // les animations de l'interface (transitions, annonces, chiffres qui s'envolent) avancent au pas de l'horloge du jeu
  F.anims = () => { const now = performance.now(); for (const a of document.getAnimations()) { try {
    if (a.__f === undefined) { a.__f = now - Math.min(+a.currentTime || 0, 16); a.pause(); }
    const fin = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().endTime : Infinity, ct = now - a.__f;
    if (isFinite(fin) && ct >= fin) a.finish(); else a.currentTime = ct; } catch (e) { /* une animation déjà retirée */ } } };
  // une rampe : une valeur qui va de a à b entre t0 et t0 + d (secondes de film)
  F.rampe = (nom, vers, d) => { const r = F.rampes[nom] || { v: 0 }; F.rampes[nom] = { de: r.v, vers, t0: F.t, d: d || 0, v: d ? r.v : vers }; };
  const valeur = nom => { const r = F.rampes[nom]; if (!r) return 0; r.v = r.d ? r.de + (r.vers - r.de) * doux(borne((F.t - r.t0) / r.d, 0, 1)) : r.vers; return r.v; };
  F.legende = (html, o) => { const el = document.createElement('div'); el.className = 'film-leg ' + (o.style || ''); el.innerHTML = html;
    if (o.bas !== undefined) el.style.bottom = (640 - o.bas) + 'px'; else el.style.top = o.y + 'px';
    if (o.gauche !== undefined) el.style.left = o.gauche + 'px'; if (o.droite !== undefined) el.style.right = o.droite + 'px';
    if (o.taille) el.style.fontSize = o.taille + 'px';
    $('#film-legendes').appendChild(el); const c = { el, t0: o.t0, t1: o.t1, fi: o.fi, fo: o.fo, dy: o.dy }; F.calques.push(c); return el.getBoundingClientRect().toJSON(); };
  F.effacer = () => { F.calques.forEach(c => c.el.remove()); F.calques = []; };
  F.defiler = (sel, vers, d) => { const el = $(sel); if (el) F.defile = { el, de: el.scrollTop, vers, t0: F.t, d }; };
  // le doigt du joueur : un rond qui se pose (tap) ou qui glisse de (x0, y0) à (x1, y1)
  F.doigt = (x0, y0, x1, y1, d, dans) => { const el = document.createElement('div'); el.className = 'film-doigt'; hote.insertBefore(el, $('#film-noir')); (F.doigts = F.doigts || []).push({ el, x0, y0, x1: x1 === undefined ? x0 : x1, y1: y1 === undefined ? y0 : y1, t0: F.t + (dans || 0), d: d || 0.45, tap: x1 === undefined }); };
  // une image du film : t, en secondes de film
  F.pas = async t => { F.t = t; F.n++; F.anims();
    F.calques = F.calques.filter(c => { if (t > c.t1 + 0.05) { c.el.remove(); return false; }
      const a = doux(borne((t - c.t0) / c.fi, 0, 1)) * doux(borne((c.t1 - t) / c.fo, 0, 1)); c.el.style.opacity = a.toFixed(3); c.el.style.transform = 'translateY(' + ((1 - doux(borne((t - c.t0) / c.fi, 0, 1))) * c.dy).toFixed(2) + 'px)'; return true; });
    $('#film-noir').style.opacity = valeur('noir').toFixed(3); $('#film-ombre').style.opacity = valeur('ombre').toFixed(3);
    if (F.rampes.zoom && F.rampes.zoom.d) { const z = valeur('zoom'); I.ui.zoomer(z, false); }
    if (F.defile) { const q = F.defile, k = doux(borne((t - q.t0) / q.d, 0, 1)); q.el.scrollTop = q.de + (q.vers - q.de) * k; if (k >= 1) F.defile = null; }
    F.doigts = (F.doigts || []).filter(q => { const k = (t - q.t0) / q.d; if (k >= 1) { q.el.remove(); return false; } const x = q.x0 + (q.x1 - q.x0) * doux(borne(k, 0, 1)), y = q.y0 + (q.y1 - q.y0) * doux(borne(k, 0, 1)); q.el.style.left = x + 'px'; q.el.style.top = y + 'px'; q.el.style.opacity = (k < 0 ? 0 : Math.min(1, k * 8) * Math.min(1, (1 - k) * 4)).toFixed(3); q.el.style.transform = 'scale(' + (q.tap ? 0.7 + 0.5 * borne(k, 0, 1) : 1).toFixed(3) + ')'; return true; });
    const img = $('#film-ia');
    if (F.ia) { const q = F.ia, i = Math.max(1, Math.min(q.n, 1 + Math.floor((t - q.t0) * q.ips + 1e-6))), src = q.base + String(i).padStart(4, '0') + '.jpg';
      img.hidden = false; img.style.opacity = (q.fondu ? doux(borne((q.t1 - t) / q.fondu, 0, 1)) : 1).toFixed(3);
      if (img.dataset.src !== src) { img.dataset.src = src; img.src = src; try { await img.decode(); } catch (e) { /* image suivante */ } }
      if (t >= q.t1 - 1e-6) { F.ia = null; img.hidden = true; } }
    else if (!img.hidden) img.hidden = true;
  };
  F.cadre = (haut, app) => { const st = document.documentElement.style; st.setProperty('--film-haut', haut + 'px'); st.setProperty('--film-app', app + 'px'); window.dispatchEvent(new Event('resize')); const r = $('#stage').getBoundingClientRect(); return [r.top, r.height]; };
  F.propre = o => { const b = document.body.classList; ['boutons', 'annonces', 'boussole', 'hud', 'noms'].forEach(k => b.toggle('f-' + k, !o[k])); F.sansCible = o.cible === false;
    b.toggle('f-pad', !!o.pad); b.toggle('f-rangees', !o.rangees); b.toggle('f-panneau', o.panneau === false); b.toggle('f-bandeau', o.bandeau === false);
    const m = W.map; if (m) { if (!o.carte) { if (m.mini) m._mini = m.mini; m.mini = null; } else if (m._mini) { m.mini = m._mini; m._mini = null; } } };
  // une réplique du jeu, retrouvée par un fragment : ['say' | 'nar' | 'quote' | 'title', …] tel que le récit l'écrit
  F.trouver = (saga, frag) => { const vu = new Set(), but = sansApo(frag); let r = null;
    (function f(o) { if (r || !o || typeof o !== 'object' || vu.has(o)) return; vu.add(o);
      if (Array.isArray(o) && ['say', 'nar', 'quote', 'title'].includes(o[0]) && o.some(x => typeof x === 'string' && sansApo(x).includes(but))) { r = o; return; }
      for (const k in o) f(o[k]); })(I.sagas[saga]); return r; };
  F.dire = (saga, frag) => { const op = F.trouver(saga, frag); if (!op) return null; F.parle = true; I.script.run([op]).then(() => { F.parle = false; }, () => { F.parle = false; }); return op; };
  // le jeu automatique s'arrête quand la condition devient vraie, au repos, entre deux objectifs
  const pasAuto = W.autoStep; W.autoStep = function () { if (F.arret) { let k = false; try { k = F.arret(W, I); } catch (e) { k = false; } if (k) { I.debug.auto = false; I.speed = 1; F.arret = null; F.arrete = true; return; } } return pasAuto.apply(this, arguments); };
  F.jusqua = src => { F.arret = new Function('W', 'I', 'return (' + src + ')'); F.arrete = false; I.debug.auto = true; I.speed = 30; };
  F.repos = () => !I.script.busy && !W.lock && I.scene === W && !I.battle.active;
  F.etat = () => ({ saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, obj: W.objIndex, map: W.map && W.map.id, x: Math.round(W.player.x), y: Math.round(W.player.y), dir: W.player.dir, busy: I.script.busy, lock: !!W.lock, combat: !!I.battle.active, Z: I.ui.Z, vue: [I.gfx.view.w, I.gfx.view.h].map(v => +v.toFixed(1)), scene: [$('#stage').getBoundingClientRect().top, $('#stage').getBoundingClientRect().height] });
  // place celui qui mène sur un lieu nommé (décalage en points), ses compagnons en file derrière lui
  F.poser = (lieu, dx, dy, dir, tx, ty) => { const P = W.player; if (!W.map.spots[lieu]) return false; const s = W.resolve(lieu, W.map.id, P); if (!s || isNaN(s[0])) return false;
    P.x = s[0] + (dx || 0); P.y = s[1] + (dy || 0); if (dir !== undefined && dir !== null) P.dir = dir; W.stop();
    W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x + (tx || 0) * i * 1.25, P.y + (ty || 0) * i * 1.25, P.dir]);
    W.updateCam(true); return [Math.round(P.x), Math.round(P.y)]; };
  // tout refermer, comme la reprise de secours du jeu : récit en attente, combat, cartons, écrans
  F.raz = () => { if (I.battle.active) { try { I.battle.abort(W); } catch (e) { /* le combat se refermait déjà */ } } I.debug.auto = false; I.speed = 1; F.arret = null; I.script.depth = 0; W.lock = false; W._autoBusy = false; I.ui.menuOpen = false; I.script.hideDialog(); $('#choice').hidden = true; document.body.classList.remove('in-dialog', 'in-screen', 'in-build', 'noir');
    const c = $('#card'); c.classList.remove('on'); c.hidden = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); const f = $('#fade'); f.style.transition = 'none'; f.style.opacity = 0; };
  F.occupe = () => I.script.busy || !!I.battle.active || !!W.lock;
  // l'étoile qui montre l'objectif au bord de l'image, et le losange au-dessus de lui : on peut les retirer d'un plan
  const cible0 = W.target; W.target = function () { return F.sansCible ? null : cible0.apply(this, arguments); };
  F.ecran = (wx, wy) => { const U = I.ui, G = I.gfx, st = $('#stage').getBoundingClientRect(); return [st.left + (wx - G.cale(W.cam.x) - G.view.x) * U.scale, st.top + (wy - G.cale(W.cam.y) - G.view.y) * U.scale]; };
  I.audio.setOn(false);
  return true;
}

/* ---------- le plateau : ce qu'un scénario a sous la main ---------- */
class Plateau {
  constructor(scn, o) { this.scn = scn; this.brouillon = !!o.brouillon; this.sansFilm = !!o.sansFilm; this.n = 0; this.erreurs = []; this.journal = []; this.marques = []; this._propre = {}; }
  get t() { return this.n / IPS; }
  dit(m) { console.log('  · ' + m); }
  async ouvrir() {
    fs.mkdirSync(FILMS, { recursive: true }); fs.mkdirSync(PRISES, { recursive: true });
    this.browser = await chromium.launch(); this.voiles = { noir: 0, ombre: 0 }; this._cadre = 'ecran';
    await this.neuf();
    if (this.sansFilm) return;
    // le film : les images vont droit à l'encodeur
    this.video = path.join(PRISES, this.scn.id + '.video.mp4');
    this.ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(IPS), '-i', '-', '-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-preset', this.brouillon ? 'veryfast' : 'slow', '-crf', this.brouillon ? '23' : '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(IPS), this.video], { stdio: ['pipe', 'inherit', 'inherit'] });
    this.ffFin = new Promise(r => this.ff.on('close', r));
  }
  // une page neuve du jeu : rien n'y traîne d'un plan précédent (récit en attente, combat, écran ouvert). Le film, lui, continue.
  async neuf() {
    if (this.ctx) await this.ctx.close();
    this.ctx = await this.browser.newContext({ viewport: { width: L, height: H }, deviceScaleFactor: this.brouillon ? 1.5 : 3, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent });
    const p = this.p = await this.ctx.newPage(); this.pages = (this.pages || 0) + 1;
    p.on('pageerror', e => this.erreurs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') this.erreurs.push('console: ' + m.text()); });
    await p.clock.install({ time: new Date('2026-01-01T10:00:00Z') });
    await p.goto(JEU); await p.waitForFunction(() => window.ISNAD && window.ISNAD.scene && !document.querySelector('#title').hidden, null, { timeout: 15000 }); await p.waitForTimeout(350);
    await p.addStyleTag({ content: CSS });
    await p.evaluate(installer);
    await p.evaluate(() => Promise.all(['700 30px Cinzel', '500 20px Cinzel', '400 20px Alegreya', 'italic 400 20px Alegreya', '700 20px Alegreya', '500 20px "Reem Kufi"', '700 20px "Reem Kufi"', '400 20px Amiri', '400 14px "Share Tech Mono"'].map(f => document.fonts.load(f).catch(() => {}))));
    const t0 = await p.evaluate(() => Date.now()); await p.clock.pauseAt(new Date(t0 + 64));
    await this.ev(([g, v, t]) => { const I = window.ISNAD, F = window.__film; F.graine(g); F.t = t; I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.input.reset(); I.setScene(I.ui.blank); F.rampe('noir', v.noir, 0); F.rampe('ombre', v.ombre, 0); document.querySelector('#film-noir').style.opacity = v.noir; },
      [this.scn.graine || 632, this.voiles, this.t]);
    await this.cadre(this._cadre); await this.propre();
  }
  ev(fn, arg) { return this.p.evaluate(fn, arg); }
  /* --- le temps --- */
  // le pas du jeu par image : 1 = allure normale ; 0,5 = ralenti (le jeu avance d'un seul battement par image)
  ralenti(k) { this.pasJeu = Math.max(16, Math.round(PAS * (k || 1) / 16) * 16); }
  async image() {
    await this.p.clock.runFor(this.pasJeu || PAS);
    await this.p.evaluate(t => window.__film.pas(t), this.t);
    if (this.ff) { const buf = await this.p.screenshot({ type: 'png' }); if (!this.ff.stdin.write(buf)) await new Promise(r => this.ff.stdin.once('drain', r)); }
    this.n++;
  }
  // filme pendant `sec` secondes ; `fn(t, i)` est appelée avant chaque image (t : secondes depuis le début du plan)
  async tourner(sec, fn) { await this.propre(this._propre); const n = Math.max(1, Math.round(sec * IPS)); for (let i = 0; i < n; i++) { if (fn) await fn(i / IPS, i); await this.image(); } }
  // fait avancer le jeu sans filmer
  async avancer(ms) { for (let r = ms; r > 0; r -= 96) await this.p.clock.runFor(Math.min(96, r)); await this.ev(() => window.__film.anims()); }
  async jusqua(fn, arg, max) { for (let e = 0; e < (max || 40000); e += 96) { if (await this.ev(fn, arg)) return true; await this.p.clock.runFor(96); } this.dit('! condition non atteinte : ' + String(fn).slice(0, 90)); return false; }
  marque(nom) { this.marques.push([nom, +this.t.toFixed(2)]); }
  /* --- le cadre : où se pose la scène du jeu dans l'image, et ce qu'on y laisse voir --- */
  // 'carre' : la scène du jeu en haut, carrée (1080 × 1080), le texte dessous — celui du jeu ou une légende ; 'ecran' : l'écran du
  // téléphone tel quel (combat, écrans du jeu) ; sinon { haut, scene } : la scène commence à `haut` points et en fait `scene` de haut
  async cadre(c) { this._cadre = c; const P = { ecran: { haut: 0, app: H }, carre: { haut: 0, scene: L } }[c] || c;
    const app = P.app || Math.ceil(P.scene / 0.47) + 1, r = await this.ev(([h, a]) => window.__film.cadre(h, a), [P.haut, app]); await this.p.clock.runFor(PAS); this.scene = { haut: r[0], h: r[1] }; return this.scene; }
  // ce que l'on garde de l'interface : rien par défaut (ni boutons, ni annonces, ni boussole, ni plan, ni bandeau, ni étiquettes)
  propre(o) { this._propre = o || this._propre || {}; return this.ev(o => window.__film.propre(o), Object.assign({ boutons: false, annonces: false, boussole: false, hud: false, noms: false, carte: false, cible: true }, this._propre)); }
  // une image fixe, pour régler un scénario
  photo(nom) { return this.p.screenshot({ path: path.join(PRISES, nom + '.png') }); }
  zoom(z, sec) { return sec ? this.ev(([z, d]) => { const F = window.__film; F.rampes.zoom = F.rampes.zoom || { v: window.ISNAD.ui.zf }; F.rampe('zoom', z, d); }, [z, sec]) : this.ev(z => { window.__film.rampes.zoom = { v: z, vers: z, d: 0 }; window.ISNAD.ui.zoomer(z, false); }, z); }
  /* --- le jeu --- */
  // ouvre un chapitre à un point de passage : { obj, carte, lieu, groupe, opts, drapeaux } ; sans point de passage, il se joue depuis son ouverture
  // termine sans le filmer ce qui est en cours (une réplique, une conversation, un combat) : le jeu le joue tout seul, vite
  async finir(max) {
    const occupe = () => this.ev(() => window.__film.occupe());
    if (await occupe()) { await this.ev(() => window.__film.jusqua('true'));
      for (let i = 0; i < (max || 400); i++) { if (await this.ev(() => window.__film.arrete || !window.__film.occupe())) break; if (i % 3 === 0) await this.p.keyboard.press('Enter'); await this.p.clock.runFor(96); }
      await this.ev(() => { const I = window.ISNAD; I.debug.auto = false; I.speed = 1; window.__film.arret = null; }); await this.avancer(200); }
    if (await occupe()) { this.dit('reprise forcée : ce qui était en cours est refermé'); await this.ev(() => window.__film.raz()); await this.avancer(200); }
  }
  async chapitre(saga, ci, cp) {
    if (await this.ev(() => window.__film.occupe() || !!document.querySelector('.screen:not([hidden])') || !document.querySelector('#card').hidden)) await this.neuf();   // le plan d'avant a laissé quelque chose en cours : on repart d'une page neuve
    await this.ev(([saga, ci, cp]) => { const I = window.ISNAD, W = I.world, ch = I.sagas[saga].chapters[ci]; I.debug.auto = false; I.speed = 1; W.roster = {}; W.saga = null; window.__film.arret = null;
      const pt = cp ? { party: cp.groupe || ch.party, obj: cp.obj || 0, flags: cp.drapeaux || {}, map: cp.carte || ch.map, opts: cp.opts || ch.opts || {}, pos: cp.lieu || ch.start, foes: cp.vaincus || [], chests: [], npcs: {} } : undefined;
      if (!pt) window.__film.jusqua('true');   // depuis l'ouverture : le jeu passe les cartons tout seul et s'arrête au premier repos
      I.speed = 30; window.__film.pret = false; W.startChapter(saga, ci, pt).then(() => { window.__film.pret = true; }); }, [saga, ci, cp || null]);
    await this.jusqua(cp ? () => window.__film.pret : () => window.__film.arrete, null, 60000); await this.ev(() => { const I = window.ISNAD; I.debug.auto = false; I.speed = 1; window.__film.arret = null; }); await this.avancer(200);
    await this.propre();
    return this.etat();
  }
  etat() { return this.ev(() => window.__film.etat()); }
  // le jeu joue tout seul, sans être filmé, jusqu'à ce que la condition (une expression en W et I) soit vraie au repos
  async aller(cond, max) { await this.ev(c => window.__film.jusqua(c), cond); const ok = await this.jusqua(() => window.__film.arrete, null, max || 240000); await this.ev(() => { const I = window.ISNAD; I.debug.auto = false; I.speed = 1; window.__film.arret = null; }); await this.avancer(300); if (!ok) this.dit('! arrêt non atteint : ' + cond); return ok; }
  poser(lieu, dx, dy, dir, tx, ty) { return this.ev(a => window.__film.poser(...a), [lieu, dx || 0, dy || 0, dir === undefined ? null : dir, tx || 0, ty || 0]); }
  // une réplique du jeu, retrouvée par un fragment de son texte ; elle s'écrit pendant que l'on filme
  async dire(saga, frag) { const op = await this.ev(([s, f]) => window.__film.dire(s, f), [saga, frag]); if (!op) { this.dit('! réplique introuvable dans « ' + saga + ' » : ' + frag); this.erreurs.push('réplique introuvable : ' + frag); } else this.journal.push(op.filter(x => typeof x === 'string').slice(1).join(' — ')); return op; }
  touche(k) { return this.p.keyboard.press(k); }
  tenir(k) { return this.p.keyboard.down(k); }
  lacher(k) { return this.p.keyboard.up(k); }
  toucher(x, y) { return this.p.touchscreen.tap(x, y); }
  // toucher un point du lieu (en points du monde), ou un personnage : le doigt du joueur
  async toucherMonde(wx, wy) { const q = await this.ev(a => window.__film.ecran(a[0], a[1]), [wx, wy]); await this.p.touchscreen.tap(q[0], q[1]); return q; }
  async toucherPnj(id) { const n = await this.ev(id => { const n = window.ISNAD.world.npcs.find(n => n.id === id); return n ? [n.x, n.y] : null; }, id); if (!n) { this.dit('! personnage absent : ' + id); return null; } return this.toucherMonde(n[0], n[1] - 10); }
  // ouvre un combat dans le chapitre en cours ; une idole se déclare (la page de préparation est passée) ; rend la main quand les commandes sont là
  async combat(groupe, o) { o = o || {};
    await this.ev(([g, o]) => { window.ISNAD.battle.start({ group: g, bg: o.fond || 'noos', boss: !!o.idole, sansReprise: true }); }, [groupe, o]);
    if (o.idole) { await this.jusqua(() => !!document.querySelector('.screen:not([hidden]) button, #choice:not([hidden]) .opt'), null, 8000); await this.avancer(300); await this.touche('Enter'); }
    await this.jusqua(() => !!document.querySelector('#battle .cmd .mi'), null, 30000); await this.avancer(o.attente === undefined ? 400 : o.attente); }
  // le combat se joue tout seul (comme le joueur de test), à l'allure normale : de l'action, sans menu qui attend
  auto(on) { return this.ev(on => { const I = window.ISNAD; I.debug.auto = !!on; I.speed = 1; }, on !== false); }
  defiler(sel, vers, sec) { return this.ev(([s, v, d]) => window.__film.defiler(s, v, d), [sel, vers, sec]); }
  // montre le doigt : un toucher en (x, y), ou un glissé jusqu'à (x1, y1) — en points de l'écran
  doigt(x, y, x1, y1, sec, dans) { return this.ev(a => window.__film.doigt(...a), [x, y, x1, y1, sec, dans]); }
  // ce que le jeu dit d'un récit : son nom, sa Lumière, ses années, sa phrase
  recit(id) { return this.ev(id => { const g = window.ISNAD.sagas[id]; return { nom: g.name, epithete: g.epithet, lumiere: g.lightName, annees: g.years, phrase: g.tagline }; }, id); }
  // passe ce qui est affiché (carton, dialogue) sans le filmer
  async passer(n) { for (let i = 0; i < (n || 1); i++) { await this.touche('Enter'); await this.avancer(420); } }
  // avance le récit sans le filmer jusqu'à la réplique qui contient ce fragment, écrite en entier
  async jusquaReplique(frag, max) { const vu = () => this.ev(f => { const d = document.querySelector('#dialog'), t = document.querySelector('#dialog .text'), c = document.querySelector('#card'), ok = s => String(s).replace(/[’']/g, "'").includes(f.replace(/[’']/g, "'"));
      return (!d.hidden && document.querySelector('#dialog .next').style.visibility === 'visible' && ok(t.textContent)) || (!c.hidden && ok(c.textContent)); }, frag);
    for (let i = 0; i < (max || 60); i++) { if (await vu()) return true; await this.touche('Enter'); await this.avancer(300); } this.dit('! réplique non atteinte : ' + frag); return false; }
  texte() { return this.ev(() => { const d = document.querySelector('#dialog'); return d.hidden ? null : [document.querySelector('#dialog .name').textContent, document.querySelector('#dialog .text').textContent]; }); }
  /* --- ce qui se pose sur l'image --- */
  // une phrase : { zone: 'sous' la scène (d'office) | 'sur' elle, ou y | bas en points ; duree ; style : 'accroche' | 'titre' | 'petit' ;
  // dans : secondes d'attente ; fi, fo : entrée et sortie }
  legende(html, o) { o = o || {}; const t0 = this.t + (o.dans || 0), t1 = t0 + (o.duree || 2.4);
    const y = o.y !== undefined || o.bas !== undefined ? o.y : o.zone === 'sur' ? HAUT_SUR + 6 : Math.round(this.scene.haut + this.scene.h + (o.marge === undefined ? 24 : o.marge));
    return this.ev(([h, o]) => window.__film.legende(h, o), [html, { y, bas: o.bas, style: o.style || '', taille: o.taille, t0, t1, fi: o.fi === undefined ? 0.28 : o.fi, fo: o.fo === undefined ? 0.24 : o.fo, dy: o.dy === undefined ? 7 : o.dy, gauche: o.gauche, droite: o.droite }]); }
  effacer() { return this.ev(() => window.__film.effacer()); }
  noir(v, sec) { this.voiles.noir = v; return this.ev(([v, d]) => window.__film.rampe('noir', v, d), [v, sec || 0]); }
  ombre(v, sec) { this.voiles.ombre = v; return this.ev(([v, d]) => window.__film.rampe('ombre', v, d), [v, sec || 0]); }
  // un plan d'ambiance (promo/shorts/plans-ia/<nom>.mp4), en plein cadre pendant `sec` secondes ; `fondu` : il se dissout dans le jeu
  async plan(nom, sec, o) { o = o || {}; const src = path.join(PLANS, nom + '.mp4'); if (!fs.existsSync(src)) { this.dit('plan d’ambiance absent (' + nom + ') : le short s’ouvre sur le jeu'); return false; }
    const dos = path.join(PRISES, 'plan-' + nom); if (!fs.existsSync(path.join(dos, '0001.jpg'))) { fs.mkdirSync(dos, { recursive: true }); const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(o.de || 0), '-i', src, '-vf', `fps=${IPS},scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920`, '-q:v', '2', path.join(dos, '%04d.jpg')]); if (r.status) { this.dit('! plan illisible : ' + nom); return false; } }
    const n = fs.readdirSync(dos).filter(f => /^\d{4}\.jpg$/.test(f)).length;
    await this.ev(q => { window.__film.ia = q; }, { base: 'file://' + dos + '/', n, ips: IPS, t0: this.t, t1: this.t + sec, fondu: o.fondu || 0 }); return true; }
  /* --- le carton final : l'écran-titre du jeu, la devise, l'adresse --- */
  async carton(sec) {
    await this.noir(1, 0.2); await this.tourner(0.2);
    await this.effacer(); this._cadre = 'ecran'; await this.neuf();
    await this.ev(() => { const I = window.ISNAD; I.debug.auto = false; I.speed = 1; document.body.classList.add('f-titre'); document.querySelector('#dialog').hidden = true; document.querySelector('#card').hidden = true; I.ui.showTitle(); });
    await this.avancer(400);
    const bas = Math.max(this.scene.haut + this.scene.h, await this.ev(() => document.querySelector('#title .tag').getBoundingClientRect().bottom));   // sous l'image de l'écran-titre
    await this.noir(0, 0.3);
    await this.legende('« ' + DEVISE + ' »', { y: bas + 26, style: 'italique', taille: 23, duree: sec, dans: 0.25, fo: 0.01 });
    await this.legende('<span>' + ADRESSE + '</span>', { y: bas + 104, style: 'adresse', duree: sec, dans: 0.7, fo: 0.01 });
    await this.legende(ETAT, { y: bas + 164, style: 'petit', duree: sec, dans: 1.1, fo: 0.01 });
    await this.tourner(sec);
  }
  /* --- la fin : le film, le son, la planche --- */
  async fermer() {
    if (this.ff) { this.ff.stdin.end(); await this.ffFin; }
    let wav = null; if (this.ff && this.scn.rythme) { const c2 = await this.browser.newContext(), p2 = await c2.newPage(); await p2.goto(JEU); await p2.waitForTimeout(900); wav = await this.bande(p2); }   // une page à part, à l'horloge vraie, pour le son et rien d'autre
    await this.browser.close(); return wav;
  }
  // les percussions : rythme = [{ a, b?, fois? }] — deux voix, écrites pas à pas (un pas = un quart de temps) :
  // D dum, T tek, t tek léger, r cymbalettes, b grand tambour, . silence. Les sections se suivent, comme les plans du film.
  async bande(p2) {
    const bpm = this.scn.bpm || 100, duree = this.t, notes = m => m.split('').map(c => (c === '.' ? '-' : c) + '/.25').join(' ');
    let A = '', B = ''; this.scn.rythme.forEach(s => { const a = s.a || '', b = (s.b || '').padEnd(a.length, '.').slice(0, a.length); for (let i = 0; i < (s.fois || 1); i++) { A += a; B += b; } });
    const besoin = Math.ceil(duree * bpm / 60 * 4); while (A.length < besoin || A.length % 16) { A += '.'; B += '.'; }
    const def = { bpm, beats: A.length / 4, voices: [{ wave: 'drums', vol: 0.62, notes: notes(A) }, { wave: 'drums', vol: 0.4, pan: 0.25, notes: notes(B) }] };
    const b64 = await p2.evaluate(async ([def, sec]) => { const I = window.ISNAD; I.registerMusic('film', def); const buf = await I.audio.render('film', sec), n = buf.length, sr = buf.sampleRate, g = buf.getChannelData(0), d = buf.numberOfChannels > 1 ? buf.getChannelData(1) : g;
      const o = new DataView(new ArrayBuffer(44 + n * 4)), w = (p, s) => { for (let i = 0; i < s.length; i++) o.setUint8(p + i, s.charCodeAt(i)); };
      w(0, 'RIFF'); o.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); o.setUint32(16, 16, true); o.setUint16(20, 1, true); o.setUint16(22, 2, true); o.setUint32(24, sr, true); o.setUint32(28, sr * 4, true); o.setUint16(32, 4, true); o.setUint16(34, 16, true); w(36, 'data'); o.setUint32(40, n * 4, true);
      for (let i = 0; i < n; i++) { o.setInt16(44 + i * 4, Math.max(-1, Math.min(1, g[i])) * 32767, true); o.setInt16(46 + i * 4, Math.max(-1, Math.min(1, d[i])) * 32767, true); }
      let s = ''; const u = new Uint8Array(o.buffer); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); }, [def, duree + 0.4]);
    const wav = path.join(PRISES, this.scn.id + '.wav'); fs.writeFileSync(wav, Buffer.from(b64, 'base64')); return wav;
  }
}

/* ---------- montage : l'image, le son, la planche de relecture ---------- */
function ffmpeg(args) { const r = spawnSync('ffmpeg', ['-v', 'error', '-y'].concat(args), { encoding: 'utf8' }); if (r.status) throw new Error('ffmpeg : ' + (r.stderr || '').slice(0, 400)); return r; }
function sonde(f) { const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,duration,sample_rate', '-of', 'json', f], { encoding: 'utf8' }); return JSON.parse(r.stdout || '{}').streams || []; }
function monter(scn, video, wav, duree, sortie) {
  if (!wav) { ffmpeg(['-i', video, '-c', 'copy', '-movflags', '+faststart', sortie]); return; }
  // le niveau : la crête à −3 dB, puis une sortie douce sur la dernière demi-seconde
  const r = spawnSync('ffmpeg', ['-v', 'info', '-i', wav, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' }), m = /max_volume: (-?[\d.]+) dB/.exec(r.stderr || ''), gain = m ? Math.min(30, -3 - parseFloat(m[1])) : 0;
  ffmpeg(['-i', video, '-i', wav, '-af', `volume=${gain.toFixed(1)}dB,afade=t=out:st=${Math.max(0, duree - 0.6).toFixed(2)}:d=0.6,alimiter=limit=0.89`, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', duree.toFixed(3), '-movflags', '+faststart', sortie]);
}
function planche(film, duree, sortie, n) { n = n || 12; const col = 6, pas = duree / n;
  ffmpeg(['-i', film, '-vf', `fps=1/${pas.toFixed(4)}:start_time=${(pas / 2).toFixed(3)}:round=down,scale=300:-1,tile=${col}x${Math.ceil(n / col)}:padding=6:color=0x06050d`, '-frames:v', '1', '-q:v', '3', sortie]); }

module.exports = { Plateau, PRISES, FILMS, IPS };
if (require.main === module) (async () => {
  const args = process.argv.slice(2), brouillon = args.includes('brouillon'), voulus = args.filter(a => a !== 'brouillon');
  const tous = fs.existsSync(SCN) ? fs.readdirSync(SCN).filter(f => /^\d\d-.*\.js$/.test(f)).sort() : [];
  const choisis = voulus.length ? tous.filter(f => voulus.some(v => f.startsWith(v) || f.includes(v))) : tous;
  if (!choisis.length) { console.log('Aucun scénario' + (voulus.length ? ' ne répond à « ' + voulus.join(' ') + ' »' : '') + ' dans promo/shorts/.'); process.exit(1); }
  let anomalies = 0;
  for (const f of choisis) {
    const scn = require(path.join(SCN, f)); scn.id = scn.id || f.replace(/\.js$/, '');
    console.log(`${scn.id} — ${scn.titre || ''}${brouillon ? ' (brouillon)' : ''}`);
    const t0 = Date.now(), s = new Plateau(scn, { brouillon });
    await s.ouvrir();
    try { await scn.film(s); } catch (e) { anomalies++; console.log('  ✗ ' + (e.stack || e.message)); }
    const duree = s.t, wav = await s.fermer(), sortie = path.join(FILMS, scn.id + (brouillon ? '.brouillon' : '') + '.mp4');
    monter(scn, s.video, wav, duree, sortie); planche(sortie, duree, sortie.replace(/\.mp4$/, '.jpg'), scn.planche);
    const st = sonde(sortie), v = st.find(x => x.codec_type === 'video') || {}, a = st.find(x => x.codec_type === 'audio');
    const bon = v.width === 1080 && v.height === 1920 && v.r_frame_rate === IPS + '/1' && (!scn.rythme || !!a);
    if (!bon) anomalies++;
    if (s.erreurs.length) { anomalies++; console.log('  ✗ erreurs : ' + [...new Set(s.erreurs)].slice(0, 4).join(' | ').slice(0, 500)); }
    console.log(`  ${bon ? '✓' : '✗'} ${path.relative(RACINE, sortie)} — ${v.width} × ${v.height}, ${v.r_frame_rate} i/s, ${duree.toFixed(1)} s, ${a ? 'son ' + a.codec_name : 'sans son'}, ${(fs.statSync(sortie).size / 1e6).toFixed(1)} Mo · filmé en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    if (s.marques.length) console.log('  repères : ' + s.marques.map(m => m[0] + ' ' + m[1] + ' s').join(' · '));
    if (s.journal.length) console.log('  répliques du jeu : ' + s.journal.map(j => '« ' + j.slice(0, 70) + (j.length > 70 ? '…' : '') + ' »').join(' · '));
  }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ ${choisis.length} short(s) — films dans promo/shorts/films/`);
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
