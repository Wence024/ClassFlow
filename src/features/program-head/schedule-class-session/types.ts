/**
 * Use-case specific types for scheduling class sessions on the timetable.
 */

import type { ClassSession } from '@/types/classSession';

// --- Drag and Drop Types ---

/**
 * Represents the source of a drag operation in the timetable interface.
 */
export type DragSource =
  | {
      from: 'drawer';
      class_session_id: string;
    }
  | {
      from: 'timetable';
      class_session_id: string;
      class_group_id: string;
      period_index: number;
    };

// --- Timetable Types (re-exported from src/types/timetable.ts) ---

import type {
  TimetableViewMode as TVM,
  HydratedTimetableAssignment as HTA,
  TimetableAssignmentInsert as TAI,
} from '@/types/timetable';

export type TimetableViewMode = TVM;
export type HydratedTimetableAssignment = HTA;
export type TimetableAssignmentInsert = TAI;

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

/**
 * Types of confirmations needed for drag-and-drop operations.
 */
export type ConfirmationType = 
  | 'cross-department' 
  | 'resource-reassignment'
  | 'remove-cross-department';

/**
 * Metadata for resource reassignment confirmations.
 */
export interface ResourceReassignmentMetadata {
  resourceType: 'instructor' | 'classroom';
  fromName: string;
  toName: string;
  fromId: string;
  toId: string;
}

/**
 * Metadata about resource changes during drag-and-drop reassignment. Used for confirmation dialogs and mutation logic.
 */
export interface ResourceChangeMetadata {
  /** Whether a resource is being changed (vs. Initially assigned). */
  isChanging: boolean;
  /** ID of the current resource being replaced. */
  fromId: string;
  /** ID of the new resource being assigned. */
  toId: string;
  /** Type of resource being changed. */
  resourceType: 'instructor' | 'classroom';
}
