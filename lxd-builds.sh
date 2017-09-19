#!/bin/bash

## Container ##
ct_name="$1"
ct_type="$2"

## Vm images ##
img="$3"
alias="$4"

network="$5"
env="$6"

ct_path="/var/lib/lxd/containers/$ct_name/rootfs"
ct_user="root"
buid_file="lxd-build-app.sh"
## UTILS ## ------------
### trap ###
function ctrl_c() {
        echo ""    
        echo "[ CTRL-C ] Finalizando"    
        lxc restart $ct_name
        exit 1
}
trap ctrl_c INT

### ENTRADA sh ### ------
if [[ -z $ct_name || -z $ct_type || -z $img || -z $alias || -z $network || -z $env ||"$1" == '--help' || "$1" == '-h' ]];
then
    echo 'Networks:'    
    lxc network list
    echo 'Containers:'    
    lxc list
    echo 'Images:'
    lxc image list
    echo '# Todos Parametros sao obrigatorios:'
    echo '1- Nome que quer dar ao container     Ex.         proxy | app1 | app2 | db | teste'
    echo '2- Perfil de configuracoes do cont.   Um entre:   proxy | app | db | teste'
    echo '3- Img base                           Ex.         app-yarn | ubuntu/zesty/amd64'
    echo '4- Alias para a imagem                Ex.         app-yarn'
    echo '5- Network Bridge (existente ou nao)  Ex.         lxcbr0 | zero (para nao ter)'
    echo '6- Producao ou desenv.               Um entre:   prod | dev'
    # echo '7- Apartir de imagem pura? (bugs)'    Um entre:   y | n"
    echo '---'
    echo 'Ex:'
    echo './build-containers.sh proxy proxy proxy/post_essencials ubuntu lxcbr01 prod n'
    exit 1
fi

### Utils ###
execute () {
    echo -e "\e[94m[$ct_name] $*\033[0m"
    lxc exec ${ct_name} --mode=non-interactive -- $*
    # lxc exec ${ct_name} -- /bin/bash -c "$*"
}

install () {
    # echo "[install] $*"
    execute apt-get install -y $*

}

check_ppa() {
    grep ^ $ct_path/etc/apt/sources.list $ct_path/etc/apt/sources.list.d/* | grep yarnaslhfuiwehfhehçew    
    # execute grep -h "^deb.*$1" /etc/apt/sources.list.d/* > /dev/null 2>&1
    if [[ $? -ne 0 ]]
        then
        echo 'eh pra add'
        return 0 
    else
        echo 'NAO eh pra add'
        return 1
    fi
}

exec_if () {
    echo $1
    echo $2
    # execute dpkg -l $1 &>/dev/null || echo "$2" && execute $2
    execute $2
}

# instala se nao existir
install_if () {
    ( execute dpkg -l $1 &>/dev/null && echo "- $1 já existe." ) \
        || ( echo "- $1" && install $1 )
}
# chamado quando nome do pkg e diferente do nome do comando (do bin)
install_args () {
    execute dpkg -l $1 &>/dev/null || install $2
}
add_ppa () {
    execute "add-apt-repository $1"
}
# install_netdata () {
#     # execute cd ~ && \
#     #     git clone https://github.com/firehol/netdata.git --depth=1 && \
#     #     cd netdata && \
#     #     ./netdata-installer.sh
# }
pre_install_mongo () {
    execute 'apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6'
    execute 'echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list'
}

update_essenciais () {
    echo 'Espedando archive.ubuntu.com (Se demorar 1 minuto pode dar Ctrl^C, e comentar a linha de update do script)'
    until ping -c1 archive.ubuntu.com &>/dev/null; do :; done
    until ping -c1 security.ubuntu.com &>/dev/null; do :; done
    # execute apt-get update
    lxc exec $ct_name -- /bin/bash -c "apt-get update"
    
    execute apt-get -y upgrade
    install software-properties-common
    install net-tools
    install wget
    install git
    install nano
    install curl
}

# Baixa se nao existir a imagem &>1 
lxc image show $alias &>/dev/null || lxc image copy images:$img local: --alias $alias
# lxc launch $alias $ct_name

echo '[launching]'
lxc launch $alias $ct_name -c security.privileged=true

if [[ $network != 'zero' ]]
then
    echo '[creanting network]'
    lxc network create $network
    # lxc network set $network 
    # sleep 5    
    echo '[attaching network]'
    lxc network attach $network $ct_name
fi

# sleep 5

if [ "$ct_type" = "proxy" ]
then
    echo "level 2 - Van Chase"
    # repo
    add_ppa ppa:chris-lea/redis-server
    update_essenciais
    
    # installs    
    install haproxy
    install redis-server
    install ufw

elif [ "$ct_type" = "app" ]
then
    sudo cp -rf --remove-destination ./$buid_file $ct_path/$ct_user
    sudo chmod 700 $ct_path/$ct_user/$buid_file
    lxc exec $ct_name --mode=non-interactive -- /$ct_user/$buid_file

elif [ "$ct_type" = 'db' ]
then
    execute echo 'level 3 - The Hotel'
    pre_install_mongo
    # installs
    update_essenciais
    install_args 'mongod' 'mongodb-org'

elif [ "$ct_type" = 'teste' ]
then
    echo 'level 0 - Isolated'
    execute nano
    # update_essenciais
else
    echo 'Tem que digitar um tipo valido'
    exit 1
fi

# if [[ $env == prod ]]
# then
#     install_netdata
# fi
# Publicando imagem do container
# lxc publish web1 --alias web1

# exec_configs
lxc list
echo ""
echo "[ Crie imagem ] lxc publish $ct_name --alias $ct_name/version/installs"

# execute bash

# exec_configs () {
#     # lxc execute${ct_name} -- userdel -r $old_username
#     # Nao ha necessidade pra adicionar usuario
#     # lxc execute${ct_name} -- adduser $user --disabled-password --gecos ""
#     # lxc execute${ct_name} -- export user && sh -c 'echo $user"  ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers'
#     # lxc execute${ct_name} -- mkdir $user_dir/.ssh
#     # lxc execute${ct_name} -- chmod 700 $user_dir/.ssh
#     # lxc execute${ct_name} -- touch $user_dir/.ssh/authorized_keys
#     # lxc execute${ct_name} -- chmod 600 $user_dir/.ssh/authorized_keys
# }


# if [ $EUID == "0" ];
# then
#     echo "Não rode o script como root, pecado"
#     exit 1
# fi

# ct_root_dir=/var/lib/lxd/containers/$ct_name/rootfs/root

# if [ "$ct_type" = "outside" ]
# then
#     echo "level 1 - Reality"
#     lxc_launch="lxc launch $alias $ct_name"
#     $lxc_launch --config security.nesting=true

#     echo "Copiar para $ct_root_dir"
#     sudo cp $build_bin $ct_root_dir

#     update_essenciais

#     # install lxd
#     # install zfsutils-linux
#     # install firehol
        

#     # execute' /bin/bash


## User ##
# user="rleite"
# user_dir="/home/$user"       # Nao alterar
# old_username="ubuntu"        # Padrao, manter



# sudo apt-get install -y lxd
# install zfsutils-linux
# install firehol