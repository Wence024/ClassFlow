import React from 'react';
import { AlertTriangle, CheckCircle, Edit, Info, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '../button/button';
import { Card, CardContent } from '../card';
import { cn } from '@/lib/utils';

/** Represents a key-value pair for display. */
interface CardDetail {
  /** The label for the detail (e.g., "Instructor"). */
  label: string;

  /** The value of the detail (e.g., "Dr. Smith" or 30 for capacity). */
  value: string | number;
}

/** Represents the data for a small badge to be displayed next to the title. */
export interface ItemCardBadge {
  /** The text or number to display in the badge. */
  text: string | number;

  /** An optional tooltip for the badge. */
  tooltip?: string;

  /** The visual style of the badge. Defaults to 'warning'. */
  variant?: 'warning' | 'info' | 'danger' | 'success';

  /** An optional custom icon component to override the default. */
  icon?: React.ElementType;
}

/** Props for the ItemCard component. */
interface ItemCardProps {
  /** The main title of the card. */
  title: React.ReactNode;

  /** An optional subtitle displayed below the title. Can be null. */
  subtitle?: string | null;

  /** An array of details to display as key-value pairs. */
  details?: CardDetail[];

  /** An optional hex color code to display as a small vertical bar. */
  color?: string | null;

  /** An optional badge to display next to the title for warnings or info. */
  badge?: ItemCardBadge | null;

  /** A callback function for the edit action. If not provided, the edit button is not rendered. */
  onEdit?: () => void;

  /** A callback function for the delete action. If not provided, the delete button is not rendered. */
  onDelete?: () => void;

  /** Whether the user owns this item and can edit/delete it. Defaults to true. */
  isOwner?: boolean;

  /** Additional CSS classes to apply to the card's root element. */
  className?: string;
}

/**
 * A highly reusable, presentation-only card for displaying item information using shadcn Card.
 *
 * @param ic The props for the component.
 * @param ic.title The main title of the card.
 * @param [ic.subtitle] An optional subtitle displayed below the title.
 * @param [ic.details] An array of details to display as key-value pairs.
 * @param [ic.color] An optional hex color code to display as a small vertical bar.
 * @param [ic.badge] An optional badge to display next to the title.
 * @param [ic.onEdit] A callback for the edit action.
 * @param [ic.onDelete] A callback for the delete action.
 * @param [ic.className] Additional CSS classes for the card's root element.
 * @param [ic.isOwner] Whether the user owns this item and can edit/delete it. Defaults to true.
 * @returns The rendered item card component.
 */
const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  details = [],
  color,
  badge,
  onEdit,
  onDelete,
  isOwner = true,
  className = '',
}) => {
  /**
   * Renders the badge if badge data is provided.
   *
   * @returns The badge component or null.
   */
  const renderBadge = () => {
    if (!badge) return null;

    const { text, tooltip, variant = 'warning', icon: CustomIcon } = badge;

    const variantStyles = {
      warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      info: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      danger: 'bg-destructive/10 text-destructive dark:text-red-300',
      success: 'bg-green-500/10 text-green-700 dark:text-green-300',
    };

    const Icon =
      CustomIcon ||
      {
        warning: AlertTriangle,
        info: Info,
        danger: ShieldAlert,
        success: CheckCircle,
      }[variant];

    return (
      <div
        className={cn(
          'flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
          variantStyles[variant]
        )}
        title={tooltip}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{text}</span>
      </div>
    );
  };

  return (
    <Card
      className={cn('flex items-center gap-4', className)}
      data-testid="item-card"
      role="article"
    >
      <CardContent className="p-4 flex items-center gap-4 w-full">
        {/* Render a color swatch if a color is provided */}
        {color && (
          <div
            className="w-2 h-8 rounded-lg"
            style={{ backgroundColor: color }}
            aria-label={`Color swatch ${color}`}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-semibold text-card-foreground truncate">{title}</h3>
            {renderBadge()}
          </div>
          {/* Render subtitle only if it's a non-empty string */}
          {subtitle && <p className="text-muted-foreground text-sm truncate">{subtitle}</p>}

          {/* Render details only if the array is not empty */}
          {details.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
              {details.map((detail, index) => (
                <p key={index}>
                  <span className="font-medium">{detail.label}:</span>
                  {String(detail.value)}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onEdit && isOwner && (
            <Button variant="secondary" size="sm" onClick={onEdit} aria-label={`Edit ${title}`}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && isOwner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              aria-label={`Delete ${title}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
