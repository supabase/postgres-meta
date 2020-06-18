const { Router } = require('express')
const router = new Router()
const { roles } = require('../lib/sql')
const RunQuery = require('../lib/connectionPool')
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Roles } from '../lib/interfaces/roles'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface GetRolesQueryParams {
  includeSystemSchemas: boolean
}
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, roles.list)
    const query: GetRolesQueryParams = req.query
    let payload: Roles.Role[] = data
    if (!query?.includeSystemSchemas) payload = removeSystemSchemas(data)

    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error')
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})


const removeSystemSchemas = (data: Roles.Role[]) => {
  return data.map(role => {
    let grants = role.grants.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
    return {
      ...role,
      grants
    }
  })
}

module.exports = router
