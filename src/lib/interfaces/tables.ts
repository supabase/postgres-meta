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
  }

}

