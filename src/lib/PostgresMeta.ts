import { PoolConfig } from 'pg'
import PostgresMetaBase from './PostgresMetaBase.js'
import { init } from './db.js'

export default class PostgresMeta extends PostgresMetaBase {
  constructor(config: PoolConfig) {
    const { query, end } = init(config)
    super({ query, end })

    this.end = end
  }
}
