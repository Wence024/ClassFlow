import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../tabs';

/**
 * Represents the structure of a single tab.
 */
interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props for the TabNavigation component.
 */
interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * A component that renders a set of clickable tabs for navigation.
 *
 * @param tn The props for the TabNavigation component.
 * @param tn.tabs An array of tab objects to render. Each tab contains an `id`, `label`, and optional `disabled` state.
 * @param tn.activeTab The `id` of the currently active tab.
 * @param tn.onTabChange A callback function that is called when a tab is clicked, receiving the `tabId` as an argument.
 * @param tn.className Optional additional CSS classes to apply to the root element of the TabNavigation component.
 *
 * @returns A React component that renders a tab navigation UI with clickable tabs.
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
      <TabsList
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;
