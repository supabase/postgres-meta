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
    id: number

    grants: Grant[]
  }

  export interface Grant {
    table_id: number
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

export namespace Functions {
  export interface Function {
    id: number
    schema: string
    name: string
    language: string
    definition: string
    argument_types: string
    return_type: string
  }
}

export namespace Schemas {
  export interface Schema {
    id: number
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
    id: string
    catalog: string
    schema: string
    name: string
    is_insertable_into: boolean
    is_typed: boolean
    bytes: number
    size: string
    rls_enabled: boolean // determines where RLS has been turned on
    rls_forced: boolean // determines whether RLS should be forced on the table owner

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
    enums: any[]
  }

  export interface Column {
    table_id: number
    schema: string
    table: string
    id: string
    ordinal_position: number
    name: string
    default_value: string | null
    data_type: string
    format: string
    description: string | null
    is_identity: boolean
    identity_generation: string | null
    is_nullable: boolean
    is_updatable: boolean
  }

  export interface Policy {
    id: number
    name: string
    schema: string
    table: string
    table_id: number
    action: 'PERMISSIVE' | 'RESTRICTIVE'
    roles: string[]
    command: string
    definition: string
    check: string
  }

  export interface PrimaryKey {
    schema: string
    table_name: string
    name: string
    table_id: string
  }

  export interface Relationship {
    source_schema: string
    source_table_name: string
    source_column_name: string
    target_table_schema: string
    target_table_name: string
    target_column_name: string
    constraint_name: string
  }
}

export namespace Types {
  export interface Type {
    id: number
    name: string
    schema: string
    format: string
    description: string | null
    enums: string[]
  }
}
