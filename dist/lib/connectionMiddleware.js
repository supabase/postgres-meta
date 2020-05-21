"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConnectionToRequest = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _constants = require("./constants");

/**
 * Adds a "pg" object to the request if it doesn't exist
 */
var addConnectionToRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!req.pg) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            req.pg = _constants.CONNECTION;
            return _context.abrupt("return", next());

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log('error', _context.t0);
            return _context.abrupt("return", res.status(500).json({
              status: 500,
              error: 'Server error.'
            }));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function addConnectionToRequest(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.addConnectionToRequest = addConnectionToRequest;