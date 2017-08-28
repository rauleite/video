import { verifyAuthentication, getHeaderToken } from '../utils'

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  // get the last part from a authorization header string like "bearer token-value"
  return (async () => {
    if (!req.headers.authorization) {
      return res.status(401).end()
    }

    try {
      const token = getHeaderToken(req)
      const user = await verifyAuthentication(token)

      if (!user) {
        return res.status(401).end()
      }
      console.info('USSER', user)

      return next()
    } catch (error) {
      console.log('ERRO GRAVE:', err)
      return res.status(401).end()
    }
  })()
}
