import { ClientConfig } from 'pg'
import PostgresMetaColumns from './PostgresMetaColumns'
import PostgresMetaConfig from './PostgresMetaConfig'
import PostgresMetaExtensions from './PostgresMetaExtensions'
import PostgresMetaFunctions from './PostgresMetaFunctions'
import PostgresMetaPolicies from './PostgresMetaPolicies'
import PostgresMetaPublications from './PostgresMetaPublications'
import PostgresMetaRoles from './PostgresMetaRoles'
import PostgresMetaSchemas from './PostgresMetaSchemas'
import PostgresMetaTables from './PostgresMetaTables'
import PostgresMetaTypes from './PostgresMetaTypes'
import PostgresMetaVersion from './PostgresMetaVersion'
import { init } from './db'
import { PostgresMetaResult } from './types'

export default class PostgresMeta {
  query: (sql: string) => Promise<PostgresMetaResult<any>>
  columns: PostgresMetaColumns
  config: PostgresMetaConfig
  extensions: PostgresMetaExtensions
  functions: PostgresMetaFunctions
  policies: PostgresMetaPolicies
  publications: PostgresMetaPublications
  roles: PostgresMetaRoles
  schemas: PostgresMetaSchemas
  tables: PostgresMetaTables
  types: PostgresMetaTypes
  version: PostgresMetaVersion

  constructor(config: ClientConfig) {
    this.query = init(config)
    this.columns = new PostgresMetaColumns(this.query)
    this.config = new PostgresMetaConfig(this.query)
    this.extensions = new PostgresMetaExtensions(this.query)
    this.functions = new PostgresMetaFunctions(this.query)
    this.policies = new PostgresMetaPolicies(this.query)
    this.publications = new PostgresMetaPublications(this.query)
    this.roles = new PostgresMetaRoles(this.query)
    this.schemas = new PostgresMetaSchemas(this.query)
    this.tables = new PostgresMetaTables(this.query)
    this.types = new PostgresMetaTypes(this.query)
    this.version = new PostgresMetaVersion(this.query)
  }
}
