import React from 'react';
import { ItemCard } from '../../../../../components/ui';
import type { ClassGroup } from '../../../types';

interface ClassGroupCardProps {
  classGroup: ClassGroup;
  onEdit: (classGroup: ClassGroup) => void;
  onDelete: (id: string) => void;
}

/**
 * A specialized display card for a single Class Group.
 * It formats the group's specific properties for display in the base ItemCard component.
 *
 * @param c The props for the component.
 * @param c.classGroup The class group data to display.
 * @param c.onEdit Callback function when the edit button is clicked.
 * @param c.onDelete Callback function when the delete button is clicked.
 * @returns A class group card component.
 */
export const ClassGroupCard: React.FC<ClassGroupCardProps> = ({ classGroup, onEdit, onDelete }) => {
  const details = [];
  if (classGroup.code) {
    details.push({ label: 'Code', value: classGroup.code });
  }
  if (typeof classGroup.student_count === 'number') {
    details.push({ label: 'Students', value: classGroup.student_count });
  }

  return (
    <ItemCard
      title={classGroup.name}
      details={details}
      color={classGroup.color}
      onEdit={() => onEdit(classGroup)}
      onDelete={() => onDelete(classGroup.id)}
    />
  );
};
