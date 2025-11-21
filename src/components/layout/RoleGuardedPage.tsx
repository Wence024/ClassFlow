import React from 'react';
import RoleGuard from '../../features/shared/auth/components/RoleGuard';

interface RoleGuardedPageProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
  requiresDeptHead?: boolean;
  requiresProgramHead?: boolean;
}

/**
 * A wrapper component that applies role-based guards to page components.
 *
 * @param rgp - The component props.
 * @param rgp.children - The page component to render.
 * @param rgp.requiresAdmin - Whether admin role is required.
 * @param rgp.requiresDeptHead - Whether department head role is required.
 * @param rgp.requiresProgramHead - Whether program head role is required.
 * @returns The guarded page component.
 */
const RoleGuardedPage: React.FC<RoleGuardedPageProps> = ({ 
  children, 
  requiresAdmin, 
  requiresDeptHead,
  requiresProgramHead
}) => {
  return (
    <RoleGuard
      requiresAdmin={requiresAdmin}
      requiresDeptHead={requiresDeptHead}
      requiresProgramHead={requiresProgramHead}
    >
      {children}
    </RoleGuard>
  );
};

export default RoleGuardedPage;
