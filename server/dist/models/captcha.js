'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// define the User model schema
var CaptchaSchema = new _mongoose2.default.Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  hasCaptchaComponent: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 0
  },
  countExpires: Date
});

CaptchaSchema.pre('save', function (next) {
  console.log('[model] pre save');
  return next();
});

CaptchaSchema.pre('save', function (next) {
  console.log('[model] pre save - this.count', this.count);

  // if (this.hasFormError) {
  //   console.log('[model] this.count', this.count)
  //   this.count = this.count + 1
  // }

  if (this.count >= 2) {
    this.hasCaptchaComponent = true;
  }

  return next();
});

module.exports = _mongoose2.default.model('Captcha', CaptchaSchema);
//# sourceMappingURL=captcha.js.map