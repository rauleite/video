#!/bin/bash
# Este script montara um novo container, apartir de uma imagem base, ou entao usara um container
# ja existente ao informar o nome deste (container).
# 
# Quando criado novo container, q imagem base (FROM) normalmente ja estara com configuracoes essenciais 
# prontas (montadas apartir do script de build)
# 
# Execute um arquivo na vm, copie arquivos, execute comandos como inciar aplicacoes.

### Dependencia ###
source lxd-file-lib.sh

### MY VARS ###
host_local="."
web_local="$host_local/www"
server_local="$host_local/server"
web_vm="/var/www"
server_vm="~/server"

# Imagem usada como base
FROM ubuntu/user

# Seta um ou multiples diretorios raizes, onde os apps se localizam, 
# com OWNER e GROUP do usuario da vm (container) destino.
ENV $web_vm $server_vm

# Build ou Updates na VM - Executaveis na frente, libs (caso haja, por ultimo)
FILES \
    "$server_local/config/lxd-files/app.sh" \
    "$server_local/config/lxd-files/z-src.sh"

# Executa shell na maquina host. Bom para fazer o build local, antes de 
# enviar a vm
# Web
HOST_EXEC "[ ! -d $web_local/build ] && yarn build:web"
# Server
HOST_EXEC "[ ! -d $server_local/build ] && yarn build:server"

# Copia local -> destino
COPY ./package.json    /
# Depends Web
COPY $web_local/build                       $web_vm/
COPY $web_local/public                      $web_vm/
COPY $web_local/config/proxy/ssl            /var/
COPY $web_local/config/proxy/nginx.conf     /etc/nginx/
COPY $web_local/config/proxy/default        /etc/nginx/sites-enabled/

# Depends server
COPY $server_local/config               $server_vm/
COPY $server_local/package.json         $server_vm/
COPY $server_local/build                $server_vm/
COPY $server_local/src                  $server_vm/
COPY $host_local/ecosystem.config.js    $server_vm/
COPY $host_local/yarn.lock              $server_vm/

# DEVICE nginx-confs "./config/proxy/" "/root"

# Executa remotamente, na vm (container)
EXEC "cd $server_vm && yarn install"
EXEC "cd $server_vm && yarn start"
EXEC "cd $server_vm && yarn show"

# Verifica e restart web
# EXEC "nginx -t -c /etc/nginx/nginx.conf"
EXEC "sudo service nginx restart"
# Remove temp files
EXEC "sudo rm -r $server_vm/src"
