import { Router } from 'express'
import format, { ident } from 'pg-format'
import { coalesceRowsToArray, toTransaction } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Tables } from '../lib/interfaces'
import { logger } from '../lib/logger'
import sqlTemplates = require('../lib/sql')

/**
 * @param {string} [include_system_schemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  include_system_schemas?: string
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const sql = getTablesSql(sqlTemplates)
    const { data } = await RunQuery(req.headers.pg, sql)
    const query: QueryParams = req.query
    const include_system_schemas = query?.include_system_schemas === 'true'
    let payload: Tables.Table[] = data
    if (!include_system_schemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const sql = selectSingleSql(sqlTemplates, id)
    const table = (await RunQuery(req.headers.pg, sql)).data[0]
    if (typeof table === 'undefined') {
      return res.status(404).json({ error: `No table exists with ID ${id}.`, status: 404 })
    }

    return res.status(200).json(table)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const pcConnection: string = req.headers.pg.toString()
    const { schema = 'public', name } = req.body

    // Create the table
    const createTableSql = createTableSqlize(req.body)
    const alterSql = alterTableSql(req.body)
    const transaction = toTransaction([createTableSql, alterSql])
    await RunQuery(pcConnection, transaction)

    // Return fresh details
    const getTable = selectSingleByName(sqlTemplates, schema, name)
    const { data: newTableResults } = await RunQuery(pcConnection, getTable)
    let newTable: Tables.Table = newTableResults[0]
    return res.status(200).json(newTable)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const pcConnection: string = req.headers.pg.toString()
    const id: number = parseInt(req.params.id)
    if (!(id > 0)) throw new Error('id is required')

    const name: string = req.body.name
    const payload: any = { ...req.body }

    // Get table
    const getTableSql = selectSingleSql(sqlTemplates, id)
    const { data: getTableResults } = await RunQuery(pcConnection, getTableSql)
    let previousTable: Tables.Table = getTableResults[0]

    // Update fields and name
    const nameSql =
      typeof name === 'undefined' || name === previousTable.name
        ? ''
        : alterTableName(previousTable.name, name, previousTable.schema)
    if (!name) payload.name = previousTable.name
    const alterSql = alterTableSql(payload)
    const transaction = toTransaction([nameSql, alterSql])
    await RunQuery(pcConnection, transaction)

    // Return fresh details
    const { data: freshTableData } = await RunQuery(pcConnection, getTableSql)
    let updated: Tables.Table = freshTableData[0]
    return res.status(200).json(updated)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const getTableQuery = selectSingleSql(sqlTemplates, id)
    const table = (await RunQuery(req.headers.pg, getTableQuery)).data[0]
    const { name, schema } = table

    const cascade = req.query.cascade === 'true'
    const query = dropTableSql(schema, name, cascade)
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(table)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

const getTablesSql = (sqlTemplates) => {
  const { columns, grants, policies, primary_keys, relationships, tables } = sqlTemplates
  return `
  WITH tables AS ( ${tables} ),
    columns AS ( ${columns} ),
    grants AS ( ${grants} ),
    policies AS ( ${policies} ),
    primary_keys AS ( ${primary_keys} ),
    relationships AS ( ${relationships} )
  SELECT
    *,
    ${coalesceRowsToArray('columns', 'SELECT * FROM columns WHERE columns.table_id = tables.id')},
    ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.table_id = tables.id')},
    ${coalesceRowsToArray(
      'policies',
      'SELECT * FROM policies WHERE policies.table_id = tables.id'
    )},
    ${coalesceRowsToArray(
      'primary_keys',
      'SELECT * FROM primary_keys WHERE primary_keys.table_id = tables.id'
    )},
    ${coalesceRowsToArray(
      'relationships',
      `SELECT
        *
      FROM
        relationships
      WHERE
        (relationships.source_schema :: text = tables.schema AND relationships.source_table_name :: text = tables.name)
        OR (relationships.target_table_schema :: text = tables.schema AND relationships.target_table_name :: text = tables.name)`
    )}
  FROM tables;`.trim()
}
const selectSingleSql = (sqlTemplates: { [key: string]: string }, id: number) => {
  const { columns, grants, policies, primary_keys, relationships, tables } = sqlTemplates
  return `
  WITH tables AS ( ${tables} AND c.oid = ${id} ),
    columns AS ( ${columns} ),
    grants AS ( ${grants} ),
    policies AS ( ${policies} ),
    primary_keys AS ( ${primary_keys} ),
    relationships AS ( ${relationships} )
  SELECT
    *,
    ${coalesceRowsToArray('columns', 'SELECT * FROM columns WHERE columns.table_id = tables.id')},
    ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.table_id = tables.id')},
    ${coalesceRowsToArray(
      'policies',
      'SELECT * FROM policies WHERE policies.table_id = tables.id'
    )},
    ${coalesceRowsToArray(
      'primary_keys',
      'SELECT * FROM primary_keys WHERE primary_keys.table_id = tables.id'
    )},
    ${coalesceRowsToArray(
      'relationships',
      `SELECT
        *
      FROM
        relationships
      WHERE
        (relationships.source_schema :: text = tables.schema AND relationships.source_table_name :: text = tables.name)
        OR (relationships.target_table_schema :: text = tables.schema AND relationships.target_table_name :: text = tables.name)`
    )}
  FROM tables;`.trim()
}

const selectSingleByName = (
  sqlTemplates: { [key: string]: string },
  schema: string,
  name: string
) => {
  const { columns, grants, policies, primary_keys, relationships, tables } = sqlTemplates
  return `
  WITH tables AS ( ${tables} AND nc.nspname = ${format.literal(
    schema
  )} AND c.relname = ${format.literal(name)} ),
    columns AS ( ${columns} ),
    grants AS ( ${grants} ),
    policies AS ( ${policies} ),
    primary_keys AS ( ${primary_keys} ),
    relationships AS ( ${relationships} )
  SELECT
    *,
    ${coalesceRowsToArray('columns', 'SELECT * FROM columns WHERE columns.table_id = tables.id')},
    ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.table_id = tables.id')},
    ${coalesceRowsToArray(
      'policies',
      'SELECT * FROM policies WHERE policies.table_id = tables.id'
    )},
    ${coalesceRowsToArray(
      'primary_keys',
      'SELECT * FROM primary_keys WHERE primary_keys.table_id = tables.id'
    )},
    ${coalesceRowsToArray(
      'relationships',
      `SELECT
        *
      FROM
        relationships
      WHERE
        (relationships.source_schema :: text = tables.schema AND relationships.source_table_name :: text = tables.name)
        OR (relationships.target_table_schema :: text = tables.schema AND relationships.target_table_name :: text = tables.name)`
    )}
  FROM tables;`.trim()
}

const createTableSqlize = ({
  name,
  schema = 'public',
  replica_identity,
  replica_identity_index,
  comment,
}: {
  name: string
  schema?: string
  replica_identity?: 'DEFAULT' | 'INDEX' | 'FULL' | 'NOTHING'
  replica_identity_index?: string
  comment?: string
}) => {
  const tableSql = format('CREATE TABLE IF NOT EXISTS %I.%I ();', schema, name)
  let replicaSql: string
  if (replica_identity === undefined) {
    replicaSql = ''
  } else if (replica_identity === 'INDEX') {
    replicaSql = `ALTER TABLE ${ident(schema)}.${ident(
      name
    )} REPLICA IDENTITY USING INDEX ${replica_identity_index};`
  } else {
    replicaSql = `ALTER TABLE ${ident(schema)}.${ident(name)} REPLICA IDENTITY ${replica_identity};`
  }
  const commentSql =
    comment === undefined ? '' : format('COMMENT ON TABLE %I.%I IS %L;', schema, name, comment)
  return `
BEGIN;
  ${tableSql}
  ${replicaSql}
  ${commentSql}
COMMIT;`
}
const alterTableName = (previousName: string, newName: string, schema: string) => {
  return format('ALTER TABLE %I.%I RENAME TO %I;', schema, previousName, newName)
}
const alterTableSql = ({
  schema = 'public',
  name,
  rls_enabled,
  rls_forced,
  replica_identity,
  replica_identity_index,
  comment,
}: {
  schema?: string
  name: string
  rls_enabled?: boolean
  rls_forced?: boolean
  replica_identity?: 'DEFAULT' | 'INDEX' | 'FULL' | 'NOTHING'
  replica_identity_index?: string
  comment?: string
}) => {
  let alter = format('ALTER TABLE %I.%I', schema, name)
  let enableRls = ''
  if (rls_enabled !== undefined) {
    let enable = `${alter} ENABLE ROW LEVEL SECURITY;`
    let disable = `${alter} DISABLE ROW LEVEL SECURITY;`
    enableRls = rls_enabled ? enable : disable
  }
  let forceRls = ''
  if (rls_forced !== undefined) {
    let enable = `${alter} FORCE ROW LEVEL SECURITY;`
    let disable = `${alter} NO FORCE ROW LEVEL SECURITY;`
    forceRls = rls_forced ? enable : disable
  }
  let replicaSql: string
  if (replica_identity === undefined) {
    replicaSql = ''
  } else if (replica_identity === 'INDEX') {
    replicaSql = `${alter} REPLICA IDENTITY USING INDEX ${replica_identity_index};`
  } else {
    replicaSql = `${alter} REPLICA IDENTITY ${replica_identity};`
  }
  const commentSql =
    comment === undefined ? '' : format('COMMENT ON TABLE %I.%I IS %L;', schema, name, comment)
  return `
BEGIN;
    ${enableRls}
    ${forceRls}
    ${replicaSql}
    ${commentSql}
COMMIT;`
}
const dropTableSql = (schema: string, name: string, cascade: boolean) => {
  return format(`DROP TABLE %I.%I ${cascade ? 'CASCADE' : 'RESTRICT'};`, schema, name)
}
const removeSystemSchemas = (data: Tables.Table[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

export = router
