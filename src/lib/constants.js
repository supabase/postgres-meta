export const PG_API_URL = process.env.PG_API_URL || 'http://localhost'
export const PG_API_PORT = process.env.PG_API_PORT || 1337
export const CONNECTION = {
  host: process.env.PG_API_DB_HOST || 'localhost',
  database: process.env.PG_API_DB_NAME || 'postgres',
  user: process.env.PG_API_DB_USER || 'postgres',
  port: process.env.PG_API_DB_PORT || 5432,
  password: process.env.PG_API_DB_PASSWORD || 'postgres',
  ssl: process.env.PG_API_DB_SSL || false,
}
