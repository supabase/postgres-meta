import { Router } from 'express'

import SQL from 'sql-template-strings'
import sqlTemplates = require('../lib/sql')
const { grants, roles } = sqlTemplates
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
    const query = createRoleSqlize(req.body)
    await RunQuery(req.headers.pg, query)

    const getRoleQuery = singleRoleByNameSqlize(roles, req.body.name)
    const role = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]

    return res.status(200).json(role)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getRoleQuery = singleRoleSqlize(roles, id)
    const role = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]
    const { name: oldName } = role

    const alterRoleArgs = req.body
    alterRoleArgs.oldName = oldName
    const query = alterRoleSqlize(alterRoleArgs)
    await RunQuery(req.headers.pg, query)

    const updated = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]
    return res.status(200).json(updated)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getRoleQuery = singleRoleSqlize(roles, id)
    const role = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]
    const { name } = role

    const query = dropRoleSqlize(name)
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(role)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
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
CREATE ROLE "${name}"
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
const singleRoleSqlize = (roles: string, id: string) => {
  return SQL``.append(roles).append(SQL` WHERE oid = ${id}`)
}
const singleRoleByNameSqlize = (roles: string, name: string) => {
  return SQL``.append(roles).append(SQL` WHERE rolname = ${name}`)
}
const alterRoleSqlize = ({
  oldName,
  name,
  isSuperuser,
  canCreateDb,
  canCreateRole,
  inheritRole,
  canLogin,
  isReplicationRole,
  canBypassRls,
  connectionLimit,
  password,
  validUntil,
}: {
  oldName: string
  name?: string
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
}) => {
  const nameSql = name === undefined ? '' : `ALTER ROLE "${oldName}" RENAME TO "${name}";`
  let isSuperuserSql = ''
  if (isSuperuser !== undefined) {
    isSuperuserSql = isSuperuser ? 'SUPERUSER' : 'NOSUPERUSER'
  }
  let canCreateDbSql = ''
  if (canCreateDb !== undefined) {
    canCreateDbSql = canCreateDb ? 'CREATEDB' : 'NOCREATEDB'
  }
  let canCreateRoleSql = ''
  if (canCreateRole !== undefined) {
    canCreateRoleSql = canCreateRole ? 'CREATEROLE' : 'NOCREATEROLE'
  }
  let inheritRoleSql = ''
  if (inheritRole !== undefined) {
    inheritRoleSql = inheritRole ? 'INHERIT' : 'NOINHERIT'
  }
  let canLoginSql = ''
  if (canLogin !== undefined) {
    canLoginSql = canLogin ? 'LOGIN' : 'NOLOGIN'
  }
  let isReplicationRoleSql = ''
  if (isReplicationRole !== undefined) {
    isReplicationRoleSql = isReplicationRole ? 'REPLICATION' : 'NOREPLICATION'
  }
  let canBypassRlsSql = ''
  if (canBypassRls !== undefined) {
    canBypassRlsSql = canBypassRls ? 'BYPASSRLS' : 'NOBYPASSRLS'
  }
  const connectionLimitSql =
    connectionLimit === undefined ? '' : `CONNECTION LIMIT ${connectionLimit}`
  let passwordSql = password === undefined ? '' : `PASSWORD '${password}'`
  let validUntilSql = validUntil === undefined ? '' : `VALID UNTIL '${validUntil}'`

  return `
BEGIN;
  ALTER ROLE "${oldName}"
    ${isSuperuserSql}
    ${canCreateDbSql}
    ${canCreateRoleSql}
    ${inheritRoleSql}
    ${canLoginSql}
    ${isReplicationRoleSql}
    ${canBypassRlsSql}
    ${connectionLimitSql}
    ${passwordSql}
    ${validUntilSql};
  ${nameSql}
COMMIT;`
}
const dropRoleSqlize = (name: string) => {
  return `DROP ROLE "${name}"`
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
