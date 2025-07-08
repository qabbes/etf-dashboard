#!/bin/bash
set -euxo pipefail

# update dependencies
sudo dnf update -y

# Install Caddy
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable @caddy/caddy -y
sudo dnf install -y caddy

# Create web root
sudo mkdir -p ${app_path}/dist

# Configure Caddy
sudo cp ${app_path}/Caddyfile /etc/caddy/Caddyfile
sudo chown root:root /etc/caddy/Caddyfile
sudo chmod 644 /etc/caddy/Caddyfile

# Enable and start Caddy
sudo systemctl enable caddy
sudo systemctl restart caddy