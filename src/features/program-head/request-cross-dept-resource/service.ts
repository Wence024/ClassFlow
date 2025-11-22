/**
 * Service layer for cross-department resource requests.
 */

import {
  isCrossDepartmentInstructor as infraIsCrossDepartmentInstructor,
  isCrossDepartmentClassroom as infraIsCrossDepartmentClassroom
} from '@/lib/services/classSessionService';
import type { CrossDeptCheckResult, CrossDeptRequestPayload } from './types';

/**
 * Checks if the given instructor is from a different department.
 */
export async function checkCrossDepartmentInstructor(
  programId: string,
  instructorId: string
): Promise<boolean> {
  return infraIsCrossDepartmentInstructor(programId, instructorId);
}

/**
 * Checks if the given classroom is from a different department.
 */
export async function checkCrossDepartmentClassroom(
  programId: string,
  classroomId: string
): Promise<boolean> {
  return infraIsCrossDepartmentClassroom(programId, classroomId);
}

/**
 * Checks if the given resources require cross-department approval.
 */
export async function checkCrossDepartmentResource(
  programId: string,
  instructorId?: string,
  classroomId?: string
): Promise<CrossDeptCheckResult> {
  // Check instructor first if provided
  if (instructorId) {
    const isInstructorCrossDept = await checkCrossDepartmentInstructor(programId, instructorId);
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
    const isClassroomCrossDept = await checkCrossDepartmentClassroom(programId, classroomId);
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