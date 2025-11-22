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
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  return infraGetUsers();
}

/**
 * Updates a user profile.
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
 */
export async function updateUserDisplayName(userId: string, displayName: string): Promise<UserProfile> {
  return infraUpdateUserName(userId, displayName);
}

/**
 * Removes a user.
 */
export async function removeUser(userId: string): Promise<void> {
  return infraDeleteUser(userId);
}