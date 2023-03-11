import { app } from './utils'

test('typegen', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/typescript' })
  // This is expected to be very brittle, as generated types can change a lot
  // without being breaking changes. Use `npm run test:update` to make life
  // easier.
  expect(body).toMatchInlineSnapshot(`
    "export type Json =
      | string
      | number
      | boolean
      | null
      | { [key: string]: Json }
      | Json[]

    export interface Database {
      public: {
        Tables: {
          category: {
            Row: {
              id: number
              name: string
            }
            Insert: {
              id?: number
              name: string
            }
            Update: {
              id?: number
              name?: string
            }
          }
          memes: {
            Row: {
              category: number | null
              created_at: string
              id: number
              metadata: Json | null
              name: string
              status: Database["public"]["Enums"]["meme_status"] | null
            }
            Insert: {
              category?: number | null
              created_at: string
              id?: number
              metadata?: Json | null
              name: string
              status?: Database["public"]["Enums"]["meme_status"] | null
            }
            Update: {
              category?: number | null
              created_at?: string
              id?: number
              metadata?: Json | null
              name?: string
              status?: Database["public"]["Enums"]["meme_status"] | null
            }
          }
          todos: {
            Row: {
              details: string | null
              id: number
              "user-id": number
              blurb: string | null
            }
            Insert: {
              details?: string | null
              id?: number
              "user-id": number
            }
            Update: {
              details?: string | null
              id?: number
              "user-id"?: number
            }
          }
          users: {
            Row: {
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
          }
          users_audit: {
            Row: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }
            Insert: {
              created_at?: string | null
              id?: number
              previous_value?: Json | null
              user_id?: number | null
            }
            Update: {
              created_at?: string | null
              id?: number
              previous_value?: Json | null
              user_id?: number | null
            }
          }
        }
        Views: {
          todos_view: {
            Row: {
              details: string | null
              id: number | null
              "user-id": number | null
            }
            Insert: {
              details?: string | null
              id?: number | null
              "user-id"?: number | null
            }
            Update: {
              details?: string | null
              id?: number | null
              "user-id"?: number | null
            }
          }
          todos_with_user_view: {
            Row: {
              details: string | null
              id: number | null
              user: Database["public"]["Tables"]["users"]["Row"] | null
            }
          }
        }
        Functions: {
          blurb: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          function_returning_row: {
            Args: Record<PropertyKey, never>
            Returns: {
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
          }
          function_returning_set_of_rows: {
            Args: Record<PropertyKey, never>
            Returns: {
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }[]
          }
          function_returning_table: {
            Args: Record<PropertyKey, never>
            Returns: {
              id: number
              name: string
            }[]
          }
          postgres_fdw_disconnect: {
            Args: {
              "": string
            }
            Returns: boolean
          }
          postgres_fdw_disconnect_all: {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
          postgres_fdw_get_connections: {
            Args: Record<PropertyKey, never>
            Returns: Record<string, unknown>[]
          }
          postgres_fdw_handler: {
            Args: Record<PropertyKey, never>
            Returns: unknown
          }
        }
        Enums: {
          meme_status: "new" | "old" | "retired"
          user_status: "ACTIVE" | "INACTIVE"
        }
        CompositeTypes: {
          [_ in never]: never
        }
      }
    }
    "
  `)
})
