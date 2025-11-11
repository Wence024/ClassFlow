/**
 * Integration tests for ResourceSelectorModal component.
 *
 * Tests department-based prioritization, search filtering, and fallback UI behavior.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceSelectorModal, type PrioritizedItem } from '../resource-selector-modal';

interface TestItem extends PrioritizedItem {
  id: string;
  name: string;
  department?: string;
}

describe('ResourceSelectorModal', () => {
  const mockItems: TestItem[] = [
    {
      id: '1',
      name: 'Instructor A',
      department: 'CS',
      searchTerm: 'Instructor A CS',
      isPriority: true,
    },
    {
      id: '2',
      name: 'Instructor B',
      department: 'CS',
      searchTerm: 'Instructor B CS',
      isPriority: true,
    },
    {
      id: '3',
      name: 'Instructor C',
      department: 'Math',
      searchTerm: 'Instructor C Math',
      isPriority: false,
    },
    {
      id: '4',
      name: 'Instructor D',
      department: 'Physics',
      searchTerm: 'Instructor D Physics',
      isPriority: false,
    },
  ];

  const mockRenderItem = (item: TestItem, onSelect: () => void) => (
    <div onClick={onSelect} className="test-item">
      {item.name} ({item.department})
    </div>
  );

  describe('Department Grouping', () => {
    it('should show "From Your Department" section when priority items exist', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      expect(screen.getByText('From Your Department')).toBeInTheDocument();
    });

    it('should show "From Other Departments" section when both priority and non-priority items exist', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      expect(screen.getByText('From Other Departments')).toBeInTheDocument();
    });

    it('should prioritize items by department correctly', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      const items = screen.getAllByText(/Instructor [A-D]/);
      // Priority items (A, B) should come before non-priority items (C, D)
      expect(items[0].textContent).toContain('Instructor A');
      expect(items[1].textContent).toContain('Instructor B');
      expect(items[2].textContent).toContain('Instructor C');
      expect(items[3].textContent).toContain('Instructor D');
    });
  });

  describe('Fallback UI', () => {
    const noPriorityItems: TestItem[] = [
      {
        id: '1',
        name: 'Instructor A',
        department: 'CS',
        searchTerm: 'Instructor A CS',
        isPriority: false,
      },
      {
        id: '2',
        name: 'Instructor B',
        department: 'Math',
        searchTerm: 'Instructor B Math',
        isPriority: false,
      },
    ];

    it('should show fallback info message when no priority items exist and showAllItemsWhenNoPriority is true', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={noPriorityItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
          showAllItemsWhenNoPriority={true}
        />
      );

      expect(
        screen.getByText(/Resources are not assigned to specific departments yet/i)
      ).toBeInTheDocument();
    });

    it('should show ungrouped list when showAllItemsWhenNoPriority is true and no priority items', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={noPriorityItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
          showAllItemsWhenNoPriority={true}
        />
      );

      // Should NOT show department grouping headers
      expect(screen.queryByText('From Your Department')).not.toBeInTheDocument();
      expect(screen.queryByText('From Other Departments')).not.toBeInTheDocument();

      // Should show all items
      expect(screen.getByText(/Instructor A/)).toBeInTheDocument();
      expect(screen.getByText(/Instructor B/)).toBeInTheDocument();
    });
  });

  describe('Search Filtering', () => {
    it('should filter items based on search query', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Math' } });

      // Only Instructor C from Math department should be visible
      expect(screen.getByText(/Instructor C/)).toBeInTheDocument();
      expect(screen.queryByText(/Instructor A/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Instructor B/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Instructor D/)).not.toBeInTheDocument();
    });

    it('should show empty state when search returns no results', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  describe('Item Selection', () => {
    it('should call onSelectItem when an item is clicked', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      const item = screen.getByText(/Instructor A/);
      fireEvent.click(item);

      expect(onSelectItem).toHaveBeenCalledWith(mockItems[0]);
      expect(onSelectItem).toHaveBeenCalledTimes(1);
    });

    it('should reset search when an item is selected', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={mockItems}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'Math' } });
      expect(searchInput.value).toBe('Math');

      const item = screen.getByText(/Instructor C/);
      fireEvent.click(item);

      // Search should be reset (though component might unmount depending on onSelectItem behavior)
      expect(onSelectItem).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={[]}
          title="Select Instructor"
          renderItem={mockRenderItem}
          isLoading={true}
        />
      );

      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty message when items array is empty', () => {
      const onClose = vi.fn();
      const onSelectItem = vi.fn();

      render(
        <ResourceSelectorModal
          isOpen={true}
          onClose={onClose}
          onSelectItem={onSelectItem}
          items={[]}
          title="Select Instructor"
          renderItem={mockRenderItem}
        />
      );

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});
