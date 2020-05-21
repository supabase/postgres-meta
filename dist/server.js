"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var express = require('express');

var app = express();

var api = require('./api');

app.use(express.json());
app.use(api);
app.get('/', function (req, res) {
  return res.sendStatus(200);
});
app.get('/health', function (req, res) {
  return res.status(200).json({
    date: new Date()
  });
});
var Server = {
  start: function start(port) {
    Server = app.listen(port, function () {
      console.log("App started on port ".concat(port));
    });
    return app;
  },
  stop: function stop() {
    Server.close();
  }
};
var _default = Server;
exports["default"] = _default;