/**
 * @file A static sidebar component for application navigation.
 * This component is purely presentational.
 */
import { LayoutGrid, BookOpenCheck, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

/** An array defining the navigation links for the sidebar. */
const navLinks = [
  { to: '/class-sessions', icon: BookOpenCheck, label: 'Manage Classes' },
  { to: '/timetable', icon: LayoutGrid, label: 'Timetable' },
  { to: '/schedule-config', icon: Settings, label: 'Settings' },
];

// TODO: Move Sidebar to app component

/**
 * Renders the main application sidebar for navigation between pages.
 * Uses `NavLink` from `react-router-dom` to provide active link styling.
 *
 * @returns The rendered sidebar component.
 */
const Sidebar = () => (
  <aside className="w-64 flex-shrink-0">
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
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  </aside>
);

export default Sidebar;
