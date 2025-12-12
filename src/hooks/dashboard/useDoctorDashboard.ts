import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

/**
 *
 */
export function useDoctorDashboard() {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["doctor-dashboard-stats", user?.id, today],
    queryFn: async () => {
      const [appointmentsRes, recordsRes, labRequestsRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("appointment_date", today),
        supabase
          .from("medical_records")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("lab_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

      return {
        todayAppointments: appointmentsRes.count ?? 0,
        totalRecords: recordsRes.count ?? 0,
        pendingLabRequests: labRequestsRes.count ?? 0,
      };
    },
    enabled: !!user?.id,
  });

  const { data: todayAppointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ["doctor-today-appointments", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_time,
          reason,
          status,
          patients (id, first_name, last_name)
        `)
        .eq("appointment_date", today)
        .order("appointment_time", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return {
    stats: stats ?? { todayAppointments: 0, totalRecords: 0, pendingLabRequests: 0 },
    todayAppointments: todayAppointments ?? [],
    isLoading,
    loadingAppointments,
  };
}
