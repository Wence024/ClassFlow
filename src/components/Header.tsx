/**
 * @file A simple, static header component for the application layout.
 * This component is purely presentational.
 */
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import RequestNotifications from './RequestNotifications';

/**
 * Renders the main application header.
 *
 * Includes the application title, user information, and a logout button.
 * The logout functionality is provided by the `useAuth` hook.
 *
 * @returns The rendered header component.
 */
const Header = () => {
  

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
            <RequestNotifications />
            <UserAvatar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
