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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          doctor_id: string | null
          id: string
          notes: string | null
          patient_id: string
          reason: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      billing: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          bill_date: string
          created_at: string | null
          due_date: string | null
          id: string
          insurance_claim_id: string | null
          notes: string | null
          patient_id: string
          payment_method: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          bill_date: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          insurance_claim_id?: string | null
          notes?: string | null
          patient_id: string
          payment_method?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          bill_date?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          insurance_claim_id?: string | null
          notes?: string | null
          patient_id?: string
          payment_method?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_items: {
        Row: {
          billing_id: string
          created_at: string | null
          id: string
          item_description: string
          item_type: string
          quantity: number
          total_amount: number | null
          unit_price: number
        }
        Insert: {
          billing_id: string
          created_at?: string | null
          id?: string
          item_description: string
          item_type: string
          quantity?: number
          total_amount?: number | null
          unit_price: number
        }
        Update: {
          billing_id?: string
          created_at?: string | null
          id?: string
          item_description?: string
          item_type?: string
          quantity?: number
          total_amount?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_billing_id_fkey"
            columns: ["billing_id"]
            isOneToOne: false
            referencedRelation: "billing"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          head_doctor_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          head_doctor_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          head_doctor_id?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      lab_requests: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          medical_record_id: string | null
          notes: string | null
          patient_id: string
          priority: string | null
          requested_by: string | null
          requested_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          medical_record_id?: string | null
          notes?: string | null
          patient_id: string
          priority?: string | null
          requested_by?: string | null
          requested_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          medical_record_id?: string | null
          notes?: string | null
          patient_id?: string
          priority?: string | null
          requested_by?: string | null
          requested_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_requests_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          created_at: string | null
          id: string
          lab_request_id: string
          notes: string | null
          results: Json | null
          reviewed_by: string | null
          reviewed_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lab_request_id: string
          notes?: string | null
          results?: Json | null
          reviewed_by?: string | null
          reviewed_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lab_request_id?: string
          notes?: string | null
          results?: Json | null
          reviewed_by?: string | null
          reviewed_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_lab_request_id_fkey"
            columns: ["lab_request_id"]
            isOneToOne: false
            referencedRelation: "lab_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_tests: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          normal_range: string | null
          units: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          normal_range?: string | null
          units?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          normal_range?: string | null
          units?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          date: string
          description: string | null
          diagnosis: string | null
          doctor_id: string | null
          id: string
          patient_id: string
          prescribed_medications: Json | null
          record_type: string
          title: string
          treatment: string | null
          updated_at: string | null
          vital_signs: Json | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          date: string
          description?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          patient_id: string
          prescribed_medications?: Json | null
          record_type: string
          title: string
          treatment?: string | null
          updated_at?: string | null
          vital_signs?: Json | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          date?: string
          description?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          patient_id?: string
          prescribed_medications?: Json | null
          record_type?: string
          title?: string
          treatment?: string | null
          updated_at?: string | null
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_staff: {
        Row: {
          created_at: string | null
          department_id: string | null
          id: string
          license_number: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          license_number?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          license_number?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_staff_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_queue: {
        Row: {
          called_time: string | null
          created_at: string | null
          department_id: string | null
          doctor_id: string | null
          end_time: string | null
          estimated_wait_time: number | null
          id: string
          notes: string | null
          patient_id: string
          priority: string | null
          queue_number: string
          queue_position: number | null
          start_time: string | null
          status: string | null
        }
        Insert: {
          called_time?: string | null
          created_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          end_time?: string | null
          estimated_wait_time?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          priority?: string | null
          queue_number: string
          queue_position?: number | null
          start_time?: string | null
          status?: string | null
        }
        Update: {
          called_time?: string | null
          created_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          end_time?: string | null
          estimated_wait_time?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          priority?: string | null
          queue_number?: string
          queue_position?: number | null
          start_time?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_queue_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_queue_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          auth_id: string | null
          created_at: string | null
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          is_active: boolean | null
          last_name: string
          medical_history: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          auth_id?: string | null
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          is_active?: boolean | null
          last_name: string
          medical_history?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          auth_id?: string | null
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          is_active?: boolean | null
          last_name?: string
          medical_history?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pharmacy_inventory: {
        Row: {
          batch_number: string | null
          category: string | null
          created_at: string | null
          dosage_form: string | null
          expiry_date: string | null
          generic_name: string | null
          id: string
          manufacturer: string | null
          minimum_stock_level: number | null
          name: string
          quantity_available: number | null
          strength: string | null
          supplier: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          category?: string | null
          created_at?: string | null
          dosage_form?: string | null
          expiry_date?: string | null
          generic_name?: string | null
          id?: string
          manufacturer?: string | null
          minimum_stock_level?: number | null
          name: string
          quantity_available?: number | null
          strength?: string | null
          supplier?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          category?: string | null
          created_at?: string | null
          dosage_form?: string | null
          expiry_date?: string | null
          generic_name?: string | null
          id?: string
          manufacturer?: string | null
          minimum_stock_level?: number | null
          name?: string
          quantity_available?: number | null
          strength?: string | null
          supplier?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      prescription_items: {
        Row: {
          created_at: string | null
          dosage: string
          duration: string | null
          frequency: string | null
          id: string
          instructions: string | null
          medication_id: string | null
          medication_name: string
          prescription_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          dosage: string
          duration?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          medication_id?: string | null
          medication_name: string
          prescription_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          dosage?: string
          duration?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          medication_id?: string | null
          medication_name?: string
          prescription_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string | null
          date_issued: string
          doctor_id: string | null
          id: string
          medical_record_id: string | null
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_issued: string
          doctor_id?: string | null
          id?: string
          medical_record_id?: string | null
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_issued?: string
          doctor_id?: string | null
          id?: string
          medical_record_id?: string | null
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "doctor"
        | "nurse"
        | "pharmacist"
        | "lab_tech"
        | "receptionist"
        | "staff"
        | "patient"
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
      app_role: [
        "admin",
        "doctor",
        "nurse",
        "pharmacist",
        "lab_tech",
        "receptionist",
        "staff",
        "patient",
      ],
    },
  },
} as const
