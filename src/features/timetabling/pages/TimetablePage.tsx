import React, { useMemo, useState } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Notification, Tooltip } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { DragSource } from '../types/DragSource';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

/** Represents the state of the tooltip. */
interface TooltipState {
  content: React.ReactNode;
  position: { top: number; left: number };
}

/**
 * The main page component for the timetabling interface.
 *
 * This component orchestrates the entire timetabling feature. It now differentiates between
 * an initial, blocking page load and non-blocking background syncs, providing a much
 * smoother user experience after interactions.
 */
const TimetablePage: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable(); // Get isFetching from the hook
  const {
    handleDragStart: dndHandleDragStart,
    handleDropToGrid,
    handleDropToDrawer,
  } = useTimetableDnd();

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // --- (Tooltip and DragStart handlers are unchanged) ---
  const handleShowTooltip = (content: React.ReactNode, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setTooltip({ content, position: { top: rect.top, left: rect.left + rect.width / 2 } });
  };
  const handleHideTooltip = () => setTooltip(null);
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    handleHideTooltip();
    dndHandleDragStart(e, source);
  };

  // --- (Memoized calculations are unchanged) ---
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

  /** Differentiate between the initial page load and subsequent background fetches. */
  const isInitialLoading = loading && timetable.size === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Notification />
      {tooltip && <Tooltip content={tooltip.content} position={tooltip.position} />}
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <Sidebar />
          <main className="flex-1 space-y-6 min-w-0">
            {isInitialLoading ? (
              // If it's the very first load (loading is true AND we have no data), show a big spinner.
              <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow-sm">
                <LoadingSpinner size={'lg'} text="Loading Timetable..." />
              </div>
            ) : (
              // Otherwise, render the timetable. The `loading` prop will handle the small "Syncing..." text.
              <>
                <Timetable
                  groups={groups}
                  timetable={timetable}
                  isLoading={loading} // Pass the single loading state
                  onDragStart={handleDragStart}
                  onDropToGrid={handleDropToGrid}
                  onShowTooltip={handleShowTooltip}
                  onHideTooltip={handleHideTooltip}
                />
                <Drawer
                  drawerClassSessions={drawerClassSessions}
                  onDragStart={handleDragStart}
                  onDropToDrawer={handleDropToDrawer}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
