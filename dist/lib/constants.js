"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PG_CONNECTION = exports.CRYPTO_KEY = exports.PG_API_PORT = exports.PG_API_URL = void 0;
exports.PG_API_URL = process.env.PG_API_URL || 'http://localhost';
exports.PG_API_PORT = Number(process.env.PG_API_PORT || 1337);
exports.CRYPTO_KEY = process.env.CRYPTO_KEY || 'SAMPLE_KEY';
exports.PG_CONNECTION = 'postgres://postgres:postgres@localhost:5432/postgres';
