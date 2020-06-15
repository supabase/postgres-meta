const { Router } = require('express')
const router = new Router()
const { types } = require('../lib/sql')
const RunQuery = require('../lib/connectionPool')
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Types } from '../lib/interfaces/types'

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, types.list)
    const query: Fetch.QueryParams = req.query
    let payload: Types.Type[] = data
    if (!query?.includeSystemSchemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error')
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})


const removeSystemSchemas = (data: Types.Type[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}



module.exports = router


/**
 * Types
 */

namespace Fetch {
  /**
   * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
   */
  export interface QueryParams {
    includeSystemSchemas: boolean
  }
}