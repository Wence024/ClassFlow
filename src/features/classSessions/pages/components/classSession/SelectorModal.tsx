import React, { useState, useMemo } from 'react';
import { FormField, Button } from '../../../../../components/ui';
import { X } from 'lucide-react';

interface SelectorItem {
  id: string;
  name: string;
  code?: string | null;
  [key: string]: unknown;
}

interface SelectorModalProps<T extends SelectorItem> {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  items: T[];
  selectedId?: string;
  title: string;
  searchPlaceholder?: string;
  renderCard: (item: T, isSelected: boolean, isPriority?: boolean) => React.ReactNode;
  getPriorityStatus?: (item: T) => boolean;
}

/**
 * A reusable modal for selecting items with search functionality and card-based display.
 *
 * @param sm The props for the component.
 * @param sm.isOpen Whether the modal is open.
 * @param sm.onClose Callback when the modal is closed.
 * @param sm.onSelect Callback when an item is selected.
 * @param sm.items The list of items to display.
 * @param [sm.selectedId] The currently selected item ID.
 * @param sm.title The modal title.
 * @param [sm.searchPlaceholder] Placeholder text for the search input.
 * @param sm.renderCard Function to render each item as a card.
 * @param [sm.getPriorityStatus] Optional function to determine if an item should be prioritized.
 * @returns The rendered selector modal.
 */
export function SelectorModal<T extends SelectorItem>({
  isOpen,
  onClose,
  onSelect,
  items,
  selectedId,
  title,
  searchPlaceholder = 'Search...',
  renderCard,
  getPriorityStatus,
}: SelectorModalProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const { priorityItems, otherItems } = useMemo(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (getPriorityStatus) {
      const priority = filtered.filter(getPriorityStatus);
      const other = filtered.filter((item) => !getPriorityStatus(item));
      return { priorityItems: priority, otherItems: other };
    }

    return { priorityItems: filtered, otherItems: [] };
  }, [items, searchTerm, getPriorityStatus]);

  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <FormField
            id="selector-search"
            label=""
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {priorityItems.length === 0 && otherItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No items found</div>
          ) : (
            <>
              {priorityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer"
                >
                  {renderCard(item, item.id === selectedId, true)}
                </div>
              ))}
              
              {otherItems.length > 0 && priorityItems.length > 0 && (
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">Other Available Resources</span>
                  </div>
                </div>
              )}
              
              {otherItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer"
                >
                  {renderCard(item, item.id === selectedId, false)}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
