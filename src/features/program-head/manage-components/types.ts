/**
 * Types for managing class session components (courses, groups, classrooms, instructors).
 */

export type ComponentType = 'course' | 'classGroup' | 'classroom' | 'instructor';

export type TabConfig = {
  id: ComponentType;
  label: string;
};
