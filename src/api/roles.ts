import { Router } from 'express'

import sql = require('../lib/sql')
const { grants, roles } = sql
import { coalesceRowsToArray } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_ROLES, DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Roles } from '../lib/interfaces'

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface GetRolesQueryParams {
  includeDefaultRoles?: boolean
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
    if (!query?.includeDefaultRoles) payload = removeDefaultRoles(payload)

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
      is_superuser = false,
      can_create_db = false,
      can_create_role = false,
      inherit_role = true,
      can_login = false,
      is_replication_role = false,
      can_bypass_rls = false,
      connection_limit = -1,
      password,
      valid_until,
      member_of,
      members,
      admins,
    } = req.body as {
      name: string
      is_superuser?: boolean
      can_create_db?: boolean
      can_create_role?: boolean
      inherit_role?: boolean
      can_login?: boolean
      is_replication_role?: boolean
      can_bypass_rls?: boolean
      connection_limit?: number
      password?: string
      valid_until?: string
      member_of?: string[]
      members?: string[]
      admins?: string[]
    }
    const sql = `
CREATE ROLE ${name}
WITH
  ${is_superuser ? 'SUPERUSER' : 'NOSUPERUSER'}
  ${can_create_db ? 'CREATEDB' : 'NOCREATEDB'}
  ${can_create_role ? 'CREATEROLE' : 'NOCREATEROLE'}
  ${inherit_role ? 'INHERIT' : 'NOINHERIT'}
  ${can_login ? 'LOGIN' : 'NOLOGIN'}
  ${is_replication_role ? 'REPLICATION' : 'NOREPLICATION'}
  ${can_bypass_rls ? 'BYPASSRLS' : 'NOBYPASSRLS'}
  CONNECTION LIMIT ${connection_limit}
  ${password === undefined ? '' : `PASSWORD '${password}'`}
  ${valid_until === undefined ? '' : `VALID UNTIL '${valid_until}'`}
  ${member_of === undefined ? '' : `IN ROLE ${member_of.join(',')}`}
  ${members === undefined ? '' : `ROLE ${members.join(',')}`}
  ${admins === undefined ? '' : `ADMIN ${admins.join(',')}`}`
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

const removeDefaultRoles = (data: Roles.Role[]) => {
  return data.filter((role) => !DEFAULT_ROLES.includes(role.name))
}

export = router
