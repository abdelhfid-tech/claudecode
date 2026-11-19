/* ISNAD 2.x — partager sa progression.
   Demande du décideur, 19 novembre : « la possibilité de partager sa progression sur les réseaux sociaux ».

   Un bouton, « Partager ma progression », au pied de la Chaîne et dans la halte (sous « Reprendre »), dès qu'un maillon est
   achevé — ce n'est pas un outil du jeu : aucune leçon ne l'annonce (lecons.js). Il ouvre un aperçu : une image dessinée
   par le jeu (carrée, 1080 × 1080, ou verticale, 1080 × 1920, pour les « stories ») et un court texte.

   Ce qu'ils disent : LE RÉCIT SEULEMENT. Le titre et son sous-titre, le nom du râwî tel que le joueur l'a choisi (et, s'il le
   veut, son personnage, dessiné par le moteur — un personnage de fiction : il a un visage, sans lueur ni rayonnement), les
   maillons achevés sur cinq avec leurs sceaux, les Lumières retrouvées, la fidélité à la Chaîne, le chapitre en cours,
   l'adresse et la réserve (décision 39 : elle reste sur tout support). L'adresse, le titre, le sous-titre et la réserve ne
   s'écrivent qu'à un endroit, v2/tools/promotion.js : l'assemblage les pose dans la page (window.ISNAD_PROMO), et
   v2/tools/langues.js relève le sous-titre et la réserve pour les trois autres langues.
   Ce qu'ils ne disent jamais : les œuvres et leurs nombres, la provision du cœur, les maux du cœur, les lames, les idées
   noires, les Valeurs et les attributs, la descente dans la noosphère (la vie intérieure ne se partage pas : la distance
   avec le joueur, D187 ; exigences 13 et 15) ; ni les piliers de la Citadelle, ni les pourparlers, ni les combats ; aucun
   Compagnon dessiné (seulement les sceaux de la Chaîne, sans visage) ; aucune figure (exigence 24) ; aucun Nom divin.

   Le partage : navigator.share avec l'image, quand le navigateur sait la partager (navigator.canShare({ files })) — la
   feuille de partage du téléphone, qui mène à tous les réseaux ; sinon, ou s'il refuse (dans un cadre isolé, comme la page
   privée où le jeu est publié pour l'instant), le repli : le texte est copié, l'image montrée en grand pour qu'on la garde
   d'un appui long, et, hors d'un Artifact, « Enregistrer l'image ». Aucune requête réseau, aucun réseau nommé. */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, G = I.gfx, U = I.ui, W = I.world, $ = I.$;
  const Pa = I.partage = {};
  const P = window.ISNAD_PROMO || null;   // v2/tools/build.js, d'après v2/tools/promotion.js
  const FORMATS = { carre: [1080, 1080], vertical: [1080, 1920] };
  const FICHIER = 'isnad-progression.png';
  const OR = '#e9c877', SABLE = '#f3e7cc', TERNE = '#b3a890', BLANC = '#fff6dc', ENCRE = '#07060d';
  const LOGO = '"Cinzel", "Trajan Pro", "Times New Roman", serif';
  const ARABE = '"Reem Kufi", "Noto Kufi Arabic", "Noto Naskh Arabic", "Amiri", "Geeza Pro", serif';
  const SYMB = '"DejaVu Sans", "Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", sans-serif';
  // les polices de chaque langue : celles de la page (style.css, « les langues »)
  const POLICES = {
    fr: { titre: LOGO, corps: '"Alegreya", "Iowan Old Style", Georgia, "Times New Roman", serif' },
    ar: { titre: '"Reem Kufi", "Noto Kufi Arabic", "Geeza Pro", "Segoe UI", sans-serif', corps: '"Noto Naskh Arabic", "Amiri", "Geeza Pro", "Segoe UI", serif' },
    ja: { titre: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif', corps: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif' }
  };
  const polices = () => POLICES[I.langue.lang] || POLICES.fr;
  const latin = () => I.langue.lang === 'fr' || I.langue.lang === 'en';   // ni capitales, ni lettres espacées, ni italique en arabe et en japonais
  const sep = () => (I.langue.lang === 'ja' ? '・' : ' · ');   // ce qui sépare deux mentions, comme dans les textes de chaque langue
  const nomDuJeu = () => (I.langue.lang === 'ar' ? 'إسناد' : P.NOM);   // l'arabe écrit le jeu « إسناد » (glossaire arabe : jamais de lettres latines dans une phrase arabe)

  /* ---------- ce qui se partage ---------- */
  // le bouton : dès qu'un maillon est achevé, et seulement si l'assemblage a posé l'adresse et la réserve
  Pa.offert = () => !!(P && P.ADRESSE && P.RESERVE) && I.save.maillons().length > 0;
  // où en est le récit : le chapitre que l'on joue, sinon le récit quitté en dernier, sinon le maillon à ouvrir
  const enCours = (un, fait) => {
    const sv = I.save.data;
    if (sv.epilogue) return I.t('La Chaîne est transmise');
    let saga = null, ch = null;
    if (I.scene === W && W.map && W.saga && W.ch && !W.saga.commun) { saga = W.saga; ch = W.ch; }
    else { const c = sv.cp && I.sagas[sv.cp.saga] && (I.sagas[sv.cp.saga].chapters || [])[sv.cp.ci] ? sv.cp : W.rangees()[0]; if (c) { saga = I.sagas[c.saga]; ch = saga.chapters[c.ci]; } }
    if (saga && ch) return saga.veillees ? I.t('En cours : la veillée · {chapitre}', { chapitre: ch.title }) : saga.frame ? I.t('En cours : 2084 · {chapitre}', { chapitre: ch.title }) : I.t('En cours : {recit} · {chapitre}', { recit: saga.name, chapitre: ch.title });
    const s = un.sagas.find(x => !fait(x));
    return s ? I.t('Prochain maillon : {nom}', { nom: s.name }) : I.t('Prochain maillon : le dernier maillon');
  };
  // l'état du récit — rien d'autre n'en sort
  Pa.etat = function () {
    const sv = I.save.data, un = I.livres().find(L => L.n === 1) || { sagas: [] }, fait = s => !!(sv.sagas[s.id] && sv.sagas[s.id].done);
    const maillons = un.sagas.map(s => { const e = D.ELEMENTS[s.light] || D.ELEMENTS.fer; return { id: s.id, nom: s.name, arabic: s.arabic, couleur: e.color, glyphe: e.glyph, lumiere: e.name, fait: fait(s), retrouvee: sv.lights.includes(s.light) }; });
    const fr = I.sagas.idris, h = fr && fr.heroes.idris;
    return { nom: I.perso.dit(), qualite: h ? [h.title, fr.years].filter(Boolean).join(sep()) : '', maillons, faits: maillons.filter(m => m.fait).length, total: maillons.length,
      lumieres: maillons.filter(m => m.retrouvee).length, fidelite: { ok: sv.isnad.ok | 0, total: sv.isnad.total | 0 }, enCours: enCours(un, fait) };
  };
  const ligneMaillons = e => I.t('{n} maillon achevé sur {total}¦{n} maillons achevés sur {total}', { n: e.faits, total: e.total });
  const ligneLumieres = e => I.t('Lumières retrouvées : {n} / {total}', { n: e.lumieres, total: e.total });
  const ligneFidelite = e => I.t('Fidélité à la Chaîne : {ok} / {total}', e.fidelite);
  // le texte qui accompagne l'image : une phrase par ligne
  Pa.lignes = function (e) {
    e = e || Pa.etat();
    return [nomDuJeu() + sep() + I.t(P.SOUS_TITRE),
      I.t('{nom} suit la Chaîne : {n} maillon achevé sur {total}.¦{nom} suit la Chaîne : {n} maillons achevés sur {total}.', { nom: e.nom, n: e.faits, total: e.total }),
      ligneLumieres(e) + sep() + ligneFidelite(e), e.enCours, P.ADRESSE, I.t(P.RESERVE)];
  };
  Pa.texte = e => Pa.lignes(e).join('\n');

  /* ---------- l'image ---------- */
  // les morceaux entre lesquels une ligne peut se couper : les mots ; en japonais, chaque signe — sans commencer une ligne
  // par une ponctuation fermante, ni en finir une par une ouvrante —, les mots en lettres latines restant entiers
  const morceaux = t => {
    if (I.langue.lang !== 'ja') return t.split(/(\s+)/).filter(Boolean);
    // (un nom en katakana reste entier ; il se coupe après « ・ » ou « ＝ », qui restent en fin de ligne)
    const r = []; (t.match(/[A-Za-z0-9À-ÖØ-öø-ÿ'’.\-/]+|[゠-ヺー-ヿ]+|\s+|[^]/gu) || []).forEach(m => {
      if (r.length && /^[、。，．・：；？！ー）」』】〉》…／＝]/.test(m)) r[r.length - 1] += m; else if (r.length && /[（「『【〈《]$/.test(r[r.length - 1])) r[r.length - 1] += m; else r.push(m); });
    return r;
  };
  const couper = (c, t, max) => { const L = []; let cur = ''; morceaux(String(t)).forEach(m => { const essai = cur + m; if (cur.trim() && c.measureText(essai.trim()).width > max) { L.push(cur.trim()); cur = m.replace(/^\s+/, ''); } else cur = essai; }); if (cur.trim()) L.push(cur.trim()); return L; };
  // le râwî, de face, tel que le joueur l'a composé (perso.js), à la définition du dessin choisi
  const figure = () => { const h = I.sagas.idris && I.sagas.idris.heroes.idris, L = Object.assign({ kind: 'compagnon' }, h ? h.look : D.TENUES[0].look); try { return G.figure(L, 0); } catch (e) { I.report(e, 'partage'); return null; } };

  Pa.dessiner = function (format, perso, e) {
    e = e || Pa.etat();
    const [LW, LH] = FORMATS[format] || FORMATS.carre, haut = LH > LW, cv = G.mk(LW, LH), c = cv.getContext('2d');
    const F = polices(), rtl = I.langue.dir() === 'rtl', lat = latin(), textes = [];
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    const police = (taille, o) => `${o.italique && lat ? 'italic ' : ''}${o.poids || 400} ${Math.round(taille)}px ${o.police || F.corps}`;
    const espacer = (taille, o) => { if (!('letterSpacing' in c)) return 0; const e2 = (lat || o.latin) && o.espace ? Math.round(taille * o.espace) : 0; c.letterSpacing = e2 + 'px'; return e2; };
    // une ligne, centrée en x ; resserrée jusqu'à tenir dans max
    const ecrire = (t, x, y, o) => {
      o = o || {}; t = String(t); if (o.capitales && lat) t = t.toLocaleUpperCase(I.langue.locale()); let taille = o.taille || 30;
      c.direction = o.latin ? 'ltr' : rtl ? 'rtl' : 'ltr'; c.font = police(taille, o); let esp = espacer(taille, o);
      if (o.max) while (taille > (o.taille || 30) * 0.5 && c.measureText(t).width > o.max) { taille -= 1; c.font = police(taille, o); esp = espacer(taille, o); }
      c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; c.fillStyle = o.couleur || SABLE;
      if (o.ombre) { c.shadowColor = o.ombre; c.shadowBlur = o.flou || 18; }
      c.fillText(t, x + (c.direction === 'ltr' ? esp / 2 : -esp / 2), y); c.restore(); textes.push(t); return taille;
    };
    // un paragraphe, coupé en lignes ; resserré s'il en faut plus de o.lignes → sa hauteur
    const paragraphe = (t, x, y, max, o, mesure) => {
      o = o || {}; let taille = o.taille || 28; c.direction = rtl ? 'rtl' : 'ltr'; c.font = police(taille, o); espacer(taille, {}); let L = couper(c, t, max);
      while (o.lignes && L.length > o.lignes && taille > (o.taille || 28) * 0.6) { taille -= 1; c.font = police(taille, o); L = couper(c, t, max); }
      const h = Math.round(taille * (o.interligne || 1.32));
      if (!mesure) L.forEach((l, i) => ecrire(l, x, y + taille + i * h, Object.assign({}, o, { taille, max })));
      return L.length * h;
    };

    /* le fond : la nuit et le ciel de l'écran-titre, qui s'éteint vers le bas */
    const g = c.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#05041a'); g.addColorStop(0.55, '#120a26'); g.addColorStop(1, ENCRE); c.fillStyle = g; c.fillRect(0, 0, LW, LH);
    // (en vertical, le ciel est plus haut, rogné sur les côtés : le titre y tient au-dessus de l'horizon, hors des marges
    // que les « stories » recouvrent en haut et en bas)
    const ciel = U.fondTitre ? U.fondTitre() : null, hc = haut ? 700 : Math.round(LW * G.PH / G.PW), lc = Math.round(hc * G.PW / G.PH);
    if (ciel) { c.imageSmoothingEnabled = true; c.drawImage(ciel, Math.round((LW - lc) / 2), 0, lc, hc); }
    { const v = c.createLinearGradient(0, hc * 0.34, 0, hc); v.addColorStop(0, 'rgba(7,6,13,0)'); v.addColorStop(1, 'rgba(7,6,13,0.97)'); c.fillStyle = v; c.fillRect(0, 0, LW, hc + 2); }
    { const v = c.createLinearGradient(0, 0, 0, hc * 0.5); v.addColorStop(0, 'rgba(4,3,20,0.55)'); v.addColorStop(1, 'rgba(4,3,20,0)'); c.fillStyle = v; c.fillRect(0, 0, LW, hc * 0.5); }

    /* le titre : إسناد, ISNAD, le sous-titre */
    const T = haut ? { ar: 222, ar0: 70, logo: 362, logo0: 150, sous: 432, sous0: 34 } : { ar: 96, ar0: 60, logo: 214, logo0: 124, sous: 268, sous0: 28 };
    ecrire('إسناد', LW / 2, T.ar, { taille: T.ar0, police: ARABE, poids: 700, couleur: OR, ombre: 'rgba(233,200,119,.55)', flou: 30 });
    ecrire(P.NOM, LW / 2 + Math.round(T.logo0 * 0.04), T.logo + Math.round(T.logo0 * 0.03), { taille: T.logo0, police: LOGO, poids: 700, couleur: 'rgba(255,79,216,.45)', espace: 0.3, latin: true });
    ecrire(P.NOM, LW / 2 - Math.round(T.logo0 * 0.04), T.logo - Math.round(T.logo0 * 0.02), { taille: T.logo0, police: LOGO, poids: 700, couleur: 'rgba(57,230,255,.45)', espace: 0.3, latin: true });
    ecrire(P.NOM, LW / 2, T.logo, { taille: T.logo0, police: LOGO, poids: 700, couleur: BLANC, espace: 0.3, latin: true, ombre: 'rgba(233,200,119,.6)', flou: 40 });
    textes.length -= 2;   // le reflet du titre n'est pas un texte de plus
    ecrire(I.t(P.SOUS_TITRE), LW / 2, T.sous, { taille: T.sous0, police: F.titre, poids: 500, couleur: SABLE, espace: 0.32, capitales: true, max: LW - 140 });

    /* le panneau du récit */
    const px0 = haut ? 60 : 44, px1 = LW - px0, py0 = haut ? 482 : 304, py1 = haut ? 1500 : 896;
    c.save(); c.fillStyle = 'rgba(12,10,28,.86)'; c.strokeStyle = 'rgba(233,200,119,.42)'; c.lineWidth = 2; c.beginPath();
    if (c.roundRect) c.roundRect(px0, py0, px1 - px0, py1 - py0, 26); else c.rect(px0, py0, px1 - px0, py1 - py0); c.fill(); c.stroke(); c.restore();
    const fig = perso ? figure() : null, cote = !!fig && !haut;   // en carré, le personnage à côté du texte ; en vertical, au-dessus
    const colW = cote ? 300 : 0, tx0 = cote && !rtl ? px0 + colW : px0 + 36, tx1 = cote && rtl ? px1 - colW : px1 - 36, cx = (tx0 + tx1) / 2, mx = tx1 - tx0;
    const ombrePieds = (x, y, r) => { c.save(); c.fillStyle = 'rgba(0,0,0,.42)'; c.beginPath(); c.ellipse(x, y, r, r * 0.22, 0, 0, 6.3); c.fill(); c.restore(); };
    const poserFigure = (fx, fy, s) => { ombrePieds(fx + fig.width * s / 2, fy + fig.height * s - 6, fig.width * s * 0.34); c.save(); c.imageSmoothingEnabled = false; c.drawImage(fig, Math.round(fx), Math.round(fy), fig.width * s, fig.height * s); c.restore(); };
    if (cote) { const s = Math.max(1, Math.floor(300 / fig.height)), fx = (rtl ? px1 - colW : px0) + (colW - fig.width * s) / 2, fy = (py0 + py1) / 2 - fig.height * s / 2 - 10; poserFigure(fx, fy, s); }
    // la pile : chaque bloc a sa hauteur, et l'ensemble se centre dans le panneau
    const k = haut ? 1.22 : 1, sz = Math.round(Math.min(haut ? 150 : cote ? 104 : 128, (mx - 4 * 14) / 5)), blocs = [];
    if (fig && haut) { const s = Math.max(1, Math.floor(300 / fig.height)); blocs.push({ h: fig.height * s + 34, dessin: y => poserFigure(cx - fig.width * s / 2, y, s) }); }
    blocs.push({ h: Math.round(78 * k), dessin: y => ecrire(e.nom, cx, y + Math.round(60 * k), { taille: Math.round(62 * k), poids: 700, couleur: BLANC, max: mx }) });
    if (e.qualite) blocs.push({ h: Math.round(40 * k), dessin: y => ecrire(e.qualite, cx, y + Math.round(24 * k), { taille: Math.round(22 * k), police: F.titre, poids: 500, couleur: TERNE, espace: 0.2, capitales: true, max: mx }) });
    blocs.push({ h: Math.round(22 * k), dessin() {} });
    blocs.push({ h: sz + Math.round(sz * 0.72), dessin: y => {
      const n = e.maillons.length, gap = Math.min(sz * 0.34, (mx - n * sz) / Math.max(1, n - 1)), w = n * sz + (n - 1) * gap, x0 = cx - w / 2;
      e.maillons.forEach((m, i) => { const x = x0 + (rtl ? n - 1 - i : i) * (sz + gap), xm = x + sz / 2;
        c.save(); c.globalAlpha = m.fait ? 1 : 0.26; c.imageSmoothingEnabled = true; c.drawImage(G.seal(m.arabic, m.fait ? m.couleur : '#6a6380'), x, y, sz, sz); c.restore();
        ecrire(m.glyphe + '︎', xm, y + sz + Math.round(sz * 0.34), { taille: Math.round(sz * 0.27), police: SYMB, couleur: m.couleur, alpha: m.retrouvee ? 1 : 0.22, ombre: m.retrouvee ? m.couleur : null, flou: 12 });
        if (m.retrouvee) ecrire(m.lumiere, xm, y + sz + Math.round(sz * 0.62), { taille: Math.round(sz * 0.19), couleur: m.couleur, max: sz + gap - 6 }); });
    } });
    blocs.push({ h: Math.round(14 * k), dessin() {} });
    blocs.push({ h: Math.round(52 * k), dessin: y => ecrire(ligneMaillons(e), cx, y + Math.round(38 * k), { taille: Math.round(36 * k), poids: 700, couleur: OR, max: mx }) });
    blocs.push({ h: Math.round(42 * k), dessin: y => ecrire(ligneLumieres(e), cx, y + Math.round(31 * k), { taille: Math.round(28 * k), couleur: SABLE, max: mx }) });
    blocs.push({ h: Math.round(46 * k), dessin: y => ecrire(ligneFidelite(e), cx, y + Math.round(31 * k), { taille: Math.round(28 * k), couleur: SABLE, max: mx }) });
    const oEnCours = { taille: Math.round(26 * k), couleur: TERNE, lignes: 2, italique: true };
    blocs.push({ h: paragraphe(e.enCours, cx, 0, mx, oEnCours, true), dessin: y => paragraphe(e.enCours, cx, y, mx, oEnCours) });
    { const tot = blocs.reduce((s, b) => s + b.h, 0); let y = Math.round((py0 + py1) / 2 - tot / 2); blocs.forEach(b => { b.dessin(y); y += b.h; }); }

    // en vertical, sous la réserve : les cinq maillons de la Chaîne, en filigrane (ceux du fond d'écran de la Chaîne)
    if (haut) { c.save(); c.lineWidth = 2.4; for (let i = 0; i < 5; i++) { const x = LW / 2 + (i - 2) * 150, y = 1772 - Math.sin(i / 4 * Math.PI) * 26; c.strokeStyle = `rgba(233,200,119,${i === 2 ? 0.42 : 0.26})`; c.beginPath(); c.ellipse(x, y, 96, 40, i % 2 ? 0.35 : -0.35, 0, 6.3); c.stroke(); } c.restore(); }
    /* le pied : l'adresse, la réserve */
    const yA = haut ? 1574 : 958;
    ecrire(P.ADRESSE, LW / 2, yA, { taille: haut ? 46 : 38, police: LOGO, poids: 500, couleur: OR, espace: 0.08, latin: true, max: LW - 120 });
    paragraphe(I.t(P.RESERVE), LW / 2, yA + (haut ? 22 : 14), LW - (haut ? 160 : 140), { taille: haut ? 27 : 22, couleur: TERNE, lignes: 2, italique: true, interligne: 1.3 });
    return { cv, w: LW, h: LH, textes };
  };

  /* ---------- l'aperçu, et le partage ---------- */
  // les polices, chargées pour les textes mêmes que l'image porte (Google Fonts découpe chaque police par écriture) ; sans
  // elles, l'image se dessine dans les polices du système, au bout de deux secondes et demie au plus
  const charger = texte => {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const F = polices(), L = [['700 100px ' + LOGO, P.NOM], ['500 40px ' + LOGO, P.ADRESSE + texte], ['700 60px ' + ARABE, 'إسناد'], ['400 30px ' + F.corps, texte], ['700 30px ' + F.corps, texte], ['500 30px ' + F.titre, texte]];
    if (latin()) L.push(['italic 400 26px ' + F.corps, texte]);
    return Promise.race([Promise.all(L.map(([f, t]) => document.fonts.load(f, t).catch(() => {}))), new Promise(r => setTimeout(r, 2500))]);
  };
  // → { cv, url, blob, fichier, texte, textes, w, h }
  Pa.rendre = async function (format, perso) {
    const e = Pa.etat(), lignes = Pa.lignes(e);
    await charger(lignes.concat([e.nom, e.qualite], e.maillons.map(m => m.lumiere), [ligneMaillons(e), ligneLumieres(e), ligneFidelite(e)]).join(' '));
    const r = Pa.dessiner(format, perso, e); r.texte = lignes.join('\n'); r.url = r.cv.toDataURL('image/png');
    // le fichier, tiré de l'image déjà encodée (une seule fois, et sans attendre un rappel de toBlob)
    try { const b64 = atob(r.url.slice(r.url.indexOf(',') + 1)), oct = new Uint8Array(b64.length); for (let i = 0; i < b64.length; i++) oct[i] = b64.charCodeAt(i); r.blob = new Blob([oct], { type: 'image/png' }); } catch (x) { r.blob = null; }
    try { r.fichier = r.blob && typeof File === 'function' ? new File([r.blob], FICHIER, { type: 'image/png' }) : null; } catch (x) { r.fichier = null; }
    Pa.dernier = { format: FORMATS[format] ? format : 'carre', perso: !!perso, lang: I.langue.lang, w: r.w, h: r.h, textes: r.textes.slice(), texte: r.texte, url: r.url, taille: r.blob ? r.blob.size : 0 };
    return r;
  };
  // la page de la halte : ce qui partira, en toutes lettres
  Pa.pane = () => '<h3>' + I.t('Partager ma progression') + '</h3><p>' + I.t('L’image et le texte ne disent que l’avancée du récit : les maillons achevés, les Lumières retrouvées, la fidélité à la Chaîne, le chapitre en cours.') + '</p><p class="src">' + Pa.lignes().map(I.esc).join('<br>') + '</p>';
  // le choix du format et du personnage : un réglage de l'appareil, comme le son (opts), jamais dans la partie
  const reglages = () => { const o = I.save.data.opts.partage; return { format: o && FORMATS[o.format] ? o.format : 'carre', perso: !(o && o.perso === false) }; };
  const garder = r => { I.save.data.opts.partage = { format: r.format, perso: r.perso }; I.save.store(); };
  const tactile = () => document.body.classList.contains('touch');
  const dansUnArtifact = () => !!(window.claude && window.claude.hot);   // une page d'Artifact ne peut pas remettre un fichier (comme « Exporter la partie »)

  Pa.ouvrir = function (retour) {
    const sec = $('#partage'), box = sec.querySelector('.corps'), tete = sec.querySelector('header p'), o = reglages();
    let fl = null, rendu = null, tour = 0, ferme = false;
    const fermer = () => { ferme = true; if (fl) fl.destroy(); fl = null; U.screen('#partage', false); U.menuOpen = false; }, revenir = () => { fermer(); if (retour) retour(); };
    const bouton = (label, fn, cls) => { const b = I.el('button', cls || '', label); b.type = 'button'; U.tapable(b, () => fn(b)); return b; };
    const rangee = btns => { const r = I.el('div', 'rang'); btns.filter(Boolean).forEach(b => r.appendChild(b)); return r; };
    tete.textContent = I.t('L’image et le texte ne disent que l’avancée du récit : les maillons achevés, les Lumières retrouvées, la fidélité à la Chaîne, le chapitre en cours.');
    const apercu = I.el('div', 'apercu'), img = I.el('img'); img.alt = ''; img.draggable = true; apercu.appendChild(img);
    const ta = I.el('textarea'); ta.readOnly = true; ta.spellcheck = false; ta.rows = 6; ta.dir = I.langue.dir(); ta.setAttribute('aria-label', I.t('Le texte qui accompagne l’image'));
    const note = I.el('p', 'note', ''); note.setAttribute('role', 'status');
    const dire = (etat, m) => { note.className = 'note' + (etat === true ? ' ok' : etat === false ? ' ko' : ''); note.textContent = m; };
    const garde = () => tactile() ? I.t('L’image se garde d’un appui long.') : !dansUnArtifact() ? I.t('L’image se garde par « Enregistrer l’image », ou d’un clic droit.') : I.t('L’image se garde d’un clic droit.');
    // copier le texte : le presse-papiers ; sinon la vieille commande, le texte sélectionné ; sinon il reste sélectionné, à copier à la main
    const copierTexte = async () => {
      const t = rendu.texte;
      try { if (navigator.clipboard && navigator.clipboard.writeText) { await Promise.race([navigator.clipboard.writeText(t), new Promise((r, x) => setTimeout(() => x(new Error('délai')), 1500))]); return true; } } catch (e) { /* refusé : on essaie autrement */ }
      try { ta.focus(); ta.select(); if (document.execCommand && document.execCommand('copy')) return true; } catch (e) { /* indisponible */ }
      try { ta.focus(); ta.select(); } catch (e) { /* rien à sélectionner */ }
      return false;
    };
    // le repli : le texte copié, l'image en grand, à garder d'un appui long (ou enregistrée, hors d'un Artifact)
    const repli = async cause => {
      apercu.classList.add('grand'); const copie = await copierTexte(); if (ferme) return;
      dire(copie ? null : false, cause + ' ' + (copie ? I.t('Texte copié. Colle-le dans ton message.') : I.t('La copie n’a pas pu se faire : le texte est sélectionné, copie-le à la main.')) + ' ' + garde());
      try { apercu.scrollIntoView({ block: 'nearest' }); } catch (e) { /* sans défilement */ }
    };
    const partager = () => {
      if (!rendu) return; const f = rendu.fichier;
      let peut = false; try { peut = !!(f && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [f] })); } catch (e) { peut = false; }
      if (!peut) return repli(I.t('Ce navigateur ne sait pas partager une image.'));
      let pr; try { pr = navigator.share({ files: [f], title: P.NOM, text: rendu.texte }); } catch (e) { return repli(I.t('Le partage n’est pas permis ici.')); }
      Promise.resolve(pr).then(() => { if (!ferme) dire(true, I.t('Partage transmis à l’application choisie.')); },
        e => { if (ferme) return; if (e && e.name === 'AbortError') dire(null, I.t('Partage annulé.')); else repli(I.t('Le partage n’est pas permis ici.')); });
    };
    const copier = async () => { if (!rendu) return; const ok = await copierTexte(); if (!ferme) dire(ok, ok ? I.t('Texte copié. Colle-le dans ton message.') : I.t('La copie n’a pas pu se faire : le texte est sélectionné, copie-le à la main.')); };
    const enregistrer = () => {
      if (!rendu) return;
      try { const a = document.createElement('a'), u = rendu.blob ? URL.createObjectURL(rendu.blob) : rendu.url; a.href = u; a.download = FICHIER; document.body.appendChild(a); a.click(); a.remove(); if (rendu.blob) setTimeout(() => URL.revokeObjectURL(u), 5000);
        dire(true, I.t('Image « {fichier} » remise au navigateur.', { fichier: FICHIER })); } catch (e) { apercu.classList.add('grand'); dire(false, I.t('Ce navigateur ne laisse pas enregistrer l’image ici.') + ' ' + garde()); }
    };
    const nomFormat = () => (o.format === 'vertical' ? I.t('Format : vertical') : I.t('Format : carré'));
    const nomPerso = () => (o.perso ? I.t('Ton personnage : montré') : I.t('Ton personnage : caché'));
    const refaire = async () => {
      const n = ++tour; rendu = null; apercu.classList.remove('grand'); apercu.setAttribute('aria-busy', 'true'); dire(null, I.t('L’image se dessine…'));
      let r = null; try { r = await Pa.rendre(o.format, o.perso); } catch (e) { I.report(e, 'partage'); if (n === tour && !ferme) dire(false, I.t('L’image n’a pas pu se dessiner.')); return; }
      if (n !== tour || ferme) return;
      rendu = r; img.src = r.url; img.width = r.w; img.height = r.h; img.alt = r.texte.split('\n').join(sep()); ta.value = r.texte; apercu.setAttribute('aria-busy', 'false'); apercu.dataset.format = o.format; dire(null, '');
    };
    const bF = bouton(nomFormat(), () => { o.format = o.format === 'carre' ? 'vertical' : 'carre'; garder(o); bF.textContent = nomFormat(); refaire(); });
    const bQ = bouton(nomPerso(), () => { o.perso = !o.perso; garder(o); bQ.textContent = nomPerso(); refaire(); });
    const bP = bouton(I.t('Partager'), partager, 'fort'), bC = bouton(I.t('Copier le texte'), copier), bE = dansUnArtifact() ? null : bouton(I.t('Enregistrer l’image'), enregistrer), bR = bouton(I.t('◂ Retour'), revenir);
    box.innerHTML = ''; [apercu, rangee([bF, bQ]), rangee([bP, bC, bE, bR]), note, ta].forEach(x => box.appendChild(x));
    U.menuOpen = true; I.input.clearHeld(); U.screen('#partage', true); sec.scrollTop = 0;
    const btns = [bF, bQ, bP, bC, bE, bR].filter(Boolean);
    fl = U.focusList(btns, { onCancel: revenir, start: 2, survolBouge: true });
    return refaire();
  };
})();
