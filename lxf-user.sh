# host_local="."
# web_local="$host_local/www"
# server_local="$host_local/server"

CONTAINER   "user"
USER_NAME   "root"
NETWORK     "lxcbr01"
# Considera esta opcao se for criar um container novo
# Default eh false (unprivileged)
PRIVILEGED  "true"

VAR host_local      "."
VAR web_local       "$host_local/www"
VAR server_local    "$host_local/server"
VAR src_dest        "/root/src_dest"

FROM ubuntu/zesty/amd64

# Indica onde fica o path de todos os containers. No caso do ZFS geralmente e:
DEST_PATH "/var/lib/lxd/storage-pools/zfs/containers"

FILES \
    "$server_local/config/lxf/user.sh" \
    "$server_local/config/lxf/z-src.sh" \
    "$src_dest"


