/* ISNAD 2.x — plateformes : la cible « android » (l'application Capacitor, plateformes/application/).
   node v2/tools/plateformes.js android :
     1. la page de l'application : le paquet web + Capacitor + le pont (application/atelier.js), posée dans www/ ;
     2. le numéro (versionName "2.47", versionCode 247), l'icône et l'écran de lancement (dessinés par le code) ;
     3. npx cap sync android, puis Gradle : assembleDebug (l'APK de test, signé de la clé de débogage que l'outillage
        Android crée hors du dépôt, dans ~/.android/) et bundleRelease (l'AAB de la version, NON signé : le décideur le
        signe avec SA clé d'envoi, jamais ici) ;
     4. plateformes/sortie/android/isnad-<numéro>-test.apk, isnad-<numéro>.aab, isnad-icone-512.png (la fiche Google
        Play) et controle.txt : le contrôle de l'APK et de l'AAB sans téléphone (aapt2, apkanalyzer, zipalign : identifiant,
        versions, SDK, autorisations du manifeste fusionné, débogage, le jeu embarqué octet pour octet, les bibliothèques
        natives et leurs pages de 16 Ko).
   Il faut le SDK Android (ANDROID_HOME, par défaut /root/android-sdk : cmdline-tools, platform-tools, platforms;android-36,
   build-tools;36.0.0) et Java 21. Le pont s'éprouve à part : node v2/tools/plateformes/application/essai.js android.
   La fiche du décideur : plateformes/android.md. */
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const A = require('./application/atelier.js');

const SDK = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || '/root/android-sdk';
const AND = path.join(A.APP, 'android'), RES = path.join(AND, 'app/src/main/res');
const DENSITES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const LANCEMENT = { '': [480, 320], 'land-mdpi': [480, 320], 'land-hdpi': [800, 480], 'land-xhdpi': [1280, 720], 'land-xxhdpi': [1600, 960], 'land-xxxhdpi': [1920, 1280],
  'port-mdpi': [320, 480], 'port-hdpi': [480, 800], 'port-xhdpi': [720, 1280], 'port-xxhdpi': [960, 1600], 'port-xxxhdpi': [1280, 1920] };

function outil(nom) {
  const bt = path.join(SDK, 'build-tools'); const v = fs.existsSync(bt) ? fs.readdirSync(bt).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).pop() : null;
  const L = { aapt2: v && path.join(bt, v, 'aapt2'), zipalign: v && path.join(bt, v, 'zipalign'), apkanalyzer: path.join(SDK, 'cmdline-tools/latest/bin/apkanalyzer') };
  return L[nom];
}
const lancer = (cmd, args, o) => { const r = spawnSync(cmd, args, Object.assign({ encoding: 'utf8', maxBuffer: 64 << 20 }, o || {})); return { ok: r.status === 0, sortie: ((r.stdout || '') + (r.stderr || '')).split('\n').filter(l => !/^Picked up JAVA_TOOL_OPTIONS/.test(l)).join('\n') }; };

function images() {
  const L = [];
  for (const [d, k] of Object.entries(DENSITES)) {
    L.push({ fichier: path.join(RES, `mipmap-${d}/ic_launcher.png`), l: 48 * k, h: 48 * k, sorte: 'icone' });
    L.push({ fichier: path.join(RES, `mipmap-${d}/ic_launcher_round.png`), l: 48 * k, h: 48 * k, sorte: 'rond' });
    L.push({ fichier: path.join(RES, `mipmap-${d}/ic_launcher_foreground.png`), l: 108 * k, h: 108 * k, sorte: 'premier-plan' });
  }
  for (const [d, [l, h]] of Object.entries(LANCEMENT)) L.push({ fichier: path.join(RES, d ? `drawable-${d}/splash.png` : 'drawable/splash.png'), l, h, sorte: 'lancement', alpha: false });
  return L;
}

