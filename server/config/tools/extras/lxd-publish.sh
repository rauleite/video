#!/bin/bash
ct_name="$1"
img_alias="$2"

if [ $EUID == "0" ];
then
    echo "Não rode o script como root, pecado"
    exit 1
fi

if [[ -z $ct_name || -z $img_alias || "$1" == "--help" || "$1" == "-h" ]];
then
    echo 'Images:'
    lxc image list
    echo 'Containers:'    
    lxc list
    echo "# Parametros obrigatorios:"
    echo "1- container-name     Ex. proxy | app1 | app2 | teste"
    echo "2- img-alias          Ex. app1/pos_node_installs"
    exit 1
fi


echo "indo..."
lxc publish -f $ct_name --alias $img_alias