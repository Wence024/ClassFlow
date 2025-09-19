import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { Course } from '../../../types';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  isOwner?: boolean;
}

/**
 * A specialized display card for a single Course.
 * It formats the course's specific properties for display in the base ItemCard component.
 *
 * @param cc The props for the CourseCard component.
 * @param cc.course The course object to display.
 * @param cc.onEdit Callback function to handle edit action.
 * @param cc.onDelete Callback function to handle delete action.
 * @returns The rendered item card component for the course.
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, isOwner }) => {
  const details = [{ label: 'Code', value: course.code }];

  return (
    <ItemCard
      title={course.name}
      details={details}
      color={course.color}
      onEdit={() => onEdit(course)}
      onDelete={() => onDelete(course.id)}
      isOwner={isOwner}
    />
  );
};
