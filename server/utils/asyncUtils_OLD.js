import Promise from 'bluebird'

const asyncUtils = {}

/**
 * Adicionando async methods (eg.: redisClient.hmgetAsync)
 * Modifica o objeto (not immutable)
 * @param {object} objInstance
 * @param {array} methodsToAsync
 */
asyncUtils.promisify = function (objInstance, ...methodsToAsync) {
  /* Adicionando async methods (eg.: redisClient.hmgetAsync) */
  methodsToAsync.forEach((methodName) => {
    objInstance[`${methodName}Async`] = Promise.promisify(objInstance[methodName].bind(objInstance))
  })
}

// module.exports = asyncUtils
