export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      OrderItem: {
        Row: {
          color: string | null
          createdAt: string
          customColor: string | null
          hardware_type: string | null
          height: number | null
          id: string
          material: string | null
          measurement_given: string | null
          notes: string | null
          number_of_panels: string | null
          opening_type: string | null
          pocket_type: string | null
          productNumber: string | null
          quoteId: string
          slab_type: string | null
          stack_type: string | null
          style: string | null
          subStyle: string | null
          type: string
          updatedAt: string
          vendor_style: string | null
          width: number | null
        }
        Insert: {
          color?: string | null
          createdAt?: string
          customColor?: string | null
          hardware_type?: string | null
          height?: number | null
          id: string
          material?: string | null
          measurement_given?: string | null
          notes?: string | null
          number_of_panels?: string | null
          opening_type?: string | null
          pocket_type?: string | null
          productNumber?: string | null
          quoteId: string
          slab_type?: string | null
          stack_type?: string | null
          style?: string | null
          subStyle?: string | null
          type: string
          updatedAt: string
          vendor_style?: string | null
          width?: number | null
        }
        Update: {
          color?: string | null
          createdAt?: string
          customColor?: string | null
          hardware_type?: string | null
          height?: number | null
          id?: string
          material?: string | null
          measurement_given?: string | null
          notes?: string | null
          number_of_panels?: string | null
          opening_type?: string | null
          pocket_type?: string | null
          productNumber?: string | null
          quoteId?: string
          slab_type?: string | null
          stack_type?: string | null
          style?: string | null
          subStyle?: string | null
          type?: string
          updatedAt?: string
          vendor_style?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "OrderItem_quoteId_fkey"
            columns: ["quoteId"]
            isOneToOne: false
            referencedRelation: "Quote"
            referencedColumns: ["id"]
          },
        ]
      }
      Quote: {
        Row: {
          builderName: string
          createdAt: string
          id: string
          jobName: string
          quote_number: number | null
          updatedAt: string
          user_id: string | null
        }
        Insert: {
          builderName: string
          createdAt?: string
          id: string
          jobName: string
          quote_number?: number | null
          updatedAt: string
          user_id?: string | null
        }
        Update: {
          builderName?: string
          createdAt?: string
          id?: string
          jobName?: string
          quote_number?: number | null
          updatedAt?: string
          user_id?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          approved: boolean | null
          created_at: string | null
          id: string
          item_id: string
          photo_url: string
          team_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          item_id: string
          photo_url: string
          team_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          item_id?: string
          photo_url?: string
          team_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          name: string
          score: number | null
        }
        Insert: {
          id?: string
          name: string
          score?: number | null
        }
        Update: {
          id?: string
          name?: string
          score?: number | null
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
