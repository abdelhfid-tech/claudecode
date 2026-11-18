/* ISNAD — l'organigramme du mal : l'enracinement d'une idole, la réponse parlée à une idée noire, la page de la halte.
   Les textes sont du contenu (src/data/coeur.js : `mal`, et `parole` sur chaque idée noire) ; la racine de chaque idole est
   dans son fichier de saga (`racine`). Ici, seulement les règles et le dessin.

   Garde-fous (exigences 6 et 18) : Iblîs et les souffleurs sont des lignes de texte, jamais des combattants, des images
   ou des voix. Aucun lien n'est tracé d'un souffleur à une idole : le souffle s'arrête au cœur. La jauge se dit d'une
   idole, telle qu'elle se dresse devant le voyageur ; jamais d'une époque, de ses gens, d'un Compagnon ou d'un camp. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world;
  const M = I.mal = {};
  const C0 = () => I.sagas.coeur || { enemies: {}, mal: { rangs: {} }, codex: [] };
  const PALIER = { boss: 3, elite: 2, minion: 1 };
  const defDe = (saga, id) => (saga && saga.enemies && saga.enemies[id]) || (I.common && I.common.enemies[id]) || C0().enemies[id] || null;
  const clef = (saga, ch) => saga.id + '/' + ch.id;
  const traits = n => '<span class="rac" title="' + I.t('enracinement {n} sur 5', { n }) + '">' + '▮'.repeat(n) + '<i>' + '▯'.repeat(5 - n) + '</i></span>';
  M.traits = traits;

  /* ----- état sauvegardé : des événements à clé, non un compteur. Rejouer un objectif réécrit la même clé. ----- */
  function st() { const d = I.save.data; d.mal = d.mal || {}; d.mal.ev = d.mal.ev || {}; d.mal.tombees = d.mal.tombees || {}; return d.mal; }
  M.state = st;

  /* ----- la lignée d'un chapitre, lue dans son récit ----- */
  // L'idole : le membre de plus haut palier d'un combat lancé avec boss: true, maux du cœur exceptés.
  // Les égrégores : tous les autres que le chapitre fait rencontrer.
  const lignees = {};
  M.lignee = function (saga, ch) {
    const k = clef(saga, ch); if (lignees[k]) return lignees[k];
    const E = id => defDe(saga, id) || {}, idoles = [], vus = [];
    const tete = g => g.slice().sort((a, b) => (PALIER[E(b).tier] || 0) - (PALIER[E(a).tier] || 0))[0];
    const combat = (g, boss) => { if (!Array.isArray(g)) return; if (boss) { const t = tete(g); if (t && !E(t).vice && !idoles.includes(t)) idoles.push(t); } g.forEach(id => { if (!vus.includes(id)) vus.push(id); }); };
    const lire = ops => D.parcours(ops, o => {
      if (o[0] === 'battle' && o[1]) combat(o[1].group, !!o[1].boss);
      else if (o[0] === 'parley' && o[1]) (o[1].rounds || []).forEach(r => { if (r.noir) combat(r.noir.group, false); });
    });
    (ch.foes || []).forEach(f => combat(f.group, !!f.boss));
    lire(ch.intro); (ch.objectives || []).forEach(o => lire(o.then)); lire(ch.outro); (ch.npcs || []).forEach(n => lire(n.talk));
    return (lignees[k] = { idoles, egregores: vus.filter(id => !idoles.includes(id) && !E(id).vice && !E(id).idee), idees: vus.filter(id => E(id).idee) });
  };
  M.idole = (saga, ch) => M.lignee(saga, ch).idoles[0] || null;
  // ce combat est-il celui de l'idole du chapitre en cours ?
  M.estIdole = opts => !!(opts && opts.boss && Array.isArray(opts.group) && W.saga && W.ch && M.lignee(W.saga, W.ch).idoles.some(id => opts.group.includes(id)));

  /* ----- l'enracinement : de 1 à 5, part de 3 ; plafonné à 4 dans le premier chapitre d'une saga ----- */
  M.niveau = function (saga, ch) {
    saga = saga || W.saga; ch = ch || W.ch; if (!saga || !ch) return 3;
    const ev = st().ev[clef(saga, ch)] || {}; let n = 3; Object.keys(ev).forEach(k => { n += ev[k]; });
    return I.clamp(n, 1, saga.chapters.indexOf(ch) === 0 ? 4 : 5);
  };
  // un chapitre qui commence repart de 3 (une reprise garde ce qui était écrit)
  M.ouvre = function () { if (W.saga && W.ch) delete st().ev[clef(W.saga, W.ch)]; };
  // Un événement du chapitre en cours : pourparler ('p'), idée noire ('n'), choix de fidélité ('c'). `d` vaut −1, 0 ou +1.
  // Jamais une œuvre ni une prière (exigences 13 et 15) : seule la parole déracine.
  M.note = function (sorte, nom, d) {
    if (!W.saga || !W.ch || !M.idole(W.saga, W.ch)) return;
    const k = clef(W.saga, W.ch), ev = st().ev[k] || (st().ev[k] = {}), avant = M.niveau();
    ev[sorte + I.hash(String(nom).split('|').map(x => I.langue.fr(x)).join('|'))] = d;   // l'empreinte se prend sur le texte français : la même dans toutes les langues
    const apres = M.niveau(); if (apres === avant) return;
    I.oeuvres.learn('enracinement');
    S.toast((apres < avant ? I.t('<b>L’idée perd une racine</b>') + ' ' : I.t('<b>L’idée s’enracine</b>') + ' ') + traits(apres), 2600);
  };
  // le poids de l'épreuve suit l'enracinement : 1, 2 ou 3 (2 tant que rien n'a bougé)
  M.poids = function (opts) { if (!M.estIdole(opts)) return 2; const n = M.niveau(); return n <= 2 ? 1 : n >= 4 ? 3 : 2; };
  // à l'entrée du combat : un voile de moins quand l'idée est déracinée ; un de plus, à la première tentative seulement,
  // quand elle a pris toute sa place. Rend le niveau, ou null si ce combat n'est pas celui d'une idole.
  M.entree = function (opts, first, foes) {
    if (!M.estIdole(opts)) return null; const n = M.niveau(), ids = M.lignee(W.saga, W.ch).idoles, d = n === 1 ? -1 : (n === 5 && first) ? 1 : 0;
    if (d) foes.forEach(e => { if (ids.includes(e.id) && !e.cut) { e.veilsMax = Math.max(1, e.veilsMax + d); e.veils = e.veilsMax; } });
    I.oeuvres.learn('enracinement');
    return n;
  };
  M.chute = function (opts) { if (!M.estIdole(opts)) return; const n = M.niveau(); M.lignee(W.saga, W.ch).idoles.forEach(id => { if (opts.group.includes(id)) st().tombees[W.saga.id + ':' + id] = n; }); };

  /* ----- l'idée noire : on lui répond, par la parole, la pédagogie, la bienveillance ----- */
  M.estIdee = N => !!(N && Array.isArray(N.group) && N.group.length && N.group.every(id => (defDe(W.saga, id) || {}).idee));
  M.dissiper = async function (N, P) {
    const id = N.group[0], e = defDe(W.saga, id), X = e.parole, sv = I.save.data; let fautes = 0;
    I.oeuvres.learn('idees_noires'); M.apprendre(['echelle']);
    await S.card('title parley noir', `<img class="idee" alt="" src="${M.url(id)}"><p class="small">${I.t('Une idée noire')}</p><h1>${I.fmt(N.name)}</h1><p>${I.fmt(N.intro)}</p><p class="small">${I.t('On ne la combat pas : on lui répond. Par la parole, la pédagogie, la bienveillance.')}</p><div class="rule"></div><div class="hint">▼</div>`);
    for (let k = 0; k < X.voies.length; k++) {
      await S.run([['say', P.with, X.dit[k]]]); S.hideDialog();
      let reste = Object.keys(D.VOIES);
      for (;;) {
        let pips = ''; for (let i = 0; i < X.voies.length; i++) pips += `<i class="pip${i >= k ? ' on' : ''}"></i>`;
        const tete = `<span class="seal idee" style="background-image:url(${M.url(id)})"></span><span class="pt"><b>${I.esc(N.name)}</b><small>${I.t('une idée noire : on lui répond')}</small></span><span class="trust">${I.t('Voiles')} <span class="pips">${pips}</span></span>`;
        const opts = reste.map(v => ({ ok: v === X.voies[k], html: `<b>${D.VOIES[v].name}</b> <small class="voie">${D.VOIES[v].de}</small><br>${I.fmt(X.rep[v])}` }));
        // ce qu'il vient de dire reste sous les yeux pendant que l'on choisit
        const v = reste[await S.menuPick({ html: I.t('Comment lui réponds-tu ?') + '<small>' + I.t('« {dit} »', { dit: I.fmt(X.dit[k]) }) + '</small>' }, opts, tete)];
        if (v === X.voies[k]) { I.audio.sfx('light'); S.toast(I.t('<b>Un voile tombe</b>'), 1800); if (X.oui && X.oui[k]) await S.run([['nar', X.oui[k]]]); S.hideDialog(); break; }
        fautes++; I.audio.sfx('dark'); await S.run([['nar', X.non[v]]]); S.hideDialog(); reste = reste.filter(x => x !== v);
      }
    }
    // dissipée : elle entre au Recueil comme un égrégore rencontré ; la sagesse vient de l'échange, non d'un combat
    const cid = 'foe:_:' + id; if (!sv.codex.includes(cid)) sv.codex.push(cid);
    const xp = Math.round(I.calc.xpOf(Object.assign({}, e, { lvl: Math.max(1, W.hero(W.party[0]).lvl) })) * 0.7), lignes = I.battle.grantXP(xp);
    I.audio.sfx('roll'); G.flash('#ffe08a');
    await S.card('victory', `<p class="small">${fautes ? I.t('Il a fallu s’y reprendre') : I.t('Du premier coup')}</p><h1>${I.t('L’idée noire se dissipe')}</h1><ul><li>${I.t('{nom} : {voies}', { nom: I.esc(e.name), voies: X.voies.map(v => D.VOIES[v].de).join(I.t(', puis ')) })}</li><li>${I.t('Sagesse acquise : <b>+{xp}</b>', { xp })}</li>${lignes.join('')}</ul><div class="hint">▼</div>`);
    M.note('n', P.title + '|' + N.name, fautes ? 0 : -1);
    return fautes;
  };

  /* ----- le Recueil : les entrées de l'organigramme s'ouvrent ensemble, sans quatre messages ----- */
  M.apprendre = function (ids) {
    const sv = I.save.data, L = (ids || ['iblis', 'souffleurs', 'echelle', 'enracinement']).filter(id => !sv.codex.includes('coeur/' + id) && (C0().codex || []).some(c => c.id === id));
    if (!L.length) return; L.forEach(id => sv.codex.push('coeur/' + id));
    S.toast(L.length > 1 ? I.t('Recueil : <b>{n} entrées</b> sur les degrés du mal', { n: L.length }) : I.t('Recueil : <b>{titre}</b>', { titre: I.esc(C0().codex.find(c => c.id === L[0]).title) }));
  };

  /* ----- dessin : l'image d'un égrégore, gardée en mémoire (les deux premiers rangs n'ont pas d'image) ----- */
  const urls = {};
  M.url = function (id, saga) {
    const e = defDe(saga || W.saga, id); if (!e) return ''; const k = e.art + '|' + e.hue;
    if (urls[k] === undefined) { try { urls[k] = G.enemy(e.art, e.hue, 1, 0).toDataURL(); } catch (x) { urls[k] = ''; } }
    return urls[k];
  };
  const puce = (id, saga, cls) => { const e = defDe(saga, id); return e ? `<span class="pu ${cls || ''}"><img alt="" src="${M.url(id, saga)}">${I.esc(e.name)}</span>` : ''; };

  /* ----- la page de la halte ----- */
  // vue d'ensemble : deux étages séparés par une couture ; le lien en pointillé s'arrête au cœur
  M.paneVue = function () {
    const T = C0().mal || { rangs: {} }, R = T.rangs, sv = I.save.data;
    const vuDe = (s, id) => sv.codex.includes('foe:' + (s && s.enemies && s.enemies[id] ? s.id : '_') + ':' + id);
    const tete = r => `<span class="nm"><b>${I.esc(r.name)}</b> <em>${I.esc(r.sous)}</em></span>`;
    // étage du haut : une ligne par rang ; on la touche pour lire le texte et sa référence
    const haut = k => { const r = R[k]; if (!r) return ''; return `<details class="rg haut r-${k}"><summary>${tete(r)}</summary><p>${I.fmt(r.texte)}</p><p class="rep">▸ ${I.fmt(r.reponse)}</p>${r.src ? `<p class="src">${I.esc(r.src)}</p>` : ''}</details>`; };
    // étage du bas : l'en-tête et la réponse en une ligne, puis ce que l'on rencontre, en images
    const bas = (k, corps) => { const r = R[k]; if (!r) return ''; return `<div class="rg bas r-${k}"><details><summary>${tete(r)}</summary><p>${I.fmt(r.texte)}</p></details><p class="rep">▸ ${I.fmt(r.reponse)}</p>${corps || ''}</div>`; };
    const lien = (t, pt) => `<div class="lien${pt ? ' pt' : ''}">${I.esc(t)}</div>`;
    const racines = '<div class="pus">' + D.NOIRS.map(id => puce(id, null, 'noir')).join('') + '</div><div class="pus">' + Object.keys(D.VICES).map(id => puce(id, null, 'vice')).join('') + '</div>';
    // maillon par maillon : tous ses égrégores, puis ses idoles. Un trait d'or sous ce que l'on a déjà rencontré.
    let nE = 0, tE = 0, nI = 0, tI = 0;
    const eps = M.epoques().map(s => {
      const eg = [], ido = [];
      s.chapters.forEach(ch => { const L = M.lignee(s, ch);
        L.egregores.forEach(id => { if (!eg.includes(id) && defDe(s, id) && !defDe(s, id).vice && D.NOIRS.indexOf(id) < 0) eg.push(id); });
        L.idoles.forEach(id => { if (!ido.some(x => x.id === id)) ido.push({ id, ch }); }); });
      ido.forEach(x => { const k = eg.indexOf(x.id); if (k >= 0) eg.splice(k, 1); });
      const E = eg.map(id => { const e = defDe(s, id), v = vuDe(s, id); tE++; if (v) nE++; return `<span class="tu${v ? ' vu' : ''}"><img alt="" src="${M.url(id, s)}"><i>${I.esc(e.name)}</i></span>`; }).join('');
      const Io = ido.map(x => { const e = defDe(s, x.id), tb = st().tombees[s.id + ':' + x.id], v = tb !== undefined || vuDe(s, x.id); tI++; if (tb !== undefined) nI++;
        return `<span class="ti${tb !== undefined ? ' tombee' : v ? ' vu' : ''}"><img alt="" src="${M.url(x.id, s)}"><b>${I.esc(e.name)}</b>${tb !== undefined ? `<small>${traits(tb)} ${I.t('tombée')}</small>` : v ? `<small>${traits(M.niveau(s, x.ch))}</small>` : ''}</span>`; }).join('');
      return `<div class="ep"><p class="epn">${I.esc(M.nomEpoque(s))}</p><div class="epe">${E}</div><div class="epi">${Io}</div></div>`; }).join('');
    const RE = R.egregores || {}, RI = R.idoles || {};
    const maillons = `<div class="rg bas r-epoques"><details><summary><span class="nm"><b>${I.esc(RE.name || '')}</b> <em>${I.esc(RE.sous || '')}</em></span></summary><p>${I.fmt(RE.texte || '')}</p></details><p class="rep">▸ ${I.fmt(RE.reponse || '')}</p>` +
      `<details><summary><span class="nm"><b>${I.esc(RI.name || '')}</b> <em>${I.esc(RI.sous || '')}</em></span></summary><p>${I.fmt(RI.texte || '')}</p></details><p class="rep">▸ ${I.fmt(RI.reponse || '')}</p>` +
      `<p class="src">${I.t('Chimères rencontrées : <b>{nE}</b> / {tE} · idoles tombées : <b>{nI}</b> / {tI}. Un trait d’or : déjà rencontré. Chaque idole a sa jauge d’enracinement.', { nE, tE, nI, tI })}</p><div class="eps">${eps}</div></div>`;
    return `<h3>${I.esc(T.titre || I.t('Les degrés du mal'))}</h3><p class="src">${I.fmt(T.chapeau || '')}</p><div class="orga vue">` +
      haut('iblis') + lien(I.t('à son service'), true) + haut('souffleurs') + lien(I.t('souffle'), true) + haut('coeur') +
      `<p class="couture">${I.fmt(T.couture || '')}</p>` +
      bas('racines', racines) + lien(I.t('reprise par beaucoup de cœurs, puis enracinée')) + maillons +
      '</div>';
  };
  // les maillons où l'on rencontre des idoles ; l'histoire-cadre en dernier
  const ROMAIN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const rangEpoque = s => s.frame && !s.veillees ? 1e6 : (s.livre || 1) * 1000 + s.order;   // par livre, puis par ordre ; l'histoire-cadre en dernier
  M.epoques = () => (I.sagaList || Object.values(I.sagas)).filter(s => !s.commun && (s.chapters || []).some(ch => M.lignee(s, ch).idoles.length || ch.vice)).sort((a, b) => rangEpoque(a) - rangEpoque(b));
  M.nomEpoque = s => s.veillees ? I.t('Les veillées de la Citadelle') : s.frame ? I.t('La Cité-Miroir · {annees}', { annees: String(s.years).split('·')[0].trim() }) : I.t('Maillon {num} · {annees}', { num: ROMAIN[s.order] || s.order, annees: String(s.years).split('·')[0].trim() });
  M.paneEpoque = function (s) {
    const sv = I.save.data, T = C0().mal || {}, vu = id => sv.codex.includes('foe:' + (s.enemies[id] ? s.id : '_') + ':' + id), ici = ch => W.saga === s && W.ch === ch;
    let h = `<h3>${I.esc(M.nomEpoque(s))}</h3><p class="src">${I.fmt((T.jauge || {}).note || '')}</p><div class="orga epoque">`, rien = true;
    s.chapters.forEach(ch => {
      const L = M.lignee(s, ch), eg = L.egregores.filter(vu).map(id => puce(id, s)).join('');
      L.idoles.forEach(id => {
        const e = defDe(s, id), tombee = st().tombees[s.id + ':' + id], connue = tombee !== undefined || vu(id) || ici(ch);
        if (!connue) { h += `<div class="rg bas inconnue"><p class="src">${I.esc(ch.title)}</p><p class="nm"><img class="ido" alt="" src="${M.url(id, s)}"><b>${I.esc(e.name)}</b> <small>${I.t('pas encore rencontrée')}</small></p></div>`; return; }
        rien = false;
        const n = tombee !== undefined ? tombee : M.niveau(s, ch), etat = tombee !== undefined ? I.t('idole tombée') : ici(ch) ? I.t('devant toi') : I.t('idole rencontrée');
        const rc = [].concat(e.racine || []).map(r => puce(r, null, defDe(null, r) && defDe(null, r).vice ? 'vice' : 'noir')).join('');
        h += `<div class="rg bas"><p class="src">${I.esc(ch.title)}</p><p class="nm"><img class="ido" alt="" src="${M.url(id, s)}"><b>${I.esc(e.name)}</b> ${traits(n)} <small>${etat}</small></p>` +
          (rc ? `<p class="lg"><span class="et">${I.t('racine')}</span>${rc}</p>` : '') + (eg ? `<p class="lg"><span class="et">${I.t('chimères')}</span>${eg}</p>` : '') + `<p class="rep">▸ ${I.fmt(((T.rangs || {}).idoles || {}).reponse || '')}</p></div>`;
      });
      if (!L.idoles.length && ch.vice && (eg || ici(ch))) { rien = false; const m = defDe(null, ch.vice);
        h += `<div class="rg bas"><p class="src">${I.esc(ch.title)}</p>${eg ? `<p class="lg"><span class="et">${I.t('chimère')}</span>${eg}</p>` : ''}<p class="lg"><span class="et">${I.t('derrière elle')}</span>${puce(ch.vice, null, 'vice')}</p><p class="rep">▸ ${I.esc(m ? I.t('Le mal du cœur : par l’œuvre, qui forge sa lame.') : '')}</p></div>`; }
    });
    return h + '</div>' + (rien ? '<p>' + I.t('Aucune idole rencontrée ici pour l’instant.') + '</p>' : '');
  };
})();
