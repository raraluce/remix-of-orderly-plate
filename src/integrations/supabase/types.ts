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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      allergens: {
        Row: {
          icon: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      dish_allergens: {
        Row: {
          allergen_id: string
          dish_id: string
          type: Database["public"]["Enums"]["dish_allergen_type"]
        }
        Insert: {
          allergen_id: string
          dish_id: string
          type?: Database["public"]["Enums"]["dish_allergen_type"]
        }
        Update: {
          allergen_id?: string
          dish_id?: string
          type?: Database["public"]["Enums"]["dish_allergen_type"]
        }
        Relationships: [
          {
            foreignKeyName: "dish_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_allergens_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_diet_tags: {
        Row: {
          diet_type: string
          dish_id: string
        }
        Insert: {
          diet_type: string
          dish_id: string
        }
        Update: {
          diet_type?: string
          dish_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_diet_tags_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          calories: number | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          is_shareable: boolean
          name: string
          prep_time_mins: number | null
          price: number
          restaurant_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_shareable?: boolean
          name: string
          prep_time_mins?: number | null
          price: number
          restaurant_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_shareable?: boolean
          name?: string
          prep_time_mins?: number | null
          price?: number
          restaurant_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dishes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          restaurant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          restaurant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          restaurant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          available_from: string | null
          available_until: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          restaurant_id: string
          sort_order: number
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          restaurant_id: string
          sort_order?: number
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          restaurant_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          dish_id: string
          id: string
          notes: string | null
          order_id: string
          quantity: number
          session_id: string
          status: Database["public"]["Enums"]["order_item_status"]
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dish_id: string
          id?: string
          notes?: string | null
          order_id: string
          quantity?: number
          session_id: string
          status?: Database["public"]["Enums"]["order_item_status"]
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dish_id?: string
          id?: string
          notes?: string | null
          order_id?: string
          quantity?: number
          session_id?: string
          status?: Database["public"]["Enums"]["order_item_status"]
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          participant_id: string | null
          restaurant_id: string
          session_id: string
          status: Database["public"]["Enums"]["order_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          participant_id?: string | null
          restaurant_id: string
          session_id: string
          status?: Database["public"]["Enums"]["order_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          participant_id?: string | null
          restaurant_id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_items: {
        Row: {
          amount: number
          order_item_id: string
          payment_id: string
        }
        Insert: {
          amount: number
          order_item_id: string
          payment_id: string
        }
        Update: {
          amount?: number
          order_item_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          participant_id: string | null
          provider: string | null
          provider_ref: string | null
          restaurant_id: string
          session_id: string
          status: Database["public"]["Enums"]["payment_status"]
          tip_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          participant_id?: string | null
          provider?: string | null
          provider_ref?: string | null
          restaurant_id: string
          session_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          tip_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          participant_id?: string | null
          provider?: string | null
          provider_ref?: string | null
          restaurant_id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          tip_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_guest: boolean
          loyalty_points: number
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_guest?: boolean
          loyalty_points?: number
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_guest?: boolean
          loyalty_points?: number
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          party_size: number
          reserved_at: string
          restaurant_id: string
          status: string
          table_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          party_size: number
          reserved_at: string
          restaurant_id: string
          status?: string
          table_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          party_size?: number
          reserved_at?: string
          restaurant_id?: string
          status?: string
          table_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_members: {
        Row: {
          created_at: string
          id: string
          restaurant_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          restaurant_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          restaurant_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_members_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          accepts_orders: boolean
          address: string | null
          cover_url: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json
          slug: string
          status: Database["public"]["Enums"]["restaurant_status"]
          updated_at: string
        }
        Insert: {
          accepts_orders?: boolean
          address?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json
          slug: string
          status?: Database["public"]["Enums"]["restaurant_status"]
          updated_at?: string
        }
        Update: {
          accepts_orders?: boolean
          address?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json
          slug?: string
          status?: Database["public"]["Enums"]["restaurant_status"]
          updated_at?: string
        }
        Relationships: []
      }
      session_participants: {
        Row: {
          display_name: string | null
          id: string
          is_guest: boolean
          joined_at: string
          last_seen_at: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          display_name?: string | null
          id?: string
          is_guest?: boolean
          joined_at?: string
          last_seen_at?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          display_name?: string | null
          id?: string
          is_guest?: boolean
          joined_at?: string
          last_seen_at?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      table_sessions: {
        Row: {
          closed_at: string | null
          id: string
          metadata: Json
          opened_at: string
          restaurant_id: string
          status: Database["public"]["Enums"]["session_status"]
          table_id: string
        }
        Insert: {
          closed_at?: string | null
          id?: string
          metadata?: Json
          opened_at?: string
          restaurant_id: string
          status?: Database["public"]["Enums"]["session_status"]
          table_id: string
        }
        Update: {
          closed_at?: string | null
          id?: string
          metadata?: Json
          opened_at?: string
          restaurant_id?: string
          status?: Database["public"]["Enums"]["session_status"]
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_sessions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_sessions_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          label: string
          nfc_uid: string | null
          qr_code_url: string | null
          restaurant_id: string
          sort_order: number
          status: Database["public"]["Enums"]["table_status"]
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          label: string
          nfc_uid?: string | null
          qr_code_url?: string | null
          restaurant_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["table_status"]
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          label?: string
          nfc_uid?: string | null
          qr_code_url?: string | null
          restaurant_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["table_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dietary_preferences: {
        Row: {
          allergen_id: string | null
          consent_given: boolean
          created_at: string
          diet_type: string | null
          id: string
          severity: Database["public"]["Enums"]["allergen_severity"]
          user_id: string
        }
        Insert: {
          allergen_id?: string | null
          consent_given?: boolean
          created_at?: string
          diet_type?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["allergen_severity"]
          user_id: string
        }
        Update: {
          allergen_id?: string | null
          consent_given?: boolean
          created_at?: string
          diet_type?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["allergen_severity"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dietary_preferences_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
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
      allergen_severity: "preference" | "intolerance" | "allergy"
      dish_allergen_type: "contains" | "may_contain"
      order_item_status:
        | "ordered"
        | "preparing"
        | "ready"
        | "delivered"
        | "paid"
        | "cancelled"
      order_status:
        | "draft"
        | "submitted"
        | "acknowledged"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      restaurant_status: "active" | "inactive" | "paused"
      session_status: "active" | "closed"
      table_status: "closed" | "open" | "occupied" | "settling"
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
    Enums: {
      allergen_severity: ["preference", "intolerance", "allergy"],
      dish_allergen_type: ["contains", "may_contain"],
      order_item_status: [
        "ordered",
        "preparing",
        "ready",
        "delivered",
        "paid",
        "cancelled",
      ],
      order_status: [
        "draft",
        "submitted",
        "acknowledged",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      restaurant_status: ["active", "inactive", "paused"],
      session_status: ["active", "closed"],
      table_status: ["closed", "open", "occupied", "settling"],
    },
  },
} as const
