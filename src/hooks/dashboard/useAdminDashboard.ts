import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const [patientsRes, appointmentsRes, staffRes, departmentsRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
        supabase.from("medical_staff").select("id", { count: "exact", head: true }),
        supabase.from("departments").select("id", { count: "exact", head: true }),
      ]);

      return {
        totalPatients: patientsRes.count ?? 0,
        pendingAppointments: appointmentsRes.count ?? 0,
        totalStaff: staffRes.count ?? 0,
        totalDepartments: departmentsRes.count ?? 0,
      };
    },
  });

  const { data: recentPatients, isLoading: loadingPatients } = useQuery({
    queryKey: ["admin-recent-patients"],
    queryFn: async () => {
      const { data } = await supabase
        .from("patients")
        .select("id, first_name, last_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return {
    stats: stats ?? { totalPatients: 0, pendingAppointments: 0, totalStaff: 0, totalDepartments: 0 },
    recentPatients: recentPatients ?? [],
    isLoading,
    loadingPatients,
  };
}
