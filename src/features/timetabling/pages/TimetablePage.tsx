import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, CustomTooltip } from '../../../components/ui';
import * as classSessionsService from '../../classSessions/services/classSessionsService';
import type { ClassSession } from '../../classSessions/types/classSession';
import TimetableContext from './components/timetable/TimetableContext';

/** Represents the state of the tooltip. */
interface TooltipState {
  content: React.ReactNode;
  position: { top: number; left: number };
}

/**
 * Renders the main timetabling interface page.
 *
 * This component acts as the orchestrator for the entire scheduling view.
 * It fetches all necessary data (timetable, groups, all class sessions),
 * initializes the drag-and-drop (D&D) logic via the `useTimetableDnd` hook,
 * and manages tooltip state.
 *
 * Crucially, it provides all D&D state and handlers to its children
 * (`Timetable`, `Drawer`) via the `TimetableContext.Provider`, enabling a fully
 * interactive and decoupled scheduling experience.
 *
 * @returns The rendered Timetable page component.
 */
const TimetablePage: React.FC = () => {
  // Fetches ALL class sessions from the database for a global view.
  const { data: allClassSessions = [], isLoading: isLoadingSessions } = useQuery<ClassSession[]>({
    queryKey: ['allClassSessions'],
    queryFn: classSessionsService.getAllClassSessions,
  });

  const { timetable, groups, loading: loadingTimetable } = useTimetable();
  const dnd = useTimetableDnd();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleShowTooltip = (content: React.ReactNode, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setTooltip({ content, position: { top: rect.top, left: rect.left + rect.width / 2 } });
  };
  const handleHideTooltip = () => setTooltip(null);

  // Memoized calculation for the sessions to show in the drawer.
  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    for (const sessionsInGroup of timetable.values()) {
      for (const session of sessionsInGroup) {
        if (session) assignedIds.add(session.id);
      }
    }

    const allUnassigned = allClassSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));

    // Defensive filtering to prevent crashes from orphaned data
    const validUnassigned = allUnassigned.filter((session) => {
      if (!session.course || !session.group) {
        console.warn(
          'Filtered out an invalid class session with missing course or group data. Session ID:',
          session.id
        );
        return false;
      }
      return true;
    });

    return validUnassigned;
  }, [timetable, allClassSessions]);

  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  // Combine D&D handlers and tooltip handlers into a single object for the context
  const contextValue = {
    ...dnd,
    onShowTooltip: handleShowTooltip,
    onHideTooltip: handleHideTooltip,
  };

  const isInitialLoading = (loadingTimetable || isLoadingSessions) && timetable.size === 0;

  return (
    <div>
      {tooltip && <CustomTooltip content={tooltip.content} position={tooltip.position} />}
      <main className="flex-1 space-y-6 min-w-0">
        {isInitialLoading ? (
          <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow-sm">
            <LoadingSpinner size={'lg'} text="Loading Timetable..." />
          </div>
        ) : (
          <TimetableContext.Provider value={contextValue}>
            <Timetable groups={groups} timetable={timetable} isLoading={loadingTimetable} />
            <Drawer
              drawerClassSessions={drawerClassSessions}
              onDragStart={dnd.handleDragStart}
              onDropToDrawer={dnd.handleDropToDrawer}
            />
          </TimetableContext.Provider>
        )}
      </main>
    </div>
  );
};

export default TimetablePage;
