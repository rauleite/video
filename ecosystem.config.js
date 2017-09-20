module.exports = {
  apps : [{
    name        : "app",
    script      : "./server/build",
    watch       : true,
    instances   : 1,
    env: {
      "NODE_ENV": "development",
      // "MONGO_HOST": "db",
    },
    env_production : {
      "NODE_ENV": "production",
      "MONGO_HOST": "db",
    }
  },{
    name       : "api-app",
    script     : "./api.js",
    exec_mode  : "cluster"
  }]
}