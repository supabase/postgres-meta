import { Router } from 'express'

import sql = require('../lib/sql')
const { typesSql } = sql
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Types } from '../lib/interfaces'
import { logger } from '../lib/logger'

/**
 * @param {boolean} [include_system_schemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  include_system_schemas?: string
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, typesSql)
    const query: QueryParams = req.query
    const include_system_schemas = query?.include_system_schemas === 'true'
    let payload: Types.Type[] = data
    if (!include_system_schemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

const removeSystemSchemas = (data: Types.Type[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

export = router
