import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { Classroom } from '../../../types';

interface ClassroomCardProps {
  classroom: Classroom;
  onEdit: (classroom: Classroom) => void;
  onDelete: (id: string) => void;
}

/**
 * A specialized display card for a single Classroom.
 * It formats the classroom's specific properties for display in the base ItemCard component.
 *
 * @param cc The props for the ClassroomCard component.
 * @param cc.classroom The classroom object to display.
 * @param cc.onEdit Callback function to handle edit action.
 * @param cc.onDelete Callback function to handle delete action.
 * @returns The rendered item card component for the classroom.
 */
export const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom, onEdit, onDelete }) => {
  const details = [];
  if (classroom.code) {
    details.push({ label: 'Code', value: classroom.code });
  }
  if (typeof classroom.capacity === 'number') {
    details.push({ label: 'Capacity', value: classroom.capacity });
  }

  return (
    <ItemCard
      title={classroom.name}
      details={details}
      color={classroom.color}
      onEdit={() => onEdit(classroom)}
      onDelete={() => onDelete(classroom.id)}
    />
  );
};
