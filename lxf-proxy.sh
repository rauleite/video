#!/bin/bash
# Config
NETWORK="lxcbr01"
IMAGE_FROM="ubuntu/user"
### Dependencia ###
# namefile=$(basename "$0")

source lxf-file-lib.sh

### MY VARS ###

FROM $IMAGE_FROM

### Dependencia ###
# Instala e Inicia server
# EXEC ""