import { CONNECTION } from './constants'

/**
 * Adds a "pg" object to the request if it doesn't exist
 */
export const addConnectionToRequest = async (req, res, next) => {
  try {
    if (!!req.pg) return next()
    req.pg = CONNECTION
    return next()
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ status: 500, error: 'Server error.' })
  }
}

