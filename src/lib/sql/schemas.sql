SELECT
  nsp.oid AS id,
  catalog_name,
  schema_name AS name,
  schema_owner AS owner,
  default_character_set_catalog,
  default_character_set_schema,
  default_character_set_name,
  sql_path
FROM
  information_schema.schemata
  JOIN pg_namespace nsp ON schema_name = nsp.nspname
