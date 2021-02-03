import cors from 'cors'
import CryptoJS from 'crypto-js'
import { Router } from 'express'
import { PG_CONNECTION, CRYPTO_KEY } from '../constants'
import logger from '../logger'
import oldRoutes from '../../api'

/**
 * Adds a "pg" object to the request if it doesn't exist
 */
const addConnectionToRequest = async (req: any, res: any, next: any) => {
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

const router = Router()
router.use(cors())
// router.use('/schemas', addConnectionToRequest, require('./schemas'))
router.use(oldRoutes)

export default router
