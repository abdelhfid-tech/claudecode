/* ISNAD 2.x — les postures : le héros, le sage, le saint.
   Trois manières de se tenir devant l'épreuve. Le héros s'expose ; le sage discerne ; le saint s'efface et porte les
   autres. Chacun a d'abord la sienne, selon son tempérament (son rôle : D.TEMPERAMENTS) ; les deux autres s'ouvrent avec
   l'avancée (D.POSTURE_NIVEAUX). On en prend une à la halte ou en préparant une bataille : elle règle un peu le combat
   (D.POSTURES — des pourcentages, rien d'autre).
   Ce que le jeu ne fait pas : il ne dit de personne qu'il EST un héros, un sage ou un saint — on prend une posture, on ne
   la possède pas ; il ne range pas les Compagnons entre eux — les trois s'ouvrent à chacun ; il ne prête à la troisième
   aucun pouvoir : elle soigne mieux et garde le calme, rien de plus.
   Demandé par le décideur le 16 novembre ; noms, effets et attribution proposés par l'agent, à valider (D163). */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, W = I.world;
  const Po = I.postures = {};
  const cle = h => h.key || ((W.saga ? W.saga.id : '') + ':' + h.id);
  const lu = () => { const p = I.save.data.postures; return p && typeof p === 'object' && !Array.isArray(p) ? p : null; };
  Po.temperament = h => D.TEMPERAMENTS[(h.def && h.def.role) || ''] || D.POSTURE_IDS[0];
  // dans l'ordre où elles s'ouvrent à lui : celle de son tempérament, puis les deux autres
  Po.ordre = h => { const t = Po.temperament(h); return [t].concat(D.POSTURE_IDS.filter(k => k !== t)); };
  Po.ouvertes = h => Po.ordre(h).filter((k, i) => (h.lvl || 1) >= D.POSTURE_NIVEAUX[i]);
  Po.de = h => { const p = lu(), k = p && p[cle(h)], O = Po.ouvertes(h); return O.includes(k) ? k : O[0]; };
  Po.choisir = function (h, k) { if (!Po.ouvertes(h).includes(k)) return false; const sv = I.save.data; if (!lu()) sv.postures = {}; sv.postures[cle(h)] = k; I.save.store(); if (I.lecons) I.lecons.reemploi('postures'); return true; };
  Po.effets = h => D.POSTURES[Po.de(h)] || {};
  // un choix s'offre-t-il déjà à quelqu'un du groupe ? (avant cela, la halte ne montre pas la page)
  Po.offertes = () => !!(W.saga && W.party && W.party.some(id => { const h = W.hero(id); return h && Po.ouvertes(h).length > 1; }));
  const pct = v => (v > 0 ? '+' : '') + Math.round(v * 100) + ' %';
  Po.dit = function (k) { const P = D.POSTURES[k], L = [];
    if (P.atk) L.push(I.t('Force {pct}', { pct: pct(P.atk) })); if (P.mag) L.push(I.t('Esprit {pct}', { pct: pct(P.mag) })); if (P.soin) L.push(I.t('soins {pct}', { pct: pct(P.soin) }));
    if (P.niyya) L.push(I.t('Niyya +{n} au départ', { n: P.niyya })); if (P.sakina) L.push(I.t('Sérénité +{n} au départ', { n: P.sakina })); if (P.faille) L.push(I.t('une faille de chaque chimère connue d’emblée')); if (P.menace) L.push(I.t('il attire plus souvent les coups'));
    return L.join(' · '); };
  // quand un choix s'ouvre pour la première fois à quelqu'un du groupe : la leçon, une fois (le besoin d'abord : avant cela, rien à choisir)
  Po.veille = function () {
    if (!Po.offertes() || I.save.data.codex.includes('coeur/postures')) return false;
    const T = (I.sagas.coeur && I.sagas.coeur.postures) || {}, h = W.party.map(id => W.hero(id)).find(q => Po.ouvertes(q).length > 1);
    const dire = () => { I.oeuvres.learn('postures', true); I.script.toast(I.fmt((T.ouverte || '').replace('%s', h.def.name)), 7000); };
    return I.lecons ? I.lecons.proposer('postures', dire) : (dire(), true);
  };
  // la page de la halte
  Po.pane = function (h, k) {
    const T = (I.sagas.coeur && I.sagas.coeur.postures) || {}, esc = I.esc;
    let html = `<h3>${esc(T.titre || I.t('Les figures'))}</h3><p>${esc(T.texte || '')}</p>`;
    D.POSTURE_IDS.forEach(id => { const P = D.POSTURES[id], t = (T.noms || {})[id] || {}; html += `<p><b>${esc(t.nom || P.nom)}</b> — ${esc(t.devise || '')}<br><small>${esc(Po.dit(id))}</small></p>`; });
    if (W.saga && W.party && W.party.length) html += '<p class="src">' + W.party.map(id => { const q = W.hero(id), cur = Po.de(q), O = Po.ouvertes(q), reste = Po.ordre(q).length - O.length, suiv = reste ? D.POSTURE_NIVEAUX[O.length] : 0;
      const F = { nom: esc(q.def.name), min_posture: esc(((T.noms || {})[cur] || {}).nom || D.POSTURES[cur].nom).toLowerCase(), posture: esc(((T.noms || {})[cur] || {}).nom || D.POSTURES[cur].nom), n: suiv };
      return suiv ? I.t('{nom} · figure : <b>{min_posture}</b> (une autre s’ouvre au niveau {n})', F) : I.t('{nom} · figure : <b>{min_posture}</b>', F); }).join('<br>') + '</p>';
    html += `<p class="src">${esc(T.note || '')}</p>`;
    return html;
  };
})();
