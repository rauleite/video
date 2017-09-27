#!/bin/bash
CONTAINER   "db"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
IPV4        "" # Como IPV4 nao tem valor, sera inserido interativamente
PRIVILEGED  "true"
DEST_PATH   "/var/lib/lxd/storage-pools/zfs/containers"

VAR db_vm       "/db"
VAR db_local    "./server"
VAR src_dest    "/home/$USER_NAME/src_dest"

FROM ubuntu/user

ENV $db_vm

FILES \
    "$db_local/config/lxf/db.sh" \
    "$db_local/config/lxf/z-src.sh" \
    "$src_dest"

EXEC "sudo rm -f $db_local/config/mongo/data/db/mongod.lock"

COPY $db_local/config/mongo/data/db   $db_vm/data/

# Instala e Inicia server
EXEC "sudo service mongod restart"
# EXEC "sudo mongod --dbpath $db_vm/data/db --auth"
EXEC "sudo mongod --fork --logpath $db_vm/log_out.log --dbpath /db/data/db --auth"

HOST_EXEC "echo 'Logs em: /var/log/mongodb/mongod.log'"
HOST_EXEC "echo Logs em: $db_vm/log_out.log"