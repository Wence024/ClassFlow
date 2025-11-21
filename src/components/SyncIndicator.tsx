/**
 * @file Syncing indicator that shows when data is being synchronized.
 * Displays a spinner and "Syncing..." text for visual feedback.
 */
import { Loader2 } from 'lucide-react';
import { useIsFetching } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

interface SyncIndicatorProps {
  isVisible?: boolean; // Optional prop to override internal visibility logic
}

/**
 * Renders a syncing indicator with spinner animation.
 * Can either use internal logic based on react-query state or accept a visibility prop.
 *
 * @param si - The component props.
 * @param si.isVisible - Optional override for whether the syncing indicator should be visible.
 * @returns The rendered sync indicator component or null if not visible.
 */
const SyncIndicator = ({ isVisible }: SyncIndicatorProps = {}) => {
  // Use internal logic if no visibility prop is provided
  const location = useLocation();
  const isTimetablePage = location.pathname === '/scheduler';

  // Check if timetable-related queries are loading (only on timetable page)
  const timetableFetching = useIsFetching({
    queryKey: ['hydratedTimetable']
  });
  const assignmentsFetching = useIsFetching({
    queryKey: ['timetable_assignments']
  });

  const internalIsSyncing = isTimetablePage && (timetableFetching > 0 || assignmentsFetching > 0);

  // Use provided prop if available, otherwise use internal logic
  const shouldShow = isVisible !== undefined ? isVisible : internalIsSyncing;

  if (!shouldShow) return null;

  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground"
      data-testid="sync-indicator"
      data-cy="sync-indicator"
      role="status"
      aria-label="Syncing timetable data"
    >
      <Loader2 className="h-4 w-4 animate-spin" data-testid="sync-spinner" />
      <span>Syncing...</span>
    </div>
  );
};

export default SyncIndicator;
