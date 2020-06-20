import { Router } from 'express'

import sql = require('../lib/sql')
const { tables } = sql
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Tables } from '../lib/interfaces/tables'

const router = Router()
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, tables.list)
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
