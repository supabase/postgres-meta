select * from
(SELECT version()) "version",
(SELECT current_setting('server_version_num') as version_number) version_number,
(SELECT count(pid) as active_connections FROM pg_stat_activity WHERE state = 'active') active_connections,
(SELECT setting as max_connections from pg_settings where name = 'max_connections') max_connections;