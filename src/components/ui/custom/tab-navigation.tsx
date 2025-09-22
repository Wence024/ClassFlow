import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../tabs';

/**
 * Represents the structure of a single tab.
 */
interface Tab {
  /** A unique identifier for the tab. */
  id: string;

  /** The text to display on the tab. */
  label: string;

  /** If true, the tab will be visually disabled and cannot be clicked. */
  disabled?: boolean;
}

/**
 * Props for the TabNavigation component.
 */
interface TabNavigationProps {
  /** An array of tab objects to be rendered. */
  tabs: Tab[];

  /** The `id` of the currently active tab. */
  activeTab: string;

  /** A callback function that is invoked with the `id` of the tab when it is clicked. */
  onTabChange: (tabId: string) => void;

  /** Additional CSS classes to apply to the component's root element. */
  className?: string;
}

/**
 * A component that renders a set of clickable tabs for navigation.
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;