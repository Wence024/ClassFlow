import { z } from "zod";

export const appointmentFormSchema = z.object({
  patient_id: z.string().uuid({ message: "Please select a patient" }),
  doctor_id: z.string().uuid().nullable().optional(),
  appointment_date: z.string().min(1, { message: "Appointment date is required" }),
  appointment_time: z.string().min(1, { message: "Appointment time is required" }),
  reason: z.string().max(500, { message: "Reason must be less than 500 characters" }).optional(),
  notes: z.string().max(1000, { message: "Notes must be less than 1000 characters" }).optional(),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled", "no-show"]).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
