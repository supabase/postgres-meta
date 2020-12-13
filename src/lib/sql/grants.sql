-- Adapted from information_schema.role_table_grants

SELECT
  c.oid :: int8 AS table_id,
  u_grantor.rolname AS grantor,
  grantee.rolname AS grantee,
  nc.nspname AS schema,
  c.relname AS table_name,
  c.prtype AS privilege_type,
  CASE
    WHEN pg_has_role(grantee.oid, c.relowner, 'USAGE')
    OR c.grantable THEN TRUE
    ELSE FALSE
  END AS is_grantable,
  CASE
    WHEN c.prtype = 'SELECT' THEN TRUE
    ELSE FALSE
  END AS with_hierarchy
FROM
  (
    SELECT
      pg_class.oid,
      pg_class.relname,
      pg_class.relnamespace,
      pg_class.relkind,
      pg_class.relowner,
      (
        aclexplode(
          COALESCE(
            pg_class.relacl,
            acldefault('r', pg_class.relowner)
          )
        )
      ).grantor AS grantor,
      (
        aclexplode(
          COALESCE(
            pg_class.relacl,
            acldefault('r', pg_class.relowner)
          )
        )
      ).grantee AS grantee,
      (
        aclexplode(
          COALESCE(
            pg_class.relacl,
            acldefault('r', pg_class.relowner)
          )
        )
      ).privilege_type AS privilege_type,
      (
        aclexplode(
          COALESCE(
            pg_class.relacl,
            acldefault('r', pg_class.relowner)
          )
        )
      ).is_grantable AS is_grantable
    FROM
      pg_class
  ) c(
    oid,
    relname,
    relnamespace,
    relkind,
    relowner,
    grantor,
    grantee,
    prtype,
    grantable
  ),
  pg_namespace nc,
  pg_authid u_grantor,
  (
    SELECT
      pg_authid.oid,
      pg_authid.rolname
    FROM
      pg_authid
    UNION ALL
    SELECT
      0 :: oid AS oid,
      'PUBLIC'
  ) grantee(oid, rolname)
WHERE
  c.relnamespace = nc.oid
  AND (c.relkind IN ('r', 'v', 'f', 'p'))
  AND c.grantee = grantee.oid
  AND c.grantor = u_grantor.oid
  AND (
    c.prtype IN (
      'INSERT',
      'SELECT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER'
    )
  )
  AND (
    pg_has_role(u_grantor.oid, 'USAGE')
    OR pg_has_role(grantee.oid, 'USAGE')
  )
