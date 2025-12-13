import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Eye, Pencil, XCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientQuickView } from "@/components/patients/PatientQuickView";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { AppointmentFormDialog } from "./AppointmentFormDialog";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";
import { useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import type { AppointmentWithRelations } from "@/types/appointment";
import type { Patient } from "@/types/patient";

interface AppointmentTableProps {
  appointments: AppointmentWithRelations[];
  isLoading?: boolean;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

export function AppointmentTable({ appointments, isLoading }: AppointmentTableProps) {
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState<AppointmentWithRelations | null>(null);
  const updateStatus = useUpdateAppointmentStatus();

  const handleConfirm = (id: string) => {
    updateStatus.mutate({ id, status: "confirmed" });
  };

  const handleComplete = (id: string) => {
    updateStatus.mutate({ id, status: "completed" });
  };

  const handleNoShow = (id: string) => {
    updateStatus.mutate({ id, status: "no-show" });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No appointments found
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => {
              const patientName = appointment.patient
                ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                : "Unknown";

              const patientForQuickView = appointment.patient ? {
                ...appointment.patient,
                gender: null,
                address: null,
                allergies: null,
                medical_history: null,
                emergency_contact_name: null,
                emergency_contact_phone: null,
                insurance_provider: null,
                insurance_policy_number: null,
                is_active: true,
                user_id: null,
                auth_id: null,
                created_at: null,
                updated_at: null,
              } as Patient : null;

              return (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {patientForQuickView ? (
                      <PatientQuickView patient={patientForQuickView}>
                        <button className="font-medium hover:text-primary hover:underline">
                          {patientName}
                        </button>
                      </PatientQuickView>
                    ) : (
                      <span className="font-medium">{patientName}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{formatTime(appointment.appointment_time)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {appointment.reason || "-"}
                  </TableCell>
                  <TableCell>
                    <AppointmentStatusBadge status={appointment.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingAppointment(appointment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {appointment.status === "scheduled" && (
                          <DropdownMenuItem onClick={() => handleConfirm(appointment.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm
                          </DropdownMenuItem>
                        )}
                        {(appointment.status === "scheduled" || appointment.status === "confirmed") && (
                          <>
                            <DropdownMenuItem onClick={() => handleComplete(appointment.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNoShow(appointment.id)}>
                              <Clock className="mr-2 h-4 w-4" />
                              Mark No-Show
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setCancellingAppointment(appointment)}
                              className="text-destructive focus:text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AppointmentFormDialog
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
        appointment={editingAppointment}
      />

      <CancelAppointmentDialog
        open={!!cancellingAppointment}
        onOpenChange={(open) => !open && setCancellingAppointment(null)}
        appointmentId={cancellingAppointment?.id || ""}
        patientName={
          cancellingAppointment?.patient
            ? `${cancellingAppointment.patient.first_name} ${cancellingAppointment.patient.last_name}`
            : undefined
        }
      />
    </>
  );
}
