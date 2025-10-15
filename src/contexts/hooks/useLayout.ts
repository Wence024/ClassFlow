/**
 * @file Custom hook to access the layout context.
 */
import { useContext } from 'react';
import { LayoutContext, LayoutContextType } from '../types/layout';

/**
 * Hook to access the layout context.
 * Must be used within a LayoutProvider.
 *
 * @returns The layout context value containing sidebar state and toggle function.
 */
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
