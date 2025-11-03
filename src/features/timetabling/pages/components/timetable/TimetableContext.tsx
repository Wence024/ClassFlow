import React, { createContext } from 'react';
import type { DragSource } from '../../../types/DragSource';
import type { ClassSession } from '../../../../classSessions/types/classSession';

/**
 * Defines the shape of the data and handlers shared across timetable components.
 * This context provides all necessary state and callbacks for drag-and-drop (D&D)
 * functionality and tooltip management, eliminating the need for prop drilling.
 * The property names align directly with the return values of the `useTimetableDnd` hook.
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

  // Pending session tracking
  pendingSessionIds?: Set<string>;
  
  // Pending placement session (awaiting cross-dept request submission)
  pendingPlacementSessionId?: string;
  
  // Highlight parameters for showing requested resource location
  highlightPeriod?: number;
  highlightGroup?: string;
}

/**
 * React Context for providing timetable-wide state and event handlers.
 * This allows deep-nested components like `SessionCell` and `EmptyCell` to access
 * D&D state and callbacks without passing props through the entire component tree.
 */
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export default TimetableContext;
