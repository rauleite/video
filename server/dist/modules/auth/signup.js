'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
// import validator from 'validator'


var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();

router.post('/', function (req, res, next) {
  if (!hasCorrectSignupBody(req.body)) {
    console.error('ERRO GRAVE: request body enviado errado');
    return res.status(400).json({
      success: false,
      message: 'Erro no formulário. Favor preencher corretamente.'
    });
  }
  var validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return _passport2.default.authenticate('local-signup', function (error) {
    if (error) {
      console.log('ERROR', error);
      if (error.name === 'MongoError' && error.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Ocorreu algum erro.',
          errors: {
            email: 'Este email já existe, você pode se logar usando-o.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Erro interno ao tentar processar o cadastro.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Seu cadastro foi realizado com sucesso, agora pode fazer o login.'
    });
  })(req, res, next);
});

/**
 * Validate the sign up form
 *
 * @param {object} user - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(user) {
  var errors = {};
  var isFormValid = true;
  var message = '';

  isFormValid = (0, _utils.nameFormValidate)(user, errors) && (0, _utils.emailFormValidate)(user, errors) && (0, _utils.passwordFormValidate)(user, errors);

  if (!isFormValid) {
    message = 'Ops, ocorreu algum equívoco.';
  }

  return {
    success: isFormValid,
    message: message,
    errors: errors
  };
}

function hasCorrectSignupBody(body) {
  return !(0, _lodash.isEmpty)(body) && !(0, _lodash.isEmpty)(body.name) && !(0, _lodash.isEmpty)(body.email) && !(0, _lodash.isEmpty)(body.password) && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && typeof body.name === 'string' && typeof body.email === 'string' && typeof body.password === 'string';
}

// export default router
module.exports = router;
//# sourceMappingURL=signup.js.map