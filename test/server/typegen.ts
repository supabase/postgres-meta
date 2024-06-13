import { expect, test } from 'vitest'
import { app } from './utils'

test('typegen: typescript', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/typescript' })
  expect(body).toMatchInlineSnapshot(`
    "export type Json =
      | string
      | number
      | boolean
      | null
      | { [key: string]: Json | undefined }
      | Json[]

    export type Database = {
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
            Relationships: []
          }
          empty: {
            Row: {}
            Insert: {}
            Update: {}
            Relationships: []
          }
          foreign_table: {
            Row: {
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
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
            Relationships: [
              {
                foreignKeyName: "memes_category_fkey"
                columns: ["category"]
                referencedRelation: "category"
                referencedColumns: ["id"]
              },
            ]
          }
          table_with_other_tables_row_type: {
            Row: {
              col1: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Insert: {
              col1?: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2?: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Update: {
              col1?: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2?: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Relationships: []
          }
          table_with_primary_key_other_than_id: {
            Row: {
              name: string | null
              other_id: number
            }
            Insert: {
              name?: string | null
              other_id?: number
            }
            Update: {
              name?: string | null
              other_id?: number
            }
            Relationships: []
          }
          todos: {
            Row: {
              details: string | null
              id: number
              "user-id": number
              blurb: string | null
              blurb_varchar: string | null
              details_is_long: boolean | null
              details_length: number | null
              details_words: string[] | null
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
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
          user_details: {
            Row: {
              details: string | null
              user_id: number
            }
            Insert: {
              details?: string | null
              user_id: number
            }
            Update: {
              details?: string | null
              user_id?: number
            }
            Relationships: [
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
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
            Relationships: []
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
            Relationships: []
          }
        }
        Views: {
          a_view: {
            Row: {
              id: number | null
            }
            Insert: {
              id?: number | null
            }
            Update: {
              id?: number | null
            }
            Relationships: []
          }
          todos_matview: {
            Row: {
              details: string | null
              id: number | null
              "user-id": number | null
            }
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
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
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
          users_view: {
            Row: {
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          blurb_varchar: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          details_is_long: {
            Args: {
              "": unknown
            }
            Returns: boolean
          }
          details_length: {
            Args: {
              "": unknown
            }
            Returns: number
          }
          details_words: {
            Args: {
              "": unknown
            }
            Returns: string[]
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
          polymorphic_function:
            | {
                Args: {
                  "": boolean
                }
                Returns: undefined
              }
            | {
                Args: {
                  "": string
                }
                Returns: undefined
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
          composite_type_with_array_attribute: {
            my_text_array: string[] | null
          }
        }
      }
    }

    type PublicSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = PublicEnumNameOrOptions extends { schema: keyof Database }
      ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never
    "
  `)
})

