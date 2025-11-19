/**
 * Use-case specific types for creating class sessions.
 */

import type { ClassSession, ClassSessionInsert } from '@/types/classSession';

/**
 * Form data structure for the create class session form.
 */
export type CreateClassSessionFormData = ClassSessionInsert;

/**
 * Result of creating a class session.
 */
export type CreateClassSessionResult = ClassSession;

/**
 * Cross-department resource information needed for approval workflows.
 */
export type CrossDepartmentInfo = {
  resourceType: 'instructor' | 'classroom' | null;
  resourceId: string | null;
  departmentId: string | null;
  resourceName: string;
};
