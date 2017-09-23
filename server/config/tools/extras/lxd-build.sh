#!/bin/bash
# Build geralmente apartir de uma particao pura
# Usado para instalacoes bem essenciais (que precise em todas as maquinas)
# mas principalmente as configuracoes, como criar novo usuario, deletar o 
# anterior padrao (ubuntu), deixar ssh server configurado, com sua devida chave
# Diferenca pro comando lxd-<container>.sh eh que este outro, serve pra buids
# esclusivos de perfil de maquina, como db, proxy, webapp. Ele eh para ser usado
# na sequencia apos este build.

### COLORS ###
brown='\033[0;33m'
red='\033[1;31m'
cyan='\e[36m'
green='\e[32m'
blue='\e[34m'
light_gray='\e[37m'
gray='\e[90m'
ligh_green='\e[92m'
nc='\033[0m' # No Color

function echo_info () {
    echo -e "${gray}$*${nc}"
}
function echo_quest () {
    echo -e "${cyan}$*${nc}"
}
function echo_command () {
    echo -e "${cyan}$*${nc}"
}
function echo_error () {
    echo -e "${red}$*${nc}"
}
function echo_code () {
    echo -e "${green}$*${nc}"
}

update () {
    echo_info 'Espedando archive.ubuntu.com'
    # lxc exec $ct_name -- sh -c 'until ping -c1 archive.ubuntu.com &>/dev/null; do :; done && until ping -c1 security.ubuntu.com &>/dev/null; do :; done && apt-get update'
    lxc exec $ct_name -- sh -c 'until nc -vzw 2 archive.ubuntu.com 22; do sleep 2; done && until nc -vzw 2 security.ubuntu.com 22; do sleep 2; done'
    echo_info 'Updating...'    
    lxc exec $ct_name -- sh -c "apt-get update"    
}


if [ $EUID == "0" ];
then
    echo_error "Não rode o script como root, pecado"
    exit 1
fi

lxc image list
img_name="ubuntu/zesty/amd64"
# img_name="ubuntu:16.04"
echo_quest "Digite nome da IMAGEM, se nao existir local, sera baixada. Default: $img_name"
read new_img_name

[[ ! -z $new_img_name ]] && img_name=$new_img_name

lxc list
echo_quest "Nome do novo ou existente CONTAINER."
read ct_name

lxc network list
echo_quest "Nome da Conexao Bridge."
read network

if [[ -z $img_name || -z $ct_name || -z $network ]]
then
    echo_error 'Dados nao fornecidos'
    exit 0
fi

echo_info "Analisando disponibilidade da imagem"
# lxc image show $img_name || ( echo "Não há local, iniciando pesquisa e download" && lxc image copy images:$img_name )
echo_info "Buscando imagem local ou remoto"
lxc launch $img_name $ct_name -c security.privileged=true
# lxc launch $img_name $ct_name
echo_info "[ creanting NETWORK if ] $network"
lxc network create $network
echo_info "[ attaching NETWORK ] $network"
lxc network attach $network $ct_name
# sleep 30
update
lxc exec $ct_name -- sh -c "apt-get -y upgrade"
lxc exec $ct_name -- sh -c "apt-get -y install build-essential"
lxc exec $ct_name -- sh -c "apt-get -y install openssh-server"
lxc exec $ct_name -- sh -c "apt-get -y install perl-modules"





# lxc exec $ct_name -- sh -c "apt-get -y install rsync"







echo_quest "Vai querer auditar esta vm (container) [yN]?"
read audit
if [[ $audit =~ ^[yY][[:blank:]]*$ ]]
then
    lxc exec $ct_name -- sh -c "apt-get -y install software-properties-common"
    lxc exec $ct_name -- sh -c 'apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C80E383C3DE9F082E01391A0366C67DE91CA5D5F'
    lxc exec $ct_name -- sh -c 'add-apt-repository "deb [arch=amd64] https://packages.cisofy.com/community/lynis/deb/ xenial main"'
    update
    lxc exec $ct_name -- sh -c "apt-get -y install lynis"
fi

lxc list

echo_quest "Qual o nome do novo usuario?"
read new_user

[[ ! -z $new_user ]] || ( echo "Tem que ter novo usuario" && exit 1 )

lxc exec $ct_name -- /bin/bash -c "adduser $new_user --disabled-password"
lxc exec $ct_name -- /bin/bash -c "passwd -d $new_user"
# lxc exec $ct_name -- /bin/bash -c "passwd -d $new_user"

