import React from 'react';
import { ItemCard, type ItemCardBadge } from '../../../../../components/ui';
import { checkSoftConflicts } from '../../../../timetabling/utils/checkConflicts';
import type { ClassSession } from '@/types/classSession';

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
 *
 * @param csc The props for the ClassSessionCard component.
 * @param csc.classSession The class session object to display.
 * @param csc.onEdit Callback function to handle edit action.
 * @param csc.onDelete Callback function to handle delete action.
 * @returns The rendered item card component for the class session.
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

  // Check for any "soft" conflicts associated with this session.
  const softConflicts = checkSoftConflicts(classSession);

  const conflictBadge: ItemCardBadge | null =
    softConflicts.length > 0
      ? {
          text: softConflicts.length,
          tooltip: softConflicts.join('\n'),
          variant: 'warning',
        }
      : null;

  return (
    <ItemCard
      title={`${classSession.course.name} - ${classSession.group.name}`}
      subtitle={`Course Code: ${classSession.course.code}`}
      details={details}
      color={classSession.instructor.color} // Use the instructor color for the session card
      badge={conflictBadge}
      onEdit={() => onEdit(classSession)}
      onDelete={() => onDelete(classSession.id)}
    />
  );
};

export default ClassSessionCard;
