import { Router } from 'express'

import { RunQuery } from '../lib/connectionPool'
import logger from '../server/logger'

const router = Router()
router.post('/', async (req, res) => {
  try {
    const { query } = req.body
    const { data } = await RunQuery(req.headers.pg, query)
    return res.status(200).json(data || [])
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(400).json({ error: error.message })
  }
})

export = router
