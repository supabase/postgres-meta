interface PostgresMetaOk<T> {
  data: T
  error: null
}

interface PostgresMetaErr {
  data: null
  error: {
    message: string
  }
}

export type PostgresMetaResult<T> = PostgresMetaOk<T> | PostgresMetaErr

export interface PostgresColumn {
  table_id: number
  schema: string
  table: string
  id: string
  ordinal_position: number
  name: string
  default_value: any
  data_type: string
  format: string
  is_identity: boolean
  identity_generation: 'ALWAYS' | 'BY DEFAULT' | null
  is_nullable: boolean
  is_updatable: boolean
  enums: any[]
  comment: string | null
}

// TODO Rethink config.sql
export interface PostgresConfig {
  name: any
  setting: any
  category: any
  group: any
  subgroup: any
  unit: any
  short_desc: any
  extra_desc: any
  context: any
  vartype: any
  source: any
  min_val: any
  max_val: any
  enumvals: any
  boot_val: any
  reset_val: any
  sourcefile: any
  sourceline: any
  pending_restart: any
}

export interface PostgresExtension {
  name: string
  schema: string | null
  default_version: string
  installed_version: string | null
  comment: string | null
}

export interface PostgresFunction {
  id: number
  schema: string
  name: string
  language: string
  definition: string
  argument_types: string
  return_type: string
}

export interface PostgresGrant {
  table_id: number
  grantor: string
  grantee: string
  schema: string
  table_name: string
  privilege_type: 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE' | 'TRUNCATE' | 'REFERENCES' | 'TRIGGER'
  is_grantable: boolean
  with_hierarchy: boolean
}

export interface PostgresPolicy {
  id: number
  schema: string
  table: string
  table_id: string
  name: string
  action: 'PERMISSIVE' | 'RESTRICTIVE'
  roles: string[]
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL'
  definition: string | null
  check: string | null
}

export interface PostgresPrimaryKey {
  schema: string
  table_name: string
  name: string
  table_id: number
}

export interface PostgresPublication {
  id: number
  name: string
  owner: string
  publish_insert: boolean
  publish_update: boolean
  publish_delete: boolean
  publish_truncate: boolean
  tables: string[] | null
}

export interface PostgresRelationship {
  id: number
  constraint_name: string
  source_schema: string
  source_table_name: string
  source_column_name: string
  target_table_schema: string
  target_table_name: string
  target_column_name: string
}

export interface PostgresRole {
  id: number
  name: string
  is_superuser: boolean
  can_create_db: boolean
  can_create_role: boolean
  inherit_role: boolean
  can_login: boolean
  is_replication_role: boolean
  can_bypass_rls: boolean
  active_connections: number
  connection_limit: number
  password: string
  valid_until: string | null
  config: string | null
  grants: PostgresGrant[]
}

export interface PostgresSchema {
  id: number
  name: string
  owner: string
}

export interface PostgresTable {
  id: number
  schema: string
  name: string
  rls_enabled: boolean
  rls_forced: boolean
  replica_identity: 'DEFAULT' | 'INDEX' | 'FULL' | 'NOTHING'
  bytes: number
  size: string
  live_rows_estimate: number
  dead_rows_estimate: number
  comment: string | null
  columns: PostgresColumn[]
  grants: PostgresGrant[]
  policies: PostgresPolicy[]
  primary_keys: PostgresPrimaryKey[]
  relationships: PostgresRelationship[]
}

export interface PostgresType {
  id: number
  name: string
  schema: string
  format: string
  enums: any[]
  comment: string | null
}

export interface PostgresVersion {
  version: string
  version_number: number
  active_connections: number
  max_connections: number
}
