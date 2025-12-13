import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { AppointmentWithRelations } from "@/types/appointment";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: AppointmentWithRelations;
  onClick?: () => void;
  className?: string;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

export function AppointmentCard({ appointment, onClick, className }: AppointmentCardProps) {
  const patientName = appointment.patient
    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
    : "Unknown Patient";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{patientName}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(appointment.appointment_time)}
              </div>
            </div>
            {appointment.reason && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {appointment.reason}
              </p>
            )}
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
      </CardContent>
    </Card>
  );
}
