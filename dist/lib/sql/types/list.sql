SELECT 
t.typname  AS name,
pg_catalog.Format_type ( t.oid, NULL ) AS format,
n.nspname as schema_name,
pg_catalog.obj_description ( t.oid, 'pg_type' ) AS description,
CASE
	WHEN t.typrelid != 0 THEN Cast ( 'tuple' AS pg_catalog.TEXT )
	WHEN t.typlen < 0 THEN Cast ( 'var' AS pg_catalog.TEXT )
	ELSE Cast ( t.typlen AS pg_catalog.TEXT )
END AS size,
array (
	select   e.enumlabel
	FROM     pg_catalog.pg_enum e
	WHERE    e.enumtypid = t.oid
	ORDER BY e.oid 
) AS enums
FROM pg_catalog.pg_type t LEFT JOIN pg_catalog.pg_namespace n
ON n.oid = t.typnamespace
WHERE (
	t.typrelid = 0
	OR (SELECT c.relkind = 'c' FROM   pg_catalog.pg_class c WHERE  c.oid = t.typrelid )
)
and NOT EXISTS (
	SELECT 1
	FROM pg_catalog.pg_type el
	WHERE el.oid = t.typelem AND el.typarray = t.oid 
)
AND pg_catalog.pg_type_is_visible ( t.oid )
ORDER BY 1, 2; 