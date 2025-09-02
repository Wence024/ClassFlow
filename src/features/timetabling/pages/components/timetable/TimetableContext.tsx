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

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export default TimetableContext;
