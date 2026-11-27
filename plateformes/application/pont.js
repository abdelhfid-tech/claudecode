/* ISNAD 2.x — le pont de l'application (Android, iOS : Capacitor).
   Ce fichier est posé À CÔTÉ du jeu, dans le projet de l'application, par node v2/tools/plateformes.js android | ios
   (comme promo/jouable/demarrage.js l'est dans la démo). Le jeu n'est pas modifié : on lui fournit ce qu'une application
   n'a pas d'elle-même, et rien d'autre. Hors d'une application (un navigateur, même avec capacitor.js chargé), le pont ne
   fait rien : il n'agit que si window.Capacitor est le pont natif (Capacitor.isNativePlatform()).

   1. « Enregistrer le fichier » (la partie, ui.js) et « Enregistrer l'image » (le partage, partage.js) : le jeu clique un
      lien <a download> sur un blob, ce qu'une WebView ne sait pas remettre. Le pont écrit le fichier dans le dossier de
      cache de l'application (greffon Filesystem), puis ouvre la feuille de partage du téléphone (greffon Share), d'où l'on
      choisit « Enregistrer dans Fichiers », un disque, un message…
   2. « Partager ma progression » : navigator.share et navigator.canShare n'existent pas dans la WebView d'Android. Le pont
      les fournit par le greffon Share, image comprise ; « annulé » est rendu comme le navigateur le rend (AbortError), et le
      jeu dit alors « Partage annulé ». Sans greffon, rien n'est posé : le jeu prend son repli.
   3. Le bouton Retour d'Android (greffon App) : ce que fait Échap dans le jeu — revenir d'un cran
      (ISNAD.input.emit('cancel')). Il ne quitte jamais l'application (le greffon App retient le geste, même sans nous).
   4. La partie à l'abri : les clés isnad2.* du stockage local sont recopiées, à chaque écriture, dans un fichier de
      l'application (Filesystem, dossier de données ; deux fichiers tour à tour, pour qu'une écriture coupée n'emporte
      rien). Au démarrage, si le stockage local n'a aucune clé isnad2.* (iOS peut vider celui d'une WebView), elles sont
      remises AVANT que le jeu ne lise ses parties : le démarrage du jeu (ISNAD.ui.boot) attend le pont, comme il attend
      déjà la page dans un Artifact (la dernière ligne du jeu). Quand rien n'est à remettre, il démarre aussitôt, comme
      avant, sans attendre.

   Ce que le pont a fait est noté dans window.ISNAD_PONT.journal (l'essai le lit). Aucune requête au-dehors. */
