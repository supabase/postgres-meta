import SQL from 'sql-template-strings'
import sqlTemplates = require('../lib/sql')
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Schemas as Interfaces } from '../lib/interfaces'
import { logger } from '../lib/logger'

const { schemasSql: allSchemasSql } = sqlTemplates
const defaultSchemasList = DEFAULT_SYSTEM_SCHEMAS.map((x) => `'${x}'`).join(', ')

/**
 * Get a list of schemas in the database
 */
export async function list(
  /** A Postgres connection string */
  connection: string,
  {
    /** If true, will include the system schemas */
    include_system_schemas = false,
  }: {
    include_system_schemas?: boolean
  }
): /**  Returns a list of schemas */
Promise<{ data: any; error: null | Error }> {
  try {
    let query = SQL``.append(allSchemasSql)
    if (!include_system_schemas) {
      query.append(` and n.nspname not in (${defaultSchemasList})`)
    }
    const { data, error } = await RunQuery<Interfaces.Schema>(connection, query)
    if (error) throw error
    else return { data, error: null }
  } catch (error) {
    logger.error({ error })
    return { data: null, error }
  }
}

/**
 * Get a single schema by its `oid`
 */
export async function byId(
  /** A Postgres connection string */
  connection: string,
  /** The schema `oid` */
  id: number
): /**  Returns a single schemas */
Promise<{ data: any; error: null | Error }> {
  try {
    const query = SQL``.append(allSchemasSql).append(SQL` and n.oid = ${id}`)
    const { data } = await RunQuery<Interfaces.Schema>(connection, query)
    return { data: data[0], error: null }
  } catch (error) {
    logger.error({ error })
    return { data: null, error }
  }
}

/**
 * Get a single schema by its name
 */
export async function byName(
  /** A Postgres connection string */
  connection: string,
  /** The schema name */
  name: string
): /**  Returns a single schemas */
Promise<{ data: any; error: null | Error }> {
  try {
    const query = SQL``.append(allSchemasSql).append(SQL` and n.nspname = ${name}`)
    const { data } = await RunQuery<Interfaces.Schema>(connection, query)
    return { data: data[0], error: null }
  } catch (error) {
    logger.error({ error })
    return { data: null, error }
  }
}
