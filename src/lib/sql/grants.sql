SELECT
  c.oid AS table_id,
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
  INNER JOIN pg_class c ON table_schema::text::regnamespace = c.relnamespace
  AND table_name::text = c.relname
