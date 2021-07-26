var assert = require('assert')
const CryptoJS = require('crypto-js')
import axios from 'axios'
import { PG_META_PORT, PG_CONNECTION, CRYPTO_KEY } from '../../bin/src/server/constants'

const URL = `http://localhost:${PG_META_PORT}`
const STATUS = {
  SUCCESS: 200,
  ERROR: 500,
}

console.log('Running tests on ', URL)

describe('/', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/`)
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(!!res.data.version, true)
  })
})
describe('/health', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/health`)
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(!!res.data.date, true)
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
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
  })
  it('should fail with a bad connection', async () => {
    const encrypted = CryptoJS.AES.encrypt('bad connection', CRYPTO_KEY).toString()
    try {
      const res = await axios.get(`${URL}/config`, {
        headers: {
          'X-Connection-Encrypted': encrypted,
        },
      })
      assert.strictEqual(res.status, STATUS.ERROR)
    } catch (error) {
      // console.log('error', error)
      assert.strictEqual(error.response.status, STATUS.ERROR)
    }
  })
})
describe('should give meaningful errors', () => {
  it('POST', async () => {
    try {
      const res = await axios.post(`${URL}/query`, { query: 'drop table fake_table' })
      assert.strictEqual(res.data.body, 'Code block should not be reached') // Error should be thrown before executing
    } catch (error) {
      let { status, data } = error.response
      assert.strictEqual(status, 400)
      assert.strictEqual(data.error, 'table "fake_table" does not exist')
    }
  })
})
describe('/query', () => {
  it('POST', async () => {
    const res = await axios.post(`${URL}/query`, { query: 'SELECT * FROM USERS' })
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.id == 1)
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(datum.name, 'Joe Bloggs')
  })
})
describe('/config', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/config`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'trace_recovery_messages')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
  })
})
describe('/config/version', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/config/version`)
    // console.log('res.data', res.data)
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.match(`${res.data.version_number}`, /^\d{6}$/)
  })
})
describe('/schemas', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/schemas`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'public')
    const notIncluded = res.data.find((x) => x.name == 'pg_toast')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !notIncluded)
  })
  it('GET with system schemas', async () => {
    const res = await axios.get(`${URL}/schemas?include_system_schemas=true`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'public')
    const included = res.data.find((x) => x.name == 'pg_toast')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !!included)
  })
  it('GET without system schemas (explicit)', async () => {
    const res = await axios.get(`${URL}/schemas?include_system_schemas=false`)
    const isIncluded = res.data.some((x) => x.name === 'pg_catalog')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(isIncluded, false)
  })
  it('POST & PATCH & DELETE', async () => {
    const res = await axios.post(`${URL}/schemas`, { name: 'api' })
    assert.strictEqual('api', res.data.name)
    const newSchemaId = res.data.id
    const res2 = await axios.patch(`${URL}/schemas/${newSchemaId}`, { name: 'api_updated' })
    assert.strictEqual('api_updated', res2.data.name)
    const res3 = await axios.patch(`${URL}/schemas/${newSchemaId}`, {
      name: 'api',
      owner: 'postgres',
    })
    assert.strictEqual('api', res3.data.name)

    const res4 = await axios.delete(`${URL}/schemas/${newSchemaId}`)
    assert.strictEqual(res4.data.name, 'api')

    const res5 = await axios.get(`${URL}/schemas`)
    const newSchemaExists = res5.data.some((x) => x.id === newSchemaId)
    assert.strictEqual(newSchemaExists, false)
  })
})
describe('/types', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/types`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const notIncluded = res.data.find((x) => x.schema == 'pg_toast')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !notIncluded)
  })
  it('GET with system types', async () => {
    const res = await axios.get(`${URL}/types?include_system_schemas=true`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const included = res.data.find((x) => x.schema == 'pg_catalog')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !!included)
  })
})
describe('/functions', () => {
  var func = {
    id: null,
    name: 'test_func',
    schema: 'public',
    args: ['a int2', 'b int2'],
    definition: 'select a + b',
    return_type: 'integer',
    language: 'sql',
    behavior: 'STABLE',
    security_definer: true,
    config_params: { search_path: 'hooks, auth', role: 'postgres' },
  }
  before(async () => {
    await axios.post(`${URL}/query`, {
      query: `DROP FUNCTION IF EXISTS "${func.name}";`,
    })
    await axios.post(`${URL}/query`, {
      query: `CREATE SCHEMA IF NOT EXISTS test_schema;`,
    })
  })
  after(async () => {
    await axios.post(`${URL}/query`, {
      query: `DROP SCHEMA IF EXISTS test_schema;`,
    })
  })
  it('GET', async () => {
    const res = await axios.get(`${URL}/functions`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const notIncluded = res.data.find((x) => x.schema == 'pg_toast')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !notIncluded)
  })
  it('GET with system functions', async () => {
    const res = await axios.get(`${URL}/functions?include_system_schemas=true`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const included = res.data.find((x) => x.schema == 'pg_catalog')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !!included)
  })
  it('GET single by ID', async () => {
    const functions = await axios.get(`${URL}/functions`)
    const functionFiltered = functions.data.find(
      (func) => `${func.schema}.${func.name}` === 'public.add'
    )
    const { data: functionById } = await axios.get(`${URL}/functions/${functionFiltered.id}`)

    assert.deepStrictEqual(functionById, functionFiltered)
  })
  it('POST', async () => {
    const { data: newFunc } = await axios.post(`${URL}/functions`, func)
    assert.strictEqual(newFunc.name, 'test_func')
    assert.strictEqual(newFunc.schema, 'public')
    assert.strictEqual(newFunc.argument_types, 'a smallint, b smallint')
    assert.strictEqual(newFunc.language, 'sql')
    assert.strictEqual(newFunc.definition, 'select a + b')
    assert.strictEqual(
      newFunc.complete_statement,
      'CREATE OR REPLACE FUNCTION public.test_func(a smallint, b smallint)\n' +
      ' RETURNS integer\n' +
      ' LANGUAGE sql\n' +
      ' STABLE SECURITY DEFINER\n' +
      " SET search_path TO 'hooks', 'auth'\n" +
      " SET role TO 'postgres'\n" +
      'AS $function$select a + b$function$\n'
    )
    assert.strictEqual(newFunc.return_type, 'int4')
    assert.strictEqual(newFunc.behavior, 'STABLE')
    assert.strictEqual(newFunc.security_definer, true)
    assert.deepStrictEqual(newFunc.config_params, { search_path: 'hooks, auth', role: 'postgres' })
    func.id = newFunc.id
  })
  it('PATCH', async () => {
    const updates = {
      name: 'test_func_renamed',
      schema: 'test_schema',
      definition: 'select b - a'
    }

    let { data: updated } = await axios.patch(`${URL}/functions/${func.id}`, updates)
    assert.strictEqual(updated.id, func.id)
    assert.strictEqual(updated.name, 'test_func_renamed')
    assert.strictEqual(updated.schema, 'test_schema')
    assert.strictEqual(updated.definition, 'select b - a')
    assert.strictEqual(
      updated.complete_statement,
      'CREATE OR REPLACE FUNCTION test_schema.test_func_renamed(a smallint, b smallint)\n' +
      ' RETURNS integer\n' +
      ' LANGUAGE sql\n' +
      ' STABLE SECURITY DEFINER\n' +
      " SET search_path TO 'hooks', 'auth'\n" +
      " SET role TO 'postgres'\n" +
      'AS $function$select b - a$function$\n'
    )
  })
  it('DELETE', async () => {
    await axios.delete(`${URL}/functions/${func.id}`)
    const { data: functions } = await axios.get(`${URL}/functions`)
    const stillExists = functions.some((x) => func.id === x.id)
    assert.strictEqual(stillExists, false, 'Function is deleted')
  })
})

