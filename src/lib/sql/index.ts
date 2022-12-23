import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const columnsSql = await readFile(join(__dirname, 'columns.sql'), 'utf-8')
export const configSql = await readFile(join(__dirname, 'config.sql'), 'utf-8')
export const extensionsSql = await readFile(join(__dirname, 'extensions.sql'), 'utf-8')
export const foreignTablesSql = await readFile(join(__dirname, 'foreign_tables.sql'), 'utf-8')
export const functionsSql = await readFile(join(__dirname, 'functions.sql'), 'utf-8')
export const policiesSql = await readFile(join(__dirname, 'policies.sql'), 'utf-8')
export const primaryKeysSql = await readFile(join(__dirname, 'primary_keys.sql'), 'utf-8')
export const publicationsSql = await readFile(join(__dirname, 'publications.sql'), 'utf-8')
export const relationshipsSql = await readFile(join(__dirname, 'relationships.sql'), 'utf-8')
export const rolesSql = await readFile(join(__dirname, 'roles.sql'), 'utf-8')
export const schemasSql = await readFile(join(__dirname, 'schemas.sql'), 'utf-8')
export const tablesSql = await readFile(join(__dirname, 'tables.sql'), 'utf-8')
export const triggersSql = await readFile(join(__dirname, 'triggers.sql'), 'utf-8')
export const typesSql = await readFile(join(__dirname, 'types.sql'), 'utf-8')
export const versionSql = await readFile(join(__dirname, 'version.sql'), 'utf-8')
export const viewsSql = await readFile(join(__dirname, 'views.sql'), 'utf-8')
