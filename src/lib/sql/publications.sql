SELECT
  p.oid :: int8 AS id,
  p.pubname AS name,
  r.rolname AS owner,
  p.pubinsert AS publish_insert,
  p.pubupdate AS publish_update,
  p.pubdelete AS publish_delete,
  p.pubtruncate AS publish_truncate,
  CASE
    WHEN p.puballtables THEN NULL
    ELSE pr.tables
  END AS tables
FROM
  pg_catalog.pg_publication AS p
  LEFT JOIN LATERAL (
    SELECT
      COALESCE(
        array_agg(c.relname :: text) filter (
          WHERE
            c.relname IS NOT NULL
        ),
        '{}'
      ) AS tables
    FROM
      pg_catalog.pg_publication_rel AS pr
      JOIN pg_class AS c ON pr.prrelid = c.oid
    WHERE
      pr.prpubid = p.oid
  ) AS pr ON 1 = 1
  JOIN pg_roles AS r ON p.pubowner = r.oid