(function () {
  'use strict';
  var C = window.Capacitor;
  var natif = false;
  try { natif = !!(C && typeof C.isNativePlatform === 'function' && C.isNativePlatform()); } catch (e) { natif = false; }
  var PONT = window.ISNAD_PONT = { actif: natif, journal: [], greffons: {}, abri: { remis: 0, ecrits: 0, fichier: null, cles: [] }, ordre: [] };
  if (!natif) return;

  var note = function (m) { PONT.journal.push(m); };
  var PREFIXE = 'isnad2.', FICHIERS = ['isnad2-abri-a.json', 'isnad2-abri-b.json'], DELAI = 400, ATTENTE_MAX = 4000;

  // un greffon natif, s'il est là ; sinon null (le jeu garde alors son comportement de navigateur)
  var greffon = function (nom) {
    try {
      if (typeof C.isPluginAvailable === 'function' && !C.isPluginAvailable(nom)) return null;
      if (C.Plugins && C.Plugins[nom]) return C.Plugins[nom];
      return typeof C.registerPlugin === 'function' ? C.registerPlugin(nom) : null;
    } catch (e) { return null; }
  };
  var Fs = greffon('Filesystem'), Sh = greffon('Share'), App = greffon('App');
  PONT.greffons = { Filesystem: !!Fs, Share: !!Sh, App: !!App };
  note('greffons : Filesystem ' + (Fs ? 'oui' : 'non') + ', Share ' + (Sh ? 'oui' : 'non') + ', App ' + (App ? 'oui' : 'non'));

  /* ---------- outils ---------- */
  var base64 = function (blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { var s = String(r.result || ''), i = s.indexOf(','); res(i >= 0 ? s.slice(i + 1) : s); };
      r.onerror = function () { rej(r.error || new Error('lecture du fichier impossible')); };
      r.readAsDataURL(blob);
    });
  };
  var nomSur = function (n) { return String(n || 'isnad').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^[.-]+/, '').slice(0, 80) || 'isnad'; };
  // un fichier écrit dans le cache de l'application → son adresse file:// (celle que Share attend)
  var poserEnCache = function (blob, nom) {
    return base64(blob).then(function (b64) {
      return Fs.writeFile({ path: 'partage/' + nomSur(nom), data: b64, directory: 'CACHE', recursive: true });
    }).then(function (r) { return r && r.uri; });
  };
  var annule = function (e) { return /cancel|annul|abort/i.test(String((e && (e.message || e.code || e.errorMessage)) || e)); };
  var erreurDOM = function (m, nom) { try { return new DOMException(m, nom); } catch (x) { var e = new Error(m); e.name = nom; return e; } };

  /* ---------- 1. les fichiers que le jeu « remet au navigateur » ---------- */
  if (Fs && Sh) {
    // les blobs que la page a nommés : le lien du jeu est révoqué cinq secondes après le clic, le blob reste lisible ici
    var blobs = new Map(), creer = URL.createObjectURL, revoquer = URL.revokeObjectURL;
    URL.createObjectURL = function (o) { var u = creer.apply(URL, arguments); try { if (o instanceof Blob) blobs.set(u, o); } catch (e) { /* rien à retenir */ } return u; };
    URL.revokeObjectURL = function (u) { setTimeout(function () { blobs.delete(u); }, 60000); return revoquer.apply(URL, arguments); };
    var remettre = function (nom, href) {
      var b = blobs.get(href), lu = b ? Promise.resolve(b) : fetch(href).then(function (r) { return r.blob(); });
      note('fichier : ' + nom);
      return lu.then(function (blob) { return poserEnCache(blob, nom); })
        .then(function (uri) { note('fichier écrit : ' + uri); return Sh.share({ title: nom, files: [uri], dialogTitle: nom }); })
        .then(function () { note('fichier partagé : ' + nom); }, function (e) { note((annule(e) ? 'fichier : partage annulé — ' : 'fichier : échec — ') + String((e && e.message) || e)); });
    };
    var clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      var nom = this.getAttribute('download'), href = this.href || '';
      if (nom !== null && /^(blob|data):/.test(href)) { PONT.dernier = remettre(nom || 'isnad', href); return; }
      return clic.apply(this, arguments);
    };
  }

  /* ---------- 2. navigator.share, navigator.canShare ---------- */
  if (Sh) {
    var peut = function (d) {
      if (!d || typeof d !== 'object') return false;
      var f = d.files ? Array.prototype.slice.call(d.files) : [];
      if (f.length) return !!Fs && f.every(function (x) { return x instanceof Blob; });
      return !!(d.text || d.url || d.title);
    };
    var partager = function (d) {
      if (!peut(d)) return Promise.reject(erreurDOM('Rien à partager.', 'TypeError'));
      var f = d.files ? Array.prototype.slice.call(d.files) : [];
      note('partage : ' + (f.length ? f.length + ' fichier(s)' : 'texte'));
      return Promise.all(f.map(function (x) { return poserEnCache(x, x.name || 'isnad.png'); }))
        .then(function (uris) {
          var o = { dialogTitle: d.title || undefined };
          if (d.title) o.title = d.title; if (d.text) o.text = d.text; if (d.url) o.url = d.url; if (uris.length) o.files = uris;
          return Sh.share(o);
        })
        .then(function () { note('partage transmis'); },
          function (e) { if (annule(e)) { note('partage annulé'); throw erreurDOM('Partage annulé.', 'AbortError'); } note('partage refusé : ' + String((e && e.message) || e)); throw erreurDOM(String((e && e.message) || 'Partage impossible.'), 'NotAllowedError'); });
    };
    try {
      Object.defineProperty(navigator, 'share', { value: partager, configurable: true, writable: true });
      Object.defineProperty(navigator, 'canShare', { value: peut, configurable: true, writable: true });
    } catch (e) { note('navigator.share n’a pas pu être posé : ' + e.message); }
  }

  /* ---------- 3. le bouton Retour ---------- */
  if (App) {
    try {
      App.addListener('backButton', function () {
        var I = window.ISNAD;
        note('retour');
        if (I && I.input && typeof I.input.emit === 'function') I.input.emit('cancel');   // Échap : revenir d'un cran
      });
    } catch (e) { note('Retour : ' + e.message); }
  }

  /* ---------- 4. la partie à l'abri ---------- */
  var stock = null; try { stock = window.localStorage; } catch (e) { stock = null; }
  var cles = function () { var L = []; try { for (var i = 0; i < stock.length; i++) { var k = stock.key(i); if (k && k.indexOf(PREFIXE) === 0) L.push(k); } } catch (e) { /* stockage refusé */ } return L; };
  var pret = true, attente = null;   // pret : le jeu peut lire ses parties
  if (Fs && stock) {
    var tour = 0, minuterie = null, remise = false;
    var ecrireAbri = function () {
      minuterie = null; var o = {};
      cles().forEach(function (k) { try { o[k] = stock.getItem(k); } catch (e) { /* ignorée */ } });
      var f = FICHIERS[tour++ % 2], txt = JSON.stringify({ isnad: 'abri', format: 1, quand: Date.now(), cles: o });
      return Fs.writeFile({ path: f, data: txt, directory: 'DATA', encoding: 'utf8' })
        .then(function () { PONT.abri.ecrits++; PONT.abri.fichier = f; }, function (e) { note('abri : écriture refusée — ' + String((e && e.message) || e)); });
    };
    var plusTard = function () { if (remise) return; if (minuterie) clearTimeout(minuterie); minuterie = setTimeout(ecrireAbri, DELAI); };
    var maintenant = function () { if (minuterie) { clearTimeout(minuterie); return ecrireAbri(); } return null; };
    PONT.abri.maintenant = maintenant;
    var S = Storage.prototype, poser = S.setItem, oter = S.removeItem, vider = S.clear;
    var garde = function (that, k) { return that === stock && (k === undefined || String(k).indexOf(PREFIXE) === 0); };
    S.setItem = function (k) { var r = poser.apply(this, arguments); if (garde(this, k)) plusTard(); return r; };
    S.removeItem = function (k) { var r = oter.apply(this, arguments); if (garde(this, k)) plusTard(); return r; };
    S.clear = function () { var r = vider.apply(this, arguments); if (garde(this)) plusTard(); return r; };
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') maintenant(); });
    if (App) { try { App.addListener('pause', function () { maintenant(); }); } catch (e) { /* sans pause : le délai suffit */ } }

    if (!cles().length) {
      // rien sur l'appareil : on cherche l'abri, et le jeu attend (au plus ATTENTE_MAX) avant de lire ses parties
      pret = false; remise = true;
      var lire = function (f) { return Fs.readFile({ path: f, directory: 'DATA', encoding: 'utf8' }).then(function (r) { var d = JSON.parse(r.data); return d && d.isnad === 'abri' && d.cles && typeof d.cles === 'object' ? d : null; }, function () { return null; }).catch(function () { return null; }); };
      var delai = new Promise(function (res) { setTimeout(function () { res('délai'); }, ATTENTE_MAX); });
      attente = Promise.race([Promise.all(FICHIERS.map(lire)), delai]).then(function (L) {
        if (L === 'délai') { note('abri : délai dépassé, le jeu démarre sans'); return; }
        var d = L.filter(Boolean).sort(function (a, b) { return (b.quand || 0) - (a.quand || 0); })[0];
        if (!d) { note('abri : aucun'); return; }
        var n = 0; Object.keys(d.cles).forEach(function (k) { if (k.indexOf(PREFIXE) === 0 && typeof d.cles[k] === 'string') { try { poser.call(stock, k, d.cles[k]); n++; PONT.abri.cles.push(k); } catch (e) { /* plein */ } } });
        PONT.abri.remis = n; note('abri : ' + n + ' clé(s) remise(s), gardées le ' + new Date(d.quand || 0).toISOString());
      }).catch(function (e) { note('abri : ' + String((e && e.message) || e)); })
        .then(function () { remise = false; pret = true; PONT.ordre.push('abri'); });
    } else note('abri : le stockage a ' + cles().length + ' clé(s), rien à remettre');
  }

  /* ---------- le démarrage du jeu attend le pont ----------
     Le jeu crée window.ISNAD (base.js), puis ISNAD.ui (ui.js), puis ISNAD.ui.boot, et sa dernière ligne l'appelle. On
     reçoit chacun au passage (une seule fois, puis la propriété redevient ordinaire) pour envelopper boot : si le pont est
     prêt, boot s'exécute aussitôt, dans le même appel ; sinon, dès que l'abri est remis. L'outil d'assemblage vérifie que
     le jeu a toujours cette forme. */
  var ordinaire = function (o, k, v) { Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: true }); };
  var guetter = function (o, k, recu) {
    var v; Object.defineProperty(o, k, { configurable: true, enumerable: true, get: function () { return v; }, set: function (x) { v = x; ordinaire(o, k, x); if (x && (typeof x === 'object' || typeof x === 'function')) recu(x); } });
  };
  guetter(window, 'ISNAD', function (I) {
    guetter(I, 'ui', function (U) {
      guetter(U, 'boot', function (vrai) {
        PONT.demarrageGuette = true;
        ordinaire(U, 'boot', function () {
          var soi = this, a = arguments;
          if (pret) { PONT.demarre = 'aussitôt'; PONT.ordre.push('démarrage'); return vrai.apply(soi, a); }
          PONT.demarre = 'après l’abri'; note('démarrage : attend l’abri');
          attente.then(function () { PONT.ordre.push('démarrage'); vrai.apply(soi, a); });
        });
      });
    });
  });
})();
