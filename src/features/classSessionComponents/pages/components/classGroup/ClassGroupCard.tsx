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
