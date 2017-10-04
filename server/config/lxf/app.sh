#!/bin/bash
# Estara na mesma raiz remota (também)
source ./z-src.sh

### ADD REPO ### -------------------
### nginx ###
add_ppa ondrej/nginx-mainline
### yarn ###
until_host_ping "dl.yarnpkg.com"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

update

### INSTALLS ### --------------------
# ### netdata ###
# instala_netdata
### node ###
exists "node"
if [[ $? != 0 ]]
then
    cd ~ && \
        sudo rm -r n &>/dev/null 
        git clone https://github.com/tj/n.git && \
        cd n && \
            sudo make install 
            # Resolve problema de acesso primeira vez
            sudo n ls &>/dev/null
            sudo n 8.5.0
fi
# Update npm
sudo npm i -g npm

exists "yarn"
if [[ $? != 0 ]]
then
    until_host "https://dl.yarnpkg.com/debian/"
    sudo apt-get install -y yarn
fi

sudo apt-get install -y nginx

### redis ###
exists "redis-server"
if [[  $? != 0 ]]
then
    sudo apt-get install -y tcl8.5
    cd ~ && sudo wget http://download.redis.io/releases/redis-stable.tar.gz
    cd ~ && \
        sudo tar -xzf redis-stable.tar.gz && \
        cd redis-stable && \
            sudo make && \
            sudo make test && \
            sudo make install && \
            cd utils && \
                echo -n | sudo ./install_server.sh
fi

sudo service redis_6379 start
sudo service redis_6379 stop

### PM2 ###
exists "pm2"
if [[  $? != 0 ]]
then
    sudo npm install pm2@latest -g
fi

update
sudo apt -y autoremove

# Habilita on startup
sudo systemctl enable nginx.service
sudo systemctl enable redis-server.service
# sudo systemctl enable netdata.service
sudo systemctl enable ufw.service

sudo chown $USER:$(id -gn $USER) /home/$USER/*
sudo chown $USER:$(id -gn $USER) /home/$USER/.*
sudo chmod g+s /home/$USER

echo "USER -> $USER"

echo "-----------------------------------------"
echo "[ node ]          $(node --version)"
echo "[ yarn ]          $(yarn --version)"
echo "[ pm2 ]           $(sudo pm2 -v)"
echo "[ redis-server ]  $(sudo redis-server --version)"
echo "[ nginx ]         $(nginx -v)"
# echo "[ netdata ]       $(netdata -v)"
echo "[ ufw ]           $(ufw --version)"
echo "-----------------------------------------"