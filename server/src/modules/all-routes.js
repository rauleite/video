import login from './auth/login'
import signup from './auth/signup'
import forgot from './auth/forgot'
import reset from './auth/reset'
import logout from './auth/logout'
import social from './auth/social'
// import redirect from './misc/redirect'
import dashboard from './api/dashboard'

import authCheck from '../middleware/auth-check'

module.exports = (app) => {
  /* All api path, should be authenticaded */
  app.use('/api', authCheck, dashboard)

  app.use('/auth/login', login)
  app.use('/auth/signup', signup)
  app.use('/auth/forgot', forgot)
  app.use('/auth/reset', reset)
  app.use('/auth/logout', logout)
  app.use('/auth/social', social)
  // app.use('/misc/redirect', redirect)
}
