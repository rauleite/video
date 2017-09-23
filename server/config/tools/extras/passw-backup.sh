#!/bin/bash
user=`whoami`
path="/home/raul/.keepassx"
tmp="/tmp"
now=$(date +%Y%m%d_%H%M%S)
db=$path/all.kdbx
csv=$path/all.csv
tmp_csv="$tmp/all_csv_$now.gpg"
tmp_db="$tmp/all_$now.kdbx"


brown='\033[0;33m'
green='\033[0;32m'
red='\033[1;31m'
cyan='\033[1;36m'
nc='\033[0m' # No Color

success="${green}[ok]${nc}  "
erro="${red}[ERRO]${nc} "
info="${cyan}[INFO]${nc} "
p="       "

echo -e ""

remove_files () {
    for file in "$@"
    do
        if [ -f $file ]
        then
            echo -e "$info Removendo:"
            echo -e "$p $file"
            echo -e 
            rm $file
        fi
    done
}

remove_all_files () {
    remove_files $tmp_db $tmp_csv $csv
    
}

rollback () {
    if [ "$1" != 0 ] ;then
        echo -e "$info Start rollback!"
        echo -e

        # remove_files $tmp_db $tmp_csv $csv
        remove_all_files

        echo -e "$info End rollback!"        
        echo -e $nc
        
        exit 1    
    fi
}


# Nao pode ser ROOT User
if [ "$EUID" == 0 ]; then
    echo -e "$erro Não rode como root user"
    echo -e

    exit 1
fi

# Tem que ter arquivo all.csv
if [ ! -f $csv ]; then
    echo -e "$erro Não existe arquivo all.csv"
    echo -e

    # rollback 1
    exit 1
fi

# Criptografa
gpg2 -o $tmp_csv --symmetric --cipher-algo AES256 $csv || rollback $?

echo -e "$info Copiando"
echo -e $p $tmp_db
echo -e

cp $db $tmp_db || rollback $?

for file in $tmp_csv $tmp_db
do
    echo -e "$info Enviando ao Google Drive"
    echo -e $p $file
    echo -e "${brown}"
    rclone -v copy $file remote:Projetos/access/backup/senhas/keypassx || rollback $?
    echo -e "${nc}"
done

remove_files $tmp_db $tmp_csv $csv || (echo -e "$erro Vulnerabilidade, possível arquivo raw mode. Ver ./all.csv e arquivos em /tmp" && exit 1)

echo -e "$success Script finalizado com sucesso"
echo -e
