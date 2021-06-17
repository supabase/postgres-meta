select
    trigger_schema as "schema",
    trigger_name as "name",
    trigger_catalog as "catalog"
from
    information_schema.triggers