'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var bcrypt = require('bcrypt');
// const bcrypt = promisifyAll(require('bcrypt-nodejs'))

// define the User model schema
var UserSchema = new _mongoose2.default.Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hasCaptchaComponent: Boolean,
  name: String,
  validToken: String,
  validTokenExpires: Number,
  facebookId: String,
  facebookLink: String,
  facebookEmail: String,
  photo: String
});

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(password) {
    var bcryptResult;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('local-login password', password, 'this', this, this.password);

            // TODO:
            // IF this.password === undefined
            // AND loop (social networks).id === not empty
            // SO Warning: Você escolheu fazer login pelo facebook
            // porém pode criar uma senha a qualquer momento e efetuar
            // o login através destas duas opções

            _context.prev = 1;
            _context.next = 4;
            return bcrypt.compareSync(password, this.password);

          case 4:
            bcryptResult = _context.sent;

            console.log('local-login password2', password);
            return _context.abrupt('return', bcryptResult);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);

            console.error('ERRO GRAVE:', _context.t0);
            return _context.abrupt('return', false);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 9]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

// UserSchema.methods.comparePassword = function (password) {
//   console.log('local-login password', password, 'this', this, this.password)
//   const bcryptResult = bcrypt.compare(password, this.password)
//   console.log('local-login password2', password)
//   return bcryptResult
// }

/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  var user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt(function (saltError, salt) {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, function (hashError, hash) {
      if (hashError) {
        return next(hashError);
      }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

module.exports = _mongoose2.default.model('User', UserSchema);
//# sourceMappingURL=user.js.map