import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types/appointment";
import { cn } from "@/lib/utils";

interface AppointmentStatusBadgeProps {
  status: string | null;
  className?: string;
}

const statusConfig: Record<AppointmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Scheduled", variant: "default" },
  confirmed: { label: "Confirmed", variant: "secondary" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  "no-show": { label: "No Show", variant: "destructive" },
};

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const config = statusConfig[(status as AppointmentStatus) || "scheduled"] || statusConfig.scheduled;

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
