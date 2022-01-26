import { PoolConfig } from 'pg'
import * as Parser from './Parser'
import PostgresMetaColumns from './PostgresMetaColumns'
import PostgresMetaConfig from './PostgresMetaConfig'
import PostgresMetaExtensions from './PostgresMetaExtensions'
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
export default class PostgresMeta {
  query: (sql: string) => Promise<any>
  end: () => Promise<void>
  columns: PostgresMetaColumns
  config: PostgresMetaConfig
  extensions: PostgresMetaExtensions
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
    const { query, queryArrayMode, end } = init(config)
    this.query = queryArrayMode
    this.end = end
    this.columns = new PostgresMetaColumns(query)
    this.config = new PostgresMetaConfig(query)
    this.extensions = new PostgresMetaExtensions(query)
    this.functions = new PostgresMetaFunctions(query)
    this.policies = new PostgresMetaPolicies(query)
    this.publications = new PostgresMetaPublications(query)
    this.roles = new PostgresMetaRoles(query)
    this.schemas = new PostgresMetaSchemas(query)
    this.tables = new PostgresMetaTables(query)
    this.triggers = new PostgresMetaTriggers(query)
    this.types = new PostgresMetaTypes(query)
    this.version = new PostgresMetaVersion(query)
    this.views = new PostgresMetaViews(query)
  }
}
