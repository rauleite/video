'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();

router.get('/dashboard', function (req, res) {
  console.log('GET --> dashboard req.body', req.body);
  res.status(200).json({
    message: "You're authorized to see this secret message.",
    success: true
  });
});

module.exports = router;
//# sourceMappingURL=dashboard.js.map