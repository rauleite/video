#!/bin/bash
# Lib dos lxd-<machine>
# Atraves das configuracoes setadas em lxd-<machine>, e possivel apartir
# de uma imagem local, criar um container plenamente configurado. 

### COLORS ###
brown='\033[0;33m'
red='\033[1;31m'
cyan='\e[36m'
green='\e[32m'
blue='\e[34m'
light_gray='\e[37m'
gray='\e[90m'
nc='\033[0m' # No Color

function echo_info () {
    echo -e "${gray}$*${nc}"
}
function echo_quest () {
    echo -e "${green}$*${nc}"
}
function echo_command () {
    echo -e "${cyan}$*${nc}"
}

LOCAL_PATH="$(pwd)"

usage () {
    echo_info "Usage:"
    echo_info "  lxd-*.sh <containder-name> [-opts]"
    echo_info "Opts:"
    echo_info "  -n      (no file) - Desconsidera arquivo de instalacoes"
    echo_info "Exemplo:"
    echo_info "  lxd-app ou lxd-app -n"
}

no_file=""
while getopts "h:n" arg; do
  case $arg in
    h)
        usage
        exit 0
        ;;
    n)
        no_file="true"
        echo_info "Desconsiderando EXEC_FILE"
        # no_file=$OPTARG
      ;;
  esac
done

echo_quest "Nome de um novo, ou existente CONTAINER."
read CT_NAME

[[ -z $CT_NAME ]] && exit 1

# Se nao existir conteiner
NETWORK=""
lxc config show $CT_NAME &>/dev/null
if [[ $? != 0 ]]
then
    lxc network list
    echo_quest "Nome da Conexao Bridge."
    read network_read
    [[ -z $network_read ]] && exit 1
    NETWORK=$network_read
fi

### UTILS ###
### traps ###
# function cleanup {
#     echo_info "Removing /tmp/foo"
#     echo_info ""    
#     lxc restart $CT_NAME
# }
# trap cleanup EXIT

function ct_restart() {
        echo ""    
        echo_info "Finalizando"    
        lxc restart $CT_NAME
        echo -e "${nc}"
        
        exit 1
}
trap ct_restart INT

back_to_local_path () {
    cd $LOCAL_PATH
}
until_host () {
    echo_info "Aguardando $CT_NAME responder"    
    lxc exec $CT_NAME -- sh -c "until nc -vzw 2 $1 22; do sleep 1; done"    
}

## USO APENAS DO LIB ###
function USER_EXEC () {
    back_to_local_path
    # echo "[ USER_EXEC ] $*"    
    lxc exec $CT_NAME -- sudo -H -u $user_name bash -c "$*"    
}
# function SUDO_EXEC () {
#     back_to_local_path
#     # echo "[ SUDO_EXEC ] $*"
#     # ssh $user_name@$ip "sh -c $*" || exit 1
#     # lxc exec $CT_NAME --mode=non-interactive -- sh -c "$*" || exit 1
#     USER_EXEC "sudo $*" || exit 1
# }

install_rsync () {
    rsync --version &>/dev/null
    if [[ $? != 0 ]]
    then
        echo_quest "Voce parece nao ter rsync, deseja instalar? [Yn]"
        read install

        [[ $install  =~ ^[nN][[:blank:]]*$ ]] && ( ct_restart && exit 1 )

        sudo apt-get -y install rsync 
    fi
}
function rsync_sudo () {
    # rsync -r -a -e ssh --delete-during --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
    rsync -r -a -e ssh --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
}
ip=""
read_ip () {
    lxc list $CT_NAME
    echo_quest "IP de $CT_NAME"
    read ip_read

    [[ -z $ip_read ]] && ( ct_restart && exit 1 )
    ip=$ip_read
}
user_name=""
read_user () {
    echo_quest "Nome do USER existente em $CT_NAME"
    read user_name_read

    [[ -z $user_name_read ]] && ( ct_restart && exit 1 )
    user_name=$user_name_read
}

function post_from () {
    echo_info "Aguardando $CT_NAME iniciar"
    lxc stop $CT_NAME &>/dev/null
    lxc start $CT_NAME &>/dev/null
    
    read_user
    install_rsync
    
    USER_EXEC 'sudo echo "I am $USER, with uid $UID"'
    
    until_host $CT_NAME
    read_ip
    
}

### FRAMEWORK COMANDS ### ---------------------
function FROM () {
    back_to_local_path
    echo_command "[ FROM ] $1"
    # Baixa se nao existir a imagem &>1 
    lxc image show $1 &>/dev/null || lxc image copy images:$1 local:
    # Cria container
    # lxc launch $1 $CT_NAME -c security.privileged=true
    lxc launch $1 $CT_NAME &>/dev/null 
    if [[ ! -z $NETWORK ]]
    then
        until_host $CT_NAME
        echo_info "[ creanting NETWORK if ] $NETWORK"
        lxc network create $NETWORK &>/dev/null 
        # lxc network set $NETWORK 
        # sleep 5    
        echo_info "[ attaching NETWORK if ] $NETWORK"
        lxc network attach $NETWORK $CT_NAME &>/dev/null 
    fi
    post_from
}

function ENV () {
    back_to_local_path
    echo_command "[ ENV ] $*"
    USER_EXEC "sudo mkdir -p $* && sudo chown $user_name:$user_name $*; sudo chmod g+s ."
    # SUDO_EXEC "mkdir -p $* && sudo chown $user_name:$user_name $*"
}

function HOST_EXEC () {
    back_to_local_path
    echo_command "[ HOST_EXEC ] $*"
    sh -c "$*"
}
function COPY () {
    back_to_local_path
    echo_command "[ COPY ] $1 -> $2"
    # file_name="$(basename $1)"
    # echo "$2/$file_name"
    # ssh $user_name@$ip "sudo mkdir -p $2"
    # rsync -r -avz -e ssh --ignore-times --rsync-path="sudo rsync" $1 $user_name@$ip:$2
    # ssh $user_name@$ip "sudo rm -vrf $2/$file_name" 
    rsync_sudo $1 $user_name@$ip:$2
    # ssh $user_name@$ip "sudo chown rleite:rleite $2/$file_name" 
}
function DEVICE () {
    back_to_local_path
    echo_command "[ MOUNT DEVICE ] $2 -> $3"    
    echo "TODO: Device nao esta pronto"
    exit 1
    lxc config device add $CT_NAME $1 disk source=$2 path=$CT_PATH/$3 || exit 1
}
function EXEC () {
    back_to_local_path    
    echo_command "[ EXEC ] $*"
    # ssh $user_name@$ip "sh -c $*" || exit 1
    USER_EXEC "$*" || exit 1
}

function EXEC_FILE () {
    back_to_local_path    
    if [[ $no_file == "true" ]]
    then
        echo_command "[ NO EXEC_FILE ] $*"        
    else
        echo_command "[ EXEC_FILE ] $*"
        file=$(basename $1)
        # sudo chmod 700 $CT_PATH/$CT_USER/$file
        rsync_sudo $* $user_name@$ip:~/
        # sudo cp -rf --remove-destination $1 $CT_PATH/$CT_USER
        # lxc exec $CT_NAME --mode=non-interactive -- sh -c "sudo --user $user_name && sudo /home/$user_name/$file"
        # SUDO_EXEC "/home/$user_name/$file"
        USER_EXEC "/home/$user_name/$file"

    fi

}