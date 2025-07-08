#!/bin/bash
set -euxo pipefail

# Create web root
sudo mkdir -p ${app_path}/dist
sudo chown -R ec2-user:ec2-user ${app_path}

# Install Caddy
sudo dnf install -y curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/pki/rpm-gpg/RPM-GPG-KEY-caddy-stable
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/rpm.repo' | sudo tee /etc/yum.repos.d/caddy-stable.repo
sudo dnf install -y caddy

# Enable Caddy
sudo systemctl enable caddy
