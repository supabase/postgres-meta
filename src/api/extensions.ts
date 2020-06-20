import { Router } from 'express'

import { RunQuery } from '../lib/connectionPool'
import sql = require('../lib/sql')
const { extensions } = sql

const router = Router()
router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, extensions.list)
    return res.status(200).json(data)
  } catch (error) {
    console.log('throwing error')
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

export = router
