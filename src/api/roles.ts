import { Router } from 'express'

import sql = require('../lib/sql')
const { grants, roles } = sql
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Roles } from '../lib/interfaces/roles'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface GetRolesQueryParams {
  includeSystemSchemas?: boolean
}

const router = Router()
router.get('/', async (req, res) => {
  try {
    const sql = `
      WITH roles AS (${roles}),
      grants AS (${grants})
      SELECT
        *,
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
                  grants.grantee = roles.name
              ) grants
          ),
          '[]'
        ) AS grants
      FROM
        roles
      `
    const { data } = await RunQuery(req.headers.pg, sql)
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
  return data.map((role) => {
    let grants = role.grants.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
    return {
      ...role,
      grants,
    }
  })
}

export = router
