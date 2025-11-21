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
 *
 * @returns A promise that resolves to an array of user profiles.
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  return getUsers();
}

/**
 * Deletes a user from the system.
 *
 * @param userId The ID of the user to delete.
 * @returns A promise that resolves when the user is deleted.
 */
export async function removeUser(userId: string): Promise<void> {
  return deleteUser(userId);
}

/**
 * Updates a user's profile including role and assignments.
 *
 * @param userId The ID of the user to update.
 * @param data The profile update data.
 * @param data.role Optional role to update.
 * @param data.programId Optional program ID to update.
 * @param data.departmentId Optional department ID to update.
 * @returns A promise that resolves when the profile is updated.
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
 *
 * @param userId The ID of the user to update.
 * @param name The new display name.
 * @returns A promise that resolves when the name is updated.
 */
export async function updateUserDisplayName(userId: string, name: string): Promise<void> {
  return updateUserName(userId, name);
}
