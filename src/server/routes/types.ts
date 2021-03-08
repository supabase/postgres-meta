import { Router } from 'express'
import logger from '../logger'
import { PostgresMeta } from '../../lib'

const router = Router()

router.get('/', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''
  const includeSystemSchemas = req.query?.include_system_schemas === 'true'

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.types.list({ includeSystemSchemas })
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
})

export = router
