/**
 * @file A static sidebar component for application navigation.
 * This component is purely presentational.
 */
import { LayoutGrid, BookOpenCheck, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth'; // Step 1: Import useAuth

/** An array defining the base navigation links for all users. */
const baseNavLinks = [
  { to: '/class-sessions', icon: BookOpenCheck, label: 'Manage Classes' },
  { to: '/scheduler', icon: LayoutGrid, label: 'Timetable' },
];

/** An array defining the navigation links for admin users only. */
const adminNavLinks = [{ to: '/schedule-config', icon: Settings, label: 'Settings' }];

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
  const { user } = useAuth(); // Step 2: Get user role
  const isAdmin = user?.role === 'admin';

  // Step 3: Conditionally combine the link arrays
  const navLinks = isAdmin ? [...baseNavLinks, ...adminNavLinks] : baseNavLinks;

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
