import { Router } from 'express'
const router = Router()
const { columns } = require('../lib/sql')
const RunQuery = require('../lib/connectionPool')

router.get('/', async (req, res) => {
  try {
    const { data } = await RunQuery(req.headers.pg, columns.list)
    return res.status(200).json(data)
  } catch (error) {
    console.log('throwing error')
    res.status(500).send('Database error.')
  }
})

module.exports = router
