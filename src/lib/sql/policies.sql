select
  pol.oid as id,
  n.nspname AS schema,
  c.relname AS table,
  c.oid :: int8 AS table_id,
  pol.polname AS name,
  CASE
    WHEN pol.polpermissive THEN 'PERMISSIVE' :: text
    ELSE 'RESTRICTIVE' :: text
  END AS action,
  CASE
    WHEN pol.polroles = '{0}' :: oid [] THEN array_to_json(
      string_to_array('public' :: text, '' :: text) :: name []
    )
    ELSE array_to_json(
      ARRAY(
        SELECT
          pg_authid.rolname
        FROM
          pg_authid
        WHERE
          pg_authid.oid = ANY (pol.polroles)
        ORDER BY
          pg_authid.rolname
      )
    )
  END AS roles,
  CASE
    pol.polcmd
    WHEN 'r' :: "char" THEN 'SELECT' :: text
    WHEN 'a' :: "char" THEN 'INSERT' :: text
    WHEN 'w' :: "char" THEN 'UPDATE' :: text
    WHEN 'd' :: "char" THEN 'DELETE' :: text
    WHEN '*' :: "char" THEN 'ALL' :: text
    ELSE NULL :: text
  END AS command,
  pg_get_expr(pol.polqual, pol.polrelid) AS definition,
  pg_get_expr(pol.polwithcheck, pol.polrelid) AS check
FROM
  pg_policy pol
  JOIN pg_class c ON c.oid = pol.polrelid
  LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
