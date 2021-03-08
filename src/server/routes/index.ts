import cors from 'cors'
import CryptoJS from 'crypto-js'
import { Router } from 'express'
import { PG_CONNECTION, CRYPTO_KEY } from '../constants'
import logger from '../logger'

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
    logger.error({ error, req: req.body })
    return res.status(500).json({ error: 'Server error.', status: 500 })
  }
}

const router = Router()
router.use(cors())
router.use('/config', addConnectionToRequest, require('./config'))
router.use('/columns', addConnectionToRequest, require('./columns'))
router.use('/extensions', addConnectionToRequest, require('./extensions'))
router.use('/functions', addConnectionToRequest, require('./functions'))
router.use('/policies', addConnectionToRequest, require('./policies'))
router.use('/publications', addConnectionToRequest, require('./publications'))
router.use('/query', addConnectionToRequest, require('./query'))
router.use('/schemas', addConnectionToRequest, require('./schemas'))
router.use('/tables', addConnectionToRequest, require('./tables'))
router.use('/types', addConnectionToRequest, require('./types'))
router.use('/roles', addConnectionToRequest, require('./roles'))

export default router
