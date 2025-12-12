import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientForm } from "./PatientForm";
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/types/patient";
import type { PatientFormValues } from "@/lib/validations/patient";

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
}

export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
}: PatientFormDialogProps) {
  const { toast } = useToast();
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const isEditing = !!patient;
  const isLoading = createPatient.isPending || updatePatient.isPending;

  const handleSubmit = async (data: PatientFormValues) => {
    try {
      if (isEditing) {
        await updatePatient.mutateAsync({ id: patient.id, data });
        toast({
          title: "Patient updated",
          description: "Patient information has been updated successfully.",
        });
      } else {
        await createPatient.mutateAsync(data);
        toast({
          title: "Patient registered",
          description: "New patient has been registered successfully.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Patient" : "Register New Patient"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the patient's information below."
              : "Fill in the patient's information to register them."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <PatientForm
            patient={patient}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
