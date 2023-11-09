import crypto from 'crypto'
import { PoolConfig } from 'pg'
import { getSecret } from '../lib/secrets.js'

export const PG_META_HOST = process.env.PG_META_HOST || '0.0.0.0'
export const PG_META_PORT = Number(process.env.PG_META_PORT || 1337)
export const CRYPTO_KEY = (await getSecret('CRYPTO_KEY')) || 'SAMPLE_KEY'

const PG_META_DB_HOST = process.env.PG_META_DB_HOST || 'localhost'
const PG_META_DB_NAME = process.env.PG_META_DB_NAME || 'postgres'
const PG_META_DB_USER = process.env.PG_META_DB_USER || 'postgres'
const PG_META_DB_PORT = process.env.PG_META_DB_PORT || '5432'
const PG_META_DB_PASSWORD = (await getSecret('PG_META_DB_PASSWORD')) || 'postgres'
const PG_META_DB_SSL_MODE = process.env.PG_META_DB_SSL_MODE || 'disable'

const PG_CONN_TIMEOUT_SECS = Number(process.env.PG_CONN_TIMEOUT_SECS || 15)

export let PG_CONNECTION = process.env.PG_META_DB_URL
if (!PG_CONNECTION) {
  const pgConn = new URL('postgresql://')
  pgConn.hostname = PG_META_DB_HOST
  pgConn.port = PG_META_DB_PORT
  pgConn.username = PG_META_DB_USER
  pgConn.password = PG_META_DB_PASSWORD
  pgConn.pathname = encodeURIComponent(PG_META_DB_NAME)
  pgConn.searchParams.set('sslmode', PG_META_DB_SSL_MODE)
  PG_CONNECTION = `${pgConn}`
}

export const PG_META_DB_SSL_ROOT_CERT = process.env.PG_META_DB_SSL_ROOT_CERT
if (PG_META_DB_SSL_ROOT_CERT) {
  // validate cert
  new crypto.X509Certificate(PG_META_DB_SSL_ROOT_CERT)
}

export const EXPORT_DOCS = process.env.PG_META_EXPORT_DOCS === 'true'
export const GENERATE_TYPES = process.env.PG_META_GENERATE_TYPES
export const GENERATE_TYPES_INCLUDED_SCHEMAS = GENERATE_TYPES
  ? process.env.PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS?.split(',') ?? []
  : []
export const GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS =
  process.env.PG_META_GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS === 'true'

export const DEFAULT_POOL_CONFIG: PoolConfig = {
  max: 1,
  connectionTimeoutMillis: PG_CONN_TIMEOUT_SECS * 1000,
  ssl: PG_META_DB_SSL_ROOT_CERT ? { ca: PG_META_DB_SSL_ROOT_CERT } : undefined,
}

export const PG_META_REQ_HEADER = process.env.PG_META_REQ_HEADER || 'request-id'
