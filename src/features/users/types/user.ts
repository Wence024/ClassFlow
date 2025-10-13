/**
 * User profile information for admin management.
 */
export type UserProfile = {
  id: string;
  full_name: string | null;
  role: string;
  program_id: string | null;
  department_id: string | null;
};

/**
 * Fields that can be updated in a user profile.
 */
export type UserProfileUpdate = {
  role?: string;
  program_id?: string | null;
  department_id?: string | null;
};
