SELECT
  table_schema AS schema,
  table_name AS table,
  column_name AS name,
  column_default AS default_value,
  is_identity :: boolean,
  is_nullable :: boolean,
  is_updatable :: boolean,
  data_type,
  udt_name AS format,
  identity_generation,
  (table_schema || '.' || table_name) AS table_id,
  col_description(
    (table_schema || '."' || table_name || '"') :: regclass,
    ordinal_position
  ) AS description,
  array_to_json(
    array(
      SELECT
        enumlabel
      FROM
        pg_catalog.pg_enum enums
      WHERE
        udt_name = pg_catalog.Format_type(enums.enumtypid :: regclass, NULL)
      ORDER BY
        enums.enumsortorder
    )
  ) AS enums
FROM
  information_schema.columns