echo_info "Voce ja esta em $ct_name. Siga os passos."
echo ""
echo_quest "Copie a linha abaixo:"
echo_code "$new_user ALL=NOPASSWD: ALL"
echo_quest "Cole no editor que abrira apos o comando abaixo. Salve e saia do editor."
echo_code "visudo"
echo_quest "Digite:"
echo_code "exit"

lxc exec $ct_name -- sh -c "bash"

# echo_info "Removento padrao: ubuntu"
# lxc exec $ct_name -- sh -c "sudo deluser --remove-home --remove-all-files ubuntu &>/dev/null"
# lxc exec $ct_name -- sh -c "sudo echo '----------------------------------------------------------------------------------------------
# You are accessing a XYZ Government (XYZG) Information System (IS) that is provided for authorized use only.
# By using this IS (which includes any device attached to this IS), you consent to the following conditions:

# + The XYZG routinely intercepts and monitors communications on this IS for purposes including, but not limited to,
# penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM),
# law enforcement (LE), and counterintelligence (CI) investigations.

# + At any time, the XYZG may inspect and seize data stored on this IS.

# + Communications using, or data stored on, this IS are not private, are subject to routine monitoring,
# interception, and search, and may be disclosed or used for any XYZG authorized purpose.

# + This IS includes security measures (e.g., authentication and access controls) to protect XYZG interests--not
# for your personal benefit or privacy.

# + Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching
# or monitoring of the content of privileged communications, or work product, related to personal representation
# or services by attorneys, psychotherapists, or clergy, and their assistants. Such communications and work
# product are private and confidential. See User Agreement for details.
# ----------------------------------------------------------------------------------------------' > /etc/issue"

echo_info "Acessando $ct_name ..."
echo_info "Instrucoes para remover o acesso root:"
echo_quest "Copie as linhas abaixo, do jeito que esta (com espacos tambem):"
echo_code "X11Forwarding no
PasswordAuthentication no

Match User root
    PasswordAuthentication yes"
echo_quest "Cole no final do arquivo:"
echo_code "vi /etc/ssh/sshd_config #(note a letra 'd', no 'sshd_config'.)"
echo_info ""
echo_info "(Se houver 'X11Forwarding yes', troque pra 'X11Forwarding no'."
echo_info ""
echo_info "Digite:"
echo_code "service sshd restart"
echo ""
echo_info "Confira se nao imprime erro"
echo_code "sshd -t"
echo ""
echo_code "exit"
lxc exec $ct_name -- sh -c "bash"

echo_quest "Quer gerar as keys na sua maquina (no caso de ainda nao ter)? [yN]"
read is_gen_key

if [[ $is_gen_key =~ ^[yY][[:blank:]]*$ ]]
then
    ssh-keygen -t rsa -b 4096
    # echo_info "Abra outro terminal (ou aba), de permissao 400 no arquivo.pub gerado. Algo como:"
    # echo_code "chmod 400 ~/.ssh/id_rsa" 
fi


path_key="~/.ssh/id_rsa.pub"
echo_quest "Qual o caminho da sua public key? Se estiver em '~/.ssh/id_rsa.pub', apenas aperte enter"
read path_key_new

[[ ! -z $path_key_new ]] && $path_key=$path_key_new

echo ""
sudo sh -c "cat $path_key"
echo ""

lxc exec $ct_name -- sudo -H -u $new_user bash -c "mkdir -p /home/$new_user/.ssh"    
lxc exec $ct_name -- sudo -H -u $new_user bash -c "chmod 700 /home/$new_user/.ssh"    
lxc exec $ct_name -- sudo -H -u $new_user bash -c "touch /home/$new_user/.ssh/authorized_keys"    
lxc exec $ct_name -- sudo -H -u $new_user bash -c "chmod 600 /home/$new_user/.ssh/authorized_keys"    

echo_quest "Copie sua public key (deve ter sido impressa), para o container $ct_name, no seguinte diretorio:"
echo ""
echo_code "vi /home/$new_user/.ssh/authorized_keys"
echo_code "service sshd restart"
echo_code "sshd -t"
echo ""
echo_code "exit"
lxc exec $ct_name -- bash

lxc list $ct_name
echo ""
echo_info "Maquina pronta, pra acessar: "
echo_info "ssh $new_user@ip.da.vm.aqui"
echo ""
echo_info "Como proximo passo, seria interessante publicar este conteinar como imagem, criei um script pra auxiliar nisto tambem."
