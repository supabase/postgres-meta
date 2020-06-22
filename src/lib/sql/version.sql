SELECT
  *
FROM
  (
    SELECT
      version()
  ) version,
  (
    SELECT
      current_setting('server_version_num') AS version_number
  ) version_number,
  (
    SELECT
      count(pid) AS active_connections
    FROM
      pg_stat_activity
    WHERE
      state = 'active'
  ) active_connections,
  (
    SELECT
      setting AS max_connections
    FROM
      pg_settings
    WHERE
      name = 'max_connections'
  ) max_connections
