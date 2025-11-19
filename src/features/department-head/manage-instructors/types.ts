/**
 * Types for the manage instructors use case.
 */

import type { Instructor } from '@/types/instructor';

export type InstructorFilters = {
  searchTerm?: string;
};

export type InstructorAction = 'edit' | 'delete' | 'view';

export type InstructorFormData = {
  first_name: string;
  last_name: string;
  prefix?: string | null;
  suffix?: string | null;
  code?: string | null;
  contract_type?: string | null;
  email?: string | null;
  phone?: string | null;
  color?: string | null;
  department_id?: string | null;
};

export type InstructorWithUsage = Instructor & {
  isUsed?: boolean;
};
