import { expect, test } from 'vitest'
import { app } from './utils'

test('typegen: typescript', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/typescript' })
  expect(body).toMatchInlineSnapshot(
    `
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
          users_view_with_multiple_refs_to_users: {
            Row: {
              initial_id: number | null
              initial_name: string | null
              second_id: number | null
              second_name: string | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          blurb_varchar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: boolean
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: number
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
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
          get_todos_setof_rows: {
            Args:
              | { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
              | { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
          }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }[]
          }
          polymorphic_function: {
            Args: { "": boolean } | { "": string }
            Returns: undefined
          }
          postgres_fdw_disconnect: {
            Args: { "": string }
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
          test_internal_query: {
            Args: Record<PropertyKey, never>
            Returns: undefined
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
          composite_type_with_record_attribute: {
            todo: Database["public"]["Tables"]["todos"]["Row"] | null
          }
        }
      }
    }

    type DefaultSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
      ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
      : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

    export const Constants = {
      public: {
        Enums: {
          meme_status: ["new", "old", "retired"],
          user_status: ["ACTIVE", "INACTIVE"],
        },
      },
    } as const
    "
  `
  )
})

test('typegen w/ one-to-one relationships', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true' },
  })
  expect(body).toMatchInlineSnapshot(
    `
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
          users_view_with_multiple_refs_to_users: {
            Row: {
              initial_id: number | null
              initial_name: string | null
              second_id: number | null
              second_name: string | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          blurb_varchar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: boolean
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: number
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
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
          get_todos_setof_rows: {
            Args:
              | { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
              | { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
          }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }[]
          }
          polymorphic_function: {
            Args: { "": boolean } | { "": string }
            Returns: undefined
          }
          postgres_fdw_disconnect: {
            Args: { "": string }
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
          test_internal_query: {
            Args: Record<PropertyKey, never>
            Returns: undefined
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
          composite_type_with_record_attribute: {
            todo: Database["public"]["Tables"]["todos"]["Row"] | null
          }
        }
      }
    }

    type DefaultSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
      ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
      : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

    export const Constants = {
      public: {
        Enums: {
          meme_status: ["new", "old", "retired"],
          user_status: ["ACTIVE", "INACTIVE"],
        },
      },
    } as const
    "
  `
  )
})

test('typegen: typescript w/ one-to-one relationships', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true' },
  })
  expect(body).toMatchInlineSnapshot(
    `
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
          users_view_with_multiple_refs_to_users: {
            Row: {
              initial_id: number | null
              initial_name: string | null
              second_id: number | null
              second_name: string | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          blurb_varchar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: boolean
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: number
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
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
          get_todos_setof_rows: {
            Args:
              | { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
              | { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
          }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }[]
          }
          polymorphic_function: {
            Args: { "": boolean } | { "": string }
            Returns: undefined
          }
          postgres_fdw_disconnect: {
            Args: { "": string }
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
          test_internal_query: {
            Args: Record<PropertyKey, never>
            Returns: undefined
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
          composite_type_with_record_attribute: {
            todo: Database["public"]["Tables"]["todos"]["Row"] | null
          }
        }
      }
    }

    type DefaultSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
      ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
      : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

    export const Constants = {
      public: {
        Enums: {
          meme_status: ["new", "old", "retired"],
          user_status: ["ACTIVE", "INACTIVE"],
        },
      },
    } as const
    "
  `
  )
})

