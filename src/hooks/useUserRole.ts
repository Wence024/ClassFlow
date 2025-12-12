import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/types/roles";

export function useUserRole() {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.rpc("get_user_role", {
        _user_id: user.id,
      });

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return data as AppRole | null;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const hasRole = (targetRole: AppRole): boolean => {
    return role === targetRole;
  };

  const hasAnyRole = (targetRoles: AppRole[]): boolean => {
    if (!role) return false;
    return targetRoles.includes(role);
  };

  return {
    role,
    isLoading,
    hasRole,
    hasAnyRole,
  };
}
