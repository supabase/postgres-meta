"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var constants_1 = require("./lib/constants");
server_1.default.start(constants_1.PG_API_PORT);
