import React from 'react';
import { ItemCard } from '../../../../components/ui';
import type { ClassSession } from '../../types/classSession';

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
 *
 * This component takes a fully hydrated `ClassSession` object and formats its key details
 * for display using the generic `ItemCard` component. It abstracts the presentation logic
 * for a single class session.
 *
 * @param {ClassSessionCardProps} props - The props for the component.
 */
const ClassSessionCard: React.FC<ClassSessionCardProps> = ({ classSession, onEdit, onDelete }) => {
  // Ensure that nested objects exist before trying to access their properties.
  // This prevents runtime errors if the data is unexpectedly missing.
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
    { label: 'Instructor', value: classSession.instructor.name },
    { label: 'Classroom', value: classSession.classroom.name },
  ];

  return (
    <ItemCard
      title={`${classSession.course.name} - ${classSession.group.name}`}
      subtitle={`Course Code: ${classSession.course.code}`}
      details={details}
      onEdit={() => onEdit(classSession)}
      onDelete={() => onDelete(classSession.id)}
      editLabel="Edit"
      deleteLabel="Remove"
    />
  );
};

export default ClassSessionCard;
