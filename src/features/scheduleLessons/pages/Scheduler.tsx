import React, { useMemo } from 'react';
// import './Scheduler.css'; // Remove old CSS
import { useClassSessions } from '../hooks/useClassSessions';
import { TimetableProvider } from '../contexts/timetable/TimetableProvider';
import { useTimetable } from '../hooks/useTimetable';
import Drawer from '../components/timetabling/Drawer';
import Timetable from '../components/timetabling/Timetable';
import { useTimetableDnd } from '../hooks/useTimetableDnd';


// App component
const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  // Memoize derived data to prevent recalculating on every render
  const { unassignedSessions, assignedSessionIds } = useMemo(() => {
    const assignedIds = new Set(
      timetable.flat().filter(Boolean).map((cs) => cs!.id)
    );
    const unassigned = classSessions.filter((cs) => !assignedIds.has(cs.id));
    return { unassignedSessions: unassigned, assignedSessionIds: assignedIds };
  }, [timetable, classSessions]);

  const drawerSessions = unassignedSessions.map((cs) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
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
  );
};

const Scheduler: React.FC = () => (
  <TimetableProvider>
    <SchedulerApp />
  </TimetableProvider>
);

export default Scheduler;
