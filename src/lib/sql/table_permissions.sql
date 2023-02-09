-- Adapted from information_schema.column_privileges view
-- Read all roles, not only those granted to login role of postgres-meta
-- Deleted database column
-- Deleted is_grantable column

SELECT 
  nc.nspname as table_schema, 
  pr_c.relname as table_name,
  pr_c.prtype as privilege, 
  u_grantor.rolname as grantor, 
  grantee.rolname as grantee
FROM 
  (
    SELECT 
      pg_class.oid, 
      pg_class.relname, 
      pg_class.relnamespace, 
      pg_class.relowner, 
      (
        aclexplode(
          COALESCE(
            pg_class.relacl, 
            acldefault('r' :: "char", pg_class.relowner)
          )
        )
      ).grantor AS grantor, 
      (
        aclexplode(
          COALESCE(
            pg_class.relacl, 
            acldefault('r' :: "char", pg_class.relowner)
          )
        )
      ).grantee AS grantee, 
      (
        aclexplode(
          COALESCE(
            pg_class.relacl, 
            acldefault('r' :: "char", pg_class.relowner)
          )
        )
      ).privilege_type AS privilege_type
    FROM 
      pg_class 
    WHERE 
      pg_class.relkind = ANY (
        ARRAY[ 'r' :: "char", 'v' :: "char", 'f' :: "char", 
        'p' :: "char" ]
      )
  ) pr_c(
    oid, relname, relnamespace, relowner, 
    grantor, grantee, prtype
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
      'PUBLIC' :: name
  ) grantee(oid, rolname) 
WHERE 
  pr_c.relnamespace = nc.oid 
  AND pr_c.grantee = grantee.oid 
  AND pr_c.grantor = u_grantor.oid 
  AND (
    pr_c.prtype = ANY (
      ARRAY[ 'INSERT' :: text, 'SELECT' :: text, 
      'UPDATE' :: text, 'REFERENCES' :: text]
    )
  ) 