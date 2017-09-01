const redis = require('redis')
const log = require('debug')
const Promise = require('bluebird')
const project = require('../../config/project.config')

/* Promisify methods */
Promise.promisifyAll(redis)

const redisClient = redis.createClient({
  host: project.redis_host
})

redisClient.on('connect', () => {
  console.debug(`Redis connection open`)
})

module.exports = redisClient
