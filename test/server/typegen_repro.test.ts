
import { test, expect } from 'vitest'
import { apply } from '../../src/server/templates/typescript'
import { GeneratorMetadata } from '../../src/lib/generators'

test('repro: typescript generation issues', async () => {
    const metadata: GeneratorMetadata = {
        schemas: [{ id: 1, name: 'public', owner: 'postgres' }],
        tables: [
            {
                id: 1,
                schema: 'public',
                name: 'products',
                is_rls_enabled: false,
                primary_keys: [{ schema: 'public', table_name: 'products', name: 'id' }],
                required_for_insert: [],
            },
        ],
        views: [],
        foreignTables: [],
        materializedViews: [],
        columns: [
            {
                table_id: 1,
                schema: 'public',
                table: 'products',
                id: '1',
                ordinal_position: 1,
                name: 'id',
                default_value: null,
                data_type: 'integer',
                format: 'int4',
                is_identity: true,
                identity_generation: 'BY DEFAULT',
                is_nullable: false,
                is_updatable: true,
                is_unique: false,
                enums: [],
                comment: null,
                check: null,
                is_generated: false
            },
            {
                table_id: 1,
                schema: 'public',
                table: 'products',
                id: '2',
                ordinal_position: 2,
                name: 'name',
                default_value: null,
                data_type: 'text',
                format: 'text',
                is_identity: false,
                identity_generation: null,
                is_nullable: false,
                is_updatable: true,
                is_unique: false,
                enums: [],
                comment: null,
                check: null,
                is_generated: false
            },
        ],
        relationships: [],
        functions: [
            {
                id: 101,
                schema: 'public',
                name: 'zero_arg_fn',
                language: 'plpgsql',
                definition: '...',
                return_type_id: 23, // int4
                return_type_relation_id: null,
                return_type: 'int4',
                args: [],
                argument_types: '', // No arguments
                is_set_returning_function: false,
                behavior: 'VOLATILE',
                security_definer: false,
                config_params: null,
                complete_statement: '',
                identity_argument_types: '',
                prorows: null
            },
            {
                id: 102,
                schema: 'public',
                name: 'name_translated',
                language: 'plpgsql',
                definition: '...',
                return_type_id: 25, // text
                return_type_relation_id: null,
                return_type: 'text',
                args: [
                    {
                        mode: 'in',
                        name: '',
                        type_id: 10001, // arbitrary type id for table products row
                        has_default: false,
                    },
                ],
                // This is crucial: identifying it as taking 'products' as argument
                argument_types: 'products',
                is_set_returning_function: false,
                behavior: 'STABLE',
                security_definer: false,
                config_params: null,
                complete_statement: '',
                identity_argument_types: 'products',
                prorows: null
            },
            {
                id: 103,
                schema: 'public',
                name: 'fn_with_single_unnamed_table_arg',
                language: 'plpgsql',
                definition: '...',
                return_type_id: 25, // text
                return_type_relation_id: null,
                return_type: 'text',
                args: [
                    {
                        mode: 'in',
                        name: '',
                        type_id: 10001,
                        has_default: false,
                    },
                ],
                argument_types: 'products',
                is_set_returning_function: false,
                behavior: 'STABLE',
                security_definer: false,
                config_params: null,
                complete_statement: '',
                identity_argument_types: 'products',
                prorows: null
            }
        ],
        types: [
            {
                id: 23,
                name: 'int4',
                schema: 'pg_catalog',
                format: 'int4',
                enums: [],
                attributes: [],
                comment: null,
                type_relation_id: null
            },
            {
                id: 25,
                name: 'text',
                schema: 'pg_catalog',
                format: 'text',
                enums: [],
                attributes: [],
                comment: null,
                type_relation_id: null
            },
            // Mock type for the products table row
            {
                id: 10001,
                name: 'products',
                schema: 'public',
                format: 'products',
                enums: [],
                attributes: [],
                comment: null,
                type_relation_id: 1 // Link to table id
            }
        ],
        detectOneToOneRelationships: false,
    } as any

    const output = await apply(metadata)
    // console.log(output)
    require('fs').writeFileSync('repro_output.txt', output)

    // 1. Check zero arg function
    // Use regex to be resilient to whitespace changes
    const zeroArgRegex = /"zero_arg_fn":\s*\{\s*Args: Record<PropertyKey, never>\s*Returns: number\s*\}/
    // Use regex to be resilient to whitespace changes and Prettier quote removal
    expect(output).toMatch(/["']?zero_arg_fn["']?:/)
    expect(output).toContain('Args: Record<PropertyKey, never>')
    // expect(output).toMatch(zeroArgRegex)

    // 2. Check computed field in Table Row
    // It should appear in Tables.products.Row
    // We expect: "name_translated": string | null
    // We expect: "name_translated": string | null
    // allowing for optional quotes on keys
    const tableRowRegex = /["']?products["']?: \{\s*Row: \{[\s\S]*?["']?name_translated["']?: string \| null/
    expect(output).toMatch(tableRowRegex)

    // 3. Check function with single unnamed table arg in Functions
    // Use flexible regex to handle formatting
    const fnRegex = /["']?fn_with_single_unnamed_table_arg["']?:\s*\{\s*Args:\s*\{\s*""\s*:\s*Database\["public"\]\["Tables"\]\["products"\]\["Row"\]\s*\}\s*Returns:\s*string\s*\}/
    expect(output).toMatch(fnRegex)

})
