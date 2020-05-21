SELECT
    (table_schema || '.' || table_name) as identifier,
    grantor,
    grantee,
    table_catalog,
    table_schema,
    table_name,
    privilege_type,
    is_grantable,
    with_hierarchy
FROM
    information_schema.role_table_grants
where
    table_schema <> 'information_schema'
    and table_schema <> 'pg_catalog'
ORDER BY table_name;