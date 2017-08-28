'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _project = require('../../../config/project.config');

var _project2 = _interopRequireDefault(_project);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import asyncUtils from '../../../utils/asyncUtils'


/* Promisify some methods */
var User = _bluebird2.default.promisifyAll(_mongoose2.default).model('User');
_bluebird2.default.promisifyAll(_crypto2.default);

var router = new _express2.default.Router();

router.post('/', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var validationResult, buf, token, user, smtpTransport, sendMail;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('--> auth/forgot', req.body);

            if (hasCorrectForgotBody(req.body)) {
              _context.next = 4;
              break;
            }

            console.error('ERRO GRAVE: request body enviado errado');
            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: 'Erro no formulário. Favor preencher corretamente.'
            }));

          case 4:
            validationResult = validateForgotForm(req.body);

            if (validationResult.success) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: validationResult.message,
              errors: validationResult.errors
            }));

          case 7:
            _context.prev = 7;
            _context.next = 10;
            return _crypto2.default.randomBytesAsync(20);

          case 10:
            buf = _context.sent;
            token = buf.toString('hex');
            _context.next = 14;
            return User.findOneAsync({ email: req.body.email });

          case 14:
            user = _context.sent;

            if (user) {
              _context.next = 17;
              break;
            }

            throw new Error('Nenhuma conta encontrada com este email');

          case 17:

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            _context.next = 21;
            return user.save();

          case 21:
            smtpTransport = _nodemailer2.default.createTransport({
              service: 'Gmail',
              // host: 'smtp.gmail.com',
              // port: 465,
              secureConnection: false,
              auth: {
                user: _project2.default.email,
                pass: _project2.default.email_pass
              }
            });

            console.log('passou nodemailer criou object e retornando sucesso');
            res.status(200).json({
              success: true,
              message: 'Estamos enviando o procedimento ao seu endereço de email, dê uma olhadinha.',
              data: {
                email: user.email
              }
            });

            sendMail = _bluebird2.default.promisify(smtpTransport.sendMail.bind(smtpTransport));
            _context.next = 27;
            return sendMail(mailOptions(user, req, token));

          case 27:
            console.log('nodemailer mandou email');
            _context.next = 33;
            break;

          case 30:
            _context.prev = 30;
            _context.t0 = _context['catch'](7);
            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: 'O email informado não consta em nossa base.'
            }));

          case 33:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[7, 30]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

/**
 * Validate the logout form
 *
 * @param {object} payload the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 * errors tips, and a global message for the whole form.
 */
function validateForgotForm(payload) {
  var errors = {};
  var isFormValid = true;
  var message = '';

  isFormValid = (0, _utils.emailFormValidate)(payload, errors, isFormValid);

  if (!isFormValid) {
    message = 'Há algo errado.';
  }

  return {
    success: isFormValid,
    message: message,
    errors: errors
  };
}

function mailOptions(user, req, token) {
  return {
    from: _project2.default.email,
    to: user.email,
    subject: 'Melhore.me - Resete sua senha',
    text: '\n      Voc\xEA recebeu este email, porque voc\xEA (ou algu\xE9m) solicitou que a senha de sua conta seja resetada.\n\n      Para completar o processo, por favor clique no seguinte link, ou cole em seu browser:\n\n      https://' + req.headers.host + '/reset/' + token + '\n\n      Caso voc\xEA n\xE3o tenha feito esta solicita\xE7\xE3o, por favor ignore este email. Assim, sua senha permanecer\xE1 inalterada.\n    '
  };
}

function hasCorrectForgotBody(body) {
  return !(0, _lodash.isEmpty)(body) && !(0, _lodash.isEmpty)(body.email) && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && typeof body.email === 'string';
}

// export default router
module.exports = router;
//# sourceMappingURL=forgot.js.map