import { Router } from 'express'
import SQL from 'sql-template-strings'
import sqlTemplates = require('../lib/sql')
import { RunQuery } from '../lib/connectionPool'
import { DEFAULT_SYSTEM_SCHEMAS } from '../lib/constants'
import { Schemas } from '../lib/interfaces'

const { schemas } = sqlTemplates

/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
interface GetSchemasQueryParams {
  includeSystemSchemas?: boolean
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, schemas)
    const query: GetSchemasQueryParams = req.query
    let payload: Schemas.Schema[] = data
    if (!query?.includeSystemSchemas) payload = removeSystemSchemas(data)

    return res.status(200).json(payload)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})
router.post('/', async (req, res) => {
  try {
    const name: string = req.body.name
    const owner: string = req.body.owner

    // Create the schema
    const schemqQuery = createSchema(name, owner)
    await RunQuery(req.headers.pg, schemqQuery)
  
    // Return fresh details
    const getSchema = selectSingleByName(name)
    const { data } = await RunQuery(req.headers.pg, getSchema)
    let schema: Schemas.Schema = data[0]
    return res.status(200).json(schema)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})
router.patch('/:id', async (req, res) => {
  try {
    const id: number = parseInt(req.params.id)
    const name: string = req.body.name
    const owner: string = req.body.owner

    // Get schema name
    const getSchema = selectSingleSql(id)
    const { data: getSchemaResults } = await RunQuery(req.headers.pg, getSchema)
    let previousSchema: Schemas.Schema = getSchemaResults[0]

    // Update fields
    if (owner) {
      const updateOwner = alterSchemaOwner(previousSchema.name, owner)
      await RunQuery(req.headers.pg, updateOwner)
    }
    // NB: Run name updates last
    if (name) {
      const updateName = alterSchemaName(previousSchema.name, name)
      await RunQuery(req.headers.pg, updateName)
    }

    // Return fresh details
    const { data: updatedResults } = await RunQuery(req.headers.pg, getSchema)
    let updated: Schemas.Schema = updatedResults[0]
    return res.status(200).json(updated)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

// Helpers
const selectSingleSql = (id: number) => {
  const query = SQL``.append(schemas).append(SQL` where nsp.oid = ${id}`)
  return query
}
const selectSingleByName = (name: string) => {
  const query = SQL``.append(schemas).append(SQL` where schema_name = ${name}`)
  return query
}
const createSchema = (name: string, owner: string = 'postgres') => {
  const query = SQL``.append(`CREATE SCHEMA IF NOT EXISTS ${name} AUTHORIZATION ${owner}`)
  return query
}
const alterSchemaName = (previousName: string, newName: string) => {
  const query = SQL``.append(`ALTER SCHEMA ${previousName} RENAME TO ${newName}`)
  return query
}
const alterSchemaOwner = (schemaName: string, newOwner: string) => {
  const query = SQL``.append(`ALTER SCHEMA ${schemaName} OWNER TO ${newOwner}`)
  return query
}
const removeSystemSchemas = (data: Schemas.Schema[]) => {
  return data.filter((x) => !DEFAULT_SYSTEM_SCHEMAS.includes(x.name))
}

export = router
