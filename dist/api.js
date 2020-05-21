"use strict";

var _connectionMiddleware = require("./lib/connectionMiddleware");

var express = require('express');

var cors = require('cors');

var Router = express.Router;
var router = new Router();
router.use(cors());
router.use('/config', _connectionMiddleware.addConnectionToRequest, require('./api/config'));
router.use('/plugins', _connectionMiddleware.addConnectionToRequest, require('./api/plugins'));
router.use('/query', _connectionMiddleware.addConnectionToRequest, require('./api/query'));
router.use('/tables', _connectionMiddleware.addConnectionToRequest, require('./api/tables'));
router.use('/users', _connectionMiddleware.addConnectionToRequest, require('./api/users'));
module.exports = router;