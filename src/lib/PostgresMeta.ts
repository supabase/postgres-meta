import { PoolConfig } from 'pg'
import * as Parser from './Parser'
import PostgresMetaColumns from './PostgresMetaColumns'
import PostgresMetaConfig from './PostgresMetaConfig'
import PostgresMetaExtensions from './PostgresMetaExtensions'
import PostgresMetaForeignTables from './PostgresMetaForeignTables'
import PostgresMetaFunctions from './PostgresMetaFunctions'
import PostgresMetaPolicies from './PostgresMetaPolicies'
import PostgresMetaPublications from './PostgresMetaPublications'
import PostgresMetaRoles from './PostgresMetaRoles'
import PostgresMetaSchemas from './PostgresMetaSchemas'
import PostgresMetaTables from './PostgresMetaTables'
import PostgresMetaTriggers from './PostgresMetaTriggers'
import PostgresMetaTypes from './PostgresMetaTypes'
import PostgresMetaVersion from './PostgresMetaVersion'
import PostgresMetaViews from './PostgresMetaViews'
import { init } from './db'
import { PostgresMetaResult } from './types'

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
