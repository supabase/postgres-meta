var assert = require('assert')
const CryptoJS = require('crypto-js')
import axios from 'axios'
import { PG_API_URL, PG_API_PORT, PG_CONNECTION, CRYPTO_KEY } from '../../src/lib/constants'

const URL = `${PG_API_URL}:${PG_API_PORT}`
const STATUS = {
  SUCCESS: 200,
  ERROR: 500,
}

console.log('Running tests on ', URL)

describe('/', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/`)
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(!!res.data.version, true)
  })
})
describe('/health', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/health`)
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(!!res.data.date, true)
  })
})
describe('When passing an encrypted connection header', () => {
  it('should decrypt the connection and return a result', async () => {
    const encrypted = CryptoJS.AES.encrypt(PG_CONNECTION, CRYPTO_KEY).toString()
    const res = await axios.get(`${URL}/config`, {
      headers: {
        'X-Connection-Encrypted': encrypted,
      },
    })
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'trace_recovery_messages')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
  })
  it('should fail with a bad connection', async () => {
    const encrypted = CryptoJS.AES.encrypt('bad connection', CRYPTO_KEY).toString()
    try {
      const res = await axios.get(`${URL}/config`, {
        headers: {
          'X-Connection-Encrypted': encrypted,
        },
      })
      assert.equal(res.status, STATUS.ERROR)
    } catch (error) {
      // console.log('error', error)
      assert.equal(error.response.status, STATUS.ERROR)
    }
  })
})
describe('/query', () => {
  it('POST', async () => {
    const res = await axios.post(`${URL}/query`, { query: 'SELECT * FROM USERS' })
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.id == 1)
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(datum.name, 'Joe Bloggs')
  })
})
describe('/config', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/config`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'trace_recovery_messages')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
  })
})
describe('/config/version', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/config/version`)
    // console.log('res.data', res.data)
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, res.data.version_number == '120003')
  })
})
describe('/schemas', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/schemas`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'public')
    const notIncluded = res.data.find((x) => x.name == 'pg_toast')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
    assert.equal(true, !notIncluded)
  })
  it('GET with system schemas', async () => {
    const res = await axios.get(`${URL}/schemas?includeSystemSchemas=true`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'public')
    const included = res.data.find((x) => x.name == 'pg_toast')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
    assert.equal(true, !!included)
  })
})
describe('/types', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/types`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const notIncluded = res.data.find((x) => x.schema == 'pg_toast')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
    assert.equal(true, !notIncluded)
  })
  it('GET with system types', async () => {
    const res = await axios.get(`${URL}/types?includeSystemSchemas=true`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const included = res.data.find((x) => x.schema == 'pg_catalog')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
    assert.equal(true, !!included)
  })
})
describe('/tables', async () => {
  it('GET', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const datum = tables.data.find((x) => x.table_id == 'public.users')
    const notIncluded = tables.data.find((x) => x.table_id == 'pg_catalog.pg_type')
    assert.equal(tables.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
    assert.equal(true, !notIncluded)
  })
  it('should return the columns', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const datum = tables.data.find((x) => x.table_id == 'public.users')
    const idColumn = datum.columns.find((x) => x.name == 'id')
    const nameColumn = datum.columns.find((x) => x.name == 'name')
    const statusColumn = datum.columns.find((x) => x.name == 'status')
    assert.equal(true, !!datum)
    assert.equal(datum.columns.length > 0, true)
    assert.equal(datum.primary_keys.length > 0, true)
    assert.equal(idColumn.is_updatable, true)
    assert.equal(idColumn.is_identity, true)
    assert.equal(nameColumn.is_identity, false)
    assert.equal(statusColumn.enums.length, 2)
  })
  it('should return the grants', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const datum = tables.data.find((x) => x.table_id == 'public.users')
    assert.equal(datum.grants.length > 0, true)
  })
  it('should return the relationships', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const datum = tables.data.find((x) => x.table_id == 'public.users')
    const relationships = datum.relationships
    const relationship = relationships.find(x => x.source_table_id == 'public.todos')
    assert.equal(relationships.length > 0, true)
    assert.equal(true, relationship.target_table_id == 'public.users')
  })

  it('GET with system tables', async () => {
    const res = await axios.get(`${URL}/tables?includeSystemSchemas=true`)
    const included = res.data.find((x) => x.table_id == 'pg_catalog.pg_type')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!included)
  })
})
describe('/extensions', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/extensions`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'uuid-ossp')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
  })
})
describe('/roles', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/roles`)
    const datum = res.data.find((x) => x.name == 'postgres')
    const hasSystemSchema = res.data[0].grants.some((x) => x.schema == 'information_schema')
    const hasPublicSchema = res.data[0].grants.some((x) => x.schema == 'public')
    assert.equal(res.status, STATUS.SUCCESS)
    assert.equal(true, !!datum)
    assert.equal(hasSystemSchema, false)
    assert.equal(hasPublicSchema, true)
  })
})
