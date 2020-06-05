select
    usename as "name",
    usesysid as "id",
    usecreatedb as "has_create_db_privileges",
    usesuper as "is_super_user",
    userepl as "has_replication_privileges",
    usebypassrls as "can_bypass_rls",
    valuntil as "valid_until", -- Password expiry time (only used for password authentication)
    useconfig as "user_config", -- Session defaults for run-time configuration variables
    active_connections.connections,
    pg_roles.rolconnlimit as max_user_connections,
    max_db_connections.max_connections as max_db_connections
from
    pg_user as users 
    inner join pg_roles on users.usename = pg_roles.rolname
    INNER JOIN LATERAL 
   	(
   		SELECT count(*) as connections 
   		FROM pg_stat_activity as active_connections
   		WHERE state = 'active' and users.usename = active_connections.usename
   	) as active_connections on 1=1 
    INNER JOIN LATERAL ( 
   		SELECT setting as max_connections 
   		from pg_settings where name = 'max_connections'
   	) as max_db_connections on 1=1;