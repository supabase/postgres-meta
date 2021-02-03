import { Router } from 'express'

import format from 'pg-format'
import SQL from 'sql-template-strings'
import sqlTemplates = require('../lib/sql')
const { grantsSql, rolesSql } = sqlTemplates
import { coalesceRowsToArray } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_ROLES, DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Roles } from '../lib/interfaces'
import logger from '../server/logger'

/**
 * @param {boolean} [include_system_schemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  include_default_roles?: string
  include_system_schemas?: string
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const sql = getRolesSqlize(rolesSql, grantsSql)
    const { data } = await RunQuery(req.headers.pg, sql)
    const query: QueryParams = req.query
    const include_system_schemas = query?.include_system_schemas === 'true'
    const include_default_roles = query?.include_default_roles === 'true'
    let payload: Roles.Role[] = data
    if (!include_system_schemas) payload = removeSystemSchemas(data)
    if (!include_default_roles) payload = removeDefaultRoles(payload)

    return res.status(200).json(payload)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const query = createRoleSqlize(req.body)
    await RunQuery(req.headers.pg, query)

    const getRoleQuery = singleRoleByNameSqlize(rolesSql, req.body.name)
    const role = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]

    return res.status(200).json(role)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getRoleQuery = singleRoleSqlize(rolesSql, id)
    const role = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]
    const { name: oldName } = role

    const alterRoleArgs = req.body
    alterRoleArgs.oldName = oldName
    const query = alterRoleSqlize(alterRoleArgs)
    await RunQuery(req.headers.pg, query)

    const updated = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]
    return res.status(200).json(updated)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getRoleQuery = singleRoleSqlize(rolesSql, id)
    const role = (await RunQuery(req.headers.pg, getRoleQuery)).data[0]
    const { name } = role

    const query = dropRoleSqlize(name)
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(role)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
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
}: {
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
}) => {
  const isSuperuserSql = is_superuser ? 'SUPERUSER' : 'NOSUPERUSER'
  const canCreateDbSql = can_create_db ? 'CREATEDB' : 'NOCREATEDB'
  const canCreateRoleSql = can_create_role ? 'CREATEROLE' : 'NOCREATEROLE'
  const inheritRoleSql = inherit_role ? 'INHERIT' : 'NOINHERIT'
  const canLoginSql = can_login ? 'LOGIN' : 'NOLOGIN'
  const isReplicationRoleSql = is_replication_role ? 'REPLICATION' : 'NOREPLICATION'
  const canBypassRlsSql = can_bypass_rls ? 'BYPASSRLS' : 'NOBYPASSRLS'
  const connectionLimitSql = `CONNECTION LIMIT ${connection_limit}`
  const passwordSql = password === undefined ? '' : `PASSWORD ${format.literal(password)}`
  const validUntilSql =
    valid_until === undefined ? '' : `VALID UNTIL ${format.literal(valid_until)}`
  const memberOfSql = member_of === undefined ? '' : `IN ROLE ${member_of.join(',')}`
  const membersSql = members === undefined ? '' : `ROLE ${members.join(',')}`
  const adminsSql = admins === undefined ? '' : `ADMIN ${admins.join(',')}`

  return `
CREATE ROLE ${format.ident(name)}
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
  is_superuser,
  can_create_db,
  can_create_role,
  inherit_role,
  can_login,
  is_replication_role,
  can_bypass_rls,
  connection_limit,
  password,
  valid_until,
}: {
  oldName: string
  name?: string
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
}) => {
  const nameSql = name === undefined ? '' : format('ALTER ROLE %I RENAME TO %I;', oldName, name)
  let isSuperuserSql = ''
  if (is_superuser !== undefined) {
    isSuperuserSql = is_superuser ? 'SUPERUSER' : 'NOSUPERUSER'
  }
  let canCreateDbSql = ''
  if (can_create_db !== undefined) {
    canCreateDbSql = can_create_db ? 'CREATEDB' : 'NOCREATEDB'
  }
  let canCreateRoleSql = ''
  if (can_create_role !== undefined) {
    canCreateRoleSql = can_create_role ? 'CREATEROLE' : 'NOCREATEROLE'
  }
  let inheritRoleSql = ''
  if (inherit_role !== undefined) {
    inheritRoleSql = inherit_role ? 'INHERIT' : 'NOINHERIT'
  }
  let canLoginSql = ''
  if (can_login !== undefined) {
    canLoginSql = can_login ? 'LOGIN' : 'NOLOGIN'
  }
  let isReplicationRoleSql = ''
  if (is_replication_role !== undefined) {
    isReplicationRoleSql = is_replication_role ? 'REPLICATION' : 'NOREPLICATION'
  }
  let canBypassRlsSql = ''
  if (can_bypass_rls !== undefined) {
    canBypassRlsSql = can_bypass_rls ? 'BYPASSRLS' : 'NOBYPASSRLS'
  }
  const connectionLimitSql =
    connection_limit === undefined ? '' : `CONNECTION LIMIT ${connection_limit}`
  let passwordSql = password === undefined ? '' : `PASSWORD ${format.literal(password)}`
  let validUntilSql = valid_until === undefined ? '' : `VALID UNTIL ${format.literal(valid_until)}`

  return `
BEGIN;
  ALTER ROLE ${format.ident(oldName)}
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
  return `DROP ROLE ${format.ident(name)}`
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
