#!/usr/bin/env node
/* ISNAD — la bataille déclarée à l'épreuve.
   node tools/bataille.js                       Yarmoûk (saga de Khâlid, chapitre 2) joué au doigt, en hauteur puis en largeur
   node tools/bataille.js doigt <saga> <n> [LxH]  un autre chapitre (n : 1, 2, 3…), une autre taille d'écran
   node tools/bataille.js mesures [saga] [N]    chaque combat d'idole qui a des rangs, N fois avec et N fois sans (4 par défaut)
                                                (ajouter « faux » : après les mauvaises réponses, l'idole au plus enraciné)

   Au doigt : le carton se lit, le champ se voit, « Ordonner » se touche, chaque rang et chaque ordre se voient et se
   touchent, le stratège reçoit ses manœuvres, un flanc découvert s'annonce sans couvrir le champ, la bataille se termine.
   Écrit « INVISIBLE » (une entrée de menu hors de l'écran, le champ sous un menu ou sous un bandeau) et « BLOQUÉ »
   (la bataille ne se termine pas). Captures dans .smoke/. Les mesures comparent durée, Constance et défaites du joueur
   de test, dans les mêmes conditions (groupe, provision, enracinement remis avant chaque essai) : « ÉCART » au-delà de 20 %. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html'), out = path.resolve(__dirname, '..', '.smoke');
fs.mkdirSync(out, { recursive: true });
const A = process.argv.slice(2), mode = A[0] === 'mesures' ? 'mesures' : 'doigt';
const faux = process.argv.includes('faux');
const prep = faux => { const I = window.ISNAD; I.debug.log = []; I.debug.auto = true; I.debug.pickWrong = !!faux; I.speed = 40; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; I.input.reset(); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); };

(async () => {
  const browser = await chromium.launch(), errors = []; let rate = 0;
  const ouvrir = async (w, h, doigt) => { const ctx = await browser.newContext(Object.assign({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }, doigt ? { hasTouch: true, isMobile: true } : {})); const p = await ctx.newPage(); p.on('pageerror', e => errors.push('pageerror: ' + e.message + ' ' + (e.stack || '').split('\n').slice(0, 3).join(' | '))); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); }); await p.goto(url); await p.waitForTimeout(1500); await p.evaluate(prep, faux && mode === 'mesures'); return p; };

  if (mode === 'mesures') {
    const veut = A[1] && !/^\d+$/.test(A[1]) ? A[1] : null, N = +(A.find(x => /^\d+$/.test(x)) || 4);
    const p0 = await ouvrir(960, 540), liste = await p0.evaluate(() => { const I = window.ISNAD, L = []; Object.keys(I.sagas).forEach(id => { const s = I.sagas[id]; if (s.frame || s.commun) return; (s.chapters || []).forEach((c, i) => { if (c.bataille && (c.bataille.rangs || []).length) L.push([id, i, c.title]); }); }); return L; });
    await p0.context().close();
    for (const [saga, ci, titre] of liste.filter(x => !veut || x[0] === veut)) {
      const p = await ouvrir(960, 540);
      const res = await p.evaluate(({ saga, ci, N }) => new Promise(done => {
        const I = window.ISNAD, W = I.world, ob = I.battle.start; let fait = false;
        const remet = (obj, snap) => { if (!obj) return; Object.keys(obj).forEach(k => delete obj[k]); Object.assign(obj, JSON.parse(snap)); };
        I.battle.start = async function (o) {
          if (fait || !I.mal.estIdole(o) || !W.ch.bataille) return ob.apply(this, arguments);
          fait = true; const B0 = W.ch.bataille, L = [];
          const hs = W.party.map(id => { const h = W.hero(id); return [h, JSON.stringify({ lvl: h.lvl, xp: h.xp, hp: h.hp, sp: h.sp, sakina: h.sakina || 0 })]; });
          const sO = JSON.stringify(I.save.data.oeuvres || {}), sM = JSON.stringify(I.save.data.mal || {});
          for (let k = 0; k < N * 2; k++) {
            hs.forEach(([h, s]) => Object.assign(h, JSON.parse(s))); remet(I.save.data.oeuvres, sO); remet(I.save.data.mal, sM);
            if (k % 2) delete W.ch.bataille; else W.ch.bataille = B0;
            let def = 0; const oc = I.script.card; I.script.card = function (cls) { if (cls === 'defeat') def++; return oc.apply(this, arguments); };
            await ob.call(this, o); I.script.card = oc;
            const l = I.battle.last; L.push({ avec: !(k % 2), tours: l.turns, min: Math.round(l.minHp * 100), def, champ: l.champ });
          }
          W.ch.bataille = B0; done({ L, groupe: o.group.join('+'), niv: I.mal.niveau() }); return 'win';
        };
        W.roster = {}; W.saga = null; W.startChapter(saga, ci);
        setTimeout(() => done({ L: [], groupe: '' }), 420000);
      }), { saga, ci, N });
      const moy = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0, f = x => x.toFixed(1), av = res.L.filter(x => x.avec), sn = res.L.filter(x => !x.avec);
      if (!av.length) { console.log(`BLOQUÉ ${saga}#${ci + 1} ${titre} : le combat d'idole n'a pas été atteint`); rate++; await p.context().close(); continue; }
      const ta = moy(av.map(x => x.tours)), ts = moy(sn.map(x => x.tours)), da = av.reduce((s, x) => s + x.def, 0), ds = sn.reduce((s, x) => s + x.def, 0), ecart = Math.abs(ta - ts) > 0.2 * ts + 1.5 || da > ds;
      console.log(`${ecart ? 'ÉCART ' : ''}${saga}#${ci + 1} ${titre} · ${res.groupe} · enracinement ${res.niv} · ${N} essais`);
      console.log(`   avec rangs : ${av[0].champ ? av[0].champ.rangs : 0} rangs, ${f(ta)} tours (${Math.min(...av.map(x => x.tours))}–${Math.max(...av.map(x => x.tours))}), Constance min ${f(moy(av.map(x => x.min)))} %, ${da} défaite(s) · ${f(moy(av.map(x => x.champ ? x.champ.pas : 0)))} pas, ${f(moy(av.map(x => x.champ ? x.champ.flancs : 0)))} flanc(s), ${f(moy(av.map(x => x.champ ? x.champ.dissipees : 0)))} nuée(s) dissipée(s), ${f(moy(av.map(x => x.champ ? x.champ.perces : 0)))} percée(s), ${f(moy(av.map(x => x.champ ? x.champ.eprouves : 0)))} repli(s)`);
      console.log(`   sans rangs : ${f(ts)} tours (${Math.min(...sn.map(x => x.tours))}–${Math.max(...sn.map(x => x.tours))}), Constance min ${f(moy(sn.map(x => x.min)))} %, ${ds} défaite(s)`);
      if (ecart) rate++; await p.context().close();
    }
  } else {
    const saga = A[0] === 'doigt' && A[1] ? A[1] : 'khalid', ci = A[0] === 'doigt' && A[2] ? +A[2] - 1 : 1, taille = A.find(x => /^\d+x\d+$/.test(x));
    for (const [w, h] of (taille ? [taille.split('x').map(Number)] : [[390, 844], [844, 390]])) {
      const p = await ouvrir(w, h, true), T = `${saga}${ci + 1}-${w}x${h}`, dit = m => console.log(`${w}x${h}  ${m}`), shot = n => p.screenshot({ path: path.join(out, `bataille-${T}-${n}.png`) });
      await p.evaluate(({ saga, ci }) => { const I = window.ISNAD, W = I.world, R = I.rangs, od = R.declare; R.declare = async function (C, o) { if (W.ch.bataille && I.mal.estIdole(o)) { I.debug.auto = false; I.speed = 1; window.__bataille = true; } return od.apply(this, arguments); };
        const ob = I.battle.start; I.battle.start = async function (o) { const r = await ob.apply(this, arguments); if (window.__bataille) window.__bataille = 'finie'; return r; }; W.roster = {}; W.saga = null; W.startChapter(saga, ci); }, { saga, ci });
      try { await p.waitForFunction(() => window.__bataille === true, null, { timeout: 200000 }); } catch (e) { dit('BLOQUÉ : la bataille déclarée n’a pas été atteinte'); rate++; await p.context().close(); continue; }
      await p.waitForFunction(() => { const c = document.querySelector('#card'); return !c.hidden && c.classList.contains('on'); }, null, { timeout: 20000 }); await p.waitForTimeout(600);
      await shot('1-carton'); dit('carton : ' + await p.evaluate(() => document.querySelector('#card').innerText.replace(/\n+/g, ' ⏎ ').slice(0, 300)));
      const etat = () => p.evaluate(() => { const I = window.ISNAD, b = document.querySelector('#battle'), cmd = b.querySelector('.cmd'), mi = [...cmd.querySelectorAll('.mi')], bn = b.querySelector('.banner'), st = document.querySelector('#stage').getBoundingClientRect(), ch = I.battle.champ();
        const pc = r => ({ t: (r.top - st.top) / st.height, b: (r.bottom - st.top) / st.height, l: (r.left - st.left) / st.width, r: (r.right - st.left) / st.width });
        let cadre = null; if (ch) { const k = I.rangs.cadre(ch); cadre = { t: k.y / k.ph, b: (k.y + k.h) / k.ph, l: (k.x - k.vx) / k.vw, r: (k.x + k.w - k.vx) / k.vw }; }
        return { champ: b.classList.contains('champ'), carton: !document.querySelector('#card').hidden, btxt: bn.hidden ? '' : bn.textContent, bandeau: bn.hidden ? null : pc(bn.getBoundingClientRect()), cadre,
          menu: mi.length ? pc(cmd.getBoundingClientRect()) : null, plaques: (() => { const e = b.querySelector('.heroes'); return e && e.offsetParent ? pc(e.getBoundingClientRect()) : null; })(),
          titre: cmd.querySelector('.mtitle') ? cmd.querySelector('.mtitle').textContent.trim().slice(0, 70) : '', items: mi.map(x => x.textContent.trim().slice(0, 60)), stratege: !!(ch && mi.some(x => /sans perdre son tour/.test(x.textContent))), fini: window.__bataille === 'finie' }; });
      const croise = (a, b) => a && b && a.t < b.b - 0.01 && a.b > b.t + 0.01 && a.l < b.r - 0.01 && a.r > b.l + 0.01;
      const couvert = (e, ou) => { if (!e.champ || !e.cadre) return; for (const [nom, r] of [['le menu', e.menu], ['les plaques du groupe', e.plaques], ['un bandeau', e.bandeau]]) if (croise(e.cadre, r)) { dit(`INVISIBLE : le champ sous ${nom} (${ou})`); rate++; } };
      const voir = async ou => { const L = await p.$$('#battle .cmd .mi'), vh = h; let n = 0; for (const b of L) { const r = await b.boundingBox(); if (!r || !(await b.isVisible())) { dit(`INVISIBLE : « ${(await b.textContent()).trim().slice(0, 40)} » (${ou})`); rate++; } else if (r.y + r.height > vh + 1 || r.y < -1) n++; } return n; };
      const toucher = async txt => { for (const b of await p.$$('#battle .cmd .mi')) { if ((await b.textContent()).includes(txt)) { await b.scrollIntoViewIfNeeded(); await p.waitForTimeout(320); await b.tap(); await p.waitForTimeout(700); return true; } } return false; };
      let vuChamp = false, ordre = false, man = false, flanc = false, pousse = false, tours = 0;
      for (let k = 0; k < 500; k++) {
        const e = await etat(); if (e.fini) break;
        if (e.champ && !e.items.length && !vuChamp) { vuChamp = true; await p.waitForTimeout(400); await shot('2-champ'); }
        if (e.champ && /Flanc/.test(e.btxt) && !flanc) { flanc = true; couvert(e, 'flanc découvert'); await shot('6-flanc'); dit('flanc découvert : ' + e.btxt.replace(/\s+/g, ' ')); }
        if ((ordre || tours > 6) && !pousse) { pousse = true; await p.evaluate(() => { const ch = window.ISNAD.battle.champ(); if (!ch) return; const r = ch.rangs.find(x => !x.repos); if (!r) return; ch.nuees = ch.nuees.filter(n => n.l !== r.l); ch.rangs.forEach(x => { if (x !== r && x.l === r.l && x.c > r.c) x.c = 0; }); r.c = 3; r.ordre = 'avancer'; }); }
        if (e.carton || (e.bandeau && !e.items.length)) { await p.touchscreen.tap(Math.round(w / 2), Math.round(h * 0.3)); await p.waitForTimeout(500); continue; }
        if (!e.items.length) { await p.waitForTimeout(250); continue; }
        tours++;
        if (tours === 1) { await shot('3-duel'); if (!e.items.some(x => x.includes('Ordonner'))) { dit('ABSENT : « Ordonner » dans le menu du compagnon'); rate++; } }
        const peut = e.items.some(x => x.includes('Ordonner'));
        if (peut && !ordre) {
          ordre = true; await toucher('Ordonner'); let a = await etat(); await p.waitForTimeout(300); couvert(a, 'choix du rang'); const hors = await voir('choix du rang'); await shot('4-rangs');
          const pc = x => Math.round(x * 100) + ' %';
          dit(`ordonner : ${a.titre} · ${a.items.join(' | ')}${hors ? ` · ${hors} entrée(s) à faire défiler` : ''}`);
          if (a.cadre && a.menu) dit(`   le champ occupe de ${pc(a.cadre.t)} à ${pc(a.cadre.b)} de la hauteur de la scène ; le menu commence à ${pc(a.menu.t)}${a.plaques ? `, les plaques à ${pc(a.plaques.t)}` : ''}`);
          const L = await p.$$('#battle .cmd .mi'); await p.waitForTimeout(320); await L[0].tap(); await p.waitForTimeout(700); a = await etat(); couvert(a, 'choix de l’ordre'); await voir('choix de l’ordre'); await shot('5-ordres'); dit(`ordres : ${a.titre} · ${a.items.join(' | ')}`);
          const L2 = await p.$$('#battle .cmd .mi'); if (L2.length < 2) { dit('ABSENT : un rang n’a qu’un ordre'); rate++; } await p.waitForTimeout(320); await L2[Math.min(1, L2.length - 1)].tap(); await p.waitForTimeout(900); continue;
        }
        if (peut && ordre && !man && e.stratege) {
          await toucher('Ordonner'); let a = await etat(); const m = a.items.find(x => x.includes('✦')); dit(`manœuvres du stratège : ${a.items.filter(x => x.includes('✦')).join(' | ') || 'aucune pour l’instant'}`);
          if (m) { man = true; await toucher(m.slice(0, 12)); a = await etat(); await p.waitForTimeout(300); couvert(a, 'manœuvre'); await voir('manœuvre'); await shot('7-manoeuvre'); if (a.items.length && !a.items.some(x => x.includes('Frapper'))) { const L = await p.$$('#battle .cmd .mi'); if (L.length) { await p.waitForTimeout(320); await L[0].tap(); await p.waitForTimeout(800); } } continue; }
          const bk = await p.$('#battle .cmd .mback'); if (bk) { await bk.tap(); await p.waitForTimeout(500); }
        }
        if (tours > 16) await p.evaluate(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 40; });
        if (!(await toucher('Frapper'))) { const L = await p.$$('#battle .cmd .mi'); if (L.length) { await L[0].tap(); await p.waitForTimeout(600); } continue; }
        await p.waitForTimeout(400); const pl = await p.$('#battle .plates .plate'); if (pl) { await pl.tap(); await p.waitForTimeout(600); } else { const L = await p.$$('#battle .cmd .mi'); if (L.length) { await L[0].tap(); await p.waitForTimeout(600); } }
      }
      // au-delà de seize tours au doigt, le joueur de test finit la bataille : on lui laisse le temps
      if (!(await etat()).fini) { await p.evaluate(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 40; }); try { await p.waitForFunction(() => window.__bataille === 'finie', null, { timeout: 150000 }); } catch (e) { /* dit plus bas */ } }
      const fin = await etat();
      dit(`${tours} tours au doigt · champ vu ${vuChamp ? 'oui' : 'NON'} · ordre donné ${ordre ? 'oui' : 'NON'} · manœuvre ${man ? 'oui' : 'non'} · flanc découvert ${flanc ? 'oui' : 'non'} · ${fin.fini ? 'bataille terminée' : 'BLOQUÉ : la bataille ne se termine pas'}`);
      if (!fin.fini) rate++; if (!vuChamp || !ordre) { dit('ABSENT : le champ ou « Ordonner »'); rate++; }
      await p.context().close();
    }
  }
  console.log(errors.length ? 'ERREURS\n' + [...new Set(errors)].slice(0, 8).join('\n') : 'Aucune erreur console');
  console.log(`FIN bataille ${rate + errors.length}`);
  await browser.close(); process.exit(rate + errors.length ? 1 : 0);
})();
