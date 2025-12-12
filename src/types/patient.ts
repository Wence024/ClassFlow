import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Patient = Tables<"patients">;
export type PatientInsert = TablesInsert<"patients">;
export type PatientUpdate = TablesUpdate<"patients">;

export interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  allergies?: string;
  medical_history?: string;
}

export interface PatientFilters {
  search?: string;
  status?: "active" | "inactive" | "all";
}
