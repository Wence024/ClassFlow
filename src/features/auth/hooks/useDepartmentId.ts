import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePrograms } from '../../programs/hooks/usePrograms';

/**
 * Returns the user's department ID, deriving it from their program if needed.
 * 
 * This hook provides CLIENT-SIDE department inference for UI display purposes.
 * It should NOT be used for permission checks (use RLS policies instead).
 * 
 * For Department Heads: Returns their explicitly assigned department_id.
 * For Program Heads: Infers department through their assigned program.
 * For Admins: Returns null (they manage all departments).
 * 
 * @returns The user's department ID (explicit or inferred), or null.
 */
export function useDepartmentId(): string | null {
  const { user } = useAuth();
  const { listQuery } = usePrograms();
  const programs = listQuery.data || [];

  const departmentId = useMemo(() => {
    if (!user) return null;
    
    // 1. Use explicit department_id (for dept heads)
    if (user.department_id) return user.department_id;
    
    // 2. Derive from program (for program heads)
    if (user.program_id) {
      const program = programs.find(p => p.id === user.program_id);
      return program?.department_id || null;
    }
    
    // 3. No department assignment (admins)
    return null;
  }, [user, programs]);

  return departmentId;
}
