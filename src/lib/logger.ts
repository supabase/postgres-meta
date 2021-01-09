import { PG_CONNECTION } from './constants'
export const logger = require('pino')().child({ connectionString: PG_CONNECTION })
