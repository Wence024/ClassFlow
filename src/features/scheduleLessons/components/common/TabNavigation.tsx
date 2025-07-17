import React from 'react';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

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
          } ${
            tab.disabled
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
