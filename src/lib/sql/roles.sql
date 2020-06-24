SELECT
  rolname AS name,
  rolsuper AS is_superuser,
  rolcreatedb AS can_create_db,
  rolcreaterole AS can_create_role,
  rolinherit AS inherit_role,
  rolcanlogin AS can_login,
  rolreplication AS is_replication_role,
  rolbypassrls AS can_bypass_rls,
  rolconnlimit AS connection_limit,
  rolpassword AS password,
  rolvaliduntil AS valid_until,
  rolconfig AS config,
  oid
FROM
  pg_catalog.pg_roles
