/**
 * @file A docked, collapsible sidebar component for application navigation.
 * Provides role-based navigation with icon-only mode and hover tooltips when collapsed.
 */
import { LayoutGrid, BookOpenCheck, Settings, Blocks, Building2, Users, Search, Send } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useLayout } from '../contexts/LayoutContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';

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
 * Renders a role-aware docked sidebar for navigation.
 *
 * Displays navigation links based on user role. When collapsed, shows only icons
 * with tooltips on hover. The sidebar is permanently docked to the left side of
 * the application and transitions smoothly between expanded and collapsed states.
 *
 * @returns The rendered sidebar component with navigation links tailored to the user's permissions.
 */
const Sidebar = () => {
  const { isAdmin, isDepartmentHead, isProgramHead } = useAuth();
  const { isSidebarCollapsed } = useLayout();

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
    <aside
      role="complementary"
      aria-label="Main navigation"
      className={cn(
        'bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300',
        isSidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <nav className="p-4 space-y-1" aria-label="Primary navigation">
        <TooltipProvider delayDuration={0}>
          {navLinks.map((link) => (
            <Tooltip key={link.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      'transition-all duration-300 whitespace-nowrap',
                      isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                    )}
                  >
                    {link.label}
                  </span>
                </NavLink>
              </TooltipTrigger>
              {isSidebarCollapsed && (
                <TooltipContent side="right">
                  <p>{link.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;
