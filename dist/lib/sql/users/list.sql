select
    usename,
    usesysid,
    usecreatedb,
    usesuper,
    userepl,
    usebypassrls,
    passwd,
    valuntil,
    useconfig,
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