SELECT
  c.oid :: int8 AS table_id,
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
  JOIN pg_class c ON quote_ident(table_schema) :: regnamespace = c.relnamespace
  AND table_name = c.relname
