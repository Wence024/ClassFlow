import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePatient } from "@/hooks/usePatients";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/types/patient";

interface DeletePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

export function DeletePatientDialog({
  open,
  onOpenChange,
  patient,
}: DeletePatientDialogProps) {
  const { toast } = useToast();
  const deletePatient = useDeletePatient();

  const handleDelete = async () => {
    if (!patient) return;

    try {
      await deletePatient.mutateAsync(patient.id);
      toast({
        title: "Patient deactivated",
        description: "The patient has been marked as inactive.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deactivate patient",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Patient</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate{" "}
            <span className="font-medium">
              {patient?.first_name} {patient?.last_name}
            </span>
            ? This will mark the patient as inactive. You can reactivate them later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePatient.isPending ? "Deactivating..." : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
