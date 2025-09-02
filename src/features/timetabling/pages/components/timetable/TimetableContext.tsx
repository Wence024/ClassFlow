// src/features/timetabling/pages/components/timetable/TimetableContext.tsx
import React, { createContext } from 'react';
import type { DragSource } from '../../../types/DragSource';

export interface TimetableContextType {
  dragOverCell: { groupId: string; periodIndex: number } | null;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  onHideTooltip: () => void;
  onDragEnter: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
}

/**
 * Defines the shape of the data and handlers shared across the timetable components.
 * These include drag-and-drop events, tooltip handlers, and the current dragged cell.
 *
 * @interface TimetableContextType
 * @prop {Object} dragOverCell - The cell currently being dragged over for visual feedback.
 * @prop {(e: React.DragEvent, source: DragSource) => void} onDragStart - Function for starting a drag event.
 * @prop {(e: React.DragEvent, groupId: string, periodIndex: number) => void} onDropToGrid - Function for handling drop events.
 * @prop {(content: React.ReactNode, target: HTMLElement) => void} onShowTooltip - Function to show tooltips.
 * @prop {() => void} onHideTooltip - Function to hide tooltips.
 * @prop {(e: React.DragEvent, groupId: string, periodIndex: number) => void} onDragEnter - Handler for drag enter events on grid cells.
 * @prop {(e: React.DragEvent) => void} onDragOver - Handler for drag over events.
 */

/**
 * React Context for providing timetable-wide state and handlers.
 * This helps avoid prop drilling through intermediate components.
 *
 * @const TimetableContext
 * @type {React.Context<TimetableContextType | undefined>}
 */
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export default TimetableContext;
