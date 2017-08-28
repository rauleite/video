# Enviroment
db: docker-compose db
mem: docker-compose mem

env: docker-compose up

# WEB
web: sh -c 'cd ./web && export NODE_ENV=development && export PORT=3001 && exec npm run start'

# SERVER
server: sh -c 'cd ./server && export NODE_ENV=development && export PORT=3000 && npm run dev'
