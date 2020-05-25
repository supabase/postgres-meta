"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var pg = require('pg');

pg.types.setTypeParser(20, 'text', parseInt);

var _require = require('pg'),
    Pool = _require.Pool;

var RunQuery = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection, sql) {
    var pool, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('connection', connection);
            pool = new Pool(connection);
            _context.prev = 2;
            _context.next = 5;
            return pool.query(sql);

          case 5:
            results = _context.sent;
            return _context.abrupt("return", {
              data: results.rows,
              error: null
            });

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            console.log('PG Error', _context.t0);
            throw _context.t0;

          case 13:
            _context.prev = 13;

            // Try to close the connection
            // Not necessary?
            try {
              pool.end();
            } catch (error) {
              console.log('pool.end error', error);
            }

            return _context.finish(13);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9, 13, 16]]);
  }));

  return function RunQuery(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = RunQuery;