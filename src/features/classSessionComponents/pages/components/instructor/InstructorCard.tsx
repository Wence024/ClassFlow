import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { Instructor } from '../../../types';

interface InstructorCardProps {
  instructor: Instructor;
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
  isOwner?: boolean;
}

/**
 * A specialized display card for a single Instructor.
 * It formats the instructor's specific properties for display in the base ItemCard component.
 *
 * @param ic The props for the InstructorCard component.
 * @param ic.instructor The instructor object to display.
 * @param ic.onEdit Callback function to handle edit action.
 * @param ic.onDelete Callback function to handle delete action.
 * @param [ic.isOwner] Whether the user owns this item and can edit/delete it. Defaults to true.
 * @returns The rendered item card component for the instructor.
 */
export const InstructorCard: React.FC<InstructorCardProps> = ({
  instructor,
  onEdit,
  onDelete,
  isOwner,
}) => {
  // Construct the full display name from its parts
  const fullName = [
    instructor.prefix,
    instructor.first_name,
    instructor.last_name,
    instructor.suffix,
  ]
    .filter(Boolean) // Remove any null or empty parts
    .join(' ');

  const details = [];
  if (instructor.code) details.push({ label: 'Code', value: instructor.code });
  if (instructor.email) details.push({ label: 'Email', value: instructor.email });
  if (instructor.phone) details.push({ label: 'Phone', value: instructor.phone });
  if (instructor.department_name)
    details.push({ label: 'Department', value: instructor.department_name });

  return (
    <ItemCard
      title={fullName}
      details={details}
      color={instructor.color}
      onEdit={() => onEdit(instructor)}
      onDelete={() => onDelete(instructor.id)}
      isOwner={isOwner}
    />
  );
};
