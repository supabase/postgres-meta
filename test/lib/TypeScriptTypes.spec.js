var assert = require('assert')
var sinon = require('sinon')

import TypeScriptTypes from '../../bin/src/lib/TypeScriptTypes'
import { PostgresMeta } from '../../bin/src/lib'


describe('.dump()', () => {
  it('returns definition for an int8 column', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table_id: 16402,
        schema: 'public',
        table: 'todos',
        id: '16402.1',
        ordinal_position: 1,
        name: 'id',
        default_value: null,
        data_type: 'bigint',
        format: 'int8',
        is_identity: true,
        identity_generation: 'BY DEFAULT',
        is_nullable: false,
        is_updatable: true,
        enums: [],
        comment: null
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptTypes({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { id: number };
}
`

    assert.equal(await example.dump(), expected)
  })

  it('returns definitions for multiple columns', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table: 'todos',
        name: 'id',
        default_value: null,
        format: 'int8',
        enums: [],
      },
      {
        table: 'todos',
        name: 'name',
        default_value: null,
        format: 'text',
        enums: [],
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptTypes({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { id: number; name: string };
}
`

    assert.equal(await example.dump(), expected)
  })

  it('returns definitions for multiple tables', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table: 'todos',
        name: 'id',
        default_value: null,
        format: 'int8',
        enums: [],
      },
      {
        table: 'todos',
        name: 'name',
        default_value: null,
        format: 'text',
        enums: [],
      },
      {
        table: 'memes',
        name: 'id',
        default_value: null,
        format: 'int8',
        enums: [],
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptTypes({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { id: number; name: string };
  memes: { id: number };
}
`

    assert.equal(await example.dump(), expected)
  })

  it('handles nullable columns', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table: 'todos',
        name: 'name',
        format: 'text',
        is_nullable: true
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptTypes({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { name?: string };
}
`

    assert.equal(await example.dump(), expected)
  })

  it('returns a string of TypeScript types', async () => {
    const pgMeta = new PostgresMeta({ connectionString: '', max: 1 })
    const columnsData = [
      {
        table: 'todos',
        name: 'id',
        format: 'int8',
        enums: [],
      },
      {
        table: 'todos',
        name: 'done',
        format: 'bool',
        enums: [],
      },
      {
        table: 'todos',
        name: 'done_at',
        is_nullable: true,
        format: 'date',
      },
      {
        table: 'memes',
        name: 'example',
        format: 'some-invalid-format',
      }
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptTypes({ pgMeta: pgMeta });

    const expected = `export interface definitions {
  todos: { id: number; done: boolean; done_at?: Date };
  memes: { example: any };
}
`

    assert.equal(await example.dump(), expected)
  })
})
