/* ISNAD 2.x — plateformes : la cible « newgrounds » (Newgrounds, jeu HTML5).
   plateformes/sortie/newgrounds/isnad-<numéro>-newgrounds.zip : index.html à la racine, rien d'autre — le paquet web tel
   quel (polices embarquées, aucun appel au-dehors). Newgrounds sert le jeu dans un cadre d'une autre origine : l'essai
   générique l'éprouve ainsi (node v2/tools/plateformes.js essai newgrounds). La fiche : plateformes/newgrounds.md. */
const fs = require('fs'), path = require('path');
module.exports = {
  description: 'le paquet web dans un zip, index.html à la racine (Newgrounds)',
  async faire(C) {
    const w = require('./web.js').faire(C);
    const z = C.zip([{ nom: 'index.html', donnees: Buffer.from(w.html, 'utf8') }], C.dateDuJeu(w.J));
    fs.rmSync(path.join(C.SORTIE, 'newgrounds'), { recursive: true, force: true });
    const f = C.ecrire('newgrounds', `isnad-${w.J.numero}-newgrounds.zip`, z), L = C.lireZip(fs.readFileSync(f));
    if (L.length !== 1 || L[0].nom !== 'index.html' || !L[0].donnees.equals(Buffer.from(w.html, 'utf8'))) throw new Error('ÉCART newgrounds : le zip relu n’est pas index.html seul, identique au paquet web');
    console.log(`✓ newgrounds — ${path.relative(C.RACINE, f)} : ${C.mo(z.length)} (index.html : ${C.mo(L[0].donnees.length)}), une seule entrée, relue identique au paquet web`);
    return Object.assign({}, w, { zip: f, entrees: L.map(e => e.nom) });
  }
};
