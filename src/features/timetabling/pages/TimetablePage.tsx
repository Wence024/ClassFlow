import { useMemo } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Notification } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

/**
 * The main page component for the timetabling interface.
 *
 * This component serves as the top-level orchestrator for the timetabling feature. Its primary roles are:
 * - Calling all the necessary hooks (`useTimetable`, `useClassSessions`, `useTimetableDnd`).
 * - Computing derived state, such as the list of unassigned class sessions for the drawer.
 * - Assembling the final page layout by passing the data and event handlers from the hooks
 *   down to the presentational components (`Header`, `Sidebar`, `Timetable`, `Drawer`).
 */
const TimetablePage: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  /**
   * Memoized calculation to determine which class sessions are not currently placed on the timetable.
   * This is derived by comparing the full list of class sessions with the IDs of those in the timetable grid.
   */
  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    // Iterate through the timetable map to collect all assigned session IDs.
    for (const sessionsInGroup of timetable.values()) {
      for (const session of sessionsInGroup) {
        if (session) {
          assignedIds.add(session.id);
        }
      }
    }
    // Filter the master list of sessions to find those not in the assigned set.
    return classSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));
  }, [timetable, classSessions]);

  /** Formats the unassigned sessions into the shape expected by the Drawer component. */
  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Notification />
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Main layout container */}
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <Sidebar />
          <main className="flex-1 space-y-6 min-w-0">
            {/* The relative positioning is for the loading spinner overlay */}
            <div className="relative w-full h-full">
              {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-30 rounded-lg">
                  <LoadingSpinner size={'lg'} text="Syncing Timetable..." />
                </div>
              )}
              <Timetable
                groups={groups}
                timetable={timetable}
                onDragStart={handleDragStart}
                onDropToGrid={handleDropToGrid}
              />
              <Drawer
                drawerClassSessions={drawerClassSessions}
                onDragStart={handleDragStart}
                onDropToDrawer={handleDropToDrawer}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
