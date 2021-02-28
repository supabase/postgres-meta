import { ident, literal } from 'pg-format'
import { DEFAULT_ROLES, DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { coalesceRowsToArray } from './helpers'
import { grantsSql, rolesSql } from './sql'
import { PostgresMetaResult, PostgresRole } from './types'

export default class PostgresMetaRoles {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({ includeDefaultRoles = false, includeSystemSchemas = false } = {}): Promise<
    PostgresMetaResult<PostgresRole[]>
  > {
    const sql = `
WITH roles AS (${
      includeDefaultRoles
        ? rolesSql
        : `${rolesSql} WHERE NOT (rolname IN (${DEFAULT_ROLES.map(literal).join(',')}))`
    }),
  grants AS (${
    includeSystemSchemas
      ? grantsSql
      : `${grantsSql} AND NOT (nc.nspname IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(',')}))`
  })
SELECT
  *,
  ${coalesceRowsToArray('grants', 'SELECT * FROM grants WHERE grants.grantee = roles.name')}
FROM
  roles;`
    return await this.query(sql)
  }

  async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresRole>>
  async retrieve({ name }: { name: string }): Promise<PostgresMetaResult<PostgresRole>>
  async retrieve({
    id,
    name,
  }: {
    id?: number
    name?: string
  }): Promise<PostgresMetaResult<PostgresRole>> {
    if (id) {
      const sql = `${rolesSql} WHERE oid = ${literal(id)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a role with ID ${id}` } }
      } else {
        return { data: data[0], error }
      }
    } else if (name) {
      const sql = `${rolesSql} WHERE rolname = ${literal(name)};`
      const { data, error } = await this.query(sql)
      if (error) {
        return { data, error }
      } else if (data.length === 0) {
        return { data: null, error: { message: `Cannot find a role named ${name}` } }
      } else {
        return { data: data[0], error }
      }
    } else {
      return { data: null, error: { message: 'Invalid parameters on role retrieve' } }
    }
  }

  async create({
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
  }): Promise<PostgresMetaResult<PostgresRole>> {
    const isSuperuserClause = is_superuser ? 'SUPERUSER' : 'NOSUPERUSER'
    const canCreateDbClause = can_create_db ? 'CREATEDB' : 'NOCREATEDB'
    const canCreateRoleClause = can_create_role ? 'CREATEROLE' : 'NOCREATEROLE'
    const inheritRoleClause = inherit_role ? 'INHERIT' : 'NOINHERIT'
    const canLoginClause = can_login ? 'LOGIN' : 'NOLOGIN'
    const isReplicationRoleClause = is_replication_role ? 'REPLICATION' : 'NOREPLICATION'
    const canBypassRlsClause = can_bypass_rls ? 'BYPASSRLS' : 'NOBYPASSRLS'
    const connectionLimitClause = `CONNECTION LIMIT ${connection_limit}`
    const passwordClause = password === undefined ? '' : `PASSWORD ${literal(password)}`
    const validUntilClause = valid_until === undefined ? '' : `VALID UNTIL ${literal(valid_until)}`
    const memberOfClause = member_of === undefined ? '' : `IN ROLE ${member_of.join(',')}`
    const membersClause = members === undefined ? '' : `ROLE ${members.join(',')}`
    const adminsClause = admins === undefined ? '' : `ADMIN ${admins.join(',')}`

    const sql = `
CREATE ROLE ${ident(name)}
WITH
  ${isSuperuserClause}
  ${canCreateDbClause}
  ${canCreateRoleClause}
  ${inheritRoleClause}
  ${canLoginClause}
  ${isReplicationRoleClause}
  ${canBypassRlsClause}
  ${connectionLimitClause}
  ${passwordClause}
  ${validUntilClause}
  ${memberOfClause}
  ${membersClause}
  ${adminsClause};`
    const { error } = await this.query(sql)
    if (error) {
      return { data: null, error }
    }
    return await this.retrieve({ name })
  }

  async update(
    id: number,
    {
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
    }
  ): Promise<PostgresMetaResult<PostgresRole>> {
    const { data: old, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }

    const nameSql =
      name === undefined ? '' : `ALTER ROLE ${ident(old!.name)} RENAME TO ${ident(name)};`
    let isSuperuserClause = ''
    if (is_superuser !== undefined) {
      isSuperuserClause = is_superuser ? 'SUPERUSER' : 'NOSUPERUSER'
    }
    let canCreateDbClause = ''
    if (can_create_db !== undefined) {
      canCreateDbClause = can_create_db ? 'CREATEDB' : 'NOCREATEDB'
    }
    let canCreateRoleClause = ''
    if (can_create_role !== undefined) {
      canCreateRoleClause = can_create_role ? 'CREATEROLE' : 'NOCREATEROLE'
    }
    let inheritRoleClause = ''
    if (inherit_role !== undefined) {
      inheritRoleClause = inherit_role ? 'INHERIT' : 'NOINHERIT'
    }
    let canLoginClause = ''
    if (can_login !== undefined) {
      canLoginClause = can_login ? 'LOGIN' : 'NOLOGIN'
    }
    let isReplicationRoleClause = ''
    if (is_replication_role !== undefined) {
      isReplicationRoleClause = is_replication_role ? 'REPLICATION' : 'NOREPLICATION'
    }
    let canBypassRlsClause = ''
    if (can_bypass_rls !== undefined) {
      canBypassRlsClause = can_bypass_rls ? 'BYPASSRLS' : 'NOBYPASSRLS'
    }
    const connectionLimitClause =
      connection_limit === undefined ? '' : `CONNECTION LIMIT ${connection_limit}`
    const passwordClause = password === undefined ? '' : `PASSWORD ${literal(password)}`
    const validUntilClause = valid_until === undefined ? '' : `VALID UNTIL ${literal(valid_until)}`

    // nameSql must be last
    const sql = `
BEGIN;
  ALTER ROLE ${ident(old!.name)}
    ${isSuperuserClause}
    ${canCreateDbClause}
    ${canCreateRoleClause}
    ${inheritRoleClause}
    ${canLoginClause}
    ${isReplicationRoleClause}
    ${canBypassRlsClause}
    ${connectionLimitClause}
    ${passwordClause}
    ${validUntilClause};
  ${nameSql}
COMMIT;`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return await this.retrieve({ id })
  }

  async remove(id: number): Promise<PostgresMetaResult<PostgresRole>> {
    const { data: role, error } = await this.retrieve({ id })
    if (error) {
      return { data: null, error }
    }
    const sql = `DROP ROLE ${ident(role!.name)};`
    {
      const { error } = await this.query(sql)
      if (error) {
        return { data: null, error }
      }
    }
    return { data: role!, error: null }
  }
}
