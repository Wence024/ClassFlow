import React, { useMemo } from 'react';
// import './Scheduler.css'; // Remove old CSS
import { useClassSessions } from '../hooks/useClassSessions';
import { TimetableProvider } from '../contexts/timetable/TimetableProvider';
import { useTimetable } from '../hooks/useTimetable';
import Drawer from '../components/timetabling/Drawer';
import Timetable from '../components/timetabling/Timetable';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Notification } from '../components/';
import type { ClassSession } from '../types';

// App component
const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  // Memoize derived data to prevent recalculating on every render
  const unassignedSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    // Iterate over the map values to get all assigned sessions
    for (const sessions of timetable.values()) {
      for (const session of sessions) {
        if (session) {
          assignedIds.add(session.id);
        }
      }
    }
    return classSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));
  }, [timetable, classSessions]);

  const drawerSessions = unassignedSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  return (
    <>
      <Notification />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8 relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
            {loading && <LoadingSpinner text="Updating timetable..." />}
          </div>
        )}
        <Drawer
          drawerSessions={drawerSessions}
          onDragStart={handleDragStart}
          onDropToDrawer={handleDropToDrawer}
        />
        <Timetable
          groups={groups}
          timetable={timetable}
          onDragStart={handleDragStart}
          onDropToGrid={handleDropToGrid}
        />
      </div>
    </>
  );
};

const Scheduler: React.FC = () => (
  <TimetableProvider>
    <SchedulerApp />
  </TimetableProvider>
);

export default Scheduler;
