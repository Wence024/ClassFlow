// src/features/timetabling/pages/components/timetable/TimetableContext.tsx
import React, { createContext } from 'react';
import type { DragSource } from '../../../types/DragSource';
import type { ClassSession } from '../../../../classSessions/types/classSession';

/**
 * Defines the shape of the data and handlers shared across the timetable components.
 * These include drag-and-drop events, tooltip handlers, conflict detection, and visual feedback.
 *
 * DragOverCell - The cell currently being dragged over for visual feedback.
 *
 * CurrentDraggedSession - The session currently being dragged.
 *
 * IsSlotAvailable - Function to check if a slot is available for placement.
 *
 * OnDragStart - Function for starting a drag event.
 *
 * OnDropToGrid - Function for handling drop events.
 *
 * OnShowTooltip - Function to show tooltips.
 *
 * OnHideTooltip - Function to hide tooltips.
 *
 * OnDragEnter - Handler for drag enter events on grid cells.
 *
 * OnDragLeave - Handler for drag leave events on grid cells.
 *
 * OnDragOver - Handler for drag over events.
 */
export interface TimetableContextType {
  dragOverCell: { groupId: string; periodIndex: number } | null;
  currentDraggedSession: ClassSession | null;
  isSlotAvailable: (groupId: string, periodIndex: number) => boolean;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  onHideTooltip: () => void;
  onDragEnter: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

/**
 * React Context for providing timetable-wide state and handlers.
 * This helps avoid prop drilling through intermediate components.
 *
 */
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export default TimetableContext;
