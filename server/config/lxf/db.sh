#!/bin/bash
source /dest-src/z-src.sh

essentials

### ADD REPO ### -------------------
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

update

### INSTALLS ####
### Mongo ###
sudo apt-get install -y mongodb-org

# Habilita on startup
sudo systemctl enable mongod.service
# systemctl enable ssh.service
sudo systemctl enable ufw.service

sudo service mongod restart

echo "[ mongo ]     $(mongo --version)"
echo "[ netdata ]   $(netdata -v)"
echo "[ ufw ]       $(ufw --version)"
