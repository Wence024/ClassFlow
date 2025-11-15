/**
 * @file Syncing indicator that shows when data is being synchronized.
 * Displays a spinner and "Syncing..." text for visual feedback.
 */
import { Loader2 } from 'lucide-react';

interface SyncIndicatorProps {
  isVisible: boolean;
}

/**
 * Renders a syncing indicator with spinner animation.
 *
 * @param si - The component props.
 * @param si.isVisible - Whether the syncing indicator should be visible.
 * @returns The rendered sync indicator component or null if not visible.
 */
const SyncIndicator = ({ isVisible }: SyncIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" data-cy="sync-indicator">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Syncing...</span>
    </div>
  );
};

export default SyncIndicator;
