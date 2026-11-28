#!/usr/bin/env bash
# Installe (ou met à jour) le radar sur un serveur Ubuntu ou Debian, par exemple un VPS Hostinger.
#   - code dans /opt/radar-decalage (copie du dépôt public, mise à jour en relançant ce script) ;
#   - données dans /var/lib/radar-decalage, jamais sur GitHub (dépôt public) ;
#   - collecte par cron sous un utilisateur système dédié « radar », sans droits d'administration.
# Usage : sudo bash install.sh        (relancer le même script pour mettre à jour)
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/abdelhfid-tech/claudecode.git}"
BRANCH="${BRANCH:-claude/social-trends-europe-francophonie-qqsste}"
APP_DIR=/opt/radar-decalage
DATA_DIR=/var/lib/radar-decalage
LOG_DIR=/var/log/radar-decalage
ENV_FILE=/etc/radar-decalage.env
RUN_USER=radar

if [ "$(id -u)" -ne 0 ]; then echo "Lancez ce script en administrateur : sudo bash install.sh" >&2; exit 1; fi
command -v git >/dev/null 2>&1 || { apt-get update -qq && apt-get install -y -qq git; }
[ -d /etc/cron.d ] && command -v cron >/dev/null 2>&1 || { apt-get update -qq && apt-get install -y -qq cron; }
# Python 3.11 ou plus (Ubuntu 22.04 n'a que 3.10 par défaut : python3.11 y est installé à côté).
has_python() {
  for py in python3.13 python3.12 python3.11 python3; do
    command -v "$py" >/dev/null 2>&1 && "$py" -c 'import sys; sys.exit(sys.version_info < (3, 11))' && return 0
  done
  return 1
}
has_python || { apt-get update -qq && { apt-get install -y -qq python3.11 || apt-get install -y -qq python3; }; }
has_python || { echo "Python 3.11 ou plus est requis et n'a pas pu être installé." >&2; exit 1; }

id -u "$RUN_USER" >/dev/null 2>&1 || useradd --system --home-dir "$DATA_DIR" --shell /usr/sbin/nologin "$RUN_USER"

if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch -q --depth 1 origin "$BRANCH"
  git -C "$APP_DIR" checkout -q --force FETCH_HEAD
  echo "Code mis à jour : $(git -C "$APP_DIR" log -1 --format='%h %s')"
else
  git clone -q --depth 1 --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  echo "Code installé : $(git -C "$APP_DIR" log -1 --format='%h %s')"
fi

install -d -m 750 -o "$RUN_USER" -g "$RUN_USER" "$DATA_DIR"
install -d -m 750 -o "$RUN_USER" -g "$RUN_USER" "$LOG_DIR"
[ -f "$ENV_FILE" ] || install -m 640 -o root -g "$RUN_USER" "$APP_DIR/deploy/hostinger/radar.env.example" "$ENV_FILE"
[ -f "$DATA_DIR/profile.toml" ] || install -m 640 -o "$RUN_USER" -g "$RUN_USER" \
  "$APP_DIR/plugins/radar-decalage/config/profile.example.toml" "$DATA_DIR/profile.toml"

install -m 755 "$APP_DIR/deploy/hostinger/radar-run" /usr/local/bin/radar-run
install -m 644 "$APP_DIR/deploy/hostinger/radar-decalage.cron" /etc/cron.d/radar-decalage
install -m 644 "$APP_DIR/deploy/hostinger/radar-decalage.logrotate" /etc/logrotate.d/radar-decalage

echo
echo "Vérifications :"
sudo -u "$RUN_USER" /usr/local/bin/radar-run rules
sudo -u "$RUN_USER" /usr/local/bin/radar-run sources | sed 's/^/  /'
echo
echo "Installation terminée. Collecte chaque jour à 05:17 (heure du serveur), tendances toutes les 2 heures."
echo "  Premier relevé tout de suite (environ 15 min) : sudo -u $RUN_USER radar-run collect"
echo "  État du pilote de 14 jours                   : sudo -u $RUN_USER radar-run health"
echo "  Réglages (webhook n8n)                       : sudo nano $ENV_FILE"
