import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { LayoutProvider } from '../../contexts/LayoutContext';

/**
 * Renders the main visual shell for all authenticated pages in the application.
 *
 * Provides a consistent layout with a fixed header, docked sidebar, and flexible
 * main content area. The layout responds to sidebar state changes, adjusting the
 * main content area's position smoothly via transitions.
 *
 * @returns The main application layout component.
 */
const AppLayout = () => {
  return (
    <LayoutProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6" role="main">
            <h1 className="sr-only">Main Content</h1>
            <div className="container mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
};

export default AppLayout;
