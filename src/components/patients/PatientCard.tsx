import { format, differenceInYears } from "date-fns";
import { Mail, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/patient";

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
  className?: string;
  showActions?: boolean;
}

export function PatientCard({
  patient,
  onClick,
  className,
  showActions = false,
}: PatientCardProps) {
  const age = differenceInYears(new Date(), new Date(patient.date_of_birth));
  const initials = `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase();

  return (
    <Card
      className={cn(
        "transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">
                {patient.first_name} {patient.last_name}
              </h4>
              <Badge
                variant={patient.is_active ? "default" : "secondary"}
                className="shrink-0 text-xs"
              >
                {patient.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {age} years old • {patient.gender || "Unknown"}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              {patient.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {patient.phone}
                </span>
              )}
              {patient.email && (
                <span className="flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3" />
                  {patient.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
