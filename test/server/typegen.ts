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
          events: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
              days_since_event: number | null
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2024: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2025: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
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
          interval_test: {
            Row: {
              duration_optional: string | null
              duration_required: string
              id: number
            }
            Insert: {
              duration_optional?: string | null
              duration_required: string
              id?: number
            }
            Update: {
              duration_optional?: string | null
              duration_required?: string
              id?: number
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
              user_uuid: string | null
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
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Relationships: []
          }
          users_audit: {
            Row: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
              created_ago: number | null
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
              get_todos_by_matview: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
              user_uuid: string | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
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
          add_interval_to_duration: {
            Args: { additional_interval: string; base_duration: string }
            Returns: string
          }
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
          created_ago: {
            Args: { "": Database["public"]["Tables"]["users_audit"]["Row"] }
            Returns: {
              error: true
            } & "the function public.created_ago with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          days_since_event: {
            Args: { "": Database["public"]["Tables"]["events"]["Row"] }
            Returns: {
              error: true
            } & "the function public.days_since_event with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
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
          double_duration: {
            Args: {
              interval_test_row: Database["public"]["Tables"]["interval_test"]["Row"]
            }
            Returns: string
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              user_uuid: string | null
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
              user_uuid: string | null
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
              user_uuid: string | null
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
          get_todos_by_matview: {
            Args: { "": unknown }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "todos_matview"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_todos_from_user:
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
          get_todos_setof_rows:
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
            | { Args: never; Returns: undefined }
            | { Args: { a: string }; Returns: number }
            | { Args: { b: number }; Returns: string }
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
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                  user_uuid: string | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
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
          postgrest_unresolvable_function:
            | { Args: never; Returns: undefined }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
          search_todos_by_details: {
            Args: { search_details: string }
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
          events: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
              days_since_event: number | null
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2024: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2025: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
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
          interval_test: {
            Row: {
              duration_optional: string | null
              duration_required: string
              id: number
            }
            Insert: {
              duration_optional?: string | null
              duration_required: string
              id?: number
            }
            Update: {
              duration_optional?: string | null
              duration_required?: string
              id?: number
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
              user_uuid: string | null
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
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Relationships: []
          }
          users_audit: {
            Row: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
              created_ago: number | null
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
              get_todos_by_matview: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
              user_uuid: string | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
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
          add_interval_to_duration: {
            Args: { additional_interval: string; base_duration: string }
            Returns: string
          }
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
          created_ago: {
            Args: { "": Database["public"]["Tables"]["users_audit"]["Row"] }
            Returns: {
              error: true
            } & "the function public.created_ago with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          days_since_event: {
            Args: { "": Database["public"]["Tables"]["events"]["Row"] }
            Returns: {
              error: true
            } & "the function public.days_since_event with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
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
          double_duration: {
            Args: {
              interval_test_row: Database["public"]["Tables"]["interval_test"]["Row"]
            }
            Returns: string
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              user_uuid: string | null
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
              user_uuid: string | null
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
              user_uuid: string | null
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
          get_todos_by_matview: {
            Args: { "": unknown }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "todos_matview"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_todos_from_user:
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
          get_todos_setof_rows:
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
            | { Args: never; Returns: undefined }
            | { Args: { a: string }; Returns: number }
            | { Args: { b: number }; Returns: string }
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
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                  user_uuid: string | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
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
          postgrest_unresolvable_function:
            | { Args: never; Returns: undefined }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
          search_todos_by_details: {
            Args: { search_details: string }
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
          events: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
              days_since_event: number | null
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2024: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2025: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
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
          interval_test: {
            Row: {
              duration_optional: string | null
              duration_required: string
              id: number
            }
            Insert: {
              duration_optional?: string | null
              duration_required: string
              id?: number
            }
            Update: {
              duration_optional?: string | null
              duration_required?: string
              id?: number
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
              user_uuid: string | null
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
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Relationships: []
          }
          users_audit: {
            Row: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
              created_ago: number | null
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
              get_todos_by_matview: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
              user_uuid: string | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
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
          add_interval_to_duration: {
            Args: { additional_interval: string; base_duration: string }
            Returns: string
          }
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
          created_ago: {
            Args: { "": Database["public"]["Tables"]["users_audit"]["Row"] }
            Returns: {
              error: true
            } & "the function public.created_ago with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          days_since_event: {
            Args: { "": Database["public"]["Tables"]["events"]["Row"] }
            Returns: {
              error: true
            } & "the function public.days_since_event with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
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
          double_duration: {
            Args: {
              interval_test_row: Database["public"]["Tables"]["interval_test"]["Row"]
            }
            Returns: string
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              user_uuid: string | null
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
              user_uuid: string | null
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
              user_uuid: string | null
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
          get_todos_by_matview: {
            Args: { "": unknown }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "todos_matview"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_todos_from_user:
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
          get_todos_setof_rows:
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
            | { Args: never; Returns: undefined }
            | { Args: { a: string }; Returns: number }
            | { Args: { b: number }; Returns: string }
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
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                  user_uuid: string | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
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
          postgrest_unresolvable_function:
            | { Args: never; Returns: undefined }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
          search_todos_by_details: {
            Args: { search_details: string }
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
          events: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
              days_since_event: number | null
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2024: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
            Relationships: []
          }
          events_2025: {
            Row: {
              created_at: string
              data: Json | null
              event_type: string | null
              id: number
            }
            Insert: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id: number
            }
            Update: {
              created_at?: string
              data?: Json | null
              event_type?: string | null
              id?: number
            }
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
          interval_test: {
            Row: {
              duration_optional: string | null
              duration_required: string
              id: number
            }
            Insert: {
              duration_optional?: string | null
              duration_required: string
              id?: number
            }
            Update: {
              duration_optional?: string | null
              duration_required?: string
              id?: number
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
              user_uuid: string | null
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
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Relationships: []
          }
          users_audit: {
            Row: {
              created_at: string | null
              id: number
              previous_value: Json | null
              user_id: number | null
              created_ago: number | null
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
              get_todos_by_matview: {
                details: string | null
                id: number
                "user-id": number
              } | null
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
              user_uuid: string | null
            }
            Insert: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
            }
            Update: {
              decimal?: number | null
              id?: number | null
              name?: string | null
              status?: Database["public"]["Enums"]["user_status"] | null
              user_uuid?: string | null
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
          add_interval_to_duration: {
            Args: { additional_interval: string; base_duration: string }
            Returns: string
          }
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
          created_ago: {
            Args: { "": Database["public"]["Tables"]["users_audit"]["Row"] }
            Returns: {
              error: true
            } & "the function public.created_ago with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
          }
          days_since_event: {
            Args: { "": Database["public"]["Tables"]["events"]["Row"] }
            Returns: {
              error: true
            } & "the function public.days_since_event with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
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
          double_duration: {
            Args: {
              interval_test_row: Database["public"]["Tables"]["interval_test"]["Row"]
            }
            Returns: string
          }
          function_returning_row: {
            Args: never
            Returns: {
              decimal: number | null
              id: number
              name: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              user_uuid: string | null
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
              user_uuid: string | null
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
              user_uuid: string | null
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
          get_todos_by_matview: {
            Args: { "": unknown }
            Returns: {
              details: string | null
              id: number
              "user-id": number
            }
            SetofOptions: {
              from: "todos_matview"
              to: "todos"
              isOneToOne: true
              isSetofReturn: true
            }
          }
          get_todos_from_user:
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
          get_todos_setof_rows:
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
            | { Args: never; Returns: undefined }
            | { Args: { a: string }; Returns: number }
            | { Args: { b: number }; Returns: string }
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
                Args: { user_id: number }
                Returns: {
                  decimal: number | null
                  id: number
                  name: string | null
                  status: Database["public"]["Enums"]["user_status"] | null
                  user_uuid: string | null
                }[]
                SetofOptions: {
                  from: "*"
                  to: "users"
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
          postgrest_unresolvable_function:
            | { Args: never; Returns: undefined }
            | {
                Args: { a: number }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
            | {
                Args: { a: string }
                Returns: {
                  error: true
                } & "Could not choose the best candidate function between: public.postgrest_unresolvable_function(a => int4), public.postgrest_unresolvable_function(a => text). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
              }
          search_todos_by_details: {
            Args: { search_details: string }
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
          DROP FUNCTION IF EXISTS test_func_alpha_2(boolean, text, integer) CASCADE;
          DROP FUNCTION IF EXISTS test_func_beta_2(text, boolean, integer) CASCADE;
          DROP FUNCTION IF EXISTS test_func_gamma_2(boolean, integer, text) CASCADE;

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

  // Create functions in reverse order: gamma, beta, alpha with same parameter orders
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE FUNCTION test_func_gamma(param_a integer, param_b text, param_c boolean)
        RETURNS boolean AS 'SELECT NOT param_c' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_beta(param_a integer, param_b text, param_c boolean)
        RETURNS text AS 'SELECT param_b || ''_processed''' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_alpha(param_a integer, param_b text, param_c boolean)
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

test('typegen: typescript function override order stability', async () => {
  // Helper function to clean up test entities
  const cleanupTestEntities = async () => {
    await app.inject({
      method: 'POST',
      path: '/query',
      payload: {
        query: `
          -- Drop functions with all possible signatures
          DROP FUNCTION IF EXISTS test_func_override(integer, text) CASCADE;
          DROP FUNCTION IF EXISTS test_func_override(text, integer) CASCADE;
          DROP FUNCTION IF EXISTS test_func_override(boolean, integer, text) CASCADE;
          DROP FUNCTION IF EXISTS test_func_override(text, boolean) CASCADE;
        `,
      },
    })
  }

  // Clean up any existing test entities
  await cleanupTestEntities()

  // === FIRST ROUND: Create function overrides in order 1 ===
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        -- Create function overrides in specific order
        CREATE FUNCTION test_func_override(param_a integer, param_b text)
        RETURNS integer AS 'SELECT param_a + 1' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_override(param_a text, param_b integer)
        RETURNS text AS 'SELECT param_a || param_b::text' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_override(param_a boolean, param_b integer, param_c text)
        RETURNS boolean AS 'SELECT param_a' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_override(param_a text, param_b boolean)
        RETURNS text AS 'SELECT CASE WHEN param_b THEN param_a ELSE '''' END' LANGUAGE sql IMMUTABLE;
      `,
    },
  })

  // Generate types for first configuration
  const { body: firstCall } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true', postgrest_version: '13' },
  })

  // === SECOND ROUND: Modify function definitions without changing signatures ===
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        -- Modify function definitions (using CREATE OR REPLACE)
        -- This should preserve the order
        CREATE OR REPLACE FUNCTION test_func_override(param_a integer, param_b text)
        RETURNS integer AS 'SELECT param_a + 100' LANGUAGE sql IMMUTABLE;

        CREATE OR REPLACE FUNCTION test_func_override(param_a text, param_b integer)
        RETURNS text AS 'SELECT param_a || ''_'' || param_b::text' LANGUAGE sql IMMUTABLE;

        CREATE OR REPLACE FUNCTION test_func_override(param_a boolean, param_b integer, param_c text)
        RETURNS boolean AS 'SELECT NOT param_a' LANGUAGE sql IMMUTABLE;

        CREATE OR REPLACE FUNCTION test_func_override(param_a text, param_b boolean)
        RETURNS text AS 'SELECT CASE WHEN param_b THEN param_a || ''_true'' ELSE ''false'' END' LANGUAGE sql IMMUTABLE;
      `,
    },
  })

  // Generate types for second configuration (after modifying definitions)
  const { body: secondCall } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true', postgrest_version: '13' },
  })

  // === THIRD ROUND: Drop and recreate in different order ===
  await cleanupTestEntities()

  // Create functions in reverse order
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        -- Create function overrides in reverse order
        CREATE FUNCTION test_func_override(param_a text, param_b boolean)
        RETURNS text AS 'SELECT CASE WHEN param_b THEN param_a ELSE '''' END' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_override(param_a boolean, param_b integer, param_c text)
        RETURNS boolean AS 'SELECT param_a' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_override(param_a text, param_b integer)
        RETURNS text AS 'SELECT param_a || param_b::text' LANGUAGE sql IMMUTABLE;

        CREATE FUNCTION test_func_override(param_a integer, param_b text)
        RETURNS integer AS 'SELECT param_a + 1' LANGUAGE sql IMMUTABLE;
      `,
    },
  })

  // Generate types for third configuration (recreated in different order)
  const { body: thirdCall } = await app.inject({
    method: 'GET',
    path: '/generators/typescript',
    query: { detect_one_to_one_relationships: 'true', postgrest_version: '13' },
  })

  // Clean up test entities
  await cleanupTestEntities()

  expect(firstCall).toEqual(secondCall)
  expect(secondCall).toEqual(thirdCall)
})

test('typegen: go', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/go' })
  expect(body).toMatchInlineSnapshot(`
    "package database

    type PublicUsersSelect struct {
      Decimal  *float64 \`json:"decimal"\`
      Id       int64    \`json:"id"\`
      Name     *string  \`json:"name"\`
      Status   *string  \`json:"status"\`
      UserUuid *string  \`json:"user_uuid"\`
    }

    type PublicUsersInsert struct {
      Decimal  *float64 \`json:"decimal"\`
      Id       *int64   \`json:"id"\`
      Name     *string  \`json:"name"\`
      Status   *string  \`json:"status"\`
      UserUuid *string  \`json:"user_uuid"\`
    }

    type PublicUsersUpdate struct {
      Decimal  *float64 \`json:"decimal"\`
      Id       *int64   \`json:"id"\`
      Name     *string  \`json:"name"\`
      Status   *string  \`json:"status"\`
      UserUuid *string  \`json:"user_uuid"\`
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

    type PublicEventsSelect struct {
      CreatedAt string      \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        int64       \`json:"id"\`
    }

    type PublicEventsInsert struct {
      CreatedAt *string     \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        *int64      \`json:"id"\`
    }

    type PublicEventsUpdate struct {
      CreatedAt *string     \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        *int64      \`json:"id"\`
    }

    type PublicEvents2024Select struct {
      CreatedAt string      \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        int64       \`json:"id"\`
    }

    type PublicEvents2024Insert struct {
      CreatedAt *string     \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        int64       \`json:"id"\`
    }

    type PublicEvents2024Update struct {
      CreatedAt *string     \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        *int64      \`json:"id"\`
    }

    type PublicEvents2025Select struct {
      CreatedAt string      \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        int64       \`json:"id"\`
    }

    type PublicEvents2025Insert struct {
      CreatedAt *string     \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        int64       \`json:"id"\`
    }

    type PublicEvents2025Update struct {
      CreatedAt *string     \`json:"created_at"\`
      Data      interface{} \`json:"data"\`
      EventType *string     \`json:"event_type"\`
      Id        *int64      \`json:"id"\`
    }

    type PublicIntervalTestSelect struct {
      DurationOptional interface{} \`json:"duration_optional"\`
      DurationRequired interface{} \`json:"duration_required"\`
      Id               int64       \`json:"id"\`
    }

    type PublicIntervalTestInsert struct {
      DurationOptional interface{} \`json:"duration_optional"\`
      DurationRequired interface{} \`json:"duration_required"\`
      Id               *int64      \`json:"id"\`
    }

    type PublicIntervalTestUpdate struct {
      DurationOptional interface{} \`json:"duration_optional"\`
      DurationRequired interface{} \`json:"duration_required"\`
      Id               *int64      \`json:"id"\`
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
      Decimal  *float64 \`json:"decimal"\`
      Id       *int64   \`json:"id"\`
      Name     *string  \`json:"name"\`
      Status   *string  \`json:"status"\`
      UserUuid *string  \`json:"user_uuid"\`
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
      internal struct EventsSelect: Codable, Hashable, Sendable, Identifiable {
        internal let createdAt: String
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct EventsInsert: Codable, Hashable, Sendable, Identifiable {
        internal let createdAt: String?
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct EventsUpdate: Codable, Hashable, Sendable, Identifiable {
        internal let createdAt: String?
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct Events2024Select: Codable, Hashable, Sendable {
        internal let createdAt: String
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct Events2024Insert: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct Events2024Update: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct Events2025Select: Codable, Hashable, Sendable {
        internal let createdAt: String
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct Events2025Insert: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      internal struct Events2025Update: Codable, Hashable, Sendable {
        internal let createdAt: String?
        internal let data: AnyJSON?
        internal let eventType: String?
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
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
      internal struct IntervalTestSelect: Codable, Hashable, Sendable, Identifiable {
        internal let durationOptional: IntervalSelect?
        internal let durationRequired: IntervalSelect
        internal let id: Int64
        internal enum CodingKeys: String, CodingKey {
          case durationOptional = "duration_optional"
          case durationRequired = "duration_required"
          case id = "id"
        }
      }
      internal struct IntervalTestInsert: Codable, Hashable, Sendable, Identifiable {
        internal let durationOptional: IntervalSelect?
        internal let durationRequired: IntervalSelect
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case durationOptional = "duration_optional"
          case durationRequired = "duration_required"
          case id = "id"
        }
      }
      internal struct IntervalTestUpdate: Codable, Hashable, Sendable, Identifiable {
        internal let durationOptional: IntervalSelect?
        internal let durationRequired: IntervalSelect?
        internal let id: Int64?
        internal enum CodingKeys: String, CodingKey {
          case durationOptional = "duration_optional"
          case durationRequired = "duration_required"
          case id = "id"
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
        internal let userUuid: UUID?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
        }
      }
      internal struct UsersInsert: Codable, Hashable, Sendable, Identifiable {
        internal let decimal: Decimal?
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal let userUuid: UUID?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
        }
      }
      internal struct UsersUpdate: Codable, Hashable, Sendable, Identifiable {
        internal let decimal: Decimal?
        internal let id: Int64?
        internal let name: String?
        internal let status: UserStatus?
        internal let userUuid: UUID?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
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
        internal let userUuid: UUID?
        internal enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
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
      public struct EventsSelect: Codable, Hashable, Sendable, Identifiable {
        public let createdAt: String
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct EventsInsert: Codable, Hashable, Sendable, Identifiable {
        public let createdAt: String?
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct EventsUpdate: Codable, Hashable, Sendable, Identifiable {
        public let createdAt: String?
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct Events2024Select: Codable, Hashable, Sendable {
        public let createdAt: String
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct Events2024Insert: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct Events2024Update: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct Events2025Select: Codable, Hashable, Sendable {
        public let createdAt: String
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct Events2025Insert: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
      }
      public struct Events2025Update: Codable, Hashable, Sendable {
        public let createdAt: String?
        public let data: AnyJSON?
        public let eventType: String?
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case createdAt = "created_at"
          case data = "data"
          case eventType = "event_type"
          case id = "id"
        }
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
      public struct IntervalTestSelect: Codable, Hashable, Sendable, Identifiable {
        public let durationOptional: IntervalSelect?
        public let durationRequired: IntervalSelect
        public let id: Int64
        public enum CodingKeys: String, CodingKey {
          case durationOptional = "duration_optional"
          case durationRequired = "duration_required"
          case id = "id"
        }
      }
      public struct IntervalTestInsert: Codable, Hashable, Sendable, Identifiable {
        public let durationOptional: IntervalSelect?
        public let durationRequired: IntervalSelect
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case durationOptional = "duration_optional"
          case durationRequired = "duration_required"
          case id = "id"
        }
      }
      public struct IntervalTestUpdate: Codable, Hashable, Sendable, Identifiable {
        public let durationOptional: IntervalSelect?
        public let durationRequired: IntervalSelect?
        public let id: Int64?
        public enum CodingKeys: String, CodingKey {
          case durationOptional = "duration_optional"
          case durationRequired = "duration_required"
          case id = "id"
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
        public let userUuid: UUID?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
        }
      }
      public struct UsersInsert: Codable, Hashable, Sendable, Identifiable {
        public let decimal: Decimal?
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public let userUuid: UUID?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
        }
      }
      public struct UsersUpdate: Codable, Hashable, Sendable, Identifiable {
        public let decimal: Decimal?
        public let id: Int64?
        public let name: String?
        public let status: UserStatus?
        public let userUuid: UUID?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
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
        public let userUuid: UUID?
        public enum CodingKeys: String, CodingKey {
          case decimal = "decimal"
          case id = "id"
          case name = "name"
          case status = "status"
          case userUuid = "user_uuid"
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

test('typegen: python', async () => {
  const { body } = await app.inject({
    method: 'GET',
    path: '/generators/python',
    query: { access_control: 'public' },
  })
  expect(body).toMatchInlineSnapshot(`
    "from __future__ import annotations

    import datetime
    import uuid
    from typing import (
        Annotated,
        Any,
        List,
        Literal,
        NotRequired,
        Optional,
        TypeAlias,
        TypedDict,
    )

    from pydantic import BaseModel, Field, Json

    PublicUserStatus: TypeAlias = Literal["ACTIVE", "INACTIVE"]

    PublicMemeStatus: TypeAlias = Literal["new", "old", "retired"]

    class PublicUsers(BaseModel):
        decimal: Optional[float] = Field(alias="decimal")
        id: int = Field(alias="id")
        name: Optional[str] = Field(alias="name")
        status: Optional[PublicUserStatus] = Field(alias="status")
        user_uuid: Optional[uuid.UUID] = Field(alias="user_uuid")

    class PublicUsersInsert(TypedDict):
        decimal: NotRequired[Annotated[float, Field(alias="decimal")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        name: NotRequired[Annotated[str, Field(alias="name")]]
        status: NotRequired[Annotated[PublicUserStatus, Field(alias="status")]]
        user_uuid: NotRequired[Annotated[uuid.UUID, Field(alias="user_uuid")]]

    class PublicUsersUpdate(TypedDict):
        decimal: NotRequired[Annotated[float, Field(alias="decimal")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        name: NotRequired[Annotated[str, Field(alias="name")]]
        status: NotRequired[Annotated[PublicUserStatus, Field(alias="status")]]
        user_uuid: NotRequired[Annotated[uuid.UUID, Field(alias="user_uuid")]]

    class PublicTodos(BaseModel):
        details: Optional[str] = Field(alias="details")
        id: int = Field(alias="id")
        user_id: int = Field(alias="user-id")

    class PublicTodosInsert(TypedDict):
        details: NotRequired[Annotated[str, Field(alias="details")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        user_id: Annotated[int, Field(alias="user-id")]

    class PublicTodosUpdate(TypedDict):
        details: NotRequired[Annotated[str, Field(alias="details")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        user_id: NotRequired[Annotated[int, Field(alias="user-id")]]

    class PublicUsersAudit(BaseModel):
        created_at: Optional[datetime.datetime] = Field(alias="created_at")
        id: int = Field(alias="id")
        previous_value: Optional[Json[Any]] = Field(alias="previous_value")
        user_id: Optional[int] = Field(alias="user_id")

    class PublicUsersAuditInsert(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        previous_value: NotRequired[Annotated[Json[Any], Field(alias="previous_value")]]
        user_id: NotRequired[Annotated[int, Field(alias="user_id")]]

    class PublicUsersAuditUpdate(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        previous_value: NotRequired[Annotated[Json[Any], Field(alias="previous_value")]]
        user_id: NotRequired[Annotated[int, Field(alias="user_id")]]

    class PublicUserDetails(BaseModel):
        details: Optional[str] = Field(alias="details")
        user_id: int = Field(alias="user_id")

    class PublicUserDetailsInsert(TypedDict):
        details: NotRequired[Annotated[str, Field(alias="details")]]
        user_id: Annotated[int, Field(alias="user_id")]

    class PublicUserDetailsUpdate(TypedDict):
        details: NotRequired[Annotated[str, Field(alias="details")]]
        user_id: NotRequired[Annotated[int, Field(alias="user_id")]]

    class PublicEmpty(BaseModel):
        pass

    class PublicEmptyInsert(TypedDict):
        pass

    class PublicEmptyUpdate(TypedDict):
        pass

    class PublicTableWithOtherTablesRowType(BaseModel):
        col1: Optional[PublicUserDetails] = Field(alias="col1")
        col2: Optional[PublicAView] = Field(alias="col2")

    class PublicTableWithOtherTablesRowTypeInsert(TypedDict):
        col1: NotRequired[Annotated[PublicUserDetails, Field(alias="col1")]]
        col2: NotRequired[Annotated[PublicAView, Field(alias="col2")]]

    class PublicTableWithOtherTablesRowTypeUpdate(TypedDict):
        col1: NotRequired[Annotated[PublicUserDetails, Field(alias="col1")]]
        col2: NotRequired[Annotated[PublicAView, Field(alias="col2")]]

    class PublicTableWithPrimaryKeyOtherThanId(BaseModel):
        name: Optional[str] = Field(alias="name")
        other_id: int = Field(alias="other_id")

    class PublicTableWithPrimaryKeyOtherThanIdInsert(TypedDict):
        name: NotRequired[Annotated[str, Field(alias="name")]]
        other_id: NotRequired[Annotated[int, Field(alias="other_id")]]

    class PublicTableWithPrimaryKeyOtherThanIdUpdate(TypedDict):
        name: NotRequired[Annotated[str, Field(alias="name")]]
        other_id: NotRequired[Annotated[int, Field(alias="other_id")]]

    class PublicEvents(BaseModel):
        created_at: datetime.datetime = Field(alias="created_at")
        data: Optional[Json[Any]] = Field(alias="data")
        event_type: Optional[str] = Field(alias="event_type")
        id: int = Field(alias="id")

    class PublicEventsInsert(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        data: NotRequired[Annotated[Json[Any], Field(alias="data")]]
        event_type: NotRequired[Annotated[str, Field(alias="event_type")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]

    class PublicEventsUpdate(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        data: NotRequired[Annotated[Json[Any], Field(alias="data")]]
        event_type: NotRequired[Annotated[str, Field(alias="event_type")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]

    class PublicEvents2024(BaseModel):
        created_at: datetime.datetime = Field(alias="created_at")
        data: Optional[Json[Any]] = Field(alias="data")
        event_type: Optional[str] = Field(alias="event_type")
        id: int = Field(alias="id")

    class PublicEvents2024Insert(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        data: NotRequired[Annotated[Json[Any], Field(alias="data")]]
        event_type: NotRequired[Annotated[str, Field(alias="event_type")]]
        id: Annotated[int, Field(alias="id")]

    class PublicEvents2024Update(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        data: NotRequired[Annotated[Json[Any], Field(alias="data")]]
        event_type: NotRequired[Annotated[str, Field(alias="event_type")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]

    class PublicEvents2025(BaseModel):
        created_at: datetime.datetime = Field(alias="created_at")
        data: Optional[Json[Any]] = Field(alias="data")
        event_type: Optional[str] = Field(alias="event_type")
        id: int = Field(alias="id")

    class PublicEvents2025Insert(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        data: NotRequired[Annotated[Json[Any], Field(alias="data")]]
        event_type: NotRequired[Annotated[str, Field(alias="event_type")]]
        id: Annotated[int, Field(alias="id")]

    class PublicEvents2025Update(TypedDict):
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        data: NotRequired[Annotated[Json[Any], Field(alias="data")]]
        event_type: NotRequired[Annotated[str, Field(alias="event_type")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]

    class PublicIntervalTest(BaseModel):
        duration_optional: Optional[str] = Field(alias="duration_optional")
        duration_required: str = Field(alias="duration_required")
        id: int = Field(alias="id")

    class PublicIntervalTestInsert(TypedDict):
        duration_optional: NotRequired[Annotated[str, Field(alias="duration_optional")]]
        duration_required: Annotated[str, Field(alias="duration_required")]
        id: NotRequired[Annotated[int, Field(alias="id")]]

    class PublicIntervalTestUpdate(TypedDict):
        duration_optional: NotRequired[Annotated[str, Field(alias="duration_optional")]]
        duration_required: NotRequired[Annotated[str, Field(alias="duration_required")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]

    class PublicCategory(BaseModel):
        id: int = Field(alias="id")
        name: str = Field(alias="name")

    class PublicCategoryInsert(TypedDict):
        id: NotRequired[Annotated[int, Field(alias="id")]]
        name: Annotated[str, Field(alias="name")]

    class PublicCategoryUpdate(TypedDict):
        id: NotRequired[Annotated[int, Field(alias="id")]]
        name: NotRequired[Annotated[str, Field(alias="name")]]

    class PublicMemes(BaseModel):
        category: Optional[int] = Field(alias="category")
        created_at: datetime.datetime = Field(alias="created_at")
        id: int = Field(alias="id")
        metadata: Optional[Json[Any]] = Field(alias="metadata")
        name: str = Field(alias="name")
        status: Optional[PublicMemeStatus] = Field(alias="status")

    class PublicMemesInsert(TypedDict):
        category: NotRequired[Annotated[int, Field(alias="category")]]
        created_at: Annotated[datetime.datetime, Field(alias="created_at")]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        metadata: NotRequired[Annotated[Json[Any], Field(alias="metadata")]]
        name: Annotated[str, Field(alias="name")]
        status: NotRequired[Annotated[PublicMemeStatus, Field(alias="status")]]

    class PublicMemesUpdate(TypedDict):
        category: NotRequired[Annotated[int, Field(alias="category")]]
        created_at: NotRequired[Annotated[datetime.datetime, Field(alias="created_at")]]
        id: NotRequired[Annotated[int, Field(alias="id")]]
        metadata: NotRequired[Annotated[Json[Any], Field(alias="metadata")]]
        name: NotRequired[Annotated[str, Field(alias="name")]]
        status: NotRequired[Annotated[PublicMemeStatus, Field(alias="status")]]

    class PublicAView(BaseModel):
        id: Optional[int] = Field(alias="id")

    class PublicTodosView(BaseModel):
        details: Optional[str] = Field(alias="details")
        id: Optional[int] = Field(alias="id")
        user_id: Optional[int] = Field(alias="user-id")

    class PublicUsersView(BaseModel):
        decimal: Optional[float] = Field(alias="decimal")
        id: Optional[int] = Field(alias="id")
        name: Optional[str] = Field(alias="name")
        status: Optional[PublicUserStatus] = Field(alias="status")
        user_uuid: Optional[uuid.UUID] = Field(alias="user_uuid")

    class PublicUserTodosSummaryView(BaseModel):
        todo_count: Optional[int] = Field(alias="todo_count")
        todo_details: Optional[List[str]] = Field(alias="todo_details")
        user_id: Optional[int] = Field(alias="user_id")
        user_name: Optional[str] = Field(alias="user_name")
        user_status: Optional[PublicUserStatus] = Field(alias="user_status")

    class PublicUsersViewWithMultipleRefsToUsers(BaseModel):
        initial_id: Optional[int] = Field(alias="initial_id")
        initial_name: Optional[str] = Field(alias="initial_name")
        second_id: Optional[int] = Field(alias="second_id")
        second_name: Optional[str] = Field(alias="second_name")

    class PublicTodosMatview(BaseModel):
        details: Optional[str] = Field(alias="details")
        id: Optional[int] = Field(alias="id")
        user_id: Optional[int] = Field(alias="user-id")

    class PublicCompositeTypeWithArrayAttribute(BaseModel):
        my_text_array: List[str] = Field(alias="my_text_array")

    class PublicCompositeTypeWithRecordAttribute(BaseModel):
        todo: PublicTodos = Field(alias="todo")"
  `)
})

test('typegen: python w/ excluded/included schemas', async () => {
  // Create a test schema with some tables
  await app.inject({
    method: 'POST',
    path: '/query',
    payload: {
      query: `
        CREATE SCHEMA IF NOT EXISTS test_schema;
        CREATE TABLE IF NOT EXISTS test_schema.test_table (
          id serial PRIMARY KEY,
          name text
        );
        CREATE TABLE IF NOT EXISTS test_schema.another_table (
          id serial PRIMARY KEY,
          value text
        );
      `,
    },
  })

  try {
    // Test excluded_schemas - should exclude test_schema
    const { body: excludedBody } = await app.inject({
      method: 'GET',
      path: '/generators/python',
      query: { access_control: 'public', excluded_schemas: 'test_schema' },
    })
    expect(excludedBody).not.toContain('TestSchemaTestTable')
    expect(excludedBody).not.toContain('TestSchemaAnotherTable')
    expect(excludedBody).toContain('PublicUsers')
    expect(excludedBody).toContain('PublicTodos')

    // Test included_schemas - should only include test_schema
    const { body: includedBody } = await app.inject({
      method: 'GET',
      path: '/generators/python',
      query: { access_control: 'public', included_schemas: 'test_schema' },
    })
    expect(includedBody).toContain('TestSchemaTestTable')
    expect(includedBody).toContain('TestSchemaAnotherTable')
    expect(includedBody).not.toContain('PublicUsers')
    expect(includedBody).not.toContain('PublicTodos')

    // Test multiple excluded schemas
    const { body: multipleExcludedBody } = await app.inject({
      method: 'GET',
      path: '/generators/python',
      query: { access_control: 'public', excluded_schemas: 'test_schema,public' },
    })
    expect(multipleExcludedBody).not.toContain('TestSchemaTestTable')
    expect(multipleExcludedBody).not.toContain('PublicUsers')

    // // Test multiple included schemas
    const { body: multipleIncludedBody } = await app.inject({
      method: 'GET',
      path: '/generators/python',
      query: { access_control: 'public', included_schemas: 'public,test_schema' },
    })
    expect(multipleIncludedBody).toContain('TestSchemaTestTable')
    expect(multipleIncludedBody).toContain('PublicUsers')
  } finally {
    // Clean up test schema
    await app.inject({
      method: 'POST',
      path: '/query',
      payload: {
        query: `
          DROP SCHEMA IF EXISTS test_schema CASCADE;
        `,
      },
    })
  }
})

test('typegen: dart', async () => {
  const { body } = await app.inject({ method: 'GET', path: '/generators/dart' })
  expect(body).toMatchInlineSnapshot(`"abstract class JsonSerializable {
      Map<String, dynamic> toJson();

      // We can't declare a constructor in an interface, but we can declare
      // a factory constructor that implementing classes must provide
      factory JsonSerializable.fromJson(Map<String, dynamic> json) {
        throw UnimplementedError();
      }
    }

    enum PublicUserStatus {
      active,
      inactive;

      String toJson() {
        switch(this) {
         case PublicUserStatus.active:
            return 'ACTIVE';
         case PublicUserStatus.inactive:
            return 'INACTIVE';
        }
      }

      factory PublicUserStatus.fromJson(String name) {
        switch(name) {
         case 'ACTIVE':
            return PublicUserStatus.active;
         case 'INACTIVE':
            return PublicUserStatus.inactive;
        }
        throw ArgumentError.value(name, "name", "No enum value with that name");
      }
    }


    enum PublicMemeStatus {
      _new,
      old,
      retired;

      String toJson() {
        switch(this) {
         case PublicMemeStatus._new:
            return 'new';
         case PublicMemeStatus.old:
            return 'old';
         case PublicMemeStatus.retired:
            return 'retired';
        }
      }

      factory PublicMemeStatus.fromJson(String name) {
        switch(name) {
         case 'new':
            return PublicMemeStatus._new;
         case 'old':
            return PublicMemeStatus.old;
         case 'retired':
            return PublicMemeStatus.retired;
        }
        throw ArgumentError.value(name, "name", "No enum value with that name");
      }
    }


    class PublicUsersSelect implements JsonSerializable {
      static const tableName = 'users';
  
      final double? decimal;
      final int id;
      final String? name;
      final PublicUserStatus? status;

      const PublicUsersSelect({
        this.decimal,
        required this.id,
        this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) => {
        if (decimal != null) 'decimal': decimal,
        if (id != null) 'id': id,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        decimal: decimal,
        id: id,
        name: name,
        status: status
      );

      @override
      factory PublicUsersSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersSelect(
          decimal: jsonObject['decimal'] == null ? null : jsonObject['decimal'] as double,
          id: jsonObject['id'] as int,
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicUserStatus.fromJson(jsonObject['status'])
        );
      }

      PublicUsersSelect copyWith({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) {
        return PublicUsersSelect(
          decimal: decimal ?? this.decimal,
          id: id ?? this.id,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }
    class PublicUsersInsert implements JsonSerializable {
      static const tableName = 'users';
  
      final double? decimal;
      final int? id;
      final String? name;
      final PublicUserStatus? status;

      const PublicUsersInsert({
        this.decimal,
        this.id,
        this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) => {
        if (decimal != null) 'decimal': decimal,
        if (id != null) 'id': id,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        decimal: decimal,
        id: id,
        name: name,
        status: status
      );

      @override
      factory PublicUsersInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersInsert(
          decimal: jsonObject['decimal'] == null ? null : jsonObject['decimal'] as double,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicUserStatus.fromJson(jsonObject['status'])
        );
      }

      PublicUsersInsert copyWith({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) {
        return PublicUsersInsert(
          decimal: decimal ?? this.decimal,
          id: id ?? this.id,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }
    class PublicUsersUpdate implements JsonSerializable {
      static const tableName = 'users';
  
      final double? decimal;
      final int? id;
      final String? name;
      final PublicUserStatus? status;

      const PublicUsersUpdate({
        this.decimal,
        this.id,
        this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) => {
        if (decimal != null) 'decimal': decimal,
        if (id != null) 'id': id,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        decimal: decimal,
        id: id,
        name: name,
        status: status
      );

      @override
      factory PublicUsersUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersUpdate(
          decimal: jsonObject['decimal'] == null ? null : jsonObject['decimal'] as double,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicUserStatus.fromJson(jsonObject['status'])
        );
      }

      PublicUsersUpdate copyWith({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) {
        return PublicUsersUpdate(
          decimal: decimal ?? this.decimal,
          id: id ?? this.id,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }

    class PublicTodosSelect implements JsonSerializable {
      static const tableName = 'todos';
  
      final String? details;
      final int id;
      final int userId;

      const PublicTodosSelect({
        this.details,
        required this.id,
        required this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? id,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (id != null) 'id': id,
        if (userId != null) 'user-id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        id: id,
        userId: userId
      );

      @override
      factory PublicTodosSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTodosSelect(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          id: jsonObject['id'] as int,
          userId: jsonObject['user-id'] as int
        );
      }

      PublicTodosSelect copyWith({
        String? details,
        int? id,
        int? userId
      }) {
        return PublicTodosSelect(
          details: details ?? this.details,
          id: id ?? this.id,
          userId: userId ?? this.userId
        );
      }
    }
    class PublicTodosInsert implements JsonSerializable {
      static const tableName = 'todos';
  
      final String? details;
      final int? id;
      final int userId;

      const PublicTodosInsert({
        this.details,
        this.id,
        required this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? id,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (id != null) 'id': id,
        if (userId != null) 'user-id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        id: id,
        userId: userId
      );

      @override
      factory PublicTodosInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTodosInsert(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          userId: jsonObject['user-id'] as int
        );
      }

      PublicTodosInsert copyWith({
        String? details,
        int? id,
        int? userId
      }) {
        return PublicTodosInsert(
          details: details ?? this.details,
          id: id ?? this.id,
          userId: userId ?? this.userId
        );
      }
    }
    class PublicTodosUpdate implements JsonSerializable {
      static const tableName = 'todos';
  
      final String? details;
      final int? id;
      final int? userId;

      const PublicTodosUpdate({
        this.details,
        this.id,
        this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? id,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (id != null) 'id': id,
        if (userId != null) 'user-id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        id: id,
        userId: userId
      );

      @override
      factory PublicTodosUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTodosUpdate(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          userId: jsonObject['user-id'] == null ? null : jsonObject['user-id'] as int
        );
      }

      PublicTodosUpdate copyWith({
        String? details,
        int? id,
        int? userId
      }) {
        return PublicTodosUpdate(
          details: details ?? this.details,
          id: id ?? this.id,
          userId: userId ?? this.userId
        );
      }
    }

    class PublicUsersAuditSelect implements JsonSerializable {
      static const tableName = 'users_audit';
  
      final DateTime? createdAt;
      final int id;
      final Map<String, dynamic>? previousValue;
      final int? userId;

      const PublicUsersAuditSelect({
        this.createdAt,
        required this.id,
        this.previousValue,
        this.userId
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? previousValue,
        int? userId
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (id != null) 'id': id,
        if (previousValue != null) 'previous_value': previousValue,
        if (userId != null) 'user_id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        id: id,
        previousValue: previousValue,
        userId: userId
      );

      @override
      factory PublicUsersAuditSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersAuditSelect(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          id: jsonObject['id'] as int,
          previousValue: jsonObject['previous_value'] == null ? null : jsonObject['previous_value'] as Map<String, dynamic>,
          userId: jsonObject['user_id'] == null ? null : jsonObject['user_id'] as int
        );
      }

      PublicUsersAuditSelect copyWith({
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? previousValue,
        int? userId
      }) {
        return PublicUsersAuditSelect(
          createdAt: createdAt ?? this.createdAt,
          id: id ?? this.id,
          previousValue: previousValue ?? this.previousValue,
          userId: userId ?? this.userId
        );
      }
    }
    class PublicUsersAuditInsert implements JsonSerializable {
      static const tableName = 'users_audit';
  
      final DateTime? createdAt;
      final int? id;
      final Map<String, dynamic>? previousValue;
      final int? userId;

      const PublicUsersAuditInsert({
        this.createdAt,
        this.id,
        this.previousValue,
        this.userId
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? previousValue,
        int? userId
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (id != null) 'id': id,
        if (previousValue != null) 'previous_value': previousValue,
        if (userId != null) 'user_id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        id: id,
        previousValue: previousValue,
        userId: userId
      );

      @override
      factory PublicUsersAuditInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersAuditInsert(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          previousValue: jsonObject['previous_value'] == null ? null : jsonObject['previous_value'] as Map<String, dynamic>,
          userId: jsonObject['user_id'] == null ? null : jsonObject['user_id'] as int
        );
      }

      PublicUsersAuditInsert copyWith({
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? previousValue,
        int? userId
      }) {
        return PublicUsersAuditInsert(
          createdAt: createdAt ?? this.createdAt,
          id: id ?? this.id,
          previousValue: previousValue ?? this.previousValue,
          userId: userId ?? this.userId
        );
      }
    }
    class PublicUsersAuditUpdate implements JsonSerializable {
      static const tableName = 'users_audit';
  
      final DateTime? createdAt;
      final int? id;
      final Map<String, dynamic>? previousValue;
      final int? userId;

      const PublicUsersAuditUpdate({
        this.createdAt,
        this.id,
        this.previousValue,
        this.userId
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? previousValue,
        int? userId
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (id != null) 'id': id,
        if (previousValue != null) 'previous_value': previousValue,
        if (userId != null) 'user_id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        id: id,
        previousValue: previousValue,
        userId: userId
      );

      @override
      factory PublicUsersAuditUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersAuditUpdate(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          previousValue: jsonObject['previous_value'] == null ? null : jsonObject['previous_value'] as Map<String, dynamic>,
          userId: jsonObject['user_id'] == null ? null : jsonObject['user_id'] as int
        );
      }

      PublicUsersAuditUpdate copyWith({
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? previousValue,
        int? userId
      }) {
        return PublicUsersAuditUpdate(
          createdAt: createdAt ?? this.createdAt,
          id: id ?? this.id,
          previousValue: previousValue ?? this.previousValue,
          userId: userId ?? this.userId
        );
      }
    }

    class PublicUserDetailsSelect implements JsonSerializable {
      static const tableName = 'user_details';
  
      final String? details;
      final int userId;

      const PublicUserDetailsSelect({
        this.details,
        required this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (userId != null) 'user_id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        userId: userId
      );

      @override
      factory PublicUserDetailsSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUserDetailsSelect(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          userId: jsonObject['user_id'] as int
        );
      }

      PublicUserDetailsSelect copyWith({
        String? details,
        int? userId
      }) {
        return PublicUserDetailsSelect(
          details: details ?? this.details,
          userId: userId ?? this.userId
        );
      }
    }
    class PublicUserDetailsInsert implements JsonSerializable {
      static const tableName = 'user_details';
  
      final String? details;
      final int userId;

      const PublicUserDetailsInsert({
        this.details,
        required this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (userId != null) 'user_id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        userId: userId
      );

      @override
      factory PublicUserDetailsInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUserDetailsInsert(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          userId: jsonObject['user_id'] as int
        );
      }

      PublicUserDetailsInsert copyWith({
        String? details,
        int? userId
      }) {
        return PublicUserDetailsInsert(
          details: details ?? this.details,
          userId: userId ?? this.userId
        );
      }
    }
    class PublicUserDetailsUpdate implements JsonSerializable {
      static const tableName = 'user_details';
  
      final String? details;
      final int? userId;

      const PublicUserDetailsUpdate({
        this.details,
        this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (userId != null) 'user_id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        userId: userId
      );

      @override
      factory PublicUserDetailsUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUserDetailsUpdate(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          userId: jsonObject['user_id'] == null ? null : jsonObject['user_id'] as int
        );
      }

      PublicUserDetailsUpdate copyWith({
        String? details,
        int? userId
      }) {
        return PublicUserDetailsUpdate(
          details: details ?? this.details,
          userId: userId ?? this.userId
        );
      }
    }

    class PublicEmptySelect implements JsonSerializable {
      static const tableName = 'empty';
  

      const PublicEmptySelect();

      static Map<String, dynamic> _generateMap() => {
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
      );

      @override
      factory PublicEmptySelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEmptySelect(
        );
      }

      PublicEmptySelect copyWith() {
        return PublicEmptySelect(
        );
      }
    }
    class PublicEmptyInsert implements JsonSerializable {
      static const tableName = 'empty';
  

      const PublicEmptyInsert();

      static Map<String, dynamic> _generateMap() => {
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
      );

      @override
      factory PublicEmptyInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEmptyInsert(
        );
      }

      PublicEmptyInsert copyWith() {
        return PublicEmptyInsert(
        );
      }
    }
    class PublicEmptyUpdate implements JsonSerializable {
      static const tableName = 'empty';
  

      const PublicEmptyUpdate();

      static Map<String, dynamic> _generateMap() => {
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
      );

      @override
      factory PublicEmptyUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEmptyUpdate(
        );
      }

      PublicEmptyUpdate copyWith() {
        return PublicEmptyUpdate(
        );
      }
    }

    class PublicTableWithOtherTablesRowTypeSelect implements JsonSerializable {
      static const tableName = 'table_with_other_tables_row_type';
  
      final dynamic? col1;
      final dynamic? col2;

      const PublicTableWithOtherTablesRowTypeSelect({
        this.col1,
        this.col2
      });

      static Map<String, dynamic> _generateMap({
        dynamic? col1,
        dynamic? col2
      }) => {
        if (col1 != null) 'col1': col1,
        if (col2 != null) 'col2': col2
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        col1: col1,
        col2: col2
      );

      @override
      factory PublicTableWithOtherTablesRowTypeSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTableWithOtherTablesRowTypeSelect(
          col1: jsonObject['col1'] == null ? null : jsonObject['col1'] as dynamic,
          col2: jsonObject['col2'] == null ? null : jsonObject['col2'] as dynamic
        );
      }

      PublicTableWithOtherTablesRowTypeSelect copyWith({
        dynamic? col1,
        dynamic? col2
      }) {
        return PublicTableWithOtherTablesRowTypeSelect(
          col1: col1 ?? this.col1,
          col2: col2 ?? this.col2
        );
      }
    }
    class PublicTableWithOtherTablesRowTypeInsert implements JsonSerializable {
      static const tableName = 'table_with_other_tables_row_type';
  
      final dynamic? col1;
      final dynamic? col2;

      const PublicTableWithOtherTablesRowTypeInsert({
        this.col1,
        this.col2
      });

      static Map<String, dynamic> _generateMap({
        dynamic? col1,
        dynamic? col2
      }) => {
        if (col1 != null) 'col1': col1,
        if (col2 != null) 'col2': col2
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        col1: col1,
        col2: col2
      );

      @override
      factory PublicTableWithOtherTablesRowTypeInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTableWithOtherTablesRowTypeInsert(
          col1: jsonObject['col1'] == null ? null : jsonObject['col1'] as dynamic,
          col2: jsonObject['col2'] == null ? null : jsonObject['col2'] as dynamic
        );
      }

      PublicTableWithOtherTablesRowTypeInsert copyWith({
        dynamic? col1,
        dynamic? col2
      }) {
        return PublicTableWithOtherTablesRowTypeInsert(
          col1: col1 ?? this.col1,
          col2: col2 ?? this.col2
        );
      }
    }
    class PublicTableWithOtherTablesRowTypeUpdate implements JsonSerializable {
      static const tableName = 'table_with_other_tables_row_type';
  
      final dynamic? col1;
      final dynamic? col2;

      const PublicTableWithOtherTablesRowTypeUpdate({
        this.col1,
        this.col2
      });

      static Map<String, dynamic> _generateMap({
        dynamic? col1,
        dynamic? col2
      }) => {
        if (col1 != null) 'col1': col1,
        if (col2 != null) 'col2': col2
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        col1: col1,
        col2: col2
      );

      @override
      factory PublicTableWithOtherTablesRowTypeUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTableWithOtherTablesRowTypeUpdate(
          col1: jsonObject['col1'] == null ? null : jsonObject['col1'] as dynamic,
          col2: jsonObject['col2'] == null ? null : jsonObject['col2'] as dynamic
        );
      }

      PublicTableWithOtherTablesRowTypeUpdate copyWith({
        dynamic? col1,
        dynamic? col2
      }) {
        return PublicTableWithOtherTablesRowTypeUpdate(
          col1: col1 ?? this.col1,
          col2: col2 ?? this.col2
        );
      }
    }

    class PublicTableWithPrimaryKeyOtherThanIdSelect implements JsonSerializable {
      static const tableName = 'table_with_primary_key_other_than_id';
  
      final String? name;
      final int otherId;

      const PublicTableWithPrimaryKeyOtherThanIdSelect({
        this.name,
        required this.otherId
      });

      static Map<String, dynamic> _generateMap({
        String? name,
        int? otherId
      }) => {
        if (name != null) 'name': name,
        if (otherId != null) 'other_id': otherId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        name: name,
        otherId: otherId
      );

      @override
      factory PublicTableWithPrimaryKeyOtherThanIdSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTableWithPrimaryKeyOtherThanIdSelect(
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          otherId: jsonObject['other_id'] as int
        );
      }

      PublicTableWithPrimaryKeyOtherThanIdSelect copyWith({
        String? name,
        int? otherId
      }) {
        return PublicTableWithPrimaryKeyOtherThanIdSelect(
          name: name ?? this.name,
          otherId: otherId ?? this.otherId
        );
      }
    }
    class PublicTableWithPrimaryKeyOtherThanIdInsert implements JsonSerializable {
      static const tableName = 'table_with_primary_key_other_than_id';
  
      final String? name;
      final int? otherId;

      const PublicTableWithPrimaryKeyOtherThanIdInsert({
        this.name,
        this.otherId
      });

      static Map<String, dynamic> _generateMap({
        String? name,
        int? otherId
      }) => {
        if (name != null) 'name': name,
        if (otherId != null) 'other_id': otherId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        name: name,
        otherId: otherId
      );

      @override
      factory PublicTableWithPrimaryKeyOtherThanIdInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTableWithPrimaryKeyOtherThanIdInsert(
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          otherId: jsonObject['other_id'] == null ? null : jsonObject['other_id'] as int
        );
      }

      PublicTableWithPrimaryKeyOtherThanIdInsert copyWith({
        String? name,
        int? otherId
      }) {
        return PublicTableWithPrimaryKeyOtherThanIdInsert(
          name: name ?? this.name,
          otherId: otherId ?? this.otherId
        );
      }
    }
    class PublicTableWithPrimaryKeyOtherThanIdUpdate implements JsonSerializable {
      static const tableName = 'table_with_primary_key_other_than_id';
  
      final String? name;
      final int? otherId;

      const PublicTableWithPrimaryKeyOtherThanIdUpdate({
        this.name,
        this.otherId
      });

      static Map<String, dynamic> _generateMap({
        String? name,
        int? otherId
      }) => {
        if (name != null) 'name': name,
        if (otherId != null) 'other_id': otherId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        name: name,
        otherId: otherId
      );

      @override
      factory PublicTableWithPrimaryKeyOtherThanIdUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTableWithPrimaryKeyOtherThanIdUpdate(
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          otherId: jsonObject['other_id'] == null ? null : jsonObject['other_id'] as int
        );
      }

      PublicTableWithPrimaryKeyOtherThanIdUpdate copyWith({
        String? name,
        int? otherId
      }) {
        return PublicTableWithPrimaryKeyOtherThanIdUpdate(
          name: name ?? this.name,
          otherId: otherId ?? this.otherId
        );
      }
    }

    class PublicEventsSelect implements JsonSerializable {
      static const tableName = 'events';
  
      final DateTime createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int id;

      const PublicEventsSelect({
        required this.createdAt,
        this.data,
        this.eventType,
        required this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEventsSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEventsSelect(
          createdAt: DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] as int
        );
      }

      PublicEventsSelect copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEventsSelect(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }
    class PublicEventsInsert implements JsonSerializable {
      static const tableName = 'events';
  
      final DateTime? createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int? id;

      const PublicEventsInsert({
        this.createdAt,
        this.data,
        this.eventType,
        this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEventsInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEventsInsert(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int
        );
      }

      PublicEventsInsert copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEventsInsert(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }
    class PublicEventsUpdate implements JsonSerializable {
      static const tableName = 'events';
  
      final DateTime? createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int? id;

      const PublicEventsUpdate({
        this.createdAt,
        this.data,
        this.eventType,
        this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEventsUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEventsUpdate(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int
        );
      }

      PublicEventsUpdate copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEventsUpdate(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }

    class PublicEvents2024Select implements JsonSerializable {
      static const tableName = 'events_2024';
  
      final DateTime createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int id;

      const PublicEvents2024Select({
        required this.createdAt,
        this.data,
        this.eventType,
        required this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEvents2024Select.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEvents2024Select(
          createdAt: DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] as int
        );
      }

      PublicEvents2024Select copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEvents2024Select(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }
    class PublicEvents2024Insert implements JsonSerializable {
      static const tableName = 'events_2024';
  
      final DateTime? createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int id;

      const PublicEvents2024Insert({
        this.createdAt,
        this.data,
        this.eventType,
        required this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEvents2024Insert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEvents2024Insert(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] as int
        );
      }

      PublicEvents2024Insert copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEvents2024Insert(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }
    class PublicEvents2024Update implements JsonSerializable {
      static const tableName = 'events_2024';
  
      final DateTime? createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int? id;

      const PublicEvents2024Update({
        this.createdAt,
        this.data,
        this.eventType,
        this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEvents2024Update.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEvents2024Update(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int
        );
      }

      PublicEvents2024Update copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEvents2024Update(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }

    class PublicEvents2025Select implements JsonSerializable {
      static const tableName = 'events_2025';
  
      final DateTime createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int id;

      const PublicEvents2025Select({
        required this.createdAt,
        this.data,
        this.eventType,
        required this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEvents2025Select.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEvents2025Select(
          createdAt: DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] as int
        );
      }

      PublicEvents2025Select copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEvents2025Select(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }
    class PublicEvents2025Insert implements JsonSerializable {
      static const tableName = 'events_2025';
  
      final DateTime? createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int id;

      const PublicEvents2025Insert({
        this.createdAt,
        this.data,
        this.eventType,
        required this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEvents2025Insert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEvents2025Insert(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] as int
        );
      }

      PublicEvents2025Insert copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEvents2025Insert(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }
    class PublicEvents2025Update implements JsonSerializable {
      static const tableName = 'events_2025';
  
      final DateTime? createdAt;
      final Map<String, dynamic>? data;
      final String? eventType;
      final int? id;

      const PublicEvents2025Update({
        this.createdAt,
        this.data,
        this.eventType,
        this.id
      });

      static Map<String, dynamic> _generateMap({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) => {
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (data != null) 'data': data,
        if (eventType != null) 'event_type': eventType,
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        createdAt: createdAt,
        data: data,
        eventType: eventType,
        id: id
      );

      @override
      factory PublicEvents2025Update.fromJson(Map<String, dynamic> jsonObject) {
        return PublicEvents2025Update(
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          data: jsonObject['data'] == null ? null : jsonObject['data'] as Map<String, dynamic>,
          eventType: jsonObject['event_type'] == null ? null : jsonObject['event_type'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int
        );
      }

      PublicEvents2025Update copyWith({
        DateTime? createdAt,
        Map<String, dynamic>? data,
        String? eventType,
        int? id
      }) {
        return PublicEvents2025Update(
          createdAt: createdAt ?? this.createdAt,
          data: data ?? this.data,
          eventType: eventType ?? this.eventType,
          id: id ?? this.id
        );
      }
    }

    class PublicCategorySelect implements JsonSerializable {
      static const tableName = 'category';
  
      final int id;
      final String name;

      const PublicCategorySelect({
        required this.id,
        required this.name
      });

      static Map<String, dynamic> _generateMap({
        int? id,
        String? name
      }) => {
        if (id != null) 'id': id,
        if (name != null) 'name': name
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        id: id,
        name: name
      );

      @override
      factory PublicCategorySelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicCategorySelect(
          id: jsonObject['id'] as int,
          name: jsonObject['name'] as String
        );
      }

      PublicCategorySelect copyWith({
        int? id,
        String? name
      }) {
        return PublicCategorySelect(
          id: id ?? this.id,
          name: name ?? this.name
        );
      }
    }
    class PublicCategoryInsert implements JsonSerializable {
      static const tableName = 'category';
  
      final int? id;
      final String name;

      const PublicCategoryInsert({
        this.id,
        required this.name
      });

      static Map<String, dynamic> _generateMap({
        int? id,
        String? name
      }) => {
        if (id != null) 'id': id,
        if (name != null) 'name': name
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        id: id,
        name: name
      );

      @override
      factory PublicCategoryInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicCategoryInsert(
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          name: jsonObject['name'] as String
        );
      }

      PublicCategoryInsert copyWith({
        int? id,
        String? name
      }) {
        return PublicCategoryInsert(
          id: id ?? this.id,
          name: name ?? this.name
        );
      }
    }
    class PublicCategoryUpdate implements JsonSerializable {
      static const tableName = 'category';
  
      final int? id;
      final String? name;

      const PublicCategoryUpdate({
        this.id,
        this.name
      });

      static Map<String, dynamic> _generateMap({
        int? id,
        String? name
      }) => {
        if (id != null) 'id': id,
        if (name != null) 'name': name
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        id: id,
        name: name
      );

      @override
      factory PublicCategoryUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicCategoryUpdate(
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String
        );
      }

      PublicCategoryUpdate copyWith({
        int? id,
        String? name
      }) {
        return PublicCategoryUpdate(
          id: id ?? this.id,
          name: name ?? this.name
        );
      }
    }

    class PublicMemesSelect implements JsonSerializable {
      static const tableName = 'memes';
  
      final int? category;
      final DateTime createdAt;
      final int id;
      final Map<String, dynamic>? metadata;
      final String name;
      final PublicMemeStatus? status;

      const PublicMemesSelect({
        this.category,
        required this.createdAt,
        required this.id,
        this.metadata,
        required this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        int? category,
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? metadata,
        String? name,
        PublicMemeStatus? status
      }) => {
        if (category != null) 'category': category,
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (id != null) 'id': id,
        if (metadata != null) 'metadata': metadata,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        category: category,
        createdAt: createdAt,
        id: id,
        metadata: metadata,
        name: name,
        status: status
      );

      @override
      factory PublicMemesSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicMemesSelect(
          category: jsonObject['category'] == null ? null : jsonObject['category'] as int,
          createdAt: DateTime.parse(jsonObject['created_at']),
          id: jsonObject['id'] as int,
          metadata: jsonObject['metadata'] == null ? null : jsonObject['metadata'] as Map<String, dynamic>,
          name: jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicMemeStatus.fromJson(jsonObject['status'])
        );
      }

      PublicMemesSelect copyWith({
        int? category,
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? metadata,
        String? name,
        PublicMemeStatus? status
      }) {
        return PublicMemesSelect(
          category: category ?? this.category,
          createdAt: createdAt ?? this.createdAt,
          id: id ?? this.id,
          metadata: metadata ?? this.metadata,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }
    class PublicMemesInsert implements JsonSerializable {
      static const tableName = 'memes';
  
      final int? category;
      final DateTime createdAt;
      final int? id;
      final Map<String, dynamic>? metadata;
      final String name;
      final PublicMemeStatus? status;

      const PublicMemesInsert({
        this.category,
        required this.createdAt,
        this.id,
        this.metadata,
        required this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        int? category,
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? metadata,
        String? name,
        PublicMemeStatus? status
      }) => {
        if (category != null) 'category': category,
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (id != null) 'id': id,
        if (metadata != null) 'metadata': metadata,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        category: category,
        createdAt: createdAt,
        id: id,
        metadata: metadata,
        name: name,
        status: status
      );

      @override
      factory PublicMemesInsert.fromJson(Map<String, dynamic> jsonObject) {
        return PublicMemesInsert(
          category: jsonObject['category'] == null ? null : jsonObject['category'] as int,
          createdAt: DateTime.parse(jsonObject['created_at']),
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          metadata: jsonObject['metadata'] == null ? null : jsonObject['metadata'] as Map<String, dynamic>,
          name: jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicMemeStatus.fromJson(jsonObject['status'])
        );
      }

      PublicMemesInsert copyWith({
        int? category,
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? metadata,
        String? name,
        PublicMemeStatus? status
      }) {
        return PublicMemesInsert(
          category: category ?? this.category,
          createdAt: createdAt ?? this.createdAt,
          id: id ?? this.id,
          metadata: metadata ?? this.metadata,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }
    class PublicMemesUpdate implements JsonSerializable {
      static const tableName = 'memes';
  
      final int? category;
      final DateTime? createdAt;
      final int? id;
      final Map<String, dynamic>? metadata;
      final String? name;
      final PublicMemeStatus? status;

      const PublicMemesUpdate({
        this.category,
        this.createdAt,
        this.id,
        this.metadata,
        this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        int? category,
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? metadata,
        String? name,
        PublicMemeStatus? status
      }) => {
        if (category != null) 'category': category,
        if (createdAt != null) 'created_at': createdAt.toIso8601String(),
        if (id != null) 'id': id,
        if (metadata != null) 'metadata': metadata,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        category: category,
        createdAt: createdAt,
        id: id,
        metadata: metadata,
        name: name,
        status: status
      );

      @override
      factory PublicMemesUpdate.fromJson(Map<String, dynamic> jsonObject) {
        return PublicMemesUpdate(
          category: jsonObject['category'] == null ? null : jsonObject['category'] as int,
          createdAt: jsonObject['created_at'] == null ? null : DateTime.parse(jsonObject['created_at']),
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          metadata: jsonObject['metadata'] == null ? null : jsonObject['metadata'] as Map<String, dynamic>,
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicMemeStatus.fromJson(jsonObject['status'])
        );
      }

      PublicMemesUpdate copyWith({
        int? category,
        DateTime? createdAt,
        int? id,
        Map<String, dynamic>? metadata,
        String? name,
        PublicMemeStatus? status
      }) {
        return PublicMemesUpdate(
          category: category ?? this.category,
          createdAt: createdAt ?? this.createdAt,
          id: id ?? this.id,
          metadata: metadata ?? this.metadata,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }

    class PublicAViewSelect implements JsonSerializable {
      static const tableName = 'a_view';
  
      final int? id;

      const PublicAViewSelect({
        this.id
      });

      static Map<String, dynamic> _generateMap({
        int? id
      }) => {
        if (id != null) 'id': id
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        id: id
      );

      @override
      factory PublicAViewSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicAViewSelect(
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int
        );
      }

      PublicAViewSelect copyWith({
        int? id
      }) {
        return PublicAViewSelect(
          id: id ?? this.id
        );
      }
    }



    class PublicTodosViewSelect implements JsonSerializable {
      static const tableName = 'todos_view';
  
      final String? details;
      final int? id;
      final int? userId;

      const PublicTodosViewSelect({
        this.details,
        this.id,
        this.userId
      });

      static Map<String, dynamic> _generateMap({
        String? details,
        int? id,
        int? userId
      }) => {
        if (details != null) 'details': details,
        if (id != null) 'id': id,
        if (userId != null) 'user-id': userId
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        details: details,
        id: id,
        userId: userId
      );

      @override
      factory PublicTodosViewSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicTodosViewSelect(
          details: jsonObject['details'] == null ? null : jsonObject['details'] as String,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          userId: jsonObject['user-id'] == null ? null : jsonObject['user-id'] as int
        );
      }

      PublicTodosViewSelect copyWith({
        String? details,
        int? id,
        int? userId
      }) {
        return PublicTodosViewSelect(
          details: details ?? this.details,
          id: id ?? this.id,
          userId: userId ?? this.userId
        );
      }
    }



    class PublicUsersViewSelect implements JsonSerializable {
      static const tableName = 'users_view';
  
      final double? decimal;
      final int? id;
      final String? name;
      final PublicUserStatus? status;

      const PublicUsersViewSelect({
        this.decimal,
        this.id,
        this.name,
        this.status
      });

      static Map<String, dynamic> _generateMap({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) => {
        if (decimal != null) 'decimal': decimal,
        if (id != null) 'id': id,
        if (name != null) 'name': name,
        if (status != null) 'status': status.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        decimal: decimal,
        id: id,
        name: name,
        status: status
      );

      @override
      factory PublicUsersViewSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersViewSelect(
          decimal: jsonObject['decimal'] == null ? null : jsonObject['decimal'] as double,
          id: jsonObject['id'] == null ? null : jsonObject['id'] as int,
          name: jsonObject['name'] == null ? null : jsonObject['name'] as String,
          status: jsonObject['status'] == null ? null : PublicUserStatus.fromJson(jsonObject['status'])
        );
      }

      PublicUsersViewSelect copyWith({
        double? decimal,
        int? id,
        String? name,
        PublicUserStatus? status
      }) {
        return PublicUsersViewSelect(
          decimal: decimal ?? this.decimal,
          id: id ?? this.id,
          name: name ?? this.name,
          status: status ?? this.status
        );
      }
    }



    class PublicUserTodosSummaryViewSelect implements JsonSerializable {
      static const tableName = 'user_todos_summary_view';
  
      final int? todoCount;
      final List<String>? todoDetails;
      final int? userId;
      final String? userName;
      final PublicUserStatus? userStatus;

      const PublicUserTodosSummaryViewSelect({
        this.todoCount,
        this.todoDetails,
        this.userId,
        this.userName,
        this.userStatus
      });

      static Map<String, dynamic> _generateMap({
        int? todoCount,
        List<String>? todoDetails,
        int? userId,
        String? userName,
        PublicUserStatus? userStatus
      }) => {
        if (todoCount != null) 'todo_count': todoCount,
        if (todoDetails != null) 'todo_details': todoDetails.map((v) => v).toList(),
        if (userId != null) 'user_id': userId,
        if (userName != null) 'user_name': userName,
        if (userStatus != null) 'user_status': userStatus.toJson()
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        todoCount: todoCount,
        todoDetails: todoDetails,
        userId: userId,
        userName: userName,
        userStatus: userStatus
      );

      @override
      factory PublicUserTodosSummaryViewSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUserTodosSummaryViewSelect(
          todoCount: jsonObject['todo_count'] == null ? null : jsonObject['todo_count'] as int,
          todoDetails: jsonObject['todo_details'] == null ? null : (jsonObject['todo_details'] as List<dynamic>).map((v) => v as String).toList(),
          userId: jsonObject['user_id'] == null ? null : jsonObject['user_id'] as int,
          userName: jsonObject['user_name'] == null ? null : jsonObject['user_name'] as String,
          userStatus: jsonObject['user_status'] == null ? null : PublicUserStatus.fromJson(jsonObject['user_status'])
        );
      }

      PublicUserTodosSummaryViewSelect copyWith({
        int? todoCount,
        List<String>? todoDetails,
        int? userId,
        String? userName,
        PublicUserStatus? userStatus
      }) {
        return PublicUserTodosSummaryViewSelect(
          todoCount: todoCount ?? this.todoCount,
          todoDetails: todoDetails ?? this.todoDetails,
          userId: userId ?? this.userId,
          userName: userName ?? this.userName,
          userStatus: userStatus ?? this.userStatus
        );
      }
    }



    class PublicUsersViewWithMultipleRefsToUsersSelect implements JsonSerializable {
      static const tableName = 'users_view_with_multiple_refs_to_users';
  
      final int? initialId;
      final String? initialName;
      final int? secondId;
      final String? secondName;

      const PublicUsersViewWithMultipleRefsToUsersSelect({
        this.initialId,
        this.initialName,
        this.secondId,
        this.secondName
      });

      static Map<String, dynamic> _generateMap({
        int? initialId,
        String? initialName,
        int? secondId,
        String? secondName
      }) => {
        if (initialId != null) 'initial_id': initialId,
        if (initialName != null) 'initial_name': initialName,
        if (secondId != null) 'second_id': secondId,
        if (secondName != null) 'second_name': secondName
      };

      @override
      Map<String, dynamic> toJson() => _generateMap(
        initialId: initialId,
        initialName: initialName,
        secondId: secondId,
        secondName: secondName
      );

      @override
      factory PublicUsersViewWithMultipleRefsToUsersSelect.fromJson(Map<String, dynamic> jsonObject) {
        return PublicUsersViewWithMultipleRefsToUsersSelect(
          initialId: jsonObject['initial_id'] == null ? null : jsonObject['initial_id'] as int,
          initialName: jsonObject['initial_name'] == null ? null : jsonObject['initial_name'] as String,
          secondId: jsonObject['second_id'] == null ? null : jsonObject['second_id'] as int,
          secondName: jsonObject['second_name'] == null ? null : jsonObject['second_name'] as String
        );
      }

      PublicUsersViewWithMultipleRefsToUsersSelect copyWith({
        int? initialId,
        String? initialName,
        int? secondId,
        String? secondName
      }) {
        return PublicUsersViewWithMultipleRefsToUsersSelect(
          initialId: initialId ?? this.initialId,
          initialName: initialName ?? this.initialName,
          secondId: secondId ?? this.secondId,
          secondName: secondName ?? this.secondName
        );
      }
    }

    "`)
})
