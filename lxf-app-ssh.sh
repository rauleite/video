# Este arquivo monta um novo container apartir de uma imagem base.
# Executa um scripts no container, transfere arquivos, prepara e incia aplicacoes.

### OPCIONAIS: Se nao forem incluidos, o daemon perguntara interativamente
# CONTAINER   "app"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
IPV4        "" # Como IPV4 nao tem valor, sera inserido interativamente
PRIVILEGED  "true"

### MY VARS ###
VAR host_local      "."
VAR web_local       "$host_local/www"
VAR server_local    "$host_local/server"
VAR web_vm          "/var/www"
VAR server_vm       "/var/server"
VAR src_dest        "/home/$USER_NAME/src_dest"

# Imagem usada como base
FROM app/node850/npm530/nginx/redis

#### Cria diretorios que recebem OWNER e GROUP ($USER:$USER) do container. ###
ENV $web_vm $server_vm

### Geralmente para update, upgrades e instalacoes essenciais ###
# Primeiro arquivo sera executado, os demais serao enviados para
# serem usados como 'source' (opcional), o ultimo eh o destino
FILES_SSH \
    "$server_local/config/lxf/app.sh" \
    "$server_local/config/lxf/z-src.sh" \
    "$src_dest"
    
### Executa shell na maquina host. Bom para fazer o builds local ###
# Web
HOST_EXEC "[ ! -d $web_local/build ] && yarn build:web"
# Server 
HOST_EXEC "[ ! -d $server_local/build ] && yarn build:server"

### Copia local -> container ###
COPY_SSH ./package.json    /
# Depends Web
COPY_SSH $web_local/build                       $web_vm/
COPY_SSH $web_local/public                      $web_vm/
COPY_SSH $web_local/config/proxy/ssl            /var/
COPY_SSH $web_local/config/proxy/nginx.conf     /etc/nginx/
COPY_SSH $web_local/config/proxy/default        /etc/nginx/sites-enabled/

# Depends server
COPY_SSH $server_local/config               $server_vm/
COPY_SSH $server_local/package.json         $server_vm/
COPY_SSH $server_local/build                $server_vm/
COPY_SSH $server_local/src                  $server_vm/
COPY_SSH $host_local/ecosystem.config.js    $server_vm/
COPY_SSH $host_local/yarn.lock              $server_vm/

# DEVICE nginx-confs "./config/proxy/" "/root"

### Executa remotamente, no container ###
EXEC_SSH "cd $server_vm && yarn install"
EXEC_SSH "cd $server_vm && yarn start"
EXEC_SSH "cd $server_vm && yarn show"

# Verifica e restart web
# EXEC "nginx -t -c /etc/nginx/nginx.conf"
EXEC_SSH "sudo service nginx restart"
# Remove temp files
EXEC_SSH "sudo rm -r $server_vm/src"
# Remove src das instalacoes
EXEC_SSH "cd ~/ && sudo rm -r n netdata/ redis-stable redis-stable.tar.gz"