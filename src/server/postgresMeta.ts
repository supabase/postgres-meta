import { PostgresMeta } from '../lib'
import { PG_CONNECTION } from './constants'
export const pgMeta = new PostgresMeta({ connectionString: PG_CONNECTION })
