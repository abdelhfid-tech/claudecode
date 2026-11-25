#!/usr/bin/env node
/* ISNAD 2.x — le personnage du joueur : le nom du râwî, et son apparence de toujours.
   Usage : node tools/personnage.js
   2.37 (D231 ; le décideur, 25 novembre : « supprimer les options pour le garçon (couleurs, barbe, moustache, etc.) ; garde
   le modèle par défaut ») : le râwî n'a plus qu'une apparence, et l'on ne choisit plus que son nom. Ce contrôle prouve que
   le nom se choisit, se joue et se garde comme avant, et que plus rien d'autre ne se choisit, nulle part.
   1. Les noms : ceux qui passent, ceux qui sont refusés et pourquoi. Le nom dans les textes : chaque phrase du jeu qui
      nomme le râwî, redite avec six noms — plus un « Idris », et la bonne élision (« de Khalil », « d’Elyas »).
   2. Sans rien choisir, rien ne change : les phrases, le sceau et la silhouette sont ceux d'origine, à l'identique ; un
      autre nom change les phrases et le sceau, jamais la silhouette ; « Idris » rechoisi, tout revient.
   3. Le retrait : D.TENUES n'a qu'une entrée ; I.perso n'a plus aucune des fonctions de la composition ; le jeu assemblé ne
      porte plus une case de choix (ni classe, ni appel) ; choisir un nom en passant, comme avant, un ensemble et des pièces
      ne garde que le nom ; une partie d'avant (profil.tenue, profil.compo) s'applique sans refus — le nom gardé, la tenue et
      la silhouette de toujours, celles d'une partie neuve ; un profil abîmé (un nom qui n'en est pas un, une tenue inconnue,
      des pièces faussées, __proto__) ramène Idris, sans erreur ; un récit ou un paquet n'écrit ni teint ni trait. Et
      l'aperçu, dans les trois dessins : le râwî de toujours, de face, de profil, et tel que la carte le montre.
   4. Par les vrais boutons, en quatre tailles d'écran : « Nouvelle partie » ouvre « Ton personnage » sur Idris ; l'écran
      n'offre aucune option — le champ du nom, « Écrire », l'aperçu, « Commencer », rien d'autre ; l'aperçu se rapproche
      et s'éloigne d'un toucher ; un nom refusé bloque « Commencer » et dit pourquoi ; un nom choisi, le prologue se joue en
      entier — tout ce qui s'affiche est relevé : le nom choisi y paraît (dialogue, combat, Chaîne), « Idris » n'y paraît
      plus (les objectifs compris) ; le râwî de la carte est celui de toujours. Peu de mots, aucun texte sous 10,5 points,
      rien qui déborde ni hors de l'écran, « Commencer » à l'écran ; le champ du nom a son nom pour les lecteurs d'écran, et
      le clavier du téléphone n'y corrige pas un prénom ; en largeur, l'aperçu d'un côté sur toute la hauteur, le nom en
      haut et le bouton en bas de l'autre.
   5. Les téléphones courants, en largeur et en hauteur (640 × 360, 667 × 375, 568 × 320, 320 × 568) : à l'ouverture,
      devant le plus long des refus, et depuis la Chaîne (« Garder », « ◂ Retour ») — aucun mot coupé dans un bouton, rien
      hors de l'écran, rien qui défile, aucun bouton sous la taille d'un doigt.
   6. Depuis la Chaîne et depuis la halte : l'écran s'ouvre sur le nom choisi, sans aucune option ; « ◂ Retour » (et
      Échap) n'y change rien ; « Garder » avec un nouveau nom le garde (partie gardée, rechargée) ; la page de la halte
      montre le râwî et son nom ; au milieu d'un chapitre, le nom change et la silhouette reste ; exportée puis importée
      dans un autre navigateur, la partie garde le nom ; la même, rendue telle qu'une partie d'avant (un ensemble, huit
      pièces), se lit par les vrais boutons sans refus, le nom gardé, le râwî de toujours ; un profil abîmé ramène Idris.
   7. En arabe, en hauteur et en largeur : l'écran se retourne, rien ne déborde, le bouton reste à l'écran ; le râwî y
      porte le nom que la langue lui donne, et « ابدأ » le garde comme le nom d'origine.
   8. Au clavier : une souris immobile ne prend pas la main, « Commencer » est choisi d'emblée ; les flèches vont à
      l'aperçu et à « Écrire » ; Entrée rapproche l'aperçu, donne la main au champ, puis commence.
   Sortie : « OK » par preuve ; « ÉCART », « BLOQUÉ », « ABSENT », « INVISIBLE », « DÉBORDE » ou « REFUS » sinon, et toutes
   les anomalies sont dites. Les captures sont dans .smoke/personnage/ (celles d'une passe d'avant y sont effacées).
   Code 1 dès la première anomalie, ou si le contrôle s'interrompt. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/personnage'), jeu = path.resolve(V2, process.env.JEU || 'index.html'), url = 'file://' + jeu;   // JEU=… : le même contrôle sur un autre assemblage
fs.mkdirSync(out, { recursive: true });
fs.readdirSync(out).filter(f => /\.png$/.test(f)).forEach(f => fs.unlinkSync(path.join(out, f)));   // les captures d'avant (les ensembles, les onglets) ne restent pas à côté de celles de cette passe
let anomalies = 0, preuves = 0; const ok = m => { preuves++; console.log('OK  ' + m); }, ko = m => { anomalies++; console.log(m); };

/* ---------- ce que la 2.37 a retiré ---------- */
// les classes des cases, des onglets, des ensembles, du dé et de ↺ (« pv-… », dans ui.js et style.css jusqu'à la 2.36) ;
// ce que perso.js offrait pour composer le râwî ; les ensembles que l'on pouvait prendre
const CASES = ['c', 'col', 'de', 'ens', 'fig44', 'grande', 'groupe', 'objet', 'onglet', 'onglets', 'panneau', 'pastille', 'rangee', 'rond', 'sep', 'tete', 'vig', 'zero'];
const DISPARUES = ['compo', 'base', 'va', 'neutraliser', 'permis', 'composer', 'hasard', 'dore', 'VISAGE', 'HABIT', 'CLES'];
const ENSEMBLES = ['encre', 'ruelle', 'copiste', 'veilleur', 'lettre'];
// une partie d'avant : un ensemble et huit pièces dans le profil (les identifiants de D.RAWI, tels que la 2.36 les gardait)
const AVANT = { tenue: 'encre', compo: { teint: 't6', barbe: 2, poil: 'p3', coiffe: 'litham', longue: true, etoffe: 'e7', neon: 'n4', objet: 'lanterne' } };
// ce qui se touche sur l'écran, dans l'ordre : au début d'une partie ; depuis la Chaîne et la halte
const DEBUT = ['nom', 'ecrire', 'voir', 'ok'], SUITE = DEBUT.concat('retour');

/* ---------- dans la page : l'état de l'écran « Ton personnage » ---------- */
const ETAT = CASES => { const s = document.querySelector('#perso'), sr = s.getBoundingClientRect(), bas = Math.min(innerHeight, sr.bottom), droite = Math.min(innerWidth, sr.right);
  // à l'écran : dans la fenêtre et dans l'écran lui-même (en hauteur, sur un téléphone, il s'arrête au-dessus de la manette)
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 3 && r.height > 3 && r.top >= Math.max(0, sr.top) - 1 && r.bottom <= bas + 1 && r.left >= Math.max(0, sr.left) - 1 && r.right <= droite + 1; };
  const montres = q => [...s.querySelectorAll(q)].filter(e => e.offsetParent), champ = s.querySelector('input'), ok = s.querySelector('.ok'), voir = s.querySelector('.pv-voir'), figs = [...s.querySelectorAll('.pv-fig img')], carte = s.querySelector('.pv-carte'), note = s.querySelector('.pv-note'), ecrire = s.querySelector('.pv-nom button');
  const genre = e => !e ? '' : e === champ && e.id === 'perso-nom' ? 'nom' : e === voir ? 'voir' : e === ok ? 'ok' : e === ecrire ? 'ecrire' : e.tagName === 'BUTTON' && e.closest('.pv-bas') ? 'retour' : (e.tagName + '.' + e.className).toLowerCase();
  const textes = montres('h2, button, input, .pv-note').filter(e => (e.textContent || e.value || '').trim() && getComputedStyle(e).display !== 'none').map(e => parseFloat(getComputedStyle(e).fontSize));
  const mots = (s.innerText || '').split(/\s+/).filter(x => /\p{L}/u.test(x)), image = im => !!im && im.complete && im.naturalWidth > 0;
  const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); }, sur = (a, b) => { const p = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return p.left < q.right - 1 && q.left < p.right - 1 && p.top < q.bottom - 1 && q.top < p.bottom - 1; };
  const doigt = montres('button, input').filter(e => e !== voir);   // ce que le doigt doit trouver : le champ et les boutons (l'aperçu, lui, est grand)
  // ce qui servirait à choisir autre chose que le nom : une case d'avant la 2.37 (où qu'elle soit dans la page), un rôle de
  // case, d'onglet ou de liste, un second champ
  const options = CASES.map(c => '.pv-' + c).concat(['[role=radio]', '[role=tab]', '[role=radiogroup]', '[role=tablist]', '[role=checkbox]', '[role=option]', '[role=listbox]', '[aria-checked]', '[aria-selected]', 'select', 'textarea', 'input:not(#perso-nom)'])
    .map(q => [q, (/^\.pv-/.test(q) ? document : s).querySelectorAll(q).length]).filter(x => x[1]).map(x => x[0] + ' × ' + x[1]);
  return { ouvert: !s.hidden, nom: champ && champ.value, ok: ok && ok.textContent, okVisible: vis(ok), okBloque: !!ok && ok.disabled, champVisible: vis(champ), retour: montres('.pv-bas button').some(b => /Retour/.test(b.textContent)),
    options, commandes: montres('button, input, select, textarea, a[href], [role], [tabindex], [contenteditable]').map(genre),
    proche: !!s.querySelector('.pv.proche'), presse: voir ? voir.getAttribute('aria-pressed') : null, voirDit: voir ? voir.getAttribute('aria-label') || '' : '',
    figures: figs.map(im => image(im) && vis(im.parentNode)), figHaut: figs.length ? Math.round(figs[0].parentNode.getBoundingClientRect().height) : 0, carte: image(carte) && vis(carte), face: figs[0] ? figs[0].src : '', profil: figs[1] ? figs[1].src : '',
    defile: s.scrollHeight > s.clientHeight + 1, large: s.scrollWidth > s.clientWidth + 1,
    // un bouton dont le mot déborde (tassé par la mise en page) : « Commencer », « Garder », « ◂ Retour », « Écrire »
    coupes: montres('button').filter(b => b.textContent.trim() && b.scrollWidth > b.clientWidth + 1).map(b => b.textContent.trim() + ' ' + b.scrollWidth + '/' + b.clientWidth),
    horsEcran: montres('button, input').filter(b => !vis(b)).map(b => (b.getAttribute('aria-label') || b.textContent || b.className).trim().slice(0, 24)),
    petitBouton: doigt.length ? Math.min(...doigt.map(c => { const r = c.getBoundingClientRect(); return Math.min(r.width, r.height); })) : 0,
    // le champ du nom : son nom pour les lecteurs d'écran, et un clavier de téléphone qui ne corrige pas un prénom
    champ: champ ? { id: champ.id, dit: champ.getAttribute('aria-label') || '', orthographe: champ.spellcheck, majuscules: champ.autocapitalize, touche: champ.enterKeyHint, actif: document.activeElement === champ, choisi: champ.selectionEnd - champ.selectionStart } : null,
    // la raison d'un refus : à l'écran, et sur rien de ce qui se touche
    note: note ? note.textContent : '', noteVisible: vis(note), noteGene: note && note.textContent ? doigt.filter(b => sur(note, b)).map(genre) : [],
    petitTexte: textes.length ? Math.min(...textes) : 99, mots: mots.length, texte: mots.join(' '), sel: genre(s.querySelector('button.sel')),
    // la place de chaque chose : [gauche, haut, droite, bas]
    portrait: document.body.classList.contains('portrait'), rtl: document.documentElement.dir === 'rtl',
    place: { champ: R(champ), ecrire: R(ecrire), face: R(figs[0] && figs[0].parentNode), profil: R(figs[1] && figs[1].parentNode), carte: R(carte), pv: R(s.querySelector('.pv')), saisie: R(s.querySelector('.pv-saisie')), bas: R(s.querySelector('.pv-bas')), ok: R(ok) } }; };
