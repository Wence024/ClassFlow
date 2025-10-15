/**
 * @file A collapsible sidebar component for application navigation.
 * This component provides role-based navigation with collapse/expand functionality.
 */
import { LayoutGrid, BookOpenCheck, Settings, Blocks, Building2, Users, Search, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useLayout } from '../contexts/LayoutContext';
import { Button } from './ui/button/button';

/** An array defining the base navigation links for all users. */
const baseNavLinks = [
  { to: '/component-management', icon: Blocks, label: 'Manage Class Components' },
  { to: '/class-sessions', icon: BookOpenCheck, label: 'Manage Classes' },
  { to: '/scheduler', icon: LayoutGrid, label: 'Timetable' },
];

/** An array defining the navigation links for admin users only. */
const adminNavLinks = [
  { to: '/departments', icon: Building2, label: 'Departments' },
  { to: '/programs', icon: Blocks, label: 'Programs' },
  { to: '/user-management', icon: Users, label: 'User Management' },
  { to: '/schedule-configuration', icon: Settings, label: 'Settings' },
];

/** An array defining the navigation links for department heads. */
const departmentHeadNavLinks = [
  { to: '/dept-head', icon: Users, label: 'Department Dashboard' },
];

/** An array defining the navigation links for program heads. */
const programHeadNavLinks = [
  { to: '/browse/instructors', icon: Search, label: 'Browse Instructors' },
  { to: '/requests/instructor', icon: Send, label: 'Request Instructor' },
];
/**
 * Renders a role-aware collapsible sidebar for navigation.
 *
 * This component displays navigation links based on user role and can be collapsed
 * to provide more horizontal space for content. The collapse state is managed via
 * the LayoutContext.
 *
 * @returns The rendered sidebar component with navigation links tailored to the user's permissions.
 */
const Sidebar = () => {
  const { isAdmin, isDepartmentHead, isProgramHead } = useAuth();
  const { isSidebarCollapsed, toggleSidebar } = useLayout();

  // Build navigation links based on user role
  let navLinks = [...baseNavLinks];
  
  if (isAdmin()) {
    navLinks = [...navLinks, ...adminNavLinks];
  }
  
  if (isDepartmentHead()) {
    navLinks = [...navLinks, ...departmentHeadNavLinks];
  }
  
  if (isProgramHead()) {
    navLinks = [...navLinks, ...programHeadNavLinks];
  }

  return (
    <aside className={`flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              title={isSidebarCollapsed ? link.label : undefined}
            >
              <link.icon className="w-4 h-4 flex-shrink-0" />
              <span className={`transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {link.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
