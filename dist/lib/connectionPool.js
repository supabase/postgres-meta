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
            pool = new Pool(connection);
            _context.prev = 1;
            _context.next = 4;
            return pool.query(sql);

          case 4:
            results = _context.sent;
            return _context.abrupt("return", {
              data: results.rows,
              error: null
            });

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            console.log('PG Error', _context.t0);
            throw _context.t0;

          case 12:
            _context.prev = 12;

            // Try to close the connection
            // Not necessary?
            try {
              pool.end();
            } catch (error) {
              console.log('pool.end error', error);
            }

            return _context.finish(12);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8, 12, 15]]);
  }));

  return function RunQuery(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = RunQuery;