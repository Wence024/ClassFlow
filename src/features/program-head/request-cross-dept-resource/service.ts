/**
 * Service layer for cross-department resource request operations.
 * Thin wrapper over infrastructure services.
 */

import { supabase } from '@/lib/supabase';
import {
  createRequest as createResourceRequest,
  getMyRequests,
} from '@/lib/services/resourceRequestService';
import type { ResourceRequestInsert } from '@/types/resourceRequest';
import type { CrossDeptCheckResult } from './types';

/**
 * Checks if a given instructor or classroom belongs to a different department
 * than the program's department.
 */
export async function checkCrossDepartmentResource(
  programId: string,
  instructorId?: string,
  classroomId?: string
): Promise<CrossDeptCheckResult> {
  const { data, error } = await supabase.rpc('is_cross_department_resource', {
    _program_id: programId,
    _instructor_id: instructorId || undefined,
    _classroom_id: classroomId || undefined,
  });

  if (error) {
    console.error('Error checking cross-department resource:', error);
    return {
      isCrossDept: false,
      resourceType: null,
      resourceId: null,
      departmentId: null,
    };
  }

  if (!data) {
    return {
      isCrossDept: false,
      resourceType: null,
      resourceId: null,
      departmentId: null,
    };
  }

  // Determine which resource is cross-department
  if (instructorId) {
    const { data: instructor } = await supabase
      .from('instructors')
      .select('department_id')
      .eq('id', instructorId)
      .single();

    if (instructor?.department_id) {
      return {
        isCrossDept: true,
        resourceType: 'instructor',
        resourceId: instructorId,
        departmentId: instructor.department_id,
      };
    }
  }

  if (classroomId) {
    const { data: classroom } = await supabase
      .from('classrooms')
      .select('preferred_department_id')
      .eq('id', classroomId)
      .single();

    if (classroom?.preferred_department_id) {
      return {
        isCrossDept: true,
        resourceType: 'classroom',
        resourceId: classroomId,
        departmentId: classroom.preferred_department_id,
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

/**
 * Creates a cross-department resource request.
 */
export async function createCrossDeptRequest(
  payload: ResourceRequestInsert
) {
  return createResourceRequest(payload);
}

/**
 * Fetches all my resource requests.
 */
export async function getMyResourceRequests() {
  return getMyRequests();
}
