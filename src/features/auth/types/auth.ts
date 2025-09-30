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
 * AuthContextType defines the shape of the authentication context.
 */
export type AuthContextType = {
  user: User | null;
  role: string | null;
  /** Convenience accessor for the current user's department id */
  departmentId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resendVerificationEmail: (email: string) => Promise<void>;
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
  /** Row-scoped: manage an instructor with department ownership */
  canManageInstructorRow: (instructorDepartmentId: string) => boolean;
  /** Row-scoped: manage timetable assignments for a program */
  canManageAssignmentsForProgram: (programId: string) => boolean;
};

/**
 * AuthResponse is returned by login/register API calls.
 */
export type AuthResponse = {
  user: User;
  token: string;
};
