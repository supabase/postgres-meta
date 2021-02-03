export const PG_API_PORT = Number(process.env.PG_API_PORT || 1337)
export const CRYPTO_KEY = process.env.CRYPTO_KEY || 'SAMPLE_KEY'

const PG_API_DB_HOST = process.env.PG_API_DB_HOST || 'localhost'
const PG_API_DB_NAME = process.env.PG_API_DB_NAME || 'postgres'
const PG_API_DB_USER = process.env.PG_API_DB_USER || 'postgres'
const PG_API_DB_PORT = Number(process.env.PG_API_DB_PORT) || 5432
const PG_API_DB_PASSWORD = process.env.PG_API_DB_PASSWORD || 'postgres'

export const PG_CONNECTION = `postgres://${PG_API_DB_USER}:${PG_API_DB_PASSWORD}@${PG_API_DB_HOST}:${PG_API_DB_PORT}/${PG_API_DB_NAME}`
