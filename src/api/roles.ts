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
interface QueryParams {
  includeDefaultRoles?: string
  includeSystemSchemas?: string
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const sql = getRolesSqlize(roles, grants)
    const { data } = await RunQuery(req.headers.pg, sql)
    const query: QueryParams = req.query
    const includeSystemSchemas = query?.includeSystemSchemas === 'true'
    const includeDefaultRoles = query?.includeDefaultRoles === 'true'
    let payload: Roles.Role[] = data
    if (!includeSystemSchemas) payload = removeSystemSchemas(data)
    if (!includeDefaultRoles) payload = removeDefaultRoles(payload)

    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error')
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.post('/', async (req, res) => {
  try {
    const sql = createRoleSqlize(req.body)
    const { data } = await RunQuery(req.headers.pg, sql)
    return res.status(200).json(data)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json([{ error: error.toString() }])
  }
})

const getRolesSqlize = (roles: string, grants: string) => {
  return `
WITH roles AS ( ${roles} ),
  grants AS ( ${grants} )
SELECT
  *,
  ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.grantee = roles.name')}
FROM
  roles`
}
const createRoleSqlize = ({
  name,
  isSuperuser = false,
  canCreateDb = false,
  canCreateRole = false,
  inheritRole = true,
  canLogin = false,
  isReplicationRole = false,
  canBypassRls = false,
  connectionLimit = -1,
  password,
  validUntil,
  memberOf,
  members,
  admins,
}: {
  name: string
  isSuperuser?: boolean
  canCreateDb?: boolean
  canCreateRole?: boolean
  inheritRole?: boolean
  canLogin?: boolean
  isReplicationRole?: boolean
  canBypassRls?: boolean
  connectionLimit?: number
  password?: string
  validUntil?: string
  memberOf?: string[]
  members?: string[]
  admins?: string[]
}) => {
  const isSuperuserSql = isSuperuser ? 'SUPERUSER' : 'NOSUPERUSER'
  const canCreateDbSql = canCreateDb ? 'CREATEDB' : 'NOCREATEDB'
  const canCreateRoleSql = canCreateRole ? 'CREATEROLE' : 'NOCREATEROLE'
  const inheritRoleSql = inheritRole ? 'INHERIT' : 'NOINHERIT'
  const canLoginSql = canLogin ? 'LOGIN' : 'NOLOGIN'
  const isReplicationRoleSql = isReplicationRole ? 'REPLICATION' : 'NOREPLICATION'
  const canBypassRlsSql = canBypassRls ? 'BYPASSRLS' : 'NOBYPASSRLS'
  const connectionLimitSql = `CONNECTION LIMIT ${connectionLimit}`
  const passwordSql = password === undefined ? '' : `PASSWORD '${password}'`
  const validUntilSql = validUntil === undefined ? '' : `VALID UNTIL '${validUntil}'`
  const memberOfSql = memberOf === undefined ? '' : `IN ROLE ${memberOf.join(',')}`
  const membersSql = members === undefined ? '' : `ROLE ${members.join(',')}`
  const adminsSql = admins === undefined ? '' : `ADMIN ${admins.join(',')}`

  return `
CREATE ROLE ${name}
WITH
  ${isSuperuserSql}
  ${canCreateDbSql}
  ${canCreateRoleSql}
  ${inheritRoleSql}
  ${canLoginSql}
  ${isReplicationRoleSql}
  ${canBypassRlsSql}
  ${connectionLimitSql}
  ${passwordSql}
  ${validUntilSql}
  ${memberOfSql}
  ${membersSql}
  ${adminsSql}`
}
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
