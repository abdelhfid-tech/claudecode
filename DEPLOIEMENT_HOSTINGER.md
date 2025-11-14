# Guide de Déploiement sur Hostinger

Ce guide vous explique comment déployer votre application web sur Hostinger de différentes manières.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Méthode 1: Déploiement via FTP](#méthode-1-déploiement-via-ftp)
3. [Méthode 2: Déploiement via Git](#méthode-2-déploiement-via-git)
4. [Méthode 3: Gestionnaire de Fichiers Hostinger](#méthode-3-gestionnaire-de-fichiers-hostinger)
5. [Configuration DNS et SSL](#configuration-dns-et-ssl)
6. [Optimisations](#optimisations)

---

## Prérequis

- Un compte Hostinger actif avec un plan d'hébergement
- Accès à votre panneau de contrôle Hostinger (hPanel)
- Un nom de domaine configuré (ou sous-domaine)

---

## Méthode 1: Déploiement via FTP

### 1.1 Récupérer les Identifiants FTP

1. Connectez-vous à votre **hPanel Hostinger**
2. Allez dans **Fichiers > Comptes FTP**
3. Notez vos identifiants:
   - Hôte FTP: `ftp.votredomaine.com`
   - Nom d'utilisateur: `u123456789`
   - Port: `21`

### 1.2 Installer un Client FTP

Téléchargez et installez **FileZilla** (gratuit):
- Site officiel: https://filezilla-project.org/

### 1.3 Se Connecter et Transférer les Fichiers

1. Ouvrez FileZilla
2. Entrez vos identifiants FTP:
   - Hôte: `ftp.votredomaine.com`
   - Utilisateur: votre nom d'utilisateur
   - Mot de passe: votre mot de passe
   - Port: `21`
3. Cliquez sur **Connexion rapide**

4. **Important**: Naviguez vers le dossier `public_html` sur le serveur distant

5. Transférez tous les fichiers de votre projet:
   ```
   index.html
   css/
   js/
   images/
   ```

6. **Structure sur le serveur**:
   ```
   public_html/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── script.js
   └── images/
   ```

---

## Méthode 2: Déploiement via Git

### 2.1 Activer Git sur Hostinger

1. Connectez-vous à **hPanel**
2. Allez dans **Avancé > SSH Access**
3. Activez l'accès SSH
4. Notez vos identifiants SSH

### 2.2 Se Connecter en SSH

```bash
ssh u123456789@votredomaine.com -p 65002
```

### 2.3 Cloner votre Dépôt Git

```bash
cd domains/votredomaine.com/public_html

# Cloner votre dépôt
git clone https://github.com/votre-utilisateur/votre-repo.git .

# Ou si déjà cloné, faire un pull
git pull origin main
```

### 2.4 Script de Déploiement Automatique

Créez un script `deploy.sh` dans votre projet local:

```bash
#!/bin/bash

echo "🚀 Déploiement sur Hostinger..."

# Pousser les changements sur GitHub
git add .
git commit -m "Déploiement: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

# Se connecter en SSH et mettre à jour
ssh u123456789@votredomaine.com -p 65002 << 'ENDSSH'
cd domains/votredomaine.com/public_html
git pull origin main
echo "✅ Déploiement terminé!"
ENDSSH
```

Rendez-le exécutable:
```bash
chmod +x deploy.sh
```

Utilisez-le:
```bash
./deploy.sh
```

---

## Méthode 3: Gestionnaire de Fichiers Hostinger

### 3.1 Via le Gestionnaire de Fichiers Web

1. Connectez-vous à **hPanel**
2. Allez dans **Fichiers > Gestionnaire de fichiers**
3. Naviguez vers `public_html`
4. Utilisez le bouton **Téléverser** pour uploader vos fichiers
5. Vous pouvez aussi créer une archive ZIP et l'uploader, puis l'extraire

### 3.2 Upload via ZIP

```bash
# Sur votre machine locale
zip -r monapp.zip index.html css/ js/ images/
```

Ensuite:
1. Uploadez `monapp.zip` dans `public_html`
2. Clic droit > **Extraire**
3. Supprimez le fichier ZIP

---

## Configuration DNS et SSL

### 4.1 Configurer votre Domaine

1. Dans **hPanel**, allez dans **Domaines**
2. Cliquez sur **Gérer** à côté de votre domaine
3. Vérifiez que le domaine pointe vers votre hébergement

### 4.2 Activer SSL (HTTPS)

1. Dans **hPanel**, allez dans **Sécurité > SSL**
2. Sélectionnez votre domaine
3. Cliquez sur **Installer SSL** (gratuit avec Let's Encrypt)
4. Attendez 5-10 minutes pour la propagation

### 4.3 Forcer HTTPS

Créez un fichier `.htaccess` dans `public_html`:

```apache
# Forcer HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compression Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache du navigateur
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

---

## Optimisations

### 5.1 Optimisation des Images

Avant de déployer, optimisez vos images:
- Utilisez **TinyPNG** ou **ImageOptim**
- Convertissez en WebP pour de meilleures performances
- Utilisez des images responsive

### 5.2 Minification

Minifiez vos fichiers CSS et JavaScript:

```bash
# Installer les outils
npm install -g clean-css-cli uglify-js

# Minifier CSS
cleancss -o css/styles.min.css css/styles.css

# Minifier JS
uglifyjs js/script.js -o js/script.min.js
```

Puis mettez à jour vos références dans `index.html`:
```html
<link rel="stylesheet" href="css/styles.min.css">
<script src="js/script.min.js"></script>
```

### 5.3 CDN Cloudflare (Optionnel)

1. Créez un compte Cloudflare gratuit
2. Ajoutez votre domaine
3. Changez les nameservers de votre domaine
4. Activez le cache et la compression

---

## Vérification du Déploiement

Après le déploiement, vérifiez:

1. **Accessibilité**: Visitez `https://votredomaine.com`
2. **SSL**: Vérifiez le cadenas dans la barre d'adresse
3. **Console**: Ouvrez la console développeur (F12) pour vérifier les erreurs
4. **Mobile**: Testez sur différents appareils
5. **Performance**: Utilisez [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Dépannage

### Problème: Page blanche

- Vérifiez que `index.html` est bien dans `public_html`
- Vérifiez les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)

### Problème: CSS/JS ne se chargent pas

- Vérifiez les chemins dans `index.html`
- Videz le cache du navigateur (Ctrl + F5)
- Vérifiez la console pour les erreurs 404

### Problème: SSL ne fonctionne pas

- Attendez jusqu'à 24h pour la propagation DNS
- Videz le cache DNS: `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (Mac)

---

## Maintenance

### Mises à Jour Régulières

1. Faites vos modifications en local
2. Testez dans votre navigateur
3. Poussez sur Git ou uploadez via FTP
4. Vérifiez le site en production

### Sauvegardes

1. Dans **hPanel**, allez dans **Fichiers > Sauvegardes**
2. Créez des sauvegardes régulières
3. Téléchargez-les sur votre machine locale

---

## Support

- **Documentation Hostinger**: https://support.hostinger.com
- **Tutoriels**: https://www.hostinger.com/tutorials
- **Support 24/7**: Via le chat dans hPanel

---

**Félicitations!** 🎉 Votre application web est maintenant déployée sur Hostinger!
