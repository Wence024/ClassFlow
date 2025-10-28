/**
 * @file The main application header with sidebar toggle control.
 * Provides application branding, navigation controls, and user actions.
 */
import { Link } from 'react-router-dom';
import { PanelLeftClose, Menu } from 'lucide-react';
import UserAvatar from './UserAvatar';
import RequestNotifications from './RequestNotifications';
import PendingRequestsNotification from './PendingRequestsNotification';
import PendingRequestsPanel from './PendingRequestsPanel';
import { Button } from './ui/button';
import { useLayout } from '../contexts/hooks/useLayout';

/**
 * Renders the main application header.
 *
 * Includes the sidebar toggle button, application title, notifications,
 * and user avatar. The toggle button controls the sidebar collapse state
 * via the LayoutContext.
 *
 * @returns The rendered header component.
 */
const Header = () => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();

  return (
    <header role="banner" className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <Link to="/scheduler" className="text-xl font-bold text-gray-900">
              ClassFlow
            </Link>
            <h2 className="text-lg font-semibold text-gray-700">Timeline Matrix</h2>
          </div>
          <div className="flex items-center gap-4">
            <PendingRequestsPanel />
            <PendingRequestsNotification />
            <RequestNotifications />
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
