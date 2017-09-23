#!/bin/bash
now=$(date +%Y%m%d_%H%M%S)
tmp="/tmp"
tar_www="www/config"
tart_server="server/config"
tar_basename="config.tar.gz"
gpg_config="$tar_basename""_$now.gpg"

echo "está na raiz do projeto?" [Yn]
read ok
[[ $ok =~ ^[nN][[:blank:]]*$ ]] && exit 0

function instalar_rclone () {

    read instalar
    [[ $instalar =~ ^[nN][[:blank:]]*$ ]] && exit 0 
    echo "https://rclone.org/install/"

    curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip
    unzip rclone-current-linux-amd64.zip
    cd rclone-*-linux-amd64

    sudo cp rclone /usr/bin/
    sudo chown root:root /usr/bin/rclone
    sudo chmod 755 /usr/bin/rclone

    sudo mkdir -p /usr/local/share/man/man1
    sudo cp rclone.1 /usr/local/share/man/man1/
    sudo mandb 

    rclone config

    cd ../ && rm -r rclone-*-linux-amd64*
}

( /usr/bin/rclone -V &>/dev/null || rclone -V &>/dev/null ) \
    || ( echo "Não há rclone deseja instalar ultima versao? [Yn]" && instalar_rclone )

sudo tar -zcvf $tmp/$tar_basename  $tart_server $tar_www

gpg2 --output $tmp/$gpg_config --symmetric --cipher-algo AES256 $tmp/$tar_basename || ( echo "Falha em GPG" && exit 0 )

rclone -v copy $tmp/$gpg_config remote:Projetos/access/videoaulas/Arquivos || ( echo "Falha em rclone" && exit 0 )

