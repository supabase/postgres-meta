import { Router } from 'express'
import format from 'pg-format'
import SQL from 'sql-template-strings'
import sqlTemplates = require('../../lib/sql')
import { RunQuery } from '../../lib/connectionPool'
import { Schemas } from '../../lib/interfaces'

import { list, byId, byName } from '../../api/schemas'

const { schemasSql } = sqlTemplates

/**
 * @param {boolean} [include_system_schemas=false] - Return system schemas as well as user schemas
 */
interface QueryParams {
  include_system_schemas?: string
}

const router = Router()

router.get('/', async (req: any, res) => {
  try {
    let conn: string = req.headers.pg.toString()
    const query: QueryParams = req.query
    const include_system_schemas = query?.include_system_schemas === 'true'
    const { data, error } = await list(conn, { include_system_schemas })
    if (error) throw error
    else return res.status(200).json(data)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.post('/', async (req: any, res) => {
  try {
    let conn: string = req.headers.pg.toString()
    const name: string = req.body.name
    const owner: string = req.body.owner

    // Create the schema
    const schemqQuery = createSchema(name, owner)
    await RunQuery(req.headers.pg, schemqQuery)

    // Return fresh details
    let { data: schema, error } = await byName(conn, name)
    if (error) throw error
    else return res.status(200).json(schema)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.patch('/:id', async (req: any, res) => {
  try {
    let conn: string = req.headers.pg.toString()
    const id: number = +req.params.id
    const name: string = req.body.name
    const owner: string = req.body.owner

    // Get schema name
    let { data: previousSchema, error } = await byId(conn, id)
    if (error) throw error

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
    let { data: updated, error: updateError } = await byId(conn, id)
    if (updateError) throw error
    return res.status(200).json(updated)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

router.delete('/:id', async (req: any, res) => {
  try {
    let conn: string = req.headers.pg.toString()
    const id: number = +req.params.id

    let { data: schema, error } = await byId(conn, id)
    if (error) throw error

    const cascade = req.query.cascade === 'true'
    const query = dropSchemaSqlize(schema.name, cascade)
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(schema)
  } catch (error) {
    console.log('throwing error', error)
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

// Helpers
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
const dropSchemaSqlize = (name: string, cascade: boolean) => {
  const query = `DROP SCHEMA ${format.ident(name)} ${cascade ? 'CASCADE' : 'RESTRICT'}`
  return query
}

export = router
