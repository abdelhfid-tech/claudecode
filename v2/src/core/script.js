/* ISNAD — interprète de scripts : dialogues, cartons, choix de fidélité, mise en scène. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, $ = I.$;
  const S = I.script = { depth: 0, flags: {} };
  Object.defineProperty(S, 'busy', { get() { return S.depth > 0; } });

  const KIND_COL = { homme: '#c8b48a', ancien: '#e6dcc4', soldat: '#b9bec8', romain: '#d86a5a', perse: '#5fb4cc', moine: '#b9a58a', enfant: '#f1d9a8', compagnon: '#ffe08a', marin: '#7fc4d8', cyber: '#39e6ff' };

  function speaker(who) {
    const W = I.world, saga = W.saga;
    const figOf = look => G.charURL(look, 0);
    if (saga && saga.heroes && saga.heroes[who]) { const h = saga.heroes[who]; return { name: h.name, seal: G.sealURL(h.arabic, D.ELEMENTS[h.el].color), color: D.ELEMENTS[h.el].color, fig: figOf(Object.assign({ kind: 'compagnon' }, h.look)) }; }
    const n = W.npcs && W.npcs.find(n => n.id === who);
    if (n) {
      if (n.hero && saga.heroes[n.hero]) { const h = saga.heroes[n.hero]; return { name: n.name || h.name, seal: G.sealURL(h.arabic, D.ELEMENTS[h.el].color), color: D.ELEMENTS[h.el].color, fig: figOf(Object.assign({ kind: 'compagnon' }, h.look)) }; }
      const col = KIND_COL[(n.look && n.look.kind) || 'homme'] || '#c8b48a';
      return { name: n.name, seal: G.sealURL('', col), color: col, fig: n.sheet && n.sheet.look ? figOf(n.sheet.look) : null };
    }
    return { name: who, seal: G.sealURL('', '#c8b48a'), color: '#c8b48a' };
  }

  /* ----- rien de ce que le joueur doit lire ne reste sous le noir d'un fondu -----
     Un script peut fondre au noir puis raconter (« fade out », un carton, des narrations) : le texte passe alors
     au-dessus du noir (classe « noir »). Le joueur de test signale tout texte qui resterait caché. */
  const noirci = () => +($('#fade').style.opacity || 0) > 0.5;
  function lisible(el) {
    if (!noirci()) return;
    if (S.TEXTE_SUR_NOIR) document.body.classList.add('noir');
    if (I.debug.log) { const z = e => +getComputedStyle(e).zIndex || 0; if (z(el) <= z($('#fade'))) I.debug.log.push('TEXTE CACHÉ sous le fondu : #' + el.id + ' « ' + (el.textContent || '').trim().slice(0, 50) + ' »'); }
  }
  S.TEXTE_SUR_NOIR = true; // à « false », on retrouve l'ancien comportement : le joueur de test doit alors signaler « TEXTE CACHÉ »
  // 2.x — une liste de choix tient à l'écran. Quand le joueur a agrandi le texte (ou sur un téléphone, où il est « grand »
  // d'emblée), une longue liste déborderait sous l'écran : ses caractères se resserrent alors, cran par cran, sans jamais
  // descendre sous la taille « normal ». Au-delà, la liste défile, comme avant.
  function ajuster(box) {
    box.style.fontSize = ''; const tz = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tz')) || 1, mini = Math.min(1, 1 / tz);
    for (const f of [0.94, 0.88, 0.82, 0.76, 0.7].filter(v => v > mini + 0.01).concat(mini)) { if (box.scrollHeight <= box.clientHeight + 2) break; box.style.fontSize = f.toFixed(3) + 'em'; }
  }
  S.ajuster = ajuster;

  /* ----- la marque (2.x, D189) : ce qui répond au geste du joueur se lit là où il regarde -----
     « Confiance +2 », « Un voile tombe » : la réplique ou la narration qui suit l'écrit après le nom de celui qui parle
     (span.marque). Si aucune boîte ne suit — un choix, un carton, la fin du récit —, la marque passe au fil. */
  const marques = []; let marqueT = null;
  const marqueAuFil = () => { clearTimeout(marqueT); if (marques.length) S.toast(marques.splice(0).join(' · ')); };
  S.marque = function (html) { marques.push(html); clearTimeout(marqueT); marqueT = setTimeout(marqueAuFil, 1500); };

  /* ----- 2.x · la langue secondaire (demande du décideur, 19 novembre) -----
     Le joueur qui l'a choisie (Réglages, « Langue secondaire ») lit, sous la bulle de celui qui parle, une seconde bulle :
     la même réplique dans une autre langue, écrite à la source dans cette langue (jamais un mot à mot). Elle paraît en
     entier quand la première a fini de s'écrire : on lit d'abord dans la langue du jeu, puis on compare — un toucher qui
     presse l'écriture les montre ensemble. En hauteur, elle est sous la boîte, dans la bande noire ; en largeur et au
     bureau, elle est en haut de la scène, comme la seconde ligne d'un film sous-titré en deux langues, et ne couvre pas
     celui qui parle, que la vue garde au milieu. Un carton du récit (titre, parole citée et sa source, verset) la porte
     sous son texte. Ni les menus, ni les choix, ni le combat : l'écran y est déjà plein. Sans langue secondaire, rien ne
     change : aucune bulle, aucun temps de plus. */
  const L2 = () => I.langue.l2();
  // le second texte, avec sa langue et son sens, posé dans un élément (une bulle, un bloc de carton)
  const marquer2 = (e, t) => { const l = L2(); e.lang = l; e.dir = I.langue.sens2(t); e.classList.toggle('latin', l === 'fr' || l === 'en'); return e; };
  // un bloc de carton dans la langue secondaire : du balisage déjà fait (html), dans un div.l2
  const bloc2 = html => { const e = marquer2(I.el('div', 'l2'), html.replace(/<[^>]*>/g, '')); e.innerHTML = html; return e.outerHTML; };
  S.bloc2 = bloc2;
  // la seconde bulle tient dans la place qu'elle a : ses caractères se resserrent, cran par cran, jamais sous dix points ;
  // au-delà, elle défile (aucun texte n'est coupé)
  function tenir2(e, base) {
    e.style.setProperty('--k2', 1); e.classList.remove('defile');
    for (const f of [0.94, 0.88, 0.82, 0.76, 0.7, 0.64]) { if (e.scrollHeight <= e.clientHeight + 2) return;
      if (base * f < 10) break; e.style.setProperty('--k2', f); }
    if (e.scrollHeight > e.clientHeight + 2) e.classList.add('defile');
  }
  // sa place : en hauteur, sous la boîte de dialogue (dans la bande noire, jusqu'au bas de l'écran) ; ailleurs, en haut de la
  // scène, au-dessus de la boîte (sans la toucher)
  // (force : la bulle vient de changer, ou l'écran ; sinon, rien n'est refait si la boîte n'a pas bougé)
  let place2 = '';
  S.placer2 = function (force) {
    const d2 = $('#dialog2'), box = $('#dialog'); if (!d2 || d2.hidden || box.hidden) return;
    const ui = $('#ui'), r = ui.getBoundingClientRect(), b = box.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    const cle = [document.body.classList.contains('portrait'), b.top, b.bottom, r.top, r.height, vh].map(v => Math.round(+v)).join(); if (!force && cle === place2) return; place2 = cle;
    if (document.body.classList.contains('portrait')) { const haut = b.bottom - r.top + 8; d2.style.top = haut.toFixed(1) + 'px'; d2.style.bottom = 'auto'; d2.style.maxHeight = Math.max(48, vh - b.bottom - 8 - 10) + 'px'; }
    else { d2.style.top = ''; d2.style.bottom = 'auto'; d2.style.maxHeight = Math.max(40, b.top - r.top - r.height * 0.03 - 8) + 'px'; }
    const t = d2.querySelector('.text'); tenir2(d2, parseFloat(getComputedStyle(t).fontSize) / (parseFloat(d2.style.getPropertyValue('--k2')) || 1));
  };
  function montrer2(kind, t2, html) {
    const d2 = $('#dialog2'); if (!d2) return;
    if (!t2) { d2.hidden = true; return; }
    d2.className = 'l2 ' + kind; marquer2(d2, t2); const tx = d2.querySelector('.text'); tx.innerHTML = html ? t2 : I.fmt(t2); tx.classList.toggle('latin', d2.classList.contains('latin'));
    d2.hidden = false; document.body.classList.add('avec2'); S.placer2(true); lisible(d2);
  }
  // la boîte de dialogue change de taille (une police qui arrive, le texte agrandi) : la seconde bulle la suit ; une police
  // qui arrive change aussi la sienne. (Sans langue secondaire, la bulle est cachée : rien n'est fait.)
  if (window.ResizeObserver) new ResizeObserver(() => { if (!$('#dialog2').hidden) requestAnimationFrame(() => S.placer2()); }).observe($('#dialog'));
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => { if (!$('#dialog2').hidden) S.placer2(true); });
  // (fin : la lecture s'achève — l'en-tête peut revenir ; entre deux répliques, il reste retiré)
  const cacher2 = fin => { const d2 = $('#dialog2'); if (d2 && !d2.hidden) d2.hidden = true; if (fin && document.body.classList.contains('avec2')) document.body.classList.remove('avec2'); };
  // un carton qui porte la langue secondaire tient dans l'écran : ses caractères se resserrent, jamais sous dix points
  function tenirCarton(c) {
    c.style.removeProperty('--k2'); if (!c.querySelector('.l2')) return;
    const mini = () => Math.min(...[...c.querySelectorAll('*')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)));
    let ok = 1; for (const f of [0.94, 0.88, 0.82, 0.76]) { if (c.scrollHeight <= c.clientHeight + 2) return; c.style.setProperty('--k2', f); if (mini() < 10) { c.style.setProperty('--k2', ok); return; } ok = f; }
  }

  /* ----- boîte de dialogue ----- */
  let typing = null;
  // o (facultatif) : { nom } le nom qui parle, imposé (le verdict de la Chaîne) ; { html } le texte est déjà du balisage
  // (une phrase du moteur, jamais un texte de récit) ; { duree } la ligne passe d'elle-même après ce temps, ou d'un toucher ;
  // 2.x : { src: [objet, champ] } d'où vient le texte (pour la langue secondaire) ; { l2 } le second texte, déjà dit
  async function showLine(kind, sp, text, o) {
    o = o || {};
    const t2 = L2() ? (o.l2 !== undefined ? o.l2 : I.langue.second(text, o.src && o.src[0], o.src && o.src[1])) : null; cacher2();
    const box = $('#dialog'); box.hidden = false; box.className = kind;
    document.body.classList.add('in-dialog');
    $('#dialog .seal').style.backgroundImage = sp ? `url(${sp.seal})` : 'none';
    $('#dialog .seal').hidden = !sp;
    const fg = $('#dialog .fig'); fg.hidden = !(sp && sp.fig); if (sp && sp.fig) fg.src = sp.fig; box.classList.toggle('avecfig', !!(sp && sp.fig)); // la silhouette de celui qui parle
    const nm = $('#dialog .name'); nm.textContent = sp ? sp.name : (o.nom || (I.world.saga && I.world.saga.narrator) || I.t('La Chaîne')); nm.style.color = sp ? sp.color : '#ffe08a';
    nm.dir = I.langue.sens(nm.textContent); // chaque ligne prend le sens de sa langue (la scène, elle, reste de gauche à droite)
    if (marques.length) { clearTimeout(marqueT); const m = I.el('span', 'marque', marques.splice(0).join(' · ')); m.dir = I.langue.sens(m.textContent); nm.appendChild(m); }
    const tx = $('#dialog .text'); const html = o.html ? text : I.fmt(text); tx.dir = I.langue.sens(text);
    // effet machine à écrire sur le texte brut, puis rendu complet
    const plain = (o.html ? text.replace(/<[^>]*>/g, '') : text).replace(/\*/g, ''); let i = 0, done = false;
    tx.textContent = '';
    $('#dialog .next').style.visibility = 'hidden';
    const fast = I.speed > 3;
    await new Promise(res => {
      const finish = () => { if (done) return; done = true; clearInterval(typing); I.input.pop(h); tx.innerHTML = html; if (t2) montrer2(kind, t2, o.html); res(); };   // 2.x : la seconde bulle, en entier, quand la première est écrite
      const h = I.input.push(a => { if (a === 'ok' || a === 'cancel') finish(); return true; });
      if (fast) return finish();
      let tick = 0;
      typing = setInterval(() => { i = I.langue.avance(plain, i); tx.textContent = plain.slice(0, i); if (++tick % 3 === 0) I.audio.sfx('step'); if (i >= plain.length) finish(); }, 22);
    });
    $('#dialog .next').style.visibility = 'visible'; lisible(box);
    await I.sleep(60);
    if (I.debug.auto) await I.sleep(30); else if (o.duree) await I.input.waitTimed(['ok', 'cancel'], o.duree + (t2 ? S.lecture2(t2) : 0), 0); else await I.input.wait(['ok', 'cancel']);
    I.audio.sfx('blip');
  }
  S.showLine = showLine;
  S.hideDialog = function () { marqueAuFil(); $('#dialog').hidden = true; cacher2(true); document.body.classList.remove('in-dialog'); if (S.depth === 0 && I.world) I.world.focus = null; };
  // le temps de lire une ligne du moteur : 1,2 s, plus 45 ms par signe pesé (le japonais dit plus en moins de signes)
  S.lecture = html => I.clamp(1200 + 45 * I.langue.poids(String(html).replace(/<[^>]*>/g, '')), 1800, 5000);
  S.lecture2 = html => I.clamp(1200 + 45 * I.langue.poids2(String(html).replace(/<[^>]*>/g, '')), 1800, 5000);   // la même, pour la langue secondaire
  // le verdict de la Chaîne : dit par la Chaîne elle-même, en une ligne, seul, avant la suite du récit — jamais sur la
  // parole de quelqu'un, ni au-dessus d'une parole citée (exigence 3). Il passe de lui-même, ou d'un toucher.
  // (fr : la phrase française du moteur ; 2.x, la langue secondaire la dit aussi)
  const verdict = fr => { const html = I.t(fr); return showLine('nar', null, html, { nom: I.t('La Chaîne'), html: true, duree: S.lecture(html), l2: L2() ? I.langue.tDans(L2(), fr) : null }); };

  /* ----- cartons ----- */
  async function card(cls, html, auto) {
    marqueAuFil();
    const c = $('#card'); c.className = cls; c.innerHTML = html; c.hidden = false;
    document.body.classList.add('en-carton'); // l'en-tête et le fil se masquent le temps du carton (en hauteur, ils transparaissaient dessous)
    if (L2() && c.querySelector('.l2')) { c.classList.add('avec2'); tenirCarton(c); if (auto) auto += S.lecture2(c.querySelector('.l2').textContent); }   // 2.x : la langue secondaire tient dans l'écran, et le carton reste le temps de la lire
    void c.offsetWidth; c.classList.add('on'); lisible(c);
    try {
      if (I.debug.auto) await I.sleep(60);
      else if (auto) await I.input.waitTimed(['ok', 'cancel'], auto, 500);
      else { await I.sleep(350); await I.input.wait(['ok', 'cancel']); }
      c.classList.remove('on'); await I.sleep(260); c.hidden = true;
    } finally { if (c.hidden || !c.classList.contains('on')) document.body.classList.remove('en-carton'); }
  }
  S.card = card;

  /* ----- choix ----- */
  const cid = id => id.indexOf('/') > 0 ? id : I.world.saga.id + '/' + id; // « saga/id » : un savoir appris ailleurs
  function known(id) { return I.save.data.codex.includes(cid(id)); }
  S.known = known;
  function lockLabel(o) { const e = I.ui.codexEntry(cid(o.need)); return `<span class="lock">✧ ${e ? (o.need.indexOf('/') > 0 ? I.t('Savoir requis : {titre} ({saga})', { titre: I.esc(e.title), saga: I.esc(e.saga.name) }) : I.t('Savoir requis : {titre}', { titre: I.esc(e.title) })) : I.t('Savoir requis')}</span>`; }
  // 2.x (D189) — une liste qui défile encore une fois resserrée le dit : un repère reste au bas de la boîte (« ▾ encore 2
  // réponses ») tant que la dernière réponse n'est pas entière à l'écran. Il ne prend aucun toucher.
  function repere(box) {
    const vieux = box.querySelector('.repere'); if (vieux) vieux.remove(); box.onscroll = null;
    if (box.scrollHeight <= box.clientHeight + 2) return;
    const r = I.el('div', 'repere'), btns = [...box.querySelectorAll('.opt')]; r.setAttribute('aria-hidden', 'true'); box.appendChild(r);
    // une réponse se lit entière quand son texte finit au-dessus du repère (son bord, dessous, peut être caché)
    const fin = b => { const g = document.createRange(); g.selectNodeContents(b); return g.getBoundingClientRect().bottom; };
    const maj = () => { const haut = Math.min(r.getBoundingClientRect().top, box.getBoundingClientRect().bottom) + 2, n = btns.filter(b => fin(b) > haut).length;
      r.classList.toggle('fin', !n); if (n) { r.textContent = I.t('▾ encore {n} réponse¦▾ encore {n} réponses', { n }); r.dir = I.langue.sens(r.textContent); } };
    box.onscroll = maj; maj();
  }
  // la boîte a changé de contenu (« ▸ La suite ») : elle se resserre de nouveau, et son repère se refait
  S.refaire = box => { ajuster(box); repere(box); };
  // head : l'en-tête de la liste (du balisage), ou { cls, html } ; extra : { touches: { action: fn } }, des touches de plus
  function menuPick(prompt, options, head, extra) {
    extra = extra || {}; marqueAuFil();
    return new Promise(res => {
      const box = $('#choice'); box.hidden = false; box.innerHTML = ''; box.onscroll = null;
      document.body.classList.add('in-dialog');
      if (head) { const hd = typeof head === 'object' ? head : { html: head }, e = I.el('div', 'phead' + (hd.cls ? ' ' + hd.cls : ''), hd.html); e.dir = I.langue.sens(e.textContent); box.appendChild(e); }
      const pr = typeof prompt === 'object' ? I.el('div', 'prompt ' + (prompt.cls || ''), prompt.html) : I.el('div', 'prompt', I.fmt(prompt)); pr.dir = I.langue.sens(pr.textContent); box.appendChild(pr); box.scrollTop = 0;
      let idx = 0; const btns = [];
      const locked = o => o.need !== undefined && !known(o.need);
      const sel = i => { idx = (i + btns.length) % btns.length; btns.forEach((b, j) => b.classList.toggle('sel', j === idx)); };
      const ne = performance.now(); // un menu n'accepte rien pendant un tiers de seconde : le toucher qui vient de faire avancer le texte ne répond pas à la place du joueur
      const done = i => { if (!I.debug.auto && performance.now() - ne < 350) return; if (locked(options[i])) { I.audio.sfx('dark'); return; } I.input.pop(h); box.hidden = true; box.onscroll = null; I.audio.sfx('ok'); res(i); };
      options.forEach((o, i) => { const el = o.el ? `<i class="el" style="color:${D.ELEMENTS[o.el].color}">${D.ELEMENTS[o.el].glyph}</i> ` : ''; const b = I.el('button', 'opt' + (locked(o) ? ' locked' : ''), locked(o) ? lockLabel(o) : el + (o.html || I.fmt(o.t)) + (o.need !== undefined ? ' <span class="kn">✧ ' + I.t('savoir') + '</span>' : '')); b.type = 'button'; b.dir = I.langue.sens(b.textContent); b.onclick = e => { e.stopPropagation(); done(i); }; b.onmouseenter = () => sel(i); btns.push(b); box.appendChild(b); });
      sel(Math.max(0, options.findIndex(o => !locked(o)))); lisible(box); ajuster(box); repere(box);
      const vue = () => { if (btns[idx].scrollIntoView) btns[idx].scrollIntoView({ block: 'nearest' }); }; // une longue liste suit la sélection
      const h = I.input.push(a => { if (a === 'up') { sel(idx - 1); vue(); I.audio.sfx('move'); } else if (a === 'down') { sel(idx + 1); vue(); I.audio.sfx('move'); } else if (a === 'ok') done(idx); else if (extra.touches && extra.touches[a]) extra.touches[a](); return true; });
      if (I.debug.auto) setTimeout(() => {
        const open = options.map((o, i) => i).filter(i => !locked(options[i]));
        if (options.some(o => typeof o.v === 'number')) { const pick = open.slice().sort((x, y) => I.debug.pickWrong ? options[x].v - options[y].v : options[y].v - options[x].v)[0]; return done(pick); }
        const bad = open.find(i => !options[i].ok), good = open.find(i => options[i].ok);
        done(I.debug.pickWrong && bad !== undefined && good !== undefined ? bad : (good !== undefined ? good : open[0]));
      }, 40);
    });
  }
  S.menuPick = menuPick;

  /* ----- pourparler : la parole avant le sabre ----- */
  async function runParley(P) {
    const W = I.world, sv = I.save.data, sp = speaker(P.with), n = P.rounds.length;
    S.hideDialog(); I.audio.music('conseil');
    let conf = S.flags._prayed ? 1 : 0;
    const pips = () => { let h = ''; for (let i = 0; i < P.goal; i++) h += `<i class="pip${i < conf ? ' on' : ''}"></i>`; return h; };
    // 2.x (D189, lot 2) : l'en-tête tient en deux lignes — le titre et la manche, puis la confiance ; le nom de
    // l'interlocuteur n'y est plus, puisqu'il vient de parler, et sa question tient lieu d'invite
    const head = r => ({ cls: 'court manche', html: `<span class="seal" style="background-image:url(${sp.seal})"></span><span class="pt"><b>${I.esc(P.title)}</b><small>${I.t('manche {manche} / {total}', { manche: r + 1, total: n })}</small></span><span class="trust">${I.t('Confiance')} <span class="pips">${pips()}</span></span>` });
    await card('title parley', `<p class="small">${I.t('Pourparler')}</p><h1>${I.fmt(P.title)}</h1><p>${I.fmt(P.intro)}</p>${S.flags._prayed ? '<p class="small">' + I.t('Sérénité de la prière : +1 de confiance') + '</p>' : ''}<div class="rule"></div><div class="hint">▼</div>`);
    for (let r = 0; r < n; r++) {
      const R = P.rounds[r];
      await showLine('say', sp, R.say, { src: [R, 'say'] }); S.hideDialog();
      if (R.noir) {
        const N = R.noir, gain = N.v || 1;
        // L'échelle des réponses (décision du décideur) : une idée noire pèse sur une personne, on lui répond par la parole ;
        // un égrégore le tient (rencontres de la Cité-Miroir), cela se combat.
        if (I.mal.estIdee(N)) await I.mal.dissiper(N, P);
        else {
          await card('title parley noir', `<p class="small">${I.t('Il n’entend plus que cela')}</p><h1>${I.fmt(N.name)}</h1><p>${I.fmt(N.intro)}</p><p class="small">${I.t('Ce n’est pas lui qu’on combat : c’est ce qu’il regarde.')}</p><div class="rule"></div><div class="hint">▼</div>`);
          await I.battle.start({ group: N.group, bg: N.bg || 'noos', noir: true, intro: N.say || I.t('Il parle plus fort que toi. Dissipe-le.') });
          I.mal.note('n', P.title + '|' + N.name, -1);
        }
        conf += gain; I.audio.music('conseil'); S.marque(I.t('<b>Confiance +{gain}</b> — son regard s’éclaircit', { gain })); // à côté du nom de celui qui répond
        if (N.after) { await showLine('say', sp, N.after, { src: [N, 'after'] }); S.hideDialog(); }
      }
      const i = await menuPick({ cls: 'dit', html: I.t('« {dit} »', { dit: I.fmt(R.say) }) }, R.opts, head(r)); const o = R.opts[i];
      conf = Math.max(0, conf + o.v);
      S.marque(o.v > 0 ? I.t('<b>Confiance +{v}</b>', { v: o.v }) : o.v < 0 ? I.t('<b>Confiance {v}</b> — il se ferme', { v: o.v }) : I.t('Il ne bouge pas.')); I.audio.sfx(o.v > 0 ? 'light' : o.v < 0 ? 'dark' : 'blip');
      await showLine('say', sp, o.r, { src: [o, 'r'] });
    }
    S.hideDialog(); sv.parley.total++;
    const ok = conf >= P.goal;
    I.mal.note('p', P.title, ok ? -1 : 1); // la parole qui porte déracine l'idée ; la parole manquée la laisse s'enfoncer
    if (ok) {
      sv.parley.won++; I.audio.sfx('roll'); G.flash('#ffe08a');
      const xp = P.xp || Math.round(22 + 12 * W.hero(W.party[0]).lvl), lines = I.battle.grantXP(xp);
      await I.oeuvres.rally();
      await card('victory', `<p class="small">${I.t('Pourparler · {titre}', { titre: I.esc(P.title) })}</p><h1>${I.t('La parole a suffi')}</h1><ul><li>${I.t('Confiance : <b>{conf} / {but}</b>', { conf, but: P.goal })}</li><li>${I.t('Expérience : <b>+{xp}</b>', { xp })}</li>${lines.join('')}</ul><div class="hint">▼</div>`);
      await S.run(P.win);
    } else {
      I.audio.sfx('dark'); G.shake(260);
      await card('defeat', `<p class="small">${I.t('Pourparler · {titre}', { titre: I.esc(P.title) })}</p><h1>${I.t('La parole n’a pas suffi')}</h1><p>${I.t('Confiance : {conf} / {but}. Ce qui n’a pas été noué par la parole devra l’être autrement, et coûtera davantage.', { conf, but: P.goal })}</p><div class="hint">▼</div>`);
      await S.run(P.lose);
    }
    const env = W.map && W.map.env; if (env && I.scene === W) I.audio.scene(env.music || 'silence'); else I.audio.back();
  }

  /* ----- le fil (2.x, D189 : « un texte à la fois ») -----
     Les annonces ne se posent plus sur l'image : elles passent dans le fil, une ligne qui ne parle que lorsque rien
     d'autre ne se lit (ni réplique, ni choix, ni carton, ni halte, ni combat, ni fondu au noir) et que le joueur a la main.
     - Chaque annonce entre dans #toasts à sa naissance, masquée, et n'y est jamais réinsérée : les outils de contrôle
       l'y lisent comme avant. Le fil en montre une à la fois ; celles qui naissent dans la même demi-seconde se joignent
       par « · », si la ligne tient (mesuré à l'écran). Chacune reste le temps de la lire (S.lecture : de 1,8 à 5 s).
     - Ce qui naît pendant une lecture attend ; trois annonces au plus attendent leur tour, et les plus anciennes ne se
       relisent alors qu'à la halte : S.fil garde les douze dernières, en mémoire seulement (jamais dans la partie).
     - Une leçon (lecons.js) est une ligne marquée de son outil : elle reste jusqu'à ce que l'outil ait resservi, trente
       secondes de lecture au plus ; une ligne « pas » (la règle d'une descente) reste jusqu'au premier pas.
     - L'incident et la sauvegarde refusée (« urgent ») passent outre. Ce qui naît dans la halte s'écrit sous son titre.
     S.toast(html, ms) : ms, d'avant le fil, est ignoré ; S.toast(html, { outil | pas | urgent }). Rend la ligne (un élément). */
  S.fil = [];
  const FIL = { file: [], cours: null, libreDepuis: 0, pause: false, haltT: null };
  const enHalte = () => !!(I.ui && I.ui.menuOpen) && !$('#menu').hidden;
  const lit = () => !$('#dialog').hidden || !$('#choice').hidden || !$('#card').hidden || !!document.querySelector('.screen:not([hidden])') || !!(I.ui && I.ui.menuOpen) || !!(I.battle && I.battle.active) || +($('#fade').style.opacity || 0) > 0.5;
  const libre = () => !lit() && !S.busy && !!I.world && I.scene === I.world && !I.world.lock;
  const lecon = x => !!(x.outil || x.pas);
  const oter = x => { const k = FIL.file.indexOf(x); if (k >= 0) FIL.file.splice(k, 1); if (FIL.cours && FIL.cours.items.includes(x)) FIL.cours.items = FIL.cours.items.filter(y => y !== x); x.el.remove(); };
  S.toast = function (html, o) {
    o = o && typeof o === 'object' ? o : {};
    const el = I.el('div', 'toast' + (o.outil || o.pas ? ' lecon' : ''), html); el.hidden = true; el.dir = I.langue.sens(el.textContent); if (o.outil) el.dataset.outil = o.outil;
    // 2.x : la langue secondaire, sur sa ligne, sous l'annonce — o.l2 (du balisage), ou ce que I.t vient de dire tel quel
    if (L2()) { const d = o.l2 === undefined ? I.langue.retrouver(html) : null, t2 = o.l2 !== undefined ? o.l2 : d ? I.langue.tDans(L2(), d.fr, d.p) : null;
      if (t2) { const s = marquer2(I.el('span', 'l2'), t2.replace(/<[^>]*>/g, '')); s.innerHTML = t2; el.appendChild(s); el.classList.add('avec2'); } }
    $('#toasts').appendChild(el); // à sa naissance, masquée
    S.fil.unshift({ html, t: Date.now() }); if (S.fil.length > 12) S.fil.length = 12;
    const x = { el, html, ne: performance.now(), outil: o.outil || null, pas: !!o.pas, urgent: !!o.urgent, vu: 0 };
    if (enHalte() && !lecon(x)) { el.remove(); S.filHalte(html); return el; } // née dans la halte : sous son titre (un incident aussi)
    FIL.file.push(x);
    if (x.urgent) { FIL.cours = null; tic(); return el; }
    // au-delà de trois en attente, les plus anciennes ne se relisent qu'à la halte (ce qui naît dans la même demi-seconde
    // passe ensemble : un même événement ne perd aucune de ses lignes)
    const attente = FIL.file.filter(y => !lecon(y) && !y.urgent && !(FIL.cours && FIL.cours.items.includes(y))), vieilles = attente.filter(y => x.ne - y.ne > 500);
    while (attente.length > 3 && vieilles.length) { const y = vieilles.shift(); attente.splice(attente.indexOf(y), 1); oter(y); }
    return el; // la ligne elle-même : qui l'a dite peut savoir quand elle se lit (la porte interdite, rodeurs.js)
  };
  // une leçon a resservi (son outil), ou une séquence s'achève (sans outil : les leçons déjà lues) — lecons.js
  S.filRetire = function (outil) { FIL.file.filter(x => x.outil && (outil ? x.outil === outil : x.vu >= 1500)).forEach(oter); if (FIL.cours && !FIL.cours.items.length) FIL.cours = null; };
  // la Chaîne s'ouvre : le récit est quitté, ce qui attendait n'est plus à dire (S.fil le garde)
  S.filVide = function () { FIL.file.slice().forEach(oter); FIL.cours = null; $('#toasts').innerHTML = ''; $('#toasts').className = ''; };
  // ce qui naît dans la halte s'écrit sous son titre, le temps de le lire
  S.filHalte = function (html) {
    const hd = $('#menu header'); if (!hd) return; let p = hd.querySelector('.dit'); if (!p) { p = I.el('p', 'dit'); hd.appendChild(p); }
    p.innerHTML = html; p.dir = I.langue.sens(p.textContent); p.hidden = false; clearTimeout(FIL.haltT); FIL.haltT = setTimeout(() => { p.hidden = true; }, S.lecture(html) + 600);
  };
  // la place du fil, en hauteur : sous l'en-tête (ou la barre de « Bâtir »), dans la bande noire ; il ne réserve aucune place
  S.filPlace = function () {
    const st = $('#stage'); if (!st || !document.body.classList.contains('portrait')) return; const b0 = st.getBoundingClientRect().bottom; let bas = 0;
    [$('#hud'), $('#buildbar')].forEach(e => { if (e && !e.hidden && e.offsetHeight) bas = Math.max(bas, e.getBoundingClientRect().bottom - b0); });
    const v = Math.round(bas) + 'px'; if (v !== FIL.place) { FIL.place = v; $('#ui').style.setProperty('--fil-haut', v); }
  };
  function montrer(g) {
    const box = $('#toasts'); [...box.children].forEach(e => { e.hidden = true; e.classList.remove('joint'); });
    g.items.forEach((x, i) => { x.el.hidden = false; x.el.classList.toggle('joint', i > 0); });
    box.dir = g.items[0].el.dir; box.classList.toggle('lecon', !!g.lecon); box.classList.add('montre');
  }
  // le groupe suivant : la règle d'une descente d'abord (elle se retire au premier pas) ; puis la plus ancienne annonce qui
  // attend, avec celles nées dans la même demi-seconde, si la ligne tient ; puis une leçon, qui reste jusqu'au geste
  function suivant() {
    const box = $('#toasts'), ord = FIL.file.filter(x => !lecon(x) && !x.urgent), pas = FIL.file.find(x => x.pas);
    if (pas) { const g = { items: [pas], lecon: true }; montrer(g); return g; }
    if (ord.length) {
      const a = ord[0], g = { items: [a] }; montrer(g); const h1 = box.offsetHeight;
      for (const b of ord.slice(1)) { if (b.ne - a.ne > 500 || a.el.classList.contains('avec2') || b.el.classList.contains('avec2')) break; g.items.push(b); montrer(g); if (box.offsetHeight > h1 + 2) { g.items.pop(); montrer(g); break; } } // (une annonce qui porte sa langue secondaire passe seule)
      g.reste = S.lecture(g.items.map(x => x.el.textContent).join(' · ')); return g;
    }
    const l = FIL.file.find(lecon); if (!l) return null;
    const g = { items: [l], lecon: true }; montrer(g); return g;
  }
  let dernier = performance.now();
  function tic() {
    const now = performance.now(), dt = Math.min(250, now - dernier), box = $('#toasts'); dernier = now; if (!box) return;
    S.filPlace();
    if (FIL.file.some(x => !x.el.isConnected)) { FIL.file = FIL.file.filter(x => x.el.isConnected); if (FIL.cours && FIL.cours.items.some(x => !x.el.isConnected)) { FIL.cours = null; box.classList.remove('montre'); } } // vidé d'ailleurs (la démo jouable le fait) : rien n'y reste à dire
    const urg = FIL.file.find(x => x.urgent);
    if (urg) { if (!FIL.cours || !FIL.cours.urgent) { FIL.cours = { items: [urg], urgent: true, reste: S.lecture(urg.html) + 1500 }; montrer(FIL.cours); }
      FIL.cours.reste -= dt; if (FIL.cours.reste <= 0) { oter(urg); FIL.cours = null; box.classList.remove('montre'); } return; }
    const ok = libre(); FIL.libreDepuis = ok ? (FIL.libreDepuis || now) : 0;
    if (!ok) { if (box.classList.contains('montre')) { box.classList.remove('montre'); FIL.pause = true; } return; } // ce qui naît pendant qu'on lit attend
    if (now - FIL.libreDepuis < 250) return; // la main vient de revenir : un temps, avant de parler
    let g = FIL.cours;
    if (g && g.lecon && !g.items[0].pas && FIL.file.some(x => x.pas || (!lecon(x) && !x.urgent))) g = FIL.cours = null; // une annonce passe avant la leçon, qui reviendra
    if (!g) { g = FIL.cours = suivant(); if (!g) { box.classList.remove('montre'); return; } }
    else if (FIL.pause || !box.classList.contains('montre')) { montrer(g); if (!g.lecon) g.reste = Math.max(g.reste, 1200); }
    FIL.pause = false;
    if (g.lecon) { const x = g.items[0]; x.vu += dt;
      const parti = x.pas && x.vu > 1200 && I.world.player && I.world.player.moving; // la règle d'une descente : jusqu'au premier pas (lue au moins un instant)
      if (x.vu > 30000 || parti || !FIL.file.includes(x)) { oter(x); FIL.cours = null; box.classList.remove('montre'); } return; }
    g.reste -= dt; if (g.reste <= 0) { g.items.forEach(oter); FIL.cours = null; box.classList.remove('montre'); }
  }
  setInterval(tic, 100);
  S.fade = async function (dir, ms) {
    const f = $('#fade'); ms = (ms || 450) / I.speed; f.style.transition = `opacity ${ms}ms ease`; f.style.opacity = dir === 'out' ? 1 : 0;
    if (dir !== 'out') document.body.classList.remove('noir'); // le jour revient : le texte reprend sa place sous les écrans
    await new Promise(r => setTimeout(r, ms + 30));
  };

  /* ----- exécution ----- */
  S.run = async function (ops) {
    if (!ops || !ops.length) return;
    S.depth++;
    try { for (const op of ops) { try { await exec(op); } catch (e) { I.report(e, 'récit (' + (op && op[0]) + ')'); } } }
    finally { S.depth--; if (S.depth === 0) S.hideDialog(); }
  };

  async function exec(op) {
    const W = I.world, a = op[1], b = op[2], c = op[3];
    switch (op[0]) {
      case 'say': W.focus = (W.npcs && W.map && W.npcs.find(n => n.id === a && !n.hidden && n.map === W.map.id && n.placed)) || null; await showLine('say', speaker(a), b, { src: [op, 2] }); break;
      case 'nar': W.focus = null; await showLine('nar', null, a, { src: [op, 1] }); break;
      // 2.x : un carton du récit porte, sous son texte, la langue secondaire (la parole et sa source ; le titre et sa date)
      case 'quote': { S.hideDialog(); I.audio.sfx('light'); const sans = q => q.replace(/^«\s*/, '').replace(/\s*»$/, ''), a2 = L2() ? I.langue.second(a, op, 1) : null, b2 = a2 ? I.langue.second(b, op, 2) : null;
        await card('quote', `<div class="orn">❖</div><blockquote>${I.fmt(sans(a))}</blockquote><cite>${I.fmt(b)}</cite>${a2 ? bloc2(`<blockquote>${I.fmt(sans(a2))}</blockquote>${b2 ? `<cite>${I.fmt(b2)}</cite>` : ''}`) : ''}<div class="hint">▼</div>`); break; }
      case 'title': { S.hideDialog(); I.audio.sfx('roll'); const a2 = L2() ? I.langue.second(a, op, 1) : null, b2 = a2 && b ? I.langue.second(b, op, 2) : null;
        await card('title', `<h1>${I.fmt(a)}</h1>${b ? `<p>${I.fmt(b)}</p>` : ''}<div class="rule"></div>${a2 ? bloc2(`<h2>${I.fmt(a2)}</h2>${b2 ? `<p>${I.fmt(b2)}</p>` : ''}`) : ''}`, 3000); break; }
      case 'choice': {
        S.hideDialog();
        let opts = b.slice(), first = true; const sv = I.save.data;
        sv.isnad.total++; const spc = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); spc.cTot = (spc.cTot || 0) + 1;
        // 2.x : au premier acte à retrouver, on apprend où sont les sources — la leçon s'écrit sous la question, tant que le choix est ouvert
        let lecon = ''; if (I.lecons && I.lecons.actif()) I.lecons.proposer('source', () => { lecon = I.lecons.texte('source'); });
        while (true) {
          const i = await menuPick(lecon ? { html: I.fmt(a) + '<small class="lecon" dir="' + I.langue.sens(lecon.replace(/<[^>]*>/g, '')) + '">' + lecon + '</small>' } : a, opts); const o = opts[i]; // la leçon a son propre sens (une leçon encore en français, sous une question arabe)
          if (o.ok) { if (first) { if (I.lecons) I.lecons.reemploi('source'); sv.isnad.ok++; spc.cOk = (spc.cOk || 0) + 1; I.audio.sfx('light'); W.gainSakina && W.gainSakina(20); I.mal.note('c', a, 0); await verdict(I.T('<b>Chaîne intacte</b> — c’est ce qui fut rapporté.')); } if (o.r) await S.run(o.r); break; }
          if (first) I.mal.note('c', a, 1); // un acte que les transmetteurs n'ont pas rapporté : l'idée s'enracine
          first = false; I.audio.sfx('glitch'); G.shake(260); G.flash('#7a5cff');
          await verdict(I.T('<b>La chaîne vacille…</b> ce n’est pas ce qui fut rapporté.'));
          if (o.r) await S.run(o.r);
          S.hideDialog();
          opts = opts.filter(x => x !== o); if (opts.length === 1 && I.debug.auto) { /* continue */ }
        }
        break;
      }
      case 'ask': { S.hideDialog(); const i = await menuPick(a, b); if (b[i].r) await S.run(b[i].r); break; }
      case 'parley': await runParley(a); break;
      case 'pray': await W.pray(a, true); break; // jouée par le récit : pas de point de reprise au milieu d'un objectif
      case 'emote': W.emote(a, b); break;
      case 'save': await I.ui.saveMenu(); break;
      case 'pillar': W.pillar(a, b); break;
      case 'mus': I.audio.scene(a); break; // l'humeur posée par le récit devient la musique du lieu, jusqu'à la carte suivante
      case 'mat': I.build.give(a, b === undefined ? 1 : b); break;
      case 'lore': I.trade.lore(a); break;
      case 'raid': S.hideDialog(); await I.trade.raid(a || {}); break;
      case 'vices': S.hideDialog(); await I.oeuvres.finale(a || {}); break;
      case 'site': I.build.openSite(a); break;
      case 'battle': S.hideDialog(); await I.battle.start(a); break;
      case 'map': S.hideDialog(); await S.fade('out'); W.loadMap(a, I.rodeurs ? I.rodeurs.graine(a, c || {}) : (c || {}), b); await S.fade('in'); break; // 2.x : descendre dans la noosphère, c'est y trouver un labyrinthe
      case 'tp': { const e = W.ent(a); if (e) { const p = W.resolve(b, e === W.player ? W.map.id : e.map, e); if (p) { e.x = p[0]; e.y = p[1]; e.placed = true; e.placedMap = W.map.id; if (e === W.player) W.resetTrail(); } else { e.at = b; e.placed = false; } } break; }
      case 'walk': { const e = W.ent(a); if (e) { const p = W.resolve(b, e === W.player ? W.map.id : e.map, e); if (p) { if (e.hidden || I.debug.auto) { e.x = p[0]; e.y = p[1]; } else await W.walkTo(e, p[0], p[1]); if (e !== W.player) { e.placed = true; e.placedMap = W.map.id; } } else { e.at = b; e.placed = false; } } break; }
      case 'face': { const e = W.ent(a); if (e) e.dir = G.DIRS[b]; break; }
      case 'show': { const e = W.ent(a); if (e) { e.hidden = false; W.place(e); W.ecarter(e); } break; } // 2.16 : qui paraît sur le joueur s'en écarte
      case 'hide': { const e = W.ent(a); if (e) e.hidden = true; break; }
      case 'fade': S.hideDialog(); await S.fade(a, b); break;
      case 'wait': await I.sleep(I.debug.auto ? 10 : a); break;
      case 'shake': G.shake(a || 400); I.audio.sfx('hit'); break;
      case 'flash': G.flash(a || '#fff'); break;
      case 'sfx': I.audio.sfx(a); break;
      case 'give': { if (D.GEAR[a]) { await I.gear.receive(a, b || 1); break; } const n = b || 1, it = D.ITEMS[a]; const inv = I.save.data.items; inv[a] = (inv[a] || 0) + n; S.toast(I.t('Reçu : <b>{nom}</b>¦Reçu : <b>{nom}</b> ×{n}', { nom: it.name, n })); I.audio.sfx('ok'); break; }
      case 'join': W.join(a); break;
      case 'leave': W.leave(a); break;
      case 'codex': I.ui.unlockCodex(a); break;
      case 'heal': W.healAll(); S.toast(I.t('Le groupe reprend son souffle.')); break;
      case 'flag': S.flags[a] = b === undefined ? true : b; break;
      case 'if': if (S.flags[a]) await S.run(b); else if (c) await S.run(c); break;
      case 'tint': W.tint = a || null; break;
      case 'light': {
        S.hideDialog(); const e = D.ELEMENTS[a]; const sv = I.save.data; if (!sv.lights.includes(a)) sv.lights.push(a); I.save.store();
        G.flash(e.color); I.audio.sfx('roll');
        for (let i = 0; i < 60; i++) G.spawn({ x: G.PW / 2, y: G.PH / 2, vx: (Math.random() - 0.5) * 220, vy: (Math.random() - 0.5) * 160, life: 1.6 + Math.random(), size: 1 + Math.random(), color: e.color, type: 'spark' });
        await card('lightcard', `<div class="glyph" style="color:${e.color}">${e.glyph}</div><p class="small">${I.t('Lumière retrouvée')}</p><h1 style="color:${e.color}">${e.name}</h1><p class="ar">${e.ar}</p><div class="hint">▼</div>`);
        break;
      }
    }
  }
})();
