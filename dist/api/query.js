"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('express'),
    Router = _require.Router;

var router = new Router();

var RunQuery = require('../lib/connectionPool');

router.post('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var query, _yield$RunQuery, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            query = req.body.query;
            _context.next = 4;
            return RunQuery(req.headers.pg, query);

          case 4:
            _yield$RunQuery = _context.sent;
            data = _yield$RunQuery.data;
            return _context.abrupt("return", res.status(200).json(data || []));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            // For this one, we always want to give back the error to the customer
            console.log('Soft error!', _context.t0);
            res.status(200).json([{
              error: _context.t0.toString()
            }]);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;