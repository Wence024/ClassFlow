import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Import Outlet
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../../../components/ui';

/**
 * A route guard that protects a set of child routes.
 * It checks for an authenticated user and renders the child routes via an <Outlet />.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @returns An <Outlet /> for child routes if authenticated, a redirect, or a loading screen.
 */
const PrivateRoute: React.FC = (): React.ReactElement => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="Authenticating..." size="lg" />
      </div>
    );
  }

  // If loading is complete and no user, redirect.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the nested child routes.
  return <Outlet />;
};

export default PrivateRoute;