test('typegen w/ one-to-one relationships', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true' },
  })
  expect(body).toMatchInlineSnapshot(`
    "export type Json =
      | string
      | number
      | boolean
      | null
      | { [key: string]: Json | undefined }
      | Json[]

    export type Database = {
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
            Relationships: []
          }
          empty: {
            Row: {}
            Insert: {}
            Update: {}
            Relationships: []
          }
          foreign_table: {
            Row: {
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
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
            Relationships: [
              {
                foreignKeyName: "memes_category_fkey"
                columns: ["category"]
                isOneToOne: false
                referencedRelation: "category"
                referencedColumns: ["id"]
              },
            ]
          }
          table_with_other_tables_row_type: {
            Row: {
              col1: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Insert: {
              col1?: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2?: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Update: {
              col1?: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2?: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Relationships: []
          }
          table_with_primary_key_other_than_id: {
            Row: {
              name: string | null
              other_id: number
            }
            Insert: {
              name?: string | null
              other_id?: number
            }
            Update: {
              name?: string | null
              other_id?: number
            }
            Relationships: []
          }
          todos: {
            Row: {
              details: string | null
              id: number
              "user-id": number
              blurb: string | null
              blurb_varchar: string | null
              details_is_long: boolean | null
              details_length: number | null
              details_words: string[] | null
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
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
          user_details: {
            Row: {
              details: string | null
              user_id: number
            }
            Insert: {
              details?: string | null
              user_id: number
            }
            Update: {
              details?: string | null
              user_id?: number
            }
            Relationships: [
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
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
            Relationships: []
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
            Relationships: []
          }
        }
        Views: {
          a_view: {
            Row: {
              id: number | null
            }
            Insert: {
              id?: number | null
            }
            Update: {
              id?: number | null
            }
            Relationships: []
          }
          todos_matview: {
            Row: {
              details: string | null
              id: number | null
              "user-id": number | null
            }
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
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
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
          users_view: {
            Row: {
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          blurb_varchar: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          details_is_long: {
            Args: {
              "": unknown
            }
            Returns: boolean
          }
          details_length: {
            Args: {
              "": unknown
            }
            Returns: number
          }
          details_words: {
            Args: {
              "": unknown
            }
            Returns: string[]
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
          polymorphic_function:
            | {
                Args: {
                  "": boolean
                }
                Returns: undefined
              }
            | {
                Args: {
                  "": string
                }
                Returns: undefined
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
          composite_type_with_array_attribute: {
            my_text_array: string[] | null
          }
        }
      }
    }

    type PublicSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = PublicEnumNameOrOptions extends { schema: keyof Database }
      ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never
    "
  `)
})

test('typegen: typescript w/ one-to-one relationships', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true' },
  })
  expect(body).toMatchInlineSnapshot(`
    "export type Json =
      | string
      | number
      | boolean
      | null
      | { [key: string]: Json | undefined }
      | Json[]

    export type Database = {
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
            Relationships: []
          }
          empty: {
            Row: {}
            Insert: {}
            Update: {}
            Relationships: []
          }
          foreign_table: {
            Row: {
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
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
            Relationships: [
              {
                foreignKeyName: "memes_category_fkey"
                columns: ["category"]
                isOneToOne: false
                referencedRelation: "category"
                referencedColumns: ["id"]
              },
            ]
          }
          table_with_other_tables_row_type: {
            Row: {
              col1: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Insert: {
              col1?: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2?: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Update: {
              col1?: Database["public"]["Tables"]["user_details"]["Row"] | null
              col2?: Database["public"]["Views"]["a_view"]["Row"] | null
            }
            Relationships: []
          }
          table_with_primary_key_other_than_id: {
            Row: {
              name: string | null
              other_id: number
            }
            Insert: {
              name?: string | null
              other_id?: number
            }
            Update: {
              name?: string | null
              other_id?: number
            }
            Relationships: []
          }
          todos: {
            Row: {
              details: string | null
              id: number
              "user-id": number
              blurb: string | null
              blurb_varchar: string | null
              details_is_long: boolean | null
              details_length: number | null
              details_words: string[] | null
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
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
          user_details: {
            Row: {
              details: string | null
              user_id: number
            }
            Insert: {
              details?: string | null
              user_id: number
            }
            Update: {
              details?: string | null
              user_id?: number
            }
            Relationships: [
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
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
            Relationships: []
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
            Relationships: []
          }
        }
        Views: {
          a_view: {
            Row: {
              id: number | null
            }
            Insert: {
              id?: number | null
            }
            Update: {
              id?: number | null
            }
            Relationships: []
          }
          todos_matview: {
            Row: {
              details: string | null
              id: number | null
              "user-id": number | null
            }
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
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
            Relationships: [
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "a_view"
                referencedColumns: ["id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view"
                referencedColumns: ["id"]
              },
            ]
          }
          users_view: {
            Row: {
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          blurb_varchar: {
            Args: {
              "": unknown
            }
            Returns: string
          }
          details_is_long: {
            Args: {
              "": unknown
            }
            Returns: boolean
          }
          details_length: {
            Args: {
              "": unknown
            }
            Returns: number
          }
          details_words: {
            Args: {
              "": unknown
            }
            Returns: string[]
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
          polymorphic_function:
            | {
                Args: {
                  "": boolean
                }
                Returns: undefined
              }
            | {
                Args: {
                  "": string
                }
                Returns: undefined
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
          composite_type_with_array_attribute: {
            my_text_array: string[] | null
          }
        }
      }
    }

    type PublicSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
            Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
        ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
      TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = PublicTableNameOrOptions extends { schema: keyof Database }
      ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = PublicEnumNameOrOptions extends { schema: keyof Database }
      ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
        : never
    "
  `)
})

