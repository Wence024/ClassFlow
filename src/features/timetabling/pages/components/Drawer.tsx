import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DragSource } from '../../types/DragSource';
import type { ClassSession } from '../../../classSessions/types/classSession';
import { Button } from '@/components/ui';
import { useTimetableContext } from './timetable/useTimetableContext';

/** Represents the minimal data needed to display a class session in the drawer. */
type DrawerClassSession = Pick<
  ClassSession,
  'id' | 'course' | 'group' | 'instructor' | 'classroom'
> & { displayName: string };

/**
 * Builds tooltip content for a drawer session.
 *
 * @param session - The class session to build tooltip for.
 * @returns The JSX element to be rendered inside the tooltip.
 */
const buildDrawerTooltipContent = (session: DrawerClassSession): React.ReactElement => (
  <>
    <p className="font-bold text-sm">{session.course.name}</p>
    <p className="text-gray-300">{session.course.code}</p>
    <p className="mt-1">Class Group: {session.group.name}</p>
    <p>
      Instructor: {session.instructor.first_name} {session.instructor.last_name}
    </p>
    <p>Classroom: {session.classroom.name}</p>
    <p className="mt-1 text-xs text-gray-400">Drag to timetable to schedule</p>
  </>
);

/**
 * Props for the Drawer component.
 *
 * @param drawerClassSessions - An array of unassigned class sessions to be displayed.
 * @param onDragStart - The handler to call when dragging starts.
 * @param onDropToDrawer - The handler to call when something is dropped on the drawer.
 * @param pendingPlacementSessionId - Optional ID of session awaiting timetable placement for cross-dept request.
 * @returns The rendered Drawer component.
 */
interface DrawerProps {
  /** An array of unassigned class sessions to be displayed. */
  drawerClassSessions: DrawerClassSession[];
  /** The `onDragStart` handler from the `useTimetableDnd` hook. */
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  /** The `onDrop` handler for the drawer area from the `useTimetableDnd` hook. */
  onDropToDrawer: (e: React.DragEvent) => void;
  /** Optional ID of session awaiting placement for cross-dept request (highlighted with pulsing border). */
  pendingPlacementSessionId?: string;
}

/**
 * A UI component that displays the list of unassigned class sessions.
 *
 * This component renders a list of draggable pills for each class session not yet on the timetable.
 * It also acts as a droppable target for class sessions dragged from the timetable, effectively unassigning them.
 * The drawer is fixed to the bottom of the viewport and can be collapsed.
 *
 * @param d The props for the component.
 * @param d.drawerClassSessions - An array of unassigned class sessions to be displayed.
 * @param d.onDragStart - The `onDragStart` handler from the `useTimetableDnd` hook.
 * @param d.onDropToDrawer - The handler to call when something is dropped on the drawer.
 * @param d.pendingPlacementSessionId - Optional ID of a class session currently awaiting cross-department timetable placement (this pill is highlighted).
 * @returns The rendered drawer component.
 */
const Drawer: React.FC<DrawerProps> = ({
  drawerClassSessions,
  onDragStart,
  onDropToDrawer,
  pendingPlacementSessionId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { onShowTooltip, onHideTooltip } = useTimetableContext();

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('timetable-drawer-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage whenever it changes
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('timetable-drawer-collapsed', String(newState));
  };

  // Prevents the browser's default drag over behavior to enable custom drop actions.
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      data-cy="timetable-drawer"
      className="sticky bottom-0 bg-background border-t shadow-lg transition-transform duration-300 z-40 drawer"
      style={{ transform: isCollapsed ? 'translateY(calc(100% - 3rem))' : 'translateY(0)' }}
    >
      {/* Collapse/Expand Button */}
      <div className="flex justify-center border-b bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="w-full rounded-none h-12 hover:bg-muted/50"
          aria-label={isCollapsed ? 'Expand drawer' : 'Collapse drawer'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Available Classes ({drawerClassSessions.length})
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Hide Drawer
            </>
          )}
        </Button>
      </div>

      {/* Drawer Content */}
      <div
        className="p-4 max-h-64 overflow-y-auto"
        onDrop={onDropToDrawer}
        onDragOver={handleDragOver}
        aria-label="Available Classes Drawer"
      >
        {drawerClassSessions.length > 0 ? (
          <ul className="flex flex-wrap gap-2 justify-center">
            {drawerClassSessions.map((session) => {
              const isPendingPlacement = session.id === pendingPlacementSessionId;
              return (
                <li
                  key={session.id}
                  data-cy={`unassigned-session-${session.id}`}
                  draggable
                  onDragStart={(e) =>
                    onDragStart(e, { from: 'drawer', class_session_id: session.id })
                  }
                  onMouseEnter={(e) =>
                    onShowTooltip(buildDrawerTooltipContent(session), e.currentTarget)
                  }
                  onMouseLeave={onHideTooltip}
                  className={`relative px-3 py-2 rounded-md cursor-grab text-sm transition-all ${
                    isPendingPlacement
                      ? 'bg-orange-500/10 border-2 border-orange-500 animate-pulse shadow-lg shadow-orange-500/20'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  aria-label={`Draggable session: ${session.displayName}`}
                >
                  {session.displayName}
                  {isPendingPlacement && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      !
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">All classes have been scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default Drawer;
