import React from 'react';
import ComponentCard from './ComponentCard';
import type { Course, ClassGroup, Classroom, Instructor } from '../../types/scheduleLessons';

type ComponentItem = Course | ClassGroup | Classroom | Instructor;

interface ComponentListProps {
  items: ComponentItem[];
  onEdit: (item: ComponentItem) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

const ComponentList: React.FC<ComponentListProps> = ({
  items,
  onEdit,
  onDelete,
  emptyMessage = 'No items created yet.',
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ComponentCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ComponentList;
