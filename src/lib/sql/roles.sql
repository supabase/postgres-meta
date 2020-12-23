-- TODO: Consider using pg_authid vs. pg_roles for unencrypted password field
SELECT
  oid :: int8 AS id,
  rolname AS name,
  rolsuper AS is_superuser,
  rolcreatedb AS can_create_db,
  rolcreaterole AS can_create_role,
  rolinherit AS inherit_role,
  rolcanlogin AS can_login,
  rolreplication AS is_replication_role,
  rolbypassrls AS can_bypass_rls,
  active_connections,
  CASE WHEN rolconnlimit = -1 THEN max_db_connections :: int4
       ELSE rolconnlimit
  END AS connection_limit,
  rolpassword AS password,
  rolvaliduntil AS valid_until,
  rolconfig AS config
FROM
  pg_catalog.pg_roles
  INNER JOIN LATERAL (
    SELECT
      count(*) AS active_connections
    FROM
      pg_stat_activity
    WHERE
      state = 'active'
      AND pg_roles.rolname = pg_stat_activity.usename
  ) AS active_connections ON 1 = 1
  INNER JOIN LATERAL (
    SELECT
      setting AS max_db_connections
    FROM
      pg_settings
    WHERE
      name = 'max_connections'
  ) AS max_db_connections ON 1 = 1
