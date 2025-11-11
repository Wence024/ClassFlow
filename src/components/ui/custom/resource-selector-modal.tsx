import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dialog';
import { Input } from '../input';
import LoadingSpinner from './loading-spinner';

/**
 * Represents an item that can be prioritized (e.g., from user's department vs others).
 */
export interface PrioritizedItem {
  /** Unique identifier for the item. */
  id: string;
  /** Whether this item belongs to the user's department or is preferred. */
  isPriority?: boolean;
  /** Search term used for filtering (e.g., name, code, combined fields). */
  searchTerm?: string;
}

/**
 * Props for the ResourceSelectorModal component.
 */
interface ResourceSelectorModalProps<T extends PrioritizedItem> {
  /** Whether the modal is open. */
  isOpen: boolean;

  /** Callback to close the modal. */
  onClose: () => void;

  /** Callback when an item is selected. */
  onSelectItem: (item: T) => void;

  /** Array of items to display and select from. */
  items: T[];

  /** The title displayed at the top of the modal. */
  title: string;

  /** A render function that takes an item and returns JSX for display. */
  renderItem: (item: T, onSelect: () => void) => React.ReactNode;

  /** Whether the items are currently being loaded. */
  isLoading?: boolean;

  /** Whether to show all items without grouping when no priority items exist. */
  showAllItemsWhenNoPriority?: boolean;
}

/**
 * A reusable modal component for searching and selecting resources.
 *
 * Supports prioritized grouping, client-side search, loading states, and empty states.
 *
 * @param rsm The props for the component.
 * @param rsm.isOpen Whether the modal is open.
 * @param rsm.onClose Callback to close the modal.
 * @param rsm.onSelectItem Callback when an item is selected.
 * @param rsm.items Array of items to display.
 * @param rsm.title The modal title.
 * @param rsm.renderItem Render function for each item.
 * @param rsm.isLoading Whether items are loading.
 * @param rsm.showAllItemsWhenNoPriority Whether to show all items without grouping when no priority items exist.
 * @returns A modal component for resource selection.
 */
export function ResourceSelectorModal<T extends PrioritizedItem>({
  isOpen,
  onClose,
  onSelectItem,
  items,
  title,
  renderItem,
  isLoading = false,
  showAllItemsWhenNoPriority = false,
}: ResourceSelectorModalProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.searchTerm?.toLowerCase().includes(query));
  }, [items, searchQuery]);

  // Group items into priority and non-priority
  const { priorityItems, otherItems } = useMemo(() => {
    const priority: T[] = [];
    const other: T[] = [];

    filteredItems.forEach((item) => {
      if (item.isPriority) {
        priority.push(item);
      } else {
        other.push(item);
      }
    });

    return { priorityItems: priority, otherItems: other };
  }, [filteredItems]);

  const handleSelect = (item: T) => {
    onSelectItem(item);
    setSearchQuery(''); // Reset search on selection
    onClose();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" text="Loading resources..." />
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No results found</p>
          {searchQuery && <p className="text-sm mt-2">Try adjusting your search terms</p>}
        </div>
      );
    }

    if (priorityItems.length === 0 && showAllItemsWhenNoPriority) {
      return (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground italic px-3 py-2 bg-muted/50 rounded-md">
            Note: Resources are not assigned to specific departments yet
          </div>
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div key={item.id} className="cursor-pointer">
                {renderItem(item, () => handleSelect(item))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {priorityItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">From Your Department</h3>
            <div className="space-y-2">
              {priorityItems.map((item) => (
                <div key={item.id} className="cursor-pointer">
                  {renderItem(item, () => handleSelect(item))}
                </div>
              ))}
            </div>
          </div>
        )}
        {otherItems.length > 0 && (
          <div>
            {priorityItems.length > 0 && (
              <h3 className="text-sm font-semibold text-foreground mb-3">From Other Departments</h3>
            )}
            <div className="space-y-2">
              {otherItems.map((item) => (
                <div key={item.id} className="cursor-pointer">
                  {renderItem(item, () => handleSelect(item))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
