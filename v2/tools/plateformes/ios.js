/* ISNAD 2.x — plateformes : la cible « ios » (l'application Capacitor, plateformes/application/ios/).
   node v2/tools/plateformes.js ios :
     1. la page de l'application (le paquet web + Capacitor + le pont, application/atelier.js), posée dans www/ ;
     2. le numéro (MARKETING_VERSION 2.47, CURRENT_PROJECT_VERSION 247), l'icône (1024 × 1024, sans couche alpha) et
        l'écran de lancement, dessinés par le code ;
     3. npx cap sync ios — sous Linux, Capacitor 8 écrit le projet Xcode et son Package.swift (Swift Package Manager)
        sans rien compiler : ni Xcode ni CocoaPods ne sont appelés ;
     4. les contrôles du projet (Info.plist, manifeste de confidentialité, identifiant, la page embarquée) ;
     5. plateformes/sortie/ios/isnad-<numéro>-ios.zip : le projet prêt à ouvrir sur un Mac — ios/, la configuration, et
        les trois greffons (node_modules/@capacitor/app, filesystem, share) là où Package.swift les cherche.
   Rien n'est compilé ici (pas de Mac) : le décideur archive et envoie à TestFlight depuis Xcode (plateformes/ios.md). */
const fs = require('fs'), path = require('path');
const A = require('./application/atelier.js');

const IOS = path.join(A.APP, 'ios'), APPD = path.join(IOS, 'App/App');
const GREFFONS = ['app', 'filesystem', 'share'];

function controler(C, page, N) {
  const R = [], ecarts = [], dit = (ok, m) => { R.push((ok ? 'OK    ' : 'ÉCART ') + m); if (!ok) ecarts.push(m); };
  const plist = fs.readFileSync(path.join(APPD, 'Info.plist'), 'utf8'), pbx = fs.readFileSync(path.join(IOS, 'App/App.xcodeproj/project.pbxproj'), 'utf8');
  const cle = (k, v) => new RegExp(`<key>${k}</key>\\s*${v}`).test(plist);
  dit(cle('CFBundleDisplayName', '<string>ISNAD</string>'), 'Info.plist · nom affiché : ISNAD');
  dit(cle('ITSAppUsesNonExemptEncryption', '<false/>'), 'Info.plist · ITSAppUsesNonExemptEncryption = NO (aucun chiffrement propre : pas de formulaire d’exportation)');
  const or = (plist.match(/<key>UISupportedInterfaceOrientations<\/key>\s*<array>([\s\S]*?)<\/array>/) || [])[1] || '';
  dit(/Portrait/.test(or) && /LandscapeLeft/.test(or) && /LandscapeRight/.test(or), 'Info.plist · les deux orientations (portrait, paysage à gauche et à droite ; l’iPad, les quatre)');
  dit(cle('UIStatusBarHidden', '<true/>') && cle('UIViewControllerBasedStatusBarAppearance', '<false/>'), 'Info.plist · plein écran : barre d’état cachée ; le jeu tient compte de l’encoche (viewport-fit=cover, env(safe-area-inset-*))');
  dit(/<string>arm64<\/string>/.test(plist) && !/armv7/.test(plist), 'Info.plist · arm64 (armv7, du modèle de Capacitor, retiré)');
  const priv = fs.readFileSync(path.join(APPD, 'PrivacyInfo.xcprivacy'), 'utf8');
  dit(/<key>NSPrivacyTracking<\/key>\s*<false\/>/.test(priv) && /<key>NSPrivacyCollectedDataTypes<\/key>\s*<array\/>/.test(priv) && /<key>NSPrivacyTrackingDomains<\/key>\s*<array\/>/.test(priv), 'PrivacyInfo.xcprivacy · aucun suivi, aucun domaine, aucune donnée collectée');
  dit((pbx.match(/PrivacyInfo\.xcprivacy in Resources/g) || []).length === 2, 'project.pbxproj · le manifeste de confidentialité est dans les ressources de l’application');
  dit((pbx.match(/PRODUCT_BUNDLE_IDENTIFIER = org\.isnadgame\.isnad;/g) || []).length === 2, 'project.pbxproj · identifiant org.isnadgame.isnad (proposé, à valider), en Debug et en Release');
  dit((pbx.match(new RegExp(`MARKETING_VERSION = ${N.nom.replace('.', '\\.')};`, 'g')) || []).length === 2 && (pbx.match(new RegExp(`CURRENT_PROJECT_VERSION = ${N.code};`, 'g')) || []).length === 2, `project.pbxproj · version ${N.nom} (${N.code})`);
  const ic = fs.readFileSync(path.join(APPD, 'Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'));
  dit(A.pngTaille(ic).join('×') === '1024×1024' && !A.pngAlpha(ic), 'icône · 1024 × 1024, sans couche alpha (ce qu’Apple exige)');
  const pub = path.join(APPD, 'public/index.html');
  dit(fs.existsSync(pub) && fs.readFileSync(pub).equals(Buffer.from(page, 'utf8')), 'ios/App/App/public/index.html est la page de l’application, octet pour octet');
  const pkg = fs.readFileSync(path.join(IOS, 'App/CapApp-SPM/Package.swift'), 'utf8');
  dit(GREFFONS.every(g => pkg.includes(`../../../node_modules/@capacitor/${g}`)), 'Package.swift · les greffons App, Filesystem, Share (Swift Package Manager)');
  return { R, ecarts };
}

