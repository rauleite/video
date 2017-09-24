#!/bin/bash
### COLORS ###
brown='\033[0;33m'
red='\033[1;31m'
cyan='\e[36m'
green='\e[32m'
blue='\e[34m'
light_gray='\e[37m'
gray='\e[90m'
ligh_green='\e[92m'
nc='\033[0m' # No Color

### ECHO ###
function echo_info () {
    echo -e "${gray}$*${nc}"
}
function echo_quest () {
    echo -e "${cyan}$*${nc}"
}
function echo_command () {
    echo -e "${cyan}$*${nc}"
}
function echo_error () {
    echo -e "${red}$*${nc}"
}
function echo_code () {
    echo -e "${green}$*${nc}"
}

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
    echo_info "$* (force run with user)"
    lxc exec $ct_name -- sudo -H -u $user_name bash -c "$*"
}
function exec_cmd () {
    echo_info "$*"
    lxc exec $ct_name -- bash -c "$*"
}
### UTILS ###
function until_host () {
    echo "Conectando: $1"
    exec_cmd "until nc -vzw 2 $1 22; do sleep 1; done"    
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
function rsync_sudo () {
    # rsync -r -a -e ssh --delete-during --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
    echo_info "copiando: $*"
    rsync -r -a -e ssh --chown=$user_name:$user_name --rsync-path="sudo rsync" $*
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