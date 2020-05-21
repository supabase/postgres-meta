select
    "name",
    setting,
    category,
    TRIM(split_part(category, '/', 1)) as "group",
    TRIM(split_part(category, '/', 2)) as "subgroup",
    unit,
    short_desc,
    extra_desc,
    context,
    vartype,
    "source",
    min_val,
    max_val,
    enumvals,
    boot_val,
    reset_val,
    sourcefile,
    sourceline,
    pending_restart
FROM
    pg_settings
ORDER BY
    category,
    name