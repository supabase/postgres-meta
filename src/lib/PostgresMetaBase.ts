import PostgresMetaColumnPrivileges from './PostgresMetaColumnPrivileges.js'
import PostgresMetaColumns from './PostgresMetaColumns.js'
import PostgresMetaConfig from './PostgresMetaConfig.js'
import PostgresMetaExtensions from './PostgresMetaExtensions.js'
import PostgresMetaForeignTables from './PostgresMetaForeignTables.js'
import PostgresMetaFunctions from './PostgresMetaFunctions.js'
import PostgresMetaIndexes from './PostgresMetaIndexes.js'
import PostgresMetaMaterializedViews from './PostgresMetaMaterializedViews.js'
import PostgresMetaPolicies from './PostgresMetaPolicies.js'
import PostgresMetaPublications from './PostgresMetaPublications.js'
import PostgresMetaRelationships from './PostgresMetaRelationships.js'
import PostgresMetaRoles from './PostgresMetaRoles.js'
import PostgresMetaSchemas from './PostgresMetaSchemas.js'
import PostgresMetaTablePrivileges from './PostgresMetaTablePrivileges.js'
import PostgresMetaTables from './PostgresMetaTables.js'
import PostgresMetaTriggers from './PostgresMetaTriggers.js'
import PostgresMetaTypes from './PostgresMetaTypes.js'
import PostgresMetaVersion from './PostgresMetaVersion.js'
import PostgresMetaViews from './PostgresMetaViews.js'
import { EndFn, QueryFn } from './types.js'

export type PostgresMetaBaseOptions = {
  query: QueryFn
  end: EndFn
}

export default class PostgresMetaBase {
  query: QueryFn
  end: EndFn

  columnPrivileges: PostgresMetaColumnPrivileges
  columns: PostgresMetaColumns
  config: PostgresMetaConfig
  extensions: PostgresMetaExtensions
  foreignTables: PostgresMetaForeignTables
  functions: PostgresMetaFunctions
  indexes: PostgresMetaIndexes
  materializedViews: PostgresMetaMaterializedViews
  policies: PostgresMetaPolicies
  publications: PostgresMetaPublications
  relationships: PostgresMetaRelationships
  roles: PostgresMetaRoles
  schemas: PostgresMetaSchemas
  tablePrivileges: PostgresMetaTablePrivileges
  tables: PostgresMetaTables
  triggers: PostgresMetaTriggers
  types: PostgresMetaTypes
  version: PostgresMetaVersion
  views: PostgresMetaViews

  constructor(options: PostgresMetaBaseOptions) {
    this.query = options.query
    this.end = options.end

    this.columnPrivileges = new PostgresMetaColumnPrivileges(this.query)
    this.columns = new PostgresMetaColumns(this.query)
    this.config = new PostgresMetaConfig(this.query)
    this.extensions = new PostgresMetaExtensions(this.query)
    this.foreignTables = new PostgresMetaForeignTables(this.query)
    this.functions = new PostgresMetaFunctions(this.query)
    this.indexes = new PostgresMetaIndexes(this.query)
    this.materializedViews = new PostgresMetaMaterializedViews(this.query)
    this.policies = new PostgresMetaPolicies(this.query)
    this.publications = new PostgresMetaPublications(this.query)
    this.relationships = new PostgresMetaRelationships(this.query)
    this.roles = new PostgresMetaRoles(this.query)
    this.schemas = new PostgresMetaSchemas(this.query)
    this.tablePrivileges = new PostgresMetaTablePrivileges(this.query)
    this.tables = new PostgresMetaTables(this.query)
    this.triggers = new PostgresMetaTriggers(this.query)
    this.types = new PostgresMetaTypes(this.query)
    this.version = new PostgresMetaVersion(this.query)
    this.views = new PostgresMetaViews(this.query)
  }
}
