FROM nginx:1.13.0-alpine

MAINTAINER rauleite

ENV path /web

COPY build ${path}
COPY public ${path}/public
COPY config/proxy/ssl /var/ssl
# COPY config/proxy/nginx.conf /etc/nginx/nginx.conf
# COPY config/proxy/default /etc/nginx/sites-enabled/default

# VOLUME ["/etc/nginx/", "/etc/nginx/sites-enabled/"]
