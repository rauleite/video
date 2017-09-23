import { sendData } from './ajax'

// export function sendForm (path, data, dispatch, callback) {

  /**
   * Send Request Data
   * @param {string} path
   * @param {object} data
   * @param {function} callback
   */
export function sendForm (path, data, callback) {
  sendData(path, data, (error, res) => {
    if (error) {
      const errors = error.erros ? error.erros : {}
      errors.summary = error.message
      return callback(errors, res)
    }
    return callback(null, res)
  })
}
