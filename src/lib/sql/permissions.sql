-- Adapted from information_schema.column_privileges view
-- Read all roles, not only those granted to login role of postgres-meta
-- Deleted database column
-- Deleted is_grantable column

SELECT 
  nc.nspname AS table_schema, 
  x.relname AS table_name, 
  x.attname AS column_name, 
  x.prtype AS privilege,
  u_grantor.rolname AS grantor, 
  grantee.rolname AS grantee
FROM 
  (
    SELECT 
      pr_c.grantor, 
      pr_c.grantee, 
      a.attname, 
      pr_c.relname, 
      pr_c.relnamespace, 
      pr_c.prtype, 
      pr_c.grantable, 
      pr_c.relowner 
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
        grantor, grantee, prtype, grantable
      ), 
      pg_attribute a 
    WHERE 
      a.attrelid = pr_c.oid 
      AND a.attnum > 0 
      AND NOT a.attisdropped 
    UNION 
    SELECT 
      pr_a.grantor, 
      pr_a.grantee, 
      pr_a.attname, 
      c.relname, 
      c.relnamespace, 
      pr_a.prtype, 
      pr_a.grantable, 
      c.relowner 
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
        prtype, grantable
      ), 
      pg_class c 
    WHERE 
      pr_a.attrelid = c.oid 
      AND (
        c.relkind = ANY (
          ARRAY[ 'r' :: "char", 'v' :: "char", 'f' :: "char", 
          'p' :: "char" ]
        )
      )
  ) x, 
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
  x.relnamespace = nc.oid 
  AND x.grantee = grantee.oid 
  AND x.grantor = u_grantor.oid 
  AND (
    x.prtype = ANY (
      ARRAY[ 'INSERT' :: text, 'SELECT' :: text, 
      'UPDATE' :: text, 'REFERENCES' :: text]
    )
  )
