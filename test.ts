
> @supabase/postgres-meta@0.0.0-automated gen:types:typescript
> PG_META_GENERATE_TYPES=typescript node --loader ts-node/esm src/server/server.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  openai: {
    Tables: {
      assistants: {
        Row: {
          assistant_id: string | null
          checksum: string | null
          created_at: string
          file_ids: Json | null
          id: number
          model: string | null
          name: string | null
          prompt: string | null
          raw_json_response: Json
          tools: Json | null
          updated_at: string
        }
        Insert: {
          assistant_id?: string | null
          checksum?: string | null
          created_at?: string
          file_ids?: Json | null
          id?: never
          model?: string | null
          name?: string | null
          prompt?: string | null
          raw_json_response: Json
          tools?: Json | null
          updated_at?: string
        }
        Update: {
          assistant_id?: string | null
          checksum?: string | null
          created_at?: string
          file_ids?: Json | null
          id?: never
          model?: string | null
          name?: string | null
          prompt?: string | null
          raw_json_response?: Json
          tools?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          assistant_id: string | null
          checksum: string | null
          created_at: string
          id: number
          message_id: string | null
          openai_created_at: number | null
          raw_json_response: Json
          role: string | null
          run_id: string | null
          thread_id: string | null
          updated_at: string
        }
        Insert: {
          assistant_id?: string | null
          checksum?: string | null
          created_at?: string
          id?: never
          message_id?: string | null
          openai_created_at?: number | null
          raw_json_response: Json
          role?: string | null
          run_id?: string | null
          thread_id?: string | null
          updated_at?: string
        }
        Update: {
          assistant_id?: string | null
          checksum?: string | null
          created_at?: string
          id?: never
          message_id?: string | null
          openai_created_at?: number | null
          raw_json_response?: Json
          role?: string | null
          run_id?: string | null
          thread_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      runs: {
        Row: {
          assistant_id: string | null
          checksum: string | null
          created_at: string
          file_ids: Json | null
          id: number
          model: string | null
          raw_json_response: Json
          run_id: string | null
          status: string | null
          thread_id: string | null
          tools: Json | null
          updated_at: string
        }
        Insert: {
          assistant_id?: string | null
          checksum?: string | null
          created_at?: string
          file_ids?: Json | null
          id?: never
          model?: string | null
          raw_json_response: Json
          run_id?: string | null
          status?: string | null
          thread_id?: string | null
          tools?: Json | null
          updated_at?: string
        }
        Update: {
          assistant_id?: string | null
          checksum?: string | null
          created_at?: string
          file_ids?: Json | null
          id?: never
          model?: string | null
          raw_json_response?: Json
          run_id?: string | null
          status?: string | null
          thread_id?: string | null
          tools?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          checksum: string | null
          created_at: string
          deleted: boolean | null
          id: number
          raw_json_response: Json
          thread_id: string | null
          updated_at: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          deleted?: boolean | null
          id?: never
          raw_json_response: Json
          thread_id?: string | null
          updated_at?: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          deleted?: boolean | null
          id?: never
          raw_json_response?: Json
          thread_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database[keyof Database]["Tables"] &
        Database[keyof Database]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database[keyof Database]["Tables"] &
        Database[keyof Database]["Views"])
    ? (Database[keyof Database]["Tables"] &
        Database[keyof Database]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database[keyof Database]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database[keyof Database]["Tables"]
    ? Database[keyof Database]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database[keyof Database]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database[keyof Database]["Tables"]
    ? Database[keyof Database]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database[keyof Database]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database[keyof Database]["Enums"]
    ? Database[keyof Database]["Enums"][PublicEnumNameOrOptions]
    : never

