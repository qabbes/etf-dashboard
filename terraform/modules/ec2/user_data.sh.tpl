#!/bin/bash
set -euxo pipefail

# Update system and install required tools
sudo apt-get update -y
sudo apt-get install -y curl gnupg2 ca-certificates lsb-release debian-archive-keyring

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Get specific version
sudo npm install -g n
sudo n 20.11.1
node -v && npm -v 


# Create web root
sudo mkdir -p ${app_path}
sudo chown -R ubuntu:ubuntu ${app_path}
sudo chmod 755 ${app_path}

# Tell Git to trust this directory 
export GIT_CONFIG_GLOBAL=/home/ubuntu/.gitconfig
sudo -u ubuntu bash -c "cd ${app_path} && git init && \
  git config --global --add safe.directory '${app_path}' && \
  GIT_CONFIG_SYSTEM=/dev/null git remote add origin ${repo_url} && \
  GIT_CONFIG_SYSTEM=/dev/null git sparse-checkout init --cone && \
  GIT_CONFIG_SYSTEM=/dev/null git sparse-checkout set frontend && \
  GIT_CONFIG_SYSTEM=/dev/null git pull origin main"

# # Install dependencies and build
cd ${app_path}/frontend
npm ci
npm run build
# For future builds, allow ubuntu to modify files to rsync
sudo chown -R ubuntu:ubuntu /home/ubuntu/etf-tracker/frontend/dist

# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/ubuntu jammy main" | \
  sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update -y
sudo apt-get install -y caddy

sudo cp ${app_path}/frontend/Caddyfile /etc/caddy/Caddyfile

# Restart and enable Caddy
sudo systemctl enable caddy
sudo systemctl restart caddy
