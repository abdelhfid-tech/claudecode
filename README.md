# 🚀 Application Web pour Hostinger

Une application web moderne, responsive et optimisée, prête à être déployée sur Hostinger.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Installation Locale](#installation-locale)
- [Déploiement sur Hostinger](#déploiement-sur-hostinger)
- [Technologies Utilisées](#technologies-utilisées)
- [Optimisations](#optimisations)
- [Support](#support)

## 🎯 Aperçu

Cette application web est conçue pour être facilement déployée sur un hébergement Hostinger. Elle inclut toutes les configurations et optimisations nécessaires pour des performances optimales.

### Caractéristiques principales:

- 🎨 Design moderne et responsive
- ⚡ Performance optimisée (compression Gzip, cache navigateur)
- 🔒 Sécurité renforcée (headers de sécurité, HTTPS)
- 📱 Compatible tous appareils (mobile, tablette, desktop)
- ♿ Accessible et SEO-friendly
- 🚀 Prêt pour la production

## ✨ Fonctionnalités

- **Navigation fluide**: Menu responsive avec hamburger pour mobile
- **Sections modulaires**: Hero, Features, Contact
- **Formulaire de contact**: Avec validation côté client
- **Animations**: Transitions et animations CSS modernes
- **Pages d'erreur**: 404 et 500 personnalisées
- **Configuration Apache**: .htaccess optimisé pour Hostinger

## 📁 Structure du Projet

```
claudecode/
├── index.html                  # Page principale
├── 404.html                    # Page d'erreur 404
├── 500.html                    # Page d'erreur 500
├── .htaccess                   # Configuration Apache
├── .gitignore                  # Fichiers à ignorer
├── deploy.sh                   # Script de déploiement
├── css/
│   └── styles.css             # Feuilles de style
├── js/
│   └── script.js              # Scripts JavaScript
├── images/                     # Dossier pour les images
├── DEPLOIEMENT_HOSTINGER.md   # Guide de déploiement détaillé
└── README.md                   # Ce fichier
```

## 💻 Installation Locale

### Prérequis

- Un navigateur web moderne
- (Optionnel) Un serveur local comme [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/claudecode.git
   cd claudecode
   ```

2. **Ouvrir le projet**
   - Méthode 1: Ouvrir `index.html` directement dans votre navigateur
   - Méthode 2: Utiliser Live Server (VS Code)
   - Méthode 3: Utiliser Python
     ```bash
     # Python 3
     python -m http.server 8000

     # Puis visiter http://localhost:8000
     ```

3. **Développer**
   - Modifiez les fichiers selon vos besoins
   - Les changements sont visibles immédiatement

## 🌐 Déploiement sur Hostinger

### Méthode Rapide (FTP)

1. **Obtenir les identifiants FTP**
   - Connectez-vous à votre hPanel Hostinger
   - Allez dans **Fichiers > Comptes FTP**
   - Notez vos identifiants

2. **Télécharger FileZilla**
   - https://filezilla-project.org/

3. **Transférer les fichiers**
   - Connectez-vous avec FileZilla
   - Naviguez vers `public_html`
   - Uploadez tous les fichiers du projet

### Méthode Automatique (Git)

1. **Configurer SSH sur Hostinger**
   - hPanel > Avancé > SSH Access
   - Activez l'accès SSH

2. **Cloner sur le serveur**
   ```bash
   ssh u123456789@votredomaine.com -p 65002
   cd domains/votredomaine.com/public_html
   git clone https://github.com/votre-utilisateur/claudecode.git .
   ```

3. **Utiliser le script de déploiement**

   Éditez `deploy.sh` avec vos informations:
   ```bash
   # Configuration
   SSH_USER="votre_utilisateur"
   SSH_HOST="votredomaine.com"
   SSH_PORT="65002"
   REMOTE_PATH="domains/votredomaine.com/public_html"
   ```

   Puis exécutez:
   ```bash
   ./deploy.sh
   ```

### 📖 Guide Complet

Pour des instructions détaillées, consultez [DEPLOIEMENT_HOSTINGER.md](DEPLOIEMENT_HOSTINGER.md)

## 🛠 Technologies Utilisées

### Frontend
- **HTML5**: Structure sémantique
- **CSS3**:
  - Variables CSS
  - Flexbox & Grid
  - Animations et transitions
  - Media queries pour le responsive
- **JavaScript (Vanilla)**:
  - Manipulation du DOM
  - Événements
  - Validation de formulaire
  - Intersection Observer API

### Configuration
- **Apache (.htaccess)**:
  - Redirection HTTPS
  - Compression Gzip
  - Cache navigateur
  - Headers de sécurité
- **Git**: Gestion de version

## ⚡ Optimisations

### Performance
- ✅ Compression Gzip activée
- ✅ Cache navigateur configuré
- ✅ CSS et JS optimisés
- ✅ Images optimisables (WebP recommandé)

### Sécurité
- ✅ Headers de sécurité (X-Frame-Options, CSP, etc.)
- ✅ HTTPS forcé
- ✅ Protection XSS
- ✅ Fichiers sensibles protégés

### SEO
- ✅ Balises meta
- ✅ Structure sémantique HTML5
- ✅ URLs propres
- ✅ Sitemap compatible

## 📊 Tester les Performances

Après déploiement, testez votre site avec:

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

## 🔧 Personnalisation

### Modifier les Couleurs

Éditez les variables CSS dans `css/styles.css`:

```css
:root {
    --primary-color: #6366f1;    /* Couleur principale */
    --secondary-color: #8b5cf6;  /* Couleur secondaire */
    --dark-color: #1e293b;       /* Texte foncé */
    --light-color: #f8fafc;      /* Fond clair */
}
```

### Ajouter des Pages

1. Créez un nouveau fichier HTML (ex: `about.html`)
2. Copiez la structure de `index.html`
3. Ajoutez un lien dans la navigation:

```html
<li><a href="about.html" class="nav-link">À propos</a></li>
```

### Ajouter du PHP

Hostinger supporte PHP. Pour ajouter du traitement côté serveur:

1. Renommez `index.html` en `index.php`
2. Ajoutez votre code PHP:

```php
<?php
// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Envoyer un email, sauvegarder en base, etc.
}
?>
```

## 🆘 Support

### Documentation Hostinger
- Guide d'utilisation: https://support.hostinger.com
- Tutoriels: https://www.hostinger.com/tutorials

### Problèmes Courants

**Q: Mon site n'affiche pas le CSS**
```
R: Vérifiez les chemins dans index.html
   Videz le cache: Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)
```

**Q: Le SSL ne fonctionne pas**
```
R: Attendez jusqu'à 24h pour la propagation DNS
   Vérifiez dans hPanel > SSL que le certificat est installé
```

**Q: Erreur 500**
```
R: Vérifiez le fichier .htaccess
   Vérifiez les permissions des fichiers (644)
   Consultez les logs d'erreur dans hPanel
```

## 📝 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser et le modifier.

## 🤝 Contribution

Les contributions sont les bienvenues!

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Développé avec ❤️ pour Hostinger**

🌟 **N'oubliez pas de mettre une étoile si ce projet vous a aidé!**