test('typegen: go', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/go' })
  expect(body).toMatchInlineSnapshot(`
    "package database

    import "database/sql"

    type PublicUsersSelect struct {
      Id     int64          \`json:"id"\`
      Name   sql.NullString \`json:"name"\`
      Status sql.NullString \`json:"status"\`
    }

    type PublicUsersInsert struct {
      Id     sql.NullInt64  \`json:"id"\`
      Name   sql.NullString \`json:"name"\`
      Status sql.NullString \`json:"status"\`
    }

    type PublicUsersUpdate struct {
      Id     sql.NullInt64  \`json:"id"\`
      Name   sql.NullString \`json:"name"\`
      Status sql.NullString \`json:"status"\`
    }

    type PublicTodosSelect struct {
      Details sql.NullString \`json:"details"\`
      Id      int64          \`json:"id"\`
      UserId  int64          \`json:"user-id"\`
    }

    type PublicTodosInsert struct {
      Details sql.NullString \`json:"details"\`
      Id      sql.NullInt64  \`json:"id"\`
      UserId  int64          \`json:"user-id"\`
    }

    type PublicTodosUpdate struct {
      Details sql.NullString \`json:"details"\`
      Id      sql.NullInt64  \`json:"id"\`
      UserId  sql.NullInt64  \`json:"user-id"\`
    }

    type PublicUsersAuditSelect struct {
      CreatedAt     sql.NullString \`json:"created_at"\`
      Id            int64          \`json:"id"\`
      PreviousValue interface{}    \`json:"previous_value"\`
      UserId        sql.NullInt64  \`json:"user_id"\`
    }

    type PublicUsersAuditInsert struct {
      CreatedAt     sql.NullString \`json:"created_at"\`
      Id            sql.NullInt64  \`json:"id"\`
      PreviousValue interface{}    \`json:"previous_value"\`
      UserId        sql.NullInt64  \`json:"user_id"\`
    }

    type PublicUsersAuditUpdate struct {
      CreatedAt     sql.NullString \`json:"created_at"\`
      Id            sql.NullInt64  \`json:"id"\`
      PreviousValue interface{}    \`json:"previous_value"\`
      UserId        sql.NullInt64  \`json:"user_id"\`
    }

    type PublicUserDetailsSelect struct {
      Details sql.NullString \`json:"details"\`
      UserId  int64          \`json:"user_id"\`
    }

    type PublicUserDetailsInsert struct {
      Details sql.NullString \`json:"details"\`
      UserId  int64          \`json:"user_id"\`
    }

    type PublicUserDetailsUpdate struct {
      Details sql.NullString \`json:"details"\`
      UserId  sql.NullInt64  \`json:"user_id"\`
    }

    type PublicEmptySelect struct {

    }

    type PublicEmptyInsert struct {

    }

    type PublicEmptyUpdate struct {

    }

    type PublicTableWithOtherTablesRowTypeSelect struct {
      Col1 interface{} \`json:"col1"\`
      Col2 interface{} \`json:"col2"\`
    }

    type PublicTableWithOtherTablesRowTypeInsert struct {
      Col1 interface{} \`json:"col1"\`
      Col2 interface{} \`json:"col2"\`
    }

    type PublicTableWithOtherTablesRowTypeUpdate struct {
      Col1 interface{} \`json:"col1"\`
      Col2 interface{} \`json:"col2"\`
    }

    type PublicTableWithPrimaryKeyOtherThanIdSelect struct {
      Name    sql.NullString \`json:"name"\`
      OtherId int64          \`json:"other_id"\`
    }

    type PublicTableWithPrimaryKeyOtherThanIdInsert struct {
      Name    sql.NullString \`json:"name"\`
      OtherId sql.NullInt64  \`json:"other_id"\`
    }

    type PublicTableWithPrimaryKeyOtherThanIdUpdate struct {
      Name    sql.NullString \`json:"name"\`
      OtherId sql.NullInt64  \`json:"other_id"\`
    }

    type PublicCategorySelect struct {
      Id   int32  \`json:"id"\`
      Name string \`json:"name"\`
    }

    type PublicCategoryInsert struct {
      Id   sql.NullInt32 \`json:"id"\`
      Name string        \`json:"name"\`
    }

    type PublicCategoryUpdate struct {
      Id   sql.NullInt32  \`json:"id"\`
      Name sql.NullString \`json:"name"\`
    }

    type PublicMemesSelect struct {
      Category  sql.NullInt32  \`json:"category"\`
      CreatedAt string         \`json:"created_at"\`
      Id        int32          \`json:"id"\`
      Metadata  interface{}    \`json:"metadata"\`
      Name      string         \`json:"name"\`
      Status    sql.NullString \`json:"status"\`
    }

    type PublicMemesInsert struct {
      Category  sql.NullInt32  \`json:"category"\`
      CreatedAt string         \`json:"created_at"\`
      Id        sql.NullInt32  \`json:"id"\`
      Metadata  interface{}    \`json:"metadata"\`
      Name      string         \`json:"name"\`
      Status    sql.NullString \`json:"status"\`
    }

    type PublicMemesUpdate struct {
      Category  sql.NullInt32  \`json:"category"\`
      CreatedAt sql.NullString \`json:"created_at"\`
      Id        sql.NullInt32  \`json:"id"\`
      Metadata  interface{}    \`json:"metadata"\`
      Name      sql.NullString \`json:"name"\`
      Status    sql.NullString \`json:"status"\`
    }

    type PublicTodosViewSelect struct {
      Details sql.NullString \`json:"details"\`
      Id      sql.NullInt64  \`json:"id"\`
      UserId  sql.NullInt64  \`json:"user-id"\`
    }

    type PublicUsersViewSelect struct {
      Id     sql.NullInt64  \`json:"id"\`
      Name   sql.NullString \`json:"name"\`
      Status sql.NullString \`json:"status"\`
    }

    type PublicAViewSelect struct {
      Id sql.NullInt64 \`json:"id"\`
    }

    type PublicTodosMatviewSelect struct {
      Details sql.NullString \`json:"details"\`
      Id      sql.NullInt64  \`json:"id"\`
      UserId  sql.NullInt64  \`json:"user-id"\`
    }

    type PublicCompositeTypeWithArrayAttribute struct {
      MyTextArray interface{} \`json:"my_text_array"\`
    }"
  `)
})

