FROM nginx:1.13.0-alpine

MAINTAINER rauleite

ENV path /web

COPY build ${path}
COPY public ${path}/public
COPY config/proxy/ssl /var/ssl
COPY config/proxy/nginx.conf /etc/nginx/nginx.conf
COPY config/proxy/default /etc/nginx/sites-enabled/default


# server_name melhore-local.me melhore.me localhost 192.168.137.252 172.18.0.1;

# WORKDIR $path

# CMD ["nginx", "-g", "daemon off;"]

# ADD web/package.json ${path}

# RUN cd ${path} && yarn install
# RUN cd ${path} && yarn build
# RUN rm -r ${path}/src