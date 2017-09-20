#!/bin/bash
# Config
NETWORK="lxcbr01"

### Dependencia ###
# namefile=$(basename "$0")

source ./server/config/lxd/lxd-lib.sh

### MY VARS ###
db_vm="/db"
db_local="./server"

FROM db/mongod349

# Build ou Updates on VM
EXEC_FILE "$db_local/config/lxd/lxd-file-db.sh"

EXEC "rm -f $db_local/config/mongo/data/db/mongod.lock"
COPY $db_local/config/mongo/data/db   $db_vm/data/

# Instala e Inicia server
EXEC "service mongod restart"
EXEC "mongod --dbpath /$db_vm/data/db --auth"
echo 'Logs em: /var/log/mongodb/mongod.log'