import { supabase } from '../../../lib/supabase';
import type { Role, UserProfile, UserProfileUpdate } from '../types/user';

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
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', profile.id)
      .single();
    // The role from the database is a string, so we cast it to Role.
    // We provide a default value of 'program_head' if no role is found.
    const role = (roleData?.role as Role) || 'program_head';
    return { userId: profile.id, role };
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
    new_program_id: updates.program_id === null ? undefined : updates.program_id,
    new_department_id: updates.department_id === null ? undefined : updates.department_id,
  });

  if (error) throw error;
}

/**
 * Invites a new user by email with a specific role and assignments (admin only).
 * This function calls a secure edge function to send an invitation link.
 *
 * @param invite - The invitation details.
 * @param invite.email - The email of the user to invite.
 * @param invite.role - The role to assign to the user.
 * @param invite.program_id - The optional program to assign.
 * @param invite.department_id - The optional department to assign.
 * @returns A promise that resolves when the invitation is sent.
 */
export async function inviteUser(invite: {
  email: string;
  role: Role;
  program_id?: string | null;
  department_id?: string | null;
}): Promise<void> {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: {
      email: invite.email,
      role: invite.role,
      program_id: invite.program_id || null,
      department_id: invite.department_id || null,
    },
  });

  if (error) {
    console.error('Error inviting user:', error);
    throw new Error(`Failed to send invitation: ${error.message}`);
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to send invitation');
  }
}
