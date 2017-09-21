#!/bin/bash
### ENVS Defaults ###
# CT_PATH="/var/lib/lxd/containers/$CT_NAME/rootfs"
# CT_USER="root"
# NETWORK="lxcbr0"
# LOCAL_PATH="$(pwd)"
# NETWORK="lxcbr01"

### Dependencia ###
source ./server/config/lxd/lxd-lib.sh

### MY VARS ###
web_vm="/var/www"
web_local="./web"
server_vm="/var/server"
server_local="./server"

FROM ubuntu/user

# Build ou Updates on VM
EXEC_FILE "$server_local/config/lxd/lxd-file-app.sh"


# Web
HOST_EXEC "[ ! -d $web_local/build ] && yarn build:web"
# Server
HOST_EXEC "[ ! -d $server_local/build ] && yarn build:server"

COPY ./package.json    /

# Depends Web
COPY $web_local/build                       $web_vm
COPY $web_local/public                      $web_vm
COPY $web_local/config/proxy/ssl            /var/
COPY $web_local/config/proxy/nginx.conf     /etc/nginx/
COPY $web_local/config/proxy/default        /etc/nginx/sites-enabled/

# Depends server
COPY $server_local/config           $server_vm
COPY $server_local/package.json     $server_vm
COPY $server_local/build            $server_vm
COPY $server_local/src              $server_vm

# DEVICE nginx-confs "./config/proxy/" "/root"

# Instala e Inicia server
EXEC "cd $server_vm && yarn install"
EXEC "cd $server_vm && MONGO_HOST='db' yarn start"

# Verifica e restart web
EXEC "nginx -t -c /etc/nginx/nginx.conf"
EXEC "service nginx restart"
EXEC "service nginx status"
EXEC "cd $server_vm && pm2 show build"
# Remove temp files
EXEC "rm -r $server_vm/src"
