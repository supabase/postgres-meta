"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('express'),
    Router = _require.Router;

var router = new Router();

var _require2 = require('../lib/sql'),
    tables = _require2.tables;

var RunQuery = require('../lib/connectionPool');

router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _yield$RunQuery, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return RunQuery(req.pg, tables.list);

          case 3:
            _yield$RunQuery = _context.sent;
            data = _yield$RunQuery.data;
            return _context.abrupt("return", res.status(200).json(data));

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log('throwing error');
            res.status(500).json({
              error: 'Database error',
              status: 500
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/grants', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _yield$RunQuery2, data;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return RunQuery(req.pg, tables.grants);

          case 3:
            _yield$RunQuery2 = _context2.sent;
            data = _yield$RunQuery2.data;
            return _context2.abrupt("return", res.status(200).json(data));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.log('throwing error');
            res.status(500).json({
              error: 'Database error',
              status: 500
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = router;