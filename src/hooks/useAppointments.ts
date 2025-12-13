import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { AppointmentFilters, AppointmentStatus, AppointmentInsert, AppointmentUpdate } from "@/types/appointment";
import * as appointmentService from "@/services/appointmentService";

export function useAppointments(filters: AppointmentFilters = {}, page: number = 1) {
  return useQuery({
    queryKey: ["appointments", filters, page],
    queryFn: () => appointmentService.getAppointments(filters, page),
  });
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => (id ? appointmentService.getAppointmentById(id) : null),
    enabled: !!id,
  });
}

export function usePatientAppointments(patientId: string | undefined) {
  return useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => (patientId ? appointmentService.getAppointmentsByPatient(patientId) : []),
    enabled: !!patientId,
  });
}

export function useTodaysAppointments() {
  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: appointmentService.getTodaysAppointments,
  });
}

export function useUpcomingAppointments(limit: number = 5) {
  return useQuery({
    queryKey: ["appointments", "upcoming", limit],
    queryFn: () => appointmentService.getUpcomingAppointments(limit),
  });
}

export function useBookedTimeSlots(date: string | undefined, doctorId?: string) {
  return useQuery({
    queryKey: ["appointments", "slots", date, doctorId],
    queryFn: () => (date ? appointmentService.getBookedTimeSlots(date, doctorId) : []),
    enabled: !!date,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentInsert) => appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Appointment Created",
        description: "The appointment has been scheduled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create appointment.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentUpdate }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Appointment Updated",
        description: "The appointment has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentService.updateAppointmentStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Status Updated",
        description: `Appointment marked as ${variables.status}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment.",
        variant: "destructive",
      });
    },
  });
}
