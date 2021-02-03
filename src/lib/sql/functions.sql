SELECT
  p.oid :: int8 AS id,
  n.nspname AS schema,
  p.proname AS name,
  l.lanname AS language,
  CASE
    WHEN l.lanname = 'internal' THEN p.prosrc
    ELSE pg_get_functiondef(p.oid)
  END AS definition,
  pg_get_function_arguments(p.oid) AS argument_types,
  t.typname AS return_type
FROM
  pg_proc p
  LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
  LEFT JOIN pg_language l ON p.prolang = l.oid
  LEFT JOIN pg_type t ON t.oid = p.prorettype
