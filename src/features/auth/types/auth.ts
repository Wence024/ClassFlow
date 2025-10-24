/**
 * User object for authentication context.
 * 
 * SECURITY WARNING: Roles are currently stored on the user profile object.
 * This is NOT ideal for production as roles can potentially be manipulated client-side.
 * 
 * RECOMMENDED: Move roles to a separate `user_roles` table with:
 * - An enum type for valid roles
 * - A `has_role()` security definer function
 * - RLS policies that use the security definer function
 * 
 * See: docs/postgresql_schema for migration examples
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: string; // TODO: Replace with server-side role checking
  program_id: string | null;
  department_id: string | null;
};

/**
 * AuthContextType defines the shape of the authentication context.
 */
export type AuthContextType = {
  user: User | null;
  role: string | null;
  /** Convenience accessor for the current user's department id. */
  departmentId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  /** Returns true if the user has the admin role. */
  isAdmin: () => boolean;
  /** Returns true if the user has the department_head role. */
  isDepartmentHead: () => boolean;
  /** Returns true if the user has the program_head role. */
  isProgramHead: () => boolean;
  /** Returns true if the user can manage instructors (admin or department head). */
  canManageInstructors: () => boolean;
  /** Returns true if the user can manage classrooms (admin only). */
  canManageClassrooms: () => boolean;
  /** Returns true if the user can review requests for the provided department. */
  canReviewRequestsForDepartment: (departmentId: string) => boolean;
  /** Row-scoped: manage an instructor with department ownership. */
  canManageInstructorRow: (instructorDepartmentId: string) => boolean;
  /** 
   * Row-scoped: manage courses for a program.
   * Returns true if user is admin OR (is program_head AND targetProgramId matches user's program).
   * Returns false if either programId is null/undefined.
   */
  canManageCourses: (courseProgramId: string | null | undefined) => boolean;
  /** Row-scoped: manage timetable assignments for a program. */
  canManageAssignmentsForProgram: (programId: string) => boolean;
  /** Update current user's profile metadata (display name). */
  updateMyProfile: (update: { name?: string }) => Promise<void>;
};

/**
 * AuthResponse is returned by login/register API calls.
 */
export type AuthResponse = {
  user: User;
  token: string;
};
