import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { Instructor } from '../../../types';

interface InstructorCardProps {
  instructor: Instructor;
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
}

/**
 * A specialized display card for a single Instructor.
 * It formats the instructor's specific properties for display in the base ItemCard component.
 *
 * @param i The props for the InstructorCard component.
 * @param i.instructor The instructor object to display.
 * @param i.onEdit Callback function to handle edit action.
 * @param i.onDelete Callback function to handle delete action.
 */
export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onEdit, onDelete }) => {
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

  return (
    <ItemCard
      title={fullName}
      details={details}
      color={instructor.color}
      onEdit={() => onEdit(instructor)}
      onDelete={() => onDelete(instructor.id)}
    />
  );
};
