/* ISNAD 2.x — ce que disent tous les supports de promotion (shorts, démo jouable, livret) : écrit ici, et nulle part
   ailleurs. Changer l'adresse, c'est changer cette ligne, puis refaire les supports (v2/tools/shorts.js, jouable.js,
   livret.js). La mention du soutien ne paraît, pour l'instant, que sur le plan final des shorts
   (node v2/tools/shorts.js fin). */
module.exports = {
  ADRESSE: 'www.isnad-game.org',
  NOM: 'ISNAD',
  SOUS_TITRE: 'Chroniques des Compagnons',
  DEVISE: 'Savoir de qui l’on tient ce que l’on sait.',
  ETAT: 'Version bêta',
  // pour nous écrire (décideur, 19 novembre) : la page « Contribuer » du livret (promo/livret-2x/contribuer.md)
  CONTACT: 'ideatobot@gmail.com',
  // la mention qui reste sur tout support tant qu'un spécialiste n'a pas relu (décision 39) ; « bêta » plutôt que « de travail » (décideur, 19 novembre)
  RESERVE: 'Version bêta. La relecture historique et religieuse par un spécialiste reste à faire.',
  // le soutien (demande du décideur, 17 novembre) : la phrase du plan final des shorts, la part posée en or, et le logo,
  // tel que l'Institut l'a fourni (fond transparent, aucune retouche)
  SOUTIEN: 'Une initiative soutenue par l’Institut Islam Actuel',
  SOUTIEN_NOM: 'l’Institut Islam Actuel',
  SOUTIEN_LOGO: 'promo/partenaires/islam-actuel.webp',
  // 2.x — ce que le jeu lui-même reprend, pour qu'un joueur partage sa progression (v2/src/core/partage.js, demande du
  // décideur, 19 novembre) : v2/tools/build.js le pose dans la page (window.ISNAD_PROMO), sans le recopier dans le moteur.
  // Le sous-titre et la réserve se disent dans la langue du joueur : v2/tools/langues.js les relève avec les phrases du
  // moteur. Changer l'une de ces lignes, c'est refaire l'assemblage, et redemander la réserve dans chaque langue.
  JEU: ['NOM', 'SOUS_TITRE', 'ADRESSE', 'RESERVE'],
  JEU_DIT: ['SOUS_TITRE', 'RESERVE']
};
