'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = require('mongoose').model('User');
var router = new _express2.default.Router();

router.get('/:token', function (req, res) {
  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var user, _user$toObject, name, email;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.params.token) {
              _context.next = 3;
              break;
            }

            throw new Error('Erro Interno');

          case 3:
            _context.next = 5;
            return User.findOne({
              resetPasswordToken: req.params.token,
              resetPasswordExpires: {
                $gt: Date.now()
              }
            });

          case 5:
            user = _context.sent;

            if (user) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: 'A solicitação de alteração de senha expirou, favor solicitar novamente.',
              user: {
                token: req.params.token
              }
            }));

          case 8:
            _user$toObject = user.toObject(), name = _user$toObject.name, email = _user$toObject.email;
            return _context.abrupt('return', res.status(200).json({
              success: true,
              message: 'Sucesso para aleração da senha.',
              user: {
                name: name,
                email: email,
                token: req.params.token
              }
            }));

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: 'Erro Interno'
            }));

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 12]]);
  }))();
});

router.post('/', function (req, res, next) {
  if (!hasCorrectResetBody(req.body)) {
    console.error('ERRO GRAVE: request body enviado errado');
    return res.status(400).json({
      success: false,
      message: 'Erro no formulário. Favor preencher corretamente.'
    });
  }

  var validationResult = validateResetForm(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var passwordToken, user, _user$toObject2, name, email;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            passwordToken = req.body.passwordToken ? req.body.passwordToken : undefined;


            console.log('passwordToken', passwordToken);
            console.log('Date.now()', Date.now());

            if (passwordToken) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', res.status(400).json({
              success: false,
              message: 'A solicitação de alteração de senha expirou, favor solicitar novamente.'
            }));

          case 6:
            console.log('1');

            _context2.next = 9;
            return User.findOne({
              resetPasswordToken: passwordToken,
              resetPasswordExpires: { $gt: Date.now() }
            });

          case 9:
            user = _context2.sent;

            if (user) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', res.status(400).json({
              success: false,
              message: 'A solicitação de alteração de senha expirou, favor solicitar novamente.'
            }));

          case 12:

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            _context2.next = 17;
            return user.save();

          case 17:
            _user$toObject2 = user.toObject(), name = _user$toObject2.name, email = _user$toObject2.email;

            // return doLogin(req, res, next)

            return _context2.abrupt('return', res.status(200).json({
              success: true,
              message: 'Senha alterada com sucesso, use a nova senha para se logar.',
              data: { name: name, email: email }
            }));

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', res.status(400).json({
              success: false,
              message: 'Erro Interno'
            }));

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 21]]);
  }))();
});

/**
 * Validate the login form
 *
 * @param {object} body - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateResetForm(body) {
  var errors = {};
  var isFormValid = true;
  var message = '';

  isFormValid = (0, _utils.passwordFormValidate)(body, errors) && (0, _utils.passwordAndConfirmePasswordMatchValidate)(body, errors);

  if (!isFormValid) {
    message = 'Ops, Ocorreu algum erro.';
  }

  return {
    success: isFormValid,
    message: message,
    errors: errors
  };
}

function hasCorrectResetBody(body) {
  return !(0, _lodash.isEmpty)(body) && !(0, _lodash.isEmpty)(body.email) && !(0, _lodash.isEmpty)(body.password) && !(0, _lodash.isEmpty)(body.confirmePassword) && !(0, _lodash.isEmpty)(body.passwordToken) && !(0, _lodash.isEmpty)(body.token) && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && typeof body.email === 'string' && typeof body.password === 'string' && typeof body.confirmePassword === 'string' && typeof body.passwordToken === 'string' && typeof body.token === 'string';
}

exports.default = router;
// module.exports = router
//# sourceMappingURL=reset.js.map