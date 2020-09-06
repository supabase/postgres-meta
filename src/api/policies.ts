import { Router } from 'express'
import format from 'pg-format'
import { coalesceRowsToArray, toTransaction } from '../lib/helpers'
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Tables } from '../lib/interfaces'
import sqlTemplates = require('../lib/sql')

/**
 * @param {string} [include_system_schemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  include_system_schemas?: string
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const sql = getAllSql(sqlTemplates)
    const { data } = await RunQuery(req.headers.pg, sql)
    const query: QueryParams = req.query
    const include_system_schemas = query?.include_system_schemas === 'true'
    let payload: Tables.Policy[] = data
    if (!include_system_schemas) payload = removeSystemSchemas(data)
    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.post('/', async (req, res) => {
  try {
    const pcConnection: string = req.headers.pg.toString()
    const payload: Tables.Policy = { ...req.body }
    const schema: string = payload.schema || 'public'
    const name: string = payload.name
    const table: string = payload.table

    // Create
    const createSqlString = createSql(payload)
    await RunQuery(pcConnection, createSqlString)

    // Return fresh details
    const newPolicy = await getPolicyByName(pcConnection, name, schema, table)
    return res.status(200).json(newPolicy)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('POST error!', error)
    res.status(200).json({ error: error.toString(), status: 200 })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const pcConnection: string = req.headers.pg.toString()
    const id: number = parseInt(req.params.id)
    if (!(id > 0)) throw new Error('id is required')

    const payload: Tables.Policy = { ...req.body }
    const previousPolicy: Tables.Policy = await getPolicyById(pcConnection, id)
    const nameChange = !!payload.name && payload.name != previousPolicy.name
    let updates = { ...payload }
    if (!updates.name) updates.name = previousPolicy.name
    if (!updates.schema) updates.schema = previousPolicy.schema
    if (!updates.table) updates.table = previousPolicy.table

    // Update fields and name
    const nameSqlString = nameChange
      ? alterPolicyNameSql(
          previousPolicy.name,
          payload.name,
          previousPolicy.schema,
          previousPolicy.table
        )
      : ''
    const alterSqlString = alterSql(updates)
    const transaction = toTransaction([nameSqlString, alterSqlString])
    await RunQuery(pcConnection, transaction)

    // Return fresh details
    const updated = await getPolicyById(pcConnection, id)
    return res.status(200).json(updated)
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json({ error: error.toString(), status: 200 })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const pcConnection: string = req.headers.pg.toString()
    const id: number = parseInt(req.params.id)
    if (!(id > 0)) throw new Error('id is required')

    // Get
    const policy = await getPolicyById(pcConnection, id)
    const { name, schema, table } = policy

    // Drop
    const query = dropSql(name, schema, table)
    await RunQuery(pcConnection, query)

    return res.status(200).json(policy)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

const getAllSql = (sqlTemplates) => {
  const { policies } = sqlTemplates
  return `${policies}`.trim()
}
const getPolicyById = async (connection: string, id: number) => {
  const { policies } = sqlTemplates
  let sql = `
    with policies as (${policies}) 
    select * from policies
    where policies.id = ${id}
    limit 1
  `.trim()
  const { data } = await RunQuery(connection, sql)
  return data[0]
}
const getPolicyByName = async (connection: string, name: string, schema: string, table: string) => {
  const { policies } = sqlTemplates
  let sql = format(
    `
    with policies as (${policies})
    select * from policies
    where policies.name = %L and policies.schema = %L and policies.table = %L
    limit 1
  `,
    name,
    schema,
    table
  )
  const { data } = await RunQuery(connection, sql)
  return data[0]
}
const createSql = ({
  name,
  table,
  definition,
  check,
  schema = 'public',
  action = 'PERMISSIVE',
  command = 'ALL',
  roles = ['PUBLIC'],
}: {
  name: string
  table: string
  definition?: string
  check?: string
  schema?: string
  action?: string
  command?: string
  roles?: string[]
}) => {
  let sql = format(
    `CREATE POLICY %I ON %I.%I
    AS ${action}
    FOR ${command}
    TO ${roles.join(',')} `,
    name,
    schema,
    table
  )
  if (definition) sql += ` USING (${definition}) `
  if (check) sql += ` WITH CHECK (${check}) `
  sql += ';'
  return sql
}
const alterPolicyNameSql = (oldName: string, newName: string, schema: string, table: string) => {
  return format(`ALTER POLICY %I ON %I.%I RENAME TO %I;`, oldName, schema, table, newName)
}
const alterSql = ({
  name,
  schema,
  table,
  definition,
  check,
  roles,
}: {
  schema: string
  name: string
  table: string
  definition?: string
  check?: string
  roles?: string[]
}) => {
  let alter = format(`ALTER POLICY %I ON %I.%I`, name, schema, table)
  let newDefinition = definition !== undefined ? `${alter} USING (${definition});` : ''
  let newCheck = check !== undefined ? `${alter} WITH CHECK (${check});` : ''
  let newRoles = roles !== undefined ? `${alter} TO (${roles.join(',')});` : ''

  return `
    ${newDefinition}
    ${newCheck}
    ${newRoles}`.trim()
}
const dropSql = (name: string, schema: string, table: string) => {
  return format(`DROP POLICY %I ON %I.%I;`, name, schema, table)
}
const removeSystemSchemas = (data: Tables.Policy[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.schema))
}

export = router
