SELECT
    catalog_name,
    schema_name as name,
    schema_owner as owner,
    default_character_set_catalog,
    default_character_set_schema,
    default_character_set_name,
    sql_path
FROM
    information_schema.schemata