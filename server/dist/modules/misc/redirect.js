'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();

router.get('/', function (req, res, next) {
  console.log('--> misc/redirect', req.body);
  res.redirect('/counter');
});

exports.default = router;
//# sourceMappingURL=redirect.js.map