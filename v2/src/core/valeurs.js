/* ISNAD — le côté du bien : Valeurs et attributs ; les portes de la noosphère.
   Demande du décideur : « Du côté du bien on appelle ça des Valeurs ou des attributs, pas des djinns, égrégores ou idoles » ;
   « on collectionne les valeurs et les attributs comme des badges » ; « 7 valeurs + je parle des attributs divins » ; et, à la
   prière, au dhikr ou au sommeil, « la possibilité d'accéder à la noosphère pour combattre nos démons intérieurs ».

   Rien de nouveau n'est gardé dans la sauvegarde : une Valeur est acquise quand le mal d'en face est tranché, un attribut est
   reconnu quand l'œuvre a forgé la lame. Règles et dessin seulement ; textes dans coeur.js (`bien`, `valeurs`, `attributs`,
   `portes`).

   Garde-fous (exigences 8, 15, 16 ; 21 et 22 proposées) :
   - un attribut divin n'est jamais dessiné, personnifié, « équipé » ni changé en pouvoir : son Nom est du texte, jamais un
     sprite ; il vient du Coran, avec son verset et sa référence ;
   - pas d'organigramme du bien en miroir de celui du mal : rien ne se tient en face du Créateur ;
   - le combat intérieur est celui du râwî (Idris, personnage de fiction), seul. Jamais celui d'un Compagnon : le jeu ne
     prête à aucun d'eux un mal du cœur. « Démons intérieurs » est une façon de parler : ce sont les maux du cœur. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world;
  const V = I.valeurs = {};
  const IDS = Object.keys(D.VICES);
  const C0 = () => I.sagas.coeur || {};
  const T = k => C0()[k] || {};
  const st = () => I.oeuvres.state();
  V.IDS = IDS;
  V.acquise = v => st().vices[v] === 'tranche';
  V.reconnu = v => !!st().lames[v];
  V.compte = () => ({ valeurs: IDS.filter(V.acquise).length, attributs: IDS.filter(V.reconnu).length, sur: IDS.length });

  /* ================= les badges ================= */
  // Un badge de Valeur : un médaillon à huit pans, sans inscription ni figure. Le nombre de points dit lequel c'est.
  const cache = {};
  function pans(c, x0, y0, n, coupe, col) { c.fillStyle = col; for (let y = 0; y < n; y++) { const r = Math.max(0, coupe - y, y - (n - 1 - coupe)); c.fillRect(x0 + r, y0 + y, n - 2 * r, 1); } }
  V.badge = function (v, plein) {
    const k = 'b' + v + (plein ? 1 : 0); if (cache[k]) return cache[k];
    const n = IDS.indexOf(v) + 1, col = (T('lames')[v] || {}).couleur || '#e9c877', cv = G.mk(26, 26), c = cv.getContext('2d');
    pans(c, 0, 0, 26, 8, plein ? col : '#3a3650'); pans(c, 2, 2, 22, 7, '#100d1c'); pans(c, 4, 4, 18, 6, plein ? col : '#232038');
    c.fillStyle = plein ? '#100d1c' : '#3a3650';
    if (n === 1) c.fillRect(12, 12, 2, 2);
    else for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; c.fillRect(Math.round(13 + Math.cos(a) * 5) - 1, Math.round(13 + Math.sin(a) * 5) - 1, 2, 2); }
    if (plein) { c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(8, 4, 10, 1); }
    return (cache[k] = cv);
  };
  V.badgeURL = (v, plein) => cache['u' + v + (plein ? 1 : 0)] || (cache['u' + v + (plein ? 1 : 0)] = V.badge(v, plein).toDataURL());
  const img = (v, plein, cls) => `<img class="badge${cls ? ' ' + cls : ''}" alt="" src="${V.badgeURL(v, plein)}">`;

  /* ================= gagner, reconnaître ================= */
  // La Valeur d'en face, quand le mal est tranché (oeuvres.js l'appelle au moment où cela arrive)
  V.gagne = async function (v) {
    const L = T('lames')[v], X = T('valeurs')[v] || {}; if (!L) return;
    I.oeuvres.learn('valeurs'); if (I.debug.auto) return;
    I.audio.sfx('light'); G.flash(L.couleur);
    await S.card('lame valeur', `${img(v, true, 'grand')}<p class="small">${I.t('Une Valeur')}</p><h1 style="color:${L.couleur}">${I.esc(L.name)}</h1><p class="ar">${I.esc(L.ar)}</p><p>${I.fmt(X.texte || '')}</p><p class="small">${I.t('Valeurs gardées : {n} / {sur}', { n: V.compte().valeurs, sur: IDS.length })}</p><div class="hint">▼</div>`);
  };
  // L'attribut divin que l'œuvre rappelle, quand la lame est forgée. Du texte, rien d'autre : ni figure, ni sprite.
  V.reconnait = async function (v) {
    const A = T('attributs')[v]; if (!A) return;
    I.oeuvres.learn('attributs'); if (I.debug.auto) return;
    I.audio.sfx('light');
    // 2.x : le verset et sa référence, dans la langue secondaire, sous ceux de la langue du jeu (tels que chaque langue les relève)
    const l2 = I.langue.l2(), v2 = l2 ? I.langue.second(A.verset, A, 'verset') : null, r2 = v2 ? I.langue.second(A.ref, A, 'ref') : null;
    const bloc = v2 ? S.bloc2(`<p>${I.esc(v2)}</p>${r2 ? `<p class="small">${I.langue.tDans(l2, '{ref}, traduction du sens', { ref: I.esc(r2) }, true) || I.esc(r2)}</p>` : ''}`) : '';
    await S.card('pray attribut', `<div class="orn">◌</div><p class="small">${I.t('Un attribut divin à reconnaître')}</p><h1>${I.esc(A.nom)}</h1><p class="sens">${I.esc(A.sens)}</p><p>${I.esc(A.verset)}</p><p class="small">${I.t('{ref}, traduction du sens', { ref: I.esc(A.ref) })}</p>${bloc}<p class="mot">${I.esc(A.mot)}</p><div class="hint">▼</div>`);
  };

  /* ================= la page de la halte ================= */
  const oeuvreDe = v => { const k = D.VICES[v].oeuvre, O = T('oeuvres')[k] || {}; return { k, nom: (O.court || O.name || k), n: Math.min(I.oeuvres.count(k), D.VICES[v].need), need: D.VICES[v].need }; };
  function carte(v) {
    const L = T('lames')[v] || {}, X = T('valeurs')[v] || {}, A = T('attributs')[v] || {}, E = (C0().enemies || {})[v] || {}, B = T('bien'), a = V.acquise(v), r = V.reconnu(v), o = oeuvreDe(v);
    return `<div class="bien-l${a ? ' on' : ''}">${img(v, a)}<div class="val"><b style="color:${a ? L.couleur : 'inherit'}">${I.esc(L.name || '')}</b> <small>${I.esc(L.ar || '')}</small><br>` +
      `<small>${a ? I.fmt(X.texte || '') : I.t('En face : {nom}.', { nom: I.esc(E.name || '') }) + ' ' + I.esc(B.gagner || '')}</small></div>` +
      `<div class="att${r ? ' on' : ''}"><i class="med">${r ? I.esc(A.nom || '') : '◌'}</i><small>${r ? I.t('« {sens} » · {ref}', { sens: I.esc(A.sens || ''), ref: I.esc(A.ref || '') }) : I.esc(B.reconnaitre || '') + ' ' + I.t('{oeuvre} : {n} / {sur}', { oeuvre: I.esc(o.nom), n: o.n, sur: o.need })}</small></div></div>`;
  }
  V.paneVue = function () {
    const B = T('bien'), n = V.compte();
    return `<h3>${I.esc(B.titre || I.t('Valeurs et attributs'))}</h3><p>${I.fmt(B.chapeau || '')}</p><p class="src">${I.t('Valeurs gardées : <b>{valeurs}</b> / {sur} · attributs reconnus : <b>{attributs}</b> / {sur}', { valeurs: n.valeurs, attributs: n.attributs, sur: n.sur })}</p>` +
      `<div class="bien">${IDS.map(carte).join('')}</div><p class="src">${I.fmt(B.note || '')}</p>`;
  };
  V.paneUne = function (v) {
    const L = T('lames')[v] || {}, X = T('valeurs')[v] || {}, A = T('attributs')[v] || {}, E = (C0().enemies || {})[v] || {}, B = T('bien'), a = V.acquise(v), r = V.reconnu(v), o = oeuvreDe(v);
    let h = `<h3 style="color:${L.couleur}">${img(v, a)} ${I.esc(L.name || '')} <small>${I.esc(L.ar || '')}</small></h3>`;
    h += `<p>${I.fmt(X.texte || '')}</p><p class="src">${a ? I.t('Valeur gardée.') : I.t('En face : {nom} ({face}).', { nom: I.esc(E.name || ''), face: I.esc(X.face || '') }) + ' ' + I.esc(B.gagner || '')}</p>`;
    h += `<p class="src">${r ? I.t('La lame : forgée.') : I.t('La lame : {oeuvre} {n} / {sur}.', { oeuvre: I.esc(o.nom), n: o.n, sur: o.need })} ${a ? '' : I.t('Le râwî peut faire face à ce mal en descendant dans la noosphère : au sortir de la prière, dans le dhikr, en songe.')}</p>`;
    h += '<h3>' + I.t('L’attribut') + '</h3>' + (r ? `<p class="att on"><i class="med">${I.esc(A.nom || '')}</i> <span>${I.t('« {sens} »', { sens: I.esc(A.sens || '') })}</span></p><p>${I.esc(A.verset || '')}</p><p class="src">${I.t('{ref}, traduction du sens', { ref: I.esc(A.ref || '') })}</p><p>${I.esc(A.mot || '')}</p>`
      : `<p class="att"><i class="med">◌</i> <span>${I.esc(B.reconnaitre || '')}</span></p>`);
    return h;
  };
  V.nom = v => (T('lames')[v] || {}).name || v;

  /* ================= les portes de la noosphère ================= */
  V.PORTES = ['priere', 'dhikr', 'sommeil'];
  V.restent = () => IDS.filter(v => !V.acquise(v));
  V.ouverte = k => !!S.flags['_o_porte_' + k]; // une descente par porte et par chapitre
  // Le râwî : Idris, personnage de fiction. Dans son propre récit, c'est lui tel qu'il est ; ailleurs, la Chaîne lui prête
  // la mesure du groupe qu'il accompagne.
  V.rawi = function () {
    const sg = I.sagas.idris, def = sg && sg.heroes && sg.heroes.idris; if (!def) return null;
    if (W.saga && W.saga.id === 'idris' && W.party.includes('idris')) return W.hero('idris');
    const key = 'idris:idris', sv = I.save.data.heroes[key] || { lvl: 1, xp: 0 }, chef = W.party.length ? W.hero(W.party[0]) : null;
    const h = { id: 'idris', key, def, lvl: Math.max(sv.lvl || 1, chef ? chef.lvl : 1), xp: sv.xp || 0, sakina: 0, niyya: 0, prete: true };
    const s0 = I.calc.of(h); h.hp = s0.hp; h.sp = s0.sp; return h;
  };
  // Descendre : un seul mal, face au râwî seul. Pas de reprise forcée : si le mal l'emporte, on remonte.
  V.descendre = async function (k, v) {
    const P = T('portes'), E = (C0().enemies || {})[v], X = T('valeurs')[v] || {}, h = V.rawi(); if (!E || !h) return null;
    S.flags['_o_porte_' + k] = true; I.oeuvres.learn('noos_interieure');
    S.depth++;
    let res = null;
    try {
      S.hideDialog();
      if (!I.debug.auto) await S.card('title noos', `<p class="small">${I.esc((P[k] || {}).titre || '')}</p><h1>${I.t('La noosphère')}</h1><p>${I.esc(P.seuil || '')}</p><div class="rule"></div><div class="hint">▼</div>`, 6000);
      res = await I.battle.start({ group: [v], bg: 'noos', w: 1, interieur: true, sansReprise: true, heros: [h], intro: I.t('{nom} : {face}.', { nom: E.name, face: X.face || '' }) });
      if (h.prete) I.save.data.heroes[h.key] = { lvl: h.lvl, xp: h.xp }; // ce que le râwî a appris lui reste
      if (W.map && W.saga && !W.lock) W.checkpoint();
    } finally { S.depth--; S.hideDialog(); }
    return res;
  };
  // Au sortir de la prière, dans le dhikr, en songe : la porte s'ouvre, et l'on choisit de descendre ou non. Depuis la 2.x,
  // on descend dans un labyrinthe (rodeurs.js) : ses maux du cœur et les idées noires y rôdent. Épuisé — rattrapé lors d'une
  // descente —, le râwî trouve les portes closes : il lui faut d'abord dormir, d'un sommeil sans songe.
  V.porte = async function (k) {
    const P = T('portes'), Pk = P[k], R = I.rodeurs; if (!Pk || !W.saga || !R || W.excursion) return null;
    if (W.ch && (W.ch.visite || Number.isInteger(W.ch.retour))) return null; // 2.x : une visite ou un retour en 2084 se rejouent — on n'y descend pas (une descente par porte et par chapitre d'un récit)
    if (R.clos()) { if (k === 'sommeil') { R.repos(); S.toast(I.esc(P.sansSonge || ''), 4600); } return null; }
    if (V.ouverte(k)) { if (k === 'sommeil') S.toast(I.esc(P.deja || ''), 2600); return null; }
    if (I.debug.auto || I.debug.walk) return I.debug.noOeuvres ? null : R.demande(k); // le joueur de test descend, et remonte par l'issue
    S.depth++;
    let oui = false;
    try { const i = await S.menuPick({ html: I.esc(Pk.invite) + '<small>' + I.esc(P.question || '') + '</small><small>' + I.esc(P.regle || '') + '</small>' }, [{ t: P.descendre || I.t('Descendre') }, { t: P.plusTard || I.t('Pas maintenant'), retour: true }]); oui = i === 0; }
    finally { S.depth--; S.hideDialog(); }
    return oui ? R.demande(k) : null;
  };
})();
