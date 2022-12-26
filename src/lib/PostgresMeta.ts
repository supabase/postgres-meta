import { PoolConfig } from 'pg'
import * as Parser from './Parser.js'
import PostgresMetaColumns from './PostgresMetaColumns.js'
import PostgresMetaConfig from './PostgresMetaConfig.js'
import PostgresMetaExtensions from './PostgresMetaExtensions.js'
import PostgresMetaForeignTables from './PostgresMetaForeignTables.js'
import PostgresMetaFunctions from './PostgresMetaFunctions.js'
import PostgresMetaPolicies from './PostgresMetaPolicies.js'
import PostgresMetaPublications from './PostgresMetaPublications.js'
import PostgresMetaRoles from './PostgresMetaRoles.js'
import PostgresMetaSchemas from './PostgresMetaSchemas.js'
import PostgresMetaTables from './PostgresMetaTables.js'
import PostgresMetaTriggers from './PostgresMetaTriggers.js'
import PostgresMetaTypes from './PostgresMetaTypes.js'
import PostgresMetaVersion from './PostgresMetaVersion.js'
import PostgresMetaViews from './PostgresMetaViews.js'
import { init } from './db.js'
import { PostgresMetaResult } from './types.js'

export default class PostgresMeta {
  query: (sql: string) => Promise<PostgresMetaResult<any>>
  end: () => Promise<void>
  columns: PostgresMetaColumns
  config: PostgresMetaConfig
  extensions: PostgresMetaExtensions
  foreignTables: PostgresMetaForeignTables
  functions: PostgresMetaFunctions
  policies: PostgresMetaPolicies
  publications: PostgresMetaPublications
  roles: PostgresMetaRoles
  schemas: PostgresMetaSchemas
  tables: PostgresMetaTables
  triggers: PostgresMetaTriggers
  types: PostgresMetaTypes
  version: PostgresMetaVersion
  views: PostgresMetaViews

  parse = Parser.Parse
  deparse = Parser.Deparse
  format = Parser.Format

  constructor(config: PoolConfig) {
    const { query, end } = init(config)
    this.query = query
    this.end = end
    this.columns = new PostgresMetaColumns(this.query)
    this.config = new PostgresMetaConfig(this.query)
    this.extensions = new PostgresMetaExtensions(this.query)
    this.foreignTables = new PostgresMetaForeignTables(this.query)
    this.functions = new PostgresMetaFunctions(this.query)
    this.policies = new PostgresMetaPolicies(this.query)
    this.publications = new PostgresMetaPublications(this.query)
    this.roles = new PostgresMetaRoles(this.query)
    this.schemas = new PostgresMetaSchemas(this.query)
    this.tables = new PostgresMetaTables(this.query)
    this.triggers = new PostgresMetaTriggers(this.query)
    this.types = new PostgresMetaTypes(this.query)
    this.version = new PostgresMetaVersion(this.query)
    this.views = new PostgresMetaViews(this.query)
  }
}
