import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentForm } from "./AppointmentForm";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import type { AppointmentFormValues } from "@/lib/validations/appointment";
import type { AppointmentWithRelations } from "@/types/appointment";

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: AppointmentWithRelations | null;
  defaultPatientId?: string;
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
  defaultPatientId,
}: AppointmentFormDialogProps) {
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const isEditing = !!appointment;
  const isSubmitting = createAppointment.isPending || updateAppointment.isPending;

  const handleSubmit = async (data: AppointmentFormValues) => {
    try {
      if (isEditing && appointment) {
        await updateAppointment.mutateAsync({ id: appointment.id, data });
      } else {
        await createAppointment.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Appointment" : "Schedule Appointment"}
          </DialogTitle>
        </DialogHeader>
        <AppointmentForm
          appointment={appointment}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultPatientId={defaultPatientId}
        />
      </DialogContent>
    </Dialog>
  );
}
