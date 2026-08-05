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
      bird_overrides: {
        Row: {
          bird_id: string
          description: string | null
          diff_desc: string | null
          features: Json | null
          id: string
          link1_label: string | null
          link1_url: string | null
          link2_label: string | null
          link2_url: string | null
          migration_common: boolean | null
          name: string | null
          quick_marks: Json | null
          rarity: string | null
          regions: string[] | null
          season_status: string[] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          bird_id: string
          description?: string | null
          diff_desc?: string | null
          features?: Json | null
          id?: string
          link1_label?: string | null
          link1_url?: string | null
          link2_label?: string | null
          link2_url?: string | null
          migration_common?: boolean | null
          name?: string | null
          quick_marks?: Json | null
          rarity?: string | null
          regions?: string[] | null
          season_status?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          bird_id?: string
          description?: string | null
          diff_desc?: string | null
          features?: Json | null
          id?: string
          link1_label?: string | null
          link1_url?: string | null
          link2_label?: string | null
          link2_url?: string | null
          migration_common?: boolean | null
          name?: string | null
          quick_marks?: Json | null
          rarity?: string | null
          regions?: string[] | null
          season_status?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          bird_id: string
          caption: string | null
          created_at: string
          family: string
          id: string
          image_url: string
          is_lead: boolean | null
          photographer: string | null
          sort_order: number | null
        }
        Insert: {
          bird_id: string
          caption?: string | null
          created_at?: string
          family: string
          id?: string
          image_url: string
          is_lead?: boolean | null
          photographer?: string | null
          sort_order?: number | null
        }
        Update: {
          bird_id?: string
          caption?: string | null
          created_at?: string
          family?: string
          id?: string
          image_url?: string
          is_lead?: boolean | null
          photographer?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      question_overrides: {
        Row: {
          explanation: string | null
          hint: string | null
          id: string
          is_disabled: boolean | null
          question_id: string
          text: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          explanation?: string | null
          hint?: string | null
          id?: string
          is_disabled?: boolean | null
          question_id: string
          text?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          explanation?: string | null
          hint?: string | null
          id?: string
          is_disabled?: boolean | null
          question_id?: string
          text?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tag_birds: {
        Row: {
          bird_id: string
          created_at: string
          id: string
          note: string | null
          sort_order: number
          tag_id: string
          updated_at: string
        }
        Insert: {
          bird_id: string
          created_at?: string
          id?: string
          note?: string | null
          sort_order?: number
          tag_id: string
          updated_at?: string
        }
        Update: {
          bird_id?: string
          created_at?: string
          id?: string
          note?: string | null
          sort_order?: number
          tag_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_birds_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          attr: string
          attr_value: boolean
          category_id: string
          created_at: string
          has_custom_list: boolean
          id: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          attr: string
          attr_value?: boolean
          category_id: string
          created_at?: string
          has_custom_list?: boolean
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          attr?: string
          attr_value?: boolean
          category_id?: string
          created_at?: string
          has_custom_list?: boolean
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tag_categories"
            referencedColumns: ["id"]
          },
        ]
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
