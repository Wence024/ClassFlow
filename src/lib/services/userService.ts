/**
 * Centralized service for all user database operations.
 * Consolidates operations from features/users/services/usersService.ts
 */

import { supabase } from '../supabase';
import type { Role, UserProfile, UserProfileUpdate } from '../../types/user';

/**
 * Fetches all users with their profile information and roles.
 */
export async function getUsers(): Promise<UserProfile[]> {
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, program_id, department_id')
    .order('full_name');

  if (profileError) throw profileError;
  if (!profiles) return [];

  const rolePromises = profiles.map(async (profile) => {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', profile.id)
      .single();
    const role = (roleData?.role as Role) || 'program_head';
    return { userId: profile.id, role };
  });

  const roles = await Promise.all(rolePromises);
  const roleMap = new Map(roles.map((r) => [r.userId, r.role]));

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
 */
export async function updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<void> {
  const { error } = await supabase.rpc('admin_update_user_profile', {
    target_user_id: userId,
    new_role: updates.role,
    new_program_id: updates.program_id === null ? undefined : updates.program_id,
    new_department_id: updates.department_id === null ? undefined : updates.department_id,
  });

  if (error) throw error;
}

/**
 * Invites a new user by email (admin only).
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

/**
 * Deletes a user (admin only via RPC).
 */
export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_user', {
    target_user_id: userId,
  });
  if (error) throw error;
}

/**
 * Updates a user's display name (admin only via RPC).
 */
export async function updateUserName(userId: string, name: string): Promise<void> {
  const { error } = await supabase.rpc('admin_update_user_name' as never, {
    target_user_id: userId,
    new_name: name,
  } as never);
  if (error) throw error;
}
