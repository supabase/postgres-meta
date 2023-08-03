import CryptoJS from 'crypto-js'
import path from 'path'
import { fileURLToPath } from 'url'
import { app } from './utils'
import { CRYPTO_KEY } from '../../src/server/constants'

// @ts-ignore: Harmless type error on import.meta.
const cwd = path.dirname(fileURLToPath(import.meta.url))
const SSL_ROOT_CERT_PATH = path.join(cwd, '../db/server.crt')

test('query with no ssl', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        'postgresql://postgres:postgres@localhost:5432/postgres',
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "?column?": 1,
      },
    ]
  `)
})

test('query with ssl w/o root cert', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        'postgresql://postgres:postgres@localhost:5432/postgres?sslmode=verify-full',
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.json()?.error).toMatch(/^self[ -]signed certificate$/)
})

test('query with ssl with root cert', async () => {
  const res = await app.inject({
    method: 'POST',
    path: '/query',
    headers: {
      'x-connection-encrypted': CryptoJS.AES.encrypt(
        `postgresql://postgres:postgres@localhost:5432/postgres?sslmode=verify-full&sslrootcert=${SSL_ROOT_CERT_PATH}`,
        CRYPTO_KEY
      ).toString(),
    },
    payload: { query: 'select 1;' },
  })
  expect(res.json()).toMatchInlineSnapshot(`
    [
      {
        "?column?": 1,
      },
    ]
  `)
})
