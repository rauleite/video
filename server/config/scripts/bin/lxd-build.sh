#!/bin/bash
# Build geralmente apartir de uma particao pura
# 
# Usado para instalacoes bem essenciais (que precise em todas as maquinas)
# mas principalmente as configuracoes, como criar novo usuario, deletar o 
# anterior padrao (ubuntu), deixar ssh server configurado, com sua devida chave
# 
# Diferenca pro comando lxd-<container>.sh eh que este outro, serve pra buids
# esclusivos de perfil de maquina, como db, proxy, webapp. Ele eh para ser usado
# na sequencia apos este build.
# 
# Pode rodar em container existente, para criacao de novo usuario

source lxd-lib.sh

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

exists_container $ct_name
if [[ $? != "0" ]]
then
    echo_info "Analisando disponibilidade da imagem"
    # lxc image show $img_name || ( echo "Não há local, iniciando pesquisa e download" && lxc image copy images:$img_name )
    echo_info "Buscando imagem local ou remoto"
    # lxc launch $img_name $ct_name -c security.privileged=true
    lxc launch $img_name $ct_name
    # lxc launch $img_name $ct_name
    echo_info "[ creanting NETWORK if ] $network"
    lxc network create $network
    echo_info "[ attaching NETWORK ] $network"
    lxc network attach $network $ct_name
    lxc restart $ct_name
fi
# sleep 30
update
upgrade
install "build-essential"
install "openssh-server"
install "perl-modules"
install "rsync"

echo_quest "Vai querer auditar esta vm (container) [yN]?"
read audit
if [[ $audit =~ ^[yY][[:blank:]]*$ ]]
then
    # lxc exec $ct_name -- sh -c "apt-get -y install software-properties-common"
    install "software-properties-common"
    exec_cmd 'apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C80E383C3DE9F082E01391A0366C67DE91CA5D5F'
    exec_cmd 'add-apt-repository "deb [arch=amd64] https://packages.cisofy.com/community/lynis/deb/ xenial main"'
    update
    install "lynis"
fi

echo_info "Removento padrao: ubuntu"
exec_cmd "deluser --remove-home --remove-all-files ubuntu &>/dev/null"

lxc list

echo_quest "Qual o nome do novo usuario?"
read user_name

[[ ! -z $user_name ]] || ( echo "Tem que ter novo usuario" && exit 1 )

exec_cmd "adduser $user_name --disabled-password"
exec_cmd "passwd -d $user_name"

echo_info "Voce ja esta em $ct_name. Siga os passos."
echo_quest "Copie a linha abaixo:"
echo_code "$user_name ALL=NOPASSWD: ALL"
echo_quest "Cole no editor que abrira apos o comando abaixo. Salve e saia do editor."
echo_code "visudo"
echo_quest "Digite:"
echo_code "exit"

exec_cmd "bash"

exec_cmd 'echo "----------------------------------------------------------------------------------------------
# You are accessing a $ct_name Government (${ct_name}G) Information System (IS) that is provided for authorized use only.
# By using this IS (which includes any device attached to this IS), you consent to the following conditions:

# + The ${ct_name}G routinely intercepts and monitors communications on this IS for purposes including, but not limited to,
# penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM),
# law enforcement (LE), and counterintelligence (CI) investigations.

# + At any time, the ${ct_name}G may inspect and seize data stored on this IS.

# + Communications using, or data stored on, this IS are not private, are subject to routine monitoring,
# interception, and search, and may be disclosed or used for any ${ct_name}G authorized purpose.

# + This IS includes security measures (e.g., authentication and access controls) to protect ${ct_name}G interests--not
# for your personal benefit or privacy.

# + Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching
# or monitoring of the content of privileged communications, or work product, related to personal representation
# or services by attorneys, psychotherapists, or clergy, and their assistants. Such communications and work
# product are private and confidential. See User Agreement for details.
# ----------------------------------------------------------------------------------------------" > /etc/issue'

echo_info "Acessando $ct_name ..."
echo_info "Instrucoes para remover o acesso root:"
echo_quest "Copie as linhas abaixo, do jeito que esta (com espacos tambem):"
echo_code "X11Forwarding no
PasswordAuthentication no

Match User root
    PasswordAuthentication yes"
echo_quest "Cole no final do arquivo, depois salve e saia do editor:"
echo_code "vi /etc/ssh/sshd_config #(note a letra 'd', no 'sshd_config'.)"
echo_info "(Se houver 'X11Forwarding yes', troque pra 'X11Forwarding no'."
echo_info ""
echo_quest "Digite:"
echo_code "service sshd restart"
echo ""
echo_quest "Confira se nao imprime erro"
echo_code "sshd -t"
echo ""
echo_code "exit"
exec_cmd "bash"

echo_quest "Quer gerar as keys na sua maquina (no caso de ainda nao ter)? [yN]"
read is_gen_key

if [[ $is_gen_key =~ ^[yY][[:blank:]]*$ ]]
then
    ssh-keygen -t rsa
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

exec_cmd_user "mkdir -p /home/$user_name/.ssh"
exec_cmd_user "chmod 700 /home/$user_name/.ssh"
exec_cmd_user "touch /home/$user_name/.ssh/authorized_keys"
exec_cmd_user "chmod 600 /home/$user_name/.ssh/authorized_keys"

echo_quest "Copie sua public key (deve ter sido impressa), para o container $ct_name, no seguinte diretorio:"
echo ""
echo_code "vi /home/$user_name/.ssh/authorized_keys"
echo_code "service sshd restart"
echo_code "sshd -t"
echo ""
echo_code "exit"
exec_cmd "bash"

lxc list $ct_name
echo_info "Maquina pronta, pra acessar: "
echo_info "ssh $user_name@ip.da.vm.aqui"
echo_info "Como proximo passo, pode ser que voce queira publicar este conteiner como imagem, criei um script pra auxiliar nisto tambem."
