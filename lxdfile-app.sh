#!/bin/bash
source ./lxd-lib-file.sh

### ENVS Defaults ###
# ct_path="/var/lib/lxd/containers/$ct_name/rootfs"
# ct_user="root"
# env_web="/$ct_user/web"
# env_server="/$ct_user/server"
network="lxcbr01"

### MY VARS ###
# Web
web_vm="/www"
web_local="./web"
# Server
server_vm="/server"
server_local="./server"

FROM app/node850/nvm/yarn/nginx/redis

# HOST - runs in host
# EXEC - runs in container

# seta valor de $path
# usado para o path destino
# eh apenas um valor semantico, visto poder criar vars em qualquer momento

# Web
[ ! -d $web_local/build ] && yarn build:web
# Server
[ ! -d $server_local/build ] && yarn build:server

# Web
COPY $web_local/build                       $web_vm
COPY $web_local/public                      $web_vm
COPY $web_local/config/proxy/ssl            /var/ssl
COPY $web_local/config/proxy/nginx.conf     /etc/nginx/nginx.conf
COPY $web_local/config/proxy/default        /etc/nginx/sites-enabled/default

# Server
COPY $server_local/config           $server_vm
COPY $server_local/package.json     $server_vm
COPY $server_local/build            $server_vm
COPY $server_local/src              $server_vm

# DEVICE nginx-confs "./config/proxy/" "/root"

# Web
EXEC "nginx -t -c /etc/nginx/nginx.conf"
EXEC "service nginx restart"

# Server
EXEC "cd $server_vm && yarn install && yarn build"
EXEC "cd $server_vm && yarn start"

EXEC "rm -r $server_vm/src && yarn start"
