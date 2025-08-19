import { ItemCard } from '../../../../components/ui';
import type { Course } from '../../types/course';
import type { ClassGroup } from '../../types/classGroup';
import type { Classroom } from '../../types/classroom';
import type { Instructor } from '../../types/instructor';

/** A union type representing any of the possible items this component can display. */
type ComponentItem = Course | ClassGroup | Classroom | Instructor;

/**
 * Props for the ComponentCard component.
 * Uses a generic type `T` that must be one of the `ComponentItem` types.
 */
interface ComponentCardProps<T extends ComponentItem> {
  /** The item object to display in the card. */
  item: T;
  /** Callback function triggered when the edit button is clicked. Receives the full item object. */
  onEdit: (item: T) => void;
  /** Callback function triggered when the delete button is clicked. Receives the item's ID. */
  onDelete: (id: string) => void;
}

/**
 * A generic display card for a single schedulable component (e.g., a Course, Instructor).
 *
 * This component acts as a type-aware wrapper around the generic `ItemCard` UI component.
 * It dynamically determines which details to show based on the properties of the `item` prop,
 * making it reusable across different data types.
 *
 * @template T - The specific type of the item being rendered, constrained to `ComponentItem`.
 * @param {ComponentCardProps<T>} props - The props for the component.
 */
const ComponentCard = <T extends ComponentItem>({
  item,
  onEdit,
  onDelete,
}: ComponentCardProps<T>) => {
  /**
   * Generates an array of details to be displayed in the card based on the item's properties.
   * This function uses type guards (`'property' in item`) to safely access properties
   * that may not exist on all `ComponentItem` types.
   * @param {T} item - The item to extract details from.
   * @returns {Array<{ label: string; value: string }>} An array of detail objects for the `ItemCard`.
   */
  const getDetails = (item: T): Array<{ label: string; value: string }> => {
    const details: Array<{ label: string; value: string }> = [];

    // Safely check for properties before accessing them.
    if ('code' in item && item.code) {
      details.push({ label: 'Code', value: item.code });
    }
    if ('number_of_periods' in item && typeof item.number_of_periods === 'number') {
      details.push({
        label: 'Duration',
        value: `${item.number_of_periods} ${item.number_of_periods > 1 ? 'periods' : 'period'}`,
      });
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
