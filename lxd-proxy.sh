#!/bin/bash
# Config
NETWORK="lxcbr01"
IMAGE_FROM="proxy/ha172/redis"
### Dependencia ###
# namefile=$(basename "$0")

source ./server/config/lxd/lxd-lib.sh

### MY VARS ###

FROM $IMAGE_FROM

EXEC_FILE "./server/config/lxd/lxd-file-proxy.sh"

### Dependencia ###
# Instala e Inicia server
# EXEC ""