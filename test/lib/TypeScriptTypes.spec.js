var assert = require('assert')
var sinon = require('sinon')

import TypeScriptTypes from '../../bin/src/lib/TypeScriptTypes'
import { PostgresMeta } from '../../bin/src/lib'


describe('dump()', () => {
  it('returns a string of TypeScript types', async () => {
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
      },
      {
        table_id: 16402,
        schema: 'public',
        table: 'todos',
        id: '16402.2',
        ordinal_position: 2,
        name: 'details',
        default_value: null,
        data_type: 'text',
        format: 'text',
        is_identity: false,
        identity_generation: null,
        is_nullable: true,
        is_updatable: true,
        enums: [],
        comment: null
      },
      {
        table_id: 16402,
        schema: 'public',
        table: 'todos',
        id: '16402.3',
        ordinal_position: 3,
        name: 'user-id',
        default_value: null,
        data_type: 'bigint',
        format: 'int8',
        is_identity: false,
        identity_generation: null,
        is_nullable: false,
        is_updatable: true,
        enums: [],
        comment: null
      },
    ]
    sinon
      .stub(pgMeta.columns, "list")
      .returns(Promise.resolve({ data: columnsData }))

    const example = new TypeScriptTypes({ pgMeta: pgMeta });

    // TODO: ewww
    const expected = `export interface definitions {
  todos: {
    id: number;
    details?: string;
    user_id: number;
  };
}`

    assert.equal(await example.dump(), expected)
  })
})
