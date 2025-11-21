import React from 'react';
import { ItemCard } from '../../../../../../components/ui';
import type { Classroom } from '@/features/program-head/manage-components/types/classroom';

interface ClassroomCardProps {
  classroom: Classroom;
  onEdit: (classroom: Classroom) => void;
  onDelete: (id: string) => void;
  isOwner?: boolean;
}

/**
 * A specialized display card for a single Classroom.
 * It formats the classroom's specific properties for display in the base ItemCard component.
 *
 * @param cc The props for the ClassroomCard component.
 * @param cc.classroom The classroom object to display.
 * @param cc.onEdit Callback function to handle edit action.
 * @param cc.onDelete Callback function to handle delete action.
 * @param cc.isOwner Indicator if user can edit this or not.
 * @returns The rendered item card component for the classroom.
 */
export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onEdit,
  onDelete,
  isOwner,
}) => {
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
      isOwner={isOwner ? isOwner : false}
    />
  );
};
