import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Appointment = Tables<"appointments">;
export type AppointmentInsert = TablesInsert<"appointments">;
export type AppointmentUpdate = TablesUpdate<"appointments">;

export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";

export interface AppointmentWithRelations extends Appointment {
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone: string | null;
    email: string | null;
  } | null;
}

export interface AppointmentFormData {
  patient_id: string;
  doctor_id?: string | null;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  search?: string;
  status?: AppointmentStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  doctorId?: string;
  patientId?: string;
}
