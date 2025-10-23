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
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

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
