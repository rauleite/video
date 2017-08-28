'use strict';

require('babel-polyfill');

require('babel-core/register');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _project = require('../config/project.config');

var _project2 = _interopRequireDefault(_project);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import localSignupStrategy from './strategies/local-signup'
// import localLoginStrategy from './strategies/local-login'

var debug = (0, _debug2.default)('app:bin:dev-server');
var app = (0, _express2.default)();

/* Para uso de informacoes do proxy, como ler headers, para o limit-express */
app.enable('trust proxy', true);
app.enable('trust proxy', 'loopback');

// tell the app to parse HTTP body messages
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

/* pass the passport middleware */
app.use(_passport2.default.initialize());

require('../bin/dev-server')(app);

/* load passport strategies */
_passport2.default.use('local-signup', require('./strategies/local-signup'));
_passport2.default.use('local-login', require('./strategies/local-login'));

// app.use(express.static(project.paths.public()))

app.disable('x-powered-by');

var redisClient = require('../bin/redis-connect');
var limiter = require('express-limiter')(app, redisClient);

/* Prevent's DDOs attack */

/* Max de 75 req por 5 minutos - media de 1 req a cada 4 segundos */
limiter({
  path: '*',
  method: 'all',
  total: 75,
  expire: 1000 * 60 * 5,
  lookup: 'ip'
});

/* Max de 1 req a cada 2 segundos */
limiter({
  path: '*',
  method: 'post',
  total: 1,
  expire: 1000 * 2,
  lookup: 'ip'
});

// routes
require('./modules/all-routes')(app);

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement universal
// rendering, you'll want to remove this middleware.
// app.use('*', function (req, res, next) {
//   const filename = path.join(compiler.outputPath, 'index.html')
//   compiler.outputFileSystem.readFile(filename, (err, result) => {
//     if (err) {
//       return next(err)
//     }
//     res.set('content-type', 'text/html')
//     res.send(result)
//     res.end()
//   })
// })

module.exports = app;
//# sourceMappingURL=index.js.map