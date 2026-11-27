/* ISNAD 2.x — plateformes : la cible « itch » (itch.io, jeu HTML joué dans le navigateur).
   plateformes/sortie/itch/isnad-<numéro>-itch.zip : index.html à la racine du zip (itch.io l'exige), et rien d'autre —
   le paquet « web » tel quel. Sur la page du jeu, itch.io le sert dans un cadre (<iframe>) d'une autre origine :
   l'essai l'éprouve ainsi (node v2/tools/plateformes.js essai itch). */
const fs = require('fs'), path = require('path');
module.exports = {
  description: 'le paquet web dans un zip, index.html à la racine',
  async faire(C) {
    const w = require('./web.js').faire(C);
    const z = C.zip([{ nom: 'index.html', donnees: Buffer.from(w.html, 'utf8') }], C.dateDuJeu(w.J));
    const dos = path.join(C.SORTIE, 'itch'); fs.rmSync(dos, { recursive: true, force: true });
    const f = C.ecrire('itch', `isnad-${w.J.numero}-itch.zip`, z);
    // relu : une seule entrée, index.html, identique au paquet web
    const L = C.lireZip(fs.readFileSync(f));
    if (L.length !== 1 || L[0].nom !== 'index.html' || !L[0].donnees.equals(Buffer.from(w.html, 'utf8'))) throw new Error('ÉCART itch : le zip relu n’est pas index.html seul, identique au paquet web');
    console.log(`✓ itch — ${path.relative(C.RACINE, f)} : ${C.mo(z.length)} (index.html : ${C.mo(L[0].donnees.length)}), une seule entrée, relue identique au paquet web`);
    // le texte de la page, prêt à coller : plateformes/itch-page.txt (proposition, à valider), le nom, le sous-titre, la
    // devise et la réserve pris dans v2/tools/promotion.js — jamais recopiés à la main
    const P = require(path.join(C.V2, 'tools/promotion.js'));
    const texte = fs.readFileSync(path.join(C.RACINE, 'plateformes/itch-page.txt'), 'utf8').replace(/\{\{(NOM|SOUS_TITRE|DEVISE|RESERVE)\}\}/g, (m, k) => P[k]);
    if (/\{\{|\}\}/.test(texte) || !texte.includes(P.RESERVE)) throw new Error('ÉCART itch : le texte de la page n’est pas complet, ou n’a pas la réserve');
    const fp = C.ecrire('itch', 'page-itch.txt', texte);
    console.log(`✓ itch — ${path.relative(C.RACINE, fp)} : le texte de la page, la réserve comprise (promotion.js)`);
    return Object.assign({}, w, { zip: f, entrees: L.map(e => e.nom) });
  }
};
