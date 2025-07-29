import { createContext } from 'react';
import type { ClassSession, ClassGroup } from '../../types/';

export interface TimetableContextType {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  assignSession: (groupId: string, periodIndex: number, session: ClassSession) => string;
  removeSession: (groupId: string, periodIndex: number) => void;
  moveSession: (
    from: { groupId: string; periodIndex: number },
    to: { groupId: string; periodIndex: number },
    session: ClassSession
  ) => string;
}

/**
 * Provides timetable state and methods for manipulating the grid.
 */
export const TimetableContext = createContext<TimetableContextType | undefined>(undefined);
