#!/bin/bash
CONTAINER   "proxy"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
IPV4        "" # Como IPV4 nao tem valor, sera inserido interativamente
PRIVILEGED  "true"
DEST_PATH   "/var/lib/lxd/storage-pools/zfs/containers"

VAR dest "/home/$USER_NAME/src_dest"

# FROM ubuntu/user
FROM proxy/ha

FILES \
    "./server/config/lxf/proxy.sh" \
    "./server/config/lxf/z-src.sh" \
    "$dest"