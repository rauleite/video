#!/bin/bash
# Lib dos lxf-<machine>
# Atraves das configuracoes setadas em lxf-<machine>, e possivel apartir
# de uma imagem local, criar um container plenamente configurado. 

source lxf-lib.sh

LOCAL_PATH="$(pwd)"
dest_path=""
cache_ip=""

usage () {
    echo_quest "Usage:"
    echo_command "  lxf-*.sh <containder-name> [-opts]"
    echo_quest "Opts:"
    echo_command "  -n      (no file) - Desconsidera arquivo de instalacoes"
    echo_quest "Exemplo:"
    echo_command "  lxf-app ou lxf-app -n"
}
no_file=""
while getopts "h:nc:" arg; do
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
function USER_EXEC_SSH () {
    back_to_local_path
    # echo "[ USER_EXEC ] $*"    
    # lxc exec $ct_name -- sudo -H -u $user_name bash -c "$*"    
    [[ -z ip ]] && read_ip    
    exec_cmd_user_ssh $ip "$*"
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
network=""
function attach_network () {
    lxc network list
    echo_quest "Nome da Conexao Bridge."
    read network_read
    [[ -z $network_read ]] && exit 1
    network=$network_read
    lxc network attach $network $ct_name &>/dev/null
    lxc stop $ct_name &>/dev/null
    lxc start $ct_name &>/dev/null
}
ip=""
function read_ip () {
    until_host $ct_name

    lxc list $ct_name
    echo_quest "IP de $ct_name"
    read ip_read

    [[ -z $ip_read ]] && ( ct_restart && exit 1 )
    ip=$ip_read
}
user_name=""
function read_user () {
    echo_quest "Nome do USER existente, para assumir comandos em $ct_name"
    read user_name_read

    [[ -z $user_name_read ]] && exit 1
    user_name=$user_name_read
}
function post_from () {
    echo_info "Iniciando"
    
    read_user

    exists_user $user_name
    [[ $? != "0" ]] && echo_error "Usuario $user_name_read inexistente" && exit 1
    USER_EXEC 'sudo echo "Sou $USER, com uid $UID"'

    # attach_network
    
    install_rsync
    
}

function ssh_or_copy () {
    dest=""
    src=""
    first="true"
    for i in $@
    do
        if [[ $first == "true" ]]
        then
            first="false"
            dest=$i
        else
            src="$src $i"
        fi
    done

    echo_info "Copiando $src"
    echo_info "|-> Para $dest"

    if [[ -z $dest_path ]]
        then
            [[ -z ip ]] && read_ip
            rsync_sudo $src $user_name@$ip:$dest
        else
            echo "-- src $src"
            echo "-- dest $dest"
            copy "$dest_path/$dest" "$src"
    fi
}


### FRAMEWORK COMANDS ### ---------------------
function VAR (){ 
    export $1="$2" 
}
function DEST_PATH () {
    dest_path=$1/$ct_name/rootfs
}
function FROM () {
    back_to_local_path
    
    # Network
    exists_container $ct_name
    if [[ $? == "0" ]]
    then
        echo_info "Usando o container $ct_name, existente."
    else
        echo_info "Criando container $ct_name"
        # lxc launch $1 $ct_name -c security.privileged=true &>/dev/null
        lxc launch $1 $ct_name &>/dev/null        
        attach_network
    fi
    post_from
}

function ENV () {
    back_to_local_path
    USER_EXEC "sudo mkdir -p $* && sudo chown $user_name:$user_name $*; sudo chmod g+s ."
}

function HOST_EXEC () {
    back_to_local_path
    sh -c "$*"
}
function COPY_SSH () {
    back_to_local_path
    [[ -z ip ]] && read_ip
    copy_ssh $1 $user_name@$ip:$2
}
function COPY () {
    back_to_local_path
    copy $*
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
    USER_EXEC "$*" || exit 1
}

function FILES () {
    back_to_local_path    
    if [[ $no_file == "true" ]]
    then
        echo_info "[ NO FILES ] $*"        
    else
        echo_info "[ FILES ] $*"
        file=$(basename $1)
        
        USER_EXEC "sudo rm -rf /dest-src"
        USER_EXEC "sudo mkdir /dest-src"
        # USER_EXEC "sudo chmod 777 /dest-src"

        COPY "$*" "$dest_path/dest-src"
        # USER_EXEC "sudo chmod 777 /dest-src/*"
        
        USER_EXEC "sudo /dest-src/$file"

    fi

}

function FILES_SSH () {
    back_to_local_path    
    if [[ $no_file == "true" ]]
    then
        echo_info "[ NO FILES ] $*"        
    else
        echo_info "[ FILES_SSH ] $*"
        file=$(basename $1)
        
        USER_EXEC_SSH "sudo mkdir /dest_path"
        
        copy_ssh "$*" "/dest_path"
        
        # USER_EXEC "sudo chmod 777 /src-files/*"
        USER_EXEC_SSH "sudo /dest_path/$file"
        # USER_EXEC "sudo rm -r /src-files/"

    fi

}