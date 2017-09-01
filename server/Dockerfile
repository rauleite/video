FROM node:8.4.0-alpine

MAINTAINER rauleite

ENV path /server

COPY build ${path}/build
COPY config ${path}/config
COPY utils ${path}/utils
COPY package.json $path
# COPY config/ /config

RUN cd ${path} && yarn install
# RUN cd ${path} && yarn build
# RUN rm -r ${path}/src

WORKDIR $path


ENTRYPOINT yarn start

# ENV local_path /home/raul/dev/video

# ADD ${local_path}/server/src ${path}/src
# ADD ${local_path}/server/utils ${path}/utils
# ADD ${local_path}/server/package.json $path
# ADD ${local_path}/config/ /config
