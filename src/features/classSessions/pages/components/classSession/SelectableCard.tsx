import React from 'react';
import { Check, Star } from 'lucide-react';

interface SelectableCardProps {
  title: string;
  subtitle?: string;
  details?: string[];
  color?: string;
  isSelected: boolean;
  isPriority?: boolean;
  onClick: () => void;
}

/**
 * A card component for displaying selectable items with visual feedback.
 *
 * @param sc The props for the component.
 * @param sc.title The main title of the card.
 * @param [sc.subtitle] Optional subtitle.
 * @param [sc.details] Optional array of detail strings to display.
 * @param [sc.color] Optional color for the card accent.
 * @param sc.isSelected Whether this card is currently selected.
 * @param [sc.isPriority] Whether this item should be marked as priority.
 * @param sc.onClick Callback when the card is clicked.
 * @returns The rendered selectable card.
 */
export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  details,
  color = '#6B7280',
  isSelected,
  isPriority,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : isPriority
            ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
            : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {isPriority && (
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" aria-label="Priority" />
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          {details && details.length > 0 && (
            <div className="mt-2 space-y-1">
              {details.map((detail, idx) => (
                <p key={idx} className="text-xs text-gray-500">
                  {detail}
                </p>
              ))}
            </div>
          )}
        </div>
        {isSelected && (
          <div className="flex-shrink-0 ml-2">
            <div className="bg-blue-500 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
