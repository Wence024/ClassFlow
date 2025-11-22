/**
 * Service layer for managing users (CRUD operations).
 */

import {
  getUsers as infraGetUsers,
  deleteUser as infraDeleteUser,
  updateUserProfile as infraUpdateUserProfile,
  updateUserName as infraUpdateUserName,
} from '@/lib/services/userService';
import type { UserProfile, Role } from '@/types/user';

/**
 * Fetches all users.
 *
 * @returns A promise resolving to an array of user profiles.
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  return infraGetUsers();
}

/**
 * Updates a user profile.
 *
 * @param userId - The ID of the user to update.
 * @param data - The profile data to update.
 * @param data.role - Optional role to update.
 * @param data.programId - Optional program ID to update.
 * @param data.departmentId - Optional department ID to update.
 * @returns A promise resolving to the updated user profile.
 */
export async function updateUserProfileData(userId: string, data: { role?: Role; programId?: string | null; departmentId?: string | null }): Promise<UserProfile> {
  // Convert camelCase to snake_case for the infrastructure layer
  const infraData: any = {};
  if (data.role !== undefined) infraData.role = data.role;
  if (data.programId !== undefined) infraData.program_id = data.programId;
  if (data.departmentId !== undefined) infraData.department_id = data.departmentId;

  return infraUpdateUserProfile(userId, infraData);
}

/**
 * Updates a user's display name.
 *
 * @param userId - The ID of the user to update.
 * @param displayName - The new display name for the user.
 * @returns A promise resolving to the updated user profile.
 */
export async function updateUserDisplayName(userId: string, displayName: string): Promise<UserProfile> {
  return infraUpdateUserName(userId, displayName);
}

/**
 * Removes a user.
 *
 * @param userId - The ID of the user to remove.
 * @returns A promise that resolves when the user is removed.
 */
export async function removeUser(userId: string): Promise<void> {
  return infraDeleteUser(userId);
}