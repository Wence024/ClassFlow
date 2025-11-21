/**
 * Types for the manage classrooms use case.
 */

import type { Classroom } from '@/types/classroom';

export type ClassroomFilters = {
  searchTerm?: string;
  departmentId?: string;
};

export type ClassroomAction = 'edit' | 'delete' | 'view';

export type ClassroomFormData = {
  name: string;
  code?: string | null;
  capacity?: number | null;
  color?: string | null;
  preferred_department_id?: string | null;
};

export type ClassroomWithUsage = Classroom & {
  isUsed?: boolean;
};

export type DepartmentOption = {
  id: string;
  name: string;
};
