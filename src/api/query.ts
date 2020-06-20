import { Router } from 'express'
const router = Router()
const RunQuery = require('../lib/connectionPool')

router.post('/', async (req, res) => {
  try {
    const { query } = req.body
    const { data } = await RunQuery(req.headers.pg, query)
    return res.status(200).json(data || [])
  } catch (error) {
    // For this one, we always want to give back the error to the customer
    console.log('Soft error!', error)
    res.status(200).json([{ error: error.toString() }])
  }
})

module.exports = router
