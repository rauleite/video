CONTAINER   "db"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
USER_GROUP  "rleite"
IPV4        "10.99.125.100" # Como IPV4 nao tem valor, sera inserido interativamente
PRIVILEGED  "true"
DEST_PATH   "/var/lib/lxd/storage-pools/zfs/containers"

VAR db_vm       "/db"
VAR db_local    "./server"

FROM db/mongo

ENV $db_vm

EXEC sudo rm -f $db_local/config/mongo/data/db/mongod.lock

COPY $db_local/config/mongo/data/db   $db_vm/data/

EXEC sudo service mongod restart
EXEC sudo mongod --fork --logpath $db_vm/log_out.log --dbpath /db/data/db --auth

# HOST_EXEC "echo 'Logs em: /var/log/mongodb/mongod.log'"
HOST_EXEC echo Logs em: $db_vm/log_out.log