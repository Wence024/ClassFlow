/**
 * Utility functions for inferring user department assignments.
 * 
 * These helpers are for DISPLAY and FILTERING purposes only, NOT for permission checks.
 * Always use RLS policies and server-side functions for actual authorization.
 */

import { supabase } from '../../../lib/supabase';

/**
 * Gets the user's department ID, either directly assigned or inferred through their program.
 * 
 * For Department Heads: Returns their explicitly assigned department_id.
 * For Program Heads: Infers department through their assigned program.
 * For Admins: Returns null (they manage all departments).
 * 
 * @param userId - The UUID of the user to get department for.
 * @returns The department UUID if found, otherwise null.
 */
export async function getUserDepartmentViaProgramOrDirect(
  userId: string
): Promise<string | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      department_id,
      program:program_id (
        department_id
      )
    `)
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return null;
  }

  // Use explicit department_id if set (for dept heads and admins)
  // Otherwise derive from program (for program heads)
  return profile.department_id ?? (profile.program as { department_id: string } | null)?.department_id ?? null;
}

/**
 * Gets the department name for display purposes.
 * 
 * @param userId - The UUID of the user.
 * @returns The department name if found, otherwise null.
 */
export async function getUserDepartmentName(userId: string): Promise<string | null> {
  const departmentId = await getUserDepartmentViaProgramOrDirect(userId);
  
  if (!departmentId) {
    return null;
  }

  const { data: department } = await supabase
    .from('departments')
    .select('name')
    .eq('id', departmentId)
    .single();

  return department?.name ?? null;
}
