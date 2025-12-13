import { format, differenceInYears } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ExternalLink, Phone, Mail, Shield } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "@/types/patient";

interface PatientQuickViewProps {
  patient: Patient;
  children: React.ReactNode;
}

export function PatientQuickView({ patient, children }: PatientQuickViewProps) {
  const navigate = useNavigate();
  const age = differenceInYears(new Date(), new Date(patient.date_of_birth));
  const initials = `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase();

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 z-50" align="start">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">
                  {patient.first_name} {patient.last_name}
                </h4>
                <Badge
                  variant={patient.is_active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {patient.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {age} years • {patient.gender || "Unknown"} •{" "}
                {format(new Date(patient.date_of_birth), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            {patient.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{patient.email}</span>
              </div>
            )}
          </div>

          {/* Allergies Warning */}
          {patient.allergies && (
            <>
              <Separator />
              <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Allergies</p>
                  <p className="text-xs">{patient.allergies}</p>
                </div>
              </div>
            </>
          )}

          {/* Insurance */}
          {patient.insurance_provider && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>
                {patient.insurance_provider}
                {patient.insurance_policy_number &&
                  ` (${patient.insurance_policy_number})`}
              </span>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate(`/patients/${patient.id}`)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Profile
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
