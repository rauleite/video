import login from './auth/login'
import signup from './auth/signup'
import forgot from './auth/forgot'
import reset from './auth/reset'
import logout from './auth/logout'
import social from './auth/social'
// import redirect from './misc/redirect'
import dashboard from './api/dashboard'

import authCheck from '../middleware/auth-check'

// const BASE_API = '/api'
const BASE_API = ''
const BASE_AUTH = `${BASE_API}/auth`

module.exports = (app) => {
  /* All api path, should be authenticaded */
  app.use('/api', authCheck, dashboard)

  app.use(`${BASE_AUTH}/login`, login)
  app.use(`${BASE_AUTH}/signup`, signup)
  app.use(`${BASE_AUTH}/forgot`, forgot)
  app.use(`${BASE_AUTH}/auth/reset`, reset)
  app.use(`${BASE_AUTH}/auth/logout`, logout)
  app.use(`${BASE_AUTH}/auth/social`, social)
  // app.use('/misc/redirect', redirect)
}
