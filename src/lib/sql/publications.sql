SELECT
  p.oid :: int8 AS id,
  p.pubname AS name,
  p.pubowner :: regrole AS owner,
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
        array_agg(pr.prrelid :: regclass :: text) filter (
          WHERE
            pr.prrelid IS NOT NULL
        ),
        '{}'
      ) AS tables
    FROM
      pg_catalog.pg_publication_rel AS pr
    WHERE
      pr.prpubid = p.oid
  ) AS pr ON 1 = 1
