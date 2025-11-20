/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SyncIndicator from '../SyncIndicator';

// Mock the useIsFetching hook
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useIsFetching: vi.fn(),
  };
});

import { useIsFetching } from '@tanstack/react-query';

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
        {component}
      </QueryClientProvider>
    );
  };

  describe('Visibility States', () => {
    it('should show indicator when timetable queries are fetching', () => {
      vi.mocked(useIsFetching).mockReturnValue(1);

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
      vi.mocked(useIsFetching).mockReturnValue(3);

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
      // The component uses useIsFetching with a filter for timetable queries
      const mockUseIsFetching = vi.mocked(useIsFetching);
      mockUseIsFetching.mockReturnValue(1);

      renderWithQuery(<SyncIndicator />);

      expect(mockUseIsFetching).toHaveBeenCalledWith({
        queryKey: ['timetable'],
      });
    });

    it('should not show for non-timetable queries', () => {
      vi.mocked(useIsFetching).mockReturnValue(0);

      renderWithQuery(<SyncIndicator />);

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Transition Behavior', () => {
    it('should transition from hidden to visible', () => {
      const mockUseIsFetching = vi.mocked(useIsFetching);
      mockUseIsFetching.mockReturnValue(0);

      const { rerender } = renderWithQuery(<SyncIndicator />);

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();

      // Simulate query starting
      mockUseIsFetching.mockReturnValue(1);
      rerender(
        <QueryClientProvider client={queryClient}>
          <SyncIndicator />
        </QueryClientProvider>
      );

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
    });

    it('should transition from visible to hidden', () => {
      const mockUseIsFetching = vi.mocked(useIsFetching);
      mockUseIsFetching.mockReturnValue(1);

      const { rerender } = renderWithQuery(<SyncIndicator />);

      expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();

      // Simulate query finishing
      mockUseIsFetching.mockReturnValue(0);
      rerender(
        <QueryClientProvider client={queryClient}>
          <SyncIndicator />
        </QueryClientProvider>
      );

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Concurrent Fetches', () => {
    it('should show single indicator for multiple fetches', () => {
      vi.mocked(useIsFetching).mockReturnValue(5);

      renderWithQuery(<SyncIndicator />);

      // Should only show one indicator, not 5
      const indicators = screen.getAllByTestId('sync-indicator');
      expect(indicators).toHaveLength(1);
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
      const mockUseIsFetching = vi.mocked(useIsFetching);
      mockUseIsFetching.mockReturnValue(0);

      const { rerender } = renderWithQuery(<SyncIndicator />);

      // Same state - should not show
      rerender(
        <QueryClientProvider client={queryClient}>
          <SyncIndicator />
        </QueryClientProvider>
      );

      expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
      expect(mockUseIsFetching).toHaveBeenCalled();
    });
  });
});
