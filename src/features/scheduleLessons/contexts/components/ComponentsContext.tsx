import { createContext } from 'react';
import type { ManagementContextType } from './ComponentsProvider';

// Provides all component state and CRUD methods to consumers.
export const ComponentsContext = createContext<ManagementContextType | undefined>(undefined);
