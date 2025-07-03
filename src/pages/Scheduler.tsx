import React from 'react';
import { useClassSessions } from '../context/ClassSessionsContext';
import { TimetableProvider, useTimetable } from '../context/TimetableContext';
import { Drawer } from '../components/Timetable/Drawer';
import { TimetableGrid } from '../components/Timetable/TimetableGrid';
import { useTimetableDnD } from '../hooks/useTimetableDnD';

const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, setTimetable } = useTimetable();
  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

  const { drawerClasses, handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnD(
    classSessions,
    timetable,
    setTimetable
  );

  return (
    <div className="container">
      <Drawer
        drawerClasses={drawerClasses}
        onDragStart={handleDragStart}
        onDropToDrawer={handleDropToDrawer}
      />
      <TimetableGrid
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
