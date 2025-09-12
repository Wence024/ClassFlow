import { useContext } from 'react';
import TimetableContext, { type TimetableContextType } from './TimetableContext';

/**
 * Custom hook for accessing the TimetableContext.
 *
 * This hook throws an error if used outside of a TimetableContext.Provider, ensuring that the context
 * is properly provided to the component tree.
 *
 * @returns - The context value containing handlers and state.
 * @throws {Error} - If used outside of a TimetableContext.Provider.
 */
export const useTimetableContext = (): TimetableContextType => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetableContext must be used within a TimetableContext.Provider');
  }
  return context;
};
