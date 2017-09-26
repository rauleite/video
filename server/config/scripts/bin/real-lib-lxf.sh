#!/bin/bash
source lxf-colors.sh

file=$1
msg_error=""

usage () {
    echo_error "$msg_error"
    echo_info "Usage:"
    echo_command "lxf <file>"
    echo_info "Ex.: arquivo 'lxf-app.sh': lxf lxf-app.sh | lxf app | lxf lxf-app | lxf app.sh"
}
function get_file() {

    if [[ -z $file ]]
    then
        usage
        exit 1
    fi

    has_file=""
    file_to_source=""
    if [[ $file =~ ^(lxf-).*$ ]]
    then
        if [[ -f "$file" ]]
        then
            has_file="true"
            file_to_source="$file"
        elif [[ -f "${file}.sh" ]]
        then
            has_file="true"
            file_to_source="${file}.sh"
        fi        
    else
        if [[ -f "lxf-${file}" ]]
        then
            has_file="true"
            file_to_source="lxf-${file}"
        elif [[ -f "lxf-${file}.sh" ]]
        then
            has_file="true"
            file_to_source="lxf-${file}.sh"
        fi
    fi

    if [[ -z $has_file ]]
    then
        msg_error="Arquivo não encontrado"
        usage
        exit 1
    fi
}
function lexico () {
    ### Analise de lexico ###
    keywords=( \
        "COPY_SSH" \
        "DEST_PATH" \
        "ENV" \
        "EXEC_SSH" \
        "FILES" \
        "FILES_SSH" \
        "FROM" \
        "HOST_EXEC" \
        "VAR" \
    )

    readarray lines_file < $file_to_source
    file_size=${#lines_file[@]}
    file_length=$(( file_size - 1 ))

    keywords_size=${#keywords[@]}
    keywords_length=$(( keywords_size - 1 ))

    for (( i=0; i<=$file_length; i++ ))
    do 
        line=${lines_file[$i]}
        # line Trim
        line="$(echo -e "${line}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

        # Aceita \ como que continua na linha de baixo
        last_char=${line##* }
        if [[ $last_char == "\\" ]]
        then
            next=$(( i + 1 ))
            lines_file[$next]="$line${lines_file[$next]}"
            continue
        fi

        file_key_word=$(echo "$line" | awk '{print $1;}')

        # word Trim
        file_key_word="$(echo -e "${file_key_word}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

        # Linha em branco
        [[ -z $file_key_word || ${file_key_word:0:1} == "#" ]] && continue
        
        for (( j=0; j<=$keywords_length; j++ ))
        do
            keyword=${keywords[j]}
            if [[ $file_key_word =~ ^($keyword)$ ]]
            then
                break
            fi
            if [[ $j == $keywords_length ]]
            then
                echo_error "Keyword '${file_key_word}' desconhecido"
                exit 1
            fi
        done
    done
}

get_file
lexico

source lxf-file-lib.sh
source $file_to_source