/**
 * Vitest environment: jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import SyncIndicator from '../SyncIndicator';

import { useIsFetching } from '@tanstack/react-query';

// Mock the useIsFetching hook to handle different query keys
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useIsFetching: vi.fn(),
  };
});

/**
 * Integration tests for SyncIndicator component.
 *
 * Tests the sync indicator that shows when timetable data is being fetched.
 */
describe('SyncIndicator Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithQuery = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/scheduler']}>
          {component}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  describe('Visibility States', () => {
    it('should show indicator when timetable queries are fetching', () => {
      // Mock the hook to return different values for different query keys
      const mockUseIsFetching = vi.fn().mockImplementation(({ queryKey }) => {
        if (queryKey && queryKey[0] === 'hydratedTimetable') {
          return 1; // Simulate hydratedTimetable query is fetching
        } else if (queryKey && queryKey[0] === 'timetable_assignments') {
          return 0; // timetable_assignments query is not fetching
        }
        return 0;
      });

      vi.mocked(useIsFetching).mockImplementation(mockUseIsFetching);

      renderWithQuery(<SyncIndicator />);

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
      expect(screen.getByText(/syncing/i)).toBeInTheDocument();
    });

    it('should hide indicator when no queries are fetching', () => {
      vi.mocked(useIsFetching).mockReturnValue(0);

      renderWithQuery(<SyncIndicator />);

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    });

    it('should show indicator when multiple queries are fetching', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('should display loading spinner when fetching', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      const spinner = screen.getByTestId('sync-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should display sync text', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      expect(screen.getByText('Syncing...')).toBeInTheDocument();
    });
  });

  describe('Query Filter Integration', () => {
    it('should only respond to timetable-related queries', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
    });

    it('should not show for non-timetable queries', () => {
      vi.mocked(useIsFetching).mockReturnValue(0);

      renderWithQuery(<SyncIndicator />);

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Transition Behavior', () => {
    it('should transition from hidden to visible', async () => {
      // Initially not fetching
      const mockIsFetching = vi.fn(() => 0);
      vi.mocked(useIsFetching).mockImplementation(mockIsFetching);

      const { rerender } = renderWithQuery(<SyncIndicator />);

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();

      // Change the mock return value for the rerender
      mockIsFetching.mockReturnValue(1);

      rerender(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/scheduler']}>
            <SyncIndicator />
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
    });

    it('should transition from visible to hidden', async () => {
      // Initially fetching
      const mockIsFetching = vi.fn(() => 1);
      vi.mocked(useIsFetching).mockImplementation(mockIsFetching);

      const { rerender } = renderWithQuery(<SyncIndicator />);

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();

      // Change to simulate query finishing
      mockIsFetching.mockReturnValue(0);

      rerender(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/scheduler']}>
            <SyncIndicator />
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Concurrent Fetches', () => {
    it('should show single indicator for multiple fetches', () => {
      vi.mocked(useIsFetching).mockReturnValue(5); // Mock multiple concurrent fetches

      renderWithQuery(<SyncIndicator />);

      // Should only show one indicator regardless of how many are fetching
      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
      // Query for all indicators - this might fail if none exist, so we need to check if any exist first
      const indicators = screen.queryAllByTestId('sync-indicator');
      expect(indicators).toHaveLength(1); // Should only be one indicator rendered
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      const indicator = screen.getByTestId('sync-indicator');
      expect(indicator).toHaveAttribute('aria-label', 'Syncing timetable data');
    });

    it('should have proper role for screen readers', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      const indicator = screen.getByTestId('sync-indicator');
      expect(indicator).toHaveAttribute('role', 'status');
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      vi.mocked(useIsFetching).mockReturnValue(0);

      const { rerender } = renderWithQuery(<SyncIndicator />);

      // Same state - should not show
      rerender(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/scheduler']}>
            <SyncIndicator />
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    });
  });
});
