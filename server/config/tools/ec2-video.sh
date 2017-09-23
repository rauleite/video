#!/bin/bash

# Alterar variavel host se necessário
# No terminal fazer: ec2-video.sh <13.59.195.165>

host="/home/$USER/dev/video"
ip_remoto=$1
dns_ip="ec2-${ip_remoto//./-}"
dns_zone=".us-east-2.compute.amazonaws.com"
remote_user="ubuntu"
pem="$host/server/config/aws/free.pem"
run="sudo ssh -i $pem $remote_user@$dns_ip$dns_zone"

echo $run

$run