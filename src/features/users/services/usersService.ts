import { supabase } from '../../../lib/supabase';
import type { UserProfile, UserProfileUpdate } from '../types/user';

/**
 * Fetches all users with their profile information.
 *
 * @returns A promise that resolves to an array of UserProfile objects.
 */
export async function getUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, program_id, department_id')
    .order('full_name');
  
  if (error) throw error;
  return (data || []) as UserProfile[];
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
  const { error } = await (supabase.rpc as any)('admin_update_user_profile', {
    target_user_id: userId,
    new_role: updates.role,
    new_program_id: updates.program_id,
    new_department_id: updates.department_id,
  });
  
  if (error) throw error;
}
