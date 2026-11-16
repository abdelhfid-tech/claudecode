/* ISNAD 2.x — la progression : un besoin, un outil, puis sans aide.
   La règle, donnée par le décideur le 16 novembre : « le joueur découvre un besoin, apprend un outil, puis le réutilise
   sans aide avant d'en recevoir un autre. […] une nouvelle décision importante par séquence. Se déplacer, retrouver une
   source et choisir une tactique ne doivent pas être enseignés dans le même écran. »
   - Un OUTIL (D.OUTILS) est ce que le joueur apprend à faire : se déplacer, parler, frapper la faille, les vertus, la
     garde, la besace, la halte, retrouver une source, s'équiper, frapper ce qui rôde, prendre une posture.
   - Une SÉQUENCE est un objectif du récit, ou un combat : I.lecons.sequence() à chacun.
   - Quand le BESOIN d'un outil se présente, le jeu appelle I.lecons.proposer(id, dire). L'outil n'est donné (dire : la
     leçon, une ligne) que si aucun autre ne l'a été dans cette séquence, et si le dernier reçu a déjà RESSERVI sans aide
     (I.lecons.reemploi) — ou si trois séquences ont passé : le jeu n'attend pas indéfiniment. Sinon rien n'est dit : le
     besoin se représentera.
   - Tant qu'un outil n'est pas reçu, ce qu'il commande ne se montre pas : commandes du combat, pages de la halte.
   Ce mode n'existe que pour une partie commencée par « Nouvelle partie » (elle porte `lecons`). Une partie d'avant, ou
   une partie posée par un outil de contrôle, a tout d'emblée, comme toujours. Rien ici ne touche aux récits. */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, W = I.world, S = I.script;
  const L = I.lecons = { journal: [], PATIENCE: 3, COMBAT: ['frapper', 'vertus', 'garde', 'objets'] };
  const etat = () => { const l = I.save.data.lecons; return l && typeof l === 'object' && !Array.isArray(l) && l.recus && l.re ? l : null; };
  const T = () => (I.sagas.coeur && I.sagas.coeur.lecons) || {};
  L.actif = () => !!etat();
  L.ouvrir = function () { I.save.data.lecons = { seq: 0, recus: {}, re: {}, dernier: null, donne: -1 }; L.journal = []; L._t = 0; };
  L.recu = id => { const d = etat(); return !d || d.recus[id] !== undefined; };
  L.sequence = function () { const d = etat(); if (d) d.seq = (d.seq | 0) + 1; L._t = 0; };
  // peut-on donner un outil maintenant ?
  L.pret = function () {
    const d = etat(); if (!d) return true; if (d.donne === d.seq) return false;
    const der = d.dernier; if (!der) return true; const o = D.OUTILS[der] || {};
    return !!o.geste || (d.re[der] | 0) > 0 || d.seq - (d.recus[der] | 0) >= L.PATIENCE;
  };
  L.recevoir = function (id) { const d = etat(); if (!d || d.recus[id] !== undefined) return false; d.recus[id] = d.seq; d.dernier = id; d.donne = d.seq; L.journal.push({ id, seq: d.seq }); return true; };
  // le besoin se présente : l'outil est-il donné ? (hors de ce mode : la leçon se dit, comme avant)
  L.proposer = function (id, dire) {
    const d = etat(); if (!d) { if (dire) dire(); return true; }
    if (d.recus[id] !== undefined || !L.pret()) return false;
    L.recevoir(id); if (dire) dire(); return true;
  };
  // l'outil a resservi sans aide (dans une séquence d'après, sauf `meme` : un autre tour du même combat)
  L.reemploi = function (id, meme) { const d = etat(); if (!d || d.recus[id] === undefined) return; if (!meme && d.recus[id] === d.seq) return; d.re[id] = (d.re[id] | 0) + 1; };
  // un feuillet entre au Recueil : l'annonce-t-on ? Dans une partie neuve, pas avant d'avoir appris à retrouver une source
  // (il y entre quand même) : « retrouver une source » ne s'enseigne pas sur le même écran qu'autre chose.
  L.annonce = () => { const d = etat(); return !d || d.recus.source !== undefined; };
  const dit = (k, ms) => { const t = T()[k]; if (!t) return; const tactile = document.body.classList.contains('touch'), s = typeof t === 'string' ? t : (tactile ? t.doigt : t.clavier) || ''; if (s) S.toast(I.fmt(s), ms || 8000); };
  L.dit = dit;

  /* ----- les premiers pas ----- */
  // au début du prologue : se déplacer, et rien d'autre
  L.depart = () => L.proposer('marcher', () => dit('marcher', 10000));
  // un objectif devient courant : parler, la première fois qu'il le faut ; sinon, dans un récit, la halte, puis l'équipement
  // quand la réserve tient mieux que ce que l'on porte — un seul à la fois, et seulement si le précédent a resservi
  L.objectif = function (o) {
    const d = etat(); if (!d) return false;
    if (o && o.talk && L.proposer('parler', () => dit('parler', 8000))) return true;
    if (W.saga && !W.saga.frame && L.proposer('halte', () => dit('halte', 9000))) return true;
    if (W.saga && d.recus.halte !== undefined && d.recus.equipement === undefined && I.gear && I.gear.better() && L.proposer('equipement', () => dit('equipement', 8000))) return true;
    return false;
  };
  // un objectif est atteint : une séquence s'achève ; marcher ou parler ont resservi si l'on n'a pas été conduit
  L.atteint = function (o, mene) { const d = etat(); if (!d) return; if (o && o.goto && !mene) L.reemploi('marcher'); if (o && o.talk) L.reemploi('parler'); L.sequence(); };
  // le joueur a la main et n'avance pas : au bout de vingt-cinq secondes, on lui montre où demander son chemin
  L.temps = function (dt) { const d = etat(); if (!d || d.recus.aide !== undefined) return; L._t = (L._t || 0) + dt; if (L._t > 25 && L.proposer('aide', () => dit('aide', 9000))) L._t = 0; };
  // un chapitre s'ouvre : les mêmes besoins qu'à chaque objectif
  L.chapitre = () => L.objectif(null);

  /* ----- le combat : une commande nouvelle à la fois ----- */
  // au début d'un combat → l'outil reçu à cette occasion, ou null. Le premier combat donne toujours « frapper » ; devant
  // une idole, rien ne manque au groupe.
  L.combat = function (idole) {
    const d = etat(); if (!d) return null; L.sequence();
    if (d.recus.frapper === undefined) { L.recevoir('frapper'); return 'frapper'; }
    if (idole) { L.COMBAT.forEach(id => { if (d.recus[id] === undefined) { d.recus[id] = d.seq; d.re[id] = 1; } }); return null; }
    const id = L.COMBAT.find(k => d.recus[k] === undefined); if (!id) return null;
    return L.proposer(id) ? id : null;
  };
  const DE = { attack: 'frapper', light: 'frapper', skills: 'vertus', items: 'objets', guard: 'garde', niyya: 'garde' };
  L.outilDe = cmd => DE[cmd] || null;
  L.voit = cmd => { const d = etat(); if (!d) return true; const id = DE[cmd]; return !id || d.recus[id] !== undefined; };
  L.banniere = id => { const t = T()[id]; return t && typeof t === 'string' ? I.fmt(t) : ''; };

  /* ----- la halte : une page se montre quand son outil est connu ----- */
  L.page = function (nom) {
    const d = etat(); if (!d) return true; const sv = I.save.data, su = k => sv.codex.includes('coeur/' + k);
    switch (nom) {
      case 'equipement': return d.recus.equipement !== undefined || su('equipement');
      case 'oeuvres': return su('oeuvres') || su('zad') || su('lames');
      case 'animaux': return su('figures_ciel');
      case 'mal': return su('idees_noires') || su('enracinement');
      case 'valeurs': return su('valeurs') || su('attributs');
      case 'piliers': return d.recus.halte !== undefined;
      default: return true;
    }
  };
})();
