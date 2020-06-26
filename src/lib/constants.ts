export const PG_API_URL = process.env.PG_API_URL || 'http://localhost'
export const PG_API_PORT = Number(process.env.PG_API_PORT || 1337)
export const CRYPTO_KEY = process.env.CRYPTO_KEY || 'SAMPLE_KEY'
export const PG_CONNECTION = 'postgres://postgres:postgres@localhost:5432/postgres'

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
