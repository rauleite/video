/**
 * Carrega path corretamente, (eg. production = 'dist-server')
 * @param {string} path
 */
module.exports.load = function (path) {
  let serverPath = process.env.NODE_ENV === 'production'
    ? 'dist-server'
    : 'server'

  return require(path.replace(/server/, serverPath))
}
