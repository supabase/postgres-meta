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
    relationships: Tables.Relationship[]
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

