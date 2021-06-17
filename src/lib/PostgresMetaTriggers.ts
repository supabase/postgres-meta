import {
  triggersSql,
} from './sql'
import { PostgresMetaResult, PostgresTable } from './types'

export default class PostgresMetaTriggers {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({ } = {}): Promise<PostgresMetaResult<PostgresTable[]>> {
    const sql = enrichedTriggersSql
    return await this.query(sql)
  }

  // async retrieve({ id }: { id: number }): Promise<PostgresMetaResult<PostgresTable>>
  // async retrieve({
  //   name,
  //   schema,
  // }: {
  //   name: string
  //   schema: string
  // }): Promise<PostgresMetaResult<PostgresTable>>
  // async retrieve({
  //   id,
  //   name,
  //   schema = 'public',
  // }: {
  //   id?: number
  //   name?: string
  //   schema?: string
  // }): Promise<PostgresMetaResult<PostgresTable>> {
  //   // @TODO
  // }

  // async create({
  //   name,
  //   schema = 'public',
  //   comment,
  // }: {
  //   name: string
  //   schema?: string
  //   comment?: string
  // }): Promise<PostgresMetaResult<PostgresTable>> {
  //   // @TODO
  // }

  // async update(
  //   id: number,
  //   {
  //     name,
  //     schema,
  //   }: {
  //     name?: string
  //     schema?: string
  //   }
  // ): Promise<PostgresMetaResult<PostgresTable>> {
  //   // @TODO
  // }

  // async remove(id: number, { cascade = false } = {}): Promise<PostgresMetaResult<PostgresTable>> {
  //   // @TODO
  // }
}

const enrichedTriggersSql = `
WITH triggers AS (${triggersSql})
SELECT
  *
FROM triggers`
