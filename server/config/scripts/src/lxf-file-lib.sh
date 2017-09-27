#!/bin/bash
# Lib dos lxf-<machine>
# Atraves das configuracoes setadas em lxf-<machine>, e possivel apartir
# de uma imagem local, criar um container plenamente configurado. 

source lxf-lib.sh
# source lxf-lib.sh.x
{
    declare -r LOCAL_PATH="$(pwd)"
    declare CONTAINER
    declare DEST_PATH
    declare IPV4
    declare NETWORK
    declare PRIVILEGED
    declare USER_NAME

    ### UTILS ###
    function install_rsync () {
        rsync --version &>/dev/null
        if [[ $? != 0 ]]
        then
            echo_quest "Voce parece nao ter rsync, deseja instalar? [Yn]"
            read install

            [[ $install  =~ ^[nN][[:blank:]]*$ ]] && ( ct_restart && exit 1 )

            sudo apt-get -y install rsync 
        fi
    }
    function attach_network () {
        if [[ -z $NETWORK ]]
        then
            lxc network list
            echo_quest "Nome da Conexao Bridge."
            read network_read
            [[ -z $network_read ]] && exit 1
            NETWORK=$network_read
        fi
        lxc network attach $NETWORK $CONTAINER &>/dev/null
        lxc stop $CONTAINER &>/dev/null
        lxc start $CONTAINER &>/dev/null
    }
    function read_ip () {
        [[ ! -z $IPV4 ]] && return 0
        until_host $CONTAINER

        lxc list $CONTAINER
        echo_quest "IP de $CONTAINER"
        read ip_read

        [[ -z $ip_read ]] && ct_restart && exit 1
        IPV4=$ip_read
        echo "read_ip --> $IPV4"
    }
    function read_container () {
        if [[ -z $CONTAINER ]]
        then
            echo_quest "Nome de um novo, ou existente CONTAINER."
            read ct_name_read
            [[ -z $ct_name_read ]] && echo_error "Container deve ter um nome" && exit 1
            CONTAINER=$ct_name_read
        fi
    }

    ## USO APENAS DO LIB ###
    function read_user () {
        if [[ -z $USER_NAME ]]
        then
            echo_quest "Nome do USER existente, para assumir comandos em $CONTAINER"
            read user_name_read

            [[ -z $user_name_read ]] && exit 1
            USER_NAME=$user_name_read
        fi
    }
    function post_from () {
        echo_info "Iniciando"
        
        read_user

        exists_user $USER_NAME
        [[ $? != "0" ]] && echo_error "Usuario $USER_NAME inexistente" && read_user
        exec_cmd_user 'echo "Sou $USER, com uid $UID"'
        
        # attach_network
        
        install_rsync
        
    }

    ### FRAMEWORK COMANDS ### ---------------------
    function CONTAINER (){ 
        CONTAINER=$@
    }
    function PRIVILEGED () {
        PRIVILEGED="true"
    }
    function NETWORK (){ 
        NETWORK=$@
    }
    function IPV4 (){ 
        IPV4=$@
    }
    function USER_NAME (){ 
        USER_NAME=$@
    }
    function VAR (){ 
        export $1="$2" 
    }
    function DEST_PATH () {
        if [[ -z $CONTAINER ]]
        then
            read_container
        fi
        echo_info "[ DEST_PATH ] $1/$CONTAINER/rootfs"
        DEST_PATH=$1/$CONTAINER/rootfs
    }
    function FROM () {
       read_container

        # Network
        exists_container $CONTAINER
        if [[ $? == "0" ]]
        then
            echo_info "Usando o container $CONTAINER, existente."
        else
            echo_info "Criando container $CONTAINER"
            if [[ $PRIVILEGED == "true" ]]
            then
                echo_info "PRIVILEGED mode"
                lxc launch $1 $CONTAINER -c security.privileged=true &>/dev/null
            else
                echo_info "UNPRIVILEGED mode"                
                lxc launch $1 $CONTAINER &>/dev/null
            fi
            attach_network
        fi
        post_from
    }
    function ENV () {
        echo_info "[ ENV ] $@"
        exec_cmd_user "sudo mkdir -p $@ && sudo chown $USER_NAME:$USER_NAME $@; sudo chmod g+s ."
    }
    function HOST_EXEC () {
        echo_info "[ HOST_EXEC ] $@"
        sh -c "$@"
    }
    function COPY_SSH () {
        local -r src=$1; shift
        local -r dest=$1; shift
        read_ip
        copy "ssh" "$USER_NAME@$IPV4:$dest" "$src"
    }
    function COPY () {
        local -r src=$1; shift        
        local -r dest=$1; shift
        copy "default" "$dest" "$src"
    }
    function EXEC () {
        exec_cmd_user "$@"
    }
    function EXEC_SSH () {
        exec_cmd_user_ssh "$@"
    }
    function FILES () {
        files 'default' $@
    }
    function FILES_SSH () {
        read_ip
        files 'ssh' $@
    }
    function DEVICE () {
        echo_info "[ DEVICE ] $@"
        echo_info "[ MOUNT DEVICE ] $2 -> $3"    
        echo "TODO: Device nao esta pronto"
        exit 1
        lxc config device add $CONTAINER $1 disk source=$2 path=$CT_PATH/$3 
    }

}