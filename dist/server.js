"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var api = require('./api');
var project = require('../package.json');
app.use(express.json());
app.use(api);
app.get('/', function (req, res) {
    return res.status(200).json({
        status: 200,
        name: project.name,
        version: project.version,
        documentation: 'https://supabase.github.io/pg-api/',
    });
});
app.get('/health', function (req, res) { return res.status(200).json({ date: new Date() }); });
var Server = {
    start: function (port) {
        this.server = app.listen(port, function () {
            console.log("App started on port " + port);
        });
        return app;
    },
    stop: function () {
        this.server.close();
    },
};
exports.default = Server;
