import { createContext } from 'react';
import type { InstructorsContextType } from './InstructorsProvider';

export const InstructorsContext = createContext<InstructorsContextType | undefined>(undefined);
