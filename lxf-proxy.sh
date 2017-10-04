# CONTAINER   "prod-proxy"
CONTAINER   "proxy"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
IPV4        "10.99.125.120" # Como IPV4 nao tem valor, sera inserido interativamente
PRIVILEGED  "false"
DEST_PATH   "/var/lib/lxd/storage-pools/zfs/containers"

VAR src_dest "/home/$USER_NAME/src_dest"

FROM proxy/ha

FILES \
    "./server/config/lxf/proxy.sh" \
    "./server/config/lxf/z-src.sh" \
    "$src_dest"