// le contrôle sans téléphone : ce que disent aapt2, apkanalyzer, zipalign, et le contenu des paquets
function controler(C, F, page, insertion, web, N) {
  const R = [], ecarts = [];
  const dit = (ok, m) => { R.push((ok ? 'OK    ' : 'ÉCART ') + m); if (!ok) ecarts.push(m); };
  const badge = lancer(outil('aapt2'), ['dump', 'badging', F.apk]).sortie;
  const val = re => (badge.match(re) || [])[1];
  const id = val(/package: name='([^']+)'/), vc = val(/versionCode='(\d+)'/), vn = val(/versionName='([^']+)'/), min = val(/minSdkVersion:'(\d+)'/), cible = val(/targetSdkVersion:'(\d+)'/), compile = val(/compileSdkVersion='(\d+)'/);
  const perms = [...badge.matchAll(/uses-permission: name='([^']+)'/g)].map(m => m[1]);
  dit(id === 'org.isnadgame.isnad', `APK · identifiant ${id} (proposé, à valider)`);
  dit(vn === N.nom && +vc === N.code, `APK · versionName ${vn}, versionCode ${vc} (le jeu : ${N.nom} → ${N.code})`);
  dit(+min === 24 && +cible === 36 && +compile === 36, `APK · minSdk ${min}, targetSdk ${cible}, compileSdk ${compile}`);
  dit(/application-debuggable/.test(badge), 'APK de test · débogable (application-debuggable) : c’est la version de test, signée de la clé de débogage');
  dit(/application-label:'ISNAD'/.test(badge), `APK · nom affiché : ${val(/application-label:'([^']+)'/)}`);
  R.push('      autorisations de l’APK : ' + perms.join(', '));
  const man = lancer(outil('apkanalyzer'), ['manifest', 'print', F.apk]).sortie;
  dit(/MainActivity/.test(man) && !/screenOrientation/.test(man), 'APK · les deux orientations : aucune android:screenOrientation dans le manifeste (le téléphone tourne, selon son verrou de rotation)');
  dit(/usesCleartextTraffic="false"/.test(man), 'APK · aucun trafic en clair (usesCleartextTraffic="false")');
  dit(/allowBackup="false"/.test(man), 'APK · aucune sauvegarde automatique (allowBackup="false")');
  // le manifeste fusionné de la version (celle qu'on publiera)
  const fusion = trouver(path.join(AND, 'app/build/intermediates'), /merged_manifest\/release\/.*AndroidManifest\.xml$/);
  if (fusion) {
    const m = fs.readFileSync(fusion, 'utf8'), pr = [...m.matchAll(/<uses-permission(?:-sdk-23)?\s+android:name="([^"]+)"/g)].map(x => x[1]);
    R.push('      manifeste fusionné (version) : ' + path.relative(C.RACINE, fusion));
    R.push('      autorisations du manifeste fusionné : ' + pr.join(', '));
    const attendues = ['android.permission.INTERNET', 'org.isnadgame.isnad.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'];
    dit(pr.every(x => attendues.includes(x)), `version · aucune autorisation au-delà de INTERNET (Capacitor) et de la permission interne d’AndroidX (DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION, propre à l’application, sans demande à l’utilisateur)`);
    dit(!/android:debuggable="true"/.test(m), 'version · pas débogable (android:debuggable absent du manifeste fusionné)');
    dit(/android:usesCleartextTraffic="false"/.test(m), 'version · aucun trafic en clair');
    dit(/android:allowBackup="false"/.test(m) && /android:fullBackupContent="false"/.test(m) && /android:dataExtractionRules="@xml\/data_extraction_rules"/.test(m), 'version · aucune sauvegarde : allowBackup et fullBackupContent à "false", data_extraction_rules (ni sauvegarde dans le compte, ni copie d’un téléphone à l’autre) — la partie ne quitte pas l’appareil');
    fs.writeFileSync(path.join(path.dirname(F.apk), 'manifeste-fusionne-version.xml'), m);
  } else dit(false, 'version · manifeste fusionné introuvable');
  // le débogage de la WebView : Capacitor l'ouvre seulement si l'application est débogable (CapConfig.java), sauf réglage
  const conf = JSON.parse(fs.readFileSync(path.join(AND, 'app/src/main/assets/capacitor.config.json'), 'utf8'));
  dit(!conf.android || conf.android.webContentsDebuggingEnabled === undefined, 'version · débogage de la WebView coupé : le réglage n’est pas forcé, Capacitor le suit sur « débogable » (ouvert dans l’APK de test, fermé dans la version)');
  // le jeu embarqué, octet pour octet
  const Z = C.lireZip(fs.readFileSync(F.apk)), dansApk = Z.find(e => e.nom === 'assets/public/index.html');
  const pub = Z.filter(e => e.nom.startsWith('assets/public/')).map(e => e.nom);
  dit(dansApk && dansApk.donnees.equals(Buffer.from(page, 'utf8')), `APK · assets/public/index.html est la page de l’application, octet pour octet (${dansApk ? C.mo(dansApk.donnees.length) : 'absente'}) ; dossier public : ${pub.join(', ')}`);
  dit(dansApk && dansApk.donnees.toString('utf8').split(insertion).join('') === web, 'APK · ôter l’insertion (Capacitor + pont) redonne le paquet web, octet pour octet');
  const libs = Z.filter(e => /^lib\//.test(e.nom)).map(e => e.nom);
  const za = lancer(outil('zipalign'), ['-c', '-P', '16', '-v', '4', F.apk]).sortie;
  dit(/Verification succesful|Verification successful/.test(za), `APK · zipalign -c -P 16 : alignement vérifié ; bibliothèques natives : ${libs.length ? libs.join(', ') : 'aucune (rien à aligner sur des pages de 16 Ko)'}`);
  if (F.aab) {
    const B = C.lireZip(fs.readFileSync(F.aab)), dansAab = B.find(e => e.nom === 'base/assets/public/index.html');
    const signe = B.some(e => /^META-INF\/.*\.(RSA|DSA|EC)$/.test(e.nom));
    dit(dansAab && dansAab.donnees.equals(Buffer.from(page, 'utf8')), 'AAB · base/assets/public/index.html est la même page');
    dit(!signe, 'AAB · non signé : à signer par le décideur avec sa clé d’envoi (aucune clé ici)');
    dit(!B.some(e => /^base\/lib\//.test(e.nom)), 'AAB · aucune bibliothèque native');
  }
  return { R, ecarts, perms };
}
function trouver(dos, re) { if (!fs.existsSync(dos)) return null; const L = []; const aller = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const a = path.join(d, e.name); if (e.isDirectory()) aller(a); else if (re.test(a)) L.push(a); }); aller(dos); return L.sort()[0] || null; }

module.exports = {
  description: 'l’application Android (Capacitor) : APK de test et AAB à signer',
  async faire(C) {
    if (!fs.existsSync(path.join(SDK, 'platforms/android-36'))) throw new Error(`SDK Android introuvable (${SDK}/platforms/android-36) : voir plateformes/android.md, « Refaire l’APK »`);
    const P = A.pageApplication(C), N = A.numeros(P.J);
    A.poserWww(P.html);
    const g = path.join(AND, 'app/build.gradle');
    A.remplacer(g, [[/versionCode \d+/, `versionCode ${N.code}`], [/versionName "[^"]*"/, `versionName "${N.nom}"`]]);
    const n = await A.rendre(images());
    console.log(`  icône et écran de lancement : ${n} image(s) redessinée(s)`);
    A.cap(['sync', 'android']);
    if (!fs.existsSync(path.join(AND, 'local.properties'))) fs.writeFileSync(path.join(AND, 'local.properties'), `sdk.dir=${SDK}\n`);
    console.log('  Gradle : assembleDebug bundleRelease (quelques minutes)…');
    const gr = lancer(path.join(AND, 'gradlew'), ['--no-daemon', '-q', 'clean', 'assembleDebug', 'bundleRelease'], { cwd: AND, env: Object.assign({}, process.env, { ANDROID_HOME: SDK }) });
    if (!gr.ok) { console.log(gr.sortie.slice(-4000)); throw new Error('Gradle a échoué'); }
    const dos = path.join(C.SORTIE, 'android'); fs.rmSync(dos, { recursive: true, force: true }); fs.mkdirSync(dos, { recursive: true });
    const F = { apk: path.join(dos, `isnad-${N.nom}-test.apk`), aab: path.join(dos, `isnad-${N.nom}.aab`) };
    fs.copyFileSync(path.join(AND, 'app/build/outputs/apk/debug/app-debug.apk'), F.apk);
    const aab = path.join(AND, 'app/build/outputs/bundle/release/app-release.aab');
    if (fs.existsSync(aab)) fs.copyFileSync(aab, F.aab); else F.aab = null;
    await A.rendre([{ fichier: path.join(dos, 'isnad-icone-512.png'), l: 512, h: 512, sorte: 'icone', alpha: false }]);
    const K = controler(C, F, P.html, P.insertion, P.w.html, N);
    const v = P.versions;
    const tete = [`ISNAD ${N.nom} — application Android, ${new Date().toISOString()}`, `Capacitor : ${Object.entries(v).map(([k, x]) => `${k} ${x}`).join(', ')}`,
      `APK de test : ${path.relative(C.RACINE, F.apk)} (${C.mo(fs.statSync(F.apk).size)})`, F.aab ? `AAB (non signé) : ${path.relative(C.RACINE, F.aab)} (${C.mo(fs.statSync(F.aab).size)})` : 'AAB : non produit', ''];
    fs.writeFileSync(path.join(dos, 'controle.txt'), tete.concat(K.R).join('\n') + '\n');
    console.log(tete.concat(K.R).map(l => '  ' + l).join('\n'));
    if (K.ecarts.length) throw new Error(`ÉCART android — ${K.ecarts.length} : ${K.ecarts.join(' | ')}`);
    console.log(`✓ android — ${path.relative(C.RACINE, F.apk)}${F.aab ? ' et ' + path.relative(C.RACINE, F.aab) : ''} ; contrôle : ${path.relative(C.RACINE, path.join(dos, 'controle.txt'))}`);
    return Object.assign({ page: path.join(A.APP, 'www/index.html'), html: P.html, J: P.J, P: P.w.P, apk: F.apk, aab: F.aab }, {});
  }
};
