import CryptoJS = require('crypto-js')
import { PG_CONNECTION, CRYPTO_KEY } from './constants'
import { logger } from './logger'

/**
 * Adds a "pg" object to the request if it doesn't exist
 */
export const addConnectionToRequest = async (req, res, next) => {
  try {
    req.headers['pg'] = PG_CONNECTION

    // Node converts headers to lowercase
    let encryptedHeader =
      'x-connection-encrypted' in req.headers ? req.headers['x-connection-encrypted'] : null

    if (encryptedHeader) {
      req.headers['pg'] = CryptoJS.AES.decrypt(encryptedHeader, CRYPTO_KEY).toString(
        CryptoJS.enc.Utf8
      )
    }

    return next()
  } catch (error) {
    logger.error({ error })
    return res.status(500).json({ error: 'Server error.', status: 500 })
  }
}
