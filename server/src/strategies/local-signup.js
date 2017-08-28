import { login, signup } from './utils-auth'
const PassportLocalStrategy = require('passport-local').Strategy

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  return signup(req, email, password, done)
})
