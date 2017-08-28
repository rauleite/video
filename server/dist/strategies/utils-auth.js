'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.facebookAsync = undefined;

var login = exports.login = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email, password, done) {
    var userData, user, err, isMatch, error;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userData = {
              email: email.trim(),
              password: password.trim()
            };
            _context.next = 3;
            return User.findOneAsync({ email: userData.email });

          case 3:
            user = _context.sent;
            _context.prev = 4;

            if (user) {
              _context.next = 9;
              break;
            }

            err = new Error('Você digitou login ou senha errado');

            err.name = 'IncorrectCredentialsError';

            return _context.abrupt('return', done(err));

          case 9:
            _context.next = 11;
            return user.comparePassword(userData.password);

          case 11:
            isMatch = _context.sent;

            if (isMatch) {
              _context.next = 16;
              break;
            }

            error = new Error('Você digitou login ou senha errado');

            error.name = 'IncorrectCredentialsError';

            return _context.abrupt('return', done(error));

          case 16:

            createToken(user, done);
            // return done(null, token, { name: user.name })
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](4);

            console.error('ERRO:', _context.t0);

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 19]]);
  }));

  return function login(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.signup = signup;
exports.facebook = facebook;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _project = require('../../config/project.config');

var _project2 = _interopRequireDefault(_project);

var _utils = require('../utils');

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = (0, _bluebird.promisifyAll)(require('mongoose').model('User'));

var facebookAsync = exports.facebookAsync = (0, _bluebird.promisify)(facebook);

function signup(req, email, password, done) {
  var newUser = new User({
    email: email.trim(),
    password: password.trim(),
    name: req.body.name.trim()
  });

  newUser.save(function (error) {
    console.log(error);
    if (error) {
      return done(error);
    }

    return done(null);
  });
}

function facebook(user, done) {
  createToken(user, done);
}

function createToken(user, done) {
  console.log('criando token');
  /* 7 dias (sec, min, hour, day) */
  // const timeExpires = 60 * 60 * 24 * 7
  var timeExpires = 60;

  // create a token string
  var token = _jsonwebtoken2.default.sign({ sub: user._id }, _project2.default.jwt_secret, { expiresIn: timeExpires });

  user.validToken = token;
  user.validTokenExpires = (0, _utils.getDateNowFormartNormalizer)(timeExpires);
  user.save(function (error) {
    if (error) {
      console.error('ERRO GRAVE: - token.validToken', error);
      done(error);
      return;
    }
  });

  done(null, token, { name: user.name });
  return;
}
//# sourceMappingURL=utils-auth.js.map