import { Router } from 'express'

import sql = require('../lib/sql')
const { columns, grants, primary_keys, relationships, tables } = sql
import { coalesceRowsToArray, formatColumns } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Tables } from '../lib/interfaces'

const router = Router()
router.get('/', async (req, res) => {
  try {
    const sql = `
WITH tables AS ( ${tables} ),
columns AS ( ${columns} ),
grants AS ( ${grants} ),
primary_keys AS ( ${primary_keys} ),
relationships AS ( ${relationships} )
SELECT
  *,
  ${coalesceRowsToArray(
    'columns',
    'SELECT * FROM columns WHERE columns.table_id = tables.table_id'
  )},
  ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.table_id = tables.table_id')},
  ${coalesceRowsToArray(
    'primary_keys',
    'SELECT * FROM primary_keys WHERE primary_keys.table_id = tables.table_id'
  )},
  ${coalesceRowsToArray(
    'relationships',
    `SELECT
       *
     FROM
       relationships
     WHERE
       relationships.source_table_id = tables.table_id
       OR relationships.target_table_id = tables.table_id`
  )}
FROM
  tables`
    const { data } = await RunQuery(req.headers.pg, sql)
    const query: Fetch.QueryParams = req.query
    let payload: Tables.Table[] = data
    if (!query?.includeSystemSchemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})
router.post('/', async (req, res) => {
  try {
    const { schema = 'public', name, columns, primary_keys = [] } = req.body as {
      schema?: string
      name: string
      columns: Tables.Column[]
      primary_keys?: Tables.PrimaryKey[]
    }
    const sql = `
CREATE TABLE ${schema}.${name} (
  ${formatColumns({ columns, primary_keys })}
)`
    const { data } = await RunQuery(req.headers.pg, sql)
    return res.status(200).json(data)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json([{ error: error.toString() }])
  }
})

export = router

const removeSystemSchemas = (data: Tables.Table[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

/**
 * Types
 */

namespace Fetch {
  /**
   * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
   */
  export interface QueryParams {
    includeSystemSchemas?: boolean
  }
}
