import { createContext } from 'react';
import type { ClassSessionsContextType } from './ClassSessionsProvider';

/**
 *  Provides class session state and CRUD methods to consumers.
 */
export const ClassSessionsContext = createContext<ClassSessionsContextType | undefined>(undefined);
