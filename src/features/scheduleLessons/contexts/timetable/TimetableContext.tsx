import { createContext } from 'react';
import type { TimetableContextType } from './TimetableProvider';

export const TimetableContext = createContext<TimetableContextType | undefined>(undefined);
