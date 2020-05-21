const { Router } = require('express')
const router = new Router()
const { users } = require('../lib/sql')
const RunQuery = require('../lib/connectionPool')

router.get('/list', async (req, res) => {
  try {
    const { data } = await RunQuery(req.pg, users.list)
    return res.status(200).json(data)
  } catch (error) {
    console.log('throwing error')
    res.status(500).json({ error: 'Database error', status: 500 })
  }
})

module.exports = router
