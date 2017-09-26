#!/bin/bash
now=$(date +%Y%m%d_%H%M%S)
tmp="/tmp"
tar_basename="config.tar.gz"
gpg_config="$tar_basename""_$now.gpg"
remote_path_gdrive="Projetos/access/videoaulas/Arquivos"

# echo "Está na raiz do projeto? [Yn]"
# read ok
# [[ $ok =~ ^[nN][[:blank:]]*$ ]] && exit 1 || echo "Blz..."

function instalar_rclone () {
    echo "Não há rclone', deseja instalar a ultima versao e prosseguir? [Yn]"
    read instalar
    [[ $instalar =~ ^[nN][[:blank:]]*$ ]] && exit 1
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

function rollback () {
    echo "Falha em $1"
    sudo rm -vrf $tmp/$gpg_config_restore
    exit 1
}
# Se nao ha rclone, instala
( /usr/bin/rclone -V &>/dev/null || rclone -V &>/dev/null ) || instalar_rclone

rclone -v ls remote:$remote_path_gdrive

echo "Copie e cole o nome do arquivo a ser baixado:"
read gpg_config_restore
echo "Blz..."

rclone -v copy remote:$remote_path_gdrive/$gpg_config_restore $tmp/ || rollback "RCLONE"

gpg2 --output $tar_basename --decrypt $tmp/$gpg_config_restore || rollback "GPG"
sudo rm $tmp/$gpg_config_restore

echo "Baixado, já deseja descompactar (se estiver na raiz do projeto vai sobrescrever os diretorios e arquivos atuais)?" [Yn]
read sobreescrever
[[ $sobreescrever =~ ^[nN][[:blank:]]*$ ]] && exit 0

sudo tar -zxvf $tar_basename server/config/ www/config/ || rollback "TAR"

echo "Remove o arquivo $tar_basename? [Yn]"
read ok
[[ $ok =~ ^[nN][[:blank:]]*$ ]] && exit 0

rm $tar_basename