test('typegen: swift', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/swift' })
  expect(body).toMatchInlineSnapshot(`
    "import Foundation
    import Supabase

    // MARK: - Enums
    internal enum MemeStatus: String, Codable, Hashable, Sendable {
      case new = "new"
      case old = "old"
      case retired = "retired"
    }

    internal enum UserStatus: String, Codable, Hashable, Sendable {
      case active = "ACTIVE"
      case inactive = "INACTIVE"
    }

    // MARK: - Schemas
    internal enum PublicSchema {}

    // MARK: - Tables
    extension PublicSchema {
      internal struct UsersSelect: Codable, Hashable, Sendable {
        internal let id: Int64
        internal let name: String?
        internal let status: PublicSchema.UserStatus?

        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
    }
    extension PublicSchema.UsersSelect: Identifiable {

    }

    extension PublicSchema {
      internal struct UsersInsert: Codable, Hashable, Sendable {
        internal let id: Int64?
        internal let name: String?
        internal let status: PublicSchema.UserStatus?

        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      internal struct UsersUpdate: Codable, Hashable, Sendable {
        internal let id: Int64?
        internal let name: String?
        internal let status: PublicSchema.UserStatus?

        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      internal struct TodosSelect: Codable, Hashable, Sendable {
        internal let details: String?
        internal let id: Int64
        internal let userId: Int64

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }
    extension PublicSchema.TodosSelect: Identifiable {

    }

    extension PublicSchema {
      internal struct TodosInsert: Codable, Hashable, Sendable {
        internal let details: String?
        internal let id: Int64?
        internal let userId: Int64

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }

    extension PublicSchema {
      internal struct TodosUpdate: Codable, Hashable, Sendable {
        internal let details: String?
        internal let id: Int64?
        internal let userId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }

    extension PublicSchema {
      internal struct UsersAuditSelect: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let id: Int64
        internal let previousValue: AnyJSON?
        internal let userId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case id = "id"
          case previousValue = "previous_value"
          case userId = "user_id"
        }
    }
    extension PublicSchema.UsersAuditSelect: Identifiable {

    }

    extension PublicSchema {
      internal struct UsersAuditInsert: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let id: Int64?
        internal let previousValue: AnyJSON?
        internal let userId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case id = "id"
          case previousValue = "previous_value"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      internal struct UsersAuditUpdate: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let id: Int64?
        internal let previousValue: AnyJSON?
        internal let userId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case id = "id"
          case previousValue = "previous_value"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      internal struct UserDetailsSelect: Codable, Hashable, Sendable {
        internal let details: String?
        internal let userId: Int64

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      internal struct UserDetailsInsert: Codable, Hashable, Sendable {
        internal let details: String?
        internal let userId: Int64

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      internal struct UserDetailsUpdate: Codable, Hashable, Sendable {
        internal let details: String?
        internal let userId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      internal struct EmptySelect: Codable, Hashable, Sendable {


        internal enum CodingKeys: String, CodingKey {

        }
    }

    extension PublicSchema {
      internal struct EmptyInsert: Codable, Hashable, Sendable {


        internal enum CodingKeys: String, CodingKey {

        }
    }

    extension PublicSchema {
      internal struct EmptyUpdate: Codable, Hashable, Sendable {


        internal enum CodingKeys: String, CodingKey {

        }
    }

    extension PublicSchema {
      internal struct TableWithOtherTablesRowTypeSelect: Codable, Hashable, Sendable {
        internal let col1: PublicSchema.UserDetails?
        internal let col2: PublicSchema.AView?

        internal enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
    }

    extension PublicSchema {
      internal struct TableWithOtherTablesRowTypeInsert: Codable, Hashable, Sendable {
        internal let col1: PublicSchema.UserDetails?
        internal let col2: PublicSchema.AView?

        internal enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
    }

    extension PublicSchema {
      internal struct TableWithOtherTablesRowTypeUpdate: Codable, Hashable, Sendable {
        internal let col1: PublicSchema.UserDetails?
        internal let col2: PublicSchema.AView?

        internal enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
    }

    extension PublicSchema {
      internal struct TableWithPrimaryKeyOtherThanIdSelect: Codable, Hashable, Sendable {
        internal let name: String?
        internal let otherId: Int64

        internal enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
    }
    extension PublicSchema.TableWithPrimaryKeyOtherThanIdSelect: Identifiable {
        internal var id: Int64 { otherId }
    }

    extension PublicSchema {
      internal struct TableWithPrimaryKeyOtherThanIdInsert: Codable, Hashable, Sendable {
        internal let name: String?
        internal let otherId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
    }

    extension PublicSchema {
      internal struct TableWithPrimaryKeyOtherThanIdUpdate: Codable, Hashable, Sendable {
        internal let name: String?
        internal let otherId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
    }

    extension PublicSchema {
      internal struct CategorySelect: Codable, Hashable, Sendable {
        internal let id: Int32
        internal let name: String

        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
    }

    extension PublicSchema {
      internal struct CategoryInsert: Codable, Hashable, Sendable {
        internal let id: Int32?
        internal let name: String

        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
    }

    extension PublicSchema {
      internal struct CategoryUpdate: Codable, Hashable, Sendable {
        internal let id: Int32?
        internal let name: String?

        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
    }

    extension PublicSchema {
      internal struct MemesSelect: Codable, Hashable, Sendable {
        internal let category: Int32?
        internal let createdAt: String
        internal let id: Int32
        internal let metadata: AnyJSON?
        internal let name: String
        internal let status: PublicSchema.MemeStatus?

        internal enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      internal struct MemesInsert: Codable, Hashable, Sendable {
        internal let category: Int32?
        internal let createdAt: String
        internal let id: Int32?
        internal let metadata: AnyJSON?
        internal let name: String
        internal let status: PublicSchema.MemeStatus?

        internal enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      internal struct MemesUpdate: Codable, Hashable, Sendable {
        internal let category: Int32?
        internal let createdAt: String?
        internal let id: Int32?
        internal let metadata: AnyJSON?
        internal let name: String?
        internal let status: PublicSchema.MemeStatus?

        internal enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
    }

    // MARK: - Views






    // MARK: - Materialized Views
    extension PublicSchema {
      internal struct TodosMatviewSelect: Codable, Hashable, Sendable {
        internal let details: String?
        internal let id: Int64?
        internal let userId: Int64?

        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }

    // MARK: - Composite Types
    extension PublicSchema {
      internal struct CompositeTypeWithArrayAttribute: Codable, Hashable, Sendable {
        internal let MyTextArray: AnyJSON

        internal enum CodingKeys: String, CodingKey {
          case MyTextArray = "my_text_array"
        }
      }
    }
    }"
  `)
})

