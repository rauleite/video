const redis = require('redis')
const log = require('debug')
const Promise = require('bluebird')
const project = require('../../config/project.config')

/* Promisify methods */
Promise.promisifyAll(redis)

const debug = log('app:bin:dev-server')

console.log('------> REDIS_HOST:', process.env.REDIS_HOST || 'localhost')

const redisClient = redis.createClient({
  // host: project.redis_host
  host: process.env.REDIS_HOST || 'localhost'
  
})

redisClient.on('connect', () => {
  debug(`Redis connection open`)
})

module.exports = redisClient