test('typegen: typescript w/ postgrestVersion', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true', postgrest_version: '13' },
  })
  expect(body).toMatchInlineSnapshot(
    `
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "user_details_user_id_fkey"
                columns: ["user_id"]
                isOneToOne: true
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["initial_id"]
              },
              {
                foreignKeyName: "todos_user-id_fkey"
                columns: ["user-id"]
                isOneToOne: false
                referencedRelation: "users_view_with_multiple_refs_to_users"
                referencedColumns: ["second_id"]
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
          users_view_with_multiple_refs_to_users: {
            Row: {
              initial_id: number | null
              initial_name: string | null
              second_id: number | null
              second_name: string | null
            }
            Relationships: []
          }
        }
        Functions: {
          blurb: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          blurb_varchar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: string
          }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: boolean
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: number
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
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
          get_todos_setof_rows: {
            Args:
              | { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
              | { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
          }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }[]
          }
          polymorphic_function: {
            Args: { "": boolean } | { "": string }
            Returns: undefined
          }
          postgres_fdw_disconnect: {
            Args: { "": string }
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
          test_internal_query: {
            Args: Record<PropertyKey, never>
            Returns: undefined
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
          composite_type_with_record_attribute: {
            todo: Database["public"]["Tables"]["todos"]["Row"] | null
          }
        }
      }
      // Allows to automatically instanciate createClient with right options
      // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
      __InternalSupabase: {
        PostgrestVersion: "13"
        Tables: {
          [_ in never]: never
        }
        Views: {
          [_ in never]: never
        }
        Functions: {
          [_ in never]: never
        }
        Enums: {
          [_ in never]: never
        }
        CompositeTypes: {
          [_ in never]: never
        }
      }
    }

    type DefaultSchema = Database[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
          }
          ? R
          : never
        : never

    export type TablesInsert<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
          }
          ? I
          : never
        : never

    export type TablesUpdate<
      DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
          }
          ? U
          : never
        : never

    export type Enums<
      DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
      ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
      }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
      ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
      : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

    export const Constants = {
      public: {
        Enums: {
          meme_status: ["new", "old", "retired"],
          user_status: ["ACTIVE", "INACTIVE"],
        },
      },
    } as const
    "
  `
  )
})

