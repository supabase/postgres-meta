SELECT
  n.nspname AS schema,
  c.oid :: regclass AS table_name,
  a.attname AS name,
  c.oid AS table_id
FROM
  pg_index i,
  pg_class c,
  pg_attribute a,
  pg_namespace n
WHERE
  i.indrelid = c.oid
  AND c.relnamespace = n.oid
  AND a.attrelid = c.oid
  AND a.attnum = ANY (i.indkey)
  AND i.indisprimary
