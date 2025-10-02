/**
 * @file A static sidebar component for application navigation.
 * This component is purely presentational.
 */
import { LayoutGrid, BookOpenCheck, Settings, Blocks, Building2, Users, Search, Send } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth'; // Step 1: Import useAuth

/** An array defining the base navigation links for all users. */
const baseNavLinks = [
  { to: '/component-management', icon: Blocks, label: 'Manage Class Components' },
  { to: '/class-sessions', icon: BookOpenCheck, label: 'Manage Classes' },
  { to: '/scheduler', icon: LayoutGrid, label: 'Timetable' },
];

/** An array defining the navigation links for admin users only. */
const adminNavLinks = [
  { to: '/departments', icon: Building2, label: 'Departments' },
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
 * Renders a role-aware main application sidebar for navigation.
 *
 * This component displays a set of base navigation links for all authenticated users.
 * It dynamically adds administrator-specific links (e.g., to the "Settings" page)
 * by checking the current user's role via the `useAuth` hook.
 *
 * @returns The rendered sidebar component with navigation links tailored to the user's permissions.
 */
const Sidebar = () => {
  const { user, isAdmin, isDepartmentHead, isProgramHead } = useAuth();

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
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
        <nav className="space-y-1">
          {navLinks.map(
            (
              link // The rest of the component is unchanged
            ) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            )
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
