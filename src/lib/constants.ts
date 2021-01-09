export const PG_API_URL = process.env.PG_API_URL || 'http://localhost'
export const PG_API_PORT = Number(process.env.PG_API_PORT || 1337)
export const CRYPTO_KEY = process.env.CRYPTO_KEY || 'SAMPLE_KEY'

const PG_API_DB_HOST = process.env.PG_API_DB_HOST || 'localhost'
const PG_API_DB_NAME = process.env.PG_API_DB_NAME || 'postgres'
const PG_API_DB_USER = process.env.PG_API_DB_USER || 'postgres'
const PG_API_DB_PORT = Number(process.env.PG_API_DB_PORT) || 5432
const PG_API_DB_PASSWORD = process.env.PG_API_DB_PASSWORD || 'postgres'

export const PG_CONNECTION = `postgres://${PG_API_DB_USER}:${PG_API_DB_PASSWORD}@${PG_API_DB_HOST}:${PG_API_DB_PORT}/${PG_API_DB_NAME}`

export const DEFAULT_ROLES: string[] = [
  'pg_read_all_settings',
  'pg_read_all_stats',
  'pg_stat_scan_tables',
  'pg_monitor',
  'pg_signal_backend',
  'pg_read_server_files',
  'pg_write_server_files',
  'pg_execute_server_program',
]

export const DEFAULT_SYSTEM_SCHEMAS: string[] = [
  'information_schema',
  'pg_catalog',
  'pg_toast_temp_1',
  'pg_temp_1',
  'pg_toast',
]
