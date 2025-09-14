import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Notification } from './components/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/reactQueryClient';
import { AuthRoutes } from './routes/AuthRoutes';
import { ScheduleLessonsRoutes } from './routes/scheduleLessonsRoutes';
import { AuthProvider } from './features/auth/contexts/AuthProvider';
import { useAuth } from './features/auth/hooks/useAuth';

/**
 * A component that acts as the application's entry-point guard.
 *
 * It checks the user's authentication status and redirects them to the
 * appropriate page: the main application for authenticated users or the
 * login page for guests. It also displays a loading indicator during the
 * initial authentication check.
 *
 * @returns A redirect component or a loading indicator.
 */
const HomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  // If logged in, go to the main app; otherwise, go to login.
  return user ? <Navigate to="/class-sessions" replace /> : <Navigate to="/login" replace />;
};

/**
 * The root component of the application.
 *
 * Its primary responsibility is to set up the top-level context providers
 * (QueryClient, Browser Router, Auth) and define the global routing structure.
 * It does not contain any visual layout itself.
 *
 * @returns The main application component with all providers and routes.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Notification />
          {/* The old <NavBar /> is gone from here. Layout is now handled inside the routes. */}
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* All public authentication routes (Login, Register, etc.) */}
            {AuthRoutes}

            {/* All private routes that will use the new AppLayout */}
            {ScheduleLessonsRoutes}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
