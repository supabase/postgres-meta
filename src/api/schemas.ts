import { Router } from 'express'

import sql = require('../lib/sql')
const { schemas } = sql
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Schemas } from '../lib/interfaces'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface GetSchemasQueryParams {
  includeSystemSchemas?: boolean
}

const router = Router()
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, schemas)
    const query: GetSchemasQueryParams = req.query
    let payload: Schemas.Schema[] = data
    if (!query?.includeSystemSchemas) payload = removeSystemSchemas(data)

    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error')
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

const removeSystemSchemas = (data: Schemas.Schema[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.name))
}

export = router
