'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _project = require('../../config/project.config');

var _project2 = _interopRequireDefault(_project);

var _utils = require('../utils');

var _utilsAuth = require('./utils-auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  return (0, _utilsAuth.login)(email, password, done);
});
//# sourceMappingURL=local-login.js.map