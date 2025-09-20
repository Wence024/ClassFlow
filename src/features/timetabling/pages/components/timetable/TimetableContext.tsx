import React, { createContext } from 'react';
import type { DragSource } from '../../../types/DragSource';
import type { ClassSession } from '../../../../classSessions/types/classSession';

/**
 * Defines the shape of the data and handlers shared across timetable components.
 * This context provides all necessary state and callbacks for drag-and-drop (D&D)
 * functionality and tooltip management, eliminating the need for prop drilling.
 * The property names align directly with the return values of the `useTimetableDnd` hook.
 *
 * @property dragOverCell - The cell coordinates (`groupId`, `periodIndex`) currently being hovered over during a drag.
 * @property activeDraggedSession - The full `ClassSession` object that is currently being dragged. Null if no drag is active.
 * @property isSlotAvailable - A function to check if a specific grid cell is a valid drop target.
 * @property handleDragStart - Callback to initiate a drag operation, capturing the session being dragged.
 * @property handleDropToGrid - Callback to handle the drop event onto the main timetable grid.
 * @property handleDragEnter - Callback for when a dragged item enters a valid drop target (a grid cell).
 * @property handleDragLeave - Callback for when a dragged item leaves a drop target.
 * @property handleDragOver - Callback that fires continuously as an item is dragged over a target. Necessary to allow dropping.
 * @property onShowTooltip - Handler to display a tooltip with specific content at a target element's position.
 * @property onHideTooltip - Handler to hide the currently visible tooltip.
 */
export interface TimetableContextType {
  // D&D state and handlers from useTimetableDnd
  dragOverCell: { groupId: string; periodIndex: number; session?: ClassSession } | null;
  activeDraggedSession: ClassSession | null;
  isSlotAvailable: (groupId: string, periodIndex: number) => boolean;
  handleDragStart: (e: React.DragEvent, source: DragSource) => void;
  handleDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  handleDragEnter: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;

  // Tooltip handlers from TimetablePage
  onShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  onHideTooltip: () => void;
}

/**
 * React Context for providing timetable-wide state and event handlers.
 * This allows deep-nested components like `SessionCell` and `EmptyCell` to access
 * D&D state and callbacks without passing props through the entire component tree.
 */
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export default TimetableContext;