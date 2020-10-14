import { Router } from 'express'
import cors = require('cors')
import { addConnectionToRequest } from './lib/connectionMiddleware'

const router = Router()
router.use(cors())
router.use('/config', addConnectionToRequest, require('./api/config'))
router.use('/columns', addConnectionToRequest, require('./api/columns'))
router.use('/extensions', addConnectionToRequest, require('./api/extensions'))
router.use('/functions', addConnectionToRequest, require('./api/functions'))
router.use('/policies', addConnectionToRequest, require('./api/policies'))
router.use('/publications', addConnectionToRequest, require('./api/publications'))
router.use('/query', addConnectionToRequest, require('./api/query'))
router.use('/schemas', addConnectionToRequest, require('./api/schemas'))
router.use('/tables', addConnectionToRequest, require('./api/tables'))
router.use('/types', addConnectionToRequest, require('./api/types'))
router.use('/roles', addConnectionToRequest, require('./api/roles'))

export = router
