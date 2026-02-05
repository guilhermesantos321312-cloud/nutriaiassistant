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
            meals: {
                Row: {
                    calories: number
                    carbs: number
                    created_at: string | null
                    date: string
                    fats: number
                    id: string
                    name: string
                    protein: number
                    type: string
                    user_id: string
                }
                Insert: {
                    calories: number
                    carbs: number
                    created_at?: string | null
                    date: string
                    fats: number
                    id?: string
                    name: string
                    protein: number
                    type: string
                    user_id: string
                }
                Update: {
                    calories?: number
                    carbs?: number
                    created_at?: string | null
                    date?: string
                    fats?: number
                    id?: string
                    name?: string
                    protein?: number
                    type?: string
                    user_id?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    active_diet_id: string | null
                    base_goal: Json | null
                    created_at: string | null
                    email: string
                    id: string
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    active_diet_id?: string | null
                    base_goal?: Json | null
                    created_at?: string | null
                    email: string
                    id: string
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    active_diet_id?: string | null
                    base_goal?: Json | null
                    created_at?: string | null
                    email?: string
                    id?: string
                    name?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            saved_diets: {
                Row: {
                    created_at: string | null
                    days: Json
                    id: string
                    name: string
                    targets: Json
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    days: Json
                    id?: string
                    name: string
                    targets: Json
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    days?: Json
                    id?: string
                    name?: string
                    targets?: Json
                    user_id?: string
                }
                Relationships: []
            }
            saved_workouts: {
                Row: {
                    created_at: string | null
                    goal: string
                    id: string
                    level: string
                    name: string
                    sessions: Json
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    goal: string
                    id?: string
                    level: string
                    name: string
                    sessions: Json
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    goal?: string
                    id?: string
                    level?: string
                    name?: string
                    sessions?: Json
                    user_id?: string
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
