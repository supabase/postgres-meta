import { Router } from 'express'

import sql = require('../lib/sql')
const { grants, roles } = sql
import { coalesceRowsToArray } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants/schemas'
import { Roles } from '../lib/interfaces'

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
WITH roles AS ( ${roles} ),
grants AS ( ${grants} )
SELECT
  *,
  ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.grantee = roles.name')}
FROM
  roles`
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
router.post('/', async (req, res) => {
  try {
    const {
      name,
      is_super_user = false,
      has_create_db_privileges = false,
      has_replication_privileges = false,
      can_bypass_rls = false,
      connections = -1,
      valid_until,
    } = req.body as {
      name: string
      is_super_user?: boolean
      has_create_db_privileges?: boolean
      has_replication_privileges?: boolean
      can_bypass_rls?: boolean
      connections?: number
      valid_until?: string
    }
    const sql = `
CREATE ROLE ${name}
WITH
  ${is_super_user ? 'SUPERUSER' : 'NOSUPERUSER'}
  ${has_create_db_privileges ? 'CREATEDB' : 'NOCREATEDB'}
  ${has_replication_privileges ? 'REPLICATION' : 'NOREPLICATION'}
  ${can_bypass_rls ? 'BYPASSRLS' : 'NOBYPASSRLS'}
  CONNECTION LIMIT ${connections}
  ${valid_until === undefined ? '' : `VALID UNTIL '${valid_until}'`}`
    console.log(sql)
    const { data } = await RunQuery(req.headers.pg, sql)
    return res.status(200).json(data)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json([{ error: error.toString() }])
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
