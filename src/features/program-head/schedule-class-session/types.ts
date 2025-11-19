/**
 * Use-case specific types for scheduling class sessions on the timetable.
 */

import type { 
  TimetableViewMode, 
  HydratedTimetableAssignment,
  TimetableAssignmentInsert 
} from '@/features/timetabling/types/timetable';
import type { ClassSession } from '@/types/classSession';
import type { DragSource } from '@/features/timetabling/types/DragSource';

/**
 * Parameters for assigning a session to the timetable.
 */
export type AssignSessionParams = {
  classSessionId: string;
  classGroupId: string;
  periodIndex: number;
  status?: 'pending' | 'confirmed';
};

/**
 * Parameters for moving a session on the timetable.
 */
export type MoveSessionParams = {
  classSessionId: string;
  fromClassGroupId: string;
  fromPeriodIndex: number;
  toClassGroupId: string;
  toPeriodIndex: number;
};

/**
 * Parameters for removing a session from the timetable.
 */
export type RemoveSessionParams = {
  classGroupId: string;
  periodIndex: number;
};

/**
 * Drag and drop state for timetable interactions.
 */
export type TimetableDragState = {
  draggedSession: ClassSession | null;
  dragSource: DragSource | null;
  hoveredCell: { classGroupId: string; periodIndex: number } | null;
};

export type { TimetableViewMode, HydratedTimetableAssignment, TimetableAssignmentInsert };
