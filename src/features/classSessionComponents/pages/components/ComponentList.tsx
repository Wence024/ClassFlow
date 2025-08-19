import ComponentCard from './ComponentCard';
import type { Course } from '../../types/course';
import type { ClassGroup } from '../../types/classGroup';
import type { Classroom } from '../../types/classroom';
import type { Instructor } from '../../types/instructor';

/** A union type representing any of the possible items this component can display. */
type ComponentItem = Course | ClassGroup | Classroom | Instructor;

/**
 * Props for the ComponentList component.
 * Uses a generic type `T` that must be one of the `ComponentItem` types.
 */
interface ComponentListProps<T extends ComponentItem> {
  /** An array of items to be rendered in the list. */
  items: T[];
  /** Callback function passed to each `ComponentCard` for handling edit actions. */
  onEdit: (item: T) => void;
  /** Callback function passed to each `ComponentCard` for handling delete actions. */
  onDelete: (id: string) => void;
  /** A message to display when the `items` array is empty.
   * @default 'No items created yet.'
   */
  emptyMessage?: string;
}

/**
 * A generic component that renders a list of `ComponentCard`s.
 *
 * It is responsible for iterating over an array of items and rendering a card for each one.
 * It also handles the display of an empty state message if no items are provided.
 * This component is type-safe due to the use of TypeScript generics.
 *
 * @template T - The specific type of items in the list, constrained to `ComponentItem`.
 * @param {ComponentListProps<T>} props - The props for the component.
 */
const ComponentList = <T extends ComponentItem>({
  items,
  onEdit,
  onDelete,
  emptyMessage = 'No items created yet.',
}: ComponentListProps<T>) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
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