// l'aperçu est-il le râwî de toujours ? Ses trois images, comparées à celles que le moteur fait de D.TENUES[0] — de face, de
// profil (de droite à gauche : l'autre profil), et tel que la carte le montre — ; et le nombre de leurs points pleins
const APERCU = () => { const I = window.ISNAD, G = I.gfx, L = Object.assign({ kind: 'compagnon' }, I.D.TENUES[0].look), rtl = document.documentElement.dir === 'rtl', s = document.querySelector('#perso'), f = [...s.querySelectorAll('.pv-fig img')], c = s.querySelector('.pv-carte');
  const points = im => { if (!im || !im.naturalWidth) return 0; const cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight; const x = cv.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 200) n++; return n; };
  return { face: !!f[0] && f[0].src === G.figure(L, 0, 0).toDataURL(), profil: !!f[1] && f[1].src === G.figure(L, rtl ? 2 : 1, 0).toDataURL(), carte: !!c && c.src === (G.D < 2 ? G.charPose(L, 0) : G.charGrand(L, 0)).toDataURL(), points: [f[0], f[1], c].map(points), D: G.D, lisse: !!G.lisse }; };

/* ---------- ce que l'écran doit tenir, à toute taille ---------- */
// rien hors de l'écran, rien qui déborde ni qui défile, aucun mot coupé, aucun texte trop petit, les boutons à la taille d'un
// doigt, l'aperçu entier → [[mot d'alerte, ce qui ne va pas]]
const miseEnPage = (e, o) => { const F = []; o = o || {};
  if (!e.okVisible) F.push(['INVISIBLE', `« ${e.ok} » n'est pas à l'écran sans défiler`]); if (!e.champVisible) F.push(['INVISIBLE', 'le champ du nom n’est pas à l’écran sans défiler']);
  if (e.large) F.push(['DÉBORDE', 'l’écran déborde en largeur']); if (e.defile) F.push(['DÉBORDE', 'l’écran déborde en hauteur : il défile']);
  if (e.horsEcran.length) F.push(['DÉBORDE', `hors de l'écran : ${e.horsEcran.join(' · ')}`]); if (e.coupes.length) F.push(['DÉBORDE', `un bouton est tassé, son mot déborde (${e.coupes.join(' · ')})`]);
  if (e.note && !e.noteVisible) F.push(['DÉBORDE', 'la raison du refus est hors de l’écran']); else if (e.noteGene.length) F.push(['DÉBORDE', `la raison du refus recouvre ce qui se touche (${e.noteGene.join(', ')})`]);
  if (o.tactile && e.petitTexte < 10.5) F.push(['ÉCART', `un texte de ${e.petitTexte} points sur un écran tactile`]);
  if (o.min && e.petitBouton < o.min) F.push(['ÉCART', `un bouton de ${Math.round(e.petitBouton)} points, sous la taille d'un doigt`]);
  if (e.figures.length !== 2 || !e.figures.every(Boolean) || !e.carte) F.push(['ABSENT', `l'aperçu n'est pas entier à l'écran (de face, de profil : ${e.figures.map(x => x ? 'oui' : 'non').join(', ') || 'aucune image'} ; la carte : ${e.carte ? 'oui' : 'non'})`]);
  else if (e.figHaut < 96) F.push(['DÉBORDE', `l'aperçu est écrasé : la figure ne fait plus que ${e.figHaut} points de haut`]);
  return F; };
// la place de chaque chose. En hauteur : le nom, l'aperçu, le bouton, de haut en bas. En largeur (2.37) : l'aperçu d'un
// côté, sur toute la hauteur ; de l'autre, le nom en haut et le bouton en bas. De droite à gauche, tout se retourne.
const place = e => { const P = e.place, F = [], cx = r => (r[0] + r[2]) / 2, avant = (a, b) => !!a && !!b && (e.rtl ? cx(a) > cx(b) : cx(a) < cx(b));
  if (!avant(P.champ, P.ecrire)) F.push('« Écrire » ne suit pas le champ du nom'); if (!avant(P.face, P.profil)) F.push('le profil ne suit pas la face'); if (!avant(P.pv, P.carte)) F.push('le râwî de la carte n’est pas au bout de l’aperçu');
  if (!P.saisie || !P.pv || !P.bas || !P.ok) F.push('le nom, l’aperçu ou le bouton manque');
  else if (e.portrait) { if (!(P.saisie[3] <= P.pv[1] + 1 && P.pv[3] <= P.bas[1] + 1)) F.push('en hauteur, le nom, l’aperçu et le bouton ne se suivent pas de haut en bas'); }
  else { if (!avant(P.pv, P.saisie) || !avant(P.pv, P.ok)) F.push('en largeur, l’aperçu n’est pas du premier côté'); if (!(P.saisie[3] <= P.ok[1] + 1)) F.push('en largeur, le nom n’est pas au-dessus du bouton');
    if (!(P.pv[1] <= P.saisie[1] + 1 && P.pv[3] >= P.ok[3] - 1)) F.push('en largeur, l’aperçu ne prend pas toute la hauteur'); }
  return F.map(m => ['ÉCART', m]); };