test('typegen: go', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/go' })
  expect(body).toMatchInlineSnapshot(`
    "package database

type PublicUsersSelect struct {
  Id     int64   \`json:"id"\`
  Name   *string \`json:"name"\`
  Status *string \`json:"status"\`
}

type PublicUsersInsert struct {
  Id     *int64  \`json:"id"\`
  Name   *string \`json:"name"\`
  Status *string \`json:"status"\`
}

type PublicUsersUpdate struct {
  Id     *int64  \`json:"id"\`
  Name   *string \`json:"name"\`
  Status *string \`json:"status"\`
}

type PublicTodosSelect struct {
  Details *string \`json:"details"\`
  Id      int64   \`json:"id"\`
  UserId  int64   \`json:"user-id"\`
}

type PublicTodosInsert struct {
  Details *string \`json:"details"\`
  Id      *int64  \`json:"id"\`
  UserId  int64   \`json:"user-id"\`
}

type PublicTodosUpdate struct {
  Details *string \`json:"details"\`
  Id      *int64  \`json:"id"\`
  UserId  *int64  \`json:"user-id"\`
}

type PublicUsersAuditSelect struct {
  CreatedAt     *string     \`json:"created_at"\`
  Id            int64       \`json:"id"\`
  PreviousValue interface{} \`json:"previous_value"\`
  UserId        *int64      \`json:"user_id"\`
}

type PublicUsersAuditInsert struct {
  CreatedAt     *string     \`json:"created_at"\`
  Id            *int64      \`json:"id"\`
  PreviousValue interface{} \`json:"previous_value"\`
  UserId        *int64      \`json:"user_id"\`
}

type PublicUsersAuditUpdate struct {
  CreatedAt     *string     \`json:"created_at"\`
  Id            *int64      \`json:"id"\`
  PreviousValue interface{} \`json:"previous_value"\`
  UserId        *int64      \`json:"user_id"\`
}

type PublicUserDetailsSelect struct {
  Details *string \`json:"details"\`
  UserId  int64   \`json:"user_id"\`
}

type PublicUserDetailsInsert struct {
  Details *string \`json:"details"\`
  UserId  int64   \`json:"user_id"\`
}

type PublicUserDetailsUpdate struct {
  Details *string \`json:"details"\`
  UserId  *int64  \`json:"user_id"\`
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
  Name    *string \`json:"name"\`
  OtherId int64   \`json:"other_id"\`
}

type PublicTableWithPrimaryKeyOtherThanIdInsert struct {
  Name    *string \`json:"name"\`
  OtherId *int64  \`json:"other_id"\`
}

type PublicTableWithPrimaryKeyOtherThanIdUpdate struct {
  Name    *string \`json:"name"\`
  OtherId *int64  \`json:"other_id"\`
}

type PublicCategorySelect struct {
  Id   int32  \`json:"id"\`
  Name string \`json:"name"\`
}

type PublicCategoryInsert struct {
  Id   *int32 \`json:"id"\`
  Name string \`json:"name"\`
}

type PublicCategoryUpdate struct {
  Id   *int32  \`json:"id"\`
  Name *string \`json:"name"\`
}

type PublicMemesSelect struct {
  Category  *int32      \`json:"category"\`
  CreatedAt string      \`json:"created_at"\`
  Id        int32       \`json:"id"\`
  Metadata  interface{} \`json:"metadata"\`
  Name      string      \`json:"name"\`
  Status    *string     \`json:"status"\`
}

type PublicMemesInsert struct {
  Category  *int32      \`json:"category"\`
  CreatedAt string      \`json:"created_at"\`
  Id        *int32      \`json:"id"\`
  Metadata  interface{} \`json:"metadata"\`
  Name      string      \`json:"name"\`
  Status    *string     \`json:"status"\`
}

type PublicMemesUpdate struct {
  Category  *int32      \`json:"category"\`
  CreatedAt *string     \`json:"created_at"\`
  Id        *int32      \`json:"id"\`
  Metadata  interface{} \`json:"metadata"\`
  Name      *string     \`json:"name"\`
  Status    *string     \`json:"status"\`
}

type PublicTodosViewSelect struct {
  Details *string \`json:"details"\`
  Id      *int64  \`json:"id"\`
  UserId  *int64  \`json:"user-id"\`
}

type PublicUsersViewSelect struct {
  Id     *int64  \`json:"id"\`
  Name   *string \`json:"name"\`
  Status *string \`json:"status"\`
}

type PublicAViewSelect struct {
  Id *int64 \`json:"id"\`
}

type PublicUsersViewWithMultipleRefsToUsersSelect struct {
  InitialId   *int64  \`json:"initial_id"\`
  InitialName *string \`json:"initial_name"\`
  SecondId    *int64  \`json:"second_id"\`
  SecondName  *string \`json:"second_name"\`
}

type PublicTodosMatviewSelect struct {
  Details *string \`json:"details"\`
  Id      *int64  \`json:"id"\`
  UserId  *int64  \`json:"user-id"\`
}

type PublicCompositeTypeWithArrayAttribute struct {
  MyTextArray interface{} \`json:"my_text_array"\`
}

type PublicCompositeTypeWithRecordAttribute struct {
  Todo interface{} \`json:"todo"\`
}"
  `)
})

