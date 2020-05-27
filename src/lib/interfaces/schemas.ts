export interface Schema {
  catalog_name: string
  schema_name: string
  schema_owner: string
  default_character_set_catalog: string
  default_character_set_schema: string
  default_character_set_name: string
  sql_path: string
}
/**
 * @param {string} schema_name The name of the schema which which should be created
 */
export interface CreateSchema {
  schema_name: string
}
