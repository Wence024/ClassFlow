import React from 'react';
import ActionButton from './ActionButton';

/**
 * Represents a key-value pair to be displayed as a detail line in the card.
 */
interface CardDetail {
  /** The label for the detail (e.g., "Instructor"). */
  label: string;
  /** The value of the detail (e.g., "Dr. Smith"). */
  value: string | number;
}

/**
 * Props for the ItemCard component.
 */
interface ItemCardProps {
  /** The main title of the card. */
  title: string;
  /** An optional subtitle displayed below the title. */
  subtitle?: string;
  /** An array of details to display as key-value pairs. */
  details?: CardDetail[];
  /** A callback function for the edit action. If not provided, the edit button is not rendered. */
  onEdit?: () => void;
  /** A callback function for the delete action. If not provided, the delete button is not rendered. */
  onDelete?: () => void;
  /** Custom text for the edit button.
   * @default 'Edit'
   */
  editLabel?: string;
  /** Custom text for the delete button.
   * @default 'Remove'
   */
  deleteLabel?: string;
  /** Additional CSS classes to apply to the card's root element. */
  className?: string;
  /** Optional children to render within the main content area of the card. */
  children?: React.ReactNode;
}

/**
 * A card component designed to display information about an item (e.g., a course, instructor).
 * It includes slots for a title, subtitle, a list of details, and optional edit/delete action buttons.
 */
const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  details = [],
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Remove',
  className = '',
  children,
}) => {
  return (
    <div
      className={`bg-gray-50 p-4 mb-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}

        {details.map((detail, index) => (
          <p key={index} className="text-gray-700">
            {detail.label}: {detail.value}
          </p>
        ))}

        {children}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 md:mt-0">
          {onDelete && (
            <ActionButton variant="danger" size="sm" onClick={onDelete}>
              {deleteLabel}
            </ActionButton>
          )}
          {onEdit && (
            <ActionButton variant="success" size="sm" onClick={onEdit}>
              {editLabel}
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
