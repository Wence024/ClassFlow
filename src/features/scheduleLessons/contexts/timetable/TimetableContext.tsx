import { createContext } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';

export interface TimetableContextType {
  groups: string[];
  timetable: (ClassSession | null)[][];
  assignSession: (groupIndex: number, periodIndex: number, session: ClassSession) => string;
  removeSession: (groupIndex: number, periodIndex: number) => void;
  moveSession: (
    from: { groupIndex: number; periodIndex: number },
    to: { groupIndex: number; periodIndex: number }
  ) => string;
}

/**
 * Provides timetable state and methods for manipulating the grid.
 */
export const TimetableContext = createContext<TimetableContextType | undefined>(undefined);
