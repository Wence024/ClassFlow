/**
 * Client-side permission helpers. These gate UI/UX only and must mirror server-side RLS.
 * Source of truth remains in the database policies.
 */

export type RoleString = 'admin' | 'department_head' | 'program_head' | string;

/**
 * Returns true if the role is admin.
 *
 * @param role - The user's role string.
 * @returns True if the user is an admin.
 */
export function isAdmin(role: RoleString | null | undefined): boolean {
  return role === 'admin';
}

/**
 * Returns true if the role is department_head.
 *
 * @param role - The user's role string.
 * @returns True if the user is a department head.
 */
export function isDepartmentHead(role: RoleString | null | undefined): boolean {
  return role === 'department_head';
}

/**
 * Returns true if the role is program_head.
 *
 * @param role - The user's role string.
 * @returns True if the user is a program head.
 */
export function isProgramHead(role: RoleString | null | undefined): boolean {
  return role === 'program_head';
}

/**
 * Admin or Department Head can manage instructors.
 *
 * @param role - The user's role string.
 * @returns True if the user has permissions to manage instructors.
 */
export function canManageInstructors(role: RoleString | null | undefined): boolean {
  return role === 'admin' || role === 'department_head';
}

/**
 * Only Admin can manage classrooms.
 *
 * @param role - The user's role string.
 * @returns True if the user has permissions to manage classrooms.
 */
export function canManageClassrooms(role: RoleString | null | undefined): boolean {
  return role === 'admin';
}

/**
 * Admin or the Department Head of the department can review requests.
 *
 * @param role - The user's role string.
 * @param userDepartmentId - The department ID of the current user.
 * @param targetDepartmentId - The department ID of the resource being requested.
 * @returns True if the user can review requests for the target department.
 */
export function canReviewRequestsForDepartment(
  role: RoleString | null | undefined,
  userDepartmentId: string | null | undefined,
  targetDepartmentId: string
): boolean {
  if (role === 'admin') return true;
  return (
    role === 'department_head' && !!userDepartmentId && userDepartmentId === targetDepartmentId
  );
}

/**
 * Admin or Department Head of the same department can manage a specific instructor row.
 *
 * @param role - The user's role string.
 * @param userDepartmentId - The department ID of the current user.
 * @param instructorDepartmentId - The department ID of the instructor resource.
 * @returns True if the user can manage the specific instructor.
 */
export function canManageInstructorRow(
  role: RoleString | null | undefined,
  userDepartmentId: string | null | undefined,
  instructorDepartmentId: string
): boolean {
  if (role === 'admin') return true;
  return (
    role === 'department_head' && !!userDepartmentId && userDepartmentId === instructorDepartmentId
  );
}

/**
 * Program Head can manage courses for their own program, or admin can manage any.
 *
 * @param role - The user's role string.
 * @param userProgramId - The program ID of the current user.
 * @param targetProgramId - The program ID of the course being managed.
 * @returns True if the user can manage courses for the target program.
 */
export function canManageCourses(
  role: RoleString | null | undefined,
  userProgramId: string | null | undefined,
  targetProgramId: string | null | undefined
): boolean {
  if (role === 'admin') return true;
  return (
    role === 'program_head' &&
    !!userProgramId &&
    !!targetProgramId &&
    userProgramId === targetProgramId
  );
}

/**
 * Program Head can manage assignments for their own program (optionally allow admin).
 *
 * @param role - The user's role string.
 * @param userProgramId - The program ID of the current user.
 * @param targetProgramId - The program ID of the assignment being managed.
 * @returns True if the user can manage assignments for the target program.
 */
export function canManageAssignmentsForProgram(
  role: RoleString | null | undefined,
  userProgramId: string | null | undefined,
  targetProgramId: string
): boolean {
  if (role === 'admin') return true;
  return role === 'program_head' && !!userProgramId && userProgramId === targetProgramId;
}
