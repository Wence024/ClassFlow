/**
 * @file Provides global layout state for the application, including sidebar collapse state.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Defines the shape of the layout context value.
 */
interface LayoutContextType {
  /** Whether the sidebar is currently collapsed */
  isSidebarCollapsed: boolean;
  /** Function to toggle the sidebar collapsed state */
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/**
 * Hook to access the layout context.
 * Must be used within a LayoutProvider.
 *
 * @returns The layout context value containing sidebar state and toggle function.
 */
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

/**
 * Provider component that manages layout state and provides it to child components.
 *
 * @param children - The child components that will have access to the layout context.
 */
export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <LayoutContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};
