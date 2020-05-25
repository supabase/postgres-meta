import { CONNECTION } from './constants'

/**
 * Adds a "pg" object to the request if it doesn't exist
 */
export const addConnectionToRequest = async (req, res, next) => {
  try {
    if (!('pg' in req.headers)) return next()
    let overrides = JSON.parse(req.headers['pg'])
    req.headers['pg'] = { ...CONNECTION, ...overrides }
    return next()
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ status: 500, error: 'Server error.' })
  }
}

