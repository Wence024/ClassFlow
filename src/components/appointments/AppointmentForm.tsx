import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PatientSelect } from "@/components/patients/PatientSelect";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { useBookedTimeSlots } from "@/hooks/useAppointments";
import { appointmentFormSchema, type AppointmentFormValues } from "@/lib/validations/appointment";
import { cn } from "@/lib/utils";
import type { AppointmentWithRelations } from "@/types/appointment";

interface AppointmentFormProps {
  appointment?: AppointmentWithRelations | null;
  onSubmit: (data: AppointmentFormValues) => void;
  isSubmitting?: boolean;
  defaultPatientId?: string;
}

export function AppointmentForm({ appointment, onSubmit, isSubmitting, defaultPatientId }: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patient_id: appointment?.patient_id || defaultPatientId || "",
      doctor_id: appointment?.doctor_id || null,
      appointment_date: appointment?.appointment_date || "",
      appointment_time: appointment?.appointment_time || "",
      reason: appointment?.reason || "",
      notes: appointment?.notes || "",
      status: (appointment?.status as AppointmentFormValues["status"]) || "scheduled",
    },
  });

  const selectedDate = form.watch("appointment_date");
  const { data: bookedSlots = [] } = useBookedTimeSlots(selectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("appointment_date", format(date, "yyyy-MM-dd"));
      // Clear time when date changes since slots may differ
      form.setValue("appointment_time", "");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient *</FormLabel>
              <FormControl>
                <PatientSelect
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!!defaultPatientId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
        <FormField
          control={form.control}
          name="appointment_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Appointment Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(new Date(field.value), "MMMM d, yyyy") : "Select date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Slot Selection */}
        <FormField
          control={form.control}
          name="appointment_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Time *</FormLabel>
              <FormControl>
                <TimeSlotPicker
                  value={field.value}
                  onChange={field.onChange}
                  bookedSlots={bookedSlots}
                  disabled={!selectedDate}
                />
              </FormControl>
              <FormMessage />
              {!selectedDate && (
                <p className="text-xs text-muted-foreground">Select a date first</p>
              )}
            </FormItem>
          )}
        />

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Visit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the appointment reason..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status (only for editing) */}
        {appointment && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : appointment ? "Update Appointment" : "Schedule Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
