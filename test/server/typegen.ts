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
