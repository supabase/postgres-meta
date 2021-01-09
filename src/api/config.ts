import { Router } from 'express'

import { RunQuery } from '../lib/connectionPool'
import sql = require('../lib/sql')
import { logger } from '../lib/logger'
const { config, version } = sql

const router = Router()
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, config)
    return res.status(200).json(data)
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})
router.get('/version', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, version)
    return res.status(200).json(data[0]) // only one row
  } catch (error) {
    logger.error({ error, req: req.body })
    res.status(500).json({ error: error.message })
  }
})

export = router
