SELECT
  usename AS name,
  usesysid AS id,
  usecreatedb AS has_create_db_privileges,
  usesuper AS is_super_user,
  userepl AS has_replication_privileges,
  usebypassrls AS can_bypass_rls,
  valuntil AS valid_until,
  -- Password expiry time (only used for password authentication)
  useconfig AS user_config,
  -- Session defaults for run-time configuration variables
  active_connections.connections,
  pg_roles.rolconnlimit AS max_user_connections,
  max_db_connections.max_connections :: int2 AS max_db_connections
FROM
  pg_user AS users
  INNER JOIN pg_roles ON users.usename = pg_roles.rolname
  INNER JOIN LATERAL (
    SELECT
      count(*) AS connections
    FROM
      pg_stat_activity AS active_connections
    WHERE
      state = 'active'
      AND users.usename = active_connections.usename
  ) AS active_connections ON 1 = 1
  INNER JOIN LATERAL (
    SELECT
      setting AS max_connections
    FROM
      pg_settings
    WHERE
      name = 'max_connections'
  ) AS max_db_connections ON 1 = 1
