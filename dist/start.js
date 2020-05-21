"use strict";

var Server = require('./server')["default"];

var _require = require('./lib/constants'),
    PG_API_PORT = _require.PG_API_PORT;

Server.start(PG_API_PORT);