import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * A route wrapper that redirects authenticated users away from public-only pages.
 *
 * Used for pages like login/signup where authenticated users should not access.
 * Redirects based on user role to their appropriate dashboard.
 *
 * @param props The component props.
 * @param props.children The child elements to render if the user is not authenticated.
 * @returns The child components if the user is not authenticated, otherwise a redirect.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuth();

  // Only redirect if user is authenticated (don't check loading state)
  // The child components handle their own loading states
  if (user) {
    // Redirect authenticated users based on their role
    if (user.role === 'admin') {
      return <Navigate to="/departments" replace />;
    } else if (user.role === 'department_head') {
      return <Navigate to="/department-head" replace />;
    } else {
      return <Navigate to="/scheduler" replace />;
    }
  }

  return <>{children}</>;
};
