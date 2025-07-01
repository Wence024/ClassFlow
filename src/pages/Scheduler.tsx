import React from 'react';
import { useClassSessions } from '../context/ClassSessionsContext';
import { TimetableProvider, useTimetable } from '../context/TimetableContext';
import { Drawer } from '../components/Timetable/Drawer';
import { TimetableGrid } from '../components/Timetable/TimetableGrid';
import type { DragSource } from '../types/timetable';

const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, setTimetable } = useTimetable();
  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
  const [dragSource, setDragSource] = React.useState<DragSource | null>(null);

  // Helper: get all class session IDs currently in the timetable
  const assignedSessionIds = new Set(
    timetable.flat().filter(Boolean).map((cs) => cs?.id)
  );

  // Drawer shows only unassigned sessions
  const drawerSessions = classSessions.filter((cs) => !assignedSessionIds.has(cs.id));
  const drawerClasses = drawerSessions.map(
    (cs) => `${cs.course.name} - ${cs.group.name}`
  );

  // Drag started from drawer or timetable
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    e.dataTransfer.setData('text/plain', source.className);
  };

  // Drop into a timetable cell
  const handleDropToGrid = (
    e: React.DragEvent,
    groupIndex: number,
    periodIndex: number
  ) => {
    e.preventDefault();
    if (!dragSource) return;

    // Find the ClassSession object by name
    const session =
      drawerSessions.find(
        (cs) => `${cs.course.name} - ${cs.group.name}` === dragSource.className
      ) || timetable[dragSource.groupIndex ?? 0]?.[dragSource.periodIndex ?? 0];

    if (!session) return;

    setTimetable((prev) => {
      const updated = prev.map((row) => [...row]);
      // Do not overwrite if destination already filled
      if (updated[groupIndex][periodIndex]) return prev;
      updated[groupIndex][periodIndex] = session;
      // Remove from original location
      if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
        updated[dragSource.groupIndex][dragSource.periodIndex!] = null;
      }
      return updated;
    });
  };

  // Drop into the drawer
  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragSource?.from === 'timetable' && dragSource.groupIndex !== undefined) {
      setTimetable((prev) => {
        const updated = prev.map((row) => [...row]);
        updated[dragSource.groupIndex!][dragSource.periodIndex!] = null;
        return updated;
      });
    }
  };

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