/**
 * @file A simple, static header component for the application layout.
 * This component is purely presentational.
 */
import { LogOut } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Link } from 'react-router-dom';

/**
 * Renders the main application header.
 *
 * Includes the application title, user information, and a logout button.
 * The logout functionality is provided by the `useAuth` hook.
 *
 * @returns The rendered header component.
 */
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to="/timetable" className="text-xl font-bold text-gray-900">
              ClassFlow
            </Link>
            <h2 className="text-lg font-semibold text-gray-700">Timeline Matrix</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
