import { ItemCard } from '../../../../components/ui';
import type { Course, ClassGroup, Classroom, Instructor } from '../../types';

/** A union type representing any of the possible items this component can display. */
type ComponentItem = Course | ClassGroup | Classroom | Instructor;

interface ComponentCardProps<T extends ComponentItem> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

const ComponentCard = <T extends ComponentItem>({
  item,
  onEdit,
  onDelete,
}: ComponentCardProps<T>) => {
  // Use a type guard to check for instructor-specific name properties
  const getTitle = (item: T): string => {
    if ('first_name' in item && 'last_name' in item) {
      return `${item.first_name} ${item.last_name}`;
    }
    return item.name; // Fallback for Course, Classroom, ClassGroup
  };

  const getDetails = (item: T): Array<{ label: string; value: string | number }> => {
    const details: Array<{ label: string; value: string | number }> = [];

    // All components can have a code and color
    if ('code' in item && item.code) details.push({ label: 'Code', value: item.code });
    if ('color' in item && item.color) details.push({ label: 'Color', value: item.color });

    // Specific details
    if ('student_count' in item && typeof item.student_count === 'number') {
      details.push({ label: 'Students', value: item.student_count });
    }
    if ('capacity' in item && typeof item.capacity === 'number') {
      details.push({ label: 'Capacity', value: item.capacity });
    }
    if ('email' in item && item.email) details.push({ label: 'Email', value: item.email });
    if ('phone' in item && item.phone) details.push({ label: 'Phone', value: item.phone });

    return details;
  };

  return (
    <ItemCard
      title={getTitle(item)}
      details={getDetails(item)}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
      editLabel="Edit"
      deleteLabel="Remove"
    />
  );
};

export default ComponentCard;
