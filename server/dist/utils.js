'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadFileAsync = exports.downloadFile = exports.zeraValidToken = exports.addBlankValidToken = exports.verifyAuthentication = exports.PATHS = undefined;

/**
 * Verifica se está autenticado
 * @param {string} token authentication token
 */
var verifyAuthentication = exports.verifyAuthentication = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(token) {
    var decoded, userId, user, dateNow;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return verifyJwt(token, _project2.default.jwt_secret);

          case 3:
            decoded = _context.sent;

            console.log('decoded', decoded);
            userId = decoded.sub;

            // check if a user exists

            _context.next = 8;
            return User.findById(userId);

          case 8:
            user = _context.sent;
            dateNow = getDateNowFormartNormalizer();

            if (!(!user || user.validToken !== token)) {
              _context.next = 13;
              break;
            }

            console.log('Não teve autorização, deve retornar STATUS 401');
            return _context.abrupt('return', null);

          case 13:
            if (!(dateNow > user.validTokenExpires)) {
              _context.next = 23;
              break;
            }

            _context.prev = 14;

            addBlankValidToken(user);
            throw new Error('Esse ponto soh um Defensive block');

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](14);

            console.error('ERRO GRAVE', _context.t0);

          case 22:
            return _context.abrupt('return', null);

          case 23:

            console.log('B');
            return _context.abrupt('return', user);

          case 27:
            _context.prev = 27;
            _context.t1 = _context['catch'](0);

            console.log('ERRO GRAVE:', _context.t1);
            return _context.abrupt('return', null);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 27], [14, 19]]);
  }));

  return function verifyAuthentication(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Persiste string vazia no atributo de usuario, para invalidar qualquer token
 * @param {object} user
 */


var addBlankValidToken = exports.addBlankValidToken = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
    var save;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            save = (0, _bluebird.promisify)(user.save.bind(user));
            _context2.prev = 1;

            user.validToken = '';
            user.validTokenExpires = 0;
            _context2.next = 6;
            return save();

          case 6:
            return _context2.abrupt('return', _context2.sent);

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](1);

            console.error('ERRO GRAVE:', _context2.t0);
            return _context2.abrupt('return', null);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 9]]);
  }));

  return function addBlankValidToken(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Zera o atributo validToken. Orquestra a verificacao de auth e adiciona blankValidToken
 * @param {string} token
 */


var zeraValidToken = exports.zeraValidToken = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(token) {
    var user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return verifyAuthentication(token);

          case 2:
            user = _context3.sent;

            if (user) {
              _context3.next = 6;
              break;
            }

            console.log('sem usuario no retorno do verifyAuthentication()');
            return _context3.abrupt('return', null);

          case 6:
            return _context3.abrupt('return', addBlankValidToken(user, function (error, user) {
              if (error) console.error('ERRO GRAVE:', error);
              return user;
            }));

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function zeraValidToken(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Return Date now in seconds, like jwt expires format
 * @param {number} timeExpires optional - plus in timeExpires
 */


/**
 * Download Web File
 * @param {string} url url para download
 * @param {string} destDir nome do diretorio de destino no sistema
 * @param {string} destFile nome do arquivo de destino
 * @param {function} cb callback
 */
var downloadFile = exports.downloadFile = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(url, destDir, destFile, cb) {
    var file, request;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return createDir(destDir);

          case 3:
            _context4.next = 8;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4['catch'](0);

            console.log('ERRO GRAVE:', _context4.t0);

          case 8:
            file = _fsExtra2.default.createWriteStream(destDir + '/' + destFile);
            request = _https2.default.get(url, function (response) {
              response.pipe(file);
              file.on('finish', function () {
                /* close() is async, call cb after close completes. */
                file.close(cb);
              });
            }).on('error', function (error) {
              /* Delete the file async. (But we don't check the result) */
              _fsExtra2.default.unlink(dest);
              if (cb) cb(error);
            });

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 5]]);
  }));

  return function downloadFile(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var createDir = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(destDir, cb) {
    var ensure;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _fsExtra2.default.ensureDir(destDir);

          case 2:
            ensure = _context5.sent;

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function createDir(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.nameFormValidate = nameFormValidate;
exports.emailFormValidate = emailFormValidate;
exports.passwordFormValidate = passwordFormValidate;
exports.passwordAndConfirmePasswordMatchValidate = passwordAndConfirmePasswordMatchValidate;
exports.validateEmail = validateEmail;
exports.getHeaderToken = getHeaderToken;
exports.getDateNowFormartNormalizer = getDateNowFormartNormalizer;

var _bluebird = require('bluebird');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _project = require('../config/project.config');

var _project2 = _interopRequireDefault(_project);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* Promisify some methods */
var User = (0, _bluebird.promisifyAll)(require('mongoose').model('User'));
var verifyJwt = (0, _bluebird.promisifyAll)(_jsonwebtoken2.default.verify);
// const findById = promisifyAll(User.findById.bind(User))

var PATHS = exports.PATHS = {
  user_profile: {
    dir: '/home/' + require("os").userInfo().username + '/user_profile/picture'
  }

  /**
   * Altera o objeto errors adicionando mensagem a propriedade name
   * @param {object} user
   * @param {object} errors
   */
};function nameFormValidate(user, errors) {
  console.log('nameFormValidate()');
  if (!validateName(user.name)) {
    console.error('ERRO GRAVE: Email vazio');
    errors.name = 'Erro no formulário. Preencha corretamente.';
    return false;
  }
  return true;
}

/**
 * Altera o objeto errors adicionando mensagem a propriedade email
 * @param {object} user
 * @param {object} errors
 */
function emailFormValidate(user, errors) {
  console.log('emailFormValidate()');
  if (user.email.length === 0) {
    console.error('ERRO GRAVE: Email vazio');
    errors.email = 'Erro no formulário. Preencha corretamente.';
    return false;
  }

  if (!validateEmail(user.email)) {
    console.error('ERRO GRAVE: Email não validado');
    errors.email = 'Erro no formulário. Preencha corretamente.';
    return false;
  }

  return true;
}

/**
 * Altera o objeto errors adicionando mensagem a propriedade email
 * @param {object} payload
 * @param {object} errors
 */
function passwordFormValidate(body, errors) {
  console.log('passwordFormValidate()');
  if (body.password.length < 8) {
    console.error('ERRO GRAVE: A senha deve ter pelo menos 8 dígitos.');
    errors.password = 'Erro no formulário. Preencha corretamente.';
    return false;
  }

  if (!validatePassword(body.password)) {
    console.error('ERRO GRAVE: Senha não validada');
    errors.password = 'Erro no formulário. Preencha corretamente.';
    return false;
  }

  return true;
}

/**
 * Is password and confirmePassword matches?
 * @param {string} password
 * @param {string} confirmePassword 
 */
function passwordAndConfirmePasswordMatchValidate(body, errors) {
  console.log('passwordAndConfirmePasswordMatchValidate()');
  if (body.password !== body.confirmePassword) {
    console.error('ERRO GRAVE: Senha e confirmação não batem');
    errors.password = 'Erro no formulário. Preencha corretamente.';
    return false;
  }
  return true;
}

/**
 * Mínimo tem que ser 2 nomes com 2 digitos (eg. 'Ab Cd')
 * @param {string} name
 */
function validateName(name) {
  if (name) {
    name = name.trim();
    var names = name.split(' ');
    return names.length >= 2 && names[0].length >= 2 && names[1].length >= 2;
  } else {
    return false;
  }
}

/**
 * Valida o email
 * @param {string} email email em questão
 */
function validateEmail(email) {
  var re = new RegExp(['^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|', '(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|', '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'].join(''));
  return re.test(email);
}

/**
 * Valida o password
 * @param {string} password senha em questão
 */
function validatePassword(password) {
  var re = /\s/;
  return !re.test(password);
}

/**
 * Retorna o token contido no header, se existir
 * @param {object} req http req
 */
function getHeaderToken(req) {
  return req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
}function getDateNowFormartNormalizer() {
  var timeExpires = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  /* divides by 1000 to make format like jwt.exp seconds format */
  return Math.round(Date.now() / 1000 + timeExpires);
}var downloadFileAsync = exports.downloadFileAsync = (0, _bluebird.promisify)(downloadFile);
//# sourceMappingURL=utils.js.map