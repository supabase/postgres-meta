-- error - returns the keys/indexes too
SELECT
  nspname AS schema,
  relname AS table,
  nspname || '.' || relname AS relation,
  pg_relation_size(C.oid) AS size
FROM
  pg_class C
  LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
WHERE
  nspname NOT IN ('pg_catalog', 'pg_toast', 'information_schema')
ORDER BY
  pg_relation_size(C.oid) DESC
