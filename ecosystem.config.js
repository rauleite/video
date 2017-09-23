module.exports = {
  apps : [{
    name        : "app",
    script      : "./build",
    watch       : true,
    instances   : 1,
    env: {
      "NODE_ENV": "development",
      // "MONGO_HOST": "db",
    },
    env_production : {
      "NODE_ENV": "production",
      "MONGO_HOST": "db",
      "TESTE_RSYNC": "teste",
    }
  },{
    name       : "api-app",
    script     : "./api.js",
    exec_mode  : "cluster"
  }]
}