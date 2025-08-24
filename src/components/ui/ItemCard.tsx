import React from 'react';
import { Edit, Trash2 } from 'lucide-react'; // Optional: for better button visuals
import ActionButton from './ActionButton';

/** Represents a key-value pair for display. */
interface CardDetail {
  /** The label for the detail (e.g., "Instructor"). */
  label: string;
  /** The value of the detail (e.g., "Dr. Smith" or 30 for capacity). */
  value: string | number;
}

/** Props for the ItemCard component. */
interface ItemCardProps {
  /** The main title of the card. */
  title: string;

  /** An optional subtitle displayed below the title. Can be null. */
  subtitle?: string | null;

  /** An array of details to display as key-value pairs. */
  details?: CardDetail[];

  /** An optional hex color code to display as a small vertical bar. */
  color?: string | null;

  /** A callback function for the edit action. If not provided, the edit button is not rendered. */
  onEdit?: () => void;

  /** A callback function for the delete action. If not provided, the delete button is not rendered. */
  onDelete?: () => void;

  /** Additional CSS classes to apply to the card's root element. */
  className?: string;
}

/** A highly reusable, presentation-only card for displaying item information. */
const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  details = [],
  color,
  onEdit,
  onDelete,
  className = '',
}) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 ${className}`}
    >
      {/* THIS IS THE NEW PART: Render a color swatch if a color is provided */}
      {color && (
        <div
          className="w-1.5 h-12 rounded-full"
          style={{ backgroundColor: color }}
          aria-label={`Color swatch ${color}`}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <h3 className="text-md font-semibold text-gray-800 truncate">{title}</h3>
        {/* Render subtitle only if it's a non-empty string */}
        {subtitle && <p className="text-gray-500 text-sm truncate">{subtitle}</p>}

        {/* Render details only if the array is not empty */}
        {details.length > 0 && (
          <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
            {details.map((detail, index) => (
              <p key={index}>
                <span className="font-medium">{detail.label}:</span> {String(detail.value)}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onEdit && (
          <ActionButton variant="secondary" size="sm" onClick={onEdit} aria-label={`Edit ${title}`}>
            <Edit className="w-4 h-4" />
          </ActionButton>
        )}
        {onDelete && (
          <ActionButton
            variant="danger"
            size="sm"
            onClick={onDelete}
            aria-label={`Delete ${title}`}
          >
            <Trash2 className="w-4 h-4" />
          </ActionButton>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
