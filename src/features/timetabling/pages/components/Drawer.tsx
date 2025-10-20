import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DragSource } from '../../types/DragSource';
import type { ClassSession } from '../../../classSessions/types/classSession';
import { Button } from '@/components/ui';

/** Represents the minimal data needed to display a class session in the drawer. */
type DrawerClassSession = Pick<ClassSession, 'id'> & { displayName: string };

/**
 * Props for the Drawer component.
 *
 * @param drawerClassSessions - An array of unassigned class sessions to be displayed.
 * @param onDragStart - The handler to call when dragging starts.
 * @param onDropToDrawer - The handler to call when something is dropped on the drawer.
 * @returns The rendered Drawer component.
 */
interface DrawerProps {
  /** An array of unassigned class sessions to be displayed. */
  drawerClassSessions: DrawerClassSession[];
  /** The `onDragStart` handler from the `useTimetableDnd` hook. */
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  /** The `onDrop` handler for the drawer area from the `useTimetableDnd` hook. */
  onDropToDrawer: (e: React.DragEvent) => void;
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
 * @returns The rendered drawer component.
 */
const Drawer: React.FC<DrawerProps> = ({ drawerClassSessions, onDragStart, onDropToDrawer }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg transition-transform duration-300 z-40"
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
            {drawerClassSessions.map((session) => (
              <li
                key={session.id}
                draggable
                onDragStart={(e) => onDragStart(e, { from: 'drawer', class_session_id: session.id })}
                className="px-3 py-2 bg-muted rounded-md cursor-grab text-sm hover:bg-muted/80 transition-colors"
                aria-label={`Draggable session: ${session.displayName}`}
              >
                {session.displayName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">All classes have been scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default Drawer;
