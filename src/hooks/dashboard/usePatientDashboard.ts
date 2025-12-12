import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 *
 */
export function usePatientDashboard() {
  const { user } = useAuth();

  // First get patient record
  const { data: patient } = useQuery({
    queryKey: ["patient-record", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["patient-dashboard-stats", patient?.id],
    queryFn: async () => {
      if (!patient?.id) return { upcomingAppointments: 0, activePrescriptions: 0, pendingBills: 0 };

      const [appointmentsRes, prescriptionsRes, billsRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("patient_id", patient.id)
          .eq("status", "scheduled"),
        supabase
          .from("prescriptions")
          .select("id", { count: "exact", head: true })
          .eq("patient_id", patient.id)
          .eq("status", "active"),
        supabase
          .from("billing")
          .select("id", { count: "exact", head: true })
          .eq("patient_id", patient.id)
          .eq("status", "pending"),
      ]);

      return {
        upcomingAppointments: appointmentsRes.count ?? 0,
        activePrescriptions: prescriptionsRes.count ?? 0,
        pendingBills: billsRes.count ?? 0,
      };
    },
    enabled: !!patient?.id,
  });

  const { data: upcomingAppointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ["patient-appointments", patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];
      const { data } = await supabase
        .from("appointments")
        .select("id, appointment_date, appointment_time, reason, status")
        .eq("patient_id", patient.id)
        .eq("status", "scheduled")
        .order("appointment_date", { ascending: true })
        .limit(5);
      return data ?? [];
    },
    enabled: !!patient?.id,
  });

  return {
    stats: stats ?? { upcomingAppointments: 0, activePrescriptions: 0, pendingBills: 0 },
    upcomingAppointments: upcomingAppointments ?? [],
    isLoading,
    loadingAppointments,
  };
}
