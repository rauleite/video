#/bin/bash
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