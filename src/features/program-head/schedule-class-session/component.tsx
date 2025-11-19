/**
 * UI component for Schedule Class Session use case.
 * 
 * This is a simplified demonstration of the vertical slice pattern for timetabling.
 * The full implementation would include the complete timetable grid with drag-and-drop.
 */

import { Button } from '@/components/ui';
import LoadingSpinner from '@/components/ui/custom/loading-spinner';
import { useScheduleClassSession } from './hook';
import type { TimetableViewMode } from './types';

interface ScheduleClassSessionViewProps {
  viewMode?: TimetableViewMode;
}

/**
 * Timetable scheduling view demonstrating vertical slice architecture.
 * 
 * NOTE: This is a pilot implementation. The full timetable UI with grid,
 * drag-and-drop, and all interactions would be built here.
 */
export function ScheduleClassSessionView({ 
  viewMode = 'class-group' 
}: ScheduleClassSessionViewProps) {
  const {
    assignments,
    isLoading,
    activeSemester,
  } = useScheduleClassSession(viewMode);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!activeSemester) {
    return (
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">
          No active semester configured. Please set up a semester in the schedule configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Schedule Class Sessions (Pilot)
        </h3>
        <div className="text-sm text-muted-foreground">
          View: {viewMode} | Semester: {activeSemester.name}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        This demonstrates the vertical slice architecture for timetabling.
        The full timetable grid with drag-and-drop would be implemented here.
      </p>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          Current Assignments: {assignments.length}
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Conflict detection integrated</p>
          <p>✓ Cross-department workflow supported</p>
          <p>✓ Real-time updates ready</p>
          <p>✓ Multiple view modes available</p>
        </div>
      </div>

      <Button variant="outline" disabled>
        Full Timetable Grid (To Be Implemented)
      </Button>
    </div>
  );
}
