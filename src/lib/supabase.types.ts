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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      class_groups: {
        Row: {
          code: string | null
          color: string | null
          created_at: string | null
          id: string
          name: string
          program_id: string | null
          student_count: number | null
          user_id: string
        }
        Insert: {
          code?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          program_id?: string | null
          student_count?: number | null
          user_id: string
        }
        Update: {
          code?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          program_id?: string | null
          student_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_groups_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          class_group_id: string
          classroom_id: string
          course_id: string
          created_at: string | null
          id: string
          instructor_id: string
          period_count: number
          program_id: string | null
          user_id: string
        }
        Insert: {
          class_group_id: string
          classroom_id: string
          course_id: string
          created_at?: string | null
          id?: string
          instructor_id: string
          period_count: number
          program_id?: string | null
          user_id: string
        }
        Update: {
          class_group_id?: string
          classroom_id?: string
          course_id?: string
          created_at?: string | null
          id?: string
          instructor_id?: string
          period_count?: number
          program_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_class_group_id_fkey"
            columns: ["class_group_id"]
            isOneToOne: false
            referencedRelation: "class_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          capacity: number | null
          code: string | null
          color: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          id: string
          location: string | null
          name: string
          preferred_department_id: string | null
        }
        Insert: {
          capacity?: number | null
          code?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          id?: string
          location?: string | null
          name: string
          preferred_department_id?: string | null
        }
        Update: {
          capacity?: number | null
          code?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          id?: string
          location?: string | null
          name?: string
          preferred_department_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classrooms_preferred_department_id_fkey"
            columns: ["preferred_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          color: string | null
          created_at: string | null
          id: string
          name: string
          program_id: string | null
          user_id: string
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          program_id?: string | null
          user_id: string
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          program_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          code: string | null
          color: string | null
          contract_type: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          prefix: string | null
          suffix: string | null
        }
        Insert: {
          code?: string | null
          color?: string | null
          contract_type?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          prefix?: string | null
          suffix?: string | null
        }
        Update: {
          code?: string | null
          color?: string | null
          contract_type?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          prefix?: string | null
          suffix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          department_id: string | null
          full_name: string | null
          id: string
          program_id: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          department_id?: string | null
          full_name?: string | null
          id: string
          program_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          department_id?: string | null
          full_name?: string | null
          id?: string
          program_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          id: string
          name: string
          short_code: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          short_code: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          short_code?: string
        }
        Relationships: []
      }
      resource_requests: {
        Row: {
          id: string
          notes: string | null
          requested_at: string | null
          requester_id: string
          requesting_program_id: string
          resource_id: string
          resource_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          target_department_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          requested_at?: string | null
          requester_id: string
          requesting_program_id: string
          resource_id: string
          resource_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_department_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          requested_at?: string | null
          requester_id?: string
          requesting_program_id?: string
          resource_id?: string
          resource_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_department_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_requests_requesting_program_id_fkey"
            columns: ["requesting_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_requests_target_department_id_fkey"
            columns: ["target_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_configuration: {
        Row: {
          class_days_per_week: number
          created_at: string
          id: string
          period_duration_mins: number
          periods_per_day: number
          semester_id: string | null
          start_time: string
        }
        Insert: {
          class_days_per_week?: number
          created_at?: string
          id?: string
          period_duration_mins?: number
          periods_per_day?: number
          semester_id?: string | null
          start_time?: string
        }
        Update: {
          class_days_per_week?: number
          created_at?: string
          id?: string
          period_duration_mins?: number
          periods_per_day?: number
          semester_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_configuration_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: true
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      timetable_assignments: {
        Row: {
          class_group_id: string
          class_session_id: string
          created_at: string | null
          id: string
          period_index: number
          semester_id: string
          user_id: string
        }
        Insert: {
          class_group_id: string
          class_session_id: string
          created_at?: string | null
          id?: string
          period_index: number
          semester_id: string
          user_id: string
        }
        Update: {
          class_group_id?: string
          class_session_id?: string
          created_at?: string | null
          id?: string
          period_index?: number
          semester_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_assignments_class_group_id_fkey"
            columns: ["class_group_id"]
            isOneToOne: false
            referencedRelation: "class_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_assignments_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_assignments_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
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
      user_role: "admin" | "department_head" | "program_head"
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
      user_role: ["admin", "department_head", "program_head"],
    },
  },
} as const
