import { Router } from 'express'
import SQL from 'sql-template-strings'
import sqlTemplates = require('../lib/sql')
const { columns, grants, policies, primary_keys, relationships, tables } = sqlTemplates
import { coalesceRowsToArray } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Tables } from '../lib/interfaces'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  includeSystemSchemas?: string
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const sql = `
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
  ${coalesceRowsToArray('policies', 'SELECT * FROM policies WHERE policies.table_id = tables.id')},
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
       (relationships.source_schema = tables.schema AND relationships.source_table_name = tables.name)
       OR (relationships.target_table_schema = tables.schema AND relationships.target_table_name = tables.name)`
  )}
FROM
  tables`
    const { data } = await RunQuery(req.headers.pg, sql)
    const query: QueryParams = req.query
    const includeSystemSchemas = query?.includeSystemSchemas === 'true'
    let payload: Tables.Table[] = data
    if (!includeSystemSchemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.post('/', async (req, res) => {
  try {
    const { schema = 'public', name } = req.body as {
      schema?: string
      name: string
    }

    // Create the table
    const createTableSql = createTable(name, schema)
    await RunQuery(req.headers.pg, createTableSql)

    // Return fresh details
    const getTable = selectSingleByName(schema, name)
    const { data: newTableResults } = await RunQuery(req.headers.pg, getTable)
    let newTable: Tables.Table = newTableResults[0]
    return res.status(200).json(newTable)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json([{ error: error.toString() }])
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id: number = parseInt(req.params.id)
    const name: string = req.body.name

    // Get table
    const getTableSql = selectSingleSql(id)
    const { data: getTableResults } = await RunQuery(req.headers.pg, getTableSql)
    let previousTable: Tables.Table = getTableResults[0]

    // Update fields
    // NB: Run name updates last
    if (name) {
      const updateName = alterTableName(previousTable.name, name, previousTable.schema)
      await RunQuery(req.headers.pg, updateName)
    }

    // Return fresh details
    const { data: updatedResults } = await RunQuery(req.headers.pg, getTableSql)
    let updated: Tables.Table = updatedResults[0]
    return res.status(200).json(updated)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json([{ error: error.toString() }])
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getTableQuery = SQL``.append(tables).append(SQL` AND c.oid = ${id}`)
    const table = (await RunQuery(req.headers.pg, getTableQuery)).data[0]
    const { name, schema } = table

    const cascade = req.query.cascade
    const query = `DROP TABLE "${schema}"."${name}" ${cascade === 'true' ? 'CASCADE' : 'RESTRICT'}`
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(table)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

const selectSingleSql = (id: number) => {
  return SQL``.append(tables).append(SQL` and c.oid = ${id}`)
}
const selectSingleByName = (schema: string, name: string) => {
  return SQL``.append(tables).append(SQL` and table_schema = ${schema} and table_name = ${name}`)
}
const createTable = (name: string, schema: string = 'postgres') => {
  const query = SQL``.append(`CREATE TABLE "${schema}"."${name}" ()`)
  return query
}
const alterTableName = (previousName: string, newName: string, schema: string) => {
  const query = SQL``.append(`ALTER TABLE "${schema}"."${previousName}" RENAME TO "${newName}"`)
  return query
}
const removeSystemSchemas = (data: Tables.Table[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

export = router
