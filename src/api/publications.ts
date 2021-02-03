import { Router } from 'express'
import { ident, literal } from 'pg-format'
import sql = require('../lib/sql')
import { RunQuery } from '../lib/connectionPool'
import logger from '../server/logger'

const { publicationsSql } = sql
const router = Router()

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, publicationsSql)
    return res.status(200).json(data)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const createPublicationSql = createPublicationSqlize(req.body)
    await RunQuery(req.headers.pg, createPublicationSql)

    const getPublicationSql = getPublicationByNameSqlize(req.body.name)
    const newPublication = (await RunQuery(req.headers.pg, getPublicationSql)).data[0]
    return res.status(200).json(newPublication)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getPublicationSql = getPublicationByIdSqlize(id)
    const oldPublication = (await RunQuery(req.headers.pg, getPublicationSql)).data[0]

    const args = req.body
    const alterPublicationSql = alterPublicationSqlize({ oldPublication, ...args })
    await RunQuery(req.headers.pg, alterPublicationSql)

    const updatedPublication = (await RunQuery(req.headers.pg, getPublicationSql)).data[0]
    return res.status(200).json(updatedPublication)
  } catch (error) {
    logger.error({ error, req: req.body })
    if (error instanceof TypeError) {
      res.status(404).json({ error: 'Cannot find a publication with that id' })
    } else {
      res.status(400).json({ error: error.message })
    }
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const getPublicationSql = getPublicationByIdSqlize(id)
    const publication = (await RunQuery(req.headers.pg, getPublicationSql)).data[0]
    const { name } = publication

    const dropPublicationSql = dropPublicationSqlize(name)
    await RunQuery(req.headers.pg, dropPublicationSql)

    return res.status(200).json(publication)
  } catch (error) {
    logger.error({ error, req: req.body })
    if (error instanceof TypeError) {
      res.status(404).json({ error: 'Cannot find a publication with that id' })
    } else {
      res.status(400).json({ error: error.message })
    }
  }
})

const createPublicationSqlize = ({
  name,
  publish_insert = false,
  publish_update = false,
  publish_delete = false,
  publish_truncate = false,
  tables,
}: {
  name: string
  publish_insert?: boolean
  publish_update?: boolean
  publish_delete?: boolean
  publish_truncate?: boolean
  tables?: string[]
}) => {
  let tableClause: string = `FOR TABLE ${tables!.map(ident).join(',')}`
  if (tables === undefined) {
    tableClause = 'FOR ALL TABLES'
  } else if (tables.length === 0) {
    tableClause = ''
  }

  const publishOps = []
  if (publish_insert) publishOps.push('insert')
  if (publish_update) publishOps.push('update')
  if (publish_delete) publishOps.push('delete')
  if (publish_truncate) publishOps.push('truncate')

  return `
CREATE PUBLICATION ${ident(name)} ${tableClause}
    WITH (publish = '${publishOps.join(',')}')
`
}

const getPublicationByNameSqlize = (name: string) => {
  return `${publicationsSql} WHERE p.pubname = ${literal(name)}`
}

const getPublicationByIdSqlize = (id: string) => {
  return `${publicationsSql} WHERE p.oid = ${literal(id)}`
}

const alterPublicationSqlize = ({
  oldPublication,
  name,
  owner,
  publish_insert,
  publish_update,
  publish_delete,
  publish_truncate,
  tables,
}: {
  oldPublication: any
  name?: string
  owner?: string
  publish_insert?: boolean
  publish_update?: boolean
  publish_delete?: boolean
  publish_truncate?: boolean
  tables?: string[]
}) => {
  // Need to work around the limitations of the SQL. Can't add/drop tables from
  // a publication with FOR ALL TABLES. Can't use the SET TABLE clause without
  // at least one table.
  //
  //                              new tables
  //
  //                      | undefined |    string[]     |
  //             ---------|-----------|-----------------|
  //                 null |    ''     | 400 Bad Request |
  // old tables  ---------|-----------|-----------------|
  //             string[] |    ''     |    See below    |
  //
  //                              new tables
  //
  //                      |    []     |      [...]      |
  //             ---------|-----------|-----------------|
  //                   [] |    ''     |    SET TABLE    |
  // old tables  ---------|-----------|-----------------|
  //                [...] | DROP all  |    SET TABLE    |
  //
  let tableSql: string
  if (tables === undefined) {
    tableSql = ''
  } else if (oldPublication.tables === null) {
    throw Error('Tables cannot be added to or dropped from FOR ALL TABLES publications')
  } else if (tables.length > 0) {
    tableSql = `ALTER PUBLICATION ${ident(oldPublication.name)} SET TABLE ${tables
      .map(ident)
      .join(',')}`
  } else if (oldPublication.tables.length === 0) {
    tableSql = ''
  } else {
    tableSql = `ALTER PUBLICATION ${ident(
      oldPublication.name
    )} DROP TABLE ${oldPublication.tables.map(ident).join(',')}`
  }

  let publishOps = []
  if (publish_insert ?? oldPublication.publish_insert) publishOps.push('insert')
  if (publish_update ?? oldPublication.publish_update) publishOps.push('update')
  if (publish_delete ?? oldPublication.publish_delete) publishOps.push('delete')
  if (publish_truncate ?? oldPublication.publish_truncate) publishOps.push('truncate')
  const publishSql = `ALTER PUBLICATION ${ident(
    oldPublication.name
  )} SET (publish = '${publishOps.join(',')}')`

  const ownerSql =
    owner === undefined
      ? ''
      : `ALTER PUBLICATION ${ident(oldPublication.name)} OWNER TO ${ident(owner)}`

  const nameSql =
    name === undefined || name === oldPublication.name
      ? ''
      : `ALTER PUBLICATION ${ident(oldPublication.name)} RENAME TO ${ident(name)}`

  // nameSql must be last
  return `
BEGIN;
  ${tableSql};
  ${publishSql};
  ${ownerSql};
  ${nameSql};
COMMIT;
`
}

const dropPublicationSqlize = (name: string) => {
  return `DROP PUBLICATION IF EXISTS ${ident(name)}`
}

export = router
