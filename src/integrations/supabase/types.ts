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
          user_id: string
        }
        Insert: {
          attribution: string
          created_at?: string
          id?: string
          quote: string
          sort_order?: number
          user_id: string
        }
        Update: {
          attribution?: string
          created_at?: string
          id?: string
          quote?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: []
      }
      forecast_summary: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          sub: string | null
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          sub?: string | null
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          sub?: string | null
          user_id?: string
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
          period: string | null
          sort_order: number
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          delta: string
          id?: string
          label: string
          period?: string | null
          sort_order?: number
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          delta?: string
          id?: string
          label?: string
          period?: string | null
          sort_order?: number
          user_id?: string
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
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          stage: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          stage?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          created_at: string
          id: string
          quarter: string
          sort_order: number
          status: string
          tag: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quarter: string
          sort_order?: number
          status: string
          tag?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quarter?: string
          sort_order?: number
          status?: string
          tag?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      traffic_monthly: {
        Row: {
          actual: number | null
          created_at: string
          forecast: number | null
          id: string
          month: string
          sort_order: number
          user_id: string
        }
        Insert: {
          actual?: number | null
          created_at?: string
          forecast?: number | null
          id?: string
          month: string
          sort_order?: number
          user_id: string
        }
        Update: {
          actual?: number | null
          created_at?: string
          forecast?: number | null
          id?: string
          month?: string
          sort_order?: number
          user_id?: string
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
          sort_order: number
          status: string
          trend: number[]
          user_id: string
        }
        Insert: {
          active_users?: number
          category?: string
          count?: number
          created_at?: string
          departments?: Json
          growth?: string
          id?: string
          is_new?: boolean
          name: string
          resolution_rate?: number
          sort_order?: number
          status: string
          trend?: number[]
          user_id: string
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
          sort_order?: number
          status?: string
          trend?: number[]
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          org_name: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          org_name?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          org_name?: string | null
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
