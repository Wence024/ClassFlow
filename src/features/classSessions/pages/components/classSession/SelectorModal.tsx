import React, { useState, useMemo } from 'react';
import { Dialog } from '../../../../../components/ui/dialog';
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

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (getPriorityStatus) {
      return filtered.sort((a, b) => {
        const aPriority = getPriorityStatus(a);
        const bPriority = getPriorityStatus(b);
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return 0;
      });
    }

    return filtered;
  }, [items, searchTerm, getPriorityStatus]);

  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
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
            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No items found</div>
            ) : (
              filteredAndSortedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer"
                >
                  {renderCard(
                    item,
                    item.id === selectedId,
                    getPriorityStatus ? getPriorityStatus(item) : undefined
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
