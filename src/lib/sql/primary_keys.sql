SELECT
  pg_namespace.nspname AS schema,
  pg_class.oid :: regclass AS table_name,
  pg_attribute.attname AS name,
  (
    pg_namespace.nspname || '.' || (pg_class.oid :: regclass)
  ) AS table_id
FROM
  pg_index,
  pg_class,
  pg_attribute,
  pg_namespace
WHERE
  indrelid = pg_class.oid
  AND pg_class.relnamespace = pg_namespace.oid
  AND pg_attribute.attrelid = pg_class.oid
  AND pg_attribute.attnum = ANY (pg_index.indkey)
  AND indisprimary
