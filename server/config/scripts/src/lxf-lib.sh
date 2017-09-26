#!/bin/bash

source lxf-colors.sh

### TRAP ###
function ct_restart() {
        echo ""    
        echo_info "Finalizando"    
        lxc restart $CT_NAME
        echo -e "${nc}"
        
        exit 1
}
trap ct_restart INT

### EXEC ###
function exec_cmd_user () {
    echo_info "$* (run with user)"
    lxc exec $ct_name -- sudo -H -u $user_name bash -c "$*"
}
function exec_cmd_user_ssh () {
    echo_info "$* (run with user via ssh)"
    # lxc exec $ct_name -- sudo -H -u $user_name bash -c "$*"
    ip=""
    cmd=""
    first="true"
    for i in $@
    do
        if [[ i == 1 ]]
        then
            ip=$i
        else
            cmd="$dest $i"
        fi
    done
    
    ssh $user_name@$1 "$cmd"

}
function exec_cmd () {
    echo_info "$*"
    lxc exec $ct_name -- bash -c "$*"
}
### UTILS ###
function until_host () {
    echo "Conectando: $1"
    # exec_cmd "until nc -vzw 2 $1 22; do sleep 1; done"    
    exec_cmd "until ping -c1 $1 &>/dev/null; do sleep 1; done"
    sleep 3
    echo "Ok"
}
function exists () {
    exec_cmd "which $1 &>/dev/null"
}
function exists_user () {
    exec_cmd "id -u $1 &>/dev/null"
}
function exists_container () {
    lxc config show $1 &>/dev/null
}
function copy_ssh () {
    # rsync -r -a -e ssh --delete-during --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
    echo_info "transferindo (ssh): $*"
    rsync -r -a -e ssh --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
}
function copy () {
    echo_info "transferindo (cp): $*"
    # echo_info " |-> para        : $1"
    sudo rsync -r -a --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
    
    # sudo -H -u $user_name bash -c "sudo cp -rf --remove-destination -t $1 $2"
}

### UPDATE, UPGRADE, INSTALL ###
function update () {
    echo_info 'Espedando archive.ubuntu.com'
    # lxc exec $ct_name -- sh -c 'until ping -c1 archive.ubuntu.com &>/dev/null; do :; done && until ping -c1 security.ubuntu.com &>/dev/null; do :; done && apt-get update'
    lxc exec $ct_name -- bash -c 'until nc -vzw 2 archive.ubuntu.com 22; do sleep 2; done && until nc -vzw 2 security.ubuntu.com 22; do sleep 2; done'
    echo_info 'Ok'    
    echo_info 'Updating...'    
    lxc exec $ct_name -- bash -c "apt-get update"    
}
function upgrade () {
    echo_info 'Upgrading...'    
    lxc exec $ct_name -- bash -c "apt-get -y upgrade"
}
function install () {
    echo_info "install: $*"
    lxc exec $ct_name -- bash -c "apt-get -y install $*"
}