(async () => {
  const browser = await chromium.launch(); let errors = [];
  const ouvrir = async (vp, q) => { const ctx = await browser.newContext({ viewport: vp || { width: 960, height: 540 }, hasTouch: !!vp && vp.width < 900 }); const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url + (q || '')); await page.waitForTimeout(1700); return page; };
  const sansErreur = quoi => { if (errors.length) { ko(`ÉCART erreur console (${quoi}) : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`); errors = []; } };
  const bouton = (page, dans, texte) => page.locator(`${dans} button`, { hasText: texte }).first();
  const etat = p => p.evaluate(ETAT, CASES), dire = (quoi, F) => F.forEach(([mot, m]) => ko(`${mot} ${quoi} : ${m}`));
  const sansOption = (e, attendu) => !e.options.length && JSON.stringify(e.commandes) === JSON.stringify(attendu), offre = e => `${e.options.join(', ') || 'aucune case d’avant'} ; ce qui s'y touche : ${e.commandes.join(', ')}`;
  const toujours = a => !!a && a.face && a.profil && a.carte && a.points.every(n => n >= 100);

  /* ---------- 1. les noms ---------- */
  let page = await ouvrir();
  const PASSENT = ['Idris', 'Khalil', 'Elyas', '’Imrân', 'Hamza', 'Abd al-Karîm', '’Abd Allah', 'Zayd', 'Nûr ad-Dîn', 'Yacine', 'Jean-Luc', 'Sélim', 'إلياس', 'Ibrâhîm', 'Mûsâ',
    'خليل', 'عبد الله', 'عبدالله', 'عبد الكريم', 'عمرو', 'جان لوك', 'نور الدين'];   // (2.44, D235) en écriture arabe : le Nom porté avec « عبد » passe, « جان » est un prénom
  const REFUSES = [['', 'faut un nom'], ['   ', 'faut un nom'], ['Abdelkader ben Ali', 'Seize'], ['Khalil2', 'lettres'], ['<b>x</b>', 'lettres'], ['Idris*', 'lettres'], ['K@lil', 'lettres'], ['-Khalil', 'lettres'],
    ['Allah', 'qu’à Allah'], ['allâh', 'qu’à Allah'], ['Ar-Rahmân', 'qu’à Allah'], ['Dieu', 'qu’à Allah'], ['Iblîs', 'ne se porte pas'], ['Le Djinn', 'ne se porte pas'], ['Shaytân', 'ne se porte pas'],
    ['Muhammad', 'Prophète'], ['Mohamed', 'Prophète'], ['’Umar', 'personnage du jeu'], ['Umar', 'personnage du jeu'], ['Khâlid', 'personnage du jeu'], ['Abû Bakr', 'personnage du jeu'], ['ali', 'personnage du jeu'], ['’Uthmân', 'personnage du jeu'], ['Abd ar-Rahmân', 'personnage du jeu'],
    // (2.44, D235) les mêmes refus en écriture arabe, avec ou sans voyelles, la ligature comprise
    ['الله', 'qu’à Allah'], ['اللّٰه', 'qu’à Allah'], ['ﷲ', 'qu’à Allah'], ['الرحمن', 'qu’à Allah'], ['الرب', 'qu’à Allah'], ['إبليس', 'ne se porte pas'], ['الشيطان', 'ne se porte pas'], ['الجنّ', 'ne se porte pas'],
    ['محمد', 'Prophète'], ['مُحَمَّد', 'Prophète'], ['أبو بكر', 'personnage du jeu'], ['ابو بكر', 'personnage du jeu'], ['عمر', 'personnage du jeu'], ['عُمَر', 'personnage du jeu'], ['خالد', 'personnage du jeu'], ['عثمان', 'personnage du jeu'], ['علي', 'personnage du jeu'], ['عبد الرحمن', 'personnage du jeu']];
  const noms = await page.evaluate(([P, R]) => { const X = window.ISNAD.perso; return { passent: P.map(n => [n, X.refus(n)]), refuses: R.map(([n, r]) => [n, r, X.refus(n)]), pris: Object.keys(X.prisParLeJeu()).length }; }, [PASSENT, REFUSES]);
  const mauvais = noms.passent.filter(x => x[1]).map(x => `« ${x[0]} » refusé (${x[1]})`).concat(noms.refuses.filter(x => !x[2]).map(x => `« ${x[0]} » accepté`), noms.refuses.filter(x => x[2] && !x[2].includes(x[1])).map(x => `« ${x[0]} » refusé sans la bonne raison (${x[2]})`));
  if (mauvais.length) mauvais.forEach(m => ko('ÉCART nom : ' + m)); else ok(`${PASSENT.length} noms acceptés (${PASSENT.slice(1, 8).join(', ')}…) ; ${REFUSES.length} refusés, chacun pour sa raison : vide, trop long, autre chose que des lettres, le Nom divin seul, un nom interdit, le nom du Prophète ﷺ, un des ${noms.pris} noms que le jeu porte déjà`);
  // le plus long des refus (section 5 : c'est lui que l'écran doit tenir)
  const LONG = noms.refuses.filter(x => x[2]).sort((a, b) => b[2].length - a[2].length)[0] || ['Khalil2', '', ''];
  // le nom dans les textes : chaque phrase relevée, redite avec six noms
  const dit = await page.evaluate(() => { const X = window.ISNAD.perso, ph = X.phrases(), N = [['Khalil', false], ['Elyas', true], ['Hamza', false], ['’Imrân', false], ['Yacine', false], ['Abd ar-Rahmân', true]], faux = [];
    N.forEach(([n, elide]) => ph.forEach(t => { const d = X.dire(t, n);
      if (/(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(d)) faux.push(n + ' : il reste « Idris » — ' + d.slice(0, 80));
      if (!d.includes(n)) faux.push(n + ' : le nom manque — ' + d.slice(0, 80));
      if (/[dD][’']Idris|[qQ]u[’']Idris/.test(t)) { const attendu = elide ? /(?:d|qu)’/ : /(?:de|que) /, i = d.indexOf(n), avant = d.slice(Math.max(0, i - 4), i); if (!attendu.test(avant)) faux.push(n + ' : élision — …' + d.slice(Math.max(0, i - 16), i + n.length + 6) + '…'); } }));
    const ex = ph.filter(t => /[dD][’']Idris|[qQ]u[’']Idris/.test(t)).slice(0, 3).map(t => { const i = t.search(/[dDqQ]u?[’']Idris/); return [t.slice(Math.max(0, i - 22), i + 12), X.dire(t, 'Khalil').slice(Math.max(0, i - 22), i + 15), X.dire(t, 'Elyas').slice(Math.max(0, i - 22), i + 13)]; });
    return { n: ph.length, elisions: ph.filter(t => /[dD][’']Idris|[qQ]u[’']Idris/.test(t)).length, faux, ex }; });
  if (dit.n < 25 || dit.elisions < 3) ko(`ÉCART seulement ${dit.n} phrases relevées dans le jeu, dont ${dit.elisions} avec une élision : il en manque`);
  if (dit.faux.length) dit.faux.slice(0, 8).forEach(f => ko('ÉCART ' + f)); else ok(`${dit.n} phrases du jeu nomment le râwî, dont ${dit.elisions} avec une élision ; redites avec six noms : plus un « Idris », et l'élision juste — ${dit.ex.map(e => `« …${e[0].trim()}… » → « …${e[1].trim()}… » / « …${e[2].trim()}… »`).slice(0, 2).join(' ; ')}`);

  /* ---------- 2. sans rien choisir, rien ne change ---------- */
  const neutre = await page.evaluate(() => { const I = window.ISNAD, X = I.perso, h = I.sagas.idris.heroes.idris, avant = JSON.stringify(I.sagas), look0 = h.look;
    I.save.reset(); const a = JSON.stringify(I.sagas) === avant && h.look === look0;
    // un autre nom : les phrases et le sceau changent, la silhouette reste — le même objet
    X.choisir('Khalil'); const change = h.name === 'Khalil' && h.arabic === '' && I.sagas.idris.name === 'Khalil' && JSON.stringify(I.sagas) !== avant, silhouette = h.look === look0;
    X.choisir('Idris'); const b = JSON.stringify(I.sagas) === avant && h.look === look0 && h.arabic === 'إدريس';
    I.save.reset(); X.appliquer(); return { a, change, silhouette, b, tenue0: JSON.stringify(I.D.TENUES[0].look) === JSON.stringify(look0) }; });
  if (!neutre.a || !neutre.b || !neutre.tenue0) ko(`ÉCART le profil d'origine ne laisse pas le jeu intact : ${JSON.stringify(neutre)}`); else if (!neutre.change) ko('ÉCART choisir un nom ne change ni les phrases ni le sceau du râwî');
  else if (!neutre.silhouette) ko('ÉCART choisir un nom change la silhouette du râwî : ce n’est plus l’objet d’origine');
  else ok('sans rien choisir, rien ne change : phrases, sceau et silhouette d’origine, à l’identique ; un autre nom change les phrases et le sceau, jamais la silhouette (le même objet) ; « Idris » rechoisi, tout revient');

  /* ---------- 3. le retrait (2.37, D231) : une seule apparence, et plus rien pour en composer une autre ---------- */
  const retrait = await page.evaluate(([DISPARUES, ENSEMBLES, AVANT]) => { const I = window.ISNAD, X = I.perso, D = I.D, J = JSON.stringify, h = I.sagas.idris.heroes.idris, E = [];
    I.save.reset(); X.appliquer(); const neuf = J(h.look), objet = h.look, sagas0 = J(I.sagas), t0 = D.TENUES[0], PROFIL = n => J({ nom: n, tenue: t0.id });
    // chaque preuve à part : une erreur du jeu dans l'une est une anomalie, et laisse passer les suivantes
    const essai = (quoi, f) => { try { f(); } catch (e) { E.push(quoi + ' — erreur : ' + String((e && e.message) || e)); } };
    const pose = p => { let jet = ''; I.save.reset(); I.save.data.profil = p; try { X.appliquer(); } catch (e) { jet = 'erreur : ' + String((e && e.message) || e); } return jet; };
    if (!Array.isArray(D.TENUES) || D.TENUES.length !== 1) E.push(`D.TENUES a ${(D.TENUES || []).length} entrées (${(D.TENUES || []).map(t => t.id).join(', ')}) : il n'en faut qu'une`);
    const restent = DISPARUES.filter(k => k in X); if (restent.length) E.push('I.perso offre encore de quoi composer : ' + restent.join(', '));
    // ce qui reste : le profil (le nom, la tenue de toujours), la tenue, l'apparence — une copie, quoi qu'on lui passe
    essai('P.profil(), P.tenue()', () => { if (J(X.profil()) !== PROFIL('Idris') || X.tenue() !== t0 || X.tenue({ id: 'encre' }) !== t0) E.push('P.profil() ou P.tenue() ne rendent pas le nom et la tenue de toujours : ' + J(X.profil())); });
    essai('P.look()', () => { const copie = X.look(), autre = X.look({ id: 'encre', look: { kind: 'cyber', robe: '#ffffff' } }); copie.robe = '#ffffff';
      if (J(autre) !== J(t0.look) || copie === t0.look || t0.look.robe === '#ffffff' || J(X.look()) !== neuf || neuf !== J(t0.look)) E.push('P.look() ne rend pas une copie de l’apparence de toujours : ' + J(autre)); });
    // choisir un nom en passant, comme avant, un ensemble et des pièces : le nom seul est gardé
    essai('P.choisir', () => { const refus = X.choisir('  Khalil ', 'encre', { teint: 't6' });
      if (refus || J(I.save.data.profil) !== PROFIL('Khalil') || h.name !== 'Khalil' || h.look !== objet || J(h.look) !== neuf) E.push(`P.choisir('Khalil', 'encre', { teint: 't6' }) garde autre chose que le nom : ${refus || J(I.save.data.profil)} · ${J(h.look)}`); });
    // une partie d'avant : un ensemble et des pièces dans le profil, posés à la main — sous chacun des cinq ensembles retirés
    ENSEMBLES.forEach(id => { const jet = pose({ nom: 'Khalil', tenue: id, compo: JSON.parse(J(AVANT.compo)) });
      essai('une partie d’avant (' + id + ')', () => { if (jet || J(X.profil()) !== PROFIL('Khalil') || X.nom() !== 'Khalil' || h.name !== 'Khalil' || h.arabic !== '' || X.tenue() !== t0 || h.look !== objet || J(h.look) !== neuf) E.push(`une partie d'avant (${id}, ${Object.keys(AVANT.compo).length} pièces) ne rend pas Khalil sous l'apparence de toujours : ${jet || J(X.profil())} · ${J(h.look)}`); }); });
    // des pièces seules abîmées : le nom reste
    { const jet = pose(JSON.parse('{"nom":"Khalil","tenue":"inconnue","compo":{"teint":"x9","barbe":[1],"poil":{"a":1},"longue":"oui","objet":"durra"}}'));
      essai('des pièces abîmées', () => { if (jet || J(X.profil()) !== PROFIL('Khalil') || h.look !== objet) E.push(`des pièces abîmées font perdre le nom, ou la silhouette : ${jet || J(X.profil())}`); }); }
    // un profil abîmé : le râwî redevient Idris, et le jeu entier revient à l'identique
    const ABIMES = ['{"nom":"<img src=x onerror=alert(1)>","tenue":"inconnue","compo":{"teint":"<script>","barbe":7,"poil":["p1"],"coiffe":"keffieh","manteau":"cape","longue":"oui","etoffe":"__proto__","neon":"constructor","objet":"durra","__proto__":{"teint":"t1"}}}',
      '{"nom":["Khalil"],"tenue":7,"compo":"t1"}', '{"nom":{"toString":"Khalil"},"tenue":null,"compo":[1,2]}', '{"nom":"","tenue":"encre"}', '{"nom":"Allah","tenue":"encre","compo":{"teint":"t6"}}', '{"nom":"Khalil2"}', '{"nom":42}',
      '{"__proto__":{"nom":"Khalil","tenue":"encre"},"compo":null}', '{"compo":{"__proto__":{"nom":"Khalil"}},"tenue":{"id":"encre"}}', '"Khalil"', '[{"nom":"Khalil"}]', 'null'];
    ABIMES.forEach(t => { const jet = pose(JSON.parse(t));
      essai('un profil abîmé', () => { if (jet || J(X.profil()) !== PROFIL('Idris') || h.name !== 'Idris' || h.arabic !== 'إدريس' || h.look !== objet || J(I.sagas) !== sagas0) E.push(`un profil abîmé ne ramène pas Idris — ${t.slice(0, 60)} : ${jet || J(X.profil())}`); }); });
    if (({}).nom !== undefined || ({}).teint !== undefined || ({}).compo !== undefined || ({}).tenue !== undefined) E.push('un profil abîmé a touché tous les objets du jeu (__proto__)');
    essai('le retour à une partie neuve', () => { I.save.reset(); X.appliquer(); });
    return { E, tenue: t0.id, pieces: Object.keys(AVANT.compo).length, abimes: ABIMES.length }; }, [DISPARUES, ENSEMBLES, AVANT]);
  const TENUE = retrait.tenue, PROFIL = n => JSON.stringify({ nom: n, tenue: TENUE });
  if (retrait.E.length) retrait.E.forEach(e => ko('ÉCART ' + e));
  else ok(`le retrait (2.37, D231) : D.TENUES n'a qu'une entrée (« ${TENUE} ») ; I.perso n'offre plus ${DISPARUES.join(', ')} ; P.profil() rend le nom et la tenue de toujours, P.look() une copie de son apparence, quoi qu'on leur passe ; P.choisir('Khalil', 'encre', { teint: 't6' }) ne garde que le nom ; une partie d'avant — chacun des ${ENSEMBLES.length} ensembles retirés, ${retrait.pieces} pièces — s'applique sans erreur : Khalil, la tenue et la silhouette de toujours, celles d'une partie neuve (le même objet) ; des pièces abîmées laissent le nom ; ${retrait.abimes} profils abîmés (une balise, un type faux, un nom refusé, une tenue inconnue, __proto__) ramènent Idris, le jeu entier à l'identique`);
  // le jeu assemblé ne porte plus une case de choix : ni leurs classes (la page, les styles, le moteur), ni un appel à ce que
  // perso.js a perdu — un appel resté dans un recoin que ce contrôle ne joue pas y ferait une erreur. Un appel s'écrit
  // « P.… » (perso.js et ui.js nomment ainsi I.perso) ou « perso.… » ; les noms que rien d'autre ne porte dans le jeu
  // (SEULS) se cherchent après n'importe quel nom
  { const source = fs.readFileSync(jeu, 'utf8'), classes = [...new Set(source.match(/\bpv-[a-z0-9-]+/g) || [])], restes = classes.filter(c => CASES.includes(c.slice(3))), SEULS = ['neutraliser', 'composer', 'permis', 'dore', 'VISAGE', 'HABIT'];
    const appels = DISPARUES.filter(k => new RegExp((SEULS.includes(k) ? '\\.' : '\\b(?:P|perso)\\.') + k + '\\b').test(source));
    if (!classes.length) ko(`ABSENT ${path.basename(jeu)} ne porte aucune classe « pv-… » : l'écran « Ton personnage » n'y est pas`);
    else if (restes.length || appels.length) ko(`ÉCART le jeu assemblé porte encore ${restes.length ? 'les classes ' + restes.join(', ') : ''}${restes.length && appels.length ? ' et ' : ''}${appels.length ? 'des appels à ce que perso.js a perdu (' + appels.join(', ') + ')' : ''}`);
    else ok(`le jeu assemblé (${path.basename(jeu)}) ne porte plus une case de choix : des ${CASES.length} classes des cases, des onglets, des ensembles, du dé et de ↺, aucune ne reste (il reste ${classes.sort().join(', ')}), et il n'écrit plus un appel à ce que perso.js a perdu (P.composer, P.neutraliser, P.hasard…)`); }
  // un récit ou un paquet n'écrit ni teint ni trait : les règles le refusent toujours (regles.js : ces champs restent ceux du moteur)
  { const D = require('../src/core/defs.js'), RG = require('../src/core/regles.js'), base = [];
    for (const f of fs.readdirSync(path.join(V2, 'src/data')).filter(f => /\.js$/.test(f)).sort()) { const ctx = { ISNAD: { registerSaga: s => base.push(s), registerMusic() {} }, console }; ctx.window = ctx; ctx.globalThis = ctx; vm.runInNewContext(fs.readFileSync(path.join(V2, 'src/data', f), 'utf8'), ctx, { filename: f }); }
    const P0 = JSON.parse(JSON.stringify(require('./essais/paquet_essai.js'))), net = RG.verifierPaquet(D, JSON.parse(JSON.stringify(P0)), { sagas: base }).erreurs, refus = [];
    ['teint', 'barbe', 'poil', 'visage', 'neon', 'porte'].forEach(k => { const P = JSON.parse(JSON.stringify(P0)), s = P.sagas[0], h = s.heroes[Object.keys(s.heroes)[0]]; h.look = Object.assign({}, h.look, { [k]: k === 'barbe' || k === 'visage' ? 1 : k === 'neon' ? ['#ffffff', '#000000'] : k === 'porte' ? ['feuillets'] : '#7e5034' });
      const e = RG.verifierPaquet(D, P, { sagas: base }).erreurs; if (!e.some(x => x.includes('réservé au râwî'))) refus.push(k); });
    if (net.length) ko(`ÉCART le paquet d’essai ne passe plus les règles : ${net[0]}`); else if (refus.length) ko(`REFUS manquant : un paquet qui écrit ${refus.join(', ')} sur un personnage passe les règles`);
    else ok('un paquet qui écrit un teint, une barbe, un poil, une marque de visage, un néon ou un objet porté sur un personnage est toujours refusé (« réservé au râwî ») : ces champs restent au moteur'); }
  sansErreur('sur les noms, le retrait et les règles'); await page.close();
  // l'aperçu, dans les trois dessins : le râwî de toujours — de face, de profil, et tel que la carte le montre
  { const faces = {};
    for (const [nomD, q, fichier] of [['fin', '?def=2', 'fin'], ['fin et adouci', '?def=2l', 'adouci'], ['d’origine', '?def=1', 'origine']]) {
      const p = await ouvrir(null, q); await bouton(p, '#title .vmenu', 'Nouvelle partie').click(); await p.waitForTimeout(700);
      const e = await etat(p), a = e.ouvert ? await p.evaluate(APERCU) : null; await p.screenshot({ path: path.join(out, 'dessin-' + fichier + '.png') }); faces[fichier] = e.face;
      if (!e.ouvert) ko(`BLOQUÉ dessin ${nomD} : « Nouvelle partie » n'ouvre pas « Ton personnage »`);
      else if (miseEnPage(e).length || !sansOption(e, DEBUT)) { dire('dessin ' + nomD, miseEnPage(e)); if (!sansOption(e, DEBUT)) ko(`ÉCART dessin ${nomD} : l'écran offre autre chose que le nom — ${offre(e)}`); }
      else if (!toujours(a)) ko(`ÉCART dessin ${nomD} : l'aperçu ne montre pas le râwî de toujours : ${JSON.stringify(a)}`);
      else ok(`dessin ${nomD} : l'aperçu montre le râwî de toujours — de face et de profil (${a.points[0]} et ${a.points[1]} points pleins), et tel que la carte le montre (${a.points[2]}) —, sans aucune option`);
      sansErreur('l’aperçu, dessin ' + nomD); await p.context().close(); }
    if (faces.fin && faces.fin === faces.origine) ko('ÉCART le dessin d’origine et le dessin fin donnent le même aperçu : le réglage du dessin n’a pas été pris'); }

  /* ---------- 4. par les vrais boutons, en quatre tailles ---------- */
  // tout ce qui s'affiche pendant le jeu, relevé au fil de l'eau — en tout (__vu), et lieu par lieu (__zones)
  const ecouter = p => p.evaluate(() => { window.__vu = new Set(); window.__zones = {}; const noter = () => { ['#dialog', '#card', '#hud', '#toasts', '#battle', '#choice', '#chain', '#noms', '#menu'].forEach(s => { const e = document.querySelector(s); if (e && !e.hidden) { const t = (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim(); if (t) { window.__vu.add(t); (window.__zones[s] = window.__zones[s] || new Set()).add(t); } } }); };
    new MutationObserver(noter).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'class'] }); setInterval(noter, 60); });
  const TAILLES = [['bureau', { width: 960, height: 540 }], ['telephone', { width: 390, height: 844 }], ['paysage', { width: 844, height: 390 }], ['petit', { width: 360, height: 560 }]];
  let pageBureau = null;
  for (const [nom, vp] of TAILLES) {
    const p = await ouvrir(vp), depart = anomalies; await ecouter(p); const tactile = vp.width < 900, toucher = async loc => { await (tactile ? loc.tap() : loc.click()); await p.waitForTimeout(160); };   // sur un écran tactile, on touche
    await toucher(bouton(p, '#title .vmenu', 'Nouvelle partie')); await p.waitForTimeout(700);
    const e1 = await etat(p);
    await p.screenshot({ path: path.join(out, nom + '-1-ouverture.png') });
    if (!e1.ouvert) { ko(`BLOQUÉ ${nom} : « Nouvelle partie » n'ouvre pas « Ton personnage »`); await p.close(); continue; }
    const a1 = await p.evaluate(APERCU);
    // l'écran s'ouvre sur Idris : « Commencer » sous le doigt, choisi d'emblée ; pas de « Retour »
    if (e1.nom !== 'Idris' || e1.ok !== 'Commencer' || e1.okBloque || e1.retour || e1.sel !== 'ok') ko(`ÉCART ${nom} : l'écran ne s'ouvre pas sur Idris, « Commencer » choisi : ${JSON.stringify({ nom: e1.nom, ok: e1.ok, bloque: e1.okBloque, retour: e1.retour, choisi: e1.sel })}`);
    // aucune option : rien d'autre à toucher que le champ du nom, « Écrire », l'aperçu et « Commencer »
    if (!sansOption(e1, DEBUT)) ko(`ÉCART ${nom} : l'écran offre autre chose que le nom — ${offre(e1)}`);
    dire(nom, miseEnPage(e1, { tactile, min: 41.5 }).concat(place(e1)));
    if (e1.mots > 4) ko(`ÉCART ${nom} : ${e1.mots} mots à l'écran (« ${e1.texte} »)`);
    if (!e1.champ || e1.champ.id !== 'perso-nom' || !e1.champ.dit || e1.champ.orthographe !== false || e1.champ.majuscules !== 'words' || e1.champ.touche !== 'done') ko(`ÉCART ${nom} : le champ du nom n'a pas son nom pour les lecteurs d'écran, ou le clavier du téléphone y corrigerait un prénom : ${JSON.stringify(e1.champ)}`);
    if (!e1.voirDit) ko(`ÉCART ${nom} : l'aperçu, qui se touche, n'a pas son nom pour les lecteurs d'écran`);
    if (!toujours(a1)) ko(`ÉCART ${nom} : l'aperçu ne montre pas le râwî de toujours : ${JSON.stringify(a1)}`);
    // l'aperçu : un toucher le rapproche, un autre l'éloigne — le même râwî
    await toucher(p.locator('#perso .pv-voir')); await p.waitForTimeout(300); const v1 = await etat(p); if (nom === 'bureau' || nom === 'telephone') await p.screenshot({ path: path.join(out, nom + '-2-de-pres.png') });
    await p.waitForTimeout(500); await toucher(p.locator('#perso .pv-voir')); const v2 = await etat(p);
    if (!v1.proche || v1.presse !== 'true' || v2.proche || v2.presse !== 'false' || v1.face !== e1.face || v1.profil !== e1.profil) ko(`ÉCART ${nom} : un toucher ne rapproche pas l'aperçu, ou un second ne l'éloigne pas : ${JSON.stringify([v1.proche, v1.presse, v2.proche, v2.presse])}`);
    // « Écrire » donne la main au champ, le nom entier choisi : ce qu'on écrit le remplace
    await toucher(p.locator('#perso .pv-nom button')); const w1 = await etat(p);
    if (!w1.champ.actif || w1.champ.choisi !== w1.nom.length) ko(`ÉCART ${nom} : « Écrire » ne donne pas la main au champ du nom, le nom entier choisi (${JSON.stringify(w1.champ)})`);
    // un nom refusé bloque « Commencer » et dit pourquoi ; touché quand même, le bouton ne lance rien
    await p.locator('#perso input').fill('Allah'); await p.waitForTimeout(150); const e2 = await etat(p);
    await p.screenshot({ path: path.join(out, nom + '-3-refus.png') });
    await (tactile ? p.locator('#perso .ok').tap({ force: true }) : p.locator('#perso .ok').click({ force: true })); await p.waitForTimeout(450);
    const b2 = await p.evaluate(() => ({ ouvert: !document.querySelector('#perso').hidden, profil: JSON.stringify(window.ISNAD.save.data.profil), monde: !!window.ISNAD.world.saga }));
    if (!e2.okBloque || !/qu’à Allah/.test(e2.note) || !b2.ouvert || b2.profil !== '{}' || b2.monde) ko(`ÉCART ${nom} : un nom refusé ne bloque pas « Commencer », ou ne dit pas pourquoi (${JSON.stringify({ bloque: e2.okBloque, note: e2.note, apres: b2 })})`);
    dire(nom + ', devant un nom refusé', miseEnPage(e2, { tactile }));
    // un nom accepté débloque
    await p.locator('#perso input').fill('Khalil'); await p.waitForTimeout(150); const e3 = await etat(p);
    if (e3.okBloque || e3.note || e3.ok !== 'Commencer' || !e3.okVisible) ko(`ÉCART ${nom} : « Khalil » ne débloque pas « Commencer »`);
    await p.screenshot({ path: path.join(out, nom + '-4-nom.png') });
    await toucher(p.locator('#perso .ok')); await p.waitForTimeout(900);
    const e4 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, h = I.sagas.idris.heroes.idris, J = JSON.stringify; return { ferme: document.querySelector('#perso').hidden, profil: J(I.save.data.profil), monde: !!(W.saga && W.saga.id === 'idris'), heros: h.name, sceau: h.arabic,
      toujours: J(h.look) === J(I.D.TENUES[0].look), carte: !!(W.sheets && W.sheets[0] && W.sheets[0].look) && J(W.sheets[0].look) === J(Object.assign({ kind: 'compagnon' }, I.D.TENUES[0].look)) }; });
    if (!e4.ferme || !e4.monde || e4.profil !== PROFIL('Khalil') || e4.heros !== 'Khalil' || e4.sceau !== '') { ko(`BLOQUÉ ${nom} : « Commencer » ne lance pas le prologue avec le nom choisi, et lui seul : ${e4.profil} ${e4.heros}`); await p.close(); continue; }
    if (!e4.toujours || !e4.carte) ko(`ÉCART ${nom} : le râwî de la carte n'est pas celui de toujours`);
    // le prologue en entier, joué par le joueur automatique ; tout ce qui s'affiche est relevé
    const joue = await p.evaluate(async () => { const I = window.ISNAD; I.audio.setOn(false); I.debug.auto = true; I.speed = 24; const log = I.debug.log = [];
      const fin = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 150000) { clearInterval(iv); res(false); } }, 100); });
      I.debug.auto = false; I.speed = 1; await new Promise(r => setTimeout(r, 400));
      const vu = [...window.__vu], tout = vu.join(' ¶ '), reste = vu.filter(t => /(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(t)).map(t => { const i = t.indexOf('Idris'); return t.slice(Math.max(0, i - 40), i + 30); });
      const Z = window.__zones, zone = z => [...(Z[z] || [])], objectifs = I.sagas.idris.chapters[0].objectives.map(o => I.t(o.text));
      const ou = { dialogue: zone('#dialog').filter(t => /Khalil/.test(t)).length, combat: zone('#battle').filter(t => /Khalil/.test(t)).length, chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') ? 1 : 0 };
      return { fin, n: vu.length, fois: (tout.match(/Khalil/g) || []).length, reste: [...new Set(reste)].slice(0, 6), ou, objectifs: objectifs.filter(o => zone('#hud').some(t => t.includes(o))).length, bandeau: zone('#hud').length,
        log: log.filter(l => /BLOQUÉ|INACCESSIBLE|ABSENT|ERR /.test(l)), elide: (tout.match(/(?:de|que) Khalil/g) || []).length, faute: (tout.match(/(?:d|qu)[’']Khalil/g) || []).length, md: (I.save.data.equip['idris:idris'] || {}).md }; });
    await p.screenshot({ path: path.join(out, nom + '-5-chaine.png') });
    if (!joue.fin || joue.log.length) ko(`BLOQUÉ ${nom} : le prologue ne se joue pas jusqu'à la Chaîne avec un nom choisi (${joue.log.join(' ; ')})`);
    else if (joue.reste.length) joue.reste.forEach(r => ko(`ÉCART ${nom} : « Idris » s'affiche encore — …${r}…`));
    else if (!joue.ou.dialogue || !joue.ou.combat || !joue.ou.chaine || joue.faute) ko(`ÉCART ${nom} : le nom choisi ne paraît pas partout (${JSON.stringify(joue.ou)}, élisions fautives : ${joue.faute})`);
    else if (!joue.objectifs) ko(`ABSENT ${nom} : aucun objectif du prologue n'a été relevé dans le bandeau (${joue.bandeau} textes) : rien ne dit qu'« Idris » n'y paraît plus`);
    else if (anomalies === depart) ok(`${nom} ${vp.width}×${vp.height}${tactile ? ', au doigt' : ''} : « Ton personnage » s'ouvre sur Idris (${e1.mots} mots : « ${e1.texte} »${tactile ? `, aucun texte sous ${Math.floor(e1.petitTexte * 10) / 10} points` : ''}), rien ne déborde ni ne défile ; aucune option — le champ du nom, « Écrire », l'aperçu, « Commencer », rien d'autre ; l'aperçu est le râwî de toujours, un toucher le rapproche, un autre l'éloigne ; « Écrire » donne la main au champ ; « Allah » bloque « Commencer » et dit pourquoi ; Khalil joue tout le prologue — ${joue.n} textes relevés, « Khalil » ${joue.fois} fois (dialogue ${joue.ou.dialogue}, combat ${joue.ou.combat}, la Chaîne), plus un seul « Idris », ${joue.objectifs} objectifs du bandeau compris ; sur la carte, le râwî de toujours ; arme de départ : ${joue.md}`);
    sansErreur(nom); if (nom === 'bureau') pageBureau = p; else await p.close();
  }

  /* ---------- 5. les téléphones courants, en largeur et en hauteur : rien de tassé, rien hors de l'écran ----------
     640 × 360 et 667 × 375 (les plus courants en largeur), 568 × 320 (le plus petit), 320 × 568 (le plus étroit) : à
     l'ouverture, devant le plus long des refus, puis depuis la Chaîne (« Garder » et « ◂ Retour » côte à côte) — aucun mot
     coupé dans un bouton, rien hors de l'écran, rien qui défile, aucun bouton sous la taille d'un doigt, aucun texte sous
     10,5 points, l'aperçu entier. */
  for (const [nom, vp] of [['paysage 640', { width: 640, height: 360 }], ['paysage 667', { width: 667, height: 375 }], ['petit paysage', { width: 568, height: 320 }], ['étroit', { width: 320, height: 568 }]]) {
    const p = await ouvrir(vp), taille = vp.width + 'x' + vp.height, depart = anomalies, vus = []; await bouton(p, '#title .vmenu', 'Nouvelle partie').tap(); await p.waitForTimeout(700);
    vus.push(['à l’ouverture', await etat(p), DEBUT]); await p.screenshot({ path: path.join(out, 'etroit-' + taille + '-ouverture.png') });
    await p.locator('#perso input').fill(LONG[0]); await p.waitForTimeout(200); vus.push(['devant le plus long des refus', await etat(p), DEBUT]); await p.screenshot({ path: path.join(out, 'etroit-' + taille + '-refus.png') });
    // depuis la Chaîne, une fois le prologue joué : la page est rechargée, la Chaîne ouverte, son pied touché
    await p.reload(); await p.waitForTimeout(1700); await p.evaluate(() => { const I = window.ISNAD; I.save.data.started = true; I.save.data.prologue = true; I.ui.showChain(); });
    await p.waitForTimeout(600); await bouton(p, '#chain .chainfoot', 'Ton personnage').tap(); await p.waitForTimeout(700);
    vus.push(['depuis la Chaîne', await etat(p), SUITE]); await p.screenshot({ path: path.join(out, 'etroit-' + taille + '-chaine.png') });
    vus.forEach(([quoi, e, attendu]) => { const ou = `${nom} ${vp.width}×${vp.height}, ${quoi}`; if (!e.ouvert) { ko(`BLOQUÉ ${ou} : l'écran n'est pas ouvert`); return; }
      dire(ou, miseEnPage(e, { tactile: true, min: 41.5 }).concat(place(e))); if (!sansOption(e, attendu)) ko(`ÉCART ${ou} : l'écran offre autre chose que le nom — ${offre(e)}`); });
    if (vus[1][1].ouvert && (!vus[1][1].okBloque || vus[1][1].note !== LONG[2])) ko(`ÉCART ${nom} ${vp.width}×${vp.height} : « ${LONG[0]} » ne bloque pas, ou ne dit pas pourquoi (« ${vus[1][1].note} »)`);
    if (vus[2][1].ouvert && (vus[2][1].ok !== 'Garder' || !vus[2][1].retour)) ko(`ÉCART ${nom} ${vp.width}×${vp.height} : depuis la Chaîne, ni « Garder » ni « ◂ Retour »`);
    if (anomalies === depart) ok(`${nom} ${vp.width}×${vp.height}, au doigt : à l'ouverture, devant le plus long des refus (${LONG[2].length} signes) et depuis la Chaîne (« Garder », « ◂ Retour »), aucun mot coupé, rien hors de l'écran, rien qui défile, la raison du refus sur aucun bouton, l'aperçu entier (${Math.min(...vus.map(v => v[1].figHaut))} points de haut au moins), aucun bouton sous ${Math.floor(Math.min(...vus.map(v => v[1].petitBouton)))} points, aucun texte sous ${Math.floor(Math.min(...vus.map(v => v[1].petitTexte)) * 10) / 10}`);
    sansErreur(nom + ' ' + taille); await p.close();
  }

  /* ---------- 6. depuis la Chaîne et depuis la halte : le nom se garde, « ◂ Retour » n'y change rien ---------- */
  if (pageBureau) { const p = pageBureau, cliquer = async loc => { await loc.click(); await p.waitForTimeout(180); };
    const ou = () => p.evaluate(() => { const I = window.ISNAD, W = I.world, h = I.sagas.idris.heroes.idris, J = JSON.stringify, c = document.querySelector('#chain'); return { nom: I.perso.nom(), profil: J(I.save.data.profil), heros: h.name, toujours: J(h.look) === J(I.D.TENUES[0].look),
      chaine: !c.hidden, dit: (c.innerText || '').replace(/\s+/g, ' '), perso: !document.querySelector('#perso').hidden, auto: J((I.save.autoGet() || {}).profil || null), monde: I.scene === W && !I.ui.menuOpen }; });
    const pied = async () => { await bouton(p, '#chain .chainfoot', 'Ton personnage').click(); await p.waitForTimeout(700); return etat(p); };
    // la Chaîne : l'écran reprend le nom choisi ; « Garder » et « ◂ Retour » ; toujours aucune option
    const c1 = await pied(), a1 = c1.ouvert ? await p.evaluate(APERCU) : null; await p.screenshot({ path: path.join(out, 'bureau-6-depuis-la-chaine.png') });
    if (!c1.ouvert) ko('BLOQUÉ depuis la Chaîne, « Ton personnage » n’ouvre pas l’écran');
    else { const depart = anomalies;
      if (c1.nom !== 'Khalil' || c1.ok !== 'Garder' || !c1.retour || c1.sel !== 'ok') ko(`ÉCART depuis la Chaîne, « Ton personnage » ne reprend pas le nom choisi, avec « Garder » et « ◂ Retour » : ${JSON.stringify({ nom: c1.nom, ok: c1.ok, retour: c1.retour, choisi: c1.sel })}`);
      if (!sansOption(c1, SUITE)) ko(`ÉCART depuis la Chaîne, l'écran offre autre chose que le nom — ${offre(c1)}`); if (!toujours(a1)) ko(`ÉCART depuis la Chaîne, l'aperçu ne montre pas le râwî de toujours : ${JSON.stringify(a1)}`);
      dire('depuis la Chaîne', miseEnPage(c1).concat(place(c1)));
      // « ◂ Retour », un autre nom déjà écrit : rien ne change
      await p.locator('#perso input').fill('Yacine'); await cliquer(bouton(p, '#perso', 'Retour')); await p.waitForTimeout(600); const r1 = await ou();
      if (r1.perso || !r1.chaine || r1.nom !== 'Khalil' || r1.profil !== PROFIL('Khalil') || r1.heros !== 'Khalil' || !r1.dit.includes('Khalil') || r1.dit.includes('Yacine')) ko(`ÉCART depuis la Chaîne, « ◂ Retour » change quelque chose, ou ne rend pas la Chaîne : ${JSON.stringify({ nom: r1.nom, profil: r1.profil, chaine: r1.chaine })}`);
      // rouvert : le champ redit le nom gardé ; Échap (B, sur la manette) revient de même
      const c2 = await pied(); await p.locator('#perso input').fill('Yacine'); await p.locator('#perso input').press('Enter'); await p.keyboard.press('Escape'); await p.waitForTimeout(600); const r2 = await ou();
      if (c2.nom !== 'Khalil' || r2.perso || !r2.chaine || r2.nom !== 'Khalil' || r2.profil !== PROFIL('Khalil')) ko(`ÉCART depuis la Chaîne, l'écran rouvert ne redit pas le nom gardé, ou Échap ne revient pas sans rien changer : ${JSON.stringify({ champ: c2.nom, nom: r2.nom, profil: r2.profil, ouvert: r2.perso })}`);
      // « Garder », un nouveau nom : gardé, dans la partie et sur l'appareil ; la Chaîne le dit
      await pied(); await p.locator('#perso input').fill('Elyas'); await cliquer(bouton(p, '#perso', 'Garder')); await p.waitForTimeout(700); const g1 = await ou();
      if (g1.perso || !g1.chaine || g1.nom !== 'Elyas' || g1.profil !== PROFIL('Elyas') || g1.auto !== PROFIL('Elyas') || g1.heros !== 'Elyas' || !g1.toujours || !g1.dit.includes('Elyas') || g1.dit.includes('Khalil')) ko(`ÉCART depuis la Chaîne, « Garder » ne garde pas le nouveau nom, et lui seul : ${JSON.stringify({ nom: g1.nom, profil: g1.profil, garde: g1.auto, heros: g1.heros, silhouette: g1.toujours })}`);
      if (anomalies === depart) ok('depuis la Chaîne : « Ton personnage » reprend le nom choisi, avec « Garder » et « ◂ Retour », sans aucune option, l’aperçu toujours le même ; « ◂ Retour » et Échap, un autre nom déjà écrit, n’y changent rien ; « Garder » avec « Elyas » : la partie gardée sur l’appareil porte ce nom et la tenue de toujours, rien d’autre, et la Chaîne le dit'); }
    const texte = await p.evaluate(() => window.ISNAD.save.exporter());
    // rechargée : « Continuer » retrouve le nom
    await p.reload(); await p.waitForTimeout(1700); await bouton(p, '#title .vmenu', 'Continuer').click(); await p.waitForTimeout(1200);
    const c3 = await ou();
    if (c3.nom !== 'Elyas' || c3.heros !== 'Elyas' || c3.profil !== PROFIL('Elyas') || !c3.toujours || !c3.dit.includes('Elyas')) ko(`ÉCART après rechargement, le nom est perdu : ${c3.profil} ${c3.heros}`); else ok('page rechargée, « Continuer » : le râwî s’appelle toujours Elyas, sous son apparence de toujours');
    // la halte, au milieu d'un chapitre : sa page montre le râwî et son nom ; « ◂ Retour » n'y change rien ; « Garder » change le nom, pas la silhouette
    const c4 = await p.evaluate(async () => { const I = window.ISNAD, W = I.world; I.audio.setOn(false); I.speed = 40; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null;
      await W.startChapter('idris', 0, { saga: 'idris', ci: 0, obj: 1, map: 'archives', opts: {}, pos: 'bureau', party: ['idris'], npcs: {}, foes: [], chests: [], flags: {} }); I.speed = 1;
      const avant = JSON.stringify(W.sheets[0].look); I.ui.pause(); const b = [...document.querySelectorAll('#menu .side button')].find(x => /Ton personnage/.test(x.textContent)); return { avant, entree: !!b }; });
    { await bouton(p, '#menu .side', 'Compagnons').click(); await p.waitForTimeout(500); const groupe = await p.evaluate(() => (document.querySelector('#menu .pane').innerText || '').replace(/\s+/g, ' ')); await p.screenshot({ path: path.join(out, 'bureau-7-halte-groupe.png') });
      if (!/Elyas/.test(groupe) || /(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(groupe)) ko(`ÉCART à la halte, la page du groupe ne dit pas le nom choisi : « ${groupe.slice(0, 120)} »`); else ok(`à la halte, la page du groupe dit le nom choisi — « ${groupe.slice(0, 60)}… »`); }
    if (!c4.entree) ko('ABSENT la halte ne propose pas « Ton personnage »');
    else { const depart = anomalies;
      // l'écran, ouvert depuis la halte (un premier toucher peut n'avoir fait que choisir la rubrique)
      const rubrique = async () => { await bouton(p, '#menu .side', 'Ton personnage').click(); await p.waitForTimeout(500);
        if (await p.evaluate(() => document.querySelector('#perso').hidden)) { await bouton(p, '#menu .side', 'Ton personnage').click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(700); } return etat(p); };
      await bouton(p, '#menu .side', 'Ton personnage').hover(); await p.waitForTimeout(400);   // survolée, la rubrique montre sa page
      const page1 = await p.evaluate(() => { const I = window.ISNAD, G = I.gfx, pane = document.querySelector('#menu .pane'), L = Object.assign({ kind: 'compagnon' }, I.D.TENUES[0].look), im = [...pane.querySelectorAll('.perso-vue img')];
        return { images: im.length, toujours: im.length === 2 && im[0].src === G.charURL(L, 0) && im[1].src === G.charURL(L, 1), texte: (pane.innerText || '').replace(/\s+/g, ' ') }; });
      await p.screenshot({ path: path.join(out, 'bureau-8-halte-page.png') });
      if (page1.images !== 2 || !page1.toujours || !/Elyas/.test(page1.texte) || /Manteau des Archives|Capuche d’encre|tenue du veilleur/i.test(page1.texte)) ko(`ÉCART la page « Ton personnage » de la halte ne montre pas le râwî de toujours et son nom : ${JSON.stringify(page1)}`);
      const h1 = await rubrique(), ah = h1.ouvert ? await p.evaluate(APERCU) : null;
      if (!h1.ouvert) ko('BLOQUÉ à la halte, « Ton personnage » n’ouvre pas l’écran');
      else { await p.screenshot({ path: path.join(out, 'bureau-9-depuis-la-halte.png') });
        if (h1.nom !== 'Elyas' || h1.ok !== 'Garder' || !h1.retour) ko(`ÉCART depuis la halte, l'écran ne reprend pas le nom gardé : ${JSON.stringify({ nom: h1.nom, ok: h1.ok, retour: h1.retour })}`);
        if (!sansOption(h1, SUITE)) ko(`ÉCART depuis la halte, l'écran offre autre chose que le nom — ${offre(h1)}`); if (!toujours(ah)) ko(`ÉCART depuis la halte, l'aperçu ne montre pas le râwî de toujours : ${JSON.stringify(ah)}`);
        dire('depuis la halte', miseEnPage(h1).concat(place(h1)));
        // « ◂ Retour » : rien ne change, et l'on est de retour dans le chapitre
        await p.locator('#perso input').fill('Hamza'); await cliquer(bouton(p, '#perso', 'Retour')); await p.waitForTimeout(700); const r3 = await ou();
        if (r3.perso || !r3.monde || r3.nom !== 'Elyas' || r3.profil !== PROFIL('Elyas') || r3.heros !== 'Elyas') ko(`ÉCART depuis la halte, « ◂ Retour » change quelque chose, ou ne rend pas le chapitre : ${JSON.stringify({ nom: r3.nom, profil: r3.profil, monde: r3.monde })}`);
        // « Garder », un nouveau nom : le héros du chapitre le porte aussitôt, sa silhouette n'a pas changé d'un champ
        await p.evaluate(() => window.ISNAD.ui.pause()); await p.waitForTimeout(400); const h2 = await rubrique();
        if (!h2.ouvert) ko('BLOQUÉ à la halte, « Ton personnage » ne s’ouvre pas une seconde fois');
        else { await p.locator('#perso input').fill('Sélim'); await cliquer(bouton(p, '#perso', 'Garder')); await p.waitForTimeout(900);
          const c5 = await p.evaluate(() => { const I = window.ISNAD, W = I.world; return { nom: I.perso.nom(), heros: W.hero('idris').def.name, profil: JSON.stringify(I.save.data.profil), apres: JSON.stringify(W.sheets[0].look), monde: I.scene === W && !I.ui.menuOpen, ferme: document.querySelector('#perso').hidden }; });
          await p.screenshot({ path: path.join(out, 'bureau-10-dans-le-chapitre.png') });
          if (c5.nom !== 'Sélim' || c5.heros !== 'Sélim' || c5.profil !== PROFIL('Sélim') || c5.apres !== c4.avant || !c5.monde || !c5.ferme) ko(`ÉCART depuis la halte, le nouveau nom ne prend pas, ou la silhouette change : ${JSON.stringify(c5)}`); }
        if (anomalies === depart) ok('depuis la halte, au milieu d’un chapitre : la page montre le râwî de toujours (de face, de profil) et son nom, sans nommer aucune tenue ; l’écran s’ouvre sur ce nom, sans aucune option ; « ◂ Retour » n’y change rien et rend le chapitre ; « Garder » avec « Sélim » : le héros du chapitre porte aussitôt ce nom, et sa silhouette n’a pas changé d’un champ'); } }
    sansErreur('en changeant de nom'); await p.close();
    // la partie exportée, importée dans un autre navigateur par les vrais boutons : le nom vient avec elle
    const importer = async t => { const q = await ouvrir(); await bouton(q, '#title', 'Réglages').click(); await bouton(q, '#title', 'Importer une partie').click(); await q.waitForSelector('#partie:not([hidden])'); await q.locator('#partie textarea').fill(t); await q.waitForTimeout(650); await bouton(q, '#partie', 'Lire cette partie').click(); await q.waitForTimeout(700);
      const lu = await q.evaluate(() => ({ boutons: [...document.querySelectorAll('#partie button')].filter(b => b.offsetParent).map(b => b.textContent.trim()), dit: (document.querySelector('#partie').innerText || '').replace(/\s+/g, ' ') }));
      if (!lu.boutons.some(b => /Reprendre cette partie|Remplacer ma partie/.test(b))) return { q, refus: lu.dit.slice(0, 200) };
      await bouton(q, '#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await q.waitForTimeout(1500);
      return { q, e: await q.evaluate(() => { const I = window.ISNAD, h = I.sagas.idris.heroes.idris, J = JSON.stringify; return { nom: I.perso.nom(), profil: J(I.perso.profil()), garde: J(I.save.data.profil), heros: h.name, toujours: J(h.look) === J(I.D.TENUES[0].look), chaine: !document.querySelector('#chain').hidden, dit: (document.querySelector('#chain').innerText || '').replace(/\s+/g, ' ') }; }) }; };
    { const { q, refus, e } = await importer(texte);
      if (refus) ko(`REFUS une partie exportée n'est pas relue dans un autre navigateur : « ${refus} »`);
      else if (e.nom !== 'Elyas' || e.profil !== PROFIL('Elyas') || e.heros !== 'Elyas' || !e.toujours || !e.chaine || !e.dit.includes('Elyas')) ko(`ÉCART une partie importée perd son nom : ${JSON.stringify(e)}`);
      else ok('une partie exportée puis importée dans un autre navigateur, par les vrais boutons, garde son nom : Elyas, sous son apparence de toujours, et la Chaîne le dit');
      sansErreur('en important une partie'); await q.close(); }
    // la même, rendue telle qu'une partie d'avant la 2.37 (un ensemble, huit pièces) : lue par les vrais boutons, sans refus
    { const avant = JSON.parse(texte); avant.partie.profil = Object.assign({ nom: 'Yacine' }, JSON.parse(JSON.stringify(AVANT))); const { q, refus, e } = await importer(JSON.stringify(avant)), depart = anomalies;
      if (refus) ko(`REFUS une partie d'avant (un ensemble, ${Object.keys(AVANT.compo).length} pièces) n'est pas relue : « ${refus} »`);
      else { if (e.nom !== 'Yacine' || e.profil !== PROFIL('Yacine') || e.heros !== 'Yacine' || !e.toujours || !e.chaine || !e.dit.includes('Yacine')) ko(`ÉCART une partie d'avant ne garde pas son nom sous l'apparence de toujours : ${JSON.stringify(e)}`);
        // son écran : le nom, l'aperçu de toujours, aucune option ; « Garder » : le profil ne porte plus que le nom et la tenue de toujours
        await bouton(q, '#chain .chainfoot', 'Ton personnage').click(); await q.waitForTimeout(700); const s = await etat(q), a = s.ouvert ? await q.evaluate(APERCU) : null; await q.screenshot({ path: path.join(out, 'bureau-11-partie-d-avant.png') });
        if (!s.ouvert || s.nom !== 'Yacine' || !sansOption(s, SUITE) || !toujours(a)) ko(`ÉCART une partie d'avant : « Ton personnage » ne montre pas son nom et le râwî de toujours, sans option — ${s.ouvert ? s.nom + ' ; ' + offre(s) + ' ; ' + JSON.stringify(a) : 'l’écran ne s’ouvre pas'}`);
        else { await bouton(q, '#perso', 'Garder').click(); await q.waitForTimeout(700); const g = await q.evaluate(() => JSON.stringify(window.ISNAD.save.data.profil)); if (g !== PROFIL('Yacine')) ko(`ÉCART une partie d'avant, « Garder » : le profil garde autre chose que le nom et la tenue de toujours (${g})`); }
        // et un profil abîmé dans une partie importée ne passe pas : on retombe sur Idris
        const c7 = await q.evaluate(t => { const I = window.ISNAD, o = JSON.parse(t), J = JSON.stringify; o.partie.profil = JSON.parse('{"nom":"<img src=x onerror=alert(1)>","tenue":"inconnue","compo":{"teint":"<b>t1</b>","barbe":"pleine","coiffe":"keffieh","etoffe":"__proto__","neon":"n9","objet":"sabre","manteau":"cape","__proto__":{"teint":"t1"}}}'); const r = I.save.lireTexte(J(o)); if (!r.ok) return { refuse: r.erreur }; I.save.adopter(r.partie);
          const h = I.sagas.idris.heroes.idris; return { nom: I.perso.nom(), profil: J(I.perso.profil()), heros: h.name, sceau: h.arabic, look: J(h.look) === J(I.D.TENUES[0].look) }; }, texte);
        if (c7.refuse || c7.nom !== 'Idris' || c7.profil !== PROFIL('Idris') || c7.heros !== 'Idris' || c7.sceau !== 'إدريس' || !c7.look) ko(`ÉCART un profil abîmé dans une partie importée n'est pas ramené au râwî d'origine : ${JSON.stringify(c7)}`);
        if (anomalies === depart) ok(`la même partie, rendue telle qu'une partie d'avant la 2.37 (l'ensemble « ${AVANT.tenue} », ${Object.keys(AVANT.compo).length} pièces : ${Object.keys(AVANT.compo).join(', ')}) : lue par les vrais boutons sans refus — Yacine, la tenue et la silhouette de toujours ; son écran montre le nom et le même aperçu, sans aucune option ; « Garder » : le profil ne porte plus que le nom et la tenue de toujours ; un profil abîmé dans une partie importée (un nom qui n'en est pas un, une tenue inconnue, des pièces faussées) : le râwî redevient Idris`); }
      sansErreur('en important une partie d’avant'); await q.close(); } }

  /* ---------- 7. en arabe : de droite à gauche, en hauteur et en largeur ---------- */
  for (const [nom, vp, fichier] of [['téléphone', { width: 390, height: 844 }, 'telephone'], ['téléphone en largeur', { width: 844, height: 390 }, 'paysage']]) {
    const p = await ouvrir(vp, '?lang=ar'), depart = anomalies, ou = `en arabe, ${nom} ${vp.width}×${vp.height}`; const k = await p.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].findIndex(b => b.textContent.trim() === window.ISNAD.t('Nouvelle partie')));
    await p.locator('#title .vmenu button').nth(Math.max(0, k)).tap(); await p.waitForTimeout(800);
    const a = await etat(p), d = await p.evaluate(() => ({ dir: document.documentElement.dir, titre: document.querySelector('#perso h2').textContent, rawi: window.ISNAD.langue.rawi(), commencer: window.ISNAD.t('Commencer') }));
    await p.screenshot({ path: path.join(out, 'arabe-' + fichier + '.png') });
    if (!a.ouvert) { ko(`BLOQUÉ ${ou} : l'écran ne s'ouvre pas`); await p.close(); continue; }
    const ap = await p.evaluate(APERCU), arabe = /\p{Script=Arabic}/u;
    // l'écran se retourne : le champ puis « اكتب », la face puis le profil (qui regarde de l'autre côté), le râwî de la carte au bout de l'aperçu ; en largeur, l'aperçu à droite
    if (d.dir !== 'rtl' || !a.rtl) ko(`ÉCART ${ou} : la page ne se lit pas de droite à gauche (${d.dir})`);
    dire(ou, place(a).concat(miseEnPage(a, { tactile: true, min: 41.5 })));
    if (!sansOption(a, DEBUT)) ko(`ÉCART ${ou} : l'écran offre autre chose que le nom — ${offre(a)}`); if (!toujours(ap)) ko(`ÉCART ${ou} : l'aperçu ne montre pas le râwî de toujours, son profil tourné vers sa face : ${JSON.stringify(ap)}`);
    // le râwî y porte le nom que la langue lui donne ; le champ et l'aperçu ont leur nom en arabe ; le bouton est celui de la langue
    if (a.nom !== d.rawi || !arabe.test(a.nom) || a.ok !== d.commencer || !arabe.test(a.ok) || !arabe.test(a.champ.dit) || !arabe.test(a.voirDit) || !arabe.test(d.titre)) ko(`ÉCART ${ou} : l'écran n'est pas dans la langue (${JSON.stringify({ nom: a.nom, ok: a.ok, champ: a.champ.dit, apercu: a.voirDit, titre: d.titre })})`);
    // un nom refusé : la raison, en arabe, sans rien pousser hors de l'écran
    await p.locator('#perso input').fill('Allah'); await p.waitForTimeout(200); const r = await etat(p); if (fichier === 'telephone') await p.screenshot({ path: path.join(out, 'arabe-' + fichier + '-refus.png') });
    if (!r.okBloque || !arabe.test(r.note)) ko(`ÉCART ${ou} : un nom refusé ne bloque pas, ou sa raison n'est pas dite dans la langue (« ${r.note} »)`); dire(ou + ', devant un nom refusé', miseEnPage(r, { tactile: true }));
    // « ابدأ », le nom de la langue laissé tel quel : c'est le nom d'origine qui est gardé
    await p.locator('#perso input').fill(d.rawi); await p.waitForTimeout(200); await p.locator('#perso .ok').tap(); await p.waitForTimeout(1000);
    const f = await p.evaluate(() => { const I = window.ISNAD, h = I.sagas.idris.heroes.idris, J = JSON.stringify; return { ferme: document.querySelector('#perso').hidden, monde: !!(I.world.saga && I.world.saga.id === 'idris'), profil: J(I.save.data.profil), dit: I.perso.dit(), sceau: h.arabic, toujours: J(h.look) === J(I.D.TENUES[0].look) }; });
    if (!f.ferme || !f.monde || f.profil !== PROFIL('Idris') || f.dit !== d.rawi || f.sceau !== 'إدريس' || !f.toujours) ko(`ÉCART ${ou} : « ${d.commencer} », le nom laissé tel quel, ne garde pas le nom d'origine : ${JSON.stringify(f)}`);
    if (anomalies === depart) ok(`${ou} (« ${d.titre} ») : l'écran se retourne — le champ à droite de « ${await p.evaluate(() => window.ISNAD.t('Écrire'))} », la face à droite du profil, qui regarde de l'autre côté, le râwî de la carte au bout gauche de l'aperçu${vp.width > vp.height ? ', l’aperçu à droite, le nom et le bouton à gauche' : ''} — ; rien ne déborde ni ne défile, « ${d.commencer} » reste à l'écran, même devant un nom refusé, dont la raison est dite en arabe ; aucune option ; le râwî s'y appelle « ${d.rawi} », et « ${d.commencer} » garde le nom d'origine`);
    sansErreur(ou); await p.close(); }

  /* ---------- 8. au clavier ---------- */
  { const p = await ouvrir(); await bouton(p, '#title .vmenu', 'Nouvelle partie').click(); await p.waitForTimeout(800);   // la souris reste là où était « Nouvelle partie »
    const sel = async () => (await etat(p)).sel, touche = async k => { await p.keyboard.press(k); await p.waitForTimeout(110); return sel(); };
    const aller = async (cible, touches) => { let s = await sel(); for (let i = 0; i < 4 && s !== cible; i++) s = await touche(touches[i % touches.length]); return s === cible; };
    const s0 = await sel(), route = []; for (let i = 0; i < 3 && !(route.includes('voir') && route.includes('ecrire')); i++) route.push(await touche('ArrowUp'));   // ↑ depuis « Commencer » : l'aperçu et « Écrire »
    const v = await aller('voir', ['ArrowLeft', 'ArrowDown']); await p.keyboard.press('Enter'); await p.waitForTimeout(200); const e1 = await etat(p);        // Entrée sur l'aperçu : il se rapproche
    const w = await aller('ecrire', ['ArrowUp', 'ArrowRight']); await p.keyboard.press('Enter'); await p.waitForTimeout(200); const e2 = await etat(p);      // Entrée sur « Écrire » : la main au champ, le nom entier choisi
    await p.keyboard.type('Zayd'); await p.waitForTimeout(150); const e3 = await etat(p); await p.keyboard.press('Enter'); await p.waitForTimeout(200); const e4 = await etat(p);   // le nom écrit ; Entrée rend la main aux flèches, sans rien valider
    await p.keyboard.press('Escape'); await p.waitForTimeout(300); const e5 = await etat(p);                                                                 // au début, pas de retour : Échap ne ferme rien
    const c = await aller('ok', ['ArrowDown']); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);                                               // ↓ jusqu'à « Commencer », Entrée commence
    const s6 = await p.evaluate(() => { const I = window.ISNAD; return { ferme: document.querySelector('#perso').hidden, monde: !!(I.world.saga && I.world.saga.id === 'idris'), profil: JSON.stringify(I.save.data.profil) }; });
    await p.screenshot({ path: path.join(out, 'clavier-commence.png') });
    if (s0 !== 'ok' || !route.includes('voir') || !route.includes('ecrire') || !v || !e1.proche || e1.presse !== 'true' || !w || !e2.champ.actif || e2.champ.choisi !== e2.nom.length || e3.nom !== 'Zayd' || e4.champ.actif || !e4.ouvert || !e5.ouvert || !c || !s6.ferme || !s6.monde || s6.profil !== PROFIL('Zayd'))
      ko(`ÉCART au clavier : ${JSON.stringify({ depart: s0, haut: route, apercu: [v, e1.proche, e1.presse], ecrire: [w, e2.champ.actif, e2.champ.choisi], nom: e3.nom, apresEntree: [e4.champ.actif, e4.ouvert], echap: e5.ouvert, commencer: c, fin: s6 })}`);
    else ok(`au clavier, la souris immobile sur l’écran : « Commencer » reste choisi ; ↑ va à ${route.map(r => r === 'voir' ? 'l’aperçu' : r === 'ecrire' ? '« Écrire »' : r).join(', puis à ')} ; Entrée sur l’aperçu le rapproche ; Entrée sur « Écrire » donne la main au champ, le nom entier choisi — « Zayd » le remplace, Entrée rend la main aux flèches ; Échap ne ferme rien ; ↓ redescend à « Commencer », Entrée commence — profil ${s6.profil}`);
    sansErreur('au clavier'); await p.close(); }

  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ PERSONNAGE : le nom du râwî — choisi par les vrais boutons, joué, gardé, exporté, réimporté — et son apparence de toujours, sans aucune option (2.37, D231) — ${preuves} preuves, aucune anomalie (captures dans ${path.relative(process.cwd(), out)})`);
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.log('BLOQUÉ le contrôle s’est interrompu : ' + String((e && e.message) || e).split('\n').slice(0, 4).join(' | ')); process.exit(1); });
