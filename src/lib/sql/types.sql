SELECT
  t.oid :: int8 AS id,
  t.typname AS name,
  n.nspname AS schema,
  pg_catalog.Format_type (t.oid, NULL) AS format,
  pg_catalog.obj_description (t.oid, 'pg_type') AS description,
  array_to_json(
    array(
      SELECT
        e.enumlabel
      FROM
        pg_catalog.pg_enum e
      WHERE
        e.enumtypid = t.oid
      ORDER BY
        e.oid
    )
  ) AS enums
FROM
  pg_catalog.pg_type t
  LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE
  (
    t.typrelid = 0
    OR (
      SELECT
        c.relkind = 'c'
      FROM
        pg_catalog.pg_class c
      WHERE
        c.oid = t.typrelid
    )
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      pg_catalog.pg_type el
    WHERE
      el.oid = t.typelem
      AND el.typarray = t.oid
  )