module.exports = {
  description: 'le projet iOS (Capacitor, Xcode) dans un zip, à compiler sur un Mac',
  async faire(C) {
    const P = A.pageApplication(C), N = A.numeros(P.J);
    A.poserWww(P.html);
    A.remplacer(path.join(IOS, 'App/App.xcodeproj/project.pbxproj'), [[/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${N.nom};`], [/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${N.code};`]]);
    const img = [{ fichier: path.join(APPD, 'Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'), l: 1024, h: 1024, sorte: 'icone', alpha: false }]
      .concat(['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'].map(f => ({ fichier: path.join(APPD, 'Assets.xcassets/Splash.imageset', f), l: 2732, h: 2732, sorte: 'lancement', alpha: false })));
    console.log(`  icône et écran de lancement : ${await A.rendre(img)} image(s) redessinée(s)`);
    const sync = A.cap(['sync', 'ios']);
    const K = controler(C, P.html, N);
    // le zip : le projet tel qu'on l'ouvre sur un Mac
    const pre = 'isnad-ios/', sauf = r => /(^|\/)(build|DerivedData|xcuserdata|Pods|\.build|\.swiftpm)(\/|$)/.test(r.split(path.sep).join('/'));
    const E = [{ nom: pre + 'LISEZ-MOI.txt', donnees: LISEZMOI(N) }];
    for (const f of ['package.json', 'package-lock.json', 'capacitor.config.json']) E.push(...A.entrees(A.APP, f, pre));
    E.push(...A.entrees(A.APP, 'ios', pre, sauf));
    for (const g of GREFFONS) E.push(...A.entrees(A.APP, `node_modules/@capacitor/${g}`, pre, r => sauf(r) || /\/android(\/|$)/.test(r.split(path.sep).join('/'))));
    const dos = path.join(C.SORTIE, 'ios'); fs.rmSync(dos, { recursive: true, force: true });
    const z = C.zip(E, C.dateDuJeu(P.J)), f = C.ecrire('ios', `isnad-${N.nom}-ios.zip`, z);
    const L = C.lireZip(fs.readFileSync(f)), dansZip = L.find(e => e.nom === pre + 'ios/App/App/public/index.html');
    const okZip = dansZip && dansZip.donnees.equals(Buffer.from(P.html, 'utf8')) && L.some(e => e.nom === pre + 'ios/App/App.xcodeproj/project.pbxproj') && GREFFONS.every(g => L.some(e => e.nom === `${pre}node_modules/@capacitor/${g}/Package.swift`));
    K.R.push((okZip ? 'OK    ' : 'ÉCART ') + `zip · ${L.length} fichiers ; le projet Xcode, la page embarquée (identique), les trois greffons à leur place`); if (!okZip) K.ecarts.push('zip');
    const tete = [`ISNAD ${N.nom} — projet iOS, ${new Date().toISOString()}`, `Capacitor : ${Object.entries(P.versions).map(([k, x]) => `${k} ${x}`).join(', ')}`,
      `zip : ${path.relative(C.RACINE, f)} (${C.mo(z.length)})`, 'npx cap sync ios, sous Linux :', ...sync.split('\n').filter(l => l.trim()).map(l => '    ' + l.trim()), '',
      'NON COMPILÉ : il faut un Mac avec Xcode 26 ou plus récent (plateformes/ios.md).', ''];
    fs.writeFileSync(path.join(dos, 'controle.txt'), tete.concat(K.R).join('\n') + '\n');
    console.log(tete.concat(K.R).map(l => '  ' + l).join('\n'));
    if (K.ecarts.length) throw new Error(`ÉCART ios — ${K.ecarts.join(' | ')}`);
    console.log(`✓ ios — ${path.relative(C.RACINE, f)} (${C.mo(z.length)}) : le projet Xcode prêt à ouvrir ; non compilé (pas de Mac ici)`);
    return { page: path.join(A.APP, 'www/index.html'), html: P.html, J: P.J, P: P.w.P, zipIos: f };
  }
};

const LISEZMOI = N => `ISNAD ${N.nom} — le projet iOS (Capacitor 8, Swift Package Manager)

Ce zip est fait par « node v2/tools/plateformes.js ios ». Le jeu y est déjà posé (ios/App/App/public/index.html).
Sur un Mac avec Xcode 26 ou plus récent (Xcode 27 convient) :

  1. Décompresser ce zip.
  2. Ouvrir isnad-ios/ios/App/App.xcodeproj (double-clic).
     Xcode télécharge seul ce qui manque (le paquet « capacitor-swift-pm » et la bibliothèque du greffon Filesystem).
  3. Cible « App » > Signing & Capabilities : choisir son équipe (Team).
  4. Product > Archive, puis Distribute App > TestFlight & App Store > Distribute : la version arrive dans TestFlight.

Le pas à pas complet est dans le dépôt : plateformes/ios.md.
Identifiant proposé : org.isnadgame.isnad — à valider avant tout envoi (il ne se change plus ensuite).
`;
