#!/bin/bash

# Alterar variavel host se necessário
# No terminal fazer: ec2-video.sh <13.59.195.165>

# sudo scp -i server/config/aws/free.pem ./config.tar.gz ubuntu@ec2-18-220-205-21.us-east-2.compute.amazonaws.com:~/video

host="/home/$USER/dev/video"
file_to_send="$host/config.tar.gz"
remote_directory="~/video"

# if not null
if ! [ -z $1 ]; then
    ip_remoto=$1
fi

remote_user="ubuntu"
pem="$host/server/config/aws/free.pem"
run="sudo scp -i $pem $file_to_send $remote_user@$ip_remoto:$remote_directory"

echo $run

$run