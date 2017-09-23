#!/bin/bash
# Informacoes sobre o framework em lxd-app.sh

source ./server/config/lxd/src/lxd-file-src.sh

### MY VARS ###
db_vm="/db"
db_local="./server"

FROM ubuntu/user

ENV $db_vm

FILES \
    "$db_local/config/lxd-files/db.sh" \
    "$db_local/config/lxd-files/z-src.sh"

EXEC "sudo rm -f $db_local/config/mongo/data/db/mongod.lock"

COPY $db_local/config/mongo/data/db   $db_vm/data/

# Instala e Inicia server
EXEC "sudo service mongod restart"
EXEC "mongod --dbpath /$db_vm/data/db --auth"

HOST_EXEC "echo 'Logs em: /var/log/mongodb/mongod.log'"