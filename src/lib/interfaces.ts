export namespace Roles {
  export interface Role {
    name: string
    is_superuser: boolean
    can_create_db: boolean
    can_create_role: boolean
    inherit_role: boolean
    can_login: boolean
    is_replication_role: boolean
    can_bypass_rls: boolean
    connection_limit: number
    password: string
    valid_until: string
    config: string
    oid: number

    grants: Grant[]
  }

  export interface Grant {
    table_id: string
    grantor: string
    grantee: string
    catalog: string
    schema: string
    table_name: string
    privilege_type: string
    is_grantable: boolean
    with_hierarchy: boolean
  }
}

export namespace Schemas {
  export interface Schema {
    catalog_name: string
    name: string
    owner: string
    default_character_set_catalog: string | null
    default_character_set_schema: string | null
    default_character_set_name: string | null
    sql_path: string | null
  }
}

export namespace Tables {
  export interface Table {
    table_id: string
    catalog: string
    schema: string
    name: string
    is_insertable_into: boolean
    is_typed: boolean
    bytes: number
    size: string

    // pg_stat_all_tables columns
    sequential_scans: number
    sequential_scan_row_reads: number
    index_scans: number
    index_scan_row_reads: number
    row_inserts: number
    row_updates: number
    row_deletes: number
    row_hot_updates: number
    live_rows: number
    dead_rows: number
    rows_modified_since_analyze: number
    last_vacuum: string | null
    last_autovacuum: string | null
    last_analyze: string | null
    last_autoanalyze: string | null
    vacuum_count: number
    autovacuum_count: number
    analyze_count: number
    autoanalyze_count: number

    columns: Column[]
    grants: Roles.Grant[]
    primary_keys: PrimaryKey[]
    relationships: Relationship[]
  }

  export interface Column {
    schema: string
    table: string
    name: string
    default_value: string | null
    is_identity: boolean
    is_nullable: boolean
    is_updatable: boolean
    data_type: string
    format: string
    identity_generation: string | null
    table_id: string
    description: string | null
    enums: string[]
  }

  export interface PrimaryKey {
    schema: string
    table_name: string
    name: string
    table_id: string
  }

  export interface Relationship {
    source_table_id: string
    source_schema: string
    source_table_name: string
    source_column_name: string
    target_table_id: string
    target_table_schema: string
    target_table_name: string
    target_column_name: string
    constraint_name: string
  }
}

export namespace Types {
  export interface Type {
    type_id: string
    name: string
    schema: string
    format: string
    description: string | null
    enums: string[]
  }
}
