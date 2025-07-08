#!/bin/bash
set -euxo pipefail

# Install dependencies
sudo dnf update -y
sudo dnf install -y git nodejs

# Clone the frontend repo
git clone ${repo_url} ${app_path}
cd ${app_path}

# Build the frontend
npm install
npm run build

# Install Caddy
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable @caddy/caddy -y
sudo dnf install -y caddy

# Configure Caddy
sudo cp ${app_path}/Caddyfile /etc/caddy/Caddyfile
sudo chown root:root /etc/caddy/Caddyfile
sudo chmod 644 /etc/caddy/Caddyfile

# Enable and start Caddy
sudo systemctl enable caddy
sudo systemctl restart caddy