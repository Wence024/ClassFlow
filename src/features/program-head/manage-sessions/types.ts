/**
 * Types for the manage sessions use case.
 */

export type SessionFilters = {
  courseId?: string;
  classGroupId?: string;
  instructorId?: string;
  searchTerm?: string;
};

export type SessionAction = 'edit' | 'delete' | 'view';
