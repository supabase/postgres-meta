SELECT
  (table_schema || '.' || table_name) AS table_id,
  grantor,
  grantee,
  table_catalog AS catalog,
  table_schema AS schema,
  table_name,
  privilege_type,
  is_grantable :: boolean,
  with_hierarchy :: boolean
FROM
  information_schema.role_table_grants
