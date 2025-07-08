#!/bin/bash
set -euxo pipefail

# Update system and install required tools
sudo apt-get update -y
sudo apt-get install -y curl gnupg2 ca-certificates lsb-release debian-archive-keyring

# Create web root
sudo mkdir -p ${app_path}/dist
sudo chown -R ubuntu:ubuntu ${app_path}

# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/ubuntu jammy main" | \
  sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update -y
sudo apt-get install -y caddy

# Enable Caddy
sudo systemctl enable caddy
