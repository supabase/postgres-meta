"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONNECTION = exports.PG_API_PORT = exports.PG_API_URL = void 0;
exports.PG_API_URL = process.env.PG_API_URL || 'http://localhost';
exports.PG_API_PORT = process.env.PG_API_PORT || 1337;
exports.CONNECTION = {
    host: process.env.PG_API_DB_HOST || 'localhost',
    database: process.env.PG_API_DB_NAME || 'postgres',
    user: process.env.PG_API_DB_USER || 'postgres',
    port: process.env.PG_API_DB_PORT || 5432,
    password: process.env.PG_API_DB_PASSWORD || 'postgres',
    ssl: process.env.PG_API_DB_SSL || false,
};
