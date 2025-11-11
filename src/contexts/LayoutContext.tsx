/**
 * @file Provides a provider component for the global layout state.
 */
import React, { useState, ReactNode } from 'react';
import { LayoutContext, LayoutContextType } from './types/layout';

/**
 * Provider component that manages layout state and provides it to child components.
 *
 * @param lp - The root component.
 * @param lp.children - The child components that will have access to the layout context.
 * @returns The provider component.
 */
export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const value: LayoutContextType = { isSidebarCollapsed, toggleSidebar };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
