/**
 * @file Defines the types and context for the global layout state.
 */
import { createContext } from 'react';

/**
 * Defines the shape of the layout context value.
 */
export interface LayoutContextType {
  /** Whether the sidebar is currently collapsed. */
  isSidebarCollapsed: boolean;
  /** Function to toggle the sidebar collapsed state. */
  toggleSidebar: () => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
