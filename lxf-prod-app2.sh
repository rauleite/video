# Este arquivo monta um novo container apartir de uma imagem base.
# Executa um scripts no container, transfere arquivos, prepara e incia aplicacoes.

### OPCIONAIS: Se nao forem incluidos, o daemon perguntara interativamente
CONTAINER   "prod-app2"
NETWORK     "lxcbr01"
USER_NAME   "rleite"
IPV4        "10.99.125.20" # Como IPV4 nao tem valor, sera inserido interativamente
PRIVILEGED  "false"
DEST_PATH   "/var/lib/lxd/storage-pools/zfs/containers"

SOURCE ./lxf-prod-app-src.sh