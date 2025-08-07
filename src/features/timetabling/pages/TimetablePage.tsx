import React, { useMemo } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Notification } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';

// SchedulerApp no longer needs to be a separate component
const Scheduler: React.FC = () => {
  const { classSessions } = useClassSessions();
  // useTimetable now works without a provider
  const { timetable, groups, loading } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    for (const classSessions of timetable.values()) {
      for (const session of classSessions) {
        if (session) {
          assignedIds.add(session.id);
        }
      }
    }
    return classSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));
  }, [timetable, classSessions]);

  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  return (
    <>
      <Notification />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-8">
        <Drawer
          drawerClassSessions={drawerClassSessions}
          onDragStart={handleDragStart}
          onDropToDrawer={handleDropToDrawer}
        />
        <div className="relative w-full">
          {loading && (
            <div className="absolute right-1/2 top-4 -translate-x-1/2 z-10">
              <LoadingSpinner size={'md'} text="" />
            </div>
          )}
          <Timetable
            groups={groups}
            timetable={timetable}
            onDragStart={handleDragStart}
            onDropToGrid={handleDropToGrid}
          />
        </div>
      </div>
    </>
  );
};

export default Scheduler;
