'use strict';

var _utilsAuth = require('./utils-auth');

var PassportLocalStrategy = require('passport-local').Strategy;

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, function (req, email, password, done) {
  return (0, _utilsAuth.signup)(req, email, password, done);
});
//# sourceMappingURL=local-signup.js.map