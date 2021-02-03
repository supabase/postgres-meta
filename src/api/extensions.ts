import { Router } from 'express'
import format from 'pg-format'
import SQL from 'sql-template-strings'
import sqlTemplates = require('../lib/sql')
const { extensionsSql } = sqlTemplates
import { RunQuery } from '../lib/connectionPool'
import logger from '../server/logger'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const getExtensionsQuery = getExtensionsSqlize(extensionsSql)
    const { data } = await RunQuery(req.headers.pg, getExtensionsQuery)
    return res.status(200).json(data)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const query = createExtensionSqlize(req.body)
    await RunQuery(req.headers.pg, query)

    const getExtensionQuery = singleExtensionSqlize(extensionsSql, req.body.name)
    const extension = (await RunQuery(req.headers.pg, getExtensionQuery)).data[0]

    return res.status(200).json(extension)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:name', async (req, res) => {
  try {
    const name = req.params.name
    req.body.name = name

    const alterExtensionQuery = alterExtensionSqlize(req.body)
    await RunQuery(req.headers.pg, alterExtensionQuery)

    const getExtensionQuery = singleExtensionSqlize(extensionsSql, name)
    const updated = (await RunQuery(req.headers.pg, getExtensionQuery)).data[0]

    return res.status(200).json(updated)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const name = req.params.name
    const cascade = req.query.cascade === 'true'

    const getExtensionQuery = singleExtensionSqlize(extensionsSql, name)
    const deleted = (await RunQuery(req.headers.pg, getExtensionQuery)).data[0]

    const query = dropExtensionSqlize(name, cascade)
    await RunQuery(req.headers.pg, query)

    return res.status(200).json(deleted)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

const getExtensionsSqlize = (extensions: string) => {
  return `${extensions} ORDER BY name ASC`
}
const createExtensionSqlize = ({
  name,
  schema,
  version,
  cascade = false,
}: {
  name: string
  schema?: string
  version?: string
  cascade?: boolean
}) => {
  return `
CREATE EXTENSION ${format.ident(name)}
  ${schema === undefined ? '' : `SCHEMA ${format.ident(schema)}`}
  ${version === undefined ? '' : `VERSION ${format.literal(version)}`}
  ${cascade ? 'CASCADE' : ''}`
}
const singleExtensionSqlize = (extensions: string, name: string) => {
  return SQL``.append(extensions).append(SQL` WHERE name = ${name}`)
}
const alterExtensionSqlize = ({
  name,
  update = false,
  version,
  schema,
}: {
  name: string
  update?: boolean
  version?: string
  schema?: string
}) => {
  let updateSql = ''
  if (update) {
    updateSql = `ALTER EXTENSION ${format.ident(name)} UPDATE ${
      version === undefined ? '' : `TO ${format.literal(version)}`
    };`
  }
  const schemaSql =
    schema === undefined ? '' : format('ALTER EXTENSION %I SET SCHEMA %I;', name, schema)

  return `
BEGIN;
  ${updateSql}
  ${schemaSql}
COMMIT;`
}
const dropExtensionSqlize = (name: string, cascade: boolean) => {
  return `
DROP EXTENSION ${format.ident(name)}
  ${cascade ? 'CASCADE' : 'RESTRICT'}`
}

export = router
