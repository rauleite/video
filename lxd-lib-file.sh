#!/bin/bash
### ENV MODIFICAVIES ###
ct_name=$1
CT_PATH="/var/lib/lxd/containers/$ct_name/rootfs"
ct_user="root"
env_web="/$ct_user/www"
env_server="/$ct_user/server"
network="lxcbr0"

# Vars
PATH_VM=""
PATH_LOCAL=""

[[ -z $ct_name ]] && \
    echo "<containder-name>" && exit 0

echo "envs:"
echo "- Imagem: = $img_alias"
echo "- Cont. User = $ct_user"
echo "- Cont. Path = $CT_PATH"
echo "- Cont. Env Web = $env_web"
echo "- Cont. Env Server = $env_server"
# echo "- Local Path = $local_path"

echo "Continua? [Yn]"
read ok
[[ $ok =~ ^[nN][[:blank:]]*$ ]] && exit 0


### UTILS ###
# ...


### COMANDS ###
function FROM () {
    echo "[ FROM ] $*"
    # Cria container
    lxc launch $* $ct_name -c security.privileged=true
    echo "[ creanting network if ] $network"
    lxc network create $network
    # lxc network set $network 
    # sleep 5    
    echo "[ attaching network ] $network"
    lxc network attach $network $ct_name
    # lxc start $ct_name
}
# function HOST () {
#     echo "[ HOST ] $*"
#     sh -c "$*"
# }
# function PATH_VM () {
#     echo "[ PATH_VM ] $*"    
#     PATH_VM=$*
# }
# function PATH_LOCAL () {
#     echo "[ PATH_LOCAL ] $*"    
#     PATH_VM=$*
# }
function COPY () {
    echo "[ COPY ] $1 -> $2"
    sudo mkdir -p $CT_PATH/$2 
    sudo yes | sudo cp -rf --remove-destination $1 $CT_PATH/$2 || exit 0
}
function DEVICE () {
    echo "[ MOUNT DEVICE ] $2 -> $3"    
    lxc config device add $ct_name $1 disk source=$2 path=$CT_PATH/$3
}
function EXEC () {
    echo "[ EXEC ] $*"
    lxc exec $ct_name --mode=non-interactive -- sh -c "$*"
}
