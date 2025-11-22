/**
 * Service layer for managing users (CRUD operations).
 */

import {
  getUsers as infraGetUsers,
  deleteUser as infraDeleteUser,
  updateUserProfile as infraUpdateUserProfile,
} from '@/lib/services/userService';
import type { UserProfile, Role } from '@/types/user';
import type { UserFilters } from './types';

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
  return infraUpdateUserProfile(userId, data);
}

/**
 * Updates a user's display name.
 */
export async function updateUserDisplayName(userId: string, displayName: string): Promise<UserProfile> {
  // This might be a separate function in the infrastructure or part of updateUserProfile
  // For now, we'll call the infrastructure function with just the display name
  return infraUpdateUserProfile(userId, { full_name: displayName } as any);
}

/**
 * Removes a user.
 */
export async function removeUser(userId: string): Promise<void> {
  return infraDeleteUser(userId);
}