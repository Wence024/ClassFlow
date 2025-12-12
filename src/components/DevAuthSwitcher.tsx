import { useState } from "react";
import { ChevronDown, ChevronUp, Bug, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const testUsers = [
  { email: "admin@example.com", password: "password123", role: "admin" },
  { email: "doctor@example.com", password: "password123", role: "doctor" },
  { email: "nurse@example.com", password: "password123", role: "nurse" },
  { email: "pharmacist@example.com", password: "password123", role: "pharmacist" },
  { email: "labtech@example.com", password: "password123", role: "lab_tech" },
  { email: "billing@example.com", password: "password123", role: "billing_clerk" },
  { email: "staff@example.com", password: "password123", role: "staff" },
  { email: "patient@example.com", password: "password123", role: "patient" },
];

const roleColors: Record<string, string> = {
  admin: "bg-destructive/15 text-destructive border-destructive/30",
  doctor: "bg-primary/15 text-primary border-primary/30",
  nurse: "bg-info/15 text-info border-info/30",
  pharmacist: "bg-success/15 text-success border-success/30",
  lab_tech: "bg-warning/15 text-warning border-warning/30",
  billing_clerk: "bg-accent/50 text-accent-foreground border-accent",
  staff: "bg-muted text-muted-foreground border-border",
  patient: "bg-secondary text-secondary-foreground border-secondary",
};

interface DevAuthSwitcherProps {
  onSelect: (email: string, password: string) => void;
}

export function DevAuthSwitcher({ onSelect }: DevAuthSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Bug className="h-3 w-3" />
          Dev Quick Login
          {isOpen ? (
            <ChevronUp className="ml-auto h-3 w-3" />
          ) : (
            <ChevronDown className="ml-auto h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-2">
          {testUsers.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => onSelect(user.email, user.password)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-background/80"
            >
              <User className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">
                {user.email.split("@")[0]}
              </span>
              <Badge
                variant="outline"
                className={`ml-auto shrink-0 text-[10px] px-1 py-0 ${roleColors[user.role] || ""}`}
              >
                {user.role.replace("_", " ")}
              </Badge>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
