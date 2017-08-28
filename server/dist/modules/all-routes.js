'use strict';

var _login = require('./auth/login');

var _login2 = _interopRequireDefault(_login);

var _signup = require('./auth/signup');

var _signup2 = _interopRequireDefault(_signup);

var _forgot = require('./auth/forgot');

var _forgot2 = _interopRequireDefault(_forgot);

var _reset = require('./auth/reset');

var _reset2 = _interopRequireDefault(_reset);

var _logout = require('./auth/logout');

var _logout2 = _interopRequireDefault(_logout);

var _social = require('./auth/social');

var _social2 = _interopRequireDefault(_social);

var _dashboard = require('./api/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _authCheck = require('../middleware/auth-check');

var _authCheck2 = _interopRequireDefault(_authCheck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import redirect from './misc/redirect'
module.exports = function (app) {
  /* All api path, should be authenticaded */
  app.use('/api', _authCheck2.default, _dashboard2.default);

  app.use('/auth/login', _login2.default);
  app.use('/auth/signup', _signup2.default);
  app.use('/auth/forgot', _forgot2.default);
  app.use('/auth/reset', _reset2.default);
  app.use('/auth/logout', _logout2.default);
  app.use('/auth/social', _social2.default);
  // app.use('/misc/redirect', redirect)
};
//# sourceMappingURL=all-routes.js.map