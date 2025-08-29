import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { Course } from '../../../types';

/**
 * Props for the CourseCard component.
 */
interface CourseCardProps {
  /** The course object to display. */
  course: Course;

  /** Callback for the edit action, receiving the full course object. */
  onEdit: (course: Course) => void;

  /** Callback for the delete action, receiving the course ID. */
  onDelete: (id: string) => void;
}

/**
 * A specialized display card for a single Course.
 * It formats the course's specific properties for display in the base ItemCard component.
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
  const details = [{ label: 'Code', value: course.code }];

  return (
    <ItemCard
      title={course.name}
      details={details}
      color={course.color}
      onEdit={() => onEdit(course)}
      onDelete={() => onDelete(course.id)}
    />
  );
};
