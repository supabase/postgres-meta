import { Router } from 'express'

import sql = require('../lib/sql')
const { columns, grants, pk_list, relationships, tables } = sql
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Tables } from '../lib/interfaces/tables'

const router = Router()
router.get('/', async (req, res) => {
  try {
    const sql = `
      WITH tables AS (${tables}),
      columns AS (${columns}),
      grants AS (${grants}),
      pk_list AS (${pk_list}),
      relationships AS (${relationships})
      SELECT
        *,
        COALESCE(
          (
            SELECT
              array_to_json(array_agg(row_to_json(columns)))
            FROM
              (
                SELECT
                  *
                FROM
                  columns
                WHERE
                  columns.table_id = tables.table_id
              ) columns
          ),
          '[]'
        ) AS columns,
        COALESCE(
          (
            SELECT
              array_to_json(array_agg(row_to_json(grants)))
            FROM
              (
                SELECT
                  *
                FROM
                  grants
                WHERE
                  grants.table_id = tables.table_id
              ) grants
          ),
          '[]'
        ) AS grants,
        COALESCE(
          (
            SELECT
              array_to_json(array_agg(row_to_json(primary_keys)))
            FROM
              (
                SELECT
                  *
                FROM
                  pk_list
                WHERE
                  pk_list.table_id = tables.table_id
              ) primary_keys
          ),
          '[]'
        ) AS primary_keys,
        COALESCE(
          (
            SELECT
              array_to_json(array_agg(row_to_json(relationships)))
            FROM
              (
                SELECT
                  *
                FROM
                  relationships
                WHERE
                  relationships.source_table_id = tables.table_id
                  OR relationships.target_table_id = tables.table_id
              ) relationships
          ),
          '[]'
        ) AS relationships
      FROM
        tables
      `
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
