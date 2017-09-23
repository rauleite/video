#!/bin/bash
echo "level 2 - Van Chase"
add_ppa () {
    grep ^ /etc/apt/sources.list /etc/apt/sources.list.d/* | grep $1 > /dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "[ PPA ] + $1"
        add-apt-repository ppa:$1
    return 0 
    else
        echo '[ PPA ] Ja existe'
        return 1
    fi
}
update () {
    echo 'Espedando archive.ubuntu.com (Se demorar 1 minuto pode dar Ctrl^C, e comentar a linha de update do script)'
    until ping -c1 archive.ubuntu.com &>/dev/null; do :; done
    until ping -c1 security.ubuntu.com &>/dev/null; do :; done
    apt-get update
}
sleep 3
### ADD REPO ### -------------------
add_ppa ppa:chris-lea/redis-server

### Update inicial ###
update
apt-get -y upgrade
### ifconfig ###
apt-get install -y net-tools 
### add-apt-repository ###
apt-get install -y software-properties-common
### essentials ###
apt-get install -y wget
apt-get install -y git
apt-get install -y nano
apt-get install -y curl
apt-get install -y ufw
apt-get install -y openssh-server

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
