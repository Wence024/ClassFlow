import { createContext } from 'react';
import type { ClassSession, ClassGroup } from '../../types/';

export interface TimetableContextType {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  assignSession: (
    class_group_id: string,
    period_index: number,
    session: ClassSession
  ) => Promise<string>;
  removeSession: (class_group_id: string, period_index: number) => Promise<void>;
  moveSession: (
    from: { class_group_id: string; period_index: number },
    to: { class_group_id: string; period_index: number },
    session: ClassSession
  ) => Promise<string>;
  loading: boolean;
  error: Error | null;
}

/**
 * Provides timetable state and methods for manipulating the grid.
 */
export const TimetableContext = createContext<TimetableContextType | undefined>(undefined);
