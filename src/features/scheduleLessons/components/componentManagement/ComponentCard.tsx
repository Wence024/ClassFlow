import ItemCard from '../ui/ItemCard';
import type { Course, ClassGroup, Classroom, Instructor } from '../../types/scheduleLessons';

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
  const getDetails = (item: T) => {
    const details: Array<{ label: string; value: string }> = [];

    if ('code' in item && item.code) {
      details.push({ label: 'Code', value: item.code });
    }
    if ('location' in item && item.location) {
      details.push({ label: 'Location', value: item.location });
    }
    if ('email' in item && item.email) {
      details.push({ label: 'Email', value: item.email });
    }

    return details;
  };

  return (
    <ItemCard
      title={item.name}
      details={getDetails(item)}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
      editLabel="Edit"
      deleteLabel="Remove"
    />
  );
};

export default ComponentCard;