describe('/tables', async () => {
  it('GET', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const datum = tables.data.find((x) => `${x.schema}.${x.name}` === 'public.users')
    const memes = tables.data.find((x) => `${x.schema}.${x.name}` === 'public.memes')
    const notIncluded = tables.data.find((x) => `${x.schema}.${x.name}` === 'pg_catalog.pg_type')
    const idColumn = datum.columns.find((x) => x.name === 'id')
    const nameColumn = datum.columns.find((x) => x.name === 'name')
    const statusColumn = memes.columns.find((x) => x.name === 'status')
    assert.strictEqual(tables.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum, 'Table included')
    assert.strictEqual(true, !notIncluded, 'System table not included')
    assert.strictEqual(datum['rls_enabled'], false, 'RLS false')
    assert.strictEqual(datum['rls_forced'], false, 'RLS Forced')
    assert.strictEqual(datum.columns.length > 0, true, 'Has columns')
    assert.strictEqual(datum.primary_keys.length > 0, true, 'Has PK')
    assert.strictEqual(idColumn.is_updatable, true, 'Is updatable')
    assert.strictEqual(idColumn.is_identity, true, 'ID is Identity')
    assert.strictEqual(nameColumn.is_identity, false, 'Name is not identity')
    assert.strictEqual(datum.grants.length > 0, true, 'Has grants')
    assert.strictEqual(datum.policies.length == 0, true, 'Has no policies')
    assert.strictEqual(statusColumn.enums[0], 'new', 'Has enums')
  })
  it('GET single by ID', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const tableFiltered = tables.data.find(
      (table) => `${table.schema}.${table.name}` === 'public.users'
    )
    const { data: tableById } = await axios.get(`${URL}/tables/${tableFiltered.id}`)

    assert.deepStrictEqual(tableById, tableFiltered)
  })
  it('/tables should return the relationships', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const datum = tables.data.find((x) => `${x.schema}.${x.name}` === 'public.users')
    const relationships = datum.relationships
    const relationship = relationships.find(
      (x) => x.source_schema === 'public' && x.source_table_name === 'todos'
    )
    assert.strictEqual(relationships.length > 0, true)
    assert.strictEqual(true, relationship.target_table_schema === 'public')
    assert.strictEqual(true, relationship.target_table_name === 'users')
  })
  it('/tables should return relationships for quoted names', async () => {
    const tables = await axios.get(`${URL}/tables`)
    const todos = tables.data.find((x) => `${x.schema}.${x.name}` === 'public.todos')
    const relationship = todos.relationships.find(
      (x) => x.source_schema === 'public' && x.source_table_name === 'todos'
    )
    assert.strictEqual(true, relationship.source_column_name === 'user-id')
  })
  it('GET /tables with system tables', async () => {
    const res = await axios.get(`${URL}/tables?include_system_schemas=true`)
    const included = res.data.find((x) => `${x.schema}.${x.name}` === 'pg_catalog.pg_type')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!included)
  })
  it('GET /tables without system tables (explicit)', async () => {
    const res = await axios.get(`${URL}/tables?include_system_schemas=false`)
    const isIncluded = res.data.some((x) => `${x.schema}.${x.name}` === 'pg_catalog.pg_type')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(isIncluded, false)
  })
  it('GET /columns', async () => {
    const res = await axios.get(`${URL}/columns`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const notIncluded = res.data.find((x) => x.schema == 'pg_catalog')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !notIncluded)
  })
  it('GET /columns with system types', async () => {
    const res = await axios.get(`${URL}/columns?include_system_schemas=true`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.schema == 'public')
    const included = res.data.find((x) => x.schema == 'pg_catalog')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(true, !!included)
  })
  it('GET enum /columns with quoted name', async () => {
    await axios.post(`${URL}/query`, {
      query: 'CREATE TYPE "T" AS ENUM (\'v\'); CREATE TABLE t ( c "T" );',
    })
    const { data: columns } = await axios.get(`${URL}/columns`)
    const column = columns.find((x) => x.table == 't')
    await axios.post(`${URL}/query`, { query: 'DROP TABLE t; DROP TYPE "T";' })
    assert.deepStrictEqual(column.enums.includes('v'), true)
  })
  it('POST /tables should create a table', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'test', comment: 'foo' })
    assert.strictEqual(`${newTable.schema}.${newTable.name}`, 'public.test')
    assert.strictEqual(newTable.comment, 'foo')

    const { data: tables } = await axios.get(`${URL}/tables`)
    const newTableExists = tables.some((table) => table.id === newTable.id)
    assert.strictEqual(newTableExists, true)

    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('PATCH /tables', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, {
      name: 'test',
    })
    let { data: updatedTable } = await axios.patch(`${URL}/tables/${newTable.id}`, {
      name: 'test a',
      rls_enabled: true,
      rls_forced: true,
      replica_identity: 'NOTHING',
      comment: 'foo',
    })
    assert.strictEqual(updatedTable.name, `test a`)
    assert.strictEqual(updatedTable.rls_enabled, true)
    assert.strictEqual(updatedTable.rls_forced, true)
    assert.strictEqual(updatedTable.replica_identity, 'NOTHING')
    assert.strictEqual(updatedTable.comment, 'foo')
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('PATCH /tables same name', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, {
      name: 'test',
    })
    let { data: updatedTable } = await axios.patch(`${URL}/tables/${newTable.id}`, {
      name: 'test',
    })
    assert.strictEqual(updatedTable.name, `test`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('DELETE /tables', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'test' })

    await axios.delete(`${URL}/tables/${newTable.id}`)
    const { data: tables } = await axios.get(`${URL}/tables`)
    const newTableExists = tables.some((table) => table.id === newTable.id)
    assert.strictEqual(newTableExists, false)
  })
  it('POST /columns', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo bar' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'foo bar',
      type: 'int2',
      default_value: 42,
      is_nullable: false,
      comment: 'foo',
    })

    const { data: columns } = await axios.get(`${URL}/columns`)
    const newColumn = columns.find(
      (column) =>
        column.id === `${newTable.id}.1` && column.name === 'foo bar' && column.format === 'int2'
    )
    assert.strictEqual(newColumn.default_value, "'42'::smallint")
    assert.strictEqual(newColumn.is_nullable, false)
    assert.strictEqual(newColumn.comment, 'foo')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('POST /columns for primary key', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'bar',
      type: 'int2',
      is_primary_key: true,
    })

    // https://wiki.postgresql.org/wiki/Retrieve_primary_key_columns
    const { data: primaryKeys } = await axios.post(`${URL}/query`, {
      query: `
        SELECT a.attname
        FROM   pg_index i
        JOIN   pg_attribute a ON a.attrelid = i.indrelid
                            AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = '${newTable.name}'::regclass
        AND    i.indisprimary;
      `,
    })
    assert.strictEqual(primaryKeys.length, 1)
    assert.strictEqual(primaryKeys[0].attname, 'bar')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('POST /columns with unique constraint', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'bar',
      type: 'int2',
      is_unique: true,
    })

    const { data: uniqueColumns } = await axios.post(`${URL}/query`, {
      query: `
        SELECT a.attname
        FROM   pg_index i
        JOIN   pg_constraint c ON c.conindid = i.indexrelid
        JOIN   pg_attribute a ON a.attrelid = i.indrelid
                            AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = '${newTable.name}'::regclass
        AND    i.indisunique;
      `,
    })
    assert.strictEqual(uniqueColumns.length, 1)
    assert.strictEqual(uniqueColumns[0].attname, 'bar')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('POST /columns array type', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'a' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'b',
      type: 'int2[]',
    })

    const { data: columns } = await axios.get(`${URL}/columns`)
    const newColumn = columns.find(
      (column) =>
        column.id === `${newTable.id}.1` && column.name === 'b' && column.format === '_int2'
    )
    assert.strictEqual(newColumn.name, 'b')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('/columns default_value with expressions', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'a' })
    const { data: newColumn } = await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'a',
      type: 'timestamptz',
      default_value: 'NOW()',
      default_value_format: 'expression',
    })

    assert.strictEqual(newColumn.default_value, 'now()')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('POST /columns with constraint definition', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'a' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'description',
      type: 'text',
      check: "description <> ''",
    })

    const { data: constraints } = await axios.post(`${URL}/query`, {
      query: `
        SELECT pg_get_constraintdef((
          SELECT c.oid
          FROM   pg_constraint c
          WHERE  c.conrelid = '${newTable.name}'::regclass
        ));
      `,
    })
    assert.strictEqual(constraints.length, 1)
    assert.strictEqual(constraints[0].pg_get_constraintdef, "CHECK ((description <> ''::text))")

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('PATCH /columns', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo bar' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'foo',
      type: 'int2',
      default_value: 42,
      comment: 'foo',
    })

    await axios.patch(`${URL}/columns/${newTable.id}.1`, {
      name: 'foo bar',
      type: 'int4',
      drop_default: true,
      is_identity: true,
      identity_generation: 'ALWAYS',
      is_nullable: false,
      comment: 'bar',
    })

    const { data: columns } = await axios.get(`${URL}/columns`)
    const updatedColumn = columns.find(
      (column) =>
        column.id === `${newTable.id}.1` && column.name === 'foo bar' && column.format === 'int4'
    )
    assert.strictEqual(updatedColumn.default_value, null)
    assert.strictEqual(updatedColumn.identity_generation, 'ALWAYS')
    assert.strictEqual(updatedColumn.is_nullable, false)
    assert.strictEqual(updatedColumn.comment, 'bar')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('PATCH /columns same name', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'bar',
      type: 'int2',
    })

    const { data: updatedColumn } = await axios.patch(`${URL}/columns/${newTable.id}.1`, {
      name: 'bar',
    })

    assert.strictEqual(updatedColumn.name, 'bar')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('PATCH /columns "incompatible" types', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo' })
    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'bar',
      type: 'text',
    })

    const { data: updatedColumn } = await axios.patch(`${URL}/columns/${newTable.id}.1`, {
      type: 'int4',
      default_value: 0,
    })

    assert.strictEqual(updatedColumn.format, 'int4')

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
  it('DELETE /columns', async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo bar' })
    await axios.post(`${URL}/columns`, { table_id: newTable.id, name: 'foo bar', type: 'int2' })

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    const { data: columns } = await axios.get(`${URL}/columns`)
    const newColumnExists = columns.some((column) => column.id === `${newTable.id}.1`)
    assert.strictEqual(newColumnExists, false)

    await axios.delete(`${URL}/tables/${newTable.id}`)
  })

  it("allows ' in COMMENTs", async () => {
    const { data: newTable } = await axios.post(`${URL}/tables`, { name: 'foo', comment: "'" })
    assert.strictEqual(newTable.comment, "'")

    await axios.post(`${URL}/columns`, {
      table_id: newTable.id,
      name: 'bar',
      type: 'int2',
      comment: "'",
    })

    const { data: columns } = await axios.get(`${URL}/columns`)
    const newColumn = columns.find(
      (column) =>
        column.id === `${newTable.id}.1` && column.name === 'bar' && column.format === 'int2'
    )
    assert.strictEqual(newColumn.comment, "'")

    await axios.delete(`${URL}/columns/${newTable.id}.1`)
    await axios.delete(`${URL}/tables/${newTable.id}`)
  })
})
// TODO: Test for schema (currently checked manually). Need a different SQL template.
describe('/extensions', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/extensions`)
    // console.log('res.data', res.data)
    const datum = res.data.find((x) => x.name == 'uuid-ossp')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
  })
  it('POST', async () => {
    const { data: extSchema } = await axios.post(`${URL}/schemas`, { name: 'extensions' })
    await axios.post(`${URL}/extensions`, { name: 'hstore', schema: 'extensions', version: '1.4' })

    const { data: extensions } = await axios.get(`${URL}/extensions`)
    const newExtension = extensions.find((ext) => ext.name === 'hstore')
    assert.strictEqual(newExtension.installed_version, '1.4')

    await axios.delete(`${URL}/extensions/hstore`)
    await axios.delete(`${URL}/schemas/${extSchema.id}`)
  })
  it('PATCH', async () => {
    const { data: extSchema } = await axios.post(`${URL}/schemas`, { name: 'extensions' })
    await axios.post(`${URL}/extensions`, { name: 'hstore', version: '1.4' })

    await axios.patch(`${URL}/extensions/hstore`, { update: true, schema: 'extensions' })

    const { data: extensions } = await axios.get(`${URL}/extensions`)
    const updatedExtension = extensions.find((ext) => ext.name === 'hstore')
    assert.strictEqual(updatedExtension.installed_version, updatedExtension.default_version)

    await axios.delete(`${URL}/extensions/hstore`)
    await axios.delete(`${URL}/schemas/${extSchema.id}`)
  })
  it('DELETE', async () => {
    await axios.post(`${URL}/extensions`, { name: 'hstore', version: '1.4' })

    await axios.delete(`${URL}/extensions/hstore`)
    const { data: extensions } = await axios.get(`${URL}/extensions`)
    const deletedExtension = extensions.find((ext) => ext.name === 'hstore')
    assert.strictEqual(deletedExtension.installed_version, null)
  })
})
describe('/roles', () => {
  it('GET', async () => {
    const res = await axios.get(`${URL}/roles`)
    // console.log('res', res)
    const datum = res.data.find((x) => x.name == 'postgres')
    const hasSystemSchema = datum.grants.some((x) => x.schema == 'information_schema')
    const hasPublicSchema = datum.grants.some((x) => x.schema == 'public')
    assert.strictEqual(res.status, STATUS.SUCCESS)
    assert.strictEqual(true, !!datum)
    assert.strictEqual(hasSystemSchema, false)
    assert.strictEqual(hasPublicSchema, true)
  })
  it('POST', async () => {
    await axios.post(`${URL}/roles`, {
      name: 'test',
      is_superuser: true,
      can_create_db: true,
      can_create_role: true,
      inherit_role: false,
      can_login: true,
      is_replication_role: true,
      can_bypass_rls: true,
      connection_limit: 100,
      valid_until: '2020-01-01T00:00:00.000Z',
    })
    const { data: roles } = await axios.get(`${URL}/roles`)
    const test = roles.find((role) => role.name === 'test')
    assert.strictEqual(test.is_superuser, true)
    assert.strictEqual(test.can_create_db, true)
    assert.strictEqual(test.can_create_role, true)
    assert.strictEqual(test.inherit_role, false)
    assert.strictEqual(test.can_login, true)
    assert.strictEqual(test.is_replication_role, true)
    assert.strictEqual(test.can_bypass_rls, true)
    assert.strictEqual(test.connection_limit, 100)
    assert.strictEqual(test.valid_until, '2020-01-01T00:00:00.000Z')
    await axios.post(`${URL}/query`, { query: 'DROP ROLE test;' })
  })
  it('PATCH', async () => {
    const { data: newRole } = await axios.post(`${URL}/roles`, { name: 'foo' })

    await axios.patch(`${URL}/roles/${newRole.id}`, {
      name: 'bar',
      is_superuser: true,
      can_create_db: true,
      can_create_role: true,
      inherit_role: false,
      can_login: true,
      is_replication_role: true,
      can_bypass_rls: true,
      connection_limit: 100,
      valid_until: '2020-01-01T00:00:00.000Z',
    })

    const { data: roles } = await axios.get(`${URL}/roles`)
    const updatedRole = roles.find((role) => role.id === newRole.id)
    assert.strictEqual(updatedRole.name, 'bar')
    assert.strictEqual(updatedRole.is_superuser, true)
    assert.strictEqual(updatedRole.can_create_db, true)
    assert.strictEqual(updatedRole.can_create_role, true)
    assert.strictEqual(updatedRole.inherit_role, false)
    assert.strictEqual(updatedRole.can_login, true)
    assert.strictEqual(updatedRole.is_replication_role, true)
    assert.strictEqual(updatedRole.can_bypass_rls, true)
    assert.strictEqual(updatedRole.connection_limit, 100)
    assert.strictEqual(updatedRole.valid_until, '2020-01-01T00:00:00.000Z')

    await axios.delete(`${URL}/roles/${newRole.id}`)
  })
  it('DELETE', async () => {
    const { data: newRole } = await axios.post(`${URL}/roles`, { name: 'foo bar' })

    await axios.delete(`${URL}/roles/${newRole.id}`)
    const { data: roles } = await axios.get(`${URL}/roles`)
    const newRoleExists = roles.some((role) => role.id === newRole.id)
    assert.strictEqual(newRoleExists, false)
  })
})
describe('/policies', () => {
  var policy = {
    id: null,
    name: 'test policy',
    schema: 'public',
    table: 'memes',
    action: 'RESTRICTIVE',
  }
  before(async () => {
    await axios.post(`${URL}/query`, {
      query: `DROP POLICY IF EXISTS "${policy.name}" on "${policy.schema}"."${policy.table}" `,
    })
  })
  it('GET', async () => {
    const res = await axios.get(`${URL}/policies`)
    // console.log('res', res)
    const policy = res.data[0]
    assert.strictEqual('id' in policy, true, 'Has ID')
    assert.strictEqual('name' in policy, true, 'Has name')
    assert.strictEqual('action' in policy, true, 'Has action')
    assert.strictEqual('table' in policy, true, 'Has table')
    assert.strictEqual('table_id' in policy, true, 'Has table_id')
    assert.strictEqual('roles' in policy, true, 'Has roles')
    assert.strictEqual('command' in policy, true, 'Has command')
    assert.strictEqual('definition' in policy, true, 'Has definition')
    assert.strictEqual('check' in policy, true, 'Has check')
  })
  it('POST', async () => {
    const { data: newPolicy } = await axios.post(`${URL}/policies`, policy)
    assert.strictEqual(newPolicy.name, 'test policy')
    assert.strictEqual(newPolicy.schema, 'public')
    assert.strictEqual(newPolicy.table, 'memes')
    assert.strictEqual(newPolicy.action, 'RESTRICTIVE')
    assert.strictEqual(newPolicy.roles[0], 'public')
    assert.strictEqual(newPolicy.command, 'ALL')
    assert.strictEqual(newPolicy.definition, null)
    assert.strictEqual(newPolicy.check, null)
    policy.id = newPolicy.id
  })
  it('PATCH', async () => {
    const updates = {
      name: 'policy updated',
      definition: `current_setting('my.username') IN (name)`,
      check: `current_setting('my.username') IN (name)`,
    }
    let { data: updated } = await axios.patch(`${URL}/policies/${policy.id}`, updates)
    // console.log('updated', updated)
    assert.strictEqual(updated.id, policy.id)
    assert.strictEqual(updated.name, 'policy updated', 'name updated')
    assert.notEqual(updated.definition, null, 'definition updated')
    assert.notEqual(updated.check, null, 'check updated')
  })
  it('DELETE', async () => {
    await axios.delete(`${URL}/policies/${policy.id}`)
    const { data: policies } = await axios.get(`${URL}/policies`)
    const stillExists = policies.some((x) => policy.id === x.id)
    assert.strictEqual(stillExists, false, 'Policy is deleted')
  })
})

describe('/publications with tables', () => {
  const publication = {
    name: 'a',
    publish_insert: true,
    publish_update: true,
    publish_delete: true,
    publish_truncate: false,
    tables: ['users'],
  }
  it('POST', async () => {
    const { data: newPublication } = await axios.post(`${URL}/publications`, publication)
    assert.strictEqual(newPublication.name, publication.name)
    assert.strictEqual(newPublication.publish_insert, publication.publish_insert)
    assert.strictEqual(newPublication.publish_update, publication.publish_update)
    assert.strictEqual(newPublication.publish_delete, publication.publish_delete)
    assert.strictEqual(newPublication.publish_truncate, publication.publish_truncate)
    assert.strictEqual(
      newPublication.tables.some((table) => `${table.schema}.${table.name}` === 'public.users'),
      true
    )
  })
  it('GET', async () => {
    const res = await axios.get(`${URL}/publications`)
    const newPublication = res.data[0]
    assert.strictEqual(newPublication.name, publication.name)
  })
  it('PATCH', async () => {
    const res = await axios.get(`${URL}/publications`)
    const { id } = res.data[0]

    const { data: updated } = await axios.patch(`${URL}/publications/${id}`, {
      name: 'b',
      publish_insert: false,
      tables: [],
    })
    assert.strictEqual(updated.name, 'b')
    assert.strictEqual(updated.publish_insert, false)
    assert.strictEqual(
      updated.tables.some((table) => `${table.schema}.${table.name}` === 'public.users'),
      false
    )
  })
  it('DELETE', async () => {
    const res = await axios.get(`${URL}/publications`)
    const { id } = res.data[0]

    await axios.delete(`${URL}/publications/${id}`)
    const { data: publications } = await axios.get(`${URL}/publications`)
    const stillExists = publications.some((x) => x.id === id)
    assert.strictEqual(stillExists, false)
  })
  it('/publications for tables with uppercase', async () => {
    const { data: table } = await axios.post(`${URL}/tables`, { name: 'T' })
    const { data: publication } = await axios.post(`${URL}/publications`, {
      name: 'pub',
      tables: ['T'],
    })
    assert.strictEqual(publication.name, 'pub')
    const { data: alteredPublication } = await axios.patch(
      `${URL}/publications/${publication.id}`,
      { tables: ['T'] }
    )
    assert.strictEqual(alteredPublication.name, 'pub')

    await axios.delete(`${URL}/publications/${publication.id}`)
    await axios.delete(`${URL}/tables/${table.id}`)
  })
})

describe('/publications FOR ALL TABLES', () => {
  const publication = {
    name: 'for_all',
    publish_insert: true,
    publish_update: true,
    publish_delete: true,
    publish_truncate: false,
  }
  it('POST', async () => {
    const { data: newPublication } = await axios.post(`${URL}/publications`, publication)
    assert.strictEqual(newPublication.name, publication.name)
    assert.strictEqual(newPublication.publish_insert, publication.publish_insert)
    assert.strictEqual(newPublication.publish_update, publication.publish_update)
    assert.strictEqual(newPublication.publish_delete, publication.publish_delete)
    assert.strictEqual(newPublication.publish_truncate, publication.publish_truncate)
  })
  it('DELETE', async () => {
    const res = await axios.get(`${URL}/publications`)
    const { id } = res.data[0]

    await axios.delete(`${URL}/publications/${id}`)
    const { data: publications } = await axios.get(`${URL}/publications`)
    const stillExists = publications.some((x) => x.id === id)
    assert.strictEqual(stillExists, false)
  })
})

describe('/triggers', () => {
  const renamedTriggerName = 'test_trigger_renamed'
  const trigger = {
    name: 'test_trigger',
    schema: 'public',
    table: 'users_audit',
    function_schema: 'public',
    function_name: 'audit_action',
    function_args: ['test1', 'test2'],
    activation: 'AFTER',
    events: ['UPDATE'],
    orientation: 'ROW',
    condition: '(old.* IS DISTINCT FROM new.*)',
  }
  const multiEventTrigger = {
    ...trigger,
    ...{ name: 'test_multi_event_trigger', events: ['insert', 'update', 'delete'], condition: '' },
  }

  before(async () => {
    await axios.post(`${URL}/query`, {
      query: `DROP TRIGGER IF EXISTS ${trigger.name} on ${trigger.schema}.${trigger.table} CASCADE;`,
    })
    await axios.post(`${URL}/query`, {
      query: `DROP TRIGGER IF EXISTS ${renamedTriggerName} on ${trigger.schema}.${trigger.table} CASCADE;`,
    })
    await axios.post(`${URL}/query`, {
      query: `DROP TRIGGER IF EXISTS ${multiEventTrigger.name} on ${multiEventTrigger.schema}.${multiEventTrigger.table} CASCADE;`,
    })
  })

  after(async () => {
    await axios.post(`${URL}/query`, {
      query: `DROP TRIGGER IF EXISTS ${trigger.name} on ${trigger.schema}.${trigger.table} CASCADE;`,
    })
    await axios.post(`${URL}/query`, {
      query: `DROP TRIGGER IF EXISTS ${renamedTriggerName} on ${trigger.schema}.${trigger.table} CASCADE;`,
    })
    await axios.post(`${URL}/query`, {
      query: `DROP TRIGGER IF EXISTS ${multiEventTrigger.name} on ${multiEventTrigger.schema}.${multiEventTrigger.table} CASCADE;`,
    })
  })

  it('POST trigger', async () => {
    const { data: triggerRecord } = await axios.post(`${URL}/triggers`, trigger)

    assert.strictEqual(typeof triggerRecord.id, 'number')
    assert.strictEqual(typeof triggerRecord.table_id, 'number')
    assert.strictEqual(triggerRecord.enabled_mode, 'ORIGIN')
    assert.strictEqual(triggerRecord.name, 'test_trigger')
    assert.strictEqual(triggerRecord.table, 'users_audit')
    assert.strictEqual(triggerRecord.schema, 'public')
    assert.strictEqual(triggerRecord.condition, '(old.* IS DISTINCT FROM new.*)')
    assert.strictEqual(triggerRecord.orientation, 'ROW')
    assert.strictEqual(triggerRecord.activation, 'AFTER')
    assert.strictEqual(triggerRecord.function_schema, 'public')
    assert.strictEqual(triggerRecord.function_name, 'audit_action')
    assert.deepStrictEqual(triggerRecord.events, ['UPDATE'])
    assert.deepStrictEqual(triggerRecord.function_args, ['test1', 'test2'])
  })

  it('POST multi-event trigger', async () => {
    const { data: triggerRecord } = await axios.post(`${URL}/triggers`, multiEventTrigger)

    assert.deepStrictEqual(new Set(triggerRecord.events), new Set(['INSERT', 'UPDATE', 'DELETE']))
  })

  it('GET', async () => {
    const { data: triggerData } = await axios.get(`${URL}/triggers`)
    const triggerIds = triggerData.reduce((acc, { id }) => acc.add(id), new Set())

    assert.strictEqual(triggerData.length, 2)
    assert.strictEqual(triggerIds.size, 2)
    assert.ok(triggerData.find(({ name }) => name === 'test_trigger'))
    assert.ok(triggerData.find(({ name }) => name === 'test_multi_event_trigger'))

    const sortedTriggerData = triggerData.sort((a, b) => a.name.length - b.name.length)

    const { data: singleEventTriggerRecord } = await axios.get(
      `${URL}/triggers/${sortedTriggerData[0].id}`
    )
    assert.strictEqual(singleEventTriggerRecord.name, 'test_trigger')

    const { data: multiEventTriggerRecord } = await axios.get(
      `${URL}/triggers/${sortedTriggerData[1].id}`
    )
    assert.strictEqual(multiEventTriggerRecord.name, 'test_multi_event_trigger')
  })

  it('PATCH', async () => {
    const { data: triggerData } = await axios.get(`${URL}/triggers`)
    const { id, name, enabled_mode } = triggerData.sort((a, b) => a.name.length - b.name.length)[0]

    assert.strictEqual(name, 'test_trigger')
    assert.strictEqual(enabled_mode, 'ORIGIN')

    const { data: updatedTriggerRecord } = await axios.patch(`${URL}/triggers/${id}`, {
      name: 'test_trigger_renamed',
      enabled_mode: 'DISABLED',
    })

    assert.strictEqual(updatedTriggerRecord.name, 'test_trigger_renamed')
    assert.strictEqual(updatedTriggerRecord.enabled_mode, 'DISABLED')

    const { data: reEnabledTriggerRecord } = await axios.patch(`${URL}/triggers/${id}`, {
      enabled_mode: 'REPLICA',
    })

    assert.strictEqual(reEnabledTriggerRecord.enabled_mode, 'REPLICA')
  })

  it('DELETE', async () => {
    const { data: triggerData } = await axios.get(`${URL}/triggers`)

    assert.strictEqual(triggerData.length, 2)

    const triggerIds = triggerData.reduce((acc, { id }) => acc.add(id), new Set())

    for (const id of triggerIds) {
      await axios.delete(`${URL}/triggers/${id}`)
    }

    const { data: emptyTriggerData } = await axios.get(`${URL}/triggers`)

    assert.strictEqual(emptyTriggerData.length, 0)
  })
})
