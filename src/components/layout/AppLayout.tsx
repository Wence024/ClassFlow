import { Notification } from '../../components/ui';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar'; // We will move Sidebar here
import Header from '../Header'; // We will move Header here

/**
 * Renders the main visual shell for all authenticated pages in the application.
 *
 * This component provides the consistent layout structure, including the top `Header`,
 * the role-aware `Sidebar`, and the main content area where child routes are rendered
 * via React Router's `<Outlet />`.
 *
 * @returns The main application layout component.
 */
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Notification />
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <Sidebar />
          <main className="flex-1 space-y-6 min-w-0">
            <Outlet /> {/* This is where the actual page content will be rendered */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
