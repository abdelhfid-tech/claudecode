#!/bin/bash

# ==========================================
# Script de Déploiement Automatique Hostinger
# ==========================================

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (à personnaliser)
SSH_USER="u123456789"  # Remplacez par votre utilisateur SSH
SSH_HOST="votredomaine.com"  # Remplacez par votre domaine
SSH_PORT="65002"  # Port SSH Hostinger par défaut
REMOTE_PATH="domains/votredomaine.com/public_html"  # Chemin distant

# ==========================================
# Fonctions
# ==========================================

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# ==========================================
# Vérifications
# ==========================================

print_header "🚀 Déploiement sur Hostinger"

# Vérifier que nous sommes dans un dépôt git
if [ ! -d .git ]; then
    print_error "Ce n'est pas un dépôt Git!"
    exit 1
fi

print_success "Dépôt Git détecté"

# ==========================================
# Choix du mode de déploiement
# ==========================================

echo ""
echo "Choisissez la méthode de déploiement:"
echo "1) Git (SSH) - Recommandé"
echo "2) FTP"
echo "3) Annuler"
read -p "Votre choix [1-3]: " choice

case $choice in
    1)
        # ==========================================
        # Déploiement Git
        # ==========================================
        print_header "📦 Déploiement via Git"

        # Vérifier les changements
        if [[ -n $(git status -s) ]]; then
            print_info "Changements détectés"
            git status -s

            # Demander confirmation
            read -p "Voulez-vous commiter ces changements? [y/N]: " commit_choice
            if [[ $commit_choice =~ ^[Yy]$ ]]; then
                read -p "Message de commit: " commit_msg
                if [ -z "$commit_msg" ]; then
                    commit_msg="Déploiement: $(date '+%Y-%m-%d %H:%M:%S')"
                fi

                git add .
                git commit -m "$commit_msg"
                print_success "Changements commités"
            fi
        else
            print_info "Aucun changement local à commiter"
        fi

        # Pousser sur origin
        print_info "Push vers le dépôt distant..."
        if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
            print_success "Push réussi"
        else
            print_error "Échec du push"
            exit 1
        fi

        # Déployer sur le serveur
        print_info "Connexion au serveur Hostinger..."
        ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << ENDSSH
            set -e
            cd $REMOTE_PATH
            echo "📥 Pull des dernières modifications..."
            git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
            echo "✅ Déploiement terminé!"
ENDSSH

        if [ $? -eq 0 ]; then
            print_success "Déploiement réussi!"
            print_info "Site accessible sur: https://$SSH_HOST"
        else
            print_error "Échec du déploiement"
            exit 1
        fi
        ;;

    2)
        # ==========================================
        # Déploiement FTP
        # ==========================================
        print_header "📤 Déploiement via FTP"

        # Vérifier si lftp est installé
        if ! command -v lftp &> /dev/null; then
            print_error "lftp n'est pas installé"
            print_info "Installez-le avec: sudo apt install lftp (Linux) ou brew install lftp (Mac)"
            exit 1
        fi

        # Demander les identifiants FTP
        read -p "Hôte FTP (ftp.votredomaine.com): " ftp_host
        read -p "Utilisateur FTP: " ftp_user
        read -s -p "Mot de passe FTP: " ftp_pass
        echo ""

        print_info "Upload des fichiers..."

        lftp -e "
            set ssl:verify-certificate no;
            open -u $ftp_user,$ftp_pass $ftp_host;
            mirror -R --verbose --delete \
                --exclude .git/ \
                --exclude .gitignore \
                --exclude deploy.sh \
                --exclude README.md \
                --exclude node_modules/ \
                ./ /public_html/;
            bye
        "

        if [ $? -eq 0 ]; then
            print_success "Upload FTP réussi!"
        else
            print_error "Échec de l'upload FTP"
            exit 1
        fi
        ;;

    3)
        print_info "Déploiement annulé"
        exit 0
        ;;

    *)
        print_error "Choix invalide"
        exit 1
        ;;
esac

# ==========================================
# Tests post-déploiement
# ==========================================

print_header "🧪 Vérification du déploiement"

# Test de connectivité
print_info "Test de connectivité..."
if curl -s -o /dev/null -w "%{http_code}" https://$SSH_HOST | grep -q "200\|301\|302"; then
    print_success "Site accessible (Code HTTP: $(curl -s -o /dev/null -w "%{http_code}" https://$SSH_HOST))"
else
    print_error "Site inaccessible"
fi

# ==========================================
# Résumé
# ==========================================

print_header "✨ Déploiement Terminé"
echo ""
echo -e "${GREEN}🌐 URL du site: https://$SSH_HOST${NC}"
echo -e "${YELLOW}📊 Testez les performances: https://pagespeed.web.dev/?url=https://$SSH_HOST${NC}"
echo ""
print_success "Bon travail! 🎉"
