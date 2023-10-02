export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tool: {
        Row: {
          asset_id: string
          diameter: number | null
          length: number | null
          location: string | null
          service_date: string | null
          type: number
          weight: number | null
        }
        Insert: {
          asset_id: string
          diameter?: number | null
          length?: number | null
          location?: string | null
          service_date?: string | null
          type: number
          weight?: number | null
        }
        Update: {
          asset_id?: string
          diameter?: number | null
          length?: number | null
          location?: string | null
          service_date?: string | null
          type?: number
          weight?: number | null
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
