import { PoolConfig } from 'pg'
import * as Parser from './Parser.js'
import PostgresMetaBase from './PostgresMetaBase.js'
import { init } from './db.js'

export default class PostgresMeta extends PostgresMetaBase {
  parse = Parser.Parse
  deparse = Parser.Deparse
  format = Parser.Format

  constructor(config: PoolConfig) {
    const { query, end } = init(config)
    super({ query, end })

    this.end = end
  }
}
