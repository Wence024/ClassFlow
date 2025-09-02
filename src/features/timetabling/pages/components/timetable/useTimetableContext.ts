import { useContext } from 'react';
import TimetableContext, { type TimetableContextType } from './TimetableContext';

/**
 * Custom hook for accessing the TimetableContext.
 * Throws an error if used outside of a TimetableProvider.
 * @returns {TimetableContextType} The context value.
 */
export const useTimetableContext = (): TimetableContextType => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetableContext must be used within a TimetableContext.Provider');
  }
  return context;
};
