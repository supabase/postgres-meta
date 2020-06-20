import { Router } from 'express'
const router = Router()
const { schemas } = require('../lib/sql')
const RunQuery = require('../lib/connectionPool')
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Schemas } from '../lib/interfaces/schemas'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface GetSchemasQueryParams {
  includeSystemSchemas: boolean
}
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, schemas.list)
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

module.exports = router
