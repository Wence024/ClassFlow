import React, { useState, useMemo } from 'react';
// import './Scheduler.css'; // Remove old CSS
import { useClassSessions } from '../hooks/useClassSessions';
import { TimetableProvider } from '../contexts/timetable/TimetableProvider';
import type { ClassSession } from '../types/scheduleLessons';
import { useTimetable } from '../hooks/useTimetable';
import type { DragSource } from '../components/timetabling/Drawer';
import Drawer from '../components/timetabling/Drawer';
import Timetable from '../components/timetabling/Timetable';


// App component
const SchedulerApp: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups, assignSession, removeSession, moveSession } = useTimetable();
  const [dragSource, setDragSource] = useState<DragSource | null>(null);

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

  // Drag started from drawer or timetable
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    // Use a generic data type; the important data is in the `dragSource` state
    e.dataTransfer.setData('text/plain', source.sessionId);
  };

  // Drop into a timetable cell
  const handleDropToGrid = (e: React.DragEvent, groupIndex: number, periodIndex: number) => {
    e.preventDefault();
    if (!dragSource) return;

    // Case 1: Moving an item within the timetable grid
    if (dragSource.from === 'timetable') {
      moveSession(
        { groupIndex: dragSource.groupIndex!, periodIndex: dragSource.periodIndex! },
        { groupIndex, periodIndex }
      );
      return;
    }

    // Case 2: Dragging a new item from the drawer
    if (dragSource.from === 'drawer') {
      const sessionToAssign = classSessions.find((cs) => cs.id === dragSource.sessionId);
      if (sessionToAssign) {
        assignSession(groupIndex, periodIndex, sessionToAssign);
      }
    }
  };

  // Drop into the drawer
  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    // Only handle drops from the timetable grid back to the drawer
    if (dragSource?.from === 'timetable') {
      removeSession(dragSource.groupIndex!, dragSource.periodIndex!);
    }
  };

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
