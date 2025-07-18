import React, { useState } from 'react';
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
  const { timetable, groups, assignSession, removeSession } = useTimetable();
  const [dragSource, setDragSource] = useState<DragSource | null>(null);

  // Helper: get all class session IDs currently in the timetable
  const assignedSessionIds = new Set(
    timetable
      .flat()
      .filter(Boolean)
      .map((cs) => cs!.id)
  );
  // Drawer shows only unassigned sessions
  const drawerSessions = classSessions.filter((cs: ClassSession) => !assignedSessionIds.has(cs.id));
  const drawerClasses = drawerSessions.map((cs) => cs.course.name + ' - ' + cs.group.name);

  // Drag started from drawer or timetable
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    e.dataTransfer.setData('text/plain', source.className);
  };

  // Drop into a timetable cell
  const handleDropToGrid = (e: React.DragEvent, groupIndex: number, periodIndex: number) => {
    e.preventDefault();
    if (!dragSource) return;
    // Find the ClassSession object by name
    const session =
      drawerSessions.find(
        (cs) => cs.course.name + ' - ' + cs.group.name === dragSource.className
      ) || timetable[dragSource.groupIndex ?? 0]?.[dragSource.periodIndex ?? 0];
    if (!session) return;
    // Delegate to context
    if (!timetable[groupIndex][periodIndex]) {
      assignSession(groupIndex, periodIndex, session);
      // Remove from original location
      if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
        removeSession(dragSource.groupIndex, dragSource.periodIndex!);
      }
    }
  };

  // Drop into the drawer
  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragSource) return;
    // Remove from timetable if that's the source
    if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
      removeSession(dragSource.groupIndex!, dragSource.periodIndex!);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <Drawer
        drawerClasses={drawerClasses}
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
