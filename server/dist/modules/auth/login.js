'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doLogin = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var doLogin = exports.doLogin = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function doLogin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var resultSend = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, status, respObj) {
    var objCaptcha, replyCountExpires, isOk, replyIncrCount, hasCaptchaOk, delIsOK;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            respObj.hasCaptchaComponent = respObj.hasCaptchaComponent || false;

            objCaptcha = {
              email: req.body.email,
              count: 0,
              countExpires: Date.now() + 3600000,
              hasCaptcha: false
            };
            _context3.next = 5;
            return _redisConnect2.default.hmgetAsync(req.body.email, 'countExpires');

          case 5:
            replyCountExpires = _context3.sent;


            replyCountExpires = Number(replyCountExpires);

            console.log('replyCountExpires', replyCountExpires);

            /* Se nao existe, cria novo */

            if (!(replyCountExpires === 0)) {
              _context3.next = 15;
              break;
            }

            _context3.next = 11;
            return _redisConnect2.default.hmsetAsync(req.body.email, objCaptcha);

          case 11:
            isOk = _context3.sent;

            console.log('replyCountExpires cria', isOk);
            console.log('res.json', respObj);
            return _context3.abrupt('return', res.status(status).json(respObj));

          case 15:
            if (!(replyCountExpires < Date.now() || !respObj.success)) {
              _context3.next = 29;
              break;
            }

            console.log('!respObj.success');
            _context3.next = 19;
            return _redisConnect2.default.hincrbyAsync(objCaptcha.email, 'count', 1);

          case 19:
            replyIncrCount = _context3.sent;

            console.log('replyIncrCount', replyIncrCount);

            /* count maior que 2 */

            if (!(replyIncrCount >= 2)) {
              _context3.next = 27;
              break;
            }

            _context3.next = 24;
            return _redisConnect2.default.hmsetAsync(objCaptcha.email, 'hasCaptcha', true);

          case 24:
            hasCaptchaOk = _context3.sent;

            console.log('set hasCaptcha true', hasCaptchaOk);
            respObj.hasCaptchaComponent = true;

          case 27:
            console.log('res.json', respObj);
            return _context3.abrupt('return', res.status(status).json(respObj));

          case 29:

            /* Sucesso no form (senha e login ok) */
            console.log('Tudo ok');
            _context3.next = 32;
            return _redisConnect2.default.del(objCaptcha.email);

          case 32:
            delIsOK = _context3.sent;

            console.log('delIsOK', delIsOK);
            /* Só pra garantir */
            respObj.hasCaptchaComponent = false;
            console.log('res.json', respObj);
            return _context3.abrupt('return', res.status(status).json(respObj));

          case 39:
            _context3.prev = 39;
            _context3.t0 = _context3['catch'](0);

            console.error('ERRO GRAVE: ', _context3.t0);
            return _context3.abrupt('return');

          case 43:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 39]]);
  }));

  return function resultSend(_x7, _x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _redisConnect = require('../../../bin/redis-connect');

var _redisConnect2 = _interopRequireDefault(_redisConnect);

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _utils = require('../../utils');

var _project = require('../../../config/project.config');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var passport = (0, _bluebird.promisifyAll)(_passport2.default);
var router = new _express2.default.Router();

router.post('/', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var captchaValue, validation, hasCaptcha, secretKey, remoteIP, verificationUrl, responseCaptcha;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // doLogin(req, res, next)
            // console.log('req.connection.remoteAddress', req.connection.remoteAddress)
            // console.log('req.headers.x-forwarded-for', req.headers['x-forwarded-for'])
            // console.log('req.headers.x-real-ip', req.headers['x-real-ip'])
            // console.log('req.ip', req.ip)
            // console.log('req.ips', req.ips)
            console.log('--> auth/login', req.body);
            _context.prev = 1;

            if (hasCorrectLoginBody(req.body)) {
              _context.next = 5;
              break;
            }

            console.error('ERRO GRAVE: request body enviado errado');
            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: 'Erro no formulário. Favor preencher corretamente.'
            }));

          case 5:
            captchaValue = req.body.captchaValue;
            validation = validateLoginForm(req.body);

            if (validation.success) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', resultSend(req, res, '400', {
              success: false,
              message: validation.message,
              errors: validation.errors
            }));

          case 9:
            _context.next = 11;
            return _redisConnect2.default.hmgetAsync(req.body.email, 'hasCaptcha');

          case 11:
            hasCaptcha = _context.sent;

            /* retorno vem null ou string representando true ou false */
            hasCaptcha = hasCaptcha[0];
            hasCaptcha = hasCaptcha === 'true';

            /* Se nao ha captcha retorna null, quando ha retorna string do boolean */

            if (!hasCaptcha) {
              _context.next = 31;
              break;
            }

            console.log('ha captcha no redis');

            /* Se ha captcha mas browser nao preencheu */

            if (!(0, _lodash.isEmpty)(captchaValue)) {
              _context.next = 19;
              break;
            }

            console.log('NAO foi preenchido pelo browser');

            return _context.abrupt('return', resultSend(req, res, '400', {
              success: false,
              message: 'O captcha precisa ser preenchido',
              errors: {
                captcha: 'O captcha precisa ser preenchido'
              }
            }));

          case 19:
            console.log('FOI preenchido pelo browser');

            /* Se ha captcha e browser preencheu-o */
            secretKey = _project2.default.captcha_secret;
            remoteIP = req.connection.remoteAddress.split(':');

            remoteIP = remoteIP[remoteIP.length - 1];

            verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + captchaValue + '&remoteip=' + remoteIP;
            _context.next = 26;
            return (0, _requestPromise2.default)(verificationUrl);

          case 26:
            responseCaptcha = _context.sent;


            responseCaptcha = JSON.parse(responseCaptcha);
            console.log('responseCaptcha', responseCaptcha);

            if (responseCaptcha.success) {
              _context.next = 31;
              break;
            }

            return _context.abrupt('return', resultSend(req, res, '400', {
              success: false,
              message: 'Erro na verificação do captcha',
              errors: {
                captcha: 'Erro na verificação do captcha'
              }
            }));

          case 31:
            _context.next = 36;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context['catch'](1);

            console.log('error', _context.t0);

          case 36:

            passport.authenticate('local-login', function (error, token, userData) {
              console.log('error', error);
              console.log('token', token);
              console.log('userData', userData);

              if (error) {
                if (error.name === 'IncorrectCredentialsError') {
                  return resultSend(req, res, '400', {
                    success: false,
                    message: error.message
                  });
                }

                return resultSend(req, res, '400', {
                  success: false,
                  message: 'Não foi possível processar o formulário.'
                });
              } else if (!userData) {
                // Em tese nunca cai aqui
                return resultSend(req, res, '400', {
                  success: false,
                  message: 'Não foi possível processar o formulário.'
                });
              }

              return resultSend(req, res, '200', {
                success: true,
                message: 'Você efetuou o login, com sucesso!',
                token: token,
                user: userData
              });
            })(req, res, next);

          case 37:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 33]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(user) {
  var errors = {};
  var isFormValid = void 0;
  var message = '';

  isFormValid = (0, _utils.emailFormValidate)(user, errors) && (0, _utils.passwordFormValidate)(user, errors);

  if (!isFormValid) {
    message = 'Ops, Ocorreu algum erro.';
  }

  return {
    success: isFormValid,
    message: message,
    errors: errors
  };
}

function hasCorrectLoginBody(body) {
  return !(0, _lodash.isEmpty)(body) && !(0, _lodash.isEmpty)(body.email) && !(0, _lodash.isEmpty)(body.password) && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && typeof body.email === 'string' && typeof body.password === 'string';
}

exports.default = router;
// module.exports = router
//# sourceMappingURL=login.js.map