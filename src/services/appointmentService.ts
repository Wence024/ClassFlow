import { supabase } from "@/integrations/supabase/client";
import type { 
  Appointment, 
  AppointmentInsert, 
  AppointmentUpdate, 
  AppointmentFilters,
  AppointmentWithRelations,
  AppointmentStatus 
} from "@/types/appointment";

const APPOINTMENTS_PER_PAGE = 10;

export interface PaginatedAppointments {
  data: AppointmentWithRelations[];
  count: number;
  page: number;
  totalPages: number;
}

export async function getAppointments(
  filters: AppointmentFilters = {},
  page: number = 1
): Promise<PaginatedAppointments> {
  const from = (page - 1) * APPOINTMENTS_PER_PAGE;
  const to = from + APPOINTMENTS_PER_PAGE - 1;

  let query = supabase
    .from("appointments")
    .select(`
      *,
      patient:patients!appointments_patient_id_fkey (
        id, first_name, last_name, date_of_birth, phone, email
      )
    `, { count: "exact" });

  // Apply filters
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.dateFrom) {
    query = query.gte("appointment_date", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("appointment_date", filters.dateTo);
  }
  if (filters.patientId) {
    query = query.eq("patient_id", filters.patientId);
  }
  if (filters.doctorId) {
    query = query.eq("doctor_id", filters.doctorId);
  }

  const { data, error, count } = await query
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data as AppointmentWithRelations[]) || [],
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / APPOINTMENTS_PER_PAGE),
  };
}

export async function getAppointmentById(id: string): Promise<AppointmentWithRelations | null> {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients!appointments_patient_id_fkey (
        id, first_name, last_name, date_of_birth, phone, email
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as AppointmentWithRelations;
}

export async function getAppointmentsByPatient(patientId: string): Promise<AppointmentWithRelations[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients!appointments_patient_id_fkey (
        id, first_name, last_name, date_of_birth, phone, email
      )
    `)
    .eq("patient_id", patientId)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) throw error;
  return (data as AppointmentWithRelations[]) || [];
}

export async function getTodaysAppointments(): Promise<AppointmentWithRelations[]> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients!appointments_patient_id_fkey (
        id, first_name, last_name, date_of_birth, phone, email
      )
    `)
    .eq("appointment_date", today)
    .order("appointment_time", { ascending: true });

  if (error) throw error;
  return (data as AppointmentWithRelations[]) || [];
}

export async function getUpcomingAppointments(limit: number = 5): Promise<AppointmentWithRelations[]> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients!appointments_patient_id_fkey (
        id, first_name, last_name, date_of_birth, phone, email
      )
    `)
    .gte("appointment_date", today)
    .in("status", ["scheduled", "confirmed"])
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data as AppointmentWithRelations[]) || [];
}

export async function createAppointment(data: AppointmentInsert): Promise<Appointment> {
  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return appointment;
}

export async function updateAppointment(id: string, data: AppointmentUpdate): Promise<Appointment> {
  const { data: appointment, error } = await supabase
    .from("appointments")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return appointment;
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
  return updateAppointment(id, { status });
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  return updateAppointmentStatus(id, "cancelled");
}

export async function getBookedTimeSlots(date: string, doctorId?: string): Promise<string[]> {
  let query = supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date)
    .neq("status", "cancelled");

  if (doctorId) {
    query = query.eq("doctor_id", doctorId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data?.map((a) => a.appointment_time) || [];
}
