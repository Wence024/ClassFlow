/**
 * Service layer for managing users.
 * Thin wrapper over infrastructure services.
 */

import {
  getUsers,
  deleteUser,
  updateUserProfile,
  updateUserName,
} from '@/lib/services/userService';
import type { UserProfile, UserProfileUpdate, Role } from '@/types/user';

/**
 * Fetches all users in the system.
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  return getUsers();
}

/**
 * Deletes a user from the system.
 */
export async function removeUser(userId: string): Promise<void> {
  return deleteUser(userId);
}

/**
 * Updates a user's profile including role and assignments.
 */
export async function updateUserProfileData(
  userId: string,
  data: {
    role?: Role;
    programId?: string | null;
    departmentId?: string | null;
  }
): Promise<void> {
  const update: UserProfileUpdate = {};
  if (data.role) update.role = data.role;
  if (data.programId !== undefined) update.program_id = data.programId;
  if (data.departmentId !== undefined) update.department_id = data.departmentId;
  
  return updateUserProfile(userId, update);
}

/**
 * Updates a user's display name.
 */
export async function updateUserDisplayName(userId: string, name: string): Promise<void> {
  return updateUserName(userId, name);
}
