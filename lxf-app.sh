### OPCIONAIS: Se nao forem incluidos, o daemon perguntara interativamente
CONTAINER   "app"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
USER_GROUP  "rleite"
DEST_PATH   "/var/lib/lxd/storage-pools/zfs/containers"
### ALIASES: Pode ser usado nesta forma abaixo, ou via CONFIG tag ###
# IPV4        "10.99.125.10" # Se nao houver valor, sera inserido via dhcp
# PRIVILEGED  "true"
CONFIG      "set $CONTAINER security.privileged true" # pode serparar com sinal de = tambem
CONFIG      "device set $CONTAINER $NETWORK ipv4.address 10.99.125.10"

### MY VARS ###
VAR host_local      "$(pwd)"
VAR web_local       "$host_local/www"
VAR web_vm          "/var/www"
VAR dev             "/home/$USER_NAME/dev"
VAR server          "$dev/server"
VAR web             "$dev/www"

FROM "nodejs"

ENV "$web_vm $dev"

HOST_EXEC [ ! -d $web_local/build ] && yarn build:web

VOLUME $web_local/build                     $web_vm/
VOLUME $web_local/public                    $web_vm/

VOLUME $host_local                          $dev
VOLUME $web_local/config/proxy/default      /etc/nginx/sites-enabled/
VOLUME $web_local/config/proxy/nginx.conf   /etc/nginx/nginx.conf
VOLUME $web_local/config/proxy/ssl          /var/ssl


EXEC \
    [[ "\$(tail -n 1 /etc/resolv.conf)" != "app $IPV4" ]] && \
    echo "app $IPV4" | sudo tee --append /etc/resolv.conf

### Executa remotamente, no container ###
EXEC cd $dev && yarn install:app
EXEC sudo chown -R $USER_NAME:$USER_GROUP ~/
EXEC nginx -t -c /etc/nginx/nginx.conf
EXEC sudo service nginx restart
EXEC cd $dev && yarn server
# EXEC cd $dev && yarn app

# EXEC "cd $server && yarn install"
# EXEC "cd $server && yarn start"
# EXEC "cd $server && yarn show"

# EXEC "cd $web && yarn install"
# EXEC "cd $web && yarn start"

# Verifica e restart web

# EXEC "cd /home/$USER_NAME/$server && bash"