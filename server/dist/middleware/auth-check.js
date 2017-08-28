'use strict';

var _utils = require('../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *  The Auth Checker middleware function.
 */
module.exports = function (req, res, next) {
  // get the last part from a authorization header string like "bearer token-value"
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var token, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.headers.authorization) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', res.status(401).end());

          case 2:
            _context.prev = 2;
            token = (0, _utils.getHeaderToken)(req);
            _context.next = 6;
            return (0, _utils.verifyAuthentication)(token);

          case 6:
            user = _context.sent;

            if (user) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', res.status(401).end());

          case 9:
            console.info('USSER', user);

            return _context.abrupt('return', next());

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](2);

            console.log('ERRO GRAVE:', err);
            return _context.abrupt('return', res.status(401).end());

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 13]]);
  }))();
};
//# sourceMappingURL=auth-check.js.map