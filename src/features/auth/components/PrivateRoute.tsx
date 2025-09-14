import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../../../components/ui';

/**
 * Props for the PrivateRoute component.
 */
interface PrivateRouteProps {
  /** The component to render if the user is authenticated. */
  children: React.ReactElement;
}

/**
 * A route guard component that ensures a user is authenticated before rendering its children.
 * While checking authentication status, it displays a loading indicator.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @param p The component props.
 * @param p.children The component to render if the user is authenticated.
 * @returns The child component if authenticated, a redirect, or a loading screen.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
}: PrivateRouteProps): React.ReactElement => {
  const { user, loading } = useAuth();

  // Show a full-screen loader while the authentication state is being determined.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="Authenticating..." size="lg" />
      </div>
    );
  }

  // If loading is complete and there is no user, redirect to the login page.
  // The `replace` prop prevents the user from navigating back to the private route.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the requested child component.
  return children;
};

export default PrivateRoute;
