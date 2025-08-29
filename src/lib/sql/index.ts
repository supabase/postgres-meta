export type SQLQueryProps = {
  limit?: number
  offset?: number
}

export type SQLQueryPropsWithSchemaFilter = SQLQueryProps & {
  schemaFilter?: string
}

export type SQLQueryPropsWithIdsFilter = SQLQueryProps & {
  idsFilter?: string
}

export type SQLQueryPropsWithSchemaFilterAndIdsFilter = SQLQueryProps & {
  schemaFilter?: string
  idsFilter?: string
}

export type SQLQueryPropsWithTypes = SQLQueryPropsWithSchemaFilterAndIdsFilter & {
  includeTableTypes?: boolean
  includeArrayTypes?: boolean
}

// Export all SQL functions
export { VERSION_SQL } from './version.sql.js'
export { CONFIG_SQL } from './config.sql.js'
export { EXTENSIONS_SQL } from './extensions.sql.js'
export { PUBLICATIONS_SQL } from './publications.sql.js'
export { ROLES_SQL } from './roles.sql.js'
export { SCHEMAS_SQL } from './schemas.sql.js'
export { FUNCTIONS_SQL } from './functions.sql.js'
export { INDEXES_SQL } from './indexes.sql.js'
export { POLICIES_SQL } from './policies.sql.js'
export { TRIGGERS_SQL } from './triggers.sql.js'
export { TYPES_SQL } from './types.sql.js'
export { TABLES_SQL } from './table.sql.js'
export { VIEWS_SQL } from './views.sql.js'
export { MATERIALIZED_VIEWS_SQL } from './materialized_views.sql.js'
export { FOREIGN_TABLES_SQL } from './foreign_tables.sql.js'
export { COLUMNS_SQL } from './columns.sql.js'
export { TABLE_PRIVILEGES_SQL } from './table_privileges.sql.js'
export { COLUMN_PRIVILEGES_SQL } from './column_privileges.sql.js'
