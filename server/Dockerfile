FROM node:8.4.0-alpine

MAINTAINER rauleite

ENV path /server

COPY src ${path}/src
COPY config ${path}/config
COPY package.json $path

RUN cd ${path} && yarn install && yarn build
# RUN rm -r ${path}/src

WORKDIR $path


ENTRYPOINT cd $path && yarn start
