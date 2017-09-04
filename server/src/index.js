import 'babel-polyfill'
import 'babel-core/register'
import express from 'express'
import log from 'debug'
import path from 'path'
import project from '../config/project.config'
import bodyParser from 'body-parser'
import passport from 'passport'
// import localSignupStrategy from './strategies/local-signup'
// import localLoginStrategy from './strategies/local-login'

const app = express()

/* Para uso de informacoes do proxy, como ler headers, para o limit-express */
app.enable('trust proxy', true)
app.enable('trust proxy', 'loopback')

// tell the app to parse HTTP body messages
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* pass the passport middleware */
app.use(passport.initialize())

require('./connect/server')(app)

/* load passport strategies */
passport.use('local-signup', require('./strategies/local-signup'))
passport.use('local-login', require('./strategies/local-login'))

/* NGINX serve em producao, mas pode descomentar pra testar o build localmente */
// console.log('project.build_path', project.build_path)
// app.use(express.static(project.build_path))

app.disable('x-powered-by')

const redisClient = require('./connect/redis-connect')
const limiter = require('express-limiter')(app, redisClient)

/* Prevent's DDOs attack */

/* Max de 75 req por 5 minutos - media de 1 req a cada 4 segundos */
limiter({
  path: '*',
  method: 'all',
  total: 75,
  expire: 1000 * 60 * 5,
  lookup: 'ip'
})

/* Max de 1 req a cada 2 segundos */
limiter({
  path: '*',
  method: 'post',
  total: 1,
  expire: 1000 * 2,
  lookup: 'ip'
})


// routes
require('./modules/all-routes')(app)

module.exports = app
