import { supabase } from "@/integrations/supabase/client";
import type { Patient, PatientInsert, PatientUpdate, PatientFilters } from "@/types/patient";

const PAGE_SIZE = 20;

export interface PaginatedPatients {
  data: Patient[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPatients(
  filters: PatientFilters = {},
  page: number = 1
): Promise<PaginatedPatients> {
  let query = supabase
    .from("patients")
    .select("*", { count: "exact" });

  // Apply search filter
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(
      `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`
    );
  }

  // Apply status filter
  if (filters.status === "active") {
    query = query.eq("is_active", true);
  } else if (filters.status === "inactive") {
    query = query.eq("is_active", false);
  }

  // Apply pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
  };
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createPatient(patient: PatientInsert): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .insert(patient)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePatient(
  id: string,
  updates: PatientUpdate
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePatient(id: string): Promise<void> {
  // Soft delete - set is_active to false
  const { error } = await supabase
    .from("patients")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
