import { readFileSync } from 'fs'
import { resolve } from 'path'

export const columnsSql = readFileSync(resolve(__dirname, 'columns.sql'), 'utf-8')
export const configSql = readFileSync(resolve(__dirname, 'config.sql'), 'utf-8')
export const extensionsSql = readFileSync(resolve(__dirname, 'extensions.sql'), 'utf-8')
export const functionsSql = readFileSync(resolve(__dirname, 'functions.sql'), 'utf-8')
export const grantsSql = readFileSync(resolve(__dirname, 'grants.sql'), 'utf-8')
export const policiesSql = readFileSync(resolve(__dirname, 'policies.sql'), 'utf-8')
export const primaryKeysSql = readFileSync(resolve(__dirname, 'primary_keys.sql'), 'utf-8')
export const publicationsSql = readFileSync(resolve(__dirname, 'publications.sql'), 'utf-8')
export const relationshipsSql = readFileSync(resolve(__dirname, 'relationships.sql'), 'utf-8')
export const rolesSql = readFileSync(resolve(__dirname, 'roles.sql'), 'utf-8')
export const schemasSql = readFileSync(resolve(__dirname, 'schemas.sql'), 'utf-8')
export const tablesSql = readFileSync(resolve(__dirname, 'tables.sql'), 'utf-8')
export const triggersSql = readFileSync(resolve(__dirname, 'triggers.sql'), 'utf-8')
export const typesSql = readFileSync(resolve(__dirname, 'types.sql'), 'utf-8')
export const versionSql = readFileSync(resolve(__dirname, 'version.sql'), 'utf-8')
