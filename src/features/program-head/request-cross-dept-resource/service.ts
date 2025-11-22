/**
 * Service layer for cross-department resource requests.
 */

import {
  isCrossDepartmentInstructor as infraIsCrossDepartmentInstructor,
  isCrossDepartmentClassroom as infraIsCrossDepartmentClassroom
} from '@/lib/services/classSessionService';
import type { CrossDeptCheckResult } from './types';

/**
 * Checks if the given instructor is from a different department.
 *
 * @param programId - The ID of the program.
 * @param instructorId - The ID of the instructor to check.
 * @returns A promise that resolves to a boolean indicating if the instructor is from a different department.
 */
export async function checkCrossDepartmentInstructor(
  programId: string,
  instructorId: string
): Promise<boolean> {
  return infraIsCrossDepartmentInstructor(programId, instructorId);
}

/**
 * Checks if the given classroom is from a different department.
 *
 * @param programId - The ID of the program.
 * @param classroomId - The ID of the classroom to check.
 * @returns A promise that resolves to a boolean indicating if the classroom is from a different department.
 */
export async function checkCrossDepartmentClassroom(
  programId: string,
  classroomId: string
): Promise<boolean> {
  return infraIsCrossDepartmentClassroom(programId, classroomId);
}

/**
 * Checks if the given resources require cross-department approval.
 *
 * @param programId - The ID of the program.
 * @param instructorId - Optional instructor ID to check.
 * @param classroomId - Optional classroom ID to check.
 * @returns A promise that resolves to the cross-department check result.
 */
export async function checkCrossDepartmentResource(
  programId: string,
  instructorId?: string,
  classroomId?: string
): Promise<CrossDeptCheckResult> {
  // Check instructor first if provided
  if (instructorId) {
    const isInstructorCrossDept = await infraIsCrossDepartmentInstructor(programId, instructorId);
    if (isInstructorCrossDept) {
      return {
        isCrossDept: true,
        resourceType: 'instructor',
        resourceId: instructorId,
        departmentId: null,
      };
    }
  }

  // Check classroom if provided
  if (classroomId) {
    const isClassroomCrossDept = await infraIsCrossDepartmentClassroom(programId, classroomId);
    if (isClassroomCrossDept) {
      return {
        isCrossDept: true,
        resourceType: 'classroom',
        resourceId: classroomId,
        departmentId: null,
      };
    }
  }

  return {
    isCrossDept: false,
    resourceType: null,
    resourceId: null,
    departmentId: null,
  };
}