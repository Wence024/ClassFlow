import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLE_DISPLAY_NAMES: Record<AppRole, string> = {
  admin: "Administrator",
  doctor: "Doctor",
  nurse: "Nurse",
  pharmacist: "Pharmacist",
  lab_tech: "Lab Technician",
  billing_clerk: "Billing Clerk",
  receptionist: "Receptionist",
  staff: "Staff",
  patient: "Patient",
};

// Routes accessible by each role
export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  admin: [
    "/dashboard",
    "/patients",
    "/appointments",
    "/records",
    "/queue",
    "/prescriptions",
    "/lab",
    "/pharmacy",
    "/billing",
    "/staff",
    "/departments",
    "/settings",
  ],
  doctor: [
    "/dashboard",
    "/patients",
    "/appointments",
    "/records",
    "/queue",
    "/prescriptions",
    "/lab",
  ],
  nurse: [
    "/dashboard",
    "/patients",
    "/appointments",
    "/records",
    "/queue",
    "/prescriptions",
    "/lab",
  ],
  pharmacist: ["/dashboard", "/prescriptions", "/pharmacy"],
  lab_tech: ["/dashboard", "/lab", "/records"],
  billing_clerk: ["/dashboard", "/billing"],
  receptionist: [
    "/dashboard",
    "/patients",
    "/appointments",
    "/queue",
  ],
  staff: ["/dashboard", "/patients", "/appointments"],
  patient: [
    "/dashboard",
    "/appointments",
    "/records",
    "/prescriptions",
    "/lab",
    "/billing",
  ],
};

/**
 *
 * @param role
 * @param route
 */
export function hasRouteAccess(role: AppRole | null, route: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.some((p) => route.startsWith(p));
}

/**
 *
 * @param role
 */
export function getRoleDisplayName(role: AppRole): string {
  return ROLE_DISPLAY_NAMES[role] || role;
}
