import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  requiresAdmin?: boolean;
  requiresDeptHead?: boolean;
  requiresProgramHead?: boolean;
}

/**
 * A component guard that enforces role-based access control.
 * Redirects users who don't have the required role to an appropriate page.
 *
 * @param rg - The component props.
 * @param rg.children - The child components to render if access is granted.
 * @param rg.requiresAdmin - Whether admin role is required.
 * @param rg.requiresDeptHead - Whether department head role is required.
 * @param rg.requiresProgramHead - Whether program head role is required.
 * @returns The children if authorized, otherwise redirects.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiresAdmin,
  requiresDeptHead,
  requiresProgramHead,
}) => {
  const { user, loading, isAdmin, isDepartmentHead, isProgramHead } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="Checking permissions..." size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiresAdmin && !isAdmin()) {
    return <Navigate to="/scheduler" replace />;
  }

  if (requiresDeptHead && !isDepartmentHead()) {
    return <Navigate to="/scheduler" replace />;
  }

  if (requiresProgramHead && !isProgramHead()) {
    return <Navigate to="/scheduler" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
