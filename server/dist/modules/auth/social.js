'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var validateWithProvider = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, network, socialToken) {
    var photoSize, fields, providers, resFB, _profile, userData, user, userLogin, token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('validateWithProvider()');
            photoSize = 200;
            fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture.width(' + photoSize + ').height(' + photoSize + ')'];
            providers = {
              facebook: {
                // graphApiUrl: 'https://graph.facebook.com/me',
                // accessTokenUrl: 'https://graph.facebook.com/v2.5/oauth/access_token',
                graphApiUrl: 'https://graph.facebook.com/v2.9/me',
                params: {
                  access_token: socialToken,
                  fields: fields.join(',')
                  // code: req.body.code,
                  // client_id: req.body.clientId,
                  // client_secret: config.facebook_secret,
                  // redirect_uri: req.body.redirectUri || null
                }
              }
            };
            _context2.prev = 4;
            _context2.next = 7;
            return request({
              uri: providers[network].graphApiUrl,
              qs: providers[network].params
            });

          case 7:
            resFB = _context2.sent;
            _profile = JSON.parse(resFB.body);
            userData = {
              name: null,
              email: null
            };

            if (!(resFB.statusCode !== 200)) {
              _context2.next = 14;
              break;
            }

            console.log('ERRO FACE: statusCode', resFB.statusCode);
            if (resFB.error) console.log('ERRO FACE: social.error', resFB.error);
            return _context2.abrupt('return', userData);

          case 14:
            if (!(0, _utils.getHeaderToken)(req)) {
              _context2.next = 17;
              break;
            }

            console.info('JÁ está autenticado');
            return _context2.abrupt('return', userData);

          case 17:
            _context2.next = 19;
            return User.findOneAsync({
              $or: [{ facebookId: _profile.id }, { email: _profile.email }]
            });

          case 19:
            user = _context2.sent;


            if (!user) {
              console.log('NÃO existia usuario');
              user = new User();
            } else {
              console.log('JÁ existia usuario');
            }

            _context2.next = 23;
            return salvaNovasProps(user, _profile);

          case 23:
            userLogin = _context2.sent;

            console.log('userLogin', userLogin);
            _context2.next = 27;
            return (0, _utilsAuth.facebookAsync)(userLogin);

          case 27:
            token = _context2.sent;

            console.log('token', token);
            userData.name = user.name;
            userData.email = user.email;
            userData.token = token;

            return _context2.abrupt('return', userData);

          case 35:
            _context2.prev = 35;
            _context2.t0 = _context2['catch'](4);

            console.error('ERRO GRAVE:', _context2.t0);
            return _context2.abrupt('return', null);

          case 39:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 35]]);
  }));

  return function validateWithProvider(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Atribui dados do Facebook caso ainda não existam no usuário
 * @param {object} user usuario cadastrado
 * @param {object} profile facebook api object
 */
var salvaNovasProps = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(user, profile) {
    var precisaSalvarUser, picData;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            precisaSalvarUser = false;


            if (!user.name) {
              console.log('user.name -->', profile.name);
              user.name = profile.name;
              precisaSalvarUser = true;
            }

            if (!user.email) {
              console.log('user.email -->', profile.email);
              user.email = profile.email;
              precisaSalvarUser = true;
            }
            if (!user.facebookEmail) {
              console.log('user.facebookEmail -->', profile.email);
              // user.facebookEmail = `${profile.email}_`
              user.facebookEmail = profile.email;
              precisaSalvarUser = true;
            }
            if (!user.facebookId) {
              console.log('user.facebookId -->', profile.id);
              user.facebookId = profile.id;
              precisaSalvarUser = true;
            }
            if (!user.facebookLink) {
              console.log('user.facebookLink -->', profile.link);
              user.facebookLink = profile.link;
              precisaSalvarUser = true;
            }

            if (user.photo) {
              _context3.next = 15;
              break;
            }

            picData = profile.picture.data;

            if (!(picData && picData.url)) {
              _context3.next = 15;
              break;
            }

            console.log('1');

            _context3.next = 12;
            return (0, _utils.downloadFileAsync)(picData.url, _utils.PATHS.user_profile.dir, user._id + '.jpg');

          case 12:
            console.log('3');

            user.photo = user._id + '.jpg';
            precisaSalvarUser = true;

          case 15:
            if (!precisaSalvarUser) {
              _context3.next = 20;
              break;
            }

            console.log('Salvando...');
            // const userModel = promisifyAll(user.save.bind(user))
            _context3.next = 19;
            return user.saveAsync();

          case 19:
            return _context3.abrupt('return', _context3.sent);

          case 20:
            return _context3.abrupt('return', user);

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function salvaNovasProps(_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _bluebird = require('bluebird');

var _lodash = require('lodash');

var _project = require('../../../config/project.config');

var _project2 = _interopRequireDefault(_project);

var _utils = require('../../utils');

var _utilsAuth = require('../../strategies/utils-auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = (0, _bluebird.promisifyAll)(require('mongoose').model('User'));
var request = (0, _bluebird.promisify)(require('request'));

var router = new _express2.default.Router();

router.post('/', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var network, socialToken, authFB;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('POST /social req -->', req.body);

            if (hasCorrectSocialBody(req.body)) {
              _context.next = 4;
              break;
            }

            console.error('ERRO GRAVE: request body enviado errado');
            return _context.abrupt('return', res.status(400).json({
              success: false,
              message: 'Erro no formulário. Favor preencher corretamente.'
            }));

          case 4:
            // Grab the social network and token
            network = req.body.network;
            socialToken = req.body.socialToken;

            // Validate the social token with Facebook

            _context.next = 8;
            return validateWithProvider(req, res, network, socialToken);

          case 8:
            authFB = _context.sent;
            _context.prev = 9;

            // Return the user data we got from Facebook
            console.log('authFB -->', authFB);

            if (!authFB.token) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', resultSendSocial(req, res, '200', {
              success: true,
              message: 'Autenticado via Facebook, com sucesso!',
              user: authFB.userData,
              token: authFB.token
            }));

          case 15:
            return _context.abrupt('return', resultSendSocial(req, res, '400', {
              success: false,
              message: 'Não autenticou - Facebook!',
              user: authFB.userData,
              errors: null
            }));

          case 16:
            _context.next = 23;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](9);

            console.error('ERRO GRAVE 1', _context.t0);
            console.error('ERRO GRAVE 2', profile.error.message);
            return _context.abrupt('return', resultSendSocial(req, res, '400', {
              success: false,
              message: 'Falha na Autenticacao via Facebook!',
              user: authFB.userData
            }));

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[9, 18]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

function resultSendSocial(req, res, status, respObj) {
  return res.status(status).json(respObj);
}

function hasCorrectSocialBody(body) {
  return !(0, _lodash.isEmpty)(body) && !(0, _lodash.isEmpty)(body.network) && !(0, _lodash.isEmpty)(body.socialToken) && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && typeof body.network === 'string' && typeof body.socialToken === 'string';
}exports.default = router;
//# sourceMappingURL=social.js.map