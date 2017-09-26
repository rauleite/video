# host_local="."
# web_local="$host_local/www"
# server_local="$host_local/server"

VAR host_local      .
VAR web_local       $host_local/www
VAR server_local    $host_local/server

FROM ubuntu/zesty/amd64

# Indica onde fica o path de todos os containers. No caso do ZFS geralmente e:
DEST_PATH "/var/lib/lxd/storage-pools/zfs/containers"

FILES \    
    "$server_local/config/lxf/user.sh" \  
    "$server_local/config/lxf/z-src.sh"