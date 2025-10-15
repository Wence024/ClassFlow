import { supabase } from '../../../lib/supabase';
import type { UserProfile, UserProfileUpdate, UserRole } from '../types/user';

/**
 * Fetches all users with their profile information and roles.
 *
 * @returns A promise that resolves to an array of UserProfile objects.
 */
export async function getUsers(): Promise<UserProfile[]> {
  // Fetch profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, program_id, department_id')
    .order('full_name');

  if (profileError) throw profileError;
  if (!profiles) return [];

  // Fetch all user roles
  const rolePromises = profiles.map(async (profile) => {
    const roleResult = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', profile.id)
      .single();
    return { userId: profile.id, role: (roleResult.data as UserRole)?.role || 'program_head' };
  });

  const roles = await Promise.all(rolePromises);
  const roleMap = new Map(roles.map((r) => [r.userId, r.role]));

  // Combine profiles with roles
  return profiles.map((profile) => ({
    id: profile.id,
    full_name: profile.full_name,
    role: roleMap.get(profile.id) || 'program_head',
    program_id: profile.program_id,
    department_id: profile.department_id,
  }));
}

/**
 * Updates a user's profile (admin only via RPC).
 *
 * @param userId - The ID of the user to update.
 * @param updates - The profile fields to update.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<void> {
  // Note: This requires the admin_update_user_profile RPC function to exist in Supabase
  // Run the migration first before using this function
  const { error } = await supabase.rpc('admin_update_user_profile', {
    target_user_id: userId,
    new_role: updates.role,
    new_program_id: updates.program_id,
    new_department_id: updates.department_id,
  });
  
  if (error) throw error;
}
