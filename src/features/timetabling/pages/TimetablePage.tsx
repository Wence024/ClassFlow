import React, { useMemo, useState } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Tooltip } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';

/** Represents the state of the tooltip. */
interface TooltipState {
  content: React.ReactNode;
  position: { top: number; left: number };
}

/**
 * Renders the main timetabling interface, including the interactive grid and the drawer of available class sessions.
 *
 * This component orchestrates the data-fetching hooks (`useTimetable`, `useClassSessions`) and the
 * drag-and-drop logic hook (`useTimetableDnd`) to create a fully interactive scheduling experience.
 * It is designed to be rendered within a larger application layout.
 *
 * @returns The rendered Timetable page component.
 */
const TimetablePage: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable();

  // Single call to the consolidated hook for all D&D logic
  const dnd = useTimetableDnd();

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleShowTooltip = (content: React.ReactNode, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setTooltip({ content, position: { top: rect.top, left: rect.left + rect.width / 2 } });
  };
  const handleHideTooltip = () => setTooltip(null);

  // Memoized calculation for the sessions to show in the drawer
  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    for (const sessionsInGroup of timetable.values()) {
      for (const session of sessionsInGroup) {
        if (session) assignedIds.add(session.id);
      }
    }
    return classSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));
  }, [timetable, classSessions]);

  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  const isInitialLoading = loading && timetable.size === 0;

  return (
    <div>
      {tooltip && <Tooltip content={tooltip.content} position={tooltip.position} />}
      <main className="flex-1 space-y-6 min-w-0">
        {isInitialLoading ? (
          <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow-sm">
            <LoadingSpinner size={'lg'} text="Loading Timetable..." />
          </div>
        ) : (
          <>
            <Timetable
              groups={groups}
              timetable={timetable}
              isLoading={loading}
              onShowTooltip={handleShowTooltip}
              onHideTooltip={handleHideTooltip}
              // Pass all D&D props from the hook
              draggedSession={dnd.activeDraggedSession}
              dragOverCell={dnd.dragOverCell}
              isSlotAvailable={dnd.isSlotAvailable}
              onDragStart={dnd.handleDragStart}
              onDragOver={dnd.handleDragOver}
              onDragEnter={dnd.handleDragEnter}
              onDragLeave={dnd.handleDragLeave}
              onDropToGrid={dnd.handleDropToGrid}
            />
            <Drawer
              drawerClassSessions={drawerClassSessions}
              onDragStart={dnd.handleDragStart}
              onDropToDrawer={dnd.handleDropToDrawer}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default TimetablePage;
