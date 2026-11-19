/* ISNAD 2.16 — les sondes des corps, communes aux parties jouées par smoke.js et par paquet.js : un PNJ d'un paquet a un
   corps comme ceux du jeu de base, il s'éprouve de la même façon.
   Usage, dans un outil (avant de lancer la partie, sur la page où elle se joue) :
     const sondes = require('./sondes.js'); await page.evaluate(sondes.corps, mode);   // mode : 'auto' | 'walk' | 'tap' | 'wrong'
   Ce qu'elles relèvent s'écrit dans le journal de la partie (I.debug.log, lu au moment d'écrire : l'outil peut le
   remplacer après coup) :
   - « PNJ EN TRAVERS » (tous les modes) : à chaque point de reprise, chaque PNJ (et chaque coffre) posé sur le lieu, sa
     case rendue pleine, ne doit couper aucun lieu nommé de là où se tient le joueur — à moins que le pas de côté qu'il
     ferait (vers une case voisine libre) ne rouvre le passage, ce que le journal dit sans alerte (« PNJ dans un passage »).
   - « SUPERPOSÉ » (à pied et au doigt) : le joueur reste plus de trente pas dans le pied de quelqu'un, ou un lieu se
     charge avec quelqu'un à moins de 9 points de lui.
   « COINCÉ », lui, est écrit par le joueur de test du moteur (world.js, walkStep et le pas au doigt) dans le même journal.
   Le nombre de places éprouvées : Object.keys(I.debug.corps.vus).length. */
function corps(mode) {
  const I = window.ISNAD, W = I.world; if (I.debug.corps) return;
  const log = t => (I.debug.log || (I.debug.log = [])).push(t), vusT = {}; I.debug.corps = { vus: vusT };
  const travers = () => { const m = W.map, p = W.player; if (!m || !W.saga || W.excursion || I.scene !== W) return; const w = m.w, plein = new Uint8Array(m.solid);
    const zone = () => { const vu = new Uint8Array(w * m.h), s = Math.floor((p.y - 2) / 16) * w + Math.floor(p.x / 16), q = [s]; if (s < 0 || s >= vu.length) return vu; vu[s] = 1;
      for (let k = 0; k < q.length; k++) { const i = q[k], x = i % w, y = (i - x) / w; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(o => { const X = x + o[0], Y = y + o[1], j = Y * w + X; if (X < 0 || Y < 0 || X >= w || Y >= m.h || vu[j] || plein[j]) return; vu[j] = 1; q.push(j); }); } return vu; };
    const joint = (vu, s) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = s[0] + dx, Y = s[1] + dy; if (X >= 0 && Y >= 0 && X < w && Y < m.h && vu[Y * w + X]) return true; } return false; };
    const lieux = Object.keys(m.spots), v0 = zone(), base = lieux.filter(k => joint(v0, m.spots[k])), corps = W.corps(), caseDe = e => Math.floor((e.y - 2) / 16) * w + Math.floor(e.x / 16), prises = corps.map(caseDe), ici = caseDe(p);
    corps.forEach(e => { const i = caseDe(e), cle = m.id + ':' + (e.id || JSON.stringify(e.at)) + ':' + i; if (vusT[cle] || i === ici || m.solid[i]) return; vusT[cle] = 1;
      plein[i] = 1; const coupes = base.filter(k => !joint(zone(), m.spots[k])); if (!coupes.length) { plein[i] = 0; return; }
      const x = i % w, y = (i - x) / w, cote = !e.id ? null : [[1, 0], [-1, 0], [0, 1], [0, -1]].map(o => (y + o[1]) * w + x + o[0]).find(j => { if (j === ici || m.solid[j] || prises.includes(j)) return false; plein[i] = 0; plein[j] = 1; const r = base.every(k => joint(zone(), m.spots[k])); plein[j] = 0; plein[i] = 1; return r; });
      plein[i] = 0; const qui = e.id ? (e.name || e.id) : 'un coffre (' + (e.gear || e.item || e.codex) + ')';
      if (cote !== undefined && cote !== null) log(`PNJ dans un passage ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} sur ${m.id} : ${qui} — son pas de côté rouvre le chemin de ${coupes.join(', ')}`);
      else log(`PNJ EN TRAVERS ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} sur ${m.id} : ${qui} (case ${x},${y}) coupe ${coupes.join(', ')}`); }); };
  const ock = W.checkpoint; W.checkpoint = function () { const r = ock.apply(this, arguments); try { travers(); } catch (e) { log('ERR travers ' + e.message); } return r; };
  if (mode === 'walk' || mode === 'tap') { let dans = 0, lieu = ''; const ou = W.update; W.update = function () { const r = ou.apply(this, arguments);
    if (W.map && W.saga && I.scene === W && !W.excursion) { const p = W.player, k = W.saga.id + '/' + (W.ch && W.ch.id) + ' ' + W.map.id, L = W.corps();
      if (k !== lieu) { lieu = k; const n = L.find(e => Math.hypot(e.x - p.x, e.y - p.y) < 9); if (n) log(`SUPERPOSÉ ${k} : au chargement, ${n.name || 'un coffre'} à ${Math.round(Math.hypot(n.x - p.x, n.y - p.y))} points du joueur`); }
      const e = L.find(q => W.touche(q, p.x, p.y)); if (e) { if (++dans === 31) log(`SUPERPOSÉ ${k} objectif ${W.objIndex} : le joueur reste dans le pied de ${e.name || 'un coffre'}`); } else dans = 0; }
    return r; }; }
}
// les mots d'un journal qui font échouer une partie jouée (smoke.js les écrit tels quels ; paquet.js les relève)
const ECHECS = /BLOQUÉ|INACCESSIBLE|ABSENT|CACHÉ|INVISIBLE|MUSIQUE|COINCÉ|SUPERPOSÉ|PNJ EN TRAVERS|ERR /;
module.exports = { corps, ECHECS };
