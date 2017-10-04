#!/bin/bash
source ./z-src.sh

# installs
exists "haproxy"
if [[ $? != 0 ]]
then
    sudo apt-get install -y haproxy
fi

exists "ufw"
if [[ $? != 0 ]]
then
    sudo apt-get install -y ufw
fi

# Habilita on startup
sudo systemctl enable haproxy.service
sudo systemctl enable ufw.service

echo "[ haproxy ]   $(haproxy -v)"
echo "[ ufw ]       $(ufw --version)"
