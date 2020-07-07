import { Router } from 'express'
import SQL from 'sql-template-strings'
import { RunQuery } from '../lib/connectionPool'
import sql = require('../lib/sql')
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Tables } from '../lib/interfaces'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  includeSystemSchemas?: string
}

const router = Router()
const { columns, tables } = sql

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, columns)
    const query: QueryParams = req.query
    const includeSystemSchemas = query?.includeSystemSchemas === 'true'
    let payload: Tables.Column[] = data
    if (!includeSystemSchemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error')
    res.status(500).send('Database error.')
  }
})

router.post('/', async (req, res) => {
  try {
    const { tableId, name, type } = req.body as {
      tableId: number
      name: string
      type: string
    }
    const getTableQuery = getTableSqlize(tableId)
    const { name: table, schema } = (await RunQuery(req.headers.pg, getTableQuery)).data[0]

    const query = addColumnSqlize({ schema, table, name, type })
    await RunQuery(req.headers.pg, query)

    const getColumnQuery = getColumnSqlize(tableId, name)
    const column = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]

    return res.status(200).json(column)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const [tableId, ordinalPos] = req.params.id.split('.').map(Number)
    const getColumnQuery = getColumnByPosSqlize(tableId, ordinalPos)
    const column = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]
    const { schema, table, name: oldName } = column

    const { name, type } = req.body as {
      name?: string
      type?: string
    }

    const query = patchColumnSqlize({ schema, table, oldName, name, type })
    await RunQuery(req.headers.pg, query)

    const updated = (await RunQuery(req.headers.pg, getColumnQuery)).data[0]
    return res.status(200).json(updated)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
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
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

const getTableSqlize = (id: number) => {
  return SQL``.append(tables).append(SQL` AND c.oid = ${id}`)
}
const addColumnSqlize = ({
  schema,
  table,
  name,
  type,
}: {
  schema: string
  table: string
  name: string
  type: string
}) => {
  return `ALTER TABLE "${schema}"."${table}" ADD COLUMN "${name}" "${type}"`
}
const getColumnSqlize = (tableId: number, name: string) => {
  return SQL``.append(columns).append(SQL` WHERE c.oid = ${tableId} AND column_name = ${name}`)
}
const getColumnByPosSqlize = (tableId: number, ordinalPos: number) => {
  return SQL``
    .append(columns)
    .append(SQL` WHERE c.oid = ${tableId} AND ordinal_position = ${ordinalPos}`)
}
const patchColumnSqlize = ({
  schema,
  table,
  oldName,
  name,
  type,
}: {
  schema: string
  table: string
  oldName: string
  name?: string
  type?: string
}) => {
  const nameSql =
    name === undefined
      ? ''
      : `ALTER TABLE "${schema}"."${table}" RENAME COLUMN "${oldName}" TO "${name}";`
  const typeSql =
    type === undefined
      ? ''
      : `ALTER TABLE "${schema}"."${table}" ALTER COLUMN "${oldName}" SET DATA TYPE "${type}";`
  // Make sure typeSql comes first
  return `
BEGIN;
  ${typeSql}
  ${nameSql}
COMMIT;`
}
const dropColumnSqlize = (schema: string, table: string, name: string) => {
  return `ALTER TABLE "${schema}"."${table}" DROP COLUMN "${name}"`
}
const removeSystemSchemas = (data: Tables.Column[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

export = router
