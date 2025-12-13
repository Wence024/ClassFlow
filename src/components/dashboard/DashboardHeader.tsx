import { useAuth } from "@/contexts/AuthContext";

import { ROLE_DISPLAY_NAMES } from "@/types/roles";
import type { AppRole } from "@/types/roles";

interface DashboardHeaderProps {
  role: AppRole | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 *
 * @param root0
 * @param root0.role
 */
export function DashboardHeader({ role }: DashboardHeaderProps) {
  const { user } = useAuth();
  const greeting = getGreeting();
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const roleDisplay = role ? ROLE_DISPLAY_NAMES[role] : "";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {greeting}, {userName}
      </h1>
      <p className="text-muted-foreground">
        {roleDisplay ? `Welcome to your ${roleDisplay} dashboard` : "Welcome to your dashboard"}
      </p>
    </div>
  );
}
