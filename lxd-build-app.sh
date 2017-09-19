#!/bin/bash

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

### Add repos ###
add_ppa ondrej/nginx-mainline
add_ppa chris-lea/redis-server
### Yarn Repo ###
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
### Node preparacao ###
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
update

### INSTALLS ### --------------------
### nvm ### 
#(Retirado por problemas com versao do node
# setado no engine dos package.json e problemas por nao ficar em /bin/bash )
# wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
# export NVM_DIR=~/.nvm
# source ~/.nvm/nvm.sh
# nvm install 8
# nvm alias default 8
# nvm use 8
# ############

apt-get install -y nodejs
apt-get install -y yarn
apt-get install -y nginx
apt-get install -y redis-server
### netdata ###
apt-get install -y zlib1g-dev uuid-dev libmnl-dev gcc make git autoconf autoconf-archive autogen automake pkg-config curl
netdata_dir="/$USER/netdata"
[ ! -d $netdata_dir ] && git clone https://github.com/firehol/netdata.git --depth=1 $netdata_dir && cd $netdata_dir && ./netdata-installer.sh --dont-wait
echo "[ node ] $(node --version)"
echo "[ yarn ] $(yarn --version)"
echo "[ redis-server ] $(redis-server --version)"
echo "[ nginx ] $(nginx -v)"
echo "[ netdata ] $(netdata -v)"