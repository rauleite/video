module.exports = function (app) {
  const project = require('../../config/project.config')
  require('../models/user')
  require('../models/captcha')
  // require('./env').load('../src/models/user')
  // require('./env').load('../src/models/captcha')
  


  const connectMongo = require('./mongo-connect')
  // const app = require('./env').load('../server/main')
  
  // const https = require('https')
  // const fs = require('fs')
  
  const log = require('debug')
  const debug = log('app:bin:dev-server')
  
  console.log('----------> process.env.MONGO_HOST:', process.env.MONGO_HOST)
  console.log('----------> process.env.REDIS_HOST:', process.env.REDIS_HOST)
  
  // const options = {
  //   cert: fs.readFileSync(project.ssl_cert),
  //   key: fs.readFileSync(project.ssl_key)
  // }
  
  // const server = https.createServer(options, app)
  connectMongo(() => {
    app.listen(project.server_port, (error) => {
      if (error) {
        console.error('Erro --> ', error)
        return
      }
      debug(`Server is now running at http://localhost:${project.server_port}.`)
    })
  })
}
