const { Router } = require('express')
const router = new Router()
const { config } = require('../lib/sql')
const RunQuery = require('../lib/connectionPool')

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

module.exports = router
