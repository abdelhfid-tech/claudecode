/* ISNAD 2.x — plateformes : la cible « web ».
   plateformes/sortie/web/index.html : UN seul fichier, le jeu assemblé dont la ligne <link> de Google Fonts est remplacée
   par les polices embarquées (data:, woff2) ; rien d'autre ne change, et c'est contrôlé (seule la ligne des polices
   diffère, aucune ressource hors du fichier). C'est la base des autres cibles. */
module.exports = {
  description: 'un seul fichier HTML, polices embarquées, sans réseau',
  faire(C) {
    const J = C.lireJeu(), P = C.lirePolices(), html = C.poserPolices(J, P);
    const d = C.seuleLaLigneDesPolices(J, html), dehors = C.ressourcesDehors(html);
    if (!d.ok) throw new Error('ÉCART web : le paquet diffère du jeu ailleurs que sur la ligne des polices — ' + d.mot);
    if (dehors.length) throw new Error('ÉCART web : une ressource reste au-dehors — ' + dehors.join(' | '));
    if (J.build && J.build !== J.numero) console.log(`  (le jeu assemblé est la ${J.numero}, v2/tools/build.js dit ${J.build} : le paquet suit le jeu assemblé)`);
    const f = C.ecrire('web', 'index.html', html);
    console.log(`✓ web — ${require('path').relative(C.RACINE, f)} : ISNAD ${J.numero}, ${C.mo(Buffer.byteLength(html))} (le jeu : ${C.mo(Buffer.byteLength(J.html))}, polices : ${C.ko(P.fichiers.reduce((s, x) => s + x.octets, 0))} en ${P.fichiers.length} fichiers) ; ${d.mot}`);
    return { page: f, html, J, P };
  }
};
