import { PostgresMeta } from '../../src/lib'

export const pgMeta = new PostgresMeta({
  max: 1,
  connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres',
})

afterAll(() => pgMeta.end())
