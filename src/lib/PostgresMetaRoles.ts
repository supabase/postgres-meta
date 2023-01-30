import { ident, literal } from 'pg-format'
import { rolesSql } from './sql/index.js'
import {
  PostgresMetaResult,
  PostgresRole,
  PostgresRoleCreate,
  PostgresRoleUpdate,
} from './types.js'
export function changeRoleConfig2Object(config: string[]) {
  if (!config) {
    return null
  }
  return config.reduce((acc: any, cur) => {
    const [key, value] = cur.split('=')
    acc[key] = value
    return acc
  }, {})
}
export default class PostgresMetaRoles {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({
    includeDefaultRoles = false,
    limit,
    offset,
  }: {
    includeDefaultRoles?: boolean
    limit?: number
    offset?: number
  } = {}): Promise<PostgresMetaResult<PostgresRole[]>> {
    let sql = `
WITH
  roles AS (${rolesSql})
SELECT
  *
FROM
  roles
WHERE
  true`
    if (!includeDefaultRoles) {
      // All default/predefined roles start with pg_: https://www.postgresql.org/docs/15/predefined-roles.html
      // The pg_ prefix is also reserved:
      //
      // ```
      // postgres=# create role pg_mytmp;
      // ERROR:  role name "pg_mytmp" is reserved
      // DETAIL:  Role names starting with "pg_" are reserved.
      // ```
      sql += ` AND NOT pg_catalog.starts_with(name, 'pg_')`
    }
    if (limit) {
      sql += ` LIMIT ${limit}`
    }
    if (offset) {
      sql += ` OFFSET ${offset}`
    }
    const result = await this.query(sql)
    if (result.data) {
      result.data = result.data.map((role: any) => {
        role.config = changeRoleConfig2Object(role.config)
        return role
      })
    }
    return result
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
        data[0].config = changeRoleConfig2Object(data[0].config)
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
        data[0].config = changeRoleConfig2Object(data[0].config)
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
    config,
  }: PostgresRoleCreate): Promise<PostgresMetaResult<PostgresRole>> {
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
    let configClause = ''
    if (config !== undefined) {
      configClause = Object.keys(config)
        .map((k) => {
          const v = config[k]
          if (!k || !v) {
            return ''
          }
          return `ALTER ROLE ${name} SET ${k} = ${v};`
        })
        .join('\n')
    }
    const sql = `
BEGIN;
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
  ${adminsClause};
${configClause ? configClause : ''}
COMMIT;`
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
      config,
    }: PostgresRoleUpdate
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
    let configClause = ''
    if (config !== undefined) {
      const configSql = config.map((c) => {
        const { op, path, value } = c
        const k = path
        const v = value || null
        if (!k) {
          throw new Error(`Invalid config value ${value}`)
        }
        switch (op) {
          case 'add':
          case 'replace':
            return `ALTER ROLE ${ident(old!.name)} SET ${ident(k)} = ${literal(v)};`
          case 'remove':
            return `ALTER ROLE ${ident(old!.name)} RESET ${ident(k)};`
          default:
            throw new Error(`Invalid config op ${op}`)
        }
      })
      configClause = configSql.filter(Boolean).join('')
    }
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
  ${configClause ? configClause : ''}
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
