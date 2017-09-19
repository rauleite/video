#!/bin/bash
ct_name=$1
img_alias="app1/post_nodejs_installs"
ct_path="/var/lib/lxd/containers/$ct_name/rootfs"
ct_user="root"
local_path="$(pwd)/web"

source ./lxd-lib-file.sh

ENV path /www

COPY build              $path
COPY public             $path/public
COPY config/proxy/ssl   /var/ssl

COPY config/proxy/nginx.conf    /etc/nginx/nginx.conf
COPY config/proxy/default       /etc/nginx/sites-enabled/default

# DEVICE nginx-confs "./config/proxy/" "/root"

EXEC "service nginx start"
EXEC "service nginx status"
