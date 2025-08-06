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
              test_unnamed_row_scalar: number | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              test_unnamed_row_composite:
                | Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
                | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
            }
            Insert: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              blurb_varchar: string | null
              test_unnamed_view_row: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
          user_todos_summary_view: {
            Row: {
              todo_count: number | null
              todo_details: string[] | null
              user_id: number | null
              user_name: string | null
              user_status: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
          users_view: {
            Row: {
              decimal: number | null
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
            Returns: {
              error: true
            } & "the function public.blurb with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          blurb_varchar:
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
            | {
                Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_is_long with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_length with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_words with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_set_of_rows: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }[]
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          function_returning_single_row: {
            Args: { todos: Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "todos"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_table: {
            Args: never
            Returns: {
              id: number
              name: string
            }[]
          }
          function_returning_table_with_args: {
            Args: { user_id: number }
            Returns: {
              id: number
              name: string
            }[]
          }
          function_using_setof_rows_one: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          function_using_table_returns: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          get_composite_type_data: {
            Args: never
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"][]
            SetofOptions: {
              from: "*"
              to: "composite_type_with_array_attribute"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          get_single_user_summary_from_view:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users_view"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "*"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
          get_todos_from_user:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users_view"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_todos_setof_rows:
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }
            SetofOptions: {
              from: "users"
              to: "users_audit"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_user_ids: { Args: never; Returns: number[] }
          get_user_summary: { Args: never; Returns: Record<string, unknown>[] }
          polymorphic_function: { Args: { "": string }; Returns: undefined }
          polymorphic_function_with_different_return: {
            Args: { "": string }
            Returns: string
          }
          polymorphic_function_with_no_params_or_unnamed:
            | { Args: never; Returns: number }
            | { Args: { "": string }; Returns: string }
          polymorphic_function_with_unnamed_default:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default(), public.polymorphic_function_with_unnamed_default( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_default_overload:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default_overload(), public.polymorphic_function_with_unnamed_default_overload( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_json: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_jsonb: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_text: {
            Args: { "": string }
            Returns: number
          }
          postgres_fdw_disconnect: { Args: { "": string }; Returns: boolean }
          postgres_fdw_disconnect_all: { Args: never; Returns: boolean }
          postgres_fdw_get_connections: {
            Args: never
            Returns: Record<string, unknown>[]
          }
          postgres_fdw_handler: { Args: never; Returns: unknown }
          postgrest_resolvable_with_override_function:
            | { Args: { a: string }; Returns: number }
            | {
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { completed: boolean; todo_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | { Args: { b: number }; Returns: string }
            | { Args: never; Returns: undefined }
          postgrest_unresolvable_function:
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: never; Returns: undefined }
          test_internal_query: { Args: never; Returns: undefined }
          test_unnamed_row_composite: {
            Args: { "": Database["public"]["Tables"]["users"]["Row"] }
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
            SetofOptions: {
              from: "users"
              to: "composite_type_with_array_attribute"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          test_unnamed_row_scalar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.test_unnamed_row_scalar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          test_unnamed_row_setof:
            | {
                Args: { user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          test_unnamed_view_row: {
            Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
            SetofOptions: {
              from: "todos_view"
              to: "todos"
              isOneToOne: false
              isSetofReturn: true
            }
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

    type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

    type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
              test_unnamed_row_scalar: number | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              test_unnamed_row_composite:
                | Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
                | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
            }
            Insert: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              blurb_varchar: string | null
              test_unnamed_view_row: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
          user_todos_summary_view: {
            Row: {
              todo_count: number | null
              todo_details: string[] | null
              user_id: number | null
              user_name: string | null
              user_status: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
          users_view: {
            Row: {
              decimal: number | null
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
            Returns: {
              error: true
            } & "the function public.blurb with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          blurb_varchar:
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
            | {
                Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_is_long with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_length with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_words with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_set_of_rows: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }[]
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          function_returning_single_row: {
            Args: { todos: Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "todos"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_table: {
            Args: never
            Returns: {
              id: number
              name: string
            }[]
          }
          function_returning_table_with_args: {
            Args: { user_id: number }
            Returns: {
              id: number
              name: string
            }[]
          }
          function_using_setof_rows_one: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          function_using_table_returns: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          get_composite_type_data: {
            Args: never
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"][]
            SetofOptions: {
              from: "*"
              to: "composite_type_with_array_attribute"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          get_single_user_summary_from_view:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users_view"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "*"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
          get_todos_from_user:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users_view"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_todos_setof_rows:
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }
            SetofOptions: {
              from: "users"
              to: "users_audit"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_user_ids: { Args: never; Returns: number[] }
          get_user_summary: { Args: never; Returns: Record<string, unknown>[] }
          polymorphic_function: { Args: { "": string }; Returns: undefined }
          polymorphic_function_with_different_return: {
            Args: { "": string }
            Returns: string
          }
          polymorphic_function_with_no_params_or_unnamed:
            | { Args: never; Returns: number }
            | { Args: { "": string }; Returns: string }
          polymorphic_function_with_unnamed_default:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default(), public.polymorphic_function_with_unnamed_default( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_default_overload:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default_overload(), public.polymorphic_function_with_unnamed_default_overload( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_json: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_jsonb: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_text: {
            Args: { "": string }
            Returns: number
          }
          postgres_fdw_disconnect: { Args: { "": string }; Returns: boolean }
          postgres_fdw_disconnect_all: { Args: never; Returns: boolean }
          postgres_fdw_get_connections: {
            Args: never
            Returns: Record<string, unknown>[]
          }
          postgres_fdw_handler: { Args: never; Returns: unknown }
          postgrest_resolvable_with_override_function:
            | { Args: { a: string }; Returns: number }
            | {
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { completed: boolean; todo_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | { Args: { b: number }; Returns: string }
            | { Args: never; Returns: undefined }
          postgrest_unresolvable_function:
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: never; Returns: undefined }
          test_internal_query: { Args: never; Returns: undefined }
          test_unnamed_row_composite: {
            Args: { "": Database["public"]["Tables"]["users"]["Row"] }
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
            SetofOptions: {
              from: "users"
              to: "composite_type_with_array_attribute"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          test_unnamed_row_scalar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.test_unnamed_row_scalar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          test_unnamed_row_setof:
            | {
                Args: { user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          test_unnamed_view_row: {
            Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
            SetofOptions: {
              from: "todos_view"
              to: "todos"
              isOneToOne: false
              isSetofReturn: true
            }
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

    type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

    type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
              test_unnamed_row_scalar: number | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              test_unnamed_row_composite:
                | Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
                | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
            }
            Insert: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              blurb_varchar: string | null
              test_unnamed_view_row: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
          user_todos_summary_view: {
            Row: {
              todo_count: number | null
              todo_details: string[] | null
              user_id: number | null
              user_name: string | null
              user_status: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
          users_view: {
            Row: {
              decimal: number | null
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
            Returns: {
              error: true
            } & "the function public.blurb with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          blurb_varchar:
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
            | {
                Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_is_long with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_length with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_words with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_set_of_rows: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }[]
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          function_returning_single_row: {
            Args: { todos: Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "todos"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_table: {
            Args: never
            Returns: {
              id: number
              name: string
            }[]
          }
          function_returning_table_with_args: {
            Args: { user_id: number }
            Returns: {
              id: number
              name: string
            }[]
          }
          function_using_setof_rows_one: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          function_using_table_returns: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          get_composite_type_data: {
            Args: never
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"][]
            SetofOptions: {
              from: "*"
              to: "composite_type_with_array_attribute"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          get_single_user_summary_from_view:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users_view"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "*"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
          get_todos_from_user:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users_view"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_todos_setof_rows:
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }
            SetofOptions: {
              from: "users"
              to: "users_audit"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_user_ids: { Args: never; Returns: number[] }
          get_user_summary: { Args: never; Returns: Record<string, unknown>[] }
          polymorphic_function: { Args: { "": string }; Returns: undefined }
          polymorphic_function_with_different_return: {
            Args: { "": string }
            Returns: string
          }
          polymorphic_function_with_no_params_or_unnamed:
            | { Args: never; Returns: number }
            | { Args: { "": string }; Returns: string }
          polymorphic_function_with_unnamed_default:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default(), public.polymorphic_function_with_unnamed_default( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_default_overload:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default_overload(), public.polymorphic_function_with_unnamed_default_overload( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_json: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_jsonb: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_text: {
            Args: { "": string }
            Returns: number
          }
          postgres_fdw_disconnect: { Args: { "": string }; Returns: boolean }
          postgres_fdw_disconnect_all: { Args: never; Returns: boolean }
          postgres_fdw_get_connections: {
            Args: never
            Returns: Record<string, unknown>[]
          }
          postgres_fdw_handler: { Args: never; Returns: unknown }
          postgrest_resolvable_with_override_function:
            | { Args: { a: string }; Returns: number }
            | {
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { completed: boolean; todo_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | { Args: { b: number }; Returns: string }
            | { Args: never; Returns: undefined }
          postgrest_unresolvable_function:
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: never; Returns: undefined }
          test_internal_query: { Args: never; Returns: undefined }
          test_unnamed_row_composite: {
            Args: { "": Database["public"]["Tables"]["users"]["Row"] }
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
            SetofOptions: {
              from: "users"
              to: "composite_type_with_array_attribute"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          test_unnamed_row_scalar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.test_unnamed_row_scalar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          test_unnamed_row_setof:
            | {
                Args: { user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          test_unnamed_view_row: {
            Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
            SetofOptions: {
              from: "todos_view"
              to: "todos"
              isOneToOne: false
              isSetofReturn: true
            }
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

    type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

    type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
      // Allows to automatically instantiate createClient with right options
      // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
      __InternalSupabase: {
        PostgrestVersion: "13"
      }
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
              test_unnamed_row_scalar: number | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              test_unnamed_row_composite:
                | Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
                | null
              test_unnamed_row_setof: {
                details: string | null
                id: number
                "user-id": number
              } | null
            }
            Insert: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
              blurb_varchar: string | null
              test_unnamed_view_row: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
                referencedRelation: "user_todos_summary_view"
                referencedColumns: ["user_id"]
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
          user_todos_summary_view: {
            Row: {
              todo_count: number | null
              todo_details: string[] | null
              user_id: number | null
              user_name: string | null
              user_status: Database["public"]["Enums"]["user_status"] | null
            }
            Relationships: []
          }
          users_view: {
            Row: {
              decimal: number | null
              id: number | null
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
            }
            Update: {
              decimal?: number | null
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
            Returns: {
              error: true
            } & "the function public.blurb with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          blurb_varchar:
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
            | {
                Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
                Returns: {
                  error: true
                } & "the function public.blurb_varchar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
              }
          details_is_long: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_is_long with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_length: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_length with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          details_words: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.details_words with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_set_of_rows: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }[]
            SetofOptions: {
              from: "*"
              to: "users"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          function_returning_single_row: {
            Args: { todos: Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
            }
            SetofOptions: {
              from: "todos"
              to: "users"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          function_returning_table: {
            Args: never
            Returns: {
              id: number
              name: string
            }[]
          }
          function_returning_table_with_args: {
            Args: { user_id: number }
            Returns: {
              id: number
              name: string
            }[]
          }
          function_using_setof_rows_one: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          function_using_table_returns: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "users"
              to: "todos"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          get_composite_type_data: {
            Args: never
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"][]
            SetofOptions: {
              from: "*"
              to: "composite_type_with_array_attribute"
              isOneToOne: false
              isSetofReturn: true
            }
          }
          get_single_user_summary_from_view:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users_view"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "users"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  todo_count: number | null
                  todo_details: string[] | null
                  user_id: number | null
                  user_name: string | null
                  user_status: Database["public"]["Enums"]["user_status"] | null
                }
                SetofOptions: {
                  from: "*"
                  to: "user_todos_summary_view"
                  isOneToOne: true
                  isSetofReturn: true
                }
              }
          get_todos_from_user:
            | {
                Args: {
                  userview_row: Database["public"]["Views"]["users_view"]["Row"]
                }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users_view"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { search_user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_todos_setof_rows:
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { todo_row: Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          get_user_audit_setof_single_row: {
            Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
            Returns: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
            }
            SetofOptions: {
              from: "users"
              to: "users_audit"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_user_ids: { Args: never; Returns: number[] }
          get_user_summary: { Args: never; Returns: Record<string, unknown>[] }
          polymorphic_function: { Args: { "": string }; Returns: undefined }
          polymorphic_function_with_different_return: {
            Args: { "": string }
            Returns: string
          }
          polymorphic_function_with_no_params_or_unnamed:
            | { Args: never; Returns: number }
            | { Args: { "": string }; Returns: string }
          polymorphic_function_with_unnamed_default:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default(), public.polymorphic_function_with_unnamed_default( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_default_overload:
            | {
                Args: never
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.polymorphic_function_with_unnamed_default_overload(), public.polymorphic_function_with_unnamed_default_overload( => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: { ""?: string }; Returns: string }
          polymorphic_function_with_unnamed_json: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_jsonb: {
            Args: { "": Json }
            Returns: number
          }
          polymorphic_function_with_unnamed_text: {
            Args: { "": string }
            Returns: number
          }
          postgres_fdw_disconnect: { Args: { "": string }; Returns: boolean }
          postgres_fdw_disconnect_all: { Args: never; Returns: boolean }
          postgres_fdw_get_connections: {
            Args: never
            Returns: Record<string, unknown>[]
          }
          postgres_fdw_handler: { Args: never; Returns: unknown }
          postgrest_resolvable_with_override_function:
            | { Args: { a: string }; Returns: number }
            | {
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { completed: boolean; todo_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | { Args: { b: number }; Returns: string }
            | { Args: never; Returns: undefined }
          postgrest_unresolvable_function:
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | { Args: never; Returns: undefined }
          test_internal_query: { Args: never; Returns: undefined }
          test_unnamed_row_composite: {
            Args: { "": Database["public"]["Tables"]["users"]["Row"] }
            Returns: Database["public"]["CompositeTypes"]["composite_type_with_array_attribute"]
            SetofOptions: {
              from: "users"
              to: "composite_type_with_array_attribute"
              isOneToOne: true
              isSetofReturn: false
            }
          }
          test_unnamed_row_scalar: {
            Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
            Returns: {
              error: true
            } & "the function public.test_unnamed_row_scalar with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          test_unnamed_row_setof:
            | {
                Args: { user_id: number }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "*"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["todos"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "todos"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
            | {
                Args: { "": Database["public"]["Tables"]["users"]["Row"] }
                Returns: {
                  details: string | null
                  id: number
                  "user-id": number
                }[]
                SetofOptions: {
                  from: "users"
                  to: "todos"
                  isOneToOne: false
                  isSetofReturn: true
                }
              }
          test_unnamed_view_row: {
            Args: { "": Database["public"]["Views"]["todos_view"]["Row"] }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }[]
            SetofOptions: {
              from: "todos_view"
              to: "todos"
              isOneToOne: false
              isSetofReturn: true
            }
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

    type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

    type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

    export type Tables<
      DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
    > = DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof DatabaseWithoutInternals },
      EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
    > = DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
      : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

    export type CompositeTypes<
      PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
      CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
      }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
    > = PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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

test('typegen: typescript consistent types definitions orders', async () => {
  // Helper function to clean up test entities
  const cleanupTestEntities = async () => {
    await app.inject({
      method: 'POST',
      path: '/query',
      payload: {
        query: `
          -- Drop materialized views first (depend on views/tables)
          DROP MATERIALIZED VIEW IF EXISTS test_matview_alpha CASCADE;
          DROP MATERIALIZED VIEW IF EXISTS test_matview_beta CASCADE;
          DROP MATERIALIZED VIEW IF EXISTS test_matview_gamma CASCADE;

          -- Drop views (may depend on tables)
          DROP VIEW IF EXISTS test_view_alpha CASCADE;
          DROP VIEW IF EXISTS test_view_beta CASCADE;
          DROP VIEW IF EXISTS test_view_gamma CASCADE;

          -- Drop functions
          DROP FUNCTION IF EXISTS test_func_alpha(integer, text, boolean) CASCADE;
          DROP FUNCTION IF EXISTS test_func_beta(integer, text, boolean) CASCADE;
          DROP FUNCTION IF EXISTS test_func_gamma(integer, text, boolean) CASCADE;

          -- Alternative signatures for functions (different parameter orders)
          DROP FUNCTION IF EXISTS test_func_alpha(text, boolean, integer) CASCADE;
          DROP FUNCTION IF EXISTS test_func_beta(boolean, integer, text) CASCADE;
          DROP FUNCTION IF EXISTS test_func_gamma(boolean, text, integer) CASCADE;

          -- Drop tables
          DROP TABLE IF EXISTS test_table_alpha CASCADE;
          DROP TABLE IF EXISTS test_table_beta CASCADE;
          DROP TABLE IF EXISTS test_table_gamma CASCADE;

          -- Drop types
          DROP TYPE IF EXISTS test_enum_alpha CASCADE;
          DROP TYPE IF EXISTS test_enum_beta CASCADE;
        `,
      },
    })
  }

  // Clean up any existing test entities
  await cleanupTestEntities()

  // === FIRST ROUND: Create entities in order A->B->G with property order 1 ===

  // Create custom types first
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE TYPE test_enum_alpha AS ENUM ('active', 'inactive', 'pending');
        CREATE TYPE test_enum_beta AS ENUM ('high', 'medium', 'low');
      `,
    },
  })

  // Create tables in order: alpha, beta, gamma with specific column orders
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE TABLE test_table_alpha (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          status test_enum_alpha DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE test_table_beta (
          id SERIAL PRIMARY KEY,
          priority test_enum_beta DEFAULT 'medium',
          description TEXT,
          alpha_id INTEGER REFERENCES test_table_alpha(id)
        );

        CREATE TABLE test_table_gamma (
          id SERIAL PRIMARY KEY,
          beta_id INTEGER REFERENCES test_table_beta(id),
          value NUMERIC(10,2),
          is_active BOOLEAN DEFAULT true
        );
      `,
    },
  })

  // Create functions in order: alpha, beta, gamma with specific parameter orders
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE FUNCTION test_func_alpha(param_a integer, param_b text, param_c boolean)
        RETURNS integer AS 'SELECT param_a + 1' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_beta(param_a integer, param_b text, param_c boolean)
        RETURNS text AS 'SELECT param_b || ''_processed''' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_gamma(param_a integer, param_b text, param_c boolean)
        RETURNS boolean AS 'SELECT NOT param_c' LANGUAGE sql IMMUTABLE;
      `,
    },
  })

  // Create views in order: alpha, beta, gamma
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE VIEW test_view_alpha AS
        SELECT id, name, status, created_at FROM test_table_alpha;

        CREATE VIEW test_view_beta AS
        SELECT id, priority, description, alpha_id FROM test_table_beta;

        CREATE VIEW test_view_gamma AS
        SELECT id, beta_id, value, is_active FROM test_table_gamma;
      `,
    },
  })

  // Create materialized views in order: alpha, beta, gamma
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE MATERIALIZED VIEW test_matview_alpha AS
        SELECT id, name, status FROM test_table_alpha;

        CREATE MATERIALIZED VIEW test_matview_beta AS
        SELECT id, priority, description FROM test_table_beta;

        CREATE MATERIALIZED VIEW test_matview_gamma AS
        SELECT id, value, is_active FROM test_table_gamma;
      `,
    },
  })

  // Generate types for first configuration
  const { body: firstCall } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true', postgrest_version: '13' },
  })

  // === SECOND ROUND: Drop and recreate in reverse order G->B->A with different property orders ===

  // Clean up all test entities
  await cleanupTestEntities()

  // Create custom types in reverse order but keep the enum internal ordering (typegen is rightfully dependent on the enum order)
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE TYPE test_enum_beta AS ENUM ('high', 'medium', 'low');
        CREATE TYPE test_enum_alpha AS ENUM ('active', 'inactive', 'pending');
      `,
    },
  })

  // Create tables in reverse order: gamma, beta, alpha with different column orders
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE TABLE test_table_alpha (
          created_at TIMESTAMP DEFAULT NOW(),
          status test_enum_alpha DEFAULT 'active',
          name TEXT NOT NULL,
          id SERIAL PRIMARY KEY
        );

        CREATE TABLE test_table_beta (
          alpha_id INTEGER REFERENCES test_table_alpha(id),
          description TEXT,
          priority test_enum_beta DEFAULT 'medium',
          id SERIAL PRIMARY KEY
        );

        CREATE TABLE test_table_gamma (
          is_active BOOLEAN DEFAULT true,
          value NUMERIC(10,2),
          beta_id INTEGER REFERENCES test_table_beta(id),
          id SERIAL PRIMARY KEY
        );
      `,
    },
  })

  // Create functions in reverse order: gamma, beta, alpha with different parameter orders
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE FUNCTION test_func_gamma(param_c boolean, param_a integer, param_b text)
        RETURNS boolean AS 'SELECT NOT param_c' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_beta(param_b text, param_c boolean, param_a integer)
        RETURNS text AS 'SELECT param_b || ''_processed''' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_alpha(param_c boolean, param_b text, param_a integer)
        RETURNS integer AS 'SELECT param_a + 1' LANGUAGE sql IMMUTABLE;
      `,
    },
  })

  // Create views in reverse order: gamma, beta, alpha
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE VIEW test_view_gamma AS
        SELECT is_active, value, beta_id, id FROM test_table_gamma;

        CREATE VIEW test_view_beta AS
        SELECT alpha_id, description, priority, id FROM test_table_beta;

        CREATE VIEW test_view_alpha AS
        SELECT created_at, status, name, id FROM test_table_alpha;
      `,
    },
  })

  // Create materialized views in reverse order: gamma, beta, alpha
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE MATERIALIZED VIEW test_matview_gamma AS
        SELECT is_active, value, id FROM test_table_gamma;

        CREATE MATERIALIZED VIEW test_matview_beta AS
        SELECT description, priority, id FROM test_table_beta;

        CREATE MATERIALIZED VIEW test_matview_alpha AS
        SELECT status, name, id FROM test_table_alpha;
      `,
    },
  })

  // Generate types for second configuration
  const { body: secondCall } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true', postgrest_version: '13' },
  })

  // Clean up test entities
  await cleanupTestEntities()

  // The generated types should be identical regardless of:
  // 1. Entity creation order (alpha->beta->gamma vs gamma->beta->alpha)
  // 2. Property declaration order (columns, function parameters)
  // 3. Enum value order
  expect(firstCall).toEqual(secondCall)
})

test('typegen: go', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/go' })
  expect(body).toMatchInlineSnapshot(`
    "package database

    type PublicUsersSelect struct {
      Decimal *float64 \`json:"decimal"\`
      Id      int64    \`json:"id"\`
      Name    *string  \`json:"name"\`
      Status  *string  \`json:"status"\`
    }

    type PublicUsersInsert struct {
      Decimal *float64 \`json:"decimal"\`
      Id      *int64   \`json:"id"\`
      Name    *string  \`json:"name"\`
      Status  *string  \`json:"status"\`
    }

    type PublicUsersUpdate struct {
      Decimal *float64 \`json:"decimal"\`
      Id      *int64   \`json:"id"\`
      Name    *string  \`json:"name"\`
      Status  *string  \`json:"status"\`
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

    type PublicAViewSelect struct {
      Id *int64 \`json:"id"\`
    }

    type PublicTodosViewSelect struct {
      Details *string \`json:"details"\`
      Id      *int64  \`json:"id"\`
      UserId  *int64  \`json:"user-id"\`
    }

    type PublicUsersViewSelect struct {
      Decimal *float64 \`json:"decimal"\`
      Id      *int64   \`json:"id"\`
      Name    *string  \`json:"name"\`
      Status  *string  \`json:"status"\`
    }

    type PublicUserTodosSummaryViewSelect struct {
      TodoCount   *int64     \`json:"todo_count"\`
      TodoDetails []*string  \`json:"todo_details"\`
      UserId      *int64     \`json:"user_id"\`
      UserName    *string    \`json:"user_name"\`
      UserStatus  *string    \`json:"user_status"\`
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
        internal let decimal: Decimal?
        internal let id: Int64
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct UsersInsert: Codable, Hashable, Sendable, Identifiable {
        internal let decimal: Decimal?
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      internal struct UsersUpdate: Codable, Hashable, Sendable, Identifiable {
        internal let decimal: Decimal?
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
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
      internal struct UserTodosSummaryViewSelect: Codable, Hashable, Sendable {
        internal let todoCount: Int64?
        internal let todoDetails: [String]?
        internal let userId: Int64?
        internal let userName: String?
        internal let userStatus: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case todoCount = "todo_count"
          case todoDetails = "todo_details"
          case userId = "user_id"
          case userName = "user_name"
          case userStatus = "user_status"
        }
      }
      internal struct UsersViewSelect: Codable, Hashable, Sendable {
        internal let decimal: Decimal?
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
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
        public let decimal: Decimal?
        public let id: Int64
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct UsersInsert: Codable, Hashable, Sendable, Identifiable {
        public let decimal: Decimal?
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
        }
      }
      public struct UsersUpdate: Codable, Hashable, Sendable, Identifiable {
        public let decimal: Decimal?
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
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
      public struct UserTodosSummaryViewSelect: Codable, Hashable, Sendable {
        public let todoCount: Int64?
        public let todoDetails: [String]?
        public let userId: Int64?
        public let userName: String?
        public let userStatus: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case todoCount = "todo_count"
          case todoDetails = "todo_details"
          case userId = "user_id"
          case userName = "user_name"
          case userStatus = "user_status"
        }
      }
      public struct UsersViewSelect: Codable, Hashable, Sendable {
        public let decimal: Decimal?
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
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
