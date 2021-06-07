export const PG_META_PORT = Number(process.env.PG_META_PORT || 1337)
export const CRYPTO_KEY = process.env.CRYPTO_KEY || 'SAMPLE_KEY'

const PG_META_DB_HOST = process.env.PG_META_DB_HOST || 'localhost'
const PG_META_DB_NAME = process.env.PG_META_DB_NAME || 'postgres'
const PG_META_DB_USER = process.env.PG_META_DB_USER || 'postgres'
const PG_META_DB_PORT = Number(process.env.PG_META_DB_PORT) || 5432
const PG_META_DB_PASSWORD = process.env.PG_META_DB_PASSWORD || 'postgres'

export const PG_CONNECTION = `postgres://${PG_META_DB_USER}:${PG_META_DB_PASSWORD}@${PG_META_DB_HOST}:${PG_META_DB_PORT}/${PG_META_DB_NAME}`

export const PG_META_EXPORT_DOCS = process.env.PG_META_EXPORT_DOCS === 'true' || false
