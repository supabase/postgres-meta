import { Router } from 'express'
import format, { ident, literal } from 'pg-format'
import SQL from 'sql-template-strings'
import { RunQuery } from '../lib/connectionPool'
import sql = require('../lib/sql')
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Tables } from '../lib/interfaces'
import logger from '../server/logger'

/**
 * @param {boolean} [include_system_schemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  include_system_schemas?: string
}

const router = Router()
const { columnsSql, tablesSql } = sql

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, columnsSql)
    const query: QueryParams = req.query
    const include_system_schemas = query?.include_system_schemas === 'true'
    let payload: Tables.Column[] = data
    if (!include_system_schemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const tableId: number = req.body.table_id
    const name: string = req.body.name
    const getTableQuery = getTableSqlize(tableId)
    const { name: table, schema } = (await RunQuery(req.headers.pg, getTableQuery)).data[0]

    const addColumnArgs = req.body
    delete addColumnArgs.table_id
    addColumnArgs.table = table
    addColumnArgs.schema = schema
    const query = addColumnSqlize(addColumnArgs)
    await RunQuery(req.headers.pg, query)

    const getColumnQuery = getColumnSqlize(tableId, name)
    const column = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]

    return res.status(200).json(column)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const [tableId, ordinalPos] = req.params.id.split('.').map(Number)
    const getColumnQuery = getColumnByPosSqlize(tableId, ordinalPos)
    const column = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]

    const alterColumnArgs = req.body
    const query = alterColumnSqlize(column, alterColumnArgs)
    await RunQuery(req.headers.pg, query)

    const updated = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]
    return res.status(200).json(updated)
  } catch (error) {
    logger.error({ error, req: req.body })
    if (error instanceof TypeError) {
      res.status(404).json({ error: 'Cannot find a column with that id' })
    } else {
      res.status(400).json({ error: error.message })
    }
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [tableId, ordinalPos] = req.params.id.split('.').map(Number)
    const getColumnQuery = getColumnByPosSqlize(tableId, ordinalPos)
    const column = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]
    const { schema, table, name } = column

    const query = dropColumnSqlize(schema, table, name)
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(column)
  } catch (error) {
    logger.error({ error, req: req.body })
    if (error instanceof TypeError) {
      res.status(404).json({ error: 'Cannot find a column with that id' })
    } else {
      res.status(400).json({ error: error.message })
    }
  }
})

const getTableSqlize = (id: number) => {
  return SQL``.append(tablesSql).append(SQL` AND c.oid = ${id}`)
}
const addColumnSqlize = ({
  schema,
  table,
  name,
  type,
  default_value,
  default_value_format = 'literal',
  is_identity = false,
  identity_generation = 'BY DEFAULT',
  is_nullable = true,
  is_primary_key = false,
  is_unique = false,
  comment,
}: {
  schema: string
  table: string
  name: string
  type: string
  default_value?: any
  default_value_format?: 'expression' | 'literal'
  is_identity?: boolean
  identity_generation?: 'BY DEFAULT' | 'ALWAYS'
  is_nullable?: boolean
  is_primary_key?: boolean
  is_unique?: boolean
  comment?: string
}) => {
  let defaultValueSql: string = `DEFAULT ${literal(default_value)}`
  if (default_value === undefined) {
    defaultValueSql = ''
  } else if (default_value_format === 'expression') {
    defaultValueSql = `DEFAULT ${default_value}`
  }

  const isIdentitySql = is_identity ? `GENERATED ${identity_generation} AS IDENTITY` : ''
  const isNullableSql = is_nullable ? 'NULL' : 'NOT NULL'
  const isPrimaryKeySql = is_primary_key ? 'PRIMARY KEY' : ''
  const isUniqueSql = is_unique ? 'UNIQUE' : ''
  const commentSql =
    comment === undefined
      ? ''
      : format('COMMENT ON COLUMN %I.%I.%I IS %L;', schema, table, name, comment)

  return format(
    `
ALTER TABLE %I.%I ADD COLUMN %I ${type}
  ${defaultValueSql}
  ${isIdentitySql}
  ${isNullableSql}
  ${isPrimaryKeySql}
  ${isUniqueSql};
${commentSql}`,
    schema,
    table,
    name
  )
}
const getColumnSqlize = (tableId: number, name: string) => {
  return SQL``.append(columnsSql).append(SQL` AND c.oid = ${tableId} AND a.attname = ${name}`)
}
const getColumnByPosSqlize = (tableId: number, ordinalPos: number) => {
  return SQL``.append(columnsSql).append(SQL` AND c.oid = ${tableId} AND a.attnum = ${ordinalPos}`)
}
const alterColumnSqlize = (
  old: any,
  {
    name,
    type,
    drop_default = false,
    default_value,
    default_value_format = 'literal',
    is_identity,
    identity_generation,
    is_nullable,
    comment,
  }: {
    name?: string
    type?: string
    drop_default?: boolean
    default_value?: any
    default_value_format?: 'expression' | 'literal'
    is_identity?: boolean
    identity_generation?: 'BY DEFAULT' | 'ALWAYS'
    is_nullable?: boolean
    comment?: string
  }
) => {
  const nameSql =
    name === undefined || name === old.name
      ? ''
      : format('ALTER TABLE %I.%I RENAME COLUMN %I TO %I;', old.schema, old.table, old.name, name)
  // We use USING to allow implicit conversion of incompatible types (e.g. int4 -> text).
  const typeSql =
    type === undefined
      ? ''
      : format(
          `ALTER TABLE %I.%I ALTER COLUMN %I SET DATA TYPE ${type} USING %I::${type};`,
          old.schema,
          old.table,
          old.name,
          old.name
        )
  let defaultValueSql: string
  if (drop_default) {
    defaultValueSql = format(
      'ALTER TABLE %I.%I ALTER COLUMN %I DROP DEFAULT;',
      old.schema,
      old.table,
      old.name
    )
  } else if (default_value === undefined) {
    defaultValueSql = ''
  } else {
    const defaultValue =
      default_value_format === 'expression' ? default_value : literal(default_value)
    defaultValueSql = format(
      `ALTER TABLE %I.%I ALTER COLUMN %I SET DEFAULT ${defaultValue};`,
      old.schema,
      old.table,
      old.name
    )
  }
  // What identitySql does vary depending on the old and new values of
  // is_identity and identity_generation.
  //
  // | is_identity: old \ new | undefined          | true               | false          |
  // |------------------------+--------------------+--------------------+----------------|
  // | true                   | maybe set identity | maybe set identity | drop if exists |
  // |------------------------+--------------------+--------------------+----------------|
  // | false                  | -                  | add identity       | drop if exists |
  let identitySql = `ALTER TABLE ${ident(old.schema)}.${ident(old.table)} ALTER COLUMN ${ident(
    old.name
  )} `
  if (is_identity === false) {
    identitySql += 'DROP IDENTITY IF EXISTS;'
  } else if (old.is_identity === true) {
    if (identity_generation === undefined) {
      identitySql = ''
    } else {
      identitySql += `SET GENERATED ${identity_generation};`
    }
  } else if (is_identity === undefined) {
    identitySql = ''
  } else {
    identitySql += `ADD GENERATED ${identity_generation} AS IDENTITY;`
  }
  let isNullableSql: string
  if (is_nullable === undefined) {
    isNullableSql = ''
  } else {
    isNullableSql = is_nullable
      ? format('ALTER TABLE %I.%I ALTER COLUMN %I DROP NOT NULL;', old.schema, old.table, old.name)
      : format('ALTER TABLE %I.%I ALTER COLUMN %I SET NOT NULL;', old.schema, old.table, old.name)
  }
  const commentSql =
    comment === undefined
      ? ''
      : format('COMMENT ON COLUMN %I.%I.%I IS %L;', old.schema, old.table, old.name, comment)

  // nameSql must be last.
  // defaultValueSql must be after typeSql.
  // TODO: Can't set default if column is previously identity even if is_identity: false.
  // Must do two separate PATCHes (once to drop identity and another to set default).
  return `
BEGIN;
  ${isNullableSql}
  ${typeSql}
  ${defaultValueSql}
  ${identitySql}
  ${commentSql}
  ${nameSql}
COMMIT;`
}
const dropColumnSqlize = (schema: string, table: string, name: string) => {
  return format('ALTER TABLE %I.%I DROP COLUMN %I', schema, table, name)
}
const removeSystemSchemas = (data: Tables.Column[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

export = router
