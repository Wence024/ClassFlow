/**
 * @file SyncIndicator with hook functionality that shows when data is syncing.
 * Uses react-query hooks to detect when data is being fetched.
 */
import { useIsFetching } from '@tanstack/react-query';
import SyncIndicator from './SyncIndicator';

/**
 * Renders a syncing indicator that automatically shows when timetable-related queries are fetching.
 *
 * @returns The rendered sync indicator component or null if no relevant queries are fetching.
 */
const SyncIndicatorWithHook = () => {
  const isFetching = useIsFetching({ queryKey: ['timetable'] });

  return <SyncIndicator isVisible={isFetching > 0} />;
};

export default SyncIndicatorWithHook;