### MY VARS ###
VAR host_local      "."
VAR web_local       "$host_local/www"
VAR server_local    "$host_local/server"
VAR web_vm          "/var/www"
VAR server_vm       "/home/$USER_NAME/server"
VAR src_dest        "/home/$USER_NAME/src_dest"

# Imagem usada como base
# FROM ubuntu/user
FROM nodejs
#### Cria diretorios que recebem OWNER e GROUP ($USER:$USER) do container. ###
ENV $web_vm $server_vm

### Geralmente para update, upgrades e instalacoes essenciais ###
# Primeiro arquivo sera executado, os demais serao enviados para
# serem usados como 'source' (opcional), o ultimo eh o destino
FILES \
    "$server_local/config/lxf/app.sh" \
    "$server_local/config/lxf/z-src.sh" \
    "$src_dest"
    
### Executa shell na maquina host. Bom para fazer o builds local ###
# Web
HOST_EXEC "[ ! -d $web_local/build ] && yarn build:web"
# Server 
HOST_EXEC "[ ! -d $server_local/build ] && yarn build:server"

### Copia local -> container ###
# Depends Web
COPY $web_local/build                       $web_vm/
COPY $web_local/public                      $web_vm/
COPY $web_local/config/proxy/ssl            /var/
COPY $web_local/config/proxy/nginx.conf     /etc/nginx/
COPY $web_local/config/proxy/default        /etc/nginx/sites-enabled/

# Depends server
COPY ./package.json                     $server_vm/
COPY $server_local/config               $server_vm/
COPY $server_local/package.json         $server_vm/
COPY $server_local/build                $server_vm/
COPY $server_local/src                  $server_vm/
COPY $host_local/ecosystem.config.js    $server_vm/
COPY $host_local/yarn.lock              $server_vm/

# DEVICE nginx-confs "./config/proxy/" "/root"

### Executa remotamente, no container ###
EXEC "cd $server_vm && yarn install"
EXEC "cd $server_vm && yarn start"
EXEC "cd $server_vm && yarn show"

# Verifica e restart web
# EXEC "nginx -t -c /etc/nginx/nginx.conf"
EXEC "sudo service nginx restart"
# Remove temp files
EXEC "sudo rm -r $server_vm/src"