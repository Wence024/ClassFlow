import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

/**
 *
 */
export function useNurseDashboard() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["nurse-dashboard-stats", today],
    queryFn: async () => {
      const [queueRes, appointmentsRes] = await Promise.all([
        supabase
          .from("patient_queue")
          .select("id", { count: "exact", head: true })
          .eq("status", "waiting"),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("appointment_date", today),
      ]);

      return {
        patientsInQueue: queueRes.count ?? 0,
        todayAppointments: appointmentsRes.count ?? 0,
      };
    },
  });

  const { data: queue, isLoading: loadingQueue } = useQuery({
    queryKey: ["nurse-patient-queue"],
    queryFn: async () => {
      const { data } = await supabase
        .from("patient_queue")
        .select(`
          id,
          queue_number,
          status,
          priority,
          patients (first_name, last_name)
        `)
        .in("status", ["waiting", "in_progress"])
        .order("queue_position", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return {
    stats: stats ?? { patientsInQueue: 0, todayAppointments: 0 },
    queue: queue ?? [],
    isLoading,
    loadingQueue,
  };
}

/**
 *
 */
export function usePharmacistDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["pharmacist-dashboard-stats"],
    queryFn: async () => {
      const [prescriptionsRes, lowStockRes] = await Promise.all([
        supabase
          .from("prescriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("pharmacy_inventory")
          .select("id, quantity_available, minimum_stock_level"),
      ]);

      const lowStockItems = (lowStockRes.data ?? []).filter(
        (item) => (item.quantity_available ?? 0) < (item.minimum_stock_level ?? 10)
      );

      return {
        pendingPrescriptions: prescriptionsRes.count ?? 0,
        lowStockCount: lowStockItems.length,
      };
    },
  });

  const { data: lowStockItems, isLoading: loadingInventory } = useQuery({
    queryKey: ["pharmacist-low-stock"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pharmacy_inventory")
        .select("id, name, quantity_available, minimum_stock_level")
        .order("quantity_available", { ascending: true })
        .limit(5);
      
      return (data ?? []).filter(
        (item) => (item.quantity_available ?? 0) < (item.minimum_stock_level ?? 10)
      );
    },
  });

  return {
    stats: stats ?? { pendingPrescriptions: 0, lowStockCount: 0 },
    lowStockItems: lowStockItems ?? [],
    isLoading,
    loadingInventory,
  };
}

/**
 *
 */
export function useLabTechDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["lab-tech-dashboard-stats"],
    queryFn: async () => {
      const [pendingRes, urgentRes, completedRes] = await Promise.all([
        supabase
          .from("lab_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("lab_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending")
          .eq("priority", "urgent"),
        supabase
          .from("lab_results")
          .select("id", { count: "exact", head: true })
          .eq("status", "completed"),
      ]);

      return {
        pendingRequests: pendingRes.count ?? 0,
        urgentRequests: urgentRes.count ?? 0,
        completedToday: completedRes.count ?? 0,
      };
    },
  });

  const { data: pendingRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["lab-tech-pending-requests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("lab_requests")
        .select(`
          id,
          requested_date,
          priority,
          status,
          patients (first_name, last_name)
        `)
        .eq("status", "pending")
        .order("priority", { ascending: true })
        .order("requested_date", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return {
    stats: stats ?? { pendingRequests: 0, urgentRequests: 0, completedToday: 0 },
    pendingRequests: pendingRequests ?? [],
    isLoading,
    loadingRequests,
  };
}

/**
 *
 */
export function useBillingClerkDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["billing-clerk-dashboard-stats"],
    queryFn: async () => {
      const [pendingRes, paidRes] = await Promise.all([
        supabase
          .from("billing")
          .select("id, amount_due", { count: "exact" })
          .eq("status", "pending"),
        supabase
          .from("billing")
          .select("amount_paid")
          .eq("status", "paid"),
      ]);

      const pendingAmount = (pendingRes.data ?? []).reduce(
        (sum, bill) => sum + (bill.amount_due ?? 0),
        0
      );
      const collectedAmount = (paidRes.data ?? []).reduce(
        (sum, bill) => sum + (bill.amount_paid ?? 0),
        0
      );

      return {
        pendingBills: pendingRes.count ?? 0,
        pendingAmount,
        collectedAmount,
      };
    },
  });

  const { data: pendingBills, isLoading: loadingBills } = useQuery({
    queryKey: ["billing-clerk-pending-bills"],
    queryFn: async () => {
      const { data } = await supabase
        .from("billing")
        .select(`
          id,
          bill_date,
          total_amount,
          amount_due,
          status,
          patients (first_name, last_name)
        `)
        .eq("status", "pending")
        .order("bill_date", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return {
    stats: stats ?? { pendingBills: 0, pendingAmount: 0, collectedAmount: 0 },
    pendingBills: pendingBills ?? [],
    isLoading,
    loadingBills,
  };
}

/**
 *
 */
export function useReceptionistDashboard() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["receptionist-dashboard-stats", today],
    queryFn: async () => {
      const [appointmentsRes, queueRes, patientsRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("appointment_date", today),
        supabase
          .from("patient_queue")
          .select("id", { count: "exact", head: true })
          .eq("status", "waiting"),
        supabase
          .from("patients")
          .select("id", { count: "exact", head: true }),
      ]);

      return {
        todayAppointments: appointmentsRes.count ?? 0,
        patientsWaiting: queueRes.count ?? 0,
        totalPatients: patientsRes.count ?? 0,
      };
    },
  });

  const { data: todayAppointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ["receptionist-today-appointments", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_time,
          status,
          patients (first_name, last_name)
        `)
        .eq("appointment_date", today)
        .order("appointment_time", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return {
    stats: stats ?? { todayAppointments: 0, patientsWaiting: 0, totalPatients: 0 },
    todayAppointments: todayAppointments ?? [],
    isLoading,
    loadingAppointments,
  };
}
