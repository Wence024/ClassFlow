/**
 * Types for the manage users use case.
 */

import type { Role } from '@/types/user';

export type UserFilters = {
  role?: string;
  departmentId?: string;
  searchTerm?: string;
};

export type UserAction = 'edit' | 'delete' | 'view';

export type UserFormData = {
  name: string;
  email: string;
  role: Role;
  programId?: string | null;
  departmentId?: string | null;
};
