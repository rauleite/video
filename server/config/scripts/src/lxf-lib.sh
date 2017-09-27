#!/bin/bash

source lxf-colors.sh
# source lxf-colors.sh.x

### TRAP ###
function ct_restart() {
        echo ""    
        echo_info "Finalizando"    
        lxc restart $CONTAINER
        echo -e "${nc}"
        
        exit 1
}
trap ct_restart INT

### EXEC ###
function exec_cmd_user () {
    echo_info "[ EXEC ] $@"
    lxc exec $CONTAINER -- sudo -H -u $USER_NAME bash -c "$@"
}
function exec_cmd_user_ssh () {
    echo_info "[ EXEC_SSH ] $USER_NAME@$IPV4 $@"
    
    ssh $USER_NAME@$IPV4 "$@"

}

### UTILS ###
function until_host () {
    echo "Conectando: $1"
    # exec_cmd "until nc -vzw 2 $1 22; do sleep 1; done"    
    exec_cmd_user "until ping -c1 $1 &>/dev/null; do sleep 1; done"
    sleep 3
    echo "Ok"
}
function exists () {
    exec_cmd_user "which $1 &>/dev/null"
}
function exists_user () {
    exec_cmd_user "id -u $1 &>/dev/null"
}
function exists_container () {
    lxc config show $1 &>/dev/null
}
function copy () {
    local -r type_copy=$1; 
    shift
    local dest="$1"
    shift
    local src="$@"
    shift

    # echo "type_exec $type_exec"
    # echo "dest $dest"
    # echo "src $src"

    if [[ $type_copy == "ssh" ]]
    then
        echo_info "[ COPY_SSH ] $src $dest"
        rsync -r -a -e "ssh" --chown=$USER_NAME:$USER_NAME --rsync-path="sudo rsync" "$src" "$USER_NAME@$IPV4:$dest"
    else
        echo_info "[ COPY ] $src $dest"     
        # sudo rsync -r -a --chown=$USER_NAME:$USER_NAME --rsync-path="sudo rsync" $@
        sudo rsync -r --rsync-path="sudo rsync" $src $DEST_PATH$dest
        for i in $src
        do
            file_name="$(basename $i)"
            exec_cmd_user "sudo chown $USER_NAME:$USER_NAME $dest/$file_name"
        done
    fi
    
}
function files () {
    if [[ $NO_FILE == "true" ]]
    then
        echo_info "[ NO FILES ]"
        return 0        
    fi

    local dest
    local src
    local -r type_exec="$1"; 
    shift
    local -r file_to_exec="$(basename $1)"; # Sem shift

    while true
    do  
        # Ultimo arg
        if [[ $# == 1 ]]
        then
            dest="$1"
            shift
            break
        fi
        src="$src $1"
        shift
    done

    # local cmd_dir="sudo rm -rf $dest && sudo mkdir $dest"
    local cmd_dir="sudo mkdir -p $dest"
    local cmd_file="cd $dest && sudo $dest/$file_to_exec"

    if [[ $type_exec == "ssh" ]]
    then
        echo_info "[ FILES_SSH ] $src $dest"
        exec_cmd_user_ssh "$cmd_dir"          
        copy  "ssh" "$dest" "$src" 
        exec_cmd_user_ssh "$cmd_file"
    else
        echo_info "[ FILES ] $src $dest"    
        exec_cmd_user "$cmd_dir"
        copy "default" "$dest" "$src"
        exec_cmd_user "$cmd_file"
    fi

}

### UPDATE, UPGRADE, INSTALL ###
function update () {
    echo_info 'Espedando archive.ubuntu.com'
    # lxc exec $CONTAINER -- sh -c 'until ping -c1 archive.ubuntu.com &>/dev/null; do :; done && until ping -c1 security.ubuntu.com &>/dev/null; do :; done && apt-get update'
    lxc exec $CONTAINER -- bash -c 'until nc -vzw 2 archive.ubuntu.com 22; do sleep 2; done && until nc -vzw 2 security.ubuntu.com 22; do sleep 2; done'
    echo_info 'Ok'    
    echo_info 'Updating...'    
    lxc exec $CONTAINER -- bash -c "apt-get update"    
}
function upgrade () {
    echo_info 'Upgrading...'    
    lxc exec $CONTAINER -- bash -c "apt-get -y upgrade"
}
function install () {
    echo_info "install: $@"
    lxc exec $CONTAINER -- bash -c "apt-get -y install $@"
}
