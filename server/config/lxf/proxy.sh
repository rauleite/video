#!/bin/bash
source ./z-src.sh

essentials

### ADD REPO ### -------------------
add_ppa ppa:chris-lea/redis-server

# installs    
apt-get install -y haproxy
apt-get install -y redis-server
apt-get install -y ufw

# Habilita on startup
systemctl enable haproxy.service
systemctl enable redis-server.service
systemctl enable ufw.service

echo "[ haproxy ]   $(haproxy -v)"
echo "[ redis ]     $(redis-server -v)"
echo "[ ufw ]       $(ufw --version)"
