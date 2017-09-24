#!/bin/bash
# Lib dos lxd-<machine>
# Atraves das configuracoes setadas em lxd-<machine>, e possivel apartir
# de uma imagem local, criar um container plenamente configurado. 

source lxd-lib.sh

LOCAL_PATH="$(pwd)"

usage () {
    echo_quest "Usage:"
    echo_command "  lxd-*.sh <containder-name> [-opts]"
    echo_quest "Opts:"
    echo_command "  -n      (no file) - Desconsidera arquivo de instalacoes"
    echo_quest "Exemplo:"
    echo_command "  lxd-app ou lxd-app -n"
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
read ct_name

[[ -z $ct_name ]] && exit 1

network=""
function attach_network () {
    lxc network list
    echo_quest "Nome da Conexao Bridge."
    read network_read
    [[ -z $network_read ]] && exit 1
    network=$network_read
    lxc network attach $network $ct_name &>/dev/null
}
# function create_network () {
#     until_host $ct_name
#     echo_info "creanting network $network"
#     lxc network create $network 
#     echo_info "a $network"
# }

### UTILS ###
back_to_local_path () {
    cd $LOCAL_PATH
}
## USO APENAS DO LIB ###
function USER_EXEC () {
    back_to_local_path
    # echo "[ USER_EXEC ] $*"    
    # lxc exec $ct_name -- sudo -H -u $user_name bash -c "$*"    
    exec_cmd_user "$*"
}
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
ip=""
function read_ip () {
    lxc list $ct_name
    echo_quest "IP de $ct_name"
    read ip_read

    [[ -z $ip_read ]] && ( ct_restart && exit 1 )
    ip=$ip_read
}
user_name=""
function read_user () {
    echo_quest "Nome do USER existente em $ct_name"
    read user_name_read

    [[ -z $user_name_read ]] && exit 1
    user_name=$user_name_read
}
function post_from () {
    echo_info "Iniciando"
    lxc start $ct_name &>/dev/null
    # lxc stop $ct_name &>/dev/null
    
    read_user

    exists_user $user_name
    [[ $? != "0" ]] && echo_error "Usuario $user_name_read inexistente" && exit 1
    USER_EXEC 'sudo echo "Sou $USER, com uid $UID"'
    
    install_rsync
    
    
    until_host $ct_name
    read_ip
    
}

### FRAMEWORK COMANDS ### ---------------------
function FROM () {
    back_to_local_path
    # Cria conteiner e attach network, no caso do container ainda nao existir
    # lxc launch $1 $ct_name
    
    # Network
    exists_container $ct_name
    if [[ $? == "0" ]]
    then
        echo_info "Usando o container $ct_name, existente."
        lxc stop $ct_name &>/dev/null
        lxc start $ct_name &>/dev/null
    else
        echo_info "Criando container $ct_name"
        lxc launch $1 $ct_name &>/dev/null
        lxc restart $ct_name
        attach_network
    fi
    post_from
}

function ENV () {
    back_to_local_path
    USER_EXEC "sudo mkdir -p $* && sudo chown $user_name:$user_name $*; sudo chmod g+s ."
    # SUDO_EXEC "mkdir -p $* && sudo chown $user_name:$user_name $*"
}

function HOST_EXEC () {
    back_to_local_path
    sh -c "$*"
}
function COPY () {
    back_to_local_path
    rsync_sudo $1 $user_name@$ip:$2
}
function DEVICE () {
    back_to_local_path
    echo_info "[ MOUNT DEVICE ] $2 -> $3"    
    echo "TODO: Device nao esta pronto"
    exit 1
    lxc config device add $ct_name $1 disk source=$2 path=$CT_PATH/$3 || exit 1
}
function EXEC () {
    back_to_local_path    
    # ssh $user_name@$ip "sh -c $*" || exit 1
    USER_EXEC "$*" || exit 1
}

function FILES () {
    back_to_local_path    
    if [[ $no_file == "true" ]]
    then
        echo_info "[ NO EXEC_FILE ] $*"        
    else
        echo_info "[ EXEC_FILE ] $*"
        file=$(basename $1)
        # sudo chmod 700 $CT_PATH/$CT_USER/$file
        rsync_sudo $* $user_name@$ip:~/
        # sudo cp -rf --remove-destination $1 $CT_PATH/$CT_USER
        # lxc exec $ct_name --mode=non-interactive -- sh -c "sudo --user $user_name && sudo /home/$user_name/$file"
        # SUDO_EXEC "/home/$user_name/$file"
        USER_EXEC "/home/$user_name/$file"

    fi

}