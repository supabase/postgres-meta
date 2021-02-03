import { PG_CONNECTION } from './constants'
export default require('pino')().child({ connectionString: PG_CONNECTION })
