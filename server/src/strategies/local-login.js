import jwt from 'jsonwebtoken'
import config from '../../config/project.config'
import { getDateNowFormartNormalizer } from '../utils'
import { login } from './utils-auth'
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
  return login(email, password, done)
})
