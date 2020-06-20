import { Router } from 'express'

import { RunQuery } from '../lib/connectionPool'
import sql = require('../lib/sql')
const { config } = sql

const router = Router()
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, config.list)
    return res.status(200).json(data)
  } catch (error) {
    console.log('throwing error')
    res.status(500).send('Database error.')
  }
})
router.get('/version', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, config.version)
    return res.status(200).json(data[0]) // only one row
  } catch (error) {
    console.log('throwing error')
    res.status(500).send('Database error.')
  }
})

export = router