test('typegen: swift w/ public access control', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/swift',
    query: { access_control: 'public' },
  })
  expect(body).toMatchInlineSnapshot(`
    "import Foundation
    import Supabase

    // MARK: - Enums
    public enum MemeStatus: String, Codable, Hashable, Sendable {
      case new = "new"
      case old = "old"
      case retired = "retired"
    }

    public enum UserStatus: String, Codable, Hashable, Sendable {
      case active = "ACTIVE"
      case inactive = "INACTIVE"
    }

    // MARK: - Schemas
    public enum PublicSchema {}

    // MARK: - Tables
    extension PublicSchema {
      public struct UsersSelect: Codable, Hashable, Sendable {
        public let id: Int64
        public let name: String?
        public let status: PublicSchema.UserStatus?

        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
    }
    extension PublicSchema.UsersSelect: Identifiable {

    }

    extension PublicSchema {
      public struct UsersInsert: Codable, Hashable, Sendable {
        public let id: Int64?
        public let name: String?
        public let status: PublicSchema.UserStatus?

        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      public struct UsersUpdate: Codable, Hashable, Sendable {
        public let id: Int64?
        public let name: String?
        public let status: PublicSchema.UserStatus?

        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      public struct TodosSelect: Codable, Hashable, Sendable {
        public let details: String?
        public let id: Int64
        public let userId: Int64

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }
    extension PublicSchema.TodosSelect: Identifiable {

    }

    extension PublicSchema {
      public struct TodosInsert: Codable, Hashable, Sendable {
        public let details: String?
        public let id: Int64?
        public let userId: Int64

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }

    extension PublicSchema {
      public struct TodosUpdate: Codable, Hashable, Sendable {
        public let details: String?
        public let id: Int64?
        public let userId: Int64?

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }

    extension PublicSchema {
      public struct UsersAuditSelect: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let id: Int64
        public let previousValue: AnyJSON?
        public let userId: Int64?

        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case id = "id"
          case previousValue = "previous_value"
          case userId = "user_id"
        }
    }
    extension PublicSchema.UsersAuditSelect: Identifiable {

    }

    extension PublicSchema {
      public struct UsersAuditInsert: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let id: Int64?
        public let previousValue: AnyJSON?
        public let userId: Int64?

        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case id = "id"
          case previousValue = "previous_value"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      public struct UsersAuditUpdate: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let id: Int64?
        public let previousValue: AnyJSON?
        public let userId: Int64?

        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case id = "id"
          case previousValue = "previous_value"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      public struct UserDetailsSelect: Codable, Hashable, Sendable {
        public let details: String?
        public let userId: Int64

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      public struct UserDetailsInsert: Codable, Hashable, Sendable {
        public let details: String?
        public let userId: Int64

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      public struct UserDetailsUpdate: Codable, Hashable, Sendable {
        public let details: String?
        public let userId: Int64?

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
    }

    extension PublicSchema {
      public struct EmptySelect: Codable, Hashable, Sendable {


        public enum CodingKeys: String, CodingKey {

        }
    }

    extension PublicSchema {
      public struct EmptyInsert: Codable, Hashable, Sendable {


        public enum CodingKeys: String, CodingKey {

        }
    }

    extension PublicSchema {
      public struct EmptyUpdate: Codable, Hashable, Sendable {


        public enum CodingKeys: String, CodingKey {

        }
    }

    extension PublicSchema {
      public struct TableWithOtherTablesRowTypeSelect: Codable, Hashable, Sendable {
        public let col1: PublicSchema.UserDetails?
        public let col2: PublicSchema.AView?

        public enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
    }

    extension PublicSchema {
      public struct TableWithOtherTablesRowTypeInsert: Codable, Hashable, Sendable {
        public let col1: PublicSchema.UserDetails?
        public let col2: PublicSchema.AView?

        public enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
    }

    extension PublicSchema {
      public struct TableWithOtherTablesRowTypeUpdate: Codable, Hashable, Sendable {
        public let col1: PublicSchema.UserDetails?
        public let col2: PublicSchema.AView?

        public enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
    }

    extension PublicSchema {
      public struct TableWithPrimaryKeyOtherThanIdSelect: Codable, Hashable, Sendable {
        public let name: String?
        public let otherId: Int64

        public enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
    }
    extension PublicSchema.TableWithPrimaryKeyOtherThanIdSelect: Identifiable {
        public var id: Int64 { otherId }
    }

    extension PublicSchema {
      public struct TableWithPrimaryKeyOtherThanIdInsert: Codable, Hashable, Sendable {
        public let name: String?
        public let otherId: Int64?

        public enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
    }

    extension PublicSchema {
      public struct TableWithPrimaryKeyOtherThanIdUpdate: Codable, Hashable, Sendable {
        public let name: String?
        public let otherId: Int64?

        public enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
    }

    extension PublicSchema {
      public struct CategorySelect: Codable, Hashable, Sendable {
        public let id: Int32
        public let name: String

        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
    }

    extension PublicSchema {
      public struct CategoryInsert: Codable, Hashable, Sendable {
        public let id: Int32?
        public let name: String

        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
    }

    extension PublicSchema {
      public struct CategoryUpdate: Codable, Hashable, Sendable {
        public let id: Int32?
        public let name: String?

        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
    }

    extension PublicSchema {
      public struct MemesSelect: Codable, Hashable, Sendable {
        public let category: Int32?
        public let createdAt: String
        public let id: Int32
        public let metadata: AnyJSON?
        public let name: String
        public let status: PublicSchema.MemeStatus?

        public enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      public struct MemesInsert: Codable, Hashable, Sendable {
        public let category: Int32?
        public let createdAt: String
        public let id: Int32?
        public let metadata: AnyJSON?
        public let name: String
        public let status: PublicSchema.MemeStatus?

        public enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
    }

    extension PublicSchema {
      public struct MemesUpdate: Codable, Hashable, Sendable {
        public let category: Int32?
        public let createdAt: String?
        public let id: Int32?
        public let metadata: AnyJSON?
        public let name: String?
        public let status: PublicSchema.MemeStatus?

        public enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
    }

    // MARK: - Views






    // MARK: - Materialized Views
    extension PublicSchema {
      public struct TodosMatviewSelect: Codable, Hashable, Sendable {
        public let details: String?
        public let id: Int64?
        public let userId: Int64?

        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
    }

    // MARK: - Composite Types
    extension PublicSchema {
      public struct CompositeTypeWithArrayAttribute: Codable, Hashable, Sendable {
        public let MyTextArray: AnyJSON

        public enum CodingKeys: String, CodingKey {
          case MyTextArray = "my_text_array"
        }
      }
    }
    }"
  `)
})
