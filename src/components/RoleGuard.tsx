import { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { useUserRole } from "@/hooks/useUserRole";

import { Spinner } from "@/components/ui/spinner";

import type { AppRole } from "@/types/roles";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: AppRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 *
 * @param root0
 * @param root0.children
 * @param root0.allowedRoles
 * @param root0.fallback
 * @param root0.redirectTo
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo = "/dashboard",
}: RoleGuardProps) {
  const { role, isLoading } = useUserRole();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Component to conditionally render content based on role
interface RoleContentProps {
  children: ReactNode;
  allowedRoles: AppRole[];
  fallback?: ReactNode;
}

/**
 *
 * @param root0
 * @param root0.children
 * @param root0.allowedRoles
 * @param root0.fallback
 */
export function RoleContent({
  children,
  allowedRoles,
  fallback = null,
}: RoleContentProps) {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return null;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
