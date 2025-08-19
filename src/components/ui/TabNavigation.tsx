import React from 'react';

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
 * It manages the visual state of active and disabled tabs.
 *
 * @example
 * const [currentTab, setCurrentTab] = useState('profile');
 * const TABS = [
 *   { id: 'profile', label: 'Profile' },
 *   { id: 'settings', label: 'Settings' },
 *   { id: 'billing', label: 'Billing', disabled: true },
 * ];
 *
 * <TabNavigation
 *   tabs={TABS}
 *   activeTab={currentTab}
 *   onTabChange={setCurrentTab}
 * />
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 mb-6 justify-center flex-wrap ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          disabled={tab.disabled}
          className={`px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow focus:ring-blue-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
          } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