test('typegen: swift', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/swift' })
  expect(body).toMatchInlineSnapshot(`
    "import Foundation
    import Supabase

    internal enum PublicSchema {
      internal enum MemeStatus: String, Codable, Hashable, Sendable {
        case new = "new"
        case old = "old"
        case retired = "retired"
      }
      internal enum UserStatus: String, Codable, Hashable, Sendable {
        case active = "ACTIVE"
        case inactive = "INACTIVE"
      }
      internal struct CategorySelect: Codable, Hashable, Sendable {
        internal let id: Int32
        internal let name: String
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
      }
      internal struct CategoryInsert: Codable, Hashable, Sendable {
        internal let id: Int32?
        internal let name: String
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
      }
      internal struct CategoryUpdate: Codable, Hashable, Sendable {
        internal let id: Int32?
        internal let name: String?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
      }
      internal struct EmptySelect: Codable, Hashable, Sendable {
      }
      internal struct EmptyInsert: Codable, Hashable, Sendable {
      }
      internal struct EmptyUpdate: Codable, Hashable, Sendable {
      }
      internal struct ForeignTableSelect: Codable, Hashable, Sendable {
        internal let id: Int64
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct ForeignTableInsert: Codable, Hashable, Sendable {
        internal let id: Int64
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct ForeignTableUpdate: Codable, Hashable, Sendable {
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct MemesSelect: Codable, Hashable, Sendable {
        internal let category: Int32?
        internal let createdAt: String
        internal let id: Int32
        internal let metadata: AnyJSON?
        internal let name: String
        internal let status: MemeStatus?
        internal enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
      }
      internal struct MemesInsert: Codable, Hashable, Sendable {
        internal let category: Int32?
        internal let createdAt: String
        internal let id: Int32?
        internal let metadata: AnyJSON?
        internal let name: String
        internal let status: MemeStatus?
        internal enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
      }
      internal struct MemesUpdate: Codable, Hashable, Sendable {
        internal let category: Int32?
        internal let createdAt: String?
        internal let id: Int32?
        internal let metadata: AnyJSON?
        internal let name: String?
        internal let status: MemeStatus?
        internal enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
      }
      internal struct TableWithOtherTablesRowTypeSelect: Codable, Hashable, Sendable {
        internal let col1: UserDetailsSelect?
        internal let col2: AViewSelect?
        internal enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
      }
      internal struct TableWithOtherTablesRowTypeInsert: Codable, Hashable, Sendable {
        internal let col1: UserDetailsSelect?
        internal let col2: AViewSelect?
        internal enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
      }
      internal struct TableWithOtherTablesRowTypeUpdate: Codable, Hashable, Sendable {
        internal let col1: UserDetailsSelect?
        internal let col2: AViewSelect?
        internal enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
      }
      internal struct TableWithPrimaryKeyOtherThanIdSelect: Codable, Hashable, Sendable, Identifiable {
        internal var id: Int64 { otherId }
        internal let name: String?
        internal let otherId: Int64
        internal enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
      }
      internal struct TableWithPrimaryKeyOtherThanIdInsert: Codable, Hashable, Sendable, Identifiable {
        internal var id: Int64? { otherId }
        internal let name: String?
        internal let otherId: Int64?
        internal enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
      }
      internal struct TableWithPrimaryKeyOtherThanIdUpdate: Codable, Hashable, Sendable, Identifiable {
        internal var id: Int64? { otherId }
        internal let name: String?
        internal let otherId: Int64?
        internal enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
      }
      internal struct TodosSelect: Codable, Hashable, Sendable, Identifiable {
        internal let details: String?
        internal let id: Int64
        internal let userId: Int64
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      internal struct TodosInsert: Codable, Hashable, Sendable, Identifiable {
        internal let details: String?
        internal let id: Int64?
        internal let userId: Int64
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      internal struct TodosUpdate: Codable, Hashable, Sendable, Identifiable {
        internal let details: String?
        internal let id: Int64?
        internal let userId: Int64?
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      internal struct UserDetailsSelect: Codable, Hashable, Sendable {
        internal let details: String?
        internal let userId: Int64
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
      }
      internal struct UserDetailsInsert: Codable, Hashable, Sendable {
        internal let details: String?
        internal let userId: Int64
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
      }
      internal struct UserDetailsUpdate: Codable, Hashable, Sendable {
        internal let details: String?
        internal let userId: Int64?
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
      }
      internal struct UsersSelect: Codable, Hashable, Sendable, Identifiable {
        internal let id: Int64
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct UsersInsert: Codable, Hashable, Sendable, Identifiable {
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct UsersUpdate: Codable, Hashable, Sendable, Identifiable {
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct UsersAuditSelect: Codable, Hashable, Sendable, Identifiable {
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
      internal struct UsersAuditInsert: Codable, Hashable, Sendable, Identifiable {
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
      internal struct UsersAuditUpdate: Codable, Hashable, Sendable, Identifiable {
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
      internal struct AViewSelect: Codable, Hashable, Sendable {
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
        }
      }
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
      internal struct TodosViewSelect: Codable, Hashable, Sendable {
        internal let details: String?
        internal let id: Int64?
        internal let userId: Int64?
        internal enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      internal struct UsersViewSelect: Codable, Hashable, Sendable {
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct UsersViewWithMultipleRefsToUsersSelect: Codable, Hashable, Sendable {
        internal let initialId: Int64?
        internal let initialName: String?
        internal let secondId: Int64?
        internal let secondName: String?
        internal enum CodingKeys: String, CodingKey {
          case initialId = "initial_id"
          case initialName = "initial_name"
          case secondId = "second_id"
          case secondName = "second_name"
        }
      }
      internal struct CompositeTypeWithArrayAttribute: Codable, Hashable, Sendable {
        internal let MyTextArray: AnyJSON
        internal enum CodingKeys: String, CodingKey {
          case MyTextArray = "my_text_array"
        }
      }
      internal struct CompositeTypeWithRecordAttribute: Codable, Hashable, Sendable {
        internal let Todo: TodosSelect
        internal enum CodingKeys: String, CodingKey {
          case Todo = "todo"
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

    public enum PublicSchema {
      public enum MemeStatus: String, Codable, Hashable, Sendable {
        case new = "new"
        case old = "old"
        case retired = "retired"
      }
      public enum UserStatus: String, Codable, Hashable, Sendable {
        case active = "ACTIVE"
        case inactive = "INACTIVE"
      }
      public struct CategorySelect: Codable, Hashable, Sendable {
        public let id: Int32
        public let name: String
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
      }
      public struct CategoryInsert: Codable, Hashable, Sendable {
        public let id: Int32?
        public let name: String
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
      }
      public struct CategoryUpdate: Codable, Hashable, Sendable {
        public let id: Int32?
        public let name: String?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
        }
      }
      public struct EmptySelect: Codable, Hashable, Sendable {
      }
      public struct EmptyInsert: Codable, Hashable, Sendable {
      }
      public struct EmptyUpdate: Codable, Hashable, Sendable {
      }
      public struct ForeignTableSelect: Codable, Hashable, Sendable {
        public let id: Int64
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct ForeignTableInsert: Codable, Hashable, Sendable {
        public let id: Int64
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct ForeignTableUpdate: Codable, Hashable, Sendable {
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct MemesSelect: Codable, Hashable, Sendable {
        public let category: Int32?
        public let createdAt: String
        public let id: Int32
        public let metadata: AnyJSON?
        public let name: String
        public let status: MemeStatus?
        public enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
      }
      public struct MemesInsert: Codable, Hashable, Sendable {
        public let category: Int32?
        public let createdAt: String
        public let id: Int32?
        public let metadata: AnyJSON?
        public let name: String
        public let status: MemeStatus?
        public enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
      }
      public struct MemesUpdate: Codable, Hashable, Sendable {
        public let category: Int32?
        public let createdAt: String?
        public let id: Int32?
        public let metadata: AnyJSON?
        public let name: String?
        public let status: MemeStatus?
        public enum CodingKeys: String, CodingKey {
          case category = "category"
          case createdAt = "created_at"
          case id = "id"
          case metadata = "metadata"
          case name = "name"
          case status = "status"
        }
      }
      public struct TableWithOtherTablesRowTypeSelect: Codable, Hashable, Sendable {
        public let col1: UserDetailsSelect?
        public let col2: AViewSelect?
        public enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
      }
      public struct TableWithOtherTablesRowTypeInsert: Codable, Hashable, Sendable {
        public let col1: UserDetailsSelect?
        public let col2: AViewSelect?
        public enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
      }
      public struct TableWithOtherTablesRowTypeUpdate: Codable, Hashable, Sendable {
        public let col1: UserDetailsSelect?
        public let col2: AViewSelect?
        public enum CodingKeys: String, CodingKey {
          case col1 = "col1"
          case col2 = "col2"
        }
      }
      public struct TableWithPrimaryKeyOtherThanIdSelect: Codable, Hashable, Sendable, Identifiable {
        public var id: Int64 { otherId }
        public let name: String?
        public let otherId: Int64
        public enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
      }
      public struct TableWithPrimaryKeyOtherThanIdInsert: Codable, Hashable, Sendable, Identifiable {
        public var id: Int64? { otherId }
        public let name: String?
        public let otherId: Int64?
        public enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
      }
      public struct TableWithPrimaryKeyOtherThanIdUpdate: Codable, Hashable, Sendable, Identifiable {
        public var id: Int64? { otherId }
        public let name: String?
        public let otherId: Int64?
        public enum CodingKeys: String, CodingKey {
          case name = "name"
          case otherId = "other_id"
        }
      }
      public struct TodosSelect: Codable, Hashable, Sendable, Identifiable {
        public let details: String?
        public let id: Int64
        public let userId: Int64
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      public struct TodosInsert: Codable, Hashable, Sendable, Identifiable {
        public let details: String?
        public let id: Int64?
        public let userId: Int64
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      public struct TodosUpdate: Codable, Hashable, Sendable, Identifiable {
        public let details: String?
        public let id: Int64?
        public let userId: Int64?
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      public struct UserDetailsSelect: Codable, Hashable, Sendable {
        public let details: String?
        public let userId: Int64
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
      }
      public struct UserDetailsInsert: Codable, Hashable, Sendable {
        public let details: String?
        public let userId: Int64
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
      }
      public struct UserDetailsUpdate: Codable, Hashable, Sendable {
        public let details: String?
        public let userId: Int64?
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case userId = "user_id"
        }
      }
      public struct UsersSelect: Codable, Hashable, Sendable, Identifiable {
        public let id: Int64
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct UsersInsert: Codable, Hashable, Sendable, Identifiable {
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct UsersUpdate: Codable, Hashable, Sendable, Identifiable {
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct UsersAuditSelect: Codable, Hashable, Sendable, Identifiable {
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
      public struct UsersAuditInsert: Codable, Hashable, Sendable, Identifiable {
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
      public struct UsersAuditUpdate: Codable, Hashable, Sendable, Identifiable {
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
      public struct AViewSelect: Codable, Hashable, Sendable {
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
        }
      }
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
      public struct TodosViewSelect: Codable, Hashable, Sendable {
        public let details: String?
        public let id: Int64?
        public let userId: Int64?
        public enum CodingKeys: String, CodingKey {
          case details = "details"
          case id = "id"
          case userId = "user-id"
        }
      }
      public struct UsersViewSelect: Codable, Hashable, Sendable {
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct UsersViewWithMultipleRefsToUsersSelect: Codable, Hashable, Sendable {
        public let initialId: Int64?
        public let initialName: String?
        public let secondId: Int64?
        public let secondName: String?
        public enum CodingKeys: String, CodingKey {
          case initialId = "initial_id"
          case initialName = "initial_name"
          case secondId = "second_id"
          case secondName = "second_name"
        }
      }
      public struct CompositeTypeWithArrayAttribute: Codable, Hashable, Sendable {
        public let MyTextArray: AnyJSON
        public enum CodingKeys: String, CodingKey {
          case MyTextArray = "my_text_array"
        }
      }
      public struct CompositeTypeWithRecordAttribute: Codable, Hashable, Sendable {
        public let Todo: TodosSelect
        public enum CodingKeys: String, CodingKey {
          case Todo = "todo"
        }
      }
    }"
  `)
})
