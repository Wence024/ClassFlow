import React, { useMemo, useState } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { Drawer, Timetable } from './components';
import { useTimetableDnd } from '../hooks/useTimetableDnd';
import { LoadingSpinner, Notification, Tooltip } from '../../../components/ui';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import type { ClassSession } from '../../classSessions/types/classSession';
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
 * This component orchestrates the entire timetabling feature, including managing the
 * state for the portal-based tooltip to ensure it is not truncated by scroll containers.
 */
const TimetablePage: React.FC = () => {
  const { classSessions } = useClassSessions();
  const { timetable, groups, loading } = useTimetable();
  const { handleDragStart, handleDropToGrid, handleDropToDrawer } = useTimetableDnd();

  /** State for managing the tooltip's visibility, content, and position. */
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  /**
   * A callback function passed to child components to show the tooltip.
   * It calculates the position based on the hovered element.
   * @param content - The JSX content to render inside the tooltip.
   * @param target - The DOM element that was hovered over.
   */
  const handleShowTooltip = (content: React.ReactNode, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setTooltip({
      content,
      position: {
        top: rect.top,
        left: rect.left + rect.width / 2, // Center horizontally on the target
      },
    });
  };

  /** Hides the tooltip by resetting its state to null. */
  const handleHideTooltip = () => {
    setTooltip(null);
  };

  /** Memoized calculation to determine which class sessions are unassigned. */
  const unassignedClassSessions = useMemo(() => {
    const assignedIds = new Set<string>();
    for (const sessionsInGroup of timetable.values()) {
      for (const session of sessionsInGroup) {
        if (session) {
          assignedIds.add(session.id);
        }
      }
    }
    return classSessions.filter((cs: ClassSession) => !assignedIds.has(cs.id));
  }, [timetable, classSessions]);

  /** Formats the unassigned sessions for the Drawer component. */
  const drawerClassSessions = unassignedClassSessions.map((cs: ClassSession) => ({
    id: cs.id,
    displayName: `${cs.course.name} - ${cs.group.name}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Notification />
      {/* The Tooltip is rendered here at the page level, outside of any clipping containers. */}
      {tooltip && <Tooltip content={tooltip.content} position={tooltip.position} />}

      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <Sidebar />
          <main className="flex-1 space-y-6 min-w-0">
            <div className="relative w-full h-full">
              {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-30 rounded-lg">
                  <LoadingSpinner size={'lg'} text="Syncing Timetable..." />
                </div>
              )}
              <Timetable
                groups={groups}
                timetable={timetable}
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
