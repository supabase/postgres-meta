SELECT
  name,
  comment,
  default_version,
  installed_version
FROM
  pg_available_extensions
