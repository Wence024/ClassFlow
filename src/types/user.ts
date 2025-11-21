/**
 * Defines the possible user roles in the system.
 */
export type Role = 'admin' | 'department_head' | 'program_head';

/**
 * User object for authentication context.
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  program_id: string | null;
  department_id: string | null;
};

/**
 * User profile information for admin management.
 */
export type UserProfile = {
  id: string;
  full_name: string | null;
  role: Role;
  program_id: string | null;
  department_id: string | null;
};

/**
 * Fields that can be updated in a user profile.
 */
export type UserProfileUpdate = {
  role?: Role;
  program_id?: string | null;
  department_id?: string | null;
};

export type UserRole = {
  user_id: string;
  role: Role;
};
