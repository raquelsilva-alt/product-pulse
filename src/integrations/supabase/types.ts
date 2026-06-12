export type Json =
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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      field_signals: {
        Row: {
          attribution: string
          created_at: string
          id: string
          quote: string
          sort_order: number
        }
        Insert: {
          attribution: string
          created_at?: string
          id?: string
          quote: string
          sort_order?: number
        }
        Update: {
          attribution?: string
          created_at?: string
          id?: string
          quote?: string
          sort_order?: number
        }
        Relationships: []
      }
      forecast_items: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          sub: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          sub: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          sub?: string
          value?: string
        }
        Relationships: []
      }
      kpis: {
        Row: {
          created_at: string
          delta: string
          id: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          delta: string
          id?: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          delta?: string
          id?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          stage: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          stage: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          stage?: string
          value?: number
        }
        Relationships: []
      }
      roadmap_columns: {
        Row: {
          badge: string
          created_at: string
          dot: string
          id: string
          quarter: string
          sort_order: number
        }
        Insert: {
          badge?: string
          created_at?: string
          dot?: string
          id?: string
          quarter: string
          sort_order?: number
        }
        Update: {
          badge?: string
          created_at?: string
          dot?: string
          id?: string
          quarter?: string
          sort_order?: number
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          column_id: string
          created_at: string
          id: string
          sort_order: number
          status: string
          tag: string
          title: string
        }
        Insert: {
          column_id: string
          created_at?: string
          id?: string
          sort_order?: number
          status: string
          tag: string
          title: string
        }
        Update: {
          column_id?: string
          created_at?: string
          id?: string
          sort_order?: number
          status?: string
          tag?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_items_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "roadmap_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      traffic_points: {
        Row: {
          actual: number | null
          created_at: string
          forecast: number | null
          id: string
          month: string
          sort_order: number
        }
        Insert: {
          actual?: number | null
          created_at?: string
          forecast?: number | null
          id?: string
          month: string
          sort_order?: number
        }
        Update: {
          actual?: number | null
          created_at?: string
          forecast?: number | null
          id?: string
          month?: string
          sort_order?: number
        }
        Relationships: []
      }
      use_cases: {
        Row: {
          active_users: number
          category: string
          count: number
          created_at: string
          departments: Json
          growth: string
          id: string
          is_new: boolean
          name: string
          resolution_rate: number
          slug: string
          sort_order: number
          status: string
          trend: number[]
          updated_at: string
        }
        Insert: {
          active_users?: number
          category: string
          count?: number
          created_at?: string
          departments?: Json
          growth: string
          id?: string
          is_new?: boolean
          name: string
          resolution_rate?: number
          slug: string
          sort_order?: number
          status: string
          trend?: number[]
          updated_at?: string
        }
        Update: {
          active_users?: number
          category?: string
          count?: number
          created_at?: string
          departments?: Json
          growth?: string
          id?: string
          is_new?: boolean
          name?: string
          resolution_rate?: number
          slug?: string
          sort_order?: number
          status?: string
          trend?: number[]
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
    Enums: {},
  },
} as const
