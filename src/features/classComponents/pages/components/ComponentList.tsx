import ComponentCard from './ComponentCard';
import type { Course } from '../../types/course';
import type { ClassGroup } from '../../types/classGroup';
import type { Classroom } from '../../types/classroom';
import type { Instructor } from '../../types/instructor';

type ComponentItem = Course | ClassGroup | Classroom | Instructor;

interface ComponentListProps<T extends ComponentItem> {
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

const ComponentList = <T extends ComponentItem>({
  items,
  onEdit,
  onDelete,
  emptyMessage = 'No items created yet.',
}: ComponentListProps<T>) => {
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
        <ComponentCard<T> key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ComponentList;
