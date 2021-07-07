-- Adapted from information_schema.schemata

SELECT
  n.oid :: int8 AS id,
  n.nspname AS name,
  u.rolname AS owner
FROM
  pg_namespace n,
  pg_authid u
WHERE
  n.nspowner = u.oid
  AND (
    pg_has_role(n.nspowner, 'USAGE')
    OR has_schema_privilege(n.oid, 'CREATE, USAGE')
  )
