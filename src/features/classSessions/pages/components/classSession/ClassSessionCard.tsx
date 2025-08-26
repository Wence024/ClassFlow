import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { ClassSession } from '../../../types/classSession';

/**
 * Props for the ClassSessionCard component.
 */
interface ClassSessionCardProps {
  /** The fully hydrated class session object to display. */
  classSession: ClassSession;
  /** Callback function triggered when the edit button is clicked. */
  onEdit: (classSession: ClassSession) => void;
  /** Callback function triggered when the delete button is clicked. */
  onDelete: (id: string) => void;
}

/**
 * A specialized display card for a single ClassSession.
 * It formats the session's details for display in the base ItemCard component.
 */
const ClassSessionCard: React.FC<ClassSessionCardProps> = ({ classSession, onEdit, onDelete }) => {
  // Defensive check for missing data, which can happen during optimistic updates
  if (
    !classSession.course ||
    !classSession.group ||
    !classSession.instructor ||
    !classSession.classroom
  ) {
    return (
      <ItemCard
        title="Invalid Session Data"
        subtitle="This session is missing required information."
        onDelete={() => onDelete(classSession.id)}
      />
    );
  }

  const details = [
    {
      label: 'Instructor',
      value: `${classSession.instructor.first_name} ${classSession.instructor.last_name}`,
    },
    { label: 'Classroom', value: classSession.classroom.name },
    {
      label: 'Duration',
      value: `${classSession.period_count} ${classSession.period_count > 1 ? 'periods' : 'period'}`,
    },
  ];

  return (
    <ItemCard
      title={`${classSession.course.name} - ${classSession.group.name}`}
      subtitle={`Course Code: ${classSession.course.code}`}
      details={details}
      color={classSession.instructor.color} // Use the instructor color for the session card
      onEdit={() => onEdit(classSession)}
      onDelete={() => onDelete(classSession.id)}
    />
  );
};

export default ClassSessionCard;
