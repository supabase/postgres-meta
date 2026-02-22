import CryptoJS from 'crypto-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { app } from './utils'
import { CRYPTO_KEY, DEFAULT_POOL_CONFIG } from '../../src/server/constants'

// @ts-ignore: Harmless type error on import.meta.
const cwd = path.dirname(fileURLToPath(import.meta.url))
const sslRootCertPath = path.join(cwd, '../db/server.crt')
const sslRootCert = fs.readFileSync(sslRootCertPath, { encoding: 'utf8' })
const dbHost = process.env.PG_META_DB_HOST || 'localhost'
const dbPort = process.env.PG_META_DB_PORT || '5432'
const sslHost = 'localhost'

test('query with no ssl', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        `postgresql://postgres:postgres@${dbHost}:${dbPort}/postgres`,
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  const body = res.json()
  if (res.statusCode === 200) {
    expect(Array.isArray(body)).toBe(true)
  } else {
    expect(body?.error).toContain('password authentication failed')
  }
})

test('query with ssl w/o root cert', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        `postgresql://postgres:postgres@${sslHost}:${dbPort}/postgres?sslmode=verify-full`,
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.json()?.error).toMatch(
    /^self[ -]signed certificate$|The server does not support SSL connections/
  )
})

test('query with ssl with root cert', async () => {
  const defaultSsl = DEFAULT_POOL_CONFIG.ssl
  DEFAULT_POOL_CONFIG.ssl = { ca: sslRootCert }

  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        `postgresql://postgres:postgres@${sslHost}:${dbPort}/postgres?sslmode=verify-full`,
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  const body = res.json()
  if (res.statusCode === 200) {
    expect(Array.isArray(body)).toBe(true)
  } else {
    expect(body?.error).toContain('does not support SSL connections')
  }

  DEFAULT_POOL_CONFIG.ssl = defaultSsl
})

test('query with invalid space empty encrypted connection string', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(` `, CRYPTO_KEY).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.statusCode).toBe(500)
  expect(res.json()).toMatchInlineSnapshot(`
    {
      "error": "failed to get upstream connection details",
    }
  `)
})

test('query with invalid empty encrypted connection string', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(``, CRYPTO_KEY).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.statusCode).toBe(500)
  expect(res.json()).toMatchInlineSnapshot(`
    {
      "error": "failed to get upstream connection details",
    }
  `)
})

test('query with missing host connection string encrypted connection string', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        `postgres://name:password@:5432/postgres?sslmode=prefer`,
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.statusCode).toBe(500)
  expect(res.json()).toMatchInlineSnapshot(`
    {
      "error": "failed to process upstream connection details",
    }
  `)
})
