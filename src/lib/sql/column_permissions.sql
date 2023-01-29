-- Adapted from information_schema.column_privileges view
-- Read all roles, not only those granted to login role of postgres-meta
-- Deleted database column
-- Deleted is_grantable column

SELECT 
  nc.nspname as table_schema, 
  c.relname as table_name, 
  pr_a.attname as column_name, 
  pr_a.prtype as privilege, 
  u_grantor.rolname as grantor, 
  grantee.rolname as grantee
FROM 
  (
    SELECT 
      a.attrelid, 
      a.attname, 
      (
        aclexplode(
          COALESCE(
            a.attacl, 
            acldefault('c' :: "char", cc.relowner)
          )
        )
      ).grantor AS grantor, 
      (
        aclexplode(
          COALESCE(
            a.attacl, 
            acldefault('c' :: "char", cc.relowner)
          )
        )
      ).grantee AS grantee, 
      (
        aclexplode(
          COALESCE(
            a.attacl, 
            acldefault('c' :: "char", cc.relowner)
          )
        )
      ).privilege_type AS privilege_type
    FROM 
      pg_attribute a 
      JOIN pg_class cc ON a.attrelid = cc.oid 
    WHERE 
      a.attnum > 0 
      AND NOT a.attisdropped
  ) pr_a(
    attrelid, attname, grantor, grantee, 
    prtype
  ), 
  pg_class c,
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
      'PUBLIC' :: name
  ) grantee(oid, rolname) 
WHERE 
  pr_a.attrelid = c.oid
  AND c.relnamespace = nc.oid 
  AND pr_a.grantee = grantee.oid 
  AND pr_a.grantor = u_grantor.oid 
  AND (
    pr_a.prtype = ANY (
      ARRAY[ 'INSERT' :: text, 'SELECT' :: text, 
      'UPDATE' :: text, 'REFERENCES' :: text]
    )
  ) 
  AND (
    c.relkind = ANY (
      ARRAY[ 'r' :: "char", 'v' :: "char", 'f' :: "char", 
      'p' :: "char" ]
    )
  )
