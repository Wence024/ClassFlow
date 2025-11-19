/**
 * Service wrapper for Create Class Session use case.
 * 
 * This service provides a thin abstraction over the infrastructure
 * services, allowing us to compose operations specific to this use case.
 */

import * as classSessionService from '@/lib/services/classSessionService';
import * as instructorService from '@/lib/services/instructorService';
import * as classroomService from '@/lib/services/classroomService';
import type { CreateClassSessionFormData, CrossDepartmentInfo } from './types';

/**
 * Creates a new class session.
 */
export async function createClassSession(data: CreateClassSessionFormData) {
  return classSessionService.addClassSession(data);
}

/**
 * Checks if resources (instructor or classroom) belong to a different department.
 * 
 * @param instructorId - The instructor ID to check.
 * @param classroomId - The classroom ID to check (optional).
 * @returns Cross-department information if resources are from another department.
 */
export async function checkCrossDepartmentResources(
  instructorId: string,
  classroomId: string | null
): Promise<CrossDepartmentInfo | null> {
  // Fetch all instructors to find the one we need
  const instructors = await instructorService.getAllInstructors();
  const instructor = instructors.find((i) => i.id === instructorId);
  
  if (!instructor || !instructor.department_id) {
    return null;
  }

  // Check classroom if provided
  if (classroomId) {
    const classrooms = await classroomService.getAllClassrooms();
    const classroom = classrooms.find((c) => c.id === classroomId);
    
    if (classroom?.preferred_department_id && 
        classroom.preferred_department_id !== instructor.department_id) {
      return {
        resourceType: 'classroom',
        resourceId: classroomId,
        departmentId: classroom.preferred_department_id,
        resourceName: classroom.name,
      };
    }
  }

  // Return instructor department info if cross-department
  return {
    resourceType: 'instructor',
    resourceId: instructorId,
    departmentId: instructor.department_id,
    resourceName: `${instructor.first_name} ${instructor.last_name}`,
  };
}
