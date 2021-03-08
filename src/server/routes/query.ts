import { Router } from 'express'
import logger from '../logger'
import { PostgresMeta } from '../../lib'

const router = Router()

router.post('/', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.query(req.body?.query)
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json(data)
})

export = router
